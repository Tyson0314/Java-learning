## 基础知识

微服务是将一个原本独立的系统拆分成多个小型服务，这些小型服务都在各自独立的进程中运行，服务之间通过基于HTTP的RESTful API进行通信协作。

单体系统的缺点：

1. 修改一个小功能，就需要将整个系统重新部署上线，影响其他功能的运行；

微服务的缺点：

springcloud是一个基于Spring Boot实现的微服务架构开发工具。spring cloud包含多个子项目：

- Spring Cloud Config：配置管理工具，支持使用Git存储配置内容， 可以使用它实现应用配置的外部化存储， 并支持客户端配置信息刷新、加密／解密配置内容等。
- Spring Cloud Netflix：核心 组件，对多个Netflix OSS开源套件进行整合。
  - Eureka: 服务治理组件， 包含服务注册中心、服务注册与发现机制的实现。
  - Hystrix: 容错管理组件，实现断路器模式， 帮助服务依赖中出现的延迟和为故障提供强大的容错能力。
  - Ribbon: 客户端负载均衡的服务调用组件。
  - Feign: 基于Ribbon 和Hystrix 的声明式服务调用组件。
  - Zuul: 网关组件， 提供智能路由、访问过滤等功能。
  - Archaius: 外部化配置组件。
- Spring Cloud Bus: 事件、消息总线， 用于传播集群中的状态变化或事件， 以触发后续的处理， 比如用来动态刷新配置等。
- Spring Cloud Cluster: 针对ZooKeeper、Redis、Hazelcast、Consul 的选举算法和通用状态模式的实现。
- Spring Cloud Consul: 服务发现与配置管理工具。
- Spring Cloud ZooKeeper: 基于ZooKeeper 的服务发现与配置管理组件。

spring-boot-starter-actuator：该模块能够自动为Spring Boot 构建的应用提供一系列用千监控的端点。



## Spring Cloud Eureka

Spring Cloud Eureka实现微服务架构中的服务治理功能，使用 Netflix Eureka 实现服务注册与发现，包含客户端组件和服务端组件。服务治理是微服务架构中最为核心和基础的模块。

Eureka 服务端就是服务注册中心。Eureka 客户端用于处理服务的注册和发现。客户端服务通过注解和参数配置的方式，嵌入在客户端应用程序的代码中， 在应用程序运行时，Eureka客户端向注册中心注册自身提供的服务并周期性地发送心跳来更新它的服务租约。同时，它也能从服务端查询当前注册的服务信息并把它们缓存到本地并周期性地刷新服务状态。

### 服务注册与发现

服务注册：在微服务架构中往往会有一个注册中心，每个微服务都会向注册中心去注册自己的地址及端口信息，注册中心维护着服务名称与服务实例的对应关系。每个微服务都会定时从注册中心获取服务列表，同时汇报自己的运行情况，这样当有的服务需要调用其他服务时，就可以从自己获取到的服务列表中获取实例地址进行调用。

服务发现：服务间的调用不是通过直接调用具体的实例地址，而是通过服务名发起调用。调用方需要向服务注册中心咨询服务，获取服务的实例清单，从而访问具体的服务实例。

### 代码实例

添加依赖：

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
</dependency>
```

启动服务注册中心功能：

```java
@EnableEurekaServer
@SpringBootApplication
public class EurekaServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaServerApplication.class, args);
    }
}
```

在配置文件application.yml中添加Eureka注册中心的配置：

```yaml
server:
  port: 8002
spring:
  application:
    name: eureka-server
eureka:
  instance:
    hostname: replica1
  client:
    serviceUrl:
      defaultZone: http://replica2:8003/eureka/ #注册到另一个Eureka注册中心
    fetch-registry: true
    register-with-eureka: true
```

运行EurekaServerApplication，访问地址http://localhost:8001/可以看到Eureka注册中心的界面。

### 高可用注册中心

注册中心互相注册，形成一组互相注册的服务注册中心， 以实现服务清单的互相同步， 达到高可用的效果。

创建application-replica1.yml和 application-replica2.yml：

```yaml
# application-replica1.yml
server:
  port: 8002
spring:
  application:
    name: eureka-server
eureka:
  instance:
    hostname: replica1
  client:
    serviceUrl:
      defaultZone: http://replica2:8003/eureka/ #注册到另一个Eureka注册中心
    fetch-registry: true
   
    register-with-eureka: true
    
