# 169. 多数元素

[169. 多数元素](https://leetcode.cn/problems/majority-element/)

**题目描述**

给定一个大小为 n 的数组 nums ，返回其中的多数元素。多数元素是指在数组中出现次数 大于 ⌊ n/2 ⌋ 的元素。

你可以假设数组是非空的，并且给定的数组总是存在多数元素。

**示例**

```
输入：nums = [3,2,3]
输出：3
```

**解题思路**

**摩尔投票法**

从第一个数开始count=1，遇到相同的就加1，遇到不同的就减1，减到0就重新换个数开始计数，总能找到最多的那个。

**代码实现**

```java
class Solution {
    public int majorityElement(int[] nums) {
        int ret = nums[0];
        int count = 1;
        for(int num : nums) {
            if(num != ret) {
                count--;
                if(count == 0) {
                    count = 1;
                    ret = num;
                }
            }
            else
                count++;
        }
        return ret;
    }
}
```


