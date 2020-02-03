## 简介

Android 大致分为四层构架：Linux 内核层、系统运行库层、应用框架层和应用层。

### 四大组件

Android 系统的四大组件是活动（Activity）、服务（Service）、广播接收器（Broadcast receiver）和内容提供器（Content provider）。活动是所有 Android 应用程序的门面，放在应用中能看到的东西都是放在活动中的。广播接收器允许你的应用接收来自各处的广播消息，比如电话、短信等，也可以向外发出广播消息。内存提供器实现了应用程序之间的数据共享，比如读取系统电话薄中的联系人。

### 项目结构

#### AndroidManifest

app/src 目录下 AndroidManifest.xml：

```xml
<activity android:name=".HelloWorldActivity">
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />

        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
</activity>
```

对 HelloWorldActivity 这个活动进行注册，没有在 AndroidManifest.xml 中注册的活动是不能使用的。其中` <action android:name="android.intent.action.MAIN" />`  和 `<category android:name="android.intent.category.LAUNCHER" />`表示 HelloWorldActivity 是这个项目的主活动，在手机上点击应用图标时，首先启动的是这个活动。

#### res目录

app/src/main/res/values 目录下的 string.xml：

```xml
<resources>
    <string name="app_name">HelloWorld</string>
</resources>
```

这里定义了一个应用程序名称的字符串，可以通过两种方式引用它：

- 在代码中通过 `R.string.app_name` 引用它
- 在 xml 中通过 `@string/app_name`引用它

引用的例子：

```xml
<application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">
        <activity android:name=".HelloWorldActivity">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />

                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
```

#### build.gradle

gradle 是项目构建工具，基于 groovy 的领域特定语言来声明项目设置，摒弃了传统的基于 xml （如maven）的各种繁琐的配置。项目中有两个 build.gradle。

最外层的 build.gradle 是全局的项目构建配置：

```json
buildscript {
    repositories {
        jcenter()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:2.2.0'

        // NOTE: Do not place your application dependencies here; they belong
        // in the individual module build.gradle files
    }
}

allprojects {
    repositories {
        jcenter()
        maven {
            url "https://maven.google.com"
        }
    }
}

task clean(type: Delete) {
    delete rootProject.buildDir
}
```

jcenter 是代码托管仓库，声明了之后就可以轻松引用 jcenter 上任何的开源项目。dependencies 中使用了 classpath 声明了一个 gradle 插件。

app 目录下的 build.gradle：

```xml
apply plugin: 'com.android.application'

android {
    compileSdkVersion 26 //29-->26
    buildToolsVersion "29.0.1"
    defaultConfig {
        applicationId "com.tyso.helloworld"
        minSdkVersion 15
        targetSdkVersion 26  //29-->26
        versionCode 1
        versionName "1.0"
        testInstrumentationRunner "android.support.test.runner.AndroidJUnitRunner"
    }
    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}

dependencies {
    compile fileTree(dir: 'libs', include: ['*.jar'])
    androidTestCompile('com.android.support.test.espresso:espresso-core:2.2.2', {
        exclude group: 'com.android.support', module: 'support-annotations'
    })
    compile 'com.android.support:appcompat-v7:26.+'  //7:29-->7:26
    testCompile 'junit:junit:4.12'
}
```

首行定义了一个插件，有两个值可选： com.android.application 和 com.android.libarary，库模块需要依附在别的模块中才能运行。compileSdkVersion 指定项目的编译版本，buildToolsVersion 指定项目构建工具的版本。

defaultConfig 对项目的细节进行配置。minSdkVersion 表示项目最低兼容的 Android 系统版本。

buildTypes 指定生成安装文件的配置，主要有两个子闭包，release（用于指定生成正式版安装文件的配置）和 debug。minifyEnabled 用于指定是否对项目代码进行混淆，true 表示混淆。混淆包含代码压缩、代码混淆和资源压缩等优化。proguardFiles 用于指定混淆时使用的规则文件。通过 Android Studio 直接运行项目生成的都是测试版安装文件。

