---
sidebar: heading
title: 如何保证消息的顺序性？
category: 消息队列
tag:
  - 消息队列
head:
  - - meta
    - name: keywords
      content: 消息队列面试题,如何保证消息消费的顺序性
  - - meta
    - name: description
      content: 高质量的消息队列常见知识点和面试题总结，让天下没有难背的八股文！
---

## 如何保证消息的顺序性？

假设有这样一个场景，使用 MySQL `binlog` 将数据从一个 MySQL 库原封不动地同步到另一个 MySQL 库里面去。

你在 MySQL 里增删改一条数据，对应出来了增删改 3 条 `binlog` 日志，接着这三条 `binlog` 发送到 MQ 里面，再消费出来依次执行，这时需要保证按照顺序去执行，不然本来是：增加、修改、删除；调换了顺序变成执行成删除、修改、增加，这就有问题了。

本来这个数据同步过来，应该最后这个数据被删除了；结果搞错了这个顺序，最后这个数据保留下来了，数据同步就出错了。

先看看顺序会错乱的俩场景：

- **RabbitMQ**：一个 queue，多个 consumer。比如，生产者向 RabbitMQ 里发送了三条数据，顺序依次是 data1/data2/data3，压入的是 RabbitMQ 的一个内存队列。有三个消费者分别从 MQ 中消费这三条数据中的一条，结果消费者 2 先执行完操作，把 data2 存入数据库，然后是 data1/data3。这明显就乱了。

![](http://img.topjavaer.cn/img/rabbitmq-order-01.png)

- **Kafka**：比如说我们建了一个 topic，有三个 partition。生产者在写的时候，其实可以指定一个 key，比如说我们指定了某个订单 id 作为 key，那么这个订单相关的数据，一定会被分发到同一个 partition 中去，而且这个 partition 中的数据一定是有顺序的。
- 消费者从 partition 中取出来数据的时候，也一定是有顺序的。到这里，顺序还是 ok 的，没有错乱。接着，我们在消费者里可能会搞**多个线程来并发处理消息**。因为如果消费者是单线程消费处理，而处理比较耗时的话，比如处理一条消息耗时几十 ms，那么 1 秒钟只能处理几十条消息，这吞吐量太低了。而多个线程并发跑的话，顺序可能就乱掉了。

![](http://img.topjavaer.cn/img/kafka-order-01.png)

### 解决方案

#### RabbitMQ

拆分多个 queue，每个 queue 一个 consumer，就是多一些 queue 而已，确实是麻烦点，这样也会造成吞吐量下降，可以在消费者内部采用多线程的方式取消费。

![](http://img.topjavaer.cn/img/rabbitmq-order-02.png)

或者就一个 queue 但是对应一个 consumer，然后这个 consumer 内部用内存队列做排队，然后分发给底层不同的 worker 来处理。

注意，这里消费者不直接消费消息，而是将消息根据关键值（比如：订单 id）进行哈希，哈希值相同的消息保存到相同的内存队列里。也就是说，需要保证顺序的消息存到了相同的内存队列，然后由一个唯一的 worker 去处理。

#### Kafka

- 一个 topic，一个 partition，一个 consumer，内部单线程消费，单线程吞吐量太低，一般不会用这个。
- 写 N 个内存 queue，具有相同 key 的数据都到同一个内存 queue；然后对于 N 个线程，每个线程分别消费一个内存 queue 即可，这样就能保证顺序性。

![](http://img.topjavaer.cn/img/kafka-order-02.png)
