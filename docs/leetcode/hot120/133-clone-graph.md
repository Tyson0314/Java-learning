# 133.克隆图

[题目链接](https://leetcode.cn/problems/clone-graph/)

**题目描述**

给你无向 连通 图中一个节点的引用，请你返回该图的 深拷贝（克隆）。

图中的每个节点都包含它的值 val（int） 和其邻居的列表（list[Node]）。

```java
class Node {
    public int val;
    public List<Node> neighbors;
}
```

示例：

```java
输入：adjList = [[2,4],[1,3],[2,4],[1,3]]
输出：[[2,4],[1,3],[2,4],[1,3]]
解释：
图中有 4 个节点。
节点 1 的值是 1，它有两个邻居：节点 2 和 4 。
节点 2 的值是 2，它有两个邻居：节点 1 和 3 。
节点 3 的值是 3，它有两个邻居：节点 2 和 4 。
节点 4 的值是 4，它有两个邻居：节点 1 和 3 。
```

**解题思路**

深度优先搜索。

```java
class Solution {
    public Node cloneGraph(Node node) {
        Map<Node, Node> lookup = new HashMap<>();
        return dfs(node, lookup);
    }

    private Node dfs(Node node, Map<Node,Node> lookup) {
        if (node == null) return null;
        if (lookup.containsKey(node)) return lookup.get(node);
        Node clone = new Node(node.val, new ArrayList<>());
        lookup.put(node, clone);
        for (Node n : node.neighbors)clone.neighbors.add(dfs(n,lookup));
        return clone;
    }
}
```

广度优先搜索。遍历图的过程，未访问过的节点放入队列。

```java
class Solution {
    public Node cloneGraph(Node node) {
        return bfs(node, new HashMap<Node, Node>());
    }

    private Node bfs(Node root, HashMap<Node, Node> visitedMap) {
        if (root == null) {
            return root;
        }

        Queue<Node> queue = new ArrayDeque<>();
        queue.offer(root);
        Node cloneNode = new Node(root.val, new ArrayList<>());
        visitedMap.put(root, cloneNode);

        while (queue.size() != 0) {
            Node node = queue.poll();

            for (Node n : node.neighbors) {
                Node tmp = visitedMap.get(n);
                if (tmp == null) {
                    queue.offer(n); //未访问过的放入队列
                    tmp = new Node(n.val, new ArrayList<>());
                    visitedMap.put(n, tmp); //标记访问过
                }
                visitedMap.get(node).neighbors.add(tmp);
            }
        }

        return visitedMap.get(root);
    }
}
```

