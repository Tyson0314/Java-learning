## 说说你对 SpringMVC 的理解

SpringMVC是一种基于 Java 的实现MVC设计模型的请求驱动类型的轻量级Web框架，属于Spring框架的一个模块。

它通过一套注解，让一个简单的Java类成为处理请求的控制器，而无须实现任何接口。同时它还支持RESTful编程风格的请求。

## 什么是MVC模式？

MVC的全名是`Model View Controller`，是模型(model)－视图(view)－控制器(controller)的缩写，是一种软件设计典范。它是用一种业务逻辑、数据与界面显示分离的方法来组织代码，将众多的业务逻辑聚集到一个部件里面，在需要改进和个性化定制界面及用户交互的同时，不需要重新编写业务逻辑，达到减少编码的时间。

View，视图是指用户看到并与之交互的界面。比如由html元素组成的网页界面，或者软件的客户端界面。MVC的好处之一在于它能为应用程序处理很多不同的视图。在视图中其实没有真正的处理发生，它只是作为一种输出数据并允许用户操纵的方式。

model，模型是指模型表示业务规则。在MVC的三个部件中，模型拥有最多的处理任务。被模型返回的数据是中立的，模型与数据格式无关，这样一个模型能为多个视图提供数据，由于应用于模型的代码只需写一次就可以被多个视图重用，所以减少了代码的重复性。

controller，控制器是指控制器接受用户的输入并调用模型和视图去完成用户的需求，控制器本身不输出任何东西和做任何处理。它只是接收请求并决定调用哪个模型构件去处理请求，然后再确定用哪个视图来显示返回的数据。

## SpringMVC 有哪些优点？

1. 与 Spring 集成使用非常方便，生态好。
2. 配置简单，快速上手。
3. 支持 RESTful 风格。
4. 支持各种视图技术，支持各种请求资源映射策略。

## Spring MVC和Struts的区别

1. Spring MVC是基于方法开发，Struts2是基于类开发的。
   - Spring MVC会将用户请求的URL路径信息与Controller的某个方法进行映射，所有请求参数会注入到对应方法的形参上，生成Handler对象，对象中只有一个方法；
   - Struts每处理一次请求都会实例一个Action，Action类的所有方法使用的请求参数都是Action类中的成员变量，随着方法增多，整个Action也会变得混乱。
2. Spring MVC支持单例开发模式，Struts只能使用多例

   - Struts由于只能通过类的成员变量接收参数，故只能使用多例。
3. Struts2 的核心是基于一个Filter即StrutsPreparedAndExcuteFilter，Spring MVC的核心是基于一个Servlet即DispatcherServlet(前端控制器)。
4. Struts处理速度稍微比Spring MVC慢，Struts使用了Struts标签，加载数据较慢。

## Spring MVC的工作原理

Spring MVC的工作原理如下：

1. DispatcherServlet 接收用户的请求
2. 找到用于处理request的 handler 和 Interceptors，构造成 HandlerExecutionChain 执行链
3. 找到 handler 相对应的 HandlerAdapter
4. 执行所有注册拦截器的preHandler方法
5. 调用 HandlerAdapter 的 handle() 方法处理请求，返回 ModelAndView
6. 倒序执行所有注册拦截器的postHandler方法
7. 请求视图解析和视图渲染

