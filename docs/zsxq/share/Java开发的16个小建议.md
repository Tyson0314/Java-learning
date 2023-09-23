## 前言

开发过程中其实有很多小细节要去注意，只有不断去抠细节，写出精益求精的代码，从量变中收获质变。

技术的进步并非一蹴而就，而是通过无数次的量变，才能引发质的飞跃。我们始终坚信，只有对每一个细节保持敏锐的触觉，才能绽放出完美的技术之花。

从一行行代码中，我们品味到了追求卓越的滋味。每一个小小的优化，每一个微妙的改进，都是我们追求技艺的印记。我们知道，只有更多的关注细节，才能真正理解技术的本质，洞察其中的玄机。正是在对细节的把握中，我们得以成就更好的技术人生。

耐心看完，你一定会有所收获。

### 1.  **代码风格一致性**：

代码风格一致性可以提高代码的可读性和可维护性。例如，使用Java编程中普遍遵循的命名约定（驼峰命名法），使代码更易于理解。

```ini
ini复制代码// 不好的代码风格
int g = 10;
String S = "Hello";

// 好的代码风格
int count = 10;
String greeting = "Hello";
```

### 2.  **使用合适的数据结构和集合**：

选择适当的数据结构和集合类可以改进代码的性能和可读性。例如，使用HashSet来存储唯一的元素。

```csharp
csharp复制代码// 不好的例子 - 使用ArrayList存储唯一元素
List<Integer> list = new ArrayList<>();
list.add(1);
list.add(2);
list.add(1); // 重复元素

// 好的例子 - 使用HashSet存储唯一元素
Set<Integer> set = new HashSet<>();
set.add(1);
set.add(2);
set.add(1); // 自动忽略重复元素
```

### 3.  **避免使用魔法数值**：

使用常量或枚举来代替魔法数值可以提高代码的可维护性和易读性。

```ini
ini复制代码// 不好的例子 - 魔法数值硬编码
if (status == 1) {
    // 执行某些操作
}

// 好的例子 - 使用常量代替魔法数值
final int STATUS_ACTIVE = 1;
if (status == STATUS_ACTIVE) {
    // 执行某些操作
}
```

### 4.  **异常处理**：

正确处理异常有助于代码的健壮性和容错性，避免不必要的try-catch块可以提高代码性能。

```php
php复制代码// 不好的例子 - 捕获所有异常，没有具体处理
try {
    // 一些可能抛出异常的操作
} catch (Exception e) {
    // 空的异常处理块
}

// 好的例子 - 捕获并处理特定异常，或向上抛出
try {
    // 一些可能抛出异常的操作
} catch (FileNotFoundException e) {
    // 处理文件未找到异常
} catch (IOException e) {
    // 处理其他IO异常
}
```

### 5.  **及时关闭资源**：

使用完资源后，及时关闭它们可以避免资源泄漏，特别是对于文件流、数据库连接等资源。

更好的处理方式参见第16条，搭配`try-with-resources`食用最佳

```ini
ini复制代码// 不好的例子 - 未及时关闭数据库连接
Connection conn = null;
Statement stmt = null;
try {
    conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
    stmt = conn.createStatement();
    // 执行数据库查询操作
} catch (SQLException e) {
    e.printStackTrace();
} finally {
    // 数据库连接未关闭
}

// 好的例子 - 使用try-with-resources确保资源及时关闭，避免了数据库连接资源泄漏的问题
try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
    Statement stmt = conn.createStatement()) {
    // 执行数据库查询操作
} catch (SQLException e) {
    e.printStackTrace();
}
```

### 6.  **避免过度使用全局变量**：

过度使用全局变量容易引发意外的副作用和不可预测的结果，建议尽量避免使用全局变量。

```csharp
csharp复制代码// 不好的例子 - 过度使用全局变量
public class MyClass {
    private int count;

    // 省略其他代码
}

// 好的例子 - 使用局部变量或实例变量
public class MyClass {
    public void someMethod() {
        int count = 0;
        // 省略其他代码
    }
}
```

### 7.  **避免不必要的对象创建**：

避免在循环或频繁调用的方法中创建不必要的对象，可以使用对象池、StringBuilder等技术。

```arduino
arduino复制代码// 不好的例子 - 频繁调用方法创建不必要的对象
public String formatData(int year, int month, int day) {
    String formattedDate = String.format("%d-%02d-%02d", year, month, day); // 每次调用方法都会创建新的String对象
    return formattedDate;
}

// 好的例子 - 避免频繁调用方法创建不必要的对象
private static final String DATE_FORMAT = "%d-%02d-%02d";
public String formatData(int year, int month, int day) {
    return String.format(DATE_FORMAT, year, month, day); // 重复使用同一个String对象
}
```

### 8.  **避免使用不必要的装箱和拆箱**：

避免频繁地在基本类型和其对应的包装类型之间进行转换，可以提高代码的性能和效率。

```dart
dart复制代码// 不好的例子
Integer num = 10; // 不好的例子，自动装箱
int result = num + 5; // 不好的例子，自动拆箱

// 好的例子 - 避免装箱和拆箱
int num = 10; // 好的例子，使用基本类型
int result = num + 5; // 好的例子，避免装箱和拆箱
```

