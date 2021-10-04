<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [讲一下JVM内存结构？](#%E8%AE%B2%E4%B8%80%E4%B8%8Bjvm%E5%86%85%E5%AD%98%E7%BB%93%E6%9E%84)
  - [程序计数器](#%E7%A8%8B%E5%BA%8F%E8%AE%A1%E6%95%B0%E5%99%A8)
  - [虚拟机栈](#%E8%99%9A%E6%8B%9F%E6%9C%BA%E6%A0%88)
  - [本地方法栈](#%E6%9C%AC%E5%9C%B0%E6%96%B9%E6%B3%95%E6%A0%88)
  - [堆](#%E5%A0%86)
  - [方法区](#%E6%96%B9%E6%B3%95%E5%8C%BA)
  - [运行时常量池](#%E8%BF%90%E8%A1%8C%E6%97%B6%E5%B8%B8%E9%87%8F%E6%B1%A0)
  - [直接内存](#%E7%9B%B4%E6%8E%A5%E5%86%85%E5%AD%98)
- [Java对象的定位方式](#java%E5%AF%B9%E8%B1%A1%E7%9A%84%E5%AE%9A%E4%BD%8D%E6%96%B9%E5%BC%8F)
- [说一下堆栈的区别？](#%E8%AF%B4%E4%B8%80%E4%B8%8B%E5%A0%86%E6%A0%88%E7%9A%84%E5%8C%BA%E5%88%AB)
- [什么情况下会发生栈内存溢出？](#%E4%BB%80%E4%B9%88%E6%83%85%E5%86%B5%E4%B8%8B%E4%BC%9A%E5%8F%91%E7%94%9F%E6%A0%88%E5%86%85%E5%AD%98%E6%BA%A2%E5%87%BA)
- [类文件结构](#%E7%B1%BB%E6%96%87%E4%BB%B6%E7%BB%93%E6%9E%84)
- [什么是类加载？类加载的过程？](#%E4%BB%80%E4%B9%88%E6%98%AF%E7%B1%BB%E5%8A%A0%E8%BD%BD%E7%B1%BB%E5%8A%A0%E8%BD%BD%E7%9A%84%E8%BF%87%E7%A8%8B)
- [什么是双亲委派模型？](#%E4%BB%80%E4%B9%88%E6%98%AF%E5%8F%8C%E4%BA%B2%E5%A7%94%E6%B4%BE%E6%A8%A1%E5%9E%8B)
- [为什么需要双亲委派模型？](#%E4%B8%BA%E4%BB%80%E4%B9%88%E9%9C%80%E8%A6%81%E5%8F%8C%E4%BA%B2%E5%A7%94%E6%B4%BE%E6%A8%A1%E5%9E%8B)
- [什么是类加载器，类加载器有哪些?](#%E4%BB%80%E4%B9%88%E6%98%AF%E7%B1%BB%E5%8A%A0%E8%BD%BD%E5%99%A8%E7%B1%BB%E5%8A%A0%E8%BD%BD%E5%99%A8%E6%9C%89%E5%93%AA%E4%BA%9B)
- [类的实例化顺序？](#%E7%B1%BB%E7%9A%84%E5%AE%9E%E4%BE%8B%E5%8C%96%E9%A1%BA%E5%BA%8F)
- [如何判断一个对象是否存活？](#%E5%A6%82%E4%BD%95%E5%88%A4%E6%96%AD%E4%B8%80%E4%B8%AA%E5%AF%B9%E8%B1%A1%E6%98%AF%E5%90%A6%E5%AD%98%E6%B4%BB)
- [可作为GC Roots的对象有哪些？](#%E5%8F%AF%E4%BD%9C%E4%B8%BAgc-roots%E7%9A%84%E5%AF%B9%E8%B1%A1%E6%9C%89%E5%93%AA%E4%BA%9B)
- [什么情况下类会被卸载？](#%E4%BB%80%E4%B9%88%E6%83%85%E5%86%B5%E4%B8%8B%E7%B1%BB%E4%BC%9A%E8%A2%AB%E5%8D%B8%E8%BD%BD)
- [强引用、软引用、弱引用、虚引用是什么，有什么区别？](#%E5%BC%BA%E5%BC%95%E7%94%A8%E8%BD%AF%E5%BC%95%E7%94%A8%E5%BC%B1%E5%BC%95%E7%94%A8%E8%99%9A%E5%BC%95%E7%94%A8%E6%98%AF%E4%BB%80%E4%B9%88%E6%9C%89%E4%BB%80%E4%B9%88%E5%8C%BA%E5%88%AB)
- [Minor GC 和 Full GC的区别？](#minor-gc-%E5%92%8C-full-gc%E7%9A%84%E5%8C%BA%E5%88%AB)
- [内存的分配策略？](#%E5%86%85%E5%AD%98%E7%9A%84%E5%88%86%E9%85%8D%E7%AD%96%E7%95%A5)
- [Full GC 的触发条件？](#full-gc-%E7%9A%84%E8%A7%A6%E5%8F%91%E6%9D%A1%E4%BB%B6)
- [垃圾回收算法有哪些？](#%E5%9E%83%E5%9C%BE%E5%9B%9E%E6%94%B6%E7%AE%97%E6%B3%95%E6%9C%89%E5%93%AA%E4%BA%9B)
- [有哪几种垃圾回收器，各自的优缺点是什么？](#%E6%9C%89%E5%93%AA%E5%87%A0%E7%A7%8D%E5%9E%83%E5%9C%BE%E5%9B%9E%E6%94%B6%E5%99%A8%E5%90%84%E8%87%AA%E7%9A%84%E4%BC%98%E7%BC%BA%E7%82%B9%E6%98%AF%E4%BB%80%E4%B9%88)
- [常用的 JVM 调优的参数都有哪些？](#%E5%B8%B8%E7%94%A8%E7%9A%84-jvm-%E8%B0%83%E4%BC%98%E7%9A%84%E5%8F%82%E6%95%B0%E9%83%BD%E6%9C%89%E5%93%AA%E4%BA%9B)
- [JVM调优工具有哪些？](#jvm%E8%B0%83%E4%BC%98%E5%B7%A5%E5%85%B7%E6%9C%89%E5%93%AA%E4%BA%9B)
- [对象头了解吗？](#%E5%AF%B9%E8%B1%A1%E5%A4%B4%E4%BA%86%E8%A7%A3%E5%90%97)
- [main方法执行过程](#main%E6%96%B9%E6%B3%95%E6%89%A7%E8%A1%8C%E8%BF%87%E7%A8%8B)
- [对象创建过程](#%E5%AF%B9%E8%B1%A1%E5%88%9B%E5%BB%BA%E8%BF%87%E7%A8%8B)
- [如何排查 OOM 的问题？](#%E5%A6%82%E4%BD%95%E6%8E%92%E6%9F%A5-oom-%E7%9A%84%E9%97%AE%E9%A2%98)
- [GC是什么？为什么要GC？](#gc%E6%98%AF%E4%BB%80%E4%B9%88%E4%B8%BA%E4%BB%80%E4%B9%88%E8%A6%81gc)
- [参考资料](#%E5%8F%82%E8%80%83%E8%B5%84%E6%96%99)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

> 首先给大家分享一个github仓库，上面放了**200多本经典的计算机书籍**，包括C语言、C++、Java、Python、前端、数据库、操作系统、计算机网络、数据结构和算法、机器学习、编程人生等，可以star一下，下次找书直接在上面搜索，仓库持续更新中~
>
> github地址：https://github.com/Tyson0314/java-books
>
> 如果github访问不了，可以访问gitee仓库。
>
> gitee地址：https://gitee.com/tysondai/java-books

## 讲一下JVM内存结构？

Java 内存模型（JMM）是基于共享内存的多线程通信机制。

JVM内存结构 = 类加载器 + 执行引擎 + 运行时数据区域。

![image-20210905150636105](https://gitee.com/tysondai/img/raw/master/image-20210905150636105.png)

> 图片来源：深入理解Java虚拟机-周志明

### 程序计数器

程序计数器主要有两个作用：

1. 当前线程所执行的字节码的行号指示器，通过改变它实现代码的流程控制，如：顺序执行、选择、循环、异常处理。
2. 在多线程的情况下，程序计数器用于记录当前线程执行的位置，从而当线程被切换回来的时候能够知道该线程上次运行到哪儿了。

程序计数器是唯一一个不会出现 `OutOfMemoryError` 的内存区域，它的生命周期随着线程的创建而创建，随着线程的结束而死亡。

### 虚拟机栈

Java 虚拟机栈是由一个个栈帧组成，而每个栈帧中都拥有：局部变量表、操作数栈、动态链接、方法出口信息。每一次函数调用都会有一个对应的栈帧被压入虚拟机栈，每一个函数调用结束后，都会有一个栈帧被弹出。

局部变量表是用于存放方法参数和方法内的局部变量。

每个栈帧都包含一个指向运行时常量池中该栈所属方法的符号引用，在方法调用过程中，会进行动态链接，将这个符号引用转化为直接引用。

- 部分符号引用在类加载阶段的时候就转化为直接引用，这种转化就是静态链接
- 部分符号引用在运行期间转化为直接引用，这种转化就是动态链接

Java 虚拟机栈也是线程私有的，每个线程都有各自的 Java 虚拟机栈，而且随着线程的创建而创建，随着线程的死亡而死亡。Java 虚拟机栈会出现两种错误：`StackOverFlowError` 和 `OutOfMemoryError`。

可以通过 -Xss 参数来指定每个线程的 Java 虚拟机栈内存大小，在 JDK 1.4 中默认为 256K，而在 JDK 1.5+ 默认为 1M：

```java
java -Xss2M
```

### 本地方法栈

虚拟机栈为虚拟机执行 Java 方法服务，而本地方法栈则为虚拟机使用到的 Native 方法服务。Native 方法一般是用其它语言（C、C++ 或汇编语言等）编写的，并且被编译为基于本机硬件和操作系统的程序，对待这些方法需要特别处理。

本地方法被执行的时候，在本地方法栈也会创建一个栈帧，用于存放该本地方法的局部变量表、操作数栈、动态链接、出口信息。

### 堆

此内存区域的唯一目的就是存放对象实例，几乎所有的对象实例以及数组都在这里分配内存。Java 堆是垃圾收集器管理的主要区域，因此也被称作GC堆。

Java 堆可以细分为：新生代（Eden 空间、From Survivor、To Survivor 空间）和老年代。进一步划分的目的是更好地回收内存，或者更快地分配内存。

通过 -Xms设定程序启动时占用内存大小，通过 -Xmx 设定程序运行期间最大可占用的内存大小。如果程序运行需要占用更多的内存，超出了这个设置值，就会抛出OutOfMemory异常。

```java
java -Xms1M -Xmx2M
```

通过 -Xss 设定每个线程的堆栈大小。设置这个参数，需要评估一个线程大约需要占用多少内存，可能会有多少线程同时运行等。

> 在这里也给大家分享一个github仓库，上面放了**200多本经典的计算机书籍**，包括C语言、C++、Java、Python、前端、数据库、操作系统、计算机网络、数据结构和算法、机器学习、编程人生等，可以star一下，下次找书直接在上面搜索，仓库持续更新中~
>
> github地址：https://github.com/Tyson0314/java-books
>
> 如果github访问不了，可以访问gitee仓库。
>
> gitee地址：https://gitee.com/tysondai/java-books

### 方法区

方法区与 Java 堆一样，是各个线程共享的内存区域，它用于存储已被虚拟机加载的类信息、常量、静态变量、即时编译器编译后的代码等数据。方法区逻辑上属于堆的一部分。

对方法区进行垃圾回收的主要目标是对常量池的回收和对类的卸载。

**永久代**

方法区是 JVM 的规范，而永久代（PermGen）是方法区的一种实现方式，并且只有 HotSpot 有永久代。而对于其他类型的虚拟机，如 JRockit（Oracle）、J9（IBM） 并没有永久代。由于方法区主要存储类的相关信息，所以对于动态生成类的情况比较容易出现永久代的内存溢出。最典型的场景就是，在 jsp 页面比较多的情况，容易出现永久代内存溢出。

**元空间**

JDK 1.8 的时候，HotSpot 的永久代被彻底移除了，使用元空间替代。元空间的本质和永久代类似，都是对JVM规范中方法区的实现。两者最大的区别在于：元空间并不在虚拟机中，而是使用直接内存。

为什么要将永久代替换为元空间呢?

永久代内存受限于 JVM 可用内存，而元空间使用的是直接内存，受本机可用内存的限制，虽然元空间仍旧可能溢出，但是相比永久代内存溢出的概率更小。

### 运行时常量池

运行时常量池是方法区的一部分，在类加载之后，会将编译器生成的各种字面量和符号引号放到运行时常量池。在运行期间动态生成的常量，如 String 类的 intern()方法，也会被放入运行时常量池。

![](https://gitee.com/tysondai/img/raw/master/string-new.png)

![](https://gitee.com/tysondai/img/raw/master/string-intern.png)

![](https://gitee.com/tysondai/img/raw/master/string-equal.png)

> 图片来源：https://blog.csdn.net/soonfly

### 直接内存

直接内存并不是虚拟机运行时数据区的一部分，也不是虚拟机规范中定义的内存区域，但是这部分内存也被频繁地使用。而且也可能导致 OutOfMemoryError 错误出现。

NIO的Buffer提供了DirectBuffer，可以直接访问系统物理内存，避免堆内内存到堆外内存的数据拷贝操作，提高效率。DirectBuffer直接分配在物理内存中，并不占用堆空间，其可申请的最大内存受操作系统限制，不受最大堆内存的限制。

直接内存的读写操作比堆内存快，可以提升程序I/O操作的性能。通常在I/O通信过程中，会存在堆内内存到堆外内存的数据拷贝操作，对于需要频繁进行内存间数据拷贝且生命周期较短的暂存数据，都建议存储到直接内存。

## Java对象的定位方式

Java 程序通过栈上的 reference 数据来操作堆上的具体对象。对象的访问方式由虚拟机实现而定，目前主流的访问方式有使用句柄和直接指针两种：

- 如果使用句柄的话，那么 Java 堆中将会划分出一块内存来作为句柄池，reference 中存储的就是对象的句柄地址，而句柄中包含了对象实例数据与类型数据各自的具体地址信息。使用句柄来访问的最大好处是 reference 中存储的是稳定的句柄地址，在对象被移动时只会改变句柄中的实例数据指针，而 reference 本身不需要修改。
- 直接指针。reference 中存储的直接就是对象的地址。对象包含到对象类型数据的指针，通过这个指针可以访问对象类型数据。使用直接指针访问方式最大的好处就是访问对象速度快，它节省了一次指针定位的时间开销，虚拟机hotspot主要是使用直接指针来访问对象。

## 说一下堆栈的区别？

**物理地址**

堆的物理地址分配对对象是不连续的。在GC的时候需要考虑到不连续的分配，性能较慢。

栈使用的是数据结构中的栈，先进后出的原则，物理地址分配是连续的。性能快。

**存放的内容**

堆存放的是对象的实例和数组。

栈存放：局部变量，操作数栈，返回结果。

**程序的可见度**

堆对于整个应用程序都是共享、可见的。

栈只对于线程是可见的，线程私有。


## 什么情况下会发生栈内存溢出？

当线程请求的栈深度超过了虚拟机允许的最大深度时，会抛出StackOverFlowError异常。通过调整参数`-xss`可以调整JVM栈的大小。

## 类文件结构

Class 文件结构如下：

```java
ClassFile {
    u4             magic; //Class 文件的标志
    u2             minor_version;//Class 的小版本号
    u2             major_version;//Class 的大版本号
    u2             constant_pool_count;//常量池的数量
    cp_info        constant_pool[constant_pool_count-1];//常量池
    u2             access_flags;//Class 的访问标记
    u2             this_class;//当前类
    u2             super_class;//父类
    u2             interfaces_count;//接口
    u2             interfaces[interfaces_count];//一个类可以实现多个接口
    u2             fields_count;//Class 文件的字段属性
    field_info     fields[fields_count];//一个类会可以有个字段
    u2             methods_count;//Class 文件的方法数量
    method_info    methods[methods_count];//一个类可以有个多个方法
    u2             attributes_count;//此类的属性表中的属性数
    attribute_info attributes[attributes_count];//属性表集合
}
```

**魔数**：class 文件标志。

**文件版本**：高版本的 Java 虚拟机可以执行低版本编译器生成的 Class 文件，但是低版本的 Java 虚拟机不能执行高版本编译器生成的 Class 文件。

**常量池**：存放字面量和符号引用。字面量类似于Java的常量，如字符串，声明为final的常量值等。符号引用包含三类：类和接口的全限定名，方法的名称和描述符，字段的名称和描述符。

**访问标志**：识别一些类或者接口层次的访问信息，包括：这个 Class 是类还是接口，是否为 public 或者 abstract 类型，如果是类的话是否声明为 final 等等。

**当前类的索引this_class**：类索引用于确定这个类的全限定名。

**属性表集合**：在 Class 文件，字段表，方法表中都可以携带自己的属性表集合，以用于描述某些场景专有的信息。与 Class 文件中其它的数据项目要求的顺序、长度和内容不同，属性表集合的限制稍微宽松一些，不再要求各个属性表具有严格的顺序，并且只要不与已有的属性名重复，任何人实现的编译器都可以向属性表中写 入自己定义的属性信息，Java 虚拟机运行时会忽略掉它不认识的属性。

## 什么是类加载？类加载的过程？

类的加载指的是将类的class文件中的二进制数据读入到内存中，将其放在运行时数据区的方法区内，然后在堆区创建一个对象，这个对象封装了类在方法区内的数据结构，并且提供了访问方法区内的类信息的接口。

**加载**

类加载过程的一个阶段：通过一个类的完全限定查找此类字节码文件，并利用字节码文件创建一个Class对象。

1. 通过全类名获取定义此类的二进制字节流
2. 将字节流所代表的静态存储结构转换为方法区的运行时数据结构
3. 在内存中生成一个代表该类的 Class 对象，作为方法区这些数据的访问入口

**验证**

确保Class文件的字节流中包含的信息符合虚拟机规范，保证这些信息被当作代码运行后不会危害虚拟机自身的安全。主要包括四种验证：文件格式验证，元数据验证，字节码验证，符号引用验证。

**准备**

为类变量分配内存并设置类变量初始值的阶段。此阶段进行内存分配的仅包括类变量，不包括实例变量和final修饰的static变量（因为final在编译的时候就会分配了），实例变量会在对象实例化时随着对象一块分配在 Java 堆中。

**解析**

虚拟机将常量池内的符号引用替换为直接引用的过程。符号引用用于描述目标，直接引用直接指向目标的地址。

**初始化**

初始化阶段就是执行类构造器\<clinit>()方法的过程。\<clinit>()并不是程序员在Java代码中直接编写的方法，它是Javac编译器的自动生成的，由编译器自动收集类中的所有类变量的赋值动作和静态语句块中的语句合并产生的。

## 什么是双亲委派模型？

一个类加载器收到一个类的加载请求时，它首先不会自己尝试去加载它，而是把这个请求委派给父类加载器去完成，这样层层委派，因此所有的加载请求最终都会传送到顶层的启动类加载器中，只有当父类加载器反馈自己无法完成这个加载请求时，子加载器才会尝试自己去加载。

![](https://gitee.com/tysondai/img/raw/master/image-20210905002827546.png)

双亲委派模型的具体实现代码在抽象类 java.lang.ClassLoader 中，此类的 loadClass() 方法运行过程如下：先检查类是否已经加载过，如果没有则让父类加载器去加载。当父类加载器加载失败时抛出 ClassNotFoundException，此时尝试自己去加载。源码如下：

```java
public abstract class ClassLoader {
    // The parent class loader for delegation
    private final ClassLoader parent;

    public Class<?> loadClass(String name) throws ClassNotFoundException {
        return loadClass(name, false);
    }

    protected Class<?> loadClass(String name, boolean resolve) throws ClassNotFoundException {
        synchronized (getClassLoadingLock(name)) {
            // First, check if the class has already been loaded
            Class<?> c = findLoadedClass(name);
            if (c == null) {
                try {
                    if (parent != null) {
                        c = parent.loadClass(name, false);
                    } else {
                        c = findBootstrapClassOrNull(name);
                    }
                } catch (ClassNotFoundException e) {
                    // ClassNotFoundException thrown if class not found
                    // from the non-null parent class loader
                }

                if (c == null) {
                    // If still not found, then invoke findClass in order
                    // to find the class.
                    c = findClass(name);
                }
            }
            if (resolve) {
                resolveClass(c);
            }
            return c;
        }
    }

    protected Class<?> findClass(String name) throws ClassNotFoundException {
        throw new ClassNotFoundException(name);
    }
}
```

## 为什么需要双亲委派模型？

双亲委派模型的好处：可以防止内存中出现多份同样的字节码。如果没有双亲委派模型而是由各个类加载器自行加载的话，如果用户编写了一个java.lang.Object的同名类并放在ClassPath中，多个类加载器都去加载这个类到内存中，系统中将会出现多个不同的Object类，那么类之间的比较结果及类的唯一性将无法保证。

## 什么是类加载器，类加载器有哪些?

实现通过类的权限定名获取该类的二进制字节流的代码块叫做类加载器。

主要有一下四种类加载器:

- 启动类加载器：用来加载 Java 核心类库，无法被 Java 程序直接引用。
- 扩展类加载器：它用来加载 Java 的扩展库。Java 虚拟机的实现会提供一个扩展库目录。该类加载器在此目录里面查找并加载 Java 类。
- 系统类加载器：它根据应用的类路径来加载 Java 类。可通过 ClassLoader.getSystemClassLoader()来获取它。
- 用户自定义类加载器：通过继承 java.lang.ClassLoader类的方式实现。

##  类的实例化顺序？

1. 父类中的static代码块，当前类的static
2. 顺序执行父类的普通代码块
3. 父类的构造函数
4. 当前类普通代码块
5. 当前类的构造函数

## 如何判断一个对象是否存活？

堆中几乎放着所有的对象实例，对堆垃圾回收前的第一步就是要判断那些对象已经死亡（即不能再被任何途径使用的对象）。判断对象是否存活有两种方法：引用计数法和可达性分析。

**引用计数法**

给对象中添加一个引用计数器，每当有一个地方引用它，计数器就加 1；当引用失效，计数器就减 1；任何时候计数器为 0 的对象就是不可能再被使用的。

这种方法很难解决对象之间相互循环引用的问题。比如下面的代码，objA 和 objB 互相引用，这种情况下，引用计数器的值都是1，不会被垃圾回收。

```java
public class ReferenceCountingGc {
    Object instance = null;
	public static void main(String[] args) {
		ReferenceCountingGc objA = new ReferenceCountingGc();
		ReferenceCountingGc objB = new ReferenceCountingGc();
		objA.instance = objB;
		objB.instance = objA;
		objA = null;
		objB = null;
	}
}
```

**可达性分析**

通过GC Root对象为起点，从这些节点向下搜索，搜索所走过的路径叫引用链，当一个对象到GC Root没有任何的引用链相连时，说明这个对象是不可用的。

![可达性分析](https://gitee.com/tysondai/img/raw/master/可达性分析.png)

## 可作为GC Roots的对象有哪些？

1. 虚拟机栈(栈帧中的本地变量表)中引用的对象
2. 本地方法栈中JNI（Native方法）引用的对象
3. 方法区中类静态属性引用的对象
4. 方法区中常量引用的对象
5. 所有被同步锁（synchronized关键字）持有的对象。

## 什么情况下类会被卸载？

需要同时满足下面 3 个条件才算是 “无用的类” ：

- 该类所有的实例都已经被回收，也就是 Java 堆中不存在该类的任何实例。
- 加载该类的 ClassLoader 已经被回收。
- 该类对应的 java.lang.Class 对象没有在任何地方被引用，无法在任何地方通过反射访问该类的方法。

虚拟机可以对满足上述 3 个条件的类进行回收，但不一定被回收。



## 强引用、软引用、弱引用、虚引用是什么，有什么区别？

**强引用**：垃圾回收器绝不会回收它。当内存空间不足，Java 虚拟机宁愿抛出 OutOfMemoryError 错误，使程序异常终止，也不会靠随意回收具有强引用的对象来解决内存不足问题。

**软引用**：如果内存空间足够，垃圾回收器就不会回收它，如果内存空间不足了，就会回收这些对象的内存。只要垃圾回收器没有回收它，该对象就可以被程序使用。软引用可用来实现内存敏感的高速缓存。

**弱引用**：在垃圾回收器线程扫描它所管辖的内存区域的过程中，一旦发现了只具有弱引用的对象，不管当前内存空间足够与否，都会回收它的内存。不过，由于垃圾回收器是一个优先级很低的线程， 因此不一定会很快发现那些只具有弱引用的对象。

**虚引用**：虚引用并不会决定对象的生命周期。如果一个对象仅持有虚引用，那么它就和没有任何引用一样，在任何时候都可能被垃圾回收。**虚引用主要用来跟踪对象被垃圾回收的活动**。

在程序设计中一般很少使用弱引用与虚引用，使用软引用的情况较多，这是因为软引用可以加速 JVM 对垃圾内存的回收速度，可以维护系统的运行安全，防止内存溢出等问题的产生。

## Minor GC 和 Full GC的区别？

- Minor GC：回收新生代，因为新生代对象存活时间很短，因此 Minor GC 会频繁执行，执行的速度一般也会比较快。

- Full GC：回收老年代和新生代，老年代对象其存活时间长，因此 Full GC 很少执行，执行速度会比 Minor GC 慢很多。

## 内存的分配策略？

**对象优先在 Eden 分配**

大多数情况下，对象在新生代 Eden 上分配，当 Eden 空间不够时，发起 Minor GC。

**大对象直接进入老年代**

大对象是指需要连续内存空间的对象，最典型的大对象是那种很长的字符串以及数组。经常出现大对象会提前触发垃圾收集以获取足够的连续空间分配给大对象。

可以设置JVM参数 -XX:PretenureSizeThreshold，大于此值的对象直接在老年代分配，避免在 Eden 和 Survivor 之间的大量内存复制。

**长期存活的对象进入老年代**

通过参数 `-XX:MaxTenuringThreshold` 可以设置对象进入老年代的年龄阈值。对象在 Survivor 中每经过一次 MinorGC，年龄就增加 1 岁，当它的年龄增加到一定程度，就会被晋升到老年代中。

**动态对象年龄判定**

虚拟机并不是永远要求对象的年龄必须达到 MaxTenuringThreshold 才能晋升老年代，如果在 Survivor 中相同年龄所有对象大小的总和大于 Survivor 空间的一半，则年龄大于或等于该年龄的对象可以直接进入老年代，无需等到 MaxTenuringThreshold 中要求的年龄。

**空间分配担保**

在发生 Minor GC 之前，虚拟机先检查老年代最大可用的连续空间是否大于新生代所有对象总空间，如果条件成立的话，那么 Minor GC 可以确认是安全的。如果不成立的话虚拟机会查看 HandlePromotionFailure 的值是否允许担保失败。如果允许，那么就会继续检查老年代最大可用的连续空间是否大于历次晋升到老年代对象的平均大小，如果大于，将尝试着进行一次 Minor GC；如果小于，或者 HandlePromotionFailure 的值不允许冒险，那么就要进行一次 Full GC。

## Full GC 的触发条件？

对于 Minor GC，其触发条件比较简单，当 Eden 空间满时，就将触发一次 Minor GC。而 Full GC 触发条件相对复杂，有以下情况会发生 full GC：

**调用 System.gc()**

只是建议虚拟机执行 Full GC，但是虚拟机不一定真正去执行。不建议使用这种方式，而是让虚拟机管理内存。

**老年代空间不足**

老年代空间不足的常见场景为前文所讲的大对象直接进入老年代、长期存活的对象进入老年代等。为了避免以上原因引起的 Full GC，应当尽量不要创建过大的对象以及数组。除此之外，可以通过 -Xmn 参数调大新生代的大小，让对象尽量在新生代被回收掉，不进入老年代。还可以通过 -XX:MaxTenuringThreshold 调大对象进入老年代的年龄，让对象在新生代多存活一段时间。

**空间分配担保失败**

使用复制算法的 Minor GC 需要老年代的内存空间作担保，如果担保失败会执行一次 Full GC。

**JDK 1.7 及以前的永久代空间不足**

在 JDK 1.7 及以前，HotSpot 虚拟机中的方法区是用永久代实现的，永久代中存放的为一些 Class 的信息、常量、静态变量等数据。当系统中要加载的类、反射的类和调用的方法较多时，永久代可能会被占满，在未配置为采用 CMS GC 的情况下也会执行 Full GC。如果经过 Full GC 仍然回收不了，那么虚拟机会抛出 java.lang.OutOfMemoryError。



## 垃圾回收算法有哪些？

**标记清除算法**

标记清除算法就是分为“标记”和“清除”两个阶段。标记出所有需要回收的对象，标记结束后统一回收所有被标记的对象。这种垃圾回收算法效率较低，并且会产生大量不连续的空间碎片。

![](https://gitee.com/tysondai/img/raw/master/image-20210905003458130.png)

**复制清除算法**

半区复制，用于新生代垃圾回收。将内存分为大小相同的两块，每次使用其中的一块。当这一块的内存使用完后，就将还存活的对象复制到另一块去，然后再把使用的空间一次清理掉。

![](https://gitee.com/tysondai/img/raw/master/image-20210905003714551.png)

特点：实现简单，运行高效，但可用内存缩小为了原来的一半，浪费空间。

**标记整理算法**

根据老年代的特点提出的一种标记算法，标记过程仍然与“标记-清除”算法一样，但后续步骤不是直接对可回收对象进行清理，而是让所有存活的对象都向一端移动，然后直接清理掉边界以外的内存。

**分类收集算法**

根据各个年代的特点采用最适当的收集算法。

一般将堆分为新生代和老年代。

- 新生代使用：复制算法
- 老年代使用：标记清除算法或者标记整理算法

在新生代中，每次垃圾收集时都发现有大批对象死去，只有少量存活，那就选用复制算法，只需要付出少量存活对象的复制成本就可以完成收集。而老年代中因为对象存活率高、没有额外空间对它进行分配担保，就必须使用“标记-清理”或者“标记-整理”算法来进行回收。

由于对象之间会存在跨代引用，如果要进行一次新生代垃圾收集，除了需要遍历新生代对象，还要额外遍历整个老年代的所有对象，这会给内存回收带来很大的性能负担。

跨代引用相对于同代引用来说仅占极少数。存在互相引用关系的两个对象，是应该倾向于同时生存或者同时消亡的。举个例子，如果某个新生代对象存在跨代引用，由于老年代对象难以消亡，该引用会使得新生代对象在收集时同样得以存活，进而在年龄增长之后晋升到老年代中，这时跨代引用也随即被消除了。

所以没必要为了少量的跨代引用去扫描整个老年代，只需在新生代建立一个全局的数据结构 Remembered Set，这个结构把老年代划分成若干小块，标识出老年代的哪一块内存会存在跨代引用。此后当发生Minor GC时，只有包含了跨代引用的小块内存里的对象才会被加入到GC Roots进行扫描。



##  有哪几种垃圾回收器，各自的优缺点是什么？

垃圾回收器主要分为以下几种：Serial、ParNew、Parallel Scavenge、Serial Old、Parallel Old、CMS、G1。

这7种垃圾收集器的特点：

|        收集器         | 串行、并行or并发 | 新生代/老年代 |        算法        |     目标     |                 适用场景                  |
| :-------------------: | :--------------: | :-----------: | :----------------: | :----------: | :---------------------------------------: |
|      **Serial**       |       串行       |    新生代     |      复制算法      | 响应速度优先 |          单CPU环境下的Client模式          |
|      **ParNew**       |       并行       |    新生代     |      复制算法      | 响应速度优先 |    多CPU环境时在Server模式下与CMS配合     |
| **Parallel Scavenge** |       并行       |    新生代     |      复制算法      |  吞吐量优先  |     在后台运算而不需要太多交互的任务      |
|    **Serial Old**     |       串行       |    老年代     |     标记-整理      | 响应速度优先 |  单CPU环境下的Client模式、CMS的后备预案   |
|   **Parallel Old**    |       并行       |    老年代     |     标记-整理      |  吞吐量优先  |     在后台运算而不需要太多交互的任务      |
|        **CMS**        |       并发       |    老年代     |     标记-清除      | 响应速度优先 | 集中在互联网站或B/S系统服务端上的Java应用 |
|        **G1**         |       并发       |     both      | 标记-整理+复制算法 | 响应速度优先 |        面向服务端应用，将来替换CMS        |

**Serial 收集器**

单线程收集器，使用一条垃圾收集线程去完成垃圾收集工作，在进行垃圾收集工作的时候必须暂停其他所有的工作线程（ "Stop The World" ），直到它收集结束。

![](https://gitee.com/tysondai/img/raw/master/serial-collector.png)

特点：简单高效；内存消耗最小；没有线程交互的开销，单线程收集效率高；需暂停所有的工作线程，用户体验不好。

**ParNew 收集器**

Serial 收集器的多线程版本，除了使用多线程进行垃圾收集外，其余行为（控制参数、收集算法、回收策略等等）和 Serial 收集器完全一样。

![](https://gitee.com/tysondai/img/raw/master/parnew-collector.png)

除了 Serial 收集器外，只有它能与 CMS 收集器配合工作。

**Parallel Scavenge 收集器**

新生代收集器，基于复制清除算法实现的收集器。吞吐量优先收集器，也是能够并行收集的多线程收集器，允许多个垃圾回收线程同时运行，降低垃圾收集时间，提高吞吐量。所谓吞吐量就是 CPU 中用于运行用户代码的时间与 CPU 总消耗时间的比值（吞吐量 = 运行用户代码时间 /（运行用户代码时间 + 垃圾收集时间））。Parallel Scavenge 收集器关注点是吞吐量，高效率的利用 CPU 资源。CMS 垃圾收集器关注点更多的是用户线程的停顿时间。

Parallel Scavenge收集器提供了两个参数用于**精确控制吞吐量**，分别是控制最大垃圾收集停顿时间的-XX：MaxGCPauseMillis参数以及直接设置吞吐量大小的-XX：GCTimeRatio参数。

-XX：MaxGCPauseMillis参数允许的值是一个大于0的毫秒数，收集器将尽力保证内存回收花费的时间不超过用户设定值。

-XX：GCTimeRatio参数的值则应当是一个大于0小于100的整数，也就是垃圾收集时间占总时间的比率，相当于吞吐量的倒数。

相比ParNew收集器，Parallel Scavenge 的优点：

1. 精确控制吞吐量；
2. 垃圾收集的自适应的调节策略。通过参数-XX：+UseAdaptiveSizePolicy 打开自适应调节策略，虚拟机会根据当前系统的运行情况收集性能监控信息，动态调整参数以提供最合适的停顿时间或者最大的吞吐量。调整的参数包括新生代的大小（-Xmn）、Eden与Survivor区的比例（-XX：SurvivorRatio）、晋升老年代对象大小（-XX：PretenureSizeThreshold）等。

**Serial Old 收集器**

Serial 收集器的老年代版本，它同样是一个单线程收集器，使用标记整理算法。它主要有两大用途：一种用途是在 JDK1.5 以及以前的版本中与 Parallel Scavenge 收集器搭配使用，另一种用途是作为 CMS 收集器的后备方案。

**Parallel Old 收集器**

Parallel Scavenge 收集器的老年代版本。多线程垃圾收集，使用标记-整理算法。在注重吞吐量以及 CPU 资源的场合，都可以优先考虑 Parallel Scavenge 收集器和 Parallel Old 收集器。

**CMS 收集器**

Concurrent Mark Sweep 并发标记清除，目的是获取最短应用停顿时间。第一款真正意义上的并发收集器，它第一次实现了让垃圾收集线程与用户线程基本上同时工作。在并发标记和并发清除阶段，虽然用户线程没有被暂停，但是由于垃圾收集器线程占用了一部分系统资源，应用程序的吞吐量会降低。

CMS 垃圾回收基于标记清除算法实现，整个过程分为四个步骤：

- 初始标记： stw暂停所有的其他线程，记录直接与 gc root 直接相连的对象，速度很快 。
- 并发标记：从GC Roots开始对堆中对象进行可达性分析，找出存活对象，耗时较长，但是不需要停顿用户线程。
- 重新标记： 在并发标记期间对象的引用关系可能会变化，需要重新进行标记。此阶段也会stw，停顿时间一般会比初始标记阶段的时间稍长，远远比并发标记阶段时间短。
- 并发清除：清除死亡对象，由于不需要移动存活对象，所以这个阶段也是可以与用户线程同时并发的。

![](https://gitee.com/tysondai/img/raw/master/cms-collector.png)

由于在整个过程中耗时最长的并发标记和并发清除阶段中，垃圾收集器线程都可以与用户线程一起工作，所以从总体上来说，CMS收集器的内存回收过程是与用户线程一起并发执行的。

优点：并发收集，低停顿。

缺点：

- 标记清除算法导致收集结束有大量空间碎片，往往出现老年代空间剩余，但无法找到足够大连续空间来分配当前对象，不得不提前触发一次 Full GC。
- 会产生浮动垃圾，由于CMS并发清理阶段用户线程还在运行着，会不断有新的垃圾产生，这一部分垃圾出现在标记过程之后，CMS无法在当次收集中处理掉它们，只好等到下一次GC去处理；
- 对处理器资源非常敏感。在并发阶段，收集器占用了一部分线程资源，导致应用程序变慢，降低总吞吐量。

CMS垃圾回收特点：

1. cms只会回收老年代和永久代（1.8开始为元数据区，需要设置CMSClassUnloadingEnabled），不会收集年轻代；
2. cms垃圾回收器开始执行回收操作，有一个触发阈值，默认是老年代或永久带达到92%，不能等到old内存用尽时回收，否则会导致并发回收失败。因为需要预留空间给用户线程运行。

**G1收集器**

G1垃圾收集器的目标是用在多核、大内存的机器上，在不同应用场景中追求高吞吐量和低停顿之间的最佳平衡。

在G1收集器出现之前的所有其他收集器，包括CMS在内，垃圾收集的目标范围要么是整个新生代（Minor GC），要么就是整个老年代（Major GC），再要么就是整个Java堆（Full GC）。而G1可以面向堆内存任何部分来组成回收集（Collection Set，一般简称CSet）进行回收，衡量标准不再是它属于哪个分代，而是哪块内存中存放的垃圾数量最多，回收收益最大，这就是G1收集器的Mixed GC模式。

G1将整个堆分成相同大小的分区（Region），有四种不同类型的分区：Eden、Survivor、Old和Humongous（大对象）。分区的大小取值范围为1M到32M，都是2的幂次方。Region大小可以通过`-XX:G1HeapRegionSize`参数指定。Humongous区域用于存储大对象。G1认为只要大小超过了一个Region容量一半的对象即可判定为大对象。

![](https://gitee.com/tysondai/img/raw/master/g1-region.jpg)

G1 收集器对各个Region回收所获得的空间大小和回收所需时间的经验值进行排序，得到一个优先级列表，每次根据用户设置的最大的回收停顿时间（使用参数-XX：MaxGCPauseMillis指定，默认值是200毫秒），优先处理回收价值最大的 Region。

Java堆分成多个独立Region，Region里面会存在跨Region引用对象，在垃圾回收寻找GC Roots需要扫描整个堆。G1采用了Rset（Remembered Set）来避免扫描整个堆。每个Region会有一个RSet，记录了哪些Region引用本Region中对象，即谁引用了我的对象，这样的话，在做可达性分析的时候就可以避免全堆扫描。

特点：可以由用户指定期望的垃圾收集停顿时间。

G1 收集器的回收过程分为以下几个步骤：

- 初始标记：。stw暂停所有的其他线程，记录直接与 gc root 直接相连的对象，速度很快 。
- 并发标记。从GC Root开始对堆中对象进行可达性分析，递归扫描整个堆里的对象图，找出要回收的对象，这阶段耗时较长，但可与用户程序并发执行。
- 最终标记。对用户线程做另一个短暂的暂停，用于处理并发阶段对象引用出现变动的区域。
- 筛选回收。对各个Region的回收价值和成本进行排序，根据用户所期望的停顿时间来制定回收计划，然后把决定回收的那一部分Region的存活对象复制到空的Region中，再清理掉整个旧的Region的全部空间。这里的操作涉及存活对象的移动，是必须暂停用户线程，由多条收集器线程并行完成的。



## 常用的 JVM 调优的参数都有哪些？

- -Xms2g：初始化推大小为 2g；
- -Xmx2g：堆最大内存为 2g；
- -XX:NewRatio=4：设置年轻的和老年代的内存比例为 1:4；
- -XX:SurvivorRatio=8：设置新生代 Eden 和 Survivor 比例为 8:2；
- –XX:+UseParNewGC：指定使用 ParNew + Serial Old 垃圾回收器组合；
- -XX:+UseParallelOldGC：指定使用 ParNew + ParNew Old 垃圾回收器组合；
- -XX:+UseConcMarkSweepGC：指定使用 CMS + Serial Old 垃圾回收器组合；
- -XX:+PrintGC：开启打印 gc 信息；
- -XX:+PrintGCDetails：打印 gc 详细信息。

## JVM调优工具有哪些？

**jps**：列出本机所有java进程的pid。

选项

- -q 仅输出VM标识符，不包括class name,jar name,arguments in main method
- -m 输出main method的参数
- -l 输出完全的包名，应用主类名，jar的完全路径名
- -v 输出jvm参数
- -V 输出通过flag文件传递到JVM中的参数(.hotspotrc文件或-XX:Flags=所指定的文件
- -Joption 传递参数到vm,例如:-J-Xms48m

```bash
jps -lvm
//output
//4124 com.zzx.Application -javaagent:E:\IDEA2019\lib\idea_rt.jar=10291:E:\IDEA2019\bin -Dfile.encoding=UTF-8
```

**jstack**：查看某个Java进程内的线程堆栈信息。-l，long listings，打印额外的锁信息，发生死锁时可以使用`jstack -l pid`观察锁持有情况。

```java
jstack -l 4124 | more
```

output：

```java
"http-nio-8001-exec-10" #40 daemon prio=5 os_prio=0 tid=0x000000002542f000 nid=0x4028 waiting on condition [0x000000002cc9e000]
   java.lang.Thread.State: WAITING (parking)
        at sun.misc.Unsafe.park(Native Method)
        - parking to wait for  <0x000000077420d7e8> (a java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject)
        at java.util.concurrent.locks.LockSupport.park(LockSupport.java:175)
        at java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject.await(AbstractQueuedSynchronizer.java:2039)
        at java.util.concurrent.LinkedBlockingQueue.take(LinkedBlockingQueue.java:442)
        at org.apache.tomcat.util.threads.TaskQueue.take(TaskQueue.java:103)
        at org.apache.tomcat.util.threads.TaskQueue.take(TaskQueue.java:31)
        at java.util.concurrent.ThreadPoolExecutor.getTask(ThreadPoolExecutor.java:1074)
        at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1134)
        at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:624)
        at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)
        at java.lang.Thread.run(Thread.java:748)

   Locked ownable synchronizers:
        - None
```

**jstat**：虚拟机各种运行状态信息（类装载、内存、垃圾收集、jit编译等运行数据）。gcuitl 查看新生代、老年代及持久代GC的情况。

```java
jstat -gcutil 4124
  S0     S1     E      O      M     CCS    YGC     YGCT    FGC    FGCT     GCT
  0.00   0.00  67.21  19.20  96.36  94.96     10    0.084     3    0.191    0.275
```

**jmap**：查看堆内存快照。查看进程中新生代、老年代、永久代的使用情况。

查询进程4124的堆内存快照：

```java
>jmap -heap 4124
Attaching to process ID 4124, please wait...
Debugger attached successfully.
Server compiler detected.
JVM version is 25.221-b11

using thread-local object allocation.
Parallel GC with 6 thread(s)

Heap Configuration:
   MinHeapFreeRatio         = 0
   MaxHeapFreeRatio         = 100
   MaxHeapSize              = 4238344192 (4042.0MB)
   NewSize                  = 88604672 (84.5MB)
   MaxNewSize               = 1412431872 (1347.0MB)
   OldSize                  = 177733632 (169.5MB)
   NewRatio                 = 2
   SurvivorRatio            = 8
   MetaspaceSize            = 21807104 (20.796875MB)
   CompressedClassSpaceSize = 1073741824 (1024.0MB)
   MaxMetaspaceSize         = 17592186044415 MB
   G1HeapRegionSize         = 0 (0.0MB)

Heap Usage:
PS Young Generation
Eden Space:
   capacity = 327155712 (312.0MB)
   used     = 223702392 (213.33922576904297MB)
   free     = 103453320 (98.66077423095703MB)
   68.37795697725736% used
From Space:
   capacity = 21495808 (20.5MB)
   used     = 0 (0.0MB)
   free     = 21495808 (20.5MB)
   0.0% used
To Space:
   capacity = 23068672 (22.0MB)
   used     = 0 (0.0MB)
   free     = 23068672 (22.0MB)
   0.0% used
PS Old Generation
   capacity = 217579520 (207.5MB)
   used     = 41781472 (39.845916748046875MB)
   free     = 175798048 (167.65408325195312MB)
   19.20285144484187% used

27776 interned Strings occupying 3262336 bytes.
```

查询进程pid = 41843 存活的对象占用内存前100排序： `jmap -histo:live 41843 | head -n 100`



## 对象头了解吗？

Java对象保存在内存中时，由以下三部分组成：对象头、实例数据和对齐填充字节。

java的对象头由以下三部分组成：mark word、指向类信息的指针和数组长度（数组对象才有）。

mark word包含：对象的hashcode、分代年龄和锁标志位。

对象的实例数据就是在java代码中对象的属性和值。

对齐填充字节：因为JVM要求java的对象占的内存大小应该是8bit的倍数，所以后面有几个字节用于把对象的大小补齐至8bit的倍数。

**内存对齐的主要作用是：**

1. 平台原因：不是所有的硬件平台都能访问任意地址上的任意数据的；某些硬件平台只能在某些地址处取某些特定类型的数据，否则抛出硬件异常。
2.  性能原因：经过内存对齐后，CPU的内存访问速度大大提升。

## main方法执行过程

以下是示例代码：

```java
public class App {
    public static void main(String[] args) {
        Student s = new Student("大彬");
        s.getName();
    }
}

class Student {
    public String name;

    public Student(String name) {
        this.name = name;
    }

    public String getName() {
        return this.name;
    }
}
```

执行main方法的步骤如下:

1. 编译好 App.java 后得到 App.class 后，执行 App.class，系统会启动一个 JVM 进程，从 classpath 路径中找到一个名为 App.class 的二进制文件，将 App 的类信息加载到运行时数据区的方法区内，这个过程叫做 App 类的加载。
2. JVM 找到 App 的主程序入口，执行main方法。
3. 这个main中的第一条语句为 `Student student = new Student("大彬") `，就是让 JVM 创建一个Student对象，但是这个时候方法区中是没有 Student 类的信息的，所以 JVM 马上加载 Student 类，把 Student 类的信息放到方法区中。
4. 加载完 Student 类后，JVM 在堆中为一个新的 Student 实例分配内存，然后调用构造函数初始化 Student 实例，这个 Student 实例持有 **指向方法区中的 Student 类的类型信息** 的引用。
5. 执行student.getName()时，JVM 根据 student 的引用找到 student 对象，然后根据 student 对象持有的引用定位到方法区中 student 类的类型信息的方法表，获得 getName() 的字节码地址。
6. 执行getName()方法。

## 对象创建过程

1. **类加载检查**：虚拟机遇到一条 new 指令时，首先将去检查这个指令的参数是否能在常量池中定位到这个类的符号引用，并且检查这个符号引用代表的类是否已被加载过、解析和初始化过。如果没有，那必须先执行相应的类加载过程。
2. **分配内存**：在类加载检查通过后，接下来虚拟机将为新生对象分配内存。对象所需的内存大小在类加载完成后便可确定，为对象分配空间的任务等同于把一块确定大小的内存从 Java 堆中划分出来。
3. **初始化零值**。分配到的内存空间都初始化为零值（不包括对象头），这一步操作保证了对象的实例字段在 Java 代码中可以不赋初始值就直接使用，程序能访问到这些字段的数据类型所对应的零值。
4. **设置对象头**。Hotspot 虚拟机的对象头包括两部分信息，第一部分用于存储对象自身的运行时数据（哈希码、GC 分代年龄、锁状态标志等等），另一部分是类型指针，即对象指向它的类元数据的指针，虚拟机通过这个指针来确定这个对象是那个类的实例。
5. **执行init方法**。按照Java代码进行初始化。

## 如何排查 OOM 的问题？

排查 OOM 的方法：

- 增加JVM参数 `-XX:+HeapDumpOnOutOfMemoryError` 和`-XX:HeapDumpPath=/tmp/heapdump.hprof`，当 OOM 发生时自动 dump 堆内存信息到指定目录；
- jstat 查看监控 JVM 的内存和 GC 情况，评估问题大概出在什么区域；
- 使用 MAT 工具载入 dump 文件，分析大对象的占用情况 。

## GC是什么？为什么要GC？

GC 是垃圾收集的意思（Gabage Collection）。内存处理是编程人员容易出现问题的地方，忘记或者错误的内存回收会导致程序的不稳定甚至崩溃，Java 提供的 GC 功能可以自动监测对象是否超过作用域从而达到自动回收内存的目的。


## 参考资料

- 周志明. 深入理解 Java 虚拟机 [M]. 机械工业出版社
- https://blog.csdn.net/thinkwon/article/details/104390752



> 本文已经收录到github仓库，此仓库用于分享Java相关知识总结，包括Java基础、MySQL、Spring Boot、MyBatis、Redis、RabbitMQ、计算机网络、数据结构与算法等等，欢迎大家提pr和star！
>
> github地址：https://github.com/Tyson0314/Java-learning
>
> 如果github访问不了，可以访问gitee仓库。
>
> gitee地址：https://gitee.com/tysondai/Java-learning
