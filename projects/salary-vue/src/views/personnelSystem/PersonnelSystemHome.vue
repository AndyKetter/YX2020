<template>
  <div class="personnelGuide">
    <div class="guideList">
      <!-- <h4 v-if="menusPermissions.indexOf('personnelBaseSalary') !== -1">人事基础薪资</h4> -->
      <div class="gWrap clearfix">
        <div class="gList" v-if="noConfig">
          <router-link to="/home/personnelSystem/noConfig">
            <div class="txtBtn w">未</div>
            <div class="txt">未配置基础薪资</div>
          </router-link>
          <router-link
            to="/home/personnelSystem/noConfig"
            class="newOpen"
            target="_blank"
            title="新窗口打开"
          >
            <i></i>
          </router-link>
        </div>
        <div class="gList" v-if="summaryTables">
          <router-link to="/home/personnelSystem/summaryTables">
            <div class="txtBtn j">基</div>
            <div class="txt">基础薪资总表</div>
          </router-link>
          <router-link
            to="/home/personnelSystem/summaryTables"
            class="newOpen"
            target="_blank"
            title="新窗口打开"
          >
            <i></i>
          </router-link>
        </div>
        <div class="gList" v-if="initSetup">
          <router-link to="/home/personnelSystem/initSetup">
            <div class="txtBtn x">薪</div>
            <div class="txt">基础薪资初始设置</div>
          </router-link>
          <router-link
            to="/home/personnelSystem/initSetup"
            class="newOpen"
            target="_blank"
            title="新窗口打开"
          >
            <i></i>
          </router-link>
        </div>
      </div>
    </div>
    <div class="guideList">
      <!-- <h4 v-if="menusPermissions.indexOf('personnelIncome') !== -1">人事收入</h4> -->
      <div class="gWrap clearfix">
        <div class="gList" v-if="subsidy">
          <router-link to="/home/personnelSystem/subsidy">
            <div class="txtBtn r">人</div>
            <div class="txt">人事收入项</div>
          </router-link>
          <router-link
            to="/home/personnelSystem/subsidy"
            class="newOpen"
            target="_blank"
            title="新窗口打开"
          >
            <i></i>
          </router-link>
        </div>
        <div class="gList" v-if="incomeItemsSetting">
          <router-link to="/home/personnelSystem/incomeItemsSetting">
            <div class="txtBtn s">收</div>
            <div class="txt">收入项设置</div>
          </router-link>
          <router-link
            to="/home/personnelSystem/incomeItemsSetting"
            class="newOpen"
            target="_blank"
            title="新窗口打开"
          >
            <i></i>
          </router-link>
        </div>
      </div>
    </div>

    <div class="guideList">
      <!-- <h4 v-if="menusPermissions.indexOf('other') !== -1">其它</h4> -->
      <div class="gWrap clearfix">
        <div class="gList" v-if="fiveSocialDed">
          <router-link to="/home/personnelSystem/fiveSocialDed">
            <div class="txtBtn w">五</div>
            <div class="txt">五险一金</div>
          </router-link>
          <router-link
            to="/home/personnelSystem/fiveSocialDed"
            class="newOpen"
            target="_blank"
            title="新窗口打开"
          >
            <i></i>
          </router-link>
        </div>
        <div class="gList" v-if="performanceDed">
          <router-link to="/home/personnelSystem/performanceDed">
            <div class="txtBtn j">绩</div>
            <div class="txt">绩效工资</div>
          </router-link>
          <router-link
            to="/home/personnelSystem/performanceDed"
            class="newOpen"
            target="_blank"
            title="新窗口打开"
          >
            <i></i>
          </router-link>
        </div>
        <div class="gList" v-if="filialPietyFee">
          <router-link to="/home/personnelSystem/filialPietyFee">
            <div class="txtBtn x">孝</div>
            <div class="txt">孝敬费管理</div>
          </router-link>
          <router-link
            to="/home/personnelSystem/filialPietyFee"
            class="newOpen"
            target="_blank"
            title="新窗口打开"
          >
            <i></i>
          </router-link>
        </div>

        <!-- <div class="gList">
              <router-link to="/home/personnelSystem/talent">
                  <div class="txtBtn r">人</div>
                  <div class="txt">人才引进奖</div>
              </router-link>
              <router-link to="/home/personnelSystem/talent" class="newOpen" target="_blank" title="新窗口打开"><i></i></router-link>
        </div>-->

        <div class="gList" v-if="trainSubsidy">
          <router-link to="/home/personnelSystem/trainSubsidy">
            <div class="txtBtn p">培</div>
            <div class="txt">培训补助</div>
          </router-link>
          <router-link
            to="/home/personnelSystem/trainSubsidy"
            class="newOpen"
            target="_blank"
            title="新窗口打开"
          >
            <i></i>
          </router-link>
        </div>
      </div>
    </div>
    <div class="guideList">
      <div class="gWrap clearfix">
        <div class="gList" v-if="trainManager">
          <router-link to="/home/personnelSystem/trainManager">
            <div class="txtBtn p">培</div>
            <div class="txt">培训管理</div>
          </router-link>
          <router-link
            to="/home/personnelSystem/trainManager"
            class="newOpen"
            target="_blank"
            title="新窗口打开"
          >
            <i></i>
          </router-link>
        </div>
        <div class="gList" v-if="structureChange">
          <router-link to="/home/personnelSystem/structureChange">
            <div class="txtBtn r">人</div>
            <div class="txt">人员异动</div>
          </router-link>
          <router-link
            to="/home/personnelSystem/structureChange"
            class="newOpen"
            target="_blank"
            title="新窗口打开"
          >
            <i></i>
          </router-link>
        </div>
        <!-- <div class="gList" @click="applyModal">
          <div style="padding:10px">
            <div class="txtBtn y">异</div>
            <div class="txt">业务部异动申请</div>
          </div>
        </div>
        <div class="gList">
          <router-link to="/home/personnelSystem/businessChangeStatistics">
            <div class="txtBtn t">统</div>
            <div class="txt">业务部异动统计</div>
          </router-link>
          <router-link
            to="/home/personnelSystem/businessChangeStatistics"
            class="newOpen"
            target="_blank"
            title="新窗口打开"
          >
            <i></i>
          </router-link>
        </div>-->
      </div>
    </div>
    <!-- 业务部异动申请 -->
    <personnel-structure-apply ref="structureApply"></personnel-structure-apply>
  </div>
