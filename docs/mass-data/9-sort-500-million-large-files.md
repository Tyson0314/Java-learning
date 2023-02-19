---
sidebar: heading
title: 5亿个数的大文件怎么排序？
category: 海量数据
tag:
  - 海量数据
head:
  - - meta
    - name: keywords
      content: 海量数据面试题,5亿个数排序,海量数据
  - - meta
    - name: description
      content: 海量数据常见面试题总结，让天下没有难背的八股文！
---

## **问题**

给你1个文件`bigdata`，大小4663M，5亿个数，文件中的数据随机，一行一个整数：

```bash
6196302
3557681
6121580
2039345
2095006
1746773
7934312
2016371
7123302
8790171
2966901
...
7005375
```

现在要对这个文件进行排序，怎么做？

## 内部排序

先尝试内排，选2种排序方式：

### 3路快排：

```java
private final int cutoff = 8;

public <T> void perform(Comparable<T>[] a) {
		perform(a,0,a.length - 1);
	}

	private <T> int median3(Comparable<T>[] a,int x,int y,int z) {
		if(lessThan(a[x],a[y])) {
			if(lessThan(a[y],a[z])) {
				return y;
			}
			else if(lessThan(a[x],a[z])) {
				return z;
			}else {
				return x;
			}
		}else {
			if(lessThan(a[z],a[y])){
				return y;
			}else if(lessThan(a[z],a[x])) {
				return z;
			}else {
				return x;
			}
		}
	}

	private <T> void perform(Comparable<T>[] a,int low,int high) {
		int n = high - low + 1;
		//当序列非常小，用插入排序
		if(n <= cutoff) {
			InsertionSort insertionSort = SortFactory.createInsertionSort();
			insertionSort.perform(a,low,high);
			//当序列中小时，使用median3
		}else if(n <= 100) {
			int m = median3(a,low,low + (n >>> 1),high);
			exchange(a,m,low);
			//当序列比较大时，使用ninther
		}else {
			int gap = n >>> 3;
			int m = low + (n >>> 1);
			int m1 = median3(a,low,low + gap,low + (gap << 1));
			int m2 = median3(a,m - gap,m,m + gap);
			int m3 = median3(a,high - (gap << 1),high - gap,high);
			int ninther = median3(a,m1,m2,m3);
			exchange(a,ninther,low);
		}

		if(high <= low)
			return;
		//lessThan
		int lt = low;
		//greaterThan
		int gt = high;
		//中心点
		Comparable<T> pivot =  a[low];
		int i = low + 1;

		/*
		* 不变式：
		*	a[low..lt-1] 小于pivot -> 前部(first)
		*	a[lt..i-1] 等于 pivot -> 中部(middle)
		*	a[gt+1..n-1] 大于 pivot -> 后部(final)
		*
		*	a[i..gt] 待考察区域
		*/

		while (i <= gt) {
			if(lessThan(a[i],pivot)) {
				//i-> ,lt ->
				exchange(a,lt++,i++);
			}else if(lessThan(pivot,a[i])) {
				exchange(a,i,gt--);
			}else{
				i++;
			}
		}

		// a[low..lt-1] < v = a[lt..gt] < a[gt+1..high].
		perform(a,low,lt - 1);
		perform(a,gt + 1,high);
	}
```

### 归并排序：

```java
	/**
	 * 小于等于这个值的时候，交给插入排序
	 */
	private final int cutoff = 8;

	/**
	 * 对给定的元素序列进行排序
	 *
	 * @param a 给定元素序列
	 */
	@Override
	public <T> void perform(Comparable<T>[] a) {
		Comparable<T>[] b = a.clone();
		perform(b, a, 0, a.length - 1);
	}

	private <T> void perform(Comparable<T>[] src,Comparable<T>[] dest,int low,int high) {
		if(low >= high)
			return;
			
		//小于等于cutoff的时候,交给插入排序
		if(high - low <= cutoff) {
			SortFactory.createInsertionSort().perform(dest,low,high);
			return;
		}

		int mid = low + ((high - low) >>> 1);
		perform(dest,src,low,mid);
		perform(dest,src,mid + 1,high);

		//考虑局部有序 src[mid] <= src[mid+1]
		if(lessThanOrEqual(src[mid],src[mid+1])) {
			System.arraycopy(src,low,dest,low,high - low + 1);
		}

		//src[low .. mid] + src[mid+1 .. high] -> dest[low .. high]
		merge(src,dest,low,mid,high);
	}
	
	private <T> void merge(Comparable<T>[] src,Comparable<T>[] dest,int low,int mid,int high) {

		for(int i = low,v = low,w = mid + 1; i <= high; i++) {
			if(w > high || v <= mid && lessThanOrEqual(src[v],src[w])) {
				dest[i] = src[v++];
			}else {
				dest[i] = src[w++];
			}
		}
	}
```

