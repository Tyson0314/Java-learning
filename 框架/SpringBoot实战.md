<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Spring Boot基础](#spring-boot%E5%9F%BA%E7%A1%80)
  - [特点](#%E7%89%B9%E7%82%B9)
- [Spring Boot核心](#spring-boot%E6%A0%B8%E5%BF%83)
  - [基本配置](#%E5%9F%BA%E6%9C%AC%E9%85%8D%E7%BD%AE)
  - [外部配置](#%E5%A4%96%E9%83%A8%E9%85%8D%E7%BD%AE)
  - [日志配置](#%E6%97%A5%E5%BF%97%E9%85%8D%E7%BD%AE)
  - [Profile配置](#profile%E9%85%8D%E7%BD%AE)
- [Spring Boot的Web开发](#spring-boot%E7%9A%84web%E5%BC%80%E5%8F%91)
  - [Thymeleaf 模板引擎](#thymeleaf-%E6%A8%A1%E6%9D%BF%E5%BC%95%E6%93%8E)
    - [Thymeleaf 基础知识](#thymeleaf-%E5%9F%BA%E7%A1%80%E7%9F%A5%E8%AF%86)
    - [与 Spring MVC 集成](#%E4%B8%8E-spring-mvc-%E9%9B%86%E6%88%90)
    - [Spring Boot 的 Thymeleaf 支持](#spring-boot-%E7%9A%84-thymeleaf-%E6%94%AF%E6%8C%81)
    - [实战](#%E5%AE%9E%E6%88%98)
  - [Web 相关配置](#web-%E7%9B%B8%E5%85%B3%E9%85%8D%E7%BD%AE)
    - [Spring Boot 提供的自动配置](#spring-boot-%E6%8F%90%E4%BE%9B%E7%9A%84%E8%87%AA%E5%8A%A8%E9%85%8D%E7%BD%AE)
    - [实现自己的 MVC 配置](#%E5%AE%9E%E7%8E%B0%E8%87%AA%E5%B7%B1%E7%9A%84-mvc-%E9%85%8D%E7%BD%AE)
    - [注册 Servlet、Filter、Listener](#%E6%B3%A8%E5%86%8C-servletfilterlistener)
  - [Tomcat配置](#tomcat%E9%85%8D%E7%BD%AE)
    - [配置 Tomcat](#%E9%85%8D%E7%BD%AE-tomcat)
    - [替换 Tomcat](#%E6%9B%BF%E6%8D%A2-tomcat)
- [Spring Boot 的数据访问](#spring-boot-%E7%9A%84%E6%95%B0%E6%8D%AE%E8%AE%BF%E9%97%AE)
  - [Docker 常用命令及参数](#docker-%E5%B8%B8%E7%94%A8%E5%91%BD%E4%BB%A4%E5%8F%8A%E5%8F%82%E6%95%B0)
    - [Docker 镜像命令](#docker-%E9%95%9C%E5%83%8F%E5%91%BD%E4%BB%A4)
    - [Docker 容器命令](#docker-%E5%AE%B9%E5%99%A8%E5%91%BD%E4%BB%A4)
  - [Spring Boot 对 Spring Data JPA 的支持](#spring-boot-%E5%AF%B9-spring-data-jpa-%E7%9A%84%E6%94%AF%E6%8C%81)
    - [JDBC 的自动配置](#jdbc-%E7%9A%84%E8%87%AA%E5%8A%A8%E9%85%8D%E7%BD%AE)
    - [对 JPA 的自动配置](#%E5%AF%B9-jpa-%E7%9A%84%E8%87%AA%E5%8A%A8%E9%85%8D%E7%BD%AE)
    - [对 Spring Data JPA 的自动配置](#%E5%AF%B9-spring-data-jpa-%E7%9A%84%E8%87%AA%E5%8A%A8%E9%85%8D%E7%BD%AE)
- [@Value原理](#value%E5%8E%9F%E7%90%86)
- [启动过程](#%E5%90%AF%E5%8A%A8%E8%BF%87%E7%A8%8B)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Spring Boot基础
理念：习惯优于配置，内置习惯性配置，无需手动进行配置。使用Spring boot可以很快创建一个独立运行、准生产级别的基于Spring框架的项目，不需要或者只需很少的Spring配置。
### 特点
- 内置servlet容器，不需要在服务器部署 tomcat。只需要将项目打成 jar 包，使用 java -jar xxx.jar一键式启动项目；
- SpringBoot提供了starter，把常用库聚合在一起，简化复杂的环境配置，快速搭建spring应用环境。



## Spring Boot核心

### 基本配置

Spring Boot通常有个Application入口类：

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@SpringBootApplication
public class SpringbootDemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(SpringbootDemoApplication.class, args);
    }

}
```

@SpringBootApplication是Spring Boot的核心注解，它是组合注解，源码如下：

```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan(
    excludeFilters = {@Filter(
    type = FilterType.CUSTOM,
    classes = {TypeExcludeFilter.class}
), @Filter(
    type = FilterType.CUSTOM,
    classes = {AutoConfigurationExcludeFilter.class}
)}
)
public @interface SpringBootApplication {
}
```

@SpringBootApplication注解组合了@Configuration、@EnableAutoConfiguration和@ComponentScan注解，若不使用@SpringBootApplication注解，则可以在入口类上直接使用@Configuration、@EnableAutoConfiguration和@ComponentScan。

@EnableAutoConfiguration作用是让Spring Boot根据类路径中的jar包依赖为当前项目进行自动配置。例如，添加了spring-boot-starter-web依赖，会自动添加Tomcat和Spring MVC依赖，那么Spring Boot会对Tomcat和Spring MVC进行自动配置。

@Configuration标注在类上，相当于把该类作为spring的xml配置文件中的`<beans>`，作用是配置spring容器。

**关闭特定的自动配置**

使用@SpringBootApplication的exclude参数关闭特定的自动配置。

```java
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
```

**Spring Boot的配置文件**

Spring Boot使用一个全局的配置文件application.properties或application.yml。这个全局配置文件可以对一些默认配置的配置值进行修改。如修改Tomcat默认的端口号，并将默认的访问路径"/"修改为"/hello"：

```properties
server.port=9090
server.context-path=/hello
```

**starter pom**

Spring Boot为我们提供了简化企业级开发绝大多数场景的starter pom，只要使用了应用场景所需要的starter pom，相应的配置就可以消除，就可以得到Spring Boot为我们提供的自动配置的bean。

**xml配置**

Spring Boot提倡零配置，但实际项目中可能需要使用xml配置，此时可以通过Spring提供的@ImportResource来加载xml配置。

```java
@ImportResource({"classpath:xxx-context.xml", "classpath:yyy-context.xml"})
```

### 外部配置

**命令行参数配置**

Spring Boot是基于jar包运行的，打成jar包的程序可以直接通过下面的命令运行：

```
java -jar xx.jar
```

可以通过以下命令修改端口号：

```
java -jar xx.jar --server.port=9090
```

**常规属性配置**

在Spring Boot里，我们只需在application.properties定义属性，直接使用@Value注入即可。

application.properties增加属性：

```properties
book.author=tyson
book.name=life
```

修改入口类：

```java
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@SpringBootApplication
public class SpringbootDemoApplication {

    @Value("${book.author}")
    private String bookAuthor;
    @Value("${book.name}")
    private String bookName;

    @RequestMapping("/")
    public String index() {
        return "book name: " + bookName + ", written by: " + bookAuthor;
    }

    public static void main(String[] args) {
        SpringApplication.run(SpringbootDemoApplication.class, args);
    }

}
```

@RestController=@Controller + @ResponseBody，注解的类里面的方法以json格式输出。

**类型安全的配置**

Spring Boot提供了基于类型安全的配置方式，通过@ConfigurationProperties将配置文件application.properties中配置的属性值映射到当前类的属性中，从而实现类型安全的配置。

类型安全的bean：

```java
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@ConfigurationProperties(prefix = "book")
public class BookConfig {
    private String name;
    private String author;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }
}
```

通过@ConfigurationProperties加载properties文件内的配置，通过prefix属性指定前缀。

检验代码：

```java
import com.tyson.springbootdemo.config.BookConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@SpringBootApplication
@EnableConfigurationProperties({BookConfig.class})
public class SpringbootDemoApplication {

    @Autowired
    public BookConfig bookConfig;

    @RequestMapping("/")
    public String index() {
        return "book name: " + bookConfig.getName() + ", written by: " + bookConfig.getAuthor();
    }

    public static void main(String[] args) {
        SpringApplication.run(SpringbootDemoApplication.class, args);
    }

}
```

@EnableConfigurationProperties注解将带有@ConfigurationProperties注解的类注入为Spring容器的Bean。

### 日志配置

Spring Boot 支持 Log4J、Logback、Java Util Logging、Log4J2 作为日志框架，无论使用哪种日志框架，Spring Boot 已为当前使用日志框架的控制台输出及文件输出做好了配置。默认情况下，Spring Boot 使用 Logback 作为日志框架，日志级别为 INFO。

配置日志文件：

```properties
logging.path=H:/log/
logging.file=springbootdemo.log
```

配置日志级别，格式为 logging.level.包名=级别：

```properties
logging.level.root=INFO #root级别，项目所有日志
logging.level.org.springframework.web=DEBUG #package级别
```

配置日志样式：

```properties
logging.pattern.console=%d{yyyy/MM/dd-HH:mm:ss} [%thread] %-5level %logger- %msg%n 
logging.pattern.file=%d{yyyy/MM/dd-HH:mm} [%thread] %-5level %logger- %msg%n
```

### Profile配置

Profile 是 Spring 用来针对不同环境对不同配置提供支持的，全局Profile配置使用 application-{profile}.properties（如application-prod.properties）。通过在 application.properties 中设置spring.profiles.active=prod 来制定活动的Profile。

假如有生产和开发环境，生产环境下端口号为80，开发环境下端口号为8888。配置文件如下：

application-prod.properties:

```properties
server.port=80
```

application-dev.properties

```properties
server.port=8888
```

application.properties 增加：

```properties
spring.profiles.active=prod
```

启动程序结果为：

```java
2019-03-03 09:17:08.003  INFO 17812 --- [           main] c.t.s.SpringbootDemoApplication          : The following profiles are active: prod
2019-03-03 09:17:11.007  INFO 17812 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port(s): 8888 (http)
```

## Spring Boot的Web开发

spring-boot-starter-web 为我们提供了嵌入的 tomcat 和 Spring MVC 的依赖。

### Thymeleaf 模板引擎

JSP 在内嵌的 Servlet 容器上运行会存在一些问题（内嵌 Tomcat、Jetty 不支持以 jar 形式运行 JSP，Undertow 不支持 JSP）。Spring Boot 提供了大量的模板引擎，包含 FreeMarker、Groovy、Thymeleaf、Velocity 和 Mustache，Spring Boot 中推荐使用 Thymeleaf 作为模板引擎，因为 Thymeleaf 提供了完美的 Spring MVC 的支持。

#### Thymeleaf 基础知识

Thymeleaf 是 Java 类库，它是一个 xml/xhtml/html5 的模板引擎，可以作为 MVC 的 Web 应用的 view 层。Thymeleaf  还提供了额外的模块与 Spring MVC 集成，使用 Thymeleaf 完全可以替代 JSP。

1. 引入 Thymeleaf

基本的 Thymeleaf 模板页面，引入了 Bootstrap（作为样式控制）和 jQuery（DOM 操作）。

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <link th:src="@{bootstrap/css/bootstrap.min.css}" rel="stylesheet">
    <link th:src="@{bootstrap/css/bootstrap-theme.min.css}" rel="stylesheet">
    <title>Demo</title>
</head>
<body>
    <script th:src="@{jquery-1.10.2.min.js}" type="text/javascript"></script>
    <script th:src="@{bootstrap/js/bootstrap.min.js}"></script>
</body>
</html>
```

通过 xmlns:th="http://www.thymeleaf.org" 命名空间，将静态页面转换为动态视图。需要进行动态处理的元素需使用 “th:” 为前缀。通过 “@{}” 引用 Web 静态资源，这在 JSP 下是极易出错的。

2. 访问 model 中的数据

通过 “${}” 访问 model 中的属性，这和 JSP 很相似。需要处理的动态内容需要加上 “th:” 前缀。

```html
<div class="panel panel-primary">
    <div class="panel-heading">
        <h3 class="panel-title">访问model</h3>
    </div>
    <div class="panel-body">
        <span th:text="${person.name}"></span>
    </div>
</div>
```

3. model 中的数据迭代

```html
<div class="panel panel-primary">
    <div class="panel-heading">
        <h3 class="panel-title">列表</h3>
    </div>
    <div class="panel-body">
        <ul class="list-group">
            <li class="list-group-item" th:each="person:${people}">
                <span th:text="${person.name}"></span>
                <span th:text="${person.age}"></span>
            </li>
        </ul>
    </div>
</div>
```

4. 数据判断

通过${not #lists.isEmpty(people)}表达式判断 people 是否为空。Thymeleaf 还支持 >、<、==、!= 等作为比较条件，同时也支持将 SpringEL 表达式语言用于条件中。

```html
<div th:if="${not #lists.isEmpty(people)}">
    <div class="panel panel-primary">
        <div class="panel-heading">
            <h3 class="panel-title">列表</h3>
        </div>
        <div class="panel-body">
            <ul class="list-group">
                <li class="list-group-item" th:each="person:${people}">
                    <span th:text="${person.name}"></span>
                    <span th:text="${person.age}"></span>
                </li>
            </ul>
        </div>
    </div>
</div>
```

5. 在 JavaScript 中访问 model

```html
<script th:inline="javascript">
    var single = [[${person}]];
    console.log(single.name+"/"+single.age)
</script>
```

通过 th:inline="javascript"添加到 script 标签，这样 JavaScript 代码即可访问 model 中的属性；

通过“[[${person}]]”格式可以获得实际的值。

如果需要在 html 代码里访问 model 中的属性，比如我们需要在列表后面单击每一行后面的按钮获得 model 中的值，可做如下处理：

```html
<li class="list-group-item" th:each="person:${people}">
    <span th:text="${person.name}"></span>
    <span th:text="${person.age}"></span>
    <button class="btn"
            th:onclick="'getName(\'' + ${person.name} + '\');'">获得名字</button>
</li>
```

#### 与 Spring MVC 集成

在 Spring MVC 中，若我们需要集成一个模板引擎的话，需要定义 ViewResolver，而 ViewResolver 需要定义一个 View。在 Spring MVC 中集成 Thymeleaf 非常简单，Thymeleaf 为我们定义好了 org.thymeleaf.spring4.view .ThymeleafView 和 org.thymeleaf.spring4.view.ThymeleafViewResolver（默认使用 ThymeleafView 作为 View）。Thymeleaf 给我们提供了一个 SpringTemplateEngine 类，用来驱动 Spring MVC 下使用 Thymeleaf 模板引擎，另外提供了一个 TemplateResolver 用来设置通用的模板引擎（包含前缀、后缀等）。

引入依赖：

```xml
<!--thymeleaf-->
<dependency>
    <groupId>org.thymeleaf</groupId>
    <artifactId>thymeleaf-spring4</artifactId>
    <version>${thymeleaf.version}</version>
</dependency>
<dependency>
    <groupId>org.thymeleaf</groupId>
    <artifactId>thymeleaf</artifactId>
    <version>${thymeleaf.version}</version>
</dependency>
```

xml 配置：

```java
    <!--thymeleaf-->
    <bean id="templateResolver" class="org.thymeleaf.templateresolver.ServletContextTemplateResolver">
        <property name="prefix" value="/WEB-INF/templates/" />
        <property name="suffix" value=".html" />
        <property name="templateMode" value="HTML5" />
        <property name="cacheable" value="false" />
        <property name="characterEncoding" value="UTF-8"/>
    </bean>

    <bean id="templateEngine" class="org.thymeleaf.spring4.SpringTemplateEngine">
        <property name="templateResolver" ref="templateResolver"/>
    </bean>

    <bean class="org.thymeleaf.spring4.view.ThymeleafViewResolver">
        <property name="templateEngine" ref="templateEngine"/>
        <property name="characterEncoding"  value="UTF-8" />
    </bean>
```

或者使用 JavaConfig 配置：

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.thymeleaf.spring4.SpringTemplateEngine;
import org.thymeleaf.spring4.view.ThymeleafViewResolver;
import org.thymeleaf.templateresolver.ServletContextTemplateResolver;
import org.thymeleaf.templateresolver.TemplateResolver;

@Configuration
public class ThymeleafConfig {
    @Bean
    public TemplateResolver templateResolver() {
        TemplateResolver templateResolver = new ServletContextTemplateResolver();
        templateResolver.setPrefix("/WEB-INF/template");
        templateResolver.setSuffix(".html");
        templateResolver.setTemplateMode("HTML5");
        return templateResolver;
    }

    @Bean
    public SpringTemplateEngine templateEngine(TemplateResolver templateResolver) {
        SpringTemplateEngine templateEngine = new SpringTemplateEngine();
        templateEngine.setTemplateResolver(templateResolver);
        return templateEngine;
    }

    @Bean
    public ThymeleafViewResolver thymeleafViewResolver(SpringTemplateEngine templateEngine) {
        ThymeleafViewResolver thymeleafViewResolver = new ThymeleafViewResolver();
        thymeleafViewResolver.setTemplateEngine(templateEngine);
        //thymeleafViewResolver.setViewClass(ThymeleafView.class);
        return thymeleafViewResolver;
    }
}
```

#### Spring Boot 的 Thymeleaf 支持

Spring Boot 通过 org.springframework.boot.autoconfigure.thymeleaf 包对 Thymeleaf 进行了自动配置，通过ThymeleafAutoConfiguration 类对集成所需的 Bean 进行自动配置，包括 templateResolver、templateEngine 和 thymeleafViewResolvers 的配置。通过 ThymeleafProperties 来设置属性以及默认配置。

```java
@ConfigurationProperties(
    prefix = "spring.thymeleaf"
)
public class ThymeleafProperties {
    private static final Charset DEFAULT_ENCODING;
    public static final String DEFAULT_PREFIX = "classpath:/templates/";
    public static final String DEFAULT_SUFFIX = ".html";
    private boolean checkTemplate = true;
    private boolean checkTemplateLocation = true;
    private String prefix = "classpath:/templates/";
    private String suffix = ".html";
    private String mode = "HTML";
    private Charset encoding;
    private boolean cache;
    private Integer templateResolverOrder;
    private String[] viewNames;
    private String[] excludedViewNames;
    private boolean enableSpringElCompiler;
    private boolean renderHiddenMarkersBeforeCheckboxes;
    private boolean enabled;
    private final ThymeleafProperties.Servlet servlet;
    private final ThymeleafProperties.Reactive reactive;
    ...
}
```

#### 实战

1. 引入依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```

引入 Thymeleaf 之后，Controller才能根据逻辑视图名转发到相应的视图。

2. JavaBean

```java
public class Person {
    private String name;
    private Integer age;
    private String address;

    public Person() {}
    
    //setter和getter
}
```

3. 页面

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <link th:href="@{bootstrap/css/bootstrap.min.css}" rel="stylesheet">
    <link th:href="@{bootstrap/css/bootstrap-theme.min.css}" rel="stylesheet"/>
    <title>index</title>
</head>
<body>
    <div class="panel panel-primary">
        <div class="panel-heading">
            <h3 class="panel-title">welcome</h3>
        </div>
        <div class="panel-body">
            <span th:text="${person.name}"/>
        </div>
    </div>
</body>
</html>
```

页面引入了Bootstrap和jQuery，这些静态文件放置在src/main/resources/static下面。

4. Controller

```java
import com.tyson.springbootdemo.pojo.Person;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/person")
public class PersonController {
    @RequestMapping("/hi")
    public String index(Model model) {
        Person p = new Person();
        p.setName("tyson");
        model.addAttribute("person", p);
        return "index";
    }

    @RequestMapping("/")
    public String home() {
        return "home";
    }
}
```

### Web 相关配置

#### Spring Boot 提供的自动配置

WebMvcAutoConfiguration 及 WebMvcProperties 定义了 Web 相关的自动配置。

1. 自动配置的ViewResolver

```java
@Bean
@ConditionalOnMissingBean
public InternalResourceViewResolver defaultViewResolver() {
    InternalResourceViewResolver resolver = new InternalResourceViewResolver();
    resolver.setPrefix(this.mvcProperties.getView().getPrefix());
    resolver.setSuffix(this.mvcProperties.getView().getSuffix());
    return resolver;
}

@Bean
@ConditionalOnBean({View.class})
@ConditionalOnMissingBean
public BeanNameViewResolver beanNameViewResolver() {
    BeanNameViewResolver resolver = new BeanNameViewResolver();
    resolver.setOrder(2147483637);
    return resolver;
}
```

2. 自动配置的静态资源

将类路径下的/static、/resources、/public 和 /META-INF/resources 文件夹下的静态文件直接映射为/**，可以通过 http://localhost:8080/\*\*访问。

把 webjar 的 /META-INF/resources/webjars/ 下的静态文件映射为/webjar/**，可以通过 http://localhost:8080/webjar/\*\*访问。

3. 自动配置的 Formatter 和 Converter

```java
public void addFormatters(FormatterRegistry registry) {
    Iterator var2 = this.getBeansOfType(Converter.class).iterator();

    while(var2.hasNext()) {
        Converter<?, ?> converter = (Converter)var2.next();
        registry.addConverter(converter);
    }

    var2 = this.getBeansOfType(GenericConverter.class).iterator();

    while(var2.hasNext()) {
        GenericConverter converter = (GenericConverter)var2.next();
        registry.addConverter(converter);
    }

    var2 = this.getBeansOfType(Formatter.class).iterator();

    while(var2.hasNext()) {
        Formatter<?> formatter = (Formatter)var2.next();
        registry.addFormatter(formatter);
    }

}
```

只要我们定义了 Converter、GenericConverter 和 Formatter 接口的实现类的 Bean，这些 Bean 就会自动注册到 Spring MVC 中。

3. 静态首页的支持

把静态首页放到如下目录：

- classpath:/META-INF/resources/index.html
- classpath:/resources/index.html
- classpath:/static/index.html
- classpath:/public/index.html

当我们访问应用根目录 http://localhost:8080/ 时，会直接映射。

#### 实现自己的 MVC 配置

当 Spring Boot 提供的 Spring MVC 不符合要求时，可以通过一个配置类（注解有@Configuration 的类）加上@EnableWebMvc 注解来实现完全自己控制的 MVC 配置。

要想保留 Spring Boot 提供的 MVC 配置，同时增加额外的配置，可以通过定义一个配置类并继承 WebMvcConfigurerAdapter，无需使用@EnableWebMvc注解。

```java
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

public class WebMvcConfig implements WebMvcConfigurer {
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/xx").setViewName("xx");
    }
}
```

重写的 addViewControllers 方法并不会覆盖 WebMvcAutocConfiguration 中的 addViewControllers（此方法中，Spring Boot 将“/”映射到 index.html），即我们自己的配置和 Spring Boot 的自动配置同时生效。

#### 注册 Servlet、Filter、Listener

当使用嵌入式的 Servlet 容器时，通过将 Servlet、Filter 和 Listener 声明为 Spring Bean 达到注册的效果；或者注册 ServletRegistrationBean、FilterRegistrationBean 和 ServletRegistrationBean 的 Bean。

直接注册 bean：

```java
@Bean 
public xxServlet xxServlet() {
    return new XxServlet();
}
```

通过 RegistrationBean 示例：

```java
@Bean 
public ServletRegistrationBean servletRegistrationBean() {
    return new ServletRegistrationBean(new XxServlet(), "/xx/*");
}

@Bean
public FilterRegistrationBean filterRegistrationBean() {
    FilterRegistrationBean registrationBean = new FilterRegistrationBean();
    registrationBean.setFilter(new YyFilter());
    registrationBean.setOrder(2);
    return registrtionBean;
}

@Bean
public ServletListenerRegistrationBean<ZzListener> zzListenerServletRegistrationBean() {
    return new ServletListenerRegistrationBean<ZzListener>(new ZzListener());
}
```

### Tomcat配置

#### 配置 Tomcat

关于 Tomcat 的所有属性都在 org.springframework.boot.autoconfigure.web.ServerPr=8080operties 配置类中做了定义，只需在 application.properties 配置即可。通用的 Servlet 容器配置都以 "server" 作为前缀，而 Tomcat 特有的配置都以 "server.tomcat" 作为前缀。

```properties
#配置Servlet容器
server.port=8080
server.session-timeout=3600 #以秒为单位
server.context-path=/
#配置Tomcat
server.tomcat.uri-encoding=UTF-8
server.tomcat.compression=off #是否开启压缩，默认是关闭
```

#### 替换 Tomcat

Spring Boot 默认使用 Tomcat 作为内嵌的 Servlet 容器，如果要使用 Jetty 或者 Undertow 为容器，只需修改 spring-boot-start-web 的依赖即可。

1. 替换为 Jetty

在 pom.xml中，将 spring-boot-starter-web 的依赖由 spring-boot-starter-tomcat 替换为 spring-boot-starter-jetty：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <!-- 使用Jetty，需要在spring-boot-starter-web排除spring-boot-starter-tomcat，因为SpringBoot默认使用tomcat -->
    <exclusions>
        <exclusion>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-tomcat</artifactId>
        </exclusion>
    </exclusions>
</dependency>

<!-- Jetty适合长连接应用，就是聊天类的长连接 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jetty</artifactId>
</dependency>
```

启动 Spring Boot，控制台输出效果如下：

```java
INFO 21724 --- [           main] o.s.b.web.embedded.jetty.JettyWebServer  : Jetty started on port(s) 8080 (http/1.1) with context path '/'
```

2. 替换为 Undertow

将 spring-boot-starter-web 的依赖由 spring-boot-starter-tomcat 替换为 spring-boot-starter-undertow：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <exclusions>
        <exclusion>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-tomcat</artifactId>
        </exclusion>
    </exclusions>
</dependency>

<dependency>
    <groupId>org.springframework.boo</groupId>
    <artifactId>spring-boot-starter-undertow</artifactId>
</dependency>
```

## Spring Boot 的数据访问

### Docker 常用命令及参数

#### Docker 镜像命令

（1）Docker 镜像检索

```powershell
docker search redis
```

（2）镜像下载

```powershell
docker pull redis
```

（3）镜像列表

```powershell
docker images
```

（4）删除镜像

删除指定镜像：

```powershell
docker rmi image-id
```

删除所有镜像：

```powershell
docker rmi ${docker images -q}
```

#### Docker 容器命令

（1）容器基本操作

运行容器，Docker 会为我们生成唯一的标识。

```powershell
docker run --name container-name -d image-name
```

（2）容器列表

查看运行中的容器列表：

```powershell
docker ps
```

查看运行和停止状态的容器：

```powershell
docker ps -a
```

（3）停止和启动容器

停止容器：

```powershell
docker stop container-name/container-id
```

启动容器：

```powershell
docker start container-name/container-id
```

端口映射：Docker 容器中运行的软件所使用的端口，在本机和本机的局域网是不能访问的，需要将 Docker 容器的端口映射到当前主机的端口上，这样我们在本机和本机的局域网才能访问该软件。

映射容器的6379端口到虚拟机的6378端口上：

```powershell
docker run -d -p 6378:6379 --name port-redis resdis
```

删除单个容器：

```powershell
docker rm container-id
```

删除所有容器：

```powershell
docker rm ${docker ps -a -q}
```

查看容器日志：

```powershell
docker logs container-name/container-id
```

登录容器：

```powershell
docker exec -it container-id/container-name bash
```

登录后可以在容器中进行常规的 Linux 系统操作命令。

### Spring Boot 对 Spring Data JPA 的支持

JPA 是一个基于 O/R 映射的标准规范（不提供实现）。Spring Data JPA 是 Spring Data 的一个子项目，它通过提供基于 JPA 的Repository 极大地减少了 JPA 作为数据访问方案的代码量。

#### JDBC 的自动配置

spring-boot-starter-data-jpa 依赖于 spring-boot-starter-jdbc，Spring Boot 对 JDBC 做了一些自动配置，源码在 org.springframework.boot.autoconfigure.jdbc 下。

在 DataSourceAutoConfiguration 类中配置了对 DataSource 的自动配置，通过"spring.datasource"为前缀的属性自动配置 dataSource；Spring Boot 开启了注解事务的支持（@EnableTransactionManagement）；还配置了一个jdbcTemplate。以下是 JdbcProperties 类的源码：

```java
@ConfigurationProperties(
    prefix = "spring.jdbc"
)
public class JdbcProperties {
    private final JdbcProperties.Template template = new JdbcProperties.Template();

    public JdbcProperties() {
    }

    public JdbcProperties.Template getTemplate() {
        return this.template;
    }

    public static class Template {
        private int fetchSize = -1;
        private int maxRows = -1;
        @DurationUnit(ChronoUnit.SECONDS)
        private Duration queryTimeout;
        ...
    }
}
```



#### 对 JPA 的自动配置

Spring Boot 对 JPA 的自动配置放置在 org.springframework.boot.autoconfiguration.orm.jpa 下，从HibernateJpaAutoConfiguration 可以看出，Spring Boot 默认的 JPA 实现是Hibernate。

配置 JPA 可以在 application.properties 中使用 spring.jpa 为前缀的属性来配置。

以下是 JpaProperties 类的源码：

```java
@ConfigurationProperties(
    prefix = "spring.jpa"
)
public class JpaProperties {
    private Map<String, String> properties = new HashMap();
    private final List<String> mappingResources = new ArrayList();
    private String databasePlatform;
    private Database database;
    private boolean generateDdl = false;
    private boolean showSql = false;
    private Boolean openInView;
    ...
}
```

在 JpaBaseConfiguration 类中，Spring Boot 为我们创建了 transactionManager、jpaVendorAdapter、entityManagerFactory 等 bean。JpaBaseConfiguration 还有 getPackagesToScan 方法，可以自动扫描有@Entity 注解的实体类。

#### 对 Spring Data JPA 的自动配置

Spring Boot 对 Spring Data JPA 的自动配置放置在 org.springframework.boot.autoconfigure.data.jpa 中。JpaRepositoriesAutoConfiguration 是依赖于 HibernateJpaAutoConfiguration 配置的，且 Spring Boot 自动开启了对 Spring Data JPA 的支持，无需在配置类显式声明@EnableJpaRepositories。

在 Spring Boot 下使用 Spring Data JPA，首先在项目的 maven 依赖里添加 spring-boot-starter-data-jpa，然后只需定义DataSource、实体类和数据访问层，在需要使用数据访问的地方注入数据访问层的 Bean 即可。



## @Value原理

@Value的解析就是在bean初始化阶段。BeanPostProcessor定义了bean初始化前后用户可以对bean进行操作的接口方法，它的一个重要实现类AutowiredAnnotationBeanPostProcessor为bean中的@Autowired和@Value注解的注入功能提供支持。



## 启动过程

准备Environment——发布事件——创建上下文、bean——刷新上下文——结束。

构造SpringApplication的时候会进行初始化的工作，初始化的时候会做以下几件事：
判断运行环境类型，有三种运行环境：NONE 非 web 的运行环境、SERVLET 普通 web 的运行环境、REACTIVE 响应式 web 的运行环境
加载 spring.factories 配置文件, 并设置 ApplicationContextInitializer
加载配置文件, 设置 ApplicationListener


SpringApplication构造完成之后调用run方法，启动SpringApplication，run方法执行的时候会做以下几件事：
构造一个StopWatch，观察SpringApplication的执行
找出SpringApplicationRunListener，用于监听SpringApplication run方法的执行。监听的过程中会封装SpringApplicationEvent事件，然后使用ApplicationEventMulticaster广播出去，应用程序监听器ApplicationListener会监听到这些事件
发布starting事件
加载配置资源到environment，包括命令行参数、application.yml等
发布environmentPrepared事件
创建并初始化ApplicationContext，设置environment，加载配置
refresh ApplicationContext
- 设置beanFactory
- 调用BeanFactoryPostProcessors
- 初始化消息源
- 初始化事件广播器（initApplicationEventMulticaster）
- 调用onRefresh()方法，默认是空实现
- 注册监听器
- 实例化non-lazy-init单例
- 完成refresh
- 发布ContextRefreshedEvent事件

发布started事件，启动结束