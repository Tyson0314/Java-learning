---
sidebar: heading
title: SQL优化相关面试题
category: 数据库
tag:
  - MySQL
head:
  - - meta
    - name: keywords
      content: MySQL面试题,SQL优化,慢查询优化,索引失效,MySQL执行计划
  - - meta
    - name: description
      content: SQL优化常见知识点和面试题总结，让天下没有难背的八股文！
---

## 聊聊explain执行计划

使用 explain 输出 SELECT 语句执行的详细信息，包括以下信息：

- 表的加载顺序
- sql 的查询类型
- 可能用到哪些索引，实际上用到哪些索引
- 读取的行数

`Explain` 执行计划包含字段信息如下：分别是 `id`、`select_type`、`table`、`partitions`、`type`、`possible_keys`、`key`、`key_len`、`ref`、`rows`、`filtered`、`Extra` 12个字段。

通过explain extended + show warnings可以在原本explain的基础上额外提供一些查询优化的信息，得到优化以后的可能的查询语句（不一定是最终优化的结果）。

先搭建测试环境：

```sql
CREATE TABLE `blog` (
  `blog_id` int NOT NULL AUTO_INCREMENT COMMENT '唯一博文id--主键',
  `blog_title` varchar(255) NOT NULL COMMENT '博文标题',
  `blog_body` text NOT NULL COMMENT '博文内容',
  `blog_time` datetime NOT NULL COMMENT '博文发布时间',
  `update_time` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `blog_state` int NOT NULL COMMENT '博文状态--0 删除 1正常',
  `user_id` int NOT NULL COMMENT '用户id',
  PRIMARY KEY (`blog_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8

CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT COMMENT '用户唯一id--主键',
  `user_name` varchar(30) NOT NULL COMMENT '用户名--不能重复',
  `user_password` varchar(255) NOT NULL COMMENT '用户密码',
  PRIMARY KEY (`user_id`),
  KEY `name` (`user_name`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8

CREATE TABLE `discuss` (
  `discuss_id` int NOT NULL AUTO_INCREMENT COMMENT '评论唯一id',
  `discuss_body` varchar(255) NOT NULL COMMENT '评论内容',
  `discuss_time` datetime NOT NULL COMMENT '评论时间',
  `user_id` int NOT NULL COMMENT '用户id',
  `blog_id` int NOT NULL COMMENT '博文id',
  PRIMARY KEY (`discuss_id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8
```

**id**

表示查询中执行select子句或者操作表的顺序，**`id`的值越大，代表优先级越高，越先执行**。

```mysql
explain select discuss_body 
from discuss 
where blog_id = (
    select blog_id from blog where user_id = (
        select user_id from user where user_name = 'admin'));
```

三个表依次嵌套，发现最里层的子查询 `id`最大，最先执行。

![](http://img.topjavaer.cn/img/explain-id.png)

**select_type**

表示 `select` 查询的类型，主要是用于区分各种复杂的查询，例如：`普通查询`、`联合查询`、`子查询`等。

1. SIMPLE：表示最简单的 select 查询语句，在查询中不包含子查询或者交并差集等操作。
2. PRIMARY：查询中最外层的SELECT（存在子查询的外层的表操作为PRIMARY）。
3. SUBQUERY：子查询中首个SELECT。
4. DERIVED：被驱动的SELECT子查询（子查询位于FROM子句）。
5. UNION：在SELECT之后使用了UNION。

**table**

查询的表名，并不一定是真实存在的表，有别名显示别名，也可能为临时表。当from子句中有子查询时，table列是 `<derivenN>`的格式，表示当前查询依赖 id为N的查询，会先执行 id为N的查询。

![](http://img.topjavaer.cn/img/image-20210804083523885.png)

**partitions**

查询时匹配到的分区信息，对于非分区表值为`NULL`，当查询的是分区表时，`partitions`显示分区表命中的分区情况。

![](http://img.topjavaer.cn/img/image-20210802022931773.png)

**type**

查询使用了何种类型，它在 `SQL`优化中是一个非常重要的指标。

**system**

当表仅有一行记录时（系统表），数据量很少，往往不需要进行磁盘IO，速度非常快。比如，Mysql系统表proxies_priv在Mysql服务启动时候已经加载在内存中，对这个表进行查询不需要进行磁盘 IO。

![](http://img.topjavaer.cn/img/image-20210801233419732.png)

**const**

单表操作的时候，查询使用了主键或者唯一索引。

![](http://img.topjavaer.cn/img/explain-const.png)

**eq_ref**

**多表关联**查询的时候，主键和唯一索引作为关联条件。如下图的sql，对于user表（外循环）的每一行，user_role表（内循环）只有一行满足join条件，只要查找到这行记录，就会跳出内循环，继续外循环的下一轮查询。

![](http://img.topjavaer.cn/img/image-20210801232638027.png)

**ref**

查找条件列使用了索引而且不为主键和唯一索引。虽然使用了索引，但该索引列的值并不唯一，这样即使使用索引查找到了第一条数据，仍然不能停止，要在目标值附近进行小范围扫描。但它的好处是不需要扫全表，因为索引是有序的，即便有重复值，也是在一个非常小的范围内做扫描。

![](http://img.topjavaer.cn/img/explain-ref.png)

**ref_or_null**

类似 ref，会额外搜索包含`NULL`值的行。

**index_merge**

使用了索引合并优化方法，查询使用了两个以上的索引。新建comment表，id为主键，value_id为非唯一索引，执行`explain select content from comment where value_id = 1181000 and id > 1000;`，执行结果显示查询同时使用了id和value_id索引，type列的值为index_merge。

![](http://img.topjavaer.cn/img/image-20210802001215614.png)

**range**

有范围的索引扫描，相对于index的全索引扫描，它有范围限制，因此要优于index。像between、and、'>'、'<'、in和or都是范围索引扫描。

![](http://img.topjavaer.cn/img/explain-range.png)

**index**

index包括select索引列，order by主键两种情况。

1. order by主键。这种情况会按照索引顺序全表扫描数据，拿到的数据是按照主键排好序的，不需要额外进行排序。

   ![](http://img.topjavaer.cn/img/image-20210801225045980.png)

2. select索引列。type为index，而且extra字段为using index，也称这种情况为索引覆盖。所需要取的数据都在索引列，无需回表查询。

   ![](http://img.topjavaer.cn/img/image-20210801225942948.png)

**all**

全表扫描，查询没有用到索引，性能最差。

![](http://img.topjavaer.cn/img/explain-all.png)

**possible_keys**

此次查询中可能选用的索引。**但这个索引并不定一会是最终查询数据时所被用到的索引**。

**key**

此次查询中确切使用到的索引。

**ref**

`ref` 列显示使用哪个列或常数与`key`一起从表中选择数据行。常见的值有`const`、`func`、`NULL`、具体字段名。当 `key` 列为 `NULL`，即不使用索引时。如果值是`func`，则使用的值是某个函数的结果。

以下SQL的执行计划`ref`为`const`，因为使用了组合索引`(user_id, blog_id)`，`where user_id = 13`中13为常量。

```mysql
mysql> explain select blog_id from user_like where user_id = 13;
+----+-------------+-----------+------------+------+---------------+------+---------+-------+------+----------+-------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref   | rows | filtered | Extra       |
+----+-------------+-----------+------------+------+---------------+------+---------+-------+------+----------+-------------+
|  1 | SIMPLE      | user_like | NULL       | ref  | ul1,ul2       | ul1  | 4       | const |    2 |   100.00 | Using index |
+----+-------------+-----------+------------+------+---------------+------+---------+-------+------+----------+-------------+
```

而下面这个SQL的执行计划`ref`值为`NULL`，因为`key`为`NULL`，查询没有用到索引。

```mysql
mysql> explain select user_id from user_like where status = 1;
+----+-------------+-----------+------------+------+---------------+------+---------+------+------+----------+-------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
+----+-------------+-----------+------------+------+---------------+------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | user_like | NULL       | ALL  | NULL          | NULL | NULL    | NULL |    6 |    16.67 | Using where |
+----+-------------+-----------+------------+------+---------------+------+---------+------+------+----------+-------------+
```

**rows**

估算要找到所需的记录，需要读取的行数。评估`SQL` 性能的一个比较重要的数据，`mysql`需要扫描的行数，很直观的显示 `SQL` 性能的好坏，一般情况下 `rows` 值越小越好。

**filtered**

存储引擎返回的数据在经过过滤后，剩下满足条件的记录数量的比例。

**extra**

表示额外的信息说明。为了方便测试，这里新建两张表。

```sql
CREATE TABLE `t_order` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `order_id` int DEFAULT NULL,
  `order_status` tinyint DEFAULT NULL,
  `create_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_userid_order_id_createdate` (`user_id`,`order_id`,`create_date`)
) ENGINE=InnoDB AUTO_INCREMENT=99 DEFAULT CHARSET=utf8

CREATE TABLE `t_orderdetail` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `product_name` varchar(100) DEFAULT NULL,
  `cnt` int DEFAULT NULL,
  `create_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_orderid_productname` (`order_id`,`product_name`)
) ENGINE=InnoDB AUTO_INCREMENT=152 DEFAULT CHARSET=utf8
```

**1.using where**

查询的列未被索引覆盖，where筛选条件非索引的前导列。对存储引擎返回的结果进行过滤（Post-filter，后过滤），一般发生在MySQL服务器，而不是存储引擎层。

![](http://img.topjavaer.cn/img/image-20210802232729417.png)

**2.using index**

查询的列被索引覆盖，并且where筛选条件符合最左前缀原则，通过**索引查找**就能直接找到符合条件的数据，不需要回表查询数据。

![](http://img.topjavaer.cn/img/image-20210802232357282.png)

**3.Using where&Using index**

查询的列被索引覆盖，但无法通过索引查找找到符合条件的数据，不过可以通过**索引扫描**找到符合条件的数据，也不需要回表查询数据。

包括两种情况（组合索引为(user_id, orde)）：

- where筛选条件不符合最左前缀原则

  ![](http://img.topjavaer.cn/img/image-20210802233120283.png)

- where筛选条件是索引列前导列的一个范围

  ![](http://img.topjavaer.cn/img/image-20210802233455880.png)

**4.null**

查询的列未被索引覆盖，并且where筛选条件是索引的前导列，也就是用到了索引，但是部分字段未被索引覆盖，必须回表查询这些字段，Extra中为NULL。

![](http://img.topjavaer.cn/img/image-20210802234122321.png)

**5.using index condition**

索引下推（index condition pushdown，ICP），先使用where条件过滤索引，过滤完索引后找到所有符合索引条件的数据行，随后用 WHERE 子句中的其他条件去过滤这些数据行。

不使用ICP的情况（`set optimizer_switch='index_condition_pushdown=off'`），如下图，在步骤4中，没有使用where条件过滤索引：

![](http://img.topjavaer.cn/img/no-icp.png)

使用ICP的情况（`set optimizer_switch='index_condition_pushdown=on'`）：

![](http://img.topjavaer.cn/img/icp.png)

下面的例子使用了ICP：

```sql
explain select user_id, order_id, order_status  
from t_order where user_id > 1 and user_id < 5\G;
```

![](http://img.topjavaer.cn/img/image-20210803084617433.png)

关掉ICP之后（`set optimizer_switch='index_condition_pushdown=off'`），可以看到extra列为using where，不会使用索引下推。

![](http://img.topjavaer.cn/img/image-20210803084815503.png)

**6.using temporary**

使用了临时表保存中间结果，常见于 order by 和 group by 中。典型的，当group by和order by同时存在，且作用于不同的字段时，就会建立临时表，以便计算出最终的结果集。

**7.filesort**

文件排序。表示无法利用索引完成排序操作，以下情况会导致filesort：

- order by 的字段不是索引字段
- select 查询字段不全是索引字段
- select 查询字段都是索引字段，但是 order by 字段和索引字段的顺序不一致

![](http://img.topjavaer.cn/img/image-20210804084029239.png)

**8.using join buffer** 

Block Nested Loop，需要进行嵌套循环计算。两个关联表join，关联字段均未建立索引，就会出现这种情况。比如内层和外层的type均为ALL，rows均为4，需要循环进行4*4次计算。常见的优化方案是，在关联字段上添加索引，避免每次嵌套循环计算。

## 大表查询慢怎么优化？

某个表有近千万数据，查询比较慢，如何优化？

当MySQL单表记录数过大时，数据库的性能会明显下降，一些常见的优化措施如下：

* 合理建立索引。在合适的字段上建立索引，例如在WHERE和ORDER BY命令上涉及的列建立索引，可根据EXPLAIN来查看是否用了索引还是全表扫描
* 索引优化，SQL优化。最左匹配原则等，参考：https://topjavaer.cn/database/mysql.html#%E4%BB%80%E4%B9%88%E6%98%AF%E8%A6%86%E7%9B%96%E7%B4%A2%E5%BC%95
* 建立分区。对关键字段建立水平分区，比如时间字段，若查询条件往往通过时间范围来进行查询，能提升不少性能
* 利用缓存。利用Redis等缓存热点数据，提高查询效率
* 限定数据的范围。比如：用户在查询历史信息的时候，可以控制在一个月的时间范围内
* 读写分离。经典的数据库拆分方案，主库负责写，从库负责读
* 通过分库分表的方式进行优化，主要有垂直拆分和水平拆分
* 合理建立索引。在合适的字段上建立索引，例如在WHERE和ORDERBY命令上涉及的列建立索引

7. 数据异构到es
8. 冷热数据分离。几个月之前不常用的数据放到冷库中，最新的数据比较新的数据放到热库中
9. 升级数据库类型，换一种能兼容MySQL的数据库（OceanBase、tidb）

## 深分页怎么优化？

还是以上面的SQL为空：`select * from xxx order by id limit 500000, 10;`

**方法一**：

从上面的分析可以看出，当offset非常大时，server层会从引擎层获取到很多无用的数据，而当select后面是*号时，就需要拷贝完整的行信息，**拷贝完整数据**相比**只拷贝行数据里的其中一两个列字段**更耗费时间。

因为前面的offset条数据最后都是不要的，没有必要拷贝完整字段，所以可以将sql语句修改成：

```
select * from xxx  where id >=(select id from xxx order by id limit 500000, 1) order by id limit 10;
```

先执行子查询 `select id from xxx by id limit 500000, 1`, 这个操作，其实也是将在innodb中的主键索引中获取到`500000+1`条数据，然后server层会抛弃前500000条，只保留最后一条数据的id。

但不同的地方在于，在返回server层的过程中，只会拷贝数据行内的id这一列，而不会拷贝数据行的所有列，当数据量较大时，这部分的耗时还是比较明显的。

在拿到了上面的id之后，假设这个id正好等于500000，那sql就变成了

```
select * from xxx  where id >=500000 order by id limit 10;
```

这样innodb再走一次**主键索引**，通过B+树快速定位到id=500000的行数据，时间复杂度是lg(n)，然后向后取10条数据。

**方法二：**

将所有的数据**根据id主键进行排序**，然后分批次取，将当前批次的最大id作为下次筛选的条件进行查询。

```mysql
select * from xxx where id > start_id order by id limit 10;
```

通过主键索引，每次定位到start_id的位置，然后往后遍历10个数据，这样不管数据多大，查询性能都较为稳定。

## 导致MySQL慢查询有哪些原因？

1.  没有索引，或者索引失效。
2. 单表数据量太大
3. 查询使用了临时表
4. join 或者子查询过多
5. in元素过多。如果使用了in，即使后面的条件加了索引，还是要注意in后面的元素不要过多哈。in元素一般建议不要超过500个，如果超过了，建议分组，每次500一组进行。

## 索引什么时候会失效？

导致索引失效的情况：

- 对于组合索引，不是使用组合索引最左边的字段，则不会使用索引
- 以%开头的like查询如`%abc`，无法使用索引；非%开头的like查询如`abc%`，相当于范围查询，会使用索引
- 查询条件中列类型是字符串，没有使用引号，可能会因为类型不同发生隐式转换，使索引失效
- 判断索引列是否不等于某个值时
- 对索引列进行运算
- 查询条件使用`or`连接，也会导致索引失效
