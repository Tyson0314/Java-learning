# 存储过程

为以后的使用而保存的一条或多条MySQL语句的集合。可将其视为批文件。
为什么使用存储过程：

- 把复杂处理进行封装，简化复杂的操作；
- 提高性能，存储过程比单独SQL语句更快；

## 创建

返回产品平均价格的存储过程：

```mysql
CREATE PROCEDURE productpricing() # 可以接受参数
BEGIN
	SELECT Avg(prod_price) AS priceaverage
	FROM products;
END;
```

BEGIN/END 用来限定存储过程体。此段代码仅创建了存储过程，未执行。

## 调用

`CALL productpricing()`

## 删除

存储过程在创建之后，被保存在服务器上以供使用，直至被删除。
`DROP PROCEDURE productpricing IF EXISTS`

## 参数

MySQL支持IN（传递给存储过程）、OUT（从存储过程传出）和INOUT（对存储过程传入和传出）类型的参数。
接受订单号并返回该订单的金额：

```mysql
CREATE PROCEDURE ordertotal(
	IN ordernum INT,
	OUT ordersum DECIMAL(8, 2)
)
BEGIN
	SELECT Sum(item_price * quantity)
	FROM orderitems
	WHERE order_num = ordernum
	INTO ordersum;
END;
```

调用存储过程：`CALL ordertotal(20, @total);`
显示订单金额：`SELECT @total;`

## 实例

获取订单税后金额（订单金额+税收）。

```mysql
CREATE PROCEDURE ordertotal(
	IN onum INT,
	IN taxable BOOLEAN, # 是否计税
	OUT ototal DECIMAL(8, 2)
) COMMENT 'order total, adding tax'
BEGIN
	DECLARE total DECIMAL(8, 2);
	DECLARE taxrate INT DEFAULT 6;

	SELECT Sum(item_price * quanlity)
	FROM orderitems
	WHERE order_num = onum
	INTO total;

	IF taxable THEN
		SELECT total + (total / 100 * taxrate) INTO total;
	END IF;
	-- SELECT total INTO ototal;
END;
```

调用存储过程：

```mysql
CALL ordertotal(20005, 1, @total);
SELECT @total;
```

## 查看

创建存储过程的 CREATE 语句。

```mysql
SHOW CREATE PROCEDURE ordertotal;
```

获得包括何时、由谁创建等详细信息的存储过程列表，使用`SHOW PROCEDURE STATUS LIKE 'ordertotal';`

查看存储过程状态：

```mysql
SHOW PROCEDURE status;
```

