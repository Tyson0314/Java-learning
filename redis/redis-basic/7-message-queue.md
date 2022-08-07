# 消息队列

使用一个列表，让生产者将任务使用LPUSH命令放进列表，消费者不断用RPOP从列表取出任务。

BRPOP和RPOP命令相似，唯一的区别就是当列表没有元素时BRPOP命令会一直阻塞连接，直到有新元素加入。
`BRPOP queue 0  //0表示不限制等待时间`

## 优先级队列

`BLPOP queue:1 queue:2 queue:3 0`
如果多个键都有元素，则按照从左到右的顺序取元素

## 发布/订阅模式

```
PUBLISH channel1 hi
SUBSCRIBE channel1
UNSUBSCRIBE channel1 //退订通过SUBSCRIBE命令订阅的频道。
```

`PSUBSCRIBE channel?*` 按照规则订阅
`PUNSUBSCRIBE channel?*` 退订通过PSUBSCRIBE命令按照某种规则订阅的频道。其中订阅规则要进行严格的字符串匹配，`PUNSUBSCRIBE *`无法退订`channel?*`规则。

缺点：在消费者下线的情况下，生产的消息会丢失。

## 延时队列

使用sortedset，拿时间戳作为score，消息内容作为key，调用zadd来生产消息，消费者用`zrangebyscore`指令获取N秒之前的数据轮询进行处理。



