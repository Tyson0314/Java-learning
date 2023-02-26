---
sidebar: heading
title: 为什么阿里禁止使用Java内置线程池？
category: Java
tag:
  - Java并发
head:
  - - meta
    - name: keywords
      content: Java并发,多线程,线程池,为什么禁止使用Java内置线程池
  - - meta
    - name: description
      content: 高质量的Java并发常见知识点和面试题总结，让天下没有难背的八股文！
---

## 为什么阿里禁止使用Java内置线程池？

首先要了解一下线程池 ThreadPoolExecutor 的参数及其作用。

ThreadPoolExecutor有以下这些参数。

1. **corePoolSize** 指定了线程池里的线程数量，核心线程池大小
   
2. maximumPoolSize 指定了线程池里的最大线程数量
   
3. **keepAliveTime** 当线程池线程数量大于corePoolSize时候，多出来的空闲线程，多长时间会被销毁。
   
4. **TimeUnit**时间单位。
   
5. workQueue 任务队列，用于存放提交但是尚未被执行的任务。
   
6. **threadFactory** 线程工厂，用于创建线程，一般可以用默认的
   
7. **RejectedExecutionHandler** 拒绝策略，所谓拒绝策略，是指将任务添加到线程池中时，线程池拒绝该任务所采取的相应策略。

阿里规约之所以强制要求手动创建线程池，也是和这些参数有关。

阿里规约上指出，线程池不允许使用Executors去创建，而是通过ThreadPoolExecutor的方式，这样的处理方式让写的同学更加明确线程池的**运行规则**，规避资源耗尽的风险。

虽然Executor提供的四个静态方法创建线程池，但是不建议去使用这些静态方法创建线程池，因为这些方法创建的线程池，如果使用不当，可能会有OOM的风险。

比如**newFixedThreadPool**和**newSingleThreadExecutor**的问题是堆积的请求处理队列可能会耗费非常大的内存，甚至**OOM**。

**newCachedThreadPool**和**newScheduledThreadPool**的问题是线程数最大数是Integer.MAX_VALUE，可能会创建数量非常多的线程，甚至**OOM**。



--end--

最后分享一份大彬精心整理的**大厂面试手册**，包含**操作系统、计算机网络、Java基础、JVM、分布式**等高频面试题，非常实用，有小伙伴靠着这份手册拿过字节offer~

![](http://img.topjavaer.cn/img/面试手册1.png)

![](http://img.topjavaer.cn/img/面试手册.png)

**手册获取方式**：微信搜索「**程序员大彬**」或者扫描下面的二维码，关注后发送关键字「**手册**」就可以找到下载链接了（**无套路，无解压密码**）。

![](http://img.topjavaer.cn/img/image-20221207225029295.png)
