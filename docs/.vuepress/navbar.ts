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
					{text: "Java8", link: "/java/java8.md", icon: "java"},
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
                    {text: "统计不同号码的个数", link: "/mass-data/1-count-phone-num.md"},
                    {text: "出现频率最高的100个词", link: "/mass-data/2-find-hign-frequency-word.md"},
                    {text: "查找两个大文件共同的URL", link: "/mass-data/3-find-same-url.md"},
                    {text: "如何在100亿数据中找到中位数？", link: "/mass-data/4-find-mid-num.md"},
                    {text: "如何查询最热门的查询串？", link: "/mass-data/5-find-hot-string.md"},
                    {text: "如何找出排名前 500 的数？", link: "/mass-data/6-top-500-num.md"},
                    {text: "如何按照 query 的频度排序？", link: "/mass-data/7-query-frequency-sort.md"},
                    {text: "大数据中 TopK 问题的常用套路", link: "/mass-data/8-topk-template.md"},
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
                    {text: "扫码登录设计", link: "/advance/system-design/1-scan-code-login.md"},
                    {text: "超时订单自动取消", link: "/advance/system-design/2-order-timeout-auto-cancel.md"},
                    {text: "短链系统设计", link: "/advance/system-design/README.md"},
                    {text: "微信红包系统如何设计？", link: "/advance/system-design/README.md"},
                    {text: "单点登录设计与实现", link: "/advance/system-design/README.md"},
                    {text: "如何用 Redis 统计用户访问量？", link: "/advance/system-design/README.md"},
                    {text: "实时订阅推送设计与实现", link: "/advance/system-design/README.md"},
                    {text: "如何设计一个抢红包系统", link: "/advance/system-design/README.md"},
                    {text: "购物车系统怎么设计？", link: "/advance/system-design/README.md"},
                    {text: "如何设计一个注册中心？", link: "/advance/system-design/README.md"},
                    {text: "如何设计一个高并发系统？", link: "/advance/system-design/README.md"},
                    {text: "10w级别数据Excel导入怎么优化？", link: "/advance/system-design/README.md"},
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