dependencies 指明了当前项目的依赖关系。通常有3种依赖关系：本地依赖、库依赖和远程依赖。compile fileTree 将 libs 目录下的 jar 文件都添加到项目的构建路径中。compile 'com.android.support:appcompat-v7:26.+' 则是远程依赖声明，添加这行声明后，gradle 在构建项目时会先检查本地有没有这个库的缓存，如果没有则会自动联网下载，然后再将这个库添加到项目的构建路径中。库依赖声明格式如：`compile project(':helper')`，helper 是库模块的名字。androidTestCompile 用于声明测试用例库。

### 日志工具

Android 的日志工具类 android.util.Log，提供了5个方法打印日志：

- Log.v()：意义最小的日志信息，对应的级别最低，级别为 verbose
- Log.d()：对应级别 debug
- Log.i()：重要信息，对应级别为 Info
- Log.w()：警告信息，最好去修复出现警告的地方，对应级别 warn
- Log.e()：对应级别 error

例如`Log.d("HelloWorldActivity", "onCreate execute")`，传入两个参数 tag 和 msg，tag 一般传入类名就好，用于对打印信息进行过滤。

使用快捷键 logt+tab可以快速生成一个以当前类名作为值的 TAG 常量：

```java
public class HelloWorldActivity extends AppCompatActivity {
    private static final String TAG = "HelloWorldActivity";
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.hello_world_activity);
        Log.d(TAG, "onCreate execute");
    }
}
```

logcat 支持过滤器、日志级别控制和关键字过滤。



## 活动

活动是包含用户界面的组件，主要用于和用户进行交互，一个应用程序可以包含零个或多个活动。

### 基本用法

新建项目时选择 add no activity，在 com.tyson.activitytest 包下手动创建活动 FirstActivity。

编辑布局 first_layout：

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical" android:layout_width="match_parent"
    android:layout_height="match_parent">

    <Button
        android:id="@+id/button_1"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="Button1"
        />
</LinearLayout>
```

android:id 是当前元素唯一的标识符，@+id/id_name 表示在 xml 中定义一个 id，在 xml 中引用一个 id 使用@id/id_name，match_parent 表示让当前元素和父元素一样，wrap_content 表示当前元素的高度只要能刚好包住里面的内容就行。

FirstActivity.java 修改如下：

```java
public class FirstActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.first_layout);//给当前活动加载一个布局
    }
}
```

在 AndroidManifest 文件中注册，Android studio 已经帮我们注册好，还需要为程序配置主活动。

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.tyson.activitytest">

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">
        <activity android:name=".FirstActivity"
            android:label="This is FirstActivity">
            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
        </activity>
    </application>

</manifest>
```

#### 在活动中使用 Toast

使用 Toast 可以将一些短小的信息通知给用户，这些消息会在一段时间后自动消失，并且不会占用任何屏幕空间。

设置点击按钮时弹出一个 Toast，onCreate() 方法修改如下：

```java
 protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.first_layout);//给当前活动加载一个布局
        Button button1 = (Button) findViewById(R.id.button_1);
        button1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Toast.makeText(FirstActivity.this, "you click on button1",
                        Toast.LENGTH_SHORT).show();
            }
        });
    }
```

通过静态方法 makeText() 创建出一个 Toast 对象，然后调用 show 方法将 Toast 显示出来。makeText 方法传入三个参数，第一个是 Context，活动本身就是一个 Context 对象，第二个参数是 Toast 要显示的文本内容，第三个参数是 Toast 显示的时长，有两个内置常量可以选择：Toast.LENGTH_SHORT 和 Toast.LENGTH_LONG。

#### 在活动中使用 Menu

res 目录下新建一个 menu 文件夹，然后在这个文件夹下再新建一个名叫 main 的菜单文件，在 main.xml 添加如下代码：

```xml
<?xml version="1.0" encoding="utf-8"?>
<menu xmlns:android="http://schemas.android.com/apk/res/android">
    <item
        android:id="@+id/add_item"
        android:title="Add"/>
    <item
        android:id="@+id/remove_item"
        android:title="Remove"/>
</menu>
```

