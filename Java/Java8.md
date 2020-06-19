## Lambda 表达式

[java8新特性](https://juejin.im/post/5c3d7c8a51882525dd591ac7#heading-16)

```java
List<String> names = Arrays.asList("peter", "anna", "mike", "xenia");

Collections.sort(names, (String a, String b) -> b.compareTo(a));
names.sort((a, b) -> b.compareTo(a));
```



## 函数式接口

函数式接口（Functional Interface）就是只包含一个抽象方法的声明。只有那些函数式接口才能缩写成 Lambda 表示式。

```java
@FunctionalInterface //定义为一个函数式接口，如果添加了第二个抽象方法，编译器会立刻抛出错误提示。
interface Converter<F, T> {
    T convert(F from);
}

Converter<String, Integer> converter = (from) -> Integer.valueOf(from);
Integer converted = converter.convert("123");
System.out.println(converted);    // 123
```



## 内置的函数式接口

Comparator 和 Runnable，Java 8 为他们都添加了 @FunctionalInterface 注解，以用来支持 Lambda 表达式。

### Predicate 断言

指定入参类型，并返回 boolean 值的函数式接口。用来组合一个复杂的逻辑判断。

```java
Predicate<String> predicate = (s) -> s.length() > 0;

predicate.test("foo");              // true
predicate.negate().test("foo");     // false

Predicate<Boolean> nonNull = Objects::nonNull;
Predicate<Boolean> isNull = Objects::isNull;

Predicate<String> isEmpty = String::isEmpty;
Predicate<String> isNotEmpty = isEmpty.negate();
```

### Comparator

```java
public class SortTest {
    public static void main(String[] args) {
        Comparator<Person> comparator = (p1, p2) -> p1.firstName.compareTo(p2.firstName); //升序

        Person p1 = new Person("John", "Doe");
        Person p2 = new Person("Alice", "Wonderland");

        comparator.compare(p1, p2);             // > 0 字母升序
        comparator.reversed().compare(p1, p2);  // < 0 字母降序

        List<Person> personList = new ArrayList<>();
        personList.add(p1);
        personList.add(p2);
        personList.stream().sorted(comparator).forEach(System.out::println); //sorted不会改变personList
//        personList.sort(comparator); //sort会改变personList
//        personList.stream().forEach(System.out::println);
    }

}

class Person {
    public String firstName;
    public String lastName;

    public Person(String firstName, String lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    @Override
    public String toString() {
        return this.firstName;
    }
}
```



## Stream

使用 `java.util.Stream` 对一个包含一个或多个元素的集合做各种操作。只能对实现了 `java.util.Collection` 接口的类做流的操作。`Map` 不支持 `Stream` 流。`Stream` 流支持同步执行，也支持并发执行。

### Filter 过滤

创建一个 List 集合：

```java
List<String> stringCollection = new ArrayList<>();
stringCollection.add("ddd2");
stringCollection.add("aaa2");
stringCollection.add("bbb1");
stringCollection.add("aaa1");
stringCollection.add("bbb3");
stringCollection.add("ccc");
stringCollection.add("bbb2");
stringCollection.add("ddd1");
```

Filter` 的入参是一个 `Predicate，用于筛选出我们需要的集合元素。

```java
stringCollection
    .stream()
    .filter((s) -> s.startsWith("a"))
    .forEach(System.out::println);

// "aaa2", "aaa1"
```

### Sorted 排序

```java
stringCollection
    .stream()
    .sorted()
    .filter((s) -> s.startsWith("a"))
    .forEach(System.out::println);

// "aaa1", "aaa2"
```

### Map 转换

将每个字符串转为大写。

```java
stringCollection
    .stream()
    .map(String::toUpperCase)
    .sorted((a, b) -> b.compareTo(a))
    .forEach(System.out::println);

// "DDD2", "DDD1", "CCC", "BBB3", "BBB2", "AAA2", "AAA1"

```

### Match 匹配

验证 list 中 string 是否有以 a 开头的, 匹配到第一个，即返回 true。

```java
boolean anyStartsWithA =
    stringCollection
        .stream()
        .anyMatch((s) -> s.startsWith("a"));

System.out.println(anyStartsWithA);      // true
```

### Count 计数

```java
// 先对 list 中字符串开头为 b 进行过滤，让后统计数量
long startsWithB =
    stringCollection
        .stream()
        .filter((s) -> s.startsWith("b"))
        .count();

System.out.println(startsWithB);    // 3
```

### Reduce

类似拼接。

```java
Optional<String> reduced =
    stringCollection
        .stream()
        .sorted()
        .reduce((s1, s2) -> s1 + "#" + s2);

reduced.ifPresent(System.out::println);
// "aaa1#aaa2#bbb1#bbb2#bbb3#ccc#ddd1#ddd2"
```



## Parallel-Streams 并行流

`stream` 流是支持**顺序**和**并行**的。顺序流操作是单线程操作，而并行流是通过多线程来处理的，处理速度更快。

```java
long count = values.parallelStream().sorted().count();
```



## Map 集合

```java
Map<Integer, String> map = new HashMap<>();

for (int i = 0; i < 10; i++) {
    // 与老版不同的是，putIfAbent() 方法在 put 之前，
    // 会判断 key 是否已经存在，存在则直接返回 value, 否则 put, 再返回 value
    map.putIfAbsent(i, "val" + i);
}

// forEach 可以很方便地对 map 进行遍历操作
map.forEach((key, value) -> System.out.println(value));

// computeIfPresent(), 当 key 存在时，才会做相关处理
// 如下：对 key 为 3 的值，内部会先判断值是否存在，存在，则做 value + key 的拼接操作
map.computeIfPresent(3, (num, val) -> val + num);
map.get(3);             // val33

// 先判断 key 为 9 的元素是否存在，存在，则做删除操作
map.computeIfPresent(9, (num, val) -> null);
map.containsKey(9);     // false

// computeIfAbsent(), 当 key 不存在时，才会做相关处理
// 如下：先判断 key 为 23 的元素是否存在，不存在，则添加
map.computeIfAbsent(23, num -> "val" + num);
map.containsKey(23);    // true

// 先判断 key 为 3 的元素是否存在，存在，则不做任何处理
map.computeIfAbsent(3, num -> "bam");
map.get(3);             // val33

//只有当给定的 key 和 value 完全匹配时，才会执行删除操作。
map.remove(3, "val3");
map.get(3);             // val33

map.remove(3, "val33");
map.get(3);             // null

// 若 key 42 不存在，则返回 not found
map.getOrDefault(42, "not found");  // not found

// merge 方法，会先判断进行合并的 key 是否存在，不存在，则会添加元素
map.merge(9, "val9", (value, newValue) -> value.concat(newValue));
map.get(9);             // val9

// 若 key 的元素存在，则对 value 执行拼接操作
map.merge(9, "concat", (value, newValue) -> value.concat(newValue));
map.get(9);             // val9concat
```