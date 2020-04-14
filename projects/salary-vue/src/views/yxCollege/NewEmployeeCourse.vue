<template>
  <div class="new-employee-course">
    <section class="course-top">
      <el-col>
        <el-col :span="12" class="top-nav">
          <a href="javascript:;" class="link" @click="backHome" title="返回">
            <img src="../../libs/images/yxCollege/back.png" alt="back">
          </a>&nbsp;
          <span>两天培训课</span>
        </el-col>
        <el-col :span="12" class="top-nav txt-align">
          <el-button type="primary" class="font-size" @click="JS_exam">入职考试</el-button>
        </el-col>
      </el-col>
    </section>
    <section class="course-centent">
      <!-- 课程组件 -->
      <CourseListCommon :isNew="true" :reloadFun="search" :toDetailUrl="toDetailUrl.detail.url" :courseListObj="personalCourseInfo.courseList.records" />
      <el-alert v-if="personalCourseInfo.courseList.records.length === 0" class="yx_alert_nodata" title="温馨提示:暂无课程数据" type="info" :closable="false" center show-icon></el-alert>
      <!-- 分页 暂不显示分布 -->
      <!-- <div id="pagination" class="pagination">
        <el-pagination background @size-change="handleSizeChange" @current-change="handlecurrentChange" :current-page="pageObj.current" :page-sizes="[10,20,30,40]" :page-size="pageObj.size" layout="total,sizes,prev,pager,next,jumper" :total="pageObj.total"></el-pagination>
      </div>-->
    </section>
    <!-- 新员工入职考试 -->
    <el-dialog class="grayBg" title="新员工入职考试" :close-on-click-modal="false" :visible.sync="poppShow" width="600px">
      <div class="whiteBox train-dialog">
        <el-row type="flex" class="row-bg" justify="center" v-if="!dataLise.isLearn">
          <el-col :span="24">
            <p style="color:red;">注意：需要把培训视频全部看完才能开始考试哦~</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <p>
              <span>当前状态：</span>
              <span>{{dataLise.isPass}}</span>
            </p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <p>
              <span>考试成绩：</span>
              <span>{{dataLise.score}}</span>
            </p>
          </el-col>
        </el-row>
        <el-row v-if="dataLise.isPass ==='通过'">
          <el-col :span="24">
            <p style="color:red;">恭喜！您已经通过本次入职考试</p>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- 课程未看完 或 考试通过 按钮置灰 &&  -->
        <el-button type="primary" @click="toOaExam" :disabled="!dataLise.isLearn || dataLise.isPass ==='通过'" v-no-more-click>{{btnName}}</el-button>
      </span>
    </el-dialog>
    <Foot />
  </div>
</template>

<script>
import { GET, POST } from "http/custom.js"
import Foot from "components/yxCollege/Foot"
import CourseListCommon from "components/yxCollege/common/CourseListCommon"
export default {
  name: "newEmployeeCourse",
  components: {
    Foot,
    CourseListCommon
  },
  data() {
    return {
      personalCourseInfo: {
        courseList: {
          records: []
        }
      },
      toDetailUrl: {
        detail: {
          url: "/newEmployeeCourseDetail"
        }
      },
      poppShow: false, //显示弹窗
      btnShow: false, //入职考试
      btnName: "开始考试", //按钮文本
      dataLise: {}, //个人考试信息
      dataTable: [], //课程数据
      pageObj: {
        size: 10, //每页显示记录条数
        current: 1, //当前页码
        total: 0 //总记录数据
      }
    }
  },
  created() {
    //获取考试信息
    this.getExamInfo()
    //获取课程
    this.search()
  },
  methods: {
    // handleSizeChange(val) {//分页,下拉
    //   this.pageObj.size = val;
    //   this.search();
    // },
    // handlecurrentChange(val) { //当前页，点击页码
    //   this.pageObj.current = val;
    //   this.search();
    // },
    backHome() {
      //跳转首页
      POST(process.env.VUE_APP_DOMAIN_oa_manage + "/reguser/logoutTrainUser")
        .then(res => {
          if (res.IsSuccess) {
            window.location.href = `${process.env.VUE_APP_DOMAIN}/html/login.html`
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    JS_exam() {
      this.poppShow = true
    },
    search() {
      //课程
      let obj = {
        classType: 1, //新员工入职培训
        current: this.pageObj.current,
        size: this.pageObj.size
      }
      POST(process.env.VUE_APP_DOMAIN_personnel + "/commonTrainCourseLists", obj)
        .then(res => {
          this.personalCourseInfo.courseList.records = res.data.records //set表格的值
          //this.pageObj.size = res.data.size; //每页显示记录条数
          //this.pageObj.current = res.data.current; // set当前页
          //this.pageObj.total = res.data.total; //总记录数据
        })
        .catch(error => {
          console.log(error)
        })
    },
    async getExamInfo() {
      //获取考试信息
      const awaitWrap = promise => {
        return promise.then(data => [null, data]).catch(err => [err, null])
      }
      //查询  获取考试详情 与 是否已学习完全部课程
      const [err, examRes] = await awaitWrap(GET(process.env.VUE_APP_DOMAIN_personnel + "/getRuleInfo"))
      const [err2, learnRes] = await awaitWrap(GET(process.env.VUE_APP_DOMAIN_personnel + "/getIsLearnInfo"))
      if (err === null && examRes.code === 0) {
        let isPass = ""
        switch (examRes.data.is_pass) {
          case 0:
            isPass = "待考试"
            this.poppShow = false
            this.btnName = "开始考试"
            break
          case 1:
            isPass = "通过"
            this.poppShow = true
            break
          case 2:
            isPass = "未通过"
            this.poppShow = true
            this.btnName = "重新考试"
            break
        }
        this.dataLise = {
          //汇总数据
          isPass: isPass,
          isLearn: err2 === null && learnRes.data.isLearn === 1 ? true : false, // true 已经学习完了视频
          score: (examRes.data.score !== undefined ? examRes.data.score : "--") + "分"
        }
        //console.log(!this.dataLise.isLearn);
      }
    },
    toOaExam() {
      //开始考试
      //跳转到老系统考试页面
      location.href = `${process.env.VUE_APP_DOMAIN}/html/examsystem/htmlmanage/entry_exam_train.html`
    }
  }
}
</script>

<style lang="less" scoped>
@import "~libs/css/yxCollege/lcb";

.course-centent {
  padding: 100px 20px 150px 20px !important;
}

// .pagination {
//   text-align: center !important;
//   width: 100%;
//   position: absolute;
//   bottom: 160px;
//   margin-left: -20px;
//   z-index: 50;
// }
</style>
