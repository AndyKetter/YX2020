<template>
  <!-- 金牌案例list -->
  <div class="goldCaseList">
    <div class="caseContainer yx-college-shadow yx-college-bgfff" v-for="item in caseListObj" :key="item.id" @click="viewCaseDetail(item.id)">
      <div class="coverImg">
        <img :src="imgDomain+'?key='+item.casePic+'&view=true'" alt="案件封面" />
      </div>
      <div class="caseInfo">
        <p class="caseTitle">{{item.caseName}}</p>
        <p class="caseArticle" v-html="item.caseDesc"></p>
        <div class="clearfix pop">
          <div class="pull-left">
            <small>{{item.caseAuthor}}</small>
            <small class="popNum">
              <img src="~libs/images/yxCollege/viewIcon.png" alt="人气icon" />
              {{item.visitsNum}}人气
            </small>
          </div>
          <div class="pull-right">
            <small class="caseTime">{{item.createTime}}</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { POST } from "http/custom.js"

export default {
  name: "goldCaseList",
  props: {
    caseListObj: {
      type: Array,
      required: true,
      default: () => {
        return []
      }
    }
  },
  data() {
    let imgDomain = process.env.VUE_APP_DOMAIN_download + "/oss/download"
    return {
      imgDomain
    }
  },
  filters: {
    //文章内容超出省略号显示 小屏幕需要适配
    ellipsis(v) {
      let str = v.substring(0, 200)
      return str + "..."
    }
  },
  methods: {
    viewCaseDetail(id) {
      POST(process.env.VUE_APP_DOMAIN_personnel + "/commonTrainUpdateTimes", {
        id,
        status: 2
      })
        .then(res => {
          console.log("增加金牌案例访问次数", res)
        })
        .catch(error => {
          console.log(error)
        })
      //跳转到案件对应的详情页面
      this.$router.push(`/yxCollege/goldCase/${id}`)
    }
  }
}
</script>

<style lang="less" scoped>
.caseContainer {
  cursor: pointer;
  padding: 0 20px;
  border-bottom: 1px solid #ddd;
  display: flex;
  .coverImg {
    margin-top: 15px;
    margin-bottom: 15px;
    width: 220px;
    height: 123px;
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
  .caseInfo {
    flex: 1;
    padding-left: 20px;
    .caseTitle {
      font-weight: bolder;
      font-size: 18px;
      margin: 20px 0px 10px;
    }
    .caseArticle {
      //只显示两行，超过两行就结尾...
      line-height: 1.7;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      margin: 0px 0px 10px;
    }
  }
  .pop {
    color: #8f95a5;
    .popNum {
      margin-left: 15px;
    }
    .caseTime {
      margin-right: 20px;
    }
  }
}
</style>
