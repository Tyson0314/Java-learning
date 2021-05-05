<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [简介](#%E7%AE%80%E4%BB%8B)
- [自动化部署](#%E8%87%AA%E5%8A%A8%E5%8C%96%E9%83%A8%E7%BD%B2)
  - [安装jenkis镜像](#%E5%AE%89%E8%A3%85jenkis%E9%95%9C%E5%83%8F)
  - [Jenkins配置](#jenkins%E9%85%8D%E7%BD%AE)
  - [运行任务](#%E8%BF%90%E8%A1%8C%E4%BB%BB%E5%8A%A1)
- [问题记录](#%E9%97%AE%E9%A2%98%E8%AE%B0%E5%BD%95)
  - [无法进入登录页面](#%E6%97%A0%E6%B3%95%E8%BF%9B%E5%85%A5%E7%99%BB%E5%BD%95%E9%A1%B5%E9%9D%A2)
  - [Cannot link to /mysql](#cannot-link-to-mysql)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 简介

Jenkins 提供超过1000个插件来支持构建、部署、自动化，满足任何项目的需要。我们可以用Jenkins来构建和部署我们的项目，比如说从我们的代码仓库获取代码，然后将代码打包成可执行的文件，通过远程的ssh工具执行脚本来运行我们的项目。



## 自动化部署

将生成docker镜像和运行docker容器的操作进行整合，实现[一键部署](https://mp.weixin.qq.com/s/tQqvgSc9cHBtnqRQSbI4aw)。

1. 基础环境搭建，安装mysql镜像等；
2. 服务器安装jenkins并启动；
3. 配置jenkins，添加代码仓路径、maven配置、git配置、ssh配置和启动docker容器的脚本（镜像打包完成后运行）；
4. 在任务列表点击运行，一键部署。

### 安装jenkis镜像

下载jenkins镜像：

```
docker pull jenkins/jenkins:lts
```

在Docker容器中运行Jenkins：

```
docker run -p 80:8080 -p 50000:5000 --name jenkins \
-u root \
-v /mydata/jenkins_home:/var/jenkins_home \
-d jenkins/jenkins:lts
```

### Jenkins配置

访问http://192.168.6.132:8080/，登录Jenkins。

准备用于启动docker容器的脚本，上传到服务器。注意使用`--network network_name`指定与依赖服务（如mysql）在同一个网络下，不然会导致Cannot link to /mysql的异常。

```
#!/usr/bin/env bash
app_name='mall-tiny-jenkins'
docker stop ${app_name}
echo'----stop container----'
docker rm ${app_name}
echo'----rm container----'
docker run -p 8088:8088 --name ${app_name} \
--link mysql:db \ # 不同容器之间可以通过--link指定的服务别名互相访问，containName:alias
--network yml_default \ # 注意要与其他依赖的服务在同一个网络下，不然会导致Cannot link to /mysql的异常
-v /etc/localtime:/etc/localtime \
-v /mydata/app/${app_name}/logs:/var/logs \
-d mall-tiny/${app_name}:1.0-SNAPSHOT
echo'----start container----'
```

在jentins界面新建任务，配置maven、git、代码仓库、脚本路径等。

### 运行任务

可以在控制台界面查看任务执行的信息。



## 问题记录

### 无法进入登录页面

可能是机器网络配置改变，需要重启docker（systemctl restart docker），才能正常访问jenkins登录页面。

### Cannot link to /mysql

mall-tiny-jenkins容器与mysql容器不在同一个网络下。应该在运行mall-tiny-jenkins的脚本中添加--network参数：

```
docker run -d --name mall-tiny-jenkins -p 8088:8088 --net yml_default mall-tiny-jenkins
```

查看mysql容器的networks：

```
docker inspect mysql
```

返回的networks信息：

```yaml
"Networks": {
    "yml_default": {
        "IPAMConfig": null,
        "Links": null,
        "Aliases": [
            "mysql",
            "3333d057ad33"
        ],
        "NetworkID": "0621fa711575b12f81015e7763733ac1db29c65d7abaf11d0b5da0484f5f70ea",
        ...
    }
}
```

查看所有容器的networks信息：

```
docker network ls
```

