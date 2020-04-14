// vue配置文件 by mohan
//薪资系统测试环境 http://172.31.18.22:8080    开发dev环境 http://172.31.18.21:8080
const path = require("path")
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin

function resolve(dir) {
    return path.join(__dirname, dir)
}
module.exports = {
    publicPath: "",
    productionSourceMap: false,
    devServer: {
        // open: true, //编译完自动开启浏览器,为true开启默认浏览器,为"Google Chrome"开启谷歌浏览器
        port: "8080",
        proxy: {
            "/api": {
                //代理到测试环境(无重写url) 只在链接(测试环境)才启用
                target: "http://172.31.18.21:8080",
                ws: true,
                changeOrigin: true
            },
            "/oa-manage": {
                //代理到老oa系统(无重写url)  (本地联调)与链接(测试环境)都要启用
                target: "http://172.31.18.21:8080",
                ws: true,
                changeOrigin: true
            }
            // "/api/auth/jwt/oaGetTokenInfo": {
            //     //代理新系统登录验证 只在(本地联调)启用
            //     target: "http://172.31.18.21:8080",
            //     ws: true,
            //     changeOrigin: true
            // },
            // "/api/administration": {
            //     //重写url代理  行政系统
            //     target: "http://10.20.80.113:8882",
            //     ws: true,
            //     changeOrigin: true,
            //     pathRewrite: {
            //         "^/api/administration": ""
            //     }
            // },
            // "/api/personnel": {
            //     //重写url代理  人事系统
            //     target: "http://10.20.80.123:8881",
            //     ws: true,
            //     changeOrigin: true,
            //     pathRewrite: {
            //         "^/api/personnel": ""
            //     }
            // },
            // "/api/financial": {
            //     //重写url代理  财务系统
            //     target: "http://10.20.80.61:8881",
            //     ws: true,
            //     changeOrigin: true,
            //     pathRewrite: {
            //         "^/api/financial": ""
            //     }
            // },
            // "/api/performance": {
            //     //重写url代理  绩效相关
            //     target: "http://10.20.80.61:8881",
            //     ws: true,
            //     changeOrigin: true,
            //     pathRewrite: {
            //         "^/api/performance": ""
            //     }
            // },
            // "/api/quote": {
            //     //重写url代理 综合性运营数据
            //     target: "http://10.20.80.58:8886",
            //     ws: true,
            //     changeOrigin: true,
            //     pathRewrite: {
            //         "^/api/quote": ""
            //     }
            // },
            // "/api/tool": {
            //     //文件(图片,视频,音频,excel)下载相关
            //     target: "http://10.20.80.123:8091",
            //     ws: true,
            //     changeOrigin: true,
            //     pathRewrite: {
            //         "^/api/tool": ""
            //     }
            // },
            // "/api/tool": {
            //     //文件(图片,视频,音频,excel)下载相关(无重写url)
            //     target: "http://172.31.18.21:8080",
            //     ws: true,
            //     changeOrigin: true
            // }
            // "/api/admin": {
            //     //权限相关(无重写url)
            //     target: "http://172.31.18.22:8080",
            //     ws: true,
            //     changeOrigin: true
            // }
        }
    },
    outputDir: `salary-vue-${process.env.NODE_ENV}`,
    assetsDir: undefined,
    runtimeCompiler: undefined,
    parallel: undefined,
    css: {
        extract: true // css拆分ExtractTextPlugin插件，默认true。若为true,编译后会生成css文件，若为false,则直接js渲染插入到style标签里面。
    },
    // eslint-disable-next-line no-unused-vars
    configureWebpack: config => {
            let plugins = {}
            if (process.env.use_analyz) {
                plugins = {
                    plugins: [
                        //webpack打包优化分析工具插件
                        new BundleAnalyzerPlugin()
                    ]
                }
            }
            return {
                resolve: {
                    // extensions: ['.js', '.vue', '.json'],
                    alias: {
                        "@": resolve("src"),
                        components: resolve("src/components"),
                        config: resolve("src/config"),
                        http: resolve("src/http"),
                        json: resolve("src/json"),
                        libs: resolve("src/libs"),
                        mock: resolve("src/mock"),
                        plugins: resolve("src/plugins"),
                        router: resolve("src/router"),
                        store: resolve("src/store"),
                        untils: resolve("src/untils"),
                        views: resolve("src/views")
                    }
                },
                ...plugins
            }
        }
        // chainWebpack: config => {
        //     //限制10kb图片下才转base64,chainWebpack与configureWebpack可以共存，会自动合并
        //     config.module
        //         .rule("images")
        //         .use("url-loader")
        //         .loader("url-loader")
        //         .tap(options => Object.assign(options, { limit: 10240 }))
        // }
}