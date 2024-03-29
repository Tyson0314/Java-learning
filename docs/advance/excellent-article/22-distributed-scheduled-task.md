---
sidebar: heading
title: 新一代分布式任务调度框架
category: 优质文章
tag:
  - 分布式
head:
  - - meta
    - name: keywords
      content: 分布式任务调度框架,任务调度
  - - meta
    - name: description
      content: 优质文章汇总
---

# 新一代分布式任务调度框架

我们先思考下面几个业务场景的解决方案:

- 支付系统每天凌晨1点跑批，进行一天清算，每月1号进行上个月清算
- 电商整点抢购，商品价格8点整开始优惠
- 12306购票系统，超过30分钟没有成功支付订单的，进行回收处理
- 商品成功发货后，需要向客户发送短信提醒

> 类似的业务场景非常多，我们怎么解决？

## 为什么我们需要定时任务

很多业务场景需要我们某一特定的时刻去做某件任务，定时任务解决的就是这种业务场景。一般来说，系统可以使用消息传递代替部分定时任务，两者有很多相似之处，可以相互替换场景。

如，上面发货成功发短信通知客户的业务场景，我们可以在发货成功后发送MQ消息到队列，然后去消费mq消息，发送短信。但在某些场景下不能互换：

- **时间驱动/事件驱动：**内部系统一般可以通过时间来驱动，但涉及到外部系统，则只能使用时间驱动。如怕取外部网站价格，每小时爬一次
- **批量处理/逐条处理：**批量处理堆积的数据更加高效，在不需要实时性的情况下比消息中间件更有优势。而且有的业务逻辑只能批量处理。如移动每个月结算我们的话费
- **实时性/非实时性：**消息中间件能够做到实时处理数据，但是有些情况下并不需要实时，比如：vip升级
- **系统内部/系统解耦：**定时任务调度一般是在系统内部，而消息中间件可用于两个系统间

## java有哪些定时任务的框架

### **单机**

- **timer：**是一个定时器类，通过该类可以为指定的定时任务进行配置。TimerTask类是一个定时任务类，该类实现了Runnable接口，缺点异常未检查会中止线程
- **ScheduledExecutorService：**相对延迟或者周期作为定时任务调度，缺点没有绝对的日期或者时间
- **spring定时框架：**配置简单功能较多，如果系统使用单机的话可以优先考虑spring定时器

### **分布**

- **Quartz：**Java事实上的定时任务标准。但Quartz关注点在于定时任务而非数据，并无一套根据数据处理而定制化的流程。虽然Quartz可以基于数据库实现作业的高可用，但缺少分布式并行调度的功能
- **TBSchedule：**阿里早期开源的分布式任务调度系统。代码略陈旧，使用timer而非线程池执行任务调度。众所周知，timer在处理异常状况时是有缺陷的。而且TBSchedule作业类型较为单一，只能是获取/处理数据一种模式。还有就是文档缺失比较严重
- **elastic-job：**当当开发的弹性分布式任务调度系统，功能丰富强大，采用zookeeper实现分布式协调，实现任务高可用以及分片，目前是版本2.15，并且可以支持云开发
- **Saturn：**是唯品会自主研发的分布式的定时任务的调度平台，基于当当的elastic-job 版本1开发，并且可以很好的部署到docker容器上。
- **xxl-job:** 是大众点评员工徐雪里于2015年发布的分布式任务调度平台，是一个轻量级分布式任务调度框架，其核心设计目标是开发迅速、学习简单、轻量级、易扩展。

## 分布式任务调度系统对比

> 参与对比的可选系统方案：elastic——job （以下简称E-Job）与 xxx-job(以下简称X-Job)

### **支持集群部署**

**X-Job**：集群部署唯一要求为：保证每个集群节点配置（db和登陆账号等）保持一致。调度中心通过db配置区分不同集群。

> 执行器支持集群部署，提升调度系统可用性，同时提升任务处理能力。集群部署唯一要求为：保证集群中每个执行器的配置项 “`xxl.job.admin.addresses/调度中心地址`” 保持一致，执行器根据该配置进行执行器自动注册等操作。

**E-Job**：重写Quartz基于数据库的分布式功能，改用Zookeeper实现注册中心

> 作业注册中心：基于Zookeeper和其客户端Curator实现的全局作业注册控制中心。用于注册，控制和协调分布式作业执行。

### **多节点部署时任务不能重复执行**

**X-Job**：使用Quartz基于数据库的分布式功能

**E-Job**：将任务拆分为n个任务项后，各个服务器分别执行各自分配到的任务项。一旦有新的服务器加入集群，或现有服务器下线，elastic-job将在保留本次任务执行不变的情况下，下次任务开始前触发任务重分片。

### **日志可追溯**

