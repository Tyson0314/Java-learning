# 权限

MySQL用户账号和信息存储在名为mysql的MySQL数据库中。

获取用户账号列表：

```mysql
USE mysql;
SELECT user FROM user;
```

创建用户账号：`CREATE USER tyson IDENTIFIED BY 'abc123'`

修改密码：`SET PASSWORD FOR tyson = Password('xxx');`，新密码需传递到Password()函数进行加密。

设置当前用户密码：`SET PASSWORD = Password('xxx');`

重命名账号：`RENAME USER tyson TO tom`

删除用户账号：`DROP USER tyson`

查看访问权限：`SHOW GRANTS FOR tyson`，返回`USAGE ON *.*`则表示没有权限。

授予访问权限：`GRANT SELECT ON mall.# TO tyson`，允许用户在mall数据库所有表使用SELECT。

撤销权限：`REVOKE SELECT, INSERT ON mall.* FROM tyson`，被撤销的访问权限必须存在，否则会出错。

GRANT和REVOKE可在几个层次上控制访问权限：

- 整个服务器，使用GRANT ALL和REVOKE ALL；
- 整个数据库，使用ON database.*；
- 特定的表，使用ON database.table；
- 特定的列；
- 特定的存储过程。

