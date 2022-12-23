import {hopeTheme} from "vuepress-theme-hope";
import navbar from "./navbar";
import sidebar from "./sidebar";

export default hopeTheme({
    hostname: "https://www.topjavaer.cn",

    author: {
        name: "大彬",
        url: "https://www.topjavaer.cn",
    },

    iconAssets: "//at.alicdn.com/t/c/font_3573089_m0vn9di8q9.css",
    iconPrefix: "iconfont icon-",
    //iconAssets: "iconfont",

    darkmode: "toggle",

    fullscreen: false,

    logo: "/logo.svg",

    repo: "Tyson0314/Java-learning",

    docsDir: "docs",

    // navbar
    navbar: navbar,

    // sidebar
    sidebar: sidebar,
	headerDepth: 5,
	collapsable: true,

    displayFooter: true,

    // footer: '<a href="http://beian.miit.gov.cn/" rel="noopener noreferrer" target="_blank">粤ICP备2022005190号-2 |</a>' +
    // '<a href="/other/site-diary.html">关于网站</a>',

    footer: '<a href="http://beian.miit.gov.cn/" rel="noopener noreferrer" target="_blank">粤ICP备2022005190号-2</a>',

    pageInfo: ["Author", "Original", "Date", "Category", "Tag", "ReadingTime"],

    blog: {
        description: "非科班自学转码选手，校招拿了多家互联网大厂offer",
        intro: "https://mp.weixin.qq.com/s/84ZDT5d9TIbnyg-jeRKIIA",
        medias: {
            Github: "https://github.com/Tyson0314",
            Gitee: "https://gitee.com/tysondai",
            ZhiHu: "https://www.zhihu.com/people/dai-shu-bin-13",
        },
    },

    // encrypt: {
    //   config: {
    //     "/guide/encrypt.html": ["1234"],
    //   },
    // },

    plugins: {
        blog: {
            autoExcerpt: true,
        },

        // If you don't need comment feature, you can remove following option
        // The following config is for demo ONLY, if you need comment feature, please generate and use your own config, see comment plugin documentation for details.
        // To avoid disturbing the theme developer and consuming his resources, please DO NOT use the following config directly in your production environment!!!!!
        comment: {
            /**
             * Using Giscus
             */
            provider: "Giscus",
            repo: "Tyson0314/topjavaer",
            repoId: "R_kgDOHxs_3g",
            category: "Announcements",
            categoryId: "DIC_kwDOHxs_3s4CQpxA",
//
            /**
             * Using Twikoo
             */
            // provider: "Twikoo",
            // envId: "https://twikoo.ccknbc.vercel.app",
//
            /**
             * Using Waline
             */
            // provider: "Waline",
            // serverURL: "https://vuepress-theme-hope-comment.vercel.app",
        },

        mdEnhance: {
            enableAll: true,
            presentation: {
                plugins: ["highlight", "math", "search", "notes", "zoom"],
            },
        },

        //myplugin
        copyright: {
            disableCopy: true,
            global: true,
            author: "大彬",
            license: "MIT",
            hostname: "https://www.topjavaer.cn",
        },
        baiduAutoPush: {},
        sitemapPlugin: {
            // 配置选项
            hostname: "https:www.topjavaer.cn"
        },
        photoSwipePlugin: {
            // 你的选项
        },
        readingTimePlugin: {},

        nprogressPlugin: {},

        //searchPlugin: {
        //                    appId: "xxx",
        //                    apiKey: "xxxx",
        //                    indexName: "topjavaer.cn",
        //                    locales: {
        //                        "/": {
        //                            placeholder: "搜索文档",
        //                            translations: {
        //                                button: {
        //                                    buttonText: "搜索文档",
        //                                    buttonAriaLabel: "搜索文档",
        //                                },
        //                                modal: {
        //                                    searchBox: {
        //                                        resetButtonTitle: "清除查询条件",
        //                                        resetButtonAriaLabel: "清除查询条件",
        //                                        cancelButtonText: "取消",
        //                                        cancelButtonAriaLabel: "取消",
        //                                    },
        //                                    startScreen: {
        //                                        recentSearchesTitle: "搜索历史",
        //                                        noRecentSearchesText: "没有搜索历史",
        //                                        saveRecentSearchButtonTitle: "保存至搜索历史",
        //                                        removeRecentSearchButtonTitle: "从搜索历史中移除",
        //                                        favoriteSearchesTitle: "收藏",
        //                                        removeFavoriteSearchButtonTitle: "从收藏中移除",
        //                                    },
        //                                    errorScreen: {
        //                                        titleText: "无法获取结果",
        //                                        helpText: "你可能需要检查你的网络连接",
        //                                    },
        //                                    footer: {
        //                                        selectText: "选择",
        //                                        navigateText: "切换",
        //                                        closeText: "关闭",
        //                                        searchByText: "搜索提供者",
        //                                    },
        //                                    noResultsScreen: {
        //                                        noResultsText: "无法找到相关结果",
        //                                        suggestedQueryText: "你可以尝试查询",
        //                                    },
        //                                },
        //                            },
        //                        },
        //                    },
        //                },
    },
})
;
