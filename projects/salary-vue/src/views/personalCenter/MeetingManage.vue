<template>
  <div class="meetingManage">
    <div class="guide">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home/personalCenter' }">个人中心</el-breadcrumb-item>
        <el-breadcrumb-item>我的</el-breadcrumb-item>
        <el-breadcrumb-item>会议纪要管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/personalCenter' }">(返回上级)</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="bgWhite mgt15">
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="会议纪要" name="first">
          <MeetingMinutes v-if="activeName==='first'" :dataInfo="dataInfo" />
        </el-tab-pane>
        <el-tab-pane label="权限设置" name="second" v-if="hasPermissionsSetting">
          <PermissionsSetting v-if="activeName==='second'" :dataInfo="dataInfo" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Tools from "untils/index.js"
import MeetingMinutes from "components/personalCenter/meettingManage/MeetingMinutes.vue" // 会议纪要
import PermissionsSetting from "components/personalCenter/meettingManage/PermissionsSetting.vue" // 权限设置

export default {
  name: "meetingManage",
  components: { MeetingMinutes, PermissionsSetting },
  data() {
    return {
      activeName: "first",
      dataInfo: {
        //给子组件的数据集合
        t_height: Tools.getTbHeight(315) //设置表格的高
      }
    }
  },
  methods: {
    handleClick(tab) {
      console.log(tab)
    }
  },
  computed: {
    hasPermissionsSetting() {
      //是否有权限设置tab权限
      return Tools.includes(this.$store.state.userActionAll, "364cc7f404e3417c8ad641ecfb40ef32")
    }
  },
  created() {}
}
</script>

<style scoped>
</style>
