# 视图

视图为虚拟的表。视图提供了一种MySQL的SELECT语句层次的封装，可用来简化数据处理以及重新格式化基础数据或保护基础数据。

## 应用

- 重用SQL语句。
- 保护数据。可以给用户授予表的特定部分的访问权限而不是整个表的访问权限。
- 更改数据格式和表示。视图可返回与底层表的表示和格式不同的数据。

## 限制

- 与表一样，视图必须唯一命名
- 视图不能索引，也不能有关联的触发器或默认值。
- 视图可以和表一起使用。例如，编写一条联结表和视图的SELECT语句。
- ORDER BY可以用在视图中，但如果从该视图检索数据SELECT中也含有ORDER BY，那么该视图中的ORDER BY将被覆盖。

## 语法

`CREATE VIEW`：创建视图

`SHOW CREATE VIEW viewname`：查看创建视图的语句

`DROP VIEW viewname`：删除视图

`CREATE ORREPLACE VIEW`：更新视图，相当于先用`DROP`再用`CREATE`

## 简化复杂连接

创建一个视图，返回订购了任意产品的客户列表。

```mysql
CREATE VIEW productcustomers AS
SELECT cust_name, orders, orderitems
FROM customers, orders, orderitems
WHERE orderitems.order_num = orders.order_num
	AND customers.cust_id = orders.cust_id;
```

使用视图：

```mysql
SELECT cust_name, cust_contact
FROM productcustomers
WHERE prod_id = 'nike';
```

## 更新视图

对视图增加或删除行，实际上是对其基表增加或删除行。视图主要用于数据检索。