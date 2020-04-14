### git 命令行

一，git 设置不用每次都输入账号密码 git config --global credential.helper store
二，git 第一次关联远程分支 push
1，git checkout -b mohan
2，git push --set-upstream origin/mohan mohan || git push --set-upstream origin mohan
3，git push || git push origin || git push -u origin mohan

## 权限相关

    个人中心-personalCenter
        我的-personal
            我的工资条-mySalary
            业绩查询-performanceQuery
    人事系统-personnelSystem
        人事基础薪资-personnelBaseSalary
            未配置基础薪资-noConfig
            基础薪资总表-summaryTables
            基础薪资初始配置-initSetup
        人事收入-personnelIncome
            人事收入项-subsidy
            收入项设置-incomeItemsSetting
        其它-other
            五险一金-fiveSocialDed
            绩效工资-performanceDed
            孝敬费管理-filialPietyFee
            培训补助-trainSubsidy
    行政系统-administrativeSystem
        行政扣款项-administrativeDed
        住宿扣款项-dormitoryDed
        考勤扣款项-attendanceDed
    财务系统-financialSystem
        数据汇总台账-dataSummary
        绩效公式管理-formulaManage
        借支管理-loanPayManage
        个税管理-personalTaxManage
    公共系统-publicSystem
        调整款项管理-adjustMoneyManage
        特殊绩效-specialPerformance

### vue.config.js 路径别名的两种写法

#### 一普通写法

configureWebpack: {
resolve: {
// extensions: ['.js', '.vue', '.json'],
alias: {
"@": resolve('src'),
"components": resolve('src/components'),
"config": resolve('src/config'),
"http": resolve('src/http'),
"json": resolve('src/json'),
"libs": resolve('src/libs'),
"mock": resolve('src/mock'),
"plugins": resolve('src/plugins'),
"router": resolve('src/router'),
"store": resolve('src/store'),
"untils": resolve('src/untils'),
"views": resolve('src/views')
}
}
}

#### 二链式写法

chainWebpack: (config) => {
config.resolve.alias
.set('@', resolve('src'))
.set('components', resolve('src/components'))
.set('config', resolve('src/config'))
.set('http', resolve('src/http'))
.set('json', resolve('src/json'))
.set('libs', resolve('src/libs'))
.set('mock', resolve('src/mock'))
.set('plugins', resolve('src/plugins'))
.set('router', resolve('src/router'))
.set('store', resolve('src/store'))
.set('untils', resolve('src/untils'))
.set('views', resolve('src/views'))
}

### 设置私服 npm config set registry=http://nexus.yubang168.cn:8081/repository/npm-public
### 设置管理员私服 sudo npm config set registry=http://nexus.yubang168.cn:8081/repository/npm-public

### 该项目前端基于 vue+vue-router+vuex+element-ui+axios+babel+vue-cli3+webpack+postcss+lodash+es6 技术栈做开发(用 webpack-serve 做代理解决本地跨域联调问题)

### 老 oa 系统发测试前端代码地址/home/dev/fronts/public (ftp 地址 sftp://172.31.18.242,账号 root,密码 password)

### <style scoped src="libs/css/trainingSystem/test.css"></style> css 引入私有样式文件

### <style src="libs/css/trainingSystem/test.css"></style> css 引入通用样式文件

### 解决老系统登陆后 cookie 中 SESSION 不更新问题，一行代码解决，调用登录接口前\$.cookies.del('SESSION')

### 老 oa leftMenu.html 最后代码 foreach 替换 a 标签 link 带上 sessionId 到新 oa 系统

### git rm -r --cached vue.config.js
