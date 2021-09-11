<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [static](#static)
  - [静态变量](#%E9%9D%99%E6%80%81%E5%8F%98%E9%87%8F)
  - [静态方法](#%E9%9D%99%E6%80%81%E6%96%B9%E6%B3%95)
  - [静态代码块](#%E9%9D%99%E6%80%81%E4%BB%A3%E7%A0%81%E5%9D%97)
  - [静态内部类](#%E9%9D%99%E6%80%81%E5%86%85%E9%83%A8%E7%B1%BB)
- [final](#final)
- [this](#this)
- [super](#super)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## static

static可以用来修饰类的成员方法、类的成员变量。

### 静态变量

static变量也称作静态变量，静态变量和非静态变量的区别是：静态变量被所有的对象所共享，在内存中只有一个副本，它当且仅当在类初次加载时会被初始化。而非静态变量是对象所拥有的，在创建对象的时候被初始化，存在多个副本，各个对象拥有的副本互不影响。

以下例子，age为非静态变量，则p1打印结果是：`Name:zhangsan, Age:10`；若age使用static修饰，则p1打印结果是：`Name:zhangsan, Age:12`，因为static变量在内存只有一个副本。

```java
public class Person {
    String name;
    int age;
    
    public String toString() {
        return "Name:" + name + ", Age:" + age;
    }
    
    public static void main(String[] args) {
        Person p1 = new Person();
        p1.name = "zhangsan";
        p1.age = 10;
        Person p2 = new Person();
        p2.name = "lisi";
        p2.age = 12;
        System.out.println(p1);
        System.out.println(p2);
    }
    /**Output
     * Name:zhangsan, Age:10
     * Name:lisi, Age:12
     *///~
}
```

### 静态方法

static方法一般称作静态方法。静态方法不依赖于任何对象就可以进行访问，通过类名即可调用静态方法。

```java
public class Utils {
    public static void print(String s) {
        System.out.println("hello world: " + s);
    }

    public static void main(String[] args) {
        Utils.print("程序员大彬");
    }
}
```

### 静态代码块

静态代码块只会在类加载的时候执行一次。以下例子，startDate和endDate在类加载的时候进行赋值。

```java
class Person  {
    private Date birthDate;
    private static Date startDate, endDate;
    static{
        startDate = Date.valueOf("2008");
        endDate = Date.valueOf("2021");
    }

    public Person(Date birthDate) {
        this.birthDate = birthDate;
    }
}
```

### 静态内部类

**在静态方法里**，使用⾮静态内部类依赖于外部类的实例，也就是说需要先创建外部类实例，才能用这个实例去创建非静态内部类。⽽静态内部类不需要。

```java
public class OuterClass {
    class InnerClass {
    }
    static class StaticInnerClass {
    }
    public static void main(String[] args) {
        // 在静态方法里，不能直接使用OuterClass.this去创建InnerClass的实例
        // 需要先创建OuterClass的实例o，然后通过o创建InnerClass的实例
        // InnerClass innerClass = new InnerClass();
        OuterClass outerClass = new OuterClass();
        InnerClass innerClass = outerClass.new InnerClass();
        StaticInnerClass staticInnerClass = new StaticInnerClass();

        outerClass.test();
    }
    
    public void nonStaticMethod() {
        InnerClass innerClass = new InnerClass();
        System.out.println("nonStaticMethod...");
    }
}
```



## final

1. **基本数据**类型用final修饰，则不能修改，是常量；**对象引用**用final修饰，则引用只能指向该对象，不能指向别的对象，但是对象本身可以修改。

2. final修饰的方法不能被子类重写

3. final修饰的类不能被继承。



## this

 `this.属性名称`指访问类中的成员变量，可以用来区分成员变量和局部变量。如下代码所示，`this.name`访问类Person当前实例的变量。

```java
/**
 * @description:
 * @author: 程序员大彬
 * @time: 2021-08-17 00:29
 */
public class Person {
    String name;
    int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```

`this.方法名称`用来访问本类的方法。以下代码中，`this.born()`调用类 Person 的当前实例的方法。

```java
/**
 * @description:
 * @author: 程序员大彬
 * @time: 2021-08-17 00:29
 */
public class Person {
    String name;
    int age;

    public Person(String name, int age) {
        this.born();
        this.name = name;
        this.age = age;
    }

    void born() {
    }
}
```



## super

super 关键字用于在子类中访问父类的变量和方法。 

```java
class A {
    protected String name = "大彬";

    public void getName() {
        System.out.println("父类:" + name);
    }
}

public class B extends A {
    @Override
    public void getName() {
        System.out.println(super.name);
        super.getName();
    }

    public static void main(String[] args) {
        B b = new B();
        b.getName();
    }
    /**
     * 大彬
     * 父类:大彬
     */
}
```

在子类B中，我们重写了父类的getName()方法，如果在重写的getName()方法中我们要调用父类的相同方法，必须要通过super关键字显式指出。

