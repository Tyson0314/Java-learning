# 装饰模式

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

