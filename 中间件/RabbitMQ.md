<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [简介](#%E7%AE%80%E4%BB%8B)
  - [基本概念](#%E5%9F%BA%E6%9C%AC%E6%A6%82%E5%BF%B5)
  - [什么时候使用MQ](#%E4%BB%80%E4%B9%88%E6%97%B6%E5%80%99%E4%BD%BF%E7%94%A8mq)
- [Exchange 类型](#exchange-%E7%B1%BB%E5%9E%8B)
  - [direct](#direct)
  - [fanout](#fanout)
  - [topic](#topic)
  - [headers](#headers)
- [消息丢失](#%E6%B6%88%E6%81%AF%E4%B8%A2%E5%A4%B1)
  - [生产者确认机制](#%E7%94%9F%E4%BA%A7%E8%80%85%E7%A1%AE%E8%AE%A4%E6%9C%BA%E5%88%B6)
  - [路由不可达消息](#%E8%B7%AF%E7%94%B1%E4%B8%8D%E5%8F%AF%E8%BE%BE%E6%B6%88%E6%81%AF)
    - [Return消息机制](#return%E6%B6%88%E6%81%AF%E6%9C%BA%E5%88%B6)
    - [备份交换机](#%E5%A4%87%E4%BB%BD%E4%BA%A4%E6%8D%A2%E6%9C%BA)
  - [消费者手动消息确认](#%E6%B6%88%E8%B4%B9%E8%80%85%E6%89%8B%E5%8A%A8%E6%B6%88%E6%81%AF%E7%A1%AE%E8%AE%A4)
  - [持久化](#%E6%8C%81%E4%B9%85%E5%8C%96)
- [消费端限流](#%E6%B6%88%E8%B4%B9%E7%AB%AF%E9%99%90%E6%B5%81)
  - [消息过期时间](#%E6%B6%88%E6%81%AF%E8%BF%87%E6%9C%9F%E6%97%B6%E9%97%B4)
- [死信队列](#%E6%AD%BB%E4%BF%A1%E9%98%9F%E5%88%97)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

[RabbitMQ基础](https://www.jianshu.com/p/79ca08116d57)

[Springboot整合RabbitMQ](https://blog.csdn.net/qq_35387940/article/details/100514134)

[RabbitMQ之消息持久化](https://blog.csdn.net/u013256816/article/details/60875666)

## 简介

RabbitMQ是一个由erlang开发的AMQP（Advanced Message Queue ）。消息队列是一种应用间的异步协作机制。

![image-20200718104019614](../img/rabbitmq.png)

### 基本概念

Message：由消息头和消息体组成。消息体是不透明的，而消息头则由一系列的可选属性组成，这些属性包括routing-key、priority、delivery-mode（是否持久性存储）等。

Publisher：消息的生产者。

Exchange：接收消息并将消息分发到一个或多个Queue。default exchange 是默认的直连交换机，名字为空字符串，每个新建队列都会自动绑定到默认交换机上，绑定的路由键名称与队列名称相同。

Binding：通过Binding将Exchange和Queue关联，这样Exchange就知道将消息分发到哪个Queue中。

Queue：存储消息，队列的特性是先进先出。一个消息可分发到一个或多个队列。

Virtual host：每个 vhost 本质上就是一个 mini 版的 RabbitMQ 服务器，拥有自己的队列、交换器、绑定和权限机制。vhost 是 AMQP 概念的基础，必须在连接时指定，RabbitMQ 默认的 vhost 是 / 。当多个不同的用户使用同一个RabbitMQ server提供的服务时，可以划分出多个vhost，每个用户在自己的vhost创建exchange和queue。

Broker：消息队列服务器实体。

### 什么时候使用MQ

对于一些不需要立即生效的操作，可以拆分出来，异步执行，使用消息队列实现。

以常见的订单系统为例，用户点击下单按钮之后的业务逻辑可能包括：扣减库存、生成相应单据、发短信通知。这种场景下就可以用 MQ 。将短信通知放到 MQ 异步执行，在下单的主流程（比如扣减库存、生成相应单据）完成之后发送一条消息到 MQ， 让主流程快速完结，而由另外的线程消费MQ的消息。

## Exchange 类型

Exchange分发消息时根据类型的不同分发策略不同，目前共四种类型：direct、fanout、topic、headers 。headers 匹配 AMQP 消息的 header 而不是路由键，此外 headers 交换器和 direct 交换器完全一致，但性能差很多，目前几乎用不到了。

Exchange规则。

| 类型名称 | 类型描述                                                     |
| -------- | ------------------------------------------------------------ |
| fanout   | 把所有发送到该Exchange的消息路由到所有与它绑定的Queue中      |
| direct   | Routing Key==Binding Key                                     |
| topic    | 模糊匹配                                                     |
| headers  | Exchange不依赖于routing key与binding key的匹配规则来路由消息，而是根据发送的消息内容中的header属性进行匹配。 |

### direct

direct交换机会将消息路由到binding key 和 routing key完全匹配的队列中。它是完全匹配、单播的模式。

![](../img/rabbitmq-direct.png)

### fanout

所有发到 fanout 类型交换机的消息都会路由到所有与该交换机绑定的队列上去。fanout 类型转发消息是最快的。

![](../img/rabbitmq-fanout.png)

### topic

如果路由键和某个模式匹配成功，则将消息发送到相应的队列。routing key和binding key都是句点号“. ”分隔的字符串，binding key中可以存在两种特殊字符“*”与“#”，用于做模糊匹配，其中“\*”用于匹配一个单词，“#”用于匹配多个单词。

![](../img/rabbitmq-topic.png)

### headers

headers类型的Exchange是根据发送的消息内容中的headers属性进行匹配。在绑定Queue与Exchange时指定一组键值对；当消息发送到Exchange时，RabbitMQ会取到该消息的headers（也是一个键值对的形式），对比其中的键值对是否完全匹配Queue与Exchange绑定时指定的键值对；如果完全匹配则消息会路由到该Queue，否则不会路由到该Queue。



## 消息丢失

消息丢失场景：生产者生产消息到RabbitMQ Server消息丢失、RabbitMQ Server存储的消息丢失和RabbitMQ Server到消费者消息丢失。

消息丢失从三个方面来解决：生产者确认机制、消费者手动确认消息和持久化。

### 生产者确认机制

生产者发送消息到队列，无法确保发送的消息成功的到达server。

解决方法：

1. 事务机制。在一条消息发送之后会使发送端阻塞，等待RabbitMQ的回应，之后才能继续发送下一条消息。性能差。
2. 开启生产者确认机制，只要消息成功到达server并找到交换机之后（不用到达相应的Queue），RabbitMQ就会发送一个ack给生产者（即使消息没有Queue接收，也会发送ack），生产者就知道消息已经到达server了。如果消息没有成功到达server或者没有找到对应的交换机，就会发送一条nack消息，提示发送失败。

在 Springboot 是通过 publisher-confirms 参数来设置 confirm 模式：

```yaml
spring:
    rabbitmq:   
        #开启 confirm 确认机制
        publisher-confirms: true
```

在生产端提供一个回调方法，当服务端确认了一条或者多条消息后，生产者会回调这个方法，根据具体的结果对消息进行后续处理，比如重新发送、记录日志等。

```java
    final RabbitTemplate.ConfirmCallback confirmCallback = (CorrelationData correlationData, boolean ack, String cause) -> {
            log.info("correlationData: " + correlationData);
            log.info("ack: " + ack);
            if(!ack) {
                log.info("异常处理....");
            }
    };

rabbitTemplate.setConfirmCallback(confirmCallback);
```

### 路由不可达消息

生产者确认机制只确保消息正确到达交换机，对于没有匹配到Queue的消息（指定的 routing key 路由不到的消息），还是会存在消息丢失的问题。

对于不可路由的消息，有两种处理方式：Return消息机制和备份交换机。

#### Return消息机制

ReturnCallback 用于监听路由不可达的消息。需要将`mandatory` 设置为 `true` ，这样路由不可达的消息会被监听到，不会被 broker 自动删除。

```yaml
spring:
    rabbitmq:
        #设置为true后消费者在消息没有被路由到合适队列情况下会被return监听，而不会自动删除
        template.mandatory: true
```

通过 ReturnCallback 监听路由不可达消息。

```java
    final RabbitTemplate.ReturnCallback returnCallback = (Message message, int replyCode, String replyText, String exchange, String routingKey) ->
            log.info("return exchange: " + exchange + ", routingKey: "
                    + routingKey + ", replyCode: " + replyCode + ", replyText: " + replyText);
rabbitTemplate.setReturnCallback(returnCallback);
```

当消息没有匹配到Queue时，会返回 `return exchange: , routingKey: MAIL, replyCode: 312, replyText: NO_ROUTE`。

#### 备份交换机

备份交换机alternate-exchange 是一个普通的exchange，当你发送消息到对应的exchange时，没有匹配到queue，就会自动转移到备份交换机对应的queue，这样消息就不会丢失。

### 消费者手动消息确认

有可能消费者收到消息还没来得及处理MQ服务就宕机了，导致消息丢失。因为消息者默认采用自动ack，一旦消费者收到消息后会通知MQ Server这条消息已经处理好了，MQ 就会移除这条消息。

解决方法：消费者设置为手动确认消息。消费者处理完逻辑之后再通知MQ Server，这样消费者没处理完消息就不会发送ack。当消息者消费失败的时候，MQ 会重发消息。

消费者设置手动ack：

```java
#设置消费端手动 ack
spring.rabbitmq.listener.simple.acknowledge-mode=manual
```

消息处理完，手动确认：

```java
    @RabbitListener(queues = RabbitMqConfig.MAIL_QUEUE)
    public void onMessage(Message message, Channel channel) throws IOException {

        try {
            Thread.sleep(5000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        long deliveryTag = message.getMessageProperties().getDeliveryTag();
        //手工ack；第二个参数是multiple，设置为true，表示deliveryTag序列号之前（包括自身）的消息都已经收到，设为false则表示收到一条消息
        channel.basicAck(deliveryTag, true);
        System.out.println("mail listener receive: " + new String(message.getBody()));
    }
```

### 持久化

如果RabbitMQ服务异常导致重启，将会导致消息丢失。RabbitMQ提供了持久化的机制，将内存中的消息持久化到硬盘上，即使重启RabbitMQ，消息也不会丢失。

消息持久化需要满足以下条件：

2. Queue设置持久化。将队列的元数据保存在磁盘上，防止数据丢失。
3. 发送消息设置持久化。如果只有队列设置了持久化，消息没有设置持久化，当RabbitMQ服务挂掉重启之后，只会恢复队列的数据，消息依然会丢失。队列里的消息会不会持久化，取决于发送消息时对消息的持久化设置。

建议 Exchange 也设置持久化。将交换机的属性数据存储在磁盘上，当 MQ 的服务器发生意外或关闭之后，在重启 RabbitMQ 时不需要重新手动或重启应用去创建交换机了，交换机会自动被创建。

消息在到达RabbitMQ之后，不会立即刷新到磁盘，如果在消息写入磁盘之前RabbitMQ挂掉，那么这些消息将会丢失。通过publisher的confirm机制能够确保客户端知道哪些message已经存入磁盘，但是此时因为MQ单点故障导致服务不可用。引入RabbitMQ的镜像队列机制，将queue镜像到cluster中其他的节点之上。如果集群中的一个节点失效了，queue能自动地切换到镜像中的另一个节点以保证服务的可用性。

通常每一个镜像队列都包含一个master和多个slave，分别对应于不同的节点。发送到镜像队列的所有消息总是被直接发送到master和所有的slave之上。除了publish外所有动作都只会向master发送，然后由master将命令执行的结果广播给slave，从镜像队列中的消费操作实际上是在master上执行的。


## 消费端限流

当 RabbitMQ 服务器积压大量消息时，队列里的消息会大量涌入消费端，可能导致消费端服务器奔溃。这种情况下需要对消费端限流。

Spring RabbitMQ 提供参数 prefetch 可以设置单个请求中处理的最大消息个数。如果有 N 个消息还没有 ack，则该 consumer 将会阻塞，不会消费新的消息，直到有消息 ack。

开启消费端限流：

```properties
#在单个请求中处理的消息个数，unack的最大数量
spring.rabbitmq.listener.simple.prefetch=2
```

除此之外，原生 RabbitMQ 还提供 prefetchSize 和 global 两个参数。Spring RabbitMQ没有这两个参数。

```java
//单条消息大小限制，0代表不限制
//global：限制限流功能是channel级别的还是consumer级别。当设置为false，consumer级别，限流功能生效，设置为true没有了限流功能，因为channel级别尚未实现。
void basicQos(int prefetchSize, int prefetchCount, boolean global) throws IOException;
```



### 消息过期时间

RabbitMQ支持队列的过期时间，从消息入队列开始计算，只要超过了队列的超时时间配置，那么消息会自动的清除。

在生产端发送消息的时候可以在 properties 中指定 `expiration`属性来对消息过期时间进行设置，单位为毫秒(ms)。

```java
Message msg = new Message("tyson".getBytes(), mp);
msg.getMessageProperties().setExpiration("3000");
```

也可以在创建队列的时候指定队列的ttl，对于队列中超过该时间的消息将会被移除。



## 死信队列

没有被消费成功的消息存放的队列。

消息没有被消费成功的原因：

- 消息被拒绝并且消息不能重新入队（requeue=false）
- 消息超时未消费
- 达到最大队列长度

实现死信队列：

设置死信队列的 exchange 和 queue，然后进行绑定：

```java
	@Bean
    public DirectExchange dlxExchange() {
        return new DirectExchange(RabbitMqConfig.DLX_EXCHANGE);
    }

    @Bean
    public Queue dlxQueue() {
        return new Queue(RabbitMqConfig.DLX_QUEUE, true);
    }

    @Bean
    public Binding bindingDeadExchange(Queue dlxQueue, DirectExchange deadExchange) {
        return BindingBuilder.bind(dlxQueue).to(deadExchange).with(RabbitMqConfig.DLX_QUEUE);
    }
```

在普通队列加上两个参数，绑定普通队列到死信队列。当消息在过期、requeue失败、 队列在达到最大长度时，消息会被路由到死信队列。

```java
    @Bean
    public Queue sendSmsQueue() {
        Map<String,Object> arguments = new HashMap<>(2);
        // 绑定该队列到私信交换机
        arguments.put("x-dead-letter-exchange", RabbitMqConfig.DLX_EXCHANGE);
        arguments.put("x-dead-letter-routing-key", RabbitMqConfig.DLX_QUEUE);
        return new Queue(RabbitMqConfig.MAIL_QUEUE, true, false, false, arguments);
    }
```

生产者完整代码：

```java
@Component
@Slf4j
public class MQProducer {

    @Autowired
    RabbitTemplate rabbitTemplate;

    @Autowired
    RandomUtil randomUtil;

    @Autowired
    UserService userService;

    final RabbitTemplate.ConfirmCallback confirmCallback = (CorrelationData correlationData, boolean ack, String cause) -> {
            log.info("correlationData: " + correlationData);
            log.info("ack: " + ack);
            if(!ack) {
                log.info("异常处理....");
            }
    };


    final RabbitTemplate.ReturnCallback returnCallback = (Message message, int replyCode, String replyText, String exchange, String routingKey) ->
            log.info("return exchange: " + exchange + ", routingKey: "
                    + routingKey + ", replyCode: " + replyCode + ", replyText: " + replyText);

    public void sendMail(String mail) {
        //貌似线程不安全 范围100000 - 999999
        Integer random = randomUtil.nextInt(100000, 999999);
        Map<String, String> map = new HashMap<>(2);
        String code = random.toString();
        map.put("mail", mail);
        map.put("code", code);

        MessageProperties mp = new MessageProperties();
        //在生产环境中这里不用Message，而是使用 fastJson 等工具将对象转换为 json 格式发送
        Message msg = new Message("tyson".getBytes(), mp);
        msg.getMessageProperties().setExpiration("3000");
        //如果消费端要设置为手工 ACK ，那么生产端发送消息的时候一定发送 correlationData ，并且全局唯一，用以唯一标识消息。
        CorrelationData correlationData = new CorrelationData("1234567890"+new Date());

        rabbitTemplate.setMandatory(true);
        rabbitTemplate.setConfirmCallback(confirmCallback);
        rabbitTemplate.setReturnCallback(returnCallback);
        rabbitTemplate.convertAndSend(RabbitMqConfig.MAIL_QUEUE, msg, correlationData);

        //存入redis
        userService.updateMailSendState(mail, code, MailConfig.MAIL_STATE_WAIT);
    }
}
```

消费者完整代码：

```java
@Slf4j
@Component
public class DeadListener {

    @RabbitListener(queues = RabbitMqConfig.DLX_QUEUE)
    public void onMessage(Message message, Channel channel) throws IOException {

        try {
            Thread.sleep(5000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        long deliveryTag = message.getMessageProperties().getDeliveryTag();
        //手工ack
        channel.basicAck(deliveryTag,false);
        System.out.println("receive--1: " + new String(message.getBody()));
    }
}
```

当普通队列中有死信时，RabbitMQ 就会自动的将这个消息重新发布到设置的死信交换机去，然后被路由到死信队列。可以监听死信队列中的消息做相应的处理。