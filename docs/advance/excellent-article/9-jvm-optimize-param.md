# 美团面试：熟悉哪些JVM调优参数？

今天来熟悉一下，关于`JVM`调优常用的一些参数。

X或者XX开头的都是非标准化参数

![](http://img.dabin-coder.cn/image/jvm参数1.png)

意思就是说标准化参数不会变，非标准化参数可能在每个`JDK`版本中有所变化，但是就目前来看X开头的非标准化的参数改变的也是非常少。

```
格式：-XX:[+-]<name> 表示启用或者禁用name属性。
例子：-XX:+UseG1GC（表示启用G1垃圾收集器）
```

`-XX:+PrintCommandLineFlags`查看当前`JVM`设置过的相关参数：

![](http://img.dabin-coder.cn/image/jvm参数2.png)

## JVM参数分类

根据`JVM`参数开头可以区分参数类型，共三类：“`-`”、“`-X`”、“`-XX`”，

标准参数（-）：所有的JVM实现都必须实现这些参数的功能，而且向后兼容；

例子：`-verbose:class`，`-verbose:gc`，`-verbose:jni……`

非标准参数（-X）：默认jvm实现这些参数的功能，但是并不保证所有jvm实现都满足，且不保证向后兼容；

例子：`Xms20m`，`-Xmx20m`，`-Xmn20m`，`-Xss128k……`

非Stable参数（-XX）：此类参数各个jvm实现会有所不同，将来可能会随时取消，需要慎重使用；

例子：`-XX:+PrintGCDetails`，`-XX:-UseParallelGC`，`-XX:+PrintGCTimeStamps……`

## 堆参数设置

```
-Xms` 初始堆大小，ms是memory start的简称 ，等价于`-XX:InitialHeapSize``-Xmx` 最大堆大小，mx是memory max的简称 ，等价于参数`-XX:MaxHeapSize
```

> 注意：在通常情况下，服务器项目在运行过程中，堆空间会不断的收缩与扩张，势必会造成不必要的系统压力。
>
> 所以在生产环境中，`JVM`的`Xms`和`Xmx`要设置成大小一样的，能够避免`GC`在调整堆大小带来的不必要的压力。

`-XX:NewSize=n` 设置年轻代大小`-XX:NewRatio=n` 设置年轻代和年老代的比值。

如:`-XX:NewRatio=3`，表示年轻代与年老代比值为`1：3`，年轻代占整个年轻代年老代和的1/4，`默认新生代和老年代的比例=1:2`。`-XX:SurvivorRatio=n` 年轻代中Eden区与两个Survivor区的比值。

注意Survivor区有两个，默认是8，表示：`Eden:S0:S1=8:1:1`

如：`-XX:SurvivorRatio=3`，表示`Eden：Survivor`=3：2，一个Survivor区占整个年轻代的1/5。

## 元空间参数

**-XX:MetaspaceSize**：`Metaspace` 空间初始大小，如果不设置的话，默认是20.79M，这个初始大小是触发首次 `Metaspace Full GC`的阈值。

例如：`-XX:MetaspaceSize=256M`

**-XX:MaxMetaspaceSize**：`Metaspace` 最大值，默认不限制大小，但是线上环境建议设置。

例如：`-XX:MaxMetaspaceSize=256M`

**-XX:MinMetaspaceFreeRatio**：最小空闲比，当 `Metaspace` 发生 GC 后，会计算 `Metaspace` 的空闲比，如果空闲比(空闲空间/当前 `Metaspace` 大小)小于此值，就会触发 `Metaspace` 扩容。默认值是 40 ，也就是 40%，例如 -XX:MinMetaspaceFreeRatio=40

**-XX:MaxMetaspaceFreeRatio**:最大空闲比，当 `Metaspace`发生 GC 后，会计算 `Metaspace` 的空闲比，如果空闲比(空闲空间/当前 Metaspace 大小)大于此值，就会触发 `Metaspace` 释放空间。默认值是 70 ，也就是 70%，例如 -`XX:MaxMetaspaceFreeRatio=70`

> 建议将 `MetaspaceSize` 和 `MaxMetaspaceSize`设置为同样大小，避免频繁扩容。

## 栈参数设置

**-Xss**：栈空间大小，栈是线程独占的，所以是一个线程使用栈空间的大小。

例如：`-Xss256K`，如果不设置此参数，默认值是`1M`，一般来讲设置成 `256K` 就足够了。

## 收集器参数设置

Serial垃圾收集器（新生代）

> 开启：-XX:+UseSerialGC 关闭：-XX:-UseSerialGC //新生代使用Serial  老年代则使用SerialOld

ParNew垃圾收集器（新生代）

> 开启 -XX:+UseParNewGC 关闭 -XX:-UseParNewGC //新生代使用功能ParNew 老年代则使用功能CMS

Parallel Scavenge收集器（新生代）

> 开启 -XX:+UseParallelOldGC 关闭 -XX:-UseParallelOldGC //新生代使用功能Parallel Scavenge 老年代将会使用Parallel Old收集器

ParallelOl垃圾收集器（老年代）

> 开启 -XX:+UseParallelGC 关闭 -XX:-UseParallelGC //新生代使用功能Parallel Scavenge 老年代将会使用Parallel Old收集器

CMS垃圾收集器（老年代）

> 开启 -XX:+UseConcMarkSweepGC 关闭 -XX:-UseConcMarkSweepGC

G1垃圾收集器

> 开启 -XX:+UseG1GC 关闭 -XX:-UseG1GC

## GC策略参数配置

GC停顿时间，垃圾收集器会尝试用各种手段达到这个时间，比如减小年轻代

> -XX:MaxGCPauseMillis

堆占用了多少比例的时候触发GC，就即触发标记周期的 Java 堆占用率阈值。默认占用率是整个 Java 堆的 45%

> -XX:InitiatingHeapOccupancyPercent=n

新生代可容纳的最大对象,大于则直接会分配到老年代，0代表没有限制。

> -XX:PretenureSizeThreshold=1000000 //

进入老年代最小的GC年龄,年轻代对象转换为老年代对象最小年龄值，默认值7

> -XX:InitialTenuringThreshol=7

升级老年代年龄，最大值15

> -XX:MaxTenuringThreshold

GC并行执行线程数

> -XX:ParallelGCThreads=16

禁用 System.gc()，由于该方法默认会触发 FGC，并且忽略参数中的 UseG1GC 和 UseConcMarkSweepGC，因此必要时可以禁用该方法。

> -XX:-+DisableExplicitGC

设置吞吐量大小,默认99

> XX:GCTimeRatio

打开自适应策略,各个区域的比率，晋升老年代的年龄等参数会被自动调整。以达到吞吐量，停顿时间的平衡点。

> XX:UseAdaptiveSizePolicy

设置GC时间占用程序运行时间的百分比

> GCTimeRatio

## Dump异常快照

```
-XX:+HeapDumpOnOutOfMemoryError
-XX:HeapDumpPath
```

堆内存出现`OOM`的概率是所有内存耗尽异常中最高的，出错时的堆内信息对解决问题非常有帮助。

所以给`JVM`设置这个参数(`-XX:+HeapDumpOnOutOfMemoryError`)，让`JVM`遇到`OOM`异常时能输出堆内信息，并通过（`-XX:+HeapDumpPath`）参数设置堆内存溢出快照输出的文件地址。

这对于特别是对相隔数月才出现的`OOM`异常尤为重要。

```
-Xms10M -Xmx10M -Xmn2M -XX:SurvivorRatio=8 -XX:+HeapDumpOnOutOfMemoryError 
-XX:HeapDumpPath=D:\study\log_hprof\gc.hprof
-XX:OnOutOfMemoryError
```

表示发生`OOM后`，运行`jconsole.exe`程序。

这里可以不用加“”，因为`jconsole.exe`路径Program Files含有空格。利用这个参数，我们可以在系统`OOM`后，自定义一个脚本，可以用来发送邮件告警信息，可以用来重启系统等等。

```
-XX:OnOutOfMemoryError="C:\Program Files\Java\jdk1.8.0_151\bin\jconsole.exe"
```

## 8G内存的服务器该如何设置

```
java -Xmx3550m -Xms3550m -Xss128k -XX:NewRatio=4 -XX:SurvivorRatio=4 -XX:MaxPermSize=16m -XX:MaxTenuringThreshold=0
```

`-Xmx3500m` 设置`JVM`最大可用内存为3550M。

`-Xms3500m` 设置`JVM``初始`内存为`3550m`。此值可以设置与`-Xmx`相同，以避免每次垃圾回收完成后JVM重新分配内存。`-Xmn2g` 设置年轻代大小为`2G`。

> 整个堆大小=年轻代大小 + 年老代大小 + 方法区大小

`-Xss128k` 设置每个线程的堆栈大小。

`JDK1.5`以后每个线程堆栈大小为1M，以前每个线程堆栈大小为256K。更具应用的线程所需内存大小进行调整。在相同物理内存下，减小这个值能生成更多的线程。但是操作系统对一个进程内的线程数还是有限制的，不能无限生成，经验值在3000~5000左右。

`-XX:NewRatio=4` 设置年轻代（包括Eden和两个Survivor区）与年老代的比值（除去持久代）。设置为4，则年轻代与年老代所占比值为1：4，年轻代占整个堆栈的1/5 。

`-XX:SurvivorRatio=4` 设置年轻代中Eden区与Survivor区的大小比值。

设置为4，则两个Survivor区与一个Eden区的比值为2:4，一个Survivor区占整个年轻代的1/6 `-XX:MaxPermSize=16m` 设置持久代大小为16m。

`-XX:MaxTenuringThreshold=0` 设置垃圾最大年龄。

如果设置为0的话，则年轻代对象不经过Survivor区，直接进入年老代。对于年老代比较多的应用，可以提高效率。如果将此值设置为一个较大值，则年轻代对象会在Survivor区进行多次复制，这样可以增加对象在年轻代的存活时间，增加在年轻代即被回收的概论。

## 项目中，GC日志配置

比如，我们启动一个user-service项目：

```
 java  
 -XX:+PrintGCDetails -XX:+PrintGCDateStamps 
 -XX:+UseGCLogFileRotation 
 -XX:+PrintHeapAtGC -XX:NumberOfGCLogFiles=5  
 -XX:GCLogFileSize=20M    
 -Xloggc:/opt/user-service-gc-%t.log  
 -jar user-service-1.0-SNAPSHOT.jar 
```

参数解释：

```
 -Xloggc:/opt/app/ard-user/user-service-gc-%t.log   设置日志目录和日志名称
 -XX:+UseGCLogFileRotation           开启滚动生成日志
 -XX:NumberOfGCLogFiles=5            滚动GC日志文件数，默认0，不滚动
 -XX:GCLogFileSize=20M               GC文件滚动大小，需开启UseGCLogFileRotation
 -XX:+PrintGCDetails                 开启记录GC日志详细信息（包括GC类型、各个操作使用的时间）,并且在程序运行结束打印出JVM的内存占用情况
 -XX:+ PrintGCDateStamps             记录系统的GC时间           
 -XX:+PrintGCCause                   产生GC的原因(默认开启)
```

## 项目中没用过怎么办？

对于很多没用过的人来说，面试官问项目中这些参数是怎么用？此时，很容易选择妥协，傻傻的回答**没用过**。

偷偷的告诉你，很多面试官也没有用过。

另外，你可以自己搞个小项目，把`JVM`参数设置小点，使用测试工具`JMeter`，多线程测试一下。

在代码里可以自己编造以下问题：

> 内存溢出
>
> 内存泄漏
>
> 栈溢出

然后使用`JVM`参数进行调优，或者通过`JVM`工具和相关命令找到问题，然后解决问题。

> 自己一定要动手，别人永远是别人的，自己体会了自己经历了，那才是自己的。

