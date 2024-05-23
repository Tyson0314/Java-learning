---
sidebar: heading
title: Spring源码分析
category: 源码分析
tag:
  - Spring
head:
  - - meta
    - name: keywords
      content: Spring源码,标签解析,源码分析,Spring设计模式,Bean创建,Spring AOP,Spring IOC,Bean,Bean生命周期
  - - meta
    - name: description
      content: 高质量的Spring源码分析总结
---


**正文**

在 Spring 中存在着不同的 scope，默认是 singleton ，还有 prototype、request 等等其他的 scope，他们的初始化步骤是怎样的呢？这个答案在这篇博客中给出。

## singleton

Spring 的 scope 默认为 singleton，第一部分分析了从缓存中获取单例模式的 bean，但是如果缓存中不存在呢？则需要从头开始加载 bean，这个过程由 `getSingleton()` 实现。其初始化的代码如下：

```java
if (mbd.isSingleton()) {
    sharedInstance = getSingleton(beanName, () -> {
        try {
            return createBean(beanName, mbd, args);
        }
        catch (BeansException ex) {
            destroySingleton(beanName);
            throw ex;
        }
    });
    bean = getObjectForBeanInstance(sharedInstance, name, beanName, mbd);
}
```

这里我们看到了 java8的新特性lambda表达式 () -> , getSingleton方法的第二个参数为 `ObjectFactory<?> singletonFactory，() ->`相当于创建了一个ObjectFactory类型的匿名内部类，去实现ObjectFactory接口中的getObject()方法，其中{}中的代码相当于写在匿名内部类中getObject()的代码片段，等着getSingleton方法里面通过ObjectFactory<?> singletonFactory去显示调用，如singletonFactory.getObject()。上述代码可以反推成如下代码：

```java
sharedInstance = getSingleton(beanName, new ObjectFactory<Object>() {
    @Override
    public Object getObject() {
        try {
            return createBean(beanName, mbd, args);
        } catch (BeansException ex) {
            destroySingleton(beanName);
            throw ex;
        }
    }
});
```

下面我们进入到 **getSingleton**方法中

```java
public Object getSingleton(String beanName, ObjectFactory<?> singletonFactory) {
    Assert.notNull(beanName, "Bean name must not be null");

    // 全局加锁
    synchronized (this.singletonObjects) {
        // 从缓存中检查一遍
        // 因为 singleton 模式其实就是复用已经创建的 bean 所以这步骤必须检查
        Object singletonObject = this.singletonObjects.get(beanName);
        //  为空，开始加载过程
        if (singletonObject == null) {
            // 省略 部分代码

            // 加载前置处理
            beforeSingletonCreation(beanName);
            boolean newSingleton = false;
            // 省略代码
            try {
                // 初始化 bean
                // 这个过程就是我上面讲的调用匿名内部类的方法，其实是调用 createBean() 方法
                singletonObject = singletonFactory.getObject();
                newSingleton = true;
            }
            // 省略 catch 部分
            }
            finally {
                // 后置处理
                afterSingletonCreation(beanName);
            }
            // 加入缓存中
            if (newSingleton) {
                addSingleton(beanName, singletonObject);
            }
        }
        // 直接返回
        return singletonObject;
    }
}
```

上述代码中其实，使用了回调方法，使得程序可以在单例创建的前后做一些准备及处理操作，而真正获取单例bean的方法其实并不是在此方法中实现的，其实现逻辑是在ObjectFactory类型的实例singletonFactory中实现的（即上图贴上的第一段代码）。而这些准备及处理操作包括如下内容。

（1）检查缓存是否已经加载过

（2）如果没有加载，则记录beanName的正在加载状态

（3）加载单例前记录加载状态。 可能你会觉得beforeSingletonCreation方法是个空实现，里面没有任何逻辑，但其实这个函数中做了一个很重要的操作：记录加载状态，也就是通过this.singletonsCurrentlyInCreation.add(beanName)将当前正要创建的bean记录在缓存中，这样便可以对循环依赖进行检测。 我们上一篇文章已经讲过，可以去看看。

