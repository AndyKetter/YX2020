<template>
  <!--合同管理  -->
  <div class="contract-manage">
    <div class="guide">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home/financialSystem'}">合同管理</el-breadcrumb-item>
        <el-breadcrumb-item>合同管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/financialSystem'}">(返回上级)</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="bgWhite mgt15">
      <el-tabs v-loading="loading" v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="合同管理" name="first" v-if="isRoot(rootCode['合同管理TAB'])">
          <contract-first
            ref="mychildMain"
            v-if="loadMap.has('first')"
            :isRootUserActionAll="isRootUserActionAll"
            :countFunc="JS_count"
            :dataListObj="dataObj"
          ></contract-first>
        </el-tab-pane>
        <el-tab-pane label="往来单位" name="second" v-if="isRoot(rootCode['往来单位TAB'])">
          <unit-second v-if="loadMap.has('second')" :dataListObj="dataObj"></unit-second>
        </el-tab-pane>
        <el-tab-pane label="收付款总览" name="third" v-if="isRoot(rootCode['收付款总览TAB'])">
          <view-third v-if="loadMap.has('third')" :dataListObj="dataObj"></view-third>
        </el-tab-pane>
        <el-tab-pane name="fourth" v-if="isRoot(rootCode['合同提醒TAB'])">
          <span slot="label">
            &nbsp;&nbsp;合同提醒&nbsp;&nbsp;&nbsp;&nbsp;
            <!-- <span>{{count}}</span> -->
            <el-badge :value="count" :max="99"></el-badge>
          </span>
          <remind-fourth v-if="loadMap.has('fourth')" :dataListObj="dataObj"></remind-fourth>
        </el-tab-pane>
        <el-tab-pane label="数据字典" name="fifth" v-if="isRoot(rootCode['数据字典TAB'])">
          <dictionary-fifth v-if="loadMap.has('fifth')" :dataListObj="dataObj"></dictionary-fifth>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import ContractFirst from "components/contractManage/ContractFirst" // 合同管理
import UnitSecond from "components/contractManage/UnitSecond" // 往来单位
import ViewThird from "components/contractManage/ViewThird" // 收付款总览
import RemindFourth from "components/contractManage/RemindFourth" // 合同提醒
import DictionaryFifth from "components/contractManage/DictionaryFifth" // 数据字典
import { GET, POST } from "http/custom.js"
import Tools from "untils/index.js"

export default {
  name: "contractManage",
  components: {
    ContractFirst,
    UnitSecond,
    ViewThird,
    RemindFourth,
    DictionaryFifth
  },
  data() {
    return {
      loading: false,
      loadMap: new Map(), //记录tab页是否打开过了
      activeName: "first",
      dataObj: {
        //给子组件的数据集合
        deptInfo: [], //所有部门
        userDeptInfo: [], //个人所在部门
        userActionAll: this.userActionAll // 用户是否有对应的权限
      },
      rootCode: {
        // oa系统中配置的权限 id
        合同管理TAB: "ba82b1ee25e347b99230ddb83543acc2",
        往来单位TAB: "dfc5fd575ed847538239d7ec76423e88",
        收付款总览TAB: "0c4f1c0af4c348a582a8465b4779c952",
        合同提醒TAB: "522fe10382f545beb1db6c6be43a65fe",
        数据字典TAB: "b2704b3d080b4ab3a15f808e3ac589bc"
      },
      count: "" //合同提醒计数
    }
  },
  computed: {
    level2Menu() {
      // 用户是否有对应的权限
      return this.$store.state.level2Menu
    },
    userActionAll() {
      return this.$store.state.userActionAll
    }
  },
  watch: {
    count: {
      handler(newVal, oldVal) {
        // handler是一个函数，只能叫这个名字，表示对象中属性变化时的处理函数
        console.log(newVal, oldVal)
        // 若存在 合同提醒TAB 时 呈现提醒
        if (this.isRoot(this.rootCode["合同提醒TAB"])) {
          this.JS_count()
        }
      },
      immediate: true
    }
  },
  created() {
    this.loading = true
    this.loadInfo()
  },
  methods: {
    openTab() {
      //打开权限中勾选的第一个tab
      const object = this.rootCode
      let tabName = ""
      let tab = ""
      let i = 0
      for (const key in object) {
        if (object.hasOwnProperty(key)) {
          tabName = key.toString()
          if (this.isRoot(object[tabName])) {
            switch (tabName) {
              case "合同管理TAB":
                return (tab = "first")
              case "往来单位TAB":
                return (tab = "second")
              case "收付款总览TAB":
                return (tab = "third")
              case "合同提醒TAB":
                return (tab = "fourth")
              case "数据字典TAB":
                return (tab = "fifth")
            }
          }
        }
        i++
        if (i === 5) {
          //所有页签判断完没有时返回 ''
          return tab
        }
      }
    },
    isRoot(idCode) {
      //判断当前 用户是否有对应的权限  tab页
      return Tools.includes(this.level2Menu, idCode)
    },
    isRootUserActionAll(idCode) {
      //判断当前 用户是否有对应的权限 idCode   按键权限
      return Tools.includes(this.userActionAll, idCode)
    },
    tabShow() {
      switch (this.activeName) {
        case "first":
          if (this.$refs.mychildMain) {
            //调用子组件的方法
            this.$refs.mychildMain.queryTree()
            this.$refs.mychildMain.searchForMain()
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
        default:
          console.log("无匹配页！")
          return false
      }
    },
    handleClick(tab) {
      //tab页切换 只有第一次页面切换时初始化数据
      //判断页面是否打开过
      if (tab.name === "first") {
        //第一个页面的数据是汇总页，只要打开就刷新数据
        this.tabShow()
      } else if (!this.loadMap.has(tab.name)) {
        this.tabShow()
        this.loadMap.set(tab.name, true)
      }
    },
    async loadInfo() {
      const awaitWrap = promise => {
        return promise.then(data => [null, data]).catch(err => [err, null])
      }
      this.dataObj.deptInfo = this.userActionAll
      //获取全部部门
      const [depErr, depDt] = await awaitWrap(POST(process.env.VUE_APP_DOMAIN_personnel + "/queryDepartmentList", {}))
      if (depErr === null) {
        this.dataObj.deptInfo = depDt.data
      }
      //获取个人所在部门
      const [UserErr, UserDt] = await awaitWrap(GET(process.env.VUE_APP_DOMAIN_personnel + "/personnel/adjustmentitem/userDept", {}))
      if (UserErr === null) {
        this.dataObj.deptInfo = UserDt.data
      }
      // debugger
      //记录第一个tab页已经加载
      this.loading = false
      this.activeName = this.openTab()
      this.loadMap.set(this.activeName, true)
      if (this.isRoot(this.rootCode["合同提醒TAB"])) {
        this.JS_count()
        console.log("合同提醒TAB", 111)
      }
      this.tabShow()
    },
    JS_count() {
      //合同提醒计数
      GET(process.env.VUE_APP_DOMAIN_financial + "/contractNotice")
        .then(res => {
          //查询对象
          this.count = res.data
          console.log("合同提醒：", this.count)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>

<style scoped>
.el-badge {
  position: absolute;
  right: 3px;
  top: 0px;
  line-height: 20px;
}
</style>