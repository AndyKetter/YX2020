<template>
  <div class="incomeItemsSetting">
    <div class="guide">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home/personnelSystem' }">人事系统</el-breadcrumb-item>
        <el-breadcrumb-item>人事收入</el-breadcrumb-item>
        <el-breadcrumb-item>收入项设置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/personnelSystem' }">(返回上级)</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="bgWhite mgt15 content clearfix">
      <!-- 查询栏 start -->
      <div class="pull-left">
        <el-form :inline="true" class="mar-no">
          <el-form-item label="所属区域">
            <el-select filterable clearable v-model="areaValue" placeholder="请选择" class="width155">
              <el-option
                v-for="item in areaOptions"
                :key="item.areaId"
                :label="item.areaName"
                :value="item.areaId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="JS_search" icon="el-icon-search">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="pull-right">
        <el-button size="small" @click="addCondition=true">
          <i class="el-icon-plus"></i>&nbsp;新增
        </el-button>
      </div>
      <div class="table_wrap">
        <el-table
          v-loading="loading"
          :height="tabHeight"
          :data="incomeItemsSettingData"
          border
          style="width:100%"
          :header-cell-style="{backgroundColor:'#e5e9f3'}"
        >
          <el-table-column type="index" label="序号" min-width="50"></el-table-column>
          <el-table-column prop="workAreaName" min-width="110" show-overflow-tooltip label="所属区域"></el-table-column>
          <el-table-column label="餐补" min-width="100">
            <template slot-scope="scope">{{scope.row.boardAllowance | toThousands}}</template>
          </el-table-column>
          <el-table-column label="租房补贴" min-width="100">
            <template slot-scope="scope">{{scope.row.rentAllowance | toThousands}}</template>
          </el-table-column>
          <el-table-column label="社保补贴" min-width="100">
            <template slot-scope="scope">{{scope.row.socialAllowance | toThousands}}</template>
          </el-table-column>
          <el-table-column label="操作人" min-width="150">
            <template slot-scope="scope">
              <el-popover
                v-if="scope.row.updateUserName||scope.row.createUserName"
                trigger="click"
                placement="top"
                @show="getUserInfo(scope.row.updateUser||scope.row.createUser)"
                width="450"
              >
                <!-- S -->
                <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                <!-- E -->
                <div slot="reference" class="name-wrapper">
                  <el-button size="mini">{{scope.row.updateUserName||scope.row.createUserName}}</el-button>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="操作时间" show-overflow-tooltip min-width="160">
            <template slot-scope="scope">{{scope.row.updateTime||scope.row.createTime}}</template>
          </el-table-column>
          <el-table-column prop="isProvince" min-width="100" label="是否省内公司">
            <template slot-scope="scope">
              <span v-if="scope.row.isProvince === '1'">是</span>
              <span v-if="scope.row.isProvince === '0'">否</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="100" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="updateThis(scope.row.id)">修改</el-button>
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
    </div>

    <!-- 新增配置收入项 -->
    <el-dialog
      title="配置收入项"
      :before-close="handleAddClose"
      :close-on-click-modal="false"
      :visible.sync="addCondition"
      width="768px"
    >
      <el-form
        :model="addConditionform"
        :rules="addConditionformRule"
        ref="addConditionform"
        label-width="110px"
      >
        <el-row>
          <el-col :md="12">
            <el-form-item label="所属区域：" prop="workAreaId">
              <el-select
                filterable
                ref="areaRef"
                v-model="addConditionform.workAreaId"
                placeholder="请选择"
                style="width:200px"
              >
                <el-option
                  v-for="item in areaOptions"
                  :key="item.areaId"
                  :label="item.areaName"
                  :value="item.areaId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="餐补：" prop="boardAllowance">
              <el-input-number
                :controls="false"
                v-model="addConditionform.boardAllowance"
                style="width:200px"
                :min="0"
                :max="10000000"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="租房补贴：" prop="rentAllowance">
              <el-input-number
                :controls="false"
                v-model="addConditionform.rentAllowance"
                style="width:200px"
                :min="0"
                :max="10000000"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="社保补贴：" prop="socialAllowance">
              <el-input-number
                :controls="false"
                v-model="addConditionform.socialAllowance"
                style="width:200px"
                :min="0"
                :max="10000000"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="是否省内：" prop="isProvince">
              <el-select
                filterable
                style="width:200px"
                v-model="addConditionform.isProvince"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in isProvinceOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="JS_cancel('addConditionform')">取消</el-button>
        <el-button type="primary" @click="JS_add_save('addConditionform')" v-no-more-click>保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import myMixin from "libs/mixin/index.js"
