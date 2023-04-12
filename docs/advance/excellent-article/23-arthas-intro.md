---
sidebar: heading
title: Arthas 常用命令
category: 优质文章
tag:
  - JVM
head:
  - - meta
    - name: keywords
      content: Arthas常用命令,Arthas
  - - meta
    - name: description
      content: 优质文章汇总
---

# Arthas 常用命令

### 简介

Arthas 是Alibaba开源的Java诊断工具，动态跟踪Java代码；实时监控JVM状态，可以在不中断程序执行的情况下轻松完成JVM相关问题排查工作 。支持JDK 6+，支持Linux/Mac/Windows。这个工具真的很好用，而且入门超简单，十分推荐。

### 使用场景

1. 这个类从哪个 jar 包加载的？为什么会报各种类相关的 Exception？
2. 我改的代码为什么没有执行到？难道是我没 commit？分支搞错了？
3. 遇到问题无法在线上 debug，难道只能通过加日志再重新发布吗？
4. 线上遇到某个用户的数据处理有问题，但线上同样无法 debug，线下无法重现！
5. 是否有一个全局视角来查看系统的运行状况？
6. 有什么办法可以监控到JVM的实时运行状态？接下来，围绕这6个问题，学习下Arthas的基本用法。

### 安装

执行下面命令下载

```
wget https://alibaba.github.io/arthas/arthas-boot.jar
```

用java -jar的方式启动

```
java -jar arthas-boot.jar

[INFO] Found existing java process, please choose one and hit RETURN.
* [1]: 79952 cn.test.MobileApplication
  [2]: 93872 org.jetbrains.jps.cmdline.Launcher
```

然后输入数字，选择你想要监听的应用，回车即可

### 常用命令

查询arthas版本

```
[arthas@79952]$ version
3.1.4
```

#### 1、stack

输出当前方法被调用的调用路径

很多时候我们都知道一个方法被执行，但是有很多地方调用了它，你并不知道是谁调用了它，此时你需要的是 stack 命令。

| 参数名称         | 参数说明         |
| :--------------- | :--------------- |
| *class-pattern*  | 类名表达式匹配   |
| *method-pattern* | 方法名表达式匹配 |

```bash
[arthas@79952]$ stack com.baomidou.mybatisplus.extension.service.IService getOne
Press Q or Ctrl+C to abort.
Affect(class-cnt:202 , method-cnt:209) cost in 10761 ms.
ts=2019-11-13 11:49:13;thread_name=http-nio-8801-exec-6;id=2d;is_daemon=true;priority=5;TCCL=org.springframework.boot.web.embedded.tomcat.TomcatEmbeddedWebappClassLoader@a6c54c3
    @com.baomidou.mybatisplus.extension.service.impl.ServiceImpl.getOne()
        at com.baomidou.mybatisplus.extension.service.IService.getOne(IService.java:230)
        ...... ......
        at cn.test.mobile.controller.order.OrderController.getOrderInfo(OrderController.java:500)
```

可以看到OrderController.java的第500行调用了这个getOne接口。

*注意这个命令需要调用后才会触发日志，相似的还有watch、trace等*

#### 2、jad

反编译指定已加载类的源码

有时候，版本发布后，代码竟然没有执行，代码是最新的吗，这时可以使用jad反编译相应的class。

```bash
jad cn.test.mobile.controller.order.OrderController
```

仅编译指定的方法

```bash
jad cn.test.mobile.controller.order.OrderController getOrderInfo

ClassLoader:
@RequestMapping(value={"getOrderInfo"}, method={RequestMethod.POST})
public Object getOrderInfo(HttpServletRequest request, @RequestBody Map map) {
    ResponseVo responseVo = new ResponseVo();
    ... ... ...  ...
```

#### 3、sc

“Search-Class” 的简写 ，查看JVM已加载的类信息 有的时候，你只记得类的部分关键词，你可以用sc获取完整名称 当你碰到这个错的时候“ClassNotFoundException”或者“ClassDefNotFoundException”，你可以用这个命令验证下

