在上章的配置解析中可以看到 `MyBatis` 在解析完运行时行为相关配置后会继续解析 `Mapper` 映射文件和接口，其中参数映射的解析入口为 `XMLMapperBuilder` 。

## 映射文件解析

`XMLMapperBuilder` 调用 `parse` 方法解析 `Mapper` 映射文件。

```java
  public void parse() {
    if (!configuration.isResourceLoaded(resource)) {
      // 解析 mapper 元素
      configurationElement(parser.evalNode("/mapper"));
      // 加入已解析队列
      configuration.addLoadedResource(resource);
      // Mapper 映射文件与对应 namespace 的接口进行绑定
      bindMapperForNamespace();
    }

    // 重新引用配置
    parsePendingResultMaps();
    parsePendingCacheRefs();
    parsePendingStatements();
  }
```

## 解析 mapper 元素

`mapper` 元素通常需要指定 `namespace` 用于唯一区别映射文件，不同映射文件支持通过其它映射文件的 `namespace` 来引用其配置。`mapper` 元素下可以配置二级缓存（`cache`、`cache-ref`）、返回值映射（`resultMap`）、`sql fragments`（`sql`）、`statement`（`select`、`insert`、`update`、`delete`）等，`MyBatis` 源码提供 `mybatis-mapper.xsd` 文件用于规范映射文件书写规则。

```java
  private void configurationElement(XNode context) {
    try {
      // 获取元素对应的 namespace 名称
      String namespace = context.getStringAttribute("namespace");
      if (namespace == null || namespace.equals("")) {
        throw new BuilderException("Mapper's namespace cannot be empty");
      }
      // 设置 Mapper 文件对应的 namespace 名称
      builderAssistant.setCurrentNamespace(namespace);
      // 解析 cache-ref 元素
      cacheRefElement(context.evalNode("cache-ref"));
      // 解析 cache 元素，会覆盖 cache-ref 配置
      cacheElement(context.evalNode("cache"));
      // 解析 parameterMap 元素（废弃）
      parameterMapElement(context.evalNodes("/mapper/parameterMap"));
      // 解析 resultMap 元素
      resultMapElements(context.evalNodes("/mapper/resultMap"));
      // 解析 sql 元素
      sqlElement(context.evalNodes("/mapper/sql"));
      // 解析 select|insert|update|delete 元素
      buildStatementFromContext(context.evalNodes("select|insert|update|delete"));
    } catch (Exception e) {
      throw new BuilderException("Error parsing Mapper XML. The XML location is '" + resource + "'. Cause: " + e, e);
    }
  }
```

## 解析 cache 元素

如果要为某命名空间开启二级缓存功能，可以通过配置 `cache` 元素，示例配置如下：

```xml
  <cache type=“PERPETUAL” eviction="LRU" flushInterval="60000" size="512" readOnly="true" blocking="true">
    <property name="name" value="cache"/>
  </cache>
```

`cache` 元素的解析逻辑如下：

```java
  private void cacheElement(XNode context) {
    if (context != null) {
      // 获取缓存类型，默认为 PERPETUAL
      String type = context.getStringAttribute("type", "PERPETUAL");
      // Configuration 构造方法中已为默认的缓存实现注册别名，从别名转换器中获取类对象
      Class<? extends Cache> typeClass = typeAliasRegistry.resolveAlias(type);
      // 获取失效类型，默认为 LRU
      String eviction = context.getStringAttribute("eviction", "LRU");
      Class<? extends Cache> evictionClass = typeAliasRegistry.resolveAlias(eviction);
      // 缓存刷新时间间隔
      Long flushInterval = context.getLongAttribute("flushInterval");
      // 缓存项大小
      Integer size = context.getIntAttribute("size");
      // 是否将序列化成二级制数据
      boolean readWrite = !context.getBooleanAttribute("readOnly", false);
      // 缓存不命中进入数据库查询时是否加锁（保证同一时刻相同缓存key只有一个线程执行数据库查询任务）
      boolean blocking = context.getBooleanAttribute("blocking", false);
      // 从子元素中加载属性
      Properties props = context.getChildrenAsProperties();
      // 创建缓存配置
      builderAssistant.useNewCache(typeClass, evictionClass, flushInterval, size, readWrite, blocking, props);
    }
  }
```

