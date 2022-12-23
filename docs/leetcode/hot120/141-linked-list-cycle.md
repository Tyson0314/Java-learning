# 141. 环形链表II

[题目链接](https://leetcode.cn/problems/linked-list-cycle-ii/)

**题目描述**

给定一个链表的头节点  head ，返回链表开始入环的第一个节点。 如果链表无环，则返回 null。

如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。 为了表示给定链表中的环，评测系统内部使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。如果 pos 是 -1，则在该链表中没有环。注意：pos 不作为参数进行传递，仅仅是为了标识链表的实际情况。

不允许修改链表。

**示例**

```java
输入：head = [3,2,0,-4], pos = 1
输出：返回索引为 1 的链表节点
解释：链表中有一个环，其尾部连接到第二个节点
```

**解题思路**

方法一：头结点到入环结点的距离为a，入环结点到相遇结点的距离为b，相遇结点到入环结点的距离为c。然后，当fast以slow的两倍速度前进并和slow相遇时，fast走过的距离是s的两倍，即有等式：a+b+c+b = 2(a+b) ，可以得出 a = c ，所以说，让fast和slow分别从相遇结点和头结点同时同步长出发，他们的相遇结点就是入环结点。

```java
public class Solution {
    public ListNode detectCycle(ListNode head) {
        ListNode fast = head;
        ListNode slow = head;

        while (true) {
            if (fast == null || fast.next == null) {
                return null;
            }
            fast = fast.next.next;
            slow = slow.next;
            if (fast == slow) {
                break;
            }
        }

        fast = head;
 
        while (slow != fast) {
            slow = slow.next;
            fast = fast.next;
        }

        return fast;
    }
}
```

方法二：先算出环的大小n，快指针先走n步，然后快慢指针一起走，相遇的地方即是环的入口。

```java
public class Solution {
    public ListNode detectCycle(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;
	    //快慢指针找出环的大小
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (fast == slow) {
                break;
            }
        }

        if (fast == null || fast.next == null) {
            return null;
        }
        
        int cycleSize = 1;
        while (fast.next != slow) {
            cycleSize++;
            fast = fast.next;
        }

        //快慢指针重新从链表首部出发，快指针先走sizeOfCycle步
        //然后两个指针同时一起走，步长为1，相遇节点即是环的入口
        fast = head;
        slow = head;
        while (cycleSize-- > 0) {
            fast = fast.next;
        }
        while (fast != slow) {
            fast = fast.next;
            slow = slow.next;
        }

        return fast;
    }
}
```

