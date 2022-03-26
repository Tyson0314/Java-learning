<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [冒泡排序](#%E5%86%92%E6%B3%A1%E6%8E%92%E5%BA%8F)
- [插入排序](#%E6%8F%92%E5%85%A5%E6%8E%92%E5%BA%8F)
- [选择排序](#%E9%80%89%E6%8B%A9%E6%8E%92%E5%BA%8F)
- [基数排序](#%E5%9F%BA%E6%95%B0%E6%8E%92%E5%BA%8F)
- [快速排序](#%E5%BF%AB%E9%80%9F%E6%8E%92%E5%BA%8F)
- [归并排序](#%E5%BD%92%E5%B9%B6%E6%8E%92%E5%BA%8F)
- [堆排序](#%E5%A0%86%E6%8E%92%E5%BA%8F)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

常见的排序算法主要有：冒泡排序、插入排序、选择排序、快速排序、归并排序、堆排序、基数排序。各种排序算法的时间空间复杂度、稳定性见下图。

![](https://raw.githubusercontent.com/Tyson0314/img/master/排序算法.png)

# 冒泡排序

```java
    public void bubbleSort(int[] arr) {
        if (arr == null) {
            return;
        }
        boolean flag;
        for (int i = arr.length - 1; i > 0; i--) {
            flag = false;
            for (int j = 0; j < i; j++) {
                if (arr[j] > arr[j + 1]) {
                    int tmp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = tmp;
                    flag = true;
                }
            }
            if (!flag) {
                return;
            }
        }
    }
```

# 插入排序

```java
    public void insertSort(int[] arr) {
        if (arr == null) {
            return;
        }
        for (int i = 1; i < arr.length; i++) {
            int tmp = arr[i];
            int j = i;
            for (; j > 0 && tmp < arr[j - 1]; j--) {
                arr[j] = arr[j - 1];
            }
            arr[j] = tmp;
        }
    }
```

# 选择排序

```java
    public void selectionSort(int[] arr) {
        if (arr == null) {
            return;
        }
        for (int i = 0; i < arr.length - 1; i++) {
            for (int j = i + 1; j < arr.length; j++) {
                if (arr[i] > arr[j]) {
                    int tmp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = tmp;
                }
            }
        }
    }
```

# 基数排序

在基数排序中，因为没有比较操作，所以在时间复杂上，最好的情况与最坏的情况在时间上是一致的，均为 O(d * (n + r))。d 为位数，r 为基数，n 为原数组个数。
![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9pbWFnZXMyMDE4LmNuYmxvZ3MuY29tL2Jsb2cvMTI1MjkxMC8yMDE4MDkvMTI1MjkxMC0yMDE4MDkxMzExMDYyOTY4Ni00MDU0Mjk5NjkucG5n?x-oss-process=image/format,png)

# 快速排序

```java
    public void quickSort(int[] arr) {
        if (arr == null) {
            return;
        }
        quickSortHelper(arr, 0, arr.length - 1);
    }
    private void quickSortHelper(int[] arr, int left, int right) {
        if (left > right) {
            return;
        }
        int tmp = arr[left];
        int i = left;
        int j = right;
        while (i < j) {
            //j先走，最终循环终止时，j停留的位置就是arr[left]的正确位置
            //改为i<=j，则会进入死循环，[1,5,5,5,5]->[1] 5 [5,5,5]->[5,5,5]，会死循环
            while (i < j && arr[j] >= tmp) {
                j--;
            }
            while (i < j && arr[i] <= tmp) {
                i++;
            }
            if (i < j) {
                int tmp1 = arr[i];
                arr[i] = arr[j];
                arr[j] = tmp1;
            } else {
                break;
            }
        }

        //当循环终止的时候，i=j，因为是j先走的，j所在位置的值小于arr[left]，交换arr[j]和arr[left]
        arr[left] = arr[j];
        arr[j] = tmp;

        quickSortHelper(arr, left, j - 1);
        quickSortHelper(arr, j + 1, right);
    }
```

# 归并排序

![归并排序图](https://images2015.cnblogs.com/blog/1024555/201612/1024555-20161218163120151-452283750.png)

```java
public class MergeSort {
    public void mergeSort(int[] arr) {
        if (arr == null || arr.length == 0) {
            return;
        }
        //辅助数组
        int[] tmpArr = new int[arr.length];
        mergeSort(arr, tmpArr, 0, arr.length - 1);
    }

    private void mergeSort(int[] arr, int[] tmpArr, int left, int right) {
        if (left < right) {
            int mid = (left + right) >> 1;
            mergeSort(arr, tmpArr, left, mid);
            mergeSort(arr, tmpArr, mid + 1, right);
            merge(arr, tmpArr, left, mid, right);
        }
    }

    private void merge(int[] arr, int[] tmpArr, int left, int mid, int right) {
        int i = left;
        int j = mid + 1;
        int tmpIndex = left;
        while (i <= mid && j <= right) {
            if (arr[i] < arr[j]) {
                tmpArr[tmpIndex++] = arr[i];
                i++;
            } else {
                tmpArr[tmpIndex++] = arr[j];
                j++;
            }
        }

        while (i <= mid) {
            tmpArr[tmpIndex++] = arr[i++];
        }

        while (j <= right) {
            tmpArr[tmpIndex++] = arr[j++];
        }

        for (int m = left; m <= right; m++) {
            arr[m] = tmpArr[m];
        }
    }
}
```

# 堆排序

堆是具有下列性质的完全二叉树：每个结点的值都大于或等于其左右孩子结点的值，称为大顶堆；或者每个结点的值都小于或等于其左右孩子结点的值，称为小顶堆。

![](https://img-blog.csdn.net/20150312212515074)

**Top大问题**解决思路：使用一个固定大小的**最小堆**，当堆满后，每次添加数据的时候与堆顶元素比较，若小于堆顶元素，则舍弃，若大于堆顶元素，则删除堆顶元素，添加新增元素，对堆进行重新排序。

对于n个数，取Top m个数，时间复杂度为O(nlogm)，这样在n较大情况下，是优于nlogn（其他排序算法）的时间复杂度的。

PriorityQueue 是一种基于优先级堆的优先级队列。每次从队列中取出的是具有最高优先权的元素。如果不提供Comparator的话，优先队列中元素默认按自然顺序排列，也就是数字默认是小的在队列头。优先级队列用数组实现，但是数组大小可以动态增加，容量无限。

```java
//找出前k个最大数，采用小顶堆实现
public static int[] findKMax(int[] nums, int k) {
    PriorityQueue<Integer> pq = new PriorityQueue<>(k);//队列默认自然顺序排列，小顶堆，不必重写compare

    for (int num : nums) {
        if (pq.size() < k) {
            pq.offer(num);
        } else if (pq.peek() < num) {//如果堆顶元素 < 新数，则删除堆顶，加入新数入堆
            pq.poll();
            pq.offer(num);
        }
    }

    int[] result = new int[k];
    for (int i = 0; i < k&&!pq.isEmpty(); i++) {
        result[i] = pq.poll();
    }
    return result;
}
```

