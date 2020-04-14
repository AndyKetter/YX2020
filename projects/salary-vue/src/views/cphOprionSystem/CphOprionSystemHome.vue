<template>
  <div class="personnelGuide">
    <div class="guideList">
      <div class="gWrap clearfix">
        <!-- v-if="comprehensiveOperation" -->
        <div class="gList" v-if="comprehensiveOperation">
          <router-link to="/home/cphOprionSystem/comprehensiveOperation">
            <div class="txtBtn rose">综</div>
            <div class="txt">综合性运营数据</div>
          </router-link>
          <router-link to="/home/cphOprionSystem/comprehensiveOperation" class="newOpen" target="_blank" title="新窗口打开">
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
  name: "PublicSystemHome",
  computed: {
    comprehensiveOperation() {
      //是否存在综合性运营数据(权限控制)
      return Tools.includes(this.$store.state.level2Menu, "53c90476c1d742a8b683c09a53ba1da2")
    }
  }
}
</script>
