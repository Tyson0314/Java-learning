# 基本操作

## Linux关机,重启

```
#关机
shutdown -h now

#重启
shutdown -r now
```

## 查看系统,CPU信息

```
#查看系统内核信息
uname -a

#查看系统内核版本
cat /proc/version

#查看当前用户环境变量
env

cat /proc/cpuinfo

#查看有几个逻辑cpu, 包括cpu型号
cat /proc/cpuinfo | grep name | cut -f2 -d: | uniq -c

#查看有几颗cpu,每颗分别是几核
cat /proc/cpuinfo | grep physical | uniq -c

#查看当前CPU运行在32bit还是64bit模式下, 如果是运行在32bit下也不代表CPU不支持64bit
getconf LONG_BIT

#结果大于0, 说明支持64bit计算. lm指long mode, 支持lm则是64bit
cat /proc/cpuinfo | grep flags | grep ' lm ' | wc -l
```

## 建立软连接

```
ln -s /usr/local/jdk1.8/ jdk
```

## rpm相关

```
#查看是否通过rpm安装了该软件
rpm -qa | grep 软件名
```

## sshkey

```
#创建sshkey
ssh-keygen -t rsa -C your_email@example.com

#id_rsa.pub 的内容拷贝到要控制的服务器的 home/username/.ssh/authorized_keys 中,如果没有则新建(.ssh权限为700, authorized_keys权限为600)
```

## 命令重命名

```
#在各个用户的.bash_profile中添加重命名配置
alias ll='ls -alF'
```

## 同步服务器时间

```
sudo ntpdate -u ntp.api.bz
```

## 后台运行命令

```
#后台运行,并且有nohup.out输出
nohup xxx &

#后台运行, 不输出任何日志
nohup xxx > /dev/null &

#后台运行, 并将错误信息做标准输出到日志中 
nohup xxx >out.log 2>&1 &
```

## 强制活动用户退出

```
#命令来完成强制活动用户退出.其中TTY表示终端名称
pkill -kill -t [TTY]
```

## 查看命令路径

```
which <命令>
```

## 查看进程所有打开最大fd数

```
ulimit -n
```

## 配置dns

```
vim /etc/resolv.conf
```

## nslookup,查看域名路由表

```
nslookup google.com
```

## last, 最近登录信息列表

```
#最近登录的5个账号
last -n 5
```

## 设置固定ip

```
ifconfig em1  192.168.5.177 netmask 255.255.255.0
```

## 查看进程内加载的环境变量

```
#也可以去 cd /proc 目录下, 查看进程内存中加载的东西
ps eww -p  XXXXX(进程号)
```

## 查看进程树找到服务器进程

```
ps auwxf
```

## 查看进程启动路径

```
cd /proc/xxx(进程号)
ls -all
#cwd对应的是启动路径
```

## 添加用户, 配置sudo权限

```
#新增用户
useradd 用户名
passwd 用户名

#增加sudo权限
vim /etc/sudoers
#修改文件里面的
#root    ALL=(ALL)       ALL
#用户名 ALL=(ALL)       ALL
```

## 强制关闭进程名包含xxx的所有进程

```
ps aux|grep xxx | grep -v grep | awk '{print $2}' | xargs kill -9
```

