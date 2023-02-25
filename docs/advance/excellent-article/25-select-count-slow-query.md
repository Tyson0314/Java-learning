---
sidebar: heading
title: SELECT COUNT(*) 会造成全表扫描？回去等通知吧
category: 优质文章
tag:
  - 数据库
head:
  - - meta
    - name: keywords
      content: count(*),全表扫描,执行计划
  - - meta
    - name: description
      content: 优质文章汇总
---


# SELECT COUNT(*) 会造成全表扫描？回去等通知吧

## 前言

SELECT COUNT(*)会不会导致全表扫描引起慢查询呢？

```
SELECT COUNT(*) FROM SomeTable
```

网上有一种说法，针对无 where_clause 的 **COUNT(\*)**，MySQL 是有优化的，优化器会选择成本最小的辅助索引查询计数，其实反而性能最高，这种说法对不对呢

针对这个疑问，我首先去生产上找了一个千万级别的表使用  EXPLAIN 来查询了一下执行计划

```
EXPLAIN SELECT COUNT(*) FROM SomeTable
```

结果如下

![](http://img.topjavaer.cn/img/select-count1.png)

如图所示: 发现确实此条语句在此例中用到的并不是主键索引，而是辅助索引，实际上在此例中我试验了，不管是 COUNT(1)，还是 COUNT(*)，MySQL 都会用**成本最小**的辅助索引查询方式来计数，也就是使用 COUNT(*) 由于 MySQL 的优化已经保证了它的查询性能是最好的！随带提一句，COUNT(*)是 SQL92 定义的标准统计行数的语法，并且效率高，所以请直接使用COUNT(*)查询表的行数！

所以这种说法确实是对的。但有个前提，在 MySQL 5.6 之后的版本中才有这种优化。

那么这个成本最小该怎么定义呢，有时候在 WHERE 中指定了多个条件，为啥最终 MySQL 执行的时候却选择了另一个索引，甚至不选索引？

本文将会给你答案，本文将会从以下两方面来分析

- SQL 选用索引的执行成本如何计算
- 实例说明

## SQL 选用索引的执行成本如何计算

就如前文所述，在有多个索引的情况下， 在查询数据前，MySQL 会选择成本最小原则来选择使用对应的索引，这里的成本主要包含两个方面。

- IO 成本: 即从磁盘把数据加载到内存的成本，默认情况下，读取数据页的 IO 成本是 1，MySQL 是以页的形式读取数据的，即当用到某个数据时，并不会只读取这个数据，而会把这个数据相邻的数据也一起读到内存中，这就是有名的程序局部性原理，所以 MySQL 每次会读取一整页，一页的成本就是 1。所以 IO 的成本主要和页的大小有关
- CPU 成本：将数据读入内存后，还要检测数据是否满足条件和排序等 CPU 操作的成本，显然它与行数有关，默认情况下，检测记录的成本是 0.2。

## 实例说明

为了根据以上两个成本来算出使用索引的最终成本，我们先准备一个表（以下操作基于 MySQL 5.7.18）

```
CREATE TABLE `person` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `score` int(11) NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `name_score` (`name`(191),`score`),
  KEY `create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

这个表除了主键索引之外，还有另外两个索引, name_score 及 create_time。然后我们在此表中插入 10 w 行数据，只要写一个存储过程调用即可，如下:

```
CREATE PROCEDURE insert_person()
begin
    declare c_id integer default 1;
    while c_id<=100000 do
    insert into person values(c_id, concat('name',c_id), c_id+100, date_sub(NOW(), interval c_id second));
    set c_id=c_id+1;
    end while;
end
```

插入之后我们现在使用 EXPLAIN 来计算下统计总行数到底使用的是哪个索引

```
EXPLAIN SELECT COUNT(*) FROM person
```

![图片](https://mmbiz.qpic.cn/mmbiz_png/OyweysCSeLXtag3Q38nMHUxszkvkXfFaXejKpeg0pWWQcs16SwlOR1o1Fo5nw1B2RCAME61LN3hH3E5uDQuicXQ/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

从结果上看它选择了 create_time 辅助索引，显然 MySQL 认为使用此索引进行查询成本最小，这也是符合我们的预期，使用辅助索引来查询确实是性能最高的！

我们再来看以下 SQL 会使用哪个索引

```
SELECT * FROM person WHERE NAME >'name84059' AND create_time>'2020-05-23 14:39:18' 
```

![图片](https://mmbiz.qpic.cn/mmbiz_png/OyweysCSeLXtag3Q38nMHUxszkvkXfFa4XR8ibNMfganIREu5JQF2bJYt0r7tZpYWdCcIaIW4emVC9SVWiajULYw/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

用了全表扫描！理论上应该用 name_score 或者 create_time 索引才对，从 WHERE 的查询条件来看确实都能命中索引，那是否是使用 **SELECT \*** 造成的回表代价太大所致呢，我们改成覆盖索引的形式试一下

```
SELECT create_time FROM person WHERE NAME >'name84059' AND create_time > '2020-05-23 14:39:18' 
```

结果 MySQL 依然选择了全表扫描！这就比较有意思了，理论上采用了覆盖索引的方式进行查找性能肯定是比全表扫描更好的，为啥 MySQL 选择了全表扫描呢，既然它认为全表扫描比使用覆盖索引的形式性能更好，那我们分别用这两者执行来比较下查询时间吧

```
-- 全表扫描执行时间: 4.0 ms
SELECT create_time FROM person WHERE NAME >'name84059' AND create_time>'2020-05-23 14:39:18' 

-- 使用覆盖索引执行时间: 2.0 ms
SELECT create_time FROM person force index(create_time) WHERE NAME >'name84059' AND create_time>'2020-05-23 14:39:18' 
```

从实际执行的效果看使用覆盖索引查询比使用全表扫描执行的时间快了一倍！说明 MySQL 在查询前做的成本估算不准！我们先来看看 MySQL 做全表扫描的成本有多少。

前面我们说了成本主要 IO 成本和 CPU 成本有关，对于全表扫描来说也就是分别和聚簇索引占用的页面数和表中的记录数。执行以下命令

```
SHOW TABLE STATUS LIKE 'person'
```

![图片](https://mmbiz.qpic.cn/mmbiz_png/OyweysCSeLXtag3Q38nMHUxszkvkXfFaBxFRZE5oFBbjrVryW8vMSG0GLuznuVA6vd69ZdEw09rmQYKaSy9S1Q/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

可以发现

1. 行数是 100264，我们不是插入了 10 w 行的数据了吗，怎么算出的数据反而多了，其实这里的计算是**估算**，也有可能这里的行数统计出来比 10 w 少了，估算方式有兴趣大家去网上查找，这里不是本文重点，就不展开了。得知行数，那我们知道 CPU 成本是 100264 * 0.2 = 20052.8。
2. 数据长度是 5783552，InnoDB 每个页面的大小是 16 KB，可以算出页面数量是 353。

也就是说全表扫描的成本是 20052.8 + 353 =  20406。

这个结果对不对呢，我们可以用一个工具验证一下。在 MySQL 5.6 及之后的版本中，我们可以用 optimizer trace 功能来查看优化器生成计划的整个过程 ，它列出了选择每个索引的执行计划成本以及最终的选择结果，我们可以依赖这些信息来进一步优化我们的 SQL。

optimizer_trace 功能使用如下

```
SET optimizer_trace="enabled=on";
SELECT create_time FROM person WHERE NAME >'name84059' AND create_time > '2020-05-23 14:39:18';
SELECT * FROM information_schema.OPTIMIZER_TRACE;
SET optimizer_trace="enabled=off";
```

执行之后我们主要观察使用 name_score，create_time 索引及全表扫描的成本。

先来看下使用 name_score 索引执行的的预估执行成本:

```
{
    "index": "name_score",
    "ranges": [
      "name84059 <= name"
    ],
    "index_dives_for_eq_ranges": true,
    "rows": 25372,
    "cost": 30447
}
```

可以看到执行成本为 30447，高于我们之前算出来的全表扫描成本：20406。所以没选择此索引执行

注意：这里的 30447 是查询二级索引的 IO 成本和 CPU 成本之和，再加上回表查询聚簇索引的 IO 成本和 CPU 成本之和。

再来看下使用 create_time 索引执行的的预估执行成本:

```
{
    "index": "create_time",
    "ranges": [
      "0x5ec8c516 < create_time"
    ],
    "index_dives_for_eq_ranges": true,
    "rows": 50132,
    "cost": 60159,
    "cause": "cost"
}
```

可以看到成本是 60159,远大于全表扫描成本 20406，自然也没选择此索引。

再来看计算出的全表扫描成本：

```
{
    "considered_execution_plans": [
      {
        "plan_prefix": [
        ],
        "table": "`person`",
        "best_access_path": {
          "considered_access_paths": [
            {
              "rows_to_scan": 100264,
              "access_type": "scan",
              "resulting_rows": 100264,
              "cost": 20406,
              "chosen": true
            }
          ]
        },
        "condition_filtering_pct": 100,
        "rows_for_plan": 100264,
        "cost_for_plan": 20406,
        "chosen": true
      }
    ]
}
```

注意看 cost：20406，与我们之前算出来的完全一样！这个值在以上三者算出的执行成本中最小，所以最终 MySQL 选择了用全表扫描的方式来执行此 SQL。

实际上 optimizer trace 详细列出了覆盖索引，回表的成本统计情况，有兴趣的可以去研究一下。

从以上分析可以看出， MySQL 选择的执行计划未必是最佳的，原因有挺多，就比如上文说的行数统计信息不准，再比如 MySQL 认为的最优跟我们认为不一样，我们可以认为执行时间短的是最优的，但 MySQL 认为的成本小未必意味着执行时间短。

## 总结

本文通过一个例子深入剖析了 MySQL 的执行计划是如何选择的，以及为什么它的选择未必是我们认为的最优的，这也提醒我们，在生产中如果有多个索引的情况，使用 WHERE 进行过滤未必会选中你认为的索引，我们可以提前使用  EXPLAIN, optimizer trace 来优化我们的查询语句。
