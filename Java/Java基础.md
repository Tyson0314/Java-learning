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
- [ThreadLocal](#threadlocal)
- [StringBuilder和StringBuffer](#stringbuilder%E5%92%8Cstringbuffer)
  - ["+"和 StringBuilder](#%E5%92%8C-stringbuilder)
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
  - [InputStream 和 OutputStream](#inputstream-%E5%92%8C-outputstream)
  - [Reader 和 Writer](#reader-%E5%92%8C-writer)
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



## 基础

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

### transient

对象只要实现了Serilizable接口，这个对象就可以被序列化。有时类的某些属性不需要被序列化，比如用户有一些敏感信息（如密码，银行卡号等），不希望被序列化后在网络中传输，这时可以在相应的变量加上transient关键字。序列化对象的时候，这个属性就不会序列化到指定的目的地中。

### Exception

所有异常继承了 Throwable。

![异常层次结构](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9pbWcyMDE4LmNuYmxvZ3MuY29tL2Jsb2cvMTI1MjkxMC8yMDE5MDQvMTI1MjkxMC0yMDE5MDQyMDIwMzI0ODUzNC0xODU4MTcxMzU3LnBuZw?x-oss-process=image/format,png)

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

### object方法

object常用方法：

- toString()：默认输出对象地址
- equals()：默认比较两个引用变量是否指向同一个对象（内存地址）
- hashCode()：将与对象相关的信息映射成一个哈希值，默认的实现hashCode值是根据内存地址换算出来。
- finalize()：用于垃圾回收
- clone(): Java中要想自定义类的对象可以被复制，自定义类就必须实现Cloneable中的clone()方法。
- getClass()：获得实例的类型的类，常用于java反射机制
- wait()：当前线程释放锁，进入对象的等待队列
- notify()：用于随机唤醒一个在对象上等待的线程

### equals()和hashcode()

equals与hashcode的关系：
1、如果两个对象调用equals比较返回true，那么它们的hashCode值一定要相同；
2、如果两个对象的hashCode相同，它们并不一定相同。

hashcode方法主要是用来提升对象比较的效率，先进行hashcode()的比较，如果不相同，那就不必在进行equals的比较，这样就大大减少了equals比较的次数，当比较对象的数量很大的时候能提升效率。

之所以重写equals()要重写hashcode()，是为了保证equals()方法返回true的情况下hashcode值也要一致，如果重写了equals()没有重写hashcode()，就会出现两个对象相等但hashcode()不相等的情况。这样，当用其中的一个对象作为键保存到hashMap、hashTable或hashSet中，再以另一个对象作为键值去查找他们的时候，则会查找不到。

### ==和equals

对于基本数据类型，==比较的是他们的值，对于复合数据类型，==比较的是它们的存放地址(同一个new出来的对象)。
equals()默认比较地址值，重写的话按照重写逻辑去比较。

### String拼接

#### StringBuilder和StringBuffer

- 底层都是char数组实现的

- 字符串拼接性能：StringBuilder > StringBuffer > String
- String 是final类，不能被继承，它是字符串常量，String对象一旦创建之后该对象是不可更改的，用+对String做拼接操作，实际上是先通过建立StringBuilder，然后调用append()做拼接操作，所以在大量字符串拼接的时候，会频繁创建StringBuilder，性能较差。
- StringBuilder和StringBuffer的对象是字符串变量，对变量进行操作就是直接对该对象进行修改，所以速度要比String快很多。
- 在线程安全上，StringBuilder是线程不安全的，而StringBuffer是线程安全的，StringBuffer中很多方法带有synchronized关键字，可以保证线程安全。

#### +和StringBuilder

操作符"+"连接字符串会先创建String对象，再把拼接后的内容赋值给新的对象，在频繁修改的情况下会常量大量的对象，性能较差。

StringBuilder 在拼接时不是使用 String 存储，而是放到一个char数组（默认大小为16），不需要额外创建对象，拼接效率较高。



## ThreadLocal
线程本地变量。当使用ThreadLocal维护变量时，ThreadLocal为每个使用该变量的线程提供独立的变量副本，所以每一个线程都可以独立地改变自己的副本，而不会影响其它线程。
每个线程都有一个ThreadLocalMap(ThreadLocal内部类)，Map中元素的键为ThreadLocal，而值对应线程的变量副本。

![image-20200715234257808](../img/threadlocal.png)

调用threadLocal.set()-->调用getMap(Thread)-->返回当前线程的ThreadLocalMap<ThreadLocal, value>-->map.set(this, value)，this是ThreadLocal

```java
public void set(T value) {
    Thread t = Thread.currentThread();
    ThreadLocalMap map = getMap(t);
    if (map != null)
        map.set(this, value);
    else
        createMap(t, value);
}

ThreadLocalMap getMap(Thread t) {
    return t.threadLocals;
}

void createMap(Thread t, T firstValue) {
    t.threadLocals = new ThreadLocalMap(this, firstValue);
}
```
调用get()-->调用getMap(Thread)-->返回当前线程的ThreadLocalMap<ThreadLocal, value>-->map.getEntry(this)，返回value

```java
    public T get() {
        Thread t = Thread.currentThread();
        ThreadLocalMap map = getMap(t);
        if (map != null) {
            ThreadLocalMap.Entry e = map.getEntry(this);
            if (e != null) {
                @SuppressWarnings("unchecked")
                T result = (T)e.value;
                return result;
            }
        }
        return setInitialValue();
    }
```

threadLocals的类型ThreadLocalMap的键为ThreadLocal对象，因为每个线程中可有多个threadLocal变量，如longLocal和stringLocal。

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
ThreadLocal 并不是用来解决共享资源的多线程访问的问题，因为每个线程中的资源只是副本，并不共享。因此ThreadLocal适合作为线程上下文变量，简化线程内传参。

### 内存泄漏

每个Thread都有⼀个ThreadLocalMap的内部属性，⼀个线程⽆论有多少ThreadLocal，都是保存在这个map中的。map的key是ThreaLocal，为弱引用，值是Object 。在GC的时候会⾃动回收key，但是注意value不会被回收，这样便一直存在一条强引用链的关系：Thread --> ThreadLocalMap-->Entry-->Value，所以在线程的⽣命周期内，value⽆法被回收，就会有可能导致出现内存泄漏。

![image-20200715235804982](../img/threadlocal-oom.png)

解决⽅法：每次使⽤完ThreadLocal就调⽤它的remove(ThreadLocal<?> key)⽅法，手动将对应的键值对删除，从⽽避免内存泄漏。



## 线程安全类

线程安全：代码段在多线程下执行和在单线程下执行能获得一样的结果
线程安全类：线程安全的类其方法是同步的，每次只能有一个线程访问，效率较低。
- vector：比arraylist多了个同步化机制，效率较低
- stack：堆栈类，继承自vector
- hashtable：hashtable不允许插入空值，hashmap允许
- enumeration：枚举，相当于迭代器
- StringBuffer

Iterator和Enumeration的重要区别：
- Enumeration为vector/hashtable等类提供遍历接口，Iterator为ArrayList/HashMap提供遍历接口。
- Enumeration只能读集合中的数据，不能删除。
- Enumeration是先进后出，而Iterator是先进先出。
- Enumeration不支持fast-fail机制，不会抛ConcurrentModificationException。



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
List<String> list = new ArrayList<String>(Arrays.asList(array));
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

serialVersionUID 是 Java 为每个序列化类产生的版本标识，可用来保证在反序列时，发送方发送的和接受方接收的是可兼容的对象。类的serialVersionUID的默认值完全依赖于Java编译器的实现。当完成序列化之后，此时对对象进行修改，由编译器生成的serialVersionUID会改变，这样反序列化的时候会报错。可以在序列化对象中添加 serialVersionUID，固定版本号，这样即便序列化对象做了修改，版本都是一致的，就能进行反序列化了。

### 遍历

#### fast-fail

fast-fail是Java集合的一种错误机制。当多个线程对同一个集合进行操作时，就有可能会产生fast-fail事件。
例如：当线程a正通过iterator遍历集合时，另一个线程b修改了集合的内容，此时modCount（记录集合操作过程的修改次数）会加1，不等于expectedModCount，那么线程a访问集合的时候，就会抛出ConcurrentModificationException，产生fast-fail事件。边遍历边修改集合也会产生fast-fail事件。

解决方法：

- 使用Colletions.synchronizedList方法或在修改集合内容的地方加上synchronized。这样的话，增删集合内容的同步锁会阻塞遍历操作，影响性能。
- 使用CopyOnWriteArrayList来替换ArrayList。在对CopyOnWriteArrayList进行修改操作的时候，会拷贝一个新的数组，对新的数组进行操作，操作完成后再把引用移到新的数组。

#### fail-safe

fail-safe允许在遍历的过程中对容器中的数据进行修改。因为采用安全失败机制的集合容器，在遍历时不是直接在集合内容上访问的，而是先copy原有集合内容，在拷贝的集合上进行遍历。

由于迭代时是对原集合的拷贝的值进行遍历，所以在遍历过程中对原集合所作的修改并不能被迭代器检测到，所以不会触发`ConcurrentModificationException`。

java.util.concurrent包下的容器都是安全失败的，可以在多线程下并发使用。常见的的使用fail-safe方式遍历的容器有`ConcerrentHashMap`和`CopyOnWriteArrayList`等。

fail-safe机制有两个问题：（1）需要复制集合，产生大量的无效对象，内存开销大；（2）不能访问到修改后的内容 。

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

继承自 InputStream 或 Reader 的类都具有 read() 方法，用于读取单个字节或者字节数组；继承自 OutputStream 或 Writer 的类都含有 write() 方法，用于写单个字节或字节数组。

### InputStream 和 OutputStream 

InputStream 用来表示那些从不同数据源产生输入的类。这些数据源包括：1.字节数组；2.String 对象；3.文件；4.管道；5.一个由其他种类的流组成的序列。

InputStream 类有一个抽象方法：`abstract int read()`，这个方法将读入并返回一个字节，或者在遇到输入源结尾时返回-1。

OutputStream 决定了输出所要去的目标：字节数组、文件或管道。OutputStream 的 `abstract void write(int b)` 可以向某个输出位置写出一个字节。

read() 和 write() 方法在执行时都将阻塞，等待数据被读入或者写出。

### Reader 和 Writer

字符流是由通过字节流转换得到的，转化过程耗时，而且容易出现乱码问题。I/O 流提供了一个直接操作字符的接口，方便我们平时对字符进行流操作。如果音频文件、图片等媒体文件用字节流比较好，如果涉及到字符的话使用字符流比较好。

```java
abstract int read();
abstract void write(char c);
```

### 同步异步

同步：发出一个调用时，在没有得到结果之前，该调用就不返回。

异步：在调用发出后，被调用者返回结果之后会通知调用者，或通过回调函数处理这个调用。

### 阻塞非阻塞

阻塞调用是指调用结果返回之前，当前线程会被挂起。调用线程只有在得到结果之后才会恢复运行。

非阻塞调用指在不能立刻得到结果之前，该调用不会阻塞当前线程。

同步就是烧开水，要自己来看开没开；异步就是水开了，然后水壶响了通知你水开了（回调通知）。阻塞是烧开水的过程中，你不能干其他事情，必须在旁边等着；非阻塞是烧开水的过程里可以干其他事情。

### BIO

同步阻塞I/O模式，数据的读取写入必须阻塞在一个线程内等待其完成。

### NIO

NIO是一种同步非阻塞的I/O模型，在Java 1.4 中引入了 NIO 框架，对应 java.nio 包，提供了 Channel , Selector，Buffer等抽象。

NIO与IO区别:

- IO是面向流的，NIO是面向缓冲区的；
- IO流是阻塞的，NIO流是不阻塞的;
- NIO有选择器，而IO没有。

Buffer：Buffer用于和Channel交互。从Channel中读取数据到Buffer里，从Buffer把数据写入到Channel。

Channel：NIO 通过Channel（通道） 进行读写。通道是双向的，可读也可写，而流的读写是单向的。无论读写，通道只能和Buffer交互。

Selector：使用更少的线程来就可以来处理通道了，相比使用多个线程，避免了线程上下文切换带来的开销。

### AIO

异步非阻塞 IO。异步 IO 是基于事件和回调机制实现的，也就是应用操作之后会直接返回，不会堵塞在那里，当后台处理完成，操作系统会通知相应的线程进行后续的操作。

### BIO/NIO/AIO区别

同步阻塞IO : 用户进程发起一个IO操作以后，必须等待IO操作的真正完成后，才能继续运行。
同步非阻塞IO: 客户端与服务器通过Channel连接，采用多路复用器轮询注册的Channel。提高吞吐量和可靠性。用户进程发起一个IO操作以后，可做其它事情，但用户进程需要经常询问IO操作是否完成，这样造成不必要的CPU资源浪费。
异步非阻塞IO: 非阻塞异步通信模式，NIO的升级版，采用异步通道实现异步通信，其read和write方法均是异步方法。用户进程发起一个IO操作，然后立即返回，等IO操作真正的完成以后，应用程序会得到IO操作完成的通知。类比Future模式。