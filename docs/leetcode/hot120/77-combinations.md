# 77. 组合

[题目链接](https://leetcode.cn/problems/combinations/)

**题目描述**

给定两个整数 `n` 和 `k`，返回范围 `[1, n]` 中所有可能的 `k` 个数的组合。

你可以按 **任何顺序** 返回答案。

**示例**：

```java
输入：n = 4, k = 2
输出：
[
  [2,4],
  [3,4],
  [2,3],
  [1,2],
  [1,3],
  [1,4],
]
    
输入：n = 1, k = 1
输出：[[1]]
```

**解题思路**

回溯。剪枝优化。

![](http://img.topjavaer.cn/img/image-20200526090917688.png)

```java
class Solution {
    public List<List<Integer>> combine(int n, int k) {
        List<List<Integer>> res = new ArrayList<>();
        if (n <= 0 || k <= 0 || n < k) {
            return res;
        }
        Stack<Integer> stack = new Stack<>();
        combineHelper(res, stack, 1, n, k);
        return res;
    }

    public void combineHelper(List<List<Integer>> res, Stack<Integer> stack, int index,int n, int k) {
        if (stack.size() == k) {
            res.add(new ArrayList<>(stack));
            return;
        }
        // i 的极限值满足： n - i + 1 = (k - pre.size())。
        // 【关键】n - i + 1 是闭区间 [i,n] 的长度。
        // k - pre.size() 是剩下还要寻找的数的个数。
        for (int i = index; i <= n - (k - stack.size()) + 1; i++) {
            stack.push(i);
            combineHelper(res, stack, i + 1, n, k);
            stack.pop();
        }
    }
}
```





