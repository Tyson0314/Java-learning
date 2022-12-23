# 数据类型

Redis支持五种数据类型：

- string（字符串）
- hash（哈希）
- list（列表）
- set（集合）
- zset(sorted set)

## 字符串类型

字符串类型的值可以是字符串、数字或者二进制，但值最大不能超过512MB。

常用命令：set, get, incr, incrby, desr, keys, append, strlen

- 赋值和取值

```
SET name tyson
GET name
```

- 递增数字

```
INCR num       //若键值不是整数时，则会提示错误。
INCRBY num 2   //增加指定整数
DESR num       //递减数字
INCRBY num 2.7 //增加指定浮点数
```

- 其他

`keys list*` 列出匹配的key 

`APPEND name " dai"` 追加值 

`STRLEN name` 获取字符串长度 

`MSET name tyson gender male` 同时设置多个值 

`MGET name gender` 同时获取多个值 

`GETBIT name 0` 获取0索引处二进制位的值

`FLUSHDB` 删除当前数据库所有的key 

`FLUSHALL` 删除所有数据库中的key  

**SETNX和SETEX**

`SETNX key value`：当key不存在时，将key的值设为value。若给定的key已经存在，则SETNX不做任何操作。

`SETEX key seconds value`：比SET多了seconds参数，相当于`SET KEY value` + `EXPIRE KEY seconds`，而且SETEX是原子性操作。

**keys和scan**

redis的单线程的。keys指令会导致线程阻塞一段时间，直到执行完毕，服务才能恢复。scan采用渐进式遍历的方式来解决keys命令可能带来的阻塞问题，每次scan命令的时间复杂度是O（1），但是要真正实现keys的功能，需要执行多次scan。

scan的缺点：在scan的过程中如果有键的变化（增加、删除、修改），遍历过程可能会有以下问题：新增的键可能没有遍历到，遍历出了重复的键等情况，也就是说scan并不能保证完整的遍历出来所有的键。

scan命令用于迭代当前数据库中的数据库键：`SCAN cursor [MATCH pattern] [COUNT count]`

```
scan 0 match * count 10 //返回10个元素
```

SCAN相关命令包括SSCAN 命令、HSCAN 命令和 ZSCAN 命令，分别用于集合、哈希键及有序集合。

**expire**

```
SET password 666
EXPIRE password 5
TTL password //查看键的剩余生存时间，-1为永不过期
SETEX password 60 123abc //SETEX可以在设置键的同时设置它的生存时间
```

EXPIRE时间单位是秒，PEXPIRE时间单位是毫秒。在键未过期前可以重新设置过期时间，过期之后则键被销毁。

在Redis 2.6和之前版本，如果key不存在或者已过期时返回`-1`。

从Redis2.8开始，错误返回值的结果有如下改变：

- 如果key不存在或者已过期，返回 `-2`
- 如果key存在并且没有设置过期时间（永久有效），返回 `-1` 。

**type**

TYPE 命令用于返回 key 所储存的值的类型。

```
127.0.0.1:6379> type NEWBLOG
list
```

## 散列类型

常用命令：hset, hget, hmset, hmget, hgetall, hdel, hkeys, hvals

- 赋值和取值

```
HSET car price 500 //HSET key field value
HGET car price
```

同时设置获取多个字段的值

```
HMSET car price 500 name BMW
HMGET car price name
HGETALL car
```

使用 HGETALL 命令时，如果哈希元素个数比较多，会存在阻塞Redis的可能。如果只需要获取部分field，可以使用hmget，如果一定要获取全部field-value，可以使用hscan命令，该命令会渐进式遍历哈希类型。

`HSETNX car price 400 //当字段不存在时赋值，HSETNX是原子操作，不存在竞态条件`

-  增加数字
   `HINCRBY person score 60`
-  删除字段
   `HDEL car price`
-  其他

```
HKEYS car //获取key
HVALS car //获取value
HLEN car  //长度
```

## 列表类型

常用命令：lpush, rpush, lpop, rpop, lrange, lrem

**添加和删除元素**

```
LPUSH numbers 1
RPUSH numbers 2 3
LPOP numbers
RPOP numbers
```

**获取列表片段**

```
LRANGE numbers 0 2
LRANGE numbers -2 -1 //支持负索引 -1是最右边第一个元素
LRANGE numbers 0 -1
```

**向列表插入值**

首先从左到右寻找值为pivot的值，向列表插入value

```
LINSERT numbers AFTER 5 8 //往5后面插入8
LINSERT numbers BEFORE 6 9 //往6前面插入9
```

**删除元素**

`LTRIM numbers 1 2` 删除索引1到2以外的所有元素

LPUSH常和LTRIM一起使用来限制列表的元素个数，如保留最近的100条日志

```
LPUSH logs $newLog
LTRIM logs 0 99
```

**删除列表指定的值** 

