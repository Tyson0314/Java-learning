# 简介

Docker是一个开源的应用容器引擎，通过容器可以隔离应用程序的运行时环境（程序运行时依赖的各种库和配置），比虚拟机更轻量（虚拟机在操作系统层面进行隔离）。docker的另一个优点就是build once, run everywhere，只编译一次，就可以在各个平台（windows、linux等）运行。

## 基本概念

docker的基本概念：

1. 镜像（image），类似于虚拟机中的镜像，可以理解为可执行程序。

2. 容器（container），类似于一个轻量级的沙盒，可以将其看作一个极简的Linux系统环境。Docker引擎利用容器来运行、隔离各个应用。容器是镜像创建的应用实例，可以创建、启动、停止、删除容器，各个容器之间是是相互隔离的，互不影响。

3. 镜像仓库（repository），是Docker用来集中存放镜像文件的地方。注意与注册服务器（Registry）的区别：注册服务器是存放仓库的地方，一般会有多个仓库；而仓库是存放镜像的地方，一般每个仓库存放一类镜像，每个镜像利用tag进行区分，比如Ubuntu仓库存放有多个版本（12.04、14.04等）的Ubuntu镜像。
4. dockerfile，image的编译配置文件，docker就是"编译器"。

docker的基本命令：

1、docker build：我们只需要在dockerfile中指定需要哪些程序、依赖什么样的配置，之后把dockerfile交给“编译器”docker进行“编译”，生成的可执行程序就是image。

2、docker run：运行image，运行起来后就是docker container。

3、docker pull：到Docker Hub（docker registry）下载别人写好的image。

![](http://img.dabin-coder.cn/image/docker.jpg)

> 图片来源：知乎小灰

