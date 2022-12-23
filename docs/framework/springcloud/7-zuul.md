# Spring Cloud Zuul

API网关，为微服务架构中的服务提供了统一的访问入口，客户端通过API网关访问相关服务。所有客户端的访问都通过它来进行路由及过滤。它实现了请求路由、负载均衡、校验过滤、服务容错、服务聚合等功能。

添加依赖：

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-zuul</artifactId>
</dependency>
```

配置application.yml：

```yaml
server:
  port: 8801
spring:
  application:
    name: zuul-proxy
eureka:
  client:
    register-with-eureka: true
    fetch-registry: true
    service-url:
      defaultZone: http://localhost:8001/eureka/
```

启动API网关功能：

```java
@EnableZuulProxy
@EnableDiscoveryClient
@SpringBootApplication
public class ZuulProxyApplication {

    public static void main(String[] args) {
        SpringApplication.run(ZuulProxyApplication.class, args);
    }

}
```

## 路由规则

将匹配`/userService/**`的请求路由到user-service服务上去，匹配`/feignService/**`的请求路由到feign-service上去。：

```yaml
zuul:
  routes: #给服务配置路由
    user-service:
      path: /userService/**
    feign-service:
      path: /feignService/**
```

访问`http://localhost:8801/userService/user/1`可以发现请求路由到了user-service上了。

## 访问前缀

给网关路径添加前缀。

```yaml
zuul:
  prefix: /proxy #给网关路由添加前缀
```

需要访问`http://localhost:8801/proxy/user-service/user/1`才能访问到user-service中的接口。

## header过滤

默认情况下， Spring Cloud Zuul在请求路由时， 会过滤掉HTTP请求头信息中的一些敏感信息， 防止它们被传递到下游服务。默认的敏感头信息通过zuul.sensitiveHeaders参数定义，包括Cookie、Set-Cookie、Authorization三个属性。这样的话，由于Cookie等信息被过滤掉，会导致应用无法登录和鉴权。为了避免这种情况，可以将敏感头设置为空。

```yaml
zuul:
  sensitive-headers:
```

也可以通过指定路由的参数来配置，仅对指定路由开启对敏感信息的传递，影响范围小，不至于引起其他服务的信息泄露。

```yaml
＃方法一：对指定路由开启自定义敏感头
zuul.routes.<router>.customSensitiveHeaders=true
＃方法二：将指定路由的敏感头设置为空
zuul.routes.<router>.sensitiveHeaders=
```

## 重定向

[zuul重定向问题](https://blog.csdn.net/wo18237095579/article/details/83540829)

客户端通过 Zuul 请求认证服务，认证成功之后重定向到一个欢迎页，但是发现重定向的这个欢迎页的 host 变成了这个认证服务的 host，而不是 Zuul 的 host，如下图所示，直接暴露了认证服务的地址，我们可以在配置里面解决掉这个问题。

```yaml
zuul:
  -- 此处解决后端服务重定向导致用户浏览的 host 变成 后端服务的 host 问题
  add-host-header: true
```

## 查看路由信息

通过SpringBoot Actuator来查看Zuul中的路由信息。

在pom.xml中添加相关依赖：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

修改zuul-proxy/application.yml，开启查看路由信息的断点：

```yaml
management:
  endpoints:
    web:
      exposure:
        include: 'routes'
```

通过访问http://localhost:8801/actuator/routes查看简单路由信息。访问[http://localhost:8801/actuator/routes/details](http://localhost:8801/actuator/routes)查看详细路由信息。

```
{
	"/proxy/userService/**": {
		"id": "user-service",
		"fullPath": "/proxy/userService/**",
		"location": "user-service",
		"path": "/**",
		"prefix": "/proxy/userService",
		"retryable": false,
		"customSensitiveHeaders": false,
		"prefixStripped": true
	},
	"/proxy/feignService/**": {
		"id": "feign-service",
		"fullPath": "/proxy/feignService/**",
		"location": "feign-service",
		"path": "/**",
		"prefix": "/proxy/feignService",
		"retryable": false,
		"customSensitiveHeaders": false,
		"prefixStripped": true
	}
}
```

## 过滤器

路由与过滤是Zuul的两大核心功能，路由功能负责将外部请求转发到具体的服务实例上去，是实现统一访问入口的基础，过滤功能负责对请求过程进行额外的处理，是请求校验过滤及服务聚合的基础。

**过滤器类型**

Zuul中有以下几种典型的过滤器类型。

- pre：在请求被路由到目标服务前执行，比如权限校验、打印日志等功能；
- routing：在请求被路由到目标服务时执行，这是使用Apache HttpClient或Netflix Ribbon构建和发送原始HTTP请求的地方；
- post：在请求被路由到目标服务后执行，比如给目标服务的响应添加头信息，收集统计数据等功能；
- error：请求在其他阶段发生错误时执行。

**自定义过滤器**

添加PreLogFilter类继承ZuulFilter。在请求被转发到目标服务前打印请求日志。

```java
@Component
public class PreLogFilter extends ZuulFilter {
    private Logger LOGGER = LoggerFactory.getLogger(this.getClass());

    /**
     * 过滤器类型，有pre、routing、post、error四种。
     */
    @Override
    public String filterType() {
        return "pre";
    }

    /**
     * 过滤器执行顺序，数值越小优先级越高。
     */
    @Override
    public int filterOrder() {
        return 1;
    }

    /**
     * 是否进行过滤，返回true会执行过滤。
     */
    @Override
    public boolean shouldFilter() {
        return true;
    }

    /**
     * 自定义的过滤器逻辑，当shouldFilter()返回true时会执行。
     */
    @Override
    public Object run() throws ZuulException {
        RequestContext requestContext = RequestContext.getCurrentContext();
        HttpServletRequest request = requestContext.getRequest();
        String host = request.getRemoteHost();
        String method = request.getMethod();
        String uri = request.getRequestURI();
        LOGGER.info("Remote host:{},method:{},uri:{}", host, method, uri);
        return null;
    }
}
```

添加过滤器后，访问http://localhost:8801/proxy/user-service/user/1，会打印如下日志：

```java
Remote host:0:0:0:0:0:0:0:1,method:GET,uri:/proxy/userService/user/1
```

**禁用过滤器**

在application.yml配置：

```yaml
zuul:
  PreLogFilter:
    pre:
      disable: true 
