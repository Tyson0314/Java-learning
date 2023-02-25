---
sidebar: heading
title: 设计模式之代理模式
category: 设计模式
tag:
  - 设计模式
head:
  - - meta
    - name: keywords
      content: 代理模式,设计模式,静态代理,动态代理
  - - meta
    - name: description
      content: 设计模式常见面试题总结，让天下没有难背的八股文！
---

# 代理模式

代理模式使用代理对象完成用户请求，屏蔽用户对真实对象的访问。

代理模式一般有三种角色：

- 抽象（Subject）角色，该角色是真实主题和代理主题的共同接口，以便在任何可以使用真实主题的地方都可以使用代理主题。
- 代理（Proxy Subject）角色，也叫做委托类、代理类，该角色负责控制对真实主题的引用，负责在需要的时候创建或删除真实主题对象，并且在真实主题角色处理完毕前后做预处理和善后处理工作。
- 真实（Real Subject）角色：该角色也叫做被委托角色、被代理角色，是业务逻辑的具体执行者。

## 静态代理

静态代理：代理类在编译阶段生成，程序运行前就已经存在，在编译阶段将通知织入Java字节码中。

以租房为例，我们一般用租房软件、找中介或者找房东。这里的中介就是代理者。

首先定义一个提供了租房方法的接口。

```java
public interface IRentHouse {
    void rentHouse();
}
```

定义租房的实现类

```java
public class RentHouse implements IRentHouse {
    @Override
    public void rentHouse() {
        System.out.println("租了一间房子。。。");
    }
}
```

我要租房，房源都在中介手中，所以找中介

```java
public class IntermediaryProxy implements IRentHouse {

    private IRentHouse rentHouse;

    public IntermediaryProxy(IRentHouse irentHouse){
        rentHouse = irentHouse;
    }

    @Override
    public void rentHouse() {
        System.out.println("交中介费");
        rentHouse.rentHouse();
        System.out.println("中介负责维修管理");
    }
}
```

这里中介也实现了租房的接口。

再main方法中测试

```java
public class Main {

    public static void main(String[] args){
        //定义租房
        IRentHouse rentHouse = new RentHouse();
        //定义中介
        IRentHouse intermediary = new IntermediaryProxy(rentHouse);
        //中介租房
        intermediary.rentHouse();
    }
}
```

返回信息

```text
交中介费
租了一间房子。。。
中介负责维修管理
```

这就是静态代理，因为中介这个代理类已经事先写好了，只负责代理租房业务。

缺点：因为代理对象需要与目标对象实现一样的接口，所以会有很多代理类。同时，一旦接口增加方法，目标对象与代理对象都要维护。

## 动态代理

动态代理：代理类在程序运行时创建，在内存中临时生成一个代理对象，在运行期间对业务方法进行增强。

**JDK动态代理**

JDK实现代理只需要使用newProxyInstance方法：

```java
static Object newProxyInstance(ClassLoader loader, Class<?>[] interfaces,   InvocationHandler h )
```

三个入参：

- ClassLoader loader：指定当前目标对象使用的类加载器
- Class<?>[] interfaces：目标对象实现的接口的类型
- InvocationHandler：当代理对象调用目标对象的方法时，会触发事件处理器的invoke方法()

还是以租房为例。

现在的中介不仅仅是有租房业务，同时还有卖房、家政、维修等得业务，只是我们就不能对每一个业务都增加一个代理，就要提供通用的代理方法，这就要通过动态代理来实现了。

中介的代理方法做了一下修改：

```java
public class IntermediaryProxy implements InvocationHandler {


    private Object obj;

    public IntermediaryProxy(Object object){
        obj = object;
    }

    /**
     * 调用被代理的方法
     * @param proxy
     * @param method
     * @param args
     * @return
     * @throws Throwable
     */
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        Object result = method.invoke(this.obj, args);
        return result;
    }

}
```

在这里实现InvocationHandler接口，此接口是JDK提供的动态代理接口，对被代理的方法提供代理。其中invoke方法是接口InvocationHandler定义必须实现的， 它完成对真实方法的调用。动态代理是根据被代理的接口生成所有的方法，也就是说给定一个接口，动态代理就会实现接口下所有的方法。通过 InvocationHandler接口， 所有方法都由该Handler来进行处理， 即所有被代理的方法都由 InvocationHandler接管实际的处理任务。

这里增加一个卖房的业务，代码和租房代码类似。

main方法测试：

```java
public static void main(String[] args){

    IRentHouse rentHouse = new RentHouse();
    //定义一个handler
    InvocationHandler handler = new IntermediaryProxy(rentHouse);
    //获得类的class loader
    ClassLoader cl = rentHouse.getClass().getClassLoader();
    //动态产生一个代理者
    IRentHouse proxy = (IRentHouse) Proxy.newProxyInstance(cl, new Class[]{IRentHouse.class}, handler);
    proxy.rentHouse();

    ISellHouse sellHouse = new SellHouse();
    InvocationHandler handler1 = new IntermediaryProxy(sellHouse);
    ClassLoader classLoader = sellHouse.getClass().getClassLoader();
    ISellHouse proxy1 = (ISellHouse) Proxy.newProxyInstance(classLoader, new Class[]{ISellHouse.class}, handler1);
    proxy1.sellHouse();

}
```

在main方法中我们用到了Proxy这个类的方法，

```java
public static Object newProxyInstance(ClassLoader loader,
                                          Class<?>[] interfaces,
                                          InvocationHandler h)
```

InvocationHandler 是一个接口，每个代理的实例都有一个与之关联的 InvocationHandler 实现类，如果代理的方法被调用，那么代理便会通知和转发给内部的 InvocationHandler 实现类，由它决定处理。

```java
public interface InvocationHandler {

    public Object invoke(Object proxy, Method method, Object[] args)
        throws Throwable;
}
```

InvocationHandler 内部只是一个 invoke() 方法，正是这个方法决定了怎么样处理代理传递过来的方法调用。

因为，Proxy 动态产生的代理会调用 InvocationHandler 实现类，所以 InvocationHandler 是实际执行者。

## 总结

1. 静态代理，代理类需要自己编写代码写成。
2. 动态代理，代理类通过 Proxy.newInstance() 方法生成。
3. JDK实现的代理中不管是静态代理还是动态代理，代理与被代理者都要实现两样接口，它们的实质是面向接口编程。CGLib可以不需要接口。
4. 动态代理通过 Proxy 动态生成 proxy class，但是它也指定了一个 InvocationHandler 的实现类。



> 参考链接：https://zhuanlan.zhihu.com/p/72644638
