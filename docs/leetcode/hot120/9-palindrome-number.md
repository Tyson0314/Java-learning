# 9. 回文数

[9. 回文数](https://leetcode.cn/problems/palindrome-number/)

**题目描述**

给你一个整数 x ，如果 x 是一个回文整数，返回 true ；否则，返回 false 。

回文数是指正序（从左向右）和倒序（从右向左）读都是一样的整数。

例如，121 是回文，而 123 不是。

**示例**

```java
输入：x = 121
输出：true
    
输入：x = -121
输出：false
解释：从左向右读, 为 -121 。 从右向左读, 为 121- 。因此它不是一个回文数。
```

**解题思路**

将数字后半段反转，跟数字前半段相比即可。

```java
class Solution {
    public boolean isPalindrome(int x) {
        //排除负数和整十的数
        if (x < 0 || (x % 10 == 0 && x != 0)) {
            return false;
        }

        int reverseNum = 0;
        //反转x的后半段数字，再做比较即可
        while(x > reverseNum) {
            reverseNum = reverseNum * 10 + x % 10;
            x /= 10;
        }

        //x为奇数位时，转换后reverseNum会比x多一位
        //如x为1234321，转换后reverseNum为1234，x为123
        return x == reverseNum || x == reverseNum / 10;
    }
}
```



