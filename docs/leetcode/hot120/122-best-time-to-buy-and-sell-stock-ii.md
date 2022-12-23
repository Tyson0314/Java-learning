# 122. 买卖股票的最佳时机 II

[题目链接](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-ii/)

**题目描述**：

给你一个整数数组 prices ，其中 prices[i] 表示某支股票第 i 天的价格。

在每一天，你可以决定是否购买和/或出售股票。你在任何时候 最多 只能持有 一股 股票。你也可以先购买，然后在 同一天 出售。

返回 你能获得的 最大 利润 。

**示例**：

```java
输入：prices = [1,2,3,4,5]
输出：4
解释：在第 1 天（股票价格 = 1）的时候买入，在第 5 天 （股票价格 = 5）的时候卖出, 这笔交易所能获得利润 = 5 - 1 = 4 。
     总利润为 4 。
```

**解题思路**

可以尽可能地完成更多的交易，但不能同时参与多笔交易（你必须在再次购买前出售掉之前的股票）。

```java
//输入: [7,1,5,3,6,4]
//输出: 7
class Solution {
    public int maxProfit(int[] prices) {
        int profit = 0;
        for (int i = 1; i < prices.length; i++) {
            int tmp = prices[i] - prices[i - 1];
            if (tmp > 0) {
                profit += tmp;
            }
        }

        return profit;
    }
}
```

