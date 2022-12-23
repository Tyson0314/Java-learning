# 28. 对称的二叉树

[28. 对称的二叉树](https://leetcode.cn/problems/dui-cheng-de-er-cha-shu-lcof/)

**题目描述**

给定一个二叉树的 root ，确定它是否是一个 完全二叉树 。

在一个 完全二叉树 中，除了最后一个关卡外，所有关卡都是完全被填满的，并且最后一个关卡中的所有节点都是尽可能靠左的。它可以包含 1 到 2^h 节点之间的最后一级 h 。

**示例**

```java
输入：root = [1,2,3,4,5,6]
输出：true
解释：最后一层前的每一层都是满的（即，结点值为 {1} 和 {2,3} 的两层），且最后一层中的所有结点（{4,5,6}）都尽可能地向左。
```

**解题思路**

层序遍历，当且仅当存在两个相邻节点：前一个为null，后一个不为null时，则不是完全二叉树。

```
       1
      / \
     2   3
    / \   \
   4   5   6
层序遍历序列为：[1, 2, 3, 4, 5, null, 6]，其中 null 出现在了6前面，所以不是完全二叉树
```

代码实现：

```java
class Solution {
    public boolean isCompleteTree(TreeNode root) {
        LinkedList<TreeNode> list = new LinkedList<>();
        TreeNode pre = root;
        TreeNode cur = root;
        list.addLast(root);

        while (!list.isEmpty()) {
            cur = list.removeFirst();
            if (cur != null) {
                if (pre == null) {
                    return false;
                }
                list.addLast(cur.left);
                list.addLast(cur.right);
            }
            pre = cur;
        }
        return true;
    }
}
```

