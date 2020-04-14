<template>
  <div class="attendanceDed">
    <div class="guide">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home/administrativeSystem' }">行政系统</el-breadcrumb-item>
        <el-breadcrumb-item>考勤扣款项</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/administrativeSystem' }">(返回上级)</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="bgWhite mgt15 content clearfix">
      <!-- 查询栏 start -->
      <div class="pull-left">
        <el-form :inline="true" class="mar-no">
          <el-form-item label="姓名">
            <el-input clearable @keyup.enter.native="inputEnter" v-model="userName" placeholder="请输入名字" class="width155"></el-input>
          </el-form-item>
          <el-form-item label="员工编号">
            <el-input clearable @keyup.enter.native="inputEnter" v-model="aid" placeholder="请输入编号" class="width155"></el-input>
          </el-form-item>
          <el-form-item label="年月">
            <el-date-picker v-model="staticMonth" type="month" value-format="yyyy-MM" :editable="false" :clearable="false" class="width155" placeholder="选择年月">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="JS_search" icon="el-icon-search">搜索</el-button>
            <el-button icon="el-icon-search" @click="searchMoreClick">更多查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="pull-right">
        <el-dropdown @command="handleCommand" trigger="click">
          <el-button type="primary">
            更多操作<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="a" :disabled="isLockFlag===true" class="cloud-uploadBtn"><i></i>&nbsp;导入</el-dropdown-item>
            <el-dropdown-item command="b" divided class="cloud-downloadBtn"><i></i>&nbsp;导出</el-dropdown-item>
            <el-dropdown-item command="d" divided><i class="el-icon-refresh"></i>重置提交</el-dropdown-item>
            <!-- <el-dropdown-item command="e" :disabled="isLockFlag===true" divided>同步考勤</el-dropdown-item> -->
            <el-dropdown-item command="c" :disabled="isLockFlag===true" divided>全部删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>&nbsp;
        <el-button size="small" type="danger" v-if="isLockFlag===false" @click="JS_report_data">上报数据</el-button>
        <el-button size="small" v-if="isLockFlag===true" @click="JS_cancel_report">取消上报</el-button>
      </div>
      <div class="table_wrap">
        <el-table v-loading="loading" :height="tabHeight" :data="attendanceDedData" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
          <el-table-column type="index" label="序号" min-width="50"></el-table-column>
          <el-table-column prop="staticMonth" label="时间" min-width="100"></el-table-column>
          <el-table-column label="姓名" min-width="150">
            <template slot-scope="scope">
              <el-popover trigger="click" placement="top" @show="getUserInfo(scope.row.aid)" width="450">
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
              <span>{{scope.row.aid}}</span><i class="el-icon-phone tbIconPhone"></i>
            </template>
          </el-table-column>
          <el-table-column prop="mobilePhone" label="平台号码" min-width="160"></el-table-column>
          <el-table-column prop="idNumber" label="身份证号" min-width="160"></el-table-column>
          <el-table-column prop="workingHours" label="应出勤小时" min-width="100"></el-table-column>
          <el-table-column prop="actualWorkingHours" label="实出勤小时" min-width="100"></el-table-column>
          <el-table-column label="全勤奖" min-width="100">
            <template slot-scope="scope">
              {{scope.row.fullAttendanceMoney | toThousands}}
            </template>
          </el-table-column>
          <el-table-column label="考勤异常扣款" min-width="120">
            <template slot-scope="scope">
              {{scope.row.attendanceChargsbacks | toThousands}}
            </template>
          </el-table-column>
          <el-table-column label="调取监控扣款" min-width="120">
            <template slot-scope="scope">
              {{scope.row.monitoringDeduction | toThousands}}
            </template>
          </el-table-column>
          <el-table-column min-width="170">
            <template slot="header">
              <el-select v-model="bsubmitValue" filterable placeholder="提交状态" clearable style="width:150px;" @change="bsubmitChange" class="selectRepairIcon">
                <el-option v-for="item in bsubmitOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </template>
            <template slot-scope="scope">
              <span style="color:#EF3838;" v-if="scope.row.bsubmit===0">未提交</span>
              <span v-if="scope.row.bsubmit===1">已提交</span>
              <span style="color:#EF3838;" v-if="scope.row.bsubmit===2">
                <el-tooltip v-if="scope.row.errorMsg" class="item" effect="dark" :content="scope.row.errorMsg" placement="top">
                  <span>提交失败</span>
                </el-tooltip>
                <span v-else>
                  提交失败
                </span>
              </span>
              <span v-if="scope.row.bsubmit===3">忽略提交</span>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" min-width="250" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" min-width="220" fixed="right">
            <template slot-scope="scope">
              <el-button v-if="scope.row.id" type="text" size="small" :disabled="isLockFlag" @click="updateThis(scope.row.id)">修改</el-button>
              <el-button v-if="scope.row.id" type="text" size="small" :disabled="isLockFlag" class="deleteTxt" @click="deleteThis(scope.row.id)">删除</el-button>
              <el-button v-if="scope.row.bsubmit===2" type="text" size="small" :disabled="isLockFlag" @click="ignoreSubmit(scope.row.id,3,'忽略')">忽略提交</el-button>
              <el-button v-if="scope.row.bsubmit===3" type="text" size="small" :disabled="isLockFlag" @click="ignoreSubmit(scope.row.id,0,'取消忽略')">取消忽略</el-button>
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
    <!-- 修改扣款项弹框 -->
    <el-dialog title="修改扣款项" :before-close="handleModifyClose" :close-on-click-modal="false" :visible.sync="updateCondition" width="768px" class="grayBg">
      <div class="whiteBox">
        <p class="pReset">基本信息</p>
        <el-row class="textLft">
          <el-col :span="3" class="height26">年月：</el-col>
          <el-col :span="9" class="height26">{{modifyForm.staticMonth}}</el-col>
          <el-col :span="3" class="height26">姓名：</el-col>
          <el-col :span="9" class="height26">{{modifyForm.userName}}</el-col>
          <el-col :span="3" class="height26">员工编号：</el-col>
          <el-col :span="9" class="height26">{{modifyForm.aid}}</el-col>
          <el-col :span="3" class="height26">身份证号：</el-col>
          <el-col :span="9" class="height26">{{modifyForm.idNumber}}</el-col>
        </el-row>
      </div>
      <div class="whiteBox">
        <p class="pReset">扣款项信息</p>
        <el-form :model="updateConditionform" :rules="updateConditionformRule" ref="updateConditionform" label-width="150px">
          <el-row>
            <el-col :md="12">
              <el-form-item label="应出勤小时：" prop="workingHours">
                <el-input-number :controls="false" v-model="updateConditionform.workingHours" style="width:200px" :min="0" :max="10000000"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="实出勤小时：" prop="actualWorkingHours">
                <el-input-number :controls="false" v-model="updateConditionform.actualWorkingHours" style="width:200px" :min="0" :max="10000000"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="全勤奖：" prop="fullAttendanceMoney">
                <el-input-number @input.native="fullAttendanceMoneyChange" :controls="false" v-model="updateConditionform.fullAttendanceMoney" style="width:200px" :min="0" :max="10000000"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="考勤异常扣款：" prop="attendanceChargsbacks">
                <el-input-number @input.native="attendanceChargsbacksChange" :controls="false" v-model="updateConditionform.attendanceChargsbacks" style="width:200px" :min="0" :max="10000000"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :md="24">
              <el-form-item label="备注：" prop="remark">
                <el-input type="textarea" :rows="3" placeholder="请输入备注" v-model.trim="updateConditionform.remark">
                </el-input>
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
    <!-- 扣款项导入弹框 -->
    <el-dialog :before-close="fileClose" title="扣款项导入" :close-on-click-modal="false" :visible.sync="uploadModal" width="520px">
      <p class="clearfix">
        <el-upload class="pull-left" ref="upload" :action="uploadActionUrl" :headers="headers" :before-remove="beforeRemove" :before-upload="beforeUpload" :on-success="handleSuccess" :file-list="fileList">
          <el-button size="mediumn" class="cloud-uploadBtn"><i></i>&nbsp;导入数据</el-button>
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

    <!-- 同步数据进度条弹框 -->
    <el-dialog title="同步数据" :close-on-click-modal="false" :show-close="false" :visible.sync="syncDataDialog" width="600px">
      <div class="pad-all mar-ver">
        <el-progress :text-inside="true" :stroke-width="20" :percentage="syncDataProgressPercentAge"></el-progress>
        <!-- <p>正在同步，该操作耗时比较久，请耐心等待，总耗时{{syncDataProcessInfo.dealAllTime | repair}}</p> -->
        <p>正在同步，该操作耗时比较久(大约10分钟)，请耐心等待。</p>
      </div>
      <span slot="footer" class="dialog-footer" v-show="syncDataShowBackBtn">
        <el-button type="primary" @click="syncDataBackBtn">返回</el-button>
      </span>
    </el-dialog>

    <!-- 更多查询弹框 -->
    <el-dialog title="更多查询" :close-on-click-modal="false" :before-close="immediatelyCancel" :visible.sync="search_more" width="768px">
      <el-form :inline="true" :model="moreParam" ref="moreParam" label-width="150px">
        <el-row>
          <el-col :md="12">
            <el-form-item label="应出勤小时：">
              <el-input-number :controls="false" v-model="moreParam.workingHours" @keyup.enter.native="inputEnterMore" style="width:200px" :min="0" :max="10000000"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="实出勤小时：">
              <el-input-number :controls="false" v-model="moreParam.actualWorkingHours" @keyup.enter.native="inputEnterMore" style="width:200px" :min="0" :max="10000000"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="全勤奖：">
              <el-input-number :controls="false" v-model="moreParam.fullAttendanceMoney" @keyup.enter.native="inputEnterMore" style="width:200px" :min="0" :max="10000000"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="考勤异常扣款：">
              <el-input-number :controls="false" v-model="moreParam.attendanceChargsbacks" @keyup.enter.native="inputEnterMore" style="width:200px" :min="0" :max="10000000"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="监控调取扣款：">
              <el-input-number :controls="false" v-model="moreParam.monitoringDeduction" @keyup.enter.native="inputEnterMore" style="width:200px" :min="0" :max="10000000"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="JS_immediately_cancel()">取消</el-button>
        <el-button type="primary" @click="inputEnterMore">立即搜索</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import Tools from 'untils/index.js'