| 参数名称         | 参数说明                                                     |
| :--------------- | :----------------------------------------------------------- |
| *class-pattern*  | 类名表达式匹配                                               |
| *method-pattern* | 方法名表达式匹配                                             |
| [d]              | 输出当前类的详细信息，包括这个类所加载的原始文件来源、类的声明、加载的ClassLoader等详细信息。如果一个类被多个ClassLoader所加载，则会出现多次 |

模糊搜索

```bash
sc *OrderController*
cn.test.mobile.controller.order.OrderController
```

打印类的详细信息  sc -d

```bash
sc -d cn.test.mobile.controller.order.OrderController

 class-info        cn.test.mobile.controller.order.OrderController
 code-source       /F:/IDEA-WORKSPACE-TEST-qyb/trunk/BE/mobile/target/classes/
 name              cn.test.mobile.controller.order.OrderController
 isInterface       false
 isAnnotation      false
 isEnum            false
 isAnonymousClass  false
 isArray           false
 isLocalClass      false
 isMemberClass     false
 isPrimitive       false
 isSynthetic       false
 simple-name       OrderController
 modifier          public
 annotation        org.springframework.web.bind.annotation.RestController,org.springframework.web.bind.annotation.Requ
                   estMapping
 interfaces
 super-class       +-cn.test.mobile.controller.BaseController
                     +-java.lang.Object
 class-loader      +-sun.misc.Launcher$AppClassLoader@18b4aac2
                     +-sun.misc.Launcher$ExtClassLoader@480bdb19
 classLoaderHash   18b4aac2
```

与之相应的还有sm( “Search-Method”  )，查看已加载类的方法信息

查看String里的方法

```bash
sm java.lang.String
java.lang.String <init>([BII)V
java.lang.String <init>([BLjava/nio/charset/Charset;)V
java.lang.String <init>([BLjava/lang/String;)V
java.lang.String <init>([BIILjava/nio/charset/Charset;)V
java.lang.String <init>([BIILjava/lang/String;)V
... ... ... ...
```

查看String中toString的详细信息

```bash
sm -d java.lang.String toString
declaring-class  java.lang.String
 method-name      toString
 modifier         public
 annotation
 parameters
 return           java.lang.String
 exceptions
 classLoaderHash  null
```

#### 4、watch

可以监测一个方法的入参和返回值

有些问题线上会出现，本地重现不了，这时这个命令就有用了

| 参数名称            | 参数说明                                                 |
| :------------------ | :------------------------------------------------------- |
| *class-pattern*     | 类名表达式匹配                                           |
| *method-pattern*    | 方法名表达式匹配                                         |
| *express*           | 观察表达式                                               |
| *condition-express* | 条件表达式                                               |
| [b]                 | 在**方法调用之前**观察                                   |
| [e]                 | 在**方法异常之后**观察                                   |
| [s]                 | 在**方法返回之后**观察                                   |
| [f]                 | 在**方法结束之后**(正常返回和异常返回)观察，**默认选项** |
| [E]                 | 开启正则表达式匹配，默认为通配符匹配                     |
| [x:]                | 指定输出结果的属性遍历深度，默认为 1                     |

观察getOrderInfo的出参和返回值，出参就是方法结束后的入参

```
watch cn.test.mobile.controller.order.OrderController getOrderInfo "{params,returnObj}" -x 2

Press Q or Ctrl+C to abort.
Affect(class-cnt:1 , method-cnt:1) cost in 456 ms.
ts=2019-11-13 15:30:18; [cost=18.48307ms] result=@ArrayList[
    @Object[][  # 这个就是出参，params
        @RequestFacade[org.apache.catalina.connector.RequestFacade@1d81dbd7],
        @LinkedHashMap[isEmpty=false;size=2], # 把遍历深度x改为3就可以查看map里的值了
    ],
    @ResponseVo[ # 这个就是返回值 returnObj
        log=@Logger[Logger[cn.test.db.common.vo.ResponseVo]],
        success=@Boolean[true],
        message=@String[Ok],
        count=@Integer[0],
        code=@Integer[1000],
        data=@HashMap[isEmpty=false;size=1],
    ],
]
```

