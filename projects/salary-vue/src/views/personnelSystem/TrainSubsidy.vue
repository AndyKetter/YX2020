<template>
  <div class="talent-table">
    <div class="guide">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home/personnelSystem' }">人事系统</el-breadcrumb-item>
        <el-breadcrumb-item>其它</el-breadcrumb-item>
        <el-breadcrumb-item>培训补助</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/personnelSystem' }">(返回上级)</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="bgWhite mgt15">
      <div class="pull-left">
        <el-form :inline="true" class="mar-no pull-left">
          <el-form-item label="所属年月">
            <el-date-picker v-model="batch" value-format="yyyy-MM" :clearable="false" :editable="false" type="month" class="width155" placeholder="选择年月"></el-date-picker>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model.trim="name" @keyup.enter.native="inputEnter" placeholder="请输入姓名" class="width155" clearable></el-input>
          </el-form-item>
          <el-form-item label="所属区域">
            <el-select v-model="workAreaId" placeholder="请选择" class="width155" filterable clearable>
              <el-option v-for="item in areaOptions" :key="item.areaId" :label="item.areaName" :value="item.areaId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="titleSerach" icon="el-icon-search">搜索</el-button>
            <el-button icon="el-icon-search" @click="search_more = true">更多查询</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 更多查询弹框 -->
      <el-dialog title="更多查询" :close-on-click-modal="false" :visible.sync="search_more" width="600px">
        <el-form :inline="true" class="mar-no" style="text-align:center">
          <el-form-item label="身份证号">
            <el-input v-model.trim="idCard" @keyup.enter.native="inputEnter" placeholder="请输入身份证号" style="width:200px" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="searchForImt">搜索导入未匹配数据</el-button>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="search_more = false">取消</el-button>
          <el-button type="primary" @click="titleSerach">立即搜索</el-button>

        </span>
      </el-dialog>

      <div class="pull-right">
        <el-dropdown @command="handleCommand" trigger="click">
          <el-button type="primary">
            更多操作<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="a" :disabled="isLockFlag" class="cloud-uploadBtn">
              <i></i>&nbsp;导入
            </el-dropdown-item>
            <el-dropdown-item command="b" divided class="cloud-downloadBtn">
              <i></i>&nbsp;导出
            </el-dropdown-item>
            <el-dropdown-item command="d" :disabled="isLockFlag" divided icon="el-icon-plus">新增</el-dropdown-item>
            <el-dropdown-item command="e" divided><i class="el-icon-refresh"></i>重置提交</el-dropdown-item>
            <el-dropdown-item command="c" :disabled="isLockFlag" divided>同步考勤</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>&nbsp;
        <el-button size="small" type="danger" v-if="isLockFlag===false" @click="JS_report_data">上报数据</el-button>
        <el-button size="small" v-if="isLockFlag===true" @click="JS_cancel_report">取消上报</el-button>
      </div>
      <div class="table_wrap">
        <el-table v-loading="loading" :height="t_height" :data="trainData" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
          <el-table-column type="index" label="序号" min-width="50"></el-table-column>
          <el-table-column prop="batch" label="所属年月" min-width="100"></el-table-column>
          <el-table-column label="姓名" prop="name" min-width="150">
            <template slot-scope="scope">
              <el-popover v-if="scope.row.aid" trigger="click" placement="top" width="450" @show="getUserInfo(scope.row.aid)">
                <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                <div slot="reference" class="name-wrapper">
                  <el-button size="mini">{{scope.row.name}}</el-button>
                </div>
              </el-popover>
              <span v-else>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="性别" min-width="50">
            <template slot-scope="scope">
              <span v-if="scope.row.gender === '0'">女</span>
              <span v-else-if="scope.row.gender === '1'">男</span>
              <span v-else></span>
            </template>
          </el-table-column>
          <el-table-column prop="idNumber" label="身份证号码" min-width="160"></el-table-column>
          <el-table-column prop="workAreaName" label="所属地区" min-width="200"></el-table-column>
          <el-table-column prop="postName" label="职务" min-width="100"></el-table-column>
          <el-table-column prop="trainingDays" label="培训天数" min-width="70"></el-table-column>
          <el-table-column label="补助费用" min-width="70">
            <template slot-scope="scope">{{scope.row.trainingAllowance | toThousands}}</template>
          </el-table-column>
          <el-table-column prop="attendanceMin" label="最低考勤" min-width="70"></el-table-column>
          <el-table-column prop="attendanced" label="已出勤" min-width="70"></el-table-column>
          <el-table-column label="发放状态" min-width="70">
            <template slot-scope="scope">
              <span style="color:red" v-if="scope.row.trainigStatus === 0">未满足</span>
              <span class="successTxt" v-else-if="scope.row.trainigStatus === 1">已满足</span>
              <span v-else-if="scope.row.trainigStatus === 2">已发放</span>
              <span v-else></span>
            </template>
          </el-table-column>
          <el-table-column prop="trainingDate" label="培训日期" min-width="100"></el-table-column>
          <el-table-column label="提交状态" min-width="170">
            <template slot="header">
              <el-select v-model="commitState" filterable placeholder="提交状态" clearable style="width:150px;" @change="searchSelect" class="selectRepairIcon">
                <el-option v-for="item in submitStates" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </template>
            <template slot-scope="scope">
              <span style="color:red;" v-if="scope.row.isConfirm === '0'">未提交</span>
              <span v-else-if="scope.row.isConfirm === '1'">已提交</span>
              <span style="color:red;" v-else-if="scope.row.isConfirm === '2'">
                <el-tooltip v-if="scope.row.reportMsg" class="item" effect="dark" :content="scope.row.reportMsg" placement="top">
                  <span>提交失败</span>
                </el-tooltip>
                <span v-else>
                  提交失败
                </span>
              </span>
              <span style="color:blue;" v-else-if="scope.row.isConfirm === '3'">忽略提交</span>
              <span v-else></span>
            </template>
          </el-table-column>
          <el-table-column prop="operation" label="操作" fixed="right" min-width="180">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="viewTrainSearch(scope.row.id)">查看</el-button>
              <!-- 当上报成功或提交为已提交状态时修改不可操作 -->
              <el-button type="text" size="small" :disabled="isJugeNewImport || scope.row.trainigStatus === 2 || scope.row.isConfirm === '1'" @click="updateThis(scope.row.id)">修改</el-button>
              <el-button type="text" size="small" :disabled="isJugeNewImport || scope.row.isConfirm === '1'" @click="deleteThis(scope.row.id)" class="deleteTxt">删除</el-button>
              <el-button v-if="scope.row.isConfirm==='2'" type="text" size="small" :disabled="isJugeNewImport" @click="ignoreSubmit(scope.row.id,2,'忽略')">忽略提交</el-button>
              <el-button v-if="scope.row.bsubmit==='3'" type="text" size="small" :disabled="isLockFlag" @click="ignoreSubmit(scope.row.id,3,'取消忽略')">取消忽略</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div id="pagination">
          <el-pagination @size-change="handleSizeChange" @current-change="handlecurrentChange" :current-page="current" background :page-sizes="[10,15,20,30,40]" :page-size="size" layout="total,sizes,prev,pager,next,jumper" :total="total"></el-pagination>
        </div>
      </div>
    </div>

    <!-- 查看培训补助信息 -->
    <el-dialog title="查看培训补助信息" :close-on-click-modal="false" :visible.sync="viewTrain" width="768px" class="grayBg">
      <div class="whiteBox">
        <p class="pReset">基本情况</p>
        <el-row class="textLft">
          <el-col :span="3" class="height26"><span class="ft">姓名</span>：</el-col>
          <el-col :span="5" class="height26">{{trainFormInfo.name}}</el-col>
          <el-col :span="3" class="height26"><span class="ft">性别</span>：</el-col>
          <el-col :span="5" class="height26">{{trainFormInfo.gender === 0?"男":"女" }}</el-col>
          <el-col :span="3" class="height26"><span class="ft">身份证号</span>：</el-col>
          <el-col :span="5" class="height26">{{trainFormInfo.idNumber}}</el-col>
          <el-col :span="3" class="height26"><span class="ft">手机号码</span>：</el-col>
          <el-col :span="5" class="height26">{{trainFormInfo.phoneNum}}</el-col>
          <el-col :span="3" class="height26"><span class="ft">培训天数</span>：</el-col>
          <el-col :span="5" class="height26">{{trainFormInfo.trainingDays}}</el-col>
          <el-col :span="3" class="height26"><span class="ft">补助费用</span>：</el-col>
          <el-col :span="5" class="height26">{{trainFormInfo.trainingAllowance | toThousands}}</el-col>
          <el-col :span="3" class="height26"><span class="ft">职务</span>：</el-col>
          <el-col :span="5" class="height26">{{trainFormInfo.postName}}</el-col>
          <el-col :span="3" class="height26"><span class="ft">培训日期</span>：</el-col>
          <el-col :span="5" class="height26">{{trainFormInfo.trainingDate}}</el-col>
          <el-col :span="3" class="height26"><span class="ft">最低考勤</span>：</el-col>
          <el-col :span="5" class="height26">{{trainFormInfo.attendanceMin}}</el-col>
          <el-col :span="3" class="height26"><span class="ft">已考勤</span>：</el-col>
          <el-col :span="5" class="height26">{{trainFormInfo.attendanced}}</el-col>
          <el-col :span="3" class="height26"><span class="ft">发放状态</span>：</el-col>
          <el-col :span="5" class="height26">
            <span style="color:red" v-if="trainFormInfo.trainigStatus === 0">未满足</span>
            <span class="successTxt" v-else-if="trainFormInfo.trainigStatus === 1">已满足</span>
            <span v-else-if="trainFormInfo.trainigStatus === 2">已发放</span>
            <span v-else></span>
          </el-col>
        </el-row>
      </div>
      <!-- 暂时不显示 -->
      <div class="whiteBox" v-if="false">
        <p class="pReset">工作记录</p>
        <table class="el-table--small fontsize14">
          <colgroup>
            <col width="20">
            <col width="130">
            <col>
          </colgroup>
          <tr>
            <td>1.</td>
            <td>2019-06-03 13:00</td>
            <td>
              由操作员
              <span class="dangerTxt">李芳</span>新增。
            </td>
          </tr>
          <tr>
            <td>2.</td>
            <td>2019-06-03 13:00</td>
            <td>
              由操作员
              <span class="dangerTxt">刘莉莉</span>修改。
            </td>
          </tr>
          <tr>
            <td>3.</td>
            <td>2019-06-03 13:00</td>
            <td>
              由操作员
              <span class="dangerTxt">李芳</span>删除。
            </td>
          </tr>
        </table>
      </div>
    </el-dialog>
    <!-- 修改 弹框 -->
    <!-- 新增培训补助 -->
    <el-dialog class="grayBg" :title="switchParam" :before-close="handleAddClose" :close-on-click-modal="false" :visible.sync="addTrainSubsidy" width="768px">
      <div class="whiteBox train-dialog">
        <el-form style="padding:20px 20px 0 20px" :model="addTrainSubsidyform" ref="addTrainSubsidyform" :rules="addTrainRule" label-width="150px">
          <el-row type="flex" class="row-bg" justify="center">
            <el-col :md="12">
              <el-form-item label="姓名：" prop="name" label-width="100px">
                <el-input v-model.trim="addTrainSubsidyform.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="14">
              <el-form-item label="性别：" prop="sex" label-width="140px">
                <el-radio v-model="addTrainSubsidyform.sex" label="1">男</el-radio>
                <el-radio v-model="addTrainSubsidyform.sex" label="0">女</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center">
            <el-col :md="12">
              <el-form-item label="身份证号：" prop="idNumber" label-width="100px">
                <el-input v-model="addTrainSubsidyform.idNumber"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="14">
              <el-form-item label="手机号码：" prop="phoneNum" label-width="140px">
                <!-- <el-input-number v-model.number="addTrainSubsidyform.phoneNum" :min="10000000000" :max="22222222222" :controls="false" style="width:215px"></el-input-number> -->
                <el-input v-model.number="addTrainSubsidyform.phoneNum"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center">
            <el-col :md="12">
              <el-form-item label="培训天数：" prop="days" label-width="100px">
                <el-input-number v-model.number="addTrainSubsidyform.days" :precision="0" :min="0" :max="10000000000" style="width:205px "></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :md="14">
              <el-form-item label="补助费用：" prop="payBalance" label-width="140px">
                <el-input-number v-model.number="addTrainSubsidyform.payBalance" :min="0" :max="10000000000" :controls="false" class="width215"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center">
            <el-col :md="12">
              <el-form-item label="工作区域：" prop="area" label-width="105px">
                <el-select filterable clearable v-model="addTrainSubsidyform.area" placeholder="请选择" style="width:205px">
                  <el-option v-for="item in areaOptions" :key="item.areaId" :label="item.areaName" :value="item.areaId"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="14">
              <el-form-item label="培训日期：" prop="date" label-width="140px">
                <el-date-picker type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" v-model="addTrainSubsidyform.date"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row type="flex" class="row-bg" justify="left">
            <el-col :md="12">
              <el-form-item label="职务：" prop="duty" label-width="100px">
                <el-input v-model="addTrainSubsidyform.duty" style="width:205px"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="JS_add_cancel('addTrainSubsidyform')">取消</el-button>
        <!-- addTrainSubsidy = false -->
        <el-button type="primary" @click="submitWorkForm('addTrainSubsidyform')" v-no-more-click>保存</el-button>
      </span>
    </el-dialog>

    <!-- 导入弹框 -->
    <el-dialog title="培训补助导入" :visible.sync="uploadModal" :show-close="false" :close-on-click-modal="false" width="520px">
      <p class="clearfix">

        <el-upload class="pull-left" ref="upload" :action="uploadActionUrl" :headers="headers" :before-remove="beforeRemove" :before-upload="beforeUpload" :on-success="handleSuccess" :file-list="fileList">
          <el-button size="mediumn" icon="el-icon-upload">导入数据</el-button>
          <el-button size="mediumn" @click.stop="JS_download" style="margin-left:15px;" icon="el-icon-download">下载模板</el-button>
          <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
        </el-upload>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadModal = false">取消</el-button>
      </span>
    </el-dialog>

    <!-- 导入信息 -->
    <el-dialog title="导入信息" :close-on-click-modal="false" :show-close="false" :visible.sync="importProcessInfoDialog" width="600px">
      <div class="pad-all mar-ver">
        <el-progress :text-inside="true" :stroke-width="20" :percentage="progressPercentAge"></el-progress>
        <p>正在导入，本次需导入总记录{{uploadProcessInfo.total | repair}}条，<span style="color:#66b1ff">成功{{uploadProcessInfo.successful | repair}}条</span>，<span style="color:red">失败{{uploadProcessInfo.failures | repair}}条</span>，总耗时{{uploadProcessInfo.dealAllTime}}</p>
        <p v-show="loadErrorExcel">
          <el-button type="text" @click="unloadErrorLink" class="underlineTxt">点击下载导入失败明细</el-button><span style="color:#a1a1a1">(导入失败明细已发送到您内网邮箱)</span>
        </p>
      </div>
      <span slot="footer" class="dialog-footer" v-show="progressBackBtn">
        <el-button type="primary" @click="importProgress">返回</el-button>
      </span>
    </el-dialog>
    <!-- 同步考勤 666-->
    <el-dialog title="请选择培训补助统计时间" :close-on-click-modal="false" :show-close="false" :visible.sync="synchronizationFlag" width="410px">
      <el-form :inline="true" :model="synchronizeForm" :rules="synchronizeFormRule" ref="synchronizeForm" style="text-align:left;margin-top:10px">
        <el-form-item label="发放年月" prop="batch">
          <el-date-picker v-model="synchronizeForm.batch" value-format="yyyy-MM" :clearable="false" :editable="false" type="month" class="width155" placeholder="选择年月"></el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="开始时间">
          <el-date-picker v-model="synchronizeForm.startTime" value-format="yyyy-MM-dd" :clearable="false" :editable="false" type="date" class="width155" placeholder="选择年月"></el-date-picker>
        </el-form-item>
        <el-form-item label="截至时间">
          <el-date-picker v-model="synchronizeForm.endTime" value-format="yyyy-MM-dd" :clearable="false" :editable="false" type="date" class="width155" placeholder="选择年月"></el-date-picker>
        </el-form-item> -->
        <el-form-item label="统计月份" prop="month">
          <el-date-picker v-model="synchronizeForm.month" value-format="yyyy-MM" type="monthrange" range-separator="-" start-placeholder="开始月份" end-placeholder="结束月份" style="width:240px"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetCom()">取消</el-button>
        <el-button type="primary" @click="JS_comparision()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Tools from "untils/index.js";
