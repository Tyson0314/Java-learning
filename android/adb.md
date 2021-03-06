<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [简介](#%E7%AE%80%E4%BB%8B)
- [工作原理](#%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86)
- [基本命令](#%E5%9F%BA%E6%9C%AC%E5%91%BD%E4%BB%A4)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 简介
Android调试桥，用于与设备进行通信。adb命令用于执行各种设备操作，可以在设备上运行各种命令。主要包含三个组件：
- 客户端：计算机上运行，用于发送adb命令；
- 守护进程（adbd）：在设备上运行命令。守护进程在每个设备上作为后台进程运行；
- 服务器：管理客户端和守护进程之间的通信。服务器在开发计算机上作为后台进程运行。

## 工作原理
当您启动某个 adb 客户端时，客户端会先检查是否有 adb 服务器进程正在运行。如果没有，它将启动服务器进程。服务器在启动后会与本地 TCP 端口 5037 绑定，并监听 adb 客户端发出的命令 - 所有 adb 客户端均通过端口 5037 与 adb 服务器通信。

## 基本命令
`adb devices -l`：查询设备列表；
`adb kill-server`：停止adb服务器，解决adb命令没响应等问题。停止了adb服务器之后，通过发出任意adb命令重启adb服务器；
