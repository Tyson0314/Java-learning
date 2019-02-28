<!-- MarkdownTOC autoanchor="true" autolink="true" uri_encoding="false" -->

- [Spring的核心](#spring的核心)
- [装配bean](#装配bean)
    - [自动装配bean](#自动装配bean)
        - [验证自动装配](#验证自动装配)
    - [通过Java代码装配bean](#通过java代码装配bean)
    - [通过xml装配bean](#通过xml装配bean)
        - [构造器注入](#构造器注入)
        - [属性注入](#属性注入)
    - [混合配置](#混合配置)
        - [在JavaConfig中引用xml配置](#在javaconfig中引用xml配置)
        - [在xml配置中引用JavaConfig](#在xml配置中引用javaconfig)
- [高级装配](#高级装配)
    - [自动装配的歧义性](#自动装配的歧义性)
        - [标识首选的bean](#标识首选的bean)
        - [限定自动装配的bean](#限定自动装配的bean)
        - [创建自定义的限定符](#创建自定义的限定符)
    - [bean的作用域](#bean的作用域)
    - [运行时值注入](#运行时值注入)
        - [注入外部的值](#注入外部的值)
        - [使用Spring表达式语言进行装配](#使用spring表达式语言进行装配)
- [面向切面](#面向切面)
    - [AOP术语](#aop术语)
    - [Spring对aop的支持](#spring对aop的支持)
    - [通过切面选择连接点](#通过切面选择连接点)
    - [使用注解创建切面](#使用注解创建切面)
        - [定义切面](#定义切面)
        - [创建环绕通知](#创建环绕通知)
        - [处理通知中的参数](#处理通知中的参数)
        - [通过注解引入新功能](#通过注解引入新功能)
    - [在xml中声明切面](#在xml中声明切面)
        - [声明通知](#声明通知)
        - [创建环绕通知](#创建环绕通知-1)
        - [为通知传递参数](#为通知传递参数)
        - [通过切面引入新的功能](#通过切面引入新的功能)
    - [注入AspectJ切面](#注入aspectj切面)

<!-- /MarkdownTOC -->

<a id="spring的核心"></a>
## Spring的核心

相对于EJB(Enterprise JaveBean)，Spring提供了更加轻量级和简单的编程模型。

Spring可以简化Java开发：1.基于pojo的轻量级和最小侵入式编程；2.通过依赖注入和面向接口实现松耦合；3.基于切面和惯例进行声明式编程；4.通过切面和模板减少样板式代码。

1. 非侵入编程

很多框架通过强迫应用继承它们的类或实现它们的接口从而导致应用与框架绑死。Spring竭力避免自身API与应用代码的耦合。Spring不会强迫你实现Spring规范的接口或继承Spring规范的类。

2. 依赖注入

假如两个类相互协作完成特定的业务，按照传统的做法，每个对象负责管理与自己相互协作的对象的引用，这会导致高度耦合。

```java
public class Knight {
    private RescueQuest quest;
    
    public Knight() {
        this.quest = new RescueQuest(); //勇士只能进行救援工作
    }
    
    public void embarkOnQuest() {
        quest.embark();
    }
}
```

通过DI，对象无需自行创建或管理它们的依赖关系，依赖关系将被自动注入到对象当中。对象只通过接口来表明依赖关系，可以传入不同的具体实现。

```java
public class Knight {
    private Quest quest;
    
    //通过构造器注入依赖，可以传入任何Quest接口的实现类，如RescueQuest，SlayDragonQuest等
    public Knight(Quest quest) {
        this.quest = quest;
    }
    
    public void embarkOnQuest() {
        quest.embark();
    }
}
```

3. 面向切面编程

aop允许你将遍布应用各处的功能（日志，事务管理）分离出来形成可重用的组件。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190216210355438.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1R5c29uMDMxNA==,size_16,color_FFFFFF,t_70)

4. 模板技术

编程中会遇到许多样板式代码，如使用JDBC访问数据库查询数据时，首先需要创建数据库连接（Connection），然后再创建一个语句对象（PrepareStatement），然后进行查询，可能需要处理SQL异常，最后关闭数据库连接、语句和结果集。Spring通过模板封装来消除样板式代码。Spring的JDBCTemplate可以避免传统的JDBC样板代码。



<a id="装配bean"></a>
## 装配bean

Spring bean装配机制：1.自动装配；2.使用spring基于Java的配置(JavaConfig)；3.xml配置。

我们应当尽可能使用自动装配的机制，显式配置越少越好。当自动装配行不通时，如使用第三方库的组件装配到应用，则需采用显式装配的方式，此时推荐使用类型安全并且比xml更为强大的JavaConfig。只有当需要使用便利的xml命名空间，并且在JavaConfig中没有同样的实现时，才应该使用xml。

<a id="自动装配bean"></a>
### 自动装配bean

实现自动装配bean 需要两点：1.开启组件扫描；2.给bean加自动装配的注解。

```java
public interface CD {
    public void play();
}

@Component("cd")
public class EasonCD implements CD {
    private String song = "Ten years";
    private String singer = "Eason";

    @Override
    public void play() {
        System.out.println("singer--" + singer + " sings " + song);
    }
}
```

@Component表明该类会作为组件类，并告知Spring为这个类创建bean。@Component("cd")可以为bean命名，没有配置默认是类名首字母小写。@Named注解与@Component作用类似。

CDPlayer类中，在构造器上加了注解@Autowired，表明当Spring创建CDPlayer bean的时候，会通过这个构造器进行实例化并传入一个类型为CD的bean。@Inject注解和@Autowired作用类似。

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * @Autowired，通过byType的形式自动装配，可以用在属性，构造器和setter方法上
 * required属性设为false，没有符合条件的bean也不会抛异常
 */
@Component
public class CDPlayer implements MediaPlayer {
    private CD cd;

    @Autowired
    public CDPlayer(CD cd) {
        this.cd = cd;
    }

    @Override
    public void play() {
        cd.play();
    }
}
```

组件扫描默认不启动，需要显式配置一下Spring，开启组件扫描。通过@ComponentScan注解启动了组件扫描，扫描包下是否有@Component标注的类，若有，则会在Spring中自动为其创建bean。

```java
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

/**
 * @Configuration用于定义配置类。该类应该包含Spring应用上下文如何创建bean的细节。
 * 通过@ComponentScan注解启动了组件扫描
 * 配置basePackages则扫描指定的包，没配置则默认扫描当前包
 * 配置basePackageClasses则通过扫描配置的类所在的包
 */
@Configuration
//@ComponentScan(basePackages = {"com.tyson.pojo", "com.tyson.service"})
@ComponentScan(basePackageClasses = {EasonCD.class})
public class CDPlayerConfig {
}
```

<a id="验证自动装配"></a>
#### 验证自动装配

```java
import com.tyson.config.CDPlayerConfig;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * @RunWith(SpringJUnit4ClassRunner.class)在测试开始时自动创建Spring应用上下文
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {CDPlayerConfig.class}) //开启组件扫描
public class CDPlayerTest {
    @Autowired
    private CD cd;
    @Autowired
    private MediaPlayer player;

    @Test
    public void cdShouldNotBeNull() {
        Assert.assertNotNull(cd);
    }

    @Test
    public void play() {
        player.play();
    }
}
```

也可以在applicationContext.xml使用\<context:component-scan/>来启动组件扫描。

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:c="http://www.springframework.org/schema/c"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd">
    
    <!--使用context需要在xml文件头部引入context命名空间-->
    <context:component-scan base-package="com.tyson.pojo"/>
</beans>
```

测试代码。

```java
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;


/**
 * @RunWith(SpringJUnit4ClassRunner.class)在测试开始时自动创建Spring应用上下文
 */
@RunWith(SpringJUnit4ClassRunner.class)
//@ContextConfiguration(classes = {CDPlayerConfig.class}) //开启组件扫描
@ContextConfiguration(locations = {"classpath:applicationContext.xml"}) //开启组件扫描
public class CDPlayerTest {
    @Autowired
    private CD cd;
    @Autowired
    private MediaPlayer player;

    @Test
    public void cdShouldNotBeNull() {
        Assert.assertNotNull(cd);
    }

    @Test
    public void play() {
        player.play();
    }
}
```

<a id="通过java代码装配bean"></a>
### 通过Java代码装配bean

有些情况下无法使用自动装配，如要将第三方类库的组件装配到我们的应用，便无法使用自动装配。下面使用JavaConfig显式配置Spring。（JavaConfig是配置代码，应该放在单独的包中，与其他应用程序逻辑分离开。）

CDPlayerConfig配置类

```java
import com.tyson.pojo.CD;
import com.tyson.pojo.CDPlayer;
import com.tyson.pojo.EasonCD;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @Configuration用于定义配置类，可替换xml配置文件。该类应该包含Spring应用上下文如何创建bean的细节。
 */
@Configuration
public class CDPlayerConfig {
    @Bean(name = "easonCD")  //@Bean告诉spring将对象注册到spring容器
    public CD easonCD() {
        return new EasonCD();
    }

    /**
     * 推荐这种方式，不要求将CD声明到同一个配置文件
     * CD可以采用各种方式创建（自动扫描、配置类、JavaConfig），Spring都能将其传入到配置方法中
     */
    @Bean(name = "cdPlayer")
    public CDPlayer cdPlayer(CD cd) {
        return new CDPlayer(cd);
    }

/*    @Bean(name = "cdPlayer")
    public CDPlayer cdPlayer() {
        return new CDPlayer(easonCD());
    }*/
}
```

通过AnnotationConfigApplicationContext从Java配置类加载Spring应用上下文。

```java
//AnnotationConfigApplicationContext：从一个或多个基于Java的配置类加载Spring应用上下文
@Test
public void play() {
    ApplicationContext cxt = new AnnotationConfigApplicationContext(CDPlayerConfig.class);
    CDPlayer cdPlayer = (CDPlayer)cxt.getBean("cdPlayer");
    cdPlayer.play();
}
```

<a id="通过xml装配bean"></a>
### 通过xml装配bean

<a id="构造器注入"></a>
#### 构造器注入

借助构造器注入初始化bean有两种方式：constructor-arg元素或者Spring3.0引入的c-命名空间。

1. 将引用注入构造器。

EasonCD.java

```java
public class EasonCD implements CD {
    @Override
    public void play() {
        System.out.println("haha");
    }
}
```

CDPlayer.java

```java
import org.springframework.beans.factory.annotation.Autowired;

public class CDPlayer implements MediaPlayer {
    private CD cd;

    /**
     * 构造器注入
     */
    public CDPlayer(CD cd) {
        this.cd = cd;
    }

    @Override
    public void play() {
        cd.play();
    }
}
```

applicationContext.xml使用构造器注入创建bean。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:c="http://www.springframework.org/schema/c"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!--使用默认构造器创建bean-->
    <bean id="cd" class="com.tyson.pojo.EasonCD"/>
    <!--借助构造器注入初始化bean，使用constructor-arg元素或者Spring3.0引入的c-命名空间-->
    <!--方式1-->
    <!--<bean id="cdPlayer" class="com.tyson.pojo.CDPlayer">
        <constructor-arg ref="cd"/>
    </bean>-->
    <!--方式2，更为简练，c命名空间需先引入c命名空间-->
    <!--<bean id="cdPlayer" class="com.tyson.pojo.CDPlayer" c:cd-ref="cd"/>-->
    <!--使用索引识别构造器参数-->
    <bean id="cdPlayer" class="com.tyson.pojo.CDPlayer" c:_0-ref="cd"/>
</beans>
```

测试类

```java
/**
 * AnnotationConfigApplicationContext：从一个或多个基于Java的配置类加载Spring应用上下文
 * ClassPathXmlApplicationContext：从类路径上的一个或多个xml配置文件中加载Spring应用上下文
 */
@Test
public void play() {
    ApplicationContext cxt = new ClassPathXmlApplicationContext("applicationContext.xml");
    CDPlayer cdPlayer = (CDPlayer)cxt.getBean("cdPlayer");
    cdPlayer.play();
}
```

c-命名空间元素组成如下图，可以看到使用了构造器参数。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190219211708943.png)

也可以使用索引识别构造器参数。

```xml
<bean id="cdPlayer" class="com.tyson.pojo.CDPlayer" c:_0-ref="cd"/>
```

2. 将字面量注入构造器

```java
public class PuthCD implements CD {
    private String song;
    private String note;

    public PuthCD(String song, String note) {
        this.song = song;
        this.note = note;
    }

    @Override
    public void play() {
        System.out.println("Puth sings \"" + song + "\"");
    }
}
```

利用constructor-arg元素的value进字面量注入构造器。

```xml
<!--将字面量注入构造器-->
<bean id="puthCD" class="com.tyson.pojo.PuthCD">
    <constructor-arg value="we don't talk anymore"/>
    <constructor-arg value="emmm"/>
</bean>
```

也可以使用c-空间。

```xml
<!--将字面量注入构造器方式1-->
<!--    <bean id="puthCD" class="com.tyson.pojo.PuthCD">
        <constructor-arg value="we don't talk anymore"/>
        <constructor-arg value="emmm"/>
    </bean>-->
<!--将字面量注入构造器方式2-->
<!--    <bean id="puthCD" class="com.tyson.pojo.PuthCD"
        c:song="we don't talk anymore"
        c:note="emmm"/>-->
<bean id="puthCD" class="com.tyson.pojo.PuthCD"
      c:_0="we don't talk anymore"
      c:_1="emmm"/>
```

测试类

```java
@Test
public void puthPlay() {
    ApplicationContext cxt = new ClassPathXmlApplicationContext("applicationContext.xml");
    PuthCD puthCD = (PuthCD)cxt.getBean("puthCD");
    puthCD.play();
}
```

3. 装配集合

```java
public class EuropeCD implements CD {
    private String name;
    private List<String> singers;

    public EuropeCD(String name, List<String> singers) {
        this.name = name;
        this.singers = singers;
    }

    @Override
    public void play() {
        System.out.println(name);
        singers.forEach(singer -> {
            System.out.print(singer + ", ");
        });
    }
}
```

使用list元素装配集合。这里c-命名空间没有响应的实现，只能用constructor-arg元素。

```xml
<bean id="europeCD" class="com.tyson.pojo.EuropeCD">
    <constructor-arg value="europe singers"/>
    <constructor-arg>
        <list>
            <!--list里面也可以用ref元素引用其他bean-->
            <value>断眉</value>
            <value>梦龙</value>
            <value>西域男孩</value>
            <value>一体共和</value>
        </list>
    </constructor-arg>
</bean>
```

<a id="属性注入"></a>
#### 属性注入

除了可以通过构造器注入初始化bean以外，也可以通过属性注入初始化bean。通过属性注入，则类中不能有带参数的构造器，或者要显式声明无参的构造器。

1. 将引用注入属性中

```java
import org.springframework.beans.factory.annotation.Autowired;

public class CDPlayer implements MediaPlayer {
    private CD cd;

    /**
     *属性注入
     */
    public void setCd(CD cd) {
        this.cd = cd;
    }

    @Override
    public void play() {
        cd.play();
    }
}
```

applicationContext.xml中进行属性注入创建bean。有两种方式，使用property元素或者p-命名空间。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:c="http://www.springframework.org/schema/c"
       xmlns:p="http://www.springframework.org/schema/p"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">
    <!--属性注入-->
    <!--    <bean id="cdPlayer" class="com.tyson.pojo.CDPlayer">
            <property name="cd" ref="cd"/>
        </bean>-->
    <!--使用p-命名空间，需要先在xml文件头部引入p命名空间-->
    <bean id="cdPlayer" class="com.tyson.pojo.CDPlayer"
          p:cd-ref="cd"/>
</beans>
```

p命名空间元素组成如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190220133234267.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1R5c29uMDMxNA==,size_16,color_FFFFFF,t_70)

2. 将字面量和集合注入属性中

EuropeCD.java

```java
import java.util.List;

public class EuropeCD implements CD {
    private String name;
    private List<String> singers;

    //属性注入
    public void setName(String name) {
        this.name = name;
    }

    //属性注入
    public void setSingers(List<String> singers) {
        this.singers = singers;
    }

    @Override
    public void play() {
        System.out.println(name);
        singers.forEach(singer -> {
            System.out.print(singer + ", ");
        });
    }
}
```

applicationContext.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:c="http://www.springframework.org/schema/c"
       xmlns:p="http://www.springframework.org/schema/p"
       xmlns:util="http://www.springframework.org/schema/util"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/util
        http://www.springframework.org/schema/util/spring-util.xsd">
    
	<!--注入字面量和集合到属性-->
    <!--<bean id="europeCD" class="com.tyson.pojo.EuropeCD">
                <property name="name" value="Europer singers"/>
                <property name="singers">
                    <list>
                        <value>断眉</value>
                        <value>梦龙</value>
                        <value>西域男孩</value>
                        <value>一体共和</value>
                    </list>
                </property>
            </bean>-->
    <!--使用p和util元素，需要先在xml文件头部引入相应命名空间-->
    <bean id="europeCD" class="com.tyson.pojo.EuropeCD"
          p:name="Europer singers"
          p:singers-ref="singers"/>
    <util:list id="singers">
        <value>断眉</value>
        <value>梦龙</value>
        <value>西域男孩</value>
        <value>一体共和</value>
    </util:list>
</beans>
```

引入util命名空间。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190220152747529.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1R5c29uMDMxNA==,size_16,color_FFFFFF,t_70)

<a id="混合配置"></a>
### 混合配置

<a id="在javaconfig中引用xml配置"></a>
#### 在JavaConfig中引用xml配置

假如CD使用xml配置，CDPlayer使用JavaConfig配置。

```java
import com.tyson.pojo.CD;
import com.tyson.pojo.CDPlayer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CDPlayerConfig {
    @Bean(name = "cdPlayer")
    public CDPlayer cdPlayer(CD cd) {
        return new CDPlayer(cd);
    }
}
```

装配CD定义在cd-config.xml中。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:c="http://www.springframework.org/schema/c"
       xmlns:p="http://www.springframework.org/schema/p"
       xmlns:util="http://www.springframework.org/schema/util"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/util
        http://www.springframework.org/schema/util/spring-util.xsd">

    <!--使用p和util元素，需要先在xml文件头部引入相应的命名空间-->
    <bean id="europeCD" class="com.tyson.pojo.EuropeCD"
          p:name="Europer singers"
          p:singers-ref="singers"/>
    <util:list id="singers">
        <value>断眉</value>
        <value>梦龙</value>
        <value>西域男孩</value>
        <value>一体共和</value>
    </util:list>
</beans>
```

新建一个SoundSystemConfig.java类，通过@Import和@ImportResource引入JavaConfig配置类和xml配置文件。

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.ImportResource;

//JavaConfig引用JavaConfig--@Import(CDPlayerConfig.class, CDConfig.class)
@Configuration
@Import(CDPlayerConfig.class)
@ImportResource("classpath:cd-config.xml")
public class SoundSystemConfig {
}
```

测试代码

```java
/**
 * AnnotationConfigApplicationContext：从一个或多个基于Java的配置类加载Spring应用上下文
 * ClassPathXmlApplicationContext：从类路径上的一个或多个xml配置文件中加载Spring应用上下文
 */
@Test
public void javaConfigImportXmlTest() {
    ApplicationContext ctx = new AnnotationConfigApplicationContext(SoundSystemConfig.class);
    CDPlayer player = (CDPlayer) ctx.getBean("cdPlayer");
    player.play();
}
```

<a id="在xml配置中引用javaconfig"></a>
#### 在xml配置中引用JavaConfig

假如CDPlayer使用player-config.xml配置，CD使用cd-config.xml配置，则在player-config.xml中需要用import元素引用cd-config文件，从而将CD注入到CDPlayer。

player-config.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:c="http://www.springframework.org/schema/c"
       xmlns:p="http://www.springframework.org/schema/p"
       xmlns:util="http://www.springframework.org/schema/util"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/util
        http://www.springframework.org/schema/util/spring-util.xsd">

    <!--cd-config.xml中bean的名称为europeCD-->
    <import resource="cd-config.xml"/>
    <bean id="cdPlayer" class="com.tyson.pojo.CDPlayer"
          c:cd-ref="europeCD"/>
</beans>
```

如果CDPlayer使用player-config.xml配置，而CD使用JavaConfig来配置，则需要这样声明bean：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:c="http://www.springframework.org/schema/c"
       xmlns:p="http://www.springframework.org/schema/p"
       xmlns:util="http://www.springframework.org/schema/util"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/util
        http://www.springframework.org/schema/util/spring-util.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd">

    <!--引入context命名空间；扫描CDConfig，生成CD bean-->
    <context:component-scan base-package="com.tyson.config"/>
    <!--cd-config.xml中bean的名称为europeCD-->
    <!--<import resource="cd-config.xml"/>-->
    <!--CDConfig中bean的名称为europeCD-->
    <bean class="com.tyson.config.CDConfig"/>
    <bean id="cdPlayer" class="com.tyson.pojo.CDPlayer"
          p:cd-ref="easonCD"/>
</beans>
```

CDConfig.java

```java
import com.tyson.pojo.CD;
import com.tyson.pojo.EasonCD;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CDConfig {
    @Bean(name = "easonCD")
    public CD getCD() {
        return new EasonCD();
    }
}
```

测试代码：

```java
@Test
public void xmlImportJavaConfigTest() {
    ApplicationContext cxt = new ClassPathXmlApplicationContext("player-config.xml");
    CDPlayer player = (CDPlayer) cxt.getBean("cdPlayer");
    player.play();
}
```

也可以使用第三个配置文件，将JavaConfig和xml配置组合起来。

soundSystem-config.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:c="http://www.springframework.org/schema/c"
       xmlns:p="http://www.springframework.org/schema/p"
       xmlns:util="http://www.springframework.org/schema/util"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/util
        http://www.springframework.org/schema/util/spring-util.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd">

    <!--引入context命名空间；扫描CDConfig，生成CD bean-->
    <context:component-scan base-package="com.tyson.config"/>

    <bean class="com.tyson.config.CDConfig"/>
    <import resource="player-config.xml"/>
</beans>
```

故无论是JavaConfig还是xml配置，都可以先创建一个根配置，在根配置里将多个装配类或者xml文件组合起来，同时可以在根配置打开组件扫描（通过\<context:component-scan/\>或者@ComponentScan）。

<a id="高级装配"></a>
## 高级装配

<a id="自动装配的歧义性"></a>
### 自动装配的歧义性

编写Dessert接口，有三个实现Dessert的类：Cake、IceCream和Cookie。假如三个类都使用@Component注解，Spring在进行组件扫描时会为它们创建bean，这时如果Spring试图自动装配setDessert里面的Dessert参数时，这时Spring便不知道该使用哪个bean。

```java
@Autowired
public void setDessert(Dessert dessert) {
    this.dessert = dessert;
}
```

<a id="标识首选的bean"></a>
#### 标识首选的bean

通过设置其中某个bean为首选的bean可避免自动装配的歧义性。

定义Bean时使用@Primary注解。

```java
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

@Component
@Primary
public class Cookie implements Dessert {
    @Override
    public void make() {
        System.out.println("making cookie...");
    }
}
```

或者在JavaConfig类中使用@Primary注解。

```java
import com.tyson.pojo.Cookie;
import com.tyson.pojo.Dessert;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class DessertConfig {
    @Bean
    @Primary
    public Dessert dessert() {
        return new Cookie();
    }
}
```

xml配置使用primary属性。

```xml
<bean id="cookie" class="com.tyson.pojo.Cookie" primary="true"/>
```

<a id="限定自动装配的bean"></a>
#### 限定自动装配的bean

@Primary只能标识一个首选的bean，当首选的bean存在有多个时，这种方法便失效。Spring的限定符可以在可选的bean进行缩小范围，最终使得只有一个bean符合限定条件。

@Qualifier注解是使用限定符的主要方式。它与@Autowired和@Inject协同使用，在注入的时候指定注入哪个bean。

```java
@Autowired
@Qualifier("cookie")
public void setDessert(Dessert dessert) {
    this.dessert = dessert;
}
```

这种方式setDessert方法上所指定的限定符和要注入的bean名称是紧耦合的。如果类名称修改则会导致限定符失效。

<a id="创建自定义的限定符"></a>
#### 创建自定义的限定符

为bean设置自己的限定符。

```java
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

@Component
@Qualifier("cold")
public class IceCream implements Dessert {

    @Override
    public void make() {
        System.out.println("making ice cream......");
    }
}
```

在自动装配的地方引入自定义限定符。@Autowired和@Qualifier组合，按byName方式自动装配。

```java
@Autowired
@Qualifier("cold")
public void setDessert(Dessert dessert) {
    this.dessert = dessert;
}
```

当使用JavaConfig装配bean时，@Qualifier可以和@Bean注解一起使用。

```java
import com.tyson.pojo.Cookie;
import com.tyson.pojo.Dessert;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
//@ComponentScan(basePackages = {"com.tyson.pojo"})
public class DessertConfig {
    @Bean
    @Qualifier("cold")
    public Dessert dessert() {
        return new IceCream();
    }
}
```

使用自定义的限定符注解

当有多个Dessert都具有cold特征时，此时需要添加更多的限定符来避免歧义性的问题。

```java
import com.tyson.pojo.Dessert;
import com.tyson.pojo.IceCream;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DessertConfig {
    @Bean
    @Qualifier("cold")
    @Qualifier("creamy")
    public Dessert dessert() {
        return new IceCream();
    }
}
```

然而在一个类上出现多个相同类型的注解是不被允许的，会报编译错误。可以通过创建自定义的限定符注解解决这个问题。下面是自定义@Cold注解的例子：

```java
import org.springframework.beans.factory.annotation.Qualifier;

import java.lang.annotation.*;

@Target({ElementType.FIELD, ElementType.METHOD, ElementType.PARAMETER, ElementType.TYPE, ElementType.CONSTRUCTOR})
@Retention(RetentionPolicy.RUNTIME)
@Qualifier  //具有@Qualifier的特性
public @interface Cold {
}
```

自定义@Creamy注解。

```java
import org.springframework.beans.factory.annotation.Qualifier;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD, ElementType.METHOD, ElementType.PARAMETER, ElementType.TYPE, ElementType.CONSTRUCTOR})
@Retention(RetentionPolicy.RUNTIME)
@Qualifier  //具有@Qualifier的特性
public @interface Creamy {
}
```

使用@Cold和@Creamy。

```java
import com.tyson.annotation.Cold;
import com.tyson.annotation.Creamy;
import org.springframework.stereotype.Component;

@Component
@Cold
@Creamy
public class IceCream implements Dessert {

    @Override
    public void make() {
        System.out.println("making ice cream......");
    }
}
```

使用自定义注解更为安全。

<a id="bean的作用域"></a>
### bean的作用域

默认情况下，Spring应用上下文所有的bean都是以单例的形式创建。不管给定的bean注入到其他bean多少次，每次注入的都是同一个实例。

Spring定义了多种定义域：

单例（Singleton）：在整个应用，只创建bean一个实例。

原型（prototype）：每次注入或者通过Spring应用上下文获取的时候，都会创建一个新的bean实例。

会话（session）：在web应用中，为每个会话创建一个bean实例。

请求（request）：在web应用中，为每个请求创建一个bean实例。

单例是默认的作用域，使用@Scope选择其他的作用域，它可以跟@Component和@Bean一起使用。

使用@Scope声明CDPlayer为原型bean。

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public class CDPlayer implements MediaPlayer {
    private CD cd;

    /**
     * 构造器注入
     */
    @Autowired
    public CDPlayer(CD cd) {
        this.cd = cd;
    }

    @Override
    public void play() {
        cd.play();
    }
}
```

在JavaConfig中声明CDPlayer为原型bean。

```java
@Bean(name = "cdPlayer")
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public CDPlayer cdPlayer(CD cd) {
    return new CDPlayer(cd);
}

```

若是通过xml配置bean，可以通过<bean>元素的scope属性设置作用域。

```java
<bean id="cd" class="com.tyson.pojo.EasonCD" scope="prototype"/>
```

<a id="运行时值注入"></a>
### 运行时值注入

依赖注入，是将一个bean引用注入到另一个bean的属性或者构造器参数， 是一个对象和另一个对象进行关联。bean装配是将一个值注入到bean的属性或者构造器参数中。

<a id="注入外部的值"></a>
#### 注入外部的值

使用外部的属性装配EasonCD bean。

```java
import com.tyson.pojo.CD;
import com.tyson.pojo.EasonCD;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;

@Configuration
@PropertySource("classpath:app.properties")
public class PropertySourcesPlaceholderConfig {
    @Autowired
    private Environment env;

    @Bean
    public CD easonCD() {
        return new EasonCD(env.getProperty("song"),
            env.getProperty("singer")
        );
    }
}
```

通过@PropertySource引用了类路径中一个名为app.properties的文件。

```properties
song = ten years
singer = Eason
```

测试代码

```java
@Test
public void test1() {
    ApplicationContext ctx = new AnnotationConfigApplicationContext(PropertySourcesPlaceholderConfig.class);
    CD cd = ctx.getBean("easonCD", CD.class);
    cd.play();
}
```

如果使用组件扫描和自动装配创建应用组件，可以通过@Value注解引用外部的值。

```java
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

@Component("easonCD")
@PropertySource("classpath:app.properties")
public class EasonCD implements CD {
    private String song;
    private String singer;

/*    @Bean
    public static PropertySourcesPlaceholderConfigurer placeholderConfigurer() {
        PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer = new PropertySourcesPlaceholderConfigurer();
        ClassPathResource classPathResource = new ClassPathResource("app.properties");
        propertySourcesPlaceholderConfigurer.setLocation(classPathResource);
        propertySourcesPlaceholderConfigurer.setLocalOverride(true);
        return propertySourcesPlaceholderConfigurer;
    }*/

    public EasonCD(@Value("${song}") String song,
                        @Value("${singer}") String singer) {
        this.song = song;
        this.singer = singer;
    }

    @Override
    public void play() {
        System.out.println("singer--" + singer + " sings " + song);
    }
}
```

测试代码

```java
@Test
public void test1() {
    ApplicationContext ctx = new AnnotationConfigApplicationContext(CDConfig.class);
    CD cd = ctx.getBean("easonCD", CD.class);
    cd.play();
}
```

使用xml配置的话，Spring的\<context:propertyplaceholder>元素可以为我们生成PropertySourcesPlaceholderConfigurer bean。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:c="http://www.springframework.org/schema/c"
       xmlns:p="http://www.springframework.org/schema/p"
       xmlns:util="http://www.springframework.org/schema/util"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/util
        http://www.springframework.org/schema/util/spring-util.xsd http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd">

    <!--    <bean id="placeHolder" class="org.springframework.beans.factory.config.PropertyPlaceholderConfigurer">
        <property name="location">
            <value>classpath:app.properties</value>
        </property>
    </bean>-->

    <bean id="easonCD" class="com.tyson.pojo.EasonCD">
        <property name="song" value="${song}"/>
        <property name="singer" value="${singer}"/>
    </bean>

    <context:property-placeholder location="classpath:app.properties"/>
</beans>
```

解析外部属性可以将值的处理推迟到运行时，但是它的关注点在于根据名称解析来自于Spring Environment和属性源的属性。

<a id="使用spring表达式语言进行装配"></a>
#### 使用Spring表达式语言进行装配

Spring3引入了Spring表达式语言SpEL，它在将值装配到bean属性和构造器参数过程中所使用的表达式会在运行时计算得到值。

Spring表达式要放到"#{...}"之中。

```java
public EasonCD(@Value("#{systemProperties['song']}") String song,
               @Value("#{systemProperties['singer']}") String singer) {
    this.song = song;
    this.singer = singer;
}
```

使用xml配置。

```xml
<bean id="easonCD" class="com.tyson.pojo.EasonCD">
    <property name="song" value="#{systemProperties['song']}"/>
    <property name="singer" value="#{systemProperties['singer']}"/>
</bean>
```

<a id="面向切面"></a>
## 面向切面

依赖注入实现了对象之间的解耦。AOP可以实现横切关注点和它们所影响的对象之间的解耦。

切面可以帮我们模块化横切关注点。安全就是一个横切关注点，应用中的许多方法都会涉及到安全规则。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190223082943466.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1R5c29uMDMxNA==,size_16,color_FFFFFF,t_70)

横切关注点可以被模块化为特殊的类，这些类称之为切面。这样做有两个好处：每个关注点都集中到一个地方，不会分散到多处代码；服务模块更简洁，因为它们只包含核心功能的代码，而非核心功能的代码被转移到切面了。

<a id="aop术语"></a>
### AOP术语

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190223083512446.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1R5c29uMDMxNA==,size_16,color_FFFFFF,t_70)

通知（advice）：切面的工作被称为通知。通知定义了切面是什么以及何时使用。除了描述切面要完成的工作，通知还解决了何时执行这个工作的问题，它应该在某个方法被调用之前还是之后调用，或者在方法抛异常的时候才调用。

Spring切面定义了五种类型的通知：前置通知，后置通知，返回通知，异常通知，环绕通知。

连接点（join point）：连接点是应用执行过程中能够插入切面的一个点。这个点可以是调用方法时、抛出异常时、甚至是修改一个字段时。切面代码可以利用这些点插入到应用的正常流程之中，并添加新的行为。

切点（point cut）：匹配通知所要织入的一个或多个连接点，缩小切面所通知的连接点的范围。通常使用明确的类和方法名称，或者利用正则表达式定义所匹配的类和方法名称来指定这些切点。有些AOP框架允许我们创建动态的切点，可以在运行时（通过方法的参数值等）决定是否应用通知。

切面（aspect）：切面是通知和切点的结合，通知和切点共同定义了切面的全部内容。

引入（introduction）：在无需修改原有类的情况下，引入允许我们向类添加新的方法或者属性（新的行为或状态）。

织入（weaving）：织入是把切面应用到目标对象并创建代理对象的过程。切面在指定的连接点被织入到目标对象中。在目标对象的生命周期有多个点可以进行织入：

- 编译期：切面在目标对象编译时被织入。这种方式需要特殊的编译器。Aspect的织入编译器就是以这种方式织入切面的。
- 类加载期：切面在目标对象被加载到JVM时被织入。这种方式需要特殊的类加载器，它可以在目标类被引入应用之前增强目标类的字节码。
- 运行期：切面在应用运行的某个时刻被织入。一般情况下，在织入切面时，AOP容器会为目标对象动态创建一个代理对象。Spring AOP就是以这种方式织入切面的。

<a id="spring对aop的支持"></a>
### Spring对aop的支持

**Spring提供了4种类型的aop支持：**

1.基于代理的经典Spring aop；2.纯pojo切面（借助Spring aop命名空间，xml配置）；3.@AspectJ注解驱动的切面；4.注入式AspectJ切面（适用于Spring各版本）

Spring aop构建在动态代理基础之上，因此Spring对aop的支持局限在方法拦截。如果应用的aop需求超过了简单的方法调用（构造器或属性拦截），就需要考虑使用AspectJ来实现切面。这种情况下，第四种类型能够帮助我们将值注入到AspectJ驱动的切面中。AspectJ通过特有的aop语言，我们可以获得更为强大和细粒度的控制，以及更丰富的aop工具集。

**Spring在运行时通知对象**

通过在代理类中包裹切面，Spring在运行时将切面织入到Spring管理的bean中。代理类封装了目标类，并拦截被通知方法的调用，执行额外的切面逻辑，并调用目标方法。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190227162637751.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1R5c29uMDMxNA==,size_16,color_FFFFFF,t_70)

<a id="通过切面选择连接点"></a>
### 通过切面选择连接点

在Spring aop中，要使用AspectJ的切点表达式语言来定义切点。Spring仅支持AspectJ切点指示器的一个子集。下表列出Spring AOP支持的AspectJ切点指示器。

| AspectJ指示器 | 描述                                                         |
| ------------- | ------------------------------------------------------------ |
| arg()         | 限制连接点匹配参数为指定类型的执行方法                       |
| @args()       | 限制连接点匹配参数由指定注解标注的执行方法                   |
| execution()   | 用于匹配是连接点的执行方法                                   |
| this()        | 限制连接点匹配AOP代理的bean引用为指定类型的类                |
| target        | 限制连接点匹配目标对象为指定类型的类                         |
| @target()     | 限制连接点匹配特定的执行对象，这些对象对应的类要具有指定类型的注解 |
| within()      | 限制连接点匹配指定的类型                                     |
| @within()     | 限制连接点匹配指定注解所标注的类型（当使用Spring AOP时，方法定义在由指定的注解所标注的类里） |
| @annotation   | 限定匹配带有指定注解的连接点                                 |

在Spring中尝试使用AspectJ其他指示器时，将会抛出IllegalArgument-Exception异常。

**编写切点**

定义一个Performance接口：

```java
public interface Performance {
    public void perform();
}
```

使用AspectJ切点表达式来选择Performance的perform()方法：

```java
execution(* com.tyson.aop.Performance.perform(..))
```

使用execution()指示器选择Performance的perform()方法。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190226163248197.png)

使用within()指示器限制切点范围：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190226164058113.png)

因为“&”在XML中有特殊含义，所以在Spring的XML配置里面描述切点时，我们可以使用and来代替“&&”。同样，or和not可以分别用来代替“||”和“!”。

**在切点中选择bean**

Spring引入了一个新的bean()指示器，它允许我们在切点表达式使用bean的ID作为参数来限定切点只匹配特定的bean。

```java
execution(* com.tyson.aop.Performance.perform(..))
    and bean('drum')
```

在执行Performance的perform()方法时应用通知，当限定bean的ID为drum。

```java
execution(* com.tyson.aop.Performance.perform(..))
    and !bean('drum')
```

<a id="使用注解创建切面"></a>
### 使用注解创建切面

使用注解创建切面是AspectJ 5引入的关键特性，通过少量的注解便可以把Java类转变为切面。

<a id="定义切面"></a>
#### 定义切面

使用aop相关注解需先导入依赖。

```xml
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.tyson</groupId>
    <artifactId>SpringDemo</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>war</packaging>

    <name>SpringDemo Maven Webapp</name>
    <!-- FIXME change it to the project's website -->
    <url>http://www.example.com</url>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.compiler.version>3.5.1</maven.compiler.version>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <spring.version>5.0.5.RELEASE</spring.version>
        <spring-aop.version>4.3.9.RELEASE</spring-aop.version>
        <aspectj-version>1.6.11</aspectj-version>
        <cglib.version>2.1</cglib.version>
        <junit.version>4.12</junit.version>
    </properties>

    <dependencies>
        <!--spring-->
        <!-- Spring Core -->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-core</artifactId>
            <version>${spring.version}</version>
        </dependency>

        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-test</artifactId>
            <version>${spring.version}</version>
        </dependency>

        <!-- Spring Context -->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context</artifactId>
            <version>${spring.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-aop</artifactId>
            <version>${spring-aop.version}</version>
        </dependency>
        <dependency>
            <groupId>org.aspectj</groupId>
            <artifactId>aspectjrt</artifactId>
            <version>${aspectj-version}</version>
        </dependency>

        <dependency>
            <groupId>org.aspectj</groupId>
            <artifactId>aspectjweaver</artifactId>
            <version>${aspectj-version}</version>
        </dependency>

        <dependency>
            <groupId>cglib</groupId>
            <artifactId>cglib</artifactId>
            <version>${cglib.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-tx</artifactId>
            <version>${spring.version}</version>
        </dependency>

        <!-- JUnit单元测试工具 -->
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>${junit.version}</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>${maven.compiler.version}</version>
                <configuration>
                    <source>${maven.compiler.source}</source>
                    <target>${maven.compiler.target}</target>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

Audience类定义了一个切面。

```java
import org.aspectj.lang.annotation.*;

@Aspect
public class Audience {
    @Pointcut("execution(* com.tyson.aop.Performance.perform(..))")
    public void performance() {}

    @Before("performance()")
    public void silenceCellPhones() {
        System.out.println("silencing cell phones");
    }

    @Before("performance()")
    public void takeSeats() {
        System.out.println("taking seats");
    }

    @AfterReturning("performance()")
    public void applause() {
        System.out.println("clap clap clap!");
    }

    @AfterThrowing("performance()")
    public void demandRefund() {
        System.out.println("demanding a refund");
    }
}
```

启动自动代理功能。若使用JavaConfig，可以在配置类的类级别使用@EnableAspectJAutoProxy注解启动自动代理。

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@Configuration
@EnableAspectJAutoProxy
public class ConcertConfig {
    @Bean
    public Audience audience() {
        return new Audience();
    }

    @Bean
    public Performance magicPerformance() {
        return new MagicPerformance();
    }
}
```

若使用xml装配bean，则可以用\<aop:aspectj-autoproxy>元素启动自动代理。concert-config.xml如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/aop
        http://www.springframework.org/schema/aop/spring-aop.xsd ">

    <bean id="magicPerformance" class="com.tyson.aop.MagicPerformance"/>
    <bean class="com.tyson.aop.Audience"/>
    <aop:aspectj-autoproxy/>
</beans>
```

测试代码：

```java
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class ConcertTest {
    @Test
    public void consertTest() {
        ApplicationContext ctx = new AnnotationConfigApplicationContext(ConcertConfig.class);
        Performance magicPerformance = (Performance) ctx.getBean("magicPerformance");
        magicPerformance.perform();
    }

    @Test
    public void consertTest1() {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("concert-config.xml");
        Performance magicPerformance = (Performance) ctx.getBean("magicPerformance");
        magicPerformance.perform();
    }
}
```

测试结果：

```java
silencing cell phones
taking seats
performing magic...
clap clap clap!
```

<a id="创建环绕通知"></a>

#### 创建环绕通知

使用环绕通知重新实现Audience切面。

```java
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;

@Aspect
public class Audience {
    @Pointcut("execution(* com.tyson.aop.Performance.perform(..))")
    public void performance() {}

    @Around("performance()")
    public void watchPerformance(ProceedingJoinPoint joinPoint) {
        try {
            System.out.println("silencing cell phones");
            System.out.println("taking seats");
            //不调用proceed会阻塞对被通知方法performance的调用，也可以多次调用proceed方法
            joinPoint.proceed();
            System.out.println("clap clap clap!");
        } catch (Throwable e) {
            System.out.println("demanding a refund");
        }
    }
}
```

<a id="处理通知中的参数"></a>
#### 处理通知中的参数

被通知方法含有参数，切面可以访问和使用传给被通知方法的参数。下面使用TrackCounter类记录磁道播放的次数。其中被通知方法playTrack方法有形参trackNum。

```java
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;

import java.util.HashMap;
import java.util.Map;

@Aspect
public class TrackCounter {
    private Map<Integer, Integer> trackCounts = new HashMap<>();

    @Pointcut("execution(* com.tyson.pojo.BlankDisc.playTrack(int)) && args(trackNum)")
    public void playTrack(int trackNum) {}

    @Before("playTrack(trackNum)")
    public void countTrack(int trackNum) {
        int currentCount = getTrackCount(trackNum);
        trackCounts.put(trackNum, currentCount + 1);
    }

    public int getTrackCount(int trackNum) {
        return trackCounts.containsKey(trackNum) ? trackCounts.get(trackNum) : 0;
    }
}
```

BlankDisc类：

```java
public class BlankDisc {
    private String title;

    public void setTitle(String title) {
        this.title = title;
    }

    public void playTrack(int trackNum) {
        System.out.println("playing track: " + trackNum);
    }
}
```

TrackCounterConfig开启自动代理，装配BlankDisc和TrackCounter bean。

```java
import com.tyson.pojo.BlankDisc;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@Configuration
@EnableAspectJAutoProxy
public class TrackCounterConfig {
    @Bean
    public BlankDisc blankDisc() {
        BlankDisc cd = new BlankDisc();
        cd.setTitle("apple band");

        return cd;
    }

    @Bean
    public TrackCounter trackCounter() {
        return new TrackCounter();
    }
}
```

测试代码：

```java
import com.tyson.pojo.BlankDisc;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class TrackCounterTest {
    @Test
    public void test() {
        ApplicationContext ctx = new AnnotationConfigApplicationContext(TrackCounterConfig.class);
        BlankDisc blankDisc = (BlankDisc) ctx.getBean("blankDisc");
        TrackCounter counter = (TrackCounter) ctx.getBean("trackCounter");
        blankDisc.playTrack(1);
        blankDisc.playTrack(2);
        blankDisc.playTrack(2);
        System.out.println(counter.getTrackCount(1));
        System.out.println(counter.getTrackCount(2));
    }
}
```

<a id="通过注解引入新功能"></a>
#### 通过注解引入新功能

利用引入的功能，切面可以为Spring bean添加新方法。

![在这里插入图片描述](https://img-blog.csdnimg.cn/2019022717044484.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1R5c29uMDMxNA==,size_16,color_FFFFFF,t_70)

假如为Performance实现类引入Encoreable（再次表演）接口。

```java
public interface Encoreable {
    public void performEncore();
}
```

为了实现该功能，我们需要创建一个切面：

```java
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.DeclareParents;

@Aspect
public class EncoreableIntroducer {
    @DeclareParents(value="com.tyson.aop.Performance+",
                    defaultImpl = DefaultEncoreable.class)
    public static Encoreable encoreable;
}
```

ConcertConfig类如下，当Spring发现一个bean使用了@Aspect注解，Spring就会创建一个代理，在运行时会将调用委托给被代理的bean或者被引入的实现。

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@Configuration
@EnableAspectJAutoProxy
public class ConcertConfig {
    @Bean
    public Performance magicPerformance() {
        return new MagicPerformance();
    }

    @Bean
    public EncoreableIntroducer encoreableIntroducer() {
        return new EncoreableIntroducer();
    }
}
```

测试代码：

```java
    @Test
    public void consertTest2() {
        ApplicationContext ctx = new AnnotationConfigApplicationContext(ConcertConfig.class);
        Encoreable magicPerformance = ctx.getBean("magicPerformance", Encoreable.class);
        magicPerformance.performEncore();
    }
```

<a id="在xml中声明切面"></a>
### 在xml中声明切面

在不能为通知类添加注解的时候，就只能使用xml配置。Spring的AOP配置元素如下：

| aop配置元素            | 用途                                                         |
| ---------------------- | ------------------------------------------------------------ |
| \<aop:advisor>         | 定义aop通知器                                                |
| \<aop:aspect>          | 定义aop切面                                                  |
| \<aop:pointcut>        | 定义切点                                                     |
| \<aop:declare-parents> | 以透明的方式为被通知对象引入新的接口                         |
| \<aop:config>          | 顶层的aop配置元素，大多数\<aop:*>配置元素必须包含在\<aop:config>内 |
| \<aop:before>          | 前置通知                                                     |
| \<aop:after>           | 后置通知                                                     |
| \<aop:after-returning> | 返回通知                                                     |
| \<aop:after-throwing>  | 异常通知                                                     |
| \<aop:around>          | 环绕通知                                                     |

重新定义Audience类。

```java
public class Audience {

    public void silenceCellPhones() {
        System.out.println("silencing cell phones");
    }

    public void takeSeats() {
        System.out.println("taking seats");
    }

    public void applause() {
        System.out.println("clap clap clap!");
    }

    public void demandRefund() {
        System.out.println("demanding a refund");
    }
}
```

<a id="声明通知"></a>
#### 声明通知

通过xml将无注解的Audience声明为切面。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/aop
        http://www.springframework.org/schema/aop/spring-aop.xsd ">

    <!--开启自动代理-->
    <aop:aspectj-autoproxy/>

    <bean id="magicPerformance" class="com.tyson.aop.MagicPerformance"/>
    <bean id="audience" class="com.tyson.aop.Audience"/>

    <aop:config>
        <aop:aspect ref="audience">
            <aop:pointcut id="performance" expression="execution(* com.tyson.aop.Performance.perform(..))"/>
            <aop:before pointcut-ref="performance" method="silenceCellPhones"/>
            <aop:before pointcut-ref="performance" method="takeSeats"/>
            <aop:after-returning pointcut-ref="performance" method="applause"/>
            <aop:after-throwing pointcut-ref="performance" method="demandRefund"/>
        </aop:aspect>
    </aop:config>
</beans>
```

<a id="创建环绕通知-1"></a>
#### 创建环绕通知

```java
import org.aspectj.lang.ProceedingJoinPoint;

public class Audience {
    public void watchPerformance(ProceedingJoinPoint joinPoint) {
        try {
            System.out.println("silencing cell phones");
            System.out.println("taking seating");
            joinPoint.proceed();
            System.out.println("clap clap clap!");
        } catch (Throwable e) {
            System.out.println("demanding a refund");
        }
    }
}
```

声明Audience切面

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/aop
        http://www.springframework.org/schema/aop/spring-aop.xsd ">

    <!--开启自动代理-->
    <aop:aspectj-autoproxy/>

    <bean id="magicPerformance" class="com.tyson.aop.MagicPerformance"/>
    <bean id="audience" class="com.tyson.aop.Audience"/>

    <aop:config>
        <aop:aspect ref="audience">
            <aop:pointcut id="performance" expression="execution(* com.tyson.aop.Performance.perform(..))"/>
            <aop:around pointcut-ref="performance" method="watchPerformance"/>
        </aop:aspect>
    </aop:config>
</beans>
```

<a id="为通知传递参数"></a>
#### 为通知传递参数

同样使用TrackCounter记录磁道播放的次数。无注解的TrackCounter如下：

```java
import java.util.HashMap;
import java.util.Map;

public class TrackCounter {
    private Map<Integer, Integer> trackCounts = new HashMap<>();
    public void countTrack(int trackNum) {
        int currentCount = getTrackCount(trackNum);
        trackCounts.put(trackNum, currentCount + 1);
    }

    public int getTrackCount(int trackNum) {
        return trackCounts.containsKey(trackNum) ? trackCounts.get(trackNum) : 0;
    }
}
```

在xml中将TrackCounter配置为参数化的切面。xml中&符号会被解析成实体的开始，故用and代替。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/aop
        http://www.springframework.org/schema/aop/spring-aop.xsd ">

    <!--开启自动代理-->
    <aop:aspectj-autoproxy/>

    <bean id="blankDisc" class="com.tyson.pojo.BlankDisc"/>
    <bean id="trackCounter" class="com.tyson.aop.TrackCounter"/>

    <aop:config>
        <aop:aspect ref="trackCounter">
            <aop:pointcut id="playTrack"
                          expression="execution(* com.tyson.pojo.BlankDisc.playTrack(int)) and args(trackNum)"/>
            <aop:before pointcut-ref="playTrack" method="countTrack"/>
        </aop:aspect>
    </aop:config>

</beans>
```

<a id="通过切面引入新的功能"></a>
#### 通过切面引入新的功能

concert-config.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/aop
        http://www.springframework.org/schema/aop/spring-aop.xsd ">

    <!--开启自动代理-->
    <aop:aspectj-autoproxy/>

    <bean id="magicPerformance" class="com.tyson.aop.MagicPerformance"/>
    <bean id="defaultEncoreable" class="com.tyson.aop.DefaultEncoreable"/>

<!--    <aop:config>
        <aop:aspect>
            <aop:declare-parents types-matching="com.tyson.aop.Performance+"
                                 implement-interface="com.tyson.aop.Encoreable"
                                 default-impl="com.tyson.aop.DefaultEncoreable"/>
        </aop:aspect>
    </aop:config>-->
    <aop:config>
        <aop:aspect>
            <aop:declare-parents types-matching="com.tyson.aop.Performance+"
                                 implement-interface="com.tyson.aop.Encoreable"
                                 delegate-ref="defaultEncoreable"/>
        </aop:aspect>
    </aop:config>
</beans>
```

测试代码：

```java
    @Test
    public void consertTest4() {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("concert-config.xml");
        Encoreable magicPerformance = ctx.getBean("magicPerformance", Encoreable.class);
        magicPerformance.performEncore();
    }
```

<a id="注入aspectj切面"></a>
### 注入AspectJ切面

Spring AOP是功能比较弱的AOP解决方案，AspectJ提供了Spring AOP所不支持的许多类型的切点。如当我们需要在创建对象时应用通知，使用构造器切点很容易实现，而Spring AOP不支持构造器切点，所以基于代理的Spring  AOP不能把通知应用于对象的创建过程。此时可以使用AspectJ实现。

使用AspectJ实现的表演评论员：

```
package com.tyson.aop;

public aspect CriticAspect {
    public CriticAspect() {}

    pointcut performance() : execution(* com.tyson.aop.Performance.perform(..));

    pointcut construct() : execution(com.tyson.aop.CriticismEngineImpl.new());

    before() : performance() {
        System.out.println("performance构造器调用之前");
    }

    after() : performance() {
        System.out.println("performance构造器调用之后");
    }

    after() returning : performance() {
        System.out.println("criticism: " + criticismEngine.getCriticism());
    }

    private CriticismEngine criticismEngine;

    //注入CriticismEngine
    public void setCriticismEngine(CriticismEngine criticismEngine) {
        this.criticismEngine = criticismEngine;
    }
}
```

CriticismEngine类以及实现类

```java
public class CriticismEngine {
    private String criticism;

    public String getCriticism() {
        return criticism;
    }

    public void setCriticism(String criticism) {
        this.criticism = criticism;
    }
}

public class CriticismEngineImpl extends CriticismEngine {
    private String[] criticismPool;

    @Override
    public String getCriticism() {
        int i = (int) (Math.random() * criticismPool.length);
        return criticismPool[i];
    }

    //Injected
    public void setCriticismPool(String[] criticismPool) {
        this.criticismPool = criticismPool;
    }
}
```

在concert-config.xml中将CriticismEngine bean注入到CritisicAspect。CritisicAspect bean的声明使用了factory-method属性。通常情况下，Spring bean由Spring容器初始化，而Aspect切面是由AspectJ在运行期创建的。在Spring为CriticAspect注入CriticismEngine之前，CriticAspect已经被实例化了。故我们需要一种方式为Spring获得已经由AspectJ创建的CriticAspect实例的句柄，从而可以注入CriticismEngine。AspectJ切面提供了一个静态的aspectOf()方法，该方法返回切面的一个单例。Spring需要通过aspectOf()工厂方法获得切面的引用，然后进行依赖注入。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/aop
        http://www.springframework.org/schema/aop/spring-aop.xsd ">

    <!--开启自动代理-->
    <aop:aspectj-autoproxy/>

    <bean id="magicPerformance" class="com.tyson.aop.MagicPerformance"/>
    <bean id="criticismEngine" class="com.tyson.aop.CriticismEngineImpl">
        <property name="criticismPool">
            <list>
                <value>good</value>
                <value>waste time</value>
                <value>enjoy it</value>
                <value>deserve</value>
            </list>
        </property>
    </bean>
    <bean class="com.tyson.aop.CriticAspect" factory-method="aspectOf">
        <property name="criticismEngine" ref="criticismEngine"/>
    </bean>
</beans>
```

测试代码：

```java
    @Test
    public void consertTest5() {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("concert-config.xml");
        MagicPerformance magicPerformance = ctx.getBean("magicPerformance", MagicPerformance.class);
        magicPerformance.perform();
    }
```

测试结果：

```java
performance构造器调用之前
performing magic...
performance构造器调用之后
criticism: deserve
```



