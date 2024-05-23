---
sidebar: heading
title: Spring MVC源码分析
category: 源码分析
tag:
  - Spring MVC
head:
  - - meta
    - name: keywords
      content: Spring MVC面试题,Spring MVC源码解析,参数解析器,MVC模式,Spring MVC工作原理,Spring MVC常用注解,Spring MVC异常处理,Spring MVC拦截器
  - - meta
    - name: description
      content: 高质量的Spring MVC常见知识点和面试题总结，让天下没有难背的八股文！
---

上篇中我们已经讲了SpringMVC处理HTTP请求的整体流程，其间我们讲到了很多接口，如参数解析器，返回结果处理器等，但我们都没有深入的进去查看这些解析器或处理器是如何处理的。本章就带大家进入真实的案例场景，看看这些接口在具体场景下是如何发挥作用的

## 0. 参数解析器

为了方便后面具体案例的分析，我们先来回顾下之前在上一篇中讲到的参数解析器。

当我们发送HTTP请求 时，根据之前的框架分析，我们知道这个请求会由`RequestMappingHandlerAdapter`来处理，在`RequestMappingHandlerAdapter`来处理的时候，会将自己的很多信息封装到`ServletInvocableHandlerMethod`中，包括自己的参数解析器和返回值处理器。`ServletInvocableHandlerMethod`做处理的代码我们之前看过了，这里再拿过来：

```java
public void invokeAndHandle(ServletWebRequest webRequest, ModelAndViewContainer mavContainer,
      Object... providedArgs) throws Exception {

    //参数解析与HandlerMethod的执行
    Object returnValue = invokeForRequest(webRequest, mavContainer, providedArgs);
    //... 一些返回的处理
}
```

其中`invokeForRequest()`内容如下：

```java
public Object invokeForRequest(NativeWebRequest request, @Nullable ModelAndViewContainer mavContainer,
      Object... providedArgs) throws Exception {

    //参数解析
   Object[] args = getMethodArgumentValues(request, mavContainer, providedArgs);
    //...日志
    //函数执行
   return doInvoke(args);
}
```

`getMethodArgumentValues()`内容如下：

```java
protected Object[] getMethodArgumentValues(NativeWebRequest request, @Nullable ModelAndViewContainer mavContainer,
      Object... providedArgs) throws Exception {
    
   MethodParameter[] parameters = getMethodParameters();
   if (ObjectUtils.isEmpty(parameters)) {
      return EMPTY_ARGS;
   }

   Object[] args = new Object[parameters.length];
   for (int i = 0; i < parameters.length; i++) {
      MethodParameter parameter = parameters[i];
      parameter.initParameterNameDiscovery(this.parameterNameDiscoverer);
      args[i] = findProvidedArgument(parameter, providedArgs);
      if (args[i] != null) {
         continue;
      }
       //判断解析器是否支持解析
       //本质是循环遍历
      if (!this.resolvers.supportsParameter(parameter)) {
         throw new IllegalStateException(formatArgumentError(parameter, "No suitable resolver"));
      }
      try {
          //找到能解析的解析器就解析参数
         args[i] = this.resolvers.resolveArgument(parameter, mavContainer, request, this.dataBinderFactory);
      }
       //...异常处理
   }
   return args;
}
```

这里的`supportsParameter()`源码如下：

```java
public boolean supportsParameter(MethodParameter parameter) {
    return getArgumentResolver(parameter) != null;
}
private HandlerMethodArgumentResolver getArgumentResolver(MethodParameter parameter) {
    HandlerMethodArgumentResolver result = this.argumentResolverCache.get(parameter);
    //遍历判断每个参数解析器是否支持解析当前参数
    if (result == null) {
        for (HandlerMethodArgumentResolver resolver : this.argumentResolvers) {
            if (resolver.supportsParameter(parameter)) {
                result = resolver;
                this.argumentResolverCache.put(parameter, result);
                break;
            }
        }
    }
    return result;
}
```

而`resolveArgument()`源码如下：

```java
public Object resolveArgument(MethodParameter parameter, @Nullable ModelAndViewContainer mavContainer,
      NativeWebRequest webRequest, @Nullable WebDataBinderFactory binderFactory) throws Exception {

   HandlerMethodArgumentResolver resolver = getArgumentResolver(parameter);
    //异常处理
   return resolver.resolveArgument(parameter, mavContainer, webRequest, binderFactory);
}
```

我们之前虽然大体上走完了每个流程，但其实并没有深入到每个接口的实现类里去看，这一主要原因是SpringMVC要处理的情况太多了，只能结合实际的场景来说源码。因此下面我们将会一个一个场景的讲源码处理，首先从参数解析器的源码场景说起。

## 1. @PathVariable

`@PathVariable`注解是Web开发中十分常见的一个注解，我们可以从路径中获取信息作为参数。

举个例子如下：

```java
@RestController
public class PathVariableController {
    @GetMapping("/user/{id}")
    public String getUser(@PathVariable("id") long id){
        return "hello user";
    }
}
```

当我们执行HTTP请求 `GET /user/1`的时候，上面的参数id值就被映射为了1。根据上面的源码我们知道，要想解析出参数id，必然有一个参数解析器做了这个工作。

首先打断点到`supportsParameter()`，查看到底是哪个参数解析器支持这样的处理。通过打断点可以很容易知道是`PathVariableMethodArgumentResolver`参数解析器支持解析这个参数，那我们就需要问两个问题了：

1. 为什么`PathVariableMethodArgumentResolver`可以支持这个参数的解析，它是如何判定的
2. `PathVariableMethodArgumentResolver`是如何解析参数，从HTTP请求中将信息抠出赋给id字段的呢？

这两个问题的答案其实也是`PathVariableMethodArgumentResolver`的两个实现方法：`supportsParameter()`和`resolveArgument()`

我们先来看第一个方法的源码：

```java
public boolean supportsParameter(MethodParameter parameter) {
    //不带PathVariable注解直接返回false
   if (!parameter.hasParameterAnnotation(PathVariable.class)) {
      return false;
   }
   if (Map.class.isAssignableFrom(parameter.nestedIfOptional().getNestedParameterType())) {
      PathVariable pathVariable = parameter.getParameterAnnotation(PathVariable.class);
      return (pathVariable != null && StringUtils.hasText(pathVariable.value()));
   }
   return true;
}
```

这个函数的判断逻辑比较简单，首先是判断如果参数上不带`@PathVariable`注解直接返回false。其次带了注解，判断我们的参数类型是不是Map类型的，如果是的话就获取`@PathVariable`注解信息并要求其value内容不能为空。最后如果不是Map但是有`@PathVariable`注解就直接返回true。我们的参数是long型，且标了`@PathVariable`，因此会直接返回true。

再看第二个源码（其实是`PathVariableMethodArgumentResolver`的父类`AbstractNamedValueMethodArgumentResolver`实现的）：

```java
public final Object resolveArgument(MethodParameter parameter, @Nullable ModelAndViewContainer mavContainer,
      NativeWebRequest webRequest, @Nullable WebDataBinderFactory binderFactory) throws Exception {

    //拿到我们的参数名，在上例中，我们的参数名是id（其实就是@PathVariable注解里的value值）
   NamedValueInfo namedValueInfo = getNamedValueInfo(parameter);
   MethodParameter nestedParameter = parameter.nestedIfOptional();

   Object resolvedName = resolveEmbeddedValuesAndExpressions(namedValueInfo.name);
    
    //...
    
    //拿到参数名后，从HTTP请求中解析出这个参数名位置的值，比如 GET /user/1 此时arg就是"1"
   Object arg = resolveName(resolvedName.toString(), nestedParameter, webRequest);
    //... 一些校验和处理
   if (binderFactory != null) {
       //创建数据绑定器
      WebDataBinder binder = binderFactory.createBinder(webRequest, null, namedValueInfo.name);
      try {
          //使用数据绑定器进行数据转化（如果需要的话）
         arg = binder.convertIfNecessary(arg, parameter.getParameterType(), parameter);
      }
    
      //... 一些异常处理
   }

   handleResolvedValue(arg, namedValueInfo.name, parameter, mavContainer, webRequest);

   return arg;
}
```

首先我们先看下参数解析器是如何从请求信息中拿到参数值，也即：`resolveName(resolvedName.toString(), nestedParameter, webRequest);`的实现：

```java
protected Object resolveName(String name, MethodParameter parameter, NativeWebRequest request) throws Exception {
   Map<String, String> uriTemplateVars = (Map<String, String>) request.getAttribute(
         HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE, RequestAttributes.SCOPE_REQUEST);
   return (uriTemplateVars != null ? uriTemplateVars.get(name) : null);
}
```

可以看到思路很简单，在走到当前步骤之前SpringMVC就做了一个处理，将我们Controller上写的URL与实际请求的URL做了一个映射处理，比如 Controller层为：`/user/{id}/{age}` ，实际请求为：`/user/1/27`。这时SpringMVC会根据路径匹配得到K,V，分别是id ->1和age ->27。并将这个Map存储在Request的请求域中，且将它的key值设为`HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE`。这样我们走到这里的时候再从请求域中根据key值就可以拿到这个信息，信息本身是个Map，再传入resolvedName就可以拿到value，因此很容易通过传入id得到1这个信息。（关心这个Map是何时构建的可以查阅源码的`RequestMappingInfoHandlerMapping#extractMatchDetails()`函数，它会在`RequestMappingInfoHandlerMapping#getHandlerInternal()`里被调用，只不过这里面的内容有些多，需要断点打的深一点）

其次我们又看到了数据绑定器，我们前一篇中已经见过它了，当时我们说从HTTP请求中解析出数据后，得能将这些数据绑定到我们的参数上的，这个工作就是数据绑定器干的工作。由于我们的当前例子的参数比较简单（只是一个long id），所以很难发挥数据绑定器的作用，不过我们这里可以先简单的说一下：

我们知道HTTP协议是文本协议，这代表从HTTP请求中解析出的东西都是文本（二进制除外），所谓文本也即字符串，因此上面的`resolveName()`函数得到的其实是字符串"1"，但我们的HandlerMethod参数是long类型，这就需要一个字符串向long类型的转化，而这其实就是数据绑定器做的工作。

