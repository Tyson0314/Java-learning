# 24. 两两交换链表中的节点

[两两交换链表中的节点](https://leetcode.cn/problems/swap-nodes-in-pairs/)

**题目描述**

给你一个链表，两两交换其中相邻的节点，并返回交换后链表的头节点。你必须在不修改节点内部的值的情况下完成本题（即，只能进行节点交换）。

![](http://img.topjavaer.cn/img/swap_ex1.jpg)

**示例**

```java
输入：head = [1,2,3,4]
输出：[2,1,4,3]
```

**解题思路**

使用递归实现。

```java
class Solution {
    public ListNode swapPairs(ListNode head) {
        if (head == null) {
            return head;
        }
        ListNode left = head;
        ListNode right = head.next;

        if (right == null) {
            right = left;
        } else {
            left.next = swapPairs(right.next);
            right.next = left;
        }

        return right;
    }
}
```

