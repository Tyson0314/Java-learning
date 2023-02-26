import {defineUserConfig} from "vuepress";
import theme from "./theme";

const {searchPlugin} = require('@vuepress/plugin-search')

import { gitPlugin } from '@vuepress/plugin-git'


export default defineUserConfig({
    lang: "zh-CN",
    title: "Java学习&面试指南-程序员大彬",
    description: "Java学习、面试指南，涵盖大部分 Java 程序员所需要掌握的核心知识",
    base: "/",
    dest: './public',
    theme,
    // 是否开启默认预加载 js
    shouldPrefetch: (file, type) => false,

    head: [
        //meta
        ["meta", { name: "robots", content: "all" }],
        ["meta", {name: "author", content: "大彬"}],
        [
            "meta",
            {
                "http-equiv": "Cache-Control",
                content: "no-cache, no-store, must-revalidate",
            },
        ],
        ["meta", { "http-equiv": "Pragma", content: "no-cache" }],
        ["meta", { "http-equiv": "Expires", content: "0" }],
        ['meta', {name: 'baidu-site-verification', content: 'code-mtJaPDeFwy'}],
        // ['meta', { name: 'google-site-verification', content: 'eGgkbT6uJR-WQeSkhhcB6RbnZ2RtF5poPf1ai-Fgmy8' }],
        ['meta', {name: 'keywords', content: 'Java,Spring,Mybatis,SpringMVC,Springboot,编程,程序员,MySQL,Redis,系统设计,分布式,RPC,高可用,高并发,场景设计,Java面试'}],
        [
            'script', {}, `
			var _hmt = _hmt || [];
			(function() {
				var hm = document.createElement("script");
				hm.src = "https://hm.baidu.com/hm.js?f9b36644dd9e756e508a77f272a63e07";
				var s = document.getElementsByTagName("script")[0];
				s.parentNode.insertBefore(hm, s);
			})();
		`
        ],
    ],

    plugins: [
        searchPlugin({
            // 配置项
        }),
        gitPlugin({
            createdTime: false,
            updatedTime: false,
            contributors: false,
        }),
    ],
    //plugins: [
    //    copyright({
    //        disableCopy: true,
    //        global: true,
    //        disableSelection: true,
    //        author: "大彬",
    //        license: "MIT",
    //        hostname: "https://www.topjavaer.cn",
    //    }),
    //    [
    //        'vuepress-plugin-baidu-autopush'
    //    ],
    //    sitemapPlugin({
    //        // 配置选项
    //        hostname: "https:www.topjavaer.cn"
    //    }),
    //    photoSwipePlugin({
    //        // 你的选项
    //    }),
    //    readingTimePlugin({
    //        // 你的选项
    //    }),
    //    [
    //        nprogressPlugin(),
    //    ],
    //    //['@vuepress/nprogress'],
    //],
})
;
