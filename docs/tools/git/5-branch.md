# git 分支

Git 鼓励在工作流程中频繁地使用分支与合并。

Git 保存的不是文件的变化或者差异，而是一系列不同时刻的文件快照。git 提交对象会包含一个指向暂存内容快照的指针。

## 分支创建

创建 tyson 分支：

```bash
git branch testing
```

查看远程分支：

```bash
git branch -r
```


## 分支切换

使用 `git checkout branch-name` 切换分支：

```bash
git checkout testing
```

查看各个分支当前所指的对象：`git log --oneline --decorate`

```bash
$ git log --oneline --decorate
22fb43d (HEAD -> master, tag: v1.4-tyson, tag: v1.4, tyson) add file note.md
aab2fda add one line
c1285bc (tag: v1.2) modified readme.md
ba8e8a5 renamed
d2ffb8c add readme.md
```

master 和 tyson 分支都指向校验和为 22fb43d 的提交对象。

`git checkout -b iss53` = `git branch iss53` + `git checkout iss53`

## 分支合并

合并 iss53 分支到 master 分支：

```bash
git checkout mastergit merge iss53
```

squash merge：合并多个 commit 为一个，合并完需要重新提交，会修改原 commit 的提交信息，包括 author。

### 合并冲突

当合并产生冲突时不会自动地创建一个新的合并提交。 Git 会暂停下来，等待你去解决合并产生的冲突。 你可以在合并冲突后的任意时刻使用 git status 命令来查看那些因包含合并冲突而处于 unmerged 状态的文件。

```bash
<<<<<<< HEAD:index.html
<div id="footer">contact : email.support@github.com</div>
=======
<div id="footer">
please contact us at support@github.com
</div>
>>>>>>> iss53:index.html
```

在你解决了所有文件里的冲突之后，对每个文件使用 git add 命令来将其标记为冲突已解决。然后输入 `git commit -m "merge branch iss53"`完成合并提交。

## rebase

现在我们有这样的两个分支,test和master，提交如下：

```bash
       D---E test
      /
 A---B---C---F--- master
```

在master执行git merge test，会生成额外的提交节点G：

```bash
       D--------E
      /          \
 A---B---C---F----G---   test, master
```

在master执行git rebase test，本地提交以补丁形式打在分支的最后面：

```bash
A---B---D---E---C‘---F‘---   test, master
```

merge操作会生成一个新的节点，之前的提交分开显示。
 而rebase操作不会生成新的节点，是将两个分支融合成一个线性的提交。

合并commit：`git rebase -i` 

```bash
pick c38e7ae rebase content
s 595ede1 rebase

-- Rebase 8824682..595ede1 onto 8824682 (2 commands)

-- Commands:
-- p, pick = use commit
-- r, reword = use commit, but edit the commit message
-- e, edit = use commit, but stop for amending
-- s, squash = use commit, but meld into previous commit
-- f, fixup = like "squash", but discard this commit's log message
-- x, exec = run command (the rest of the line) using shell
-- d, drop = remove commit
```

`s 595ede1 rebase`会将595ede1合到前一个commit，按下`:wq`之后会弹出对话框，合并commit message。

## 删除分支

删除本地分支：

```bash
git branch -d tyson
```

删除远程分支：

```bash
git push origin --delete master
```


## 分支管理

得到当前所有分支的一个列表：

```
$ git branch
* master
  tyson
```

\*代表当前 HEAD 指针所指向的分支。

查看每一个分支的最后一次提交：

```
$ git branch -v* master 22fb43d add file note.md  tyson  22fb43d add file note.md
```

查看哪些分支已经合并到当前分支：

```
$git	branch	--merged		iss53 *master
```

查看所有包含未合并工作的分支：

```
$git branch --no-merged
testing
```

如果分支包含未合并的工作，使用 `git branch -d testing` 删除时会出错，可以使用 `git branch -D testing`强制删除。

## 远程分支

### 推送

将本地的 master 分支推送到远程仓库 origin/master 分支：