import myMixin from "libs/mixin/index.js"
import tbMixin from "libs/mixin/tbMixin.js" //动态计算表格高度mixin
import { GET, POST, DELETE, PUT } from "http/custom.js"
export default {
  name: 'attendanceDed',
  mixins: [myMixin, tbMixin],
  data() {
    const uploadActionUrl = process.env.VUE_APP_DOMAIN_administration + '/salaryAttendanceImportData' //导入action  线上
    let Ytd = Tools.getPYd() //获取当前年，上月 格式为 2019-05
    return {
      search_more: false,//更多查询
      //更多条件
      moreParam: {
        workingHours: undefined, //应出勤小时
        actualWorkingHours: undefined, //实出勤小时
        fullAttendanceMoney: undefined, //全勤奖
        attendanceChargsbacks: undefined, //考勤异常扣款
        monitoringDeduction: undefined //监控调取扣款
      },
      t_height: 285, //减去的高度
      isLockFlag: false, //判断数据是否上锁
      fileList: [],//上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
      headers: {}, //上传图片请求头
      uploadActionUrl,
      bsubmitOptions: [//提交状态
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
      bsubmitValue: '',//处理状态值

      loading: false,//table加载动画开关
      current: 1,//当前页码
      size: 15,//每页显示记录条数
      total: 0,//总记录条数
      attendanceDedData: [],//行政扣款
      staticMonth: Ytd,//年月（批次号）
      aid: '',//员工编号
      userName: '',//员工姓名
      personalInfoData: {},//姓名popover弹窗数据
      uploadModal: false,//导入弹框

      modifyForm: {}, //修改对象
      updateCondition: false,
      updateConditionform: {//修改条件
        workingHours: 0,//应出勤小时
        actualWorkingHours: 0,//实出勤小时
        fullAttendanceMoney: 0,//全勤奖
        attendanceChargsbacks: 0,//考勤异常扣款
        remark: ''//备注
      },
      updateConditionformRule: {
        workingHours: [{ required: true, message: "请填写应出勤小时", trigger: "blur" }],
        actualWorkingHours: [{ required: true, message: "请填写实出勤小时", trigger: "blur" }],
        // fullAttendanceMoney: [{ required: true, message: "请填写全勤奖", trigger: "blur" }],
        // attendanceChargsbacks: [{ required: true, message: "请填写考勤异常扣款", trigger: "blur" }],
        remark: [
          { min: 0, max: 200, message: '不能超过200字', trigger: 'blur' }
        ]
      },
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
      //同步数据进度条相关参数
      syncDataDialog: false, //进度条框
      syncProcessKey: '', //获取进度条key
      syncDataProgressPercentAge: 0, //进度条百分百
      syncDataShowBackBtn: false, //返回按钮
      syncDataProcessInfo: {
        total: '',//总条数
        handler: '',//已处理条数
        successful: '',//处理成功条数
        failures: '', //处理失败条数
        finish: false,//是否处理完成
        dealAllTime: '',//总耗时
      }
    }
  },
  methods: {
    handleSizeChange(val) {//每页显示多少条数据切换
      this.size = val //保存状态-每页显示多少条数据切换
      this.search()
    },
    handlecurrentChange(val) {//点击页码，当前页
      this.current = val //保存状态-当前页
      this.search()
    },
    bsubmitChange() {//表头提交状态select
      this.JS_search()//搜索提交状态
    },
    fullAttendanceMoneyChange(e) {//全勤奖
      this.updateConditionform.fullAttendanceMoney = e.target.value
    },
    attendanceChargsbacksChange(e) {//考勤异常扣款
      this.updateConditionform.attendanceChargsbacks = e.target.value
    },
    ignoreSubmit(id, confirmStatus, msg) {//忽略,取消忽略上报
      //单个忽略,取消忽略上报
      this.$msgBox
        .confirm(`你确定要${msg}上报该条数据吗?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          PUT(process.env.VUE_APP_DOMAIN_personnel + "/salaryAttendanceDataIgnore", { ids: [id], confirmStatus, msg })
            .then(res => {
              //单条忽略,取消忽略上报
              this.$message({
                type: "success",
                message: `${msg}上报成功!`
              })
              this.search() //刷新表格，重新获取数据
            })
            .catch(error => {
              console.log(error)
            })
        })
        .catch(() => {

        })
    },
    moreParamObjFn() { //更多查询对象函数
      return {//更多查询
        "workingHours": this.moreParam.workingHours === undefined ? "" : this.moreParam.workingHours,//应出勤小时
        "actualWorkingHours": this.moreParam.actualWorkingHours === undefined ? "" : this.moreParam.actualWorkingHours,//实出勤小时
        "fullAttendanceMoney": this.moreParam.fullAttendanceMoney === undefined ? "" : this.moreParam.fullAttendanceMoney,//全勤奖
        "attendanceChargsbacks": this.moreParam.attendanceChargsbacks === undefined ? "" : this.moreParam.attendanceChargsbacks,//考勤异常扣款
        "monitoringDeduction": this.moreParam.monitoringDeduction === undefined ? "" : this.moreParam.monitoringDeduction//监控调取扣款
      }
    },
    JS_search() {
      this.current = 1 //点击搜索current=1搜索第一页
      this.search()
    },
    search() {
      //mohan 列表查询
      let basicObj = {//查询对象,在这里初始化,初始化值都是取this下面的
        "current": this.current, //当前页码
        "size": this.size, //每页显示记录条数
        "userName": this.userName, //员工姓名
        "staticMonth": this.staticMonth, //年月（批次号）
        "aid": this.aid, //员工编号
        "bsubmit": this.bsubmitValue || '' //表头提交状态
      }
      let moreParam = this.moreParamObjFn() //获取更多查询对象
      let searchObj = { ...basicObj, ...moreParam } //基本查询加更多查询
      console.log('搜索对象', searchObj)
      this.loading = true //开启动画
      POST(process.env.VUE_APP_DOMAIN_administration + '/salaryAttendanceDatas', searchObj).then(res => {
        this.loading = false //关闭动画
        this.attendanceDedData = res.data.records //set表格的值
        this.current = res.data.current //set当前页
        this.size = res.data.size //每页显示记录条数
        this.total = res.data.total //总记录条数
      }).catch(error => {
        console.log(error)
      })
      this.isLock() //判断数据是否上锁
    },
    searchMoreClick() {
      //点击更多查询清空条件
      this.search_more = true; // 显示条件框
    },
    JS_immediately_cancel() { //取消
      this.search_more = false;
    },
    immediatelyCancel() {
      this.search_more = false;
    },
    inputEnterMore() { // enter 键
      this.JS_search();
      this.search_more = false;//关闭更多查询
    },
    beforeRemove(file) { //删除文件之前的钩子
      return this.$msgBox.confirm(`确定移除 ${file.name}？`);
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
    fileClose() {//关闭公式导入弹框
      //清除表单
      this.uploadModal = false
      this.$refs.upload.clearFiles() //清空已上传的文件列表（该方法不支持在 before-upload 中调用）
    },
    handleSuccess(res) { //上传文件接口调取成功回调
      this.uploadModal = false; //关闭导入框
      if (res.code == 0) {//文件上传成功
        // 文件上传成功
        this.downloadErrorEveProcess = res.data //获取进度条事件句柄
        //错误导入进度条与下载模板
        this.importProcessInfoDialog = true
        this.queryProgress() //获取上传文件进度条信息
      } else {
        //失败
        let msgError = res.msg || '【系统无法识别EXCLE中的空白，公式和非法字符。请先清理】。' //50*非0情况
        this.$msgBox.alert(`<span style="color:red;">${msgError} </span>`, '温馨提示', {
          dangerouslyUseHTMLString: true
        })
      }
      this.$refs.upload.clearFiles() //清空已上传的文件列表（该方法不支持在 before-upload 中调用）
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
    unloadErrorLink() {//导入错误模板下载
      console.log('downloadErrorKey', this.downloadErrorKey)
      let url = process.env.VUE_APP_DOMAIN_download + '/oss/download?key=' + this.downloadErrorKey + '&token=' + localStorage.getItem("token") + "&name=" + encodeURI("考勤扣款项失败明细") + ".xlsx";
      window.location.href = url;
    },
    //根据员工编号获取个人信息
    getUserInfo(num) {
      GET(process.env.VUE_APP_DOMAIN_personnel + '/userInfo', { aid: num }).then(res => {//查询薪资类型模板
        console.log(res.data);
        this.personalInfoData = res.data
        this.personalInfoData.employedDates = this.personalInfoData.employedDates.split(" ")[0];
      }).catch(error => {
        console.log(error)
      })
    },
    handleCommand(command) {//更多操作下拉框
      if (command == 'a') {
        this.uploadModal = true
      }
      if (command == 'b') {//导出
        this.exportData()
      }
      if (command == 'c') {
        this.deleteAll()//全部删除
      }
      if (command == "d") {
        this.resetSubmit(); //重置提交
      }
      if (command == "e") {
        this.syncData(); //同步考勤
      }
    },
    syncData() {//同步考勤
      this.$msgBox.confirm('你确定要同步考勤吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        GET(process.env.VUE_APP_DOMAIN_administration + '/statisticsSalaryData', { "batch": this.staticMonth }).then(res => { //同步考勤
          if (res.code === 0 && res.data) {
            // 同步成功
            this.syncProcessKey = res.data //获取进度条事件句柄
            //同步数据弹框
            this.syncDataDialog = true
            this.syncDataQueryProgress() //获取同步数据进度条信息
          }
        }).catch(error => {
          console.log(error)
        })
      }).catch(() => {

      })
    },
    syncDataBackBtn() {//同步数据返回按钮
      this.syncDataDialog = false; //关闭进度弹框
      this.syncDataProgressPercentAge = 0 //进度条清空为0
      this.syncDataShowBackBtn = false; //隐藏返回按钮
    },
    syncDataQueryProgress() { //同步数据进度条
      let progressAjax = window.setInterval(() => {
        GET(process.env.VUE_APP_DOMAIN_administration + "/circulate", { "requestId": this.syncProcessKey, "batch": this.staticMonth }).then(res => {
          this.syncDataProcessInfo = res.data;//进度信息对象
          if (res.data.handler) {
            this.syncDataProgressPercentAge = parseInt(res.data.handler) //进度条完成百分比
          }
          if (res.data.finish) {//已完成
            this.syncDataProgressPercentAge = 100; //进度完成度
            // if (res.data.endTime) {//如果结束时间存在
            //   let calc = res.data.endTime - res.data.beginTime;
            //   let time = parseInt(calc / 1000);  //计算完成时间
            //   this.syncDataProcessInfo.dealAllTime = time >= 1 ? time + "秒" : calc + "毫秒";
            // } else {
            //   this.syncDataProcessInfo.dealAllTime = '--'
            // }
            this.JS_search();//刷新页面
            setTimeout(() => {
              this.syncDataShowBackBtn = true; //进度条完成后，呈现返回按钮
            }, progressAjax + 1000);
            window.clearInterval(progressAjax);  //清除轮询 
          }
        }).catch(error => {
          window.clearInterval(progressAjax);  //清除轮询
        })
      }, 1000);
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
        PUT(process.env.VUE_APP_DOMAIN_administration + "/salaryAttendanceDataReset",
          {
            batch: this.staticMonth,
            confirmStatus: 0
          }).then(res => {
            if (res.code === 0) {
              if (res.data) {//重置成功
                this.messagePopp("success", "重置成功！")
                this.JS_search() //搜索并且判断数据是否上锁
              } else {
                this.messagePopp("error", "重置失败！")
              }
            }
          }).catch(error => {

          })
      }).catch(() => {
        console.log("失败");
      })
    },
    JS_download() {//下载模板
      GET(process.env.VUE_APP_DOMAIN_personnel + "/queryBizFilesTemplate", { fileCode: 'ADMIN_SALARYATTENDANCE_IMPORT_TEMPLATE' })
        .then(res => {
          //获取模板存储返回的ID
          let url = `${process.env.VUE_APP_DOMAIN_download}/oss/download?key=${res.data.fileTemplateId}&name=${res.data.fileTemplateName}.${res.data.fileTemplateSuffix}`;
          window.location.href = url;
        })
        .catch(error => {
          console.log(error);
        });
    },
    exportData() {//导出
      let exportMoreParam = this.moreParamObjFn() //获取更多查询对象
      let exportToken = localStorage.getItem('token')
      window.location.href = `${process.env.VUE_APP_DOMAIN_administration}/salaryAttendanceExportData?userName=${this.userName}&staticMonth=${this.staticMonth}&aid=${this.aid}&token=${exportToken}&workingHours=${exportMoreParam.workingHours}&actualWorkingHours=${exportMoreParam.actualWorkingHours}&fullAttendanceMoney=${exportMoreParam.fullAttendanceMoney}&attendanceChargsbacks=${exportMoreParam.attendanceChargsbacks}&monitoringDeduction=${exportMoreParam.monitoringDeduction}`
      // window.location.href = process.env.VUE_APP_DOMAIN_administration + '/salaryAttendanceExportData?userName=' + this.userName + '&staticMonth=' + this.staticMonth + '&aid=' + this.aid + '&token=' + localStorage.getItem('token') //window.location.href方式打开二进制文件下载文件
      // let exportObj = {
      //   "userName": this.userName, //员工姓名
      //   "staticMonth": this.staticMonth, //年月（批次号）
      //   "aid": this.aid //员工编号
      // }
      // POST(process.env.VUE_APP_DOMAIN_administration + '/salaryAttendanceExportData', exportObj).then(res => {
      //   console.log('导出', res)
      //   this.$message({
      //     type: 'success',
      //     message: '导出数据成功!',
      //     showClose: true
      //   })
      // }).catch(error => {
      //   console.log(error)
      // })
    },
    updateThis(id) {//修改 查看详情
      this.updateCondition = true //弹出修改框
      GET(process.env.VUE_APP_DOMAIN_administration + '/salaryAttendanceData', { "id": id }).then(res => {//获取考勤扣款详细数据
        this.modifyForm = res.data
        console.log('获取考勤扣款详细数据', res)
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
          PUT(process.env.VUE_APP_DOMAIN_administration + '/salaryAttendanceData', saveObj).then(res => {
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
    deleteThis(id) {//单个删除
      this.$msgBox.confirm('你确定要删除该条数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DELETE(process.env.VUE_APP_DOMAIN_administration + '/salaryAttendanceData', { "ids": id }).then(res => { //单条数据删除
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
    deleteAll() {//按批次删除
      if (this.month == '') {//如果没选择年月
        this.$message({
          type: 'success',
          message: '请选择年月!',
          showClose: true
        })
      } else {
        this.$msgBox.confirm('你确定要删除该月所有数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          DELETE(process.env.VUE_APP_DOMAIN_administration + '/salaryAttendanceDataToBatch', { "batch": this.staticMonth }).then(res => { //按批次删除
            this.$message({
              type: 'success',
              message: '批次删除成功!'
            })
            this.JS_search() //刷新表格，重新获取数据
          }).catch(error => {
            console.log(error)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    },
    isLock() {//判断数据是否上锁
      GET(process.env.VUE_APP_DOMAIN_administration + "/salaryAttendanceDataCheckFinancialDataLock", { batch: this.staticMonth }).then(res => {
        console.log("判断数据是否上锁", res)
        this.isLockFlag = res.data
      }).catch(error => {
        console.log(error)
      })
    },
    JS_report_data() {
      //上报数据
      this.$msgBox.confirm(
        '<span>请确认你上传的' + this.staticMonth + '月份</span><span style="color:red;">【考勤扣款】</span><span>无误，确认提交后，将直接影响工资准确发放。</span>',
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
        GET(process.env.VUE_APP_DOMAIN_administration + "/salaryAttendanceDataCollectEmployPayroll", { batch: this.staticMonth }).then(res => {
          console.log("上报数据", res)
          loading.close() //关闭loading
          this.$message({
            type: "success",
            message: "上报数据成功！"
          })
          this.search() //搜索并且判断数据是否上锁
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
        GET(process.env.VUE_APP_DOMAIN_administration + "/salaryAttendanceDataCancelSubmit", { batch: this.staticMonth }).then(res => {
          console.log("取消上报", res)
          this.$message({
            type: "success",
            message: "取消上报数据成功！"
          })
          this.search() //搜索并且判断数据是否上锁
        }).catch(error => {
          console.log(error)
        })
      }).catch(() => {

      })
    }
  },
  created() {
    this.headers['x-user-token'] = localStorage.getItem('token') //设置上传数据文件excel的token
    this.search() //获取表格列表分页初始化数据
    // GET('/api/getAttendanceDedData').then(res=>{//考勤扣款 mock
    //   this.attendanceDedData = res.dataTable
    // }).catch(error=>{
    //     console.log(error)
    // })
  }
}
</script>

<style scoped>
</style>
