---
sidebar: heading
title: Spring源码分析
category: 源码分析
tag:
  - Spring
head:
  - - meta
    - name: keywords
      content: Spring源码,标签解析,源码分析,AOP自定义标签,Spring设计模式,Spring AOP,Spring IOC,Bean,Bean生命周期
  - - meta
    - name: description
      content: 高质量的Spring源码分析总结
---

**正文**

我们知道在面向对象OOP编程存在一些弊端，当需要为多个不具有继承关系的对象引入同一个公共行为时，例如日志，安全检测等，我们只有在每个对象里引入公共行为，这样程序中就产生了大量的重复代码，所以有了面向对象编程的补充，面向切面编程（AOP），AOP所关注的方向是横向的，不同于OOP的纵向。接下来我们就详细分析下spring中的AOP。首先我们从动态AOP的使用开始。

> [最全面的Java面试网站](https://topjavaer.cn)

## AOP的使用

在开始前，先引入Aspect。

```xml
<!-- aspectjweaver -->
<dependency>
    <groupId>org.aspectj</groupId>
    <artifactId>aspectjweaver</artifactId>
    <version>${aspectj.version}</version>
</dependency>
```

### 创建用于拦截的bean

```java
public class TestBean {
    private String message = "test bean";

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void test(){
        System.out.println(this.message);
    }
}
```



### 创建Advisor

Spring中摒弃了最原始的繁杂配置方式而采用@AspectJ注解对POJO进行标注，使AOP的工作大大简化，例如，在AspectJTest类中，我们要做的就是在所有类的test方法执行前在控制台beforeTest。而在所有类的test方法执行后打印afterTest，同时又使用环绕的方式在所有类的方法执行前后在此分别打印before1和after1，以下是AspectJTest的代码：

```java
@Aspect
public class AspectJTest {
    @Pointcut("execution(* *.test(..))")
    public void test(){
    }
    
    @Before("test()")
    public void beforeTest(){
        System.out.println("beforeTest");
    }
    
    @Around("test()")
    public Object aroundTest(ProceedingJoinPoint p){
        System.out.println("around.....before");
        Object o = null;
        try{
            o = p.proceed();
        }catch(Throwable e){
            e.printStackTrace();
        }
        System.out.println("around.....after");
        return o;
    }
    
    @After("test()")
    public void afterTest()
    {
        System.out.println("afterTest");
    }
 }
```



### 创建配置文件

要在Spring中开启AOP功能，，还需要在配置文件中作如下声明：

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop.xsd">

    <aop:aspectj-autoproxy/>
    <bean id="test" class="com.dabin.myspring.demo.aop.TestBean">
        <property name="message" value="这是一个苦逼的程序员"/>
    </bean>
    <bean id="aspect" class="com.dabin.myspring.demo.aop.AspectJTest"/>
</beans>
```



### 测试

```java
public class Test {
    public static void main(String[] args) {
        ApplicationContext bf = new ClassPathXmlApplicationContext("aspectTest.xml");
        TestBean bean = (TestBean)bf.getBean("test");
        bean.test();
    }
}
```



执行后输出如下：

![](http://img.topjavaer.cn/img/202309241751697.png)

 

Spring实现了对所有类的test方法进行增强，使辅助功能可以独立于核心业务之外，方便与程序的扩展和解耦。 

那么，Spring是如何实现AOP的呢？首先我们知道，SPring是否支持注解的AOP是由一个配置文件控制的，也就是`<aop:aspectj-autoproxy/>`，当在配置文件中声明了这句配置的时候，Spring就会支持注解的AOP，那么我们的分析就从这句注解开始。

> 分享一份大彬精心整理的**大厂面试手册**，包含**计算机基础、Java基础、多线程、JVM、数据库、Redis、Spring、Mybatis、SpringMVC、SpringBoot、分布式、微服务、设计模式、架构、校招社招分享**等高频面试题，非常实用，有小伙伴靠着这份手册拿过字节offer~
>
> ![](http://img.topjavaer.cn/image/image-20211127150136157.png)
>
> ![](http://img.topjavaer.cn/image/image-20220316234337881.png)
>
> 需要的小伙伴可以自行**下载**：
>
> http://mp.weixin.qq.com/s?__biz=Mzg2OTY1NzY0MQ==&mid=2247485445&idx=1&sn=1c6e224b9bb3da457f5ee03894493dbc&chksm=ce98f543f9ef7c55325e3bf336607a370935a6c78dbb68cf86e59f5d68f4c51d175365a189f8#rd



## AOP自定义标签

之前讲过Spring中的自定义注解，如果声明了自定义的注解，那么就一定会在程序中的某个地方注册了对应的解析器。我们搜索 **aspectj-autoproxy** 这个代码，尝试找到注册的地方，全局搜索后我们发现了在org.springframework.aop.config包下的AopNamespaceHandler中对应着这样一段函数：

```java
@Override
public void init() {
    // In 2.0 XSD as well as in 2.1 XSD.
    registerBeanDefinitionParser("config", new ConfigBeanDefinitionParser());
    registerBeanDefinitionParser("aspectj-autoproxy", new AspectJAutoProxyBeanDefinitionParser());
    registerBeanDefinitionDecorator("scoped-proxy", new ScopedProxyBeanDefinitionDecorator());

    // Only in 2.0 XSD: moved to context namespace as of 2.1
    registerBeanDefinitionParser("spring-configured", new SpringConfiguredBeanDefinitionParser());
}
```

这里我们就不再对spring中的自定义注解方式进行讨论了。从这段代码中我们可以得知，在解析配置文件的时候，一旦遇到了aspectj-autoproxy注解的时候会使用解析器AspectJAutoProxyBeanDefinitionParser进行解析，接下来我们就详细分析下其内部实现。

### 注册AnnotationAwareAspectJAutoProxyCreator

所有解析器，因为都是对BeanDefinitionParser接口的统一实现，入口都是从parse函数开始的，AspectJAutoProxyBeanDefinitionParser的parse函数如下：

```java
@Override
@Nullable
public BeanDefinition parse(Element element, ParserContext parserContext) {
    // 注册AnnotationAwareAspectJAutoProxyCreator
    AopNamespaceUtils.registerAspectJAnnotationAutoProxyCreatorIfNecessary(parserContext, element);
    // 对于注解中子类的处理
    extendBeanDefinition(element, parserContext);
    return null;
}
```

通过代码可以了解到函数的具体逻辑是在registerAspectJAnnotationAutoProxyCreatorIfecessary方法中实现的，继续进入到函数体内：

```java
/**
 * 注册AnnotationAwareAspectJAutoProxyCreator
 * @param parserContext
 * @param sourceElement
 */
public static void registerAspectJAnnotationAutoProxyCreatorIfNecessary(
        ParserContext parserContext, Element sourceElement) {
    // 注册或升级AutoProxyCreator定义beanName为org.springframework.aop.config.internalAutoProxyCreator的BeanDefinition
    BeanDefinition beanDefinition = AopConfigUtils.registerAspectJAnnotationAutoProxyCreatorIfNecessary(
            parserContext.getRegistry(), parserContext.extractSource(sourceElement));
    // 对于proxy-target-class以及expose-proxy属性的处理
    useClassProxyingIfNecessary(parserContext.getRegistry(), sourceElement);
    // 注册组件并通知，便于监听器做进一步处理
    registerComponentIfNecessary(beanDefinition, parserContext);
}
```

在registerAspectJAnnotationAutoProxyCreatorIfNeccessary方法中主要完成了3件事情，基本上每行代码都是一个完整的逻辑。接下来我们详细分析每一行代码。

#### 注册或升级AnnotationAwareAspectJAutoProxyCreator

对于AOP的实现，基本上都是靠AnnotationAwareAspectJAutoProxyCreator去完成，它可以根据@Point注解定义的切点来自动代理相匹配的bean。但是为了配置简便，Spring使用了自定义配置来帮助我们自动注册AnnotationAwareAspectJAutoProxyCreator，其注册过程就是在这里实现的。我们继续跟进到方法内部：

```java
public static BeanDefinition registerAspectJAnnotationAutoProxyCreatorIfNecessary(BeanDefinitionRegistry registry,
        @Nullable Object source) {
    return registerOrEscalateApcAsRequired(AnnotationAwareAspectJAutoProxyCreator.class, registry, source);
}

public static final String AUTO_PROXY_CREATOR_BEAN_NAME = "org.springframework.aop.config.internalAutoProxyCreator";

private static BeanDefinition registerOrEscalateApcAsRequired(Class<?> cls, BeanDefinitionRegistry registry,
        @Nullable Object source) {

    Assert.notNull(registry, "BeanDefinitionRegistry must not be null");
    //如果已经存在了自动代理创建器且存在的自动代理创建器与现在的不一致那么需要根据优先级来判断到底需要使用哪个
    if (registry.containsBeanDefinition(AUTO_PROXY_CREATOR_BEAN_NAME)) {
        BeanDefinition apcDefinition = registry.getBeanDefinition(AUTO_PROXY_CREATOR_BEAN_NAME);
        if (!cls.getName().equals(apcDefinition.getBeanClassName())) {
            int currentPriority = findPriorityForClass(apcDefinition.getBeanClassName());
            int requiredPriority = findPriorityForClass(cls);
            if (currentPriority < requiredPriority) {
                //改变bean最重要的就是改变bean所对应的className属性  
                apcDefinition.setBeanClassName(cls.getName());
            }
        }
        return null;
    }
    //注册beanDefinition,Class为AnnotationAwareAspectJAutoProxyCreator.class，beanName为internalAutoProxyCreator
    RootBeanDefinition beanDefinition = new RootBeanDefinition(cls);
    beanDefinition.setSource(source);
    beanDefinition.getPropertyValues().add("order", Ordered.HIGHEST_PRECEDENCE);
    beanDefinition.setRole(BeanDefinition.ROLE_INFRASTRUCTURE);
    registry.registerBeanDefinition(AUTO_PROXY_CREATOR_BEAN_NAME, beanDefinition);
    return beanDefinition;
}
```

以上代码实现了自动注册AnnotationAwareAspectJAutoProxyCreator类的功能，同时这里还涉及了一个优先级的问题，如果已经存在了自动代理创建器，而且存在的自动代理创建器与现在的不一致，那么需要根据优先级来判断到底需要使用哪个。

### 处理proxy-target-class以及expose-proxy属性

useClassProxyingIfNecessary实现了proxy-target-class属性以及expose-proxy属性的处理，进入到方法内部：

```java
private static void useClassProxyingIfNecessary(BeanDefinitionRegistry registry, @Nullable Element sourceElement) {
    if (sourceElement != null) {
        //实现了对proxy-target-class的处理
        boolean proxyTargetClass = Boolean.parseBoolean(sourceElement.getAttribute(PROXY_TARGET_CLASS_ATTRIBUTE));
        if (proxyTargetClass) {
            AopConfigUtils.forceAutoProxyCreatorToUseClassProxying(registry);
        }
        //对expose-proxy的处理
        boolean exposeProxy = Boolean.parseBoolean(sourceElement.getAttribute(EXPOSE_PROXY_ATTRIBUTE));
        if (exposeProxy) {
            AopConfigUtils.forceAutoProxyCreatorToExposeProxy(registry);
        }
    }
}
```

在上述代码中用到了两个强制使用的方法，强制使用的过程其实也是一个属性设置的过程，两个函数的方法如下：

```java
public static void forceAutoProxyCreatorToUseClassProxying(BeanDefinitionRegistry registry) {
    if (registry.containsBeanDefinition(AUTO_PROXY_CREATOR_BEAN_NAME)) {
        BeanDefinition definition = registry.getBeanDefinition(AUTO_PROXY_CREATOR_BEAN_NAME);
        definition.getPropertyValues().add("proxyTargetClass", Boolean.TRUE);
    }
}

public static void forceAutoProxyCreatorToExposeProxy(BeanDefinitionRegistry registry) {
    if (registry.containsBeanDefinition(AUTO_PROXY_CREATOR_BEAN_NAME)) {
        BeanDefinition definition = registry.getBeanDefinition(AUTO_PROXY_CREATOR_BEAN_NAME);
        definition.getPropertyValues().add("exposeProxy", Boolean.TRUE);
    }
}
```



proxy-target-class：Spring AOP部分使用JDK动态代理或者CGLIB来为目标对象创建代理。（建议尽量使用JDK的动态代理），如果被代理的目标对象实现了至少一个接口， 則会使用JDK动态代理。所有该目标类型实现的接口都将被代理。若该目标对象没有实现任何接口，则创建一个CGLIB代理。如果你希望强制使用CGLIB代理，（例如希望代理目标对象的所有方法，而不只是实现自接口的方法）那也可以。但是需要考虑以下两个问题。

1. 无法通知（advise) Final方法，因为它们不能被覆写。
2. 你需要将CGLIB二进制发行包放在classpath下面。

与之相较，JDK本身就提供了动态代理，强制使用CGLIB代理需要将<aop:config>的 proxy-target-class 厲性设为 true：

```
<aop:config proxy-target-class = "true">...</aop:config>
```

当需要使用CGLIB代理和@AspectJ自动代理支持，可以按照以下方式设罝<aop:aspectj- autoproxy>的 proxy-target-class 属性：

```
<aop:aspectj-autoproxy proxy-target-class = "true"/>
```

- JDK动态代理：其代理对象必须是某个接口的实现，它是通过在运行期间创建一个接口的实现类来完成对目标对象的代理。
- CGIJB代理：实现原理类似于JDK动态代理，只是它在运行期间生成的代理对象是针对目标类扩展的子类。CGLIB是高效的代码生成包，底层是依靠ASM (开源的Java字节码编辑类库）操作字节码实现的，性能比JDK强。
- expose-proxy：有时候目标对象内部的自我调用将无法实施切面中的增强，如下示例：

```java
public interface AService { 
    public void a(); 
    public void b();
}

@Service()
public class AServicelmpll implements AService {
    @Transactional(propagation = Propagation.REQUIRED) 
    public void a() { 
        this.b{);
    }
    
    @Transactional(propagation = Propagation.REQUIRES_NEW) 
    public void b() {
    }
}
```

此处的this指向目标对象，因此调用this.b()将不会执行b事务切面，即不会执行事务增强， 因此 b 方法的事务定义“@Transactional(propagation = Propagation.REQUIRES_NEW)” 将不会实施，为了解决这个问题，我们可以这样做：

```
<aop:aspectj-autoproxy expose-proxy = "true"/>
```

然后将以上代码中的 “this.b();” 修改为 “((AService) AopContext.currentProxy()).b();” 即可。 通过以上的修改便可以完成对a和b方法的同时增强。



最后给大家分享一个Github仓库，上面有大彬整理的**300多本经典的计算机书籍PDF**，包括**C语言、C++、Java、Python、前端、数据库、操作系统、计算机网络、数据结构和算法、机器学习、编程人生**等，可以star一下，下次找书直接在上面搜索，仓库持续更新中~

![](http://img.topjavaer.cn/image/Image.png)

![](http://img.topjavaer.cn/image/image-20221030094126118.png)

[**Github地址**](https://github.com/Tyson0314/java-books)

如果访问不了Github，可以访问码云地址。

[码云地址](https://gitee.com/tysondai/java-books)