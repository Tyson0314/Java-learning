---
sidebar: heading
title: Java创建对象有几种方式？
category: Java
tag:
  - Java基础
head:
  - - meta
    - name: keywords
      content: java创建对象的方式
  - - meta
    - name: description
      content: 高质量的Java基础常见知识点和面试题总结，让天下没有难背的八股文！
---

##  Java创建对象有几种方式？

Java创建对象有以下几种方式：

- 1、用new语句创建对象。
- 2、使用反射机制创建对象，用Class类或Constructor类的newInstance()方法。
- 3、调用对象的clone()方法。需要实现Cloneable接口，重写object类的clone方法。当调用一个对象的clone方法，JVM就会创建一个新的对象，将前面对象的内容全部拷贝进去。
- 4、运用反序列化手段。需要让类实现Serializable接口，通过ObjectInputStream的readObject()方法反序列化类。当我们序列化和反序列化一个对象，JVM会给我们创建一个单独的对象。

