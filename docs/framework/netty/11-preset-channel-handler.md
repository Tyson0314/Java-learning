# 预置的 ChannelHandler 和编解码器

## SSL/TLS

Java 提供了 javax.net.ssl 支持 SSL/TSL，用以实现数据安全。

![](http://img.dabin-coder.cn/image/sslhandler加解密.png)

添加 SSL/TLS 支持：

```java
public class SslChannelInitializer extends ChannelInitializer<Channel> {
    private final SslContext context;
    private final boolean startTls;

    public SslChannelInitializer(SslContext context, boolean startTls) {
        this.context = context;
        this.startTls = startTls;
    }

    @Override
    protected void initChannel(Channel channel) throws Exception {
        SSLEngine engine = context.newEngine(channel.alloc());//alloc返回channel所配置的ByteBufAllocator
        channel.pipeline().addFirst("ssl",
                new SslHandler(engine, startTls));//大多数情况SslHandler是第一个ChannelHandler
                                                  //这确保了所有其他的ChannelHandler处理数据之后，才会进行加密。
    }
}
```

## HTTP/HTTPS 应用程序

完整的 HTTP 请求（FullHttpRequest）包括请求头信息、若干个 HTTPContent 和 LastHttpContent。

完整的 HTTP 响应（FullHttpResponse）包括响应头信息、若干个 HTTPContent 和 LastHttpContent。

所有类型的 HTTP 消息都实现了 HttpObject 接口。

HTTP 编解码器：HttpRequestEncoder、HttpResponseEncoder、HttpReqeustDecoder 和 HttpResponseDecoder。

HttpResponseDecoder：将字节解码为 HttpResponse、HttpContent 和 LastHttpContent。

**添加 HTTP 支持**

```java
public class HttpPipelineInitializer extends ChannelInitializer<Channel> {
    private final boolean client;

    public HttpPipelineInitializer(boolean client) {
        this.client = client;
    }
    
    @Override
    protected void initChannel(Channel channel) throws Exception {
        ChannelPipeline pipeline = channel.pipeline();
        if (client) {
            pipeline.addLast("decoder", new HttpResponseDecoder());
            pipeline.addLast("encoder", new HttpRequestEncoder());
        } else {
            pipeline.addLast("decoder", new HttpRequestDecoder());
            pipeline.addLast("encoder", new HttpResponseEncoder());
        }
    }
}
```

判断是否是客户端，如果是客户端，则添加 HttpResponseDecoder 对服务器响应进行解码。

**聚合 HTTP 消息**

由于 HTTP 请求和响应可能由多个部分组成，需要将它们聚合成完整的消息。Netty 提供了一个聚合器，可以将多个消息部分合并成 FullHttpRequest 或者 FullHttpResponse 消息。

自动聚合 HTTP 的消息片段：

```java
public class HttpAggregarotInitializer extends ChannelInitializer<Channel> {
    private final boolean isClient;

    public HttpAggregarotInitializer(boolean isClient) {
        this.isClient = isClient;
    }

    @Override
    protected void initChannel(Channel channel) throws Exception {
        ChannelPipeline pipeline = channel.pipeline();
        if (isClient) {
            pipeline.addLast("codec", new HttpClientCodec());
        } else {
            pipeline.addLast("codec", new HttpServerCodec());
        }
        pipeline.addLast("aggregator", //最大消息大小是512kb
                new HttpObjectAggregator(512*1024));
    }
}
```

HttpServerCodec 里面组合了HttpResponseEncoder和HttpRequestDecoder。

HttpClientCodec 里面组合了HttpRequestEncoder和HttpResponseDecoder。

**HTTP 压缩**

当使用HTTP 时，建议服务器端开启压缩功能以尽可能多地减小传输数据的大小。Netty 为压缩和解压缩提供了ChannelHandler 实现，它们同时支持gzip 和deflate 编码。

自动压缩 HTTP 消息：

```java
public class HttpCompressionInitializer extends ChannelInitializer<Channel> {
    private final boolean isClient;
    
    public HttpCompressionInitializer(boolean isClient) {
        this.isClient = isClient;
    }
    
    @Override
    protected void initChannel(Channel channel) throws Exception {
        ChannelPipeline pipeline = channel.pipeline();
        if (isClient) {
            pipeline.addLast("codec", new HttpClientCodec());
            pipeline.addLast("decompressor",
                    new HttpContentDecompressor());//处理来自服务器的压缩内容
        } else {
            pipeline.addLast("codec", new HttpServerCodec());
            pipeline.addLast("compressor", 
                    new HttpContentCompressor());//服务器端压缩数据
        }
    }
}
```

**HTTPS**

启动 HTTPS 只需要将 SslHandler 添加到 ChannelPipeline。

```java
public class HttpsCodecInitializer extends ChannelInitializer<Channel> {
    private final SslContext context;
    private final boolean isClient;
    
    public HttpsCodecInitializer(SslContext context, boolean isClient) {
        this.context = context;
        this.isClient = isClient;
    }
    
    @Override
    protected void initChannel(Channel channel) throws Exception {
        ChannelPipeline pipeline = channel.pipeline();
        SSLEngine engine = context.newEngine(channel.alloc());
        pipeline.addFirst("ssl", new SslHandler(engine));//添加SslHandler之后可以使用https
        
        if (isClient) {
            pipeline.addLast("codec", new HttpClientCodec());
        } else {
            pipeline.addLast("codec", new HttpServerCodec());
        }
    }
}
```

**WebSocket**

WebSocket 在客户端和服务器之间提供了真正的双向数据交换。

![](http://img.dabin-coder.cn/image/netty-websocket协议.png)

WebSocketFrame 类型：

| 名称                       | 描述                                              |
| -------------------------- | ------------------------------------------------- |
| BinaryWebSocketFrame       | 二进制数据帧                                      |
| TextWebSocketFrame         | 文本数据帧                                        |
| ContinuationWebSocketFrame | 二进制和文本数据帧结合体                          |
| CloseWebSocketFrame        | 控制帧：一个close请求、关闭的状态码以及关闭的原因 |
| PingWebSocketFrame         | 控制帧：请求一个PongWebSocketFrame                |
| PongWebSocketFrame         | 控制帧：对PingWebSocketFrame请求的响应            |

WebSocketServerProtocolHandler 处理协议升级握手，以及三种控制帧--Close、Ping 和 Pong。Text和Binary数据帧将会被传递给下一个 ChannelHandler 进行处理。

```java
public class WebSocketServerInitializer extends ChannelInitializer<Channel> {
    @Override
    protected void initChannel(Channel channel) throws Exception {
        channel.pipeline().addLast(
                new HttpServerCodec(),
                new HttpObjectAggregator(65536),
                new WebSocketServerProtocolHandler("/websocket"),//升级握手
                new TextFrameHandler(),
                new BinaryFrameHandler(),
                new ContinuationFrameHandler());

    }
    public static final class TextFrameHandler extends
            SimpleChannelInboundHandler<TextWebSocketFrame> {

        @Override
        protected void channelRead0(ChannelHandlerContext channelHandlerContext, TextWebSocketFrame textWebSocketFrame) throws Exception {
            //handle text frame
        }
    }

    public static final class BinaryFrameHandler extends
            SimpleChannelInboundHandler<BinaryWebSocketFrame> {

        @Override
        protected void channelRead0(ChannelHandlerContext channelHandlerContext, BinaryWebSocketFrame binaryWebSocketFrame) throws Exception {
            //handle binary frame
        }
    }

    public static final class ContinuationFrameHandler extends
            SimpleChannelInboundHandler<ContinuationWebSocketFrame> {

        @Override
        protected void channelRead0(ChannelHandlerContext channelHandlerContext, ContinuationWebSocketFrame continuationWebSocketFrame) throws Exception {
            //handle continuation frame
        }
    }
}
```

> 要想为WebSocket 添加安全性，只需要将SslHandler 作为第一个ChannelHandler 添加到ChannelPipeline 中。

## 空闲的连接和超时

用于空闲连接以及超时的 ChannelHandler。

![](http://img.dabin-coder.cn/image/用于空闲连接以及超时的ChannelHandler.png)

发送心跳：

```java
public class IdleStateHandlerInitializer extends ChannelInitializer<Channel> {
    @Override
    protected void initChannel(Channel channel) throws Exception {
        ChannelPipeline pipeline = channel.pipeline();
        //60s没有接受或发送数据，IdelStateHandler会使用IdleStateEvent调用fireUserEventTriggered()
        pipeline.addLast(new IdleStateHandler(
                0, 0, 60, TimeUnit.SECONDS));
        pipeline.addLast(new HeartbeatHandler());
    }

    public static final class HeartbeatHandler extends
            ChannelInboundHandlerAdapter {
        //发送到远程节点的心跳信息
        private static final ByteBuf HEARTBEAT_SEQUENCE =
                Unpooled.unreleasableBuffer(Unpooled.copiedBuffer(
                        "HEARTBEAT", CharsetUtil.ISO_8859_1));

        @Override
        public void userEventTriggered(ChannelHandlerContext ctx, Object evt) throws Exception {
            if (evt instanceof IdleStateEvent) {
                //连接空闲时间太长时，发送心跳消息，并在发送失败时关闭该连接
                ctx.writeAndFlush(HEARTBEAT_SEQUENCE.duplicate())
                        .addListener(ChannelFutureListener.CLOSE_ON_FAILURE);
            } else {
                super.userEventTriggered(ctx, evt);//传递给下一个ChannelInboundHandler
            }
        }
    }
}
```

使用 IdleStateHandler 测试远程节点是否还活着，失活时关闭连接释放资源。

## 基于分隔符的协议

基于分隔符的协议的解码器

| 名称                       | 描述                                                        |
| -------------------------- | ----------------------------------------------------------- |
| DelimiterBasedFrameDecoder | 使用自定义分隔符提取帧的通用解码器                          |
| LineBasedFrameDecoder      | 提取由行尾符分隔的解码器，速度比DeimiterBasedFrameDecoder快 |

分隔符提取帧：

```java
public class LineBasedHandlerInitializer extends ChannelInitializer<Channel> {
    @Override
    protected void initChannel(Channel channel) throws Exception {
        ChannelPipeline pipeline = channel.pipeline();
        //提取帧，并传给下一个ChannelHandler
        pipeline.addLast(new LineBasedFrameDecoder(64*1024));
        pipeline.addLast(new FrameHandler());//接收数据帧
    }
    
    public static final class FrameHandler extends
            SimpleChannelInboundHandler<ByteBuf> {

        @Override
        protected void channelRead0(ChannelHandlerContext channelHandlerContext, ByteBuf byteBuf) throws Exception {
            //处理LineBasedFrameDecoder传进的帧
        }
    }
```

示例：1.每个帧都由换行符（\n）分隔；2.每个帧由一系列的元素组成，每个元素都由的单个空格字符分隔；3.一个帧内容代表一个命令，定义为一个命令名称后面跟着数目可变的参数。

```java
public class CmdHandlerInitializer extends ChannelInitializer<Channel> {
    static final byte SPACE = (byte)' ';

    @Override
    protected void initChannel(Channel channel) throws Exception {
        ChannelPipeline pipeline = channel.pipeline();
        pipeline.addLast(new CmdDecoder(64 * 1024));
        pipeline.addLast(new CmdHandler());
    }

    public static final class Cmd {
        private final ByteBuf name;
        private final ByteBuf args;

        public Cmd(ByteBuf name, ByteBuf args) {
            this.name = name;
            this.args = args;
        }

        public ByteBuf getName() {
            return name;
        }

        public ByteBuf getArgs() {
            return args;
        }
    }

    public static final class CmdDecoder
            extends LineBasedFrameDecoder {

        public CmdDecoder(int maxLength) {
            super(maxLength);
        }

        @Override
        protected Object decode(ChannelHandlerContext ctx, ByteBuf buffer) throws Exception {
            ByteBuf frame = (ByteBuf) super.decode(ctx, buffer);
            if (frame == null) {
                return null;
            }
            //查找第一个空格字符的索引，空格前是命令名称，后面是参数
            int index = frame.indexOf(frame.readerIndex(),
                    frame.writerIndex(), SPACE);
            return new Cmd(frame.slice(frame.readerIndex(), index),
                    frame.slice(index + 1, frame.writerIndex()));
        }
    }

    public static final class CmdHandler extends
            SimpleChannelInboundHandler<Cmd> {

        @Override
        protected void channelRead0(ChannelHandlerContext channelHandlerContext, Cmd cmd) throws Exception {
            //处理cmd
        }
    }
}
```

## 基于长度的协议

基于长度的协议的解码器：

| 名称                         | 描述                                                         |
| ---------------------------- | ------------------------------------------------------------ |
| FixedLengthFrameDecoder      | 提取固定长度的帧                                             |
| LengthFieldBasedFrameDecoder | 根据帧头部中的长度值提取帧；该字段的偏移量以及长度在构造函数中指定 |

变长帧：

```java
public class LengthBasedInitializer extends ChannelInitializer<Channel> {
    @Override
    protected void initChannel(Channel channel) throws Exception {
        ChannelPipeline pipeLine = channel.pipeline();
        //帧起始的前8字节是帧长度
        pipeLine.addLast(new LengthFieldBasedFrameDecoder(64 * 1024, 0, 8));
        pipeLine.addLast(new FrameHandler());
    }
    
    public static class FrameHandler extends
            SimpleChannelInboundHandler<ByteBuf> {

        @Override
        protected void channelRead0(ChannelHandlerContext channelHandlerContext, ByteBuf byteBuf) throws Exception {
            //处理帧
        }
    }
}
```

## 写大型数据

当写大型数据到远程节点时，如果连接速度比较慢，数据依然不断的往内存写，可能导致内存耗尽。利用 NIO 的零拷贝特性，可以消除将文件内容从文件系统移动到网络栈的复制过程。应用程序需要做的就是实现一个 FileRegion 的接口。

利用零拷贝特性（FileRegion）来传输一个文件的内容。

```java
FileInputStream in = new FileInputStream(File);
FileRegion region = new DefaultFileRegion(in.getChannel(), 0, file.length());
channel.writeAndFlush(region).addListener(
	new ChannelFuture(region).addListener(
    	new ChannelFutureListener() {
            
        }
    )
);
```


