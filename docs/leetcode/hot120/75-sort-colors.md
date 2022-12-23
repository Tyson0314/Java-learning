# 75. 颜色分类

[题目链接](https://leetcode.cn/problems/sort-colors/)

**题目描述**

给定一个包含红色、白色和蓝色、共 `n` 个元素的数组 `nums` ，**[原地](https://baike.baidu.com/item/原地算法)**对它们进行排序，使得相同颜色的元素相邻，并按照红色、白色、蓝色顺序排列。

我们使用整数 `0`、 `1` 和 `2` 分别表示红色、白色和蓝色。

> 必须在不使用库的sort函数的情况下解决这个问题。

**示例**：

```java
输入：nums = [2,0,2,1,1,0]
输出：[0,0,1,1,2,2]
```

**解题思路**

三指针。

```java
class Solution {
    public void sortColors(int[] nums) {
        if (nums == null || nums.length == 0) {
            return;
        }
        int p1 = 0, cur = 0, p2 = nums.length - 1;
        while (cur <= p2) { //边界，nums全为1的情况
            if (nums[cur] == 0) {
                int tmp = nums[p1];
                nums[p1++] = 0;
                nums[cur++] = tmp; //cur++
            } else if (nums[cur] == 2) {
                int tmp = nums[p2];
                nums[p2--] = 2;
                nums[cur] = tmp; //nums[cur]可能为2，不自增
            } else {
                cur++;
            }
        }
    }
}
```





