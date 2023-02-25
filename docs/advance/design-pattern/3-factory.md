---
sidebar: heading
title: 设计模式之工厂模式
category: 设计模式
tag:
  - 设计模式
head:
  - - meta
    - name: keywords
      content: 工厂模式,设计模式
  - - meta
    - name: description
      content: 设计模式常见面试题总结，让天下没有难背的八股文！
---

# 工厂模式

工厂模式是用来封装对象的创建。工厂模式有三种，它们分别是简单工厂模式，工厂方法模式以及抽象工厂模式，通常我们所说的工厂模式指的是工厂方法模式。

下面分别介绍下这三种工厂模式。

## 简单工厂模式

简单工厂模式的定义：定义一个工厂类，根据传入的参数不同返回不同的实例，被创建的实例具有共同的父类或接口。

由于只有一个工厂类，所以工厂类中创建的对象不能太多，否则工厂类的业务逻辑就太复杂了，其次由于工厂类封装了对象的创建过程，所以客户端应该不关心对象的创建。

适用场景：

（1）需要创建的对象较少。

（2）客户端不关心对象的创建过程。

下面看一个具体的实例。

创建一个可以绘制不同形状的绘图工具，可以绘制圆形，正方形，三角形，每个图形都会有一个draw()方法用于绘图。

```java
public interface Shape {
    void draw();
}
```

编写具体的图形，每种图形都实现Shape 接口。

```java
public class CircleShape implements Shape {

    public CircleShape() {
        System.out.println(  "CircleShape: created");
    }

    @Override
    public void draw() {
        System.out.println(  "draw: CircleShape");
    }

}

public class RectShape implements Shape {
    public RectShape() {
       System.out.println(  "RectShape: created");
    }

    @Override
    public void draw() {
       System.out.println(  "draw: RectShape");
    }

}

...
```

工厂类的具体实现：

```java
 public class ShapeFactory {
          public static final String TAG = "ShapeFactory";
          public static Shape getShape(String type) {
              Shape shape = null;
              if (type.equalsIgnoreCase("circle")) {
                  shape = new CircleShape();
              } else if (type.equalsIgnoreCase("rect")) {
                  shape = new RectShape();
              } else if (type.equalsIgnoreCase("triangle")) {
                  shape = new TriangleShape();
              }
              return shape;
          }
   }
```

在这个工厂类中通过传入不同的type可以new不同的形状，返回结果为Shape 类型，这个就是简单工厂核心的地方了。

客户端使用：

```java
Shape shape= ShapeFactory.getShape("circle");
shape.draw();
```

通过给ShapeFactory传入不同的参数就实现了各种形状的绘制。

简单工厂模式的**优点**：只需要一个工厂创建对象，代码量少。

简单工厂模式的**缺点**：系统扩展困难，新增产品需要修改工厂逻辑，当产品较多时，会造成工厂逻辑过于复杂，不利于系统扩展和维护。

## 工厂方法模式

工厂方法模式是简单工厂的仅一步深化， 在工厂方法模式中，我们不再提供一个统一的工厂类来创建所有的对象，而是针对不同的对象提供不同的工厂。每个对象都有一个与之对应的工厂。

下面看一个具体的实例。

设计一个这样的图片加载类，它具有多个图片加载器，用来加载jpg，png，gif格式的图片，每个加载器都有一个read方法，用于读取图片。

首先完成图片加载器的设计，编写一个加载器的公共接口。

```java
public interface Reader {
    void read();
}
```

各个图片加载器的实现如下：

```java
public class JpgReader implements Reader {
    @Override
    public void read() {
        System.out.print("read jpg");
    }
}

public class PngReader implements Reader {
    @Override
    public void read() {
        System.out.print("read png");
    }
}
```

定义一个抽象的工厂接口ReaderFactory，通过getReader()方法返回我们的Reader 类。

```java
public interface ReaderFactory {
    Reader getReader();
}
```