（4）通过调用参数传入的ObjectFactory的个体Object方法实例化bean

（5）加载单例后的处理方法调用。 同步骤3的记录加载状态相似，当bean加载结束后需要移除缓存中对该bean的正在加载状态的记录。 

（6）将结果记录至缓存并删除加载bean过程中所记录的各种辅助状态。

（7）返回处理结果

我们看另外一个方法 `addSingleton()`。

```java
protected void addSingleton(String beanName, Object singletonObject) {
    synchronized (this.singletonObjects) {
        this.singletonObjects.put(beanName, singletonObject);
        this.singletonFactories.remove(beanName);
        this.earlySingletonObjects.remove(beanName);
        this.registeredSingletons.add(beanName);
    }
}
```

一个 put、一个 add、两个 remove。singletonObjects 单例 bean 的缓存，singletonFactories 单例 bean Factory 的缓存，earlySingletonObjects “早期”创建的单例 bean 的缓存，registeredSingletons 已经注册的单例缓存。

加载了单例 bean 后，调用 `getObjectForBeanInstance()` 从 bean 实例中获取对象。该方法我们在上一篇中已经讲过。

## 原型模式

```java
else if (mbd.isPrototype()) {
    Object prototypeInstance = null;
    try {
        beforePrototypeCreation(beanName);
        prototypeInstance = createBean(beanName, mbd, args);
    }
    finally {
        afterPrototypeCreation(beanName);
    }
    bean = getObjectForBeanInstance(prototypeInstance, name, beanName, mbd);
}
```

原型模式的初始化过程很简单：直接创建一个新的实例就可以了。过程如下：

1. 调用 `beforeSingletonCreation()` 记录加载原型模式 bean 之前的加载状态，即前置处理。
2. 调用 `createBean()` 创建一个 bean 实例对象。
3. 调用 `afterSingletonCreation()` 进行加载原型模式 bean 后的后置处理。
4. 调用 `getObjectForBeanInstance()` 从 bean 实例中获取对象。



## 其他作用域

```java
String scopeName = mbd.getScope();
final Scope scope = this.scopes.get(scopeName);
if (scope == null) {
    throw new IllegalStateException("No Scope registered for scope name '" + scopeName + "'");
}
try {
    Object scopedInstance = scope.get(beanName, () -> {
        beforePrototypeCreation(beanName);
        try {
            return createBean(beanName, mbd, args);
        }
        finally {
            afterPrototypeCreation(beanName);
        }
    });
    bean = getObjectForBeanInstance(scopedInstance, name, beanName, mbd);
}
catch (IllegalStateException ex) {
    throw new BeanCreationException(beanName,
            "Scope '" + scopeName + "' is not active for the current thread; consider " +
            "defining a scoped proxy for this bean if you intend to refer to it from a singleton",
            ex);
}
```

核心流程和原型模式一样，只不过获取 bean 实例是由 `scope.get()` 实现，如下：

```java
public Object get(String name, ObjectFactory<?> objectFactory) {
   // 获取 scope 缓存
    Map<String, Object> scope = this.threadScope.get();
    Object scopedObject = scope.get(name);
    if (scopedObject == null) {
        scopedObject = objectFactory.getObject();
        // 加入缓存
        scope.put(name, scopedObject);
    }
    return scopedObject;
}
```

对于上面三个模块，其中最重要的方法，是 `createBean()，也就是核心创建bean的过程，下面我们来具体看看。`

## 准备创建bean

```java
if (mbd.isSingleton()) {
    sharedInstance = getSingleton(beanName, () -> {
        try {
            return createBean(beanName, mbd, args);
        }
        catch (BeansException ex) {
            destroySingleton(beanName);
            throw ex;
        }
    });
    bean = getObjectForBeanInstance(sharedInstance, name, beanName, mbd);
}
```

如上所示，createBean是真正创建bean的地方，此方法是定义在AbstractAutowireCapableBeanFactory中，我们看下其源码：

