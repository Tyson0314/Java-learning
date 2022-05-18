<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [id](#id)
- [select_type](#select_type)
- [table](#table)
- [partitions](#partitions)
- [type](#type)
  - [system](#system)
  - [const](#const)
  - [eq_ref](#eq_ref)
  - [ref](#ref)
  - [ref_or_null](#ref_or_null)
  - [index_merge](#index_merge)
  - [range](#range)
  - [index](#index)
  - [all](#all)
- [possible_keys](#possible_keys)
- [key](#key)
- [ref](#ref-1)
- [rows](#rows)
- [filtered](#filtered)
- [extra](#extra)
  - [using where](#using-where)
  - [using index](#using-index)
  - [Using where&Using index](#using-whereusing-index)
  - [null](#null)
  - [using index condition](#using-index-condition)
  - [using temporary](#using-temporary)
  - [filesort](#filesort)
  - [using join buffer](#using-join-buffer)
- [参考资料](#%E5%8F%82%E8%80%83%E8%B5%84%E6%96%99)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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

##  id

表示查询中执行select子句或者操作表的顺序，**`id`的值越大，代表优先级越高，越先执行**。

```mysql
explain select discuss_body 
from discuss 
where blog_id = (
    select blog_id from blog where user_id = (
        select user_id from user where user_name = 'admin'));
```

三个表依次嵌套，发现最里层的子查询 `id`最大，最先执行。

![](https://raw.githubusercontent.com/Tyson0314/img/master/explain-id.png)

##  select_type

表示 `select` 查询的类型，主要是用于区分各种复杂的查询，例如：`普通查询`、`联合查询`、`子查询`等。

1. SIMPLE：表示最简单的 select 查询语句，在查询中不包含子查询或者交并差集等操作。
2. PRIMARY：查询中最外层的SELECT（存在子查询的外层的表操作为PRIMARY）。
3. SUBQUERY：子查询中首个SELECT。
4. DERIVED：被驱动的SELECT子查询（子查询位于FROM子句）。
5. UNION：在SELECT之后使用了UNION。

##  table

查询的表名，并不一定是真实存在的表，有别名显示别名，也可能为临时表。当from子句中有子查询时，table列是 `<derivenN>`的格式，表示当前查询依赖 id为N的查询，会先执行 id为N的查询。

![](https://raw.githubusercontent.com/Tyson0314/img/master/image-20210804083523885.png)

##  partitions

查询时匹配到的分区信息，对于非分区表值为`NULL`，当查询的是分区表时，`partitions`显示分区表命中的分区情况。

![](https://raw.githubusercontent.com/Tyson0314/img/master/image-20210802022931773.png)

##  type

查询使用了何种类型，它在 `SQL`优化中是一个非常重要的指标。

### system

当表仅有一行记录时（系统表），数据量很少，往往不需要进行磁盘IO，速度非常快。比如，Mysql系统表proxies_priv在Mysql服务启动时候已经加载在内存中，对这个表进行查询不需要进行磁盘 IO。

![](https://raw.githubusercontent.com/Tyson0314/img/master/image-20210801233419732.png)

### const

单表操作的时候，查询使用了主键或者唯一索引。

![](https://raw.githubusercontent.com/Tyson0314/img/master/explain-const.png)

### eq_ref

**多表关联**查询的时候，主键和唯一索引作为关联条件。如下图的sql，对于user表（外循环）的每一行，user_role表（内循环）只有一行满足join条件，只要查找到这行记录，就会跳出内循环，继续外循环的下一轮查询。

![](https://raw.githubusercontent.com/Tyson0314/img/master/image-20210801232638027.png)

### ref

查找条件列使用了索引而且不为主键和唯一索引。虽然使用了索引，但该索引列的值并不唯一，这样即使使用索引查找到了第一条数据，仍然不能停止，要在目标值附近进行小范围扫描。但它的好处是不需要扫全表，因为索引是有序的，即便有重复值，也是在一个非常小的范围内做扫描。

![](https://raw.githubusercontent.com/Tyson0314/img/master/explain-ref.png)

### ref_or_null

类似 ref，会额外搜索包含`NULL`值的行。

### index_merge

使用了索引合并优化方法，查询使用了两个以上的索引。新建comment表，id为主键，value_id为非唯一索引，执行`explain select content from comment where value_id = 1181000 and id > 1000;`，执行结果显示查询同时使用了id和value_id索引，type列的值为index_merge。

![](https://raw.githubusercontent.com/Tyson0314/img/master/image-20210802001215614.png)

### range

有范围的索引扫描，相对于index的全索引扫描，它有范围限制，因此要优于index。像between、and、'>'、'<'、in和or都是范围索引扫描。

![](https://raw.githubusercontent.com/Tyson0314/img/master/explain-range.png)

### index

index包括select索引列，order by主键两种情况。

1. order by主键。这种情况会按照索引顺序全表扫描数据，拿到的数据是按照主键排好序的，不需要额外进行排序。

   ![](https://raw.githubusercontent.com/Tyson0314/img/master/image-20210801225045980.png)

2. select索引列。type为index，而且extra字段为using index，也称这种情况为索引覆盖。所需要取的数据都在索引列，无需回表查询。

   ![](https://raw.githubusercontent.com/Tyson0314/img/master/image-20210801225942948.png)

### all

全表扫描，查询没有用到索引，性能最差。

![](https://raw.githubusercontent.com/Tyson0314/img/master/explain-all.png)

##  possible_keys

此次查询中可能选用的索引。**但这个索引并不定一会是最终查询数据时所被用到的索引**。

##  key

此次查询中确切使用到的索引。

## ref

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

##  rows

估算要找到所需的记录，需要读取的行数。评估`SQL` 性能的一个比较重要的数据，`mysql`需要扫描的行数，很直观的显示 `SQL` 性能的好坏，一般情况下 `rows` 值越小越好。

##  filtered

存储引擎返回的数据在经过过滤后，剩下满足条件的记录数量的比例。

##  extra

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

### using where

查询的列未被索引覆盖，where筛选条件非索引的前导列。对存储引擎返回的结果进行过滤（Post-filter，后过滤），一般发生在MySQL服务器，而不是存储引擎层。

![](https://raw.githubusercontent.com/Tyson0314/img/master/image-20210802232729417.png)

### using index

查询的列被索引覆盖，并且where筛选条件符合最左前缀原则，通过**索引查找**就能直接找到符合条件的数据，不需要回表查询数据。

![](https://raw.githubusercontent.com/Tyson0314/img/master/image-20210802232357282.png)

### Using where&Using index

查询的列被索引覆盖，但无法通过索引查找找到符合条件的数据，不过可以通过**索引扫描**找到符合条件的数据，也不需要回表查询数据。

包括两种情况（组合索引为(user_id, orde)）：

- where筛选条件不符合最左前缀原则

  ![](https://raw.githubusercontent.com/Tyson0314/img/master/image-20210802233120283.png)

- where筛选条件是索引列前导列的一个范围

  ![](https://raw.githubusercontent.com/Tyson0314/img/master/image-20210802233455880.png)

### null

查询的列未被索引覆盖，并且where筛选条件是索引的前导列，也就是用到了索引，但是部分字段未被索引覆盖，必须回表查询这些字段，Extra中为NULL。

![](https://raw.githubusercontent.com/Tyson0314/img/master/image-20210802234122321.png)

### using index condition

索引下推（index condition pushdown，ICP），先使用where条件过滤索引，过滤完索引后找到所有符合索引条件的数据行，随后用 WHERE 子句中的其他条件去过滤这些数据行。

不使用ICP的情况（`set optimizer_switch='index_condition_pushdown=off'`），如下图，在步骤4中，没有使用where条件过滤索引：

![](https://raw.githubusercontent.com/Tyson0314/img/master/no-icp.png)

使用ICP的情况（`set optimizer_switch='index_condition_pushdown=on'`）：

![](https://raw.githubusercontent.com/Tyson0314/img/master/icp.png)

下面的例子使用了ICP：

```sql
explain select user_id, order_id, order_status  
from t_order where user_id > 1 and user_id < 5\G;
```

![](https://raw.githubusercontent.com/Tyson0314/img/master/image-20210803084617433.png)

关掉ICP之后（`set optimizer_switch='index_condition_pushdown=off'`），可以看到extra列为using where，不会使用索引下推。

![](https://raw.githubusercontent.com/Tyson0314/img/master/image-20210803084815503.png)

### using temporary

使用了临时表保存中间结果，常见于 order by 和 group by 中。典型的，当group by和order by同时存在，且作用于不同的字段时，就会建立临时表，以便计算出最终的结果集。

### filesort

文件排序。表示无法利用索引完成排序操作，以下情况会导致filesort：

- order by 的字段不是索引字段
- select 查询字段不全是索引字段
- select 查询字段都是索引字段，但是 order by 字段和索引字段的顺序不一致

![](https://raw.githubusercontent.com/Tyson0314/img/master/image-20210804084029239.png)

### using join buffer 

Block Nested Loop，需要进行嵌套循环计算。两个关联表join，关联字段均未建立索引，就会出现这种情况。比如内层和外层的type均为ALL，rows均为4，需要循环进行4*4次计算。常见的优化方案是，在关联字段上添加索引，避免每次嵌套循环计算。



## 参考资料

- [Explain执行计划](https://juejin.cn/post/6844904163969630221#heading-7)
- [索引下推例子](https://www.cnblogs.com/Chenjiabing/p/12600926.html) | [索引下推图解](https://www.cnblogs.com/zengkefu/p/5684101.html) | [索引下推优化](https://www.cnblogs.com/zengkefu/p/5684101.html)

