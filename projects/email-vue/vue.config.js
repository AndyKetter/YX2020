// vue配置文件
module.exports = {
    publicPath: "",
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/oa-manage': {
                target: 'http://yboa.yubang168.cn',
                ws: true,
                changeOrigin: true
            },
            '/oa-card': {
                target: 'http://10.0.8.245:8888',
                ws: true,
                changeOrigin: true
            }
        }
    },
    outputDir: "email",
    assetsDir: undefined,
    runtimeCompiler: undefined,
    parallel: undefined,
    css: undefined,
    configureWebpack: () => {
        return {
            externals: {
                'vue': 'Vue',
                'vue-router': 'VueRouter',
                'vuex':'Vuex'
            }
        }
    }
}