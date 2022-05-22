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
- [什么情况下会发生栈溢出？](#%E4%BB%80%E4%B9%88%E6%83%85%E5%86%B5%E4%B8%8B%E4%BC%9A%E5%8F%91%E7%94%9F%E6%A0%88%E6%BA%A2%E5%87%BA)
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
- [GC是什么？为什么要GC？](#gc%E6%98%AF%E4%BB%80%E4%B9%88%E4%B8%BA%E4%BB%80%E4%B9%88%E8%A6%81gc)
- [Minor GC 和 Full GC的区别？](#minor-gc-%E5%92%8C-full-gc%E7%9A%84%E5%8C%BA%E5%88%AB)
- [内存的分配策略？](#%E5%86%85%E5%AD%98%E7%9A%84%E5%88%86%E9%85%8D%E7%AD%96%E7%95%A5)
- [Full GC 的触发条件？](#full-gc-%E7%9A%84%E8%A7%A6%E5%8F%91%E6%9D%A1%E4%BB%B6)
- [垃圾回收算法有哪些？](#%E5%9E%83%E5%9C%BE%E5%9B%9E%E6%94%B6%E7%AE%97%E6%B3%95%E6%9C%89%E5%93%AA%E4%BA%9B)
- [有哪些垃圾回收器？](#%E6%9C%89%E5%93%AA%E4%BA%9B%E5%9E%83%E5%9C%BE%E5%9B%9E%E6%94%B6%E5%99%A8)
- [常用的 JVM 调优的命令都有哪些？](#%E5%B8%B8%E7%94%A8%E7%9A%84-jvm-%E8%B0%83%E4%BC%98%E7%9A%84%E5%91%BD%E4%BB%A4%E9%83%BD%E6%9C%89%E5%93%AA%E4%BA%9B)
- [对象头了解吗？](#%E5%AF%B9%E8%B1%A1%E5%A4%B4%E4%BA%86%E8%A7%A3%E5%90%97)
- [main方法执行过程](#main%E6%96%B9%E6%B3%95%E6%89%A7%E8%A1%8C%E8%BF%87%E7%A8%8B)
- [对象创建过程](#%E5%AF%B9%E8%B1%A1%E5%88%9B%E5%BB%BA%E8%BF%87%E7%A8%8B)
- [如何排查 OOM 的问题？](#%E5%A6%82%E4%BD%95%E6%8E%92%E6%9F%A5-oom-%E7%9A%84%E9%97%AE%E9%A2%98)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

> 首先给大家分享一个github仓库，上面放了**200多本经典的计算机书籍**，包括C语言、C++、Java、Python、前端、数据库、操作系统、计算机网络、数据结构和算法、机器学习、编程人生等，可以star一下，下次找书直接在上面搜索，仓库持续更新中~
>
> github地址：https://github.com/Tyson0314/java-books
>
> 如果github访问不了，可以访问gitee仓库。
>
> gitee地址：https://gitee.com/tysondai/java-books

## 讲一下JVM内存结构？

JVM内存结构分为5大区域，**程序计数器**、**虚拟机栈**、**本地方法栈**、**堆**、**方法区**。

![](https://raw.githubusercontent.com/Tyson0314/img/master/jvm内存结构0.png)

### 程序计数器

线程私有的，作为当前线程的行号指示器，用于记录当前虚拟机正在执行的线程指令地址。程序计数器主要有两个作用：

1. 当前线程所执行的字节码的行号指示器，通过它实现**代码的流程控制**，如：顺序执行、选择、循环、异常处理。
2. 在多线程的情况下，程序计数器用于**记录当前线程执行的位置**，当线程被切换回来的时候能够知道它上次执行的位置。

程序计数器是唯一一个不会出现 `OutOfMemoryError` 的内存区域，它的生命周期随着线程的创建而创建，随着线程的结束而死亡。

### 虚拟机栈

Java 虚拟机栈是由一个个栈帧组成，而每个栈帧中都拥有：**局部变量表**、**操作数栈**、**动态链接**、**方法出口信息**。每一次函数调用都会有一个对应的栈帧被压入虚拟机栈，每一个函数调用结束后，都会有一个栈帧被弹出。

局部变量表是用于存放方法参数和方法内的局部变量。

每个栈帧都包含一个指向运行时常量池中该栈所属方法的符号引用，在方法调用过程中，会进行动态链接，将这个符号引用转化为直接引用。

- 部分符号引用在类加载阶段的时候就转化为直接引用，这种转化就是静态链接
- 部分符号引用在运行期间转化为直接引用，这种转化就是动态链接

Java 虚拟机栈也是线程私有的，每个线程都有各自的 Java 虚拟机栈，而且随着线程的创建而创建，随着线程的死亡而死亡。Java 虚拟机栈会出现两种错误：`StackOverFlowError` 和 `OutOfMemoryError`。

可以通过` -Xss `参数来指定每个线程的虚拟机栈内存大小：

```java
java -Xss2M
```

### 本地方法栈

虚拟机栈为虚拟机执行 `Java` 方法服务，而本地方法栈则为虚拟机使用到的 `Native` 方法服务。`Native` 方法一般是用其它语言（C、C++等）编写的。

本地方法被执行的时候，在本地方法栈也会创建一个栈帧，用于存放该本地方法的局部变量表、操作数栈、动态链接、出口信息。

### 堆

堆用于存放对象实例，是垃圾收集器管理的主要区域，因此也被称作`GC`堆。堆可以细分为：新生代（`Eden`空间、`From Survivor`、`To Survivor`空间）和老年代。

通过 `-Xms`设定程序启动时占用内存大小，通过`-Xmx`设定程序运行期间最大可占用的内存大小。如果程序运行需要占用更多的内存，超出了这个设置值，就会抛出`OutOfMemory`异常。

```java
java -Xms1M -Xmx2M
```

### 方法区

方法区与 Java 堆一样，是各个线程共享的内存区域，它用于存储已被虚拟机加载的类信息、常量、静态变量、即时编译器编译后的代码等数据。

对方法区进行垃圾回收的主要目标是**对常量池的回收和对类的卸载**。

**永久代**

方法区是 JVM 的规范，而永久代`PermGen`是方法区的一种实现方式，并且只有 `HotSpot` 有永久代。对于其他类型的虚拟机，如`JRockit`没有永久代。由于方法区主要存储类的相关信息，所以对于动态生成类的场景比较容易出现永久代的内存溢出。

**元空间**

JDK 1.8 的时候，`HotSpot`的永久代被彻底移除了，使用元空间替代。元空间的本质和永久代类似，都是对JVM规范中方法区的实现。两者最大的区别在于：元空间并不在虚拟机中，而是使用直接内存。

为什么要将永久代替换为元空间呢?

永久代内存受限于 JVM 可用内存，而元空间使用的是直接内存，受本机可用内存的限制，虽然元空间仍旧可能溢出，但是相比永久代内存溢出的概率更小。

### 运行时常量池

运行时常量池是方法区的一部分，在类加载之后，会将编译器生成的各种字面量和符号引号放到运行时常量池。在运行期间动态生成的常量，如 String 类的 intern()方法，也会被放入运行时常量池。

### 直接内存

直接内存并不是虚拟机运行时数据区的一部分，也不是虚拟机规范中定义的内存区域，但是这部分内存也被频繁地使用。而且也可能导致 `OutOfMemoryError` 错误出现。

NIO的Buffer提供了`DirectBuffer`，可以直接访问系统物理内存，避免堆内内存到堆外内存的数据拷贝操作，提高效率。`DirectBuffer`直接分配在物理内存中，并不占用堆空间，其可申请的最大内存受操作系统限制，不受最大堆内存的限制。

直接内存的读写操作比堆内存快，可以提升程序I/O操作的性能。通常在I/O通信过程中，会存在堆内内存到堆外内存的数据拷贝操作，对于需要频繁进行内存间数据拷贝且生命周期较短的暂存数据，都建议存储到直接内存。

## Java对象的定位方式

Java 程序通过栈上的 reference 数据来操作堆上的具体对象。对象的访问方式由虚拟机实现而定，目前主流的访问方式有使用句柄和直接指针两种：

- 如果使用句柄的话，那么 Java 堆中将会划分出一块内存来作为句柄池，reference 中存储的就是对象的句柄地址，而句柄中包含了对象实例数据与类型数据各自的具体地址信息。使用句柄来访问的最大好处是 reference 中存储的是稳定的句柄地址，在对象被移动时只会改变句柄中的实例数据指针，而 reference 本身不需要修改。
- 直接指针。reference 中存储的直接就是对象的地址。对象包含到对象类型数据的指针，通过这个指针可以访问对象类型数据。使用直接指针访问方式最大的好处就是访问对象速度快，它节省了一次指针定位的时间开销，虚拟机hotspot主要是使用直接指针来访问对象。

## 说一下堆栈的区别？

1. 堆的**物理地址分配**是不连续的，性能较慢；栈的物理地址分配是连续的，性能相对较快。
2. 堆存放的是**对象的实例和数组**；栈存放的是**局部变量，操作数栈，返回结果**等。

3. 堆是**线程共享**的；栈是**线程私有**的。

## 什么情况下会发生栈溢出？

- 当线程请求的栈深度超过了虚拟机允许的最大深度时，会抛出`StackOverFlowError`异常。这种情况通常是因为方法递归没终止条件。
- 新建线程的时候没有足够的内存去创建对应的虚拟机栈，虚拟机会抛出`OutOfMemoryError`异常。比如线程启动过多就会出现这种情况。

## 类文件结构

Class 文件结构如下：

```java
ClassFile {
    u4             magic; //类文件的标志
    u2             minor_version;//小版本号
    u2             major_version;//大版本号
    u2             constant_pool_count;//常量池的数量
    cp_info        constant_pool[constant_pool_count-1];//常量池
    u2             access_flags;//类的访问标记
    u2             this_class;//当前类的索引
    u2             super_class;//父类
    u2             interfaces_count;//接口
    u2             interfaces[interfaces_count];//一个类可以实现多个接口
    u2             fields_count;//字段属性
    field_info     fields[fields_count];//一个类会可以有个字段
    u2             methods_count;//方法数量
    method_info    methods[methods_count];//一个类可以有个多个方法
    u2             attributes_count;//此类的属性表中的属性数
    attribute_info attributes[attributes_count];//属性表集合
}
```

主要参数如下：

**魔数**：`class`文件标志。

**文件版本**：高版本的 Java 虚拟机可以执行低版本编译器生成的类文件，但是低版本的 Java 虚拟机不能执行高版本编译器生成的类文件。

**常量池**：存放字面量和符号引用。字面量类似于 Java 的常量，如字符串，声明为`final`的常量值等。符号引用包含三类：类和接口的全限定名，方法的名称和描述符，字段的名称和描述符。

**访问标志**：识别类或者接口的访问信息，比如这个`Class`是类还是接口，是否为 `public` 或者 `abstract` 类型等等。

**当前类的索引**：类索引用于确定这个类的全限定名。

## 什么是类加载？类加载的过程？

类的加载指的是将类的`class`文件中的二进制数据读入到内存中，将其放在运行时数据区的方法区内，然后在堆区创建一个此类的对象，通过这个对象可以访问到方法区对应的类信息。

![](https://raw.githubusercontent.com/Tyson0314/img/master/类加载.png)

**加载**

1. 通过类的全限定名获取定义此类的二进制字节流
2. 将字节流所代表的静态存储结构转换为方法区的运行时数据结构
3. 在内存中生成一个代表该类的`Class`对象，作为方法区类信息的访问入口

**验证**

确保Class文件的字节流中包含的信息符合虚拟机规范，保证在运行后不会危害虚拟机自身的安全。主要包括四种验证：**文件格式验证，元数据验证，字节码验证，符号引用验证**。

**准备**

为类变量分配内存并设置类变量初始值的阶段。

**解析**

虚拟机将常量池内的符号引用替换为直接引用的过程。符号引用用于描述目标，直接引用直接指向目标的地址。

**初始化**

开始执行类中定义的`Java`代码，初始化阶段是调用类构造器的过程。

## 什么是双亲委派模型？

一个类加载器收到一个类的加载请求时，它首先不会自己尝试去加载它，而是把这个请求**委派**给父类加载器去完成，这样层层委派，因此所有的加载请求最终都会传送到顶层的启动类加载器中，只有当父类加载器反馈自己无法完成这个加载请求时，子加载器才会尝试自己去加载。

![](https://raw.githubusercontent.com/Tyson0314/img/master/双亲委派.png)

双亲委派模型的具体实现代码在 `java.lang.ClassLoader`中，此类的 `loadClass()` 方法运行过程如下：先检查类是否已经加载过，如果没有则让父类加载器去加载。当父类加载器加载失败时抛出 `ClassNotFoundException`，此时尝试自己去加载。源码如下：

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

双亲委派模型的好处：可以防止内存中出现多份同样的字节码。如果没有双亲委派模型而是由各个类加载器自行加载的话，如果用户编写了一个`java.lang.Object`的同名类并放在`ClassPath`中，多个类加载器都去加载这个类到内存中，系统中将会出现多个不同的`Object`类，那么类之间的比较结果及类的唯一性将无法保证。

## 什么是类加载器，类加载器有哪些?

- 实现通过类的全限定名获取该类的二进制字节流的代码块叫做类加载器。

  主要有一下四种类加载器:

  - **启动类加载器**：用来加载 Java 核心类库，无法被 Java 程序直接引用。
  - **扩展类加载器**：它用来加载 Java 的扩展库。Java 虚拟机的实现会提供一个扩展库目录。该类加载器在此目录里面查找并加载 Java 类。
  - **系统类加载器**：它根据应用的类路径来加载 Java 类。可通过`ClassLoader.getSystemClassLoader()`获取它。
  - **自定义类加载器**：通过继承`java.lang.ClassLoader`类的方式实现。

##  类的实例化顺序？

1. 父类中的`static`代码块，当前类的`static`代码块
2. 父类的普通代码块
3. 父类的构造函数
4. 当前类普通代码块
5. 当前类的构造函数

## 如何判断一个对象是否存活？

对堆垃圾回收前的第一步就是要判断那些对象已经死亡（即不再被任何途径引用的对象）。判断对象是否存活有两种方法：引用计数法和可达性分析。

**引用计数法**

给对象中添加一个引用计数器，每当有一个地方引用它，计数器就加 1；当引用失效，计数器就减 1；任何时候计数器为 0 的对象就是不可能再被使用的。

这种方法很难解决对象之间相互循环引用的问题。比如下面的代码，`obj1` 和 `obj2` 互相引用，这种情况下，引用计数器的值都是1，不会被垃圾回收。

```java
public class ReferenceCount {
    Object instance = null;
	public static void main(String[] args) {
		ReferenceCount obj1 = new ReferenceCount();
		ReferenceCount obj2 = new ReferenceCount();
		obj1.instance = obj2;
		obj2.instance = obj1;
		obj1 = null;
		obj2 = null;
	}
}
```

**可达性分析**

通过`GC Root`对象为起点，从这些节点向下搜索，搜索所走过的路径叫引用链，当一个对象到`GC Root`没有任何的引用链相连时，说明这个对象是不可用的。

![](https://raw.githubusercontent.com/Tyson0314/img/master/可达性分析0.png)

## 可作为GC Roots的对象有哪些？

1. 虚拟机栈中引用的对象
2. 本地方法栈中Native方法引用的对象
3. 方法区中类静态属性引用的对象
4. 方法区中常量引用的对象

## 什么情况下类会被卸载？

需要同时满足以下 3 个条件类才可能会被卸载 ：

- 该类所有的实例都已经被回收。
- 加载该类的类加载器已经被回收。
- 该类对应的 `java.lang.Class` 对象没有在任何地方被引用，无法在任何地方通过反射访问该类的方法。

虚拟机可以对满足上述 3 个条件的类进行回收，但不一定会进行回收。

## 强引用、软引用、弱引用、虚引用是什么，有什么区别？

**强引用**：在程序中普遍存在的引用赋值，类似`Object obj = new Object()`这种引用关系。只要强引用关系还存在，垃圾收集器就永远不会回收掉被引用的对象。

**软引用**：如果内存空间足够，垃圾回收器就不会回收它，如果内存空间不足了，就会回收这些对象的内存。

```java
//软引用
SoftReference<String> softRef = new SoftReference<String>(str);
```

**弱引用**：在进行垃圾回收时，不管当前内存空间足够与否，都会回收只具有弱引用的对象。

```java
//弱引用
WeakReference<String> weakRef = new WeakReference<String>(str);
```

**虚引用**：虚引用并不会决定对象的生命周期。如果一个对象仅持有虚引用，那么它就和没有任何引用一样，在任何时候都可能被垃圾回收。**虚引用主要是为了能在对象被收集器回收时收到一个系统通知**。

## GC是什么？为什么要GC？

GC（`Garbage Collection`），垃圾回收，是Java与C++的主要区别之一。作为Java开发者，一般不需要专门编写内存回收和垃圾清理代码。这是因为在Java虚拟机中，存在自动内存管理和垃圾清理机制。对JVM中的内存进行标记，并确定哪些内存需要回收，根据一定的回收策略，自动的回收内存，保证JVM中的内存空间，防止出现内存泄露和溢出问题。

## Minor GC 和 Full GC的区别？

- **Minor GC**：回收新生代，因为新生代对象存活时间很短，因此 `Minor GC`会频繁执行，执行的速度一般也会比较快。

- **Full GC**：回收老年代和新生代，老年代的对象存活时间长，因此 `Full GC` 很少执行，执行速度会比 `Minor GC` 慢很多。

## 内存的分配策略？

**对象优先在 Eden 分配**

大多数情况下，对象在新生代 `Eden` 上分配，当 `Eden` 空间不够时，触发 `Minor GC`。

**大对象直接进入老年代**

大对象是指需要连续内存空间的对象，最典型的大对象有长字符串和大数组。可以设置JVM参数 `-XX:PretenureSizeThreshold`，大于此值的对象直接在老年代分配。

**长期存活的对象进入老年代**

通过参数 `-XX:MaxTenuringThreshold` 可以设置对象进入老年代的年龄阈值。对象在`Survivor`区每经过一次 `Minor GC`，年龄就增加 1 岁，当它的年龄增加到一定程度，就会被晋升到老年代中。

**动态对象年龄判定**

并非对象的年龄必须达到 `MaxTenuringThreshold` 才能晋升老年代，如果在 `Survivor` 中相同年龄所有对象大小的总和大于 `Survivor` 空间的一半，则年龄大于或等于该年龄的对象可以直接进入老年代，无需达到 `MaxTenuringThreshold` 年龄阈值。

**空间分配担保**

在发生 `Minor GC` 之前，虚拟机先检查老年代最大可用的连续空间是否大于新生代所有对象总空间，如果条件成立的话，那么 `Minor GC` 是安全的。如果不成立的话虚拟机会查看 `HandlePromotionFailure` 的值是否允许担保失败。如果允许，那么就会继续检查老年代最大可用的连续空间是否大于历次晋升到老年代对象的平均大小，如果大于，将尝试着进行一次 `Minor GC`；如果小于，或者 `HandlePromotionFailure` 的值为不允许担保失败，那么就要进行一次 `Full GC`。

## Full GC 的触发条件？

对于 Minor GC，其触发条件比较简单，当 Eden 空间满时，就将触发一次 Minor GC。而 Full GC 触发条件相对复杂，有以下情况会发生 full GC：

**调用 System.gc()**

只是建议虚拟机执行 Full GC，但是虚拟机不一定真正去执行。不建议使用这种方式，而是让虚拟机管理内存。

**老年代空间不足**

老年代空间不足的常见场景为前文所讲的大对象直接进入老年代、长期存活的对象进入老年代等。为了避免以上原因引起的 Full GC，应当尽量不要创建过大的对象以及数组、注意编码规范避免内存泄露。除此之外，可以通过 `-Xmn` 参数调大新生代的大小，让对象尽量在新生代被回收掉，不进入老年代。还可以通过 `-XX:MaxTenuringThreshold` 调大对象进入老年代的年龄，让对象在新生代多存活一段时间。

**空间分配担保失败**

使用复制算法的 Minor GC 需要老年代的内存空间作担保，如果担保失败会执行一次 Full GC。

**JDK 1.7 及以前的永久代空间不足**

在 JDK 1.7 及以前，HotSpot 虚拟机中的方法区是用永久代实现的，永久代中存放的为一些 Class 的信息、常量、静态变量等数据。当系统中要加载的类、反射的类和调用的方法较多时，永久代可能会被占满，在未配置为采用 CMS GC 的情况下也会执行 Full GC。如果经过 Full GC 仍然回收不了，那么虚拟机会抛出 `java.lang.OutOfMemoryError`。



## 垃圾回收算法有哪些？

垃圾回收算法有四种，分别是**标记清除法、标记整理法、复制算法、分代收集算法**。

**标记清除算法**

首先利用可达性去遍历内存，把存活对象和垃圾对象进行标记。标记结束后统一将所有标记的对象回收掉。这种垃圾回收算法效率较低，并且会**产生大量不连续的空间碎片**。

![](https://raw.githubusercontent.com/Tyson0314/img/master/标记清除.png)

**复制清除算法**

半区复制，用于新生代垃圾回收。将内存分为大小相同的两块，每次使用其中的一块。当这一块的内存使用完后，就将还存活的对象复制到另一块去，然后再把使用的空间一次清理掉。

特点：实现简单，运行高效，但可用内存缩小为了原来的一半，浪费空间。

**标记整理算法**

根据老年代的特点提出的一种标记算法，标记过程仍然与`标记-清除`算法一样，但后续步骤不是直接对可回收对象进行清理，而是让所有存活的对象都向一端移动，然后直接清理掉边界以外的内存。

![](https://raw.githubusercontent.com/Tyson0314/img/master/标记整理.png)

**分类收集算法**

根据各个年代的特点采用最适当的收集算法。

一般将堆分为新生代和老年代。

- 新生代使用复制算法
- 老年代使用标记清除算法或者标记整理算法

在新生代中，每次垃圾收集时都有大批对象死去，只有少量存活，使用复制算法比较合适，只需要付出少量存活对象的复制成本就可以完成收集。老年代对象存活率高，适合使用标记-清理或者标记-整理算法进行垃圾回收。

##  有哪些垃圾回收器？

垃圾回收器主要分为以下几种：`Serial、ParNew、Parallel Scavenge、Serial Old、Parallel Old、CMS、G1`。

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

**单线程收集器**，使用一个垃圾收集线程去进行垃圾回收，在进行垃圾回收的时候必须暂停其他所有的工作线程（ `Stop The World` ），直到它收集结束。

特点：简单高效；内存消耗小；没有线程交互的开销，单线程收集效率高；需暂停所有的工作线程，用户体验不好。

**ParNew 收集器**

`Serial`收集器的**多线程版本**，除了使用多线程进行垃圾收集外，其他行为、参数与 `Serial` 收集器基本一致。

**Parallel Scavenge 收集器**

**新生代收集器**，基于**复制清除算法**实现的收集器。特点是**吞吐量优先**，能够并行收集的多线程收集器，允许多个垃圾回收线程同时运行，降低垃圾收集时间，提高吞吐量。所谓吞吐量就是 CPU 中用于运行用户代码的时间与 CPU 总消耗时间的比值（`吞吐量 = 运行用户代码时间 /（运行用户代码时间 + 垃圾收集时间）`）。`Parallel Scavenge` 收集器关注点是**吞吐量，高效率的利用 CPU 资源**。`CMS` 垃圾收集器关注点更多的是**用户线程的停顿时间**。

`Parallel Scavenge`收集器提供了两个参数用于**精确控制吞吐量**，分别是控制最大垃圾收集停顿时间的`-XX：MaxGCPauseMillis`参数以及直接设置吞吐量大小的`-XX：GCTimeRatio`参数。

- `-XX：MaxGCPauseMillis`参数的值是一个大于0的毫秒数，收集器将尽量保证内存回收花费的时间不超过用户设定值。

- `-XX：GCTimeRatio`参数的值大于0小于100，即垃圾收集时间占总时间的比率，相当于吞吐量的倒数。

**Serial Old 收集器**

`Serial` 收集器的老年代版本，单线程收集器，使用**标记整理算法**。

**Parallel Old 收集器**

`Parallel Scavenge` 收集器的老年代版本。多线程垃圾收集，使用**标记整理算法**。

**CMS 收集器**

`Concurrent Mark Sweep` ，并发标记清除，追求获取**最短停顿时间**，实现了让**垃圾收集线程与用户线程基本上同时工作**。

`CMS` 垃圾回收基于**标记清除算法**实现，整个过程分为四个步骤：

- 初始标记： 暂停所有用户线程（`Stop The World`），记录直接与 `GC Roots` 直接相连的对象 。
- 并发标记：从`GC Roots`开始对堆中对象进行可达性分析，找出存活对象，耗时较长，但是不需要停顿用户线程。
- 重新标记： 在并发标记期间对象的引用关系可能会变化，需要重新进行标记。此阶段也会暂停所有用户线程。
- 并发清除：清除标记对象，这个阶段也是可以与用户线程同时并发的。

在整个过程中，耗时最长的是并发标记和并发清除阶段，这两个阶段垃圾收集线程都可以与用户线程一起工作，所以从总体上来说，`CMS`收集器的内存回收过程是与用户线程一起并发执行的。

**优点**：并发收集，停顿时间短。

**缺点**：

- 标记清除算法导致收集结束有**大量空间碎片**。
- **产生浮动垃圾**，在并发清理阶段用户线程还在运行，会不断有新的垃圾产生，这一部分垃圾出现在标记过程之后，`CMS`无法在当次收集中回收它们，只好等到下一次垃圾回收再处理；

**G1收集器**

G1垃圾收集器的目标是在不同应用场景中**追求高吞吐量和低停顿之间的最佳平衡**。

G1将整个堆分成相同大小的分区（`Region`），有四种不同类型的分区：`Eden、Survivor、Old和Humongous`。分区的大小取值范围为 1M 到 32M，都是2的幂次方。分区大小可以通过`-XX:G1HeapRegionSize`参数指定。`Humongous`区域用于存储大对象。G1规定只要大小超过了一个分区容量一半的对象就认为是大对象。

![](https://raw.githubusercontent.com/Tyson0314/img/master/g1分区.png)

G1 收集器对各个分区回收所获得的空间大小和回收所需时间的经验值进行排序，得到一个优先级列表，每次根据用户设置的最大回收停顿时间，优先回收价值最大的分区。

**特点**：可以由用户**指定**期望的垃圾收集停顿时间。

G1 收集器的回收过程分为以下几个步骤：

- **初始标记**。暂停所有其他线程，记录直接与 `GC Roots` 直接相连的对象，耗时较短 。
- **并发标记**。从`GC Roots`开始对堆中对象进行可达性分析，找出要回收的对象，耗时较长，不过可以和用户程序并发执行。
- **最终标记**。需对其他线程做短暂的暂停，用于处理并发标记阶段对象引用出现变动的区域。
- **筛选回收**。对各个分区的回收价值和成本进行排序，根据用户所期望的停顿时间来制定回收计划，然后把决定回收的分区的存活对象复制到空的分区中，再清理掉整个旧的分区的全部空间。这里的操作涉及存活对象的移动，会暂停用户线程，由多条收集器线程并行完成。

## 常用的 JVM 调优的命令都有哪些？

**jps**：列出本机所有 Java 进程的**进程号**。

常用参数如下：

- `-m` 输出`main`方法的参数
- `-l` 输出完全的包名和应用主类名
- `-v` 输出`JVM`参数

```java
jps -lvm
//output
//4124 com.zzx.Application -javaagent:E:\IDEA2019\lib\idea_rt.jar=10291:E:\IDEA2019\bin -Dfile.encoding=UTF-8
```

**jstack**：查看某个 Java 进程内的**线程堆栈信息**。使用参数`-l`可以打印额外的锁信息，发生死锁时可以使用`jstack -l pid`观察锁持有情况。

```java
jstack -l 4124 | more
```

输出结果如下：

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

`WAITING (parking)`指线程处于挂起中，在等待某个条件发生，来把自己唤醒。

**jstat**：用于查看虚拟机各种**运行状态信息（类装载、内存、垃圾收集等运行数据）**。使用参数`-gcuitl`可以查看垃圾回收的统计信息。

```java
jstat -gcutil 4124
  S0     S1     E      O      M     CCS    YGC     YGCT    FGC    FGCT     GCT
  0.00   0.00  67.21  19.20  96.36  94.96     10    0.084     3    0.191    0.275
```

参数说明：

- **S0**：`Survivor0`区当前使用比例
- **S1**：`Survivor1`区当前使用比例
- **E**：`Eden`区使用比例
- **O**：老年代使用比例
- **M**：元数据区使用比例
- **CCS**：压缩使用比例
- **YGC**：年轻代垃圾回收次数
- **FGC**：老年代垃圾回收次数
- **FGCT**：老年代垃圾回收消耗时间
- **GCT**：垃圾回收消耗总时间

**jmap**：查看**堆内存快照**。通过`jmap`命令可以获得运行中的堆内存的快照，从而可以对堆内存进行离线分析。

查询进程4124的堆内存快照，输出结果如下：

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

**jinfo**：`jinfo -flags 1`。查看当前的应用JVM参数配置。

```java
Attaching to process ID 1, please wait...
Debugger attached successfully.
Server compiler detected.
JVM version is 25.111-b14
Non-default VM flags: -XX:CICompilerCount=2 -XX:InitialHeapSize=31457280 -XX:MaxHeapSize=480247808 -XX:MaxNewSize=160038912 -XX:MinHeapDeltaBytes=196608 -XX:NewSize=10485760 -XX:OldSize=20971520 -XX:+UseCompressedClassPointers -XX:+UseCompressedOops
Command line:
```

**查看所有参数**：`java -XX:+PrintFlagsFinal -version`。用于查看最终值，初始值可能被修改掉（查看初始值可以使用java -XX:+PrintFlagsInitial）。

```java
[Global flags]
    uintx AdaptiveSizeDecrementScaleFactor          = 4                                   {product}
    uintx AdaptiveSizeMajorGCDecayTimeScale         = 10                                  {product}
    uintx AdaptiveSizePausePolicy                   = 0                                   {product}
    uintx AdaptiveSizePolicyCollectionCostMargin    = 50                                  {product}
    uintx AdaptiveSizePolicyInitializingSteps       = 20                                  {product}
    uintx AdaptiveSizePolicyOutputInterval          = 0                                   {product}
    uintx AdaptiveSizePolicyWeight                  = 10                                  {product}
    uintx AdaptiveSizeThroughPutPolicy              = 0                                   {product}
    uintx AdaptiveTimeWeight                        = 25                                  {product}
     bool AdjustConcurrency                         = false                               {product}
     bool AggressiveOpts                            = false                               {product}
     ....
```



## 对象头了解吗？

Java 内存中的对象由以下三部分组成：**对象头**、**实例数据**和**对齐填充字节**。

而对象头由以下三部分组成：**mark word**、**指向类信息的指针**和**数组长度**（数组才有）。

`mark word`包含：对象的哈希码、分代年龄和锁标志位。

对象的实例数据就是 Java 对象的属性和值。

对齐填充字节：因为JVM要求对象占的内存大小是 8bit 的倍数，因此后面有几个字节用于把对象的大小补齐至 8bit 的倍数。

**内存对齐的主要作用是：**

1. 平台原因：不是所有的硬件平台都能访问任意地址上的任意数据的；某些硬件平台只能在某些地址处取某些特定类型的数据，否则抛出硬件异常。
2. 性能原因：经过内存对齐后，CPU的内存访问速度大大提升。

## main方法执行过程

以下是示例代码：

```java
public class Application {
    public static void main(String[] args) {
        Person p = new Person("大彬");
        p.getName();
    }
}

class Person {
    public String name;

    public Person(String name) {
        this.name = name;
    }

    public String getName() {
        return this.name;
    }
}
```

执行`main`方法的过程如下:

1. 编译`Application.java`后得到 `Application.class` 后，执行这个`class`文件，系统会启动一个 `JVM` 进程，从类路径中找到一个名为 `Application.class` 的二进制文件，将 `Application` 类信息加载到运行时数据区的方法区内，这个过程叫做类的加载。
2. JVM 找到 `Application` 的主程序入口，执行`main`方法。
3. `main`方法的第一条语句为 `Person p = new Person("大彬") `，就是让 JVM 创建一个`Person`对象，但是这个时候方法区中是没有 `Person` 类的信息的，所以 JVM 马上加载 `Person` 类，把 `Person` 类的信息放到方法区中。
4. 加载完 `Person` 类后，JVM 在堆中分配内存给 `Person` 对象，然后调用构造函数初始化 `Person` 对象，这个 `Person` 对象持有**指向方法区中的 Person 类的类型信息**的引用。
5. 执行`p.getName()`时，JVM 根据 p 的引用找到 p 所指向的对象，然后根据此对象持有的引用定位到方法区中 `Person` 类的类型信息的方法表，获得 `getName()` 的字节码地址。
6. 执行`getName()`方法。

## 对象创建过程

1. **类加载检查**：当虚拟机遇到一条 `new` 指令时，首先检查是否能在常量池中定位到这个类的符号引用，并且检查这个符号引用代表的类是否已被加载过、解析和初始化过。如果没有，那先执行类加载。
2. **分配内存**：在类加载检查通过后，接下来虚拟机将为对象实例分配内存。
3. **初始化**。分配到的内存空间都初始化为零值，通过这个操作保证了对象的字段可以不赋初始值就直接使用，程序能访问到这些字段的数据类型所对应的零值。
4. **设置对象头**。`Hotspot` 虚拟机的对象头包括：存储对象自身的运行时数据（哈希码、分代年龄、锁标志等等）、类型指针和数据长度（数组对象才有），类型指针就是对象指向它的类信息的指针，虚拟机通过这个指针来确定这个对象是哪个类的实例。
5. **按照`Java`代码进行初始化**。

## 如何排查 OOM 的问题？

> 线上JVM必须配置`-XX:+HeapDumpOnOutOfMemoryError` 和`-XX:HeapDumpPath=/tmp/heapdump.hprof`，当OOM发生时自动 dump 堆内存信息到指定目录

排查 OOM 的方法如下：

- 查看服务器运行日志日志，捕捉到内存溢出异常
- jstat 查看监控JVM的内存和GC情况，评估问题大概出在什么区域
- 使用MAT工具载入dump文件，分析大对象的占用情况 



**参考资料**

- 周志明. 深入理解 Java 虚拟机 [M]. 机械工业出版社

