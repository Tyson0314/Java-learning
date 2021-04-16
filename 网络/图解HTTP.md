<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [简介](#%E7%AE%80%E4%BB%8B)
  - [URI和URL](#uri%E5%92%8Curl)
    - [URI 格式](#uri-%E6%A0%BC%E5%BC%8F)
- [简单的HTTP协议](#%E7%AE%80%E5%8D%95%E7%9A%84http%E5%8D%8F%E8%AE%AE)
  - [请求](#%E8%AF%B7%E6%B1%82)
  - [响应](#%E5%93%8D%E5%BA%94)
  - [首部](#%E9%A6%96%E9%83%A8)
    - [通用首部字段](#%E9%80%9A%E7%94%A8%E9%A6%96%E9%83%A8%E5%AD%97%E6%AE%B5)
    - [请求首部字段](#%E8%AF%B7%E6%B1%82%E9%A6%96%E9%83%A8%E5%AD%97%E6%AE%B5)
    - [响应首部字段](#%E5%93%8D%E5%BA%94%E9%A6%96%E9%83%A8%E5%AD%97%E6%AE%B5)
    - [实体首部字段](#%E5%AE%9E%E4%BD%93%E9%A6%96%E9%83%A8%E5%AD%97%E6%AE%B5)
    - [Cookie相关的首部](#cookie%E7%9B%B8%E5%85%B3%E7%9A%84%E9%A6%96%E9%83%A8)
  - [请求URI定位资源](#%E8%AF%B7%E6%B1%82uri%E5%AE%9A%E4%BD%8D%E8%B5%84%E6%BA%90)
  - [HTTP方法](#http%E6%96%B9%E6%B3%95)
  - [持久连接](#%E6%8C%81%E4%B9%85%E8%BF%9E%E6%8E%A5)
  - [Cookie](#cookie)
  - [编码提升传输速率](#%E7%BC%96%E7%A0%81%E6%8F%90%E5%8D%87%E4%BC%A0%E8%BE%93%E9%80%9F%E7%8E%87)
  - [multipart 多部分对象集合](#multipart-%E5%A4%9A%E9%83%A8%E5%88%86%E5%AF%B9%E8%B1%A1%E9%9B%86%E5%90%88)
  - [范围请求](#%E8%8C%83%E5%9B%B4%E8%AF%B7%E6%B1%82)
  - [内容协商返回最合适的内容](#%E5%86%85%E5%AE%B9%E5%8D%8F%E5%95%86%E8%BF%94%E5%9B%9E%E6%9C%80%E5%90%88%E9%80%82%E7%9A%84%E5%86%85%E5%AE%B9)
- [状态码](#%E7%8A%B6%E6%80%81%E7%A0%81)
  - [2xx 成功](#2xx-%E6%88%90%E5%8A%9F)
  - [3xx 重定向](#3xx-%E9%87%8D%E5%AE%9A%E5%90%91)
  - [4xx 客户端错误](#4xx-%E5%AE%A2%E6%88%B7%E7%AB%AF%E9%94%99%E8%AF%AF)
  - [5xx 服务器错误](#5xx-%E6%9C%8D%E5%8A%A1%E5%99%A8%E9%94%99%E8%AF%AF)
- [Web 服务器](#web-%E6%9C%8D%E5%8A%A1%E5%99%A8)
  - [代理](#%E4%BB%A3%E7%90%86)
  - [网关](#%E7%BD%91%E5%85%B3)
  - [隧道](#%E9%9A%A7%E9%81%93)
- [HTTPS](#https)
  - [公开密钥加密](#%E5%85%AC%E5%BC%80%E5%AF%86%E9%92%A5%E5%8A%A0%E5%AF%86)
- [认证机制](#%E8%AE%A4%E8%AF%81%E6%9C%BA%E5%88%B6)
  - [BASIC 认证](#basic-%E8%AE%A4%E8%AF%81)
  - [DIGEST 认证](#digest-%E8%AE%A4%E8%AF%81)
  - [SSL 客户端认证](#ssl-%E5%AE%A2%E6%88%B7%E7%AB%AF%E8%AE%A4%E8%AF%81)
  - [基于表单认证](#%E5%9F%BA%E4%BA%8E%E8%A1%A8%E5%8D%95%E8%AE%A4%E8%AF%81)
- [基于 HTTP 的功能追加协议](#%E5%9F%BA%E4%BA%8E-http-%E7%9A%84%E5%8A%9F%E8%83%BD%E8%BF%BD%E5%8A%A0%E5%8D%8F%E8%AE%AE)
  - [WebSocket](#websocket)
  - [Web 服务器管理文件的 WebDAV](#web-%E6%9C%8D%E5%8A%A1%E5%99%A8%E7%AE%A1%E7%90%86%E6%96%87%E4%BB%B6%E7%9A%84-webdav)
- [Web 的攻击技术](#web-%E7%9A%84%E6%94%BB%E5%87%BB%E6%8A%80%E6%9C%AF)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 简介

访问baidu.com的过程：

1. 请求 DNS 服务器，返回 baidu.com 的ip地址；
2. HTTP 协议生成针对目标 web 服务器的 HTTP 请求报文；
3. TCP 协议将 HTTP 请求报文分割成多个报文段，将报文段发送到对方；
4. IP 协议负责分组的选路；
5. 分组到达目标服务器之后，TCP 协议将接收到的报文段重组得到请求报文；
6. HTTP 协议响应请求报文；
7. 响应结果通过 TCP/IP 通信协议向用户回传。

### URI和URL

URL（Uniform Resource Locator），统一资源定位符，表示资源的地点。

URI（Uniform Resource Identifier），统一资源标识符，用字符串表示某个互联网资源，URL 是 URI 的子集。

#### URI 格式

![uri格式](https://img2018.cnblogs.com/blog/1252910/201908/1252910-20190826144003883-634954522.png)

协议类型不区分大小写。



## 简单的HTTP协议

HTTP协议用于客户端和服务端之间的通信。HTTP 本身不对请求和响应之间的通信状态进行保存。使用 HTTP 协议，每次有新的请求过来，就会有新的响应产生。

### 请求

请求消息：由请求行（request line）、请求头部（header）、空行和请求体四个部分组成。
请求行包含请求方法，访问的资源URL，使用的HTTP版本。

GET和POST是最常见的HTTP方法，除此以外还包括DELETE、HEAD、OPTIONS、PUT、TRACE。
请求头包含一些属性，如cookie、host、支持的语言、支持的编码和浏览器版本等，格式为“属性名:属性值”，服务端据此获取客户端的信息。
请求体：用户的请求数据如用户名，密码等。
![在这里插入图片描述](https://img-blog.csdn.net/20180924195305583)

```http
GET / HTTP/1.1
Host: baidu.com
Connection: keep-alive
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7
Cookie: BIDUPSID=424D5772A7B28532FBA984615DE5EBFD; PSTM=1564448246; BAIDUID=F8292FB54233372C518B90C541F0DABB:FG=1; MCITY=-%3A; pgv_pvi=5994736640
//空白行
```

### 响应

HTTP响应也由四个部分组成，分别是：状态行、响应头、空行和响应体。
状态行包括报文协议及版本，状态码及状态描述。
响应头包括内容编码，长度，类型，Last-Modified，Set-Cookie，Cache-Control，Location，Expires。

```http
HTTP/1.1 302 Moved Temporarily
Server: bfe/1.0.8.18
Date: Mon, 26 Aug 2019 07:21:01 GMT
Content-Type: text/html
Content-Length: 161
Connection: Keep-Alive
Location: https://www.baidu.com/
Expires: Tue, 27 Aug 2019 07:21:01 GMT
Cache-Control: max-age=86400
Cache-Control: privae

<html>
<head><title>302 Found</title></head>
<body bgcolor="white">
<center><h1>302 Found</h1></center>
<hr><center>bfe/1.0.8.18</center>
</body>
</html>
```

### 首部

HTTP 首部字段根据实际用途被分为以下 4 种类型。

- 通用首部字段：请求报文和响应报文两方都会使用的首部。
- 请求首部字段
- 响应首部字段
- 实体首部字段：针对请求报文和响应报文的实体部分使用的首部。补充了资源内容更新时间等与实体有关的信息。

#### 通用首部字段

通用首部字段是指，请求报文和响应报文双方都会使用的首部。

![通用首部字段](https://img2018.cnblogs.com/blog/1252910/201908/1252910-20190827114726882-1179699158.png)

Cache-Control 能够控制缓存的行为。

缓存请求指令：

![cache-control请求指令](https://img2018.cnblogs.com/blog/1252910/201908/1252910-20190827141537422-78090080.png)

缓存响应指令：

![cache-control响应指令](https://img2018.cnblogs.com/blog/1252910/201908/1252910-20190827141703895-242746769.png)

**Cache-Control**：客户端发送的请求中如果包含 no-cache 指令，则表示客户端将不会接收缓存过的响应。

如果服务器返回的响应中包含 no-cache 指令，那么缓存服务器不能对资源进行缓存。源服务器以后也将不再对缓存服务器请求中提出的资源有效性进行确认，且禁止其对响应资源进行缓存操作。

`Cache-Control: no-cache=Location`由服务器返回的响应中，若报文首部字段 Cache-Control 中对 no-cache
字段名具体指定参数值（如 location），那么客户端将不能缓存 location 对应的响应报文。只能在响应指令中指定该参数。

```http
Cache-Control: min-fresh=60（单位：秒）
```

当指定 min-fresh 为 60 秒后，过了 60 秒的资源都无法作为响应返回了。

```http
Cache-Control: max-stale=3600（单位：秒）
```

如果 max-stale 指令未指定参数值，那么无论经过多久，客户端都会接收响应；如果指令中指定了具体数值，那么即使过期，只要仍处于 max-stale指定的时间内，仍旧会被客户端接收。

only-if-cached 指令表示客户端仅返回缓存服务器本地缓存。若缓存服务器的本地缓存无响应，则返回状态码 504 Gateway Timeout。

使用 must-revalidate 指令，代理会向源服务器再次验证即将返回的响应缓存目前是否仍然有效。

**Connection** 用于管理持久连接。HTTP/1.1 版本的默认连接都是持久连接。`Connection: close` 关闭持久连接。HTTP/1.1以前的版本默认连接都是非持久连接，`Connection: Keep-Alive`可以开启持久连接。

**Pragma** 是 HTTP/1.1 之前版本的历史遗留字段，仅作为与 HTTP/1.0的向后兼容而定义。Pragma  只用在客户端发送的请求中。客户端会要求所有的中间服务器不返回缓存的资源。
**Upgrade** 用于检测 HTTP 协议及其他协议是否可使用更高的
版本进行通信，其参数值可以用来指定一个完全不同的通信协议。

```http
GET /index.htm HTTP/1.1
Upgrade: TLS/1.0
Connection:Upgrade
```

Upgrade 首部字段产生作用的 Upgrade 对象仅限于客户端和邻接服务器之间。

**Via** 可以追踪客户端与服务器之间的请求和响应报文的传输路径，也可避免请求回环的发生。Via 经常会和 TRACE 方法一起使用。

#### 请求首部字段

请求首部字段是从客户端往服务器端发送请求报文中所使用的字段，用于补充请求的附加信息、客户端信息、对响应内容相关的优先级等内容。

![请求首部字段](https://img2018.cnblogs.com/blog/1252910/201908/1252910-20190827114835926-627521113.png)

**Accept **客户端能够处理的媒体类型及相对优先级。

```http
Accept: text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8
```

使用 q= 来额外表示权重值1，用分号（;）进行分隔。权重值 q 的范围是 0~11（可精确到小数点后 3 位）。默认权重为 q=1.0。

当服务器提供多种内容时，将会首先返回权重值最高的媒体类型。

**Accept-Charset **客户端支持的字符集及字符集的相对优先顺序。

`Accept-Charset: iso-8859-5, unicode-1-1;q=0.8`

**If-Match**条件请求：

![If-Match](https://img2018.cnblogs.com/blog/1252910/201908/1252910-20190827171404699-1518484292.png)

**If-Modified-Since**会告知服务器若 If-Modified-Since 字段值早于资源的更新时间，则希望能处理该请求。而在指定 If-Modified-Since 字段值的日期时间之后，如果请求的资源都没有过更新，则返回状态码 304 Not Modified 的响应。

`If-Modified-Since: Thu, 15 Apr 2004 00:00:00 GMT`

**Max-Forwards**：通过 TRACE 方法或 OPTIONS 方法，发送包含首部字段 Max-Forwards 的请求时，该字段以十进制整数形式指定可经过的服务器最大数目。服务器在往下一个服务器转发请求之前，Max-Forwards 的值减 1 后重新赋值。当服务器接收到 Max-Forwards 值为 0 的请求时，则不再进行转发，而是直接返回响应。

**Range**：接收到附带 Range 首部字段请求的服务器，会在处理请求之后返回状态码为 206 Partial Content 的响应。无法处理该范围请求时，则会返回状态码 200 OK 的响应及全部资源。

**Referer** 会告知服务器请求的原始资源的 URI。

**TE** 会告知服务器客户端能够处理响应的传输编码方式及相对优先级。它和首部字段 Accept-Encoding 的功能很相像，但是用于传输编码。

**User-Agent** 会将创建请求的浏览器和用户代理名称等信息传达给服务器。

#### 响应首部字段

响应首部字段是由服务器端向客户端返回响应报文中所使用的字段，用于补充响应的附加信息、服务器信息，以及对客户端的附加要求等信息。

![响应首部字段](https://img2018.cnblogs.com/blog/1252910/201908/1252910-20190827114916075-2002023634.png)

**Accept-Ranges**：`Accept-Ranges: bytes`告知客户端服务器能处理范围请求，`Accept-Ranges:none` 则相反。

**Age** 能告知客户端，源服务器在多久前创建了响应，即响应报文缓存了多长时间。

**ETag** 能告知客户端实体标识。它是一种可将资源以字符串形式做唯一性标识的方式。服务器会为每份资源分配对应的 ETag值。当资源更新时，ETag 值也需要更新。

**Location**：重定向的地址。

**Server** 告知客户端当前服务器上安装的 HTTP 服务器应用程序的信息。

`Server: Apache/2.2.17 (Unix)`

#### 实体首部字段

实体首部字段是包含在请求报文和响应报文中的实体部分所使用的首部，用于补充内容的更新时间等与实体相关的信息。

![实体首部字段](https://img2018.cnblogs.com/blog/1252910/201908/1252910-20190827115024950-1601963727.png)

**Content-MD5**：客户端会对接收的报文主体执行相同的 MD5 算法，然后与首部字段 Content-MD5 的字段值比较，用于判断报文主体的准确性。

**Content-Type**说明了实体主体内对象的媒体类型。

`Content-Type: text/html; charset=UTF-8`

**Expires** ：服务器会将资源失效的日期告知客户端。

**Last-Modified** 指明资源最终修改的时间。

#### Cookie相关的首部

Set-Cookie：服务端发送给客户端的 Cookie 信息，放在响应首部。

- expires：Cookie 的有效期（若不明确指定则默认为浏览器关闭前为止）
- secure 属性用于限制 Web 页面仅在 HTTPS 安全连接时，才可以发送 Cookie。
- HttpOnly 属性是 Cookie 的扩展功能，它使 JavaScript 脚本无法获得 Cookie。其主要目的为防止跨站脚本攻击（Cross-sitescripting，XSS）对 Cookie 的信息窃取。

Cookie：客户端发送给服务端的 Cookie 信息，放在请求首部。

### 请求URI定位资源

HTTP 协议使用 URI 定位互联网上的资源。当客户端请求访问资源而发送请求时，URI 需要将作为请求报文中的
请求 URI 包含在内。

如果不是访问特定资源而是对服务器本身发起请求，可以使用一个星号代替 URI。`OPTIONS * Http/1.1`用于查询服务器支持的 HTTP 方法种类。

### HTTP方法

- GET 用于获取资源。

- POST 用于传输实体主体。虽然用 GET 方法也可以传输实体的主体，但一般不用 GET 方法进行传输，而是用 POST 方法。

- PUT 方法用于传输文件。要求在请求体中包含文件内容，然后保存到请求 URI 指定的位置。鉴于 HTTP/1.1 的 PUT 方法自身不带验证机制，任何人都可以上传文件 , 存在安全性问题，因此一般的 Web 网站不使用该方法。若配合 Web 应用程序的验证机制，或架构设计采用 REST 标准的 WEB 网站，就可能开放 PUT 方法。

- HEAD 用于获取响应体的状态行和响应头。HEAD 方法和 GET 方法一样，只是 HEAD 方法不返回响应体内容。HEAD 方法主要用于确认URI 的有效性及资源更新的时间等。

- DELETE 用于删除文件。HTTP/1.1 的 DELETE 方法本身和 PUT 方法一样不带验证机制，所以一般的 Web 网站也不使用 DELETE 方法。当配合 Web 应用程序的验证机制，或遵守 REST 标准时还是有可能会开放使用的。

- OPTIONS 用于查询请求 URI 指定的资源所支持的方法。

- TRACE 方法是让 Web 服务器端将之前的请求通信环回给客户端的方法。 

- CONNECT 方法要求在与代理服务器通信时建立隧道，实现用隧道协议进行 TCP 通信。主要使用 SSL（Secure Sockets Layer，安全套接层）和 TLS（Transport Layer Security，传输层安全）协议把通信内容加密后经网络隧道传输。

### 持久连接

早期版本的 HTTP 每进行一次 HTTP 通信就会建立和断开 TCP 连接。如果请求的资源内部包含较多其他资源的话，就会造成许多无谓的 TCP 连接建立和断开。

HTTP 1.1改进的持久连接解决了这个问题。只要任意一端没有提出断开连接，则保持 TCP 连接的状态。持久连接就是在一次 TCP 连接中完成多次 HTTP 请求和响应，减少了 TCP 连接的重复建立和断开。

持久连接使得多数请求以管线化（pipelining）方式发送成为可能。管线化技术出现后，不用等待服务器响应就可以发出下一个请求，这样就可以并行发出多个请求。

### Cookie

Cookie 技术通过在请求和响应报文中写入 Cookie 信息来控制客户端的状态。Cookie 会根据从服务器端发送的响应报文内的一个叫做 Set-Cookie 的首部字段信息，通知客户端保存 Cookie。当下次客户端再往该服务器发送请求时，客户端会自动在请求报文中加入 Cookie 值后发送出去。

服务器端发现客户端发送过来的 Cookie 后，会去检查究竟是从哪一个客户端发来的连接请求，然后对比服务器上的记录，得到之前的状态信息。

![Cookie](https://img-blog.csdn.net/20180924195237286)

### 编码提升传输速率

内容编码指明应用在实体内容上的编码格式，并保持实体信息原样压缩。内容编码后的实体由客户端接收并负责解码。常见的内容编码有 gzip、compress、deflate、identity等。

分块传输编码会将实体主体分成多个部分（块）。每一块都会用十六进制来标记块的大小，而实体主体的最后一块会使用“0(CR+LF)”来标记。使用分块传输编码的实体主体会由接收的客户端负责解码，恢复到编码前的实体主体。

### multipart 多部分对象集合

HTTP 协议中采纳了多部分对象集合，发送报文主体内可含有多类型实体。通常是在图片或文本文件等上传时使用。

多部分对象集合包含的对象如下：

- multipart/form-data：在 web 表单文件上传时使用
- multipart/byteranges：响应报文包含多个范围的内容时使用

```http
HTTP/1.1 206 Partial Content
Date: Fri, 13 Jul 2012 02:45:26 GMT
Last-Modified: Fri, 31 Aug 2007 02:02:20 GMT
Content-Type: multipart/byteranges; boundary=THIS_STRING_SEPARATES

--THIS_STRING_SEPARATES
Content-Type: application/pdf
Content-Range: bytes 500-999/8000

--THIS_STRING_SEPARATES
Content-Type: application/pdf
Content-Range: bytes 7000-7999/8000
```

在 HTTP 报文中使用多部分对象集合时，需要在首部字段里加上 Content-type。

使用 boundary 字符串来划分多部分对象集合指明的各类实体。

### 范围请求

执行范围请求时，会用到首部字段 Range 来指定资源的 byte 范围。

`GET https://www.baidu.com?Content-Range=bytes -100, 500-1000`一开始到100字节和500到1000字节。

针对范围请求，响应会返回状态码为 206 Partial Content 的响应报文。另外，对于多重范围的范围请求，响应会在首部字段 Content-Type 标明 multipart/byteranges 后返回响应报文。

如果服务器端无法响应范围请求，则会返回状态码 200 OK 和完整的实体内容。

### 内容协商返回最合适的内容

同一个 Web 网站有可能存在着多份相同内容的页面。比如英语版和中文版的 Web 页面，当浏览器的默认语言为英语或中文，访问相同 URI 的 Web 页面时，则会显示对应的英语版或中文版的 Web 页面。这样的机制称为内容协商（Content Negotiation）。

内容协商机制是指客户端和服务器端就响应的资源内容进行交涉，然后提供给客户端最为适合的资源。内容协商会以响应资源的语言、字符集、编码方式等作为判断的基准。



## 状态码

![状态码](https://img2018.cnblogs.com/blog/1252910/201908/1252910-20190826191804371-348441465.png)

### 2xx 成功

2XX 的响应结果表明请求被正常处理了。

- 200 OK：示从客户端发来的请求在服务器端被正常处理了。

- 204 No Content：服务器接收的请求已成功处理，但在返回的响应报文中不含响应体。另外，也不允许返回任何响应体。

- 206 Partial Content：该状态码表示客户端进行了范围请求，而服务器成功执行了这部分的GET 请求。响应报文中包含由 Content-Range 指定范围的实体内容。

### 3xx 重定向

3XX 响应结果表明浏览器需要执行某些特殊的处理以正确处理请求。

- 301 Moved Permanently：永久性重定向。该状态码表示请求的资源已被分配了新的 URI，以后访问此资源应该使用新的 URI

- 302 Found：临时性重定向。该状态码表示请求的资源已被分配了新的 URI，希望用户**本次**能使用新的 URI 访问。

- 303 see other：该状态码表示由于请求对应的资源存在着另一个 URI，应使用 GET 方法定向获取请求的资源。303 状态码和 302 Found 状态码有着相同的功能，但 303 状态码明确表示客户端应当采用 GET 方法获取资源，这点与 302 状态码有区别。

- 304 Not Modified：该状态码表示客户端发送附带条件的请求时，服务器端允许请求访问资源，但未满足条件的情况。304 状态码返回时，不包含任何响应的主体部分。304 虽然被划分在 3XX 类别中，但是和重定向没有关系。

  > 附带条件的请求是指采用 GET 方法的请求报文中包含 If-Match，If-Modified-Since，If-None-Match，If-Range，If-Unmodified-Since 中任一首部。

- 307 Temporary Redirect：临时重定向。该状态码与 302 Found 有着相同的含义。尽管302标准禁止 POST 变换为 GET，但实际使用时很多人并不遵守。307 会遵照浏览器标准，不会从 POST 变成 GET。

### 4xx 客户端错误

4XX 的响应结果表明客户端发生错误。

- 400 Bad Request：请求报文中存在语法错误。
- 401 Unauthority：该状态码表示发送的请求需要有通过 HTTP 认证（BASIC 认证、DIGEST 认证）的认证信息。。当浏览器初次接收到 401 响应，会弹出认证用的对话窗口。
- 403 Forbidden：对请求资源的访问被服务器拒绝。
- 404 Not found：服务器无法找到请求的资源。

### 5xx 服务器错误

- 500 Internal Server Error：服务器端在执行请求时发生了错误。
- 503 Service Unavailable：服务器暂时处于超负载或正在进行停机维护，现在无法处理请求。



## Web 服务器

### 代理

代理服务器的基本行为就是接收客户端发送的请求后转发给其他服务器。代理不改变请求 URI，会直接发送给前方持有资源的目标服务器。从源服务器返回的响应经过代理服务器后再传给客户端。

每次通过代理服务器转发请求或响应时，会追加写入 Via 首部信息。

![代理](https://img2018.cnblogs.com/blog/1252910/201908/1252910-20190827110048152-222417304.png)

代理服务器的好处：利用缓存技术减少网络带宽的流量，组织内部针对特定网站的访问控制，以获取访问日志为主要目的。

代理转发响应时，缓存代理（Caching Proxy）会预先将资源的副本保存在代理服务器上。当代理再次接收到对相同资源的请求时，就可以不从源服务器那里获取资源，而是将之前缓存的资源作为响应返回。

转发请求或响应时，不对报文做任何加工的代理类型被称为透明代理（Transparent Proxy）。反之，对报文内容进行加工的代理被称为非透明代理。

### 网关

利用网关可以由 HTTP 请求转化为其他协议通信。而网关能使通信线路上的服务器提供非 HTTP 协议服务。利用网关能提高通信的安全性，因为可以在客户端与网关之间的通信线路上加密以确保连接的安全。比如，网关可以连接数据库，使用SQL 语句查询数据。

### 隧道

隧道可按要求建立起一条与其他服务器的通信线路，届时使用 SSL 等加密手段进行通信。隧道的目的是确保客户端能与远距离的服务器进行安全的通信。
隧道本身不会去解析 HTTP 请求。请求保持原样中转给之后的服务器。隧道会在通信双方断开连接时结束。



## HTTPS

HTTP 缺点：

- 明文传输，内容可能被窃听
- 不验证对方的身份（可能遭遇伪装）
- 无法证明报文的完整性（可能被篡改）

内容的加密

把 HTTP 报文里所含的内容进行加密处理。前提是要求客户端和服务器同时具备加密和解密机制。

通信的加密

HTTP 协议中没有安全机制，但可以和 SSL（secure socket layer，安全套接层）或TLS（transport layer security，安全层传输协议）组合使用，加密 HTTP 的通信内容。用 SSL 建立安全通信线路以后，就可以在这条线路上进行 HTTP 通信了。与 SSL 组合使用的 HTTP 被称为 HTTPS（HTTP Secure，超文本传输安全协议）。

HTTPS 并非是应用层的一种新协议。只是 HTTP 通信接口部分用SSL（Secure Socket Layer）和 TLS（Transport Layer Security）协议代替而已。

通常，HTTP 直接和 TCP 通信。当使用 SSL 时，则演变成先和 SSL 通信，再由 SSL 和 TCP 通信了。

在采用 SSL 后，HTTP 就拥有了 HTTPS 的加密、证书和完整性保护这些功能。

SSL 是独立于 HTTP 的协议，其他运行在应用层的 SMTP 和 Telnet 等协议均可配合 SSL 协议使用。SSL 是一种网络安全技术。

### 公开密钥加密

SSL 采用一种叫做公开密钥加密（Public-key cryptography）的加密处理方式。近代的加密方法中加密算法是公开的，而密钥却是保密的。通过这种方式得以保持加密方法的安全性。加密和解密都会用到密钥。

共享密钥在发送密钥时可能会被窃听，公开密钥加密方式很好地解决了共享密钥加密的困难。公开密钥加密方式使用一对非对称的密钥，一把私有密钥（private key），一把公开密钥（public key）。

使用公开密钥加密方式，发送密文的一方使用对方的公开密钥进行加密处理，对方收到被加密的信息后，再使用自己的私有密钥进行解密。

公开密钥加密与共享密钥加密相比，其处理速度要慢。HTTPS 采用共享密钥加密和公开密钥加密两者并用的混合加密机制。在交换密钥环节使用公开密钥加密方式，之后的建立通信交换报文阶段则使用共享密钥加密方式。

HTTPS 存在的问题是处理速度相对慢一点，HTTPS 比 HTTP 要慢 2 到 100 倍。HTTPS 需要进行 SSL 通信，消耗网络资源，而且在服务器和客户端都需要进行加密和解密的运算处理，大量消耗CPU 及内存等资源，导致处理速度变慢。要进行 HTTPS 通信必须向认证机构 CA 购买，需要承担一笔费用。



## 认证机制

HTTP/1.1 使用的认证方式有：

- BASIC 认证（基本认证）
- DIGEST 认证（摘要认证）
- SSL 客户端认证
- FormBase 认证（基于表单认证）
- Windows 统一认证（Keberos 认证、NTLM 认证）

### BASIC 认证

Basic认证是客户端与服务器进行请求时，允许通过用户名和密码实现的一种身份认证方式，从 HTTP/1.0 开始就定义了。

1. 当请求的资源需要 BASIC 认证时，服务器会返回状态码 401 Authorization Required，同时返回带 WWW-Authenticate 首部字段的响应。
2. 接收到状态码 401 的客户端为了通过 BASIC 认证，需要将用户 ID 及密码经过BASE64加密附加到请求信息中发送给服务器。
3. 接收到包含首部字段 Authorization 请求的服务器，会对认证信息的正确性进行验证。如验证通过，则返回一条包含 Request-URI资源的响应。

BASIC 认证使用上不够便捷灵活，且达不到多数 Web 网站期望的安全性等级，因此它并不常用。

### DIGEST 认证

从 HTTP/1.1 起就有了 DIGEST 认证。DIGEST 认证证同样使用质询 / 响应的方式（challenge/response），但不会像 BASIC 认证那样直接发送明文密码。

质询响应方式：一开始一方会先发送认证要求给另一方，接着使用从另一方那接收到的质询码计算生成响应码。最后将响应码返回给对方进行认证的方式。

DIGEST 认证和 BASIC 认证一样，使用上不那么便捷灵活，且仍达不到多数 Web 网站对高度安全等级的追求标准。因此它的适用范围也有所受限。

### SSL 客户端认证

为达到 SSL 客户端认证的目的，需要事先将客户端证书分发给客户端，且客户端必须安装此证书。

1. 接收到需要认证资源的请求，服务器会发送 Certificate Request 报文，要求客户端提供客户端证书。
2. 用户选择将发送的客户端证书后，客户端会把客户端证书信息以 Client Certificate 报文方式发送给服务器。
3. 服务器验证客户端证书，验证通过后方可领取证书内客户端的公开密钥，然后开始 HTTPS 加密通信。

### 基于表单认证

使用 Cookie 来管理 Session，以弥补 HTTP 协议中不存在的状态管理功能。

1. 客户端把用户 ID 和密码等登录信息放入报文的实体部分，通常是以 POST 方法把请求发送给服务器。
2. 服务器会发放用以识别用户的 Session ID。通过验证从客户端发送过来的登录信息进行身份认证，然后把用户的认证状态与 Session ID 绑定后记录在服务器端。向客户端返回响应时，会在首部字段 Set-Cookie 内写入 Session ID。
3. 客户端接收到从服务器端发来的 Session ID 后，会将其作为 Cookie 保存在本地。下次向服务器发送请求时，浏览器会自动发送 Cookie，所以 Session ID 也随之发送到服务器。服务器端可通过验证接收到的 Session ID 识别用户和其认证状态。

服务器端保存密码的方法：给密码加盐（salt）的方式增加额外信息，再使用散列（hash）函数计算出散列值后保存。

salt 其实就是由服务器随机生成的一个字符串。然后把它和密码字符串相连接（前后都可以）生成散列值。当两个用户使用了同一个密码时，由于随机生成的 salt 值不同，对应的散列值也将是不同的。这样一来，很大程度上减少了密码特征。



## 基于 HTTP 的功能追加协议

### WebSocket

WebSocket，即 Web 浏览器与 Web 服务器之间全双工通信标准。Web 服务器与客户端之间建立起 WebSocket 协议的通信连接之后，所有的通信都依靠这个专用协议进行。通信过程中可互相发送JSON、XML、HTML 或图片等任意格式的数据。

WebSocket 协议的主要特点：

- 推送功能：服务器可直接发送数据，而不必等待客户端的请求。
- 减少通信量：只要建立起 WebSocket 连接，就希望一直保持连接状态。WebSocket 的首部信息很小，通信量也相应减少了。
- 与 HTTP 协议有着良好的兼容性。默认端口也是80和443。
- 建立在 TCP 协议之上，服务器端的实现比较容易。
- 握手阶段采用 HTTP 协议。
- 可以发送文本，和二进制数据。

为了实现 WebSocket 通信，需要用到 HTTP 的 Upgrade 首部字段，告知服务器通信协议发生改变，以达到握手的目的。

````http
GET /chat HTTP/1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Origin: http://example.com
Sec-WebSocket-Protocol: chat, superchat
Sec-WebSocket-Version: 13
````

Sec-WebSocket-Key 字段内记录着握手过程中必不可少的键值。Sec-WebSocket-Protocol 字段内记录使用的子协议。

握手响应：

````http
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
Sec-WebSocket-Protocol: chat
````

Sec-WebSocket-Accept 的字段值是由握手请求中的 Sec-WebSocket-Key 的字段值生成的。

握手阶段采用 HTTP 协议，成功握手确立 WebSocket 连接之后，通信时不再使用 HTTP 的数据帧，而采用 WebSocket 独立的数据帧。

![WebSocket通信](https://img2018.cnblogs.com/blog/1252910/201908/1252910-20190828153154857-2009483905.png)



### Web 服务器管理文件的 WebDAV

WebDAV 是一个可对 Web 服务器上的内容直接进行文件复制、编辑等操作的分布式文件系统。除了创建、删除文件等基本功能，它还具备文件创建者管理、文件编辑过程中禁止其他用户内容覆盖的加锁功能，以及对文件内容修改的版本控制功能。



## Web 的攻击技术

对 Web 应用的攻击模式有以下两种：

- 主动攻击
- 被动攻击

主动攻击是攻击者通过直接访问 Web 应用，把攻击代码传入的攻击模式。主动攻击模式里具有代表性的攻击是 SQL 注入攻击和 OS 命令注入攻击。

被动攻击是利用圈套策略执行攻击代码的攻击模式，攻击者不直接对目标 Web 应用访问发起攻击。被动攻击模式中具有代表性的攻击是跨站脚本攻击和跨站点请求伪造。