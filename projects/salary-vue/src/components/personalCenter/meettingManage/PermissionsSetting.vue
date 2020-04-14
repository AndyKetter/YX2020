<template>
  <div class="PermissionsSetting">
    <div class="pull-left">
      <el-form :inline="true" class="mar-no" label-position="right">
        <el-form-item label="员工姓名/员工编号">
          <el-select
            v-model.trim="employeeNo"
            filterable
            clearable
            remote
            reserve-keyword
            placeholder="员工姓名/编号"
            :remote-method="remoteMethod"
            :loading="eleloading"
            @clear="Js_clear"
            @keyup.enter.native="inputEnter"
          >
            <el-option
              v-for="item in employeeOptions"
              :key="item.employeeNo"
              :label="item.userName"
              :value="item.employeeNo"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="JS_search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="pull-right">
      <el-button icon="el-icon-plus" @click="JS_add">新增设置</el-button>
    </div>
    <div class="table_wrap">
      <el-table
        v-loading="loading"
        :data="tableData"
        :height="dataInfo.t_height"
        border
        style="width:100%"
        :header-cell-style="{backgroundColor:'#e5e9f3'}"
      >
        <el-table-column type="index" label="序号" width="55"></el-table-column>
        <el-table-column prop="userName" label="员工姓名" min-width="150"></el-table-column>
        <el-table-column prop="deptName" label="所属部门" min-width="150"></el-table-column>
        <el-table-column show-overflow-tooltip label="查看部门会议纪要权限" min-width="250">
          <template slot-scope="scope">
            <template v-if="scope.row.deptNames.length !== 0">
              <template v-for="(item,index) in scope.row.deptNames">
                <template v-if="(index+1) == scope.row.deptNames.length">{{ item }}</template>
                <template v-else>{{ item }}，</template>
              </template>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="是否有操作权限" min-width="150">
          <template slot-scope="scope">
            <template v-if="scope.row.operationAuthority =='1'">是</template>
            <template v-if="scope.row.operationAuthority =='0'">否</template>
          </template>
        </el-table-column>
        <el-table-column label="操作人" min-width="150">
          <template slot-scope="scope">
            <el-popover
              trigger="click"
              placement="top"
              @show="getUserInfo(scope.row.authorityOptid)"
              width="450"
              v-if="scope.row.authorityOptName"
            >
              <!-- S -->
              <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
              <!-- E -->
              <div slot="reference" class="name-wrapper">
                <el-button size="mini">{{scope.row.authorityOptName}}</el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="optCreateTime" label="操作时间" min-width="150"></el-table-column>
        <el-table-column label="操作" fixed="right" min-width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="JS_modify(scope.row.id)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div id="pagination">
        <el-pagination
          background
          :current-page="configPageObj.current"
          @size-change="handleSizeChange"
          @current-change="handlecurrentChange"
          :page-sizes="[10,15,20,30,40]"
          :page-size="configPageObj.size"
          layout="total,sizes,prev,pager,next,jumper"
          :total="configPageObj.total"
        ></el-pagination>
      </div>
    </div>
    <!-- 新增-修改权限设置 -->
    <el-dialog
      :title="isMdify==true?'修改权限设置':'新增权限设置'"
      :close-on-click-modal="false"
      :before-close="handleAddClose"
      :visible.sync="addCondition"
      width="768px"
    >
      <div class="whiteBox">
        <el-form
          ref="addConditionform"
          :model="addConditionform"
          :rules="addConditionformRule"
          label-width="190px"
        >
          <el-row>
            <el-col :md="24">
              <el-form-item label="员工姓名/员工编号：" prop="userId">
                <el-select
                  style="width:300px"
                  v-model="addConditionform.userId"
                  filterable
                  clearable
                  remote
                  :disabled="isMdify===true"
                  reserve-keyword
                  placeholder="员工姓名/编号"
                  :remote-method="remoteMethodAdd"
                  :loading="eleloadingAdd"
                  ref="employeeAdd"
                >
                  <el-option
                    v-for="item in employeeOptionsAdd"
                    :key="item.userId"
                    :label="item.userName"
                    :value="item.userId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="24" style="margin-top:7px;">
              <el-form-item label="查看部门会议纪要权限：">
                <el-select
                  filterable
                  v-model="addConditionform.deptValue"
                  clearable
                  placeholder="请选择"
                  style="width:300px"
                >
                  <el-option
                    v-for="item in deptOptions"
                    :key="item.dept_id"
                    :label="item.dept_name"
                    :value="item.dept_name"
                  ></el-option>
                </el-select>
                <i class="el-icon-circle-plus addIcon" @click="addDept"></i>
              </el-form-item>
            </el-col>
            <el-col :md="24" v-if="deptNames.length !== 0">
              <el-form-item label>
                <div class="checkboxWarp">
                  <el-checkbox-group v-model="deptNames">
                    <el-checkbox v-for="item in deptNames" :label="item" :key="item">{{item}}</el-checkbox>
                  </el-checkbox-group>
                </div>
              </el-form-item>
            </el-col>
            <el-col :md="24">
              <el-form-item label="是否有操作权限：">
                <el-radio-group v-model="radioValue">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="isMdify!==true" @click="JS_add_resetForm('addConditionform')">重置</el-button>
        <el-button type="primary" v-no-more-click @click="JS_add_save('addConditionform')">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { POST, GET, PUT } from "http/custom.js"

