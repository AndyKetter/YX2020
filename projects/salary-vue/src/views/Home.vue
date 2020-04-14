<template>
  <div class="home">
    <el-container :style="{height:mainHeight}">
      <el-aside class="over-auto" :width="wh" style="background-color: #263238;">
        <el-menu
          style="border-right:none"
          background-color="#263238"
          text-color="#fff"
          @open="handleOpen"
          @close="handleClose"
          :collapse="isCollapse"
        >
          <a class="link_oa" :href="link_oa">
            <el-menu-item>
              <i class="newIcon-leftmenu-oa"></i>
              <span slot="title" class="pdfix">返回OA</span>
            </el-menu-item>
          </a>
          <router-link to="/home/personalCenter" v-if="personalCenter">
            <el-menu-item>
              <i class="newIcon-leftmenu1"></i>
              <span slot="title" class="pdfix">个人中心</span>
            </el-menu-item>
          </router-link>

          <router-link to="/home/personnelSystem" v-if="personnelSystem">
            <el-menu-item>
              <i class="newIcon-leftmenu2"></i>
              <span slot="title" class="pdfix">人事系统</span>
            </el-menu-item>
          </router-link>

          <router-link to="/home/administrativeSystem" v-if="administrativeSystem">
            <el-menu-item>
              <i class="newIcon-leftmenu3"></i>
              <span slot="title" class="pdfix">行政系统</span>
            </el-menu-item>
          </router-link>

          <router-link to="/home/financialSystem" v-if="financialSystem">
            <el-menu-item>
              <i class="newIcon-leftmenu4"></i>
              <span slot="title" class="pdfix">财务系统</span>
            </el-menu-item>
          </router-link>

          <router-link to="/home/publicSystem" v-if="publicSystem">
            <el-menu-item>
              <i class="newIcon-leftmenu5"></i>
              <span slot="title" class="pdfix">公共系统</span>
            </el-menu-item>
          </router-link>

          <router-link to="/home/cphOprionSystem" v-if="cphOprionSystem">
            <el-menu-item>
              <i class="newIcon-leftmenu6"></i>
              <span slot="title" class="pdfix">综合性运营系统</span>
            </el-menu-item>
          </router-link>

          <router-link to="/home/riskControl" v-if="riskControl">
            <el-menu-item>
              <i class="newIcon-leftmenu7"></i>
              <span slot="title" class="pdfix">风险控制</span>
            </el-menu-item>
          </router-link>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header
          style="font-size: 14px;background-color:#fff;color:#606266;"
          height="56px"
          class="clearfix"
        >
          <div class="pull-right">
            <!-- <el-dropdown>
              <i class="el-icon-setting" style="margin-right: 15px;color:#606266"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>个人信息</el-dropdown-item>
                <el-dropdown-item>账号管理</el-dropdown-item>
                <el-dropdown-item>修改密码</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>-->
            <i class="el-icon-setting" style="margin-right: 15px;color:#606266"></i>
            <span>{{userName}}</span>
          </div>
          <div class="pull-left salaryName">
            <i
              :class="spreadClass"
              @click="spread"
              style="cursor:pointer;font-size:22px;position:relative;top:2px;"
            ></i>
            <span>薪资系统</span>
          </div>
        </el-header>

        <el-main class="over-auto">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// import { mapState } from "vuex" //导入map函数
import Tools from "untils/index" //工具方法