如果大家源码打的比较深的话会发现，实际进行转化的核心代码如下：

```java
public class GenericConversionService implements ConfigurableConversionService {
    //...
    public Object convert(@Nullable Object source, @Nullable TypeDescriptor sourceType, TypeDescriptor targetType) {
        //...
        //拿到转化器进行转化
        GenericConverter converter = getConverter(sourceType, targetType);
        if (converter != null) {
            Object result = ConversionUtils.invokeConverter(converter, source, sourceType, targetType);
        }
        //...
    }
    //...

}
```

而获取转化器的代码如下：

```java
protected GenericConverter getConverter(TypeDescriptor sourceType, TypeDescriptor targetType) {
    ConverterCacheKey key = new ConverterCacheKey(sourceType, targetType);
    GenericConverter converter = this.converterCache.get(key);
    if (converter != null) {
        return (converter != NO_MATCH ? converter : null);
    }

    converter = this.converters.find(sourceType, targetType);
    if (converter == null) {
        converter = getDefaultConverter(sourceType, targetType);
    }

    if (converter != null) {
        this.converterCache.put(key, converter);
        return converter;
    }

    this.converterCache.put(key, NO_MATCH);
    return null;
}
```

是不是又想到了策略模式？自己持有多个转化器，在需要转化的时候就找到适合的转化器来转化。

在SpringBoot2.7.2版本中，默认情况下的转化器共有124个，部分内容如下：

