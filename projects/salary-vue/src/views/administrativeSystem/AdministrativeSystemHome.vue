<template>
  <div class="personnelGuide">
    <div class="guideList">
      <!-- <h4>人事基础薪资</h4> -->
      <div class="gWrap clearfix">
        <div class="gList" v-if="administrativeDed">
          <router-link to="/home/administrativeSystem/administrativeDed">
            <div class="txtBtn x">行</div>
            <div class="txt">行政扣款项</div>
          </router-link>
          <router-link
            to="/home/administrativeSystem/administrativeDed"
            class="newOpen"
            target="_blank"
            title="新窗口打开"
          >
            <i></i>
          </router-link>
        </div>
        <div class="gList" v-if="dormitoryDed">
          <router-link to="/home/administrativeSystem/dormitoryDed">
            <div class="txtBtn z">住</div>
            <div class="txt">住宿扣款项</div>
          </router-link>
          <router-link
            to="/home/administrativeSystem/dormitoryDed"
            class="newOpen"
            target="_blank"
            title="新窗口打开"
          >
            <i></i>
          </router-link>
        </div>
        <div class="gList" v-if="attendanceDed">
          <router-link to="/home/administrativeSystem/attendanceDed">
            <div class="txtBtn k">考</div>
            <div class="txt">考勤扣款项</div>
          </router-link>
          <router-link
            to="/home/administrativeSystem/attendanceDed"
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
        <div class="gList" v-if="permissions(permissionsMapObj['headsetManageCode'])">
          <router-link to="/home/administrativeSystem/headsetManage">
            <div class="txtBtn e">耳</div>
            <div class="txt">耳机管理</div>
          </router-link>
          <router-link
            to="/home/administrativeSystem/headsetManage"
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
        <div class="gList" v-if="permissions(permissionsMapObj['standingJindieCode'])">
          <router-link to="/home/administrativeSystem/standingJindie">
            <div class="txtBtn j">金</div>
            <div class="txt">金蝶台账</div>
          </router-link>
          <router-link
            to="/home/administrativeSystem/standingJindie"
            class="newOpen"
            target="_blank"
            title="新窗口打开"
          >
            <i></i>
          </router-link>
        </div>
        <div class="gList" v-if="administrativeStanding">
          <router-link to="/home/administrativeSystem/AdministrativeStanding">
            <div class="txtBtn x">行</div>
            <div class="txt">行政台账</div>
          </router-link>
          <router-link
            to="/home/administrativeSystem/AdministrativeStanding"
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
  name: "AdministrativeSystemHome",
  data() {
    return {
      permissionsMapObj: {
        //老系统action权限映射对象
        headsetManageCode: "9231f4d25b4e4c4683f00815b8eb272d", //是否存在耳机管理(权限控制)
        standingJindieCode: "5b23a17e37fb457f930b6d97c97ea065" //是否存在金蝶台帐(权限控制)
      }
    }
  },
  computed: {
    permissions() {
      //通过老oa配置的id,判断当前 用户是否有对应的权限
      return powerid => {
        return Tools.includes(this.$store.state.level2Menu, powerid)
      }
    },
    administrativeDed() {
      //是否存在行政扣款项(权限控制)
      return Tools.includes(this.$store.state.level2Menu, "93da195fa3684748983865a5279623f6")
    },
    dormitoryDed() {
      //是否存在住宿扣款项(权限控制)
      return Tools.includes(this.$store.state.level2Menu, "6adea53c0461469489f554a0260c7181")
    },
    attendanceDed() {
      //是否存在考勤扣款项(权限控制)
      return Tools.includes(this.$store.state.level2Menu, "642c669efdd84cdba5a0870b51cfc337")
    },
    administrativeStanding() {
      //是否存在行政台帐(权限控制)
      return Tools.includes(this.$store.state.level2Menu, "269d94396eb9404e8b823ca3526f257d")
    }
  }
}
</script>

<style scoped>
</style>
