
---
sidebar: heading
title: Spring MVC源码分析
category: 源码分析
tag:
  - Spring MVC
head:
  - - meta
    - name: keywords
      content: Spring MVC面试题,Spring MVC源码解析,MVC模式,Spring MVC和Struts,Spring MVC工作原理,Spring MVC常用注解,Spring MVC异常处理,Spring MVC拦截器,REST
  - - meta
    - name: description
      content: 高质量的Spring MVC常见知识点和面试题总结，让天下没有难背的八股文！
---

在分析SpringMVC源码之前，先来分享一下：如何优雅高效地阅读源码

### 3.1 官方文档

https://docs.spring.io/spring/docs/4.3.7.RELEASE/spring-framework-reference/htmlsingle/#spring-introduction

理论以官方文档和源码为准

### 3.2 下载源码

在阅读源码前，请大家下载源码，可以在Maven中下载，请大家自行百度如何下载源码。源码有丰富的注释

下面是DispatcherServlet.java源码截图，方法和变量都有详细的注释

![](http://img.topjavaer.cn/img/202310070843881.png)

### 3.3 常用快捷键

记住快捷键会让你事半功倍

ctrl+n:快速进入类

ctrl+shift+n:进入普通文件

ctrl+f12:查看该类方法

在阅读源码的时候特别方便，因为你不可能每个方法都细细品读

![](http://img.topjavaer.cn/img/202310070843416.png)

ctrl+alt+u:查看类结构图，这些类都可以点击进入，我比较喜欢用这个

![](http://img.topjavaer.cn/img/202310070843077.png)

ctrl+shift+alt+u:查看类结构图，这些类不能进入

alt+f7:查看方法引用位置，以doDispatch()为例，可以看到DispatcherServlet 897行被引用，858行注释被引用

![](http://img.topjavaer.cn/img/202310070844708.png)

ctrl+alt+b:跳转到方法实现处，对者接口方法点击，会弹出来在哪里实现。

![](http://img.topjavaer.cn/img/202310070844974.png)

接下来是我不得不说的idea的神器——书签（bookmark），可以对代码行进行标记，并进行快速切换

ctrl+f11:显示bookmark标记情况，土黄色代表该字符已被占用，输入或者点击1代表在此位置书签为1

![](http://img.topjavaer.cn/img/202310070844271.png)

我们以processDispatchResult()方法为例

![](http://img.topjavaer.cn/img/202310070844048.png)

ctrl+标记编号 快速回到标记处，如我刚才在这留下了书签，ctrl+1,DispatcherServlet 1018行

shift+f11:显示所有书签，左栏是我打过书签的类、行信息，右边是代码详情

![](http://img.topjavaer.cn/img/202310070845135.png)

当你所有书签都用完，0-9，a-z全部用完，可以直接ctrl+f11,记录普通书签，虽然无法用ctrl快速跳转，在shift+f11还是可以找到

![](http://img.topjavaer.cn/img/202310070845600.png)

alt+f8：启用Evaluate窗口

当我们想看返回值，无法声明变量查看该变量的时候（源码不可更改）

![](http://img.topjavaer.cn/img/202310070845830.png)

可以使用Evaluate表达式

![](http://img.topjavaer.cn/img/202310070845794.png)



以上就是导读篇的内容，下篇文章我们将进入源码分析部分。