### 9.  **使用foreach循环遍历集合**：

使用foreach循环可以简化集合的遍历，并提高代码的可读性。

```ini
ini复制代码// 不好的例子 - 可读性不强，并且增加了方法调用的开销
List<String> names = Arrays.asList("Alice", "Bob", "Charlie");
for (int i = 0; i < names.size(); i++) {
    System.out.println(names.get(i)); // 不好的例子
}

// 好的例子 - 更加简洁，可读性更好，性能上也更优
List<String> names = Arrays.asList("Alice", "Bob", "Charlie");
for (String name : names) {
    System.out.println(name); // 好的例子
}
```

### 10.  **使用StringBuilder或StringBuffer拼接大量字符串**：

在循环中拼接大量字符串时，使用StringBuilder或StringBuffer可以避免产生大量临时对象，提高性能。

```ini
ini复制代码// 不好的例子 - 每次循环都产生新的字符串对象
String result = "";
for (int i = 0; i < 1000; i++) {
    result += "Number " + i + ", ";
}

// 好的例子 - StringBuilder不会产生大量临时对象
StringBuilder result = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    result.append("Number ").append(i).append(", ");
}
```

### 11.  **使用equals方法比较对象的内容**：

老生常谈的问题，在比较对象的内容时，使用equals方法而不是==操作符，确保正确比较对象的内容。

```ini
ini复制代码// 不好的例子
String name1 = "Alice";
String name2 = new String("Alice");
if (name1 == name2) {
    // 不好的例子，使用==比较对象的引用，而非内容
}

// 好的例子
String name1 = "Alice";
String name2 = new String("Alice");
if (name1.equals(name2)) {
    // 好的例子，使用equals比较对象的内容
}
```

### 12.  **避免使用多个连续的空格或制表符**：

多个连续的空格或制表符会使代码看起来杂乱不堪，建议使用合适的缩进和空格，保持代码的清晰可读。

```ini
ini复制代码// 不好的例子
int    a = 10;  // 不好的例子，多个连续的空格和制表符
String   name   =   "John";  // 不好的例子，多个连续的空格和制表符

// 好的例子
int a = 10; // 好的例子，适当的缩进和空格
String name = "John"; // 好的例子，适当的缩进和空格
```

### 13.  **使用日志框架记录日志**：

在代码中使用日志框架（如Log4j、SLF4J）来记录日志，而不是直接使用System.out.println()，可以更灵活地管理日志输出和级别。

```go
go复制代码// 不好的例子：
System.out.println("Error occurred"); // 不好的例子，直接输出日志到控制台

// 好的例子：
logger.error("Error occurred"); // 好的例子，使用日志框架记录日志
```

### 14.  **避免在循环中创建对象**：

在循环中频繁地创建对象会导致大量的内存分配和垃圾回收，影响性能。尽量在循环外部创建对象，或使用对象池来复用对象，从而减少对象的创建和销毁开销。

```ini
ini复制代码// 不好的例子 - 在循环过程中频繁地创建和销毁对象，增加了垃圾回收的负担
public List<Date> getNextWeekDates() {
    List<Date> dates = new ArrayList<>();
    for (int i = 0; i < 7; i++) {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_MONTH, i + 1);
        Date date = calendar.getTime(); // 在循环中频繁创建Calendar和Date对象
        dates.add(date);
    }
    return dates;
}


// 好的例子 - 在循环外部创建对象，减少内存分配和垃圾回收的开销
public List<Date> getNextWeekDates() {
    List<Date> dates = new ArrayList<>();
    Calendar calendar = Calendar.getInstance();
    Date date = new Date(); // 在循环外部创建Date对象
    for (int i = 0; i < 7; i++) {
        calendar.add(Calendar.DAY_OF_MONTH, 1);
        date.setTime(calendar.getTimeInMillis()); // 复用Date对象
        dates.add(date);
    }
    return dates;
}
```

### 15.  **使用枚举替代常量**：

这条其实和第3条一个道理，使用枚举可以更清晰地表示一组相关的常量，并且能够提供更多的类型安全性和功能性。

```arduino
arduino复制代码// 不好的例子 - 使用常量表示颜色
public static final int RED = 1;
public static final int GREEN = 2;
public static final int BLUE = 3;

// 好的例子 - 使用枚举表示颜色
public enum Color {
    RED, GREEN, BLUE
}
```

### 16. **使用try-with-resources语句**：

在处理需要关闭的资源（如文件、数据库连接等）时，使用try-with-resources语句可以自动关闭资源，避免资源泄漏。

```java
java复制代码// 不好的例子 - 没有使用try-with-resources
FileReader reader = null;
try {
    reader = new FileReader("file.txt");
    // 执行一些操作
} catch (IOException e) {
    // 处理异常
} finally {
    if (reader != null) {
        try {
            reader.close();
        } catch (IOException e) {
            // 处理关闭异常
        }
    }
}

// 好的例子 - 使用try-with-resources自动关闭资源
try (FileReader reader = new FileReader("file.txt")) {
    // 执行一些操作
} catch (IOException e) {
    // 处理异常
}
```





这16个小建议，希望对你有所帮助。



参考链接：https://juejin.cn/post/7261835383201726523
