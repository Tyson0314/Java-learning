---
sidebar: heading
title: Spring MVC源码分析
category: 源码分析
tag:
  - Spring MVC
head:
  - - meta
    - name: keywords
      content: Spring MVC面试题,Spring MVC源码解析,MVC模式,Spring MVC和Struts,Spring MVC工作原理,Spring MVC常用注解,Spring MVC异常处理,Spring MVC拦截器,REST
  - - meta
    - name: description
      content: 高质量的Spring MVC常见知识点和面试题总结，让天下没有难背的八股文！
---

## 1. 先从DispatcherServlet说起

有Servlet基础的同学应该都知道，前端的每一个请求都会由一个Servlet来处理。在最原始的Java Web开发中，我们需要写自己的Servlet，然后再标注上这个Servlet是处理什么URL路径的，这样当一个HTTP请求到来时，就可以根据请求的路径找到我们的Servlet，再调用这个Servlet来处理请求。

在SpringMVC的开发中，我们需要配一个特殊的Servlet叫`DispatcherServlet`（这个东西是Spring帮我们写好的），然后我们再为`DispatcherServlet`配置映射的URL路径为`/`。其中`/`是个通配符，代表它能处理所有URL的请求。这代表所有的HTTP请求都会打到了`DispatcherServlet`上，那么此时我们的开发就由：

