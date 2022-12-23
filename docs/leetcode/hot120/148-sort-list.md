# 148. 排序链表

[148. 排序链表](https://leetcode.cn/problems/sort-list/)

**题目描述**

给你链表的头结点 `head` ，请将其按 **升序** 排列并返回 **排序后的链表** 。

**示例**

```java
输入：head = [4,2,1,3]
输出：[1,2,3,4]
```

**解题思路**

1、归并排序。

```java
//输入: 4->2->1->3
//输出: 1->2->3->4
class Solution {
    public ListNode sortList(ListNode head) {
        return mergeSort(head);
    }

    public ListNode mergeSort(ListNode head) {
        if (head == null || head.next == null) {
            return head;
        }

        ListNode fast = head, slow = head;
        while (fast != null && fast.next != null && fast.next.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        ListNode rHead = slow.next;
        slow.next = null; //断开链表

        ListNode l = mergeSort(head);
        ListNode r = mergeSort(rHead);

        return merge(l, r);
    }

    public ListNode merge(ListNode l, ListNode r) {
        ListNode tmp = new ListNode(0);
        ListNode cur = tmp;

        while (l != null && r != null) {
            if (l.val > r.val) {
                cur.next = r;
                r = r.next;
            } else {
                cur.next = l;
                l = l.next;
            }
            cur = cur.next;
        }

        cur.next = l == null ? r : l;

        return tmp.next;
    }
}
```

[排序链表快速排序](https://www.cnblogs.com/morethink/p/8452914.html)

![](http://img.topjavaer.cn/image/sort-list.png)

```java
//快速排序
//链表头结点作为基准值key。使用两个指针p1和p2，这两个指针均往next方向移动，移动的过程中保持p1之前的key都小于选定的key，p1和p2之间的key都大于选定的key，那么当p2走到末尾时交换p1与key值便完成了一次切分。
class Solution {
    public ListNode sortList(ListNode head) {
        return quickSort(head, null);
    }

    private ListNode quickSort(ListNode head, ListNode tail) {
        if (head != tail) {
            ListNode node = quickSortHelper(head, tail);
            quickSort(head, node);
            quickSort(node.next, tail);
        }
        return head;
    }

    private ListNode quickSortHelper(ListNode head, ListNode tail) {
        ListNode p1 = head, p2 = head.next;
        while (p2 != tail) {
            if (p2.val < head.val) {
                p1 = p1.next;
                int tmp = p1.val;
                p1.val = p2.val;
                p2.val = tmp;
            }
            p2 = p2.next;
        }

        if (p1 != head) {
            int tmp = p1.val;
            p1.val = head.val;
            head.val = tmp;
        }

        return p1;
    }
}
```

