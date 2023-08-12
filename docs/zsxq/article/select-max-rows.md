## 问题

一条这样的 SQL 语句能查询出多少条记录？

```SQL
select * from user 
```

表中有 100 条记录的时候能全部查询出来返回给客户端吗？

如果记录数是 1w 呢？ 10w 呢？ 100w 、1000w 呢？

虽然在实际业务操作中我们不会这么干，尤其对于数据量大的表不会这样干，但这是个值得想一想的问题。

## 寻找答案

前提：以下所涉及资料全部基于 MySQL 8

### max_allowed_packet

在查询资料的过程中发现了这个参数  `max_allowed_packet`

![](http://img.topjavaer.cn/img/202307231140420.png)

上图参考了 MySQL 的官方文档，根据文档我们知道：

- MySQL 客户端  `max_allowed_packet` 值的默认大小为 16M（不同的客户端可能有不同的默认值，但最大不能超过 1G）
- MySQL 服务端 `max_allowed_packet` 值的默认大小为 64M
- `max_allowed_packet` 值最大可以设置为 1G（1024 的倍数）

然而 根据上图的文档中所述

> The maximum size of one packet or any generated/intermediate string,or any parameter sent by the mysql_smt_send_long_data() C API function

- one packet
- generated/intermediate string
- any parameter sent by the mysql_smt_send_long_data() C API function

这三个东东具体都是什么呢？ `packet` 到底是结果集大小，还是网络包大小还是什么？ 于是 google 了一下，搜索排名第一的是这个：

![](http://img.topjavaer.cn/img/202307231140408.png)

根据 “Packet Too Large” 的说明， 通信包 (communication packet) 是

- 一个被发送到 MySQL 服务器的单个 SQL 语句
- 或者是一个被发送到客户端的**单行记录**
- 或者是一个从主服务器 (replication source server) 被发送到从属服务器 (replica) 的二进制日志事件。

1、3 点好理解，这也同时解释了，如果你发送的一条 SQL 语句特别大可能会执行不成功的原因，尤其是`insert` `update` 这种，单个 SQL 语句不是没有上限的，不过这种情况一般不是因为 SQL 语句写的太长，主要是由于某个字段的值过大，比如有 BLOB 字段。

那么第 2 点呢，单行记录，默认值是 64M，会不会太大了啊，一行记录有可能这么大的吗？ 有必要设置这么大吗？ 单行最大存储空间限制又是多少呢？

### 单行最大存储空间

MySQL 单行最大宽度是 65535 个字节，也就是 64KB 。无论是 InnoDB 引擎还是  MyISAM 引擎。

![](http://img.topjavaer.cn/img/202307231141021.png)

通过上图可以看到 超过 65535 不行，不过请注意其中的错误提示：“Row size too large. The maximum row size for the used table type, not counting BLOBs, is 65535” ，如果字段是变长类型的如 BLOB 和 TEXT 就不包括了，那么我们试一下用和上图一样的字段长度，只把最后一个字段的类型改成 BLOB 和 TEXT

```SQL
mysql> CREATE TABLE t (a VARCHAR(10000), b VARCHAR(10000),
       c VARCHAR(10000), d VARCHAR(10000), e VARCHAR(10000),
       f VARCHAR(10000), g TEXT(6000)) ENGINE=InnoDB CHARACTER SET latin1;
Query OK, 0 rows affected (0.02 sec)
```

可见无论 是改成 BLOB 还是 TEXT 都可以成功。但这里请注意，字符集是 `latin1` 可以成功，如果换成 `utf8mb4` 或者  `utf8mb3` 就不行了，会报错，仍然是 ：“Row size too large. The maximum row size for the used table type, not counting BLOBs, is 65535.” 为什么呢？

**因为虽然不包括 TEXT 和 BLOB, 但总长度还是超了！**

我们先看一下这个熟悉的  VARCHAR(255) ， 你有没有想过为什么用 255，不用 256？

> 在 4.0 版本以下，varchar(255) 指的是 255 个字节，使用 1 个字节存储长度即可。当大于等于 256 时，要使用 2 个字节存储长度。所以定义 varchar(255) 比 varchar(256) 更好。
>
> 但是在 5.0 版本以上，varchar(255) 指的是 255 个字符，每个字符可能占用多个字节，例如使用 UTF8 编码时每个汉字占用 3 字节，使用 GBK 编码时每个汉字占 2 字节。

例子中我们用的是 MySQL8 ，由于字符集是 utf8mb3 ，存储一个字要用三个字节， 长度为 255 的话（列宽），总长度要 765 字节 ，再加上用 2 个字节存储长度，那么这个列的总长度就是 767 字节。所以用 latin1 可以成功，是因为一个字符对应一个字节，而 utf8mb3 或 utf8mb4 一个字符对应三个或四个字节，VARCHAR(10000) 就可能等于要占用 30000 多 40000 多字节，比原来大了 3、4 倍，肯定放不下了。

**另外，还有一个要求**，列的宽度不要超过 MySQL 页大小 （默认 16K）的一半，要比一半小一点儿。 例如，对于默认的 16KB `InnoDB` 页面大小，最大行大小略小于 8KB。

下面这个例子就是超过了一半，所以报错，当然解决办法也在提示中给出了。

```SQL
mysql> CREATE TABLE t4 (
       c1 CHAR(255),c2 CHAR(255),c3 CHAR(255),
       c4 CHAR(255),c5 CHAR(255),c6 CHAR(255),
       c7 CHAR(255),c8 CHAR(255),c9 CHAR(255),
       c10 CHAR(255),c11 CHAR(255),c12 CHAR(255),
       c13 CHAR(255),c14 CHAR(255),c15 CHAR(255),
       c16 CHAR(255),c17 CHAR(255),c18 CHAR(255),
       c19 CHAR(255),c20 CHAR(255),c21 CHAR(255),
       c22 CHAR(255),c23 CHAR(255),c24 CHAR(255),
       c25 CHAR(255),c26 CHAR(255),c27 CHAR(255),
       c28 CHAR(255),c29 CHAR(255),c30 CHAR(255),
       c31 CHAR(255),c32 CHAR(255),c33 CHAR(255)
       ) ENGINE=InnoDB ROW_FORMAT=DYNAMIC DEFAULT CHARSET latin1;
ERROR 1118 (42000): Row size too large (> 8126). Changing some columns to TEXT or BLOB may help.
In current row format, BLOB prefix of 0 bytes is stored inline.
```

**那么为什么是 8K，不是 7K，也不是 9K 呢？** 这么设计的原因可能是：MySQL 想让一个数据页中能存放更多的数据行，至少也得要存放两行数据（16K）。否则就失去了 B+Tree 的意义。B+Tree 会退化成一个低效的链表。

**你可能还会奇怪，不超过 8K ？你前面的例子明明都快 64K 也能存下，那 8K 到 64K 中间这部分怎么解释？**

答：如果包含可变长度列的行超过 `InnoDB` 最大行大小， `InnoDB` 会选择可变长度列进行页外存储，直到该行适合 `InnoDB` ，这也就是为什么前面有超过 8K 的也能成功，那是因为用的是`VARCHAR`这种可变长度类型。

![](http://img.topjavaer.cn/img/202307231141870.png)

当你往这个数据页中写入一行数据时，即使它很大将达到了数据页的极限，但是通过行溢出机制。依然能保证你的下一条数据还能写入到这个数据页中。

**我们通过 Compact 格式，简单了解一下什么是 `页外存储` 和 `行溢出`**

MySQL8  InnoDB 引擎目前有 4 种 行记录格式：

- REDUNDANT
- COMPACT
- DYNAMIC（默认 default 是这个）
- COMPRESSED

`行记录格式`  决定了其行的物理存储方式，这反过来又会影响查询和 DML 操作的性能。

![](http://img.topjavaer.cn/img/202307231141440.png)

Compact 格式的实现思路是：当列的类型为 VARCHAR、 VARBINARY、 BLOB、TEXT 时，该列超过 768byte 的数据放到其他数据页中去。

![](http://img.topjavaer.cn/img/202307231141558.png)

在 MySQL 设定中，当 varchar 列长度达到 768byte 后，会将该列的前 768byte 当作当作 prefix 存放在行中，多出来的数据溢出存放到溢出页中，然后通过一个偏移量指针将两者关联起来，这就是 `行溢出`机制

> **假如你要存储的数据行很大超过了 65532byte 那么你是写入不进去的。假如你要存储的单行数据小于 65535byte 但是大于 16384byte，这时你可以成功 insert，但是一个数据页又存储不了你插入的数据。这时肯定会行溢出！**

MySQL 这样做，有效的防止了单个 varchar 列或者 Text 列太大导致单个数据页中存放的行记录过少的情况，避免了 IO 飙升的窘境。

### 单行最大列数限制

**mysql 单表最大列数也是有限制的，是 4096 ，但 InnoDB 是 1017**

![](http://img.topjavaer.cn/img/202307231141116.png)

### 实验

前文中我们疑惑 `max_allowed_packet` 在 MySQL8 的默认值是 64M，又说这是限制单行数据的，单行数据有这么大吗？ 在前文我们介绍了行溢出， 由于有了 `行溢出` ，单行数据确实有可能比较大。

那么还剩下一个问题，`max_allowed_packet` 限制的确定是单行数据吗，难道不是查询结果集的大小吗 ?  下面我们做个实验，验证一下。

建表

```SQL
CREATE TABLE t1 (
       c1 CHAR(255),c2 CHAR(255),c3 CHAR(255),
       c4 CHAR(255),c5 CHAR(255),c6 CHAR(255),
       c7 CHAR(255),c8 CHAR(255),c9 CHAR(255),
       c10 CHAR(255),c11 CHAR(255),c12 CHAR(255),
       c13 CHAR(255),c14 CHAR(255),c15 CHAR(255),
       c16 CHAR(255),c17 CHAR(255),c18 CHAR(255),
       c19 CHAR(255),c20 CHAR(255),c21 CHAR(255),
       c22 CHAR(255),c23 CHAR(255),c24 CHAR(255),
       c25 CHAR(255),c26 CHAR(255),c27 CHAR(255),
       c28 CHAR(255),c29 CHAR(255),c30 CHAR(255),
       c31 CHAR(255),c32 CHAR(192)
       ) ENGINE=InnoDB ROW_FORMAT=DYNAMIC DEFAULT CHARSET latin1;
```

经过测试虽然提示的是 `Row size too large (> 8126)` 但如果全部长度加起来是 8126 建表不成功，最终我试到 8097 是能建表成功的。为什么不是 8126 呢 ？可能是还需要存储一些其他的东西占了一些字节吧，比如隐藏字段什么的。

用存储过程造一些测试数据，把表中的所有列填满

```SQL
create
    definer = root@`%` procedure generate_test_data()
BEGIN
  DECLARE i INT DEFAULT 0;
  DECLARE col_value TEXT DEFAULT REPEAT('a', 255);  
  WHILE i < 5 DO
    INSERT INTO t1 VALUES
    (
      col_value, col_value, col_value,
      col_value, REPEAT('b', 192)
    );
    SET i = i + 1;
  END WHILE;
END;
```

将 `max_allowed_packet` 设置的小一些，先用  `show VARIABLES like '%max_allowed_packet%';` 看一下当前的大小，我的是 `67108864` 这个单位是字节，等于 64M，然后用 `set global max_allowed_packet =1024` 将它设置成允许的最小值 1024 byte。 设置好后，关闭当前查询窗口再新建一个，然后再查看：

![](http://img.topjavaer.cn/img/202307231141361.png)

这时我用 `select * from t1;` 查询表数据时就会报错：

![](http://img.topjavaer.cn/img/202307231142956.png)

因为我们一条记录的大小就是 8K 多了，所以肯定超过 1024byte。可见文档的说明是对的， `max_allowed_packet` 确实是可以约束单行记录大小的。

## 答案

文章写到这里，我有点儿写不下去了，一是因为懒，另外一个原因是关于这个问题：“一条 SQL 最多能查询出来多少条记录？” 肯定没有标准答案

目前我们可以知道的是：

- 你的单行记录大小不能超过  `max_allowed_packet`
- 一个表最多可以创建 1017 列 （InnoDB）
- 建表时定义列的固定长度不能超过 页的一半（8k,16k...）
- 建表时定义列的总长度不能超过 65535  个字节

如果这些条件我们都满足了，然后发出了一个没有 where 条件的全表查询 `select *` 那么.....

首先，你我都知道，这种情况不会发生在生产环境的，如果真发生了，一定是你写错了，忘了加条件。因为几乎没有这种要查询出所有数据的需求。如果有，也不能开发，因为这不合理。

我考虑的也就是个理论情况，从理论上讲能查询出多少数据不是一个确定的值，除了前文提到的一些条件外，它肯定与以下几项有直接的关系

- 数据库的可用内存
- 数据库内部的缓存机制，比如缓存区的大小
- 数据库的查询超时机制
- 应用的可用物理内存
- ......

说到这儿，我确实可以再做个实验验证一下，但因为懒就不做了，大家有兴趣可以自己设定一些条件做个实验试一下，比如在特定内存和特定参数的情况下，到底能查询出多少数据，就能看得出来了。

虽然我没能给出文章开头问题的答案，但通过寻找答案也弄清楚了 MySQL 的一些限制条件，并加以了验证，也算是有所收获了。



**参考**链接：https://juejin.cn/post/7255478273652834360
