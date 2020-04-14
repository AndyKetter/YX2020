<template>
  <div class="init-setup">
    <div class="guide">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home/financialSystem' }">财务系统</el-breadcrumb-item>
        <el-breadcrumb-item>借支管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/financialSystem' }">(返回上级)</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="bgWhite mgt15 pad-all">
      <!-- 查询栏 start -->
      <div class="clearfix">
        <div class="pull-left">
          <el-form :inline="true" :model="monthFormSearch" class="mar-no">
            <el-form-item label="姓名">
              <el-input @keyup.enter.native="inputEnter" v-model.trim="monthFormSearch.name" placeholder="请输入名字" class="width130"></el-input>
            </el-form-item>
            <el-form-item label="员工编号">
              <el-input-number @keyup.enter.native="inputEnter" placeholder="请输入编号" :controls="false" v-model="monthFormSearch.staffNum" class="width130" :min="0" :max="8888888888"></el-input-number>
            </el-form-item>
            <el-form-item label="查询月份">
              <el-date-picker @change="inputEnter" class="width130" v-model="monthFormSearch.monthValue" type="month" :editable="false" :clearable="false" value-format="yyyyMM" placeholder="选择月份">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="提交状态">
              <el-select @change="inputEnter" filterable clearable v-model="monthFormSearch.dataValue" placeholder="请选择数据状态" class="width130">
                <el-option v-for="item in dataOptions2" :key="item.dataId" :label="item.dataName" :value="item.dataId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit" icon="el-icon-search">搜索</el-button>
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
              <el-dropdown-item command="c" :disabled="isLockFlag===true" divided>批量删除</el-dropdown-item>
              <el-dropdown-item command="d" divided>重置上报</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>&nbsp;
          <el-button size="small" type="danger" v-if="isLockFlag==false" @click="JS_submit">上报数据</el-button>
          <el-button size="small" v-if="isLockFlag==true" @click="cancel_submit">取消上报</el-button>
        </div>
      </div>
      <div class="rbDetails">
        <el-row>
          <el-col :span="8">当月借支总笔数：<span>{{staticForm.monthDebtCount | repairZero}}</span></el-col>
          <el-col :span="8">当月借支总人数：<span>{{staticForm.monthDebtEmps | repairZero}}</span></el-col>
          <el-col :span="8">当月工资中扣除总金额：<span>{{staticForm.monthDeductMoney | toThousands}}</span></el-col>
        </el-row>
      </div>
      <div class="table_wrap">
        <el-table v-loading="loading" :height="tabHeight" :data="monthTableData" @selection-change="handleSelectionChange" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column type="index" label="序号" min-width="50"></el-table-column>
          <el-table-column label="姓名" min-width="150">
            <template slot-scope="scope">
              <el-popover trigger="click" placement="top" @show="getUserInfo(scope.row.employeeNo)" width="450">
                <!-- S -->
                <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                <!-- E -->
                <div slot="reference" class="name-wrapper">
                  <el-button size="mini">{{scope.row.debtName}}</el-button>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="员工编号" min-width="120">
            <template slot-scope="scope">
              <span>{{scope.row.employeeNo}}</span><i class="el-icon-phone tbIconPhone"></i>
            </template>
          </el-table-column>
          <el-table-column prop="idCard" label="身份证号" min-width="160"></el-table-column>
          <el-table-column label="在职状态" min-width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.postStatus==1">在职</span>
              <span v-if="scope.row.postStatus==2">离职</span>
            </template>
          </el-table-column>
          <el-table-column prop="advanceSalary" label="预发薪酬" min-width="80">
            <template slot-scope="scope">{{scope.row.advanceSalary | toThousands}}</template>
          </el-table-column>
          <el-table-column prop="borrowAmount" label="借支总金额" min-width="80">
            <template slot-scope="scope">{{scope.row.borrowAmount | toThousands}}</template>
          </el-table-column>
          <el-table-column prop="deductFromSalary" label="本次工资中扣除总金额" min-width="140">
            <template slot-scope="scope">{{scope.row.deductFromSalary | toThousands}}</template>
          </el-table-column>
          <el-table-column prop="debtMonth" label="本次扣除所属年月" min-width="120"></el-table-column>
          <!-- <el-table-column prop="value9" label="提交状态" ></el-table-column> -->
          <el-table-column label="操作" min-width="50" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="checkFunction(scope.row.employeeNo,scope.row.debtMonth)">详情</el-button>
              <!-- <el-button type="text" size="small" @click="deleteThis"  class="deleteTxt">删除</el-button> -->
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

    <!-- 扣款项导入弹框 -->
    <el-dialog title="借支导入" :close-on-click-modal="false" :show-close="false" :visible.sync="uploadModal" width="520px">
      <p class="clearfix">
        <el-upload class="pull-left" :action="uploadActionUrl" ref="upload" :headers="headers" :before-remove="beforeRemove" :before-upload="beforeUpload" :on-success="handleSuccess" :file-list="fileList">
          <el-button size="mediumn" class="cloud-uploadBtn"><i></i>&nbsp;导入数据</el-button>
          <el-button @click.stop="JS_download" size="mediumn" style="margin-left:15px;" icon="el-icon-download">下载模板</el-button>
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

    <!-- 导出弹框 -->
    <el-dialog title="借支导出" :close-on-click-modal="false" :visible.sync="downloadModal" width="540px">
      <p>
        <el-button size="mediumn" @click="downloadAll">借支汇总一览表导出</el-button>&nbsp;&nbsp;
        <el-button size="mediumn" @click="downloadDetail">借支明细一览表导出</el-button>
      </p>
      <el-alert title="导出模板字段提示" type="warning" :closable="false" description="可根据查询条件进行导出，本系统提供2种导出方式，请选择您需要导出的模板" show-icon>
      </el-alert>
    </el-dialog>

    <!-- 借支明细弹框 -->
    <el-dialog title="借支明细" :close-on-click-modal="false" :visible.sync="addperfoDissent" width="1000px" class="grayBg">
      <div class="whiteBox">
        <p class="pReset">借支人信息</p>
        <el-row class="textLft">
          <el-col :span="3" class="height26">借支人姓名：</el-col>
          <el-col :span="3" class="height26">{{detailForm.debtName}} </el-col>
          <el-col :span="2" class="height26">性别：</el-col>
          <el-col :span="3" class="height26">
            <span v-if="detailForm.sex==1">男</span>
            <span v-if="detailForm.sex==0">女</span>
          </el-col>
          <el-col :span="2" class="height26">员工编号：</el-col>
          <el-col :span="4" class="height26">{{detailForm.employeeNo}}</el-col>
          <el-col :span="3" class="height26">身份证号码：</el-col>
          <el-col :span="4" class="height26">{{detailForm.idCard}}</el-col>
        </el-row>
      </div>
      <div class="whiteBox">
        <p class="pReset">借支项明细</p>
        <el-table :data="loanpayDetailData" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
          <el-table-column type="index" label="序号" min-width="50"></el-table-column>
          <el-table-column prop="debtType" label="借支类型" min-width="120"></el-table-column>
          <el-table-column prop="borrowDate" label="借款日期" min-width="160"></el-table-column>
          <el-table-column prop="advanceSalary" label="预发薪酬" min-width="100">
            <template slot-scope="scope">{{scope.row.advanceSalary | toThousands}}</template>
          </el-table-column>
          <el-table-column prop="borrowAmount" label="借支总金额" min-width="100">
            <template slot-scope="scope">{{scope.row.borrowAmount | toThousands}}</template>
          </el-table-column>
          <el-table-column label="是否分期归还" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.isPeriod==1">是</span>
              <span v-if="scope.row.isPeriod==0">否</span>
            </template>
          </el-table-column>
          <el-table-column prop="periodicMoney" label="每期申请扣款金额" min-width="120">
            <template slot-scope="scope">{{scope.row.periodicMoney | toThousands}}</template>
          </el-table-column>
          <el-table-column prop="insCount" label="申请扣款期数" min-width="100"></el-table-column>
          <el-table-column prop="insDeductCount" label="已扣期数" min-width="80"></el-table-column>
          <el-table-column prop="totalDeductMoney" label="已累计扣除金额" min-width="110">
            <template slot-scope="scope">{{scope.row.totalDeductMoney | toThousands}}</template>
          </el-table-column>
          <el-table-column prop="insSurplusCount" label="剩余期数" min-width="80"></el-table-column>
          <el-table-column prop="insCountDeduct" label="扣除后剩余期数" min-width="110"></el-table-column>
          <el-table-column prop="paperBalance" label="借支账面余额" min-width="100">
            <template slot-scope="scope">{{scope.row.paperBalance | toThousands}}</template>
          </el-table-column>
          <el-table-column prop="deductFromSalary" label="本次工资中扣除金额" min-width="130">
            <template slot-scope="scope">{{scope.row.deductFromSalary | toThousands}}</template>
          </el-table-column>
          <el-table-column prop="afterDeductBalance" label="扣除后借支余额" min-width="120">
            <template slot-scope="scope">{{scope.row.afterDeductBalance | toThousands}}</template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" min-width="200"></el-table-column>
          <el-table-column prop="createUserName" label="操作人" min-width="150"></el-table-column>
          <el-table-column prop="createTime" label="操作时间" min-width="160"></el-table-column>
          <el-table-column label="提交状态" min-width="80">
            <template slot-scope="scope">
              <span style="color:#EF3838;" v-if="scope.row.commitStatus=='0'">未提交</span>
              <span v-if="scope.row.commitStatus=='1'">已提交</span>
              <span style="color:#EF3838;" v-if="scope.row.commitStatus=='2'">
                <el-tooltip v-if="scope.row.reportMsg" class="item" effect="dark" :content="scope.row.reportMsg" placement="top">
                  <span>提交失败</span>
                </el-tooltip>
                <span v-else>
                  提交失败
                </span>
              </span>
              <span v-if="scope.row.commitStatus=='3'">忽略提交</span>
            </template>
            <!-- <template slot-scope="scope">{{scope.row.commitStatus==1?"已提交":"未提交" }}</template> -->
          </el-table-column>
          <el-table-column fixed="right" label="操作" min-width="120">
            <template slot-scope="scope">
              <el-button type="text" :disabled="isLockFlag" size="small" @click="deleteThis(scope.row.id)" class="deleteTxt">删除</el-button>
              <!-- sendLetterVisible=true -->
              <el-button v-if="scope.row.commitStatus=='2'" type="text" size="small" :disabled="isLockFlag" @click="ignoreSubmit(scope.row.id)">忽略提交</el-button>
              <el-button v-if="scope.row.commitStatus=='3'" type="text" size="small" :disabled="isLockFlag" @click="cancelIgnore(scope.row.id)">取消忽略</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <!-- 删除温馨提示弹框 -->
    <el-dialog title="温馨提示" :close-on-click-modal="false" :visible.sync="deleWarn" width="520px">
      <el-row>
        <el-col :md="21" :offset="3" class="warnIcoBg">
          <h2>您确定要批量删除数据？</h2>
          <span style="color:red">注：删除后不可恢复！</span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleWarn = false">取消</el-button>
        <el-button type="primary" @click="doAllDeleteSave">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import Tools from 'untils/index.js'
