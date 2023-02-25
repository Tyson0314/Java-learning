---
sidebar: heading
title: Parallel-Streams
category: Java
tag:
  - Java8
head:
  - - meta
    - name: keywords
      content: Parallel-Streams,并行流
  - - meta
    - name: description
      content: 高质量的Java基础常见知识点和面试题总结，让天下没有难背的八股文！
---

# Parallel-Streams

并行流。`stream` 流是支持**顺序**和**并行**的。顺序流操作是单线程操作，串行化的流无法带来性能上的提升，通常我们会使用多线程来并行执行任务，处理速度更快。

```java
/**
 * @description:
 * @author: 程序员大彬
 * @time: 2021-09-06 00:05
 */
public class StreamTest7 {
    public static void main(String[] args) {
        int max = 100;
        List<String> strs = new ArrayList<>(max);
        for (int i = 0; i < max; i++) {
            UUID uuid = UUID.randomUUID();
            strs.add(uuid.toString());
        }

        List<String> sortedStrs = strs.stream().sorted().collect(Collectors.toList());
        System.out.println(sortedStrs);
    }
    /**
     * output
     * [029be6d0-e77e-4188-b511-f1571cdbf299, 02d97425-b696-483a-80c6-e2ef51c05d83, 0632f1e9-e749-4bce-8bac-1cf6c9e93afa, ...]
     */
}
```



