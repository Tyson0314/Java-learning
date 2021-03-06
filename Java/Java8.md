<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [函数式编程](#%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BC%96%E7%A8%8B)
- [Lambda 表达式](#lambda-%E8%A1%A8%E8%BE%BE%E5%BC%8F)
- [函数式接口](#%E5%87%BD%E6%95%B0%E5%BC%8F%E6%8E%A5%E5%8F%A3)
- [内置的函数式接口](#%E5%86%85%E7%BD%AE%E7%9A%84%E5%87%BD%E6%95%B0%E5%BC%8F%E6%8E%A5%E5%8F%A3)
  - [Predicate 断言](#predicate-%E6%96%AD%E8%A8%80)
  - [Comparator](#comparator)
  - [Consumer](#consumer)
- [Stream](#stream)
  - [Filter 过滤](#filter-%E8%BF%87%E6%BB%A4)
  - [Sorted 排序](#sorted-%E6%8E%92%E5%BA%8F)
  - [Map 转换](#map-%E8%BD%AC%E6%8D%A2)
  - [Match 匹配](#match-%E5%8C%B9%E9%85%8D)
  - [Count 计数](#count-%E8%AE%A1%E6%95%B0)
  - [Reduce](#reduce)
  - [flatMap](#flatmap)
- [Parallel-Streams 并行流](#parallel-streams-%E5%B9%B6%E8%A1%8C%E6%B5%81)
- [Map 集合](#map-%E9%9B%86%E5%90%88)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 函数式编程

面向对象编程：面向对象的语言，一切皆对象，如果想要调用一个函数，函数必须属于一个类或对象，然后在使用类或对象进行调用。面向对象编程会多写很多可能是重复的代码行。

```java
        Runnable runnable = new Runnable() {
            @Override
            public void run() {
                System.out.println("do something...");
            }
        };

```

函数式编程：在某些编程语言中，如js、c++，我们可以直接写一个函数，然后在需要的时候进行调用，即函数式编程。



## Lambda 表达式

[java8新特性](https://juejin.im/post/5c3d7c8a51882525dd591ac7#heading-16)

```java
List<String> names = Arrays.asList("peter", "anna", "mike", "xenia");

Collections.sort(names, (String a, String b) -> b.compareTo(a));
names.sort((a, b) -> b.compareTo(a));
```



## 函数式接口

函数式接口（Functional Interface）就是只包含一个抽象方法的接口。只有函数式接口才能缩写成 Lambda 表达式。

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


### Consumer

Consumer 接口接收一个泛型参数，然后调用 accept，对这个参数做一系列的操作。

```java
@FunctionalInterface
public interface Consumer<T> {
 
    
    void accept(T t);
 
    default Consumer<T> andThen(Consumer<? super T> after) {
        Objects.requireNonNull(after);
        return (T t) -> { accept(t); after.accept(t); };
    }
}

 Consumer<Integer> consumer = x -> {
            int a = x + 2;
            System.out.println(a);// 12
            System.out.println(a + "_");// 12_
        };
        consumer.accept(10); //调用了accept控制台才会输出
```

主要是对入参做一些操作，在stream里，主要是用于forEach，对传入的参数，做一系列的业务操作。

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

## Stream

使用 `java.util.Stream` 对一个包含一个或多个元素的集合做各种操作，原集合不变，返回新集合。只能对实现了 `java.util.Collection` 接口的类做流的操作。`Map` 不支持 `Stream` 流。`Stream` 流支持同步执行，也支持并发执行。

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

Filter` 的入参是一个 `Predicate，用于筛选出我们需要的集合元素。原集合不变。

```java
stringCollection
    .stream()
    .filter((s) -> s.startsWith("a"))
    .forEach(System.out::println);

// "aaa2", "aaa1"
```

### Sorted 排序

自然排序，不改变原集合，返回排序后的集合。

```java
stringCollection
    .stream()
    .sorted()
    .filter((s) -> s.startsWith("a"))
    .forEach(System.out::println);

// "aaa1", "aaa2"
```

逆序排序：

```java
stringCollection
    .stream()
    .sorted(Comparator.reverseOrder());
```

对元素某个字段排序：

```java
list.stream().sorted(Comparator.comparing(Student::getAge).reversed());
list.stream().sorted(Comparator.comparing(Student::getAge));
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


### flatMap

flatMap 用于将多个Stream连接成一个Stream。比如把几个小的list转换到一个大的list。

```java
@Test  
public void testMapAndFlatMap() {  
    List<String> words = new ArrayList<String>();  
    words.add("hello");  
    words.add("word");  

    //将words数组中的元素再按照字符拆分，然后字符去重，最终达到["h", "e", "l", "o", "w", "r", "d"]  
    //如果使用map，是达不到直接转化成List<String>的结果  
    List<String> stringList = words.stream()  
        .flatMap(word -> Arrays.stream(word.split("")))  
        .distinct()  
        .collect(Collectors.toList());  
    stringList.forEach(e -> System.out.println(e));  
}

//another demo
//把几个小的list转换到一个大的list。
public class Test {

    public static void main(String args[]) {

        List<String> teamIndia = Arrays.asList("Virat", "Dhoni", "Jadeja");
        List<String> teamAustralia = Arrays.asList("Warner", "Watson", "Smith");
        List<String> teamEngland = Arrays.asList("Alex", "Bell", "Broad");
        
        List<List<String>> playersInWorldCup2016 = new ArrayList<>();
        playersInWorldCup2016.add(teamIndia);
        playersInWorldCup2016.add(teamAustralia);
        playersInWorldCup2016.add(teamEngland);
        
        // Now let's do this in Java 8 using FlatMap
        List<String> flatMapList = playersInWorldCup2016.stream()
                                                        .flatMap(pList -> pList.stream())
                                                        .collect(Collectors.toList());
        
        System.out.println(flatMapList);
    }

}
```
## Parallel-Streams 并行流

`stream` 流是支持**顺序**和**并行**的。顺序流操作是单线程操作，而并行流是通过多线程来处理的，处理速度更快。

```java
long count = values.parallelStream().sorted().count();
```



## Map 集合

不能在遍历的时候使用`map.remove()`删除元素，会抛 ConcurrentModificationException 异常。可以使用 `iterator.remove()` 安全删除数据。使用 lambda 的 removeIf 提前删除数据，或者使用 Stream 的 filter 过滤掉要删除的数据，然后再进行遍历，也是安全的。

```java
Map<Integer, String> map = new HashMap<>();

for (int i = 0; i < 10; i++) {
    // 与老版不同的是，putIfAbent() 方法在 put 之前，
    // 会判断 key 是否已经存在，存在则直接返回 value, 否则 put, 再返回 value
    map.putIfAbsent(i, "val" + i);
}

// forEach 可以很方便地对 map 进行遍历操作
map.forEach((key, value) -> System.out.println(value));
map.entrySet().stream().forEach((entry) -> System.out.println(entry.getKey()));

//遍历前先移除key为1的键值
map.keySet().removeIf(key -> key == 1);
//过滤要删除的值，然后再进行遍历，才是安全的
map.entrySet().stream().filter(m -> 1 != m.getKey()).foreach((entry) -> {});

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