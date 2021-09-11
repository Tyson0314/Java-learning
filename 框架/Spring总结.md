<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [AOP](#aop)
  - [静态代理](#%E9%9D%99%E6%80%81%E4%BB%A3%E7%90%86)
  - [动态代理](#%E5%8A%A8%E6%80%81%E4%BB%A3%E7%90%86)
  - [Spring AOP动态代理](#spring-aop%E5%8A%A8%E6%80%81%E4%BB%A3%E7%90%86)
    - [实现原理](#%E5%AE%9E%E7%8E%B0%E5%8E%9F%E7%90%86)
- [IOC](#ioc)
  - [ioc容器](#ioc%E5%AE%B9%E5%99%A8)
  - [BeanDefinition](#beandefinition)
  - [容器初始化](#%E5%AE%B9%E5%99%A8%E5%88%9D%E5%A7%8B%E5%8C%96)
  - [Bean生命周期](#bean%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F)
  - [Aware接口](#aware%E6%8E%A5%E5%8F%A3)
  - [BeanFactory和FactoryBean](#beanfactory%E5%92%8Cfactorybean)
    - [FactoryBean使用](#factorybean%E4%BD%BF%E7%94%A8)
  - [bean注入容器的方法](#bean%E6%B3%A8%E5%85%A5%E5%AE%B9%E5%99%A8%E7%9A%84%E6%96%B9%E6%B3%95)
- [bean的作用域](#bean%E7%9A%84%E4%BD%9C%E7%94%A8%E5%9F%9F)
- [事务](#%E4%BA%8B%E5%8A%A1)
  - [@Transactional](#transactional)
  - [事务传播行为](#%E4%BA%8B%E5%8A%A1%E4%BC%A0%E6%92%AD%E8%A1%8C%E4%B8%BA)
- [循环依赖](#%E5%BE%AA%E7%8E%AF%E4%BE%9D%E8%B5%96)
  - [初始化](#%E5%88%9D%E5%A7%8B%E5%8C%96)
  - [三级缓存](#%E4%B8%89%E7%BA%A7%E7%BC%93%E5%AD%98)
- [Spring启动过程](#spring%E5%90%AF%E5%8A%A8%E8%BF%87%E7%A8%8B)
- [Spring Bean线程安全](#spring-bean%E7%BA%BF%E7%A8%8B%E5%AE%89%E5%85%A8)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## AOP

面向切面编程，作为面向对象的一种补充，将公共逻辑（事务管理、日志、缓存等）封装成切面，跟业务代码进行分离，可以减少系统的重复代码和降低模块之间的耦合度。切面就是那些与业务无关，但所有业务模块都会调用的公共逻辑。

AOP有两种实现方式：静态代理和动态代理。

### 静态代理

静态代理：代理类在编译阶段生成，在编译阶段将通知织入Java字节码中，也称编译时增强。AspectJ使用的是静态代理。

缺点：代理对象需要与目标对象实现一样的接口，并且实现接口的方法，会有冗余代码。同时，一旦接口增加方法，目标对象与代理对象都要维护。

### 动态代理

动态代理：代理类在程序运行时创建，AOP框架不会去修改字节码，而是在内存中临时生成一个代理对象，在运行期间对业务方法进行增强，不会生成新类。

### Spring AOP动态代理

Spring AOP中的动态代理主要有两种方式：JDK动态代理和CGLIB动态代理。

1. JDK动态代理（生成的代理类实现了接口）。如果目标类实现了接口，Spring AOP会选择使用JDK动态代理目标类。代理类根据目标类实现的接口动态生成，不需要自己编写，生成的动态代理类和目标类都实现相同的接口。JDK动态代理的核心是`InvocationHandler`接口和`Proxy`类。

   缺点：目标类必须有实现的接口。如果某个类没有实现接口，那么这个类就不能用JDK动态代理。

2. CGLIB来动态代理（通过继承）。如果目标类没有实现接口，那么Spring AOP会选择使用CGLIB来动态代理目标类。CGLIB（Code Generation Library）可以在运行时动态生成类的字节码，动态创建目标类的子类对象，在子类对象中增强目标类。

   CGLIB是通过继承的方式做的动态代理，因此如果某个类被标记为`final`，那么它是无法使用CGLIB做动态代理的。

   优点：目标类不需要实现特定的接口，更加灵活。

什么时候采用哪种动态代理？

1. 如果目标对象实现了接口，默认情况下会采用JDK的动态代理实现AOP
2. 如果目标对象实现了接口，可以强制使用CGLIB实现AOP
3. 如果目标对象没有实现了接口，必须采用CGLIB库

区别：

1. jdk动态代理使用jdk中的类Proxy来创建代理对象，它使用反射技术来实现，不需要导入其他依赖。cglib需要引入相关依赖：asm.jar，它使用字节码增强技术来实现。
2. 当目标类实现了接口的时候Spring Aop默认使用jdk动态代理方式来增强方法，没有实现接口的时候使用cglib动态代理方式增强方法。

#### 实现原理

[Spring aop实现原理](https://www.zhihu.com/question/23641679)

Spring会为目标对象生成代理对象。当调用代理对象方法的时候，会触发CglibAopProxy.intercept()，然后将目标对象的增强包装成拦截器，形成拦截器链，最后执行全部拦截器和目标方法。



## IOC

[IOC基础](https://juejin.im/entry/588083111b69e60059034e3d#comment) | [IOC demo](https://juejin.im/post/5b399eb1e51d4553156c0525#heading-3)

IOC：控制反转，由Spring容器管理bean的整个生命周期。通过反射实现对其他对象的控制，包括初始化、创建、销毁等，解放手动创建对象的过程，同时降低类之间的耦合度。

IOC的好处：降低了类之间的耦合，对象创建和初始化交给Spring容器管理，在需要的时候只需向容器进行申请。

DI(依赖注入)：在Spring创建对象的过程中，把对象依赖的属性注入到对象中。有两种方式：构造器注入和属性注入。

### ioc容器

Spring主要有两种ioc容器，实现了BeanFactory接口的简单容器和ApplicationContext高级容器。

- `BeanFactory` ：延迟注入(使用到某个 bean 的时候才会注入),相比于`BeanFactory` 来说会占用更少的内存，程序启动速度更快。BeanFactory提供了最基本的ioc容器的功能（最基本的依赖注入支持）。

- `ApplicationContext` ：容器启动的时候，一次性创建所有 bean 。`ApplicationContext` 扩展了 `BeanFactory` ，除了有`BeanFactory`的功能还有额外更多功能，所以一般开发人员使用`ApplicationContext`会更多。

ApplicationContext 提供了 BeanFactory 没有的新特性：

1. 支持多语言版本；
2. 支持多种途径获取 Bean 定义信息；
3. 支持应用事件，方便管理 Bean；

DefaultListableBeanFactory 实现了 ioc 容器的基本功能，其他 ioc 容器如 XmlBeanFactory 和 ApplicationContext 都是通过持有或扩展 DefaultListableBeanFactory 获得基本的 ioc 容器的功能。 

### BeanDefinition

BeanDefinition 用于管理Spring应用的对象和对象之间的依赖关系，是对象依赖关系的数据抽象。

### 容器初始化

ioc 容器初始化过程：BeanDefinition 的资源定位、解析和注册。

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

loadBeanDefinitions 采用了模板模式，具体加载 BeanDefinition 的逻辑由各个子类完成。

### Bean生命周期

![](../img/bean-life-cycle.jpg)

1.对Bean进行实例化

2.依赖注入

3.如果Bean实现了BeanNameAware接口，Spring将调用setBeanName()，设置 Bean id（xml文件中bean标签的id）

4.如果Bean实现了BeanFactoryAware接口，Spring将调用setBeanFactory()

5.如果Bean实现了ApplicationContextAware接口，Spring容器将调用setApplicationContext()

6.如果存在BeanPostProcessor，Spring将调用它们的postProcessBeforeInitialization（预初始化）方法，在Bean初始化前对其进行处理

7.如果Bean实现了InitializingBean接口，Spring将调用它的afterPropertiesSet方法，然后调用xml定义的 init-method 方法，两个方法作用类似，都是在初始化 bean 的时候执行

8.如果存在BeanPostProcessor，Spring将调用它们的postProcessAfterInitialization（后初始化）方法，在Bean初始化后对其进行处理

9.Bean初始化完成，供应用使用，直到应用被销毁

10.如果Bean实现了DisposableBean接口，Spring将调用它的destory方法，然后调用在xml中定义的 destory-method 方法，这两个方法作用类似，都是在Bean实例销毁前执行。

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

### Aware接口

对于应用程序来说，应该尽量减少对Sping Api的耦合程度，然而有些时候为了运用Spring所提供的一些功能，有必要让Bean了解Spring容器对其进行管理的细节信息，如让Bean知道在容器中是以那个名称被管理的，或者让Bean知道BeanFactory或者ApplicationContext的存在，也就是让该Bean可以取得BeanFactory或者ApplicationContext的实例，如果Bean可以意识到这些对象，那么就可以在Bean的某些动作发生时，做一些如事件发布等操作。

BeanNameAware：通过调用setBeanName()可以让bean获取自身的id属性。

ApplicationContextAware：通过调用 setApplicationContext() 设置应用上下文实例，从而可以直接在 Bean 中使用应用上下文的服务。

ApplicationEventPublisherAware：通过调用 setApplicationEventPublisher() 给 Bean 设置事件发布器，从而可以在 Bean 中发布应用上下文的事件。

### BeanFactory和FactoryBean

BeanFactory：管理Bean的容器，Spring中生成的Bean都是由这个接口的实现来管理的。

FactoryBean：通常是用来创建比较复杂的bean，一般的bean 直接用xml配置即可，但如果一个bean的创建过程中涉及到很多其他的bean 和复杂的逻辑，直接用xml配置比较麻烦，这时可以考虑用FactoryBean，可以隐藏实例化复杂Bean的细节。

当配置文件中bean标签的class属性配置的实现类是FactoryBean时，通过 getBean()方法返回的不是FactoryBean本身，而是调用FactoryBean#getObject()方法所返回的对象，相当于FactoryBean#getObject()代理了getBean()方法。如果想得到FactoryBean必须使用 '&' + beanName 的方式获取。

Mybatis 提供了 SqlSessionFactoryBean，可以简化 SqlSessionFactory 的配置：

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

#### FactoryBean使用

[FactoryBean使用](https://www.cnblogs.com/davidwang456/p/3688250.html)

如果使用传统方式配置下面Car的\<bean>时，Car的每个属性分别对应一个\<property>元素标签。

```java
public   class  Car  {    
       private   int maxSpeed ;    
       private  String brand ;    
       private   double price ; 
}
```

如果用FactoryBean的方式实现就会灵活一些，下例通过逗号分割符的方式一次性地为Car的所有属性指定配置值：

```java
public   class  CarFactoryBean  implements  FactoryBean<Car>  {    
    private  String carInfo ;    
    public  Car getObject ()   throws  Exception  {    
        Car car =  new  Car () ;    
        String []  infos =  carInfo .split ( "," ) ;    
        car.setBrand ( infos [ 0 ]) ;    
        car.setMaxSpeed ( Integer. valueOf ( infos [ 1 ])) ;    
        car.setPrice ( Double. valueOf ( infos [ 2 ])) ;    
        return  car;    
    }    
    public  Class<Car> getObjectType ()   {    
        return  Car. class ;    
    }    
    public   boolean  isSingleton ()   {    
        return   false ;    
    }    
    public  String getCarInfo ()   {    
        return   this . carInfo ;    
    }    
    
    // 接受逗号分割符设置属性信息    
    public   void  setCarInfo ( String carInfo )   {    
        this . carInfocarInfo  = carInfo;    
    }    
}
```

xml 配置 CarFactoryBean：

```xml
<bean id="car" class="com.test.factorybean.CarFactoryBean" carInfo="超级跑车,400,2000000"/> 
```

当调用getBean("car") 时，Spring通过反射机制发现CarFactoryBean实现了FactoryBean的接口，这时Spring容器就调用接口方法CarFactoryBean#getObject()方法返回。如果希望获取CarFactoryBean的实例，则需要在使getBean(beanName) 方法时在beanName前显示的加上 "&" 前缀，例如getBean("&car")。

### bean注入容器的方法

将普通类交给Spring容器管理，通常有以下方法：

1、使用 @Configuration与@Bean 注解

2、使用@Controller @Service @Repository @Component 注解标注该类，然后启用@ComponentScan自动扫描

3、使用@Import 方法

@Import注解把bean导入到当前容器中。

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



## bean的作用域

Spring创建bean默认是单例，每一个Bean的实例只会被创建一次，通过getBean()获取的是同一个Bean的实例。可使用＜bean＞标签的scope属性来指定一个Bean的作用域。

```xml
<!-- 作用域：prototype -->
<bean name="accountDao" scope="prototype"     class="com.zejian.spring.springIoc.dao.impl.AccountDaoImpl"/>
```

通过注解来声明作用域：

```java
@Scope("prototype")
public class AccountDaoImpl {
    //......
}
```

容器在创建完一个prototype实例后，就不会去管理这个bean了，会把它交给应用自己去管理。

一般情况下，对有状态的bean应该使用prototype作用域，而对无状态的bean则应该使用singleton作用域。所谓有状态就是该bean保存有自己的信息，不能共享，否则会造成线程安全问题。而无状态则不保存信息，可以共享，spring中大部分bean都是单例的，整个生命周期过程只会存在一个。

request作用域：对于每次HTTP请求到达应用程序，Spring容器会创建一个全新的Request作用域的bean实例，且该bean实例仅在当前HTTP request内有效，整个请求过程也只会使用相同的bean实例，而其他请求HTTP请求则创建新bean的实例，当处理请求结束，request作用域的bean实例将被销毁。

session 作用域：每当创建一个新的HTTP Session时就会创建一个Session作用域的Bean，并该实例bean伴随着会话的结束（session过期）而销毁。



## 事务

事务就是一系列的操作原子执行。

Spring事务机制主要包括声明式事务和编程式事务。

声明式事务将事务管理代码从业务方法中分离出来，通过aop进行封装。用 @Transactional 注解开启声明式事务。

Spring声明式事务使得我们无需要去处理获得连接、关闭连接、事务提交和回滚等这些操作。

### @Transactional

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

### 事务传播行为

在TransactionDefinition接口中定义了七个事务传播行为：

1. PROPAGATION_REQUIRED 如果存在一个事务，则支持当前事务。如果没有事务则开启一个新的事务。如果嵌套调用的两个方法都加了事务注解，并且运行在相同线程中，则这两个方法使用相同的事务中。如果运行在不同线程中，则会开启新的事务。
2. PROPAGATION_SUPPORTS 如果存在一个事务，支持当前事务。如果没有事务，则非事务的执行。
3. PROPAGATION_MANDATORY 如果已经存在一个事务，支持当前事务。如果不存在事务，则抛出异常`IllegalTransactionStateException`。
4. PROPAGATION_REQUIRES_NEW 总是开启一个新的事务。需要使用JtaTransactionManager作为事务管理器。
5. PROPAGATION_NOT_SUPPORTED 总是非事务地执行，并挂起任何存在的事务。需要使用JtaTransactionManager作为事务管理器。
6. PROPAGATION_NEVER 总是非事务地执行，如果存在一个活动事务，则抛出异常。
7. PROPAGATION_NESTED 如果一个活动的事务存在，则运行在一个嵌套的事务中。如果没有活动事务, 则按PROPAGATION_REQUIRED 属性执行。

**PROPAGATION_NESTED 与PROPAGATION_REQUIRES_NEW的区别:**

使用PROPAGATION_REQUIRES_NEW时，内层事务与外层事务是两个独立的事务。一旦内层事务进行了提交后，外层事务不能对其进行回滚。两个事务互不影响。

使用PROPAGATION_NESTED时，外层事务的回滚可以引起内层事务的回滚。而内层事务的异常并不会导致外层事务的回滚，它是一个真正的嵌套事务。



## 循环依赖

[图解spring循环依赖](https://juejin.im/post/5e927e27f265da47c8012ed9#heading-5) | [循环依赖](https://blog.csdn.net/u010853261/article/details/77940767)

构造器注入的循环依赖：spring处理不了，直接抛出BeanCurrentlylnCreationException异常。

单例模式下属性注入的循环依赖：通过三级缓存处理循环依赖。 

非单例循环依赖：无法处理。

### 初始化

spring单例对象的初始化大略分为三步：

1. createBeanInstance：实例化bean，使用构造方法创建对象，为对象分配内存。
2. populateBean：进行依赖注入。
3. initializeBean：初始化bean。

this.singletonsCurrentlyInCreation.add(String beanName)将当前正在创建的bean id记录在缓存中，如果在记录的过程中发现自己已经在缓存中，则说明存在循环依赖，将抛出BeanCurrentlylnCreationException 异常表示循环依赖。创建完成的bean将会从缓存中清除。

### 三级缓存

Spring为了解决单例的循环依赖问题，使用了三级缓存。

singletonObjects：完成了初始化的单例对象map，bean name --> bean instance

earlySingletonObjects ：完成实例化未初始化的单例对象map，bean name --> bean instance

singletonFactories ： 单例对象工厂map，bean name --> ObjectFactory，单例对象实例化完成之后会加入singletonFactories。

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

   ```java
   	public void contextInitialized(ServletContextEvent event) {
   		initWebApplicationContext(event.getServletContext());
   	}
   ```

4. 初始化web.xml中配置的Servlet。如DispatcherServlet，用于匹配、处理每个servlet请求。



## Spring Bean线程安全

Spring Bean默认是单例的，大部分的Spring bean没有可变的状态（比如Service类和DAO类），是线程安全的。如果Bean带有状态，可以将bean设置为prototype或者使用ThreadLocal确保线程安全。