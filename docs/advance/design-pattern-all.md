## 设计模式的六大原则

- 开闭原则：对扩展开放,对修改关闭，多使用抽象类和接口。
- 里氏替换原则：基类可以被子类替换，使用抽象类继承,不使用具体类继承。
- 依赖倒转原则：要依赖于抽象,不要依赖于具体，针对接口编程,不针对实现编程。
- 接口隔离原则：使用多个隔离的接口,比使用单个接口好，建立最小的接口。
- 迪米特法则：一个软件实体应当尽可能少地与其他实体发生相互作用，通过中间类建立联系。
- 合成复用原则：尽量使用合成/聚合,而不是使用继承。

## 单例模式

需要对实例字段使用线程安全的延迟初始化，使用双重检查锁定的方案；需要对静态字段使用线程安全的延迟初始化，使用静态内部类的方案。

### 饿汉模式

JVM在类的初始化阶段，会执行类的静态方法。在执行类的初始化期间，JVM会去获取Class对象的锁。这个锁可以同步多个线程对同一个类的初始化。

饿汉模式只在类加载的时候创建一次实例，没有多线程同步的问题。单例没有用到也会被创建，而且在类加载之后就被创建，内存就被浪费了。

```
public class Singleton {  
    private static Singleton instance = new Singleton();  
    private Singleton() {}  
    public static Singleton newInstance() {
        return instance;  
    }  
}
```
### 双重检查锁定

双重校验锁先判断 instance 是否已经被实例化，如果没有被实例化，那么才对实例化语句进行加锁。

instance使用static修饰的原因：getInstance为静态方法，因为静态方法的内部不能直接使用非静态变量，只有静态成员才能在没有创建对象时进行初始化，所以返回的这个实例必须是静态的。

```
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
为什么两次判断`instance == null`：

| Time | Thread A             | Thread B             |
| ---- | -------------------- | -------------------- |
| T1   | 检查到`instance`为空 |                      |
| T2   |                      | 检查到`instance`为空 |
| T3   |                      | 初始化对象`A`        |
| T4   |                      | 返回对象`A`          |
| T5   | 初始化对象`B`        |                      |
| T6   | 返回对象`B`          |                      |

`new Singleton()`会执行三个动作：分配内存空间、初始化对象和对象引用指向内存地址。

```java
memory = allocate();　　// 1：分配对象的内存空间
ctorInstance(memory);　 // 2：初始化对象
instance = memory;　　  // 3：设置instance指向刚分配的内存地址
```

由于指令重排优化的存在，导致初始化对象和将对象引用指向内存地址的顺序是不确定的。在某个线程创建单例对象时，会为该对象分配了内存空间并将对象的字段设置为默认值。此时就可以将分配的内存地址赋值给instance字段了，然而该对象可能还没有初始化。若紧接着另外一个线程来调用getInstance，取到的是未初始化的对象，程序就会出错。volatile 可以禁止指令重排序，保证了先初始化对象再赋值给instance变量。

| Time | Thread A                 | Thread B                                 |
| :--- | :----------------------- | :--------------------------------------- |
| T1   | 检查到`instance`为空     |                                          |
| T2   | 获取锁                   |                                          |
| T3   | 再次检查到`instance`为空 |                                          |
| T4   | 为`instance`分配内存空间 |                                          |
| T5   | 将`instance`指向内存空间 |                                          |
| T6   |                          | 检查到`instance`不为空                   |
| T7   |                          | 访问`instance`（此时对象还未完成初始化） |
| T8   | 初始化`instance`         |                                          |

### 静态内部类

它与饿汉模式一样，也是利用了类初始化机制，因此不存在多线程并发的问题。不一样的是，它是在内部类里面去创建对象实例。这样的话，只要应用中不使用内部类，JVM就不会去加载这个单例类，也就不会创建单例对象，从而实现懒汉式的延迟加载。也就是说这种方式可以同时保证延迟加载和线程安全。

![](http://img.dabin-coder.cn/image/singleton-class-init.png)

基于类初始化的方案的实现代码更简洁。

```
public class Instance {
    private static class InstanceHolder {
        public static Instance instance = new Instance();
    }
    private Instance() {}
    public static Instance getInstance() {
        return InstanceHolder.instance ;　　// 这里将导致InstanceHolder类被初始化
    }
}
```
但基于volatile的双重检查锁定的方案有一个额外的优势：除了可以对静态字段实现延迟初始化外，还可以对实例字段实现延迟初始化。字段延迟初始化降低了初始化类或创建实例的开销，但增加了访问被延迟初始化的字段的开销。在大多数时候，正常的初始化要优于延迟初始化。

## 工厂模式

工厂模式是用来封装对象的创建。

### 简单工厂模式

把实例化的操作单独放到一个类中，这个类就成为简单工厂类，让简单工厂类来决定应该用哪个具体子类来实例化，这样做能把客户类和具体子类的实现解耦，客户类不再需要知道有哪些子类以及应当实例化哪个子类。 

```java
 public class ShapeFactory {
          public static final String TAG = "ShapeFactory";
          public static Shape getShape(String type) {
              Shape shape = null;
              if (type.equalsIgnoreCase("circle")) {
                  shape = new CircleShape();
              } else if (type.equalsIgnoreCase("rect")) {
                  shape = new RectShape();
              } else if (type.equalsIgnoreCase("triangle")) {
                  shape = new TriangleShape();
              }
              return shape;
          }
   }
