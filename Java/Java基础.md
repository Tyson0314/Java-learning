## 对象克隆

实现对象克隆有两种方式：

1. 实现Cloneable接口并重写Object类中的clone()方法；

2. 实现Serializable接口，通过对象的序列化和反序列化实现克隆，可以实现真正的深度克隆。



## 排序

```java
Arrays.sort(jdArray, (int[] jd1, int[] jd2) -> {return jd1[0] - jd2[0];});
```



## lambda表达式

```java
roles.forEach(System.out::println);
```



## 数组集合转换

集合转数组：

```java
//List --> Array
List<Integer> list = new ArrayList<>();
list.add(1);
Integer[] arr = list.toArray(new Integer[list.size()]);
```

数组转集合：

```java
//Array --> List
String[] array = {"java", "c"};
List<String> list = Arrays.asList(array);
```

该方法存在一定的弊端，返回的list是Arrays里面的一个静态内部类(数组的视图)，对list的操作会反映在原数组上，而且list是定长的，不支持add、remove操作。

该ArrayList并非java.util.ArrayList，而是 java.util.Arrays.ArrayList.ArrayList<T>(T[])，该类并未实现add、remove方法，因此在使用时存在局限性。

代替方案：

```java
List<String> list = new ArrayList<String>(Arrays.asList(array))
```



## 拷贝

### 数组拷贝

```java
System.arraycopy(Object src, int srcPos, Object dest, int desPos, int length)
Arrays.copyOf(originalArr, length) //length为拷贝的长度
Arrays.copyOfRange(originalArr, from, length)
```

二维数组拷贝：

```java
int[][] arr = {{1, 2},{3, 4}};
int[][] newArr = new int[2][2];
for(int i = 0; i < arr.length; i++) {
    newArr[i] = arr[i].clone();
}
```

### 对象拷贝

实现cloneable接口，重写clone方法。

```java
public class Dog implements Cloneable {
    private String id;
    private String name;

    public Dog(String id, String name) {
        this.id = id;
        this.name = name;
    }

    // 省略 getter 、 setter 以及 toString 方法

    @Override
    public Dog clone() throws CloneNotSupportedException {
        Dog dog = (Dog) super.clone();

        return dog;
    }
}
```

使用：

```java
Dog dog1 = new Dog("1", "Dog1");
Dog dog2 = dog1.clone();

dog2.setName("Dog1 changed");

System.out.println(dog1); // Dog{id='1', name='Dog1'}
System.out.println(dog2); // Dog{id='1', name='Dog1 changed'}
```

如果一个类引用了其他类，引用的类也需要实现cloneable接口，比较麻烦。可以将所有的类都实现Serializable接口，通过序列化反序列化实现对象的深度拷贝。

