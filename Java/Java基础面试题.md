<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Java的特点](#java%E7%9A%84%E7%89%B9%E7%82%B9)
- [Java 与 C++ 的区别](#java-%E4%B8%8E-c-%E7%9A%84%E5%8C%BA%E5%88%AB)
- [面向对象和面向过程的区别？](#%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E5%92%8C%E9%9D%A2%E5%90%91%E8%BF%87%E7%A8%8B%E7%9A%84%E5%8C%BA%E5%88%AB)
- [JKD和JRE的区别？](#jkd%E5%92%8Cjre%E7%9A%84%E5%8C%BA%E5%88%AB)
- [面向对象有哪些特性？](#%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E6%9C%89%E5%93%AA%E4%BA%9B%E7%89%B9%E6%80%A7)
- [Java的基本数据类型有哪些？](#java%E7%9A%84%E5%9F%BA%E6%9C%AC%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B%E6%9C%89%E5%93%AA%E4%BA%9B)
- [什么是值传递和引用传递？](#%E4%BB%80%E4%B9%88%E6%98%AF%E5%80%BC%E4%BC%A0%E9%80%92%E5%92%8C%E5%BC%95%E7%94%A8%E4%BC%A0%E9%80%92)
- [自动装箱和拆箱](#%E8%87%AA%E5%8A%A8%E8%A3%85%E7%AE%B1%E5%92%8C%E6%8B%86%E7%AE%B1)
- [String 为什么不可变？](#string-%E4%B8%BA%E4%BB%80%E4%B9%88%E4%B8%8D%E5%8F%AF%E5%8F%98)
- [String, StringBuffer 和 StringBuilder区别](#string-stringbuffer-%E5%92%8C-stringbuilder%E5%8C%BA%E5%88%AB)
- [String 类的常用方法有哪些？](#string-%E7%B1%BB%E7%9A%84%E5%B8%B8%E7%94%A8%E6%96%B9%E6%B3%95%E6%9C%89%E5%93%AA%E4%BA%9B)
- [new String("dabin")会创建几个对象？](#new-stringdabin%E4%BC%9A%E5%88%9B%E5%BB%BA%E5%87%A0%E4%B8%AA%E5%AF%B9%E8%B1%A1)
- [什么是字符串常量池？](#%E4%BB%80%E4%B9%88%E6%98%AF%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%B8%B8%E9%87%8F%E6%B1%A0)
- [object常用方法有哪些？](#object%E5%B8%B8%E7%94%A8%E6%96%B9%E6%B3%95%E6%9C%89%E5%93%AA%E4%BA%9B)
- [讲讲深拷贝和浅拷贝？](#%E8%AE%B2%E8%AE%B2%E6%B7%B1%E6%8B%B7%E8%B4%9D%E5%92%8C%E6%B5%85%E6%8B%B7%E8%B4%9D)
- [两个对象的hashCode()相同，则 equals()是否也一定为 true？](#%E4%B8%A4%E4%B8%AA%E5%AF%B9%E8%B1%A1%E7%9A%84hashcode%E7%9B%B8%E5%90%8C%E5%88%99-equals%E6%98%AF%E5%90%A6%E4%B9%9F%E4%B8%80%E5%AE%9A%E4%B8%BA-true)
- [Java创建对象有几种方式？](#java%E5%88%9B%E5%BB%BA%E5%AF%B9%E8%B1%A1%E6%9C%89%E5%87%A0%E7%A7%8D%E6%96%B9%E5%BC%8F)
- [说说类实例化的顺序](#%E8%AF%B4%E8%AF%B4%E7%B1%BB%E5%AE%9E%E4%BE%8B%E5%8C%96%E7%9A%84%E9%A1%BA%E5%BA%8F)
- [equals和==有什么区别？](#equals%E5%92%8C%E6%9C%89%E4%BB%80%E4%B9%88%E5%8C%BA%E5%88%AB)
- [常见的关键字有哪些？](#%E5%B8%B8%E8%A7%81%E7%9A%84%E5%85%B3%E9%94%AE%E5%AD%97%E6%9C%89%E5%93%AA%E4%BA%9B)
  - [static](#static)
  - [final](#final)
  - [this](#this)
  - [super](#super)
- [final, finally, finalize 的区别](#final-finally-finalize-%E7%9A%84%E5%8C%BA%E5%88%AB)
- [final关键字的作用？](#final%E5%85%B3%E9%94%AE%E5%AD%97%E7%9A%84%E4%BD%9C%E7%94%A8)
- [方法重载和重写的区别？](#%E6%96%B9%E6%B3%95%E9%87%8D%E8%BD%BD%E5%92%8C%E9%87%8D%E5%86%99%E7%9A%84%E5%8C%BA%E5%88%AB)
- [接口与抽象类区别？](#%E6%8E%A5%E5%8F%A3%E4%B8%8E%E6%8A%BD%E8%B1%A1%E7%B1%BB%E5%8C%BA%E5%88%AB)
- [常见的Exception有哪些？](#%E5%B8%B8%E8%A7%81%E7%9A%84exception%E6%9C%89%E5%93%AA%E4%BA%9B)
- [Error和Exception的区别？](#error%E5%92%8Cexception%E7%9A%84%E5%8C%BA%E5%88%AB)
- [运行时异常和非运行时异常（checked）的区别？](#%E8%BF%90%E8%A1%8C%E6%97%B6%E5%BC%82%E5%B8%B8%E5%92%8C%E9%9D%9E%E8%BF%90%E8%A1%8C%E6%97%B6%E5%BC%82%E5%B8%B8checked%E7%9A%84%E5%8C%BA%E5%88%AB)
- [throw和throws的区别？](#throw%E5%92%8Cthrows%E7%9A%84%E5%8C%BA%E5%88%AB)
- [BIO/NIO/AIO区别的区别？](#bionioaio%E5%8C%BA%E5%88%AB%E7%9A%84%E5%8C%BA%E5%88%AB)
- [守护线程是什么？](#%E5%AE%88%E6%8A%A4%E7%BA%BF%E7%A8%8B%E6%98%AF%E4%BB%80%E4%B9%88)
- [Java支持多继承吗？](#java%E6%94%AF%E6%8C%81%E5%A4%9A%E7%BB%A7%E6%89%BF%E5%90%97)
- [如何实现对象克隆？](#%E5%A6%82%E4%BD%95%E5%AE%9E%E7%8E%B0%E5%AF%B9%E8%B1%A1%E5%85%8B%E9%9A%86)
- [同步和异步的区别？](#%E5%90%8C%E6%AD%A5%E5%92%8C%E5%BC%82%E6%AD%A5%E7%9A%84%E5%8C%BA%E5%88%AB)
- [阻塞和非阻塞的区别？](#%E9%98%BB%E5%A1%9E%E5%92%8C%E9%9D%9E%E9%98%BB%E5%A1%9E%E7%9A%84%E5%8C%BA%E5%88%AB)
- [Java8的新特性有哪些？](#java8%E7%9A%84%E6%96%B0%E7%89%B9%E6%80%A7%E6%9C%89%E5%93%AA%E4%BA%9B)
- [什么是序列化和反序列化？](#%E4%BB%80%E4%B9%88%E6%98%AF%E5%BA%8F%E5%88%97%E5%8C%96%E5%92%8C%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96)
- [如何实现序列化](#%E5%A6%82%E4%BD%95%E5%AE%9E%E7%8E%B0%E5%BA%8F%E5%88%97%E5%8C%96)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

> 首先给大家分享一个github仓库，上面放了**200多本经典的计算机书籍**，包括C语言、C++、Java、Python、前端、数据库、操作系统、计算机网络、数据结构和算法、机器学习、编程人生等，可以star一下，下次找书直接在上面搜索，仓库持续更新中~
>
> github地址：https://github.com/Tyson0314/java-books
>
> 如果github访问不了，可以访问gitee仓库。
>
> gitee地址：https://gitee.com/tysondai/java-books

## Java的特点

**Java是一门面向对象的编程语言。**面向对象和面向过程的区别参考下一个问题。

**Java具有平台独立性和移植性。**

- Java有一句口号：`Write once, run anywhere`，一次编写、到处运行。这也是Java的魅力所在。而实现这种特性的正是Java虚拟机JVM。已编译的Java程序可以在任何带有JVM的平台上运行。你可以在windows平台编写代码，然后拿到linux上运行。只要你在编写完代码后，将代码编译成.class文件，再把class文件打成Java包，这个jar包就可以在不同的平台上运行了。

**Java具有稳健性。**

- Java是一个强类型语言，它允许扩展编译时检查潜在类型不匹配问题的功能。Java要求显式的方法声明，它不支持C风格的隐式声明。这些严格的要求保证编译程序能捕捉调用错误，这就导致更可靠的程序。
- 异常处理是Java中使得程序更稳健的另一个特征。异常是某种类似于错误的异常条件出现的信号。使用`try/catch/finally`语句，程序员可以找到出错的处理代码，这就简化了出错处理和恢复的任务。

## Java 与 C++ 的区别

- Java 是纯粹的面向对象语言，所有的对象都继承自 java.lang.Object，C++ 兼容 C ，不但支持面向对象也支持面向过程。
- Java 通过虚拟机从而实现跨平台特性， C++ 依赖于特定的平台。
- Java 没有指针，它的引用可以理解为安全指针，而 C++ 具有和 C 一样的指针。
- Java 支持自动垃圾回收，而 C++ 需要手动回收。
- Java 不支持多重继承，只能通过实现多个接口来达到相同目的，而 C++ 支持多重继承。

## 面向对象和面向过程的区别？

面向对象和面向过程是一种软件开发思想。

- 面向过程就是分析出解决问题所需要的步骤，然后用函数按这些步骤实现，使用的时候依次调用就可以了。

- 面向对象是把构成问题事务分解成各个对象，分别设计这些对象，然后将他们组装成有完整功能的系统。面向过程只用函数实现，面向对象是用类实现各个功能模块。

以五子棋为例，面向过程的设计思路就是首先分析问题的步骤：

1、开始游戏，2、黑子先走，3、绘制画面，4、判断输赢，5、轮到白子，6、绘制画面，7、判断输赢，8、返回步骤2，9、输出最后结果。
把上面每个步骤用分别的函数来实现，问题就解决了。

而面向对象的设计则是从另外的思路来解决问题。整个五子棋可以分为：

1. 黑白双方
2. 棋盘系统，负责绘制画面
3. 规则系统，负责判定诸如犯规、输赢等。

黑白双方负责接受用户的输入，并告知棋盘系统棋子布局发生变化，棋盘系统接收到了棋子的变化的信息就负责在屏幕上面显示出这种变化，同时利用规则系统来对棋局进行判定。

## JKD和JRE的区别？

JDK和JRE是Java开发和运行工具，其中JDK包含了JRE，而JRE是可以独立安装的。

**JDK**：Java Development Kit，JAVA语言的软件工具开发包，是整个JAVA开发的核心，它包含了JAVA的运行（JVM+JAVA类库）环境和JAVA工具。

**JRE**：Java Runtime Environment，Java运行环境，包含JVM标准实现及Java核心类库。JRE是Java运行环境，并不是一个开发环境，所以没有包含任何开发工具（如编译器和调试器）。

JRE是运行基于Java语言编写的程序所不可缺少的运行环境。也是通过它，Java的开发者才得以将自己开发的程序发布到用户手中，让用户使用。

## 面向对象有哪些特性？

面向对象四大特性：封装，继承，多态，抽象

1、封装就是将类的信息隐藏在类内部，不允许外部程序直接访问，而是通过该类的方法实现对隐藏信息的操作和访问。 良好的封装能够减少耦合。

2、继承是从已有的类中派生出新的类，新的类继承父类的属性和行为，并能扩展新的能力，大大增加程序的重用性和易维护性。在Java中是单继承的，也就是说一个子类只有一个父类。

3、多态是同一个行为具有多个不同表现形式的能力。在不修改程序代码的情况下改变程序运行时绑定的代码。实现多态的三要素：继承、重写、父类引用指向子类对象。

- 静态多态性：通过重载实现，相同的方法有不同的參数列表，可以根据参数的不同，做出不同的处理。
- 动态多态性：在子类中重写父类的方法。运行期间判断所引用对象的实际类型，根据其实际类型调用相应的方法。

4、抽象。把客观事物用代码抽象出来。

## Java的基本数据类型有哪些？

- byte，8bit
- char，16bit
- short，16bit
- int，32bit
- float，32bit
- long，64bit
- double，64bit
- boolean，只有两个值：true、false，可以使⽤用 1 bit 来存储

| 简单类型   | boolean | byte | char      | short | Int     | long | float | double |
| ---------- | ------- | ---- | --------- | ----- | ------- | ---- | ----- | ------ |
| 二进制位数 | 1       | 8    | 16        | 16    | 32      | 64   | 32    | 64     |
| 包装类     | Boolean | Byte | Character | Short | Integer | Long | Float | Double |

## 为什么不能用浮点型表示金额？

由于计算机中保存的小数其实是十进制的小数的近似值，并不是准确值，所以，千万不要在代码中使用浮点数来表示金额等重要的指标。

建议使用BigDecimal或者Long来表示金额。

## 什么是值传递和引用传递？

- 值传递是对基本型变量而言的,传递的是该变量的一个副本，改变副本不影响原变量。
- 引用传递一般是对于对象型变量而言的,传递的是该对象地址的一个副本, 并不是原对象本身 。所以对引用对象进行操作会同时改变原对象。

## 了解Java的包装类型吗？为什么需要包装类？

Java 是一种面向对象语言，很多地方都需要使用对象而不是基本数据类型。比如，在集合类中，我们是无法将 int 、double 等类型放进去的。因为集合的容器要求元素是 Object 类型。

为了让基本类型也具有对象的特征，就出现了包装类型。相当于将基本类型包装起来，使得它具有了对象的性质，并且为其添加了属性和方法，丰富了基本类型的操作。

## 自动装箱和拆箱

Java中基础数据类型与它们对应的包装类见下表：

| 原始类型 | 包装类型  |
| :------- | :-------- |
| boolean  | Boolean   |
| byte     | Byte      |
| char     | Character |
| float    | Float     |
| int      | Integer   |
| long     | Long      |
| short    | Short     |
| double   | Double    |

装箱：将基础类型转化为包装类型。

拆箱：将包装类型转化为基础类型。

当基础类型与它们的包装类有如下几种情况时，编译器会**自动**帮我们进行装箱或拆箱：

- 赋值操作（装箱或拆箱）
- 进行加减乘除混合运算 （拆箱）
- 进行>,<,==比较运算（拆箱）
- 调用equals进行比较（装箱）
- ArrayList、HashMap等集合类添加基础类型数据时（装箱）

示例代码：

```java
Integer x = 1; // 装箱 调⽤ Integer.valueOf(1)
int y = x; // 拆箱 调⽤了 X.intValue()
```

下面看一道常见的面试题：

```java
Integer a = 100;
Integer b = 100;
System.out.println(a == b);

Integer c = 200;
Integer d = 200;
System.out.println(c == d);
```

输出：

```java
true
false
```

为什么第三个输出是false？看看 Integer 类的源码就知道啦。

```java
public static Integer valueOf(int i) {
    if (i >= IntegerCache.low && i <= IntegerCache.high)
        return IntegerCache.cache[i + (-IntegerCache.low)];
    return new Integer(i);
}
```

`Integer c = 200;` 会调用 调⽤`Integer.valueOf(200)`。而从Integer的valueOf()源码可以看到，这里的实现并不是简单的new Integer，而是用IntegerCache做一个cache。

```java
private static class IntegerCache {
    static final int low = -128;
    static final int high;
    static final Integer cache[];

    static {
        // high value may be configured by property
        int h = 127;
        String integerCacheHighPropValue =
            sun.misc.VM.getSavedProperty("java.lang.Integer.IntegerCache.high");
        if (integerCacheHighPropValue != null) {
            try {
                int i = parseInt(integerCacheHighPropValue);
                i = Math.max(i, 127);
                // Maximum array size is Integer.MAX_VALUE
                h = Math.min(i, Integer.MAX_VALUE - (-low) -1);
            } catch( NumberFormatException nfe) {
                // If the property cannot be parsed into an int, ignore it.
            }
        }
        high = h;
    }
    ...
}
```

这是IntegerCache静态代码块中的一段，默认Integer cache 的下限是-128，上限默认127。当赋值100给Integer时，刚好在这个范围内，所以从cache中取对应的Integer并返回，所以a和b返回的是同一个对象，所以==比较是相等的，当赋值200给Integer时，不在cache 的范围内，所以会new Integer并返回，当然==比较的结果是不相等的。

## String 为什么不可变？

先看下Java8 String类的源码：

```java
public final class String
    implements java.io.Serializable, Comparable<String>, CharSequence {
    /** The value is used for character storage. */
    private final char value[];

    /** Cache the hash code for the string */
    private int hash; // Default to 0
}
```

String类是final的，它的所有成员变量也都是final的。为什么是final的？

1. **线程安全**。同一个字符串实例可以被多个线程共享，因为字符串不可变，本身就是线程安全的。
2. **支持hash映射和缓存。**因为String的hash值经常会使用到，比如作为 Map 的键，不可变的特性使得 hash 值也不会变，不需要重新计算。
3. **字符串常量池优化**。String对象创建之后，会缓存到字符串常量池中，下次需要创建同样的对象时，可以直接返回缓存的引用。

## String, StringBuffer 和 StringBuilder区别

**1. 可变性**  

- String 不可变
- StringBuffer 和 StringBuilder 可变

**2. 线程安全**  

- String 不可变，因此是线程安全的
- StringBuilder 不是线程安全的
- StringBuffer 是线程安全的，内部使用 synchronized 进行同步

## String 类的常用方法有哪些？

- indexOf()：返回指定字符的索引。
- charAt()：返回指定索引处的字符。
- replace()：字符串替换。
- trim()：去除字符串两端空白。
- split()：分割字符串，返回一个分割后的字符串数组。
- getBytes()：返回字符串的 byte 类型数组。
- length()：返回字符串长度。
- toLowerCase()：将字符串转成小写字母。
- toUpperCase()：将字符串转成大写字符。
- substring()：截取字符串。
- equals()：字符串比较。

## new String("dabin")会创建几个对象？

使用这种方式会创建两个字符串对象（前提是字符串常量池中没有 "dabin" 这个字符串对象）。

- "dabin" 属于字符串字面量，因此编译时期会在字符串常量池中创建一个字符串对象，指向这个 "dabin" 字符串字面量；
- 使用 new 的方式会在堆中创建一个字符串对象。

## 什么是字符串常量池？

字符串常量池（String Pool）保存着所有字符串字面量，这些字面量在编译时期就确定。字符串常量池位于堆内存中，专门用来存储字符串常量。在创建字符串时，JVM首先会检查字符串常量池，如果该字符串已经存在池中，则返回其引用，如果不存在，则创建此字符串并放入池中，并返回其引用。

## Object常用方法有哪些？

Java面试经常会出现的一道题目，Object的常用方法。下面给大家整理一下。

Object常用方法有：`toString()`、`equals()`、`hashCode()`、`clone()`等。

**toString**

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

**equals**

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

**hashCode**

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

**clone**

Java赋值是复制对象引用，如果我们想要得到一个对象的副本，使用赋值操作是无法达到目的的。Object对象有个clone()方法，实现了对

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

**getClass**

返回此 Object 的运行时类，常用于java反射机制。

```java
public class Person {
    private String name;

    public Person(String name) {
        this.name = name;
    }

    public static void main(String[] args) {
        Person p = new Person("程序员大彬");
        Class clz = p.getClass();
        System.out.println(clz);
        //获取类名
        System.out.println(clz.getName());
    }
    /**
     * class com.tyson.basic.Person
     * com.tyson.basic.Person
     */
}
```

**wait**

当前线程调用对象的wait()方法之后，当前线程会释放对象锁，进入等待状态。等待其他线程调用此对象的notify()/notifyAll()唤醒或者等待超时时间wait(long timeout)自动唤醒。线程需要获取obj对象锁之后才能调用 obj.wait()。

**notify**

obj.notify()唤醒在此对象上等待的单个线程，选择是任意性的。notifyAll()唤醒在此对象上等待的所有线程。

## 讲讲深拷贝和浅拷贝？

**浅拷贝**：拷⻉对象和原始对象的引⽤类型引用同⼀个对象。

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

**深拷贝**：拷贝对象和原始对象的引用类型引用不同的对象。

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

##  两个对象的hashCode()相同，则 equals()是否也一定为 true？

equals与hashcode的关系：

1. 如果两个对象调用equals比较返回true，那么它们的hashCode值一定要相同；
2. 如果两个对象的hashCode相同，它们并不一定相同。

hashcode方法主要是用来**提升对象比较的效率**，先进行hashcode()的比较，如果不相同，那就不必在进行equals的比较，这样就大大减少了equals比较的次数，当比较对象的数量很大的时候能提升效率。

之所以重写`equals()`要重写`hashcode()`，是为了保证`equals()`方法返回true的情况下hashcode值也要一致，如果重写了`equals()`没有重写`hashcode()`，就会出现两个对象相等但`hashcode()`不相等的情况。这样，当用其中的一个对象作为键保存到hashMap、hashTable或hashSet中，再以另一个对象作为键值去查找他们的时候，则会查找不到。

##  Java创建对象有几种方式？

Java创建对象有以下几种方式：

- 用new语句创建对象。
- 使用反射，使用Class.newInstance()创建对象。
- 调用对象的clone()方法。
- 运用反序列化手段，调用java.io.ObjectInputStream对象的readObject()方法。

## 说说类实例化的顺序

Java中类实例化顺序：

1. 静态属性，静态代码块。
2. 普通属性，普通代码块。
3. 构造方法。

```java
public class LifeCycle {
    // 静态属性
    private static String staticField = getStaticField();

    // 静态代码块
    static {
        System.out.println(staticField);
        System.out.println("静态代码块初始化");
    }

    // 普通属性
    private String field = getField();

    // 普通代码块
    {
        System.out.println(field);
        System.out.println("普通代码块初始化");
    }

    // 构造方法
    public LifeCycle() {
        System.out.println("构造方法初始化");
    }

    // 静态方法
    public static String getStaticField() {
        String statiFiled = "静态属性初始化";
        return statiFiled;
    }

    // 普通方法
    public String getField() {
        String filed = "普通属性初始化";
        return filed;
    }

    public static void main(String[] argc) {
        new LifeCycle();
    }

    /**
     *      静态属性初始化
     *      静态代码块初始化
     *      普通属性初始化
     *      普通代码块初始化
     *      构造方法初始化
     */
}
```

## equals和==有什么区别？

- 对于基本数据类型，==比较的是他们的值。基本数据类型没有equal方法；

- 对于复合数据类型，==比较的是它们的存放地址(是否是同一个对象)。`equals()`默认比较地址值，重写的话按照重写逻辑去比较。

## 常见的关键字有哪些？

**static**

static可以用来修饰类的成员方法、类的成员变量。

static变量也称作**静态变量**，静态变量和非静态变量的区别是：静态变量被所有的对象所共享，在内存中只有一个副本，它当且仅当在类初次加载时会被初始化。而非静态变量是对象所拥有的，在创建对象的时候被初始化，存在多个副本，各个对象拥有的副本互不影响。

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

static方法一般称作**静态方法**。静态方法不依赖于任何对象就可以进行访问，通过类名即可调用静态方法。

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

**静态代码块**只会在类加载的时候执行一次。以下例子，startDate和endDate在类加载的时候进行赋值。

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

**静态内部类**

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

**final**

1. **基本数据**类型用final修饰，则不能修改，是常量；**对象引用**用final修饰，则引用只能指向该对象，不能指向别的对象，但是对象本身可以修改。

2. final修饰的方法不能被子类重写

3. final修饰的类不能被继承。

**this**

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

**super**

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

在子类B中，我们重写了父类的`getName()`方法，如果在重写的`getName()`方法中我们要调用父类的相同方法，必须要通过super关键字显式指出。

## final, finally, finalize 的区别

- final 用于修饰属性、方法和类, 分别表示属性不能被重新赋值，方法不可被覆盖，类不可被继承。
- finally 是异常处理语句结构的一部分，一般以`try-catch-finally`出现，`finally`代码块表示总是被执行。
- finalize 是Object类的一个方法，该方法一般由垃圾回收器来调用，当我们调用`System.gc()`方法的时候，由垃圾回收器调用`finalize()`方法，回收垃圾，JVM并不保证此方法总被调用。

## final关键字的作用？

- final 修饰的类不能被继承。
- final 修饰的方法不能被重写。
- final 修饰的变量叫常量，常量必须初始化，初始化之后值就不能被修改。

## 方法重载和重写的区别？

**同个类中的多个方法可以有相同的方法名称，但是有不同的参数列表，这就称为方法重载。**参数列表又叫参数签名，包括参数的类型、参数的个数、参数的顺序，只要有一个不同就叫做参数列表不同。

重载是面向对象的一个基本特性。

```java
public class OverrideTest {
    void setPerson() { }
    
    void setPerson(String name) {
        //set name
    }
    
    void setPerson(String name, int age) {
        //set name and age
    }
}
```

**方法的重写描述的是父类和子类之间的。当父类的功能无法满足子类的需求，可以在子类对方法进行重写。**方法重写时， 方法名与形参列表必须一致。

如下代码，Person为父类，Student为子类，在Student中重写了dailyTask方法。

```java
public class Person {
    private String name;
    
    public void dailyTask() {
        System.out.println("work eat sleep");
    }
}


public class Student extends Person {
    @Override
    public void dailyTask() {
        System.out.println("study eat sleep");
    }
}
```

## 接口与抽象类区别？

1、**语法层面**上的区别

- 抽象类可以有方法实现，而接口的方法中只能是抽象方法；
- 抽象类中的成员变量可以是各种类型的，接口中的成员变量只能是public static final类型；
- 接口中不能含有静态代码块以及静态方法，而抽象类可以有静态代码块和静态方法；
- 一个类只能继承一个抽象类，而一个类却可以实现多个接口。

2、**设计层面**上的区别

- 抽象层次不同。抽象类是对整个类整体进行抽象，包括属性、行为，但是接口只是对类行为进行抽象。继承抽象类是一种"是不是"的关系，而接口实现则是 "有没有"的关系。如果一个类继承了某个抽象类，则子类必定是抽象类的种类，而接口实现则是具备不具备的关系，比如鸟是否能飞。
- 继承抽象类的是具有相似特点的类，而实现接口的却可以不同的类。

门和警报的例子：

```java
class AlarmDoor extends Door implements Alarm {
    //code
}

class BMWCar extends Car implements Alarm {
    //code
}
```

## 常见的Exception有哪些？

常见的RuntimeException：

1. `ClassCastException` //类型转换异常
2. `IndexOutOfBoundsException` //数组越界异常
3. `NullPointerException` //空指针
4. `ArrayStoreException` //数组存储异常
5. `NumberFormatException` //数字格式化异常
6. `ArithmeticException` //数学运算异常

unchecked Exception：

1. `NoSuchFieldException` //反射异常，没有对应的字段
2. `ClassNotFoundException` //类没有找到异常
3. `IllegalAccessException` //安全权限异常，可能是反射时调用了private方法

## Error和Exception的区别？

**Error**：JVM 无法解决的严重问题，如栈溢出`StackOverflowError`、内存溢出`OOM`等。程序无法处理的错误。

**Exception**：其它因编程错误或偶然的外在因素导致的一般性问题。可以在代码中进行处理。如：空指针异常、数组下标越界等。

## 运行时异常和非运行时异常（checked）的区别？

`unchecked exception`包括`RuntimeException`和`Error`类，其他所有异常称为检查（checked）异常。

1. `RuntimeException`由程序错误导致，应该修正程序避免这类异常发生。
2. `checked Exception`由具体的环境（读取的文件不存在或文件为空或sql异常）导致的异常。必须进行处理，不然编译不通过，可以catch或者throws。

## throw和throws的区别？

- **throw**：用于抛出一个具体的异常对象。

- **throws**：用在方法签名中，用于声明该方法可能抛出的异常。子类方法抛出的异常范围更加小，或者根本不抛异常。

## BIO/NIO/AIO区别的区别？

**同步阻塞IO** : 用户进程发起一个IO操作以后，必须等待IO操作的真正完成后，才能继续运行。

**同步非阻塞IO**: 客户端与服务器通过Channel连接，采用多路复用器轮询注册的`Channel`。提高吞吐量和可靠性。用户进程发起一个IO操作以后，可做其它事情，但用户进程需要轮询IO操作是否完成，这样造成不必要的CPU资源浪费。

**异步非阻塞IO**: 非阻塞异步通信模式，NIO的升级版，采用异步通道实现异步通信，其read和write方法均是异步方法。用户进程发起一个IO操作，然后立即返回，等IO操作真正的完成以后，应用程序会得到IO操作完成的通知。类似Future模式。

## 守护线程是什么？

- 守护线程是运行在后台的一种特殊进程。
- 它独立于控制终端并且周期性地执行某种任务或等待处理某些发生的事件。
- 在 Java 中垃圾回收线程就是特殊的守护线程。

## Java支持多继承吗？

java中，**类不支持**多继承。**接口才支持**多继承。接口的作用是拓展对象功能。当一个子接口继承了多个父接口时，说明子接口拓展了多个功能。当一个类实现该接口时，就拓展了多个的功能。

Java不支持多继承的原因：

- 出于安全性的考虑，如果子类继承的多个父类里面有相同的方法或者属性，子类将不知道具体要继承哪个。
- Java提供了接口和内部类以达到实现多继承功能，弥补单继承的缺陷。

## 如何实现对象克隆？

- 实现`Cloneable`接口，重写 `clone()` 方法。这种方式是浅拷贝，即如果类中属性有自定义引用类型，只拷贝引用，不拷贝引用指向的对象。如果对象的属性的Class也实现 `Cloneable` 接口，那么在克隆对象时也会克隆属性，即深拷贝。
- 结合序列化，深拷贝。
- 通过`org.apache.commons`中的工具类`BeanUtils`和`PropertyUtils`进行对象复制。

## 同步和异步的区别？

同步：发出一个调用时，在没有得到结果之前，该调用就不返回。

异步：在调用发出后，被调用者返回结果之后会通知调用者，或通过回调函数处理这个调用。

## 阻塞和非阻塞的区别？

阻塞和非阻塞关注的是线程的状态。

阻塞调用是指调用结果返回之前，当前线程会被挂起。调用线程只有在得到结果之后才会恢复运行。

非阻塞调用指在不能立刻得到结果之前，该调用不会阻塞当前线程。

> 举个例子，理解下同步、阻塞、异步、非阻塞的区别：
>
> 同步就是烧开水，要自己来看开没开；异步就是水开了，然后水壶响了通知你水开了（回调通知）。阻塞是烧开水的过程中，你不能干其他事情，必须在旁边等着；非阻塞是烧开水的过程里可以干其他事情。

##  Java8的新特性有哪些？

- Lambda 表达式：Lambda允许把函数作为一个方法的参数
- Stream API ：新添加的Stream API（java.util.stream） 把真正的函数式编程风格引入到Java中
- 默认方法：默认方法就是一个在接口里面有了一个实现的方法。
- Optional 类 ：Optional 类已经成为 Java 8 类库的一部分，用来解决空指针异常。
- Date Time API ：加强对日期与时间的处理。

> [Java8 新特性总结]([Java-learning/Java8.md at master · Tyson0314/Java-learning (github.com)](https://github.com/Tyson0314/Java-learning/blob/master/Java/Java8.md))

## 什么是序列化和反序列化？

序列化：把内存中的对象转换为字节序列的过程。

反序列化：把字节序列恢复为Java对象的过程。

## 如何实现序列化

实现`Serializable`接口即可。序列化的时候（如`objectOutputStream.writeObject(user)`），会判断user是否实现了`Serializable`，如果对象没有实现`Serializable`接口，在序列化的时候会抛出`NotSerializableException`异常。源码如下：

```java
// remaining cases
if (obj instanceof String) {
    writeString((String) obj, unshared);
} else if (cl.isArray()) {
    writeArray(obj, desc, unshared);
} else if (obj instanceof Enum) {
    writeEnum((Enum<?>) obj, desc, unshared);
} else if (obj instanceof Serializable) {
    writeOrdinaryObject(obj, desc, unshared);
} else {
    if (extendedDebugInfo) {
        throw new NotSerializableException(
            cl.getName() + "\n" + debugInfoStack.toString());
    } else {
        throw new NotSerializableException(cl.getName());
    }
}
```

## transient关键字的作用？

Java语言的关键字，变量修饰符，如果用transient声明一个实例变量，当对象存储时，它的值不需要维持。

也就是说被transient修饰的成员变量，在序列化的时候其值会被忽略，在被反序列化后， transient 变量的值被设为初始值， 如 int 型的是 0，对象型的是 null。

## 什么是反射？

动态获取的信息以及动态调用对象的方法的功能称为Java语言的反射机制。

在运行状态中，对于任意一个类，能够知道这个类的所有属性和方法。对于任意一个对象，能够调用它的任意一个方法和属性。

## 反射有哪些应用场景呢？

1. JDBC连接数据库时使用`Class.forName()`通过反射加载数据库的驱动程序
2. Eclispe、IDEA等开发工具利用反射动态解析对象的类型与结构，动态提示对象的属性和方法
3. Web服务器中利用反射调用了Sevlet的`service`方法
4. JDK动态代理底层依赖反射实现

## 讲讲什么是泛型？

Java泛型是JDK 5中引⼊的⼀个新特性， 允许在定义类和接口的时候使⽤类型参数。声明的类型参数在使⽤时⽤具体的类型来替换。

泛型最⼤的好处是可以提⾼代码的复⽤性。以List接口为例，我们可以将String、 Integer等类型放⼊List中， 如不⽤泛型， 存放String类型要写⼀个List接口， 存放Integer要写另外⼀个List接口， 泛型可以很好的解决这个问题。