![](http://img.topjavaer.cn/img/202311230846421.png)

转为了：

![](http://img.topjavaer.cn/img/202311230846478.png)



其中上图的**后端处理**就是我们自己写的Controller里的每个方法。

这样就有了一个问题，**为什么要那么做？为什么要将所有的请求都打到一个Servlet上再由这个Servlet分发？**

原因很简单，**就是Spring想掌控一切**。Spring想拦截所有的HTTP请求并对每个请求做一定的处理，**让我们能够尽量少的关心HTTP请求和响应，尽可能多的关心业务**。

比如，我们往往会写这样一个创建用户的请求：

```java
@RestController
public class UserController{
    @PostMapping("/user")
    public User createUser(@RequestBody User user){
        //...
    }
}
```

上述Controller中，我们的参数User对象是如何从HTTP请求中解析到的，又是如何将返回给前端的数据写进HTTP响应的，这些我们都不需要关心，这些其实都是`DispatcherServlet`这个类帮我们做了。

有了上面这些思想后，我们来看下`DispatcherServlet`类的继承结构：

![](http://img.topjavaer.cn/img/202311230847898.png)



可以看到`DispatcherServlet`是一个Servlet实现类。而我们又知道处理Http请求的Servlet必须是`HttpServlet`，`HttpServlet`内规定了`doGet()、doPost()、doPut()`等方法，其中`FrameworkServlet`类(上图的倒数第二个类)重写了这些方法，它对这些方法的重写都一模一样：

```java
public abstract class FrameworkServlet extends HttpServletBean implements ApplicationContextAware {
    //...
    @Override
    protected final void doGet(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {

        processRequest(request, response);
    }
    @Override
    protected final void doPost(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {

        processRequest(request, response);
    }
    @Override
    protected final void doPut(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {

        processRequest(request, response);
    }
    //...
}
```

都是调用`processRequest()`方法，而`processRequest()`方法又会调用`doService()`方法。`doService()`是`FrameworkServlet`的抽象方法，这个方法由`DispatcherServlet`实现，`DispatcherServlet#doService()`又调用了`DispatcherServlet#doDispatch()`方法。其时序图如下：

![image-20220807223638836](http://img.topjavaer.cn/img/202311230846720.png)



其中，**`DispatcherServlet#doDispatch()`**是最核心的方法，**对于SpringMVC处理请求的源码分析往往也是对`DispatcherServlet#doDispatch()`的分析**。

## 2. doDispatch做了什么

简单来讲，`doDispatch()`做了四件事：

1. 根据HTTP请求的信息找到我们的处理方法(包括方法的适配器，我们一会说)
2. 使用适配器，根据HTTP请求信息和我们的处理方法，解析出请求参数，并执行我们的处理方法。
3. 将处理方法的返回结果进行处理
4. 视图解析

其中我们的处理方法就是Controller层里面每一个标了`@RequestMapping`(`@GettingMapping`、`@PostMapping`等也属于`@RequestMapping`)注解的方法。

`doDispatch()`源码中这四步流程的具体执行为：

```java
protected void doDispatch(HttpServletRequest request, HttpServletResponse response) throws Exception {
    //...

    ModelAndView mv = null;
    //对应步骤1，找到处理方法
    mappedHandler = getHandler(processedRequest);

    //...

    //对应步骤1，找到处理方法的适配器(适配器我们下面会说，别着急)
    HandlerAdapter ha = getHandlerAdapter(mappedHandler.getHandler());

    //...

    //对应步骤2和步骤3，解析参数，执行方法，并处理方法的返回
    mv = ha.handle(processedRequest, response, mappedHandler.getHandler());

    //...

    //对应步骤4 视图解析
    processDispatchResult(processedRequest, response, mappedHandler, mv, dispatchException);

    //...
}
```

我们将`doDispatch()`中比较重要的源码拿了出来，这样看起来更加清晰明了，这些重要的源码就分别对应我们上面说的4个步骤。下面我们会一一说一下每个步骤SpringMVC都做了什么。

## 3. 第一步 找到处理方法

要想处理请求，必然要先找到能处理这个请求的方法。SpringMVC分为两步来寻找，**第一步是找到我们的Controller里自己写的那个方法，称作handler（处理器）。第二步是通过这个handler找到对应的适配器，称作handlerAdapter。**

### 3.1 找到handler

#### 3.1.1 HandlerMapping

先介绍一个接口`HandlerMapping`，它翻译过来是请求映射处理器。我们可以这样理解：

对于后端来讲，我们把HTTP请求分为几种：比如请求静态资源的，请求动态处理的，请求欢迎页的等。每一种类型的HTTP请求都需要一个专门的处理器来处理，这些处理器就是`HandlerMapping`。换句话说一个`HandlerMapping`实现类就是一个场景下的HTTP请求处理器。

`DispatcherServlet`类内部有一个属性`handlerMappings`，这个属性里面装了一些`HandlerMapping`的实现类：

```java
public class DispatcherServlet extends FrameworkServlet{
    //...
    private List<HandlerMapping> handlerMappings;
    //...
}    
```

默认情况下`handlerMappings`里有5个实现类，分别是`RequestMappingHandlerMapping`、`BeanNameUrlHandlerMapping`、`RouterFunctionMapping`、`SimpleUrlHandlerMapping`和`WelcomePageHandlerMapping`。

![image-20220808000313545](http://img.topjavaer.cn/img/202311230846759.png)



看名字大概也可以猜到这些`HandlerMapping`的应用场景，比如`SimpleUrlHandlerMapping`是用来处理静态页面请求的，`WelcomePageHandlerMapping`是用来处理欢迎页请求的。而**对于动态请求的处理，也即执行我们Controller里的方法(handler)的请求，是由`RequestMappingHandlerMapping`实现的**。

#### 3.1.2 DispatcherServlet#getHandler()

了解了这些后，我们再来看SpringMVC是如何找到我们的hander的，根据上面的源码我们知道首先会执行`getHandler()`方法，`getHandler()`就是遍历`DispatcherServlet`类内`handlerMappings`的所有`HandlerMapping`，挨个调用它们的`getHandler()`方法，谁先有返回就代表找到了（这里返回的是`HandlerExecutionChain`，而非`HandlerMapping`，主要原因是`HandlerExecutionChain`封装了一些拦截器，我们讲到拦截器时再说，大家可以简单认为`HandlerExecutionChain`和`HandlerMapping`是一样的）。

```java
   protected HandlerExecutionChain getHandler(HttpServletRequest request) throws Exception {
       if (this.handlerMappings != null) {
           //遍历handlerMappings里的每个HandlerMapping实现类，判断哪个HandlerMapping能处理这个HTTP请求
           for (HandlerMapping mapping : this.handlerMappings) {
               //一旦HandlerMapping的getHandler()有返回，就代表这个找到了能处理的handler
               HandlerExecutionChain handler = mapping.getHandler(request);
               if (handler != null) {
                   return handler;
               }
           }
       }
       return null;
   }
```

我们之前说了对于HTTP的动态请求的是由`RequestMappingHandlerMapping`来处理的，那也就是`RequestMappingHandlerMapping#getHandler()`有返回，那么我们看下它是怎么处理的。

#### 3.1.3 RequestMappingHandlerMapping#getHandler()

MappingRegistry与HandlerMethod

这里又需要插入一个知识，我们要先讲一个叫做`MappingRegistry`的东西。`MappingRegistry`翻译过来叫做映射器注册中心。也即所有的映射器都需要注册到这里，它就像是一个大集合，装了所有的映射器。那什么是映射器呢？就是我们的handler，也即我们自己写的Controller里的方法。也就是说在项目启动的时候，Spring会扫描我们这个项目下所有标注了`@Controller`注解的类，然后再扫描这些类里面标了`@RequestMapping`(`@GettingMapping`、`@PostMapping`等也属于`@RequestMapping`)注解的方法，并将这些方法封装注册到`MappingRegistry`中。**Spring将我们这些方法统一封装成`HandlerMethod`对象。**`HandlerMethod`内的属性挺丰富的，比如：

我们之前说了`MappingRegistry`是一个大的集合，这个集合装了所有Controller类内标了`@RequestMapping`的方法。因此我们必然能根据HTTP请求从`MappingRegistry`中找到我们的处理方法。`MappingRegistry`内部有两个非常重要的Map

```java
class MappingRegistry {

    private final Map<T, MappingRegistration<T>> registry = new HashMap<>();

    private final MultiValueMap<String, T> pathLookup = new LinkedMultiValueMap<>();
    //...
}
```

首先`MappingRegistration`是一个包装类，它包装了我们上面说的`HandlerMethod`，部分信息如下：

```java
static class MappingRegistration<T> {

    private final T mapping;
    //可以看到包装了我们的HandlerMethod
    private final HandlerMethod handlerMethod;
    
    //...
}
```

`pathLookup`这个Map，key是URL路径，而value是能处理这个URL路径的方法描述信息（注意是方法描述信息，不是方法本身）。这个Map比较特殊的是一个`MultiValueMap`，也即**可以根据一个key得到多个value**。这个很正常，比如：

```java
@RestController
public class UserController {
    @GetMapping("/user")
    public Object getUser(){
        //...
    }

    @PostMapping("/user")
    public User postUser(@RequestBody User user){
        //...
    }

    @DeleteMapping("/user")
    public String deleteUser(){
        //...
    }
}
```

我们一个URL路径`/user`可以对应上述Controller里的三个方法。

而`registry`这个Map的key是方法描述信息 (就是pathLookup的value)，`registry`的value是`MappingRegistration`，也即封装了具体的执行方法。

AbstractHandlerMethodMapping#getHandlerInternal()

了解了`MappingRegistry`后，我们再回来看`RequestMappingHandlerMapping`，`RequestMappingHandlerMapping`类的父类是`AbstractHandlerMethodMapping`，这个类内持有`MappingRegistry`实例：

```java
public abstract class AbstractHandlerMethodMapping<T> extends AbstractHandlerMapping implements InitializingBean {
    //...
    private final MappingRegistry mappingRegistry = new MappingRegistry();
    //...
}
```

也即我们刚才分析的`MappingRegistry`会被`AbstractHandlerMethodMapping`持有，那也就代表**我们的`RequestMappingHandlerMapping`这个类拥有项目所有的`HandlerMethod`**。

对于`RequestMappingHandlerMapping#getHandler()`的调用最终会调用到`AbstractHandlerMethodMapping#getHandlerInternal()`上，其关键源码如下：

```java
protected HandlerMethod getHandlerInternal(HttpServletRequest request) throws Exception {
    //先根据HTTP请求得到请求URL路径，比如/user
    String lookupPath = initLookupPath(request);
    //读写锁，获得读锁，暂时可以不必关心
    this.mappingRegistry.acquireReadLock();
    try {
        //根据URL路径和HTTP请求信息从自己的属性MappingRegistry中拿到匹配的HandlerMethod
        HandlerMethod handlerMethod = lookupHandlerMethod(lookupPath, request);
        //找到后将匹配的HandlerMethod返回
        return (handlerMethod != null ? handlerMethod.createWithResolvedBean() : null);
    }
    finally {
        //释放读锁
        this.mappingRegistry.releaseReadLock();
    }
}
```

可以看到上述信息核心的地方在`lookupHandlerMethod()`，其部分关键源码如下：

```java
protected HandlerMethod lookupHandlerMethod(String lookupPath, HttpServletRequest request) throws Exception {
    //match是符合的，匹配到的HandlerMethod，一会我们找到的HandlerMethod会放到这个里面
    List<Match> matches = new ArrayList<>();
    //根据URL路径先找匹配的方法信息（注意是方法信息，不是方法本身）
    //我们上面说过，根据URL路径寻找可能会找到多个符合的方法，比如GET/user POST/user DELETE/user 
    List<T> directPathMatches = this.mappingRegistry.getMappingsByDirectPath(lookupPath);
    if (directPathMatches != null) {
        //再根据HTTP请求的其他信息(比如请求类型(GET,POST等)），进一步寻找符合的处理方法
        //并将找到的方法放入matches里面
        addMatchingMappings(directPathMatches, matches, request);
    }
    //下面就是一些异常判断了
    //比如如果matchers是空的话，也即没找到能处理的方法要怎么办啦
    //如果找到不只一个能处理的方法就抛出异常啦之类的
    //正常情况下我们只会找到一个能处理的方法，将这个方法返回即可
    //...
}
```

这里很容易想到`this.mappingRegistry.getMappingsByDirectPath(lookupPath)`其实就是从`MappingRegistry`中的`pathLookup`这个Map里面去取信息（还记得吗，我们刚说过`MappingRegistry`内部的两个重要map）。

根据URL路径匹配完以后，肯定还得结合HTTP请求，再详细的判断这个方法是否满足需求（比如我要的是GET，你的方法是POST，那肯定就不行）做一层筛选，这样筛选下来得到的方法描述信息，再作为key值，从`MappingRegistry`中的`registry`这个Map里面去取具体的方法。而这个就是`addMatchingMappings()`方法的实现细节。感兴趣的可以自己点进去这两个方法细节，实际很简单，就几行代码，这里不再贴出。

#### 3.1.4 总结

走完上面的流程，我们已经拿到了能处理请求的`HandlerMethod`，我们可以总结：

首先`DispatcherServlet`内部有5个`HandlerMapping`，它会挨个询问哪个`HandlerMapping`能处理这个请求，结果是我们的`RequestMappingHandlerMapping`能处理。`RequestMappingHandlerMapping`这个对象的内部有一个叫`MappingRegistry`的大集合，这个集合里面装了我们项目所有的自己编写的Controller里处理请求的方法，它将我们的方法封装为`HandlerMethod`，当`RequestMappingHandlerMapping`去处理的时候实际上就是根据HTTP 信息（比如请求类型和URL路径）去`MappingRegistry`里面找符合的`HandlerMethod`，将找到的`HandlerMethod`返回。

流程大致如下图：

![image-20220808171735041](http://img.topjavaer.cn/img/202311230846114.png)



#### 3.1.5 一些补充

handlerMappings内的元素是有顺序的

我们上面看到`DispatcherServlet`里的`handlerMappings`有5个实现类，都放在一个List里面，它们其实是有顺序的（父类`AbstractHandlerMapping`继承接口`Ordered`），`RequestMappingHandlerMapping`在最前面，这有什么影响呢？举个例子：

假设我的SpringBoot项目现在有一个静态文件叫hello.html

![](http://img.topjavaer.cn/img/202311230846876.png)

默认情况下，我通过访问`localhost:8080/hello.html`，SpringBoot就会将这个静态文件返回给浏览器。但如果这个时候我有个Controller，它是这样写的

```java
@RestController
public class HelloController {
    @GetMapping("/hello.html")
    public String hello(){
        return "hello world";
    }

}
```

那么请问此时再访问`localhost:8080/hello.html`还会返回静态文件吗，还是会走到我们的Controller返回`"hello world"`字符串呢？

答案是会走进Controller返回`"hello world"`字符串。原因也很简单，因为`RequestMappingHandlerMapping`在`SimpleUrlHandlerMapping`前面，`DispatcherServlet`会先问`RequestMappingHandlerMapping`能不能处理。在我们没写这个Controller时，`RequestMappingHandlerMapping`肯定是没法从`MappingRegistry`找到匹配的处理方法的，所以就处理不了，这时才会轮到后面的`SimpleUrlHandlerMapping`来处理，然后返回静态页面。但当我们写了这个Controller，自然`RequestMappingHandlerMapping`能找到处理方法，也就没后面`SimpleUrlHandlerMapping`什么事了。

MappingRegistry里的读写锁

刚才我们在源码里看到了`MappingRegistry`的读写锁，这个原因也挺简单的，首先`MappingRegistry`是一个注册中心，自然就允许有人往里注册或注销东西，比如MappingRegistry的部分功能如下：

```java
class MappingRegistry {
    public void register(T mapping, Object handler, Method method) {
        //...
    }
    public void unregister(T mapping) {
        //...
    }
}
```

所谓注册和注销，本质上就是在操作`MappingRegistry`里面的那些装了我们方法的集合。同时`MappingRegistry`又会被大量的查询（每次HTTP请求来了以后都会向它查询能处理的方法），因此这是一个典型的**读多写少**的场景，为保证并发安全且尽可能的提高性能，读写锁就是很好的选择。读锁之间共享，写锁独占，同时写的时候不能读。

从`MappingRegistry`的API，我们也可以大胆猜测，在项目运行期间，我们也可以向其注册和删除`HandlerMethod`。

### 3.2 找到handlerAdapter

#### 3.2.1 HandlerAdapter

在说寻找handlerAdapter之前，我们先来说下为什么需要handlerAdapter。

走到这一步的时候，想想我们拿到了什么？拿到了能处理请求的`HandlerMethod`，以及拥有HTTP请求的所有信息和HTTP响应。那正常来说就是根据HTTP请求的信息，调用我们的`HandlerMethod`来处理请求，处理完后将处理结果写进HTTP响应。但是我们知道HTTP请求是五花八门的，比如参数放在请求头或请求体，以form形式提交，以JSON格式提交等等。同时我们自己的Controller层函数写法也是各种各样，加`@RequestParam`注解的，加Cookie、Session信息的，想返回页面的，想返回数据的等等。

我们将HTTP请求类比为插头，`HandlerMethod`类比为插座，为了让这些插头和插座能够结合，就需要一个适配器，插头插在适配器上，适配器插在插座上，这样任何类型的请求，任何不同的处理方法，都会有一个适配器来处理。

**Spring将这种适配器称作`HandlerAdapter`。**

与`handlerMappings`相同，`DispatcherServlet`内部也有一个属性叫`handlerAdapters`，这个属性里面也装了一些`HandlerAdapter`的实现类：

```java
public class DispatcherServlet extends FrameworkServlet{
    //...
    private List<HandlerAdapter> handlerAdapters;
    //...
}    
```

默认情况下，这个List集合里有4个实现类，分别是`RequestMappingHandlerAdapter`、`HandlerFunctionAdapter`、`HttpRequestHandlerAdapter`和`SimpleControllerHandlerAdapter`。

![image-20220804185151491](http://img.topjavaer.cn/img/202311230846149.png)



根据名字可以看出，这些适配器与`HandlerMapping`是有对应关系的。比如`RequestMappingHandlerMapping`与`RequestMappingHandlerAdapter`是对应的，说明`RequestMappingHandlerAdapter`是用于适配`RequestMappingHandlerMapping`映射器的。

#### 3.2.2 DispatcherServlet#getHandlerAdapter()

根据之前的源码，我们知道`getHandlerAdapter()`函数就是用来获得适配器的，它的源码如下：

```java
protected HandlerAdapter getHandlerAdapter(Object handler) throws ServletException {
    if (this.handlerAdapters != null) {
        for (HandlerAdapter adapter : this.handlerAdapters) {
            if (adapter.supports(handler)) {
                return adapter;
            }
        }
    }
    throw new ServletException("No adapter for handler [" + handler +
                               "]: The DispatcherServlet configuration needs to include a HandlerAdapter that supports this handler");
}
```

可以看到，十分简单，就是挨个问`handlerAdapters`里的每一个`HandlerAdapter`，谁支持适配这个请求处理，谁支持就返回谁。

我们刚才知道`RequestMappingHandlerMapping`的适配器是`RequestMappingHandlerAdapter`，那也就代表，这里正常会返回`RequestMappingHandlerAdapter`，我们不妨走进`RequestMappingHandlerAdapter#support()`，看看它是如何判断的。

#### 3.2.3 RequestMappingHandlerAdapter#support()

`RequestMappingHandlerAdapter#support()`会进入`AbstractHandlerMethodAdapter#supports()`，其中`AbstractHandlerMethodAdapter`是`RequestMappingHandlerAdapter`的父类，其源码如下：

```java
public abstract class AbstractHandlerMethodAdapter extends WebContentGenerator implements HandlerAdapter, Ordered {
    //...
    public final boolean supports(Object handler) {
        return (handler instanceof HandlerMethod && supportsInternal((HandlerMethod) handler));
    }   
    //...
}
```

`supportsInternal()`由子类`RequestMappingHandlerAdapter`实现：

```java
public class RequestMappingHandlerAdapter extends AbstractHandlerMethodAdapter implements BeanFactoryAware, InitializingBean {
    //...
    @Override
    protected boolean supportsInternal(HandlerMethod handlerMethod) {
        return true;
    }
    //...
}
```

可以看到，`RequestMappingHandlerAdapter`的判断逻辑很简单，就是问找到的handler是不是`HandlerMethod`类型，通过前面的源码分析，我们很清楚handler就是`HandlerMethod`。

至此我们就找到了我们的`HandlerMethod`和`HandlerAdapter`，完成了`DispatcherServlet#doDispatch()`的第一步：根据HTTP请求的信息找到我们的处理方法(包括方法的适配器)。

#### 3.2.4 总结

我们在3.1节中已经找到了`HandlerMethod`，但考虑到HTTP请求信息比较多，如何将HTTP请求的信息与我们的`HandlerMethod`参数信息进行匹配，以及又如何将`HandlerMethod`处理完的结果返回给HTTP响应，这就需要适配器，我们需要找到合适的适配器来进行后续的工作。

与`handlerMappings`相同，`DispatcherServlet`内的`handlerAdapters`装了一些`HandlerAdapter`的实现类。处理动态请求会由`RequestMappingHandlerAdapter`适配器来处理，而`RequestMappingHandlerAdapter`判断能处理的逻辑也很简单，就是看上一步得到的处理器是不是`HandlerMethod`。拿到适配器后，我们就可以将HTTP请求信息与我们的`HandlerMethod`进行适配了。

## 4. 第二步 解析参数

在讲参数解析前，我们先回顾下目前已经走了哪些步骤，得到了哪些东西：

首先我们根据HTTP请求，从`MappingRegistry`中得到了能处理请求的`HandlerMethod`，其次为将HTTP请求与我们的`HandlerMethod`适配，又根据`HandlerMethod`找到了适配器`RequestMappingHandlerAdapter`，现在我们拥有的就是

- 实际的处理器`HandlerMethod`
- 适配器`RequestMappingHandlerAdapter`
- HTTP请求和HTTP响应

我们之前说了由于HTTP请求和`HandlerMethod`五花八门，因此需要适配器来帮忙执行HTTP请求。那适配器到底帮了哪些忙呢？

实际上就两点：**参数解析和返回结果的处理**。适配器会首先根据HTTP请求信息和我们的`HandlerMethod`，解析HTTP请求，将它转为我们`HandlerMethod`上的参数。举个例子，前端通过form表单发送HTTP请求：

form表单内容如下：

```json
name=tom&age=18&pet.name=myDog&pet.age=18
```

后端Controller:

```java
@PostMapping("/user")
public User postUser(User user){
    return user;
}
```

SpringMVC会自动将表单中的字符串信息转为我们的User参数对象。

得到所有参数后，适配器会直接调用`HandlerMethod`处理请求。这时我们又得到了处理的返回结果。这个结果的意义也是众多的，它可以是一个对象然后用JSON写出，也可以是一个页面，还可以是一个跳转或重定向，不同的返回情况都需要被特殊适配处理，这些东西也是适配器帮我们做的。

为了让大家回想起`DispatcherServlet#doDispatch()`的四个步骤，我们再将源码贴过来：

```java
protected void doDispatch(HttpServletRequest request, HttpServletResponse response) throws Exception {
    //...

    ModelAndView mv = null;
    //对应步骤1，找到处理方法
    mappedHandler = getHandler(processedRequest);

    //...

    //对应步骤1，找到处理方法的适配器(适配器我们下面会说，别着急)
    HandlerAdapter ha = getHandlerAdapter(mappedHandler.getHandler());

    //...

    //对应步骤2和步骤3，解析参数，执行方法，并处理方法的返回
    mv = ha.handle(processedRequest, response, mappedHandler.getHandler());

    //...

    //对应步骤4 视图解析
    processDispatchResult(processedRequest, response, mappedHandler, mv, dispatchException);

    //...
}
```

其中`mv = ha.handle(processedRequest, response, mappedHandler.getHandler());`就是适配器做的工作：**参数解析，执行方法并处理执行返回**。

在本章中我们先学习参数解析，下一章讲返回结果的处理。

### 4.1 先从一个设计模式说起

为便于理解参数解析的设计思想，我们先从一个设计模式讲起，理解这个设计模式对于SpringMVC的学习很关键。

我们假设现在你是一个包工头，你的手底下有很多技术工，有能刷墙的，能砌砖的，能设计图纸的还有能开挖掘机的。很多房地产开发商有活的时候会找你。比如今天恒太房地产跟你说他现在手里有一个刷墙的活问你能不能干。你二话不说接了这个活并派出了刷墙技术工来干活。

针对上面这个场景，我们可以抽象为代码，首先我们有个工人接口。刷墙工，砌砖工等都属于这个接口的实现类。

```java
public interface Worker{}
```

每个工人首先需要明确自己自己能干哪些活，比如刷墙工只能干刷墙的活，他干不了砌砖。怎么明确呢，只能问。比如现在来了一个活，我得问下刷墙工能不能干。因此就需要一个`support(Object work)`方法，表明当前工人能不能干这个活。同时如果能干，还得有个实际干活的功能，因此我们的`Worker`接口如下：

```java
public interface Worker{
    /**
     * 判断当前工人是否能干这个活 
     */
    boolean support(Object work);
    /**
     * 如果能干就实际的干
     */
    void doWork(Object work);
}
```

由于你是个包工头，因此你手里应该有一批工人，我们可以使用类`Boss`描述包工头：

```java
public class Boss{
    List<Worker> workerList;
}
```

`workerList`就表示你手里拥有的众多工人。

现在，某客户有活过来了，你得判断谁能接这个活，然后交给他干。比较简单的办法就是挨个问手底下的工人，谁能干就让谁干。

```java
public class Boss{
    List<Worker> workerList;
    
    //遍历询问谁能干，谁能干就让谁干
    public void doWork(Object work){
        for(Worker worker : workerList){
            if(worker.support(work)){
                worker.doWork(work);
                return;
            }
        }
        //都不能干就抛出异常
        throw new RuntimeException("抱歉，我们这接不了这种活");
    }
}
```

这样，其实我们就完成了一个设计模式，叫**策略模式**。

什么是策略模式？**我们可以将上面的工人都理解为某种策略，当有任务来的时候，就需要选择一个正确的策略来处理这个任务。我们将策略抽象为接口（或抽象类），然后自己持有这个接口（或抽象类）的集合**。类似于：

```java
//A接口是策略
public interface A{}
public class B{
    //B对象持有A的实现类集合
    List<A> aList;
}
```

后面源码的分析中，**策略模式会使用的非常频繁**。其实如果你细心观察会发现之前的`DispatcherServlet`里的`handlerMappings`和`handlerAdapters`也是策略模式，每个`HandlerMapping`或`HandlerAdapter`的实现类都是一种策略，然后我们的`DispatcherServlet`持有这些策略，当有HTTP请求到来时，就遍历这些策略判断哪个能处理，找到那个能处理的策略来处理任务。

### 4.2 参数解析

了解了策略模式，我们来看下参数解析的源码。

```
ha.handle()`的具体执行会走到`RequestMappingHandlerAdapter#handleInternal()`，而`handleInternal()`又会调用`RequestMappingHandlerAdapter#invokeHandlerMethod()
public class RequestMappingHandlerAdapter extends AbstractHandlerMethodAdapter implements BeanFactoryAware, InitializingBean {
    @Override
    protected ModelAndView handleInternal(HttpServletRequest request,
                                          HttpServletResponse response, HandlerMethod handlerMethod) throws Exception {

        ModelAndView mav;
        //...
        //一些校验和特殊情况的判断，比如加session锁
        //最终会执行invokeHandlerMethod
        mav = invokeHandlerMethod(request, response, handlerMethod);
        //...
        return mav;
    }
}    
```

因此我们先来分析下`RequestMappingHandlerAdapter#invokeHandlerMethod()`

#### 4.2.1 RequestMappingHandlerAdapter#invokeHandlerMethod()

HandlerMethodArgumentResolver

本着不大篇幅的贴源码，尽量深入浅出的思想，在讲源码前我们先来说点别的。首先从一个接口`HandlerMethodArgumentResolver`说起。

我们都知道SpringMVC会根据HTTP请求和我们写的`HandlerMethod`来解析参数。但是之前也说过，解析参数的情况太多了，比如用`@RequestParam`从请求头中解析，使用`@RequestBody`从请求体中解析等。面对如此多的情况，我们不妨使用刚刚学习的策略模式，**将每种情况的处理都认为是一个策略，然后使用一个List将这些策略汇总起来。那么当要解析一个参数的时候，就从集合中取出一个合适的策略来解析这个参数**。SpringMVC就是那么做的。其中对于解析参数的这一策略接口叫做**`HandlerMethodArgumentResolver`**，我们称为参数解析器。接口的源码为：

```java
public interface HandlerMethodArgumentResolver {

   boolean supportsParameter(MethodParameter parameter);

   @Nullable
   Object resolveArgument(MethodParameter parameter, @Nullable ModelAndViewContainer mavContainer,
         NativeWebRequest webRequest, @Nullable WebDataBinderFactory binderFactory) throws Exception;

}
```

可以看到一个`supportsParameter()`一个`resolveArgument()`，和我们之前讲的包工头例子一模一样。那么自然而言我们需要一个集合来保存`HandlerMethodArgumentResolver`接口的实现类。`RequestMappingHandlerAdapter`内有一个`argumentResolvers`属性：

```java
public class RequestMappingHandlerAdapter extends AbstractHandlerMethodAdapter implements BeanFactoryAware, InitializingBean {
    //...
    private HandlerMethodArgumentResolverComposite argumentResolvers;
    //...
}
```

**其中`HandlerMethodArgumentResolverComposite`就是`HandlerMethodArgumentResolver`的集合**，其内部属性如下：

```java
public class HandlerMethodArgumentResolverComposite implements HandlerMethodArgumentResolver {

   private final List<HandlerMethodArgumentResolver> argumentResolvers = new ArrayList<>();
    //...
}
```

默认情况下`argumentResolvers`内包含27个实现类，内容如下：

![image-20220819160536958](http://img.topjavaer.cn/img/202311230845819.png)



ModelAndView

我们再来说第二个重要的类`ModelAndViewContainer`，这个类的作用类似于上下文，它保存着整个请求处理过程中的**Model**和**View**。

首先根据MVC思想我们知道，对于一个MVC项目，我们可以给请求响应两种东西：数据和页面。除此以外，在转发或重定向时，往往需要将我们的数据也转发或重定向到下一级请求（转发是同一个HTTP请求，这里只是表述方便）。这时就需要一种数据结构，用来装我们返回的结果，这个结果可以是返回给请求的，也可以是转发到下一级请求处理的（转发和重定向），这就是`ModelAndView`。因此我们可以理解为`ModelAndView`就是用来装一次HTTP处理结果的容器，这个容器里主要装了Model和View两个信息。

其实我们在之前的源码中已经看到过`ModelAndView`了，它实际上贯穿于整个`doDispatch()`方法，我们不妨将之前`DispatcherServelt`的重要源码再拿过来看：

```java
protected void doDispatch(HttpServletRequest request, HttpServletResponse response) throws Exception {
    //...
    //这里就是先声明了一个ModelAndView
    ModelAndView mv = null;
 
    mappedHandler = getHandler(processedRequest);
    
    //...

    HandlerAdapter ha = getHandlerAdapter(mappedHandler.getHandler());

    //...

    //可以看到适配器的处理结果就是返回一个ModelAndView
    mv = ha.handle(processedRequest, response, mappedHandler.getHandler());

    //...

    //视图解析，需要从ModelAndView中拿到视图信息
    processDispatchResult(processedRequest, response, mappedHandler, mv, dispatchException);

    //...
}
```

`ModelAndViewContainer`可以理解为`ModelAndView`的包装类，这个类在`RequestMappingHandlerAdapter#invokeHandlerMethod()`处理过程中被创建（我们一会儿会看到），主要是装`HandlerMethod`的处理结果（如果参数有Map或者Model还会装参数里的Map和Model信息）。

**也即`ModelAndViewContainer`就是适配器在处理一次HTTP请求的上下文信息，这个上下文里面装的是处理过程中的Model和View。**
`ModelAndViewContainer`源码中几个重要的属性信息如下：

```java
public class ModelAndViewContainer {
    //视图信息，可以是一个View，也可能只是一个视图名String
    private Object view;
    //数据，本质是个Map，我们在Controller内的函数上写的Map或Model其实都是它
    private final ModelMap defaultModel = new BindingAwareModelMap();
    //重定向的数据，也是个Map
    private ModelMap redirectModel;
}
```

可以看到`ModelAndViewContainer`内部维护了一个View和两个Model，分别是默认的Model和重定向的Model。

WebDataBinderFactory

翻译过来就是数据绑定工厂，我们拿之前表单提交的例子来说：

form表单内容如下：

```json
name=tom&age=18&pet.name=myDog&pet.age=18
```

后端Controller:

```java
@PostMapping("/user")
public User postUser(User user){
    return user;
}
```

这里很明显的是，SpringMVC将form提交的每一个参数信息**绑定**到了我们的User对象上，而这个绑定操作就是`WebDataBinderFactory`干的工作。

RequestMappingHandlerAdapter#invokeHandlerMethod()

了解了上面那么多以后，我们就可以看下`RequestMappingHandlerAdapter#invokeHandlerMethod()`，其部分源码如下：

```java
protected ModelAndView invokeHandlerMethod(HttpServletRequest request,
                                           HttpServletResponse response, HandlerMethod handlerMethod) throws Exception {
    //webRequest是HttpServletRequest和HttpServletResponse的包装类
    ServletWebRequest webRequest = new ServletWebRequest(request, response);
    //...
    //ServletInvocableHandlerMethod是一个大的包装器，下面的一系列set操作都是对ServletInvocableHandlerMethod的丰富
    ServletInvocableHandlerMethod invocableMethod = createInvocableHandlerMethod(handlerMethod);
    if (this.argumentResolvers != null) {
        invocableMethod.setHandlerMethodArgumentResolvers(this.argumentResolvers);
    }
    if (this.returnValueHandlers != null) {
        invocableMethod.setHandlerMethodReturnValueHandlers(this.returnValueHandlers);
    }
    invocableMethod.setDataBinderFactory(binderFactory);
    invocableMethod.setParameterNameDiscoverer(this.parameterNameDiscoverer);

    //创建ModelAndViewContainer
    ModelAndViewContainer mavContainer = new ModelAndViewContainer();
    //做一些ModelAndViewContainer的初始化工作
    
    //...
    
    //包装之后的核心执行，包含参数解析，处理器执行和返回结果的处理
    invocableMethod.invokeAndHandle(webRequest, mavContainer);
    
    //...
    
    //处理完后返回ModelAndView
    return getModelAndView(mavContainer, modelFactory, webRequest);
    
}
```

`ServletInvocableHandlerMethod`是`HandlerMethod`的包装类（实际上它继承自`HandlerMethod`类），它里面装了很多信息，比如装了我们之前说的参数解析器，装了我们的`handlerMethod`，还装了`WebDataBinderFactory`等。另外还有一个`returnValueHandlers`，它是我们的返回结果处理器，还记得我们之前说的，handlerAdpter实际上帮我们做的事是**参数解析和返回结果的处理**。这里的`returnValueHandlers`就是用于返回结果处理的

`ServletWebRequest`也是个包装类，就是将`HttpServletRequest`和`HttpServletResponse`合并到了一个类里。`ModelAndViewContainer`我们在之前已经介绍过了，当都准备好这些信息后，就要开始执行

```java
invocableMethod.invokeAndHandle(webRequest, mavContainer);
```

因此下一步我们就需要追溯：`ServletInvocableHandlerMethod#invokeAndHandle()`的源码

#### 4.2.2 ServletInvocableHandlerMethod#invokeAndHandle()

其部分源码如下：

```java
public void invokeAndHandle(ServletWebRequest webRequest, ModelAndViewContainer mavContainer,
      Object... providedArgs) throws Exception {

   Object returnValue = invokeForRequest(webRequest, mavContainer, providedArgs);
    
    //...后面是返回结果的处理，我们在第五章讲
    //...
}
```

其中`invokeForRequest()`是参数解析以及执行`HandlerMethod`然后得到返回结果。

`invokeForRequest()`源码如下：

```java
public Object invokeForRequest(NativeWebRequest request, @Nullable ModelAndViewContainer mavContainer,
      Object... providedArgs) throws Exception {

    //根据HTTP请求解析参数
   Object[] args = getMethodArgumentValues(request, mavContainer, providedArgs);
   
    //...一些日志打印
    //...
    //得到参数后，反射执行HandlerMethod
   return doInvoke(args);
}
```

因此参数解析的核心代码就是`getMethodArgumentValues()`函数

#### 4.2.3 getMethodArgumentValues()

```java
protected Object[] getMethodArgumentValues(NativeWebRequest request, @Nullable ModelAndViewContainer mavContainer,
                                           Object... providedArgs) throws Exception {

    //拿到所有的参数信息
    MethodParameter[] parameters = getMethodParameters();

    //...
    //args就是装我们所有的参数，这里先声明出来
    Object[] args = new Object[parameters.length];
    //遍历所有的参数信息
    for (int i = 0; i < parameters.length; i++) {
        MethodParameter parameter = parameters[i];

        //...一些参数处理
        //使用参数解析器来解析参数
        args[i] = this.resolvers.resolveArgument(parameter, mavContainer, request, this.dataBinderFactory);
        //... 
        //一些异常处理
        //...
    }
    return args;
}
```

可以看到参数解析就是**以我们的`HandlerMethod`的参数信息为模板，使用解析器，从HTTP请求中拿到信息赋值到我们的参数上**，这样循环遍历`HandlerMethod`中的每个参数，就可以解析得到所有的参数对象。

那么我们就要看下参数解析器到底是如何解析参数的。

#### 4.2.4 HandlerMethodArgumentResolverComposite#resolveArgument()

`HandlerMethodArgumentResolverComposite#resolveArgument()`源码很好理解，就是找到能解析这个参数的参数解析器，然后调用这个找到的解析器解析它。

```java
public Object resolveArgument(MethodParameter parameter, @Nullable ModelAndViewContainer mavContainer,
                              NativeWebRequest webRequest, @Nullable WebDataBinderFactory binderFactory) throws Exception {
    
    //得到参数解析器
    HandlerMethodArgumentResolver resolver = getArgumentResolver(parameter);
    if (resolver == null) {
        throw new IllegalArgumentException("Unsupported parameter type [" +
                                           parameter.getParameterType().getName() + "]. supportsParameter should be called first.");
    }
    //解析参数
    return resolver.resolveArgument(parameter, mavContainer, webRequest, binderFactory);
}
```

其中获得参数解析器代码为：

```java
private HandlerMethodArgumentResolver getArgumentResolver(MethodParameter parameter) {
    //先从缓存中寻找，找不到再遍历寻找
   HandlerMethodArgumentResolver result = this.argumentResolverCache.get(parameter);
   if (result == null) {
       //遍历每一个参数解析器，判断谁能处理这个参数
      for (HandlerMethodArgumentResolver resolver : this.argumentResolvers) {
         if (resolver.supportsParameter(parameter)) {
            result = resolver;
             //找到能处理的参数后就将它放入缓存，保证下次不用再遍历
            this.argumentResolverCache.put(parameter, result);
            break;
         }
      }
   }
   return result;
}
```

这里需要提一嘴的是`argumentResolverCache`属性，`argumentResolverCache`作用很简单，就是缓存的功能。一开始项目启动的时候缓存里面没有任何东西，这样解析每个参数就都需要遍历所有的参数解析器，判断谁能支持处理这个参数，一旦找到这个参数解析器就需要将它缓存起来，这样下次再请求的时候就可以直接从缓存拿避免再遍历，节省了下次HTTP请求的时间。

```java
public class HandlerMethodArgumentResolverComposite implements HandlerMethodArgumentResolver {
    //...
    private final Map<MethodParameter, HandlerMethodArgumentResolver> argumentResolverCache =
        new ConcurrentHashMap<>(256);

    //...
}
```

可以看到`argumentResolverCache`本质就是一个`ConcurrentHashMap`，它的key是`MethodParameter`也即参数信息（可以推测出`MethodParameter`一定重写了`equals()`和`hashCode()`），Value是能处理这个参数的参数解析器。

这里我们又看到了策略模式的使用，使用`argumentResolvers`将所有参数解析器汇总起来，在真正需要进行参数解析的时候就会挨个问这些参数解析器有没有人能处理这个参数，谁能处理就交由谁处理。

最后的一步就是调用参数解析器解析参数：

```java
resolver.resolveArgument(parameter, mavContainer, webRequest, binderFactory);
```

首先，参数解析器解析参数需要parameter，mavContainer，webRequest，binderFactory四个参数才能解析，每个参数的作用我们一一来说（虽然我们刚才已经讲了一些）：

- parameter 参数模板信息。我现在是参数解析器，我要解析这个参数肯定得有参数信息吧，这个参数是不是标了`@RequestBody`注解啊，是不是一个复杂类型比如User对象啊等等，如果是的话我得拿到它的Class，反射创建和赋值吧。只有获得这些信息才能从HTTP请求中对应的位置找到参数，按照参数模板信息来生成参数。

- mavContainer 我们之前说过，mavContainer 是一次HTTP请求的上下文，用来装返回的Model和View，既然是装返回的信息，那为啥解析参数的时候还需要它呢？在写Controller方法的时候，有一种场景可以如下：

  ```java
  @GetMapping("/user")
  public User getUser(Model model){
      model.addAttribute("key1","value1");
      //...
  }
  ```

  我们往参数Model里设置的任何信息，都会被放进返回结果处理，比如可以转发给下一级HTTP请求（或者返给前端）。

  那这个参数Model是哪里来的？**就是mavContainer里的defaultModel这个属性**。我们会在具体的例子中再详细的看相关的源码，这里大家只需要大概知道一下就可以。

- webRequest 封装了HTTP请求和HTTP响应的类。既然要从HTTP中解析参数，自然就需要HTTP请求和响应的信息，这都是原始数据。

- binderFactory 我们之前讲过，数据绑定工厂，将HTTP请求信息与我们的参数的值绑定上的东西，我们会在后面具体使用场景中分析这个东西，大家别急。

可以看到，要解析一个`HandlerMethod`上的参数，就需要一个特定的参数解析器，而参数解析器在进行解析的时候需要parameter，mavContainer，webRequest，binderFactory的帮助才能解析出来参数。我们上面也看到Spring为我们提供了27种参数解析器（SpringBoot 2.7.2版本下是27个），这27种参数解析器就是为了应付各种场景下的HTTP请求和参数处理：

![image-20220819160536958](http://img.topjavaer.cn/img/202311230845947.png)



通过上面的名字也很容易看出一些参数解析器的作用，比如`@RequestParamMethodArgumentResolver`是用来解析标了`@RequestParam`注解的参数；`@PathVariableMethodArgumentRResolver`是解析标了`@PathVariable`注解的参数；`@RequestResponseBodyMethodArgumentResolver`是用来解析标了`@RequestBody`注解的参数。

**每个参数解析器都会有一定的应用场景，本文目的是帮助大家快速的掌握SpringMvc执行源码的流程，具体的业务场景不在本文展开，后续会专门出文章，从应用角度讲述这些参数解析器的源码。**

#### 4.2.5 doInvoke()

最后提一嘴`HandlerMethod`的执行，我们在[4.2.2](https://www.coderzoe.com/archives/28/#))的源码中已经看到了一段话

```java
return doInvoke(args);
```

也即解析完所有的参数后就可以执行`HandlerMethod`了，`doInvoke()`的源码也很简单，就是单纯的调用`method.invoke()`：

```java
protected Object doInvoke(Object... args) throws Exception {
    Method method = getBridgedMethod();
    try {
        //...一些异常处理，主要是针对Kotlin
        return method.invoke(getBean(), args);
    }
    //...一些异常处理
}
```

拿到方法，填入bean，填入参数，然后反射执行。

#### 4.2.6 总结

首先SpringMvc对不同情况下的参数解析定义了一个参数解析器接口，每个参数解析器接口的实现类就是一种情况下的参数解析，借助于策略模式，我们的`HandlerAdapter`内会有一些参数解析器的实现类。在要执行一个`HandlerMethod`前肯定要先把这个方法的所有参数解析出来，因此我们就需要遍历这个方法上的每一个参数，为每一个参数寻找一个合适的参数解析器来解析它。寻找合适参数解析器的方法很简单，就是挨个问`HandlerAdapter`持有的那些参数解析器是否支持解析，一旦有支持的就代表找到了，找到后就调用参数解析器解析参数。参数解析器在解析参数的时候，需要四个帮手才能真正的解析参数，分别是：

- 参数模板，告知这个参数的一些元数据信息
- ModelAndView上下文容器，用来处理多参数返回和HTTP请求见传递信息的作用。
- 原生HTTP请求和HTTP响应
- 数据绑定工厂，用来将从HTTP请求中解析出的信息绑定到参数对象上

目前SpringBoot2.7.2版本有27个参数解析器，他们用于不同的场景。

#### 4.2.7 一些补充

在获得某个参数的参数解析器后，我们使用`argumentResolverCache`将这一信息缓存起来，这里就会有个问题：这个缓存的生命周期是怎样的？它会在什么时候销毁？同样两次HTTP请求，后一次会使用前一次保存的缓存解析器信息吗？

要回答这个问题，我们需要追溯源码看下这个缓存的创建时间和执行HTTP请求时的传递过程：

首先`argumentResolverCache`是`HandlerMethodArgumentResolverComposite`内的属性，而`RequestMappingHandlerAdapter`的属性`argumentResolvers`正是`HandlerMethodArgumentResolverComposite`：

通过`WebMvcAutoConfiguration`和`RequestMappingHandlerAdapter`源码：

```java
public class WebMvcAutoConfiguration {
    //...
    //内部类
    @Configuration(proxyBeanMethods = false)
    @EnableConfigurationProperties(WebProperties.class)
    public static class EnableWebMvcConfiguration extends DelegatingWebMvcConfiguration implements ResourceLoaderAware{
        //...
        //@Bean创建RequestMappingHandlerAdapter实例
        @Bean
        @Override
        public RequestMappingHandlerAdapter requestMappingHandlerAdapter(
            @Qualifier("mvcContentNegotiationManager") ContentNegotiationManager contentNegotiationManager,
            @Qualifier("mvcConversionService") FormattingConversionService conversionService,
            @Qualifier("mvcValidator") Validator validator) {
            RequestMappingHandlerAdapter adapter = super.requestMappingHandlerAdapter(contentNegotiationManager,
                                                                                      conversionService, validator);
            adapter.setIgnoreDefaultModelOnRedirect(
                this.mvcProperties == null || this.mvcProperties.isIgnoreDefaultModelOnRedirect());
            return adapter;
        } 
    }
    //...

}

//RequestMappingHandlerAdapter部分源码：
public class RequestMappingHandlerAdapter extends AbstractHandlerMethodAdapter
    implements BeanFactoryAware, InitializingBean {

    //...
    //后置的属性设置，主要包含初始化argumentResolvers属性
    @Override
    public void afterPropertiesSet() {
        // Do this first, it may add ResponseBody advice beans
        initControllerAdviceCache();
        //初始化argumentResolvers
        if (this.argumentResolvers == null) {
            List<HandlerMethodArgumentResolver> resolvers = getDefaultArgumentResolvers();
            this.argumentResolvers = new HandlerMethodArgumentResolverComposite().addResolvers(resolvers);
        }
        if (this.initBinderArgumentResolvers == null) {
            List<HandlerMethodArgumentResolver> resolvers = getDefaultInitBinderArgumentResolvers();
            this.initBinderArgumentResolvers = new HandlerMethodArgumentResolverComposite().addResolvers(resolvers);
        }
        if (this.returnValueHandlers == null) {
            List<HandlerMethodReturnValueHandler> handlers = getDefaultReturnValueHandlers();
            this.returnValueHandlers = new HandlerMethodReturnValueHandlerComposite().addHandlers(handlers);
        }
    }
}
```

可以知道`RequestMappingHandlerAdapter`的创建是在项目启动的时候创建了，同样在项目启动的时候，我们的`argumentResolverCache`就被创建好了。

在执行HTTP请求的时候，invokeHandlerMethod()方法部分源码如下：

```java
protected ModelAndView invokeHandlerMethod(HttpServletRequest request,
                                           HttpServletResponse response, HandlerMethod handlerMethod) throws Exception {
    //...
    
    ServletInvocableHandlerMethod invocableMethod = createInvocableHandlerMethod(handlerMethod);
    if (this.argumentResolvers != null) {
        invocableMethod.setHandlerMethodArgumentResolvers(this.argumentResolvers);
    }
    
    //...
    
    invocableMethod.invokeAndHandle(webRequest, mavContainer);
    
    //..
}
```

每次HTTP请求的时候都会创建一个`ServletInvocableHandlerMethod`对象，但往`ServletInvocableHandlerMethod`对象内设置的`argumentResolvers`是由`RequestMappingHandlerAdapter#argumentResolvers`属性传进去的，`RequestMappingHandlerAdapter`是单例的，也即`RequestMappingHandlerAdapter#argumentResolvers`只有一份，即使每次HTTP请求都创建`ServletInvocableHandlerMethod`，但每个对象内持有的`argumentResolvers`都是同一份，再往下追寻：

在`ServletInvocableHandlerMethod`对象内部执行参数解析操作

```java
protected Object[] getMethodArgumentValues(NativeWebRequest request, @Nullable ModelAndViewContainer mavContainer,
                                           Object... providedArgs) throws Exception {
    //...
    if (!this.resolvers.supportsParameter(parameter)) {
        throw new IllegalStateException(formatArgumentError(parameter, "No suitable resolver"));
    }
    try {
        args[i] = this.resolvers.resolveArgument(parameter, mavContainer, request, this.dataBinderFactory);
    }
    //...
}
```

参数解析的时候就会将找到的参数放进`argumentResolverCache`缓存中，既然所有的`ServletInvocableHandlerMethod`对象都持有一份`argumentResolvers`，那自然也持有同一份`argumentResolverCache`，都是`RequestMappingHandlerAdapter`里的那一份。因此上一次HTTP请求做的缓存保存，自然可以被下一次HTTP请求使用。

这里也解释了`argumentResolverCache`是`ConcurrentHashMap`，而非HashMap，因为请求肯定是并发的，有人往Map里写有人从Map中拿，要保证线程安全。

因此可以得出结论`argumentResolverCache`是与项目生命周期基本相同的，同一HTTP请求可以被缓存，供以后使用。

## 5. 第三步 执行方法并处理返回

### 5.1 HandlerMethodReturnValueHandler

我们上面说了，对于`HandlerMethod`的返回情况也是多种多样的，比如可以返回视图，可以返回一个对象，对象可以被解析为JSON，还可以被解析为XML返回，可以跳转/重定向等等。针对那么多种情况，就需要对返回的结果进行适配处理。

与参数处理器解析器类似，对于返回结果的处理，Spring也抽象为了一个接口叫`HandlerMethodReturnValueHandler`，翻译为返回值处理器，因此一个`HandlerMethodReturnValueHandler`的实现类就是一个场景下的返回结果处理。

同样与参数解析器类似，SpringMVC再次采用策略模式，将所有返回值处理器的实现类保存起来，当需要处理返回值的时候就从这些实现类中选择一个来处理返回。

`RequestMappingHandlerAdapter`类中有一个重要的属性`returnValueHandlers`：

```java
public class RequestMappingHandlerAdapter extends AbstractHandlerMethodAdapter
    implements BeanFactoryAware, InitializingBean {
    //...
    private HandlerMethodReturnValueHandlerComposite returnValueHandlers;
    //...
}
```

其中`HandlerMethodReturnValueHandlerComposite`就是返回值处理器的集合：

```java
public class HandlerMethodReturnValueHandlerComposite implements HandlerMethodReturnValueHandler {
    //...
    private final List<HandlerMethodReturnValueHandler> returnValueHandlers = new ArrayList<>();
    //...
}
```

因此`RequestMappingHandlerAdapter`对象中持有多个`HandlerMethodReturnValueHandler`实现类，默认情况下`RequestMappingHandlerAdapter`持有15个返回值处理器（SpringBoot2.7.2版本）

![image-20220822184726495](http://img.topjavaer.cn/img/202311230845634.png)



### 5.2 ServletInvocableHandlerMethod#invokeAndHandle()

`ServletInvocableHandlerMethod`类我们之前已经讲过，它就是`HandlerMethod`的一个包装类，里面装了很多东西，其中上面说的返回值处理器也被装在了里面：

```java
public class RequestMappingHandlerAdapter extends AbstractHandlerMethodAdapter
    implements BeanFactoryAware, InitializingBean {
    //...
    protected ModelAndView invokeHandlerMethod(HttpServletRequest request,
                                               HttpServletResponse response, HandlerMethod handlerMethod) throws Exception {
        //...
        if (this.returnValueHandlers != null) {
            //将返回值处理器设置进包装类
            invocableMethod.setHandlerMethodReturnValueHandlers(this.returnValueHandlers);
        }
        //...
    }
    //...    
}
```

因此`ServletInvocableHandlerMethod`在解析完参数并执行完`HandlerMethod`拿到结果后就开始使用返回值处理器来处理结果：

```java
public void invokeAndHandle(ServletWebRequest webRequest, ModelAndViewContainer mavContainer,
                            Object... providedArgs) throws Exception {

    //解析参数并执行HandlerMethod，得到返回结果
    Object returnValue = invokeForRequest(webRequest, mavContainer, providedArgs);

    //...一些返回信息的校验

    this.returnValueHandlers.handleReturnValue(
        returnValue, getReturnValueType(returnValue), mavContainer, webRequest);
    //...一些异常处理
}
```

可以看到直接使用`returnValueHandlers`来处理返回值，因此对返回值的处理就在代码

```java
this.returnValueHandlers.handleReturnValue(
    returnValue, getReturnValueType(returnValue), mavContainer, webRequest);
```

我们继续深入。

### 5.3 HandlerMethodReturnValueHandlerComposite#handleReturnValue()

其中`HandlerMethodReturnValueHandlerComposite#handleReturnValue()`代码也与我们在参数解析器里看到的思路基本相同，从众多返回值处理器实现类中获得能处理的返回值处理器，用这个得到的实现类来处理返回值。

```java
public void handleReturnValue(@Nullable Object returnValue, MethodParameter returnType,
                              ModelAndViewContainer mavContainer, NativeWebRequest webRequest) throws Exception {
    //得到返回值处理器
    HandlerMethodReturnValueHandler handler = selectHandler(returnValue, returnType);
    
    // .. 异常处理
    
    //调用得到的返回值处理器处理结果
    handler.handleReturnValue(returnValue, returnType, mavContainer, webRequest);
}
```

而`selectHandler()`也很简单，就是遍历挨个问返回值处理器，谁支持处理，谁支持就让谁处理。

```java
private HandlerMethodReturnValueHandler selectHandler(@Nullable Object value, MethodParameter returnType) {
   //...
   for (HandlerMethodReturnValueHandler handler : this.returnValueHandlers) {
       //...
       //判断是否支持处理
      if (handler.supportsReturnType(returnType)) {
         return handler;
      }
   }
   return null;
}
```

我们刚才已经看到在SpringBoot2.7.2版本中已经默认带了15个返回值处理器

![image-20220822184726495](http://img.topjavaer.cn/img/202311230845673.png)



其中通过类名不难看出，`@RequestResponseBodyMethodProcessor`是处理返回结果加了`@ResponseBody`注解的情况（准确来说是`HandelrMethod`上或者Controller类上加了`@ResponseBody`注解），`ViewNameMethodReturnValueHandler`是处理返回结果是视图名的等。

**每个返回值处理器都会有一定的应用场景，本文目的是帮助大家快速的掌握SpringMvc执行源码的流程，具体的业务场景不在本文展开，后续会专门出文章，从应用角度讲述这些返回值处理器的源码。**

### 5.4 RequestMappingHandlerAdapter#getModelAndView()

执行完获得结果以后，就需要将`ModelAndView`返回，在上面的源码中我们也看到，`HandlerAdapter#handle()`的返回是`ModelAndView`。

返回`ModelAndView`的源码为：

```java
public class RequestMappingHandlerAdapter extends AbstractHandlerMethodAdapter implements BeanFactoryAware, InitializingBean {
    protected ModelAndView invokeHandlerMethod(HttpServletRequest request,
                                               HttpServletResponse response, HandlerMethod handlerMethod) throws Exception {
        //...
        //返回ModelAndView
        return getModelAndView(mavContainer, modelFactory, webRequest);           
    }
}
```

`ModelAndView`的获取很简单，就是从mavContainer中得到Model和View信息，返回即可。

```java
private ModelAndView getModelAndView(ModelAndViewContainer mavContainer,
                                     ModelFactory modelFactory, NativeWebRequest webRequest) throws Exception {

    //...一些更新操作
    
    //设置Model和View
    ModelMap model = mavContainer.getModel();
    ModelAndView mav = new ModelAndView(mavContainer.getViewName(), model, mavContainer.getStatus());
    //设置View，针对返回不是视图名的情况
    if (!mavContainer.isViewReference()) {
        mav.setView((View) mavContainer.getView());
    }
    
    //....重定向的特殊处理
    
    return mav;
}
```

## 6. 第四步 视图解析

走完了上面那些就到了第四步：视图解析。视图解析不是必须的，只有在需要SpringMVC判断返回结果包含视图的时候才会进行视图解析（也即ModelAndView中的view信息不为空），举个例子：

在配置了

```yaml
spring:
  mvc:
    view:
      prefix: /
      suffix: .html
```

Controller层写为

```java
@Controller
public class HelloController {
    @GetMapping("/hello")
    public String hello(){
        return "hello";
    }
}
```

且静态资源路径下存在hello.html时，我们请求`/hello`便会返回hello.html页面。

为了最后再加强大家对于SpringMVC执行流程的记忆，我们最后再将`DispatcherServlet#doDispatch()`四个步骤的重要源码拿过来：

```java
protected void doDispatch(HttpServletRequest request, HttpServletResponse response) throws Exception {
    //...

    ModelAndView mv = null;
    //对应步骤1，找到处理方法
    mappedHandler = getHandler(processedRequest);

    //...

    //对应步骤1，找到处理方法的适配器(适配器我们下面会说，别着急)
    HandlerAdapter ha = getHandlerAdapter(mappedHandler.getHandler());

    //...

    //对应步骤2和步骤3，解析参数，执行方法，并处理方法的返回
    mv = ha.handle(processedRequest, response, mappedHandler.getHandler());

    //...

    //对应步骤4 视图解析
    processDispatchResult(processedRequest, response, mappedHandler, mv, dispatchException);

    //...
}
```

可以看到，第四步的视图解析是`processDispatchResult()`函数。

### 6.1 DispatcherServlet#processDispatchResult()

其主要源码如下：

```java
private void processDispatchResult(HttpServletRequest request, HttpServletResponse response,
                                   @Nullable HandlerExecutionChain mappedHandler, @Nullable ModelAndView mv,
                                   @Nullable Exception exception) throws Exception {

    //... 异常校验

    // Did the handler return a view to render?
    if (mv != null && !mv.wasCleared()) {
        //解析视图
        render(mv, request, response);
        //...
    }
    //... 一些别的处理，如记录日志和拦截器的triggerAfterCompletion执行
}
```

可以看到SpringMVC会先判断ModelAndView不为空且视图信息不为空（较低版本SpringBoot这里是`&&mv.view!=null`）。

因此视图解析的所有核心源码在`render()`函数中：

```java
protected void render(ModelAndView mv, HttpServletRequest request, HttpServletResponse response) throws Exception {
    //...国际化处理

    View view;
    String viewName = mv.getViewName();
    if (viewName != null) {
        // We need to resolve the view name.
        view = resolveViewName(viewName, mv.getModelInternal(), locale, request);
        if (view == null) {
            throw new ServletException("Could not resolve view with name '" + mv.getViewName() +
                                       "' in servlet with name '" + getServletName() + "'");
        }
    }
    //... 处理viewName为空的异常

    try {
        if (mv.getStatus() != null) {
            //设置HTTP响应状态码
            request.setAttribute(View.RESPONSE_STATUS_ATTRIBUTE, mv.getStatus());
            response.setStatus(mv.getStatus().value());
        }
        //视图渲染
        view.render(mv.getModelInternal(), request, response);
    }

    //...异常处理
}
```

这里需要讲的一点是`View`对象，对于视图这一信息，SpringMVC抽象出了一个接口叫`View`。`View`接口下的实现类非常多，每个不同的实现类都是一种视图场景。

![image-20220823223018574](http://img.topjavaer.cn/img/202311230845196.png)

比如处理重定向页面的`RedirectView`，处理内部视图资源的`InternalResourceView`。

因此上述`render()`函数的核心是**先解析视图名得到`View`对象，再通过`View`对象做视图渲染**。

我们先看第一个函数，通过视图名得到`View`对象`resolveViewName()`

### 6.2 DispatcherServlet#resolveViewName()

#### 6.2.1 ViewResolver

SpringMVC再次借助策略模式，将解析视图名返回View对象这一能力作为策略，策略的接口为`ViewResolver`。`ViewResolver`接口下只有一个方法：

```java
public interface ViewResolver {
   @Nullable
   View resolveViewName(String viewName, Locale locale) throws Exception;

}
```

就是解析视图名称返回`View`对象。

同样的，大家应该猜到了`DispatcherServlet`内部持有多个`ViewResolver`实现类：

```java
public class DispatcherServlet extends FrameworkServlet {
    //...
    private List<ViewResolver> viewResolvers;
    //...
}
```

#### 6.2.2 DispatcherServlet#resolveViewName()

有了这些信息后，我们再来看`resolveViewName`函数：

```java
protected View resolveViewName(String viewName, @Nullable Map<String, Object> model,
                               Locale locale, HttpServletRequest request) throws Exception {

    if (this.viewResolvers != null) {
        for (ViewResolver viewResolver : this.viewResolvers) {
            View view = viewResolver.resolveViewName(viewName, locale);
            if (view != null) {
                return view;
            }
        }
    }
    return null;
}
```

就是拿到所有的实现类，挨个遍历调用`viewResolver.resolveViewName()`来解析视图，谁解析出来了(`View!=null`)就直接返回。

默认情况下`DispatcherServlet`内部持有4个视图解析器实现类：

![image-20220823224512517](http://img.topjavaer.cn/img/202311230845917.png)



其实第一个实现类内部持有其他三个实现类，这点我们会以后在具体场景中再讲。

### 6.3 view.render()

视图解析器解析出的View对象后，调用`view.render()`就可以渲染视图，我们刚才已经看到了`View`接口下有很多实现类且每个实现类应用场景不同，因此具体的`render()`我们后续会以具体的场景来分析。

## 7. 总结

其实从上到下看过来，发现一切都是一个策略模式（其中还有一个适配器模式），首先根据HTTP请求处理的不同，SpringMVC抽象出了`HandlerMapping`接口，并且`DispatcherServlet`对象持有多个`HandlerMapping`实现类。

一般请求到我们Controller层的由实现类`RequestHandlerMapping`来处理，SpringMVC会在项目一启动的扫描我们所有Controller下的标了`@RequestMapping`注解的处理 函数，并将这个处理函数封装成`HandlerMethod`，使用一个大的集合管理这些`HandlerMethod`（就是`MappingRegistry`），因此`RequestHandlerMapping`会根据请求路径和请求方式从集合中找到合适的`HandlerMethod`来处理请求。

但是HTTP请求五花八门，我们写的Controller层方法各有不同，为了能比较通用的执行HTTP请求，就需要适配，因此再次借助策略模式，SpringMVC将适配器抽象为接口`HandlerAdapter`，并且`DispatcherServlet`对象持有多个`HandlerAdapter`实现类。

需要适配Controller层方法，也即`HandlerMethod`的适配器叫做`RequestMappingHandlerAdapter`，`RequestMappingHandlerAdapter`作为适配器主要做了两件事：参数解析和返回结果处理。所谓参数解析就是将HTTP请求中的内容解析为我们`HandlerMethod`上的参数，返回结果处理就是对一些返回的结果做特殊处理并写出到HTTP输出流中，比如将返回的Java对象转为JSON写进输出流。

`RequestMappingHandlerAdapter`的适配工作也依赖于了策略模式，解析参数的时候抽象出一个接口叫`HandlerMethodArgumentResolver`，同时自己持有多个`HandlerMethodArgumentResolver`的实现类。`RequestMappingHandlerAdapter`会遍历我们`HandlerMethod`上的每一个参数，然后对每个参数都挨个问`HandlerMethodArgumentResolver`能否解析，如果能解析就解析参数（实际会有个缓存，防止以后再挨个问）。同理返回处理的时候也使用了策略模式，将返回处理抽象为接口`HandlerMethodReturnValueHandler`，自己持有多个`HandlerMethodReturnValueHandler`的实现类，在解析完参数并调用`MethodHandler`执行完处理得到结果后，就开始结果处理，同样挨个调用`HandlerMethodReturnValueHandler`的实现类，问问它能不能处理，要是能就处理。

在上述这些流程都完成后，最后一步就是视图解析，视图解析一般分为两步，视图名解析和视图渲染。我们一般返回的信息是视图名，SpringMVC将所有视图抽象为接口`View`，因此就需要根据返回的视图名寻找对应的解析器将视图名解析为`View`对象，针对这一解析过程，使用策略模式，抽象为接口`ViewResolver`，`DispatcherServlet`内持有多个`ViewResolver`的实现类，也是一样的遍历每个实现类看看能不能解。在得到`View`对象后，调用`View.render()`对视图进行渲染，就完成了视图解析。