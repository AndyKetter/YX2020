<template>
  <div class="adjustMoneyManage">
    <div class="guide">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home/personnelSystem' }">人事系统</el-breadcrumb-item>
        <el-breadcrumb-item>孝敬费管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/personnelSystem' }">(返回上级)</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="bgWhite mgt15">
      <!-- 查询栏 start -->
      <el-tabs v-model="activeName" type="border-card" :before-leave="tabsClick">
        <el-tab-pane label="孝敬费预存名单" name="first">
          <div class="clearfix">
            <div class="pull-left">
              <el-form :inline="true" class="mar-no">
                <el-form-item label="姓名">
                  <el-input @keyup.enter.native="inputEnter1" clearable v-model="userName1" placeholder="请输入姓名" class="width155"></el-input>
                </el-form-item>
                <el-form-item label="员工编号">
                  <el-input @keyup.enter.native="inputEnter1" clearable v-model="employedNo1" placeholder="员工编号" class="width155"></el-input>
                </el-form-item>
                <el-form-item label="年月">
                  <el-date-picker v-model="searchYM1" type="month" value-format="yyyy-MM" :editable="false" :clearable="false" class="width155" placeholder="选择年月">
                  </el-date-picker>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="el-icon-search" @click="JS_search_1">搜索</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="pull-right">
              <el-dropdown @command="handleCommand" trigger="click">
                <el-button type="primary">
                  更多操作
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="a" :disabled="isLockFlag" class="cloud-uploadBtn">
                    <i></i>&nbsp;生成数据
                  </el-dropdown-item>
                  <el-dropdown-item command="b" divided class="cloud-downloadBtn">
                    <i></i>&nbsp;导出
                  </el-dropdown-item>
                  <el-dropdown-item command="c" divided><i class="el-icon-refresh"></i>重置提交</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>&nbsp;
              <el-button size="small" type="danger" v-if="isLockFlag===false" @click="JS_report_data">上报数据</el-button>
              <el-button size="small" v-if="isLockFlag===true" @click="JS_cancel_report">取消上报</el-button>
            </div>
          </div>
          <div class="deductionsDetail">
            <el-row class="detailWrap">
              <el-col :span="8"><span class="detailTxt">当月孝敬费预存总人数：</span><span class="detailNum">{{this.filialCostTotalCount1}}</span></el-col>
              <el-col :span="8"><span class="detailTxt">当月累计个人预存总金额：</span><span class="detailNum">{{this.filialCostTotalMoney1 | toThousands}}</span></el-col>
            </el-row>
          </div>
          <div class="table_wrap">
            <el-table v-loading="loading1" :height="tabHeight" :data="filialPietyPrestoreFeeData" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
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
              <el-table-column label="员工编号" min-width="120">
                <template slot-scope="scope">
                  <span>{{scope.row.employedNo}}</span><i class="el-icon-phone tbIconPhone"></i>
                </template>
              </el-table-column>
              <el-table-column prop="employedDates" label="入职日期" min-width="160"></el-table-column>
              <el-table-column prop="formalDatetime" label="转正日期" min-width="160"></el-table-column>
              <el-table-column prop="userStatus" label="在职状态" min-width="100"></el-table-column>
              <el-table-column prop="workingHours" label="当月应出勤时长" min-width="120"></el-table-column>
              <el-table-column prop="actualWorkingHours" label="当月实际出勤时长" min-width="130"></el-table-column>
              <el-table-column label="当月个人预存金额" min-width="130">
                <template slot-scope="scope">
                  {{scope.row.prePersonMoney | toThousands}}
                </template>
              </el-table-column>
              <el-table-column label="当月公司预付金额" min-width="130">
                <template slot-scope="scope">
                  {{scope.row.preCompanyMoney | toThousands}}
                </template>
              </el-table-column>
              <el-table-column prop="storeDate" label="缴存年月" min-width="100"></el-table-column>
              <el-table-column min-width="170">
                <template slot="header">
                  <el-select v-model="commitStateValue" filterable placeholder="提交状态" clearable style="width:150px;" @change="commitStateChange" class="selectRepairIcon">
                    <el-option v-for="item in commitStateOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </template>
                <template slot-scope="scope">
                  <span style="color:#EF3838;" v-if="scope.row.commitState=='0'">未提交</span>
                  <span v-if="scope.row.commitState=='1'">已提交</span>
                  <span style="color:#EF3838;" v-if="scope.row.commitState=='2'">
                    <el-tooltip v-if="scope.row.errorMsg" class="item" effect="dark" :content="scope.row.errorMsg" placement="top">
                      <span>提交失败</span>
                    </el-tooltip>
                    <span v-else>
                      提交失败
                    </span>
                  </span>
                  <span v-if="scope.row.commitState=='3'">忽略提交</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" min-width="200" fixed="right">
                <template slot-scope="scope">
                  <el-button :disabled="isLockFlag" type="text" size="small" @click="prestore(scope.row.id)">退回预存</el-button>
                  <el-button v-if="scope.row.commitState=='2'" type="text" size="small" :disabled="isLockFlag" @click="ignoreSubmit(scope.row.id,'ignoreCommitState','忽略')">忽略提交</el-button>
                  <el-button v-if="scope.row.commitState=='3'" type="text" size="small" :disabled="isLockFlag" @click="ignoreSubmit(scope.row.id,'unIgnoreCommitState','取消忽略')">取消忽略</el-button>
                </template>
              </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div id="pagination">
              <el-pagination @size-change="handleSizeChange1" @current-change="handlecurrentChange1" background :current-page="current1" :page-sizes="[10,15,20,30,40]" :page-size="size1" layout="total,sizes,prev,pager,next,jumper" :total="total1">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="孝敬费退回名单" name="second">
          <div class="clearfix">
            <div class="pull-left">
              <el-form :inline="true" class="mar-no">
                <el-form-item label="姓名">
                  <el-input @keyup.enter.native="inputEnter2" clearable v-model="userName2" placeholder="请输入姓名" class="width155"></el-input>
                </el-form-item>
                <el-form-item label="员工编号">
                  <el-input @keyup.enter.native="inputEnter2" clearable v-model="employedNo2" placeholder="员工编号" class="width155"></el-input>
                </el-form-item>
                <el-form-item label="年月">
                  <el-date-picker v-model="searchYM2" type="month" value-format="yyyy-MM" :editable="false" :clearable="false" class="width155" placeholder="选择年月">
                  </el-date-picker>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="el-icon-search" @click="JS_search_2">搜索</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="pull-right">
              <el-button type="primary" @click="syncData">同步数据</el-button>
              <el-button @click="exportData2" size="small" slot="reference"><i class="el-icon-upload2"></i>&nbsp;导出</el-button>
              <!-- <el-button type="danger">提交数据</el-button> -->
            </div>
          </div>
          <div class="deductionsDetail">
            <el-row class="detailWrap">
              <el-col :span="8"><span class="detailTxt">当月孝敬费退回总人数：</span><span class="detailNum">{{this.filialCostTotalCount2}}</span></el-col>
              <el-col :span="8"><span class="detailTxt">当月累计退回总金额：</span><span class="detailNum">{{this.filialCostTotalMoney2 | toThousands}}</span></el-col>
            </el-row>
          </div>
          <div class="table_wrap">
            <el-table v-loading="loading2" :height="tabHeight" :data="filialPietyBackFeeData" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
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
              <el-table-column label="员工编号" min-width="120">
                <template slot-scope="scope">
                  <span>{{scope.row.employedNo}}</span><i class="el-icon-phone tbIconPhone"></i>
                </template>
              </el-table-column>
              <el-table-column prop="employedDates" label="入职日期" min-width="160"></el-table-column>
              <el-table-column prop="formalDatetime" label="转正日期" min-width="160"></el-table-column>
              <el-table-column prop="userStatus" label="在职状态" min-width="100"></el-table-column>
              <el-table-column prop="leaveJobDatetime" label="离职日期" min-width="160"></el-table-column>
              <el-table-column label="累计已预存月数" min-width="120">
                <template slot-scope="scope">
                  <el-popover v-if="scope.row.totalMonthCount" trigger="click" placement="top" width="450" @show="getFilialCostDetails(scope.row.id)">
                    <!-- S -->
                    <FilialCostDetail :filialCostInfo="filialCostData" :year="scope.row.storeDate | subDateYear"></FilialCostDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.totalMonthCount}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="个人累计已预存金额" min-width="140">
                <template slot-scope="scope">
                  {{scope.row.prePersonTotalMoney | toThousands}}
                </template>
              </el-table-column>
              <el-table-column label="同步状态" min-width="100">
                <template slot-scope="scope">
                  <span v-if="scope.row.syncState == 1">已同步</span>
                  <span style="color:#EF3838;" v-else>未同步</span>
                </template>
              </el-table-column>
              <el-table-column prop="storeDate" label="退回年月" min-width="100"></el-table-column>
            </el-table>
            <!-- 分页 -->
            <div id="pagination">
              <el-pagination @size-change="handleSizeChange2" @current-change="handlecurrentChange2" background :current-page="current2" :page-sizes="[10,15,20,30,40]" :page-size="size2" layout="total,sizes,prev,pager,next,jumper" :total="total2">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>

        <!-- 孝敬费年度报表 -->
        <el-tab-pane label="孝敬费年度报表" name="third">
          <div class="clearfix">
            <div class="pull-left">
              <el-form :inline="true" class="mar-no">
                <el-form-item label="姓名">
                  <el-input @keyup.enter.native="inputEnter3" clearable v-model="userName3" placeholder="请输入姓名" class="width155"></el-input>
                </el-form-item>
                <el-form-item label="员工编号">
                  <el-input @keyup.enter.native="inputEnter3" clearable v-model="employedNo3" placeholder="员工编号" class="width155"></el-input>
                </el-form-item>
                <el-form-item label="年份">
                  <el-date-picker v-model="searchYM3" type="year" class="width155" value-format="yyyy" :editable="false" :clearable="false" placeholder="选择年">
                  </el-date-picker>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="el-icon-search" @click="JS_search_3">搜索</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="pull-right">
              <el-button size="small" slot="reference" @click="exportData3"><i class="el-icon-upload2"></i>&nbsp;导出</el-button>
            </div>
          </div>
          <div class="deductionsDetail">
            <el-row class="detailWrap">
              <el-col :span="6"><span class="detailTxt">年度孝敬费预存总人数：</span><span class="detailNum">{{this.yearPayCount}}</span></el-col>
              <el-col :span="6"><span class="detailTxt">年度孝敬费个人预存总额：</span><span class="detailNum">{{this.yearPersonTotalMoney | toThousands}}</span></el-col>
              <el-col :span="6"><span class="detailTxt">年度离职退回总人数：</span><span class="detailNum">{{this.yearBackCount}}</span></el-col>
              <el-col :span="6"><span class="detailTxt">年度公司支付预总额：</span><span class="detailNum">{{this.yearCompanyTotalMoney | toThousands}}</span></el-col>
            </el-row>
          </div>
          <div class="table_wrap">
            <el-table v-loading="loading3" :height="tabHeight" :data="filialPietyYearFeeData" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
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
              <el-table-column label="员工编号" min-width="120">
                <template slot-scope="scope">
                  <span>{{scope.row.employedNo}}</span><i class="el-icon-phone tbIconPhone"></i>
                </template>
              </el-table-column>
              <el-table-column prop="employedDates" label="入职日期" min-width="160"></el-table-column>
              <el-table-column prop="formalDatetime" label="转正日期" min-width="160"></el-table-column>
              <el-table-column prop="userStatus" label="在职状态" min-width="100"></el-table-column>
              <el-table-column prop="leaveJobDatetime" label="离职日期" min-width="160"></el-table-column>
              <el-table-column min-width="170">
                <template slot="header">
                  <el-select v-model="processingStateValue" filterable placeholder="处理状态" clearable style="width:150px;" @change="handleStatusChange" class="selectRepairIcon">
                    <el-option v-for="item in handleStatusOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </template>
                <template slot-scope="scope">
                  <span style="color:#EF3838;" v-if="scope.row.handleStatus === 0">待发放</span>
                  <span v-if="scope.row.handleStatus === 1">已发放</span>
                  <span style="color:#EF3838;" v-if="scope.row.handleStatus === 2">已退回</span>
                </template>
              </el-table-column>
              <el-table-column label="累计已预存月数" min-width="120">
                <template slot-scope="scope">
                  <el-popover v-if="scope.row.totalMonthCount" trigger="click" placement="top" width="450" @show="getFilialCostDetails(scope.row.id)">
                    <!-- S -->
                    <FilialCostDetail :filialCostInfo="filialCostData" :year="scope.row.storeDate | subDateYear"></FilialCostDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.totalMonthCount}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="个人累计已预存金额" min-width="140">
                <template slot-scope="scope">
                  {{scope.row.prePersonTotalMoney | toThousands}}
                </template>
              </el-table-column>
              <el-table-column label="公司累计预付金额" min-width="140">
                <template slot-scope="scope">
                  {{scope.row.preCompanyTotalMoney | toThousands}}
                </template>
              </el-table-column>
              <el-table-column label="合计金额" min-width="120">
                <template slot-scope="scope">
                  {{scope.row.sumMoney | toThousands}}
                </template>
              </el-table-column>
              <el-table-column label="统计年份" min-width="100">
                <template slot-scope="scope">
                  {{scope.row.storeDate | repairEmpty | subDateYear}}
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div id="pagination">
              <el-pagination @size-change="handleSizeChange3" @current-change="handlecurrentChange3" background :current-page="current3" :page-sizes="[10,15,20,30,40]" :page-size="size3" layout="total,sizes,prev,pager,next,jumper" :total="total3">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>

      </el-tabs>
    </div>
    <!-- 退回预存弹框 -->
    <el-dialog title="温馨提示" :before-close="handleClose" :visible.sync="prestoreVisible" width="600px" :close-on-click-modal="false">
      <div>尊敬的管理员，您正在进行预存名单人员调整操作，一经操作成功，视为该员工将退回个人孝敬费预存费用，为确保您当前操作无误，请仔细核对并填写调整原因后再进行操作！</div>
      <div class="mgt10">
        <el-form :model="prestoreForm" :rules="prestoreFormRules" ref="prestoreForm" label-width="100px">
          <el-form-item label="调整原因：" prop="adjustReason">
            <el-input type="textarea" v-model.trim="prestoreForm.adjustReason" :rows="4"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="JS_cancel('prestoreForm')">取消</el-button>
        <el-button type="primary" @click="JS_add_save('prestoreForm')" v-no-more-click>保存</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import Tools from 'untils/index.js'
