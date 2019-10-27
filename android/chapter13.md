## 高级技巧

### 全局获取 Context

定制一个 Application 类，管理程序内的一些全局的状态信息：

```java
public class MyApplication extends Application {

    private static Context context;

    @Override
    public void onCreate() {
        context = getApplicationContext();
    }
    
    public static Context getContext() {
        return context;
    }
}
```

接下来告知系统在程序启动时应该初始化 MyApplication 类：

```xml
<application
        android:name="com.tyson.chapter13.MyApplication"
          ...>
</application>
```

在需要获取 Context 对象的地方直接调用 MyApplication.getContext() 就可以。

如果项目中有多个 Applicaiton 的话，解决方案：

```java
public class MyApplication extends Application {

    private static Context context;

    @Override
    public void onCreate() {
        context = getApplicationContext();
        AnotherApplication.initialize(context);
    }
    
    public static Context getContext() {
        return context;
    }
}
```

将 Context 对象传递给 AnotherApplication，相当于在 AndroidManifest.xml 中配置了 AnotherApplication。

### 使用 Intent 传递对象

Intent.putExtra() 方法所支持的数据类型有限。

#### Serializable

序列化，将对象转换成可传输的状态。只需要让类去实现 Serializable 这个接口就可以。比如 Person 实现了 Serializable 这个接口，那么它的对象可以在网络中传递：

```java
...
intent.putExtra("person_data", person);
startActivity(intent);
```

获取对象：

```java
Person person = (Person) getIntent().getSerializableExtra("person_data");
```

#### Parcelable

将完整对象进行分解，分解后的每部分都是 Intent 所支持的数据类型。

```java
public class Person implements Parcelable {
    
    private String name;
    
    private int age;
    
    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel parcel, int i) {
        parcel.writeString(name);
        parcel.writeInt(age);
    }
    
    public static final Parcelable.Creator<Person> CREATOR = new Parcelable.Creator<Person>() {
        @Override
        public Person createFromParcel(Parcel parcel) {
            Person person = new Person();
            person.name = parcel.readString();//读取的顺序要与写出的顺序相同
            person.age = parcel.readInt();
            return person;
        }

        @Override
        public Person[] newArray(int i) {
            return new Person[i];
        }
    };
}
```

传递 Parcelable 对象和 Serializable 序列化方式差不多，只不过在获取对象时调用的是 getParcelableExtra() 方法。

```java
Person person = (Person) getIntent().getParcelableExtra("person_data");
```

Serializable 方式较为简单，但它会对整个对象序列化，效率较低，推荐使用 Parcelable 的方式实现 Intent 传递对象的功能。

### 日志工具

控制日志的打印：

```java
public class LogUtils {
    public static final int VERBOSE = 1;
    public static final int DEBUG = 2;
    public static final int INFO = 3;
    public static final int WARN = 4;
    public static final int ERROR = 5;
    public static final int NOTHING = 6;
    public static int level= VERBOSE;

    public static void v(String tag, String msg) {
        if (level <= VERBOSE) {
            Log.v(tag, msg);
        }
    }

    public static void d(String tag, String msg) {
        if (level <= DEBUG) {
            Log.d(tag, msg);
        }
    }
    ...
}
```

打印 DEBUG 级别的日志：

```java
LogUtil.d("TAG", "debug log");
```

level 等于 NOTHING 则会将所有日志屏蔽掉。

### 创建定时任务

Android 的定时任务有两种实现方式，一种是 Java API 里提供的 Timer 类，一种是使用 Android 的 Alarm 机制。Timer 不太适合需要长期在后台运行的定时任务。Android 手机在长时间不操作的情况下自动让 cpu 进入睡眠状态，可能会导致 Timer 中的定时任务无法正常运行。而 Alarm 具有唤醒 cpu 的功能，可以保证在大多数情况下需要执行定时任务的时候 cpu 都能正常工作。

#### Alarm 机制

