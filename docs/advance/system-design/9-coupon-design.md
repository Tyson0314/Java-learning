---
sidebar: heading
title: 如何设计一个优惠券系统？
category: 场景设计
tag:
  - 场景设计
head:
  - - meta
    - name: keywords
      content: 场景设计面试题,优惠券系统设计,场景设计
  - - meta
    - name: description
      content: 场景设计常见面试题总结，让天下没有难背的八股文！
---

# 如何设计一个优惠券系统？

## 背景

部门为一个租房房源平台，为各个商家提供房源发布&C端曝光获客的功能，现在要构建一个优惠券系统，用于各个节假日节点进行商家营销活动。形式主要以商家在B端参与活动，对房源绑定优惠券，将租赁价格进行优惠，来在C端吸引用户进行租房。

### 1. 业务梳理

在清楚了大致的业务背景后，下面来进行整体的业务流程梳理，大致如下图所示。

![](http://img.topjavaer.cn/img/优惠券1.png)

首先，平台建立好活动，在商家B端将可报名的活动展示出来，商家通过报名对应优惠力度的活动，来建立对应优惠的优惠券。

然后，通过将房源与对应的优惠券建立绑定关系，来对房源数据打上优惠券标识。这样一来在C端展示房源时，就可以进行对应的优惠房源筛选，以及让用户在房源上进行领取某个类别的优惠券。

最后，用户在C端领取优惠券后，可联系商家进行实地房源考察，如果双方达成协议，即可在线上签约。而在签约时即可使用对应优惠券，实现相应的价格优惠。

至此，就是整个系统的完整正向流程了。

### 2. 技术设计

下面来对每个环节的进行相应的技术设计。

#### 2.1 建立活动

##### 2.1.1 数据表

活动信息需要如下数据项

- 报名时间范围
- 活动时间范围
- 优惠类型和具体的优惠力度
- 可报名的城市

下面就是活动信息数据表的具体设计

```
CREATE TABLE `t_activity` (
  `activeId` bigint(20) NOT NULL COMMENT '活动ID',
  `title` varchar(256) NOT NULL COMMENT '活动名称',
  `applyStartTime` timestamp NULL DEFAULT NULL COMMENT '报名开始时间',
  `applyEndTime` timestamp NULL DEFAULT NULL COMMENT '报名停止时间',
  `activityStartTime` timestamp NULL DEFAULT NULL COMMENT '活动开始时间',
  `activityEndTime` timestamp NULL DEFAULT NULL COMMENT '活动结束时间',
  `cityIds` varchar(256) NOT NULL COMMENT '覆盖城市，多个逗号分隔',
  `couponType` tinyint(4) NOT NULL DEFAULT '0' COMMENT '优惠类型，1 直减；2 折扣；3免费住N天；4免押金；5特价房',
  `lowerLimit` int NOT NULL DEFAULT 0 COMMENT '优惠数值下限',
  `upperLimit` int NOT NULL DEFAULT 0 COMMENT '优惠数值上限',
  `description` text COMMENT '活动描述',
  `cubeType` smallint(6) NOT NULL DEFAULT '1001' COMMENT '活动类型',
  `foreignId` bigint(20) NOT NULL DEFAULT '0' COMMENT '外部ID',
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '活动状态',
  `createTime` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `updateTime` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `recordStatus` tinyint(4) NOT NULL DEFAULT '0' COMMENT '数据状态',
  PRIMARY KEY (`activeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='活动信息表';
```

##### 2.1.2 数据读取

在商家端可以通过status字段和cityIds字段来进行可报名活动的展示。

C端读取的展示代码里可以使用设计模式中的代理模式来加一层缓存，在进行中的活动会将数据推入到cache层中。

##### 2.1.3 活动状态流转

通过crontab定时任务，每分钟进行时间段的检查，来更新对应的status字段，完成活动状态的流转。

##### 2.1.4 数据读取

可以使用设计模式中的代理模式来加一层缓存，非强实时的查询走cache，cache中不存在或需实时数据的再走db。

#### 2.2 商家报名建券

##### 2.2.1 数据表

```
CREATE TABLE `t_couponmeta` (
  `couponMetaId` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '券id',
  `appId` int(11) NOT NULL DEFAULT '1' COMMENT '区分建立来源',
  `activeId` bigint(20) NOT NULL DEFAULT '0' COMMENT '活动ID',
  `companyId` bigint(20) NOT NULL COMMENT '公司编号',
  `cityId` int(11) NOT NULL COMMENT '城市id',
  `companyName` varchar(255) DEFAULT NULL COMMENT '公司名称',
  `companyShortName` varchar(255) DEFAULT NULL COMMENT '公司简称',
  `couponType` tinyint(4) NOT NULL COMMENT '优惠券类型',
  `title` varchar(256) NOT NULL COMMENT '优惠券名称',
  `directDiscount` int(11) NOT NULL DEFAULT '0' COMMENT '直减券优惠力度',
  `discount` int(11) NOT NULL DEFAULT '0' COMMENT '折扣力度',
  `freeLive` int(11) NOT NULL DEFAULT '0' COMMENT '免费住n天券',
  `threshold` varchar(256) NOT NULL COMMENT '使用门槛',
  `deduction` tinyint(4) NOT NULL DEFAULT '1' COMMENT '抵扣说明 1首月抵扣，2 平摊到月',
  `totalAmount` int(11) NOT NULL DEFAULT '0' COMMENT '券总数',
  `applyAmount` int(11) NOT NULL DEFAULT '0' COMMENT '已领取总数',
  `activityStartTime` timestamp NULL DEFAULT NULL COMMENT '活动开始时间',
  `activityEndTime` timestamp NULL DEFAULT NULL COMMENT '活动结束时间',
  `startTime` timestamp NULL DEFAULT NULL COMMENT '券使用开始时间',
  `expireTime` timestamp NULL DEFAULT NULL COMMENT '券使用结束时间',
  `status` int(11) NOT NULL DEFAULT '10' COMMENT '10：新建未启用，20：已启用，30：过期, 40 已结束 50 已中止',
  `expireType` tinyint(4) NOT NULL DEFAULT '1' COMMENT '类型：1固定有效期类型，2浮动有效期类型',
  `validPeriod` tinyint(4) NOT NULL DEFAULT '0' COMMENT '浮动有效期（单位：天）',
  `tenantRange` tinyint(1) NOT NULL DEFAULT '1' COMMENT '租客范围枚举值',
  `customScope` varchar(256) NOT NULL DEFAULT '' COMMENT '自定义租客范围',
  `comment` varchar(50) DEFAULT NULL COMMENT '备注',
  `cubeType` smallint(6) NOT NULL DEFAULT '1001' COMMENT '活动类型',
  `updateTime` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `createTime` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `recordStatus` tinyint(4) DEFAULT '0' COMMENT '状态 0默认 -1删除',
  PRIMARY KEY (`couponMetaId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='优惠券表';
```

##### 2.2.2 数据读取

同样可以使用设计模式中的代理模式来加一层缓存，对于C端大量读取优惠券信息的场景，需要让读请求尽量都在cache层处理完成，降低db的压力。

##### 2.2.3 状态流转

优惠券的状态流转如图所示

![](http://img.topjavaer.cn/img/优惠券2.png)

大部分状态取决于活动的状态（除中止和过期），所以在活动状态的crontab任务中，当发现活动状态发生变更后，会将下面的优惠券状态变更任务以MQ发送出来，异步来修改优惠券的状态。而优惠券状态的变更又会涉及联动数据的更新，举例来说：

- 状态从开始->启用时，需要更新房源C端索引数据的优惠券标识，并初始化库存数据（这部分在领券时候细说）；
- 状态从启用->结束时，需要将房源上的优惠券标识去掉，清空缓存数据；
- ...

可以想到，在每个状态流转的时候，都有很多操作来做。为了保证业务逻辑清晰，状态流转我采用了状态模式来进行实现，类图如下所示：

![](http://img.topjavaer.cn/img/优惠券3.png)

而状态更新后，C端房源索引数据/b端基础房源数据/缓存中的数据，这些数据的更新使用了**观察者模式**监听状态的变更，在观察者中通过发送mq异步来进行数据更新，类图如下所示：

![](http://img.topjavaer.cn/img/优惠券4.png)

通过将需要的观察者注册到CouponStateMachine中，在进行实际的doChangeStatus操作后，notify所有的观察者即可保证联动数据的正确性。

#### 2.3 绑定优惠券

#### 2.3.1 数据表

将商家b端绑定了的优惠券全量（新建/启用中/未过期）数据存于MySQL数据表中，表结构比较简单，如下所示：

```
CREATE TABLE `t_bindcoupon` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `couponMetaId` int(11) NOT NULL COMMENT '券id',
  `companyId` bigint(20) NOT NULL COMMENT '公司编号',
  `activityStatus` tinyint(4) NOT NULL COMMENT '状态 0 准备中 1 活动中 2 活动结束 券未失效 3活动结束券失效',
  `houseId` bigint(20) NOT NULL DEFAULT '0' COMMENT '房源id',
  `recordStatus` tinyint(4) NOT NULL COMMENT '数据状态 0 有效，-1 失效',
  `createTime` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `updateTime` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_companyId_couponMetaId` (`companyId`,`couponMetaId`),
  KEY `idx_planeId` (`planeId`),
  KEY `idx_houseid_activitystatus` (`houseId`,`activityStatus`)
) ENGINE=InnoDB AUTO_INCREMENT=17379 DEFAULT CHARSET=utf8 COMMENT='优惠券绑定范围表'
```

该表主要是记录房源和优惠券之间的绑定关系，并记录当前绑定的状态，该状态用于限制同一个房源不可以绑太多的有效优惠券，限制商家为了增加c端曝光，胡乱操作。

> 操作房源绑定优惠券的时候，会使用分布式锁，避免并发绑定操作导致超限

##### 2.3.2 数据展示

数据的展示依赖于C端的索引数据，索引数据中存储的都是在生效状态的优惠券信息，字段结合业务场景用于筛选和展示，具体如下：

1. 优惠券ID（多值）
2. 活动ID（多值）
3. 参加的活动类型（多值）

通过索引筛选条件检索出房源数据后，即可获取房源的完整数据来获取该房源绑定了哪些优惠券，进行优惠券数据的展示。

###### 2.3.3 状态流转

对于绑定关系的状态实时更新有两个触发动作，根据情况去更新数据的status和recordStatus两个字段：

依托于2.2.3中的优惠券状态的MQ消息 db绑定数据发生变化时（改/增/减），同样也会发送MQ，异步更新索引中的数据。

#### 2.4 C端用户领券

C端用户领券是一个比较重要的地方，核心要求就是绝对不能多领，尽可能避免少领。具体设计流程图如下：

![](http://img.topjavaer.cn/img/优惠券5.png)

流程大概分为三步：

1. 请求校验
2. redis库存扣减
3. 领取记录和更新库存任务以事务形式写入MySQL

下面根据图中所示逐步进行说明

##### 2.4.1 数据读取

由于C端浏览券详情&领券可能会是一个并发量较高的操作，所以尽可能都从缓存中读数据，包括以下数据：

1. 活动信息
2. 优惠券信息
3. 优惠券库存

当活动开始前五分钟会禁止编辑活动信息和优惠券信息，活动开始时将上述数据推入缓存中，不设置过期时间，待活动状态转为结束时再清理数据。

同时在web服务集群中，对这1 2数据项做了一层短时间的本地缓存，减少请求redis集群的网络开销。

##### 2.4.2 校验

首先，服务端收到用户领券的请求后，会在redis中校验是否存在领取记录cache。这里可以使用布隆过滤器来实现，key为优惠券id，若用户id存在其中则直接返回。

然后，会进行优惠券状态校验，优惠券数据在活动开始时即推入了redis中，所以直接用redis中的数据校验即可。

最后，会校验是否存在该优惠券的存库数据，为了提高容错性和可用性，若不存在则发送一个初始化库存任务的MQ，然后直接返回，由MQ异步来重新初始化库存数据，避免缓存击穿的问题。

##### 2.4.3 库存扣减

直接操作db，以使用乐观锁形式扣减库存，MySQL的库存更新操作会成并发热点，请求都会在行锁的争抢中阻塞，支持的并发量有限，并且会给db带来压力。由于redis可以保证操作的原子性，并且数据在内存中，适合高并发场景，所以通过redis来完成库存的扣减。

将db的库存更新操作通过db消息任务表，进行异步化，串行化，避免阻塞的同时也降低锁的争抢。

但是扣减库存以redis为准的话，就分为几种情况:

1. redis扣减成功，但是db领取记录和更新库存任务写入失败，执行回滚，incr库存数量。
2. redis扣减失败（没库存/redis宕机）,不会执行db操作。
3. redis扣减成功，db事务执行时，服务运行机器重启或宕机，没有回滚库存，产生**少领情况**。
4. redis扣减成功后redis主库宕机，DB写入数据成功，但扣减数据未同步到从库，使用从库进行扣减时产生**超领现象**。

1 2 属于正常情况，3 4 属于异常情况。

对于情况3， 可以在redis中库存扣减光时，触发异步任务来对比库存数据，若还有可领取库存，则更新redis的库存信息，达到避免少领的情况。

对于情况4，由于redis无法保证主从强一致，在数据操作丢失的情况下，就有可能会产生超领情况。

我的想法是，有以下几种方式：

1. 若更新库存操作已经存在超领的情况，将用户领取优惠券的数据进行删除或冻结，避免带来损失。
2. 监控剩余库存量每变动5%，就执行异步任务将优惠券状态进行冻结，让C端无法领券。然后将当前消息事务表中db的扣减任务都处理完成后，进行redis和db的数据校验同步，同步完成后将优惠券解冻，恢复正常领取。
3. 由于redis属于AP，若要保证数据的强一致性则牺牲可用性，改为使用CP的存储。
4. 优惠券核销时检查核销数量是否超过总数量，若达到阈值，则提示优惠券不可用。
5. 根据优惠券发放总数量，生成一批优惠券id，同时存入db与redis队列中，通过pop id生成优惠券领取记录，根据id是否相同来限制重复领取，从而达到防止超领的情况。

第一种方式，用户领券成功到更新db库存任务的执行，在这中间时间窗口很小的情况下，可以尽可能的避免超领并使用的情况。

第二种方式，也不能完全解决超量的问题，只能以牺牲很少时间的领取功能，矫正领取请求非激增的情况下数据不一致的情况。

第三种方式不做赘述。

第四种方式，被动的进行数量的校验，保证使用的优惠券不会超过发放的总数量，个人认为是比较柔和的影响范围最小的处理方式了，只不过可能会引起客诉，（为什么领了还是不能用！！！）

第五种方式，db中根据优惠券发放总数量生成一批领取记录，但是领取用户id以及领取时间空着。将这批记录的id存入redis队列中，扣库存的时候pop该队列，获取id以后，通过乐观锁方式更新对应id的数据行（where id = x and userId = 0），若更新失败则领取失败。这样可以有效的防止第四种情况产生，需要考虑的是若发放数量过多，而实际领取很少，还需活动结束后清理占用的数据表空间。事前需要预热插入db中的数据，事后需要清理没有绑定userId的数据。

在我的业务场景下，考量过后主要选用了第四种方式，第二种方式选择了每天凌晨四点进行一次，第一种没有删除而仅仅是进行了报警。

> 若有更好的方式，希望大神能够指点一下

#### 2.5 优惠券核销

以微服务形式，提供用户优惠券获取接口，以及状态变更接口给调用方使用，状态流转分为未使用、锁定、已使用三种状态。

当客户下了签约订单时，将对应使用的优惠券进行锁定。若订单完成则调用接口将状态流转为已使用，若订单取消则回滚优惠券的状态为未使用。

## 未来可优化方向

1. 用户的优惠券数据分库分表，进行数据水平拆分，提升db读写能力。
2. redis集群以分片形式部署，提升可用性及容量。
3. 集群拆分，每个集群仅处理部分优惠券请求，通过网关打散请求到不同的pod中。
4. 引入jd-hotkey组件，热key实时同步到集群本地缓存中，减少访问分布式缓存。
5. 引入canal组件，通过binlog同步db更新的信息，更新缓存并进行数据联动更新。

## 总结

至此，一个完整的优惠券系统就构建完毕了。

遵循读多写少用缓存，写多读少用队列的原则。

对于展现的活动数据，代码通过代理模式尽可能的通过缓存进行读取。使用了多级缓存的同时，为了避免产生缓存击穿的场景，对于活动中的数据都采用了主动推数据到redis中的方式。

对于活动->优惠券->房源的联动数据的写操作，代码通过状态模式+观察者模式实现，以及MQ控制并发量的异步更新。

对于库存扣减采用了redis，依托于它的原子性，但是redis不保证集群内部数据强一致性。为了避免超领带来的损失问题，在核销优惠券时进行了数量阈值校验。

对于热点的db库存更新则采用了db事务消息表，通过事务保证领取记录插入成功的同时一定会落入更新库存任务，从而异步串行的进行库存更新。

> 来源：https://juejin.cn/post/7160643319612047367
