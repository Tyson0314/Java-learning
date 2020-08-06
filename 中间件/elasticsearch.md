<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [基础](#%E5%9F%BA%E7%A1%80)
  - [概念](#%E6%A6%82%E5%BF%B5)
  - [启动和关闭](#%E5%90%AF%E5%8A%A8%E5%92%8C%E5%85%B3%E9%97%AD)
  - [配置文件](#%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6)
  - [PUT](#put)
  - [GET](#get)
  - [全文搜索](#%E5%85%A8%E6%96%87%E6%90%9C%E7%B4%A2)
  - [高亮搜索](#%E9%AB%98%E4%BA%AE%E6%90%9C%E7%B4%A2)
  - [分析](#%E5%88%86%E6%9E%90)
  - [分布式特性](#%E5%88%86%E5%B8%83%E5%BC%8F%E7%89%B9%E6%80%A7)
- [集群原理](#%E9%9B%86%E7%BE%A4%E5%8E%9F%E7%90%86)
  - [术语](#%E6%9C%AF%E8%AF%AD)
    - [节点](#%E8%8A%82%E7%82%B9)
    - [分片](#%E5%88%86%E7%89%87)
  - [集群健康](#%E9%9B%86%E7%BE%A4%E5%81%A5%E5%BA%B7)
  - [索引](#%E7%B4%A2%E5%BC%95)
  - [故障转移](#%E6%95%85%E9%9A%9C%E8%BD%AC%E7%A7%BB)
  - [单机多节点](#%E5%8D%95%E6%9C%BA%E5%A4%9A%E8%8A%82%E7%82%B9)
- [数据输入与输出](#%E6%95%B0%E6%8D%AE%E8%BE%93%E5%85%A5%E4%B8%8E%E8%BE%93%E5%87%BA)
  - [文档元数据](#%E6%96%87%E6%A1%A3%E5%85%83%E6%95%B0%E6%8D%AE)
  - [创建新文档](#%E5%88%9B%E5%BB%BA%E6%96%B0%E6%96%87%E6%A1%A3)
  - [取回文档](#%E5%8F%96%E5%9B%9E%E6%96%87%E6%A1%A3)
  - [取回多个文档](#%E5%8F%96%E5%9B%9E%E5%A4%9A%E4%B8%AA%E6%96%87%E6%A1%A3)
  - [删除文档](#%E5%88%A0%E9%99%A4%E6%96%87%E6%A1%A3)
  - [检查文档是否存在](#%E6%A3%80%E6%9F%A5%E6%96%87%E6%A1%A3%E6%98%AF%E5%90%A6%E5%AD%98%E5%9C%A8)
  - [更新文档](#%E6%9B%B4%E6%96%B0%E6%96%87%E6%A1%A3)
    - [更新和冲突](#%E6%9B%B4%E6%96%B0%E5%92%8C%E5%86%B2%E7%AA%81)
  - [批量操作](#%E6%89%B9%E9%87%8F%E6%93%8D%E4%BD%9C)
- [分布式文档存储](#%E5%88%86%E5%B8%83%E5%BC%8F%E6%96%87%E6%A1%A3%E5%AD%98%E5%82%A8)
  - [路由文档到分片](#%E8%B7%AF%E7%94%B1%E6%96%87%E6%A1%A3%E5%88%B0%E5%88%86%E7%89%87)
- [映射和分析](#%E6%98%A0%E5%B0%84%E5%92%8C%E5%88%86%E6%9E%90)
  - [核心简单域类型](#%E6%A0%B8%E5%BF%83%E7%AE%80%E5%8D%95%E5%9F%9F%E7%B1%BB%E5%9E%8B)
  - [查看映射](#%E6%9F%A5%E7%9C%8B%E6%98%A0%E5%B0%84)
  - [自定义映射器](#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%98%A0%E5%B0%84%E5%99%A8)
    - [index](#index)
    - [analyzer](#analyzer)
  - [更新映射](#%E6%9B%B4%E6%96%B0%E6%98%A0%E5%B0%84)
  - [测试映射](#%E6%B5%8B%E8%AF%95%E6%98%A0%E5%B0%84)
  - [分析器](#%E5%88%86%E6%9E%90%E5%99%A8)
    - [测试分析器](#%E6%B5%8B%E8%AF%95%E5%88%86%E6%9E%90%E5%99%A8)
  - [复杂核心域类型](#%E5%A4%8D%E6%9D%82%E6%A0%B8%E5%BF%83%E5%9F%9F%E7%B1%BB%E5%9E%8B)
    - [多值域](#%E5%A4%9A%E5%80%BC%E5%9F%9F)
  - [内部对象](#%E5%86%85%E9%83%A8%E5%AF%B9%E8%B1%A1)
- [搜索](#%E6%90%9C%E7%B4%A2)
  - [空搜索](#%E7%A9%BA%E6%90%9C%E7%B4%A2)
  - [多索引多类型](#%E5%A4%9A%E7%B4%A2%E5%BC%95%E5%A4%9A%E7%B1%BB%E5%9E%8B)
  - [轻量搜索](#%E8%BD%BB%E9%87%8F%E6%90%9C%E7%B4%A2)
- [请求体查询](#%E8%AF%B7%E6%B1%82%E4%BD%93%E6%9F%A5%E8%AF%A2)
  - [空查询](#%E7%A9%BA%E6%9F%A5%E8%AF%A2)
  - [提升权重](#%E6%8F%90%E5%8D%87%E6%9D%83%E9%87%8D)
  - [explain](#explain)
  - [查询和过滤器的区别](#%E6%9F%A5%E8%AF%A2%E5%92%8C%E8%BF%87%E6%BB%A4%E5%99%A8%E7%9A%84%E5%8C%BA%E5%88%AB)
- [排序与相关性](#%E6%8E%92%E5%BA%8F%E4%B8%8E%E7%9B%B8%E5%85%B3%E6%80%A7)
  - [按照字段的值排序](#%E6%8C%89%E7%85%A7%E5%AD%97%E6%AE%B5%E7%9A%84%E5%80%BC%E6%8E%92%E5%BA%8F)
  - [多级排序](#%E5%A4%9A%E7%BA%A7%E6%8E%92%E5%BA%8F)
  - [多值字段的排序](#%E5%A4%9A%E5%80%BC%E5%AD%97%E6%AE%B5%E7%9A%84%E6%8E%92%E5%BA%8F)
  - [字符串排序](#%E5%AD%97%E7%AC%A6%E4%B8%B2%E6%8E%92%E5%BA%8F)
- [索引管理](#%E7%B4%A2%E5%BC%95%E7%AE%A1%E7%90%86)
  - [创建索引](#%E5%88%9B%E5%BB%BA%E7%B4%A2%E5%BC%95)
  - [删除索引](#%E5%88%A0%E9%99%A4%E7%B4%A2%E5%BC%95)
  - [索引设置](#%E7%B4%A2%E5%BC%95%E8%AE%BE%E7%BD%AE)
  - [配置分析器](#%E9%85%8D%E7%BD%AE%E5%88%86%E6%9E%90%E5%99%A8)
    - [自定义分析器](#%E8%87%AA%E5%AE%9A%E4%B9%89%E5%88%86%E6%9E%90%E5%99%A8)
  - [类型和映射](#%E7%B1%BB%E5%9E%8B%E5%92%8C%E6%98%A0%E5%B0%84)
  - [根对象](#%E6%A0%B9%E5%AF%B9%E8%B1%A1)
- [分片内部原理](#%E5%88%86%E7%89%87%E5%86%85%E9%83%A8%E5%8E%9F%E7%90%86)
  - [倒排索引](#%E5%80%92%E6%8E%92%E7%B4%A2%E5%BC%95)
- [深入搜索](#%E6%B7%B1%E5%85%A5%E6%90%9C%E7%B4%A2)
  - [精确值查找](#%E7%B2%BE%E7%A1%AE%E5%80%BC%E6%9F%A5%E6%89%BE)
    - [term 查询文本](#term-%E6%9F%A5%E8%AF%A2%E6%96%87%E6%9C%AC)
    - [terms 查询](#terms-%E6%9F%A5%E8%AF%A2)
  - [全文搜索](#%E5%85%A8%E6%96%87%E6%90%9C%E7%B4%A2-1)
    - [match 查询](#match-%E6%9F%A5%E8%AF%A2)
  - [range 查询](#range-%E6%9F%A5%E8%AF%A2)
    - [数字范围](#%E6%95%B0%E5%AD%97%E8%8C%83%E5%9B%B4)
    - [日期范围](#%E6%97%A5%E6%9C%9F%E8%8C%83%E5%9B%B4)
  - [分页](#%E5%88%86%E9%A1%B5)
  - [exists 查询](#exists-%E6%9F%A5%E8%AF%A2)
  - [bool 组合查询](#bool-%E7%BB%84%E5%90%88%E6%9F%A5%E8%AF%A2)
  - [如何使用 bool 查询](#%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8-bool-%E6%9F%A5%E8%AF%A2)
  - [constant_score 查询](#constant_score-%E6%9F%A5%E8%AF%A2)
  - [多字段搜索](#%E5%A4%9A%E5%AD%97%E6%AE%B5%E6%90%9C%E7%B4%A2)
    - [多字符串查询](#%E5%A4%9A%E5%AD%97%E7%AC%A6%E4%B8%B2%E6%9F%A5%E8%AF%A2)
    - [multi_match 查询](#multi_match-%E6%9F%A5%E8%AF%A2)
    - [多字段映射](#%E5%A4%9A%E5%AD%97%E6%AE%B5%E6%98%A0%E5%B0%84)
    - [copy_to 定制组合 field](#copy_to-%E5%AE%9A%E5%88%B6%E7%BB%84%E5%90%88-field)
- [springboot 集成 es](#springboot-%E9%9B%86%E6%88%90-es)
- [mall](#mall)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

[Elasticsearch 权威指南](https://www.elastic.co/guide/cn/elasticsearch/guide/current/_talking_to_elasticsearch.html)

## 基础

Elasticsearch 是一个开源的搜索引擎，建立在全文搜索引擎库 lucene 基础之上。Elasticsearch 也是使用 Java 编写的，它的内部使用 Lucene 做索引与搜索，但是它的目的是使全文检索变得简单， 通过隐藏 Lucene 的复杂性，取而代之的提供一套简单一致的 RESTful API。

ES与mysql的对应关系：

- index –> DB
- type –> Table
- Document –> row

### 概念

[参考--阮一峰es教程](http://www.ruanyifeng.com/blog/2017/08/elasticsearch.html)

1. node 和 cluster

   Elastic 本质上是一个分布式数据库，允许多台服务器协同工作，每台服务器可以运行多个 Elastic 实例。单个 Elastic 实例称为一个节点（node）。一组节点构成一个集群（cluster）。

2. Index

   数据库的同义词。每个 Index （即数据库）的名字必须是小写。查看当前节点的所有index：`GET _cat/indices`

3. Type

   类似于表结构。不同的 Type 应该有相似的结构（schema），举例来说，`id`字段不能在这个组是字符串，在另一个组是数值。这是与关系型数据库的表的区别。性质完全不同的数据（比如`products`和`logs`）应该存成两个 Index，而不是一个 Index 里面的两个 Type。

4. Document

   单条的记录称为 Document。Document 可以分组，比如`weather`这个 Index 里面，可以按城市分组（北京和上海），这种分组就是 Type。同一个 Index 里面的 Document，不要求有相同的结构（scheme），但是最好保持相同，这样有利于提高搜索效率。


### 启动和关闭

不用安装，解压即可。

启动：`bin\elasticsearch.bat`

关闭：ctrl+c/`curl -XPOST http://localhost:9200/_cluster/nodes/_shutdown `关掉整个集群

启动 head 插件：到 head 安装目录下运行`grunt server`

### 配置文件

安装目录config下的 elasticsearch.yml 可以配置集群的信息，如cluster.name 和 node.name。

```yaml
# ---------------------------------- MyConfig ----------------------------------
#cluster.name: xxx
node.name: node-2
#指明该节点可以是主节点，也可以是数据节点
node.master: true
node.data: true
network.host: 127.0.0.1
http.port: 9200
transport.tcp.port: 9300
```

http.port 是elasticsearch对外提供服务的http端口配置。

transport.tcp.port 指定了elasticsearch集群内数据通讯使用的端口，默认情况下为9300。


### PUT

```json
PUT /company/employee/1
{
  "first_name" : "Tyson",
  "last_name" : "dai",
  "age" : 23,
  "interests" : ["sport", "music"],
  "hire_date" : "2014-01-01"
}
```

company：索引名称，employee：类型名称，1是 ID。

### GET

```json
GET /company/employee/1
```

搜索所有雇员：

```json
GET /company/employee/_search
```

搜索结果如下，雇员数据放在 hits 数组中：

```json
{
  "took": 413,
  "timed_out": false,
  "_shards": {
    "total": 5,
    "successful": 5,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": 2,
    "max_score": 1,
    "hits": [
      {
        "_index": "company",
        "_type": "employee",
        "_id": "2",
        "_score": 1,
        "_source": {
          "first_name": "Lily",
          "last_name": "dai",
          "age": 23,
          "interests": [
            "sport",
            "music"
          ]
        }
      },
      {
        "_index": "company",
        "_type": "employee",
        "_id": "1",
        "_score": 1,
        "_source": {
          "first_name": "Tyson",
          "last_name": "dai",
          "age": 23,
          "interests": [
            "sport",
            "music"
          ]
        }
      }
    ]
  }
}
```

按特定条件搜索：

```json
GET /company/employee/_search?q=first_name:Tyson
```

使用查询表达式搜索：

```json
GET /company/employee/_search
{
  "query": {
    "match": {
      "first_name": "Tyson"
    }
  }
}
```

复杂查询：

姓氏为 Dai的雇员，但这次我们只需要年龄大于 20 的。

```json
GET /company/employee/_search
{
  "query": {
    "bool" : {
      "must" : {
        "match" : {
          "last_name" : "dai"
        }
      },
      "filter": {
        "range": {
          "age": {"gt" : 20}
        }
      }
    }
  }
}
```

### 全文搜索

传统数据库确实很难搞定的任务。

```json
GET /company/employee/_search
{
  "query": {
    "match": {
      "about": "rock climbing"
    }
  }
}
```

返回`"about": "rock climbing"`和`"about": "rock albums"`两条记录，默认按照每个文档跟查询的匹配程度排序。

### 高亮搜索

```json
GET /company/employee/_search
{
  "query": {
    "match_phrase": {
        "about": "climbing"
    }
  },
  "highlight": {
    "fields": {
      "about": {}
    }
  }
}
```

返回结果多 `highlight` 的部分。这个部分包含了 `about` 属性匹配的文本片段，并以 HTML 标签 `<em></em>` 封装。

```json
{
  "took": 43,
  "timed_out": false,
  "_shards": {
    "total": 5,
    "successful": 5,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": 1,
    "max_score": 0.2876821,
    "hits": [
      {
        "_index": "company",
        "_type": "employee",
        "_id": "3",
        "_score": 0.2876821,
        "_source": {
          "first_name": "Tyson",
          "last_name": "dai",
          "age": 23,
          "interests": [
            "sport",
            "music"
          ],
          "about": "rock climbing"
        },
        "highlight": {
          "about": [
            "rock <em>climbing</em>"
          ]
        }
      }
    ]
  }
}
```

### 分析

Elasticsearch 有一个功能叫聚合（aggregations），允许我们基于数据生成一些精细的分析结果。聚合与 SQL 中的 `GROUP BY` 类似但更强大。

```json
GET /company/employee/_search
{
  "aggs": {
    "all_interests": {
      "terms": { "field": "interests" }
    }
  }
}
```

直接执行上面的代码会报错，原因是5.x后对排序，聚合这些操作用单独的数据结构(fielddata)缓存到内存里了，需要单独开启。

```json
PUT company/_mapping/employee/
{
  "properties": {
    "interests": { 
      "type":     "text",
      "fielddata": true
    }
  }
}
```

搜索结果：

```json
{
   ...
   "hits": { ... },  
   "aggregations": {
    "all_interests": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": "music",
          "doc_count": 4
        },
        {
          "key": "sport",
          "doc_count": 4
        }
      ]
    }
  }
}
```

如果想知道叫 Tyson的雇员中最受欢迎的兴趣爱好，可以直接添加适当的查询来组合查询：

```json
GET company/employee/_search
{
  "query": {
    "match": {
      "first_name": "Tyson"
    }
  },
  "aggs": {
    "all_interests": {
      "terms": {
        "field": "interests"
      }
    }
  }
}
```

搜索结果：

```json
{
  "took": 33,
  "timed_out": false,
  "_shards": {
    "total": 5,
    "successful": 5,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": 1,
    "max_score": 0.2876821,
    "hits": [
      {
        "_index": "company",
        "_type": "employee",
        "_id": "3",
        "_score": 0.2876821,
        "_source": {
          "first_name": "Tyson",
          "last_name": "dai",
          "age": 23,
          "interests": [
            "sport",
            "music"
          ],
          "about": "rock climbing"
        }
      }
    ]
  },
  "aggregations": {
    "all_interests": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": "music",
          "doc_count": 1
        },
        {
          "key": "sport",
          "doc_count": 1
        }
      ]
    }
  }
}
```

聚合还支持分级汇总 。比如，查询特定兴趣爱好员工的平均年龄：

```java
GET company/employee/_search
{
  "aggs": {
    "all_interests": {
      "terms": {
        "field": "interests"
      },
      "aggs": {
        "avg_age": {
          "avg": {
            "field": "age"
          }
        }
      }
    }
  }
}
```

搜索结果：

```json
"aggregations": {
    "all_interests": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": "music",
          "doc_count": 4,
          "avg_age": {
            "value": 18.5
          }
        },
        {
          "key": "sport",
          "doc_count": 4,
          "avg_age": {
            "value": 18.5
          }
        }
      ]
    }
  }
```

### 分布式特性

Elasticsearch 可以横向扩展至数百（甚至数千）的服务器节点，同时可以处理PB级数据。

## 集群原理

ElasticSearch 的主旨是随时可用和按需扩容。扩容可以通过购买性能更强大（ *垂直扩容* ） 或者数量更多的服务器（ *水平扩容*  ）来实现。

### 术语

#### 节点

一个运行中的 Elasticsearch 实例称为节点，而集群是由一个或者多个拥有相同 `cluster.name` 配置的节点组成， 它们共同承担数据和负载的压力。当有节点加入集群中或者从集群中移除节点时，集群将会重新平均分布所有的数据。

当一个节点被选举成为主节点时， 它将负责管理集群范围内的所有变更，例如增加、删除索引，或者增加、删除节点等。 而主节点并不需要涉及到文档级别的变更和搜索等操作，所以当集群只拥有一个主节点的情况下，即使流量的增加它也不会成为瓶颈。 任何节点都可以成为主节点。

我们可以将请求发送到集群中的任何节点，包括主节点。 每个节点都知道任意文档所处的位置，并且能够将我们的请求直接转发到存储我们所需文档的节点。 无论我们将请求发送到哪个节点，它都能负责从各个包含我们所需文档的节点收集回数据，并将最终结果返回給客户端。 Elasticsearch 对这一切的管理都是透明的。

获取节点信息：`http://localhost:9200/_cluster/state/nodes?pretty`，pretty 用于换行。

#### 分片

每个节点可以分配一个或多个分片。分片是数据的容器，文档保存在分片内，分片又被分配到集群内的各个节点里。 当你的集群规模扩大或者缩小时， Elasticsearch 会自动的在各节点中迁移分片，使得数据仍然均匀分布在集群里。

一个分片可以是 *主* 分片或者 *副本* 分片。 索引内任意一个文档都归属于一个主分片，所以主分片的数目决定着索引能够保存的最大数据量。

一个副本分片只是一个主分片的拷贝。 副本分片作为硬件故障时保护数据不丢失的冗余备份，并为搜索和返回文档等读操作提供服务。

### 集群健康

`GET /_cluster/health`

返回内容：

```json
{
  "cluster_name": "elasticsearch",
  "status": "yellow",
  "timed_out": false,
  "number_of_nodes": 1,
  "number_of_data_nodes": 1,
  "active_primary_shards": 6,
  "active_shards": 6,
  "relocating_shards": 0,
  "initializing_shards": 0,
  "unassigned_shards": 5,
  "delayed_unassigned_shards": 0,
  "number_of_pending_tasks": 0,
  "number_of_in_flight_fetch": 0,
  "task_max_waiting_in_queue_millis": 0,
  "active_shards_percent_as_number": 54.54545454545454
}
```

status 字段表示当前集群总体是否正常，它有三个值：

1. green，所有的主分片和副本分片都正常运行。

2. yellow，所有的主分片都正常运行，但不是所有的副本分片都正常运行。
3. red，有主分片不能正常运行。

### 索引

往 elasticsearch 添加数据时需要用到索引，索引是指向一个或多个分片的逻辑命名空间。一个分片是一个 Lucene 的实例，以及它本身就是一个完整的搜索引擎。

当我们只开启一个节点时，索引在默认情况下会被分配5个主分片，每个主分片拥有一个副本分片。主分片会被分配到这个节点上，而副本分片不会被分配到任何节点。

```json
{
  "cluster_name": "elasticsearch",
  "status": "yellow",
  ...
  "unassigned_shards": 5,//5个副本分片都是 unassigned，都没有被分配到任何节点
  ...
}
```

当前我们的集群是正常运行的，但是在硬件故障时有丢失数据的风险。

### 故障转移

可以在同一个目录下开启另一个节点，副本分片会被分配到这个节点上，此时计算有硬件故障也不会丢失数据。

### 单机多节点

node1 的 elasticsearch.yml  做如下配置：

```yaml
# ---------------------------------- MyConfig ----------------------------------
#cluster.name: xxx
node.name: node-1
#指明该节点可以是主节点，也可以是数据节点
#node.master: true
#node.data: true
network.host: 127.0.0.1
http.port: 9200
transport.tcp.port: 9300
discovery.zen.ping.unicast.hosts: ["127.0.0.1:9300", "127.0.0.1:9301", "127.0.0.1:9302"]

# 解决elasticsearch-head 集群健康值: 未连接问题
http.cors.enabled: true
http.cors.allow-origin: "*"
```

node2 的 elasticsearch.yml  做如下配置：

```yaml
# ---------------------------------- MyConfig ----------------------------------
#cluster.name: xxx
node.name: node-2
#指明该节点可以是主节点，也可以是数据节点
#node.master: true
#node.data: true
network.host: 127.0.0.1
http.port: 9201
transport.tcp.port: 9301
discovery.zen.ping.unicast.hosts: ["127.0.0.1:9300", "127.0.0.1:9301", "127.0.0.1:9302"]

# 解决elasticsearch-head 集群健康值: 未连接问题
http.cors.enabled: true
http.cors.allow-origin: "*"
```

同理 node3 也做好配置。然后重启 elasticsearch 节点，就可以实现单机多节点集群搭建。



## 数据输入与输出

### 文档元数据

一个文档不仅包含数据，也包含元数据。三个必须的元数据元素如下：\_index、\_type和_id。

索引名字必须小写，不能以下划线开头，不能包含逗号。

\_type在索引中对数据进行逻辑分区，如产品下面还可以分为很多子类。一个 `_type` 命名可以是大写或者小写，但是不能以下划线或者句号开头，不应该包含逗号， 并且长度限制为256个字符。

### 创建新文档

使用 PUT 请求，需要定义 _id：

```json
PUT /{index}/{type}/{id}
{
  "field": "value",
  ...
}
```

id 为2的文档存在时会报错： document already exists 

```json
PUT company/employee/2/_create
{
  "first_name" : "Tyson",
  "last_name" : "dai",
  "age" : 23,
  "interests" : ["sport", "music"]
}
```

不存在时才创建：

```json
PUT company/employee/2?op_type=create
{
  "first_name" : "Tyson",
  "last_name" : "dai",
  "age" : 23,
  "interests" : ["sport", "music"]
}
```

使用 `POST` 可以让 Elasticsearch 自动生成唯一 的_id。

```json
POST company/employee
{
  "first_name" : "Tyson",
  "last_name" : "dai",
  "age" : 23,
  "interests" : ["sport", "music"]
}
```

### 取回文档

返回文档的一部分：

```json
GET /company/employee/1?_source=first_name,interests
```

只得到_source 字段（即id为1的整个文档）：

```json
GET /company/employee/1/_source
```


### 取回多个文档

mget api 要求传入一个 docs 数组作为参数，可以通过 _source 指定返回字段。

```json
GET /_mget 
{
  "docs": [
      {
       "_index": "company",
       "_type": "employee",
       "_id": 2
      },
      {
        "_index": "class", 
        "_type": "student",
        "_id": 1,
        "_source": "about"
      }
  ]
}
```

如果获取的文档 _index 和 _type 相同，可以在 url 指定默认的 _index 和 _type，传入一个 ids 数组。

```json
GET /company/employee/_mget
{
  "ids": ["1", "2"]
}
```

通过单独请求可以覆盖默认的 _index 和 _type。

```json
GET /company/employee/_mget
{
   "docs" : [
      { "_id" : 2 },
      { "_index" : "class", "_type" : "student", "_id" :   1 }
   ]
}
```

### 删除文档

`DELETE company/employee/1`，删除文档，版本号会增加。

```json
{
  "_index": "company",
  "_type": "employee",
  "_id": "1",
  "_version": 2,
  "result": "deleted",
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  },
  "_seq_no": 1,
  "_primary_term": 4
}
```

### 检查文档是否存在

`HEAD /company/employee/1`

返回结果：`200 - OK`

### 更新文档

文档是不可变的，不能被修改，只能被替换。 `update` API 必须遵循同样的规则。 从外部来看，我们在一个文档的某个位置进行部分更新。然而在内部， `update` API 简单使用 *检索-修改-重建索引* 的处理过程。

```json
POST company/employee/1/_update
{
  "doc": {
    "first_name": "sophia",
    "interests": ["sport", "chess"]
  }
}
```

#### 更新和冲突

```json
POST company/employee/1/_update?retry_on_conflict=5
{
  "doc": {
    "first_name": "sophia",
    "interests": ["sport", "chess"]
  }
}
```

### 批量操作

语法：

```json
{ action: { metadata }}\n
{ request body        }\n
{ action: { metadata }}\n
{ request body        }\n
...
```

action 有 create、delete、index 和 update。metadata 定义了\_index，\_type，_id 等信息。

create：如果文档不存在，那么就创建它。index：创建一个新文档或者替换一个现有的文档。create 和 index 不指定 `_id`的话 ，将会自动生成一个 ID 。

```json
POST /_bulk
{ "delete": { "_index": "website", "_type": "blog", "_id": "123" }} 
{ "create": { "_index": "website", "_type": "blog", "_id": "123" }}
{ "title":    "My first blog post" }
{ "index":  { "_index": "website", "_type": "blog" }}
{ "title":    "My second blog post" }
{ "update": { "_index": "website", "_type": "blog", "_id": "123", "_retry_on_conflict" : 3} }
{ "doc" : {"title" : "My updated blog post"} } 
```

bulk 请求不是原子的，不能用它来实现事务控制。每个请求是单独处理的，因此一个请求的成功或失败不会影响其他的请求。

**默认的 index 和 type**

```json
POST /website/_bulk
{ "index": { "_type": "log" }}
{ "event": "User logged in" }
```



## 分布式文档存储

### 路由文档到分片

文档所在分片的位置通过这个公式计算：`shard = hash(routing) % number_of_primary_shards`，rounting 默认是文档的 _id，可以设置成自定义的值。创建索引的时候就确定好主分片的数量，并且永远不会改变这个数量：因为如果数量变化了，那么所有之前路由的值都会无效，文档也再也找不到了。




## 映射和分析

映射：为了能够将时间域视为时间，数字域视为数字，字符串域视为全文或精确值字符串， Elasticsearch 需要知道每个域中数据的类型。这个信息包含在映射中。

分析：将一块文本分成适合于倒排索引的独立的词条，然后将这些词条统一化为标准格式以提高它们的可搜索性。

### 核心简单域类型

Elasticsearch 支持 如下简单域类型：

- 字符串: `string`
- 整数 : `byte`, `short`, `integer`, `long`
- 浮点数: `float`, `double`
- 布尔型: `boolean`
- 日期: `date`

当你索引一个新的文档，elasticsearch 会使用动态映射，通过 json 中的基本数据类型，尝试猜测域的类型。

| **JSON type**                  | **域 type** |
| ------------------------------ | ----------- |
| 布尔型: `true` 或者 `false`    | `boolean`   |
| 整数: `123`                    | `long`      |
| 浮点数: `123.45`               | `double`    |
| 字符串，有效日期: `2014-09-15` | `date`      |
| 字符串: `foo bar`              | `string`    |

如果你通过引号( `"123"` )索引一个数字，它会被映射为 `string` 类型，而不是 `long` 。但是，如果这个域已经映射为 `long` ，那么 Elasticsearch 会尝试将这个字符串转化为 long ，如果无法转化，则抛出一个异常。

### 查看映射

`GET /company/_mapping/employee`

返回结果：

```json
{
  "company": {
    "mappings": {
      "employee": {
        "properties": {
          "age": {
            "type": "long"
          },
          "first_name": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "ignore_above": 256
              }
            }
          },
          "hire_date": {
            "type": "date"
          },
          "interests": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "ignore_above": 256
              }
            }
          },
          "last_name": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "ignore_above": 256
              }
            }
          }
        }
      }
    }
  }
}
```

### 自定义映射器

`string` 类型域会被认为包含全文。它们的值在索引前，会通过 一个分析器，针对于这个域的查询在搜索前也会经过一个分析器。string 域映射的两个最重要的属性是 index 和 analyzer。

#### index

`index` 属性控制怎样索引字符串。它有三个值：

- analyzed：默认，首先分析这个域，然后索引它；
- not_analyzed：索引这个域，索引的是精确值，不会对它进行分析；
- no：不要索引这个域，这个域不会被搜索到。

设置 tag 域的 index 为 not_analyzed：

```json
{
    "tag": {
        "type":     "string",
        "index":    "not_analyzed"
    }
}
```

其他简单类型（例如 `long` ， `double` ， `date` 等）也接受 `index` 参数，但有意义的值只有 `no` 和 `not_analyzed` ， 因为它们永远不会被分析。

#### analyzer

对于 `analyzed` 字符串域，用 `analyzer` 属性指定在搜索和索引时使用的分析器。默认， Elasticsearch 使用 `standard` 分析器， 但你可以指定一个内置的分析器替代它，例如 `whitespace` 、 `simple` 和 `english`：

```json
{
    "tweet": {
        "type":     "string",
        "analyzer": "english"
    }
}
```


### 更新映射

我们可以更新一个映射来添加一个新域，但不能将一个存在的域从 `analyzed` 改为 `not_analyzed` ，否则索引的数据可能会出错，数据不能被正常的搜索。

增加名为 tag 的 not_analyzed 的文本域：

```json
PUT /gb/_mapping/tweet
{
  "properties" : {
    "tag" : {
      "type" :    "text",
      "index":    "not_analyzed"
    }
  }
}
```

指定中文分词器：

```json
PUT /gb/_mapping/tweet
{
  "properties" : {
      "user": {
          "type": "text",
          "analyzer": "ik_max_word",
          "search_analyzer": "ik_max_word"
      }
  }
}
```

`analyzer`是字段文本的分词器，`search_analyzer`是搜索词的分词器。`ik_max_word`分词器是插件`ik`提供的，可以对文本进行最大数量的分词。


### 测试映射

```json
GET /gb/_analyze
{
  "field": "tag",
  "text": "Black-cats" 
}
```

 `tag` 域产生单独的词条 `Black-cats` 。

### 分析器

分析器的三个功能：

- 字符过滤。字符串按顺序通过每个字符过滤器。它们在分词前整理字符串。一个字符过滤器可以用来去掉HTML或者将 & 转化为 and。
- 字符串被分词器分成单个的词条
- token 过滤器。改变词条（Quick 小写），删除词条（a/the/and），增加词条（leap/jump这种同义词）

对特定域和全文域_all 查询字符串时可能会返回不同的结果。

当你查询一个 *全文* 域时， 会对查询字符串应用相同的分析器，以产生正确的搜索词条列表。

当你查询一个 *精确值* 域时，不会分析查询字符串， 而是搜索你指定的精确值。

```json
GET /_search?q=2014              # 12 results
GET /_search?q=2014-09-15        # 12 results
GET /_search?q=date:2014-09-15   # 1  result
GET /_search?q=date:2014         # 0  results  没有"2014"，只有"2014-09-15"
```

date 域包含一个精确值：单独的词条 `2014-09-15`。

_all 域是一个全文域，所以分词进程将日期转化为三个词条： `2014`， `09`， 和 `15`。

#### 测试分析器

```json
GET /_analyze
{
  "analyzer": "standard",
  "text": "Text to analyze"
}
```

结果：

```json
{
  "tokens": [
    {
      "token": "text",
      "start_offset": 0,
      "end_offset": 4,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "to",
      "start_offset": 5,
      "end_offset": 7,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "analyze",
      "start_offset": 8,
      "end_offset": 15,
      "type": "<ALPHANUM>",
      "position": 2
    }
  ]
}
```

### 复杂核心域类型

#### 多值域

`{ "tag": [ "search", "nosql" ]}`

### 内部对象

```json
{
    "tweet":            "Elasticsearch is very flexible",
    "user": {
        "id":           "@johnsmith",
        "gender":       "male",
        "age":          26,
        "name": {
            "full":     "John Smith",
            "first":    "John",
            "last":     "Smith"
        }
    }
}
```

Lucene 不理解内部对象。 Lucene 文档是由一组键值对列表组成的。为了能让 Elasticsearch 有效地索引内部类，它把我们的文档转化成这样：

```json
{
    "tweet":            [elasticsearch, flexible, very],
    "user.id":          [@johnsmith],
    "user.gender":      [male],
    "user.age":         [26],
    "user.name.full":   [john, smith],
    "user.name.first":  [john],
    "user.name.last":   [smith]
}
```




## 搜索

### 空搜索

`GET /_search`，返回的 hits 数组包含所查询结果的前十个文档。

`GET /_search?timeout=10ms`，在请求超时之前，Elasticsearch 将会返回已经成功从每个分片获取的结果。


### 多索引多类型

`GET /c*,g*/_search`，在以 c 开头和 g 开头的索引中搜索所有的类型。

`GET /_all/employee,student/_search?size=1&from=1`，在所有索引中搜索 employee 和 student 类型。elasticsearch 默认一次返回10条结果，size 可以指定返回返回结果数量，from 指定位移。


### 轻量搜索

查询 employee 类型的 last_name 字段为 dai 的所有文档：`GET company/employee/_search?q=last_name:dai`

查询包含 dai 的所有文档：`GET /_search?q=dai`



## 请求体查询

### 空查询

```json
GET _search
{
  "query" : {
    "match_all": {}
  }
}
```




### 提升权重

我们可以通过指定 `boost` 来控制任何查询语句的相对的权重， `boost` 的默认值为 `1` ，大于 `1` 会提升一个语句的相对权重。

```json
GET /company/employee/_search
{
  "query": {
    "bool": {
      "must": {
        "match": {
          "interests": {
            "query": "sport music",
            "operator": "and"
          }
        }
      },
      "should": [
        { "match": {
          "first_name": {
            "query": "tyson",
            "boost": 3
          }
        }},
        { "match": {
          "first_name": {
            "query": "sophia",
            "boost": 2
          }
        }}
      ]
    }
  }
}
```

### explain

查询结果说明。

```json
GET /_validate/query?explain
{
   "query": {
      "match" : {
         "interests" : "sport shoes"
      }
   }
}
```

结果：

```json
{
  "valid": true,
  "_shards": {
    "total": 3,
    "successful": 3,
    "failed": 0
  },
  "explanations": [
    {
      "index": "class",
      "valid": true,
      "explanation": "interests:sport interests:shoes"
    },
    {
      "index": "company",
      "valid": true,
      "explanation": "interests:sport interests:shoes"
    }
  ]
}
```

### 查询和过滤器的区别

查询会计算得分，而过滤不计算得分，过滤器所需处理更少，所以过滤器可以比普通查询更快。而且过滤器可以被缓存。



## 排序与相关性

有时，_score 相关性评分对你来说并没有意义。例如，下面的查询返回所有 `user_id` 字段包含 `1` 的结果：

```json
GET /_search
{
    "query" : {
        "constant_score" : {
            "filter" : {
                "term" : {
                    "id" : 1
                }
            }
        }
    }
}
```

### 按照字段的值排序

按照 hire_date 排序。

```json
GET _search
{
  "query" : {
    "bool" : {
      "filter" : {
        "match" : {
          "first_name" : "tyson"
        }
      }
    }
  },
  "sort" : {
    "hire_date" : { "order" : "desc" }
  }
}
```

### 多级排序

首先按第一个条件排序，仅当结果集的第一个 `sort` 值完全相同时才会按照第二个条件进行排序，以此类推。

```json
GET _search
{
  "query" : {
    "bool" : {
      "filter" : {
        "match" : {
          "first_name" : "tyson"
        }
      }
    }
  },
  "sort" : {
    "hire_date" : { "order" : "desc" },
    "_score" : { "order" : "desc" }
  }
}
```

Query-string 搜索 也支持自定义排序，可以在查询字符串中使用 `sort` 参数：

```js
GET /_search?sort=hire_date:desc&sort=_score
```

### 多值字段的排序

对于数字或日期，你可以将多值字段减为单值，这可以通过使用 `min` 、 `max` 、 `avg` 或是 `sum` 排序模式。 例如你可以按照每个 hire_date 字段中的最早日期进行排序，通过以下方法：

```json
"sort": {
    "hire_date": {
        "order": "asc",
        "mode":  "min"
    }
}
```

### 字符串排序

为了对字符串字段进行排序，需要用两种方式对同一个字符串进行索引： `analyzed` 用于搜索， `not_analyzed` 用于排序。

用两种方式索引一个单字段：

```json
"interests": { 
    "type":     "string",
    "analyzer": "english",
    "fields": {
        "raw": { 
            "type":  "string",
            "index": "not_analyzed"
        }
    }
}
```

interests.raw 子字段是 not_analyzed。interests 字段只在 _source 中出现一次。

使用 interests 字段用于搜索，interests.raw 字段用于排序：

```json
GET /_search
{
    "query": {
        "match": {
            "interests": "elasticsearch"
        }
    },
    "sort": "interests.raw"
}
```

备注：以全文 `analyzed` 字段排序会消耗大量的内存。



## 索引管理

### 创建索引

```json
PUT /my_index
{
    "settings": { ... any settings ... },
    "mappings": {
        "type_one": { ... any mappings ... },
        "type_two": { ... any mappings ... },
        ...
    }
}
```

禁止自动创建索引，你 可以通过在 `config/elasticsearch.yml` 的每个节点下添加下面的配置：

`action.auto_create_index: false`

### 删除索引

`DELETE /company,student`

`DELETE /index_*`

`DELETE /_all` 或 `DELETE /*`

### 索引设置

number_of_shards：每个索引的主分片数，默认值是 `5` 。这个配置在索引创建后不能修改。

number_of_replicas：每个主分片的副本数，默认值是 `1` 。对于活动的索引库，这个配置可以随时修改。

创建只有 一个主分片，没有副本的小索引：

```json
PUT /my_temp_index
{
    "settings": {
        "number_of_shards" :   1,
        "number_of_replicas" : 0
    }
}
```

 动态修改副本数：

```json
PUT /my_temp_index/_settings
{
    "number_of_replicas": 1
}
```

### 配置分析器

#### 自定义分析器

，一个分析器组合了三种函数：字符过滤器、分词器和词单元过滤器， 三种函数按照顺序被执行。

```json
PUT /my_index
{
  "settings": {
    "analysis": {
      "char_filter": {
        "&_to_and" : {
          "type" : "mapping", 
          "mappings" : ["&=>and"]
        }
      },
      "filter": {
        "my_stopwords" : {
          "type" : "stop",
          "stopwords" : ["the", "a"]
        }
      },
      "analyzer": {
        "my_analyzer" : {
          "type" : "custom",
          "char_filter" : ["html_strip", "&_to_and"],
          "tokenizer" : "standard",
          "filter" : ["lowercase", "my_stopwords"]
        }
      }
    }
  }
}
```

测试：

```json
GET /my_index/_analyze
{
  "analyzer" : "my_analyzer",
  "text" : "The quick & brown fox"
}
```

结果：

```json
{
  "tokens": [
    {
      "token": "quick",
      "start_offset": 4,
      "end_offset": 9,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "and",
      "start_offset": 10,
      "end_offset": 11,
      "type": "<ALPHANUM>",
      "position": 2
    },
    {
      "token": "brown",
      "start_offset": 12,
      "end_offset": 17,
      "type": "<ALPHANUM>",
      "position": 3
    },
    {
      "token": "fox",
      "start_offset": 18,
      "end_offset": 21,
      "type": "<ALPHANUM>",
      "position": 4
    }
  ]
}
```

把分析器应用在 string 字段上：

```json
PUT /my_index/_mapping/my_type
{
    "properties": {
        "title": {
            "type":      "string",
            "analyzer":  "my_analyzer"
        }
    }
}
```

### 类型和映射

同一个索引下，不同的类型type应该有相同的结构，映射也应该相同。因为 Lucene 会将同一个索引下的所有字段的映射扁平化，相同字段不同映射会导致冲突。

```json
{
   "data": {
      "mappings": {
         "people": {
            "properties": {
               "name": {
                  "type": "string",
               },
               "address": {
                  "type": "string"
               }
            }
         },
         "transactions": {
            "properties": {
               "timestamp": {
                  "type": "date",
                  "format": "strict_date_optional_time"
               },
               "message": {
                  "type": "string"
               }
            }
         }
      }
   }
}
```

后台 Lucene 将创建一个映射：

```json
{
   "data": {
      "mappings": {
        "_type": {
          "type": "string",
          "index": "not_analyzed"
        },
        "name": {
          "type": "string"
        }
        "address": {
          "type": "string"
        }
        "timestamp": {
          "type": "long"
        }
        "message": {
          "type": "string"
        }
      }
   }
}
```

因此，类型不适合 *完全不同类型的数据* 。如果两个类型的字段集是互不相同的，这就意味着索引中将有一半的数据是空的（字段将是 *稀疏的* ），最终将导致性能问题。在这种情况下，最好是使用两个单独的索引。


### 根对象

映射最高的一层被称为根对象。它可能包含以下几项：

- properties 节点，列出文档每个字段的映射
- 下划线开头的元数据字段，如 \_type，_id 和 \_source
- 设置项，控制如何动态处理新的字段，例如 `analyzer` 、 `dynamic_date_formats` 和`dynamic_templates`
- 其他设置，可以同时应用在根对象和其他 `object` 类型的字段上，例如 `enabled` 、 `dynamic` 和 `include_in_all`



## 分片内部原理

### 倒排索引

倒排索引包含一个有序列表，列表包含所有文档出现过的不重复个体，或称为 *词项* ，对于每一个词项，包含了它所有曾出现过文档的列表。

| Term  | doc1 | doc2 | doc3 |
| ----- | ---- | ---- | ---- |
| sport | x    |      | x    |
| music |      | x    |      |
| chess | x    | x    | x    |



## 深入搜索

### 精确值查找

term 查询被用于精确值匹配，这些精确值可能是数字、时间、布尔或者那些 `not_analyzed` 的字符串。

```json
GET /company/employee/_search
{
  "query" : {
    "term" : {
      "interests" : "listen"
    }
  }
}
```

hire_date 在过去四年内的文档：

```json
GET company/employee/_search
{
  "query": {
    "constant_score": {
      "filter": {
        "range": {
          "hire_date": {
            "gt": "now-4y"
          }
        }
      }
    }
  }
}
```

#### term 查询文本

删除旧索引（因为旧索引字段都是 analyzed 的，它的映射不正确）然后创建一个能正确映射的新索引：

```json
PUT /my_store
{
  "mappings" : {
    "products" : {
      "properties": {
        "productID" : {
          "type" : "keyword",//es6废除了string，index是boolean值，keyword不分词，text分词
        }
      }
    }
  }
}
```

放进数据：

```json
POST /my_store/products/_bulk
{ "index": { "_id": 1 }}
{ "price" : 10, "productID" : "XHDK-A-1293-#fJ3" }
{ "index": { "_id": 2 }}
{ "price" : 20, "productID" : "KDKE-B-9947-#kL5" }
{ "index": { "_id": 3 }}
{ "price" : 30, "productID" : "JODL-X-1937-#pV7" }
{ "index": { "_id": 4 }}
{ "price" : 30, "productID" : "QQPX-R-3956-#aD8" }
```

查询文本：

```json
GET /my_store/products/_search
{
  "query" : {
    "constant_score" : {
      "filter" : {
        "term" : {
          "productID" : "XHDK-A-1293-#fJ3"
        }
      }
    }
  }
}
```

#### terms 查询

允许指定多值进行匹配。如果这个字段包含了指定值中的任何一个值，那么这个文档满足条件。

```json
GET /company/employee/_search
{
  "query" : {
    "terms" : {
      "interests" : ["listen", "music", "sport"]
    }
  }
}
```

置入 `filter` 语句的常量评分查询：

```json
GET /my_store/products/_search
{
  "query": {
    "constant_score": {
      "filter": {
        "terms" : {
          "interests" : ["listen", "music", "sport"]
        }
      },
      "boost": 1.2
    }
  }
}
```

interests 为 listen、music 和 sport 的文档会被匹配。

### 全文搜索

#### match 查询

match 查询是对全文进行查询。

如果有多个搜索关键字， Elastic 认为它们是`or`关系。下面例子返回 interests 为 sport 或者 music 的文档。

```json
GET _search
{ 
  "query" : {
    "match": {
      "interests": "sport music"
    }
  }
}
```

指定词都必须匹配：

```json
GET _search
{ 
  "query" : {
    "match": {
      "interests": {
        "query": "sport music",
        "operator": "and"
      }
    }
  }
}
```

控制匹配的字段数目：

```json
GET _search
{ 
  "query" : {
    "match": {
      "interests": {
        "query": "sport music",
        "minimum_should_match": 2
      }
    }
  }
}
```

### range 查询

查询找出那些落在指定区间内的数字或者时间。

#### 数字范围

```json
GET company/employee/_search
{
  "query": {
    "constant_score": {
      "filter": {
        "range": {
          "age": {
            "gt": 20,
            "lt": 100
          }
        }
      }
    }
  }
}
```

`gt`：大于；`gte`：大于或等于；`lt`：小于；`lte`：小于或等于。

#### 日期范围

```json
GET company/employee/_search
{
  "query": {
    "constant_score": {
      "filter": {
        "range": {
          "hire_date": {
            "gt": "2015-01-01",
            "lt": "2019-01-01"
          }
        }
      }
    }
  }
}
```

### 分页

请求得到 1 到 3 页的结果：

```json
GET /_search?size=5
GET /_search?size=5&from=5
GET /_search?size=5&from=10
```

### exists 查询

查询字段 interests 中不为空的文档：

```json
GET /company/employee/_search
{
  "query": {
    "constant_score": {
      "filter": {
        "exists": {
          "field": "interests"
        }
      }
    }
  }
}
```

字段 interests 为空的文档。es6 没有 missing api，直接用 bool 和 exists 实现。

```json
GET /company/employee/_search
{
  "query": {
    "bool": {
      "must_not": {
        "exists": {
          "field": "interests"
        }
      }
    }
  }
}
```

### bool 组合查询

bool 查询允许在单独的查询中组合任意数量的查询，适用于将不同查询字符串映射到不同字段的情况。bool 查询接收如下参数：

- must：文档必须匹配这些条件才能被包含进来
- must_not：文档必须不匹配这些条件才能被包含进来
- should：如果满足这些语句中的任意语句，将增加 _score，否则没有影响。主要用来修正每个文档的相关性得分
- filter：必须匹配，但是不影响评分

如果没有 `must` 语句，那么至少需要能够匹配其中的一条 `should` 语句。但，如果存在至少一条 `must` 语句，则对 `should` 语句的匹配没有要求。

```json
GET /company/employee/_search
{
 "query" : {
     "bool" : {
      "must" : { "match" : {"first_name" : "tyson"}},
      "must_not" : { "match" : {"last_name" : "tang"}},
      "should" : [
        {"match" : {"interest" : "music"}},
        {"range" : {"age" : { "gte" : 30 }}}
      ]
    }
 }
}
```

如果不想因为文档的时间而影响得分，可以添加 filter 过滤掉某个时间段。

```json
GET _search 
{
  "query" : {
    "bool" : {
      "must" : {
        "match" : { "first_name" : "tyson"}
      },
      "must_not" : {
        "match" : {"last_name" : "tang"}
      },
      "should" : [
        {"match" : { "interests": "sport"}},
        {"range" : { "age" : { "gt" : 20 }}}
      ],
      "filter" : {
        "range" : { "hire_date" : { "gt" : "2015-01-01" }}
      }
    }
  }
}
```

可以将查询移到 `bool` 查询的 `filter` 语句中，这样它就自动的转成一个不评分的查询了。

```json
{
    "bool": {
        "must":     { "match": { "title": "how to make millions" }},
        "must_not": { "match": { "tag":   "spam" }},
        "should": [
            { "match": { "tag": "starred" }}
        ],
        "filter": {
          "bool": { 
              "must": [
                  { "range": { "date": { "gte": "2014-01-01" }}},
                  { "range": { "price": { "lte": 29.99 }}}
              ],
              "must_not": [
                  { "term": { "category": "ebooks" }}
              ]
          }
        }
    }
}
```

bool 查询使用`minimum_should_match`控制需要匹配的 should 语句的数量：

```json
GET /my_index/my_type/_search
{
  "query": {
    "bool": {
      "should": [
        { "match": { "title": "brown" }},
        { "match": { "title": "fox"   }},
        { "match": { "title": "dog"   }}
      ],
      "minimum_should_match": 2 
    }
  }
}
```

### 如何使用 bool 查询

多次 match 查询：

```json
GET /company/employee/_search
{
  "query": {
    "match": {
      "interests": "sport music"
    }
  }
}
```

等价的 bool 查询（存在`must`，则对 `should` 语句的匹配没有要求，否则至少需要能够匹配其中的一条 `should` 语句）：

```json
GET /company/employee/_search
{
  "query": {
    "bool": {
      "should": [
        { "term" : { "interests":  "sport" } },
        { "term" : { "interests" : "music" } }
      ]
    }
  }
}
```

使用 and 操作符，返回所有字段都匹配到的文档：

```json
GET /company/employee/_search
{
  "query": {
    "match": {
      "interests": {
        "query": "sport music",
        "operator": "and"
      }
    }
  }
}
```

等价的 bool 查询：

```json
GET /company/employee/_search
{
  "query": {
    "bool": {
      "must": [
        { "term": { "interests": "sport" }},
        { "term": { "interests": "music" }}
      ]
    }
  }
}
```

指定参数 minimum_should_match：

```json
GET /company/employee/_search
{
  "query": {
    "match": {
      "interests": {
        "query": "sport music chess",
        "minimum_should_match" : 2
      }
    }
  }
}
```

等价的 bool 查询：

```json
GET /company/employee/_search
{
  "query": {
    "bool": {
      "should": [
        {"term": { "interests": "sport" }},
        {"term": { "interests": "music" }},
        {"term": { "interests": "chess" }}
      ],
      "minimum_should_match": 2
    }
  }
}
```

### constant_score 查询

constant_score 查询返回的文档`score`都是1。它经常用于只需要执行一个 filter 而没有其它查询的情况下。`score`会受到`boost`影响，出现 tyson 的文档`score`为1.2。

```json
GET _search 
{
  "query" : {
    "constant_score": {
      "filter": {
        "match" : { "first_name" : "tyson"}
      },
      "boost": 1.2
    }
  }
}
```




### 多字段搜索

参考自：[best_fields most_fields cross_fields从内在实现看区别——本质就是前两者是以field为中心，后者是词条为中心](https://www.cnblogs.com/bonelee/p/6827068.html)

最佳字段 best_fields：搜索结果中应该返回某一个字段匹配到了最多的关键词的文档。

多数字段 most_fields：返回匹配了更多的字段的文档，尽可能多地匹配文档。ES会为每个字段生成一个match查询，然后将它们包含在一个bool查询中。

跨字段 cross_fields：每个查询的单词都出现在不同的字段中。*cross_fields类型采用了一种以词条为中心(Term-centric)的方法，这种方法和best_fields及most_fields采用的以字段为中心(Field-centric)的方法有很大的区别。它将所有的字段视为一个大的字段，然后在任一字段中搜索每个词条。

#### 多字符串查询

```json
GET /_search
{
  "query": {
    "bool": {
      "should": [
        { "match": { // 权重：1/3
            "title":  {
              "query": "War and Peace",
              "boost": 2
        }}},
        { "match": { // 权重：1/3
            "author":  {
              "query": "Leo Tolstoy",
              "boost": 2
        }}},
        { "bool":  { //译者信息用布尔查询，降低评分权重  权重：1/3
            "should": [
              { "match": { "translator": "Constance Garnett" }},
              { "match": { "translator": "Louise Maude"      }}
            ]
        }}
      ]
    }
  }
}
```

#### multi_match 查询

multi_match 查询可以在多个字段上执行相同的 match 查询。`multi_match` 多匹配查询的类型有三种：`best_fields` 、 `most_fields` 和 `cross_fields` （最佳字段、多数字段、跨字段）。

```json
GET company/employee/_search
{
  "query" : {
    "multi_match": {
      "query": "sport shoes",
      "type": "best_fields", 
      "fields": [ "interests", "first_name" ],
      "tie_breaker": 0.3,
      "minimum_should_match": 1
    }
  }
}
```

模糊匹配：

```json
GET company/employee/_search
{
  "query" : {
    "multi_match": {
      "query": "tyson dai",
      "type": "best_fields", 
      "fields": "*_name",
      "tie_breaker": 0.3,
      "minimum_should_match": "30%" 
    }
  }
}
```

提升字段的权重，first_name 字段的 `boost` 值为 `2` ：

```json
GET company/employee/_search
{
  "query" : {
    "multi_match": {
      "query": "tyson dai",
      "type": "best_fields", 
      "fields": ["*_name", "first_name^3"],
      "tie_breaker": 0.3,
      "minimum_should_match": "30%" 
    }
  }
}
```

#### 多字段映射

对字段索引两次： 一次使用词干模式以及一次非词干模式。

```json
DELETE /my_index

PUT /my_index
{
    "settings": { "number_of_shards": 1 }, 
    "mappings": {
        "my_type": {
            "properties": {
                "title": { 
                    "type":     "string",
                    "analyzer": "english",//提取词干
                    "fields": {
                        "std":   { 
                            "type":     "string",
                            "analyzer": "standard"
                        }
                    }
                }
            }
        }
    }
}
```

`title` 字段使用 `english` 分析器来提取词干；`title.std` 字段使用 `standard` 标准分析器，所以没有词干提取。

索引文档：

```json
PUT /my_index/my_type/1
{ "title": "My rabbit jumps" }

PUT /my_index/my_type/2
{ "title": "Jumping jack rabbits" }
```

multi_match 查询：

```json
GET /my_index/_search
{
   "query": {
        "multi_match": {
            "query":  "jumping rabbits",
            "type":   "most_fields", 
            "fields": [ "title", "title.std" ]
        }
    }
}
```

文档2匹配度更高，因为 title.std 不会提取词干，只有文档2是匹配的。

设置`title` 字段的 `boost` 的值为 `10`，提升 title 字段的权重：

```json
GET /my_index/_search
{
   "query": {
        "multi_match": {
            "query":       "jumping rabbits",
            "type":        "most_fields",
            "fields":      [ "title^10", "title.std" ] 
        }
    }
}
```

#### copy_to 定制组合 field

定制组合 field 与 cross_field 跨字段查询类似，根据两者的实际性能选择具体方案。

创建映射：

```json
PUT my_index1
{
  "mappings": {
    "my_type": {
      "properties": {
        "first_name": {
          "type": "keyword",
          "copy_to": "full_name"
        },
        "last_name": {
          "type": "keyword",
          "copy_to": "full_name"
        },
        "full_name": {
          "type": "text",
          "fielddata": true
        }
      }
    }
  }
}
```

插入数据：

```json
PUT my_index1/my_type/1
{
  "first_name": "John",
  "last_name": "Smith"
}
```

校验查询：

```json
GET my_index1/_search
{
  "query": {
    "match": {
      "full_name": { 
        "query": "John Smith",
        "operator": "and"
      }
    }
  }
}

```

`copy_to` 设置对 multi-field 无效。如果尝试这样配置映射，Elasticsearch 会抛异常。多字段只是以不同方式简单索引主字段；它们没有自己的数据源。

```json
PUT /my_index
{
    "mappings": {
        "person": {
            "properties": {
                "first_name": {
                    "type":     "string",
                    "copy_to":  "full_name", 
                    "fields": {
                        "raw": {
                            "type": "string",
                            "index": "not_analyzed"
                        }
                    }
                },
                "full_name": {
                    "type":     "string"
                }
            }
        }
    }
}
```

first_name 是主字段，first_name.raw 是多字段。



## springboot 集成 es

[springboot 集成 es](https://blog.csdn.net/cwenao/article/details/54943505)

[springboot整合elasticsearch5.x以及IK分词器做全文检索](https://blog.csdn.net/chenxihua1/article/details/94546282)



## mall

创建文档：

```json
POST /pms/product
{
    "productSn": "HNTBJ2E080A",
    "brandId": 50,
    "brandName": "海澜之家",
    "productCategoryId": 8,
    "productCategoryName": "T恤",
    "pic": "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180615/5ac98b64N70acd82f.jpg!cc_350x449.jpg",
    "name": "HLA海澜之家蓝灰花纹圆领针织布短袖T恤",
    "subTitle": "2018夏季新品短袖T恤男HNTBJ2E080A 蓝灰花纹80 175/92A/L80A 蓝灰花纹80 175/92A/L",
    "keywords": "",
    "price": 98,
    "sale": 0,
    "newStatus": 0,
    "recommandStatus": 0,
    "stock": 100,
    "promotionType": 0,
    "sort": 0,
    "attrValueList": [
      {
        "id": 183,
        "productAttributeId": 24,
        "value": null,
        "type": 1,
        "name": "商品编号"
      },
      {
        "id": 184,
        "productAttributeId": 25,
        "value": "夏季",
        "type": 1,
        "name": "适用季节"
      }
    ]
}
```

获取文档映射：`GET /pms/_mapping/product`

按字段查询：`GET /pms/product/_search?q=subTitle:2018`

match查询：

```json
GET /pms/product/_search
{
  "query": {
   "match": {
     "brandName": "小米"
   }
  }
}
```





