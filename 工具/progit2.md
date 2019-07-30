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

### 修改

要查看修改后尚未暂存的文件更新了哪些部分，直接输入`git diff`命令。

若要查看已暂存的内容，可以用`git diff --staged`命令。

#### 撤销修改

撤销修改：`git checkout -- file_name` 这是一个危险的命令，使用此命令之后，对文件所做的修改都要消失，不可恢复。

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

#### 撤销提交

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

运行 `git remote add <shortname> <url>` 添加一个新的远程 Git 仓库，同时指定一个简写名称。

`git remote add pb https://github.com/paulboone/ticgit`可以在命令行中使用字符串 pb 来代替整个 URL。如`git fetch pb`。

如果使用 clone 命令克隆了一个仓库，命令会自动将其添加为远程仓库并默认以 origin 为简写。

#### 抓取和拉取

从远程仓库获取数据：`git fetch [remote-name]`

git fetch 命令将数据拉取到你的本地仓库，但它并不会自动合并到你当前的工作。 你必须手动将其合并入你的工作。

git pull 通常会从最初克隆的服务器上抓取数据并自动尝试合并到当前所在的分支。

#### 推送到远程仓库

`git push [remote-name] [branch-name]`

#### 查看远程仓库

`$ git remote show origin`

#### 远程仓库移除和命名

`$ git remote rename pb paul`

`$ git remote rm paul`

### 标签

给历史的某个提交打标签，如标记发布节点（v1.0等）。

#### 列出标签

`git tag`

#### 创建标签

Git 使用两种主要类型的标签：轻量标签（lightweight）与附注标签（annotated）。一个轻量标签很像一个不会改变的分支 - 它只是一个特定提交的引用。然而，附注标签是存储在 Git 数据库中的一个完整对象。 它们是可以被校验的；其中包含打标签者的名字、电子邮件地址、日期时间；还有一个标签信息；并且可以使用 GNU Privacy Guard （GPG）签名与验证。 通常建议创建附注标签。

##### 附注标签

`git tag -a v1.4 -m 'my version 1.4'` -m 选项指定了一条将会存储在标签中的信息。

使用 git show 命令可以看到标签信息与对应的提交信息。

##### 轻量标签

`git tag v1.4-tyson` 此时运行 `git tag v1.4-tyson`不会看到额外的标签信息，只显示提交信息。

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

如果你想要工
作目录与仓库中特定的标签版本完全一样，可以使用 `git checkout -b [branchname] [tagname]` 在特定的标签上创建一个新分支：

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

### 删除分支

`git branch -d iss53`

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

