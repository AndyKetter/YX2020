// edit by zc
// 费用总台账
<template>
  <div class="sample-standing-container">
    <div class="sample-standing-condition">
      <!-- 条件查询 -->
      <el-form :inline="true" class="mar-no" :model="condition" label-position="right">
        <el-form-item label="所属区域">
          <el-select v-model="ereaId" placeholder="请选择" :filterable="condition.root.areaIsture" :clearable="condition.root.areaIsture" class="width155">
            <el-option v-for="item in condition.workEreaArr" :key="item.workAreaId" :label="item.workAreaName" :value="item.workAreaId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年份">
          <el-date-picker v-model="year" :editable="false" :clearable="false" type="year" value-format="yyyy" class="width110" placeholder="请选择"></el-date-picker>
        </el-form-item>
        <el-form-item label>
          <el-button type="primary" @click="JS_search">查询</el-button>
        </el-form-item>
      </el-form>
      <!-- 操作按钮 -->
      <el-form ref="form" class="sample-standing-condition-content" label-width="10px" size="mini">
        <el-form-item label>
          <el-button type="default" @click="refresh">
            <i class="el-icon-refresh"></i>刷新
          </el-button>
        </el-form-item>
        <el-form-item label v-if="condition.root.export">
          <el-button type="default" class="cloud-downloadBtn" @click="dialogExport">
            <i></i>导出
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 列表 -->
    <standing-table v-loading="loading" :tableHead="tableHead" :t_height="condition.t_height" :t_operate="operate" :tableData="tableData"></standing-table>

    <!-- 分页 -->
    <div id="pagination" class="pagination">
      <el-pagination background @size-change="handleSizeChange" @current-change="handlecurrentChange" :current-page="pageObj.current" :page-sizes="[10,15,20,30]" :page-size="pageObj.size" layout="total,sizes,prev,pager,next,jumper" :total="pageObj.total"></el-pagination>
    </div>

  </div>
</template>
<script>
import StandingTable from "./common/StandingTable" //表格组件
import { POST, GET } from "http/custom.js"
export default {
  components: {
    StandingTable
  },
  props: {
    //查询条件
    condition: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      pageObj: {
        size: 15, //每页显示记录条数
        current: 1, //当前页码
        total: 0, //总记录数据
        dataTable: [] //表格数据
      },
      operate: { //操作权限
        op: '费用总台帐', //是否显示操作列 费用总台帐没有操作列
        root: this.condition.root //权限
      },
      conditionForm: {
        id: '',
        workErea: this.condition.arid, //添加所属区域
        payType: undefined, //添加所属区域
      },
      loading: false, //加载
      ereaId: this.condition.arid, //所属区域id
      year: this.condition.year,  //年份
      tableHead: [ //表头
        { prop: "workAreaName", label: "所属区域", fixed: "left" },
        { prop: "january", label: this.condition.year + "-01", enableEdit: true },
        { prop: "february", label: this.condition.year + "-02", enableEdit: true },
        { prop: "march", label: this.condition.year + "-03", enableEdit: true },
        { prop: "april", label: this.condition.year + "-04", enableEdit: true },
        { prop: "may", label: this.condition.year + "-05", enableEdit: true },
        { prop: "june", label: this.condition.year + "-06", enableEdit: true },
        { prop: "july", label: this.condition.year + "-07", enableEdit: true },
        { prop: "august", label: this.condition.year + "-08", enableEdit: true },
        { prop: "september", label: this.condition.year + "-09", enableEdit: true },
        { prop: "october", label: this.condition.year + "-10", enableEdit: true },
        { prop: "november", label: this.condition.year + "-11", enableEdit: true },
        { prop: "december", label: this.condition.year + "-12", enableEdit: true }
      ],
      tableData: [], // 表格数据

    }
  },
  created() {
    this.search();
    //console.log("后");
  },
  methods: {
    refresh() { // 刷新
      GET(process.env.VUE_APP_DOMAIN_administration + '/refreshLedgerTotalFees', {}).then(() => {
        this.JS_search();
        this.messagePopp('success', '刷新成功！');
      }).catch(error => {
        console.log(error);
      });
    },
    messagePopp(type, msg) {    //提示框
      this.$message({
        showClose: true,
        type: type,
        message: msg
      });
    },
    handleSizeChange(val) {//分页,下拉
      this.pageObj.size = val;
      this.search();
    },
    handlecurrentChange(val) { //当前页，点击页码
      this.pageObj.current = val;
      this.search();
    },
    JS_search() { //搜索
      this.pageObj.current = 1;
      let temp = '';
      let index = 0;

      //格式化表头 2019-01
      for (let i = 0; i < this.tableHead.length; i++) {
        temp = this.tableHead[i];
        if (!temp.fixed && i >= 1) {
          index = i;
          temp.label = this.year + (index >= 10 ? '-' : '-0') + index;
        }
      }
      this.search();
    },
    search() {
      let obj = {
        current: this.pageObj.current,
        size: this.pageObj.size,
        workAreaId: this.ereaId || '',
        year: this.year,
        "descs": [ //降序
          "create_time"
        ],
      };
      this.loading = true;
      POST(process.env.VUE_APP_DOMAIN_administration + '/ledgerTotalFees', obj).then(res => {
        this.loading = false;
        this.tableData = res.data.records.map(obj => Object.assign(obj, { isEdited: false })); //isEdited 表格行内是否有修改操作
        this.pageObj.size = res.data.size; //每页显示记录条数
        this.pageObj.current = res.data.current; // set当前页
        this.pageObj.total = res.data.total; //总记录数据  

      }).catch(error => {
        console.log(error);
      });
    },
    getSelect(data, name) { //获取  所属区域/付款类型
      const obj = data.find(v => {
        if (name === 'payment') {
          return this.conditionForm.payType + '' === v.id + '';
        } else {
          return this.conditionForm.workErea + '' === v.workAreaId + '';
        }
      });
      return obj;
    },
    dialogExport() {// 导出
      let url = process.env.VUE_APP_DOMAIN_administration + "/ledgerTotalExport?token="
        + localStorage.getItem("token")
        + "&exportType=1"
        + "&workAreaId=" + (this.ereaId || '')
        + "&year=" + this.year;
      window.location.href = url;
    }
  }
}
</script>
<style lang="less" scoped>
.sample-standing-container {
  .sample-standing-condition {
    display: flex;
    justify-content: space-between;
    .sample-standing-condition-content {
      display: flex;
    }
  }
}
</style>