<template>
  <div class="no-config">
    <div class="guide">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home/personnelSystem' }">人事系统</el-breadcrumb-item>
        <el-breadcrumb-item>业务部异动统计</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/personnelSystem' }">(返回上级)</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="bgWhite mgt15">
      <!-- 查询栏 start -->
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="业务部异动统计" name="first">
          <div class="pull-left">
            <el-form :inline="true" :model="functionFormSearch" class="mar-no">
              <el-form-item label="申诉日期">
                <el-date-picker
                  class="pull-right"
                  style="width:225px"
                  v-model="functionFormSearch.time"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="起始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="异动人员">
                <el-input
                  v-model.trim="functionFormSearch.userName"
                  clearable
                  placeholder="请输入名字"
                  class="width155"
                  @keyup.enter.native="JS_search"
                ></el-input>
              </el-form-item>
              <el-form-item label="异动类型">
                <el-select
                  class="width155"
                  v-model="functionFormSearch.changeType"
                  placeholder="- 请选择"
                  clearable
                >
                  <el-option
                    v-for="item in changeTypeOpts"
                    :key="item.typeId"
                    :label="item.typeName"
                    :value="item.typeId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="JS_search" icon="el-icon-search">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="pull-right">
            <el-button>&nbsp;导出</el-button>
          </div>
          <div class="table_wrap">
            <el-table
              v-loading="loading"
              :height="tabHeight"
              :data="noConfigTableData"
              border
              style="width:100%"
              :header-cell-style="{backgroundColor:'#e5e9f3'}"
            >
              <el-table-column type="index" label="序号" min-width="50"></el-table-column>
              <el-table-column label="发起人" min-width="150">
                <template slot-scope="scope">
                  <el-popover
                    trigger="click"
                    placement="top"
                    @show="getUserInfo(scope.row.employedNo)"
                    width="450"
                  >
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.userName}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="异动类型" min-width="100" prop="hrTypeName"></el-table-column>
              <el-table-column label="异动人员" min-width="100" prop="levelName"></el-table-column>
              <el-table-column label="员工编号" min-width="100" prop="employedNo"></el-table-column>
              <el-table-column label="异动前职位级别" min-width="100" prop="levelName"></el-table-column>
              <el-table-column label="异动后职位级别" min-width="100" prop="levelName"></el-table-column>
              <el-table-column label="异动前组织架构" min-width="100" prop="levelName"></el-table-column>
              <el-table-column label="异动后组织架构" min-width="100" prop="levelName"></el-table-column>
              <el-table-column label="申请时间" min-width="100" prop="levelName"></el-table-column>
              <el-table-column label="审批状态" min-width="100" prop="levelName"></el-table-column>

              <!-- <el-table-column label="性别" min-width="50">
                <template slot-scope="scope">
                  {{scope.row.sex?"男":"女"}}
                </template>
              </el-table-column>
              <el-table-column label="员工编号" min-width="120">
                <template slot-scope="scope">
                  <span>{{scope.row.employedNo}}</span><i class="el-icon-phone tbIconPhone"></i>
                </template>
              </el-table-column>
              <el-table-column prop="mobilePhone" label="联系号码" min-width="110"></el-table-column>
              <el-table-column label="级别" min-width="100" prop="levelName"></el-table-column>
              <el-table-column prop="positionName" label="职务" min-width="140"></el-table-column>
              <el-table-column prop="areaName" label="所属区域" min-width="160" show-overflow-tooltip></el-table-column>
              <el-table-column label="员工类型" prop="hrTypeName" min-width="120" show-overflow-tooltip></el-table-column>
              <el-table-column prop="educationNam" label="学历" min-width="100"></el-table-column>-->
              <el-table-column label="操作" min-width="50" fixed="right">
                <template slot-scope="scope">
                  <el-button type="text" size="small">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div id="pagination">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handlecurrentChange"
                background
                :current-page="current"
                :page-sizes="[10,15,20,30,40]"
                :page-size="size"
                layout="total,sizes,prev,pager,next,jumper"
                :total="total"
              ></el-pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import tbMixin from "libs/mixin/tbMixin.js" //动态计算表格高度mixin
import { GET, POST } from "http/custom.js"
export default {
  name: "summary-tables",
  mixins: [tbMixin],
  data() {
    return {
      t_height: 315, //减去的高度
      loading: false, //table加载动画开关
      current: 1, //当前页码
      pages: 0, //总页数
      size: 15, //每页显示记录条数
      total: 0, //总记录条数
      activeName: "first",
      baseSalarySet: false, //基础薪资设置 弹框内的数据
      functionFormSearch: {
        //搜索数据
        changeType: "",
        userName: "",
        time: ""
      },
      // 异动类型
      changeTypeOpts: [],
      noConfigTableData: [],

      personalInfoData: {} //姓名popover弹窗数据
    }
  },
  methods: {
    search(Obj = {}) {
      //qianjun 列表查询
      let searchObjInit = {
        //查询对象
        current: this.current,
        size: this.size,
        userName: this.functionFormSearch.userName,
        employedNo: this.functionFormSearch.employedNo,
        mobilePhone: this.functionFormSearch.mobilePhone
      }
      let searchObjTotal = { ...searchObjInit, ...Obj }
      this.loading = true //开启动画
      POST(process.env.VUE_APP_DOMAIN_personnel + "/configSalaryUserInfoVOs", searchObjTotal)
        .then(res => {
          console.log(res)
          this.loading = false //关闭动画
          this.noConfigTableData = res.data.records //set表格的值
          this.current = res.data.current //set当前页
          this.pages = res.data.pages //总记录条数
          this.size = res.data.size //每页显示记录条数
          this.total = res.data.total //总记录条数
        })
        .catch(error => {
          console.log(error)
        })
    },
    // qianjun 根据员工编号获取个人信息
    getUserInfo(num) {
      GET(process.env.VUE_APP_DOMAIN_personnel + "/userInfo", { aid: num })
        .then(res => {
          //查询薪资类型模板
          console.log(res.data)
          this.personalInfoData = res.data
          this.personalInfoData.employedDates = this.personalInfoData.employedDates.split(" ")[0]
        })
        .catch(error => {
          console.log(error)
        })
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    onSubmit() {},
    handleSizeChange(val) {
      //每页显示多少条数据切换
      this.size = val
      this.search()
    },
    handlecurrentChange(val) {
      //点击页码，当前页
      this.current = val
      this.search()
    },
    JS_search() {
      this.current = 1 //点击搜索current=1搜索第一页
      this.search()
    }
  },
  created() {
    this.search()
  }
}
</script>
<style scoped>
</style>