观察getOrderInfo的入参和返回值

```
watch cn.test.mobile.controller.order.OrderController getOrderInfo "{params,returnObj}" -x 3 -b

Press Q or Ctrl+C to abort.
Affect(class-cnt:1 , method-cnt:1) cost in 93 ms.
ts=2019-11-13 15:37:38; [cost=0.012479ms] result=@ArrayList[
    @Object[][
        @RequestFacade[
            request=@Request[org.apache.catalina.connector.Request@d04e652],
            sm=@StringManager[org.apache.tomcat.util.res.StringManager@7ae7a97b],
        ],
        @LinkedHashMap[
            @String[payNo]:@String[190911173713755288],
            @String[catalogId]:@String[6],
        ],
    ],
    null,# -b是方法调用之前观察，所以还没有返回值
]
```

如果需要捕捉异常的话，使用throwExp，如{params,returnObj,throwExp}

#### 5、trace

输出方法内部调用路径，和路径上每个节点的耗时

可以通过这个命令，查看哪些方法耗性能，从而找出导致性能缺陷的代码，这个耗时还包含了arthas执行的时间哦。

| 参数名称            | 参数说明                             |
| :------------------ | :----------------------------------- |
| *class-pattern*     | 类名表达式匹配                       |
| *method-pattern*    | 方法名表达式匹配                     |
| *condition-express* | 条件表达式                           |
| [E]                 | 开启正则表达式匹配，默认为通配符匹配 |
| `[n:]`              | 命令执行次数                         |
| `#cost`             | 方法执行耗时                         |

输出getOrderInfo的调用路径

```bash
trace -j cn.test.mobile.controller.order.OrderController getOrderInfo

Press Q or Ctrl+C to abort.
Affect(class-cnt:1 , method-cnt:1) cost in 92 ms.
---ts=2019-11-13 15:46:59;thread_name=http-nio-8801-exec-4;id=2b;is_daemon=true;priority=5;TCCL=org.springframework.boot.web.embedded.tomcat.TomcatEmbeddedWebappClassLoader@a6c54c3
    ---[15.509011ms] cn.test.mobile.controller.order.OrderController:getOrderInfo()
        +---[0.03584ms] cn.test.db.common.vo.ResponseVo:<init>() #472
        +---[0.00992ms] java.util.HashMap:<init>() #473
        +---[0.02176ms] cn.test.mobile.controller.order.OrderController:getUserInfo() #478
        +---[0.024ms] java.util.Map:get() #483
        +---[0.00896ms] java.lang.Object:toString() #483
        +---[0.00864ms] java.lang.Integer:parseInt() #483
        +---[0.019199ms] com.baomidou.mybatisplus.core.conditions.query.QueryWrapper:<init>() #500
        +---[0.135679ms] com.baomidou.mybatisplus.core.conditions.query.QueryWrapper:allEq() #500
        +---[12.476072ms] cn.test.db.service.IOrderMediaService:getOne() #500
        +---[0.0128ms] java.util.HashMap:put() #501
        +---[0.443517ms] cn.test.db.common.vo.ResponseVo:setSuccess() #503
        `---[0.03488ms] java.util.Map:put() #504
```

输出getOrderInfo的调用路径，且cost大于10ms，-j是指过滤掉jdk中的方法，可以看到输出少了很多

```bash
trace -j cn.test.mobile.controller.order.OrderController getOrderInfo '#cost > 10'