```

优点：只需要一个工厂创建对象，代码量少。

缺点：系统扩展困难，新增产品需要修改工厂逻辑，当产品较多时，会造成工厂逻辑过于复杂，不利于系统扩展和维护。

### 工厂方法模式

针对不同的对象提供不同的工厂。每个对象都有一个与之对应的工厂。

```java
public interface Reader {
    void read();
}

public class JpgReader implements Reader {
    @Override
    public void read() {
        System.out.print("read jpg");
    }
}

public class PngReader implements Reader {
    @Override
    public void read() {
        System.out.print("read png");
    }
}

public interface ReaderFactory {
    Reader getReader();
}

public class JpgReaderFactory implements ReaderFactory {
    @Override
    public Reader getReader() {
        return new JpgReader();
    }
}

public class PngReaderFactory implements ReaderFactory {
    @Override
    public Reader getReader() {
        return new PngReader();
    }
}
```

客户端通过子类来指定创建对应的对象。

```java
ReaderFactory factory=new JpgReaderFactory();
Reader  reader=factory.getReader();
reader.read();
```

优点：增加新的产品类时无须修改现有系统，只需增加新产品和对应的工厂类即可。

### 抽象工厂模式

抽象工厂模式创建的是对象家族，也就是很多对象而不是一个对象，并且这些对象是相关的，也就是说必须一起创建出来。而工厂方法模式只是用于创建一个对象，这和抽象工厂模式有很大不同。

多了一层抽象，减少了工厂的数量（HpMouseFactory和HpKeyboFactory合并为HpFactory）。

![](http://img.dabin-coder.cn/image/抽象工厂.png)



## 模板模式

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

## 策略模式

策略模式（Strategy Pattern）属于对象的行为模式。其用意是针对一组算法，将每一个算法封装到具有共同接口的独立的类中，从而使得它们可以相互替换。策略模式使得算法可以在不影响到客户端的情况下发生变化。

其主要目的是通过定义相似的算法，替换if else 语句写法，并且可以随时相互替换。

**策略模式**主要由这三个角色组成，环境角色(Context)、抽象策略角色(Strategy)和具体策略角色(ConcreteStrategy)。

- 环境角色(Context)：持有一个策略类的引用，提供给客户端使用。
- 抽象策略角色(Strategy)：这是一个抽象角色，通常由一个接口或抽象类实现。此角色给出所有的具体策略类所需的接口。
- 具体策略角色(ConcreteStrategy)：包装了相关的算法或行为。

示例图如下:

![](http://img.dabin-coder.cn/image/策略模式.png)

以计算器为例，如果我们想得到两个数字相加的和，我们需要用到“+”符号，得到相减的差，需要用到“-”符号等等。虽然我们可以通过字符串比较使用if/else写成通用方法，但是计算的符号每次增加，我们就不得不加在原先的方法中进行增加相应的代码，如果后续计算方法增加、修改或删除，那么会使后续的维护变得困难。

但是在这些方法中，我们发现其基本方法是固定的，这时我们就可以通过策略模式来进行开发，可以有效避免通过if/else来进行判断，即使后续增加其他的计算规则也可灵活进行调整。

首先定义一个抽象策略角色，并拥有一个计算的方法。

```java
interface CalculateStrategy {
   int doOperation(int num1, int num2);
}
```

然后再定义加减乘除这些具体策略角色并实现方法。代码如下:

```java
class OperationAdd implements CalculateStrategy {
   @Override
   public int doOperation(int num1, int num2) {
   	return num1 + num2;
   }
}

