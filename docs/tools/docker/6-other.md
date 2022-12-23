# 其他

## 给nginx增加端口映射

nginx一开始只映射了80端口，后面载部署项目的时候，需要用到其他端口，不想重新部署容器，所以通过修改配置文件的方式给容器添加其他端口。

1、执行命令`docker inspect nginx`，找到容器id

2、停止容器`docker stop nginx`，不然修改了配置会自动还原

3、修改hostconfig.json

```java
cd /var/lib/docker/containers/135254e3429d1e75aa68569137c753b789416256f2ced52b4c5a85ec3849db87 # container id
vim hostconfig.json
```

添加端口：

```java
"PortBindings": {
    "80/tcp": [
        {
            "HostIp": "",
            "HostPort": "80"
        }
    ],
    "8080/tcp": [
        {
            "HostIp": "",
            "HostPort": "8080"
        }
    ]
},
```

4、修改同目录下 config.v2.json

```java
"ExposedPorts": {
    "80/tcp": {},
    "8080/tcp": {},
    "8189/tcp": {}
},
```

5、重启容器

```java
systemctl restart docker.service # 重启docker服务
docker start nginx
```

