# 继承

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

## 依赖管理

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

![](http://img.dabin-coder.cn/image/使用import依赖范围导入依赖管理配置.png)

## 插件管理

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

