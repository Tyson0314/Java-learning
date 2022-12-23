# 依赖

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

## 依赖范围 scope

maven 在编译、测试和运行项目时会使用不同的 classpath（编译classpath、测试 classpath、运行 classpath）。依赖范围就是用来控制依赖和这三种 classpath 的关系。maven 中有以下几种依赖范围：

- compile：默认值，使用该依赖范围的 maven 依赖，在编译、测试和运行时都需要使用该依赖
- test：只对测试 classpath 有效，在编译主代码和运行项目时无法使用此类依赖。如 JUnit 只在编译测试代码和运行测试的时候才需要此类依赖
- provided：已提供依赖范围。对于编译和测试 classpath 有效，但在运行时无效。如 servlet-api，编译和测试时需要该依赖，但在运行项目时，由于容器已经提供此依赖，故不需要 maven重复引入
- runtime：运行时依赖范围。对于测试和运行 classpath 有效，但在编译主代码时无效。如 JDBC 驱动实现，项目主代码的编译只需要 JDK 提供的 JDBC接口，只有在测试和运行时才需要实现 JDBC 接口的具体实现
- system：系统依赖范围
- import：导入依赖范围  [import 导入依赖管理](#import-导入依赖管理)


## 传递性依赖

假如项目 account 有一个 compile 范围的 spring-core 依赖，而 spring-core 有一个 compile 范围的 common-logging 依赖，那么 common-logging 就会成为 account 的 compile 范围依赖，common-logging 是 account 的一个传递性依赖。maven 会直接解析各个直接依赖的 POM，将那些必要的间接依赖，以传递性依赖的形式引入到项目中。

spring-core 是 account 的第一直接依赖，common-logging 是 spring-core 的第二直接依赖，common-logging 是 account 的传递性依赖。第一直接依赖的范围和第二直接依赖的范围共同决定了传递性依赖的范围。下表左边是第一直接依赖的范围，上面一行是第二直接依赖的范围，中间部分是传递依赖的范围

![](http://img.dabin-coder.cn/image/传递性依赖.png)

## 排除依赖

传递性依赖可能会带来一些问题，像引入一些类库的 SNAPSHOT 版本，会影响到当前项目的稳定性。此时可以通过 exclusions 元素声明排除传递性依赖，exclusions 元素可以包含一个或多个 exclusion 元素，因此可以排除多个传递性依赖。声明 exclusion 时只需要 groupId 和 artifactId，而不需要 version 元素。

![](http://img.dabin-coder.cn/image/排查依赖.png)

## 优化依赖

查看当前项目的依赖：`mvn dependency:list`

查看依赖树：`mvn dependency:tree`

分析依赖：`mvn dependency:analyze`