![](http://img.dabin-coder.cn/image/spring_mvc原理.png)

## Spring MVC的主要组件？

- 前端控制器（DispatcherServlet）：接收用户请求，给用户返回结果。
- 处理器映射器（HandlerMapping）：根据请求的url路径，通过注解或者xml配置，寻找匹配的Handler。
- 处理器适配器（HandlerAdapter）：Handler 的适配器，调用 handler 的方法处理请求。
- 处理器（Handler）：执行相关的请求处理逻辑，并返回相应的数据和视图信息，将其封装到ModelAndView对象中。
- 视图解析器（ViewResolver）：将逻辑视图名解析成真正的视图View。
- 视图（View）：接口类，实现类可支持不同的View类型（JSP、FreeMarker、Excel等）。

## Spring MVC的常用注解由有哪些？
- @Controller：用于标识此类的实例是一个控制器。
- @RequestMapping：映射Web请求（访问路径和参数）。
- @ResponseBody：注解返回数据而不是返回页面
- @RequestBody：注解实现接收 http 请求的 json 数据，将 json 数据转换为 java 对象。
- @PathVariable：获得URL中路径变量中的值
- @RestController：@Controller+@ResponseBody
- @ExceptionHandler标识一个方法为全局异常处理的方法。

## @Controller 注解有什么用？

`@Controller` 注解标记一个类为 Spring Web MVC 控制器。Spring MVC 会将扫描到该注解的类，然后扫描这个类下面带有 `@RequestMapping` 注解的方法，根据注解信息，为这个方法生成一个对应的处理器对象，在上面的 HandlerMapping 和 HandlerAdapter组件中讲到过。

当然，除了添加 `@Controller` 注解这种方式以外，你还可以实现 Spring MVC 提供的 `Controller` 或者 `HttpRequestHandler` 接口，对应的实现类也会被作为一个处理器对象

## @RequestMapping 注解有什么用？

`@RequestMapping` 注解，用于配置处理器的 HTTP 请求方法，URI等信息，这样才能将请求和方法进行映射。这个注解可以作用于类上面，也可以作用于方法上面，在类上面一般是配置这个控制器的 URI 前缀。

## @RestController 和 @Controller 有什么区别？

`@RestController` 注解，在 `@Controller` 基础上，增加了 `@ResponseBody` 注解，更加适合目前前后端分离的架构下，提供 Restful API ，返回 JSON 数据格式。

## @RequestMapping 和 @GetMapping 注解有什么不同？

1. `@RequestMapping`：可注解在类和方法上；`@GetMapping` 仅可注册在方法上
2. `@RequestMapping`：可进行 GET、POST、PUT、DELETE 等请求方法；`@GetMapping` 是 `@RequestMapping` 的 GET 请求方法的特例。

## @RequestParam 和 @PathVariable 两个注解的区别

两个注解都用于方法参数，获取参数值的方式不同，`@RequestParam` 注解的参数从请求携带的参数中获取，而 `@PathVariable` 注解从请求的 URI 中获取

## @RequestBody和@RequestParam的区别

@RequestBody一般处理的是在ajax请求中声明contentType: "application/json; charset=utf-8"时候。也就是json数据或者xml数据。

@RequestParam一般就是在ajax里面没有声明contentType的时候，为默认的`x-www-form-urlencoded`格式时。

## Spring MVC的异常处理

可以将异常抛给Spring框架，由Spring框架来处理；我们只需要配置简单的异常处理器，在异常处理器中添视图页面即可。

- 使用系统定义好的异常处理器 SimpleMappingExceptionResolver
- 使用自定义异常处理器
- 使用异常处理注解

## SpringMVC 用什么对象从后台向前台传递数据的？

1. 将数据绑定到 request；
2. 返回 ModelAndView；
3. 通过ModelMap对象，可以在这个对象里面调用put方法，把对象加到里面，前端就可以通过el表达式拿到；
4. 绑定数据到 Session中。

## SpringMvc的Controller是不是单例模式？

单例模式。在多线程访问的时候有线程安全问题，解决方案是在控制器里面不要写可变状态量，如果需要使用这些可变状态，可以使用ThreadLocal，为每个线程单独生成一份变量副本，独立操作，互不影响。

## 介绍下 Spring MVC 拦截器？

Spring MVC 拦截器对应HandlerInterceor接口，该接口位于org.springframework.web.servlet的包中，定义了三个方法，若要实现该接口，就要实现其三个方法：

1. **前置处理（preHandle()方法）**：该方法在执行控制器方法之前执行。返回值为Boolean类型，如果返回false，表示拦截请求，不再向下执行，如果返回true，表示放行，程序继续向下执行（如果后面没有其他Interceptor，就会执行controller方法）。所以此方法可对请求进行判断，决定程序是否继续执行，或者进行一些初始化操作及对请求进行预处理。
2. **后置处理（postHandle()方法）**：该方法在执行控制器方法调用之后，且在返回ModelAndView之前执行。由于该方法会在DispatcherServlet进行返回视图渲染之前被调用，所以此方法多被用于处理返回的视图，可通过此方法对请求域中的模型和视图做进一步的修改。
3. **已完成处理（afterCompletion()方法）**：该方法在执行完控制器之后执行，由于是在Controller方法执行完毕后执行该方法，所以该方法适合进行一些资源清理，记录日志信息等处理操作。

可以通过拦截器进行权限检验，参数校验，记录日志等操作

## SpringMvc怎么配置拦截器？

有两种写法，一种是实现HandlerInterceptor接口，另外一种是继承适配器类，接着在接口方法当中，实现处理逻辑；然后在SpringMvc的配置文件中配置拦截器即可：

```java
<!-- 配置SpringMvc的拦截器 -->
<mvc:interceptors>
    <bean id="myInterceptor" class="com.dabin.MyHandlerInterceptor"></bean>
 
    <!-- 只拦截部分请求 -->
    <mvc:interceptor>
       <mvc:mapping path="/xxx.do" />
       <bean class="com.dabin.MyHandlerInterceptorAdapter" />
    </mvc:interceptor>
</mvc:interceptors>
```

## Spring MVC 的拦截器和 Filter 过滤器有什么差别？

有以下几点：

- **功能相同**：拦截器和 Filter 都能实现相应的功能
- **容器不同**：拦截器构建在 Spring MVC 体系中；Filter 构建在 Servlet 容器之上
- **使用便利性不同**：拦截器提供了三个方法，分别在不同的时机执行；过滤器仅提供一个方法

## 什么是REST?

REST，英文全称，Resource Representational State Transfer，对资源的访问状态的变化通过url的变化表述出来。

Resource：**资源**。资源是REST架构或者说整个网络处理的核心。

Representational：**某种表现形式**，比如用JSON，XML，JPEG等。

State Transfer：**状态变化**。通过HTTP method实现。

REST描述的是在网络中client和server的一种交互形式。用大白话来说，就是**通过URL就知道要什么资源，通过HTTP method就知道要干什么，通过HTTP status code就知道结果如何**。

举个例子：

```java
GET /tasks 获取所有任务
POST /tasks 创建新任务
GET /tasks/{id} 通过任务id获取任务
PUT /tasks/{id} 更新任务
DELETE /tasks/{id} 删除任务
```

GET代表获取一个资源，POST代表添加一个资源，PUT代表修改一个资源，DELETE代表删除一个资源。

server提供的RESTful API中，URL中只使用名词来指定资源，原则上不使用动词。用`HTTP Status Code`传递server的状态信息。比如最常用的 200 表示成功，500 表示Server内部错误等。

## 使用REST有什么优势呢？

第一，**风格统一**了，不会出现`delUser/deleteUser/removeUser`各种命名的代码了。

第二，**面向资源**，一目了然，具有自解释性。

第三，**充分利用 HTTP 协议本身语义**。

![](http://img.dabin-coder.cn/image/20220612101342.png)
