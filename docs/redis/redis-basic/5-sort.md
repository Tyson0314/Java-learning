---
sidebar: heading
title: Redis排序
category: 缓存
tag:
  - Redis
head:
  - - meta
    - name: keywords
      content: Redis排序
  - - meta
    - name: description
      content: Redis常见知识点和面试题总结，让天下没有难背的八股文！
---

# 排序

```
LPUSH myList 4 8 2 3 6
SORT myList DESC
```

```
LPUSH letters f l d n c
SORT letters ALPHA
```

**BY参数**

```
LPUSH list1 1 2 3
SET score:1 50
SET score:2 100
SET score:3 10
SORT list1 BY score:* DESC
```

**GET参数**

GET参数命令作用是使SORT命令的返回结果是GET参数指定的键值。

`SORT tag:Java:posts BY post:*->time DESC GET post:*->title GET post:*->time GET #`

GET #返回文章ID。

**STORE参数**

`SORT tag:Java:posts BY post:*->time DESC GET post:*->title STORE resultCache`

`EXPIRE resultCache 10 //STORE结合EXPIRE可以缓存排序结果`

