# Git 基础

## 获取 Git 仓库

在现有目录中初始化仓库：进入项目目录并输入`git init`

克隆现有的仓库：

```bash
git clone https://github.com/...
```

## 文件状态

查看文件状态：`git status`

![](http://img.dabin-coder.cn/image/git生命周期.png)

> 图片来源：`https://img2018.cnblogs.com/blog/1252910/201907/1252910-20190726163854195-886320537.png`

**状态说明：**

新添加的未跟踪文件前面有 ?? 标记，新添加到暂存区中的文件前面有 A 标记，修改过的文件前面有 M 标记，如下图，`MM Rakefile`出现两个M，其中出现在靠左边的 M 表示该文件被修改了并放入了暂存区，出现在右边的 M 表示该文件被修改了但是还没放入暂存区。

```bash
$ git status -s
 M README # 右边的 M 表示该文件被修改了但是还没放入暂存区
MM Rakefile # 左边的 M 表示该文件被修改了并放入了暂存区；右边的 M 表示该文件被修改了但是还没放入暂存区
A lib/git.rb # A表示新添加到暂存区中的文件
?? LICENSE.txt # ??表示新添加的未跟踪文件
```

## 配置别名

有些人可能经常敲错命令，通过配置别名可以简化命令：

通过命令 `git config --global alias.st status ` 将 命令`git status` 简化为 `git st`：

```bash
$ git config --global alias.st status

$ git st
On branch master
Your branch is up to date with 'origin/master'.

nothing to commit, working tree clean
```


## 工作区

查看工作区修改：`git diff`

```bash
$ git diff
diff --git a/md/leetcode刷题笔记.md b/md/leetcode刷题笔记.md
deleted file mode 100644
index 63a7c90..0000000
--- a/md/leetcode刷题笔记.md
+++ /dev/null
```

撤销工作区修改：

```bash
git checkout -- file_name
```

此命令会撤销工作区的修改，不可恢复，不会撤销暂存区修改。

撤销修改还可以使用 restore 命令（git2.23版本引入）。

```java
git restore --worktree demo.txt //撤销文件工作区的修改
git restore --staged demo.txt //撤销暂存区的修改，将文件状态恢复到未add之前
git restore -s HEAD~1 demo.txt //将当前工作区切换到上个 commit 版本，-s相当于--source
git restore -s hadn12 demo.txt //将当前工作区切换到指定 commit id 的版本
```


## 暂存区

通过`git add filename` 将工作区的文件放到暂存区。

```bash
git add README.md
```

查看暂存区修改：

```bash
$ git diff --staged
diff --git a/README.md b/README.md
index ecd6c7a..653f001 100644
--- a/README.md
+++ b/README.md
```

可以看到暂存区中有 README.md 文件，说明README.md文件被放到了暂存区。

撤销暂存区修改使用unstage：

```bash
git reset HEAD file_name
```

将文件修改移出暂存区，放到工作区。

**git reset 加上 --hard 选项会导致工作目录中所有修改丢失。**

## 提交

任何未提交的修改丢失后很可能不可恢复。提交命令：

```bash
git commit -m "add readme.md"
```

`git commit -a -m "xxx"` 相当于`git add`和`git commit -m "xxx"`，将 tracked 的文件直接提交。untracked 的文件无法使用此命令直接提交，需先执行 git add 命令，再执行 git commit。

单独执行`git commit`，不带上-m参数，会进入 vim 编辑器界面：

![](http://img.dabin-coder.cn/image/image-20210830225020753.png)

此时应该这么操作：

1. 按下字母键`i`或`a`或`o`，进入到可编辑状态
2. 输入commit信息之后，按下`Esc`键就可退出编辑状态，回到一般模式
3. 输入:wq （保存退出）或 :wq!（强行退出，不保存）

### 修改commit信息

如果提交后发现漏掉某些文件或者提交信息写错，使用`git commit --amend`重新提交：

```bash
git commit -m 'initial commit'
git add forgotten_file
git commit --amend
```


### 查看提交历史

`git log`列出所有提交的更新。

`git log -p -2`，-p 用来显示每次提交的内容差异，-2表示显示最近两次提交。

`git log --stat`每次提交下面都会列出所有被修改的文件、有多少文件被修改和哪些行被修改等。

`git log --pretty=oneline`将每个提交放在一行显示。

`git log --pretty=format:"%h %s" --graph` format 表示格式化输出，%h 提交对象的简短哈希串，%s 是提交说明，--graph 可以更形象的展示分支、合并历史。

```bash
$ git log --pretty=format:"%h %s" --graph
* 75f8b36 update
* cd72e4f 删除查询性能优化
* 6bddc95 MySQL总结整理
* f8ace0e java常见关键字总结
* 0c4efeb 删除android
* 4844de5 mysql执行计划
* 635c140 redis分布式锁
* 7b65bc3 update
* e563eec update
* 67e1cf7 update readme
* 218f353 调整目录结构
* 9428314 整理Java基础内容
```

`git log --since=2.weeks` 按照时间作限制。

## 版本回退

版本回退使用`git reset`命令。

```bash
git reset --hard commit_id
git reset --hard HEAD^ # 回退所有内容到上一个版本
git reset --hard HEAD^^ # 回退所有内容到上上一个版本
git reset --hard HEAD~100 # 回退到之前第100个版本  
git reset HEAD readme.txt  # 把暂存区的修改撤销掉（unstage）, 重新放到工作区 
```

## stash

将未提交的修改保存起来。用于后续恢复当前工作目录。

```bash
git stash
git stash pop stash@{id} //恢复后删除
git stash apply stash@{id}  //恢复后不删除，需手动删除
git stage drop
git stash list //查看stash 列表
git stash show -p stash@{0} //查看stash具体内容，-p查看diff，stash@{0}可以省略
```

## rm和mv

`git rm readme.md`：文件未被修改过，从暂存区移除文件，然后提交，相当于 `rm readme.md`和`git add .`。如果只是简单地从工作目录中手工删除文件，运行 git status 时就会在 “Changes not staged for commit”。

`git rm --cached README.md`：让文件保留在工作区，但是不想让 Git 继续跟踪。可以使用 --cached 选项来实现。文件被修改过，还没有放进暂存区，则必须要用强制删除选项 -f ，以防止误删还没有添加到暂存区的数据，这样的数据不能被 Git 恢复。

git rm 支持正则表达式：

```bash
git rm log/\*.log
```

对文件改名：

```bash
git mv README.md README
```

相当于运行一下三条命令：

```bash
mv README.md README
git rm README.md
git add README
```

## 忽略文件

.gitignore 只能忽略未跟踪状态的文件。

如果远程仓库已经有了logs文件夹，使用以下命令可以删除文件的跟踪状态。

```bash
git rm --cached logs/xx.log
```

此时本地工作区修改还在。然后更新 .gitignore 文件，最后使用下面的命令删除远程仓库对应的文件。

```bash
git add . & git commit -m "xx" & git push
```

### skip-worktree和assume-unchanged

skip-worktree：

- skip-worktree 可以实现修改本地文件不会被提交，但又可以拉取最新更改的需求。适用于一些不经常变动，但是必须本地化设置的文件。

  ```bash
  git update-index --skip-worktree [file]
  ```

- 取消skip-worktree：

  ```bash
  git update-index --no-skip-worktree [file]
  ```

- 查看 skip-worktree 列表：

  ```bash
  git ls-files -v | grep '^S\ '
  ```

assume-unchanged:

- 该命令只是假设文件没有变动，使用reset时，会将文件修改回去。当远程仓库相应的文件被修改时，pull更新之后，--assume-unchanged 会被清除。

  ```bash
  git update-index --assume-unchanged [file]
  ```

- 取消忽略：

  ```bash
  git update-index --no-assume-unchanged file/path
  ```

- 查看忽略了哪些文件：

  ```bash
  git ls-files -v | grep '^h\ '
  ```