```

## Ribbon和Hystrix的支持

由于Zuul自动集成了Ribbon和Hystrix，所以Zuul天生就有负载均衡和服务容错能力，我们可以通过Ribbon和Hystrix的配置来配置Zuul中的相应功能。

- 可以使用Hystrix的配置来设置路由转发时HystrixCommand的执行超时时间：

  ```yaml
  hystrix:
    command: #用于控制HystrixCommand的行为
      default:
        execution:
          isolation:
            thread:
              timeoutInMilliseconds: 1000 #配置HystrixCommand执行的超时时间，执行超过该时间会进行服务降级处理
  ```

- 可以使用Ribbon的配置来设置路由转发时请求连接及处理的超时时间：

  ```yaml
  ribbon: #全局配置
    ConnectTimeout: 1000 #服务请求连接超时时间（毫秒）
    ReadTimeout: 3000 #服务请求处理超时时间（毫秒）
  ```

## 常用配置

```yaml
zuul:
  routes: #给服务配置路由
    user-service:
      path: /userService/**
    feign-service:
      path: /feignService/**
  ignored-services: user-service,feign-service #关闭默认路由配置
  prefix: /proxy #给网关路由添加前缀
  sensitive-headers: Cookie,Set-Cookie,Authorization #配置过滤敏感的请求头信息，设置为空就不会过滤
  add-host-header: true #设置为true重定向是会添加host请求头
  retryable: true # 关闭重试机制
  PreLogFilter:
    pre:
      disable: false #控制是否启用过滤器
```



