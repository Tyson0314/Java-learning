# 206. 反转链表

[原题链接](https://leetcode.cn/problems/reverse-linked-list/)

**题目描述**

给你单链表的头节点 `head` ，请你反转链表，并返回反转后的链表。

**示例**

```java
输入：head = [1,2,3,4,5]
输出：[5,4,3,2,1]
```

**解题思路**：

1. 定义两个指针，第一个指针叫 pre，最初是指向 null 的。
2. 第二个指针 cur 指向 head，然后不断遍历 cur。
3. 每次迭代到 cur，都将 cur 的 next 指向 pre，然后 pre 和 cur 前进一位。
4. 都迭代完了(cur 变成 null 了)，pre 就是最后一个节点了。

```java
class Solution {
    public ListNode reverseList(ListNode head) {
        if (head == null) {
            return null;
        }

        ListNode pre = null;
        ListNode cur = head;
        ListNode tmp = null;
        while (cur != null) {
            tmp = cur.next;
            cur.next = pre;
            pre = cur;
            cur = tmp;
        }

        return pre;
    }
}
```

