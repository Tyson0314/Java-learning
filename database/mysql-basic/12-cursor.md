# 游标

存储了游标之后，应用程序可以根据需要滚动或浏览其中的数据。MySQL游标只能用于存储过程（和函数）。

## 创建游标

DECLARE 命名游标。存储过程处理完成后，游标便消失（游标只存在于存储过程）。定义游标之后，便可以打开它。

```mysql
CREATE PROCEDURE processorders()
BEGIN
	DECLARE ordernumbers CURSOR
	FOR
	SELECT order_num FROM orders;
END;
```

## 使用游标

`OPEN ordernumbers` 打开游标。
`CLOSE ordernumbers` CLOSE释放游标使用的所有内部内存和资源。

```mysql
CREATE PROCEDURE processorders()
BEGIN

	DECLARE done BOOLEAN DEFAULT 0;
	DECLARE o INT;
	DECLARE t DECIMAL(8, 2);
	
	DECLARE ordernumbers CURSOR
	FOR
	SELECT order_num FROM orders;
	
	DECLARE CONTINUE HANDLER FOR SQLSTATE '02000' SET done=1; #游标移到最后
	
	CREATE TABLE IF NOT EXISTS ordertotals
		(order_num INT, total DECIMAL(8,2));
	-- 打开游标
	OPEN ordernumbers;
	
	-- 循环
	REPEAT
	FETCH ordernumbers INTO o;
	CALL ordertotal(o, 1, t);
	
	-- 插入订单号和订单金额
	INSERT INTO ordertotals(order_num, total)
	VALUES(o, t);
	
	-- done为1结束循环
	UNTIL done END REPEAT;
	
	CLOSE ordernumbers;
END;
```

存储过程还在运行中创建了一个新表，。这个表将保存存储过程生成的结果。FETCH取每个order_num，然后用CALL执行另一个存储过程，计算每个订单税后金额。最后，用INSERT保存每个订单的订单号和金额。