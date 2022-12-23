# ChannelHandler

## Channel 的生命周期

| 状态                | 描述                                               |
| ------------------- | -------------------------------------------------- |
| ChannelUnregistered | Channel 已创建，但还未注册到 EventLoop             |
| ChannelRegistered   | Channel 已注册到了 EventLoop                       |
| ChannelActive       | Channel 已经连接到它的远程节点，可以接受和发送数据 |
| ChannelInactive     | Channel 没有连接到远程节点                         |

正常的生命周期：

ChannelRegistered -> ChannelActive -> ChannelInactive -> ChannelUnregistered

## ChannelHandler 的生命周期

| 方法            | 描述                                            |
| --------------- | ----------------------------------------------- |
| handlerAdded    | 把ChanneHandler添加到ChannelPipeline时被调用    |
| handlerRemoved  | 从ChannelPipeline中移除ChannelHandler时被调用   |
| exceptionCaught | 处理过程中在ChannelPipeline中有错误产生时被调用 |

## ChannelInboundHandler 接口

处理入站数据以及各种状态变化。

| 方法                     | 描述                                                         |
| ------------------------ | ------------------------------------------------------------ |
| channelRead              | 从Channel读取数据时被调用                                    |
| channelReadComplete      | 从Channel上一个读操作完成时被调用                            |
| channelWritablityChanged | Channel 的可写状态发生改变时被调用                           |
| userEventTriggered       | 当ChannelnboundHandler.fireUserEventTriggered()方法被调用时被调用，因为一个POJO 被传经了ChannelPipeline |

ReferenceCountUtil 释放消息资源：

```java
@Sharable
public class DiscardHandler extends ChannelInboundHandlerAdapter {
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        ReferenceCountUtil.release(msg);
    }
}
```

SimpleChannelInboundHandler 会自动释放资源，所以不应该存储指向任何消息的引用供将来使用，因为这些引用都将会失效。

```java
public class SimpleDiscardHandler
        extends SimpleChannelInboundHandler<Object> {
    @Override
    public void channelRead0(ChannelHandlerContext ctx,
                             Object msg) {
        // No need to do anything special
    }
}
```

## ChannelOutboundHandler 接口

ChannelOutboundHandler 一个强大的功能是可以按需推迟操作或者事件。

| 方法                                                         | 描述                                               |
| ------------------------------------------------------------ | -------------------------------------------------- |
| bind(ChannelHandlerContext, SocketAddress, ChannelPromise)   | 当请求将Channel绑定到本地地址时被调用              |
| connect(ChannelHandlerContext, SocketAddress, ChannelPromise) | 当请求连接到远程节点时被调用                       |
| close(ChannelHandlerContext, ChannelPromise)                 | 当请求关闭Channel时被调用                          |
| deregister(ChannelHandlerContext, ChannelPromise)            | 当请求将Channel 从它的EventLoop 注销时被调用       |
| read(ChannelHandlerContext)                                  | 当请求从Channel 读取更多的数据时被调用             |
| flush(ChannelHandlerContext)                                 | 当请求通过Channel 将入队数据冲刷到远程节点时被调用 |
| write(ChannelHandlerContext, Object, ChannelPromise)         | 当请求通过Channel 将数据写到远程节点时被调用       |

ChannelPromise 是 ChannelFuture 的一个子类，ChannelOutboundHandler 中的大部分方法都需要一个 ChannelPromise参数，以便在操作完成时得到通知。


## ChannelHandlerAdapter

ChannelHandlerAdapter 提供了实用方法 isSharable()，如果其对应的实现被标注成 @Sharable，那么这个方法将返回true，表示它可以被添加到多个 ChannelPipeline 中。

共享 ChannelHandler 一个常见的用途是用于收集跨越多个 channel 的统计信息。

## 资源管理

idea 配置 edit configuration -- vm options --  `-Dio.netty.leakDetectionLevel=ADVANCED `



