# 简单的 netty 应用程序

Echo 客户端和服务器之间的交互是非常简单的；在客户端建立一个连接之后，它会向服务
器发送一个或多个消息，反过来，服务器又会将每个消息回送给客户端。

## Echo 服务器

所有的 netty 服务器都需要以下两个部分：

- 一个 ChannelHandler，实现服务器对接受的客户端的数据的处理
- 引导服务器：配置服务器的启动代码，将服务器绑定到它要监听连接请求的端口上

**ChannelHandler 和业务逻辑**

Echo 服务器需要实现 ChannelInboundHandler 方法，定义响应入站事件的方法。

```java
@ChannelHandler.Sharable
public class EchoServerHandler extends ChannelInboundHandlerAdapter {
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        ByteBuf in = (ByteBuf) msg;
        System.out.println("server reveived: " + in.toString(CharsetUtil.UTF_8));
        ctx.write(in);//将接受到的消息回传给发送者
    }

    @Override
    public void channelReadComplete(ChannelHandlerContext ctx) throws Exception {
        ctx.writeAndFlush(Unpooled.EMPTY_BUFFER).addListener(ChannelFutureListener.CLOSE);
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        cause.printStackTrace();
        ctx.close();//关闭channel
    }
}
```

ChannelHandler 有助于保持业务逻辑与网络处理代码的分离。

**引导服务器**

1. 服务器监听端口；
2. 配置 Channel，将有关的入站事件消息通知给 EchoServerHandler。

```java
public class EchoServer {
    private final int port;

    public EchoServer(int port) {
        this.port = port;
    }

    public static void main(String[] args) throws Exception {
        if (args.length != 1) {
            System.err.println(
                    "Usage: " + EchoServer.class.getSimpleName() +
                            " <port>");
        }
        int port = Integer.parseInt(args[0]);
        new EchoServer(port).start();
    }

    public void start() throws Exception {
        final EchoServerHandler serverHandler = new EchoServerHandler();
        EventLoopGroup group = new NioEventLoopGroup();
        try {
            ServerBootstrap bootstrap = new ServerBootstrap();
            bootstrap.group(group)
                    .channel(NioServerSocketChannel.class)//nio传输的channel
                    .localAddress(new InetSocketAddress(port))
                    .childHandler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        protected void initChannel(SocketChannel socketChannel) throws Exception {
                            socketChannel.pipeline().addLast(serverHandler);//将serverHandler添加到自Channel的ChannelPipeline
                        }
                    });
            ChannelFuture future = bootstrap.bind().sync();//异步绑定到服务器，阻塞直到绑定成功
            future.channel().closeFuture().sync();
        } finally {
            group.shutdownGracefully().sync();
        }
    }
}
```

## Echo 客户端

Echo 客户端的功能：

1. 连接到服务器；
2. 发送消息；
3. 接收服务器发送的消息；
4. 关闭连接。

**ChannelHandler**

客户端也需要实现 ChannelInboundHandler，用于处理数据。

```java
@ChannelHandler.Sharable
public class EchoClientHandler extends SimpleChannelInboundHandler<ByteBuf> {

    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        //当被通知的channel是活跃的时候发送消息
        ctx.writeAndFlush(Unpooled.copiedBuffer("Netty rocks!", CharsetUtil.UTF_8));
    }

    /**
     * 每当接收数据就会调用此方法，服务器发送的数据可能被分块接收
     */
    @Override
    public void channelRead0(ChannelHandlerContext channelHandlerContext, ByteBuf byteBuf) throws Exception {
        System.out.println("client received: " + byteBuf.toString(CharsetUtil.UTF_8));//接收的消息
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        cause.printStackTrace();
        ctx.close();
    }
}
```

**引导客户端**

客户端使用主机和端口参数来连接远程地址。

```java
public class EchoClient {
    private final String host;
    private final int port;

    public EchoClient(String host, int port) {
        this.host = host;
        this.port = port;
    }

    public void start() throws Exception {
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
    }

    public static void main(String[] args) throws Exception {
        if (args.length != 2) {
            System.err.println(
                    "Usage: " + EchoClient.class.getSimpleName() +
                            " <host> <port>");
            return;
        }

        String host = args[0];
        int port = Integer.parseInt(args[1]);
        new EchoClient(host, port).start();
    }
}
```

## 构建和运行 Echo 服务器和客户端

在服务器端，使用`mvn clean package`构建项目，然后在 idea 中配置 Edit Configurations，带参数运行服务器程序。

同理，客户端进行同样的配置，注意带多个参数的运行配置，参数中间使用空格隔开。

先运行服务器程序，在运行客户端程序，服务端接收到客户端发出的消息，控制台输出：`server reveived: Netty rocks!`，然后服务端将消息回传客户端，客户端控制台输出：`client received: Netty rocks!`，之后客户端便退出。



