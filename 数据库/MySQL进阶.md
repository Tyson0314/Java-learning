<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [事务特性](#%E4%BA%8B%E5%8A%A1%E7%89%B9%E6%80%A7)
- [事务隔离级别](#%E4%BA%8B%E5%8A%A1%E9%9A%94%E7%A6%BB%E7%BA%A7%E5%88%AB)
- [索引](#%E7%B4%A2%E5%BC%95)
  - [什么是索引？](#%E4%BB%80%E4%B9%88%E6%98%AF%E7%B4%A2%E5%BC%95)
  - [索引的优缺点？](#%E7%B4%A2%E5%BC%95%E7%9A%84%E4%BC%98%E7%BC%BA%E7%82%B9)
  - [索引的作用](#%E7%B4%A2%E5%BC%95%E7%9A%84%E4%BD%9C%E7%94%A8)
  - [B+ 树](#b-%E6%A0%91)
  - [索引实例](#%E7%B4%A2%E5%BC%95%E5%AE%9E%E4%BE%8B)
  - [索引分类](#%E7%B4%A2%E5%BC%95%E5%88%86%E7%B1%BB)
  - [最左匹配](#%E6%9C%80%E5%B7%A6%E5%8C%B9%E9%85%8D)
  - [聚集索引](#%E8%81%9A%E9%9B%86%E7%B4%A2%E5%BC%95)
  - [覆盖索引](#%E8%A6%86%E7%9B%96%E7%B4%A2%E5%BC%95)
  - [索引失效](#%E7%B4%A2%E5%BC%95%E5%A4%B1%E6%95%88)
- [存储引擎](#%E5%AD%98%E5%82%A8%E5%BC%95%E6%93%8E)
  - [InnoDB](#innodb)
  - [MyISAM](#myisam)
  - [MEMORY](#memory)
  - [MyISAM和InnoDB区别](#myisam%E5%92%8Cinnodb%E5%8C%BA%E5%88%AB)
- [MVCC](#mvcc)
  - [实现原理](#%E5%AE%9E%E7%8E%B0%E5%8E%9F%E7%90%86)
  - [read view](#read-view)
  - [数据访问流程](#%E6%95%B0%E6%8D%AE%E8%AE%BF%E9%97%AE%E6%B5%81%E7%A8%8B)
  - [快照读和当前读](#%E5%BF%AB%E7%85%A7%E8%AF%BB%E5%92%8C%E5%BD%93%E5%89%8D%E8%AF%BB)
  - [select 读取锁定](#select-%E8%AF%BB%E5%8F%96%E9%94%81%E5%AE%9A)
- [分库分表](#%E5%88%86%E5%BA%93%E5%88%86%E8%A1%A8)
  - [垂直划分](#%E5%9E%82%E7%9B%B4%E5%88%92%E5%88%86)
  - [水平划分](#%E6%B0%B4%E5%B9%B3%E5%88%92%E5%88%86)
- [日志](#%E6%97%A5%E5%BF%97)
  - [bin log](#bin-log)
  - [redo log](#redo-log)
  - [undo Log](#undo-log)
  - [查询日志](#%E6%9F%A5%E8%AF%A2%E6%97%A5%E5%BF%97)
- [MySQL架构](#mysql%E6%9E%B6%E6%9E%84)
  - [Server 层基本组件](#server-%E5%B1%82%E5%9F%BA%E6%9C%AC%E7%BB%84%E4%BB%B6)
    - [语法解析器和预处理](#%E8%AF%AD%E6%B3%95%E8%A7%A3%E6%9E%90%E5%99%A8%E5%92%8C%E9%A2%84%E5%A4%84%E7%90%86)
    - [查询优化器](#%E6%9F%A5%E8%AF%A2%E4%BC%98%E5%8C%96%E5%99%A8)
    - [查询执行引擎](#%E6%9F%A5%E8%AF%A2%E6%89%A7%E8%A1%8C%E5%BC%95%E6%93%8E)
  - [查询语句执行流程](#%E6%9F%A5%E8%AF%A2%E8%AF%AD%E5%8F%A5%E6%89%A7%E8%A1%8C%E6%B5%81%E7%A8%8B)
  - [更新语句执行过程](#%E6%9B%B4%E6%96%B0%E8%AF%AD%E5%8F%A5%E6%89%A7%E8%A1%8C%E8%BF%87%E7%A8%8B)
- [慢查询](#%E6%85%A2%E6%9F%A5%E8%AF%A2)
  - [mysqldumpslow](#mysqldumpslow)
- [分区表](#%E5%88%86%E5%8C%BA%E8%A1%A8)
  - [分区表类型](#%E5%88%86%E5%8C%BA%E8%A1%A8%E7%B1%BB%E5%9E%8B)
  - [分区的问题](#%E5%88%86%E5%8C%BA%E7%9A%84%E9%97%AE%E9%A2%98)
  - [查询优化](#%E6%9F%A5%E8%AF%A2%E4%BC%98%E5%8C%96)
- [其他](#%E5%85%B6%E4%BB%96)
  - [processlist](#processlist)
  - [exist和in](#exist%E5%92%8Cin)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

> PS：本文已经收录到github仓库，此仓库用于分享Java核心知识，包括Java基础、MySQL、SpringBoot、Mybatis、Redis、RabbitMQ等等，面试必备。
>
> github地址：https://github.com/Tyson0314/Java-learning
> 如果github访问不了，可以访问gitee仓库。
> gitee地址：https://gitee.com/tysondai/Java-learning

## 事务特性

事务特性：原子性（Atomicity）、一致性（Consistency）、隔离性（Isolation）、持久性（Durability）。

- 原子性是指事务包含的所有操作要么全部成功，要么全部失败回滚。
- 一致性是指一个事务执行之前和执行之后都必须处于一致性状态。比如a与b账户共有1000块，两人之间转账之后无论成功还是失败，它们的账户总和还是1000。
- 隔离性。跟隔离级别相关，如read committed，一个事务只能读到已经提交的修改。
- 持久性是指一个事务一旦被提交了，那么对数据库中的数据的改变就是永久性的，即便是在数据库系统遇到故障的情况下也不会丢失提交事务的操作。



## 事务隔离级别

先了解下几个概念：脏读、不可重复读、幻读。

- 脏读是指在一个事务处理过程里读取了另一个未提交的事务中的数据。
- 不可重复读是指在对于数据库中的某行记录，一个事务范围内多次查询却返回了不同的数据值，这是由于在查询间隔，另一个事务修改了数据并提交了。
- 幻读是当某个事务在读取某个范围内的记录时，另外一个事务又在该范围内插入了新的记录，当之前的事务再次读取该范围的记录时，会产生幻行，就像产生幻觉一样，这就是发生了幻读。

不可重复读和脏读的区别是，脏读是某一事务读取了另一个事务未提交的脏数据，而不可重复读则是读取了前一事务提交的数据。
幻读和不可重复读都是读取了另一条已经提交的事务，不同的是不可重复读的重点是修改，幻读的重点在于新增或者删除。

事务隔离就是为了解决上面提到的脏读、不可重复读、幻读这几个问题。

MySQL数据库为我们提供的四种隔离级别：

- Serializable (串行化)：通过强制事务排序，使之不可能相互冲突，从而解决幻读问题。
-  Repeatable read (可重复读)：MySQL的默认事务隔离级别，它确保同一事务的多个实例在并发读取数据时，会看到同样的数据行，解决了不可重复读的问题。
-  Read committed (读已提交)：一个事务只能看见已经提交事务所做的改变。可避免脏读的发生。
- Read uncommitted (读未提交)：所有事务都可以看到其他未提交事务的执行结果。

查看隔离级别：

```mysql
select @@transaction_isolation;
```

设置隔离级别：

```mysql
set session transaction isolation level read uncommitted;
```



## 索引

### 什么是索引？

索引是存储引擎用于提高数据库表的访问速度的一种数据结构。

### 索引的优缺点？

特点：1、避免进行数据库全表的扫描，大多数情况，只需要扫描较少的索引页和数据页；提升查询语句的执行效率，但降低了新增、删除操作的速度，同时也会占用额外的存储空间。

### 索引的作用

数据是存储在磁盘上的，查询数据时，如果没有索引，会加载所有的数据到内存，依次进行检索，读取磁盘次数较多。有了索引，就不需要加载所有数据，因为B+树的高度一般在2-4层，最多只需要读取2-4次磁盘，查询速度大大提升。

什么情况下需要建索引：

1. 经常用于查询的字段
2. 经常用于连接的字段（如外键）建立索引，可以加快连接的速度
3. 经常需要排序的字段建立索引，因为索引已经排好序，可以加快排序查询速度

什么情况下不建索引？

1. where条件中用不到的字段不适合建立索引
2. 表记录较少
3. 需要经常增删改
4. 参与列计算的列不适合建索引
5. 区分度不高的字段不适合建立索引，性别等

### B+ 树

B+ 树是基于B 树和叶子节点顺序访问指针进行实现，它具有B树的平衡性，并且通过顺序访问指针来提高区间查询的性能。

在 B+ 树中，节点中的 key 从左到右递增排列，如果某个指针的左右相邻 key 分别是 key<sub>i</sub> 和 key<sub>i+1</sub>，则该指针指向节点的所有 key 大于等于 key<sub>i</sub> 且小于等于 key<sub>i+1</sub>。

![](https://raw.githubusercontent.com/Tyson0314/img/master/image-20210821165019147.png)

进行查找操作时，首先在根节点进行二分查找，找到key所在的指针，然后递归地在指针所指向的节点进行查找。直到查找到叶子节点，然后在叶子节点上进行二分查找，找出 key 所对应的数据项。

MySQL 数据库使用最多的索引类型是BTREE索引，底层基于B+树数据结构来实现。

```mysql
mysql> show index from blog\G;
*************************** 1. row ***************************
        Table: blog
   Non_unique: 0
     Key_name: PRIMARY
 Seq_in_index: 1
  Column_name: blog_id
    Collation: A
  Cardinality: 4
     Sub_part: NULL
       Packed: NULL
         Null:
   Index_type: BTREE
      Comment:
Index_comment:
      Visible: YES
   Expression: NULL
```

### 索引实例

下面来看看一个索引的例子：

如下图，col1 是主键，col2和col3是普通字段。

![](https://raw.githubusercontent.com/Tyson0314/img/master/image-20200520234137916.png)

下图是主键索引对应的 B+树结构，每个节点对应磁盘的一页。

![](https://raw.githubusercontent.com/Tyson0314/img/master/image-20200520234200868.png)

对col3 建立一个单列索引，对应的B+树结构：

![](https://raw.githubusercontent.com/Tyson0314/img/master/image-20200520234231001.png)

### 索引分类
1. 主键索引：名为primary的唯一非空索引，不允许有空值。

2. 唯一索引：索引列中的值必须是唯一的，但是允许为空值。

   唯一索引和主键索引的区别是：UNIQUE 约束的列可以为null且可以存在多个null值。UNIQUE KEY的用途：唯一标识数据库表中的每条记录，主要是用来防止数据重复插入。

   创建唯一索引：

   ```mysql
   ALTER TABLE table_name
   ADD CONSTRAINT constraint_name UNIQUE KEY(column_1,column_2,...);
   ```

3. 组合索引：在表中的多个字段组合上创建的索引，只有在查询条件中使用了这些字段的左边字段时，索引才会被使用，使用组合索引时遵循最左前缀原则。

4. 全文索引：全文索引，只有在MyISAM引擎上才能使用，只能在CHAR,VARCHAR,TEXT类型字段上使用全文索引。

### 最左匹配

如果 SQL 语句中用到了组合索引中的最左边的索引，那么这条 SQL 语句就可以利用这个组合索引去进行匹配。当遇到范围查询(>、<、between、like)就会停止匹配，后面的字段不会用到索引。

对(a,b,c)建立索引，查询条件使用 a/ab/abc 会走索引，使用 bc 不会走索引。

对(a,b,c,d)建立索引，查询条件为`a = 1 and b = 2 and c > 3 and d = 4`，那么，a,b,c三个字段能用到索引，而d就匹配不到。因为遇到了范围查询！

对(a, b) 建立索引，a 在索引树中是全局有序的，而 b 是全局无序，局部有序（当a相等时，会对b进行比较排序）。直接执行`b = 2`这种查询条件没有办法利用索引。

![最左匹配](https://raw.githubusercontent.com/Tyson0314/img/master/image-20210821103313578.png)

从局部来看，当a的值确定的时候，b是有序的。例如a = 1时，b值为1，2是有序的状态。当a=2时候，b的值为1,4也是有序状态。 因此，你执行`a = 1 and b = 2`是a,b字段能用到索引的。而你执行`a > 1 and b = 2`时，a字段能用到索引，b字段用不到索引。因为a的值此时是一个范围，不是固定的，在这个范围内b值不是有序的，因此b字段用不上索引。

### 聚集索引

InnoDB使用表的主键构造主键索引树，同时叶子节点中存放的即为整张表的记录数据。聚集索引叶子节点的存储是逻辑上连续的，使用双向链表连接，叶子节点按照主键的顺序排序，因此对于主键的排序查找和范围查找速度比较快。

聚集索引的叶子节点就是整张表的行记录。InnoDB 主键使用的是聚簇索引。聚集索引要比非聚集索引查询效率高很多。

![](https://raw.githubusercontent.com/Tyson0314/img/master/mysql-clustered-index.png)

对于InnoDB来说，聚集索引一般是表中的主键索引，如果表中没有显示指定主键，则会选择表中的第一个不允许为NULL的唯一索引。如果没有主键也没有合适的唯一索引，那么innodb内部会生成一个隐藏的主键作为聚集索引，这个隐藏的主键长度为6个字节，它的值会随着数据的插入自增。

### 覆盖索引

select的数据列只用从索引中就能够取得，不需要到数据表进行二次查询，换句话说查询列要被所使用的索引覆盖。对于innodb表的二级索引，如果索引能覆盖到查询的列，那么就可以避免对主键索引的二次查询。

不是所有类型的索引都可以成为覆盖索引。覆盖索引要存储索引列的值，而哈希索引、全文索引不存储索引列的值，所以MySQL只能使用b+树索引做覆盖索引。

 对于使用了覆盖索引的查询，在查询前面使用explain，输出的extra列会显示为using index。

比如user_like 用户点赞表，组合索引为(user_id, blog_id)，user_id和blog_id都不为null。

```mysql
explain select blog_id from user_like where user_id = 13;
```

Extra中为`Using index`，查询的列被索引覆盖，并且where筛选条件符合最左前缀原则，通过**索引查找**就能直接找到符合条件的数据，不需要回表查询数据。

```mysql
explain select user_id from user_like where blog_id = 1;
```

Extra中为`Using where; Using index`， 查询的列被索引覆盖，where筛选条件不符合最左前缀原则，无法通过索引查找找到符合条件的数据，但可以通过**索引扫描**找到符合条件的数据，也不需要回表查询数据。

![](https://raw.githubusercontent.com/Tyson0314/img/master/cover-index.png)

### 索引失效

导致索引失效的情况：

- 对于组合索引，不是使用组合索引最左边的字段，则不会使用索引
- 以%开头的like查询如`%abc`，无法使用索引；非%开头的like查询如`abc%`，相当于范围查询，会使用索引
- 查询条件中列类型是字符串，没有使用引号，可能会因为类型不同发生隐式转换，使索引失效
- 判断索引列是否不等于某个值时
- 对索引列进行运算
- 使用or连接的条件，如果左边的字段有索引，右边的字段没有索引，那么左边的索引会失效

对于Java选手来说，基础知识非常重要，这里给大家分享一个超全面的Java知识总结，GitHub标星137k+，非常有用！

![](https://pic3.zhimg.com/v2-cdfb49d3d6562191415ae9771055807a.jpg)

有需要的小伙伴可以自行下载：

http://mp.weixin.qq.com/s?__biz=Mzg2OTY1NzY0MQ==&mid=100000392&idx=1&sn=f6c8e84651ce48f6ef5b0d496f0f6adf&chksm=4e98ffce79ef76d8dcebdc4787ae8b37760ec193574da9036e46954ae8954ebd56c78792726f#rd

## 存储引擎

MySQL 5.5版本后默认的存储引擎为InnoDB。

### InnoDB
InnoDB是MySQL默认的事务型存储引擎，使用最广泛，基于聚簇索引建立的。InnoDB内部做了很多优化，如能够自动在内存中创建自适应hash索引，以加速读操作。

**优点**：支持事务和崩溃修复能力。InnoDB引入了行级锁和外键约束。

**缺点**：占用的数据空间相对较大。

**适用场景**：需要事务支持，并且有较高的并发读写频率。

### MyISAM

数据以紧密格式存储。对于只读数据，或者表比较小、可以容忍修复操作，可以使用MyISAM引擎。MyISAM会将表存储在两个文件中，数据文件.MYD和索引文件.MYI。

**优点**：访问速度快。

**缺点**：MyISAM不支持事务和行级锁，不支持崩溃后的安全恢复，也不支持外键。

**适用场景**：对事务完整性没有要求；只读的数据，或者表比较小，可以忍受修复repair操作。

MyISAM特性：

1. MyISAM对整张表加锁，而不是针对行。读取数据时会对需要读到的所有表加共享锁，写入时则对表加排它锁。但在读取表记录的同时，可以往表中插入新的记录（并法插入）。
2. 对于MyISAM表，MySQL可以手动或者自动执行检查和修复操作。执行表的修复可能会导致数据丢失，而且修复操作非常慢。可以通过`CHECK TABLE tablename`检查表的错误，如果有错误执行`REPAIR TABLE tablename`进行修复。

### MEMORY
MEMORY引擎将数据全部放在内存中，访问速度较快，但是一旦系统奔溃的话，数据都会丢失。

MEMORY引擎默认使用哈希索引，将键的哈希值和指向数据行的指针保存在哈希索引中。哈希索引使用拉链法来处理哈希冲突。

**优点**：访问速度较快。

**缺点**：

1. 哈希索引数据不是按照索引值顺序存储，无法用于排序。
2. 不支持部分索引匹配查找，因为哈希索引是使用索引列的全部内容来计算哈希值的。
3. 只支持等值比较，不支持范围查询。
4. 当出现哈希冲突时，存储引擎需要遍历链表中所有的行指针，逐行进行比较，直到找到符合条件的行。

### MyISAM和InnoDB区别

1. **是否支持行级锁** : MyISAM 只有表级锁，而InnoDB 支持行级锁和表级锁，默认为行级锁。

2. **是否支持事务和崩溃后的安全恢复**： MyISAM 强调的是性能，每次查询具有原子性，其执行速度比InnoDB类型更快，但是不提供事务支持。但是InnoDB 提供事务支持，具有事务、回滚和崩溃修复能力。

3. **是否支持外键：** MyISAM不支持，而InnoDB支持。

4. **是否支持MVCC** ：仅 InnoDB 支持。应对高并发事务，MVCC比单纯的加锁更高效；MVCC只在 `READ COMMITTED` 和 `REPEATABLE READ` 两个隔离级别下工作；MVCC可以使用乐观锁和悲观锁来实现；各数据库中MVCC实现并不统一。

5. MyISAM不支持聚集索引，InnoDB支持聚集索引。

   myisam引擎主键索引和其他索引区别不大，叶子节点都包含索引值和行指针。
   innodb引擎二级索引叶子存储的是索引值和主键值（不是行指针），这样可以减少行移动和数据页分裂时二级索引的维护工作。

   ![myisam-innodb-index](https://raw.githubusercontent.com/Tyson0314/img/master/myisam-innodb-index.png)



## MVCC

MVCC(`Multiversion concurrency control`) 就是同一份数据保留多版本的一种方式，进而实现并发控制。可以认为MVCC是行级锁的变种。在查询的时候，通过read view和版本链找到对应版本的数据。

MVCC只适用于read committed和repeatable read。使用事务更新行记录时，会生成一个新的版本的行记录。

作用：提升并发性能。对于高并发场景，MVCC比行级锁更有效、开销更小。

### 实现原理

mvcc实现依赖于版本链，版本链是通过表的三个隐藏字段实现。

- 事务id：data_trx_id，当前事务id

- 回滚指针：data_roll_ptr，指向当前行记录的上一个版本，通过这个指针将数据的多个版本连接在一起构成undo log版本链

- 主键：db_row_id，如果数据表没有主键，InnoDB会自动生成主键

使用事务更新行记录的时候，就会生成版本链：

1. 用排他锁锁住该行；
2. 将该行原本的值拷贝到 undo log，作为旧版本用于回滚；
3. 修改当前行的值，生成一个新版本，更新事务id，使回滚指针指向旧版本的记录，这样就形成一条版本链；
4. 记录redo log；

![](https://raw.githubusercontent.com/Tyson0314/img/master/mvcc-impl.png)

### read view

read view就是在某一时刻给事务打snapshot快照。在read_view内部维护一个活跃事务链表，这个链表包含在创建read view之前还未提交的事务，不包含创建read view之后提交的事务。

不同隔离级别创建read view的时机不同。

read committed：每次执行select都会创建新的read_view，保证能读取到其他事务已经提交的修改。

repeatable read：在一个事务范围内，第一次select时更新这个read_view，以后不会再更新，后续所有的select都是复用之前的read_view。这样可以保证事务范围内每次读取的内容都一样，即可重复读。

### 数据访问流程

当访问数据行时，会先判断当前版本数据项是否可见，如果是不可见的，会通过版本链找到一个可见的版本。

- 如果数据行的当前版本 < read view最早的活跃事务id：说明在创建read_view时，修改该数据行的事务已提交，该版本的数据行可被当前事务读取到。
- 如果数据行的当前版本 >= read view最晚的活跃事务id：说明当前版本的数据行的事务是在创建read_view之后生成的，该版本的数据行不可以被当前事务访问。此时需要通过版本链找到上一个版本，然后重新判断该版本数据对当前事务的可见性。
- 如果数据行的当前版本在最早的活跃事务id和最晚的活跃事务id之间：
  1. 需要在活跃事务链表中查找是否包含该数据行的最新事务id，即生成当前版本数据行的事务是否已经提交。
  2. 如果存在，说明生成当前版本数据行的事务未提交，所以该版本的数据行不能被当前事务访问。此时需要通过版本链找到上一个版本，然后重新判断该版本的可见性。
  3. 如果不存在，说明事务已经提交，可以直接读取该数据行。

**总结**：通过比较read view和数据行的当前版本，找到当前事务可见的版本，进而实现read commit和repeatable read的事务隔离级别。

### 快照读和当前读

记录的两种读取方式。

快照读：读取的是快照版本，也就是历史版本。普通的SELECT就是快照读。通过MVCC来进行控制的，不用加锁。

当前读：读取的是最新版本。UPDATE、DELETE、INSERT、SELECT … LOCK IN SHARE MODE、SELECT … FOR UPDATE是当前读。

快照读情况下，InnoDB通过mvcc机制避免了幻读现象。而mvcc机制无法避免当前读情况下出现的幻读现象。

事务a和事务b同时开启事务，事务a插入数据然后提交，事务b执行全表的update，然后执行查询，查到了事务A中添加的数据。

![](https://raw.githubusercontent.com/Tyson0314/img/master/幻读1.png)

MySQL如何实现避免幻读:

- 在快照读情况下，MySQL通过mvcc来避免幻读。
- 在当前读情况下，MySQL通过next-key来避免幻读（加行锁和间隙锁来实现的）。

![](https://raw.githubusercontent.com/Tyson0314/img/master/current-read.png)

next-key包括两部分：行锁和间隙锁。行锁是加在索引上的锁，间隙锁是加在索引之间的。

```mysql
select * from table where id<6 lock in share mode;--共享锁 锁定的是小于6的行和等于6的行
select * from table where id<6 for update;--排他锁
```

实际上很多的项目中是不会使用到上面的两种方法的，串行化读的性能太差，而且其实幻读很多时候是我们完全可以接受的。

Serializable隔离级别也可以避免幻读，会锁住整张表，并发性极低，一般很少使用。

### select 读取锁定

在SELECT 的读取锁定主要分为两种方式：共享锁和排他锁。

```mysql
SELECT ... LOCK IN SHARE MODE　
SELECT ... FOR UPDATE
```

这两种方式主要的不同在于LOCK IN SHARE MODE 多个事务同时更新同一个表单时很容易造成死锁。这种情况最好使用SELECT ...FOR UPDATE。

`select * from goods where id = 1 for update`：申请排他锁的前提是，没有线程对该结果集的任何行数据使用排它锁或者共享锁，否则申请会受到阻塞。在进行事务操作时，MySQL会对查询结果集的每行数据添加排它锁，其他线程对这些数据的更改或删除操作会被阻塞（只能读操作），直到该语句的事务被commit语句或rollback语句结束为止。

select... for update 使用注意事项

1. for update 仅适用于Innodb，且必须在事务范围内才能生效。
2. 根据主键进行查询，查询条件为 like或者不等于，主键字段产生表锁。
3. 根据非索引字段进行查询，name字段产生表锁。



## 分库分表

当单表的数据量达到1000W或100G以后，优化索引、添加从库等可能对数据库性能提升效果不明显，此时就要考虑对其进行切分了。切分的目的就在于减少数据库的负担，缩短查询的时间。

数据切分可以分为两种方式：垂直（纵向）划分和水平（横向）划分。

### 垂直划分

垂直划分数据库是根据业务进行划分，例如将shop库中涉及商品、订单、用户的表分别划分出成一个库，通过降低单库的大小来提高性能，但这种方式并没有解决高数据量带来的性能损耗。同样的，分表的情况就是将一个大表根据业务功能拆分成一个个子表，例如商品基本信息和商品描述，商品基本信息一般会展示在商品列表，商品描述在商品详情页，可以将商品基本信息和商品描述拆分成两张表。

![垂直划分](https://cs-notes-1256109796.cos.ap-guangzhou.myqcloud.com/e130e5b8-b19a-4f1e-b860-223040525cf6.jpg)

优点：行记录变小，数据页可以存放更多记录，在查询时减少I/O次数。

缺点：

- 主键出现冗余，需要管理冗余列；
- 会引起表连接JOIN操作，可以通过在业务服务器上进行join来减少数据库压力；
- 依然存在单表数据量过大的问题。

### 水平划分

水平划分是根据一定规则，例如时间或id序列值等进行数据的拆分。比如根据年份来拆分不同的数据库。每个数据库结构一致，但是数据得以拆分，从而提升性能。

![水平划分](https://cs-notes-1256109796.cos.ap-guangzhou.myqcloud.com/63c2909f-0c5f-496f-9fe5-ee9176b31aba.jpg)

优点：单库（表）的数据量得以减少，提高性能；切分出的表结构相同，程序改动较少。

缺点：

- 分片事务一致性难以解决
- 跨节点Join性能差，逻辑复杂
- 数据分片在扩容时需要迁移

## 日志

MySQL日志 主要包括查询日志、慢查询日志、事务日志、错误日志、二进制日志等。其中比较重要的是二进制日志binlog和事务日志 redo log（重做日志）和 undo log（回滚日志）。

### bin log

二进制日志（bin log）是MySQL数据库级别的文件，记录对MySQL数据库执行修改的所有操作，不会记录select和show语句，主要用于恢复数据库和同步数据库。

查看bin log是否开启，以及保存位置：

```mysql
MySQL> show variables like '%log_bin%';
+---------------------------------+----------------------------------------------------+
| Variable_name                   | Value                                              |
+---------------------------------+----------------------------------------------------+
| log_bin                         | ON                                                 |
| log_bin_basename                | F:\java\MySQL8\data\Data\DESKTOP-8F30VS1-bin       |
| log_bin_index                   | F:\java\MySQL8\data\Data\DESKTOP-8F30VS1-bin.index |
| log_bin_trust_function_creators | OFF                                                |
| log_bin_use_v1_row_events       | OFF                                                |
| sql_log_bin                     | ON                                                 |
+---------------------------------+----------------------------------------------------+
```

关闭bin log，找到/etc/my.cnf文件，注释以下代码：

```mysql
log-bin=MySQL-bin
binlog_format=mixed
```

### redo log

重做日志（redo log）是Innodb引擎级别，用来记录Innodb存储引擎的事务日志，不管事务是否提交都会记录下来，用于数据恢复。当数据库发生故障，InnoDB存储引擎会使用redo log恢复到发生故障前的时刻，以此来保证数据的完整性。将参数innodb_flush_log_at_tx_commit设置为1，那么在执行commit时将redo log同步写到磁盘。

bin log和redo log区别：

1. bin log会记录所有日志记录，包括innoDB、MyISAM等存储引擎的日志；redo log只记录innoDB自身的事务日志
2. bin log只在事务提交前写入到磁盘，一个事务只写一次，无论事务多大；而在事务进行过程，会有redo log不断写入磁盘
3. binlog 是逻辑日志，记录的是SQL语句的原始逻辑；redo log 是物理日志，记录的是在某个数据页上做了什么修改。

### undo Log

除了记录redo log外，当进行数据修改时还会记录undo log，undo log用于数据的撤回操作，它保留了记录修改前的内容。通过undo log可以实现事务回滚，并且可以根据undo log回溯到某个特定的版本的数据，实现MVCC。

### 查询日志

记录所有对MySQL请求的信息，无论请求是否正确执行。

```mysql
MySQL> show variables like '%general_log%';
+------------------+----------------------------------+
| Variable_name    | Value                            |
+------------------+----------------------------------+
| general_log      | OFF                              |
| general_log_file | /var/lib/MySQL/VM_0_7_centos.log |
+------------------+----------------------------------+
```



## MySQL架构

MySQL主要分为 Server 层和存储引擎层：

- **Server 层**：主要包括连接器、查询缓存、分析器、优化器、执行器等，所有跨存储引擎的功能都在这一层实现，比如存储过程、触发器、视图，函数等，还有一个通用的日志模块 binglog 日志模块。
- **存储引擎**： 主要负责数据的存储和读取。server 层通过api与存储引擎进行通信。

![MySQL-archpng](https://raw.githubusercontent.com/Tyson0314/img/master/mysql-archpng.png)

### Server 层基本组件

- **连接器：** 当客户端连接 MySQL 时，server层会对其进行身份认证和权限校验。
- **查询缓存:** 执行查询语句的时候，会先查询缓存（MySQL 8.0 版本后移除），先校验这个 sql 是否执行过，如果缓存 key （sql语句）被命中，就会直接返回给客户端，如果没有命中，就会执行后续的操作。MySQL 查询不建议使用缓存，因为查询缓存失效在实际业务场景中可能会非常频繁，不推荐使用。
- **分析器:** 没有命中缓存的话，SQL 语句就会经过分析器，主要分为两步，词法分析和语法分析，先看 SQL 语句要做什么，再检查 SQL 语句语法是否正确。
- **优化器：** 优化器对查询进行优化，包括重写查询、决定表的读写顺序以及选择合适的索引等，生成执行计划。
- **执行器：** 首先执行前会校验该用户有没有权限，如果没有权限，就会返回错误信息，如果有权限，就会根据执行计划去调用引擎的接口，返回结果。

#### 语法解析器和预处理

MySQL通过关键字将SQL语句进行解析，生成解析树。

MySQL解析器使用MySQL语法规则验证和解析查询，比如验证是否使用正确的关键字、关键字的次序是否正确和验证引号是否前后正确匹配。

预处理器会进一步检查解析树是否合法，如检查数据表和数据列是否存在，然后验证权限。

#### 查询优化器

优化器会找出一个它认为最优的执行计划。

MySQL 能够处理的优化类型：

1. 重新定义表的关联顺序。数据表的关联并不是总按照查询中指定的顺序进行的。
3. 使用等价变换，简化表达式。比如将 `5=5 AND a > 5` 转化为 `a > 5`。
4. 优化COUNT/MIN/MAX。MIN查询最小值，对应的是b+树索引的第一行记录，优化器会将这个表达式作为一个常数对待。
4. 列表IN()的比较。很多数据库系统，IN完成等价于多个OR子句。MySQL不一样，MySQL将IN列表的数据先进行排序，然后通过二分查找的方式确定列表的值是否符合要求，时间复杂度为O(logN)，而OR查询的时间复杂度为O(N)。当IN列表有大量取值时，处理速度相比OR查询会更快。
5. 覆盖索引扫描。
6. 将外连接转化成内连接。某些情况下，外连接可能等价于一个内连接。

#### 查询执行引擎

在解析和优化阶段，MySQL将生成查询对应的执行计划，MySQL的查询执行引擎则根据这个执行计划，调用存储引擎接口来完成整个查询。

### 查询语句执行流程

查询语句的执行流程如下：权限校验、查询缓存、分析器、优化器、权限校验、执行器、引擎。

查询语句：

```mysql
select * from user where id > 1 and name = '大彬';
```

1. 检查权限，没有权限则返回错误；
2. MySQL以前会查询缓存，缓存命中则直接返回，没有则执行下一步；
3. 词法分析和语法分析。提取表名、查询条件，检查语法是否有错误；
4. 两种执行方案，先查 `id > 1` 还是 `name = '大彬'`，优化器根据自己的优化算法选择执行效率最好的方案；
5. 校验权限，有权限就调用数据库引擎接口，返回引擎的执行结果。

### 更新语句执行过程

更新语句执行流程如下：分析器、权限校验、执行器、引擎、redo log(prepare 状态)、binlog、redo log(commit状态)

更新语句：

```mysql
update user set name = '大彬' where id = 1;
```

1. 先查询到 id 为1的记录，有缓存会使用缓存
2. 拿到查询结果，将 name 更新为 大彬，然后调用引擎接口，写入更新数据，innodb 引擎将数据保存在内存中，同时记录 redo log，此时 redo log 进入 prepare 状态，然后告诉执行器，执行完成了，随时可以提交。
3. 执行器收到通知后记录 binlog，然后调用引擎接口，提交 redo log 为提交状态。
4. 更新完成。

为什么记录完 redo log，不直接提交，先进入prepare状态？

假设先写 redo log 直接提交，然后写 binlog，写完 redo log 后，机器挂了，binlog 日志没有被写入，那么机器重启后，这台机器会通过 redo log 恢复数据，但是这个时候 binlog 并没有记录该数据，后续进行机器备份的时候，就会丢失这一条数据，同时主从同步也会丢失这一条数据。

假设写完了 binlog，机器异常重启了，由于没有 redo log，本机是无法恢复这一条记录的，但是 binlog 又有记录，那么和上面同样的道理，就会产生数据不一致的情况。



## 慢查询

sql 语句查询时间超过（不包括等于） long_query_time，称为慢查询。

查看慢查询配置：

```mysql
show variables  like '%slow_query_log%'; #查看慢查询配置
set global slow_query_log=1; #开启慢查询
```

使用`set global slow_query_log=1`开启了慢查询日志只对当前数据库生效，如果MySQL重启后则会失效。如果要永久生效，就必须修改配置文件my.cnf。

```properties
slow_query_log =1
slow_query_log_file=/tmp/MySQL_slow.log #系统默认会给一个缺省的文件host_name-slow.log
```

默认情况下long_query_time的值为10秒，可以使用命令修改，也可以在my.cnf参数里面修改。

```mysql
show variables like 'long_query_time%';
set global long_query_time=4; #需要重新连接或新开一个会话才能看到修改值或者使用show global variables like 'long_query_time'
```

MySQL数据库支持同时两种日志存储方式，配置的时候以逗号隔开即可，如：log_output='FILE,TABLE'。

日志记录到系统的专用日志表中，要比记录到文件耗费更多的系统资源，因此对于需要启用慢查询日志，又需要能够获得更高的系统性能，那么建议优先记录到文件。

### mysqldumpslow

如果自己手动查找、分析SQL，显然是个体力活，MySQL提供了日志分析工具mysqldumpslow。

获取执行时间最长的10条sql语句：

```mysql
mysqldumpslow -s al -n 10 /usr/local/MySQL/data/slow.log
```



## 分区表

分区表是一个独立的逻辑表，但是底层由多个物理子表组成。

当查询条件的数据分布在某一个分区的时候，查询引擎只会去某一个分区查询，而不是遍历整个表。在管理层面，如果需要删除某一个分区的数据，只需要删除对应的分区即可。

### 分区表类型

1. 按照范围分区。

   ```mysql
   CREATE TABLE test_range_partition(
       id INT auto_increment,
       createdate DATETIME,
       primary key (id,createdate)
   ) 
   PARTITION BY RANGE (TO_DAYS(createdate) ) (
      PARTITION p201801 VALUES LESS THAN ( TO_DAYS('20210201') ),
      PARTITION p201802 VALUES LESS THAN ( TO_DAYS('20210301') ),
      PARTITION p201803 VALUES LESS THAN ( TO_DAYS('20210401') ),
      PARTITION p201804 VALUES LESS THAN ( TO_DAYS('20210501') ),
      PARTITION p201805 VALUES LESS THAN ( TO_DAYS('20210601') ),
      PARTITION p201806 VALUES LESS THAN ( TO_DAYS('20210701') ),
      PARTITION p201807 VALUES LESS THAN ( TO_DAYS('20210801') ),
      PARTITION p201808 VALUES LESS THAN ( TO_DAYS('20210901') ),
      PARTITION p201809 VALUES LESS THAN ( TO_DAYS('20211001') ),
      PARTITION p201810 VALUES LESS THAN ( TO_DAYS('20211101') ),
      PARTITION p201811 VALUES LESS THAN ( TO_DAYS('20211201') )
   );
   
   insert into test_range_partition (createdate) values ('20210105');
   insert into test_range_partition (createdate) values ('20210205');
   ```
   
   在`/var/lib/mysql/data/`可以找到对应的数据文件，每个分区表都有一个使用#分隔命名的表文件：
   
   ```
   -rw-rw---- 1 mysql mysql    65 Aug 21 09:24 db.opt
   -rw-rw---- 1 mysql mysql 98304 Aug 21 09:27 test_range_partition#P#p201801.ibd
   -rw-rw---- 1 mysql mysql 98304 Aug 21 09:27 test_range_partition#P#p201802.ibd
   -rw-rw---- 1 mysql mysql 98304 Aug 21 09:27 test_range_partition#P#p201803.ibd
   -rw-rw---- 1 mysql mysql 98304 Aug 21 09:27 test_range_partition#P#p201804.ibd
   -rw-rw---- 1 mysql mysql 98304 Aug 21 09:27 test_range_partition#P#p201805.ibd
   -rw-rw---- 1 mysql mysql 98304 Aug 21 09:27 test_range_partition#P#p201806.ibd
   -rw-rw---- 1 mysql mysql 98304 Aug 21 09:27 test_range_partition#P#p201807.ibd
   -rw-rw---- 1 mysql mysql 98304 Aug 21 09:27 test_range_partition#P#p201808.ibd
   -rw-rw---- 1 mysql mysql 98304 Aug 21 09:27 test_range_partition#P#p201809.ibd
   -rw-rw---- 1 mysql mysql 98304 Aug 21 09:27 test_range_partition#P#p201810.ibd
   -rw-rw---- 1 mysql mysql 98304 Aug 21 09:27 test_range_partition#P#p201811.ibd
   -rw-rw---- 1 mysql mysql  8598 Aug 21 09:27 test_range_partition.frm
   -rw-rw---- 1 mysql mysql   116 Aug 21 09:27 test_range_partition.par
   ```
   
2. list分区。对于List分区，分区字段必须是已知的，如果插入的字段不在分区时枚举值中，将无法插入。

   ```mysql
   create table test_list_partiotion
   (
       id int auto_increment,
       data_type tinyint,
       primary key(id,data_type)
   )partition by list(data_type)
   (
       partition p0 values in (0,1,2,3,4,5,6),
       partition p1 values in (7,8,9,10,11,12),
       partition p2 values in (13,14,15,16,17)
   );
   ```

3. hash分区，可以将数据均匀地分布到预先定义的分区中。

   ```mysql
   drop table test_hash_partiotion;
   create table test_hash_partiotion
   (
       id int auto_increment,
       create_date datetime,
       primary key(id,create_date)
   )partition by hash(year(create_date)) partitions 10;
   ```

### 分区的问题

1. 打开和锁住所有底层表的成本可能很高。当查询访问分区表时，MySQL需要打开并锁住所有的底层表，这个操作在分区过滤之前发生，所以无法通过分区过滤来降低此开销，会影响到查询速度。可以通过批量操作来降低此类开销，比如批量插入、LOAD DATA INFILE和一次删除多行数据。
2. 维护分区的成本可能很高。例如重组分区，会先创建一个临时分区，然后将数据复制到其中，最后再删除原分区。
3. 所有分区必须使用相同的存储引擎。

### 查询优化

分区最大的优点就是优化器可以根据分区函数过滤掉一些分区，可以让查询扫描更少的数据。在查询条件中加入分区列，就可以让优化器过滤掉无需访问的分区。如果查询条件没有分区列，MySQL会让存储引擎访问这个表的所有分区。需要注意的是，查询条件中的分区列不能使用表达式。



## 其他

### processlist

`select * `会查询出不需要的、额外的数据，那么这些额外的数据在网络上进行传输，带来了额外的网络开销。

`show processlist` 或 `show full processlist` 可以查看当前 MySQL 是否有压力，正在运行的sql，有没有慢 SQL 正在执行。

- **id** - 线程ID，可以用：`kill id;` 杀死一个线程，很有用

- **db** - 数据库

- **user** - 用户

- **host** - 连库的主机IP

- **command** - 当前执行的命令，比如最常见的：Sleep，Query，Connect 等

- **time** - 消耗时间，单位秒，很有用

- **state** - 执行状态

  sleep，线程正在等待客户端发送新的请求

  query，线程正在查询或者正在将结果发送到客户端

  Sorting result，线程正在对结果集进行排序

  Locked，线程正在等待锁

- **info** - 执行的SQL语句，很有用



### exist和in

exists 用于对外表记录做筛选。

exists 会遍历外表，将外查询表的每一行，代入内查询进行判断。当 exists 里的条件语句能够返回记录行时，条件就为真，返回外表当前记录。反之如果exists里的条件语句不能返回记录行，条件为假，则外表当前记录被丢弃。

```mysql
select a.* from A a
where exists(select 1 from B b where a.id=b.id)
```

in 是先把后边的语句查出来放到临时表中，然后遍历临时表，将临时表的每一行，代入外查询去查找。

```mysql
select * from A
where id in(select id from B)
```

子查询的表大的时候，使用EXISTS可以有效减少总的循环次数来提升速度；当外查询的表大的时候，使用IN可以有效减少对外查询表循环遍历来提升速度。



> 参考资料：
>
> 高性能MySQL书籍
>
> MVCC实现原理：https://zhuanlan.zhihu.com/p/64576887
>
>  多版本并发控制机制：https://www.cnblogs.com/axing-articles/p/11415763.html
>
> 排他锁分析：https://blog.csdn.net/claram/article/details/54023216
>
> 分区表：https://www.cnblogs.com/wy123/p/9778590.html
>
> 一条SQL语句在MySQL中如何执行的：https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247485097&idx=1&sn=84c89da477b1338bdf3e9fcd65514ac1&chksm=cea24962f9d5c074d8d3ff1ab04ee8f0d6486e3d015cfd783503685986485c11738ccb542ba7&token=79317275&lang=zh_CN#rd

