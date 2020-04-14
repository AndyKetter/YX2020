//axios的二次封装，在组件中用
import { Notification } from "element-ui" //加载element ui Notification组件
import axios from "axios"
import Tools from "../untils/index" //工具方法
// import qs from "qs" //qs.stringify將json对象转换成get请求查询字符串 如{a,1:b,2}=>'a=1&b=2' ,qs.parse()将get请求查询字符串转换成json对象 如'a=1&b=2'=>{a,1:b,2}
//添加请求拦截器
let sessionId = Tools.getHashUrlParam("sessionId") //获取url ?后面的sessionId值
if (sessionId) {
    Tools.setCookie("SESSION", sessionId) //设置cookies 老oa权限的两个接口需要setCookie验证登录
    localStorage.setItem("token", sessionId) //储存sessionId到localStorage的token字段
}
let token = localStorage.getItem("token") //从localStorage获取token值

axios.interceptors.request.use(
    config => {
        if (token) {
            config.headers["x-user-token"] = token //设置x-user-token
            return config
        }
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
axios.defaults.timeout = 888888888888888888888888888888888888888888

function checkStatus(response) {
    return new Promise((resolve, reject) => {
        //code为0或则code为3
        if (response && (response.status === 200 || response.status === 304)) {
            //response.data.IsSuccess判断是为了兼容oa老系统的两个权限接口 (getUserCanVisitMenus菜单权限)
            if (response.data && (response.data.code == 0 || response.data.code == 3 || response.data.IsSuccess)) {
                resolve(response.data)
            } else {
                reject({
                    //不返回 不resolve 走catch
                    code: "requestError",
                    message: "逻辑失败"
                })
            }
            if (response.data.msg) {
                Notification.info({
                    title: "温馨提示",
                    message: response.data.msg
                })
            }
            if (response.data.message) {
                Notification.info({
                    title: "温馨提示",
                    message: response.data.message
                })
            }
            if (response.data.Message && response.data.IsSuccess !== true) {
                //老oa未登录提示 (getUserCanVisitMenus菜单权限) 老系统相关接口
                Notification.error({
                    title: "温馨提示",
                    message: response.data.Message
                })
                if (response.data.Message === "请先登录") {
                    //未登录，跳转登录页面
                    location.href = `${process.env.VUE_APP_DOMAIN}/html/login.html`
                }
            }
        } else {
            //http状态码失败
            if (response.data.message) {
                Notification.error({
                    title: "温馨提示",
                    message: response.data.message
                })
            } else {
                Notification.error({
                    title: "温馨提示",
                    message: "http 500请求错误"
                })
            }
            reject({
                    //不返回 不resolve 走catch
                    code: "httpError",
                    message: "http 500请求错误"
                })
                // resolve({ //返回 resolve
                //     state: 'httpError',
                //     message: '网络错误'
                // })
        }
    })
}

export function POST(url, params = {}) {
    return axios({
        method: "post",
        url,
        data: params
    }).then(response => {
        return checkStatus(response)
    })
}

export function PUT(url, params = {}) {
    //同post
    return axios({
        method: "put",
        url,
        data: params
    }).then(response => {
        return checkStatus(response)
    })
}

export function GET(url, params = {}) {
    // params = qs.stringify(params)
    return axios({
        method: "get",
        url,
        params
    }).then(response => {
        return checkStatus(response)
    })
}

export function DELETE(url, params = {}) {
    //同get
    // params = qs.stringify(params)
    return axios({
        method: "delete",
        url,
        params
    }).then(response => {
        return checkStatus(response)
    })
}

export function POSTParams(url, params = {}) {
    return axios({
        method: "post",
        url,
        params
    }).then(response => {
        return checkStatus(response)
    })
}

export function PUTParams(url, params = {}) {
    //同POSTParams
    return axios({
        method: "put",
        url,
        params
    }).then(response => {
        return checkStatus(response)
    })
}

export function GETBlob(url, params = {}) {
    //处理二级制流文件
    return axios({
        method: "get",
        url,
        params,
        responseType: "blob" //返回数据的格式，可选值为arraybuffer,blob,document,json,text,stream，默认值为json
    }).then(response => {
        return checkStatus(response)
    })
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