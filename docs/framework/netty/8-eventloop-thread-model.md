# EventLoop 和线程模型

## EventLoop 接口

EventLoop 构建在 java.util.concurrent 和 io.netty.channel 之上。EventLoop 继承了 ScheduledExecutorService。EventLoop 由一个永远不会改变的 Thread 驱动，同时任务可以直接提交给 EventLoop 实现。EventLoop 可能服务于多个 Channel。

Netty4中所有的 io 操作和事件都由 EventLoop 的 Thread 处理。Netty3只保证入站事件在 EventLoop（io 线程）执行，所有出站事件都由调用线程处理，可能是 io 线程或者别的线程，因此需要在 ChannelHandler 中对出站事件进行同步。

Netty 4 中所采用的线程模型，通过在同一个线程中处理某个给定的EventLoop 中所产生的所有事件，解决了这个问题。这提供了一个更加简单的执行体系架构，并且消除了在多个ChannelHandler 中进行同步的需要

## 任务调度

使用 EventLoop 调度任务：

```java
Channel ch = ...
ScheduledFuture<?> future = ch.eventLoop().schedule(
	new Runnable() {
        @Override
        public void run() {
			//逻辑
        }
}, 60, TimeUnit.SECONDS);
```

周期性任务：

```java
Channel ch = ...
ScheduledFuture<?> future = ch.eventLoop().scheduleAtFixedRate(
	new Runnable() {
        @Override
        public void run() {
            //逻辑
        }
}, 60, 60, TimeUnit.SECONDES);
```

## 实现细节

![](http://img.dabin-coder.cn/image/netty-eventloop执行逻辑.png)