Press Q or Ctrl+C to abort.
Affect(class-cnt:1 , method-cnt:1) cost in 96 ms.
---ts=2019-11-13 15:53:42;thread_name=http-nio-8801-exec-2;id=29;is_daemon=true;priority=5;TCCL=org.springframework.boot.web.embedded.tomcat.TomcatEmbeddedWebappClassLoader@a6c54c3
    ---[13.803743ms] cn.test.mobile.controller.order.OrderController:getOrderInfo()
        +---[0.01312ms] cn.test.db.common.vo.ResponseVo:<init>() #472
        +---[0.01408ms] cn.test.mobile.controller.order.OrderController:getUserInfo() #478
        +---[0.0128ms] com.baomidou.mybatisplus.core.conditions.query.QueryWrapper:<init>() #500
        +---[0.303998ms] com.baomidou.mybatisplus.core.conditions.query.QueryWrapper:allEq() #500
        +---[12.675431ms] cn.test.db.service.IOrderMediaService:getOne() #500
        `---[0.409917ms] cn.test.db.common.vo.ResponseVo:setSuccess() #503
```

#### 6、jobs

执行后台异步任务

线上有些问题是偶然发生的，这时就需要使用异步任务，把信息写入文件。

使用 & 指定命令去后台运行，使用 > 将结果重写到日志文件，以trace为例

```bash
trace -j cn.test.mobile.controller.order.OrderController getOrderInfo > test.out &
```

jobs——列出所有job

```bash
 jobs
[76]*  
       Running           trace -j cn.test.mobile.controller.order.OrderController getOrderInfo >> test.out &
       execution count : 0
       start time      : Wed Nov 13 16:13:23 CST 2019
       timeout date    : Thu Nov 14 16:13:23 CST 2019
       session         : f4fba846-e90b-4234-959e-e78ad0a5db8c (current)
```

job id是76, * 表示此job是当前session创建，状态是Running，execution count是执行次数，timeout date是超时时间

异步执行时间，默认为1天，如果要修改，使用options命令,

```
options job-timeout 2d
```

options可选参数 1d, 2h, 3m, 25s，分别代表天、小时、分、秒

kill——强制终止任务

```
kill 76
kill job 76 success
```

最多同时支持8个命令使用重定向将结果写日志

请勿同时开启过多的后台异步命令，以免对目标JVM性能造成影响

#### 7、logger

查看logger信息，更新logger level

查看

```bash
logger
 name                ROOT
 class               ch.qos.logback.classic.Logger
 classLoader         sun.misc.Launcher$AppClassLoader@18b4aac2
 classLoaderHash     18b4aac2 #改日志级别时要用到它
 level               INFO
 effectiveLevel      INFO
 ... ... ... ...
```

更新日志级别

```
logger --name ROOT --level debug
update logger level success.
```

如果执行这个命令时出错：update logger level fail.

指定classLoaderHash重试一下试试

```
logger -c 18b4aac2 --name ROOT --level debug
update logger level success.
```

#### 8、dashboard

查看当前系统的实时数据面板 这个命令可以全局的查看jvm运行状态，比如内存和cpu占用情况

```bash
dashboard
ID        NAME                          GROUP               PRIORITY STATE     %CPU      TIME      INTERRUPT DAEMON
17        Abandoned connection cleanup  main                5        TIMED_WAI 0         0:0       false     true
1009      AsyncAppender-Worker-arthas-c system              5        WAITING   0         0:0       false     true
5         Attach Listener               system              5        RUNNABLE  0         0:0       false     true
23        ContainerBackgroundProcessor[ main                5        TIMED_WAI 0         0:0       false     true
55        DestroyJavaVM                 main                5        RUNNABLE  0         0:11      false     false
3         Finalizer                     system              8        WAITING   0         0:0       false     true
18        HikariPool-1 housekeeper      main                5        TIMED_WAI 0         0:0       false     true
39        NioBlockingSelector.BlockPoll main                5        RUNNABLE  0         0:0       false     true
2         Reference Handler             system              10       WAITING   0         0:0       false     true
4         Signal Dispatcher             system              9        RUNNABLE  0         0:0       false     true
69        System Clock                  main                5        TIMED_WAI 0         0:34      false     true
25        Thread-2                      main                5        TIMED_WAI 0         0:0       false     false
37        Timer-0                       main                5        TIMED_WAI 0         0:0       false     true
Memory                    used    total    max     usage    GC
heap                      216M    415M     3614M   5.99%    gc.ps_scavenge.count          96
ps_eden_space             36M     78M      1276M   2.90%    gc.ps_scavenge.time(ms)       3054
ps_survivor_space         17M     38M      38M     46.53%   gc.ps_marksweep.count         4
ps_old_gen                161M    298M     2711M   5.97%    gc.ps_marksweep.time(ms)      804
nonheap                   175M    180M     -1      97.09%
code_cache                35M     35M      240M    14.85%
```

