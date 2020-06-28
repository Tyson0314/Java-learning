<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [git 简介](#git-%E7%AE%80%E4%BB%8B)
  - [存储原理](#%E5%AD%98%E5%82%A8%E5%8E%9F%E7%90%86)
  - [git 快照](#git-%E5%BF%AB%E7%85%A7)
  - [本地执行](#%E6%9C%AC%E5%9C%B0%E6%89%A7%E8%A1%8C)
  - [三种状态](#%E4%B8%89%E7%A7%8D%E7%8A%B6%E6%80%81)
  - [配置](#%E9%85%8D%E7%BD%AE)
  - [获取帮助](#%E8%8E%B7%E5%8F%96%E5%B8%AE%E5%8A%A9)
- [git 基础](#git-%E5%9F%BA%E7%A1%80)
  - [获取 git 仓库](#%E8%8E%B7%E5%8F%96-git-%E4%BB%93%E5%BA%93)
  - [文件状态](#%E6%96%87%E4%BB%B6%E7%8A%B6%E6%80%81)
  - [配置别名](#%E9%85%8D%E7%BD%AE%E5%88%AB%E5%90%8D)
  - [修改](#%E4%BF%AE%E6%94%B9)
    - [撤销修改](#%E6%92%A4%E9%94%80%E4%BF%AE%E6%94%B9)
  - [暂存](#%E6%9A%82%E5%AD%98)
    - [取消暂存](#%E5%8F%96%E6%B6%88%E6%9A%82%E5%AD%98)
  - [提交](#%E6%8F%90%E4%BA%A4)
    - [修改commit信息](#%E4%BF%AE%E6%94%B9commit%E4%BF%A1%E6%81%AF)
    - [查看提交历史](#%E6%9F%A5%E7%9C%8B%E6%8F%90%E4%BA%A4%E5%8E%86%E5%8F%B2)
  - [版本回退](#%E7%89%88%E6%9C%AC%E5%9B%9E%E9%80%80)
  - [stash](#stash)
  - [移除和移动](#%E7%A7%BB%E9%99%A4%E5%92%8C%E7%A7%BB%E5%8A%A8)
    - [移除](#%E7%A7%BB%E9%99%A4)
    - [移动](#%E7%A7%BB%E5%8A%A8)
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
    - [merge 和 rebase 区别](#merge-%E5%92%8C-rebase-%E5%8C%BA%E5%88%AB)
  - [删除分支](#%E5%88%A0%E9%99%A4%E5%88%86%E6%94%AF)
  - [分支管理](#%E5%88%86%E6%94%AF%E7%AE%A1%E7%90%86)
  - [远程分支](#%E8%BF%9C%E7%A8%8B%E5%88%86%E6%94%AF)
    - [推送](#%E6%8E%A8%E9%80%81)
    - [跟踪分支](#%E8%B7%9F%E8%B8%AA%E5%88%86%E6%94%AF)
    - [fetch](#fetch)
    - [pull](#pull)
    - [删除远程分支](#%E5%88%A0%E9%99%A4%E8%BF%9C%E7%A8%8B%E5%88%86%E6%94%AF)
  - [创建远程分支](#%E5%88%9B%E5%BB%BA%E8%BF%9C%E7%A8%8B%E5%88%86%E6%94%AF)
  - [cherry-pick](#cherry-pick)
- [同步fork项目的更新](#%E5%90%8C%E6%AD%A5fork%E9%A1%B9%E7%9B%AE%E7%9A%84%E6%9B%B4%E6%96%B0)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## git 简介

分布式版本控制系统：客户端并不只提取最新版本的文件快照，而是把代码仓库完整的镜像下来。当任何一处协同工作的服务器发生故障，都可以用任何一个镜像出来的本地仓库恢复。

### 存储原理

git 在保存项目状态时，它主要对全部文件制作一个快照并保存这个快照的索引，如果文件没有被修改，git 不会重新存储这个文件，而是只保留一个链接指向之前存储的文件。

### git 快照

快照就是将旧文件所占的空间保留下来，并且保存一个引用，而新文件中会继续使用与旧文件内容相同部分的磁盘空间，不同部分则写入新的磁盘空间。

### 本地执行

在 git 中绝大多数的操作只需访问本地文件和资源，比如浏览项目的历史，git 不需要连接到服务器去获取历史，只需直接从本地数据库去获取。当没有网络时，我们可以将所做的更改先提交，直到有网络连接再上传，而像 subversion 和 CVS，我们可以修改文件，但是不能提交到本地库（本地库离线了）。

### 三种状态

git 的三种状态：已提交（committed）、已修改（modified）和已暂存（staged）。已修改表示修改了文件，但还没保存到数据库。已暂存表示对一个已修改文件的当前版本做了标记，使之包含在下次提交的快照中。已提交表示数据已经安全的保存到本地数据库。

基本的 git 工作流程：在工作目录修改文件；暂存文件，将文件快照放到暂存区域；提交更新到本地库。暂存区是一个文件，保存了下次将提交的文件列表信息，一般在 git 仓库目录中。

![git工作流程图](https://img2018.cnblogs.com/blog/1252910/201907/1252910-20190726163829113-2056815874.png)

![Image](..\img\git-status.png)

### 配置

设置用户名和邮箱地址：

```powershell
git config --global user.name "Tyson"
git config --global user.email tysondai@outlook.com
```

如果使用了 --global 选项，那么该命令只需要运行一次，因为之后无论你在该系统上做任何事情， Git 都会使用那些信息。 当你想针对特定项目使用不同的用户名称与邮件地址时，可以在那个项目目录下运行没有 --global 选项的命令来配置。 

检查配置信息：`git config --list`

检查某一项配置：`git config user.name`

### 获取帮助

获取 config 命令的手册：`git help config`



## git 基础

### 获取 git 仓库

在现有目录中初始化仓库：进入项目目录并输入`git init`

克隆现有的仓库：`git clone https://github.com/...`

### 文件状态

查看文件状态：`git status`

![用git时文件的生命周期](https://img2018.cnblogs.com/blog/1252910/201907/1252910-20190726163854195-886320537.png)

状态简览：

```powershell
$ git status -s
 M README
MM Rakefile
A lib/git.rb
M lib/simplegit.rb
?? LICENSE.txt
```

新添加的未跟踪文件前面有 ?? 标记，新添加到暂存区中的文件前面有 A 标记，修改过的文件前面有 M 标记。 你可能注意到了 M 有两个可以出现的位置，出现在右边的 M 表示该文件被修改了但是还没放入暂存区，出现在靠左边的 M 表示该文件被修改了并放入了暂存区。

### 配置别名

`git config --global alias.st status `


### 修改

要查看修改后尚未暂存的文件更新了哪些部分，直接输入`git diff`命令。

若要查看已暂存的内容，可以用`git diff --staged`命令。

#### 撤销修改

撤销修改：`git checkout -- file_name` 这是一个危险的命令，使用此命令之后，对文件所做的修改都要消失，不可恢复。

撤销修改还可以使用 restore 命令（git2.23版本引入）。

```java
git restore --worktree demo.txt //撤销文件工作区的修改
git restore --staged demo.txt //撤销暂存区的修改，将文件状态恢复到未add之前
git restore -s HEAD~1 demo.txt //将当前工作区切换到上个 commit 版本，-s相当于--source
git restore -s hadn12 demo.txt //将当前工作区切换到指定 commit id 的版本
```


### 暂存

`git add *`暂存工作目录文件。

#### 取消暂存

如果暂存了两个文件，想要取消暂存其中一个文件，则可以通过以下命令实现：`git reset HEAD file_name`

git reset 加上 --hard 选项可能导致工作目录中所有当前进度丢失。

### 提交

任何未提交的修改丢失后很可能不可恢复。提交命令：`git commit -m "add readme.md"`

`git commit -a -m "xxx"` 相当于`git add`和`git commit -m "xxx"`，将 tracked 的文件直接提交。注意，untracked 的文件不可以使用此命令直接提交。

git commit 进入 vim 编辑器后的操作：

1. 按下字母键`i`或`a`或`o`，此时进入到可编辑状态，这时就可以输入你的注释
2. 当你输入完之后，按下`Esc`键就可退出编辑状态，回到一般模式
3. 输入:wq 或 :wq!（强行退出）

#### 修改commit信息

如果提交后发现漏掉某些文件，此时可以运用带有 --amend 选项的提交命令尝试重新提交：

```powershell
git commit -m 'initial commit'
git add forgotten_file
git commit --amend
```

提交信息写错，也可以运行`git commit --amend`，然后在 vim 窗口重新编辑提交信息即可更改提交信息。（按下字母键`i`或`a`或`o`，此时进入到可编辑状态，这时就可以输入你的注释；当你输入完之后，按下`Esc`键就可退出编辑状态，回到一般模式；输入:wq 或 :wq!）


#### 查看提交历史

`git log`列出所有提交的更新。

`git log -p -2`，-p 用来显示每次提交的内容差异，-2表示显示最近两次提交。

`git log --stat`每次提交下面都会列出所有被修改的文件、有多少文件被修改和哪些行被修改等。

`git log --pretty=oneline`将每个提交放在一行显示。

`git log --pretty=format:"%h %s" --graph` format 表示格式化输出，%h 提交对象的简短哈希串，%s 是提交说明，--graph 可以更形象的展示分支、合并历史。

`git log --since=2.weeks` 按照时间作限制。

### 版本回退

```bash
git reset --hard commit_id
git reset --hard HEAD^^
git reset --hard HEAD~100
git reset HEAD readme.txt  //把暂存区的修改撤销掉（unstage）, 重新放入工作区 
```

### stash

```bash
git stash
git stash pop stash@{id} //恢复后删除
git stash apply stash@{id}  //恢复后不删除，需手动删除
git stage drop
git stash list //查看stash 列表
```




### 移除和移动

#### 移除

从暂存区移除文件：`git rm readme.md`，然后提交。如果只是简单地从工作目录中手工删除文件，运行 git status 时就会在 “Changes not staged for commit”。

如果删除之前修改过并且已经放到暂存区域的话，则必须要用强制删除选项 -f 。 这是一种安全特性，用于防止误删还没有添加到暂存区的数据，这样的数据不能被 Git 恢复。

想让文件保留在磁盘，但是并不想让 Git 继续跟踪。可以使用 --cached 选项来实现：`git rm --cached README.md`。

git rm 支持正则表达式：`git rm log/\*.log`。

#### 移动

对文件改名：`git mv README.md README`

相当于运行一下三条命令：

```powershell
mv README.md README
git rm README.md
git add README
```



### 远程仓库

远程仓库是指托管在因特网或者其他网络中的项目版本库。

#### 查看远程仓库

列出远程服务器的简写：

```powershell
$ git remote
origin
```

指定选项 -v：

```powershell
$ git remote -v
origin https://github.com/schacon/ticgit (fetch)
origin https://github.com/schacon/ticgit (push)
```

#### 添加远程仓库

运行 `git remote add <shortname> <url>` 添加远程 Git 仓库，同时指定一个简写名称。

`git remote add pb https://github.com/paulboone/ticgit`可以在命令行中使用字符串 pb 来代替整个 URL。如`git fetch pb`。

如果使用 clone 命令克隆了一个仓库，命令会自动将其添加为远程仓库并默认以 origin 为简写。

取消关联Git仓库 `git remote remove origin`


#### 修改远程仓库

```git
git remote set-url origin git@github.com:Tyson0314/Blog.git
```

#### pull 和 fetch

从远程仓库获取数据：`git fetch [remote-name]`

git fetch 命令将数据拉取到你的本地仓库，但它并不会自动合并到你当前的工作。 你必须手动将其合并入你的工作。

git pull 通常会从最初克隆的服务器上抓取数据并自动尝试合并到当前所在的分支。

```git
git pull = git fetch + git merge FETCH_HEAD 
git pull --rebase =  git fetch + git rebase FETCH_HEAD 
```

#### 本地仓库上传git服务器

```bash
git init将目录变成本地仓库
git add .
git commit -m 'xxx'
git remote add origin https://github.com/Tyson0314/profile
git branch --set-upstream-to=origin/master master 
git pull origin master --allow-unrelated-histories //不同项目合并
git push -u origin master  //如果当前分支与多个主机存在追踪关系，则-u会指定一个默认主机，这样后面就可以不加任何参数使用git push。
```


#### 推送到远程仓库

`git push [remote-name] [branch-name]`

#### 查看远程仓库

`$ git remote show origin`

#### 远程仓库移除和命名

`$ git remote rename pb paul`

`$ git remote rm paul`

### 标签

给历史的某个提交打标签，如标记发布节点（v1.0等）。

tag标签可以帮助我们回退到某个版本的代码，我们通过tag的名称即可回退，而不需要根据某个提冗长的commit ID来回退：

- 查看本地tag：git tag
- 新建tag：git tag -a v2.0 -m 'msg'
- 推送指定tag至远程：git push origin v2.0
- 推送本地所有tag至远程：git push origin --tags
- 删除本地tag：git tag -d v2.0
- 删除远程tag：git push origin --delete tag 2.0
- 本地查看不同tag的代码：get checkout v1.0
- 查看标签详情（包含commitId）：`git show v1.0`
- 回退到某个版本：git reset --hard commitId
- 获取远程分支：git fetch origin tag V2.0

#### 创建标签

Git 使用两种主要类型的标签：轻量标签（lightweight）与附注标签（annotated）。一个轻量标签很像一个不会改变的分支 - 它只是一个特定提交的引用。然而，附注标签是存储在 Git 数据库中的一个完整对象。 它们是可以被校验的；其中包含打标签者的名字、电子邮件地址、日期时间；还有一个标签信息；并且可以使用 GNU Privacy Guard （GPG）签名与验证。 通常建议创建附注标签。

创建的标签都只存储在本地，不会自动推送到远程。

##### 附注标签

`git tag -a v1.4 -m 'my version 1.4'` -m 选项指定了一条将会存储在标签中的信息。

使用 git show v1.4 命令可以看到标签信息与对应的提交信息。

##### 轻量标签

`git tag v1.4-tyson` 此时运行 `git show v1.4-tyson`不会看到额外的标签信息，只显示提交信息。

### 推送标签

推送某个标签到远程，使用命令`git push origin <tagname>`
一次性推送全部尚未推送到远程的本地标签 `git push origin --tags`
删除远程标签(先删除本地标签) `git push origin :refs/tags/<tagname>`


#### 后期打标签

```powershell
$ git log --pretty=oneline
22fb43d9f59b983feb64ee69bd0658f37ea45db6 (HEAD -> master, tag: v1.4-tyson, tag: v1.4) add file note.md
aab2fda0b604dc295fc2bd5bfef14f3b8e3c5a98 add one line
c1285bcff4ef6b2aefdaf94eb9282fd4257621c6 modified readme.md
ba8e8a5fb932014b4aaf9ccd3163affb7699d475 renamed
d2ffb8c33978295aed189f5854857bc4e7b55358 add readme.md
```

给 modified readme.md 打标签：` git tag -a v1.2 c1285b`

#### 共享标签

git push 命令并不会传送标签到远程仓库服务器上。在创建完标签后你必须显式地推送标签到共享服务器上：`git push origin v1.5`

把所有不在远程仓库服务器上的标签全部传送到那里：`git push origin --tags`

#### 检出标签

如果你想要工作目录与仓库中特定的标签版本完全一样，可以使用 `git checkout -b [branchname] [tagname]` 在特定的标签上创建一个新分支：

```powershell
$ git checkout -b version2 v2.0.0
Switched to a new branch 'version2'
```

### git 别名

取消暂存别名：`git config --global alias.unstage 'reset HEAD --'`

最后一次提交：`git config --global alias.last 'log -1 HEAD'`



## git 分支

Git 鼓励在工作流程中频繁地使用分支与合并。

Git 保存的不是文件的变化或者差异，而是一系列不同时刻的文件快照。git 提交对象会包含一个指向暂存内容快照的指针。

### 分支创建

`$ git branch testing`

查看远程分支：`git branch -r`


### 分支切换

`$ git checkout testing`

查看各个分支当前所指的对象：`git log --oneline --decorate`

```powershell
$ git log --oneline --decorate
22fb43d (HEAD -> master, tag: v1.4-tyson, tag: v1.4, tyson) add file note.md
aab2fda add one line
c1285bc (tag: v1.2) modified readme.md
ba8e8a5 renamed
d2ffb8c add readme.md
```

master 和 tyson 分支都指向校验和为 22fb43d 的提交对象。

`$ git checkout -b iss53` 相当于 `git branch iss53` 加上 `git checkout iss53`

### 分支合并

合并 iss53 分支到 master 分支：

```powershell
git checkout master
git merge iss53
```

#### 合并冲突

当合并产生冲突时不会自动地创建一个新的合并提交。 Git 会暂停下来，等待你去解决合并产生的冲突。 你可以在合并冲突后的任意时刻使用 git status 命令来查看那些因包含合并冲突而处于 unmerged 状态的文件。

```txt
<<<<<<< HEAD:index.html
<div id="footer">contact : email.support@github.com</div>
=======
<div id="footer">
please contact us at support@github.com
</div>
>>>>>>> iss53:index.html
```

在你解决了所有文件里的冲突之后，对每个文件使用 git add 命令来将其标记为冲突已解决。然后输入 `git commit -m "merge branch iss53"`完成合并提交。

#### merge 和 rebase 区别

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

### 删除分支

删除本地分支：`git branch -d iss53`

删除远程分支：`git push origin --delete master`


### 分支管理

得到当前所有分支的一个列表：

```
$ git branch
* master
  tyson
```

\*代表当前 HEAD 指针所指向的分支。

查看每一个分支的最后一次提交：

```
$ git branch -v
* master 22fb43d add file note.md
  tyson  22fb43d add file note.md
```

查看哪些分支已经合并到当前分支：

```
$git	branch	--merged		
iss53 
*master
```

查看所有包含未合并工作的分支：

```
$git branch --no-merged
testing
```

如果分支包含未合并的工作，使用 `git branch -d testing` 删除时会出错，可以使用 `git branch -D testing`强制删除。

### 远程分支

#### 推送

`git push origin master` 将本地的 master 分支推送到远程仓库 origin/master 分支。`git push origin tyson:tyson-branch` 将本地的 tyson 分支推送到远程仓库的 tyson-branch 分支。

假如当前本地分支是 tyson，抓取远程仓库数据后，需要进行合并：

```
git fetch origin
git merge origin/tyson
```

将本地的所有分支都推送到远程主机：`git push -all origin`

强制推送：`git push --force origin`


#### 跟踪分支

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

`git branch -u origin master`

查看设置的所有跟踪分支：

```
$ git branch -vv
iss53 7e424c3 [origin/iss53: ahead 2] forgot the brackets
master 1ae2a45 [origin/master] deploying index fix
* serverfix f8674d9 [teamone/server-fix-good: ahead 3, behind 1] this should do it
testing 5ea463a trying something new
```

这些数据是本地缓存的服务器数据，如果需要最新的数据，可以先运行：`git fetch --all` 然后再运行：`git branch -vv`

#### fetch

git fetch 会将远程仓库的更新拉取到本地远程仓库的副本，不会自动合并到本地仓库。

git fetch 步骤：

```java
git fetch origin master:tmp  //在本地新建一个tmp分支，并将远程origin仓库的master分支代码下载到本地tmp分支
git diff tmp //来比较本地代码与刚刚从远程下载下来的代码的区别
git merge tmp//合并tmp分支到本地的master分支
git branch -d tmp//如果不想保留temp分支 可以用这步删除
```

#### pull

`git pull` = `git fetch` + `git merge`

#### 删除远程分支

`git push origin --delete tyson` Git 服务器会保留数据一段时间，误删的远程分支很容易恢复。

### 创建远程分支

基于本地分支创建远程分支：`git push origin backup_foreign:backup_foreign`

本地新分支和远程新分支关联：`git push --set-upstream origin backup_foreign`

### cherry-pick

参考自：[cherry-pick](https://juejin.im/post/5925a2d9a22b9d0058b0fd9b)

可以用于将在其他分支上的 commit 修改，移植到当前的分支。

`git cherry-pick <commit-id>`

当执行完 cherry-pick 之后，将会自动生成一个新的 commit 进行提交，会有一个新的 commit ID，commit 信息与 cherry-pick 的 commit 信息一致。遇到冲突则解决冲突，然后 `git add 产生冲突的文件`，然后使用 `git cherry-pick --continue` 继续。这个过程中可以使用 `git cherry-pick --abort`，恢复分支到 cherry-pick 之前的状态。

`git cherry-pick -x <commit_id>` 增加 -x 参数，表示保留原提交的作者信息进行提交。

在 Git 1.7.2 版本开始，新增了支持批量 cherry-pick ，就是可以一次将一个连续的时间序列内的 commit ，设定一个开始和结束的 commit ，进行 cherry-pick 操作。

`git cherry_pick <start-commit-id>…<end-commit-id>`



## 同步fork项目的更新

关联远程仓库

```git
git remote add upstream https://xxx.com
```

拉取远程更新，存储在一个本地分支 upstream/master

```git 
git fetch upstream
```

如果不在本地分支，则切到本地分支

```git
git checkout master
```

把 upstream/master 分支合并到本地 master 上，这样就完成了同步

```git
git rebase upstream/master
```

