<template>
  <div class="collect-wrapper">
    <div
      class="collect"
      v-for="(item,index) in courseListObj"
      :key="index"
      @click.stop="goDetail(item)"
    >
      <div
        class="icon"
        :title="item.isCollection === 1 ?'已收藏':'未收藏'"
        :class="item.isCollection === 1 ? 'icon-show':'icon-out'"
        @click.stop="JS_collect(item)"
      ></div>
      <img :src="imgDomain+'?key='+item.classPic+'&view=true'" :alt="item.className" />
      <p>{{item.className | repair}}</p>
      <p>{{item.teachName | repair}}&nbsp;|&nbsp;时长：{{item.classTime | repair}}分钟</p>
      <div class="lock" v-if="item.isLock === 1">
        <img src="~libs/images/yxCollege/lock.png" alt="暂无图片" />
      </div>
    </div>
    <div class="collect copy" v-for="item in 10" :key="`item_copy_${item}`"></div>
  </div>
</template>

<script>
import { POST } from "http/custom.js"

export default {
  name: "courseListCommon",
  props: {
    courseListObj: {
      type: Array,
      required: true,
      default: () => {
        return []
      }
    },
    reloadFun: {
      //重新刷新列表
      type: Function,
      required: true
    },
    isNew: {
      //true为不需要调用main.js中权限登录判断相关动作（新员工）
      //false为需要调用main.js中权限登录判断相关动作（已入职员工）
      //isNew是用来给跳转详情页给定是否需要url带isNew的
      type: Boolean,
      default: () => {
        return false
      }
    },
    toDetailUrl: {
      //点击查看详情跳转url
      type: String,
      default: () => {
        return "/yxCollege/collegeClassifyDetail"
      }
    }
  },
  data() {
    let imgDomain = process.env.VUE_APP_DOMAIN_download + "/oss/download"
    return { imgDomain }
  },
  methods: {
    goDetail(item) {
      //课程到详情
      console.log("课程到详情")
      if (item.isLock === 1) {
        return
      }
      this.$router.push({
        path: `${this.toDetailUrl}/${item.id}?isNew=${this.isNew}`
      })
    },
    JS_collect(item) {
      // 收藏
      if (item.isLock === 1) {
        return
      }
      let obj = {
        classId: item.id,
        status: item.isCollection === 1 ? 0 : 1 //0：取消收藏；1：收藏
      }
      console.log(item.id)
      POST(process.env.VUE_APP_DOMAIN_personnel + "/correlationOperation", obj)
        .then(res => {
          if (res.code === 0) {
            this.$message({
              type: "success",
              message: obj.status === 1 ? "收藏成功！" : "已取消收藏！"
            })
            this.reloadFun()
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>

<style lang="less" scoped>
//课程组件
.collect-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-left: -20px;

  &::after {
    content: "";
    flex: auto;
  }

  .copy {
    width: 230px;
    height: 0 !important;
    background: transparent !important;
    margin-bottom: 0;
    padding: 0;
    box-shadow: none;
    -webkit-box-shadow: none;
  }
}
.collect {
  display: inline-block;
  position: relative;
  width: 230px;
  height: 216px;
  padding-bottom: 5px;
  margin-bottom: 40px;
  margin-left: 20px;
  background-color: #fff;

  &:hover {
    box-shadow: 0 2px 12px 0 rgba(109, 109, 109, 0.5);
    cursor: pointer;
  }

  .icon {
    width: 28px;
    height: 28px;
    position: absolute;
    top: 0;
    right: 5px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .icon-show {
    background-image: url("~libs/images/yxCollege/collect-icon_1.png");
  }

  &:hover .icon-out {
    background-image: url("~libs/images/yxCollege/collect-icon_2.png");
  }

  img {
    width: 230px;
    height: 139px;
    display: inline-block;
  }

  p {
    font-size: 14px;
    padding: 0;
    margin: 10px;
    color: #c0c0c0;
  }

  p:nth-child(3) {
    font-weight: bold;
    color: #000000;
  }

  .lock {
    width: 100% !important;
    height: 100% !important;
    position: absolute;
    top: 0;
    background-color: #636363;
    opacity: 0.5;
    text-align: center;
    -webkit-user-select: none;
    user-select: none;

    img {
      width: 30px;
      height: 40px;
      display: inline-block;
      margin-top: 50px;
    }
  }
}
</style>

