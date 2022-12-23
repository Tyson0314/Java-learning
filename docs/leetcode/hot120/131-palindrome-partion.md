# 131. 分割回文串

[题目链接](https://leetcode.cn/problems/palindrome-partitioning/)

**题目描述**

给你一个字符串 `s`，请你将 `s` 分割成一些子串，使每个子串都是 **回文串** 。返回 `s` 所有可能的分割方案。

**回文串** 是正着读和反着读都一样的字符串。

**示例**

```
输入：s = "aab"
输出：[["a","a","b"],["aa","b"]]
```

**解题思路**

[参考题解](https://leetcode-cn.com/problems/palindrome-partitioning/solution/hui-su-you-hua-jia-liao-dong-tai-gui-hua-by-liweiw/)

使用动态规划预标记出哪一段属于回文串。

```java
class Solution {
    public List<List<String>> partition(String s) {
        List<List<String>> res = new ArrayList<>();
        
        int len = s.length();
        if (s == null || len == 0) {
            return res;
        }

        boolean dp[][] = new boolean[len][len];
        char[] charArr = s.toCharArray();

        for (int i = 0; i < len; i++) {
            dp[i][i] = true;
        }

        for (int right = 1; right < len; right++) {
            for (int left = 0; left < right; left++) {
                    dp[left][right] = charArr[left] == charArr[right] && (right - left <= 2 || dp[left + 1][right - 1]);
            }
        }

        LinkedList<String> path = new LinkedList<>();
        dfs(s, 0, res, path, dp);

        return res;
    }

    private void dfs(String s, int start, List<List<String>> res, LinkedList<String> path, boolean[][] dp) {
        if (start == s.length()) {
            res.add(new ArrayList<>(path));
            return;
        }

        for (int i = start; i < s.length(); i++) {
            if (dp[start][i]) {
                path.addLast(s.substring(start, i + 1));
                dfs(s, i + 1, res, path, dp);
                path.removeLast();
            }
        }
    }
}
```

