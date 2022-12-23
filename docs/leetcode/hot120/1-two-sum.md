# 1. 两数之和

[1. 两数之和](https://leetcode.cn/problems/two-sum/)

**题目描述**

给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target  的那 两个 整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。

你可以按任意顺序返回答案。

**示例**

```java
输入：nums = [2,7,11,15], target = 9
输出：[0,1]
解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。
```

**解题思路**

- 遍历数组 nums，i 为当前下标，每个值都判断map中是否存在 `nums[i]` 的 key 值。

- 如果存在则找到了两个值，如果不存在则将当前的 `(target - nums[i],i)` 存入 map 中，继续遍历直到找到为止。

**参考代码**：

```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        int[] result = new int[2];
        Map<Integer, Integer> map = new HashMap<>();

        for (int i = 0; i < nums.length; i++) {
            if (map.containsKey(nums[i])) {
                result[0] = map.get(nums[i]);
                result[1] = i;
                return result;
            }
            map.put(target - nums[i], i);
        }

        return result;
    }
}
```


