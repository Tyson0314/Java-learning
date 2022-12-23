# 56. 合并区间

[56. 合并区间](https://leetcode.cn/problems/merge-intervals/)

**题目描述**

以数组 intervals 表示若干个区间的集合，其中单个区间为 intervals[i] = [starti, endi] 。请你合并所有重叠的区间，并返回 一个不重叠的区间以数组 intervals 表示若干个区间的集合，其中单个区间为 intervals[i] = [starti, endi] 。请你合并所有重叠的区间，并返回 一个不重叠的区间数组，该数组需恰好覆盖输入中的所有区间 。

**示例**

```java
输入：intervals = [[1,3],[2,6],[8,10],[15,18]]
输出：[[1,6],[8,10],[15,18]]
解释：区间 [1,3] 和 [2,6] 重叠, 将它们合并为 [1,6].
```

**解题思路**

先对区间左边界排序 `Array.sort(arr, (i1, i2) -> i1[0] - i2[0])`，然后新建数组进行合并。

```java
class Solution {
    public int[][] merge(int[][] intervals) {
        if (intervals == null || intervals.length == 0) {
            throw new IllegalArgumentException("array is null or array is empty");
        }

        Arrays.sort(intervals, (a, b) -> a[0] - b[0]); //lambda表达式写法，返回值是int

        int index = 0;
        for (int i = 1; i < intervals.length; i++) {
            if (intervals[index][1] < intervals[i][0]) {
                intervals[++index] = intervals[i]; //++index，先自增，再取值
            } else {
                intervals[index][1] = Math.max(intervals[i][1], intervals[index][1]);
            }
        }

        return Arrays.copyOf(intervals, index + 1); //第二个参数是数组长度
    }
}
```

