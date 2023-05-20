---
sidebar: heading
title: 设计模式之装饰模式
category: 设计模式
tag:
  - 设计模式
head:
  - - meta
    - name: keywords
      content: 装饰模式,设计模式,装饰者
  - - meta
    - name: description
      content: 设计模式常见面试题总结，让天下没有难背的八股文！
---

# 装饰者模式

装饰者模式(decorator pattern)：动态地将责任附加到对象上, 若要扩展功能, 装饰者提供了比继承更有弹性的替代方案。

装饰模式以对客户端透明的方式拓展对象的功能，客户端并不会觉得对象在装饰前和装饰后有什么不同。装饰模式可以在不创造更多子类的情况下，将对象的功能加以扩展。

比如设置FileInputStream，先用BufferedInputStream装饰它，再用自己写的LowerCaseInputStream过滤器去装饰它。

```
InputStream in = new LowerCaseInputStream(new BufferedInputStream(new FileInputStream("test.txt")));
```
在装饰模式中的角色有：

- **抽象组件**(Component)角色：给出一个抽象接口，以规范准备接收附加责任的对象。
- **具体组件**(ConcreteComponent)角色：定义一个将要接收附加责任的类。
- **抽象装饰**(Decorator)角色：持有一个组件(Component)对象的实例，并定义一个与抽象组件接口一致的接口。
- **具体装饰**(ConcreteDecorator)角色：负责给构件对象“贴上”附加的责任。

**代码实例**

LOL、王者荣耀等类Dota游戏中，每次英雄升级都会附加一个额外技能点学习技能，这个就类似装饰模式为已有类动态附加额外的功能。

具体的英雄就是ConcreteComponent，技能栏就是装饰器Decorator，每个技能就是ConcreteDecorator。

新建一个接口：

```java
public interface Hero {
    //学习技能
    void learnSkills();
}
```

创建接口的实现类（具体英雄盲僧）：

```java
//ConcreteComponent 具体英雄盲僧
public class BlindMonk implements Hero {
    
    private String name;
    
    public BlindMonk(String name) {
        this.name = name;
    }

    @Override
    public void learnSkills() {
        System.out.println(name + "学习了以上技能！");
    }
}
```

装饰角色：

```java
//Decorator 技能栏
public abstract class Skills implements Hero {
    
    //持有一个英雄对象接口
    private Hero hero;
    
    public Skills(Hero hero) {
        this.hero = hero;
    }

    @Override
    public void learnSkills() {
        if(hero != null)
            hero.learnSkills();
    }    
}
```

具体装饰角色：

```java
//ConreteDecorator 技能：Q
public class Skill_Q extends Skills{
    
    private String skillName;

    public Skill_Q(Hero hero,String skillName) {
        super(hero);
        this.skillName = skillName;
    }

    @Override
    public void learnSkills() {
        System.out.println("学习了技能Q:" +skillName);
        super.learnSkills();
    }
}

//ConreteDecorator 技能：W
public class Skill_W extends Skills{

    private String skillName;

    public Skill_W(Hero hero,String skillName) {
        super(hero);
        this.skillName = skillName;
    }

    @Override
    public void learnSkills() {
        System.out.println("学习了技能W:" + skillName);
        super.learnSkills();
    }
}
//ConreteDecorator 技能：E
public class Skill_E extends Skills{
    
    private String skillName;
    
    public Skill_E(Hero hero,String skillName) {
        super(hero);
        this.skillName = skillName;
    }

    @Override
    public void learnSkills() {
        System.out.println("学习了技能E:"+skillName);
        super.learnSkills();
    }
}
//ConreteDecorator 技能：R
public class Skill_R extends Skills{    
    
    private String skillName;
    
    public Skill_R(Hero hero,String skillName) {
        super(hero);
        this.skillName = skillName;
    }
    
    @Override
    public void learnSkills() {
        System.out.println("学习了技能R:" +skillName );
        super.learnSkills();
    }
}
```

客户端：

```java
//客户端：召唤师
public class Player {
    public static void main(String[] args) {
        //选择英雄
        Hero hero = new BlindMonk("李青");
        
        Skills skills = new Skills(hero);
        Skills r = new Skill_R(skills,"猛龙摆尾");
        Skills e = new Skill_E(r,"天雷破/摧筋断骨");
        Skills w = new Skill_W(e,"金钟罩/铁布衫");
        Skills q = new Skill_Q(w,"天音波/回音击");
        //学习技能
        q.learnSkills();
    }
}
```

输出：

```java
学习了技能Q:天音波/回音击
学习了技能W:金钟罩/铁布衫
学习了技能E:天雷破/摧筋断骨
学习了技能R:猛龙摆尾
李青学习了以上技能！
```

