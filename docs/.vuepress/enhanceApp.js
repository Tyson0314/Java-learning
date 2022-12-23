export default ({router}) => {
    router.beforeEach((to, from, next) => {
        //对每个页面点击添加百度统计
        if(typeof _hmt!='undefined'){
            if (to.path) {
                _hmt.push(['_trackPageview', to.fullPath]);
            }
        }

        // continue
        next();
    })
};
