<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [单例模式](#%E5%8D%95%E4%BE%8B%E6%A8%A1%E5%BC%8F)
- [Java8](#java8)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 单例模式

双重检查锁定：

```java
public class Singleton {  
    private static volatile Singleton instance = null;  //volatile
    private Singleton(){}  
    public static Singleton getInstance() {  
        if (instance == null) {   //两次检查，降低同步开销
            synchronized (Singleton.class) {  
                if (instance == null) {
                    instance = new Singleton();  
                }  
            }  
        }  
        return instance;  
    }  
}  
```

静态内部类：

```java
public class Singleton {
    private static class SingletonHolder {
        public static Singleton instance = new Singleton();
    }
    private Singleton() {}
    public static Singleton getSingleton() {
        return SingletonHolder.instance;// 这里将导致SingletonHolder类被初始化
    }
}
```



## Java8

排序：

```java
stringCollection
    .stream()
    .sorted()
    .filter((s) -> s.startsWith("a"))
    .forEach(System.out::println);

// "aaa1", "aaa2"

list.stream().sorted(Comparator.comparing(Student::getAge).reversed());
list.stream().sorted(Comparator.comparing(Student::getAge));
```

过滤：

```java
stringCollection
    .stream()
    .sorted()
    .filter((s) -> s.startsWith("a"))
    .forEach(System.out::println);

// "aaa1", "aaa2"
```



