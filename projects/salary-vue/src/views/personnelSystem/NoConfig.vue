<template>
  <div class="no-config">
    <div class="guide">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home/personnelSystem' }">人事系统</el-breadcrumb-item>
        <el-breadcrumb-item>人事基础薪资</el-breadcrumb-item>
        <el-breadcrumb-item>未配置基础薪资</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/personnelSystem' }">(返回上级)</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="bgWhite mgt15">
      <!-- 查询栏 start -->
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="职能部门" name="first">
          <div class="pull-left">
            <el-form :inline="true" :model="functionFormSearch" class="mar-no">
              <el-form-item label="姓名">
                <el-input v-model.trim="functionFormSearch.userName" clearable placeholder="请输入名字" class="width155" @keyup.enter.native="JS_search"></el-input>
              </el-form-item>
              <el-form-item label="员工编号">
                <el-input-number v-model.trim="functionFormSearch.employedNo" :controls="false" placeholder="请输入编号" class="width155" @keyup.enter.native="JS_search" :min="0" :max="10000000000"></el-input-number>
              </el-form-item>
              <!-- <el-form-item label="联系号码">
                <el-input-number v-model.trim="functionFormSearch.mobilePhone" placeholder="请输入号码" :controls="false" class="width155" @keyup.enter.native="JS_search" :min="0" :max="100000000000"></el-input-number>
              </el-form-item> -->
              <el-form-item>
                <el-button type="primary" @click="JS_search" icon="el-icon-search">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="table_wrap">
            <el-table v-loading="loading" :height="tabHeight" :data="noConfigTableData" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
              <el-table-column type="index" label="序号" min-width="50"></el-table-column>
              <el-table-column label="姓名" min-width="150">
                <template slot-scope="scope">
                  <el-popover trigger="click" placement="top" @show="getUserInfo(scope.row.employedNo)" width="450">
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.userName}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="性别" min-width="50">
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
              <el-table-column prop="educationNam" label="学历" min-width="100"></el-table-column>
              <el-table-column label="操作" min-width="50" fixed="right">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="configSalary(scope.row.employedNo)">配置</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div id="pagination">
              <el-pagination @size-change="handleSizeChange" @current-change="handlecurrentChange" background :current-page="current" :page-sizes="[10,15,20,30,40]" :page-size="size" layout="total,sizes,prev,pager,next,jumper" :total="total">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 基础薪资配置弹框 -->
    <el-dialog title="基础薪资配置" :close-on-click-modal="false" :visible.sync="baseSalarySet" width="768px" class="grayBg">
      <div class="whiteBox">
        <p class="pReset activeBgcolor">基本情况</p>
        <el-row class="textLft">
          <el-col :span="3" class="height26">姓&nbsp;&nbsp;&nbsp;&nbsp;名：</el-col>
          <el-col :span="5" class="height26">{{configSalaryUserInfo.name}}</el-col>
          <el-col :span="3" class="height26">性&nbsp;&nbsp;&nbsp;&nbsp;别：</el-col>
          <el-col :span="5" class="height26">{{configSalaryUserInfo.gender=="1"?"男":"女"}}</el-col>
          <el-col :span="3" class="height26">员工编号：</el-col>
          <el-col :span="5" class="height26">{{configSalaryUserInfo.aid}}</el-col>
          <el-col :span="3" class="height26">手机号码：</el-col>
          <el-col :span="5" class="height26">{{configSalaryUserInfo.phoneNum}}</el-col>
          <el-col :span="3" class="height26">级&nbsp;&nbsp;&nbsp;&nbsp;别：</el-col>
          <el-col :span="5" class="height26">{{configSalaryUserInfo.levelName}}</el-col>
          <el-col :span="3" class="height26">职&nbsp;&nbsp;&nbsp;&nbsp;务：</el-col>
          <el-col :span="5" class="height26">{{configSalaryUserInfo.postName}}</el-col>
          <el-col :span="3" class="height26">所属地区：</el-col>
          <el-col :span="5" class="height26">{{configSalaryUserInfo.workAreaName}}</el-col>
          <el-col :span="3" class="height26">员工类型：</el-col>
          <el-col :span="5" class="height26">{{configSalaryUserInfo.employeeType}}</el-col>
          <el-col :span="3" class="height26">学&nbsp;&nbsp;&nbsp;&nbsp;历：</el-col>
          <el-col :span="5" class="height26">{{configSalaryUserInfo.educationName}}</el-col>
        </el-row>
      </div>
      <div class="whiteBox">
        <p class="pReset">配置</p>
        <el-form :model="sendLetterform" :rules="sendLetterformRule" ref="sendLetterform" label-width="150px">
          <el-row>
            <el-col :md="9">
              <el-form-item label="基础总额：" prop="totalAmount">
                <el-input-number :controls="false" v-model="sendLetterform.totalAmount" style="width:120px" :min="0" :max="10000000"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :md="3">
              <el-form-item prop="isAfterTax" label-width="50px">
                <el-checkbox v-model="sendLetterform.isAfterTax">税后</el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="基本工资：" prop="basicSalary">
                <el-input-number :controls="false" v-model="sendLetterform.basicSalary" style="width:200px" :min="0" :max="10000000"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="保密补助：" prop="secretAllowance">
                <el-input-number :controls="false" v-model="sendLetterform.secretAllowance" style="width:200px" :min="0" :max="10000000"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="中餐补助：" prop="lunchAllowance">
                <el-input-number :controls="false" v-model="sendLetterform.lunchAllowance" style="width:200px" :min="0" :max="10000000"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="交通补助：" prop="trafficAllowance">
                <el-input-number :controls="false" v-model="sendLetterform.trafficAllowance" style="width:200px" :min="0" :max="10000000"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="电话补助：" prop="phoneAllowance">
                <el-input-number :controls="false" v-model="sendLetterform.phoneAllowance" style="width:200px" :min="0" :max="10000000"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="职务工资：" prop="dutySalary">
                <el-input-number :controls="false" v-model="sendLetterform.dutySalary" style="width:200px" :min="0" :max="10000000"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="加班工资：" prop="extraworkSalary">
                <el-input-number :controls="false" v-model="sendLetterform.extraworkSalary" style="width:200px" :min="0" :max="10000000"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-alert title="注意：配置之后将直接进入薪资总表" type="warning" :closable="false"> </el-alert>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="baseSalarySet = false">取消</el-button>
        <el-button type="primary" @click="submitWorkForm('sendLetterform',sendLetterform)">保存</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import tbMixin from "libs/mixin/tbMixin.js" //动态计算表格高度mixin
