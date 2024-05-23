# MyBatis 源码分析（七）：接口层

## sql 会话创建工厂

`SqlSessionFactoryBuilder` 经过复杂的解析逻辑之后，会根据全局配置创建 `DefaultSqlSessionFactory`，该类是 `sql` 会话创建工厂抽象接口 `SqlSessionFactory` 的默认实现，其提供了若干 `openSession` 方法用于打开一个会话，在会话中进行相关数据库操作。这些 `openSession` 方法最终都会调用 `openSessionFromDataSource` 或 `openSessionFromConnection` 创建会话，即基于数据源配置创建还是基于已有连接对象创建。

### 基于数据源配置创建会话

要使用数据源打开一个会话需要先从全局配置中获取当前生效的数据源环境配置，如果没有生效配置或没用设置可用的事务工厂，就会创建一个 `ManagedTransactionFactory` 实例作为默认事务工厂实现，其与 `MyBatis` 提供的另一个事务工厂实现 `JdbcTransactionFactory` 的区别在于其生成的事务实现 `ManagedTransaction` 的提交和回滚方法是空实现，即希望将事务管理交由外部容器管理。

```java
  private SqlSession openSessionFromDataSource(ExecutorType execType, TransactionIsolationLevel level, boolean autoCommit) {
    Transaction tx = null;
    try {
      final Environment environment = configuration.getEnvironment();
      // 获取事务工厂
      final TransactionFactory transactionFactory = getTransactionFactoryFromEnvironment(environment);
      // 创建事务配置
      tx = transactionFactory.newTransaction(environment.getDataSource(), level, autoCommit);
      // 创建执行器
      final Executor executor = configuration.newExecutor(tx, execType);
      // 创建 sql 会话
      return new DefaultSqlSession(configuration, executor, autoCommit);
    } catch (Exception e) {
      closeTransaction(tx); // may have fetched a connection so lets call close()
      throw ExceptionFactory.wrapException("Error opening session.  Cause: " + e, e);
    } finally {
      ErrorContext.instance().reset();
    }
  }

  /**
   * 获取生效数据源环境配置的事务工厂
   */
  private TransactionFactory getTransactionFactoryFromEnvironment(Environment environment) {
    if (environment == null || environment.getTransactionFactory() == null) {
      // 未配置数据源环境或事务工厂，默认使用 ManagedTransactionFactory
      return new ManagedTransactionFactory();
    }
    return environment.getTransactionFactory();
  }
```

随后会根据入参传入的 `execType` 选择对应的执行器 `Executor`，`execType` 的取值来源于 `ExecutorType`，这是一个枚举类。在下一章将会详细分析各类 `Executor` 的作用及其实现。

获取到事务工厂配置和执行器对象后会结合传入的数据源自动提交属性创建 `DefaultSqlSession`，即 `sql` 会话对象。

### 基于数据库连接创建会话

基于连接创建会话的流程大致与基于数据源配置创建相同，区别在于自动提交属性 `autoCommit` 是从连接对象本身获取的。

```java
  private SqlSession openSessionFromConnection(ExecutorType execType, Connection connection) {
    try {
      // 获取自动提交配置
      boolean autoCommit;
      try {
        autoCommit = connection.getAutoCommit();
      } catch (SQLException e) {
        // Failover to true, as most poor drivers
        // or databases won't support transactions
        autoCommit = true;
      }
      final Environment environment = configuration.getEnvironment();
      // 获取事务工厂
      final TransactionFactory transactionFactory = getTransactionFactoryFromEnvironment(environment);
      // 创建事务配置
      final Transaction tx = transactionFactory.newTransaction(connection);
      // 创建执行器
      final Executor executor = configuration.newExecutor(tx, execType);
      // 创建 sql 会话
      return new DefaultSqlSession(configuration, executor, autoCommit);
    } catch (Exception e) {
      throw ExceptionFactory.wrapException("Error opening session.  Cause: " + e, e);
    } finally {
      ErrorContext.instance().reset();
    }
  }
```

## sql 会话

`SqlSession` 是 `MyBatis` 面向用户编程的接口，其提供了一系列方法用于执行相关数据库操作，默认实现为 `DefaultSqlSession`，在该类中，增删查改对应的操作最终会调用 `selectList`、`select` 和 `update` 方法，其分别用于普通查询、执行存储过程和修改数据库记录。

```java
  /**
   * 查询结果集
   */
  @Override
  public <E> List<E> selectList(String statement, Object parameter, RowBounds rowBounds) {
    try {
      MappedStatement ms = configuration.getMappedStatement(statement);
      return executor.query(ms, wrapCollection(parameter), rowBounds, Executor.NO_RESULT_HANDLER);
    } catch (Exception e) {
      throw ExceptionFactory.wrapException("Error querying database.  Cause: " + e, e);
    } finally {
      ErrorContext.instance().reset();
    }
  }

  /**
   * 调用存储过程
   */
  @Override
  public void select(String statement, Object parameter, RowBounds rowBounds, ResultHandler handler) {
    try {
      MappedStatement ms = configuration.getMappedStatement(statement);
      executor.query(ms, wrapCollection(parameter), rowBounds, handler);
    } catch (Exception e) {
      throw ExceptionFactory.wrapException("Error querying database.  Cause: " + e, e);
    } finally {
      ErrorContext.instance().reset();
    }
  }

  /**
   * 修改
   */
  @Override
  public int update(String statement, Object parameter) {
    try {
      dirty = true;
      MappedStatement ms = configuration.getMappedStatement(statement);
      return executor.update(ms, wrapCollection(parameter));
    } catch (Exception e) {
      throw ExceptionFactory.wrapException("Error updating database.  Cause: " + e, e);
    } finally {
      ErrorContext.instance().reset();
    }
  }
```

