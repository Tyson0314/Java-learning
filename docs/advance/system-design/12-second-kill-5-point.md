---
sidebar: heading
title: 秒杀系统设计的5个要点
category: 场景设计
tag:
  - 场景设计
head:
  - - meta
    - name: keywords
      content: 场景设计面试题,秒杀系统设计,场景设计
  - - meta
    - name: description
      content: 场景设计常见面试题总结，让天下没有难背的八股文！
---

# 秒杀系统设计的5个要点

## 秒杀系统涉及到的知识点

- 高并发，cache，锁机制
- 基于缓存架构redis,Memcached的先进先出队列。
- 稍微大一点的秒杀，肯定是分布式的集群的，并发来自于多个节点的JVM，synchronized所有在JVM上加锁是不行了
- 数据库压力
- 秒杀超卖问题
- 如何防止用户来刷， 黑名单？IP限制？
- 利用memcached的带原子性特性的操作做并发控制

## 秒杀简单设计方案

比如有10件商品要秒杀，可以放到缓存中，读写时不要加锁。 当并发量大的时候，可能有25个人秒杀成功，这样后面的就可以直接抛秒杀结束的静态页面。进去的25个人中有15个人是不可能获得商品的。所以可以根据进入的先后顺序只能前10个人购买成功。后面15个人就抛商品已秒杀完。

比如某商品10件物品待秒。假设有100台web服务器(假设web服务器是Nginx + Tomcat),n台app服务器,n个数据库

第一步 如果Java层做过滤，可以在每台web服务器的业务处理模块里做个计数器AtomicInteger(10)=待秒商品总数,decreaseAndGet()>＝0的继续做后续处理，<0的直接返回秒杀结束页面，这样经过第一步的处理只剩下100台*10个=1000个请求。

第二步，memcached 里以商品id作为key的value放个10，每个web服务器在接到每个请求的同时，向memcached服务器发起请求，利用memcached的decr(key,1)操作返回值>=0的继续处理，其余的返回秒杀失败页面，这样经过第二步的处理只剩下100台中最快速到达的10个请求。

第三步，向App服务器发起下单操作事务。

第四步，App服务器向商品所在的数据库请求减库存操作(操作数据库时可以 "update table set count=count-1 where id=商品id and count>0;" update 成功记录数为1，再向订单数据库添加订单记录，都成功后提交整个事务，否则的话提示秒杀失败，用户进入支付流程。

## 看看淘宝的秒杀

一、前端

面对高并发的抢购活动，前端常用的三板斧是【扩容】【静态化】【限流】

**扩容**：加机器，这是最简单的方法，通过增加前端池的整体承载量来抗峰值。

**静态化**：将活动页面上的所有可以静态的元素全部静态化，并尽量减少动态元素。通过CDN来抗峰值。

**限流**：一般都会采用IP级别的限流，即针对某一个IP，限制单位时间内发起请求数量。或者活动入口的时候增加游戏或者问题环节进行消峰操作。

**有损服务**：最后一招，在接近前端池承载能力的水位上限的时候，随机拒绝部分请求来保护活动整体的可用性。

二、那么后端的数据库在高并发和超卖下会遇到什么问题呢

- 首先MySQL自身对于高并发的处理性能就会出现问题，一般来说，MySQL的处理性能会随着并发thread上升而上升，但是到了一定的并发度之后会出现明显的拐点，之后一路下降，最终甚至会比单thread的性能还要差。
- 其次，超卖的根结在于减库存操作是一个事务操作，需要先select，然后insert，最后update -1。最后这个-1操作是不能出现负数的，但是当多用户在有库存的情况下并发操作，出现负数这是无法避免的。
- 最后，当减库存和高并发碰到一起的时候，由于操作的库存数目在同一行，就会出现争抢InnoDB行锁的问题，导致出现互相等待甚至死锁，从而大大降低MySQL的处理性能，最终导致前端页面出现超时异常。

针对上述问题，如何解决呢？ 淘宝的高大上解决方案：

I：**关闭死锁检测**，提高并发处理性能。

II：**修改源代码**，将排队提到进入引擎层前，降低引擎层面的并发度。

III：**组提交**，降低server和引擎的交互次数，降低IO消耗。

**解决方案1：**将存库从MySQL前移到Redis中，所有的写操作放到内存中，由于Redis中不存在锁故不会出现互相等待，并且由于Redis的写性能和读性能都远高于MySQL，这就解决了高并发下的性能问题。然后通过队列等异步手段，将变化的数据异步写入到DB中。

优点：解决性能问题

缺点：没有解决超卖问题，同时由于异步写入DB，存在某一时刻DB和Redis中数据不一致的风险。

**解决方案2：**引入队列，然后将所有写DB操作在单队列中排队，完全串行处理。当达到库存阀值的时候就不在消费队列，并关闭购买功能。这就解决了超卖问题。

优点：解决超卖问题，略微提升性能。

缺点：性能受限于队列处理机处理性能和DB的写入性能中最短的那个，另外多商品同时抢购的时候需要准备多条队列。

**解决方案3：**将写操作前移到MC中，同时利用MC的轻量级的锁机制CAS来实现减库存操作。

优点：读写在内存中，操作性能快，引入轻量级锁之后可以保证同一时刻只有一个写入成功，解决减库存问题。

缺点：没有实测，基于CAS的特性不知道高并发下是否会出现大量更新失败？不过加锁之后肯定对并发性能会有影响。

**解决方案4：**将提交操作变成两段式，先申请后确认。然后利用Redis的原子自增操作，同时利用Redis的事务特性来发号，保证拿到小于等于库存阀值的号的人都可以成功提交订单。然后数据异步更新到DB中。

优点：解决超卖问题，库存读写都在内存中，故同时解决性能问题。

缺点：由于异步写入DB，可能存在数据不一致。另可能存在少买，也就是如果拿到号的人不真正下订单，可能库存减为0，但是订单数并没有达到库存阀值。

**总结**

1、前端三板斧【扩容】【限流】【静态化】

2、后端两条路【内存】+【排队】

