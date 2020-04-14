## 项目说明文件(by 墨含(mohan)--2019/9/30 更新)

### 项目下载 npm 依赖包

```
npm install
```

### 编译项目，开启 vue 的静态服务器及其热加载特性（开发环境）

```
npm run serve或npm run start或npm start
```

### 编译压缩文件，上线前的工作（生产环境）

```
npm run build
```

### 测试项目

```
npm run test
```

### 运行 Lints 检查 js 与修复 js

```
npm run lint
```

### 具体配置 vue-cli 的官方文档

See [Configuration Reference](https://cli.vuejs.org/config/).

### 项目目录结构

```
backup--项目文件备份文件夹
node_modules--npm install后所有下载包的文件夹
public--vue项目index.html模板文件夹
src--vue项目文件夹
src/components--项目vue自定义全局组件,公用组件文件夹
src/config--项目配置js文件夹(项目后期规划的文件夹)
src/http--项目http请求封装文件夹(基于axios)
src/json--项目静态json文件夹
src/libs--个人公用的css,js（建议以自己英文名为前缀命名，这样好区分）
src/mock--项目mockjs配置文件夹
src/plugins--项目插件文件夹（element.js是element ui按需加载导入导出文件）
src/router--项目路由配置文件夹
src/store--vuex store的定义
src/untils--项目工具类
src/views--页面级别vue单页面组件
src/App.vue--项目根vue组件
src/main.js--项目入口js文件
study--项目学习文件,调研文件夹
.browserslistrc--浏览器版本配置文件夹
.env.xxx--环境变量配置文件
.eslintrc.js--eslint配置文件
.gitignore--git忽略配置文件
babel.config.js--babel配置文件
normalize.md--项目额外说明md文件
package-lock.json--yarn下载的包一一对应package.json，所以yarn与npm二选一下载node包
package.json--项目依赖的node包（通过npm install安装下载）
postcss.config.js--vue样式打包编译都会过postcss,该文件为postcss配置文件
README.md--项目介绍md文件
vue.config.js--vue项目配置文件,webpack-serve做代理解决本地跨域联调问题在此文件配置
```

### 启动

```
serve:vue-cli-service serve
    --open 在服务器启动时打开浏览器
    --copy 在服务器启动时URL复制到剪切板
    --mode 指定环境模式(默认值:development)
    --host 指定host(默认值:0.0.0.0)
    --port 指定port(默认值:8080)
    --https 使用https(默认值:false)

```

### 打包

```
build:vue-cli-service build
    --modern 使用现代模式构建应用，为现代浏览器交付原生支持的ES2015代码，并生成一个兼容老浏览器的包用来自动回退。
    --target 允许你将项目中的任何组件以一个库或web components组件的方式进行构建。更多细节请查阅构建目标。
    --report 和 --report-json 会根据构建统计生产报告，它会帮助你分析包中包含的模块们的大小
```

### 测试

```
test:vue-cli-service test:e2e 端到端测试
    vue-cli-service test:unit 单元测试
```