在第三章基础支持模块中已经详细介绍了 `MyBatis` 实现的各种缓存。从 `cache` 元素中获取缓存参数配置后会交由 `MapperBuilderAssistant#useNewCache` 方法处理。`MapperBuilderAssistant` 方法是一个映射文件解析工具，它负责将映射文件各个元素解析的参数生成配置对象，最终设置到全局配置类 `Configuration` 中。

```java
  public Cache useNewCache(Class<? extends Cache> typeClass,
      Class<? extends Cache> evictionClass,
      Long flushInterval,
      Integer size,
      boolean readWrite,
      boolean blocking,
      Properties props) {
    Cache cache = new CacheBuilder(currentNamespace)
            // 基础缓存配置
        .implementation(valueOrDefault(typeClass, PerpetualCache.class))
            // 失效类型，默认 LRU
        .addDecorator(valueOrDefault(evictionClass, LruCache.class))
            // 定时清理缓存时间间隔
        .clearInterval(flushInterval)
            // 缓存项大小
        .size(size)
            // 是否将缓存系列化成二级制数据
        .readWrite(readWrite)
            // 缓存不命中进入数据库查询时是否加锁（保证同一时刻相同缓存key只有一个线程执行数据库查询任务）
        .blocking(blocking)
        .properties(props)
        .build();
    // 设置到全局配置中
    configuration.addCache(cache);
    currentCache = cache;
    return cache;
  }
```

## 解析 cache-ref 元素

如果希望引用其它 `namespace` 的缓存配置，可以通过 `cache-ref` 元素配置：

```xml
<cache-ref namespace="com.wch.mybatis.OtherMapper" />
```

其解析逻辑是将当前 `namespace` 与引用缓存配置的 `namespace` 在全局配置中进行绑定。

```java
  private void cacheRefElement(XNode context) {
    if (context != null) {
      // 当前 namespace - 引用缓存配置的 namespace，在全局配置中进行绑定
      configuration.addCacheRef(builderAssistant.getCurrentNamespace(), context.getStringAttribute("namespace"));
      // 获取缓存配置解析器
      CacheRefResolver cacheRefResolver = new CacheRefResolver(builderAssistant, context.getStringAttribute("namespace"));
      try {
        // 解析获得引用的缓存配置
        cacheRefResolver.resolveCacheRef();
      } catch (IncompleteElementException e) {
        // 指定引用的 namespace 缓存还未加载，暂时放入集合，等待全部 namespace 都加载完成后重新引用
        configuration.addIncompleteCacheRef(cacheRefResolver);
      }
    }
  }
```

由于存在被引用配置还未被加载，因而无法从全局配置中获取的情况，`MyBatis` 定义了 `IncompleteElementException` 在此时抛出，未解析完成的缓存解析对象会被加入到全局配置中的 `incompleteCacheRefs` 集合中，用于后续处理。

```java
  public Cache useCacheRef(String namespace) {
    if (namespace == null) {
      throw new BuilderException("cache-ref element requires a namespace attribute.");
    }
    try {
      unresolvedCacheRef = true;
      // 从全局配置中获取缓存配置
      Cache cache = configuration.getCache(namespace);
      if (cache == null) {
        throw new IncompleteElementException("No cache for namespace '" + namespace + "' could be found.");
      }
      currentCache = cache;
      unresolvedCacheRef = false;
      return cache;
    } catch (IllegalArgumentException e) {
      // 可能指定引用的 namespace 缓存还未加载，抛出异常
      throw new IncompleteElementException("No cache for namespace '" + namespace + "' could be found.", e);
    }
  }
```

`MyBatis` 允许 `resultMap`、`cache-ref`、`statement` 元素延迟加载，以 `cache-ref` 重新引用的方法 `parsePendingCacheRefs` 为例，其重新引用逻辑如下：

