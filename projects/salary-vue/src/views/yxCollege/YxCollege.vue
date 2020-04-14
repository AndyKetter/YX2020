<template>
  <div class="yxCollege">
    <el-menu class="college-nav" mode="horizontal" background-color="#272d30" text-color="#9eabb1">
      <el-menu-item @click="handleClick('home')">
        <img class="logo" src="~libs/images/yxCollege/logo.png" alt="logo" />
        <a href="#/yxCollege/home" class="yx-nav">永雄学院</a>
      </el-menu-item>
      <el-menu-item @click="handleClick('home')" :class="$route.name==='home'?'liveLi':''">
        <router-link to="/yxCollege/home">首页</router-link>
      </el-menu-item>
      <el-menu-item @click="handleClick('live')" :class="$route.name==='live'?'liveLi':''">
        <router-link to="/yxCollege/live">直播</router-link>
      </el-menu-item>
      <el-menu-item @click="handleClick('goldCase')" :class="$route.name==='goldCase'?'liveLi':''">
        <router-link to="/yxCollege/goldCase">金牌案例</router-link>
      </el-menu-item>
      <el-menu-item @click="handleClick('lecturer')" :class="$route.name==='lecturer'?'liveLi':''">
        <router-link to="/yxCollege/lecturer">讲师风采</router-link>
      </el-menu-item>
    </el-menu>
    <div class="search-panel">
      <div class="search-content">
        <el-select placeholder="请选择" v-model="classType">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-input class="width130" v-model="inputCantent" placeholder="请输入搜索的内容"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="quickSearch"></el-button>
      </div>
      <div @click="toPersonalCenter" class="head-img" title="个人中心">{{firstName?firstName.substr(0, 1):''}}</div>
    </div>
    <div class="over-auto rview" ref="content" id="content">
      <router-view :key="activeDate"></router-view>
      <div class="back-top" title="置顶" @click="handleScroll" v-if="btnTop"></div>
    </div>
    <Foot />
  </div>
</template>

<script>
import Foot from "components/yxCollege/Foot"

export default {
  name: "yxCollege",
  components: {
    Foot
  },
  data() {
    return {
      activeDate: new Date().getTime(), //毫秒数
      classType: 1, //课程类型
      inputCantent: "", //文体内容
      btnTop: false, //置顶按键显示
      scrollTo: 0, // 滚动条的位置
      backgroundImage: require("libs/images/yxCollege/penson.png"), //个人头像
      options: [
        {
          value: 1,
          label: "课程"
        },
        {
          value: 2,
          label: "讲师"
        }
      ]
    }
  },
  computed: {
    firstName() {
      return this.$store.state.oaGetTokenInfo.name
    }
  },
  mounted() {
    //监听滚动事件
    document.body.addEventListener("scroll", () => {
      //获取页面中滚动条的位置
      this.scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (this.scrollTop > 0) {
        this.btnTop = true //显示置顶按钮
      } else {
        this.btnTop = false
      }
    })
  },
  watch: {
    // 监听路由
    $route(to, from) {
      if (to.query.type !== from.query.type || to.query.keyWords !== from.query.keyWords || to.params.id !== from.params.id) {
        //监听路由query,params参数变化
        this.activeDate = new Date().getTime() // 参数变化时重设 router-view key 达到刷新的目的
      }
    }
  },
  methods: {
    handleScroll() {
      //置顶
      const backTop = window.setInterval(() => {
        //加个过渡动画，
        if (this.scrollTop > 0) {
          this.scrollTop -= 10 //每次减10置顶
          document.body.scrollTop = this.scrollTop //只有这段代码能获取到页面中元素的滚动条位置
        } else {
          window.clearInterval(backTop) //清除轮询
        }
      }, 1)
    },
    orderScroll(e) {
      console.log(e)
    },
    quickSearch() {
      this.$router.push({
        path: this.classType === 1 ? "/yxCollege/quickSearch" : "/yxCollege/lecturer",
        query: {
          type: this.classType,
          keyWords: this.inputCantent
        }
      })
    },
    handleClick(path) {
      if (path === "live") {
        window.open("http://alive.cs.hnyongxiong.com/live.html?url=rtmp://172.31.11.114:1935/live/PGM&flag=0") //跳转到外网直播链接
        this.$router.push(`/yxCollege/home`) // 重新跳转到首页
        return
      }
      this.$router.push(`/yxCollege/${path}`)
    },
    toPersonalCenter() {
      //跳转到个人中心
      this.$router.push({
        name: "yxPersonalCenter"
      })
    }
  }
}
</script>

<style lang="less">
.yxCollege {
  position: relative;
  min-height: 100%;
}
.el-menu--horizontal {
  border-bottom: solid 1px rgb(39, 45, 48) !important;
}
.college-nav {
  position: fixed;
  width: 100%;
  padding: 0 5px;
  z-index: 10;
  li {
    margin-right: 15px;
  }
  a {
    text-decoration: none !important;
    display: inline-block;
    width: 100%;
    font-size: 15px;
    font-weight: 600;

    &:visited {
      text-decoration: none !important;
    }
  }
}

.yx-nav {
  font-size: 18px !important;
  font-weight: bold !important;
  margin-left: 5px;
  color: #fff !important;
}
.over-auto {
  overflow: auto;
}
.rview {
  padding: 61px 20px 140px 20px;
}
.logo {
  position: relative;
  top: -2px;
}
.router-link-active {
  color: #fff !important;
}
.liveLi {
  border-bottom-color: #fff !important;
}

.back-top {
  width: 48px;
  height: 48px;
  position: fixed;
  bottom: 55px;
  right: 20px;
  z-index: 100;
  border-radius: 5px;
  cursor: pointer;
  background-color: #333333;
  background-repeat: no-repeat;
  background-size: 100%;
  background-image: url(../../libs/images/yxCollege/back-top.png);
}

/*左边搜索 开始*/

/*公用样式*/
.display {
  display: inline-block;
}
.ver-align {
  vertical-align: middle;
}
.bg-bd {
  background: transparent;
  border: 0;
  padding: 0;
  color: #c0c0c0;
}
/*公用样式*/

.search-panel {
  display: inline-block;
  position: fixed;
  top: 10.5px;
  right: 20px;
  z-index: 20;

  .search-content {
    border-radius: 25px;
    background-color: #545454;
    padding: 0 15px;
    vertical-align: middle;
    margin-right: 30px;
    .display;
    .ver-align;

    .el-select > .el-input {
      width: 60px;
      .el-input__inner {
        .bg-bd;
      }
    }
    .width130 > .el-input__inner {
      width: 120px !important;
      .bg-bd;
    }
    .el-button--primary {
      background: transparent !important;
      border-color: transparent !important;
    }
    .el-button--primary:hover {
      .el-button--primary;
    }
    .el-button--small {
      padding: 6.3px 5px !important;
      .el-icon-search {
        font-size: 15px !important;
      }
    }
  }
  .head-img {
    cursor: pointer;
    width: 40px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    border-radius: 50%;
    background-color: #0c80df;
    color: #fff;
    font-size: 24px;
    .ver-align;
    .display;
  }
}

/*左边搜索 结束*/
</style>

