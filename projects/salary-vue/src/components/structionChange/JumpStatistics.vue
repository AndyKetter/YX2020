// 离职人员统计
<template>
  <div class="jumpStatistics">
    <div class="tbSearch clearfix">
      <el-form class="pull-left" :inline="true" :model="tableSearch">
        <el-form-item label="总经理">
          <el-select
            class="width155"
            @change="queryVice"
            v-model="tableSearch.managerId"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option
              v-for="item in managerOptions"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="集团">
          <el-select
            class="width155"
            v-model="tableSearch.viceId"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option
              v-for="item in viceOptions"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="在职状态">
          <el-select class="width155" v-model="tableSearch.workStatus" placeholder="请选择" clearable>
            <el-option
              v-for="item in workStatusOptions"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- :rules="{required:true,message:'必须输入年月',trigger:'blur'}" -->
        <el-form-item label="提交时间" prop="batch">
          <el-date-picker
            v-model="tableSearch.batch"
            style="width:250px"
            type="daterange"
            clearable
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            placeholder="请选择"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
        </el-form-item>
      </el-form>
      <div class="pull-right">
        <el-button class="cloud-downloadBtn" @click="downloadExcel">
          <i></i>&nbsp;导出
        </el-button>
      </div>
    </div>
    <!-- 列表 -->
    <div class="table_wrap">
      <el-table
        :data="tableData"
        :height="dataListObj.dataInfo.t_height"
        border
        style="width:100%"
        :header-cell-style="{backgroundColor:'#e5e9f3'}"
      >
        <el-table-column type="index" label="序号" min-width="50"></el-table-column>
        <el-table-column prop="managerName" label="总经理" min-width="150"></el-table-column>
        <el-table-column prop="viceName" label="集团" min-width="150"></el-table-column>
        <el-table-column prop="cgurFactname" label="离职人员" min-width="150"></el-table-column>
        <el-table-column prop="workStatus" label="在职状态" min-width="150">
          <!-- 工作状态（0：在职；1：离职；2：自离） -->
          <template slot-scope="{row}">
            <span v-if="row.workStatus === '0'">在职</span>
            <span v-else-if="row.workStatus === '1'">离职</span>
            <span v-else-if="row.workStatus === '2'">自离</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="提交时间" min-width="150"></el-table-column>
      </el-table>
      <!-- 分页  -->
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
  </div>
  <!-- 弹窗 -->
</template>

<script>
import { GET, POST } from "http/custom.js"
import qs from "qs"
export default {
  name: "jumpStatistics",
  props: {
    dataListObj: {
      type: Object,
      required: true,
      default: () => {
        return {
          dataInfo: {} //接收到父组件中的 dataObj ，里面会有多个数组
        }
      }
    }
  },
  filters: {
    // 过滤手机号码
    filterPhone(str) {
      if (str) {
        return str.replace(/(\d{3})\d*(\d{4})/, "$1****$2")
      }
      return str
    }
  },
  data() {
    // let Yd = Tools.getYd()
    return {
      tableSearch: {
        managerId: "",
        viceId: "",
        workStatus: "",
        batch: ""
      },
      // 在职状态 options 0：在职；1：离职；2：自离）
      workStatusOptions: [{ key: 1, name: "离职" }, { key: 2, name: "自离" }],
      // 总经理option
      managerOptions: [],
      // 集团option
      viceOptions: [],
      // 列表
      tableData: [],
      current: 1, //当前页码
      size: 15, //每页显示记录条数
      total: 0 //总记录条数
    }
  },
  created() {
    this.getList() //获取列表数据
    this.queryManager() //总经理字典
  },
  methods: {
    getList() {
      //获取列表数据
      let updateStartDate = "", //开始时间
        updateEndDate = "" //结束时间
      if (this.tableSearch.batch) {
        updateStartDate = this.tableSearch.batch[0]
        updateEndDate = this.tableSearch.batch[1]
      }
      const searchObj = {
        current: this.current, //当前页码
        size: this.size, //每页显示记录条数
        updateStartDate,
        updateEndDate,
        managerId: this.tableSearch.managerId,
        viceId: this.tableSearch.viceId,
        workStatus: this.tableSearch.workStatus
      }
      POST(process.env.VUE_APP_DOMAIN_personnel + "/uplevel/queryLeaveUserList", searchObj)
        .then(res => {
          this.tableData = res.data.records
          this.current = res.data.current //set当前页
          this.pages = res.data.pages //总记录条数
          this.size = res.data.size //每页显示记inter
          this.total = res.data.total //总记录条数
        })
        .catch(error => {
          console.log(error)
        })
    },
    queryManager() {
      //总经理字典
      const queryObj = {
        levelCode: 4
      }
      GET(process.env.VUE_APP_DOMAIN_personnel + "/uplevel/getUpLevelInfo", queryObj)
        .then(res => {
          //查询薪资类型模板
          if (Array.isArray(res.data)) {
            const arr = []
            res.data.forEach(obj => {
              arr.push({ key: obj.cgurGuid, name: `${obj.cgurFactname}(${obj.employedNo})` })
            })
            this.managerOptions = arr
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    queryVice() {
      //集团（副总）字典
      const parentRegId = this.tableSearch.managerId
      if (parentRegId) {
        GET(process.env.VUE_APP_DOMAIN_personnel + "/uplevel/getUpLevelInfo", {
          levelCode: 3,
          parentRegId
        })
          .then(res => {
            //查询薪资类型模板
            if (Array.isArray(res.data)) {
              const arr = []
              res.data.forEach(obj => {
                arr.push({ key: obj.cgurGuid, name: `${obj.cgurFactname}(${obj.employedNo})` })
              })
              this.viceOptions = arr
            }
          })
          .catch(error => {
            console.log(error)
          })
      } else {
        this.viceOptions = []
        this.tableSearch.viceId = ""
      }
    },
    handleSizeChange(val) {
      this.size = val
      this.getList()
    },
    handlecurrentChange(val) {
      this.current = val
      this.getList()
    },
    // 导出
    downloadExcel() {
      const { batch, managerId, viceId, workStatus } = this.tableSearch,
        params = qs.stringify({ batch, managerId, viceId, workStatus })
      const url = process.env.VUE_APP_DOMAIN_personnel + "/uplevel/exportUserLeave?" + params + "&token=" + localStorage.getItem("token")
      window.location.href = url
    }
  }
}
</script>

<style>
</style>
