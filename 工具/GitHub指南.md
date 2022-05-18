<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [GitHub 的使用](#github-%E7%9A%84%E4%BD%BF%E7%94%A8)
- [GitHub 搜索技巧](#github-%E6%90%9C%E7%B4%A2%E6%8A%80%E5%B7%A7)
- [使用GitHub可以做什么](#%E4%BD%BF%E7%94%A8github%E5%8F%AF%E4%BB%A5%E5%81%9A%E4%BB%80%E4%B9%88)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

作为全球最大的~~代码托管~~同性交友平台，GitHub上面有着丰富的学习资源。

要使用GitHub，就要先学会使用Git。

Git又是什么呢？简单的说，**Git 是一个管理你的代码历史记录的工具。**

# GitHub 的使用

首先看下怎么使用GitHub。

- 注册一个GitHub账号，这样比较简单，不详细展开讲了。

- 创建一个新的仓库，用来存放项目。

  ![](https://raw.githubusercontent.com/Tyson0314/img/master/image-20210822154700616.png)

- 或者你在GitHub上看到别人有一个超级无敌有趣的项目，可以直接fork过来，可以理解成复制过来，变成你自己的。之后你想怎么改就怎么改！

  ![image-20210822155107839](https://raw.githubusercontent.com/Tyson0314/img/master/image-20210822155107839.png)

- 然后你可以通过Git命令行`git clone xxx`把项目clone到本地，在本地进行创作。

  ![](https://raw.githubusercontent.com/Tyson0314/img/master/image-20210822155359118.png)

- 最后，在本地创作完成，可以使用`git commit -m xxx`提交到本地库，然后使用`git push`把修改推送到GitHub仓库。之后就可以在GitHub上面看到你修改的内容啦~

以上就是GitHub的基本使用方法，有一些细节没有写出来，但是关键的步骤都列举出来了~

# GitHub 搜索技巧

接下来说一下GitHub的搜索技巧，非常重要！

- 评价GitHub项目的两个重要的参数：star和fork。

![](https://raw.githubusercontent.com/Tyson0314/img/master/image-20210822161003170.png)

比较优秀和热门的项目，star数目和fork数目都会比较多。我们可以根据这两个参数筛选出比较好的项目。使用`关键字 stars:>=xxx forks:>=xxx` 可以筛选出star和fork数目大于xxx的相关项目。

![](https://raw.githubusercontent.com/Tyson0314/img/master/image-20210822161122586.png)

- 使用 `awesome 关键字`，可以筛选出比较高质量的学习、书籍、工具类或者插件类的集合。

![](https://raw.githubusercontent.com/Tyson0314/img/master/image-20210822161608599.png)

- 在特定位置搜索关键词。有些关键词出现在项目的不同位置，比如项目名称、项目描述和README等。使用`关键词 in name/description/Readme`，可以搜索到相关的内容。比如使用`spring in name`，可以搜索到在项目名中包含spring的项目。

![image-20210822162144086](https://raw.githubusercontent.com/Tyson0314/img/master/image-20210822162144086.png)

- 指定条件搜索关键词。如`tool language:java`搜索到的是包含关键字tool的Java项目，`tool followers:>1000`可以搜索到包含关键字tool，且follower数量大于1000的项目。

![](https://raw.githubusercontent.com/Tyson0314/img/master/image-20210822163111390.png)



# 使用GitHub可以做什么

- 托管代码。GitHub 上记录这代码的修改历史，必要时可以进行回退；

- 搜索牛逼的开源项目，参与开源项目开发。这里分享下自己的一个开源仓库，用于分享Java核心知识，包括Java基础、MySQL、SpringBoot、Mybatis、Redis、RabbitMQ等等，面试必备。

  https://github.com/Tyson0314/Java-learning

- 文档神器。可以为自己的项目建立wiki，可以用markdown语法写wiki；

![](https://raw.githubusercontent.com/Tyson0314/img/master/image-20210822172419760.png)

- 使用GitHub pages建立个人静态网站，搞一个有自己域名的独立博客，想想都觉得开心。使用GitHub pages的好处是搭建简单而且免费，支持静态脚本，并且可以绑定自己的域名。具体可以参考：[GitHub Pages 建立个人网站详细教程 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/58229299)

- 写书写文章，团队协作分工。



最后给大家分享一个GitHub仓库，上面放了200多本经典的计算机书籍，包括数据库、操作系统、计算机网络、数据结构和算法等，可以star一下，下次找书直接在上面搜索，仓库持续更新中~

GitHub地址：https://github.com/Tyson0314/java-books

如果github访问不了，可以访问gitee仓库。

gitee地址：https://gitee.com/tysondai/java-books


