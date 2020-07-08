<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Java特性](#java%E7%89%B9%E6%80%A7)
  - [面向对象](#%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1)
  - [面向对象特性](#%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%89%B9%E6%80%A7)
  - [多态怎么实现](#%E5%A4%9A%E6%80%81%E6%80%8E%E4%B9%88%E5%AE%9E%E7%8E%B0)
  - [接口与抽象类区别](#%E6%8E%A5%E5%8F%A3%E4%B8%8E%E6%8A%BD%E8%B1%A1%E7%B1%BB%E5%8C%BA%E5%88%AB)
  - [接口的用处](#%E6%8E%A5%E5%8F%A3%E7%9A%84%E7%94%A8%E5%A4%84)
  - [反射机制](#%E5%8F%8D%E5%B0%84%E6%9C%BA%E5%88%B6)
- [语法](#%E8%AF%AD%E6%B3%95)
  - [static final](#static-final)
  - [泛型](#%E6%B3%9B%E5%9E%8B)
  - [访问修饰符](#%E8%AE%BF%E9%97%AE%E4%BF%AE%E9%A5%B0%E7%AC%A6)
  - [程序执行顺序](#%E7%A8%8B%E5%BA%8F%E6%89%A7%E8%A1%8C%E9%A1%BA%E5%BA%8F)
- [Exception](#exception)
- [集合](#%E9%9B%86%E5%90%88)
  - [hashMap](#hashmap)
  - [hashSet](#hashset)
  - [HashMap和HashTable](#hashmap%E5%92%8Chashtable)
  - [LinkedHashMap底层实现](#linkedhashmap%E5%BA%95%E5%B1%82%E5%AE%9E%E7%8E%B0)
  - [ConcurrentHashMap 和 Hashtable 的key和value不能为null？](#concurrenthashmap-%E5%92%8C-hashtable-%E7%9A%84key%E5%92%8Cvalue%E4%B8%8D%E8%83%BD%E4%B8%BAnull)
  - [treemap底层](#treemap%E5%BA%95%E5%B1%82)
  - [list/hashset/hashmap排序](#listhashsethashmap%E6%8E%92%E5%BA%8F)
  - [Stack](#stack)
  - [ArrayDeque](#arraydeque)
- [ThreadLocal](#threadlocal)
- [StringBuilder和StringBuffer](#stringbuilder%E5%92%8Cstringbuffer)
- [线程安全类](#%E7%BA%BF%E7%A8%8B%E5%AE%89%E5%85%A8%E7%B1%BB)
- [object方法](#object%E6%96%B9%E6%B3%95)
  - [为什么重写equals()要重写hashcode()](#%E4%B8%BA%E4%BB%80%E4%B9%88%E9%87%8D%E5%86%99equals%E8%A6%81%E9%87%8D%E5%86%99hashcode)
  - [==和equals的区别](#%E5%92%8Cequals%E7%9A%84%E5%8C%BA%E5%88%AB)
- [常见操作](#%E5%B8%B8%E8%A7%81%E6%93%8D%E4%BD%9C)
  - [排序](#%E6%8E%92%E5%BA%8F)
  - [数组操作](#%E6%95%B0%E7%BB%84%E6%93%8D%E4%BD%9C)
  - [拷贝](#%E6%8B%B7%E8%B4%9D)
    - [数组拷贝](#%E6%95%B0%E7%BB%84%E6%8B%B7%E8%B4%9D)
    - [对象拷贝](#%E5%AF%B9%E8%B1%A1%E6%8B%B7%E8%B4%9D)
  - [序列化](#%E5%BA%8F%E5%88%97%E5%8C%96)
    - [什么情况下需要序列化？](#%E4%BB%80%E4%B9%88%E6%83%85%E5%86%B5%E4%B8%8B%E9%9C%80%E8%A6%81%E5%BA%8F%E5%88%97%E5%8C%96)
    - [如何实现序列化](#%E5%A6%82%E4%BD%95%E5%AE%9E%E7%8E%B0%E5%BA%8F%E5%88%97%E5%8C%96)
    - [serialVersionUID](#serialversionuid)
  - [遍历](#%E9%81%8D%E5%8E%86)
    - [fast-fail](#fast-fail)
    - [fast-safe](#fast-safe)
    - [移除集合元素](#%E7%A7%BB%E9%99%A4%E9%9B%86%E5%90%88%E5%85%83%E7%B4%A0)
- [transient](#transient)
- [工具类](#%E5%B7%A5%E5%85%B7%E7%B1%BB)
  - [Arrays.sort()](#arrayssort)
  - [归并与快速排序](#%E5%BD%92%E5%B9%B6%E4%B8%8E%E5%BF%AB%E9%80%9F%E6%8E%92%E5%BA%8F)
- [IO流](#io%E6%B5%81)
  - [同步异步](#%E5%90%8C%E6%AD%A5%E5%BC%82%E6%AD%A5)
  - [阻塞非阻塞](#%E9%98%BB%E5%A1%9E%E9%9D%9E%E9%98%BB%E5%A1%9E)
  - [BIO](#bio)
  - [NIO](#nio)
  - [AIO](#aio)
  - [BIO/NIO/AIO区别](#bionioaio%E5%8C%BA%E5%88%AB)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Java特性

### 面向对象

面向过程就是分析出解决问题所需要的步骤，然后用函数把这些步骤一步一步实现，使用的时候一个一个依次调用就可以了。面向对象是把构成问题事务分解成各个对象，分别设计这些对象，然后将他们组装成有完整功能的系统。面向过程只用函数实现，面向对象是用类实现各个功能模块。

例如五子棋，面向过程的设计思路就是首先分析问题的步骤：
1、开始游戏，2、黑子先走，3、绘制画面，4、判断输赢，5、轮到白子，6、绘制画面，7、判断输赢，8、返回步骤2，9、输出最后结果。
把上面每个步骤用分别的函数来实现，问题就解决了。
而面向对象的设计则是从另外的思路来解决问题。整个五子棋可以分为：
1、黑白双方
2、棋盘系统，负责绘制画面
3、规则系统，负责判定诸如犯规、输赢等。
黑白双方负责接受用户输入，并告知棋盘系统棋子布局的变化，棋盘系统接收到了棋子的变化就要负责在屏幕上面显示出这种变化，同时利用规则系统来对棋局进行判定。

### 面向对象特性

面向对象四大特性：封装，继承，多态，抽象

- 封装就是将类的信息隐藏在类内部，不允许外部程序直接访问，而是通过该类的方法实现对隐藏信息的操作和访问。 良好的封装能够减少耦合。
- 继承是从已有的类中派生出新的类，新的类继承父类的属性和行为，并能扩展新的能力，大大增加程序的重用性和易维护性。在Java中是单继承的，也就是说一个子类只有一个父类。
- 多态是同一个行为具有多个不同表现形式或形态的能力。在不修改程序代码的情况下改变程序运行时所绑定的具体代码。
  实现多态的三要素：继承 重写 父类引用指向子类对象。
  静态多态性：通过重载实现，相同的方法有不同的參数列表，可以根据参数的不同，做出不同的处理。
  动态多态性：在子类中重写父类的方法。运行期间判断所引用对象的实际类型，根据其实际类型调用相应的方法。
- 抽象。把客观事物用代码抽象出来。

### 多态怎么实现

Java提供了编译时多态和运行时多态两种多态机制。编译时多态通过重载实现，根据传入参数不同调用不同的方法。运行时多态通过重写来实现，在子类中重写父类的方法，运行期间判断所引用对象的实际类型，根据其实际类型调用相应的方法。

### 接口与抽象类区别

语法层面上
1）抽象类可以提供成员方法的实现细节，而接口的方法中只能是抽象方法；
2）抽象类中的成员变量可以是各种类型的，接口中的成员变量只能是public static final类型；
3）接口中不能含有静态代码块以及静态方法，而抽象类可以有静态代码块和静态方法；
4）一个类只能继承一个抽象类，而一个类却可以实现多个接口。
设计层面上的区别
1）抽象层次不同。抽象类是对整个类整体进行抽象，包括属性、行为，但是接口只是对类行为进行抽象。继承抽象类是一种"是不是"的关系，而接口实现则是 "有没有"的关系。如果一个类继承了某个抽象类，则子类必定是抽象类的种类，而接口实现则是具备不具备的关系，比如鸟是否能飞。
2） 继承抽象类的是具有相似特点的类，而实现接口的却可以不同的类。

- 门和警报的例子

```
class AlarmDoor extends Door implements Alarm {
    //code
}
```

### 接口的用处

接口是对行为的抽象，通过接口可以实现不相关类的相同行为。
通过接口可以知道一个类具有哪些行为特性。

### 反射机制

运行时动态获取类的信息和动态调用对象的方法的功能称为Java的反射机制。
作用：根据配置文件(Spring的JavaBean)加载不同的类和调用不同的方法，避免在程序中硬编码，增加程序的灵活性。



## 语法

### static final

基本数据类型用final修饰，则不能修改，是常量，对象引用用final修饰，则引用只能指向该对象，不能指向别的对象，但是对象本身可以修改。
final方法不能被子类重写，final类不能被继承。
static变量在初始化后可以修改，static修饰的属性、方法、代码段跟具体对象无关，通过类名即可调用static属性或方法。static不能修饰局部变量。

### 泛型

泛型的本质是参数化类型，也就是说所操作的数据类型被指定为一个参数。编译时会进行类型擦除。

### 访问修饰符

访问修饰符public,private,protected,以及不写（默认）

### 程序执行顺序

1.静态属性，静态方法声明，静态代码块。
2.动态属性，普通方法声明，非静态代码块。
3.构造方法。



## Exception

所有异常继承了 Throwable。

![异常层次结构](https://img2018.cnblogs.com/blog/1252910/201904/1252910-20190420203248534-1858171357.png)

Error是程序无法处理的错误，如虚拟机运行错误、OutOfMemoryError。
unchecked包括RuntimeException和Error类，其他所有异常称为检查（checked）异常。

运行时异常和非运行时异常(checked)的区别：
RuntimeException由程序错误导致，应该修正程序避免这类异常发生。
checked Exception由具体的环境(读取的文件不存在或文件为空或sql异常)导致的异常。必须进行处理，不然编译不通过，可以catch或者throws。

常见的RuntimeException：

```java
ClassCastException
IndexOutOfBoundsException
NullPointerException
ArrayStoreException
NumberFormatException
ArithmeticException
```

throw：用于抛出一个具体的异常对象。
throws：用在方法签名中，用于声明该方法可能抛出的异常。

子类方法抛出的异常范围更加小，或者根本不抛异常。



## 集合

以 Map 结尾的类都实现了 Map 接口，其他所有的类都实现了 Collection 接口。

![](../img/Java-Collections.jpeg)

### hashMap

从结构实现来讲，HashMap是数组+链表+红黑树（JDK1.8增加了红黑树部分）实现的， 链表长度大于8就把链表转换为红黑树，红黑树节点个数小于6时转化为链表，防止频繁的转化。

Hash算法：取key的hashCode值、高位运算、取模运算。

```
h=key.hashCode() //第一步 取hashCode值
h^(h>>>16)  //第二步 高位参与运算
return h&(length-1);  //第三步 取模运算
```

在JDK1.8的实现中，优化了高位运算的算法，通过hashCode()的高16位异或低16位实现的：这么做可以在数组比较小的时候，也能保证考虑到高低位都参与到Hash的计算中，可以减少冲突，同时不会有太大的开销。

扩容机制：当数组元素个数大于threshold时，会进行扩容，使用2倍容量的数组代替原有数组，采用单链表头插入的方式将原数组元素拷贝到新数组，resize后，元素的位置要么是在原位置，要么是在原位置再移动2次幂的位置。resize的过程，均匀的把之前的冲突的节点分散到新的bucket了。这一块就是JDK1.8新增的优化点。


put方法流程图(单链表尾插入的方式，需要遍历链表，检查有没有重复的key)
![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9pbWFnZXMyMDE4LmNuYmxvZ3MuY29tL2Jsb2cvMTI1MjkxMC8yMDE4MDkvMTI1MjkxMC0yMDE4MDkwMjE2MTY0MjIzNi0xMDAxNzA3MDUwLnBuZw?x-oss-process=image/format,png)

http://www.importnew.com/20386.html
https://www.cnblogs.com/yangming1996/p/7997468.html

[HashMap 死循环](https://coolshell.cn/articles/9606.html)

### hashSet

对于 HashSet 而言，它是基于 HashMap 实现的。
放入HashSet中的元素实际上由HashMap的key来保存，而HashMap的value则存储了一个静态的Object对象。

### HashMap和HashTable

HashMap和Hashtable都实现了Map接口

1. HashMap可以接受为null的键值(key)和值(value)，key为null的键值对放在下标为0的头结点的链表中，而Hashtable则不行。
2. HashMap是非线程安全的，HashTable是线程安全的。Jdk1.5提供了ConcurrentHashMap，它是HashTable的替代。
3. 由于Hashtable是synchronized，所以在单线程环境下它比HashMap要慢。
4. 哈希值的使用不同，HashTable直接使用对象的hashCode。而HashMap重新计算hash值。
5. 另一个区别是HashMap的迭代器是fail-fast迭代器，而Hashtable的enumerator迭代器不是fail-fast的。所以当有其它线程改变了HashMap的结构（增加或者移除元素），将会抛出ConcurrentModificationException，但迭代器本身的remove()方法移除元素则不会抛出ConcurrentModificationException异常。

### LinkedHashMap底层实现

HashMap是无序的，迭代HashMap所得到元素的顺序并不是它们最初放到HashMap的顺序，即不能保持它们的插入顺序。
LinkedHashMap继承于HashMap，是HashMap和LinkedList的融合体，具备两者的特性。每次put操作都会将entry插入到双向链表的尾部。
LinkedHashMap的Entry结构，before/after/hash/key/value/next(before/afer是LinkedHashMap独有的，用于维护整个双向链表)。
![引自https://blog.csdn.net/justloveyou_/article/details/71713781](https://img-blog.csdn.net/20180921131709360?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1R5c29uMDMxNA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

### ConcurrentHashMap 和 Hashtable 的key和value不能为null？

HashMap.java 部分源码：

```java
    static final int hash(Object key) {
        int h;
        return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);//key为null时，hash值为0
    }
```

ConcurrentHashMap.java 部分源码：

```java
    /** Implementation for put and putIfAbsent */
    final V putVal(K key, V value, boolean onlyIfAbsent) {
        if (key == null || value == null) throw new NullPointerException();
        int hash = spread(key.hashCode());
        int binCount = 0;
        ......
    }
```

ConcurrentHashmap和Hashtable都支持并发，当你通过get(k)获取对应的value时，如果获取到的是null时，无法判断是key 对应的 value 为 null，还是这个 key 从来没有做过映射，在多线程里面是模糊不清的，所以不让put null。HashMap用于非并发场景，可以通过contains(key)来判断是否存在key。而支持并发的Map在调用m.get(key)之后，再调用m.contains(key)，两个调用之间可能有其他线程删除了key，得到的结果不准确，产生多线程安全问题。因此ConcurrentHashMap 和 Hashtable 的key和value不能为null。

### treemap底层

 1. TreeMap是有序的key-value集合，通过红黑树实现。根据键的自然顺序进行排序或根据提供的Comparator进行排序。
 2. TreeMap继承了AbstractMap，实现了NavigableMap接口，支持一系列的导航方法，给定具体搜索目标，可以返回最接近的匹配项。如floorEntry()、ceilingEntry()分别返回小于等于、大于等于给定键关联的Map.Entry()对象，不存在则返回null。lowerKey()、floorKey、ceilingKey、higherKey()只返回关联的key。

### list/hashset/hashmap排序

https://blog.csdn.net/whuxiaoqiang/article/details/9371923

### Stack

Stack继承自 Vector 类，peek()、pop()、push()和 search()都是同步方法。Vector底层用数组实现（默认长度为10）。效率较低，不推荐使用。

### ArrayDeque

ArrayDeque实现了双端队列，内部使用循环数组实现，默认大小为16。

特点：

1. 在两端添加、删除元素的效率较高

2. 根据元素内容查找和删除的效率比较低。

3. 没有索引位置的概念，不能根据索引位置进行操作。

ArrayDeque和LinkedList都实现了Deque接口，如果只需要从两端进行操作，ArrayDeque效率更高一些。如果同时需要根据索引位置进行操作，或者经常需要在中间进行插入和删除（LinkedList有相应的 api，如add(int index, E e)），则应该选LinkedList。

ArrayDeque和LinkedList都是线程不安全的，可以使用Collections工具类中synchronizedXxx()转换成线程同步。



## ThreadLocal
线程本地变量。当使用ThreadLocal维护变量时，ThreadLocal为每个使用该变量的线程提供独立的变量副本，所以每一个线程都可以独立地改变自己的副本，而不会影响其它线程所对应的副本。
每个线程都有一个ThreadLocalMap(ThreadLocal内部类)，Map中元素的键为ThreadLocal，而值对应线程的变量副本。
调用set()-->调用getMap(Thread)-->返回当前线程的ThreadLocalMap<ThreadLocal, value>-->map.set(this, value)，this是ThreadLocal
调用get()-->调用getMap(Thread)-->返回当前线程的ThreadLocalMap<ThreadLocal, value>-->map.getEntry(this)，返回value

```
public class ThreadLocalDemo {
    ThreadLocal<Long> longLocal = new ThreadLocal<>();

    public void set() {
        longLocal.set(Thread.currentThread().getId());
    }
    public Long get() {
        return longLocal.get();
    }

    public static void main(String[] args) throws InterruptedException {
        ThreadLocalDemo threadLocalDemo = new ThreadLocalDemo();
        threadLocalDemo.set();
        System.out.println(threadLocalDemo.get());

        Thread thread = new Thread(() -> {
            threadLocalDemo.set();
            System.out.println(threadLocalDemo.get());
        }
        );

        thread.start();
        thread.join();

        System.out.println(threadLocalDemo.get());
    }
}
```
threadLocals的类型ThreadLocalMap的键值为ThreadLocal对象，因为每个线程中可有多个threadLocal变量，如longLocal和stringLocal。


## StringBuilder和StringBuffer
- 字符串拼接性能：StringBuilder > StringBuffer > String
- String 是final类，不能被继承，它是字符串常量，String对象一旦创建之后该对象是不可更改的，用+对String做拼接操作，实际上是先通过建立StringBuilder，然后调用append()做拼接操作，所以在大量字符串拼接的时候，会频繁创建StringBuilder，性能较差。
- StringBuilder和StringBuffer的对象是字符串变量，对变量进行操作就是直接对该对象进行修改，所以速度要比String快很多。
- 在线程安全上，StringBuilder是线程不安全的，而StringBuffer是线程安全的，StringBuffer中很多方法带有synchronized关键字，可以保证线程安全。



## 线程安全类

线程安全：代码段在多线程下执行和在单线程下执行能获得一样的结果
线程安全类：线程安全的类其方法是同步的，每次只能一个访问。是重量级对象，效率较低。
- vector：比arraylist多了个同步化机制，效率较低
- stack：堆栈类，由vector扩展而来
- hashtable：hashtable不允许插入空值，hashmap允许
- enumeration：枚举，相当于迭代器
- StringBuffer

Iterator和Enumeration的重要区别：
- Enumeration为vector/hashtable等类提供遍历接口，Iterator为ArrayList/HashMap提供遍历接口。
- Enumeration只能读集合中的数据，不能删除。
- Enumeration是先进后出，而Iterator是先进先出。
- Enumeration不支持fast-fail机制，不会抛ConcurrentModificationException。



## object方法
object常用方法：
- toString()：默认输出对象地址
- equals()：默认比较两个引用变量是否指向同一个对象（内存地址）
- hashCode()：将与对象相关的信息映射成一个哈希值，默认的实现hashCode值是根据内存地址换算出来。
- finalize()：用于垃圾回收
- clone(): Java中要想自定义类的对象可以被复制，自定义类就必须实现Cloneable中的clone()方法。
- getClass()：获得实例的类型的类，常用于java反射机制
- wait()：当前线程释放锁，进入对象的等待队列
- notify()：用于随机唤醒一个在对象上等待的线程

### 为什么重写equals()要重写hashcode()

equals与hashcode的关系：
1、如果两个对象调用equals比较返回true，那么它们的hashCode值一定要相同；
2、如果两个对象的hashCode相同，它们并不一定相同。

hashcode方法主要是用来提升对象比较的效率，先进行hashcode()的比较，如果不相同，那就不必在进行equals的比较，这样就大大减少了equals比较的次数，当比较对象的数量很大的时候能提升效率。

之所以重写equals()要重写hashcode()，是为了保证equals()方法返回true的情况下hashcode值也要一致，如果重写了equals()没有重写hashcode()，就会出现两个对象相等但hashcode()不相等的情况。这样，当用其中的一个对象作为键保存到hashMap、hashTable或hashSet中，再以另一个对象作为键值去查找他们的时候，则会查找不到。

### ==和equals的区别

对于基本数据类型，==比较的是他们的值，对于复合数据类型，==比较的是它们的存放地址(同一个new出来的对象)。
equals()默认比较地址值，重写的话按照重写逻辑去比较。



## 常见操作

### 排序

数组

```java
Arrays.sort(jdArray, (int[] jd1, int[] jd2) -> {return jd1[0] - jd2[0];});
```



### 数组操作

数组遍历

```java
Arrays.asList(array).stream().forEach(System.out::println);
```

数组排序

```java
Arrays.sort(players,(String s1,String s2)->(s1.compareTo(s2)));
```

集合转数组：

```java
//List --> Array
List<Integer> list = new ArrayList<>();
list.add(1);
Integer[] arr = list.toArray(new Integer[list.size()]);
```

数组转集合：

```java
//Array --> List
String[] array = {"java", "c"};
List<String> list = Arrays.asList(array);
```

该方法存在一定的弊端，返回的list是Arrays里面的一个静态内部类(数组的视图)，对list的操作会反映在原数组上，而且list是定长的，不支持add、remove操作。

该ArrayList并非java.util.ArrayList，而是 java.util.Arrays.ArrayList.ArrayList<T>(T[])，该类并未实现add、remove方法，因此在使用时存在局限性。

代替方案：

```java
List<String> list = new ArrayList<String>(Arrays.asList(array))
```



### 拷贝

#### 数组拷贝

```java
System.arraycopy(Object src, int srcPos, Object dest, int desPos, int length)
Arrays.copyOf(originalArr, length) //length为拷贝的长度
Arrays.copyOfRange(originalArr, from, to); //from包含，to不包含
```

二维数组拷贝：

```java
int[][] arr = {{1, 2},{3, 4}};
int[][] newArr = new int[2][2];
for(int i = 0; i < arr.length; i++) {
    newArr[i] = arr[i].clone();
}
```

#### 对象拷贝

实现对象克隆有两种方式：

1. 实现Cloneable接口并重写Object类中的clone()方法；

2. 实现Serializable接口，通过对象的序列化和反序列化实现克隆，可以实现真正的深度克隆。

实现cloneable接口，重写clone方法。

```java
public class Dog implements Cloneable {
    private String id;
    private String name;

    public Dog(String id, String name) {
        this.id = id;
        this.name = name;
    }

    // 省略 getter 、 setter 以及 toString 方法

    @Override
    public Dog clone() throws CloneNotSupportedException {
        Dog dog = (Dog) super.clone();

        return dog;
    }
}
```

使用：

```java
Dog dog1 = new Dog("1", "Dog1");
Dog dog2 = dog1.clone();

dog2.setName("Dog1 changed");

System.out.println(dog1); // Dog{id='1', name='Dog1'}
System.out.println(dog2); // Dog{id='1', name='Dog1 changed'}
```

如果一个类引用了其他类，引用的类也需要实现cloneable接口，比较麻烦。可以将所有的类都实现Serializable接口，通过序列化反序列化实现对象的深度拷贝。

### 序列化

序列化：把内存中的对象转换为字节序列的过程称为对象的序列化。

#### 什么情况下需要序列化？

当你想把的内存中的对象状态保存到一个文件中或者数据库中时候；
当你想在网络上传送对象的时候；

#### 如何实现序列化

实现Serializable接口即可。序列化的时候（如objectOutputStream.writeObject(user)），会判断user是否实现了Serializable（obj instanceof Serializable），如果对象没有实现Serializable接口，在序列化的时候会抛出NotSerializableException异常。

#### serialVersionUID

当完成序列化之后，此时对对象进行修改，由于版本号问题，反序列化的时候会报错。可以在序列化对象添加 serialVersionUID，固定版本号，这样即便序列化对象做了修改，版本都是一致的，就能进行反序列化了。

### 遍历

#### fast-fail

fast-fail是Java集合的一种错误机制。当多个线程对同一个集合进行操作时，就有可能会产生fast-fail事件。
例如：当线程a正通过iterator遍历集合时，另一个线程b修改了集合的内容，此时modCount（记录集合操作过程的修改次数）会加1，不等于expectedModCount，那么线程a访问集合的时候，就会抛出ConcurrentModificationException，产生fast-fail事件。

解决方法：

- 使用Colletions.synchronizedList方法或在修改集合内容的地方加上synchronized。这样的话，增删集合内容的同步锁会阻塞遍历操作，影响性能。
- 使用CopyOnWriteArrayList来替换ArrayList。在对CopyOnWriteArrayList进行修改操作的时候，会拷贝一个新的数组，对新的数组进行操作，操作完成后再把引用移到新的数组。

#### fast-safe

采用安全失败机制的集合容器，在遍历时不是直接在集合内容上访问的，而是先copy原有集合内容，在拷贝的集合上进行遍历。

由于迭代时是对原集合的拷贝的值进行遍历，所以在遍历过程中对原集合所作的修改并不能被迭代器检测到，所以不会出发`ConcurrentModificationException`。

java.util.concurrent包下的容器都是安全失败的，可以在多线程下并发使用。常见的的使用fail-safe方式遍历的容器有`ConcerrentHashMap`和`CopyOnWriteArrayList`等。

fail-safe机制有两个问题：（1）需要复制集合，产生大量的无效对象，开销大；（2）不能访问到修改后的内容 。

#### 移除集合元素

遍历时安全的移除集合中的元素，要使用遍历器Iterator和iterator.remove()方法。next()必须在remove()之前调用。

```
ArrayList<String> list = new ArrayList<String>(Arrays.asList("a","b","c","d"));
Iterator<String> iter = list.iterator();
while(iter.hasNext()){
        String s = iter.next();
        if(s.equals("a")){
            iter.remove();
    }
}
```



## transient
对象只要实现了Serilizable接口，这个对象就可以被序列化。有时类的某些属性不需要被序列化，比如用户有一些敏感信息（如密码，银行卡号等），不希望被序列化后在网络中传输，这时可以在相应的变量加上transient关键字。序列化对象的时候，这个属性就不会序列化到指定的目的地中。



## 工具类

### Arrays.sort()

底层原理：

1. 判断数组的长度是否大于286，大于则使用归并排序

2. 判断数组长度是否小于47，小于则直接采用插入排序，对于小数组来说，插入排序效率更高

3. 否则采用双轴快排，使用两个pivot，每轮把数组分成3段，在没有明显增加比较次数的情况下巧妙地减少了递归次数。

Collections.sort方法底层就是调用的Arrays.sort方法。

### 归并与快速排序

归并排序相对而言比较次数比快速排序少，移动次数比快速排序多。

对大数组排序。快速排序的sort()采用递归实现，数组规模太大时会发生堆栈溢出，而归并排序sort()采用非递归实现，不存在此问题。

快速排序是不稳定的，而归并排序是稳定的。这里的稳定是指比较相等的数据在排序之后仍然按照排序之前的前后顺序排列。



## IO流

### 同步异步

同步，就是在发出一个*调用*时，在没有得到结果之前，该*调用*就不返回。

异步过程调用发出后，调用者不会立刻得到结果。而是在*调用*发出后，*被调用者*通过状态、通知来通知调用者，或通过回调函数处理这个调用。

### 阻塞非阻塞

阻塞调用是指调用结果返回之前，当前线程会被挂起。调用线程只有在得到结果之后才会返回。

非阻塞调用指在不能立刻得到结果之前，该调用不会阻塞当前线程。

同步就是烧开水，要自己来看开没开；异步就是水开了，然后水壶响了通知你水开了（回调通知）。阻塞是烧开水的过程中，你不能干其他事情（即你被阻塞住了）；非阻塞是烧开水的过程里可以干其他事情。

### BIO

同步阻塞I/O模式，数据的读取写入必须阻塞在一个线程内等待其完成。

### NIO

NIO是一种同步非阻塞的I/O模型，在Java 1.4 中引入了 NIO 框架，对应 java.nio 包，提供了 Channel , Selector，Buffer等抽象。

Buffer：在NIO厍中，所有数据都是用缓冲区处理的。在读取数据时，它是直接读到缓冲区中的; 在写入数据时，写入到缓冲区中。任何时候访问NIO中的数据，都是通过缓冲区进行操作。

Channel：NIO 通过Channel（通道） 进行读写。通道是双向的，可读也可写，而流的读写是单向的。无论读写，通道只能和Buffer交互。因为 Buffer，通道可以异步地读写。

Selector：选择器用于使用单个线程处理多个通道。因此，它需要较少的线程来处理这些通道。线程之间的切换对于操作系统来说是昂贵的。 因此，为了提高系统效率选择器是有用的。

### AIO

异步非阻塞 IO。异步 IO 是基于事件和回调机制实现的，也就是应用操作之后会直接返回，不会堵塞在那里，当后台处理完成，操作系统会通知相应的线程进行后续的操作。

### BIO/NIO/AIO区别

同步阻塞IO : 用户进程发起一个IO操作以后，必须等待IO操作的真正完成后，才能继续运行。
同步非阻塞IO: 非阻塞同步通信模式，客户端与服务器通过Channel连接，采用多路复用器轮询注册的Channel。提高吞吐量和可靠性。用户进程发起一个IO操作以后，可做其它事情，但用户进程需要经常询问IO操作是否完成，这样造成不必要的CPU资源浪费。
异步非阻塞IO: 非阻塞异步通信模式，NIO的升级版，采用异步通道实现异步通信，其read和write方法均是异步方法。用户进程发起一个IO操作然后，立即返回，等IO操作真正的完成以后，应用程序会得到IO操作完成的通知。类比Future模式。