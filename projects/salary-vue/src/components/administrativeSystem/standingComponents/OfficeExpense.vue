// edit by zc
// 办公用品费台账
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
        <el-form-item label v-if="condition.root.addWork">
          <el-button type="default" @click="addDialog = true;title='新增'">
            <i class="el-icon-plus"></i>添加所属区域
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
    <standing-table v-loading="loading" :tableHead="tableHead" :t_height="condition.t_height" :t_operate="operate" :tableData="tableData" @edit="edit_listener" @modify="modify" @deleted="deleted"></standing-table>

    <!-- 分页 -->
    <div id="pagination" class="pagination">
      <el-pagination background @size-change="handleSizeChange" @current-change="handlecurrentChange" :current-page="pageObj.current" :page-sizes="[10,15,20,30]" :page-size="pageObj.size" layout="total,sizes,prev,pager,next,jumper" :total="pageObj.total"></el-pagination>
    </div>

    <!-- 表格单元格的添加/修改 :controls="false"-->
    <el-dialog :title="edit_title" :visible.sync="edit_dialogVisible" :show-close="false" :close-on-click-modal="false" width="400px">
      <el-form ref="edit_form" :model="edit_member" :rules="edit_rules" class="condition-content" label-width="130px" size="mini">
        <el-form-item label="输入" prop="num">
          <el-input-number v-model.number="edit_member.num" :min="0" :max="10000000000" label="请输入内容"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="edit_cancel">取 消</el-button>
        <el-button type="primary" @click="edit_save">确 认</el-button>
      </span>
    </el-dialog>

    <!-- 新增 -->
    <el-dialog :title="title" :close-on-click-modal="false" :show-close="false" :visible.sync="addDialog" width="600px">
      <div>
        <el-form label-width="150px" :model="conditionForm" :rules="addrules" ref="addForm">
          <el-row>
            <el-col :md="12">
              <el-form-item label="所属区域" label-width="85px" prop="workErea">
                <el-select v-model="conditionForm.workErea" placeholder="请选择" :filterable="condition.root.areaIsture" class="width155" :clearable="condition.root.areaIsture" :disabled="title === '修改' ? true : false">
                  <el-option v-for="item in condition.workEreaArr" :key="item.workAreaId" :label="item.workAreaName" :value="item.workAreaId"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="付款类型" label-width="85px" prop="payType">
                <el-select v-model="conditionForm.payType" placeholder="请选择" filterable clearable class="width155">
                  <el-option v-for="item in condition.payArr" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close('addForm')">取消</el-button>
        <el-button type="primary" @click="confirm('addForm')">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import StandingTable from "./common/StandingTable" //表格组件
