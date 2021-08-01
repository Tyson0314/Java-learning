<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [共享对象](#%E5%85%B1%E4%BA%AB%E5%AF%B9%E8%B1%A1)
  - [非原子的64位操作](#%E9%9D%9E%E5%8E%9F%E5%AD%90%E7%9A%8464%E4%BD%8D%E6%93%8D%E4%BD%9C)
  - [this 引用逸出](#this-%E5%BC%95%E7%94%A8%E9%80%B8%E5%87%BA)
  - [安全的对象构造过程](#%E5%AE%89%E5%85%A8%E7%9A%84%E5%AF%B9%E8%B1%A1%E6%9E%84%E9%80%A0%E8%BF%87%E7%A8%8B)
  - [ThreadLocal](#threadlocal)
- [容器](#%E5%AE%B9%E5%99%A8)
  - [间接的迭代操作](#%E9%97%B4%E6%8E%A5%E7%9A%84%E8%BF%AD%E4%BB%A3%E6%93%8D%E4%BD%9C)
  - [ConcurrentHashMap](#concurrenthashmap)
  - [同步工具类](#%E5%90%8C%E6%AD%A5%E5%B7%A5%E5%85%B7%E7%B1%BB)
    - [信号量](#%E4%BF%A1%E5%8F%B7%E9%87%8F)
  - [缓存系统](#%E7%BC%93%E5%AD%98%E7%B3%BB%E7%BB%9F)
- [任务执行](#%E4%BB%BB%E5%8A%A1%E6%89%A7%E8%A1%8C)
  - [Executor 框架](#executor-%E6%A1%86%E6%9E%B6)
    - [延迟任务](#%E5%BB%B6%E8%BF%9F%E4%BB%BB%E5%8A%A1)
    - [携带结果的 Callable 和 Future](#%E6%90%BA%E5%B8%A6%E7%BB%93%E6%9E%9C%E7%9A%84-callable-%E5%92%8C-future)
    - [为任务设置时限](#%E4%B8%BA%E4%BB%BB%E5%8A%A1%E8%AE%BE%E7%BD%AE%E6%97%B6%E9%99%90)
  - [取消与关闭](#%E5%8F%96%E6%B6%88%E4%B8%8E%E5%85%B3%E9%97%AD)
    - [任务取消](#%E4%BB%BB%E5%8A%A1%E5%8F%96%E6%B6%88)
    - [阻塞和中断](#%E9%98%BB%E5%A1%9E%E5%92%8C%E4%B8%AD%E6%96%AD)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 共享对象

### 非原子的64位操作

在多线程程序使用共享且可变的64位数据类型的变量是不安全的。



### this 引用逸出

参考自：[this 引用逸出](https://www.cnblogs.com/whatisjava/archive/2013/05/29/3106336.html)

实例化 ThisEscape 对象时，会调用 source 的 registerListener 方法，这时便启动了一个线程，而且这个线程持有了 ThisEscape 对象（调用了对象的 doSomething 方法），但此时 ThisEscape 对象却没有实例化完成（还没有返回一个引用），所以我们说，此时造成了一个 this 引用逸出，即还没有完成的实例化 ThisEscape 对象的动作，却已经暴露了对象的引用。其他线程访问还没有构造好的对象，可能会造成意料不到的问题。

```java
public class ThisEscape {
　　public ThisEscape(EventSource source) {
　　　　source.registerListener(new EventListener() {
　　　　　　public void onEvent(Event e) {
　　　　　　　　doSomething(e);
　　　　　　}
　　　　});
　　}

　　void doSomething(Event e) {
　　}

　　interface EventSource {
　　　　void registerListener(EventListener e);
　　}

　　interface EventListener {
　　　　void onEvent(Event e);
　　}

　　interface Event {
　　}
}
```

### 安全的对象构造过程

使用工厂方法来防止 this 引用在构造过程中逸出。

```java
public class SafeListener {
　　private final EventListener listener;

　　private SafeListener() {
　　　　listener = new EventListener() {
　　　　　　public void onEvent(Event e) {
　　　　　　　　doSomething(e);
　　　　　　}
　　　　};
　　}

　　public static SafeListener newInstance(EventSource source) {
　　　　SafeListener safe = new SafeListener();
　　　　source.registerListener(safe.listener);
　　　　return safe;
　　}

　　void doSomething(Event e) {
　　}

　　interface EventSource {
　　　　void registerListener(EventListener e);
　　}

　　interface EventListener {
　　　　void onEvent(Event e);
　　}

　　interface Event {
　　}
　}
```

构造好了 SafeListener 对象（通过构造器构造）之后，才启动了监听线程，也就确保了构造完成之后再使用SafeListener对象。

### ThreadLocal

当使用ThreadLocal维护变量时，ThreadLocal为每个使用该变量的线程提供独立的变量副本，所以每一个线程都可以独立地改变自己的副本，而不会影响其它线程所对应的副本。
每个线程都有一个ThreadLocalMap（ThreadLocal内部类），Map中元素的键为ThreadLocal，而值对应线程的变量副本。
调用set()-->调用getMap(Thread)-->返回当前线程的ThreadLocalMap<ThreadLocal, value>-->map.set(this, value)，this是ThreadLocal。
调用get()-->调用getMap(Thread)-->返回当前线程的ThreadLocalMap<ThreadLocal, value>-->map.getEntry(this)，返回value。

```java
public class ThreadLocalDemo {
    ThreadLocal<Long> longLocal = new ThreadLocal<>();

    public void set() {
        longLocal.set(Thread.currentThread().getId());
    }

    public String get() {
        return Thread.currentThread().getName() + ": " + longLocal.get();
    }

    public static void main(String[] args) throws InterruptedException {
        ThreadLocalDemo threadLocalDemo = new ThreadLocalDemo();
        threadLocalDemo.set();
        System.out.println(threadLocalDemo.get());

        Thread thread = new Thread(() -> {
            threadLocalDemo.set();
            System.out.println(threadLocalDemo.get());
        }
        );

        thread.start();
        thread.join();

        System.out.println(threadLocalDemo.get());
    }
}
/*output
main: 1
Thread-0: 11
main: 1
 */
```

## 容器

### 间接的迭代操作

调用容器的 toString 方法会迭代容器。容器的 hashcode 和 equals 方法也会间接的进行迭代操作。

```java
public class HiddenIterator {
    private final Set<Integer> set = new HashSet<>();
    //...
    public void print() {
        System.out.println("set: " + set);
    }
}
```

### ConcurrentHashMap
多线程环境下，使用Hashmap进行put操作会引起死循环。
CocurrentHashMap利用锁分段技术增加了锁的数目，从而使争夺同一把锁的线程的数目得到控制。
锁分段技术就是将数据分成一段一段的存储，然后给每一段数据配一把锁，当一个线程占用锁访问其中一个段数据的时候，其他段的数据也能被其他线程访问。
ConcurrentHashMap调用get的时候不加锁，原因是node数组成员val和指针next是用volatile修饰的，更改后的值会立刻刷新到主存中，保证了可见性，node数组table也用volatile修饰，保证在运行过程对其他线程具有可见性。

JDK1.7中的ConcurrentHashmap主要使用Segment来实现减小锁粒度，把HashMap分割成若干个Segment，在put的时候需要锁住Segment，get时候不加锁，使用volatile来保证可见性，当要统计size时，比较统计前后modCount是否发生变化。如果没有变化，则直接返回size。否则，需要依次锁住所有的Segment来计算。jdk1.7中ConcurrentHashmap中，当长度过长碰撞会很频繁，链表的增改删查操作都会消耗很长的时间，影响性能。

jdk1.8不采用segment而采用Node，锁住Node来实现减小锁粒度。当链表长度过长时，Node会转换成TreeNode。

put 操作会对当前的table进行无条件自循环直到put成功，可以分成以下流程来概述：
1）如果没有初始化就先调用 initTable 方法来进行初始化过程
2）如果没有hash冲突就直接CAS插入
3）如果还在进行扩容操作就先进行扩容
4）如果存在hash冲突，就加锁来保证线程安全，这里有两种情况，一种是链表形式就直接遍历到尾端插入，一种是红黑树就按照红黑树结构插入

5）如果该链表的数量大于阈值8，就要先转换成黑红树的结构
6）如果添加成功就调用 addCount 方法统计size，并且检查是否需要扩容

### 同步工具类

#### 信号量

信号量 Semaphore 用来控制同时访问某个特定资源的操作数量，或者同时执行某个指定操作的数量。

通过信号量实现有界的HashSet：

```java
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.Semaphore;

public class BoundedHashSet<T> {
    private final Set<T> set;
    private final Semaphore sem;

    public BoundedHashSet(int bound) {
        set = Collections.synchronizedSet(new HashSet<>());
        sem = new Semaphore(bound);
    }

    public boolean add(T t) throws InterruptedException {
        sem.acquire();
        boolean wasAdded = false;
        try {
            wasAdded = set.add(t);
            return wasAdded;
        } finally {
            if (!wasAdded) {
                sem.release();
            }
        }
    }

    public boolean remove(Object o) {
        boolean wasRemoved = set.remove(o);
        if (wasRemoved) {
            sem.release();
        }
        return wasRemoved;
    }
}
```

### 缓存系统

假设有一个高计算开销的 compute 函数，我们可以将计算结果保存在 Map 中，调用 compute 时先检查 Map 是否存在需要的结果。使用 ConturrentHashMap 可以提高系统的并发能力。假如两个线程同时调用 compute ，则相同的数据会被计算多次，使用 FutureTask 可以避免这个问题。

```java
interface Computable<A, V> {
    V compute(A arg) throws InterruptedException;
}

public class Memorizer<A, V> implements Computable<A, V> {
    private final ConcurrentMap<A, Future<V>> cache = new ConcurrentHashMap<>();
    private final Computable<A, V> c;
    public Memorizer(Computable<A, V> c) {
        this.c = c;
    }
    @Override
    public V compute(A arg) throws InterruptedException {
        while (true) {
            Future<V> f = cache.get(arg);
            if (f == null) {
                Callable<V> eval = new Callable<V>() {
                    @Override
                    public V call() throws InterruptedException {
                        return c.compute(arg);
                    }
                };
                FutureTask<V> ft = new FutureTask<>(eval);
                //先放进缓存，再进行计算；若线程x正在计算某个值，而线程y刚好正在查找这个值，则线程y会等待x的计算结果
                f = cache.putIfAbsent(arg, ft);
                //避免两个线程同一时间调用compute计算相同的值
                if (f == null) {
                    f = ft;
                    ft.run();
                }
            }
            try {
                return f.get();
            } catch (CancellationException ex) {
                cache.remove(arg, f);
            } catch (ExecutionException ex) {
                ex.printStackTrace();
            }
        }
    }
}
```

## 任务执行

### Executor 框架

1.5后引入的 Executor 框架的最大优点是把任务的提交和执行解耦。Executor 是任务执行的抽象，，使用 Runnable 或 Callable 来表示任务。

```java
public class TaskExecutionWebServer {
    private static final int NTHREADS = 100;
    private static final Executor exec = Executors.newFixedThreadPool(NTHREADS);

    public static void main(String[] args) throws IOException {
        ServerSocket socket = new ServerSocket(80);
        while (true) {
            final Socket connection = socket.accept();
            Runnable task = new Runnable() {
                @Override
                public void run() {
                    //handleRequest(connection);
                }
            };
            //将任务提交到工作队列
            exec.execute(task);
        }
    }
}
```



#### 延迟任务

Timer 类负责延迟任务和周期任务，然后 Timer 存在一些缺陷。现在一般使用 ScheduledThreadPoolExecutor 来代替它，通过 ScheduledThreadPoolExecutor 的构造函数或者 Executors.newScheduledThreadPool 工厂方法来创建该类的对象（不推荐，见阿里编码规范）。

#### 携带结果的 Callable 和 Future

当提交一个Callable对象给ExecutorService，将得到一个Future对象，调用Future对象的get方法等待执行结果就好了。而 get 方法的行为取决于任务的状态（尚未开始、正在运行、已完成）。任务已完成，那么 get 会立即返回或者抛出异常；任务没有完成，get 将一直阻塞直到任务完成；任务抛出异常，那么 get 会将异常封装成 ExecutionException 重新抛出；任务被取消，那么 get 将抛出 CancellationExeception，此时通过 getCause 可以获取被封装的初始异常。


#### 为任务设置时限

Future.get() 支持时间限制，当结果可用时，它将直接返回，如果在指定时间内没有计算出结果，那么将抛出 TimeoutException。

```java
Page renderPageWithAd() throws InterruptedException {
    long endNanos = System.nanoTime() + TIME_BUDGET;
    Future<Ad> f = exec.submit(new FetchAdTask());
    //等待广告同时显示页面
    Page page = renderPageBody();
    Ad ad;
    try {
        //只等待指定的时间
        long timeLeft = endNanos - System.nanoTime();
        ad = f.get(timeLeft, NANOSECONDES);
    } catch (ExecutionException e) {
        ad = DEFAULT_AD;
    } catch (TimeoutException e) {
        ad = DEFAULT_AD;
        //超时则取消任务
        f.cancel(true);
    }
    page.setAd(ad);
    return page;
}
```

### 取消与关闭

Java 没有提供任何机制来安全的终止线程，但它提供了中断机制，这是一种协作机制，能够使一个线程终止另一个线程的当前工作。


#### 任务取消

给任务设置某个“请求取消”的标志，而任务将定期查看该标志，如果设置了该标志，那么任务将提前结束。

#### 阻塞和中断

如果任务中调用了一个阻塞方法，那么任务有可能永远不会检查取消标志，因此永远不会结束。通过中断机制可以避免这个问题。一些特殊的阻塞库的方法支持中断。

线程可能受到阻塞的原因：等待 IO 操作，等待获得锁，等待从 Thread.sleep 方法醒来，或是等待另一个线程的计算结果。阻塞方法可能会抛出 InterruptedException。当在代码中调用了一个会抛出 InterruptedException 的方法时，这个方法也就变成了阻塞方法，需要处理中断异常。阻塞方法必须等待某个不受它控制的事件发生后才能继续执行。

每个线程都有一个 boolean 类型的中断状态，当中断线程时，这个线程的中断状态会被设置为 true。在 Thread 中包含了中断线程以及查询线程中断状态的方法。

```java
public class Thread {
    public void interrupt() {} //中断目标线程
    public boolean isInterrupted() {} //返回目标线程的中断状态
    public static boolean interrupted() {}//清除当前线程中断状态的唯一方法，并返回它之前的值
}
```

阻塞方法如 Thread.sleep 和 Object.wait 等，都会检查线程何时中断，并且在发生中断时提前返回。它们在响应中断时执行的操作包含：清除中断状态，抛出 InterruptedException，表示阻塞操作由于中断而提前结束。**调用interrupt并不意味着立即停止目标线程正在进行的工作，而只是传递了请求中断的消息**。对中断操作的正确理解是：它并不会真正的中断一个正在运行的线程，而只是发出中断请求，然后由线程在下一个合适的时刻自己中断。

阻塞方法必须处理对中断的响应，有两种处理方法：

1. 传递 InterruptedException 给方法的调用者。
2. 恢复中断。有时不能抛出 InterruptedException，如代码是 Runnable 一部分时，必须捕获 InterruptedException，并通过调用当前线程上的 interrupt 方法恢复中断状态，这样在高层代码就看到引发了一个中断。

```java
public class TaskRunnable implements Runnable {
    BlockingQueue<Task> queue;
    ...
    public void run() {
        try {
            processTask(queue.take());
        } catch (InterruptedException e) {
            //恢复被中断的状态，不然会丢失线程被中断的证据
            Thread.currentThread().interrupt();
        }
    }
}
```



