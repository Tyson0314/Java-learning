# 19. 删除链表的倒数第 N 个结点

[原题链接](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/)

**题目描述**

给你一个链表，删除链表的倒数第 `n` 个结点，并且返回链表的头结点。

**示例**

```java
输入：head = [1,2,3,4,5], n = 2
输出：[1,2,3,5]
```

**解题思路**

我们可以设想假设设定了双指针 p 和 q 的话，当 q 指向末尾的 NULL，p 与 q 之间相隔的元素个数为 n 时，那么删除掉 p 的下一个指针就完成了要求。

- 设置虚拟节点 dummyHead 指向 head
- 设定双指针 p 和 q，初始都指向虚拟节点 dummyHead
- 移动 q，直到 p 与 q 之间相隔的元素个数为 n
- 同时移动 p 与 q，直到 q 指向的为 NULL
- 将 p 的下一个节点指向下下个节点

![](http://img.topjavaer.cn/img/删除链表nth.gif)

> 作者：cxywushixiong
> 链接：https://leetcode.cn/problems/remove-nth-node-from-end-of-list/solution/dong-hua-tu-jie-leetcode-di-19-hao-wen-ti-shan-chu/
> 来源：力扣（LeetCode）

**代码实现**

```java
class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(-1);
        dummy.next = head;
        ListNode pre = dummy;
        ListNode slow = head;
        ListNode fast = head;
        for(int i=0;i<n;i++){
            fast = fast.next;
        }
        while(fast!=null){
            pre = pre.next;
            slow = slow.next;
            fast = fast.next;
        }
        pre.next = slow.next;
        return dummy.next;
    }
}
```

