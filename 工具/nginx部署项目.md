<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [简介](#%E7%AE%80%E4%BB%8B)
  - [基本命令](#%E5%9F%BA%E6%9C%AC%E5%91%BD%E4%BB%A4)
  - [配置文件](#%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6)
- [应用](#%E5%BA%94%E7%94%A8)
  - [动静分离](#%E5%8A%A8%E9%9D%99%E5%88%86%E7%A6%BB)
- [后端部署](#%E5%90%8E%E7%AB%AF%E9%83%A8%E7%BD%B2)
- [前端部署](#%E5%89%8D%E7%AB%AF%E9%83%A8%E7%BD%B2)
- [多站点配置](#%E5%A4%9A%E7%AB%99%E7%82%B9%E9%85%8D%E7%BD%AE)
- [HTTPS配置](#https%E9%85%8D%E7%BD%AE)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 简介

[Nginx入门指南](https://juejin.im/post/5e982d4b51882573b0474c07#heading-1)

轻量级的 HTTP 服务器。

### 基本命令

nginx安装目录：使用whereis nginx查看安装路径

启动nginx：安装目录/sbin/nginx

停止nginx：安装目录/sbin/nginx -s stop

重启nginx：安装目录/sbin/nginx -s reload

查看nginx是否正在运行：`netstat -anput | grep nginx`

### 配置文件

配置文件路径：`/usr/local/nginx/conf/nginx.conf`

日志路径：`/usr/local/nginx/logs/`

配置文件介绍：

```
server {  
        # 当nginx接到请求后，会匹配其配置中的service模块
        # 匹配方法就是将请求携带的host和port去跟配置中的server_name和listen相匹配
        listen       8080;        
        server_name  localhost; # 定义当前虚拟主机（站点）匹配请求的主机名

        location / {
            root   html; # Nginx默认值
            # 设定Nginx服务器返回的文档名
            index  index.html index.htm; # 先找根目录下的index.html，如果没有再找index.htm
        }
}
```

server{ } 其实是包含在 http{ } 内部的。每一个 server{ } 是一个虚拟主机（站点）。

## 应用

### 动静分离

![1588431199776](..\img\1588431199776.png)

静态请求直接从 nginx 服务器所设定的根目录路径去取对应的资源，动态请求转发给后端去处理。不仅能给应用服务器减轻压力，将后台api接口服务化，还能将前后端代码分开并行开发和部署。

## 后端部署

1. 修改配置文件，如端口、主机等；

2. 执行 package 打包项目，在 target 目录下生成 jar 包，上传到服务器；

3. jar 包目录下运行 `./start.sh` 启动服务；

   启动脚本 start.sh：`nohup java -jar xxx.jar --spring.profiles.active=prod &`

   停止脚本 stop.sh：

   ```shell
   PID=$(ps -ef | grep eladmin-system-2.4.jar | grep -v grep | awk '{ print $2 }')
   if [ -z "$PID" ]
   then
   echo Application is already stopped
   else
   echo kill $PID
   kill $PID
   fi
   ```

   新建 log 文件 nohup.out：`touch nohup.out`

   查看日志脚本 log.sh：`tail -f nohup.out`

   所有脚本放在同一目录下。

4. 运行 `./stop.sh` 停止服务

5. 运行 `./log.sh`查看日志

6. 配置 nginx。使用 nginx 代理 Java 服务。

   ```json
   #auth|api|avatar开头的请求发送到后端服务上
   location ~* ^/(auth|api|avatar|file/) {
       proxy_pass http://localhost:8000;
       proxy_set_header Host $http_host;
       proxy_connect_timeout 150s;
       proxy_send_timeout 150s;
       proxy_read_timeout 150s;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
   }
   ```



## 前端部署

1. 修改后端接口地址 `http://xxx:80`，请求会被代理到`http://127.0.0.1:8000`

2. `npm run rebuild:prod` 打包项目生成 dist 文件夹，上传到服务器项目目录下；

3. 配置 nginx。

   ```
       server {
           listen 80; #localhost:80请求nginx服务器时，该请求就会被匹配进该代码块的 server{ } 中执行。
           server_name  localhost;
           root /home/eladmin/file/dist;
           index index.html;
           #charset koi8-r;
   
           #access_log  logs/host.access.log  main;
   
           location / {
               try_files $uri $uri/ @router;
               index  index.html;
           }
   
           location @router {
               rewrite ^.*$ /index.html last;
           }
           #auth|api|avatar开头的请求发送到后端服务上
           location ~* ^/(auth|api|avatar|file/) {
               proxy_pass http://localhost:8000;
               proxy_set_header Host $http_host;
               proxy_connect_timeout 150s;
               proxy_send_timeout 150s;
               proxy_read_timeout 150s;
               proxy_set_header X-Real-IP $remote_addr;
               proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           }
   	}
   ```

   

## 多站点配置

nginx 配置：

1. /etc/nginx/nginx.conf 中 http 节点增加`include /etc/nginx/conf.d/*.conf` 不同站点使用不同的配置文件。

   ```
   http {
       include       mime.types;
       default_type  application/octet-stream;
       keepalive_timeout  65;
   
       include /etc/nginx/conf.d/*.conf; #配置多个站点
       
   	server {
   		xxx
   	}
   	xxx
   }
   ```

2. 新建/etc/nginx/conf.d/blog.conf，配置nginx：

   ```
   #blog
   server {
       listen       80;
       server_name  localhost;
       #访问vue项目
       location / {
           root   /home/blog/dist;
           index  index.html;
       }
       #将api转发到后端
       location /api/ {
           proxy_pass http://129.204.179.3:8001/;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header REMOTE-HOST $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       }
       #转发图片请求到后端
       location /img/ {
           proxy_pass http://129.204.179.3:8001/img/;
       }
   }
   ```

后端部署：

1. idea--maven--project name--lifecycle--package，打包项目，在target目录生成 jar 包，拷贝到服务器。这里存放到 /home/blog 目录下。

2. 导入项目 sql 文件 `source blog.sql`。

3. 运行 jar 包。

   ```
   #不挂断地运行命令；&表示后台运行；输出都将附加到当前目录的 nohup.out 文件
   nohup java -jar blog-springboot-1.0.jar &
   
   #结束运行
   PID=$(ps -ef | grep blog-springboot-1.0.jar | grep -v grep | awk '{ print $2 }')
   if [ -z "$PID" ]
   then
   echo Application is already stopped
   else
   echo kill -9 $PID
   kill -9 $PID
   fi
   ```

前端部署：运行 `npm run build` 生成 dist 文件夹，将 dist 文件夹下面的文件拷贝到 /home/blog/dist 目录。

环境准备：启动 mysql、redis、rabbitmq 等。

```bash
service mysqld start
/sbin/service rabbitmq-server start
```

启动 nginx：`安装目录/sbin/nginx`	



## HTTPS配置

[nginx配置HTTPS](https://www.cnblogs.com/ambition26/p/14077773.html)

1. 安装 nginx ssl模块；

2. 申请 ssl 证书，下载证书，复制到服务器某个目录下；

3. 修改 /usr/local/nginx/conf/nginx.conf 文件

   ```java
   server {
       listen       80;
       server_name  localhost;
       rewrite ^(.*)$ https://$host$1 permanent; #http请求会被转发到https
       #访问vue项目
       location / {
           root   /home/blog/dist;
           index  index.html;
       }
       #将api转发到后端
       location /api/ {
           proxy_pass http://129.204.179.3:8001/;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header REMOTE-HOST $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       }
       #转发图片请求到后端
       location /img/ {
           proxy_pass http://129.204.179.3:8001/img/;
       }
   }
   server {
           listen 443 ssl;  # 1.1版本后这样写
           server_name tysonbin.com; #填写绑定证书的域名
           ssl_certificate /usr/local/nginx/cert/1_tysonbin.com_bundle.crt;  # 指定证书的位置，绝对路径
           ssl_certificate_key /usr/local/nginx/cert/2_tysonbin.com.key;  # 绝对路径
           ssl_session_timeout 5m;
           ssl_protocols TLSv1 TLSv1.1 TLSv1.2; #按照这个协议配置
           ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;#按照这个套件配置
           ssl_prefer_server_ciphers on;
           location / {
               root   /home/blog/dist; #站点目录，绝对路径
               index  index.html;
           }
   
       #将api转发到后端
       location /api/ {
           proxy_pass https://tysonbin.com:8001/;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header REMOTE-HOST $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       }
       #转发图片请求到后端
       location /img/ {
           proxy_pass https://tysonbin.com:8001/img/;
       }
   }
   ```

   4. 执行`/usr/local/nginx/sbin/nginx -s reload`，重启nginx。

springboot配置https：

1. 复制 tomcat 目录下的 tysonbin.com.jks 到 application.yml 同级目录。

2. 修改 application.yml：

   ```yaml
   server:
     port: 8001
     ssl:
       #SSL证书路径 一定要加上classpath:
       key-store: classpath:tysonbin.com.jks
       #SSL证书密码，在证书tomcat目录下的keystorePass.txt或者是设置的私钥密码
       key-store-password: tx.123456
       #证书类型
       key-store-type: JKS
   ```

3. 重新生成jar包，将jar包和tysonbin.com.jks文件一起放到服务器同一个目录下。