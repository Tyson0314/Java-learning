# Spring Cloud Feign

基于Netflix Feign 实现，整合了Spring Cloud Ribbon 与Spring Cloud Hystrix， 它提供了一种声明式服务调用的方式。

## 负载均衡功能

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

## 服务降级功能

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



