<!-- MarkdownTOC autoanchor="true" autolink="true" uri_encoding="false" -->

- [Spring MVC处理流程](#spring-mvc处理流程)
- [Spring MVC和Struts的区别](#spring-mvc和struts的区别)
- [Spring MVC环境搭建](#spring-mvc环境搭建)
- [处理器映射器和适配器](#处理器映射器和适配器)
    - [非注解的处理器映射器和适配器](#非注解的处理器映射器和适配器)
    - [注解的处理器映射器和适配器](#注解的处理器映射器和适配器)
- [前端控制器](#前端控制器)
- [视图解析器](#视图解析器)
    - [AbstractCachingViewResolver](#abstractcachingviewresolver)
    - [UrlBasedViewResolver](#urlbasedviewresolver)
    - [InternalResourceViewResolver](#internalresourceviewresolver)
    - [XmlViewResolver](#xmlviewresolver)
    - [BeanNameViewResolver](#beannameviewresolver)
    - [ResourceBundleViewResolver](#resourcebundleviewresolver)
    - [FreeMarkerViewResolver](#freemarkerviewresolver)
- [请求映射](#请求映射)
- [参数绑定](#参数绑定)
    - [简单类型参数绑定](#简单类型参数绑定)
    - [包装类型参数绑定](#包装类型参数绑定)
    - [集合类型参数绑定](#集合类型参数绑定)
- [Converter和Formatter](#converter和formatter)
    - [Converter](#converter)
    - [Formatter](#formatter)
- [验证器](#验证器)

<!-- /MarkdownTOC -->


Spring MVC是一种基于MVC架构模式的轻量级Web框架。

<a id="spring-mvc处理流程"></a>
## Spring MVC处理流程

Spring MVC的处理过程：首先控制器接收用户的请求，调用相应的模型来进行业务处理，并返回数据给控制器。控制器调用相应的视图来显示处理的结果，并通过视图呈现给用户。

![Spring MVC处理流程](https://img-blog.csdnimg.cn/20190125180502787.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1R5c29uMDMxNA==,size_16,color_FFFFFF,t_70)

处理流程中各个组件的功能：

- 前端控制器（DispatcherServlet）：接收用户请求，给用户返回结果。
- 处理器映射器（HandlerMapping）：根据请求的url路径，通过注解或者xml配置，寻找匹配的Handler。
- 处理器适配器（HandlerAdapter）：根据特定规则执行相关的Handler。
- 处理器（Handler）：执行相关的请求处理逻辑，并返回相应的数据和视图信息，将其封装到ModelAndView对象中。
- 视图解析器（ViewResolver）：将逻辑视图名解析成真正的视图View。
- 视图（View）：接口类，实现类可支持不同的View类型（JSP、FreeMarker、Excel等）。



<a id="spring-mvc和struts的区别"></a>
## Spring MVC和Struts的区别

1. Spring MVC是基于方法开发，Struts2是基于类开发的。
    - Spring MVC会将用户请求的URL路径信息与Controller的某个方法进行映射，所有请求参数会注入到对应方法的形参上，生成Handler对象，对象中只有一个方法；
    - Struts每处理一次请求都会实例一个Action，Action类的所有方法使用的请求参数都是Action类中的成员变量，随着方法增多，整个Action也会变得混乱。
2. Spring MVC支持单例开发模式，Struts只能使用多例

    - Struts由于只能通过类的成员变量接收参数，故只能使用多例。
3. Struts2 的核心是基于一个Filter即StrutsPreparedAndExcuteFilter，Spring MVC的核心是基于一个Servlet即DispatcherServlet(前端控制器)。
4. Struts处理速度稍微比Spring MVC慢，Struts使用了Struts标签，加载数据较慢。

<a id="spring-mvc环境搭建"></a>
## Spring MVC环境搭建

1. 引入jar包spring-webmvc-4.2.5.RELEASE.jar，Spring相关jar包。
2. web.xml文件中添加Spring MVC的前端控制器，用于拦截符合配置的url请求。
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

    <!--post乱码过滤器-->
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

3. 编写核心配置文件springmvc.xml。
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



<a id="处理器映射器和适配器"></a>
## 处理器映射器和适配器

在Spring MVC核心jar包中有一个默认的配置文件**DispatcherServlet.properties**(org.springframework.wen.servlet包下)，当核心配置文件springmvc.xml没有配置处理器映射器和适配器时，会使用默认配置。



<a id="非注解的处理器映射器和适配器"></a>
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

<a id="注解的处理器映射器和适配器"></a>
### 注解的处理器映射器和适配器
方式一（常用的配置方式）：annotation-driven标签会自动注册处理器映射器和处理器适配器，它还提供数据绑定支持，例如@DateTimeFormat支持，@NumberFormatAnnotation支持，读写xml的支持和读写json的支持。
```
    <mvc:annotation-driven></mvc:annotation-driven>
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
    <context:component-scan base-package="com.tyson.controller"></context:component-scan>
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


<a id="前端控制器"></a>
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


<a id="视图解析器"></a>
## 视图解析器
视图解析器ViewResolver的作用是把逻辑视图名称解析成具体的View对象，让View对象去解析视图，并将带有数据的视图反馈给客户端。

常用的视图解析器类有AbstractCachingViewResolver，UrlBasedViewResolver，InternalResourceViewResolver，XmlViewResolver，BeanNameViewResolver，ResorceBundleViewResolver，FreeMarkerViewResolver和VelocityViewResolver。


<a id="abstractcachingviewresolver"></a>
### AbstractCachingViewResolver
抽象类，实现了该抽象类的视图解析器会将其曾经解析过的视图进行缓存。


<a id="urlbasedviewresolver"></a>
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


<a id="internalresourceviewresolver"></a>
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


<a id="xmlviewresolver"></a>
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


<a id="beannameviewresolver"></a>
### BeanNameViewResolver
视图的bean配置信息在springmvc.xml中，BeanNameViewResolver要求视图bean对象都定义在Spring的application context中。
```
    <!--BeanNameViewResolver 视图的bean配置信息在springmvc.xml中-->
    <bean class="org.springframework.web.servlet.view.BeanNameViewResolver">
        <property name="order" value="1"/>
    </bean>
    <bean id="hello" class="org.springframework.web.servlet.view.InternalResourceView">
        <property name="url" value="/hello.jsp"/>
    </bean>
```


<a id="resourcebundleviewresolver"></a>
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


<a id="freemarkerviewresolver"></a>
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


<a id="请求映射"></a>
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


<a id="参数绑定"></a>
## 参数绑定
当用户发送请求时，前端控制器会请求处理器映射器返回一个处理器链，然后请求处理器适配器执行相应的Handler。此时，HandlerAdapter会调用Spring MVC提供的参数绑定组件将请求的key/value数据绑定到Controller处理器方法对应的形参上。


<a id="简单类型参数绑定"></a>
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



<a id="包装类型参数绑定"></a>
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


<a id="集合类型参数绑定"></a>
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


>web.xml中配置转码过滤器
```
    <!--post乱码过滤器-->
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
```

<a id="converter和formatter"></a>
## Converter和Formatter

<a id="converter"></a>
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

<a id="formatter"></a>
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

<a id="验证器"></a>
## 验证器

引入依赖hibernate-validator。

```xml
        <!--validation-->
        <dependency>
            <groupId>org.hibernate</groupId>
            <artifactId>hibernate-validator</artifactId>
            <version>5.0.2.Final</version>
        </dependency>
```

springmvc.xml

```xml
<mvc:annotation-driven validator="validator"/>    

<bean id="validator" class="org.springframework.validation.beanvalidation.LocalValidatorFactoryBean">
        <property name="providerClass" value="org.hibernate.validator.HibernateValidator"/>
    </bean>
```

实体类

```java
public class User {
    @NotNull(message = "{user.id.null}")
    private Long id;

    @NotEmpty(message = "{user.name.null}")
    @Length(min = 5, max = 20, message = "{user.name.length.illegal}")
    @Pattern(regexp = "[a-zA-Z]{5,20}", message = "{user.name.illegal}")
    private String name;
}
```

Controller类

```java
    @RequestMapping("/findUserByCondition")
    public String findUserByCondition(@Valid User user, BindingResult bindingResult) {
        LOGGER.info("user_name: " + user.getName());
        if(bindingResult.hasErrors()) {
            List<ObjectError> errors = bindingResult.getAllErrors();
            for(ObjectError error : errors) {
                LOGGER.info(error.toString());
                return "error";
            }
        }
        return "success";
    }
```

类路径下的ValidationMessages.properties

```properties
user.id.null=用户编号不能为空  
user.name.null=用户名不能为空  
user.name.length.illegal=用户名长度必须在5到20之间  
user.name.illegal=用户名必须是字母  
user.password.null=密码不能为空  
```











