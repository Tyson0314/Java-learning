---
sidebar: heading
title: Spring源码分析
category: 源码分析
tag:
  - Spring
head:
  - - meta
    - name: keywords
      content: Spring源码,标签解析,源码分析,代理生成,AOP代理,增强器,Spring设计模式,Spring AOP,Spring IOC,Bean,Bean生命周期
  - - meta
    - name: description
      content: 高质量的Spring源码分析总结
---

> 本文已经收录到大彬精心整理的**大厂面试手册**，包含**计算机基础、Java基础、多线程、JVM、数据库、Redis、Spring、Mybatis、SpringMVC、SpringBoot、分布式、微服务、设计模式、架构、校招社招分享**等高频面试题，非常实用，有小伙伴靠着这份手册拿过字节offer~
>
> ![](http://img.topjavaer.cn/image/image-20211127150136157.png)
>
> ![](http://img.topjavaer.cn/image/image-20220316234337881.png)
>
> 需要的小伙伴可以自行**下载**：
>
> http://mp.weixin.qq.com/s?__biz=Mzg2OTY1NzY0MQ==&mid=2247485445&idx=1&sn=1c6e224b9bb3da457f5ee03894493dbc&chksm=ce98f543f9ef7c55325e3bf336607a370935a6c78dbb68cf86e59f5d68f4c51d175365a189f8#rd

**正文**

在获取了所有对应bean的增强后，便可以进行代理的创建了。回到AbstractAutoProxyCreator的wrapIfNecessary方法中，如下所示： 

```java
 protected static final Object[] DO_NOT_PROXY = null;
 
 protected Object wrapIfNecessary(Object bean, String beanName, Object cacheKey) {
     if (StringUtils.hasLength(beanName) && this.targetSourcedBeans.contains(beanName)) {
         return bean;
     }
     if (Boolean.FALSE.equals(this.advisedBeans.get(cacheKey))) {
         return bean;
     }
     if (isInfrastructureClass(bean.getClass()) || shouldSkip(bean.getClass(), beanName)) {
         this.advisedBeans.put(cacheKey, Boolean.FALSE);
         return bean;
     }
 
     // Create proxy if we have advice.
     Object[] specificInterceptors = getAdvicesAndAdvisorsForBean(bean.getClass(), beanName, null);
     if (specificInterceptors != DO_NOT_PROXY) {
         this.advisedBeans.put(cacheKey, Boolean.TRUE);
         Object proxy = createProxy(
                 bean.getClass(), beanName, specificInterceptors, new SingletonTargetSource(bean));
         this.proxyTypes.put(cacheKey, proxy.getClass());
         return proxy;
     }
 
     this.advisedBeans.put(cacheKey, Boolean.FALSE);
     return bean;
 }
```

我们上一篇文章分析完了第16行，获取到了所有对应bean的增强器，并获取到了此目标bean所有匹配的 Advisor，接下来我们要从第17行开始分析，如果 specificInterceptors 不为空，则要为当前bean创建代理类，接下来我们来看创建代理类的方法 **createProxy：**

> [最全面的Java面试网站](https://topjavaer.cn)

```java
protected Object createProxy(Class<?> beanClass, @Nullable String beanName,
        @Nullable Object[] specificInterceptors, TargetSource targetSource) {

    if (this.beanFactory instanceof ConfigurableListableBeanFactory) {
        AutoProxyUtils.exposeTargetClass((ConfigurableListableBeanFactory) this.beanFactory, beanName, beanClass);
    }

    ProxyFactory proxyFactory = new ProxyFactory();
    // 获取当前类中相关属性
    proxyFactory.copyFrom(this);

    if (!proxyFactory.isProxyTargetClass()) {
        // 决定对于给定的bean是否应该使用targetClass而不是他的接口代理，
        // 检査 proxyTargetClass 设置以及 preserveTargetClass 属性
        if (shouldProxyTargetClass(beanClass, beanName)) {
            proxyFactory.setProxyTargetClass(true);
        }
        else {
            evaluateProxyInterfaces(beanClass, proxyFactory);
        }
    }

    Advisor[] advisors = buildAdvisors(beanName, specificInterceptors);
    // 加入增强器
    proxyFactory.addAdvisors(advisors);
    // 设置要代理的目标类
    proxyFactory.setTargetSource(targetSource);
    // 定制代理
    customizeProxyFactory(proxyFactory);
    // 用来控制代理工厂被配置之后，是否还允许修改通知。
    // 缺省值是false (即在代理被配置之后，不允许修改代理的配置)。
    proxyFactory.setFrozen(this.freezeProxy);
    if (advisorsPreFiltered()) {
        proxyFactory.setPreFiltered(true);
    }

    //真正创建代理的方法
    return proxyFactory.getProxy(getProxyClassLoader());
}

@Override
public void setTargetSource(@Nullable TargetSource targetSource) {
    this.targetSource = (targetSource != null ? targetSource : EMPTY_TARGET_SOURCE);
}

public void addAdvisors(Collection<Advisor> advisors) {
    if (isFrozen()) {
        throw new AopConfigException("Cannot add advisor: Configuration is frozen.");
    }
    if (!CollectionUtils.isEmpty(advisors)) {
        for (Advisor advisor : advisors) {
            if (advisor instanceof IntroductionAdvisor) {
                validateIntroductionAdvisor((IntroductionAdvisor) advisor);
            }
            Assert.notNull(advisor, "Advisor must not be null");
            this.advisors.add(advisor);
        }
        updateAdvisorArray();
        adviceChanged();
    }
}
```

从上面代码我们看到对于代理类的创建及处理spring是委托给了ProxyFactory处理的

## 创建代理

```java
public Object getProxy(@Nullable ClassLoader classLoader) {
    return createAopProxy().getProxy(classLoader);
}
```

在上面的getProxy方法中createAopProxy方法，其实现是在DefaultAopProxyFactory中，这个方法的主要功能是，根据optimize、ProxyTargetClass等参数来决定生成Jdk动态代理，还是生成Cglib代理。我们进入到方法内：

```java
protected final synchronized AopProxy createAopProxy() {
    if (!this.active) {
        activate();
    }
    // 创建代理
    return getAopProxyFactory().createAopProxy(this);
}

public AopProxy createAopProxy(AdvisedSupport config) throws AopConfigException {
    if (config.isOptimize() || config.isProxyTargetClass() || hasNoUserSuppliedProxyInterfaces(config)) {
        Class<?> targetClass = config.getTargetClass();
        if (targetClass == null) {
            throw new AopConfigException("TargetSource cannot determine target class: " +
                    "Either an interface or a target is required for proxy creation.");
        }
        //手动设置创建Cglib代理类后，如果目标bean是一个接口，也要创建jdk代理类
        if (targetClass.isInterface() || Proxy.isProxyClass(targetClass)) {
            return new JdkDynamicAopProxy(config);
        }
        //创建Cglib代理
        return new ObjenesisCglibAopProxy(config);
    }
    else {
        //默认创建jdk代理
        return new JdkDynamicAopProxy(config);
    }
}
```



我们知道对于Spring的代理是通过JDKProxy的实现和CglibProxy实现。Spring是如何选取的呢？

从if的判断条件中可以看到3个方面影响这Spring的判断。

- optimize：用来控制通过CGLIB创建的代理是否使用激进的优化策略，除非完全了解AOP代理如何处理优化，否则不推荐用户使用这个设置。目前这个属性仅用于CGLIB 代理，对于JDK动态代理（缺省代理）无效。
- proxyTargetClass：这个属性为true时，目标类本身被代理而不是目标类的接口。如果这个属性值被设为true，CGLIB代理将被创建，设置方式：**<aop:aspectj-autoproxy proxy-target-class="true"/>。**
- hasNoUserSuppliedProxylnterfaces：是否存在代理接口

下面是对JDK与Cglib方式的总结。

- **如果目标对象实现了接口，默认情况下会采用JDK的动态代理实现AOP。**
- **如果目标对象实现了接口，可以强制使用CGLIB实现AOP。**
- **如果目标对象没有实现了接口，必须采用CGLIB库，Spring会自动在JDK动态代理 和CGLIB之间转换。**

如何强制使用CGLIB实现AOP?

（1）添加 CGLIB 库，Spring_HOME/cglib/*.jar。

（2）在 Spring 配置文件中加人<aop:aspectj-autoproxy proxy-target-class="true"/>。

JDK动态代理和CGLIB字节码生成的区别？

- JDK动态代理只能对实现了接口的类生成代理，而不能针对类。
- CGLIB是针对类实现代理，主要是对指定的类生成一个子类，覆盖其中的方法，因为是继承，所以该类或方法最好不要声明成final。

## 获取代理

Spring的AOP实现其实也是用了**Proxy和InvocationHandler**这两个东西的。

我们再次来回顾一下使用JDK代理的方式，在整个创建过程中，对于InvocationHandler的创建是最为核心的，在自定义的InvocationHandler中需要重写3个函数。

- 构造函数，将代理的对象传入。
- invoke方法，此方法中实现了 AOP增强的所有逻辑。
- getProxy方法，此方法千篇一律，但是必不可少。

那么，我们看看Spring中的JDK代理实现是不是也是这么做的呢？我们来看看简化后的 JdkDynamicAopProxy 。

```java
  final class JdkDynamicAopProxy implements AopProxy, InvocationHandler, Serializable {
  
      private final AdvisedSupport advised;
  
      public JdkDynamicAopProxy(AdvisedSupport config) throws AopConfigException {
          Assert.notNull(config, "AdvisedSupport must not be null");
          if (config.getAdvisors().length == 0 && config.getTargetSource() == AdvisedSupport.EMPTY_TARGET_SOURCE) {
              throw new AopConfigException("No advisors and no TargetSource specified");
          }
          this.advised = config;
      }
  
  
      @Override
      public Object getProxy() {
          return getProxy(ClassUtils.getDefaultClassLoader());
      }
  
      @Override
      public Object getProxy(@Nullable ClassLoader classLoader) {
          if (logger.isTraceEnabled()) {
              logger.trace("Creating JDK dynamic proxy: " + this.advised.getTargetSource());
          }
          Class<?>[] proxiedInterfaces = AopProxyUtils.completeProxiedInterfaces(this.advised, true);
          findDefinedEqualsAndHashCodeMethods(proxiedInterfaces);
          return Proxy.newProxyInstance(classLoader, proxiedInterfaces, this);
      }
  
      @Override
      @Nullable
      public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
          Object oldProxy = null;
          boolean setProxyContext = false;
  
          TargetSource targetSource = this.advised.targetSource;
          Object target = null;
  
          try {
              if (!this.equalsDefined && AopUtils.isEqualsMethod(method)) {
                  // The target does not implement the equals(Object) method itself.
                  return equals(args[0]);
              }
              else if (!this.hashCodeDefined && AopUtils.isHashCodeMethod(method)) {
                  // The target does not implement the hashCode() method itself.
                  return hashCode();
              }
              else if (method.getDeclaringClass() == DecoratingProxy.class) {
                  // There is only getDecoratedClass() declared -> dispatch to proxy config.
                  return AopProxyUtils.ultimateTargetClass(this.advised);
              }
              else if (!this.advised.opaque && method.getDeclaringClass().isInterface() &&
                      method.getDeclaringClass().isAssignableFrom(Advised.class)) {
                  // Service invocations on ProxyConfig with the proxy config...
                  return AopUtils.invokeJoinpointUsingReflection(this.advised, method, args);
              }
  
              Object retVal;
  
              if (this.advised.exposeProxy) {
                  // Make invocation available if necessary.
                  oldProxy = AopContext.setCurrentProxy(proxy);
                  setProxyContext = true;
              }
  
              // Get as late as possible to minimize the time we "own" the target,
              // in case it comes from a pool.
              target = targetSource.getTarget();
              Class<?> targetClass = (target != null ? target.getClass() : null);
  
              // Get the interception chain for this method.
              List<Object> chain = this.advised.getInterceptorsAndDynamicInterceptionAdvice(method, targetClass);
  
              // Check whether we have any advice. If we don't, we can fallback on direct
              // reflective invocation of the target, and avoid creating a MethodInvocation.
              if (chain.isEmpty()) {
                  // We can skip creating a MethodInvocation: just invoke the target directly
                  // Note that the final invoker must be an InvokerInterceptor so we know it does
                  // nothing but a reflective operation on the target, and no hot swapping or fancy proxying.
                  Object[] argsToUse = AopProxyUtils.adaptArgumentsIfNecessary(method, args);
                  retVal = AopUtils.invokeJoinpointUsingReflection(target, method, argsToUse);
              }
              else {
                  // We need to create a method invocation...
                  MethodInvocation invocation =
                          new ReflectiveMethodInvocation(proxy, target, method, args, targetClass, chain);
                  // Proceed to the joinpoint through the interceptor chain.
                  retVal = invocation.proceed();
              }
  
              // Massage return value if necessary.
              Class<?> returnType = method.getReturnType();
              if (retVal != null && retVal == target &&
                      returnType != Object.class && returnType.isInstance(proxy) &&
                      !RawTargetAccess.class.isAssignableFrom(method.getDeclaringClass())) {
                  // Special case: it returned "this" and the return type of the method
                  // is type-compatible. Note that we can't help if the target sets
                  // a reference to itself in another returned object.
                  retVal = proxy;
              }
             else if (retVal == null && returnType != Void.TYPE && returnType.isPrimitive()) {
                 throw new AopInvocationException(
                         "Null return value from advice does not match primitive return type for: " + method);
             }
             return retVal;
         }
         finally {
             if (target != null && !targetSource.isStatic()) {
                 // Must have come from TargetSource.
                 targetSource.releaseTarget(target);
             }
             if (setProxyContext) {
                 // Restore old proxy.
                 AopContext.setCurrentProxy(oldProxy);
             }
         }
     }
 
 }
```



我们看到JdkDynamicAopProxy 也是和我们自定义的**InvocationHandler**一样，实现了InvocationHandler接口，并且提供了一个getProxy方法创建代理类，重写invoke方法。

我们重点看看代理类的调用。了解Jdk动态代理的话都会知道，在实现Jdk动态代理功能，要实现InvocationHandler接口的invoke方法（这个方法是一个回调方法）。 被代理类中的方法被调用时，实际上是调用的invoke方法，我们看一看这个方法的实现。

```java
 @Override
 @Nullable
 public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
     MethodInvocation invocation;
     Object oldProxy = null;
     boolean setProxyContext = false;
 
     TargetSource targetSource = this.advised.targetSource;
     Object target = null;
 
     try {
         if (!this.equalsDefined && AopUtils.isEqualsMethod(method)) {
             return equals(args[0]);
         }
         else if (!this.hashCodeDefined && AopUtils.isHashCodeMethod(method)) {
             return hashCode();
         }
         else if (method.getDeclaringClass() == DecoratingProxy.class) {
             return AopProxyUtils.ultimateTargetClass(this.advised);
         }
         else if (!this.advised.opaque && method.getDeclaringClass().isInterface() &&
                 method.getDeclaringClass().isAssignableFrom(Advised.class)) {
             return AopUtils.invokeJoinpointUsingReflection(this.advised, method, args);
         }
 
         Object retVal;
         if (this.advised.exposeProxy) {
             // Make invocation available if necessary.
             oldProxy = AopContext.setCurrentProxy(proxy);
             setProxyContext = true;
         }
 
         target = targetSource.getTarget();
         Class<?> targetClass = (target != null ? target.getClass() : null);
 
         // 获取当前方法的拦截器链
         List<Object> chain = this.advised.getInterceptorsAndDynamicInterceptionAdvice(method, targetClass);
 
         if (chain.isEmpty()) {
             // 如果没有发现任何拦截器那么直接调用切点方法
             Object[] argsToUse = AopProxyUtils.adaptArgumentsIfNecessary(method, args);
             retVal = AopUtils.invokeJoinpointUsingReflection(target, method, argsToUse);
         }
         else {
             // We need to create a method invocation...
             // 将拦截器封装在ReflectiveMethodInvocation，
             // 以便于使用其proceed进行链接表用拦截器
             invocation = new ReflectiveMethodInvocation(proxy, target, method, args, targetClass, chain);
             // Proceed to the joinpoint through the interceptor chain.
             // 执行拦截器链
             retVal = invocation.proceed();
         }
 
         Class<?> returnType = method.getReturnType();
         // 返回结果
         if (retVal != null && retVal == target &&
                 returnType != Object.class && returnType.isInstance(proxy) &&
                 !RawTargetAccess.class.isAssignableFrom(method.getDeclaringClass())) {
             retVal = proxy;
         }
         else if (retVal == null && returnType != Void.TYPE && returnType.isPrimitive()) {
             throw new AopInvocationException(
                     "Null return value from advice does not match primitive return type for: " + method);
         }
         return retVal;
     }
     finally {
         if (target != null && !targetSource.isStatic()) {
             // Must have come from TargetSource.
             targetSource.releaseTarget(target);
         }
         if (setProxyContext) {
             // Restore old proxy.
             AopContext.setCurrentProxy(oldProxy);
         }
     }
 }
```

我们先来看看第37行，获取目标bean中目标method中的增强器，并将增强器封装成拦截器链

```java
 @Override
 public List<Object> getInterceptorsAndDynamicInterceptionAdvice(
         Advised config, Method method, @Nullable Class<?> targetClass) {
 
     // This is somewhat tricky... We have to process introductions first,
     // but we need to preserve order in the ultimate list.
     AdvisorAdapterRegistry registry = GlobalAdvisorAdapterRegistry.getInstance();
     Advisor[] advisors = config.getAdvisors();
     List<Object> interceptorList = new ArrayList<>(advisors.length);
     Class<?> actualClass = (targetClass != null ? targetClass : method.getDeclaringClass());
     Boolean hasIntroductions = null;
 
     //获取bean中的所有增强器
     for (Advisor advisor : advisors) {
         if (advisor instanceof PointcutAdvisor) {
             // Add it conditionally.
             PointcutAdvisor pointcutAdvisor = (PointcutAdvisor) advisor;
             if (config.isPreFiltered() || pointcutAdvisor.getPointcut().getClassFilter().matches(actualClass)) {
                 MethodMatcher mm = pointcutAdvisor.getPointcut().getMethodMatcher();
                 boolean match;
                 if (mm instanceof IntroductionAwareMethodMatcher) {
                     if (hasIntroductions == null) {
                         hasIntroductions = hasMatchingIntroductions(advisors, actualClass);
                     }
                     match = ((IntroductionAwareMethodMatcher) mm).matches(method, actualClass, hasIntroductions);
                 }
                 else {
                     //根据增强器中的Pointcut判断增强器是否能匹配当前类中的method
                     //我们要知道目标Bean中并不是所有的方法都需要增强，也有一些普通方法
                     match = mm.matches(method, actualClass);
                 }
                 if (match) {
                     //如果能匹配，就将advisor封装成MethodInterceptor加入到interceptorList中
                     MethodInterceptor[] interceptors = registry.getInterceptors(advisor);
                     if (mm.isRuntime()) {
                         // Creating a new object instance in the getInterceptors() method
                         // isn't a problem as we normally cache created chains.
                         for (MethodInterceptor interceptor : interceptors) {
                             interceptorList.add(new InterceptorAndDynamicMethodMatcher(interceptor, mm));
                         }
                     }
                     else {
                         interceptorList.addAll(Arrays.asList(interceptors));
                     }
                 }
             }
         }
         else if (advisor instanceof IntroductionAdvisor) {
             IntroductionAdvisor ia = (IntroductionAdvisor) advisor;
             if (config.isPreFiltered() || ia.getClassFilter().matches(actualClass)) {
                 Interceptor[] interceptors = registry.getInterceptors(advisor);
                 interceptorList.addAll(Arrays.asList(interceptors));
             }
         }
         else {
             Interceptor[] interceptors = registry.getInterceptors(advisor);
             interceptorList.addAll(Arrays.asList(interceptors));
         }
     }
 
     return interceptorList;
 }
```

 

我们知道目标Bean中并不是所有的方法都需要增强，所以我们要遍历所有的 Advisor ，根据**Pointcut判断增强器是否能匹配当前类中的method，取出能匹配的增强器，封装成** **MethodInterceptor，加入到拦截器链中**，我们来看看第34行

```java
@Override
public MethodInterceptor[] getInterceptors(Advisor advisor) throws UnknownAdviceTypeException {
    List<MethodInterceptor> interceptors = new ArrayList<>(3);
    Advice advice = advisor.getAdvice();
    if (advice instanceof MethodInterceptor) {
        interceptors.add((MethodInterceptor) advice);
    }
    //这里遍历三个适配器，将对应的advisor转化成Interceptor
    //这三个适配器分别是MethodBeforeAdviceAdapter，AfterReturningAdviceAdapter，ThrowsAdviceAdapter
    for (AdvisorAdapter adapter : this.adapters) {
        if (adapter.supportsAdvice(advice)) {
            interceptors.add(adapter.getInterceptor(advisor));
        }
    }
    if (interceptors.isEmpty()) {
        throw new UnknownAdviceTypeException(advisor.getAdvice());
    }
    return interceptors.toArray(new MethodInterceptor[0]);
}

private final List<AdvisorAdapter> adapters = new ArrayList<>(3);

/**
 * Create a new DefaultAdvisorAdapterRegistry, registering well-known adapters.
 */
public DefaultAdvisorAdapterRegistry() {
    registerAdvisorAdapter(new MethodBeforeAdviceAdapter());
    registerAdvisorAdapter(new AfterReturningAdviceAdapter());
    registerAdvisorAdapter(new ThrowsAdviceAdapter());
}

@Override
public void registerAdvisorAdapter(AdvisorAdapter adapter) {
    this.adapters.add(adapter);
}
```

由于Spring中涉及过多的拦截器，增强器，增强方法等方式来对逻辑进行增强，在上一篇文章中我们知道创建的几个增强器，AspectJAroundAdvice、AspectJAfterAdvice、AspectJAfterThrowingAdvice这几个增强器都实现了 MethodInterceptor 接口，AspectJMethodBeforeAdvice 和AspectJAfterReturningAdvice 并没有实现 MethodInterceptor 接口，因此AspectJMethodBeforeAdvice 和AspectJAfterReturningAdvice不能满足MethodInterceptor 接口中的invoke方法，所以这里使用适配器模式将AspectJMethodBeforeAdvice 和AspectJAfterReturningAdvice转化成能满足需求的MethodInterceptor实现类。

遍历adapters，通过adapter.supportsAdvice(advice)找到advice对应的适配器，adapter.getInterceptor(advisor)将advisor转化成对应的interceptor

接下来我们看看MethodBeforeAdviceAdapter和AfterReturningAdviceAdapter这两个适配器，这两个适配器是将MethodBeforeAdvice和AfterReturningAdvice适配成对应的Interceptor

**MethodBeforeAdviceAdapter**

```java
class MethodBeforeAdviceAdapter implements AdvisorAdapter, Serializable {
    @Override
    public boolean supportsAdvice(Advice advice) {
        //判断是否是MethodBeforeAdvice类型的advice
        return (advice instanceof MethodBeforeAdvice);
    }

    @Override
    public MethodInterceptor getInterceptor(Advisor advisor) {
        MethodBeforeAdvice advice = (MethodBeforeAdvice) advisor.getAdvice();
        //将advice封装成MethodBeforeAdviceInterceptor
        return new MethodBeforeAdviceInterceptor(advice);
    }
}

//MethodBeforeAdviceInterceptor实现了MethodInterceptor接口，实现了invoke方法，并将advice作为属性
public class MethodBeforeAdviceInterceptor implements MethodInterceptor, BeforeAdvice, Serializable {

    private final MethodBeforeAdvice advice;

    public MethodBeforeAdviceInterceptor(MethodBeforeAdvice advice) {
        Assert.notNull(advice, "Advice must not be null");
        this.advice = advice;
    }
    
    @Override
    public Object invoke(MethodInvocation mi) throws Throwable {
        this.advice.before(mi.getMethod(), mi.getArguments(), mi.getThis());
        return mi.proceed();
    }

}
```

**AfterReturningAdviceAdapter**

```java
class AfterReturningAdviceAdapter implements AdvisorAdapter, Serializable {
    @Override
    public boolean supportsAdvice(Advice advice) {
        return (advice instanceof AfterReturningAdvice);
    }

    @Override
    public MethodInterceptor getInterceptor(Advisor advisor) {
        AfterReturningAdvice advice = (AfterReturningAdvice) advisor.getAdvice();
        return new AfterReturningAdviceInterceptor(advice);
    }
}

public class AfterReturningAdviceInterceptor implements MethodInterceptor, AfterAdvice, Serializable {

    private final AfterReturningAdvice advice;

    public AfterReturningAdviceInterceptor(AfterReturningAdvice advice) {
        Assert.notNull(advice, "Advice must not be null");
        this.advice = advice;
    }

    @Override
    public Object invoke(MethodInvocation mi) throws Throwable {
        Object retVal = mi.proceed();
        this.advice.afterReturning(retVal, mi.getMethod(), mi.getArguments(), mi.getThis());
        return retVal;
    }

}
```

至此我们获取到了一个拦截器链，链中包括AspectJAroundAdvice、AspectJAfterAdvice、AspectJAfterThrowingAdvice、MethodBeforeAdviceInterceptor、AfterReturningAdviceInterceptor

接下来 ReflectiveMethodInvocation 类进行了链的封装，而在ReflectiveMethodInvocation类的proceed方法中实现了拦截器的逐一调用，那么我们继续来探究，在proceed方法中是怎么实现前置增强在目标方法前调用后置增强在目标方法后调用的逻辑呢？

我们先来看看ReflectiveMethodInvocation的构造器，只是简单的进行属性赋值，不过我们要注意有一个特殊的变量currentInterceptorIndex，这个变量代表执行Interceptor的下标，从-1开始，Interceptor执行一个，先++this.currentInterceptorIndex

```java
protected ReflectiveMethodInvocation(
        Object proxy, @Nullable Object target, Method method, @Nullable Object[] arguments,
        @Nullable Class<?> targetClass, List<Object> interceptorsAndDynamicMethodMatchers) {

    this.proxy = proxy;
    this.target = target;
    this.targetClass = targetClass;
    this.method = BridgeMethodResolver.findBridgedMethod(method);
    this.arguments = AopProxyUtils.adaptArgumentsIfNecessary(method, arguments);
    this.interceptorsAndDynamicMethodMatchers = interceptorsAndDynamicMethodMatchers;
}

private int currentInterceptorIndex = -1;
```

下面是ReflectiveMethodInvocation类Proceed方法：

```java
public Object proceed() throws Throwable {
    // 首先，判断是不是所有的interceptor（也可以想像成advisor）都被执行完了。
    // 判断的方法是看currentInterceptorIndex这个变量的值，增加到Interceptor总个数这个数值没有，
    // 如果到了，就执行被代理方法(invokeJoinpoint())；如果没到，就继续执行Interceptor。
    if (this.currentInterceptorIndex == this.interceptorsAndDynamicMethodMatchers.size() - 1) {
        return invokeJoinpoint();
    }

    // 如果Interceptor没有被全部执行完，就取出要执行的Interceptor，并执行。
    // currentInterceptorIndex先自增
    Object interceptorOrInterceptionAdvice =this.interceptorsAndDynamicMethodMatchers.get(++this.currentInterceptorIndex);
    // 如果Interceptor是PointCut类型
    if (interceptorOrInterceptionAdvice instanceof InterceptorAndDynamicMethodMatcher) {
        InterceptorAndDynamicMethodMatcher dm = (InterceptorAndDynamicMethodMatcher) interceptorOrInterceptionAdvice;
        // 如果当前方法符合Interceptor的PointCut限制，就执行Interceptor
        if (dm.methodMatcher.matches(this.method, this.targetClass, this.arguments)) {
        　　 // 这里将this当变量传进去，这是非常重要的一点
            return dm.interceptor.invoke(this);
        }
        // 如果不符合，就跳过当前Interceptor，执行下一个Interceptor
        else {
            return proceed();
        }
    }
    // 如果Interceptor不是PointCut类型，就直接执行Interceptor里面的增强。
    else {
        return ((MethodInterceptor) interceptorOrInterceptionAdvice).invoke(this);
    }
}
```



下一篇文章讲解目标方法和增强方法是如何执行的。





最后给大家分享**200多本计算机经典书籍PDF电子书**，包括**C语言、C++、Java、Python、前端、数据库、操作系统、计算机网络、数据结构和算法、机器学习、编程人生**等，感兴趣的小伙伴可以自取：

![](http://img.topjavaer.cn/image/Image.png)

![](http://img.topjavaer.cn/image/image-20221030094126118.png)

https://mp.weixin.qq.com/s?__biz=Mzg2OTY1NzY0MQ==&mid=2247486208&idx=1&sn=dbeedf47c50b1be67b2ef31a901b8b56&chksm=ce98f646f9ef7f506a1f7d72fc9384ba1b518072b44d157f657a8d5495a1c78c3e5de0b41efd&token=1652861108&lang=zh_CN#rd