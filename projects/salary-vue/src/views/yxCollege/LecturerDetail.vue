<template>
  <div class="teacher-detail-outer">
    <!-- <div>永雄学院-讲师风采详情</div> -->
    <div class="banner"></div>
    <div class="teacher-detail-container">
      <div class="guide">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/yxCollege' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/yxCollege/lecturer' }">讲师风采</el-breadcrumb-item>
          <el-breadcrumb-item>
            <i class="el-icon-arrow-right rightCrumbIcon"></i>
            <span>讲师介绍</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="teacher-container">
        <div class="teacher-icon-circle"></div>
        <div class="coverImg">
          <img
            v-if="trainTeacher.teachPic"
            :src="imgDomain+'?key='+trainTeacher.teachPic+'&view=true'"
            alt="暂无图片"
          />
        </div>
        <div class="teacher-info">
          <article>
            <span>{{trainTeacher.teachName}}</span>
            <span v-if="trainTeacher.isElite" class="good">金牌</span>
          </article>
          <p>{{trainTeacher.teachDesc}}</p>
        </div>
      </div>
      <div class="teacher-course-container">
        <article>TA的课程</article>
        <CourseListCommon :reloadFun="getTrainTeacherInfo" :courseListObj="classNames" />
      </div>
    </div>
  </div>
</template>

<script>
import { GET } from "http/custom.js"
import CourseListCommon from "components/yxCollege/common/CourseListCommon" //导入课程list组件

export default {
  name: "lecturerDetail",
  components: { CourseListCommon },
  data() {
    let imgDomain = process.env.VUE_APP_DOMAIN_download + "/oss/download"
    return {
      imgDomain,
      trainTeacher: {}, //老师信息
      classNames: [] //课程列表
    }
  },
  methods: {
    getTrainTeacherInfo() {
      let id = this.$route.params.id
      GET(process.env.VUE_APP_DOMAIN_personnel + "/trainTeacherInfo", { id })
        .then(res => {
          this.trainTeacher = res.data.trainTeacher
          this.classNames = res.data.classNames
          console.log("讲师详细信息（风采详情)", res)
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  created() {
    this.getTrainTeacherInfo() //讲师详细信息（风采详情）
  }
}
</script>
<style lang="less" scoped>
.teacher-detail-outer {
  .banner {
    // width: 100%;
    height: 267px;
    margin: 0 -20px;
    background: url("../../libs/images/yxCollege/teacher_banner.png") 0 0 no-repeat;
    background-size: cover;
  }
  .teacher-detail-container {
    margin-top: -267px;
    width: 100%;
    * {
      box-sizing: border-box;
    }
    .guide {
      padding: 20px 0;
      .el-breadcrumb__separator {
        margin: 0 9px;
        font-weight: 700;
        color: #303133;
      }
      .rightCrumbIcon {
        color: #303133;
        padding-right: 6px;
      }
    }
    .teacher-container {
      position: relative;
      background-color: #fff;
      padding: 23px;
      display: flex;
      overflow: hidden;
      .teacher-icon-circle {
        position: absolute;
        top: 0;
        right: 0;
        width: 145px;
        height: 145px;
        border-radius: 50%;
        transform: translate(50%, -50%);
        background-color: rgba(47, 117, 238, 0.1);
      }
      .coverImg {
        width: 230px;
        height: 230px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          transition: all 0.5s;
          &:hover {
            transform: scale(1.2); //图片放大的倍数
          }
        }
      }
      .teacher-info {
        padding: 10px 0 10px 23px;
        & > article {
          display: flex;
          align-items: baseline;
          padding: 20px 14px;
          & > span {
            font-size: 18px;
            color: #232323;
            display: block;
          }
          .good {
            color: #fff;
            background-color: #ffa70f;
            font-size: 12px;
            padding: 2px 3px;
            border-radius: 2px;
            margin-left: 2px;
          }
        }
        & > p {
          margin: 0;
          font-size: 14px;
          line-height: 20px;
          color: #a5a4a4;
        }
      }
    }
    .teacher-course-container {
      margin-top: 3px;
      padding: 10px 0;
      & > article {
        padding: 17px 0;
        font-size: 17px;
      }
    }
  }
}
</style>