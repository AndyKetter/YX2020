<template>
  <div class="contract-first">
    <el-row :style="{height:t_height+'px'}">
      <el-col style="width: 200px;height: 100%; border:1px solid #c0c0c0;overflow-y: auto;">
        <el-tree :highlight-current="highlight" v-loading="treeLoading" :data="treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </el-col>
      <el-col style="padding-left: 10px;width: calc(100% - 200px);height: 100%;">
        <!-- 搜索 -->
        <div class="pull-left">
          <el-form :inline="true" class="mar-no" label-position="right">
            <el-form-item label="搜索字段">
              <el-select filterable clearable v-model="searchWord" ref="searchWord" placeholder="请选择" class="width155" @change="switchCondition">
                <el-option v-for="item in searchArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关键字" v-if="switchON === 1">
              <el-input clearable @keyup.enter.native="JS_search" v-model.trim="keyWords" placeholder="请输入" style="width:200px"></el-input>
            </el-form-item>
            <el-form-item label="日期" v-if="switchON === 2">
              <el-date-picker :clearable="false" range-separator="至" v-model.trim="batch" value-format="yyyy-MM-dd" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" style="width:270px">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="JS_search" icon="el-icon-search">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 更多操作 -->
        <div class="pull-right">
          <el-dropdown trigger="click" @command="handleCommand">
            <el-button type="primary">
              更多操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a" divided v-if="isRootUserActionAll(rootCode['主合同_新增'])">
                <i class="el-icon-plus"></i>&nbsp;新增
              </el-dropdown-item>
              <!-- <el-dropdown-item command="b" divided>
                <i class="el-icon-edit"></i>&nbsp;编辑
              </el-dropdown-item> -->
              <el-dropdown-item command="c" divided v-if="isRootUserActionAll(rootCode['主合同_删除'])">
                <i class="el-icon-delete"></i>&nbsp;删除
              </el-dropdown-item>
              <el-dropdown-item command="d" class="cloud-uploadBtn" divided v-if="isRootUserActionAll(rootCode['主合同_导入'])">
                <i></i>&nbsp;导入
              </el-dropdown-item>
              <el-dropdown-item command="e" class="cloud-downloadBtn" divided v-if="isRootUserActionAll(rootCode['主合同_导出'])">
                <i></i>&nbsp;导出
              </el-dropdown-item>
              <el-dropdown-item command="f" divided v-if="isRootUserActionAll(rootCode['主合同_恢复'])">
                <i class="el-icon-check"></i>&nbsp;恢复
              </el-dropdown-item>
              <el-dropdown-item command="g" divided title='只可清除为已删除状态的数据' v-if="isRootUserActionAll(rootCode['主合同_彻底清除'])">
                <i class="el-icon-delete"></i>彻底清除
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="table_wrap" style="height:100%;">
          <!-- 主合同 -->
          <el-table v-loading="mainLoading" 
            :key="1" 
            :data="mainData" 
            @selection-change="val => tbRowid = val" 
            border 
            style="width:100%;" 
            :height="subObj.mainTb" 
            :header-cell-style="{backgroundColor:'#e5e9f3',padding:'0'}"
            :header-row-style="{height:'20px'}"
            :cell-style="{padding:'0'}"
            :row-style="{height:'20px'}" >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column type="index" label="序号" fixed="left" min-width="50"></el-table-column>
            <el-table-column label="合同编号" fixed="left" min-width="200" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button type="text" @click="clickToDetails(scope.row,$event)" style="text-align: left" :class="{mark:true}" size="small">{{scope.row.contractCode}}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="typeName" label="合同类型" min-width="120"></el-table-column>
            <el-table-column prop="areaName" label="合同区域" min-width="120"></el-table-column>
            <el-table-column prop="chargeName" label="收付类型" min-width="120"></el-table-column>
            <el-table-column prop="name" label="合同名称" min-width="150" show-overflow-tooltip></el-table-column>
            <el-table-column prop="amount" label="合同金额" min-width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.amount | toThousands}}
              </template>
            </el-table-column>
            <el-table-column prop="amountCharged" label="已收/付金额" min-width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.amountCharged | toThousands}}
              </template>
            </el-table-column>
            <el-table-column prop="amountRemain" label="未/收付金额" min-width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.amountRemain | toThousands}}
              </template>
            </el-table-column>
            <el-table-column prop="invoiceCharged" label="已开票金额" min-width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.invoiceCharged | toThousands}}
              </template>
            </el-table-column>
            <el-table-column prop="invoiceRemain" label="未开票金额" min-width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.invoiceRemain | toThousands}}
              </template></el-table-column>
            <el-table-column prop="invoiceTypeName" label="发票类型" min-width="150" show-overflow-tooltip></el-table-column>
            <el-table-column prop="rateName" label="税率" min-width="100"></el-table-column>
            <el-table-column prop="warrantyAmount" label="质保金" min-width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.warrantyAmount | toThousands}}
              </template>
            </el-table-column>
            <el-table-column prop="warrantyRateName" label="质保金比例" min-width="120"></el-table-column>
            <el-table-column prop="signDate" label="签订日期" min-width="150"></el-table-column>
            <el-table-column prop="chargeCondition" label="付款条件" min-width="200" show-overflow-tooltip></el-table-column>
            <el-table-column prop="partyAUnitName" label="合同甲方（成本中心）" min-width="200" show-overflow-tooltip></el-table-column>
            <el-table-column prop="partyAResponsibility" label="甲方负责人" min-width="100"></el-table-column>
            <el-table-column prop="partyBUnitName" label="合同乙方" min-width="200" show-overflow-tooltip></el-table-column>
            <el-table-column prop="partyBResponsibility" label="乙方负责人" min-width="100"></el-table-column>
            <el-table-column prop="channelName" label="支付方式" min-width="100"></el-table-column>
            <el-table-column prop="startTime" label="开始日期" min-width="150"></el-table-column>
            <el-table-column prop="endTime" label="截止日期" min-width="150"></el-table-column>
            <el-table-column prop="responsibilityDeptName" label="所属部门" min-width="150"></el-table-column>
            <el-table-column prop="initiatorName" label="立项发起人" min-width="100"></el-table-column>
            <el-table-column prop="signerName" label="签订人" min-width="100"></el-table-column>
            <el-table-column prop="content" label="合同内容" min-width="200" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="edit-scope" v-html="scope.row.content"></span>
              </template>
            </el-table-column>
            <el-table-column prop="createUserName" label="录入人" min-width="100"></el-table-column>
            <el-table-column prop="createTime" label="录入时间" min-width="150"></el-table-column>
            <el-table-column prop="updateUserName" label="修改人" min-width="100"></el-table-column>
            <el-table-column prop="updateTime" label="修改时间" min-width="150"></el-table-column>
            <el-table-column prop="approvorName" label="审核人" min-width="100"></el-table-column>
            <el-table-column prop="approvalTime" label="审核时间" min-width="150"></el-table-column>
            <el-table-column prop="approvalStatus" label="审核结果" min-width="200" show-overflow-tooltip>
              <!-- 0待审批，1审批不通过，2审批通过 -->
              <template slot-scope="scope">
                <span v-if="scope.row.approvalStatus === 0 ">待审批</span>
                <span style="color:red" v-else-if="scope.row.approvalStatus === 1 ">{{scope.row.approvalResult}}</span>
                <span v-else-if="scope.row.approvalStatus === 2 ">{{scope.row.approvalResult}}</span>
                <span v-else></span>
              </template>
            </el-table-column>
            <el-table-column prop="executionName" label="执行情况" min-width="100"></el-table-column>
            <el-table-column prop="bvalid" label="状态" min-width="100">
              <template slot-scope="scope">
                <span style="color:red" v-if="scope.row.bvalid === 0 ">无效</span>
                <span v-else-if="scope.row.bvalid === 1 ">有效</span>
                <span v-else></span>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" min-width="150" v-if="isRootUserActionAll(rootCode['主合同_审核']) || isRootUserActionAll(rootCode['主合同_记录']) || isRootUserActionAll(rootCode['主合同_编辑'])">
              <template slot-scope="scope">
                <el-button type="text" @click="editRow(scope.row)" size="small" :disabled="scope.row.approvalStatus === 2" v-if="isRootUserActionAll(rootCode['主合同_编辑'])">编辑</el-button>
                <el-button type="text" @click="checkedRow(scope.row,'审核')" size="small" v-if="isRootUserActionAll(rootCode['主合同_审核'])">审核</el-button>
                <el-button type="text" @click="checkedRow(scope.row,'记录')" size="small" v-if="isRootUserActionAll(rootCode['主合同_记录'])">记录</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 总计 -->
          <el-alert :title="mainTotal" type="success" style="margin-top:5px;" :closable="false"></el-alert>
          <!-- 分页 -->
          <div id="pagination" style="text-align: center;">
            <el-pagination @size-change="handleSizeChange" @current-change="handlecurrentChange" background :current-page="configPageObj.current" :page-sizes="[15,20,30,40]" :page-size="configPageObj.size" layout="total,sizes,prev,pager,next,jumper" :total="configPageObj.total"></el-pagination>
          </div>
          <!-- 子合同 -->
          <first-subcontract ref="mychildPlane" :isRootUserActionAll="isRootUserActionAll" :countFunc="countFunc" :funcSeach="searchForMain" :configPageObj="configPageObj" :subObj="subObj"></first-subcontract>
        </div>
      </el-col>
    </el-row>
    <!-- 新增合同 -->
    <add-contract-form :constractFormObj="constractForm" :countFunc="countFunc" ref="mychildAdd"></add-contract-form>
    <!-- 审核 合同 -->
    <checked-contract-form :constractFormObj="constractFormChecked" ref="mychildChecked"></checked-contract-form>
    <!-- 导入 -->
    <el-dialog title="导入" :before-close="fileClose" :close-on-click-modal="false" :show-close="true" :visible.sync="exportObj.uploadModal" width="520px">
      <p class="clearfix">
        <el-upload ref="upload" :multiple="false" :limit="1" class="pull-left" :action="exportObj.uploadActionUrl" :headers="exportObj.headers" :before-remove="beforeRemove" :before-upload="beforeUpload" :on-success="handleSuccess">
          <el-button size="mediumn" icon="el-icon-upload">导入数据</el-button>
          <el-button size="mediumn" style="margin-left:15px;" icon="el-icon-download" @click.stop="uploadLink">下载模板</el-button>
          <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
        </el-upload>
      </p>
      <el-alert title="温馨提示！" type="warning" description="尊敬的管理员，为确保能够正常导入，请在导入前参考导入模板核对数据格式，确保数据格式无误后，再进行导入操作，导入完成后，请及时核对数据的准确性。" show-icon></el-alert>
      <span slot="footer" class="dialog-footer">
        <el-button @click="exportObj.uploadModal = false">取消</el-button>
      </span>
    </el-dialog>
    <!--导出 -->
    <el-dialog title="导出" :close-on-click-modal="false" :show-close="false" :visible.sync="download.caseModal" width="600px">
      <el-form label-width="60px">
        <el-row>
          <el-col :md="24">
            <el-form-item label="导出方式" label-width="110px">
              <el-select filterable v-model.trim="download.downWay" style="width:400px">
                <el-option v-for="item in download.downWayArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="exportToWary" type="primary">确定</el-button>
        <el-button @click="download.caseModal = false">取消</el-button>
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
    <!--合同工作记录 -->
    <el-dialog title="合同工作记录" :close-on-click-modal="false" :show-close="true" :visible.sync="workNote.caseModal" width="800px" class="plane-btn">
      <el-form label-width="100px">
        <el-row>
          <el-col :md="12">
            <el-form-item label="合同编号：">
              <span style="color:red">{{workNote.row.contractCode}}</span>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="合同名称：">
              <span style="color:red">{{workNote.row.name}}</span>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="收付类型：">
              <span style="color:red">{{workNote.row.chargeName}}</span>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="合同金额：">
              <span style="color:red">{{workNote.row.amount | toThousands}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="table_wrap">
          <el-table v-loading="workNote.loadingNote" height="300px" :data="workNote.dt" border :header-cell-style="{backgroundColor:'#e5e9f3'}">
            <el-table-column prop="recordDetail" label="明细" min-width="300" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-html="scope.row.recordDetail"></span>
              </template>
            </el-table-column>
            <el-table-column prop="createUserName" label="操作人" show-overflow-tooltip min-width="150"></el-table-column>
            <el-table-column prop="createTime" label="操作时间" min-width="150"></el-table-column>
          </el-table>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="workNote.caseModal = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import AddContractForm from './partComp/AddContractForm'
import CheckedContractForm from './partComp/CheckedContractForm'
import FirstSubcontract from './partComp/FirstSubcontract'
import Tools from "untils/index.js"
import codes from '../../untils/contractManager/getContractCode'
import { GET, POST, DELETE, PUT } from "http/custom.js"

export default {
  name: "contractFirst",
  mixins: [codes], // 引入的权限编号
  components: {
    FirstSubcontract,
    AddContractForm,
    CheckedContractForm
  },
  props: {//传过来的数据 
    dataListObj: {
      type: Object,
      required: true
    },
    isRootUserActionAll: {//是否有权限
      type: Function,
    },
    countFunc: {//是否有权限
      type: Function,
    }
  },
  data() {
    return {
      tbRowid: [], //勾选的行数据 
      searchWord: undefined, //搜索字段
      highlight: true,//高亮      
      //进度条相关参数
      importProcessInfoDialog: false,//导入进度弹框
      importError: false,// 导入错误时呈现的进度 
      downloadErrorEveProcess: false, //获取错误下载key
      loadErrorExcel: false,
      downloadErrorKey: false,
      progressBackBtn: false, //返回按钮
      progressPercentAge: 0, //进度百分比
      workNote: {
        caseModal: false,
        loadingNote: false,
        dt: [],
        row: ''
      },
      uploadProcessInfo: {
        total: '',//总条数
        handler: '',//已处理条数
        successful: '',//处理成功条数
        failures: '', //处理失败条数
        finish: false,//是否处理完成
        dealAllTime: '',//总耗时
      },
      subObj: {
        id: '',
        num: '',//合同编号
        planCharge: '',//收付类型
        planChargeName: '',//收付类型
        content: '',//合同内容
        errMark: '',//异常备注
        tab: 'first',//记录打开了子合同哪个页签
        rootCode: [], //给子组件的权限code
        mainTb: Tools.getTbHeight(405) / 2, //设置上下表格的高
      },
      keyTree: '',// 所选的树形参数
      keyWords: '', //关键字
      batch: [ //日期
        Tools.getYMd(), Tools.getYMd()
      ],
      t_height: Tools.getTbHeight(200), //设置主页面高
      treeLoading: false,
      mainLoading: false,
      mainTotal: '总计：',
      switchON: 0,//关键字/ 时间 开关
      download: { // 下载
        caseModal: false, //弹窗
        downWay: '1',
        downWayArr: [{ //下载方式 下拉
          value: '1',
          label: '保存至本地（需要等待数秒至数分钟）'
        }, {
          value: '2',
          label: '发送至本人内网邮箱'
        }],
        headers: {},// 行数据 
      },
      exportObj: { // 导入
        uploadModal: false, //弹窗
        uploadActionUrl: process.env.VUE_APP_DOMAIN_financial + "/contractImport",
        headers: {
          'x-user-token': localStorage.getItem('token') //设置上传数据文件excel的token
        },
      },
      constractForm: { // 合同管理添加表单
        caseModal: false, //弹窗
        title: '', //标题
        contractId: '',
        contractCode: ''
      },
      constractFormChecked: { // 合同管理 审核表单
        caseModal: false, //弹窗
        num: {},// 行数据 
      },
      configPageObj: {
        size: 15, //每页显示记录条数
        current: 1, //当前页码
        total: 0 //总记录数据
      },
      treeNumber: [{//树形父节点编号
        number: 'areaCode',
        name: '合同区域'
      }, {
        number: 'typeCode',
        name: '合同类型'
      }, {
        number: 'signYear',
        name: '年度'
      }, {
        number: 'chargeType',
        name: '收付类型'
      }, {
        number: 'executionCode',
        name: '执行情况'
      }, {
        number: 'signerCode',
        name: '签订人'
      }],
      mainData: [], //主合同表
      searchArr: [{ //下拉
        value: 'contractCode',
        label: '合同编号'
      }, {
        value: 'name',
        label: '合同名称'
      }, {
        value: 'amount',
        label: '合同金额'
      }, {
        value: 'amountCharged',
        label: '已收/付金额'
      }, {
        value: 'amountRemain',
        label: '未/收付金额'
      }, {
        value: 'invoiceCharged',
        label: '已开票金额'
      }, {
        value: 'invoiceRemain',
        label: '未开票金额'
      }, {
        value: 'invoiceTypeName',
        label: '发票类型'
      }, {
        value: 'rateName',
        label: '税率'
      }, {
        value: 'warrantyAmount',
        label: '质保金'
      }, {
        value: 'warrantyRateName',
        label: '质保金比例'
      }, {
        value: 'signDateStart_signDateEnd',
        label: '签订日期'
      }, {
        value: 'chargeCondition',
        label: '付款条件'
      }, {
        value: 'partyAUnitName',
        label: '合同甲方（成本中心）'
      }, {
        value: 'partyAResponsibility',
        label: '甲方负责人'
      }, {
        value: 'partyBUnitName',
        label: '合同乙方'
      }, {
        value: 'partyBResponsibility',
        label: '乙方负责人'
      }, {
        value: 'channelName',
        label: '支付方式'
      }, {
        value: 'startTimeStart_startTimeEnd',
        label: '开始日期'
      }, {
        value: 'endTimeStart_endTimeEnd',
        label: '截止日期'
      }, {
        value: 'responsibilityDeptName',
        label: '所属部门'
      }, {
        value: 'initiatorName',
        label: '立项发起人'
      }, {
        value: 'content',
        label: '合同内容'
      }, {
        value: 'createUserName',
        label: '录入人'
      }, {
        value: 'createTimeStart_createTimeEnd',
        label: '录入时间'
      }, {
        value: 'updateUserName',
        label: '修改人'
      }, {
        value: 'updateTimeStart_updateTimeEnd',
        label: '修改时间'
      }, {
        value: 'approvorName',
        label: '审核人'
      }, {
        value: 'approvalTimeStart_approvalTimeEnd',
        label: '审核时间'
      }, {
        value: 'approvalResult',//approvalResult
        label: '审核结果'
      }, {
        value: 'availableName',
        label: '状态'
      }],
      treeData: [],//树形
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      selectOrg: { //记录选中的子节点
        orgsid: []
      }
    };
  },
  created() {
    this.subObj.rootCode = this.rootCode;  
    this.queryTree();
    this.searchForMain();
  },
  methods: {
    messagePopp(type, msg) { //提示框
      this.$message({
        showClose: true,
        type: type,
        message: msg
      });
    },
    handleNodeClick(data) { //树形子节点点击事件
      console.log(data,'1111');
      if (data.children) {
        this.keyTree = ''; //取消选中
        return false;
      }
      const obj = this.treeNumber.find(v => {
        return data.nodeName === v.name;
      });
      //父节点参数字段名+父节点code+子节点名称+子节节点code
      this.keyTree = obj.number + ',' + data.nodeId + ',' + data.label + ',' + data.id;
      this.JS_search();
    },
    handleCommand(command) {//更多操作下拉框
      switch (command) {
        case 'a':
          this.constractForm.caseModal = true;
          this.constractForm.title = '增加合同';
          this.$refs.mychildAdd.queryForm();
          break;
        case 'b':
          break;
        case 'c':
          this.returnAndDel(0, '您是否确认删除合同？删除后不可恢复！'); //删除
          break;
        case 'd':
          this.exportObj.uploadModal = true;
          break;
        case 'e':
          this.download.caseModal = true;
          break;
        case 'f':
          this.returnAndDel(1, '您是否确认恢复合同？恢复后相关人员可查看和统计到！'); //恢复
          break;
        case 'g':
          this.deleteForFls();//彻底删除
          break;
        default:
          console.log('无默认值');
          break;
      }
    },
    deleteForFls() { // 批量删除
      if (this.tbRowid.length <= 0) {
        this.messagePopp("warning", "请勾选数据！");
        return;
      }
      let contractIds = this.tbRowid.map(v => v.contractId);
      console.log(contractIds, '333');
      this.$msgBox.confirm('您是否确认彻底删除合同？彻底删除将进行物理删除，不可恢复！！！', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        DELETE(process.env.VUE_APP_DOMAIN_financial + '/contracts', {
          contractIds: contractIds.join(',')
        }).then((res) => {
          if (res.data) {
            this.$msgBox.confirm(`清除失败的合同编号：${res.data.join(',')} `, "提示", {
              dangerouslyUseHTMLString: true,
              confirmButtonText: "确定",
              showCancelButton: false,
              showClose: false,
              type: "warning"
            })
          } else {
            this.messagePopp("success", "清除成功!");
          }
          this.searchForMain();
        }).catch(error => {
          console.error(error);
        });
      }).catch(() => {
        this.messagePopp("info", "已取消删除!");
      });
    },
    returnAndDel(optionType, text) { // 批量恢复/删除
      if (this.tbRowid.length <= 0) {
        this.messagePopp("warning", "请勾选数据！");
        return;
      }
      let contractIds = this.tbRowid.map(v => v.contractId);

      this.$msgBox.confirm(text, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        PUT(process.env.VUE_APP_DOMAIN_financial + '/upSetContracts', {
          contractIds: contractIds,
          optionType: optionType
        }).then(() => {
          this.messagePopp("success", optionType === 0 ? '已删除！' : '恢复成功！');
          this.searchForMain();
        }).catch(error => {
          console.error(error);
        });
      }).catch(() => {
        this.messagePopp("info", "已取消恢复!");
      });
    },
    clickToDetails(row, event) { //显示子合同所打开的页签内容
      this.setRowData(row);
      //所有  class=mark  的 btn 颜色置蓝
      Array.from(document.querySelectorAll('.mark')).forEach(el => {
        el.className = 'el-button el-button--text el-button--small mark link-span';
      });
      //当前 btn 置红
      event.currentTarget.className = 'el-button el-button--text el-button--small btncolor mark link-span';
      this.$refs.mychildPlane.tabShow(this.subObj.tab);
    },
    handlecurrentChange(val) {
      //点击页码，当前页
      this.configPageObj.current = val //保存状态-当前页
      this.searchForMain()
    },
    handleSizeChange(val) {
      //每页显示多少条数据切换
      this.configPageObj.size = val //保存状态-每页显示多少条数据切换
      this.searchForMain()
    },
    switchCondition(val) {
      this.keyWords = '';
      if (val === null || val === '') {
        this.switchON = 0;
        return;
      }
      //查找 对应的值
      const obj = this.searchArr.find(v => {
        return val === v.value;
      });
      //文本框和时间框切换
      if (obj.label.includes('时间') || obj.label.includes('日期')) {
        this.switchON = 2;
      } else {
        this.switchON = 1;
      }
    },
    editRow(row) { //编辑
      this.constractForm.caseModal = true;
      this.constractForm.title = '编辑合同';
      this.constractForm.contractId = row.contractId;
      this.constractForm.contractCode = row.contractCode;
      this.$refs.mychildAdd.queryForm();
    },
    checkedRow(row, val) { //审核 
      if (val === '审核') {
        this.constractFormChecked.num = row.contractCode;
        this.constractFormChecked.caseModal = true;
        this.$refs.mychildChecked.getDetails();
      } else {
        this.workNote.caseModal = true;
        this.workNote.row = row;
        GET(process.env.VUE_APP_DOMAIN_financial + '/contractrecord/all', {
          contractCode: row.contractCode
        }).then((res) => {
          this.workNote.dt = res.data;
        }).catch(error => {
          console.error(error);
        });
      }
    },
    beforeRemove(file) {//删除文件之前的钩子      
      return this.$msgBox.confirm(`确定移除 ${file.name}？`);
    },
    beforeUpload(file) {//上传文件之前的钩子      
      console.log("上传文件之前的回调", file);
      let testFileType = file.name.substring(file.name.lastIndexOf('.') + 1) //截取文件后缀
      const extension1 = testFileType === 'xls'
      const extension2 = testFileType === 'xlsx'
      if (!extension1 && !extension2) {//不是excel文件格式
        this.$message.error("上传数据文件只能是 xlsx/xls 格式!")
      }
      return extension1 || extension2
    },
    handleSuccess(res) {//上传文件接口调取成功回调
      this.exportObj.uploadModal = false;  //关闭导入弹框
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
      this.$refs.upload.clearFiles(); //清除上传的文件
    },
    unloadErrorLink() {//导入错误模板下载
      console.log('downloadErrorKey', this.downloadErrorKey)
      let url = process.env.VUE_APP_DOMAIN_download + '/oss/download?key=' + this.downloadErrorKey + '&token=' + localStorage.getItem("token") + "&name=" + encodeURI("合同导入失败明细") + ".xlsx";
      window.location.href = url;
    },
    importProgress() {//进度弹框关闭
      this.importProcessInfoDialog = false; //关闭进度弹框
      this.progressPercentAge = 0 //进度条清空为0
      this.progressBackBtn = false; //隐藏返回按钮
      this.loadErrorExcel = false; // 隐藏下载失败链接
    },
    queryProgress() { //上传进度条
      this.dataOrigin = this.exportData; //导入数据后可立即看表格数据 
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
            this.searchForMain();//刷新页面

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
    uploadLink() { // 导入中的下载模板
      GET(process.env.VUE_APP_DOMAIN_download + "/template/baseFilesTemplateByFileCode", //公共接口
        {
          fileCode: 'FINANCIAL_CONTRACT_IMPORT_EXCEL_TEMPLATE'
        }).then(res => {
          //获取模板存储返回的ID
          window.location.href = `${process.env.VUE_APP_DOMAIN_download}/oss/download?key=${res.data.fileTemplateId}&name=${res.data.fileTemplateName}.${res.data.fileTemplateSuffix}`
        }).catch(error => {
          console.log(error);
        });
    },
    exportToWary() { //导出      
      // 导出方式   1直接下载  2发到邮箱
      let ul = process.env.VUE_APP_DOMAIN_financial + '/contractExport';
      const object = this.getParam();

      if (this.download.downWay === '1') {//导出本地
        let param = '';
        for (const key in object) {
          if (object.hasOwnProperty(key)) {
            param += '&' + key.toString() + '=' + object[key];
          }
        }
        this.messagePopp("success", "已经导出至本地！");
        let urls = `${ul}?token=${localStorage.getItem("token")}&exportType=${this.download.downWay + param}`;
        window.location.href = urls;
      } else {
        //导出至邮箱   这个接口没有返回值，后台要求直接提示
        POST(ul, Object.assign({}, object, { exportType: this.download.downWay })).then(() => {
          this.messagePopp("success", "已经导入至您的邮箱！");
        }).catch(error => {
          console.log(error);
        });
      }

      // 关闭导出弹窗
      this.download.caseModal = false;
    },
    fileClose() {//清除表单      
      this.exportObj.uploadModal = false;
      this.$refs.upload.clearFiles() //清空已上传的文件列表（该方法不支持在 before-upload 中调用）
    },
    queryTree() { //查询树形
      this.treeLoading = true;
      POST(process.env.VUE_APP_DOMAIN_financial + '/contractDictTypeList', { queryFlag: 'LEFT' }).then(res => {
        this.treeLoading = false;
        if (res.data && res.data.length > 0) {
          //生成树形数据 
          this.treeData = res.data.map(v => {
            let arr = [];
            if (v.contractDictDataEntityList.length > 0) {
              //获取子节点
              arr = v.contractDictDataEntityList.map(list => {
                return {
                  nodeId: v.typeCode , //父节点Code
                  nodeName: v.typeValue , //父节点名称 
                  id: list.dataCode , //子节点Code
                  label: list.dataValue //子节点名称 
                }
              });
            }
            //生成父节点
            return {
              label: v.typeValue,
              children: arr
            }
          });
        }
      }).catch(error => {
        console.log(error);
      });
    },
    JS_search() { //搜索
      this.configPageObj.current = 1;
      this.searchForMain();
    },
    getParam() { // 汇聚参数
      let searchObj = {
        current: this.configPageObj.current, //当前页码
        size: this.configPageObj.size //每页显示记录条数
      };
      //设置点击树形时的参数
      if (this.keyTree !== '') {
        const tpArr = this.keyTree.split(',');
        searchObj = Object.assign(searchObj, {
          [tpArr[0]]: tpArr[0] === 'signYear' ? tpArr[2] : tpArr[3] //只有年度不传编号 
        });
      }

      //设置下拉所选时的参数
      if (this.searchWord !== undefined && this.searchWord !== null) {
        if (this.searchWord.includes('_')) { // 当为日期相关的参数
          searchObj = Object.assign(searchObj, {
            [this.searchWord.split('_')[0]]: this.batch ? this.batch[0] : '',
            [this.searchWord.split('_')[1]]: this.batch ? this.batch[1] : '',
          });
        } else { // 当为文本框
          searchObj = Object.assign(searchObj, { [this.searchWord]: this.keyWords });
        }
      }
      return searchObj;
    },
    searchForMain() {//查询主合同,初始化值
      let searchObj = this.getParam();
      this.mainLoading = true;
      //调取数据
      POST(process.env.VUE_APP_DOMAIN_financial + "/contracts", searchObj).then(res => {
        this.mainLoading = false;
        if (res.data) {
          this.mainData = res.data.records;
          this.configPageObj.current = res.data.current; //当前页
          this.configPageObj.size = res.data.size; //每页显示记录条数先
          this.configPageObj.total = res.data.total; //总记录数据

          if (res.data.records.length > 0) {
            let contract = 0, already = 0,
              nomoney = 0, ticket = 0, noticket = 0;
            res.data.records.forEach(item => {
              contract += item.amount;
              already += item.amountCharged;
              nomoney += item.amountRemain;
              ticket += item.invoiceCharged;
              noticket += item.invoiceRemain;
            });
            this.mainTotal = '总计：合同金额：' + (contract === 0 ? '--' : contract.toFixed(2))
              + '；已收/付金额：' + (already === 0 ? '--' : already.toFixed(2))
              + '；未/收付金额：' + (nomoney === 0 ? '--' : nomoney.toFixed(2))
              + '；已开票金额：' + (ticket === 0 ? '--' : ticket.toFixed(2))
              + '；未开票金额：' + (noticket === 0 ? '--' : noticket.toFixed(2));

            this.setRowData(this.mainData[0]); //默认获取第一条数据
            setTimeout(() => {
              //当表格生成以后查询合同编号的按钮
              this.$nextTick(() => {
                const markClass = Array.from(document.querySelectorAll('.mark'));
                if (markClass.length > 0) {
                  markClass.forEach((el) => {
                    el.className = 'el-button el-button--text el-button--small mark link-span';
                  });
                  // el-table 的列会生成三倍，这里要取第二部分的第一个 默认为红
                  markClass[markClass.length / 3].className = 'el-button el-button--text el-button--small  btncolor mark link-span';
                }
              })
            }, 20);
          } else {
            this.setRowData({});
            this.mainTotal = '总计：';
          }

          //执行子组件的方法
          this.$refs.mychildPlane.tabShow(this.subObj.tab);
        }
      }).catch(error => {
        this.mainLoading = false;
        console.log(error);
      });
    },
    setRowData(row) { //设置给子组件的值
      this.subObj.id = row.contractId || '';
      this.subObj.num = row.contractCode || '';
      this.subObj.planCharge = row.chargeType || '';
      this.subObj.planChargeName = row.chargeName || '';
      this.subObj.content = row.content || '';
      this.subObj.errMark = row.unusualNotes || '';
    }
  },
  computed: {},
  watch: {},
};
</script>

<style lang="less" >
.contract-first {
    //合同编号加...
    .link-span {
    text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        display: inline-block;
        width: 180px;
    }
    //合同编号加颜色
  .btncolor {
    color: red !important;
  }
  .point {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .edit-scope {
    display: inline-block;
    height: 20px;
    width: 170px;
    .point;

    p{
        display: inline;
    }

    & > p:nth-child(1) {
      .point;
    }
  }
}
</style>
