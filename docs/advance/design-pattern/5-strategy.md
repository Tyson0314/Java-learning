# 策略模式

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

