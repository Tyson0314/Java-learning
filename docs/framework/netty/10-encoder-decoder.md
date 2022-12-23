# 编解码器

数据格式转化。编码器操作出站数据，解码器处理入站数据。继承自 ChannelInboundHandlerAdapter。数据编码或者解码完就会被传入 ChannelPipeline 的下一个 ChannelHandler。

## 解码器

ByteToMessageDecoder、ReplayingDecoder：将字节解码为消息。

MessageToMessageDecoder：将消息解码为另一种消息。

**抽象类 ByteToMessageDecoder**

```java
public class ToIntegerDecoder extends ByteToMessageDecoder {
    @Override
    public void decode(ChannelHandlerContext ctx, ByteBuf in,
                       List<Object> list) throws Exception {
        if (in.readableBytes() >= 4) {
            list.add(in.readInt());
        }
    }
}
```

调用 readInt() 方法前需要验证输入的 ByteBuf 是否具有足够的数据。

**抽象类 ReplayingDecoder**

类型参数S 指定了用于状态管理的类型，其中Void 代表不需要状态管理。

```java
public class ToIntegerDecoder2 extends ReplayingDecoder<Void> {
    @Override
    public void decode(ChannelHandlerContext ctx, ByteBuf in,
                       List<Object> list) throws Exception {
        list.add(in.readInt());
    }
}
```

如果没有足够的字节可用，这个readInt()方法的实现将会抛出一个Error，将在基类中被捕获并处理。当有更多的数据可供读取时，该decode()方法将会被再次调用。

并不是所有的ByteBuf 操作都被支持，如果调用了一个不被支持的方法，将会抛出一个UnsupportedOperationException；ReplayingDecoder 稍慢于ByteToMessageDecoder。如果使用ByteToMessageDecoder 不会引入太多的复杂性，那么选用它。

**抽象类 MessageToMessageDecoder**

两种消息格式的转换。

```java
public class IntegerToStringDecoder extends MessageToMessageDecoder<Integer> {
    @Override
    protected void decode(ChannelHandlerContext channelHandlerContext, Integer integer, List<Object> list) throws Exception {
        list.add(String.valueOf(integer));
    }
}
```

**TooLongFrameException 类**

解码器缓冲大量的数据以至于耗尽可用的内存，可以设置一个最大字节数的阈值，如果超出该阈值，则手动抛出一个TooLongFrameException。

## 编码器

消息编码为字节；消息编码为消息。

**抽象类 MessageToByteEncoder**

```java
public class ShortToByteEncoder extends MessageToByteEncoder<Short> {
    @Override
    public void encode(ChannelHandlerContext ctx, Short msg, ByteBuf out)
            throws Exception {
        out.writeShort(msg);
    }
}
```

**抽象类 MessageToMessageEncoder**

 ```java
public class IntegerToStringEncoder extends MessageToMessageEncoder<Integer> {
    @Override
    public void encode(ChannelHandlerContext ctx, Integer msg
        List<Object> out) throws Exception {
        out.add(String.valueOf(msg));
    }
}
 ```

## 编解码器类

结合一个解码器和编码器可能会对可重用性造成影响。

**抽象类 ByteToMessageCodec**

结合了 ByteToMessageDecoder 和 MessageToByteEncoder。

**抽象类 MessageToMessageCodec**

定义：`public abstract class MessageToMessageCodec<INBOUND_IN,OUTBOUND_IN>`

**CombinedChannelDuplexHandler 类**

可以实现一个编解码器，而又不必直接扩展抽象的编解码器类。

```java
public class CombinedChannelDuplexHandler<I extends ChannelInboundHandler,
O e xtends ChannelOutboundHandler>
```

ByteToCharDecoder 类：

```java
public class ByteToCharDecoder extends ByteToMessageDecoder {
    @Override
    protected void decode(ChannelHandlerContext channelHandlerContext, ByteBuf byteBuf, List<Object> list) throws Exception {
        while (byteBuf.readableBytes() >= 2) {
            list.add(byteBuf.readChar());
        }
    }
}
```

CharToByteEncoder 类：

```java
public class CharToByteEncoder extends MessageToByteEncoder<Character> {
    @Override
    protected void encode(ChannelHandlerContext channelHandlerContext, Character character, ByteBuf byteBuf) throws Exception {
        byteBuf.writeChar(character);//向byteBuf写入基本类型的值
    }
}
```

编解码器类：

```java
public class CombinedByteCharCodec extends CombinedChannelDuplexHandler<ByteToCharDecoder, CharToByteEncoder> {
    public  CombinedByteCharCodec() {
        super(new ByteToCharDecoder(), new CharToByteEncoder());//将委托实例传递给父类
    }
}
```