![](http://img.topjavaer.cn/img/202311262224580.png)



![image-20220906212651245](http://img.topjavaer.cn/img/202311262224620.png)



![image-20220906212707262](http://img.topjavaer.cn/img/202311262224059.png)

可以看到这些参数解析器都是将一种数据类型转为另一种数据类型，针对于我们的情况就需要一个将String类型转为Long类型的转化器。

另外需要提一嘴的是，这里的策略模式与之前参数解析器或返回值处理器的设计不同，之前策略接口都都有个类似于`support()`的功能，主类会挨个问每个策略是否支持解析，支持了再调用它来解析。但是这里是用HashMap来做的。也即我们将情况设计为key值，解决方案设计为value值。这样直接输入key值就能得到策略，无需遍历询问。通过源码也很容易看到：

```java
private final Map<ConvertiblePair, ConvertersForPair> converters = new ConcurrentHashMap<>(256);
```

`converters`是一个Map。其Key是源类型+目标类型

```java
final class ConvertiblePair {

   private final Class<?> sourceType;

   private final Class<?> targetType;
}
```

另外，SpringMVC支持让我们自定义一些类型转化器的，可以按照自己的规则来做类型转化，我们下一章就会说到。

## 2. 表单提交

### 2.1. 源码分析

举例如下：

```html
<form action="/user" method="post">
    <label>
        姓名：
        <input name="name" value="tom"/>
    </label> <br/>
    <label>
        年龄：
        <input name="age" value="18"/>
    </label> <br/>
    <label>
        宠物名字：
        <input name="pet.name" value="myDog"/>
    </label> <br/>
    <label>
        宠物年龄：
        <input name="pet.age" value="18"/>
    </label> <br/>
    <input type="submit" value="提交">
</form>
```



```java
@RestController
public class FormController {

    @PostMapping("/user")
    public String addUser(User user){
        return user.toString();
    }
}
```

其中我们的POJO类，User和Pet信息如下：

```java
public class User {
    private String name;
    private int age;
    private Pet pet;
    //省略getter setter
}
public class Pet {
    private String name;
    private int age;
    //省略getter setter
}
```

当我们点击输入如下信息：

![image-20220906214620559](http://img.topjavaer.cn/img/202311262225025.png)

点击提交给后端，我们就能通过前端的参数将这些信息赋值到User对象上

![](http://img.topjavaer.cn/img/202311262225164.png)

很明显，这是SpringMVC帮我们做的，依据之前的源码经验，我们知道必然有一个参数解析器帮我们做了这个工作，同样通过源码

```java
private HandlerMethodArgumentResolver getArgumentResolver(MethodParameter parameter) {
   HandlerMethodArgumentResolver result = this.argumentResolverCache.get(parameter);
   if (result == null) {
      for (HandlerMethodArgumentResolver resolver : this.argumentResolvers) {
         if (resolver.supportsParameter(parameter)) {
            result = resolver;
            this.argumentResolverCache.put(parameter, result);
            break;
         }
      }
   }
   return result;
}
```

很快可以定位到帮我们解析参数的参数解析器是`ServletModelAttributeMethodProcessor`，因此这个参数解析器就是处理表单提交的，老规矩我们先看下它为什么能够处理表单请求再看下它是如何解析表单参数的：

```java
public boolean supportsParameter(MethodParameter parameter) {
   return (parameter.hasParameterAnnotation(ModelAttribute.class) ||
         (this.annotationNotRequired && !BeanUtils.isSimpleProperty(parameter.getParameterType())));
}
```

其中`parameter.hasParameterAnnotation(ModelAttribute.class)`是指当前参数上包含注解`@ModelAttribute`，我们这里没有，因此是false。`this.annotationNotRequired`在当前对象中恒为true（构造方法中构造时就写死的true），最后一个`BeanUtils.isSimpleProperty(parameter.getParameterType())`是判断当前参数是否是基本类型，我们的参数是User对象，不是基本类型，取反后为true，因此整体返回true。

下面我们再看下`ServletModelAttributeMethodProcessor`是如何解析参数的：

```java
public final Object resolveArgument(MethodParameter parameter, @Nullable ModelAndViewContainer mavContainer,
                                    NativeWebRequest webRequest, @Nullable WebDataBinderFactory binderFactory) throws Exception {

    //...
    //...获得参数名
    String name = ModelFactory.getNameForParameter(parameter);
    //...

    Object attribute = null;
    BindingResult bindingResult = null;
    //...
    //构造参数实例，其实就是调用默认构造方法，得到一个空的对象
    attribute = createAttribute(name, parameter, binderFactory, webRequest);
    //...异常处理

    if (bindingResult == null) {
        //获得数据绑定器
        WebDataBinder binder = binderFactory.createBinder(webRequest, attribute, name);
        if (binder.getTarget() != null) {
            if (!mavContainer.isBindingDisabled(name)) {
                //使用数据绑定器，从HTTP请求中取出信息做绑定操作，核心方法
                bindRequestParameters(binder, webRequest);
            }
            //...
        }
        //...
    }
    //将信息加入到ModelAndViewContainer中
    Map<String, Object> bindingResultModel = bindingResult.getModel();
    mavContainer.removeAttributes(bindingResultModel);
    mavContainer.addAllAttributes(bindingResultModel);
    //返回结果
    return attribute;
}
```

源码中的流程会比较长，这里只截取了主要的部分，其思路比较清晰：

由于我们知道当前参数不是一个简单类型，因此需要先构造出来，通过

```java
attribute = createAttribute(name, parameter, binderFactory, webRequest);
```

就构造出了一个空的对象（如果点进去源码的话会发现其实就是反射拿到默认构造方法，然后调用默认的构造方法创建对象），比如如果是我们的User对象，执行完这句后就会得到：

![](http://img.topjavaer.cn/img/202311262225846.png)

我们不妨叫一个壳对象，然后构造数据绑定器，数据绑定器会解析HTTP请求，将HTTP请求的信息绑定到我们的壳对象上，这样我们就得到了一个有意义的对象，其中数据的绑定操作对应源码：

```java
bindRequestParameters(binder, webRequest);
```

执行完成后，我们的User对象就变成了

![](http://img.topjavaer.cn/img/202311262225889.png)

因此`bindRequestParameters()`方法是解析出来参数。

`bindRequestParameters()`源码如下：

```java
protected void bindRequestParameters(WebDataBinder binder, NativeWebRequest request) {
   ServletRequest servletRequest = request.getNativeRequest(ServletRequest.class);
   Assert.state(servletRequest != null, "No ServletRequest");
   ServletRequestDataBinder servletBinder = (ServletRequestDataBinder) binder;
   servletBinder.bind(servletRequest);
}
```

而`servletBinder.bind()`源码如下：

```java
public void bind(ServletRequest request) {
    MutablePropertyValues mpvs = new ServletRequestParameterPropertyValues(request);
    //... 一些特殊处理
    addBindValues(mpvs, request);
    doBind(mpvs);
}
```

十分关键的是`MutablePropertyValues`对象，这里我们已经将form表单提交的参数进行了初步解析，解析为了一个`MutablePropertyValues`对象，`MutablePropertyValues`内部有个List，装着解析后的每个参数信息：

![](http://img.topjavaer.cn/img/202311262226515.png)

这个解析其实不难，我们在提交form表单的时候，HTTP的参数原始数据如下：

`name=tom&age=18&pet.name=myDog&pet.age=2`，因此我们可以很容易的按`&`和`=`进行拆分，得到上述`MutablePropertyValues`信息。

这个信息会非常的关键，我们在后面的数据绑定中就是以这个信息作为信息源来与我们的User对象进行绑定的。

多次源码深入后会走到 `DataBinder#applyPropertyValues()`方法，其源码如下：

```java
protected void applyPropertyValues(MutablePropertyValues mpvs) {
   try {
      // Bind request parameters onto target object.
      getPropertyAccessor().setPropertyValues(mpvs, isIgnoreUnknownFields(), isIgnoreInvalidFields());
   }
    //...异常处理
}
```

可以看到就是拿到属性访问器，设置属性。所谓属性访问器，大家不用想的多高大上，其实就是一个对象包装器，通过它可以反射的将一些属性设置值。这里的属性访问器就是`BeanWrapperImpl`，了解Spring的同学肯定对它很熟悉（其实我们三期网管的协议解析器就用了这个对象，我们可以简单将它理解为一个工具类，这个工具类可以反射设置对象里的属性值）。因此SpringMVC就是通过`BeanWrapperImpl`将HTTP请求信息绑定到`User`对象上的。

`BeanWrapperImpl#setPropertyValues()`函数源码如下：

```java
public void setPropertyValues(PropertyValues pvs, boolean ignoreUnknown, boolean ignoreInvalid)
    throws BeansException {

    List<PropertyAccessException> propertyAccessExceptions = null;
    //获得每个属性的信息，在上面我们已经看到了pvs中是有一个List的，从HTTP请求中解析出的
    List<PropertyValue> propertyValues = (pvs instanceof MutablePropertyValues ?
                                          ((MutablePropertyValues) pvs).getPropertyValueList() : Arrays.asList(pvs.getPropertyValues()));
    //...
    try {
        //for循环遍历每个属性值，然后设置
        for (PropertyValue pv : propertyValues) {
            try {
                setPropertyValue(pv);
            }
            //... 异常处理
        }
    }
    //...
}
```

后面一层层的源码会很深，我们可以讲一些比较核心的部分：

在进行`setPropertyValue()`设置时会走进`AbstractNestablePropertyAccessor#processLocalProperty()`函数（`BeanWrapperImpl`继承自`AbstractNestablePropertyAccessor`）：

`AbstractNestablePropertyAccessor#processLocalProperty()`函数中比较重要的一行信息是：

```java
valueToApply = convertForProperty(
      tokens.canonicalName, oldValue, originalValue, ph.toTypeDescriptor());
```

其中`convertForProperty()`内容如下：

```java
protected Object convertForProperty(
      String propertyName, @Nullable Object oldValue, @Nullable Object newValue, TypeDescriptor td)
      throws TypeMismatchException {

   return convertIfNecessary(propertyName, oldValue, newValue, td.getType(), td);
}
```

走到这里的时候就可以看到与`@PathVariable`的一些共同之处，都需要使用类型转化器来转化数据。

这其实也容易理解，HTTP请求提交age=18，解出来的是字符串"18"，自然就需要转为int类型。

因此大体的流程为：通过HTTP请求解析form提交的信息，根据KV值解析出来多条，如：

```java
[
    "name": "张三",
    "age": "18",
    "pet.name": "狗子",
    "pet.age": "18"
]
```

接着调用默认构造方法，new出空壳的参数对象，再借用`BeanWrapperImpl`，将解析出的多条KV信息绑定到参数对象上。在绑定的过程中可能需要类型转化，比如字符串转整型，这时就需要借助类型转化器来转化数据，将转化后的数据再绑定到属性上。

另外，`BeanWrapperImpl`其实也是持有124个类型转化器的：

![](http://img.topjavaer.cn/img/202311262226320.png)



### 2.2 自定义类型转化器

可以看到，类型转化器会将HTTP请求信息转化为我们参数上对应的数据类型，我们之前也说了SpringBoot2.7.2版本中默认包含124个类型转化器，这些类型转化器大都是基本类型转化器，如String转Integer等。我们可以自定义类型转化器，来扩展Spring自带的转化器功能，举例如下：

```html
<form action="/user" method="post">
    <label>
        姓名：
        <input name="name" value="tom"/>
    </label> <br/>
    <label>
        年龄：
        <input name="age" value="18"/>
    </label> <br/>
    <label>
        宠物信息：
        <input name="pet" value="myDog,2"/>
    </label> <br/>
    <input type="submit" value="提交">
</form>
```

上例中，我们将`pet`信息写为**"狗子,18"**，也即我们想将**"狗子,18"**这一信息转为`Pet`对象，再或者说，我们想将字符串类型转为`Pet`对象。我们知道SpringBoot默认的数据转化器是没有这种功能的，此时就需要自定义类型转化器：

```java
public class MyPetConverter implements Converter<String, Pet> {
    @Override
    public Pet convert(String source) {
        Pet pet =  new Pet();
        String[] split = source.split(",");
        pet.setName(split[0]);
        pet.setAge(Integer.parseInt(split[1]));
        return pet;
    }
}
```

自定义类型转化器需要继承自`Convert`接口，我们这里的转化做的比较粗糙，大家明白就好。

接着我们就需要将自己的自定义转化器注册到SpringBoot中，**目前对于SpringMvc功能的增强可以通过自定义一个WebMvcConfigure Bean 或者继承WebMvcConfigure接口实现自己的对象注册到Bean中**。

```java
@Configuration
public class MyWebMvcConfigure implements WebMvcConfigurer {
    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addConverter(new MyPetConverter());
    }
}
```

这样SpringMVC在进行类型转化的时候，根据form表单提交的信息`pet=myDog,2`，SpringMVC根据key值pet找到User对象中属性是pet的属性，发现类型是Pet类型，然后就是将`myDog,2`字符串转为Pet类型，此时转化的源是String，目的是Pet类型，根据这一信息作为key值从converts这个map中获取转化器，很自然的就拿到了我们自己写的转化器，然后调用我们自己写的转化器将字符串转为Pet对象。

### 2.3 一些补充

我在B站看这块视频的时候看到很多弹幕会提一个问题，我们在2.1节举的例子中，为什么Controller层的方法没加`@RequestBody`注解？

也即

```java
@RestController
public class FormController {

    @PostMapping("/user")
    public String addUser(User user){
        return user.toString();
    }
}
```

这段代码中的参数User对象，为什么没有标@RequestBody注解。很多同学会认为只要是Post请求提交的对象，后端都应该是加`@RequestBody`注解的。

首先`@RequestBody`注解使用的场景是请求参数在请求体中并且是JSON格式（如果不了解你需要先学习基本的Spring MVC应用知识），而表单提交提交的数据虽然在请求体中，但不是JSON格式的数据，而是param1=value1¶m2=value2格式的数据，因此此处如果加`@RequestBody`注解会无法进来，从这也可以看出，这两种情况是使用不同的参数解析器来解析的。

注：上面说的不是很贴切，`@RequestBody`注解虽然拿的是请求体中的数据，但并不一定是JSON，你完全可以这样写：

```java
@PostMapping("/user")
public String postUser(@RequestBody String json){
    return json;
}
```

这代表直接将请求体中所有的数据拿到作为一个字符串，这时请求体中到底传过来的是不是JSON都无所谓了。

但如果写出

```java
@PostMapping("/user")
public String postUser(@RequestBody User user){
    System.out.println(user);
    return user.toString();
}
```

则请求体中一定得是JSON格式的。

## 3. @RequestBody

### 3.1 源码分析

上面我们已经提了一嘴`@RequestBody`注解，这个注解主要是将HTTP请求协议体中的JSON数据转为我们的Java对象，举例如下：

```java
@RestController
public class RequestBodyController {

    @PostMapping("/user/2")
    public Object addUse(@RequestBody User user){
        return user;
    }
}
```

我们使用postman模拟发送请求如下：

![](http://img.topjavaer.cn/img/202311262227870.png)

很明显又是SpringMVC将HTTP请求体中的数据取出来，转为了我们的User对象并设置赋给了我们的参数，那么就来看看是哪个参数解析器做的工作：

打断点定位是哪个参数解析器的工作我们不再重复了，实际上是`RequestResponseBodyMethodProcessor`参数解析器，我们还是看两个内容，为什么它支持解析这种情况，以及它是如何解析的：

`supportsParameter()`源码如下：

```java
@Override
public boolean supportsParameter(MethodParameter parameter) {
   return parameter.hasParameterAnnotation(RequestBody.class);
}
```

可以看到很简单，就是判断参数上是否有`@RequestBody`注解，凡是有这个注解的就支持，我们的User对象上有这个注解，所以很明显，当前参数解析器能解析这种情况。

下面我们就看下`RequestResponseBodyMethodProcessor`是如何解析参数的：

```java
@Override
public Object resolveArgument(MethodParameter parameter, @Nullable ModelAndViewContainer mavContainer,
                              NativeWebRequest webRequest, @Nullable WebDataBinderFactory binderFactory) throws Exception {

    parameter = parameter.nestedIfOptional();
    //核心的参数解析
    Object arg = readWithMessageConverters(webRequest, parameter, parameter.getNestedGenericParameterType());
    //...

    return adaptArgumentIfNecessary(arg, parameter);
}
```

`readWithMessageConverters()`函数会将HTTP请求体中的JSON转为我们的Java对象，其源码如下：

```java
@Nullable
protected <T> Object readWithMessageConverters(HttpInputMessage inputMessage, MethodParameter parameter,
                                               Type targetType) throws IOException, HttpMediaTypeNotSupportedException, HttpMessageNotReadableException {

    //拿到请求类型
    MediaType contentType;
    boolean noContentType = false;
    try {
        contentType = inputMessage.getHeaders().getContentType();
    }
    //...
    
    //拿到我们的参数类型和Controller类型
    Class<?> contextClass = parameter.getContainingClass();
    Class<T> targetClass = (targetType instanceof Class ? (Class<T>) targetType : null);
    //...

    //拿到HTTP请求类型
    HttpMethod httpMethod = (inputMessage instanceof HttpRequest ? ((HttpRequest) inputMessage).getMethod() : null);
    Object body = NO_VALUE;

    EmptyBodyCheckingHttpInputMessage message = null;
    try {
        message = new EmptyBodyCheckingHttpInputMessage(inputMessage);
        
        //开始遍历所有的HttpMessageConverter，看看谁支持将当前http请求内容转为我们的参数
        for (HttpMessageConverter<?> converter : this.messageConverters) {
            Class<HttpMessageConverter<?>> converterType = (Class<HttpMessageConverter<?>>) converter.getClass();
            GenericHttpMessageConverter<?> genericConverter =
                (converter instanceof GenericHttpMessageConverter ? (GenericHttpMessageConverter<?>) converter : null);
            if (genericConverter != null ? genericConverter.canRead(targetType, contextClass, contentType) :
                //核心就是这个canRead，与我们之前的参数解析器的support()功能一致
                (targetClass != null && converter.canRead(targetClass, contentType))) {
                if (message.hasBody()) {
                    HttpInputMessage msgToUse =
                        getAdvice().beforeBodyRead(message, parameter, targetType, converterType);
                    //找到HttpMessageConverter后调用read方法进行转化
                    body = (genericConverter != null ? genericConverter.read(targetType, contextClass, msgToUse) :
                            ((HttpMessageConverter<T>) converter).read(targetClass, msgToUse));
                    body = getAdvice().afterBodyRead(body, msgToUse, parameter, targetType, converterType);
                }
                else {
                    body = getAdvice().handleEmptyBody(null, message, parameter, targetType, converterType);
                }
                break;
            }
        }
    }
    //...异常捕捉与日志记录

    return body;
}
```

能够看到，这里依然是策略模式的使用，策略的接口是`HttpMessageConverter`，翻译过来即Http消息转化器。`RequestResponseBodyMethodProcessor`根据请求的**content-type**和我们的参数以及Controller对象类型等信息挨个询问每个消息转化器是否支持解析当前HTTP消息。在这里我们的content-type是**application/json**。

`RequestResponseBodyMethodProcessor`对象持有多个`HttpMessageConverter`，其中属性`messageConverters`是个`List<HttpMessageConverter>`。SpringBoot2.7.2版本默认情况下`messageConverters`内有10个`HttpMessageConverter`实现对象

![](http://img.topjavaer.cn/img/202311262227622.png)

通过名字不难看出`ByteArrayHttpMessageConverter`是用来解析byte数组的，`StringHttpMessageConverter`是用来解析字符串的，`MappingJackson2HttpMessageConverter`对象是用来转化JSON数据的，`Jaxb2RootElementHttpMessageConverter`是用来解析xml的。

打断点不难发现，`MappingJackson2HttpMessageConverter`解析器可以解析我们的请求，其判断自己是否能解析的代码如下：

```java
public boolean canRead(Type type, @Nullable Class<?> contextClass, @Nullable MediaType mediaType) {
    //先判断是不是自己能支持的mediaType，这里我们的mediaType是application/json
    if (!canRead(mediaType)) {
        return false;
    }
    //得到参数类型，其实就是我们的User.class
    JavaType javaType = getJavaType(type, contextClass);
    
    //得到ObjectMapper，jackson的核心组件
    ObjectMapper objectMapper = selectObjectMapper(javaType.getRawClass(), mediaType);
    if (objectMapper == null) {
        return false;
    }
    AtomicReference<Throwable> causeRef = new AtomicReference<>();
    //判断当前对象是否能序列化
    if (objectMapper.canDeserialize(javaType, causeRef)) {
        return true;
    }
    logWarningIfNecessary(javaType, causeRef.get());
    return false;
}
```

`MappingJackson2HttpMessageConverter`支持两种mediaType：**application/json**和**application/\*+json**

![](http://img.topjavaer.cn/img/202311262227182.png)

我们发的HTTP请求content-type是**application/json**，同时我们的Java对象还支持序列化，因此自然返回true。

知道了`MappingJackson2HttpMessageConverter`为什么能够解析，再看`MappingJackson2HttpMessageConverter`是如何解析的：

```java
public Object read(Type type, @Nullable Class<?> contextClass, HttpInputMessage inputMessage)
    throws IOException, HttpMessageNotReadableException {
    //拿到我们的参数类型
    JavaType javaType = getJavaType(type, contextClass);
    //传参Java类型和Http输入信息
    return readJavaType(javaType, inputMessage);
}
```



```java
private Object readJavaType(JavaType javaType, HttpInputMessage inputMessage) throws IOException {
    //拿到http请求的content-type和charset
    MediaType contentType = inputMessage.getHeaders().getContentType();
    Charset charset = getCharset(contentType);

    //拿到ObjectMapper
    ObjectMapper objectMapper = selectObjectMapper(javaType.getRawClass(), contentType);
    //...

    //判断是不是unicode编码类型
    boolean isUnicode = ENCODINGS.containsKey(charset.name()) ||
        "UTF-16".equals(charset.name()) ||
        "UTF-32".equals(charset.name());
    try {
        InputStream inputStream = StreamUtils.nonClosing(inputMessage.getBody());
        //....

        //由于我们的请求类型是UTF-8，因此会进入if分支
        if (isUnicode) {
            //直接调用objectMapper将HTTP输入流转为我们的java对象
            return objectMapper.readValue(inputStream, javaType);
        }
        //...
    }
    //...异常捕捉
}
```

其实就是拿到`ObjectMappper`然后调用`ObjectMappper`来解析JSON。

### 3.2 一些总结

这样其实我们就基本分析完了参数解析器`RequestResponseBodyMethodProcessor`处理流程的源码，首先`RequestResponseBodyMethodProcessor`会解析所有标注了`@RequestBody`注解的参数，其次在解析的时候，`RequestResponseBodyMethodProcessor`内部持有多个`HttpMessageConverter`，`RequestResponseBodyMethodProcessor`会挨个遍历每个`HttpMessageConverter`询问其是否能够解析，`HttpMessageConverter`一般会根据请求的**content-type**和要转化的Java对象来判断自己是否能解析，如我们的`MappingJackson2HttpMessageConverter`只能解析请求的content-type是**application/json**和**application/\*+json**的。拿到`HttpMessageConverter`就可以直接进行解析了。**可以看到我们之前对于`@RequestBody`注解的理解比较片面，认为前端必须要传入JSON，然后它就会被解析为Java对象，现在看了源码会发现前端能传很多格式可以被`@RequestBody`解析，比如xml。**

### 3.3 自定义HttpMessageConverter

与自定义类型转化器一样，我们也可以自定义消息转化器。一个消息转化器往往是解析一种（或多种）mediaType类型下的HTTP请求，不同的mediaType的HTTP请求内容格式也不相同，比如application/json格式就是JSON类型，application-xml格式就是xml类型。

既然要自定义`HttpMessageConverter`，就使用自定义的media-type：**application-dabin**

![](http://img.topjavaer.cn/img/202311262228041.png)

同时要求这种media-type下前端传过来的参数只有value，没有key，且value之间逗号隔开，比如前端传过来的请求体是：

![](http://img.topjavaer.cn/img/202311262228829.png)

这时为保证我们的Controller层依然能够正常接收前端的请求，就需要自定义一个消息转化器，来专门解析**application-dabin**这种mediaType的请求：



```java
static class MyHttpMessageConverter implements HttpMessageConverter<Object>{
    private final MediaType mediaType = new MediaType("application","dabin");

    @Override
    public boolean canRead(Class<?> clazz, MediaType mediaType) {
        return this.mediaType.includes(mediaType) && clazz == User.class;
    }

    @Override
    public boolean canWrite(Class<?> clazz, MediaType mediaType) {
        //先不关心写
        return false;
    }

    @Override
    public List<MediaType> getSupportedMediaTypes() {
        //先不关心
        return null;
    }

    @Override
    public Object read(Class<?> clazz, HttpInputMessage inputMessage) throws IOException, HttpMessageNotReadableException {
        User user = new User();

        int available = inputMessage.getBody().available();
        byte[] bytes = new byte[available];
        inputMessage.getBody().read(bytes);
        String[] split = new String(bytes).split(",");
        user.setName(split[0]);
        user.setAge(Integer.parseInt(split[1]));
        Pet pet = new Pet();
        pet.setName(split[2]);
        pet.setAge(Integer.parseInt(split[3]));
        user.setPet(pet);
        return user;
    }

    @Override
    public void write(Object o, MediaType contentType, HttpOutputMessage outputMessage) throws IOException, HttpMessageNotWritableException {
        //先不关心写
    }
}
```

我们主要实现了`canRead()`和`read()`方法，实现的源码比较简单，这里不再解释。

然后我们将这个自定义的消息转化器加入到Spring中：

```java
@Configuration
public class MyWebMvcConfigure implements WebMvcConfigurer {
    @Override
    public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
        converters.add(new MyHttpMessageConverter());
    }
}
```

根据前面的postman截图发送消息，打断点可以看到`RequestResponseBodyMethodProcessor`的`messageConverters`已经有了11个实现类，其中就包含我们自定义的消息转化器。

![](http://img.topjavaer.cn/img/202311262228331.png)



同样，我们的Controller层依然可以正常接收到参数：

![](http://img.topjavaer.cn/img/202311262228197.png)



## 4. @ResponseBody

### 4.1 源码分析

前面我们看的都是参数解析器的源码，现在我们看下返回值处理器的源码，从我们使用最频繁的`@ResponseBody`说起，很多同学知道的是`@ResponseBody`会将我们返回给请求的对象转为JSON写出到HTTP响应。现在我们来看这一功能是如何实现的。

我们知道在执行完HandlerMethod拿到返回值的时候，SpringMVC会使用返回值处理器来处理返回值：

```java
this.returnValueHandlers.handleReturnValue(
      returnValue, getReturnValueType(returnValue), mavContainer, webRequest);
```

而处理返回的源码为：

```java
public void handleReturnValue(@Nullable Object returnValue, MethodParameter returnType,
      ModelAndViewContainer mavContainer, NativeWebRequest webRequest) throws Exception {

   HandlerMethodReturnValueHandler handler = selectHandler(returnValue, returnType);
   if (handler == null) {
      throw new IllegalArgumentException("Unknown return value type: " + returnType.getParameterType().getName());
   }
   handler.handleReturnValue(returnValue, returnType, mavContainer, webRequest);
}


private HandlerMethodReturnValueHandler selectHandler(@Nullable Object value, MethodParameter returnType) {
    boolean isAsyncValue = isAsyncReturnValue(value, returnType);
    for (HandlerMethodReturnValueHandler handler : this.returnValueHandlers) {
        if (isAsyncValue && !(handler instanceof AsyncHandlerMethodReturnValueHandler)) {
            continue;
        }
        if (handler.supportsReturnType(returnType)) {
            return handler;
        }
    }
    return null;
}
```

这些内容我们之前都看过，策略模式，选择一个能处理的`HandlerMethodReturnValueHandler`进行处理。

为了源码分析的顺序，我们依然举个例子：

编写后端：

```java
@RestController
public class ResponseBodyController {
    @GetMapping("/user/3")
    public User getUser(){
        User user = new User();
        user.setName("Tom");
        user.setAge(18);
        Pet pet = new Pet();
        pet.setName("myDog");
        pet.setAge(2);
        user.setPet(pet);
        return user;
    }
}
```

通过PostMan发送请求：

![](http://img.topjavaer.cn/img/202311262229456.png)



可以看到我们后端返回的是一个Java对象，前端拿到的是一个JSON。这肯定是SpringMVC帮我们做了处理，根据前面的源码，很容易打断点定位到能处理这个返回的是`RequestResponseBodyMethodProcessor`返回值处理器（是的，又是它，我们在看`@RequestBody`注解源码的时候也是它，它既是参数解析器也是返回值处理器）。

#### 4.1.1 RequestResponseBodyMethodProcessor

同样，我们先看它为什么能处理这个返回，再看它是如何处理返回的：

`supportsReturnType()`源码如下：

```java
@Override
public boolean supportsReturnType(MethodParameter returnType) {
   return (AnnotatedElementUtils.hasAnnotation(returnType.getContainingClass(), ResponseBody.class) ||
         returnType.hasMethodAnnotation(ResponseBody.class));
}
```

可以看到就是判断方法所在的类上是否包含`@ResponseBody`注解和方法本身上是否包含`@ResponseBody`注解，由于`@RestController`是个复合注解，由`@Controller`与`@ResponseBody`组成，因此我们的返回值可以被`RequestResponseBodyMethodProcessor`处理。下面我们就看下`RequestResponseBodyMethodProcessor`是如何处理返回值的：

```java
public void handleReturnValue(@Nullable Object returnValue, MethodParameter returnType,
      ModelAndViewContainer mavContainer, NativeWebRequest webRequest)
      throws IOException, HttpMediaTypeNotAcceptableException, HttpMessageNotWritableException {

   mavContainer.setRequestHandled(true);
   ServletServerHttpRequest inputMessage = createInputMessage(webRequest);
   ServletServerHttpResponse outputMessage = createOutputMessage(webRequest);

   // Try even with null return value. ResponseBodyAdvice could get involved.
   writeWithMessageConverters(returnValue, returnType, inputMessage, outputMessage);
}
```

这里会走进`writeWithMessageConverters()`函数：

`writeWithMessageConverters()`的源码会相对比较多且复杂，在讲解源码前我们需要先讲一个东西叫**内容协商**。

#### 4.1.2 内容协商

我们之前在HTTP请求头中已经看到了**content-type**信息，这代表请求方会告诉服务端自己发来的数据是什么类型的数据，除此以外，HTTP还有另一个重要信息**accept**。

在发送HTTP请求的时候，浏览器会告诉服务器自己**支持**哪种数据的返回，这一信息会放在HTTP请求头的Accept字段。比如我们上面的Post表单提交，其Accept信息是：

![](http://img.topjavaer.cn/img/202311262229278.png)

上述代表当前浏览器可以接收(逗号分隔)

- text/html
- application/xhtml+xml
- application/xml;q=0.9
- image/webp
- image/apng
- */*;q=0.8
- application/signed-exchange;v=b3;q=0.9

这些类型的返回，其中q代表权重（关于权重我们一会再说）。

但是我们的**服务器往往也需要判断自己能够返回哪些类型，然后对服务器能返回的且浏览器能接收的这两个类型集合做交集，得到的结果就是服务器可以返回给浏览器的数据类型，这就是内容协商**。

#### 4.1.3 writeWithMessageConverters()

下面我们看下`writeWithMessageConverters()`的部分源码：

```java
protected <T> void writeWithMessageConverters(@Nullable T value, MethodParameter returnType,
                                              ServletServerHttpRequest inputMessage, ServletServerHttpResponse outputMessage)
    throws IOException, HttpMediaTypeNotAcceptableException, HttpMessageNotWritableException {

    Object body;
    Class<?> valueType;
    Type targetType;

    //...
    //得到返回结果的值和返回结果的类型
    body = value;
    valueType = getReturnValueType(body, returnType);
    targetType = GenericTypeResolver.resolveType(getGenericType(returnType), returnType.getContainingClass());

    //一些IO的处理...

    //首先说明MediaType类型翻译过来是媒体类型，其实就是我们前面说的Http Accept和Content-Type里写的那些东西
    //也就是我们前面说的返回给（浏览器支持的）Http的数据类型，下面有很多MediaType 不再赘述
    //selectedMediaType就是被选中的那个输出类型
    MediaType selectedMediaType = null;
    //判断用户是否自己设置了content-type，所谓自己设置了content-type也即我们自己指定的输出的mediaType
    MediaType contentType = outputMessage.getHeaders().getContentType();
    boolean isContentTypePreset = contentType != null && contentType.isConcrete();
    if (isContentTypePreset) {
        //... 日志
        //如果自己设置了输出的content-type就按用户自己设置的来，否则才内容协商
        selectedMediaType = contentType;
    }
    else {
        //这整个else都是内容协商，目的就是找到需要返回的mediaType
        HttpServletRequest request = inputMessage.getServletRequest();
        //acceptableTypes是浏览器可以接收的数据类型，也即从请求头里的Accept解析出的内容
        List<MediaType> acceptableTypes;
        try {
            //解析并获得浏览器可以接收的数据类型
            acceptableTypes = getAcceptableMediaTypes(request);
        }
        // ...异常处理
        
        //这里是获得服务器可以输出的数据类型
        List<MediaType> producibleTypes = getProducibleMediaTypes(request, valueType, targetType);
        
        //...异常处理
        
        //mediaTypesToUse是producibleTypes和acceptableType的交集，也即内容协商的结果
        //两层for循环遍历将两边都支持的数据类型放入mediaTypesToUse
        List<MediaType> mediaTypesToUse = new ArrayList<>();
        for (MediaType requestedType : acceptableTypes) {
            for (MediaType producibleType : producibleTypes) {
                if (requestedType.isCompatibleWith(producibleType)) {
                    mediaTypesToUse.add(getMostSpecificMediaType(requestedType, producibleType));
                }
            }
        }
        //...找不到可用media的异常处理
        
        //按权重排序
        MediaType.sortBySpecificityAndQuality(mediaTypesToUse);
        //遍历交集，从中确定一个输出的数据类型
        for (MediaType mediaType : mediaTypesToUse) {
            if (mediaType.isConcrete()) {
                selectedMediaType = mediaType;
                break;
            }
            else if (mediaType.isPresentIn(ALL_APPLICATION_MEDIA_TYPES)) {
                selectedMediaType = MediaType.APPLICATION_OCTET_STREAM;
                break;
            }
        }
        //...
    }
    //得到Http确定的输出类型后，开始将我们的返回值转化为这种输出类型
    //下面的代码我们一会再说
    if (selectedMediaType != null) {
        selectedMediaType = selectedMediaType.removeQualityValue();
        for (HttpMessageConverter<?> converter : this.messageConverters) {
            GenericHttpMessageConverter genericConverter = (converter instanceof GenericHttpMessageConverter ?
                                                            (GenericHttpMessageConverter<?>) converter : null);
            if (genericConverter != null ?
                ((GenericHttpMessageConverter) converter).canWrite(targetType, valueType, selectedMediaType) :
                converter.canWrite(valueType, selectedMediaType)) {
                body = getAdvice().beforeBodyWrite(body, returnType, selectedMediaType,
                                                   (Class<? extends HttpMessageConverter<?>>) converter.getClass(),
                                                   inputMessage, outputMessage);
                if (body != null) {
                    Object theBody = body;
                    LogFormatUtils.traceDebug(logger, traceOn ->
                                              "Writing [" + LogFormatUtils.formatValue(theBody, !traceOn) + "]");
                    addContentDispositionHeader(inputMessage, outputMessage);
                    if (genericConverter != null) {
                        genericConverter.write(body, targetType, selectedMediaType, outputMessage);
                    }
                    else {
                        ((HttpMessageConverter) converter).write(body, selectedMediaType, outputMessage);
                    }
                }
                else {
                    if (logger.isDebugEnabled()) {
                        logger.debug("Nothing to write: null body");
                    }
                }
                return;
            }
        }
    }

    if (body != null) {
        Set<MediaType> producibleMediaTypes =
            (Set<MediaType>) inputMessage.getServletRequest()
            .getAttribute(HandlerMapping.PRODUCIBLE_MEDIA_TYPES_ATTRIBUTE);

        if (isContentTypePreset || !CollectionUtils.isEmpty(producibleMediaTypes)) {
            throw new HttpMessageNotWritableException(
                "No converter for [" + valueType + "] with preset Content-Type '" + contentType + "'");
        }
        throw new HttpMediaTypeNotAcceptableException(getSupportedMediaTypes(body.getClass()));
    }
}
```

可以看到，得到selectedMediaType，也即得到了确定的Http输出类型(MediaType)后，就该将我们的输出值转为这个对应的类型数据了，但现在问题来了，要怎样转化呢？

`AbstractMessageConverterMethodArgumentResolver`（`RequestResponseBodyMethodProcessor`的父类）内部有一个属性叫

```java
protected final List<HttpMessageConverter<?>> messageConverters;
```

`HttpMessageConverter`的集合，这个接口我们上面讲过了HTTP消息转化器，但上面说的是将HTTP消息转为我们的Java对象，这里的作用是将Java对象转为我们的HTTP消息。对于`HttpMessageConverter`而言，HTTP转Java属于read，Java转HTTP属于write。

`HttpMessageConverter`接口源码如下：

```java
public interface HttpMessageConverter<T> {
    
    boolean canRead(Class<?> clazz, @Nullable MediaType mediaType);

    boolean canWrite(Class<?> clazz, @Nullable MediaType mediaType);

    List<MediaType> getSupportedMediaTypes();

    default List<MediaType> getSupportedMediaTypes(Class<?> clazz) {
        return (canRead(clazz, null) || canWrite(clazz, null) ?
                getSupportedMediaTypes() : Collections.emptyList());
    }

    T read(Class<? extends T> clazz, HttpInputMessage inputMessage)
        throws IOException, HttpMessageNotReadableException;
    
    void write(T t, @Nullable MediaType contentType, HttpOutputMessage outputMessage)
        throws IOException, HttpMessageNotWritableException;
}
```

其中`canRead`和`canWrite()`代表是否支持读取和写入。`read()`和`write()`代表进行读取和写入。

在默认情况下，`messageConverters`内有10个已经初始化的`HttpMessageConverter`（我们之前已经看到过了）：

![](http://img.topjavaer.cn/img/202311262229615.png)



它们的功能通过名字也很容易看出来，比如`ByteArrayHttpMessageConvert`是将byte数组转为Http数据输出，`MappingJackson2HttpMessageConverter`是将Java对象转为JSON然后通过HTTP输出。

我们的返回处理器会挨个遍历这10个消息转化器，询问它们是否支持写入，如果支持写入，那么就用这个消息处理器来写入，对应的源码便是刚才的下半部分：

```java
protected <T> void writeWithMessageConverters(@Nullable T value, MethodParameter returnType,
                                              ServletServerHttpRequest inputMessage, ServletServerHttpResponse outputMessage)
    throws IOException, HttpMediaTypeNotAcceptableException, HttpMessageNotWritableException {
    //...上面的源码我们已经说过了，这里不再贴出
    
    //得到Http确定的输出类型后，开始将我们的返回值转化为这种输出类型
    if (selectedMediaType != null) {
        //移除权重
        selectedMediaType = selectedMediaType.removeQualityValue();
        //遍历10个消息转化器
        for (HttpMessageConverter<?> converter : this.messageConverters) {
            GenericHttpMessageConverter genericConverter = (converter instanceof GenericHttpMessageConverter ?
                                                            (GenericHttpMessageConverter<?>) converter : null);
           //判断它们是否支持写入
            if (genericConverter != null ?
                ((GenericHttpMessageConverter) converter).canWrite(targetType, valueType, selectedMediaType) :
                converter.canWrite(valueType, selectedMediaType)) {
                body = getAdvice().beforeBodyWrite(body, returnType, selectedMediaType,
                                                   (Class<? extends HttpMessageConverter<?>>) converter.getClass(),
                                                   inputMessage, outputMessage);
                if (body != null) {
                    Object theBody = body;
                    LogFormatUtils.traceDebug(logger, traceOn ->
                                              "Writing [" + LogFormatUtils.formatValue(theBody, !traceOn) + "]");
                    addContentDispositionHeader(inputMessage, outputMessage);
                    //如果支持写入就调用write方法写入(写入到Http的响应体中)
                    if (genericConverter != null) {
                        genericConverter.write(body, targetType, selectedMediaType, outputMessage);
                    }
                    else {
                        ((HttpMessageConverter) converter).write(body, selectedMediaType, outputMessage);
                    }
                }
                else {
                    if (logger.isDebugEnabled()) {
                        logger.debug("Nothing to write: null body");
                    }
                }
                return;
            }
        }
    }

    if (body != null) {
        Set<MediaType> producibleMediaTypes =
            (Set<MediaType>) inputMessage.getServletRequest()
            .getAttribute(HandlerMapping.PRODUCIBLE_MEDIA_TYPES_ATTRIBUTE);

        if (isContentTypePreset || !CollectionUtils.isEmpty(producibleMediaTypes)) {
            throw new HttpMessageNotWritableException(
                "No converter for [" + valueType + "] with preset Content-Type '" + contentType + "'");
        }
        throw new HttpMediaTypeNotAcceptableException(getSupportedMediaTypes(body.getClass()));
    }
}
```

通过上面说的内容协商，我们已经知道`selectedMediaType`是**application/json**。然后打断点会得到`MappingJackson2HttpMessageConverter`消息转化器支持处理我们的返回结果。我们这里自然需要看两点内容了，为什么它支持写出，它又是如何写出的。

#### 4.1.4 MappingJackson2HttpMessageConverter

`canWrite()`源码如下：

```java
public boolean canWrite(Class<?> clazz, @Nullable MediaType mediaType) {
   if (!canWrite(mediaType)) {
      return false;
   }
   if (mediaType != null && mediaType.getCharset() != null) {
      Charset charset = mediaType.getCharset();
      if (!ENCODINGS.containsKey(charset.name())) {
         return false;
      }
   }
   ObjectMapper objectMapper = selectObjectMapper(clazz, mediaType);
   if (objectMapper == null) {
      return false;
   }
   AtomicReference<Throwable> causeRef = new AtomicReference<>();
   if (objectMapper.canSerialize(clazz, causeRef)) {
      return true;
   }
   logWarningIfNecessary(clazz, causeRef.get());
   return false;
}
```

可以看到与`canRead()`代码基本相同，就是判断要写出的mediaType自己是否支持，以及要写出的对象是否可以序列化。

`write()`源码如下：

```java
public final void write(final T t, @Nullable final Type type, @Nullable MediaType contentType,
                        HttpOutputMessage outputMessage) throws IOException, HttpMessageNotWritableException {

    final HttpHeaders headers = outputMessage.getHeaders();
    addDefaultHeaders(headers, t, contentType);
    //...
    //调用子类的writeInternal()
    writeInternal(t, type, outputMessage);
    //通过输出流写出
    outputMessage.getBody().flush();
}

protected void writeInternal(Object object, @Nullable Type type, HttpOutputMessage outputMessage)
    throws IOException, HttpMessageNotWritableException {

    //得到输出的mediaType和编码格式
    MediaType contentType = outputMessage.getHeaders().getContentType();
    JsonEncoding encoding = getJsonEncoding(contentType);
    
    //得到返回的对象类型
    Class<?> clazz = (object instanceof MappingJacksonValue ?
                      ((MappingJacksonValue) object).getValue().getClass() : object.getClass());
    //拿到ObjectMapper
    ObjectMapper objectMapper = selectObjectMapper(clazz, contentType);

    //...

    //拿到HTTP请求输出流
    OutputStream outputStream = StreamUtils.nonClosing(outputMessage.getBody());
    
    //下面的内容都是使用jackson将参数写出
    //笔者不太熟悉jackson的api，因此只能写到这里
    try (JsonGenerator generator = objectMapper.getFactory().createGenerator(outputStream, encoding)) {
        writePrefix(generator, object);

        Object value = object;
        Class<?> serializationView = null;
        FilterProvider filters = null;
        JavaType javaType = null;

        if (object instanceof MappingJacksonValue) {
            MappingJacksonValue container = (MappingJacksonValue) object;
            value = container.getValue();
            serializationView = container.getSerializationView();
            filters = container.getFilters();
        }
        if (type != null && TypeUtils.isAssignable(type, value.getClass())) {
            javaType = getJavaType(type, null);
        }

        ObjectWriter objectWriter = (serializationView != null ?
                                     objectMapper.writerWithView(serializationView) : objectMapper.writer());
        if (filters != null) {
            objectWriter = objectWriter.with(filters);
        }
        if (javaType != null && javaType.isContainerType()) {
            objectWriter = objectWriter.forType(javaType);
        }
        SerializationConfig config = objectWriter.getConfig();
        if (contentType != null && contentType.isCompatibleWith(MediaType.TEXT_EVENT_STREAM) &&
            config.isEnabled(SerializationFeature.INDENT_OUTPUT)) {
            objectWriter = objectWriter.with(this.ssePrettyPrinter);
        }
        objectWriter.writeValue(generator, value);

        writeSuffix(generator, object);
        generator.flush();
    }
    //异常处理...
}
```

核心思想还是拿到jackson的ObjectMapper将Java对象转为JSON再写出到HTTP输出流。

### 4.2 XML

看源码的过程中我们其实是看到SpringMVC是包含有xml消息转化器的，但xml消息转化器要想生效，还需要导入一个依赖包。

```xml
<dependency>
    <groupId>com.fasterxml.jackson.dataformat</groupId>
    <artifactId>jackson-dataformat-xml</artifactId>
</dependency>
```

此时我们的Controller层方法不变

```java
@PostMapping("/user")
public User postUser(@RequestBody User user){
    return user;
}
```

但这时的Http响应体返回为：

![](http://img.topjavaer.cn/img/202311262230595.png)

可以看到是一个xml类型的数据。

我们之前说过，内容协商是根据浏览器能处理的请求和我们服务器能返回的请求共同再根据权重排序共同得出来的结果。上面的浏览器请求中，我们返回的是`application/json`格式的数据，这是匹配到的浏览器的`*/*`类型，但这种类型只有0.8的权重，如果我们的服务器支持xml类型的返回结果，`application/xml;q=0.9`是0.9的权重，此时就会按xml转化返回。

并且由于我们支持xml类型的输出了，因此在内容协商的时候得到了服务端更多可支持的输出类型。

`getProducibleMediaTypes()`获得服务端支持的输出类型由之前的4种：

```java
List<MediaType> producibleTypes = getProducibleMediaTypes(request, valueType, targetType);
```



![](http://img.topjavaer.cn/img/202311262230521.png)



变为了7种（虽然是10个，但有3个重复的）

![](http://img.topjavaer.cn/img/202311262230388.png)



多出来的`application/xml`优先级肯定高于之前的`application/json`这种，因此SpringBoot会按xml去解析。

这时我们就要问一句，为什么多出来了几种解析方式，我们点进`getProducibleMediaTypes()`函数源码：

```java
protected List<MediaType> getProducibleMediaTypes(
      HttpServletRequest request, Class<?> valueClass, @Nullable Type targetType) {

   Set<MediaType> mediaTypes =
         (Set<MediaType>) request.getAttribute(HandlerMapping.PRODUCIBLE_MEDIA_TYPES_ATTRIBUTE);
   if (!CollectionUtils.isEmpty(mediaTypes)) {
      return new ArrayList<>(mediaTypes);
   }
   List<MediaType> result = new ArrayList<>();
   for (HttpMessageConverter<?> converter : this.messageConverters) {
      if (converter instanceof GenericHttpMessageConverter && targetType != null) {
         if (((GenericHttpMessageConverter<?>) converter).canWrite(targetType, valueClass, null)) {
            result.addAll(converter.getSupportedMediaTypes(valueClass));
         }
      }
      else if (converter.canWrite(valueClass, null)) {
         result.addAll(converter.getSupportedMediaTypes(valueClass));
      }
   }
   return (result.isEmpty() ? Collections.singletonList(MediaType.ALL) : result);
}
```

其源码思路比较简单，就是遍历每个`HttpMessageConverter`，判断其是否支持写入，如果支持写入的话，顺便也将其支持的mediaType拿到，所有支持写入的`HttpMessageConverter`对应的mediaType集合就是服务器支持的medisType。

不同的是由于xml解析依赖的导入，现在SpringBoot的`messageConverters`集合多了两种类型（同时也少了一个）：

![](http://img.topjavaer.cn/img/202311262230063.png)

这俩是同一个类，都是`MappingJackson2XmlHttpMessageConverter`，它们是用于支持xml写出的，它们支持的mediaType为：

```java
public MappingJackson2XmlHttpMessageConverter(ObjectMapper objectMapper) {
   super(objectMapper, new MediaType("application", "xml", StandardCharsets.UTF_8),
         new MediaType("text", "xml", StandardCharsets.UTF_8),
         new MediaType("application", "*+xml", StandardCharsets.UTF_8));
   Assert.isInstanceOf(XmlMapper.class, objectMapper, "XmlMapper required");
}
```

共三个mediaType：

- `application/xml;charset=UTF-8`
- `text/xml;charset=UTF-8`
- `application/*+xml;charset=UTF-8`

也就是我们上面截图多出来的那三个。

根据排序后，由于xml优先级高于json，自然`selectMedia`就是`application/xhtml+xml`

能处理`application/xhtml+xml`类型的消息解析器自然是新加进来的`MappingJackson2XmlHttpMessageConverter`。

在这里就可以看到虽然后端业务代码同样返回的是User对象，但由于HTTP请求Accept字段的不同，就可以解析为不同的格式，有人想要json就将Accept写为**application/json**，有人想要xml就将Accept写为**application/xhtml+xml**

这一做法的应用场景还是非常多的，比如不同的客户端想要不同的数据结构，浏览器想要json格式，而app想要xml格式，客户端只需要在自己的请求头的accept字段修改接收的数据类型或给要接收的数据类型排较高权重即可实现自适应返回数据。

还有类似的应用场景，比如我们自己写一个消息转化器，将返回的结果转为excel表格作为导出。同一个查询接口，前端可以根据请求accepet的不同，将json设置最高，可以查回来json结构直接展示。也可以将Accept设置为excel文件（自定义的mediaType），此时后端就会使用自定义消息转化器按文件输出。

刚才我们说了请求端可以修改accept的属性来决定返回类型，但有时修改accept会比较麻烦，比如对于表单提交。SpringBoot针对这种情况给出了可以通过请求参数来获得客户端想返回的数据类型，通过属性`spring.mvc.contentnegotiation.favorParameter`来开启这一功能

```yaml
spring:
  mvc:
    content negotiation:
      favor-parameter: true
```

此时我们只需要在请求参数中加上format参数，即可指定客户端想要的数据类型，如：

`ip:port/user?format=xml` 代表以xml形式返回

`ip:port/user?format=json`代表以json形式返回

### 4.3 为什么导入XML依赖就多了xml的消息转化器

这里再补充一个细节，我们之前看到，在项目启动的时候，`messageConverters`内就已经加载了很多实现好的消息转化器，并且当我们导入`jackson-dataformat-xml`依赖时，又会自动增加xml的消息转化器，这是怎么做到的？

首先根据SpringBoot的自动装配我们知道，有关Spring Mvc的所有装配都在`WebMvcAutoConfiguration`下，在这个类下。在这个类下有一个继承自`WebMvcConfigurer`的方法

```java
@Override
public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
   this.messageConvertersProvider
         .ifAvailable((customConverters) -> converters.addAll(customConverters.getConverters()));
}
```

在这里SpringBoot装配进了一些消息转化器，其中`customConverters.getConverters()`源码为：

```java
public class HttpMessageConverters implements Iterable<HttpMessageConverter<?>> {
    //...
    public List<HttpMessageConverter<?>> getConverters() {
        return this.converters;
    }
    //...
}
```

这里的`converters`属性是在构造方法中传进来的，也即一开始new的时候构造好的，构造方法如下：

```java
public class HttpMessageConverters implements Iterable<HttpMessageConverter<?>> {
    //...

    public HttpMessageConverters(HttpMessageConverter<?>... additionalConverters) {
        this(Arrays.asList(additionalConverters));
    }
    public HttpMessageConverters(Collection<HttpMessageConverter<?>> additionalConverters) {
        this(true, additionalConverters);
    }
    public HttpMessageConverters(boolean addDefaultConverters, Collection<HttpMessageConverter<?>> converters) {
        List<HttpMessageConverter<?>> combined = getCombinedConverters(converters,
                                                                       addDefaultConverters ? getDefaultConverters() : Collections.emptyList());
        combined = postProcessConverters(combined);
        this.converters = Collections.unmodifiableList(combined);
    }
    //...
}
```

可以看到构造方法会执行一个叫`getDefaultConverters()`方法，这个方法会获得默认的`HttpMessageConverter`

```javascript
public class HttpMessageConverters implements Iterable<HttpMessageConverter<?>> {
    //...
    private List<HttpMessageConverter<?>> getDefaultConverters() {
        List<HttpMessageConverter<?>> converters = new ArrayList<>();
        if (ClassUtils.isPresent("org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport",null)) {
            converters.addAll(new WebMvcConfigurationSupport() {
                public List<HttpMessageConverter<?>> defaultMessageConverters() {
                return super.getMessageConverters();
                }
            }.defaultMessageConverters());
        } else {
                converters.addAll(new RestTemplate().getMessageConverters());
        }
    reorderXmlConvertersToEnd(converters);
    return converters;
    }
    //...
}
```

其中`getDefaultConverters()`又会调用`super.getMessageConverters();`

```java
public class WebMvcConfigurationSupport implements ApplicationContextAware, ServletContextAware {
    //...
    protected final List<HttpMessageConverter<?>> getMessageConverters() {
        if (this.messageConverters == null) {
            this.messageConverters = new ArrayList<>();
            configureMessageConverters(this.messageConverters);
            if (this.messageConverters.isEmpty()) {
                addDefaultHttpMessageConverters(this.messageConverters);
            }
            extendMessageConverters(this.messageConverters);
        }
        return this.messageConverters;
    }
    //...
}
```

上面的代码又会调用`addDefaultHttpMessageConverters(this.messageConverters);`

```java
public class WebMvcConfigurationSupport implements ApplicationContextAware, ServletContextAware {
    //...
    protected final void addDefaultHttpMessageConverters(List<HttpMessageConverter<?>> messageConverters) {
        messageConverters.add(new ByteArrayHttpMessageConverter());
        messageConverters.add(new StringHttpMessageConverter());
        messageConverters.add(new ResourceHttpMessageConverter());
        messageConverters.add(new ResourceRegionHttpMessageConverter());
        if (!shouldIgnoreXml) {
            try {
                messageConverters.add(new SourceHttpMessageConverter<>());
            }
            catch (Throwable ex) {
                // Ignore when no TransformerFactory implementation is available...
            }
        }
        messageConverters.add(new AllEncompassingFormHttpMessageConverter());

        if (romePresent) {
            messageConverters.add(new AtomFeedHttpMessageConverter());
            messageConverters.add(new RssChannelHttpMessageConverter());
        }

        if (!shouldIgnoreXml) {
            if (jackson2XmlPresent) {
                Jackson2ObjectMapperBuilder builder = Jackson2ObjectMapperBuilder.xml();
                if (this.applicationContext != null) {
                    builder.applicationContext(this.applicationContext);
                }
                messageConverters.add(new MappingJackson2XmlHttpMessageConverter(builder.build()));
            }
            else if (jaxb2Present) {
                messageConverters.add(new Jaxb2RootElementHttpMessageConverter());
            }
        }

        if (kotlinSerializationJsonPresent) {
            messageConverters.add(new KotlinSerializationJsonHttpMessageConverter());
        }
        if (jackson2Present) {
            Jackson2ObjectMapperBuilder builder = Jackson2ObjectMapperBuilder.json();
            if (this.applicationContext != null) {
                builder.applicationContext(this.applicationContext);
            }
            messageConverters.add(new MappingJackson2HttpMessageConverter(builder.build()));
        }
        else if (gsonPresent) {
            messageConverters.add(new GsonHttpMessageConverter());
        }
        else if (jsonbPresent) {
            messageConverters.add(new JsonbHttpMessageConverter());
        }

        if (jackson2SmilePresent) {
            Jackson2ObjectMapperBuilder builder = Jackson2ObjectMapperBuilder.smile();
            if (this.applicationContext != null) {
                builder.applicationContext(this.applicationContext);
            }
            messageConverters.add(new MappingJackson2SmileHttpMessageConverter(builder.build()));
        }
        if (jackson2CborPresent) {
            Jackson2ObjectMapperBuilder builder = Jackson2ObjectMapperBuilder.cbor();
            if (this.applicationContext != null) {
                builder.applicationContext(this.applicationContext);
            }
            messageConverters.add(new MappingJackson2CborHttpMessageConverter(builder.build()));
        }
    }
    //...
}
```

从上面的代码可以看到默认情况下导入了`ByteArrayHttpMessageConverter`、`StringHttpMessageConverter`、`ResourceHttpMessageConverter`、`ResourceRegionHttpMessageConverter`、`AllEncompassingFormHttpMessageConverter`，这些我们都在之前见到了，还有一些需要根据条件判断是否应该导入的，比如`MappingJackson2HttpMessageConverter`、`MappingJackson2XmlHttpMessageConverter`。

我们之前是导入了xml解析包，就自动添加了`MappingJackson2XmlHttpMessageConverter`消息转化器，这是因为此时`jackson2XmlPresent`属性为true，而`jackson2XmlPresent`属性的判断逻辑是：

```java
jackson2XmlPresent = ClassUtils.isPresent("com.fasterxml.jackson.dataformat.xml.XmlMapper", classLoader);
```

很简单，就是判断类`com.fasterxml.jackson.dataformat.xml.XmlMapper`是否存在，如果存在`jackson2XmlPresent`就为true，从而`MappingJackson2XmlHttpMessageConverter`就会被创建和加载。

### 4.4 自定义HttpMessageConverter

我们在上一章`@RequestBody`中已经讲了自定义HttpMessageConverter，那时我们自定义了一个消息转化器，只不过它是用来解析HTTP请求的，现在我们需要自定义一个解析器是处理返回HTTP响应的。我们可以看下之前定的自定义消息转化器：

```java
static class MyHttpMessageConverter implements HttpMessageConverter<Object>{
    private final MediaType mediaType = new MediaType("application","dabin");

    @Override
    public boolean canRead(Class<?> clazz, MediaType mediaType) {
        return this.mediaType.includes(mediaType) && clazz == User.class;
    }

    @Override
    public boolean canWrite(Class<?> clazz, MediaType mediaType) {
        //先不关心写
        return false;
    }

    @Override
    public List<MediaType> getSupportedMediaTypes() {
        //先不关心
        return null;
    }

    @Override
    public Object read(Class<?> clazz, HttpInputMessage inputMessage) throws IOException, HttpMessageNotReadableException {
        User user = new User();

        int available = inputMessage.getBody().available();
        byte[] bytes = new byte[available];
        inputMessage.getBody().read(bytes);
        String[] split = new String(bytes).split(",");
        user.setName(split[0]);
        user.setAge(Integer.parseInt(split[1]));
        Pet pet = new Pet();
        pet.setName(split[2]);
        pet.setAge(Integer.parseInt(split[3]));
        user.setPet(pet);
        return user;
    }

    @Override
    public void write(Object o, MediaType contentType, HttpOutputMessage outputMessage) throws IOException, HttpMessageNotWritableException {
        //先不关心写
    }
}
```

上面的`canWrite()`、`write()`和`getSupportedMediaTypes()`都是写出的时候需要实现的，我们现在就来实现：

同样我们自定义一种mediaType叫`application/dabin`，然后自定义消息转化器，将Java对象按`application/dabin`的格式写出：

```java
static class MyHttpMessageConverter implements HttpMessageConverter<Object>{
    private final MediaType mediaType = new MediaType("application","dabin");

    @Override
    public boolean canRead(Class<?> clazz, MediaType mediaType) {
        return this.mediaType.includes(mediaType) && clazz == User.class;
    }

    @Override
    public boolean canWrite(Class<?> clazz, MediaType mediaType) {
        return mediaType== null ||this.mediaType.includes(mediaType) && clazz == User.class;
    }

    @Override
    public List<MediaType> getSupportedMediaTypes() {
        return Collections.singletonList(mediaType);
    }

    @Override
    public Object read(Class<?> clazz, HttpInputMessage inputMessage) throws IOException, HttpMessageNotReadableException {
        User user = new User();

        int available = inputMessage.getBody().available();
        byte[] bytes = new byte[available];
        inputMessage.getBody().read(bytes);
        String[] split = new String(bytes).split(",");
        user.setName(split[0]);
        user.setAge(Integer.parseInt(split[1]));
        Pet pet = new Pet();
        pet.setName(split[2]);
        pet.setAge(Integer.parseInt(split[3]));
        user.setPet(pet);
        return user;
    }

    @Override
    public void write(Object o, MediaType contentType, HttpOutputMessage outputMessage) throws IOException, HttpMessageNotWritableException {
        if(o instanceof User){
            User user = (User) o;
            String stringBuilder = user.getName() + "," +
                user.getAge() + "," +
                user.getPet().getName() + "," +
                user.getPet().getAge();
            outputMessage.getBody().write(stringBuilder.getBytes());
        }
    }
}
```

同理，加这个convert加入到`HttpMessageConverters`中：

```java
@Bean
public WebMvcConfigurer webMvcConfigurer(){
    return new WebMvcConfigurer() {
        @Override
        public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
           converters.add(new MyHttpMessageConverter());
        }
    }
}
```

我们依然使用`application/dabin`的content-type方式提交，但同时将Accept也设置为`application/dabin`：

此时，我们的返回结果为

![](http://img.topjavaer.cn/img/202311262232506.png)

可以看到数据确实按照我们想要的结果类型返回了，也就是根据我们能处理的MedisType走到了我们自定义的消息转化器。

如果不想修改Http头的Accept信息，而是像我们之前那样，从参数中的format来决定Media类型，之前通过yml配置开启的方式在这种情况下已经不适用，因为那种方式只支持format=json和format=xml两种类型，我们现在想要类似于format=dabin这种类型，此时就需要自定义内容协商策略。

```java
 @Bean
public WebMvcConfigurer webMvcConfigurer(){
    return new WebMvcConfigurer() {
        @Override
        public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
            HashMap<String, MediaType> map = new HashMap<>(4);
            map.put("dabin",new MediaType("application","dabin"));
            ParameterContentNegotiationStrategy myContentNegotiationStrategy = new ParameterContentNegotiationStrategy(map);
            configurer.strategies(Collections.singletonList(myContentNegotiationStrategy));
        }
    }
}
```

这种情况下，我们就可以通过`ip:port/user?format=dabin`的形式走到自定义消息转化器了

但这种方式有个问题，就是我们自定义的消息转化器会覆盖了SpringBoot自带的消息转化器，那么此时在协议头中的Accept等信息都无法处理了，这肯定不是我们想看到的，一种比较危险的办法是我们自己再把它new出来加进去：

```java
@Bean
public WebMvcConfigurer webMvcConfigurer(){
    return new WebMvcConfigurer() {
        @Override
        public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
            HashMap<String, MediaType> map = new HashMap<>(4);
            map.put("dabin",new MediaType("application","dabin"));
            ParameterContentNegotiationStrategy myContentNegotiationStrategy = new ParameterContentNegotiationStrategy(map);
            HeaderContentNegotiationStrategy headerContentNegotiationStrategy = new HeaderContentNegotiationStrategy();
            ArrayList<ContentNegotiationStrategy> list = new ArrayList<>();
            list.add(myContentNegotiationStrategy);
            list.add(headerContentNegotiationStrategy);
            configurer.strategies(list);
        }
    }
}
```

还一种比较简单，没有心里负担的做法：

```java
@Bean
public WebMvcConfigurer webMvcConfigurer(){
    return new WebMvcConfigurer() {
        @Override
        public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
            configurer.mediaType("dabin",new MediaType("application","dabin"));
        }
    }
}
```

这种情况也是可以的，不过需要我们开启`spring.mvc.contentnegotiation.favorParameter`

这种就是在默认的`ParameterContentNegotiationStrategy`中添加支持的mediaType，在原来支持的xml和json里又加入dabin。

![](http://img.topjavaer.cn/img/202311262232459.png)

还有一种更简单的方案，`ContentNegotiationConfigurer`中的`mediaTypes`支持yml配置，也即我们只需要：

```java
spring:
  mvc:
    content negotiation:
      favor-parameter: true
      media-types: {dabin: application/dabin}
```

即可。

### 4.5 源码优化

在前面的源码分析中，其实是可以看到一个SpringMVC的优化点的，在说如何优化前我们先说回内容协商：

内容协商的时候，会执行

```java
List<MediaType> producibleTypes = getProducibleMediaTypes(request, valueType, targetType);
```

语句，这条语句会得到当前服务器端支持返回的mediaType。其源码如下：

```java
protected List<MediaType> getProducibleMediaTypes(
      HttpServletRequest request, Class<?> valueClass, @Nullable Type targetType) {

   Set<MediaType> mediaTypes =
         (Set<MediaType>) request.getAttribute(HandlerMapping.PRODUCIBLE_MEDIA_TYPES_ATTRIBUTE);
   if (!CollectionUtils.isEmpty(mediaTypes)) {
      return new ArrayList<>(mediaTypes);
   }
   List<MediaType> result = new ArrayList<>();
   for (HttpMessageConverter<?> converter : this.messageConverters) {
      if (converter instanceof GenericHttpMessageConverter && targetType != null) {
         if (((GenericHttpMessageConverter<?>) converter).canWrite(targetType, valueClass, null)) {
            result.addAll(converter.getSupportedMediaTypes(valueClass));
         }
      }
      else if (converter.canWrite(valueClass, null)) {
         result.addAll(converter.getSupportedMediaTypes(valueClass));
      }
   }
   return (result.isEmpty() ? Collections.singletonList(MediaType.ALL) : result);
}
```

可以看到就是遍历所有的`HttpMessageConverter`实例，判断其是否支持将当前返回值写出，如果支持就将这个`HttpMessageConverter`对应的mediaType记录起来，然后汇总返回，这个汇总结果就是当前服务器端支持的返回类型。

在内容协商后，我们拿到了要输出的mediaType理论上就该使用`HttpMessageConverter`将信息写出，此时SpringMVC的做法如下：

```java
for (HttpMessageConverter<?> converter : this.messageConverters) {
   GenericHttpMessageConverter genericConverter = (converter instanceof GenericHttpMessageConverter ?
         (GenericHttpMessageConverter<?>) converter : null);
   if (genericConverter != null ?
         ((GenericHttpMessageConverter) converter).canWrite(targetType, valueType, selectedMediaType) :
         converter.canWrite(valueType, selectedMediaType)) {
      body = getAdvice().beforeBodyWrite(body, returnType, selectedMediaType,
            (Class<? extends HttpMessageConverter<?>>) converter.getClass(),
            inputMessage, outputMessage);
      if (body != null) {
         Object theBody = body;
         LogFormatUtils.traceDebug(logger, traceOn ->
               "Writing [" + LogFormatUtils.formatValue(theBody, !traceOn) + "]");
         addContentDispositionHeader(inputMessage, outputMessage);
         if (genericConverter != null) {
            genericConverter.write(body, targetType, selectedMediaType, outputMessage);
         }
         else {
            ((HttpMessageConverter) converter).write(body, selectedMediaType, outputMessage);
         }
      }
      else {
         if (logger.isDebugEnabled()) {
            logger.debug("Nothing to write: null body");
         }
      }
      return;
   }
}
```

依然是遍历所有的`HttpMessageConverter`，判断其是否支持写出，支持再调用写出函数转化和写出结果。

其实这里很多人已经看明白了，上一步内容协商的时候已经遍历过所有的`HttpMessageConverter`了，这其中有些是支持写出，有些是不支持的，将支持写出的`HttpMessageConverter`对应的mediaType汇总起来。再从这些汇总后候选的mediaType中选出一个合适的mediaType作为写出类型，再选择一个能处理这个mediaType的`HttpMessageConverter`写出。这时第二遍就不需要再遍历所有的mediaType，直接遍历第一遍支持写出的`HttpMessageConverter`结果就可以了，相当于第一遍做个初筛选，第二遍做可以在初筛选的结果上再遍历得到具体的那个`HttpMessageConverter`做转化，而无需在第二次时再遍历所有的mediaType。甚至如果mediaType与`HttpMessageConverter`具有映射关系，可以将第一步的初筛结果转为map，key是支持的mediaType，value是`HttpMessageConverter`，内容协商后可以直接通过key拿到`HttpMessageConverter`，时间复杂度O(1)，无需二次遍历。