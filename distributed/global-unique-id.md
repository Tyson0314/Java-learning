传统的单体架构的时候，我们基本是单库然后业务单表的结构。每个业务表的ID一般我们都是从1增，通过`AUTO_INCREMENT=1`设置自增起始值，但是在分布式服务架构模式下分库分表的设计，使得多个库或多个表存储相同的业务数据。这种情况根据数据库的自增ID就会产生相同ID的情况，不能保证主键的唯一性。

![](http://img.dabin-coder.cn/image/20220508235751.png)

如上图，如果第一个订单存储在 DB1 上则订单 ID 为1，当一个新订单又入库了存储在 DB2 上订单 ID 也为1。我们系统的架构虽然是分布式的，但是在用户层应是无感知的，重复的订单主键显而易见是不被允许的。那么针对分布式系统如何做到主键唯一性呢？

## UUID

UUID （Universally Unique Identifier），通用唯一识别码的缩写。UUID是由一组32位数的16进制数字所构成，所以UUID理论上的总数为 1632=2128，约等于 3.4 x 10^38。也就是说若每纳秒产生1兆个UUID，要花100亿年才会将所有UUID用完。

生成的UUID是由 `8-4-4-4-12`格式的数据组成，其中32个字符和4个连字符' - '，一般我们使用的时候会将连字符删除 `uuid.toString().replaceAll("-","")`。

目前UUID的产生方式有5种版本，每个版本的算法不同，应用范围也不同。

- **基于时间的UUID - 版本1**：
  这个一般是通过当前时间，随机数，和本地Mac地址来计算出来，可以通过 `org.apache.logging.log4j.core.util`包中的 `UuidUtil.getTimeBasedUuid()`来使用或者其他包中工具。由于使用了MAC地址，因此能够确保唯一性，但是同时也暴露了MAC地址，私密性不够好。
- **DCE安全的UUID - 版本2**
  DCE（Distributed Computing Environment）安全的UUID和基于时间的UUID算法相同，但会把时间戳的前4位置换为POSIX的UID或GID。这个版本的UUID在实际中较少用到。
- **基于名字的UUID（MD5）- 版本3**
  基于名字的UUID通过计算名字和名字空间的MD5散列值得到。这个版本的UUID保证了：相同名字空间中不同名字生成的UUID的唯一性；不同名字空间中的UUID的唯一性；相同名字空间中相同名字的UUID重复生成是相同的。
- **随机UUID - 版本4**
  根据随机数，或者伪随机数生成UUID。这种UUID产生重复的概率是可以计算出来的，但是重复的可能性可以忽略不计，因此该版本也是被经常使用的版本。JDK中使用的就是这个版本。
- **基于名字的UUID（SHA1） - 版本5**
  和基于名字的UUID算法类似，只是散列值计算使用SHA1（Secure Hash Algorithm 1）算法。

我们 Java中 JDK自带的 UUID产生方式就是版本4根据随机数生成的 UUID 和版本3基于名字的 UUID，有兴趣的可以去看看它的源码。

```java
public static void main(String[] args) {

    //获取一个版本4根据随机字节数组的UUID。
    UUID uuid = UUID.randomUUID();
    System.out.println(uuid.toString().replaceAll("-",""));

    //获取一个版本3(基于名称)根据指定的字节数组的UUID。
    byte[] nbyte = {10, 20, 30};
    UUID uuidFromBytes = UUID.nameUUIDFromBytes(nbyte);
    System.out.println(uuidFromBytes.toString().replaceAll("-",""));
}
```

得到的UUID结果，

```undefined
59f51e7ea5ca453bbfaf2c1579f09f1d
7f49b84d0bbc38e9a493718013baace6
```

虽然 UUID 生成方便，本地生成没有网络消耗，但是使用起来也有一些缺点，

- 不易于存储：UUID太长，16字节128位，通常以36长度的字符串表示，很多场景不适用。
- 信息不安全：基于MAC地址生成UUID的算法可能会造成MAC地址泄露，暴露使用者的位置。
- 对MySQL索引不利：如果作为数据库主键，在InnoDB引擎下，UUID的无序性可能会引起数据位置频繁变动，严重影响性能，可以查阅 Mysql 索引原理 B+树的知识。

## 数据库生成

是不是一定要基于外界的条件才能满足分布式唯一ID的需求呢，我们能不能在我们分布式数据库的基础上获取我们需要的ID？

由于分布式数据库的起始自增值一样所以才会有冲突的情况发生，那么我们将分布式系统中数据库的同一个业务表的自增ID设计成不一样的起始值，然后设置固定的步长，步长的值即为分库的数量或分表的数量。

以MySQL举例，利用给字段设置`auto_increment_increment`和`auto_increment_offset`来保证ID自增。

- auto_increment_offset：表示自增长字段从那个数开始，他的取值范围是1 .. 65535。
- auto_increment_increment：表示自增长字段每次递增的量，其默认值是1，取值范围是1 .. 65535。

假设有三台机器，则DB1中order表的起始ID值为1，DB2中order表的起始值为2，DB3中order表的起始值为3，它们自增的步长都为3，则它们的ID生成范围如下图所示：

![](http://img.dabin-coder.cn/image/20220509000004.png)

通过这种方式明显的优势就是依赖于数据库自身不需要其他资源，并且ID号单调自增，可以实现一些对ID有特殊要求的业务。

但是缺点也很明显，首先它强依赖DB，当DB异常时整个系统不可用。虽然配置主从复制可以尽可能的增加可用性，但是数据一致性在特殊情况下难以保证。主从切换时的不一致可能会导致重复发号。还有就是ID发号性能瓶颈限制在单台MySQL的读写性能。

## 使用redis实现

Redis实现分布式唯一ID主要是通过提供像 *INCR* 和 *INCRBY* 这样的自增原子命令，由于Redis自身的单线程的特点所以能保证生成的 ID 肯定是唯一有序的。

但是单机存在性能瓶颈，无法满足高并发的业务需求，所以可以采用集群的方式来实现。集群的方式又会涉及到和数据库集群同样的问题，所以也需要设置分段和步长来实现。

为了避免长期自增后数字过大可以通过与当前时间戳组合起来使用，另外为了保证并发和业务多线程的问题可以采用 Redis + Lua的方式进行编码，保证安全。

Redis 实现分布式全局唯一ID，它的性能比较高，生成的数据是有序的，对排序业务有利，但是同样它依赖于redis，需要系统引进redis组件，增加了系统的配置复杂性。

当然现在Redis的使用性很普遍，所以如果其他业务已经引进了Redis集群，则可以资源利用考虑使用Redis来实现。

## 雪花算法-Snowflake

Snowflake，雪花算法是由Twitter开源的分布式ID生成算法，以划分命名空间的方式将 64-bit位分割成多个部分，每个部分代表不同的含义。而 Java中64bit的整数是Long类型，所以在 Java 中 SnowFlake 算法生成的 ID 就是 long 来存储的。

- 第1位占用1bit，其值始终是0，可看做是符号位不使用。
- 第2位开始的41位是时间戳，41-bit位可表示2^41个数，每个数代表毫秒，那么雪花算法可用的时间年限是(1L<<41)/(1000L*3600*24*365)=69 年的时间。
- 中间的10-bit位可表示机器数，即2^10 = 1024台机器，但是一般情况下我们不会部署这么台机器。如果我们对IDC（互联网数据中心）有需求，还可以将 10-bit 分 5-bit 给 IDC，分5-bit给工作机器。这样就可以表示32个IDC，每个IDC下可以有32台机器，具体的划分可以根据自身需求定义。
- 最后12-bit位是自增序列，可表示2^12 = 4096个数。

这样的划分之后相当于在一毫秒一个数据中心的一台机器上可产生4096个有序的不重复的ID。但是我们 IDC 和机器数肯定不止一个，所以毫秒内能生成的有序ID数是翻倍的。

![](http://img.dabin-coder.cn/image/20220508235958.png)

Snowflake 的[Twitter官方原版](https://github.com/twitter/snowflake/blob/snowflake-2010/src/main/scala/com/twitter/service/snowflake/IdWorker.scala)是用Scala写的，对Scala语言有研究的同学可以去阅读下，以下是 Java 版本的写法。

```java
package com.jajian.demo.distribute;

/**
 * Twitter_Snowflake<br>
 * SnowFlake的结构如下(每部分用-分开):<br>
 * 0 - 0000000000 0000000000 0000000000 0000000000 0 - 00000 - 00000 - 000000000000 <br>
 * 1位标识，由于long基本类型在Java中是带符号的，最高位是符号位，正数是0，负数是1，所以id一般是正数，最高位是0<br>
 * 41位时间截(毫秒级)，注意，41位时间截不是存储当前时间的时间截，而是存储时间截的差值（当前时间截 - 开始时间截)
 * 得到的值），这里的的开始时间截，一般是我们的id生成器开始使用的时间，由我们程序来指定的（如下下面程序IdWorker类的startTime属性）。41位的时间截，可以使用69年，年T = (1L << 41) / (1000L * 60 * 60 * 24 * 365) = 69<br>
 * 10位的数据机器位，可以部署在1024个节点，包括5位datacenterId和5位workerId<br>
 * 12位序列，毫秒内的计数，12位的计数顺序号支持每个节点每毫秒(同一机器，同一时间截)产生4096个ID序号<br>
 * 加起来刚好64位，为一个Long型。<br>
 * SnowFlake的优点是，整体上按照时间自增排序，并且整个分布式系统内不会产生ID碰撞(由数据中心ID和机器ID作区分)，并且效率较高，经测试，SnowFlake每秒能够产生26万ID左右。
 */
public class SnowflakeDistributeId {


    // ==============================Fields===========================================
    /**
     * 开始时间截 (2015-01-01)
     */
    private final long twepoch = 1420041600000L;

    /**
     * 机器id所占的位数
     */
    private final long workerIdBits = 5L;

    /**
     * 数据标识id所占的位数
     */
    private final long datacenterIdBits = 5L;

    /**
     * 支持的最大机器id，结果是31 (这个移位算法可以很快的计算出几位二进制数所能表示的最大十进制数)
     */
    private final long maxWorkerId = -1L ^ (-1L << workerIdBits);

    /**
     * 支持的最大数据标识id，结果是31
     */
    private final long maxDatacenterId = -1L ^ (-1L << datacenterIdBits);

    /**
     * 序列在id中占的位数
     */
    private final long sequenceBits = 12L;

    /**
     * 机器ID向左移12位
     */
    private final long workerIdShift = sequenceBits;

    /**
     * 数据标识id向左移17位(12+5)
     */
    private final long datacenterIdShift = sequenceBits + workerIdBits;

    /**
     * 时间截向左移22位(5+5+12)
     */
    private final long timestampLeftShift = sequenceBits + workerIdBits + datacenterIdBits;

    /**
     * 生成序列的掩码，这里为4095 (0b111111111111=0xfff=4095)
     */
    private final long sequenceMask = -1L ^ (-1L << sequenceBits);

    /**
     * 工作机器ID(0~31)
     */
    private long workerId;

    /**
     * 数据中心ID(0~31)
     */
    private long datacenterId;

    /**
     * 毫秒内序列(0~4095)
     */
    private long sequence = 0L;

    /**
     * 上次生成ID的时间截
     */
    private long lastTimestamp = -1L;

    //==============================Constructors=====================================

    /**
     * 构造函数
     *
     * @param workerId     工作ID (0~31)
     * @param datacenterId 数据中心ID (0~31)
     */
    public SnowflakeDistributeId(long workerId, long datacenterId) {
        if (workerId > maxWorkerId || workerId < 0) {
            throw new IllegalArgumentException(String.format("worker Id can't be greater than %d or less than 0", maxWorkerId));
        }
        if (datacenterId > maxDatacenterId || datacenterId < 0) {
            throw new IllegalArgumentException(String.format("datacenter Id can't be greater than %d or less than 0", maxDatacenterId));
        }
        this.workerId = workerId;
        this.datacenterId = datacenterId;
    }

    // ==============================Methods==========================================

    /**
     * 获得下一个ID (该方法是线程安全的)
     *
     * @return SnowflakeId
     */
    public synchronized long nextId() {
        long timestamp = timeGen();

        //如果当前时间小于上一次ID生成的时间戳，说明系统时钟回退过这个时候应当抛出异常
        if (timestamp < lastTimestamp) {
            throw new RuntimeException(
                    String.format("Clock moved backwards.  Refusing to generate id for %d milliseconds", lastTimestamp - timestamp));
        }

        //如果是同一时间生成的，则进行毫秒内序列
        if (lastTimestamp == timestamp) {
            sequence = (sequence + 1) & sequenceMask;
            //毫秒内序列溢出
            if (sequence == 0) {
                //阻塞到下一个毫秒,获得新的时间戳
                timestamp = tilNextMillis(lastTimestamp);
            }
        }
        //时间戳改变，毫秒内序列重置
        else {
            sequence = 0L;
        }

        //上次生成ID的时间截
        lastTimestamp = timestamp;

        //移位并通过或运算拼到一起组成64位的ID
        return ((timestamp - twepoch) << timestampLeftShift) //
                | (datacenterId << datacenterIdShift) //
                | (workerId << workerIdShift) //
                | sequence;
    }

    /**
     * 阻塞到下一个毫秒，直到获得新的时间戳
     *
     * @param lastTimestamp 上次生成ID的时间截
     * @return 当前时间戳
     */
    protected long tilNextMillis(long lastTimestamp) {
        long timestamp = timeGen();
        while (timestamp <= lastTimestamp) {
            timestamp = timeGen();
        }
        return timestamp;
    }

    /**
     * 返回以毫秒为单位的当前时间
     *
     * @return 当前时间(毫秒)
     */
    protected long timeGen() {
        return System.currentTimeMillis();
    }
}
```

测试的代码如下

```java
public static void main(String[] args) {
    SnowflakeDistributeId idWorker = new SnowflakeDistributeId(0, 0);
    for (int i = 0; i < 1000; i++) {
        long id = idWorker.nextId();
//      System.out.println(Long.toBinaryString(id));
        System.out.println(id);
    }
}
```

雪花算法提供了一个很好的设计思想，雪花算法生成的ID是趋势递增，不依赖数据库等第三方系统，以服务的方式部署，稳定性更高，生成ID的性能也是非常高的，而且可以根据自身业务特性分配bit位，非常灵活。

但是雪花算法强依赖机器时钟，如果机器上时钟回拨，会导致发号重复或者服务会处于不可用状态。如果恰巧回退前生成过一些ID，而时间回退后，生成的ID就有可能重复。官方对于此并没有给出解决方案，而是简单的抛错处理，这样会造成在时间被追回之前的这段时间服务不可用。

很多其他类雪花算法也是在此思想上的设计然后改进规避它的缺陷，后面介绍的百度 UidGenerator 和 美团分布式ID生成系统 Leaf 中snowflake模式都是在 snowflake 的基础上演进出来的。

## 百度-UidGenerator

[百度的 UidGenerator](https://github.com/baidu/uid-generator) 是百度开源基于Java语言实现的唯一ID生成器，是在雪花算法 snowflake 的基础上做了一些改进。UidGenerator以组件形式工作在应用项目中, 支持自定义workerId位数和初始化策略，适用于docker等虚拟化环境下实例自动重启、漂移等场景。

在实现上，UidGenerator 提供了两种生成唯一ID方式，分别是 DefaultUidGenerator 和 CachedUidGenerator，官方建议如果有性能考虑的话使用 CachedUidGenerator 方式实现。

UidGenerator 依然是以划分命名空间的方式将 64-bit位分割成多个部分，只不过它的默认划分方式有别于雪花算法 snowflake。它默认是由 1-28-22-13 的格式进行划分。可根据你的业务的情况和特点，自己调整各个字段占用的位数。

- 第1位仍然占用1bit，其值始终是0。
- 第2位开始的28位是时间戳，28-bit位可表示2^28个数，**这里不再是以毫秒而是以秒为单位**，每个数代表秒则可用（1L<<28）/ (3600*24*365) ≈ 8.51 年的时间。
- 中间的 workId （数据中心+工作机器，可以其他组成方式）则由 22-bit位组成，可表示 2^22 = 4194304个工作ID。
- 最后由13-bit位构成自增序列，可表示2^13 = 8192个数。

![](http://img.dabin-coder.cn/image/20220509000004.png)

其中 workId （机器 id），最多可支持约420w次机器启动。内置实现为在启动时由数据库分配（表名为 WORKER_NODE），默认分配策略为用后即弃，后续可提供复用策略。

```sql
DROP TABLE IF EXISTS WORKER_NODE;
CREATE TABLE WORKER_NODE
(
ID BIGINT NOT NULL AUTO_INCREMENT COMMENT 'auto increment id',
HOST_NAME VARCHAR(64) NOT NULL COMMENT 'host name',
PORT VARCHAR(64) NOT NULL COMMENT 'port',
TYPE INT NOT NULL COMMENT 'node type: ACTUAL or CONTAINER',
LAUNCH_DATE DATE NOT NULL COMMENT 'launch date',
MODIFIED TIMESTAMP NOT NULL COMMENT 'modified time',
CREATED TIMESTAMP NOT NULL COMMENT 'created time',
PRIMARY KEY(ID)
)
 COMMENT='DB WorkerID Assigner for UID Generator',ENGINE = INNODB;
```

### DefaultUidGenerator 实现

DefaultUidGenerator 就是正常的根据时间戳和机器位还有序列号的生成方式，和雪花算法很相似，对于时钟回拨也只是抛异常处理。仅有一些不同，如以秒为为单位而不再是毫秒和支持Docker等虚拟化环境。

```java
protected synchronized long nextId() {
    long currentSecond = getCurrentSecond();

    // Clock moved backwards, refuse to generate uid
    if (currentSecond < lastSecond) {
        long refusedSeconds = lastSecond - currentSecond;
        throw new UidGenerateException("Clock moved backwards. Refusing for %d seconds", refusedSeconds);
    }

    // At the same second, increase sequence
    if (currentSecond == lastSecond) {
        sequence = (sequence + 1) & bitsAllocator.getMaxSequence();
        // Exceed the max sequence, we wait the next second to generate uid
        if (sequence == 0) {
            currentSecond = getNextSecond(lastSecond);
        }

    // At the different second, sequence restart from zero
    } else {
        sequence = 0L;
    }

    lastSecond = currentSecond;

    // Allocate bits for UID
    return bitsAllocator.allocate(currentSecond - epochSeconds, workerId, sequence);
}
```

如果你要使用 DefaultUidGenerator 的实现方式的话，以上划分的占用位数可通过 spring 进行参数配置。

```xml
<bean id="defaultUidGenerator" class="com.baidu.fsg.uid.impl.DefaultUidGenerator" lazy-init="false">
    <property name="workerIdAssigner" ref="disposableWorkerIdAssigner"/>

    <!-- Specified bits & epoch as your demand. No specified the default value will be used -->
    <property name="timeBits" value="29"/>
    <property name="workerBits" value="21"/>
    <property name="seqBits" value="13"/>
    <property name="epochStr" value="2016-09-20"/>
</bean>
```

### CachedUidGenerator 实现

而官方建议的性能较高的 CachedUidGenerator 生成方式，是使用 RingBuffer 缓存生成的id。数组每个元素成为一个slot。RingBuffer容量，默认为Snowflake算法中sequence最大值（2^13 = 8192）。可通过 boostPower 配置进行扩容，以提高 RingBuffer 读写吞吐量。

Tail指针、Cursor指针用于环形数组上读写slot：

- Tail指针
  表示Producer生产的最大序号(此序号从0开始，持续递增)。Tail不能超过Cursor，即生产者不能覆盖未消费的slot。当Tail已赶上curosr，此时可通过rejectedPutBufferHandler指定PutRejectPolicy
- Cursor指针
  表示Consumer消费到的最小序号(序号序列与Producer序列相同)。Cursor不能超过Tail，即不能消费未生产的slot。当Cursor已赶上tail，此时可通过rejectedTakeBufferHandler指定TakeRejectPolicy

![](http://img.dabin-coder.cn/image/20220706225625.png)

CachedUidGenerator采用了双RingBuffer，Uid-RingBuffer用于存储Uid、Flag-RingBuffer用于存储Uid状态(是否可填充、是否可消费)。

由于数组元素在内存中是连续分配的，可最大程度利用CPU cache以提升性能。但同时会带来「伪共享」FalseSharing问题，为此在Tail、Cursor指针、Flag-RingBuffer中采用了CacheLine 补齐方式。

![](http://img.dabin-coder.cn/image/20220706225530.png)

RingBuffer填充时机

- 初始化预填充
  RingBuffer初始化时，预先填充满整个RingBuffer。
- 即时填充
  Take消费时，即时检查剩余可用slot量(tail - cursor)，如小于设定阈值，则补全空闲slots。阈值可通过paddingFactor来进行配置，请参考Quick Start中CachedUidGenerator配置。
- 周期填充
  通过Schedule线程，定时补全空闲slots。可通过scheduleInterval配置，以应用定时填充功能，并指定Schedule时间间隔。

## 美团Leaf

Leaf是美团基础研发平台推出的一个分布式ID生成服务，名字取自德国哲学家、数学家莱布尼茨的著名的一句话：“There are no two identical leaves in the world”，世间不可能存在两片相同的叶子。

Leaf 也提供了两种ID生成的方式，分别是 Leaf-segment 数据库方案和 Leaf-snowflake 方案。

### Leaf-segment 数据库方案

Leaf-segment 数据库方案，是在上文描述的在使用数据库的方案上，做了如下改变：

- 原方案每次获取ID都得读写一次数据库，造成数据库压力大。改为利用proxy server批量获取，每次获取一个segment(step决定大小)号段的值。用完之后再去数据库获取新的号段，可以大大的减轻数据库的压力。
- 各个业务不同的发号需求用 `biz_tag`字段来区分，每个biz-tag的ID获取相互隔离，互不影响。如果以后有性能需求需要对数据库扩容，不需要上述描述的复杂的扩容操作，只需要对biz_tag分库分表就行。

数据库表设计如下：

```sql
CREATE TABLE `leaf_alloc` (
  `biz_tag` varchar(128)  NOT NULL DEFAULT '' COMMENT '业务key',
  `max_id` bigint(20) NOT NULL DEFAULT '1' COMMENT '当前已经分配了的最大id',
  `step` int(11) NOT NULL COMMENT '初始步长，也是动态调整的最小步长',
  `description` varchar(256)  DEFAULT NULL COMMENT '业务key的描述',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`biz_tag`)
) ENGINE=InnoDB;
```

原来获取ID每次都需要写数据库，现在只需要把step设置得足够大，比如1000。那么只有当1000个号被消耗完了之后才会去重新读写一次数据库。读写数据库的频率从1减小到了1/step，大致架构如下图所示：

![](http://img.dabin-coder.cn/image/20220509000142.png)

同时Leaf-segment 为了解决 TP999（满足千分之九百九十九的网络请求所需要的最低耗时）数据波动大，当号段使用完之后还是会hang在更新数据库的I/O上，TP999 数据会出现偶尔的尖刺的问题，提供了双buffer优化。

简单的说就是，Leaf 取号段的时机是在号段消耗完的时候进行的，也就意味着号段临界点的ID下发时间取决于下一次从DB取回号段的时间，并且在这期间进来的请求也会因为DB号段没有取回来，导致线程阻塞。如果请求DB的网络和DB的性能稳定，这种情况对系统的影响是不大的，但是假如取DB的时候网络发生抖动，或者DB发生慢查询就会导致整个系统的响应时间变慢。

为了DB取号段的过程能够做到无阻塞，不需要在DB取号段的时候阻塞请求线程，即当号段消费到某个点时就异步的把下一个号段加载到内存中，而不需要等到号段用尽的时候才去更新号段。这样做就可以很大程度上的降低系统的 TP999 指标。详细实现如下图所示：

![](http://img.dabin-coder.cn/image/20220509000258.png)

采用双buffer的方式，Leaf服务内部有两个号段缓存区segment。当前号段已下发10%时，如果下一个号段未更新，则另启一个更新线程去更新下一个号段。当前号段全部下发完后，如果下个号段准备好了则切换到下个号段为当前segment接着下发，循环往复。

- 每个biz-tag都有消费速度监控，通常推荐segment长度设置为服务高峰期发号QPS的600倍（10分钟），这样即使DB宕机，Leaf仍能持续发号10-20分钟不受影响。
- 每次请求来临时都会判断下个号段的状态，从而更新此号段，所以偶尔的网络抖动不会影响下个号段的更新。

对于这种方案依然存在一些问题，它仍然依赖 DB的稳定性，需要采用主从备份的方式提高 DB的可用性，还有 Leaf-segment方案生成的ID是趋势递增的，这样ID号是可被计算的，例如订单ID生成场景，通过订单id号相减就能大致计算出公司一天的订单量，这个是不能忍受的。

### Leaf-snowflake方案

Leaf-snowflake方案完全沿用 snowflake 方案的bit位设计，对于workerID的分配引入了Zookeeper持久顺序节点的特性自动对snowflake节点配置 wokerID。避免了服务规模较大时，动手配置成本太高的问题。

Leaf-snowflake是按照下面几个步骤启动的：

- 启动Leaf-snowflake服务，连接Zookeeper，在leaf_forever父节点下检查自己是否已经注册过（是否有该顺序子节点）。
- 如果有注册过直接取回自己的workerID（zk顺序节点生成的int类型ID号），启动服务。
- 如果没有注册过，就在该父节点下面创建一个持久顺序节点，创建成功后取回顺序号当做自己的workerID号，启动服务。

![](http://img.dabin-coder.cn/image/20220509000333.png)

为了减少对 Zookeeper的依赖性，会在本机文件系统上缓存一个workerID文件。当ZooKeeper出现问题，恰好机器出现问题需要重启时，能保证服务能够正常启动。

上文阐述过在类 snowflake算法上都存在时钟回拨的问题，Leaf-snowflake在解决时钟回拨的问题上是通过校验自身系统时间与 `leaf_forever/${self}`节点记录时间做比较然后启动报警的措施。

![](http://img.dabin-coder.cn/image/20220509000708.png)

美团官方建议是由于强依赖时钟，对时间的要求比较敏感，在机器工作时NTP同步也会造成秒级别的回退，建议可以直接关闭NTP同步。要么在时钟回拨的时候直接不提供服务直接返回ERROR_CODE，等时钟追上即可。或者做一层重试，然后上报报警系统，更或者是发现有时钟回拨之后自动摘除本身节点并报警。

在性能上官方提供的数据目前 Leaf 的性能在4C8G 的机器上QPS能压测到近5w/s，TP999 1ms。

## 总结

以上基本列出了所有常用的分布式ID生成方式，其实大致分类的话可以分为两类：

一种是类DB型的，根据设置不同起始值和步长来实现趋势递增，需要考虑服务的容错性和可用性。

另一种是类snowflake型，这种就是将64位划分为不同的段，每段代表不同的涵义，基本就是时间戳、机器ID和序列数。这种方案就是需要考虑时钟回拨的问题以及做一些 buffer的缓冲设计提高性能。

而且可通过将三者（时间戳，机器ID，序列数）划分不同的位数来改变使用寿命和并发数。

例如对于并发数要求不高、期望长期使用的应用，可增加时间戳位数，减少序列数的位数. 例如配置成{"workerBits":23,"timeBits":31,"seqBits":9}时, 可支持28个节点以整体并发量14400 UID/s的速度持续运行68年。

对于节点重启频率频繁、期望长期使用的应用, 可增加工作机器位数和时间戳位数, 减少序列数位数. 例如配置成{"workerBits":27,"timeBits":30,"seqBits":6}时, 可支持37个节点以整体并发量2400 UID/s的速度持续运行34年。



[参考链接](https://www.cnblogs.com/jajian/p/11101213.html)