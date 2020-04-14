// create by zc 2019-11-03
// 作者专用
// 主要用于开发模块时，多个模块需用到统一方法
// 此模块用于人事异动组织架构
import { GET } from "http/custom.js"
export default {
    data() {
        return {
            companyCollection: new Map(), //作业中心集合
            caseTypeCollection: new Map(), //案件类型集合
            levelCollection: new Map() //职务集合
        }
    },
    filters: {
        //   过滤手机号码
        filterPhone(str) {
            if (str) {
                return str.replace(/(\d{3})\d+(\d{4})/g, "$1****$2")
            }
            return str
        }
    },
    computed: {
        // 通过职务code获取职务名称
        getLevelLabel() {
            return level => {
                const obj = this.levelCollection.get(level)
                if (obj) {
                    return obj.pname
                }
                return ""
            }
        },
        // 组织树结构node名称
        getLabel() {
            return data => {
                const obj = this.levelCollection.get(data.pcd)
                return `(${(obj && obj.pname) || ""}) ${data.cgurfactname || ""} ${data.employedNo || ""}`
            }
        },
        // 待配置 成员名称
        getConfigLabel() {
            return data => {
                const pcd = this.levelCollection.get(Number(data.userLevel))
                return `(${(pcd && pcd.pname) || ""}) ${data.userFactName || ""} ${data.employedNo || ""}`
            }
        },
        // 配置弹层 各成员option名称
        getConfigLabelModal() {
            return data => {
                const pcd = this.levelCollection.get(Number(data.positionCode))
                return ` (${(pcd && pcd.pname) || ""}) ${data.cgurFactname || ""} ${data.employedNo || ""}`
            }
        },
        // 成员涉及的业务类型
        // 业务员所在的作业中心名称
        getCompanyLabel() {
            return ccd => {
                const v = this.companyCollection.get(ccd)
                return (v && v.cname) || ""
            }
        }
    },
    created() {
        this.common_HrDictionaryId()
    },
    methods: {
        /**
         *获取当月组织架构list
         * @param {Object} param0
         * userType(1:部门内部架构管理,2:集团内部架构管理,3:区域内部架构管理,4:业务部组织架构管理)
         * lazyLoad(1:加载前2层数据,不传或0:加载所有数据)
         */
        common_getCurrentGroupData({ userType = 1, lazyLoad = 0 }) {
            return GET(process.env.VUE_APP_DOMAIN_personnel + "/uplevel/getUserTree", { userType, lazyLoad }).catch(error => {
                console.log(error)
            })
        },
        /**
         * 获取下月组织架构list
         * @param {Object} param0
         * userType(1:部门内部架构管理,2:集团内部架构管理,3:区域内部架构管理,4:业务部组织架构管理)
         * lazyLoad(1:加载前2层数据,不传或0:加载所有数据)
         */
        common_getNextGroupData({ userType = 1, lazyLoad = 0 }) {
            return GET(process.env.VUE_APP_DOMAIN_personnel + "/uplevel/getPreviewUserTree", { userType, lazyLoad }).catch(error => {
                console.log(error)
            })
        },
        // 获取当月组织结构节点(用于懒加载) 该成员下属节点
        common_getCurrentGroupsNode({ regId }) {
            return GET(process.env.VUE_APP_DOMAIN_personnel + "/uplevel/getCurrMonthLeafNode", { regId }).catch(error => {
                console.log(error)
            })
        },
        // 获取下月组织结构节点(用于懒加载) 该成员下属节点
        common_getNextGroupsNode({ regId }) {
            return GET(process.env.VUE_APP_DOMAIN_personnel + "/uplevel/getNextMonthLeafNode", { regId }).catch(error => {
                console.log(error)
            })
        },
        // 通过regid获取当前成员的所有下级成员的当月组织结构
        common_getCurrentGroupsDataById({ regId, lazyLoad }) {
            return GET(process.env.VUE_APP_DOMAIN_personnel + "/uplevel/getCurrentTreeDataByRegId", { regId, lazyLoad }).catch(console.log)
        },
        // 通过regid获取当前成员的所有下级成员的下月组织结构
        common_getNextGroupDataById({ regId, lazyLoad }) {
            return GET(process.env.VUE_APP_DOMAIN_personnel + "/uplevel/getNextTreeDataByRegId", { regId, lazyLoad }).catch(console.log)
        },
        // 获取作业中心、业务类型及职务数据集合
        common_HrDictionaryId() {
            GET(process.env.VUE_APP_DOMAIN_personnel + "/uplevel/queryHrDictionaryId").then(res => {
                console.log("获取作业中心、业务类型及职务数据集合", res)
                if (!res.data) return
                if (Array.isArray(res.data.companyList)) {
                    const m = new Map()
                    res.data.companyList.forEach(ele => {
                            m.set(ele.cid, ele)
                        })
                        // console.log("获取作业中心数据集合", m)
                    this.companyCollection = m
                }
                if (Array.isArray(res.data.caseTypeList)) {
                    const m = new Map()
                    res.data.caseTypeList.forEach(ele => {
                            m.set(ele.typeId, ele)
                        })
                        // console.log("获取业务类型数据集合", m)
                    this.caseTypeCollection = m
                }
                if (Array.isArray(res.data.positionList)) {
                    const m = new Map()
                    res.data.positionList.forEach(ele => {
                            if (ele.pid === 0) {
                                ele.pname = "员工"
                            }
                            m.set(ele.pid, ele)
                        })
                        // console.log("获取职务数据集合", m)
                    this.levelCollection = m
                }
            })
        }
    }
}