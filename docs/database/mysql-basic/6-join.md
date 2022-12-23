# 连接
## 内连接

找出供应商生产的产品。

```mysql
SELECT vend_name, prod_name
FROM vendors INNER JOIN products
ON vendors.vend_id = products.vend_id; #连接条件使用on子句
```

等价于：

```mysql
SELECT vend_name, prod_name
FROM vendors, products
WHERE vendors.vend_id = products.vend_id;
```

没有给出连接条件的话，会得到两张表的笛卡尔积。

## 自连接

找出生产nike的供应商生产的所有物品。

```mysql
SELECT prod_id, prod_name
FROM products AS p1, products AS p2
WHERE p1.vend_id = p2.vend_id
	AND p2.prod_id = 'nike';
```

## 自然连接

natural join是对两张表中字段名和数据类型都相同的字段进行**等值连接**，并返回符合条件的结果 。

```mysql
SELECT * FROM role NATURAL JOIN user_role;
```

返回结果：

![](http://img.dabin-coder.cn/image/20220530235619.png)

## 内连接

显示符合连接条件的记录。没有设置连接条件则返回笛卡尔积的结果。join 默认是 inner join。

```mysql
SELECT * FROM role INNNER JOIN user_role
```

返回结果：

![](http://img.dabin-coder.cn/image/20220530235640.png)

join…using(column)按指定的属性做等值连接。
join…on tableA.column1 = tableB.column2 指定条件。

```mysql
SELECT * FROM role INNER JOIN user_role ON role.role_id = user_role.role_id
```

返回结果：

![](http://img.dabin-coder.cn/image/20220530235654.png)

## 外连接

左外联接（Left Outer Join）：除了匹配2张表中相关联的记录外，还会匹配左表中剩余的记录，右表中未匹配到的字段用NULL表示。
右外联接（Right Outer Join）：除了匹配2张表中相关联的记录外，还会匹配右表中剩余的记录，左表中未匹配到的字段用NULL表示。
在判定左表和右表时，要根据表名出现在Outer Join的左右位置关系。

查找所有客户及其订单，包括没有下过订单的客户。使用左外连接，保留左边表的所有记录。

```mysql
SELECT customer.cust_id, order.order_num
FROM customers LEFT OUTER JOIN orders
ON customers.cust_id = order.cust_id;
```

## 多表连接

```mysql
SELECT goal.player, eteam.teamname, game.stadium, game.mdate
FROM game JOIN goal
ON game.id = goal.matchid 
JOIN eteam
ON eteam.id = goal.teamid
WHERE eteam.id = 'GRE'
```

