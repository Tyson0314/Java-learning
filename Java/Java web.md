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

当有人请求JSP时，服务器内部会经历一次动态资源（JSP）到静态资源（HTML）的转化，服务器会自动帮我们把JSP中的HTML片段和数据拼接成静态资源响应给浏览器。也就是说JSP运行在服务器端，但最终发给客户端的都已经是转换好的HTML静态页面（在响应体里）。服务器并没有把JSP文件发给浏览器。

即：**JSP = HTML + Java片段**（各种标签本质上还是Java片段）