以上操作均是根据传入的 `statement` 名称到全局配置中查找对应的 `MappedStatement` 对象，并将操作委托给执行器对象 `executor` 完成。`select`、`selectMap` 等方法则是对 `selectList` 方法返回的结果集做处理来实现的。

此外，提交和回滚方法也是基于 `executor` 实现的。

```java
  /**
   * 提交事务
   */
  @Override
  public void commit(boolean force) {
    try {
      executor.commit(isCommitOrRollbackRequired(force));
      dirty = false;
    } catch (Exception e) {
      throw ExceptionFactory.wrapException("Error committing transaction.  Cause: " + e, e);
    } finally {
      ErrorContext.instance().reset();
    }
  }

  /**
   * 回滚事务
   */
  @Override
  public void rollback(boolean force) {
    try {
      executor.rollback(isCommitOrRollbackRequired(force));
      dirty = false;
    } catch (Exception e) {
      throw ExceptionFactory.wrapException("Error rolling back transaction.  Cause: " + e, e);
    } finally {
      ErrorContext.instance().reset();
    }
  }

  /**
   * 非自动提交且事务未提交 || 强制提交或回滚 时返回 true
   */
  private boolean isCommitOrRollbackRequired(boolean force) {
    return (!autoCommit && dirty) || force;
  }
```

在执行 `update` 方法时，会设置 `dirty` 属性为 `true` ，意为事务还未提交，当事务提交或回滚后才会将 `dirty` 属性修改为 `false`。如果当前会话不是自动提交且 `dirty` 熟悉为 `true`，或者设置了强制提交或回滚的标志，则会将强制标志提交给 `executor` 处理。

## Sql 会话管理器

`SqlSessionManager` 同时实现了 `SqlSessionFactory` 和 `SqlSession` 接口，使得其既能够创建 `sql` 会话，又能够执行 `sql` 会话的相关数据库操作。

```java
  /**
   * sql 会话创建工厂
   */
  private final SqlSessionFactory sqlSessionFactory;

  /**
   * sql 会话代理对象
   */
  private final SqlSession sqlSessionProxy;

  /**
   * 保存线程对应 sql 会话
   */
  private final ThreadLocal<SqlSession> localSqlSession = new ThreadLocal<>();

  private SqlSessionManager(SqlSessionFactory sqlSessionFactory) {
    this.sqlSessionFactory = sqlSessionFactory;
    this.sqlSessionProxy = (SqlSession) Proxy.newProxyInstance(
        SqlSessionFactory.class.getClassLoader(),
        new Class[]{SqlSession.class},
        new SqlSessionInterceptor());
  }

  @Override
  public SqlSession openSession() {
    return sqlSessionFactory.openSession();
  }

  /**
   * 设置当前线程对应的 sql 会话
   */
  public void startManagedSession() {
    this.localSqlSession.set(openSession());
  }

  /**
   * sql 会话代理逻辑
   */
  private class SqlSessionInterceptor implements InvocationHandler {

    public SqlSessionInterceptor() {
        // Prevent Synthetic Access
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
      // 获取当前线程对应的 sql 会话对象并执行对应方法
      final SqlSession sqlSession = SqlSessionManager.this.localSqlSession.get();
      if (sqlSession != null) {
        try {
          return method.invoke(sqlSession, args);
        } catch (Throwable t) {
          throw ExceptionUtil.unwrapThrowable(t);
        }
      } else {
        // 如果当前线程没有对应的 sql 会话，默认创建不自动提交的 sql 会话
        try (SqlSession autoSqlSession = openSession()) {
          try {
            final Object result = method.invoke(autoSqlSession, args);
            autoSqlSession.commit();
            return result;
          } catch (Throwable t) {
            autoSqlSession.rollback();
            throw ExceptionUtil.unwrapThrowable(t);
          }
        }
      }
    }
  }
```

`SqlSessionManager` 的构造方法要求 `SqlSessionFactory` 对象作为入参传入，其各个创建会话的方法实际是由该传入对象完成的。执行 `sql` 会话的操作由 `sqlSessionProxy` 对象完成，这是一个由 `JDK` 动态代理创建的对象，当执行方法时会去 `ThreadLocal` 对象中查找当前线程有没有对应的 `sql` 会话对象，如果有则使用已有的会话对象执行，否则创建新的会话对象执行，而线程对应的会话对象需要使用 `startManagedSession` 方法来维护。

之所以 `SqlSessionManager` 需要为每个线程维护会话对象，是因为 `DefaultSqlSession` 是非线程安全的，多线程操作会导致执行错误。如上文中提到的 `dirty` 属性，其修改是没有经过任何同步操作的。

## 小结

`SqlSession` 是 `MyBatis` 提供的面向开发者编程的接口，其提供了一系列数据库相关操作，并屏蔽了底层细节。使用 `MyBatis` 的正确方式应该是像 `SqlSessionManager` 那样为每个线程创建 `sql` 会话对象，避免造成线程安全问题。

- `org.apache.ibatis.session.SqlSessionFactory`：`sql` 会话创建工厂。
- `org.apache.ibatis.session.defaults.DefaultSqlSessionFactory`： `sql` 会话创建工厂默认实现。
- `org.apache.ibatis.session.SqlSession`：`sql` 会话。
- `org.apache.ibatis.session.defaults.DefaultSqlSession`：`sql` 会话默认实现。
- `org.apache.ibatis.session.SqlSessionManager`：`sql` 会话管理器