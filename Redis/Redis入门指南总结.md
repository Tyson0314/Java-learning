Redis入门指南总结
<!-- MarkdownTOC autoanchor="true" autolink="true" uri_encoding="false" -->

- [简介](#简介)
- [启动与停止](#启动与停止)
- [数据类型](#数据类型)
    - [字符串类型](#字符串类型)
    - [散列类型](#散列类型)
    - [列表类型](#列表类型)
    - [集合类型](#集合类型)
    - [有序集合类型](#有序集合类型)
    - [排序](#排序)
- [事务](#事务)
- [消息队列](#消息队列)
- [持久化](#持久化)
    - [RDB方式](#rdb方式)
    - [AOF方式](#aof方式)
- [集群](#集群)

<!-- /MarkdownTOC -->

---
<a id="简介"></a>
## 简介
Redis是一个高性能的key-value数据库。Redis对数据的操作都是原子性的。

> 为什么使用

1. 减少对应用服务器的cpu和内存压力
2. 减少io的读操作
3. 关系型数据库的扩展性不强，难以改变表结构

> 优点：

1. nosql数据库没有关联关系，数据结构简单，拓展表比较容易
2. nosql读取速度快，对较大数据处理快

> 缺点：

对join或其他结构化查询的支持就比较差

> 适用场景

1. 数据高并发的读写
2. 海量数据的读写
3. 对扩展性要求高的数据

> 关系型数据库适用场景

1. 存储结构化数据，如用户的帐号、地址。
2. 数据需要做结构化查询，复杂查询
3. 要求事务性、一致性

<a id="启动与停止"></a>
## 启动与停止
**启动**

切换目录到redis下，运行:
`redis-server redis.windows.conf`

若配置了环境变量，可直接运行`redis-server`

新打开一个窗口，切换到redis目录下并运行（配置了环境变量可直接运行）
`redis-cli -h 127.0.0.1 -p 6379`

>Linux下通过配置文件redis.conf设置deamonize yes允许后台进程，开启redis-server后控制台仍然可以接收输入。requirepass可以设置密码。

**停止**

`redis-cli SHUTDOWN`

<a id="数据类型"></a>
## 数据类型
Redis支持五种数据类型：

- string（字符串）
- hash（哈希）
- list（列表）
- set（集合）
- zset(sorted set)

<a id="字符串类型"></a>
### 字符串类型
> 常用命令：set, get, incr, incrby, desr, keys, append, strlen

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


<a id="散列类型"></a>
### 散列类型
> 常用命令：hset, hget, hmset, hmget, hgetall, hdel, hkeys, hvals

- 赋值和取值
```
HSET car price 500
HGET car price
```
*同时设置获取多个字段的值*
```
HMSET car price 500 name BMW
HMGET car price name
HGETALL car
```

`HSETNX car price 400 //当字段不存在时赋值，HSETNX是原子操作，不存在竞态条件`

-  增加数字
`HINCRBY person score 60`
- 删除字段
`HDEL car price`
- 其他
```
HKEYS car //获取key
HVALS car //获取value
HLEN car  //长度
```

<a id="列表类型"></a>
### 列表类型
> 常用命令：lpush, rpush, lpop, rpop, lrange, lrem

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

<a id="集合类型"></a>
### 集合类型
> 常用命令：sadd, srem, smembers, scard, sismember, sdiff

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
*三个命令都可以传进多个键 `SDIFF setA setB setC`*

**其他**

`SDIFFSTORE result setA setB` 进行集合运算并将结果存储

`SRANDMEMBER key count` 
>随机获取集合里的一个元素，count大于0，则从集合随机获取count个不重复的元素，count小于0，则随机获取的count个元素有些可能相同。

`SPOP letters`

<a id="有序集合类型"></a>
### 有序集合类型
> 常用命令：zadd, zrem, zscore, zrange

Zset(sorted set)是string类型的有序集合。zset 和 set 一样也是string类型元素的集合，且不允许重复的成员。不同的是每个元素都会关联一个double类型的分数。redis正是通过分数来为集合中的成员进行排序。
zset的成员是唯一的,但分数(score)却可以重复。

**有序集合和列表相同点：**

1. 都是有序的；
2. 都可以获得某个范围内的元素。

**有序集合和列表不同点：**

1. 列表基于链表实现，获取两端元素速度快，访问中间元素速度慢；
2. 有序集合基于散列表和跳跃表实现，访问中间元素时间复杂度是OlogN；
3. 列表不能简单的调整某个元素的位置，有序列表可以（更改元素的分数）；
4. 有序集合更耗内存。

**增加/删除元素**
```
ZADD scoreboard 89 Tom 78 Sophia
ZADD scoreboard 85.5 Tyson      //支持双精度浮点数
ZREM scoreboard Tyson
ZREMRANGEBYRANK scoreboard 0 2  //按照排名范围删除元素
ZREMRANGEBYSCORE scoreboard (80 100 //按照分数范围删除元素，"("代表不包含
```

**获取元素分数**

`ZSCORE scoreboard Tyson`

**获取排名在某个范围的元素列表**
```
ZRANGE scoreboard 0 2
ZRANGE scoreboard 1 -1  //-1表示最后一个元素
ZRANGE scoreboard 0 -1 WITHSCORES  //同时获得分数
```
*ZRANGE命令时间复杂度是Olog(n+m)， n是有序集合元素个数，m是返回元素个数*

**获取指定分数范围的元素**
```
ZRANGEBYSCORE scoreboard 80 100
ZRANGEBYSCORE scoreboard 80 (100  //不包含100
ZRANGEBYSCORE scoreboard (60 +inf LIMIT 1 3 //获取分数高于60的从第二个人开始的3个人
```

**增加某个元素的分数**

`ZINCRBY scoreboard 10 Tyson`

**其他**
```
ZCARD scoreboard          //获取集合元素个数
ZCOUNT scoreboard 80 100  //指定分数范围的元素个数
ZRANK scoreboard Tyson    //按从小到大的顺序获取元素排名
ZREVRANK scoreboard Tyson //按从大到小的顺序获取元素排名
```

<a id="排序"></a>
### 排序
```
LPUSH myList 4 8 2 3 6
SORT myList DESC
```
```
LPUSH letters f l d n c
SORT letters ALPHA
```
**BY参数**
```
LPUSH list1 1 2 3
SET score:1 50
SET score:2 100
SET score:3 10
SORT list1 BY score:* DESC
```
**GET参数**

GET参数命令作用是使SORT命令的返回结果是GET参数指定的键值。

`SORT tag:Java:posts BY post:*->time DESC GET post:*->title GET post:*->time GET #`
>GET #返回文章ID。

**STORE参数**

`SORT tag:Java:posts BY post:*->time DESC GET post:*->title STORE resultCache`

`EXPIRE resultCache 10 //STORE结合EXPIRE可以缓存排序结果`

<a id="事务"></a>
## 事务
事务的原理是将一个事务的命令发送给Redis，然后再让Redis依次执行这些命令。

![](http://pkcfb0ug5.bkt.clouddn.com/18-12-27/90917911.jpg)



- WATCH命令
WATCH命令可以监控一个或多个键，一旦其中有一个键被修改，之后的事务就不会执行。监控会一直持续到EXEC命令。
```
SET key 1
WATCH key
SET key 2
MULTI
SET key 3
EXEC
```
- 过期时间
```
SET password 666
EXPIRE password 5
TTL password //查看键的剩余生存时间

SETEX password 60 123abc //SETEX可以在设置键的同时设置它的生存时间
```
>EXPIRE时间单位是秒，PEXPIRE时间单位是毫秒。
>在键未过期前可以重新设置过期时间，过期之后则键被销毁。

<a id="消息队列"></a>
## 消息队列
使用一个列表，让生产者将任务使用LPUSH命令放进列表，消费者不断用RPOP从列表取出任务。

BRPOP和RPOP命令相似，唯一的区别就是当列表没有元素时BRPOP命令会一直阻塞住连接，直到有新元素加入。
`BRPOP queue 0  //0表示不限制等待时间`

**优先级队列**

`BLPOP queue:1 queue:2 queue:3 0`
*如果多个键都有元素，则按照从左到右的顺序取元素*

**发布/订阅模式**
```
PUBLISH channel1 hi
SUBSCRIBE channel1
UNSUBSCRIBE channel1 //退订通过SUBSCRIBE命令订阅的频道。
```

`PSUBSCRIBE channel?*` 按照规则订阅
`PUNSUBSCRIBE channel?*` 

>退订通过PSUBSCRIBE命令按照某种规则订阅的频道。其中订阅规则要
>进行严格的字符串匹配，`PUNSUBSCRIBE *`无法退订`channel?*`规则。

<a id="持久化"></a>
## 持久化
Redis支持两种方式的持久化，一种是RDB的方式，一种是AOF的方式。前者会根据指定的规则“定时”将内存中的数据存储在硬盘上，而后者在每次执行完命令后将命令记录下来。一般将两者结合使用。
<a id="rdb方式"></a>
### RDB方式
RDB方式的持久化是通过快照完成的，当符合条件时Redis会将内存中的所有数据生成一份副本保存在硬盘上，此过程即为“快照”。

Redis会在几种情况下对数据进行快照：

1. 根据配置规则进行自动快照，如`SAVE 300 10`,300秒内至少有10个键被修改则进行快照；
2. 用户执行SAVE或BGSAVE命令。SAVE命令执行快照的过程会阻塞所有来自客户端的请求，应避免在生产环境使用这个命令。BGSAVE命令可以在后台异步进行快照操作，快照的同时服务器还可以继续响应客户端的请求，因此需要手动执行快照时推荐使用BGSAVE命令；
3. 执行FLUSHALL命令，当没有定义自动快照条件时，执行FLUSHALL命令则不会进行快照；
4. 执行复制（replication）时。当设置了主从复制后，Redis会在复制初始化时进行自动快照。

**快照的过程：**

- Redis使用fork函数复制当前进程的副本；
- 父进程继续接收并处理客户端的请求，而子进程开始将内存中的数据写进硬盘的临时文件；
- 当子进程写完所有数据后会用该临时文件替换旧的RDB文件。

Redis启动时会读取RDB快照文件，将数据从硬盘载入内存。
通过RDB方式的持久化，一旦Redis异常退出，就会丢失最近一次快照以后更改的数据。

<a id="aof方式"></a>
### AOF方式
默认情况下Redis没有开启AOF（append only file）方式的持久化，可以通过appendonly参数启用`appendonly yes`。开启AOF方式持久化后每执行一条会更改Redis的数据的命令，Redis就会将该命令写进硬盘中的AOF文件。由于操作系统的缓存机制，数据并没有真正的写进硬盘，而是进入了系统的硬盘缓存。默认情况下系统每30秒会执行一次同步操作。为了防止硬盘缓存数据丢失，可以在Redis写入AOF文件后主动要求系统将硬盘缓存同步到硬盘上。可以通过`appendfsync`参数设置同步的时机。

```
appendfsync always //每次执行写入都会执行同步，最安全最慢
appendfsync everysec  //保证了性能也保证了安全
appendfsync no //由操作系统决定何时进行同步操作
```

<a id="集群"></a>
## 集群
**主从复制**

主数据库可以进行读写操作，当主数据库的数据发生变化时会自动将数据同步到从数据库。从数据库一般是只读的。
```
redis-server //启动Redis实例作为主数据库 
redis-server --port 6380 --slaveof  127.0.0.1 6379  //启动另一个实例作为从数据库 
slaveof 127.0.0.1 6379
SLAVEOF NO ONE //停止接收其他数据库的同步并转化为主数据库。
```

**Redis复制原理**

当一个从数据库启动后，会向主数据库发送SYNC命令。同时主数据库接收到命令后开始在后台保存快照（RDB持久化过程），并将保存快照过程接收到的命令缓存起来。当快照完成后，Redis会将快照文件和缓存的命令发送到从数据库。从数据库接收到后，会载入快照文件并执行缓存的命令。以上过程称为复制初始化。复制初始化完成后，主数据库每次收到写命令就会将命令同步给从数据库，从而实现主从数据库数据的一致性。

**读写分离**

通过复制可以实现读写分离，提高服务器的负载能力。很多场景下对数据库的读频率大于写，当单机的Redis无法应付大量的读请求时，可以通过复制功能建立多个从数据库节点，主数据库只进行写操作，从数据库负责读操作。这种一主多从的结构很适合读多写少的场景。

**从数据库持久化**

持久化的操作比较耗时，为了提高性能，可以建立一个从数据库，并在从数据库启用持久化，同时在主数据库禁用持久化。当从数据库奔溃重启后主数据库会自动将数据同步过来，数据不会丢失。

当主数据库奔溃时，可以手动通过从数据库恢复主数据库的数据。

- 首先，从数据库使用`SLAVE NO ONE`将从数据库提升为主数据库继续服务；
- 启动奔溃的主数据库，通过`SLAVEOF`命令将其设置为新的主数据库的从数据库，即可将数据同步过来。

