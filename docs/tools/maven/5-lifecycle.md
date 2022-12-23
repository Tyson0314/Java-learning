# 生命周期

项目构建过程包括：清理项目- 编译-测试-打包-部署

## 三套生命周期

clean 生命周期：pre-clean、clean 和 post-clean；

default 生命周期；

site 生命周期：pre-site、site、post-site 和 site-deploy

## 命令行与生命周期

`mvn clean`：调用 clean 生命周期的 clean 阶段，实际上执行的是 clean 的 pre-clean 和 clean 阶段；

`mvn test`：调用 default 生命周期的 test 阶段；

`mvn clean install`：调用 clean 生命周期的 clean 阶段和 default 生命周期的 install 阶段；

`mvn clean deploy site-deploy`：调用 clean 生命周期的 clean 阶段、default 生命周期的 deploy 阶段，以及 site 生命周期的 site-deploy 阶段。