class OperationSub implements CalculateStrategy {
   @Override
   public int doOperation(int num1, int num2) {
   	return num1 - num2;
   }
}

class OperationMul implements CalculateStrategy {
   @Override
   public int doOperation(int num1, int num2) {
   	return num1 * num2;
   }
}

class OperationDiv implements CalculateStrategy {
   @Override
   public int doOperation(int num1, int num2) {
   	return num1 / num2;
   }
}
```

最后在定义一个环境角色，提供一个计算的接口供客户端使用。代码如下:

```java
class  CalculatorContext {
	private CalculateStrategy strategy;

	public CalculatorContext(CalculateStrategy strategy) {
		this.strategy = strategy;
	}

	public int executeStrategy(int num1, int num2) {
		return strategy.doOperation(num1, num2);
	}
}
```

测试代码如下:

```java
public static void main(String[] args) {
  		   int a=4,b=2;
		  CalculatorContext context = new CalculatorContext(new OperationAdd());    
	      System.out.println("a + b = "+context.executeStrategy(a, b));
	 
	      CalculatorContext context2 = new CalculatorContext(new OperationSub());      
	      System.out.println("a - b = "+context2.executeStrategy(a, b));
	 
	      CalculatorContext context3 = new CalculatorContext(new OperationMul());    
	      System.out.println("a * b = "+context3.executeStrategy(a, b));
	
	      CalculatorContext context4 = new CalculatorContext(new OperationDiv());    
	      System.out.println("a / b = "+context4.executeStrategy(a, b));
}
```

**策略模式优点：**

- 扩展性好，可以在不修改对象结构的情况下，为新的算法进行添加新的类进行实现；
- 灵活性好，可以对算法进行自由切换；

**策略模式缺点：**

- 使用策略类变多，会增加系统的复杂度。；
- 客户端必须知道所有的策略类才能进行调用；

**使用场景：**

- 如果在一个系统里面有许多类，它们之间的区别仅在于它们的行为，那么使用策略模式可以动态地让一个对象在许多行为中选择一种行为；
  一个系统需要动态地在几种算法中选择一种;
- 如果一个对象有很多的行为，如果不用恰当的模式，这些行为就只好使用多重的条件选择语句来实现;

## 责任链模式

为了避免请求发送者与多个请求处理者耦合在一起，于是将所有请求的处理者通过前一对象记住其下一个对象的引用而连成一条链；当有请求发生时，可将请求沿着这条链传递，直到有对象处理它为止。

在责任链模式中，客户只需要将请求发送到责任链上即可，无须关心请求的处理细节和请求的传递过程，请求会自动进行传递。所以责任链将请求的发送者和请求的处理者解耦了。

**责任链模式是一种对象行为型模式，其主要优点如下。**

1. 降低了对象之间的耦合度。该模式使得一个对象无须知道到底是哪一个对象处理其请求以及链的结构，发送者和接收者也无须拥有对方的明确信息。
2. 增强了系统的可扩展性。可以根据需要增加新的请求处理类，满足开闭原则。
3. 增强了给对象指派职责的灵活性。当工作流程发生变化，可以动态地改变链内的成员或者调动它们的次序，也可动态地新增或者删除责任。
4. 责任链简化了对象之间的连接。每个对象只需保持一个指向其后继者的引用，不需保持其他所有处理者的引用，这避免了使用众多的 if 或者 if···else 语句。
5. 责任分担。每个类只需要处理自己该处理的工作，不该处理的传递给下一个对象完成，明确各类的责任范围，符合类的单一职责原则。

代码实现如下：

请假条类

```java
public class LeaveRequest {
    //姓名
    private String name;
    // 请假天数
    private int num;
    // 请假内容
    private String content;

