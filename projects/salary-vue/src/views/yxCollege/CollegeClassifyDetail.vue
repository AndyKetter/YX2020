<template>
  <!-- <div>学院分类-课程详情</div> -->
  <div class="caseWrapDetail">
    <div class="caseDetailTitle">
      <img @click="toBack" src="../../libs/images/yxCollege/back.png" alt="back" />&nbsp;
      <span>{{sampleCourseInfo.className}}</span>
    </div>
    <el-container class="case-container">
      <el-main class="case-main">
        <div class="case-video-container">
          <yx-video
            v-if="isReLoading"
            :videoSrc="`${videoDomain}${sampleCourseInfo.classVedio}?action=play`"
          ></yx-video>
          <!-- 解决数据加载时视频标签无高度的问题 -->
          <video class="w100" v-else></video>
        </div>
        <div class="case-video-info">
          <div class="case-context">
            <div class="case-title">
              <h3>课程简介</h3>
            </div>
            <p>{{sampleCourseInfo.classIntroduction || "暂无简介"}}</p>
          </div>
          <div class="case-context">
            <div class="case-title">
              <h3>
                课程附件:
                <a class="case-file-tip">{{sampleCourseInfo.courseWareInitName || "暂无课件"}}</a>
              </h3>
              <el-button
                v-if="sampleCourseInfo.courseWare"
                type="primary"
                @click="downloadAttachment(sampleCourseInfo.courseWare)"
              >课件下载</el-button>
            </div>
          </div>
        </div>
      </el-main>
      <el-aside width="30%" class="case-aside">
        <div class="case-teacher">
          <div class="case-img">
            <img
              v-if="sampleCourseInfo.teachPic"
              :src="imgDomain+'?key='+sampleCourseInfo.teachPic+'&view=true'"
              alt="讲师头像"
            />
            <h4>{{sampleCourseInfo.teachName}}</h4>
          </div>
          <p class="case-teacher-intro">{{sampleCourseInfo.teachDesc || "暂无简介"}}</p>
        </div>
        <div class="case-course">
          <div class="case-course-title">
            <article>最新课程</article>
            <router-link to="/yxCollege/collegeClassify/1">
              <span class="case-course-more pointer">更多</span>
            </router-link>
          </div>
          <div class="case-course-list">
            <ul v-if="courses.length">
              <li
                v-for="item in courses"
                :key="item.id"
                @click="browCourseInfo(item.id,item.isLock)"
              >
                <div class="lock" v-if="item.isLock === 1">
                  <img src="../../libs/images/yxCollege/lock.png" alt="暂无图片" />
                </div>
                <img
                  :src="imgDomain+'?key='+item.classPic+'&view=true'"
                  alt="课程图片"
                  :title="item.className"
                />
                <p>{{item.className}}</p>
              </li>
            </ul>
          </div>
        </div>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import yxVideo from "components/yxCollege/common/YxVideo"
import { GET } from "http/custom.js"
export default {
  name: "collegeClassifyDetail",
  components: {
    yxVideo
  },
  data() {
    let imgDomain = process.env.VUE_APP_DOMAIN_download + "/oss/download",
      videoDomain = process.env.VUE_APP_DOMAIN_video //视频播放域名
    return {
      // 重新加载视频
      isReLoading: false,
      // 视频加载地址
      videoDomain,
      //图片加载地址
      imgDomain,
      // 最新课程列表
      courses: [],
      // 单个课程信息
      sampleCourseInfo: {
        classVedio: ""
      }
    }
  },
  methods: {
    // 下载附件
    downloadAttachment(key) {
      window.location.href = `${this.imgDomain}?key=${key}`
    },
    // 加载课程信息
    loadCourseInfo(id) {
      GET(`${process.env.VUE_APP_DOMAIN_personnel}/commonTrainCourseDetails`, { id }).then(res => {
        console.log("数据", res)
        this.courses = res.data.courses
        this.sampleCourseInfo = { ...this.sampleCourseInfo, ...res.data.trainClass }
        this.isReLoading = true
      })
    },
    // 浏览课程信息
    browCourseInfo(id, isLock) {
      //isLock 0未上锁,1上锁了
      if (this.$route.params.id === id || isLock === 1) return //已经是本视频(说明没有切换到新视频)或者已经上锁了,不跳转直接return
      this.$router.push({ name: "collegeClassifyDetail", params: { id } })
      this.loadCourseInfo(id)
    },
    toBack() {
      //返回上一个页面
      this.$router.go(-1)
    }
  },
  created() {
    this.loadCourseInfo(this.$route.params.id)
  }
}
</script>
<style lang="less" scoped>
.color-text(@color: #fff, @textDecoration: none) {
  color: @color !important;
  text-decoration: @textDecoration !important;
}
.w100 {
  width: 100%;
}
.caseDetailTitle {
  height: 60px;
  background-color: #fff;
  line-height: 60px;
  margin-top: 15px;
  padding: 0 20px;
  img {
    position: relative;
    top: 3px;
    cursor: pointer;
  }
  span {
    font-size: 16px;
    font-weight: 700;
  }
}
.case-container {
  padding-top: 15px;
  * {
    box-sizing: border-box;
  }
  .case-main {
    padding: 0;
    .case-video-container {
      width: 100%;
    }
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
          // display: block;
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
        max-height: 72px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        display: -webkit-box-flex;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
    }
    .case-course {
      flex: 1;
      display: flex;
      flex-direction: column;
      background-color: #fff;

      .case-course-title {
        border-left: 2px solid #2f75ee;
        display: flex;
        justify-content: space-between;
        padding: 5px;
        font-size: 18px;
        a {
          .color-text(black, none);
          display: inline-block;
        }

        a:hover {
          text-decoration: underline !important;
        }
      }
      .case-course-list {
        position: relative;
        flex: 1;
        & > ul {
          margin: 0;
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          overflow-x: hidden;
          overflow-y: auto;
          li {
            display: flex;
            align-items: flex-start;
            margin: 10px;
            position: relative;
            cursor: pointer;
            & > img {
              width: 125px;
              height: 76px;
              display: block;
            }
            & > p {
              flex: 1;
              font-size: 14px;
              // line-height: 24px;
              margin: 0;
              padding: 5px;
              color: #666666;
            }
            & > .lock {
              width: 125px;
              height: 76px;
              position: absolute;
              top: 0;
              background-color: #636363;
              opacity: 0.5;
              text-align: center;
              -webkit-user-select: none;
              user-select: none;

              img {
                width: 25px;
                height: 30px;
                display: inline-block;
                margin-top: 20px;
              }
            }
          }
        }
      }
    }
  }
}
</style>