在 FirstActivity 中重写 onCreateOptionsMenu 方法（ctrl+o快捷键）。

```java
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.main, menu);
        return false;
    }
```

inflate 方法接收两个参数，第一个参数指定通过哪个资源文件来创建菜单，第二个参数指定菜单项将添加到哪一个 Menu 对象中。

接下来定义菜单响应事件，在 FirstActivity 中重写 onOptionsItemSelected。

```java
@Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case R.id.add_item:
                Toast.makeText(this, "you clicked add", Toast.LENGTH_SHORT).show();
                break;
            case R.id.remove_item:
                Toast.makeText(this, "you clicked remove", Toast.LENGTH_SHORT).show();
                break;
            default:
        }
        return true;
    }
```

#### 销毁一个活动

按一下 back 键可以销毁当前的活动，也可以通过代码来销毁活动，Activity 提供了一个 finish 方法，在活动中调用一下这个方法就可以销毁活动。

修改按钮监听器的代码：

```java
button1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });
```

### 使用 intent 在活动在穿梭

程序有多个活动时，在启动器点击应用图标只会进入到该应用的主活动，怎样从主活动进入其他活动呢？Intent 是 Android 程序各组件之间进行交互的重要方式，它不仅可以指明当前组件想要执行的动作，还可以在不同组件之间传递数据，Intent 分为 显式 Intent 和隐式 Intent。

#### 显式 Intent

新建 Activity，勾选 generate layout file，命名布局文件为 second_layout.xml，不勾选 launcher activity（不是主活动）。编辑 second_layout.xml：

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <Button
        android:id="@+id/button_2"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="Button2"
        />
</LinearLayout>
```

任何一个活动都需要在 AndroidMainfest.xml 中注册，Android studio 已经帮我们完成：

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.tyson.activitytest">

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">
        <activity
            android:name=".FirstActivity"
            android:label="This is FirstActivity">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />

                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
        <activity android:name=".SecondActivity"></activity>
    </application>

</manifest>
```

构建一个 Intent，修改 FirstActivity 按钮点击事件：

```java
        button1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(FirstActivity.this, SecondActivity.class);
                startActivity(intent);
            }
        });
```

在 FirstActivity 活动的基础上打开 SecondActivity 这个活动，通过 startActivity 启动 Intent。

#### 隐式 Intent

隐式 Intent 不直接指明启动哪个活动，而是指定 action 和 category 等信息，让系统帮我们找出合适的活动去启动。

修改 AndroidManifest.xml，在 \<activity\> 标签中配置 \<intent-filter\>，指定当前活动可以响应的 action 和 category。每个 Intent 只能有一个 action，可以有多个 category。android.intent.category.DEFAULT 是默认的 category，在活动中构建 Intent 时若没有配置 category，则会自动将默认的 category 添加到 Intent。

```xml
<activity android:name=".SecondActivity">
    <intent-filter>
        <action android:name="com.tyson.activitytest.ACTION_START"/>
        <category android:name="android.intent.category.DEFAULT"/>
        <category android:name="com.tyson.activitytest.MY_CATEGORY"/>
    </intent-filter>
</activity>
```

修改 FirstActivity 中按钮的点击事件：

```java
        button1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent("com.tyson.activitytest.ACTION_START");
                intent.addCategory("com.tyson.activitytest.MY_CATEGORY");
                startActivity(intent);
            }
        });
```

只有 action 和 category 中的内容匹配了 Intent 中指定的 action 和 category 时，这个活动才会响应该 Intent。

#### 隐式 Intent的用法

使用隐式 Intent，我们不仅可以启动自己应用程序的活动，还可以启动其他程序的活动，方便应用程序功能共享。如应用程序需要展示一个网页，我们可以调用系统的浏览器打开这个网页。

```java
        button1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(Intent.ACTION_VIEW);
                intent.setData(Uri.parse("http://www.baidu.com"));
                startActivity(intent);
            }
        });
```

