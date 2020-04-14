import Vue from "vue"
import Router from "vue-router"

Vue.use(Router)

export default new Router({
    routes: [{
            path: "/home",
            name: "home",
            meta: {
                title: "永雄oa办公系统"
            },
            component: () =>
                import ( /* webpackChunkName: "home" */ "@/views/Home.vue"),
            children: [{
                    //个人中心
                    path: "personalCenter",
                    name: "personalCenter",
                    meta: {
                        title: "个人中心"
                    },
                    component: () =>
                        import (
                            /* webpackChunkName: "personalCenter" */
                            "views/personalCenter/PersonalCenter.vue"
                        ),
                    children: [{
                            name: "personalCenterHome",
                            path: "personalCenterHome",
                            meta: {
                                title: "个人中心导航页"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "personalCenter" */
                                    "views/personalCenter/PersonalCenterHome.vue"
                                )
                        },
                        {
                            name: "performanceQuery",
                            path: "performanceQuery",
                            meta: {
                                title: "业绩查询"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "personalCenter" */
                                    "views/personalCenter/PerformanceQuery.vue"
                                )
                        },
                        {
                            name: "performanceQueryDetail",
                            path: "performanceQueryDetail",
                            meta: {
                                title: "团队业绩详情"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "personalCenter" */
                                    "views/personalCenter/PerformanceQueryDetail.vue"
                                )
                        },
                        {
                            name: "mySalary",
                            path: "mySalary",
                            meta: {
                                title: "我的工资条"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "personalCenter" */
                                    "views/personalCenter/MySalary.vue"
                                )
                        },
                        {
                            name: "infoCollect",
                            path: "infoCollect",
                            meta: {
                                title: "学历提升信息采集"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "personalCenter" */
                                    "views/personalCenter/InfoCollect.vue"
                                )
                        },
                        {
                            name: "educationPromotion",
                            path: "educationPromotion",
                            meta: {
                                title: "学历提升"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "personalCenter" */
                                    "views/personalCenter/EducationPromotion.vue"
                                )
                        },
                        {
                            name: "meetingManage",
                            path: "meetingManage",
                            meta: {
                                title: "会议纪要管理"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "personalCenter" */
                                    "views/personalCenter/MeetingManage.vue"
                                )
                        },
                        {
                            name: "personalEmpty",
                            path: "",
                            meta: {
                                title: "个人中心导航页"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "personalCenter" */
                                    "views/personalCenter/PersonalCenterHome.vue"
                                )
                        }
                    ]
                },
                {
                    //人事系统
                    path: "personnelSystem",
                    name: "personnelSystem",
                    meta: {
                        title: "人事系统"
                    },
                    component: () =>
                        import (
                            /* webpackChunkName: "personnelSystem" */
                            "views/personnelSystem/PersonnelSystem.vue"
                        ),
                    children: [{
                            name: "personnelSystemHome",
                            path: "personnelSystemHome",
                            meta: {
                                title: "人事系统导航页"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "personnelSystem" */
                                    "views/personnelSystem/PersonnelSystemHome.vue"
                                )
                        },
                        {
                            name: "noConfig",
                            path: "noConfig",
                            meta: {
                                title: "未配置基础薪资"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "personnelSystem" */
                                    "views/personnelSystem/NoConfig.vue"
                                )
                        },
                        {
                            path: "subsidy",
                            name: "subsidy",
                            meta: {
                                title: "人事收入项"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "personnelSystem" */
                                    "views/personnelSystem/Subsidy.vue"
                                )
                        },
                        {
                            path: "incomeItemsSetting",
                            name: "incomeItemsSetting",
                            meta: {
                                title: "收入项设置"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "personnelSystem" */
                                    "views/personnelSystem/IncomeItemsSetting.vue"
                                )
                        },
                        {
                            path: "fiveSocialDed",
                            name: "fiveSocialDed",
                            meta: {
                                title: "五险一金"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "personnelSystem" */
                                    "views/personnelSystem/FiveSocialDed.vue"
                                )
                        },

                        {
                            path: "performanceDed",
                            name: "performanceDed",
                            meta: {
                                title: "绩效工资"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "personnelSystem" */
                                    "views/personnelSystem/PerformanceDed.vue"
                                )
                        },
                        {
                            path: "trainSubsidy",
                            name: "trainSubsidy",
                            meta: {
                                title: "培训补助"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "personnelSystem" */
                                    "views/personnelSystem/TrainSubsidy.vue"
                                )
                        },
                        {
                            path: "filialPietyFee",
                            name: "filialPietyFee",
                            meta: {
                                title: "孝敬费管理"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "personnelSystem" */
                                    "views/personnelSystem/FilialPietyFee.vue"
                                )
                        },
                        {
                            path: "talent",
                            name: "talent",
                            meta: {
                                title: "人才引进"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "personnelSystem" */
                                    "views/personnelSystem/Talent.vue"
                                )
                        },
                        {
                            path: "summaryTables",
                            name: "summaryTables",
                            meta: {
                                title: "基础薪资总表"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "personnelSystem" */
                                    "views/personnelSystem/SummaryTables.vue"
                                )
                        },
                        {
                            path: "initSetup",
                            name: "initSetup",
                            meta: {
                                title: "基础薪资初始配置"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "personnelSystem" */
                                    "views/personnelSystem/InitSetup.vue"
                                )
                        },
                        {
                            path: "trainManager",
                            name: "trainManager",
                            meta: {
                                title: "培训管理"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "personnelSystem" */
                                    "views/personnelSystem/TrainManager.vue"
                                )
                        },
                        {
                            path: "structureChange",
                            name: "structureChange",
                            meta: {
                                title: "人员异动"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "personnelSystem" */
                                    "views/personnelSystem/StructureChange.vue"
                                )
                        },
                        {
                            path: "businessChangeStatistics",
                            name: "businessChangeStatistics",
                            meta: {
                                title: "业务部异动统计"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "personnelSystem" */
                                    "views/personnelSystem/BusinessChangeStatistics.vue"
                                )
                        },
                        {
                            name: "personnelEmpty",
                            path: "",
                            meta: {
                                title: "人事系统导航页"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "personnelSystem" */
                                    "views/personnelSystem/PersonnelSystemHome.vue"
                                )
                        }
                    ]
                },
                {
                    //行政系统
                    path: "administrativeSystem",
                    name: "administrativeSystem",
                    meta: {
                        title: "行政系统"
                    },
                    component: () =>
                        import (
                            /* webpackChunkName: "administrativeSystem" */
                            "views/administrativeSystem/AdministrativeSystem.vue"
                        ),
                    children: [{
                            name: "administrativeSystemHome",
                            path: "administrativeSystemHome",
                            meta: {
                                title: "行政系统导航页"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "administrativeSystem" */
                                    "views/administrativeSystem/AdministrativeSystemHome.vue"
                                )
                        },
                        {
                            path: "attendanceDed",
                            name: "attendanceDed",
                            meta: {
                                title: "考勤扣款项"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "administrativeSystem" */
                                    "views/administrativeSystem/AttendanceDed.vue"
                                )
                        },
                        {
                            path: "administrativeDed",
                            name: "administrativeDed",
                            meta: {
                                title: "行政扣款项"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "administrativeSystem" */
                                    "views/administrativeSystem/AdministrativeDed.vue"
                                )
                        },
                        {
                            path: "dormitoryDed",
                            name: "dormitoryDed",
                            meta: {
                                title: "住宿扣款项"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "administrativeSystem" */
                                    "views/administrativeSystem/DormitoryDed.vue"
                                )
                        },
                        {
                            path: "headsetManage",
                            name: "headsetManage",
                            meta: {
                                title: "耳机管理"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "administrativeSystem" */
                                    "views/administrativeSystem/HeadsetManage.vue"
                                )
                        },
                        {
                            path: "standingJindie",
                            name: "standingJindie",
                            meta: {
                                title: "金蝶台账"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "administrativeSystem" */
                                    "views/administrativeSystem/StandingJindie.vue"
                                )
                        },
                        {
                            path: "administrativeStanding",
                            name: "administrativeStanding",
                            meta: {
                                title: "行政台账"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "administrativeSystem" */
                                    "views/administrativeSystem/AdministrativeStanding.vue"
                                )
                        },
                        {
                            name: "administrativeSystemEmpty",
                            path: "",
                            meta: {
                                title: "行政系统导航页"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "administrativeSystem" */
                                    "views/administrativeSystem/AdministrativeSystemHome.vue"
                                )
                        }
                    ]
                },
                {
                    //财务系统
                    path: "financialSystem",
                    name: "financialSystem",
                    meta: {
                        title: "财务系统"
                    },
                    component: () =>
                        import (
                            /* webpackChunkName: "financialSystem" */
                            "views/financialSystem/FinancialSystem.vue"
                        ),
                    children: [{
                            name: "financialSystemHome",
                            path: "financialSystemHome",
                            meta: {
                                title: "财务系统导航页"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "financialSystem" */
                                    "views/financialSystem/FinancialSystemHome.vue"
                                )
                        },
                        {
                            path: "formulaManage",
                            name: "formulaManage",
                            meta: {
                                title: "绩效公式管理"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "financialSystem" */
                                    "views/financialSystem/FormulaManage.vue"
                                )
                        },
                        {
                            path: "dataSummary",
                            name: "dataSummary",
                            meta: {
                                title: "数据汇总台账"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "financialSystem" */
                                    "views/financialSystem/DataSummary.vue"
                                ),
                            children: [{
                                    path: "dataSummaryInfo",
                                    name: "dataSummaryInfo",
                                    meta: {
                                        title: "数据汇总台账"
                                    },
                                    component: () =>
                                        import (
                                            /* webpackChunkName: "financialSystem" */
                                            "views/financialSystem/DataSummaryInfo.vue"
                                        )
                                },
                                {
                                    path: "dataSummaryDetail",
                                    name: "dataSummaryDetail",
                                    meta: {
                                        title: "工资条明细"
                                    },
                                    component: () =>
                                        import (
                                            /* webpackChunkName: "financialSystem" */
                                            "views/financialSystem/DataSummaryDetail.vue"
                                        )
                                },
                                {
                                    path: "",
                                    name: "dataSummaryInfo",
                                    meta: {
                                        title: "数据汇总台账"
                                    },
                                    component: () =>
                                        import (
                                            /* webpackChunkName: "financialSystem" */
                                            "views/financialSystem/DataSummaryInfo.vue"
                                        )
                                }
                            ]
                        },
                        {
                            path: "loanPayManage",
                            name: "loanPayManage",
                            meta: {
                                title: "借支管理"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "financialSystem" */
                                    "views/financialSystem/LoanPayManage.vue"
                                )
                        },
                        {
                            path: "personalTaxManage",
                            name: "personalTaxManage",
                            meta: {
                                title: "个税管理"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "financialSystem" */
                                    "views/financialSystem/PersonalTaxManage.vue"
                                )
                        },
                        {
                            path: "contractManage",
                            name: "contractManage",
                            meta: {
                                title: "合同管理"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "financialSystem" */
                                    "views/financialSystem/ContractManage.vue"
                                )
                        },
                        {
                            name: "financialSystemEmpty",
                            path: "",
                            meta: {
                                title: "财务系统导航页"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "financialSystem" */
                                    "views/financialSystem/FinancialSystemHome.vue"
                                )
                        }
                    ]
                },
                {
                    //公共系统
                    path: "publicSystem",
                    name: "publicSystem",
                    meta: {
                        title: "公共系统"
                    },
                    component: () =>
                        import (
                            /* webpackChunkName: "publicSystem" */
                            "views/publicSystem/PublicSystem.vue"
                        ),
                    children: [{
                            name: "publicSystemHome",
                            path: "publicSystemHome",
                            meta: {
                                title: "公共系统导航页"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "publicSystem" */
                                    "views/publicSystem/PublicSystemHome.vue"
                                )
                        },
                        {
                            path: "adjustMoneyManage",
                            name: "adjustMoneyManage",
                            meta: {
                                title: "调整款项管理"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "publicSystem" */
                                    "views/publicSystem/AdjustMoneyManage.vue"
                                )
                        },
                        {
                            name: "specialPerformance",
                            path: "specialPerformance",
                            meta: {
                                title: "特殊绩效"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "publicSystem" */
                                    "views/publicSystem/SpecialPerformance.vue"
                                )
                        },
                        {
                            name: "identityQuery",
                            path: "identityQuery",
                            meta: {
                                title: "信息查询"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "publicSystem" */
                                    "views/publicSystem/IdentityQuery.vue"
                                )
                        },
                        {
                            name: "publicSystemEmpty",
                            path: "",
                            meta: {
                                title: "公共系统导航页"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "publicSystem" */
                                    "views/publicSystem/PublicSystemHome.vue"
                                )
                        }
                    ]
                },
                {
                    //综合性运营系统
                    path: "cphOprionSystem",
                    name: "cphOprionSystem",
                    meta: {
                        title: "综合性运营系统"
                    },
                    component: () =>
                        import (
                            /* webpackChunkName: "cphOprionSystem" */
                            "views/cphOprionSystem/CphOprionSystem.vue"
                        ),
                    children: [{
                            name: "cphOprionSystemHome",
                            path: "cphOprionSystemHome",
                            meta: {
                                title: "综合性运营系统导航页"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "cphOprionSystem" */
                                    "views/cphOprionSystem/CphOprionSystemHome.vue"
                                )
                        },
                        {
                            name: "comprehensiveOperation",
                            path: "comprehensiveOperation",
                            meta: {
                                title: "综合性运营数据"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "cphOprionSystem" */
                                    "views/cphOprionSystem/ComprehensiveOperation.vue"
                                )
                        },
                        {
                            name: "cphOprionSystemEmpty",
                            path: "",
                            meta: {
                                title: "综合性运营系统导航页"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "cphOprionSystem" */
                                    "views/cphOprionSystem/CphOprionSystemHome.vue"
                                )
                        }
                    ]
                },
                {
                    //风险控制
                    path: "riskControl",
                    name: "riskControl",
                    meta: {
                        title: "风险控制"
                    },
                    component: () =>
                        import (
                            /* webpackChunkName: "riskControl" */
                            "views/riskControl/RiskControl.vue"
                        ),
                    children: [{
                            name: "riskControlHome",
                            path: "riskControlHome",
                            meta: {
                                title: "风险控制导航页"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "riskControl" */
                                    "views/riskControl/RiskControlHome.vue"
                                )
                        },
                        {
                            name: "rewardAndPublish",
                            path: "rewardAndPublish",
                            meta: {
                                title: "奖惩系统"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "riskControl" */
                                    "views/riskControl/RewardAndPublish.vue"
                                )
                        },
                        {
                            name: "riskControlEmpty",
                            path: "",
                            meta: {
                                title: "风险控制导航页"
                            },
                            component: () =>
                                import (
                                    /* webpackChunkName: "riskControl" */
                                    "views/riskControl/RiskControlHome.vue"
                                )
                        }
                    ]
                }
            ]
        },
        {
            path: "/yxCollege",
            name: "yxCollege",
            meta: {
                title: "永雄学院"
            },
            component: () =>
                import (
                    /* webpackChunkName: "yxCollege" */
                    "views/yxCollege/YxCollege.vue"
                ),
            children: [{
                    name: "home",
                    path: "home",
                    meta: {
                        title: "永雄学院"
                    },
                    component: () =>
                        import (
                            /* webpackChunkName: "yxCollege" */
                            "views/yxCollege/Home.vue"
                        )
                },
                {
                    name: "collegeClassify",
                    path: "collegeClassify/:id",
                    meta: {
                        title: "学院分类"
                    },
                    component: () =>
                        import (
                            /* webpackChunkName: "yxCollege" */
                            "views/yxCollege/CollegeClassify.vue"
                        )
                },
                {
                    name: "collegeClassifyDetail",
                    path: "collegeClassifyDetail/:id",
                    meta: {
                        title: "学院分类-课程详情"
                    },
                    component: () =>
                        import (
                            /* webpackChunkName: "yxCollege" */
                            "views/yxCollege/CollegeClassifyDetail.vue"
                        )
                },
                {
                    name: "quickSearch",
                    path: "quickSearch",
                    meta: {
                        title: "快速搜索"
                    },
                    component: () =>
                        import (
                            /* webpackChunkName: "yxCollege" */
                            "views/yxCollege/QuickSearch.vue"
                        )
                },
                {
                    name: "yxPersonalCenter",
                    path: "yxPersonalCenter",
                    meta: {
                        title: "永雄学院-个人中心"
                    },
                    component: () =>
                        import (
                            /* webpackChunkName: "yxCollege" */
                            "views/yxCollege/PersonalCenter.vue"
                        )
                },
                {
                    name: "live",
                    path: "live",
                    meta: {
                        title: "永雄学院-直播"
                    },
                    component: () =>
                        import (
                            /* webpackChunkName: "yxCollege" */
                            "views/yxCollege/Live.vue"
                        )
                },
                {
                    name: "goldCase",
                    path: "goldCase",
                    meta: {
                        title: "永雄学院-金牌案例"
                    },
                    component: () =>
                        import (
                            /* webpackChunkName: "yxCollege" */
                            "views/yxCollege/GoldCase.vue"
                        )
                },
                {
                    name: "goldCaseDetail",
                    path: "goldCase/:id",
                    meta: {
                        title: "永雄学院-金牌案例详情"
                    },
                    component: () =>
                        import (
                            /* webpackChunkName: "yxCollege" */
                            "views/yxCollege/GoldCaseDetail.vue"
                        )
                },
                {
                    name: "lecturer",
                    path: "lecturer",
                    meta: {
                        title: "永雄学院-讲师风采"
                    },
                    component: () =>
                        import (
                            /* webpackChunkName: "yxCollege" */
                            "views/yxCollege/Lecturer.vue"
                        )
                },
                {
                    name: "lecturerDetail",
                    path: "lecturer/:id",
                    meta: {
                        title: "永雄学院-讲师风采详情"
                    },
                    component: () =>
                        import (
                            /* webpackChunkName: "yxCollege" */
                            "views/yxCollege/LecturerDetail.vue"
                        )
                },
                {
                    name: "yxCollegeEmpty",
                    path: "",
                    meta: {
                        title: "永雄学院"
                    },
                    redirect: "/yxCollege/home"
                }
            ]
        },
        {
            path: "/newEmployeeCourse",
            name: "newEmployeeCourse",
            meta: {
                title: "新员工课程"
            },
            component: () =>
                import (
                    /* webpackChunkName: "yxCollege" */
                    "views/yxCollege/NewEmployeeCourse.vue"
                )
        },
        {
            path: "/newEmployeeCourseDetail/:id",
            name: "newEmployeeCourseDetail",
            meta: {
                title: "新员工课程详情"
            },
            component: () =>
                import (
                    /* webpackChunkName: "yxCollege" */
                    "views/yxCollege/NewEmployeeCourseDetail.vue"
                )
        },
        {
            path: "/test",
            name: "test",
            meta: {
                title: "测试页"
            },
            component: () =>
                import ( /* webpackChunkName: "test" */ "@/views/test.vue")
        },
        {
            path: "/404",
            name: "404",
            meta: {
                title: "404"
            },
            component: () =>
                import (
                    /* webpackChunkName: "errorPage" */
                    "@/views/errorPage/404.vue"
                )
        },
        {
            path: "*",
            redirect: "/404"
        }
    ]
})