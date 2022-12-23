# Stream

使用 `java.util.Stream` 对一个包含一个或多个元素的集合做各种操作，原集合不变，返回新集合。只能对实现了 `java.util.Collection` 接口的类做流的操作。`Map` 不支持 `Stream` 流。`Stream` 流支持同步执行，也支持并发执行。

## Filter 过滤

Filter` 的入参是一个 `Predicate，用于筛选出我们需要的集合元素。原集合不变。filter 会过滤掉不符合特定条件的，下面的代码会过滤掉`nameList`中不以大彬开头的字符串。

```java
/**
 * @description:
 * @author: 程序员大彬
 * @time: 2021-09-06 00:05
 */
public class StreamTest {
    public static void main(String[] args) {
        List<String> nameList = new ArrayList<>();
        nameList.add("大彬1");
        nameList.add("大彬2");
        nameList.add("aaa");
        nameList.add("bbb");

        nameList
                .stream()
                .filter((s) -> s.startsWith("大彬"))
                .forEach(System.out::println);
    }
    /**
     * output
     * 大彬1
     * 大彬2
     */
}
```

## Sorted 排序

自然排序，不改变原集合，返回排序后的集合。

```java
/**
 * @description:
 * @author: 程序员大彬
 * @time: 2021-09-06 00:05
 */
public class StreamTest1 {
    public static void main(String[] args) {
        List<String> nameList = new ArrayList<>();
        nameList.add("大彬3");
        nameList.add("大彬1");
        nameList.add("大彬2");
        nameList.add("aaa");
        nameList.add("bbb");

        nameList
                .stream()
                .filter((s) -> s.startsWith("大彬"))
                .sorted()
                .forEach(System.out::println);
    }
    /**
     * output
     * 大彬1
     * 大彬2
     * 大彬3
     */
}
```

逆序排序：

```java
nameList
    .stream()
    .sorted(Comparator.reverseOrder());
```

对元素某个字段排序：

```java
list.stream().sorted(Comparator.comparing(Student::getAge).reversed());
list.stream().sorted(Comparator.comparing(Student::getAge));
```

## Map 转换

将每个字符串转为大写。

```java
/**
 * @description:
 * @author: 程序员大彬
 * @time: 2021-09-06 00:05
 */
public class StreamTest2 {
    public static void main(String[] args) {
        List<String> nameList = new ArrayList<>();
        nameList.add("aaa");
        nameList.add("bbb");

        nameList
                .stream()
                .map(String::toUpperCase)
                .forEach(System.out::println);
    }
    /**
     * output
     * AAA
     * BBB
     */
}
```

## Match 匹配

验证 nameList 中的字符串是否有以`大彬`开头的。

```java
/**
 * @description:
 * @author: 程序员大彬
 * @time: 2021-09-06 00:05
 */
public class StreamTest3 {
    public static void main(String[] args) {
        List<String> nameList = new ArrayList<>();
        nameList.add("大彬1");
        nameList.add("大彬2");

        boolean startWithDabin =
                nameList
                    .stream()
                    .map(String::toUpperCase)
                    .anyMatch((s) -> s.startsWith("大彬"));

        System.out.println(startWithDabin);
    }
    /**
     * output
     * true
     */
}
```

## Count 计数

统计 `stream` 流中的元素总数，返回值是 `long` 类型。

```java
/**
 * @description:
 * @author: 程序员大彬
 * @time: 2021-09-06 00:05
 */
public class StreamTest4 {
    public static void main(String[] args) {
        List<String> nameList = new ArrayList<>();
        nameList.add("大彬1");
        nameList.add("大彬2");
        nameList.add("aaa");

        long count =
                nameList
                    .stream()
                    .map(String::toUpperCase)
                    .filter((s) -> s.startsWith("大彬"))
                    .count();

        System.out.println(count);
    }
    /**
     * output
     * 2
     */
}
```

## Reduce

类似拼接。可以实现将 `list` 归约成一个值。它的返回类型是 `Optional` 类型。

```java
/**
 * @description:
 * @author: 程序员大彬
 * @time: 2021-09-06 00:22
 */
public class StreamTest5 {
    public static void main(String[] args) {
        List<String> nameList = new ArrayList<>();
        nameList.add("大彬1");
        nameList.add("大彬2");

        Optional<String> reduced =
                nameList
                        .stream()
                        .sorted()
                        .reduce((s1, s2) -> s1 + "#" + s2);

        reduced.ifPresent(System.out::println);
    }
    /**
     * output
     * 大彬1#大彬2
     */
}
```


## flatMap

flatMap 用于将多个Stream连接成一个Stream。

下面的例子，把几个小的list转换到一个大的list。

```java
/**
 * @description: 把几个小的list转换到一个大的list。
 * @author: 程序员大彬
 * @time: 2021-09-06 00:28
 */
public class StreamTest6 {
    public static void main(String[] args) {
        List<String> team1 = Arrays.asList("大彬1", "大彬2", "大彬3");
        List<String> team2 = Arrays.asList("大彬4", "大彬5");

        List<List<String>> players = new ArrayList<>();
        players.add(team1);
        players.add(team2);

        List<String> flatMapList = players.stream()
                .flatMap(pList -> pList.stream())
                .collect(Collectors.toList());

        System.out.println(flatMapList);
    }
    /**
     * output
     * [大彬1, 大彬2, 大彬3, 大彬4, 大彬5]
     */
}
```
下面的例子中，将words数组中的元素按照字符拆分，然后对字符去重。

```java
/**
 * @description:
 * @author: 程序员大彬
 * @time: 2021-09-06 00:35
 */
public class StreamTest7 {
    public static void main(String[] args) {
        List<String> words = new ArrayList<String>();
        words.add("大彬最强");
        words.add("大彬666");

        //将words数组中的元素按照字符拆分，然后对字符去重
        List<String> stringList = words.stream()
                .flatMap(word -> Arrays.stream(word.split("")))
                .distinct()
                .collect(Collectors.toList());
        stringList.forEach(e -> System.out.print(e + ", "));
    }
    /**
     * output
     * 大, 彬, 最, 强, 6,
     */
}
```



