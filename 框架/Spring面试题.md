<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Spring的优点](#spring%E7%9A%84%E4%BC%98%E7%82%B9)
- [Spring 用到了哪些设计模式？](#spring-%E7%94%A8%E5%88%B0%E4%BA%86%E5%93%AA%E4%BA%9B%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F)
- [什么是AOP？](#%E4%BB%80%E4%B9%88%E6%98%AFaop)
- [AOP有哪些实现方式？](#aop%E6%9C%89%E5%93%AA%E4%BA%9B%E5%AE%9E%E7%8E%B0%E6%96%B9%E5%BC%8F)
- [JDK动态代理和CGLIB动态代理的区别？](#jdk%E5%8A%A8%E6%80%81%E4%BB%A3%E7%90%86%E5%92%8Ccglib%E5%8A%A8%E6%80%81%E4%BB%A3%E7%90%86%E7%9A%84%E5%8C%BA%E5%88%AB)
- [Spring AOP相关术语](#spring-aop%E7%9B%B8%E5%85%B3%E6%9C%AF%E8%AF%AD)
- [Spring通知有哪些类型？](#spring%E9%80%9A%E7%9F%A5%E6%9C%89%E5%93%AA%E4%BA%9B%E7%B1%BB%E5%9E%8B)
- [什么是IOC？](#%E4%BB%80%E4%B9%88%E6%98%AFioc)
- [IOC的优点是什么？](#ioc%E7%9A%84%E4%BC%98%E7%82%B9%E6%98%AF%E4%BB%80%E4%B9%88)
- [什么是依赖注入？](#%E4%BB%80%E4%B9%88%E6%98%AF%E4%BE%9D%E8%B5%96%E6%B3%A8%E5%85%A5)
- [IOC容器初始化过程？](#ioc%E5%AE%B9%E5%99%A8%E5%88%9D%E5%A7%8B%E5%8C%96%E8%BF%87%E7%A8%8B)
- [Bean的生命周期](#bean%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F)
- [BeanFactory和FactoryBean的区别？](#beanfactory%E5%92%8Cfactorybean%E7%9A%84%E5%8C%BA%E5%88%AB)
- [Bean注入容器有哪些方式？](#bean%E6%B3%A8%E5%85%A5%E5%AE%B9%E5%99%A8%E6%9C%89%E5%93%AA%E4%BA%9B%E6%96%B9%E5%BC%8F)
- [Bean的作用域](#bean%E7%9A%84%E4%BD%9C%E7%94%A8%E5%9F%9F)
- [Spring自动装配的方式有哪些？](#spring%E8%87%AA%E5%8A%A8%E8%A3%85%E9%85%8D%E7%9A%84%E6%96%B9%E5%BC%8F%E6%9C%89%E5%93%AA%E4%BA%9B)
- [@Autowired和@Resource的区别？](#autowired%E5%92%8Cresource%E7%9A%84%E5%8C%BA%E5%88%AB)
- [@Qualifier 注解有什么作用](#qualifier-%E6%B3%A8%E8%A7%A3%E6%9C%89%E4%BB%80%E4%B9%88%E4%BD%9C%E7%94%A8)
- [@Bean和@Component有什么区别？](#bean%E5%92%8Ccomponent%E6%9C%89%E4%BB%80%E4%B9%88%E5%8C%BA%E5%88%AB)
- [@Component、@Controller、@Repositor和@Service 的区别？](#componentcontrollerrepositor%E5%92%8Cservice-%E7%9A%84%E5%8C%BA%E5%88%AB)
- [Spring 事务实现方式有哪些？](#spring-%E4%BA%8B%E5%8A%A1%E5%AE%9E%E7%8E%B0%E6%96%B9%E5%BC%8F%E6%9C%89%E5%93%AA%E4%BA%9B)
- [有哪些事务传播行为？](#%E6%9C%89%E5%93%AA%E4%BA%9B%E4%BA%8B%E5%8A%A1%E4%BC%A0%E6%92%AD%E8%A1%8C%E4%B8%BA)
- [Spring怎么解决循环依赖的问题？](#spring%E6%80%8E%E4%B9%88%E8%A7%A3%E5%86%B3%E5%BE%AA%E7%8E%AF%E4%BE%9D%E8%B5%96%E7%9A%84%E9%97%AE%E9%A2%98)
- [Spring启动过程](#spring%E5%90%AF%E5%8A%A8%E8%BF%87%E7%A8%8B)
- [Spring 的单例 Bean 是否有线程安全问题？](#spring-%E7%9A%84%E5%8D%95%E4%BE%8B-bean-%E6%98%AF%E5%90%A6%E6%9C%89%E7%BA%BF%E7%A8%8B%E5%AE%89%E5%85%A8%E9%97%AE%E9%A2%98)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Spring的优点

- **轻量**，基本版本大约2MB。
- 通过控制反转和依赖注入实现**松耦合**。
- 支持**面向切面**的编程，并且把应用业务逻辑和系统服务分开。
- 通过切面和模板减少样板式代码。
- 方便集成各种优秀框架。内部提供了对各种优秀框架的直接支持（如：Hibernate、MyBatis等）。
- 方便程序的测试。Spring支持Junit4，添加注解便可以测试Spring程序。

## Spring 用到了哪些设计模式？

1、**简单工厂模式**：`BeanFactory`就是简单工厂模式的体现，根据传入一个唯一标识来获得 Bean 对象。

```java
@Override
public Object getBean(String name) throws BeansException {
    assertBeanFactoryActive();
    return getBeanFactory().getBean(name);
}
```

2、**工厂方法模式**：`FactoryBean`就是典型的工厂方法模式。spring在使用`getBean()`调用获得该bean时，会自动调用该bean的`getObject()`方法。每个 Bean 都会对应一个 `FactoryBean`，如 `SqlSessionFactory` 对应 `SqlSessionFactoryBean`。

3、**单例模式**：一个类仅有一个实例，提供一个访问它的全局访问点。Spring 创建 Bean 实例默认是单例的。

4、**适配器模式**：SpringMVC中的适配器`HandlerAdatper`。由于应用会有多个Controller实现，如果需要直接调用Controller方法，那么需要先判断是由哪一个Controller处理请求，然后调用相应的方法。当增加新的 Controller，需要修改原来的逻辑，违反了开闭原则（对修改关闭，对扩展开放）。

为此，Spring提供了一个适配器接口，每一种 Controller 对应一种 `HandlerAdapter` 实现类，当请求过来，SpringMVC会调用`getHandler()`获取相应的Controller，然后获取该Controller对应的 `HandlerAdapter`，最后调用`HandlerAdapter`的`handle()`方法处理请求，实际上调用的是Controller的`handleRequest()`。每次添加新的 Controller 时，只需要增加一个适配器类就可以，无需修改原有的逻辑。

常用的处理器适配器：`SimpleControllerHandlerAdapter`，`HttpRequestHandlerAdapter`，`AnnotationMethodHandlerAdapter`。

```java
// Determine handler for the current request.
mappedHandler = getHandler(processedRequest);

HandlerAdapter ha = getHandlerAdapter(mappedHandler.getHandler());

// Actually invoke the handler.
mv = ha.handle(processedRequest, response, mappedHandler.getHandler());

public class HttpRequestHandlerAdapter implements HandlerAdapter {

    @Override
    public boolean supports(Object handler) {//handler是被适配的对象，这里使用的是对象的适配器模式
        return (handler instanceof HttpRequestHandler);
    }

    @Override
    @Nullable
    public ModelAndView handle(HttpServletRequest request, HttpServletResponse response, Object handler)
        throws Exception {

        ((HttpRequestHandler) handler).handleRequest(request, response);
        return null;
    }
}
```

5、**代理模式**：spring 的 aop 使用了动态代理，有两种方式`JdkDynamicAopProxy`和`Cglib2AopProxy`。

6、**观察者模式**：spring 中 observer 模式常用的地方是 listener 的实现，如`ApplicationListener`。

7、**模板模式**： Spring 中 `jdbcTemplate`、`hibernateTemplate` 等，就使用到了模板模式。

## 什么是AOP？

**面向切面**编程，作为面向对象的一种补充，将公共逻辑（事务管理、日志、缓存等）封装成切面，跟业务代码进行分离，可以减少系统的重复代码和降低模块之间的耦合度。切面就是那些与业务无关，但所有业务模块都会调用的公共逻辑。

## AOP有哪些实现方式？

AOP有两种实现方式：静态代理和动态代理。

**静态代理**

静态代理：代理类在编译阶段生成，在编译阶段将通知织入Java字节码中，也称编译时增强。AspectJ使用的是静态代理。

缺点：代理对象需要与目标对象实现一样的接口，并且实现接口的方法，会有冗余代码。同时，一旦接口增加方法，目标对象与代理对象都要维护。

**动态代理**

动态代理：代理类在程序运行时创建，AOP框架不会去修改字节码，而是在内存中临时生成一个代理对象，在运行期间对业务方法进行增强，不会生成新类。

## JDK动态代理和CGLIB动态代理的区别？

Spring AOP中的动态代理主要有两种方式：JDK动态代理和CGLIB动态代理。

**JDK动态代理**

如果目标类实现了接口，Spring AOP会选择使用JDK动态代理目标类。代理类根据目标类实现的接口动态生成，不需要自己编写，生成的动态代理类和目标类都实现相同的接口。JDK动态代理的核心是`InvocationHandler`接口和`Proxy`类。

缺点：**目标类必须有实现的接口**。如果某个类没有实现接口，那么这个类就不能用JDK动态代理。

**CGLIB来动态代理**

**通过继承实现**。如果目标类没有实现接口，那么Spring AOP会选择使用CGLIB来动态代理目标类。CGLIB（Code Generation Library）可以在运行时动态生成类的字节码，动态创建目标类的子类对象，在子类对象中增强目标类。

CGLIB是通过继承的方式做的动态代理，因此如果某个类被标记为`final`，那么它是无法使用CGLIB做动态代理的。

优点：目标类不需要实现特定的接口，更加灵活。

什么时候采用哪种动态代理？

1. 如果目标对象实现了接口，默认情况下会采用JDK的动态代理实现AOP
2. 如果目标对象实现了接口，可以强制使用CGLIB实现AOP
3. 如果目标对象没有实现了接口，必须采用CGLIB库

**两者的区别**：

1. jdk动态代理使用jdk中的类Proxy来创建代理对象，它使用反射技术来实现，不需要导入其他依赖。cglib需要引入相关依赖：`asm.jar`，它使用字节码增强技术来实现。
2. 当目标类实现了接口的时候Spring Aop默认使用jdk动态代理方式来增强方法，没有实现接口的时候使用cglib动态代理方式增强方法。

## Spring AOP相关术语

（1）**切面**（Aspect）：切面是通知和切点的结合。通知和切点共同定义了切面的全部内容。 

（2）**连接点**（Join point）：指方法，在Spring AOP中，一个连接点总是代表一个方法的执行。连接点是在应用执行过程中能够插入切面的一个点。这个点可以是调用方法时、抛出异常时、甚至修改一个字段时。切面代码可以利用这些点插入到应用的正常流程之中，并添加新的行为。

（3）**通知**（Advice）：在AOP术语中，切面的工作被称为通知。

（4）**切入点**（Pointcut）：切点的定义会匹配通知所要织入的一个或多个连接点。我们通常使用明确的类和方法名称，或是利用正则表达式定义所匹配的类和方法名称来指定这些切点。

（5）**引入**（Introduction）：引入允许我们向现有类添加新方法或属性。

（6）**目标对象**（Target Object）： 被一个或者多个切面（aspect）所通知（advise）的对象。它通常是一个代理对象。

（7）**织入**（Weaving）：织入是把切面应用到目标对象并创建新的代理对象的过程。在目标对象的生命周期里有以下时间点可以进行织入：

- 编译期：切面在目标类编译时被织入。AspectJ的织入编译器是以这种方式织入切面的。
- 类加载期：切面在目标类加载到JVM时被织入。需要特殊的类加载器，它可以在目标类被引入应用之前增强该目标类的字节码。AspectJ5的加载时织入就支持以这种方式织入切面。
- 运行期：切面在应用运行的某个时刻被织入。一般情况下，在织入切面时，AOP容器会为目标对象动态地创建一个代理对象。SpringAOP就是以这种方式织入切面。

## Spring通知有哪些类型？

在AOP术语中，切面的工作被称为通知。通知实际上是程序运行时要通过Spring AOP框架来触发的代码段。

Spring切面可以应用5种类型的通知：

1. **前置通知**（Before）：在目标方法被调用之前调用通知功能；
2. **后置通知**（After）：在目标方法完成之后调用通知，此时不会关心方法的输出是什么；
3. **返回通知**（After-returning ）：在目标方法成功执行之后调用通知；
4. **异常通知**（After-throwing）：在目标方法抛出异常后调用通知；
5. **环绕通知**（Around）：通知包裹了被通知的方法，在被通知的方法调用之前和调用之后执行自定义的逻辑。

## 什么是IOC？

IOC：**控制反转**，由Spring容器管理bean的整个生命周期。通过反射实现对其他对象的控制，包括初始化、创建、销毁等，解放手动创建对象的过程，同时降低类之间的耦合度。

IOC的好处：降低了类之间的耦合，对象创建和初始化交给Spring容器管理，在需要的时候只需向容器进行申请。

## IOC的优点是什么？

- IOC 和依赖注入降低了应用的代码量。
- 松耦合。
- 支持加载服务时的饿汉式初始化和懒加载。

## 什么是依赖注入？

在Spring创建对象的过程中，把对象依赖的属性注入到对象中。依赖注入主要有两种方式：构造器注入和属性注入。

## IOC容器初始化过程？

1. 从XML中读取配置文件。
2. 将bean标签解析成 BeanDefinition，如解析 property 元素， 并注入到 BeanDefinition 实例中。
3. 将 BeanDefinition 注册到容器 BeanDefinitionMap 中。
4. BeanFactory 根据 BeanDefinition 的定义信息创建实例化和初始化 bean。

单例bean的初始化以及依赖注入一般都在容器初始化阶段进行，只有懒加载（lazy-init为true）的单例bean是在应用第一次调用getBean()时进行初始化和依赖注入。

```java
// AbstractApplicationContext
// Instantiate all remaining (non-lazy-init) singletons.
finishBeanFactoryInitialization(beanFactory);
```

多例bean 在容器启动时不实例化，即使设置 lazy-init 为 false 也没用，只有调用了getBean()才进行实例化。

`loadBeanDefinitions`采用了模板模式，具体加载 `BeanDefinition` 的逻辑由各个子类完成。

## Bean的生命周期

![](https://raw.githubusercontent.com/Tyson0314/img/master/bean生命周期.png)

1.调用bean的构造方法创建Bean

2.通过反射调用setter方法进行属性的依赖注入

3.如果Bean实现了`BeanNameAware`接口，Spring将调用`setBeanName`()，设置 `Bean`的name（xml文件中bean标签的id）

4.如果Bean实现了`BeanFactoryAware`接口，Spring将调用`setBeanFactory()`把bean factory设置给Bean

5.如果Bean实现了`ApplicationContextAware`接口，Spring容器将调用`setApplicationContext()`给Bean设置ApplictionContext

6.如果存在`BeanPostProcessor`，Spring将调用它们的`postProcessBeforeInitialization`（预初始化）方法，在Bean初始化前对其进行处理

7.如果Bean实现了`InitializingBean`接口，Spring将调用它的`afterPropertiesSet`方法，然后调用xml定义的 init-method 方法，两个方法作用类似，都是在初始化 bean 的时候执行

8.如果存在`BeanPostProcessor`，Spring将调用它们的`postProcessAfterInitialization`（后初始化）方法，在Bean初始化后对其进行处理

9.Bean初始化完成，供应用使用，直到应用被销毁

10.如果Bean实现了`DisposableBean`接口，Spring将调用它的`destory`方法，然后调用在xml中定义的 `destory-method`方法，这两个方法作用类似，都是在Bean实例销毁前执行

```java
public interface BeanPostProcessor {
	@Nullable
	default Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
		return bean;
	}
	@Nullable
	default Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
		return bean;
	}
}
public interface InitializingBean {
	void afterPropertiesSet() throws Exception;
}
```

## BeanFactory和FactoryBean的区别？

**BeanFactory**：管理Bean的容器，Spring中生成的Bean都是由这个接口的实现来管理的。

**FactoryBean**：通常是用来创建比较复杂的bean，一般的bean 直接用xml配置即可，但如果一个bean的创建过程中涉及到很多其他的bean 和复杂的逻辑，直接用xml配置比较麻烦，这时可以考虑用FactoryBean，可以隐藏实例化复杂Bean的细节。

当配置文件中bean标签的class属性配置的实现类是FactoryBean时，通过 getBean()方法返回的不是FactoryBean本身，而是调用FactoryBean#getObject()方法所返回的对象，相当于FactoryBean#getObject()代理了getBean()方法。如果想得到FactoryBean必须使用 '&' + beanName 的方式获取。

Mybatis 提供了 `SqlSessionFactoryBean`，可以简化 `SqlSessionFactory`的配置：

```java
public class SqlSessionFactoryBean implements FactoryBean<SqlSessionFactory>, InitializingBean, ApplicationListener<ApplicationEvent> {
  @Override
  public void afterPropertiesSet() throws Exception {
    notNull(dataSource, "Property 'dataSource' is required");
    notNull(sqlSessionFactoryBuilder, "Property 'sqlSessionFactoryBuilder' is required");
    state((configuration == null && configLocation == null) || !(configuration != null && configLocation != null),
              "Property 'configuration' and 'configLocation' can not specified with together");
    this.sqlSessionFactory = buildSqlSessionFactory();
  }

  protected SqlSessionFactory buildSqlSessionFactory() throws IOException {
	//复杂逻辑
  }
    
  @Override
  public SqlSessionFactory getObject() throws Exception {
    if (this.sqlSessionFactory == null) {
      afterPropertiesSet();
    }
    return this.sqlSessionFactory;
  }
}
```

在 xml 配置 SqlSessionFactoryBean：

```xml
<bean id="tradeSqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
    <property name="dataSource" ref="trade" />
    <property name="mapperLocations" value="classpath*:mapper/trade/*Mapper.xml" />
    <property name="configLocation" value="classpath:mybatis-config.xml" />
    <property name="typeAliasesPackage" value="com.bytebeats.mybatis3.domain.trade" />
</bean>
```

Spring 将会在应用启动时创建 `SqlSessionFactory`，并使用 `sqlSessionFactory` 这个名字存储起来。

## Bean注入容器有哪些方式？

将普通类交给Spring容器管理，通常有以下方法：

1、使用`@Configuration`与`@Bean`注解

2、使用`@Controller`、`@Service`、`@Repository`、`@Component` 注解标注该类，然后启用`@ComponentScan`自动扫描

3、使用`@Import` 方法。使用@Import注解把bean导入到当前容器中，代码如下：

```java
//@SpringBootApplication
@ComponentScan
/*把用到的资源导入到当前容器中*/
@Import({Dog.class, Cat.class})
public class App {
    public static void main(String[] args) throws Exception {
        ConfigurableApplicationContext context = SpringApplication.run(App.class, args);
        System.out.println(context.getBean(Dog.class));
        System.out.println(context.getBean(Cat.class));
        context.close();
    }
}
```



## Bean的作用域

1、**singleton**：单例，Spring中的bean默认都是单例的。

2、**prototype**：每次请求都会创建一个新的bean实例。

3、**request**：每一次HTTP请求都会产生一个新的bean，该bean仅在当前HTTP request内有效。

4、**session**：每一次HTTP请求都会产生一个新的bean，该bean仅在当前HTTP session内有效。

5、**global-session**：全局session作用域。

## Spring自动装配的方式有哪些？

Spring的自动装配有三种模式：**byType**(根据类型)，**byName**(根据名称)、**constructor**(根据构造函数)。

**byType**

找到与依赖类型相同的bean注入到另外的bean中，这个过程需要借助setter注入来完成，因此必须存在set方法，否则注入失败。

当xml文件中存在多个相同类型名称不同的实例Bean时，Spring容器依赖注入仍然会失败，因为存在多种适合的选项，Spring容器无法知道该注入那种，此时我们需要为Spring容器提供帮助，指定注入那个Bean实例。可以通过`＜bean＞`标签的autowire-candidate设置为false来过滤那些不需要注入的实例Bean

```xml
<bean id="userDao"  class="com.zejian.spring.springIoc.dao.impl.UserDaoImpl" />

<!-- autowire-candidate="false" 过滤该类型 -->
<bean id="userDao2" autowire-candidate="false" class="com.zejian.spring.springIoc.dao.impl.UserDaoImpl" />

<!-- byType 根据类型自动装配userDao-->
<bean id="userService" autowire="byType" class="com.zejian.spring.springIoc.service.impl.UserServiceImpl" />
```

**byName**

将属性名与bean名称进行匹配，如果找到则注入依赖bean。

```xml
<bean id="userDao"  class="com.zejian.spring.springIoc.dao.impl.UserDaoImpl" />
<bean id="userDao2" class="com.zejian.spring.springIoc.dao.impl.UserDaoImpl" />

<!-- byName 根据名称自动装配，找到UserServiceImpl名为 userDao属性并注入-->
<bean id="userService" autowire="byName" class="com.zejian.spring.springIoc.service.impl.UserServiceImpl" />
```

**constructor**

存在单个实例则优先按类型进行参数匹配（无论名称是否匹配），当存在多个类型相同实例时，按名称优先匹配，如果没有找到对应名称，则注入失败。

## @Autowired和@Resource的区别？

默认情况下@Autowired是按类型匹配的(byType)。如果需要按名称(byName)匹配的话，可以使用@Qualifier注解与@Autowired结合。@Autowired 可以传递一个`required=false`的属性，false指明当userDao实例存在就注入不存就忽略，如果为true，就必须注入，若userDao实例不存在，就抛出异常。

```java
public class UserServiceImpl implements UserService {
    //标注成员变量
    @Autowired
    @Qualifier("userDao1")
    private UserDao userDao;   
 }
```

@Resource，默认按 byName模式自动注入。@Resource有两个中重要的属性：name和type。Spring容器对于@Resource注解的name属性解析为bean的名字，type属性则解析为bean的类型。因此使用name属性，则按byName模式的自动注入策略，如果使用type属性则按 byType模式自动注入策略。倘若既不指定name也不指定type属性，Spring容器将通过反射技术默认按byName模式注入。

```java
@Resource(name="userDao")
private UserDao  userDao;//用于成员变量

//也可以用于set方法标注
@Resource(name="userDao")
public void setUserDao(UserDao userDao) {
   this.userDao= userDao;
}
```

上述两种自动装配的依赖注入并不适合简单值类型，如int、boolean、long、String以及Enum等，对于这些类型，Spring容器也提供了@Value注入的方式。@Value接收一个String的值，该值指定了将要被注入到内置的java类型属性值，Spring 容器会做好类型转换。一般情况下@Value会与properties文件结合使用。

jdbc.properties文件如下：

```properties
jdbc.driver=com.mysql.jdbc.Driver
jdbc.url=jdbc:mysql://127.0.0.1:3306/test?characterEncoding=UTF-8&allowMultiQueries=true
jdbc.username=root
jdbc.password=root
```

利用注解@Value获取jdbc.url和jdbc.username的值，实现如下：

```java
public class UserServiceImpl implements UserService {
    //占位符方式
    @Value("${jdbc.url}")
    private String url;
    //SpEL表达方式，其中代表xml配置文件中的id值configProperties
    @Value("#{configProperties['jdbc.username']}")
    private String userName;

}
```

## @Qualifier 注解有什么作用

当需要创建多个相同类型的 bean 并希望仅使用属性装配其中一个 bean 时，可以使用`@Qualifier` 注解和 `@Autowired` 通过指定应该装配哪个 bean 来消除歧义。

## @Bean和@Component有什么区别？

都是使用注解定义 Bean。@Bean 是使用 Java 代码装配 Bean，@Component 是自动装配 Bean。

@Component 注解用在类上，表明一个类会作为组件类，并告知Spring要为这个类创建bean，每个类对应一个 Bean。

@Bean 注解用在方法上，表示这个方法会返回一个 Bean。@Bean 需要在配置类中使用，即类上需要加上@Configuration注解。

```java
@Component
public class Student {
    private String name = "lkm";
 
    public String getName() {
        return name;
    }
}

@Configuration
public class WebSocketConfig {
    @Bean
    public Student student(){
        return new Student();
    }
}
```

@Bean 注解更加灵活。当需要将第三方类装配到 Spring 容器中，因为没办法源代码上添加@Component注解，只能使用@Bean 注解的方式，当然也可以使用 xml 的方式。

## @Component、@Controller、@Repositor和@Service 的区别？

@Component：最普通的组件，可以被注入到spring容器进行管理。

@Controller：将类标记为 Spring Web MVC 控制器。

@Service：将类标记为业务层组件。

@Repository：将类标记为数据访问组件，即DAO组件。

## Spring 事务实现方式有哪些？

事务就是一系列的操作原子执行。Spring事务机制主要包括声明式事务和编程式事务。

- **编程式事务**：通过编程的方式管理事务，这种方式带来了很大的灵活性，但很难维护。
- **声明式事务**：将事务管理代码从业务方法中分离出来，通过aop进行封装。Spring声明式事务使得我们无需要去处理获得连接、关闭连接、事务提交和回滚等这些操作。使用 `@Transactional` 注解开启声明式事务。

`@Transactional`相关属性如下：

| 属性                   | 类型                               | 描述                                   |
| :--------------------- | ---------------------------------- | -------------------------------------- |
| value                  | String                             | 可选的限定描述符，指定使用的事务管理器 |
| propagation            | enum: Propagation                  | 可选的事务传播行为设置                 |
| isolation              | enum: Isolation                    | 可选的事务隔离级别设置                 |
| readOnly               | boolean                            | 读写或只读事务，默认读写               |
| timeout                | int (in seconds granularity)       | 事务超时时间设置                       |
| rollbackFor            | Class对象数组，必须继承自Throwable | 导致事务回滚的异常类数组               |
| rollbackForClassName   | 类名数组，必须继承自Throwable      | 导致事务回滚的异常类名字数组           |
| noRollbackFor          | Class对象数组，必须继承自Throwable | 不会导致事务回滚的异常类数组           |
| noRollbackForClassName | 类名数组，必须继承自Throwable      | 不会导致事务回滚的异常类名字数组       |

## 有哪些事务传播行为？

在TransactionDefinition接口中定义了七个事务传播行为：

1. `PROPAGATION_REQUIRED`如果存在一个事务，则支持当前事务。如果没有事务则开启一个新的事务。如果嵌套调用的两个方法都加了事务注解，并且运行在相同线程中，则这两个方法使用相同的事务中。如果运行在不同线程中，则会开启新的事务。
2. `PROPAGATION_SUPPORTS` 如果存在一个事务，支持当前事务。如果没有事务，则非事务的执行。
3. `PROPAGATION_MANDATORY` 如果已经存在一个事务，支持当前事务。如果不存在事务，则抛出异常`IllegalTransactionStateException`。
4. `PROPAGATION_REQUIRES_NEW` 总是开启一个新的事务。需要使用JtaTransactionManager作为事务管理器。
5. `PROPAGATION_NOT_SUPPORTED` 总是非事务地执行，并挂起任何存在的事务。需要使用JtaTransactionManager作为事务管理器。
6. `PROPAGATION_NEVER` 总是非事务地执行，如果存在一个活动事务，则抛出异常。
7. `PROPAGATION_NESTED` 如果一个活动的事务存在，则运行在一个嵌套的事务中。如果没有活动事务, 则按PROPAGATION_REQUIRED 属性执行。

**PROPAGATION_NESTED 与PROPAGATION_REQUIRES_NEW的区别:**

使用`PROPAGATION_REQUIRES_NEW`时，内层事务与外层事务是两个独立的事务。一旦内层事务进行了提交后，外层事务不能对其进行回滚。两个事务互不影响。

使用`PROPAGATION_NESTED`时，外层事务的回滚可以引起内层事务的回滚。而内层事务的异常并不会导致外层事务的回滚，它是一个真正的嵌套事务。



## Spring怎么解决循环依赖的问题？

构造器注入的循环依赖：Spring处理不了，直接抛出`BeanCurrentlylnCreationException`异常。

单例模式下属性注入的循环依赖：通过三级缓存处理循环依赖。 

非单例循环依赖：无法处理。

下面分析单例模式下属性注入的循环依赖是怎么处理的：

首先，Spring单例对象的初始化大略分为三步：

1. `createBeanInstance`：实例化bean，使用构造方法创建对象，为对象分配内存。
2. `populateBean`：进行依赖注入。
3. `initializeBean`：初始化bean。

Spring为了解决单例的循环依赖问题，使用了三级缓存：

`singletonObjects`：完成了初始化的单例对象map，bean name --> bean instance

`earlySingletonObjects `：完成实例化未初始化的单例对象map，bean name --> bean instance

`singletonFactories `： 单例对象工厂map，bean name --> ObjectFactory，单例对象实例化完成之后会加入singletonFactories。

在调用createBeanInstance进行实例化之后，会调用addSingletonFactory，将单例对象放到singletonFactories中。

```java
protected void addSingletonFactory(String beanName, ObjectFactory<?> singletonFactory) {
    Assert.notNull(singletonFactory, "Singleton factory must not be null");
    synchronized (this.singletonObjects) {
        if (!this.singletonObjects.containsKey(beanName)) {
            this.singletonFactories.put(beanName, singletonFactory);
            this.earlySingletonObjects.remove(beanName);
            this.registeredSingletons.add(beanName);
        }
    }
}
```

假如A依赖了B的实例对象，同时B也依赖A的实例对象。

1. A首先完成了实例化，并且将自己添加到singletonFactories中
2. 接着进行依赖注入，发现自己依赖对象B，此时就尝试去get(B)
3. 发现B还没有被实例化，对B进行实例化
4. 然后B在初始化的时候发现自己依赖了对象A，于是尝试get(A)，尝试一级缓存singletonObjects和二级缓存earlySingletonObjects没找到，尝试三级缓存singletonFactories，由于A初始化时将自己添加到了singletonFactories，所以B可以拿到A对象，然后将A从三级缓存中移到二级缓存中
5. B拿到A对象后顺利完成了初始化，然后将自己放入到一级缓存singletonObjects中
6. 此时返回A中，A此时能拿到B的对象顺利完成自己的初始化

由此看出，属性注入的循环依赖主要是通过将实例化完成的bean添加到singletonFactories来实现的。而使用构造器依赖注入的bean在实例化的时候会进行依赖注入，不会被添加到singletonFactories中。比如A和B都是通过构造器依赖注入，A在调用构造器进行实例化的时候，发现自己依赖B，B没有被实例化，就会对B进行实例化，此时A未实例化完成，不会被添加到singtonFactories。而B依赖于A，B会去三级缓存寻找A对象，发现不存在，于是又会实例化A，A实例化了两次，从而导致抛异常。

总结：1、利用缓存识别已经遍历过的节点； 2、利用Java引用，先提前设置对象地址，后完善对象。



## Spring启动过程

1. 读取web.xml文件。
2. 创建 ServletContext，为 ioc 容器提供宿主环境。
3. 触发容器初始化事件，调用 contextLoaderListener.contextInitialized()方法，在这个方法会初始化一个应用上下文WebApplicationContext，即 Spring 的 ioc 容器。ioc 容器初始化完成之后，会被存储到 ServletContext 中。

4. 初始化web.xml中配置的Servlet。如DispatcherServlet，用于匹配、处理每个servlet请求。



## Spring 的单例 Bean 是否有线程安全问题？

当多个用户同时请求一个服务时，容器会给每一个请求分配一个线程，这时多个线程会并发执行该请求对应的业务逻辑，如果业务逻辑有对单例状态的修改（体现为此单例的成员属性），则必须考虑线程安全问题。 

**无状态bean和有状态bean**

- 有实例变量的bean，可以保存数据，是非线程安全的。
- 没有实例变量的bean，不能保存数据，是线程安全的。

在Spring中无状态的Bean适合用单例模式，这样可以共享实例提高性能。有状态的Bean在多线程环境下不安全，一般用`Prototype`模式或者使用`ThreadLocal`解决线程安全问题。

