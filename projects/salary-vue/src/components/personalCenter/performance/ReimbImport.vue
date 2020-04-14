<template>
  <div>
    <div class="pull-left">
      <el-form :inline="true" class="mar-no" label-position="right">
        <el-form-item label="还款日期">
          <el-date-picker :clearable="false" class="pull-right" style="width:225px" v-model="formSearch.date" type="daterange" range-separator="至" start-placeholder="起始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="经办人">
          <el-input clearable @keyup.enter.native="inputEnter" v-model="formSearch.name" placeholder="请输入名字" class="width155"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="setSearchWord" icon="el-icon-search">搜索</el-button>
          <el-button icon="el-icon-search" @click="search_more=true">更多查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="pull-right">
      <el-dropdown trigger="click" @command="handleCommand">
        <el-button type="primary">
          更多操作<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="a" icon="el-icon-plus">新增</el-dropdown-item>
          <el-dropdown-item command="b" class="cloud-uploadBtn" divided>
            <i></i>&nbsp;导入
          </el-dropdown-item>
          <el-dropdown-item command="c" class="cloud-downloadBtn" divided>
            <i></i>&nbsp;导出
          </el-dropdown-item>
          <el-dropdown-item command="d" divided><i class="el-icon-delete"></i>批量删除</el-dropdown-item>
          <el-dropdown-item command="e" divided>配置业务类型</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="table_wrap">
      <el-table :data="mainData" v-loading="loading" :height="dataInfo.t_height" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
        <el-table-column type="index" label="序号" min-width="50"></el-table-column>
        <el-table-column prop="batch" label="核算月份" min-width="100"></el-table-column>
        <el-table-column prop="businessName" label="业务类型" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column label="经办人" min-width="150" prop="UserName">
          <template slot-scope="scope">
            <el-popover v-show="scope.row.operatorName" trigger="click" placement="top" width="450" @show="getUserInfoByUser(scope.row.operatorId)">
              <!-- S -->
              <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
              <!-- E -->
              <div slot="reference" class="name-wrapper">
                <el-button size="mini">{{scope.row.operatorName}}</el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="operatorPhoneNum" label="经办人手机" min-width="120"></el-table-column>
        <el-table-column prop="paymentDate" label="还款日期" min-width="100"></el-table-column>
        <el-table-column label="还款金额" min-width="120">
          <template slot-scope="scope">
            {{scope.row.paymentAmount | toThousands}}
          </template>
        </el-table-column>
        <el-table-column prop="level" label="上下级" min-width="250" show-overflow-tooltip></el-table-column>
        <el-table-column prop="updateUserName" label="操作人" min-width="100"></el-table-column>
        <el-table-column prop="updateTime" label="操作时间" min-width="150"></el-table-column>
        <el-table-column label="操作" min-width="150" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="updateThis(scope.row.id)" size="small">编辑</el-button>
            <el-button type="text" size="small" @click="deleteType('thirdPartPayments',{ids: scope.row.id} )">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-alert :title="moneyTotal" type="success" :closable="false" style="margin-top:10px"></el-alert>

      <!-- 分页 -->
      <div id="pagination" class="pagination">
        <el-pagination background @size-change="handleSizeChange" @current-change="handlecurrentChange" :current-page="pageObj.current" :page-sizes="[10,15,20,30]" :page-size="pageObj.size" layout="total,sizes,prev,pager,next,jumper" :total="pageObj.total"></el-pagination>
      </div>
    </div>

    <!-- 更多查询 -->
    <el-dialog title="更多查询" :before-close="closeMoreSeach" :close-on-click-modal="false" :visible.sync="search_more" width="650px">
      <el-form :inline="true" :model="moreSearch" :rules="moreSearch.moreSearchrules" ref="moreSearchrules" class="mar-no" style="text-align: right;" label-width="100px">
        <el-form-item label="经办人手机：" prop="phone">
          <el-input v-model="moreSearch.phone" placeholder="请输入" class="width155" clearable></el-input>
        </el-form-item>
        <el-form-item label="还款金额：" prop="money">
          <div>
            <el-input-number :controls="false" :precision="2" v-model="moreSearch.moneyMin" :min="1" :max="10000000000" style="width:100px"></el-input-number>
            <span class="el-range-separator">&nbsp;至&nbsp;</span>
            <el-input-number :controls="false" :precision="2" v-model="moreSearch.moneyMax" :min="1" :max="10000000000" style="width:100px"></el-input-number>
          </div>
        </el-form-item>
        <el-form-item label="按组织架构：" prop="structure">
          <el-input v-model.trim="moreSearch.structure" placeholder="请输入" class="width155" clearable></el-input>
        </el-form-item>
        <el-form-item label="操作人：" prop="name">
          <el-input v-model.trim="moreSearch.name" placeholder="请输入" style="width:225px" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeMoreSeach">取消</el-button>
        <el-button type="primary" @click="execute">立即搜索</el-button>
      </span>
    </el-dialog>

    <!-- 新增 -->
    <el-dialog :title="title+'还款'" :close-on-click-modal="false" :before-close="closeEdit" :visible.sync="editForm" width="650px">
      <el-form :inline="true" :model="addForm" :rules="addForm.addFormRules" ref="editRules" class="mar-no" label-width="110px" style="text-align: center;">
        <el-form-item label="核算月份：" prop="batch">
          <el-date-picker class="width155" v-model="addForm.batch" type="month" :editable="false" :clearable="false" value-format="yyyy-MM" placeholder="年月"></el-date-picker>
        </el-form-item>
        <el-form-item label="业务类型：" prop="caseType">
          <el-select class="width155" ref="typeAfter" v-model="addForm.caseType" placeholder="选择类型" clearable>
            <el-option v-for="item in caseTypeOptions" :key="item.typeId" :label="item.typeName" :value="item.typeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="经办人：" prop="name">
          <el-input v-model.trim="addForm.name" @keyup.native.stop="searchPhone" @change="searchPhone" placeholder="请输入" class="width155" clearable></el-input>
        </el-form-item>
        <el-form-item label="还款日期：" prop="date">
          <el-date-picker :clearable="false" class="width155" value-format="yyyy-MM-dd" v-model="addForm.date" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="经办人手机：" prop="phone">
          <el-autocomplete clearable class="inline-input width155" v-model.trim="addForm.phone" :trigger-on-focus="true" :fetch-suggestions="querySearch" placeholder="请输入"></el-autocomplete>
        </el-form-item>
        <el-form-item label="还款金额：" prop="money">
          <el-input-number v-model.number="addForm.money" controls-position="right" :precision="2" placeholder="请输入" :min="0" :max="10000000000" class="width155" clearable></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeEdit">取消</el-button>
        <el-button type="primary" @click="submit('新增')">确定</el-button>
      </span>
    </el-dialog>

    <!-- 配置业务类型 -->
    <el-dialog title="配置业务类型" :close-on-click-modal="false" :before-close="closeType" :visible.sync="caseModal" width="650px" top="10vh">
      <el-form :model="baseInfo" :rules="baseInfo.rules" ref="baseInfoRef" label-width="120px">
        <el-row>
          <el-col :md="21">
            <el-form-item label="业务类型名称：" prop="type">
              <el-input clearable placeholder="请输入" v-model.trim="baseInfo.type" style="width:185px"></el-input>&nbsp;
              <el-checkbox v-model="baseInfo.dataDefault">是否参与计算</el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :md="3">
            <el-button type="primary" @click="JS_operate">{{addDicbtn}}</el-button>
          </el-col>
        </el-row>
      </el-form>
      <div class="table_wrap">
        <el-table v-loading="loadingBaseInfo" height="250px" :data="casedataTable" border :header-cell-style="{backgroundColor:'#e5e9f3'}">
          <el-table-column prop="businessName" label="业务类型" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column label="是否参与计算" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.bcount == '1'">是</span>
              <span v-else-if="scope.row.bcount == '0'">否</span>
              <span v-else></span>
            </template>
          </el-table-column>
          <el-table-column prop="createUserName" label="操作人" min-width="80"></el-table-column>
          <el-table-column prop="updateTime" label="操作时间" min-width="160"></el-table-column>
          <el-table-column label="操作" fixed="right" min-width="100">
            <template slot-scope="scope">
              <el-button type="text" @click="editType(scope.row.id)" size="small">编辑</el-button>
              <el-button type="text" size="small" class="deleteTxt" @click="deleteType('thirdPartConfigs',{id:scope.row.id})">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <!-- 导出-->
    <el-dialog title="导出" :close-on-click-modal="false" :show-close="true" :visible.sync="exportDialog" width="600px">
      <div>
        <el-form label-width="150px">
          <el-row>
            <el-col :md="24">
              <el-form-item label="导出方式" label-width="85px">
                <el-select placeholder="请选择" v-model="exportVal" style="width:300px" filterable>
                  <el-option v-for="item in exportType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="exportDialog = false">取消</el-button>
        <el-button type="primary" @click="exportToWary">确定</el-button>
      </span>
    </el-dialog>

    <!-- 导入弹框 -->
    <el-dialog :before-close="fileClose" title="还款导入" :close-on-click-modal="false" :show-close="false" :visible.sync="uploadModal" width="520px">
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
  </div>
