## 简介

[Nginx入门指南](https://juejin.im/post/5e982d4b51882573b0474c07#heading-1)

轻量级的 HTTP 服务器。

### 基本命令

nginx安装目录：usr/local/nginx

启动nginx：安装目录/sbin/nginx

停止nginx：安装目录/sbin/nginx -s stop

重启nginx：安装目录/sbin/nginx -s reload

### 配置文件

配置文件路径：`/usr/local/nginx/conf/nginx.conf`

日志路径：`/usr/local/nginx/logs/`

配置文件介绍：

```json
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

静态请求直接从 nginx 服务器所设定的根目录路径去取对应的资源，动态请求转发给真实的后台（前面所说的应用服务器，如图中的Tomcat）去处理。不仅能给应用服务器减轻压力，将后台api接口服务化，还能将前后端代码分开并行开发和部署。

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

   ```json
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

   