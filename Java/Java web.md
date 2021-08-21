<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [servlet](#servlet)
- [jsp](#jsp)
- [Tomcat](#tomcat)
  - [tomcat和netty区别](#tomcat%E5%92%8Cnetty%E5%8C%BA%E5%88%AB)
- [跨域](#%E8%B7%A8%E5%9F%9F)
  - [同源策略](#%E5%90%8C%E6%BA%90%E7%AD%96%E7%95%A5)
  - [CSRF攻击](#csrf%E6%94%BB%E5%87%BB)
- [statement和prepareStatement](#statement%E5%92%8Cpreparestatement)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## servlet

servlet接口定义的是一套处理网络请求的规范。servlet运行在服务端，由servlet容器管理，用于生成动态的内容（早期的web技术主要用来浏览静态页面）。

Servlet是什么？

- 运行在Servlet容器（如Tomcat）中的Java类
- 没有main方法，不能独立运行，必须被部署到Servlet容器中，由容器来实例化和调用Servlet的方法

servlet生命周期指它从被web服务器加载到它被销毁的整个过程，分三个阶段：
1. 初始化阶段，调用init()方法
2. 响应客户请求阶段，调用service()方法
3. 终止阶段，调用destroy()方法

servlet容器：负责接收请求，生成servlet实例用于处理请求（调用service方法），然后将servlet生成的响应数据返回给客户端。

![](../img/web/servlet-container.jpg)



## jsp

Java server pages。当有人请求JSP时，服务器会自动帮我们把JSP中的HTML片段和java代码拼接成静态资源响应给浏览器。也就是说JSP运行在服务器端，但最终发给客户端的都已经是转换好的HTML静态页面（在响应体里）。

即：**JSP = HTML + Java片段**（各种标签本质上还是Java片段）



## Tomcat

Tomcat 是由 Apache 开发的一个 Servlet 容器，实现了对 Servlet 和 JSP 的支持。

### tomcat和netty区别

Netty和Tomcat最大的区别就在于通信协议，Tomcat是基于Http协议的，他的实质是一个基于http协议的web容器，但是Netty不一样，他能通过编程自定义各种协议，因为netty能够通过codec自己来编码/解码字节流，完成类似redis访问的功能，这就是netty和tomcat最大的不同。



## 跨域

当发送请求时，如果浏览器发现是跨源AJAX请求，就自动在头信息之中，添加一个Origin字段。

`Origin: http://api.bob.com`

对于服务端，如果请求头Origin指定的源，不在许可范围内，服务器会返回一个正常的HTTP响应。浏览器收到响应后，发现响应头信息没有包含Access-Control-Allow-Origin字段，就知道出错了，从而抛出一个错误，被XMLHttpRequest的onerror回调函数捕获。注意，这种错误无法通过状态码识别，因为HTTP回应的状态码有可能是200。

如果请求头Origin指定的域名在许可范围内，服务器返回的响应，会多出几个头信息字段。

```java
Access-Control-Allow-Origin: http://api.bob.com
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: FooBar
```

### 同源策略

同domain（或ip）,同端口，同协议视为同一个域，一个域内的脚本仅仅具有本域内的权限，也就是本域脚本只能读写本域内的资源，而无法访问其它域的资源。这种安全限制称为同源策略。 

### CSRF攻击

跨域请求有可能被黑客利用来发动 CSRF攻击。CSRF攻击（Cross-site request forgery），跨站请求伪造。攻击者盗用了你的身份，以你的名义发送请求，比如发送邮件，发消息，盗取你的账号，甚至购买商品。



## statement和prepareStatement
Statement对象每次执行sql，相关数据库都会执行sql语句的编译，prepareStatement是预编译的，支持批处理。
PreparedStatement是预编译的，对于批量处理可以大大提高效率，也叫JDBC存储过程。
prepareStatement对象的开销比statement对象开销大，对于一次性操作使用statement更佳。