</template>

<script>
import { GET, POST, PUT, DELETE } from "http/custom.js"
import Tools from 'untils/index.js'
export default {
  name: "reimbImport",
  props: {
    dataInfo: {
      loading: false,
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
    //导入action 线上，数据导入接口
    const uploadActionUrl = process.env.VUE_APP_DOMAIN_performance + "/thirdPartPaymentImport";
    const ym = Tools.getYd();
    const date = new Date((new Date()).setDate(1));
    //获取当月有多少天
    date.setMonth(date.getMonth() + 1);
    date.setDate(0);
    return {
      moneyTotal: '',//总金额
      more: false,//是否为更多查询
      personalInfoData: {}, //姓名popover弹窗数据
      importParam: {},//导出参数
      multipleSelection: [],//表格多选数据 
      formSearch: { //查询条件
        date: [ym + '-01', ym + '-' + date.getDate()],
        name: ''
      },
      pageObj: { //分页
        current: 1,
        size: 15,
        total: 0
      },
      loading: false,
      mainData: [],
      //更多查询
      search_more: false,
      moreSearch: {
        moreSearchrules: { // 验证表单
          phone: '',
          money: '',
          structure: '',
          name: ''
        },
        phone: '',
        moneyMin: undefined,
        moneyMax: undefined,
        structure: '',
        name: ''
      },
      //新增还款弹框
      editForm: false,
      title: '新增',
      titleId: 0,//还款导入的id
      optionsPhone: [],//经办人手机号数组
      addForm: {
        addFormRules: {
          name: [{ required: true, message: "请输入", trigger: "blur" },{ min: 1, max: 100, message: "长度应为100个字符", trigger: "blur" }],
          phone: [{ required: true, message: "请输入", trigger: "blur" },{ min: 1, max: 11, message: "长度应为11个字符", trigger: "blur" }],
          batch: [{ required: true, message: "请输入", trigger: "change" }],
          date: [{ required: true, message: "请输入", trigger: "change" }],
          caseType: [{ required: true, message: "请选择", trigger: "change" }],
          money: [{ required: true, message: "请输入数值", trigger: "blur" }]
        },
        name: '',
        phone: '',//经办人手机号
        batch: Tools.getYd(),
        date: Tools.getYMd(),
        caseType: '',
        money: undefined
      },
      caseTypeOptions: [],
      //配置业务类型
      caseModal: false,
      loadingBaseInfo: false,
      addDicbtn: '新增',
      typeId: 0,
      baseInfo: {
        rules: {
          type: [{ required: true, trigger: "blur", message: "请输入" },{ min: 1, max: 20, message: "长度应为20个字符", trigger: "blur" }]
        },
        type: '',
        dataDefault: false
      },
      planeLoading: false,
      casedataTable: [],
      uploadModal: false,//导入弹框
      exportDialog: false,//导出弹框
      exportVal: 1,//导出方式
      uploadActionUrl,
      importProcessInfoDialog: false,//导入进度条弹框
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
      headers: {//设置上传数据文件excel的token
        "x-user-token": localStorage.getItem("token")
      }, //上传图片请求头
      fileList: [], //上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
      exportType: [ //导出方式
        { value: 1, label: "保存至本地（需要等待数秒至数分钟）" },
        { value: 2, label: "发送至本人内网邮箱" }
      ],
    }
  },
  created() {
    this.setSearchWord();
  },
  methods: {
    setSearchWord() { //搜索
      this.more = false;
      this.JS_search();
    },
    execute() { //更多查询      
      this.more = true;
      this.JS_search();
      this.closeMoreSeach();
    },
    JS_search() {
      this.pageObj.current = 1;
      if (this.more) {
        //记录导出的参数
        this.importParam = {
          operatorPhoneNum: this.moreSearch.phone, //经办人手机号码
          paymentAmountPre: this.moreSearch.moneyMin, //还款金额前选
          paymentAmountSub: this.moreSearch.moneyMax, //还款金额后选
          updateUserName: this.moreSearch.name,//操作人
          level: this.moreSearch.structure //组织架构
        }
      } else {
        this.importParam = {};
      }
      console.log(this.importParam);
      this.search();
    },
    search() { //查询
      let obj = {
        current: this.pageObj.current,
        size: this.pageObj.size,
        //descs: ['updateTime'],
        operatorName: this.formSearch.name, //经办人姓名
        paymentDateStratTime: this.formSearch.date ? this.formSearch.date[0] : '',
        paymentDateEnd: this.formSearch.date ? this.formSearch.date[1] : ''
      };
      if (this.more) {
        obj = Object.assign({}, obj, this.importParam);
      }
      this.loading = true;
      POST(process.env.VUE_APP_DOMAIN_performance + '/thirdPartPayments', obj).then(res => {
        this.loading = false;
        if (res.data) {
          this.mainData = res.data.records || [];
          this.pageObj.size = res.data.size; //每页显示记录条数
          this.pageObj.current = res.data.current; // set当前页
          this.pageObj.total = res.data.total; //总记录数据
          let tatol = 0;
          this.multipleSelection = [];
          this.mainData.forEach(item => {
            this.multipleSelection.push(item.id);//保存数据id
            if (item.paymentAmount && item.paymentAmount !== '') {
              tatol += item.paymentAmount;
            }
          });
          this.moneyTotal = '还款金额：' + (tatol !== 0 ? tatol.toFixed(2) : '--');
        }
      }).catch(error => {
        console.log(error);
      });
    },
    JS_download() { // 导入 下载模板
      GET(process.env.VUE_APP_DOMAIN_download + "/template/baseFilesTemplateByFileCode", {
        fileCode: 'PERFORMANCE_THIRDPART_PAYMENT_IMPORT_TEMPLATE'
      }).then(res => {
        //获取模板存储返回的ID
        let url = `${process.env.VUE_APP_DOMAIN_download}/oss/download?key=${res.data.fileTemplateId}&name=${res.data.fileTemplateName}.${res.data.fileTemplateSuffix}`;
        window.location.href = url;
      }).catch(error => {
        console.log(error);
      });
    },
    querySearch(queryString, cb) { //手机号文本回调
      let arr = this.optionsPhone;
      let results = queryString ? arr.filter(this.createFilter(queryString)) : arr;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) { //过滤
      return (restaurant) => {
        return (restaurant.value.toLowerCase().includes(queryString.toLowerCase()));
      };
    },
    searchPhone() { //通过经办人查询手机
      if (this.addForm.name !== '') {
        this.addForm.phone = '';
        GET(process.env.VUE_APP_DOMAIN_personnel + '/queryEmployeesByNameOrPhoneNuber', { "searchWord": this.addForm.name }).then(res => {
          if (res.data) {
            this.optionsPhone = [];
            res.data.forEach(item => {
              this.optionsPhone.push({
                value: item.mobile_phone,
                name: item.user_name,
              })
            });
          }
        });
      } else {
        this.optionsPhone = [];
      }
    },
    getUserInfoByUser(num) {//根据createUser获取个人信息
      GET(process.env.VUE_APP_DOMAIN_personnel + "/queryUserInfoToRegid", {
        regid: num || ''
      }).then(res => {
        this.personalInfoData = res.data;
        this.personalInfoData.employedDates = this.personalInfoData.employedDates.split(" ")[0];
      }).catch(error => {
        this.personalInfoData = {};
        console.log(error);
      });
    },
    doAllDeleteSave() {//批量删除
      let selectItem = this.multipleSelection;
      if (selectItem.length <= 0) {
        this.messagePopp("warning", "没有可删除的数据！");
      } else {
        this.deleteType('thirdPartPayments', {
          ids: selectItem.join(',') //转换成以逗号隔开的字符串
        });
      }
    },
    updateThis(id) {//点击修改获取详情
      this.editForm = true; //显示弹窗
      this.title = "修改";
      this.titleId = id;
      GET(process.env.VUE_APP_DOMAIN_performance + '/thirdPartPayment', {
        id: id
      }).then(res => {
        if (res.data) {
          this.hdType();
          //（dialog是懒加载）修改和新增用的同一个表单时，修改回填数据时要用这个方法防止再点击新增时数据会回填
          this.$nextTick(() => {
            this.addForm.name = res.data.operatorName;
            this.addForm.phone = res.data.operatorPhoneNum;
            this.addForm.batch = res.data.batch;
            this.addForm.date = res.data.paymentDate;
            this.addForm.caseType = res.data.businessName;
            this.addForm.money = res.data.paymentAmount;
          });
        }
      }).catch(error => {
        console.log(error);
      });
    },
    closeType() {
      this.caseModal = false;
      this.reset('baseInfoRef');
    },
    searchType() { //业务类型
      const obj = {
        size: 2000,
        current: 1
      };
      this.loadingBaseInfo = true;
      POST(process.env.VUE_APP_DOMAIN_performance + '/thirdPartConfigs', obj).then(res => {
        this.loadingBaseInfo = false;
        if (res.data) {
          this.casedataTable = res.data.records;
        }
      }).catch(error => {
        console.log(error);
      });
    },
    editType(id) {
      this.typeId = id;
      this.addDicbtn = '修改';
      GET(process.env.VUE_APP_DOMAIN_performance + '/thirdPartConfig', {
        id: id
      }).then(res => {
        if (res.data) {
          this.baseInfo.dataDefault = res.data.bcount === 1 ? true : false;
          this.baseInfo.type = res.data.businessName;
        }
      }).catch(error => {
        console.log(error);
      });
    },
    deleteType(urlName, obj) {
      this.$msgBox.confirm("您确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        DELETE(process.env.VUE_APP_DOMAIN_performance + '/' + urlName, obj).then(res => {
          if (res.code === 0) {
            this.messagePopp("success", "删除成功！");
            if (urlName === 'thirdPartConfigs') {
              this.searchType();
            } else {
              this.multipleSelection = [];//批量删除时清楚记录
              this.JS_search();
            }
          }
        }).catch(error => {
          console.log(error);
        });
      }).catch(() => {
        this.messagePopp("info", "已取消删除!");
      });
    },
    JS_operate() {
      this.$refs['baseInfoRef'].validate(valid => {
        if (valid) {
          const url = process.env.VUE_APP_DOMAIN_performance + '/thirdPartConfig';
          const obj = {
            bcount: this.baseInfo.dataDefault ? 1 : 0,
            businessName: this.baseInfo.type,
          };
          if (this.addDicbtn === '新增') {
            POST(url, obj).then(res => {
              if (res.code === 0) {
                this.messagePopp("success", "新增成功！");
                this.searchType();
              }
            }).catch(error => {
              console.log(error);
            });
          } else {
            this.$msgBox.confirm("修改业务类型名称时，若已有数据会同步修改，您是否确定要修改？", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              PUT(url, Object.assign({}, obj, {
                id: this.typeId
              })).then(res => {
                if (res.code === 0) {
                  this.messagePopp("success", "修改成功！");
                  this.searchType();
                  this.JS_search();
                  this.caseModal = false;
                }
              }).catch(error => {
                console.log(error);
              });
            }).catch(() => {
              this.messagePopp("info", "已取消修改!");
            });
          }
        } else {
          this.messagePopp("warning", "提交失败，验证不通过");
        }
      });
    },
    exportToWary() { //导出      
      // 导出方式   1直接下载  2发到邮箱
      let ul = process.env.VUE_APP_DOMAIN_performance + '/thirdPartPaymentExport';

      if (this.exportVal === 1) {//导出方式
        this.messagePopp("success", "已经导出至本地！");
        //下载拼接 已经导出至本地！
        let urls = ul + '?token=' + localStorage.getItem("token")
          + '&exportType=' + this.exportVal
          + '&operatorName=' + this.formSearch.name
          + '&paymentDateStratTime=' + (this.formSearch.date ? this.formSearch.date[0] : '')
          + '&paymentDateEnd=' + (this.formSearch.date ? this.formSearch.date[1] : '');

        if (JSON.stringify(this.importParam) !== "{}") { //为空时没有使用更多查询 
          urls += '&operatorPhoneNum=' + this.importParam.operatorPhoneNum
            + '&paymentAmountPre=' + (this.importParam.paymentAmountPre || '')
            + '&paymentAmountSub=' + (this.importParam.paymentAmountSub || '')
            + '&updateUserName=' + this.importParam.updateUserName
            + '&level=' + this.importParam.level;
        }
        console.log('本地下载:', urls);
        window.location.href = urls;
      } else {
        let params = {
          exportType: this.exportVal,
          operatorName: this.formSearch.name,
          paymentDateStratTime: this.formSearch.date ? this.formSearch.date[0] : '',
          paymentDateEnd: this.formSearch.date ? this.formSearch.date[1] : ''
        };
        if (JSON.stringify(this.importParam) !== "{}") { //为空时没有使用更多查询 
          params = Object.assign({}, params, {
            operatorPhoneNum: this.importParam.operatorPhoneNum, //经办人手机号码
            paymentAmountPre: this.importParam.paymentAmountPre || '', //还款金额前选
            paymentAmountSub: this.importParam.paymentAmountSub || '', //还款金额后选
            updateUserName: this.importParam.updateUserName,//操作人
            level: this.importParam.level //组织架构
          });
        }
        console.log('邮箱下载:', params);
        //导出至邮箱   这个接口没有回调，后台要求直接提示
        GET(ul, params).then(() => {
          this.messagePopp("success", "已经导入至您的邮箱！");
        }).catch(error => {
          console.log(error);
        });
      }
      // 关闭导出弹窗
      this.exportDialog = false;
    },
    closeMoreSeach() {
      this.reset('moreSearchrules');
      this.search_more = false;
      this.moreSearch.moneyMin = undefined;
      this.moreSearch.moneyMax = undefined;
    },
    closeEdit() {
      this.reset('editRules');
      this.editForm = false;
    },
    unloadErrorLink() {//导入错误模板下载
      console.log('downloadErrorKey', this.downloadErrorKey)
      let url = process.env.VUE_APP_DOMAIN_download + '/oss/download?key=' + this.downloadErrorKey + '&token=' + localStorage.getItem("token") + "&name=" + encodeURI("还款导入失败明细") + ".xlsx";
      window.location.href = url;
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
        GET(process.env.VUE_APP_DOMAIN_personnel + "/queryProgress", {
          progressKey: this.downloadErrorEveProcess
        }).then(res => {
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
    fileClose() {//关闭导入弹框
      //清除表单
      this.uploadModal = false
      this.$refs.upload.clearFiles() //清空已上传的文件列表（该方法不支持在 before-upload 中调用）
    },
    reset(formName) { //清除表单
      this.$refs[formName].resetFields();
    },
    messagePopp(type, msg) {    //提示框
      this.$message({
        showClose: true,
        type: type,
        message: msg
      });
    },
    hdType() { //获取业务类型      
      GET(process.env.VUE_APP_DOMAIN_performance + '/thirdPartConfigAll').then(res => {
        if (res.code === 0) {
          this.caseTypeOptions = [];
          let i = 0;
          res.data.forEach(val => {
            i++;
            this.caseTypeOptions.push({
              typeId: i,
              typeName: val
            });
          })
        }
      }).catch(error => {
        console.log(error);
      });
    },
    submit() {
      this.$refs['editRules'].validate(valid => {
        if (valid) {
          const url = process.env.VUE_APP_DOMAIN_performance + '/thirdPartPayment';
          const obj = {
            businessName: this.$refs.typeAfter.selectedLabel,
            operatorName: this.addForm.name,
            operatorPhoneNum: this.addForm.phone,
            paymentAmount: this.addForm.money,
            paymentDate: this.addForm.date,
            batch: this.addForm.batch
          };
          if (this.title.includes('新增')) {
            POST(url, obj).then(res => {
              if (res.code === 0) {
                this.messagePopp("success", "新增成功！");
                this.JS_search();
                this.editForm = false;
              }
            }).catch(error => {
              console.log(error);
            });
          } else {
            PUT(url, Object.assign({}, obj, {
              id: this.titleId
            })).then(res => {
              if (res.code === 0) {
                this.messagePopp("success", "修改成功！");
                this.search();
                this.editForm = false;
              }
            }).catch(error => {
              console.log(error);
            });
          }
        } else {
          this.messagePopp("warning", "提交失败，验证不通过");
        }
      });
    },
    handleCommand(command) { //更多
      switch (command) {
        case 'a':
          this.hdType();
          this.editForm = true;
          this.title = '新增';
          setTimeout(() => {
            this.reset('editRules');
          }, 20);
          break;
        case 'b':
          this.uploadModal = true;
          break;
        case 'c':
          this.exportDialog = true;
          break;
        case 'd':
          this.doAllDeleteSave();
          break;
        case 'e': // 业务类型
          this.caseModal = true;
          this.addDicbtn = '新增';
          this.baseInfo.dataDefault = false;
          this.searchType();
          setTimeout(() => {
            this.reset('baseInfoRef');
          }, 20);
          break;
      }
    },
    handlecurrentChange(val) { //当前页
      this.pageObj.current = val;
      this.search();
    },
    handleSizeChange(val) {//下拉设置页数
      this.pageObj.size = val;
      this.search();
    },
  }
}
</script>