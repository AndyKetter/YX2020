/* eslint-disable no-console */
import Vue from 'vue' //导入vue
import Vuex from 'vuex' //导入vuex
import kingListModule from './modules/kingList' //导入王者榜modules
import reportsModule from './modules/reports' //导入统计报表modules
import evaluationModule from './modules/evaluation' //导入综合评分modules
import demoModule from './modules/demo' //导入demo modules
import appModule from './modules/app' //导入app modules
import mutations from './mutations' //导入根级别mutation
import actions from './actions' //导入根级别action
Vue.use(Vuex) //使用vuex

//定义根级别state
const state = {
    test1: 'test1',
    test2: 'test2',
    test3: 'test3',
    rootState: 8,
    rootStateP:88
}

//根级别store
const store = new Vuex.Store({
    state,
    mutations,
    actions,
    modules: {
        reports: reportsModule,
        evaluation: evaluationModule,
        kingList: kingListModule,
        demo: demoModule,
        app: appModule
    },
    getters: {
        doubleRootState(state) {
            //这里的state是根state
            console.log('根state',state)
            return state.rootState * 2
        }
    }
})

// vuex热重载代码
if(module.hot){
    //使action和mutation成为可热重载模块
    module.hot.accept(['./mutations','./modules/evaluation','./modules/kingList','./modules/reports','./modules/demo','./modules/app'],()=>{
        //获取更新后的模块
        //因为babel 6 的模块编译格式问题，这里需要加上`.default`
        const newMutations = require('./mutations').default
        const newReportsModule = require('./modules/reports').default
        const newKingListModule = require('./modules/kingList').default
        const newEvaluationModule = require('./modules/evaluation').default
        const newDemoModule = require('./modules/demo').default
        const newAppModule = require('./modules/app').default

        //加载模块
        store.hotUpdate({
            mutations: newMutations,
            module:{
                reports: newReportsModule,
                evaluation: newEvaluationModule,
                kingList: newKingListModule,
                demo: newDemoModule,
                app: newAppModule
            }
        })
    })
}

//导出store
export default store
