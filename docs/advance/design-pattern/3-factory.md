# 工厂模式

工厂模式是用来封装对象的创建。

## 简单工厂模式

把实例化的操作单独放到一个类中，这个类就成为简单工厂类，让简单工厂类来决定应该用哪个具体子类来实例化，这样做能把客户类和具体子类的实现解耦，客户类不再需要知道有哪些子类以及应当实例化哪个子类。 

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

优点：只需要一个工厂创建对象，代码量少。

缺点：系统扩展困难，新增产品需要修改工厂逻辑，当产品较多时，会造成工厂逻辑过于复杂，不利于系统扩展和维护。

## 工厂方法模式

针对不同的对象提供不同的工厂。每个对象都有一个与之对应的工厂。

```java
public interface Reader {
    void read();
}

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

public interface ReaderFactory {
    Reader getReader();
}

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
```

客户端通过子类来指定创建对应的对象。

```java
ReaderFactory factory=new JpgReaderFactory();
Reader  reader=factory.getReader();
reader.read();
```

优点：增加新的产品类时无须修改现有系统，只需增加新产品和对应的工厂类即可。

## 抽象工厂模式

抽象工厂模式创建的是对象家族，也就是很多对象而不是一个对象，并且这些对象是相关的，也就是说必须一起创建出来。而工厂方法模式只是用于创建一个对象，这和抽象工厂模式有很大不同。

多了一层抽象，减少了工厂的数量（HpMouseFactory和HpKeyboFactory合并为HpFactory）。

![](http://img.dabin-coder.cn/image/抽象工厂.png)



