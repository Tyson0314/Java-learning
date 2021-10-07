<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [安装](#%E5%AE%89%E8%A3%85)
- [卸载](#%E5%8D%B8%E8%BD%BD)
- [更新](#%E6%9B%B4%E6%96%B0)
- [搜索](#%E6%90%9C%E7%B4%A2)
- [创建模块](#%E5%88%9B%E5%BB%BA%E6%A8%A1%E5%9D%97)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

NPM 是随同NodeJS一起安装的包管理工具。

测试是否安装 npm：`npm -v`

升级 npm 版本：`npm install npm -g`

## 安装

本地安装：`npm install express` 安装包放在工程目录下的 ./node_modules，在代码中通过 require() 来引入本地安装的包。

全局安装：`npm install exprexss -g` 安装包放在 /usr/local 下或者你 node 的安装目录，可以直接在命令行里使用。

使用淘宝镜像的命令：`npm install -g cnpm --registry.npm.taobao.org`，接下来就可以使用 cnpm 命令来安装模块了：`cnpm install express`

查看安装信息：`npm list -g`

查看某个模块的版本号：`npm list grunt`

## 卸载

`npm uninstall express`

## 更新

`npm update express`

## 搜索

`npm search express`

## 创建模块

创建模块，package.json 文件是必不可少的：`npm init`

注册用户：`npm adduser`

发布模块：`npm publish`
