# Spring Cloud Config

Spring Cloud Config分为服务端和客户端。服务端也称为分布式配置中心，它是个独立的微服务应用，用于从配置仓库获取配置信息供客户端使用。而客户端则是微服务架构中的各个微服务应用或者基础设施，可以从配置中心获取配置信息，在启动时加载配置。Spring Cloud Config 的配置中心默认采用Git来存储配置信息。

## 准备配置信息

在Git仓库中添加好配置文件。

master分支下的配置信息：

```yaml
config:
  info: "config info for dev(master)"
```

## 配置中心

创建config-server模块，在pom.xml中添加依赖：

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-config-server</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

在application.yml中进行配置：

```yaml
server:
  port: 8901
spring:
  application:
    name: config-server
  cloud:
    config:
      server:
        git: #配置存储配置信息的Git仓库
          uri: https://gitee.com/macrozheng/springcloud-config.git
          username: macro
          password: 123456
          clone-on-start: true #开启启动时直接从git获取配置
eureka:
  client:
    service-url:
      defaultZone: http://localhost:8001/eureka/
```

在启动类添加@EnableConfigServer启动配置中心的功能。

```java
@EnableConfigServer
@EnableDiscoveryClient
@SpringBootApplication
public class ConfigServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(ConfigServerApplication.class, args);
    }
}
```

## 获取配置信息

访问http://localhost:8901/master/config-dev来获取master分支上dev环境的配置信息。

```json
{
    "name":"master",
    "profiles":[
        "config-dev"
    ],
    "label":null,
    "version":"caf6549c807a6dde1fbbe399ffca18dc886ac03d",
    "state":null,
    "propertySources":[
    ]
}
```

访问http://localhost:8901/master/config-dev.yml来获取master分支上dev环境的配置文件信息。

```yaml
config:
  info: config info for dev(master)
```

创建config-client模块，在 pom.xml 中添加相关依赖。

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-config</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

配置application.yml。

```yaml
server:
  port: 9001
spring:
  application:
    name: config-client
  cloud:
    config: #Config客户端配置
      profile: dev #启用配置后缀名称
      label: dev #分支名称
      uri: http://localhost:8901 #配置中心地址
      name: config #配置文件名称
eureka:
  client:
    service-url:
      defaultZone: http://localhost:8001/eureka/
```

添加ConfigClientController用于获取配置。

```java
@RestController
public class ConfigClientController {

    @Value("${config.info}")
    private String configInfo;

    @GetMapping("/configInfo")
    public String getConfigInfo() {
        return configInfo;
    }
}
```

启动config-client服务，访问http://localhost:9001/configInfo，可以获取到dev分支下dev环境的配置。

## 刷新配置

当Git仓库中的配置信息更改后，我们可以通过SpringBoot Actuator的refresh端点来刷新客户端配置信息。

config-client增加依赖：

```xml
<dependency>
   <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

application.yml开启refresh端点：

```yaml
management:
  endpoints:
    web:
      exposure:
        include: 'refresh'
```

在ConfigClientController类添加@RefreshScope注解用于刷新配置：

```java
@RestController
@RefreshScope
public class ConfigClientController {

    @Value("${config.info}")
    private String configInfo;

    @GetMapping("/configInfo")
    public String getConfigInfo() {
        return configInfo;
    }
}
```

重新启动config-client后，调用refresh端点进行配置刷新。

访问http://localhost:9001/configInfo进行测试，可以发现配置信息已经刷新。

## 安全认证

创建config-security-server模块，在pom.xml中添加相关依赖：

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-config-server</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

在application.yml中进行配置：

```yaml
server:
  port: 8905
spring:
  application:
    name: config-security-server
  cloud:
    config:
      server:
        git:
          uri: https://gitee.com/macrozheng/springcloud-config.git
          username: 
          password: 
          clone-on-start: true #开启启动时直接从git获取配置
  security: #配置用户名和密码
    user:
      name: 
      password: 
```

然后启动config-security-server服务。

修改config-client的配置（添加application-security.yml配置文件，主要是配置了配置中心的用户名和密码）：

```yaml
server:
  port: 9002
spring:
  application:
    name: config-client
  cloud:
    config:
      profile: dev #启用配置后缀名称
      label: dev #分支名称
      uri: http://localhost:8905 #配置中心地址
      name: config #配置文件名称
      username: 
      password: 
```

使用application-security.yml启动config-client服务。访问http://localhost:9002/configInfo进行测试。

## 配置中心集群

在微服务架构中，所有服务都从配置中心获取配置，配置中心一旦宕机，会发生很严重的问题。通过搭建配置中心集群避免该问题。

1. 启动两个config-server分别运行在8902和8903端口上；

2. 添加config-client的配置文件application-cluster.yml，主要是添加了从注册中心获取配置中心地址的配置并去除了配置中心uri的配置：

   ```yaml
   spring:
     cloud:
       config:
         profile: dev #启用环境名称
         label: dev #分支名称
         name: config #配置文件名称
         discovery:
           enabled: true
           service-id: config-server
   eureka:
     client:
       service-url:
         defaultZone: http://localhost:8001/eureka/
   ```

   