    public LeaveRequest(String name, int num, String content) {
        this.name = name;
        this.num = num;
        this.content = content;
    }

    public String getName() {
        return name;
    }

    public int getNum() {
        return num;
    }

    public String getContent() {
        return content;
    }

}
```

处理类

```java
public abstract class Handler {
    protected final static int NUM_ONE = 1;
    protected final static int NUM_THREE = 3;
    protected final static int NUM_SEVEN = 7;

    //该领导处理的请假天数区间
    private int numStart;
    private int numEnd;


    //领导上还有领导
    private Handler nextHandler;

    //设置请假天数范围
    public Handler(int numStart) {
        this.numStart = numStart;
    }

    //设置请假天数范围
    public Handler(int numStart, int numEnd) {
        this.numStart = numStart;
        this.numEnd = numEnd;
    }

    //设置上级领导
    public void setNextHandler(Handler nextHandler) {
        this.nextHandler = nextHandler;
    }

    //提交请假条
    public final void submit(LeaveRequest leaveRequest) {
        if (this.numStart == 0) {
            return;
        }
        //请假天数达到领导处理要求
        if (leaveRequest.getNum() >= this.numStart) {
            this.handleLeave(leaveRequest);

            //如果还有上级 并且请假天数超过当前领导的处理范围
            if (this.nextHandler != null && leaveRequest.getNum() > numEnd) {
                //继续提交
                this.nextHandler.submit(leaveRequest);
            } else {
                System.out.println("流程结束！！！");
            }
        }
    }

    //各级领导处理请假条方法
    protected abstract void handleLeave(LeaveRequest leave);

}
```

小组长类

```java
public class GroupLeader extends Handler {
    //1-3天的假
    public GroupLeader() {
        super(Handler.NUM_ONE, Handler.NUM_THREE);
    }

    @Override
    protected void handleLeave(LeaveRequest leave) {
        System.out.println(leave.getName() + "请假" + leave.getNum() + "天，" + leave.getContent() + "!");
        System.out.println("小组长审批通过：同意！");
    }
}
```

部门经理类

```java
public class Manager extends Handler {
    //3-7天的假
    public Manager() {
        super(Handler.NUM_THREE, Handler.NUM_SEVEN);
    }

    @Override
    protected void handleLeave(LeaveRequest leave) {
        System.out.println(leave.getName() + "请假" + leave.getNum() + "天，" + leave.getContent() + "!");
        System.out.println("部门经理审批通过：同意！");
    }
}
```

总经理类

```java
public class GeneralManager extends Handler{
    //7天以上的假
    public GeneralManager() {
        super(Handler.NUM_THREE, Handler.NUM_SEVEN);
    }

    @Override
    protected void handleLeave(LeaveRequest leave) {
        System.out.println(leave.getName() + "请假" + leave.getNum() + "天，" + leave.getContent() + "!");
        System.out.println("总经理审批通过：同意！");
    }
}
```

测试类

```java
public class Client {
    public static void main(String[] args) {
        //请假条
        LeaveRequest leave = new LeaveRequest("小庄", 3, "出去旅游");

        //各位领导
        Manager manager = new Manager();
        GroupLeader groupLeader = new GroupLeader();
        GeneralManager generalManager = new GeneralManager();

        /*
         * 小组长上司是经理 经理上司是总经理
         */
        groupLeader.setNextHandler(manager);
        manager.setNextHandler(generalManager);

        //提交
        groupLeader.submit(leave);

    }
}
```

应用场景：

1. 多个对象可以处理一个请求，但具体由哪个对象处理该请求在运行时自动确定。
2. 可动态指定一组对象处理请求，或添加新的处理者。
3. 需要在不明确指定请求处理者的情况下，向多个处理者中的一个提交请求。

[参考链接](https://segmentfault.com/a/1190000040450513)

## 迭代器模式

提供一种方法顺序访问一个聚合对象中的各个元素, 而又不暴露其内部的表示。

把在元素之间游走的责任交给迭代器，而不是聚合对象。

**应用实例：**JAVA 中的 iterator。

**优点：** 1、它支持以不同的方式遍历一个聚合对象。 2、迭代器简化了聚合类。 3、在同一个聚合上可以有多个遍历。 4、在迭代器模式中，增加新的聚合类和迭代器类都很方便，无须修改原有代码。

**缺点：**由于迭代器模式将存储数据和遍历数据的职责分离，增加新的聚合类需要对应增加新的迭代器类，类的个数成对增加，这在一定程度上增加了系统的复杂性。

**使用场景：** 1、访问一个聚合对象的内容而无须暴露它的内部表示。 2、需要为聚合对象提供多种遍历方式。 3、为遍历不同的聚合结构提供一个统一的接口。

**迭代器模式在JDK中的应用**

ArrayList的遍历：

```java
Iterator<Integer> iter = null;

