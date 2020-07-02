## 单例模式

双重检查锁定：

```java
public class Singleton {  
    private static volatile Singleton instance = null;  //volatile
    private Singleton(){}  
    public static Singleton getInstance() {  
        if (instance == null) {  
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
public class InstanceFactory {
    private static class InstanceHolder {
        public static Instance instance = new Instance();
    }
    public static Instance getInstance() {
        return InstanceHolder.instance ;　　// 这里将导致InstanceHolder类被初始化
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



