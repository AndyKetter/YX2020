<template>
  <div class="adjustMoneyManage">
    <div class="guide">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home/publicSystem' }">公共系统</el-breadcrumb-item>
        <el-breadcrumb-item>调整款项管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/publicSystem' }">(返回上级)</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="bgWhite mgt15">
      <!-- 查询栏 start -->
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="调整款项" name="first">
          <div class="pull-left">
            <el-form :inline="true" :model="adjustParam" class="mar-no" label-position="right">
              <el-form-item label="所属部门">
                <el-select placeholder="请选择" class="width155" v-model="adjustParam.department" filterable clearable>
                  <el-option v-for="item in deptOptions" :key="item.deptId" :label="item.deptName" :value="item.deptId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所属年月">
                <el-date-picker v-model="adjustParam.searchDate" :editable="false" :clearable="false" type="month" value-format="yyyy-MM" class="width110" placeholder="选择月"></el-date-picker>
              </el-form-item>
              <el-form-item label="调整类型">
                <el-select placeholder="请选择" class="width155" v-model="adjustParam.type" filterable clearable>
                  <el-option v-for="item in typeOptions" :key="item.dicTypeValues" :label="item.dicTypeName" :value="item.dicTypeValues"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="JS_adjustSearch">搜索</el-button>
                <el-button icon="el-icon-search" @click="searchMoreClick">更多查询</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="pull-right">
            <el-dropdown @command="handleCommand2" trigger="click">
              <el-button>
                更多操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a" class="cloud-uploadBtn"><i></i>&nbsp;导入</el-dropdown-item>
                <el-dropdown-item command="b" class="cloud-downloadBtn" divided><i></i>&nbsp;导出</el-dropdown-item>
                <el-dropdown-item command="c" divided>批量删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <!-- <el-button size="small" slot="reference" @click="uploadModal = true" class="cloud-uploadBtn">
              <i></i>&nbsp;导入
            </el-button>
            <el-button size="small" slot="reference" @click="downloaddModal=true" class="cloud-downloadBtn">
              <i></i>&nbsp;导出
            </el-button> -->
          </div>
          <div class="table_wrap">
            <el-table v-loading="loading" :height="tabHeight" :data="adjustPageObj.dataTable" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
              <!-- 111 -->
              <el-table-column type="index" label="序号" min-width="50"></el-table-column>
              <el-table-column prop="deptName" label="所属部门" min-width="150"></el-table-column>
              <el-table-column prop="adjustDate" label="所属年月" min-width="100"></el-table-column>
              <el-table-column label="调整类型" min-width="150">
                <template slot-scope="scope">{{scope.row.adjustType}}</template>
              </el-table-column>
              <el-table-column label="员工姓名" min-width="150">
                <template slot-scope="scope">
                  <el-popover v-show="scope.row.employeeName" trigger="click" placement="top" width="450" @show="getUserInfoAdjust(scope.row.employeeNo)">
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.employeeName}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="员工编号" min-width="150">
                <template slot-scope="scope">
                  <span>{{scope.row.employeeNo}}</span>
                  <i class="el-icon-phone tbIconPhone"></i>
                </template>
              </el-table-column>
              <el-table-column prop="mobilePhone" label="平台号码" min-width="160"></el-table-column>
              <el-table-column prop="idNumber" label="身份证号" min-width="160"></el-table-column>
              <el-table-column prop="adjustContent" label="调整内容" min-width="150"></el-table-column>
              <el-table-column label="调整金额" min-width="100">
                <template slot-scope="scope">{{scope.row.adjustMoney | toThousands}}</template>
              </el-table-column>
              <el-table-column prop="remark" label="备注" show-overflow-tooltip min-width="200"></el-table-column>
              <el-table-column label="操作人" prop="remark" min-width="150">
                <template slot-scope="scope">
                  <el-popover v-show="scope.row.updateUserName||scope.row.createUserName" trigger="click" placement="top" width="450" @show="getUserInfoByUser(scope.row.updateUser||scope.row.createUser)">
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.updateUserName||scope.row.createUserName}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="操作时间" min-width="160"></el-table-column>
              <el-table-column label="操作" fixed="right" min-width="60">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="deleteThis(scope.row.id)" class="deleteTxt">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 总计 -->
            <div style="margin-top:10px">
              <el-alert :title="titleVal" type="success" :closable="false"> </el-alert>
            </div>
            <!-- 分页  -->
            <div id="pagination">
              <el-pagination background @size-change="handleSizeChange_adjust" @current-change="handlecurrentChange_adjust" :current-page="adjustPageObj.current" :page-sizes="[10,15,20,30,40]" :page-size="adjustPageObj.size" layout="total,sizes,prev,pager,next,jumper" :total="adjustPageObj.total"></el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <!--调整款项汇总 -->
        <el-tab-pane v-if="adjustGather" label="调整款项汇总" name="second">
          <div class="table_wrap" style="margin-bottom: 20px;">
            <el-table v-loading="gatherloading" :height="gather_ht_top" :data="gatherTableData" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
              <el-table-column prop="adjustType" label="类型" min-width="100"></el-table-column>
              <el-table-column prop="num" label="总笔数" min-width="100"></el-table-column>
              <el-table-column prop="personNum" label="总人数" min-width="100"></el-table-column>
              <el-table-column label="总金额" min-width="100">
                <template slot-scope="scope">{{scope.row.total | toThousands}}</template>
              </el-table-column>
            </el-table>
          </div>
          <div class=" pull-left">
            <el-form :inline="true" :model="gatherParam" class="mar-no">
              <el-form-item label="查询年月">
                <el-date-picker v-model="gatherParam.adjustDate" value-format="yyyy-MM" :clearable="false" type="month" class="width155" placeholder="选择年月"></el-date-picker>
              </el-form-item>
              <el-form-item label="员工编号">
                <el-input-number @keyup.enter.native="JS_gatherSearch" v-model="gatherParam.employeeNo" :controls="false" placeholder="请输入编号" class="width155" :min="0" :max="10000000000"></el-input-number>
              </el-form-item>
              <!-- <el-form-item label="身份证号">
                <el-input v-model.trim="gatherParam.idNumber" @keyup.enter.native="JS_gatherSearch" placeholder="身份证号" class="width155"></el-input>
              </el-form-item> -->
              <el-form-item>
                <el-button type="primary" @click="titleSearch" icon="el-icon-search">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="pull-right">
            <el-dropdown @command="handleCommand" trigger="click">
              <el-button type="primary">
                更多操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a" class="cloud-uploadBtn">
                  <i></i>&nbsp;导出
                </el-dropdown-item>
                <el-dropdown-item command="c" divided><i class="el-icon-refresh"></i>重置提交</el-dropdown-item>
                <el-dropdown-item command="b" :disabled="isLockFlag" divided>生成汇总数据</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>&nbsp;
            <el-button size="small" type="danger" v-if="isLockFlag===false" @click="JS_report_data">上报数据</el-button>
            <el-button size="small" v-if="isLockFlag===true" @click="JS_cancel_report">取消上报</el-button>
          </div>
          <div class="table_wrap">
            <el-table v-loading="gatherloading" :height="gather_ht_bot" :data="gatherPageObj.dataTable" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
              <el-table-column type="index" label="序号" min-width="50"></el-table-column>
              <el-table-column prop="adjustDate" label="所属年月" min-width="80"></el-table-column>
              <el-table-column label="姓名" min-width="150">
                <template slot-scope="scope">
                  <el-popover v-show="scope.row.employeeName" trigger="click" placement="top" width="450" @show="getUserInfoAdjust(scope.row.employeeNo)">
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.employeeName}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="员工编号" min-width="150">
                <template slot-scope="scope">
                  <span>{{scope.row.employeeNo}}</span>
                  <i class="el-icon-phone tbIconPhone"></i>
                </template>
              </el-table-column>
              <el-table-column prop="idNumber" label="身份证号" min-width="150"></el-table-column>
              <el-table-column label="其他补助" min-width="100">
                <template slot-scope="scope">{{scope.row.otherAllowance | toThousands}}</template>
              </el-table-column>
              <el-table-column label="其他应扣款项" min-width="100">
                <template slot-scope="scope">{{scope.row.otherDeductAmount | toThousands}}</template>
              </el-table-column>
              <el-table-column label="其他代扣款项" min-width="100">
                <template slot-scope="scope">{{scope.row.otherWithholdAmount | toThousands}}</template>
              </el-table-column>
              <el-table-column label="代扣调整款项" min-width="100">
                <template slot-scope="scope">{{scope.row.withholdChangesAmount | toThousands}}</template>
              </el-table-column>
              <el-table-column label="代扣学历提升扣款" min-width="120">
                <template slot-scope="scope">{{scope.row.educationDeduct | toThousands}}</template>
              </el-table-column>
              <el-table-column label="操作人" min-width="150">
                <template slot-scope="scope">
                  <el-popover v-show="scope.row.updateUserName||scope.row.createUserName" trigger="click" placement="top" width="450" @show="getUserInfoByUser(scope.row.updateUser||scope.row.createUser)">
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.updateUserName||scope.row.createUserName}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="提交状态" min-width="170">
                <template slot="header">
                  <el-select v-model="gatherParam.commitState" filterable placeholder="提交状态" clearable style="width:150px;" @change="JS_gatherSearch" class="selectRepairIcon">
                    <el-option v-for="item in submitStates" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </template>
                <template slot-scope="scope">
                  <span style="color:red;" v-if="scope.row.commitState === '0'">未提交</span>
                  <span v-else-if="scope.row.commitState === '1'">已提交</span>
                  <span style="color:red;" v-else-if="scope.row.commitState === '2'">
                    <el-tooltip v-if="scope.row.reportMsg" class="item" effect="dark" :content="scope.row.reportMsg" placement="top">
                      <span>提交失败</span>
                    </el-tooltip>
                    <span v-else>
                      提交失败
                    </span>
                  </span>
                  <span style="color:blue;" v-else-if="scope.row.commitState === '3'">忽略提交</span>
                  <span v-else></span>
                </template>
              </el-table-column>
              <el-table-column prop="updateTime" label="操作时间" min-width="150"></el-table-column>
              <el-table-column label="操作" fixed="right" min-width="100">
                <template slot-scope="scope">
                  <!-- 当上报成功或提交为已提交状态时修改不可操作 -->
                  <el-button v-if="scope.row.commitState==='2'" type="text" size="small" :disabled="isLockFlag" @click="ignoreSubmit(scope.row.id,'ignore','忽略')">忽略提交</el-button>
                  <el-button v-else-if="scope.row.commitState==='3'" type="text" size="small" :disabled="isLockFlag" @click="ignoreSubmit(scope.row.id,'cancle','取消忽略')">取消忽略</el-button>
                  <span v-else>--</span>
                </template>
              </el-table-column>
            </el-table>
            <!-- 总计 -->
            <div style="margin-top:10px">
              <el-alert :title="gatherAll" type="success" :closable="false"></el-alert>
            </div>
            <!-- 分页 -->
            <div id="pagination">
              <el-pagination background @size-change="gatherhandleSizeChange" @current-change="gatherhandlecurrentChange" :current-page="gatherPageObj.current" :page-sizes="[10,15,20,30,40]" :page-size="gatherPageObj.size" layout="total,sizes,prev,pager,next,jumper" :total="gatherPageObj.total"></el-pagination>
            </div>

          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 更多查询弹框 -->
    <el-dialog title="更多查询" :close-on-click-modal="false" :before-close="immediatelyCancel" :visible.sync="search_more" width="750px">
      <el-form :inline="true" :model="moreParam" ref="moreParam" class="mar-no">
        <el-form-item label="姓名">
          <el-input v-model.trim="moreParam.userName" @keyup.enter.native="inputEnterMore" placeholder="请输入名字" class="width155"></el-input>
        </el-form-item>
        <el-form-item label="员工编号">
          <el-input-number v-model="moreParam.employedNo" :controls="false" @keyup.enter.native="inputEnterMore" placeholder="请输入编号" class="width155" :min="0" :max="10000000000"></el-input-number>
        </el-form-item>
        <!-- <el-form-item label="身份证号">
          <el-input v-model.trim="moreParam.idCard" @keyup.enter.native="inputEnterMore" placeholder="身份证号" class="width155"></el-input>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="JS_immediately_cancel()">取消</el-button>
        <el-button type="primary" @click="inputEnterMore">立即搜索</el-button>
      </span>
    </el-dialog>

    <!-- 导入弹框 -->
    <el-dialog title="调整款项导入" :close-on-click-modal="false" :show-close="false" :visible.sync="uploadModal" width="550px">
      <el-form :model="uploadform" ref="uploadform" label-width="100px">
        <el-row>
          <el-col :md="24" style="margin: 10px 0 -10px 0;">
            <el-form-item label="所属部门" prop="department" label-width="70px" style="text-align:left">
              <el-input v-model="uploadform.department" placeholder="未获取到部门" disabled style="width:170px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24" class="clearfix mar-ver">
            <el-upload class="upload-demo" :multiple="false" :limit="1" ref="adjustUpload" :data="uploadform" :auto-upload="false" :action="adjustUploadActionUrl" :on-success="adjustHandleSuccess" :on-change="changeUpload" :headers="headers" :before-remove="beforeRemove" :before-upload="beforeUpload" :file-list="adjustFileList">
              <el-button slot="trigger" size="mediumn" @click="adjustUploadStatus.showBtn=true" class="cloud-uploadBtn">
                <i></i>&nbsp;导入数据
              </el-button>&nbsp;&nbsp;
              <el-button style="margin-left: 10px;" size="mediumn" type="success" @click="adjustSubmitUploadModal()">确认导入</el-button>&nbsp;&nbsp;
              <el-button size="mediumn" icon="el-icon-download" @click.stop="JS_download" class="pull-right">下载模板</el-button>
              <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
            </el-upload>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="importDigBtn">取消</el-button>
      </span>
    </el-dialog>

    <!-- 导入信息 -->
    <el-dialog title="导入信息" :show-close="false" :close-on-click-modal="false" :visible.sync="importProcessInfoDialog" width="600px">
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

    <!-- 调整款项导出 -->
    <el-dialog title="调整款项导出" :close-on-click-modal="false" :visible.sync="downloaddModal" width="450px">
      <p>
        <el-button size="mediumn" @click="exportToWary('调整款项',2)" class="cloud-downloadBtn">
          <i></i>&nbsp;导出至邮箱
        </el-button>&nbsp;&nbsp;
        <el-button size="mediumn" @click="exportToWary('调整款项',1)" class="cloud-downloadBtn">
          <i></i>&nbsp;导出至本地
        </el-button>
      </p>
      <!-- 导入之后的状态提示框 -->
      <el-alert title="温馨提示" type="warning" description="文件过大，可能要数秒到数分钟。" show-icon></el-alert>
    </el-dialog>

    <!-- 调整款项汇总导出 -->
    <el-dialog title="调整款项汇总导出" :close-on-click-modal="false" :visible.sync="downloaddModalGather" width="450px">
      <p>
        <el-button size="mediumn" @click="exportToWary('调整款项汇总',2)" class="cloud-downloadBtn">
          <i></i>&nbsp;导出至邮箱
        </el-button>&nbsp;&nbsp;
        <el-button size="mediumn" @click="exportToWary('调整款项汇总',1)" class="cloud-downloadBtn">
          <i></i>&nbsp;导出至本地
        </el-button>
      </p>
      <!-- 导入之后的状态提示框 -->
      <el-alert title="温馨提示" type="warning" description="文件过大，可能要数秒到数分钟。" show-icon></el-alert>
    </el-dialog>

  </div>
