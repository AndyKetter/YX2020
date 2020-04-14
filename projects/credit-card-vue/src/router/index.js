//by mohan
//项目路由匹配规则

import Vue from 'vue' //引入vue
import VueRouter from 'vue-router' //引入路由vue-router
Vue.use(VueRouter) //使用路由

//下面定义路由匹配规则
const routes = [
    {
        name: 'myCase',
        path: '/myCase',
        component: () => import( /* webpackChunkName: "myCase" */ '../components/MyCase.vue')
    },
    {
        name: 'demo',
        path: '/demo',
        component: () => import( /* webpackChunkName: "demo" */ '../components/Demo.vue')
    },
    {
        name: 'mapDemo',
        path: '/mapDemo',
        component: () => import( /* webpackChunkName: "mapDemo" */ '../components/MapDemo.vue')
    },
    {
        name: 'home',
        path: '/home',
        component: () => import( /* webpackChunkName: "home" */ '../components/Home.vue'),
        children: [
            {
                name: 'index',
                path: 'index',
                component: () => import( /* webpackChunkName: "index" */ '../components/Index.vue')
            },
            {
                name: 'caseDatails',
                path: 'index/:id',
                component: () => import( /* webpackChunkName: "caseDatails" */ '../components/CaseDatails.vue')
            },
            {
                name: 'myPerformance',
                path: 'myPerformance',
                component: () => import( /* webpackChunkName: "myPerformance" */ '../components/MyPerformance.vue')
            },
            {
                name: 'businessPrimerHome',
                path: 'businessPrimerHome',
                component: () => import( /* webpackChunkName: "businessPrimerHome" */ '../components/BusinessPrimerHome.vue'),
                children:[
                    {
                        name: 'businessPrimer',
                        path: 'businessPrimer',
                        component: () => import( /* webpackChunkName: "businessPrimer" */ '../components/BusinessPrimer.vue')
                    },
                    {
                        name: 'businessPrimerDetail',
                        path: 'businessPrimer/:id',
                        component: () => import( /* webpackChunkName: "businessPrimerDetail" */ '../components/HelpDetail.vue')
                    },
                    {
                        name: 'myPush',
                        path: 'myPush',
                        component: () => import( /* webpackChunkName: "myPush" */ '../components/MyPush.vue')
                    },
                    {
                        name: 'MyPushDetail',
                        path: 'myPush/:id',
                        component: () => import( /* webpackChunkName: "MyPushDetail" */ '../components/MyPushDetail.vue')
                    },
                    {
                        name: 'classicsTalk',
                        path: 'classicsTalk',
                        component: () => import( /* webpackChunkName: "classicsTalk" */ '../components/classicsTalk.vue')
                    },
                    {
                        name: 'classicsTalkDetail',
                        path: 'classicsTalk/:id',
                        component: () => import( /* webpackChunkName: "classicsTalkDetail" */ '../components/classicsTalkDetail.vue')
                    },
                    {
                        name: 'cardRole',
                        path: 'cardRole',
                        component: () => import( /* webpackChunkName: "cardRole" */ '../components/cardRole.vue')
                    },
                    {
                        name: 'cardRoleDetail',
                        path: 'cardRole/:id',
                        component: () => import( /* webpackChunkName: "cardRoleDetail" */ '../components/cardRoleDetail.vue')
                    },
                    {
                        name: 'BusinessPrimerHomeEmpty',
                        path: '',
                        component: () => import( /* webpackChunkName: "BusinessPrimerHomeEmpty" */ '../components/BusinessPrimer.vue')
                    }
                ]
            },
            {
                name: 'kingList',
                path: 'kingList',
                component: () => import( /* webpackChunkName: "kingList" */ '../components/KingList.vue')
            },
            {
                name: 'evaluation',
                path: 'evaluation',
                component: () => import( /* webpackChunkName: "evaluation" */ '../components/Evaluation.vue')
            }, 
            {
                name: 'Reports',
                path: 'Reports',
                component: () => import( /* webpackChunkName: "Reports" */ '../components/Reports.vue'),
                children: [
                    {
                        name: 'ReportsIndex',
                        path: 'ReportsIndex',
                        component: () => import( /* webpackChunkName: "ReportsIndex" */ '../components/ReportsIndex.vue')
                    },
                    {
                        name: 'amountCount',
                        path: 'amountCount',
                        component: () => import( /* webpackChunkName: "amountCount" */ '../components/AmountCount.vue')
                    },
                    {
                        name: 'CaseProgress',
                        path: 'CaseProgress',
                        component: () => import( /* webpackChunkName: "CaseProgress" */ '../components/CaseProgress.vue')
                    },
                    {
                        name: 'DailyBill',
                        path: 'DailyBill',
                        component: () => import( /* webpackChunkName: "DailyBill" */ '../components/DailyBill.vue')
                    }, 
                    {
                        name: 'stWork',
                        path: 'stWork',
                        component: () => import( /* webpackChunkName: "stWork" */ '../components/StWork.vue')
                    },
                    {
                        name: 'alCase',
                        path: 'alCase',
                        component: () => import( /* webpackChunkName: "alCase" */ '../components/AlCase.vue')
                    },
                    {
                        name: 'ReportsIndex',
                        path: '',
                        component: () => import( /* webpackChunkName: "ReportsIndex" */ '../components/ReportsIndex.vue')
                    }
                ]
            },
            {
                name: 'evaluationCrew',
                path: 'evaluationCrew',
                component: () => import( /* webpackChunkName: "evaluationCrew" */ '../components/EvaluationCrew.vue')
            },
            {
                path: '/*',
                component: () => import( /* webpackChunkName: "Index" */ '../components/Index.vue')
            }
        ]
    }
]
//export暴露供其他Js文件使用(es6模块化)
export default new VueRouter({
    routes
})