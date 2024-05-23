---
sidebar: heading
title: Spring源码分析
category: 源码分析
tag:
  - Spring
head:
  - - meta
    - name: keywords
      content: Spring源码,标签解析,源码分析,代理,增强器,Spring设计模式,Spring AOP,Spring IOC,Bean,Bean生命周期
  - - meta
    - name: description
      content: 高质量的Spring源码分析总结
---

**正文**

在上一篇的博文中我们讲解了通过自定义配置完成了对AnnotationAwareAspectJAutoProxyCreator类型的自动注册，那么这个类到底做了什么工作来完成AOP的操作呢？首先我们看看AnnotationAwareAspectJAutoProxyCreator的层次结构，如下图所示： 

![](http://img.topjavaer.cn/img/202309262317016.png)

> 内容摘自我的学习网站：topjavaer.cn

从上图的类层次结构图中我们看到这个类实现了BeanPostProcessor接口，而实现BeanPostProcessor后，当Spring加载这个Bean时会在实例化前调用其postProcesssAfterIntialization方法，而我们对于AOP逻辑的分析也由此开始。
首先看下其父类AbstractAutoProxyCreator中的postProcessAfterInitialization方法：

```java
public Object postProcessAfterInitialization(@Nullable Object bean, String beanName) throws BeansException {
    if (bean != null) {
        //根据给定的bean的class和name构建出个key，格式：beanClassName_beanName  
        Object cacheKey = getCacheKey(bean.getClass(), beanName);
        if (!this.earlyProxyReferences.contains(cacheKey)) {
            //如果它适合被代理，则需要封装指定bean  
            return wrapIfNecessary(bean, beanName, cacheKey);
        }
    }
    return bean;
}
```

在上面的代码中用到了方法wrapIfNecessary，继续跟踪到方法内部：

```java
protected Object wrapIfNecessary(Object bean, String beanName, Object cacheKey) {
    // 如果已经处理过
    if (StringUtils.hasLength(beanName) && this.targetSourcedBeans.contains(beanName)) {
        return bean;
    }
    // 无需增强
    if (Boolean.FALSE.equals(this.advisedBeans.get(cacheKey))) {
        return bean;
    }
    // 给定的bean类是否代表一个基础设施类，基础设施类不应代理，或者配置了指定bean不需要自动代理
    if (isInfrastructureClass(bean.getClass()) || shouldSkip(bean.getClass(), beanName)) {
        this.advisedBeans.put(cacheKey, Boolean.FALSE);
        return bean;
    }

    // Create proxy if we have advice.
    // 如果存在增强方法则创建代理
    Object[] specificInterceptors = getAdvicesAndAdvisorsForBean(bean.getClass(), beanName, null);
    // 如果获取到了增强则需要针对增强创建代理
    if (specificInterceptors != DO_NOT_PROXY) {
        this.advisedBeans.put(cacheKey, Boolean.TRUE);
        // 创建代理
        Object proxy = createProxy(
                bean.getClass(), beanName, specificInterceptors, new SingletonTargetSource(bean));
        this.proxyTypes.put(cacheKey, proxy.getClass());
        return proxy;
    }

    this.advisedBeans.put(cacheKey, Boolean.FALSE);
    return bean;
}
```

函数中我们已经看到了代理创建的雏形。当然，真正开始之前还需要经过一些判断，比如是否已经处理过或者是否是需要跳过的bean，而真正创建代理的代码是从getAdvicesAndAdvisorsForBean开始的。

创建代理主要包含了两个步骤：

（1）获取增强方法或者增强器；

（2）根据获取的增强进行代理。 

其中逻辑复杂，我们首先来看看获取增强方法的实现逻辑。是在AbstractAdvisorAutoProxyCreator中实现的，代码如下：

**AbstractAdvisorAutoProxyCreator**

```java
protected Object[] getAdvicesAndAdvisorsForBean(
        Class<?> beanClass, String beanName, @Nullable TargetSource targetSource) {

    List<Advisor> advisors = findEligibleAdvisors(beanClass, beanName);
    if (advisors.isEmpty()) {
        return DO_NOT_PROXY;
    }
    return advisors.toArray();
}
protected List<Advisor> findEligibleAdvisors(Class<?> beanClass, String beanName) {
    List<Advisor> candidateAdvisors = findCandidateAdvisors();
    List<Advisor> eligibleAdvisors = findAdvisorsThatCanApply(candidateAdvisors, beanClass, beanName);
    extendAdvisors(eligibleAdvisors);
    if (!eligibleAdvisors.isEmpty()) {
        eligibleAdvisors = sortAdvisors(eligibleAdvisors);
    }
    return eligibleAdvisors;
}
```

对于指定bean的增强方法的获取一定是包含两个步骤的，获取所有的增强以及寻找所有增强中使用于bean的增强并应用，那么**findCandidateAdvisors**与**findAdvisorsThatCanApply**便是做了这两件事情。当然，如果无法找到对应的增强器便返回DO_NOT_PROXY，其中DO_NOT_PROXY=null。

> 分享一份大彬精心整理的**大厂面试手册**，包含**计算机基础、Java基础、多线程、JVM、数据库、Redis、Spring、Mybatis、SpringMVC、SpringBoot、分布式、微服务、设计模式、架构、校招社招分享**等高频面试题，非常实用，有小伙伴靠着这份手册拿过字节offer~
>
> ![](http://img.topjavaer.cn/image/image-20211127150136157.png)
>
> ![](http://img.topjavaer.cn/image/image-20220316234337881.png)
>
> 需要的小伙伴可以自行**下载**：
>
> http://mp.weixin.qq.com/s?__biz=Mzg2OTY1NzY0MQ==&mid=2247485445&idx=1&sn=1c6e224b9bb3da457f5ee03894493dbc&chksm=ce98f543f9ef7c55325e3bf336607a370935a6c78dbb68cf86e59f5d68f4c51d175365a189f8#rd

## 获取增强器

由于我们分析的是使用注解进行的AOP，所以对于findCandidateAdvisors的实现其实是由AnnotationAwareAspectJAutoProxyCreator类完成的，我们继续跟踪AnnotationAwareAspectJAutoProxyCreator的findCandidateAdvisors方法。代码如下

```java
@Override
protected List<Advisor> findCandidateAdvisors() {
    // Add all the Spring advisors found according to superclass rules.
    // 当使用注解方式配置AOP的时候并不是丢弃了对XML配置的支持，
    // 在这里调用父类方法加载配置文件中的AOP声明
    List<Advisor> advisors = super.findCandidateAdvisors();
    // Build Advisors for all AspectJ aspects in the bean factory.
    if (this.aspectJAdvisorsBuilder != null) {
        advisors.addAll(this.aspectJAdvisorsBuilder.buildAspectJAdvisors());
    }
    return advisors;
}
```

AnnotationAwareAspectJAutoProxyCreator间接继承了AbstractAdvisorAutoProxyCreator，在实现获取增强的方法中除了保留父类的获取配置文件中定义的增强外，同时添加了获取Bean的注解增强的功能，那么其实现正是由this.aspectJAdvisorsBuilder.buildAspectJAdvisors()来实现的。

在真正研究代码之前读者可以尝试着自己去想象一下解析思路，看看自己的实现与Spring是否有差别呢？

（1）获取所有beanName，这一步骤中所有在beanFactory中注册的Bean都会被提取出来。

（2）遍历所有beanName，并找出声明AspectJ注解的类，进行进一步的处理。

（3）对标记为AspectJ注解的类进行增强器的提取。

（4）将提取结果加入缓存。 

```java
public List<Advisor> buildAspectJAdvisors() {
    List<String> aspectNames = this.aspectBeanNames;

    if (aspectNames == null) {
        synchronized (this) {
            aspectNames = this.aspectBeanNames;
            if (aspectNames == null) {
                List<Advisor> advisors = new ArrayList<>();
                aspectNames = new ArrayList<>();
                // 获取所有的beanName
                String[] beanNames = BeanFactoryUtils.beanNamesForTypeIncludingAncestors(
                        this.beanFactory, Object.class, true, false);
                // 循环所有的beanName找出对应的增强方法
                for (String beanName : beanNames) {
                    // 不合法的bean则略过，由子类定义规则，默认返回true
                    if (!isEligibleBean(beanName)) {
                        continue;
                    }
                    // We must be careful not to instantiate beans eagerly as in this case they
                    // would be cached by the Spring container but would not have been weaved.
                    // 获取对应的bean的Class类型
                    Class<?> beanType = this.beanFactory.getType(beanName);
                    if (beanType == null) {
                        continue;
                    }
                    // 如果存在Aspect注解
                    if (this.advisorFactory.isAspect(beanType)) {
                        aspectNames.add(beanName);
                        AspectMetadata amd = new AspectMetadata(beanType, beanName);
                        if (amd.getAjType().getPerClause().getKind() == PerClauseKind.SINGLETON) {
                            MetadataAwareAspectInstanceFactory factory =
                                    new BeanFactoryAspectInstanceFactory(this.beanFactory, beanName);
                            // 解析标记Aspect注解中的增强方法
                            List<Advisor> classAdvisors = this.advisorFactory.getAdvisors(factory);
                            if (this.beanFactory.isSingleton(beanName)) {
                                //将增强器存入缓存中，下次可以直接取
                                this.advisorsCache.put(beanName, classAdvisors);
                            }
                            else {
                                this.aspectFactoryCache.put(beanName, factory);
                            }
                            advisors.addAll(classAdvisors);
                        }
                        else {
                            // Per target or per this.
                            if (this.beanFactory.isSingleton(beanName)) {
                                throw new IllegalArgumentException("Bean with name '" + beanName +
                                        "' is a singleton, but aspect instantiation model is not singleton");
                            }
                            MetadataAwareAspectInstanceFactory factory =
                                    new PrototypeAspectInstanceFactory(this.beanFactory, beanName);
                            this.aspectFactoryCache.put(beanName, factory);
                            advisors.addAll(this.advisorFactory.getAdvisors(factory));
                        }
                    }
                }
                this.aspectBeanNames = aspectNames;
                return advisors;
            }
        }
    }

    if (aspectNames.isEmpty()) {
        return Collections.emptyList();
    }
    // 记录在缓存中
    List<Advisor> advisors = new ArrayList<>();
    for (String aspectName : aspectNames) {
        List<Advisor> cachedAdvisors = this.advisorsCache.get(aspectName);
        if (cachedAdvisors != null) {
            advisors.addAll(cachedAdvisors);
        }
        else {
            MetadataAwareAspectInstanceFactory factory = this.aspectFactoryCache.get(aspectName);
            advisors.addAll(this.advisorFactory.getAdvisors(factory));
        }
    }
    return advisors;
}
```

至此，我们已经完成了Advisor的提取，在上面的步骤中最为重要也最为繁杂的就是增强器的获取，而这一切功能委托给了getAdvisors方法去实现（this.advisorFactory.getAdvisors(factory)）。

我们先来看看 **this.advisorFactory.isAspect(beanType)**

```java
@Override
public boolean isAspect(Class<?> clazz) {
    return (hasAspectAnnotation(clazz) && !compiledByAjc(clazz));
}
private boolean hasAspectAnnotation(Class<?> clazz) {
    return (AnnotationUtils.findAnnotation(clazz, Aspect.class) != null);
}

@Nullable
private static <A extends Annotation> A findAnnotation(Class<?> clazz, Class<A> annotationType, Set<Annotation> visited) {
    try {
        //判断此Class 是否存在Aspect.class注解
        A annotation = clazz.getDeclaredAnnotation(annotationType);
        if (annotation != null) {
            return annotation;
        }
        for (Annotation declaredAnn : getDeclaredAnnotations(clazz)) {
            Class<? extends Annotation> declaredType = declaredAnn.annotationType();
            if (!isInJavaLangAnnotationPackage(declaredType) && visited.add(declaredAnn)) {
                annotation = findAnnotation(declaredType, annotationType, visited);
                if (annotation != null) {
                    return annotation;
                }
            }
        }
    }
}
```

如果 bean 存在 Aspect.class注解，就可以获取此bean中的增强器了，接着我们来看看 `List<Advisor> classAdvisors = this.advisorFactory.getAdvisors(factory)`;

```java
@Override
public List<Advisor> getAdvisors(MetadataAwareAspectInstanceFactory aspectInstanceFactory) {
    // 获取标记为AspectJ的类
    Class<?> aspectClass = aspectInstanceFactory.getAspectMetadata().getAspectClass();
    // 获取标记为AspectJ的name
    String aspectName = aspectInstanceFactory.getAspectMetadata().getAspectName();
    validate(aspectClass);

    // We need to wrap the MetadataAwareAspectInstanceFactory with a decorator
    // so that it will only instantiate once.
    MetadataAwareAspectInstanceFactory lazySingletonAspectInstanceFactory =
            new LazySingletonAspectInstanceFactoryDecorator(aspectInstanceFactory);

    List<Advisor> advisors = new ArrayList<>();
    
    // 对aspectClass的每一个带有注解的方法进行循环（带有PointCut注解的方法除外），取得Advisor，并添加到集合里。
    // (这是里应该是取得Advice，然后取得我们自己定义的切面类中PointCut，组合成Advisor)
    for (Method method : getAdvisorMethods(aspectClass)) {
        //将类中的方法封装成Advisor
        Advisor advisor = getAdvisor(method, lazySingletonAspectInstanceFactory, advisors.size(), aspectName);
        if (advisor != null) {
            advisors.add(advisor);
        }
    }

    // If it's a per target aspect, emit the dummy instantiating aspect.
    if (!advisors.isEmpty() && lazySingletonAspectInstanceFactory.getAspectMetadata().isLazilyInstantiated()) {
        Advisor instantiationAdvisor = new SyntheticInstantiationAdvisor(lazySingletonAspectInstanceFactory);
        advisors.add(0, instantiationAdvisor);
    }

    // Find introduction fields.
    for (Field field : aspectClass.getDeclaredFields()) {
        Advisor advisor = getDeclareParentsAdvisor(field);
        if (advisor != null) {
            advisors.add(advisor);
        }
    }

    return advisors;
}
```



### 普通增强器的获取

普通增强器的获取逻辑通过getAdvisor方法实现，实现步骤包括对切点的注解的获取以及根据注解信息生成增强。我们先来看看 getAdvisorMethods(aspectClass)，这个方法，通过很巧妙的使用接口，定义一个匿名回调，把带有注解的Method都取得出来，放到集合里

```java
private List<Method> getAdvisorMethods(Class<?> aspectClass) {
    final List<Method> methods = new LinkedList<Method>();
    ReflectionUtils.doWithMethods(aspectClass, new ReflectionUtils.MethodCallback() {
        @Override
        public void doWith(Method method) throws IllegalArgumentException {
            // Exclude pointcuts
            // 将没有使用Pointcut.class注解的方法加入到集合中
            if (AnnotationUtils.getAnnotation(method, Pointcut.class) == null) {
                methods.add(method);
            }
        }
    });
    Collections.sort(methods, METHOD_COMPARATOR);
    return methods;
}

public static void doWithMethods(Class<?> clazz, MethodCallback mc, @Nullable MethodFilter mf) {
    // Keep backing up the inheritance hierarchy.
    // 通过反射获取类中所有的方法
    Method[] methods = getDeclaredMethods(clazz);
    //遍历所有的方法
    for (Method method : methods) {
        if (mf != null && !mf.matches(method)) {
            continue;
        }
        try {
            //调用函数体
            mc.doWith(method);
        }
        catch (IllegalAccessException ex) {
            throw new IllegalStateException("Not allowed to access method '" + method.getName() + "': " + ex);
        }
    }
    if (clazz.getSuperclass() != null) {
        doWithMethods(clazz.getSuperclass(), mc, mf);
    }
    else if (clazz.isInterface()) {
        for (Class<?> superIfc : clazz.getInterfaces()) {
            doWithMethods(superIfc, mc, mf);
        }
    }
}
```

普通增强器的获取逻辑通过 **getAdvisor** 方法来实现，实现步骤包括对切点的注解以及根据注解信息生成增强。

```java
public Advisor getAdvisor(Method candidateAdviceMethod, MetadataAwareAspectInstanceFactory aif,
        int declarationOrderInAspect, String aspectName) {

    validate(aif.getAspectMetadata().getAspectClass());
    // 获取PointCut信息（主要是PointCut里的表达式）
    // 把Method对象也传进去的目的是，比较Method对象上的注解，是不是下面注解其中一个
    // 如果不是，返回null；如果是，就把取得PointCut内容包装返回
    // 被比较注解：Before.class, Around.class, After.class, AfterReturning.class, AfterThrowing.class, Pointcut.class
    AspectJExpressionPointcut ajexp =
            getPointcut(candidateAdviceMethod, aif.getAspectMetadata().getAspectClass());
    if (ajexp == null) {
        return null;
    }
    // 根据PointCut信息生成增强器
    return new InstantiationModelAwarePointcutAdvisorImpl(
            this, ajexp, aif, candidateAdviceMethod, declarationOrderInAspect, aspectName);
}
```

**（1）切点信息的获取** 

所谓获取切点信息就是指定注解的表达式信息的获取，如@Before("test()")。

```java
private AspectJExpressionPointcut getPointcut(Method candidateAdviceMethod, Class<?> candidateAspectClass) {
    // 获取方法上的注解
    // 比较Method对象上的注解，是不是下面注解其中一个，如果不是返回null
    // 被比较注解：Before.class, Around.class, After.class, AfterReturning.class, AfterThrowing.class, Pointcut.class
    AspectJAnnotation<?> aspectJAnnotation = AbstractAspectJAdvisorFactory.findAspectJAnnotationOnMethod(candidateAdviceMethod);
    if (aspectJAnnotation == null) {
        return null;
    }
    // 使用AspectJExpressionPointcut 实例封装获取的信息
    AspectJExpressionPointcut ajexp = new AspectJExpressionPointcut(candidateAspectClass, new String[0], new Class<?>[0]);

    // 提取得到的注解中的表达式如：
    // @Pointcut（"execution（* test.TestBean.*(..)）"）
    ajexp.setExpression(aspectJAnnotation.getPointcutExpression());
    return ajexp;
}
```

详细看下上面方法中使用到的方法findAspectJAnnotationOnMethod

```java
protected static AspectJAnnotation<?> findAspectJAnnotationOnMethod(Method method) {
    // 设置要查找的注解类，看看方法的上注解是不是这些注解其中之一
    Class<?>[] classesToLookFor = new Class<?>[] {
            Before.class, Around.class, After.class, AfterReturning.class, AfterThrowing.class, Pointcut.class};
    for (Class<?> c : classesToLookFor) {
        AspectJAnnotation<?> foundAnnotation = findAnnotation(method, (Class<Annotation>) c);
        if (foundAnnotation != null) {
            return foundAnnotation;
        }
    }
    return null;
}
```

在上面方法中又用到了方法findAnnotation，继续跟踪代码：

```java
// 获取指定方法上的注解并使用 AspectJAnnotation 封装
private static <A extends Annotation> AspectJAnnotation<A> findAnnotation(Method method, Class<A> toLookFor) {
    A result = AnnotationUtils.findAnnotation(method, toLookFor);
    if (result != null) {
        return new AspectJAnnotation<A>(result);
    }
    else {
        return null;
    }
}
```

此方法的功能是获取指定方法上的注解并使用AspectJAnnotation封装。 

**（2）根据切点信息生成增强类** 

所有的增强都有Advisor实现类InstantiationModelAwarePontcutAdvisorImpl进行统一封装的。我们看下其构造函数：

```java
public InstantiationModelAwarePointcutAdvisorImpl(AspectJAdvisorFactory af, AspectJExpressionPointcut ajexp,
        MetadataAwareAspectInstanceFactory aif, Method method, int declarationOrderInAspect, String aspectName) {

    this.declaredPointcut = ajexp;
    this.method = method;
    this.atAspectJAdvisorFactory = af;
    this.aspectInstanceFactory = aif;
    this.declarationOrder = declarationOrderInAspect;
    this.aspectName = aspectName;

    if (aif.getAspectMetadata().isLazilyInstantiated()) {
        // Static part of the pointcut is a lazy type.
        Pointcut preInstantiationPointcut =
                Pointcuts.union(aif.getAspectMetadata().getPerClausePointcut(), this.declaredPointcut);

        // Make it dynamic: must mutate from pre-instantiation to post-instantiation state.
        // If it's not a dynamic pointcut, it may be optimized out
        // by the Spring AOP infrastructure after the first evaluation.
        this.pointcut = new PerTargetInstantiationModelPointcut(this.declaredPointcut, preInstantiationPointcut, aif);
        this.lazy = true;
    }
    else {
        // A singleton aspect.
        // 初始化Advice
        this.instantiatedAdvice = instantiateAdvice(this.declaredPointcut);
        this.pointcut = declaredPointcut;
        this.lazy = false;
    }
}
```

通过对上面构造函数的分析，发现封装过程只是简单地将信息封装在类的实例中，所有的额信息单纯地复制。在实例初始化的过程中还完成了对于增强器的初始化。因为不同的增强所体现的逻辑是不同的，比如@Before（“test（）”）与After（“test（）”）标签的不同就是增强器增强的位置不同，所以就需要不同的增强器来完成不同的逻辑，而根据注解中的信息初始化对应的额增强器就是在instantiateAdvice函数中实现的，继续跟踪代码：

```java
private Advice instantiateAdvice(AspectJExpressionPointcut pointcut) {
    Advice advice = this.aspectJAdvisorFactory.getAdvice(this.aspectJAdviceMethod, pointcut,
            this.aspectInstanceFactory, this.declarationOrder, this.aspectName);
    return (advice != null ? advice : EMPTY_ADVICE);
}

    @Override
@Nullable
public Advice getAdvice(Method candidateAdviceMethod, AspectJExpressionPointcut expressionPointcut,
        MetadataAwareAspectInstanceFactory aspectInstanceFactory, int declarationOrder, String aspectName) {

    Class<?> candidateAspectClass = aspectInstanceFactory.getAspectMetadata().getAspectClass();
    validate(candidateAspectClass);

    AspectJAnnotation<?> aspectJAnnotation =
            AbstractAspectJAdvisorFactory.findAspectJAnnotationOnMethod(candidateAdviceMethod);
    if (aspectJAnnotation == null) {
        return null;
    }

    // If we get here, we know we have an AspectJ method.
    // Check that it's an AspectJ-annotated class
    if (!isAspect(candidateAspectClass)) {
        throw new AopConfigException("Advice must be declared inside an aspect type: " +
                "Offending method '" + candidateAdviceMethod + "' in class [" +
                candidateAspectClass.getName() + "]");
    }

    if (logger.isDebugEnabled()) {
        logger.debug("Found AspectJ method: " + candidateAdviceMethod);
    }

    AbstractAspectJAdvice springAdvice;
    // 根据不同的注解类型封装不同的增强器
    switch (aspectJAnnotation.getAnnotationType()) {
        case AtBefore:
            springAdvice = new AspectJMethodBeforeAdvice(
                    candidateAdviceMethod, expressionPointcut, aspectInstanceFactory);
            break;
        case AtAfter:
            springAdvice = new AspectJAfterAdvice(
                    candidateAdviceMethod, expressionPointcut, aspectInstanceFactory);
            break;
        case AtAfterReturning:
            springAdvice = new AspectJAfterReturningAdvice(
                    candidateAdviceMethod, expressionPointcut, aspectInstanceFactory);
            AfterReturning afterReturningAnnotation = (AfterReturning) aspectJAnnotation.getAnnotation();
            if (StringUtils.hasText(afterReturningAnnotation.returning())) {
                springAdvice.setReturningName(afterReturningAnnotation.returning());
            }
            break;
        case AtAfterThrowing:
            springAdvice = new AspectJAfterThrowingAdvice(
                    candidateAdviceMethod, expressionPointcut, aspectInstanceFactory);
            AfterThrowing afterThrowingAnnotation = (AfterThrowing) aspectJAnnotation.getAnnotation();
            if (StringUtils.hasText(afterThrowingAnnotation.throwing())) {
                springAdvice.setThrowingName(afterThrowingAnnotation.throwing());
            }
            break;
        case AtAround:
            springAdvice = new AspectJAroundAdvice(
                    candidateAdviceMethod, expressionPointcut, aspectInstanceFactory);
            break;
        case AtPointcut:
            if (logger.isDebugEnabled()) {
                logger.debug("Processing pointcut '" + candidateAdviceMethod.getName() + "'");
            }
            return null;
        default:
            throw new UnsupportedOperationException(
                    "Unsupported advice type on method: " + candidateAdviceMethod);
    }

    // Now to configure the advice...
    springAdvice.setAspectName(aspectName);
    springAdvice.setDeclarationOrder(declarationOrder);
    String[] argNames = this.parameterNameDiscoverer.getParameterNames(candidateAdviceMethod);
    if (argNames != null) {
        springAdvice.setArgumentNamesFromStringArray(argNames);
    }
    springAdvice.calculateArgumentBindings();

    return springAdvice;
}
```

从上述函数代码中可以看到，Spring会根据不同的注解生成不同的增强器，正如代码switch (aspectJAnnotation.getAnnotationType())，根据不同的类型来生成。例如AtBefore会对应AspectJMethodBeforeAdvice。在AspectJMethodBeforeAdvice中完成了增强逻辑，这里的 **AspectJMethodBeforeAdvice 最后会被适配器封装成\**MethodBeforeAdviceInterceptor，\****下一篇文章中我们具体分析，具体看下其代码：

**MethodBeforeAdviceInterceptor**

```java
public class MethodBeforeAdviceInterceptor implements MethodInterceptor, Serializable {

    private MethodBeforeAdvice advice;

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

其中的MethodBeforeAdvice代表着前置增强的AspectJMethodBeforeAdvice，跟踪before方法：

**AspectJMethodBeforeAdvice.java**

```java
public class AspectJMethodBeforeAdvice extends AbstractAspectJAdvice implements MethodBeforeAdvice, Serializable {

    public AspectJMethodBeforeAdvice(
            Method aspectJBeforeAdviceMethod, AspectJExpressionPointcut pointcut, AspectInstanceFactory aif) {

        super(aspectJBeforeAdviceMethod, pointcut, aif);
    }


    @Override
    public void before(Method method, Object[] args, @Nullable Object target) throws Throwable {
        //直接调用增强方法
        invokeAdviceMethod(getJoinPointMatch(), null, null);
    }

}

protected Object invokeAdviceMethod(
        @Nullable JoinPointMatch jpMatch, @Nullable Object returnValue, @Nullable Throwable ex)
        throws Throwable {

    return invokeAdviceMethodWithGivenArgs(argBinding(getJoinPoint(), jpMatch, returnValue, ex));
}

protected Object invokeAdviceMethodWithGivenArgs(Object[] args) throws Throwable {
    Object[] actualArgs = args;
    if (this.aspectJAdviceMethod.getParameterCount() == 0) {
        actualArgs = null;
    }
    try {
        ReflectionUtils.makeAccessible(this.aspectJAdviceMethod);
        // TODO AopUtils.invokeJoinpointUsingReflection
        // 通过反射调用AspectJ注解类中的增强方法
        return this.aspectJAdviceMethod.invoke(this.aspectInstanceFactory.getAspectInstance(), actualArgs);
    }
    catch (IllegalArgumentException ex) {
        throw new AopInvocationException("Mismatch on arguments to advice method [" +
                this.aspectJAdviceMethod + "]; pointcut expression [" +
                this.pointcut.getPointcutExpression() + "]", ex);
    }
    catch (InvocationTargetException ex) {
        throw ex.getTargetException();
    }
}
```

invokeAdviceMethodWithGivenArgs方法中的aspectJAdviceMethod正是对与前置增强的方法，在这里实现了调用。

后置增强与前置增强有稍许不一致的地方。回顾之前讲过的前置增强，大致的结构是在拦截器链中放置MethodBeforeAdviceInterceptor，而在MethodBeforeAdviceInterceptor中又放置了AspectJMethodBeforeAdvice，并在调用invoke时首先串联调用。但是在后置增强的时候却不一样，没有提供中间的类，而是直接在拦截器中使用了中间的AspectJAfterAdvice，也就是直接实现了**MethodInterceptor**。

```java
public class AspectJAfterAdvice extends AbstractAspectJAdvice
        implements MethodInterceptor, AfterAdvice, Serializable {

    public AspectJAfterAdvice(
            Method aspectJBeforeAdviceMethod, AspectJExpressionPointcut pointcut, AspectInstanceFactory aif) {

        super(aspectJBeforeAdviceMethod, pointcut, aif);
    }


    @Override
    public Object invoke(MethodInvocation mi) throws Throwable {
        try {
            return mi.proceed();
        }
        finally {
            // 激活增强方法
            invokeAdviceMethod(getJoinPointMatch(), null, null);
        }
    }

    @Override
    public boolean isBeforeAdvice() {
        return false;
    }

    @Override
    public boolean isAfterAdvice() {
        return true;
    }

}
```





## 寻找匹配的增强器

前面的函数中已经完成了所有增强器的解析，但是对于所有增强器来讲，并不一定都适用于当前的bean，还要挑取出适合的增强器，也就是满足我们配置的通配符的增强器。具体实现在findAdvisorsThatCanApply中。

```java
protected List<Advisor> findAdvisorsThatCanApply(
        List<Advisor> candidateAdvisors, Class<?> beanClass, String beanName) {

    ProxyCreationContext.setCurrentProxiedBeanName(beanName);
    try {
        // 过滤已经得到的advisors
        return AopUtils.findAdvisorsThatCanApply(candidateAdvisors, beanClass);
    }
    finally {
        ProxyCreationContext.setCurrentProxiedBeanName(null);
    }
}
```

继续看findAdvisorsThatCanApply：

```java
public static List<Advisor> findAdvisorsThatCanApply(List<Advisor> candidateAdvisors, Class<?> clazz) {
    if (candidateAdvisors.isEmpty()) {
        return candidateAdvisors;
    }
    List<Advisor> eligibleAdvisors = new ArrayList<>();
    // 首先处理引介增强
    for (Advisor candidate : candidateAdvisors) {
        if (candidate instanceof IntroductionAdvisor && canApply(candidate, clazz)) {
            eligibleAdvisors.add(candidate);
        }
    }
    boolean hasIntroductions = !eligibleAdvisors.isEmpty();
    for (Advisor candidate : candidateAdvisors) {
        if (candidate instanceof IntroductionAdvisor) {
            // already processed
            continue;
        }
        // 对于普通bean的处理
        if (canApply(candidate, clazz, hasIntroductions)) {
            eligibleAdvisors.add(candidate);
        }
    }
    return eligibleAdvisors;
}
```

findAdvisorsThatCanApply函数的主要功能是寻找增强器中适用于当前class的增强器。引介增强与普通的增强的处理是不一样的，所以分开处理。而对于真正的匹配在canApply中实现。

```
public static boolean canApply(Advisor advisor, Class<?> targetClass, boolean hasIntroductions) {
    if (advisor instanceof IntroductionAdvisor) {
        return ((IntroductionAdvisor) advisor).getClassFilter().matches(targetClass);
    }
    else if (advisor instanceof PointcutAdvisor) {
        PointcutAdvisor pca = (PointcutAdvisor) advisor;
        return canApply(pca.getPointcut(), targetClass, hasIntroductions);
    }
    else {
        // It doesn't have a pointcut so we assume it applies.
        return true;
    }
}

public static boolean canApply(Pointcut pc, Class<?> targetClass, boolean hasIntroductions) {
    Assert.notNull(pc, "Pointcut must not be null");
    //通过Pointcut的条件判断此类是否能匹配
    if (!pc.getClassFilter().matches(targetClass)) {
        return false;
    }

    MethodMatcher methodMatcher = pc.getMethodMatcher();
    if (methodMatcher == MethodMatcher.TRUE) {
        // No need to iterate the methods if we're matching any method anyway...
        return true;
    }

    IntroductionAwareMethodMatcher introductionAwareMethodMatcher = null;
    if (methodMatcher instanceof IntroductionAwareMethodMatcher) {
        introductionAwareMethodMatcher = (IntroductionAwareMethodMatcher) methodMatcher;
    }

    Set<Class<?>> classes = new LinkedHashSet<>();
    if (!Proxy.isProxyClass(targetClass)) {
        classes.add(ClassUtils.getUserClass(targetClass));
    }
    classes.addAll(ClassUtils.getAllInterfacesForClassAsSet(targetClass));

    for (Class<?> clazz : classes) {
        //反射获取类中所有的方法
        Method[] methods = ReflectionUtils.getAllDeclaredMethods(clazz);
        for (Method method : methods) {
            //根据匹配原则判断该方法是否能匹配Pointcut中的规则，如果有一个方法能匹配，则返回true
            if (introductionAwareMethodMatcher != null ?
                    introductionAwareMethodMatcher.matches(method, targetClass, hasIntroductions) :
                    methodMatcher.matches(method, targetClass)) {
                return true;
            }
        }
    }

    return false;
}
```



首先判断bean是否满足切点的规则，如果能满足，则获取bean的所有方法，判断是否有方法能匹配规则，有方法匹配规则，就代表此 Advisor 能作用于该bean,然后将该Advisor加入 eligibleAdvisors 集合中。

我们以注解的规则来看看bean中的method是怎样匹配 Pointcut中的规则

**AnnotationMethodMatcher**

```java
@Override
public boolean matches(Method method, Class<?> targetClass) {
    if (matchesMethod(method)) {
        return true;
    }
    // Proxy classes never have annotations on their redeclared methods.
    if (Proxy.isProxyClass(targetClass)) {
        return false;
    }
    // The method may be on an interface, so let's check on the target class as well.
    Method specificMethod = AopUtils.getMostSpecificMethod(method, targetClass);
    return (specificMethod != method && matchesMethod(specificMethod));
}

private boolean matchesMethod(Method method) {
    //可以看出判断该Advisor是否使用于bean中的method，只需看method上是否有Advisor的注解
    return (this.checkInherited ? AnnotatedElementUtils.hasAnnotation(method, this.annotationType) :
            method.isAnnotationPresent(this.annotationType));
}
```



至此，我们在后置处理器中找到了所有匹配Bean中的增强器，下一篇讲解如何使用找到切面，来创建代理。





最后给大家分享一个Github仓库，上面有大彬整理的**300多本经典的计算机书籍PDF**，包括**C语言、C++、Java、Python、前端、数据库、操作系统、计算机网络、数据结构和算法、机器学习、编程人生**等，可以star一下，下次找书直接在上面搜索，仓库持续更新中~

![](http://img.topjavaer.cn/image/Image.png)

![](http://img.topjavaer.cn/image/image-20221030094126118.png)

[**Github地址**](https://github.com/Tyson0314/java-books)

如果访问不了Github，可以访问码云地址。

[码云地址](https://gitee.com/tysondai/java-books)