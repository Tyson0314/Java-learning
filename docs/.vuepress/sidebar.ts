import {sidebar} from "vuepress-theme-hope";

const {getChildren} = require("./vuepress-sidebar-auto/vuepress-sidebar-auto");

export default sidebar({
    "/database/mysql-basic/": [{
        text: "MySQL基础",
        collapsable: false,
        children: getChildren('./docs/database', 'mysql-basic'),
        // children: ["1-data-type"],
    },
    ],
    "/redis/redis-basic/": [
        {
            text: "Redis基础",
            collapsable: false,
            children: getChildren('./docs/redis', 'redis-basic'),
        },
    ],
    "/advance/design-pattern/": [
        {
            text: "设计模式",
            collapsable: false,
            children: getChildren('./docs/advance', 'design-pattern'),
        },
    ],
    "/tools/docker/": [
        {
            text: "Docker基础",
            collapsable: false,
            children: getChildren('./docs/tools', 'docker'),
        },
    ],
    "/tools/git/": [
        {
            text: "Git基础",
            collapsable: false,
            children: getChildren('./docs/tools', 'git'),
        },
    ],
	"/leetcode/hot120": [
        {
            text: "LeetCode题解",
            collapsable: false,
            children: getChildren('./docs/leetcode', 'hot120'),
        },
    ],
    "/tools/maven/": [
        {
            text: "Maven基础",
            collapsable: false,
            children: getChildren('./docs/tools', 'maven'),
        },
    ],
    "/framework/netty/": [
        {
            text: "Netty基础",
            collapsable: false,
            children: getChildren('./docs/framework', 'netty'),
        },
    ],
    "/framework/springcloud/": [
        {
            text: "SpringCloud基础",
            collapsable: false,
            children: getChildren('./docs/framework', 'springcloud'),
        },
    ],
	"/java/java8/": [
        {
            text: "java8新特性",
            collapsable: false,
            children: getChildren('./docs/java', 'java8'),
        },
    ],
	"/campus-recruit/interview/": [
        {
            text: "面经合集",
			collapsable: true,
            children: getChildren('./docs/campus-recruit', 'interview'),
        },
    ],
	"/advance/excellent-article": [
        {
            text: "优质文章汇总",
            collapsable: false,
            children: getChildren('./docs/advance', 'excellent-article'),
        },
    ],
	"/advance/concurrent": [
        {
            text: "高并发",
            collapsable: false,
            children: getChildren('./docs/advance', 'concurrent'),
        },
    ],
    "/tools/linux/": [
        {
            text: "linux常用命令",
            collapsable: false,
            children: getChildren('./docs/tools', 'linux'),
        },
    ],
	"/campus-recruit/program-language/": [
        {
            text: "编程语言",
			collapsable: true,
            children: getChildren('./docs/campus-recruit', 'program-language'),
        },
    ],
	//"/advance/system-design": [
    //    {
    //        text: "系统设计",
    //        collapsable: false,
    //        children: getChildren('./docs/advance', 'system-design'),
    //    },
    //],
	"/campus-recruit/share": [
        {
            text: "校招分享",
            collapsable: false,
            children: getChildren('./docs/campus-recruit', 'share'),
        },
    ],
	// "/mass-data": [
    //     {
    //         text: "海量数据",
    //         collapsable: false,
    //         // children: getChildren('./docs', '/mass-data'),
    //         children: [
    //             {text: "统计不同号码的个数", link: "/mass-data/1-count-phone-num.md"}
    //         ]
    //     },
    // ],
	
    //'/': "auto", //不能放在数组第一个，否则会导致右侧栏无法使用
    //"/",
    //"/home",
    //"/slide",
    //{
    //  icon: "creative",
    //  text: "Guide",
    //  prefix: "/guide/",
    //  link: "/guide/",
    //  children: "structure",
    //},
    //{
    //  text: "Articles",
    //  icon: "note",
    //  prefix: "/posts/",
    //  children: [
    //    {
    //      text: "Articles 1-4",
    //      icon: "note",
    //      collapsable: true,
    //      prefix: "article/",
    //      children: ["article1", "article2", "article3", "article4"],
    //    },
    //    {
    //      text: "Articles 5-12",
    //      icon: "note",
    //      children: [
    //        {
    //          text: "Articles 5-8",
    //          icon: "note",
    //          collapsable: true,
    //          prefix: "article/",
    //          children: ["article5", "article6", "article7", "article8"],
    //        },
    //        {
    //          text: "Articles 9-12",
    //          icon: "note",
    //          children: ["article9", "article10", "article11", "article12"],
    //        },
    //      ],
    //    },
    //  ],
    //},
});