**X-Job**：支持，有日志查询界面

**E-Job**：可通过事件订阅的方式处理调度过程的重要事件，用于查询、统计和监控。Elastic-Job目前提供了基于关系型数据库两种事件订阅方式记录事件。

### **监控告警**

**X-Job**：调度失败时，将会触发失败报警，如发送报警邮件。

> 任务调度失败时邮件通知的邮箱地址，支持配置多邮箱地址，配置多个邮箱地址时用逗号分隔

**E-Job**：通过事件订阅方式可自行实现

> 作业运行状态监控、监听作业服务器存活、监听近期数据处理成功、数据流类型作业（可通过监听近期数据处理成功数判断作业流量是否正常,如果小于作业正常处理的阀值，可选择报警。）、监听近期数据处理失败（可通过监听近期数据处理失败数判断作业处理结果，如果大于0，可选择报警。）

### **弹性扩容缩容**

**X-Job**：使用Quartz基于数据库的分布式功能，服务器超出一定数量会给数据库造成一定的压力

**E-Job**：通过zk实现各服务的注册、控制及协调

### **支持并行调度**

**X-Job**：调度系统多线程（默认10个线程）触发调度运行，确保调度精确执行，不被堵塞。

**E-Job**：采用任务分片方式实现。将一个任务拆分为n个独立的任务项，由分布式的服务器并行执行各自分配到的分片项。

### **高可用策略**

**X-Job**：“调度中心”通过DB锁保证集群分布式调度的一致性, 一次任务调度只会触发一次执行；

**E-Job**：调度器的高可用是通过运行几个指向同一个ZooKeeper集群的`Elastic-Job-Cloud-Scheduler`实例来实现的。ZooKeeper用于在当前主`Elastic-Job-Cloud-Scheduler`实例失败的情况下执行领导者选举。通过至少两个调度器实例来构成集群，集群中只有一个调度器实例提供服务，其他实例处于”待命”状态。当该实例失败时，集群会选举剩余实例中的一个来继续提供服务。

### **失败处理策略**

**X-Job**：调度失败时的处理策略，策略包括：失败告警（默认）、失败重试；

**E-Job**：弹性扩容缩容在下次作业运行前重分片，但本次作业执行的过程中，下线的服务器所分配的作业将不会重新被分配。失效转移功能可以在本次作业运行中用空闲服务器抓取孤儿作业分片执行。同样失效转移功能也会牺牲部分性能。

### **动态分片策略**

**X-Job：**分片广播任务以执行器为维度进行分片，支持动态扩容执行器集群从而动态增加分片数量，协同进行业务处理；在进行大数据量业务操作时可显著提升任务处理能力和速度。

执行器集群部署时，任务路由策略选择”分片广播”情况下，一次任务调度将会广播触发对应集群中所有执行器执行一次任务，同时传递分片参数；可根据分片参数开发分片任务；

**E-Job：**支持多种分片策略，可自定义分片策略

默认包含三种分片策略：基于平均分配算法的分片策略、 作业名的哈希值奇偶数决定IP升降序算法的分片策略、根据作业名的哈希值对Job实例列表进行轮转的分片策略，支持自定义分片策略

elastic-job的分片是通过zookeeper来实现的。分片的分片由主节点分配，如下三种情况都会触发主节点上的分片算法执行：a、新的Job实例加入集群 b、现有的Job实例下线（如果下线的是leader节点，那么先选举然后触发分片算法的执行） c、主节点选举”

### **和quartz框架对比**

- 调用API的的方式操作任务，不人性化；
- 需要持久化业务`QuartzJobBean`到底层数据表中，系统侵入性相当严重。
- 调度逻辑和`QuartzJobBean`耦合在同一个项目中，这将导致一个问题，在调度任务数量逐渐增多，同时调度任务逻辑逐渐加重的情况加，此时调度系统的性能将大大受限于业务；
- Quartz关注点在于定时任务而非数据，并无一套根据数据处理而定制化的流程。虽然Quartz可以基于数据库实现作业的高可用，但缺少分布式并行调度的功能。

## 综合对比

![](http://img.topjavaer.cn/img/定时任务框架选型.png)

## 总结和结论

**共同点：**

E-Job和X-job都有广泛的用户基础和完整的技术文档，都能满足定时任务的基本功能需求。

**不同点：**

- X-Job 侧重的业务实现的简单和管理的方便，学习成本简单，失败策略和路由策略丰富。推荐使用在“用户基数相对少，服务器数量在一定范围内”的情景下使
- E-Job 关注的是数据，增加了弹性扩容和数据分片的思路，以便于更大限度的利用分布式服务器的资源。但是学习成本相对高些，推荐在“数据量庞大，且部署服务器数量较多”时使用



> 摘录自网络
