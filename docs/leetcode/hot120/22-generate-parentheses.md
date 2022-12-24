22. # 22. 括号生成

[22. 括号生成](https://leetcode.cn/problems/generate-parentheses/)

**题目描述**

数字 `n` 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且 **有效的** 括号组合。

**示例**

```java
输入：n = 3
输出：["((()))","(()())","(())()","()(())","()()()"]
```

**解题思路**

深度优先算法。

> 作者：liweiwei1419
> 链接：https://leetcode.cn/problems/generate-parentheses/solution/hui-su-suan-fa-by-liweiwei1419/
> 来源：力扣（LeetCode）
> 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

如果完成一件事情有很多种方法，并且每一种方法分成若干步骤，那多半就可以使用“回溯”算法完成。

“回溯”算法的基本思想是“尝试搜索”，一条路如果走不通（不能得到想要的结果），就回到上一个“路口”，尝试走另一条路。

因此，“回溯”算法的时间复杂度一般不低。如果能提前分析出，走这一条路并不能得到想要的结果，可以跳过这个分支，这一步操作叫“剪枝”。

做“回溯”算法问题的基本套路是：

1、使用题目中给出的示例，画树形结构图，以便分析出递归结构；

一般来说，树形图不用画完，就能够分析出递归结构和解题思路。

2、分析一个结点可以产生枝叶的条件、递归到哪里终止、是否可以剪枝、符合题意的结果在什么地方出现（可能在叶子结点，也可能在中间的结点）；

3、完成以上两步以后，就要编写代码实现上述分析的过程，使用代码在画出的树形结构上搜索符合题意的结果。

在树形结构上搜索结果集，使用的方法是执行一次“深度优先遍历”。在遍历的过程中，可能需要使用“状态变量”。

我们以 `n = 2` 为例，画树形结构图。

![](http://img.topjavaer.cn/img/括号生成.jpg)

画图以后，可以分析出的结论：

- 左右都有可以使用的括号数量，即严格大于 0 的时候，才产生分支；
- 左边不受右边的限制，它只受自己的约束；
- 右边除了自己的限制以外，还收到左边的限制，即：右边剩余可以使用的括号数量一定得在严格大于左边剩余的数量的时候，才可以“节外生枝”；
- 在左边和右边剩余的括号数都等于 0 的时候结算。

参考代码如下：

```java
import java.util.ArrayList;
import java.util.List;

public class Solution {

    // 做减法

    public List<String> generateParenthesis(int n) {
        List<String> res = new ArrayList<>();
        // 特判
        if (n == 0) {
            return res;
        }

        // 执行深度优先遍历，搜索可能的结果
        dfs("", n, n, res);
        return res;
    }

    /**
     * @param curStr 当前递归得到的结果
     * @param left   左括号还有几个可以使用
     * @param right  右括号还有几个可以使用
     * @param res    结果集
     */
    private void dfs(String curStr, int left, int right, List<String> res) {
        // 因为每一次尝试，都使用新的字符串变量，所以无需回溯
        // 在递归终止的时候，直接把它添加到结果集即可，注意与「力扣」第 46 题、第 39 题区分
        if (left == 0 && right == 0) {
            res.add(curStr);
            return;
        }

        // 剪枝（如图，左括号可以使用的个数严格大于右括号可以使用的个数，才剪枝，注意这个细节）
        if (left > right) {
            return;
        }

        if (left > 0) {
            dfs(curStr + "(", left - 1, right, res);
        }

        if (right > 0) {
            dfs(curStr + ")", left, right - 1, res);
        }
    }
}
```

