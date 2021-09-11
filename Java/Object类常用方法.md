<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Object常用方法](#object%E5%B8%B8%E7%94%A8%E6%96%B9%E6%B3%95)
  - [toString](#tostring)
  - [equals](#equals)
  - [hashCode](#hashcode)
  - [clone](#clone)
    - [浅拷贝](#%E6%B5%85%E6%8B%B7%E8%B4%9D)
    - [深拷贝](#%E6%B7%B1%E6%8B%B7%E8%B4%9D)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Object常用方法

Java面试经常会出现的一道题目，Object的常用方法。下面给大家整理一下。

object常用方法有：toString()、equals()、hashCode()、clone()等。

### toString

默认输出对象地址。

```java
public class Person {
    private int age;
    private String name;

    public Person(int age, String name) {
        this.age = age;
        this.name = name;
    }

    public static void main(String[] args) {
        System.out.println(new Person(18, "程序员大彬").toString());
    }
    //output
    //me.tyson.java.core.Person@4554617c
}
```

可以重写toString方法，按照重写逻辑输出对象值。

```java
public class Person {
    private int age;
    private String name;

    public Person(int age, String name) {
        this.age = age;
        this.name = name;
    }

    @Override
    public String toString() {
        return name + ":" + age;
    }

    public static void main(String[] args) {
        System.out.println(new Person(18, "程序员大彬").toString());
    }
    //output
    //程序员大彬:18
}
```

### equals

默认比较两个引用变量是否指向同一个对象（内存地址）。

```java
public class Person {
    private int age;
    private String name;

    public Person(int age, String name) {
       this.age = age;
       this.name = name;
    }

    public static void main(String[] args) {
        String name = "程序员大彬";
        Person p1 = new Person(18, name);
        Person p2 = new Person(18, name);

        System.out.println(p1.equals(p2));
    }
    //output
    //false
}
```

可以重写equals方法，按照age和name是否相等来判断：

```java
public class Person {
    private int age;
    private String name;

    public Person(int age, String name) {
        this.age = age;
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (o instanceof Person) {
            Person p = (Person) o;
            return age == p.age && name.equals(p.name);
        }
        return false;
    }

    public static void main(String[] args) {
        String name = "程序员大彬";
        Person p1 = new Person(18, name);
        Person p2 = new Person(18, name);

        System.out.println(p1.equals(p2));
    }
    //output
    //true
}
```

### hashCode

将与对象相关的信息映射成一个哈希值，默认的实现hashCode值是根据内存地址换算出来。

```java
public class Cat {
    public static void main(String[] args) {
        System.out.println(new Cat().hashCode());
    }
    //out
    //1349277854
}
```

### clone

java赋值是复制对象引用，如果我们想要得到一个对象的副本，使用赋值操作是无法达到目的的。Object对象有个clone()方法，实现了对

象中各个属性的复制，但它的可见范围是protected的。

```java
protected native Object clone() throws CloneNotSupportedException;
```

所以实体类使用克隆的前提是：

-  实现Cloneable接口，这是一个标记接口，自身没有方法，这应该是一种约定。调用clone方法时，会判断有没有实现Cloneable接口，没有实现Cloneable的话会抛异常CloneNotSupportedException。
-  覆盖clone()方法，可见性提升为public。

```java
public class Cat implements Cloneable {
    private String name;

    @Override
    protected Object clone() throws CloneNotSupportedException {
        return super.clone();
    }

    public static void main(String[] args) throws CloneNotSupportedException {
        Cat c = new Cat();
        c.name = "程序员大彬";
        Cat cloneCat = (Cat) c.clone();
        c.name = "大彬";
        System.out.println(cloneCat.name);
    }
    //output
    //程序员大彬
}
```

下面介绍下浅拷贝和深拷贝。

#### 浅拷贝

拷⻉对象和原始对象的引⽤类型引用同⼀个对象。

以下例子，Cat对象里面有个Person对象，调用clone之后，克隆对象和原对象的Person引用的是同一个对象，这就是浅拷贝。

```java
public class Cat implements Cloneable {
    private String name;
    private Person owner;

    @Override
    protected Object clone() throws CloneNotSupportedException {
        return super.clone();
    }

    public static void main(String[] args) throws CloneNotSupportedException {
        Cat c = new Cat();
        Person p = new Person(18, "程序员大彬");
        c.owner = p;

        Cat cloneCat = (Cat) c.clone();
        p.setName("大彬");
        System.out.println(cloneCat.owner.getName());
    }
    //output
    //大彬
}
```

#### 深拷贝

拷贝对象和原始对象的引用类型引用不同的对象。

以下例子，在clone函数中不仅调用了super.clone，而且调用Person对象的clone方法（Person也要实现Cloneable接口并重写clone方法），从而实现了深拷贝。可以看到，拷贝对象的值不会受到原对象的影响。

```java
public class Cat implements Cloneable {
    private String name;
    private Person owner;

    @Override
    protected Object clone() throws CloneNotSupportedException {
        Cat c = null;
        c = (Cat) super.clone();
        c.owner = (Person) owner.clone();//拷贝Person对象
        return c;
    }

    public static void main(String[] args) throws CloneNotSupportedException {
        Cat c = new Cat();
        Person p = new Person(18, "程序员大彬");
        c.owner = p;

        Cat cloneCat = (Cat) c.clone();
        p.setName("大彬");
        System.out.println(cloneCat.owner.getName());
    }
    //output
    //程序员大彬
}
```

