const express = require("express")
const proxy = require("http-proxy-middleware") // 核心http代理中间件

const app = express()
const host = "localhost" // 域名
const port = "80" // 监听80端口 不能用8080端口 8080端口已被薪资系统vue.config.js占用

// express.static设置静态资源
app.use("/", express.static("D:/oa/oa-frontend/src/main/resources/public/")) // 本地oa-frontend项目地址

// 处理2个斜杠的问题  也就是说在oa前端项目中的路径里面如果有不小心写多了一个斜杠 / 通过这样处理2个斜杠的问题就没事了
app.use(
    "//?oa-card/*",
    proxy({
        // target: 'http://yboa.yubang168.cn',//测试环境(域名 hosts去配置)
        // target: 'http://10.0.8.245:8385',//测试环境(ip)
        target: "http://172.31.18.242:8888", //开发环境
        changeOrigin: true
    })
)

// 处理2个斜杠的问题
app.use(
    "//?oa-manage/*",
    proxy({
        // target: 'http://yboa.yubang168.cn',//测试环境(域名 hosts去配置)
        // target: 'http://10.0.8.245:8184',//测试环境(ip)
        target: "http://172.31.18.242:8081", //开发环境
        changeOrigin: true
    })
)

// 重写url代理 人事模块
app.use(
    "/api/personnel",
    proxy({
        target: "http://10.20.80.39:8881",
        changeOrigin: true,
        ws: true,
        pathRewrite: {
            "^/api/personnel": ""
        }
    })
)

// 重写url代理 行政模块
app.use(
    "/api/administration",
    proxy({
        target: "http://10.20.80.39:8882",
        changeOrigin: true,
        ws: true,
        pathRewrite: {
            "^/api/administration": ""
        }
    })
)

// 重写url代理 下载,字典,图片,视频 8091直连不走网关需要rewrite,不走网关token一定需要转化
app.use(
    "/api/tool",
    proxy({
        target: "http://172.31.18.21:8091",
        changeOrigin: true,
        ws: true,
        pathRewrite: {
            "^/api/tool": ""
        }
    })
)

// 监听
app.listen(port, () => console.log("server is listening at http://%s:%s", host, port))