import { GET, POST } from "http/custom.js"
export default {
  name: 'summary-tables',
  mixins: [tbMixin],
  data() {
    return {
      t_height: 315, //减去的高度
      loading: false,//table加载动画开关
      current: 1,//当前页码
      pages: 0,//总页数
      size: 15,//每页显示记录条数
      total: 0,//总记录条数
      activeName: 'first',
      configSalaryUserInfo: {},
      baseSalarySet: false, //基础薪资设置 弹框内的数据
      functionFormSearch: {//搜索数据
        userName: '',
        mobilePhone: undefined,
        employedNo: undefined
      },
      noConfigTableData: [],
      sendLetterform: {
        extraworkSalary: undefined,
        isAfterTax: false,
        lunchAllowance: undefined,
        phoneAllowance: undefined,
        secretAllowance: undefined,
        totalAmount: undefined,
        trafficAllowance: undefined,
        basicSalary: undefined,
        dutySalary: undefined
      },
      sendLetterformRule: {
        totalAmount: [{ required: true, message: "请填写基础总额", trigger: "blur" }],
        basicSalary: [{ required: true, message: "请填写基本工资", trigger: "blur" }],
        secretAllowance: [{ required: true, message: "请填写保密补助", trigger: "blur" }],
        lunchAllowance: [{ required: true, message: "请填写中餐补助", trigger: "blur" }],
        trafficAllowance: [{ required: true, message: "请填写交通补助", trigger: "blur" }],
        phoneAllowance: [{ required: true, message: "请填写电话补助", trigger: "blur" }],
        dutySalary: [{ required: true, message: "请填写职务工资", trigger: "blur" }],
        extraworkSalary: [{ required: true, message: "请填写加班工资", trigger: "blur" }]
      },
      personalInfoData: {}//姓名popover弹窗数据
    }
  },
  methods: {
    search(Obj = {}) {
      //qianjun 列表查询
      let searchObjInit = {//查询对象
        "current": this.current,
        "size": this.size,
        "userName": this.functionFormSearch.userName,
        "employedNo": this.functionFormSearch.employedNo,
        "mobilePhone": this.functionFormSearch.mobilePhone
      }
      let searchObjTotal = { ...searchObjInit, ...Obj }
      this.loading = true //开启动画
      POST(process.env.VUE_APP_DOMAIN_personnel + '/configSalaryUserInfoVOs', searchObjTotal).then(res => {
        this.loading = false //关闭动画
        this.noConfigTableData = res.data.records//set表格的值
        this.current = res.data.current //set当前页
        this.pages = res.data.pages //总记录条数
        this.size = res.data.size //每页显示记录条数
        this.total = res.data.total //总记录条数
      }).catch(error => {
        console.log(error)
      })
    },
    // qianjun 根据员工编号获取个人信息
    getUserInfo(num) {
      GET(process.env.VUE_APP_DOMAIN_personnel + '/userInfo', { aid: num }).then(res => {//查询薪资类型模板
        console.log(res.data);
        this.personalInfoData = res.data
        this.personalInfoData.employedDates = this.personalInfoData.employedDates.split(" ")[0];
      }).catch(error => {
        console.log(error)
      })
    },
    // qianjun 根据员工编号匹配员工基础模板
    configSalary(num) {
      GET(process.env.VUE_APP_DOMAIN_personnel + '/configSalaryUserInfoVO', { aid: num }).then(res => {//查询薪资类型模板
        console.log(res.data);
        this.configSalaryUserInfo = res.data;
        this.baseSalarySet = true;
      }).catch(error => {
        console.log(error)
      })
    },
    // qianjun 新增职能序列基础薪资
    submitWorkForm(formName, form) {
      let _this = this
      this.$refs[formName].validate(valid => {
        if (valid) {//表单自带验证通过
          var totalNum = form.extraworkSalary + form.lunchAllowance + form.phoneAllowance + form.secretAllowance + form.trafficAllowance + form.basicSalary + form.dutySalary;
          //console.log(totalNum);
          if (totalNum == form.totalAmount) {//金额相等
            var configObjTotal = _this.configSalaryUserInfo;//需提交的配置信息
            configObjTotal.totalAmount = form.totalAmount;
            configObjTotal.extraworkSalary = form.extraworkSalary;
            configObjTotal.lunchAllowance = form.lunchAllowance;
            configObjTotal.phoneAllowance = form.phoneAllowance;
            configObjTotal.secretAllowance = form.secretAllowance;
            configObjTotal.trafficAllowance = form.trafficAllowance;
            configObjTotal.basicSalary = form.basicSalary;
            configObjTotal.dutySalary = form.dutySalary;
            configObjTotal.isAfterTax = form.isAfterTax ? 1 : 0;
            //console.log(configObjTotal);
            POST(process.env.VUE_APP_DOMAIN_personnel + '/functionSalary', configObjTotal).then(res => {
              console.log(res);
              this.$message({
                type: 'success',
                message: '保存数据成功!',
                showClose: true
              })
              _this.search();
              _this.baseSalarySet = false;
            }).catch(error => {
              console.log(error)
            })
          } else {
            this.$message({
              showClose: true,
              type: 'fail',
              message: '输入金额不对等，验证不通过'
            })
          }
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
    handleSizeChange(val) {//每页显示多少条数据切换
      this.size = val
      this.search()
    },
    handlecurrentChange(val) {//点击页码，当前页
      this.current = val
      this.search()
    },
    JS_search() {
      this.current = 1 //点击搜索current=1搜索第一页
      this.search()
    }
  },
  created() {
    //mock
    // GET('/api/getNoConfigTableData').then(res=>{
    //   this.noConfigTableData = res.dataTable
    // }).catch(error=>{
    //     console.log(error)
    // })
    this.search()
  }
}
</script>
<style scoped>
</style>
