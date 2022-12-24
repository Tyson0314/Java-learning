# 40. 组合总和 II

[40. 组合总和 II](https://leetcode.cn/problems/combination-sum-ii/)

**题目描述**

给定一个候选人编号的集合 candidates 和一个目标数 target ，找出 candidates 中所有可以使数字和为 target 的组合。

candidates 中的每个数字在每个组合中只能使用 一次 。

注意：解集不能包含重复的组合。 

**示例**：

```
输入: candidates = [2,5,2,1,2], target = 5,
输出:
[
[1,2,2],
[5]
]
```

**解题思路**

数组元素可能重复。使用回溯算法。

剪枝：

![](http://img.topjavaer.cn/img/1587051935261.png)

去重复组合：

![](http://img.topjavaer.cn/img/1587050948930.png)

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

