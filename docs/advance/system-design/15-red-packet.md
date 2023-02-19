---
sidebar: heading
title: 如何设计一个抢红包系统
category: 场景设计
tag:
  - 场景设计
head:
  - - meta
    - name: keywords
      content: 场景设计面试题,抢红包系统设计,场景设计
  - - meta
    - name: description
      content: 场景设计常见面试题总结，让天下没有难背的八股文！
---

# 如何设计一个抢红包系统

## 前言

本篇分享如何设计一个抢红包系统，希望对大家有所帮助。主要展示抢红包系统的设计，红包算法不是重点，所以没有二倍均值法之类的实现。

## 需求分析

常见的红包系统，由用户指定金额、红包总数来完成红包的创建，然后通过某个入口将红包下发至目标用户，用户看到红包后，点击红包，随机获取红包，最后，用户可以查看自己抢到的红包。整个业务流程不复杂，难点在于抢红包这个行为可能有很高的并发。所以，系统设计的优化点主要关注在抢红包这个行为上。

由于查看红包过于简单，所以本文不讨论。那么系统用例就只剩下`发、抢`两种。

1. 发红包：用户设置红包总金额、总数量
2. 抢红包：用户从总红包中随机获得一定金额

没什么好说的，相信大家的微信红包没少抢，一想都明白。看起来业务很简单，却其实还有点小麻烦。首先，抢红包必须保证高可用，不然用户会很愤怒。其次，必须保证系统数据一致性不能超发，不然抢到红包的用户收不到钱，用户会很愤怒。最后一点，系统可能会有很高的并发。

OK，分析完直接进行详细设计。所以简简单单只有两个接口：

1. 发红包
2. 抢红包

## 表结构设计

这里直接给出建表语句：

红包活动表：

```sql
CREATE TABLE `t_redpack_activity`
(
    `id`         bigint(20)     NOT NULL COMMENT '主键',
    `total_amount`     decimal(10, 2) NOT NULL DEFAULT '0.00' COMMENT '总金额',
    `surplus_amount`     decimal(10, 2) NOT NULL DEFAULT '0.00' COMMENT '剩余金额',
    `total` bigint(20)     NOT NULL DEFAULT '0' COMMENT '红包总数',
    `surplus_total` bigint(20)     NOT NULL DEFAULT '0' COMMENT '红包剩余总数',
    `user_id`    bigint(20)     NOT NULL DEFAULT '0' COMMENT '用户编号',
    `version` bigint(20)     NOT NULL DEFAULT '0' COMMENT '版本号',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8;
复制代码
```

红包表：

```sql
CREATE TABLE `t_redpack`
(
    `id`         bigint(20)     NOT NULL COMMENT '主键',
    `activity_id`         bigint(20)     NOT NULL DEFAULT 0 COMMENT '红包活动ID',
    `amount`     decimal(10, 2) NOT NULL DEFAULT '0.00' COMMENT '金额',
    `status`     TINYINT(4) NOT NULL DEFAULT 0 COMMENT '红包状态 1可用 2不可用',
    `version` bigint(20)     NOT NULL DEFAULT '0' COMMENT '版本号',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8;
复制代码
```

明细表：

```sql
CREATE TABLE `t_redpack_detail`
(
    `id`         bigint(20)     NOT NULL COMMENT '主键',
    `amount`     decimal(10, 2) NOT NULL DEFAULT '0.00' COMMENT '金额',
    `user_id`    bigint(20)     NOT NULL DEFAULT '0' COMMENT '用户编号',
    `redpack_id` bigint(20)     NOT NULL DEFAULT '0' COMMENT '红包编号',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8;
复制代码
```

活动表，就是你发了多少个红包，并且需要维护剩余金额。明细表是用户抢到的红包明细。红包表是每一个具体的红包信息。为什么需要三个表呢？事实上如果没有红包表也是可以的。但我们的方案`预先分配红包`需要使用一张表来记录红包的信息，所以设计的时候才有此表。

