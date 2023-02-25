---
sidebar: heading
title: 设计模式之建造者模式
category: 设计模式
tag:
  - 设计模式
head:
  - - meta
    - name: keywords
      content: 建造者模式,设计模式,建造者,生成器模式
  - - meta
    - name: description
      content: 设计模式常见面试题总结，让天下没有难背的八股文！
---

# 建造者模式

Builder 模式中文叫作建造者模式，又叫生成器模式，它属于对象创建型模式，是将一个复杂对象的构建与它的表示分离，使得同样的构建过程可以创建不同的表示。建造者模式是一步一步创建一个复杂的对象，它允许用户只通过指定复杂对象的类型和内容就可以构建它们，用户不需要知道内部的具体构建细节。

在建造者模式中，有如下４种角色：

- Product：产品角色
- Builder：抽象建造者，定义产品接口
- ConcreteBuilder：具体建造者，实现Builder定义的接口，并且返回组装好的产品
- Director：指挥者，属于这里面的老大，你需要生产什么产品都直接找它。

## 建造者模式应用举例

### 家装

家装不管是精装还是简装，它的流程都相对固定，所以它适用于建造者模式。我们就以家装为例，一起来学习了解一下建造者模式。下图是家装建造者模式简单的 UML 图。

### 1、家装对象类

```java
/**
 * 家装对象类
 */
public class House {
    // 买家电
    private String jiadian;

    // 买地板
    private String diban;
    // 买油漆
    private String youqi;

    public String getJiadian() {
        return jiadian;
    }

    public void setJiadian(String jiadian) {
        this.jiadian = jiadian;
    }

    public String getDiban() {
        return diban;
    }

    public void setDiban(String diban) {
        this.diban = diban;
    }

    public String getYouqi() {
        return youqi;
    }

    public void setYouqi(String youqi) {
        this.youqi = youqi;
    }

    @Override
    public String toString() {
        return "House{" +
                "jiadian='" + jiadian + '\'' +
                ", diban='" + diban + '\'' +
                ", youqi='" + youqi + '\'' +
                '}';
    }
}
```

### 2、抽象建造者 Builder 类

```java
/**
 * 抽象建造者
 */
public interface HouseBuilder {
    // 买家电
    void doJiadian();
    // 买地板
    void doDiBan();
    // 买油漆
    void doYouqi();

    House getHouse();
}
```

### 3、具体建造者－简装建造者类

```java
/**
 * 简装创建者
 */
public class JianzhuangBuilder implements HouseBuilder {

    private House house = new House();

    @Override
    public void doJiadian() {
        house.setJiadian("简单家电就好");
    }

    @Override
    public void doDiBan() {
        house.setDiban("普通地板");
    }

    @Override
    public void doYouqi() {
        house.setYouqi("污染较小的油漆就行");
    }

    @Override
    public House getHouse() {
        return house;
    }
}
```

### 4、具体建造者－精装建造者类

```text
/**
 * 精装创建者
 */
public class jingzhuangBuilder implements HouseBuilder {

    private House house = new House();

    @Override
    public void doJiadian() {
        house.setJiadian("二话不说，最好的");
    }

    @Override
    public void doDiBan() {
        house.setDiban("二话不说，实木地板");
    }

    @Override
    public void doYouqi() {
        house.setYouqi("二话不说，给我来0污染的");
    }

    @Override
    public House getHouse() {
        return house;
    }
}
```

### 5、指挥官－家装公司类

```java
/**
 * 家装公司，值需要告诉他精装还是简装
 */
public class HouseDirector {

    public House builder(HouseBuilder houseBuilder){
        houseBuilder.doDiBan();
        houseBuilder.doJiadian();
        houseBuilder.doYouqi();
        return houseBuilder.getHouse();
    }
}
```

### 6、测试

```java
public class App {
    public static void main(String[] args) {
        house();
    }

    public static void house(){
        HouseDirector houseDirector = new HouseDirector();
        // 简装
        JianzhuangBuilder jianzhuangBuilder = new JianzhuangBuilder();
        System.out.println("我要简装");
        System.out.println(houseDirector.builder(jianzhuangBuilder));

        // 精装
        jingzhuangBuilder jingzhuangBuilder = new jingzhuangBuilder();
        System.out.println("我要精装");
        System.out.println(houseDirector.builder(jingzhuangBuilder));

    }
}
```

