<template>
  <div class="init-setup">
    <div class="guide">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home/personnelSystem' }">人事系统</el-breadcrumb-item>
        <el-breadcrumb-item>人事基础薪资</el-breadcrumb-item>
        <el-breadcrumb-item>基础薪资初始配置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/personnelSystem' }">(返回上级)</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="bgWhite mgt15">
      <!-- 查询栏 start -->
      <div class="pad-top pull-left">
        <el-form :inline="true">
          <el-form-item label="所属区域">
            <el-select filterable clearable v-model="areaValue" placeholder="请选择" class="width155">
              <el-option v-for="item in areaOptions" :key="item.areaId" :label="item.areaName" :value="item.areaId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="级别">
            <el-select filterable clearable v-model="levelValue" placeholder="请选择" class="width155">
              <el-option v-for="item in levelOptions" :key="item.levelKey" :label="item.levelName" :value="item.levelKey">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="学历">
            <el-select clearable v-model="educationValue" placeholder="请选择" class="width155">
              <el-option 
                v-for="item in educationOptions"
                :key="item.educationId"
                :label="item.educationName"
                :value="item.educationId">
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item>
            <el-button type="primary" @click="JS_search" icon="el-icon-search">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="pad-top pull-right">
        <el-form>
          <el-form-item class="pull-right">
            <el-button @click="addCondition=true" icon="el-icon-plus">新增</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 表格 -->
      <div class="table_wrap">
        <el-table v-loading="loading" :height="tabHeight" :data="initSalaryData" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
          <el-table-column type="index" label="序号" min-width="50"></el-table-column>
          <el-table-column prop="salaryType" label="薪资类型" min-width="80">
            <template slot-scope="scope">
              <span>{{scope.row.salaryType == "1"?"业务部门":"职能部门"}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="workAreaName" show-overflow-tooltip label="所属区域" min-width="110"></el-table-column>
          <el-table-column prop="levelName" label="级别" min-width="70"></el-table-column>
          <!-- <el-table-column prop="postName" label="职务" min-width="140"></el-table-column> -->
          <!-- <el-table-column prop="educationName" label="学历" min-width="100"></el-table-column> -->
          <el-table-column prop="employeeType" show-overflow-tooltip label="员工类型" min-width="120"></el-table-column>
          <!-- <el-table-column label="试用（实习）工资" min-width="120">
                <template slot-scope="scope">
                  {{scope.row.probationSalary | toThousands}}
                </template>
              </el-table-column> -->
          <el-table-column label="基础薪资总额" min-width="120">
            <template slot-scope="scope">
              {{scope.row.totalAmount | toThousands}}
            </template>
          </el-table-column>
          <el-table-column label="基本工资" min-width="100">
            <template slot-scope="scope">
              {{scope.row.basicSalary | toThousands}}
            </template>
          </el-table-column>
          <el-table-column label="保密补助" min-width="100">
            <template slot-scope="scope">
              {{scope.row.secretAllowance | toThousands}}
            </template>
          </el-table-column>
          <el-table-column label="中餐补助" min-width="100">
            <template slot-scope="scope">
              {{scope.row.lunchAllowance | toThousands}}
            </template>
          </el-table-column>
          <el-table-column label="交通补助" min-width="100">
            <template slot-scope="scope">
              {{scope.row.trafficAllowance | toThousands}}
            </template>
          </el-table-column>
          <el-table-column label="电话补助" min-width="100">
            <template slot-scope="scope">
              {{scope.row.phoneAllowance | toThousands}}
            </template>
          </el-table-column>
          <el-table-column label="职务补助" min-width="100">
            <template slot-scope="scope">
              {{scope.row.dutySalary | toThousands}}
            </template>
          </el-table-column>
          <el-table-column label="加班工资" min-width="100">
            <template slot-scope="scope">
              {{scope.row.extraworkSalary | toThousands}}
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="操作" min-width="100" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="updateThis(scope.row.id)">修改</el-button>
              <el-button type="text" size="small" @click="deleteThis(scope.row.id,scope.$index)" style="color:#EE4408">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div id="pagination">
          <el-pagination @size-change="handleSizeChange" @current-change="handlecurrentChange" background :current-page="current" :page-sizes="[10,15,20,30,40]" :page-size="size" layout="total,sizes,prev,pager,next,jumper" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>

    <!-- 新增初始条件弹框 -->
    <el-dialog title="新增初始条件" :before-close="handleAddClose" :close-on-click-modal="false" :visible.sync="addCondition" width="768px" class="grayBg">
      <el-form :model="addConditionform" :rules="addConditionformRule" ref="addConditionform" label-width="150px">
        <div class="whiteBox">
          <p class="pReset">基本情况</p>
          <el-row>
            <el-col :md="12">
              <el-form-item label="薪资类型：">
                业务部门
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="所属区域：" prop="workAreaId">
                <el-select filterable ref="areaRef" v-model="addConditionform.workAreaId" placeholder="请选择" style="width:200px">
                  <el-option v-for="item in areaOptions" :key="item.areaId" :label="item.areaName" :value="item.areaId">
                  </el-option>
                </el-select>
              </el-form-item>

            </el-col>
            <!-- <el-col :md="12">
              <el-form-item label="学历：" prop="educationId">
                <el-select ref="educationRef" v-model="addConditionform.educationId" placeholder="请选择" style="width:200px">
                  <el-option 
                    v-for="item in educationOptions"
                    :key="item.educationId"
                    :label="item.educationName"
                    :value="item.educationId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col> -->
            <el-col :md="12">
              <el-form-item label="级别：" prop="levelId">
                <el-select filterable ref="levelRef" v-model="addConditionform.levelId" placeholder="请选择" style="width:200px">
                  <el-option v-for="item in levelOptions" :key="item.levelKey" :label="item.levelName" :value="item.levelKey">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="员工类型：" prop="employeeTypeId">
                <el-select filterable ref="employeeTypeRef" v-model="addConditionform.employeeTypeId" placeholder="请选择" style="width:200px">
                  <el-option v-for="item in hrTypeOptions" :key="item.hrTypeKey" :label="item.hrTypeName" :value="item.hrTypeKey">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="whiteBox">
          <p class="pReset">配置</p>
          <el-row>
            <el-col :md="12">
              <el-form-item label="基础总额：">
                <el-input disabled v-model="addConditionform.totalAmount" style="width:200px" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="基本工资：" prop="basicSalary">
                <el-input-number @input.native="basicSalaryChange" :controls="false" v-model="addConditionform.basicSalary" style="width:200px" :min="0" :max="10000000"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="保密补助：" prop="secretAllowance">
                <el-input-number @input.native="secretAllowanceChange" :controls="false" v-model="addConditionform.secretAllowance" style="width:200px" :min="0" :max="10000000"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="中餐补助：" prop="lunchAllowance">
                <el-input-number @input.native="lunchAllowanceChange" :controls="false" v-model="addConditionform.lunchAllowance" style="width:200px" :min="0" :max="10000000"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="交通补助：" prop="trafficAllowance">
                <el-input-number @input.native="trafficAllowanceChange" :controls="false" v-model="addConditionform.trafficAllowance" style="width:200px" :min="0" :max="10000000"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="电话补助：" prop="phoneAllowance">
                <el-input-number @input.native="phoneAllowanceChange" :controls="false" v-model="addConditionform.phoneAllowance" style="width:200px" :min="0" :max="10000000"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="职务工资：" prop="dutySalary">
                <el-input-number @input.native="dutySalaryChange" :controls="false" v-model="addConditionform.dutySalary" style="width:200px" :min="0" :max="10000000"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="加班工资：" prop="extraworkSalary">
                <el-input-number @input.native="extraworkSalaryChange" :controls="false" v-model="addConditionform.extraworkSalary" style="width:200px" :min="0" :max="10000000"></el-input-number>
              </el-form-item>
            </el-col>
            <!-- <el-col :md="24">
            <el-alert  title="注意：当薪资类型选择职能时，基础总额将不可填写。"  type="warning" :closable="false"> </el-alert>
          </el-col> -->
          </el-row>
        </div>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="JS_add_cancel('addConditionform')">取消</el-button>
        <el-button type="primary" @click="JS_add_save('addConditionform')" v-no-more-click>保存</el-button>
      </span>
    </el-dialog>

    <!-- 修改条件弹框 -->
    <el-dialog title="修改条件" :before-close="handleModifyClose" :close-on-click-modal="false" :visible.sync="updateCondition" width="768px" class="grayBg">
      <div class="whiteBox">
        <p class="pReset">基本情况</p>
        <el-row class="textLft">
          <el-col :span="3" class="height26">薪资类型：</el-col>
          <el-col :span="9" class="height26">{{modifyForm.salaryType=="1"?"业务部门":"职能部门"}}</el-col>
          <!-- <el-col :span="3" class="height26">职&nbsp;&nbsp;&nbsp;&nbsp;务：</el-col> -->
          <!-- <el-col :span="9" class="height26">产品经理</el-col> -->
          <el-col :span="3" class="height26">所属地区：</el-col>
          <el-col :span="9" class="height26">{{modifyForm.workAreaName}}</el-col>
          <!-- <el-col :span="3" class="height26">学&nbsp;&nbsp;&nbsp;&nbsp;历：</el-col> -->
          <!-- <el-col :span="9" class="height26">{{modifyForm.educationName}}</el-col> -->
          <el-col :span="3" class="height26">级&nbsp;&nbsp;&nbsp;&nbsp;别：</el-col>
          <el-col :span="9" class="height26">{{modifyForm.levelName}}</el-col>
          <el-col :span="3" class="height26">员工类型：</el-col>
          <el-col :span="9" class="height26">{{modifyForm.employeeType}}</el-col>
        </el-row>
      </div>
      <div class="whiteBox">
        <p class="pReset">配置</p>
        <el-form :model="updateConditionform" :rules="updateConditionformRule" ref="updateConditionform" label-width="150px">
          <el-row>
            <el-col :md="12">
              <el-form-item label="基础总额：">
                <el-input disabled v-model="updateConditionform.totalAmount" style="width:200px" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="基本工资：" prop="basicSalary">
                <el-input-number @input.native="basicSalaryModifyChange" :controls="false" v-model="updateConditionform.basicSalary" style="width:200px" :min="0" :max="10000000"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="保密补助：" prop="secretAllowance">
                <el-input-number @input.native="secretAllowanceModifyChange" :controls="false" v-model="updateConditionform.secretAllowance" style="width:200px" :min="0" :max="10000000"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="中餐补助：" prop="lunchAllowance">
                <el-input-number @input.native="lunchAllowanceModifyChange" :controls="false" v-model="updateConditionform.lunchAllowance" style="width:200px" :min="0" :max="10000000"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="交通补助：" prop="trafficAllowance">
                <el-input-number @input.native="trafficAllowanceModifyChange" :controls="false" v-model="updateConditionform.trafficAllowance" style="width:200px" :min="0" :max="10000000"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="电话补助：" prop="phoneAllowance">
                <el-input-number @input.native="phoneAllowanceModifyChange" :controls="false" v-model="updateConditionform.phoneAllowance" style="width:200px" :min="0" :max="10000000"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="职务工资：" prop="dutySalary">
                <el-input-number @input.native="dutySalaryModifyChange" :controls="false" v-model="updateConditionform.dutySalary" style="width:200px" :min="0" :max="10000000"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="加班工资：" prop="extraworkSalary">
                <el-input-number @input.native="extraworkSalaryModifyChange" :controls="false" v-model="updateConditionform.extraworkSalary" style="width:200px" :min="0" :max="10000000"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="JS_modify_cancel('updateConditionform')">取消</el-button>
        <el-button type="primary" @click="JS_update_save('updateConditionform')" v-no-more-click>保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import myMixin from "libs/mixin/index.js"
import tbMixin from "libs/mixin/tbMixin.js" //动态计算表格高度mixin
import { GET, POST, DELETE, PUT } from "http/custom.js"
export default {
  name: 'initSetup',
  mixins: [myMixin, tbMixin],
  data() {
    return {
      t_height: 290, //减去的高度
      loading: false,//table加载动画开关
      current: 1,//当前页码
      pages: 0,//总页数
      size: 15,//每页显示记录条数
      total: 0,//总记录条数
      initSalaryData: [],//表格数组
      areaValue: "",//所属区域选择值
      areaName: "",//区域名字
      areaOptions: [],//所属区域字典options
      levelValue: "",//级别选择值
      levelOptions: [],//级别字典options
      // educationValue:"",//学历选择值
      // educationOptions:[],//学历字典options
      hrTypeValue: [],//员工类型选择值
      hrTypeOptions: [],//员工类型字典options
      //新增模态框数据
      addCondition: false,
      addConditionform: {
        salaryType: "1",//薪资类型 1业务部门 2职能部门
        workAreaId: '',//所属区域
        // educationId:'',//学历
        levelId: '',//级别
        employeeTypeId: '',//员工类型
        totalAmount: 0,//基础总额
        basicSalary: 0,//基础工资
        secretAllowance: 0,//保密补助
        lunchAllowance: 0, //中餐补助
        trafficAllowance: 0, //交通补助
        phoneAllowance: 0, //电话补助
        dutySalary: 0, //职务补助
        extraworkSalary: 0 //加班补助
      },
      addConditionformRule: {
        workAreaId: [{ required: true, message: "请选择区域", trigger: "change" }],//所属区域
        // educationId:[{ required: true, message: "请选择学历", trigger: "change" }], //学历
        levelId: [{ required: true, message: "请选择级别", trigger: "change" }],//级别
        employeeTypeId: [{ required: true, message: "请选择员工类型", trigger: "change" }], //员工类型
        // totalAmount: [{ required: true, message: "请填写基础总额", trigger: "blur" }], //基础总额
        // basicSalary: [{ required: true, message: "请填写基本工资", trigger: "blur" }], //基础工资
        // secretAllowance: [{ required: true, message: "请填写保密补助", trigger: "blur" }], //保密补助
        // lunchAllowance: [{ required: true, message: "请填写中餐补助", trigger: "blur" }], //中餐补助
        //trafficAllowance: [{ required: true, message: "请填写交通补助", trigger: "blur" }],//交通补助
        //phoneAllowance: [{ required: true, message: "请填写电话补助", trigger: "blur" }], //电话补助
        //dutySalary: [{ required: true, message: "请填写职务工资", trigger: "blur" }], //职务补助
        //extraworkSalary: [{ required: true, message: "请填写加班工资", trigger: "blur" }] //加班补助
      },
      modifyForm: {},//修改对象
      //修改模态框数据对象
      updateCondition: false,
      updateConditionform: {//修改条件
        totalAmount: undefined,//基础总额
        basicSalary: undefined,//基础工资
        secretAllowance: undefined,//保密补助
        lunchAllowance: undefined, //中餐补助
        trafficAllowance: undefined, //交通补助
        phoneAllowance: undefined, //电话补助
        dutySalary: undefined, //职务补助
        extraworkSalary: undefined //加班补助
      },
      updateConditionformRule: {
        totalAmount: [{ required: true, message: "请填写基础总额", trigger: "blur" }], //基础总额
        basicSalary: [{ required: true, message: "请填写基本工资", trigger: "blur" }], //基础工资
        secretAllowance: [{ required: true, message: "请填写保密补助", trigger: "blur" }], //保密补助
        lunchAllowance: [{ required: true, message: "请填写中餐补助", trigger: "blur" }], //中餐补助
        trafficAllowance: [{ required: true, message: "请填写交通补助", trigger: "blur" }],//交通补助
        phoneAllowance: [{ required: true, message: "请填写电话补助", trigger: "blur" }], //电话补助
        dutySalary: [{ required: true, message: "请填写职务工资", trigger: "blur" }], //职务补助
        extraworkSalary: [{ required: true, message: "请填写加班工资", trigger: "blur" }] //加班补助
      },
    }
  },
  watch: {
    addConditionform: {//计算基础总额
      deep: true,
      handler() {
        console.log('正在计算')
        this.addConditionform.totalAmount = (parseInt(this.addConditionform.basicSalary) || 0)
          + (parseInt(this.addConditionform.secretAllowance) || 0)
          + (parseInt(this.addConditionform.lunchAllowance) || 0)
          + (parseInt(this.addConditionform.trafficAllowance) || 0)
          + (parseInt(this.addConditionform.phoneAllowance) || 0)
          + (parseInt(this.addConditionform.dutySalary) || 0)
          + (parseInt(this.addConditionform.extraworkSalary) || 0)
      }
    },
    updateConditionform: {//计算基础总额
      deep: true,
      handler() {
        console.log('正在计算')
        this.updateConditionform.totalAmount = (parseInt(this.updateConditionform.basicSalary) || 0)
          + (parseInt(this.updateConditionform.secretAllowance) || 0)
          + (parseInt(this.updateConditionform.lunchAllowance) || 0)
          + (parseInt(this.updateConditionform.trafficAllowance) || 0)
          + (parseInt(this.updateConditionform.phoneAllowance) || 0)
          + (parseInt(this.updateConditionform.dutySalary) || 0)
          + (parseInt(this.updateConditionform.extraworkSalary) || 0)
      }
    }
  },
  created() {
    // mock接口
    // GET('/api/getInitSalaryTableData').then(res=>{
    //   this.initSalaryData = res
    // }).catch(error=>{
    //     console.log(error)
    // })
    //初始查询
    this.queryAreaList()//获取所属区域字典
    this.queryLevelList()//获取级别字典
    // this.queryEducationList()//获取学历
    this.queryHrTypeList()//获取员工类型
    this.search() //获取表格列表分页初始化数据
  },
  methods: {
    //下面的Change方法都是属于input的实时input方法
    basicSalaryChange(e) { //基本工资
      this.addConditionform.basicSalary = e.target.value
    },
    secretAllowanceChange(e) { //保密补助
      this.addConditionform.secretAllowance = e.target.value
    },
    lunchAllowanceChange(e) { //中餐补助
      this.addConditionform.lunchAllowance = e.target.value
    },
    trafficAllowanceChange(e) { //交通补助
      this.addConditionform.trafficAllowance = e.target.value
    },
    phoneAllowanceChange(e) { //电话补助
      this.addConditionform.phoneAllowance = e.target.value
    },
    dutySalaryChange(e) { //职务补助
      this.addConditionform.dutySalary = e.target.value
    },
    extraworkSalaryChange(e) { //加班补助
      this.addConditionform.extraworkSalary = e.target.value
    },
    handleSizeChange(val) {//每页显示多少条数据切换
      this.size = val //保存状态-每页显示多少条数据切换
      this.search()
    },
    basicSalaryModifyChange(e) { //基本工资
      this.updateConditionform.basicSalary = e.target.value
    },
    secretAllowanceModifyChange(e) { //保密补助
      this.updateConditionform.secretAllowance = e.target.value
    },
    lunchAllowanceModifyChange(e) { //中餐补助
      this.updateConditionform.lunchAllowance = e.target.value
    },
    trafficAllowanceModifyChange(e) { //交通补助
      this.updateConditionform.trafficAllowance = e.target.value
    },
    phoneAllowanceModifyChange(e) { //电话补助
      this.updateConditionform.phoneAllowance = e.target.value
    },
    dutySalaryModifyChange(e) { //职务补助
      this.updateConditionform.dutySalary = e.target.value
    },
    extraworkSalaryModifyChange(e) { //加班补助
      this.updateConditionform.extraworkSalary = e.target.value
    },
    handleSizeChange(val) {//每页显示多少条数据切换
      this.size = val //保存状态-每页显示多少条数据切换
      this.search()
    },
    handlecurrentChange(val) {//点击页码，当前页
      this.current = val //保存状态-当前页
      this.search()
    },
    JS_search() {
      this.current = 1 //点击搜索current=1搜索第一页
      this.search()
    },
    JS_add_save(formName) { //新增保存
      this.$refs[formName].validate(valid => {
        if (valid) {
          let selectLabelObj = { //通过$refs获取select Label值
            "workAreaName": this.$refs.areaRef.selectedLabel,//工作区域
            // "educationName":this.$refs.educationRef.selectedLabel,//学历名称
            "levelName": this.$refs.levelRef.selectedLabel,//级别
            "employeeType": this.$refs.employeeTypeRef.selectedLabel //员工类型
          }
          let saveObj = { ...this.addConditionform, ...selectLabelObj } //保存对象
          console.log('保存对象', saveObj)
          POST(process.env.VUE_APP_DOMAIN_personnel + '/basicSalaryConfig', saveObj).then(res => {
            this.$message({
              type: 'success',
              message: '新增数据成功!',
              showClose: true
            })
            this.addCondition = false //关闭新增弹框
            this.resetAndSearch(formName) //重置表单重新获取数据
          }).catch(error => {
            console.log(error)
          })
        } else {
          this.$message({
            showClose: true,
            type: 'warning',
            message: '提交失败，验证不通过'
          })
        }
      })
    },
    deleteThis(id, index) {
      this.$msgBox.confirm('你确定要删除该条数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DELETE(process.env.VUE_APP_DOMAIN_personnel + '/basicSalaryConfigs', { "ids": id }).then(res => { //单条数据删除
          // this.initSalaryData.splice(index,1) //前端删除当前行
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.JS_search() //刷新表格，重新获取数据
        }).catch(error => {
          console.log(error)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    updateThis(id) {//修改
      this.updateCondition = true //弹出修改框
      GET(process.env.VUE_APP_DOMAIN_personnel + '/basicSalaryConfig', { "id": id }).then(res => {//查询薪资类型模板
        this.modifyForm = res.data
        console.log('查询薪资类型模板', res)
        this.updateConditionform = res.data //赋值给updateConditionform对象
      }).catch(error => {
        console.log(error)
      })
    },
    JS_update_save(formName) {//修改保存
      this.$refs[formName].validate(valid => {
        if (valid) {
          let saveObj = this.updateConditionform //修改对象
          console.log('修改对象', saveObj)
          PUT(process.env.VUE_APP_DOMAIN_personnel + '/basicSalaryConfig', saveObj).then(res => {
            this.$message({
              type: 'success',
              message: '修改数据成功!',
              showClose: true
            })
            this.updateCondition = false //关闭修改弹框
            this.resetAndSearch(formName) //重置表单重新获取数据
          }).catch(error => {
            console.log(error)
          })
        } else {
          this.$message({
            showClose: true,
            type: 'warning',
            message: '提交失败，验证不通过'
          })
        }
      })
    },
    search() {
      //mohan 列表查询
      let searchObj = {//查询对象,在这里初始化,初始化值都是取this下面的
        "current": this.current, //当前页码
        "size": this.size, //每页显示记录条数
        "levelId": this.levelValue || "", //级别
        // "educationId":this.educationValue||"", //学历
        "workAreaId": this.areaValue || ""//所属区域
      }
      console.log('搜索对象', searchObj)
      this.loading = true //开启动画
      POST(process.env.VUE_APP_DOMAIN_personnel + '/basicSalaryConfigs', searchObj).then(res => {
        this.loading = false //关闭动画
        this.initSalaryData = res.data.records //set表格的值
        this.current = res.data.current //set当前页
        this.pages = res.data.pages //总记录条数
        this.size = res.data.size //每页显示记录条数
        this.total = res.data.total //总记录条数
      }).catch(error => {
        console.log(error)
      })
    },
    queryAreaList() {//获取所属区域
      POST(process.env.VUE_APP_DOMAIN_personnel + '/queryAreaList').then(res => {
        this.areaOptions = res.data
      }).catch(error => {
        console.log(error)
      })
    },
    queryLevelList() {//获取级别
      POST(process.env.VUE_APP_DOMAIN_personnel + '/queryLevelList').then(res => {
        this.levelOptions = res.data
      }).catch(error => {
        console.log(error)
      })
    },
    // queryEducationList(){//获取学历
    //   POST(process.env.VUE_APP_DOMAIN_personnel+'/queryEducationList').then(res=>{
    //       this.educationOptions = res.data
    //   }).catch(error=>{
    //       console.log(error)
    //   })
    // },
    queryHrTypeList() {//获取员工类型
      POST(process.env.VUE_APP_DOMAIN_personnel + '/queryHrTypeList').then(res => {
        this.hrTypeOptions = res.data
      }).catch(error => {
        console.log(error)
      })
    }

  }
}
</script>
<style scoped>
.bgWhite {
  padding: 15px;
}
</style>
