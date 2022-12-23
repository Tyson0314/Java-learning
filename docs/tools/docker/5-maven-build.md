# maven插件构建docker镜像

## docker镜像仓库

服务器创建docker镜像仓库docker registry：

```
docker run -d -p 5000:5000 --restart=always --name registry2 registry:2
```

## docker开启远程访问

docker开启远程访问的端口2375，修改docker.service文件：

```
vi /usr/lib/systemd/system/docker.service
```

修改内容如下：

```
ExecStart=/usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
ExecStart=/usr/bin/dockerd -H tcp://0.0.0.0:2375 -H unix://var/run/docker.sock
```

`unix:///var/run/docker.sock`：unix socket，本地客户端将通过这个来连接 Docker Daemon。
`tcp://0.0.0.0:2375`：tcp socket，表示允许任何远程客户端通过 2375 端口连接 Docker Daemon。

## docker支持http上传镜像

```
echo '{ "insecure-registries":["192.168.3.101:5000"] }' > /etc/docker/daemon.json
```

## 重启docker

使配置生效：

```
systemctl daemon-reload
```

重启docker服务：

```
systemctl restart docker
```

## 开放端口

```
firewall-cmd --zone=public --add-port=2375/tcp --permanent
firewall-cmd --reload
```

## 构建docker镜像

在应用的pom.xml文件中添加docker-maven-plugin的依赖：

```xml
<plugin>
    <groupId>com.spotify</groupId>
    <artifactId>docker-maven-plugin</artifactId>
    <version>1.1.0</version>
    <executions>
        <execution>
            <id>build-image</id>
            <phase>package</phase>
            <goals>
                <goal>build</goal>
            </goals>
        </execution>
    </executions>
    <configuration>
        <imageName>mall-tiny/${project.artifactId}:${project.version}</imageName>
        <dockerHost>http://tysonbin.com:2375</dockerHost>
        <baseImage>java:8</baseImage>
        <entryPoint>["java", "-jar","/${project.build.finalName}.jar"]
        </entryPoint>
        <resources>
            <resource>
                <targetPath>/</targetPath>
                <directory>${project.build.directory}</directory>
                <include>${project.build.finalName}.jar</include>
            </resource>
        </resources>
    </configuration>
</plugin>
```

相关配置说明：

- executions.execution.phase:此处配置了在maven打包应用时构建docker镜像；
- imageName：用于指定镜像名称，mall-tiny是仓库名称，`${project.artifactId}`为镜像名称，`${project.version}`为版本号；
- dockerHost：打包后上传到的docker服务器地址；
- baseImage：该应用所依赖的基础镜像，此处为java；
- entryPoint：docker容器启动时执行的命令；
- resources.resource.targetPath：将打包后的资源文件复制到该目录；
- resources.resource.directory：需要复制的文件所在目录，maven打包的应用jar包保存在target目录下面；
- resources.resource.include：需要复制的文件，打包好的应用jar包。

修改application.yml中的域名，将localhost改为db。可以把docker中的容器看作独立的虚拟机，mall-tiny-docker访问localhost自然会访问不到mysql，docker容器之间可以通过指定好的服务名称db进行访问，至于db这个名称可以在运行mall-tiny-docker容器的时候指定。

```yaml
spring:
  datasource:
    url: jdbc:mysql://db:3306/mall?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai
    username: root
    password: root
```

执行maven的package命令，执行成功之后，镜像仓库会生成mall-tiny-docker镜像。

启动mysql服务：

```
docker run -p 3306:3306 --name mysql \
-v /mydata/mysql/log:/var/log/mysql \
-v /mydata/mysql/data:/var/lib/mysql \
-v /mydata/mysql/conf:/etc/mysql \
-e MYSQL_ROOT_PASSWORD=root  \
-d mysql:5.7
```

进入运行mysql的docker容器：`docker exec -it mysql /bin/bash`

启动mall-tiny-docker服务，通过--link表示在同一个网络内（可以在启动容器时通过--network指定），应用可以用db这个域名访问mysql服务：

```
docker run -p 8080:8080 --name mall-tiny-docker \
--link mysql:db \ # 在同一个网络内不同容器之间可以通过--link指定的服务别名互相访问，containName:alias
-v /etc/localtime:/etc/localtime \
-v /mydata/app/mall-tiny-docker/logs:/var/logs \
-d mall-tiny/mall-tiny-docker:0.0.1-SNAPSHOT
```

