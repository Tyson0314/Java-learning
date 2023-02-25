---
sidebar: heading
title: Map集合
category: Java
tag:
  - Java8
head:
  - - meta
    - name: keywords
      content: map集合,java map
  - - meta
    - name: description
      content: 高质量的Java基础常见知识点和面试题总结，让天下没有难背的八股文！
---

# Map 集合

Java8 针对 map 操作增加了一些方法，非常方便

1、删除元素使用`removeIf()`方法。

```java
/**
 * @description:
 * @author: 程序员大彬
 * @time: 2021-09-07 00:03
 */
public class MapTest {
    public static void main(String[] args) {

        Map<Integer, String> map = new HashMap<>();
        map.put(1, "dabin1");
        map.put(2, "dabin2");

        //删除value没有含有1的键值对
        map.values().removeIf(value -> !value.contains("1"));

        System.out.println(map);
    }
    /**
     * output
     * {1=dabin1}
     */
}
```

2、`putIfAbsent(key, value) ` 如果指定的 key 不存在，则 put 进去。

```java
/**
 * @description:
 * @author: 程序员大彬
 * @time: 2021-09-07 00:08
 */
public class MapTest1 {
    public static void main(String[] args) {

        Map<Integer, String> map = new HashMap<>();
        map.put(1, "大彬1");

        for (int i = 0; i < 3; i++) {
            map.putIfAbsent(i, "大彬" + i);
        }
        map.forEach((id, val) -> System.out.print(val + ", "));
    }
    /**
     * output
     * 大彬0, 大彬1, 大彬2
     */
}
```

3、map 转换。

```java
/**
 * @author: 程序员大彬
 * @time: 2021-09-07 08:15
 */
public class MapTest2 {
    public static void main(String[] args) {
        Map<String, Integer> map = new HashMap<>();
        map.put("1", 1);
        map.put("2", 2);

        Map<String, String> newMap = map.entrySet().stream()
                .collect(Collectors.toMap(e -> e.getKey(), e -> "大彬" + String.valueOf(e.getValue())));

        newMap.forEach((key, val) -> System.out.print(val + ", "));
    }
    /**
     * output
     * 大彬1, 大彬2,
     */
}
```

4、map遍历。

```java
/**
 * @author: 程序员大彬
 * @time: 2021-09-07 08:31
 */
public class MapTest3 {
    public static void main(String[] args) {
        Map<Integer, String> map = new HashMap<>();
        map.put(1, "大彬1");
        map.put(2, "大彬2");

        //方式1
        map.keySet().forEach(k -> {
            System.out.print(map.get(k) + ", ");
        });

        //方式2
        map.entrySet().iterator().forEachRemaining(e -> System.out.print(e.getValue() + ", "));

        //方式3
        map.entrySet().forEach(entry -> {
            System.out.print(entry.getValue() + ", ");
        });

        //方式4
        map.values().forEach(v -> {
            System.out.print(v + ", ");
        });
    }
}
```



