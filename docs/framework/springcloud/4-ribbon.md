# Spring Cloud Ribbon

Spring Cloud Ribbon 是基于HTTP和TCP的客户端负载均衡工具，基于Netflix Ribbon实现。Spring Cloud Ribbon 会**将REST请求转换为客户端负载均衡的服务调用**。

在客户端节点会维护可访问的服务器清单，服务器清单来自服务注册中心，通过心跳维持服务器清单的健康性。

开启客户端负载均衡调用：

1. 服务提供者启动多个服务实例注册到服务注册中心；
2. 服务消费者直接通过调用被@LoadBalanced 注解修饰过的RestTemplate 来实现面向服务的接口调用。

## RestTemplate

RestTemplate是一个HTTP客户端，使用它我们可以方便的调用HTTP接口，支持GET、POST、PUT、DELETE等方法。

## 代码实例

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



