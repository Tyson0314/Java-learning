# Spring Cloud Gateway

为 SpringBoot 应用提供了API网关支持，具有强大的智能路由与过滤器功能。

创建api-gateway模块，pom.xml添加依赖：

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>
```

## 配置路由

Gateway 提供了两种不同的方式用于配置路由，一种是通过yml文件来配置，另一种是通过Java Bean来配置。

1. 使用yml配置。修改application.yml。

   ```yaml
   server:
     port: 9201
   service-url:
     user-service: http://localhost:8201
   spring:
     cloud:
       gateway:
         routes:
           - id: path_route #路由的ID
             uri: ${service-url.user-service}/user/{id} #匹配后路由地址
             predicates: # 断言，路径相匹配的进行路由
               - Path=/user/{id}
   ```

   启动eureka-server，user-service和api-gateway服务，测试http://localhost:9201/user/1

2. 使用Java bean配置。

   添加相关配置类，并配置一个RouteLocator对象：

   ```java
   @Configuration
   public class GatewayConfig {
   
       @Bean
       public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
           return builder.routes()
                   .route("path_route2", r -> r.path("/user/getByUsername")
                           .uri("http://localhost:8201/user/getByUsername"))
                   .build();
       }
   }
   ```

   使用http://localhost:9201/user/getByUsername?username=macro测试。

## Route Predicate

Spring Cloud Gateway包括许多内置的Route Predicate工厂。 所有这些Predicate都与HTTP请求的不同属性匹配。 多个Route Predicate工厂可以进行组合。

**After** Route Predicate

在指定时间之后的请求会匹配该路由。

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: after_route
          uri: ${service-url.user-service}
          predicates:
            - After=2019-09-24T16:30:00+08:00[Asia/Shanghai]
```

**Cookie Route Predicate**

带有指定Cookie的请求会匹配该路由。

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: cookie_route
          uri: ${service-url.user-service}
          predicates:
            - Cookie=username,tyson
```

使用curl工具发送带有cookie为`username=macro`的请求可以匹配该路由。

```
curl http://localhost:9201/user/1 --cookie "username=tyson"
```

**Header Route Predicate**

带有指定请求头的请求会匹配该路由。

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: header_route
        uri: ${service-url.user-service}
        predicates:
        - Header=X-Request-Id, \d+
```

使用curl工具发送带有请求头为`X-Request-Id:123`的请求可以匹配该路由。

```
curl http://localhost:9201/user/1 -H "X-Request-Id:123" 
```

**Host Route Predicate**

带有指定Host的请求会匹配该路由。

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: host_route
          uri: ${service-url.user-service}
          predicates:
            - Host=**.macrozheng.com
```

使用curl工具发送带有请求头为`Host:www.macrozheng.com`的请求可以匹配该路由。

```
curl http://localhost:9201/user/1 -H "Host:www.macrozheng.com" 
```

## Route Filter

路由过滤器可用于修改进入的HTTP请求和返回的HTTP响应，路由过滤器只能指定路由进行使用。Spring Cloud Gateway 内置了多种路由过滤器，他们都由GatewayFilter的工厂类来产生。

**AddRequestParameter GatewayFilter**

给请求添加参数的过滤器。

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: add_request_parameter_route
          uri: http://localhost:8201
          filters:
            - AddRequestParameter=username, macro
          predicates:
            - Method=GET
```

以上配置会对GET请求添加`username=macro`的请求参数，通过curl工具使用以下命令进行测试。

```
curl http://localhost:9201/user/getByUsername
```

相当于发起该请求：

```
curl http://localhost:8201/user/getByUsername?username=macro
```

**StripPrefix GatewayFilter**

