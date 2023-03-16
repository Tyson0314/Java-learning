## Zookeeper有哪些使用场景？

zookeeper 的使用场景有：

- 分布式协调
- 分布式锁
- 元数据/配置信息管理
- HA 高可用性

### 分布式协调

这个其实是 zookeeper 很经典的一个用法，简单来说，比如 A 系统发送个请求到 mq，然后 B 系统消息消费之后处理了。那 A 系统如何知道 B 系统的处理结果？用 zookeeper 就可以实现分布式系统之间的协调工作。A 系统发送请求之后可以在 zookeeper 上**对某个节点的值注册个监听器**，一旦 B 系统处理完了就修改 zookeeper 那个节点的值，A 系统立马就可以收到通知。

![](http://img.topjavaer.cn/img/zookeeper-distributed-coordination.png)

### 分布式锁

比如对某一个数据连续发出两个修改操作，两台机器同时收到了请求，但是只能一台机器先执行完另外一个机器再执行。那么此时就可以使用 zookeeper 分布式锁，一个机器接收到了请求之后先获取 zookeeper 上的一把分布式锁，就是可以去创建一个 znode，接着执行操作；然后另外一个机器也**尝试去创建**那个 znode，结果发现自己创建不了，因为被别人创建了，那只能等着，等第一个机器执行完了自己再执行。

![](http://img.topjavaer.cn/img/zookeeper-distributed-lock-demo.png)

### 元数据/配置信息管理

zookeeper 可以用作很多系统的配置信息的管理，比如 kafka、storm 等等很多分布式系统都会选用 zookeeper 来做一些元数据、配置信息的管理。

![](http://img.topjavaer.cn/img/zookeeper-meta-data-manage.png)

### HA 高可用性

这个应该是很常见的，比如 hadoop、hdfs、yarn 等很多大数据系统，都选择基于 zookeeper 来开发 HA 高可用机制，就是一个**重要进程一般会做主备**两个，主进程挂了立马通过 zookeeper 感知到切换到备用进程。

![](http://img.topjavaer.cn/img/zookeeper-active-standby.png)



**参考资料**

https://zhuanlan.zhihu.com/p/59669985

https://doocs.github.io/