<template>
  <div class="adjustMoneyManage" style="position:relative">
    <div class="guide">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home/financialSystem' }">财务系统</el-breadcrumb-item>
        <el-breadcrumb-item>个税管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/financialSystem' }">(返回上级)</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="bgWhite mgt15">
      <!-- 查询栏 start @tab-click="handleClick"-->
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="每月税金计算明细" name="first">
          <div class="pull-left">
            <el-form :inline="true" class="mar-no">
              <el-form-item label="姓名">
                <el-input @keyup.enter.native="JS_search" v-model.trim="name" placeholder="请输入姓名" class="width155" clearable></el-input>
              </el-form-item>
              <el-form-item label="员工编号">
                <el-input-number @keyup.enter.native="JS_search" v-model="aid" placeholder="请输入员工编号" :controls="false" class="width155" :min="0" :max="10000000000"></el-input-number>
              </el-form-item>
              <el-form-item label="查询年月">
                <el-date-picker v-model="batch" :editable="false" type="month" class="width155" value-format="yyyy-MM" :clearable="false" placeholder="选择年月"></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="titleSerach" icon="el-icon-search">搜索</el-button>
                <el-button icon="el-icon-search" @click="search_more = true">更多查询</el-button>
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
                  <i></i>&nbsp;导入
                </el-dropdown-item>
                <el-dropdown-item command="b" divided class="cloud-downloadBtn">
                  <i></i>&nbsp;导出
                </el-dropdown-item>
                <el-dropdown-item command="c" :disabled="isLockFlag" divided>一键生成个税</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>&nbsp;
            <el-button size="small" type="danger" v-if="isLockFlag===false" @click="JS_report_data">上报数据</el-button>
            <el-button size="small" v-if="isLockFlag===true" @click="JS_cancel_report">取消上报</el-button>
          </div>
          <div class="table_wrap">
            <el-table v-loading="loading" :height="t_height" :data="taxMonthDetailsListData" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
              <el-table-column type="index" label="序号" min-width="50"></el-table-column>
              <el-table-column label="员工编号" min-width="150">
                <template slot-scope="scope">
                  <span>{{scope.row.employeeNo}}</span>
                  <i class="el-icon-phone tbIconPhone"></i>
                </template>
              </el-table-column>
              <el-table-column label="姓名" min-width="150">
                <template slot-scope="scope">
                  <el-popover v-show="scope.row.employeeName" trigger="click" placement="top" width="450" @show="getUserInfo(scope.row.employeeNo)">
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.employeeName}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="idNumber" label="身份证号" min-width="160"></el-table-column>
              <el-table-column prop="batch" label="发放年月" min-width="80"></el-table-column>
              <el-table-column prop="employeeUnits" label="发放单位" min-width="150"></el-table-column>
              <el-table-column label="综合应发薪酬合计" min-width="120">
                <template slot-scope="scope">{{scope.row.totalPayableSalary | toThousands}}</template>
              </el-table-column>
              <el-table-column label="扣款合计">
                <template slot-scope="scope">{{scope.row.totalDeductions | toThousands}}</template>
              </el-table-column>
              <el-table-column prop="actuaSalary" label="本期收入">
                <template slot-scope="scope">{{scope.row.actuaSalary | toThousands}}</template>
              </el-table-column>
              <el-table-column label="全年累计收入额(导入版)" min-width="150">
                <template slot-scope="scope">{{scope.row.yearSalaryImport | toThousands}}</template>
              </el-table-column>
              <el-table-column label="全年累计收入额" min-width="110">
                <template slot-scope="scope">{{scope.row.yearSalary | toThousands}}</template>
              </el-table-column>
              <el-table-column label="累计五险一金" min-width="110">
                <template slot-scope="scope">{{scope.row.totalInsuranceFund | toThousands}}</template>
              </el-table-column>
              <el-table-column label="累计专项扣除" min-width="110">
                <template slot-scope="scope">{{scope.row.totalSpecialDeductions | toThousands}}</template>
              </el-table-column>
              <el-table-column label="累计子女教育" min-width="110">
                <template slot-scope="scope">{{scope.row.childrensEducationExpend | toThousands}}</template>
              </el-table-column>
              <el-table-column label="累计住房贷款利息" min-width="130">
                <template slot-scope="scope">{{scope.row.housingLoanExpend | toThousands}}</template>
              </el-table-column>
              <el-table-column prop="housingRentExpend" label="累计住房租金" min-width="110">
                <template slot-scope="scope">{{scope.row.housingRentExpend | toThousands}}</template>
              </el-table-column>
              <el-table-column label="累计赡养老人" min-width="110">
                <template slot-scope="scope">{{scope.row.supportParentExpend | toThousands}}</template>
              </el-table-column>
              <el-table-column label="累计继续教育" min-width="110">
                <template slot-scope="scope">{{scope.row.continuingEducationExpend | toThousands}}</template>
              </el-table-column>
              <el-table-column label="大病医疗附加专项扣除" min-width="150">
                <template slot-scope="scope">{{scope.row.seriousIllnessExpend | toThousands}}</template>
              </el-table-column>
              <el-table-column label="累计减除费用" min-width="110">
                <template slot-scope="scope">{{scope.row.totalReduceAmount | toThousands}}</template>
              </el-table-column>
              <el-table-column label="累计已缴个税" min-width="110">
                <template slot-scope="scope">{{scope.row.totalPersonalTax | toThousands}}</template>
              </el-table-column>
              <el-table-column label="个税状态" min-width="170">
                <template slot="header">
                  <el-select v-model="taxState" filterable placeholder="个税状态" clearable style="width:150px;" @change="JS_search" class="selectRepairIcon">
                    <el-option v-for="item in taxStates" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </template>
                <template slot-scope="scope">
                  <span style="color:green" v-if="scope.row.createState === 0">待生成</span>
                  <span v-else-if="scope.row.createState === 1">已生成</span>
                  <span v-else></span>
                </template>
              </el-table-column>
              <el-table-column label="本期应缴税额" min-width="110">
                <template slot-scope="scope">{{scope.row.batchPersonalTax | toThousands}}</template>
              </el-table-column>
              <el-table-column label="提交状态" min-width="170">
                <template slot="header">
                  <el-select v-model="submitState" filterable placeholder="提交状态" clearable style="width:150px;" @change="JS_search" class="selectRepairIcon">
                    <el-option v-for="item in submitStates" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </template>
                <template slot-scope="scope">
                  <span style="color:red;" v-if="scope.row.commitState === 0">未提交</span>
                  <span v-else-if="scope.row.commitState === 1">已提交</span>
                  <span style="color:red;" v-else-if="scope.row.commitState === 2">
                    <el-tooltip v-if="scope.row.errorMsg" class="item" effect="dark" :content="scope.row.errorMsg" placement="top">
                      <span>提交失败</span>
                    </el-tooltip>
                    <span v-else>
                      提交失败
                    </span>
                  </span>
                  <span style="color:blue;" v-else-if="scope.row.commitState === 3">忽略提交</span>
                  <span v-else></span>

                </template>
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
              <el-table-column prop="createTime" label="操作时间" min-width="150"></el-table-column>
              <el-table-column label="操作" fixed="right" min-width="100">
                <template slot-scope="scope">
                  <!-- 当上报成功或提交为已提交状态时修改不可操作 -->
                  <el-button v-if="scope.row.commitState===2" type="text" size="small" :disabled="isLockFlag" @click="ignoreSubmit(scope.row.id,'ignore','忽略')">忽略提交</el-button>
                  <el-button v-else-if="scope.row.commitState===3" type="text" size="small" :disabled="isLockFlag" @click="ignoreSubmit(scope.row.id,'cancle','取消忽略')">取消忽略</el-button>
                  <span v-else>--</span>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div id="pagination">
              <el-pagination @size-change="handleSizeChange" @current-change="handlecurrentChange" background :current-page="currentPage" :page-sizes="[10,15,20,30,40]" :page-size="size" layout="total,sizes,prev,pager,next,jumper" :total="total"></el-pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 更多查询弹框 -->
    <el-dialog title="更多查询" id="perTaxMandialog" :before-close="handleModifyClose" :close-on-click-modal="false" :visible.sync="search_more" width="550px">
      <el-form :inline="true" class="mar-no" ref="searchConditionform">
        <el-form-item label="个税状态">
          <el-select v-model="taxState" placeholder="请选择" class="width155" filterable clearable>
            <el-option v-for="item in taxStates" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提交状态" style="float:right;margin-right: 0 ;">
          <el-select v-model="submitState" placeholder="请选择" class="width155" filterable clearable>
            <el-option v-for="item in submitStates" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="JS_search_cancel('searchConditionform')">取消</el-button>
        <el-button type="primary" @click="JS_imi_search">立即搜索</el-button>
      </span>
    </el-dialog>

    <!-- 一键生成个税 -->
    <el-dialog title="一键生成个税" :close-on-click-modal="false" :visible.sync="taxForm" width="450px">
      <el-alert title="温馨提示！" :closable="false" type="warning" description="尊敬的管理员，您正在使用一键生成个税功能，一经确认，个税将通过相关计算公式生成本期应缴税额，为了确保计算税金的准确性，请核对各项数据是否已正常导入与采集，请再次确定是否继续？" show-icon></el-alert>
      <el-form :model="yearSalaryForm" label-width="200px" style="padding:10px 10px 0">
        <el-form-item label="请选择全年累计收入额数据源" prop="yearSalarySource">
          <el-select v-model="yearSalaryForm.type" placeholder="请选择">
            <el-option v-for="item in yearSalarySourceOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <p class="clearfix" style="text-align: right;">
        <span slot="footer" class="dialog-footer ">
          <el-button @click="taxForm = false">取消</el-button>
          <el-button type="primary" @click="submitTaxForm">确认生成</el-button>
        </span>
      </p>
    </el-dialog>

    <!-- 导出个税 -->
    <el-dialog title="导出个税" :close-on-click-modal="false" :visible.sync="exportForm" width="520px">
      <el-alert title="温馨提示！" :closable="false" type="warning" description="尊敬的管理员，感谢您使用后台数据导出系统，该功能用于导出调整款项数据，可根据查询条件进行导出，因您导出的文件属于公司保密信息，请务必妥善保管与使用以保证您导出文件信息安全，一旦私自外泄，将严格按照公司信息安全规章制度进行处理！" show-icon></el-alert>
      <p class="clearfix" style="text-align: right;">
        <span slot="footer" class="dialog-footer">
          <el-button @click="exportForm = false">取消</el-button>
          <el-button type="primary" @click="exportTaxForm">确认导出</el-button>
        </span>
      </p>
    </el-dialog>

    <!-- 扣款项导入弹框 -->
    <el-dialog title="个税导入" :before-close="fileClose" :close-on-click-modal="false" :show-close="false" :visible.sync="uploadModal" width="520px">
      <p class="clearfix">
        <el-upload ref="upload" class="pull-left" :action="uploadActionUrl" :headers="headers" :before-remove="beforeRemove" :before-upload="beforeUpload" :on-success="handleSuccess">
          <el-button size="mediumn" icon="el-icon-upload">导入数据</el-button>
          <el-button size="mediumn" style="margin-left:15px;" icon="el-icon-download" @click.stop="uploadLink">下载模板</el-button>
          <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
        </el-upload>
      </p>
      <el-alert title="温馨提示！" type="warning" description="尊敬的管理员，该功能用于导入每月的个税相关信息，为确保能够正常导入，请在导入前参考导入模板核对数据格式，确保数据格式无误后，再进行导入操作，导入完成后，请及时核对数据的准确性。" show-icon></el-alert>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadModal = false">取消</el-button>
      </span>
    </el-dialog>

    <!-- 导入进度条 -->
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

    <!-- <el-dialog title="导入信息" :close-on-click-modal="false" :show-close="false" :visible.sync="importProcessInfoDialog" width="600px">
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
    </el-dialog> -->

    <!-- 生成个税进度条 -->
    <el-dialog title="生成个税" :close-on-click-modal="false" :show-close="false" :visible.sync="importProcessInfoDialog_tax" width="600px">
      <div class="pad-all mar-ver">
        <el-progress :text-inside="true" :stroke-width="20" :percentage="progressPercentAge_tax"></el-progress>
        <p>正在生成个税，本次需生成{{uploadProcessInfo_tax.total | repair}}条，<span style="color:#66b1ff">成功{{uploadProcessInfo_tax.successful | repair}}条</span>，<span style="color:red">失败{{uploadProcessInfo_tax.failures | repair}}条</span>，总耗时{{uploadProcessInfo_tax.dealAllTime}}</p>
        <!-- <p v-show="loadErrorExcel_tax">
          <el-button type="text" @click="unloadErrorLink_tax" class="underlineTxt">点击下载导入失败明细</el-button><span style="color:#a1a1a1">(导入失败明细已发送到您内网邮箱)</span>
        </p> -->
      </div>
      <span slot="footer" class="dialog-footer" v-show="progressBackBtn_tax">
        <el-button type="primary" @click="importProgress_tax">返回</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import myMixin from "libs/mixin/index.js"
