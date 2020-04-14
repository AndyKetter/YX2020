/* eslint-disable no-undef */
// import Vue from 'vue'
import App from './App.vue'
import router from './router/index' //导出路由
import store from './store/index' //导出vuex store
import 'element-ui/lib/theme-chalk/index.css' //引入element css
import './libs/css/fix.css' //引入永雄定制css
import './libs/css/common.css' //引入公用css
import './plugins/element.js' //按需加载element


Vue.config.productionTip = false //不提示警告信息

router.beforeEach((to,from,next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
