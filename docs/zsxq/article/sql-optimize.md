在应用开发的早期，数据量少，开发人员开发功能时更重视功能上的实现，随着生产数据的增长，很多SQL语句开始暴露出性能问题，对生产的影响也越来越大，有时可能这些有问题的SQL就是整个系统性能的瓶颈。

## SQL优化一般步骤

#### 1、通过慢查日志等定位那些执行效率较低的SQL语句

#### 2、explain 分析SQL的执行计划

需要重点关注type、rows、filtered、extra。

type由上至下，效率越来越高

- ALL 全表扫描
- index 索引全扫描
- range 索引范围扫描，常用语<,<=,>=,between,in等操作
- ref 使用非唯一索引扫描或唯一索引前缀扫描，返回单条记录，常出现在关联查询中
- eq_ref 类似ref，区别在于使用的是唯一索引，使用主键的关联查询
- const/system 单条记录，系统会把匹配行中的其他列作为常数处理，如主键或唯一索引查询
- null MySQL不访问任何表或索引，直接返回结果 虽然上至下，效率越来越高，但是根据cost模型，假设有两个索引idx1(a, b, c),idx2(a, c)，SQL为"select * from t where a = 1 and b in (1, 2) order by c";如果走idx1，那么是type为range，如果走idx2，那么type是ref；当需要扫描的行数，使用idx2大约是idx1的5倍以上时，会用idx1，否则会用idx2

Extra

- Using filesort：MySQL需要额外的一次传递，以找出如何按排序顺序检索行。通过根据联接类型浏览所有行并为所有匹配WHERE子句的行保存排序关键字和行的指针来完成排序。然后关键字被排序，并按排序顺序检索行。
- Using temporary：使用了临时表保存中间结果，性能特别差，需要重点优化
- Using index：表示相应的 select 操作中使用了覆盖索引（Coveing Index）,避免访问了表的数据行，效率不错！如果同时出现 using where，意味着无法直接通过索引查找来查询到符合条件的数据。
- Using index condition：MySQL5.6之后新增的ICP，using index condtion就是使用了ICP（索引下推），在存储引擎层进行数据过滤，而不是在服务层过滤，利用索引现有的数据减少回表的数据。

#### 3、show profile 分析

了解SQL执行的线程的状态及消耗的时间。默认是关闭的，开启语句“set profiling = 1;”

```
SHOW PROFILES ;
SHOW PROFILE FOR QUERY  #{id};
```

#### 4、trace

trace分析优化器如何选择执行计划，通过trace文件能够进一步了解为什么优惠券选择A执行计划而不选择B执行计划。

```
set optimizer_trace="enabled=on";
set optimizer_trace_max_mem_size=1000000;
select * from information_schema.optimizer_trace;
```

#### 5、确定问题并采用相应的措施

- 优化索引
- 优化SQL语句：修改SQL、IN 查询分段、时间查询分段、基于上一次数据过滤
- 改用其他实现方式：ES、数仓等
- 数据碎片处理

## 场景分析

#### 案例1、最左匹配

索引

```
KEY `idx_shopid_orderno` (`shop_id`,`order_no`)
```

SQL语句

```
select * from _t where orderno=''
```

查询匹配从左往右匹配，要使用order_no走索引，必须查询条件携带shop_id或者索引(`shop_id`,`order_no`)调换前后顺序。

#### 案例2、隐式转换

索引

```
KEY `idx_mobile` (`mobile`)
```

SQL语句

```
select * from _user where mobile=12345678901
```

隐式转换相当于在索引上做运算，会让索引失效。mobile是字符类型，使用了数字，应该使用字符串匹配，否则MySQL会用到隐式替换，导致索引失效。

#### 案例3、大分页

索引

```
KEY `idx_a_b_c` (`a`, `b`, `c`)
```

SQL语句

```
select * from _t where a = 1 and b = 2 order by c desc limit 10000, 10;
```

