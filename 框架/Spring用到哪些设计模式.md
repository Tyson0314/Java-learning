

- 简单工厂：BeanFactory 就是简单工厂模式的体现，根据传入一个唯一标识来获得 Bean 对象。

  ```java
  	@Override
  	public Object getBean(String name) throws BeansException {
  		assertBeanFactoryActive();
  		return getBeanFactory().getBean(name);
  	}
  ```

- 工厂方法：FactoryBean 就是典型的工厂方法模式。spring在使用getBean()调用获得该bean时，会自动调用该bean的getObject()方法。每个 Bean 都会对应一个 FactoryBean，如 SqlSessionFactory 对应 SqlSessionFactoryBean。

- 单例：一个类仅有一个实例，提供一个访问它的全局访问点。Spring 创建 Bean 实例默认是单例的。

- 适配器：SpringMVC中的适配器HandlerAdatper。由于应用会有多个Controller实现，如果需要直接调用Controller方法，那么需要先判断是由哪一个Controller处理请求，然后调用相应的方法。当增加新的 Controller，需要修改原来的逻辑，违反了开闭原则（对修改关闭，对扩展开放）。

  ```java
  if(mappedHandler.getHandler() instanceof MultiActionController){  
     ((MultiActionController)mappedHandler.getHandler()).xxx  
  }else if(mappedHandler.getHandler() instanceof XXX){  
      ...  
  }else if(...){  
      ...  
  }
  ```

  为此，Spring提供了一个适配器接口，每一种 Controller 对应一种 HandlerAdapter 实现类，当请求过来，SpringMVC会调用getHandler()获取相应的Controller，然后获取该Controller对应的 HandlerAdapter，最后调用HandlerAdapter的handle()方法处理请求，实际上调用的是Controller的handleRequest()。每次添加新的 Controller 时，只需要增加一个适配器类就可以，无需修改原有的逻辑。

  常用的处理器适配器：SimpleControllerHandlerAdapter，HttpRequestHandlerAdapter，AnnotationMethodHandlerAdapter。

  ```java
  // Determine handler for the current request.
  mappedHandler = getHandler(processedRequest);
  
  HandlerAdapter ha = getHandlerAdapter(mappedHandler.getHandler());
  
  // Actually invoke the handler.
  mv = ha.handle(processedRequest, response, mappedHandler.getHandler());
  
  public class HttpRequestHandlerAdapter implements HandlerAdapter {
  
  	@Override
  	public boolean supports(Object handler) {//handler是被适配的对象，这里使用的是对象的适配器模式
  		return (handler instanceof HttpRequestHandler);
  	}
  
  	@Override
  	@Nullable
  	public ModelAndView handle(HttpServletRequest request, HttpServletResponse response, Object handler)
  			throws Exception {
  
  		((HttpRequestHandler) handler).handleRequest(request, response);
  		return null;
  	}
  ```

- 代理：spring 的 aop 使用了动态代理，有两种方式JdkDynamicAopProxy 和Cglib2AopProxy。

- 观察者（observer）：spring 中 observer 模式常用的地方是 listener 的实现，如ApplicationListener。

- 模板方法（template method）：spring 中的 jdbctemplate。



> 参考链接：[spring设计模式](https://blog.csdn.net/caoxiaohong1005/article/details/80039656) | [SpringMVC适配器模式](https://blog.csdn.net/u010288264/article/details/53835185)