<template>
  <div class="personnelGuide">
    <div class="guideList">
      <!-- <h4 v-if="menusPermissions.indexOf('personal') !== -1">我的</h4> -->
      <div class="gWrap">
        <div class="gList" v-if="mySalary">
          <router-link to="/home/personalCenter/mySalary">
            <div class="txtBtn w">我</div>
            <div class="txt">我的工资条</div>
          </router-link>
          <router-link
            to="/home/personalCenter/mySalary"
            class="newOpen"
            target="_blank"
            title="新窗口打开"
          >
            <i></i>
          </router-link>
        </div>
        <div class="gList">
          <router-link to="/home/personalCenter/performanceQuery">
            <div class="txtBtn y">业</div>
            <div class="txt">业绩查询</div>
          </router-link>
          <router-link
            to="/home/personalCenter/performanceQuery"
            class="newOpen"
            target="_blank"
            title="新窗口打开"
          >
            <i></i>
          </router-link>
        </div>
        <div class="gList" v-if="meeting">
          <router-link to="/home/personalCenter/meetingManage">
            <div class="txtBtn h">会</div>
            <div class="txt">会议纪要管理</div>
          </router-link>
          <router-link
            to="/home/personalCenter/meetingManage"
            class="newOpen"
            target="_blank"
            title="新窗口打开"
          >
            <i></i>
          </router-link>
        </div>
        <!-- <div class="gList">
            <router-link to="/home/personalCenter/educationPromotion">
                <div class="txtBtn x">学</div>
                <div class="txt">学历提升</div>
            </router-link>
            <router-link to="/home/personalCenter/educationPromotion" class="newOpen" target="_blank" title="新窗口打开"><i></i></router-link>
        </div>-->
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex" //导入map函数
import Tools from "untils/index" //工具方法

export default {
  name: "personalCenterHome",
  computed: {
    mySalary() {
      //是否存在我的工资条(权限控制)
      return Tools.includes(this.$store.state.level2Menu, "cd3fd12fdfa04f23b9a72aefb394a96f")
    },
    meeting() {
      //是否存在会议纪要管理
      return Tools.includes(this.$store.state.level2Menu, "16c2e8af678f4b6794a1660e3f29e351")
    }
  }
}
</script>

<style scoped>
</style>
