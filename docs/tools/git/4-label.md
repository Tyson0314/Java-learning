# 标签

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

## 创建标签

Git 使用两种主要类型的标签：轻量标签（lightweight）与附注标签（annotated）。一个轻量标签很像一个不会改变的分支 - 它只是一个特定提交的引用。然而，附注标签是存储在 Git 数据库中的一个完整对象。 它们是可以被校验的；其中包含打标签者的名字、电子邮件地址、日期时间；还有一个标签信息；并且可以使用 GNU Privacy Guard （GPG）签名与验证。 通常建议创建附注标签。

创建的标签都只存储在本地，不会自动推送到远程。

## 附注标签

添加附注标签：

```bash
git tag -a v1.4 -m 'my version 1.4'
```

-m 选项指定标签的信息。

使用 `git show v1.4` 命令可以看到标签信息和对应的提交信息。

## 轻量标签

添加轻量标签：

```bash
git tag v1.4-tyson
```

 此时运行 `git show v1.4-tyson`不会看到额外的标签信息，只显示提交信息。

## 推送标签

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

## 后期打标签

比如给下面的这个提交（ `modified readme.md` ）打标签：` git tag -a v1.2 c1285b`

```bash
$ git log --pretty=oneline
22fb43d9f59b983feb64ee69bd0658f37ea45db6 (HEAD -> master, tag: v1.4-tyson, tag: v1.4) add file note.md
aab2fda0b604dc295fc2bd5bfef14f3b8e3c5a98 add one line
c1285bcff4ef6b2aefdaf94eb9282fd4257621c6 modified readme.md
ba8e8a5fb932014b4aaf9ccd3163affb7699d475 renamed
d2ffb8c33978295aed189f5854857bc4e7b55358 add readme.md
```

## 共享标签

git push 命令并不会传送标签到远程仓库服务器上。在创建完标签后你必须显式地推送标签到共享服务器上：

```bash
git push origin v1.5
```

把所有不在远程仓库服务器上的标签全部传送到那里：

```bash
git push origin --tags
```

## 检出标签

如果你想要工作目录与仓库中特定的标签版本完全一样，可以使用 `git checkout -b [branchname] [tagname]` 在特定的标签上创建一个新分支：

```bash
$ git checkout -b version2 v2.0.0
Switched to a new branch 'version2'
```

