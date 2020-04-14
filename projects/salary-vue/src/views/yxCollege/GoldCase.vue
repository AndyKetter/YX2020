<template>
  <div class="goldCase">
    <GoldCaseList :caseListObj="caseListObj" />
    <div class="moreSearch" v-if="caseListObj.length !== 0">
      <el-button type="primary" plain @click="searchMore">查询更多案例</el-button>
    </div>
  </div>
</template>

<script>
import { POST } from "http/custom.js"
import GoldCaseList from "components/yxCollege/goldCase/GoldCaseList" //导入金牌案例list组件

export default {
  name: "goldCase",
  components: {
    GoldCaseList
  },
  data() {
    return {
      caseListObj: [],
      currentPage: 1 //默认第一页，保存当前是第几页
    }
  },
  methods: {
    getCaseList(current = 1) {
      //默认第一页
      //获取金牌案例列表
      let paramObj = {
        current,
        size: 5
      }
      POST(process.env.VUE_APP_DOMAIN_personnel + "/trainCases", paramObj)
        .then(res => {
          this.caseListObj = [...this.caseListObj, ...res.data.records]
          if (res.data.records.length !== 0) {
            //如果records数组为空，则当前页码可以加1
            this.currentPage++ //当前页点击一次加一
          } else {
            this.$message({
              type: "warning",
              message: "暂无更多案例"
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    searchMore() {
      //查询更多案例
      this.getCaseList(this.currentPage)
    }
  },
  created() {
    this.getCaseList() //获取金牌案例列表
  }
}
</script>

<style lang="less" scoped>
.goldCase {
  padding: 15px 0;
  .moreSearch {
    text-align: center;
    background-color: #fff;
    padding: 20px;
  }
}
</style>
