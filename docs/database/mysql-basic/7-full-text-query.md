# 全文搜索
为了进行全文本搜索，必须索引被搜索的列，而且要随着数据的改变不断地重新索引。在对表列进行适当设计后，MySQL会自动进行所有的索引和重新索引。

启动全文搜索（仅在MyISAM数据库引擎中支持全文本搜索）：

```mysql
CREATE TABLE productnotes
(
	note_id int NOT NULL AUTO_INCREMENT,
    note_text text NULL,
    PRIMARY KEY(note_id),
    FULLTEXT(note_text)
) ENGINE=MyISAM;
```

在定义之后，MySQL自动维护该索引。在增加、更新或删除行时，索引随之自动更新。

不要在导入数据时使用FULLTEXT，。应该首先导入所有数据，然后再修改表，定义FULLTEXT，这样可以更快导入数据。

使用全文搜索：

```mysql
SELECT note_text
FROM productnotes
WHERE Match(note_text) Against('shoe'); #Match指定搜索列，Against指定搜索词
```

返回结果：`nike shoes is good`，搜索不区分大小写。

全文搜索会对返回结果进行排序，具有高等级的行先返回：

```mysql
SELECT note_text,
	Match(note_text) Against('shoes') AS rank #等级由MySQL根据行中词的数目、唯一词的数目、整个索引中词的总数以及包含该词的行的数目计算出来。
FROM productnotes;
```

全文搜索数据是有索引的，速度快。