```java
protected Object createBean(String beanName, RootBeanDefinition mbd, @Nullable Object[] args)
        throws BeanCreationException {

    if (logger.isDebugEnabled()) {
        logger.debug("Creating instance of bean '" + beanName + "'");
    }
    RootBeanDefinition mbdToUse = mbd;

    // 确保此时的 bean 已经被解析了
    // 如果获取的class 属性不为null，则克隆该 BeanDefinition
    // 主要是因为该动态解析的 class 无法保存到到共享的 BeanDefinition
    Class<?> resolvedClass = resolveBeanClass(mbd, beanName);
    if (resolvedClass != null && !mbd.hasBeanClass() && mbd.getBeanClassName() != null) {
        mbdToUse = new RootBeanDefinition(mbd);
        mbdToUse.setBeanClass(resolvedClass);
    }

    try {
        // 验证和准备覆盖方法
        mbdToUse.prepareMethodOverrides();
    }
    catch (BeanDefinitionValidationException ex) {
        throw new BeanDefinitionStoreException(mbdToUse.getResourceDescription(),
                beanName, "Validation of method overrides failed", ex);
    }

    try {
        // 给 BeanPostProcessors 一个机会用来返回一个代理类而不是真正的类实例
        // AOP 的功能就是基于这个地方
        Object bean = resolveBeforeInstantiation(beanName, mbdToUse);
        if (bean != null) {
            return bean;
        }
    }
    catch (Throwable ex) {
        throw new BeanCreationException(mbdToUse.getResourceDescription(), beanName,
                "BeanPostProcessor before instantiation of bean failed", ex);
    }

    try {
        // 执行真正创建 bean 的过程
        Object beanInstance = doCreateBean(beanName, mbdToUse, args);
        if (logger.isDebugEnabled()) {
            logger.debug("Finished creating instance of bean '" + beanName + "'");
        }
        return beanInstance;
    }
    catch (BeanCreationException | ImplicitlyAppearedSingletonException ex) {
        throw ex;
    }
    catch (Throwable ex) {
        throw new BeanCreationException(
                mbdToUse.getResourceDescription(), beanName, "Unexpected exception during bean creation", ex);
    }
}
```

### 实例化的前置处理

`resolveBeforeInstantiation()` 的作用是给 BeanPostProcessors 后置处理器返回一个代理对象的机会，其实在调用该方法之前 Spring 一直都没有创建 bean ，那么这里返回一个 bean 的代理类有什么作用呢？作用体现在后面的 `if` 判断：

```java
if (bean != null) {
    return bean;
}
```

如果代理对象不为空，则直接返回代理对象，这一步骤有非常重要的作用，Spring 后续实现 AOP 就是基于这个地方判断的。

```java
protected Object resolveBeforeInstantiation(String beanName, RootBeanDefinition mbd) {
    Object bean = null;
    if (!Boolean.FALSE.equals(mbd.beforeInstantiationResolved)) {
        if (!mbd.isSynthetic() && hasInstantiationAwareBeanPostProcessors()) {
            Class<?> targetType = determineTargetType(beanName, mbd);
            if (targetType != null) {
                bean = applyBeanPostProcessorsBeforeInstantiation(targetType, beanName);
                if (bean != null) {
                    bean = applyBeanPostProcessorsAfterInitialization(bean, beanName);
                }
            }
        }
        mbd.beforeInstantiationResolved = (bean != null);
    }
    return bean;
}
```

这个方法核心就在于 `applyBeanPostProcessorsBeforeInstantiation()` 和 `applyBeanPostProcessorsAfterInitialization()` 两个方法，before 为实例化前的后处理器应用，after 为实例化后的后处理器应用，由于本文的主题是创建 bean，关于 Bean 的增强处理后续 LZ 会单独出博文来做详细说明。

### 创建 bean

如果没有代理对象，就只能走常规的路线进行 bean 的创建了，该过程有 `doCreateBean()` 实现，如下：

