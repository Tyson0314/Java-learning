---
sidebar: heading
title: Java Stream常见用法汇总，开发效率大幅提升
category: 优质文章
tag:
  - java
head:
  - - meta
    - name: keywords
      content: stream流操作,java stream,java8
  - - meta
    - name: description
      content: 优质文章汇总
---

# Java Stream常见用法汇总，开发效率大幅提升

Java8 新增的 Stream 流大大减轻了我们代码的工作量，但是 Stream 流的用法较多，实际使用的时候容易遗忘，整理一下供大家参考。

## 1. 概述

Stream 使用一种类似用 SQL 语句从数据库查询数据的直观方式来对 Java 集合运算和表达的高阶抽象。

Stream API 可以极大提高 Java 程序员的生产力，让程序员写出高效率、干净、简洁的代码。

这种风格将要处理的元素集合看作一种流， 流在管道中传输， 并且可以在管道的节点上进行处理， 比如筛选， 排序，聚合等。

![](http://img.topjavaer.cn/img/stream1.png)

## 2. 创建

### 2.1 集合自带 Stream 流方法

```
List<String> list = new ArrayList<>();
// 创建一个顺序流
Stream<String> stream = list.stream();
// 创建一个并行流
Stream<String> parallelStream = list.parallelStream();
```

### 2.1 通过 Array 数组创建

```
int[] array = {1,2,3,4,5};
IntStream stream = Arrays.stream(array);
```

### 2.3 使用 Stream 的静态方法创建

```
Stream<Integer> stream = Stream.of(1, 2, 3, 4, 5);
Stream<Integer> stream = Stream.iterate(0, (x) -> x + 3).limit(3); // 输出 0,3,6

Stream<String> stream = Stream.generate(() -> "Hello").limit(3); // 输出 Hello,Hello,Hello
Stream<Double> stream = Stream.generate(Math::random).limit(3); // 输出3个随机数
```

### 2.3 数值流

```
// 生成有限的常量流
IntStream intStream = IntStream.range(1, 3); // 输出 1,2
IntStream intStream = IntStream.rangeClosed(1, 3); // 输出 1,2,3
// 生成一个等差数列
IntStream.iterate(1, i -> i + 3).limit(5).forEach(System.out::println); // 输出 1,4,7,10,13
// 生成无限常量数据流
IntStream generate = IntStream.generate(() -> 10).limit(3); // 输出 10,10,10
```

另外还有 LongStream、DoubleStream 都有这几个方法。

## 3. 使用

初始化一些数据，示例中使用。

```
public class Demo {
    class User{
        // 姓名
        private String name;

        // 年龄
        private Integer age;
    }

    public static void main(String[] args) {
        List<User> users = new ArrayList<>();
        users.add(new User("Tom", 1));
        users.add(new User("Jerry", 2));
    }
}
```

### 3.1 遍历 forEach

```
// 循环输出user对象
users.stream().forEach(user -> System.out.println(user));
```

### 3.2 查找 find

```
// 取出第一个对象
User user = users.stream().findFirst().orElse(null); // 输出 {"age":1,"name":"Tom"}
// 随机取出任意一个对象
User user = users.stream().findAny().orElse(null);
```

### 3.3 匹配 match

```
// 判断是否存在name是Tom的用户
boolean existTom = users.stream().anyMatch(user -> "Tom".equals(user.getName()));
// 判断所有用户的年龄是否都小于5
boolean checkAge = users.stream().allMatch(user -> user.getAge() < 5);
```

### 3.4 筛选 filter

```
// 筛选name是Tom的用户
users.stream()
        .filter(user -> "Tom".equals(user.name))
        .forEach(System.out::println); // 输出 {"age":1,"name":"Tom"}
```

### 3.5 映射 map/flatMap

```
// 打印users里的name
users.stream().map(User::getName).forEach(System.out::println); // 输出 Tom Jerry
// List<List<User>> 转 List<User>
List<List<User>> userList = new ArrayList<>();
List<User> users = userList.stream().flatMap(Collection::stream).collect(Collectors.toList());
```

### 3.6 归约 reduce

```
// 求用户年龄之和
Integer sum = users.stream().map(User::getAge).reduce(Integer::sum).orElse(0);
// 求用户年龄的乘积
Integer product = users.stream().map(User::getAge).reduce((x, y) -> x * y).orElse(0);
```

### 3.7 排序 sorted

```
// 按年龄倒序排
List<User> collect = users.stream()
        .sorted(Comparator.comparing(User::getAge).reversed())
        .collect(Collectors.toList());

//多属性排序
List<Person> result = persons.stream()
                .sorted(Comparator.comparing((Person p) -> p.getNamePinyin())
                        .thenComparing(Person::getAge)).collect(Collectors.toList());
```

### 3.8 收集 collect

```
// list转换成map
Map<Integer, User> map = users.stream()
        .collect(Collectors.toMap(User::getAge, Function.identity()));

// 按年龄分组
Map<Integer, List<User>> userMap = users.stream().collect(Collectors.groupingBy(User::getAge));

// 求平均年龄
Double ageAvg = users.stream().collect(Collectors.averagingInt(User::getAge)); // 输出 1.5

// 求年龄之和
Integer ageSum = users.stream().collect(Collectors.summingInt(User::getAge));

// 求年龄最大的用户
User user = users.stream().collect(Collectors.maxBy(Comparator.comparing(User::getAge))).orElse(null);

// 把用户姓名拼接成逗号分隔的字符串输出
String names = users.stream().map(User::getName).collect(Collectors.joining(",")); // 输出 Tom,Jerry
```

### 3.9 List 转换成 Map 时遇到重复主键

![](http://img.topjavaer.cn/img/stream2.png)

这样转换会报错，因为 ID 重复。

![](http://img.topjavaer.cn/img/stream3.png)

可以这样做

![](http://img.topjavaer.cn/img/stream4.png)



--end--
