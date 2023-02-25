---
sidebar: heading
title: 设计模式之单例模式
category: 设计模式
tag:
  - 设计模式
head:
  - - meta
    - name: keywords
      content: 单例模式,设计模式,单例
  - - meta
    - name: description
      content: 设计模式常见面试题总结，让天下没有难背的八股文！
---

# 单例模式

单例模式（Singleton），目的是为了保证在一个进程中，某个类有且仅有一个实例。

由于这个类只有一个实例，所以不能让调用方使用`new Xxx()`来创建实例。所以，单例的构造方法必须是`private`，这样就防止了调用方自己创建实例。

单例模式的实现需要**三个必要的条件**：

1. 单例类的**构造函数**必须是**私有的**，这样才能将类的创建权控制在类的内部，从而使得类的外部不能创建类的实例。
2. 单例类通过一个**私有的静态变量**来存储其唯一实例。
3. 单例类通过提供一个**公开的静态方法**，使得外部使用者可以访问类的唯一实例。

另外，实现单例类时，还需要考虑三个问题：

- 创建单例对象时，是否**线程安全**。
- 单例对象的创建，是否**延时加载**。
- 获取单例对象时，是否需要**加锁**。

下面介绍几种实现单例模式的方式。

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
饿汉式单例的**优点**：

- 单例对象的创建是**线程安全**的；
- 获取单例对象时**不需要加锁**。

饿汉式单例的**缺点**：单例对象的创建，不是**延时加载**。

## 懒汉式

与饿汉式思想不同，懒汉式支持延时加载，将对象的创建延迟到了获取对象的时候。不过为了线程安全，在获取对象的操作需要加锁，这就导致了低性能。

```java
public class Singleton { 
  private static final Singleton instance;
  
  private Singleton () {}
  
  public static synchronized Singleton getInstance() {    
    if (instance == null) {      
      instance = new Singleton();    
    }    

    return instance;  
  }
}
```

上述代码加的锁只有在第一次创建对象时有用，而之后每次获取对象，其实是不需要加锁的（双重检查锁定优化了这个问题）。

懒汉式单例**优点**：

- 对象的创建是线程安全的。
- 支持延时加载。

懒汉式单例**缺点**：

- 获取对象的操作被加上了锁，影响了并发性能。

## 双重检查锁定

双重检查锁定将懒汉式中的 `synchronized` 方法改成了 `synchronized` 代码块。如下：

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
双重校验锁先判断 instance 是否已经被实例化，如果没有被实例化，那么才对实例化语句进行加锁。

instance使用static修饰的原因：getInstance为静态方法，因为静态方法的内部不能直接使用非静态变量，只有静态成员才能在没有创建对象时进行初始化，所以返回的这个实例必须是静态的。

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

双重检查锁定单例**优点**：

- 对象的创建是线程安全的。
- 支持延时加载。
- 获取对象时不需要加锁。

## 静态内部类

它与饿汉模式一样，也是利用了类初始化机制，因此不存在多线程并发的问题。不一样的是，它是在内部类里面去创建对象实例。这样的话，只要应用中不使用内部类，JVM就不会去加载这个单例类，也就不会创建单例对象，从而实现懒汉式的延迟加载。也就是说这种方式可以同时保证延迟加载和线程安全。

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
如上述代码，`InstanceHolder` 是一个静态内部类，当外部类 `Instance` 被加载的时候，并不会创建 `InstanceHolder` 实例对象。

只有当调用 `getInstance()` 方法时，`InstanceHolder` 才会被加载，这个时候才会创建 `Instance`。`Instance` 的唯一性、创建过程的线程安全性，都由 JVM 来保证。

静态内部类单例**优点**：

- 对象的创建是线程安全的。
- 支持延时加载。
- 获取对象时不需要加锁。

## 枚举

用枚举来实现单例，是最简单的方式。这种实现方式通过 **Java 枚举**类型本身的特性，保证了实例创建的线程安全性和实例的唯一性。

```java
public enum Singleton {
  INSTANCE; // 该对象全局唯一
}
```

