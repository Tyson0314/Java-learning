# 聚集函数

Sum:求和
Avg:求平均数
Max:求最大值
 Min:求最小值
 Count:求记录

```mysql
SELECT SUM(item_price*quanlity) AS total_price
FROM orderitems
WHERE order_num = 2005;
```

聚集不同值：

```mysql
SELECT AVG(DISTINCT prod_price) AS avg_price #只考虑不同价格
FROM products
WHERE vend_id = 1003;
```

