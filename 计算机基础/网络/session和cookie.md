<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [cookie](#cookie)
- [session](#session)
- [区别](#%E5%8C%BA%E5%88%AB)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

由于HTTP协议是无状态的协议，需要用某种机制来识具体的用户身份，用来跟踪用户的整个会话。常用的会话跟踪技术是cookie与session。

## cookie

cookie就是由服务器发给客户端的特殊信息，而这些信息以文本文件的方式存放在客户端，然后客户端每次向服务器发送请求的时候都会带上这些特殊的信息。说得更具体一些：当用户使用浏览器访问一个支持cookie的网站的时候，用户会提供包括用户名在内的个人信息并且提交至服务器；接着，服务器在向客户端回传相应的超文本的同时也会发回这些个人信息，当然这些信息并不是存放在HTTP响应体中的，而是存放于HTTP响应头；当客户端浏览器接收到来自服务器的响应之后，浏览器会将这些信息存放在一个统一的位置。 自此，客户端再向服务器发送请求的时候，都会把相应的cookie存放在HTTP请求头再次发回至服务器。服务器在接收到来自客户端浏览器的请求之后，就能够通过分析存放于请求头的cookie得到客户端特有的信息，从而动态生成与该客户端相对应的内容。网站的登录界面中“请记住我”这样的选项，就是通过cookie实现的。
![](https://img-blog.csdn.net/20180924195237286?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1R5c29uMDMxNA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

cookie工作流程：

1. servlet创建cookie，保存少量数据，发送给浏览器。
2. 浏览器获得服务器发送的cookie数据，将自动的保存到浏览器端。
3. 下次访问时，浏览器将自动携带cookie数据发送给服务器。

## session

session原理：首先浏览器请求服务器访问web站点时，服务器首先会检查这个客户端请求是否已经包含了一个session标识、称为SESSIONID，如果已经包含了一个sessionid则说明以前已经为此客户端创建过session，服务器就按照sessionid把这个session检索出来使用，如果客户端请求不包含session id，则服务器为此客户端创建一个session，并且生成一个与此session相关联的独一无二的sessionid存放到cookie中，这个sessionid将在本次响应中返回到客户端保存，这样在交互的过程中，浏览器端每次请求时，都会带着这个sessionid，服务器根据这个sessionid就可以找得到对应的session。以此来达到共享数据的目的。 这里需要注意的是，session不会随着浏览器的关闭而死亡，而是等待超时时间。
session的工作原理就是依靠cookie来做支撑，第一次使用request.getsession()时session被创建
![](https://img-blog.csdn.net/20180924195247106?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1R5c29uMDMxNA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

## 区别

session是**服务器端**记录用户信息的一种机制，用来跟踪用户的状态，这个数据可以保存在集群、数据库、文件中；cookie是**客户端**保存用户信息的一种机制，用来记录用户的一些信息，也是实现session的一种方式。