import { POST, PUT, DELETE } from "http/custom.js"
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
        op: true, //是否显示操作列 费用总台帐没有操作列
        root: this.condition.root //权限
      },
      conditionForm: {
        id: '',
        workErea: this.condition.arid, //添加所属区域
        payType: undefined, //添加所属区域
      },
      title: '新增',// 新增标题
      loading: false, //加载
      ereaId: this.condition.arid, //所属区域id
      year: this.condition.year,  //年份
      addDialog: false,// 添加所属区域弹窗
      edit_title: "添加",  // 表格单元格的添加/修改
      edit_dialogVisible: false, // 表格单元格的添加/修改弹框
      edit_member: {// 表格单元格的添加/修改的值域
        info: {},
        num: 0
      },
      edit_rules: {// 表格单元格的添加/修改的规则 
        num: [{ required: true, message: "请输入数值", trigger: "change" }]
      },
      tableHead: [ //表头
        { prop: "workAreaName", label: "所属区域", fixed: "left" },
        { prop: "paymentTypeName", label: "付款类型", fixed: "left" },
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
      addrules: { //
        workErea: [{ required: true, trigger: "change", message: "请选择所属区域" }],
        payType: [{ required: true, trigger: "change", message: "请选择付款类型" }]
      },
    }
  },
  created() {
    this.search();
    //console.log("后");
  },
  methods: {
    deleted(row) { // 操作删除
      this.$msgBox.confirm("你确定要删除该条数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        DELETE(process.env.VUE_APP_DOMAIN_administration + "/ledgerOfficeFees", {
          ids: row.id
        }).then(() => {
          this.JS_search();
          this.messagePopp("success", "删除成功!");
        }).catch(error => {
          console.log(error);
        });
      }).catch(() => {
        this.messagePopp("info", "已取消删除!");
      });
    },
    modify(row) { // 操作编辑
      this.addDialog = true;
      this.title = '修改';
      this.$nextTick(() => { //（dialog是懒加载）修改和新增用的同一个表单时，修改回填数据时要用这个方法防止再点击新增时数据会回填
        this.conditionForm.id = row.id;
        this.conditionForm.workErea = parseInt(row.workAreaId);
        this.conditionForm.payType = parseInt(row.paymentTypeId);
      });

    },
    reset(formName) { //清除表单
      this.$refs[formName].resetFields();
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
        if (!temp.fixed && i >= 2) {
          index = i - 1;
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
      POST(process.env.VUE_APP_DOMAIN_administration + '/ledgerOfficeFees', obj).then(res => {
        this.loading = false;
        this.tableData = res.data.records.map(obj => Object.assign(obj, { isEdited: true })); //isEdited 表格行内是否有修改操作
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
    confirm(formName) { //添加/修改
      this.$refs[formName].validate(valid => {
        if (valid) {
          const url = process.env.VUE_APP_DOMAIN_administration + '/ledgerOfficeFee';
          let obj = {
            "paymentTypeId": this.conditionForm.payType,
            "paymentTypeName": this.getSelect(this.condition.payArr, 'payment').name,
            "workAreaId": this.conditionForm.workErea,
            "workAreaName": this.getSelect(this.condition.workEreaArr, 'work').workAreaName,
          };
          if (this.title === '新增') { // 新增
            POST(url, Object.assign(obj, { "year": this.year })).then(res => {
              if (res.code === 0) {
                this.messagePopp('success', '新增成功！');
                this.search();
                this.addDialog = false;
                this.reset(formName); //清空表单
              }
            }).catch(error => {
              console.log(error);
            });
          } else {  // 修改
            this.update(url, Object.assign(obj, { "id": this.conditionForm.id }));
            this.reset(formName); //清空表单
          }

        } else {
          this.messagePopp("warning", "提交失败，验证不通过");
        }
      })
    },
    close(formName) {
      this.addDialog = false;
      this.reset(formName);
    },
    edit_listener(info) { // 表格单元格的添加/修改信息
      this.edit_dialogVisible = true; //弹窗
      this.edit_title = info.name; //弹窗标题
      this.edit_member.info = info; //从子组件传过来的值
      this.edit_member.num = info.row[info.prop];
    },
    edit_cancel() { // 取消表格单元格的添加/修改
      this.edit_dialogVisible = false;
      this.reset('edit_form'); //清空表单
    },
    update(url, obj) { //修改
      PUT(url, obj).then(res => {
        if (res.code === 0) {
          this.messagePopp('success', '修改成功！');
          this.search();
          this.addDialog = false;
        }
      }).catch(error => {
        console.log(error);
      });
    },
    edit_save() { // 保存表格单元格的添加/修改
      this.$refs.edit_form.validate(valid => {
        if (valid) {
          const url = process.env.VUE_APP_DOMAIN_administration + '/ledgerOfficeFee';
          const info = this.edit_member.info;
          let obj = {
            "id": this.edit_member.info.row.id,
            [info.prop]: this.edit_member.num, //月份字段
            "paymentTypeId": info.row["paymentTypeId"],
            "paymentTypeName": info.row["paymentTypeName"],
            "workAreaId": info.row["workAreaId"],
            "workAreaName": info.row["workAreaName"]
          };

          const exe = () => {
            this.update(url, obj);// 调用修改
            this.edit_dialogVisible = false; // 关闭弹窗
            this.reset('edit_form'); //清空表单
          };

          //用户修改权限
          if (this.condition.root.maintence) {
            exe();
            return;
          }
          //普通用户修改时有提示
          let tip = '请验证本次提交的数据是否准确无误，提交后数据将无法修改!';
          this.$msgBox.confirm(tip, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            exe();
          }).catch(() => {
            this.messagePopp("info", "已取消修改!");
          });

        } else {
          this.messagePopp("warning", "提交失败，验证不通过");
        }
      });
    },
    dialogExport() {// 导出
      let url = process.env.VUE_APP_DOMAIN_administration + "/ledgerOfficeFeesExport?token="
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