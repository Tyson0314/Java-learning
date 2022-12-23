# 152. 乘积最大子数组

[题目链接](https://leetcode.cn/problems/maximum-product-subarray/)

**题目描述**

给你一个整数数组 nums ，请你找出数组中乘积最大的非空连续子数组（该子数组中至少包含一个数字），并返回该子数组所对应的乘积。

测试用例的答案是一个 32-位 整数。

子数组 是数组的连续子序列。

**示例**

```java
输入: nums = [2,3,-2,4]
输出: 6
解释: 子数组 [2,3] 有最大乘积 6。
```

**解题思路**

动态规划。

```java
class Solution {
    public int maxProduct(int[] nums) {
        int curMax = 1, curMin = 1;//保证i=1时，结果正确
        int max = Integer.MIN_VALUE;
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] < 0) {
                int tmp = curMax;
                curMax = curMin;
                curMin = tmp;
            }
            curMax = Math.max(curMax, curMax * nums[i]);
            curMin = Math.min(curMin, curMin * nums[i]);

            max = Math.max(max, curMax);//[2,-2]，当i=1时，curMax与curMin交换，curMax=1，max=2，故取max与curMax中最大值
        }
        return max;
    }
}
```

