![](http://img.dabin-coder.cn/image/数据结构与算法.jpg)

## 二叉树的遍历

二叉树是一种非常重要的数据结构，很多其它数据结构都是基于二叉树的基础演变而来的。

二叉树的先序、中序和后序属于深度优先遍历DFS，层次遍历属于广度优先遍历BFS。

![](http://img.dabin-coder.cn/image/前序中序后序.png)

四种主要的遍历思想为：

前序遍历：根结点 ---> 左子树 ---> 右子树

中序遍历：左子树---> 根结点 ---> 右子树

后序遍历：左子树 ---> 右子树 ---> 根结点

层次遍历：只需按层次遍历即可

### 前序遍历

遍历思路：根结点 ---> 左子树 ---> 右子树。

根据前序遍历的顺序，优先访问根结点，然后在访问左子树和右子树。所以，对于任意结点node，第一部分即直接访问之，之后在判断左子树是否为空，不为空时即重复上面的步骤，直到其为空。若为空，则需要访问右子树。注意，在访问过左孩子之后，需要反过来访问其右孩子，可以是栈这种数据结构来支持。对于任意一个结点node，具体步骤如下：

1. 访问结点，并把结点node入栈，当前结点置为左孩子；
2. 判断结点node是否为空，若为空，则取出栈顶结点并出栈，将右孩子置为当前结点；否则重复a)步直到当前结点为空或者栈为空（可以发现栈中的结点就是为了访问右孩子才存储的）

```java

public void preOrderTraverse2(TreeNode root) {
    LinkedList<TreeNode> stack = new LinkedList<>();
    TreeNode pNode = root;
    while (pNode != null || !stack.isEmpty()) {
        if (pNode != null) {
            System.out.print(pNode.val+"  ");
            stack.push(pNode);
            pNode = pNode.left;
        } else { //pNode == null && !stack.isEmpty()
            TreeNode node = stack.pop();
            pNode = node.right;
        }
    }
}
```

### 中序遍历

遍历思路：左子树 ---> 根结点 ---> 右子树

```java
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        Deque<TreeNode> deque = new ArrayDeque<>();

        while (!deque.isEmpty() || root != null) {
            while (root != null) {
                deque.push(root);
                root = root.left;
            }
            root = deque.pop();
            res.add(root.val);
            root = root.right;
        }

        return res;
    }
```

### 后序遍历

遍历思路：左子树 ---> 右子树 ---> 根结点。

使用 null 作为标志位，访问到 null 说明此次递归调用结束。

```java
class Solution {
    public List<Integer> postorderTraversal(TreeNode root) {
        List<Integer> res = new LinkedList<>();
        if (root == null) {
            return res;
        }

        Stack<TreeNode> stack = new Stack<>();
        stack.push(root);
        while (!stack.isEmpty()) {
            root = stack.pop();
            if (root != null) {
                stack.push(root);//最后访问
                stack.push(null);
                if (root.right != null) {
                    stack.push(root.right);
                }
                if (root.left != null) {
                    stack.push(root.left);
                }
            } else { //值为null说明此次递归调用结束，将节点值存进结果
                res.add(stack.pop().val);
            }
        }

        return res;
    }
}
```

### 层序遍历

只需要一个队列即可，先在队列中加入根结点。之后对于任意一个结点来说，在其出队列的时候，访问之。同时如果左孩子和右孩子有不为空的，入队列。

```
public void levelTraverse(TreeNode root) {
		if (root == null) {
			return;
		}
		LinkedList<TreeNode> queue = new LinkedList<>();
		queue.offer(root);
		while (!queue.isEmpty()) {
			TreeNode node = queue.poll();
			System.out.print(node.val+"  ");
			if (node.left != null) {
				queue.offer(node.left);
			}
			if (node.right != null) {
				queue.offer(node.right);
			}
		}
}
```

## 排序算法

常见的排序算法主要有：冒泡排序、插入排序、选择排序、快速排序、归并排序、堆排序、基数排序。各种排序算法的时间空间复杂度、稳定性见下图。

![](http://img.dabin-coder.cn/image/排序算法时间空间复杂度.png)

### 冒泡排序

冒泡排序是一种简单的排序算法。它重复地走访过要排序的数列，一次比较两个元素，如果它们的顺序错误就把它们交换过来。走访数列的工作是重复地进行直到没有再需要交换，也就是说该数列已经排序完成。这个算法的名字由来是因为越小的元素会经由交换慢慢“浮”到数列的顶端。 

思路：

- 比较相邻的元素。如果第一个比第二个大，就交换它们两个；
- 对每一对相邻元素作同样的工作，从开始第一对到结尾的最后一对，这样在最后的元素应该会是最大的数；
- 针对所有的元素重复以上的步骤，除了最后一个；
- 重复步骤1~3，直到排序完成。

代码实现：

```java
public void bubbleSort(int[] arr) {
    if (arr == null) {
        return;
    }
    boolean flag;
    for (int i = arr.length - 1; i > 0; i--) {
        flag = false;
        for (int j = 0; j < i; j++) {
            if (arr[j] > arr[j + 1]) {
                int tmp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = tmp;
                flag = true;
            }
        }
        if (!flag) {
            return;
        }
    }
}
```

### 插入排序

插入排序（Insertion-Sort）的算法描述是一种简单直观的排序算法。它的工作原理是通过构建有序序列，对于未排序数据，在已排序序列中从后向前扫描，找到相应位置并插入。插入排序在实现上，通常采用in-place排序（即只需用到O(1)的额外空间的排序），因而在从后向前扫描过程中，需要反复把已排序元素逐步向后挪位，为最新元素提供插入空间。

算法描述：

一般来说，插入排序都采用in-place在数组上实现。具体算法描述如下：

- 从第一个元素开始，该元素可以认为已经被排序；
- 取出下一个元素，在已经排序的元素序列中从后向前扫描；
- 如果该元素（已排序）大于新元素，将该元素移到下一位置；
- 重复步骤3，直到找到已排序的元素小于或者等于新元素的位置；
- 将新元素插入到该位置后；
- 重复步骤2~5。

代码实现：

```java
public void insertSort(int[] arr) {
    if (arr == null) {
        return;
    }
    for (int i = 1; i < arr.length; i++) {
        int tmp = arr[i];
        int j = i;
        for (; j > 0 && tmp < arr[j - 1]; j--) {
            arr[j] = arr[j - 1];
        }
        arr[j] = tmp;
    }
}
```

### 选择排序

表现**最稳定的排序算法之一**，因为**无论什么数据进去都是O(n2)的时间复杂度**，所以用到它的时候，数据规模越小越好。唯一的好处可能就是不占用额外的内存空间。

选择排序(Selection-sort)是一种简单直观的排序算法。它的工作原理：首先在未排序序列中找到最小（大）元素，存放到排序序列的起始位置，然后，再从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾。以此类推，直到所有元素均排序完毕。 

思路：n个记录的直接选择排序可经过n-1趟直接选择排序得到有序结果。具体算法描述如下：

- 初始状态：无序区为R[1..n]，有序区为空；
- 第i趟排序(i=1,2,3…n-1)开始时，当前有序区和无序区分别为R[1..i-1]和R(i..n）。该趟排序从当前无序区中-选出关键字最小的记录 R[k]，将它与无序区的第1个记录R交换，使R[1..i]和R[i+1..n)分别变为记录个数增加1个的新有序区和记录个数减少1个的新无序区；
- n-1趟结束，数组有序化了。

代码实现：

```java
    public void selectionSort(int[] arr) {
        if (arr == null) {
            return;
        }
        for (int i = 0; i < arr.length - 1; i++) {
            for (int j = i + 1; j < arr.length; j++) {
                if (arr[i] > arr[j]) {
                    int tmp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = tmp;
                }
            }
        }
    }
```

### 希尔排序

希尔排序是希尔（Donald Shell）于1959年提出的一种排序算法。希尔排序也是一种插入排序，它是简单插入排序经过改进之后的一个更高效的版本，也称为缩小增量排序，同时该算法是冲破O(n2）的第一批算法之一。它与插入排序的不同之处在于，它会优先比较距离较远的元素。希尔排序又叫缩小增量排序。

**希尔排序是把记录按下表的一定增量分组，对每组使用直接插入排序算法排序；随着增量逐渐减少，每组包含的关键词越来越多，当增量减至1时，整个文件恰被分成一组，算法便终止。**

代码实现：

```java 
public static int[] ShellSort(int[] array) {
    int len = array.length;
    int temp, gap = len / 2;
    while (gap > 0) {
        for (int i = gap; i < len; i++) {
            temp = array[i];
            int preIndex = i - gap;
            while (preIndex >= 0 && array[preIndex] > temp) {
                array[preIndex + gap] = array[preIndex];
                preIndex -= gap;
            }
            array[preIndex + gap] = temp;
        }
        gap /= 2;
    }
    return array;
}
```

### 基数排序

基数排序也是非比较的排序算法，对每一位进行排序，从最低位开始排序，复杂度为O(kn),为数组长度，k为数组中的数的最大的位数；

基数排序是按照低位先排序，然后收集；再按照高位排序，然后再收集；依次类推，直到最高位。有时候有些属性是有优先级顺序的，先按低优先级排序，再按高优先级排序。最后的次序就是高优先级高的在前，高优先级相同的低优先级高的在前。基数排序基于分别排序，分别收集，所以是稳定的。

算法描述：

- 取得数组中的最大数，并取得位数；
- arr为原始数组，从最低位开始取每个位组成radix数组；
- 对radix进行计数排序（利用计数排序适用于小范围数的特点）；

代码实现：

```java
public static int[] RadixSort(int[] array) {
    if (array == null || array.length < 2)
        return array;
    // 1.先算出最大数的位数；
    int max = array[0];
    for (int i = 1; i < array.length; i++) {
        max = Math.max(max, array[i]);
    }
    int maxDigit = 0;
    while (max != 0) {
        max /= 10;
        maxDigit++;
    }
    int mod = 10, div = 1;
    ArrayList<ArrayList<Integer>> bucketList = new ArrayList<ArrayList<Integer>>();
    for (int i = 0; i < 10; i++)
        bucketList.add(new ArrayList<Integer>());
    for (int i = 0; i < maxDigit; i++, mod *= 10, div *= 10) {
        for (int j = 0; j < array.length; j++) {
            int num = (array[j] % mod) / div;
            bucketList.get(num).add(array[j]);
        }
        int index = 0;
        for (int j = 0; j < bucketList.size(); j++) {
            for (int k = 0; k < bucketList.get(j).size(); k++)
                array[index++] = bucketList.get(j).get(k);
            bucketList.get(j).clear();
        }
    }
    return array;
}
```

### 计数排序

计数排序的核心在于将输入的数据值转化为键存储在额外开辟的数组空间中。 作为一种线性时间复杂度的排序，计数排序要求输入的数据必须是有确定范围的整数。

计数排序(Counting sort)是一种稳定的排序算法。计数排序使用一个额外的数组C，其中第i个元素是待排序数组A中值等于i的元素的个数。然后根据数组C来将A中的元素排到正确的位置。它只能对整数进行排序。

```java
public static int[] CountingSort(int[] array) {
    if (array.length == 0) return array;
    int bias, min = array[0], max = array[0];
    for (int i = 1; i < array.length; i++) {
        if (array[i] > max)
            max = array[i];
        if (array[i] < min)
            min = array[i];
    }
    bias = 0 - min;
    int[] bucket = new int[max - min + 1];
    Arrays.fill(bucket, 0);
    for (int i = 0; i < array.length; i++) {
        bucket[array[i] + bias]++;
    }
    int index = 0, i = 0;
    while (index < array.length) {
        if (bucket[i] != 0) {
            array[index] = i - bias;
            bucket[i]--;
            index++;
        } else
            i++;
    }
    return array;
}
```



### 快速排序

快速排序是由**冒泡排序**改进而得到的，是一种排序执行效率很高的排序算法，它利用**分治法**来对待排序序列进行分治排序，它的思想主要是通过一趟排序将待排记录分隔成独立的两部分，其中的一部分比关键字小，后面一部分比关键字大，然后再对这前后的两部分分别采用这种方式进行排序，通过递归的运算最终达到整个序列有序。

快速排序的过程如下：

1. 在待排序的N个记录中任取一个元素（通常取第一个记录）作为基准，称为基准记录；
2. 定义两个索引 left 和 right 分别表示首索引和尾索引，key 表示基准值；
3. 首先，尾索引向前扫描，直到找到比基准值小的记录，并替换首索引对应的值；
4. 然后，首索引向后扫描，直到找到比基准值大于的记录，并替换尾索引对应的值；
5. 若在扫描过程中首索引等于尾索引(left = right)，则一趟排序结束；将基准值(key)替换首索引所对应的值；
6. 再进行下一趟排序时，待排序列被分成两个区：[0,left-1]和[righ+1,end]
7. 对每一个分区重复以上步骤，直到所有分区中的记录都有序，排序完成

快排为什么比冒泡效率高？

快速排序之所以比较快，是因为相比冒泡排序，每次的交换都是跳跃式的，每次设置一个基准值，将小于基准值的都交换到左边，大于基准值的都交换到右边，这样不会像冒泡一样每次都只交换相邻的两个数，因此比较和交换的此数都变少了，速度自然更高。

快速排序的平均时间复杂度是O(nlgn)，最坏时间复杂度是O(n^2)。

```java
    public void quickSort(int[] arr) {
        if (arr == null) {
            return;
        }
        quickSortHelper(arr, 0, arr.length - 1);
    }
    private void quickSortHelper(int[] arr, int left, int right) {
        if (left > right) {
            return;
        }
        int tmp = arr[left];
        int i = left;
        int j = right;
        while (i < j) {
            //j先走，最终循环终止时，j停留的位置就是arr[left]的正确位置
            //改为i<=j，则会进入死循环，[1,5,5,5,5]->[1] 5 [5,5,5]->[5,5,5]，会死循环
            while (i < j && arr[j] >= tmp) {
                j--;
            }
            while (i < j && arr[i] <= tmp) {
                i++;
            }
            if (i < j) {
                int tmp1 = arr[i];
                arr[i] = arr[j];
                arr[j] = tmp1;
            } else {
                break;
            }
        }

        //当循环终止的时候，i=j，因为是j先走的，j所在位置的值小于arr[left]，交换arr[j]和arr[left]
        arr[left] = arr[j];
        arr[j] = tmp;

        quickSortHelper(arr, left, j - 1);
        quickSortHelper(arr, j + 1, right);
    }
```

### 归并排序

归并排序 (merge sort) 是一类与插入排序、交换排序、选择排序不同的另一种排序方法。归并的含义是将两个或两个以上的有序表合并成一个新的有序表。归并排序有多路归并排序、两路归并排序 ， 可用于内排序，也可以用于外排序。

两路归并排序算法思路是递归处理。每个递归过程涉及三个步骤

- 分解： 把待排序的 n 个元素的序列分解成两个子序列， 每个子序列包括 n/2 个元素
- 治理： 对每个子序列分别调用归并排序MergeSort， 进行递归操作
- 合并： 合并两个排好序的子序列，生成排序结果

![](http://img.dabin-coder.cn/image/20220327151830.png)

时间复杂度：对长度为n的序列，需进行logn次二路归并，每次归并的时间为O(n)，故时间复杂度是O(nlgn)。

空间复杂度：归并排序需要辅助空间来暂存两个有序子序列归并的结果，故其辅助空间复杂度为O(n)

```java
public class MergeSort {
    public void mergeSort(int[] arr) {
        if (arr == null || arr.length == 0) {
            return;
        }
        //辅助数组
        int[] tmpArr = new int[arr.length];
        mergeSort(arr, tmpArr, 0, arr.length - 1);
    }

    private void mergeSort(int[] arr, int[] tmpArr, int left, int right) {
        if (left < right) {
            int mid = (left + right) >> 1;
            mergeSort(arr, tmpArr, left, mid);
            mergeSort(arr, tmpArr, mid + 1, right);
            merge(arr, tmpArr, left, mid, right);
        }
    }

    private void merge(int[] arr, int[] tmpArr, int left, int mid, int right) {
        int i = left;
        int j = mid + 1;
        int tmpIndex = left;
        while (i <= mid && j <= right) {
            if (arr[i] < arr[j]) {
                tmpArr[tmpIndex++] = arr[i];
                i++;
            } else {
                tmpArr[tmpIndex++] = arr[j];
                j++;
            }
        }

        while (i <= mid) {
            tmpArr[tmpIndex++] = arr[i++];
        }

        while (j <= right) {
            tmpArr[tmpIndex++] = arr[j++];
        }

        for (int m = left; m <= right; m++) {
            arr[m] = tmpArr[m];
        }
    }
}
```

### 堆排序

堆是具有下列性质的完全二叉树：每个结点的值都大于或等于其左右孩子结点的值，称为大顶堆；或者每个结点的值都小于或等于其左右孩子结点的值，称为小顶堆。

![](https://img-blog.csdn.net/20150312212515074)

**Top大问题**解决思路：使用一个固定大小的**最小堆**，当堆满后，每次添加数据的时候与堆顶元素比较，若小于堆顶元素，则舍弃，若大于堆顶元素，则删除堆顶元素，添加新增元素，对堆进行重新排序。

对于n个数，取Top m个数，时间复杂度为O(nlogm)，这样在n较大情况下，是优于nlogn（其他排序算法）的时间复杂度的。

PriorityQueue 是一种基于优先级堆的优先级队列。每次从队列中取出的是具有最高优先权的元素。如果不提供Comparator的话，优先队列中元素默认按自然顺序排列，也就是数字默认是小的在队列头。优先级队列用数组实现，但是数组大小可以动态增加，容量无限。

```java
//找出前k个最大数，采用小顶堆实现
public static int[] findKMax(int[] nums, int k) {
    PriorityQueue<Integer> pq = new PriorityQueue<>(k);//队列默认自然顺序排列，小顶堆，不必重写compare

    for (int num : nums) {
        if (pq.size() < k) {
            pq.offer(num);
        } else if (pq.peek() < num) {//如果堆顶元素 < 新数，则删除堆顶，加入新数入堆
            pq.poll();
            pq.offer(num);
        }
    }

    int[] result = new int[k];
    for (int i = 0; i < k&&!pq.isEmpty(); i++) {
        result[i] = pq.poll();
    }
    return result;
}
```



## 动态规划

动态规划常常适用于有重叠子问题的问题。动态规划的基本思想：若要解一个给定问题，我们需要解其不同部分（即子问题），再根据子问题的解以得出原问题的解。

动态规划法试图仅仅解决每个子问题一次，一旦某个给定子问题的解已经算出，则将其记忆化存储，以便下次遇到同一个子问题的时候直接查表得到解。

动态规划的解题思路：1、状态定义；2、状态转移方程；3、初始状态。

### 不同路径

[不同路径](/leetcode/unique-paths.md)

### 最长回文子串

从给定的字符串 `s` 中找到最长的回文子串的长度。

例如 `s = "babbad"` 的最长回文子串是 `"abba"` ，长度是 `4` 。

解题思路：

1. 定义状态。`dp[i][j]` 表示子串 `s[i..j]` 是否为回文子串

2. 状态转移方程：`dp[i][j] = (s[i] == s[j]) and dp[i + 1][j - 1]`
3. 初始化的时候，单个字符一定是回文串，因此把对角线先初始化为 `true`，即 `dp[i][i] = true` 。
4. 只要一得到 `dp[i][j] = true`，就记录子串的长度和起始位置

注意事项：总是先得到小子串的回文判定，然后大子串才能参考小子串的判断结果，即填表顺序很重要。

![](http://img.dabin-coder.cn/image/image-20201115230411764.png)

时间复杂度O(N2)，空间复杂度O(N2)，因为使用了二维数组。

```java
public class Solution {

    public String longestPalindrome(String s) {
        // 特判
        int len = s.length();
        if (len < 2) {
            return s;
        }

        int maxLen = 1;
        int begin = 0;

        // dp[i][j] 表示 s[i, j] 是否是回文串
        boolean[][] dp = new boolean[len][len];
        char[] charArray = s.toCharArray();

        for (int i = 0; i < len; i++) {
            dp[i][i] = true;
        }
        for (int j = 1; j < len; j++) {
            for (int i = 0; i < j; i++) {
                if (charArray[i] != charArray[j]) {
                    dp[i][j] = false;
                } else {
                    if (j - i < 3) {
                        dp[i][j] = true;
                    } else {
                        dp[i][j] = dp[i + 1][j - 1];
                    }
                }

                // 只要 dp[i][j] == true 成立，就表示子串 s[i..j] 是回文，此时记录回文长度和起始位置
                if (dp[i][j] && j - i + 1 > maxLen) {
                    maxLen = j - i + 1;
                    begin = i;
                }
            }
        }
        return s.substring(begin, begin + maxLen); //substring(i, j)截取i到j(不包含j)的字符串
    }
}
```



### 最大子数组和

**题目描述**：给你一个整数数组 `nums` ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

**示例**：

```java
输入： nums = [-2,1,-3,4,-1,2,1,-5,4]
输出： 6
解释： 连续子数组 [4,-1,2,1] 的和最大，为 6 。
```

1、首先确定dp数组（dp table）以及下标的含义。

dp[i]表示以nums[i]结尾的子数组的最大和。

2、确定递推公式。

`dp[i] = dp[i - 1] > 0 ? ( dp[i - 1]  + nums[i]) : nums[i]`

dp[i+1]取决于dp[i]的值，不需要使用数组保存状态，只需要一个变量sum来保存上一个状态即可。

3、dp数组如何初始化。

从递推公式可以看出来dp[i]是依赖于dp[i - 1]的状态，dp[0]就是递推公式的基础。

dp[0]应该是多少呢？根据dp[i]的定义，很明显dp[0]应为nums[0]即dp[0] = nums[0]。

示例代码如下：

```java
class Solution {
    public int maxSubArray(int[] nums) {
        if (nums == null || nums.length == 0) {
            return 0;
        }

        int max = nums[0];
        int sum = 0;

        for (int num : nums) {
            if (sum > 0) {
                sum += num;
            } else {
                sum = num;
            }
            max = Math.max(max, sum);
        }

        return max;
    }
}
```

### 最长公共子序列

一个字符串的 子序列 是指这样一个新的字符串：它是由原字符串在不改变字符的相对顺序的情况下删除某些字符（也可以不删除任何字符）后组成的新字符串。
例如，"ace" 是 "abcde" 的子序列，但 "aec" 不是 "abcde" 的子序列。

动态规划。`dp[i][j]`表示text1以i-1结尾的子串和text2以j-1结尾的子串的最长公共子序列的长度。dp横坐标或纵坐标为0表示空字符串，`dp[0][j] = dp[i][0] = 0`，无需额外处理base case。

![](http://img.dabin-coder.cn/image/longestCommonSubsequence.png)

```java
class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        char[] arr1 = text1.toCharArray();
        char[] arr2 = text2.toCharArray();
        //dp[0][x]和dp[x][0]表示有一个为空字符串
        //dp[1][1]为text1第一个字符和text2第一个字符的最长公共子序列的长度
        //dp[i][j]表示text1以i-1结尾的子串和text2以j-1结尾的子串的最长公共子序列的长度
        int len1 = arr1.length;
        int len2 = arr2.length;
        int[][] dp = new int[len1 + 1][len2 + 1];

        for (int i = 1; i < len1 + 1; i++) {
            for (int j = 1; j < len2 + 1; j++) {
                if (arr1[i - 1] == arr2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }

        return dp[len1][len2];
    }
}
```

`dp[i][j]`表示text1以i结尾的子串和text2以j结尾的子串的最长公共子序列的长度。需要处理base case。

```java
class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        char[] arr1 = text1.toCharArray();
        char[] arr2 = text2.toCharArray();

        int len1 = arr1.length;
        int len2 = arr2.length;
        //`dp[i][j]`表示text1以i结尾的子串和text2以j结尾的子串的最长公共子序列的长度。
        int[][] dp = new int[len1][len2];

        if (arr1[0] == arr2[0]) {
            dp[0][0] = 1;
        }
        for (int i = 1; i < len1; i++) {
            if (arr1[i] == arr2[0]) {
                dp[i][0] = 1;
            } else {
                dp[i][0] = dp[i - 1][0];
            }
        }
        for (int i = 1; i < len2; i++) {
            if (arr1[0] == arr2[i]) {
                dp[0][i] = 1;
            } else {
                dp[0][i] = dp[0][i - 1];
            }
        }

        for (int i = 1; i < len1; i++) {
            for (int j = 1; j < len2; j++) {
                if (arr1[i] == arr2[j]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }

        return dp[len1 - 1][len2 - 1];
    }
}
```



### 接雨水

给定 `n` 个非负整数表示每个宽度为 `1` 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。

![](http://img.dabin-coder.cn/image/接雨水.png)

示例：

```java
输入：height = [0,1,0,2,1,0,1,3,2,1,2,1]
输出：6
解释：上面是由数组 [0,1,0,2,1,0,1,3,2,1,2,1] 表示的高度图，在这种情况下，可以接 6 个单位的雨水（蓝色部分表示雨水）。 
```

动态规划，使用两个数组空间。leftMax[i] 代表第 `i` 列左边（不包含自身）最高的墙的高度，rightMax[i] 代表第 `i` 列右边最高的墙的高度。

```java
class Solution {
    public int trap(int[] height) {
        int len = height.length;
        int res = 0;
        int[] leftMax = new int[len];
        int[] rightMax = new int[len];

        for (int i = 1; i < len; i++) {
            leftMax[i] = Math.max(leftMax[i - 1], height[i - 1]);
        }
        
        for (int j = len - 2; j > 0; j--) {
            rightMax[j] = Math.max(rightMax[j + 1], height[j + 1]);
        }

        for (int i = 1; i < len - 1; i++) {
            int min = Math.min(leftMax[i], rightMax[i]);
            if (min > height[i]) {
                res += min - height[i];
            }
        }

        return res;
    }
}
```



### 单词拆分

![](http://img.dabin-coder.cn/image/word-break.png)

```java
class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        int len = s.length(), maxw = 0;
        //dp[i]表示前i个字母组成的字符串是否可以被拆分
        boolean[] dp = new boolean[len + 1];
        //状态转移方程初始化条件
        dp[0] = true;
        Set<String> set = new HashSet();
        for(String str : wordDict){
            set.add(str);
            maxw = Math.max(maxw, str.length());
        }
        for(int i = 1; i < len + 1; i++){
            for(int j = i; j >= 0 && j >= i - maxw; j--){
                if(dp[j] && set.contains(s.substring(j, i))){
                    dp[i] = true;
                    break;
                }
            }
        }
        return dp[len];
    }
}
```

## 回溯算法

回溯算法的基本思想是：从一条路往前走，能进则进，不能进则退回来，换一条路再试。

### 组合总和

题目描述：给定一个**无重复元素**的数组 `candidates` 和一个目标数 `target` ，找出 `candidates` 中所有可以使数字和为 `target` 的组合。

示例：

```
输入：candidates = [2,3,6,7], target = 7,
输出：
[
  [7],
  [2,2,3]
]
```

使用回溯算法。

```java
class Solution {
    private List<List<Integer>> ans = new ArrayList<>();
    public List<List<Integer>> combinationSum2(int[] candidates, int target) {
        if (candidates == null || candidates.length == 0) {
            return ans;
        }
        Arrays.sort(candidates);//排序方便回溯剪枝
        Deque<Integer> path = new ArrayDeque<>();//作为栈来使用，效率高于Stack；也可以作为队列来使用，效率高于LinkedList；线程不安全
        combinationSum2Helper(candidates, target, 0, path);
        return ans;
    }

    public void combinationSum2Helper(int[] arr, int target, int start, Deque<Integer> path) {
        if (target == 0) {
            ans.add(new ArrayList(path));
        }

        for (int i = start; i < arr.length; i++) {
            if (target < arr[i]) {//剪枝
                return;
            }
            if (i > start && arr[i] == arr[i - 1]) {//在一个层级，会产生重复
                continue;
            }
            path.addLast(arr[i]);
            combinationSum2Helper(arr, target - arr[i], i + 1, path);
            path.removeLast();
        }
    }
}
```



### 全排列

给定一个 **没有重复** 数字的序列，返回其所有可能的全排列。

示例：

```
输入: [1,2,3]
输出:
[
  [1,2,3],
  [1,3,2],
  [2,1,3],
  [2,3,1],
  [3,1,2],
  [3,2,1]
]
```

使用回溯。注意与组合总和的区别（数字有无顺序）。

```java
class Solution {
    private List<List<Integer>> ans = new ArrayList<>();
    public List<List<Integer>> permute(int[] nums) {
        boolean[] flag = new boolean[nums.length];
        ArrayDeque<Integer> path = new ArrayDeque<>();
        permuteHelper(nums, flag, path);

        return ans;
    }

    private void permuteHelper(int[] nums, boolean[] flag, ArrayDeque<Integer> path) {
        if (path.size() == nums.length) {
            ans.add(new ArrayList<>(path));
            return;
        }
        for (int i = 0; i < nums.length; i++) {
            if (flag[i]) {
                continue;//继续循环
            }
            path.addLast(nums[i]);
            flag[i] = true;
            permuteHelper(nums, flag, path);
            path.removeLast();
            flag[i] = false;
        }
    }
}
```



### 全排列II

给定一个可包含重复数字的序列，返回所有不重复的全排列。注意与组合总和的区别。

1、排序；2、同一层级相同元素剪枝。

![](http://img.dabin-coder.cn/image/permutations-ii.png)

```java
class Solution {
    private List<List<Integer>> ans = new ArrayList<>();
    public List<List<Integer>> permuteUnique(int[] nums) {
        if (nums == null || nums.length == 0) {
            return ans;
        }
        ArrayDeque<Integer> path = new ArrayDeque<>();
        boolean[] used = new boolean[nums.length];
        Arrays.sort(nums);//切记
        dps(nums, used, path);

        return ans;
    }

    private void dps(int[] nums, boolean[] used, ArrayDeque<Integer> path) {
        if (path.size() == nums.length) {
            ans.add(new ArrayList<>(path));
            return;
        }
        for (int i = 0; i < nums.length; i++) {
            if (used[i]) {
                continue;
            }
            if ((i > 0 && nums[i] == nums[i - 1]) && !used[i - 1]) {//同一层相同的元素，剪枝
                continue;//继续循环，不是return退出循环
            }
            path.addLast(nums[i]);
            used[i] = true;
            dps(nums, used, path);
            path.removeLast();
            used[i] = false;
        }
    }
}
```

## 贪心算法

贪心算法，是寻找**最优解问题**的常用方法，这种方法模式一般将求解过程分成**若干个步骤**，但每个步骤都应用贪心原则，选取当前状态下**最好/最优的选择**（局部最有利的选择），并以此希望最后堆叠出的结果也是最好/最优的解。

**贪婪法的基本步骤：**

1. 从某个初始解出发；
2. 采用迭代的过程，当可以向目标前进一步时，就根据局部最优策略，得到一部分解，缩小问题规模；
3. 将所有解综合起来。

### 买卖股票的最佳时机 II

**题目描述**：

给你一个整数数组 prices ，其中 prices[i] 表示某支股票第 i 天的价格。

在每一天，你可以决定是否购买和/或出售股票。你在任何时候 最多 只能持有 一股 股票。你也可以先购买，然后在 同一天 出售。

返回 你能获得的 最大 利润 。

**示例**：

```java
输入：prices = [1,2,3,4,5]
输出：4
解释：在第 1 天（股票价格 = 1）的时候买入，在第 5 天 （股票价格 = 5）的时候卖出, 这笔交易所能获得利润 = 5 - 1 = 4 。
     总利润为 4 。
```

思路：可以尽可能地完成更多的交易，但不能同时参与多笔交易（你必须在再次购买前出售掉之前的股票）。

```java
//输入: [7,1,5,3,6,4]
//输出: 7
class Solution {
    public int maxProfit(int[] prices) {
        int profit = 0;
        for (int i = 1; i < prices.length; i++) {
            int tmp = prices[i] - prices[i - 1];
            if (tmp > 0) {
                profit += tmp;
            }
        }

        return profit;
    }
}
```

### 跳跃游戏

**题目描述**

给定一个非负整数数组 `nums` ，你最初位于数组的 **第一个下标** 。

数组中的每个元素代表你在该位置可以跳跃的最大长度。

判断你是否能够到达最后一个下标。

**示例**：

```java
输入：nums = [2,3,1,1,4]
输出：true
解释：可以先跳 1 步，从下标 0 到达下标 1, 然后再从下标 1 跳 3 步到达最后一个下标。
```

解题思路：

1. 如果某一个作为 起跳点 的格子可以跳跃的距离是 3，那么表示后面 3 个格子都可以作为 起跳点
2. 可以对每一个能作为 起跳点 的格子都尝试跳一次，把 能跳到最远的距离 不断更新
3. 如果可以一直跳到最后，就成功了

```java
class Solution {
    public boolean canJump(int[] nums) {
        if (nums == null || nums.length == 0) {
            return true;
        }

        int maxIndex = nums[0];
        for (int i = 1; i < nums.length; i++) {
            if (maxIndex >= i) {
                maxIndex = Math.max(maxIndex, i + nums[i]);
            } else {
                return false;
            }
        }

        return true;
    }
}
```

### 加油站

**题目描述**

在一条环路上有 n 个加油站，其中第 i 个加油站有汽油 gas[i] 升。

你有一辆油箱容量无限的的汽车，从第 i 个加油站开往第 i+1 个加油站需要消耗汽油 cost[i] 升。你从其中的一个加油站出发，开始时油箱为空。

给定两个整数数组 gas 和 cost ，如果你可以绕环路行驶一周，则返回出发时加油站的编号，否则返回 -1 。如果存在解，则 保证 它是 唯一 的。

**示例**

```java
输入: gas = [1,2,3,4,5], cost = [3,4,5,1,2]
输出: 3
解释:
从 3 号加油站(索引为 3 处)出发，可获得 4 升汽油。此时油箱有 = 0 + 4 = 4 升汽油
开往 4 号加油站，此时油箱有 4 - 1 + 5 = 8 升汽油
开往 0 号加油站，此时油箱有 8 - 2 + 1 = 7 升汽油
开往 1 号加油站，此时油箱有 7 - 3 + 2 = 6 升汽油
开往 2 号加油站，此时油箱有 6 - 4 + 3 = 5 升汽油
开往 3 号加油站，你需要消耗 5 升汽油，正好足够你返回到 3 号加油站。
因此，3 可为起始索引。
```

**思路**：

1. 遍历一周，总获得的油量少于要花掉的油量必然没有结果；
2. 先苦后甜，记录遍历时所存的油量最少的站点，由于题目有解只有唯一解，所以从当前站点的下一个站点开始是唯一可能成功开完全程的。

```java
class Solution {
    public int canCompleteCircuit(int[] gas, int[] cost) {
        int minIdx=0;
        int sum=Integer.MAX_VALUE;
        int num=0;
        for (int i = 0; i < gas.length; i++) {
            num+=gas[i]-cost[i];
            if(num<sum){
                sum=num;
                minIdx=i;
            }
        }
        return num<0?-1:(minIdx+1)%gas.length;
    }
}
```

## 双指针

### 反转链表

**题目描述**

给你单链表的头节点 `head` ，请你反转链表，并返回反转后的链表。

**示例**

```java
输入：head = [1,2,3,4,5]
输出：[5,4,3,2,1]
```

思路：

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



### 反转链表II

**题目描述**

给你单链表的头指针 head 和两个整数 left 和 right ，其中 left <= right 。请你反转从位置 left 到位置 right 的链表节点，返回 反转后的链表 。

**示例**

```java
输入：head = [1,2,3,4,5], left = 2, right = 4
输出：[1,4,3,2,5]
```

**思路**：双指针+头插法。

```java
class Solution {
    public ListNode reverseBetween(ListNode head, int m, int n) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode pre = dummy;
        for (int i = 1; i < m; i++) {
            pre = pre.next;
        }
        head = pre.next;
        for (int i = m; i < n; i++) {
            ListNode cur = head.next;
            head.next = cur.next;
            cur.next = pre.next;
            pre.next = cur;
        }

        return dummy.next;
    }
}
```

### 删除链表倒数第n个节点

**题目描述**

给你一个链表，删除链表的倒数第 `n` 个结点，并且返回链表的头结点。

**示例**

```java
输入：head = [1,2,3,4,5], n = 2
输出：[1,2,3,5]
```

思路：使用快慢指针，快指针先走n步。

```java
class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode tmp = new ListNode(0); //技巧
        tmp.next = head;

        ListNode fast = tmp;
        ListNode slow = tmp;

        while (n-- > 0) {
            fast = fast.next;
        }

        while (fast.next != null) {
            fast = fast.next;
            slow = slow.next;
        }
        slow.next = slow.next.next;

        return tmp.next;
    }
}
```

### 三数之和

[题目链接](https://leetcode.cn/problems/3sum/)

**题目描述**

给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？请你找出所有和为 0 且不重复的三元组。

注意：答案中不可以包含重复的三元组。

**示例**

```java
输入：nums = [-1,0,1,2,-1,-4]
输出：[[-1,-1,2],[-1,0,1]]
```

**思路**：

- 首先对数组进行排序，排序后固定一个数 nums[i]nums[i]，再使用左右指针指向 nums[i]nums[i]后面的两端，数字分别为 nums[L]nums[L] 和
- nums[R]nums[R]，计算三个数的和 sumsum 判断是否满足为 00，满足则添加进结果集
- 如果 nums[i]nums[i]大于 00，则三数之和必然无法等于 00，结束循环
- 如果 nums[i]nums[i] == nums[i-1]nums[i−1]，则说明该数字重复，会导致结果重复，所以应该跳过
- 当 sumsum == 00 时，nums[L]nums[L] == nums[L+1]nums[L+1] 则会导致结果重复，应该跳过，L++L++
- 当 sumsum == 00 时，nums[R]nums[R] == nums[R-1]nums[R−1] 则会导致结果重复，应该跳过，R--R−−

**参考代码**：

```java
class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        Arrays.sort(nums);

        for (int i = 0; i < nums.length; i++) {
            if (nums[i] > 0) { //最左边的数字大于0，则sum不会等于0，退出
                break;
            }
            if (i > 0 && nums[i] == nums[i - 1]) { //去重复
                continue;
            }

            int left = i + 1;
            int right = nums.length - 1;

            while (left < right) {
                int sum = nums[i] + nums[left] + nums[right];
                if (sum == 0) {
                    res.add(Arrays.asList(nums[i], nums[left], nums[right])); ///array to list
                    while (left < right && nums[left] == nums[left + 1]) {
                        left++;
                    }
                    while (left < right && nums[right] == nums[right - 1]) {
                        right--;
                    }
                    left++;
                    right--;
                } else if (sum > 0) {
                    right--;
                } else {
                    left++;
                }
            }
        }

        return res;
    }
}
```

### 环形链表

[题目链接](https://leetcode.cn/problems/linked-list-cycle/)

**题目描述**

给你一个链表的头节点 head ，判断链表中是否有环。

如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。 为了表示给定链表中的环，评测系统内部使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。注意：pos 不作为参数进行传递 。仅仅是为了标识链表的实际情况。

如果链表中存在环 ，则返回 true 。 否则，返回 false 。

**示例**

```java
输入：head = [3,2,0,-4], pos = 1
输出：true
解释：链表中有一个环，其尾部连接到第二个节点。
```

**思路**

快慢指针。快指针每次走两步，慢指针走一步，相当于慢指针不动，快指针每次走一步，如果是环形链表，则一定会相遇。

```java
public class Solution {
    public boolean hasCycle(ListNode head) {
        if (head == null) {
            return false;
        }

        ListNode quick = head;
        ListNode slow = head;

        while (quick != null && quick.next != null) {
            slow = slow.next;
            quick = quick.next.next;
            
            if (slow == quick) {
                return true;
            }
        }

        return false;
    }
}
```

### 环形链表II

[题目链接](https://leetcode.cn/problems/linked-list-cycle-ii/)

**题目描述**

给定一个链表的头节点  head ，返回链表开始入环的第一个节点。 如果链表无环，则返回 null。

如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。 为了表示给定链表中的环，评测系统内部使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。如果 pos 是 -1，则在该链表中没有环。注意：pos 不作为参数进行传递，仅仅是为了标识链表的实际情况。

不允许修改 链表。

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

