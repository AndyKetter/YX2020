import Vue from 'vue'
import App from './App.vue'
import './http/index' //导入axios请求库
import router from './router/index' //导出路由
import store from './store/index' //导出vuex store
import '../node_modules/bootstrap/dist/css/bootstrap.min.css' //引入boostrtap css
import 'element-ui/lib/theme-chalk/index.css' //引入element css
import './libs/css/fix.css' //引入自定义修复css
import './libs/css/patch.css' //引入补丁css
// import echarts from 'echarts' //导入echars
// eslint-disable-next-line no-undef
Vue.prototype.$echarts = echarts //挂载到vue实例上
import './plugins/element.js' //按需加载element

Vue.config.productionTip = false //不提示警告信息
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
