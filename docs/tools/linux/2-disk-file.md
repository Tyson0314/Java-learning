# 磁盘,文件,目录相关操作

## vim操作

```
#normal模式下 g表示全局, x表示查找的内容, y表示替换后的内容
:%s/x/y/g

#normal模式下
0  #光标移到行首(数字0)
$  #光标移至行尾
shift + g #跳到文件最后
gg #跳到文件头

#显示行号
:set nu

#去除行号
:set nonu

#检索
/xxx(检索内容)  #从头检索, 按n查找下一个
?xxx(检索内容)  #从尾部检索
```

## 打开只读文件,修改后需要保存时(不用切换用户即可保存的方式)

```
#在normal模式下
:w !sudo tee %
```

## 查看磁盘, 文件目录基本信息

```
#查看磁盘挂载情况
mount

#查看磁盘分区信息
df

#查看目录及子目录大小
du -H -h

#查看当前目录下各个文件, 文件夹占了多少空间, 不会递归
du -sh *
```

## wc命令

```
#查看文件里有多少行
wc -l filename

#看文件里有多少个word
wc -w filename

#文件里最长的那一行是多少个字
wc -L filename

#统计字节数
wc -c
```

## 常用压缩, 解压缩命令

### 压缩命令

```
tar czvf xxx.tar 压缩目录

zip -r xxx.zip 压缩目录
```

### 解压缩命令

```
tar zxvf xxx.tar

#解压到指定文件夹
tar zxvf xxx.tar -C /xxx/yyy/

unzip xxx.zip
```

## 变更文件所属用户, 用户组

```
chown eagleye.eagleye xxx.log
```

## cp, scp, mkdir

```
#复制
cp xxx.log

#复制并强制覆盖同名文件
cp -f xxx.log

#复制文件夹
cp -r xxx(源文件夹) yyy(目标文件夹)

#远程复制
scp -P ssh端口 username@10.10.10.101:/home/username/xxx /home/xxx

#级联创建目录
mkdir -p /xxx/yyy/zzz

#批量创建文件夹, 会在test,main下都创建java, resources文件夹
mkdir -p src/{test,main}/{java,resources}
```

## 比较两个文件

```
diff -u 1.txt 2.txt
```

## 日志输出的字节数,可以用作性能测试

```
#如果做性能测试, 可以每执行一次, 往日志里面输出 “.” , 这样日志中的字节数就是实际的性能测试运行的次数, 还可以看见实时速率.
tail -f xxx.log | pv -bt
```

## 查看, 去除特殊字符

```
#查看特殊字符
cat -v xxx.sh

#去除特殊字符
sed -i 's/^M//g’ env.sh  去除文件的特殊字符, 比如^M:  需要这样输入: ctrl+v+enter
```

## 处理因系统原因引起的文件中特殊字符的问题

```
#可以转换为该系统下的文件格式
cat file.sh > file.sh_bak

#先将file.sh中文件内容复制下来然后运行, 然后粘贴内容, 最后ctrl + d 保存退出
cat > file1.sh

#在vim中通过如下设置文件编码和文件格式
:set fileencodings=utf-8 ，然后 w （存盘）一下即可转化为 utf8 格式，
:set fileformat=unix

#在mac下使用dos2unix进行文件格式化
find . -name "*.sh" | xargs dos2unix
```

## tee, 重定向的同时输出到屏幕

```
awk ‘{print $0}’ xxx.log | tee test.log
```