```java
protected Object doCreateBean(final String beanName, final RootBeanDefinition mbd, final @Nullable Object[] args)
        throws BeanCreationException {

    // BeanWrapper是对Bean的包装，其接口中所定义的功能很简单包括设置获取被包装的对象，获取被包装bean的属性描述器
    BeanWrapper instanceWrapper = null;
    // 单例模型，则从未完成的 FactoryBean 缓存中删除
    if (mbd.isSingleton()) {anceWrapper = this.factoryBeanInstanceCache.remove(beanName);
    }

    // 使用合适的实例化策略来创建新的实例：工厂方法、构造函数自动注入、简单初始化
    if (instanceWrapper == null) {
        instanceWrapper = createBeanInstance(beanName, mbd, args);
    }

    // 包装的实例对象
    final Object bean = instanceWrapper.getWrappedInstance();
    // 包装的实例对象的类型
    Class<?> beanType = instanceWrapper.getWrappedClass();
    if (beanType != NullBean.class) {
        mbd.resolvedTargetType = beanType;
    }

    // 检测是否有后置处理
    // 如果有后置处理，则允许后置处理修改 BeanDefinition
    synchronized (mbd.postProcessingLock) {
        if (!mbd.postProcessed) {
            try {
                // applyMergedBeanDefinitionPostProcessors
                // 后置处理修改 BeanDefinition
                applyMergedBeanDefinitionPostProcessors(mbd, beanType, beanName);
            }
            catch (Throwable ex) {
                throw new BeanCreationException(mbd.getResourceDescription(), beanName,
                        "Post-processing of merged bean definition failed", ex);
            }
            mbd.postProcessed = true;
        }
    }

    // 解决单例模式的循环依赖
    // 单例模式 & 允许循环依赖&当前单例 bean 是否正在被创建
    boolean earlySingletonExposure = (mbd.isSingleton() && this.allowCircularReferences &&
            isSingletonCurrentlyInCreation(beanName));
    if (earlySingletonExposure) {
        if (logger.isDebugEnabled()) {
            logger.debug("Eagerly caching bean '" + beanName +
                    "' to allow for resolving potential circular references");
        }
        // 提前将创建的 bean 实例加入到ObjectFactory 中
        // 这里是为了后期避免循环依赖
        addSingletonFactory(beanName, () -> getEarlyBeanReference(beanName, mbd, bean));
    }

    /*
     * 开始初始化 bean 实例对象
     */
    Object exposedObject = bean;
    try {
        // 对 bean 进行填充，将各个属性值注入，其中，可能存在依赖于其他 bean 的属性
        // 则会递归初始依赖 bean
        populateBean(beanName, mbd, instanceWrapper);
        // 调用初始化方法，比如 init-method 
        exposedObject = initializeBean(beanName, exposedObject, mbd);
    }
    catch (Throwable ex) {
        if (ex instanceof BeanCreationException && beanName.equals(((BeanCreationException) ex).getBeanName())) {
            throw (BeanCreationException) ex;
        }
        else {
            throw new BeanCreationException(
                    mbd.getResourceDescription(), beanName, "Initialization of bean failed", ex);
        }
    }

    /**
     * 循环依赖处理
     */
    if (earlySingletonExposure) {
        // 获取 earlySingletonReference
        Object earlySingletonReference = getSingleton(beanName, false);
        // 只有在存在循环依赖的情况下，earlySingletonReference 才不会为空
        if (earlySingletonReference != null) {
            // 如果 exposedObject 没有在初始化方法中被改变，也就是没有被增强
            if (exposedObject == bean) {
                exposedObject = earlySingletonReference;
            }
            // 处理依赖
            else if (!this.allowRawInjectionDespiteWrapping && hasDependentBean(beanName)) {
                String[] dependentBeans = getDependentBeans(beanName);
                Set<String> actualDependentBeans = new LinkedHashSet<>(dependentBeans.length);
                for (String dependentBean : dependentBeans) {
                    if (!removeSingletonIfCreatedForTypeCheckOnly(dependentBean)) {
                        actualDependentBeans.add(dependentBean);
                    }
                }
                if (!actualDependentBeans.isEmpty()) {
                    throw new BeanCurrentlyInCreationException(beanName,
                            "Bean with name '" + beanName + "' has been injected into other beans [" +
                                    StringUtils.collectionToCommaDelimitedString(actualDependentBeans) +
                                    "] in its raw version as part of a circular reference, but has eventually been " +
                                    "wrapped. This means that said other beans do not use the final version of the " +
                                    "bean. This is often the result of over-eager type matching - consider using " +
                                    "'getBeanNamesOfType' with the 'allowEagerInit' flag turned off, for example.");
                }
            }
        }
    }
    try {
        // 注册 bean
        registerDisposableBeanIfNecessary(beanName, bean, mbd);
    }
    catch (BeanDefinitionValidationException ex) {
        throw new BeanCreationException(
                mbd.getResourceDescription(), beanName, "Invalid destruction signature", ex);
    }

    return exposedObject;
}
```

