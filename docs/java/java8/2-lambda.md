---
sidebar: heading
title: Lambda表达式
category: Java
tag:
  - Java8
head:
  - - meta
    - name: keywords
      content: Lambda表达式
  - - meta
    - name: description
      content: 高质量的Java基础常见知识点和面试题总结，让天下没有难背的八股文！
---

# Lambda 表达式

在Java8以前，使用`Collections`的sort方法对字符串排序的写法：

```java
List<String> names = Arrays.asList("dabin", "tyson", "sophia");

Collections.sort(names, new Comparator<String>() {
    @Override
    public int compare(String a, String b) {
        return b.compareTo(a);
    }
});
```

Java8 推荐使用lambda表达式，简化这种写法。

```java
List<String> names = Arrays.asList("dabin", "tyson", "sophia");

Collections.sort(names, (String a, String b) -> b.compareTo(a)); //简化写法一
names.sort((a, b) -> b.compareTo(a)); //简化写法二，省略入参类型，Java 编译器能够根据类型推断机制判断出参数类型
```

可以看到使用lambda表示式之后，代码变得很简短并且易于阅读。

