<template>
  <div class="personnelGuide">
    <div class="guideList">
      <!-- <h4>人事基础薪资</h4> -->
      <div class="gWrap clearfix">
        <div class="gList" v-if="adjustMoneyManage">
          <router-link to="/home/publicSystem/adjustMoneyManage">
            <div class="txtBtn t">调</div>
            <div class="txt">调整款项管理</div>
          </router-link>
          <router-link
            to="/home/publicSystem/adjustMoneyManage"
            class="newOpen"
            target="_blank"
            title="新窗口打开"
          >
            <i></i>
          </router-link>
        </div>
        <div class="gList" v-if="specialPerformance">
          <router-link to="/home/publicSystem/specialPerformance">
            <div class="txtBtn t">特</div>
            <div class="txt">特殊绩效</div>
          </router-link>
          <router-link
            to="/home/publicSystem/specialPerformance"
            class="newOpen"
            target="_blank"
            title="新窗口打开"
          >
            <i></i>
          </router-link>
        </div>
        <div class="gList" v-if="identityQuery">
          <router-link to="/home/publicSystem/identityQuery">
            <div class="txtBtn x">信</div>
            <div class="txt">信息查询</div>
          </router-link>
          <router-link
            to="/home/publicSystem/identityQuery"
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
  name: "PublicSystemHome",
  computed: {
    adjustMoneyManage() {
      //是否存在调整款项管理(权限控制)
      return Tools.includes(this.$store.state.level2Menu, "9cb8f54be2d44b28b28474b23e3f71d1")
    },
    specialPerformance() {
      //是否存在特殊绩效(权限控制)
      return Tools.includes(this.$store.state.level2Menu, "de634029dfc44bd8b00478bdf838764c")
    },
    identityQuery() {
      //是否存在特殊绩效(权限控制)
      return Tools.includes(this.$store.state.level2Menu, "f6b7f032250d483aa9873452596c6729")
    }
  }
}
</script>
