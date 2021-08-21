<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [基本命令](#%E5%9F%BA%E6%9C%AC%E5%91%BD%E4%BB%A4)
  - [与或](#%E4%B8%8E%E6%88%96)
  - [help](#help)
- [文件](#%E6%96%87%E4%BB%B6)
  - [当前路径](#%E5%BD%93%E5%89%8D%E8%B7%AF%E5%BE%84)
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
  - [高亮查找](#%E9%AB%98%E4%BA%AE%E6%9F%A5%E6%89%BE)
  - [环顾四周](#%E7%8E%AF%E9%A1%BE%E5%9B%9B%E5%91%A8)
  - [打印行号](#%E6%89%93%E5%8D%B0%E8%A1%8C%E5%8F%B7)
  - [统计行数](#%E7%BB%9F%E8%AE%A1%E8%A1%8C%E6%95%B0)
  - [不区分大小写](#%E4%B8%8D%E5%8C%BA%E5%88%86%E5%A4%A7%E5%B0%8F%E5%86%99)
  - [反查](#%E5%8F%8D%E6%9F%A5)
  - [多文件查找](#%E5%A4%9A%E6%96%87%E4%BB%B6%E6%9F%A5%E6%89%BE)
- [sed](#sed)
- [磁盘](#%E7%A3%81%E7%9B%98)
  - [mount](#mount)
- [内存](#%E5%86%85%E5%AD%98)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 基本命令

### 与或

方式：command1 && command2
如果command1执行成功，则执行command2
方式：command1 || command2
如果command1执行失败，则执行command2

### help

help 命令是用于显示 shell 内建命令的简要帮助信息 `help cd`
man得到的内容比用 help 更多更详细，而且man没有内建与外部命令的区分



## 文件

### 当前路径

查看当前路径：pwd

### 查看目录
目录下各个文件容量。

```bash
ls -lht
```

-l：使用长格式列出文件及目录信息

-t：根据最后的修改时间排序

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

删除文件：rm -rf （-f强制删除 -r 递归删除）

删除空目录：`rmdir dir`。rmdir命令只能删除空目录。当要删除非空目录时，就要使用带有“-R”选项的rm命令。

复制文件：cp -r dir1 dir2 表示将dir1及其dir1下所包含的文件复制到dir2下。-r 复制目录

文件重命名：mv before.txt after.txt

解压：tar -zxvf jdk-8u131-linux-x64.tar.gz -C /usr/lib/jvm （-C解压到指定的目录）

解压带有中文字符的zip文件：unzip -O gbk filename.zip 

### vim

退出编辑：输入i进入编辑模式，按下esc退出编辑，输入:w，保存不退出；:z/:wq，保存后退出；:q!，退出不保存（w：write，q：quit）

搜索：输入/+搜索的词，回车，输入n跳转下一个匹配词

删除行：按esc进入命令模式，dd删除当前行，Ndd删除当前行以下的n行

撤销上一个操作：命令模式下，按 u

恢复上一步被撤销的操作：ctrl+r

当vim非正常关闭时，会产生swp文件，在当前目录删除：rm .xxx.swp

### 查找文件

#### whereis

简单快速，直接从数据库查找，whereis 只能搜索二进制文件(-b)，man 帮助文件(-m)和源代码文件(-s)

查找tomcat：`whereis tomcat`

#### locate

快而全，通过“ /var/lib/mlocate/mlocate.db ”数据库查找，数据库不是实时更新，递归查找指定目录下的不同文件类型，刚添加的文件需手

动执行updatedb。

查找图片：locate background.jpg  

查找某个目录下所有图片：locate -ic /usr/share/\*.jpg(-c统计数目，-i忽略大小写)

#### which

小而精，which 本身是shell內建的一个命令，它只从PATH环境变量指定的路径去搜索，通常使用which来确定是否安装了某个命令。

查看是否安装man：`which man`

#### find

最强大，速度慢，第一个参数是搜索的地方。

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

global search regular expression and print out the line。全面搜索正则表达式，并将其打印出来。

### 高亮查找

```bash
grep --color "leo" /etc/passwd
```

### 环顾四周

`-A`表示除了展示匹配行之外，还要展示出匹配行下面的若干行。`-B`表示除了展示匹配行之外，还要展示出匹配行上面的若干行。`-C`表示除了展示匹配行之外，还要展示出匹配行上面和下面各若干行。

```bash
grep -C 1 leo passwd
```

### 打印行号

查找字符串mail，打印行号：

```bash
[root@VM-0-7-centos etc]# grep -n mail /etc/passwd
9:mail:x:8:12:mail:/var/spool/mail:/sbin/nologin
```

### 统计行数

```bash
[root@VM-0-7-centos etc]# grep -c mail /etc/passwd
1
```

### 不区分大小写

```bash
[root@VM-0-7-centos etc]# grep -i mail /etc/passwd
mail:x:8:12:mail:/var/spool/mail:/sbin/nologin
```

### 反查

搜索不包含root的行，-v实现反查效果：

```bash
[root@VM-0-7-centos etc]# grep -v "root" /etc/passwd
bin:x:1:1:bin:/bin:/sbin/nologin
daemon:x:2:2:daemon:/sbin:/sbin/nologin
adm:x:3:4:adm:/var/adm:/sbin/nologin
```

### 多文件查找

找出内容中含有first单词的文件：

```bash
[root@VM-0-7-centos test]# grep -l "first" *.txt
1.txt
```

找出不含 first 单词的文件：

```bash
[root@VM-0-7-centos test]# grep -L "first" *.txt
2.txt
3.txt
```

搜索/etc/passwd文件中开头是mail的行：

```bash
[root@VM-0-7-centos test]# grep '^mail' /etc/passwd
mail:x:8:12:mail:/var/spool/mail:/sbin/nologin
```

搜索 /etc/passwd 文件中行尾是nologin的行：

```bash
[root@VM-0-7-centos test]# grep 'nologin$' /etc/passwd
bin:x:1:1:bin:/bin:/sbin/nologin
daemon:x:2:2:daemon:/sbin:/sbin/nologin
```

精确匹配某个词，单纯使用bin会把sbin等也搜索出来：

```bash
[root@VM-0-7-centos test]# grep -w 'bin' /etc/passwd
root:x:0:0:root:/root:/bin/bash
bin:x:1:1:bin:/bin:/sbin/nologin
```

正则表达式：

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

以容易阅读的方式，显示磁盘使用情况：

```bash
df -h
```

指定文件磁盘使用情况：

```bash
[root@VM-0-7-centos etc]# df /etc/dhcp
Filesystem     1K-blocks     Used Available Use% Mounted on
/dev/vda1       51539404 23774760  25567400  49% /
```

### mount

挂载Linux系统外的文件。

挂载hda2到/mnt/hda2目录下。确定目录/mnt/hda2 已经存在。

```bash
mount /dev/hda2 /mnt/hda2
```

卸载hda2硬盘。先从挂载点/mnt/hda2退出。

```bash
umount /dev/hda2
```



## 内存

`free -h` -h以可读的方式展示。

```
              total        used        free      shared  buff/cache   available
Mem:           1.8G        1.1G        107M        1.1M        562M        515M
Swap:            0B          0B          0B

```

