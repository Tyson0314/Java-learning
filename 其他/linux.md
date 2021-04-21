<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [基本命令](#%E5%9F%BA%E6%9C%AC%E5%91%BD%E4%BB%A4)
- [文件](#%E6%96%87%E4%BB%B6)
  - [查看目录](#%E6%9F%A5%E7%9C%8B%E7%9B%AE%E5%BD%95)
  - [查看文件](#%E6%9F%A5%E7%9C%8B%E6%96%87%E4%BB%B6)
  - [文件操作](#%E6%96%87%E4%BB%B6%E6%93%8D%E4%BD%9C)
  - [vim](#vim)
  - [查找文件](#%E6%9F%A5%E6%89%BE%E6%96%87%E4%BB%B6)
    - [whereis](#whereis)
    - [locate](#locate)
    - [which](#which)
    - [find](#find)
  - [权限](#%E6%9D%83%E9%99%90)
- [服务](#%E6%9C%8D%E5%8A%A1)
- [进程端口](#%E8%BF%9B%E7%A8%8B%E7%AB%AF%E5%8F%A3)
- [grep](#grep)
- [sed](#sed)
- [磁盘](#%E7%A3%81%E7%9B%98)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 基本命令

查看当前路径：pwd

方式：command1 && command2
如果command1执行成功，则执行command2
方式：command1 || command2
如果command1执行失败，则执行command2



help 命令是用于显示 shell 内建命令的简要帮助信息 `help cd`
man得到的内容比用 help 更多更详细，而且man没有内建与外部命令的区分



## 文件

### 查看目录
目录下各个文件容量。

```bash
ls -lht
```

### 查看文件

列出文件：`ls -l` 可以简写为 `ll`（别名，ubantu下不支持）

cat：输出文件所有内容

tail -10 demo.txt：显示最后10行

tail -f -n 100 demo.txt：实时查看文件，显示最后100行

head -10 demo.txt

head -20 nohup.out | tail -10：第11行到20行

less：分页显示工具，可以前后翻页查看文件。pagedown下一页，pageup上一页。

```bash
less demo.log
```

查看占用磁盘容量最多的文件：

```bash
 du -a /var | sort -n -r | head -n 10
```

### 文件操作

新建文件夹： mkdir
新建文件：touch
编辑文件：vi
删除文件：rm -rf | -f强制删除 -r 递归删除
复制文件：cp -r dir1 dir2 表示将dir1及其dir1下所包含的文件复制到dir2下。-r 复制目录
文件重命名：mv before.txt after.txt

解压：tar -zxvf jdk-8u131-linux-x64.tar.gz -C /usr/lib/jvm （-C解压到指定的目录）

解压带有中文字符的zip文件：unzip -O gbk filename.zip 

### vim

退出编辑：输入i进入编辑模式，按下esc退出编辑，输入:w，保存不退出；:z/:wq，保存后退出；:q!，退出不保存（w：write，q：quit）
搜索：输入/+搜索的词，回车，输入n跳转下一个匹配词
删除行：按esc进入命令模式，dd删除当前行，Ndd删除当前行以下的n行
撤销上一个操作：命令模式下，按 u
恢复上一步被撤销的操作：Ctrl+r

swp文件是vim非正常关闭时产生的，在当前目录删除：rm .xxx.swp

### 查找文件

#### whereis

简单快速，直接从数据库查找，whereis 只能搜索二进制文件(-b)，man 帮助文件(-m)和源代码文件(-s)
`whereis tomcat`

#### locate

快而全，通过“ /var/lib/mlocate/mlocate.db ”数据库查找，数据库不是实时更新，递归查找指定目录下的不同文件类型，刚添加的文件需手动执行updatedb
locate background.jpg   locate /usr/share/\*.jpg(-c统计数目，-i忽略大小写)

#### which

小而精，which 本身是shell內建的一个命令，它只从PATH环境变量指定的路径去搜索，通常使用which来确定是否安装了某个命令`which man`

#### find

最强大，速度慢，第一个参数是搜索的地方

```bash
find / -name background.jpg
sudo find / -name .ssh  //隐藏文件
```

### 权限

```bash
chmod +x xxx
chmod u+x shutdown
sudo chmod 744 hello.c
sudo chown tyson hello.c
chown mysql slow.log
```



## 服务

启动服务：

```bash
service mysqld start
/sbin/service rabbitmq-server start
redis-server /etc/redis.conf
redis-cli #启动redis客户端
```

停止服务：

```bash
service mysqld stop
/sbin/service rabbitmq-server stop #service是个文件，路径/usr/sbin/service，根目录下有/sbin链接到/usr/sbin，可以在任何文件夹使用此命令
redis-cli -a password shutdown #关闭redis服务，没有设置密码则直接redis-cli shutdown
```

[redis安装](https://cloud.tencent.com/developer/article/1119337)



## 进程端口

查看所有进程：`ps -ef` -e显示所有进程，-f显示进程对应的命令行

查看特定进程：`ps -ef | grep nginx`

根据进程号查看进程信息：`ps aux | grep pid`

根据进程号查找线程：`ps -T -p xxx`

正常结束进程：`kill -15 pid` 默认-15（SIGTERM）可以省略

杀死进程：`kill -9 pid` -9（SIGKILL）强制中断

放通端口：iptables -I INPUT -p TCP --dport 8013 -j ACCEPT

查看监听的端口：`netstat -tunlp`

查看端口信息：`netstat -tunlp | grep 8000`

- -t - 显示 TCP 端口。
- -u - 显示 UDP 端口。
- -n - 显示数字地址而不是主机名。
- -l - 仅显示侦听端口。
- -p - 显示进程的 PID 和名称。仅当以 root 或 sudo 用户身份运行命令时，才会显示此信息。



## grep

```mysql
# 将匹配以'z'开头以'o'结尾的所有字符串
$ echo 'zero\nzo\nzoo' | grep 'z.*o'

# 将匹配以'z'开头以'o'结尾，中间包含一个任意字符的字符串
$ echo 'zero\nzo\nzoo' | grep 'z.o'

# 将匹配以'z'开头,以任意多个'o'结尾的字符串
$ echo 'zero\nzo\nzoo' | grep 'zo*'


# grep命令用于打印输出文本中匹配的模式串
# grep默认是区分大小写的，这里将匹配所有的小写字母
$ echo '1234\nabcd' | grep '[a-z]'

# 将匹配所有的数字
$ echo '1234\nabcd' | grep '[0-9]'

# 将匹配所有的数字
$ echo '1234\nabcd' | grep '[[:digit:]]'

# 将匹配所有的小写字母
$ echo '1234\nabcd' | grep '[[:lower:]]'

# 将匹配所有的大写字母
$ echo '1234\nabcd' | grep '[[:upper:]]'

# 将匹配所有的字母和数字，包括0-9,a-z,A-Z
$ echo '1234\nabcd' | grep '[[:alnum:]]'

# 将匹配所有的字母
$ echo '1234\nabcd' | grep '[[:alpha:]]'
```



## sed

处理、编辑文本文件。

```bash
# 打印2-5行 nl输出文件内容带上行号
$ nl passwd | sed -n '2,5p'

# 删除2-5行
nl /etc/passwd | sed '2,5d'

# 删除第三到最后一行
nl /etc/passwd | sed '3,$d' 
```



## 磁盘

`df -h` 查看磁盘容量。



## 内存

`free -h` -h以可读的方式展示。

```
              total        used        free      shared  buff/cache   available
Mem:           1.8G        1.1G        107M        1.1M        562M        515M
Swap:            0B          0B          0B

```

