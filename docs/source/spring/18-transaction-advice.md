---
sidebar: heading
title: Spring源码分析
category: 源码分析
tag:
  - Spring
head:
  - - meta
    - name: keywords
      content: Spring源码,标签解析,源码分析,代理,事物增强器,声明式事物,Spring设计模式,Spring AOP,Spring IOC,Bean,Bean生命周期
  - - meta
    - name: description
      content: 高质量的Spring源码分析总结
---

**正文**

上一篇文章我们讲解了事务的Advisor是如何注册进Spring容器的，也讲解了Spring是如何将有配置事务的类配置上事务的，实际上也就是用了AOP那一套，也讲解了Advisor，pointcut验证流程，至此，事务的初始化工作都已经完成了，在之后的调用过程，如果代理类的方法被调用，都会调用BeanFactoryTransactionAttributeSourceAdvisor这个Advisor的增强方法，也就是我们还未提到的那个Advisor里面的advise，还记得吗，在自定义标签的时候我们将TransactionInterceptor这个Advice作为bean注册进IOC容器，并且将其注入进Advisor中，这个Advice在代理类的invoke方法中会被封装到拦截器链中，最终事务的功能都在advise中体现，所以我们先来关注一下TransactionInterceptor这个类吧。[最全面的Java面试网站](https://topjavaer.cn)

TransactionInterceptor类继承自MethodInterceptor，所以调用该类是从其invoke方法开始的，首先预览下这个方法：

```java
@Override
@Nullable
public Object invoke(final MethodInvocation invocation) throws Throwable {
    // Work out the target class: may be {@code null}.
    // The TransactionAttributeSource should be passed the target class
    // as well as the method, which may be from an interface.
    Class<?> targetClass = (invocation.getThis() != null ? AopUtils.getTargetClass(invocation.getThis()) : null);

    // Adapt to TransactionAspectSupport's invokeWithinTransaction...
    return invokeWithinTransaction(invocation.getMethod(), targetClass, invocation::proceed);
}
```

重点来了，进入invokeWithinTransaction方法：

```java
@Nullable
protected Object invokeWithinTransaction(Method method, @Nullable Class<?> targetClass,
        final InvocationCallback invocation) throws Throwable {

    // If the transaction attribute is null, the method is non-transactional.
    TransactionAttributeSource tas = getTransactionAttributeSource();
    // 获取对应事务属性
    final TransactionAttribute txAttr = (tas != null ? tas.getTransactionAttribute(method, targetClass) : null);
    // 获取beanFactory中的transactionManager
    final PlatformTransactionManager tm = determineTransactionManager(txAttr);
    // 构造方法唯一标识（类.方法，如：service.UserServiceImpl.save）
    final String joinpointIdentification = methodIdentification(method, targetClass, txAttr);

    // 声明式事务处理
    if (txAttr == null || !(tm instanceof CallbackPreferringPlatformTransactionManager)) {
        // 创建TransactionInfo
        TransactionInfo txInfo = createTransactionIfNecessary(tm, txAttr, joinpointIdentification);
        Object retVal = null;
        try {
            // 执行原方法
            // 继续调用方法拦截器链,这里一般将会调用目标类的方法,如:AccountServiceImpl.save方法
            retVal = invocation.proceedWithInvocation();
        }
        catch (Throwable ex) {
            // 异常回滚
            completeTransactionAfterThrowing(txInfo, ex);
            // 手动向上抛出异常，则下面的提交事务不会执行
            // 如果子事务出异常，则外层事务代码需catch住子事务代码，不然外层事务也会回滚
            throw ex;
        }
        finally {
            // 消除信息
            cleanupTransactionInfo(txInfo);
        }
        // 提交事务
        commitTransactionAfterReturning(txInfo);
        return retVal;
    }

    else {
        final ThrowableHolder throwableHolder = new ThrowableHolder();
        try {
            // 编程式事务处理
            Object result = ((CallbackPreferringPlatformTransactionManager) tm).execute(txAttr, status -> {
                TransactionInfo txInfo = prepareTransactionInfo(tm, txAttr, joinpointIdentification, status);
                try {
                    return invocation.proceedWithInvocation();
                }
                catch (Throwable ex) {
                    if (txAttr.rollbackOn(ex)) {
                        // A RuntimeException: will lead to a rollback.
                        if (ex instanceof RuntimeException) {
                            throw (RuntimeException) ex;
                        }
                        else {
                            throw new ThrowableHolderException(ex);
                        }
                    }
                    else {
                        // A normal return value: will lead to a commit.
                        throwableHolder.throwable = ex;
                        return null;
                    }
                }
                finally {
                    cleanupTransactionInfo(txInfo);
                }
            });

            // Check result state: It might indicate a Throwable to rethrow.
            if (throwableHolder.throwable != null) {
                throw throwableHolder.throwable;
            }
            return result;
        }
        catch (ThrowableHolderException ex) {
            throw ex.getCause();
        }
        catch (TransactionSystemException ex2) {
            if (throwableHolder.throwable != null) {
                logger.error("Application exception overridden by commit exception", throwableHolder.throwable);
                ex2.initApplicationException(throwableHolder.throwable);
            }
            throw ex2;
        }
        catch (Throwable ex2) {
            if (throwableHolder.throwable != null) {
                logger.error("Application exception overridden by commit exception", throwableHolder.throwable);
            }
            throw ex2;
        }
    }
}
```

## 创建事务Info对象

我们先分析事务创建的过程。

```java
protected TransactionInfo createTransactionIfNecessary(@Nullable PlatformTransactionManager tm,
        @Nullable TransactionAttribute txAttr, final String joinpointIdentification) {

    // If no name specified, apply method identification as transaction name.
    // 如果没有名称指定则使用方法唯一标识，并使用DelegatingTransactionAttribute封装txAttr
    if (txAttr != null && txAttr.getName() == null) {
        txAttr = new DelegatingTransactionAttribute(txAttr) {
            @Override
            public String getName() {
                return joinpointIdentification;
            }
        };
    }

    TransactionStatus status = null;
    if (txAttr != null) {
        if (tm != null) {
            // 获取TransactionStatus
            status = tm.getTransaction(txAttr);
        }
        else {
            if (logger.isDebugEnabled()) {
                logger.debug("Skipping transactional joinpoint [" + joinpointIdentification +
                        "] because no transaction manager has been configured");
            }
        }
    }
    // 根据指定的属性与status准备一个TransactionInfo
    return prepareTransactionInfo(tm, txAttr, joinpointIdentification, status);
}
```

对于createTransactionlfNecessary函数主要做了这样几件事情。

（1）使用 DelegatingTransactionAttribute 封装传入的 TransactionAttribute 实例。

对于传入的TransactionAttribute类型的参数txAttr，当前的实际类型是RuleBasedTransactionAttribute，是由获取事务属性时生成，主要用于数据承载，而这里之所以使用DelegatingTransactionAttribute进行封装，当然是提供了更多的功能。

（2）获取事务。

事务处理当然是以事务为核心，那么获取事务就是最重要的事情。

（3）构建事务信息。

根据之前几个步骤获取的信息构建Transactionlnfo并返回。

> 分享一份大彬精心整理的**大厂面试手册**，包含**计算机基础、Java基础、多线程、JVM、数据库、Redis、Spring、Mybatis、SpringMVC、SpringBoot、分布式、微服务、设计模式、架构、校招社招分享**等高频面试题，非常实用，有小伙伴靠着这份手册拿过字节offer~
>
> ![](http://img.topjavaer.cn/image/image-20211127150136157.png)
>
> ![](http://img.topjavaer.cn/image/image-20220316234337881.png)
>
> 需要的小伙伴可以自行**下载**：
>
> http://mp.weixin.qq.com/s?__biz=Mzg2OTY1NzY0MQ==&mid=2247485445&idx=1&sn=1c6e224b9bb3da457f5ee03894493dbc&chksm=ce98f543f9ef7c55325e3bf336607a370935a6c78dbb68cf86e59f5d68f4c51d175365a189f8#rd

### 获取事务

其中核心是在getTransaction方法中：

```java
@Override
public final TransactionStatus getTransaction(@Nullable TransactionDefinition definition) throws TransactionException {
    // 获取一个transaction
    Object transaction = doGetTransaction();

    boolean debugEnabled = logger.isDebugEnabled();

    if (definition == null) {
        definition = new DefaultTransactionDefinition();
    }
    // 如果在这之前已经存在事务了，就进入存在事务的方法中
    if (isExistingTransaction(transaction)) {
        return handleExistingTransaction(definition, transaction, debugEnabled);
    }
    
    // 事务超时设置验证
    if (definition.getTimeout() < TransactionDefinition.TIMEOUT_DEFAULT) {
        throw new InvalidTimeoutException("Invalid transaction timeout", definition.getTimeout());
    }

    // 走到这里说明此时没有存在事务，如果传播特性是MANDATORY时抛出异常
    if (definition.getPropagationBehavior() == TransactionDefinition.PROPAGATION_MANDATORY) {
        throw new IllegalTransactionStateException(
                "No existing transaction found for transaction marked with propagation 'mandatory'");
    }
    // 如果此时不存在事务，当传播特性是REQUIRED或NEW或NESTED都会进入if语句块
    else if (definition.getPropagationBehavior() == TransactionDefinition.PROPAGATION_REQUIRED ||
            definition.getPropagationBehavior() == TransactionDefinition.PROPAGATION_REQUIRES_NEW ||
            definition.getPropagationBehavior() == TransactionDefinition.PROPAGATION_NESTED) {
        // PROPAGATION_REQUIRED、PROPAGATION_REQUIRES_NEW、PROPAGATION_NESTED都需要新建事务
        // 因为此时不存在事务，将null挂起
        SuspendedResourcesHolder suspendedResources = suspend(null);
        if (debugEnabled) {
            logger.debug("Creating new transaction with name [" + definition.getName() + "]: " + definition);
        }
        try {
            boolean newSynchronization = (getTransactionSynchronization() != SYNCHRONIZATION_NEVER);
            // new一个status，存放刚刚创建的transaction，然后将其标记为新事务！
            // 这里transaction后面一个参数决定是否是新事务！
            DefaultTransactionStatus status = newTransactionStatus(
                    definition, transaction, true, newSynchronization, debugEnabled, suspendedResources);
            // 新开一个连接的地方，非常重要
            doBegin(transaction, definition);
            prepareSynchronization(status, definition);
            return status;
        }
        catch (RuntimeException | Error ex) {
            resume(null, suspendedResources);
            throw ex;
        }
    }
    else {
        // Create "empty" transaction: no actual transaction, but potentially synchronization.
        if (definition.getIsolationLevel() != TransactionDefinition.ISOLATION_DEFAULT && logger.isWarnEnabled()) {
            logger.warn("Custom isolation level specified but no actual transaction initiated; " +
                    "isolation level will effectively be ignored: " + definition);
        }
        // 其他的传播特性一律返回一个空事务，transaction = null
        //当前不存在事务，且传播机制=PROPAGATION_SUPPORTS/PROPAGATION_NOT_SUPPORTED/PROPAGATION_NEVER，这三种情况，创建“空”事务
        boolean newSynchronization = (getTransactionSynchronization() == SYNCHRONIZATION_ALWAYS);
        return prepareTransactionStatus(definition, null, true, newSynchronization, debugEnabled, null);
    }
}
```

先来看看transaction是如何被创建出来的：

```java
@Override
protected Object doGetTransaction() {
    // 这里DataSourceTransactionObject是事务管理器的一个内部类
    // DataSourceTransactionObject就是一个transaction，这里new了一个出来
    DataSourceTransactionObject txObject = new DataSourceTransactionObject();
    txObject.setSavepointAllowed(isNestedTransactionAllowed());
    // 解绑与绑定的作用在此时体现，如果当前线程有绑定的话，将会取出holder
    // 第一次conHolder肯定是null
    ConnectionHolder conHolder =
    (ConnectionHolder) TransactionSynchronizationManager.getResource(obtainDataSource());
    // 此时的holder被标记成一个旧holder
    txObject.setConnectionHolder(conHolder, false);
    return txObject;
}
```

创建transaction过程很简单，接着就会判断当前是否存在事务：

```java
@Override
protected boolean isExistingTransaction(Object transaction) {
    DataSourceTransactionObject txObject = (DataSourceTransactionObject) transaction;
    return (txObject.hasConnectionHolder() && txObject.getConnectionHolder().isTransactionActive());
}

public boolean hasConnectionHolder() {
    return (this.connectionHolder != null);
}
```

这里判断是否存在事务的依据主要是获取holder中的transactionActive变量是否为true，如果是第一次进入事务，holder直接为null判断不存在了，如果是第二次进入事务transactionActive变量是为true的（后面会提到是在哪里把它变成true的），由此来判断当前是否已经存在事务了。

至此，源码分成了2条处理线：

**1.当前已存在事务：isExistingTransaction()判断是否存在事务，存在事务handleExistingTransaction()根据不同传播机制不同处理**

**2.当前不存在事务: 不同传播机制不同处理**



## 当前不存在事务

如果不存在事务，传播特性又是REQUIRED或NEW或NESTED，将会先挂起null，这个挂起方法我们后面再讲，然后创建一个DefaultTransactionStatus ，并将其标记为新事务，然后执行doBegin(transaction, definition);这个方法也是一个关键方法

### 神秘又关键的status对象

**TransactionStatus接口**

```java
public interface TransactionStatus extends SavepointManager, Flushable {
    // 返回当前事务是否为新事务（否则将参与到现有事务中，或者可能一开始就不在实际事务中运行）
    boolean isNewTransaction();
    // 返回该事务是否在内部携带保存点，也就是说，已经创建为基于保存点的嵌套事务。
    boolean hasSavepoint();
    // 设置事务仅回滚。
    void setRollbackOnly();
    // 返回事务是否已标记为仅回滚
    boolean isRollbackOnly();
    // 将会话刷新到数据存储区
    @Override
    void flush();
    // 返回事物是否已经完成，无论提交或者回滚。
    boolean isCompleted();
}
```

再来看看实现类DefaultTransactionStatus

**DefaultTransactionStatus**

```java
public class DefaultTransactionStatus extends AbstractTransactionStatus {

    //事务对象
    @Nullable
    private final Object transaction;

    //事务对象
    private final boolean newTransaction;

    private final boolean newSynchronization;

    private final boolean readOnly;

    private final boolean debug;

    //事务对象
    @Nullable
    private final Object suspendedResources;
    
        public DefaultTransactionStatus(
            @Nullable Object transaction, boolean newTransaction, boolean newSynchronization,
            boolean readOnly, boolean debug, @Nullable Object suspendedResources) {

        this.transaction = transaction;
        this.newTransaction = newTransaction;
        this.newSynchronization = newSynchronization;
        this.readOnly = readOnly;
        this.debug = debug;
        this.suspendedResources = suspendedResources;
    }
    
    //略...
}
```

我们看看这行代码 DefaultTransactionStatus status = **newTransactionStatus**( definition, **transaction, true**, newSynchronization, debugEnabled, **suspendedResources**);

```java
// 这里是构造一个status对象的方法
protected DefaultTransactionStatus newTransactionStatus(
    TransactionDefinition definition, @Nullable Object transaction, boolean newTransaction,
    boolean newSynchronization, boolean debug, @Nullable Object suspendedResources) {

    boolean actualNewSynchronization = newSynchronization &&
        !TransactionSynchronizationManager.isSynchronizationActive();
    return new DefaultTransactionStatus(
        transaction, newTransaction, actualNewSynchronization,
        definition.isReadOnly(), debug, suspendedResources);
}
```

实际上就是封装了事务属性definition，新创建的**transaction，**并且将事务状态属性设置为新事务，最后一个参数为被挂起的事务。

简单了解一下关键参数即可：

第二个参数transaction：事务对象，在一开头就有创建，其就是事务管理器的一个内部类。

第三个参数newTransaction：布尔值，一个标识，用于判断是否是新的事务，用于提交或者回滚方法中，是新的才会提交或者回滚。

最后一个参数suspendedResources：被挂起的对象资源，挂起操作会返回旧的holder，将其与一些事务属性一起封装成一个对象，就是这个suspendedResources这个对象了，它会放在status中，在最后的清理工作方法中判断status中是否有这个挂起对象，如果有会恢复它

接着我们来看看关键代码 **doBegin(transaction, definition);**

```java
 @Override
 protected void doBegin(Object transaction, TransactionDefinition definition) {
     DataSourceTransactionObject txObject = (DataSourceTransactionObject) transaction;
     Connection con = null;
 
     try {
         // 判断如果transaction没有holder的话，才去从dataSource中获取一个新连接
         if (!txObject.hasConnectionHolder() ||
                 txObject.getConnectionHolder().isSynchronizedWithTransaction()) {
             //通过dataSource获取连接
             Connection newCon = this.dataSource.getConnection();
             if (logger.isDebugEnabled()) {
                 logger.debug("Acquired Connection [" + newCon + "] for JDBC transaction");
             }
             // 所以，只有transaction中的holder为空时，才会设置为新holder
             // 将获取的连接封装进ConnectionHolder，然后封装进transaction的connectionHolder属性
             txObject.setConnectionHolder(new ConnectionHolder(newCon), true);
         }
 　　　　　//设置新的连接为事务同步中
         txObject.getConnectionHolder().setSynchronizedWithTransaction(true);
         con = txObject.getConnectionHolder().getConnection();
 　　　　 //conn设置事务隔离级别,只读
         Integer previousIsolationLevel = DataSourceUtils.prepareConnectionForTransaction(con, definition);
         txObject.setPreviousIsolationLevel(previousIsolationLevel);//DataSourceTransactionObject设置事务隔离级别
 
         // 如果是自动提交切换到手动提交
         if (con.getAutoCommit()) {
             txObject.setMustRestoreAutoCommit(true);
             if (logger.isDebugEnabled()) {
                 logger.debug("Switching JDBC Connection [" + con + "] to manual commit");
             }
             con.setAutoCommit(false);
         }
 　　　　　// 如果只读，执行sql设置事务只读
         prepareTransactionalConnection(con, definition);
         // 设置connection持有者的事务开启状态
         txObject.getConnectionHolder().setTransactionActive(true);
 
         int timeout = determineTimeout(definition);
         if (timeout != TransactionDefinition.TIMEOUT_DEFAULT) {
             // 设置超时秒数
             txObject.getConnectionHolder().setTimeoutInSeconds(timeout);
         }
 
         // 将当前获取到的连接绑定到当前线程
         if (txObject.isNewConnectionHolder()) {
             TransactionSynchronizationManager.bindResource(getDataSource(), txObject.getConnectionHolder());
         }
     }catch (Throwable ex) {
         if (txObject.isNewConnectionHolder()) {
             DataSourceUtils.releaseConnection(con, this.dataSource);
             txObject.setConnectionHolder(null, false);
         }
         throw new CannotCreateTransactionException("Could not open JDBC Connection for transaction", ex);
     }
 }
```

conn设置事务隔离级别

```java
@Nullable
public static Integer prepareConnectionForTransaction(Connection con, @Nullable TransactionDefinition definition)
        throws SQLException {

    Assert.notNull(con, "No Connection specified");

    // Set read-only flag.
    // 设置数据连接的只读标识
    if (definition != null && definition.isReadOnly()) {
        try {
            if (logger.isDebugEnabled()) {
                logger.debug("Setting JDBC Connection [" + con + "] read-only");
            }
            con.setReadOnly(true);
        }
        catch (SQLException | RuntimeException ex) {
            Throwable exToCheck = ex;
            while (exToCheck != null) {
                if (exToCheck.getClass().getSimpleName().contains("Timeout")) {
                    // Assume it's a connection timeout that would otherwise get lost: e.g. from JDBC 4.0
                    throw ex;
                }
                exToCheck = exToCheck.getCause();
            }
            // "read-only not supported" SQLException -> ignore, it's just a hint anyway
            logger.debug("Could not set JDBC Connection read-only", ex);
        }
    }

    // Apply specific isolation level, if any.
    // 设置数据库连接的隔离级别
    Integer previousIsolationLevel = null;
    if (definition != null && definition.getIsolationLevel() != TransactionDefinition.ISOLATION_DEFAULT) {
        if (logger.isDebugEnabled()) {
            logger.debug("Changing isolation level of JDBC Connection [" + con + "] to " +
                    definition.getIsolationLevel());
        }
        int currentIsolation = con.getTransactionIsolation();
        if (currentIsolation != definition.getIsolationLevel()) {
            previousIsolationLevel = currentIsolation;
            con.setTransactionIsolation(definition.getIsolationLevel());
        }
    }

    return previousIsolationLevel;
}
```

我们看到都是通过 Connection 去设置

#### 线程变量的绑定

我们看 doBegin 方法的47行，**将当前获取到的连接绑定到当前线程，**绑定与解绑围绕一个线程变量，此变量在**`TransactionSynchronizationManager`**类中：

```java
private static final ThreadLocal<Map<Object, Object>> resources =  new NamedThreadLocal<>("Transactional resources");
```

 这是一个 **static final** 修饰的 线程变量，存储的是一个Map，我们来看看47行的静态方法，**bindResource**

```java
public static void bindResource(Object key, Object value) throws IllegalStateException {
    // 从上面可知，线程变量是一个Map，而这个Key就是dataSource
    // 这个value就是holder
    Object actualKey = TransactionSynchronizationUtils.unwrapResourceIfNecessary(key);
    Assert.notNull(value, "Value must not be null");
    // 获取这个线程变量Map
    Map<Object, Object> map = resources.get();
    // set ThreadLocal Map if none found
    if (map == null) {
        map = new HashMap<>();
        resources.set(map);
    }
    // 将新的holder作为value，dataSource作为key放入当前线程Map中
    Object oldValue = map.put(actualKey, value);
    // Transparently suppress a ResourceHolder that was marked as void...
    if (oldValue instanceof ResourceHolder && ((ResourceHolder) oldValue).isVoid()) {
        oldValue = null;
    }
    if (oldValue != null) {
        throw new IllegalStateException("Already value [" + oldValue + "] for key [" +
                actualKey + "] bound to thread [" + Thread.currentThread().getName() + "]");
    }    Thread.currentThread().getName() + "]");
    }
    // 略...
}
```

### 扩充知识点

这里再扩充一点，mybatis中获取的数据库连接，就是根据 **dataSource** 从ThreadLocal中获取的

以查询举例，会调用Executor#doQuery方法：

![](http://img.topjavaer.cn/img/202310031612318.png)

最终会调用DataSourceUtils#doGetConnection获取，真正的数据库连接，其中TransactionSynchronizationManager中保存的就是方法调用前，spring增强方法中绑定到线程的connection，从而保证整个事务过程中connection的一致性

![](http://img.topjavaer.cn/img/202310031612223.png)

![](http://img.topjavaer.cn/img/202310031612891.png)

 我们看看TransactionSynchronizationManager.getResource(Object key)这个方法

```java
@Nullable
public static Object getResource(Object key) {
    Object actualKey = TransactionSynchronizationUtils.unwrapResourceIfNecessary(key);
    Object value = doGetResource(actualKey);
    if (value != null && logger.isTraceEnabled()) {
        logger.trace("Retrieved value [" + value + "] for key [" + actualKey + "] bound to thread [" +
                Thread.currentThread().getName() + "]");
    }
    return value;
}

    @Nullable
private static Object doGetResource(Object actualKey) {
    Map<Object, Object> map = resources.get();
    if (map == null) {
        return null;
    }
    Object value = map.get(actualKey);
    // Transparently remove ResourceHolder that was marked as void...
    if (value instanceof ResourceHolder && ((ResourceHolder) value).isVoid()) {
        map.remove(actualKey);
        // Remove entire ThreadLocal if empty...
        if (map.isEmpty()) {
            resources.remove();
        }
        value = null;
    }
    return value;
}
```

**就是从线程变量的Map中根据** **DataSource获取** **ConnectionHolder**

## 已经存在的事务

前面已经提到，第一次事务开始时必会新创一个holder然后做绑定操作，此时线程变量是有holder的且avtive为true，如果第二个事务进来，去new一个transaction之后去线程变量中取holder，holder是不为空的且active是为true的，所以会进入handleExistingTransaction方法：

```java
 private TransactionStatus handleExistingTransaction(
         TransactionDefinition definition, Object transaction, boolean debugEnabled)
         throws TransactionException {
 　　 // 1.NERVER（不支持当前事务;如果当前事务存在，抛出异常）报错
     if (definition.getPropagationBehavior() == TransactionDefinition.PROPAGATION_NEVER) {
         throw new IllegalTransactionStateException(
                 "Existing transaction found for transaction marked with propagation 'never'");
     }
 　　 // 2.NOT_SUPPORTED（不支持当前事务，现有同步将被挂起）挂起当前事务,返回一个空事务
     if (definition.getPropagationBehavior() == TransactionDefinition.PROPAGATION_NOT_SUPPORTED) {
         if (debugEnabled) {
             logger.debug("Suspending current transaction");
         }
         // 这里会将原来的事务挂起,并返回被挂起的对象
         Object suspendedResources = suspend(transaction);
         boolean newSynchronization = (getTransactionSynchronization() == SYNCHRONIZATION_ALWAYS);
         // 这里可以看到，第二个参数transaction传了一个空事务，第三个参数false为旧标记
         // 最后一个参数就是将前面挂起的对象封装进新的Status中，当前事务执行完后，就恢复suspendedResources
         return prepareTransactionStatus(definition, null, false, newSynchronization, debugEnabled, suspendedResources);
     }
 　　 // 3.REQUIRES_NEW挂起当前事务，创建新事务
     if (definition.getPropagationBehavior() == TransactionDefinition.PROPAGATION_REQUIRES_NEW) {
         if (debugEnabled) {
             logger.debug("Suspending current transaction, creating new transaction with name [" +
                     definition.getName() + "]");
         }
         // 将原事务挂起，此时新建事务，不与原事务有关系
         // 会将transaction中的holder设置为null，然后解绑！
         SuspendedResourcesHolder suspendedResources = suspend(transaction);
         try {
             boolean newSynchronization = (getTransactionSynchronization() != SYNCHRONIZATION_NEVER);
             // new一个status出来，传入transaction，并且为新事务标记，然后传入挂起事务
             DefaultTransactionStatus status = newTransactionStatus(definition, transaction, true, newSynchronization, debugEnabled, suspendedResources);
             // 这里也做了一次doBegin，此时的transaction中holer是为空的，因为之前的事务被挂起了
             // 所以这里会取一次新的连接，并且绑定！
             doBegin(transaction, definition);
             prepareSynchronization(status, definition);
             return status;
         }
         catch (RuntimeException beginEx) {
             resumeAfterBeginException(transaction, suspendedResources, beginEx);
             throw beginEx;
         }
         catch (Error beginErr) {
             resumeAfterBeginException(transaction, suspendedResources, beginErr);
             throw beginErr;
         }
     }
 　　// 如果此时的传播特性是NESTED，不会挂起事务
     if (definition.getPropagationBehavior() == TransactionDefinition.PROPAGATION_NESTED) {
         if (!isNestedTransactionAllowed()) {
             throw new NestedTransactionNotSupportedException(
                     "Transaction manager does not allow nested transactions by default - " +
                     "specify 'nestedTransactionAllowed' property with value 'true'");
         }
         if (debugEnabled) {
             logger.debug("Creating nested transaction with name [" + definition.getName() + "]");
         }
         // 这里如果是JTA事务管理器，就不可以用savePoint了，将不会进入此方法
         if (useSavepointForNestedTransaction()) { 
             // 这里不会挂起事务，说明NESTED的特性是原事务的子事务而已
             // new一个status，传入transaction，传入旧事务标记，传入挂起对象=null
             DefaultTransactionStatus status =prepareTransactionStatus(definition, transaction, false, false, debugEnabled, null);
             // 这里是NESTED特性特殊的地方，在先前存在事务的情况下会建立一个savePoint
             status.createAndHoldSavepoint();
             return status;
         }
         else {
             // JTA事务走这个分支，创建新事务
             boolean newSynchronization = (getTransactionSynchronization() != SYNCHRONIZATION_NEVER);
             DefaultTransactionStatus status = newTransactionStatus(
                     definition, transaction, true, newSynchronization, debugEnabled, null);
             doBegin(transaction, definition);
             prepareSynchronization(status, definition);
             return status;
         }
     }
 
     // 到这里PROPAGATION_SUPPORTS 或 PROPAGATION_REQUIRED或PROPAGATION_MANDATORY，存在事务加入事务即可，标记为旧事务，空挂起
     boolean newSynchronization = (getTransactionSynchronization() != SYNCHRONIZATION_NEVER);
     return prepareTransactionStatus(definition, transaction, false, newSynchronization, debugEnabled, null);
 }
```

对于已经存在事务的处理过程中，我们看到了很多熟悉的操作，但是，也有些不同的地方，函数中对已经存在的事务处理考虑两种情况。

（1）PROPAGATION_REQUIRES_NEW表示当前方法必须在它自己的事务里运行，一个新的事务将被启动，而如果有一个事务正在运行的话，则在这个方法运行期间被挂起。而Spring中对于此种传播方式的处理与新事务建立最大的不同点在于使用suspend方法将原事务挂起。 将信息挂起的目的当然是为了在当前事务执行完毕后在将原事务还原。

（2）PROPAGATION_NESTED表示如果当前正有一个事务在运行中，则该方法应该运行在一个嵌套的事务中，被嵌套的事务可以独立于封装事务进行提交或者回滚，如果封装事务不存在，行为就像PROPAGATION_REQUIRES_NEW。对于嵌入式事务的处理，Spring中主要考虑了两种方式的处理。

- Spring中允许嵌入事务的时候，则首选设置保存点的方式作为异常处理的回滚。
- 对于其他方式，比如JTA无法使用保存点的方式，那么处理方式与PROPAGATION_ REQUIRES_NEW相同，而一旦出现异常，则由Spring的事务异常处理机制去完成后续操作。

对于挂起操作的主要目的是记录原有事务的状态，以便于后续操作对事务的恢复



### 小结

到这里我们可以知道，在当前存在事务的情况下，根据传播特性去决定是否为新事务，是否挂起当前事务。

**NOT_SUPPORTED ：会挂起事务，不运行doBegin方法传空`transaction`，标记为旧事务。封装`status`对象：**

```java
return prepareTransactionStatus(definition, null, false, newSynchronization, debugEnabled, suspendedResources)
```

 

**REQUIRES_NEW ：将会挂起事务且运行doBegin方法，标记为新事务。封装`status`对象：**

```java
DefaultTransactionStatus status = newTransactionStatus(definition, transaction, true, newSynchronization, debugEnabled, suspendedResources);
```

**NESTED ：不会挂起事务且不会运行doBegin方法，标记为旧事务，但会创建`savePoint`。封装`status`对象：**

```java
DefaultTransactionStatus status =prepareTransactionStatus(definition, transaction, false, false, debugEnabled, null);
```

**其他事务例如REQUIRED ：不会挂起事务，封装原有的transaction不会运行doBegin方法，标记旧事务，封装`status`对象：**

```java
return prepareTransactionStatus(definition, transaction, false, newSynchronization, debugEnabled, null);
```

### 挂起

对于挂起操作的主要目的是记录原有事务的状态，以便于后续操作对事务的恢复：

```java
@Nullable
protected final SuspendedResourcesHolder suspend(@Nullable Object transaction) throws TransactionException {
    if (TransactionSynchronizationManager.isSynchronizationActive()) {
        List<TransactionSynchronization> suspendedSynchronizations = doSuspendSynchronization();
        try {
            Object suspendedResources = null;
            if (transaction != null) {
                // 这里是真正做挂起的方法，这里返回的是一个holder
                suspendedResources = doSuspend(transaction);
            }
            // 这里将名称、隔离级别等信息从线程变量中取出并设置对应属性为null到线程变量
            String name = TransactionSynchronizationManager.getCurrentTransactionName();
            TransactionSynchronizationManager.setCurrentTransactionName(null);
            boolean readOnly = TransactionSynchronizationManager.isCurrentTransactionReadOnly();
            TransactionSynchronizationManager.setCurrentTransactionReadOnly(false);
            Integer isolationLevel = TransactionSynchronizationManager.getCurrentTransactionIsolationLevel();
            TransactionSynchronizationManager.setCurrentTransactionIsolationLevel(null);
            boolean wasActive = TransactionSynchronizationManager.isActualTransactionActive();
            TransactionSynchronizationManager.setActualTransactionActive(false);
            // 将事务各个属性与挂起的holder一并封装进SuspendedResourcesHolder对象中
            return new SuspendedResourcesHolder(
                suspendedResources, suspendedSynchronizations, name, readOnly, isolationLevel, wasActive);
        }
        catch (RuntimeException | Error ex) {
            // doSuspend failed - original transaction is still active...
            doResumeSynchronization(suspendedSynchronizations);
            throw ex;
        }
    }
    else if (transaction != null) {
        // Transaction active but no synchronization active.
        Object suspendedResources = doSuspend(transaction);
        return new SuspendedResourcesHolder(suspendedResources);
    }
    else {
        // Neither transaction nor synchronization active.
        return null;
    }
}
```



```java
@Override
protected Object doSuspend(Object transaction) {
    DataSourceTransactionObject txObject = (DataSourceTransactionObject) transaction;
    // 将transaction中的holder属性设置为空
    txObject.setConnectionHolder(null);
    // ConnnectionHolder从线程变量中解绑！
    return TransactionSynchronizationManager.unbindResource(obtainDataSource());
}
```

我们来看看 **unbindResource**

```java
private static Object doUnbindResource(Object actualKey) {
    // 取得当前线程的线程变量Map
    Map<Object, Object> map = resources.get();
    if (map == null) {
        return null;
    }
    // 将key为dataSourece的value移除出Map，然后将旧的Holder返回
    Object value = map.remove(actualKey);
    // Remove entire ThreadLocal if empty...
    // 如果此时map为空，直接清除线程变量
    if (map.isEmpty()) {
        resources.remove();
    }
    // Transparently suppress a ResourceHolder that was marked as void...
    if (value instanceof ResourceHolder && ((ResourceHolder) value).isVoid()) {
        value = null;
    }
    if (value != null && logger.isTraceEnabled()) {
        logger.trace("Removed value [" + value + "] for key [" + actualKey + "] from thread [" +
                     Thread.currentThread().getName() + "]");
    }
    // 将旧Holder返回
    return value;
}
```

可以回头看一下解绑操作的介绍。这里挂起主要干了三件事：

1. **将transaction中的holder属性设置为空**
2. **解绑（会返回线程中的那个旧的holder出来，从而封装到SuspendedResourcesHolder对象中）**
3. **将SuspendedResourcesHolder放入status中，方便后期子事务完成后，恢复外层事务**



最后给大家分享一个Github仓库，上面有大彬整理的**300多本经典的计算机书籍PDF**，包括**C语言、C++、Java、Python、前端、数据库、操作系统、计算机网络、数据结构和算法、机器学习、编程人生**等，可以star一下，下次找书直接在上面搜索，仓库持续更新中~

![](http://img.topjavaer.cn/image/Image.png)

![](http://img.topjavaer.cn/image/image-20221030094126118.png)

[**Github地址**](https://github.com/Tyson0314/java-books)

如果访问不了Github，可以访问码云地址。

[码云地址](https://gitee.com/tysondai/java-books)