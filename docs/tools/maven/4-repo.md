# 仓库

仓库分为两类：本地仓库和远程仓库。当 maven 根据坐标去寻找构件时，首先会去本地仓库查找，如果本地仓库不存在这个构件，maven 就会去远程仓库查找，下载到本地仓库。若远程仓库也没有这个构件，则会报错。

私服是一种特殊的远程仓库，是在局域网内架设的私有的仓库服务器，用其代理所有外部的远程仓库，内部的项目还能部署到私服上供其他项目使用。

## 本地仓库

要想自定义本地仓库地址，可以修改 C:\Users\Tyson\\.m2 下的 settings.xml 文件（默认不存在，需要到 maven 安装目录复制），不建议直接修改 maven 安装目录下的 settings.xml 文件。

通过`mvn clean install`可以将本地项目安装到本地库，以供其他项目使用。

## 远程仓库

当默认的中央仓库无法满足项目需要，可以通过 repositories 元素在 POM 中配置远程仓库。maven 中央仓库 id 为 central，若其他仓库 id 命名为 central，则会覆盖中央仓库的配置。

![](http://img.dabin-coder.cn/image/使用Jboss maven仓库.png)

maven中的仓库分为两种，snapshot 快照仓库和 release 发布仓库。元素 releases 的 enabled 为 true 表示开启 Jboss 仓库 release 版本下载支持，maven 会从 Jboss 仓库下载 release 版本的构件。

## 认证和部署

有些远程仓库需要认证才能访问，可以在 settings.xml 中配置认证信息（更为安全）。

```xml
<!-- setting.xml -->
<servers>
    <server>
        <id>releases</id>
        <username>admin</username>
        <password>admin123</password>
    </server>
    <server>
        <id>snapshots</id>
        <username>admin</username>
        <password>admin123</password>
    </server>
</servers>
```

server元素的id要和pom.xml里需要认证的repository元素的id对应一致。

```xml
<!-- pom.xml 配置远程发布到私服，mvn deploy -->
<distributionManagement>
    <repository>
        <id>releases</id>
        <name>releases</name>
        <url>
            http://localhost:8081/nexus/content/repositories/releases
        </url>
    </repository>
    <snapshotRepository>
        <id>snapshots</id>
        <url>
            http://localhost:8081/nexus/content/repositories/snapshots/
        </url>
    </snapshotRepository>
</distributionManagement>
```

配置完 distributionManagement 之后，在命令行运行`mvn clean deploy`，maven 就会将项目构建输出的构件部署到对应的远程仓库，如果项目当前版本是快照版本，则部署到快照版本仓库地址，否则部署到发布版本仓库地址。

## 镜像

mirrorsOf 配置为 central，表示其为中央仓库的镜像，任何对中央仓库的请求都会转发到这个镜像。

```xml
<mirrors>
    <mirror>
    	<id>alimaven</id>
    	<name>aliyun maven</name>
    	<url>http://maven.aliyun.com/nexus/content/groups/public/</url>
    	<mirrorOf>central</mirrorOf>
  </mirror>
</mirrors> 
```

`<mirrorOf>*<mirrorOf>`：匹配所有远程仓库。

`<mirroOf>external:*<mirrorOf>`：匹配所有不在本机上的所有远程仓库。

`<mirrorOf>repo1, repo2<mirrorOf>`：匹配仓库repo1 和 repo2。

`<mirrorOf>*, !repo1<mirrorOf>`：匹配除了repo1以外的所有远程仓库。



