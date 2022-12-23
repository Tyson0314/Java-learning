# @Transactional 事务注解详解

## Spring事务的传播行为

**先简单介绍一下Spring事务的传播行为：**

所谓事务的传播行为是指，如果在开始当前事务之前，一个事务上下文已经存在，此时有若干选项可以指定一个事务性方法的执行行为。在`TransactionDefinition`定义中括了如下几个表示传播行为的常量：

- `TransactionDefinition.PROPAGATION_REQUIRED`：如果当前存在事务，则加入该事务；如果当前没有事务，则创建一个新的事务。这是默认值。
- `TransactionDefinition.PROPAGATION_REQUIRES_NEW`：创建一个新的事务，如果当前存在事务，则把当前事务挂起。
- `TransactionDefinition.PROPAGATION_SUPPORTS`：如果当前存在事务，则加入该事务；如果当前没有事务，则以非事务的方式继续运行。
- `TransactionDefinition.PROPAGATION_NOT_SUPPORTED`：以非事务方式运行，如果当前存在事务，则把当前事务挂起。
- `TransactionDefinition.PROPAGATION_NEVER`：以非事务方式运行，如果当前存在事务，则抛出异常。
- `TransactionDefinition.PROPAGATION_MANDATORY`：如果当前存在事务，则加入该事务；如果当前没有事务，则抛出异常。
- `TransactionDefinition.PROPAGATION_NESTED`：如果当前存在事务，则创建一个事务作为当前事务的嵌套事务来运行；如果当前没有事务，则该取值等价于`TransactionDefinition.PROPAGATION_REQUIRED`。‍

## Spring事务的回滚机制

**然后说一下Spring事务的回滚机制：**

Spring的AOP即声明式事务管理默认是针对`unchecked exception`回滚。Spring的事务边界是在调用业务方法之前开始的，业务方法执行完毕之后来执行`commit or rollback`(Spring默认取决于是否抛出`runtimeException`)。

如果你在方法中有`try{}catch(Exception e){}`处理，那么try里面的代码块就脱离了事务的管理，若要事务生效需要在catch中`throw new RuntimeException ("xxxxxx");`这一点也是面试中会问到的事务失效的场景。

## @Transactional注解实现原理

再简单介绍一下`@Transactional`注解底层实现方式吧，毫无疑问，是通过动态代理，那么动态代理又分为JDK自身和CGLIB，这个也不多赘述了，毕竟今天的主题是如何将`@Transactional`对于事物的控制应用到炉火纯青。哈哈~

第一点要注意的就是在`@Transactional`注解的方法中，再调用本类中的其他方法method2时，那么method2方法上的`@Transactional`注解是不！会！生！效！的！但是加上也并不会报错，拿图片简单帮助理解一下吧。这一点也是面试中会问到的事务失效的场景。

![](http://img.dabin-coder.cn/image/spring事务1.png)

通过代理对象在目标对象前后进行方法增强，也就是事务的开启提交和回滚。那么继续调用本类中其他方法是怎样呢，如下图：

![](http://img.dabin-coder.cn/image/spring事务2.png)

可见目标对象内部的自我调用，也就是通过this.指向的目标对象将不会执行方法的增强。

先说第二点需要注意的地方，等下说如何解决上面第一点的问题。第二点就是`@Transactional`注解的方法必须是公共方法，就是必须是public修饰符！！！

至于这个的原因，发表下个人的理解吧，因为JVM的动态代理是基于接口实现的，通过代理类将目标方法进行增强，想一下也是啦，没有权限访问那么你让我怎么进行，，，好吧，这个我也没有深入研究底层，个人理解个人理解。

在这里我也放个问题吧，希望有高手可以回复指点指点我，因为JVM动态代理是基于接口实现的，那么是不是service层都要按照接口和实现类的开发模式，注解才会生效呢，就是说`controller`层直接调用没有接口的service层，加了注解也一样不起作用吧，这个懒了，没有测试，其一是因为没有人会这么开发吧，其二是我就认为是不起作用的，哈哈。

**下面来解决一下第一点的问题，如何在方法中调用本类中其他方法呢。**

通过`AopContext.currentProxy ()`获取到本类的代理对象，再去调用就好啦。因为这个是CGLIB实现，所以要开启AOP，当然也很简单，在springboot启动类上加上注解`@EnableAspectJAutoProxy(exposeProxy = true)`就可以啦，这个依赖大家自行搜一下就好啦。要注意，注意，代理对象调用的方法也要是public修饰符，否则方法中获取不到注入的bean，会报空指针错误。

emmmm，我先把调用的方式和结果说下吧。自己简单写了代码，有点粗糙，就不要介意啦，嘿嘿。。。

Controller中调用Service

```
@RestController
public class TransactionalController {

    @Autowired
    private TransactionalService transactionalService;

    @PostMapping("transactionalTest")
    public void transacionalTest(){
        transactionalService.transactionalMethod();
    }
}
```

Service中实现对事务的控制：接口

```
public interface TransactionalService {
    void transactionalMethod();
}
```

Service中实现对事务的控制：实现类（各种情况的说明都写在图片里了，这样方便阅读，有助于快速理解吧）

![](http://img.dabin-coder.cn/image/spring事务3.png)

![](http://img.dabin-coder.cn/image/spring事务4.png)

上面两种情况不管使不使用代理调用方法1和方法2，方法`transactionalMethod`都处在一个事务中，四条更新操作全部失败。

那么有人可能会有疑问了，在方法1和方法2上都加`@Transactional`注解呢？答案是结果和上面是一致的。

小结只要方法`transactionalMethod`上有注解，并且方法1和方法2都处于当前事务中（不使用代理调用，方法1和方法2上的`@Transactional`注解是不生效的；使用代理，需要方法1和方法2都处在`transactionalMethod`方法的事务中，默认或者嵌套事务均可，当然也可以不加`@Transactional`注解），那么整体保持事务一致性。

如果想要方法1和方法2均单独保持事务一致性怎么办呢，刚说过了，如果不是用代理调用`@Transactional`注解是不生效的，所以一定要使用代理调用实现，然后让方法1和方法2分别单独开启新的事务，便OK啦。下面摆上图片。

![](http://img.dabin-coder.cn/image/spring事务5.png)

![](http://img.dabin-coder.cn/image/spring事务6.png)

这两种情况都是方法1和方法2均处在单独的事务中，各自保持事务的一致性。

接下来进行进一步的优化，可以在`transactionalMethod`方法中分别对方法1和方法2进行控制。要将代码的艺术发挥到极致嘛，下面装逼开始。

![](http://img.dabin-coder.cn/image/spring事务7.png)

代码太长了，超过屏幕了，粘贴出来截的图，红框注释需要仔细看，希望不要影响你的阅读体验，至此，本篇关于`@Transactioinal`注解的使用就到此为止啦，

简单总结一下吧：

1、就是`@Transactional`注解保证的是每个方法处在一个事务，如果有try一定在catch中抛出运行时异常。

2、方法必须是public修饰符。否则注解不会生效，但是加了注解也没啥毛病，不会报错，只是没卵用而已。

3、this.本方法的调用，被调用方法上注解是不生效的，因为无法再次进行切面增强。



>  原文：blog.csdn.net/fanxb92/article/details/81296005