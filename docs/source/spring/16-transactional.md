---
sidebar: heading
title: Spring源码分析
category: 源码分析
tag:
  - Spring
head:
  - - meta
    - name: keywords
      content: Spring源码,标签解析,源码分析,代理,事物注解,声明式事物,Spring设计模式,Spring AOP,Spring IOC,Bean,Bean生命周期
  - - meta
    - name: description
      content: 高质量的Spring源码分析总结
---

**正文**

面的几个章节已经分析了spring基于`@AspectJ`的源码，那么接下来我们分析一下Aop的另一个重要功能，事物管理。[最全面的Java面试网站](https://topjavaer.cn)

## 事务的介绍

### 1.数据库事物特性

- 原子性
  多个数据库操作是不可分割的，只有所有的操作都执行成功，事物才能被提交；只要有一个操作执行失败，那么所有的操作都要回滚，数据库状态必须回复到操作之前的状态
- 一致性
  事物操作成功后，数据库的状态和业务规则必须一致。例如：从A账户转账100元到B账户，无论数据库操作成功失败，A和B两个账户的存款总额是不变的。
- 隔离性
  当并发操作时，不同的数据库事物之间不会相互干扰（当然这个事物隔离级别也是有关系的）
- 持久性
  事物提交成功之后，事物中的所有数据都必须持久化到数据库中。即使事物提交之后数据库立刻崩溃，也需要保证数据能能够被恢复。

### 2.事物隔离级别

当数据库并发操作时，可能会引起脏读、不可重复读、幻读、第一类丢失更新、第二类更新丢失等现象。

- 脏读
  事物A读取事物B尚未提交的更改数据，并做了修改；此时如果事物B回滚，那么事物A读取到的数据是无效的，此时就发生了脏读。
- 不可重复读
  一个事务执行相同的查询两次或两次以上，每次都得到不同的数据。如：A事物下查询账户余额，此时恰巧B事物给账户里转账100元，A事物再次查询账户余额，那么A事物的两次查询结果是不一致的。
- 幻读
  A事物读取B事物提交的新增数据，此时A事物将出现幻读现象。幻读与不可重复读容易混淆，如何区分呢？幻读是读取到了其他事物提交的新数据，不可重复读是读取到了已经提交事物的更改数据（修改或删除）

对于以上问题，可以有多个解决方案，设置数据库事物隔离级别就是其中的一种，数据库事物隔离级别分为四个等级，通过一个表格描述其作用。

| 隔离级别         | 脏读   | 不可重复读 | 幻象读 |
| ---------------- | ------ | ---------- | ------ |
| READ UNCOMMITTED | 允许   | 允许       | 允许   |
| READ COMMITTED   | 脏读   | 允许       | 允许   |
| REPEATABLE READ  | 不允许 | 不允许     | 允许   |
| SERIALIZABLE     | 不允许 | 不允许     | 不允许 |

### 3.Spring事物支持核心接口

![](http://img.topjavaer.cn/img/202310011145573.png)

- TransactionDefinition-->定义与spring兼容的事务属性的接口

```java
public interface TransactionDefinition {
    // 如果当前没有事物，则新建一个事物；如果已经存在一个事物，则加入到这个事物中。
    int PROPAGATION_REQUIRED = 0;
    // 支持当前事物，如果当前没有事物，则以非事物方式执行。
    int PROPAGATION_SUPPORTS = 1;
    // 使用当前事物，如果当前没有事物，则抛出异常。
    int PROPAGATION_MANDATORY = 2;
    // 新建事物，如果当前已经存在事物，则挂起当前事物。
    int PROPAGATION_REQUIRES_NEW = 3;
    // 以非事物方式执行，如果当前存在事物，则挂起当前事物。
    int PROPAGATION_NOT_SUPPORTED = 4;
    // 以非事物方式执行，如果当前存在事物，则抛出异常。
    int PROPAGATION_NEVER = 5;
    // 如果当前存在事物，则在嵌套事物内执行；如果当前没有事物，则与PROPAGATION_REQUIRED传播特性相同
    int PROPAGATION_NESTED = 6;
    // 使用后端数据库默认的隔离级别。
    int ISOLATION_DEFAULT = -1;
    // READ_UNCOMMITTED 隔离级别
    int ISOLATION_READ_UNCOMMITTED = Connection.TRANSACTION_READ_UNCOMMITTED;
    // READ_COMMITTED 隔离级别
    int ISOLATION_READ_COMMITTED = Connection.TRANSACTION_READ_COMMITTED;
    // REPEATABLE_READ 隔离级别
    int ISOLATION_REPEATABLE_READ = Connection.TRANSACTION_REPEATABLE_READ;
    // SERIALIZABLE 隔离级别
    int ISOLATION_SERIALIZABLE = Connection.TRANSACTION_SERIALIZABLE;
    // 默认超时时间
    int TIMEOUT_DEFAULT = -1;
    // 获取事物传播特性
    int getPropagationBehavior();
    // 获取事物隔离级别
    int getIsolationLevel();
    // 获取事物超时时间
    int getTimeout();
    // 判断事物是否可读
    boolean isReadOnly();
    // 获取事物名称
    @Nullable
    String getName();
}
```

1. Spring事物传播特性表：

| 传播特性名称              | 说明                                                         |
| ------------------------- | ------------------------------------------------------------ |
| PROPAGATION_REQUIRED      | 如果当前没有事物，则新建一个事物；如果已经存在一个事物，则加入到这个事物中 |
| PROPAGATION_SUPPORTS      | 支持当前事物，如果当前没有事物，则以非事物方式执行           |
| PROPAGATION_MANDATORY     | 使用当前事物，如果当前没有事物，则抛出异常                   |
| PROPAGATION_REQUIRES_NEW  | 新建事物，如果当前已经存在事物，则挂起当前事物               |
| PROPAGATION_NOT_SUPPORTED | 以非事物方式执行，如果当前存在事物，则挂起当前事物           |
| PROPAGATION_NEVER         | 以非事物方式执行，如果当前存在事物，则抛出异常               |
| PROPAGATION_NESTED        | 如果当前存在事物，则在嵌套事物内执行；如果当前没有事物，则与PROPAGATION_REQUIRED传播特性相同 |

1. Spring事物隔离级别表：

| 事务隔离级别                 | 脏读 | 不可重复读 | 幻读 |
| ---------------------------- | ---- | ---------- | ---- |
| 读未提交（read-uncommitted） | 是   | 是         | 是   |
| 不可重复读（read-committed） | 否   | 是         | 是   |
| 可重复读（repeatable-read）  | 否   | 否         | 是   |
| 串行化（serializable）       | 否   | 否         | 否   |

MySQL默认的事务隔离级别为 **可重复读repeatable-read**

　　3.PlatformTransactionManager-->Spring事务基础结构中的中心接口

> 分享一份大彬精心整理的**大厂面试手册**，包含**计算机基础、Java基础、多线程、JVM、数据库、Redis、Spring、Mybatis、SpringMVC、SpringBoot、分布式、微服务、设计模式、架构、校招社招分享**等高频面试题，非常实用，有小伙伴靠着这份手册拿过字节offer~
>
> ![](http://img.topjavaer.cn/image/image-20211127150136157.png)
>
> ![](http://img.topjavaer.cn/image/image-20220316234337881.png)
>
> 需要的小伙伴可以自行**下载**：
>
> http://mp.weixin.qq.com/s?__biz=Mzg2OTY1NzY0MQ==&mid=2247485445&idx=1&sn=1c6e224b9bb3da457f5ee03894493dbc&chksm=ce98f543f9ef7c55325e3bf336607a370935a6c78dbb68cf86e59f5d68f4c51d175365a189f8#rd

```java
public interface PlatformTransactionManager {
    // 根据指定的传播行为，返回当前活动的事务或创建新事务。
    TransactionStatus getTransaction(@Nullable TransactionDefinition definition) throws TransactionException;
    // 就给定事务的状态提交给定事务。
    void commit(TransactionStatus status) throws TransactionException;
    // 执行给定事务的回滚。
    void rollback(TransactionStatus status) throws TransactionException;
}
```

Spring将事物管理委托给底层的持久化框架来完成，因此，Spring为不同的持久化框架提供了不同的PlatformTransactionManager接口实现。列举几个Spring自带的事物管理器：

| 事物管理器                                                   | 说明                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| org.springframework.jdbc.datasource.DataSourceTransactionManager | 提供对单个javax.sql.DataSource事务管理，用于Spring JDBC抽象框架、iBATIS或MyBatis框架的事务管理 |
| org.springframework.orm.jpa.JpaTransactionManager            | 提供对单个javax.persistence.EntityManagerFactory事务支持，用于集成JPA实现框架时的事务管理 |
| org.springframework.transaction.jta.JtaTransactionManager    | 提供对分布式事务管理的支持，并将事务管理委托给Java EE应用服务器事务管理器 |



- TransactionStatus-->事物状态描述

1. TransactionStatus接口

```java
public interface TransactionStatus extends SavepointManager, Flushable {
    // 返回当前事务是否为新事务（否则将参与到现有事务中，或者可能一开始就不在实际事务中运行）
    boolean isNewTransaction();
    // 返回该事务是否在内部携带保存点，也就是说，已经创建为基于保存点的嵌套事务。
    boolean hasSavepoint();
    // 设置事务仅回滚。
    void setRollbackOnly();
    // 返回事务是否已标记为仅回滚
    boolean isRollbackOnly();
    // 将会话刷新到数据存储区
    @Override
    void flush();
    // 返回事物是否已经完成，无论提交或者回滚。
    boolean isCompleted();
}
```

1. SavepointManager接口

```java
public interface SavepointManager {
    // 创建一个新的保存点。
    Object createSavepoint() throws TransactionException;
    // 回滚到给定的保存点。
    // 注意：调用此方法回滚到给定的保存点之后，不会自动释放保存点，
    // 可以通过调用releaseSavepoint方法释放保存点。
    void rollbackToSavepoint(Object savepoint) throws TransactionException;
    // 显式释放给定的保存点。（大多数事务管理器将在事务完成时自动释放保存点）
    void releaseSavepoint(Object savepoint) throws TransactionException;
}
```



## Spring编程式事物

- 表

```sql
CREATE TABLE `account` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `balance` int(11) DEFAULT NULL COMMENT '账户余额',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COMMENT='--账户表'
```

- 实现

```java
 import org.apache.commons.dbcp.BasicDataSource;
 import org.springframework.dao.DataAccessException;
 import org.springframework.jdbc.core.JdbcTemplate;
 import org.springframework.jdbc.datasource.DataSourceTransactionManager;
 import org.springframework.transaction.TransactionDefinition;
 import org.springframework.transaction.TransactionStatus;
 import org.springframework.transaction.support.DefaultTransactionDefinition;
 
 import javax.sql.DataSource;

 public class MyTransaction {
 
     private JdbcTemplate jdbcTemplate;
     private DataSourceTransactionManager txManager;
     private DefaultTransactionDefinition txDefinition;
     private String insert_sql = "insert into account (balance) values ('100')";
 
     public void save() {
 
         // 1、初始化jdbcTemplate
         DataSource dataSource = getDataSource();
         jdbcTemplate = new JdbcTemplate(dataSource);
 
         // 2、创建物管理器
         txManager = new DataSourceTransactionManager();
         txManager.setDataSource(dataSource);
 
         // 3、定义事物属性
         txDefinition = new DefaultTransactionDefinition();
         txDefinition.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);
 
         // 3、开启事物
         TransactionStatus txStatus = txManager.getTransaction(txDefinition);
 
         // 4、执行业务逻辑
         try {
             jdbcTemplate.execute(insert_sql);
             //int i = 1/0;
             jdbcTemplate.execute(insert_sql);
             txManager.commit(txStatus);
         } catch (DataAccessException e) {
             txManager.rollback(txStatus);
             e.printStackTrace();
         }
 
     }
 
     public DataSource getDataSource() {
         BasicDataSource dataSource = new BasicDataSource();
         dataSource.setDriverClassName("com.mysql.jdbc.Driver");
         dataSource.setUrl("jdbc:mysql://localhost:3306/my_test?useSSL=false&useUnicode=true&characterEncoding=UTF-8");
         dataSource.setUsername("root");
         dataSource.setPassword("dabin1991@");
         return dataSource;
     }
 
 }
```



- 测试类及结果

```java
public class MyTest {
    @Test
    public void test1() {
        MyTransaction myTransaction = new MyTransaction();
        myTransaction.save();
    }
}
```

运行测试类，在抛出异常之后手动回滚事物，所以数据库表中不会增加记录。



## 基于@Transactional注解的声明式事物

其底层建立在 AOP 的基础之上，对方法前后进行拦截，然后在目标方法开始之前创建或者加入一个事务，在执行完目标方法之后根据执行情况提交或者回滚事务。通过声明式事物，无需在业务逻辑代码中掺杂事务管理的代码，只需在配置文件中做相关的事务规则声明（或通过等价的基于标注的方式），便可以将事务规则应用到业务逻辑中。

- 接口

```java
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Transactional(propagation = Propagation.REQUIRED)
public interface AccountServiceImp {
    void save() throws RuntimeException;
}
```

- 实现

```java
import org.springframework.jdbc.core.JdbcTemplate;

public class AccountServiceImpl implements AccountServiceImp {

    private JdbcTemplate jdbcTemplate;

    private static String insert_sql = "insert into account(balance) values (100)";


    @Override
    public void save() throws RuntimeException {
        System.out.println("==开始执行sql");
        jdbcTemplate.update(insert_sql);
        System.out.println("==结束执行sql");

        System.out.println("==准备抛出异常");
        throw new RuntimeException("==手动抛出一个异常");
    }

    public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
}
```

- 配置文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/tx
        http://www.springframework.org/schema/tx/spring-tx.xsd">

    <!--开启tx注解-->
    <tx:annotation-driven transaction-manager="transactionManager"/>

    <!--事物管理器-->
    <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="dataSource"/>
    </bean>

    <!--数据源-->
    <bean id="dataSource" class="org.apache.commons.dbcp.BasicDataSource">
        <property name="driverClassName" value="com.mysql.jdbc.Driver"/>
        <property name="url" value="jdbc:mysql://localhost:3306/my_test?useSSL=false&amp;useUnicode=true&amp;characterEncoding=UTF-8"/>
        <property name="username" value="root"/>
        <property name="password" value="dabin1991@"/>
    </bean>

    <!--jdbcTemplate-->
    <bean id="jdbcTemplate" class="org.springframework.jdbc.core.JdbcTemplate">
        <property name="dataSource" ref="dataSource"/>
    </bean>

    <!--业务bean-->
    <bean id="accountService" class="com.dabin.aop.AccountServiceImpl">
        <property name="jdbcTemplate" ref="jdbcTemplate"/>
    </bean>

</beans>
```

- 测试

```java
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class MyTest {

    @Test
    public void test1() {
        // 基于tx标签的声明式事物
        ApplicationContext ctx = new ClassPathXmlApplicationContext("aop.xml");
        AccountServiceImp studentService = ctx.getBean("accountService", AccountServiceImp.class);
        studentService.save();
    }
}
```

- 测试

```java
==开始执行sql
==结束执行sql
==准备抛出异常

java.lang.RuntimeException: ==手动抛出一个异常

    at com.lyc.cn.v2.day09.AccountServiceImpl.save(AccountServiceImpl.java:24)
    at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
    at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
    at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
    at java.lang.reflect.Method.invoke(Method.java:498)
```

测试方法中手动抛出了一个异常，Spring会自动回滚事物，查看数据库可以看到并没有新增记录。

注意：默认情况下Spring中的事务处理只对RuntimeException方法进行回滚，所以，如果此处将RuntimeException替换成普通的Exception不会产生回滚效果。



下一篇我们分析基于@Transactional注解的声明式事物的的源码实现。





最后给大家分享一个Github仓库，上面有大彬整理的**300多本经典的计算机书籍PDF**，包括**C语言、C++、Java、Python、前端、数据库、操作系统、计算机网络、数据结构和算法、机器学习、编程人生**等，可以star一下，下次找书直接在上面搜索，仓库持续更新中~

![](http://img.topjavaer.cn/image/Image.png)

![](http://img.topjavaer.cn/image/image-20221030094126118.png)

[**Github地址**](https://github.com/Tyson0314/java-books)

如果访问不了Github，可以访问码云地址。

[码云地址](https://gitee.com/tysondai/java-books)