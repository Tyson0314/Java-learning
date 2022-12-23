# docker-compose

Docker Compose是一个用于定义和运行多个docker容器应用的工具。使用YAML文件配置多个应用服务，通过这个YAML文件一次性部署配置的所有服务。

## 安装

```
curl -L https://get.daocloud.io/docker/compose/releases/download/1.24.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
```

修改文件的权限为可执行：

```
chmod +x /usr/local/bin/docker-compose
```

查看是否安装成功：

```
docker-compose --version
```

## 常用命令

创建、启动容器（默认配置文件docker-compose.yml）：

```
# -d表示在后台运行
docker-compose up -d
```

指定文件启动：

```
docker-compose -f docker-compose.yml up -d
```

停止所有相关容器：

```
docker-compose stop
```

列出所有容器信息：

```
docker-compose ps
```



## 部署多个服务

1. 使用docker-compose.yml定义需要部署的服务；
2. 使用docker-compose up命令一次性部署配置的所有服务。

## 定义配置文件

ports：指定主机和容器的端口映射（HOST:CONTAINER）

volumes：将主机目录挂载到容器（HOST:CONTAINER）

link：连接其他容器（同一个网络下）的服务（SERVICE:ALIAS）

```yaml
services:
  elasticsearch:
    image: elasticsearch:7.6.2
    container_name: elasticsearch
    user: root
    environment:
      - "cluster.name=elasticsearch" #设置集群名称为elasticsearch
      - "discovery.type=single-node" #以单一节点模式启动
      - "ES_JAVA_OPTS=-Xms128m -Xmx128m" #设置使用jvm内存大小
    volumes:
      - /mydata/elasticsearch/plugins:/usr/share/elasticsearch/plugins #插件文件挂载
      - /mydata/elasticsearch/data:/usr/share/elasticsearch/data #数据文件挂载
    ports:
      - 9200:9200
      - 9300:9300
  logstash:
    image: logstash:7.6.2
    container_name: logstash
    environment:
      - TZ=Asia/Shanghai
    volumes:
      - /mydata/logstash/logstash.conf:/usr/share/logstash/pipeline/logstash.conf #挂载logstash的配置文件
    depends_on:
      - elasticsearch #kibana在elasticsearch启动之后再启动
    link:
      - elasticsearch:es #可以用es这个域名访问elasticsearch服务
```

## 启动服务

先将docker-compose.yml上传至Linux服务器，再在当前目录下运行如下命令（默认配置文件docker-compose.yml）：

```
docker-compose up -d
```


