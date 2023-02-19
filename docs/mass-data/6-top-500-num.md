---
sidebar: heading
title: 如何找出排名前 500 的数？
category: 海量数据
tag:
  - 海量数据
head:
  - - meta
    - name: keywords
      content: 海量数据面试题,排名前500的数,海量数据
  - - meta
    - name: description
      content: 海量数据常见面试题总结，让天下没有难背的八股文！
---

## 如何找出排名前 500 的数？

## 题目描述

有 1w 个数组，每个数组有 500 个元素，并且有序排列。如何在这 10000*500 个数中找出前 500 的数？

## 方法1

题目中每个数组是排好序的，可以使用**归并**的方法。

先将第1个和第2个归并，得到500个数据。然后再将结果和第3个数组归并，得到500个数据，以此类推，直到最后找出前500个的数。

## 方法2

对于这种topk问题，更常用的方法是使用**堆排序**。

对本题而言，假设数组降序排列，可以采用以下方法：

首先建立大顶堆，堆的大小为数组的个数，即为10000 ，把每个数组最大的值存到堆中。

接着删除堆顶元素，保存到另一个大小为 500 的数组中，然后向大顶堆插入删除的元素所在数组的下一个元素。

重复上面的步骤，直到删除完第 500 个元素，也即找出了最大的前 500 个数。

**示例代码如下**：

```java
import lombok.Data;

import java.util.Arrays;
import java.util.PriorityQueue;

@Data
public class DataWithSource implements Comparable<DataWithSource> {
    /**
     * 数值
     */
    private int value;

    /**
     * 记录数值来源的数组
     */
    private int source;

    /**
     * 记录数值在数组中的索引
     */
    private int index;

    public DataWithSource(int value, int source, int index) {
        this.value = value;
        this.source = source;
        this.index = index;
    }

    /**
     *
     * 由于 PriorityQueue 使用小顶堆来实现，这里通过修改
     * 两个整数的比较逻辑来让 PriorityQueue 变成大顶堆
     */
    @Override
    public int compareTo(DataWithSource o) {
        return Integer.compare(o.getValue(), this.value);
    }
}


class Test {
    public static int[] getTop(int[][] data) {
        int rowSize = data.length;
        int columnSize = data[0].length;

        // 创建一个columnSize大小的数组，存放结果
        int[] result = new int[columnSize];

        PriorityQueue<DataWithSource> maxHeap = new PriorityQueue<>();
        for (int i = 0; i < rowSize; ++i) {
            // 将每个数组的最大一个元素放入堆中
            DataWithSource d = new DataWithSource(data[i][0], i, 0);
            maxHeap.add(d);
        }

        int num = 0;
        while (num < columnSize) {
            // 删除堆顶元素
            DataWithSource d = maxHeap.poll();
            result[num++] = d.getValue();
            if (num >= columnSize) {
                break;
            }

            d.setValue(data[d.getSource()][d.getIndex() + 1]);
            d.setIndex(d.getIndex() + 1);
            maxHeap.add(d);
        }
        return result;

    }

    public static void main(String[] args) {
        int[][] data = {
                {29, 17, 14, 2, 1},
                {19, 17, 16, 15, 6},
                {30, 25, 20, 14, 5},
        };

        int[] top = getTop(data);
        System.out.println(Arrays.toString(top)); // [30, 29, 25, 20, 19]
    }
}
```

