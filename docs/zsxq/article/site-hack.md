你好，我是大彬。

昨天收到腾讯云的短信，一开始还以为是营销短信，仔细一看，好家伙，存在**恶意文件**等**安全风险**，看来是被入侵了。。

![](http://img.topjavaer.cn/img/202312290909237.png)

吓得我赶紧上小破站看看，果然，502了。。

![](http://img.topjavaer.cn/img/202312290849848.png)

登录腾讯云控制台，查看监控数据，发现服务器CPU资源持续**100**%。。

![](http://img.topjavaer.cn/img/202312290849903.png)

作为优质八股文选手，这个难不倒我，上来就是**top**命令伺候。

![](http://img.topjavaer.cn/img/202312290751593.png)

可以看到，一个叫 kswapd0 的进程跑的死死的。

那么这个 kswapd0 是啥？pid是 27343，通过命令 `ll /proc/27343`，可以看这个进程执行了 一个 `/root/.configrc5/a/kswapd0`的脚本 ，应该就是病毒程序。

![](http://img.topjavaer.cn/img/202312290819646.png)

紧接着查看下这个进程是否有对外连接端口，`netstat -anltp|grep kswapd0`，显示IP是 `179.43.139.84`，是一个瑞士的IP地址。。

![](http://img.topjavaer.cn/img/202312290803351.png)

分析`/var/log/secure` 日志，查找详细的入侵痕迹 `grep 'Accepted' /var/log/secure`

![](http://img.topjavaer.cn/img/202312291022633.png)

可以看到，有一个来自加拿大的IP地址 34.215.138.2 成功登录了，通过 publickey 密钥登录（可能是服务器上的恶意程序向.authorized_keys 写入了公钥），看来是被入侵无疑了。

然后习惯性看了下定时任务，`crontab -e`，好家伙，定时任务里面也有惊喜，入侵者还留下了几个定时任务。。

![](http://img.topjavaer.cn/img/202312290823467.png)

## 处理措施

1、在腾讯云**安全组**限制了 SSH 的登录IP， 之前的安全组 SSH 是放行所有IP。

2、将 SSH ROOT 密码修改。

![](http://img.topjavaer.cn/img/202312290917431.png)

3、将`/root/.ssh/authorized_keys`备份，然后删除。

4、直接杀掉27343进程，`kill -9 27343`

5、**清理定时任务**: `crontab -e`（这个命令会清理所有的定时任务，慎用）

6、删除/root/ 目录下的.configrc5文件夹：`rm -rf /root/.configrc5/`



一番操作之后，CPU就降下来了，重启服务后小破站便恢复正常访问了。

![](http://img.topjavaer.cn/img/202312290840463.png)



## 本次服务器被入侵的一些启示

1、用好云厂家的**安全组**。对一些关键端口，放行规则尽量最小

2、**封闭不使用的端口**，做到用一个开一个（通过防火墙和安全组策略）

3、服务器相关的一些**密码**尽量增加**复杂性**

4、检查开机启动 和 crontab 相关的内容

5、检查**异常**进程



以上就是这次服务器被入侵的排查处理过程和一些启示，希望大家以后没有机会用到~







