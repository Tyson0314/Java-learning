# ChannelPipeline 接口

每一个新创建的 Channel 都将会被分配一个新的 ChannelPipeline，这项关联是永久性的；Channel 既不能附加另外一个ChannelPipeline，也不能分离其当前的。

ChannelHandlerContext 使得 ChannelHandler 能够和它的 ChannelPipeline 以及其他的 ChannelHandler 交互。

## 修改ChannelPipeline

ChannelHandler 可以通过添加、删除或者替换其他的ChannelHandler 来实时地修改ChannelPipeline 的布局。

| 方法                                | 描述                                     |
| ----------------------------------- | ---------------------------------------- |
| addFirst/addBefore/addAfter/addLast | 将 ChannelHandler 添加到 ChannelPipeline |
| remove                              | 移除                                     |
| replace                             | 替换                                     |

ChannelPipeline 的用于访问ChannelHandler 的操作：

| 方法    | 描述                                            |
| ------- | ----------------------------------------------- |
| get     | 返回ChannelHandler                              |
| context | 返回和ChannelHandler绑定的ChannelHandlerContext |
| names   | 返回所有的ChannelHanlder名称                    |

## ChannelHandlerContext 接口

ChannelHandlerContext 代表了ChannelHandler 和ChannelPipeline 之间的关联，每当有ChannelHandler 添加到ChannelPipeline 中时，都会创建ChannelHandlerContext。

![](http://img.dabin-coder.cn/image/netty1.png)

| 方法            | 描述                                                       |
| --------------- | ---------------------------------------------------------- |
| fireChannelRead | 触发对下一个ChannelInboundHandler的channelRead()方法的调用 |
| alloc           | 返回相关联的Channel所配置的ByteBufAllocator                |
| bind            | 绑定到给定的SocketAddress，并返回ChannelFuture             |

## 异常处理

入站异常：在 ChannelInboundHandler 实现 exceptionCaught 方法。

出站异常：

1.添加ChannelFutureListener 到ChannelFuture

```java
    ChannelFuture future = channel.write(someMessage);
    future.addListener(new ChannelFutureListener() {
        @Override
        public void operationComplete (ChannelFuture f){
            if (!f.isSuccess()) {
                f.cause().printStackTrace();
                f.channel().close();
            }
        }
    });
```

2.添加ChannelFutureListener 到ChannelPromise：

```java
public class OutboundExceptionHandler extends ChannelOutboundHandlerAdapter {
    @Override
    public void write(ChannelHandlerContext ctx, Object msg,
                      ChannelPromise promise) {
        promise.addListener(new ChannelFutureListener() {
            @Override
            public void operationComplete(ChannelFuture f) {
                if (!f.isSuccess()) {
                    f.cause().printStackTrace();
                    f.channel().close();
                }
            }
        });
    }
}
```



