---
sidebar: heading
title: MyBatis源码分析
category: 源码分析
tag:
  - MyBatis
head:
  - - meta
    - name: keywords
      content: MyBatis面试题,MyBatis源码分析，MyBatis整体架构,MyBatis反射,MyBatis源码,Hibernate,Executor,MyBatis分页,MyBatis插件运行原理,MyBatis延迟加载,MyBatis预编译,一级缓存和二级缓存
  - - meta
    - name: description
      content: 高质量的MyBatis源码分析总结
---

大家好，我是大彬。今天分享Mybatis源码的反射模块。

`MyBatis` 在进行参数处理、结果映射时等操作时，会涉及大量的反射操作。为了简化这些反射相关操作，`MyBatis` 在 `org.apache.ibatis.reflection` 包下提供了专门的反射模块，对反射操作做了近一步封装，提供了更为简洁的 `API`。

## 缓存类的元信息

`MyBatis` 提供 `Reflector` 类来缓存类的字段名和 `getter/setter` 方法的元信息，使得反射时有更好的性能。使用方式是将原始类对象传入其构造方法，生成 `Reflector` 对象。

```java
  public Reflector(Class<?> clazz) {
    type = clazz;
    // 如果存在，记录无参构造方法
    addDefaultConstructor(clazz);
    // 记录字段名与get方法、get方法返回值的映射关系
    addGetMethods(clazz);
    // 记录字段名与set方法、set方法参数的映射关系
    addSetMethods(clazz);
    // 针对没有getter/setter方法的字段，通过Filed对象的反射来设置和读取字段值
    addFields(clazz);
    // 可读的字段名
    readablePropertyNames = getMethods.keySet().toArray(new String[getMethods.keySet().size()]);
    // 可写的字段名
    writablePropertyNames = setMethods.keySet().toArray(new String[setMethods.keySet().size()]);
    // 保存一份所有字段名大写与原始字段名的隐射
    for (String propName : readablePropertyNames) {
      caseInsensitivePropertyMap.put(propName.toUpperCase(Locale.ENGLISH), propName);
    }
    for (String propName : writablePropertyNames) {
      caseInsensitivePropertyMap.put(propName.toUpperCase(Locale.ENGLISH), propName);
    }
  }
```

`addGetMethods` 和 `addSetMethods` 分别获取类的所有方法，从符合 `getter/setter` 规范的方法中解析出字段名，并记录方法的参数类型、返回值类型等信息：

```java
  private void addGetMethods(Class<?> cls) {
    // 字段名-get方法
    Map<String, List<Method>> conflictingGetters = new HashMap<>();
    // 获取类的所有方法，及其实现接口的方法，并根据方法签名去重
    Method[] methods = getClassMethods(cls);
    for (Method method : methods) {
      if (method.getParameterTypes().length > 0) {
        // 过滤有参方法
        continue;
      }
      String name = method.getName();
      if ((name.startsWith("get") && name.length() > 3)
          || (name.startsWith("is") && name.length() > 2)) {
        // 由get属性获取对应的字段名（去除前缀，首字母转小写）
        name = PropertyNamer.methodToProperty(name);
        addMethodConflict(conflictingGetters, name, method);
      }
    }
    // 保证每个字段只对应一个get方法
    resolveGetterConflicts(conflictingGetters);
  }
```

对 `getter/setter` 方法进行去重是通过类似 `java.lang.String#getSignature:java.lang.reflect.Method` 的方法签名来实现的，如果子类在实现过程中，参数、返回值使用了不同的类型（使用原类型的子类），则会导致方法签名不一致，同一字段就会对应不同的 `getter/setter` 方法，因此需要进行去重。

