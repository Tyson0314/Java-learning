---
sidebar: heading
title: 函数式编程
category: Java
tag:
  - Java8
head:
  - - meta
    - name: keywords
      content: 函数式编程
  - - meta
    - name: description
      content: 高质量的Java基础常见知识点和面试题总结，让天下没有难背的八股文！
---

# 函数式编程

面向对象编程：面向对象的语言，一切皆对象，如果想要调用一个函数，函数必须属于一个类或对象，然后在使用类或对象进行调用。面向对象编程可能需要多写很多重复的代码行。

```java
        Runnable runnable = new Runnable() {
            @Override
            public void run() {
                System.out.println("do something...");
            }
        };

```

函数式编程：在某些编程语言中，如js、c++，我们可以直接写一个函数，然后在需要的时候进行调用，即函数式编程。

