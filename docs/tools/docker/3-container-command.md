# docker容器常用命令

## 新建容器

新建并启动容器（docker容器运行必须有一个前台进程， 如果没有前台进程执行，容器认为空闲，就会自行退出。所以需要先创建一个前台进程）：

```
docker run -it --name java java:8 /bin/bash

docker run -p 33055:33055 --name nginx \
> -v /home/data:/home/data \
> nginx:1.18.0 \
> -e TZ="Asia/Shanghai"
# -d nginx:1.18.0 -d表示容器以后台方式运行
```

> - -p：将宿主机和容器端口进行映射，格式为：宿主机端口:容器端口；
> - --name：指定容器名称，之后可以通过容器名称来操作容器；
> - -e：设置容器的环境变量，这里设置的是时区；
> - -v：将宿主机上的文件挂载到容器上，格式为：宿主机文件目录:容器文件目录；
> - -d：表示容器以后台方式运行。终端不会输出任何运行信息；
> - -i: 以交互模式运行容器，通常与 -t 同时使用；
> - -t: 为容器分配一个终端，通常与 -i 同时使用。

使用-it，此时如果使用exit退出，则容器的状态处于Exit，而不是后台运行。如果想让容器一直运行，而不是停止，可以使用快捷键 ctrl+p ctrl+q 退出，此时容器的状态为Up。

**创建MySQL容器**：

```java
docker run --name mysql4blog -e MYSQL_ROOT_PASSWORD=123456 -p 3307:3307 -d mysql:8.0.20
```

> - `-name`: 给新创建的容器命名，此处命名为`mysql4blog`
> - `-e`: 配置信息，此处配置MySQL的 root 用户的登录密码
> - `-p`: 端口映射，此处映射主机的3307端口到容器的3307端口
> - -d: 成功启动同期后输出容器的完整ID
> - 最后一个`mysql:8.0.20`指的是`mysql`镜像

## 查看容器

列出运行中的容器，`-a`参数可以列出所有容器：

```
docker ps
```

## 停止容器

使用容器名称或者容器ID：

```
docker stop $ContainerName(or $ContainerId)
```

强制停止容器：

```
docker kill $ContainerName
```

## 启动容器

```
docker start $ContainerName
```

## 重启容器

```
docker restart nginx
```

## 进入容器

进入名字为mysql的容器，同时打开命令行终端。使用exit时，容器不会停止。

```
docker exec -it mysql /bin/bash
```

docker attach可以将本机的输入直接输到容器中，容器的输出会直接显示在本机的屏幕上。如果使用exit或者ctrl+c退出，会导致容器的停止。

```
docker attach container_name/container_id
```

新建并运行容器时，使用`docker run -it tyson/java:vim /bin/bash`，直接进入容器命令行界面。

使用exit退出命令行之后，重新进入容器：

1、先查询容器id：`docker inspect --format "{{.State.Pid}}" nginx`

2、根据查到的容器id进入容器：`nsenter --target 28487 --mount --uts --ipc --net --pid`

```
[root@VM_0_7_centos ~]# docker inspect --format "{{.State.Pid}}" nginx
28487
[root@VM_0_7_centos ~]# nsenter --target 28487 --mount --uts --ipc --net --pid
mesg: ttyname failed: No such device
root@b217a35fc808:/# ls -l
```

## 删除容器

根据ContainerName删除容器：

```
docker rm nginx
```

按名称通配符删除容器，比如删除以名称`mall-`开头的容器：

```
docker rm `docker ps -a | grep mall-* | awk '{print $1}'`
```

强制删除所有容器：

```
docker rm -f $(docker ps -a -q)
```

## 容器日志

根据ContainerName查看容器产生的日志：

```
docker logs nginx
```

动态查看容器产生的日志：

```
docker logs -f nginx
```

实时查看日志最后200行：

```bash
docker logs -f --tail 200 mysql
```

## 容器ip

```
docker inspect --format '{{.NetworkSettings.IPAddress}}' nginx
```

## 容器启动方式

```
# 将容器启动方式改为always
docker container update --restart=always $ContainerName
```

## 资源占用

查看指定容器资源占用状况，比如cpu、内存、网络、io状态：

```
docker stats nginx

CONTAINER ID   NAME      CPU %     MEM USAGE / LIMIT     MEM %     NET I/O     BLOCK I/O         PIDS
b217a35fc808   nginx     0.00%     3.641MiB / 1.795GiB   0.20%     656B / 0B   11.3MB / 8.19kB   2
```

查看所有容器资源占用情况：

```
docker stats -a
```

## 磁盘使用情况

```
docker system df

TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          3         1         885.4MB   752.5MB (84%)
Containers      1         1         1.258kB   0B (0%)
Local Volumes   0         0         0B        0B
Build Cache     0         0         0B        0B
```

## 执行容器内部命令

```
[root@VM_0_7_centos ~]# docker exec -it nginx /bin/bash
root@b217a35fc808:/# ll
bash: ll: command not found
root@b217a35fc808:/# ls -l
total 80
drwxr-xr-x   2 root root 4096 Apr  8 00:00 bin
drwxr-xr-x   2 root root 4096 Mar 19 23:44 boot
```

指定账号进入容器内部：

```
docker exec -it --user root nginx /bin/bash
```

## 网络

查看网络：

```
docker network ls
NETWORK ID     NAME      DRIVER    SCOPE
5f0d326b7082   bridge    bridge    local
af84aa332f22   host      host      local
741c1734f3bb   none      null      local
```

创建外部网络：

```
docker network create -d bridge my-bridge-network
```

创建容器时指定网络：

```
docker run -p 33056:33056 --name java \
> --network my-bridge-network \
> java:8
```

## 复制文件

将当前目录tpch文件夹复制到mysql容器相应的位置：

```
docker cp tpch mysql56:/var/lib/mysql #mysql56为容器名
```

容器文件拷贝到宿主机：

```java
docker cp 容器名：要拷贝的文件在容器里面的路径 要拷贝到宿主机的相应路径
```

