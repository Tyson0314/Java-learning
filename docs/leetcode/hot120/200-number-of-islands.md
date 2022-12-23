# 200. 岛屿数量

[题目链接](https://leetcode.cn/problems/number-of-islands/)

**题目描述**

给你一个由 '1'（陆地）和 '0'（水）组成的的二维网格，请你计算网格中岛屿的数量。

岛屿总是被水包围，并且每座岛屿只能由水平方向和/或竖直方向上相邻的陆地连接形成。

此外，你可以假设该网格的四条边均被水包围。

**示例**

```java
输入：grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]
输出：1
```

**解题思路**

深度优先遍历，使用isVisited数组记录元素是否被访问过。

```java
class Solution {
    public int numIslands(char[][] grid) {
        if (grid == null || grid.length == 0 || grid[0].length == 0) {
            return 0;
        }

        boolean[][] isVisited = new boolean[grid.length][grid[0].length];
        int count = 0;
        
        for (int i = 0; i < grid.length; i++) {
            for (int j = 0; j < grid[0].length; j++) {
                if (grid[i][j] == '1' && !isVisited[i][j]) {
                    dfs(grid, isVisited, i, j);
                    count++;
                }
            }
        }

        return count;
    }

    private void dfs(char[][] grid, boolean[][] isVisited, int i, int j) {
        if (i < 0 || i >= grid.length || j < 0 || j >= grid[0].length || grid[i][j] == '0') {
            return;
        }
        if (!isVisited[i][j]) {
            isVisited[i][j] = true;
            dfs(grid, isVisited, i + 1, j);
            dfs(grid, isVisited, i - 1, j);
            dfs(grid, isVisited, i, j + 1);
            dfs(grid, isVisited, i, j - 1);
        }
    }
}
```

