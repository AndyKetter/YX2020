<template>
  <div class="home_container">
    <section class="home_banner">
      <el-row class="home_row">
        <el-col :span="4" class="home_nav">
          <ul>
            <router-link tag="li" to="">永雄学院</router-link>
            <router-link tag="li" to="./collegeClassify/1">通用课程学院</router-link>
            <router-link tag="li" to="./collegeClassify/2">业务管理学院</router-link>
            <router-link tag="li" to="./collegeClassify/3">职能管理学院</router-link>
            <router-link tag="li" to="./collegeClassify/4">专家管理学院</router-link>
          </ul>
        </el-col>
        <el-col :span="20" class="home_carousel height">
          <div class="width height">
            <el-carousel indicator-position="none" :autoplay="true" :height="imgHeight">
              <el-carousel-item v-for="item in imgList" :key="item.id">
                <div @click="goSide(item.adUrl)" :style="{'backgroundImage':`url(${item.adPic})`}" class="home_carousel-img"></div>
              </el-carousel-item>
            </el-carousel>
          </div>
        </el-col>
      </el-row>
    </section>
    <section class="home_content mar-ver">
      <el-row>
        <el-col :span="12">
          <p>最新课程</p>
        </el-col>
        <el-col :span="12" class="more">
          <router-link to="./collegeClassify/1">
            <p>更多></p>
          </router-link>
        </el-col>
        <el-col :span="24">
          <div class="collect-wrapper" v-if="trainClass.length !== 0">
            <div class="collect" v-for="(item,index) in trainClass" :key="index" @click.stop="goDetail(item)">
              <div class="icon" :title="item.isCollection === 1 ?'已收藏':'未收藏'" :class="item.isCollection === 1 ? 'icon-show':'icon-out'" @click.stop="JS_collect(item)"></div>
              <img :src="item.classPic" :alt="item.className">
              <p>{{item.className}}</p>
              <p>{{item.teachName}}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;时长：{{item.classTime}}分钟</p>
              <div class="lock" v-if="item.isLock === 1">
                <img src="../../libs/images/yxCollege/lock.png" alt="暂无图片">
              </div>
            </div>
            <div class="collect copy" v-for="(item,index) in 10" :key="trainClass.length > 0 ? trainClass.length++:index"></div>
          </div>
          <el-alert v-if="trainClass.length === 0" class="yx_alert_nodata" style="margin: 20px 0 !important;" title="温馨提示:暂无课程数据" type="info" :closable="false" center show-icon></el-alert>
        </el-col>
      </el-row>
    </section>
    <section class=" home_lecturer">
      <div class="lecturer-bg">
        <div class="better-bg"></div>
        <div class="lecturer-panel">
          <el-carousel indicator-position="none" :autoplay="true" height="275px">
            <el-carousel-item v-for="(item,index) in trainTeacher" :key="index">
              <div class="lecturer-card" v-for="(itm,idx) in item" :key="idx" @click="goTeacherDt(itm.id)">
                <div class="head-img" :style="{'background-image':`url(${itm.teachPic}`}"></div>
                <!--郭静 -->
                <p>{{itm.teachName}}</p>
                <!--郭静 -->
                <p>{{itm.isElite === 1 ? '精英讲师':'普通讲师'}}</p>
                <!--15年的从业经验，目前主要负责员工培训，新员工入职档案处理 -->
                <div class="teachDesc">{{itm.teachDesc}}</div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="lecturer-more">
          <router-link to="./lecturer">更多讲师</router-link>
        </div>
        <div></div>
      </div>
    </section>
  </div>
</template>

<script> 
import { POST } from "http/custom.js";

