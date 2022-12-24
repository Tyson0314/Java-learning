# 5. 最长回文子串

[原题链接](https://leetcode.cn/problems/longest-palindromic-substring/)

## 题目描述

从给定的字符串 `s` 中找到最长的回文子串的长度。

例如 `s = "babbad"` 的最长回文子串是 `"abba"` ，长度是 `4` 。

## 解题思路

1. 定义状态。`dp[i][j]` 表示子串 `s[i..j]` 是否为回文子串

2. 状态转移方程：`dp[i][j] = (s[i] == s[j]) and dp[i + 1][j - 1]`
3. 初始化的时候，单个字符一定是回文串，因此把对角线先初始化为 `true`，即 `dp[i][i] = true` 。
4. 只要一得到 `dp[i][j] = true`，就记录子串的长度和起始位置

注意事项：总是先得到小子串的回文判定，然后大子串才能参考小子串的判断结果，即填表顺序很重要。

![](http://img.topjavaer.cn/img/image-20201115230411764.png)

时间复杂度O(N2)，空间复杂度O(N2)，因为使用了二维数组。

```java
public class Solution {

    public String longestPalindrome(String s) {
        // 特判
        int len = s.length();
        if (len < 2) {
            return s;
        }

        int maxLen = 1;
        int begin = 0;

        // dp[i][j] 表示 s[i, j] 是否是回文串
        boolean[][] dp = new boolean[len][len];
        char[] charArray = s.toCharArray();

        for (int i = 0; i < len; i++) {
            dp[i][i] = true;
        }
        for (int j = 1; j < len; j++) {
            for (int i = 0; i < j; i++) {
                if (charArray[i] != charArray[j]) {
                    dp[i][j] = false;
                } else {
                    if (j - i < 3) {
                        dp[i][j] = true;
                    } else {
                        dp[i][j] = dp[i + 1][j - 1];
                    }
                }

                // 只要 dp[i][j] == true 成立，就表示子串 s[i..j] 是回文，此时记录回文长度和起始位置
                if (dp[i][j] && j - i + 1 > maxLen) {
                    maxLen = j - i + 1;
                    begin = i;
                }
            }
        }
        return s.substring(begin, begin + maxLen); //substring(i, j)截取i到j(不包含j)的字符串
    }
}
```

