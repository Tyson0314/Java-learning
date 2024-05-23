---
sidebar: heading
title: MyBatis源码分析
category: 源码分析
tag:
  - MyBatis
head:
  - - meta
    - name: keywords
      content: MyBatis面试题,MyBatis源码分析，MyBatis整体架构,MyBatis源码,Hibernate,Executor,MyBatis分页,MyBatis插件运行原理,MyBatis延迟加载,MyBatis预编译,一级缓存和二级缓存
  - - meta
    - name: description
      content: 高质量的MyBatis源码分析总结
---

`MyBatis` 是一款旨在帮助开发人员屏蔽底层重复性原生 `JDBC` 代码的持久化框架，其支持通过映射文件配置或注解将 `ResultSet` 映射为 `Java` 对象。相对于其它 `ORM` 框架，`MyBatis` 更为轻量级，支持定制化 `SQL` 和动态 `SQL`，方便优化查询性能，同时包含了良好的缓存机制。

## MyBatis 整体架构

![](http://img.topjavaer.cn/img/202312231153527.png)

### 基础支持层

- 反射模块：提供封装的反射 `API`，方便上层调用。
- 类型转换：为简化配置文件提供了别名机制，并且实现了 `Java` 类型和 `JDBC` 类型的互转。
- 日志模块：能够集成多种第三方日志框架。
- 资源加载模块：对类加载器进行封装，提供加载类文件和其它资源文件的功能。
- 数据源模块：提供数据源实现并能够集成第三方数据源模块。
- 事务管理：可以和 `Spring` 集成开发，对事务进行管理。
- 缓存模块：提供一级缓存和二级缓存，将部分请求拦截在缓存层。
- `Binding` 模块：在调用 `SqlSession` 相应方法执行数据库操作时，需要指定映射文件中的 `SQL` 节点，`MyBatis` 通过 `Binding` 模块将自定义 `Mapper` 接口与映射文件关联，避免拼写等错误导致在运行时才发现相应异常。

### 核心处理层

- 配置解析：`MyBatis` 初始化时会加载配置文件、映射文件和 `Mapper` 接口的注解信息，解析后会以对象的形式保存到 `Configuration` 对象中。
- `SQL` 解析与 `scripting` 模块：`MyBatis` 支持通过配置实现动态 `SQL`，即根据不同入参生成 `SQL`。
- `SQL` 执行与结果解析：`Executor` 负责维护缓存和事务管理，并将数据库相关操作委托给 `StatementHandler`，`ParmeterHadler` 负责完成 `SQL` 语句的实参绑定并通过 `Statement` 对象执行 `SQL`，通过 `ResultSet` 返回结果，交由 `ResultSetHandler` 处理。

- 插件：支持开发者通过插件接口对 `MyBatis` 进行扩展。

### 接口层

`SqlSession` 接口定义了暴露给应用程序调用的 `API`，接口层在收到请求时会调用核心处理层的相应模块完成具体的数据库操作。