<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [简介](#%E7%AE%80%E4%BB%8B)
- [Spring MVC处理流程](#spring-mvc%E5%A4%84%E7%90%86%E6%B5%81%E7%A8%8B)
- [Spring MVC和Struts的区别](#spring-mvc%E5%92%8Cstruts%E7%9A%84%E5%8C%BA%E5%88%AB)
- [Spring MVC环境搭建](#spring-mvc%E7%8E%AF%E5%A2%83%E6%90%AD%E5%BB%BA)
- [处理器映射器和适配器](#%E5%A4%84%E7%90%86%E5%99%A8%E6%98%A0%E5%B0%84%E5%99%A8%E5%92%8C%E9%80%82%E9%85%8D%E5%99%A8)
  - [非注解的处理器映射器和适配器](#%E9%9D%9E%E6%B3%A8%E8%A7%A3%E7%9A%84%E5%A4%84%E7%90%86%E5%99%A8%E6%98%A0%E5%B0%84%E5%99%A8%E5%92%8C%E9%80%82%E9%85%8D%E5%99%A8)
  - [注解的处理器映射器和适配器](#%E6%B3%A8%E8%A7%A3%E7%9A%84%E5%A4%84%E7%90%86%E5%99%A8%E6%98%A0%E5%B0%84%E5%99%A8%E5%92%8C%E9%80%82%E9%85%8D%E5%99%A8)
- [前端控制器](#%E5%89%8D%E7%AB%AF%E6%8E%A7%E5%88%B6%E5%99%A8)
  - [对静态资源的处理](#%E5%AF%B9%E9%9D%99%E6%80%81%E8%B5%84%E6%BA%90%E7%9A%84%E5%A4%84%E7%90%86)
- [视图解析器](#%E8%A7%86%E5%9B%BE%E8%A7%A3%E6%9E%90%E5%99%A8)
  - [AbstractCachingViewResolver](#abstractcachingviewresolver)
  - [UrlBasedViewResolver](#urlbasedviewresolver)
  - [InternalResourceViewResolver](#internalresourceviewresolver)
  - [XmlViewResolver](#xmlviewresolver)
  - [BeanNameViewResolver](#beannameviewresolver)
  - [ResourceBundleViewResolver](#resourcebundleviewresolver)
  - [FreeMarkerViewResolver](#freemarkerviewresolver)
- [请求映射](#%E8%AF%B7%E6%B1%82%E6%98%A0%E5%B0%84)
- [参数绑定](#%E5%8F%82%E6%95%B0%E7%BB%91%E5%AE%9A)
  - [简单类型参数绑定](#%E7%AE%80%E5%8D%95%E7%B1%BB%E5%9E%8B%E5%8F%82%E6%95%B0%E7%BB%91%E5%AE%9A)
  - [包装类型参数绑定](#%E5%8C%85%E8%A3%85%E7%B1%BB%E5%9E%8B%E5%8F%82%E6%95%B0%E7%BB%91%E5%AE%9A)
  - [集合类型参数绑定](#%E9%9B%86%E5%90%88%E7%B1%BB%E5%9E%8B%E5%8F%82%E6%95%B0%E7%BB%91%E5%AE%9A)
- [Converter和Formatter](#converter%E5%92%8Cformatter)
  - [Converter](#converter)
  - [Formatter](#formatter)
- [验证器](#%E9%AA%8C%E8%AF%81%E5%99%A8)
  - [使用Validator接口进行验证](#%E4%BD%BF%E7%94%A8validator%E6%8E%A5%E5%8F%A3%E8%BF%9B%E8%A1%8C%E9%AA%8C%E8%AF%81)
  - [使用JSR-303 Validation进行验证](#%E4%BD%BF%E7%94%A8jsr-303-validation%E8%BF%9B%E8%A1%8C%E9%AA%8C%E8%AF%81)
    - [自定义限制类型的注解](#%E8%87%AA%E5%AE%9A%E4%B9%89%E9%99%90%E5%88%B6%E7%B1%BB%E5%9E%8B%E7%9A%84%E6%B3%A8%E8%A7%A3)
    - [分组校验](#%E5%88%86%E7%BB%84%E6%A0%A1%E9%AA%8C)
- [RequestBody和RequestParam](#requestbody%E5%92%8Crequestparam)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 简介

Spring MVC是一种基于MVC架构模式的轻量级Web框架。

## Spring MVC处理流程

Spring MVC的处理过程：

1. DispatcherServlet 接收用户的请求
2. 找到用于处理request的 handler 和 Interceptors，构造成 HandlerExecutionChain 执行链
3. 找到 handler 相对应的 HandlerAdapter
4. 执行所有注册拦截器的preHandler方法
5. 调用 HandlerAdapter 的 handle() 方法处理请求，返回 ModelAndView
6. 倒序执行所有注册拦截器的postHandler方法
7. 请求视图解析和视图渲染

![Spring MVC处理流程](https://img-blog.csdnimg.cn/20190125180502787.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1R5c29uMDMxNA==,size_16,color_FFFFFF,t_70)

处理流程中各个组件的功能：

- 前端控制器（DispatcherServlet）：接收用户请求，给用户返回结果。
- 处理器映射器（HandlerMapping）：根据请求的url路径，通过注解或者xml配置，寻找匹配的Handler。
- 处理器适配器（HandlerAdapter）：Handler 的适配器，调用 handler 的方法处理请求。
- 处理器（Handler）：执行相关的请求处理逻辑，并返回相应的数据和视图信息，将其封装到ModelAndView对象中。
- 视图解析器（ViewResolver）：将逻辑视图名解析成真正的视图View。
- 视图（View）：接口类，实现类可支持不同的View类型（JSP、FreeMarker、Excel等）。



## Spring MVC和Struts的区别

1. Spring MVC是基于方法开发，Struts2是基于类开发的。
    - Spring MVC会将用户请求的URL路径信息与Controller的某个方法进行映射，所有请求参数会注入到对应方法的形参上，生成Handler对象，对象中只有一个方法；
    - Struts每处理一次请求都会实例一个Action，Action类的所有方法使用的请求参数都是Action类中的成员变量，随着方法增多，整个Action也会变得混乱。
2. Spring MVC支持单例开发模式，Struts只能使用多例

    - Struts由于只能通过类的成员变量接收参数，故只能使用多例。
3. Struts2 的核心是基于一个Filter即StrutsPreparedAndExcuteFilter，Spring MVC的核心是基于一个Servlet即DispatcherServlet(前端控制器)。
4. Struts处理速度稍微比Spring MVC慢，Struts使用了Struts标签，加载数据较慢。


## Spring MVC环境搭建

导入jar包：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.tyson</groupId>
    <artifactId>springmvc-demo</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.build.timestamp.format>yyyyMMdd</maven.build.timestamp.format>
        <spring.version>5.0.9.RELEASE</spring.version>
        <logback.version>1.2.3</logback.version>
        <slf4j.version>1.7.12</slf4j.version>
        <jsp.version>2.0</jsp.version>
        <json.version>2.9.1</json.version>
    </properties>

    <dependencies>
        <!--使用slf4f和logback作为日志-->
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-api</artifactId>
            <version>${slf4j.version}</version>
        </dependency>
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>jcl-over-slf4j</artifactId>
            <version>${slf4j.version}</version>
        </dependency>
        <dependency>
            <groupId>ch.qos.logback</groupId>
            <artifactId>logback-classic</artifactId>
            <version>${logback.version}</version>
        </dependency>
        <dependency>
            <groupId>ch.qos.logback</groupId>
            <artifactId>logback-core</artifactId>
            <version>${logback.version}</version>
        </dependency>
        <dependency>
            <groupId>ch.qos.logback</groupId>
            <artifactId>logback-access</artifactId>
            <version>${logback.version}</version>
        </dependency>

        <dependency>
            <groupId>org.codehaus.janino</groupId>
            <artifactId>janino</artifactId>
            <version>2.6.1</version>
        </dependency>
        <!--lombok-->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.12.4</version>
        </dependency>

    <!--spring start -->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-core</artifactId>
            <version>${spring.version}</version>
        </dependency>

        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-beans</artifactId>
            <version>${spring.version}</version>
        </dependency>

        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context</artifactId>
            <version>${spring.version}</version>
        </dependency>

        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-tx</artifactId>
            <version>${spring.version}</version>
        </dependency>

        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-test</artifactId>
            <version>${spring.version}</version>
        </dependency>
        <!--spring end -->

        <!--springmvc-->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-web</artifactId>
            <version>${spring.version}</version>
        </dependency>

        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-webmvc</artifactId>
            <version>${spring.version}</version>
        </dependency>
        <!--springmvc end-->

        <!--其他web依赖-->
        <dependency>
            <groupId>jstl</groupId>
            <artifactId>jstl</artifactId>
            <version>1.2</version>
        </dependency>

        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>javax.servlet-api</artifactId>
            <version>3.1.0</version>
        </dependency>

        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>jsp-api</artifactId>
            <version>${jsp.version}</version>
        </dependency>

        <!--springmvc默认没有将对象转化成json的转化器，需添加json依赖-->
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-databind</artifactId>
            <version>${json.version}</version>
        </dependency>
        <!--其他web依赖 end-->

    </dependencies>
</project>
```

新建logback.xml用来配置日志：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration scan="true" scanPeriod="60 seconds" debug="false">
    <!-- 打印到控制台 -->
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <!-- encoder 默认配置为PatternLayoutEncoder -->
        <encoder>
            <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>
    <!--将org.springframeword.web包下的类的日志级别设置为debug-->
    <!--开发SpringMVC经常出现和参数类型相关的4XX错误，设置此项可以看到更详细的错误信息-->
    <logger name="org.springframework.web" level="DEBUG"/>
    <root level="INFO">
        <appender-ref ref="STDOUT" />
    </root>
</configuration>
```

web.xml文件中添加Spring MVC的前端控制器，用于拦截符合配置的url请求。

```
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">
    <servlet>
        <servlet-name>springmvc</servlet-name>
        <servlet-class>
            org.springframework.web.servlet.DispatcherServlet
        </servlet-class>
        <!--初始化参数，Spring MVC的配置文件，默认是/WEB-INT/config/servletName-servlet.xml，servletName是部署描述符中dispatcher servlet的名称-->
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value>classpath:config/springmvc.xml</param-value>
        </init-param>

        <!--容器启动时是否加载servlet -->
        <!--值大于0表示容器在应用启动时就加载这个servlet，小于0或不指定，则在该servlet的第一个请求时才会去加载，-->
        <!--正数的值越小，应用启动时越先被加载，值相同则由容器选择加载顺序-->
        <load-on-startup>1</load-on-startup>
    </servlet>

    <servlet-mapping>
        <servlet-name>springmvc</servlet-name>
        <url-pattern>*.action</url-pattern>
    </servlet-mapping>

    <!--resources目录下的静态资源由名为default的servlet来处理-->
    <servlet-mapping>
        <servlet-name>default</servlet-name>
        <url-pattern>/resources/*</url-pattern>
    </servlet-mapping>

    <!--配置转码过滤器，防止中文乱码-->
    <filter>
        <filter-name>CharacherEncodingFilter</filter-name>
        <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
        <init-param>
            <param-name>encoding</param-name>
            <param-value>utf-8</param-value>
        </init-param>
    </filter>
    <filter-mapping>
        <filter-name>CharacherEncodingFilter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>
</web-app>
```

编写核心配置文件springmvc.xml。

```
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:mvc="http://www.springframework.org/schema/mvc"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:aop="http://www.springframework.org/schema/aop" xmlns:tx="http://www.springframework.org/schema/tx"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans-3.2.xsd
        http://www.springframework.org/schema/mvc
        http://www.springframework.org/schema/mvc/spring-mvc-3.2.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context-3.2.xsd
        http://www.springframework.org/schema/aop
        http://www.springframework.org/schema/aop/spring-aop-3.2.xsd
        http://www.springframework.org/schema/tx
        http://www.springframework.org/schema/tx/spring-tx-3.2.xsd ">

    <!--处理器映射器 配置Handler时bean name即为url-->
    <bean class="org.springframework.web.servlet.handler.BeanNameUrlHandlerMapping"/>

    <!--处理器适配器 SimpleControllerHandlerAdapter支持所有实现了Controller接口的Handler控制器-->
    <bean class="org.springframework.web.servlet.mvc.SimpleControllerHandlerAdapter"/>

    <!--视图解析器-->
    <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver"/>

    <!--配置Handler处理器-->
    <bean name="/queryUser.action" class="com.tyson.controller.UserController"/>
</beans>
```
Handler类
```
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.Controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class UserController implements Controller {

    public ModelAndView handleRequest(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws Exception {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("/WEB-INF/hello.html");
        return mv;
    }
}
```



## 处理器映射器和适配器

在Spring MVC核心jar包中有一个默认的配置文件**DispatcherServlet.properties**(org.springframework.wen.servlet包下)，当核心配置文件springmvc.xml没有配置处理器映射器和适配器时，会使用默认配置。



### 非注解的处理器映射器和适配器
常用的处理器映射器有BeanNameUrlHandlerMapping，SimpleUrlHandlerMapping，ControllerClassNameHandlerMapping。
```
    <!--/User/findUser.action 映射到UserController的findUser()方法上-->
    <bean class="org.springframework.web.servlet.mvc.support.ControllerClassNameHandlerMapping"/>
```
```
    <!--通过内部参数配置请求的url和handler的映射关系-->
    <bean class="org.springframework.web.servlet.handler.SimpleUrlHandlerMapping">
        <property name="mappings">
            <props>
                <prop key="/queryUser.action">userController</prop>
            </props>
        </property>
    </bean>
    <bean id="userController" class="com.tyson.controller.UserController"/>
```
常用的处理器适配器有SimpleControllerHandlerAdapter，HttpRequestHandlerAdapter，AnnotationMethodHandlerAdapter。
```
    <!--Handler需实现HttpRequestHandler接口-->
    <bean class="org.springframework.web.servlet.mvc.HttpRequestHandlerAdapter"/>
```

### 注解的处理器映射器和适配器
方式一（常用的配置方式）：annotation-driven标签会自动注册RequestMappingHandlerMapping与RequestMappingHandlerAdapter两个Bean，这是Spring MVC为@Controller分发请求所必需的，并且提供了数据绑定支持，@NumberFormat支持，@DateTimeFormat支持，@Valid支持读写XML的支持（JAXB）和读写JSON的支持（默认Jackson）等功能。
```
    <mvc:annotation-driven/>
```
方式二：必须保证基于注解的处理器映射器和适配器成对配置，否则没有效果。
```
    <!--注解映射器 -->
    <bean class="org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping"/>
    <!--注解适配器 -->
    <bean class="org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter"/>
```

使用了注解的处理器映射器和适配器，则Handler无需实现任何接口，也不用在xml中配置任何信息，只需在Handler处理器类上添加相应的注解即可（@Controller，@RequestMapping）。

为了让注解的处理器映射器和适配器找到注解的Handler，需要在springmvc.xml中声明相关的bean信息。有两种配置方式：
```
<bean class="com.tyson.controller.UserController"></bean>
```
扫描配置，对包下所有的类进行扫描，找出所有使用了@Controller注解的Handler控制器类。
```
    <!-- 可以扫描controller、service等-->
    <context:component-scan base-package="com.tyson.controller"/>
```
Handler类
```
import com.tyson.po.User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/user")
public class UserController {
    @RequestMapping("/findUser")
    @ResponseBody
    public User findUser() {
        return new User("666", "tyson");
    }
}
```


## 前端控制器
前端控制器DispatcherServlet类最核心的方法是doDispatch()。

在web.xml中配置了名为"springmvc"的Servlet，拦截以".action"结尾的url请求。当Web应用接收到这种请求时，会调用前端控制器。
```
    protected void doDispatch(HttpServletRequest request, HttpServletResponse response) throws Exception {
        HttpServletRequest processedRequest = request;
        HandlerExecutionChain mappedHandler = null;
        boolean multipartRequestParsed = false;
        WebAsyncManager asyncManager = WebAsyncUtils.getAsyncManager(request);

        try {
            try {
                ModelAndView mv = null;
                Exception dispatchException = null;

                try {
                    //检测request是否包含多媒体类型（File文件），并将request转化为processedRequest
                    processedRequest = this.checkMultipart(request);
                    //判断processedRequest是否为原始的request
                    multipartRequestParsed = processedRequest != request;
                    mappedHandler = this.getHandler(processedRequest);
                    if (mappedHandler == null || mappedHandler.getHandler() == null) {
                        this.noHandlerFound(processedRequest, response);
                        return;
                    }

                    HandlerAdapter ha = this.getHandlerAdapter(mappedHandler.getHandler());
                    String method = request.getMethod();
                    boolean isGet = "GET".equals(method);
                    if (isGet || "HEAD".equals(method)) {
                        long lastModified = ha.getLastModified(request, mappedHandler.getHandler());
                        if (this.logger.isDebugEnabled()) {
                            this.logger.debug("Last-Modified value for [" + getRequestUri(request) + "] is: " + lastModified);
                        }

                        if ((new ServletWebRequest(request, response)).checkNotModified(lastModified) && isGet) {
                            return;
                        }
                    }

                    if (!mappedHandler.applyPreHandle(processedRequest, response)) {
                        return;
                    }

                    mv = ha.handle(processedRequest, response, mappedHandler.getHandler());
                    if (asyncManager.isConcurrentHandlingStarted()) {
                        return;
                    }

                    this.applyDefaultViewName(processedRequest, mv);
                    mappedHandler.applyPostHandle(processedRequest, response, mv);
                } catch (Exception var19) {
                    dispatchException = var19;
                }
                //处理ModelAndView，包含render()方法
                this.processDispatchResult(processedRequest, response, mappedHandler, mv, dispatchException);
            } catch (Exception var20) {
                this.triggerAfterCompletion(processedRequest, response, mappedHandler, var20);
            } catch (Error var21) {
                this.triggerAfterCompletionWithError(processedRequest, response, mappedHandler, var21);
            }

        } finally {
            if (asyncManager.isConcurrentHandlingStarted()) {
                if (mappedHandler != null) {
                    mappedHandler.applyAfterConcurrentHandlingStarted(processedRequest, response);
                }
            } else if (multipartRequestParsed) {
                this.cleanupMultipart(processedRequest);
            }

        }
    }
```

### 对静态资源的处理

web.xml中DispatcherServlet的配置如下：

```xml
    <servlet>
        <servlet-name>springmvc</servlet-name>
        <servlet-class>
            org.springframework.web.servlet.DispatcherServlet
        </servlet-class>
        <!--初始化参数，Spring MVC的配置文件，默认是/WEB-INT/config/servletName-servlet.xml，
        servletName是部署描述符中dispatcher servlet的名称-->
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value>classpath:config/springmvc.xml</param-value>
        </init-param>

        <!--容器启动时是否加载servlet -->
        <!--值大于0表示容器在应用启动时就加载这个servlet，小于0或不指定，则在该servlet的第一个请求时才会去加载，-->
        <!--正数的值越小，应用启动时越先被加载，值相同则由容器选择加载顺序-->
        <load-on-startup>1</load-on-startup>
    </servlet>

    <servlet-mapping>
        <servlet-name>springmvc</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>
```

经测试，`<url-pattern>/</url-pattern>`会拦截\*.html请求，不会拦截\*.jsp请求。"/"优先级最低，故\*.jsp请求会先被默认的jsp Servlet处理，不会被dispatcherServlet拦截。而\*.html没有默认的Servlet可以处理，会被dispatcherServlet拦截。

而`<url-pattern>/*</url-pattern>`则会拦截所有请求，包括\*.html和\*.jsp。

`<url-pattern>*.action</url-pattern>`则只会拦截后缀为action的请求，不会拦截静态资源的请求。

"/"和"/\*"的区别在于"/\*"的优先级高于"/路径"和"\*.后缀"的路径，而"/"在所有的匹配路径中，优先级最低，即当别的路径都无法匹配时，"/"所匹配的servlet才会进行相应的请求资源处理。

```xml
    <servlet>
        <servlet-name>default</servlet-name>
        <servlet-class>org.apache.catalina.servlets.DefaultServlet</servlet-class>
        <init-param>
            <param-name>debug</param-name>
            <param-value>0</param-value>
        </init-param>
        <init-param>
            <param-name>listings</param-name>
            <param-value>false</param-value>
        </init-param>
        <load-on-startup>1</load-on-startup>
    </servlet>
```



```xml
    <servlet>
        <servlet-name>jsp</servlet-name>
        <servlet-class>org.apache.jasper.servlet.JspServlet</servlet-class>
        <init-param>
            <param-name>fork</param-name>
            <param-value>false</param-value>
        </init-param>
        <init-param>
            <param-name>xpoweredBy</param-name>
            <param-value>false</param-value>
        </init-param>
        <load-on-startup>3</load-on-startup>
    </servlet>
```



```xml
    <!-- The mapping for the default servlet -->
    <servlet-mapping>
        <servlet-name>default</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>

    <!-- The mappings for the JSP servlet -->
    <servlet-mapping>
        <servlet-name>jsp</servlet-name>
        <url-pattern>*.jsp</url-pattern>
        <url-pattern>*.jspx</url-pattern>
    </servlet-mapping>
```





静态资源的处理：

方法一：激活Tomcat的default Servlet来处理静态资源

```xml
   <!--Tomcat, Jetty, JBoss, and GlassFish默认Servlet的名字为“default”-->
	<servlet-mapping>
        <servlet-name>default</servlet-name>
        <url-pattern>*.jsp</url-pattern>
        <url-pattern>*.html</url-pattern>
        <url-pattern>*.js</url-pattern>
    </servlet-mapping>

    <servlet-mapping>
        <servlet-name>springmvc</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>
```

default Servlet无法解析jsp页面，直接输出html源码。

![default servlet处理静态资源](https://img-blog.csdnimg.cn/20190127162223870.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1R5c29uMDMxNA==,size_16,color_FFFFFF,t_70)

方式二：使用`<mvc:default-servlet-handler/>`

请求的url若是静态资源请求，则转由org.springframework.web.servlet.resource.DefaultServletHttpRequestHandler 处理并返回，否则才由DispatcherServlet处理。DefaultServletHttpRequestHandler使用的是各个Servlet容器自己默认的Servlet（如jsp servlet）。



方式三：Spring3.0.4以后版本`<mvc:resources/>`

```xml
    <mvc:annotation-driven />
    <!--两个*，它表示映射/resources/下所有的URL，包括子路径-->
    <mvc:resources mapping="/resources/**" location="/WEB-INF/, classpath:config, /resources/" cache-period="31536000"/>
```

`<mvc:default-servlet-handler/>` 将静态资源的处理经由 Spring MVC 框架交回 Web 应用服务器处理。而 `<mvc:resources/> `更进一步，由 Spring MVC 框架自行处理静态资源。

`<mvc:resources/> `允许静态资源放在任何地方，如 WEB-INF 目录下、类路径，甚至 JAR 包中。可通过 cache-period 设置客户端数据缓存时间。

使用` <mvc:resources/> `元素，把 mapping 的 URI 注册到 SimpleUrlHandlerMapping的urlMap 中，
key 为 mapping 的 URI pattern值,而 value为 ResourceHttpRequestHandler，
这样就巧妙的把对静态资源的访问由 HandlerMapping 转到 ResourceHttpRequestHandler 处理并返回，所以就支持classpath目录和jar包内静态资源的访问。




## 视图解析器
视图解析器ViewResolver的作用是把逻辑视图名称解析成具体的View对象，让View对象去解析视图，并将带有数据的视图反馈给客户端。

常用的视图解析器类有AbstractCachingViewResolver，UrlBasedViewResolver，InternalResourceViewResolver，XmlViewResolver，BeanNameViewResolver，ResorceBundleViewResolver，FreeMarkerViewResolver和VelocityViewResolver。


### AbstractCachingViewResolver
抽象类，实现了该抽象类的视图解析器会将其曾经解析过的视图进行缓存。


### UrlBasedViewResolver
继承了AbstractCachingViewResolver，通过拼接资源的uri路径来展示视图。
```
    <bean class="org.springframework.web.servlet.view.UrlBasedViewResolver">
        <property name="prefix" value="/WEB-INF/jsp"/>
        <property name="suffix" value=".jsp"/>
        <!--InternalResourceView 用于展示JSP页面，要使用jstl标签展示数据，就要使用JstlView-->
        <!--/WEB-INF下的内容不能通过request请求的方式直接访问到，而InternalResourceView在服务器端通过跳转的方式便可解决这个问题-->
        <property name="viewClass" value="org.springframework.web.servlet.view.InternalResourceView"/>
    </bean>
```
UrlBasedViewResolver支持返回的视图名称中含有"redirect:"和"forward:"前缀，支持视图的重定向和内部跳转设置。


### InternalResourceViewResolver
内部资源视图解析器，最常用的视图解析器类型。它是UrlBasedViewResolver的子类。

特点：它会把返回的视图名称自动解析为InternalResourceView类型的对象，而InternalResourceView会把Controller处理器方法返回的模型属性都存放到对应的request属性中，然后通过RequestDispatcher在服务端把请求以forward的方式跳转到目标url。
```
    <!--无需单独指定viewClass对象-->
    <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="prefix" value="/WEB-INF/jsp"/>
        <property name="suffix" value=".jsp"/>
    </bean>
```
当Controller处理器方法返回名为"login"的视图时，InternalResourceViewResolver会将"login"解析成一个InternalResourceView对象，然后将返回的模型数据存放到对应的HttpServletRequest属性中，最后利用RequestDispatcher把请求forward到"/WEB-INF/jsp/login.jsp"上。


### XmlViewResolver
继承了AbstractCachingViewResolver，使用XmlViewResolver需要添加一个xml配置文件，用来定义视图的bean对象。当获得Controller方法返回的视图名称后，XmlViewResolver会在指定的配置文件中寻找对应名称的bean配置，解析并处理该视图。
```
    <!--默认配置文件为/WEB-INF/view.xml-->
    <bean class="org.springframework.web.servlet.view.XmlViewResolver">
    <property name="location" value="/WEB-INF/config/view.xml"/>
    <!--在配置有多种类型的视图解析器情况下（ViewResolver链），order会指定处理视图的优先级，order越小优先级越高-->
    <!--order属性对所有实现Ordered接口的视图解析器都适用-->
        <property name="order" value="1"/>
    </bean>
```
/WEB-INF/config/view.xml，其遵循的DTD规则和Spring的bean工厂配置文件相同。
```
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
    <bean id="login" class="org.springframework.web.servlet.view.InternalResourceView">
        <property name="url" value="/login.jsp"/>
    </bean>
</beans>
```


### BeanNameViewResolver
通过把返回的逻辑视图名称去匹配定义好的视图bean对象。BeanNameViewResolver要求视图bean对象都定义在Spring的application context中。
```
<!--通过把返回的逻辑视图名称去匹配定义好的视图bean对象-->
<!-- 通过 order 属性来定义视图解析器的优先级, order 值越小优先级越高 -->
<bean class="org.springframework.web.servlet.view.BeanNameViewResolver">
	<property name="order" value="1"/>
</bean>
<bean id="myView" class="com.tyson.view.MyView"/>
```

MyView 定义：

```java
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

public class MyView implements View {

    public String getContentType() {
        return "text/html";
    }

    public void render(Map<String, ?> map, HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws Exception {
        httpServletResponse.getWriter().print("my view");
    }
}
```

MyViewController 

```java
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class MyViewController {
    @RequestMapping("/myView")
    public String myView() {
        return "myView";
    }
}
```

Spring MVC 根据返回的逻辑视图名去寻找视图 bean 对象。


### ResourceBundleViewResolver
继承了AbstractCachingViewResolver，需要一个properties文件定义逻辑视图名和View对象的对应关系，配置文件需放在classpath根目录下。
```
    <!--默认配置文件是classpath:view.properties-->
    <bean class="org.springframework.web.servlet.view.ResourceBundleViewResolver">
        <property name="basename">
            <value>viewResource</value>
        </property>
        <property name="order" value="1"/>
    </bean>
```
classpath:viewResource.properties
```
login.(class)=org.springframework.web.servlet.view.InternalResourceView
login.url=/hello.html
```


### FreeMarkerViewResolver
FreeMarkViewResolver会将Controller返回的逻辑视图信息解析成FreeMarkerView类型。它是UrlBasedViewResolver的子类。

FreeMarkerViewResolver解析逻辑视图后，返回FreeMarker模板，该模板负责将模型数据合并到模板中，从而生成标准输出（html、xml等）。


springmvc.xml配置
```
    <bean class="org.springframework.web.servlet.view.freemarker.FreeMarkerViewResolver">
        <property name="prefix" value="fm"/>
        <property name="suffix" value=".ftl"/>
        <property name="order" value="1"/>
    </bean>

    <bean class="org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer">
        <property name="templateLoaderPath" value="/WEB-INF/freemarker/template"/>
    </bean>
```
模板文件：web\WEB-INF\freemarker\template\fm_freemarker.ftl
```
<html>
    <head>
        <title>FreeMarker</title>
    </head>
    <body>
        <h1>hello, FreeMarker</h1>
    </body>
</html>

```
建议在ViewResolver中，将InternalResourceViewResolver解析器优先级设置为最低，因为该解析器能解析所有类型的视图，并返回一个不为空的View对象。


## 请求映射
在使用annotation-driven标签时，处理器Handler的类型要符合annotation-driven标签指定的处理器映射器和适配器的类型。annotation-driven标签指定的默认处理器映射器和适配器在Spring3.1之前为DefaultAnnotationHandlerMapping和AnnotationMethodHandlerAdapter，在Spring3.1之后为RequestMappingHandlerMapping和RequestMappingHandlerAdapter。

每个处理器适配器都实现了HandlerAdapter接口。
```
public interface HandlerAdapter {
    //检测Handler是否是支持的类型
    boolean supports(Object var1);

    ModelAndView handle(HttpServletRequest var1, HttpServletResponse var2, Object var3) throws Exception;

    long getLastModified(HttpServletRequest var1, Object var2);
}
```
RequestMappingHandlerAdapter本身没有重写supports方法，它的supports方法定义在父类AbstractHandlerMethodAdapter中。
```
    public final boolean supports(Object handler) {
        //支持HandlerMethod类型的Handler
        return handler instanceof HandlerMethod && this.supportsInternal((HandlerMethod)handler);
    }
```
RequestMappingHandlerAdapter支持HandlerMethod类型的Handler，HandlerMethod可以访问方法参数、方法返回值和方法的注解，所以它支持带有注解信息的Handler类。

@RequestMapping作用是为控制器指定可以处理那些url请求，该注解可以放在类上或者方法上。method用于指定处理哪些HTTP方法。
```
@RequestMapping(value = "/findUser", method={RequestMethod.GET, RequestMethod.POST})
```
@RequestMapping的param属性可以指定某一种参数名类型，当请求数据中包含该名称的请求参数时，才能进行相应，否则拒绝此次请求。
```
@RequestMapping(value = "/findUser", param = "username")
```
@RequestMapping的headers属性可以指定某一种请求头类型。
```
@RequestMapping(value = "/findUser", headers = "Content-Type:text/html;charset=UTF-8")
```
consumes属性表示处理请求的提交内容类型（Content-Type），例如"application/json,text/html"。而produces表示返回的内容类型，仅当request请求头中的Accept包含该指定类型时才会返回。
```
//仅处理reqeust的Content-Type为"application/json"类型的请求
@RequestMapping(value = "/findUser", consumes = "application/json")

@RequestMapping(value = "/findUser", produces = "application/json")
```


## 参数绑定
当用户发送请求时，前端控制器会请求处理器映射器返回一个处理器链，然后请求处理器适配器执行相应的Handler。此时，HandlerAdapter会调用Spring MVC提供的参数绑定组件将请求的key/value数据绑定到Controller处理器方法对应的形参上。


### 简单类型参数绑定
通过RequestParam将某个请求参数绑定到方法的形参上。value属性不指定时，则请求参数名称要与形参名称相同。required参数表示是否必须传入。defaultValue参数可以指定参数的默认值。
```
    @RequestMapping("/findUser")
    @ResponseBody
    public User findUser(@RequestParam(value = "user_id", required = true, defaultValue = "1") long id) {
        LOGGER.info("user_id: " + id);
        return new User(id , "tyson");
    }
```

路径变量。	

```
    @RequestMapping(value = "/insertUser/{id}")
    public String insertUser(@PathVariable long id) {
        return "success";
    }
```



### 包装类型参数绑定

```
    <form action="/springmvcdemo/user/findUserByCondition.action" method="post">
        id: <input type="int" name="id"/>
        name: <input type="text" name="name"/>
        <input type="submit"/>
    </form>
```
name属性名称与User类属性对应，Spring MVC的HandlerAdapter会解析请求参数生成具体的实体类，将相关的属性值通过set方法绑定到实体类中。
```
    @RequestMapping("/findUserByCondition")
    @ResponseBody
    public User findUserByCondition(User user) {
        return user;
    }
```


### 集合类型参数绑定
```
    @RequestMapping("/findUsers")
    @ResponseBody
    public List<User> findUsers(UserList userList) {
        List<User> users = userList.getUsers();
        for(User user : users) {
            LOGGER.info("user_id: " + user.getId() + " " + "user_name: " + user.getName());
        }
        return users;
    }
```

```
    <form action="/springmvcdemo/user/findUsers.action" method="post">
        <input name="users[0].id" value="1"/>
        <input name="users[0].name" value="tyson"/>
        <input name="users[1].id" value="2"/>
        <input name="users[1].name" value="sophia"/>
        <input type="submit"/>
    </form>
```
包装类中定义的List属性的名称要与前端页面的集合名一致。
```
public class UserList {
    private List<User> users;

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }
}
```




## Converter和Formatter

### Converter

将字符串转化成日期格式，可通过编写Converter接口的实现类来实现。

```java
import org.springframework.core.convert.converter.Converter;

import java.text.SimpleDateFormat;
import java.util.Date;

public class StringToDateConverter implements Converter<String, Date> {
    private String dataPattern;
	//利用传给构造器的日期样式，将String转化成Date
    public StringToDateConverter(String dataPattern) {
        this.dataPattern = dataPattern;
    }

    public Date convert(String s) {
        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat(dataPattern);
            dateFormat.setLenient(false);
            return dateFormat.parse(s);
        } catch(Exception e) {
            throw new IllegalArgumentException("invalid date format");
        }
    }
}
```

在Spring MVC配置文件编写一个ConversionService bean。这个bean需包含一个converters属性。

```xml
    <bean id="conversionService" class="org.springframework.context.support.ConversionServiceFactoryBean">
        <property name="converters">
            <list>
                <bean class="com.tyson.converter.StringToDateConverter">
                    <constructor-arg type="java.lang.String" value="MM-dd-yyyy"/>
                </bean>
            </list>
        </property>
    </bean>
```

然后给annotation-driven标签的converter-service属性赋bean名称。

```xml
<mvc:annotation-driven conversion-service="conversionService"/>
```

### Formatter

Formatter和Converter一样，也是将一种类型转化为另一种类型。但Formatter的源类型必须是String，而Converter适用于各种类型的源类型。Formatter更适合于web层。

```java
import org.springframework.format.Formatter;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class DateFormatter implements Formatter<Date> {
    private static final Logger LOGGER = LoggerFactory.getLogger(Formatter.class);
    private String datePattern;
    private SimpleDateFormat dateFormat;

    public DateFormatter(String datePattern) {
        this.datePattern = datePattern;
        this.dateFormat = new SimpleDateFormat(datePattern);
        dateFormat.setLenient(false);
    }

    public Date parse(String s, Locale locale) throws ParseException {
        try {
            System.out.println(s);
            return dateFormat.parse(s);
        } catch(IllegalArgumentException ex) {
            throw new IllegalArgumentException("Illegal date format. Please use \"" + datePattern + "\"");
        }
    }

    public String print(Date date, Locale locale) {
        return dateFormat.format(date);
    }
}
```

spring配置文件。

```xml
<mvc:annotation-driven conversion-service="formattingConversionService"/>    

<bean id="formattingConversionService" class="org.springframework.format.support.FormattingConversionServiceFactoryBean">
        <property name="formatters">
            <set>
                <bean class="com.tyson.formatter.DateFormatter">
                    <constructor-arg type="java.lang.String" value="MM-dd-yyyy"/>
                </bean>
            </set>
        </property>
    </bean>
```

## 验证器


本节内容参考：[SpringMVC介绍之Validation](https://elim.iteye.com/blog/1812584)

### 使用Validator接口进行验证

需要进行验证的实体类

```java
public class User {
    private Long id;

    private String name;

    public User(Long id, String name) {
        this.id = id;
        this.name = name;
    }
    
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
```



Spring MVC提供了Validator接口，我们可以通过实现该接口来定义自己对实体对象的验证。

```java
import com.tyson.po.User;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

public class UserValidator implements Validator {

    /**
     * 判断当前Validator实现类是否支持校验当前需要校验的实体类
     * UserValidator只支持对User对象的校验
     */
    public boolean supports(Class<?> aClass) {
        return User.class.equals(aClass);
    }

    /**
     * @param errors 存放错误信息
     */
    public void validate(Object o, Errors errors) {
        ValidationUtils.rejectIfEmpty(errors, "id", null, "id is empty");
        User user = (User)o;
        if(user.getName().length() <= 4) {
            errors.rejectValue("name", null, "name's length must be longer than 4");
        }
    }
}
```

使用UserValidator校验User对象，使用DataBinder设定当前Controller由哪个Validator校验。

```java
import com.tyson.po.User;
import com.tyson.validator.UserValidator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.DataBinder;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.validation.Valid;
import java.util.List;

@Slf4j
@Controller
public class UserController {
    @InitBinder
    public void initBinder(DataBinder binder) {
        binder.setValidator(new UserValidator());
    }

    /**
     *用@Valid标识需要校验的参数user，否则Spring不会对它进行校验
     * BindingResult参数告诉Spring数据校验单的错误由我们自己处理，否则Spring会直接抛出异常
     * BindingResult参数必须紧挨着@Valid参数，有多少个@Valid参数就有多少个BindingResult参数
     */
    @RequestMapping("/login")
    public String login(@Valid User user, BindingResult bindingResult) {
        if(bindingResult.hasErrors()) {
            List<ObjectError> errors = bindingResult.getAllErrors();
            for(ObjectError error : errors) {
                log.info(error.toString());
            }
            return "error";
        }

        return "success";
    }
}
```

在Controller类中通过@InitBinder标记的方法只有在请求当前Controller的时候才会被执行，所以其中定义的Validator也只能在当前Controller中使用，如果我们希望一个Validator对所有的Controller都起作用的话，我们可以通过WebBindingInitializer的initBinder方法来设定了。另外，在SpringMVC的配置文件中通过mvc:annotation-driven的validator属性也可以指定全局的Validator。

```xml
<?xml version="1.0" encoding="UTF-8"?>  
<beans xmlns="http://www.springframework.org/schema/beans"  
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:context="http://www.springframework.org/schema/context"  
    xmlns:mvc="http://www.springframework.org/schema/mvc"  
    xsi:schemaLocation="http://www.springframework.org/schema/beans  
     http://www.springframework.org/schema/beans/spring-beans-3.0.xsd  
     http://www.springframework.org/schema/context  
     http://www.springframework.org/schema/context/spring-context-3.0.xsd  
     http://www.springframework.org/schema/mvc  
     http://www.springframework.org/schema/mvc/spring-mvc-3.0.xsd">  
      
    <!--将validator注册到适配器中-->
    <mvc:annotation-driven validator="userValidator"/>  
    <bean id="userValidator" class="com.tyson.validator.UserValidator"/>
</beans>  
```

非注解方式编写的适配器。

```xml
    <bean id="userValidator" class="com.tyson.validator.UserValidator"/>

    <!--自定义webBinder-->
    <bean id="webBinder" class="org.springframework.web.bind.support.ConfigurableWebBindingInitializer">
        <property name="validator" ref="userValidator"/>
    </bean>
    <!--处理器适配器-->
    <bean class="org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter">
        <property name="webBindingInitializer" ref="webBinder"/>
    </bean>
```



### 使用JSR-303 Validation进行验证

JSR-303是一个数据验证的规范，Spring没有对这一规范进行实现，当我们在Spring MVC使用JSR-303的时候需要提供一个对JSR-303规范的实现，Hibernate Validator实现了这一规范。

JSR303的校验是基于注解的，它的内部定义了一系列限制注解，我们只需要把这些注解标注在需要进行校验的实体类的属性或者对应的getter方法上面。

首先引入依赖。

```xml
        <!--validation-->
        <dependency>
            <groupId>org.hibernate</groupId>
            <artifactId>hibernate-validator</artifactId>
            <version>5.0.2.Final</version>
        </dependency>
        <dependency>
            <groupId>javax.validation</groupId>
            <artifactId>validation-api</artifactId>
            <version>1.1.0.Final</version>
        </dependency>
```

在SpringMVC的配置文件中引入MVC Namespace，并加上`<mvn:annotation-driven/>`，此时便可以使用JSR-303来进行实体对象的验证。

```xml
<?xml version="1.0" encoding="UTF-8"?>  
<beans xmlns="http://www.springframework.org/schema/beans"  
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:context="http://www.springframework.org/schema/context"  
    xmlns:mvc="http://www.springframework.org/schema/mvc"  
    xsi:schemaLocation="http://www.springframework.org/schema/beans  
     http://www.springframework.org/schema/beans/spring-beans-3.0.xsd  
     http://www.springframework.org/schema/context  
     http://www.springframework.org/schema/context/spring-context-3.0.xsd  
     http://www.springframework.org/schema/mvc  
     http://www.springframework.org/schema/mvc/spring-mvc-3.0.xsd">  
      
    <mvc:annotation-driven/>  
</beans>
```

实体类，其中@NotBlank是Hibernate Validator的扩展。

```java
import org.hibernate.validator.constraints.NotBlank;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

public class User {
	private String name;
    private String password;
    private int age;

    @NotBlank(message = "用户名不能为空")
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @NotNull(message = "密码不能为null")
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Min(value = 10, message = "年龄最小为10")
    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    @Override
    public String toString() {
        return name + ":" + age;
    }
}
```

Controller类

```java
import com.tyson.po.User;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.validation.Valid;

@Controller
public class UserController {
    @RequestMapping("/login")
    public String login(@Valid User user, BindingResult bindingResult) {
        if(bindingResult.hasErrors()) {
            return "error";
        }
        return "success";
    }
}
```

**JSR-303原生支持的限制有如下几种：**

| **限制**                      | 说明                                                         |
| ----------------------------- | ------------------------------------------------------------ |
| **@Null**                     | 限制只能为null                                               |
| **@NotNull**                  | 限制必须不为null                                             |
| **@AssertFalse**              | 限制必须为false                                              |
| **@AssertTrue**               | 限制必须为true                                               |
| **@DecimalMax(value)**        | 限制必须为一个不大于指定值的数字                             |
| **@DecimalMin(value)**        | 限制必须为一个不小于指定值的数字                             |
| **@Digits(integer,fraction)** | 限制必须为一个小数，且整数部分的位数不能超过integer，小数部分的位数不能超过fraction |
| **@Future**                   | 限制必须是一个将来的日期                                     |
| **@Max(value)**               | 限制必须为一个不大于指定值的数字                             |
| **@Min(value)**               | 限制必须为一个不小于指定值的数字                             |
| **@Past**                     | 限制必须是一个过去的日期                                     |
| **@Pattern(value)**           | 限制必须符合指定的正则表达式                                 |
| **@Size(max,min)**            | 限制字符长度必须在min到max之间                               |

#### 自定义限制类型的注解

除了JSR-303原生支持的限制类型之外我们还可以定义自己的限制类型。定义自己的限制类型首先我们得定义一个该种限制类型的注解，而且该注解需要使用@Constraint标注。下面定义一个表示金额的限制类型。

```java
package com.tyson.validator;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Documented
@Target({ElementType.METHOD, ElementType.FIELD, ElementType.ANNOTATION_TYPE, ElementType.CONSTRUCTOR, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = MoneyValidator.class)
public @interface Money {
    String message() default "不是金额形式";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
```

@Constraint注解的validatedBy属性用于指定我们定义的当前限制类型需要被哪个ConstraintValidator进行校验。在定义自己的限制类型的注解时有三个属性是必须定义的，message、groups和payload属性。

接下来定义限制类型校验类MoneyValidator，限制类型校验类必须实现接口javax.validation.ConstraintValidator，并实现它的initialize和isValid方法。

```java
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.regex.Pattern;

public class MoneyValidator implements ConstraintValidator<Money, Double> {
    private String moneyReg = "^\\d+(\\.\\d{1,2})?$"; //表示金额的正则表达式
    private Pattern moneyPattern = Pattern.compile(moneyReg);

    /**
     * 通过initialize可以获取限制类型
     */
    public void initialize(Money money) {
    }

    public boolean isValid(Double value, ConstraintValidatorContext constraintValidatorContext) {
        if(value == null) {
            return false;
        }
        return moneyPattern.matcher(value.toString()).matches();
    }
}
```

同样的方法定义自己的@Min限制类型和对应的MinValidator校验器。

```java
import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Target({ElementType.METHOD, ElementType.FIELD, ElementType.ANNOTATION_TYPE, ElementType.CONSTRUCTOR, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Constraint(
        validatedBy = {MinValidator.class}
)
public @interface Min {
    int value() default 0;

    String message();

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}

```

isValid方法的第一个参数正是对应的当前需要校验的数据的值，而它的类型也**正是对应的我们需要校验的数据的数据类型。**这两者的数据类型必须保持一致，否则Spring会提示找不到对应数据类型的ConstraintValidator。

```java
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class MinValidator implements ConstraintValidator<Min, Integer> {
    private int minValue;

    public void initialize(Min min) {
        minValue = min.value();
    }

    public boolean isValid(Integer val, ConstraintValidatorContext constraintValidatorContext) {
        return val >= minValue;
    }
}
```

下面是使用了@Min和@Money限制的一个实体类

```java
import com.tyson.validator.Min;
import com.tyson.validator.Money;

public class Worker {
    private int age;
    private Double salary;

    @Min(value = 10, message = "最小年龄是10")
    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    @Money(message = "标准的金额格式是xxx.xx")
    public Double getSalary() {
        return salary;
    }

    public void setSalary(Double salary) {
        this.salary = salary;
    }
}
```

WorkerController类

```java
import javax.validation.Valid;
import java.util.List;

@Slf4j
@Controller
public class WorkerController {
    @RequestMapping("/addWorker")
    public String addWorker(@Valid Worker worker, BindingResult bindingResult) {
        if(bindingResult.hasErrors()) {
            List<ObjectError> errors = bindingResult.getAllErrors();
            for(ObjectError error : errors) {
                log.info(error.toString());
            }
            return "error";
        }
        return "success";
    }
}
```

另外Spring对自定义JSR-303限制类型支持的新特性，那就是Spring支持往ConstraintValidator里面注入bean对象。

```java
public class MoneyValidator implements ConstraintValidator<Money, Double> {  
   
    private String moneyReg = "^\\d+(\\.\\d{1,2})?$";//表示金额的正则表达式  
    private Pattern moneyPattern = Pattern.compile(moneyReg);  
    private UserController controller;  
     
    public void initialize(Money money) {}  
   
    public boolean isValid(Double value, ConstraintValidatorContext arg1) {  
       if (value == null)  
           return true;  
       return moneyPattern.matcher(value.toString()).matches();  
    }  
   
    public UserController getController() {  
       return controller;  
    }  
   
    @Resource  
    public void setController(UserController controller) {  
       this.controller = controller;  
    }  
   
}  
```

#### 分组校验

POJO有多个属性，分组校验可以使得Controller的方法只校验POJO的某个属性，而不是校验所有的属性。

```java
import com.tyson.validator.Min;
import com.tyson.validator.Money;
import com.tyson.validator.ValidationGroup1;
import com.tyson.validator.ValidationGroup2;

public class Worker {
    private int age;
    private Double salary;

    @Min(value = 10, message = "最小年龄是10", groups = {ValidationGroup1.class})
    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    @Money(message = "标准的金额格式是xxx.xx", groups = {ValidationGroup2.class})
    public Double getSalary() {
        return salary;
    }

    public void setSalary(Double salary) {
        this.salary = salary;
    }
}
```

分组接口ValidationGroup1、ValidationGroup2，不需要写实现。

```java
public interface ValidationGroup1 {}
```

WorkerController类，@Validated(value = {ValidationGroup1.class})使得addWorker方法只校验ValidationGroup1这个分组的校验注解，即只校验年龄，不校验工资格式。

```java
import com.tyson.po.Worker;
import com.tyson.validator.ValidationGroup1;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestMapping;
import java.util.List;

@Slf4j
@Controller
public class WorkerController {
    @RequestMapping("/addWorker")
    public String addWorker(@Validated(value = {ValidationGroup1.class}) Worker worker, BindingResult bindingResult) {
        if(bindingResult.hasErrors()) {
            List<ObjectError> errors = bindingResult.getAllErrors();
            for(ObjectError error : errors) {
                log.info(error.toString());
            }
            return "error";
        }
        return "success";
    }
}
```



补充：@Valid和@Validated的区别：@Valid可以用于对象属性上，可嵌套验证，@Validated不可以嵌套验证；@Validated提供分组功能，而@Valid不支持分组功能。

```java
public class Item {

    @NotNull(message = "id不能为空")
    @Min(value = 1, message = "id必须为正整数")
    private Long id;

    @Valid // 嵌套验证必须用@Valid
    @NotNull(message = "props不能为空")
    @Size(min = 1, message = "props至少要有一个自定义属性")
    private List<Prop> props;
}
```

```java
public class Prop {

    @NotNull(message = "pid不能为空")
    @Min(value = 1, message = "pid必须为正整数")
    private Long pid;

    @NotNull(message = "vid不能为空")
    @Min(value = 1, message = "vid必须为正整数")
    private Long vid;

    @NotBlank(message = "pidName不能为空")
    private String pidName;

    @NotBlank(message = "vidName不能为空")
    private String vidName;
}
```



## RequestBody和RequestParam

@RequestBody一般处理的是在ajax请求中声明contentType: "application/json; charset=utf-8"时候。也就是json数据或者xml数据。

@RequestParam一般就是在ajax里面没有声明contentType的时候，为默认的`x-www-form-urlencoded`格式时。



