# 网络相关

## 查看什么进程使用了该端口

```
lsof -i:port
```

## 获取本机ip地址

```
/sbin/ifconfig -a|grep inet|grep -v 127.0.0.1|grep -v inet6|awk '{print $2}'|tr -d "addr:"
```

## iptables

```
#查看iptables状态
service iptables status

#要封停一个ip
iptables -I INPUT -s ***.***.***.*** -j DROP

#要解封一个IP，使用下面这条命令：
iptables -D INPUT -s ***.***.***.*** -j DROP

备注: 参数-I是表示Insert（添加），-D表示Delete（删除）。后面跟的是规则，INPUT表示入站，***.***.***.***表示要封停的IP，DROP表示放弃连接。

#开启9090端口的访问
/sbin/iptables -I INPUT -p tcp --dport 9090 -j ACCEPT 

#防火墙开启、关闭、重启
/etc/init.d/iptables status
/etc/init.d/iptables start
/etc/init.d/iptables stop
/etc/init.d/iptables restart
```

## nc命令, tcp调试利器

```
#给某一个endpoint发送TCP请求,就将data的内容发送到对端
nc 192.168.0.11 8000 < data.txt

#nc可以当做服务器，监听某个端口号,把某一次请求的内容存储到received_data里
nc -l 8000 > received_data

#上边只监听一次，如果多次可以加上-k参数
nc -lk 8000
```

## tcpdump

```
#dump出本机12301端口的tcp包
tcpdump -i em1 tcp port 12301 -s 1500 -w abc.pcap
```

## 跟踪网络路由路径

```
#traceroute默认使用udp方式, 如果是-I则改成icmp方式
traceroute -I www.163.com

#从ttl第3跳跟踪
traceroute -M 3 www.163.com  

#加上端口跟踪
traceroute -p 8080 192.168.10.11
```

## ss

```
#显示本地打开的所有端口
ss -l 

#显示每个进程具体打开的socket
ss -pl 

#显示所有tcp socket
ss -t -a 

#显示所有的UDP Socekt
ss -u -a 

#显示所有已建立的SMTP连接
ss -o state established '( dport = :smtp or sport = :smtp )'  

#显示所有已建立的HTTP连接 
ss -o state established '( dport = :http or sport = :http )'  

找出所有连接X服务器的进程
ss -x src /tmp/.X11-unix/*  

列出当前socket统计信息
ss -s 

解释：netstat是遍历/proc下面每个PID目录，ss直接读/proc/net下面的统计信息。所以ss执行的时候消耗资源以及消耗的时间都比netstat少很多
```

## netstat

```
#输出每个ip的连接数，以及总的各个状态的连接数
netstat -n | awk '/^tcp/ {n=split($(NF-1),array,":");if(n<=2)++S[array[(1)]];else++S[array[(4)]];++s[$NF];++N} END {for(a in S){printf("%-20s %s\n", a, S[a]);++I}printf("%-20s %s\n","TOTAL_IP",I);for(a in s) printf("%-20s %s\n",a, s[a]);printf("%-20s %s\n","TOTAL_LINK",N);}'

#统计所有连接状态, 
#CLOSED：无连接是活动的或正在进行
#LISTEN：服务器在等待进入呼叫
#SYN_RECV：一个连接请求已经到达，等待确认
#SYN_SENT：应用已经开始，打开一个连接
#ESTABLISHED：正常数据传输状态
#FIN_WAIT1：应用说它已经完成
#FIN_WAIT2：另一边已同意释放
#ITMED_WAIT：等待所有分组死掉
#CLOSING：两边同时尝试关闭
#TIME_WAIT：主动关闭连接一端还没有等到另一端反馈期间的状态
#LAST_ACK：等待所有分组死掉
netstat -n | awk '/^tcp/ {++state[$NF]} END {for(key in state) print key,"\t",state[key]}'

#查找较多time_wait连接
netstat -n|grep TIME_WAIT|awk '{print $5}'|sort|uniq -c|sort -rn|head -n20
```

