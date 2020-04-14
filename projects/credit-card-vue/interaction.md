# vue前端架构

## 一，开发环境搭建包括(vscode与npm私服)
```
1. 地址ftp://10.0.8.45/  账号ybcard   密码yb123456
2. 永雄集团前端开发规范及资源压缩文件夹
3. 前端资源/yx-master 安装vscode
4. 前端资源/extensions 安装vscode插件
5. 前端资源/pengkun 安装node npm
6. npm config set registry=http://nexus.yubang168.cn:8081/repository/npm-public  (设置npm私服)

```

## 二，单页面项目架构-项目目录结构
```
README.md--项目介绍md文件
package.json--项目依赖的node包（通过npm install安装下载）
package-lock.json--yarn下载的包一一对应package.json，所以yarn与npm二选一下载node包
babel.config.js--babel配置文件
.gitignore--git忽略配置文件
node_modules--npm install后所有下载包的文件夹
src--vue项目文件夹
src/main.js--项目主js文件
src/App.vue--项目主vue组件
src/untils--项目工具类
src/router--项目路由配置文件夹
src/plugins--项目插件文件夹（element.js是element ui按需加载导入导出文件）
src/libs--个人公用的css,js（建议以自己英文名为前缀命名，这样好区分）
src/images--项目图片文件夹
src/store--vuex store的定义
vue.config.js--vue项目配置文件,webpack-serve做代理解决本地跨域联调问题在此文件配置
```

## 三, axios取代jquery ajax函数
```
no jquery理念
src/http/index.js文件中
结合 建议反馈功能实现讲解
```


## 四，在vue交互的两种方式
```
1. 组自身生命周期created或者mounted函数中
2. vuex方式（建议需要共享的数据这么处理）
```

## 五，结合element ui做数据交互
```
结合element ui api去做交互  this.data = JsonObject
```

## 六，开发环境vue.config.js跨域代理配置
```
比如xxx ip地址是http://10.0.8.245:8888或则测试环境地址http://yboa.yubang168.cn
module.exports = {
    publicPath:'',
    productionSourceMap:false,
    devServer:{
        proxy:{
            '/oa-manage': {
                target: 'http://yboa.yubang168.cn',
                ws:true,
                changeOrigin:true
            },
            '/oa-card': {
                target: 'http://10.0.8.245:8888',
                ws: true,
                changeOrigin: true
            }
        }
    }
}
```

### 七，其他
```
vue结合element ui的excel导入导出功能
```