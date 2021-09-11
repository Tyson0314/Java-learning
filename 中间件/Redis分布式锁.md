<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Redis分布式锁](#redis%E5%88%86%E5%B8%83%E5%BC%8F%E9%94%81)
  - [Jedis实现分布式锁](#jedis%E5%AE%9E%E7%8E%B0%E5%88%86%E5%B8%83%E5%BC%8F%E9%94%81)
    - [加锁](#%E5%8A%A0%E9%94%81)
    - [解锁](#%E8%A7%A3%E9%94%81)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

在单机环境下，当存在多个线程可以同时改变某个变量（可变共享变量）时，就会出现线程安全问题。这个问题可以通过 JAVA 提供的 volatile、ReentrantLock、synchronized 以及 concurrent 并发包下一些线程安全的类等来避免。

而在多机部署环境，需要在多进程下保证线程的安全性，Java提供的这些API仅能保证在单个JVM进程内对多线程访问共享资源的线程安全，已经不满足需求了。这时候就需要使用分布式锁来保证线程安全。通过分布式锁，可以保证在分布式部署的应用集群中，同一个方法在同一时间只能被一台机器上的一个线程执行。

分布式锁需要满足四个条件：

1. 互斥性。在任意时刻，只有一个客户端能持有锁。
2. 不会死锁。即使有客户端在持有锁的期间崩溃而没有主动解锁，也要保证后续其他客户端能加锁。
3. 加锁和解锁必须是同一个客户端。客户端a不能将客户端b的锁解开，即不能误解锁。
4. 容错性。只要大多数Redis节点正常运行，客户端就能够获取和释放锁。

# Redis分布式锁

常见的实现分布式锁的方式有：数据库、Redis、Zookeeper。下面主要介绍使用Redis实现分布式锁。

Redis 2.6.12 之前的版本中采用 setnx + expire 方式实现分布式锁，在 Redis 2.6.12 版本后 setnx 增加了过期时间参数：

```java
SET lockKey value NX PX expire-time
```

所以在Redis 2.6.12 版本后，只需要使用setnx就可以实现分布式锁了。

加锁逻辑：

1. setnx争抢key的锁，如果已有key存在，则不作操作，过段时间继续重试，保证只有一个客户端能持有锁。
2. value设置为 requestId（可以使用机器ip拼接当前线程名称），表示这把锁是哪个请求加的，在解锁的时候需要判断当前请求是否持有锁，防止误解锁。比如客户端A加锁，在执行解锁之前，锁过期了，此时客户端B尝试加锁成功，然后客户端A再执行del()方法，则将客户端B的锁给解除了。
3. 再用expire给锁加一个过期时间，防止异常导致锁没有释放。

解锁逻辑：

首先获取锁对应的value值，检查是否与requestId相等，如果相等则删除锁。使用lua脚本实现原子操作，保证线程安全。

下面我们通过Jedis（基于java语言的redis客户端）来演示分布式锁的实现。

## Jedis实现分布式锁

引入Jedis jar包，在pom.xml文件增加代码：

```xml
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
    <version>2.9.0</version>
</dependency>
```

### 加锁

调用jedis的set()实现加锁，加锁代码如下：

```java
/**
 * @description:
 * @author: 程序员大彬
 * @time: 2021-08-01 17:13
 */
public class RedisTest {

    private static final String LOCK_SUCCESS = "OK";
    private static final String SET_IF_NOT_EXIST = "NX";
    private static final String SET_EXPIRE_TIME = "PX";

    @Autowired
    private JedisPool jedisPool;
    
    public boolean tryGetDistributedLock(String lockKey, String requestId, int expireTime) {
        Jedis jedis = jedisPool.getResource();
        String result = jedis.set(lockKey, requestId, SET_IF_NOT_EXIST, SET_EXPIRE_TIME, expireTime);

        if (LOCK_SUCCESS.equals(result)) {
            return true;
        }
        return false;
    }
}
```

各参数说明：

- lockKey：使用key来当锁，需要保证key是唯一的。可以使用系统号拼接自定义的key。
- requestId：表示这把锁是哪个请求加的，可以使用机器ip拼接当前线程名称。在解锁的时候需要判断当前请求是否持有锁，防止误解锁。比如客户端A加锁，在执行解锁之前，锁过期了，此时客户端B尝试加锁成功，然后客户端A再执行del()方法，则将客户端B的锁给解除了。
- NX：意思是SET IF NOT EXIST，保证如果已有key存在，则不作操作，过段时间继续重试。NX参数保证只有一个客户端能持有锁。
- PX：给key加一个过期的设置，具体时间由expireTime决定。
- expireTime：设置key的过期时间，防止异常导致锁没有释放。

### 解锁

首先需要获取锁对应的value值，检查是否与requestId相等，如果相等则删除锁。这里使用lua脚本实现原子操作，保证线程安全。

使用eval命令执行Lua脚本的时候，不会有其他脚本或 Redis 命令被执行，实现组合命令的原子操作。lua脚本如下：

```
//KEYS[1]是lockKey，ARGV[1]是requestId
String script = "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end";
Object result = jedis.eval(script, Collections.singletonList(lockKey), Collections.singletonList(requestId));
```

Jedis的eval()方法源码如下：

```java
public Object eval(String script, List<String> keys, List<String> args) {
    return this.eval(script, keys.size(), getParams(keys, args));
}
```

lua脚本的意思是：调用get获取锁（KEYS[1]）对应的value值，检查是否与requestId（ARGV[1]）相等，如果相等则调用del删除锁。否则返回0。

完整的解锁代码如下：

```java
/**
 * @description:
 * @author: 程序员大彬
 * @time: 2021-08-01 17:13
 */
public class RedisTest {
    private static final Long RELEASE_SUCCESS = 1L;

    @Autowired
    private JedisPool jedisPool;

    public boolean releaseDistributedLock(String lockKey, String requestId) {
        Jedis jedis = jedisPool.getResource();
        ////KEYS[1]是lockKey，ARGV[1]是requestId
        String script = "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end";
        Object result = jedis.eval(script, Collections.singletonList(lockKey), Collections.singletonList(requestId));

        if (RELEASE_SUCCESS.equals(result)) {
            return true;
        }
        return false;
    }
}
```



以上是使用Redis实现分布式锁的全部内容，希望对你有帮助。

> 本文已经收录到github/gitee仓库，欢迎大家围观、star
>
> github仓库： https://github.com/Tyson0314/Java-learning
>
> 如果github访问不了，可以访问gitee仓库。
>
> gitee仓库：https://gitee.com/tysondai/Java-learning

