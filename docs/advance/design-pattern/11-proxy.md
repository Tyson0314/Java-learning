# 代理模式

代理模式使用代理对象完成用户请求，屏蔽用户对真实对象的访问。

## 静态代理

静态代理：代理类在编译阶段生成，程序运行前就已经存在，在编译阶段将通知织入Java字节码中。

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

示例代码：

```
public class DynamicProxyDemo {

    public static void main(String[] args) {
        //被代理的对象
        MySubject realSubject = new RealSubject();

        //调用处理器
        MyInvacationHandler handler = new MyInvacationHandler(realSubject);

        MySubject subject = (MySubject) Proxy.newProxyInstance(realSubject.getClass().getClassLoader(),
                realSubject.getClass().getInterfaces(), handler);

        System.out.println(subject.getClass().getName());
        subject.rent();
    }
}

interface MySubject {
    public void rent();
}
class RealSubject implements MySubject {

    @Override
    public void rent() {
        System.out.println("rent my house");
    }
}
class MyInvacationHandler implements InvocationHandler {

    private Object subject;

    public MyInvacationHandler(Object subject) {
        this.subject = subject;
    }

    @Override
    public Object invoke(Object object, Method method, Object[] args) throws Throwable {
        System.out.println("before renting house");
        //invoke方法会拦截代理对象的方法调用
        Object o = method.invoke(subject, args);
        System.out.println("after rentint house");
        return o;
    }
}
```

