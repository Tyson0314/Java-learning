# 模板模式

模板模式：一个抽象类公开定义了执行它的方法的方式/模板。它的子类可以按需要重写方法实现，但调用将以抽象类中定义的方式进行。 这种类型的设计模式属于行为型模式。定义一个操作中的算法的骨架，而将一些步骤延迟到子类中。

**模板模式**主要由抽象模板(Abstract Template)角色和具体模板(Concrete Template)角色组成。

- 抽象模板(Abstract Template): 定义了一个或多个抽象操作，以便让子类实现。这些抽象操作叫做基本操作，它们是一个顶级逻辑的组成步骤;定义并实现了一个模板方法。这个模板方法一般是一个具体方法，它给出了一个顶级逻辑的骨架，而逻辑的组成步骤在相应的抽象操作中，推迟到子类实现。顶级逻辑也有可能调用一些具体方法。
- 具体模板(Concrete Template): 实现父类所定义的一个或多个抽象方法，它们是一个顶级逻辑的组成步骤;每一个抽象模板角色都可以有任意多个具体模板角色与之对应，而每一个具体模板角色都可以给出这些抽象方法（也就是顶级逻辑的组成步骤）的不同实现，从而使得顶级逻辑的实现各不相同。

示例图如下:

![](http://img.dabin-coder.cn/image/模板方法.jpg)

以游戏为例。创建一个抽象类，它的模板方法被设置为 final，这样它就不会被重写。

```java
public abstract class Game {
   abstract void initialize();
   abstract void startPlay();
   abstract void endPlay();
 
   //模板
   public final void play(){
      //初始化游戏
      initialize();
 
      //开始游戏
      startPlay();
 
      //结束游戏
      endPlay();
   }
}
```

Football类：

```java
public class Football extends Game {
 
   @Override
   void endPlay() {
      System.out.println("Football Game Finished!");
   }
 
   @Override
   void initialize() {
      System.out.println("Football Game Initialized! Start playing.");
   }
 
   @Override
   void startPlay() {
      System.out.println("Football Game Started. Enjoy the game!");
   }
}
```

使用Game的模板方法 play() 来演示游戏的定义方式。

```java
public class TemplatePatternDemo {
   public static void main(String[] args) {
 
      Game game = new Cricket();
      game.play();
      System.out.println();
      game = new Football();
      game.play();      
   }
}
```

**模板模式优点** ：

1. 封装不变部分，扩展可变部分。
2. 提取公共代码，便于维护。
3. 行为由父类控制，子类实现。

**模板模式缺点**：

- 每一个不同的实现都需要一个子类来实现，导致类的个数增加，使得系统更加庞大。

