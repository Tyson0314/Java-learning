# 74. 搜索二维矩阵

[题目链接](https://leetcode.cn/problems/search-a-2d-matrix/)

**题目描述**

编写一个高效的算法来判断 `m x n` 矩阵中，是否存在一个目标值。该矩阵具有如下特性：

- 每行中的整数从左到右按升序排列。
- 每行的第一个整数大于前一行的最后一个整数。

**示例**：

![](http://img.topjavaer.cn/img/image-20221121021212085.png)

```java
输入：matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3
输出：true
```

**参考代码**

```java
class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        if (null == matrix || matrix.length == 0 || matrix[0].length == 0) {
            return false;
        }
        int rows = matrix.length;
        int cols = matrix[0].length;
        int left = 0;
        int right = rows * cols - 1;

        while (left <= right) {
            int mid = (left + right) >> 1; //!
            int val = matrix[mid / cols][mid % cols]; //cols!不是rows
            if (target == val) {
                return true;
            } else if (target > val) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        return false;
    }
}
```





