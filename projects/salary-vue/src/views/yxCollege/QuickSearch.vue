<template>
  <div class="quickSearch">
    <section class="bread">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item to="/yxCollege/home">首页&nbsp;&gt;</el-breadcrumb-item>
        <el-breadcrumb-item>快速搜索</el-breadcrumb-item>
      </el-breadcrumb>
    </section>
    <section class="mgt15" style="margin-bottom:40px">
      <!-- <div class="collect-wrapper" v-if="trainClass.length !== 0">
        <div class="collect" v-for="(item,index) of trainClass" :key="index" @click.stop="goDetail(item)">
          <div class="icon" :title="item.isCollection === 1 ?'已收藏':'未收藏'" :class="item.isCollection === 1 ? 'icon-show':'icon-out'" @click.stop="JS_collect(item)"></div>
          <img :src="item.classPic" :alt="item.className">
          <p>{{item.className}}</p>
          <p>{{item.teachName}}&nbsp;|&nbsp;时长：{{item.classTime}}分钟</p>
          <div class="lock" v-if="item.isLock === 1">
            <img src="../../libs/images/yxCollege/lock.png" alt="暂无图片">
          </div>
        </div>
        <div class="collect copy" v-for="(item,index) in 10" :key="trainClass.length > 0 ? trainClass.length++:index"></div>
      </div> -->
      <!-- 课程组件 -->
      <CourseListCommon :reloadFun="search" :toDetailUrl="toDetailUrl.detail.url" :courseListObj="personalCourseInfo.courseList.records" />
      <el-alert v-if="trainClass.length === 0" class="yx_alert_nodata" title="温馨提示:暂无课程数据" type="info" :closable="false" center show-icon></el-alert>
    </section>
    <!-- 分页 -->
    <div id="pagination" class="pagination" v-if="trainClass.length !== 0">
      <el-pagination background @size-change="handleSizeChange" @current-change="handlecurrentChange" :current-page="pageObj.current" :page-sizes="[10,15,20]" :page-size="pageObj.size" layout="total,sizes,prev,pager,next,jumper" :total="pageObj.total"></el-pagination>
    </div>
  </div>
</template>

<script>
import { POST } from "http/custom.js";
import CourseListCommon from 'components/yxCollege/common/CourseListCommon'

export default {
  name: "quickSearch",
  components: { CourseListCommon },
  props: {},
  data() {
    return {
      trainClass: [],
      personalCourseInfo: {
        courseList: {
          records: []
        }
      },
      pageObj: {
        size: 10, //每页显示记录条数
        current: 1, //当前页码
        total: 0, //总记录数据
        dataTable: [] //表格数据
      },
      toDetailUrl: {
        detail: {
          url: '/yxCollege/collegeClassifyDetail'
        }
      },
    };
  },
  created() {
    this.search();
    console.log('先');
  },
  methods: {
    handleSizeChange(val) {//分页,下拉
      this.pageObj.size = val;
      this.search();
    },
    handlecurrentChange(val) { //当前页，点击页码
      this.pageObj.current = val;
      this.search();
    },
    goDetail(item) { //课程到详情
      console.log('课程到详情');
      if (item.isLock === 1) {
        return;
      }
      this.$router.push({
        path: '/yxCollege/collegeClassifyDetail/' + item.id
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
          this.search();
        }
      }).catch(error => {
        console.log(error);
      });
    },
    search() {
      if (this.$route.query.type === undefined || this.$route.query.keyWords === undefined) {
        return;
      }
      let obj = {
        className: this.$route.query.keyWords,
        current: this.pageObj.current,
        size: this.pageObj.size,
        ascs: [],
        classTeach: '',
        classType: '',
        descs: []
      };
      POST(process.env.VUE_APP_DOMAIN_personnel + '/trainClasses', obj).then(res => {
        this.trainClass = res.data.records; //set表格的值
        this.pageObj.size = res.data.size; //每页显示记录条数
        this.pageObj.current = res.data.current; // set当前页
        this.pageObj.total = res.data.total; //总记录数据          

        // let url = `${process.env.VUE_APP_DOMAIN_download}/oss/download?`;
        // if (this.trainClass.length > 0) {
        //   this.trainClass.forEach(item => {
        //     item.classPic = `${url}key=${item.classPic}&view=true`;
        //   });
        // }
        this.personalCourseInfo.courseList.records = this.trainClass;
        //console.log(this.trainClass);
      }).catch(error => {
        console.log(error);
      });
    }
  },
  filter: {},
  computed: {},
  watch: {},
};
</script>

<style lang="less" scoped>
@import "~libs/css/yxCollege/lcb";

.bread {
  padding: 15px 0 0;
}

.quickSearch {
  margin-bottom: 40px;
}
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
    padding: 0;
    margin-bottom: 0;
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

.pagination {
  width: 100%;
  position: absolute;
  bottom: 140px;
  right: 20px;
  z-index: 50;
}
</style>
