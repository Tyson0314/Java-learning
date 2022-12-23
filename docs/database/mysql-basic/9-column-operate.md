# 列操作

## 插入数据

MySQL用单条INSERT语句处理多个插入比使用多条INSERT语句快。

```mysql
INSERT INTO customers(cust_name, cust_city)
	VALUES('Tyson', 'GD'),
		('sophia','GZ');
```

INSERT操作可能很耗时（特别是有很多索引需要更新时），而且它可能降低等待处理的SELECT语句的性能。降低INSERT语句的优先级：`INSERT LOW_PRIORITY INTO`

## 更新数据

如果用UPDATE语句更新多行，并且在更新这些行中的一行或多行时出一个现错误，则整个UPDATE操作被取消。为了在发生错误时也继续进行更新，可使用IGNORE关键字：`UPDATE IGNORE customers...`

```mysql
UPDATE customers
SET cust_city = NULL
WHERE cust_id = 1005;
```

返回值是受影响的记录数。

## 删除数据

如果想从表中删除所有行，不要使用DELETE。可使用TRUNCATE TABLE语句，它完成相同的工作，但速度更快（TRUNCATE实际是删除原来的表并重新创建一个表，而不是逐行删除表中的数据）。

```mysql
DELETE FROM customers
WHERE cust_id = 1006;
```

如果执行DELETE语句而不带WHERE子句，表的所有数据都将被删除。MySQL没有撤销操作，应该非常小心地使用UPDATE和DELETE。

delete使用别名的时候，要在delete和from间加上删除表的别名。

```mysql
DELETE a #加上删除表的别名
FROM table1 a
WHERE a.status = 0
AND EXISTS
	(SELECT b.id FROM table2 b
    WHERE b.id = a.id);
```

