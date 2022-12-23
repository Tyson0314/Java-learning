# 7. 整数反转

[题目链接](https://leetcode.cn/problems/reverse-integer/)

**题目描述**

给你一个 32 位的有符号整数 x ，返回将 x 中的数字部分反转后的结果。

如果反转后整数超过 32 位的有符号整数的范围 [−231,  231 − 1] ，就返回 0。

假设环境不允许存储 64 位整数（有符号或无符号）。

**示例**

```java
输入：x = 123
输出：321
    
输入：x = 120
输出：21
```

**解题思路**

- 本题如果不考虑溢出问题，是非常简单的。解决溢出问题有两个思路，第一个思路是通过字符串转换加`try catch`的方式来解决，第二个思路就是通过数学计算来解决。
- 由于字符串转换的效率较低且使用较多库函数，所以解题方案不考虑该方法，而是通过数学计算来解决。
- 通过循环将数字`x`的每一位拆开，在计算新值时每一步都判断是否溢出。
- 溢出条件有两个，一个是大于整数最大值`MAX_VALUE`，另一个是小于整数最小值`MIN_VALUE`，设当前计算结果为`ans`，下一位为`pop`。
- 从`ans * 10 + pop > MAX_VALUE`这个溢出条件来看
  - 当出现 `ans > MAX_VALUE / 10` 且 `还有pop需要添加` 时，则一定溢出
  - 当出现 `ans == MAX_VALUE / 10` 且 `pop > 7` 时，则一定溢出，`7`是`2^31 - 1`的个位数
- 从`ans * 10 + pop < MIN_VALUE`这个溢出条件来看
  - 当出现 `ans < MIN_VALUE / 10` 且 `还有pop需要添加` 时，则一定溢出
  - 当出现 `ans == MIN_VALUE / 10` 且 `pop < -8` 时，则一定溢出，`8`是`-2^31`的个位数

> 作者：guanpengchn
> 链接：https://leetcode.cn/problems/reverse-integer/solution/hua-jie-suan-fa-7-zheng-shu-fan-zhuan-by-guanpengc/
> 来源：力扣（LeetCode）
> 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

```java
class Solution {
    public int reverse(int x) {
        int ans = 0;
        while (x != 0) {
            int pop = x % 10;
            if (ans > Integer.MAX_VALUE / 10 || (ans == Integer.MAX_VALUE / 10 && pop > 7)) 
                return 0;
            if (ans < Integer.MIN_VALUE / 10 || (ans == Integer.MIN_VALUE / 10 && pop < -8)) 
                return 0;
            ans = ans * 10 + pop;
            x /= 10;
        }
        return ans;
    }
}
```