大概流程如下：

- `createBeanInstance()` 实例化 bean
- `populateBean()` 属性填充
- 循环依赖的处理
- `initializeBean()` 初始化 bean

#### createBeanInstance

我们首先从createBeanInstance方法开始。方法代码如下：

```java
protected BeanWrapper createBeanInstance(String beanName, RootBeanDefinition mbd, @Nullable Object[] args) {
    // 解析 bean，将 bean 类名解析为 class 引用
    Class<?> beanClass = resolveBeanClass(mbd, beanName);

    if (beanClass != null && !Modifier.isPublic(beanClass.getModifiers()) && !mbd.isNonPublicAccessAllowed()) {
        throw new BeanCreationException(mbd.getResourceDescription(), beanName,
                "Bean class isn't public, and non-public access not allowed: " + beanClass.getName());
    }

    // 如果存在 Supplier 回调，则使用给定的回调方法初始化策略
    Supplier<?> instanceSupplier = mbd.getInstanceSupplier();
    if (instanceSupplier != null) {
        return obtainFromSupplier(instanceSupplier, beanName);
    }

    // 如果工厂方法不为空，则使用工厂方法初始化策略,这里推荐看Factory-Method实例化Bean
    if (mbd.getFactoryMethodName() != null)  {
        return instantiateUsingFactoryMethod(beanName, mbd, args);
    }

    boolean resolved = false;
    boolean autowireNecessary = false;
    if (args == null) {
        // constructorArgumentLock 构造函数的常用锁
        synchronized (mbd.constructorArgumentLock) {
            // 如果已缓存的解析的构造函数或者工厂方法不为空，则可以利用构造函数解析
            // 因为需要根据参数确认到底使用哪个构造函数，该过程比较消耗性能，所有采用缓存机制
            if (mbd.resolvedConstructorOrFactoryMethod != null) {
                resolved = true;
                autowireNecessary = mbd.constructorArgumentsResolved;
            }
        }
    }
    // 已经解析好了，直接注入即可
    if (resolved) {
        // 自动注入，调用构造函数自动注入
        if (autowireNecessary) {
            return autowireConstructor(beanName, mbd, null, null);
        }
        else {
            // 使用默认构造函数构造
            return instantiateBean(beanName, mbd);
        }
    }

    // 确定解析的构造函数
    // 主要是检查已经注册的 SmartInstantiationAwareBeanPostProcessor
    Constructor<?>[] ctors = determineConstructorsFromBeanPostProcessors(beanClass, beanName);
    if (ctors != null ||
            mbd.getResolvedAutowireMode() == RootBeanDefinition.AUTOWIRE_CONSTRUCTOR ||
            mbd.hasConstructorArgumentValues() || !ObjectUtils.isEmpty(args))  {
        // 构造函数自动注入
        return autowireConstructor(beanName, mbd, ctors, args);
    }

    //使用默认构造函数注入
    return instantiateBean(beanName, mbd);
}
```

