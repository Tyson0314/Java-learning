# 34. 在排序数组中查找元素的第一个和最后一个位置

[34. 在排序数组中查找元素的第一个和最后一个位置](https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/)

**题目描述**

给你一个按照非递减顺序排列的整数数组 `nums`，和一个目标值 `target`。请你找出给定目标值在数组中的开始位置和结束位置。

如果数组中不存在目标值 `target`，返回 `[-1, -1]`。

你必须设计并实现时间复杂度为 `O(log n)` 的算法解决此问题。

**示例**

```java
输入：nums = [5,7,7,8,8,10], target = 8
输出：[3,4]
```

**参考代码**

```java
//输入: nums = [5,7,7,8,8,10], target = 8
//输出: [3,4]

class Solution {
    public int[] searchRange(int[] nums, int target) {
        if (nums == null || nums.length == 0) {
            return new int[]{-1, -1};
        }
        int left = searchRangeHelper(nums, target);
        int right = searchRangeHelper(nums, target + 1);//复用代码
        
        if (left == nums.length || nums[left] != target) {//left==nums.length数组元素比target小
            return new int[]{-1, -1};
        }
        return new int[]{left, right - 1};
    }

    private int searchRangeHelper(int[] nums, int target) {
        int left = 0;
        int right = nums.length;//特殊情况[1] 1
        while (left < right) {
            int mid = (left + right) >> 1;
            if (nums[mid] < target) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }

        return left;
    }
}
```