export default {
  name: "permissionsSetting",
  props: {
    dataInfo: {
      type: Object,
      required: true,
      default: () => {
        return {
          t_height: null
        }
      }
    }
  },
  data() {
    return {
      //员工姓名/员工编号搜索组件相关
      employeeOptions: [], //搜索
      eleloading: false, //搜索

      employeeOptionsAdd: [], //新增
      eleloadingAdd: false, //新增

      //搜索条件
      employeeName: "", //员工姓名
      employeeNo: "", //员工编号
      //table相关
      loading: false, //table loading
      tableData: [],
      //分页
      configPageObj: {
        size: 15, //每页显示记录条数
        current: 1, //当前页码
        total: 0 //总记录数据
      },
      //新增-修改
      deptOptions: [],
      //新增start
      addCondition: false, //新增弹框flag
      addConditionform: {
        //新增弹框保存数据对象
        userId: "", //员工姓名/员工编号
        deptValue: "" //查看部门会议纪要权限
      },
      addConditionformRule: {
        userId: [{ required: true, message: "请选择员工", trigger: "change" }] //员工姓名/员工编号
      },
      //checkBox组
      deptNames: [],
      //是否有操作权限
      radioValue: 1,
      //新增end
      isMdify: false, //是否是修改 true为修改 false为新增
      mdId: "", //修改id
      personalInfoData: {} //操作人popover弹窗数据
    }
  },
  computed: {},
  methods: {
    Js_clear() {
      //在点击由 clearable 属性生成的清空按钮时触发
      this.JS_search()
    },
    remoteMethod(query) {
      //搜索
      if (query !== "") {
        this.eleloading = true
        if (isNaN(query)) {
          //非纯数字字符串=>员工姓名查询
          this.queryEmployeeMess(query)
        } else {
          //纯数字字符串=>员工编号查询
          this.queryEmployeeMess("", query)
        }
      } else {
        this.employeeOptions = []
      }
    },
    //员工姓名/员工编号输入框查询
    queryEmployeeMess(userName = "", employedNo = "") {
      //搜索
      let queryObj = {
        userName,
        employedNo
      }
      GET(process.env.VUE_APP_DOMAIN_personnel + "/queryEmployeeMess", queryObj)
        .then(res => {
          console.log("员工姓名/员工编号", res)
          this.eleloading = false
          this.employeeOptions = res.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    remoteMethodAdd(query) {
      //新增
      if (query !== "") {
        this.eleloadingAdd = true
        if (isNaN(query)) {
          //非纯数字字符串=>员工姓名查询
          this.queryEmployeeMessAdd(query)
        } else {
          //纯数字字符串=>员工编号查询
          this.queryEmployeeMessAdd("", query)
        }
      } else {
        this.employeeOptionsAdd = []
      }
    },
    queryEmployeeMessAdd(userName = "", employedNo = "") {
      //新增
      let queryObj = {
        userName,
        employedNo
      }
      GET(process.env.VUE_APP_DOMAIN_personnel + "/queryEmployeeMess", queryObj)
        .then(res => {
          this.eleloadingAdd = false
          this.employeeOptionsAdd = res.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    //分页查询相关--start
    handlecurrentChange(val) {
      //点击页码，当前页
      this.configPageObj.current = val //保存状态-当前页
      this.search()
    },
    handleSizeChange(val) {
      //每页显示多少条数据切换
      this.configPageObj.size = val //保存状态-每页显示多少条数据切换
      this.search()
    },
    JS_search() {
      this.configPageObj.current = 1 //点击搜索current=1搜索第一页
      this.search()
    },
    search() {
      //mohan 列表查询
      let searchObj = {
        //查询对象,在这里初始化,初始化值都是取this下面的
        current: this.configPageObj.current, //当前页码, //当前页码
        size: this.configPageObj.size, //每页显示记录条数, //每页显示记录条数
        employeeName: this.employeeName, //员工姓名
        employeeNo: this.employeeNo || "" //员工编号
      }
      console.log("搜索对象", searchObj)
      this.loading = true //开启动画
      POST(process.env.VUE_APP_DOMAIN_administration + "/meeting/meetingAuthority/list", searchObj)
        .then(res => {
          this.loading = false //关闭动画
          this.tableData = res.data.records //set表格的值
          this.configPageObj.current = res.data.current //set当前页
          this.configPageObj.size = res.data.size //每页显示记录条数
          this.configPageObj.total = res.data.total //总记录条数
        })
        .catch(error => {
          console.log(error)
        })
    },
    inputEnter() {
      //输入框enter事件
      this.JS_search()
    },
    //分页查询相关--end
    //新增--start
    JS_add() {
      this.isMdify = false //设置为不是修改保存
      this.addCondition = true //新增弹框
      this.queryAllDepts() //获取所有部门信息
    },
    queryAllDepts() {
      //获取所有部门信息
      GET(process.env.VUE_APP_DOMAIN_personnel + "/queryAllDepts")
        .then(res => {
          this.deptOptions = res.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    JS_add_save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let employeeName_no = this.$refs.employeeAdd.selectedLabel //获取姓名与编号字符串
          let employeeName_no_arr = employeeName_no.split("(") //截成数组
          let userName = employeeName_no_arr[0] //获取姓名
          let employeeNo = employeeName_no_arr[1].split(")")[0] //获取编号
          let saveObj = {
            userName,
            userId: this.addConditionform.userId, //userId值
            employeeNo,
            operationAuthority: this.radioValue, //是否有操作权限
            deptNames: this.deptNames
          }
          if (saveObj.deptNames.length === 0) {
            //没有勾选部门
            this.$message({
              type: "warning",
              message: "请先勾选权限部门！",
              showClose: true
            })
            return
          }
          if (this.isMdify) {
            //修改保存
            PUT(process.env.VUE_APP_DOMAIN_administration + "/meeting/meetingAuthority/update", { ...saveObj, ...{ id: this.mdId } })
              .then(() => {
                this.$message({
                  type: "success",
                  message: "修改权限设置成功！",
                  showClose: true
                })
                this.addCondition = false //关闭弹框
                this.JS_add_resetForm("addConditionform")
                this.search() //重新搜索
              })
              .catch(error => {
                console.log(error)
              })
          } else {
            //新增保存
            POST(process.env.VUE_APP_DOMAIN_administration + "/meeting/meetingAuthority/save", saveObj)
              .then(() => {
                this.$message({
                  type: "success",
                  message: "新增权限设置成功！",
                  showClose: true
                })
                this.addCondition = false //关闭弹框
                this.JS_add_resetForm("addConditionform")
                this.search() //重新搜索
              })
              .catch(error => {
                console.log(error)
              })
          }
        } else {
          this.$message({
            showClose: true,
            type: "warning",
            message: "提交失败，验证不通过！"
          })
        }
      })
    },
    JS_add_resetForm(formName) {
      this.$refs[formName].resetFields() //重置员工姓名/员工编号
      this.radioValue = 1 //重置是否有操作权限
      this.addConditionform.deptValue = "" //重置查看部门会议纪要权限
      this.deptNames = [] //重置部门权限选择组数组
    },
    handleAddClose() {
      this.addCondition = false
      this.JS_add_resetForm("addConditionform")
    },
    addDept() {
      //新增会议纪要权限icon
      if (this.addConditionform.deptValue === "" || this.addConditionform.deptValue === null) {
        //如果没选择会议纪要权限部门
        this.$message({
          type: "warning",
          message: "请先选择部门！",
          showClose: true
        })
        return
      }
      if (this.deptNames.indexOf(this.addConditionform.deptValue) !== -1) {
        //已选择过该部门
        this.$message({
          type: "warning",
          message: "已选择过该部门！",
          showClose: true
        })
        return
      }
      this.deptNames.push(this.addConditionform.deptValue)
    },
    //新增--end
    JS_modify(id) {
      //修改
      this.isMdify = true //是否是修改保存
      this.mdId = id //保存修改id
      this.addCondition = true
      this.queryAllDepts() //获取所有部门信息
      //新增保存
      GET(process.env.VUE_APP_DOMAIN_administration + "/meeting/meetingAuthority/queryById", { id })
        .then(res => {
          console.log("修改", res)
          let userId = res.data.userId //员工姓名
          let userName = res.data.userName //员工id
          this.employeeOptionsAdd = [
            {
              userId,
              userName
            }
          ]
          this.addConditionform.userId = userId //选择该员工
          this.deptNames = res.data.deptNames //查看部门会议纪要权限
          this.radioValue = parseInt(res.data.operationAuthority) //是否有操作权限
        })
        .catch(error => {
          console.log(error)
        })
    },
    //根据员工编号获取操作人个人信息
    getUserInfo(num) {
      GET(process.env.VUE_APP_DOMAIN_personnel + "/queryUserInfoToRegid", { regid: num })
        .then(res => {
          this.personalInfoData = res.data
          this.personalInfoData.employedDates = this.personalInfoData.employedDates.split(" ")[0]
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  created() {
    this.search()
  }
}
</script>

<style scoped>
.width200 {
  width: 200px;
}
.addIcon {
  font-size: 24px;
  position: relative;
  top: 4px;
  left: 6px;
  cursor: pointer;
}
.checkboxWarp {
  border: 1px solid #ddd;
  padding: 15px;
  width: 445px;
}
</style>