实例化 bean 是一个复杂的过程，其主要的逻辑为：

- 如果存在 Supplier 回调，则调用 `obtainFromSupplier()` 进行初始化
- 如果存在工厂方法，则使用工厂方法进行初始化
- 首先判断缓存，如果缓存中存在，即已经解析过了，则直接使用已经解析了的，根据 constructorArgumentsResolved 参数来判断是使用构造函数自动注入还是默认构造函数
- 如果缓存中没有，则需要先确定到底使用哪个构造函数来完成解析工作，因为一个类有多个构造函数，每个构造函数都有不同的构造参数，所以需要根据参数来锁定构造函数并完成初始化，如果存在参数则使用相应的带有参数的构造函数，否则使用默认构造函数。

**instantiateBean**

不带参数的构造函数的实例化过程使用的方法是instantiateBean(beanName, mbd)，我们看下源码：

```java
protected BeanWrapper instantiateBean(final String beanName, final RootBeanDefinition mbd) {
    try {
        Object beanInstance;
        final BeanFactory parent = this;
        if (System.getSecurityManager() != null) {
            beanInstance = AccessController.doPrivileged((PrivilegedAction<Object>) () ->
                    getInstantiationStrategy().instantiate(mbd, beanName, parent),
                    getAccessControlContext());
        }
        else {
            beanInstance = getInstantiationStrategy().instantiate(mbd, beanName, parent);
        }
        BeanWrapper bw = new BeanWrapperImpl(beanInstance);
        initBeanWrapper(bw);
        return bw;
    }
    catch (Throwable ex) {
        throw new BeanCreationException(
                mbd.getResourceDescription(), beanName, "Instantiation of bean failed", ex);
    }
}
```

**实例化策略**

实例化过程中，反复提到了实例化策略，这是做什么的呢？其实，经过前面的分析，我们已经得到了足以实例化的相关信息，完全可以使用最简单的反射方法来构造实例对象，但Spring却没有这么做。

接下来我们看下Object instantiate(RootBeanDefinition bd, @Nullable String beanName, BeanFactory owner)方法，具体的实现是在SimpleInstantiationStrategy中，具体代码如下：

```java
public Object instantiate(RootBeanDefinition bd, @Nullable String beanName, BeanFactory owner) {
    // 没有覆盖
    // 直接使用反射实例化即可
    if (!bd.hasMethodOverrides()) {
        // 重新检测获取下构造函数
        // 该构造函数是经过前面 N 多复杂过程确认的构造函数
        Constructor<?> constructorToUse;
        synchronized (bd.constructorArgumentLock) {
            // 获取已经解析的构造函数
            constructorToUse = (Constructor<?>) bd.resolvedConstructorOrFactoryMethod;
            // 如果为 null，从 class 中解析获取，并设置
            if (constructorToUse == null) {
                final Class<?> clazz = bd.getBeanClass();
                if (clazz.isInterface()) {
                    throw new BeanInstantiationException(clazz, "Specified class is an interface");
                }
                try {
                    if (System.getSecurityManager() != null) {
                        constructorToUse = AccessController.doPrivileged(
                                (PrivilegedExceptionAction<Constructor<?>>) clazz::getDeclaredConstructor);
                    }
                    else {
                        //利用反射获取构造器
                        constructorToUse =  clazz.getDeclaredConstructor();
                    }
                    bd.resolvedConstructorOrFactoryMethod = constructorToUse;
                }
                catch (Throwable ex) {
                    throw new BeanInstantiationException(clazz, "No default constructor found", ex);
                }
            }
        }

        // 通过BeanUtils直接使用构造器对象实例化bean
        return BeanUtils.instantiateClass(constructorToUse);
    }
    else {
        // 生成CGLIB创建的子类对象
        return instantiateWithMethodInjection(bd, beanName, owner);
    }
}
```

