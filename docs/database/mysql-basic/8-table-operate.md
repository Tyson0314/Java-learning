# 表操作

## 创建表

```mysql
CREATE TABLE productnotes
(
	note_id int NOT NULL AUTO_INCREMENT,
    note_text text NULL,
    quanlity int NOT NULL DEFAULT 1, # 默认值，只支持常量
    PRIMARY KEY(note_id),
    FULLTEXT(note_text)
) ENGINE=MyISAM;
```

主键中只能使用NOT NULL值的列。

## 更新表

数据库表的更改不能撤销，应先做好备份。

添加列：

```mysql
ALTER TABLE vendors
ADD vend_phone CHAR(20);
```

删除列：

```mysql
ALTER TABLE vendors
DROP COLUMN vend_phone;
```

更改列属性：

```mysql
ALTER TABLE vendors
MODIFY vend_phone CHAR(16);
```

复杂的表结构更改一般需要手动删除过程：

- 用新的列布局创建一个新表；

- 使用INSERT SELECT语句，从旧表复制数据到新表；

- 检验包含所需数据的新表；
- 重命名旧表（如果确定，可以删除它）；

- 用旧表原来的名字重命名新表；

- 重新创建触发器、存储过程、索引和外键。

## 约束

添加主键约束：

```mysql
ALTER TABLE vendors
ADD CONSTRAINT pk_vendors PRIMARY KEY(vend_id);
```

删除主键约束：

```mysql
ALTER TABLE vendors
DROP PRIMARY KEY;
```

添加外键约束：

```mysql
ALTER TABLE products
ADD FOREIGN KEY(vendor_id) REFERENCES vendors(vendor_id);
```

删除外键约束：

```mysql
ALTER TABLE products DROP FOREIGN KEY vendor_id;
```

## 删除表

`DROP TABLE cumstomers`

## truncate、delete与drop区别

**相同点：**

1. truncate和不带where子句的delete、以及drop都会删除表内的数据。

2. drop、truncate都是DDL语句(数据定义语言)，执行后会自动提交。

**不同点：**

1. truncate 和 delete 只删除数据不删除表的结构；drop 语句将删除表的结构被依赖的约束、触发器、索引；

2. 速度，一般来说: drop> truncate > delete。

## 重命名表

`RENAME TABLE cusmtomers TO cust`
