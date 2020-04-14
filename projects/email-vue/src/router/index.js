/* eslint-disable no-undef */
// import Vue from 'vue'
// import VueRouter from 'vue-router'

// Vue.use(VueRouter)

export default new VueRouter({
    routes: [
        {
            path: '/home',
            name: 'home',
            component: () => import( /* webpackChunkName: "home" */ '../views/Home.vue'),
            children:[
                {
                    name: 'inbox',
                    path: 'inbox',
                    meta: {title:'收件箱'},
                    component: () => import( /* webpackChunkName: "inbox" */ '../views/Inbox.vue')
                },
                {
                    path: '',
                    meta: {title:'收件箱'},
                    component: () => import( /* webpackChunkName: "inbox" */ '../views/Inbox.vue')
                },
                {
                    name: 'inboxDatails',
                    path: 'inbox/:id',
                    meta: {title:'收件箱详情'},
                    component: () => import( /* webpackChunkName: "inbox" */ '../views/inboxDatails.vue')
                },
                {
                    name: 'draft',
                    path: 'draft',
                    meta: {title:'草稿箱'},
                    component: () => import( /* webpackChunkName: "draft" */ '../views/Draft.vue')
                },
                {
                    name: 'draftDatails',
                    path: 'draft/:id',
                    meta: {title:'草稿箱详情'},
                    component: () => import( /* webpackChunkName: "draft" */ '../views/inboxDatails.vue')
                },
                {
                    name: 'sent',
                    path: 'sent',
                    meta: {title:'已发送'},
                    component: () => import( /* webpackChunkName: "sent" */ '../views/Sent.vue')
                },
                {
                    name: 'sentDatails',
                    path: 'sent/:id',
                    meta: {title:'已发送详情'},
                    component: () => import( /* webpackChunkName: "sent" */ '../views/inboxDatails.vue')
                },
                {
                    name: 'recycle',
                    path: 'recycle',
                    meta: {title:'回收站'},
                    component: () => import( /* webpackChunkName: "recycle" */ '../views/Recycle.vue')
                },
                {
                    name: 'recycleDatails',
                    path: 'recycle/:id',
                    meta: {title:'回收站详情'},
                    component: () => import( /* webpackChunkName: "recycle" */ '../views/inboxDatails.vue')
                },
                {
                    name: 'write',
                    path: 'write',
                    meta: {title:'写邮件'},
                    component: () => import( /* webpackChunkName: "write" */ '../views/Write.vue')
                }
            ]
        },
        {
            path: '/login',
            name: 'login',
            meta: {title:'登录'},
            // route level code-splitting
            // this generates a separate chunk (login.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import( /* webpackChunkName: "login" */ '../views/Login.vue')
        },
        {
            path: '/*',
            meta: {title:'登录'},
            component: () => import( /* webpackChunkName: "login" */ '../views/Login.vue')
        }
    ]
})