> 分享一份大彬精心整理的大厂面试手册，包含计**算机基础、Java基础、多线程、JVM、数据库、Redis、Spring、Mybatis、SpringMVC、SpringBoot、分布式、微服务、设计模式、架构、校招社招分享**等高频面试题，非常实用，有小伙伴靠着这份手册拿过字节offer~
>
> ![](http://img.topjavaer.cn/image/image-20211127150136157.png)
>
> ![](http://img.topjavaer.cn/image/image-20220316234337881.png)
>
> 需要的小伙伴可以自行**下载**：
>
> 链接：https://pan.xunlei.com/s/VNgU60NQQNSDaEy9z955oufbA1?pwd=y9fy#
>
> 备用链接：https://pan.quark.cn/s/cbbb681e7c19

```java
  private void resolveGetterConflicts(Map<String, List<Method>> conflictingGetters) {
    for (Entry<String, List<Method>> entry : conflictingGetters.entrySet()) {
      Method winner = null;
      // 属性名
      String propName = entry.getKey();
      for (Method candidate : entry.getValue()) {
        if (winner == null) {
          winner = candidate;
          continue;
        }
        // 字段对应了多个get方法
        Class<?> winnerType = winner.getReturnType();
        Class<?> candidateType = candidate.getReturnType();
        if (candidateType.equals(winnerType)) {
          // 返回值类型相同
          if (!boolean.class.equals(candidateType)) {
            throw new ReflectionException(
                "Illegal overloaded getter method with ambiguous type for property "
                    + propName + " in class " + winner.getDeclaringClass()
                    + ". This breaks the JavaBeans specification and can cause unpredictable results.");
          } else if (candidate.getName().startsWith("is")) {
            // 返回值为boolean的get方法可能有多个，如getIsSave和isSave，优先取is开头的
            winner = candidate;
          }
        } else if (candidateType.isAssignableFrom(winnerType)) {
          // OK getter type is descendant
          // 可能会出现接口中的方法返回值是List，子类实现方法返回值是ArrayList，使用子类返回值方法
        } else if (winnerType.isAssignableFrom(candidateType)) {
          winner = candidate;
        } else {
          throw new ReflectionException(
              "Illegal overloaded getter method with ambiguous type for property "
                  + propName + " in class " + winner.getDeclaringClass()
                  + ". This breaks the JavaBeans specification and can cause unpredictable results.");
        }
      }
      // 记录字段名对应的get方法对象和返回值类型
      addGetMethod(propName, winner);
    }
  }
```

去重的方式是使用更规范的方法以及使用子类的方法。在确认字段名对应的唯一 `getter/setter` 方法后，记录方法名对应的方法、参数、返回值等信息。`MethodInvoker` 可用于调用 `Method` 类的 `invoke` 方法来执行 `getter/setter` 方法（`addSetMethods` 记录映射关系的方式与 `addGetMethods` 大致相同）。

```java
private void addGetMethod(String name, Method method) {
  // 过滤$开头、serialVersionUID的get方法和getClass()方法
  if (isValidPropertyName(name)) {
    // 字段名-对应get方法的MethodInvoker对象
    getMethods.put(name, new MethodInvoker(method));
    Type returnType = TypeParameterResolver.resolveReturnType(method, type);
    // 字段名-运行时方法的真正返回类型
    getTypes.put(name, typeToClass(returnType));
  }
}
```

接下来会执行 `addFields` 方法，此方法针对没有 `getter/setter` 方法的字段，通过包装为 `SetFieldInvoker` 在需要时通过 `Field` 对象的反射来设置和读取字段值。

```java
private void addFields(Class<?> clazz) {
  Field[] fields = clazz.getDeclaredFields();
  for (Field field : fields) {
    if (!setMethods.containsKey(field.getName())) {
      // issue #379 - removed the check for final because JDK 1.5 allows
      // modification of final fields through reflection (JSR-133). (JGB)
      // pr #16 - final static can only be set by the classloader
      int modifiers = field.getModifiers();
      if (!(Modifier.isFinal(modifiers) && Modifier.isStatic(modifiers))) {
        // 非final的static变量，没有set方法，可以通过File对象做赋值操作
        addSetField(field);
      }
    }
    if (!getMethods.containsKey(field.getName())) {
      addGetField(field);
    }
  }
  if (clazz.getSuperclass() != null) {
    // 递归查找父类
    addFields(clazz.getSuperclass());
  }
}
```

## 抽象字段赋值与读取

`Invoker` 接口用于抽象设置和读取字段值的操作。对于有 `getter/setter` 方法的字段，通过 `MethodInvoker` 反射执行；对应其它字段，通过 `GetFieldInvoker` 和 `SetFieldInvoker` 操作 `Field` 对象的 `getter/setter` 方法反射执行。

```java
/**
 * 用于抽象设置和读取字段值的操作
 *
 * {@link MethodInvoker} 反射执行getter/setter方法
 * {@link GetFieldInvoker} {@link SetFieldInvoker} 反射执行Field对象的get/set方法
 *
 * @author Clinton Begin
 */
public interface Invoker {

  /**
   * 通过反射设置或读取字段值
   *
   * @param target
   * @param args
   * @return
   * @throws IllegalAccessException
   * @throws InvocationTargetException
   */
  Object invoke(Object target, Object[] args) throws IllegalAccessException, InvocationTargetException;

  /**
   * 字段类型
   *
   * @return
   */
  Class<?> getType();
}
```

## 解析参数类型

针对 `Java-Type` 体系的多种实现，`TypeParameterResolver` 提供一系列方法来解析指定类中的字段、方法返回值或方法参数的类型。

`Type` 接口包含 4 个子接口和 1 个实现类：

![Type接口](https://wch853.github.io/img/mybatis/Type%E6%8E%A5%E5%8F%A3.png)

- `Class`：原始类型
- `ParameterizedType`：泛型类型，如：`List<String>`
- `TypeVariable`：泛型类型变量，如: `List<T>` 中的 `T`
- `GenericArrayType`：组成元素是 `ParameterizedType` 或 `TypeVariable` 的数组类型，如：`List<String>[]`、`T[]`
- `WildcardType`：通配符泛型类型变量，如：`List<?>` 中的 `?`

`TypeParameterResolver` 分别提供 `resolveFieldType`、`resolveReturnType`、`resolveParamTypes` 方法用于解析字段类型、方法返回值类型和方法入参类型，这些方法均调用 `resolveType` 来获取类型信息：

```java
/**
 * 获取类型信息
 *
 * @param type 根据是否有泛型信息签名选择传入泛型类型或简单类型
 * @param srcType 引用字段/方法的类（可能是子类，字段和方法在父类声明）
 * @param declaringClass 字段/方法声明的类
 * @return
 */
private static Type resolveType(Type type, Type srcType, Class<?> declaringClass) {
  if (type instanceof TypeVariable) {
    // 泛型类型变量，如：List<T> 中的 T
    return resolveTypeVar((TypeVariable<?>) type, srcType, declaringClass);
  } else if (type instanceof ParameterizedType) {
    // 泛型类型，如：List<String>
    return resolveParameterizedType((ParameterizedType) type, srcType, declaringClass);
  } else if (type instanceof GenericArrayType) {
    // TypeVariable/ParameterizedType 数组类型
    return resolveGenericArrayType((GenericArrayType) type, srcType, declaringClass);
  } else {
    // 原始类型，直接返回
    return type;
  }
}
```

`resolveTypeVar` 用于解析泛型类型变量参数类型，如果字段或方法在当前类中声明，则返回泛型类型的上界或 `Object` 类型；如果在父类中声明，则递归解析父类；父类也无法解析，则递归解析实现的接口。

```java
private static Type resolveTypeVar(TypeVariable<?> typeVar, Type srcType, Class<?> declaringClass) {
  Type result;
  Class<?> clazz;
  if (srcType instanceof Class) {
    // 原始类型
    clazz = (Class<?>) srcType;
  } else if (srcType instanceof ParameterizedType) {
    // 泛型类型，如 TestObj<String>
    ParameterizedType parameterizedType = (ParameterizedType) srcType;
    // 取原始类型TestObj
    clazz = (Class<?>) parameterizedType.getRawType();
  } else {
    throw new IllegalArgumentException("The 2nd arg must be Class or ParameterizedType, but was: " + srcType.getClass());
  }

  if (clazz == declaringClass) {
    // 字段就是在当前引用类中声明的
    Type[] bounds = typeVar.getBounds();
    if (bounds.length > 0) {
      // 返回泛型类型变量上界，如：T extends String，则返回String
      return bounds[0];
    }
    // 没有上界返回Object
    return Object.class;
  }

  // 字段/方法在父类中声明，递归查找父类泛型
  Type superclass = clazz.getGenericSuperclass();
  result = scanSuperTypes(typeVar, srcType, declaringClass, clazz, superclass);
  if (result != null) {
    return result;
  }

  // 递归泛型接口
  Type[] superInterfaces = clazz.getGenericInterfaces();
  for (Type superInterface : superInterfaces) {
    result = scanSuperTypes(typeVar, srcType, declaringClass, clazz, superInterface);
    if (result != null) {
      return result;
    }
  }
  return Object.class;
}
```

通过调用 `scanSuperTypes` 实现递归解析：

```java
private static Type scanSuperTypes(TypeVariable<?> typeVar, Type srcType, Class<?> declaringClass, Class<?> clazz, Type superclass) {
  if (superclass instanceof ParameterizedType) {
    // 父类是泛型类型
    ParameterizedType parentAsType = (ParameterizedType) superclass;
    Class<?> parentAsClass = (Class<?>) parentAsType.getRawType();
    // 父类中的泛型类型变量集合
    TypeVariable<?>[] parentTypeVars = parentAsClass.getTypeParameters();
    if (srcType instanceof ParameterizedType) {
      // 子类可能对父类泛型变量做过替换，使用替换后的类型
      parentAsType = translateParentTypeVars((ParameterizedType) srcType, clazz, parentAsType);
    }
    if (declaringClass == parentAsClass) {
      // 字段/方法在当前父类中声明
      for (int i = 0; i < parentTypeVars.length; i++) {
        if (typeVar == parentTypeVars[i]) {
          // 使用变量对应位置的真正类型（可能已经被替换），如父类 A<T>，子类 B extends A<String>，则返回String
          return parentAsType.getActualTypeArguments()[i];
        }
      }
    }
    // 字段/方法声明的类是当前父类的父类，继续递归
    if (declaringClass.isAssignableFrom(parentAsClass)) {
      return resolveTypeVar(typeVar, parentAsType, declaringClass);
    }
  } else if (superclass instanceof Class && declaringClass.isAssignableFrom((Class<?>) superclass)) {
    // 父类是原始类型，继续递归父类
    return resolveTypeVar(typeVar, superclass, declaringClass);
  }
  return null;
}
```

解析方法返回值和方法参数的逻辑大致与解析字段类型相同，`MyBatis` 源码的`TypeParameterResolverTest` 类提供了相关的测试用例。

## 元信息工厂

`MyBatis` 还提供 `ReflectorFactory` 接口用于实现 `Reflector` 容器，其默认实现为 `DefaultReflectorFactory`，其中可以使用 `classCacheEnabled` 属性来配置是否使用缓存。

```java
public class DefaultReflectorFactory implements ReflectorFactory {

  /**
   * 是否缓存Reflector类信息
   */
  private boolean classCacheEnabled = true;

  /**
   * Reflector缓存容器
   */
  private final ConcurrentMap<Class<?>, Reflector> reflectorMap = new ConcurrentHashMap<>();

  public DefaultReflectorFactory() {
  }

  @Override
  public boolean isClassCacheEnabled() {
    return classCacheEnabled;
  }

  @Override
  public void setClassCacheEnabled(boolean classCacheEnabled) {
    this.classCacheEnabled = classCacheEnabled;
  }

  /**
   * 获取类的Reflector信息
   *
   * @param type
   * @return
   */
  @Override
  public Reflector findForClass(Class<?> type) {
    if (classCacheEnabled) {
      // synchronized (type) removed see issue #461
      // 如果缓存Reflector信息，放入缓存容器
      return reflectorMap.computeIfAbsent(type, Reflector::new);
    } else {
      return new Reflector(type);
    }
  }

}
```

## 对象创建工厂

`ObjectFactory` 接口是 `MyBatis` 对象创建工厂，其默认实现 `DefaultObjectFactory` 通过构造器反射创建对象，支持使用无参构造器和有参构造器。

## 属性工具集

`MyBatis` 在映射文件定义 `resultMap` 支持如下形式：

```xml
<resultMap id="map" type="Order">
	<result property="orders[0].items[0].name" column="col1"/>
	<result property="orders[0].items[1].name" column="col2"/>
	...
</resultMap>
```

`orders[0].items[0].name` 这样的表达式是由 `PropertyTokenizer` 解析的，其构造方法能够对表达式进行解析；同时还实现了 `Iterator` 接口，能够迭代解析表达式。

```java
public PropertyTokenizer(String fullname) {
  // orders[0].items[0].name
  int delim = fullname.indexOf('.');
  if (delim > -1) {
    // name = orders[0]
    name = fullname.substring(0, delim);
    // children = items[0].name
    children = fullname.substring(delim + 1);
  } else {
    name = fullname;
    children = null;
  }
  // orders[0]
  indexedName = name;
  delim = name.indexOf('[');
  if (delim > -1) {
    // 0
    index = name.substring(delim + 1, name.length() - 1);
    // order
    name = name.substring(0, delim);
  }
}

  /**
   * 是否有children表达式继续迭代
   *
   * @return
   */
  @Override
  public boolean hasNext() {
    return children != null;
  }

  /**
   * 分解出的 . 分隔符的 children 表达式可以继续迭代
   * @return
   */
  @Override
  public PropertyTokenizer next() {
    return new PropertyTokenizer(children);
  }
```

`PropertyNamer` 可以根据 `getter/setter` 规范解析字段名称；`PropertyCopier` 则支持对有相同父类的对象，通过反射拷贝字段值。

## 封装类信息

`MetaClass` 类依赖 `PropertyTokenizer` 和 `Reflector` 查找表达式是否可以匹配 `Java` 对象中的字段，以及对应字段是否有 `getter/setter` 方法。

```java
/**
 * 验证传入的表达式，是否存在指定的字段
 *
 * @param name
 * @param builder
 * @return
 */
private StringBuilder buildProperty(String name, StringBuilder builder) {
  // 映射文件表达式迭代器
  PropertyTokenizer prop = new PropertyTokenizer(name);
  if (prop.hasNext()) {
    // 复杂表达式，如name = items[0].name，则prop.getName() = items
    String propertyName = reflector.findPropertyName(prop.getName());
    if (propertyName != null) {
      builder.append(propertyName);
      // items.
      builder.append(".");
      // 加载内嵌字段类型对应的MetaClass
      MetaClass metaProp = metaClassForProperty(propertyName);
      // 迭代子字段
      metaProp.buildProperty(prop.getChildren(), builder);
    }
  } else {
    // 非复杂表达式，获取字段名，如：userid->userId
    String propertyName = reflector.findPropertyName(name);
    if (propertyName != null) {
      builder.append(propertyName);
    }
  }
  return builder;
}
```

## 包装字段对象

相对于 `MetaClass` 关注类信息，`MetalObject` 关注的是对象的信息，除了保存传入的对象本身，还会为对象指定一个 `ObjectWrapper` 将对象包装起来。`ObejctWrapper` 体系如下：

![ObjectWrapper体系](https://wch853.github.io/img/mybatis/ObjectWrapper%E4%BD%93%E7%B3%BB.png)

`ObjectWrapper` 的默认实现包括了对 `Map`、`Collection` 和普通 `JavaBean` 的包装。`MyBatis` 还支持通过 `ObjectWrapperFactory` 接口对 `ObejctWrapper` 进行扩展，生成自定义的包装类。`MetaObject` 对对象的具体操作，就委托给真正的 `ObjectWrapper` 处理。

```java
private MetaObject(Object object, ObjectFactory objectFactory, ObjectWrapperFactory objectWrapperFactory, ReflectorFactory reflectorFactory) {
  this.originalObject = object;
  this.objectFactory = objectFactory;
  this.objectWrapperFactory = objectWrapperFactory;
  this.reflectorFactory = reflectorFactory;

  // 根据传入object类型不同，指定不同的wrapper
  if (object instanceof ObjectWrapper) {
    this.objectWrapper = (ObjectWrapper) object;
  } else if (objectWrapperFactory.hasWrapperFor(object)) {
    this.objectWrapper = objectWrapperFactory.getWrapperFor(this, object);
  } else if (object instanceof Map) {
    this.objectWrapper = new MapWrapper(this, (Map) object);
  } else if (object instanceof Collection) {
    this.objectWrapper = new CollectionWrapper(this, (Collection) object);
  } else {
    this.objectWrapper = new BeanWrapper(this, object);
  }
}
```

例如赋值操作，`BeanWrapper` 的实现如下：

```java
  @Override
  public void set(PropertyTokenizer prop, Object value) {
    if (prop.getIndex() != null) {
      // 当前表达式是集合，如：items[0]，就需要获取items集合对象
      Object collection = resolveCollection(prop, object);
      // 在集合的指定索引上赋值
      setCollectionValue(prop, collection, value);
    } else {
      // 解析完成，通过Invoker接口做赋值操作
      setBeanProperty(prop, object, value);
    }
  }

  protected Object resolveCollection(PropertyTokenizer prop, Object object) {
    if ("".equals(prop.getName())) {
      return object;
    } else {
      // 在对象信息中查到此字段对应的集合对象
      return metaObject.getValue(prop.getName());
    }
  }
```

根据 `PropertyTokenizer` 对象解析出的当前字段是否存在 `index` 索引来判断字段是否为集合。如果当前字段对应集合，则需要在对象信息中查到此字段对应的集合对象：

```javascript
public Object getValue(String name) {
  PropertyTokenizer prop = new PropertyTokenizer(name);
  if (prop.hasNext()) {
    // 如果表达式仍可迭代，递归寻找字段对应的对象
    MetaObject metaValue = metaObjectForProperty(prop.getIndexedName());
    if (metaValue == SystemMetaObject.NULL_META_OBJECT) {
      return null;
    } else {
      return metaValue.getValue(prop.getChildren());
    }
  } else {
      // 字段解析完成
    return objectWrapper.get(prop);
  }
}
```

如果字段是简单类型，`BeanWrapper` 获取字段对应的对象逻辑如下：

```java
@Override
public Object get(PropertyTokenizer prop) {
  if (prop.getIndex() != null) {
    // 集合类型，递归获取
    Object collection = resolveCollection(prop, object);
    return getCollectionValue(prop, collection);
  } else {
    // 解析完成，反射读取
    return getBeanProperty(prop, object);
  }
}
```

可以看到，仍然是会判断表达式是否迭代完成，如果未解析完字段会不断递归，直至找到对应的类型。前面说到 `Reflector` 创建过程中将对字段的读取和赋值操作通过 `Invoke` 接口抽象出来，针对最终获取的字段，此时就会调用 `Invoke` 接口对字段反射读取对象值：

```java
/**
 * 通过Invoker接口反射执行读取操作
 *
 * @param prop
 * @param object
 */
private Object getBeanProperty(PropertyTokenizer prop, Object object) {
  try {
    Invoker method = metaClass.getGetInvoker(prop.getName());
    try {
      return method.invoke(object, NO_ARGUMENTS);
    } catch (Throwable t) {
      throw ExceptionUtil.unwrapThrowable(t);
    }
  } catch (RuntimeException e) {
    throw e;
  } catch (Throwable t) {
    throw new ReflectionException("Could not get property '" + prop.getName() + "' from " + object.getClass() + ".  Cause: " + t.toString(), t);
  }
}
```

对象读取完毕再通过 `setCollectionValue` 方法对集合指定索引进行赋值或通过 `setBeanProperty` 方法对简单类型反射赋值。`MapWrapper` 的操作与 `BeanWrapper` 大致相同，`CollectionWrapper` 相对更会简单，只支持对原始集合对象进行添加操作。

## 小结

`MyBatis` 根据自身需求，对反射 `API` 做了近一步封装。其目的是简化反射操作，为对象字段的读取和赋值提供更好的性能。

- `org.apache.ibatis.reflection.Reflector`：缓存类的字段名和 getter/setter 方法的元信息，使得反射时有更好的性能。
- `org.apache.ibatis.reflection.invoker.Invoker:`：用于抽象设置和读取字段值的操作。
- `org.apache.ibatis.reflection.TypeParameterResolver`：针对 Java-Type 体系的多种实现，解析指定类中的字段、方法返回值或方法参数的类型。
- `org.apache.ibatis.reflection.ReflectorFactory`：反射信息创建工厂抽象接口。
- `org.apache.ibatis.reflection.DefaultReflectorFactory`：默认的反射信息创建工厂。
- `org.apache.ibatis.reflection.factory.ObjectFactory`：MyBatis 对象创建工厂，其默认实现 DefaultObjectFactory 通过构造器反射创建对象。
- `org.apache.ibatis.reflection.property`：property 工具包，针对映射文件表达式进行解析和 Java 对象的反射赋值。
- `org.apache.ibatis.reflection.MetaClass`：依赖 PropertyTokenizer 和 Reflector 查找表达式是否可以匹配 Java 对象中的字段，以及对应字段是否有 getter/setter 方法。
- `org.apache.ibatis.reflection.MetaObject`：对原始对象进行封装，将对象操作委托给 ObjectWrapper 处理。
- `org.apache.ibatis.reflection.wrapper.ObjectWrapper`：对象包装类，封装对象的读取和赋值等操作。





最后给大家分享**200多本计算机经典书籍PDF电子书**，包括**C语言、C++、Java、Python、前端、数据库、操作系统、计算机网络、数据结构和算法、机器学习、编程人生**等，感兴趣的小伙伴可以自取：

![](http://img.topjavaer.cn/image/Image.png)

![](http://img.topjavaer.cn/image/image-20221030094126118.png)

**200多本计算机经典书籍PDF电子书**：https://pan.xunlei.com/s/VNlmlh9jBl42w0QH2l4AJaWGA1?pwd=j8eq#

备用链接：https://pan.quark.cn/s/3f1321952a16