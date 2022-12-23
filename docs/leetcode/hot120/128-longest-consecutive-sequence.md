# 128. 最长连续序列

[128. 最长连续序列](https://leetcode.cn/problems/longest-consecutive-sequence/)

**题目描述**：

给定一个未排序的整数数组 nums ，找出数字连续的最长序列（不要求序列元素在原数组中连续）的长度。

请你设计并实现时间复杂度为 O(n) 的算法解决此问题。

**示例**：

```java
输入：nums = [100,4,200,1,3,2]
输出：4
解释：最长数字连续序列是 [1, 2, 3, 4]。它的长度为 4。
```

**解题思路**

将数组存入set。遍历数组，对`num[i]`前后连续的数字进行计数，并将set中的这些数字移除，避免重复计算。

比如`[10, 9, 8, 7, 11, 14]`，存入set。遍历第一个元素10，set移除10，10前面有7-8-9，后面有11，连续序列长度为5，将set中的7-8-9-11移除，后续遍历到7-8-9-11，直接跳过。

```java
class Solution {
    public int longestConsecutive(int[] nums) {
        Set<Integer> set = new HashSet<>();
        for (int num : nums) {
            set.add(num);
        }

        int len = 0;
        int maxLen = 0;
        for (int num : nums) {
            len = 1;
            if (set.remove(num)) {
                int cur = num;
                while (set.remove(--cur)) {
                    len++;
                }
                cur = num;
                while (set.remove(++cur)) {
                    len++;
                }
                maxLen = maxLen > len ? maxLen : len;
            }
        }

        return maxLen;
    }
}
```

