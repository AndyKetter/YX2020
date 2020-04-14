// 业务组织架构提交统计
<template>
  <div>
    <div class="submitStatistics">
      <div class="tbSearch clearfix">
        <el-form class="pull-left" :inline="true" :model="condition">
          <el-form-item label="总经理">
            <el-select
              class="width155"
              v-model="condition.managerId"
              @change="getViceListInfo"
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
              v-model="condition.viceId"
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
          <el-form-item label="提交状态">
            <el-select class="width155" v-model="condition.commited" placeholder="请选择" clearable>
              <el-option
                v-for="item in commitedOptions"
                :key="item.key"
                :label="item.name"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- :rules="{required:true,message:'必须输入年月',trigger:'blur'}" -->
          <el-form-item label="提交时间" prop="batch">
            <el-date-picker
              style="width:250px"
              v-model="condition.batch"
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
            <el-button type="primary" icon="el-icon-search" @click="searchDataList">搜索</el-button>
          </el-form-item>
        </el-form>
        <div class="pull-right">
          <el-button class="cloud-downloadBtn" @click="downloadExcel" v-if="downloadLimit">
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
          <el-table-column prop="viceName" label="集团" min-width="150">
            <template slot-scope="{row}">
              <span :class="row.commited == 1 ? 'green' : 'red'">{{row.viceName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="提交状态" min-width="150">
            <template slot-scope="{row}">
              <span class="green" v-if="row.commited == 1">已提交</span>
              <span class="red" v-else>未提交</span>
            </template>
          </el-table-column>
          <el-table-column prop="commitedTime" label="提交时间" min-width="150">
            <template slot-scope="{row}">
              <span>{{row.commitedTime || '-'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" min-width="100">
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click="getDetailDataList(row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页  -->
        <div id="pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handlecurrentChange"
            background
            :current-page="condition.current"
            :page-sizes="[10,15,20,30,40]"
            :page-size="condition.size"
            layout="total,sizes,prev,pager,next,jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
    <!-- 弹窗 -->
    <el-dialog
      title="详情"
      :close-on-click-modal="false"
      :visible.sync="detailModal"
      width="880px"
      class="grayBg"
    >
      <div class="whiteBox">
        <el-table
          :data="detailTableData"
          border
          style="width:100%"
          height="350"
          :header-cell-style="{backgroundColor:'#e5e9f3'}"
        >
          <el-table-column type="index" label="序号" min-width="50"></el-table-column>
          <el-table-column prop="managerName" label="总经理" min-width="80"></el-table-column>
          <el-table-column prop="viceName" label="集团" min-width="80"></el-table-column>
          <el-table-column prop="ministerName" label="部门" min-width="80"></el-table-column>
          <el-table-column prop="commitedTime" label="提交时间" min-width="80">
            <template slot-scope="{row}">
              <span>{{row.commitedTime || '-'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="commited" label="提交状态" min-width="80">
            <template slot-scope="{row}">
              <span class="green" v-if="row.commited ==1">已提交</span>
              <span class="red" v-else>未提交</span>
            </template>
          </el-table-column>
        </el-table>
        <div id="pagination">
          <el-pagination
            @size-change="handleDetailSizeChange"
            @current-change="handleDetailCurrentChange"
            background
            :current-page="detailCondition.current"
            :page-sizes="[10,15,20,30]"
            :page-size="detailCondition.size"
            layout="total,sizes,prev,pager,next,jumper"
            :total="detailTotal"
          ></el-pagination>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { GET, POST } from "http/custom.js"
import Tools from "untils/index.js"
import qs from "qs"
export default {
  name: "submitStatistics",
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
  computed: {
    downloadLimit() {
      //导出(权限)
      return Tools.includes(this.$store.state.userActionAll, "ba4c80cd5b7e44398ffdc1358dbc7bcb")
    }
  },
  data() {
    return {
      // 下拉查询loading层
      selectLoading: false,
      // 列表查询条件
      // new Date().toLocaleDateString().slice(0, 7)
      condition: {
        batch: "", //提交时间
        commited: "", //是否提交
        managerId: "", //总经理id
        ministerId: "", //部长id
        viceId: "", //副总id
        size: 15, //每页显示记录条数
        current: 1 //当前页码
      },
      // 总经理 options
      managerOptions: [],
      // 集团 options
      viceOptions: [],
      // 提交状态 options
      commitedOptions: [{ key: 0, name: "未提交" }, { key: 1, name: "已提交" }],
      // 列表
      tableData: [],
      total: 0, //总记录条数
      //弹窗
      detailModal: false,
      detailTableData: [],
      detailCondition: {
        current: 1, //当前页码
        size: 15 //每页显示记录条数
      },
      tableDataRow: null, //统计列表的单行数据
      detailTotal: 0 //总记录条数
    }
  },
  created() {
    // 获取业务组织架构提交统计列表
    this.getDataList()
    // 获取总经理list信息
    this.getManagerListInfo()
  },
  methods: {
    // 业务组织架构提交统计查询
    searchDataList() {
      this.condition.current = 1
      this.getDataList()
    },
    // 改变业务组织架构提交统计列表记录条数
    handleSizeChange(val) {
      this.condition.size = val
      this.getDataList()
    },
    // 改变业务组织架构提交统计列表当前页码
    handlecurrentChange(val) {
      this.condition.current = val
      this.getDataList()
    },
    // 业务组织架构提交统计列表详情记录条数
    handleDetailSizeChange(val) {
      this.detailCondition.size = val
      this.getDetailDataList(this.tableDataRow)
    },
    // 业务组织架构提交统计列表详情当前页码
    handleDetailCurrentChange(val) {
      this.detailCondition.current = val
      this.getDetailDataList(this.tableDataRow)
    },
    // 总经理/副总人员信息（级联查询）
    // levelCode 职务级别。0普通员工 1组长 2部长 3副总 4总经理 5总裁
    // parentRegId 上一级的regId：如查询所有副总时，parentRegId就是总经理的regId（代表查询该总经理下的所有副总）
    // queryKeyWord 查询关键词
    getUpLevelInfo(param) {
      return GET(process.env.VUE_APP_DOMAIN_personnel + "/uplevel/getUpLevelInfo", param).catch(err => {
        console.warn(err)
      })
    },
    // 获取总经理list信息
    getManagerListInfo() {
      // managerOptions
      this.selectLoading = true
      this.getUpLevelInfo({ levelCode: 4 }).then(res => {
        // console.log("总经理list", res)
        this.selectLoading = false
        if (Array.isArray(res.data)) {
          const arr = []
          res.data.forEach(obj => {
            arr.push({ key: obj.cgurGuid, name: `${obj.cgurFactname}(${obj.employedNo})` })
          })
          this.managerOptions = arr
        }
      })
    },
    // 获取集团list信息
    getViceListInfo() {
      this.selectLoading = true
      const parentRegId = this.condition.managerId
      if (parentRegId) {
        this.getUpLevelInfo({ levelCode: 3, parentRegId }).then(res => {
          this.selectLoading = false
          if (Array.isArray(res.data)) {
            const arr = []
            res.data.forEach(obj => {
              arr.push({ key: obj.cgurGuid, name: `${obj.cgurFactname}(${obj.employedNo})` })
            })
            this.viceOptions = arr
          }
        })
      } else {
        this.viceOptions = []
        this.condition.viceId = null
      }
    },
    // 业务组织架构提交统计列表
    getDataList() {
      let commitStartDate = "",
        commitEndDate = ""
      if (this.condition.batch) {
        commitStartDate = this.condition.batch[0]
        commitEndDate = this.condition.batch[1]
      }
      const obj = {
        commitStartDate,
        commitEndDate,
        commited: this.condition.commited,
        managerId: this.condition.managerId,
        ministerId: this.condition.ministerId,
        viceId: this.condition.viceId,
        size: this.condition.size,
        current: this.condition.current
      }
      POST(process.env.VUE_APP_DOMAIN_personnel + "/uplevel/getCommitList", obj).then(res => {
        // console.log(res)
        if (res.code === 0) {
          this.tableData = res.data.records
          this.total = res.data.total
        }
      })
    },
    // 业务组织架构提交统计列表详情
    getDetailDataList(row) {
      this.detailModal = true
      this.tableDataRow = row
      POST(process.env.VUE_APP_DOMAIN_personnel + "/uplevel/queryMinisterCommitList", { parentId: row.viceId, ...this.detailCondition }).then(res => {
        // console.log(res)
        if (res.code === 0) {
          this.detailTableData = res.data.records
          if (this.detailTableData.length) {
            // 从统计列表中获取总经理和集团的数据
            this.detailTableData.map(o => Object.assign(o, { managerName: row.managerName, viceName: row.viceName }))
          }
          this.detailTotal = res.data.total
        }
      })
    },
    // 导出
    downloadExcel() {
      let { batch, managerId, viceId, commited } = this.condition,
        params = qs.stringify({ managerId, viceId, commited, batch })
      const url = process.env.VUE_APP_DOMAIN_personnel + "/uplevel/exportCommit?" + params + "&token=" + localStorage.getItem("token")
      window.location.href = url
    }
  }
}
</script>

<style scoped>
.green {
  color: #33c534;
}
.red {
  color: #ff5353;
}
</style>
