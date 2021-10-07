<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [简介](#%E7%AE%80%E4%BB%8B)
  - [配置](#%E9%85%8D%E7%BD%AE)
- [入门](#%E5%85%A5%E9%97%A8)
  - [编写测试代码](#%E7%BC%96%E5%86%99%E6%B5%8B%E8%AF%95%E4%BB%A3%E7%A0%81)
    - [添加 junit 依赖](#%E6%B7%BB%E5%8A%A0-junit-%E4%BE%9D%E8%B5%96)
    - [编译](#%E7%BC%96%E8%AF%91)
    - [测试代码](#%E6%B5%8B%E8%AF%95%E4%BB%A3%E7%A0%81)
    - [执行测试](#%E6%89%A7%E8%A1%8C%E6%B5%8B%E8%AF%95)
    - [`mvn clean test`](#mvn-clean-test)
    - [打包和安装](#%E6%89%93%E5%8C%85%E5%92%8C%E5%AE%89%E8%A3%85)
- [依赖](#%E4%BE%9D%E8%B5%96)
  - [依赖范围 scope](#%E4%BE%9D%E8%B5%96%E8%8C%83%E5%9B%B4-scope)
  - [传递性依赖](#%E4%BC%A0%E9%80%92%E6%80%A7%E4%BE%9D%E8%B5%96)
  - [排除依赖](#%E6%8E%92%E9%99%A4%E4%BE%9D%E8%B5%96)
  - [优化依赖](#%E4%BC%98%E5%8C%96%E4%BE%9D%E8%B5%96)
- [仓库](#%E4%BB%93%E5%BA%93)
  - [本地仓库](#%E6%9C%AC%E5%9C%B0%E4%BB%93%E5%BA%93)
  - [远程仓库](#%E8%BF%9C%E7%A8%8B%E4%BB%93%E5%BA%93)
    - [认证和部署](#%E8%AE%A4%E8%AF%81%E5%92%8C%E9%83%A8%E7%BD%B2)
  - [镜像](#%E9%95%9C%E5%83%8F)
- [生命周期](#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F)
  - [三套生命周期](#%E4%B8%89%E5%A5%97%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F)
  - [命令行与生命周期](#%E5%91%BD%E4%BB%A4%E8%A1%8C%E4%B8%8E%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F)
- [插件](#%E6%8F%92%E4%BB%B6)
  - [内置绑定](#%E5%86%85%E7%BD%AE%E7%BB%91%E5%AE%9A)
  - [自定义绑定](#%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BB%91%E5%AE%9A)
  - [命令行插件配置](#%E5%91%BD%E4%BB%A4%E8%A1%8C%E6%8F%92%E4%BB%B6%E9%85%8D%E7%BD%AE)
  - [插件全局配置](#%E6%8F%92%E4%BB%B6%E5%85%A8%E5%B1%80%E9%85%8D%E7%BD%AE)
- [聚合](#%E8%81%9A%E5%90%88)
- [继承](#%E7%BB%A7%E6%89%BF)
  - [依赖管理](#%E4%BE%9D%E8%B5%96%E7%AE%A1%E7%90%86)
  - [import 导入依赖管理](#import-%E5%AF%BC%E5%85%A5%E4%BE%9D%E8%B5%96%E7%AE%A1%E7%90%86)
  - [插件管理](#%E6%8F%92%E4%BB%B6%E7%AE%A1%E7%90%86)
- [测试](#%E6%B5%8B%E8%AF%95)
  - [跳过测试](#%E8%B7%B3%E8%BF%87%E6%B5%8B%E8%AF%95)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 简介

Maven 是强大的构建工具，能够帮我们自动化构建过程--清理、编译、测试、打包和部署。比如测试，我们无需告诉 maven 如何去测试，只需遵循 maven 的约定编写好测试用例，当我们运行构建的时候，这些测试就会自动运行。

Maven 不仅是构建工具，还是一个依赖管理工具和项目信息管理工具。它提供了中央仓库，能帮助我们自动下载构件。

### 配置

配置用户范围 settings.xml。M2_HOME/conf/settings.xml 是全局范围的，而~/.m2/settings.xml 是用户范围的。配置成用户范围便于 Maven 升级。若直接修改 conf 目录下的 settings.xml，每次 Maven 升级时，都需要直接 settings.xml 文件。



## 入门

### 编写测试代码

#### 添加 junit 依赖

```xml
    <dependencies>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.7</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
```

maven 会自动访问中央仓库，下载 junit 依赖。scope 为 test 表明依赖只对测试有效，即测试代码中的 import JUnit 代码没有问题，而主代码中使用 import  JUnit 代码，则会产生编译错误。

#### 编译

主类 HelloWorld

```java
public class HelloWorld {
    public String sayHello() {
        return "Hello world";
    }
    public static void main(String[] args) {
        System.out.println(new HelloWorld().sayHello());
    }
}
```

编译代码：`mvn clean compile`

clean 清理输出目录/target，compile 编译项目主代码。

#### 测试代码

```java
public class HelloWorldTest {
    @Test
    public void testHelloWord() {
        HelloWorld hw = new HelloWorld();
        hw.sayHello();
    }
}
```

#### 执行测试

#### `mvn clean test`

测试结果：

```java
-------------------------------------------------------
 T E S T S
-------------------------------------------------------
Running com.tyson.test.HelloWorldTest
Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.117 sec
```

#### 打包和安装

打包：`mvn clean package `将项目代码打包成 jar 包，位于/target 目录。

安装：`mvn clean install`，将项目输出的 jar 包安装到 maven 本地库，这样其他 maven 项目就可以直接引用这个 jar 包。

默认打包生成的 jar 不能直接运行，为了生成可运行的 jar 包，需要借助 maven-shade-plugin。

```xml
    <build>
        <finalName>HelloWorld</finalName>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-shade-plugin</artifactId>
                <version>1.2.1</version>
                <executions>
                    <execution>
                        <phase>package</phase>
                        <goals>
                            <goal>shade</goal>
                        </goals>
                        <configuration>
                            <transformers>
                                <transformer implementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer">
                                    <mainClass>com.tyson.maven.HelloWorld</mainClass>
                                </transformer>
                            </transformers>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
```

执行顺序：compile->test->package->install



## 依赖

```xml
<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.7</version>
    <scope>test</scope>
</dependency>
```

- scope：依赖的范围

- type：依赖的类型，jar 或者 war

- exclusions：用来排除传递性依赖

### 依赖范围 scope

maven 在编译、测试和运行项目时会使用不同的 classpath（编译classpath、测试 classpath、运行 classpath）。依赖范围就是用来控制依赖和这三种 classpath 的关系。maven 中有以下几种依赖范围：

- compile：默认值，使用该依赖范围的 maven 依赖，在编译、测试和运行时都需要使用该依赖
- test：只对测试 classpath 有效，在编译主代码和运行项目时无法使用此类依赖。如 JUnit 只在编译测试代码和运行测试的时候才需要此类依赖
- provided：已提供依赖范围。对于编译和测试 classpath 有效，但在运行时无效。如 servlet-api，编译和测试时需要该依赖，但在运行项目时，由于容器已经提供此依赖，故不需要 maven重复引入
- runtime：运行时依赖范围。对于测试和运行 classpath 有效，但在编译主代码时无效。如 JDBC 驱动实现，项目主代码的编译只需要 JDK 提供的 JDBC接口，只有在测试和运行时才需要实现 JDBC 接口的具体实现
- system：系统依赖范围
- import：导入依赖范围  [import 导入依赖管理](#import-导入依赖管理)


### 传递性依赖

假如项目 account 有一个 compile 范围的 spring-core 依赖，而 spring-core 有一个 compile 范围的 common-logging 依赖，那么 common-logging 就会成为 account 的 compile 范围依赖，common-logging 是 account 的一个传递性依赖。maven 会直接解析各个直接依赖的 POM，将那些必要的间接依赖，以传递性依赖的形式引入到项目中。

spring-core 是 account 的第一直接依赖，common-logging 是 spring-core 的第二直接依赖，common-logging 是 account 的传递性依赖。第一直接依赖的范围和第二直接依赖的范围共同决定了传递性依赖的范围。下表左边是第一直接依赖的范围，上面一行是第二直接依赖的范围，中间部分是传递依赖的范围

![依赖范围和传递性依赖](https://img2018.cnblogs.com/blog/1252910/201907/1252910-20190705222236595-1506009657.png)

### 排除依赖

传递性依赖可能会带来一些问题，像引入一些类库的 SNAPSHOT 版本，会影响到当前项目的稳定性。此时可以通过 exclusions 元素声明排除传递性依赖，exclusions 元素可以包含一个或多个 exclusion 元素，因此可以排除多个传递性依赖。声明 exclusion 时只需要 groupId 和 artifactId，而不需要 version 元素。

![排除依赖](https://img2018.cnblogs.com/blog/1252910/201907/1252910-20190706165424929-1192438533.png)

### 优化依赖

查看当前项目的依赖：`mvn dependency:list`

查看依赖树：`mvn dependency:tree`

分析依赖：`mvn dependency:analyze`



## 仓库

仓库分为两类：本地仓库和远程仓库。当 maven 根据坐标去寻找构件时，首先会去本地仓库查找，如果本地仓库不存在这个构件，maven 就会去远程仓库查找，下载到本地仓库。若远程仓库也没有这个构件，则会报错。

私服是一种特殊的远程仓库，是在局域网内架设的私有的仓库服务器，用其代理所有外部的远程仓库，内部的项目还能部署到私服上供其他项目使用。

### 本地仓库

要想自定义本地仓库地址，可以修改 C:\Users\Tyson\\.m2 下的 settings.xml 文件（默认不存在，需要到 maven 安装目录复制），不建议直接修改 maven 安装目录下的 settings.xml 文件。

通过`mvn clean install`可以将本地项目安装到本地库，以供其他项目使用。

### 远程仓库

当默认的中央仓库无法满足项目需要，可以通过 repositories 元素在 POM 中配置远程仓库。maven 中央仓库 id 为 central，若其他仓库 id 命名为 central，则会覆盖中央仓库的配置。

![使用Jboss maven仓库](https://img2018.cnblogs.com/blog/1252910/201907/1252910-20190706072227846-1642299607.png)

maven中的仓库分为两种，snapshot 快照仓库和 release 发布仓库。元素 releases 的 enabled 为 true 表示开启 Jboss 仓库 release 版本下载支持，maven 会从 Jboss 仓库下载 release 版本的构件。

#### 认证和部署

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

### 镜像

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



## 生命周期

项目构建过程包括：清理项目- 编译-测试-打包-部署

### 三套生命周期

clean 生命周期：pre-clean、clean 和 post-clean；

default 生命周期；

site 生命周期：pre-site、site、post-site 和 site-deploy

### 命令行与生命周期

`mvn clean`：调用 clean 生命周期的 clean 阶段，实际上执行的是 clean 的 pre-clean 和 clean 阶段；

`mvn test`：调用 default 生命周期的 test 阶段；

`mvn clean install`：调用 clean 生命周期的 clean 阶段和 default 生命周期的 install 阶段；

`mvn clean deploy site-deploy`：调用 clean 生命周期的 clean 阶段、default 生命周期的 deploy 阶段，以及 site 生命周期的 site-deploy 阶段。



## 插件

maven 的生命周期和插件相互绑定，用以完成具体的构建任务。

### 内置绑定

![内置绑定1](https://img2018.cnblogs.com/blog/1252910/201907/1252910-20190706171830733-661580052.png)

![内置绑定2](https://img2018.cnblogs.com/blog/1252910/201907/1252910-20190706171854778-608245986.png)

### 自定义绑定

内置绑定无法完成一些任务，如创建项目的源码 jar 包，此时需要用户自行配置。maven-source-plugin 可以完成这个任务，它的 jar-no-fork 目标能够将项目的主代码打包成 jar 文件，可以将其绑定到 default 生命周期的 verify 阶段，在执行完测试和安装构件之前创建源码 jar 包。

```xml
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-source-plugin</artifactId>
                <version>2.1.1</version>
                <executions>
                    <execution>
                        <id>attach-sources</id>
                        <phase>verify</phase>
                        <goals>
                            <goal>jar-no-fork</goal><!--指定执行的插件目标-->
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
```

### 命令行插件配置

maven-surefire-plugin 提供了一个 maven.test.skip 参数，当其值为 true 时，就会跳过执行测试。

`mvn install -Dmaven.test.skip=true` -D 是 Java 自带的。

### 插件全局配置

有些参数值从项目创建到发布都不会改变，可以在 pom 中一次性配置，避免重新在命令行输入。如配置 maven-compiler-plugin ，生成与 JVM1.5 兼容的字节码文件。

```xml
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>2.1</version>
                <configuration>
                    <source>1.5</source>
                    <target>1.5</target>
                </configuration>
            </plugin>
        </plugins>
    </build>
```



## 聚合

项目有多个模块时，使用一个聚合体将这些模块聚合起来，通过聚合体就可以一次构建全部模块。

![maven聚合](https://img2018.cnblogs.com/blog/1252910/201907/1252910-20190706142605104-1246458390.png)

accout-aggregator 的版本号要跟各个模块版本号相同，packaging 的值必须为 pom。module 标签的值是模块根目录名字（为了方便，模块根目录名字常与 artifactId 同名）。这样聚合模块和其他模块的目录结构是父子关系。如果使用平行目录结构，聚合模块的 pom 文件需要做相应的修改。

```xml
<modules>
	<module>../account-register</module>
    <module>../account-persist</module>
</modules>
```



## 继承

使用聚合体的 pom 文件作为公共 pom 文件，配置子模块的共同依赖，消除配置的重复。其中packaging 的值必须是 pom。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.tyson</groupId>
    <artifactId>account-parent</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <packaging>pom</packaging>
    <name>account-parent</name>
</project>
```

子模块 account-email 继承父模块 account-parent，子模块的 groupId 和 version 可以省略，这样子模块就会隐式继承父模块的这两个元素。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.tyson</groupId>
        <artifactId>account-parent</artifactId>
        <version>1.0.0-SNAPSHOT</version>
        <relativePath>../pom.xml</relativePath> <!--默认值，寻找上级目录下的pom文件-->
    </parent>

    <groupId>com.tyson</groupId>
    <artifactId>account-email</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <name>account-email</name>
</project>
```

### 依赖管理

使用dependencyManagement可以统一管理项目的版本号，确保应用的各个项目的依赖和版本一致，不用每个模块项目都弄一个版本号，不利于管理，当需要变更版本号的时候只需要在父类容器里更新，不需要任何一个子项目的修改；如果某个子项目需要另外一个特殊的版本号时，只需要在自己的模块dependencies中声明一个版本号即可。子类就会使用子类声明的版本号，不继承于父类版本号。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.tyson</groupId>
    <artifactId>account-parent</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <packaging>pom</packaging>
    <name>account-parent</name>

    <properties>
        <springframework.version>2.5.6</springframework.version>
    </properties>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework</groupId>
                <artifactId>spring-core</artifactId>
                <version>${springframework.version}</version>
            </dependency>
            <dependency>
                <groupId>org.springframework</groupId>
                <artifactId>spring-beans</artifactId>
                <version>${springframeword.version}</version>
            </dependency>
            <dependency>
                <groupId>org.springframework</groupId>
                <artifactId>spring-context</artifactId>
                <version>${springframeword.version}</version>
            </dependency>
            <dependency>
                <groupId>org.springframework</groupId>
                <artifactId>spring-context-support</artifactId>
                <version>${springframeword.version}</version>
            </dependency>
    </dependencies>
    </dependencyManagement>
</project>
```

子模块 account-email 会继承父模块 account-parent 的 dependencyManagement 配置。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.tyson</groupId>
        <artifactId>account-parent</artifactId>
        <version>1.0.0-SNAPSHOT</version>
        <relativePath>../pom.xml</relativePath> <!--默认值，寻找上级目录下的pom文件-->
    </parent>

    <groupId>com.tyson</groupId>
    <artifactId>account-email</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <name>account-email</name>

    <dependencies>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-core</artifactId> <!--会继承父pom的spring-core的version，统一版本-->
        </dependency>
    </dependencies>
</project>
```

springframework 依赖的 version 继承自父模块，可以省略，可避免各个子模块使用依赖版本不一致的情况。

与dependencies区别：

1)Dependencies相对于dependencyManagement，所有生命在dependencies里的依赖都会自动引入，并默认被所有的子项目继承。
2)dependencyManagement里只是声明依赖，并不自动实现引入，因此子项目需要显示的声明需要用的依赖。如果不在子项目中声明依赖，是不会从父项目中继承下来的；只有在子项目中写了该依赖项，并且没有指定具体版本，才会从父项目中继承该项，并且version和scope都读取自父pom;另外如果子项目中指定了版本号，那么会使用子项目中指定的jar版本。

### import 导入依赖管理

使用 import 依赖范围可以导入依赖管理配置，将目标 pom 的 dependencyManagement 配置导入合并到当前 pom 的 dependencyManagement 元素中。

![使用import依赖范围导入依赖管理配置](https://img2018.cnblogs.com/blog/1252910/201907/1252910-20190706155054098-1669414992.png)

### 插件管理

maven 提供了 pluginManagement 元素帮助管理插件。当项目中的多个模块有相同的插件配置时，应当将配置移到父 pom 的 pluginManagement 元素中，方便统一项目中的插件版本。

account-parent 的 pluginManagement 配置：

```xml
    <build>
        <pluginManagement>
            <plugins>
                <plugin>
                    <groupId>org.apache.maven.plugins</groupId>
                    <artifactId>maven-compiler-plugin</artifactId>
                    <configuration>
                        <source>1.5</source>
                        <target>1.5</target>
                    </configuration>
                </plugin>
            </plugins>
        </pluginManagement>
    </build>
```

子模块 account-email 继承 account-parent 的 pluginManagement 配置。如果子模块不需要父模块中的 pluginManagement 配置，将其忽略就可以。如果子模块需要不同于父模块 pluginManagement 配置的插件，可以自行覆盖父模块的配置。

```xml
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
```



## 测试

maven 通过插件 maven-surefire-plugin 来执行 JUnit 或者 TestNG 的测试用例。默认情况下，maven-surefire-plugin 的 test 目标会自动执行测试源码路径下（src/test/java/）所有符合命名模式（*/Test\*.java、\*/*Test.java、\*/\*TestCase.java）的测试类。

### 跳过测试

`mvn package -DskipTests`