Intent.ACTION_VIEW 是系统内置的动作。此外，可以通过在 \<intent-filter\> 标签中再配置一个\<data\>标签，可以更精确的指定当前活动可以响应什么类型的数据。data 标签可以配置 android:scheme 数据协议、android:host、android:port、android:path 和 android:mimeType（用于指定可以处理的数据类型，允许使用通配符的方式进行指定）。一般 data 标签不需要指定过多的内容。

下面建立一个活动，让它也能相应打开网址的 Intent。编辑 third_layout.xml：

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <Button
        android:id="@+id/button_3"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="Button3"
        />
</LinearLayout>
```

AndroidManifest.xml 中修改 ThirdActivity 的注册信息：

```xml
        <activity android:name=".ThirdActivity">
            <intent-filter>
                <action android:name="android.intent.action.VIEW"/>
                <category android:name="android.intent.category.DEFAULT"/>
                <data android:scheme="http"/>
            </intent-filter>
        </activity>
```

指定数据协议是 http 协议。运行程序，点击按钮，系统会自动弹出一个列表，选择 browser 会打开浏览器，选择 ActivityTest 则会启动 ThirdActivity。

除了 http 协议外，我们还可以指定很多其他协议，比如 tel 表示打电话、geo 表示显示地理位置。下面代码展示了如何在我们的程序中调用系统拨号界面。

```java
        button1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(Intent.ACTION_DIAL);
                intent.setData(Uri.parse("tel:10086"));
                startActivity(intent);
            }
        });
```

#### 向下一个活动传递数据

Intent 中提供了一系列 putExtra() 方法的重载，可以把我们想要传递的数据暂存在 Intent 中，启动另一个活动时，只需要把这些数据再从 Intent 取出就可以了。比如 FirstActivity 中有一个字符串，想把这个字符串传递到 SecondActivity 中。

```java
       button1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String data = "hello second activity";
                Intent intent = new Intent(FirstActivity.this, SecondActivity.class);
                intent.putExtra("extra_data", data);
                startActivity(intent);
            }
        });
```

在 SecondActivity 中把数据取出来并打印。

```java
public class SecondActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.second_layout);
        Intent intent = getIntent();
        String data = intent.getStringExtra("extra_data");
        Log.d("second activity", data);
    }
}
```

通过 getIntent() 方法获取到用于启动 SecondActivity 的 Intent，然后调用 getStringExtra() 方法。如果传递的是整型数据，则使用 getIntExtra() 方法。如果传递的是 boolean 类型数据，则使用 getBooleanExtra() 方法。

#### 返回数据给上一个活动

Activity 的 startActivityForResult() 方法可以用于启动活动，它在活动销毁时会返回一个结果给上一个活动。

```java
        button1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(FirstActivity.this, SecondActivity.class);
                startActivityForResult(intent, 1);//请求码用于在之后的回调判断数据来源是SecondActivity还是ThirdActivity
            }
        });
```

在 SecondActivity 中给按钮注册点击事件，在点击事件中添加返回数据的逻辑：

```java
 @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.second_layout);
        Button button2 = (Button) findViewById(R.id.button_2);
        button2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent();
                intent.putExtra("data_return", "hello first activity");
                setResult(RESULT_OK, intent);//向上一个活动返回数据
                finish();
            }
        });
    }
```

setResult() 方法第一个参数是向上一个活动返回处理结果，一般只使用 RESULT_OK 或 RESULT_CANCELED 这两个值。

我们使用 startActivityForResult() 方法来启动 SecondActivity，SecondActivity 销毁后会调用上一个活动的 onActivityResult() 方法，因此我们需要在 FirstActivity 中重写此方法。

```java
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        switch (requestCode) {
            case 1:
                if (resultCode == RESULT_OK) {
                    String resultData = data.getStringExtra("data_return");
                    Log.d("first activity", resultData);
                }
                break;
            default:
        }
    }
```

首先检查 requestCode 的值判断数据来源。

如果用户不是通过点击按钮结束活动，而是通过 back 键回到上一个活动，这样数据返回不了。可以通过在 SecondActivity 中重写 onBackPressed() 方法来返回数据。

