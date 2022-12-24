# 43. 字符串相乘

[43. 字符串相乘](https://leetcode.cn/problems/multiply-strings/)

**题目描述**

给定两个以字符串形式表示的非负整数 `num1` 和 `num2`，返回 `num1` 和 `num2` 的乘积，它们的乘积也表示为字符串形式。

**注意：**不能使用任何内置的 BigInteger 库或直接将输入转换为整数。

**示例**

```java
输入: num1 = "2", num2 = "3"
输出: "6"
```

**解题思路**

参考自：https://leetcode-cn.com/problems/multiply-strings/solution/you-hua-ban-shu-shi-da-bai-994-by-breezean/

![](http://img.topjavaer.cn/img/1587226241610.png)

```java
class Solution {
    public String multiply(String num1, String num2) {
        if (num1.equals("0") || num2.equals("0")) { //乘0
            return "0";
        }
        int[] arr = new int[num1.length() + num2.length()];
        for (int i = num1.length() - 1; i >= 0; i--) {
            int m = num1.charAt(i) - '0';
            for (int j = num2.length() - 1; j >= 0; j--) {
                int n = num2.charAt(j) - '0';
                int sum = arr[i + j + 1] + m * n;
                arr[i + j + 1] = sum % 10;
                arr[i + j] += sum / 10; //+=，不能忘了原先的数
            }
        }

        StringBuilder ans = new StringBuilder("");
        if (arr[0] != 0) {
            ans.append(arr[0]);
        }
        for (int i = 1; i < arr.length; i++) {
            ans.append(arr[i]);
        }
        
        return ans.toString();
    }
}
```

