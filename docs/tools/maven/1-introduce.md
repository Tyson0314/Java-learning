# 简介

Maven 是强大的构建工具，能够帮我们自动化构建过程--清理、编译、测试、打包和部署。比如测试，我们无需告诉 maven 如何去测试，只需遵循 maven 的约定编写好测试用例，当我们运行构建的时候，这些测试就会自动运行。

Maven 不仅是构建工具，还是一个依赖管理工具和项目信息管理工具。它提供了中央仓库，能帮助我们自动下载构件。

## 配置

配置用户范围 settings.xml。M2_HOME/conf/settings.xml 是全局范围的，而~/.m2/settings.xml 是用户范围的。配置成用户范围便于 Maven 升级。若直接修改 conf 目录下的 settings.xml，每次 Maven 升级时，都需要直接 settings.xml 文件。