export default {
  name: "home",
  data() {
    return {
      imgHeight: '350px', // banner 图
      icon: '', //收藏图标
      backgroundImage: require("../../libs/images/yxCollege/penson.png"), //个人头像
      imgList: [],//轮播 测试数据
      trainClass: [],//最新课程列表	
      trainTeacher: [], //精英讲师
    }
  },
  created() {
    this.getHomeData();
  },
  methods: {
    goDetail(item) { //课程到详情
      if (item.isLock === 1) {
        return;
      }
      this.$router.push({
        path: '/yxCollege/collegeClassifyDetail/' + item.id
      });
    },
    goSide(href) { //轮播图片链接
      if (href.trim() === '') {
        return;
      }
      if (/^[0-9]+$/.test(href.trim())) { // 若为数字跳转课程详情 
        this.$router.push('/yxCollege/collegeClassifyDetail/' + href.trim());
      } else {
        window.open(href.includes('http') ? href.trim() : 'http://' + href.trim(), '_blank');
      }
    },
    goTeacherDt(id) { //讲师详情
      this.$router.push({
        path: './lecturer/' + id
      });
    },
    JS_collect(item) { // 收藏
      console.log('收藏');
      if (item.isLock === 1) {
        return;
      }
      let obj = {
        classId: item.id,
        status: item.isCollection === 1 ? 0 : 1 //0：取消收藏；1：收藏
      };
      POST(process.env.VUE_APP_DOMAIN_personnel + "/correlationOperation", obj).then(res => {
        if (res.code === 0) {
          this.getHomeData();
        }
      }).catch(error => {
        console.log(error);
      });
    },
    getHomeData() {
      const obj = {
        carouselLimit: 4,
        classLimit: 12,
        teachLimit: 100,
      };
      POST(process.env.VUE_APP_DOMAIN_personnel + "/commonTrainIndexes", obj).then(res => {
        if (res.code === 0) {
          let url = `${process.env.VUE_APP_DOMAIN_download}/oss/download?`;
          this.imgList = res.data.adventManage;//轮播图
          if (this.imgList.length > 0) {
            this.imgList.forEach(item => {
              item.adPic = `${url}key=${item.adPic}&view=true`;
            });
          }
          this.trainClass = res.data.trainClass;//最新课程列表	
          if (this.trainClass.length > 0) {
            this.trainClass.forEach(item => {
              item.classPic = `${url}key=${item.classPic}&view=true`;
            });
          }
          let teacherArr = res.data.trainTeacher;//精英讲师
          this.trainTeacher = [];
          if (teacherArr.length > 0) {
            teacherArr.forEach(item => {
              item.teachPic = `${url}key=${item.teachPic}&view=true`;
            });
            //分组 每四个为一组       
            let a_len = teacherArr.length;
            for (let i = 0; i < a_len; i += 4) {
              this.trainTeacher.push(teacherArr.slice(i, i + 4));
            }
          }
        }
      }).catch(error => {
        console.log(error);
      });
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../libs/css/yxCollege/lcb.less";

.wrapper-height {
  height: 350px !important;
}

.home_container {
  .home_banner {
    margin-top: 25px;
    border-radius: 10px;
    .box-shadow;

    .home_row {
      .wrapper-height;
    }

    .home_nav {
      .bg(rgb(39, 45, 48));
      border-bottom-left-radius: 10px;
      border-top-left-radius: 10px;
      .height;
      .box-shadow;

      ul {
        margin: 0;
      }

      ul li {
        color: #999;
        text-align: center;
        padding: 15px 30px;
        font-size: 16px;
        cursor: pointer;
        box-sizing: border-box;
        border-bottom: 1px solid #272d30;
      }

      ul li:hover,
      ul li:active,
      ul li:visited,
      ul li:first-child {
        .bg(#343f44);
        color: #fff;
      }

      ul li:first-child:hover,
      ul li:first-child {
        border-top-left-radius: 10px;
      }
    }

    .home_carousel > div > .el-carousel--horizontal {
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
    }

    .home_carousel-img {
      .width;
      .height;
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
  }

  .home_content {
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

    .more {
      text-align: right;

      a {
        .color-text(black, none);
        display: inline-block;
      }

      a:hover {
        text-decoration: underline !important;
      }
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
    .bg(#fff);

    &:hover {
      .box-shadow;
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
      background-image: url("../../libs/images/yxCollege/collect-icon_1.png");
    }

    &:hover .icon-out {
      background-image: url("../../libs/images/yxCollege/collect-icon_2.png");
    }

    img {
      width: 230px;
      height: 139px;
      display: inline-block;
    }

    p {
      font-size: 12px;
      padding: 0;
      margin: 10px;
      color: #c0c0c0;
    }

    p:nth-child(3) {
      font-weight: bold;
      color: #000000;
      font-size: 14px;
    }

    .lock {
      .width;
      .height;
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

  .home_lecturer {
    text-align: center;
    margin: 0 -20px -5px -20px;

    .lecturer-bg {
      display: inline-block;
      padding: 60px 0 30px;
      .width;
      height: 430px;
      background-image: url("../../libs/images/yxCollege/lecturer-bg.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }

    .better-bg {
      display: inline-block;
      width: 461px;
      height: 28px;
      background: url("../../libs/images/yxCollege/lecturer-better.png")
        no-repeat 100% 100%;
    }

    .lecturer-more {
      display: inline-block;
      text-align: center;
      width: 175px;
      height: 36px;
      border: 1px solid #fff;
      border-radius: 3px;
      background: #303c55;
      a {
        height: 100%;
        width: 100%;
        display: inline-block;
        line-height: 36px;
        color: #fff !important;
        text-decoration: none;
      }
    }

    .lecturer-panel {
      width: 1200px;
      height: 275px;
      margin: 45px auto 40px;

      .lecturer-card {
        box-sizing: border-box;
        width: 230px;
        height: 250px;
        margin-top: 24px;
        background: #e3e6ee;
        display: inline-block;
        text-align: center;
        border-radius: 5px;
        padding: 10px;
        padding-top: 70px;
        position: relative;

        & + div {
          margin-left: 25px;
        }

        &:hover {
          cursor: pointer;
          box-shadow: 0 2px 8px 0 rgba(255, 255, 255, 0.5);
        }

        .head-img {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background-repeat: no-repeat;
          background-size: 100%;
          display: inline-block;
          position: absolute;
          top: -25px;
          left: 50%;
          margin-left: -45px;
          background-image: url(../../libs/images/yxCollege/phone.png);
        }

        p {
          text-align: center;
          margin: 0;
          padding: 2px 0;
          color: #666;
          font-size: 14px;
        }

        p:nth-child(2) {
          font-weight: bold !important;
          font-size: 18px;
          color: #111;
        }

        .teachDesc {
          padding: 20px 0 4px;
          line-height: 23px;
          height: 90px;
          color: #666;
          font-size: 14px;
          text-align: left;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 4;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>
