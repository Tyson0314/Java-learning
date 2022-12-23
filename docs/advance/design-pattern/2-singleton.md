# 单例模式

需要对实例字段使用线程安全的延迟初始化，使用双重检查锁定的方案；需要对静态字段使用线程安全的延迟初始化，使用静态内部类的方案。

## 饿汉模式

JVM在类的初始化阶段，会执行类的静态方法。在执行类的初始化期间，JVM会去获取Class对象的锁。这个锁可以同步多个线程对同一个类的初始化。

饿汉模式只在类加载的时候创建一次实例，没有多线程同步的问题。单例没有用到也会被创建，而且在类加载之后就被创建，内存就被浪费了。

```
public class Singleton {  
    private static Singleton instance = new Singleton();  
    private Singleton() {}  
    public static Singleton newInstance() {
        return instance;  
    }  
}
```
## 双重检查锁定

双重校验锁先判断 instance 是否已经被实例化，如果没有被实例化，那么才对实例化语句进行加锁。

instance使用static修饰的原因：getInstance为静态方法，因为静态方法的内部不能直接使用非静态变量，只有静态成员才能在没有创建对象时进行初始化，所以返回的这个实例必须是静态的。

```
public class Singleton {  
    private static volatile Singleton instance = null;  //volatile
    private Singleton(){}  
    public static Singleton getInstance() {  
        if (instance == null) {  
            synchronized (Singleton.class) {  
                if (instance == null) {
                    instance = new Singleton();  
                }  
            }  
        }  
        return instance;  
    }  
}  
```
为什么两次判断`instance == null`：

| Time | Thread A             | Thread B             |
| ---- | -------------------- | -------------------- |
| T1   | 检查到`instance`为空 |                      |
| T2   |                      | 检查到`instance`为空 |
| T3   |                      | 初始化对象`A`        |
| T4   |                      | 返回对象`A`          |
| T5   | 初始化对象`B`        |                      |
| T6   | 返回对象`B`          |                      |

`new Singleton()`会执行三个动作：分配内存空间、初始化对象和对象引用指向内存地址。

```java
memory = allocate();　　// 1：分配对象的内存空间
ctorInstance(memory);　 // 2：初始化对象
instance = memory;　　  // 3：设置instance指向刚分配的内存地址
```

由于指令重排优化的存在，导致初始化对象和将对象引用指向内存地址的顺序是不确定的。在某个线程创建单例对象时，会为该对象分配了内存空间并将对象的字段设置为默认值。此时就可以将分配的内存地址赋值给instance字段了，然而该对象可能还没有初始化。若紧接着另外一个线程来调用getInstance，取到的是未初始化的对象，程序就会出错。volatile 可以禁止指令重排序，保证了先初始化对象再赋值给instance变量。

| Time | Thread A                 | Thread B                                 |
| :--- | :----------------------- | :--------------------------------------- |
| T1   | 检查到`instance`为空     |                                          |
| T2   | 获取锁                   |                                          |
| T3   | 再次检查到`instance`为空 |                                          |
| T4   | 为`instance`分配内存空间 |                                          |
| T5   | 将`instance`指向内存空间 |                                          |
| T6   |                          | 检查到`instance`不为空                   |
| T7   |                          | 访问`instance`（此时对象还未完成初始化） |
| T8   | 初始化`instance`         |                                          |

## 静态内部类

它与饿汉模式一样，也是利用了类初始化机制，因此不存在多线程并发的问题。不一样的是，它是在内部类里面去创建对象实例。这样的话，只要应用中不使用内部类，JVM就不会去加载这个单例类，也就不会创建单例对象，从而实现懒汉式的延迟加载。也就是说这种方式可以同时保证延迟加载和线程安全。

![](http://img.dabin-coder.cn/image/singleton-class-init.png)

基于类初始化的方案的实现代码更简洁。

```
public class Instance {
    private static class InstanceHolder {
        public static Instance instance = new Instance();
    }
    private Instance() {}
    public static Instance getInstance() {
        return InstanceHolder.instance ;　　// 这里将导致InstanceHolder类被初始化
    }
}
```
但基于volatile的双重检查锁定的方案有一个额外的优势：除了可以对静态字段实现延迟初始化外，还可以对实例字段实现延迟初始化。字段延迟初始化降低了初始化类或创建实例的开销，但增加了访问被延迟初始化的字段的开销。在大多数时候，正常的初始化要优于延迟初始化。

