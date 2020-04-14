import Vue from "vue"
import Vuex from "vuex"
import _map from "lodash/map"
import _flatten from "lodash/flatten"
import { GET } from "../http/custom"

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        // operationPermissions: {}, //菜单-员工id-按钮控制
        id: "", //员工id(张猛 墨含)
        // menusPermissions: [], //菜单权限(张猛 墨含)
        // elementsPermissions: [], //页面功能按钮控制权限(张猛 墨含)
        userCanVisitMenu: [], //老系统菜单
        oaGetTokenInfo: {}, //用户信息
        userActionAll: [], //老系统功能按钮
        level1Menu: [], //一级菜单
        level2Menu: [] //二级菜单
    },
    mutations: {
        setOaInfo(state, payload) {
            //菜单-员工id-按钮控制(张猛 墨含)
            // state.operationPermissions = payload
            state.id = payload.id
                // state.menusPermissions = _map(payload.menus, "code") //菜单权限
                // state.elementsPermissions = _map(payload.elements, "code") //页面功能按钮控制权限
        },
        setOaGetTokenInfo(state, payload) {
            //根据token获取用户信息
            state.oaGetTokenInfo = payload
        },
        setUserCanVisitMenus(state, payload) {
            //老系统获取菜单
            state.userCanVisitMenu = payload
            state.level1Menu = _map(payload, "modlesId") //一级菜单控制 modlesId
            state.level2Menu = _map(_flatten(_map(payload, "arrow")), "modlesId") //二级菜单控制 modlesId
        },
        setUserActionAll(state, payload) {
            //老系统获取功能按钮 action_id
            state.userActionAll = _map(payload, "action_id")
        }
    },
    actions: {
        getOaInfo({
            //菜单-员工id-按钮控制
            commit
        }) {
            GET(`${process.env.VUE_APP_DOMAIN_admin}/user/front/oa/info`)
                .then(res => {
                    commit("setOaInfo", res.data)
                })
                .catch(error => {
                    console.log(error)
                })
        },
        async oaGetTokenInfo({
            //根据token获取用户信息
            commit
        }) {
            const oaInfo = await GET(`${process.env.VUE_APP_DOMAIN_info}/oaGetTokenInfo`, {
                    token: localStorage.getItem("token")
                })
                .then(res => {
                    commit("setOaGetTokenInfo", res.data)
                    return res.data //返回res.data给oaInfo
                })
                .catch(error => {
                    console.log(error)
                })
            return oaInfo //返回oaInfo给调用该方法的then的res
        },
        getUserCanVisitMenus({
            //--老系统获取菜单 http://yboa.cs.hnyongxiong.com/oa-manage//systemModels/getUserCanVisitMenus.do
            commit
        }) {
            GET(`${process.env.VUE_APP_DOMAIN_oa_manage}/systemModels/getUserCanVisitMenus.do`)
                .then(res => {
                    let menusArr
                    res.Data.forEach(ele => {
                        if (ele.modlesId === "12c5cb4142cd43138193b507496e5a61") {
                            //判定如果是薪资系统
                            menusArr = ele.arrow
                        }
                    })
                    commit("setUserCanVisitMenus", menusArr) //只放入薪资系统对象
                })
                .catch(error => {
                    console.log(error)
                })
        },
        getUserActionAll({
            //--老系统获取功能按钮 http://yboa.cs.hnyongxiong.com/oa-manage/permission/getUserActionAll
            commit
        }) {
            GET(`${process.env.VUE_APP_DOMAIN_oa_manage}/permission/getUserActionAll`)
                .then(res => {
                    commit("setUserActionAll", res.Data)
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }
})