</template>

<script>
import Tools from "untils/index.js";
import { GET, POST, DELETE } from "http/custom.js";
import Filter from 'untils/filter.js';
import myMixin from "libs/mixin/index.js";
import tbMixin from "libs/mixin/tbMixin.js" //动态计算表格高度mixin

export default {
  name: "adjustMoneyManage",
  mixins: [myMixin, tbMixin],
  computed: {
    adjustGather() { //当前用户是否可见调整款项汇总tab     
      return Tools.includes(this.$store.state.userActionAll, 'bc15fd60d2074a639db4f8e1fb1a1499');
    }
  },
  data() {
    const adjustUploadActionUrl = process.env.VUE_APP_DOMAIN_personnel + "/personnel/adjustmentitem/import" //调整款项 导入action  线上
    let yd = Tools.getPYd() //获取当前年月 格式为 2019-07
    return {
      t_height: 360, //减去的高度
      gather_ht_top: 170,
      gather_ht_bot: Tools.getTbHeight(550), //设置表格的高
      headers: {},
      //更多条件
      moreParam: {
        userName: "", //用户名
        employedNo: undefined, //员工编号
        idCard: "" //身份证号
      },
      search_more: false, //更多条件框显示
      loadMap: new Map(), //记录tab页是否打开过了
      //所属部门
      deptOptions: [],
      //调整类型
      typeOptions: [],

      downloaddModal: false, //导出弹框 
      downloaddModalGather: false, //导出弹框
      importProcessInfoDialog: false,//导入进度弹框

      //-------------调整款项-------------
      loading: false, //table加载动画开关
      titleVal: "总计:",//总计
      adjustType: "",
      adjustUploadActionUrl,
      uploadModal: false, //显示导入框
      adjustFileList: [], // 需要导入的文件数组
      adjustUploadStatus: {
        showBtn: false,
        uploadSuccess: false, //上传文件成功标识符
        uploadError: false //上传文件失败标识符
      },
      adjustParam: {
        department: "", //部门
        searchDate: yd, //年月
        type: "", //调整类型
      },
      adjustPageObj: {
        size: 15, //每页显示记录条数
        current: 1, //当前页码
        total: 0, //总记录数据
        dataTable: [] //表格数据
      },
      // 导入的时的下拉
      uploadform: {
        //type: "",
        department: ""
      },
      //进度条相关参数
      importError: false,// 导入错误时呈现的进度 
      downloadErrorEveProcess: false, //获取错误下载key
      loadErrorExcel: false,
      downloadErrorKey: false,
      progressBackBtn: false, //返回按钮
      progressPercentAge: 0,
      uploadProcessInfo: {
        total: '',//总条数
        handler: '',//已处理条数
        successful: '',//处理成功条数
        failures: '', //处理失败条数
        finish: false,//是否处理完成
        dealAllTime: '',//总耗时
      },

      //-------------调整款项汇总-------------
      gatherloading: false, //table加载动画开关
      isLockFlag: false, //锁
      gatherParam: {
        adjustDate: Tools.getPYd(), //获取当前年月 格式为 2019-07
        employeeNo: undefined, //员工编号
        idNumber: "", //身份证号
        commitState: "", //提交状态
      },
      gatherPageObj: {
        size: 15, //每页显示记录条数
        current: 1, //当前页码
        total: 0, //总记录数据
        dataTable: [] //表格数据
      },
      personalInfoData: {}, //姓名popover弹窗数据
      gatherTableData: [],//
      gatherAll: "总计：", //总计

      SubmitStu: false, //提交数据状态
      successUpload: false, //导入状态
      activeName: "first",
      formSearch: {
        //调整款项tab
        name: "", //
        staffNum: "",
        searchDate: "",
        idCard: ""
      },
      //submitState: "",// 提交状态值
      submitStates: [ //提交状态
        { value: "0", label: "未提交" },
        { value: "1", label: "已提交" },
        { value: "2", label: "提交失败" },
        { value: "3", label: "忽略提交" }
      ],
      multipleSelection: []

    };
  },
  methods: {
    tabShow() {
      switch (this.activeName) {
        case "first":
          this.adjustTypFirst();
          this.runCallBackLink();
          return false;
        case "second":
          this.titleSearch();  //调整款项汇总表格
          return false;
        default:
          console.log("无匹配页！");
          return false;
      }
    },
    handleClick(tab, event) {
      //tab页切换 只有第一次页面切换时初始化数据
      console.log(tab, event);
      //判断页面是否打开过
      if (!this.loadMap.has(tab.name)) {
        this.tabShow();
        this.loadMap.set(tab.name, true);
      }
    },
    searchMoreClick() {
      //点击更多查询清空条件
      this.search_more = true; // 显示条件框
    },
    beforeRemove(file) {
      //删除文件之前的钩子
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
    //提示框
    messagePopp(type, msg) {
      this.$message({
        showClose: true,
        type: type,
        message: msg
      });
    },

    //*********************调整款项********************
    handleCommand2(command) {//更多操作下拉框
      console.log(command)
      if (command == 'a') {
        this.uploadModal = true
      }
      else if (command == 'b') {
        // this.downloadModal = true
        this.downloaddModal = true
      }
      else if (command == 'c') {
        this.deleteItem()//全部删除
      }
    },
    //111
    deleteItem() {
      this.$msgBox.confirm('你确定要删除当前搜索条件下的调整款项吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let obj = {
          adjustDate: this.adjustParam.searchDate,
          adjustType: this.adjustParam.type || "",
          deptCode: this.adjustParam.department || "",
          employeeName: this.moreParam.userName,
          idNumber: this.moreParam.idCard,
          employeeNo: this.moreParam.employedNo || ""
        }
        console.log(obj)
        POST(process.env.VUE_APP_DOMAIN_personnel + '/personnel/adjustmentitem/batchDelete', obj).then(res => { //单条数据删除
          if (res.code == 0) {
            this.$message.success("删除成功!");
            this.JS_adjustSearch()
          }
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
    inputEnterMore() { // enter 键
      this.JS_adjustSearch();
      this.search_more = false;//关闭更多查询
    },
    JS_download() { //下载模板
      GET(process.env.VUE_APP_DOMAIN_personnel + "/queryBizFilesTemplate", //公共接口
        {
          fileCode: 'PERSONNEL_ADJUSTMENT_IMPORT_TEMPLATE',
          name: "调整款项"
        }).then(res => {
          //获取模板存储返回的ID
          window.location.href = `${process.env.VUE_APP_DOMAIN_download}/oss/download?key=${res.data.fileTemplateId}&name=${res.data.fileTemplateName}.${res.data.fileTemplateSuffix}`;
        }).catch(error => {
          console.log(error);
        });
    },
    exportToWary(type, wary) { //导出
      //提出一个公用方法
      const juge = (url, uStr, objs) => {
        if (wary === 1) {//wary 导出方式   1直接下载  2 发到邮箱
          this.messagePopp("success", "已经导出至本地！");
          let urls = process.env.VUE_APP_DOMAIN_personnel + url + uStr + wary; // 已经导出至本地！
          console.log(urls);
          window.location.href = urls;
        } else {
          GET(process.env.VUE_APP_DOMAIN_personnel + url, objs).then(() => { //导出至邮箱    这个接口没有返回值，后台要求直接提示
            this.messagePopp("success", "已经导入至您的邮箱！");
          }).catch(error => {
            this.messagePopp("success", "已经导入至您的邮箱！");
            console.log(error);
          });
        }
      };
      let hr, urlStr, obj;
      if (type === "调整款项") { //调整款项
        hr = "/personnel/adjustmentitem/export";
        urlStr = "?token=" + localStorage.getItem("token")
          + "&deptCode=" + (this.adjustParam.department || "")
          + "&adjustDate=" + this.adjustParam.searchDate
          + "&adjustType=" + (this.adjustParam.type || "")
          + "&exportType="; // wary 导出方式   1直接下载  2 发到邮箱
        obj = {
          deptCode: this.adjustParam.department || "",
          adjustDate: this.adjustParam.searchDate,
          adjustType: this.adjustParam.type || "",
          exportType: wary
        }
        juge(hr, urlStr, obj);
        this.downloaddModal = false; // 关闭导出弹框
      } else {  //调整款项汇总 
        hr = "/personnel/adjustmentsummary/export";
        urlStr = "?token=" + localStorage.getItem("token")
          + "&batch=" + this.adjustParam.searchDate
          + "&exportType="; // wary 导出方式   1直接下载  2 发到邮箱
        obj = {
          batch: this.adjustParam.searchDate,
          exportType: wary
        }
        juge(hr, urlStr, obj);
        this.downloaddModalGather = false;  // 关闭导出弹框
      }
    },
    adjustTypFirst() {  //调整类型
      GET(process.env.VUE_APP_DOMAIN_personnel + "/personnel/personneldic/getAll", { dicType: 5 }).then(res => {
        this.typeOptions = res.data;

      }).catch(error => {
        console.log(error);
      });
    },
    //************************************************ 通过 promise 避免回调地狱 实现的三个有依赖的接口 *************************
    runCallBackLink() { //使用promise 避免回调依赖    
      const returnPromise = (url) => {
        return new Promise((resolve, reject) => {
          GET(process.env.VUE_APP_DOMAIN_personnel + url).then(res => {
            resolve(res);
          }).catch(error => {
            reject(error);
          });
        });
      };

      let that = this;
      let dept = ""; // 防止下拉先渲染 key 时会有闪现，应先加载下拉列表

      returnPromise("/personnel/adjustmentitem/userDept").then(function (resPerDept) { //个人所属部门 回调
        that.uploadform.department = resPerDept.data.departmentName || "";
        dept = resPerDept.data.departmentId; //防止对应的部门填上后有回闪，用 dept 在下个回调中回填
        return returnPromise("/personnel/adjustmentitem/queryDepartmentList");

      }).then(function (resType) {//部门类型 回调
        that.adjustParam.department = dept;
        that.deptOptions = resType.data;
        that.JS_adjustSearch(); //调整款项表格
      });

    },
    //************************************************ 通过 层层回调来实现的三个依赖接口 *************************   

    unloadErrorLink() {//导入错误模板下载
      console.log('downloadErrorKey', this.downloadErrorKey);
      let url = process.env.VUE_APP_DOMAIN_download + '/oss/download?key=' + this.downloadErrorKey + '&token=' + localStorage.getItem("token") + "&name=" + encodeURI("调整项失败明细") + ".xlsx";
      window.location.href = url;
    },
    //*************************************上传 */
    JS_immediately_cancel() { //取消
      this.search_more = false;
    },
    immediatelyCancel() {
      this.search_more = false;
    },
    changeUpload(file, fileList) {//文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
      console.log('change', file)
      console.log('fileList', fileList)
    },
    JS_download_close() { //取消上传
      this.uploadModal = false;
      this.$refs.adjustUpload.clearFiles();
    },
    adjustSubmitUploadModal() {//确认上传按钮
      let upFile = this.$refs.adjustUpload.uploadFiles; //submit();
      if (upFile.length === 0) {
        this.messagePopp("warning", "请选取文件！");
      } else {
        this.$refs.adjustUpload.submit(); //手动上传
      }
      console.log("所选的部门ID：" + this.uploadform.department);
    },
    importDigBtn() { //导入框取消
      this.uploadModal = false;
      this.$refs.adjustUpload.clearFiles(); //清除上传的文件
    },
    adjustHandleSuccess(res) { //上传文件接口调取成功回调;
      this.uploadModal = false;  //关闭导入弹框
      if (res.code === 0) { // 文件上传成功      
        this.importError = true;  //导入进度条
        this.downloadErrorEveProcess = res.data; //获取进度条事件句柄

        //错误导入进度条与下载模板
        this.importProcessInfoDialog = true
        this.queryProgress() //获取上传文件进度条信息
        console.log("上传数据成功", res);
      } else {
        let msgError = res.msg || '【系统无法识别EXCLE中的空白、公式和非法字符。请先清理】。' //50*非0情况
        this.$msgBox.alert(`<span style="color:red;">${msgError} </span>`, '温馨提示', {
          dangerouslyUseHTMLString: true
        })
      }
      this.$refs.adjustUpload.clearFiles(); //清除上传的文件
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
            this.JS_adjustSearch();//刷新页面

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
      this.progressPercentAge = 0; //进度条清空为0
      this.progressBackBtn = false; //隐藏返回按钮
      this.loadErrorExcel = false; // 隐藏下载失败链接
    },
    //************************************上传所用方法结束  */
    ignoreSubmit(id, statuUrl, msg) {//忽略,取消忽略上报     
      //单个忽略,取消忽略上报
      this.$msgBox.confirm(`你确定要${msg}上报该条数据吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const obj = {
          ids: id
        };
        GET(process.env.VUE_APP_DOMAIN_personnel + "/personnel/adjustmentsummary/" + statuUrl, obj).then(() => {
          //单条忽略,取消忽略上报
          this.messagePopp("success", `${msg}上报成功!`);
          this.gatherSearch() //刷新表格，重新获取数据 
        }).catch(error => {
          console.log(error)
        })
      }).catch(() => {

      })
    },
    JS_adjustSearch() {
      this.adjustPageObj.current = 1;
      this.adjustSearch();
    },
    adjustSearch() {
      //基本参数
      const { size, current } = this.adjustPageObj; //对象的结构
      //合并对象
      let searchObj = Object.assign({
        adjustDate: this.adjustParam.searchDate,
        adjustType: this.adjustParam.type || "",
        deptCode: this.adjustParam.department || "",
        employeeName: this.moreParam.userName,
        idNumber: this.moreParam.idCard,
        employeeNo: this.moreParam.employedNo,
      }, { size, current });
      this.loading = true;
      let that = this;
      POST(process.env.VUE_APP_DOMAIN_personnel + "/personnel/adjustmentitem/adjustmentitems", searchObj).then(res => {
        this.loading = false;
        //应扣调整款项
        this.adjustPageObj.dataTable = res.data.records; //set表格的值
        this.adjustPageObj.dataTable.forEach((item, index) => {
          let itm = that.getTypeName(item);
          if (itm) {
            item.adjustType = itm.dicTypeName; //用于页面展示 把调整类型id 换成 name
          } else {
            item.adjustType = "代扣学历提升扣款";
          }
        });
        this.adjustPageObj.size = res.data.size; //每页显示记录条数
        this.adjustPageObj.current = res.data.current; // set当前页
        this.adjustPageObj.total = res.data.total; //总记录数据
        this.adjustTitle(); //调整项总计

      }).catch(error => {
        console.log(error);
      });
    },
    handleSizeChange_adjust(val) {//分页,下拉
      this.adjustPageObj.size = val;
      this.adjustSearch();
    },
    handlecurrentChange_adjust(val) { //当前页，点击页码
      this.adjustPageObj.current = val;
      this.adjustSearch();
    },
    adjustTitle() {// 调整项总计
      let that = this;
      POST(process.env.VUE_APP_DOMAIN_personnel + "/personnel/adjustmentitem/totalData", {
        adjustDate: this.adjustParam.searchDate,
        adjustType: this.adjustParam.type || "",
        deptCode: this.adjustParam.department || ""
      }).then(res => {
        if (res.code === 0) {//总笔数：笔
          that.titleVal = `总计：本月调整总人数：${res.data.empCount || "--"}人;    总金额：${res.data.amount !== 0 ? Filter.toThousands(res.data.amount) || "--" : 0.00}元`;
        } else {
          that.titleVal = `总计：`;
        }

      }).catch(error => {
        console.log(error)
      })
    },
    deleteThis(id) {
      //删除
      this.$msgBox.confirm("你确定要删除该条数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        DELETE(process.env.VUE_APP_DOMAIN_personnel + "/personnel/adjustmentitem/delete", { ids: id }).then(res => {
          console.log("删除成功!" + res);
          this.adjustSearch();
        }).catch(error => {
          console.log(error);
        });
      }).catch(() => {
        this.messagePopp("info", "已取消删除!");
      });
    },
    JS_upload() {
      this.successUpload = true;
    },

    //*********************调整款项汇总******************    
    JS_gatherSearch() {
      this.gatherPageObj.current = 1;
      this.gatherSearch();
    },
    titleSearch() { //点击搜索按钮
      this.gatherParam.commitState = "";
      this.JS_gatherSearch();
    },
    getTypeName(item) {//获取id对应的调整类型
      let itm = this.typeOptions.find(v => {
        return item.adjustType + '' === v.dicTypeValues;
      });
      return itm;
    },
    searchZongji() { // 第一个表格 汇总
      let that = this;
      GET(process.env.VUE_APP_DOMAIN_personnel + "/personnel/adjustmentsummary/adjustmentSummaryCountInfo", { batch: this.gatherParam.adjustDate }).then(res => {
        this.gatherTableData = res.data;
        this.gatherTableData.forEach((item, index) => {
          let itm = that.getTypeName(item);
          if (itm) {
            item.adjustType = itm.dicTypeName; //用于页面展示 把调整类型id 换成 name
          } else {
            item.adjustType = "代扣学历提升扣款";
          }
        });
        console.log(res.data.records);
      }).catch(error => {
        console.log(error);
      });
    },
    gatherSearch() {
      //基本参数
      const { size, current } = this.gatherPageObj; //对象的结构
      //合并对象
      this.gatherParam.commitState = this.gatherParam.commitState || ""; // 表头中的下拉可能会是空值
      let searchObj = Object.assign(this.gatherParam, { size, current });
      console.log(searchObj);
      this.gatherloading = true;
      POST(process.env.VUE_APP_DOMAIN_personnel + "/personnel/adjustmentsummary/adjustmentsummarys", searchObj).then(res => {
        this.gatherloading = false;
        //应扣调整款项
        this.gatherPageObj.dataTable = res.data.records; //set表格的值
        this.gatherPageObj.size = res.data.size; //每页显示记录条数
        this.gatherPageObj.current = res.data.current; // set当前页
        this.gatherPageObj.total = res.data.total; //总记录数据     

        this.searchZongji(); // 头部第一个表
        this.adjustmentsummary(); //底部总计
      }).catch(error => {
        console.log(error);
      });
      this.isLock(); //特殊判断数据是否上锁
    },
    isLock() {//判断数据是否上锁 
      GET(process.env.VUE_APP_DOMAIN_personnel + "/personnel/adjustmentsummary/adjustmentItemSummaryLockStatus", {
        batch: this.gatherParam.adjustDate
      }).then(res => {
        //console.log("判断数据是否上锁", res)
        if (res.code === 0) {
          this.isLockFlag = false; //未锁
        } else if (res.code === 3) {
          this.isLockFlag = true; //已锁， 不要怀疑这个状态，后端是这么定的
        }
        console.log(this.isLockFlag);
      }).catch(error => {
        console.log(error)
      })
    },
    //根据员工编号获取个人信息
    adjustmentsummary() {
      GET(process.env.VUE_APP_DOMAIN_personnel + "/personnel/adjustmentsummary/totalData", {
        batch: this.gatherParam.adjustDate
      }).then(res => {
        if (res.code === 0) {//总笔数：笔
          console.log(Filter.toThousands(res.data.totalAmount));
          this.gatherAll = `总计：本月调整总笔数：${res.data.totalNum !== 0 ? res.data.totalNum || "--" : 0}笔；总人数：${res.data.totalPersonNum !== 0 ? res.data.totalPersonNum || "--" : 0}人；
          总金额：${res.data.totalAmount !== 0 ? Filter.toThousands(res.data.totalAmount) || "--" : 0.00} 元；
          已提交：${res.data.commitNum !== 0 ? res.data.commitNum || "--" : 0}条，未提交：${res.data.notCommitNum !== 0 ? res.data.notCommitNum || "--" : 0}条`;
        } else {
          this.gatherAll = `总计：`;
        }
      }).catch(error => {
        this.personalInfoData = {};
        console.log(error);
      });
    },
    //根据员工编号获取个人信息
    getUserInfoAdjust(num) {
      GET(process.env.VUE_APP_DOMAIN_personnel + "/userInfo", { aid: num })
        .then(res => {
          this.personalInfoData = res.data;
          this.personalInfoData.employedDates = this.personalInfoData.employedDates.split(" ")[0];
          console.log(this.personalInfoData);
        })
        .catch(error => {
          this.personalInfoData = {};
          console.log(error);
        });
    },
    //根据createUser获取个人信息
    getUserInfoByUser(num) {
      GET(process.env.VUE_APP_DOMAIN_personnel + "/queryUserInfoToRegid", { regid: num })
        .then(res => {
          this.personalInfoData = res.data;
          this.personalInfoData.employedDates = this.personalInfoData.employedDates.split(" ")[0];
          console.log(this.personalInfoData);
        })
        .catch(error => {
          this.personalInfoData = {};
          console.log(error);
        });
    },
    gatherhandleSizeChange(val) {
      this.gatherPageObj.size = val;
      this.gatherSearch();
    },
    gatherhandlecurrentChange(val) {
      this.gatherPageObj.current = val;
      this.gatherSearch();
    },
    JS_report_data() {// 上报数据 
      this.$msgBox.confirm(`<span>请确认要上报${this.gatherParam.adjustDate}的数据</span><span style="color:red;">【调整款项汇总】</span><span>无误。</span>`,
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
        POST(process.env.VUE_APP_DOMAIN_personnel + "/personnel/adjustmentsummary/reportAdjustmentItemSummary",
          {
            batch: this.gatherParam.adjustDate
          }).then(() => {
            allLoading.close(); //关闭loading
            this.messagePopp("success", "上报数据成功！");
            this.gatherSearch(); //搜索并且判断数据是否上锁

          }).catch(error => {
            this.gatherSearch(); //后台有部分数据失败时刷新
            allLoading.close(); //关闭loading
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
        POST(process.env.VUE_APP_DOMAIN_personnel + "/personnel/adjustmentsummary/unlockAdjustmentItemSummary",
          {
            batch: this.gatherParam.adjustDate
          }).then(res => {
            console.log("取消上报", res)
            this.messagePopp("success", "取消上报数据成功！");
            this.gatherSearch() //搜索并且判断数据是否上锁
          }).catch(error => {
            console.log(error)
          })
      }).catch(() => {

      })
    },
    handleCommand(command) {
      //更多操作下拉框
      switch (command) {
        case "a":
          this.downloaddModalGather = true; //导出
          break;
        case "b":
          this.JS_create_data(); //生成汇总数据
          break;
        case "c":
          this.reset(); //重置
          break;
        default:
          console.log("default");
          return;
      }
    },
    reset() { //重置数据 
      this.$msgBox.confirm(`<span>确定重置${this.gatherParam.adjustDate}数据？</span>`, "温馨提示",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        GET(process.env.VUE_APP_DOMAIN_personnel + "/personnel/adjustmentsummary/resetAdjustmentItemSummary",
          {
            batch: this.gatherParam.adjustDate
          }).then(res => {
            if (res.code === 0) { //0 时成功
              //this.messagePopp("success", "重置成功！");
              this.JS_gatherSearch(); //搜索并且判断数据是否上锁
            }
          }).catch(error => {
            console.log(error);
          })
      }).catch(() => {
        console.log("失败");
      })
    },
    JS_create_data() {//生成汇总数据
      this.$msgBox.confirm(
        '<span>确定生成汇总数据？</span>',
        "温馨提示",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        GET(process.env.VUE_APP_DOMAIN_personnel + "/personnel/adjustmentsummary/countAdjustment",
          {
            batch: this.gatherParam.adjustDate
          }).then(() => {
            this.messagePopp("success", "生成汇总数据成功！");
            this.JS_gatherSearch(); //搜索并且判断数据是否上锁
          }).catch(error => {
            console.log(error)
          })
      }).catch(() => {

      })
    }
  },
  created() {
    //页面数据初始化
    this.headers["x-user-token"] = localStorage.getItem("token"); //设置上传数据文件excel的token
    console.log(this.activeName);
    this.loadMap.set("first", true); //记录每一个tab页已经加载
    this.tabShow();
  }
};
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





