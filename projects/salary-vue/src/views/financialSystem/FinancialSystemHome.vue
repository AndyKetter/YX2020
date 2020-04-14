<template>
  <div class="personnelGuide">
    <div class="guideList">
      <div class="gWrap">
        <div class="gList" v-if="dataSummary">
          <router-link to="/home/financialSystem/dataSummary">
            <div class="txtBtn z">总</div>
            <div class="txt">数据汇总台账</div>
          </router-link>
          <router-link to="/home/financialSystem/dataSummary" class="newOpen" target="_blank" title="新窗口打开"><i></i></router-link>
        </div>
        <div class="gList" v-if="formulaManage">
          <router-link to="/home/financialSystem/formulaManage">
            <div class="txtBtn j">绩</div>
            <div class="txt">绩效公式管理</div>
          </router-link>
          <router-link to="/home/financialSystem/formulaManage" class="newOpen" target="_blank" title="新窗口打开"><i></i></router-link>
        </div>
        <div class="gList" v-if="loanPayManage">
          <router-link to="/home/financialSystem/loanPayManage">
            <div class="txtBtn j">借</div>
            <div class="txt">借支管理</div>
          </router-link>
          <router-link to="/home/financialSystem/loanPayManage" class="newOpen" target="_blank" title="新窗口打开"><i></i></router-link>
        </div>
        <div class="gList" v-if="personalTaxManage">
          <router-link to="/home/financialSystem/personalTaxManage">
            <div class="txtBtn g">个</div>
            <div class="txt">个税管理</div>
          </router-link>
          <router-link to="/home/financialSystem/personalTaxManage" class="newOpen" target="_blank" title="新窗口打开"><i></i></router-link>
        </div>
        <div class="gList" v-if="contractManage">
          <router-link to="/home/financialSystem/contractManage">
            <div class="txtBtn f">合</div>
            <div class="txt">合同管理</div>
          </router-link>
          <router-link to="/home/financialSystem/contractManage" class="newOpen" target="_blank" title="新窗口打开"><i></i></router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Tools from 'untils/index' //工具方法

export default {
  name: 'financialSystemHome',
  computed: {
    dataSummary() {//是否存在数据汇总台账(权限控制)
      return Tools.includes(this.$store.state.level2Menu, 'e6b9b7f26e914890a336a1eeeddc7f32')
    },
    formulaManage() {//是否存在绩效公式管理(权限控制)
      return Tools.includes(this.$store.state.level2Menu, '334134d935c042a39e120f6464e18ce3')
    },
    loanPayManage() {//是否存在借支管理(权限控制)
      return Tools.includes(this.$store.state.level2Menu, '587ea2715044402a9b134c47a906c8d7')
    },
    personalTaxManage() {//是否存在个税管理(权限控制)
      return Tools.includes(this.$store.state.level2Menu, '8070fa8c7ba940368be49449edbfb01d')
    },
    contractManage() {//合同管理(权限控制)
      return Tools.includes(this.$store.state.level2Menu, 'd493a6a20cad4ae9a0570fa872094a3a')
    }
  },
}
</script>

<style scoped>
</style> 
