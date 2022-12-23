---
sidebar: heading
---

## Mybatis是什么？

- MyBatis框架是一个开源的数据持久层框架。
- 它的内部封装了通过JDBC访问数据库的操作，支持普通的SQL查询、存储过程和高级映射，几乎消除了所有的JDBC代码和参数的手工设置以及结果集的检索。
- MyBatis作为持久层框架，其主要思想是将程序中的大量SQL语句剥离出来，配置在配置文件当中，实现SQL的灵活配置。
- 这样做的好处是将SQL与程序代码分离，可以在不修改代码的情况下，直接在配置文件当中修改SQL。

## **ORM是什么**

ORM（Object Relational Mapping），对象关系映射，是一种为了解决关系型数据库数据与简单Java对象（POJO）的映射关系的技术。简单的说，ORM是通过使用描述对象和数据库之间映射的元数据，将程序中的对象自动持久化到关系型数据库中。

## Mybatis和Hibernate的区别？

主要有以下几点区别：

1. Hibernate的**开发难度**大于MyBatis，主要由于Hibernate比较复杂，庞大，学习周期比较长。
2. Hibernate属于**全自动**ORM映射工具，使用Hibernate查询关联对象或者关联集合对象时，可以根据对象关系模型直接获取，所以它是全自动的。而Mybatis在查询关联对象或关联集合对象时，需要手动编写sql来完成，所以，称之为半自动ORM映射工具。
3. **数据库扩展性**的区别。Hibernate与数据库具体的关联在XML中，所以HQL对具体是用什么数据库并不是很关心。MyBatis由于所有sql都是依赖数据库书写的，所以扩展性、迁移性比较差。
4. **缓存机制**的区别。Hibernate的二级缓存配置在SessionFactory生成配置文件中进行详细配置，然后再在具体的表对象映射中配置那种缓存。MyBatis的二级缓存配置都是在每个具体的表对象映射中进行详细配置，这样针对不同的表可以自定义不同的缓冲机制，并且MyBatis可以在命名空间中共享相同的缓存配置和实例，通过Cache-ref来实现。
5. **日志系统完善性**的区别。Hibernate日志系统非常健全，涉及广泛，而Mybatis则除了基本记录功能外，功能薄弱很多。
6. **sql的优化上，Mybatis要比Hibernate方便很多**。由于Mybatis的sql都是写在xml里，因此优化sql比Hibernate方便很多。而Hibernate的sql很多都是自动生成的，无法直接维护sql；总之写sql的灵活度上Hibernate不及Mybatis。

## MyBatis框架的优缺点及其适用的场合

**优点**

1. 与JDBC相比，减少了50%以上的代码量。
2. MyBatis是易学的持久层框架，小巧并且简单易学。
3. MyBatis相当灵活，不会对应用程序或者数据库的现有设计强加任何影响，SQL写在XML文件里，从程序代码中彻底分离，降低耦合度，便于统一的管理和优化，并可重用。
4. 提供XML标签，支持编写动态的SQL，满足不同的业务需求。
5. 提供映射标签，支持对象与数据库的ORM字段关系映射。

**缺点**

1. SQL语句的编写工作量较大，对开发人员编写SQL的能力有一定的要求。
2. SQL语句依赖于数据库，导致数据库不具有好的移植性，不可以随便更换数据库。

**适用场景**

MyBatis专注于SQL自身，是一个足够灵活的DAO层解决方案。对性能的要求很高，或者需求变化较多的项目，例如Web项目，那么MyBatis是不二的选择。

## Mybatis的工作原理

