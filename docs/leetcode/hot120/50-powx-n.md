# 50. Pow(x, n)

[50. Pow(x, n)](https://leetcode.cn/problems/powx-n/)

**题目描述**

实现 pow(x, n) ，即计算 `x` 的整数 `n` 次幂函数（即，`x^n` ）。

**示例**

```java
输入：x = 2.00000, n = 10
输出：1024.00000
```

**解题思路**

快速幂算法。

```java
class Solution {
    public double myPow(double x, int n) {
        if (n == 0) {
            return 1.0;
        }
        if (n == -1) {//负数边界
            return 1 / x;
        }
        double res = myPow(x, n / 2);
        double ans = 0;
        if (n % 2 == 0) {
            ans = res * res;
        } else {
            ans = n > 0 ? res * res * x : res * res / x;
        }

        return ans;
    }
}
```

