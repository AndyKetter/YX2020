<template>
  <div class="goldCaseDetail">
    <div class="guide">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/yxCollege' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/yxCollege/goldCase' }">金牌案例</el-breadcrumb-item>
        <el-breadcrumb-item>
          <i class="el-icon-arrow-right rightCrumbIcon"></i>
          <span>案件详情</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="yx-college-bgfff">
      <div class="caseInfo yx-college-pd20">
        <h2>{{articleInfo.caseName}}</h2>
        <div class="caseAuthorTime clearfix">
          <div class="pull-left">
            <img class="cImgp2" src="@/libs/images/yxCollege/authorIcon.png" alt="头像icon" />
            <span class="infoTxt">{{articleInfo.caseAuthor}}</span>
            <img class="cImg1" src="~libs/images/yxCollege/dpment.png" alt="来源" />
            <span class="infoTxt">{{articleInfo.caseSource}}</span>
            <img src="~libs/images/yxCollege/viewIcon.png" alt="人气icon" />
            <span class="infoTxt">{{articleInfo.visitsNum}}人气</span>
          </div>
          <div class="pull-right">
            <span class="infoTxt">{{articleInfo.createTime}}</span>
          </div>
        </div>
      </div>
      <div class="caseArticle" v-html="articleInfo.caseContent"></div>
    </div>
  </div>
</template>

<script>
import { GET } from "http/custom.js"

export default {
  name: "goldCaseDetail",
  data() {
    return {
      articleInfo: {}
    }
  },
  methods: {
    getCaseDetail() {
      //获取案件详情
      let id = this.$route.params.id //获取路由id
      GET(process.env.VUE_APP_DOMAIN_personnel + "/trainCaseInfo", { id })
        .then(res => {
          this.articleInfo = res.data
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  created() {
    this.getCaseDetail() //获取案件详情
  }
}
</script>
<style lang="less" scoped>
.goldCaseDetail {
  margin-bottom: 20px;
}
.guide {
  padding: 20px 0;
  .rightCrumbIcon {
    color: #c0c4cc;
    padding-right: 6px;
  }
}
.caseAuthorTime {
  color: #8f95a5;
  font-size: 14px;
  .infoTxt {
    margin-left: 5px;
    margin-right: 20px;
  }
  .cImg1 {
    position: relative;
    top: 1px;
  }
  .cImgp2 {
    position: relative;
    top: 2px;
  }
}
.caseArticle {
  padding: 10px 20px 30px;
  line-height: 2;
  text-indent: 20px;
}
.videoWrap {
  padding: 0 20px 40px;
  text-align: center;
  video {
    width: 80%;
  }
}
</style>
