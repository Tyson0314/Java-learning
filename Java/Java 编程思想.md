<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [基础知识](#%E5%9F%BA%E7%A1%80%E7%9F%A5%E8%AF%86)
  - [数据类型](#%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B)
    - [整型](#%E6%95%B4%E5%9E%8B)
    - [浮点类型](#%E6%B5%AE%E7%82%B9%E7%B1%BB%E5%9E%8B)
    - [char 类型](#char-%E7%B1%BB%E5%9E%8B)
    - [boolean 类型](#boolean-%E7%B1%BB%E5%9E%8B)
    - [大数值](#%E5%A4%A7%E6%95%B0%E5%80%BC)
  - [操作符](#%E6%93%8D%E4%BD%9C%E7%AC%A6)
  - [注释文档](#%E6%B3%A8%E9%87%8A%E6%96%87%E6%A1%A3)
  - [代码规范](#%E4%BB%A3%E7%A0%81%E8%A7%84%E8%8C%83)
- [控制执行流程](#%E6%8E%A7%E5%88%B6%E6%89%A7%E8%A1%8C%E6%B5%81%E7%A8%8B)
  - [switch](#switch)
  - [break 和 continue 实现 goto](#break-%E5%92%8C-continue-%E5%AE%9E%E7%8E%B0-goto)
- [初始化和清理](#%E5%88%9D%E5%A7%8B%E5%8C%96%E5%92%8C%E6%B8%85%E7%90%86)
  - [成员初始化](#%E6%88%90%E5%91%98%E5%88%9D%E5%A7%8B%E5%8C%96)
  - [可变参数列表](#%E5%8F%AF%E5%8F%98%E5%8F%82%E6%95%B0%E5%88%97%E8%A1%A8)
- [访问权限控制](#%E8%AE%BF%E9%97%AE%E6%9D%83%E9%99%90%E6%8E%A7%E5%88%B6)
  - [访问权限修饰词](#%E8%AE%BF%E9%97%AE%E6%9D%83%E9%99%90%E4%BF%AE%E9%A5%B0%E8%AF%8D)
- [复用类](#%E5%A4%8D%E7%94%A8%E7%B1%BB)
  - [继承语法](#%E7%BB%A7%E6%89%BF%E8%AF%AD%E6%B3%95)
  - [final 关键字](#final-%E5%85%B3%E9%94%AE%E5%AD%97)
  - [初始化及类的加载](#%E5%88%9D%E5%A7%8B%E5%8C%96%E5%8F%8A%E7%B1%BB%E7%9A%84%E5%8A%A0%E8%BD%BD)
    - [继承与初始化](#%E7%BB%A7%E6%89%BF%E4%B8%8E%E5%88%9D%E5%A7%8B%E5%8C%96)
- [多态](#%E5%A4%9A%E6%80%81)
  - [缺陷：“覆盖”私有方法](#%E7%BC%BA%E9%99%B7%E8%A6%86%E7%9B%96%E7%A7%81%E6%9C%89%E6%96%B9%E6%B3%95)
  - [域和静态方法](#%E5%9F%9F%E5%92%8C%E9%9D%99%E6%80%81%E6%96%B9%E6%B3%95)
  - [构造器和多态](#%E6%9E%84%E9%80%A0%E5%99%A8%E5%92%8C%E5%A4%9A%E6%80%81)
    - [构造器的调用顺序](#%E6%9E%84%E9%80%A0%E5%99%A8%E7%9A%84%E8%B0%83%E7%94%A8%E9%A1%BA%E5%BA%8F)
- [接口](#%E6%8E%A5%E5%8F%A3)
  - [抽象类](#%E6%8A%BD%E8%B1%A1%E7%B1%BB)
  - [接口的域](#%E6%8E%A5%E5%8F%A3%E7%9A%84%E5%9F%9F)
- [内部类](#%E5%86%85%E9%83%A8%E7%B1%BB)
  - [.this 和 .new](#this-%E5%92%8C-new)
  - [匿名内部类](#%E5%8C%BF%E5%90%8D%E5%86%85%E9%83%A8%E7%B1%BB)
    - [工厂方法](#%E5%B7%A5%E5%8E%82%E6%96%B9%E6%B3%95)
  - [嵌套类](#%E5%B5%8C%E5%A5%97%E7%B1%BB)
  - [为什么需要内部类](#%E4%B8%BA%E4%BB%80%E4%B9%88%E9%9C%80%E8%A6%81%E5%86%85%E9%83%A8%E7%B1%BB)
  - [局部内部类](#%E5%B1%80%E9%83%A8%E5%86%85%E9%83%A8%E7%B1%BB)
  - [内部类标识符](#%E5%86%85%E9%83%A8%E7%B1%BB%E6%A0%87%E8%AF%86%E7%AC%A6)
- [容器](#%E5%AE%B9%E5%99%A8)
  - [添加一组元素](#%E6%B7%BB%E5%8A%A0%E4%B8%80%E7%BB%84%E5%85%83%E7%B4%A0)
  - [迭代器](#%E8%BF%AD%E4%BB%A3%E5%99%A8)
  - [LinkedList](#linkedlist)
  - [Set](#set)
  - [Map](#map)
  - [Queue](#queue)
    - [PriorityQueue](#priorityqueue)
  - [foreach 和 迭代器](#foreach-%E5%92%8C-%E8%BF%AD%E4%BB%A3%E5%99%A8)
  - [适配器方法](#%E9%80%82%E9%85%8D%E5%99%A8%E6%96%B9%E6%B3%95)
- [异常、断言和日志](#%E5%BC%82%E5%B8%B8%E6%96%AD%E8%A8%80%E5%92%8C%E6%97%A5%E5%BF%97)
  - [异常分类](#%E5%BC%82%E5%B8%B8%E5%88%86%E7%B1%BB)
  - [声明异常](#%E5%A3%B0%E6%98%8E%E5%BC%82%E5%B8%B8)
  - [捕获异常](#%E6%8D%95%E8%8E%B7%E5%BC%82%E5%B8%B8)
  - [带资源的 try 语句](#%E5%B8%A6%E8%B5%84%E6%BA%90%E7%9A%84-try-%E8%AF%AD%E5%8F%A5)
  - [断言](#%E6%96%AD%E8%A8%80)
    - [启用和禁用断言](#%E5%90%AF%E7%94%A8%E5%92%8C%E7%A6%81%E7%94%A8%E6%96%AD%E8%A8%80)
  - [日志](#%E6%97%A5%E5%BF%97)
    - [logback](#logback)
- [字符串](#%E5%AD%97%E7%AC%A6%E4%B8%B2)
  - [格式化输出](#%E6%A0%BC%E5%BC%8F%E5%8C%96%E8%BE%93%E5%87%BA)
    - [printf() 和 format()](#printf-%E5%92%8C-format)
    - [Formatter](#formatter)
  - [正则表达式](#%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F)
    - [基础](#%E5%9F%BA%E7%A1%80)
    - [创建正则表达式](#%E5%88%9B%E5%BB%BA%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F)
    - [Pattern 和 Matcher](#pattern-%E5%92%8C-matcher)
  - [扫描输入](#%E6%89%AB%E6%8F%8F%E8%BE%93%E5%85%A5)
    - [Scanner 定界符](#scanner-%E5%AE%9A%E7%95%8C%E7%AC%A6)
    - [用正则表达式扫描](#%E7%94%A8%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F%E6%89%AB%E6%8F%8F)
- [类型信息](#%E7%B1%BB%E5%9E%8B%E4%BF%A1%E6%81%AF)
  - [反射](#%E5%8F%8D%E5%B0%84)
- [泛型](#%E6%B3%9B%E5%9E%8B)
  - [类型参数的好处](#%E7%B1%BB%E5%9E%8B%E5%8F%82%E6%95%B0%E7%9A%84%E5%A5%BD%E5%A4%84)
  - [泛型类](#%E6%B3%9B%E5%9E%8B%E7%B1%BB)
  - [泛型接口](#%E6%B3%9B%E5%9E%8B%E6%8E%A5%E5%8F%A3)
  - [泛型方法](#%E6%B3%9B%E5%9E%8B%E6%96%B9%E6%B3%95)
    - [可变参数和泛型方法](#%E5%8F%AF%E5%8F%98%E5%8F%82%E6%95%B0%E5%92%8C%E6%B3%9B%E5%9E%8B%E6%96%B9%E6%B3%95)
  - [匿名内部类](#%E5%8C%BF%E5%90%8D%E5%86%85%E9%83%A8%E7%B1%BB-1)
  - [泛型擦除](#%E6%B3%9B%E5%9E%8B%E6%93%A6%E9%99%A4)
  - [类型变量的限定](#%E7%B1%BB%E5%9E%8B%E5%8F%98%E9%87%8F%E7%9A%84%E9%99%90%E5%AE%9A)
  - [擦除的问题](#%E6%93%A6%E9%99%A4%E7%9A%84%E9%97%AE%E9%A2%98)
  - [边界](#%E8%BE%B9%E7%95%8C)
  - [通配符](#%E9%80%9A%E9%85%8D%E7%AC%A6)
    - [上界通配符](#%E4%B8%8A%E7%95%8C%E9%80%9A%E9%85%8D%E7%AC%A6)
    - [下界通配符](#%E4%B8%8B%E7%95%8C%E9%80%9A%E9%85%8D%E7%AC%A6)
- [数组](#%E6%95%B0%E7%BB%84)
  - [复制数组](#%E5%A4%8D%E5%88%B6%E6%95%B0%E7%BB%84)
  - [Arrays 工具](#arrays-%E5%B7%A5%E5%85%B7)
    - [数组拷贝](#%E6%95%B0%E7%BB%84%E6%8B%B7%E8%B4%9D)
    - [数组的比较](#%E6%95%B0%E7%BB%84%E7%9A%84%E6%AF%94%E8%BE%83)
    - [数组元素的比较](#%E6%95%B0%E7%BB%84%E5%85%83%E7%B4%A0%E7%9A%84%E6%AF%94%E8%BE%83)
    - [数组排序](#%E6%95%B0%E7%BB%84%E6%8E%92%E5%BA%8F)
    - [排序数组查找](#%E6%8E%92%E5%BA%8F%E6%95%B0%E7%BB%84%E6%9F%A5%E6%89%BE)
- [容器深入研究](#%E5%AE%B9%E5%99%A8%E6%B7%B1%E5%85%A5%E7%A0%94%E7%A9%B6)
  - [填充容器](#%E5%A1%AB%E5%85%85%E5%AE%B9%E5%99%A8)
  - [SortedSet](#sortedset)
  - [队列](#%E9%98%9F%E5%88%97)
    - [优先级队列](#%E4%BC%98%E5%85%88%E7%BA%A7%E9%98%9F%E5%88%97)
    - [双向队列](#%E5%8F%8C%E5%90%91%E9%98%9F%E5%88%97)
  - [LinkedHashMap](#linkedhashmap)
  - [Colletions 工具类](#colletions-%E5%B7%A5%E5%85%B7%E7%B1%BB)
    - [排序和查询](#%E6%8E%92%E5%BA%8F%E5%92%8C%E6%9F%A5%E8%AF%A2)
    - [只读容器](#%E5%8F%AA%E8%AF%BB%E5%AE%B9%E5%99%A8)
    - [Collection 和 Map 的同步控制](#collection-%E5%92%8C-map-%E7%9A%84%E5%90%8C%E6%AD%A5%E6%8E%A7%E5%88%B6)
    - [快速报错机制](#%E5%BF%AB%E9%80%9F%E6%8A%A5%E9%94%99%E6%9C%BA%E5%88%B6)
  - [Java 1.0/1.1 的容器](#java-1011-%E7%9A%84%E5%AE%B9%E5%99%A8)
    - [BitSet](#bitset)
- [Java I/O 系统](#java-io-%E7%B3%BB%E7%BB%9F)
  - [输入和输出](#%E8%BE%93%E5%85%A5%E5%92%8C%E8%BE%93%E5%87%BA)
    - [InputStream 和 OutputStream](#inputstream-%E5%92%8C-outputstream)
    - [Reader 和 Writer](#reader-%E5%92%8C-writer)
  - [组合输入输出流过滤器](#%E7%BB%84%E5%90%88%E8%BE%93%E5%85%A5%E8%BE%93%E5%87%BA%E6%B5%81%E8%BF%87%E6%BB%A4%E5%99%A8)
  - [文本输入和输出](#%E6%96%87%E6%9C%AC%E8%BE%93%E5%85%A5%E5%92%8C%E8%BE%93%E5%87%BA)
  - [以文本格式存储对象](#%E4%BB%A5%E6%96%87%E6%9C%AC%E6%A0%BC%E5%BC%8F%E5%AD%98%E5%82%A8%E5%AF%B9%E8%B1%A1)
  - [字符编码方式](#%E5%AD%97%E7%AC%A6%E7%BC%96%E7%A0%81%E6%96%B9%E5%BC%8F)
  - [读写二进制数据](#%E8%AF%BB%E5%86%99%E4%BA%8C%E8%BF%9B%E5%88%B6%E6%95%B0%E6%8D%AE)
    - [DataInput 和 DataOutput](#datainput-%E5%92%8C-dataoutput)
    - [随机访问文件](#%E9%9A%8F%E6%9C%BA%E8%AE%BF%E9%97%AE%E6%96%87%E4%BB%B6)
    - [序列化](#%E5%BA%8F%E5%88%97%E5%8C%96)
  - [操作文件](#%E6%93%8D%E4%BD%9C%E6%96%87%E4%BB%B6)
    - [目录列表器](#%E7%9B%AE%E5%BD%95%E5%88%97%E8%A1%A8%E5%99%A8)
  - [](#)
- [枚举类型](#%E6%9E%9A%E4%B8%BE%E7%B1%BB%E5%9E%8B)
  - [基本 enum 特性](#%E5%9F%BA%E6%9C%AC-enum-%E7%89%B9%E6%80%A7)
  - [向 enum 添加新方法](#%E5%90%91-enum-%E6%B7%BB%E5%8A%A0%E6%96%B0%E6%96%B9%E6%B3%95)
  - [覆盖 enum 的方法](#%E8%A6%86%E7%9B%96-enum-%E7%9A%84%E6%96%B9%E6%B3%95)
  - [Switch 语句中的 enum](#switch-%E8%AF%AD%E5%8F%A5%E4%B8%AD%E7%9A%84-enum)
  - [EnumSet](#enumset)
    - [源码解析](#%E6%BA%90%E7%A0%81%E8%A7%A3%E6%9E%90)
  - [EnumMap](#enummap)
- [注解](#%E6%B3%A8%E8%A7%A3)
  - [基本语法](#%E5%9F%BA%E6%9C%AC%E8%AF%AD%E6%B3%95)
    - [自定义注解](#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%B3%A8%E8%A7%A3)
  - [元注解](#%E5%85%83%E6%B3%A8%E8%A7%A3)
  - [编写注解处理器](#%E7%BC%96%E5%86%99%E6%B3%A8%E8%A7%A3%E5%A4%84%E7%90%86%E5%99%A8)
  - [注解综合](#%E6%B3%A8%E8%A7%A3%E7%BB%BC%E5%90%88)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 基础知识

### 数据类型

#### 整型

| 类型  | 存储空间 |
| ----- | -------- |
| int   | 4字节    |
| short | 2字节    |
| long  | 8字节    |
| byte  | 1字节    |

byte 的取值范围是-128~127。整型的取值范围和运行 Java 代码的机器无关。Java 没有无符号的整型。

**数据类型表示：**

长整型：400L

十六进制：0xCA

八进制：020（有前缀0）

二进制：0b1001（Java 7及以上版本）

从 Java 7开始，可以为数据字面量添加下划线，如1_000_000，方便易读。Java 编译器会去除这些下划线。

#### 浮点类型

| 类型   | 存储空间 |
| ------ | -------- |
| float  | 4字节    |
| double | 8字节    |

float 类型的数值会有后缀 F 或者 f （2.01F），没有后缀 F 的浮点数默认为 double 类型（也可以加后缀 D）。浮点数采用二进制系统表示，有些数值会有精度损失，如`System.out.println(2.0 - 1.1)`会输出0.8999999999999999。如果数值计算不允许有任何精度误差，应该使用 BigDecimal。

**特殊值**

正无穷大：Double.POSITIVE_INFINITY

负无穷大：Double.NEGATIVE_INFINITY

NaN（不是一个数字）：Double.NaN

#### char 类型

Unicode 字符用一个或者两个 char 值描述。Unicode 字符可以表示为十六进制，其范围从/u0000到/uffff。

#### boolean 类型

布尔类型有两个值：true 和 false。布尔型和整型不能相互转化。Java 语言表达式所操作的 boolean 值，在编译之后都使用Java虚拟机中的int数据类型来代替，而 boolean 数组将会被编码成 Java 虚拟机的 byte 数组，每个元素 boolean 元素占8位”。这样我们可以得出 boolean 类型占了单独使用是4个字节，在数组中又是1个字节。

#### 大数值

BigInteger 实现了任意精度的整数运算，BigDecimal 实现了任意精度的浮点数运算。

```java
BigInteger a = BigInteger.valueOf(100);
BigInteger b = BigInteger.valueOf(100);
BigInteger c = a.add(b);
BigInteger d = c.multiply(b.add(BigInteger.valueOf(2)));
```

### 操作符

**截尾和舍入**

```java
float num = 0.7f;
//类型转化对数字进行截尾
System.out.println((int)num); //0
//四舍五入操作
System.out.println(Math.round(num)); //1
```

### 注释文档

javadoc 用来提取注释的工具。javadoc 只能为 public 和 protected 成员进行文档注释。

### 代码规范

可以采用将 public 成员放在开头，后面跟着 protect、包访问权限和 private 成员的创建类的形式，方便类的使用者阅读最为重要的部分（public成员）。

```java
public class OrganizedByAccess {
    public void method1() {}
    public void method2() {}
    protected void method3() {}
    void method4() {}
    private method5() {}
    private int i;
    //...
}
```

 

## 控制执行流程

### switch

break 会跳出 switch 语句，没有 break 语句则会一直往下执行。

```java
int i = 1;
switch (i) {
    case 0:
        System.out.println("i = 0");
        break;
    case 1:
        System.out.println("i = 1");
        break;
    case 2:
        System.out.println("i = 2");
        break;
    default:
        System.out.println("i >= 3");
}
//输出i = 1

switch (i) {
    case 0:
        System.out.println("i = 0");
        //break;
    case 1:
        System.out.println("i = 1");
        //break;
    case 2:
        System.out.println("i = 2");
        //break;
    default:
        System.out.println("i >= 3");
}
//输出
//i = 1
//i = 2
//i >= 3
```

### break 和 continue 实现 goto

```java
public class LabeledFor {
  public static void main(String[] args) {
    int i = 0;
    outer: // Can't have statements here
    for(; true ;) { // infinite loop
      inner: // Can't have statements here
      for(; i < 10; i++) {
        print("i = " + i);
        if(i == 2) {
          print("continue");
          continue;
        }
        if(i == 3) {
          print("break");
          i++;
          break;//break跳出循环，不会执行递增操作
        }
        if(i == 7) {
          print("continue outer");
          i++; 
          continue outer;//continue跳到循环顶部，不会执行递增操作
        }
        if(i == 8) {
          print("break outer");
          break outer;
        }
        for(int k = 0; k < 5; k++) {
          if(k == 3) {
            print("continue inner");
            continue inner;
          }
        }
      }
    }
    // Can't break or continue to labels here
  }
}
```



## 初始化和清理

### 成员初始化

局部变量未初始化就使用，会产生编译时错误。类的数据成员是基本类型，它们会有初值（如 int 类型的数据成员初值为0）。

### 可变参数列表

Java SE5 开始支持可变参数列表。当指定参数时，编译器会将元素列表转换为数组。

```java
public class VarArgs {
    public static void printArray(Object... args) {
        for(Object obj : args) {
            System.out.print(obj + " ");
        }
        System.out.println();
    }

    public static void main(String[] args) {
        printArray(new Integer(1), new Integer(3));
        printArray("tyson", "sophia", "tom");
        printArray(new Integer[]{2, 4, 6});
        printArray();//空列表
    }
}
```

## 访问权限控制

package 语句必须是文件中第一行非注释代码。

### 访问权限修饰词

1. 包访问权限

   默认的访问权限没有任何关键字，通常是指包访问权限，即当前包的所有其他类对当前成员具有访问权限。

2. protected

   继承访问权限，派生类可以访问基类的 protected 元素。同时，protected 也提供包访问权限，即相同包内的其他类也可以访问 protected 元素。

3. private

   通过 private 隐藏了代码细节，类库设计者可以更改类内部工作方式，而不会影响客户端。

4. public



示例代码：

```java
package com.tyson.chapter6_access;
//Cookie.java
public class Cookie {
    public Cookie() {
        System.out.println("Cookie constructor");
    }
    protected void bite() {
        System.out.println("bite");
    }
}

//ChocolateChip.java
public class ChocolateChip extends Cookie {
    //私有构造器
    private ChocolateChip() {
        System.out.println("chocolate chip constructor");
    }
    //通过静态方法创建类
    public static ChocolateChip createChocolateChip() {
        return new ChocolateChip();
    }

    public void chomp() {
        //访问父类的protected成员
        bite();
    }
}

class Application {
    public static void main(String[] args) {
        ChocolateChip chocolateChip = ChocolateChip.createChocolateChip();
        chocolateChip.chomp();
    }
}
```



## 复用类

### 继承语法

派生类如果没有指定某个基类的构造器，则会调用基类的默认构造器，若没有默认的构造器（不带参数的构造器），编译器会报错。

### final 关键字

1. final 数据

   基本类型变量用 final 修饰，则该变量是常量，数值不能改变；对象引用用 final 修饰，则一旦该引用被初始化指向一个对象，就不能再把它改为指向另一个对象，不过对象自身可以修改，只是引用不能修改。

2. final 参数

   将参数指明为 final，则无法在方法中更改参数。

```java
public class FinalArguments {
    void add(final Num num) {
        //num = new Num(1); //不能更改final参数
        num.i++;
    }
    void add(final int i) {
        //i++; //不能更改final参数的值
    }
}

class Num {
    int i;
    public Num(int i) {
        this.i = i;
    }
}
```

3. final 方法

   final 方法不能被重写，使用 final 方法主要是为了防止继承类修改它的含义。过去使用 final 方法效率会高点，现在的 JVM 相比之前有了很大的优化，没必要通过设置 final 来提高效率。

4. final 类

   final 类不能被继承。final 类的所有方法都被隐式指定为 final。JDK 的 String 类就是 final 类。

### 初始化及类的加载

#### 继承与初始化

```java
class Insect {
    private int i = printInit("Insect.i initialized");
    protected int j;
    Insect() {
        System.out.println("i = " + i + ", j = " + j);
        j = 39;
    }
    private static int x1 =
            printInit("static Insect.x1 initialized");
    static int printInit(String s) {
        System.out.println(s);
        return 47;
    }
}

public class Beetle extends Insect {
    private int k = printInit("Beetle.k initialized");
    public Beetle() {
        System.out.println("k = " + k + ", j = " + j);
    }
    private static int x2 =
            printInit("static Beetle.x2 initialized");
    public static void main(String[] args) {
        System.out.println("Beetle constructor");
        Beetle b = new Beetle();
    }
}
/*output
static Insect.x1 initialized
static Beetle.x2 initialized
Beetle constructor
Insect.i initialized
i = 47, j = 0
Beetle.k initialized
k = 47, j = 39
 */
```



## 多态

封装把接口和实现分离开来，多态消除类型之间的耦合关系。

向上转型：将子类看作是它的基类的过程。子类转型为基类就是在继承图上向上移动。

![向上转型](https://img2018.cnblogs.com/blog/1252910/201904/1252910-20190402204948375-70203256.png)

### 缺陷：“覆盖”私有方法

```java
public class PrivateOverride {
    private void f() {
        System.out.println("private f()");
    }

    public static void main(String[] args) {
        PrivateOverride po = new Derived();
        po.f();
    }
}

class Derived extends PrivateOverride {
    public void f() {
        System.out.println("public f()");
    }
}
/*
private f()
 */
```

Derived 类的 f() 实际上是一个全新的方法。基类的 f() 方法在子类 Derived 中不可见，因此不能被重载。

### 域和静态方法

只有普通的方法调用具备多态性，域和静态方法没有多态性。

### 构造器和多态

构造器实际上是 static 方法，只不过 static 声明是隐式的，不具备多态性。

#### 构造器的调用顺序

```java
class Meal {
    private int weight = get();
    Meal() {
        print("Meal()");
    }
    public int get() {
        System.out.println("Meal.get()");
        return 1;
    }
}

class Bread {
    Bread() {
        print("Bread()");
    }
}

class Cheese {
    Cheese() {
        print("Cheese()");
    }
}

class Lettuce {
    Lettuce() {
        print("Lettuce()");
    }
}

class Lunch extends Meal {
    private int price = food();
    Lunch() {
        print("Lunch()");
    }
    public int food() {
        System.out.println("Lunch.food()");
        return 1;
    }
}

class PortableLunch extends Lunch {
    PortableLunch() {
        print("PortableLunch()");
    }
}

public class Sandwich extends PortableLunch {
    private Bread b = new Bread();
    private Cheese c = new Cheese();
    private Lettuce l = new Lettuce();

    public Sandwich() {
        print("Sandwich()");
    }

    public static void main(String[] args) {
        new Sandwich();
    }
} /* Output:
Meal.get()
Meal()
Lunch.food()
Lunch()
PortableLunch()
Bread()
Cheese()
Lettuce()
Sandwich()
*/

```

调用顺序：

1. 按照声明顺序调用基类成员的初始化方法
2. 基类构造器。从最顶层的基类到最底层的派生类
3. 按照声明顺序调用成员的初始化方法
4. 派生类构造器



## 接口

接口和内部类为我们提供了一种将接口与实现分离的方法。

### 抽象类

从一个抽象类继承，需要为基类中的所有方法提供方法定义。如果没有提供，则派生类也是抽象类。

如果有一个类，让其包含任何 abstract 方法都没有实际意义，而我们又想阻止产生这个类的任何对象，这时候可以把它设置成一个没有任何抽象方法的抽象类。

### 接口的域

接口中的域都自动声明为`public static  final`，故接口可以用来创建常量组。Java SE5之前没有提供 enum 实现，可以通过接口实现 enum 的功能。

## 内部类

内部类允许把一些逻辑相关的类组织在一起，并控制内部类的可视性。内部类可以访问外围类，有些通过编写内部类可以让代码结构更清晰。

### .this 和 .new

使用外部类的名字后面紧跟 .this，可以生成对外部类对象的引用。

```java
public class DotThis {
    void f() {
        System.out.println("DotThis.f()");
    }
    public class Inner {
        public DotThis outer() {
            return DotThis.this;
        }
    }
    public Inner inner() {
        return new Inner();
    }

    public static void main(String[] args) {
        DotThis dt = new DotThis();
        DotThis.Inner dti = dt.inner();
        dti.outer().f();
    }
}
//output DotThis.f()
```

使用 .new 创建内部类的对象。

```java
public class DotNew {
    public class Inner {}

    public static void main(String[] args) {
        DotNew dn = new DotNew();
        DotNew.Inner dni = dn.new Inner();
    }
}
```

创建内部类的对象，必须通过外部类的对象来创建，在拥有外部类对象之前是不可能创建内部类对象的。这是因为内部类对象会隐式连接到创建它的外部类对象上。但是如果创建的是嵌套类（静态内部类），则不需要创建外部类对象。

### 匿名内部类

```java
//Wrapping.java
public class Wrapping {
    private int i;

    public Wrapping(int x) {
        i = x;
    }
    public int value() {
        return i;
    }
}

//Parcel.java
public class Parcel {
    public Wrapping wrapping(int x) {
        return new Wrapping(x) {//传递构造器参数
            @Override
            public int value() {
                return super.value() * 47;
            }
        };
    }

    public static void main(String[] args) {
        Parcel p = new Parcel();
        Wrapping w = p.wrapping(8);
        System.out.println(w.value());
    }
}
//output 376
```

在匿名类定义字段时，还能够对其执行初始化操作。

```java
//Destination.java
public interface Destination {
    String readLabel();
}

//Parcel1.java
public class Parcel1 {
    public Destination destination(final String dest) {
        return new Destination() {
            private String label = dest;
            @Override
            public String readLabel() {
                return label;
            }
        };
    }

    public static void main(String[] args) {
        Parcel1 p1 = new Parcel1();
        Destination d = p1.destination("Puning");
        System.out.println(d.readLabel());
    }
}
```

匿名内部类没有命名构造器，通过实例初始化给匿名内部类创建构造器的效果。

```java
abstract class Base {
    public Base(int i) {
        System.out.println("Base constructor, i = " + i);
    }

    public abstract void f();
}

public class AnonymousConstructor {
    public static Base getBase(int i) {
        return new Base(i) {
            //构造器的效果
            {
                System.out.println("Inside instance initializer");
            }
            @Override
            public void f() {
                System.out.println("In anonymous f()");
            }
        };
    }

    public static void main(String[] args) {
        Base base = getBase(47);
        base.f();
    }
} /* Output:
Base constructor, i = 47
Inside instance initializer
In anonymous f()
*/
```

#### 工厂方法

使用匿名内部类改进工厂方法。

```java
interface Game { boolean move();}
interface GameFactory { Game getGame();}

public class Games {
    public static void playGame(GameFactory gameFactory) {
        Game game = gameFactory.getGame();
        while(game.move()) {
            ;
        }
    }

    public static void main(String[] args) {
        playGame(Checkers.factory);
        playGame(Chess.factory);
    }
}

class Chess implements Game {

    private Chess() {}
    private int moves = 0;
    private static final int MOVES = 4;

    @Override
    public boolean move() {
        System.out.println("chess move " + moves);
        return ++moves != MOVES;
    }

    public static GameFactory factory = new GameFactory() {
        @Override
        public Game getGame() {
            return new Chess();
        }
    };
}

class Checkers implements Game {
    private Checkers() {}
    private int moves = 0;
    private static final int MOVES = 3;
    @Override
    public boolean move() {
        System.out.println("checkers move" + moves);
        return ++moves != MOVES;
    }

    public static GameFactory factory = new GameFactory() {
        @Override
        public Game getGame() {
            return new Checkers();
        }
    };
}
/*
checkers move0
checkers move1
checkers move2
chess move 0
chess move 1
chess move 2
chess move 3
 */
```

### 嵌套类

将内部类声明为 static，即为嵌套类。普通的内部类隐式保存了一个指向外围类对象的引用，而嵌套类没有。所以创建嵌套类的对象，不需要先创建外围类对象。并且嵌套类不能访问非静态的外围类的成员。

普通的内部类不能包含 static 字段和 static 方法，也不能包含嵌套类，但嵌套类可以包含这些。

```java
public class NestingClass {
    public static class StaticInner {
        public void dynamicFuc() {
            System.out.println("StaticInner动态方法");
        }
        public static void staticFuc() {
            System.out.println("StaticInner静态方法");
        }
    }

    public static void main(String[] args) {
        StaticInner si = new StaticInner();
        si.dynamicFuc();
        StaticInner.staticFuc();//直接通过类名调用静态方法
    }
}
/*
StaticInner动态方法
StaticInner静态方法
 */
```

嵌套类没有.this引用。

### 为什么需要内部类

使用内部类可以实现多重继承。

```java
interface Selector {
    boolean end();
    Object current();
    void next();
}

public class Sequence {
    private Object[] items;
    private int next = 0;

    public Sequence(int size) {
        items = new Object[size];
    }

    public void add(Object x) {
        if (next < items.length)
            items[next++] = x;
    }

    private class SequenceSelector implements Selector {
        private int i = 0;
        
        public boolean end() {
            return i == items.length;
        }
        public Object current() {
            return items[i];
        }
        public void next() {
            if (i < items.length) i++;
        }
    }

    public Selector selector() {
        return new SequenceSelector();
    }

    public static void main(String[] args) {
        Sequence sequence = new Sequence(10);
        for (int i = 0; i < 10; i++)
            sequence.add(Integer.toString(i));
        Selector selector = sequence.selector();
        while (!selector.end()) {
            System.out.print(selector.current() + " ");
            selector.next();
        }
    }
} /* Output:
0 1 2 3 4 5 6 7 8 9
*/
```

如果 Sequence.java 不使用内部类，就必须声明 Sequence 是一个 Selector，对于某个特定的 Sequence 只能有一个 Selector。使用内部类的话很容易就可以拥有另一个方法 reverseSelector()，用来生成一个反向遍历序列的 Selector。

### 局部内部类

```java
interface Counter {int next();}

public class LocalInnerClass {
    private int count = 0;

    Counter getCounter(final String name) {
        // A local inner class:
        class LocalCounter implements Counter {
            public LocalCounter() {
                // Local inner class can have a constructor
                print("LocalCounter()");
            }

            public int next() {
                printnb(name); // Access local final
                return count++;
            }
        }
        return new LocalCounter();
    }

    // The same thing with an anonymous inner class:
    Counter getCounter2(final String name) {
        return new Counter() {
            // Anonymous inner class cannot have a named
            // constructor, only an instance initializer:
            {
                print("Counter()");
            }

            public int next() {
                printnb(name); // Access local final
                return count++;
            }
        };
    }

    public static void main(String[] args) {
        LocalInnerClass lic = new LocalInnerClass();
        Counter c1 = lic.getCounter("Local inner "),
                c2 = lic.getCounter2("Anonymous inner ");
        print(c1.next());
        print(c2.next());
    }
} /* Output:
LocalCounter()
Counter()
Local inner 0
Anonymous inner 1
*/
```

局部内部类可以拥有命名的构造器或者重载构造器，而匿名内部类只能使用实例初始化。如果需要不止一个该内部类对象，那么只能使用局部内部类。

### 内部类标识符

内部类文件的命名格式：外围类名字加上"$"，再加上内部类的名字（如果是匿名类，则是一个数字）。

`LocalInnerClass$1LocalCounter.class`

`LocalInnerClass$1.class`



## 容器

![容器分类](https://img2018.cnblogs.com/blog/1252910/201904/1252910-20190407155626374-53010434.png)

### 添加一组元素

```java
public class AddingGroups {
    public static void main(String[] args) {
        Collection<Integer> nums = new ArrayList<>(Arrays.asList(1, 2, 3, 4));
        Integer[] ints = {5, 6, 7};
        nums.addAll(Arrays.asList(ints));
        Collections.addAll(nums, 8, 9);
        Collections.addAll(nums, ints);

        List<Integer> list = Arrays.asList(1, 2, 3);
        list.set(1, 90);
        System.out.println(list.getClass());
        //底层是数组java.util.Arrays$ArrayList，不能修改结构，java.lang.UnsupportedOperationException
        //list.add(7);
    }
}
```

`Arrays.asList()`返回类型是`java.util.Arrays$ArrayList`，底层是数组，试图删除或增加元素会抛异常 UnsupportedOperationException。

### 迭代器

```java
import typeinfo.pets.Pet;
import typeinfo.pets.Pets;
import java.util.Iterator;
import java.util.List;

public class SimpleIteration {
    public static void main(String[] args) {
        List<Pet> pets = Pets.arrayList(8);
        Iterator<Pet> it = pets.iterator();
        while(it.hasNext()) {
            Pet p = it.next();
            System.out.print(p.id() + ":" + p + " ");
        }
        System.out.println();
        for(Pet p : pets) {
            System.out.print(p.id() + ":" + p + " ");
        }
        System.out.println();
        it = pets.iterator();
        for(int i = 0; i < 4; i++) {
            it.next();
            it.remove();//删除最近遍历的元素
        }
        System.out.println(pets);
    }
}
/*output
0:Rat 1:Manx 2:Cymric 3:Mutt 4:Pug 5:Cymric 6:Pug 7:Manx
0:Rat 1:Manx 2:Cymric 3:Mutt 4:Pug 5:Cymric 6:Pug 7:Manx
[Pug, Cymric, Pug, Manx]
 */
```

ListIterator 是一个更为强大的 Iterator 子类型，它只能用于各种 List 类的遍历。ListIterator 可以双向移动。它还可以产生迭代器当前位置前一个和后一个元素的索引，并且可以使用 set() 方法修改最近遍历的元素。通过 listIterator(index) 可以创建指向索引为index的元素的ListIterator。

```java
public class ListIteration {
    public static void main(String[] args) {
        List<Pet> pets = Pets.arrayList(8);
        ListIterator<Pet> it = pets.listIterator();
        while(it.hasNext()) {
            System.out.print(it.next() + ", " + it.nextIndex() +
            ", " + it.previousIndex() + "; ");
        }
        System.out.println();
        while(it.hasPrevious()) {
            System.out.print(it.previous().id() + " ");
        }
        System.out.println();
        System.out.println(pets);
        //创建指向索引为index元素处的ListIterator
        it = pets.listIterator(3);
        while(it.hasNext()) {
            it.next();
            it.set(Pets.randomPet());
        }
        System.out.println(pets);
    }
}/*output
Rat, 1, 0; Manx, 2, 1; Cymric, 3, 2; Mutt, 4, 3; Pug, 5, 4; Cymric, 6, 5; Pug, 7, 6; Manx, 8, 7;
7 6 5 4 3 2 1 0
[Rat, Manx, Cymric, Mutt, Pug, Cymric, Pug, Manx]
[Rat, Manx, Cymric, Cymric, Rat, EgyptianMau, Hamster, EgyptianMau]
 */
```

### LinkedList

```java
public class LinkedListFeatures {
  public static void main(String[] args) {
    LinkedList<Pet> pets =
      new LinkedList<Pet>(Pets.arrayList(5));
    print(pets);
    // Identical:
    print("pets.getFirst(): " + pets.getFirst());
    print("pets.element(): " + pets.element());
    // Only differs in empty-list behavior:
    print("pets.peek(): " + pets.peek());
    // Identical; remove and return the first element:
    print("pets.remove(): " + pets.remove());
    print("pets.removeFirst(): " + pets.removeFirst());
    // Only differs in empty-list behavior:
    print("pets.poll(): " + pets.poll());
    print(pets);
    pets.addFirst(new Rat());
    print("After addFirst(): " + pets);
    pets.offer(Pets.randomPet());
    print("After offer(): " + pets);
    pets.add(Pets.randomPet());
    print("After add(): " + pets);
    pets.addLast(new Hamster());
    print("After addLast(): " + pets);
    print("pets.removeLast(): " + pets.removeLast());
  }
} /* Output:
[Rat, Manx, Cymric, Mutt, Pug]
pets.getFirst(): Rat
pets.element(): Rat
pets.peek(): Rat
pets.remove(): Rat
pets.removeFirst(): Manx
pets.poll(): Cymric
[Mutt, Pug]
After addFirst(): [Rat, Mutt, Pug]
After offer(): [Rat, Mutt, Pug, Cymric]
After add(): [Rat, Mutt, Pug, Cymric, Pug]
After addLast(): [Rat, Mutt, Pug, Cymric, Pug, Hamster]
pets.removeLast(): Hamster
*/
```

LinkedList 具有实现栈所有功能的所有方法，可以将 LinkedList 作为栈使用：

```java
public class MyStack<T> {
    private LinkedList<T> storage = new LinkedList<>();
    public void push(T t) {
        storage.addFirst(t);
    }
    public T pop() {
        return storage.removeFirst();
    }
    public T peek() {
        return storage.getFirst();
    }
    public boolean isEmpty() {
        return storage.isEmpty();
    }
    @Override
    public String toString() {
        return storage.toString();
    }
}
```

### Set

Set 不保存重复的元素，插入相同的元素会被忽略。HashSet 存储元素没有顺序；TreeSet 按照升序的方式存储元素；LinkedHashList 使用链表维护元素的插入顺序，并通过散列提供了快速访问能力。

```java
public class SortedSetOfInteger {
    public static void main(String[] args) {
        Random rand = new Random(47);
        SortedSet<Integer> set = new TreeSet<>();
        for (int i = 0; i < 1000; i++) {
            set.add(rand.nextInt(30));
        }
        System.out.println(set);
    }
}
/*output
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29]
 */
```

TreeSet 对字母排序是按照字典序，大小写字母会被分到不同的组，如果想按照字母序排序，可以向 TreeSet 构造器传入 String.CASE_INSENTIVE_ORDER 比较器。

```java
public class SortedWords {
    public static void main(String[] args) {
        //往构造器传入String.CASE_INSENTIVE_ORDER 比较器
        Set<String> words = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);
        String[] strs = {"hello", "world", "tyson", "a"};
        words.addAll(Arrays.asList(strs));
        System.out.println(words);
    }
}
/*
[a, hello, tyson, world]
 */
```

### Map

HashMap 设计用来快速访问；TreeMap保持键始终处于升序状态；LinkedHashMap 使用链表维护元素的插入顺序，并通过散列提供了快速访问能力。

```java
public class PetMap {
    public static void main(String[] args) {
        Map<String, Pet> petMap = new HashMap<>();
        petMap.put("Tyson", new Cat("cat"));
        petMap.put("Sophia", new Dog("dog"));
        petMap.put("Tom", new Hamster("hamster"));

        System.out.println(petMap.keySet());
        System.out.println(petMap.values());
        for(String person : petMap.keySet()) {
            System.out.println(person + " : " + petMap.get(person));
        }

        Set<Map.Entry<String, Pet>> entries = petMap.entrySet();
        for(Map.Entry<String, Pet> entry : entries) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
            entry.setValue(new Cat("cat"));
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }

    }
}
/*output
[Tom, Tyson, Sophia]
[Hamster hamster, Cat cat, Dog dog]
Tom : Hamster hamster
Tyson : Cat cat
Sophia : Dog dog
Tom: Hamster hamster
Tom: Cat cat
Tyson: Cat cat
Tyson: Cat cat
Sophia: Dog dog
Sophia: Cat cat
 */
```

### Queue

LinkedList 实现了 Queue 接口，可以作为队列使用。

```java
public class QueueDemo {
    public static <T> void printQ(Queue<T> queue) {
        while(queue.peek() != null) {
            System.out.print(queue.remove() + " ");
        }
        System.out.println();
    }
    public static void main(String[] args) {
        Queue<Integer> queue = new LinkedList<>();
        Random rand = new Random(47);
        for(int i = 0; i < 10; i++) {
            queue.offer(rand.nextInt(i + 10));
        }
        printQ(queue);
        Queue<Character> qc = new LinkedList<>();
        for(char c : "tyson".toCharArray()) {
            qc.offer(c);
        }
        printQ(qc);
    }
}
```

peek()和 element()都将在不移除的情况下返回对头，peek()方法在队列为空时返回 null，而element()会跑 NoSuchElementExeception 异常。

poll()和remove()方法将移除并返回对头，poll()在队列为空时返回 null，而remove()会跑 NoSuchElementExeception 异常。

#### PriorityQueue

Integer、String 和 Character 内建了自然排序，可以与 PriorityQueue 一起工作。要想在 PriorityQueue 中使用自己的类，就必须提供自己的 Comparator。

```java
public class PriorityQueueDemo {
  public static void main(String[] args) {
    PriorityQueue<Integer> priorityQueue =
      new PriorityQueue<Integer>();
    Random rand = new Random(47);
    for(int i = 0; i < 10; i++)
      priorityQueue.offer(rand.nextInt(i + 10));
    QueueDemo.printQ(priorityQueue);

    List<Integer> ints = Arrays.asList(25, 22, 20,
      18, 14, 9, 3, 1, 1, 2, 3, 9, 14, 18, 21, 23, 25);
    priorityQueue = new PriorityQueue<Integer>(ints);
    QueueDemo.printQ(priorityQueue);
    priorityQueue = new PriorityQueue<Integer>(
        ints.size(), Collections.reverseOrder());
    priorityQueue.addAll(ints);
    QueueDemo.printQ(priorityQueue);

    String fact = "EDUCATION SHOULD ESCHEW OBFUSCATION";
    List<String> strings = Arrays.asList(fact.split(""));
    PriorityQueue<String> stringPQ =
      new PriorityQueue<String>(strings);
    QueueDemo.printQ(stringPQ);
    stringPQ = new PriorityQueue<String>(
      strings.size(), Collections.reverseOrder());
    stringPQ.addAll(strings);
    QueueDemo.printQ(stringPQ);

    Set<Character> charSet = new HashSet<Character>();
    for(char c : fact.toCharArray())
      charSet.add(c); // Autoboxing
    PriorityQueue<Character> characterPQ =
      new PriorityQueue<Character>(charSet);
    QueueDemo.printQ(characterPQ);
  }
} /* Output:
0 1 1 1 1 1 3 5 8 14
1 1 2 3 3 9 9 14 14 18 18 20 21 22 23 25 25
25 25 23 22 21 20 18 18 14 14 9 9 3 3 2 1 1
       A A B C C C D D E E E F H H I I L N N O O O O S S S T T U U U W
W U U U T T S S S O O O O N N L I I H H F E E E D D C C C B A A
  A B C D E F H I L N O S T U W
*///:~
```

### foreach 和 迭代器

Java SE5引入了 Iterable 接口，该接口包含了一个能够产生 Iterator 的 iterator()方法。任何实现了 Iterable 的类（如Collection）都可以应用于 foreach 语句中。

```java
public class IterableClass implements Iterable<String> {
    protected String[] words = {"hello", "world", "program"};
    @Override
    public Iterator<String> iterator() {
        return new Iterator<String>() {
            private int index = 0;
            @Override
            public boolean hasNext() {
                return index < words.length;
            }
            @Override
            public String next() {
                return words[index++];
            }
            @Override
            public void remove() {
                throw new UnsupportedOperationException();
            }
        };
    }

    public static void main(String[] args) {
        for(String s : new IterableClass()) {
            System.out.print(s + " ");
        }
    }
}
```

### 适配器方法

添加反向迭代器功能。

```java
public class ReversibleArrayList<T> extends ArrayList<T> {
    public ReversibleArrayList(Collection<T> c) { super(c); }
    public Iterable<T> reversed() {
        return new Iterable<T>() {
            @Override
            public Iterator<T> iterator() {
                return new Iterator<T>() {
                    int current = size() - 1;
                    @Override
                    public boolean hasNext() { return current > -1; }
                    @Override
                    public T next() { return get(current--); }
                };
            }
        };
    }
    public static void main(String[] args) {
        ReversibleArrayList<String> ral =
                new ReversibleArrayList<>(Arrays.asList(new String[]{"hello", "world", "yes"}));
        for(String s : ral.reversed()) {
            System.out.print(s + " ");
        }
    }
}
```



## 异常、断言和日志

Java 语言给出了三种处理系统错误的机制：抛出异常、日志和使用断言。

### 异常分类

所有异常都有 Throwable 继承而来。

![异常层次结构](https://img2018.cnblogs.com/blog/1252910/201904/1252910-20190420203248534-1858171357.png)



Error 类描述 Java 运行时系统的内部错误和资源耗尽错误，应用程序不应该抛出这种类型的对象。Error是程序无法处理的错误。

RuntimeException由程序错误导致，如果发生了 Runtime Exception，那一定是你的问题，应该修正程序避免这类异常发生。常见的运行时异常有：

```java
ClassCastException
IndexOutOfBoundsException
NullPointerException
ArrayStoreException
NumberFormatException
ArithmeticException
```

其他 Exception 由具体的环境，如读取的文件不存在、文件为空、sql异常、寻找不存在的 Class 对象等导致的异常。

Java 语言规范将派生于 Error 类或 Runtime Exception 类的异常称为非检查（unchecked）异常；其他所有异常称为检查（checked）异常，编译器将会核查是否为所有的检查异常提供异常处理器。

###  声明异常

一个方法必须声明所有可能抛出的检查异常。任何抛出异常的方法都可能是一个死亡陷阱，如果没有异常处理器捕获这个异常，当前线程就会结束。非检查异常要么不可控，要么应当避免发生。

如果在子类覆盖了父类的方法，在子类方法中可以抛出更特定的异常，或者不抛异常。如果父类方法没有抛出异常，则子类只能在方法内捕获所有检查异常，不允许在子类的 throws 说明符中出现超过超类方法所列出的异常类范围。

### 捕获异常

捕获多个异常可以合并 catch 子句（异常类型不存在子类关系）。

```java
try {
    //
} catch (FileNotFindException | UnknowHostException e) {
    e.printStackTrace();
}
```

解耦合 try/catch 和 try/finally 语句块，这种设计方式不仅代码清晰，而且还会报告 finally 子句出现的错误。

```java
InputStream in = ...;
try {
    try {
        //
    } finally {
        in.close();
    }
} catch (IOException ex) {
    ex.printStackTrace();
}
```

### 带资源的 try 语句

```java
try (Scanner in = new Scanner(new FileInputStream("e:\data"), "UTF-8");
                             PrintWriter out = new PrinterWriter("out.txt")) {
    while (in.hasNext()) {
        System.out.println(in.next().toUpperCase());
    } 
}
```

Java SE7 引入了带资源的 try 语句，当语句正常退出或者有异常，都会调用`in.close()`方法。如果`in.close()`方法也抛出异常，则原来的异常会重新抛出，而close方法抛出的异常会被抑制，通过调用 getSuppressed 方法可以得到从close 方法抛出并被抑制的异常列表。

### 断言

```java
int x = -1;
if(x < 0) {
    throw new IllegalArgumentException("x < 0");
}
double y = Math.sqrt(x);
```

这段检查代码会一直保留在程序，如果程序中含有大量这样的检查，程序运行起来将会很慢。

断言允许在测试期间向代码插入一些检查语句。当代码发布时，这些检查语句将会被自动的移走。

Java 语言引入了关键字 assert，assert 有两种形式：

```java
assert condition;
assert condition: expression;//expression用于产生消息字符串
```

这两种形式都会对条件进行检测，如果结果是 false，则会抛出 AssertError 异常。第二种形式中，表达式将会被传入 AssertError 的构造器，并转化成一个消息字符串。

断言 x 是一个非负数值：

```java
assert x >= 0;
assert x >= 0 : x;//将x的值传递给AssertError异常
```

断言只应该用在测试阶段确定程序内部的错误位置。

#### 启用和禁用断言

默认情况下，断言被禁用，可以在运行程序时用`-eableassertions`或`-ea`选项启用。idea --> run configuration --> vm options 添加 `-ea` 开启断言。 

`java -enableassertions MyApp`

启用和禁用断言是类加载器的功能，在启用和禁用断言时不必重新编译程序。当断言被禁用时，类加载器将跳过断言代码，因此不会降低程序的运行速度。

在某个类和包使用断言：`java -ea:MyClass -ea:com.tyson.chapter12 MyApp` MyClass 类和 com.tyson.chapter12 包以及子包的所有类都会启用断言。

使用选项`-dableassertions`或`-da`禁用某个类和包的断言。

### 日志

#### logback

`<configuration>`的三个属性

- scan：默认值为true，配置文件发生更改时会重新加载。
- scanPeriod：设置监控配置文件的时间间隔，默认单位是毫秒。
- debug：默认值是false，打印logback内部日志信息，实时查看logback运行状态。

`<configuration>`的子标签
root是根`<logger>`，只有level属性，默认为DEBUG。
logger关联包或者具体的类到appender，可以定义日志类型、级别。
Appender主要用于指定日志输出的目的地，如控制台、文件、数据库。

```
<?xml version="1.0" encoding="UTF-8"?>
<configuration scan="true" scanPeriod="60 seconds" debug="false">
    <!-- 打印到控制台 -->
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <!-- encoder 默认配置为PatternLayoutEncoder -->
        <encoder>
            <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>
    <!--没有设置appender，此logger本身不打印信息；
    包com.tyson没有设置打印级别，所有继承上级root的打印级别；
    additivity默认为true，logger的打印信息向上级传递-->
    <logger name="com.tyson"/>
    <!-- additivity为false，打印信息不会向上级传递；
    指定了名字为"STDOUT"的appender，日志级别为DEBUG，只有级别高于DEBUG的日志信息会被输出 -->
    <logger name="com.tyson.controller.DemoController" level="DEBUG" additivity="false">
        <appender-ref ref="STDOUT"/>
    </logger>
    <root level="ERROR">
        <appender-ref ref="STDOUT" />
    </root>
</configuration>
```
日志级别：ERROR>WARN>INFO>DEBUG>TRACE

Layout用于自定义日志输出格式。
```
<encoder class="ch.qos.logback.core.encoder.LayoutWrappingEncoder">
    <layout class="自定义layout类" />
</encoder>
```



## 字符串

String 对象是不可变的。String 类中会修改 String 的方法都会创建一个全新的 String 对象。

### 格式化输出

#### printf() 和 format()

```java
public class SimpleFormat {
    public static void main(String[] args) {
        int x = 5;
        double y = 5.26;
        System.out.format("Row 1: [%d %f]\n", x, y);
        System.out.printf("Row 1: [%d %f]\n", x, y);
    }
}
/*output
Row 1: [5 5.260000]
Row 1: [5 5.260000]
 */
```

#### Formatter

```java
public class FormatterDemo {
    public static void main(String[] args) {
        Formatter f = new Formatter(System.out);
        String item = "peas";
        int quatity = 3;
        float price = 5.2f;
        //-表示右对齐
        f.format("%-10s %5s %10s\n", "item", "quatity", "price");
        //-表示右对齐，%10.10s指宽度为10，最大输出字符为10
        f.format("%-10.10s %5d %10.2f\n", item, quatity, price);
        //String.format()
        System.out.println("------string.format()------");
        System.out.println(String.format("%-10.10s %5d %10.2f", item, quatity, price));
    }
}
/*
item       quatity      price
peas           3       5.20
------string.format()------
peas           3       5.20
 */
```

String.format()接受与Formatter.format()一样的参数，它是通过创建一个 Formatter 对象实现的。

### 正则表达式

#### 基础

可能有一个负号在最前面：`-?`

`\\`在 Java 表示插入一个正则表达式的反斜线

表示一个数字：`\\d`

插入普通的反斜线：`\\\\`

`+`表示一个或多个之前的表达式

可能有一个负号，后面跟着一个或多个数字：`-?\\d+`

```java
public class IntegerMatch {
    public static void main(String[] args) {
        System.out.println("-89".matches("-?\\d+"));
        System.out.println("+98".matches("-?\\d+"));
        //竖直线|代表或操作；+是特殊符号，需转义;括号可以将表达式分组
        System.out.println("+789".matches("(-|\\+)?\\d+"));
    }
}
/*output
true
false
true
 */
```

String 自带一个正则表达式工具 split()方法，它可以将字符串从正则表达式匹配的地方切开。特殊字符如`.`和`|`需要用反斜杠转义，即`\\.`和`\\|`。

```java
public class Splitting {
    public static String motto = "All in all, we all have a dream.";
    public static void split(String regex) {
        System.out.println(Arrays.toString(motto.split(regex)));
    }
    public static void main(String[] args) {
        //.需要转义
        split("\\.");
        split(" ");
        //\\w+表示一个或多个非单词字符
        split("\\W+");
        //表示字母n后面跟着一个或多个非单词字符
        split("n\\W+");
    }
}
/*output
[All in all, we all have a dream,  Thanks]
[All, in, all,, we, all, have, a, dream., Thanks.]
[All, in, all, we, all, have, a, dream, Thanks]
[All i, all, we all have a dream. Thanks.]
 */
```

替换功能。

```java
public class Replacing {
    public static void main(String[] args) {
        //小写的w表示字母
        System.out.println(Splitting.motto.replaceFirst("w\\w+", "they"));
        System.out.println(Splitting.motto.replaceAll("all|dream", "apple"));
    }
}
/*output
All in all, they all have a dream.
All in apple, we apple have a apple.
 */
```

#### 创建正则表达式

字符类表达式，JDK 文档中 java.util.regex.Pattern 页面有完整的表达式。

[jdk8文档](https://docs.oracle.com/javase/8/docs/api/index.html)

[菜鸟教程正则表达式语法](http://www.runoob.com/java/java-regular-expressions.html)

**常用的字符类表达式**

| 字符     | 描述                                                         |
| -------- | ------------------------------------------------------------ |
| .        | 匹配除"\r\n"之外的任何单个字符                               |
| +        | 表示一个或多个之前的表达式，如\\\d+表示一个或多个数字        |
| *        | 零次或多次匹配前面的字符或子表达式。例如，zo* 匹配"z"和"zoo"。* 等效于 {0,} |
| ?        | 零次或一次匹配前面的字符或子表达式。如"do(es)?"匹配"do"或"does"中的"do"。? 等效于 {0,1} |
| [abc]    | 包含a/b/c的任何字符（和a\|b\|c作用相同）                     |
| [^abc]   | 除了a/b/c外的任何字符                                        |
| [a-zA-z] | a-z/A-Z的任何字符                                            |
| \s       | 空白符（空格、tab、换行、换页和回车）                        |
| \S       | 非空白符（\[^\s]）                                           |
| \d       | 数字0-9                                                      |
| \D       | 非数字（\[^0-9]）                                            |
| \w       | 字符[a-zA-Z0-9]                                              |
| \W       | 非字符                                                       |

**边界匹配符**

| 符号 | 描述       |
| ---- | ---------- |
| ^    | 一行的起始 |
| $    | 一行的结束 |
| \b   | 词的边界   |
| \B   | 非词的边界 |

**量词**

![正则表达式量词](https://img2018.cnblogs.com/blog/1252910/201904/1252910-20190409100645126-737003966.png)

Rudolph.java

```java
public class Rudolph {
  public static void main(String[] args) {
    for(String pattern : new String[]{ "Rudolph",
      "[rR]udolph", "[rR][aeiou][a-z]ol.*", "R.*" })
      System.out.println("Rudolph".matches(pattern));
  }
} /* Output:
true
true
true
true
*///:~
```

#### Pattern 和 Matcher

Pattern 和 Matcher 功能较 String 更为强大。Pattern.compile(String regex) 用来编译正则表达式，生成一个。

**find()**

`Matcher.find()`可用来在 CharSequence 中查找多个匹配。find()可以像迭代器一样前向遍历输入的字符串。重载的 find(int index)能够接收一个整数参数，作为搜索起点。

```java
public class Finding {
    //划分为单词
    public static Pattern WORD_PATTERN = Pattern.compile("\\w+");
    public static void main(String[] args) {
        Matcher m = WORD_PATTERN.matcher("Everyone is born equally");
        //find()可用来查找多个匹配
        while(m.find()) {
            System.out.print(m.group() + " ");
        }
        System.out.println();
        int i = 0;
        //指定搜索起点
        while(m.find(i++)) {
            System.out.print(m.group() + " ");
        }
    }
}
/*output
Everyone is born equally
Everyone veryone eryone ryone yone one ne e is is s born born orn rn n equally equally qually ually ally lly ly y
 */
```

**组**

组使用括号划分的正则表达式，如`A(B(C))D`，组0是ABCD，组1是BC，组2是C。Matcher 对象提供了一系列方法，用以获取与组相关的信息：

`public int groupCount()`返回该匹配器的分组数目（**不包含第0组**），如上面例子分组数目为2组（不包含第0组）；

`public String group()`返回前一次匹配操作（如find()）的第0组（整个匹配）；

`public String group(int i)`返回前一次匹配操作指定的组号，如果没有匹配到输入字符串的任何部分，将会返回null。

```java
public class Groups {
    public static final String POEM =
            "Twas brillig, and the slithy toves\n" +
                    "Did gyre and gimble in the wabe.\n" +
                    "All mimsy were the borogoves,\n" +
                    "And the mome raths outgrabe.\n\n" +
                    "Beware the Jabberwock, my son,\n" +
                    "The jaws that bite, the claws that catch.\n" +
                    "Beware the Jubjub bird, and shun\n" +
                    "The frumious Bandersnatch.\n" +
                    "end\n"; //匹配失败
    //捕获每行最后的三个词
    public static Pattern LAST_THREE_WORD_PATTERN = Pattern.compile("(?m)(\\S+)\\s+((\\S+)\\s+(\\S+))$");

    public static void main(String[] args) {
        Matcher m = LAST_THREE_WORD_PATTERN.matcher(POEM);
        while(m.find()) {
            //有4个分组，不包括分组0，分组0是整个匹配
            for(int i = 0; i <= m.groupCount(); i++) {
                System.out.print("[" + m.group(i) + "]");
            }
            System.out.println();
        }
    }
}
/* Output:
[the slithy toves][the][slithy toves][slithy][toves]
[in the wabe.][in][the wabe.][the][wabe.]
[were the borogoves,][were][the borogoves,][the][borogoves,]
[mome raths outgrabe.][mome][raths outgrabe.][raths][outgrabe.]
[Jabberwock, my son,][Jabberwock,][my son,][my][son,]
[claws that catch.][claws][that catch.][that][catch.]
[bird, and shun][bird,][and shun][and][shun]
[The frumious Bandersnatch.][The][frumious Bandersnatch.][frumious][Bandersnatch.]
*/
```

默认情况下，^和$仅匹配输入的完整字符串的开始和结束。?m表示多行模式下，^和$分别匹配一行的开始和结束。

**start() 与 end()**

在匹配操作成功之后，start()返回匹配的起始位置的索引，end()返回所匹配字符的最后字符的索引加一的值。

**Pattern 标记**

Pattern 类的 compile()方法还有一个版本，可以接收一个标记参数，以调整匹配的行为：

`Pattern Pattern.compile(String regex, int flag)`

flag 来自以下 Pattern 类中的常量：

![Pattern 标记参数](https://img2018.cnblogs.com/blog/1252910/201904/1252910-20190409103507798-1192565494.png)

可以通过'|'（或）操作符组合多个标记的功能：

```java
public class ReFlags {
    public static Pattern WORD_PATTERN = Pattern.compile("^java",
            Pattern.CASE_INSENSITIVE | Pattern.MULTILINE);
    public static void main(String[] args) {
        Matcher m = WORD_PATTERN.matcher("java has regex\nJava has regex\n" +
                "JAVA has pretty good regular expressions\n" +
                "Regular expressions are in Java");
        while(m.find()) {
            System.out.println(m.group());
        }
    }
}
/* Output:
java
Java
JAVA
*/
```

**split()**

```java
public class SplitDemo {
    public static void main(String[] args) {
        String input = "This!!unusual use!!of exclamation!!points";
        print(Arrays.toString(Pattern.compile("!!").split(input)));
        // 限制分割字符串的数量
        print(Arrays.toString(Pattern.compile("!!").split(input, 3)));
    }
} /* Output:
[This, unusual use, of exclamation, points]
[This, unusual use, of exclamation!!points]
*/
```

**替换操作**

```java
public class TheReplacements {
    public static void main(String[] args) throws Exception {
        String s = TextFile.read("src/com/tyson/chapter13/string/regex/TheReplacements.java");
        // 匹配上面的注释
        Matcher mInput = Pattern.compile("/\\*!(.*)!\\*/", Pattern.DOTALL).matcher(s);
        if (mInput.find()) {
            s = mInput.group(1); // 捕捉正则表达式括号，组是括号划分的正则表达式
        }

        // Replace two or more spaces with a single space:
        s = s.replaceAll(" {2,}", " ");
        // Replace one or more spaces at the beginning of each
        // line with no spaces. Must enable MULTILINE mode:
        s = s.replaceAll("(?m)^ +", "");
        print(s);
        s = s.replaceFirst("[aeiou]", "(VOWEL1)");
        StringBuffer sbuf = new StringBuffer();
        Pattern p = Pattern.compile("[aeiou]");
        Matcher m = p.matcher(s);
        // Process the find information as you
        // perform the replacements:
        while (m.find())
            //将找到的元音字母转化为大写字母
            m.appendReplacement(sbuf, m.group().toUpperCase());
        // Put in the remainder of the text:
        m.appendTail(sbuf);
        print(sbuf);
    }
} /* Output:
Here's a block of text to use as input to
the regular expression matcher. Note that we'll
first extract the block of text by looking for
the special delimiters, then process the
extracted block.
H(VOWEL1)rE's A blOck Of tExt tO UsE As InpUt tO
thE rEgUlAr ExprEssIOn mAtchEr. NOtE thAt wE'll
fIrst ExtrAct thE blOck Of tExt by lOOkIng fOr
thE spEcIAl dElImItErs, thEn prOcEss thE
ExtrActEd blOck.
*/
```

**reset()**

通过 reset() 方法，可以将 Matcher 对象应用于一个新的字符序列。

```java
public class Resetting {
    public static void main(String[] args) throws Exception {
        Matcher m = Pattern.compile("[frb][aiu][gx]").matcher("fix the rug with bags");
        while (m.find())
            System.out.print(m.group() + " ");
        System.out.println();
        m.reset("fix the rig with rags");
        while (m.find())
            System.out.print(m.group() + " ");
    }
} /* Output:
fix rug bag
fix rig rag
*/
```

### 扫描输入

Java SE5新增了 Scanner 类，Scanner 的构造器可以接受任何类型的输入对象，包括 File 对象、InputStream、String 或者 Readable 对象。Scanner 所有的输入、分词以及翻译都隐藏在不用类型的 next 方法中。普通的 next()方法返回下一个 String 。

#### Scanner 定界符

默认情况下，Scanner 根据空白字符对输入进行分词，我们可以用正则表达式指定自己所需的定界符。

```java
public class ScannerDelimiter {
    public static void main(String[] args) {
        Scanner sc = new Scanner("12, 42, 85, 23");
        //使用逗号包括逗号前后的空白字符作为定界符
        sc.useDelimiter("\\s*,\\s*");
        while(sc.hasNextInt()) {
            System.out.println(sc.nextInt());
        }
    }
}
```

#### 用正则表达式扫描

```java
public class ThreatAnalyzer {
    static String threatData =
            "58.27.82.161@02/10/2005\n" +
                    "204.45.234.40@02/11/2005\n" +
                    "58.27.82.161@02/11/2005\n" +
                    "58.27.82.161@02/12/2005\n" +
                    "58.27.82.161@02/12/2005\n" +
                    "[Next log section with different data format]";

    public static void main(String[] args) {
        Scanner sc = new Scanner(threatData);
        String pattern = "(\\d+[.]\\d+[.]\\d+[.]\\d+)@(\\d{2}/\\d{2}/\\d{4})";
        while(sc.hasNext(pattern)) {
            sc.next(pattern);
            MatchResult match = sc.match();
            String ip = match.group(1);
            String date = match.group(2);
            System.out.format("Thread on %s from %s\n", ip, date);
        }
    }
}
/*output
Thread on 58.27.82.161 from 02/10/2005
Thread on 204.45.234.40 from 02/11/2005
Thread on 58.27.82.161 from 02/11/2005
Thread on 58.27.82.161 from 02/12/2005
Thread on 58.27.82.161 from 02/12/2005
 */
```

注意：配合正则表达式进行扫描时，正则表达式不要含有定界符（Scanner 默认定界符是空白符，根据空白符对输入进行分词）。



## 类型信息

通过运行时类型信息可以在程序运行时发现和使用类型信息。

`Class.forName("Gum")`类 Gum 没有被加载就加载它。

### 反射

类方法提取：

```java
public class typeinfo {
    //匹配类似包名的字符串 com.tyson.chapter
    public static Pattern p = Pattern.compile("\\w+\\.");
    public static void main(String[] args) {
        try {
            Class<?> c = Class.forName("com.tyson.chapter10.innerclass.LocalInnerClass");
            Method[] methods = c.getMethods();
            for(Method m : methods) {
                //去掉包名
                System.out.println(p.matcher(m.toString()).replaceAll(""));
            }
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }
}
/*output
public static void main(String[])
public final void wait() throws InterruptedException
public final void wait(long,int) throws InterruptedException
public final native void wait(long) throws InterruptedException
public boolean equals(Object)
public String toString()
public native int hashCode()
public final native Class getClass()
public final native void notify()
public final native void notifyAll()
 */
```



## 泛型

泛型实现了参数化类型的概念，使代码可以应用于多种类型。使用泛型编写的程序比使用 Object 变量再进行强制类型转化的程序具有更好的安全性和可读性。

### 类型参数的好处

Java SE5泛型出现之前，ArrayList 是通过维护一个 Object 数组实现的。

```java
public class MyArrayList {
    private Object[] elementData;
    private int index = 0;
    public MyArrayList() { elementData = new Object[8]; }
    public Object get(int i) { return elementData[i]; }
    public void add(Object o) { elementData[index++] = o; }

    public static void main(String[] args) {
        MyArrayList list = new MyArrayList();
        list.add("tyson");
        System.out.println((String)list.get(0));
        list.add(new Cat());
        System.out.println((String)list.get(1));
    }
}
/*output
tyson
Exception in thread "main" java.lang.ClassCastException: typeinfo.pets.Cat cannot be cast to java.lang.String
	at com.tyson.chapter15.generics.MyArrayList.main(MyArrayList.java:29)
 */
```

当获取值的时候需要进行强制类型转化，并且 add 操作可以放进任何类型的对象，编译和运行都不报错，当获取值进行强制类型转换时，可能会抛异常。

### 泛型类

```java
public class Holder<T> {
    private T a;
    public Holder(T a) { this.a = a; }
    public void set(T a) { this.a = a; }
    public T get() { return a; }

    public static void main(String[] args) {
        Holder<String> h = new Holder<>("Tyson");
        System.out.println(h.get());
    }
}
//output Tyson
```

### 泛型接口

泛型也可以用于接口。

```java
//public interface Generator<T> { T next(); }

public class Fibonacci implements Generator<Integer> {
    private int count = 0;
    @Override
    public Integer next() {
        return fib(count++);
    }
    public int fib(int n) {
        if(n < 2) { return 1; }
        return fib(n - 2) + fib(n - 1);
    }

    public static void main(String[] args) {
        Fibonacci fib = new Fibonacci();
        for(int i = 0; i < 10; i++) {
            System.out.print(fib.next() + " ");
        }
    }
}
//output:1 1 2 3 5 8 13 21 34 55
```

### 泛型方法

如果使用泛型方法可以取代将整个类泛型化，那么就应该只使用泛型方法。对于一个 static 方法而言，无法访问泛型类的类型参数，所以如果 static 方法需要使用泛化能力，就必须使其成为泛型方法。

定义泛型方法，只需将泛型参数列表放在返回值之前。

```java
public class GenericMethod {
    public <T> void f(T t) { System.out.println(t.getClass().getName()); }

    public static void main(String[] args) {
        GenericMethod gm = new GenericMethod();
        //<String>可省略，编译器自己可推断出
        gm.<String>f("");
        gm.f(1);
        gm.f(1.0);
        gm.f(1.0f);
        gm.f(gm);
    }
}
/*output
java.lang.String
java.lang.Integer
java.lang.Double
java.lang.Float
com.tyson.chapter15.generics.GenericMethod
 */
```

GenericMethod 并不是参数化的，只有 f() 拥有参数类型。

#### 可变参数和泛型方法

向参数个数可变的方法传递一个泛型类型的实例。

```java
public class GenericVarArgs {
    public static <T> List<T> makeList(T... args) {
        List<T> result = new ArrayList<>();
        for(T item : args) {
            result.add(item);
        }
        return result;
    }

    public static void main(String[] args) {
        List<String> l = makeList("a", "b");
        System.out.println(l);
    }
}
//output:[a, b]
```

### 匿名内部类

```java
public class Customer {
    public Customer() {}
    public static Generator<Customer> generator() {
        return new Generator<Customer>() {
            @Override
            public Customer next() {
                return new Customer();
            }
        };
    }

    public static void main(String[] args) {
        System.out.println(Customer.generator().next());
    }
}
```

### 泛型擦除

```java
public class ErasedTypeEquvalence {
    public static void main(String[] args) {
        Class c1 = new ArrayList<String>().getClass();
        Class c2 = new ArrayList<Integer>().getClass();
        System.out.println(c1 == c2);
    }
}
//output:true
```

`List<T>`的类型变量没有显式的限定，擦除类型后变成原始的 List，故`List<String>`和`List<Integer>`是相同的类型。

```java
class Manipulator<T extends HasF> {
    private T obj;
    public Manipulator(T t) { obj = t; }
    public void manipulate() { obj.f(); }
}
```

Manipulator 类有显式限定 HasF，故擦除类型后变成：

```java
class Manipulato {
    private HasF obj;
    public Manipulator(HasF t) { obj = HasF; }
    public void manipulate() { obj.f(); }
}
```

### 类型变量的限定

给定泛型类的边界，以此告知编译器只能接受遵循这个边界的类型。

```java
//HasF.java
public class HasF {
    public void f() {
        System.out.println("Has.f()");
    }
}

//Manipulation.java
class Manipulator<T extends HasF> {
    private T obj;
    public Manipulator(T t) { obj = t; }
    public void manipulate() { obj.f(); }
}

public class Manipulation {
    public static void main(String[] args) {
        HasF hf = new HasF();
        Manipulator<HasF> manipulator = new Manipulator<>(hf);
        manipulator.manipulate();
    }
}
//output: Has.f()
```

### 擦除的问题

```java
class GenericBase<T> {
    private T element;
    public void set(T arg) { element = arg; }
    public T get() { return element; }

    public static void main(String[] args) {

    }
}

class Derived extends GenericBase {}

public class ErasureAndInheritance {
    public static void main(String[] args) {
        Derived d = new Derived();
        d.set(new Object());
        System.out.println(d.get());
    }
}
//output: java.lang.Object@6d6f6e28
```

Derived 继承自 GenericBase，但是没有任何泛型参数，而编译器不会发出任何警告。

### 边界

在泛型的参数类型上设置限制条件，可以强制规定泛型可以应用的类型，从而可以按照自己的边界类型去调用方法。如果将泛型参数限制为某个类型子集，那么就可以用这些类型子集来调用方法。

```java
interface HasColor { Color getColor(); }

class Colored<T extends HasColor> {
    T item;
    Colored(T item) { this.item = item; }
    T getItem() { return item; }
    Color color() { return item.getColor(); }
}

class Dimension { public int x; }

//编译错误，应该类在前，接口在后
//class ColoredDimension<T extends HasColor & Dimension> {}

class ColoredDimension<T extends Dimension & HasColor> {
    T item;
    ColoredDimension(T item) { this.item = item; }
    T getItem() { return item; }
    Color color() { return item.getColor(); }
    int getX() { return item.x; }
}

interface  Weight { int weight(); }

//边界继承只能有一个类，可以有多个接口
class Solid<T extends Dimension & HasColor & Weight> {
    T item;
    Solid(T item) { this.item = item; }
    T getItem() { return item; }
    Color color() { return item.getColor(); }
    int getX() { return item.x; }
    int weight() { return item.weight(); }
}

class Bounded extends Dimension implements HasColor, Weight {

    @Override
    public Color getColor() { return null; }

    @Override
    public int weight() { return 0; }
}

public class BasicBounds {
    public static void main(String[] args) {
        Solid<Bounded> solid = new Solid<>(new Bounded());
        solid.color();
        solid.getX();
        solid.weight();
    }
}
```

通过在继承的每个层次上添加边界限制，消除 BasicBounds.java 代码冗余。

```java
class HoldItem<T> {
    T item;
    HoldItem(T item) { this.item = item; }
    T getItem() { return item; }
}

class Colored2<T extends HasColor> extends HoldItem<T> {
    Colored2(T item) { super(item); }
    Color color() { return item.getColor(); }
}

class ColorDimension2<T extends Dimension & HasColor> extends Colored2<T> {
    ColorDimension2(T item) { super(item); }
    int getX() { return item.x; }
}

class Solid2<T extends Dimension & HasColor & Weight> extends ColorDimension2<T> {
    Solid2(T item) { super(item); }
    int weight() { return item.weight(); }
}

public class InheritBounds {
    public static void main(String[] args) {
        Solid2<Bounded> solid2 = new Solid2<>(new Bounded());
        solid2.color();
        solid2.getX();
        solid2.weight();
    }
}
```

### 通配符

参考自：[泛型超详细解读](https://blog.csdn.net/jeffleo/article/details/52250948) | [通配符的上界通配符和下界通配符](https://blog.csdn.net/hello_worldee/article/details/77934244)

#### 上界通配符

上界< ? extends Class>

```java
class Fruit { }
class Apple extends Fruit { }
class Orange extends Fruit { }

public class UpperBound {
    public static void main(String[] args) {
        List<? extends Fruit> list = new ArrayList<>();
        //编译错误
        //list.add(new Apple());
        //list.add(new Orange());
        //list.add(new Fruit());
        list.add(null);

        list.contains(new Apple());
        list.indexOf(new Apple());

        System.out.println(list.get(0));
    }
}
```

可见，指定了下边界，却不能add任何类型，甚至Object都不行，除了null，因为null代表任何类型。List< ? extends Fruit>可以解读为，“具有任何从Fruit继承的类型”，但实际上，它意味着，它没有指定具体类型。对于编译器来说，当你指定了一个List< ? extends Fruit>，add的参数也变成了“? extends Fruit”。因此编译器并不能了解这里到底需要哪种Fruit的子类型，因此他不会接受任何类型的Fruit。

然而，contain和indexof却能执行，这是因为，这两个方法的参数是Object，不涉及任何的通配符，所以编译器允许它调用。

list.get(0)能够执行是因为，当item在此list存在时，编译器能够确定他是Apple的子类，所以能够安全获得。

#### 下界通配符

< ? super Class>表示，指定类的基类。

```java
class Apple1 extends Apple {}

public class LowerBound<T>{

    public static void main(String[] args) {
        List<? super Apple> list = new ArrayList<>();
        list.add(new Apple());
        list.add(new Apple1());
        //编译错误
        //list.add(new Fruit());

        Object apple = list.get(0);
        System.out.println(apple);
    }
}
//output: com.tyson.chapter15.generics.Apple@6d6f6e28
```

对于super，get返回的是Object，因为编译器不能确定列表中的是Apple的哪个子类，所以只能返回Object。 

List < ? super Apple>， 代表容器内存放的是Apple的所有父类，所以有多态和上转型，这个容器时可以接受所有Apple父类的子类的（多态的定义：父类可以接受子类型对象）。Apple和Apple1都直接或间接继承了Fruit，所以Apple和Apple1是能够加入List < ? super Apple>这个容器的。

list.add(new Fruit())不能添加，是因为容器内存放的是Apple的**所有**父类，正是因为能存放所有，Apple的父类可能有Fruit1， Fruit2， Fruit3 ， 所以编译器根本不能识别你要存放哪个Apple的父类，所以不能添加Fruit，因为这不能保证类型安全的原则。这从最后的Object apple = list.get(0)可以看出。



## 数组

数组的 length 是数组的大小，不是实际保存的元素个数。

如果不显式初始化，基本类型数组会被自动初始化成初值，对象数组则会被初始化成 null。

### 复制数组

Java 标准类库提供有 static 方法 System.arraycopy()，用来复制数组比用 for 循环复制要快的多。System.arraycopy() 针对所有类型做了重载。

```java
public class CopyArrays {
    public static void main(String[] args) {
        int[] src = new int[7];
        int[] dest = new int[10];
        Arrays.fill(src, 47);
        Arrays.fill(dest, 99);
        System.out.println("src = " + Arrays.toString(src));
        System.out.println("dest = " + Arrays.toString(dest));
        System.arraycopy(src, 0, dest, 0, src.length);
        System.out.println("dest = " + Arrays.toString(dest));
    }
}
/*output
src = [47, 47, 47, 47, 47, 47, 47]
dest = [99, 99, 99, 99, 99, 99, 99, 99, 99, 99]
dest = [47, 47, 47, 47, 47, 47, 47, 99, 99, 99]
 */
```

基本类型数组和对象数组都可以复制。复制对象只是复制对象引用，即浅复制。System.arraycopy() 不会执行自动包装和自动拆包，两个数组需要具有相同的数据类型。

### Arrays 工具

#### 数组拷贝

```java
public class ArrayCopy {
    //Arrays 类方法的使用
    public static void main(String[] args) {
        int[] arr = {12, 45, 2, 56, 20};
        int[] arrCopy = Arrays.copyOf(arr, arr.length);
        System.out.println("arr: " + Arrays.toString(arr));
        System.out.println("arrCopy: " + Arrays.toString(arrCopy));
        //增加数组大小
        arrCopy = Arrays.copyOf(arr, 2 * arr.length);
        System.out.println("arr: " + Arrays.toString(arr));
        System.out.println("arrCopy: " + Arrays.toString(arrCopy));
    }
}
/*output
arr: [12, 45, 2, 56, 20]
arrCopy: [12, 45, 2, 56, 20]
arr: [12, 45, 2, 56, 20]
arrCopy: [12, 45, 2, 56, 20, 0, 0, 0, 0, 0]
 */
```

`Array.copyOf()`底层是通过`System.arraycopy()`使用的。

```java
public static <T,U> T[] copyOf(U[] original, int newLength, Class<? extends T[]> newType) {
    @SuppressWarnings("unchecked")
    T[] copy = ((Object)newType == (Object)Object[].class)
        ? (T[]) new Object[newLength]
        : (T[]) Array.newInstance(newType.getComponentType(), newLength);
    System.arraycopy(original, 0, copy, 0,
                     Math.min(original.length, newLength));
    return copy;
}
```

#### 数组的比较

Arrays 类提供了重载后的 equals() 方法，用来比较整个数组。

```java
public class ComparingArrays {
    public static void main(String[] args) {
        int[] a1 = new int[10];
        int[] a2 = new int[10];
        Arrays.fill(a1, 47);
        Arrays.fill(a2, 47);
        System.out.println(Arrays.equals(a1, a2));
        a2[1] = 0;
        System.out.println(Arrays.equals(a1, a2));
        String[] s1 = new String[2];
        Arrays.fill(s1, "hello");
        String[] s2 = { new String("hello"), new String("hello")};
        System.out.println(Arrays.equals(s1, s2));
    }
}
/*output
true
false
true
 */
```

#### 数组元素的比较

1. 实现`java.lang.Comparable`接口，使得类本身具有比较比较能力。

   ```java
   public class CompType implements Comparable<CompType> {
       int i;
       int j;
       public CompType(int i, int j) {
           this.i = i;
           this.j = j;
       }
   
       @Override
       public String toString() {
           return "CompType{" +
                   "i=" + i +
                   ", j=" + j +
                   '}';
       }
   
       @Override
       public int compareTo(CompType ct) {
           return i < ct.i ? -1 : (i == ct.i ? 0 : 1);
       }
   
       private static Random r = new Random(47);
       public static Generator<CompType> generator() {
           return new Generator<CompType>() {
               @Override
               public CompType next() {
                   return new CompType(r.nextInt(100), r.nextInt(100));
               }
           };
       }
   
       public static void main(String[] args) {
           CompType[] arr = Generated.array(new CompType[4], generator());
           System.out.println("before sorting: " + Arrays.toString(arr));
           Arrays.sort(arr);
           System.out.println("after sorting: " + Arrays.toString(arr));
           //反转自然排列顺序
           Arrays.sort(arr, Collections.reverseOrder());
           System.out.println("reverse order: " + Arrays.toString(arr));
       }
   }
   /*output
   before sorting: [CompType{i=58, j=55}, CompType{i=93, j=61}, CompType{i=61, j=29}, CompType{i=68, j=0}]
   after sorting: [CompType{i=58, j=55}, CompType{i=61, j=29}, CompType{i=68, j=0}, CompType{i=93, j=61}]
   reverse order: [CompType{i=93, j=61}, CompType{i=68, j=0}, CompType{i=61, j=29}, CompType{i=58, j=55}]
    */
   ```

2. 编写自己的比较器Comparator。

   ```java
   class CompTypeComparator implements Comparator<CompType> {
   
       @Override
       public int compare(CompType o1, CompType o2) {
           return o1.j > o2.j ? 1 : (o1.j == o2.j ? 0 : -1);
       }
   }
   
   public class ComparatorTest {
       public static void main(String[] args) {
           CompType[] arr = Generated.array(new CompType[4], CompType.generator());
           System.out.println("before sorting: " + Arrays.toString(arr));
           Arrays.sort(arr, new CompTypeComparator());
           System.out.println("after sorting: " + Arrays.toString(arr));
       }
   }
   /*output
   before sorting: [CompType{i=58, j=55}, CompType{i=93, j=61}, CompType{i=61, j=29}, CompType{i=68, j=0}]
   after sorting: [CompType{i=68, j=0}, CompType{i=61, j=29}, CompType{i=58, j=55}, CompType{i=93, j=61}]
    */
   ```

#### 数组排序

使用内置的排序方法，就可以对基本类型数组进行排序。也可以对对象数组进行排序，只要该对象实现了 Comparable 接口或者具有相关联的 Comparator。

```java
public class StringSorting {
    public static void main(String[] args) {
        String[] strs = Generated.array(new String[5], new RandomGenerator.String(5));
        System.out.println("before sorting: " + Arrays.toString(strs));
        Arrays.sort(strs);
        System.out.println("after sorting: " + Arrays.toString(strs));
        Arrays.sort(strs, Collections.reverseOrder());
        System.out.println("reverse order: " + Arrays.toString(strs));
        Arrays.sort(strs, String.CASE_INSENSITIVE_ORDER);
        System.out.println("case insensive: " + Arrays.toString(strs));
    }
}
/*output
before sorting: [YNzbr, nyGcF, OWZnT, cQrGs, eGZMm]
after sorting: [OWZnT, YNzbr, cQrGs, eGZMm, nyGcF]
reverse order: [nyGcF, eGZMm, cQrGs, YNzbr, OWZnT]
case insensive: [cQrGs, eGZMm, nyGcF, OWZnT, YNzbr]
 */
```

String 排序算法依据词典编排顺序排序。大写字母在前，小写字母在后。Java 标准类库中的排序算法针对正排序做了优化。针对基础类型设计了快速排序，针对对象设计了稳定归并排序。

#### 排序数组查找

若数组已经排序，既可以使用`Arrays.binarySearch()`执行快速查找。

```java
public class ArraySearching {
    public static void main(String[] args) {
        Generator<Integer> gen = new RandomGenerator.Integer(1000);
        int[] arr = ConvertTo.primitive(Generated.array(new Integer[5], gen));
        Arrays.sort(arr);
        System.out.println("after sorting: " + Arrays.toString(arr));
        while(true) {
            int r = gen.next();
            int location = Arrays.binarySearch(arr, r);
            if(location >= 0) {
                System.out.println("location: " + location + "-->" + arr[location]);
                break;
            }
        }
    }
}
/*output
after sorting: [258, 555, 693, 861, 961]
location: 3-->861
 */
```

找到目标，`Arrays.binarySearch()`返回值大于或等于0。否则返回负值：`-（插入点）- 1`；

对象数组使用`Arrays.binarySearch()`需要提供Comparator。

```java
public class StringSearch {
    public static void main(String[] args) {
        String[] strs = Generated.array(new String[6], new RandomGenerator.String(5));
        Arrays.sort(strs, String.CASE_INSENSITIVE_ORDER);
        System.out.println(Arrays.toString(strs));
        int index = Arrays.binarySearch(strs, strs[3], String.CASE_INSENSITIVE_ORDER);
        System.out.println("index: " + index + "-->" + strs[index]);
    }
}
/*output
[cQrGs, eGZMm, JMRoE, nyGcF, OWZnT, YNzbr]
index: 3-->nyGcF
 */
```



## 容器深入研究

### 填充容器

```java
public class FillingList {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>(Collections.nCopies(3, "Tyson"));
        System.out.println(list);
        Collections.fill(list, "Sophia");
        System.out.println(list);
    }
}
/*output
[Tyson, Tyson, Tyson]
[Sophia, Sophia, Sophia]
 */
```

### SortedSet

按对象的比较函数对元素进行排序。用 TreeSet 迭代通常比用 HashSet 要快。

```java
public class SortedSetDemo {
    public static void main(String[] args) {
        SortedSet<String> sortedSet = new TreeSet<>();
        Collections.addAll(sortedSet, "one two three four".split(" "));
        System.out.println(sortedSet);
        System.out.println("first: " + sortedSet.first());
        System.out.println("last: " + sortedSet.last());
        Iterator<String> itr = sortedSet.iterator();
        while (itr.hasNext()) {
            System.out.print(itr.next() + " ");
        }
        System.out.println();
        //from包含-to不包含
        System.out.println("subSet: " + sortedSet.subSet("one", "three"));
        //小于three的元素
        System.out.println(sortedSet.headSet("three"));
        //大于等于one的元素
        System.out.println(sortedSet.tailSet("one"));
    }
}
/*output
[four, one, three, two]
first: four
last: two
four one three two
subSet: [one]
[four, one]
[one, three, two]
 */
```

### 队列

除了并发应用，Queue Java SE5中仅有两个实现 LinkedList 和 PriorityQueue，它们的差异在于排序行为不在性能。

#### 优先级队列

```java
public class ToDoList extends PriorityQueue<ToDoList.ToDoItem> {
    static class ToDoItem implements Comparable<ToDoItem> {
        private char primary;
        private int secondary;
        private String item;

        public ToDoItem(String item, char pri, int sec) {
            this.item = item;
            primary = pri;
            secondary = sec;
        }
        @Override
        public int compareTo(ToDoItem o) {
            if(primary > o.primary) {
                return 1;
            }
            if(primary == o.primary) {
                if(secondary > o.secondary) {
                    return 1;
                } else if (secondary == o.secondary) {
                    return 0;
                } else {
                    return -1;
                }
            }
            return -1;
        }
        @Override
        public String toString() {
            return "ToDoItem{" +
                    "primary=" + primary +
                    ", secondary=" + secondary +
                    ", item='" + item + '\'' +
                    '}';
        }
    }
    public void add(String item, char pri, int sec) {
        super.add(new ToDoItem(item, pri, sec));
    }

    public static void main(String[] args) {
        ToDoList toDoList = new ToDoList();
        toDoList.add("homework", 'b', 3);
        toDoList.add("feed dog", 'a', 4);
        toDoList.add("lunch", 'a', 1);
        while (!toDoList.isEmpty()) {
            System.out.println(toDoList.remove());
        }
    }
}
/*output
ToDoItem{primary=a, secondary=1, item='lunch'}
ToDoItem{primary=a, secondary=4, item='feed dog'}
ToDoItem{primary=b, secondary=3, item='homework'}
 */
```

#### 双向队列

可以在队列任何一端添加或移除元素。Java 标准库中没有任何显式的用于双向队列的接口。

```java
public class Deque<T> {
    private LinkedList<T> deque = new LinkedList<>();
    public void addFirst(T t) { deque.add(t); }
    public void addLast(T t) { deque.add(t); }
    public T getFirst() { return deque.getFirst(); }
    public T getLast() { return deque.getLast(); }
    public T removeFirst() { return deque.removeFirst(); }
    public T removeLast() { return deque.removeLast(); }
    public int size() { return deque.size(); }
    @Override
    public String toString() { return deque.toString(); }

    public static void main(String[] args) {
        Deque<Integer> deque = new Deque<>();
        for(int i = 20; i < 27; i++) {
            deque.addFirst(i);
        }
        for(int j = 50; j < 55; j++) {
            deque.addLast(j);
        }
        System.out.println(deque);
        while(deque.size() != 0) {
            System.out.print(deque.removeFirst() + " ");
        }
    }
}
/*output
[20, 21, 22, 23, 24, 25, 26, 50, 51, 52, 53, 54]
20 21 22 23 24 25 26 50 51 52 53 54
 */
```

### LinkedHashMap

可以在构造器中设定 LinkedHashMap，使之采用基于访问的最近最少使用（LRU）算法，没有访问过的元素会出现在队列的前面。可用于定期清理元素以节省空间。

```java
public class LinkedHashMapDemo {
    public static void main(String[] args) {
        LinkedHashMap<Integer, String> linkedHashMap = new LinkedHashMap<>(new CountingMapData(5));
        System.out.println(linkedHashMap);
        linkedHashMap = new LinkedHashMap<>(16, 0.75f, true);
        linkedHashMap.putAll(new CountingMapData(5));
        for(int i = 0; i < 3; i++) {
            linkedHashMap.get(i);
        }
        System.out.println(linkedHashMap);
        linkedHashMap.get(3);
        System.out.println(linkedHashMap);
    }
}
/*output
{0=A0, 1=B0, 2=C0, 3=D0, 4=E0}
{3=D0, 4=E0, 0=A0, 1=B0, 2=C0}
{4=E0, 0=A0, 1=B0, 2=C0, 3=D0}
 */
```

### Colletions 工具类

```java
public class Utilities {
    static List<String> list = Arrays.asList("one two three four".split(" "));

    public static void main(String[] args) {
        System.out.println(list);
        System.out.println("list disjoint(four)?" +
                Collections.disjoint(list, Collections.singletonList("four"))); //不相交
        System.out.println("max: " + Collections.max(list));
        System.out.println("min: " + Collections.min(list));
        System.out.println("max with comparator: " + Collections.max(list, String.CASE_INSENSITIVE_ORDER));
        List<String> subList = Arrays.asList("one two".split(" "));
        System.out.println("indexOfSubList: " + Collections.indexOfSubList(list, subList));
        System.out.println("lastIndexOfSubList: " + Collections.lastIndexOfSubList(list, subList));
        Collections.replaceAll(list, "one", "emm");
        System.out.println("replace all: " + list);
        Collections.reverse(list);
        System.out.println("reverse: " + list);
        Collections.rotate(list, 1);
        System.out.println("rotate: " + list);
        List<String> source = Arrays.asList("int the matrix".split(" "));
        Collections.copy(list, source);
        System.out.println("copy: " + list);
        Collections.swap(list, 0, list.size() - 1);
        System.out.println("swap: " + list);
        Collections.shuffle(list, new Random((47)));
        System.out.println("shuffle: " + list); //打乱
        Collections.fill(list, "frequency");
        System.out.println("fill: " + list);
        System.out.println("frequency of 'frequency': " + Collections.frequency(list, "frequency"));
        List<String> nCopies = Collections.nCopies(3, "nCopies;");
        System.out.println("nCopies: " + nCopies);
        System.out.println("list disjoint nCopies? " + Collections.disjoint(list, nCopies));
        Enumeration<String> e = Collections.enumeration(nCopies);
        Vector<String> v = new Vector<>();
        while(e.hasMoreElements()) {
            v.add(e.nextElement());
        }
        ArrayList<String> arrayList = Collections.list(v.elements());
        System.out.println("arrayList: " + arrayList);
    }
}
/*output
[one, two, three, four]
list disjoint(four)?false
max: two
min: four
max with comparator: two
indexOfSubList: 0
lastIndexOfSubList: 0
replace all: [emm, two, three, four]
reverse: [four, three, two, emm]
rotate: [emm, four, three, two]
copy: [int, the, matrix, two]
swap: [two, the, matrix, int]
shuffle: [two, the, int, matrix]
fill: [frequency, frequency, frequency, frequency]
frequency of 'frequency': 4
nCopies: [nCopies;, nCopies;, nCopies;]
list disjoint nCopies? true
arrayList: [nCopies;, nCopies;, nCopies;]
 */
```

#### 排序和查询

```java
public class ListSortSearch {
    public static void main(String[] args) {
        List<String> list =
                new ArrayList<String>(Utilities.list);
        list.addAll(Utilities.list);
        print(list);
        Collections.shuffle(list, new Random(47));
        print("Shuffled: " + list);
        // Use a ListIterator to trim off the last elements:
        ListIterator<String> it = list.listIterator(4);
        while (it.hasNext()) {
            it.next();
            it.remove();
        }
        print("Trimmed: " + list);
        Collections.sort(list);
        print("Sorted: " + list);
        String key = list.get(3);
        int index = Collections.binarySearch(list, key);
        print("Location of " + key + " is " + index +
                ", list.get(" + index + ") = " + list.get(index));
        Collections.sort(list, String.CASE_INSENSITIVE_ORDER);
        print("Case-insensitive sorted: " + list);
        key = list.get(3);
        index = Collections.binarySearch(list, key,
                String.CASE_INSENSITIVE_ORDER);
        print("Location of " + key + " is " + index +
                ", list.get(" + index + ") = " + list.get(index));
    }
} /* Output:
[one, Two, three, Four, five, six, one, one, Two, three, Four, five, six, one]
Shuffled: [Four, five, one, one, Two, six, six, three, three, five, Four, Two, one, one]
Trimmed: [Four, five, one, one, Two, six, six, three, three, five]
Sorted: [Four, Two, five, five, one, one, six, six, three, three]
Location of six is 7, list.get(7) = six
Case-insensitive sorted: [five, five, Four, one, one, six, six, three, three, Two]
Location of three is 7, list.get(7) = three
*/
```

#### 只读容器

```java
public class ReadOnly {
    static Collection<String> data =
            new ArrayList<>(Countries.names(6));

    public static void main(String[] args) {
        Collection<String> c = Collections.unmodifiableCollection(
                        new ArrayList<>(data));
        print(c); // Reading is OK
        //! c.add("one"); // Can't change it

        List<String> a = Collections.unmodifiableList(new ArrayList<>(data));
        ListIterator<String> lit = a.listIterator();
        print(lit.next()); // Reading is OK
        //! lit.add("one"); // Can't change it

        Set<String> s = Collections.unmodifiableSet(new HashSet<>(data));
        print(s); // Reading is OK
        //! s.add("one"); // Can't change it

        // For a SortedSet:
        Set<String> ss = Collections.unmodifiableSortedSet(new TreeSet<>(data));

        Map<String, String> m = Collections.unmodifiableMap(
                new HashMap<>(Countries.capitals(6)));
        print(m); // Reading is OK
        //! m.put("Ralph", "Howdy!");

        // For a SortedMap:
        Map<String, String> sm = Collections.unmodifiableSortedMap(
                        new TreeMap<>(Countries.capitals(6)));
    }
}
```

#### Collection 和 Map 的同步控制

```java
public class Synchronization {
    public static void main(String[] args) {
        Collection<String> c = Collections.synchronizedCollection(new ArrayList<>());
        List<String> list = Collections.synchronizedList(new ArrayList<>());
        Set<String> set = Collections.synchronizedSet(new HashSet<>());
        Set<String> ss = Collections.synchronizedSortedSet(new TreeSet<>());
        Map<String, String> map = Collections.synchronizedMap(new HashMap<>());
        Map<String, String> sm = Collections.synchronizedSortedMap(new TreeMap<>());
    }
}
```

#### 快速报错机制

 fast-fail 是 Java 容器的一种保护机制。当多个线程对同一个集合进行操作时，就有可能会产生 fast-fail 事件。例如：当线程a正通过 iterator 遍历集合时，另一个线程b修改了集合的内容（modCount 不等于expectedModCount），那么线程a在遍历的时候会抛出 ConcurrentModificationException，产生 fast-fail 事件。

```java
public class FastFail {
    public static void main(String[] args) {
        Collection<String> c = new ArrayList<>();
        Iterator<String> itr = c.iterator();
        c.add("haha");
        try {
            String s = itr.next();
        } catch (ConcurrentModificationException ex) {
            ex.printStackTrace();
        }
    }
}
```

在此例中，应该添加完所有元素后，再获取迭代器。

**多线程并发修改容器的方法：**

- 使用`Colletions.synchronizedList()`方法或在修改集合内容的地方加上 synchronized。这样的话，增删集合内容的同步锁会阻塞遍历操作，影响性能。
- 使用 CopyOnWriteArrayList 来替换 ArrayList。在对 CopyOnWriteArrayList 进行修改操作的时候，会拷贝一个新的集合，对新的集合进行操作，操作完成后再把引用指向新的集合。

### Java 1.0/1.1 的容器

#### BitSet

参考自：[JAVA中BitSet使用](https://blog.csdn.net/xv1356027897/article/details/79518647)

位图，数据的存在性可以使用bit位上的1或0来表示，一个long型数字占用64位空间，那么一个long型数字就可以保存64个数字的“存在性”状态（true or false）。BitSet内部是一个long[]数组，数组的大小由 BitSet 接收的最大数字决定，这个数组将数字分段表示[0,63],[64,127],[128,191]...。即long[0]用来存储[0,63]这个范围的数字的“存在性”，long[1]用来存储[64,127]，依次递推。

```java
public class BitSetDemo {
    public static void printBitSet(BitSet b) {
        System.out.println("BitSet: " + b);
        StringBuilder sb = new StringBuilder();
        for(int i = 0; i < b.size(); i++) {
            sb.append(b.get(i) ? "1" : "0");
        }
        System.out.println("bitset pattern: " + sb);
    }
    public static void main(String[] args) {
        Random rand = new Random(47);
        int num = rand.nextInt(20);
        BitSet bs = new BitSet();
        bs.set(num);
        System.out.println(bs);
        System.out.println("num exist? " +  bs.get(num));
        System.out.println("size of bitset: " + bs.size());
        System.out.println("the number of bits set: " + bs.cardinality());
        bs.set(num);//重复设置
        System.out.println("set again! num exist? " +  bs.get(num));
        bs.clear(num);//清除
        System.out.println("after clearing bit: " + bs);

        bs.set(num + 100);//自动扩充容量
        System.out.println("num+100 exist? " +  bs.get(num + 100));
        System.out.println("num-1 exist? " +  bs.get(num - 1));
        System.out.println("size of bitset: " + bs.size());
    }
}
/*output
{18}
num exist? true
size of bitset: 64
the number of bits set: 1
set again! num exist? true
after clearing bit: {}
num+100 exist? true
num-1 exist? false
size of bitset: 128
 */
```



## Java I/O 系统

### 输入和输出

继承自 InputStream 或 Reader 的类都具有 read() 方法，用于读取单个字节或者字节数组；继承自 OutputStream 或 Writer 的类都含有 write() 方法，用于写单个字节或字节数组。

#### InputStream 和 OutputStream 

InputStream 用来表示那些从不同数据源产生输入的类。这些数据源包括：1.字节数组；2.String 对象；3.文件；4.管道；5.一个由其他种类的流组成的序列。

InputStream 类有一个抽象方法：`abstract int read()`，这个方法将读入并返回一个字节，或者在遇到输入源结尾时返回-1。

OutputStream 决定了输出所要去的目标：字节数组、文件或管道。OutputStream 的 `abstract void write(int b)` 可以向某个输出位置写出一个字节。

read() 和 write() 方法在执行时都将阻塞，等待数据被读入或者写出。

#### Reader 和 Writer

字符流是由通过字节流转换得到的，转化过程耗时，而且容易出现乱码问题。I/O 流提供了一个直接操作字符的接口，方便我们平时对字符进行流操作。如果音频文件、图片等媒体文件用字节流比较好，如果涉及到字符的话使用字符流比较好。

```java
abstract int read();
abstract void write(char c);
```

### 组合输入输出流过滤器

FileInputStream 和 FileOutputStream 可以提供附在磁盘文件上的输入流和输出流。

`FileInputStream fin = new FileInputStream("E:/data.txt") //E:\\data.txt`

通过 java.io.File.separator 可以获得与平台相关的 文件分隔符。

FileInputStream 只支持在文件的读写字节，而DataInputStream 只支持数值的读写。

实现从文件读取数字，需要将 FileInputStream 和 DataInputStream 组合。

```java
FileInputStream fin = new FileInputStream("e:/data.txt");
DataInputStream din = new DataInputStream(fin);
double x = din.readDouble();
```

使用缓冲机制：

```java
DataInputStream din = new DataInputStream(
    new BufferedInputStream(
        new FileInputStream("E:/data.txt")
    )
);
```

可回推的输入流：

```java
PushbackInputStream pin = new PushbackInputStream(
    new BufferedInputStream(
        new FileInputStream("E:/data.txt")
    )
);

int b = pin.read();
if(b != '<') {
    pin.unread(b);
}
```

从 zip 文件读入数字：

```java
DataInputStream din = new DataInputStream(
    new ZipInputStream(
        new FileInputStream("E:/data.zip")
    )
);
```

### 文本输入和输出

将字节流转化为 Unicode 字符的读入器：

```java
//Reader in = new InputStreamReader(System.in);
Reader in = new InputStreamReader(new FileInputStream("E:/data.txt"), StandardCharsets.UTF_8);
```

将 Unicode 字符转化为字节流的写出器：

```java
PrintWriter out = new PrintWriter("H:/data.txt", "UTF-8");
out.print("haha");
out.flush();
```

默认情况下，自动冲刷机制是禁用的，可以使用`PrintWriter(Writer out, Boolean autoFlush)`启用或禁用自动冲刷机制：

```java
PrintWriter out = new PrintWriter(
    new OutputStreamWriter(
        new FileOutputStream("H:/data.txt"), "UTF-8"),
    true);
out.print("tyson");
out.flush();
```

### 以文本格式存储对象

```java
public class TextFile {
    public static void main(String[] args) throws IOException {
        Employee[] staff = new Employee[2];
        DateTimeFormatter ymd = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        //字符串转换成LocalDate类型
        LocalDate ld = LocalDate.parse("2015-11-23", ymd);
        staff[0] = new Employee("tyson", 1200.00, ld);
        staff[1] = new Employee("tom", 1200.00, ld);

        try (PrintWriter out = new PrintWriter("H:/data.txt", "UTF-8")) {
            writeData(staff, out);
        }
        try (Scanner in = new Scanner(
                new FileInputStream("H:/data.txt"), "UTF-8")) {
            Employee[] newStaff = readData(in);

            for(Employee e : newStaff) {
                System.out.println(e);
            }
        }
    }

    private static void writeData(Employee[] employees, PrintWriter out) throws IOException {
        out.println(employees.length);
        for(Employee e : employees) {
            writeEmployee(out, e);
        }
    }

    private static Employee[] readData(Scanner in) {
        int n = in.nextInt();
        in.nextLine();

        Employee[] employees = new Employee[n];
        for(int i = 0; i < n ; i++) {
            employees[i] = readEmployee(in);
        }

        return employees;
    }

    public static void writeEmployee(PrintWriter out, Employee e) throws IOException {
        out.println(e.getName() + "|" + e.getSalary() + "|" + e.getHireDate());
    }

    public static Employee readEmployee(Scanner in) {
        String line = in.nextLine();
        String[] tokens = line.split("\\|");
        String name = tokens[0];
        double salary = Double.parseDouble(tokens[1]);
        LocalDate hireDate = LocalDate.parse(tokens[2]);
        return new Employee(name, salary, hireDate);
    }
}
/*output
Employee{name='tyson', salary=1200.0, hireDate=2015-11-23}
Employee{name='tom', salary=1200.0, hireDate=2015-11-23}
 */
```

### 字符编码方式

输入和输出流都是用于字节序列，很多情况下，我们希望操作的是字符序列。

平台使用的编码方法可以由静态方法`Charset.defaultCharset`返回。

将字节数组转化成字符串：

```java
String str = new String(bytes, StandardCharsets.UTF_8);
```

### 读写二进制数据

#### DataInput 和 DataOutput

DataOutput 接口定义了以二进制格式写数组、字符、字符串等的方法，如 writeChars、writeByte、writeInt 和 writeDouble。

writeInt 总是将一个整数写出为4字节的二进制数量值，writeDouble 总将一个 double 值写出为8字节的二进制数量值。Java 会将所有的值都按照高位在前的模式写出，这使得 Java 数据文件可以独立于平台。

DataInput 接口用于二进制格式读数据，接口定义了如下方法：readInt、readShort、readChar等。

DataInputStream 实现了 DataInput 接口，DataOutputStream 实现了 DataOutput 接口：

```java
DataInputStream in = new DataInputStream(new FileInputStream("e:/data.txt"));
DataOutputStream out = new DataOutputStream(new FileOutputStream("e:/data.txt"));
```

#### 随机访问文件

RandomAccessFile 类可以在文件中的任何位置查找或写入。RandomAccessFile 类同时实现了 DataInput 和 DataOutput 接口。

#### 序列化

**保存和加载序列化对象**

保存对象：

```java
ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream("e:/data.txt"));
Employee tyson = new Employee();
out.writeObject(tyson);
```

读回对象：

```java
ObjectInputStream in = new ObjectInputStream(new FileInputStream("e:/data.txt"));
Employee e = (Employee)in.readObject();
```

其中，Employee 需要实现 Serializable 接口，接口没有任何方法：

```java
Employee implements Serializable {...}
```

ObjectStreamTest.java

```java
/**
 * Copyright (C), 2018-2019
 * FileName: ObjectStream
 * Author:   Tyson
 * Date:     2019/4/25/0025 14:58
 * Description: 对象序列化
 */
package com.tyson.chapter18.io;

import java.io.*;

/**
 * @author Tyson
 * @ClassName: ObjectStream
 * @create 2019/4/25/0025 14:58
 */
public class ObjectStream {
    public static void main(String[] args) throws IOException, ClassNotFoundException {
        Employee tyson = new Employee("tyson", 8888.0, "2015-02-15");
        Manager sophia = new Manager("sophia", 6666.0, "2012-03-15");
        sophia.setSecretary(tyson);
        Manager tom = new Manager("tom", 5555.0, "2014-03-16");
        tom.setSecretary(tyson);
        Employee[] staff = new Employee[3];
        staff[0] = tyson;
        staff[1] = sophia;
        staff[2] = tom;

        try (ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream("e:/data.txt"))) {
            out.writeObject(staff);
            out.flush();
        }

        try (ObjectInputStream in = new ObjectInputStream(new FileInputStream("e:/data.txt"))) {
            Employee[] newStaff = (Employee[]) in.readObject();
            newStaff[1].setSalary(23333.0);
            for(Employee e : newStaff) {
                System.out.println(e);
            }
            //原对象sophia不变
            System.out.println(staff[1]);
        }
    }
}

class Manager extends Employee {
    private Employee secretary;

    public Manager(String name, Double salary, String hireDate) {
        super(name, salary, hireDate);
    }

    @Override
    public String toString() {
        return "Manager{" +
                "name=" +super.getName() +
                ", salary=" +super.getSalary() +
                ", hireday=" +super.getHireDate() +
                ", secretary=" + secretary +
                '}';
    }

    public Employee getSecretary() {
        return secretary;
    }

    public void setSecretary(Employee secretary) {
        this.secretary = secretary;
    }
}
```

通过关键字 transient 可以将某些不可序列化的域设置成瞬时的域，这些域在对象被序列化时总是被跳过。

**使用序列化实现克隆**

将对象序列化到输出流中，然后将其读回，产生的新对象是原对象的深拷贝。

### 操作文件

File 类既能代表特定文件的名称，又能代表一个目录下的一组文件的名称。

#### 目录列表器

获取某个目录下以".java"文件后缀结尾的文件名。

```java
class DirFilter implements FilenameFilter {
    private Pattern pattern;
    public DirFilter(String regex) {
        pattern = Pattern.compile(regex);
    }
    @Override
    public boolean accept(File dir, String name) {
        return pattern.matcher(name).matches();
    }
}

public class DirList {
    public static void main(String[] args) {
        File path = new File("H:" + File.separator +
                "java-data" + File.separator + "TIJ4-code" + File.separator + "containers");
        //Java文件后缀".+\\.java$"
        String[] list = path.list(new DirFilter("A.+\\.java$"));
        Arrays.sort(list);
        System.out.println(Arrays.toString(list));
    }
}
/*output
[AssociativeArray.java]
 */
```

用匿名内部类实现。

```java
public class DirList {
    public static void main(String[] args) {
        File f = new File("H:" + File.separator +
                "java-data" + File.separator + "TIJ4-code" + File.separator + "containers");
        String[] fileNames = f.list(new FilenameFilter() {
            @Override
            public boolean accept(File dir, String name) {
                return name.endsWith(".java");
            }
        });
        System.out.println(Arrays.toString(fileNames));
    }
}
```

### 

## 枚举类型

### 基本 enum 特性

除了不能继承自一个 enum 之外，我们基本上可以将 enum 看做一个常规的类。所有的 enum 都继承自 java.lang.Enum 类，所以 enum 不能再继承其他类。在创建一个新的 enum 时，可以同时实现一个或多个接口。

```java
enum Color { RED, GREEN, BLUE }

public class EnumClass {
    public static void main(String[] args) {
        for(Color c : Color.values()) {
            System.out.println(c + " ordinal: " + c.ordinal());
            System.out.print(c.compareTo(Color.RED) + " ");
            System.out.print(c.equals(Color.RED) + " ");
            System.out.println(c == Color.RED);
            System.out.println(c.getDeclaringClass());
            System.out.println(c.name());
            System.out.println("-------------------------");
        }
        for(String s : "RED GREEN BLUE".split(" ")) {
            Color c = Enum.valueOf(Color.class, s);
            System.out.println(c);
        }
    }
}
/*output
RED ordinal: 0
0 true true
class com.tyson.chapter19.enumerated.Color
RED
-------------------------
GREEN ordinal: 1
1 false false
class com.tyson.chapter19.enumerated.Color
GREEN
-------------------------
BLUE ordinal: 2
2 false false
class com.tyson.chapter19.enumerated.Color
BLUE
-------------------------
RED
GREEN
BLUE
 */
```

values() 是编译器添加的 static 方法，Enum 类中没有 values() 方法。ordinal() 方法返回一个 int 值，这是每个 enum 实例声明时的次序，从0开始。valueOf() 根据给定的名字返回相应的 enum实例，如果不存在给定名字的实例，将会抛出异常。

### 向 enum 添加新方法

```java
public enum Direction {
    WEST("Xizang"),
    NORTH("Beijing"),
    EAST("Shanghai"),
    SOUTH("Hainan");//定义自己的方法，enum实例序列的最后需添加分号
    //属性和方法需要在enum实例之后定义
    private String discription;
    private Direction(String discription) {
        this.discription = discription;
    }
    public String getDiscription() {
        return discription;
    }

    public static void main(String[] args) {
        for(Direction dir : Direction.values()) {
            System.out.println(dir + ": " + dir.getDiscription());
        }
    }
}
/*output
WEST: Xizang
NORTH: Beijing
EAST: Shanghai
SOUTH: Hainan
 */
```

### 覆盖 enum 的方法

```java
public enum Animal {
    CAT, DOG, BIRD, PIG;
    @Override
    public String toString() {
        String id = name();
        String lower = id.substring(1).toLowerCase();
        return id.charAt(0) + lower;
    }

    public static void main(String[] args) {
        for(Animal a : values()) {
            System.out.print(a + " ");
        }
    }
}
//output: Cat Dog Bird Pig
```

### Switch 语句中的 enum

```java
enum Signal {
    GREEN, YELLOW, RED,
}

public class TrafficLight {
    Signal color = Signal.RED;

    public void change() {
        switch (color) {
            case RED:
                color = Signal.GREEN;
                break;
            case GREEN:
                color = Signal.YELLOW;
                break;
            case YELLOW:
                color = Signal.RED;
                break;
        }
    }
    @Override
    public String toString() {
        return "the traffic light is: " + color;
    }

    public static void main(String[] args) {
        TrafficLight tl = new TrafficLight();
        for (int i = 0; i < 4; i++) {
            System.out.println(tl);
            tl.change();
        }
    }
}
/*output
the traffic light is: RED
the traffic light is: GREEN
the traffic light is: YELLOW
the traffic light is: RED
 */
```

### EnumSet

 如果你想用一个数表示多种状态，那么位运算是一种很好的选择。EnumSet 是通过位运算实现的。它是一个与枚举类型一起使用的专用 Set 实现。枚举set中所有元素都必须来自单个枚举类型（即必须是同类型，且该类型是 Enum 的子类）。

```java
public enum Season {
    SPRING, SUMMER, AUTUMN, WINTER;

    public static void main(String[] args) {
        Set<Season> emptyEnumSet = EnumSet.noneOf(Season.class);
        System.out.println("EnumSet.noneOf(): " + emptyEnumSet);
        emptyEnumSet.add(SPRING);
        System.out.println("emptyEnumSet.add(SPRING): " + emptyEnumSet);
        Set<Season> enumSet = EnumSet.allOf(Season.class);
        System.out.println("EnumSet.allOf(): " + enumSet);
        emptyEnumSet.addAll(enumSet);
        System.out.println("emptyEnumSet.addAll(): " + emptyEnumSet);
        Season[] seasons = new Season[emptyEnumSet.size()];
        enumSet.toArray(seasons);
        System.out.println("seasons: " + Arrays.toString(seasons));
    }
}
/*output
EnumSet.noneOf(): []
emptyEnumSet.add(SPRING): [SPRING]
EnumSet.allOf(): [SPRING, SUMMER, AUTUMN, WINTER]
emptyEnumSet.addAll(): [SPRING, SUMMER, AUTUMN, WINTER]
seasons: [SPRING, SUMMER, AUTUMN, WINTER]
 */
```

#### 源码解析

参考自：[EnumSet源码解析](https://www.jianshu.com/p/f7035c5816b1)

```java
//EnumSet的容量小于64，创建的是RegularEnumSet，大于64，创建的是JumboEnumSet
public boolean add(E e) {
    // 校验枚举类型
    typeCheck(e);

    long oldElements = elements;
    elements |= (1L << ((Enum<?>)e).ordinal());
    return elements != oldElements;
}

/**
 * 用于校验枚举类型，位于EnumSet中
 */
final void typeCheck(E e) {
    Class<?> eClass = e.getClass();
    if (eClass != elementType && eClass.getSuperclass() != elementType)
        throw new ClassCastException(eClass + " != " + elementType);
}
```

每一个枚举元素都有一个属性ordinal，用来表示该元素在枚举类型中的次序或者说下标。

![EnumSet add方法](https://img2018.cnblogs.com/blog/1252910/201904/1252910-20190415211843720-460902205.png)

addAll 方法就是将 elements 上，从低位到枚举长度上的下标值置为1。比如某一个枚举类型共5个元素，而addAll 就是将 elements 的二进制的低5位置为1。

```java
void addAll() {
    if (universe.length != 0)
        elements = -1L >>> -universe.length;
}
```

### EnumMap

EnumMap 是一种特殊的 Map，它要求其中的键必须来自一个 enum。由于 enum 本身的限制，所以 EnumMap 在内部可由数组实现。因此 EnumMap 的速度很快。

```java
interface Command { void action(); }
public class EnumMaps {
    public static void main(String[] args) {
        EnumMap<AlarmPoints, Command> em = new EnumMap<>(AlarmPoints.class);
        em.put(KITCHEN, new Command() {
            @Override
            public void action() {
                System.out.println("Kitchen fire!");
            }
        });
        em.put(BATHROOM, new Command() {
            @Override
            public void action() {
                System.out.println("Bathroom alert");
            }
        });
        for(Map.Entry<AlarmPoints, Command> e : em.entrySet()) {
            System.out.print(e.getKey() + ": ");
            e.getValue().action();
        }
        //获取不存在的值
        try {
            em.get(UTILITY).action();
        } catch (Exception ex) {
            System.out.println(ex);
        }
    }
}
/*output
BATHROOM: Bathroom alert
KITCHEN: Kitchen fire!
java.lang.NullPointerException
 */
```

与 EnumSet 一样，enum 实例定义时的次序决定了其在 EnumMap 中的顺序。每个 enum 实例都会作为键存放到  EnumMap 中，如果没有为这个键调用 put() 方法来存入相应的值的话，其对应的值为 null。



## 注解

Java SE5内置了三种定义在 java.lang 中的注解：@Override，@Deprecated 和 @SuppressWarnings（关闭不当的编译器警告信息）。

### 基本语法

```java
@Target(ElementType.METHOD)//应用于什么地方，方法、域等
@Retention(RetentionPolicy.SOURCE)//注解在哪一个级别可用，SOURCE/CLASS/RUNTIME
public @interface Override {
}
```

#### 自定义注解

```java
//UserCase.java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface UserCase {
    public int id();
    public String description() default "no description";
}

//PasswordUtils.java
public class PasswordUtils {
    @UserCase(id = 47, description = "Passwords must contain at least one numeric")
    public boolean validatePassword(String password) {
        return password.matches("\\w*\\d\\w*");
    }
}
```

注解元素（本例的是 id和description）只能是基本类型、String、Class、enum、Annotation 和这些类型的数组。

@Retention注解三种取值：**RetentionPolicy.SOURCE**、**RetentionPolicy.CLASS**、**RetentionPolicy.RUNTIME**分别对应：Java源文件(.java文件)---->.class文件---->内存中的字节码。

@Target元注解决定了一个注解可以标识到哪些成分上，如标识在在类身上，或者属性身上，或者方法身上等成分，@Target默认值为任何元素(成分)。

**Retention注解说明**

参考自：[注解](https://www.cnblogs.com/xdp-gacl/p/3622275.html)

当在Java源程序上加了一个注解，这个Java源程序要由javac去编译，javac把java源文件编译成.class文件，在编译成class时可能会把Java源程序上的一些注解给去掉，java编译器在处理java源程序时，可能会认为这个注解没有用了，于是就把这个注解去掉了，那么此时在编译好的class中就找不到注解了， 这是编译器编译java源程序时对注解进行处理的第一种可能情况，假设java编译器在把java源程序编译成class时，没有把java源程序中的注解去掉，那么此时在编译好的class中就可以找到注解，当程序使用编译好的class文件时，需要用类加载器把class文件加载到内存中，class文件中的东西不是字节码，class文件里面的东西由类加载器加载到内存中去，类加载器在加载class文件时，会对class文件里面的东西进行处理，如安全检查，处理完以后得到的最终在内存中的二进制的东西才是字节码，类加载器在把class文件加载到内存中时也有转换，转换时是否把class文件中的注解保留下来，这也有说法，所以说**一个注解的生命周期有三个阶段：java源文件是一个阶段，class文件是一个阶段，内存中的字节码是一个阶段**,javac把java源文件编译成.class文件时，有可能去掉里面的注解，类加载器把.class文件加载到内存时也有可能去掉里面的注解，因此**在自定义注解时就可以使用Retention注解指明自定义注解的生命周期，自定义注解的生命周期是在RetentionPolicy.SOURCE阶段（java源文件阶段），还是在RetentionPolicy.CLASS阶段（class文件阶段），或者是在RetentionPolicy.RUNTIME阶段(内存中的字节码运行时阶段)**，根据**JDK提供的API可以知道默认是在RetentionPolicy.CLASS阶段 （JDK的API写到：the retention policy defaults to RetentionPolicy.CLASS）。**

### 元注解

元、注解负责注解其他的注解。

| 注解        | 作用                             |
| ----------- | -------------------------------- |
| @Target     | 表示该注解可以用于什么地方       |
| @Retention  | 表示需要在什么级别保存该注解信息 |
| @Documented | 将此注解包含在 Javadoc 中        |
| @Inherited  | 允许子类继承父类的注解           |

### 编写注解处理器

使用注解时，很重要的一部分就是创建和使用注解处理器。

```java
public class UseCaseTracker {
    public static void trackUseCases(List<Integer> useCases, Class<?> c) {
        for(Method m : c.getDeclaredMethods()) {
            UseCase uc = m.getAnnotation(UseCase.class);
            if(uc != null) {
                System.out.println("found use case: " + uc.id() + " " + uc.description());
                useCases.remove(new Integer(uc.id()));
            }
        }
        for(int i : useCases) {
            System.out.println("warning: missing use case-" + i);
        }
    }

    public static void main(String[] args) {
        List<Integer> useCases = new ArrayList<>();
        Collections.addAll(useCases, 47, 48);
        trackUseCases(useCases, PasswordUtils.class);
    }
}
/*output
found use case: 47 Passwords must contain at least one numeric
warning: missing use case-48
 */
```

### 注解综合

```java
//TrafficLight.java
public enum TrafficLight {
    RED, GREEN, YELLOW;
}

//MetaAnnotation.java
public @interface MetaAnnotation {
    String value();
}

//MyAnnotation.java
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD, ElementType.TYPE})
public @interface MyAnnotation {
    String color() default "blue";
    //当只有value属性要设置时，可以省略"value="
    String value();
    int[] arrayAttr() default {1, 2, 3};
    TrafficLight lamp() default TrafficLight.GREEN;
    MetaAnnotation annotationAttr() default @MetaAnnotation("tyson");
}

//MyAnnotationTracker.java
@MyAnnotation(
        color = "red",
        value = "MyAnnotation注解用于MyAnnotationTracker类",
        arrayAttr = {6, 6, 6},
        lamp = TrafficLight.GREEN,
        annotationAttr = @MetaAnnotation("sophia")
)
public class MyAnnotationTracker {
    @MyAnnotation("MyAnnotation注解用于main方法")
    public static void main(String[] args) {
        //如果指定类型的注解存在于此元素上则返回true
        if(MyAnnotationTracker.class.isAnnotationPresent(MyAnnotation.class)) {
            //获取类的注解
            MyAnnotation myAnnotation = (MyAnnotation)MyAnnotationTracker.class.getAnnotation(MyAnnotation.class);
            System.out.println(myAnnotation.color());
            System.out.println(myAnnotation.value());
            System.out.println(Arrays.toString(myAnnotation.arrayAttr()));
            System.out.println(myAnnotation.lamp());
            MetaAnnotation ma = myAnnotation.annotationAttr();
            System.out.println(ma.value());
        }
        //获取方法的注解
        for(Method m : MyAnnotationTracker.class.getDeclaredMethods()) {
            MyAnnotation myAnnotation1 = m.getAnnotation(MyAnnotation.class);
            if(myAnnotation1 != null) {
                System.out.println(myAnnotation1.value());
            }
        }
    }
}
/*output
red
MyAnnotation注解用于MyAnnotationTracker类
[6, 6, 6]
GREEN
sophia
MyAnnotation注解用于main方法
 */
```