import { GET, POST } from "http/custom.js";
import Tools from "untils/index.js";

export default {
  name: "filialPietyFee",
  mixins: [myMixin], //混合模式
  data() {
    const uploadActionUrl = process.env.VUE_APP_DOMAIN_financial + "/tax/financialtaxdata/import"; //导入action 线上，数据导入接口
    return {
      t_height: Tools.getTbHeight(315), //设置表格的高
      uploadActionUrl,
      isLockFlag: false, //是否上锁
      search_more: false, // 显示条件框
      headers: {}, //上传图片请求头
      uploadModal: false, //导入
      importProcessInfoDialog: false,//导入进度弹框
      downloadErrorKey: '',//导入错误下载excel key
      downloadErrorEveProcess: '',//进度事件句柄
      progressPercentAge: 0, //进度条如 80%就是 80
      loadErrorExcel: false,//呈现下载链接
      progressBackBtn: false, // 返回按钮
      uploadProcessInfo: {
        total: '',//总条数
        handler: '',//已处理条数
        successful: '',//处理成功条数
        failures: '', //处理失败条数
        finish: false,//是否处理完成
        dealAllTime: '',//总耗时
      },
      personalInfoData: {}, //姓名popover弹窗数据
      size: 15, //每页显示记录条数
      currentPage: 1, //当前页码
      total: 0, //总记录数据
      loading: false, //table加载动画开关
      activeName: "first",
      aid: undefined, //员工编号
      name: "", //员工姓名
      batch: Tools.getPYd(), //获取当前年月 格式为 2019-07
      taxState: "", //个税状态值
      taxForm: false, // 个税提示框
      exportForm: false, // 导出个税提示框
      submitState: "", //提交状态值
      taxMonthDetailsListData: [], //每月税金计算明细
      yearSalaryForm: {//全年累计收入额数据源表单
        type: '1'
      },
      yearSalarySourceOptions: [//全年累计收入额数据源option        
        { value: '1', label: '系统自动计算版' },
        { value: '2', label: '导入版' }
      ],
      taxStates: [  //个税状态
        { value: "1", label: "已生成" },
        { value: "0", label: "待生成" }
      ],
      submitStates: [ //提交状态
        { value: "0", label: "未提交" },
        { value: "1", label: "已提交" },
        { value: "2", label: "提交失败" },
        { value: "3", label: "忽略提交" }
      ],
      //个税进度条相关参数
      importProcessInfoDialog_tax: false, //取消进度条框
      importError_tax: false,// 导入错误时呈现的进度 
      downloadErrorEveProcess_tax: false, //获取错误下载key
      loadErrorExcel_tax: false, //呈现失败下载明细
      downloadErrorKey_tax: false,
      progressPercentAge_tax: 0,
      progressBackBtn_tax: false, //返回按钮
      uploadProcessInfo_tax: {
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
    ignoreSubmit(id, statusURL, msg) {//忽略,取消忽略上报
      //单个忽略,取消忽略上报
      this.$msgBox.confirm(`你确定要${msg}上报该条数据吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        GET(process.env.VUE_APP_DOMAIN_financial + "/tax/financialtaxdata/" + statusURL, { ids: id }).then(res => {
          //单条忽略,取消忽略上报
          this.messagePopp("success", `${msg}上报成功!`);
          this.search(); //刷新表格，重新获取数据
        }).catch(error => {
          console.log(error)
        })
      }).catch(() => {
        console.log("取消");
      })
    },
    JS_imi_search() {// 关闭更多条件窗口
      this.search_more = false;
      this.JS_search();
    },
    titleSerach() { //点击搜索
      this.submitState = ""; // 清空提交状态
      this.taxState = ""; // 清空个税状态
      this.JS_search();
    },
    JS_search() {
      this.current = 1;
      this.search();
    },
    //查询对象,初始化值
    search() {
      let searchObj = {
        batch: this.batch || "", //年月（批次号）
        employeeName: this.name, //员工姓名
        employeeNo: this.aid, //员工编号
        commitState: this.submitState || "", //提交
        createState: this.taxState, //个税
        current: this.currentPage, //当前页码
        size: this.size //每页显示记录条数
      };
      this.loading = true; //开启动画
      //调取数据
      POST(
        process.env.VUE_APP_DOMAIN_financial + "/tax/financialtaxdata/list",
        searchObj
      ).then(res => {
        this.loading = false;
        //每月税金计算明细
        this.taxMonthDetailsListData = res.data.records;
        this.currentPage = res.data.current; //当前页
        this.size = res.data.size; //每页显示记录条数先
        this.total = res.data.total; //总记录数据
      }).catch(error => {
        this.loading = false;
        console.log(error);
      });
      this.isLock(); //特殊判断数据是否上锁
    },
    isLock() {//判断数据是否上锁 
      GET(process.env.VUE_APP_DOMAIN_financial + "/tax/financialtaxdata/getLockState", {
        batch: this.batch
      }).then(res => {
        console.log("判断数据是否上锁", res)
        this.isLockFlag = res.data;
      }).catch(error => {
        console.log(error)
      })
    },
    //提示框
    messagePopp(type, msg) {
      this.$message({
        showClose: true,
        type: type,
        message: msg
      });
    },
    reset(formName) { //清除表单
      this.$refs[formName].resetFields();
    },
    JS_search_cancel() { //多条件取消
      this.search_more = false;
      this.reset("searchConditionform");

    },
    handleModifyClose() { ///多条件取消
      this.search_more = false;
      this.reset("searchConditionform");
    },
    unloadErrorLink() {//导入错误模板下载
      console.log('downloadErrorKey', this.downloadErrorKey)
      let url = process.env.VUE_APP_DOMAIN_download + '/oss/download?key=' + this.downloadErrorKey + '&token=' + localStorage.getItem("token") + "&name=" + encodeURI("个税管理失败明细") + ".xlsx";
      window.location.href = url;
    },
    // 导入中的下载模板
    uploadLink() {
      GET(process.env.VUE_APP_DOMAIN_personnel + "/queryBizFilesTemplate", //公共接口
        {
          fileCode: 'FINANCE_TAX_IMPORT_TEMPLATE'
        }).then(res => {
          //获取模板存储返回的ID
          window.location.href = `${process.env.VUE_APP_DOMAIN_download}/oss/download?key=${res.data.fileTemplateId}&name=${res.data.fileTemplateName}.${res.data.fileTemplateSuffix}`
        }).catch(error => {
          console.log(error);
        });
    },
    submitTaxForm() {//生成个税
      GET(process.env.VUE_APP_DOMAIN_financial + "/tax/financialtaxdata/generate", {
        batch: this.batch,
        type: this.yearSalaryForm.type
      }).then(res => {
        this.taxForm = false;//隐藏个税确定框  
        if (res.code === 0) {
          this.downloadErrorEveProcess_tax = res.data; //获取进度条事件句柄
          this.importProcessInfoDialog_tax = true; //错误导入进度条与下载模板
          this.queryProgressForTax(); //获取文件进度条信息
        }
        //  else {
        //   this.$msgBox.alert('<span style="color:red;">【生成个税失败！】。</span>', '温馨提示', {
        //     dangerouslyUseHTMLString: true
        //   })
        //}

      }).catch(error => {
        console.log(error);
      });
    },
    queryProgressForTax() { //个税进度条
      let progressAjax = window.setInterval(() => {
        GET(process.env.VUE_APP_DOMAIN_personnel + "/queryProgress", { progressKey: this.downloadErrorEveProcess_tax }).then(res => {
          this.uploadProcessInfo_tax = res.data;//进度信息对象
          if (res.data.total) {
            this.progressPercentAge_tax = parseInt((res.data.handler / res.data.total) * 100);
          }
          this.uploadProcessInfo_tax.dealAllTime = "正在计算......";
          if (res.data.finish) {//已完成
            this.progressPercentAge_tax = 100; //进度完成度
            let calc = res.data.endTime - res.data.beginTime;
            let time = parseInt(calc / 1000);  //计算完成时间
            this.uploadProcessInfo_tax.dealAllTime = time >= 1 ? time + "秒" : calc + "毫秒";
            this.JS_search();//刷新页面

            setTimeout(() => {
              // if (res.data.failures > 0) { //表示有导入失败的，呈现可下载模板
              //   this.downloadErrorKey_tax = res.data.failFile; //获取错误模板下载key
              //   this.loadErrorExcel_tax = true; // 呈现下载链接
              // }
              this.progressBackBtn_tax = true; //进度条完成后，呈现返回按钮
            }, progressAjax + 1000);
            window.clearInterval(progressAjax);  //清除轮询 
          }
        }).catch(error => {
          window.clearInterval(progressAjax);  //清除轮询
          console.log(error);
        })
      }, 1000);
    },
    importProgress_tax() {//进度弹框关闭
      this.importProcessInfoDialog_tax = false; //关闭进度弹框
      this.progressPercentAge_tax = 0 //进度条清空为0
      this.progressBackBtn_tax = false; //隐藏返回按钮
      //this.loadErrorExcel_tax = false; // 隐藏下载失败链接
    },
    //tab 页的回调
    // handleClick(tab, event) {
    //   console.log(tab, event);
    // },
    handleSizeChange(val) {
      //分页,下拉
      this.size = val;
      this.search();
    },
    handlecurrentChange(val) {
      //当前页，点击页码
      this.currentPage = val;
      this.search();
    },
    //更多操作下拉框
    handleCommand(command) {
      if (command === "a") {
        //导入
        this.uploadModal = true;
      } else if (command === "b") {
        //导出
        this.exportForm = true;
      } else if (command === "c") {
        //一键生成个税
        this.taxForm = true;
      }
    },
    //导出个税确认
    exportTaxForm() {
      if (this.batch === "") {
        return this.messagePopp("error", "若要导出数据，请选择年月！");
      }
      //下载文件
      window.location.href =
        process.env.VUE_APP_DOMAIN_financial +
        "/tax/financialtaxdata/export?token=" +
        localStorage.getItem("token") +
        "&batch=" +
        this.batch;
      this.exportForm = false;
      this.messagePopp("success", "导出数据成功!");
    },
    //根据员工编号获取个人信息
    getUserInfo(num) {
      GET(process.env.VUE_APP_DOMAIN_personnel + "/userInfo", { aid: num }).then(res => {
        this.personalInfoData = res.data;
        this.personalInfoData.employedDates = this.personalInfoData.employedDates.split(
          " "
        )[0];
        console.log(this.personalInfoData);
      }).catch(error => {
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
    importProgress() {//进度弹框关闭
      this.importProcessInfoDialog = false; //关闭进度弹框
      this.progressPercentAge = 0 //进度条清空为0
      this.progressBackBtn = false; //隐藏返回按钮
      this.loadErrorExcel = false; // 隐藏下载失败链接
    },
    fileClose() {//关闭导入弹框
      //清除表单
      this.uploadModal = false
      this.$refs.upload.clearFiles() //清空已上传的文件列表（该方法不支持在 before-upload 中调用）
    },
    //上传文件接口调取成功回调
    handleSuccess(res) {
      this.uploadModal = false  //关闭导入弹框
      if (res.code === 0) {//部分成功部分失败的情况  或者  直接失败

        //文件上传成功或者部分成功
        this.downloadErrorEveProcess = res.data //获取进度条事件句柄
        //错误导入进度条与下载模板
        this.importProcessInfoDialog = true
        this.queryProgress() //获取上传文件进度条信息
      } else {
        let msgError = res.msg || '【系统无法识别EXCLE中的空白、公式和非法字符。请先清理】。' //50*非0情况
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
    beforeRemove(file) {
      //删除文件之前的钩子
      return this.$msgBox.confirm(`确定移除${file.name}？`);
    },
    JS_report_data() { //上报数据
      this.$msgBox.confirm(`<span>请确认所选择的${this.batch}</span><span style="color:red;">【个税管理】</span><span>无误。</span>`,
        "温馨提示",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => { //
        const allLoading = this.$loading({//上报数据，锁定页面loading
          lock: true,
          text: '正在上报数据，请稍等片刻',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        GET(process.env.VUE_APP_DOMAIN_financial + "/tax/financialtaxdata/reprot", { batch: this.batch }).then(res => {
          allLoading.close(); //关闭loading
          this.messagePopp("success", "上报数据成功！")
          this.JS_search() //搜索并且判断数据是否上锁

        }).catch(error => {
          allLoading.close(); //关闭loading
          console.log(error)
        })
      }).catch(() => {

      })
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
        GET(process.env.VUE_APP_DOMAIN_financial + "/tax/financialtaxdata/cancleReprot", { batch: this.batch }).then(res => {
          console.log("取消上报", res)
          this.messagePopp("success", "取消上报数据成功！");
          this.JS_search() //搜索并且判断数据是否上锁
        }).catch(error => {
          console.log(error)
        })
      }).catch(() => {

      })
    }
  },
  created() {  //页面数据初始化
    this.headers["x-user-token"] = localStorage.getItem("token"); //设置上传数据文件excel的token
    this.JS_search();
  }
};
</script>


<style>
/* scope 影响element ui的全局的样式，下面加id修改ele ui的统一样式 */
#perTaxMandialog > div > .el-dialog__footer {
  margin-top: -20px;
}
</style>