System.out.println("ArrayList：");
iter = arrayList.iterator();
while (iter.hasNext()) {
    System.out.print(iter.next() + "\t");
}
```



## 装饰模式

装饰者模式(decorator pattern)：动态地将责任附加到对象上, 若要扩展功能, 装饰者提供了比继承更有弹性的替代方案。

装饰模式以对客户端透明的方式拓展对象的功能，客户端并不会觉得对象在装饰前和装饰后有什么不同。装饰模式可以在不创造更多子类的情况下，将对象的功能加以扩展。

比如设置FileInputStream，先用BufferedInputStream装饰它，再用自己写的LowerCaseInputStream过滤器去装饰它。

```
InputStream in = new LowerCaseInputStream(
                                        new  BufferedInputStream(
                                         new  FileInputStream("test.txt")));
```
在装饰模式中的角色有：

- 抽象组件(Component)角色：给出一个抽象接口，以规范准备接收附加责任的对象。
- 具体组件(ConcreteComponent)角色：定义一个将要接收附加责任的类。
- 装饰(Decorator)角色：持有一个构件(Component)对象的实例，并定义一个与抽象构件接口一致的接口。
- 具体装饰(ConcreteDecorator)角色：负责给构件对象“贴上”附加的责任。

## 适配器模式
适配器模式将现成的对象通过适配变成我们需要的接口。 适配器让原本接口不兼容的类可以合作。

适配器模式有类的适配器模式和对象的适配器模式两种不同的形式。

对象适配器模式通过组合对象进行适配。

![](http://img.dabin-coder.cn/image/适配器对象适配,png)

类适配器通过继承来完成适配。

![](http://img.dabin-coder.cn/image/适配器-类继承,png)

适配器模式的**优点**：

1. 更好的复用性。系统需要使用现有的类，而此类的接口不符合系统的需要。那么通过适配器模式就可以让这些功能得到更好的复用。
2. 更好的扩展性。在实现适配器功能的时候，可以调用自己开发的功能，从而自然地扩展系统的功能。    

## 观察者模式

定义对象之间的一对多依赖，当一个对象状态改变时，它的所有依赖都会收到通知并且自动更新状态。

主题(Subject)是被观察的对象，而其所有依赖者(Observer)称为观察者。

多个观察者对象同时监听某一个主题对象。这个主题对象在状态上发生变化时，会通知所有观察者对象，使它们能够自动更新自己。其作用是让主题对象和观察者松耦合。

观察者模式所涉及的角色有：

- 抽象主题(Subject)角色：抽象主题角色把所有对观察者对象的引用保存在一个聚集（比如ArrayList对象）里，每个主题都可以有任何数量的观察者。抽象主题提供一个接口，可以增加和删除观察者对象，抽象主题角色又叫做抽象被观察者(Observable)角色。
- 具体主题(ConcreteSubject)角色：将有关状态存入具体观察者对象；在具体主题的内部状态改变时，给所有登记过的观察者发出通知。具体主题角色又叫做具体被观察者(Concrete Observable)角色。
- 抽象观察者(Observer)角色：为所有的具体观察者定义一个接口，在得到主题的通知时更新自己，这个接口叫做更新接口。
- 具体观察者(ConcreteObserver)角色：存储与主题的状态自恰的状态。具体观察者角色实现抽象观察者角色所要求的更新接口，以便使本身的状态与主题的状态相协调。如果需要，具体观察者角色可以保持一个指向具体主题对象的引用。



## 代理模式

代理模式使用代理对象完成用户请求，屏蔽用户对真实对象的访问。

### 静态代理

静态代理：代理类在编译阶段生成，程序运行前就已经存在，在编译阶段将通知织入Java字节码中。

缺点：因为代理对象需要与目标对象实现一样的接口，所以会有很多代理类。同时，一旦接口增加方法，目标对象与代理对象都要维护。

### 动态代理

动态代理：代理类在程序运行时创建，在内存中临时生成一个代理对象，在运行期间对业务方法进行增强。

**JDK动态代理**

JDK实现代理只需要使用newProxyInstance方法：

```java
static Object newProxyInstance(ClassLoader loader, Class<?>[] interfaces,   InvocationHandler h )
```

三个入参：

- ClassLoader loader：指定当前目标对象使用的类加载器
- Class<?>[] interfaces：目标对象实现的接口的类型
- InvocationHandler：当代理对象调用目标对象的方法时，会触发事件处理器的invoke方法()

示例代码：

```
public class DynamicProxyDemo {

