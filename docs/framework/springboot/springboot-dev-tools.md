# SpringBoot 三大开发工具，你都用过么？

## 一、SpringBoot Dedevtools

他是一个让SpringBoot支持热部署的工具，下面是引用的方法

要么在创建项目的时候直接勾选下面的配置：

![](http://img.topjavaer.cn/img/image-20230211115527377.png)

要么给springBoot项目添加下面的依赖：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <optional>true</optional>
</dependency>
复制代码
```

- idea修改完代码后再按下 ctrl + f9 使其重新编译一下，即完成了热部署功能
- eclipse是按ctrl + s保存 即可自动编译

如果你想一修改代码就自动重新编译，无需按ctrl+f9。只需要下面的操作：

### 1.在idea的setting中把下面的勾都打上

![](http://img.topjavaer.cn/img/image-20230211115603710.png)

### 2.进入pom.xml,在build的反标签后给个光标，然后按Alt+Shift+ctrl+/

![](http://img.topjavaer.cn/img/image-20230211115616354.png)

### 3.然后勾选下面的东西，接着重启idea即可

![](http://img.topjavaer.cn/img/image-20230211115627263.png)

## 二、Lombok

Lombok是简化JavaBean开发的工具，让开发者省去构造器，getter,setter的书写。

在项目初始化时勾选下面的配置，即可使用Lombok

![](http://img.topjavaer.cn/img/image-20230211115645530.png)

或者在项目中导入下面的依赖：

```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
复制代码
```

使用时，idea还需要下载下面的插件：

![](http://img.topjavaer.cn/img/image-20230211115658171.png)

下面的使用的例子

```kotlin
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor//全参构造器
@NoArgsConstructor//无参构造器
@Data//getter + setter
public class User {
    private Long id;
    private String name;
    private Integer age;
    private String email;
}
复制代码
```

### 三、Spring Configuration Processor

该工具是给实体类的属性注入开启提示，自我感觉该工具意义不是特别大！

因为SpringBoot存在属性注入，比如下面的实体类：

```typescript
package org.lzl.HelloWorld.entity;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * @author Lenovo
 *
 */
@Component
@ConfigurationProperties(prefix = "mypet")
public class Pet {
    private String nickName;
    private String strain;
 public String getNickName() {
  return nickName;
 }
 public void setNickName(String nickName) {
  this.nickName = nickName;
 }
 public String getStrain() {
  return strain;
 }
 public void setStrain(String strain) {
  this.strain = strain;
 }
 @Override
 public String toString() {
  return "Pet [nickName=" + nickName + ", strain=" + strain + "]";
 }
 
    
}
复制代码
```

想要在`application.properties`和`application.yml`中给mypet注入属性，却没有任何的提示，为了解决这一问题，我们在创建SpringBoot的时候勾选下面的场景：

![](http://img.topjavaer.cn/img/image-20230211115712481.png)

或者直接在项目中添加下面的依赖:

```xml
<dependency>
     <groupId>org.springframework.boot</groupId>
     <artifactId>spring-boot-configuration-processor</artifactId>
     <optional>true</optional>
 </dependency>
复制代码
```

并在build的标签中排除对该工具的打包：（减少打成jar包的大小）

```xml
 <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.springframework.boot</groupId>
                            <artifactId>spring-boot-configuration-processor</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
```



> 原文：blog.csdn.net/MoastAll/article/details/108237154