//自己封装的axios请求库

import Vue from 'vue'
import axios from "axios"
import VueAxios from 'vue-axios' //引入axios vue插件机制
Vue.use(VueAxios, axios) //使用axios vue插件,使用方式 Vue.axios.get...,this.axios.get...,this.$http.get...
import qs from "qs" //qs.stringify转换成查询字符串类似JSON.stringify转化格式的一种方法,qs.parse()转换成json对象

//添加请求拦截器
axios.interceptors.request.use(
    config => {
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

//添加响应拦截器
axios.interceptors.response.use(
    response => {
        return response
    },
    error => {
        return Promise.resolve(error.response)
    }
)

// axios.defaults.baseURL = "https://www.xxx.com/api"
// axios.defaults.withCredentials = true //是否带请求证书
// axios.defaults.headers.post["Content-Type"] = "application/json"
// axios.defaults.headers.post["X-Requested-With"] = "XMLHttpRequest"
// axios.defaults.timeout = 10000

function checkStatus(response) {
    return new Promise((resolve, reject) => {
        if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
            resolve(response.data)
        } else {
            reject({
                state: '0',
                message: '网络错误'
            })
        }
    })
}

export default {
    post(url, params) {
        return axios({
            method: "post",
            url,
            data: params
        }).then(response => {
            return checkStatus(response)
        })
    },
    get(url, params) {
        params = qs.stringify(params)
        return axios({
            method: 'get',
            url,
            params
        }).then(response => {
            return checkStatus(response)
        })
    },
    postParams(url, params) {
        return axios({
            method: "post",
            url,
            params
        }).then(response => {
            return checkStatus(response)
        })
    }
}

/* 
    使用说明
    在main.js文件
    import http from './utils/http'
    Vue.prototype.$http = http //可取$ajax
    
    methods:{
        async TestPost(){
            try{
                const res = await this.$http.post('/message/socketid',{
                    account:'huangenai'
                })
                console.log(res)
            }catch(error){
                console.log(error)
            }
        },
        async TestGet(){
            this.$http.get('price').then(res=>{
                console.log(res)
            }).catch(error=>{
                console.log(error)
            })
        }
    }

    个人思考
    checkStatus 方法返回了一个Promise
    链式结构的话看上面那个get的方法，this.$http.get(...).then(...).catch(...),如果then里面又来一个http请求会一层一层包住一层
    如果使用了语法糖async await,虽然看起来好像是简单了，不用一层包住一层 层层嵌套，可是你必须要用到try catch,如果出现异常就直接到catch
    不会再执行下面的方法，如果在实际业务中，就算出现了一个http请求失败的情况，不影响下面的逻辑要继续跑下去，这个就不适应了。链式结构也是，如果catch
    到异常也不会执行then里面的方法了
    所以，是否把返回的Promise,全部都返回的是resolve,那么就不会说出现直接到了catch里面不执行以下的业务逻辑了呢，而且如果使用的语法糖await代码看起来更加简洁
    也不需要try catch了，这样的话reject是不是就不需要用到了呢
    function checkStatus(response) {
        return new Promise((resolve, reject) => {
            if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
                resolve(response.data)
            } else {
                resolve({
                    state: '0',
                    message: '网络错误'
                })
            }
        })
    }
*/

