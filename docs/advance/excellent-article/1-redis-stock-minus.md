---
sidebar: heading
title: Redis 如何实现库存扣减操作和防止被超卖？
category: 优质文章
tag:
  - Redis
head:
  - - meta
    - name: keywords
      content: Redis,库存扣减,超卖问题
  - - meta
    - name: description
      content: 优质文章汇总
---

# Redis 如何实现库存扣减操作和防止被超卖？

电商当项目经验已经非常普遍了，不管你是包装的还是真实的，起码要能讲清楚电商中常见的问题，比如库存的操作怎么防止商品被超卖

解决方案：
- 基于数据库单库存
- 基于数据库多库存
- 基于redis

基于redis实现扣减库存的具体实现
- 初始化库存回调函数（IStockCallback）
- 扣减库存服务（StockService）
- 调用

![](http://img.topjavaer.cn/img/库存扣减1.png)

------

在日常开发中有很多地方都有类似扣减库存的操作，比如电商系统中的商品库存，抽奖系统中的奖品库存等。

## **解决方案**

1. 使用mysql数据库，使用一个字段来存储库存，每次扣减库存去更新这个字段。
2. 还是使用数据库，但是将库存分层多份存到多条记录里面，扣减库存的时候路由一下，这样子增大了并发量，但是还是避免不了大量的去访问数据库来更新库存。
3. 将库存放到redis使用redis的incrby特性来扣减库存。

## **分析**

在上面的第一种和第二种方式都是基于数据来扣减库存。

### 基于数据库单库存

第一种方式在所有请求都会在这里等待锁，获取锁有去扣减库存。在并发量不高的情况下可以使用，但是一旦并发量大了就会有大量请求阻塞在这里，导致请求超时，进而整个系统雪崩；而且会频繁的去访问数据库，大量占用数据库资源，所以在并发高的情况下这种方式不适用。

### 基于数据库多库存

第二种方式其实是第一种方式的优化版本，在一定程度上提高了并发量，但是在还是会大量的对数据库做更新操作大量占用数据库资源。

**基于数据库来实现扣减库存还存在的一些问题：**

- 用数据库扣减库存的方式，扣减库存的操作必须在一条语句中执行，不能先selec在update，这样在并发下会出现超扣的情况。如：

```
update number set x=x-1 where x > 0
```

- MySQL自身对于高并发的处理性能就会出现问题，一般来说，MySQL的处理性能会随着并发thread上升而上升，但是到了一定的并发度之后会出现明显的拐点，之后一路下降，最终甚至会比单thread的性能还要差。
- 当减库存和高并发碰到一起的时候，由于操作的库存数目在同一行，就会出现争抢InnoDB行锁的问题，导致出现互相等待甚至死锁，从而大大降低MySQL的处理性能，最终导致前端页面出现超时异常。

### 基于redis

针对上述问题的问题我们就有了第三种方案，将库存放到缓存，利用redis的incrby特性来扣减库存，解决了超扣和性能问题。但是一旦缓存丢失需要考虑恢复方案。比如抽奖系统扣奖品库存的时候，初始库存=总的库存数-已经发放的奖励数，但是如果是异步发奖，需要等到MQ消息消费完了才能重启redis初始化库存，否则也存在库存不一致的问题。

## **基于redis实现扣减库存的具体实现**

- 我们使用redis的lua脚本来实现扣减库存
- 由于是分布式环境下所以还需要一个分布式锁来控制只能有一个服务去初始化库存
- 需要提供一个回调函数，在初始化库存的时候去调用这个函数获取初始化库存

### 初始化库存回调函数(IStockCallback )

```
/**
 * 获取库存回调
 */
public interface IStockCallback {

 /**
  * 获取库存
  * @return
  */
 int getStock();
}
```

### 扣减库存服务（StockService）

```
/**
 * 扣库存
 *
 */
@Service
public class StockService {
    Logger logger = LoggerFactory.getLogger(StockService.class);

    /**
     * 不限库存
     */
    public static final long UNINITIALIZED_STOCK = -3L;

    /**
     * Redis 客户端
     */
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    /**
     * 执行扣库存的脚本
     */
    public static final String STOCK_LUA;

    static {
        /**
         *
         * @desc 扣减库存Lua脚本
         * 库存（stock）-1：表示不限库存
         * 库存（stock）0：表示没有库存
         * 库存（stock）大于0：表示剩余库存
         *
         * @params 库存key
         * @return
         *   -3:库存未初始化
         *   -2:库存不足
         *   -1:不限库存
         *   大于等于0:剩余库存（扣减之后剩余的库存）
         *      redis缓存的库存(value)是-1表示不限库存，直接返回1
         */
        StringBuilder sb = new StringBuilder();
        sb.append("if (redis.call('exists', KEYS[1]) == 1) then");
        sb.append("    local stock = tonumber(redis.call('get', KEYS[1]));");
        sb.append("    local num = tonumber(ARGV[1]);");
        sb.append("    if (stock == -1) then");
        sb.append("        return -1;");
        sb.append("    end;");
        sb.append("    if (stock >= num) then");
        sb.append("        return redis.call('incrby', KEYS[1], 0 - num);");
        sb.append("    end;");
        sb.append("    return -2;");
        sb.append("end;");
        sb.append("return -3;");
        STOCK_LUA = sb.toString();
    }

    /**
     * @param key           库存key
     * @param expire        库存有效时间,单位秒
     * @param num           扣减数量
     * @param stockCallback 初始化库存回调函数
     * @return -2:库存不足; -1:不限库存; 大于等于0:扣减库存之后的剩余库存
     */
    public long stock(String key, long expire, int num, IStockCallback stockCallback) {
        long stock = stock(key, num);
        // 初始化库存
        if (stock == UNINITIALIZED_STOCK) {
            RedisLock redisLock = new RedisLock(redisTemplate, key);
            try {
                // 获取锁
                if (redisLock.tryLock()) {
                    // 双重验证，避免并发时重复回源到数据库
                    stock = stock(key, num);
                    if (stock == UNINITIALIZED_STOCK) {
                        // 获取初始化库存
                        final int initStock = stockCallback.getStock();
                        // 将库存设置到redis
                        redisTemplate.opsForValue().set(key, initStock, expire, TimeUnit.SECONDS);
                        // 调一次扣库存的操作
                        stock = stock(key, num);
                    }
                }
            } catch (Exception e) {
                logger.error(e.getMessage(), e);
            } finally {
                redisLock.unlock();
            }

        }
        return stock;
    }

    /**
     * 加库存(还原库存)
     *
     * @param key    库存key
     * @param num    库存数量
     * @return
     */
    public long addStock(String key, int num) {

        return addStock(key, null, num);
    }

    /**
     * 加库存
     *
     * @param key    库存key
     * @param expire 过期时间（秒）
     * @param num    库存数量
     * @return
     */
    public long addStock(String key, Long expire, int num) {
        boolean hasKey = redisTemplate.hasKey(key);
        // 判断key是否存在，存在就直接更新
        if (hasKey) {
            return redisTemplate.opsForValue().increment(key, num);
        }

        Assert.notNull(expire,"初始化库存失败，库存过期时间不能为null");
        RedisLock redisLock = new RedisLock(redisTemplate, key);
        try {
            if (redisLock.tryLock()) {
                // 获取到锁后再次判断一下是否有key
                hasKey = redisTemplate.hasKey(key);
                if (!hasKey) {
                    // 初始化库存
                    redisTemplate.opsForValue().set(key, num, expire, TimeUnit.SECONDS);
                }
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        } finally {
            redisLock.unlock();
        }

        return num;
    }

    /**
     * 获取库存
     *
     * @param key 库存key
     * @return -1:不限库存; 大于等于0:剩余库存
     */
    public int getStock(String key) {
        Integer stock = (Integer) redisTemplate.opsForValue().get(key);
        return stock == null ? -1 : stock;
    }

    /**
     * 扣库存
     *
     * @param key 库存key
     * @param num 扣减库存数量
     * @return 扣减之后剩余的库存【-3:库存未初始化; -2:库存不足; -1:不限库存; 大于等于0:扣减库存之后的剩余库存】
     */
    private Long stock(String key, int num) {
        // 脚本里的KEYS参数
        List<String> keys = new ArrayList<>();
        keys.add(key);
        // 脚本里的ARGV参数
        List<String> args = new ArrayList<>();
        args.add(Integer.toString(num));

        long result = redisTemplate.execute(new RedisCallback<Long>() {
            @Override
            public Long doInRedis(RedisConnection connection) throws DataAccessException {
                Object nativeConnection = connection.getNativeConnection();
                // 集群模式和单机模式虽然执行脚本的方法一样，但是没有共同的接口，所以只能分开执行
                // 集群模式
                if (nativeConnection instanceof JedisCluster) {
                    return (Long) ((JedisCluster) nativeConnection).eval(STOCK_LUA, keys, args);
                }

                // 单机模式
                else if (nativeConnection instanceof Jedis) {
                    return (Long) ((Jedis) nativeConnection).eval(STOCK_LUA, keys, args);
                }
                return UNINITIALIZED_STOCK;
            }
        });
        return result;
    }

}
```

### 调用

```
@RestController
public class StockController {

    @Autowired
    private StockService stockService;

    @RequestMapping(value = "stock", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public Object stock() {
        // 商品ID
        long commodityId = 1;
        // 库存ID
        String redisKey = "redis_key:stock:" + commodityId;
        long stock = stockService.stock(redisKey, 60 * 60, 2, () -> initStock(commodityId));
        return stock >= 0;
    }

    /**
     * 获取初始的库存
     *
     * @return
     */
    private int initStock(long commodityId) {
        // TODO 这里做一些初始化库存的操作
        return 1000;
    }

    @RequestMapping(value = "getStock", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public Object getStock() {
        // 商品ID
        long commodityId = 1;
        // 库存ID
        String redisKey = "redis_key:stock:" + commodityId;

        return stockService.getStock(redisKey);
    }

    @RequestMapping(value = "addStock", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public Object addStock() {
        // 商品ID
        long commodityId = 2;
        // 库存ID
        String redisKey = "redis_key:stock:" + commodityId;

        return stockService.addStock(redisKey, 2);
    }
}
```

