import {navbar} from "vuepress-theme-hope";

export default navbar([

    //"/",
    //"/home",
    {
        text: "主页",
        link: "/",
        icon: "home",
    },
    //{
    //    text: "校招",
    //    icon: "campus",
    //    children: [
	//		{text: "校招分享", link: "/campus-recruit/share"},
    //        {text: "简历应该这么写", link: "/campus-recruit/resume.md"},
    //        {text: "项目经验介绍", link: "/campus-recruit/project-experience.md"},
    //        {text: "编程语言", link: "/campus-recruit/program-language"},
	//		{text: "面经总结", link: "/campus-recruit/interview/"},
	//		{text: "秋招内推", link: "https://docs.qq.com/sheet/DYW9ObnpobXNRTXpq"},
    //    ],
    //},
    {
       text: "学习圈",
       icon: "zsxq",
       link: "/zsxq/introduce.md",
    },
    {
        text: "面试指南",
        icon: "java",
        children: [
			{
				text: "Java",
				children: [
					{text: "基础", link: "/java/java-basic.md", icon: "jihe"},
					{text: "集合", link: "/java/java-collection.md", icon: "fuwuqi"},
					{text: "并发", link: "/java/java-concurrent.md", icon: "bingfa"},
					{text: "JVM", link: "/java/jvm.md", icon: "xuniji"},
					{text: "Java8", link: "/java/java8", icon: "java"},
					{text: "Tomcat", link: "/web/tomcat.md", icon: "TOMCAT"},
				]
			},
            {
                text: "框架",
                children: [
                    {text: "Spring面试题", link: "/framework/spring.md", icon: "bxl-spring-boot"},
                    {text: "SpringMVC面试题", link: "/framework/springmvc.md", icon: "pingtai"},
                    {text: "Mybatis面试题", link: "/framework/mybatis.md", icon: "wendang"},
                    {text: "SpringBoot面试题", link: "/framework/springboot.md", icon: "bxl-spring-boot"},
                    {text: "SpringCloud详解", link: "/framework/springcloud/", icon: "jihe"},
                    {text: "SpringCloud面试题", link: "/framework/springcloud-interview.md", icon: "yun"},
                    {text: "ZooKeeper面试题", link: "/zookeeper/zk.md", icon: "Zookeeper"},
                    {text: "Netty详解", link: "/framework/netty/", icon: "fuwuqi"},
                ]
            },
            {
                text: "消息队列",
                children: [
                    {text: "消息队列面试题", link: "/message-queue/mq.md", icon: "xiaoxiduilie"},
                    {text: "RabbitMQ面试题", link: "/message-queue/rabbitmq.md", icon: "amqpxiaoxiduilie"},
                    {text: "Kafka面试题", link: "/message-queue/kafka.md", icon: "Kafka"},
                ]
            },
            {
                text: "关系型数据库",
                children: [
                    //{text: "MySQL基础", children: ["/database/mysql-basic/"],},
                    {text: "MySQL基础", link: "/database/mysql-basic/", icon: "jihe"},
                    {text: "MySQL面试题", link: "/database/mysql.md", icon: "mysql"},
                    {text: "MySQL执行计划详解", link: "/database/mysql-execution-plan.md", icon: "chayan"},
                ]
            },
            {
                text: "非关系型数据库",
                children: [
                    {text: "Redis基础", link: "/redis/redis-basic/", icon: "jihe"},
                    {text: "Redis面试题", link: "/redis/redis.md", icon: "Redis"},
                    {text: "MongoDB面试题", link: "/database/mongodb.md", icon: "MongoDB"},
                    {text: "ElasticSearch面试题", link: "https://mp.weixin.qq.com/s/Ffb8NDgavf9QAWYBm0qAVg", icon: "elastic"},
                ]
            },
			{
				text: "计算机基础",
				icon: "computer",
				children: [
					{text: "网络", link: "/computer-basic/network.md", icon: "wangluo3"},
                    {text: "TCP专题", link: "/computer-basic/tcp.md", icon: "wangluo1"},
					{text: "操作系统", link: "/computer-basic/operate-system.md", icon: "os"},
					{text: "算法", link: "/computer-basic/algorithm.md", icon: "suanfa"},
					{text: "LeetCode题解", link: "/leetcode/hot120", icon: "leetcode"},
					{text: "数据结构", link: "/computer-basic/data-structure.md", icon: "datastruct"},
					//{
					//    text: "关系型数据库",
					//    children: [
					//        //{text: "MySQL基础", children: ["/database/mysql-basic/"],},
					//        {text: "MySQL基础", link: "/database/mysql-basic/"},
					//        {text: "MySQL面试题", link: "/database/mysql.md"},
					//        {text: "MySQL执行计划详解", link: "/database/mysql-execution-plan.md"},
					//    ]
					//},
					//{
					//    text: "非关系型数据库",
					//    children: [
					//        {text: "Redis基础", link: "/redis/redis-basic/"},
					//        {text: "Redis面试题", link: "/redis/redis.md"},
					//        {text: "ElasticSearch面试题", link: "https://mp.weixin.qq.com/s/Ffb8NDgavf9QAWYBm0qAVg"},
					//    ]
					//},
				]
			},
		]
	},
    //{
    //    text: "计算机基础",
    //    icon: "computer",
    //    children: [
    //        {text: "网络", link: "/computer-basic/network.md"},
    //        {text: "操作系统", link: "/computer-basic/operate-system.md"},
    //        {text: "算法", link: "/computer-basic/algorithm.md"},
	//		{text: "LeetCode题解", link: "/leetcode/hot120"},
    //        {text: "数据结构", link: "/computer-basic/data-structure.md"},
    //        //{
    //        //    text: "关系型数据库",
    //        //    children: [
    //        //        //{text: "MySQL基础", children: ["/database/mysql-basic/"],},
    //        //        {text: "MySQL基础", link: "/database/mysql-basic/"},
    //        //        {text: "MySQL面试题", link: "/database/mysql.md"},
    //        //        {text: "MySQL执行计划详解", link: "/database/mysql-execution-plan.md"},
    //        //    ]
    //        //},
    //        //{
    //        //    text: "非关系型数据库",
    //        //    children: [
    //        //        {text: "Redis基础", link: "/redis/redis-basic/"},
    //        //        {text: "Redis面试题", link: "/redis/redis.md"},
    //        //        {text: "ElasticSearch面试题", link: "https://mp.weixin.qq.com/s/Ffb8NDgavf9QAWYBm0qAVg"},
    //        //    ]
    //        //},
    //    ]
    //},
    {
        text: "进阶之路",
        icon: "win",
        children: [
            {
                text: "海量数据",
                children: [
                    {text: "统计不同号码的个数", link: "/mass-data/1-count-phone-num.md", icon: "phoneno"},
                    {text: "出现频率最高的100个词", link: "/mass-data/2-find-hign-frequency-word.md", icon: "datastruct"},
                    {text: "查找两个大文件共同的URL", link: "/mass-data/3-find-same-url.md", icon: "wenben"},
                    {text: "如何在100亿数据中找到中位数？", link: "/mass-data/4-find-mid-num.md", icon: "bingfa"},
                    {text: "如何查询最热门的查询串？", link: "/mass-data/5-find-hot-string.md", icon: "query"},
                    {text: "如何找出排名前 500 的数？", link: "/mass-data/6-top-500-num.md", icon: "rank"},
                    {text: "如何按照 query 的频度排序？", link: "/mass-data/7-query-frequency-sort.md", icon: "frequency"},
                    {text: "大数据中 TopK 问题的常用套路", link: "/mass-data/8-topk-template.md", icon: "bigdata"},
                ]
            },
            {
                text: "系统设计",
                //link: "/advance/system-design/README.md",
                //children: [
                //    {text: "扫码登录设计", link: "/advance/system-design/1-scan-code-login.md"},
                //	{text: "超时订单自动取消", link: "/advance/system-design/2-order-timeout-auto-cancel.md"},
                //	{text: "短链系统设计", link: "/advance/system-design/3-short-url.md"},
                //	{text: "微信红包系统如何设计？", link: "/advance/system-design/6-wechat-redpacket-design.md"},
                //	{text: "单点登录设计与实现", link: "/advance/system-design/8-sso-design.md"},
                //]
                children: [
                    {text: "扫码登录设计", link: "/advance/system-design/1-scan-code-login.md", icon: "scan"},
                    {text: "超时订单自动取消", link: "/advance/system-design/2-order-timeout-auto-cancel.md", icon: "timeout"},
                    {text: "短链系统设计", link: "/advance/system-design/README.md", icon: "lianjie"},
                    {text: "微信红包系统如何设计？", link: "/advance/system-design/README.md", icon: "hongbao"},
                    {text: "单点登录设计与实现", link: "/advance/system-design/README.md", icon: "login"},
                    {text: "如何用 Redis 统计用户访问量？", link: "/advance/system-design/README.md", icon: "visit"},
                    {text: "实时订阅推送设计与实现", link: "/advance/system-design/README.md", icon: "tongzhi"},
                    {text: "如何设计一个抢红包系统", link: "/advance/system-design/README.md", icon: "hongbao1"},
                    {text: "购物车系统怎么设计？", link: "/advance/system-design/README.md", icon: "shopcar"},
                    {text: "如何设计一个注册中心？", link: "/advance/system-design/README.md", icon: "zhuce"},
                    {text: "如何设计一个高并发系统？", link: "/advance/system-design/README.md", icon: "xitong"},
                    {text: "10w级别数据Excel导入怎么优化？", link: "/advance/system-design/README.md", icon: "excel"},
                ]
            },
		    {
				text: "分布式",
				icon: "distribute",
				children: [
					{text: "全局唯一ID", link: "/advance/distributed/1-global-unique-id.md", icon: "quanju"},
					{text: "分布式锁", link: "/advance/distributed/2-distributed-lock.md", icon: "lock"},
					{text: "RPC", link: "/advance/distributed/3-rpc.md", icon: "call"},
					{text: "微服务", link: "/advance/distributed/4-micro-service.md", icon: "weifuwu"},
					{text: "分布式架构", link: "/advance/distributed/5-distibuted-arch.md", icon: "jiagou"},
					{text: "分布式事务", link: "/advance/distributed/6-distributed-transaction.md", icon: "transaction"},
				]
			},
		    {
				text: "高并发",
				children: [
					{text: "限流", link: "/advance/concurrent/1-current-limiting.md", icon: "bingfa"},
					{text: "负载均衡", link: "/advance/concurrent/2-load-balance.md", icon: "balance"},
				],
			},
            {
				text: "设计模式",
				icon: "win",
				children: [
					{text: "设计模式详解", link: "/advance/design-pattern/", icon: "design"},
				],
			},
			{
                text: "优质文章",
                children: [
                    {text: "优质文章汇总", link: "/advance/excellent-article", icon: "wenzhang"},
                ]
            },
        ]
    },

    {
        text: "源码解读",
        icon: "source",
        children: [
            {
                text: "Spring",
                children: [
                    {text: "整体架构", link: "/source/spring/1-architect.md", icon: "book"},
                    {text: "IOC 容器基本实现", link: "/source/spring/2-ioc-overview", icon: "book"},
                    {text: "IOC默认标签解析（上）", link: "/source/spring/3-ioc-tag-parse-1", icon: "book"},
                    {text: "IOC默认标签解析（下）", link: "/source/spring/4-ioc-tag-parse-2", icon: "book"},
                    {text: "IOC之自定义标签解析", link: "/source/spring/5-ioc-tag-custom.md", icon: "book"},
                    {text: "IOC-开启 bean 的加载", link: "/source/spring/6-bean-load", icon: "book"},
                    {text: "IOC之bean创建", link: "/source/spring/7-bean-build", icon: "book"},
                    {text: "IOC属性填充", link: "/source/spring/8-ioc-attribute-fill", icon: "book"},
                    {text: "IOC之循环依赖处理", link: "/source/spring/9-ioc-circular-dependency", icon: "book"},
                    {text: "IOC之bean 的初始化", link: "/source/spring/10-bean-initial", icon: "book"},
                    {text: "ApplicationContext容器refresh过程", link: "/source/spring/11-application-refresh", icon: "book"},
                    {text: "AOP的使用及AOP自定义标签", link: "/source/spring/12-aop-custom-tag", icon: "book"},
                    {text: "创建AOP代理之获取增强器", link: "/source/spring/13-aop-proxy-advisor", icon: "book"},
                    {text: "AOP代理的生成", link: "/source/spring/14-aop-proxy-create", icon: "book"},
                    {text: "AOP目标方法和增强方法的执行", link: "/source/spring/15-aop-advice-create", icon: "book"},
                    {text: "@Transactional注解的声明式事物介绍", link: "/source/spring/16-transactional", icon: "book"},
                    {text: "Spring事务是怎么通过AOP实现的？", link: "/source/spring/17-spring-transaction-aop", icon: "book"},
                    {text: "事务增强器", link: "/source/spring/18-transaction-advice", icon: "book"},
                    {text: "事务的回滚和提交", link: "/source/spring/19-transaction-rollback-commit", icon: "book"},
                ]
            },
            {
                text: "SpringMVC",
                children: [
                    {text: "文件上传和拦截器", link: "/source/spring-mvc/1-overview", icon: "book"},
                    {text: "导读篇", link: "/source/spring-mvc/2-guide", icon: "book"},
                    {text: "场景分析", link: "/source/spring-mvc/3-scene", icon: "book"},
                    {text: "事务的回滚和提交", link: "/source/spring-mvc/4-fileupload-interceptor", icon: "book"},
                ]
            },
            {
                text: "MyBatis(更新中)",
                children: [
                    {text: "整体架构", link: "/source/mybatis/1-overview", icon: "book"},
                    {text: "反射模块", link: "/source/mybatis/2-reflect", icon: "book"},
                ]
            },

        ]
    },
    //{
    //    text: "场景题",
    //    icon: "design",
    //    children: [
    //        {
    //            text: "海量数据",
    //            children: [
    //                {text: "统计不同号码的个数", link: "/mass-data/count-phone-num.md"},
    //                {text: "出现频率最高的100个词", link: "/mass-data/find-hign-frequency-word.md"},
    //            ]
    //        },
    //        {
    //            text: "系统设计",
    //            children: [
    //                {text: "扫码登录设计", link: "/system-design/scan-code-login.md"},
    //            ]
    //        },
    //    ]
    //},
    {
        text: "工具",
        icon: "tool",
        children: [
            {
                text: "开发工具",
                children: [
                    {text: "Git详解", link: "/tools/git/", icon: "git1"},
                    {text: "Maven详解", link: "/tools/maven/", icon: "jihe"},
                    {text: "Docker详解", link: "/tools/docker/", icon: "docker1"},
                    {text: "Linux常用命令", link: "/tools/linux", icon: "linux"},
					{text: "Nginx面试题", link: "https://mp.weixin.qq.com/s/SKKEeYxif0wWJo6n57rd6A", icon: "nginx"},
                ]
            },
            {
                text: "在线工具",
                children: [
                    {text: "json", link: "https://www.json.cn/"},
                    {text: "base64编解码", link: "https://c.runoob.com/front-end/693/"},
                    {text: "时间戳转换", link: "https://www.beijing-time.org/shijianchuo/"},
                    {text: "unicode转换", link: "https://www.fulimama.com/unicode/"},
					{text: "正则表达式", link: "https://www.sojson.com/regex/"},
                    {text: "md5加密", link: "https://www.toolkk.com/tools/md5-encrypt"},
                    {text: "流程图工具", link: "https://app.diagrams.net/"},
                    {text: "二维码", link: "https://cli.im/"},
                    {text: "文本比对", link: "https://c.runoob.com/front-end/8006/"},
                ]
            },
            {
                text: "编程利器",
                children: [
                    {text: "markdown编辑器", link: "/tools/typora-overview.md", icon: "markdown"},
                ]
            },
        ]
    },
    {
        text: "珍藏资源",
        icon: "collection",
        children: [
            {
                text: "学习资源",
                children: [
                    {text: "计算机经典电子书PDF", link: "https://github.com/Tyson0314/java-books", icon: "book"},
                    {text: "Leetcode刷题笔记", link: "/learning-resources/leetcode-note.md", icon: "leetcode"},
					{text: "技术学习路线思维导图", link: "https://mp.weixin.qq.com/s?__biz=Mzg2OTY1NzY0MQ==&mid=2247494513&idx=1&sn=de1a7cf0b5580840cb8ad4a96e618866&chksm=ce9b1637f9ec9f212d054018598b96b5277f7733fac8f985d8dae0074c8446a2cad8e43ba739#rd", icon: "route"},
					{text: "图解操作系统、网络、计算机系列", link: "https://mp.weixin.qq.com/s?__biz=Mzg2OTY1NzY0MQ==&mid=2247494510&idx=1&sn=b19d9e07321b8fca9129fe0d8403a426&chksm=ce9b1628f9ec9f3e7d45a6db8389ee2813864a9ca692238d29b139c35ccb01b08155bc2da358#rd", icon: "computer"},
					{text: "优质视频教程", link: "https://mp.weixin.qq.com/s?__biz=Mzg2OTY1NzY0MQ==&mid=2247487149&idx=1&sn=aa883c9f020945d3f210550bd688c7d0&chksm=ce98f3ebf9ef7afdae0b37c4d0751806b0fbbf08df783fba536e5ec20ec6a6e1512198dc6206&token=104697471&lang=zh_CN#rd", icon: "video"},
					{text: "ChatGPT手册", link: "https://mp.weixin.qq.com/s?__biz=Mzg2OTY1NzY0MQ==&mid=2247494344&idx=1&sn=d16f51e8bd3424f63e4fb6a5aa5ca4db&chksm=ce9b178ef9ec9e9841c7a049e4da0843c291b96f463e87190a6bf344c7022194ee393b695751#rd", icon: "ai"},
                ]
            },
            {
                text: "学习路线",
                children: [
                    {text: "Java学习路线", link: "/learning-resources/java-learn-guide.md", icon: "java"},
                    {text: "CS学习路线", link: "/learning-resources/cs-learn-guide.md", icon: "jisuanji"},
                ]
            },

        ]
    },
    {
        text: "关于",
        icon: "about",
        children: [
            {text: "关于我", link: "/about/introduce.md", icon: "wode"},
            {text: "网站日记", link: "/other/site-diary.md", icon: "riji"},
            {text: "联系我", link: "/about/contact.md", icon: "lianxi"},
			{text: "留言区", link: "/other/leave-a-message.md", icon: "liuyan"},
            //{
            //    text: "学习资源",
            //    children: [
            //        {text: "计算机经典电子书PDF", link: "https://github.com/Tyson0314/java-books"},
            //        {text: "Leetcode刷题笔记", link: "/learning-resources/leetcode-note.md"},
            //    ]
            //},
            //{
            //    text: "学习路线",
            //    children: [
            //        {text: "Java学习路线", link: "/learning-resources/java-learn-guide.md"},
            //        {text: "CS学习路线", link: "/learning-resources/cs-learn-guide.md"},
            //    ]
            //},
        ]
    },


    //{ text: "Guide", icon: "creative", link: "/guide/" },
    //{
    //  text: "Posts",
    //  icon: "edit",
    //  prefix: "/posts/",
    //  children: [
    //    {
    //      text: "Articles 1-4",
    //      icon: "edit",
    //      prefix: "article/",
    //      children: [
    //        { text: "Article 1", icon: "edit", link: "article1" },
    //        { text: "Article 2", icon: "edit", link: "article2" },
    //        "article3",
    //        "article4",
    //      ],
    //    },
    //    {
    //      text: "Articles 5-12",
    //      icon: "edit",
    //      children: [
    //        {
    //          text: "Article 5",
    //          icon: "edit",
    //          link: "article/article5",
    //        },
    //        {
    //          text: "Article 6",
    //          icon: "edit",
    //          link: "article/article6",
    //        },
    //        "article/article7",
    //        "article/article8",
    //      ],
    //    },
    //    { text: "Article 9", icon: "edit", link: "article9" },
    //    { text: "Article 10", icon: "edit", link: "article10" },
    //    "article11",
    //    "article12",
    //  ],
    //},
    //{
    //  text: "Theme Docs",
    //  icon: "note",
    //  link: "https://vuepress-theme-hope.github.io/v2/",
    //},
]);
