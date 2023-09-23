# 由“ YYYY-MM-dd ”引发的bug

跟大家分享网上看到的一篇文章。

## 前言

在使用一些 App 的时候，竟然被我发现了一个应该是由于前端粗心而导致的 bug，在 2019.12.30 出发，结果 App 上显示的是 2020.12.30（吓得我以为我的订单下错了，此处是不是该把程序员拉去祭天了）。

鉴于可能会有程序员因此而被拉去祭天，而我以前学 Java 的时候就有留意过这个问题，所以我还是把这个问题拿出来说一下，希望能尽量避免这方面的粗心大意（毕竟这种问题也很难测出来）。

## 正文

```java
public class DateTest {
 public static void main(String[] args) {
     Calendar calendar = Calendar.getInstance();
     calendar.set(2019, Calendar.AUGUST, 31);
     Date strDate = calendar.getTime();
     DateFormat formatUpperCase = new SimpleDateFormat("yyyy-MM-dd");
     System.out.println("2019-08-31 to yyyy-MM-dd: " + formatUpperCase.format(strDate));
     formatUpperCase = new SimpleDateFormat("YYYY-MM-dd");
     System.out.println("2019-08-31 to YYYY/MM/dd: " + formatUpperCase.format(strDate));
 }
}
```

我们来看下运行结果：

```
2019-08-31 to yyyy-MM-dd: 2019-08-31
2019-08-31 to YYYY/MM/dd: 2019-08-31
```

如果我们日期改成 12.31：

```
2019-12-31 to yyyy-MM-dd: 2019-12-31
2019-12-31 to YYYY-MM-dd: 2020-12-31
```

问题就出现了是吧，虽然是一个小小的细节，但是用户看了也会一脸懵，但是我们作为开发者，不能懵啊，赶紧文档查起来：

![](http://img.topjavaer.cn/img/202309081043248.png)

y：year-of-era；正正经经的年，即元旦过后；

Y：week-based-year；只要本周跨年，那么这周就算入下一年；就比如说今年(2019-2020) 12.31 这一周是跨年的一周，而 12.31 是周二，那使用 YYYY 的话会显示 2020，使用 yyyy 则会从 1.1 才开始算是 2020。

这虽然是个很小的知识点，但是也有很多人栽到坑里，在此记录一下~