- 读取MyBatis配置文件：mybatis-config.xml为MyBatis的全局配置文件，配置了MyBatis的运行环境等信息，例如数据库连接信息。
- 加载映射文件。映射文件即SQL映射文件，该文件中配置了操作数据库的SQL语句，需要在MyBatis配置文件mybatis-config.xml中加载。mybatis-config.xml文件可以加载多个映射文件，每个文件对应数据库中的一张表。
- 构造会话工厂：通过MyBatis的环境等配置信息构建会话工厂SqlSessionFactory。
- 创建会话对象：由会话工厂创建SqlSession对象，该对象中包含了执行SQL语句的所有方法。
- Executor执行器：MyBatis底层定义了一个Executor 接口来操作数据库，它将根据SqlSession传递的参数动态地生成需要执行的SQL语句，同时负责查询缓存的维护。
- MappedStatement 对象：在Executor接口的执行方法中有一个MappedStatement类型的参数，该参数是对映射信息的封装，用于存储要映射的SQL语句的id、参数等信息。
- 输入参数映射：输入参数类型可以是Map、List等集合类型，也可以是基本数据类型和POJO类型。输入参数映射过程类似于 JDBC对preparedStatement对象设置参数的过程。
- 输出结果映射：输出结果类型可以是Map、List等集合类型，也可以是基本数据类型和POJO类型。输出结果映射过程类似于 JDBC对结果集的解析过程。

## Mybatis都有哪些Executor执行器？它们之间的区别是什么？

Mybatis有三种基本的Executor执行器，`SimpleExecutor`、`ReuseExecutor`、`BatchExecutor`。

`SimpleExecutor`：每执行一次update或select，就开启一个Statement对象，用完立刻关闭Statement对象。

`ReuseExecutor`：执行update或select，以sql作为key查找Statement对象，存在就使用，不存在就创建，用完后，不关闭Statement对象，而是放置于Map<String, Statement>内，供下一次使用。简言之，就是重复使用Statement对象。

`BatchExecutor`：执行update（没有select，JDBC批处理不支持select），将所有sql都添加到批处理中（addBatch()），等待统一执行（executeBatch()），它缓存了多个Statement对象，每个Statement对象都是addBatch()完毕后，等待逐一执行executeBatch()批处理。与JDBC批处理相同。

作用范围：Executor的这些特点，都严格限制在SqlSession生命周期范围内。

## MyBatis中接口绑定有几种实现方式?

1. 通过注解绑定，在接口的方法上面加上 @Select@Update等注解里面包含Sql语句来绑定（SQL语句比较简单的时候，推荐注解绑定）
2. 通过xml里面写SQL来绑定, 指定xml映射文件里面的namespace必须为接口的全路径名（SQL语句比较复杂的时候，推荐xml绑定）

## Mybatis 是如何进行分页的？

Mybatis 使用 RowBounds 对象进行分页，它是针对 ResultSet 结果集执行的内存分页，而非物理分页，先把数据都查出来，然后再做分页。

可以在 sql 内直接书写带有物理分页的参数来完成物理分页功能，也可以使用分页插件来完成物理分页。

## 分页插件的基本原理是什么？

分页插件的基本原理是使用 Mybatis 提供的插件接口，实现自定义插件，在插件的拦截方法内拦截待执行的 sql，然后重写 sql（SQL 拼接 limit），根据 dialect 方言，添加对应的物理分页语句和物理分页参数，用到了技术 JDK 动态代理，用到了责任链设计模式。

## 简述Mybatis的插件运行原理

Mybatis仅可以编写针对 `ParameterHandler`、`ResultSetHandler`、`StatementHandler`、`Executor`这4种接口的插件，Mybatis使用JDK的动态代理，为需要拦截的接口生成代理对象以实现接口方法拦截功能，每当执行这4种接口对象的方法时，就会进入拦截方法，具体就是`InvocationHandler`的invoke()方法，当然，只会拦截那些你指定需要拦截的方法。

## .如何编写一个插件？

编写插件：实现 Mybatis 的 Interceptor 接口并复写 intercept()方法，然后再给插件编写注解，指定要拦截哪一个接口的哪些方法即可，最后在配置文件中配置你编写的插件。

## .Mybatis 是否支持延迟加载？

Mybatis 仅支持 association 关联对象和 collection 关联集合对象的延迟加载，association 指的就是一对一，collection 指的就是一对多查询。在 Mybatis 配置文件中，可以配置是否启用延迟加载`lazyLoadingEnabled=true|false`。

## 延迟加载的基本原理是什么？

延迟加载的基本原理是，使用 CGLIB 创建目标对象的代理对象，当调用目标方法时，进入拦截器方法。

