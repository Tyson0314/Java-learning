# 入门

## 编写测试代码

## 添加 junit 依赖

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

## 编译

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

## 测试代码

```java
public class HelloWorldTest {
    @Test
    public void testHelloWord() {
        HelloWorld hw = new HelloWorld();
        hw.sayHello();
    }
}
```

## 执行测试

`mvn clean test`

测试结果：

```java
-------------------------------------------------------
 T E S T S
-------------------------------------------------------
Running com.tyson.test.HelloWorldTest
Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.117 sec
```

## 打包和安装

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



