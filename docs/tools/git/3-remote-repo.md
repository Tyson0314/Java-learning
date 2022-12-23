# 远程仓库

远程仓库是指托管在网络中的项目版本库。

## 查看远程仓库

查看远程仓库地址：

```bash
$ git remote -v
origin https://github.com/schacon/ticgit (fetch)
origin https://github.com/schacon/ticgit (push)
```

## 添加远程仓库

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

## 给origin设置多个远程仓库

如果想要给origin设置两个远程仓库地址（git add会报错），可以使用`git remote set-url --add origin url`来设置。

```bash
$ git remote add origin  xxx.git
fatal: remote origin already exists.

$ git remote set-url --add origin xxx.git
#success
```

## 修改远程仓库

修改远程仓库地址：

```bash
git remote set-url origin git@github.com:Tyson0314/Blog.git
```

## pull 和 fetch

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

## 本地仓库上传git服务器

```bash
git init # 将目录变成本地仓库
git add .
git commit -m 'xxx' # 提交到本地仓库
git remote add origin https://github.com/Tyson0314/profile # 关联远程仓库
git branch --set-upstream-to=origin/master master  # 本地分支关联远程分支
git pull origin master --allow-unrelated-histories # 允许合并不相关的历史
git push -u origin master  # 如果当前分支与多个主机存在追踪关系，则-u会指定一个默认主机，这样后面就可以不加任何参数使用git push。
```


## 推送到远程仓库

推送使用命令：`git push [remote-name] [branch-name]`

```bash
git push origin master
```

## 查看远程仓库

```bash
git remote show origin
```

## 远程仓库移除和命名

移除远程仓库：

```bash
git remote rm paul
```

重命名远程仓库：

```bash
git remote rename old-name new-name
```

