# 函数
## 文本处理

```mysql
SELECT vend_name, Upper(vend_name) AS vend_name_upcase
FROM vendors
ORDER BY vend_name;
```

Soundex()函数，匹配所有同音字符串。

```mysql
SELECT cust_name, cust_contact
FROM customers
WHERE Soundex(cust_contact) = Soundex('Y Lie');
```

返回数据：`Tyson Y lee`

## 日期处理函数

![](http://img.dabin-coder.cn/image/20220530235607.png)
查找2005年9月的所有订单：

```mysql
SELECT cust_id, order_num
FROM orders
WHERE Date(order_date) BETWEEN '2005-09-01' AND '2005-09-30';
```

或者

```mysql
SELECT cust_id, order_num
FROM orders
WHERE Year(order_date) = 2005 AND Month(order_date) = 9;
```

## 数值处理函数

![](http://img.dabin-coder.cn/image/20220530233617.png)

