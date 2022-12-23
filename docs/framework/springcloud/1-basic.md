# 基础知识

微服务是将一个原本独立的系统拆分成多个小型服务，这些小型服务都在各自独立的进程中运行。

[从单体应用到微服务](https://www.zhihu.com/question/65502802/answer/802678798)

单体系统的缺点：

1. 修改一个小功能，就需要将整个系统重新部署上线，影响其他功能的运行；
2. 功能模块互相依赖，强耦合，扩展困难。如果出现性能瓶颈，需要对整体应用进行升级，虽然影响性能的可能只是其中一个小模块；

单体系统的优点：

1. 容易部署，程序单一，不存在分布式集群的复杂部署环境；
2. 容易测试，没有复杂的服务调用关系。

微服务的优点：

1. 不同的服务可以使用不同的技术；
2. 隔离性。一个服务不可用不会导致其他服务不可用；
3. 可扩展性。某个服务出现性能瓶颈，只需对此服务进行升级即可；
4. 简化部署。服务的部署是独立的，哪个服务出现问题，只需对此服务进行修改重新部署；

微服务的缺点：

1. 网络调用频繁。性能相对函数调用较差。
2. 运维成本增加。系统由多个独立运行的微服务构成，需要设计一个良好的监控系统对各个微服务的运行状态进行监控。

springcloud是一个基于Spring Boot实现的微服务架构开发工具。spring cloud包含多个子项目：

- Spring Cloud Config：配置管理工具，支持使用Git存储配置内容， 可以使用它实现应用配置的外部化存储， 并支持客户端配置信息刷新、加密／解密配置内容等。
- Spring Cloud Netflix：核心 组件，对多个Netflix OSS开源套件进行整合。
  - Eureka: 服务治理组件， 包含服务注册中心、服务注册与发现机制的实现。
  - Hystrix: 容错管理组件，实现断路器模式， 帮助服务依赖中出现的延迟和为故障提供强大的容错能力。
  - Ribbon: 客户端负载均衡的服务调用组件。
  - Feign: 基于Ribbon 和Hystrix 的声明式服务调用组件。
  - Zuul: 网关组件， 提供智能路由、访问过滤等功能。
  - Archaius: 外部化配置组件。
- Spring Cloud Bus: 事件、消息总线， 用于传播集群中的状态变化或事件， 以触发后续的处理， 比如用来动态刷新配置等。
- Spring Cloud Cluster: 针对ZooKeeper、Redis、Hazelcast、Consul 的选举算法和通用状态模式的实现。
- Spring Cloud Consul: 服务发现与配置管理工具。
- Spring Cloud ZooKeeper: 基于ZooKeeper 的服务发现与配置管理组件。
- Spring Cloud Security：Spring Security组件封装，提供用户验证和权限验证，一般与Spring Security OAuth2 组一起使用，通过搭建授权服务，验证Token或者JWT这种形式对整个微服务系统进行安全验证
- Spring Cloud Sleuth：分布式链路追踪组件，他分封装了Dapper、Zipkin、Kibana 的组件
- Spring Cloud Stream：Spring Cloud框架的数据流操作包，可以封装RabbitMq，ActiveMq，Kafka，Redis等消息组件，利用Spring Cloud Stream可以实现消息的接收和发送

spring-boot-starter-actuator：该模块能够自动为Spring Boot 构建的应用提供一系列用于监控的端点。

