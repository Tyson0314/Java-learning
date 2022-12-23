# 引导

配置 netty 应用程序，使它运行起来。服务器使用一个父 Channel 接受来自客户端的连接，并创建子 Channel 以用于它们之间的通信。客户端只需要一个 Channel 完成所有的网络交互。

引导类是 cloneable 的，在引导类实例上调用 clone() 就可以创建多个具有类似配置或者完全相同配置的 Channel。

## 引导客户端

BootStrap 类被用于客户端或者使用了无连接协议的应用程序中。

## 引导服务器

![](http://img.dabin-coder.cn/image/ServerBoostrap和ServerChannel.png)

在基类AbstractBootstrap有handler方法，目的是添加一个handler，监听Bootstrap的动作。

在服务端的ServerBootstrap中增加了一个方法childHandler，它的目的是添加handler，用来监听已经连接的客户端的Channel的动作和状态。

**handler在初始化时就会执行，而childHandler会在客户端成功connect后才执行。**

## 在引导过程添加多个 ChannelHandler

在 handler 传入 ChannelInitializer 的实现类，重写 initChannel 方法，在这个方法中添加多个 ChannelHandler。

```java
EventLoopGroup group = new NioEventLoopGroup();
try {
    Bootstrap bootstrap = new Bootstrap();
    bootstrap.group(group)
        .channel(NioSocketChannel.class)//适用于nio传输的channel类型
        .remoteAddress(new InetSocketAddress(host, port))
        .handler(new ChannelInitializer<SocketChannel>() {
            @Override
            protected void initChannel(SocketChannel socketChannel) throws Exception {
                socketChannel.pipeline().addLast(
                    new EchoClientHandler());
            }
        });
    ChannelFuture future = bootstrap.connect().sync();//连接到远程节点，阻塞等待
    future.channel().closeFuture().sync();//阻塞直到channel关闭
} finally {
    group.shutdownGracefully().sync();//关闭线程池并释放所有的资源
}
```

## 关闭

关闭 EventLoopGroup，它将处理任何挂起的事件和任务，随后释放所有活动的线程。

```java
Future<?> future = group.shutdownGracefully();//释放所有资源，关闭Channel
// block until the group has shutdown
future.syncUninterruptibly();
```



