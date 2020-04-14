<template>
  <div class="personnelGuide">
    <div class="guideList">
      <div class="gWrap clearfix">
        <div class="gList" v-if="comprehensiveOperation">
          <router-link to="/home/riskControl/rewardAndPublish">
            <div class="txtBtn j">奖</div>
            <div class="txt">奖惩系统</div>
          </router-link>
          <router-link
            to="/home/riskControl/rewardAndPublish"
            class="newOpen"
            target="_blank"
            title="新窗口打开"
          >
            <i></i>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Tools from "untils/index" //工具方法

export default {
  name: "RiskControlHome",
  computed: {
    comprehensiveOperation() {
      //是否存在奖惩系统(权限控制)
      return Tools.includes(this.$store.state.level2Menu, "ac5a79c0040349049f300be5e4779a05")
    }
  }
}
</script>
