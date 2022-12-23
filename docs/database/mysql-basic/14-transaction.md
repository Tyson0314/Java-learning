# 事务处理

事务处理可以用来维护数据库的完整性。它保证成批的MySQL操作要么完全执行，要么完全不执行。

CREATE/DROP 操作不能回退，即便可以执行回退操作，回退不会有效果。

执行事务过程，一旦某个SQL失败，则之前执行成功的SQL会被自动撤销。

## 语法

```mysql
START TRANSACTION;
DELETE FROM orderitems WHERE order_num = 20010;
DELETE FROM orders WHERE order_num = 20010;
COMMIT;
```

当COMMIT或ROLLBACK语句执行后，事务会自动关闭。

## 保留点

为了支持回退部分事务处理，必须能在事务处理块中合适的位置放置占位符。这样，如果需要回退，可以回退到某个占位符。

保留点在事务处理完成后自动释放。

```mysql
...
SAVEPOINT delete1;
...
ROLLBACK TO delete1;
```