为每个图片加载器都提供一个工厂类，这些工厂类实现了ReaderFactory 。

```java
public class JpgReaderFactory implements ReaderFactory {
    @Override
    public Reader getReader() {
        return new JpgReader();
    }
}

public class PngReaderFactory implements ReaderFactory {
    @Override
    public Reader getReader() {
        return new PngReader();
    }
}

public class GifReaderFactory implements ReaderFactory {
    @Override
    public Reader getReader() {
        return new GifReader();
    }
}
```

客户端通过子类来指定创建对应的对象。

```java
ReaderFactory factory=new JpgReaderFactory();
Reader  reader=factory.getReader();
reader.read();
```

和简单工厂对比一下，最根本的区别在于，简单工厂只有一个统一的工厂类，而工厂方法是针对每个要创建的对象都会提供一个工厂类，这些工厂类都实现了一个工厂基类（本例中的ReaderFactory ）。

优点：增加新的产品类时无须修改现有系统，只需增加新产品和对应的工厂类即可。

## 抽象工厂模式

抽象工厂模式创建的是对象家族，也就是很多对象而不是一个对象，并且这些对象是相关的，也就是说必须一起创建出来。而工厂方法模式只是用于创建一个对象，这和抽象工厂模式有很大不同。

下面举一个实例帮助大家理解。

现在需要做一款跨平台的游戏，需要兼容Android，IOS两个移动操作系统，该游戏针对每个系统都设计了一套操作控制器（OperationController）和界面控制器（UIController），下面通过抽象工厂模式完成这款游戏的架构设计。

新建两个抽象产品接口。

```java
//抽象操作控制器
public interface OperationController {
    void control();
}

//抽象界面控制器
public interface UIController {
    void display();
}
```

然后完成这两个系统平台的具体操作控制器和界面控制器。

```java
//Android
public class AndroidOperationController implements OperationController {
    @Override
    public void control() {
        System.out.println("AndroidOperationController");
    }
}

public class AndroidUIController implements UIController {
    @Override
    public void display() {
        System.out.println("AndroidInterfaceController");
    }
}


//IOS
public class IosOperationController implements OperationController {
    @Override
    public void control() {
        System.out.println("IosOperationController");
    }
}

public class IosUIController implements UIController {
    @Override
    public void display() {
        System.out.println("IosInterfaceController");
    }
}
```

下面定义一个抽象工厂，该工厂需要可以创建OperationController和UIController

```java
public interface SystemFactory {
    public OperationController createOperationController();
    public UIController createInterfaceController();
}
```

在各平台具体的工厂类中完成操作控制器和界面控制器的创建过程。

```java
//android
public class AndroidFactory implements SystemFactory {
    @Override
    public OperationController createOperationController() {
        return new AndroidOperationController();
    }

    @Override
    public UIController createInterfaceController() {
        return new AndroidUIController();
    }
}

//IOS
public class IosFactory implements SystemFactory {
    @Override
    public OperationController createOperationController() {
        return new IosOperationController();
    }

    @Override
    public UIController createInterfaceController() {
        return new IosUIController();
    }
}
```

客户端调用如下：

```java
SystemFactory mFactory;
UIController interfaceController;
OperationController operationController;

//Android
mFactory=new AndroidFactory();
//IOS
//mFactory=new IosFactory();

interfaceController=mFactory.createInterfaceController();
operationController=mFactory.createOperationController();
interfaceController.display();
operationController.control();
```

针对不同平台只通过创建不同的工厂对象就完成了操作和UI控制器的创建。

**适用场景：**

（1）和工厂方法一样客户端不需要知道它所创建的对象的类。

（2）需要一组对象共同完成某种功能时。并且可能存在多组对象完成不同功能的情况。

（3）系统结构稳定，不会频繁的增加对象。（因为一旦增加就需要修改原有代码，不符合开闭原则）
