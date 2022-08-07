# 基本命令
## 启动

启动服务：`service mysqld start`

关闭服务：`service mysqld stop`

启动客户端：`mysql -uroot -p`  -u 后不要有空格（Ubuntu有空格）

## 数据库操作

```mysql
SHOW DATABASES;
CREATE DATABASE db_name;
USE db_name;
DROP DATABASE db_name;
```

## 表

创建表：`create table user (id int, name varchar(10))`

清空表数据：`truncate table user;`

查看表结构：`desc table_name/select columns from table_name`

`SHOW CREATE db` | `SHOW CREATE table`：显示创建特定数据库或表的MySQL语句

## 检索

检索不同的行：

```mysql
SELECT DISTINCT vend_id
FROM products;
```

限制结果：

```mysql
SELECT prod_name
FROM products
LIMIT 0, 5; #开始位置，行数|返回从第0行开始的5行数据
```

## 排序

```mysql
SELECT prod_name
FROM products
ORDER BY prod_name, prod_price DESC; #先按名称排序，再按价格排序 | DESC降序排列，默认ASC升序
```

找出最贵的物品：

```mysql
SELECT prod_price
FROM products
ORDER BY prod_price DESC
LIMIT 1; # 仅返回一行
```

子句顺序：FORM -- ORDER BY -- LIMIT，顺序不对会报错。

## 过滤

子句操作符：

| 操作符  | 说明     |
| ------- | -------- |
| =       | 等于     |
| <>      | 不等于   |
| !=      | 不等于   |
| <       | 小于     |
| <=      | 小于等于 |
| BETWEEN | 两值之间 |

### 不匹配检查：

```mysql
SELECT vend_id, prod_name
FROM products
WHERE vend_id <> 1003;
```

### 范围查询：

```mysql
SELECT prod_name, prod_price
FROM products
WHERE prod_price BETWEEN 5 AND 10;
```

### 空值检查

```mysql
SELECT prod_name
FROM products
WHERE prod_price IS NULL;
```

### 计算次序

```mysql
SELECT prod_name, prod_price
FROM products
WHERE vend_id = 1002 OR vend_id = 1003 AND prod_price >= 10; # AND优先级大于OR
```

### IN 操作符

```mysql
SELECT prod_name, product_price
FROM products
WHERE vend_id IN (1002, 1003)
ORDER BY prod_name;
```

IN操作符一般比OR操作符清单执行更快。IN的最大优点是可以包含其他SELECT语句，使得能够更动态地建立WHERE子句。

### NOT操作符

MySQL支持使用NOT 对IN 、BETWEEN 和EXISTS子句取反。

```mysql
SELECT prod_name, product_price
FROM products
WHERE vend_id NOT IN (1002, 1003)
```

### LIKE操作符

% 匹配0到多个任意字符。

```mysql
SELECT prod_id, prod_name
FROM products
WHERE prod_name LIKE '%jet%';
```

_ 匹配单个字符。

```mysql
SELECT prod_id, prod_name
FROM products
WHERE prod_name LIKE '_jet_';
```

通配符搜索比其他简单搜索耗时，不能过度使用通配符。

### LIMIT

limit 0,4 ：从第0条记录开始，取4条

### 正则表达式

OR 匹配：

```mysql
SELECT prod_name
FROM products
WHERE prod_name REGEXP '1000|2000'
ORDER BY prod_name;
```

匹配特定字符：

```mysql
SELECT prod_name
FROM products
WHERE prod_name REGEXP '[123] Rely' #匹配1或2或3 [^123]取反
ORDER BY prod_name;
```

匹配范围：

```mysql
SELECT prod_name
FROM products
WHERE prod_anem REGEXP '[1-5] Ton';#匹配1-5任意一个数字，[a-z]同理
```

匹配特殊字符：

```mysql
SELECT prod_name
FROM products
WHERE prod_anem REGEXP '\\.';#转义
```

匹配多个实例:

```mysql
SELECT prod_name
FROM products
WHERE prod_anem REGEXP '\\([0-9] sticks?\\)'; #?匹配它前面的任何字符出现0次或1次
```

匹配连着的四个数：

```mysql
SELECT prod_name
FROM products
WHERE prod_anem REGEXP '[[:digit:]]{4}'; #[:digit:]匹配任意数字
```

定位符：

| 元字符  | 说明     |
| ------- | -------- |
| ^       | 文本开始 |
| $       | 文本结束 |
| [[:<:]] | 词开始   |
| [[:>:]] | 词结束   |

查找一个数（包括小数点开始的数）开始的所有产品：

```mysql
SELECT prod_name
FROM products
WHERE prod_name REGEXP '^[0-9\\.]'
ORDER BY prod_name;
```

简单的正则表达式测试：

```mysql
SELECT 'hello' REGEXP '[0-9]';#REGEXP检查返回0或1；此处返回0
```