如果该 bean 没有配置 lookup-method、replaced-method 标签或者 @Lookup 注解，则直接通过反射的方式实例化 bean 即可，方便快捷，但是如果存在需要覆盖的方法或者动态替换的方法则需要使用 CGLIB 进行动态代理，因为可以在创建代理的同时将动态方法织入类中。

调用工具类 BeanUtils 的 `instantiateClass()` 方法完成反射工作：

```java
public static <T> T instantiateClass(Constructor<T> ctor, Object... args) throws BeanInstantiationException {
    Assert.notNull(ctor, "Constructor must not be null");
    try {
        ReflectionUtils.makeAccessible(ctor);
        return (KotlinDetector.isKotlinType(ctor.getDeclaringClass()) ?
                KotlinDelegate.instantiateClass(ctor, args) : ctor.newInstance(args));
    }
    // 省略一些 catch 
}
```

**CGLIB**

```java
protected Object instantiateWithMethodInjection(RootBeanDefinition bd, @Nullable String beanName, BeanFactory owner) {
    throw new UnsupportedOperationException("Method Injection not supported in SimpleInstantiationStrategy");
}
```

方法默认是没有实现的，具体过程由其子类 CglibSubclassingInstantiationStrategy 实现：

```java
protected Object instantiateWithMethodInjection(RootBeanDefinition bd, @Nullable String beanName, BeanFactory owner) {
    return instantiateWithMethodInjection(bd, beanName, owner, null);
}

protected Object instantiateWithMethodInjection(RootBeanDefinition bd, @Nullable String beanName, BeanFactory owner,
        @Nullable Constructor<?> ctor, @Nullable Object... args) {

    // 通过CGLIB生成一个子类对象
    return new CglibSubclassCreator(bd, owner).instantiate(ctor, args);
}
```

创建一个 CglibSubclassCreator 对象，调用其 `instantiate()` 方法生成其子类对象：

```java
public Object instantiate(@Nullable Constructor<?> ctor, @Nullable Object... args) {
    // 通过 Cglib 创建一个代理类
    Class<?> subclass = createEnhancedSubclass(this.beanDefinition);
    Object instance;
    // 没有构造器，通过 BeanUtils 使用默认构造器创建一个bean实例
    if (ctor == null) {
        instance = BeanUtils.instantiateClass(subclass);
    }
    else {
        try {
            // 获取代理类对应的构造器对象，并实例化 bean
            Constructor<?> enhancedSubclassConstructor = subclass.getConstructor(ctor.getParameterTypes());
            instance = enhancedSubclassConstructor.newInstance(args);
        }
        catch (Exception ex) {
            throw new BeanInstantiationException(this.beanDefinition.getBeanClass(),
                    "Failed to invoke constructor for CGLIB enhanced subclass [" + subclass.getName() + "]", ex);
        }
    }

    // 为了避免memory leaks异常，直接在bean实例上设置回调对象
    Factory factory = (Factory) instance;
    factory.setCallbacks(new Callback[] {NoOp.INSTANCE,
            new CglibSubclassingInstantiationStrategy.LookupOverrideMethodInterceptor(this.beanDefinition, this.owner),
            new CglibSubclassingInstantiationStrategy.ReplaceOverrideMethodInterceptor(this.beanDefinition, this.owner)});
    return instance;
}
```

当然这里还没有具体分析 CGLIB 生成子类的详细过程，具体的过程等后续分析 AOP 的时候再详细地介绍。

### 记录创建bean的ObjectFactory

在刚刚创建完Bean的实例后，也就是刚刚执行完构造器实例化后，doCreateBean方法中有下面一段代码：

