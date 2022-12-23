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

![](http://img.dabin-coder.cn/image/git-work-flow.png)

> 图片来源：https://blog.csdn.net/ThinkWon/article/details/94346816

## 存储原理

Git 在保存项目状态时，它主要对全部文件制作一个快照并保存这个快照的索引，如果文件没有被修改，Git 不会重新存储这个文件，而是只保留一个链接指向之前存储的文件。

## Git 快照

快照就是将旧文件所占的空间保留下来，并且保存一个引用，而新文件中会继续使用与旧文件内容相同部分的磁盘空间，不同部分则写入新的磁盘空间。

## 三种状态

Git 的三种状态：已修改（modified）、已暂存（staged）和已提交（committed）。已修改表示修改了文件，但还没保存到数据库。已暂存表示对一个已修改文件的当前版本做了标记，使之包含在下次提交的快照中。已提交表示数据已经安全的保存到本地数据库。

基本的 Git 工作流程：在工作目录修改文件；暂存文件，将文件快照放到暂存区域；提交更新到本地库。暂存区保存了下次将要提交的文件列表信息，一般在 Git 仓库目录中。

![](http://img.dabin-coder.cn/image/git工作流程.png)

> 图片来源：`https://img2018.cnblogs.com/blog/1252910/201907/1252910-20190726163829113-2056815874.png`

![](http://img.dabin-coder.cn/image/git-status.png)

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