    public static void main(String[] args) {
        //被代理的对象
        MySubject realSubject = new RealSubject();

        //调用处理器
        MyInvacationHandler handler = new MyInvacationHandler(realSubject);

        MySubject subject = (MySubject) Proxy.newProxyInstance(realSubject.getClass().getClassLoader(),
                realSubject.getClass().getInterfaces(), handler);

        System.out.println(subject.getClass().getName());
        subject.rent();
    }
}

interface MySubject {
    public void rent();
}
class RealSubject implements MySubject {

    @Override
    public void rent() {
        System.out.println("rent my house");
    }
}
class MyInvacationHandler implements InvocationHandler {

    private Object subject;

    public MyInvacationHandler(Object subject) {
        this.subject = subject;
    }

    @Override
    public Object invoke(Object object, Method method, Object[] args) throws Throwable {
        System.out.println("before renting house");
        //invoke方法会拦截代理对象的方法调用
        Object o = method.invoke(subject, args);
        System.out.println("after rentint house");
        return o;
    }
}
```

## 建造者模式

建造者模式：封装一个对象的构造过程，并允许按步骤构造。

有两种形式：传统建造者模式和传统建造者模式变种。

传统建造者模式：

```java
public class Computer {
    private final String cpu;//必须
    private final String ram;//必须
    private final int usbCount;//可选
    private final String keyboard;//可选
    private final String display;//可选

    private Computer(Builder builder){
        this.cpu=builder.cpu;
        this.ram=builder.ram;
        this.usbCount=builder.usbCount;
        this.keyboard=builder.keyboard;
        this.display=builder.display;
    }
    public static class Builder{
        private String cpu;//必须
        private String ram;//必须
        private int usbCount;//可选
        private String keyboard;//可选
        private String display;//可选

        public Builder(String cup,String ram){
            this.cpu=cup;
            this.ram=ram;
        }
        public Builder setDisplay(String display) {
            this.display = display;
            return this;
        }       
        //set...
        public Computer build(){
            return new Computer(this);
        }
    }
}

public class ComputerDirector {
    public void makeComputer(ComputerBuilder builder){
        builder.setUsbCount();
        builder.setDisplay();
        builder.setKeyboard();
    }
}
```

传统建造者模式变种，链式调用：

```java
public class LenovoComputerBuilder extends ComputerBuilder {
    private Computer computer;
    public LenovoComputerBuilder(String cpu, String ram) {
        computer=new Computer(cpu,ram);
    }
    @Override
    public void setUsbCount() {
        computer.setUsbCount(4);
    }
	//...
    @Override
    public Computer getComputer() {
        return computer;
    }
}

Computer computer=new Computer.Builder("因特尔","三星")
                .setDisplay("三星24寸")
                .setKeyboard("罗技")
                .setUsbCount(2)
                .build();
```

