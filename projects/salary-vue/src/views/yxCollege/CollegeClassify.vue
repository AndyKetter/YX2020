<template>
  <div class="categoryColleges">
    <section class="bread">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item to="/yxCollege/home">首页&nbsp;&gt;</el-breadcrumb-item>
        <el-breadcrumb-item>学院分类</el-breadcrumb-item>
      </el-breadcrumb>
    </section>
    <section class="mgt15">
      <div class="college-tab">
        <span :class="tabId === '1' ? 'tab-bg color' :''" @click.stop="changTab('1')">通用课程学院</span>
        <span :class="tabId === '2' ? 'tab-bg color' :''" @click.stop="changTab('2')">业务管理学院</span>
        <span :class="tabId === '3' ? 'tab-bg color' :''" @click.stop="changTab('3')">职能管理学院</span>
        <span :class="tabId === '4' ? 'tab-bg color' :''" @click.stop="changTab('4')">专家管理学院</span>
      </div>
      <div class="order-panel">
        <div class="college-order">
          <span class="tab-bg">{{orderName}}</span>
          <span>|</span>
          <span>
            <span :class="btnIdOrder === 'createTime' ? 'btn-bg' :''" @click.stop="changBtnOrder('createTime')">最新课程</span>
          </span>
          <span>
            <span :class="btnIdOrder === 'viewed_num' ? 'btn-bg' :''" @click.stop="changBtnOrder('viewed_num')">热门排序</span>
          </span>
          <span>
            <span :class="btnIdOrder === 'isCollection' ? 'btn-bg' :''" @click.stop="changBtnOrder('isCollection')">收藏课程</span>
          </span>
        </div>
        <div class="college-order" v-if="tabId === '2'">
          <span class="tab-bg">课程类型</span>
          <span>|</span>
          <span>
            <span :class="btnIdType === -1 ? 'btn-bg' :''" @click.stop="changBtnType(-1)">全部课程</span>
          </span>
          <span>
            <span :class="btnIdType === 0 ? 'btn-bg' :''" @click.stop="changBtnType(0)">组员课程</span>
          </span>
          <span>
            <span :class="btnIdType === 1 ? 'btn-bg' :''" @click.stop="changBtnType(1)">组长课程</span>
          </span>
          <span>
            <span :class="btnIdType === 2 ? 'btn-bg' :''" @click.stop="changBtnType(2)">部长课程</span>
          </span>
          <span>
            <span :class="btnIdType === 3 ? 'btn-bg' :''" @click.stop="changBtnType(3)">副总课程</span>
          </span>
        </div>
      </div>
    </section>
    <section class="mgt15" style="margin-bottom: 40px !important;">
      <!-- 课程组件 -->
      <CourseListCommon :reloadFun="search" :toDetailUrl="toDetailUrl.detail.url" :courseListObj="personalCourseInfo.courseList.records" />
      <el-alert v-if="personalCourseInfo.courseList.records.length === 0" class="yx_alert_nodata" title="温馨提示:暂无课程数据" type="info" :closable="false" center show-icon></el-alert>
      <!-- 分页 -->
      <div id="pagination" class="pagination" v-if="personalCourseInfo.courseList.records.length !== 0">
        <el-pagination background @size-change="handleSizeChange" @current-change="handlecurrentChange" :current-page="pageObj.current" :page-sizes="[10,15,20]" :page-size="pageObj.size" layout="total,sizes,prev,pager,next,jumper" :total="pageObj.total"></el-pagination>
      </div>
    </section>
  </div>
</template>

<script>
import { POST } from "http/custom.js"
import CourseListCommon from "components/yxCollege/common/CourseListCommon"