`LREM key count value`

      1. count < 0, 则从右边开始删除前count个值为value的元素
      2. count > 0, 则从左边开始删除前count个值为value的元素
      3. count = 0, 则删除所有值为value的元素 `LREM numbers 0 2`

**其他**

```
LLEN numbers       //获取列表元素个数
LINDEX numbers -1  //返回指定索引的元素，index是负数则从右边开始计算
LSET numbers 1 7   //把索引为1的元素的值赋值成7
```

## 集合类型

常用命令：sadd, srem, smembers, scard, sismember, sdiff

集合中不能有相同的元素。

**增加/删除元素**

```
SADD letters a b c
SREM letters c d
```

**获取元素**

```
SMEMBERS letters
SCARD letters   //获取集合元素个数
```

**判断元素是否在集合中**
`SISMEMBER letters a`

**集合间的运算**

```
SDIFF setA setB  //差集运算
SINTER setA setB //交集运算
SUNION setA setB //并集运算
```

三个命令都可以传进多个键 `SDIFF setA setB setC`

**其他**

`SDIFFSTORE result setA setB` 进行集合运算并将结果存储

`SRANDMEMBER key count` 

>随机获取集合里的一个元素，count大于0，则从集合随机获取count个不重复的元素，count小于0，则随机获取的count个元素有些可能相同。

## 有序集合类型

常用命令：zadd, zrem, zscore, zrange

```java
zadd zsetkey 50 e1 60 e2 30 e3
```

Zset(sorted set)是string类型的有序集合。zset 和 set 一样也是string类型元素的集合，且不允许重复的成员。不同的是Zset每个元素都会关联一个double（超过17位使用科学计算法表示，可能丢失精度）类型的分数，通过分数来为集合中的成员进行排序。zset的成员是唯一的,但分数(score)可以重复。

**有序集合和列表相同点：**

1. 都是有序的；
2. 都可以获得某个范围内的元素。

**有序集合和列表不同点：**

1. 列表基于链表实现，获取两端元素速度快，访问中间元素速度慢；
2. 有序集合基于散列表和跳跃表实现，访问中间元素时间复杂度是OlogN；
3. 列表不能简单的调整某个元素的位置，有序列表可以（更改元素的分数）；
4. 有序集合更耗内存。

**增加/删除元素**

时间复杂度OlogN。

```
ZADD scoreboard 89 Tom 78 Sophia
ZADD scoreboard 85.5 Tyson      //支持双精度浮点数
ZREM scoreboard Tyson
ZREMRANGEBYRANK scoreboard 0 2  //按照排名范围删除元素
ZREMRANGEBYSCORE scoreboard (80 100 //按照分数范围删除元素，"("代表不包含
```

**获取元素分数**

时间复杂度O1。

`ZSCORE scoreboard Tyson`

**获取排名在某个范围的元素列表**

ZRANGE命令时间复杂度是O(log(n)+m)， n是有序集合元素个数，m是返回元素个数。

```
ZRANGE scoreboard 0 2
ZRANGE scoreboard 1 -1  //-1表示最后一个元素
ZRANGE scoreboard 0 -1 WITHSCORES  //同时获得分数
```

**获取指定分数范围的元素**

ZRANGEBYSCORE命令时间复杂度是O(log(n)+m)， n是有序集合元素个数，m是返回元素个数。

```
ZRANGEBYSCORE scoreboard 80 100
ZRANGEBYSCORE scoreboard 80 (100  //不包含100
ZRANGEBYSCORE scoreboard (60 +inf LIMIT 1 3 //获取分数高于60的从第二个人开始的3个人
```

**增加某个元素的分数**

时间复杂度OlogN。

`ZINCRBY scoreboard 10 Tyson`

**其他**

```
ZCARD scoreboard          //获取集合元素个数，时间复杂度O1
ZCOUNT scoreboard 80 100  //指定分数范围的元素个数
ZRANK scoreboard Tyson    //按从小到大的顺序获取元素排名
ZREVRANK scoreboard Tyson //按从大到小的顺序获取元素排名
```

## Bitmaps

Bitmaps本身不是一种数据结构，实际上它就是字符串，但是它可以对字符串的位进行操作，可以把Bitmaps想象成一个以位为单位的数组，数组的每个单元只能存储0和1。

bitmap的长度与集合中元素个数无关，而是与基数的上限有关。假如要计算上限为1亿的基数，则需要12.5M字节的bitmap。就算集合中只有10个元素也需要12.5M。

## HyperLogLog

HyperLogLog 是用来做基数统计的算法，其优点是，在输入元素的数量或者体积非常非常大时，计算基数所需的空间总是固定的、并且是很小的。

基数：比如数据集 {1, 3, 5, 7, 5, 7, 8}， 那么这个数据集的基数集为 {1, 3, 5 ,7, 8}，基数即不重复元素为5。 

应用场景：独立访客（unique visitor，uv）统计。