# application-replica2.yml
server:
  port: 8002
spring:
  application:
    name: eureka-server
eureka:
  instance:
    hostname: replica1
  client:
    serviceUrl:
      defaultZone: http://replica2:8003/eureka/ #注册到另一个Eureka注册中心
    fetch-registry: true
   
    register-with-eureka: true
```

修改hosts文件，让 serviceUrl 能在本地正确访问到：

```java
127.0.0.1 replica1
127.0.0.1 replica2
```

通过spring.profiles.active属性来分别启动（或者设置idea -> edit configuration -> active profiles 属性）：

```java
java -jar eureka-server-1.0.0.jar --spring.profiles.active=replica1
java -jar eureka-server-1.0.0.jar --spring.profiles.active=replica2
```

在设置了多节点的服务注册中心之后， 服务提供方还需要做一些简单的配置才能将服务注册到Eureka Server 集群中：

```properties
eureka.client.serviceUrl.defaultZone=http://localhost:8002/eureka/, http://localhost:8003/eureka/
```



## Spring Cloud Ribbon

Spring Cloud Ribbon 是基于HTTP和TCP的客户端负载均衡工具，基于Netflix Ribbon实现。Spring Cloud Ribbon 会**将REST请求转换为客户端负载均衡的服务调用**。

在客户端节点会维护可访问的服务器清单，服务器清单来自服务注册中心，通过心跳维持服务器清单的健康性。

开启客户端负载均衡调用：

1. 服务提供者启动多个服务实例注册到服务注册中心；
2. 服务消费者直接通过调用被@LoadBalanced 注解修饰过的RestTemplate 来实现面向服务的接口调用。

### RestTemplate

RestTemplate是一个HTTP客户端，使用它我们可以方便的调用HTTP接口，支持GET、POST、PUT、DELETE等方法。

### 代码实例

创建hello-service模块，用于给 Ribbon 提供服务调用。

```java
@RestController
public class HelloController {

    @Autowired
    private Registration registration;  // 服务注册

    @Autowired
    private DiscoveryClient client;

    private static final Logger LOGGER = LoggerFactory.getLogger(HelloController.class);

    @RequestMapping(value = "/hello", method = RequestMethod.GET)
    public String hello() throws Exception {
        ServiceInstance instance = client.getInstances(registration.getServiceId()).get(0);
        LOGGER.info("/hello, host:" + instance.getHost() + ", service_id:" + instance.getServiceId());
        return "Hello World";
    }
}
```

添加相关的依赖：

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

配置端口和注册中心地址：

```properties
spring.application.name=hello-service
eureka.client.serviceUrl.defaultZone=http://localhost:8002/eureka/, http://localhost:8003/eureka/
server.port=8081
```

创建ribbon-consumer模块，使用负载均衡调用hello-service服务。

添加相关依赖：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-ribbon</artifactId>
</dependency>
```

配置了端口、注册中心地址。

```properties
spring.application.name=ribbon-consumer
server.port=9000
eureka.client.serviceUrl.defaultZone=http://localhost:8002/eureka/, http://localhost:8002/eureka/
hystrix.command.default.execution.isolation.thread.timeoutInMilliseconds=2000
service-url.hello-service = http://HELLO-SERVICE
```

使用@LoadBalanced注解赋予RestTemplate负载均衡的能力。

```java
@Configuration
public class RibbonConfig {
    @Bean
    @LoadBalanced
    public RestTemplate restTemplate(){
        return new RestTemplate();
    }
}
```

创建ConsumerController，注入RestTemplate，使用其调用hello-service中提供的相关接口：

```java
@RestController
public class ConsumerController {

    @Autowired
    RestTemplate restTemplate;

    @Value("${service-url.hello-service}")
    private String helloService;

    @RequestMapping(value="/ribbon-consumer", method = RequestMethod.GET)
    public String helloConsumer() {
        return restTemplate.getForEntity(helloService + "/hello", String.class).getBody();
    }
}
```

启动两个 hello-service 实例（8001/8002），调用接口 http://localhost:9000/ribbon-consumer 进行测试。

hello-service:8001和hello-service:8002交替输出：

```java
com.tyson.helloservice.HelloController   : /hello, host:DESKTOP-8F30VS1, service_id:HELLO-SERVICE
```



## Spring Cloud Hystrix

