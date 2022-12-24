# 47. 全排列 II

[题目链接](https://leetcode.cn/problems/permutations-ii/)

**题目描述**

给定一个可包含重复数字的序列，返回所有不重复的全排列。注意与组合总和的区别。

示例：

```java 
输入：nums = [1,2,3]
输出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
```

**解题思路**

1、排序；

2、同一层级相同元素剪枝。

> 参考自：https://leetcode-cn.com/problems/permutations-ii/solution/hui-su-suan-fa-python-dai-ma-java-dai-ma-by-liwe-2/

![](http://img.topjavaer.cn/img/permutations-ii.png)

```java
class Solution {
    private List<List<Integer>> ans = new ArrayList<>();
    public List<List<Integer>> permuteUnique(int[] nums) {
        if (nums == null || nums.length == 0) {
            return ans;
        }
        ArrayDeque<Integer> path = new ArrayDeque<>();
        boolean[] used = new boolean[nums.length];
        Arrays.sort(nums);//切记
        dps(nums, used, path);

        return ans;
    }

    private void dps(int[] nums, boolean[] used, ArrayDeque<Integer> path) {
        if (path.size() == nums.length) {
            ans.add(new ArrayList<>(path));
            return;
        }
        for (int i = 0; i < nums.length; i++) {
            if (used[i]) {
                continue;
            }
            if ((i > 0 && nums[i] == nums[i - 1]) && !used[i - 1]) {//同一层相同的元素，剪枝
                continue;//继续循环，不是return退出循环
            }
            path.addLast(nums[i]);
            used[i] = true;
            dps(nums, used, path);
            path.removeLast();
            used[i] = false;
        }
    }
}
```