比如调用`a.getB().getName()`，拦截器 invoke()方法发现 a.getB()是 null 值，那么就会单独发送事先保存好的查询关联 B 对象的 sql，把 B 查询上来，然后调用`a.setB(b)`，于是 a 的对象 b 属性就有值了，接着完成`a.getB().getName()`方法的调用。

当然了，不光是 Mybatis，几乎所有的包括 Hibernate，支持延迟加载的原理都是一样的。

## #{}和${}的区别是什么？

#{ } 被解析成预编译语句，预编译之后可以直接执行，不需要重新编译sql。

```mysql
//sqlMap 中如下的 sql 语句
select * from user where name = #{name};
//解析成为预编译语句；编译好SQL语句再取值
select * from user where name = ?;
```

${ } 仅仅为一个字符串替换，每次执行sql之前需要进行编译，存在 sql 注入问题。

```mysql
select * from user where name = '${name}'
//传递的参数为 "ruhua" 时,解析为如下，然后发送数据库服务器进行编译。取值以后再去编译SQL语句。
select * from user where name = "ruhua";
```

## Mybatis的预编译

数据库接受到sql语句之后，需要词法和语义解析，优化sql语句，制定执行计划。这需要花费一些时间。如果一条sql语句需要反复执行，每次都进行语法检查和优化，会浪费很多时间。预编译语句就是将sql语句中的`值用占位符替代`，即将`sql语句模板化`。一次编译、多次运行，省去了解析优化等过程。

mybatis是通过`PreparedStatement`和占位符来实现预编译的。

mybatis底层使用`PreparedStatement`，默认情况下，将对所有的 sql 进行预编译，将#{}替换为?，然后将带有占位符?的sql模板发送至mysql服务器，由服务器对此无参数的sql进行编译后，将编译结果缓存，然后直接执行带有真实参数的sql。

预编译的作用：

1. 预编译阶段可以优化 sql 的执行。预编译之后的 sql 多数情况下可以直接执行，数据库服务器不需要再次编译，可以提升性能。
2. 预编译语句对象可以重复利用。把一个 sql 预编译后产生的 `PreparedStatement` 对象缓存下来，下次对于同一个sql，可以直接使用这个缓存的 PreparedState 对象。
3. 防止SQL注入。使用预编译，而其后注入的参数将`不会再进行SQL编译`。也就是说其后注入进来的参数系统将不会认为它会是一条SQL语句，而默认其是一个参数。

 ## 一级缓存和二级缓存

缓存：合理使用缓存是优化中最常见的方法之一，将从数据库中查询出来的数据放入缓存中，下次使用时不必从数据库查询，而是直接从缓存中读取，避免频繁操作数据库，减轻数据库的压力，同时提高系统性能。

**一级缓存是SqlSession级别的缓存**：Mybatis对缓存提供支持，默认情况下只开启一级缓存，一级缓存作用范围为同一个SqlSession。在SQL和参数相同的情况下，我们使用同一个SqlSession对象调用同一个Mapper方法，往往只会执行一次SQL。因为在使用SqlSession第一次查询后，Mybatis会将结果放到缓存中，以后再次查询时，如果没有声明需要刷新，并且缓存没超时的情况下，SqlSession只会取出当前缓存的数据，不会再次发送SQL到数据库。若使用不同的SqlSession，因为不同的SqlSession是相互隔离的，不会使用一级缓存。

**二级缓存是mapper级别的缓存**：可以使缓存在各个SqlSession之间共享。二级缓存默认不开启，需要在mybatis-config.xml开启二级缓存：

```xml
<!-- 通知 MyBatis 框架开启二级缓存 -->
<settings>
  <setting name="cacheEnabled" value="true"/>
</settings>
```

并在相应的Mapper.xml文件添加cache标签，表示对哪个mapper 开启缓存：

```xml
<cache/>
```

二级缓存要求返回的POJO必须是可序列化的，即要求实现Serializable接口。

当开启二级缓存后，数据的查询执行的流程就是 二级缓存 -> 一级缓存 -> 数据库。



![](http://img.dabin-coder.cn/image/20220612101342.png)
