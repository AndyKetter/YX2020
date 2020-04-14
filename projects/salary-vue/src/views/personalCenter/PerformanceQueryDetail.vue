<template>
  <div class="query-detail">
    <div class="guide">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home/personalCenter' }">个人中心</el-breadcrumb-item>
        <el-breadcrumb-item>我的</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/personalCenter/performanceQuery' }">业绩查询</el-breadcrumb-item>
        <el-breadcrumb-item>团队业绩详情</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/personalCenter' }">(返回上级)</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="bgWhite mgt15 pad-all">
      <!-- 查询栏 start -->
      <div class="clearfix">
        <el-form :model="queryDetailFormSearch" class="pull-left" :inline="true">
          <el-form-item label="业务类型">
            <el-select class="width155" v-model="queryDetailFormSearch.businessTypesValue" placeholder="请选择">
              <el-option v-for="item in businessTypesOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="queryDetailFormSearch.name" placeholder="请输入名字" class="width155"></el-input>
          </el-form-item>
          <el-form-item label="员工工号">
            <el-input v-model="queryDetailFormSearch.staffNum" placeholder="请输入号码" class="width155"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search">搜索</el-button>
          </el-form-item>
        </el-form>
        <div class="pull-right">
          <el-button type="" @click="onSubmit" class="cloud-downloadBtn"><i></i>&nbsp;导出</el-button>
        </div>
      </div>
      <div class="table_wrap">
        <el-table :data="noConfigTableData" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
          <el-table-column prop="id" label="序号"></el-table-column>
          <el-table-column prop="name" label="姓名">

          </el-table-column>
          <el-table-column prop="pNumber" label="员工编号"></el-table-column>
          <el-table-column prop="level" label="业务类型"></el-table-column>
          <el-table-column prop="money" label="还款金额"></el-table-column>
          <el-table-column prop="month" label="业绩月份"></el-table-column>
          <el-table-column prop="lastMoney" label="最终核款"></el-table-column>
          <el-table-column prop="employeeType" label="排名"></el-table-column>
        </el-table>
        <!-- 分页 -->
        <div id="pagination">
          <el-pagination @size-change="handleSizeChange" @current-change="handlecurrentChange" :current-page="currentPage" :page-sizes="[5,10,20]" :page-size="5" layout="total,sizes,prev,pager,next,jumper" :total="100">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { GET } from "http/custom.js"

export default {
  name: 'query-detail',
  data() {
    return {
      businessTypesOptions: [
        {
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
      value: '',
      queryDetailFormSearch: {
        businessTypesValue: '',
        name: '',
        staffNum: ''
      },
      currentPage: 1,
      noConfigTableData: []
    }
  },
  methods: {
    submitWorkForm(formName) { //提交工作记录 提交记录按钮
      let _this = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(_this.ruleForm);
        } else {
          this.$message({
            showClose: true,
            type: 'success',
            message: '提交失败，验证不通过'
          })
          return false
        }
      })
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    onSubmit() {

    },
    handleSizeChange(val) {
      console.log(`每页：${val}`)
    },
    handlecurrentChange(val) {
      console.log(`当前页：${val}`)
    }
  },
  created() {
    GET('/api/getNoConfigTableData').then(res => {
      this.noConfigTableData = res.dataTable
    }).catch(error => {
      console.log(error)
    })
  }
}
</script>
<style scoped>
</style>