```java
  private void parsePendingCacheRefs() {
    // 从全局配置中获取未解析的缓存引用配置
    Collection<CacheRefResolver> incompleteCacheRefs = configuration.getIncompleteCacheRefs();
    synchronized (incompleteCacheRefs) {
      Iterator<CacheRefResolver> iter = incompleteCacheRefs.iterator();
      while (iter.hasNext()) {
        try {
          // 逐个重新引用缓存配置
          iter.next().resolveCacheRef();
          // 引用成功，删除集合元素
          iter.remove();
        } catch (IncompleteElementException e) {
          // 引用的缓存配置不存在
          // Cache ref is still missing a resource...
        }
      }
    }
  }
```

## 解析 resultMap 元素

`resultMap` 元素用于定义结果集与结果对象（`JavaBean` 对象）之间的映射规则。`resultMap` 下除了 `discriminator` 的其它元素，都会被解析成 `ResultMapping` 对象，其解析过程如下：

```java
  private ResultMap resultMapElement(XNode resultMapNode, List<ResultMapping> additionalResultMappings, Class<?> enclosingType) throws Exception {
    ErrorContext.instance().activity("processing " + resultMapNode.getValueBasedIdentifier());
    // 获取返回值类型
    String type = resultMapNode.getStringAttribute("type",
        resultMapNode.getStringAttribute("ofType",
            resultMapNode.getStringAttribute("resultType",
                resultMapNode.getStringAttribute("javaType"))));
    // 加载返回值类对象
    Class<?> typeClass = resolveClass(type);
    if (typeClass == null) {
      // association 和 case 元素没有显式地指定返回值类型
      typeClass = inheritEnclosingType(resultMapNode, enclosingType);
    }
    Discriminator discriminator = null;
    List<ResultMapping> resultMappings = new ArrayList<>();
    resultMappings.addAll(additionalResultMappings);
    // 加载子元素
    List<XNode> resultChildren = resultMapNode.getChildren();
    for (XNode resultChild : resultChildren) {
      if ("constructor".equals(resultChild.getName())) {
        // 解析 constructor 元素
        processConstructorElement(resultChild, typeClass, resultMappings);
      } else if ("discriminator".equals(resultChild.getName())) {
        // 解析 discriminator 元素
        discriminator = processDiscriminatorElement(resultChild, typeClass, resultMappings);
      } else {
        // 解析 resultMap 元素下的其它元素
        List<ResultFlag> flags = new ArrayList<>();
        if ("id".equals(resultChild.getName())) {
          // id 元素增加标志
          flags.add(ResultFlag.ID);
        }
        // 解析元素映射关系
        resultMappings.add(buildResultMappingFromContext(resultChild, typeClass, flags));
      }
    }
    String id = resultMapNode.getStringAttribute("id",
            resultMapNode.getValueBasedIdentifier());
    // extend resultMap id
    String extend = resultMapNode.getStringAttribute("extends");
    // 是否设置自动映射
    Boolean autoMapping = resultMapNode.getBooleanAttribute("autoMapping");
    // resultMap 解析器
    ResultMapResolver resultMapResolver = new ResultMapResolver(builderAssistant, id, typeClass, extend, discriminator, resultMappings, autoMapping);
    try {
      // 解析生成 ResultMap 对象并设置到全局配置中
      return resultMapResolver.resolve();
    } catch (IncompleteElementException  e) {
      // 异常稍后处理
      configuration.addIncompleteResultMap(resultMapResolver);
      throw e;
    }
  }
```

以下从不同元素配置的角度分别分析 `MyBatis` 解析规则。

### id & result

```xml
  <id property="id" column="id"/>
  <result property="productId" column="product_id" javaType="int" jdbcType="INTEGER"/>
```

`id` 和 `result` 元素都会将一个列的值映射到一个简单数据类型字段，不同的是 `id` 元素对应对象的标识属性，在比较对象时会用到。此外还可以设置 `typeHandler` 属性用于自定义类型转换逻辑。

`buildResultMappingFromContext` 方法负责将 `resultMap` 子元素解析为 `ResultMapping` 对象：

