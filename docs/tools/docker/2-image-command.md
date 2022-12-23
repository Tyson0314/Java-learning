# docker镜像常用命令

## 添加docker仓库位置

安装yum-utils：

```
yum install -y yum-utils device-mapper-persistent-data lvm2
```

添加仓库地址：

```
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
```

## 安装docker服务

```
yum install docker-ce
```

## 启动 docker 服务

```
systemctl start docker
```

## 重启docker服务

```java
systemctl restart docker.service
```

## 搜索镜像

```
docker search java
```

## 下载镜像：

不加版本号，则默认下载最新版本。

```
docker pull nginx:1.18.0
```

## 列出镜像

```
docker images

REPOSITORY   TAG       IMAGE ID       CREATED         SIZE
nginx        1.18.0    c2c45d506085   7 days ago      133MB
nginx        1.17.0    719cd2e3ed04   22 months ago   109MB
java         8         d23bdf5b1b1b   4 years ago     643MB
```

## 删除镜像

删除镜像前必须先删除以此镜像为基础的容器。

```
docker rmi -f imageID # -f 强制删除镜像
```

删除所有没有引用的镜像（找出IMAGE ID为none的镜像）：

```
docker rmi `docker images | grep none | awk '{print $3}'`
```

强制删除所有镜像：

```
docker rmi -f $(docker images)
```

## 打包镜像

```
# -t 表示指定镜像仓库名称/镜像名称:镜像标签 .表示使用当前目录下的Dockerfile文件
docker build -t mall/mall-admin:1.0-SNAPSHOT .
```

## 创建镜像

镜像的创建也有两种：

- 利用已有的镜像创建容器之后进行修改，之后commit生成镜像
- 利用Dockerfile创建镜像

（1）利用已有的镜像创建容器之后进行修改

利用镜像启动容器：

```
[root@xxx ~]# docker run -it java:8 /bin/bash    # 启动一个容器
[root@72f1a8a0e394 /]#    # 这里命令行形式变了，表示已经进入了一个新环境
[root@72f1a8a0e394 /]# vim    # 此时的容器中没有vim
bash: vim: command not found
[root@72f1a8a0e394 /]# apt-get update    # 更新软件包
[root@72f1a8a0e394 /]# apt-get install vim   # 安装vim
```

exit退出该容器，然后查看docker中运行的程序（容器）：

```
[root@VM_0_7_centos ~]# docker ps -a
CONTAINER ID   IMAGE          COMMAND                  CREATED          STATUS                       PORTS     NAMES
857aa43eeed4   java:8         "/bin/bash"              19 minutes ago   Exited (127) 4 seconds ago             gifted_blackburn
```

将容器转化为一个镜像，此时Docker引擎中就有了我们新建的镜像，此镜像和原有的java镜像区别在于多了个vim工具。

```
[root@VM_0_7_centos ~]# docker commit -m "java with vim" -a "tyson" 857aa43eeed4 tyson/java:vim
sha256:67c4b3658485690c9128e0b6d4c5dfa63ec100c89b417e3148f3c808254d6b9b
[root@VM_0_7_centos ~]# docker images
REPOSITORY   TAG       IMAGE ID       CREATED         SIZE
tyson/java   vim       67c4b3658485   7 seconds ago   684MB
```

运行新建的镜像：

```
[root@VM_0_7_centos ~]# docker run -it tyson/java:vim /bin/bash
root@88fead8e7db5:/# ls
bin  boot  dev  etc  home  lib  lib64  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var
root@88fead8e7db5:/# touch demo.txt
root@88fead8e7db5:/# vim demo.txt
```

（2）利用Dockerfile创建镜像

dockerfile用于告诉docker build执行哪些操作。

```
#该镜像以哪个镜像为基础
FROM java:8

#构建者的信息
MAINTAINER tyson

#build镜像执行的操作
RUN apt-get update
RUN apt-get install vim

#拷贝本地文件到镜像中
COPY ./* /usr/tyson/
```

利用build命令构建镜像：

```
docker build -t="tyson/java:vim" .
```

其中-t用来指定新镜像的用户信息、tag等。最后的点表示在当前目录寻找Dockerfile。

构建完成之后，通过`docker images`可以查看生成的镜像。

## 推送镜像

```
# 登录Docker Hub
docker login
# 给本地镜像打标签为远程仓库名称
docker tag mall/mall-admin:1.0-SNAPSHOT macrodocker/mall-admin:1.0-SNAPSHOT
# 推送到远程仓库
docker push macrodocker/mall-admin:1.0-SNAPSHOT
```

**什么是docker hub**？

Docker官方维护了一个DockerHub的公共仓库，里边包含有很多平时用的较多的镜像。除了从上边下载镜像之外，我们也可以将自己自定义的镜像发布（push）到DockerHub上。

1. 登录docker hub：`docker login`
2. 将本地镜像推送到docker hub，镜像的username需要与docker hub的username一致：`docker  push tyson14/java:vim`

## 修改镜像存放位置

1、查看镜像存放位置：

```
docker info | grep "Docker Root Dir"
 Docker Root Dir: /var/lib/docker
```

2、关闭docker服务：

```
systemctl stop docker
```

3、原镜像目录移动到目标目录：

```
mv /var/lib/docker /home/data/docker
```

4、建立软连接：

```
ln -s /home/data/docker /var/lib/docker
```

5、再次查看镜像存放位置，发现已经修改。