import tbMixin from "libs/mixin/tbMixin.js" //动态计算表格高度mixin
import { GET, POST, DELETE, PUT } from "http/custom.js"
export default {
  name: "incomeItemsSetting",
  mixins: [myMixin, tbMixin],
  data() {
    return {
      t_height: 285, //减去的高度
      updateId: "", //修改id
      areaValue: "", //所属区域选择值
      areaOptions: [], //所属区域字典options
      loading: false, //table加载动画开关
      current: 1, //当前页码
      pages: 0, //总页数
      size: 15, //每页显示记录条数
      total: 0, //总记录条数
      incomeItemsSettingData: [], //人事收入项设置
      personalInfoData: {}, //姓名popover弹窗数据
      addCondition: false,
      isProvinceOptions: [
        //是否省外
        {
          value: 1,
          label: "是"
        },
        {
          value: 0,
          label: "否"
        }
      ],
      addConditionform: {
        //新增
        workAreaId: "", //所属区域
        workAreaName: "", //所属区域名字
        boardAllowance: undefined, //餐补
        rentAllowance: undefined, //租房补贴
        socialAllowance: undefined, //社保补贴
        isProvince: "" //是否是省内分公司:0否1是
      },
      addConditionformRule: {
        workAreaId: [{ required: true, message: "请选择区域", trigger: "change" }], //所属区域
        boardAllowance: [{ required: true, message: "请填写餐补", trigger: "blur" }], //餐补
        rentAllowance: [{ required: true, message: "请填写租房补贴", trigger: "blur" }], //租房补贴
        socialAllowance: [{ required: true, message: "请填写社保补贴", trigger: "blur" }], //社保补贴
        isProvince: [{ required: true, message: "请填写社保补贴", trigger: "change" }] //是否是省内分公司:0否1是
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      //每页显示多少条数据切换
      this.size = val //保存状态-每页显示多少条数据切换
      this.search()
    },
    handlecurrentChange(val) {
      //点击页码，当前页
      this.current = val //保存状态-当前页
      this.search()
    },
    queryAreaList() {
      //获取所属区域
      POST(process.env.VUE_APP_DOMAIN_personnel + "/queryAreaList")
        .then(res => {
          this.areaOptions = res.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    //根据员工编号获取个人信息
    getUserInfo(num) {
      GET(process.env.VUE_APP_DOMAIN_personnel + "/queryUserInfoToRegid", { regid: num })
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
    JS_search() {
      this.current = 1 //点击搜索current=1搜索第一页
      this.search()
    },
    updateThis(id) {
      //修改
      console.log("id多少", id)
      this.updateId = id //保存修改id
      this.addCondition = true //弹出修改框
      GET(process.env.VUE_APP_DOMAIN_personnel + "/incomeConfig", { id: id })
        .then(res => {
          //查询收入项设置
          let isProvince
          if (res.data.isProvince === "" || res.data.isProvince === undefined) {
            //是否全团队
            isProvince = ""
          } else {
            isProvince = parseInt(res.data.isProvince)
          }
          let workAreaId = parseInt(res.data.workAreaId) //设置select组件一定要转成int类型
          this.addConditionform = { ...res.data, ...{ workAreaId, isProvince } } //赋值给addConditionform对象
        })
        .catch(error => {
          console.log(error)
        })
    },
    JS_add_save(formName) {
      //新增保存-修改
      let httpType = ""
      if (this.updateId != "") {
        httpType = "PUT" //修改功能
      } else {
        httpType = "POST" //新增功能
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          let selectLabelObj = {
            //通过$refs获取select Label值
            workAreaName: this.$refs.areaRef.selectedLabel //工作区域
          }
          let saveObj = { ...this.addConditionform, ...selectLabelObj } //保存对象
          if (httpType === "POST") {
            //新增
            POST(process.env.VUE_APP_DOMAIN_personnel + "/incomeConfig", saveObj)
              .then(res => {
                this.updateId = "" //重置修改id
                this.$message({
                  type: "success",
                  message: "新增数据成功!",
                  showClose: true
                })
                this.addCondition = false //关闭新增弹框
                this.resetAndSearch(formName) //重置表单重新获取数据
              })
              .catch(error => {
                console.log(error)
              })
          } else {
            //修改
            PUT(process.env.VUE_APP_DOMAIN_personnel + "/incomeConfig", saveObj)
              .then(res => {
                this.updateId = "" //重置修改id
                this.$message({
                  type: "success",
                  message: "修改数据成功!",
                  showClose: true
                })
                this.addCondition = false //关闭修改弹框
                this.resetAndSearch(formName) //重置表单重新获取数据
              })
              .catch(error => {
                console.log(error)
              })
          }
        } else {
          this.$message({
            showClose: true,
            type: "warning",
            message: "提交失败，验证不通过"
          })
          return false
        }
      })
    },
    JS_cancel(formName) {
      //取消  重置表单
      this.updateId = "" //重置修改id
      this.addCondition = false //隐藏弹框
      this.$refs[formName].resetFields()
    },
    search() {
      //mohan 列表查询
      let searchObj = {
        //查询对象,在这里初始化,初始化值都是取this下面的
        current: this.current, //当前页码
        size: this.size, //每页显示记录条数
        workAreaId: this.areaValue || "" //所属区域
      }
      console.log("搜索对象", searchObj)
      this.loading = true //开启动画
      POST(process.env.VUE_APP_DOMAIN_personnel + "/incomeConfigs", searchObj)
        .then(res => {
          console.log("8888", res)
          this.loading = false //关闭动画
          this.incomeItemsSettingData = res.data.records //set表格的值
          this.current = res.data.current //set当前页
          this.pages = res.data.pages //总记录条数
          this.size = res.data.size //每页显示记录条数
          this.total = res.data.total //总记录条数
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  created() {
    // GET('/api/getIncomeItemsSettingData').then(res=>{//人事收入项设置
    //   this.incomeItemsSettingData = res.dataTable
    // }).catch(error=>{
    //     console.log(error)
    // })
    this.queryAreaList() //获取所属区域字典
    this.search() //获取表格列表分页初始化数据
  }
}
</script>

<style scoped>
</style>