export default {
  name: "categoryColleges",
  components: { CourseListCommon },
  data() {
    return {
      personalCourseInfo: {
        courseList: {
          records: []
        }
      },
      toDetailUrl: {
        detail: {
          url: "/yxCollege/collegeClassifyDetail"
        }
      },
      tabId: "1", //tab页面
      btnIdOrder: "createTime", //排序
      btnIdType: -1, //课程类型
      orderName: "", //排序名称
      pageObj: {
        size: 10, //每页显示记录条数
        current: 1, //当前页码
        total: 0, //总记录数据
        dataTable: [] //表格数据
      }
    }
  },
  created() {
    this.tabShow()
  },
  methods: {
    switchType(idx) {
      switch (idx) {
        case "1":
          this.orderName = "学习类型"
          break
        case "2":
          this.orderName = "课程排序"
          break
        case "3":
          this.orderName = "职能类型"
          break
        case "4":
          this.orderName = "职能类型"
          break
        default:
          this.orderName = "学习类型"
          break
      }
    },
    tabShow() {
      const id = this.$route.params.id
      if (!id) {
        return
      }
      this.tabId = id
      this.switchType(id) //第一行参数名称
      this.search() //课程查询
    },
    handleSizeChange(val) {
      //分页,下拉
      this.pageObj.size = val
      this.search()
    },
    handlecurrentChange(val) {
      //当前页，点击页码
      this.pageObj.current = val
      this.search()
    },
    search() {
      //课程查询
      let obj = {
        descs: [this.btnIdOrder], //排序字段,
        //新员工入职培训  this.tabId不能为字符   2-通用课程培训 3-业务管理培训 4-职能管理培训 5-专家管理培训
        classType: isNaN(parseInt(this.tabId)) === false ? parseInt(this.tabId) + 1 : 1,
        current: this.pageObj.current,
        size: this.pageObj.size
      }
      if (this.tabId === "2") {
        //为业务管理学院时 有两行参数
        obj = Object.assign(obj, { type: this.btnIdType })
      }
      POST(process.env.VUE_APP_DOMAIN_personnel + "/commonTrainCourseLists", obj)
        .then(res => {
          this.personalCourseInfo.courseList.records = res.data.records //set表格的值
          this.pageObj.size = res.data.size //每页显示记录条数
          this.pageObj.current = res.data.current // set当前页
          this.pageObj.total = res.data.total //总记录数据
        })
        .catch(error => {
          console.log(error)
        })
    },
    changTab(idx) {
      //tab切换
      this.tabId = idx
      this.$router.push("/yxCollege/collegeClassify/" + idx) //与路由参数同步
      this.switchType(idx)
      this.btnIdOrder = "createTime" //排序重置
      this.search()
    },
    changBtnOrder(txt) {
      // 第一行参数
      this.btnIdOrder = txt
      this.pageObj.current = 1
      this.search()
    },
    changBtnType(idx) {
      // 第二行参数
      this.btnIdType = idx
      this.pageObj.current = 1
      this.search()
    }
  }
}
</script>

<style lang="less" scoped>
/*公用*/

.height {
  height: 100% !important;
}
.width {
  width: 100% !important;
}
.bg(@color:rgb(39, 45, 48)) {
  background-color: @color !important;
}
.color-text(@color:#fff,@textDecoration:none) {
  color: @color !important;
  text-decoration: @textDecoration !important;
}
.box-shadow {
  box-shadow: 0 2px 12px 0 rgba(109, 109, 109, 0.5);
  -webkit-box-shadow: 0 2px 12px 0 rgba(109, 109, 109, 0.5);
}
.in-block {
  display: inline-block;
}

/*公用*/
/*局部公用*/
.tab-span {
  padding: 10px 25px;
  .in-block;
  cursor: pointer;
}

.bread {
  padding: 15px 0 0;
}

/*局部公用*/

.college-tab {
  .bg(#ddd);
  .width;
  span {
    .tab-span;
    font-weight: bold;
    font-size: 14px;
  }

  .color {
    color: #409eff !important;
  }

  .tab-bg {
    .bg(#ffffff);
  }
}

.order-panel {
  .bg(#ffffff);
  font-size: 14px;

  & > div + div {
    border-top: 1px dashed #c0c0c0;
  }

  .college-order {
    margin: 0 25px;
    span {
      .tab-span;
      padding: 10px 30px 10px 0;

      span {
        padding: 5px 15px;
        border-radius: 5px;
      }
      .btn-bg {
        .bg(#409eff);
        color: #fff;
      }
      span:hover {
        .btn-bg;
      }
    }
  }
}

.pagination {
  width: 100%;
  position: absolute;
  bottom: 140px;
  right: 20px;
  z-index: 50;
}
</style>
