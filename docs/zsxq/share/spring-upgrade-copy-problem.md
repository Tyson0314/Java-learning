最近内部组件升级到spring5.3.x的时候对象拷贝内容不全，定位分析总结如下（可直接拉到最后看结论和解决办法）：

**1.现象:**

源对象的类里有个内部类的成员变量，是List类型，，List的元素类型是自己的内部静态类

目标对象的类里有个内部类的成员变量，也是List类型，List的元素类型是自己的内部静态类

源对象的代码示例如下（省略了get set方法）：

```java
/**
 * 源对象
 * @author dabin
 *
 */
public class Rsp_07300240_01 {
    private int totals;
    private List<Contract> contracts;//合同列表
    static public class Contract{
        private String constractId;//合同编号
        private String constractName;//合同名称
        private String type;//合同类型
        private String fileId;//fps文件id
        private String fileHash;//fps文件hash
        @Override
        public String toString() {
            StringBuilder builder = new StringBuilder();
            builder.append("Rsp_07300240_01.Contract [constractId=");
            builder.append(constractId);
            builder.append(", constractName=");
            builder.append(constractName);
            builder.append(", type=");
            builder.append(type);
            builder.append(", fileId=");
            builder.append(fileId);
            builder.append(", fileHash=");
            builder.append(fileHash);
            builder.append("]");
            return builder.toString();
        }
    }
}
```

目标对象的代码示例如下（省略了get set方法）：

```java
public class Rsp_04301099_01 {
    @RmbField(seq = 1, title = "总条数")
    private int totals;
    @RmbField(seq = 2, title = "合同列表")
    // 这里是自己的内部类
    private List<Contract> contracts;// 合同列表
    static public class Contract{
        private String constractId;//合同编号
        private String constractName;//合同名称
        private String type;//合同类型
        private String fileId;//fps文件id
        private String fileHash;//fps文件hash
@Override
        public String toString() {
            StringBuilder builder = new StringBuilder();
            builder.append("Rsp_04301099_01.Contract [constractId=");
            builder.append(constractId);
            builder.append(", constractName=");
            builder.append(constractName);
            builder.append(", type=");
            builder.append(type);
            builder.append(", fileId=");
            builder.append(fileId);
            builder.append(", fileHash=");
            builder.append(fileHash);
            builder.append("]");
            return builder.toString();
        }
    }
}
```

单元测试验证代码如下：

```java
public class SpringBeanCopyUtilTest {
    @Test
    public void testBeanCopy() {
        Rsp_07300240_01 orgResp = new Rsp_07300240_01();
        orgResp.setTotals(100);
        List<Rsp_07300240_01.Contract> contracts = new ArrayList<>();
        Rsp_07300240_01.Contract cc = new Rsp_07300240_01.Contract();
        cc.setConstractId("aaa");
        contracts.add(cc);
        orgResp.setContracts(contracts);
        Rsp_04301099_01 destResp = new Rsp_04301099_01();
        System.out.println("源对象的值:" + orgResp);
        System.out.println("复制前的值:" + destResp);
        BeanUtils.copyProperties(orgResp, destResp);
        System.out.println("Spring版本" + BeanUtils.class.getPackage().getImplementationVersion());
        System.out.println("复制后的值:" + destResp);
//        if (destResp.getContracts() != null && destResp.getContracts().size() > 0) {
//            System.out.println("复制后的list成员类型是:" + destResp.getContracts().get(0));
//        }
    }
}
```

分别依赖spring 5.2.4和5.3.9版本，运行结果如下：

```java
源对象的值:Rsp_07300240_01 [totals=100, contracts=[Rsp_07300240_01.Contract [constractId=aaa, constractName=null, type=null, fileId=null, fileHash=null]]]
复制前的值:Rsp_04301099_01 [totals=0, contracts=null]

Spring版本5.2.4.RELEASE
复制后的值:Rsp_04301099_01 [totals=100, contracts=[Rsp_07300240_01.Contract [constractId=aaa, constractName=null, type=null, fileId=null, fileHash=null]]]

Spring版本5.3.9
复制后的值:Rsp_04301099_01 [totals=100, contracts=null]
```

**2.分析**

可以看到在依赖spring 5.3.x的时候，contracts的值是没有复制过来的。

但是也可以看到在依赖spring 5.2.x的时候，contracts的值是直接设置的引用，List的成员变量类型是 Rsp_07300240_01.Contract，Rsp_04301099_01.Contract。

这个其实也是有问题的。但是为啥在业务逻辑中没有暴雷呢？

经核实，业务代码中，是在返回应答对象之前执行的 org.springframework.beans.BeanUtils.copyProperties 操作，执行完之后，立即返回了对象，然后内部使用的框架，直接使用jackson进行系列化，此时类型信息已经擦除，不涉及类型转换，所以正常生成了json字符串。

而上面示例中被注释的代码里，如果启用的话，测试的时候就会立即报错，提示类型转换异常。

对比代码可以发现：

![](https://article-images.zsxq.com/FvjCdaKbUj3E3fLVKRkvtve2yIa6)

经过一番搜索，原来是在2019年的时候就有人向Spring社区提了bug，然后spring增加了泛型判断逻辑，杜绝了错误的赋值，在5.3.x中修复了这个bug。

https://github.com/spring-projects/spring-framework/issues/24187

由于平时大部分使用场景都是执行BeanUtils.copyProperties后立即取出里面的对象进行操作，这种情况下，就会提前触发bug，然后调用方自己想办法规避掉spring bug。

恰好内部使用的xx框架在BeanUtils.copyProperties之后没有显式的操作成员对象，因此一直没有触发bug，直到升级到spring 5.3.x时才暴雷。

**3.解决办法：**

先回退版本，然后检视所有调用BeanUtils.copyProperties的地方，针对触发bug的这种场景优化代码，比如把两个内部静态class合并使用一个公共的class。