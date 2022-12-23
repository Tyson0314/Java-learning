# 104. 二叉树的最大深度

[题目链接](https://leetcode.cn/problems/maximum-depth-of-binary-tree/)

**题目描述**

给定一个二叉树，找出其最大深度。

二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。

**说明:** 叶子节点是指没有子节点的节点。

**示例**

```java
给定二叉树 [3,9,20,null,null,15,7]， 
    3
   / \
  9  20
    /  \
   15   7
返回它的最大深度 3 。
```

**解题思路**

找出终止条件：当前节点为空
找出返回值：节点为空时说明高度为 0，所以返回 0；节点不为空时则分别求左右子树的高度的最大值，同时加1表示当前节点的高度，返回该数值

**参考代码**：

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) {
            return 0;
        }
        return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1;
    }
}
```


