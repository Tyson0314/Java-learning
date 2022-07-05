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

![Spring MVC处理流程](https://img-blog.csdnimg.cn/20190125180502787.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1R5c29uMDMxNA==,size_16,color_FFFFFF,t_70)

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

## RequestBody和RequestParam的区别

@RequestBody一般处理的是在ajax请求中声明contentType: "application/json; charset=utf-8"时候。也就是json数据或者xml数据。

@RequestParam一般就是在ajax里面没有声明contentType的时候，为默认的`x-www-form-urlencoded`格式时。



![](http://img.dabin-coder.cn/image/20220612101342.png)
