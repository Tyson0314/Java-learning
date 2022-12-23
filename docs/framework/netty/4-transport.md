# 传输

## 传输迁移

Netty 为所有的传输提供了通用的 API，使得从阻塞传输到非阻塞传输的转换变得更加简单。

```java
public class NettyNioServer {
    public void server(int port) throws Exception {
        final ByteBuf buf = Unpooled.copiedBuffer("hi!\r\n",
                Charset.forName("UTF-8"));
        EventLoopGroup group = new NioEventLoopGroup();//oio-->nio
        try {
            ServerBootstrap bootstrap = new ServerBootstrap();
            bootstrap.group(group)
                    .channel(NioServerSocketChannel.class)//oio-->nio
                    .localAddress(new InetSocketAddress(port))
                    .childHandler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        protected void initChannel(SocketChannel socketChannel) throws Exception {
                            socketChannel.pipeline().addLast(new ChannelInboundHandlerAdapter() {
                                @Override
                                public void channelActive(ChannelHandlerContext ctx) throws Exception {
                                    ctx.writeAndFlush(buf.duplicate())
                                            .addListener(ChannelFutureListener.CLOSE);
                                }
                            });
                        }
                    });
            //绑定服务器以接受连接
            ChannelFuture future = bootstrap.bind().sync();
            future.channel().closeFuture().sync();
        } finally {
            group.shutdownGracefully().sync();
        }
    }
}
```

只需要改动 SocketChannel 和 EventLoopGroup。

## 传输 API

每个 ChannelHandler 都会分配一个 ChannelPipeline 和 ChannelConfig。ChannelConfig 包含了该 Channel 的所有配置设置，并且支持热更新。

可以通过向 ChannelPipeline 添加 ChannelHandler 实例来增加应用程序的功能。

## 内置的传输

Channel 被注册到选择器 Selector 后，当 Channel 状态发生变化时可以得到通知。可能的状态变化有：

- 新的 Channel 已被接受并且就绪；
- Channel 连接已经完成；
- Channel 有已经就绪的可供读取的数据；
- Channel 可用于写数据。

>  零拷贝（zero-copy）是一种目前只有在使用NIO 和Epoll 传输时才可使用的特性。它使你可以快速
> 高效地将数据从文件系统移动到网络接口，而不需要将其从内核空间复制到用户空间，其在像FTP 或者
> HTTP 这样的协议中可以显著地提升性能。它只能传输文件的原始内容，不能传输加密或者压缩的文件。

**Epoll**

用于 Linux 的本地非阻塞传输。Netty为Linux提供了一组NIO API，其以一种和它本身的设计更加一致的方式使用epoll，并且以一种更加轻量的方式使用中断。



