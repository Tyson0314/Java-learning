# 函数式接口

Functional Interface：函数式接口，只包含一个抽象方法的接口。只有函数式接口才能缩写成 Lambda 表达式。@FunctionalInterface 定义类为一个函数式接口，如果添加了第二个抽象方法，编译器会立刻抛出错误提示。

```java
@FunctionalInterface
interface Converter<F, T> {
    T convert(F from);
}

public class FunctionalInterfaceTest {
    public static void main(String[] args) {
        Converter<String, Integer> converter = (from) -> Integer.valueOf(from);
        Integer converted = converter.convert("666");
        System.out.println(converted);
    }
    /**
     * output
     * 666
     */
}
```



