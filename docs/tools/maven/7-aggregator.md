# 聚合

项目有多个模块时，使用一个聚合体将这些模块聚合起来，通过聚合体就可以一次构建全部模块。

![](http://img.dabin-coder.cn/image/maven聚合.png)

accout-aggregator 的版本号要跟各个模块版本号相同，packaging 的值必须为 pom。module 标签的值是模块根目录名字（为了方便，模块根目录名字常与 artifactId 同名）。这样聚合模块和其他模块的目录结构是父子关系。如果使用平行目录结构，聚合模块的 pom 文件需要做相应的修改。

```xml
<modules>
	<module>../account-register</module>
    <module>../account-persist</module>
</modules>
```



