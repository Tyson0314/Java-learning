---
sidebar: heading
title: 内置的函数式接口
category: Java
tag:
  - Java8
head:
  - - meta
    - name: keywords
      content: 函数式接口,内置的函数式接口
  - - meta
    - name: description
      content: 高质量的Java基础常见知识点和面试题总结，让天下没有难背的八股文！
---

# 内置的函数式接口

Comparator 和 Runnable，Java 8 为他们都添加了 @FunctionalInterface 注解，以用来支持 Lambda 表达式。

## Predicate 断言

指定入参类型，并返回 boolean 值的函数式接口。用来组合一个复杂的逻辑判断。

```java
Predicate<String> predicate = (s) -> s.length() > 0;

predicate.test("dabin"); // true
```

## Comparator

Java8 将 Comparator 升级成函数式接口，可以使用lambda表示式简化代码。

```java
/**
 * @description:
 * @author: 程序员大彬
 * @time: 2021-09-05 23:24
 */
public class ComparatorTest {
    public static void main(String[] args) {
        Comparator<Person> comparator = Comparator.comparing(p -> p.firstName);

        Person p1 = new Person("dabin", "wang");
        Person p2 = new Person("xiaobin", "wang");

        // 打印-20
        System.out.println(comparator.compare(p1, p2));
        // 打印20
        System.out.println(comparator.reversed().compare(p1, p2));
    }

}

class Person {
    public String firstName;
    public String lastName;

    public Person(String firstName, String lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }
}
```


## Consumer

Consumer 接口接收一个泛型参数，然后调用 accept，对这个参数做一系列消费操作。

Consumer 源码：

```java
@FunctionalInterface
public interface Consumer<T> {

    void accept(T t);
    
    default Consumer<T> andThen(Consumer<? super T> after) {
        Objects.requireNonNull(after);
        return (T t) -> { accept(t); after.accept(t); };
    }
}
```

示例1：

```java
/**
 * @description:
 * @author: 程序员大彬
 * @time: 2021-09-05 23:41
 */
public class ConsumerTest {
    public static void main(String[] args) {
        Consumer<Integer> consumer = x -> {
            int a = x + 6;
            System.out.println(a);
            System.out.println("大彬" + a);
        };
        consumer.accept(660);
    }
    /**
     * output
     * 666
     * 大彬666
     */
}
```

示例2：在stream里，对入参做一些操作，主要是用于forEach，对传入的参数，做一系列的业务操作。

```java
// CopyOnWriteArrayList
public void forEach(Consumer<? super E> action) {
    if (action == null) throw new NullPointerException();
    Object[] elements = getArray();
    int len = elements.length;
    for (int i = 0; i < len; ++i) {
        @SuppressWarnings("unchecked") E e = (E) elements[i];
        action.accept(e);
    }
}

CopyOnWriteArrayList<Integer> list = new CopyOnWriteArrayList<>();
list.add(1);
list.add(2);
//forEach需要传入Consumer参数
list
    .stream()
    .forEach(System.out::println);
list.forEach(System.out::println);
```

示例3：addThen方法使用。

```java
/**
 * @description:
 * @author: 程序员大彬
 * @time: 2021-09-05 23:59
 */
public class ConsumersTest {
    public static void main(String[] args) {
        Consumer<Integer> consumer1 = x -> System.out.println("first x : " + x);
        Consumer<Integer> consumer2 = x -> {
            System.out.println("second x : " + x);
            throw new NullPointerException("throw exception second");
        };
        Consumer<Integer> consumer3 = x -> System.out.println("third x : " + x);

        consumer1.andThen(consumer2).andThen(consumer3).accept(1);
    }
    /**
     * output
     * first x : 1
     * second x : 1
     * Exception in thread "main" java.lang.NullPointerException: throw exception second
     * 	at com.dabin.java8.ConsumersTest.lambda$main$1(ConsumersTest.java:15)
     * 	...
     */
}
```