ID: Java级别的线程ID，注意这个ID不能跟jstack中的nativeID一一对应 我们可以通过 thread id 查看线程的堆栈 信息

```bash
thread 2
"Reference Handler" Id=2 WAITING on java.lang.ref.Reference$Lock@66ad4272
    at java.lang.Object.wait(Native Method)
    -  waiting on java.lang.ref.Reference$Lock@66ad4272
    at java.lang.Object.wait(Object.java:502)
    at java.lang.ref.Reference.tryHandlePending(Reference.java:191)
    at java.lang.ref.Reference$ReferenceHandler.run(Reference.java:153)
```

NAME: 线程名

GROUP: 线程组名

PRIORITY: 线程优先级, 1~10之间的数字，越大表示优先级越高

STATE: 线程的状态

CPU%: 线程消耗的cpu占比，采样100ms，将所有线程在这100ms内的cpu使用量求和，再算出每个线程的cpu使用占比。

TIME: 线程运行总时间，数据格式为分：秒

INTERRUPTED: 线程当前的中断位状态

DAEMON: 是否是daemon线程

#### 9、redefine

redefine jvm已加载的类 ，可以在不重启项目的情况下，热更新类。

这个功能真的很强大，但是命令不一定会成功

下面我们来模拟：假设我想修改OrderController里的某几行代码，然后热更新至jvm：

a. 反编译OrderController，默认情况下，反编译结果里会带有ClassLoader信息，通过--source-only选项，可以只打印源代码。方便和mc/redefine命令结合使用

```
jad --source-only cn.test.mobile.controller.order.OrderController > OrderController.java
```

生成的OrderController.java在哪呢，执行pwd就知道在哪个目录了

b. 查找加载OrderController的ClassLoader

```
sc -d cn.test.mobile.controller.order.OrderController | grep classLoaderHash
classLoaderHash   18b4aac2
```

c. 修改保存好OrderController.java之后，使用mc(Memory Compiler)命令来编译成字节码，并且通过-c参数指定ClassLoader

```
mc -c 18b4aac2 OrderController.java -d ./
```

d. 热更新刚才修改后的代码

```
redefine -c 18b4aac2 OrderController.class
redefine success, size: 1
```

然后代码就更新成功了。

### 其他

如果java -jar选择启动某个应用的时候，报下面的错

```bash
java -jar arthas-boot.jar
[INFO] arthas-boot version: 3.1.4
[INFO] Process 11544 already using port 3658
[INFO] Process 11544 already using port 8563
[INFO] Found existing java process, please choose one and hit RETURN.
* [1]: 11544
  [2]: 119504 cn.test.MobileApplication
  [3]: 136340 org.jetbrains.jps.cmdline.Launcher
  [4]: 3068
2 #选择第2个启动
[ERROR] Target process 119504 is not the process using port 3658, you will connect to an unexpected process.
[ERROR] 1. Try to restart arthas-boot, select process 11544, shutdown it first with running the 'shutdown' command.
[ERROR] 2. Or try to use different telnet port, for example: java -jar arthas-boot.jar --telnet-port 9998 --http-port -1
```

注意提示[ERROR] 1，只需要进入11544这个应用，然后执行shutdown关闭这个应用就可以启动了
