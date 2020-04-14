<template>
  <div class="talent-table">
    <div class="guide">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home/personnelSystem' }">人事系统</el-breadcrumb-item>
        <el-breadcrumb-item>人员异动</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/personnelSystem' }">(返回上级)</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- tabs -->
    <div class="bgWhite mgt15">
      <el-tabs v-model="activeName" type="border-card" @tab-click="tabClick">
        <el-tab-pane label="部门内部架构管理" name="first" v-if="deptChangeLimit">
          <DeptChange ref="DeptChange" v-if="active.first" :dataListObj="{dataInfo:dataObj}"></DeptChange>
        </el-tab-pane>
        <el-tab-pane label="集团内部架构管理" name="second" v-if="blocChangeLimit">
          <BlocChange ref="BlocChange" v-if="active.second" :dataListObj="{dataInfo:dataObj}"></BlocChange>
        </el-tab-pane>
        <el-tab-pane label="区域内部架构管理" name="third" v-if="areaChangeLimit">
          <AreaChange ref="AreaChange" v-if="active.third" :dataListObj="{dataInfo:dataObj}"></AreaChange>
        </el-tab-pane>
        <el-tab-pane label="业务组织架构管理" name="fourth" v-if="businessChangeLimit">
          <BusinessChange
            ref="BusinessChange"
            v-if="active.fourth"
            :dataListObj="{dataInfo:dataObj}"
          ></BusinessChange>
        </el-tab-pane>
        <el-tab-pane label="业务组织架构提交统计" name="fifth" v-if="submitStatisticsLimit">
          <SubmitStatistics
            ref="SubmitStatistics"
            v-if="activeName === 'fifth'"
            :dataListObj="{dataInfo:dataObj}"
          ></SubmitStatistics>
        </el-tab-pane>
        <el-tab-pane label="离职人员统计" name="sixth" v-if="jumpStatisticsLimit">
          <JumpStatistics
            ref="JumpStatistics"
            v-if="activeName === 'sixth'"
            :dataListObj="{dataInfo:dataObj}"
          ></JumpStatistics>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import BlocChange from "components/structionChange/BlocChange"
import AreaChange from "components/structionChange/AreaChange"
import BusinessChange from "components/structionChange/BusinessChange"
import DeptChange from "components/structionChange/DeptChange"
import JumpStatistics from "components/structionChange/JumpStatistics"
import SubmitStatistics from "components/structionChange/SubmitStatistics"
import Tools from "untils/index.js"
import { GET } from "http/custom.js"
export default {
  name: "StructureChange",
  components: {
    BlocChange,
    AreaChange,
    BusinessChange,
    DeptChange,
    JumpStatistics,
    SubmitStatistics
  },
  computed: {
    deptChangeLimit() {
      //部门人员异动管理(权限)
      return this.limitChange === "2" && this.isActivePanel(0)
    },
    blocChangeLimit() {
      //集团人员异动管理(权限)
      return this.limitChange === "3" && this.isActivePanel(1)
    },
    areaChangeLimit() {
      //区域人员异动管理(权限)
      return this.limitChange === "4" && this.isActivePanel(2)
    },
    businessChangeLimit() {
      //业务人员异动管理(权限)
      return Tools.includes(this.$store.state.userActionAll, "7aa0ca5e50b54b03aff2b85d2a65ac82") && this.isActivePanel(3)
    },
    submitStatisticsLimit() {
      //业务组织架构提交统计(权限)
      return Tools.includes(this.$store.state.userActionAll, "35bab40235cc4aa2898e0bcc1398f2dc") && this.isActivePanel(4)
    },
    jumpStatisticsLimit() {
      //离职人员统计(权限)
      return Tools.includes(this.$store.state.userActionAll, "201e99a96be642e682c154413c6234b0") && this.isActivePanel(5)
    }
  },
  data() {
    return {
      // 部门、集团、区域内部组织架构管理界面显示权限
      limitChange: null,
      // 默认激活的tab页面
      activeName: "first",
      // 权限控制的页面
      limits: ["first", "second", "third", "fourth", "fifth", "sixth"],
      // 默认显示界面下标
      index: 5,
      // 是否点击
      isClick: false,
      // 点击tabs切换激活对应组件
      active: {
        first: true,
        second: false,
        third: false,
        fourth: false,
        fifth: false,
        sixth: false
      },
      dataObj: {
        //给子组件的数据集合
        t_height: Tools.getTbHeight(315), //设置表格的高
        t_height2: Tools.getTbHeight(250) //设置汇总一览表
      }
    }
  },
  created() {
    // 获取人员异动权限(后台控制权限,非权限控制项)
    this.getStructureChangeLimit()
  },
  methods: {
    // 获取人员异动权限(后台控制权限,非权限控制项)
    getStructureChangeLimit() {
      GET(process.env.VUE_APP_DOMAIN_personnel + "/uplevel/getUserLevel").then(res => {
        if (res.code === 0) {
          // 0普通员工；1、组长；2、部长；3、负责人(集团副总)；4、总经理；5、总裁；10000、董事长
          this.limitChange = res.data
        }
      })
    },
    // 通过权限控制哪个界面排在第一位
    isActivePanel(i) {
      // 鼠标点击tab切换时直接返回true
      if (this.isClick) return this.isClick
      // 获取通过权限，默认第一个界面打开
      this.index = this.index <= i ? this.index : i
      // 需要激活的第一个界面
      this.activeName = this.limits[this.index]
      // 需要激活的该页面的组件
      this.active[this.activeName] = true
      return true
    },
    // tab标签点击事件
    tabClick(tab) {
      // 激活tab切换页面内的组件
      this.active[tab.name] = true
      // 是否鼠标点击
      this.isClick = true
    }
  }
}
</script>

<style lang="less">
.el-tree-node__content {
  padding: 5px 0;
}
</style>
