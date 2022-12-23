# 59. 螺旋矩阵II

[题目链接](https://leetcode.cn/problems/spiral-matrix-ii/)

**题目描述**

给你一个正整数 `n` ，生成一个包含 `1` 到 `n2` 所有元素，且元素按顺时针顺序螺旋排列的 `n x n` 正方形矩阵 `matrix` 。

**示例**

```java
输入：n = 3
输出：[[1,2,3],[8,9,4],[7,6,5]]
```

**解题思路**

tips：定义上下左右边界。

```java
class Solution {
    public int[][] generateMatrix(int n) {
        int left = 0;
        int right = n - 1;
        int top = 0;
        int bottom = n - 1;
        
        int[][] ans = new int[n][n];
        int num = 1;
        while (true) {
            for (int i = left; i <= right; i++) {
                ans[top][i] = num++;//注意下标顺序
            }
            if (++top > bottom) {
                break;
            }
            for (int j = top; j <= bottom; j++) {
                ans[j][right] = num++;
            }
            if (--right < left) {
                break;
            }
            for (int m = right; m >= left; m--) {
                ans[bottom][m] = num++;
            }
            if (--bottom < top) {
                break;
            }
            for (int k = bottom; k >= top; k--) {
                ans[k][left] = num++;
            }
            if (++left > right) {
                break;
            }
        }
        return ans;
    }
}
```

