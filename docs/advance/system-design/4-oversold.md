---
sidebar: heading
title: 超卖问题
category: 场景设计
tag:
  - 场景设计
head:
  - - meta
    - name: keywords
      content: 场景设计面试题,超卖问题,场景设计
  - - meta
    - name: description
      content: 场景设计常见面试题总结，让天下没有难背的八股文！
---

# 超卖问题

先到数据库查询库存，在减库存。不是原子操作，会有超卖问题。

通过加排他锁解决该问题。

- 开始事务。
- 查询库存，并显式的设置排他锁：SELECT * FROM table_name WHERE … FOR UPDATE
- 生成订单。
- 去库存，update会隐式的设置排他锁：UPDATE products SET count=count-1 WHERE id=1
- commit，释放锁。

也可以通过乐观锁实现。使用版本号实现乐观锁。

假设此时version = 100， num = 1; 100个线程进入到了这里，同时他们select出来版本号都是version = 100。

然后直接update的时候，只有其中一个先update了，同时更新了版本号。

那么其他99个在更新的时候，会发觉version并不等于上次select的version，就说明version被其他线程修改过了，则放弃此次update，重试直到成功。

```mysql
select version from goods WHERE id= 1001
update goods set num = num - 1, version = version + 1 WHERE id= 1001 AND num > 0 AND version = @version(上面查到的version);
```
