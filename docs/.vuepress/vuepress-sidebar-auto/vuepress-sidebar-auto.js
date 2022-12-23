//侧边栏
// const autosidebar = require('vuepress-auto-sidebar-doumjun')
const fs = require('fs')
const path = require('path')

/**
 * 过滤所要导航的文件
 * 文件名 包含.md 但 不包含  README */
function checkFileType(path) {
    return path.includes(".md")&&(!path.includes("README"));
}

/**
 * 格式化文件路径*/
function prefixPath(basePath, dirPath) {
    let index = basePath.indexOf("/")
// 去除一级目录地址
    basePath = basePath.slice(index, path.length)
// replace用于处理windows电脑的路径用\表示的问题
    return path.join(basePath, dirPath).replace(/\\/g, "/")
}

/**
 * 截取文档路径*/
function getPath(path,ele) {
    let item=prefixPath(path,ele);
    //if (item.split('/')[6]) {
    //    return item.split('/')[3] + '/' + item.split('/')[4]+ '/' + item.split('/')[5]+ '/' + item.split('/')[6]
    //}else if (item.split('/')[5]) {
    //    return item.split('/')[3] + '/' + item.split('/')[4]+ '/' + item.split('/')[5]
    //}else if (item.split('/')[4]) {
    //    return item.split('/')[3] + '/' + item.split('/')[4]
    //} else {
    //    return item.split('/')[3]
    //}

	if (item.split('/')[6]) {
        return item.split('/')[4]+ '/' + item.split('/')[5]+ '/' + item.split('/')[6]
    }else if (item.split('/')[5]) {
        return item.split('/')[4]+ '/' + item.split('/')[5]
    }else {
        return item.split('/')[4]
    }
}

/**
 * 递归获取分组信息并排序*/
function getGroupChildren(path,ele,root) {
    let pa = fs.readdirSync(path + "/" + ele + "/");
    let palist=pa;
    // console.log("pathlist", pa)
    pa = palist.sort(function (a, b) {
        //console.log("a " + a, a.replace(".md", "").match(/^[^-]/))
        //console.log("b " + b, b.replace(".md", "").match(/^[^-]/))
        let num1 = a.split("-")[0]
        let num2 = b.split("-")[0]
        //console.log("num1", num1, "num2", num2)
        //console.log(num1 - num2)
        return num1 - num2
		//return a.replace(".md", "").match(/^[^-]/) - b.replace(".md", "").match(/^[^-]/)
        //return a.replace(".md", "").match(/[^-]*$/) - b.replace(".md", "").match(/[^-]*$/)
    });
    // console.log("after sort ", pa)
    pa.forEach(function (item, index) {
        let info = fs.statSync(path + "/" + ele + "/" + item);
        if (info.isDirectory()) {
            let children = [];
            let group = {};
            group.title = item.split('-')[1];
            group.collapsable = true;
            group.sidebarDepth = 4;
            getGroupChildren(path + "/" + ele, item, children);
            group.children=children;
            root.push(group);
        } else {
            if (checkFileType(item)) {
                root.push(getPath(path + "/" + ele, item));
            }
        }
    })
}
/**
 * 初始化*/
function getChildren(path,ele){
    var root=[]
    getGroupChildren(path,ele,root);
    return root;
}

// console.log("demo", getChildren('./docs','database/mysql-basic'))

module.exports = {getChildren: getChildren};
