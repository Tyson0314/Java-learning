# 分组

单独地使用group  by没意义，它只能显示出每组记录的第一条记录。

```mysql
SELECT * FROM orders
GROUP BY cust_id;
```

![](http://img.dabin-coder.cn/image/20220530233523.png)

除聚集计算语句外，SELECT语句中的每个列都必须在GROUP BY子句中给出。

```mysql
SELECT vend_id, COUNT(*) AS num_prods #vend_id在GROUP BY子句给出
FROM products
GROUP BY vend_id;
```

GROUP BY子句必须出现在WHERE子句之后，ORDER BY子句之前。

## 过滤分组

having 用来分组查询后指定一些条件来输出查询结果，having作用和where类似，但是having只能用在group  by场合，并且必须位于group  by之后order  by之前。

```mysql
SELECT cust_id, COUNT(*) AS orders
FROM orders
GROUP BY cust_id
HAVING COUNT(*) >= 2;
```

## having和where区别

```mysql
SELECT cust_id FROM orders GROUP BY cust_id HAVING COUNT(cust_id) >= 2;
SELECT cust_id FROM orders GROUP BY cust_id WHERE COUNT(cust_id) >= 2; #Error Code : 1064
```

第一个sql语句可以执行，但是第二个会报错。

- WHERE子句不起作用，因为过滤是基于分组聚集值而不是特定行值的。

- 二者作用的对象不同，where子句作用于表和视图，having作用于组。

- WHERE在数据分组前进行过滤，HAVING在数据分组后进行过滤。

```mysql
SELECT vend_id, COUNT(*) AS num_prods
FROM products
WHERE prod_price >= 10
GROUP BY vend_id
HAVING COUNT(*) >= 2;
```

WHERE子句过滤所有prod_price至少为10的行。然后按vend_id分组数据，HAVING子句过滤计数为2或2以上的分组。
