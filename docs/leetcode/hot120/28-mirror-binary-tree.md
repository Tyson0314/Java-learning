# 28. 对称的二叉树

[28. 对称的二叉树](https://leetcode.cn/problems/dui-cheng-de-er-cha-shu-lcof/)

**题目描述**

请实现一个函数，用来判断一棵二叉树是不是对称的。如果一棵二叉树和它的镜像一样，那么它是对称的。

例如，二叉树 [1,2,2,3,4,4,3] 是对称的。

**示例**

```java
输入：root = [1,2,2,3,4,4,3]
输出：true
```

**解题思路**

从顶至底递归，判断每对节点是否对称，从而判断树是否为对称二叉树。

```java
class Solution {
    public boolean isSymmetric(TreeNode root) {
        if (root == null) {
            return true;
        }
        return isMirror(root.left, root.right);
    }

    public boolean isMirror(TreeNode node1, TreeNode node2) {
        if (node1 == null && node2 == null) {
            return true;
        }
        
        if (node1 == null || node2 == null || node1.val != node2.val) {
            return false;
        }

        return isMirror(node1.left, node2.right) && isMirror(node1.right, node2.left);
    }
}
```