对指定数量的路径前缀进行去除的过滤器。

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: strip_prefix_route
        uri: http://localhost:8201
        predicates:
        - Path=/user-service/**
        filters:
        - StripPrefix=2
```

以上配置会把以`/user-service/`开头的请求的路径去除两位，通过curl工具使用以下命令进行测试。

```
curl http://localhost:9201/user-service/a/user/1
```

相当于发起请求：curl http://localhost:8201/user/1

**PrefixPate GatewayFilter**

与StripPrefix过滤器恰好相反，会对原有路径进行增加操作的过滤器。

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: prefix_path_route
        uri: http://localhost:8201
        predicates:
        - Method=GET
        filters:
        - PrefixPath=/user
```

以上配置会对所有GET请求添加`/user`路径前缀。

**Hystrix GatewayFilter**

将断路器功能添加到网关路由中，使服务免受级联故障的影响，并提供服务降级处理。

要开启断路器功能，我们需要在pom.xml中添加Hystrix的相关依赖：

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-hystrix</artifactId>
</dependency>
```

然后添加相关服务降级的处理类：

```java
@RestController
public class FallbackController {

    @GetMapping("/fallback")
    public Object fallback() {
        Map<String,Object> result = new HashMap<>();
        result.put("data",null);
        result.put("message","Get request fallback!");
        result.put("code",500);
        return result;
    }
}
```

**RequestRateLimiter GatewayFilter**

用于限流，使用RateLimiter实现来确定是否允许当前请求继续进行，如果请求太大默认会返回HTTP 429-太多请求状态。

在pom.xml中添加相关依赖：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis-reactive</artifactId>
</dependency>
```

添加限流策略的配置类，这里有两种策略一种是根据请求参数中的username进行限流，另一种是根据访问IP进行限流。

```java
@Configuration
public class RedisRateLimiterConfig {
    @Bean
    KeyResolver userKeyResolver() {
        return exchange -> Mono.just(exchange.getRequest().getQueryParams().getFirst("username"));
    }

    @Bean
    public KeyResolver ipKeyResolver() {
        return exchange -> Mono.just(exchange.getRequest().getRemoteAddress().getHostName());
    }
}
```

我们使用Redis来进行限流，所以需要添加Redis和RequestRateLimiter的配置，这里对所有的GET请求都进行了按IP来限流的操作。

```yaml
server:
  port: 9201
spring:
  redis:
    host: localhost
    password: 123456
    port: 6379
  cloud:
    gateway:
      routes:
        - id: requestratelimiter_route
          uri: http://localhost:8201
          filters:
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 1 #每秒允许处理的请求数量
                redis-rate-limiter.burstCapacity: 2 #每秒最大处理的请求数量
                key-resolver: "#{@ipKeyResolver}" #限流策略，对应策略的Bean
          predicates:
            - Method=GET
logging:
  level:
    org.springframework.cloud.gateway: debug
```

多次请求该地址：http://localhost:9201/user/1 ，会返回状态码为429的错误。

**Retry GatewayFilter**

对路由请求进行重试的过滤器，可以根据路由请求返回的HTTP状态码来确定是否进行重试。

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: retry_route
        uri: http://localhost:8201
        predicates:
        - Method=GET
        filters:
        - name: Retry
          args:
            retries: 1 #需要进行重试的次数
            statuses: BAD_GATEWAY #返回哪个状态码需要进行重试，返回状态码为5XX进行重试
            backoff:
              firstBackoff: 10ms
              maxBackoff: 50ms
              factor: 2
              basedOnPreviousValue: false
```

## 结合注册中心使用

**使用动态路由**

以服务名为路径创建动态路由。

在pom.xml中添加依赖：

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

添加application-eureka.yml配置文件：

```yaml
server:
  port: 9201
spring:
  application:
    name: api-gateway
  cloud:
    gateway:
      discovery:
        locator:
          enabled: true #开启从注册中心动态创建路由的功能
          lower-case-service-id: true #使用小写服务名，默认是大写
eureka:
  client:
    service-url:
      defaultZone: http://localhost:8001/eureka/
logging:
  level:
    org.springframework.cloud.gateway: debug
```

使用application-eureka.yml配置文件启动api-gateway服务，访问http://localhost:9201/user-service/user/1 ，可以路由到user-service的http://localhost:8201/user/1 处。

**使用过滤器**

在结合注册中心使用过滤器的时候，需要注意的是uri的协议为`lb`，这样才能启用Gateway的负载均衡功能。

修改application-eureka.yml文件，使用了PrefixPath过滤器，会为所有GET请求路径添加`/user`路径并路由。

```yaml
server:
  port: 9201
spring:
  application:
    name: api-gateway
  cloud:
    gateway:
      routes:
        - id: prefixpath_route
          uri: lb://user-service #此处需要使用lb协议
          predicates:
            - Method=GET
          filters:
            - PrefixPath=/user
      discovery:
        locator:
          enabled: true
eureka:
  client:
    service-url: 
      defaultZone: http://localhost:8001/eureka/
logging:
  level:
    org.springframework.cloud.gateway: debug
```

使用application-eureka.yml配置文件启动api-gateway服务，访问http://localhost:9201/1 ，可以路由到user-service的http://localhost:8201/user/1 处。