import { GET, POST, DELETE } from "http/custom.js"
import tbMixin from "libs/mixin/tbMixin.js" //动态计算表格高度mixin

export default {
  name: 'summary-tables',
  mixins: [tbMixin],
  data() {
    const uploadActionUrl = process.env.VUE_APP_DOMAIN_financial + '/debtListImport' //导入action  线上
    let Ytd = Tools.getPYtd() //获取当前年月 格式如 201906
    return {
      t_height: 345, //减去的高度
      personalInfoData: {},//姓名popover弹窗数据
      /////A区
      staticForm: {},//A区统计初始数据
      isLockFlag: false,//提交数据状态
      monthFormSearch: {
        name: '',
        staffNum: undefined,
        monthValue: Ytd,//查询年月
        dataValue: ''
      },
      dataOptions2: [
        { dataId: '0', dataName: '未提交' },
        { dataId: '1', dataName: '已提交' },
        { dataId: '2', dataName: '提交失败' },
        { dataId: '3', dataName: '忽略提交' }
      ],
      /////B区
      detailForm: {},//B区初始数据
      
      //分页查询
      loading: false, //table加载动画开关
      current: 1, //当前页码
      size: 15, //每页显示记录条数
      total: 0, //总记录条数
      monthTableData: [],//B区表格
      multipleSelection: [],//已选择行数组
      downloadModal: false,
      uploadModal: false,
      addperfoDissent: false,
      loanpayDetailData: [],//借支明细弹框
      importProcessInfoDialog: false,

      fileList: [],//上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
      headers: {}, //上传图片请求头
      uploadActionUrl,
      uploadSuccess: false,//上传文件成功标识符
      //uploadError: false,//上传文件失败标识符
      //删除弹框
      deleWarn: false,

      //进度条相关参数
      importError: false,// 导入错误时呈现的进度 
      downloadErrorEveProcess: false, //获取错误下载key
      loadErrorExcel: false,
      downloadErrorKey: '',//错误模板下载key
      progressBackBtn: false, //返回按钮
      progressPercentAge: 0,
      uploadProcessInfo: {
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
    // 根据员工编号获取个人信息
    getUserInfo(num) {
      GET(process.env.VUE_APP_DOMAIN_personnel + '/userInfo', { aid: num }).then(res => {
        console.log(res.data);
        this.personalInfoData = res.data
        this.personalInfoData.employedDates = this.personalInfoData.employedDates.split(" ")[0];
      }).catch(error => {
        console.log(error)
      })
    },
    staticSearch() {//a区查询
      let queryObj = { "debtMonth": this.monthFormSearch.monthValue } //查询对象 
      GET(process.env.VUE_APP_DOMAIN_financial + '/debtListStatistic', queryObj).then(res => {//查询基础薪资对象
        this.staticForm = res.data
      }).catch(error => {
        console.log(error)
      })
    },
    tabSearch() { //B区表格初始查询
      let queryObj = {
        "current": this.current,
        "size": this.size,
        "employeeNo": this.monthFormSearch.staffNum,
        "debtName": this.monthFormSearch.name,
        "debtMonth": this.monthFormSearch.monthValue,
        "commitStatus": this.monthFormSearch.dataValue || ''
      } //查询象 
      this.loading = true //开启动画
      POST(process.env.VUE_APP_DOMAIN_financial + '/debtLists', queryObj).then(res => {//查询对象
        this.loading = false //关闭动画
        this.monthTableData = res.data.records
        this.current = res.data.current //set当前页
        this.size = res.data.size //每页显示记录条数
        this.total = res.data.total //总记录条数
      }).catch(error => {
        console.log(error)
      })
      this.isLock() //判断数据是否上锁
    },
    isLock() {//判断数据是否上锁
      GET(process.env.VUE_APP_DOMAIN_financial + '/checkLockStatus', { debtMonth: this.monthFormSearch.monthValue }).then(res => {
        console.log("判断数据是否上锁", res)
        this.isLockFlag = res.data
        console.log(this.isLockFlag)
      }).catch(error => {
        console.log(error)
      })
    },
    onSubmit() {
      this.current = 1 //点击搜索current=1搜索第一页
      this.tabSearch();
      this.staticSearch();
    },
    inputEnter() {
      this.onSubmit()
    },
    handleSizeChange(val) {
      //每页显示多少条数据切换
      this.size = val; //保存状态-每页显示多少条数据切换
      this.tabSearch();
    },
    handlecurrentChange(val) {
      //点击页码，当前页
      this.current = val; //保存状态-当前页
      this.tabSearch();
    },
    checkFunction(employeeNo, debtMonth) {//单条表格数据详情
      GET(process.env.VUE_APP_DOMAIN_financial + '/debtLists', { "employeeNo": employeeNo, "debtMonth": debtMonth }).then(res => {//查询对象
        this.loanpayDetailData = res.data
        //赋值给detailForm对象
        this.detailForm = res.data[0]
        this.addperfoDissent = true
      }).catch(error => {
        console.log(error)
      })
    },
    deleteThis(id) {
      this.$msgBox.confirm('你确定要删除该条数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DELETE(process.env.VUE_APP_DOMAIN_financial + '/debtList', { "ids": id }).then(res => {//查询对象
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.addperfoDissent = false
          this.tabSearch();
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
    handleCommand(command) {//更多操作下拉框
      if (command == 'a') {
        this.uploadModal = true
      }
      else if (command == 'b') {
        this.downloadModal = true
      }
      else if (command == 'c') {
        this.deleteAll()//全部删除
      }
      else if (command == 'd') {
        this.reset_submit()//全部删除
      }
    },
    JS_submit() {//提交数据
      const that = this;
      this.$msgBox.confirm('<span>请确认</span><span style="color:red;">【借支管理】</span><span>无误，确认提交后，将直接影响工资准确发放。</span>', '温馨提示', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const loading = this.$loading({//上报数据，锁定页面loading
          lock: true,
          text: '正在上报数据，请稍等片刻',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        GET(process.env.VUE_APP_DOMAIN_financial + '/submitData', { debtMonth: this.monthFormSearch.monthValue }).then(res => {
          console.log("借支管理上报数据", res)
          loading.close() //关闭loading
          // this.$message({
          //   type: "success",
          //   message: "上报数据成功！"
          // })
          this.tabSearch() //搜索并且判断数据是否上锁
        }).catch(error => {
          loading.close() //关闭loading
          console.log(error)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消提交！'
        });
      });
    },
    cancel_submit() {//撤回数据
      this.$msgBox.confirm(
        '<span>确定取消上报数据？</span>', "温馨提示",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        GET(process.env.VUE_APP_DOMAIN_financial + '/cancelSubmit', { debtMonth: this.monthFormSearch.monthValue }).then(res => {
          console.log("借支管理取消上报", res)
          // this.$message({
          //   type: "success",
          //   message: "取消上报数据成功！"
          // })
          this.tabSearch() //搜索并且判断数据是否上锁
        }).catch(error => {
          console.log(error)
        })
      }).catch(() => {

      })
    },
    reset_submit() {//重置提交
      this.$msgBox.confirm(
        '<span>你确定要重置提交数据吗？</span>', "温馨提示",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        GET(process.env.VUE_APP_DOMAIN_financial + '/resetSubmit', { debtMonth: this.monthFormSearch.monthValue }).then(res => {
          console.log("重置提交", res)
          this.tabSearch()
        }).catch(error => {
          console.log(error)
        })
      }).catch(() => {

      })
    },
    /////批量删除
    handleSelectionChange(val) {//当选择项发生变化时会触发该事件
      this.multipleSelection = val;
      console.log('选中的行', val);
    },
    deleteAll() {
      this.deleWarn = true
    },
    doAllDeleteSave() {//批量删除-保存
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: '请勾选要批量删除的数据!'
        })
        this.deleWarn = false //关闭弹框
      } else {
        let employeeNos = []
        this.multipleSelection.forEach(element => {
          employeeNos.push(element.employeeNo)
        })
        employeeNos = employeeNos.join(',') //转换成以逗号隔开的字符串
        DELETE(process.env.VUE_APP_DOMAIN_financial + '/debtLists', { "employeeNos": employeeNos, "debtMonth": this.monthFormSearch.monthValue }).then(res => { //批量数据删除

          this.deleWarn = false //关闭弹框
          this.tabSearch() //刷新表格，重新获取数据
        }).catch(error => {
          console.log(error)
        })
      }
    },
    ///////上传文件
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
    handleSuccess(res) { //上传文件接口调取成功回调
      this.uploadModal = false;
      if (res.code == 0) {
        // 文件上传成功
        this.downloadErrorEveProcess = res.data //获取进度条事件句柄
        //错误导入进度条与下载模板
        this.importProcessInfoDialog = true
        this.queryProgress() //获取上传文件进度条信息
      } else {//文件上传失败失败
        //失败
        this.$msgBox.alert('<span style="color:red;">【系统无法识别EXCLE中的空白，公式和非法字符。请先清理】。</span>', '温馨提示', {
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
            this.onSubmit();//刷新页面

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
    unloadErrorLink() {
      console.log('downloadErrorKey', this.downloadErrorKey)
      let url = process.env.VUE_APP_DOMAIN_download + '/oss/download?key=' + this.downloadErrorKey + '&token=' + localStorage.getItem("token") + "&name=" + encodeURI("借支管理失败明细") + ".xlsx";
      window.location.href = url;
    },

    JS_download() {//下载模板
      GET(process.env.VUE_APP_DOMAIN_personnel + "/queryBizFilesTemplate", { fileCode: 'FINANCIAL_DEBT_IMPORT_TEMPLATE' })
        .then(res => {
          //获取模板存储返回的ID
          let url = `${process.env.VUE_APP_DOMAIN_download}/oss/download?key=${res.data.fileTemplateId}&name=${res.data.fileTemplateName}.${res.data.fileTemplateSuffix}`;
          window.location.href = url;
          // window.location.href = process.env.VUE_APP_DOMAIN_download + '/oss/download?key=' + res.data.fileTemplateId
        })
        .catch(error => {
          console.log(error);
        });
    },
    /////导出文件
    downloadAll() {
      window.location.href =
        process.env.VUE_APP_DOMAIN_financial +
        "/debtListStatisticsExport?token=" +
        localStorage.getItem("token") +
        '&debtMonth=' + this.monthFormSearch.monthValue;
      this.$message({
        type: 'success',
        message: '导出数据成功!',
        showClose: true
      })
      this.downloadModal = false
    },
    downloadDetail() {
      window.location.href =
        process.env.VUE_APP_DOMAIN_financial +
        "/debtListDetailExport?token=" +
        localStorage.getItem("token") +
        '&debtMonth=' + this.monthFormSearch.monthValue;
      this.$message({
        type: 'success',
        message: '导出数据成功!',
        showClose: true
      })
      this.downloadModal = false
    },
    ignoreSubmit(id) {//忽略上报
      //单个忽略上报
      this.$msgBox
        .confirm("你确定要忽略上报该条数据吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          GET(process.env.VUE_APP_DOMAIN_financial + "/ignoreSubmit", { ids: id })
            .then(res => {
              //单条忽略上报
              // this.$message({
              //   type: "success",
              //   message: "忽略上报成功!"
              // })
              this.addperfoDissent = false
              this.tabSearch() //刷新表格，重新获取数据
            })
            .catch(error => {
              console.log(error)
            })
        })
        .catch(() => {

        })
    },
    cancelIgnore(id) {//取消忽略上报
      //单个取消忽略上报
      this.$msgBox
        .confirm("你确定要取消忽略上报该条数据吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          GET(process.env.VUE_APP_DOMAIN_financial + "/cancelIgnore", { ids: id })
            .then(res => {
              //单条取消忽略上报
              this.$message({
                type: "success",
                message: "取消忽略上报成功!"
              })
              this.addperfoDissent = false
              this.tabSearch() //刷新表格，重新获取数据
            })
            .catch(error => {
              console.log(error)
            })
        })
        .catch(() => {

        })
    },
  },
  created() {
    this.headers['x-user-token'] = localStorage.getItem('token') //设置上传数据文件excel的token
    this.tabSearch();
    this.staticSearch();
  }
}
</script>
<style scoped>
.rbDetails {
  background-color: #e7e7e7 !important;
  padding: 15px;
  margin-bottom: 20px;
}
</style>
