# 索引

## 创建索引

ALTER TABLE用来创建普通索引、UNIQUE索引或PRIMARY KEY索引。

```mysql
ALTER TABLE table_name ADD INDEX index_name (column_list)
ALTER TABLE table_name ADD UNIQUE (column_list)
ALTER TABLE table_name ADD PRIMARY KEY (column_list)
```

CREATE INDEX可对表增加普通索引或UNIQUE索引。

```mysql
CREATE INDEX index_name ON table_name (column_list)
CREATE UNIQUE INDEX index_name ON table_name (column_list)
```

在创建索引时，可以规定索引能否包含重复值。如果不包含，则索引应该创建为PRIMARY KEY或UNIQUE索引。

## 删除索引

```mysql
DROP INDEX index_name ON talbe_name
ALTER TABLE table_name DROP INDEX index_name
ALTER TABLE table_name DROP PRIMARY KEY #只有一个主键，不需要指定索引名
```

## 查看索引

```mysql
show index from tblname;
show keys from tblname;
```

