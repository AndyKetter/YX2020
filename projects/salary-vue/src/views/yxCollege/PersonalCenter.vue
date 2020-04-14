<template>
  <div class="yxPersonalCenter">
    <div class="personalBanBg">
      <div class="centerInfo clearfix">
        <div class="uImg pull-left">
          <img src="~libs/images/yxCollege/duser.png" alt="个人中心头像" />
        </div>
        <div class="userOrg pull-left">
          <h3 class="userName">{{personalCourseInfo.username}}（{{personalCourseInfo.areaName}}）</h3>
          <div class="dpInfo">{{personalCourseInfo.levelExpand}}</div>
        </div>
      </div>
    </div>
    <div class="curseWrap">
      <div class="clearfix courseType">
        <div
          class="pull-left courseUn"
          :class="searchType===2?'bb2f75ee':''"
          @click="switchCourse(2)"
        >已学课程</div>
        <div
          class="pull-left courseUn collectCourse"
          :class="searchType===1?'bb2f75ee':''"
          @click="switchCourse(1)"
        >收藏课程</div>
      </div>
      <section class="course_content">
        <el-alert
          v-if="personalCourseInfo.courseList.records.length === 0"
          class="yx_alert_nodata"
          title="温馨提示:暂无课程数据"
          style="background-color:#e7e7e7;"
          type="info"
          :closable="false"
          center
          show-icon
        ></el-alert>
        <el-row>
          <el-col :span="24">
            <CourseListCommon
              :reloadFun="JS_search"
              :courseListObj="personalCourseInfo.courseList.records"
            />
          </el-col>
        </el-row>
      </section>
      <!-- 分页 -->
      <div class="yx_pagination" v-if="personalCourseInfo.courseList.records.length !== 0">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handlecurrentChange"
          background
          :current-page="current"
          :page-sizes="[10,15,20,30]"
          :page-size="size"
          layout="total,sizes,prev,pager,next,jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { POST } from "http/custom.js"
import CourseListCommon from "components/yxCollege/common/CourseListCommon" //导入课程list组件

export default {
  name: "personalCenter",
  components: { CourseListCommon },
  data() {
    return {
      personalCourseInfo: {
        courseList: {
          records: []
        }
      },
      searchType: 2, //2-已学课程 1-收藏课程
      size: 10, //一页显示多少
      current: 1, //当前页码
      total: 0 //一共多少页
    }
  },
  methods: {
    switchCourse(searchType) {
      this.searchType = searchType
      this.JS_search() //2-已学课程 1-收藏课程
    },
    handleSizeChange(val) {
      //一页显示多少切换
      this.size = val //保存状态-每页显示多少条数据切换
      this.search()
    },
    handlecurrentChange(val) {
      //页码切换
      this.current = val //保存状态-当前页
      this.search()
    },
    JS_search() {
      this.current = 1 //点击搜索current=1搜索第一页
      this.search()
    },
    search() {
      //获取课程列表,查询类型searchType,2-已学课程 1-收藏课程
      let queryObj = {
        current: this.current, //当前页码
        size: this.size, //每页显示记录条数
        searchType: this.searchType
      }
      POST(process.env.VUE_APP_DOMAIN_personnel + "/queryPersonCenter", queryObj)
        .then(res => {
          console.log("获取课程列表", res)
          this.personalCourseInfo = res.data
          this.current = res.data.courseList.current //set当前页
          this.size = res.data.courseList.size //每页显示记录条数
          this.total = res.data.courseList.total //总记录条数
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  created() {
    this.search() //获取课程列表
  }
}
</script>

<style lang="less" scoped>
@import url("~libs/css/yxCollege/mohan.less");
.yxPersonalCenter {
  margin-left: -20px;
  margin-right: -20px;
}
.personalBanBg {
  position: relative;
  height: 136px;
  background: #030303 url("~libs/images/yxCollege/pBg.png") center 0 no-repeat;
  background-size: cover;
}
.centerInfo {
  width: 500px;
  color: #fff;
  position: absolute;
  top: 30px;
  left: 40px;
  .userOrg {
    margin-left: 20px;
  }
}
.curseWrap {
  padding: 60px 40px 30px;
  .courseUn {
    padding: 18px 0;
    font-size: 18px;
    font-weight: 700;
  }
  .bb2f75ee {
    border-bottom: 3px solid #2f75ee;
  }
  .collectCourse {
    margin-left: 40px;
  }
  .courseType {
    border-bottom: 2px solid #ddd;
  }
}

.course_content {
  padding-top: 25px;
}
</style>