</template>

<script>
// import { mapState } from "vuex" //导入map函数
import Tools from "untils/index" //工具方法
import personnelStructureApply from "./personnelStructureApply"
export default {
  name: "PersonnelSystemHome",
  components: {
    personnelStructureApply
  },
  computed: {
    noConfig() {
      //是否存在未配置基础薪资(权限控制)
      return Tools.includes(this.$store.state.level2Menu, "6d84164987d445c8b579f614e5456516")
    },
    summaryTables() {
      //是否存在基础薪资总表(权限控制)
      return Tools.includes(this.$store.state.level2Menu, "38413eb548254c7b873a02fd38b45355")
    },
    initSetup() {
      //是否存在基础薪资初始设置(权限控制)
      return Tools.includes(this.$store.state.level2Menu, "c4daff8cfb0b4d36b7889d69956d00c5")
    },
    subsidy() {
      //是否存在人事收入项(权限控制)
      return Tools.includes(this.$store.state.level2Menu, "ce4d0ce643684882aabc3d3d75bad193")
    },
    incomeItemsSetting() {
      //是否存在收入项设置(权限控制)
      return Tools.includes(this.$store.state.level2Menu, "d24829cc4ece4da49a5ccde7b031e91e")
    },
    fiveSocialDed() {
      //是否存在五险一金(权限控制)
      return Tools.includes(this.$store.state.level2Menu, "cb0ebf7fe3e74c95b70e3a4efc51cf6e")
    },
    performanceDed() {
      //是否存在绩效工资(权限控制)
      return Tools.includes(this.$store.state.level2Menu, "e3d02040cae54da1a16e665f3b0e4fba")
    },
    filialPietyFee() {
      //是否存在孝敬费管理(权限控制)
      return Tools.includes(this.$store.state.level2Menu, "a810b56729d540cc941cb817f7d0aa8f")
    },
    trainSubsidy() {
      //是否存在培训补助(权限控制)
      return Tools.includes(this.$store.state.level2Menu, "c521953404f64c2db7aeedeb78ebd354")
    },
    trainManager() {
      // 是否存在培训管理(权限控制)
      return Tools.includes(this.$store.state.level2Menu, "003973cc22ba4ca6b5150a31205ad17b")
    },
    structureChange() {
      // 是否存在人员异动(权限控制)
      return Tools.includes(this.$store.state.level2Menu, "a11176919c2046939754706bab98f3d7")
    }
  },
  methods: {
    // 业务部异动申请弹层
    applyModal() {
      this.$refs.structureApply.show()
    }
  }
}
</script>

<style scoped>
</style>
