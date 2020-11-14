<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [servlet](#servlet)
- [jsp](#jsp)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## servlet

servlet接口定义的是一套处理网络请求的规范。

Servlet是什么？

- 一个Java类，运行在Servlet容器中（Tomcat）
- 负责接收请求
- 调用Service处理数据
- 负责响应数据

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9pbWFnZXMyMDE1LmNuYmxvZ3MuY29tL2Jsb2cvODc0NzEwLzIwMTcwMi84NzQ3MTAtMjAxNzAyMTQyMDQ2MzI4OTQtMTc4NjcyOTY5My5wbmc?x-oss-process=image/format,png)



## jsp

Java server pages。当有人请求JSP时，服务器会自动帮我们把JSP中的HTML片段和java代码拼接成静态资源响应给浏览器。也就是说JSP运行在服务器端，但最终发给客户端的都已经是转换好的HTML静态页面（在响应体里）。

即：**JSP = HTML + Java片段**（各种标签本质上还是Java片段）



## Tomcat

Tomcat 是由 Apache 开发的一个 Servlet 容器，实现了对 Servlet 和 JSP 的支持。



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