```java
	/**
   * 解析 resultMap 子元素映射关系
   */
	private ResultMapping buildResultMappingFromContext(XNode context, Class<?> resultType, List<ResultFlag> flags) throws Exception {
    String property;
    if (flags.contains(ResultFlag.CONSTRUCTOR)) {
      // constructor 子元素，通过 name 获取参数名
      property = context.getStringAttribute("name");
    } else {
      property = context.getStringAttribute("property");
    }
    // 列名
    String column = context.getStringAttribute("column");
    // java 类型
    String javaType = context.getStringAttribute("javaType");
    // jdbc 类型
    String jdbcType = context.getStringAttribute("jdbcType");
    // 嵌套的 select id
    String nestedSelect = context.getStringAttribute("select");
    // 获取嵌套的 resultMap id
    String nestedResultMap = context.getStringAttribute("resultMap",
        processNestedResultMappings(context, Collections.emptyList(), resultType));
    // 获取指定的不为空才创建实例的列
    String notNullColumn = context.getStringAttribute("notNullColumn");
    // 列前缀
    String columnPrefix = context.getStringAttribute("columnPrefix");
    // 类型转换器
    String typeHandler = context.getStringAttribute("typeHandler");
    // 集合的多结果集
    String resultSet = context.getStringAttribute("resultSet");
    // 指定外键对应的列名
    String foreignColumn = context.getStringAttribute("foreignColumn");
    // 是否懒加载
    boolean lazy = "lazy".equals(context.getStringAttribute("fetchType", configuration.isLazyLoadingEnabled() ? "lazy" : "eager"));
    // 加载返回值类型
    Class<?> javaTypeClass = resolveClass(javaType);
    // 加载类型转换器类型
    Class<? extends TypeHandler<?>> typeHandlerClass = resolveClass(typeHandler);
    // 加载 jdbc 类型对象
    JdbcType jdbcTypeEnum = resolveJdbcType(jdbcType);
    return builderAssistant.buildResultMapping(resultType, property, column, javaTypeClass, jdbcTypeEnum, nestedSelect, nestedResultMap, notNullColumn, columnPrefix, typeHandlerClass, flags, resultSet, foreignColumn, lazy);
  }
```

`ResultMapping` 对象保存了列名与 `JavaBean` 中字段名的对应关系，并明确了 `Java` 类型和 `JDBC` 类型，如果指定了类型转换器则使用指定的转化器将结果集字段映射为 `Java` 对象字段；否则根据 `Java` 类型和 `JDBC` 类型到类型转换器注册类中寻找适合的类型转换器。最终影响映射的一系列因素都被保存到 `ResultMapping` 对象中并加入到全局配置。

### constructor

使用 `constructor` 元素允许返回值对象使用指定的构造方法创建而不是默认的构造方法。

```xml
<constructor>
   <idArg name="id" column="id"/>
   <arg name="productId" column="product_id"/>
</constructor>
```

在解析 `constructor` 元素时，`MyBatis` 特别指定了将 `constructor` 子元素解析为 `ResultMapping` 对象。

```java
	...
  // 加载子元素
  List<XNode> resultChildren = resultMapNode.getChildren();
  for (XNode resultChild : resultChildren) {
    if ("constructor".equals(resultChild.getName())) {
      // 解析 constructor 元素
      processConstructorElement(resultChild, typeClass, resultMappings);
    }
    ...
  }
	...

	/**
	 * 解析 constructor 元素下的子元素
	 */
  private void processConstructorElement(XNode resultChild, Class<?> resultType, List<ResultMapping> resultMappings) throws Exception {
    // 获取子元素
    List<XNode> argChildren = resultChild.getChildren();
    for (XNode argChild : argChildren) {
      List<ResultFlag> flags = new ArrayList<>();
      // 标明此元素在 constructor 元素中
      flags.add(ResultFlag.CONSTRUCTOR);
      if ("idArg".equals(argChild.getName())) {
        // 此元素映射 id
        flags.add(ResultFlag.ID);
      }
      // 解析子元素映射关系
      resultMappings.add(buildResultMappingFromContext(argChild, resultType, flags));
    }
  }
```

