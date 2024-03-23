---
sidebar: heading
title: Java并发常见面试题总结
category: Java
tag:
  - Java并发
head:
  - - meta
    - name: keywords
      content: Java并发,多线程,线程池执行原理,线程池参数,线程和进程,死锁,volatile,synchronized,ThreadLocal,Java锁,Java并发工具,原子类,AQS
  - - meta
    - name: description
      content: 高质量的Java并发常见知识点和面试题总结，让天下没有难背的八股文！
---

::: tip 这是一则或许对你有帮助的信息

- **面试手册**：这是一份大彬精心整理的[**大厂面试手册**](https://topjavaer.cn/zsxq/mianshishouce.html)最新版，目前已经更新迭代了**19**个版本，质量很高（专为面试打造）
- **知识星球**：**专属面试手册/一对一交流/简历修改/超棒的学习氛围/学习路线规划**，欢迎加入[大彬的知识星球](https://topjavaer.cn/zsxq/introduce.html)（点击链接查看星球的详细介绍）

:::

## 线程池

线程池：一个管理线程的池子。

### 为什么平时都是使用线程池创建线程，直接new一个线程不好吗？

嗯，手动创建线程有两个缺点

1. 不受控风险
2. 频繁创建开销大

**为什么不受控**？

系统资源有限，每个人针对不同业务都可以手动创建线程，并且创建线程没有统一标准，比如创建的线程有没有名字等。当系统运行起来，所有线程都在抢占资源，毫无规则，混乱场面可想而知，不好管控。

**频繁手动创建线程为什么开销会大？跟new Object() 有什么差别？**

虽然Java中万物皆对象，但是new Thread() 创建一个线程和 new Object()还是有区别的。

new Object()过程如下：

1. JVM分配一块内存 M
2. 在内存 M 上初始化该对象
3. 将内存 M 的地址赋值给引用变量 obj

创建线程的过程如下：

1. JVM为一个线程栈分配内存，该栈为每个线程方法调用保存一个栈帧
2. 每一栈帧由一个局部变量数组、返回值、操作数堆栈和常量池组成
3. 每个线程获得一个程序计数器，用于记录当前虚拟机正在执行的线程指令地址
4. 系统创建一个与Java线程对应的本机线程
5. 将与线程相关的描述符添加到JVM内部数据结构中
6. 线程共享堆和方法区域

创建一个线程大概需要1M左右的空间（Java8，机器规格2c8G）。可见，频繁手动创建/销毁线程的代价是非常大的。

### 为什么使用线程池？

- **降低资源消耗**。通过重复利用已创建的线程降低线程创建和销毁造成的消耗。
- **提高响应速度**。当任务到达时，可以不需要等到线程创建就能立即执行。
- **提高线程的可管理性**。统一管理线程，避免系统创建大量同类线程而导致消耗完内存。

### 线程池执行原理？

![线程池执行流程](http://img.topjavaer.cn/img/线程池执行流程.png)

1. 当线程池里存活的线程数小于核心线程数`corePoolSize`时，这时对于一个新提交的任务，线程池会创建一个线程去处理任务。当线程池里面存活的线程数小于等于核心线程数`corePoolSize`时，线程池里面的线程会一直存活着，就算空闲时间超过了`keepAliveTime`，线程也不会被销毁，而是一直阻塞在那里一直等待任务队列的任务来执行。
2. 当线程池里面存活的线程数已经等于corePoolSize了，这是对于一个新提交的任务，会被放进任务队列workQueue排队等待执行。
3. 当线程池里面存活的线程数已经等于`corePoolSize`了，并且任务队列也满了，假设`maximumPoolSize>corePoolSize`，这时如果再来新的任务，线程池就会继续创建新的线程来处理新的任务，知道线程数达到`maximumPoolSize`，就不会再创建了。
4. 如果当前的线程数达到了`maximumPoolSize`，并且任务队列也满了，如果还有新的任务过来，那就直接采用拒绝策略进行处理。默认的拒绝策略是抛出一个RejectedExecutionException异常。

### 线程池参数有哪些？

ThreadPoolExecutor 的通用构造函数：

```
public ThreadPoolExecutor(int corePoolSize, int maximumPoolSize, long keepAliveTime, TimeUnit unit, BlockingQueue<Runnable> workQueue, ThreadFactory threadFactory, RejectedExecutionHandler handler);
```

1、`corePoolSize`：当有新任务时，如果线程池中线程数没有达到线程池的基本大小，则会创建新的线程执行任务，否则将任务放入阻塞队列。当线程池中存活的线程数总是大于 corePoolSize 时，应该考虑调大 corePoolSize。

2、`maximumPoolSize`：当阻塞队列填满时，如果线程池中线程数没有超过最大线程数，则会创建新的线程运行任务。否则根据拒绝策略处理新任务。非核心线程类似于临时借来的资源，这些线程在空闲时间超过 keepAliveTime 之后，就应该退出，避免资源浪费。

3、`BlockingQueue`：存储等待运行的任务。

4、`keepAliveTime`：**非核心线程**空闲后，保持存活的时间，此参数只对非核心线程有效。设置为0，表示多余的空闲线程会被立即终止。

5、`TimeUnit`：时间单位

```java
TimeUnit.DAYS
TimeUnit.HOURS
TimeUnit.MINUTES
TimeUnit.SECONDS
TimeUnit.MILLISECONDS
TimeUnit.MICROSECONDS
TimeUnit.NANOSECONDS
```

6、`ThreadFactory`：每当线程池创建一个新的线程时，都是通过线程工厂方法来完成的。在 ThreadFactory 中只定义了一个方法 newThread，每当线程池需要创建新线程就会调用它。

```java
public class MyThreadFactory implements ThreadFactory {
    private final String poolName;
    
    public MyThreadFactory(String poolName) {
        this.poolName = poolName;
    }
    
    public Thread newThread(Runnable runnable) {
        return new MyAppThread(runnable, poolName);//将线程池名字传递给构造函数，用于区分不同线程池的线程
    }
}
```

7、`RejectedExecutionHandler`：当队列和线程池都满了的时候，根据拒绝策略处理新任务。

```java
AbortPolicy：默认的策略，直接抛出RejectedExecutionException
DiscardPolicy：不处理，直接丢弃
DiscardOldestPolicy：将等待队列队首的任务丢弃，并执行当前任务
CallerRunsPolicy：由调用线程处理该任务
```

### 线程池大小怎么设置？

如果线程池线程数量太小，当有大量请求需要处理，系统响应比较慢，会影响用户体验，甚至会出现任务队列大量堆积任务导致OOM。

如果线程池线程数量过大，大量线程可能会同时抢占 CPU 资源，这样会导致大量的上下文切换，从而增加线程的执行时间，影响了执行效率。

**CPU 密集型任务(N+1)**： 这种任务消耗的主要是 CPU 资源，可以将线程数设置为` N（CPU 核心数）+1`，多出来的一个线程是为了防止某些原因导致的线程阻塞（如IO操作，线程sleep，等待锁）而带来的影响。一旦某个线程被阻塞，释放了CPU资源，而在这种情况下多出来的一个线程就可以充分利用 CPU 的空闲时间。

**I/O 密集型任务(2N)**： 系统的大部分时间都在处理 IO 操作，此时线程可能会被阻塞，释放CPU资源，这时就可以将 CPU 交出给其它线程使用。因此在 IO 密集型任务的应用中，可以多配置一些线程，具体的计算方法：`最佳线程数 = CPU核心数 * (1/CPU利用率) = CPU核心数 * (1 + (IO耗时/CPU耗时))`，一般可设置为2N。

### 线程池的类型有哪些？适用场景？

常见的线程池有 `FixedThreadPool`、`SingleThreadExecutor`、`CachedThreadPool` 和 `ScheduledThreadPool`。这几个都是 `ExecutorService` 线程池实例。

**FixedThreadPool**

固定线程数的线程池。任何时间点，最多只有 nThreads 个线程处于活动状态执行任务。

```
public static ExecutorService newFixedThreadPool(int nThreads) {
	return new ThreadPoolExecutor(nThreads, nThreads, 0L, TimeUnit.MILLISECONDS, new LinkedBlockingQueue<Runnable>());
}
```

使用无界队列 LinkedBlockingQueue（队列容量为 Integer.MAX_VALUE），运行中的线程池不会拒绝任务，即不会调用RejectedExecutionHandler.rejectedExecution()方法。

maxThreadPoolSize 是无效参数，故将它的值设置为与 coreThreadPoolSize 一致。

keepAliveTime 也是无效参数，设置为0L，因为此线程池里所有线程都是核心线程，核心线程不会被回收（除非设置了executor.allowCoreThreadTimeOut(true)）。

适用场景：适用于处理CPU密集型的任务，确保CPU在长期被工作线程使用的情况下，尽可能的少的分配线程，即适用执行长期的任务。需要注意的是，FixedThreadPool 不会拒绝任务，**在任务比较多的时候会导致 OOM。**

**SingleThreadExecutor**

只有一个线程的线程池。

```
public static ExecutionService newSingleThreadExecutor() {
	return new ThreadPoolExecutor(1, 1, 0L, TimeUnit.MILLISECONDS, new LinkedBlockingQueue<Runnable>());
}
```

使用无界队列 LinkedBlockingQueue。线程池只有一个运行的线程，新来的任务放入工作队列，线程处理完任务就循环从队列里获取任务执行。保证顺序的执行各个任务。

适用场景：适用于串行执行任务的场景，一个任务一个任务地执行。**在任务比较多的时候也是会导致 OOM。**

**CachedThreadPool**

根据需要创建新线程的线程池。

```
public static ExecutorService newCachedThreadPool() {
	return new ThreadPoolExecutor(0, Integer.MAX_VALUE, 60L, TimeUnit.SECONDS, new SynchronousQueue<Runnable>());
}
```

如果主线程提交任务的速度高于线程处理任务的速度时，`CachedThreadPool` 会不断创建新的线程。极端情况下，这样会导致耗尽 cpu 和内存资源。

使用没有容量的SynchronousQueue作为线程池工作队列，当线程池有空闲线程时，`SynchronousQueue.offer(Runnable task)`提交的任务会被空闲线程处理，否则会创建新的线程处理任务。

适用场景：用于并发执行大量短期的小任务。`CachedThreadPool`允许创建的线程数量为 Integer.MAX_VALUE ，**可能会创建大量线程，从而导致 OOM。**

**ScheduledThreadPoolExecutor**

在给定的延迟后运行任务，或者定期执行任务。在实际项目中基本不会被用到，因为有其他方案选择比如`quartz`。

使用的任务队列 `DelayQueue` 封装了一个 `PriorityQueue`，`PriorityQueue` 会对队列中的任务进行排序，时间早的任务先被执行(即`ScheduledFutureTask` 的 `time` 变量小的先执行)，如果time相同则先提交的任务会被先执行(`ScheduledFutureTask` 的 `squenceNumber` 变量小的先执行)。

执行周期任务步骤：

1. 线程从 `DelayQueue` 中获取已到期的 `ScheduledFutureTask（DelayQueue.take()）`。到期任务是指 `ScheduledFutureTask`的 time 大于等于当前系统的时间；
2. 执行这个 `ScheduledFutureTask`；
3. 修改 `ScheduledFutureTask` 的 time 变量为下次将要被执行的时间；
4. 把这个修改 time 之后的 `ScheduledFutureTask` 放回 `DelayQueue` 中（`DelayQueue.add()`)。

![](http://img.topjavaer.cn/img/scheduled-task.jpg)

适用场景：周期性执行任务的场景，需要限制线程数量的场景。

### 怎么判断线程池的任务是不是执行完了？

有几种方法：

1、使用线程池的原生函数**isTerminated()**;

executor提供一个原生函数isTerminated()来判断线程池中的任务是否全部完成。如果全部完成返回true，否则返回false。

2、**使用重入锁，维持一个公共计数**。

所有的普通任务维持一个计数器，当任务完成时计数器加一（这里要加锁），当计数器的值等于任务数时，这时所有的任务已经执行完毕了。

3、**使用CountDownLatch**。

它的原理跟第二种方法类似，给CountDownLatch一个计数值，任务执行完毕后，调用countDown()执行计数值减一。最后执行的任务在调用方法的开始调用await()方法，这样整个任务会阻塞，直到这个计数值为零，才会继续执行。

这种方式的**缺点**就是需要提前知道任务的数量。

4、**submit向线程池提交任务，使用Future判断任务执行状态**。

使用submit向线程池提交任务与execute提交不同，submit会有Future类型的返回值。通过future.isDone()方法可以知道任务是否执行完成。

### 为什么要使用Executor线程池框架呢？

- 每次执行任务都通过new Thread()去创建线程，比较消耗性能，创建一个线程是比较耗时、耗资源的
- 调用new Thread()创建的线程缺乏管理，可以无限制的创建，线程之间的相互竞争会导致过多占用系统资源而导致系统瘫痪
- 直接使用new Thread()启动的线程不利于扩展，比如定时执行、定期执行、定时定期执行、线程中断等都不好实现

## 进程线程

进程是指一个内存中运行的应用程序，每个进程都有自己独立的一块内存空间。

线程是比进程更小的执行单位，它是在一个进程中独立的控制流，一个进程可以启动多个线程，每条线程并行执行不同的任务。

### 线程的生命周期

**初始(NEW)**：线程被构建，还没有调用 start()。

**运行(RUNNABLE)**：包括操作系统的就绪和运行两种状态。

**阻塞(BLOCKED)**：一般是被动的，在抢占资源中得不到资源，被动的挂起在内存，等待资源释放将其唤醒。线程被阻塞会释放CPU，不释放内存。

**等待(WAITING)**：进入该状态的线程需要等待其他线程做出一些特定动作（通知或中断）。

**超时等待(TIMED_WAITING)**：该状态不同于WAITING，它可以在指定的时间后自行返回。

**终止(TERMINATED)**：表示该线程已经执行完毕。

![](http://img.topjavaer.cn/img/image-20210909235618175.png)

> 图片来源：Java并发编程的艺术

### 讲讲线程中断？

线程中断即线程运行过程中被其他线程给打断了，它与 stop 最大的区别是：stop 是由系统强制终止线程，而线程中断则是给目标线程发送一个中断信号，如果目标线程没有接收线程中断的信号并结束线程，线程则不会终止，具体是否退出或者执行其他逻辑取决于目标线程。

线程中断三个重要的方法：

**1、java.lang.Thread#interrupt**

调用目标线程的`interrupt()`方法，给目标线程发一个中断信号，线程被打上中断标记。

**2、java.lang.Thread#isInterrupted()**

判断目标线程是否被中断，不会清除中断标记。

**3、java.lang.Thread#interrupted**

判断目标线程是否被中断，会清除中断标记。

```java
private static void test2() {
    Thread thread = new Thread(() -> {
        while (true) {
            Thread.yield();

            // 响应中断
            if (Thread.currentThread().isInterrupted()) {
                System.out.println("Java技术栈线程被中断，程序退出。");
                return;
            }
        }
    });
    thread.start();
    thread.interrupt();
}
```

### 创建线程有哪几种方式？

- 通过扩展`Thread`类来创建多线程
- 通过实现`Runnable`接口来创建多线程
- 实现`Callable`接口，通过`FutureTask`接口创建线程。
- 使用`Executor`框架来创建线程池。

**继承 Thread 创建线程**代码如下。run()方法是由jvm创建完操作系统级线程后回调的方法，不可以手动调用，手动调用相当于调用普通方法。

```java
/**
 * @author: 程序员大彬
 * @time: 2021-09-11 10:15
 */
public class MyThread extends Thread {
    public MyThread() {
    }

    @Override
    public void run() {
        for (int i = 0; i < 10; i++) {
            System.out.println(Thread.currentThread() + ":" + i);
        }
    }

    public static void main(String[] args) {
        MyThread mThread1 = new MyThread();
        MyThread mThread2 = new MyThread();
        MyThread myThread3 = new MyThread();
        mThread1.start();
        mThread2.start();
        myThread3.start();
    }
}
```

**Runnable 创建线程代码**：

```java
/**
 * @author: 程序员大彬
 * @time: 2021-09-11 10:04
 */
public class RunnableTest {
    public static  void main(String[] args){
        Runnable1 r = new Runnable1();
        Thread thread = new Thread(r);
        thread.start();
        System.out.println("主线程：["+Thread.currentThread().getName()+"]");
    }
}

class Runnable1 implements Runnable{
    @Override
    public void run() {
        System.out.println("当前线程："+Thread.currentThread().getName());
    }
}
```

实现Runnable接口比继承Thread类所具有的优势：

1. 可以避免java中的单继承的限制
3. 线程池只能放入实现Runable或Callable类线程，不能直接放入继承Thread的类

**Callable 创建线程代码**：

```java
/**
 * @author: 程序员大彬
 * @time: 2021-09-11 10:21
 */
public class CallableTest {
    public static void main(String[] args) {
        Callable1 c = new Callable1();

        //异步计算的结果
        FutureTask<Integer> result = new FutureTask<>(c);

        new Thread(result).start();

        try {
            //等待任务完成，返回结果
            int sum = result.get();
            System.out.println(sum);
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }
    }

}

class Callable1 implements Callable<Integer> {

    @Override
    public Integer call() throws Exception {
        int sum = 0;

        for (int i = 0; i <= 100; i++) {
            sum += i;
        }
        return sum;
    }
}
```

**使用 Executor 创建线程代码**：

```java
/**
 * @author: 程序员大彬
 * @time: 2021-09-11 10:44
 */
public class ExecutorsTest {
    public static void main(String[] args) {
        //获取ExecutorService实例，生产禁用，需要手动创建线程池
        ExecutorService executorService = Executors.newCachedThreadPool();
        //提交任务
        executorService.submit(new RunnableDemo());
    }
}

class RunnableDemo implements Runnable {
    @Override
    public void run() {
        System.out.println("大彬");
    }
}
```

### 什么是线程死锁？

线程死锁是指两个或两个以上的线程在执行过程中，因争夺资源而造成的一种互相等待的现象。若无外力作用，它们都将无法推进下去。

如下图所示，线程 A 持有资源 2，线程 B 持有资源 1，他们同时都想申请对方持有的资源，所以这两个线程就会互相等待而进入死锁状态。

![死锁](http://img.topjavaer.cn/img/死锁.png)

下面通过例子说明线程死锁，代码来自并发编程之美。

```java
public class DeadLockDemo {
    private static Object resource1 = new Object();//资源 1
    private static Object resource2 = new Object();//资源 2

    public static void main(String[] args) {
        new Thread(() -> {
            synchronized (resource1) {
                System.out.println(Thread.currentThread() + "get resource1");
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println(Thread.currentThread() + "waiting get resource2");
                synchronized (resource2) {
                    System.out.println(Thread.currentThread() + "get resource2");
                }
            }
        }, "线程 1").start();

        new Thread(() -> {
            synchronized (resource2) {
                System.out.println(Thread.currentThread() + "get resource2");
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println(Thread.currentThread() + "waiting get resource1");
                synchronized (resource1) {
                    System.out.println(Thread.currentThread() + "get resource1");
                }
            }
        }, "线程 2").start();
    }
}
```

代码输出如下：

```java
Thread[线程 1,5,main]get resource1
Thread[线程 2,5,main]get resource2
Thread[线程 1,5,main]waiting get resource2
Thread[线程 2,5,main]waiting get resource1
```

线程 A 通过 `synchronized` (resource1) 获得 resource1 的监视器锁，然后通过 `Thread.sleep(1000)`。让线程 A 休眠 1s 为的是让线程 B 得到执行然后获取到 resource2 的监视器锁。线程 A 和线程 B 休眠结束了都开始企图请求获取对方的资源，然后这两个线程就会陷入互相等待的状态，这也就产生了死锁。

### 线程死锁怎么产生？怎么避免？

**死锁产生的四个必要条件**：

- 互斥：一个资源每次只能被一个进程使用

- 请求与保持：一个进程因请求资源而阻塞时，不释放获得的资源

- 不剥夺：进程已获得的资源，在未使用之前，不能强行剥夺

- 循环等待：进程之间循环等待着资源

**避免死锁的方法**：

- 互斥条件不能破坏，因为加锁就是为了保证互斥
- 一次性申请所有的资源，避免线程占有资源而且在等待其他资源
- 占有部分资源的线程进一步申请其他资源时，如果申请不到，主动释放它占有的资源
- 按序申请资源

### 线程run和start的区别？

- 当程序调用`start()`方法，将会创建一个新线程去执行`run()`方法中的代码。`run()`就像一个普通方法一样，直接调用`run()`的话，不会创建新线程。
- 一个线程的 `start()` 方法只能调用一次，多次调用会抛出 java.lang.IllegalThreadStateException 异常。`run()` 方法则没有限制。

### 线程都有哪些方法？

**start**

用于启动线程。

**getPriority**

获取线程优先级，默认是5，线程默认优先级为5，如果不手动指定，那么线程优先级具有继承性，比如线程A启动线程B，那么线程B的优先级和线程A的优先级相同

**setPriority**

设置线程优先级。CPU会尽量将执行资源让给优先级比较高的线程。

**interrupt**

告诉线程，你应该中断了，具体到底中断还是继续运行，由被通知的线程自己处理。

当对一个线程调用 interrupt() 时，有两种情况：

1. 如果线程处于被阻塞状态（例如处于sleep, wait, join 等状态），那么线程将立即退出被阻塞状态，并抛出一个InterruptedException异常。

2. 如果线程处于正常活动状态，那么会将该线程的中断标志设置为 true。不过，被设置中断标志的线程可以继续正常运行，不受影响。

interrupt() 并不能真正的中断线程，需要被调用的线程自己进行配合才行。

**join**

等待其他线程终止。在当前线程中调用另一个线程的join()方法，则当前线程转入阻塞状态，直到另一个进程运行结束，当前线程再由阻塞转为就绪状态。

**yield**

暂停当前正在执行的线程对象，把执行机会让给相同或者更高优先级的线程。

**sleep**

使线程转到阻塞状态。millis参数设定睡眠的时间，以毫秒为单位。当睡眠结束后，线程自动转为Runnable状态。

### 如何停止一个正在运行的线程？

1. 使用共享变量的方式。共享变量可以被多个执行相同任务的线程用来作为是否停止的信号，通知停止线程的执行。
2. 使用interrupt方法终止线程。当一个线程被阻塞，处于不可运行状态时，即使主程序中将该线程的共享变量设置为true，但该线程此时根本无法检查循环标志，当然也就无法立即中断。这时候可以使用Thread提供的interrupt()方法，因为该方法虽然不会中断一个正在运行的线程，但是它可以使一个被阻塞的线程抛出一个中断异常，从而使线程提前结束阻塞状态。

## volatile底层原理

`volatile`是轻量级的同步机制，`volatile`保证变量对所有线程的可见性，不保证原子性。

1. 当对`volatile`变量进行写操作的时候，JVM会向处理器发送一条`LOCK`前缀的指令，将该变量所在缓存行的数据写回系统内存。
2. 由于缓存一致性协议，每个处理器通过嗅探在总线上传播的数据来检查自己的缓存是不是过期了，当处理器发现自己缓存行对应的内存地址被修改，就会将当前处理器的缓存行置为无效状态，当处理器对这个数据进行修改操作的时候，会重新从系统内存中把数据读到处理器缓存中。

> 来看看缓存一致性协议是什么。
>
> **缓存一致性协议**：当CPU写数据时，如果发现操作的变量是共享变量，即在其他CPU中也存在该变量的副本，会发出信号通知其他CPU将该变量的缓存行置为无效状态，因此当其他CPU需要读取这个变量时，就会从内存重新读取。

`volatile`关键字的两个作用：

1. 保证了不同线程对共享变量进行操作时的**可见性**，即一个线程修改了某个变量的值，这新值对其他线程来说是立即可见的。
2. 禁止进行**指令重排序**。

> 指令重排序是JVM为了优化指令，提高程序运行效率，在不影响单线程程序执行结果的前提下，尽可能地提高并行度。Java编译器会在生成指令系列时在适当的位置会插入`内存屏障`指令来禁止处理器重排序。插入一个内存屏障，相当于告诉CPU和编译器先于这个命令的必须先执行，后于这个命令的必须后执行。对一个volatile字段进行写操作，Java内存模型将在写操作后插入一个写屏障指令，这个指令会把之前的写入值都刷新到内存。

## volatile为什么不能保证原子性？

volatile可以保证可见性和顺序性，但是它不能保证原子性。

举个例子。一个变量i被volatile修饰，两个线程想对这个变量修改，都对其进行自增操作i++，i++的过程可以分为三步，首先获取i的值，其次对i的值进行加1，最后将得到的新值写会到缓存中。

假如i的初始值为100。线程A首先得到了i的初始值100，但是还没来得及修改，就阻塞了，这时线程B开始了，它也去取i的值，由于i的值未被修改，即使是被volatile修饰，主存的变量还没变化，那么线程B得到的值也是100，之后对其进行加1操作，得到101，将新值写入到缓存中，再刷入主存中。根据可见性的原则，这个主存的值可以被其他线程可见。

那么问题来了，线程A之前已经读取到了i的值为100，线程A阻塞结束后，继续将100这个值加1，得到101，再将值写到缓存，最后刷入主存。这样i经过两次自增之后，结果值只加了1，明显是有问题的。所以说即便volatile具有可见性，也不能保证对它修饰的变量具有原子性。

## synchronized的用法有哪些?

1. **修饰普通方法**：作用于当前对象实例，进入同步代码前要获得当前对象实例的锁
2. **修饰静态方法**：作用于当前类，进入同步代码前要获得当前类对象的锁，synchronized关键字加到static 静态方法和 synchronized(class)代码块上都是是给 Class 类上锁
3. **修饰代码块**：指定加锁对象，对给定对象加锁，进入同步代码库前要获得给定对象的锁

## synchronized的作用有哪些？

**原子性**：确保线程互斥的访问同步代码；

**可见性**：保证共享变量的修改能够及时可见；

**有序性**：有效解决重排序问题。

## synchronized 底层实现原理？

synchronized 同步代码块的实现是通过 `monitorenter` 和 `monitorexit` 指令，其中 `monitorenter` 指令指向同步代码块的开始位置，`monitorexit` 指令则指明同步代码块的结束位置。当执行 `monitorenter` 指令时，线程试图获取锁也就是获取 `monitor`的持有权（monitor对象存在于每个Java对象的对象头中， synchronized 锁便是通过这种方式获取锁的，也是为什么Java中任意对象可以作为锁的原因）。

其内部包含一个计数器，当计数器为0则可以成功获取，获取后将锁计数器设为1也就是加1。相应的在执行 `monitorexit` 指令后，将锁计数器设为0
，表明锁被释放。如果获取对象锁失败，那当前线程就要阻塞等待，直到锁被另外一个线程释放为止

synchronized 修饰的方法并没有 `monitorenter` 指令和 `monitorexit` 指令，取得代之的确实是`ACC_SYNCHRONIZED` 标识，该标识指明了该方法是一个同步方法，JVM 通过该 `ACC_SYNCHRONIZED` 访问标志来辨别一个方法是否声明为同步方法，从而执行相应的同步调用。

## volatile和synchronized的区别是什么？

1. `volatile`只能使用在变量上；而`synchronized`可以在类，变量，方法和代码块上。
2. `volatile`至保证可见性；`synchronized`保证原子性与可见性。
3. `volatile`禁用指令重排序；`synchronized`不会。
4. `volatile`不会造成阻塞；`synchronized`会。

## ReentrantLock和synchronized区别

1. 使用synchronized关键字实现同步，线程执行完同步代码块会**自动释放锁**，而ReentrantLock需要手动释放锁。
2. synchronized是**非公平锁**，ReentrantLock可以设置为公平锁。
3. ReentrantLock上等待获取锁的线程是**可中断的**，线程可以放弃等待锁。而synchonized会无限期等待下去。
4. ReentrantLock **可以设置超时获取锁**。在指定的截止时间之前获取锁，如果截止时间到了还没有获取到锁，则返回。
5. ReentrantLock 的 tryLock() 方法**可以尝试非阻塞的获取锁**，调用该方法后立刻返回，如果能够获取则返回true，否则返回false。

## wait()和sleep()的异同点？

**相同点**：

1. 它们都可以使当前线程暂停运行，把机会交给其他线程
2. 任何线程在调用wait()和sleep()之后，在等待期间被中断都会抛出`InterruptedException`

**不同点**：

1. `wait()`是Object超类中的方法；而`sleep()`是线程Thread类中的方法
2. 对锁的持有不同，`wait()`会释放锁，而`sleep()`并不释放锁
3. 唤醒方法不完全相同，`wait()`依靠`notify`或者`notifyAll `、中断、达到指定时间来唤醒；而`sleep()`到达指定时间被唤醒
4. 调用`wait()`需要先获取对象的锁，而`Thread.sleep()`不用

##   Runnable和Callable有什么区别？

- Callable接口方法是`call()`，Runnable的方法是`run()`；
- Callable接口call方法有返回值，支持泛型，Runnable接口run方法无返回值。
- Callable接口`call()`方法允许抛出异常；而Runnable接口`run()`方法不能继续上抛异常。

## 线程执行顺序怎么控制？

假设有T1、T2、T3三个线程，你怎样保证T2在T1执行完后执行，T3在T2执行完后执行？

可以使用**join方法**解决这个问题。比如在线程A中，调用线程B的join方法表示的意思就是**：A等待B线程执行完毕后（释放CPU执行权），在继续执行。**

代码如下：

```
public class ThreadTest {

    public static void main(String[] args) {

        Thread spring = new Thread(new SeasonThreadTask("春天"));
        Thread summer = new Thread(new SeasonThreadTask("夏天"));
        Thread autumn = new Thread(new SeasonThreadTask("秋天"));

        try
        {
            //春天线程先启动
            spring.start();
            //主线程等待线程spring执行完，再往下执行
            spring.join();
            //夏天线程再启动
            summer.start();
            //主线程等待线程summer执行完，再往下执行
            summer.join();
            //秋天线程最后启动
            autumn.start();
            //主线程等待线程autumn执行完，再往下执行
            autumn.join();
        } catch (InterruptedException e)
        {
            e.printStackTrace();
        }
    }
}

class SeasonThreadTask implements Runnable{

    private String name;

    public SeasonThreadTask(String name){
        this.name = name;
    }

    @Override
    public void run() {
        for (int i = 1; i <4; i++) {
            System.out.println(this.name + "来了: " + i + "次");
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}

```

运行结果：

```
春天来了: 1次
春天来了: 2次
春天来了: 3次
夏天来了: 1次
夏天来了: 2次
夏天来了: 3次
秋天来了: 1次
秋天来了: 2次
秋天来了: 3次
```

## 守护线程是什么？

守护线程是**运行在后台的一种特殊进程**。它独立于控制终端并且周期性地执行某种任务或等待处理某些发生的事件。在 Java 中垃圾回收线程就是特殊的守护线程。

## 线程间通信方式

1、使用 Object 类的 **wait()/notify()**。Object 类提供了线程间通信的方法：`wait()`、`notify()`、`notifyAll()`，它们是多线程通信的基础。其中，`wait/notify` 必须配合 `synchronized` 使用，wait 方法释放锁，notify 方法不释放锁。wait 是指在一个已经进入了同步锁的线程内，让自己暂时让出同步锁，以便其他正在等待此锁的线程可以得到同步锁并运行，只有其他线程调用了`notify()`，notify并不释放锁，只是告诉调用过`wait()`的线程可以去参与获得锁的竞争了，但不是马上得到锁，因为锁还在别人手里，别人还没释放，调用 `wait()` 的一个或多个线程就会解除 wait 状态，重新参与竞争对象锁，程序如果可以再次得到锁，就可以继续向下运行。

2、使用 **volatile** 关键字。基于volatile关键字实现线程间相互通信，其底层使用了共享内存。简单来说，就是多个线程同时监听一个变量，当这个变量发生变化的时候 ，线程能够感知并执行相应的业务。

3、使用JUC工具类 **CountDownLatch**。jdk1.5 之后在`java.util.concurrent`包下提供了很多并发编程相关的工具类，简化了并发编程开发，`CountDownLatch` 基于 AQS 框架，相当于也是维护了一个线程间共享变量 state。

4、基于 **LockSupport** 实现线程间的阻塞和唤醒。`LockSupport` 是一种非常灵活的实现线程间阻塞和唤醒的工具，使用它不用关注是等待线程先进行还是唤醒线程先运行，但是得知道线程的名字。

## ThreadLocal

线程本地变量。当使用`ThreadLocal`维护变量时，`ThreadLocal`为每个使用该变量的线程提供独立的变量副本，所以每一个线程都可以独立地改变自己的副本，而不会影响其它线程。

### ThreadLocal原理

每个线程都有一个`ThreadLocalMap`（`ThreadLocal`内部类），Map中元素的键为`ThreadLocal`，而值对应线程的变量副本。

![](http://img.topjavaer.cn/img/threadlocal.png)

调用`threadLocal.set()`-->调用`getMap(Thread)`-->返回当前线程的`ThreadLocalMap<ThreadLocal, value>`-->`map.set(this, value)`，this是`threadLocal`本身。源码如下：

```java
public void set(T value) {
    Thread t = Thread.currentThread();
    ThreadLocalMap map = getMap(t);
    if (map != null)
        map.set(this, value);
    else
        createMap(t, value);
}

ThreadLocalMap getMap(Thread t) {
    return t.threadLocals;
}

void createMap(Thread t, T firstValue) {
    t.threadLocals = new ThreadLocalMap(this, firstValue);
}
```

调用`get()`-->调用`getMap(Thread)`-->返回当前线程的`ThreadLocalMap<ThreadLocal, value>`-->`map.getEntry(this)`，返回`value`。源码如下：

```java
    public T get() {
        Thread t = Thread.currentThread();
        ThreadLocalMap map = getMap(t);
        if (map != null) {
            ThreadLocalMap.Entry e = map.getEntry(this);
            if (e != null) {
                @SuppressWarnings("unchecked")
                T result = (T)e.value;
                return result;
            }
        }
        return setInitialValue();
    }
```

`threadLocals`的类型`ThreadLocalMap`的键为`ThreadLocal`对象，因为每个线程中可有多个`threadLocal`变量，如`longLocal`和`stringLocal`。

```
public class ThreadLocalDemo {
    ThreadLocal<Long> longLocal = new ThreadLocal<>();

    public void set() {
        longLocal.set(Thread.currentThread().getId());
    }
    public Long get() {
        return longLocal.get();
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
```

`ThreadLocal`并不是用来解决共享资源的多线程访问问题，因为每个线程中的资源只是副本，不会共享。因此`ThreadLocal`适合作为线程上下文变量，简化线程内传参。

### ThreadLocal内存泄漏的原因？

每个线程都有⼀个`ThreadLocalMap`的内部属性，map的key是`ThreaLocal`，定义为弱引用，value是强引用类型。垃圾回收的时候会⾃动回收key，而value的回收取决于Thread对象的生命周期。一般会通过线程池的方式复用线程节省资源，这也就导致了线程对象的生命周期比较长，这样便一直存在一条强引用链的关系：`Thread` --> `ThreadLocalMap`-->`Entry`-->`Value`，随着任务的执行，value就有可能越来越多且无法释放，最终导致内存泄漏。

解决⽅法：每次使⽤完`ThreadLocal`就调⽤它的`remove()`⽅法，手动将对应的键值对删除，从⽽避免内存泄漏。

### ThreadLocal使用场景有哪些？

**场景1**

ThreadLocal 用作保存每个线程独享的对象，为每个线程都创建一个副本，这样每个线程都可以修改自己所拥有的副本, 而不会影响其他线程的副本，确保了线程安全。

这种场景通常用于保存线程不安全的工具类，典型的使用的类就是 SimpleDateFormat。

假如需求为500个线程都要用到 SimpleDateFormat，使用线程池来实现线程的复用，否则会消耗过多的内存等资源，如果我们每个任务都创建了一个 simpleDateFormat 对象，也就是说，500个任务对应500个 simpleDateFormat 对象。但是这么多对象的创建是有开销的，而且这么多对象同时存在在内存中也是一种内存的浪费。可以将simpleDateFormat 对象给提取了出来，变成静态变量，但是这样一来就会有线程不安全的问题。我们想要的效果是，既不浪费过多的内存，同时又想保证线程安全。此时，可以使用 ThreadLocal来达到这个目的，每个线程都拥有一个自己的 simpleDateFormat 对象。

**场景2**

ThreadLocal 用作每个线程内需要独立保存信息，以便供其他方法更方便地获取该信息的场景。每个线程获取到的信息可能都是不一样的，前面执行的方法保存了信息后，后续方法可以通过 ThreadLocal 直接获取到，避免了传参，类似于全局变量的概念。

比如Java web应用中，每个线程有自己单独的`Session`实例，就可以使用`ThreadLocal`来实现。

## 什么是AQS？

AQS（AbstractQueuedSynchronizer）是java.util.concurrent包下的核心类，我们经常使用的ReentrantLock、CountDownLatch，都是基于AQS抽象同步式队列实现的。

AQS作为一个抽象类，通常是通过继承来使用的。它本身是没有同步接口的，只是定义了同步状态和同步获取和同步释放的方法。

JUC包下面大部分同步类，都是基于AQS的同步状态的获取与释放来实现的，然后AQS是个双向链表。

## 为什么AQS是双向链表而不是单向的？

双向链表有两个指针，一个指针指向前置节点，一个指针指向后继节点。所以，双向链表可以支持常量 O(1) 时间复杂度的情况下找到前驱节点。因此，双向链表在插入和删除操作的时候，要比单向链表简单、高效。

从双向链表的特性来看，AQS 使用双向链表有2个方面的原因：

1. 没有竞争到锁的线程加入到阻塞队列，并且阻塞等待的前提是，当前线程所在节点的前置节点是正常状态，这样设计是为了避免链表中存在异常线程导致无法唤醒后续线程的问题。所以，线程阻塞之前需要判断前置节点的状态，如果没有指针指向前置节点，就需要从 Head 节点开始遍历，性能非常低。
2. 在 Lock 接口里面有一个lockInterruptibly()方法，这个方法表示处于锁阻塞的线程允许被中断。也就是说，没有竞争到锁的线程加入到同步队列等待以后，是允许外部线程通过interrupt()方法触发唤醒并中断的。这个时候，被中断的线程的状态会修改成 CANCELLED。而被标记为 CANCELLED 状态的线程，是不需要去竞争锁的，但是它仍然存在于双向链表里面。这就意味着在后续的锁竞争中，需要把这个节点从链表里面移除，否则会导致锁阻塞的线程无法被正常唤醒。在这种情况下，如果是单向链表，就需要从 Head 节点开始往下逐个遍历，找到并移除异常状态的节点。同样效率也比较低，还会导致锁唤醒的操作和遍历操作之间的竞争。

## AQS原理

AQS，`AbstractQueuedSynchronizer`，抽象队列同步器，定义了一套多线程访问共享资源的同步器框架，许多并发工具的实现都依赖于它，如常用的`ReentrantLock/Semaphore/CountDownLatch`。

AQS使用一个`volatile`的int类型的成员变量`state`来表示同步状态，通过CAS修改同步状态的值。当线程调用 lock 方法时 ，如果 `state`=0，说明没有任何线程占有共享资源的锁，可以获得锁并将 `state`加1。如果 `state`不为0，则说明有线程目前正在使用共享变量，其他线程必须加入同步队列进行等待。

```java
private volatile int state;//共享变量，使用volatile修饰保证线程可见性
```

同步器依赖内部的同步队列（一个FIFO双向队列）来完成同步状态的管理，当前线程获取同步状态失败时，同步器会将当前线程以及等待状态（独占或共享 ）构造成为一个节点（Node）并将其加入同步队列并进行自旋，当同步状态释放时，会把首节点中的后继节点对应的线程唤醒，使其再次尝试获取同步状态。

![](http://img.topjavaer.cn/img/aqs.png)

## ReentrantLock 是如何实现可重入性的?

`ReentrantLock`内部自定义了同步器sync，在加锁的时候通过CAS算法，将线程对象放到一个双向链表中，每次获取锁的时候，检查当前维护的那个线程ID和当前请求的线程ID是否 一致，如果一致，同步状态加1，表示锁被当前线程获取了多次。

源码如下：

```java
final boolean nonfairTryAcquire(int acquires) {
    final Thread current = Thread.currentThread();
    int c = getState();
    if (c == 0) {
        if (compareAndSetState(0, acquires)) {
            setExclusiveOwnerThread(current);
            return true;
        }
    }
    else if (current == getExclusiveOwnerThread()) {
        int nextc = c + acquires;
        if (nextc < 0) // overflow
            throw new Error("Maximum lock count exceeded");
        setState(nextc);
        return true;
    }
    return false;
}
```

## 锁的分类

### 公平锁与非公平锁

按照**线程访问顺序**获取对象锁。`synchronized`是非公平锁，`Lock`默认是非公平锁，可以设置为公平锁，公平锁会影响性能。

```java
public ReentrantLock() {
    sync = new NonfairSync();
}

public ReentrantLock(boolean fair) {
    sync = fair ? new FairSync() : new NonfairSync();
}
```

### 共享式与独占式锁

共享式与独占式的最主要**区别**在于：同一时刻独占式只能有**一个线程**获取同步状态，而共享式在同一时刻可以有多个线程获取同步状态。例如读操作可以有多个线程同时进行，而写操作同一时刻只能有一个线程进行写操作，其他操作都会被阻塞。

### 悲观锁与乐观锁

悲观锁，**每次访问资源都会加锁**，执行完同步代码释放锁，`synchronized`和`ReentrantLock`属于悲观锁。

乐观锁，不会锁定资源，所有的线程都能访问并修改同一个资源，如果没有冲突就修改成功并退出，否则就会继续循环尝试。乐观锁最常见的实现就是`CAS`。

适用场景：

- 悲观锁适合**写操作多**的场景。
- 乐观锁适合**读操作多**的场景，不加锁可以提升读操作的性能。

## 乐观锁有什么问题?

乐观锁避免了悲观锁独占对象的问题，提高了并发性能，但它也有缺点:

- 乐观锁只能保证**一个共享变量**的原子操作。
- 长时间自旋可能导致**开销大**。假如CAS长时间不成功而一直自旋，会给CPU带来很大的开销。
- **ABA问题**。CAS的原理是通过比对内存值与预期值是否一样而判断内存值是否被改过，但是会有以下问题：假如内存值原来是A， 后来被一条线程改为B，最后又被改成了A，则CAS认为此内存值并没有发生改变。可以引入版本号解决这个问题，每次变量更新都把版本号加一。

## 什么是CAS？

CAS全称`Compare And Swap`，比较与交换，是乐观锁的主要实现方式。CAS在不使用锁的情况下实现多线程之间的变量同步。`ReentrantLock`内部的AQS和原子类内部都使用了CAS。

CAS算法涉及到三个操作数：

- 需要读写的内存值V。
- 进行比较的值A。
- 要写入的新值B。

只有当V的值等于A时，才会使用原子方式用新值B来更新V的值，否则会继续重试直到成功更新值。

以`AtomicInteger`为例，`AtomicInteger`的`getAndIncrement()`方法底层就是CAS实现，关键代码是 `compareAndSwapInt(obj, offset, expect, update)`，其含义就是，如果`obj`内的`value`和`expect`相等，就证明没有其他线程改变过这个变量，那么就更新它为`update`，如果不相等，那就会继续重试直到成功更新值。

## CAS存在的问题？

CAS 三大问题：

1. **ABA问题**。CAS需要在操作值的时候检查内存值是否发生变化，没有发生变化才会更新内存值。但是如果内存值原来是A，后来变成了B，然后又变成了A，那么CAS进行检查时会发现值没有发生变化，但是实际上是有变化的。ABA问题的解决思路就是在变量前面添加版本号，每次变量更新的时候都把版本号加一，这样变化过程就从`A－B－A`变成了`1A－2B－3A`。

   JDK从1.5开始提供了AtomicStampedReference类来解决ABA问题，原子更新带有版本号的引用类型。

2. **循环时间长开销大**。CAS操作如果长时间不成功，会导致其一直自旋，给CPU带来非常大的开销。

3. **只能保证一个共享变量的原子操作**。对一个共享变量执行操作时，CAS能够保证原子操作，但是对多个共享变量操作时，CAS是无法保证操作的原子性的。

   Java从1.5开始JDK提供了AtomicReference类来保证引用对象之间的原子性，可以把多个变量放在一个对象里来进行CAS操作。

## 并发工具

在JDK的并发包里提供了几个非常有用的并发工具类。CountDownLatch、CyclicBarrier和Semaphore工具类提供了一种并发流程控制的手段。

### CountDownLatch

CountDownLatch用于某个线程等待其他线程**执行完任务**再执行，与thread.join()功能类似。常见的应用场景是开启多个线程同时执行某个任务，等到所有任务执行完再执行特定操作，如汇总统计结果。

```
public class CountDownLatchDemo {
    static final int N = 4;
    static CountDownLatch latch = new CountDownLatch(N);

    public static void main(String[] args) throws InterruptedException {

       for(int i = 0; i < N; i++) {
            new Thread(new Thread1()).start();
       }

       latch.await(1000, TimeUnit.MILLISECONDS); //调用await()方法的线程会被挂起，它会等待直到count值为0才继续执行;等待timeout时间后count值还没变为0的话就会继续执行
       System.out.println("task finished");
    }

    static class Thread1 implements Runnable {

        @Override
        public void run() {
            try {
                System.out.println(Thread.currentThread().getName() + "starts working");
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                latch.countDown();
            }
        }
    }
}
```

运行结果：

```java
Thread-0starts working
Thread-1starts working
Thread-2starts working
Thread-3starts working
task finished
```

### CyclicBarrier

CyclicBarrier(同步屏障)，用于一组线程互相等待到某个状态，然后这组线程再**同时**执行。

```java
public CyclicBarrier(int parties, Runnable barrierAction) {
}
public CyclicBarrier(int parties) {
}
```

参数parties指让多少个线程或者任务等待至某个状态；参数barrierAction为当这些线程都达到某个状态时会执行的内容。

```java
public class CyclicBarrierTest {
    // 请求的数量
    private static final int threadCount = 10;
    // 需要同步的线程数量
    private static final CyclicBarrier cyclicBarrier = new CyclicBarrier(5);

    public static void main(String[] args) throws InterruptedException {
        // 创建线程池
        ExecutorService threadPool = Executors.newFixedThreadPool(10);

        for (int i = 0; i < threadCount; i++) {
            final int threadNum = i;
            Thread.sleep(1000);
            threadPool.execute(() -> {
                try {
                    test(threadNum);
                } catch (InterruptedException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                } catch (BrokenBarrierException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
            });
        }
        threadPool.shutdown();
    }

    public static void test(int threadnum) throws InterruptedException, BrokenBarrierException {
        System.out.println("threadnum:" + threadnum + "is ready");
        try {
            /**等待60秒，保证子线程完全执行结束*/
            cyclicBarrier.await(60, TimeUnit.SECONDS);
        } catch (Exception e) {
            System.out.println("-----CyclicBarrierException------");
        }
        System.out.println("threadnum:" + threadnum + "is finish");
    }

}
```

运行结果如下，可以看出CyclicBarrier是可以重用的：

```java
threadnum:0is ready
threadnum:1is ready
threadnum:2is ready
threadnum:3is ready
threadnum:4is ready
threadnum:4is finish
threadnum:3is finish
threadnum:2is finish
threadnum:1is finish
threadnum:0is finish
threadnum:5is ready
threadnum:6is ready
...
```

当四个线程都到达barrier状态后，会从四个线程中选择一个线程去执行Runnable。

### CyclicBarrier和CountDownLatch区别

CyclicBarrier 和 CountDownLatch 都能够实现线程之间的等待。

CountDownLatch用于某个线程等待其他线程**执行完任务**再执行。CyclicBarrier用于一组线程互相等待到某个状态，然后这组线程再**同时**执行。
CountDownLatch的计数器只能使用一次，而CyclicBarrier的计数器可以使用reset()方法重置，可用于处理更为复杂的业务场景。

### Semaphore

Semaphore类似于锁，它用于控制同时访问特定资源的线程数量，控制并发线程数。

```
public class SemaphoreDemo {
    public static void main(String[] args) {
        final int N = 7;
        Semaphore s = new Semaphore(3);
        for(int i = 0; i < N; i++) {
            new Worker(s, i).start();
        }
    }

    static class Worker extends Thread {
        private Semaphore s;
        private int num;
        public Worker(Semaphore s, int num) {
            this.s = s;
            this.num = num;
        }

        @Override
        public void run() {
            try {
                s.acquire();
                System.out.println("worker" + num +  " using the machine");
                Thread.sleep(1000);
                System.out.println("worker" + num +  " finished the task");
                s.release();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
```

运行结果如下，可以看出并非按照线程访问顺序获取资源的锁，即

```java
worker0 using the machine
worker1 using the machine
worker2 using the machine
worker2 finished the task
worker0 finished the task
worker3 using the machine
worker4 using the machine
worker1 finished the task
worker6 using the machine
worker4 finished the task
worker3 finished the task
worker6 finished the task
worker5 using the machine
worker5 finished the task
```



## 原子类

###  基本类型原子类

使用原子的方式更新基本类型

- AtomicInteger：整型原子类
- AtomicLong：长整型原子类
- AtomicBoolean ：布尔型原子类

AtomicInteger 类常用的方法：

```java
public final int get() //获取当前的值
public final int getAndSet(int newValue)//获取当前的值，并设置新的值
public final int getAndIncrement()//获取当前的值，并自增
public final int getAndDecrement() //获取当前的值，并自减
public final int getAndAdd(int delta) //获取当前的值，并加上预期的值
boolean compareAndSet(int expect, int update) //如果输入的数值等于预期值，则以原子方式将该值设置为输入值（update）
public final void lazySet(int newValue)//最终设置为newValue,使用 lazySet 设置之后可能导致其他线程在之后的一小段时间内还是可以读到旧的值。
```

AtomicInteger 类主要利用 CAS (compare and swap) 保证原子操作，从而避免加锁的高开销。

### 数组类型原子类

使用原子的方式更新数组里的某个元素

- AtomicIntegerArray：整形数组原子类
- AtomicLongArray：长整形数组原子类
- AtomicReferenceArray ：引用类型数组原子类

AtomicIntegerArray 类常用方法：

```java
public final int get(int i) //获取 index=i 位置元素的值
public final int getAndSet(int i, int newValue)//返回 index=i 位置的当前的值，并将其设置为新值：newValue
public final int getAndIncrement(int i)//获取 index=i 位置元素的值，并让该位置的元素自增
public final int getAndDecrement(int i) //获取 index=i 位置元素的值，并让该位置的元素自减
public final int getAndAdd(int i, int delta) //获取 index=i 位置元素的值，并加上预期的值
boolean compareAndSet(int i, int expect, int update) //如果输入的数值等于预期值，则以原子方式将 index=i 位置的元素值设置为输入值（update）
public final void lazySet(int i, int newValue)//最终 将index=i 位置的元素设置为newValue,使用 lazySet 设置之后可能导致其他线程在之后的一小段时间内还是可以读到旧的值。
```

### 引用类型原子类

- AtomicReference：引用类型原子类
- AtomicStampedReference：带有版本号的引用类型原子类。该类将整数值与引用关联起来，可用于解决原子的更新数据和数据的版本号，可以解决使用 CAS 进行原子更新时可能出现的 ABA 问题。
- AtomicMarkableReference ：原子更新带有标记的引用类型。该类将 boolean 标记与引用关联起来

## 什么是Daemon线程？

后台(daemon)线程，是指在程序运行的时候在后台提供一种通用服务的线程，并且这个线程并不属于程序中不可或缺的部分。因此，当所有的非后台线程结束时，程序也就终止了，同时会杀死进程中的所有后台线程。反过来说，只要有任何非后台线程还在运行，程序就不会终止。必须在线程启动之前调用setDaemon()方法，才能把它设置为后台线程。

注意：后台进程在不执行finally子句的情况下就会终止其run()方法。

比如：JVM的垃圾回收线程就是Daemon线程，Finalizer也是守护线程。

## SynchronizedMap和ConcurrentHashMap有什么区别？

SynchronizedMap一次锁住整张表来保证线程安全，所以每次只能有一个线程来访问map。

JDK1.8 ConcurrentHashMap采用CAS和synchronized来保证并发安全。数据结构采用数组+链表/红黑二叉树。synchronized只锁定当前链表或红黑二叉树的首节点，支持并发访问、修改。
另外ConcurrentHashMap使用了一种不同的迭代方式。当iterator被创建后集合再发生改变就不再是抛出ConcurrentModificationException，取而代之的是在改变时new新的数据从而不影响原有的数据 ，iterator完成后再将头指针替换为新的数据 ，这样iterator线程可以使用原来老的数据，而写线程也可以并发的完成改变。

## 什么是Future？

在并发编程中，不管是继承thread类还是实现runnable接口，都无法保证获取到之前的执行结果。通过实现Callback接口，并用Future可以来接收多线程的执行结果。

Future表示一个可能还没有完成的异步任务的结果，针对这个结果可以添加Callback以便在任务执行成功或失败后作出相应的操作。

举个例子：比如去吃早点时，点了包子和凉菜，包子需要等3分钟，凉菜只需1分钟，如果是串行的一个执行，在吃上早点的时候需要等待4分钟，但是因为你在等包子的时候，可以同时准备凉菜，所以在准备凉菜的过程中，可以同时准备包子，这样只需要等待3分钟。Future就是后面这种执行模式。

Future接口主要包括5个方法：

1. get()方法可以当任务结束后返回一个结果，如果调用时，工作还没有结束，则会阻塞线程，直到任务执行完毕
2. get(long timeout,TimeUnit unit)做多等待timeout的时间就会返回结果
3. cancel(boolean mayInterruptIfRunning)方法可以用来停止一个任务，如果任务可以停止（通过mayInterruptIfRunning来进行判断），则可以返回true，如果任务已经完成或者已经停止，或者这个任务无法停止，则会返回false。
4. isDone()方法判断当前方法是否完成
5. isCancel()方法判断当前方法是否取消

> 参考链接：https://blog.csdn.net/u014209205/article/details/80598209

![](http://img.topjavaer.cn/img/20220612101342.png)

## select、poll、epoll之间的区别

select，poll，epoll都是IO多路复用的机制。I/O多路复用就通过一种机制，可以监视多个描述符，一旦某个描述符就绪（一般是读就绪或者写就绪），能够通知程序进行相应的读写操作。但select，poll，epoll本质上都是同步I/O，因为他们都需要在读写事件就绪后自己负责进行读写，也就是说这个读写过程是阻塞的，而异步I/O则无需自己负责进行读写，异步I/O的实现会负责把数据从内核拷贝到用户空间。 

select的时间复杂度O(n)。它仅仅知道有I/O事件发生了，却并不知道是哪那几个流，只能无差别轮询所有流，找出能读出数据，或者写入数据的流，对他们进行操作。所以select具有O(n)的时间复杂度，同时处理的流越多，轮询时间就越长。

poll的时间复杂度O(n)。poll本质上和select没有区别，它将用户传入的数组拷贝到内核空间，然后查询每个fd对应的设备状态， 但是它没有最大连接数的限制，原因是它是基于链表来存储的.

epoll的时间复杂度O(1)。epoll可以理解为event poll，不同于忙轮询和无差别轮询，epoll会把哪个流发生了怎样的I/O事件通知我们。所以我们说epoll实际上是事件驱动的。
