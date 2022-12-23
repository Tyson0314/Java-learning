# 简介

## netty 核心组件

- Channel：传入和传出数据的载体，它可以连接或者断开连接。

- 回调：操作完成后通知相关方。
- Future：提供了另一种在操作完成时通知应用程序的方式。
- 事件和 ChannelHandler

## NIO

当一个 socket 建立好之后，Thread 会把这个连接请求交给 Selector，Selector 会不断去遍历所有的 Socket，一旦有一个 Socket 建立完成，它就会通知 Thread，然后 Thread 处理完数据在返回给客户端，这个过程是不阻塞的。



