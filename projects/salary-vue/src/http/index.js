//使用vue-axios插件机制不做二次封装，在mainjs中用
import Vue from "vue"
import axios from "axios"
import VueAxios from "vue-axios" //引入axios vue插件机制
Vue.use(VueAxios, axios) //使用axios vue插件,使用方式 Vue.axios.get...,this.axios.get...,this.$http.get...