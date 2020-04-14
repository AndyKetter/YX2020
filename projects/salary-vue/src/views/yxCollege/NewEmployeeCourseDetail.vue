<template>
  <div class="new-employee-course">
    <section class="course-top">
      <el-col>
        <el-col :span="24" class="top-nav">
          <router-link to class="link">
            <img @click="toBack" src="../../libs/images/yxCollege/back.png" alt="back" />&nbsp;
            <span>新员工入职培训之{{articleInfo.className}}</span>
          </router-link>
        </el-col>
      </el-col>
    </section>
    <section class="course-centent">
      <el-container class="case-container">
        <el-main class="case-main">
          <yx-video
            v-if="isReLoading"
            :videoSrc="`${videoDomain}${articleInfo.classVedio}?action=play`"
            :isNew="true"
          ></yx-video>
          <!-- 解决数据加载时视频标签无高度的问题 -->
          <video class="w100" v-else></video>
          <div class="case-video-info">
            <div class="case-context">
              <div class="case-title">
                <h3>课程简介</h3>
              </div>
              <p>{{articleInfo.classIntroduction || "暂无简介"}}</p>
            </div>
          </div>
        </el-main>
        <el-aside width="30%" class="case-aside">
          <div class="case-teacher">
            <div class="case-img">
              <img
                v-if="articleInfo.teachPic"
                :src="imgDomain+'?key='+articleInfo.teachPic+'&view=true'"
                alt="讲师头像"
              />
              <h4>{{articleInfo.teachName}}</h4>
            </div>
            <p class="case-teacher-intro">{{articleInfo.teachDesc || "暂无简介"}}</p>
          </div>
          <div class="case-context-download">
            <div class="case-title">
              <h3>
                课程附件:
                <a class="case-file-tip">{{articleInfo.courseWareInitName || "暂无课件"}}</a>
              </h3>
              <el-button v-if="articleInfo.courseWare" type="primary" @click="download">课件下载</el-button>
            </div>
          </div>
        </el-aside>
      </el-container>
    </section>
    <Foot />
  </div>
</template>

<script>
import { GET } from "http/custom.js"
import Foot from "components/yxCollege/Foot"
import yxVideo from "components/yxCollege/common/YxVideo"
export default {
  name: "newEmployeeCourseDetail",
  components: {
    yxVideo,
    Foot
  },
  data() {
    let imgDomain = process.env.VUE_APP_DOMAIN_download + "/oss/download",
      videoDomain = process.env.VUE_APP_DOMAIN_video //视频播放域名
    return {
      // 重新加载视频
      isReLoading: false,
      // 视频加载地址
      videoDomain,
      imgDomain,
      articleInfo: {}
    }
  },
  methods: {
    getCourseDetail() {
      //获取案件详情
      let id = this.$route.params.id //获取路由id
      GET(process.env.VUE_APP_DOMAIN_personnel + "/commonTrainCourseDetails", { id })
        .then(res => {
          this.articleInfo = res.data.trainClass
          this.isReLoading = true
        })
        .catch(error => {
          console.log(error)
        })
    },
    download() {
      window.location.href = this.imgDomain + "?key=" + this.articleInfo.courseWare
    },
    toBack() {
      //返回上一个页面
      this.$router.go(-1)
    }
  },
  created() {
    this.getCourseDetail() //获取案件详情
  }
}
</script>

<style lang="less" scoped>
@import "~libs/css/yxCollege/lcb.less";

.course-top .top-nav {
  margin: 0 !important;
}
.course-centent {
  padding: 70px 20px 130px 20px;
}
.case-container {
  * {
    box-sizing: border-box;
  }
  .case-main {
    padding: 0;
    .case-video-info {
      padding: 15px 15px 15px 0;
      .case-context {
        padding: 10px 0;
        background-color: #fff;
        .case-title {
          display: flex;
          justify-content: space-between;
          padding: 10px;
          color: #111111;
          & > h3 {
            margin: 0;
            padding: 0;
          }
          .case-file-tip {
            font-weight: normal;
          }
        }
        & > p {
          padding: 0 10px;
          font-size: 16px;
          line-height: 24px;
          color: #747474;
          margin: 0;
        }
      }
    }
  }
  .case-aside {
    max-width: 350px;
    padding-bottom: 15px;
    display: flex;
    flex-direction: column;
    .case-teacher {
      background-color: #fff;
      padding: 20px 0;
      .case-img {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px 0;
        & > img {
          width: 80px;
          height: 80px;
          display: block;
          border-radius: 50%;
        }
        & > h4 {
          margin: 0;
          padding: 10px;
        }
      }
      .case-teacher-intro {
        text-indent: 15px;
        margin: 0;
        padding: 0 10px;
        color: #747474;
        font-size: 14px;
        line-height: 24px;
        width: 100%;
      }
    }

    .case-context-download {
      flex: 1;
      padding: 10px 0;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      justify-content: center;
      .case-title {
        padding: 10px;
        color: #111111;
        & > h3 {
          margin: 0;
          padding: 18px;
        }
        .case-file-tip {
          font-weight: normal;
        }
      }
    }
  }
}
</style>