import { GET, POST, DELETE, PUT } from "http/custom.js"
import tbMixin from "libs/mixin/tbMixin.js" //动态计算表格高度mixin
import FilialCostDetail from "components/filialPietyFee/FilialCostDetail" //导入孝敬费累计已存年月详情弹框
export default {
  name: 'filialPietyFee',
  mixins: [tbMixin],
  components: {
    FilialCostDetail
  },
  data() {
    const _searchYM3 = new Date().getFullYear() + '' //当前年，必须要转string,不然报错
    let Ytd = Tools.getPYd() //获取当前年，上月 格式为 2019-05
    return {
      t_height: 395, //减去的高度
      filialCostData: [], //预缴详情
      commitStateOptions: [//提交状态
        {
          value: '0',
          label: '未提交'
        }, {
          value: '1',
          label: '已提交'
        }
        , {
          value: '2',
          label: '提交失败'
        },
        {
          value: '3',
          label: '忽略提交'
        }
      ],
      commitStateValue: '',//处理状态值
      handleStatusOptions: [
        {
          value: 0,
          label: '待发放'
        }, {
          value: 1,
          label: '已发放'
        }
        , {
          value: 2,
          label: '已退回'
        }
      ],
      isLockFlag: false, //判断数据是否上锁
      activeName: 'first',
      personalInfoData: {}, //姓名popover弹窗数据
      //孝敬费预存名单start
      current1: 1,//当前页码
      size1: 15,//每页显示记录条数
      loading1: false,//table加载动画开关
      searchYM1: Ytd,//查询年月
      userName1: '',//姓名
      employedNo1: '',//员工编号
      total1: 0,//总记录条数
      prestoreVisible: false,//驳回弹框
      prestoreId: '',//驳回id
      filialCostTotalCount1: '',//当月孝敬费预存总人数
      filialCostTotalMoney1: '',//当月累计个人预存总金额
      prestoreForm: {
        adjustReason: ''//调整原因
      },
      prestoreFormRules: {
        adjustReason: [//调整原因
          { required: true, message: "请填写调整原因", trigger: "blur" },
          { min: 0, max: 100, message: '不能超过100个字符', trigger: 'blur' }
        ]
      },
      filialPietyPrestoreFeeData: [],//孝敬费预存名单
      // ----孝敬费预存名单end------

      //孝敬费退回名单start
      current2: 1,//当前页码
      size2: 15,//每页显示记录条数
      loading2: false,//table加载动画开关
      searchYM2: Ytd,//查询年月
      userName2: '',//姓名
      employedNo2: '',//员工编号
      total2: 0,//总记录条数
      filialCostTotalCount2: '',//当月孝敬费预存总人数
      filialCostTotalMoney2: '',//当月累计个人预存总金额
      filialPietyBackFeeData: [], //孝敬费退回名单
      // ----孝敬费退回名单end------

      //孝敬费年度报表start
      yearFeeHasClicked: false, //孝敬费年度tabs是否被点击过
      processingStateValue: '',//处理状态
      current3: 1,//当前页码
      size3: 15,//每页显示记录条数
      loading3: false,//table加载动画开关
      searchYM3: _searchYM3,//查询年月
      userName3: '',//姓名
      employedNo3: '',//员工编号
      total3: 0,//总记录条数
      yearPayCount: '',//年度孝敬费预存总人数
      yearBackCount: '',//年度离职退回总人数
      yearPersonTotalMoney: '',//年度孝敬费个人预存总额
      yearCompanyTotalMoney: '',//年度公司支付预总额
      filialPietyYearFeeData: [] //孝敬费年度报表
      // ----孝敬费年度报表end------
    }
  },
  methods: {
    tabsClick(activeName, oldActiveName) {//切换标签之前的钩子，若返回 false 或者返回 Promise 且被 reject，则阻止切换。
      if (activeName == 'second') {//点击孝敬费退回名单tabs
        this.search2() //孝敬费退回名单列表查询初始化
        this.searchFilialCost2() //孝敬费退回名单-月孝敬费统计
      }
      // ------------------------------------------
      if (activeName == 'third' && this.yearFeeHasClicked === false) {//点击孝敬费年度报表tabs
        this.yearFeeHasClicked = true //标记已点击过，不能二次点击触发请求
        this.search3() //年度列表查询初始化
        this.searchFilialCost3() //年度-月孝敬费统计
      }
    },
    inputEnter1() { // 文本框的enter事件
      this.JS_search_1()
    },
    handleClose() { //新增关闭icon
      this.prestoreVisible = false //隐藏弹框
      this.reset('prestoreForm')
    },
    //根据员工编号获取个人信息
    getUserInfo(num) {
      GET(process.env.VUE_APP_DOMAIN_personnel + "/userInfo", { aid: num }).then(res => {
        //查询薪资类型模板
        console.log(res.data)
        this.personalInfoData = res.data
        this.personalInfoData.employedDates = this.personalInfoData.employedDates.split(" ")[0]
      }).catch(error => {
        console.log(error)
      })
    },
    //获取预缴详情
    getFilialCostDetails(id) {
      GET(process.env.VUE_APP_DOMAIN_personnel + "/getFilialCostDetails", { id }).then(res => {
        //获取预缴详情
        this.filialCostData = res.data
      }).catch(error => {
        console.log(error)
      })
    },
    exportData1() {
      //孝敬费预存名单导出
      window.location.href = process.env.VUE_APP_DOMAIN_personnel + '/exportPrestoredData?userName=' + this.userName1 + '&employeeNo=' + this.employedNo1 + '&batch=' + this.searchYM1 + '&token=' + localStorage.getItem('token')
    },
    exportData2() {
      //孝敬费退回名单导出
      window.location.href = process.env.VUE_APP_DOMAIN_personnel + '/exportBackData?userName=' + this.userName2 + '&employeeNo=' + this.employedNo2 + '&batch=' + this.searchYM2 + '&token=' + localStorage.getItem('token') //window.location.href方式打开二进制文件下载文件
    },
    exportData3() {
      //孝敬费年度报表导出
      window.location.href = process.env.VUE_APP_DOMAIN_personnel + '/exportYearReportData?userName=' + this.userName3 + '&employeeNo=' + this.employedNo3 + '&year=' + this.searchYM3 + '&token=' + localStorage.getItem('token') //window.location.href方式打开二进制文件下载文件
    },
    // -------------孝敬费预存名单start-----------------
    makeData() {
      //生成数据按钮
      if (this.searchYM1 == '') { //如果没选择年月
        this.$message({
          type: 'warning',
          message: '请选择年月!',
          showClose: true
        })
      } else {
        const loading = this.$loading({//上报数据，锁定页面loading
          lock: true,
          text: '正在生成数据，请稍等片刻',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        GET(process.env.VUE_APP_DOMAIN_personnel + '/createFilialCost', { "yearMonth": this.searchYM1 }).then(res => {
          console.log('生成数据', res)
          loading.close() //关闭loading
          this.$message({
            type: 'success',
            message: '生成数据成功!',
            showClose: true
          })
          this.JS_search_1() //刷新表格 携带页码
        }).catch(error => {
          loading.close() //关闭loading
          console.log(error)
        })
      }
    },
    JS_search_1() {//孝敬费预存名单搜索
      this.current1 = 1 //点击搜索current1=1搜索第一页
      this.search1()
      this.searchFilialCost1() //查询孝敬费预存名单-月孝敬费统计
    },
    searchFilialCost1() {//月孝敬费统计-预存名单
      GET(process.env.VUE_APP_DOMAIN_personnel + '/getFilialCostByMonth', { "yearMonth": this.searchYM1 || '', "type": 1 }).then(res => {
        console.log('月孝敬费统计', res)
        this.filialCostTotalMoney1 = res.data.filialCostTotalMoney
        this.filialCostTotalCount1 = res.data.filialCostTotalCount
      }).catch(error => {
        console.log(error)
      })
    },
    commitStateChange() {//表头提交状态select
      this.JS_search_1()//搜索提交状态
    },
    ignoreSubmit(id, ajaxUrl, msg) {//忽略,取消忽略上报
      //单个忽略,取消忽略上报
      this.$msgBox
        .confirm(`你确定要${msg}上报该条数据吗?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          GET(process.env.VUE_APP_DOMAIN_personnel + `/${ajaxUrl}`, { id })
            .then(res => {
              //单条忽略,取消忽略上报
              this.$message({
                type: "success",
                message: `${msg}上报成功!`
              })
              this.search_1() //刷新表格，重新获取数据
            })
            .catch(error => {
              console.log(error)
            })
        })
        .catch(() => {

        })
    },
    handleCommand(command) {
      //更多操作下拉框
      if (command == "a") {
        this.makeData() //生成数据
      }
      if (command == "b") {
        //导出
        this.exportData1();
      }
      if (command == "c") {
        this.resetSubmit() //重置提交
      }
    },
    messagePopp(type, msg) {//提示框
      this.$message({
        showClose: true,
        type: type,
        message: msg
      });
    },
    resetSubmit() { //重置数据 
      this.$msgBox.confirm(
        '<span>确定重置数据？</span>',
        "温馨提示",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        GET(process.env.VUE_APP_DOMAIN_personnel + "/resetSubmit",
          {
            batch: this.searchYM1
          }).then(res => {
            if (res.code === 0) {//重置成功
              this.messagePopp("success", "重置成功！")
              this.JS_search_1() //搜索并且判断数据是否上锁
            } else {
              // this.messagePopp("error", "重置失败！")
            }
          }).catch(error => {

          })
      }).catch(() => {
        console.log("失败");
      })
    },
    search1() {
      //mohan 孝敬费预存名单列表查询
      let searchObj = {//查询对象,在这里初始化,初始化值都是取this下面的
        "current": this.current1, //当前页码
        "size": this.size1, //每页显示记录条数
        "costType": 1, //预存type为1
        "storeDate": this.searchYM1 || '', //年月
        "userName": this.userName1, //姓名
        "employedNo": this.employedNo1, //员工编号
        "commitState": this.commitStateValue || '' //表头提交状态
      }
      console.log('孝敬费预存名单搜索对象', searchObj)
      this.loading1 = true //开启动画
      POST(process.env.VUE_APP_DOMAIN_personnel + '/filialCosts', searchObj).then(res => {
        console.log('预存名单', res)
        this.loading1 = false //关闭动画
        this.filialPietyPrestoreFeeData = res.data.records //set表格的值
        this.current1 = res.data.current //set当前页
        this.size1 = res.data.size //每页显示记录条数
        this.total1 = res.data.total //总记录条数
      }).catch(error => {
        console.log(error)
      })
      this.isLock() //判断数据是否上锁
    },
    handleSizeChange1(val) {
      this.size1 = val //保存状态-每页显示多少条数据切换
      this.search1()
    },
    handlecurrentChange1(val) {
      this.current1 = val //保存状态-当前页
      this.search1()
    },
    reset(formName) {//清除表单
      this.$refs[formName].resetFields()
    },
    JS_cancel(formName) {//取消
      this.prestoreVisible = false //隐藏弹框
      this.reset(formName)
    },
    JS_add_save(formName) { //保存
      this.$refs[formName].validate(valid => {
        if (valid) {
          let saveObj = { id: parseInt(this.prestoreId), adjustReason: this.prestoreForm.adjustReason } //保存对象
          console.log('保存对象', saveObj)
          PUT(process.env.VUE_APP_DOMAIN_personnel + '/backFilialCost', saveObj).then(res => {
            this.$message({
              type: 'success',
              message: '驳回成功!',
              showClose: true
            })
            this.prestoreVisible = false //驳回弹框
            this.reset(formName)
            this.JS_search_1() //刷新表格，重新获取数据
          }).catch(error => {
            console.log(error)
          })
        } else {
          this.$message({
            showClose: true,
            type: 'warning',
            message: '提交失败，验证不通过'
          })
          return false
        }
      })
    },
    prestore(id) {//退回预存
      this.prestoreId = id //存储驳回id
      this.prestoreVisible = true
    },
    isLock() {//判断数据是否上锁
      GET(process.env.VUE_APP_DOMAIN_personnel + "/checkPrestoredDataLock", { batch: this.searchYM1 }).then(res => {
        console.log("判断数据是否上锁", res)
        this.isLockFlag = res.data
      }).catch(error => {
        console.log(error)
      })
    },
    JS_report_data() {
      //上报数据
      this.$msgBox.confirm(
        '<span>请确认你上传的' + this.searchYM1 + '月份</span><span style="color:red;">【孝敬费预存名单】</span><span>无误，确认提交后，将直接影响工资准确发放。</span>',
        "温馨提示",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        const loading = this.$loading({//上报数据，锁定页面loading
          lock: true,
          text: '正在上报数据，请稍等片刻',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        POST(process.env.VUE_APP_DOMAIN_personnel + "/reportPrestoredData", { batch: this.searchYM1 }).then(res => {
          console.log("上报数据", res)
          loading.close() //关闭loading
          this.$message({
            type: "success",
            message: "上报数据成功！"
          })
          this.search1() //搜索并且判断数据是否上锁
        }).catch(error => {
          loading.close() //关闭loading
          console.log(error)
        })
      }).catch(() => {

      })
    },
    JS_cancel_report() {
      //取消上报
      this.$msgBox.confirm(
        '<span>确定取消上报数据？</span>',
        "温馨提示",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        GET(process.env.VUE_APP_DOMAIN_personnel + "/unlockPrestoredData", { batch: this.searchYM1 }).then(res => {
          console.log("取消上报", res)
          this.$message({
            type: "success",
            message: "取消上报数据成功！"
          })
          this.search1() //搜索并且判断数据是否上锁
        }).catch(error => {
          console.log(error)
        })
      }).catch(() => {

      })
    },
    // -------------孝敬费预存名单end-----------------

    // -------------孝敬费退回名单start-----------------
    inputEnter2() { // 文本框的enter事件
      this.JS_search_2()
    },
    JS_search_2() {//搜索
      this.current2 = 1 //点击搜索current1=1搜索第一页
      this.search2()
      this.searchFilialCost2() //查询孝敬费退回名单-月孝敬费统计
    },
    syncData() {//同步数据
      if (this.searchYM2 == '') { //如果没选择年月
        this.$message({
          type: 'warning',
          message: '请选择年月!',
          showClose: true
        })
      } else {
        const loading = this.$loading({//上报数据，锁定页面loading
          lock: true,
          text: '正在同步数据，请稍等片刻',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        GET(process.env.VUE_APP_DOMAIN_personnel + '/syncData', { "yearMonth": this.searchYM2 }).then(res => {
          console.log('同步数据', res)
          loading.close() //关闭loading
          this.$message({
            type: 'success',
            message: '同步数据成功!',
            showClose: true
          })
          this.search2() //刷新列表
        }).catch(error => {
          loading.close() //关闭loading
          console.log(error)
        })
      }
    },
    searchFilialCost2() {//月孝敬费统计
      GET(process.env.VUE_APP_DOMAIN_personnel + '/getFilialCostByMonth', { "yearMonth": this.searchYM2 || '', "type": 2 }).then(res => {
        console.log('月孝敬费统计', res)
        this.filialCostTotalMoney2 = res.data.filialCostTotalMoney
        this.filialCostTotalCount2 = res.data.filialCostTotalCount
      }).catch(error => {
        console.log(error)
      })
    },
    search2() {
      //mohan 孝敬费退回名单列表查询
      let searchObj = {//查询对象,在这里初始化,初始化值都是取this下面的
        "current": this.current2, //当前页码
        "size": this.size2, //每页显示记录条数
        "costType": 2, //退回type为2
        "storeDate": this.searchYM2 || '', //年月
        "userName": this.userName2, //姓名
        "employedNo": this.employedNo2 //员工编号
      }
      console.log('孝敬费退回名单搜索对象', searchObj)
      this.loading2 = true //开启动画
      POST(process.env.VUE_APP_DOMAIN_personnel + '/filialCosts', searchObj).then(res => {
        console.log('退回名单', res)
        this.loading2 = false //关闭动画
        this.filialPietyBackFeeData = res.data.records //set表格的值
        this.current2 = res.data.current //set当前页
        this.size2 = res.data.size //每页显示记录条数
        this.total2 = res.data.total //总记录条数
      }).catch(error => {
        console.log(error)
      })
    },
    handleSizeChange2(val) {
      this.size2 = val //保存状态-每页显示多少条数据切换
      this.search2()
    },
    handlecurrentChange2(val) {
      this.current2 = val //保存状态-当前页
      this.search2()
    },
    //孝敬费退回名单end

    // -------------孝敬费年度报表start-----------------
    inputEnter3() { // 文本框的enter事件
      this.JS_search_3()
    },
    handleStatusChange() {//表头处理状态select
      this.JS_search_3()//搜索处理状态
    },
    JS_search_3() {//搜索
      this.current3 = 1 //点击搜索current1=1搜索第一页
      this.search3()
      this.searchFilialCost3() //查询孝敬费年度-月孝敬费统计
    },
    searchFilialCost3() {//孝敬费年度
      GET(process.env.VUE_APP_DOMAIN_personnel + '/getFilialCostByYear', { "year": this.searchYM3 }).then(res => {
        console.log('孝敬费年度', res)
        this.yearPayCount = res.data.yearPayCount
        this.yearBackCount = res.data.yearBackCount
        this.yearPersonTotalMoney = res.data.yearPersonTotalMoney
        this.yearCompanyTotalMoney = res.data.yearCompanyTotalMoney
      }).catch(error => {
        console.log(error)
      })
    },
    search3() {
      //mohan 孝敬费年度列表查询
      let startDate = this.searchYM3 + '-01' //开始时间
      let endDate = this.searchYM3 + '-12' //结束时间
      let searchObj = {//查询对象,在这里初始化,初始化值都是取this下面的
        "current": this.current3, //当前页码
        "size": this.size3, //每页显示记录条数
        "yearReportShow": true,//年度报表
        "startDate": startDate, //开始时间
        "endDate": endDate, //结束时间
        "userName": this.userName3, //姓名
        "employedNo": this.employedNo3, //员工编号
        "handleStatus": this.processingStateValue || '', //表头处理状态
      }
      console.log('孝敬费年度搜索对象', searchObj)
      this.loading3 = true //开启动画
      POST(process.env.VUE_APP_DOMAIN_personnel + '/filialCosts', searchObj).then(res => {
        console.log('年度列表对象', res)
        this.loading3 = false //关闭动画
        this.filialPietyYearFeeData = res.data.records //set表格的值
        this.current3 = res.data.current //set当前页
        this.size3 = res.data.size //每页显示记录条数
        this.total3 = res.data.total //总记录条数
      }).catch(error => {
        console.log(error)
      })
    },
    handleSizeChange3(val) {
      this.size3 = val //保存状态-每页显示多少条数据切换
      this.search3()
    },
    handlecurrentChange3(val) {
      this.current3 = val //保存状态-当前页
      this.search3()
    }
    // -------------孝敬费年度报表end-----------------
  },
  created() {
    // GET('/api/getFilialPietyPrestoreFeeData').then(res=>{//mock孝敬费预存名单
    //   this.filialPietyPrestoreFeeData = res.dataTable
    // }).catch(error=>{
    //     console.log(error)
    // })
    this.search1() //孝敬费预存名单列表查询初始化
    this.searchFilialCost1() //孝敬费预存名单-月孝敬费统计
    // GET('/api/getFilialPietyBackFeeData').then(res=>{//孝敬费退回名单 mock
    //   this.filialPietyBackFeeData = res.dataTable
    // }).catch(error=>{
    //     console.log(error)
    // })
    // GET('/api/getFilialPietyYearFeeData').then(res=>{//孝敬费年度报表 mock
    //   this.filialPietyYearFeeData = res.dataTable
    // }).catch(error=>{
    //     console.log(error)
    // })
  }
}
</script>

<style scoped>
.deductionsDetail {
  background-color: #e7e7e7 !important;
  padding: 15px;
  margin-bottom: 20px;
}
.detailWrap > div {
  padding: 5px;
}
.detailTxt {
  color: #60646c;
  font-size: 14px;
}
.detailNum {
  font-size: 16px;
  color: #000000;
}
</style>