```java
boolean earlySingletonExposure = (mbd.isSingleton() && this.allowCircularReferences &&
        isSingletonCurrentlyInCreation(beanName));
if (earlySingletonExposure) {
    if (logger.isDebugEnabled()) {
        logger.debug("Eagerly caching bean '" + beanName +
                "' to allow for resolving potential circular references");
    }
    //为避免后期循环依赖，可以在bean初始化完成前将创建实例的ObjectFactory加入工厂  
    //依赖处理：在Spring中会有循环依赖的情况，例如，当A中含有B的属性，而B中又含有A的属性时就会  
    //构成一个循环依赖，此时如果A和B都是单例，那么在Spring中的处理方式就是当创建B的时候，涉及  
    //自动注入A的步骤时，并不是直接去再次创建A，而是通过放入缓存中的ObjectFactory来创建实例，  
    //这样就解决了循环依赖的问题。
    addSingletonFactory(beanName, () -> getEarlyBeanReference(beanName, mbd, bean));
}
```

isSingletonCurrentlyInCreation(beanName)：该bean是否在创建中。在Spring中，会有个专门的属性默认为DefaultSingletonBeanRegistry的singletonsCurrentlyInCreation来记录bean的加载状态，在bean开始创建前会将beanName记录在属性中，在bean创建结束后会将beanName移除。那么我们跟随代码一路走下来可以对这个属性的记录并没有多少印象，这个状态是在哪里记录的呢？不同scope的记录位置不一样，我们以singleton为例，在singleton下记录属性的函数是在DefaultSingletonBeanRegistry类的public Object getSingleton（String beanName,ObjectFactory singletonFactory）函数的beforeSingletonCreation(beanName)和afterSingletonCreation(beanName)中，在这两段函数中分别this.singletonsCurrentlyInCreation.add(beanName)与this.singletonsCurrentlyInCreation.remove(beanName)来进行状态的记录与移除。 

变量earlySingletonExposure是否是单例，是否允许循环依赖，是否对应的bean正在创建的条件的综合。当这3个条件都满足时会执行addSingletonFactory操作，那么加入SingletonFactory的作用是什么？又是在什么时候调用的？

我们还是以最简单AB循环为例，类A中含有属性B,而类B中又会含有属性A,那么初始化beanA的过程如下： 

![](http://img.topjavaer.cn/img/202309200747808.png)

上图展示了创建BeanA的流程，在创建A的时候首先会记录类A所对应额beanName，并将beanA的创建工厂加入缓存中，而在对A的属性填充也就是调用pupulateBean方法的时候又会再一次的对B进行递归创建。同样的，因为在B中同样存在A属性，因此在实例化B的populateBean方法中又会再次地初始化B,也就是图形的最后，调用getBean（A）.关键是在这里，我们之前分析过，在这个函数中并不是直接去实例化A,而是先去检测缓存中是否有已经创建好的对应的bean,或者是否已经创建的ObjectFactory，而此时对于A的ObjectFactory我们早已经创建，所以便不会再去向后执行，而是直接调用ObjectFactory去创建A.这里最关键的是ObjectFactory的实现。

其中getEarlyBeanReference的代码如下：

```java
protected Object getEarlyBeanReference(String beanName, RootBeanDefinition mbd, Object bean) {  
    Object exposedObject = bean;  
    if (bean != null && !mbd.isSynthetic() && hasInstantiationAwareBeanPostProcessors()) {  
        for (BeanPostProcessor bp : getBeanPostProcessors()) {  
            if (bp instanceof SmartInstantiationAwareBeanPostProcessor) {  
                SmartInstantiationAwareBeanPostProcessor ibp = (SmartInstantiationAwareBeanPostProcessor) bp;  
                exposedObject = ibp.getEarlyBeanReference(exposedObject, beanName);  
                if (exposedObject == null) {  
                    return exposedObject;  
                }  
            }  
        }  
    }  
    return exposedObject;  
}
```

在getEarlyBeanReference函数中除了后处理的调用外没有别的处理工作，根据分析，基本可以理清Spring处理循环依赖的解决办法，在B中创建依赖A时通过ObjectFactory提供的实例化方法来获取原始A，使B中持有的A仅仅是刚刚初始化并没有填充任何属性的A,而这初始化A的步骤还是刚刚创建A时进行的，但是因为A与B中的A所表示的属性地址是一样的所以在A中创建好的属性填充自然可以通过B中的A获取，这样就解决了循环依赖的问题。