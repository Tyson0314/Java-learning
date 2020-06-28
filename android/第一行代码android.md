<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [简介](#%E7%AE%80%E4%BB%8B)
  - [四大组件](#%E5%9B%9B%E5%A4%A7%E7%BB%84%E4%BB%B6)
  - [项目结构](#%E9%A1%B9%E7%9B%AE%E7%BB%93%E6%9E%84)
    - [AndroidManifest](#androidmanifest)
    - [res目录](#res%E7%9B%AE%E5%BD%95)
    - [build.gradle](#buildgradle)
  - [日志工具](#%E6%97%A5%E5%BF%97%E5%B7%A5%E5%85%B7)
- [活动](#%E6%B4%BB%E5%8A%A8)
  - [基本用法](#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95)
    - [在活动中使用 Toast](#%E5%9C%A8%E6%B4%BB%E5%8A%A8%E4%B8%AD%E4%BD%BF%E7%94%A8-toast)
    - [在活动中使用 Menu](#%E5%9C%A8%E6%B4%BB%E5%8A%A8%E4%B8%AD%E4%BD%BF%E7%94%A8-menu)
    - [销毁一个活动](#%E9%94%80%E6%AF%81%E4%B8%80%E4%B8%AA%E6%B4%BB%E5%8A%A8)
  - [使用 intent 在活动在穿梭](#%E4%BD%BF%E7%94%A8-intent-%E5%9C%A8%E6%B4%BB%E5%8A%A8%E5%9C%A8%E7%A9%BF%E6%A2%AD)
    - [显式 Intent](#%E6%98%BE%E5%BC%8F-intent)
    - [隐式 Intent](#%E9%9A%90%E5%BC%8F-intent)
    - [隐式 Intent的用法](#%E9%9A%90%E5%BC%8F-intent%E7%9A%84%E7%94%A8%E6%B3%95)
    - [向下一个活动传递数据](#%E5%90%91%E4%B8%8B%E4%B8%80%E4%B8%AA%E6%B4%BB%E5%8A%A8%E4%BC%A0%E9%80%92%E6%95%B0%E6%8D%AE)
    - [返回数据给上一个活动](#%E8%BF%94%E5%9B%9E%E6%95%B0%E6%8D%AE%E7%BB%99%E4%B8%8A%E4%B8%80%E4%B8%AA%E6%B4%BB%E5%8A%A8)
- [布局](#%E5%B8%83%E5%B1%80)
  - [LinearLayout](#linearlayout)
  - [RelativeLayout](#relativelayout)
  - [FrameLayout](#framelayout)
  - [百分比布局](#%E7%99%BE%E5%88%86%E6%AF%94%E5%B8%83%E5%B1%80)
  - [自定义控件](#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%8E%A7%E4%BB%B6)
    - [引入布局](#%E5%BC%95%E5%85%A5%E5%B8%83%E5%B1%80)
    - [创建自定义控件](#%E5%88%9B%E5%BB%BA%E8%87%AA%E5%AE%9A%E4%B9%89%E6%8E%A7%E4%BB%B6)
  - [ListView](#listview)
  - [RecyclerView](#recyclerview)
    - [点击事件](#%E7%82%B9%E5%87%BB%E4%BA%8B%E4%BB%B6)
  - [聊天应用](#%E8%81%8A%E5%A4%A9%E5%BA%94%E7%94%A8)
- [手机多媒体](#%E6%89%8B%E6%9C%BA%E5%A4%9A%E5%AA%92%E4%BD%93)
  - [通知](#%E9%80%9A%E7%9F%A5)
    - [摄像头拍照](#%E6%91%84%E5%83%8F%E5%A4%B4%E6%8B%8D%E7%85%A7)
    - [相册选择相片](#%E7%9B%B8%E5%86%8C%E9%80%89%E6%8B%A9%E7%9B%B8%E7%89%87)
    - [音频播放](#%E9%9F%B3%E9%A2%91%E6%92%AD%E6%94%BE)
- [网络技术](#%E7%BD%91%E7%BB%9C%E6%8A%80%E6%9C%AF)
  - [WebView](#webview)
  - [HttpURLConnection](#httpurlconnection)
  - [OkHttp](#okhttp)
  - [HttpUtil](#httputil)
- [高级技巧](#%E9%AB%98%E7%BA%A7%E6%8A%80%E5%B7%A7)
  - [全局获取 Context](#%E5%85%A8%E5%B1%80%E8%8E%B7%E5%8F%96-context)
  - [使用 Intent 传递对象](#%E4%BD%BF%E7%94%A8-intent-%E4%BC%A0%E9%80%92%E5%AF%B9%E8%B1%A1)
    - [Serializable](#serializable)
    - [Parcelable](#parcelable)
  - [日志工具](#%E6%97%A5%E5%BF%97%E5%B7%A5%E5%85%B7-1)
  - [创建定时任务](#%E5%88%9B%E5%BB%BA%E5%AE%9A%E6%97%B6%E4%BB%BB%E5%8A%A1)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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



## 布局

### LinearLayout

线性布局，通过 android:orientation 可以指定控件的排列方向，vertical 是垂直方向排列，horizontal 是水平方向排列。如果 LinearLayout 的排列方向是 horizontal，则控件的 android:width 不能指定为 match_parent，因为单独一个控件就会把水平方向填满。

android:layout_gravity 与 android:gravity 类似，android:gravity 用于 TextView 是指定文字在控件中的对齐方式，android:layout_gravity 指定控件在布局中的对齐方式。当 LinearLayout 的排列方向是 horizontal 时，只有垂直方向上的对齐方式才会生效。参考：[gravity和layout_gravity相同处](https://www.cnblogs.com/xqz0618/p/gravity.html)

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="horizontal"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <Button
        android:id="@+id/button_1"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="top"
        android:text="Button1"
        />
    <Button
        android:id="@+id/button_2"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center_vertical"
        android:text="Button2"
        />
    <Button
        android:id="@+id/button_3"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="bottom"
        android:text="Button3"
        />
</LinearLayout>
```

效果图：

![layout_gravity](https://img2018.cnblogs.com/blog/1252910/201908/1252910-20190810172653243-1947099814.png)

layout_weigth 指定控件的比例。

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="horizontal"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <TextView
        android:id="@+id/text_view"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:layout_weight="1"
        android:hint="type something here" />

    <Button
        android:id="@+id/button_1"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:layout_weight="1"
        android:text="Button1" />
</LinearLayout>
```

效果图：

![layout_weight](https://img2018.cnblogs.com/blog/1252910/201908/1252910-20190810173254665-442135517.png)

也可以指定部分控件的 layout_weight 达到更好的效果。

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="horizontal"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <TextView
        android:id="@+id/text_view"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:layout_weight="1"
        android:hint="type something here" />

    <Button
        android:id="@+id/button_1"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Button1" />
</LinearLayout>
```

### RelativeLayout

相对于父布局定位。

```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <Button
        android:id="@+id/button_1"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_alignParentLeft="true"
        android:layout_alignParentTop="true"
        android:text="Button1"
        />
    <Button
        android:id="@+id/button_2"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_alignParentRight="true"
        android:layout_alignParentTop="true"
        android:text="Button2"
        />
    <Button
        android:id="@+id/button_3"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_centerInParent="true"
        android:text="Button3"
        />

    <Button
        android:id="@+id/button_4"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_alignParentLeft="true"
        android:layout_alignParentBottom="true"
        android:text="Button4"
        />

    <Button
        android:id="@+id/button_5"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_alignParentRight="true"
        android:layout_alignParentBottom="true"
        android:text="Button5"
        />
</RelativeLayout>
```



![RelativeLayout](https://img2018.cnblogs.com/blog/1252910/201908/1252910-20190810174414935-147987253.png)

也可以相对于控件定位。

![RelativeLayout-相对控件定位](https://img2018.cnblogs.com/blog/1252910/201908/1252910-20190810174703759-1586926703.png)

### FrameLayout

帧布局。应用场景少，所有控件默认放到布局的左上角。

```xml
<?xml version="1.0" encoding="utf-8"?>
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <TextView
        android:id="@+id/text_view"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="left"
        android:text="a text view"/>

    <ImageView
        android:id="@+id/image_view"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="right"
        android:src="@mipmap/ic_launcher"/>
</FrameLayout>
```

### 百分比布局

直接指定控件在布局的百分比，不再使用 match_parent 和 wrap_content。

首先添加百分比布局库的依赖：

app/build.gradle 文件，dependencies 闭包添加如下内容：

`compile 'com.android.support:percent:26.0.0-alpha1'`，先到sdk/extra路径下找对应的包。

定义四个按钮：

```xml
<?xml version="1.0" encoding="utf-8"?>
<android.support.percent.PercentFrameLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <Button
        android:id="@+id/button_1"
        android:layout_gravity="left|top"
        app:layout_heightPercent="50%"
        app:layout_widthPercent="50%"
        android:text="Button1"
        />
    <Button
        android:id="@+id/button_2"
        android:layout_gravity="right|top"
        app:layout_heightPercent="50%"
        app:layout_widthPercent="50%"
        android:text="Button2"
        />
    <Button
        android:id="@+id/button_3"
        android:layout_gravity="left|bottom"
        app:layout_heightPercent="50%"
        app:layout_widthPercent="50%"
        android:text="Button3"
        />

    <Button
        android:id="@+id/button_4"
        android:layout_gravity="right|bottom"
        app:layout_heightPercent="50%"
        app:layout_widthPercent="50%"
        android:text="Button4"
        />
</android.support.percent.PercentFrameLayout>
```

迁移到androidx（support 包的整理）：
修改依赖：`implementation 'androidx.percentlayout:percentlayout:1.0.0'`
修改布局：

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.percentlayout.widget.PercentFrameLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <Button
        android:id="@+id/button_1"
        android:layout_width="0dp"
        android:layout_height="0dp"
        android:layout_gravity="left|top"
        app:layout_heightPercent="50%"
        app:layout_widthPercent="50%"
        android:text="Button1"
        />
    <Button
        android:id="@+id/button_2"
        android:layout_width="0dp"
        android:layout_height="0dp"
        android:layout_gravity="right|top"
        app:layout_heightPercent="50%"
        app:layout_widthPercent="50%"
        android:text="Button2"
        />
    <Button
        android:id="@+id/button_3"
        android:layout_width="0dp"
        android:layout_height="0dp"
        android:layout_gravity="left|bottom"
        app:layout_heightPercent="50%"
        app:layout_widthPercent="50%"
        android:text="Button3"
        />

    <Button
        android:id="@+id/button_4"
        android:layout_width="0dp"
        android:layout_height="0dp"
        android:layout_gravity="right|bottom"
        app:layout_heightPercent="50%"
        app:layout_widthPercent="50%"
        android:text="Button4"
        />
</androidx.percentlayout.widget.PercentFrameLayout>
```

### 自定义控件

#### 引入布局

在 layout 目录下新建 title.xml。android:margin 指定控件上下左右方向偏移的距离，android:layout_marginLeft 指定控件在左边偏移的距离。

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:background="@drawable/title_bg">
    <Button
        android:id="@+id/title_back"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center"
        android:layout_margin="5dp"
        android:background="@drawable/back_bg"
        android:text="Back"
        android:textColor="#fff"/>
    <TextView
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:layout_gravity="center"
        android:layout_weight="1"
        android:gravity="center"
        android:text="Text"
        android:textColor="#fff"
        android:textSize="24sp"/>
    <Button
        android:id="@+id/title_edit"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center"
        android:layout_margin="5dp"
        android:background="@drawable/edit_bg"
        android:text="Edit"
        android:textColor="#fff"/>
</LinearLayout>
```

在 activity_main 使用 include 将标题栏布局引入：

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <include layout="@layout/title"/>
</LinearLayout>
```

将系统自带的标题栏隐藏掉：

```java
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        ActionBar actionBar = getSupportActionBar();
        if (actionBar != null) {
            actionBar.hide();
        }
    }
```

#### 创建自定义控件

有一些控件能够相应事件，需要在每个活动中为这些控件单独编写一次事件注册的代码。使用自定义控件可以减少这些重复代码。

```java
public class TitleLayout extends LinearLayout {
    public TitleLayout(Context context, AttributeSet attrs) {
        super(context, attrs);
        LayoutInflater.from(context).inflate(R.layout.title, this);//动态加载布局，inflate第二个参数是添加父布局
        Button titleBack = findViewById(R.id.title_back);
        Button titleEdit = findViewById(R.id.title_edit);
        titleBack.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View view) {
                ((Activity)getContext()).finish();
            }
        });
        titleEdit.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View view) {
                Toast.makeText(getContext(), "you click the edit button", Toast.LENGTH_SHORT).show();
            }
        });
    }
}
```

在 activity_main.xml 中添加这个自定义控件：

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <com.tyson.uicustomview.TitleLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"/>
</LinearLayout>
```

### ListView

新建 Fruit.java

```java
public class Fruit {
    private String name;
    private int imageId;

    public Fruit(String name, int imageId) {
        this.name = name;
        this.imageId = imageId;
    }

    public String getName() {
        return name;
    }


    public int getImageId() {
        return imageId;
    }
}
```

修改 activity_main.xml：

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <android.support.v7.widget.ListView
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:id="@+id/list_view"/>
</LinearLayout>
```

ListView 子项布局 fruit_item.xml：

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <ImageView
        android:id="@+id/fruit_image"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content" />
    <TextView
        android:id="@+id/fruit_name"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center_vertical"
        android:layout_marginLeft="10dp"/>
</LinearLayout>
```

数组数据无法直接传递给 ListView，需要借助适配器完成。

```java
public class FruitAdapter extends ArrayAdapter<Fruit> {
    private int resourceId;

    public FruitAdapter(Context context, int resource, List<Fruit> fruits) {
        super(context, resource, fruits);
        resourceId = resource;
    }

    @NonNull
    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        View view;
        ViewHolder viewHolder;
        Fruit fruit = getItem(position);
        if (convertView == null) {
            view = LayoutInflater.from(getContext()).inflate(resourceId, parent, false);
            viewHolder = new ViewHolder();
            viewHolder.fruitImage = view.findViewById(R.id.fruit_image);
            viewHolder.fruitName = view.findViewById(R.id.fruit_name);
            view.setTag(viewHolder);//将viewHolder保存在view
        } else {
            view = convertView;
            viewHolder = (ViewHolder) view.getTag();
        }

        viewHolder.fruitImage.setImageResource(fruit.getImageId());
        viewHolder.fruitName.setText(fruit.getName());
        return view;
    }

    class ViewHolder {
        ImageView fruitImage;
        TextView fruitName;
    }
}
```

convertView 用于缓存之前加载好的布局，使用 ViewHolder 对控件实例进行缓存。

MainActivity

```java
public class MainActivity extends AppCompatActivity {

    private List<Fruit> fruitList = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        initFruits();
        FruitAdapter adapter = new FruitAdapter(
                MainActivity.this, R.layout.fruit_item, fruitList);
        ListView listView = (ListView) findViewById(R.id.list_view);
        listView.setAdapter(adapter);
        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                Fruit fruit = fruitList.get(i);
                Toast.makeText(MainActivity.this, fruit.getName(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void initFruits() {
        for (int i = 0; i < 2; i++) {
            Fruit apple = new Fruit("Apple", R.drawable.apple_pic);
            fruitList.add(apple);
            Fruit banana = new Fruit("Banana", R.drawable.banana_pic);
            fruitList.add(banana);
            Fruit orange = new Fruit("Orange", R.drawable.orange_pic);
            fruitList.add(orange);
            Fruit watermelon = new Fruit("Watermelon", R.drawable.watermelon_pic);
            fruitList.add(watermelon);
            Fruit pear = new Fruit("Pear", R.drawable.pear_pic);
            fruitList.add(pear);
            Fruit grape = new Fruit("Grape", R.drawable.grape_pic);
            fruitList.add(grape);
            Fruit pineapple = new Fruit("Pineapple", R.drawable.pineapple_pic);
            fruitList.add(pineapple);
            Fruit strawberry = new Fruit("Strawberry", R.drawable.strawberry_pic);
            fruitList.add(strawberry);
            Fruit cherry = new Fruit("Cherry", R.drawable.cherry_pic);
            fruitList.add(cherry);
            Fruit mango = new Fruit("Mango", R.drawable.mango_pic);
            fruitList.add(mango);
        }
    }
}
```

### RecyclerView

增强版的 ListView。

首先在 build.gradle 添加依赖库（查看 sdk/extra 目录下支持的版本）：

```java
compile 'com.android.support:recyclerview-v7:26.0.0-alpha1'
```

在布局中加入 RecyclerView 控件：

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <android.support.v7.widget.RecyclerView
        android:id="@+id/recycler_view"
        android:layout_width="match_parent"
        android:layout_height="match_parent"/>
</LinearLayout>
```

适配器类：

```java
public class FruitAdapter extends Adapter<FruitAdapter.ViewHolder> {
    private List<Fruit> fruitList;

    static class ViewHolder extends RecyclerView.ViewHolder {
        View view;
        ImageView fruitImage;
        TextView fruitName;

        public ViewHolder(View itemView) {
            super(itemView);
            view = itemView;
            fruitImage = itemView.findViewById(R.id.fruit_image);
            fruitName = itemView.findViewById(R.id.fruit_name);
        }
    }

    @Override
    public int getItemCount() {
        return fruitList.size();
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.fruit_item, parent, false);
        final ViewHolder viewHolder = new ViewHolder(view);
        viewHolder.fruitImage.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View view) {
                int position = viewHolder.getAdapterPosition();
                Fruit fruit = fruitList.get(position);
                Toast.makeText(view.getContext(), "you clicked image " + fruit.getName(), Toast.LENGTH_SHORT).show();
            }
        });

        viewHolder.fruitName.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View view) {
                int position = viewHolder.getAdapterPosition();
                Fruit fruit = fruitList.get(position);
                Toast.makeText(view.getContext(), "you clicked name " + fruit.getName(), Toast.LENGTH_SHORT).show();
            }
        });
        return viewHolder;
    }

    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        Fruit fruit = fruitList.get(position);
        holder.fruitName.setText(fruit.getName());
        holder.fruitImage.setImageResource(fruit.getImageId());
    }

    public FruitAdapter(List<Fruit> fruits) {
        fruitList = fruits;
    }
}
```

MainActivity

```java
public class MainActivity extends AppCompatActivity {

    private List<Fruit> fruitList = new ArrayList<Fruit>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        initFruits(); // 初始化水果数据
        FruitAdapter adapter = new FruitAdapter(MainActivity.this, R.layout.fruit_item, fruitList);
        ListView listView = (ListView) findViewById(R.id.list_view);
        listView.setAdapter(adapter);
        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view,
                                    int position, long id) {
                Fruit fruit = fruitList.get(position);
                Toast.makeText(MainActivity.this, fruit.getName(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void initFruits() {
        ...
    }
}
```

横向滚动，修改 fruit_item.xml：

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical"
    android:layout_width="100dp"
    android:layout_height="wrap_content" >

    <ImageView
        android:id="@+id/fruit_image"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center_horizontal"/>

    <TextView
        android:id="@+id/fruit_name"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center_horizontal"
        android:layout_marginTop="10dp"/>

</LinearLayout>
```

修改 LinearLayoutManager 的排列方向：

```java
public class MainActivity extends AppCompatActivity {

    private List<Fruit> fruitList = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        initFruits();
        RecyclerView recyclerView = (RecyclerView) findViewById(R.id.recycler_view);
        LinearLayoutManager layoutManager = new LinearLayoutManager(this);
        layoutManager.setOrientation(LinearLayoutManager.HORIZONTAL);//设置布局横向排列
        recyclerView.setLayoutManager(layoutManager);
        FruitAdapter adapter = new FruitAdapter(fruitList);
        recyclerView.setAdapter(adapter);
    }
    ...
}
```

ListView 的布局排列由自己去管理，RecyclerView 是通过 LayoutManager 来管理的。LayoutManager中制定了一套可扩展的布局排列接口，子类只要按照它的规范来实现，就能制定各种不同排列的布局。

#### 点击事件

给子项具体的 View 注册点击事件。

```java
    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.fruit_item, parent, false);
        final ViewHolder viewHolder = new ViewHolder(view);
        viewHolder.fruitImage.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View view) {
                int position = viewHolder.getAdapterPosition();
                Fruit fruit = fruitList.get(position);
                Toast.makeText(view.getContext(), "you clicked image " + fruit.getName(), Toast.LENGTH_SHORT).show();
            }
        });
        return viewHolder;
    }
```

### 聊天应用

build.gradle 添加依赖库：

`compile 'com.android.support:recyclerview-v7:26.0.0-alpha1'`

主界面 activity_main.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#d8e0e8" >

    <android.support.v7.widget.RecyclerView
        android:id="@+id/msg_recycler_view"
        android:layout_width="match_parent"
        android:layout_height="0dp"
        android:layout_weight="1" />

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content" >

        <EditText
            android:id="@+id/input_text"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:hint="Type something here"
            android:maxLines="2" />

        <Button
            android:id="@+id/send"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Send" />

    </LinearLayout>

</LinearLayout>
```

RecyclerView 子项的布局 msg_item.xml：

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:padding="10dp" >

    <LinearLayout
        android:id="@+id/left_layout"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="left"
        android:background="@drawable/message_left" >

        <TextView
            android:id="@+id/left_msg"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_gravity="center"
            android:layout_margin="10dp"
            android:textColor="#fff" />

    </LinearLayout>

    <LinearLayout
        android:id="@+id/right_layout"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="right"
        android:background="@drawable/message_right" >

        <TextView
            android:id="@+id/right_msg"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_gravity="center"
            android:layout_margin="10dp" />

    </LinearLayout>

</LinearLayout>
```

RecyclerView 的适配器类 MsgAdapter

```java
public class MsgAdapter extends RecyclerView.Adapter<MsgAdapter.ViewHolder> {

    private List<Msg> msgList;

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.msg_item, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        Msg msg = msgList.get(position);
        if (msg.getType() == Msg.TYPE_RECEIVE) {
            holder.leftLayout.setVisibility(View.VISIBLE);
            holder.rightLayout.setVisibility(View.GONE);
            holder.leftMsg.setText(msg.getContent());
        } else if (msg.getType() == Msg.TYPE_SEND) {
            holder.leftLayout.setVisibility(View.GONE);
            holder.rightLayout.setVisibility(View.VISIBLE);
            holder.rightMsg.setText(msg.getContent());
        }
    }

    @Override
    public int getItemCount() {
        return msgList.size();
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        LinearLayout leftLayout;
        LinearLayout rightLayout;
        TextView leftMsg;
        TextView rightMsg;

        public ViewHolder(View itemView) {
            super(itemView);
            leftLayout = itemView.findViewById(R.id.left_layout);
            rightLayout = itemView.findViewById(R.id.right_layout);
            leftMsg = itemView.findViewById(R.id.left_msg);
            rightMsg = itemView.findViewById(R.id.right_msg);
        }
    }

    public MsgAdapter(List<Msg> msgs) {
        msgList = msgs;
    }
}
```

MainActivity 中添加按钮监听和数据初始化：

```java
public class MainActivity extends AppCompatActivity {

    private List<Msg> msgList = new ArrayList<>();
    private EditText inputText;
    private Button send;
    private RecyclerView msgRecyclerView;
    private MsgAdapter msgAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        initMsgs();
        inputText = (EditText) findViewById(R.id.input_text);
        send = (Button) findViewById(R.id.send);
        msgRecyclerView = (RecyclerView) findViewById(R.id.msg_recycler_view);
        LinearLayoutManager layoutManager = new LinearLayoutManager(this);
        msgRecyclerView.setLayoutManager(layoutManager);
        msgAdapter = new MsgAdapter(msgList);
        msgRecyclerView.setAdapter(msgAdapter);
        send.setOnClickListener(new RecyclerView.OnClickListener() {

            @Override
            public void onClick(View view) {
                String content = inputText.getText().toString();
                if (!"".equals(content)) {
                    Msg msg = new Msg(content, Msg.TYPE_SEND);
                    msgList.add(msg);
                    msgAdapter.notifyItemChanged(msgList.size() - 1);//刷新显示
                    msgRecyclerView.scrollToPosition(msgList.size() - 1);//将RecyclerView定位到最后一行
                    inputText.setText("");//清空输入框内容
                }
            }
        });
    }

    private void initMsgs() {
        Msg msg1 = new Msg("Hello guy.", Msg.TYPE_RECEIVE);
        msgList.add(msg1);
        Msg msg2 = new Msg("Hello. Who is that?", Msg.TYPE_SEND);
        msgList.add(msg2);
        Msg msg3 = new Msg("This is Tom. Nice talking to you. ", Msg.TYPE_RECEIVE);
        msgList.add(msg3);
    }
}
```



## 手机多媒体

### 通知

通知可以在活动创建，也可以在广播接收器和服务创建。活动中创建通知比较少，一般是程序在后台才需要创建通知。
创建 NotificationTest 项目，修改 activity_main.xml：

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical" android:layout_width="match_parent"
    android:layout_height="match_parent">

    <Button
        android:id="@+id/send_notice"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="send notice"/>
</LinearLayout>
```

点击按钮发送通知，MainActivity 代码如下：

```java
public class MainActivity extends AppCompatActivity implements View.OnClickListener {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Button btn = findViewById(R.id.send_notice);
        btn.setOnClickListener(this);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.send_notice:
                NotificationManager manager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
                Notification n = new NotificationCompat.Builder(this)
                        .setContentTitle("title")
                        .setContentText("text")
                        .setWhen(System.currentTimeMillis())
                        .setSmallIcon(R.mipmap.ic_launcher)
                        .setLargeIcon(BitmapFactory.decodeResource(getResources(), R.mipmap.ic_launcher))
                        .build();
                manager.notify(1, n);//1是id
                break;
            default:
                break;
        }
    }
}
```

实现点击通知的效果，使用 PendingIntent（延迟执行的 Intent）。
新建 NotificationActivity，修改布局文件：

```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_centerInParent="true"
        android:textSize="24sp"
        android:text="notification layout"/>
</RelativeLayout>
```

修改 MainActivity 代码：

```java
public class Main2Activity extends AppCompatActivity implements View.OnClickListener {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main2);
        Button btn = findViewById(R.id.send_notice);
        btn.setOnClickListener(this);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.send_notice:
                Intent intent = new Intent(this, NotificationActivity.class);
                PendingIntent pi = PendingIntent.getActivity(this, 0, intent, 0);
                NotificationManager manager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
                Notification n = new NotificationCompat.Builder(this)
                        .setContentTitle("title")
                        .setContentText("text")
                        .setWhen(System.currentTimeMillis())
                        .setSmallIcon(R.mipmap.ic_launcher)
                        .setLargeIcon(BitmapFactory.decodeResource(getResources(), R.mipmap.ic_launcher))
                        .setContentIntent(pi)
                        .setAutoCancel(true)
                        .build();
                manager.notify(1, n);//1是id
                break;
            default:
                break;
        }
    }
}
```

通知时震动：

```java
                Notification n = new NotificationCompat.Builder(this)
                        //...
                        .setVibrate(new long[] {0, 1000, 1000, 1000})
                        .build();

```

控制震动需要申请权限：

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.tyson.notificationtest">
    ...
    <uses-permission android:name="android.permission.VIBRATE"/>
</manifest>

```

控制 led 闪烁：

```java
setLights(Color.GREEN, 1000, 1000)

```

使用默认效果：

```java
setDefaults(NotificationCompat.DEFAULT_ALL)

```

长文本通知会使用省略号代替，setStyle 实现通知显示长文字：

```java
setStyle(new NotificationCompat.BigTextStyle().bigText("emm emm emm emm emm emm emm emm emm emm"))

```

通知显示大图片，res/drawable 目录下放 demo.png。

```java
setStyle(new NotificationCompat.BigPictureStyle().bigPicture(BitmapFactory.decodeResource(getResources(), R.drawable.demo)))

```

#### 摄像头拍照

新建 CameraAlbumTest 项目，修改 activity_main.xml 代码：

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <Button
        android:id="@+id/take_photo"
        android:layout_height="wrap_content"
        android:layout_width="wrap_content"
        android:text="take photo"/>

    <ImageView
        android:id="@+id/picture"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center_horizontal"/>
</LinearLayout>

```

MainActivity 代码：

```java
public class MainActivity extends AppCompatActivity {

    public static final int TAKE_PHOTO = 1;

    private ImageView picture;

    private Uri imageUri;

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        switch (requestCode) {
            case TAKE_PHOTO:
                if (resultCode == RESULT_OK) {
                    try {
                        Bitmap bitmap = BitmapFactory.decodeStream(getContentResolver()
                                .openInputStream(imageUri));
                        picture.setImageBitmap(bitmap);
                    } catch (FileNotFoundException e) {
                        e.printStackTrace();
                    }
                }
                break;
            default:
                break;
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Button takePhoto = findViewById(R.id.take_photo);
        picture = findViewById(R.id.picture);
        takePhoto.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View v) {
                //sd卡存放当前应用缓存数据的位置
                File outputImage = new File(getExternalCacheDir(), "output_image.jpg");
                try {
                    if (outputImage.exists()) {
                        outputImage.delete();
                    }
                    outputImage.createNewFile();
                } catch (IOException e) {
                    e.printStackTrace();
                }
                if (Build.VERSION.SDK_INT >= 24) {
                    //第一个参数是context，第二个参数是任意唯一的字符串，与AndroidManifest.xml中android:authorities保持一致
                    //FileProvider对数据进行保护，选择性将封装过的uri共享给外部，提高应用的安全性
                    imageUri = FileProvider.getUriForFile(MainActivity.this,
                            "com.tyson.cameraalbumtest", outputImage);
                } else {
                    imageUri = Uri.fromFile(outputImage);
                }
                //启动相机程序，隐式intent
                Intent intent = new Intent("android.media.action.IMAGE_CAPTURE");
                intent.putExtra(MediaStore.EXTRA_OUTPUT, imageUri);
                startActivityForResult(intent, TAKE_PHOTO);
            }
        });
    }
}

```

在 AndroidManifest.xml 对内容提供器进行注册：

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.tyson.camaraalbumtest">

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">
        <activity android:name=".MainActivity">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />

                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
        <provider
            android:authorities="com.tyson.camaraalbumtest"
            android:name="androidx.core.content.FileProvider"
            android:exported="false"
            android:grantUriPermissions="true">
            <meta-data
                android:name="android.support.FILE_PROVIDER_PATHS"
                android:resource="@xml/file_paths"/>
        </provider>
    </application>
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
</manifest>

```

新建 /res/xml/file_paths.xml：

```xml
<?xml version="1.0" encoding="utf-8"?>
<paths xmlns:android="http://schemas.android.com/apk/res/android">
    <external-path
        name="my_images"
        path="."/>
</paths>

```

#### 相册选择相片

修改 activity_main.xml：

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <Button
        android:id="@+id/take_photo"
        android:layout_height="wrap_content"
        android:layout_width="wrap_content"
        android:text="take photo"/>

    <Button
        android:id="@+id/choose_from_album"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="choose from album"/>

    <ImageView
        android:id="@+id/picture"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center_horizontal"/>
</LinearLayout>

```

相册选择相片代码：

```java
public class MainActivity extends AppCompatActivity {

    public static final int TAKE_PHOTO = 1;

    public static final int CHOOSE_PHOTO = 2;

    private ImageView picture;

    private Uri imageUri;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Button takePhoto = findViewById(R.id.take_photo);
        Button chooseFromAlbum  = findViewById(R.id.choose_from_album);
        picture = findViewById(R.id.picture);
        takePhoto.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View v) {
                //sd卡存放当前应用缓存数据的位置
                File outputImage = new File(getExternalCacheDir(), "output_image.jpg");
                try {
                    if (outputImage.exists()) {
                        outputImage.delete();
                    }
                    outputImage.createNewFile();
                } catch (IOException e) {
                    e.printStackTrace();
                }
                if (Build.VERSION.SDK_INT >= 24) {
                    //第一个参数是context，第二个参数是任意唯一的字符串
                    //FileProvider对数据进行保护，选择性将封装过的uri共享给外部，提高应用的安全性
                    imageUri = FileProvider.getUriForFile(MainActivity.this,
                            "com.tyson.cameraalbumtest", outputImage);
                } else {
                    imageUri = Uri.fromFile(outputImage);
                }
                //启动相机程序
                Intent intent = new Intent("android.media.action.IMAGE_CAPTURE");
                intent.putExtra(MediaStore.EXTRA_OUTPUT, imageUri);
                startActivityForResult(intent, TAKE_PHOTO);
            }
        });
        chooseFromAlbum.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View v) {
                if (ContextCompat.checkSelfPermission(MainActivity.this,
                        Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
                    ActivityCompat.requestPermissions(MainActivity.this,
                            new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, 1);
                } else {
                    openAlbum();
                }
            }
        });
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        switch (requestCode) {
            case 1:
                if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    openAlbum();
                } else {
                    Toast.makeText(this, "permission deny", Toast.LENGTH_SHORT);
                }
                break;
            default:
                break;
        }
    }

    private void openAlbum() {
        Intent intent = new Intent("android.intent.action.GET_CONTENT");
        intent.setType("image/*");
        //打开相册选择图片，选择完照片会回到onActivityResult方法
        //进入CHOOSE_PHOTO的case处理图片
        startActivityForResult(intent, CHOOSE_PHOTO);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        switch (requestCode) {
            case TAKE_PHOTO:
                if (resultCode == RESULT_OK) {
                    try {
                        Bitmap bitmap = BitmapFactory.decodeStream(getContentResolver()
                                .openInputStream(imageUri));
                        picture.setImageBitmap(bitmap);
                    } catch (FileNotFoundException e) {
                        e.printStackTrace();
                    }
                }
                break;
            case CHOOSE_PHOTO:
                if (resultCode == RESULT_OK) {
                    //判断手机系统版本号，4.4以上版本不返回图片真实的uri，而是返回一个封装过的uri
                    //需要对uri进行处理
                    if (Build.VERSION.SDK_INT >= 19) {
                        handleImageOnKitKat(data);
                    } else {
                        handleImageBeforeKitKat(data);
                    }
                }
            default:
                break;
        }
    }

    private void handleImageBeforeKitKat(Intent data) {
        Uri uri = data.getData();
        String imgPath = getImagePath(uri, null);
        displayImage(imgPath);
    }

    @TargetApi(19)
    private void handleImageOnKitKat(Intent data) {
        String imagePath = null;
        Uri uri = data.getData();
        if (DocumentsContract.isDocumentUri(this, uri)) {
            String docId = DocumentsContract.getDocumentId(uri);
            if ("com.android.providers.media.documents".equals(uri.getAuthority())) {
                String id = docId.split(":")[1];//解析出数字格式的id
                String selection = MediaStore.Images.Media._ID + "=" + id;
                imagePath = getImagePath(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, selection);
            } else if ("com.android.providers.downloads.documents".equals(uri.getAuthority())) {
                Uri contentUri = ContentUris.withAppendedId(Uri.parse("content://downloads/public_downloads"), Long.valueOf(docId));
                imagePath = getImagePath(contentUri, null);
            }
        } else if ("content".equalsIgnoreCase(uri.getScheme())) {
            //content类型的uri，使用普通方式处理
            imagePath = getImagePath(uri, null);
        } else if ("file".equalsIgnoreCase(uri.getScheme())) {
            //file类型uri，获取图片路径即可
            imagePath = uri.getPath();
        }
        displayImage(imagePath);
    }

    private void displayImage(String imgPath) {
        if (imgPath != null) {
            Bitmap bitmap = BitmapFactory.decodeFile(imgPath);
            picture.setImageBitmap(bitmap);
        } else {
            Toast.makeText(this, "fail to get image", Toast.LENGTH_SHORT).show();
        }
    }

    private String getImagePath(Uri uri, String s){
        String path = null;
        Cursor cursor = getContentResolver().query(uri, null, s, null, null);
        if (cursor != null) {
            if (cursor.moveToFirst()) {
                path = cursor.getString(cursor.getColumnIndex(MediaStore.Images.Media.DATA));
            }
            cursor.close();
        }
        return path;
    }
}

```

#### 音频播放

新建 PlayAudioTest 项目，修改 activity_main.xml 代码：

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical" android:layout_width="match_parent"
    android:layout_height="match_parent">
    <Button
        android:id="@+id/play"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="play"/>
    <Button
        android:id="@+id/pause"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="pause"/>
    <Button
        android:id="@+id/stop"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="stop"/>
</LinearLayout>

```

修改 MainActivity 代码：

```java
public class MainActivity extends AppCompatActivity implements View.OnClickListener {

    private MediaPlayer mediaPlayer = new MediaPlayer();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Button play = findViewById(R.id.play);
        Button pause = findViewById(R.id.pause);
        Button stop = findViewById(R.id.stop);
        play.setOnClickListener(this);
        pause.setOnClickListener(this);
        stop.setOnClickListener(this);
        //播放音频文件需要申请sd卡访问权限
        if (ContextCompat.checkSelfPermission(MainActivity.this,
                Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(MainActivity.this, new String[] {
                    Manifest.permission.WRITE_EXTERNAL_STORAGE}, 1);
        } else {
            initMediaPlayer();
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        switch (requestCode) {
            case 1:
                if (grantResults.length > 0 && grantResults[0] ==
                    PackageManager.PERMISSION_GRANTED) {
                    initMediaPlayer();
                } else {
                    Toast.makeText(this, "permission deny",
                            Toast.LENGTH_SHORT).show();
                    finish();
                }
                break;
            default:
                break;
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (mediaPlayer != null) {
            mediaPlayer.stop();
            mediaPlayer.release();
        }
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.play:
                if (!mediaPlayer.isPlaying()) {
                    mediaPlayer.start();
                }
                break;
            case R.id.pause:
                if (mediaPlayer.isPlaying()) {
                    mediaPlayer.pause();
                }
                break;
            case R.id.stop:
                if (mediaPlayer.isPlaying()) {
                    mediaPlayer.reset();
                    initMediaPlayer();
                }
                break;
            default:
                break;
        }
    }

    private void initMediaPlayer() {
        try {
            //在sd卡根目录下存放有music.mp3文件
            File file = new File(Environment.getExternalStorageDirectory(), "music.mp3");
            mediaPlayer.setDataSource(file.getPath());//指定音频文件的路径
            mediaPlayer.prepare();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

```

在 AndroidManifest.xml 文件声明权限：

```xml
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
```



## 网络技术

### WebView

WebView 封装了发送 HTTP 请求、接受服务响应、解析返回数据和页面展示的过程。使用它可以在应用程序展示网页，而不用打开系统浏览器。
新建 WebViewTest 项目，修改 activity_main.xml 代码：

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <WebView
        android:id="@+id/web_view"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />
</LinearLayout>
```

MainActivity 代码：

```java
public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        WebView webView = findViewById(R.id.web_view);
        //支持javascript脚本
        webView.getSettings().setJavaScriptEnabled(true);
        //网页跳转，目标网页仍然在当前webview显示
        webView.setWebViewClient(new WebViewClient());
        webView.loadUrl("http://www.baidu.com");
    }
}
```

声明网络权限：

```xml
<uses-permission android:name="android.permission.INTERNET"/>
```

### HttpURLConnection

新建 NetworkTest 项目，修改 activity_main.xml 代码：

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <Button
        android:id="@+id/send_request"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="send request"/>

    <ScrollView
        android:layout_width="match_parent"
        android:layout_height="match_parent">
        <TextView
            android:id="@+id/response_text"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"/>
    </ScrollView>
</LinearLayout>
```

MainActivity 代码如下：

```java
public class MainActivity extends AppCompatActivity implements View.OnClickListener {

    TextView responseText;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Button sendRequest = findViewById(R.id.send_request);
        responseText = findViewById(R.id.response_text);
        sendRequest.setOnClickListener(this);
    }

    @Override
    public void onClick(View v) {
        if (v.getId() == R.id.send_request) {
            sendRequestWithHttpURLConnection();
        }
    }

    private void sendRequestWithHttpURLConnection() {
        new Thread(new Runnable() {

            @Override
            public void run() {
                HttpURLConnection connection = null;
                BufferedReader reader = null;
                try {
                    URL url = new URL("http://www.baidu.com");
                    connection = (HttpURLConnection) url.openConnection();
                    connection.setRequestMethod("GET");
                    connection.setConnectTimeout(8000);
                    connection.setReadTimeout(8000);
                    InputStream in = connection.getInputStream();
                    //读取输入流
                    reader = new BufferedReader(new InputStreamReader(in));
                    StringBuilder sb = new StringBuilder();
                    String line;
                    while ((line = reader.readLine()) != null) {
                        sb.append(line);
                    }
                    //不能在子线程进行ui操作，切换到主线程更新ui
                    showResponse(sb.toString());
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    if (reader != null) {
                        try {
                            reader.close();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                    if (connection != null) {
                        connection.disconnect();
                    }
                }
            }
        }).start();
    }
    private void showResponse(final String s) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                responseText.setText(s);
            }
        });
    }
}
```

声明网络权限：

```xml
<uses-permission android:name="android.permission.INTERNET"/>
```

### OkHttp

在 app/build.gradle 添加 OkHtttp 库依赖：

```json
dependencies {
    implementation fileTree(dir: 'libs', include: ['*.jar'])
    implementation 'androidx.appcompat:appcompat:1.1.0'
    implementation 'androidx.constraintlayout:constraintlayout:1.1.3'
    implementation 'com.squareup.okhttp3:okhttp:3.4.1'
    ....
}
```

修改 MainActivity 代码：

```java
    private void sendRequestWithHttpURLConnection() {
        new Thread(new Runnable() {

            @Override
            public void run() {
                HttpURLConnection connection = null;
                BufferedReader reader = null;
                try {
                    URL url = new URL("http://www.baidu.com");
                    connection = (HttpURLConnection) url.openConnection();
                    connection.setRequestMethod("GET");
                    connection.setConnectTimeout(8000);
                    connection.setReadTimeout(8000);
                    InputStream in = connection.getInputStream();
                    //读取输入流
                    reader = new BufferedReader(new InputStreamReader(in));
                    StringBuilder sb = new StringBuilder();
                    String line;
                    while ((line = reader.readLine()) != null) {
                        sb.append(line);
                    }
                    //不能在子线程进行ui操作，切换到主线程更新ui
                    showResponse(sb.toString());
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    if (reader != null) {
                        try {
                            reader.close();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                    if (connection != null) {
                        connection.disconnect();
                    }
                }
            }
        }).start();
    }
```

### HttpUtil

将通用的网络操作提取到一个公共类。

```java
public class HttpUtil {
    public static void sendOkHttpRequest(String address, Callback callback) {
        OkHttpClient client = new OkHttpClient();
        Request request = new Request.Builder()
                .url(address)
                .build();
        //enqueue内部会开子线程执行HTTP请求，最后回调callback
        client.newCall(request).enqueue(callback);
    }
}
```

方法调用：

```java
            HttpUtil.sendOkHttpRequest("http://www.baidu.com",
                    new Callback() {
                        @Override
                        public void onFailure(Call call, IOException e) {
                            Log.e(TAG, e.getMessage());
                        }

                        @Override
                        public void onResponse(Call call, Response response) throws IOException {
                        showResponse(response.body().string());
                        }
            });
```



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

