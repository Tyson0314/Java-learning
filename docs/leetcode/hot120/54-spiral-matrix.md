# 54. 螺旋矩阵

[54. 螺旋矩阵](https://leetcode.cn/problems/spiral-matrix/)

**题目描述**

给你一个 `m` 行 `n` 列的矩阵 `matrix` ，请按照 **顺时针螺旋顺序** ，返回矩阵中的所有元素。

**示例**

```java
输入：matrix = [[1,2,3],[4,5,6],[7,8,9]]
输出：[1,2,3,6,9,8,7,4,5]
```

**解题思路**

- 首先设定上下左右边界
- 其次向右移动到最右，此时第一行因为已经使用过了，可以将其从图中删去，体现在代码中就是重新定义上边界
- 判断若重新定义后，上下边界交错，表明螺旋矩阵遍历结束，跳出循环，返回答案
- 若上下边界不交错，则遍历还未结束，接着向下向左向上移动，操作过程与第一，二步同理
- 不断循环以上步骤，直到某两条边界交错，跳出循环，返回答案

> 作者：YouLookDeliciousC
> 链接：https://leetcode.cn/problems/spiral-matrix/solutions/7155/cxiang-xi-ti-jie-by-youlookdeliciousc-3/

```java
class Solution {
    public List<Integer> spiralOrder(int[][] matrix) {
        List<Integer> ans = new ArrayList<>();
        if (matrix == null || matrix.length == 0) {
            return ans;
        }
        int top = 0;
        int bottom = matrix.length - 1;
        int left = 0;
        int right = matrix[0].length - 1;
        while (true) {
            for (int i = left; i <= right; i++) {
                ans.add(matrix[top][i]);
            }
            if (++top > bottom) {
                break;
            }
            for (int j = top; j <= bottom; j++) {
                ans.add(matrix[j][right]);
            }
            if (--right < left) {
                break;
            }
            for (int m = right; m >= left; m--) {
                ans.add(matrix[bottom][m]);
            }
            if (--bottom < top) {
                break;
            }
            for (int n = bottom; n >= top; n--) {
                ans.add(matrix[n][left]);
            }
            if (++left > right) {
                break;
            }
        }

        return ans;
    }
}
```

