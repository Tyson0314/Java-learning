# SpringBoot如何解决跨域问题

2. 1. 创建一个filter解决跨域
项目中前后端分离部署，所以需要解决跨域的问题。 我们使用cookie存放用户登录的信息，在spring拦截器进行权限控制，当权限不符合时，直接返回给用户固定的json结果。 当用户登录以后，正常使用；当用户退出登录状态时或者token过期时，由于拦截器和跨域的顺序有问题，出现了跨域的现象。 我们知道一个http请求，先走filter，到达servlet后才进行拦截器的处理，如果我们把cors放在filter里，就可以优先于权限拦截器执行。

```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.addAllowedOrigin("*");
        corsConfiguration.addAllowedHeader("*");
        corsConfiguration.addAllowedMethod("*");
        corsConfiguration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
        urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", corsConfiguration);
        return new CorsFilter(urlBasedCorsConfigurationSource);
    }
}
```

2. 基于WebMvcConfigurerAdapter配置加入Cors的跨域
这种解决方案并非 Spring Boot 特有的，在传统的 SSM 框架中，就可以通过 CORS 来解决跨域问题，只不过之前我们是在 XML 文件中配置 CORS ，现在可以通过实现WebMvcConfigurer接口然后重写addCorsMappings方法解决跨域问题。

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("*")
                .allowCredentials(true)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .maxAge(3600);
    }
}
```



3. controller配置CORS
可以向@RequestMapping注解处理程序方法添加一个@CrossOrigin注解，以便启用CORS（默认情况下，@CrossOrigin允许在@RequestMapping注解中指定的所有源和HTTP方法）：

```java
@RestController
@RequestMapping("/account")
public class AccountController {
 
    @CrossOrigin
    @GetMapping("/{id}")
    public Account retrieve(@PathVariable Long id) {
        // ...
    }
 
    @DeleteMapping("/{id}")
    public void remove(@PathVariable Long id) {
        // ...
    }
}
```

@CrossOrigin 表示所有的URL均可访问此资源 @CrossOrigin(origins = “http://127.0.0.1:8080”)//表示只允许这一个url可以跨域访问这个controller 代码说明：@CrossOrigin这个注解用起来很方便，这个可以用在方法上，也可以用在类上。如果你不设置他的value属性，或者是origins属性，就默认是可以允许所有的URL/域访问。

- value属性可以设置多个URL。
- origins属性也可以设置多个URL。
- maxAge属性指定了准备响应前的缓存持续的最大时间。就是探测请求的有效期。
- allowCredentials属性表示用户是否可以发送、处理 cookie。默认为false
- allowedHeaders 属性表示允许的请求头部有哪些。
- methods 属性表示允许请求的方法，默认get，post，head。



---

最后，推荐大家加入我的[**学习圈**](http://mp.weixin.qq.com/s?__biz=Mzg2OTY1NzY0MQ==&mid=2247492252&idx=1&sn=8fc12e97763e3b994b0dd0e717a4b674&chksm=ce9b1fdaf9ec96cca6c03cb6e7b61156d3226dbb587f81cea27b71be6671b81b537c9b7e9b2d&scene=21#wechat_redirect)，目前已经有130多位小伙伴加入了，文末有**优惠券**，**扫描二维码**领取优惠券加入。

学习圈提供以下这些**服务**：

1、学习圈内部**知识图谱**，汇总了**优质资源、面试高频问题、大厂面经、踩坑分享**，让你少走一些弯路

2、四个**优质专栏**、Java**面试手册完整版**(包含场景设计、系统设计、分布式、微服务等)，持续更新

3、**一对一答疑**，我会尽自己最大努力为你答疑解惑

4、**免费的简历修改、面试指导服务**，绝对赚回门票

5、各个阶段的优质**学习资源**(新手小白到架构师)，超值

6、打卡学习，**大学自习室的氛围**，一起蜕变成长

![](http://img.topjavaer.cn/img/星球优惠券-学习网站.png)