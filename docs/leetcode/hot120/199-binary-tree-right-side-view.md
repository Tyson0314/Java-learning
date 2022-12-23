# 199. 二叉树的右视图

[题目链接](https://leetcode.cn/problems/binary-tree-right-side-view/)

**题目描述**

给定一个二叉树的 **根节点** `root`，想象自己站在它的右侧，按照从顶部到底部的顺序，返回从右侧所能看到的节点值。

**示例**

```java
输入: [1,2,3,null,5,null,4]
输出: [1,3,4]
```

**解题思路**

层序遍历，保存最右边树节点。

```java
class Solution {
    public List<Integer> rightSideView(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        if (root == null) {
            return res;
        }

        Queue<TreeNode> queue = new ArrayDeque<>();
        queue.offer(root);

        while (!queue.isEmpty()) {
            int size = queue.size();
            while (size-- > 0) { //先取size的值，再自减
                TreeNode node = queue.poll();
                if (node.left != null) {
                    queue.offer(node.left);
                }
                if (node.right != null) {
                    queue.offer(node.right);
                }
                if (size == 0) { //最右边的节点
                    res.add(node.val);
                }
            }
        }

        return res;
    }
}
```

