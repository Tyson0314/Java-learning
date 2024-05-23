---
sidebar: heading
title: Spring源码分析
category: 源码分析
tag:
  - Spring
head:
  - - meta
    - name: keywords
      content: Spring源码,标签解析,源码分析,代理,目标方法,增强方法,Spring设计模式,Spring AOP,Spring IOC,Bean,Bean生命周期
  - - meta
    - name: description
      content: 高质量的Spring源码分析总结
---

**正文**

上一篇博文中我们讲了代理类的生成，这一篇主要讲解剩下的部分，当代理类调用时，目标方法和代理方法是如何执行的,我们还是接着上篇的ReflectiveMethodInvocation类Proceed方法来看。[最全面的Java面试网站](https://topjavaer.cn)

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
     Object interceptorOrInterceptionAdvice = this.interceptorsAndDynamicMethodMatchers.get(++this.currentInterceptorIndex);
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

我们先来看一张方法调用顺序图

![](http://img.topjavaer.cn/img/202310011108435.png)

我们看到链中的顺序是AspectJAfterThrowingAdvice、AfterReturningAdviceInterceptor、AspectJAfterAdvice、MethodBeforeAdviceInterceptor，这些拦截器是按顺序执行的，那我们来看看第一个拦截器AspectJAfterThrowingAdvice中的invoke方法

> 分享一份大彬精心整理的**大厂面试手册**，包含**计算机基础、Java基础、多线程、JVM、数据库、Redis、Spring、Mybatis、SpringMVC、SpringBoot、分布式、微服务、设计模式、架构、校招社招分享**等高频面试题，非常实用，有小伙伴靠着这份手册拿过字节offer~
>
> ![](http://img.topjavaer.cn/image/image-20211127150136157.png)
>
> ![](http://img.topjavaer.cn/image/image-20220316234337881.png)
>
> 需要的小伙伴可以自行**下载**：
>
> http://mp.weixin.qq.com/s?__biz=Mzg2OTY1NzY0MQ==&mid=2247485445&idx=1&sn=1c6e224b9bb3da457f5ee03894493dbc&chksm=ce98f543f9ef7c55325e3bf336607a370935a6c78dbb68cf86e59f5d68f4c51d175365a189f8#rd

## **AspectJAfterThrowingAdvice**

```java
 @Override
 public Object invoke(MethodInvocation mi) throws Throwable {
     try {
         //直接调用MethodInvocation的proceed方法
         //从proceed()方法中我们知道dm.interceptor.invoke(this)传过来的参数就是ReflectiveMethodInvocation执行器本身
         //这里又直接调用了ReflectiveMethodInvocation的proceed()方法
         return mi.proceed();
     }
     catch (Throwable ex) {
         if (shouldInvokeOnThrowing(ex)) {
             invokeAdviceMethod(getJoinPointMatch(), null, ex);
         }
         throw ex;
     }
 }
```

第一个拦截器AspectJAfterThrowingAdvice的invoke方法中，直接调用mi.proceed();，从proceed()方法中我们知道dm.interceptor.invoke(this)传过来的参数就是ReflectiveMethodInvocation执行器本身，所以又会执行proceed()方法，拦截器下标currentInterceptorIndex自增，获取下一个拦截器AfterReturningAdviceInterceptor，并调用拦截器中的invoke方法,，此时第一个拦截器在invoke()方法的第七行卡住了，接下来我们看第二个拦截器的执行

## **AfterReturningAdviceInterceptor**

```java
 @Override
 public Object invoke(MethodInvocation mi) throws Throwable {
     //直接调用MethodInvocation的proceed方法
     Object retVal = mi.proceed();
     this.advice.afterReturning(retVal, mi.getMethod(), mi.getArguments(), mi.getThis());
     return retVal;
 }
```

AfterReturningAdviceInterceptor还是直接调用mi.proceed()，又回到了ReflectiveMethodInvocation的proceed()方法中，此时AfterReturningAdviceInterceptor方法卡在第四行，接着回到ReflectiveMethodInvocation的proceed()方法中，拦截器下标currentInterceptorIndex自增，获取下一个拦截器AspectJAfterAdvice，并调用AspectJAfterAdvice中的invoke方法

## **AspectJAfterAdvice**

```java
 @Override
 public Object invoke(MethodInvocation mi) throws Throwable {
     try {
         //直接调用MethodInvocation的proceed方法
         return mi.proceed();
     }
     finally {
         invokeAdviceMethod(getJoinPointMatch(), null, null);
     }
 }
```

AspectJAfterAdvice还是直接调用mi.proceed()，又回到了ReflectiveMethodInvocation的proceed()方法中，此时**AspectJAfterAdvice**方法卡在第五行，接着回到ReflectiveMethodInvocation的proceed()方法中，拦截器下标currentInterceptorIndex自增，获取下一个拦截器MethodBeforeAdviceInterceptor，并调用MethodBeforeAdviceInterceptor中的invoke方法

## **MethodBeforeAdviceInterceptor**

```java
 @Override
 public Object invoke(MethodInvocation mi) throws Throwable {
     //终于开始做事了，调用增强器的before方法，明显是通过反射的方式调用
     //到这里增强方法before的业务逻辑执行
     this.advice.before(mi.getMethod(), mi.getArguments(), mi.getThis());
     //又调用了调用MethodInvocation的proceed方法
     return mi.proceed();
 }
```

第5行代码终于通过反射调用了切面里面的before方法，接着又调用mi.proceed()，我们知道这是最后一个拦截器了，此时this.currentInterceptorIndex == this.interceptorsAndDynamicMethodMatchers.size() - 1应该为true了，那么就会执行 return invokeJoinpoint();，也就是执行bean中的目标方法，接着我们来看看目标方法的执行

```java
@Nullable
protected Object invokeJoinpoint() throws Throwable {
    return AopUtils.invokeJoinpointUsingReflection(this.target, this.method, this.arguments);
}

    @Nullable
public static Object invokeJoinpointUsingReflection(@Nullable Object target, Method method, Object[] args)
        throws Throwable {

    // Use reflection to invoke the method.
    try {
        ReflectionUtils.makeAccessible(method);
        //直接通过反射调用目标bean中的method
        return method.invoke(target, args);
    }
    catch (InvocationTargetException ex) {
        // Invoked method threw a checked exception.
        // We must rethrow it. The client won't see the interceptor.
        throw ex.getTargetException();
    }
    catch (IllegalArgumentException ex) {
        throw new AopInvocationException("AOP configuration seems to be invalid: tried calling method [" +
                method + "] on target [" + target + "]", ex);
    }
    catch (IllegalAccessException ex) {
        throw new AopInvocationException("Could not access method [" + method + "]", ex);
    }
}
```

before方法执行完后，就通过反射的方式执行目标bean中的method，并且返回结果，接下来我们想想程序该怎么执行呢？

1 、MethodBeforeAdviceInterceptor执行完了后，开始退栈，AspectJAfterAdvice中invoke卡在第5行的代码继续往下执行, 我们看到在AspectJAfterAdvice的invoke方法中的finally中第8行有这样一句话 invokeAdviceMethod(getJoinPointMatch(), null, null);，就是通过反射调用AfterAdvice的方法，意思是切面类中的 @After方法不管怎样都会执行，因为在finally中

 2、AspectJAfterAdvice中invoke方法发执行完后，也开始退栈，接着就到了AfterReturningAdviceInterceptor的invoke方法的第4行开始恢复，但是此时如果目标bean和前面增强器中出现了异常，此时AfterReturningAdviceInterceptor中第5行代码就不会执行了，直接退栈；如果没有出现异常，则执行第5行，也就是通过反射执行切面类中@AfterReturning注解的方法，然后退栈

3、AfterReturningAdviceInterceptor退栈后，就到了AspectJAfterThrowingAdvice拦截器，此拦截器中invoke方法的第7行开始恢复，我们看到在 catch (Throwable ex) { 代码中，也就是第11行 invokeAdviceMethod(getJoinPointMatch(), null, ex);，如果目标bean的method或者前面的增强方法中出现了异常，则会被这里的catch捕获，也是通过反射的方式执行@AfterThrowing注解的方法，然后退栈\



## 总结

这个代理类调用过程，我们可以看到是一个递归的调用过程，通过ReflectiveMethodInvocation类中Proceed方法递归调用，顺序执行拦截器链中AspectJAfterThrowingAdvice、AfterReturningAdviceInterceptor、AspectJAfterAdvice、MethodBeforeAdviceInterceptor这几个拦截器，在拦截器中反射调用增强方法



最后给大家分享一个Github仓库，上面有大彬整理的**300多本经典的计算机书籍PDF**，包括**C语言、C++、Java、Python、前端、数据库、操作系统、计算机网络、数据结构和算法、机器学习、编程人生**等，可以star一下，下次找书直接在上面搜索，仓库持续更新中~

![](http://img.topjavaer.cn/image/Image.png)

![](http://img.topjavaer.cn/image/image-20221030094126118.png)

[**Github地址**](https://github.com/Tyson0314/java-books)

如果访问不了Github，可以访问码云地址。

[码云地址](https://gitee.com/tysondai/java-books)