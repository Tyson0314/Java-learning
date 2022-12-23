# 插件

maven 的生命周期和插件相互绑定，用以完成具体的构建任务。

## 内置绑定

![](http://img.dabin-coder.cn/image/maven内置绑定1.png)

![](http://img.dabin-coder.cn/image/maven内置绑定2.png)

## 自定义绑定

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

## 命令行插件配置

maven-surefire-plugin 提供了一个 maven.test.skip 参数，当其值为 true 时，就会跳过执行测试。

`mvn install -Dmaven.test.skip=true` -D 是 Java 自带的。

## 插件全局配置

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



