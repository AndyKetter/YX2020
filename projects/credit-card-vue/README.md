# credit-card-vue(新信用卡催收系统)

### 该项目前端基于vue+vue-router+vuex+element ui+axios+babel+vue-cli3+webpack+postcss技术栈做开发(用webpack-serve做代理解决本地跨域联调问题)

### 项目下载npm依赖包
```
npm install
```

### 编译项目，开启vue的静态服务器及其热加载特性（开发环境）
```
npm run serve(因为预留路由所以目前页面在home子路由下面,下面的port是指你npm run serve开启的端口号,比如你开启是8080端口,那么我的业绩入门就是http://localhost:8080/#/home/myPerformance)
首页地址（http://localhost:port/#/home/index)
我的业绩（http://localhost:port/#/home/myPerformance)
业务入门（http://localhost:port/#/home/businessPrimer)
王者榜（http://localhost:port/#/home/kingList)
综合评分（http://localhost:port/#/home/evaluation)
统计报表（http://localhost:port/#/home/reports)
```

### 编译压缩文件，上线前的工作（生产环境）
```
npm run build
```

### 测试项目
```
npm run test
```

### 运行Lints检查js与修复js
```
npm run lint
```

### 具体配置vue-cli的官方文档
See [Configuration Reference](https://cli.vuejs.org/config/).

### 项目目录结构
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
