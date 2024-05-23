---
sidebar: heading
title: Spring源码分析
category: 源码分析
tag:
  - Spring
head:
  - - meta
    - name: keywords
      content: Spring源码,标签解析,源码分析,事物回滚,事物提交,Spring设计模式,Spring AOP,Spring IOC,Bean,Bean生命周期
  - - meta
    - name: description
      content: 高质量的Spring源码分析总结
---

**正文**

上一篇文章讲解了获取事务，并且通过获取的connection设置只读、隔离级别等，这篇文章讲解剩下的事务的回滚和提交。[最全面的Java面试网站](https://topjavaer.cn)

## 回滚处理

之前已经完成了目标方法运行前的事务准备工作，而这些准备工作最大的目的无非是对于程序没有按照我们期待的那样进行，也就是出现特定的错误，那么，当出现错误的时候，Spring是怎么对数据进行恢复的呢？

```java
 protected void completeTransactionAfterThrowing(@Nullable TransactionInfo txInfo, Throwable ex) {
     // 当抛出异常时首先判断当前是否存在事务，这是基础依据
     if (txInfo != null && txInfo.getTransactionStatus() != null) {
         if (logger.isTraceEnabled()) {
             logger.trace("Completing transaction for [" + txInfo.getJoinpointIdentification() +
                     "] after exception: " + ex);
         }
         // 这里判断是否回滚默认的依据是抛出的异常是否是RuntimeException或者是Error的类型
         if (txInfo.transactionAttribute != null && txInfo.transactionAttribute.rollbackOn(ex)) {
             try {
                 txInfo.getTransactionManager().rollback(txInfo.getTransactionStatus());
             }
             catch (TransactionSystemException ex2) {
                 logger.error("Application exception overridden by rollback exception", ex);
                 ex2.initApplicationException(ex);
                 throw ex2;
             }
             catch (RuntimeException | Error ex2) {
                 logger.error("Application exception overridden by rollback exception", ex);
                 throw ex2;
             }
         }
         else {
             // We don't roll back on this exception.
             // Will still roll back if TransactionStatus.isRollbackOnly() is true.
             // 如果不满足回滚条件即使抛出异常也同样会提交
             try {
                 txInfo.getTransactionManager().commit(txInfo.getTransactionStatus());
             }
             catch (TransactionSystemException ex2) {
                 logger.error("Application exception overridden by commit exception", ex);
                 ex2.initApplicationException(ex);
                 throw ex2;
             }
             catch (RuntimeException | Error ex2) {
                 logger.error("Application exception overridden by commit exception", ex);
                 throw ex2;
             }
         }
     }
 }
```

在对目标方法的执行过程中，一旦出现Throwable就会被引导至此方法处理，但是并不代表所有的Throwable都会被回滚处理，比如我们最常用的Exception，默认是不会被处理的。 默认情况下，即使出现异常，数据也会被正常提交，而这个关键的地方就是在txlnfo.transactionAttribute.rollbackOn(ex)这个函数。

### 回滚条件

```java
@Override
public boolean rollbackOn(Throwable ex) {
    return (ex instanceof RuntimeException || ex instanceof Error);
}
```

默认情况下Spring中的亊务异常处理机制只对RuntimeException和Error两种情况感兴趣，我们可以利用注解方式来改变，例如：

```java
@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
```

### 回滚处理

当然，一旦符合回滚条件，那么Spring就会将程序引导至回滚处理函数中。

> 分享一份大彬精心整理的**大厂面试手册**，包含**计算机基础、Java基础、多线程、JVM、数据库、Redis、Spring、Mybatis、SpringMVC、SpringBoot、分布式、微服务、设计模式、架构、校招社招分享**等高频面试题，非常实用，有小伙伴靠着这份手册拿过字节offer~
>
> ![](http://img.topjavaer.cn/image/image-20211127150136157.png)
>
> ![](http://img.topjavaer.cn/image/image-20220316234337881.png)
>
> 需要的小伙伴可以自行**下载**：
>
> http://mp.weixin.qq.com/s?__biz=Mzg2OTY1NzY0MQ==&mid=2247485445&idx=1&sn=1c6e224b9bb3da457f5ee03894493dbc&chksm=ce98f543f9ef7c55325e3bf336607a370935a6c78dbb68cf86e59f5d68f4c51d175365a189f8#rd
>
> 

```java
private void processRollback(DefaultTransactionStatus status, boolean unexpected) {
    try {
        boolean unexpectedRollback = unexpected;

        try {
            triggerBeforeCompletion(status);
            // 如果status有savePoint，说明此事务是NESTD，且为子事务，只回滚到savePoint
            if (status.hasSavepoint()) {
                if (status.isDebug()) {
                    logger.debug("Rolling back transaction to savepoint");
                }
                //回滚到保存点
                status.rollbackToHeldSavepoint();
            }
            // 如果此时的status显示是新的事务才进行回滚
            else if (status.isNewTransaction()) {
                if (status.isDebug()) {
                    logger.debug("Initiating transaction rollback");
                }
                //如果此时是子事务，我们想想哪些类型的事务会进入到这里？
                //回顾上一篇文章中已存在事务的处理，NOT_SUPPORTED创建的Status是prepareTransactionStatus(definition, null, false...)，说明是旧事物，并且事务为null，不会进入
                //REQUIRES_NEW会创建一个新的子事务，Status是newTransactionStatus(definition, transaction, true...)说明是新事务，将会进入到这个分支
                //PROPAGATION_NESTED创建的Status是prepareTransactionStatus(definition, transaction, false...)是旧事物，使用的是外层的事务，不会进入
                //PROPAGATION_SUPPORTS 或 PROPAGATION_REQUIRED或PROPAGATION_MANDATORY存在事务加入事务即可，标记为旧事务,prepareTransactionStatus(definition, transaction, false..)
                //说明当子事务，只有REQUIRES_NEW会进入到这里进行回滚
                doRollback(status);
            }
            else {
                // Participating in larger transaction
                // 如果status中有事务，进入下面
                // 根据上面分析，PROPAGATION_SUPPORTS 或 PROPAGATION_REQUIRED或PROPAGATION_MANDATORY创建的Status是prepareTransactionStatus(definition, transaction, false..)
                // 如果此事务时子事务，表示存在事务，并且事务为旧事物，将进入到这里
                if (status.hasTransaction()) {
                    if (status.isLocalRollbackOnly() || isGlobalRollbackOnParticipationFailure()) {
                        if (status.isDebug()) {
                            logger.debug("Participating transaction failed - marking existing transaction as rollback-only");
                        }
                        // 对status中的transaction作一个回滚了的标记，并不会立即回滚
                        doSetRollbackOnly(status);
                    }
                    else {
                        if (status.isDebug()) {
                            logger.debug("Participating transaction failed - letting transaction originator decide on rollback");
                        }
                    }
                }
                else {
                    logger.debug("Should roll back transaction but cannot - no transaction available");
                }
                // Unexpected rollback only matters here if we're asked to fail early
                if (!isFailEarlyOnGlobalRollbackOnly()) {
                    unexpectedRollback = false;
                }
            }
        }
        catch (RuntimeException | Error ex) {
            triggerAfterCompletion(status, TransactionSynchronization.STATUS_UNKNOWN);
            throw ex;
        }

        triggerAfterCompletion(status, TransactionSynchronization.STATUS_ROLLED_BACK);

    }
    finally {
        // 清空记录的资源并将挂起的资源恢复
        // 子事务结束了，之前挂起的事务就要恢复了
        cleanupAfterCompletion(status);
    }
}
```



我i们先来看看第13行，回滚到保存点的代码，根据保存点回滚的实现方式其实是根据底层的数据库连接进行的。回滚到保存点之后，也要释放掉当前的保存点

```java
public void rollbackToHeldSavepoint() throws TransactionException {
    Object savepoint = getSavepoint();
    if (savepoint == null) {
        throw new TransactionUsageException(
                "Cannot roll back to savepoint - no savepoint associated with current transaction");
    }
    getSavepointManager().rollbackToSavepoint(savepoint);
    getSavepointManager().releaseSavepoint(savepoint);
    setSavepoint(null);
}
```

这里使用的是JDBC的方式进行数据库连接，那么getSavepointManager()函数返回的是JdbcTransactionObjectSupport，也就是说上面函数会调用JdbcTransactionObjectSupport 中的 rollbackToSavepoint 方法。

```java
@Override
public void rollbackToSavepoint(Object savepoint) throws TransactionException {
    ConnectionHolder conHolder = getConnectionHolderForSavepoint();
    try {
        conHolder.getConnection().rollback((Savepoint) savepoint);
        conHolder.resetRollbackOnly();
    }
    catch (Throwable ex) {
        throw new TransactionSystemException("Could not roll back to JDBC savepoint", ex);
    }
}
```

当之前已经保存的事务信息中的事务为新事物，那么直接回滚。常用于单独事务的处理。对于没有保存点的回滚，Spring同样是使用底层数据库连接提供的API来操作的。由于我们使用的是DataSourceTransactionManager，那么doRollback函数会使用此类中的实现：

```java
@Override
protected void doRollback(DefaultTransactionStatus status) {
    DataSourceTransactionObject txObject = (DataSourceTransactionObject) status.getTransaction();
    Connection con = txObject.getConnectionHolder().getConnection();
    if (status.isDebug()) {
        logger.debug("Rolling back JDBC transaction on Connection [" + con + "]");
    }
    try {
        con.rollback();
    }
    catch (SQLException ex) {
        throw new TransactionSystemException("Could not roll back JDBC transaction", ex);
    }
}
```

当前事务信息中表明是存在事务的，又不属于以上两种情况，只做回滚标识，等到提交的时候再判断是否有回滚标识，下面回滚的时候再介绍，子事务中状态为**PROPAGATION_SUPPORTS** 或 **PROPAGATION_REQUIRED**或**PROPAGATION_MANDATORY**回滚的时候将会标记为回滚标识，我们来看看是怎么标记的

```java
@Override
protected void doSetRollbackOnly(DefaultTransactionStatus status) {
    // 将status中的transaction取出
    DataSourceTransactionObject txObject = (DataSourceTransactionObject) status.getTransaction();
    if (status.isDebug()) {
    logger.debug("Setting JDBC transaction [" + txObject.getConnectionHolder().getConnection() +
    "] rollback-only");
    }
    // transaction执行标记回滚
    txObject.setRollbackOnly();
}
public void setRollbackOnly() {
    // 这里将transaction里面的connHolder标记回滚
    getConnectionHolder().setRollbackOnly();
}
public void setRollbackOnly() {
    // 将holder中的这个属性设置成true
    this.rollbackOnly = true;
}
```

我们看到将status中的Transaction中的 ConnectionHolder的属性**rollbackOnly标记为true,**这里我们先不多考虑，等到下面提交的时候再介绍

我们简单的做个小结

- **status.hasSavepoint()如果status中有savePoint，只回滚到savePoint！**
- **status.isNewTransaction()如果status是一个新事务，才会真正去回滚！**
- **status.hasTransaction()如果status有事务，将会对staus中的事务标记！**



## 事务提交

在事务的执行并没有出现任何的异常，也就意味着事务可以走正常事务提交的流程了。这里回到流程中去，看看`commitTransactionAfterReturning(txInfo)`方法做了什么：

```java
protected void commitTransactionAfterReturning(@Nullable TransactionInfo txInfo) {
    if (txInfo != null && txInfo.getTransactionStatus() != null) {
        if (logger.isTraceEnabled()) {
            logger.trace("Completing transaction for [" + txInfo.getJoinpointIdentification() + "]");
        }
        txInfo.getTransactionManager().commit(txInfo.getTransactionStatus());
    }
}
```

在真正的数据提交之前，还需要做个判断。不知道大家还有没有印象，在我们分析事务异常处理规则的时候，当某个事务既没有保存点又不是新事物，Spring对它的处理方式只是设置一个回滚标识。这个回滚标识在这里就会派上用场了，如果子事务状态是

**PROPAGATION_SUPPORTS** 或 **PROPAGATION_REQUIRED**或**PROPAGATION_MANDATORY，**将会在外层事务中运行，回滚的时候，并不执行回滚，只是标记一下回滚状态，当外层事务提交的时候，会先判断ConnectionHolder中的回滚状态，如果已经标记为回滚，则不会提交，而是外层事务进行回滚

```java
@Override
public final void commit(TransactionStatus status) throws TransactionException {
    if (status.isCompleted()) {
        throw new IllegalTransactionStateException(
                "Transaction is already completed - do not call commit or rollback more than once per transaction");
    }

    DefaultTransactionStatus defStatus = (DefaultTransactionStatus) status;
    // 如果在事务链中已经被标记回滚，那么不会尝试提交事务，直接回滚
    if (defStatus.isLocalRollbackOnly()) {
        if (defStatus.isDebug()) {
            logger.debug("Transactional code has requested rollback");
        }
        processRollback(defStatus, false);
        return;
    }

    if (!shouldCommitOnGlobalRollbackOnly() && defStatus.isGlobalRollbackOnly()) {
        if (defStatus.isDebug()) {
            logger.debug("Global transaction is marked as rollback-only but transactional code requested commit");
        }
        // 这里会进行回滚，并且抛出一个异常
        processRollback(defStatus, true);
        return;
    }

    // 如果没有被标记回滚之类的，这里才真正判断是否提交
    processCommit(defStatus);
 }
```

而当事务执行一切都正常的时候，便可以真正地进入提交流程了。

```java
private void processCommit(DefaultTransactionStatus status) throws TransactionException {
    try {
        boolean beforeCompletionInvoked = false;

        try {
            boolean unexpectedRollback = false;
            prepareForCommit(status);
            triggerBeforeCommit(status);
            triggerBeforeCompletion(status);
            beforeCompletionInvoked = true;
            
            // 判断是否有savePoint
            if (status.hasSavepoint()) {
                if (status.isDebug()) {
                    logger.debug("Releasing transaction savepoint");
                }
                unexpectedRollback = status.isGlobalRollbackOnly();
                // 不提交，仅仅是释放savePoint
                status.releaseHeldSavepoint();
            }
            // 判断是否是新事务
            else if (status.isNewTransaction()) {
                if (status.isDebug()) {
                    logger.debug("Initiating transaction commit");
                }
                unexpectedRollback = status.isGlobalRollbackOnly();
                // 这里才真正去提交！
                doCommit(status);
            }
            else if (isFailEarlyOnGlobalRollbackOnly()) {
                unexpectedRollback = status.isGlobalRollbackOnly();
            }

            // Throw UnexpectedRollbackException if we have a global rollback-only
            // marker but still didn't get a corresponding exception from commit.
            if (unexpectedRollback) {
                throw new UnexpectedRollbackException(
                    "Transaction silently rolled back because it has been marked as rollback-only");
            }
        }
        catch (UnexpectedRollbackException ex) {
            // 略...
        }

        // Trigger afterCommit callbacks, with an exception thrown there
        // propagated to callers but the transaction still considered as committed.
        try {
            triggerAfterCommit(status);
        }
        finally {
            triggerAfterCompletion(status, TransactionSynchronization.STATUS_COMMITTED);
        }

    }
    finally {
        // 清空记录的资源并将挂起的资源恢复
        cleanupAfterCompletion(status);
    }
}
```



- status.hasSavepoint()如果status有savePoint，说明此时的事务是嵌套事务NESTED，这个事务外面还有事务，这里不提交，只是释放保存点。这里也可以看出来NESTED的传播行为了。
- status.isNewTransaction()如果是新的事务，才会提交！！，这里如果是子事务，只有**PROPAGATION_NESTED**状态才会走到这里提交，也说明了此状态子事务提交和外层事务是隔离的
- **如果是子事务，PROPAGATION_SUPPORTS** 或 **PROPAGATION_REQUIRED**或**PROPAGATION_MANDATORY**这几种状态是旧事物，提交的时候将什么都不做，因为他们是运行在外层事务当中，如果子事务没有回滚，将由外层事务一次性提交

如果程序流通过了事务的层层把关，最后顺利地进入了提交流程，那么同样，Spring会将事务提交的操作引导至底层数据库连接的API，进行事务提交。

```java
@Override
protected void doCommit(DefaultTransactionStatus status) {
    DataSourceTransactionObject txObject = (DataSourceTransactionObject) status.getTransaction();
    Connection con = txObject.getConnectionHolder().getConnection();
    if (status.isDebug()) {
        logger.debug("Committing JDBC transaction on Connection [" + con + "]");
    }
    try {
        con.commit();
    }
    catch (SQLException ex) {
        throw new TransactionSystemException("Could not commit JDBC transaction", ex);
    }
}
```

**从回滚和提交的逻辑看，只有status是新事务，才会进行提交或回滚，需要读者记好这个状态–>是否是新事务。**



## 清理工作

而无论是在异常还是没有异常的流程中，最后的finally块中都会执行一个方法**cleanupAfterCompletion(status)**

```java
private void cleanupAfterCompletion(DefaultTransactionStatus status) {
    // 设置完成状态
    status.setCompleted();
    if (status.isNewSynchronization()) {
        TransactionSynchronizationManager.clear();
    }
    if (status.isNewTransaction()) {
        doCleanupAfterCompletion(status.getTransaction());
    }
    if (status.getSuspendedResources() != null) {
        if (status.isDebug()) {
            logger.debug("Resuming suspended transaction after completion of inner transaction");
        }
        Object transaction = (status.hasTransaction() ? status.getTransaction() : null);
        // 结束之前事务的挂起状态
        resume(transaction, (SuspendedResourcesHolder) status.getSuspendedResources());
    }
}
```

如果是新事务需要做些清除资源的工作？

```java
@Override
protected void doCleanupAfterCompletion(Object transaction) {
    DataSourceTransactionObject txObject = (DataSourceTransactionObject) transaction;

    // Remove the connection holder from the thread, if exposed.
    if (txObject.isNewConnectionHolder()) {
        // 将数据库连接从当前线程中解除绑定，解绑过程我们在挂起的过程中已经分析过
        TransactionSynchronizationManager.unbindResource(obtainDataSource());
    }

    // Reset connection.
    // 释放连接，当前事务完成，则需要将连接释放，如果有线程池，则重置数据库连接，放回线程池
    Connection con = txObject.getConnectionHolder().getConnection();
    try {
        if (txObject.isMustRestoreAutoCommit()) {
            // 恢复数据库连接的自动提交属性
            con.setAutoCommit(true);
        }
        // 重置数据库连接
        DataSourceUtils.resetConnectionAfterTransaction(con, txObject.getPreviousIsolationLevel());
    }
    catch (Throwable ex) {
        logger.debug("Could not reset JDBC Connection after transaction", ex);
    }

    if (txObject.isNewConnectionHolder()) {
        if (logger.isDebugEnabled()) {
            logger.debug("Releasing JDBC Connection [" + con + "] after transaction");
        }
        // 如果当前事务是独立的新创建的事务则在事务完成时释放数据库连接
        DataSourceUtils.releaseConnection(con, this.dataSource);
    }

    txObject.getConnectionHolder().clear();
}
```

如果在事务执行前有事务挂起，那么当前事务执行结束后需要将挂起事务恢复。

如果有挂起的事务的话，`status.getSuspendedResources() != null`，也就是说status中会有suspendedResources这个属性，取得status中的transaction后进入resume方法：

```java
protected final void resume(@Nullable Object transaction, @Nullable SuspendedResourcesHolder resourcesHolder)
throws TransactionException {
    
    if (resourcesHolder != null) {
        Object suspendedResources = resourcesHolder.suspendedResources;
        // 如果有被挂起的事务才进入
        if (suspendedResources != null) {
            // 真正去resume恢复的地方
            doResume(transaction, suspendedResources);
        }
        List<TransactionSynchronization> suspendedSynchronizations = resourcesHolder.suspendedSynchronizations;
        if (suspendedSynchronizations != null) {
            // 将上面提到的TransactionSynchronizationManager专门存放线程变量的类中
            // 的属性设置成被挂起事务的属性
        TransactionSynchronizationManager.setActualTransactionActive(resourcesHolder.wasActive);
        TransactionSynchronizationManager.setCurrentTransactionIsolationLevel(resourcesHolder.isolationLevel);
        TransactionSynchronizationManager.setCurrentTransactionReadOnly(resourcesHolder.readOnly);
        TransactionSynchronizationManager.setCurrentTransactionName(resourcesHolder.name);
        doResumeSynchronization(suspendedSynchronizations);
        }
    }
}
```

我们来看看doResume

```java
@Override
protected void doResume(@Nullable Object transaction, Object suspendedResources) {
    TransactionSynchronizationManager.bindResource(obtainDataSource(), suspendedResources);
}
```

这里恢复只是把`suspendedResources`重新绑定到线程中。



## 几种事务传播属性详解

我们先来看看七种传播属性

Spring事物传播特性表：

| 传播特性名称              | 说明                                                         |
| ------------------------- | ------------------------------------------------------------ |
| PROPAGATION_REQUIRED      | 如果当前没有事物，则新建一个事物；如果已经存在一个事物，则加入到这个事物中 |
| PROPAGATION_SUPPORTS      | 支持当前事物，如果当前没有事物，则以非事物方式执行           |
| PROPAGATION_MANDATORY     | 使用当前事物，如果当前没有事物，则抛出异常                   |
| PROPAGATION_REQUIRES_NEW  | 新建事物，如果当前已经存在事物，则挂起当前事物               |
| PROPAGATION_NOT_SUPPORTED | 以非事物方式执行，如果当前存在事物，则挂起当前事物           |
| PROPAGATION_NEVER         | 以非事物方式执行，如果当前存在事物，则抛出异常               |
| PROPAGATION_NESTED        | 如果当前存在事物，则在嵌套事物内执行；如果当前没有事物，则与PROPAGATION_REQUIRED传播特性相同 |



### 当前不存在事务的情况下

每次创建一个TransactionInfo的时候都会去new一个transaction，然后去线程变量Map中拿holder，当此时线程变量的Map中holder为空时，就视为当前情况下不存在事务，所以此时transaction中holder = null。

**1、PROPAGATION_MANDATORY**

**使用当前事物，如果当前没有事物，则抛出异常**

在上一篇博文中我们在getTransaction方法中可以看到如下代码，当前线程不存在事务时，如果传播属性为PROPAGATION_MANDATORY，直接抛出异常，因为PROPAGATION_MANDATORY必须要在事务中运行

```java
if (definition.getPropagationBehavior() == TransactionDefinition.PROPAGATION_MANDATORY) {
    throw new IllegalTransactionStateException(
            "No existing transaction found for transaction marked with propagation 'mandatory'");
}
```

**2、REQUIRED、REQUIRES_NEW、NESTED**

我们继续看上一篇博文中的getTransaction方法

```java
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
```



此时会讲null挂起，此时的status变量为：

```java
DefaultTransactionStatus status = newTransactionStatus(definition, transaction, true, newSynchronization, debugEnabled, suspendedResources);
```

此时的transaction中holder依然为null，标记为新事务，接着就会执行doBegin方法了：

```java
@Override
protected void doBegin(Object transaction, TransactionDefinition definition) {
    DataSourceTransactionObject txObject = (DataSourceTransactionObject) transaction;
    Connection con = null;

        // 此时会进入这个if语句块，因为此时的holder依然为null
        if (!txObject.hasConnectionHolder() ||
                txObject.getConnectionHolder().isSynchronizedWithTransaction())                 {
            // 从dataSource从取得一个新的connection
            Connection newCon = obtainDataSource().getConnection();
            if (logger.isDebugEnabled()) {
                logger.debug("Acquired Connection [" + newCon + "] for JDBC transaction");
            }
            // new一个新的holder放入新的连接，设置为新的holder
            txObject.setConnectionHolder(new ConnectionHolder(newCon), true);
        }

        // 略...
        
        prepareTransactionalConnection(con, definition);
        // 将holder设置avtive = true
        txObject.getConnectionHolder().setTransactionActive(true);

        // Bind the connection holder to the thread.
        // 绑定到当前线程
        if (txObject.isNewConnectionHolder()) {
            TransactionSynchronizationManager.bindResource(obtainDataSource(), txObject.getConnectionHolder());
        }
    }
}
```



所以，一切都是新的，新的事务，新的holder，新的连接，在当前不存在事务的时候一切都是新创建的。

这三种传播特性在当前不存在事务的情况下是没有区别的，此事务都为新创建的连接，在回滚和提交的时候都可以正常回滚或是提交，就像正常的事务操作那样。

**3、PROPAGATION_SUPPORTS、PROPAGATION_NOT_SUPPORTED、PROPAGATION_NEVER**

我们看看当传播属性为PROPAGATION_SUPPORTS、PROPAGATION_NOT_SUPPORTED、PROPAGATION_NEVER这几种时的代码，getTransaction方法

```java
else {
    //其他的传播特性一律返回一个空事务，transaction = null
    //当前不存在事务，且传播机制=PROPAGATION_SUPPORTS/PROPAGATION_NOT_SUPPORTED/PROPAGATION_NEVER，这三种情况，创建“空”事务
    boolean newSynchronization = (getTransactionSynchronization() == SYNCHRONIZATION_ALWAYS);
    return prepareTransactionStatus(definition, null, true, newSynchronization, debugEnabled, null);
}
```



我们看到Status中第二个参数传的是**null**，表示一个空事务，意思是当前线程中并没有Connection，那如何进行数据库的操作呢？上一篇文章中我们有一个扩充的知识点，Mybaits中使用的数据库连接是从通过**`TransactionSynchronizationManager.getResource(Object key)获取spring增强方法中绑定到线程的connection，`**`如下代码，那当传播属性为PROPAGATION_SUPPORTS、PROPAGATION_NOT_SUPPORTED、PROPAGATION_NEVER这几种时，并没有创建新的Connection，当前线程中也没有绑定Connection，那Mybatis是如何获取Connecion的呢？这里留一个疑问，我们后期看Mybatis的源码的时候来解决这个疑问`

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



此时我们知道Status中的Transaction为null,在目标方法执行完毕后，进行回滚或提交的时候，会判断当前事务是否是新事务，代码如下

```java
@Override
public boolean isNewTransaction() {
    return (hasTransaction() && this.newTransaction);
}
```

**此时transacion为null，回滚或提交的时候将什么也不做**



### 当前存在事务情况下

上一篇文章中已经讲过，第一次事务开始时必会新创一个holder然后做绑定操作，此时线程变量是有holder的且avtive为true，如果第二个事务进来，去new一个transaction之后去线程变量中取holder，holder是不为空的且active是为true的，所以会进入**handleExistingTransaction**方法：

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



**1、NERVER**

**不支持当前事务;如果当前事务存在，抛出异常**

```java
// 1.NERVER（不支持当前事务;如果当前事务存在，抛出异常）报错
if (definition.getPropagationBehavior() == TransactionDefinition.PROPAGATION_NEVER) {
    throw new IllegalTransactionStateException(
            "Existing transaction found for transaction marked with propagation 'never'");
}
```



我们看到如果当前线程中存在事务，传播属性为**PROPAGATION_NEVER，会直接抛出异常**

**2、NOT_SUPPORTED**

**以非事物方式执行，如果当前存在事物，则挂起当前事物**

我们看上面代码第9行，如果传播属性为PROPAGATION_NOT_SUPPORTED，会先将原来的transaction挂起，此时status为：

```java
return prepareTransactionStatus(definition, null, false, newSynchronization, debugEnabled, suspendedResources);
```

transaction为空，旧事务，挂起的对象存入status中。

**此时与外层事务隔离了，在这种传播特性下，是不进行事务的，当提交时，因为是旧事务，所以不会commit，失败时也不会回滚rollback**

**3、REQUIRES_NEW** 

此时会先挂起，然后去执行doBegin方法，此时会创建一个新连接，新holder，新holder有什么用呢？

如果是新holder，会在doBegin中做绑定操作，将新holder绑定到当前线程，其次，在提交或是回滚时finally语句块始终会执行清理方法时判断新holder会进行解绑操作。

```java
@Override
protected void doCleanupAfterCompletion(Object transaction) {
    DataSourceTransactionObject txObject = (DataSourceTransactionObject) transaction;

    // Remove the connection holder from the thread, if exposed.
    if (txObject.isNewConnectionHolder()) {
        TransactionSynchronizationManager.unbindResource(obtainDataSource());
    }
}
```



符合传播特性，所以这里**REQUIRES_NEW**这个传播特性是与原事务相隔的，用的连接都是新new出来的。

此时返回的status是这样的：

```java
DefaultTransactionStatus status = newTransactionStatus(definition, transaction, true, newSynchronization, debugEnabled, suspendedResources);
```

其中transaction中holder为新holder，连接都是新的。标记为新事务，在开头的回顾中提到，如果是新事务，提交时才能成功提交。并且在最后一个参数放入挂起的对象，之后将会恢复它。

**REQUIRES_NEW小结**

会于前一个事务隔离，自己新开一个事务，与上一个事务无关，如果报错，上一个事务catch住异常，上一个事务是不会回滚的，这里要注意**(在invokeWithinTransaction方法中的catch代码块中，处理完异常后，还通过** **throw ex;将异常抛给了上层，所以上层要catch住子事务的异常，子事务回滚后，上层事务也会回滚)，**而只要自己提交了之后，就算上一个事务后面的逻辑报错，自己是不会回滚的（因为被标记为新事务，所以在提交阶段已经提交了）。

**4、NESTED** 

不挂起事务，并且返回的status对象如下：

```java
DefaultTransactionStatus status =prepareTransactionStatus(definition, transaction, false, false, debugEnabled, null);

status.createAndHoldSavepoint();
```

不同于其他的就是此传播特性会创建savePoint，有什么用呢？前面说到，如果是旧事务的话回滚是不会执行的，但先看看它的status，虽然标记为旧事务，但它还有savePoint，如果有savePoint，会回滚到保存点去，提交的时候，会释放保存点，但是不提交！切记，这里就是NESTED与REQUIRES_NEW不同点之一了，NESTED只会在外层事务成功时才进行提交，实际提交点只是去释放保存点，外层事务失败，NESTED也将回滚，但如果是REQUIRES_NEW的话，不管外层事务是否成功，它都会提交不回滚。这就是savePoint的作用。

由于不挂起事务，可以看出来，此时transaction中的holder用的还是旧的，连接也是上一个事务的连接，可以看出来，这个传播特性会将原事务和自己当成一个事务来做。

**NESTED 小结**

与前一个事务不隔离，没有新开事务，用的也是老transaction，老的holder，同样也是老的connection，没有挂起的事务。关键点在这个传播特性在存在事务情况下会创建savePoint，但不存在事务情况下是不会创建savePoint的。在提交时不真正提交，只是释放了保存点而已，在回滚时会回滚到保存点位置，如果上层事务catch住异常的话，是不会影响上层事务的提交的，外层事务提交时，会统一提交，外层事务回滚的话，会全部回滚

**5、REQUIRED 、PROPAGATION_REQUIRED或PROPAGATION_MANDATORY**

**存在事务加入事务即可，标记为旧事务，空挂起**

status为：

```java
return prepareTransactionStatus(definition, transaction, false, newSynchronization, debugEnabled, null);
```

使用旧事务，标记为旧事务，挂起对象为空。

与前一个事务不隔离，没有新开事务，用的也是老transaction，老的connection，但此时被标记成旧事务，所以，在提交阶段不会真正提交的，在外层事务提交阶段，才会把事务提交。

如果此时这里出现了异常，内层事务执行回滚时，旧事务是不会去回滚的，而是进行回滚标记，我们看看文章开头处回滚的处理函数**processRollback中第39行，当前事务信息中表明是存在事务的，但是既没有保存点，又不是新事务，回滚的时候只做回滚标识，等到提交的时候再判断是否有回滚标识，commit的时候，如果有回滚标识，就进行回滚**

```java
@Override
protected void doSetRollbackOnly(DefaultTransactionStatus status) {
    // 将status中的transaction取出
    DataSourceTransactionObject txObject = (DataSourceTransactionObject) status.getTransaction();
    if (status.isDebug()) {
    logger.debug("Setting JDBC transaction [" + txObject.getConnectionHolder().getConnection() +
    "] rollback-only");
    }
    // transaction执行标记回滚
    txObject.setRollbackOnly();
}
public void setRollbackOnly() {
    // 这里将transaction里面的connHolder标记回滚
    getConnectionHolder().setRollbackOnly();
}
public void setRollbackOnly() {
    // 将holder中的这个属性设置成true
    this.rollbackOnly = true;
}
```

我们知道，在内层事务中transaction对象中的holder对象其实就是外层事务transaction里的holder，holder是一个对象，指向同一个地址，在这里设置holder标记，外层事务transaction中的holder也是会被设置到的，在外层事务提交的时候有这样一段代码：

```java
@Override
public final void commit(TransactionStatus status) throws TransactionException {
    // 略...

    // !shouldCommitOnGlobalRollbackOnly()只有JTA与JPA事务管理器才会返回false
    // defStatus.isGlobalRollbackOnly()这里判断status是否被标记了
    if (!shouldCommitOnGlobalRollbackOnly() && defStatus.isGlobalRollbackOnly()) {
        if (defStatus.isDebug()) {
            logger.debug("Global transaction is marked as rollback-only but transactional code requested commit");
        }
        // 如果内层事务抛异常，外层事务是会走到这个方法中的，而不是去提交
        processRollback(defStatus, true);
        return;
    }

    // 略...
}
```

在外层事务提交的时候是会去验证transaction中的holder里是否被标记rollback了，内层事务回滚，将会标记holder，而holder是线程变量，在此传播特性中holder是同一个对象，外层事务将无法正常提交而进入processRollback方法进行回滚，并抛出异常：

```java
private void processRollback(DefaultTransactionStatus status, boolean unexpected) {
    try {
        // 此时这个值为true
        boolean unexpectedRollback = unexpected;

        try {
            triggerBeforeCompletion(status);

            if (status.hasSavepoint()) {
                if (status.isDebug()) {
                    logger.debug("Rolling back transaction to savepoint");
                }
                status.rollbackToHeldSavepoint();
            }
            // 新事务，将进行回滚操作
            else if (status.isNewTransaction()) {
                if (status.isDebug()) {
                    logger.debug("Initiating transaction rollback");
                }
                // 回滚！
                doRollback(status);
            }
            
         // 略...
            
        // Raise UnexpectedRollbackException if we had a global rollback-only marker
        // 抛出一个异常
        if (unexpectedRollback) {
            // 这个就是上文说到的抛出的异常类型
            throw new UnexpectedRollbackException(
                    "Transaction rolled back because it has been marked as rollback-only");
        }
    }
    finally {
        cleanupAfterCompletion(status);
    }
}
```





最后给大家分享**200多本计算机经典书籍PDF电子书**，包括**C语言、C++、Java、Python、前端、数据库、操作系统、计算机网络、数据结构和算法、机器学习、编程人生**等，感兴趣的小伙伴可以自取：

![](http://img.topjavaer.cn/image/Image.png)

![](http://img.topjavaer.cn/image/image-20221030094126118.png)

https://mp.weixin.qq.com/s?__biz=Mzg2OTY1NzY0MQ==&mid=2247486208&idx=1&sn=dbeedf47c50b1be67b2ef31a901b8b56&chksm=ce98f646f9ef7f506a1f7d72fc9384ba1b518072b44d157f657a8d5495a1c78c3e5de0b41efd&token=1652861108&lang=zh_CN#rd