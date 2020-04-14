<template>
  <div class="lecturer">
    <el-container class="teacher-container">
      <el-alert v-if="lecturerList.length === 0" class="yx_alert_nodata" title="温馨提示:暂无讲师数据" type="info" :closable="false" center show-icon></el-alert>
      <div class="listWrap" v-if="lecturerList.length !== 0">
        <ul class="teacher-list">
          <li class="pointer" v-for="item in lecturerList" :key="item.id" @click="showDetail(item.id)">
            <div class="coverImg">
              <img :src="imgDomain+'?key='+item.teachPic+'&view=true'" alt="暂无图片" />
            </div>
            <article>
              <span>{{item.teachName}}</span>
              <span v-if="item.isElite" class="good">金牌</span>
            </article>
            <div class="teacher-intro">
              <p>{{item.teachDesc}}</p>
            </div>
          </li>
        </ul>
      </div>
    </el-container>
    <!-- 分页 -->
    <div class="yx_pagination" v-if="lecturerList.length !== 0">
      <el-pagination @size-change="handleSizeChange" @current-change="handlecurrentChange" background :current-page="current" :page-sizes="[10,15,20]" :page-size="size" layout="total,sizes,prev,pager,next,jumper" :total="total"></el-pagination>
    </div>
  </div>
</template>

<script>
import { POST } from "http/custom.js"

export default {
  name: "lecturer",
  data() {
    let imgDomain = process.env.VUE_APP_DOMAIN_download + "/oss/download"
    return {
      imgDomain,
      lecturerList: [],
      teachName: "", //需要搜索的讲师名称
      size: 10, //一页显示多少
      current: 1, //当前页码
      total: 0 //一共多少页
    }
  },
  filters: {
    overFlowEllipsis(str) {
      if (str.length > 27) {
        return str.replace(str.slice(27), "...")
      }
      return str
    }
  },
  methods: {
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
    search() {
      let queryObj = {
        current: this.current, //当前页码
        size: this.size, //每页显示记录条数
        teachName: this.teachName //需要搜索的讲师名称
      }
      POST(process.env.VUE_APP_DOMAIN_personnel + "/trainTeachers", queryObj)
        .then(res => {
          this.lecturerList = res.data.records
          this.current = res.data.current //set当前页
          this.size = res.data.size //每页显示记录条数
          this.total = res.data.total //总记录条数
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 展示详情
    showDetail(id) {
      this.$router.push({ path: "lecturer/" + id })
    }
  },
  created() {
    this.teachName = this.$route.query.keyWords || ""
    this.search() //获取讲师风采列表
  }
}
</script>
<style lang="less" scoped>
@import url("~libs/css/yxCollege/mohan.less");
.teacher-container {
  width: 100%;
  * {
    box-sizing: border-box;
  }
  .listWrap {
    width: 100%;
    height: 100%;
  }
  .teacher-list {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    margin: 13px -13px 35px;
    & > li {
      margin: 13px;
      background-color: #ffffff;
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
      & > article {
        display: flex;
        align-items: baseline;
        padding: 10px 14px;
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
      .teacher-intro {
        padding: 2px 14px;
        width: 230px;
        font-size: 14px;
        color: #656565;
        & > p {
          margin: 0;
          width: 100%;
          height: 40px;
          line-height: 20px;
          position: relative;
          overflow: hidden;
          // padding: 0 2px 0 0;
          text-overflow: ellipsis;
          display: -webkit-box;
          display: -webkit-box-flex;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }
  }
}
</style>