import myMixin from "libs/mixin/index.js"
import { GET, POST, DELETE, PUT } from "http/custom.js";

export default {
  name: "Talent",
  mixins: [myMixin],
  data() {
    //导入action 线上，数据导入接口
    const uploadActionUrl = process.env.VUE_APP_DOMAIN_personnel + "/incomeTrainingAllowanceImportData";

    return {
      // 基础参数
      t_height: Tools.getTbHeight(275), //设置表格的高
      loading: false, //table加载动画开关
      current: 1, //当前页码
      pages: 0, //总页数
      size: 15, //每页显示记录条数
      total: 0, //总记录条数
      trainData: [], // 表格数据
      personalInfoData: {}, //姓名popover弹窗数据
      SubmitStu: false, //提交数据状态
      uploadActionUrl,
      fileList: [],
      uploadModal: false, //导入弹框
      headers: {}, //上传图片请求头
      uploadSuccess: false, //上传文件成功标识符
      uploadError: false, //上传文件失败标识符
      search_more: false, // 更多查询弹框

      name: "", //员工姓名
      idCard: "", //员工编号
      workAreaId: "", //工作区域ID
      //workAreaName: "",//工作区域去名称
      trainFormInfo: [], // 记录查看的表单的数据
      batch: Tools.getPYd(), //所属年月
      trainBatch: "", //培训日期

      areaOptions: [], //所属区域
      departOptions: [], //所属部门
      datyOptions: [], //所属职务
      isLockFlag: false, //是否上报
      isJugeNewImport: false, //记录锁的状态
      jugeBtnState: 0,//为1时表示搜索的查询，反之0为导入未匹配的查询
      switchParam: "新增培训补助", //修改培训补助  新增与修改用这个值来切换
      viewTrain: false, //查看培训补助信息弹框
      addTrainSubsidy: false, //新增培训补助弹框
      addTrainSubsidyform: {
        //新增补助文本框
        name: "",
        sex: "1",
        idNumber: "",
        phoneNum: undefined,
        days: undefined,
        payBalance: undefined,
        duty: "",
        date: "",
        area: "",
        partment: ""
      },
      // 新增补助验证
      addTrainRule: {
        name: [{ required: true, message: "请填写姓名" }],
        sex: [{ required: true, message: "请选择性别" }],
        idNumber: [
          { required: true, message: "请填写身份证号码" },
          { min: 18, max: 18, message: '长度应为18个字符', trigger: 'blur' }
        ],
        phoneNum: [{ required: true, message: "请填写手机号码" },
        { pattern: /^1[3|4|5|7|8][0-9]\d{8}$/, message: "请输入正确的手机号！", trigger: 'blur' }
        ],
        days: [{ required: true, message: "请填写培训天数" }],
        payBalance: [{ required: true, message: "请填写补助费用" }],
        duty: [{ required: true, message: "请填写职务" }],
        date: [{ required: true, message: "请选择培训日期" }],
        area: [{ required: true, message: "请选择所属区域" }]
      },
      commitState: "",// 提交状态值
      submitStates: [ //提交状态
        { value: "0", label: "未提交" },
        { value: "1", label: "已提交" },
        { value: "2", label: "提交失败" },
        { value: "3", label: "忽略提交" }
      ],
      //进度条相关参数
      importProcessInfoDialog: false, //取消进度条框
      importError: false,// 导入错误时呈现的进度 
      downloadErrorEveProcess: false, //获取错误下载key
      loadErrorExcel: false, //呈现失败下载明细
      downloadErrorKey: false,
      progressPercentAge: 0,
      progressBackBtn: false, //返回按钮
      uploadProcessInfo: {
        total: '',//总条数
        handler: '',//已处理条数
        successful: '',//处理成功条数
        failures: '', //处理失败条数
        finish: false,//是否处理完成
        dealAllTime: '',//总耗时
      },
      //同步考勤 666
      synchronizationFlag: false,
      synchronizeForm: {
        batch: '',
        month: ''
      },
      synchronizeFormRule: {
        batch: [{ required: true, message: "请选择", trigger: "change" }],
        month: [{ required: true, message: "请选择", trigger: "change" }]
      }
    };
  },
  created() {
    //设置上传数据文件excel的token
    this.headers["x-user-token"] = localStorage.getItem("token");
    this.queryAreaList();

  },
  methods: {
    //获取所属区域
    queryAreaList() {
      POST(process.env.VUE_APP_DOMAIN_personnel + "/queryAreaList")
        .then(res => {
          this.areaOptions = res.data;
          this.JS_search(); // 加载完所属区域查询表格
        })
        .catch(error => {
          console.log(error);
        });
    },
    //根据员工编号获取个人信息
    getUserInfo(num) {
      GET(process.env.VUE_APP_DOMAIN_personnel + "/userInfo", { aid: num })
        .then(res => {
          this.personalInfoData = res.data;
          this.personalInfoData.employedDates = this.personalInfoData.employedDates.split(
            " "
          )[0];
          console.log(this.personalInfoData);
        })
        .catch(error => {
          this.personalInfoData = {};
          console.log(error);
        });
    },
    deprtChange(val) {
      console.log(val);
      this.queryPositionList(val);
    },
    //提示框
    messagePopp(type, msg) {
      this.$message({
        showClose: true,
        type: type,
        message: msg
      });
    },
    JS_add_cancel(formName) {
      this.addTrainSubsidy = false;
      this.reset(formName);
    },

    //------------------------ 查询表格数据及分页
    searchForImt() {//点击搜索导入未匹配数据时的查询
      this.commitState = ""; // 清空状态
      this.searchImportClick();
    },
    searchImportClick() {
      this.batch = ""; // 这里的查询是没有年月须置空
      this.isJugeNewImport = false; //点击搜索导入未匹配数据时没有锁
      this.jugeBtnState = 0;//记录当前点击是的导入未匹配数据的按钮
      this.showAllowances(0);
    },
    search() {
      if (!this.batch) {
        this.batch = Tools.getPYd(); //如果无年月默认上个月
      }
      this.jugeBtnState = 1;//记录当前点击是的搜索
      this.showAllowances(1); //点击搜索按钮时的查询
      this.isLock() //数据是否上锁
    },
    showAllowances(type) { //表格数据
      let areaObj = this.areaOptions.find(v => {
        //获取对应的区域
        return (v.areaId === this.workAreaId);
      });
      //查询对象,初始化值
      let searchObj = {
        idNumber: this.idCard, //员工身份证号
        ascs: [], //升序排序，默认为空字符串
        current: this.current, //当前页码
        descs: [], //降序排序，默认为空字符串
        name: this.name, //员工姓名
        batch: this.batch || "",//所属年月
        isConfirm: this.commitState || "",
        size: this.size, //每页显示记录条数
        workAreaId: this.workAreaId || "", //工作区域ID
        workAreaName: areaObj ? areaObj.areaName : "", // 工作区域
        queryType: type //0查询无批次的数据1查询有批次的数据
      };
      this.loading = true; //开启动画
      //调取数据
      POST(process.env.VUE_APP_DOMAIN_personnel + "/incomeTrainingAllowances", searchObj).then(res => {
        this.loading = false;
        this.trainData = res.data.records; //set表格的值
        this.current = res.data.current; // set当前页
        this.size = res.data.size; //每页显示记录条数
        this.total = res.data.total; //总记录数据
        this.pages = res.data.pages; //总页数
      }).catch(error => {
        console.log(error);
      });
    },
    isLock() {//判断数据是否上锁 
      GET(process.env.VUE_APP_DOMAIN_personnel + "/trainingAllowanceFinancialDataLockStatus", { batch: this.batch }).then(res => {
        //console.log("判断数据是否上锁", res)
        if (res.code === 0) {
          this.isLockFlag = false; //未锁
        } else if (res.code === 3) {
          this.isLockFlag = true; //已锁， 不要怀疑这个状态，后端是这么定的
        }
        this.isJugeNewImport = this.isLockFlag;
      }).catch(error => {
        console.log(error)
      })
    },
    searchSelect() { //提交状态下拉
      this.current = 1;
      this.switchSearch();
    },
    switchSearch() { //判断当前是搜索还是未匹配的数据按钮
      if (this.jugeBtnState === 1) { //表示点击了搜索按钮
        this.search();
      } else {    //点击搜索导入未匹配数据时的查询
        this.searchImportClick();
      }
    },
    handleSizeChange(val) {
      //分页,下拉
      this.size = val;
      this.switchSearch();
    },
    handlecurrentChange(val) {
      //当前页，点击页码
      this.current = val;
      this.switchSearch();
    },
    handleAddClose() {
      this.addTrainSubsidy = false;
      this.reset("addTrainSubsidyform");
    },
    reset(formName) { //清除表单
      this.$refs[formName].resetFields();
    },
    ignoreSubmit(id, confirmStatus, msg) {//忽略,取消忽略上报
      if (!this.batch) {
        return this.messagePopp("error", "请选择所属年月");
      }
      //单个忽略,取消忽略上报
      this.$msgBox.confirm(`你确定要${msg}上报该条数据吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const obj = {
          batch: this.batch || "",
          confirmStatus: confirmStatus,
          ids: [id]
        };
        PUT(process.env.VUE_APP_DOMAIN_personnel + "/incomeTrainingAllowanceConfirmStatus", obj).then(() => {
          //单条忽略,取消忽略上报
          this.messagePopp("success", `${msg}上报成功!`);
          this.search() //刷新表格，重新获取数据
        }).catch(error => {
          console.log(error)
        })
      }).catch(() => {
        console.log("取消");
      })
    },
    //------------------------ 更多操作
    handleCommand(command) {
      //更多操作下拉框
      switch (command) {
        case "a":
          this.uploadModal = true;//导入 
          break;
        case "b":
          this.exportData(); //导出
          break;
        case "c":
          // this.JS_comparision();//同步考勤666
          this.synchronizationFlag = true
          break;
        case "d":
          this.addTrainSubsidy = true;//新增
          this.switchParam = "新增培训补助";
          break;
        case "e":
          this.resetSubmit(); // 重置提交
          break;
        default:
          console.log("default");
          return;
      }
    },
    resetSubmit() { //重置数据 
      if (!this.batch) {
        return this.messagePopp("error", "重置数据前请选择年月！");
      }
      this.$msgBox.confirm(`<span>确定重置${this.batch}数据？</span>`, "温馨提示",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        PUT(process.env.VUE_APP_DOMAIN_personnel + "/resetIncomeTrainingAllowanceReoprtData",
          {
            batch: this.batch
          }).then(res => {
            if (res.code === 0) { //0 时成功
              this.messagePopp("success", "重置提交成功！");
              this.JS_search(); //搜索并且判断数据是否上锁
            }
          }).catch(error => {
            console.log(error);
          })
      }).catch(() => {
        console.log("失败");
      })
    },
    exportData() {//导出
      let url = process.env.VUE_APP_DOMAIN_personnel + "/incomeTrainingAllowanceExportData?token="
        + localStorage.getItem("token")
        + "&name=" + this.name
        + "&idNumber=" + this.idCard
        + "&workAreaId=" + (this.workAreaId || "");
      window.location.href = url;
    },
    JS_download() { //下载模板
      GET(process.env.VUE_APP_DOMAIN_personnel + "/queryBizFilesTemplate", //公共接口
        {
          fileCode: 'PERSONNEL_INCOMETRAININGALLOWANCE_IMPORT_TEMPLATE'
        }).then(res => {
          //获取模板存储返回的ID
          let url = `${process.env.VUE_APP_DOMAIN_download}/oss/download?key=${res.data.fileTemplateId}&name=${res.data.fileTemplateName}.${res.data.fileTemplateSuffix}`;
          window.location.href = url;
        }).catch(error => {
          console.log(error);
        });
    },
    unloadErrorLink() {//导入错误模板下载
      console.log('downloadErrorKey', this.downloadErrorKey)
      let url = process.env.VUE_APP_DOMAIN_download + '/oss/download?key=' + this.downloadErrorKey + '&token=' + localStorage.getItem("token") + "&name=" + encodeURI("培训补助失败明细") + ".xlsx";
      window.location.href = url;
    },

    //------------------------ 上传
    beforeRemove(file) {
      //删除文件之前的钩子
      return this.$msgBox.confirm(`确定移除${file.name}？`);
    },
    beforeUpload(file) {
      //上传文件之前的钩子
      console.log("上传文件之前的回调", file);
      let testFileType = file.name.substring(file.name.lastIndexOf('.') + 1) //截取文件后缀
      const extension1 = testFileType === 'xls'
      const extension2 = testFileType === 'xlsx'
      if (!extension1 && !extension2) {//不是excel文件格式
        this.$message.error("上传数据文件只能是 xlsx/xls 格式!")
      }
      return extension1 || extension2
    },
    //上传文件接口调取成功回调
    handleSuccess(res) {
      this.uploadModal = false; //关闭导入框
      if (res.code === 0) {
        // 文件上传成功
        this.downloadErrorEveProcess = res.data //获取进度条事件句柄
        //错误导入进度条与下载模板
        this.importProcessInfoDialog = true
        this.queryProgress() //获取上传文件进度条信息
      } else {//失败
        let msgError = res.msg || '【系统无法识别EXCLE中的空白、公式和非法字符。请先清理】。' //50*非0情况
        this.$msgBox.alert(`<span style="color:red;">${msgError} </span>`, '温馨提示', {
          dangerouslyUseHTMLString: true
        })
      }
      this.$refs.upload.clearFiles(); //清除上传的文件
    },
    queryProgress() { //上传进度条
      this.loadErrorExcel = false; // 隐藏下载链接
      let progressAjax = window.setInterval(() => {
        GET(process.env.VUE_APP_DOMAIN_personnel + "/queryProgress", { progressKey: this.downloadErrorEveProcess }).then(res => {
          this.uploadProcessInfo = res.data;//进度信息对象
          if (res.data.total) {
            this.progressPercentAge = parseInt((res.data.handler / res.data.total) * 100);
          }
          if (res.data.finish) {//已完成
            this.progressPercentAge = 100; //进度完成度
            let calc = res.data.endTime - res.data.beginTime;
            let time = parseInt(calc / 1000);  //计算完成时间
            this.uploadProcessInfo.dealAllTime = time >= 1 ? time + "秒" : calc + "毫秒";
            this.JS_search();//刷新页面

            setTimeout(() => {
              if (res.data.failures > 0) { //表示有导入失败的，呈现可下载模板
                this.downloadErrorKey = res.data.failFile; //获取错误模板下载key
                this.loadErrorExcel = true; // 呈现下载链接
              }
              this.progressBackBtn = true; //进度条完成后，呈现返回按钮
            }, progressAjax + 1000);
            window.clearInterval(progressAjax);  //清除轮询 
          }
        }).catch(error => {
          window.clearInterval(progressAjax);  //清除轮询
          console.log(error);
        })
      }, 1000);
    },
    importProgress() {//进度弹框关闭
      this.importProcessInfoDialog = false; //关闭进度弹框
      this.progressPercentAge = 0 //进度条清空为0
      this.progressBackBtn = false; //隐藏返回按钮
      this.loadErrorExcel = false; // 隐藏下载失败链接

    },

    //-----------------------------功能按钮--------------------------------
    JS_search() {
      this.current = 1; //搜索第一页
      this.search();
    },
    titleSerach() { //点击搜索
      this.commitState = ""; // 清空状态
      this.JS_search();
    },
    resetCom() {
      this.synchronizationFlag = false
      this.$refs['synchronizeForm'].resetFields()
      this.synchronizeForm.month = []
    },
    JS_comparision() {//同步考勤666
      this.$refs['synchronizeForm'].validate(async valid => {
        if (valid) {
          const allLoading = this.$loading({//同步考勤，锁定页面loading
            lock: true,
            text: '正在同步考勤，请稍等片刻',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          // console.log(this.synchronizeForm)
          let obj = {
            batch: this.synchronizeForm.batch,
            startMonth: this.synchronizeForm.month[0],
            endMonth: this.synchronizeForm.month[1]
          }
          // console.log(obj)
          GET(process.env.VUE_APP_DOMAIN_personnel + "/synAttendance", obj).then(() => {
            allLoading.close(); //关闭loading
            this.messagePopp("success", "同步考勤成功！");
            this.JS_search();
            this.synchronizationFlag = false
          }).catch(error => {
            allLoading.close(); //关闭loading
            console.log(error);
          });
        }
      })
    },
    viewTrainSearch(id) { //查看
      this.viewTrain = true;
      GET(process.env.VUE_APP_DOMAIN_personnel + "/incomeTrainingAllowance", { id: id }).then(res => {
        this.trainFormInfo = res.data;
      }).catch(error => {
        console.log(error);
      });
    },
    JS_report_data() {// 上报数据 
      if (!this.batch) {
        return this.messagePopp("error", "请选择要上报的所属年月");
      }
      this.$msgBox.confirm(`<span>请确认要上报${this.batch}的数据</span><span style="color:red;">【培训补助】</span><span>无误。</span>`,
        "温馨提示",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        const allLoading = this.$loading({//上报数据，锁定页面loading
          lock: true,
          text: '正在上报数据，请稍等片刻',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        POST(process.env.VUE_APP_DOMAIN_personnel + "/reportTrainingAllowance", { batch: this.batch }).then(() => {
          allLoading.close(); //关闭loading
          this.messagePopp("success", "上报数据成功！");
          this.JS_search(); //搜索并且判断数据是否上锁
        }).catch(error => {
          allLoading.close(); //关闭loading
          this.JS_search(); //搜索并且判断数据是否上锁
          console.log(error)
        })
      }).catch(() => {

      });
    },
    JS_cancel_report() {//取消上报
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
        POST(process.env.VUE_APP_DOMAIN_personnel + "/unlockTrainingAllowance", { batch: this.batch }).then(res => {
          console.log("取消上报", res)
          this.messagePopp("success", "取消上报数据成功！");
          this.JS_search() //搜索并且判断数据是否上锁
        }).catch(error => {
          console.log(error)
        })
      }).catch(() => {

      })
    },
    submitWorkForm(formName) {
      //新增/修改验证表单 保存
      let areaObj = this.areaOptions.find(v => {
        //获取对应的区域
        if (typeof this.addTrainSubsidyform.area === "string") {
          return (v.areaName === this.addTrainSubsidyform.area);
        }
        return (v.areaId === this.addTrainSubsidyform.area);
      });
      let param = {
        postName: this.addTrainSubsidyform.duty, //职务
        postId: "", //职务id
        gender: this.addTrainSubsidyform.sex, //性别
        idNumber: this.addTrainSubsidyform.idNumber, //身份证号码
        phoneNum: this.addTrainSubsidyform.phoneNum, //联系号码
        name: this.addTrainSubsidyform.name, //姓名
        trainingAllowance: this.addTrainSubsidyform.payBalance, //培训补贴
        trainingDate: this.addTrainSubsidyform.date, //培训日期
        trainingDays: this.addTrainSubsidyform.days, // 培训天数
        workAreaId: areaObj ? areaObj.areaId : 0, //工作区域id
        workAreaName: areaObj ? areaObj.areaName : "" // 工作区域
      };
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.switchParam === "新增培训补助") {//新增            
            POST(
              process.env.VUE_APP_DOMAIN_personnel + "/incomeTrainingAllowance",
              param
            ).then(res => {
              this.search();
              this.messagePopp("success", "新增培训补助成功！");
              this.addTrainSubsidy = false; //关闭弹窗
              this.reset(formName); //清空表单
            }).catch(error => {
              console.log(error);
            });
          } else {//修改            
            param.id = this.addTrainSubsidyform.id; //需要id
            PUT(process.env.VUE_APP_DOMAIN_personnel + "/incomeTrainingAllowance", param).then(() => {
              this.search();
              this.messagePopp("success", "修改培训补助成功！");
              this.addTrainSubsidy = false; //关闭弹窗
            }).catch(error => {
              console.log(error);
            });
          }
        } else {
          this.messagePopp("success", "提交失败，验证不通过");
          return false;
        }
      });
    },
    deleteThis(id) { //删除
      this.$msgBox.confirm("你确定要删除该条数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        DELETE(process.env.VUE_APP_DOMAIN_personnel + "/incomeTrainingAllowances", {
          ids: id,
          batch: this.batch
        }).then(res => {
          console.log("删除成功!" + res);
          this.messagePopp("success", "删除成功!");
          this.search();
        }).catch(error => {
          console.error(error);
        });
      }).catch(() => {
        this.messagePopp("info", "已取消删除!");
      });
    },
    //点击修改获取详情
    updateThis(id) {
      this.addTrainSubsidy = true; //显示弹窗
      this.switchParam = "修改培训补助";
      //通过id获取信息回填
      let allObj = this.trainData.find(v => {
        return v.id === id;
      });
      this.$nextTick(() => { //（dialog是懒加载）修改和新增用的同一个表单时，修改回填数据时要用这个方法防止再点击新增时数据会回填
        this.addTrainSubsidyform = {
          name: allObj.name,
          sex: allObj.gender, // === "0" ? "女" : "男",
          idNumber: allObj.idNumber,
          phoneNum: allObj.phoneNum,
          days: allObj.trainingDays,
          payBalance: allObj.trainingAllowance,
          duty: allObj.postName,
          date: allObj.trainingDate,
          area: allObj.workAreaName,
          partment: "",
          id: id
        };
        console.log("显示修改培训补助弹窗");
      });

    }
  }
};
</script>

<style scoped>
.bgWhite {
  padding: 15px;
}
.comparision-btn {
  margin-right: 10px;
}
.width215,
.train-dialog .el-date-editor.el-input {
  width: 215px !important;
}
/* 文字首尾对齐 */
.ft {
  text-align: justify;
  text-align-last: justify;
  text-justify: distribute-all-lines;
  display: inline-block;

  width: 60px;
}
</style>

