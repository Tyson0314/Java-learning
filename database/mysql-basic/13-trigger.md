# 触发器

触发器提供SQL语句自动执行的功能。DELETE/INSERT/UPDATE支持触发器，其他SQL语句不支持。

## 创建

创建触发器四要素：1.唯一的触发器名（MySQL5规定触发器名在表中唯一，数据库没要求）；2.触发器关联的表；3.相应的SQL语句；4.何时执行（处理之前或者之后）。

```mysql
CREATE TRIGGER newproduct AFTER INSERT ON products #插入之后执行
FOR EACH ROW SELECT 'product added'; #对每个插入行执行
```

只有表支持触发器，视图不支持。单一触发器不能与多个事件或多个表关联，如果需要对INSERT和UPDATE操作执行触发器，则应该定义两个触发器。

## 删除

`DROP TRIGGER newproduct`

## 使用

INSERT 触发器可饮用名为 NEW  的虚拟表，访问被插入的行。NEW中的值也可以被更新（允许更改被插入的值）。

```mysql
CREATE TRIGGER neworder AFTER INSERT ON order
FOR EACH ROW SELECT NEW.order_num; #返回新的订单号
```

DELETE 触发器可以引用名为 OLD 的虚拟表，访问被删除的行。OLD中的值全都是只读的，不能更新。

```mysql
CREATE TRIGGER deleteorder BEFORE DELETE ON orders
FOR EACH ROW
BEGIN
	INSERT INTO archive_orders(order_num, cust_id)
	VALUES(OLD.order_num, OLD.cust_id);
END;
```

订单删除之前保存订单信息到存档表。

UPDATE 触发器可以引用名为 OLD 的虚拟表访问以前的值，引用一个名为NEW的虚拟表访问新更新的值。NEW 值可被更新，OLD 值是只读的。

下面的例子保证州名缩写总是大写。

```mysql
CREATE TRIGGER updatevendor BEFORE UPDATE ON vendor
FOR EACH ROW SET NEW.vend_state = Upper(NEW.vend_state);
```