OK，分析完表结构其实方案已经七七八八差不多了。请接着看下面的方案，从简单到复杂的过度。

## 基于分布式锁的实现

![](http://img.topjavaer.cn/img/抢红包1.png)

基于分布式锁的实现最为简单粗暴，整个抢红包接口以`activityId`作为`key`进行加锁，保证同一批红包抢行为都是串行执行。分布式锁的实现是由`spring-integration-redis`工程提供，核心类是`RedisLockRegistry`。锁通过`Redis`的`lua`脚本实现，且实现了阻塞式本地可重入。

## 基于乐观锁的实现

![](http://img.topjavaer.cn/img/抢红包2.png)

第二种方式，为红包活动表增加乐观锁版本控制，当多个线程同时更新同一活动表时，只有一个 clien 会成功。其它失败的 client 进行循环重试，设置一个最大循环次数即可。此种方案可以实现并发情况下的处理，但是冲突很大。因为每次只有一个人会成功，其他 client 需要进行重试，即使重试也只能保证一次只有一个人成功，因此 TPS 很低。当设置的失败重试次数小于发放的红包数时，可能导致最后有人没抢到红包，实际上还有剩余红包。

## 基于悲观锁的实现

![](http://img.topjavaer.cn/img/抢红包3.png)

由于红包活动表增加乐观锁冲突很大，所以可以考虑使用使用悲观锁：`select * from t_redpack_activity where id = #{id} for update`，注意悲观锁必须在事务中才能使用。此时，所有的抢红包行为变成了串行。此种情况下，悲观锁的效率远大于乐观锁。

## 预先分配红包，基于乐观锁的实现

![](http://img.topjavaer.cn/img/抢红包4.png)

可以看到，如果我们将乐观锁的维度加在红包明细上，那么冲突又会降低。因为之前红包明细是用户抢到后才创建的，那么现在需要预先分配红包，即创建红包活动时即生成 N 个红包，通过状态来控制可用/不可用。这样，当多个 client 抢红包时，获取该活动下所有可用的红包明细，随机返回其中一条然后再去更新，更新成功则代表用户抢到了该红包，失败则代表出现了冲突，可以循环进行重试。如此，冲突便被降低了。

## 基于 Redis 队列的实现

![](http://img.topjavaer.cn/img/抢红包5.png)

和上一个方案类似，不过，用户发放红包时会创建相应数量的红包，并且加入到 Redis 队列中。抢红包时会将其弹出。`Redis`队列很好的契合了我们的需求，每次弹出都不会出现重复的元素，用完即销毁。缺陷：抢红包时一旦从队列弹出，此时系统崩溃，恢复后此队列中的红包明细信息已丢失，需要人工补偿。

## 基于 Redis 队列，异步入库

![](http://img.topjavaer.cn/img/抢红包6.png)

这种方案的是抢到红包后不操作数据库，而是保存持久化信息到`Redis`中，然后返回成功。通过另外一个线程`UserRedpackPersistConsumer`，拉取持久化信息进行入库。需要注意的是，此时的拉取动作如果使用普通的`pop`仍然会出现`crash point`的问题，所以考虑到可用性，此处使用`Redis`的`BRPOPLPUSH`操作，弹出元素后加入备份到另外一个队列，保证此处崩溃后可以通过备份队列自动恢复。崩溃恢复线程`CrashRecoveryThread`通过定时拉取备份信息，去 DB 中查证是否持久化成功，如果成功则清除此元素，否则进行补偿并清除此元素。如果在操作数据库的过程中出现异常会记录错误日志`redpack.persist.log`，此日志使用单独的文件和格式，方便进行补偿（一般不会触发）。

## 后语

当然，一个健壮的系统可能还要考虑到方方面面。发红包本身如果是数据量特别大的情况要还需要做多副本方案。本文只是演示各种方案的优缺点，仅供参考。另外，如果采用`Redis`则需要做高可用。



> 参考链接：https://juejin.cn/post/6925947709517987848
