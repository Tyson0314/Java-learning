# Spring Cloud Eureka

Spring Cloud Eureka实现微服务架构中的服务治理功能，使用 Netflix Eureka 实现服务注册与发现，包含客户端组件和服务端组件。服务治理是微服务架构中最为核心和基础的模块。

Eureka 服务端就是服务注册中心。Eureka 客户端用于处理服务的注册和发现。客户端服务通过注解和参数配置的方式，嵌入在客户端应用程序的代码中， 在应用程序运行时，Eureka客户端向注册中心注册自身提供的服务并周期性地发送心跳来更新它的服务租约。同时，它也能从服务端查询当前注册的服务信息并把它们缓存到本地并周期性地刷新服务状态。

## 服务注册与发现

服务注册：在微服务架构中往往会有一个注册中心，每个微服务都会向注册中心去注册自己的地址及端口信息，注册中心维护着服务名称与服务实例的对应关系。每个微服务都会定时从注册中心获取服务列表，同时汇报自己的运行情况，这样当有的服务需要调用其他服务时，就可以从自己获取到的服务列表中获取实例地址进行调用。

服务发现：服务间的调用不是通过直接调用具体的实例地址，而是通过服务名发起调用。调用方需要向服务注册中心咨询服务，获取服务的实例清单，从而访问具体的服务实例。

## 代码实例

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

## 高可用注册中心

注册中心互相注册，形成一组互相注册的服务注册中心， 以实现服务清单的互相同步， 达到高可用的效果。

创建application-replica1.yml和 application-replica2.yml：

```yaml
-- application-replica1.yml
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
    
-- application-replica2.yml
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



