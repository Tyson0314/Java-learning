---
sidebar: heading
title: Spring源码分析
category: 源码分析
tag:
  - Spring
head:
  - - meta
    - name: keywords
      content: Spring源码,标签解析,源码分析,Bean加载,Spring设计模式,Spring AOP,Spring IOC,Bean,Bean生命周期
  - - meta
    - name: description
      content: 高质量的Spring源码分析总结
---

## 概述

前面我们已经分析了spring对于xml配置文件的解析，将分析的信息组装成 BeanDefinition，并将其保存注册到相应的 BeanDefinitionRegistry 中。至此，Spring IOC 的初始化工作完成。接下来我们将对bean的加载进行探索。

## BeanFactory

当我们显示或者隐式地调用 `getBean()` 时，则会触发加载 bean 阶段。如下：

```java
public class AppTest {
    @Test
    public void MyTestBeanTest() {
        BeanFactory bf = new XmlBeanFactory( new ClassPathResource("spring-config.xml"));
        MyTestBean myTestBean = (MyTestBean) bf.getBean("myTestBean");
    }
}
```

我们看到这个方法是在接口BeanFactory中定义的，我们看下BeanFactory体系结构，如下图所示： 

![](http://img.topjavaer.cn/img/202309200725956.png)

从上图我们看到：　　

（1）BeanFactory作为一个主接口不继承任何接口，暂且称为一级接口。

（2）有3个子接口继承了它，进行功能上的增强。这3个子接口称为二级接口。

（3）ConfigurableBeanFactory可以被称为三级接口，对二级接口HierarchicalBeanFactory进行了再次增强，它还继承了另一个外来的接口SingletonBeanRegistry

（4）ConfigurableListableBeanFactory是一个更强大的接口，继承了上述的所有接口，无所不包，称为四级接口。（这4级接口是BeanFactory的基本接口体系。

（5）AbstractBeanFactory作为一个抽象类，实现了三级接口ConfigurableBeanFactory大部分功能。

（6）AbstractAutowireCapableBeanFactory同样是抽象类，继承自AbstractBeanFactory，并额外实现了二级接口AutowireCapableBeanFactory

（7）DefaultListableBeanFactory继承自AbstractAutowireCapableBeanFactory，实现了最强大的四级接口ConfigurableListableBeanFactory，并实现了一个外来接口BeanDefinitionRegistry，它并非抽象类。

（8）最后是最强大的XmlBeanFactory，继承自DefaultListableBeanFactory，重写了一些功能，使自己更强大。 



#### 定义

BeanFactory，以Factory结尾，表示它是一个工厂类(接口)， **它负责生产和管理bean的一个工厂**。在Spring中，BeanFactory是IOC容器的核心接口，它的职责包括：实例化、定位、配置应用程序中的对象及建立这些对象间的依赖。BeanFactory只是个接口，并不是IOC容器的具体实现，但是Spring容器给出了很多种实现，如 DefaultListableBeanFactory、XmlBeanFactory、ApplicationContext等，其中**XmlBeanFactory就是常用的一个，该实现将以XML方式描述组成应用的对象及对象间的依赖关系**。XmlBeanFactory类将持有此XML配置元数据，并用它来构建一个完全可配置的系统或应用。  

BeanFactory是Spring IOC容器的鼻祖，是IOC容器的基础接口，所有的容器都是从它这里继承实现而来。可见其地位。BeanFactory提供了最基本的IOC容器的功能，即所有的容器至少需要实现的标准。

XmlBeanFactory，只是提供了最基本的IOC容器的功能。而且XMLBeanFactory,继承自DefaultListableBeanFactory。DefaultListableBeanFactory实际包含了基本IOC容器所具有的所有重要功能，是一个完整的IOC容器。

ApplicationContext包含BeanFactory的所有功能，通常建议比BeanFactory优先。

BeanFactory体系结构是典型的工厂方法模式，即什么样的工厂生产什么样的产品。BeanFactory是最基本的抽象工厂，而其他的IOC容器只不过是具体的工厂，对应着各自的Bean定义方法。但同时，其他容器也针对具体场景不同，进行了扩充，提供具体的服务。 如下：

```java
Resource resource = new FileSystemResource("beans.xml");
BeanFactory factory = new XmlBeanFactory(resource);
ClassPathResource resource = new ClassPathResource("beans.xml");
BeanFactory factory = new XmlBeanFactory(resource);
ApplicationContext context = new ClassPathXmlApplicationContext(new String[] {"applicationContext.xml"});
BeanFactory factory = (BeanFactory) context;
```

基本就是这些了，接着使用getBean(String beanName)方法就可以取得bean的实例；BeanFactory提供的方法及其简单，仅提供了六种方法供客户调用：

- boolean containsBean(String beanName) 判断工厂中是否包含给定名称的bean定义，若有则返回true
- Object getBean(String) 返回给定名称注册的bean实例。根据bean的配置情况，如果是singleton模式将返回一个共享实例，否则将返回一个新建的实例，如果没有找到指定bean,该方法可能会抛出异常
- Object getBean(String, Class) 返回以给定名称注册的bean实例，并转换为给定class类型
- Class getType(String name) 返回给定名称的bean的Class,如果没有找到指定的bean实例，则排除NoSuchBeanDefinitionException异常
- boolean isSingleton(String) 判断给定名称的bean定义是否为单例模式
- String[] getAliases(String name) 返回给定bean名称的所有别名 

```java
package org.springframework.beans.factory;  
import org.springframework.beans.BeansException;  
public interface BeanFactory {  
    String FACTORY_BEAN_PREFIX = "&";  
    Object getBean(String name) throws BeansException;  
    <T> T getBean(String name, Class<T> requiredType) throws BeansException;  
    <T> T getBean(Class<T> requiredType) throws BeansException;  
    Object getBean(String name, Object... args) throws BeansException;  
    boolean containsBean(String name);  
    boolean isSingleton(String name) throws NoSuchBeanDefinitionException;  
    boolean isPrototype(String name) throws NoSuchBeanDefinitionException;  
    boolean isTypeMatch(String name, Class<?> targetType) throws NoSuchBeanDefinitionException;  
    Class<?> getType(String name) throws NoSuchBeanDefinitionException;  
    String[] getAliases(String name);  
}
```



## FactoryBean

一般情况下，Spring通过反射机制利用`<bean>`的class属性指定实现类实例化Bean，在某些情况下，实例化Bean过程比较复杂，如果按照传统的方式，则需要在`<bean>`中提供大量的配置信息。配置方式的灵活性是受限的，这时采用编码的方式可能会得到一个简单的方案。Spring为此提供了一个org.springframework.bean.factory.FactoryBean的工厂类接口，用户可以通过实现该接口定制实例化Bean的逻辑。FactoryBean接口对于Spring框架来说占用重要的地位，Spring自身就提供了70多个FactoryBean的实现。它们隐藏了实例化一些复杂Bean的细节，给上层应用带来了便利。从Spring3.0开始，FactoryBean开始支持泛型，即接口声明改为`FactoryBean<T>`的形式。

以Bean结尾，表示它是一个Bean，不同于普通Bean的是：**它是实现了`FactoryBean<T>`接口的Bean，根据该Bean的ID从BeanFactory中获取的实际上是FactoryBean的getObject()返回的对象，而不是FactoryBean本身，如果要获取FactoryBean对象，请在id前面加一个&符号来获取**。

```java
package org.springframework.beans.factory;  
public interface FactoryBean<T> {  
    T getObject() throws Exception;  
    Class<?> getObjectType();  
    boolean isSingleton();  
}
```

在该接口中还定义了以下3个方法：

- **T getObject()**：返回由FactoryBean创建的Bean实例，如果isSingleton()返回true，则该实例会放到Spring容器中单实例缓存池中；
- **boolean isSingleton()**：返回由FactoryBean创建的Bean实例的作用域是singleton还是prototype；
- `Class<T> getObjectType()`：返回FactoryBean创建的Bean类型。

当配置文件中`<bean>`的class属性配置的实现类是FactoryBean时，通过getBean()方法返回的不是FactoryBean本身，而是FactoryBean#getObject()方法所返回的对象，相当于FactoryBean#getObject()代理了getBean()方法。
例：如果使用传统方式配置下面Car的`<bean>`时，Car的每个属性分别对应一个`<property>`元素标签。

```java
public class Car {  
    private int maxSpeed ;  
    private String brand ;  
    private double price ;  
    //get//set 方法
}
```



如果用FactoryBean的方式实现就灵活点，下例通过逗号分割符的方式一次性的为Car的所有属性指定配置值：

```java
import  org.springframework.beans.factory.FactoryBean;  
public  class CarFactoryBean implements  FactoryBean<Car> {  
    private String carInfo ;  
    public  Car getObject()  throws  Exception  {  
        Car car = new  Car();  
        String[] infos = carInfo.split(","); 
        car.setBrand(infos[0]);
        car.setMaxSpeed(Integer.valueOf(infos[1]));
        car.setPrice(Double.valueOf(infos[2]));
        return  car;  
    }  
    public  Class<Car> getObjectType(){  
        return Car.class ;  
    }  
    public boolean isSingleton(){  
        return false ;  
    }  
    public String getCarInfo(){  
        return  this.carInfo;  
    }  
  
    //接受逗号分割符设置属性信息  
    public void setCarInfo (String carInfo){  
        this.carInfo = carInfo;  
    }  
}
```

有了这个CarFactoryBean后，就可以在配置文件中使用下面这种自定义的配置方式配置CarBean了：

```xml
<bean d="car"class="com.dabin.spring.CarFactoryBean" P:carInfo="大奔,600,1000000"/>
```

当调用getBean("car")时，Spring通过反射机制发现CarFactoryBean实现了FactoryBean的接口，这时Spring容器就调用接口方法CarFactoryBean#getObject()方法返回。如果希望获取CarFactoryBean的实例，则需要在使用getBean(beanName)方法时在beanName前显示的加上"&"前缀：如getBean("&car"); 

## 获取bean

接下来我们回到加载bean的阶段，当我们显示或者隐式地调用 `getBean()` 时，则会触发加载 bean 阶段。如下：

```java
public Object getBean(String name) throws BeansException {
    return doGetBean(name, null, null, false);
}
```

内部调用 `doGetBean()` 方法，这个方法的代码比较长，各位耐心看下：

```java
@SuppressWarnings("unchecked")
protected <T> T doGetBean(final String name, @Nullable final Class<T> requiredType,
        @Nullable final Object[] args, boolean typeCheckOnly) throws BeansException {
    //获取 beanName，这里是一个转换动作，将 name 转换为 beanName
    final String beanName = transformedBeanName(name);
    Object bean;
    /*
     *检查缓存中的实例工程是否存在对应的实例
     *为何要优先使用这段代码呢？
     *因为在创建单例bean的时候会存在依赖注入的情况，而在创建依赖的时候为了避免循环依赖
     *spring创建bean的原则是在不等bean创建完就会将创建bean的objectFactory提前曝光，即将其加入到缓存中，一旦下个bean创建时依赖上个bean则直接使用objectFactory          
     *直接从缓存中或singletonFactories中获取objectFactory
     *就算没有循环依赖，只是单纯的依赖注入，如B依赖A，如果A已经初始化完成，B进行初始化时，需要递归调用getBean获取A，这是A已经在缓存里了，直接可以从这里取到
     */
    // Eagerly check singleton cache for manually registered singletons.
    Object sharedInstance = getSingleton(beanName);
    if (sharedInstance != null && args == null) {
        if (logger.isDebugEnabled()) {
            if (isSingletonCurrentlyInCreation(beanName)) {
                logger.debug("Returning eagerly cached instance of singleton bean '" + beanName +
                        "' that is not fully initialized yet - a consequence of a circular reference");
            }
            else {
                logger.debug("Returning cached instance of singleton bean '" + beanName + "'");
            }
        }
        //返回对应的实例，有些时候并不是直接返回实例，而是返回某些方法返回的实例
        //这里涉及到我们上面讲的FactoryBean，如果此Bean是FactoryBean的实现类，如果name前缀为"&",则直接返回此实现类的bean,如果没有前缀"&"，则需要调用此实现类的getObject方法，返回getObject里面真是的返回对象
        bean = getObjectForBeanInstance(sharedInstance, name, beanName, null);
    }
    else {
        //只有在单例的情况下才会解决循环依赖
        if (isPrototypeCurrentlyInCreation(beanName)) {
            throw new BeanCurrentlyInCreationException(beanName);
        }
        //尝试从parentBeanFactory中查找bean
        BeanFactory parentBeanFactory = getParentBeanFactory();
        if (parentBeanFactory != null && !containsBeanDefinition(beanName)) {
            // Not found -> check parent.
            String nameToLookup = originalBeanName(name);
            if (parentBeanFactory instanceof AbstractBeanFactory) {
                return ((AbstractBeanFactory) parentBeanFactory).doGetBean(
                        nameToLookup, requiredType, args, typeCheckOnly);
            }
            else if (args != null) {
                // Delegation to parent with explicit args.
                return (T) parentBeanFactory.getBean(nameToLookup, args);
            }
            else {
                // No args -> delegate to standard getBean method.
                return parentBeanFactory.getBean(nameToLookup, requiredType);
            }
        }
        //如果不是仅仅做类型检查，则这里需要创建bean，并做记录
        if (!typeCheckOnly) {
            markBeanAsCreated(beanName);
        }
        try {
            //将存储XML配置文件的GenericBeanDefinition转换为RootBeanDefinition，同时如果存在父bean的话则合并父bean的相关属性
            final RootBeanDefinition mbd = getMergedLocalBeanDefinition(beanName);
            checkMergedBeanDefinition(mbd, beanName, args);

            //如果存在依赖则需要递归实例化依赖的bean
            String[] dependsOn = mbd.getDependsOn();
            if (dependsOn != null) {
                for (String dep : dependsOn) {
                    if (isDependent(beanName, dep)) {
                        throw new BeanCreationException(mbd.getResourceDescription(), beanName,
                                "Circular depends-on relationship between '" + beanName + "' and '" + dep + "'");
                    }
                    registerDependentBean(dep, beanName);
                    try {
                        getBean(dep);
                    }
                    catch (NoSuchBeanDefinitionException ex) {
                        throw new BeanCreationException(mbd.getResourceDescription(), beanName,
                                "'" + beanName + "' depends on missing bean '" + dep + "'", ex);
                    }
                }
            }

            // 单例模式
            // 实例化依赖的bean后对bean本身进行实例化
            if (mbd.isSingleton()) {
                sharedInstance = getSingleton(beanName, () -> {
                    try {
                        return createBean(beanName, mbd, args);
                    }
                    catch (BeansException ex) {
                        // Explicitly remove instance from singleton cache: It might have been put there
                        // eagerly by the creation process, to allow for circular reference resolution.
                        // Also remove any beans that received a temporary reference to the bean.
                        destroySingleton(beanName);
                        throw ex;
                    }
                });
                bean = getObjectForBeanInstance(sharedInstance, name, beanName, mbd);
            }
            // 原型模式
            else if (mbd.isPrototype()) {
                // It's a prototype -> create a new instance.
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
            // 从指定的 scope 下创建 bean
            else {
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
            }
        }
        catch (BeansException ex) {
            cleanupAfterBeanCreationFailure(beanName);
            throw ex;
        }
    }

    // Check if required type matches the type of the actual bean instance.
    if (requiredType != null && !requiredType.isInstance(bean)) {
        try {
            T convertedBean = getTypeConverter().convertIfNecessary(bean, requiredType);
            if (convertedBean == null) {
                throw new BeanNotOfRequiredTypeException(name, requiredType, bean.getClass());
            }
            return convertedBean;
        }
        catch (TypeMismatchException ex) {
            if (logger.isDebugEnabled()) {
                logger.debug("Failed to convert bean '" + name + "' to required type '" +
                        ClassUtils.getQualifiedName(requiredType) + "'", ex);
            }
            throw new BeanNotOfRequiredTypeException(name, requiredType, bean.getClass());
        }
    }
    return (T) bean;
}
```

代码是相当长，处理逻辑也是相当复杂，下面将其进行拆分讲解。

### 获取 beanName

```java
final String beanName = transformedBeanName(name);
```

这里传递的是 name，不一定就是 beanName，可能是 aliasName，也有可能是 FactoryBean（带“&”前缀），所以这里需要调用 `transformedBeanName()` 方法对 name 进行一番转换，主要如下：

```java
protected String transformedBeanName(String name) {
    return canonicalName(BeanFactoryUtils.transformedBeanName(name));
}

// 去除 FactoryBean 的修饰符
public static String transformedBeanName(String name) {
    Assert.notNull(name, "'name' must not be null");
    String beanName = name;
    while (beanName.startsWith(BeanFactory.FACTORY_BEAN_PREFIX)) {
        beanName = beanName.substring(BeanFactory.FACTORY_BEAN_PREFIX.length());
    }
    return beanName;
}

// 转换 aliasName
public String canonicalName(String name) {
    String canonicalName = name;
    // Handle aliasing...
    String resolvedName;
    do {
        resolvedName = this.aliasMap.get(canonicalName);
        if (resolvedName != null) {
            canonicalName = resolvedName;
        }
    }
    while (resolvedName != null);
    return canonicalName;
}
```

主要处理过程包括两步：

1. 去除 FactoryBean 的修饰符。如果 name 以 “&” 为前缀，那么会去掉该 “&”，例如，`name = "&studentService"`，则会是 `name = "studentService"`。
2. 取指定的 alias 所表示的最终 beanName。主要是一个循环获取 beanName 的过程，例如别名 A 指向名称为 B 的 bean 则返回 B，若 别名 A 指向别名 B，别名 B 指向名称为 C 的 bean，则返回 C。



### 缓存中获取单例bean

单例在Spring的同一个容器内只会被创建一次，后续再获取bean直接从单例缓存中获取，当然这里也只是尝试加载，首先尝试从缓存中加载，然后再次尝试从singletonFactorry加载因为在创建单例bean的时候会存在依赖注入的情况，而在创建依赖的时候为了避免循环依赖，Spring创建bean的原则不等bean创建完成就会创建bean的ObjectFactory提早曝光加入到缓存中，一旦下一个bean创建时需要依赖上个bean，则直接使用ObjectFactory；就算没有循环依赖，只是单纯的依赖注入，如B依赖A，如果A已经初始化完成，B进行初始化时，需要递归调用getBean获取A，这是A已经在缓存里了，直接可以从这里取到。接下来我们看下获取单例bean的方法getSingleton(beanName)，进入方法体：

```java
@Override
@Nullable
public Object getSingleton(String beanName) {
    //参数true是允许早期依赖
    return getSingleton(beanName, true);
}
@Nullable
protected Object getSingleton(String beanName, boolean allowEarlyReference) {
    //检查缓存中是否存在实例,这里就是上面说的单纯的依赖注入，如B依赖A，如果A已经初始化完成，B进行初始化时，需要递归调用getBean获取A，这是A已经在缓存里了，直接可以从这里取到
    Object singletonObject = this.singletonObjects.get(beanName);
    //如果缓存为空且单例bean正在创建中，则锁定全局变量，为什么要判断bean在创建中呢？这里就是可以判断是否循环依赖了。
    //A依赖B，B也依赖A，A实例化的时候，发现依赖B，则递归去实例化B，B发现依赖A，则递归实例化A，此时会走到原点A的实例化，第一次A的实例化还没完成，只不过把实例化的对象加入到缓存中，但是状态还是正在创建中，由此回到原点发现A正在创建中，由此可以判断是循环依赖了
    if (singletonObject == null && isSingletonCurrentlyInCreation(beanName)) {
        synchronized (this.singletonObjects) {
            //如果此bean正在加载，则不处理
            singletonObject = this.earlySingletonObjects.get(beanName);
            if (singletonObject == null && allowEarlyReference) {
                //当某些方法需要提前初始化的时候会直接调用addSingletonFactory把对应的ObjectFactory初始化策略存储在singletonFactory中
                ObjectFactory<?> singletonFactory = this.singletonFactories.get(beanName);
                if (singletonFactory != null) {
                    //使用预先设定的getObject方法
                    singletonObject = singletonFactory.getObject();
                    记录在缓存中，注意earlySingletonObjects和singletonFactories是互斥的
                    this.earlySingletonObjects.put(beanName, singletonObject);
                    this.singletonFactories.remove(beanName);
                }
            }
        }
    }
    return singletonObject;
}
```

接下来我们根据源码再来梳理下这个方法，这样更易于理解，这个方法先尝试从singletonObjects里面获取实例，如果如果获取不到再从earlySingletonObjects里面获取，如果还获取不到，再尝试从singletonFactories里面获取beanName对应的ObjectFactory，然后再调用这个ObjectFactory的getObject方法创建bean,并放到earlySingletonObjects里面去，并且从singletonFactoryes里面remove调这个ObjectFactory，而对于后续所有的内存操作都只为了循环依赖检测时候使用，即allowEarlyReference为true的时候才会使用。
这里涉及到很多个存储bean的不同map，简单解释下：

1.singletonObjects:用于保存BeanName和创建bean实例之间的关系，beanName–>bean Instance

2.singletonFactories:用于保存BeanName和创建bean的工厂之间的关系，banName–>ObjectFactory

3.earlySingletonObjects:也是保存BeanName和创建bean实例之间的关系，与singletonObjects的不同之处在于，当一个单例bean被放到这里面后，那么当bean还在创建过程中，就可以通过getBean方法获取到了，其目的是用来检测循环引用。

4.registeredSingletons：用来保存当前所有已注册的bean.



### 从bean的实例中获取对象

获取到bean以后就要获取实例对象了，这里用到的是getObjectForBeanInstance方法。getObjectForBeanInstance是个频繁使用的方法，无论是从缓存中获得bean还是根据不同的scope策略加载bean.总之，我们得到bean的实例后，要做的第一步就是调用这个方法来检测一下正确性，其实就是检测获得Bean是不是FactoryBean类型的bean,如果是，那么需要调用该bean对应的FactoryBean实例中的getObject()作为返回值。接下来我们看下此方法的源码：

```java
protected Object getObjectForBeanInstance(
        Object beanInstance, String name, String beanName, @Nullable RootBeanDefinition mbd) {
    //如果指定的name是工厂相关的（以&开头的）
    if (BeanFactoryUtils.isFactoryDereference(name)) {
        //如果是NullBean则直接返回此bean
        if (beanInstance instanceof NullBean) {
            return beanInstance;
        }
        //如果不是FactoryBean类型，则验证不通过抛出异常
        if (!(beanInstance instanceof FactoryBean)) {
            throw new BeanIsNotAFactoryException(transformedBeanName(name), beanInstance.getClass());
        }
    }
    // Now we have the bean instance, which may be a normal bean or a FactoryBean.
    // If it's a FactoryBean, we use it to create a bean instance, unless the
    // caller actually wants a reference to the factory.
    //如果获取的beanInstance不是FactoryBean类型，则说明是普通的Bean，可直接返回
    //如果获取的beanInstance是FactoryBean类型,但是是以（以&开头的），也直接返回，此时返回的是FactoryBean的实例
    if (!(beanInstance instanceof FactoryBean) || BeanFactoryUtils.isFactoryDereference(name)) {
        return beanInstance;
    }
    Object object = null;
    if (mbd == null) {
        object = getCachedObjectForFactoryBean(beanName);
    }
    if (object == null) {
        // Return bean instance from factory.
        FactoryBean<?> factory = (FactoryBean<?>) beanInstance;
        // Caches object obtained from FactoryBean if it is a singleton.
        if (mbd == null && containsBeanDefinition(beanName)) {
            mbd = getMergedLocalBeanDefinition(beanName);
        }
        boolean synthetic = (mbd != null && mbd.isSynthetic());
        //到了这里说明获取的beanInstance是FactoryBean类型,但没有以"&"开头，此时就要返回factory内部getObject里面的对象了
        object = getObjectFromFactoryBean(factory, beanName, !synthetic);
    }
    return object;
}
```

接着我们来看看真正的核心功能getObjectFromFactoryBean(factory, beanName, !synthetic)方法中实现的，继续跟进代码：

```java
protected Object getObjectFromFactoryBean(FactoryBean<?> factory, String beanName, boolean shouldPostProcess) {
    // 为单例模式且缓存中存在
    if (factory.isSingleton() && containsSingleton(beanName)) {

        synchronized (getSingletonMutex()) {
            // 从缓存中获取指定的 factoryBean
            Object object = this.factoryBeanObjectCache.get(beanName);

            if (object == null) {
                // 为空，则从 FactoryBean 中获取对象
                object = doGetObjectFromFactoryBean(factory, beanName);

                // 从缓存中获取
                Object alreadyThere = this.factoryBeanObjectCache.get(beanName);
                if (alreadyThere != null) {
                    object = alreadyThere;
                }
                else {
                    // 需要后续处理
                    if (shouldPostProcess) {
                        // 若该 bean 处于创建中，则返回非处理对象，而不是存储它
                        if (isSingletonCurrentlyInCreation(beanName)) {
                            return object;
                        }
                        // 前置处理
                        beforeSingletonCreation(beanName);
                        try {
                            // 对从 FactoryBean 获取的对象进行后处理
                            // 生成的对象将暴露给bean引用
                            object = postProcessObjectFromFactoryBean(object, beanName);
                        }
                        catch (Throwable ex) {
                            throw new BeanCreationException(beanName,
                                    "Post-processing of FactoryBean's singleton object failed", ex);
                        }
                        finally {
                            // 后置处理
                            afterSingletonCreation(beanName);
                        }
                    }
                    // 缓存
                    if (containsSingleton(beanName)) {
                        this.factoryBeanObjectCache.put(beanName, object);
                    }
                }
            }
            return object;
        }
    }
    else {
        // 非单例
        Object object = doGetObjectFromFactoryBean(factory, beanName);
        if (shouldPostProcess) {
            try {
                object = postProcessObjectFromFactoryBean(object, beanName);
            }
            catch (Throwable ex) {
                throw new BeanCreationException(beanName, "Post-processing of FactoryBean's object failed", ex);
            }
        }
        return object;
    }
}
```

该方法应该就是创建 bean 实例对象中的核心方法之一了。这里我们关注三个方法：`beforeSingletonCreation()` 、 `afterSingletonCreation()` 、 `postProcessObjectFromFactoryBean()`。可能有小伙伴觉得前面两个方法不是很重要，LZ 可以肯定告诉你，这两方法是非常重要的操作，因为他们记录着 bean 的加载状态，是检测当前 bean 是否处于创建中的关键之处，对解决 bean 循环依赖起着关键作用。before 方法用于标志当前 bean 处于创建中，after 则是移除。其实在这篇博客刚刚开始就已经提到了 `isSingletonCurrentlyInCreation()` 是用于检测当前 bean 是否处于创建之中，如下：

```java
public boolean isSingletonCurrentlyInCreation(String beanName) {
    return this.singletonsCurrentlyInCreation.contains(beanName);
}
```

是根据 singletonsCurrentlyInCreation 集合中是否包含了 beanName，集合的元素则一定是在 `beforeSingletonCreation()` 中添加的，如下：

```java
protected void beforeSingletonCreation(String beanName) {
    if (!this.inCreationCheckExclusions.contains(beanName) && !this.singletonsCurrentlyInCreation.add(beanName)) {
        throw new BeanCurrentlyInCreationException(beanName);
    }
}
```

`afterSingletonCreation()` 为移除，则一定就是对 singletonsCurrentlyInCreation 集合 remove 了，如下：

```java
protected void afterSingletonCreation(String beanName) {
    if (!this.inCreationCheckExclusions.contains(beanName) && !this.singletonsCurrentlyInCreation.remove(beanName)) {
        throw new IllegalStateException("Singleton '" + beanName + "' isn't currently in creation");
    }
}
```

我们再来看看真正的核心方法 doGetObjectFromFactoryBean

```java
private Object doGetObjectFromFactoryBean(final FactoryBean<?> factory, final String beanName)
        throws BeanCreationException {

    Object object;
    try {
        if (System.getSecurityManager() != null) {
            AccessControlContext acc = getAccessControlContext();
            try {
                object = AccessController.doPrivileged((PrivilegedExceptionAction<Object>) factory::getObject, acc);
            }
            catch (PrivilegedActionException pae) {
                throw pae.getException();
            }
        }
        else {
            object = factory.getObject();
        }
    }
    catch (FactoryBeanNotInitializedException ex) {
        throw new BeanCurrentlyInCreationException(beanName, ex.toString());
    }
    catch (Throwable ex) {
        throw new BeanCreationException(beanName, "FactoryBean threw exception on object creation", ex);
    }

    // Do not accept a null value for a FactoryBean that's not fully
    // initialized yet: Many FactoryBeans just return null then.
    if (object == null) {
        if (isSingletonCurrentlyInCreation(beanName)) {
            throw new BeanCurrentlyInCreationException(
                    beanName, "FactoryBean which is currently in creation returned null from getObject");
        }
        object = new NullBean();
    }
    return object;
}
```

以前我们曾经介绍过FactoryBean的调用方法，如果bean声明为FactoryBean类型，则当提取bean时候提取的不是FactoryBean，而是FactoryBean中对应的getObject方法返回的bean,而doGetObjectFromFactroyBean真是实现这个功能。

而调用完doGetObjectFromFactoryBean方法后，并没有直接返回，getObjectFromFactoryBean方法中还调用了object = postProcessObjectFromFactoryBean(object, beanName);方法，在子类AbstractAutowireCapableBeanFactory，有这个方法的实现：

```java
@Override
protected Object postProcessObjectFromFactoryBean(Object object, String beanName) {
    return applyBeanPostProcessorsAfterInitialization(object, beanName);
}
@Override
public Object applyBeanPostProcessorsAfterInitialization(Object existingBean, String beanName)
        throws BeansException {
    Object result = existingBean;
    for (BeanPostProcessor beanProcessor : getBeanPostProcessors()) {
        Object current = beanProcessor.postProcessAfterInitialization(result, beanName);
        if (current == null) {
            return result;
        }
        result = current;
    }
    return result;
}
```

对于后处理器的使用，我们目前还没接触，后续会有大量篇幅介绍，这里我们只需要了解在Spring获取bean的规则中有这样一条：尽可能保证所有bean初始化后都会调用注册的BeanPostProcessor的postProcessAfterInitialization方法进行处理，在实际开发过程中大可以针对此特性设计自己的业务处理。