解析 `constructor` 子元素的逻辑与解析 `id`、`result` 元素的逻辑是一致的。

##### association

`association` 用于配置非简单类型的映射关系。其不仅支持在当前查询中做嵌套映射：

```xml
  <resultMap id="userResult" type="User">
    <id property="id" column="user_id" />
    <association property="product" column="product_id" resultMap="productResult"/>
  </resultMap>
```

也支持通过 `select` 属性嵌套其它查询：

```xml
  <resultMap id="userResult" type="User">
    <id property="id" column="user_id" />
    <association property="product" column="product_id" select="queryProduct"/>
  </resultMap>
```

在解析 `resultMap` 子元素方法 `buildResultMappingFromContext` 的逻辑中，`MyBatis` 会尝试获取每个子元素的 `resultMap` 属性，如果未指定，则会调用 `processNestedResultMappings` 方法，在此方法中对于 `asociation` 元素来说，如果指定了 `select` 属性，则映射时只需要获取对应 `select` 语句的 `resultMap`；如果未指定，则需要重新调用 `resultMapElement` 解析结果集映射关系。

```java
  private ResultMapping buildResultMappingFromContext(XNode context, Class<?> resultType, List<ResultFlag> flags) throws Exception {
    ...
    // 尝试获取嵌套的 resultMap id
    String nestedResultMap = context.getStringAttribute("resultMap", processNestedResultMappings(context, Collections.emptyList(), resultType));
    ...
  }

	/**
   * 处理嵌套的 resultMap，获取 id
   *
   * @param context
   * @param resultMappings
   * @param enclosingType
   * @return
   * @throws Exception
   */
  private String processNestedResultMappings(XNode context, List<ResultMapping> resultMappings, Class<?> enclosingType) throws Exception {
    if ("association".equals(context.getName())
        || "collection".equals(context.getName())
        || "case".equals(context.getName())) {
      if (context.getStringAttribute("select") == null) {
        // 如果是 association、collection 或 case 元素并且没有 select 属性
        // collection 元素没有指定 resultMap 或 javaType 属性，需要验证 resultMap 父元素对应的返回值类型是否有对当前集合的赋值入口
        validateCollection(context, enclosingType);
        ResultMap resultMap = resultMapElement(context, resultMappings, enclosingType);
        return resultMap.getId();
      }
    }
    return null;
  }
```

在 `resultMapElement` 方法中调用了 `inheritEnclosingType` 针对未定义返回类型的元素的返回值类型解析：

```java
  private ResultMap resultMapElement(XNode resultMapNode, List<ResultMapping> additionalResultMappings, Class<?> enclosingType) throws Exception {
    ...
    // 获取返回值类型
    String type = resultMapNode.getStringAttribute("type",
        resultMapNode.getStringAttribute("ofType",
            resultMapNode.getStringAttribute("resultType",
                resultMapNode.getStringAttribute("javaType"))));
    // 加载返回值类对象
    Class<?> typeClass = resolveClass(type);
    if (typeClass == null) {
      // association 等元素没有显式地指定返回值类型
      typeClass = inheritEnclosingType(resultMapNode, enclosingType);
    }
  }

  protected Class<?> inheritEnclosingType(XNode resultMapNode, Class<?> enclosingType) {
    if ("association".equals(resultMapNode.getName()) && resultMapNode.getStringAttribute("resultMap") == null) {
      // association 元素没有指定 resultMap 属性
      String property = resultMapNode.getStringAttribute("property");
      if (property != null && enclosingType != null) {
        // 根据反射信息确定字段的类型
        MetaClass metaResultType = MetaClass.forClass(enclosingType, configuration.getReflectorFactory());
        return metaResultType.getSetterType(property);
      }
    } else if ("case".equals(resultMapNode.getName()) && resultMapNode.getStringAttribute("resultMap") == null) {
      // case 元素返回值属性与 resultMap 父元素相同
      return enclosingType;
    }
    return null;
  }
```

