# 215. 数组中的第K个最大元素

[题目链接](https://leetcode.cn/problems/kth-largest-element-in-an-array/)

**题目描述**

给定整数数组 nums 和整数 k，请返回数组中第 k 个最大的元素。

请注意，你需要找的是数组排序后的第 k 个最大的元素，而不是第 k 个不同的元素。

你必须设计并实现时间复杂度为 O(n) 的算法解决此问题。

**示例**

```java
输入: [3,2,1,5,6,4], k = 2
输出: 5
```

**解题思路**

利用快速排序，每次得到pivot的下标，与(arr.length-1)比较，相等则为所求元素。

```java
class Solution {
    public int findKthLargest(int[] nums, int k) {
        int left = 0;
        int right = nums.length - 1;
        int index = nums.length - k;

        while (left < right) {
            int pivot = partition(nums, left, right);
            if (pivot == index) {
                return nums[pivot];
            } else if (index > pivot) {
                left = pivot + 1;
            } else {
                right = pivot - 1;
            }
        }

        return nums[left];
    }

    private int partition(int[] nums, int left, int right) {
        int i = left, j = right;
        median3(nums, left, right);
        int pivot = nums[left];

        while (i < j) {
            while (i < j && nums[j] >= pivot) {
                j--;
            }

            while (i < j && nums[i] <= pivot) {
                i++;
            }

            if (i < j) {
                swap(nums, i, j);
            } else {
                break;
            }
        }

        nums[left] = nums[j];
        nums[j] = pivot;

        return j;
    }

    private void median3(int[] nums, int left, int right) {
        int mid = (left + right) / 2;
        if (nums[left] > nums[mid]) {
            swap(nums, left, mid);
        }
        if (nums[left] > nums[right]) {
            swap(nums, left, right);
        }
        if (nums[mid] > nums[right]) {
            swap(nums, mid, right);
        }

        swap(nums, left, mid);
    }

    private void swap(int[] nums, int i, int j) {
        int tmp = nums[i];
        nums[i] = nums[j];
        nums[j] = tmp;
    }
}
```