```bash
git push origin master
```

将本地的 tyson 分支推送到远程仓库的 tyson-branch 分支 ：

```bash
git push origin tyson:tyson-branch
```

假如当前本地分支是 tyson，抓取远程仓库数据后，需要进行合并：

```
git fetch origin
git merge origin/tyson
```

将本地的所有分支都推送到远程主机：

```bash
git push -all origin
```

强制推送（**最好不用**）：

```bash
git push --force origin
```


### 跟踪分支

```
$ git checkout --track origin/tyson
Branch tyson set up to track remote branch tyson from origin.
Switched to a new branch 'tyson'
```

本地分支与远程分支设置为不同名字：

```
$ git checkout -b tyson-branch origin/tyson
Branch tyson-branch set up to track remote branch tyson from origin.
Switched to a new branch 'tyson-branch'
```

设置已有的本地分支跟踪一个刚刚拉取下来的远程分支，使用 -u 或 --set-upstream-to 选项：

```bash
git branch -u origin master
```

查看设置的所有跟踪分支：

```
$ git branch -vv
iss53 7e424c3 [origin/iss53: ahead 2] forgot the brackets
master 1ae2a45 [origin/master] deploying index fix
* serverfix f8674d9 [teamone/server-fix-good: ahead 3, behind 1] this should do it
testing 5ea463a trying something new
```

这些数据是本地缓存的服务器数据，如果需要最新的数据，可以先运行：`git fetch --all` 然后再运行：`git branch -vv`

### fetch和pull

git fetch 会将远程仓库的更新拉取到本地远程仓库的副本，不会自动合并到本地仓库。

git fetch 步骤：

```java
git fetch origin master:tmp  //在本地新建一个tmp分支，并将远程origin仓库的master分支代码下载到本地tmp分支
git diff tmp //来比较本地代码与刚刚从远程下载下来的代码的区别
git merge tmp//合并tmp分支到本地的master分支
git branch -d tmp//如果不想保留temp分支 可以用这步删除
```

`git pull` = `git fetch` + `git merge`

### 删除远程分支

Git 服务器会保留数据一段时间，误删的远程分支很容易恢复。

```bash
git push origin --delete tyson
```

## 创建远程分支

基于本地分支创建远程分支：

```bash
git push origin backup_foreign:backup_foreign
```

本地新分支和远程新分支关联：

```bash
git push --set-upstream origin backup_foreign
```

## cherry-pick

可以用于将在其他分支上的 commit 修改，移植到当前的分支。

```bash
git cherry-pick <commit-id>
```

当执行完 cherry-pick 之后，将会自动生成一个新的 commit 进行提交，会有一个新的 commit ID，commit 信息与 cherry-pick 的 commit 信息一致。遇到冲突则解决冲突，然后 `git add 产生冲突的文件`，然后使用 `git cherry-pick --continue` 继续。这个过程中可以使用 `git cherry-pick --abort`，恢复分支到 cherry-pick 之前的状态。

`git cherry-pick -x <commit_id>` 增加 -x 参数，表示保留原提交的作者信息进行提交。

在 Git 1.7.2 版本开始，新增了支持批量 cherry-pick ，就是可以一次将一个连续的时间序列内的 commit ，设定一个开始和结束的 commit ，进行 cherry-pick 操作。

```bash
git cherry-pick <start-commit-id>…<end-commit-id>
```

上述命令将从start-commit-id开始到end-commit-id之间的所有commit-id提交记录都合并过来，需要注意的是，start-commit-id必须比end-commit-id提前提交。

### cherry-pick与rebase的区别

cherry-pick 操作的是某一个或某几个 commit，rebase 操作的是整个分支。

> 参考链接：https://juejin.im/post/5925a2d9a22b9d0058b0fd9b

## 补丁

`git apply xx.patch` 需要自己重新 commit。xx.patch 必须从`git diff`中获得，才能使用 `git apply`。

`git am yy.patch` 会保留commit信息，yy.patch是从`git format–patch`获得的。