在微服务架构中，服务与服务之间通过远程调用的方式进行通信，一旦某个被调用的服务发生了故障，其依赖服务也会发生故障，此时就会发生故障的蔓延，最终导致系统瘫痪。Hystrix实现了断路器模式，当某个服务发生故障时，通过断路器的监控，给调用方返回一个错误响应，而不是长时间的等待，这样就不会使得调用方由于长时间得不到响应而占用线程，从而防止故障的蔓延。Hystrix具备服务降级、服务熔断、线程隔离、请求缓存、请求合并及服务监控等强大功能。

### 代码实例

创建 hystrix-service 模块。添加相关依赖：

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-hystrix</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

配置 application.yml：

```yaml
server:
  port: 8401
spring:
  application:
    name: hystrix-service
eureka:
  client:
    register-with-eureka: true
    fetch-registry: true
    service-url:
      defaultZone: http://localhost:8001/eureka/
service-url:
  user-service: http://user-service
```

在启动类上添加@EnableCircuitBreaker来开启Hystrix的断路器功能：

```java
@EnableCircuitBreaker
@EnableDiscoveryClient
@SpringBootApplication
public class HystrixServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(HystrixServiceApplication.class, args);
    }
}
```

创建UserHystrixController接口用于调用user-service服务：

```java
@GetMapping("/testFallback/{id}")
public CommonResult testFallback(@PathVariable Long id) {
    return userService.getUser(id);
}
```

在UserService中添加调用方法与服务降级方法，方法上需要添加@HystrixCommand注解：

```java
@HystrixCommand(fallbackMethod = "getDefaultUser")
public CommonResult getUser(Long id) {
    return restTemplate.getForObject(userServiceUrl + "/user/{1}", CommonResult.class, id);
}

public CommonResult getDefaultUser(@PathVariable Long id) {
    User defaultUser = new User(-1L, "defaultUser", "123456");
    return new CommonResult<>(defaultUser);
}
```

关闭user-service服务测试 testFallback 接口，发现已经发生了服务降级。



## Spring Cloud Feign

基于Netflix Feign 实现，整合了Spring Cloud Ribbon 与Spring Cloud Hystrix， 它提供了一种声明式服务调用的方式。

### 负载均衡功能

添加依赖：

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

配置application.yml：

```yaml
server:
  port: 8701
spring:
  application:
    name: feign-service
eureka:
  client:
    register-with-eureka: true
    fetch-registry: true
    service-url:
      defaultZone: http://localhost:8002/eureka/
```

在启动类上添加@EnableFeignClients注解来启用Feign的客户端功能：

```java
@EnableFeignClients
@EnableDiscoveryClient
@SpringBootApplication
public class FeignServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(FeignServiceApplication.class, args);
    }

}
```

添加HelloService接口（与hello-service HelloController定义的接口一致），绑定hello-service服务接口：

```java
@FeignClient(value="hello-service")
public interface HelloService {

    @RequestMapping(value = "/hello", method = RequestMethod.GET)
    String getHello();
}
```

添加HelloFeignController，调用UserService完成服务调用：

```java
@RestController
@RequestMapping("feign")
public class HelloFeignController {
    @Autowired
    private HelloService helloService;

    @GetMapping("/hello")
    public String getHello() {
        return helloService.getHello();
    }
}
```

启动eureka-service，多个hello-service，feign-service服务，多次调用http://localhost:8701/feign/hello/进行测试。

### 服务降级功能

开启Hystrix功能：

```yaml
feign:
  hystrix:
    enabled: true #在Feign中开启Hystrix
```

添加服务降级实现类：

```java
@Component
public class HelloFallbackService implements HelloService {
    @Override
    public String getHello() {
        return "hello fallback";
    }
}
```

修改HelloService接口，设置服务降级处理类：

```java
@FeignClient(value="hello-service", fallback = HelloFallbackService.class)
public interface HelloService {

    @GetMapping(value = "/hello")
    String getHello();
}
```

关闭hello-service服务，重新启动 feign-service，访问 http://localhost:8701/feign/hello 进行测试。



## Spring Cloud Zuul

API网关，为微服务架构中的服务提供了统一的访问入口，客户端通过API网关访问相关服务。所有客户端的访问都通过它来进行路由及过滤。它实现了请求路由、负载均衡、校验过滤、服务容错、服务聚合等功能。