对于大分页的场景，可以优先让产品优化需求，如果没有优化的，有如下两种优化方式， 一种是把上一次的最后一条数据，也即上面的c传过来，然后做“c < xxx”处理，但是这种一般需要改接口协议，并不一定可行。

另一种是采用延迟关联的方式进行处理，减少SQL回表，但是要记得索引需要完全覆盖才有效果，SQL改动如下

```
select t1.* from _t t1, (select id from _t where a = 1 and b = 2 order by c desc limit 10000, 10) t2 where t1.id = t2.id;
```

#### 案例4、in + order by

索引

```
KEY `idx_shopid_status_created` (`shop_id`, `order_status`, `created_at`)
```

SQL语句

```
select * from _order where shop_id = 1 and order_status in (1, 2, 3) order by created_at desc limit 10
```

in查询在MySQL底层是通过n*m的方式去搜索，类似union，但是效率比union高。in查询在进行cost代价计算时（代价 = 元组数 * IO平均值），是通过将in包含的数值，一条条去查询获取元组数的，因此这个计算过程会比较的慢，所以MySQL设置了个临界值(eq_range_index_dive_limit)，5.6之后超过这个临界值后该列的cost就不参与计算了。

因此会导致执行计划选择不准确。默认是200，即in条件超过了200个数据，会导致in的代价计算存在问题，可能会导致Mysql选择的索引不准确。

处理方式，可以(`order_status`, `created_at`)互换前后顺序，并且调整SQL为延迟关联。

#### 案例5、范围查询阻断，后续字段不能走索引

索引

```
KEY `idx_shopid_created_status` (`shop_id`, `created_at`, `order_status`)
```

SQL语句

```
select * from _order where shop_id = 1 and created_at > '2021-01-01 00:00:00' and order_status = 10
```

范围查询还有“IN、between”

#### 案例6、不等于、不包含不能用到索引的快速搜索。（可以用到ICP）

```
select * from _order where shop_id=1 and order_status not in (1,2)
select * from _order where shop_id=1 and order_status != 1
```

在索引上，避免使用NOT、!=、<>、!<、!>、NOT EXISTS、NOT IN、NOT LIKE等

#### 案例7、优化器选择不使用索引的情况

如果要求访问的数据量很小，则优化器还是会选择辅助索引，但是当访问的数据占整个表中数据的蛮大一部分时（一般是20%左右），优化器会选择通过聚集索引来查找数据。

```
select * from _order where  order_status = 1
```

查询出所有未支付的订单，一般这种订单是很少的，即使建了索引，也没法使用索引。

#### 案例8、复杂查询

```
select sum(amt) from _t where a = 1 and b in (1, 2, 3) and c > '2020-01-01';
select * from _t where a = 1 and b in (1, 2, 3) and c > '2020-01-01' limit 10;
```

如果是统计某些数据，可能改用数仓进行解决；

如果是业务上就有那么复杂的查询，可能就不建议继续走SQL了，而是采用其他的方式进行解决，比如使用ES等进行解决。

#### 案例9、asc和desc混用

```
select * from _t where a=1 order by b desc, c asc
```

desc 和asc混用时会导致索引失效

#### 案例10、大数据

对于推送业务的数据存储，可能数据量会很大，如果在方案的选择上，最终选择存储在MySQL上，并且做7天等有效期的保存。

那么需要注意，频繁的清理数据，会照成数据碎片，需要联系DBA进行数据碎片处理。

参考资料：

- 深入浅出MySQL：数据库开发、优化与管理维护（唐汉明 / 翟振兴 / 关宝军 / 王洪权）
- MySQL技术内幕——InnoDB存储引擎（姜承尧）
- https://dev.mysql.com/doc/refman/5.7/en/explain-output.html
- https://dev.mysql.com/doc/refman/5.7/en/cost-model.html
- https://www.yuque.com/docs/share/3463148b-05e9-40ce-a551-ce93a53a2c66