在 `inheritEnclosingType` 方法中，如果未定义 `resultMap` 属性，则会通过反射工具 `MetaClass` 获取父元素 `resultMap` 返回类型的类信息，`association` 元素对应的字段名称的 `setter` 方法的参数就是其返回值类型。由此 `association` 元素必定可以关联到其结果集映射。

### collection

`collection` 元素用于配置集合属性的映射关系，其解析过程与 `association` 元素大致相同，重要的区别是 `collection` 元素使用 `ofType` 属性指定集合元素类型，例如需要映射的 `Java` 集合为 `List<User> users`，则配置示例如下：

```xml
	<collection property="users" column="
user_id" ofType="com.wch.mybatis.User" javaType="ArrayList" select="queryUsers"/>
```

`javaType`熟悉指定的是字段类型，而 `ofType` 属性指定的才是需要映射的集合存储的类型。

### discriminator

`discriminator` 支持对一个查询可能出现的不同结果集做鉴别，根据具体的条件为 `resultMap` 动态选择返回值类型。

```xml
  <discriminator javaType="int" column="type">
    <case value="1" resultType="Apple"/>
    <case value="2" resultType="Banana"/>
  </discriminator>
```

`discriminator` 元素的解析是通过 `processDiscriminatorElement` 方法完成的：

```java
  private Discriminator processDiscriminatorElement(XNode context, Class<?> resultType, List<ResultMapping> resultMappings) throws Exception {
    // 获取需要鉴别的字段的相关信息
    String column = context.getStringAttribute("column");
    String javaType = context.getStringAttribute("javaType");
    String jdbcType = context.getStringAttribute("jdbcType");
    String typeHandler = context.getStringAttribute("typeHandler");
    Class<?> javaTypeClass = resolveClass(javaType);
    Class<? extends TypeHandler<?>> typeHandlerClass = resolveClass(typeHandler);
    JdbcType jdbcTypeEnum = resolveJdbcType(jdbcType);
    Map<String, String> discriminatorMap = new HashMap<>();
    // 解析 discriminator 的 case 子元素
    for (XNode caseChild : context.getChildren()) {
      // 解析不同列值对应的不同 resultMap
      String value = caseChild.getStringAttribute("value");
      String resultMap = caseChild.getStringAttribute("resultMap", processNestedResultMappings(caseChild, resultMappings, resultType));
      discriminatorMap.put(value, resultMap);
    }
    return builderAssistant.buildDiscriminator(resultType, column, javaTypeClass, jdbcTypeEnum, typeHandlerClass, discriminatorMap);
  }
```

### 创建 ResultMap

在 `resultMap` 各子元素解析完成，`ResultMapResolver` 负责将生成的 `ResultMapping` 集合解析为 `ResultMap` 对象：

```java
  public ResultMap addResultMap(String id, Class<?> type, String extend, Discriminator discriminator, List<ResultMapping> resultMappings, Boolean autoMapping) {
    id = applyCurrentNamespace(id, false);
    extend = applyCurrentNamespace(extend, true);

    if (extend != null) {
      if (!configuration.hasResultMap(extend)) {
        throw new IncompleteElementException("Could not find a parent resultmap with id '" + extend + "'");
      }
      // 获取继承的 ResultMap 对象
      ResultMap resultMap = configuration.getResultMap(extend);
      List<ResultMapping> extendedResultMappings = new ArrayList<>(resultMap.getResultMappings());
      extendedResultMappings.removeAll(resultMappings);
      // Remove parent constructor if this resultMap declares a constructor.
      boolean declaresConstructor = false;
      for (ResultMapping resultMapping : resultMappings) {
        if (resultMapping.getFlags().contains(ResultFlag.CONSTRUCTOR)) {
          // 当前 resultMap 指定了构造方法
          declaresConstructor = true;
          break;
        }
      }
      if (declaresConstructor) {
        // 移除继承的 ResultMap 的构造器映射对象
        extendedResultMappings.removeIf(resultMapping -> resultMapping.getFlags().contains(ResultFlag.CONSTRUCTOR));
      }
      resultMappings.addAll(extendedResultMappings);
    }
    ResultMap resultMap = new ResultMap.Builder(configuration, id, type, resultMappings, autoMapping).discriminator(discriminator).build();
    configuration.addResultMap(resultMap);
    return resultMap;
  }
```

