## Comparable和Comparator有什么区别？

Comparable 和 Comparator 都是用来进行元素排序的。它们之间的区别如下：

1、字面含义不同。Comparable 是“比较”的意思，而 Comparator 是“比较器”的意思。

2、Comparable 是通过重写 compareTo 方法实现排序的，而 Comparator 是通过重写compare 方法实现排序的。

3、Comparable 必须由自定义类内部实现排序方法，而 Comparator 是外部定义并实现排序的。



总结一下：Comparable 可以看作是“对内”进行排序接口，而 Comparator 是“对外”进行排序的接口。