export default {
  name: "home",
  data() {
    return {
      mainHeight: "",
      isCollapse: true,
      wh: "64px",
      spreadClass: "el-icon-s-fold"
    }
  },
  computed: {
    // ...mapState([
    //   //映射this.menusPermissions为store.state.menusPermissions
    //   'menusPermissions'
    // ]),
    userName() {
      //取vuex state中的值一定要放computed中，这样vuex里面的值变了，页面会自定更新
      //如果不放computed，会存在有时候会取到初始值而不更新同步state的值得bug
      return this.$store.state.oaGetTokenInfo.name
    },
    personalCenter() {
      //是否存在个人中心(权限控制)
      return Tools.includes(this.$store.state.level1Menu, "6a4c244653dd40cca22a5d2ae16970b8")
    },
    personnelSystem() {
      //是否存在人事系统(权限控制)
      return Tools.includes(this.$store.state.level1Menu, "e6a97171dd12475daa1207aac4ad065c")
    },
    administrativeSystem() {
      //是否存在行政系统(权限控制)
      return Tools.includes(this.$store.state.level1Menu, "0f3178fd878c441e8cce967675d4ab53")
    },
    financialSystem() {
      //是否存在财务系统(权限控制)
      return Tools.includes(this.$store.state.level1Menu, "1a8bf4c98453499582eb48124dab975c")
    },
    publicSystem() {
      //是否存在公共系统(权限控制)
      return Tools.includes(this.$store.state.level1Menu, "f5dc68613d384363a2dcd1403ddda87f")
    },
    cphOprionSystem() {
      //是否存在综合性运营系统(权限控制)
      return Tools.includes(this.$store.state.level1Menu, "d8375bd39757427c9faa7ad00b1ce359")
    },
    riskControl() {
      //是否存在风险控制(权限控制)
      return Tools.includes(this.$store.state.level1Menu, "a46e41689e644717b0025d817b77ef4b")
    },
    link_oa() {
      //返回老oa首页
      return `${process.env.VUE_APP_DOMAIN}/html/index.html`
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
    spread() {
      this.isCollapse = !this.isCollapse
      if (this.isCollapse) {
        this.wh = "64px"
        this.spreadClass = "el-icon-s-unfold"
      } else {
        this.wh = "220px"
        this.spreadClass = "el-icon-s-fold"
      }
    }
  },
  mounted() {
    this.mainHeight = "100%" //(window.innerHeight) + 'px' //动态计算container的高度
  }
}
</script>
<style>
</style>
<style scoped>
/* 路由激活样式 */
.over-auto a {
  text-decoration: none !important;
  display: inline-block;
  width: 100%;
}
.over-auto a:visited {
  text-decoration: none !important;
}
.router-link-active span,
.router-link-active i {
  color: #ffd04b !important;
}
.over-auto {
  overflow: auto;
}
.link_oa {
  border-bottom: 1px solid #324047;
}
.newIcon-leftmenu-oa {
  background: url(~libs/images/backOa.png) center 0 no-repeat !important;
}
.level {
  position: relative;
  z-index: 3500;
}

.el-menu-vertical-salary:not(.el-menu--collapse) {
  height: 100%;
  overflow: auto;
}
.el-header {
  background-color: #545c64;
  color: #fff;
  line-height: 56px;
}
.salaryName {
  font-size: 16px;
  font-weight: 700;
}
.el-menu-item [class^="newIcon-"] {
  margin-right: 5px;
  width: 24px;
  text-align: center;
  font-size: 18px;
  display: inline-block;
  vertical-align: middle;
  background-image: url(~libs/images/leftMenu.png);
  background-repeat: no-repeat;
  height: 18px;
  filter: grayscale(100%);
}
.newIcon-leftmenu2 {
  background-position: 0px -30px;
}
.newIcon-leftmenu3 {
  background-position: 0px -60px;
}
.newIcon-leftmenu4 {
  background-position: 0px -90px;
}
.newIcon-leftmenu5 {
  background-position: 0px -120px;
}
.newIcon-leftmenu6 {
  background-position: 0px -150px;
}
.newIcon-leftmenu7 {
  background-position: 0px -179px;
}
.router-link-active i {
  filter: grayscale(0%) !important;
}
/* 修复刷新可能激活是蓝色的情况 */
.el-menu-item.is-active {
  color: rgb(255, 255, 255) !important;
}
/* 修复左侧菜单折叠动画问题 */
.pdfix {
  padding-left: 15px;
  padding-right: 15px;
}
</style>

