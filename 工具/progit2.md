<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Git 简介](#git-%E7%AE%80%E4%BB%8B)
  - [Git工作流程](#git%E5%B7%A5%E4%BD%9C%E6%B5%81%E7%A8%8B)
  - [存储原理](#%E5%AD%98%E5%82%A8%E5%8E%9F%E7%90%86)
  - [Git 快照](#git-%E5%BF%AB%E7%85%A7)
  - [三种状态](#%E4%B8%89%E7%A7%8D%E7%8A%B6%E6%80%81)
  - [配置](#%E9%85%8D%E7%BD%AE)
  - [获取帮助](#%E8%8E%B7%E5%8F%96%E5%B8%AE%E5%8A%A9)
- [Git 基础](#git-%E5%9F%BA%E7%A1%80)
  - [获取 Git 仓库](#%E8%8E%B7%E5%8F%96-git-%E4%BB%93%E5%BA%93)
  - [文件状态](#%E6%96%87%E4%BB%B6%E7%8A%B6%E6%80%81)
  - [配置别名](#%E9%85%8D%E7%BD%AE%E5%88%AB%E5%90%8D)
  - [工作区](#%E5%B7%A5%E4%BD%9C%E5%8C%BA)
  - [暂存区](#%E6%9A%82%E5%AD%98%E5%8C%BA)
  - [提交](#%E6%8F%90%E4%BA%A4)
    - [修改commit信息](#%E4%BF%AE%E6%94%B9commit%E4%BF%A1%E6%81%AF)
    - [查看提交历史](#%E6%9F%A5%E7%9C%8B%E6%8F%90%E4%BA%A4%E5%8E%86%E5%8F%B2)
  - [版本回退](#%E7%89%88%E6%9C%AC%E5%9B%9E%E9%80%80)
  - [stash](#stash)
  - [rm和mv](#rm%E5%92%8Cmv)
  - [忽略文件](#%E5%BF%BD%E7%95%A5%E6%96%87%E4%BB%B6)
    - [skip-worktree和assume-unchanged](#skip-worktree%E5%92%8Cassume-unchanged)
  - [远程仓库](#%E8%BF%9C%E7%A8%8B%E4%BB%93%E5%BA%93)
    - [查看远程仓库](#%E6%9F%A5%E7%9C%8B%E8%BF%9C%E7%A8%8B%E4%BB%93%E5%BA%93)
    - [添加远程仓库](#%E6%B7%BB%E5%8A%A0%E8%BF%9C%E7%A8%8B%E4%BB%93%E5%BA%93)
    - [修改远程仓库](#%E4%BF%AE%E6%94%B9%E8%BF%9C%E7%A8%8B%E4%BB%93%E5%BA%93)
    - [pull 和 fetch](#pull-%E5%92%8C-fetch)
    - [本地仓库上传git服务器](#%E6%9C%AC%E5%9C%B0%E4%BB%93%E5%BA%93%E4%B8%8A%E4%BC%A0git%E6%9C%8D%E5%8A%A1%E5%99%A8)
    - [推送到远程仓库](#%E6%8E%A8%E9%80%81%E5%88%B0%E8%BF%9C%E7%A8%8B%E4%BB%93%E5%BA%93)
    - [查看远程仓库](#%E6%9F%A5%E7%9C%8B%E8%BF%9C%E7%A8%8B%E4%BB%93%E5%BA%93-1)
    - [远程仓库移除和命名](#%E8%BF%9C%E7%A8%8B%E4%BB%93%E5%BA%93%E7%A7%BB%E9%99%A4%E5%92%8C%E5%91%BD%E5%90%8D)
  - [标签](#%E6%A0%87%E7%AD%BE)
    - [创建标签](#%E5%88%9B%E5%BB%BA%E6%A0%87%E7%AD%BE)
      - [附注标签](#%E9%99%84%E6%B3%A8%E6%A0%87%E7%AD%BE)
      - [轻量标签](#%E8%BD%BB%E9%87%8F%E6%A0%87%E7%AD%BE)
    - [推送标签](#%E6%8E%A8%E9%80%81%E6%A0%87%E7%AD%BE)
    - [后期打标签](#%E5%90%8E%E6%9C%9F%E6%89%93%E6%A0%87%E7%AD%BE)
    - [共享标签](#%E5%85%B1%E4%BA%AB%E6%A0%87%E7%AD%BE)
    - [检出标签](#%E6%A3%80%E5%87%BA%E6%A0%87%E7%AD%BE)
  - [git 别名](#git-%E5%88%AB%E5%90%8D)
- [git 分支](#git-%E5%88%86%E6%94%AF)
  - [分支创建](#%E5%88%86%E6%94%AF%E5%88%9B%E5%BB%BA)
  - [分支切换](#%E5%88%86%E6%94%AF%E5%88%87%E6%8D%A2)
  - [分支合并](#%E5%88%86%E6%94%AF%E5%90%88%E5%B9%B6)
    - [合并冲突](#%E5%90%88%E5%B9%B6%E5%86%B2%E7%AA%81)
  - [rebase](#rebase)
  - [删除分支](#%E5%88%A0%E9%99%A4%E5%88%86%E6%94%AF)
  - [分支管理](#%E5%88%86%E6%94%AF%E7%AE%A1%E7%90%86)
  - [远程分支](#%E8%BF%9C%E7%A8%8B%E5%88%86%E6%94%AF)
    - [推送](#%E6%8E%A8%E9%80%81)
    - [跟踪分支](#%E8%B7%9F%E8%B8%AA%E5%88%86%E6%94%AF)
    - [fetch和pull](#fetch%E5%92%8Cpull)
    - [删除远程分支](#%E5%88%A0%E9%99%A4%E8%BF%9C%E7%A8%8B%E5%88%86%E6%94%AF)
  - [创建远程分支](#%E5%88%9B%E5%BB%BA%E8%BF%9C%E7%A8%8B%E5%88%86%E6%94%AF)
  - [cherry-pick](#cherry-pick)
    - [cherry-pick与rebase的区别](#cherry-pick%E4%B8%8Erebase%E7%9A%84%E5%8C%BA%E5%88%AB)
  - [补丁](#%E8%A1%A5%E4%B8%81)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

> 首先给大家分享一个github仓库，上面放了**200多本经典的计算机书籍**，包括C语言、C++、Java、Python、前端、数据库、操作系统、计算机网络、数据结构和算法、机器学习等，可以star一下，下次找书直接在上面搜索，仓库持续更新中~
>
> github地址：https://github.com/Tyson0314/java-books
>
> 如果github访问不了，可以访问gitee仓库。
>
> gitee地址：https://gitee.com/tysondai/java-books

# Git 简介

Git 是一个开源的分布式版本控制系统，可以有效、快速的进行项目版本管理。Git 是 Linus Torvalds 为了帮助管理 Linux 内核开发而开发的一个开放源码的版本控制软件。

## Git工作流程

Git工作流程如下：

- 从远程仓库中克隆资源作为本地仓库；
- 在本地仓库中进行代码修改；
- 在提交本地仓库前先将代码提交到暂存区；
- 提交修改，提交到本地仓库。本地仓库中保存修改的所有历史版本；
- 在需要和团队成员共享代码时，可以将修改的代码push到远程仓库。

Git 的工作流程图如下：

![](https://raw.githubusercontent.com/Tyson0314/img/master/git-work-flow.png)

> 图片来源：https://blog.csdn.net/ThinkWon/article/details/94346816

## 存储原理

Git 在保存项目状态时，它主要对全部文件制作一个快照并保存这个快照的索引，如果文件没有被修改，Git 不会重新存储这个文件，而是只保留一个链接指向之前存储的文件。

## Git 快照

快照就是将旧文件所占的空间保留下来，并且保存一个引用，而新文件中会继续使用与旧文件内容相同部分的磁盘空间，不同部分则写入新的磁盘空间。

## 三种状态

Git 的三种状态：已修改（modified）、已暂存（staged）和已提交（committed）。已修改表示修改了文件，但还没保存到数据库。已暂存表示对一个已修改文件的当前版本做了标记，使之包含在下次提交的快照中。已提交表示数据已经安全的保存到本地数据库。

基本的 Git 工作流程：在工作目录修改文件；暂存文件，将文件快照放到暂存区域；提交更新到本地库。暂存区保存了下次将要提交的文件列表信息，一般在 Git 仓库目录中。

![](https://raw.githubusercontent.com/Tyson0314/img/master/git工作流程.png)

> 图片来源：`https://img2018.cnblogs.com/blog/1252910/201907/1252910-20190726163829113-2056815874.png`

![](https://raw.githubusercontent.com/Tyson0314/img/master/git-status.png)

## 配置

设置用户名和邮箱地址：

```bash
git config --global user.name "dabin"
git config --global user.email xxx@xxx.com
```

如果使用了 --global 选项，那么该命令只需要运行一次，因为之后无论你在该系统上做任何事情，Git 都会使用那些信息。 当你想针对特定项目使用不同的用户名称与邮件地址时，可以在那个项目目录下运行没有 --global 选项的命令来配置。 

查看配置信息：

```bash
git config --list
```

查看某一项配置：

```bash
git config user.name
```

## 获取帮助

获取 config 命令的手册：

```bash
git help config
```

# Git 基础

## 获取 Git 仓库

在现有目录中初始化仓库：进入项目目录并输入`git init`

克隆现有的仓库：

```bash
git clone https://github.com/...
```

## 文件状态

查看文件状态：`git status`

![git生命周期](https://raw.githubusercontent.com/Tyson0314/img/master/git生命周期.png)

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

![](https://raw.githubusercontent.com/Tyson0314/img/master/image-20210830225020753.png)

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

## 远程仓库

远程仓库是指托管在网络中的项目版本库。

### 查看远程仓库

查看远程仓库地址：

```bash
$ git remote -v
origin https://github.com/schacon/ticgit (fetch)
origin https://github.com/schacon/ticgit (push)
```

### 添加远程仓库

运行 `git remote add <shortname> <url>` 添加远程 Git 仓库，同时指定一个简写名称。

```bash
git remote add pb https://github.com/paulboone/ticgit
```

如上命令，可以在命令行中使用字符串 pb 来代替整个 URL。如`git fetch pb`。

如果使用 clone 命令克隆了一个仓库，命令会自动将其添加为远程仓库并默认以 origin 为默认简写名称。

取消关联Git仓库：

```bash
git remote remove origin
```

### 给origin设置多个远程仓库

如果想要给origin设置两个远程仓库地址（git add会报错），可以使用`git remote set-url --add origin url`来设置。

```bash
$ git remote add origin  xxx.git
fatal: remote origin already exists.

$ git remote set-url --add origin xxx.git
#success
```

### 修改远程仓库

修改远程仓库地址：

```bash
git remote set-url origin git@github.com:Tyson0314/Blog.git
```

### pull 和 fetch

从远程仓库获取数据：

```bash
git fetch [remote-name]
```

git fetch 命令将数据拉取到本地仓库，但它并不会自动合并到本地分支，必须手动将其合并本地分支。

git pull 通常会从远程仓库拉取数据并自动尝试合并到当前所在的分支。

```bash
git pull = git fetch + git merge FETCH_HEAD 
git pull --rebase =  git fetch + git rebase FETCH_HEAD 
```

### 本地仓库上传git服务器

```bash
git init # 将目录变成本地仓库
git add .
git commit -m 'xxx' # 提交到本地仓库
git remote add origin https://github.com/Tyson0314/profile # 关联远程仓库
git branch --set-upstream-to=origin/master master  # 本地分支关联远程分支
git pull origin master --allow-unrelated-histories # 允许合并不相关的历史
git push -u origin master  # 如果当前分支与多个主机存在追踪关系，则-u会指定一个默认主机，这样后面就可以不加任何参数使用git push。
```


### 推送到远程仓库

推送使用命令：`git push [remote-name] [branch-name]`

```bash
git push origin master
```

### 查看远程仓库

```bash
git remote show origin
```

### 远程仓库移除和命名

移除远程仓库：

```bash
git remote rm paul
```

重命名远程仓库：

```bash
git remote rename old-name new-name
```

## 标签

给历史的某个提交打标签，如标记发布节点（v1.0等）。

tag标签可以帮助我们回退到某个版本的代码，我们通过tag的名称即可回退，而不需要根据某个提冗长的commit ID来回退：

- 查看本地tag：git tag
- 新建tag：git tag -a v2.0 -m 'msg'
- 推送指定tag至远程：git push origin v2.0
- 推送本地所有tag至远程：git push origin --tags
- 删除本地tag：git tag -d v2.0
- 删除远程tag：git push origin --delete tag 2.0
- 本地查看不同tag的代码：get checkout v1.0
- 查看标签详情（包含commitId）：git show v1.0
- 回退到某个版本：git reset --hard commitId
- 获取远程分支：git fetch origin tag V2.0

### 创建标签

Git 使用两种主要类型的标签：轻量标签（lightweight）与附注标签（annotated）。一个轻量标签很像一个不会改变的分支 - 它只是一个特定提交的引用。然而，附注标签是存储在 Git 数据库中的一个完整对象。 它们是可以被校验的；其中包含打标签者的名字、电子邮件地址、日期时间；还有一个标签信息；并且可以使用 GNU Privacy Guard （GPG）签名与验证。 通常建议创建附注标签。

创建的标签都只存储在本地，不会自动推送到远程。

#### 附注标签

添加附注标签：

```bash
git tag -a v1.4 -m 'my version 1.4'
```

-m 选项指定标签的信息。

使用 `git show v1.4` 命令可以看到标签信息和对应的提交信息。

#### 轻量标签

添加轻量标签：

```bash
git tag v1.4-tyson
```

 此时运行 `git show v1.4-tyson`不会看到额外的标签信息，只显示提交信息。

### 推送标签

推送某个标签到远程，使用命令：

```bash
git push origin <tagname>
```

一次性推送全部尚未推送到远程的本地标签：

````bash
git push origin --tags
````

删除远程标签(先删除本地标签) ：

```bash
git push origin :refs/tags/<tagname>
```

### 后期打标签

比如给下面的这个提交（ `modified readme.md` ）打标签：` git tag -a v1.2 c1285b`

```bash
$ git log --pretty=oneline
22fb43d9f59b983feb64ee69bd0658f37ea45db6 (HEAD -> master, tag: v1.4-tyson, tag: v1.4) add file note.md
aab2fda0b604dc295fc2bd5bfef14f3b8e3c5a98 add one line
c1285bcff4ef6b2aefdaf94eb9282fd4257621c6 modified readme.md
ba8e8a5fb932014b4aaf9ccd3163affb7699d475 renamed
d2ffb8c33978295aed189f5854857bc4e7b55358 add readme.md
```

### 共享标签

git push 命令并不会传送标签到远程仓库服务器上。在创建完标签后你必须显式地推送标签到共享服务器上：

```bash
git push origin v1.5
```

把所有不在远程仓库服务器上的标签全部传送到那里：

```bash
git push origin --tags
```

### 检出标签

如果你想要工作目录与仓库中特定的标签版本完全一样，可以使用 `git checkout -b [branchname] [tagname]` 在特定的标签上创建一个新分支：

```bash
$ git checkout -b version2 v2.0.0
Switched to a new branch 'version2'
```

## git 别名

取消暂存别名：

```bash
git config --global alias.unstage 'reset HEAD --'
```

最后一次提交：

```bash
git config --global alias.last 'log -1 HEAD'
```

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

# Rebase 8824682..595ede1 onto 8824682 (2 commands)
#
# Commands:
# p, pick = use commit
# r, reword = use commit, but edit the commit message
# e, edit = use commit, but stop for amending
# s, squash = use commit, but meld into previous commit
# f, fixup = like "squash", but discard this commit's log message
# x, exec = run command (the rest of the line) using shell
# d, drop = remove commit
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



