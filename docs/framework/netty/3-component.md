# Netty 的组件和设计

Channel -- Socket；

EventLoop -- 控制流、多线程处理、并发；

ChannelFuture -- 异步通知；

ChannelHandler -- 处理出站和入站数据；

## Channel 接口

Netty 的Channel 接口所提供的API，大大地降低了直接使用Socket 类的复杂性。

## EventLoop 接口

EventLoop 用于处理连接的生命周期中所发生的事件。

Channel 和 EventLoop 的关系：Channel 会被注册到 EventLoop 上，在整个生命周期内使用 EventLoop 处理 io 事件。

一个EventLoop 在它的生命周期内只和一个Thread 绑定；

一个Channel 在它的生命周期内只注册于一个EventLoop；

一个EventLoop 可能会被分配给一个或多个Channel；

一个给定 Channel 的I/O 操作都是由相同的Thread 执行的，实际上消除了对于同步的需要。

## ChannelFuture 接口

Netty 中所有 io 操作都是异步的，ChannelFuture 接口用于在操作完成时得到通知。

## ChannelHandler

ChannelHandler 的方法是由网络事件触发的。典型用途：

- 将数据从一种格式转换为另一种格式
- 提供异常的通知
- 提供Channel 变为活动的或者非活动的通知
- 提供当Channel 注册到EventLoop 或者从EventLoop 注销时的通知
- 提供有关用户自定义事件的通知

一些适配器类提供了 ChannelHandler 接口中的所有方法的默认实现。

## ChannelPipeline

提供了 ChannelHandler 链的容器。当 Channel 被创建时，会被自动分配到它专属的 ChannelPipeline。

每一个事件都会流经 ChannelPipeline，被 ChannelHandler链处理，每一个 ChannelHandler 处理完数据会负责把事件传递给下一个 ChannelHandler，它们的顺序即是它们被安装的顺序。

从客户端应用程序角度来看，如果事件从客户端传递到服务端，那么称之为出站事件，反之则是入站事件。从服务端角度来看则相反。Netty 能区分 ChannelInboundHandler 和 ChannelOutboundHandler 实现，并确保数据在能在具有相同类型的 ChannelHandler 之间传递。

当ChannelHandler 被添加到ChannelPipeline 时，它将会被分配一个ChannelHandlerContext，其代表了ChannelHandler 和ChannelPipeline 之间的绑定。虽然这个对象可以被用于获取底层的Channel，但是它主要还是被用于写出站数据。

## ChannelInitializer

作用是给 ChannelPipeline 安装 ChannelHandler。

ChannelHandler 安装到 ChannelPipeline 的过程：

- 一个 ChannelInitializer 的实现被注册到了 ServerBootstrap；
- 当ChannelInitializer.initChannel()方法被调用时，ChannelInitializer 将在 ChannelPipeline 中安装ChannelHandler；
- ChannelInitializer 将它自己从ChannelPipeline 中移除。

## 引导

Bootstrap 连接远程主机和端口，有一个 EventLoopGroup；ServerBootstrap 绑定到一个本地端口，有两个 EventLoopGroup。



