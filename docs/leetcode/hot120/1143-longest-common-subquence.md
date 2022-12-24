# 1143. 最长公共子序列

[原题链接](https://leetcode.cn/problems/longest-common-subsequence/)

## 题目描述

给定两个字符串 text1 和 text2，返回这两个字符串的最长 公共子序列 的长度。如果不存在 公共子序列 ，返回 0 。

一个字符串的 子序列 是指这样一个新的字符串：它是由原字符串在不改变字符的相对顺序的情况下删除某些字符（也可以不删除任何字符）后组成的新字符串。

例如，"ace" 是 "abcde" 的子序列，但 "aec" 不是 "abcde" 的子序列。
两个字符串的 公共子序列 是这两个字符串所共同拥有的子序列。

示例：

```java
输入：text1 = "abcde", text2 = "ace" 
输出：3  
解释：最长公共子序列是 "ace" ，它的长度为 3 。
```

## 解题思路

动态规划。

解法一：`dp[i][j]`表示text1以i-1结尾的子串和text2以j-1结尾的子串的最长公共子序列的长度。dp横坐标或纵坐标为0表示空字符串，`dp[0][j] = dp[i][0] = 0`，无需额外处理base case。

![](http://img.topjavaer.cn/img/longestCommonSubsequence.png)

```java
class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        char[] arr1 = text1.toCharArray();
        char[] arr2 = text2.toCharArray();
        //dp[0][x]和dp[x][0]表示有一个为空字符串
        //dp[1][1]为text1第一个字符和text2第一个字符的最长公共子序列的长度
        //dp[i][j]表示text1以i-1结尾的子串和text2以j-1结尾的子串的最长公共子序列的长度
        int len1 = arr1.length;
        int len2 = arr2.length;
        int[][] dp = new int[len1 + 1][len2 + 1];

        for (int i = 1; i < len1 + 1; i++) {
            for (int j = 1; j < len2 + 1; j++) {
                if (arr1[i - 1] == arr2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }

        return dp[len1][len2];
    }
}
```

解法二：`dp[i][j]`表示text1以i结尾的子串和text2以j结尾的子串的最长公共子序列的长度。需要处理base case。

```java
class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        char[] arr1 = text1.toCharArray();
        char[] arr2 = text2.toCharArray();

        int len1 = arr1.length;
        int len2 = arr2.length;
        //`dp[i][j]`表示text1以i结尾的子串和text2以j结尾的子串的最长公共子序列的长度。
        int[][] dp = new int[len1][len2];

        if (arr1[0] == arr2[0]) {
            dp[0][0] = 1;
        }
        for (int i = 1; i < len1; i++) {
            if (arr1[i] == arr2[0]) {
                dp[i][0] = 1;
            } else {
                dp[i][0] = dp[i - 1][0];
            }
        }
        for (int i = 1; i < len2; i++) {
            if (arr1[0] == arr2[i]) {
                dp[0][i] = 1;
            } else {
                dp[0][i] = dp[0][i - 1];
            }
        }

        for (int i = 1; i < len1; i++) {
            for (int j = 1; j < len2; j++) {
                if (arr1[i] == arr2[j]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }

        return dp[len1 - 1][len2 - 1];
    }
}
```

