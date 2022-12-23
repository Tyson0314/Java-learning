# 543. 二叉树的直径

[题目链接](https://leetcode.cn/problems/diameter-of-binary-tree/)

**题目描述**

给定一棵二叉树，你需要计算它的直径长度。一棵二叉树的直径长度是任意两个结点路径长度中的最大值。这条路径可能穿过也可能不穿过根结点。

**示例**

```java
          1
         / \
        2   3
       / \     
      4   5 
              
返回 3, 它的长度是路径 [4,2,1,3] 或者 [5,2,1,3]。
```

**解题思路**

**深度优先搜索**

```java
class Solution {
    private int max = 0;

    public int diameterOfBinaryTree(TreeNode root) {
        depth(root);
        return max;
    }

    private int depth(TreeNode node) {
        if (node == null) {
            return 0;
        }
        
        int left = depth(node.left);
        int right = depth(node.right);
        
        max = Math.max(max, left + right);
        return Math.max(left, right) + 1;
    }
}
```

