---
sidebar: heading
title: 设计模式之观察者模式
category: 设计模式
tag:
  - 设计模式
head:
  - - meta
    - name: keywords
      content: 观察者模式,设计模式,观察者
  - - meta
    - name: description
      content: 设计模式常见面试题总结，让天下没有难背的八股文！
---

# 观察者模式

**观察者模式（Observer）**，又叫**发布-订阅模式（Publish/Subscribe）**，定义对象间一种一对多的依赖关系，使得每当一个对象改变状态，则所有依赖于它的对象都会得到通知并自动更新。UML结构图如下：

![](http://img.topjavaer.cn/img/观察者1.png)

其中，Subject类是主题，它把所有对观察者对象的引用文件存在了一个聚集里，每个主题都可以有任何数量的观察者。抽象主题提供了一个接口，可以增加和删除观察者对象；Observer类是抽象观察者，为所有的具体观察者定义一个接口，在得到主题的通知时更新自己；ConcreteSubject类是具体主题，将有关状态存入具体观察者对象，在具体主题内部状态改变时，给所有登记过的观察者发出通知；ConcreteObserver是具体观察者，实现抽象观察者角色所要求的更新接口，以便使本身的状态与主题的状态相协同。

### 主题Subject

首先定义一个观察者数组，并实现增、删及通知操作。它的职责很简单，就是定义谁能观察，谁不能观察，用Vector是线程同步的，比较安全，也可以使用ArrayList，是线程异步的，但不安全。

```java
public class Subject {

    //观察者数组
    private Vector<Observer> oVector = new Vector<>();

    //增加一个观察者
    public void addObserver(Observer observer) {
        this.oVector.add(observer);
    }

    //删除一个观察者
    public void deleteObserver(Observer observer) {
        this.oVector.remove(observer);
    }

    //通知所有观察者
    public void notifyObserver() {
        for(Observer observer : this.oVector) {
            observer.update();
        }
    }

}
```

### 抽象观察者Observer

观察者一般是一个接口，每一个实现该接口的实现类都是具体观察者。

```java
public interface Observer {
    //更新
    public void update();
}
```

### 具体主题

继承Subject类，在这里实现具体业务，在具体项目中，该类会有很多变种。

```java
public class ConcreteSubject extends Subject {

    //具体业务
    public void doSomething() {
        //...
        super.notifyObserver();
    }

}
```

### 具体观察者

实现Observer接口。

```java
public class ConcreteObserver implements Observer {

    @Override
    public void update() {
        System.out.println("收到消息，进行处理");
    }

}
```

###  Client客户端

首先创建一个被观察者，然后定义一个观察者，将该被观察者添加到该观察者的观察者数组中，进行测试。

```java
public class Client {

    public static void main(String[] args) {
        //创建一个主题
        ConcreteSubject subject = new ConcreteSubject();
        //定义一个观察者
        Observer observer = new ConcreteObserver();
        //观察
        subject.addObserver(observer);
        //开始活动
        subject.doSomething();
    }

}
```

运行结果如下：

```java
收到消息，进行处理
```

### 观察者模式的优点

- 观察者和被观察者是抽象耦合的
- 建立了一套触发机制

### 观察者模式的缺点

- 如果一个被观察者对象有很多的直接和间接的观察者的话，将所有的观察者都通知到会花费很多时间
- 如果观察者和观察目标间有循环依赖，可能导致系统崩溃
- 没有相应的机制让观察者知道所观察的目标对象是怎么发生变化的

### 观察者模式的使用场景

- 关联行为场景
- 事件多级触发场景
- 跨系统的消息变换场景，如消息队列的处理机制