数据太多，递归太深，会导致栈溢出。数据太多，数组太长，会导致OOM。

可见这两种方式不适用。

## 位图法

BitMap算法的核心思想是用bit数组来记录0-1两种状态，然后再将具体数据映射到这个比特数组的具体位置，这个比特位设置成0表示数据不存在，设置成1表示数据存在。

BitMap算在在大量数据查询、去重等应用场景中使用的比较多，这个算法具有比较高的空间利用率。

实现代码如下：

```csharp
private BitSet bits;

public void perform(
    String largeFileName,
    int total,
    String destLargeFileName,
    Castor<Integer> castor,
    int readerBufferSize,
    int writerBufferSize,
    boolean asc) throws IOException {

    System.out.println("BitmapSort Started.");
    long start = System.currentTimeMillis();
    bits = new BitSet(total);
    InputPart<Integer> largeIn = PartFactory.createCharBufferedInputPart(largeFileName, readerBufferSize);
    OutputPart<Integer> largeOut = PartFactory.createCharBufferedOutputPart(destLargeFileName, writerBufferSize);
    largeOut.delete();

    Integer data;
    int off = 0;
    try {
        while (true) {
            data = largeIn.read();
            if (data == null)
                break;
            int v = data;
            set(v);
            off++;
        }
        largeIn.close();
        int size = bits.size();
        System.out.println(String.format("lines : %d ,bits : %d", off, size));

        if(asc) {
            for (int i = 0; i < size; i++) {
                if (get(i)) {
                    largeOut.write(i);
                }
            }
        }else {
            for (int i = size - 1; i >= 0; i--) {
                if (get(i)) {
                    largeOut.write(i);
                }
            }
        }

        largeOut.close();
        long stop = System.currentTimeMillis();
        long elapsed = stop - start;
        System.out.println(String.format("BitmapSort Completed.elapsed : %dms",elapsed));
    }finally {
        largeIn.close();
        largeOut.close();
    }
}

private void set(int i) {
    bits.set(i);
}

private boolean get(int v) {
    return bits.get(v);
}
```

## 外部排序

什么是外部排序？

> 1. 内存极少的情况下，利用分治策略，利用外存保存中间结果，再用多路归并来排序;

实现原理如下：

![](http://img.topjavaer.cn/img/5亿个数大文件排序2.png)

**1.分成有序的小文件**

内存中维护一个极小的核心缓冲区`memBuffer`，将大文件`bigdata`按行读入，搜集到`memBuffer`满或者大文件读完时，对`memBuffer`中的数据调用内排进行排序，排序后将**有序结果**写入磁盘文件`bigdata.xxx.part.sorted`.
循环利用`memBuffer`直到大文件处理完毕，得到n个有序的磁盘文件：

![](http://img.topjavaer.cn/img/5亿个数大文件排序3.png)

**2.合并成1个有序的大文件**

现在有了n个有序的小文件，怎么合并成1个有序的大文件？

利用如下原理进行归并排序：

![](http://img.topjavaer.cn/img/5亿个数大文件排序1.png)

举个简单的例子：

> 文件1：**3**,6,9。
> 文件2：**2**,4,8。
> 文件3：**1**,5,7。
>
> 第一回合：
> 文件1的最小值：3 , 排在文件1的第1行。
> 文件2的最小值：2，排在文件2的第1行。
> 文件3的最小值：1，排在文件3的第1行。
> 那么，这3个文件中的最小值是：min(1,2,3) = 1。
> 也就是说，最终大文件的当前最小值，是文件1、2、3的当前最小值的最小值。
> 上面拿出了最小值1，写入大文件。

> 第二回合：
> 文件1的最小值：3 , 排在文件1的第1行。
> 文件2的最小值：2，排在文件2的第1行。
> 文件3的最小值：5，排在文件3的第2行。
> 那么，这3个文件中的最小值是：min(5,2,3) = 2。
> 将2写入大文件。
>
> 也就是说，最小值属于哪个文件，那么就从哪个文件当中取下一行数据。（因为小文件内部有序，下一行数据代表了它当前的最小值）

感兴趣的小伙伴可以自己尝试去实现下~
