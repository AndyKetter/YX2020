import Vue from "vue" //引入vue
import App from "@/App.vue" //引入vue根组件
import router from "router/index" //导出路由
import store from "store/index" //导出vuex store
import "plugins/index.js" //按需加载element 自动注册全局组件auto-regist.js 自动导入所有文件auto-allcss
import Filters from "untils/filter" //filter方法
import Directive from "untils/directive" //directive方法
import Tools from "untils/index" //工具方法

//根据token获取用户信息
// eslint-disable-next-line no-unused-vars
let isNew = Tools.getHashUrlParam("isNew") //是否是未入职新员工--永雄学院
if (isNew !== "true") {
    //已入职员工才有下面权限登录判断相关动作
    store.dispatch("oaGetTokenInfo").then(() => {
        // console.log(res.id)
        // console.log(store.state.oaGetTokenInfo)
    })
    store.dispatch("getUserCanVisitMenus") //获取老系统菜单
    store.dispatch("getUserActionAll") //获取老系统页面action操作权限
}

Vue.config.productionTip = false //不提示警告信息

router.beforeEach((to, from, next) => {
    //路由切换动态设置title
    if (to.meta.title) {
        document.title = to.meta.title
    }
    next()
})

//自定义全局过滤器filter by 墨含
Vue.filter("toThousands", Filters.toThousands)
Vue.filter("subDateYear", Filters.subDateYear)
Vue.filter("subDateMonth", Filters.subDateMonth)
Vue.filter("repair", Filters.repair)
Vue.filter("repairZero", Filters.repairZero)
Vue.filter("repairEmpty", Filters.repairEmpty)

//自定义全局指令directive by 墨含 指令用法v-no-more-click
Vue.directive("noMoreClick", Directive.noMoreClick)

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app")