输出结果

```java
我要简装
House{jiadian="简单家电就好"，diban='普通地板 ，youqi= 污染较小的油漆就行'
我要精装
House{jiadian='二话不说，最好的'，diban='二话不说，实木地板，yougi='二话不说，给我来0污染的'}
```

我们以家装为例，实现了两个具体的建造者，一个简装建造者、一个精装建造者。我们只需要告诉家装公司，我是需要简装还是精装，他会去帮我们安排，我不需要知道里面具体的细节。

### 对象构建

在日常开发中，你是不是会经常看到下面这种代码:

```java
return new Docket(DocumentationType.SWAGGER_2)
        .apiInfo(apiInfo())
        .select()
        .apis(RequestHandlerSelectors.basePackage("com.curry.springbootswagger.controller"))
        .paths(PathSelectors.any())
        .build();
```

是不是很优美？学会了 Builder 模式之后，你也可以通过这种方式进行对象构建。它是通过变种的 Builder 模式实现的。先不解释了，我们先用 Builder 模式来实现跟上述的对象构建，使用学生类为例。

学生对象代码：

```java
public class Student {

    private String name;

    private int age;

    private int num;

    private String email;

    // 提供一个静态builder方法
    public static Student.Builder builder() {
        return new Student.Builder();
    }
    // 外部调用builder类的属性接口进行设值。
    public static class Builder{
        private String name;

        private int age;

        private int num;

        private String email;

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder age(int age) {
            this.age = age;
            return this;
        }

        public Builder num(int num) {
            this.num = num;
            return this;
        }

        public Builder email(String email) {
            this.email = email;
            return this;
        }

        public Student build() {
            // 将builder对象传入到学生构造函数
            return new Student(this);
        }
    }
    // 私有化构造器
    private Student(Builder builder) {
        name = builder.name;
        age = builder.age;
        num = builder.num;
        email = builder.email;
    }

    @Override
    public String toString() {
        return "Student{" +
                "name='" + name + '\'' +
                ", age=" + age +
                ", num=" + num +
                ", email='" + email + '\'' +
                '}';
    }
}
```

调用代码：

```java
public static void student(){
        Student student = Student.builder().name("平头哥").num(1).age(18).email("平头哥@163.com").build();
        System.out.println(student);
    }
```

可以看到，变种 Builder 模式包括以下内容：

- 在要构建的类内部创建一个静态内部类 Builder
- 静态内部类的参数与构建类一致
- 构建类的构造参数是 静态内部类，使用静态内部类的变量一一赋值给构建类
- 静态内部类提供参数的 setter 方法，并且返回值是当前 Builder 对象
- 最终提供一个 build 方法构建一个构建类的对象，参数是当前 Builder 对象

可能你会说，这种写法实现太麻烦了，确实需要我们写很多额外的代码，好在前辈们已经开发出了`lombok`来拯救我们，我们只需要引入`lombok`插件，然后在实体类上添加`@Builder`注解，你就可以使用 Builder 模式构建对象了。

## 建造者模式的优缺点

### 优点

- 在建造者模式中， 客户端不必知道产品内部组成的细节，将产品本身与产品的创建过程解耦，使得相同的创建过程可以创建不同的产品对象
- 每一个具体建造者都相对独立，而与其他的具体建造者无关，因此可以很方便地替换具体建造者或增加新的具体建造者， 用户使用不同的具体建造者即可得到不同的产品对象
- 可以更加精细地控制产品的创建过程 。将复杂产品的创建步骤分解在不同的方法中，使得创建过程更加清晰，也更方便使用程序来控制创建过程
- 增加新的具体建造者无须修改原有类库的代码，指挥者类针对抽象建造者类编程，系统扩展方便，符合“开闭原则”

### 缺点

- 建造者模式所创建的产品一般具有较多的共同点，其组成部分相似，如果产品之间的差异性很大，则不适合使用建造者模式，因此其使用范围受到一定的限制。
- 如果产品的内部变化复杂，可能会导致需要定义很多具体建造者类来实现这种变化，导致系统变得很庞大。
