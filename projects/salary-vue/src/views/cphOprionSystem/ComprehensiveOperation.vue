<template>
  <!--综合性运营数据  -->
  <div class="comprehensiveOperation">
    <div class="guide">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home/cphOprionSystem'}">综合性运营系统</el-breadcrumb-item>
        <el-breadcrumb-item>综合性运营数据</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/cphOprionSystem'}">(返回上级)</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="bgWhite mgt15">
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="汇总一览表" name="first" v-if="isRoot(rootCode['汇总一览表tab'])">
          <com-ope-gather ref="mychild" v-if="loadMap.has('first')" :dataListObj="{dataInfo:dataObj}"></com-ope-gather>
        </el-tab-pane>
        <el-tab-pane label="业务系统" name="second" v-if="isRoot(rootCode['业务系统tab'])">
          <com-ope-business v-if="loadMap.has('second')" :dataListObj="{dataInfo:dataObj}"></com-ope-business>
        </el-tab-pane>
        <el-tab-pane label="财务系统" name="third" v-if="isRoot(rootCode['财务系统tab'])">
          <com-ope-finance v-if="loadMap.has('third')" :dataListObj="{dataInfo:dataObj}"></com-ope-finance>
        </el-tab-pane>
        <el-tab-pane label="人事系统" name="fourth" v-if="isRoot(rootCode['人事系统tab'])">
          <com-ope-personnel v-if="loadMap.has('fourth')" :dataListObj="{dataInfo:dataObj}"></com-ope-personnel>
        </el-tab-pane>
        <el-tab-pane label="分子公司系统" name="fifth" v-if="isRoot(rootCode['分子公司系统tab'])">
          <com-ope-subsidiary v-if="loadMap.has('fifth')" :dataListObj="{dataInfo:dataObj}"></com-ope-subsidiary>
        </el-tab-pane>
        <el-tab-pane label="配置业务类型" name="sixth" v-if="isRoot(rootCode['配置业务类型tab'])">
          <com-ope-config v-if="loadMap.has('sixth')" :dataListObj="{dataInfo:dataObj}"></com-ope-config>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import ComOpeGather from "components/comopeComponents/ComopeGather" // 汇总一览表
import comOpeBusiness from "components/comopeComponents/ComopeBusiness" // 业务系统
import ComOpeFinance from "components/comopeComponents/ComopeFinance" // 财务系统
import ComOpeSubsidiary from "components/comopeComponents/ComopeSubsidiary" // 分子公司系统
import ComOpePersonnel from "components/comopeComponents/ComopePersonnel" // 人事部系统
import ComOpeConfig from "components/comopeComponents/ComopeConfig" // 配置业务类型
import { GET, POST } from "http/custom.js"
import Tools from "untils/index.js"

export default {
  name: "comprehensiveOperation",
  components: {
    ComOpeGather,
    comOpeBusiness,
    ComOpeFinance,
    ComOpeSubsidiary,
    ComOpePersonnel,
    ComOpeConfig
  },
  inject: ["reload", "count"], //获取上层组件的provide
  data() {
    return {
      loadMap: new Map(), //记录tab页是否打开过了
      activeName: "first",
      dataObj: {
        //给子组件的数据集合
        t_height: Tools.getTbHeight(315), //设置表格的高
        t_gather_height: Tools.getTbHeight(248), //设置汇总一览表
        deptInfo: [], //所有部门
        userDeptInfo: [] //个人所在部门
      },
      //oa系统中配置的权限 id
      rootCode: {
        汇总一览表tab: "100bff24fcae40abb89e62abd62eec73",
        业务系统tab: "ba817f3d35df4a22bb3d615ab3d31ab6",
        财务系统tab: "65fd52f6ab614c6d92805b7a321c7e68",
        人事系统tab: "8b4085ab23844187a2ec727e2f68eb41",
        分子公司系统tab: "597e70598e634c5a9f970c29cef23fef",
        配置业务类型tab: "dcb2850cc25e4ecc8e7c0ddd4750f58f"
      }
    }
  },
  computed: {
    isRoot() {
      //通过老oa配置的id,判断当前 用户是否有对应的权限
      return idCode => {
        return Tools.includes(this.$store.state.level2Menu, idCode)
      }
    }
  },
  created() {
    this.activeName = this.openTab()
    this.loadMap.set(this.activeName, true) //记录第一个tab页已经加载
    this.tabShow()

    // 如果没有权限勾选的 tab页，限定循环加载次数
    if (this.activeName === '' && this.count() < 6) {
      setTimeout(() => {
        this.reload() //重新刷新组件
      }, 50)
    }
  },
  methods: {
    openTab() {
      //打开权限中勾选的第一个tab
      const object = this.rootCode
      let tabName = "";
      let tab = "";
      let i = 0;
      for (const key in object) {
        if (object.hasOwnProperty(key)) {
          tabName = key.toString()
          if (tabName === "汇总一览表tab" && this.isRoot(object[tabName])) {
            return (tab = "first")
          } else if (tabName === "业务系统tab" && this.isRoot(object[tabName])) {
            return (tab = "second")
          } else if (tabName === "财务系统tab" && this.isRoot(object[tabName])) {
            return (tab = "third")
          } else if (tabName === "人事系统tab" && this.isRoot(object[tabName])) {
            return (tab = "fourth")
          } else if (tabName === "分子公司系统tab" && this.isRoot(object[tabName])) {
            return (tab = "fifth")
          } else if (tabName === "配置业务类型tab" && this.isRoot(object[tabName])) {
            return (tab = "sixth")
          }
        }
        i++;
        if (i === 6) { //所有页签判断完没有时返回 ''
          return tab;
        }
      }
    },
    tabShow() {
      switch (this.activeName) {
        case "first":
          if (this.$refs.mychild) {
            this.$refs.mychild.search() //调用子组件的方法
            this.$refs.mychild.getSystemName() //调用子组件的方法
          }
          return false
        case "second":
          console.log("second")
          return false
        case "third":
          console.log("third")
          return false
        case "fourth":
          console.log("fourth")
          return false
        case "fifth":
          console.log("fifth")
          return false
        case "sixth":
          console.log("sixth")
          return false
        default:
          console.log("无匹配页！")
          return false
      }
    },
    handleClick(tab) {
      //tab页切换 只有第一次页面切换时初始化数据
      //判断页面是否打开过
      if (tab.name === "first") { //第一个页面的数据是汇总页，只要打开就刷新数据 
        this.tabShow()
      } else if (!this.loadMap.has(tab.name)) {
        this.tabShow()
        this.loadMap.set(tab.name, true)
      }
    },
    getDept() {
      //获取全部部门
      POST(process.env.VUE_APP_DOMAIN_personnel + "/queryDepartmentList", {})
        .then(res => {
          this.dataObj.deptInfo = res.data
        })
        .catch(() => {
          this.dataObj.deptInfo = []
        })
    },
    getUserDept() {
      //获取个人所在部门
      GET(process.env.VUE_APP_DOMAIN_personnel + "/personnel/adjustmentitem/userDept", {})
        .then(res => {
          this.dataObj.userDeptInfo = res.data
        })
        .catch(() => {
          this.dataObj.userDeptInfo = []
        })
    }
  }
}
</script>

<style scoped>
</style>