如果当前 `ResultMap` 指定了 `extend` 属性，`MyBatis` 会从全局配置中获取被继承的 `ResultMap` 的相关映射关系，加入到当前映射关系中。但是如果被继承的 `ResultMap` 指定了构造器映射关系，当前 `ResultMap` 会选择移除。

## 解析 sql 元素

`sql` 元素用于定义可重用的 `SQL` 代码段，这些代码段可以通过 `include` 元素进行引用。

```xml
<sql id="baseColumns">
	id, name, value
</sql>

<sql id="other">
	${alias}
</sql>

<select id="query" resultType="Product">
	SELECT
  	<include refid="baseColumns">,
  	<include refid="other">
      <property name="alias" value="other"/>
  	</include>
  FROM
      t_something
</select>
```

对 `sql` 元素的解析逻辑如下，符合 `databaseId` 要求的 `sql` 元素才会被加载到全局配置中。

```java
private void sqlElement(List<XNode> list) {
  if (configuration.getDatabaseId() != null) {
    sqlElement(list, configuration.getDatabaseId());
  }
  sqlElement(list, null);
}


/**
 * 解析 sql 元素，将对应的 sql 片段设置到全局配置中
 */
private void sqlElement(List<XNode> list, String requiredDatabaseId) {
  for (XNode context : list) {
    String databaseId = context.getStringAttribute("databaseId");
    String id = context.getStringAttribute("id");
    id = builderAssistant.applyCurrentNamespace(id, false);
    if (databaseIdMatchesCurrent(id, databaseId, requiredDatabaseId)) {
      // 符合当前 databaseId 的 sql fragment，加入到全局配置中
      sqlFragments.put(id, context);
    }
  }
}

/**
 * 判断 sql 元素是否满足加载条件
 *
 * @param id
 * @param databaseId
 * @param requiredDatabaseId
 * @return
 */
private boolean databaseIdMatchesCurrent(String id, String databaseId, String requiredDatabaseId) {
  if (requiredDatabaseId != null) {
    // 如果指定了当前数据源的 databaseId
    if (!requiredDatabaseId.equals(databaseId)) {
      // 被解析 sql 元素的 databaseId 需要符合
      return false;
    }
  } else {
    if (databaseId != null) {
      // 全局未指定 databaseId，不会加载指定了 databaseId 的 sql 元素
      return false;
    }
    // skip this fragment if there is a previous one with a not null databaseId
    if (this.sqlFragments.containsKey(id)) {
      XNode context = this.sqlFragments.get(id);
      if (context.getStringAttribute("databaseId") != null) {
        return false;
      }
    }
  }
  return true;
}
```

## 小结

`MyBatis` 能够轻松实现列值转换为 Java 对象依靠的是其强大的参数映射功能，能够支持集合、关联类型、嵌套等复杂场景的映射。同时缓存配置、`sql` 片段配置，也为开发者方便的提供了配置入口。

- `org.apache.ibatis.builder.annotation.MapperAnnotationBuilder`：解析 `Mapper` 接口。
- `org.apache.ibatis.builder.xml.XMLMapperBuilder`：解析 `Mapper` 文件。
- `org.apache.ibatis.builder.MapperBuilderAssistant`：`Mapper` 文件解析工具。生成元素对象并设置到全局配置中。
- `org.apache.ibatis.builder.CacheRefResolver`：缓存引用配置解析器，应用其它命名空间缓存配置到当前命名空间下。
- `org.apache.ibatis.builder.IncompleteElementException`：当前映射文件引用了其它命名空间下的配置，而该配置还未加载到全局配置中时会抛出此异常。
- `org.apache.ibatis.mapping.ResultMapping`：返回值字段映射关系对象。
- `org.apache.ibatis.builder.ResultMapResolver`：`ResultMap` 解析器。
- `org.apache.ibatis.mapping.ResultMap`：返回值映射对象