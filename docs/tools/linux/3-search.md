# 检索相关

## grep

```
#反向匹配, 查找不包含xxx的内容
grep -v xxx

#排除所有空行
grep -v '^/pre>

#返回结果 2,则说明第二行是空行
grep -n “^$” 111.txt    

#查询以abc开头的行
grep -n “^abc” 111.txt 

#同时列出该词语出现在文章的第几行
grep 'xxx' -n xxx.log

#计算一下该字串出现的次数
grep 'xxx' -c xxx.log

#比对的时候，不计较大小写的不同
grep 'xxx' -i xxx.log
```

## awk

```
#以':' 为分隔符,如果第五域有user则输出该行
awk -F ':' '{if ($5 ~ /user/) print $0}' /etc/passwd 

#统计单个文件中某个字符（串）(中文无效)出现的次数
awk -v RS='character' 'END {print --NR}' xxx.txt
```

## find检索命令

```
#在目录下找后缀是.mysql的文件
find /home/eagleye -name '*.mysql' -print

#会从 /usr 目录开始往下找，找最近3天之内存取过的文件。
find /usr -atime 3 –print

#会从 /usr 目录开始往下找，找最近5天之内修改过的文件。
find /usr -ctime 5 –print

#会从 /doc 目录开始往下找，找jacky 的、文件名开头是 j的文件。  
find /doc -user jacky -name 'j*' –print

#会从 /doc 目录开始往下找，找寻文件名是 ja 开头或者 ma开头的文件。
find /doc \( -name 'ja*' -o- -name 'ma*' \) –print

#会从 /doc 目录开始往下找，找到凡是文件名结尾为 bak的文件，把它删除掉。-exec 选项是执行的意思，rm 是删除命令，{ } 表示文件名，“\;”是规定的命令结尾。 
find /doc -name '*bak' -exec rm {} \;
```

