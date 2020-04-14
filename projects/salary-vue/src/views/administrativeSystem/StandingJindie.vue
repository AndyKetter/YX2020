<template>
  <div>
    <div class="guide">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home/administrativeSystem' }">行政系统</el-breadcrumb-item>
        <el-breadcrumb-item>金蝶台账</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/administrativeSystem' }">(返回上级)</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="bgWhite mgt15">
      <el-tabs v-model="activeName" type="border-card" :before-leave="tabsClick">
        <el-tab-pane label="金蝶台账" name="first">
          <div class="pull-left">
            <el-form :inline="true" class="mar-no pull-left">
              <el-form-item label="年月">
                <el-date-picker
                  v-model="dateYearMonth"
                  type="month"
                  value-format="yyyy-MM"
                  placeholder="选择日期"
                  class="width155"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="所属区域">
                <el-select
                  filterable
                  :clearable="clearableFlag"
                  v-model="workAreaId"
                  ref="shworkAreaId"
                  placeholder="请选择"
                  class="width155"
                >
                  <el-option
                    v-for="item in areaOptions"
                    :key="item.areaId"
                    :label="item.areaName"
                    :value="item.areaId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="申请类型">
                <el-select
                  filterable
                  clearable
                  v-model="applyType"
                  placeholder="请选择申请类型"
                  class="width155"
                >
                  <el-option
                    v-for="item in applyTypeOptions"
                    :key="item.id"
                    :label="item.fieldName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="JS_jindieSearch" icon="el-icon-search">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="pull-right">
            <el-button icon="el-icon-plus" @click="jindie_js_add">新增</el-button>&nbsp;
            <el-dropdown @command="handleCommand" trigger="click">
              <el-button type="primary">
                更多操作
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a" class="cloud-uploadBtn">
                  <i></i>&nbsp;导入
                </el-dropdown-item>
                <el-dropdown-item command="b" divided class="cloud-downloadBtn">
                  <i></i>&nbsp;导出
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>&nbsp;
          </div>
          <div class="table_wrap">
            <el-table
              v-loading="loading"
              :height="tabHeight"
              :data="jindieTBData"
              border
              style="width:100%"
              :header-cell-style="{backgroundColor:'#e5e9f3'}"
            >
              <el-table-column label="序号" type="index" min-width="50"></el-table-column>
              <el-table-column prop="dateYearMonth" label="日期" min-width="100"></el-table-column>
              <el-table-column
                prop="applyTypeName"
                label="申请类型"
                min-width="160"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="workAreaName"
                label="所属区域"
                min-width="160"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                label="发起人"
                prop="initiatorName"
                min-width="150"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="applyClassName"
                label="申请类别"
                min-width="160"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column prop="remark" label="备注" min-width="250" show-overflow-tooltip></el-table-column>
              <el-table-column label="金额" min-width="160">
                <template slot-scope="scope">{{scope.row.billMoney | toThousands}}</template>
              </el-table-column>
              <el-table-column prop="payeeName" label="收款人" min-width="150" show-overflow-tooltip></el-table-column>
              <el-table-column prop="depositBank" label="开户行" min-width="200" show-overflow-tooltip></el-table-column>
              <el-table-column prop="bankAccount" label="账号" min-width="180" show-overflow-tooltip></el-table-column>
              <el-table-column prop="billNumber" label="单据编号" min-width="180" show-overflow-tooltip></el-table-column>
              <el-table-column
                prop="createUserName"
                label="添加人"
                min-width="150"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column prop="createTime" label="添加时间" min-width="160" show-overflow-tooltip></el-table-column>
              <el-table-column prop="operation" label="操作" fixed="right" min-width="100">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="jindie_updateThis(scope.row.id)">修改</el-button>
                  <el-button type="text" size="small" @click="jindie_deleteThis(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div id="pagination">
              <el-pagination
                @size-change="handleSizeChange_jindie"
                @current-change="handlecurrentChange_jindie"
                background
                :current-page="jindie_configPageObj.current"
                :page-sizes="[10,15,20,30,40]"
                :page-size="jindie_configPageObj.size"
                layout="total,sizes,prev,pager,next,jumper"
                :total="jindie_configPageObj.total"
              ></el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="金蝶台账类型管理"
          name="second"
          v-if="permissions(permissionsMapObj['金蝶台账类型管理-tab'])"
        >
          <div class="pull-left">
            <el-form :inline="true" class="mar-no pull-left">
              <el-form-item label="对应字段">
                <el-select
                  clearable
                  v-model="metaDefinefieldId"
                  placeholder="请选择对应字段"
                  class="width155"
                >
                  <el-option
                    v-for="item in metaDefinefield"
                    :key="item.id"
                    :label="item.value"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="JS_typeManageSearch">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="pull-right">
            <el-button icon="el-icon-plus" @click="jindieManage_js_add">新增</el-button>&nbsp;
          </div>
          <div class="table_wrap">
            <el-table
              v-loading="loading"
              :height="tabHeight"
              :data="jindieManageTbData"
              border
              style="width:100%"
              :header-cell-style="{backgroundColor:'#e5e9f3'}"
            >
              <el-table-column label="序号" type="index" min-width="50"></el-table-column>
              <el-table-column prop="metaDefinefieldName" label="对应字段"></el-table-column>
              <el-table-column prop="fieldName" label="名称"></el-table-column>
              <el-table-column prop="operation" label="操作" fixed="right" width="100">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    @click="jindieManage_updateThis(scope.row.id)"
                  >修改</el-button>
                  <el-button
                    type="text"
                    size="small"
                    @click="jindieManage_deleteThis(scope.row.id)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div id="pagination">
              <el-pagination
                @size-change="handleSizeChange_second"
                @current-change="handlecurrentChange_second"
                background
                :current-page="jindieManage_configPageObj.current"
                :page-sizes="[10,15,20,30,40]"
                :page-size="jindieManage_configPageObj.size"
                layout="total,sizes,prev,pager,next,jumper"
                :total="jindieManage_configPageObj.total"
              ></el-pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 新增台账 -->
    <el-dialog
      title="新增"
      :close-on-click-modal="false"
      :visible.sync="jindie_addModal"
      :before-close="jindie_close"
      width="820px"
    >
      <div>
        <el-form
          :model="jindie_addform"
          :rules="jindie_addformRule"
          ref="jindie_addform"
          label-width="100px"
        >
          <el-row>
            <el-col :md="8">
              <el-form-item label="日期：" prop="dateYearMonth">
                <el-date-picker
                  v-model="jindie_addform.dateYearMonth"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                  class="width155"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :md="8">
              <el-form-item label="申请类型：" prop="applyType">
                <el-select
                  filterable
                  clearable
                  v-model="jindie_addform.applyType"
                  placeholder="请选择"
                  class="width155"
                >
                  <el-option
                    v-for="item in applyTypeOptions"
                    :key="item.id"
                    :label="item.fieldName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="8">
              <el-form-item label="所属区域：" prop="workAreaId">
                <el-select
                  filterable
                  :clearable="clearableFlag"
                  ref="workAreaName"
                  v-model="jindie_addform.workAreaId"
                  placeholder="请选择"
                  class="width155"
                >
                  <el-option
                    v-for="item in areaOptions"
                    :key="item.areaId"
                    :label="item.areaName"
                    :value="item.areaId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="8">
              <el-form-item label="发起人：" prop="initiatorName">
                <el-input
                  v-model.trim="jindie_addform.initiatorName"
                  placeholder="请输入发起人名字"
                  class="width155"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="8">
              <el-form-item label="申请类别：" prop="applyClass">
                <el-select
                  filterable
                  clearable
                  v-model="jindie_addform.applyClass"
                  placeholder="请选择"
                  class="width155"
                >
                  <el-option
                    v-for="item in applyTOptions"
                    :key="item.id"
                    :label="item.fieldName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="8">
              <el-form-item label="备注：" prop="remark">
                <el-input v-model.trim="jindie_addform.remark" placeholder="请输入备注" class="width155"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="8">
              <el-form-item label="金额：" prop="billMoney">
                <el-input-number
                  :controls="false"
                  v-model="jindie_addform.billMoney"
                  class="width155"
                  :min="0"
                  :max="10000000"
                  placeholder="请输入金额"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :md="8">
              <el-form-item label="收款人：" prop="payeeName">
                <el-input
                  v-model.trim="jindie_addform.payeeName"
                  placeholder="请输入收款人名字"
                  class="width155"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="8">
              <el-form-item label="开户行：" prop="depositBank">
                <el-input
                  v-model="jindie_addform.depositBank"
                  placeholder="请输入开户行"
                  class="width155"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="8">
              <el-form-item label="账号：" prop="bankAccount">
                <el-input v-model="jindie_addform.bankAccount" class="width155" placeholder="请输入账号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="8">
              <el-form-item label="单据编号：" prop="billNumber">
                <el-input
                  v-model="jindie_addform.billNumber"
                  placeholder="请输入单据编号"
                  class="width155"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="jindie_JS_cancel('jindie_addform')">取消</el-button>
        <el-button type="primary" @click="jindie_JS_add_save('jindie_addform')" v-no-more-click>保存</el-button>
      </span>
    </el-dialog>

    <!-- 新增台账类型管理 -->
    <el-dialog
      title="新增"
      :close-on-click-modal="false"
      :visible.sync="jindieManage_addModal"
      :before-close="jindieManage_close"
      width="768px"
    >
      <div>
        <el-form
          :model="jindieManage_addform"
          :rules="jindieManage_addformRule"
          ref="jindieManage_addform"
          label-width="100px"
        >
          <el-row>
            <el-col :md="12">
              <el-form-item label="对应字段：" prop="metaDefinefieldId">
                <el-select
                  filterable
                  clearable
                  ref="metaDefinefieldLabel"
                  v-model="jindieManage_addform.metaDefinefieldId"
                  placeholder="请选择"
                  class="width155"
                >
                  <el-option
                    v-for="item in metaDefinefield"
                    :key="item.id"
                    :label="item.value"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="名称：" prop="fieldName">
                <el-input
                  v-model.trim="jindieManage_addform.fieldName"
                  placeholder="请输入名称"
                  class="width155"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="jindieManage_JS_cancel('jindieManage_addform')">取消</el-button>
        <el-button
          type="primary"
          @click="jindieManage_JS_add_save('jindieManage_addform')"
          v-no-more-click
        >保存</el-button>
      </span>
    </el-dialog>
    <!-- 金蝶台账导入弹框 -->
    <el-dialog
      title="金蝶台账导入"
      :show-close="false"
      :close-on-click-modal="false"
      :visible.sync="uploadModal"
      width="520px"
    >
      <p class="clearfix">
        <el-upload
          class="pull-left"
          ref="upload"
          :action="uploadActionUrl"
          :headers="headers"
          :before-remove="beforeRemove"
          :before-upload="beforeUpload"
          :on-success="handleSuccess"
          :file-list="fileList"
          :data="uploadDataExtr"
        >
          <el-button size="mediumn" icon="el-icon-upload">导入数据</el-button>
          <el-button
            size="mediumn"
            @click.stop="JS_download"
            style="margin-left:15px;"
            icon="el-icon-download"
          >下载模板</el-button>
          <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
        </el-upload>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="fileClose('exportExform')">取消</el-button>
      </span>
    </el-dialog>

    <!-- 导入信息 -->
    <el-dialog
      title="导入信息"
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="importProcessInfoDialog"
      width="600px"
    >
      <div class="pad-all mar-ver">
        <el-progress :text-inside="true" :stroke-width="20" :percentage="progressPercentAge"></el-progress>
        <p>
          正在导入，本次需导入总记录{{uploadProcessInfo.total | repair}}条，
          <span
            style="color:#66b1ff"
          >成功{{uploadProcessInfo.successful | repair}}条</span>，
          <span style="color:red">失败{{uploadProcessInfo.failures | repair}}条</span>
          ，总耗时{{uploadProcessInfo.dealAllTime}}
        </p>
        <p v-show="loadErrorExcel">
          <el-button type="text" @click="unloadErrorLink" class="underlineTxt">点击下载导入失败明细</el-button>
          <span style="color:#a1a1a1">(导入失败明细已发送到您内网邮箱)</span>
        </p>
      </div>
      <span slot="footer" class="dialog-footer" v-show="progressBackBtn">
        <el-button type="primary" @click="importProgress">返回</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import tbMixin from "libs/mixin/tbMixin.js" //动态计算表格高度mixin
import { POST, DELETE, GET, PUT } from "http/custom.js"
import qs from "qs"
import Tools from "untils/index.js"

export default {
  name: "standingJindie",
  mixins: [tbMixin],
  data() {
    const uploadActionUrl = process.env.VUE_APP_DOMAIN_administration + "/ledgerKingdeImportData" //导入action  线上
    return {
      //权限相关
      permissionsMapObj: {
        //老系统action权限映射对象
        "全部-区域": "cf41a01cb4ce4ce4bb4dc8240eb4891c",
        "金蝶台账类型管理-tab": "6dd822c46d1e4b6298fa8f30641cd7a3"
      },
      clearableFlag: false,
      //导入相关
      uploadDataExtr: {
        areaId: "",
        areaName: ""
      },
      fileList: [], //上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
      headers: {}, //上传图片请求头
      uploadActionUrl,
      uploadModal: false, //导入弹框
      //进度条相关参数
      importProcessInfoDialog: false, //取消进度条框
      importError: false, // 导入错误时呈现的进度
      downloadErrorEveProcess: false, //获取错误下载key
      loadErrorExcel: false, //呈现失败下载明细
      downloadErrorKey: false,
      progressPercentAge: 0,
      progressBackBtn: false, //返回按钮
      uploadProcessInfo: {
        total: "", //总条数
        handler: "", //已处理条数
        successful: "", //处理成功条数
        failures: "", //处理失败条数
        finish: false, //是否处理完成
        dealAllTime: "" //总耗时
      },
      //公共属性
      activeName: "first", //默认显示第一个tab
      t_height: 315, //动态计算表格高度
      loading: false, //table加载动画开关
      //金蝶台账相关 start
      workAreaId: "", //所属区域ID
      areaOptions: [], //所属区域字典options
      applyType: "", //申请类型id
      dateYearMonth: "", //查询年月
      applyTypeOptions: [], //申请类型options
      applyTOptions: [], //申请类别options
      //table相关
      jindieTBData: [], //金蝶tab数据
      jindie_configPageObj: {
        size: 15, //每页显示记录条数
        current: 1, //当前页码
        total: 0 //总记录数据
      },
      updatejdId: "", //修改id
      jindie_addModal: false,
      jindie_addform: {
        dateYearMonth: "", //日期
        applyType: "", //申请类型id
        applyClass: "", //申请类别id
        workAreaId: "", //所属区域id
        workAreaName: "", //所属区域name
        initiatorName: "", //发起人name
        remark: "", //备注
        billMoney: undefined, //金额
        payeeName: "", //收款人
        depositBank: "", //开户行
        bankAccount: undefined, //账号
        billNumber: "" //单据编号
      },
      jindie_addformRule: {
        dateYearMonth: [{ required: true, message: "请选择日期", trigger: "change" }],
        applyType: [{ required: true, message: "请选择申请类型", trigger: "change" }],
        applyClass: [{ required: true, message: "请选择申请类别", trigger: "change" }],
        workAreaId: [{ required: true, message: "请选择所属区域", trigger: "change" }],
        initiatorName: [{ required: true, message: "请填写发起人", trigger: "blur" }],
        remark: [{ required: true, message: "请填写备注", trigger: "blur" }],
        billMoney: [{ required: true, message: "请填写金额", trigger: "blur" }],
        payeeName: [{ required: true, message: "请填写收款人", trigger: "blur" }],
        depositBank: [{ required: true, message: "请填写开户行", trigger: "blur" }],
        bankAccount: [{ required: true, message: "请填写账号", trigger: "blur" }],
        billNumber: [{ required: true, message: "请填写单据编号", trigger: "blur" }]
      },
      //金蝶台账相关 end

      //金蝶台账类型管理相关 start
      metaDefinefieldId: "", //搜索对应字段id
      metaDefinefield: [
        //对应字段(1申请类型2申请类别)
        { id: "1", value: "申请类型" },
        { id: "2", value: "申请类别" }
      ],
      jindieManageTbData: [], //表格数据源数组
      updateId: "", //修改id
      //table相关
      jindieManage_configPageObj: {
        size: 15, //每页显示记录条数
        current: 1, //当前页码
        total: 0 //总记录数据
      },
      jindieManage_addModal: false,
      jindieManage_addform: {
        metaDefinefieldId: "", //对应字段(1申请类型2申请类别)
        metaDefinefieldName: "", //对应字段名称
        fieldName: "" //名称
      },
      jindieManage_addformRule: {
        metaDefinefieldId: [{ required: true, message: "请选择对应字段", trigger: "change" }],
        fieldName: [{ required: true, message: "请填写名称", trigger: "blur" }]
      }
      //金蝶台账类型管理相关 end
    }
  },
  methods: {
    //导入相关
    beforeRemove(file) {
      //删除文件之前的钩子
      return this.$msgBox.confirm(`确定移除 ${file.name}？`, {
        confirmButtonText: "确定",
        type: "warning",
        showClose: false,
        showCancelButton: false
      })
    },
    beforeUpload(file) {
      //上传文件之前的钩子
      console.log("上传文件之前的回调", file)
      if (!this.workAreaId) {
        this.$message.info("请在搜索栏选择导入的所属区域")
        return false
      }

      let testFileType = file.name.substring(file.name.lastIndexOf(".") + 1) //截取文件后缀
      const extension1 = testFileType === "xls"
      const extension2 = testFileType === "xlsx"
      if (!extension1 && !extension2) {
        //不是excel文件格式
        this.$message.error("上传数据文件只能是 xlsx/xls 格式!")
      }
      return extension1 || extension2
    },
    fileClose() {
      //关闭导入弹框
      //清除表单
      this.uploadModal = false
      this.$refs.upload.clearFiles() //清空已上传的文件列表（该方法不支持在 before-upload 中调用）
    },
    handleSuccess(res) {
      //上传文件接口调取成功回调
      this.uploadModal = false
      if (res.code === 0) {
        // 文件上传成功
        this.downloadErrorEveProcess = res.data //获取进度条事件句柄
        //错误导入进度条与下载模板
        this.importProcessInfoDialog = true
        this.queryProgress() //获取上传文件进度条信息
      } else {
        //失败
        let msgError = res.msg || "【系统无法识别EXCLE中的空白，公式和非法字符。请先清理】。" //50*非0情况
        this.$msgBox.alert(`<span style="color:red;">${msgError} </span>`, "温馨提示", {
          dangerouslyUseHTMLString: true
        })
      }
      this.$refs.upload.clearFiles() //清空已上传的文件列表（该方法不支持在 before-upload 中调用）
    },
    queryProgress() {
      //上传进度条
      this.loadErrorExcel = false // 隐藏下载链接
      let progressAjax = window.setInterval(() => {
        GET(process.env.VUE_APP_DOMAIN_personnel + "/queryProgress", { progressKey: this.downloadErrorEveProcess })
          .then(res => {
            this.uploadProcessInfo = res.data //进度信息对象
            if (res.data.total) {
              this.progressPercentAge = parseInt((res.data.handler / res.data.total) * 100)
            }
            if (res.data.finish) {
              //已完成
              this.progressPercentAge = 100 //进度完成度
              let calc = res.data.endTime - res.data.beginTime
              let time = parseInt(calc / 1000) //计算完成时间
              this.uploadProcessInfo.dealAllTime = time >= 1 ? time + "秒" : calc + "毫秒"
              if (this.permissions("cf41a01cb4ce4ce4bb4dc8240eb4891c")) {
                //如果有查看所有区域的权限就清空workAreaId去查所有,否则不清空,保留所属区域条件
                this.workAreaId = "" //置空搜索中所属区域条件
              }
              this.jindieSearch() //刷新页面

              setTimeout(() => {
                if (res.data.failures > 0) {
                  //表示有导入失败的，呈现可下载模板
                  this.downloadErrorKey = res.data.failFile //获取错误模板下载key
                  this.loadErrorExcel = true // 呈现下载链接
                }
                this.progressBackBtn = true //进度条完成后，呈现返回按钮
              }, progressAjax + 1000)
              window.clearInterval(progressAjax) //清除轮询
            }
          })
          .catch(error => {
            window.clearInterval(progressAjax) //清除轮询
            console.log(error)
          })
      }, 1000)
    },
    unloadErrorLink() {
      //导入错误模板下载
      console.log("downloadErrorKey", this.downloadErrorKey)
      let url = process.env.VUE_APP_DOMAIN_download + "/oss/download?key=" + this.downloadErrorKey + "&token=" + localStorage.getItem("token") + "&name=" + encodeURI("金蝶台账失败明细") + ".xlsx"
      window.location.href = url
    },
    importProgress() {
      //进度弹框关闭
      this.importProcessInfoDialog = false //关闭进度弹框
      this.progressPercentAge = 0 //进度条清空为0
      this.progressBackBtn = false //隐藏返回按钮
      this.loadErrorExcel = false // 隐藏下载失败链接
    },
    //导入结束
    //导出开始
    JS_download() {
      //下载模板
      GET(`${process.env.VUE_APP_DOMAIN_download}/template/baseFilesTemplateByFileCode`, { fileCode: "LEDGER_KINGDE_IMPORT_TEMPLATE" })
        .then(res => {
          //获取模板存储返回的ID
          let url = `${process.env.VUE_APP_DOMAIN_download}/oss/download?key=${res.data.fileTemplateId}&name=${res.data.fileTemplateName}.${res.data.fileTemplateSuffix}`
          window.location.href = url
        })
        .catch(error => {
          console.log(error)
        })
    },
    //导出结束
    tabsClick(activeName) {
      //切换标签之前的钩子，若返回 false 或者返回 Promise 且被 reject，则阻止切换。
      if (activeName == "second") {
        this.typeManageSearch() //金蝶台账类型管理分页搜索
      }
      if (activeName == "first") {
        this.jindieSearch() //金蝶台账分页搜索
      }
    },
    //金蝶台账相关 start
    handleCommand(command) {
      //更多操作下拉框
      if (command == "a") {
        //导入
        this.uploadModal = true
        this.uploadDataExtr = {
          ...this.uploadDataExtr,
          ...{
            areaId: this.workAreaId,
            areaName: this.$refs.shworkAreaId.selectedLabel
          }
        }
      } else if (command == "b") {
        //导出
        this.exportData()
      }
    },
    queryUserInfoToRegid(regid) {
      //根据用户id获取个人信息
      GET(process.env.VUE_APP_DOMAIN_personnel + "/queryUserInfoToRegid", { regid })
        .then(res => {
          console.log("根据用户id获取个人信息", res)
          if (res.data.areaId) {
            //存在区域数据
            this.areaOptions = [
              //设置为个人区域
              {
                areaId: parseInt(res.data.areaId),
                areaName: res.data.areaName
              }
            ]
            this.jindie_addform.workAreaId = parseInt(res.data.areaId) //新增修改下拉默认显示个人区域
            this.workAreaId = parseInt(res.data.areaId) //搜索下拉默认显示个人区域
            this.jindieSearch() //再次查询金蝶台账分页
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    queryAreaList() {
      //获取所属区域
      POST(process.env.VUE_APP_DOMAIN_personnel + "/queryAreaList")
        .then(res => {
          this.areaOptions = res.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    queryApplyTypeList() {
      //获取申请类型下拉框
      GET(process.env.VUE_APP_DOMAIN_administration + "/ledgerKingdeeTypeArry", { metaDefinefieldId: 1 })
        .then(res => {
          console.log("获取申请类型下拉框", res)
          this.applyTypeOptions = res.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    queryTypeList() {
      //获取申请类别下拉框
      GET(process.env.VUE_APP_DOMAIN_administration + "/ledgerKingdeeTypeArry", { metaDefinefieldId: 2 })
        .then(res => {
          console.log("获取申请类别下拉框", res)
          this.applyTOptions = res.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    handlecurrentChange_jindie(val) {
      //点击页码，当前页
      this.jindie_configPageObj.current = val //保存状态-当前页
      this.jindieSearch()
    },
    handleSizeChange_jindie(val) {
      //每页显示多少条数据切换
      this.jindie_configPageObj.size = val //保存状态-每页显示多少条数据切换
      this.jindieSearch()
    },
    JS_jindieSearch() {
      this.jindie_configPageObj.current = 1 //点击搜索current=1搜索第一页
      this.jindieSearch()
    },
    jindieSearch() {
      //金蝶台账分页搜索
      let searchObj = {
        //查询对象,在这里初始化
        dateYearMonth: this.dateYearMonth || "", //所属年月
        workAreaId: this.workAreaId || "", //所属区域ID
        applyType: this.applyType || "", //申请类型id
        current: this.jindie_configPageObj.current, //当前页码
        size: this.jindie_configPageObj.size, //每页显示记录条数
        descs: ["create_time"]
      }
      this.loading = true //开启动画
      //金蝶台账分页查询
      POST(`${process.env.VUE_APP_DOMAIN_administration}/ledgerKingdes`, searchObj)
        .then(res => {
          console.log("金蝶台账分页查询", res)
          this.loading = false //关闭动画
          this.jindieTBData = res.data.records //set表格的值
          this.jindie_configPageObj.current = res.data.current //set当前页
          this.jindie_configPageObj.size = res.data.size //每页显示记录条数
          this.jindie_configPageObj.total = res.data.total //总记录条数
        })
        .catch(error => {
          console.log(error)
        })
    },
    jindie_js_add() {
      //台账类型新增
      this.jindie_addModal = true
    },
    jindie_updateThis(id) {
      //台账类型修改
      console.log("id多少", id)
      this.updatejdId = id //保存修改id
      this.jindie_addModal = true //弹出修改框

      GET(process.env.VUE_APP_DOMAIN_administration + "/ledgerKingde", { id })
        .then(res => {
          let idToNumObj = {
            //string id转 num id
            applyType: parseInt(res.data.applyType),
            applyClass: parseInt(res.data.applyClass),
            workAreaId: parseInt(res.data.workAreaId)
          }
          this.jindie_addform = { ...res.data, ...idToNumObj } //赋值给addConditionform对象
        })
        .catch(error => {
          console.log(error)
        })
    },
    jindie_deleteThis(id) {
      //单个删除
      this.$msgBox
        .confirm("你确定要删除该条数据吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          DELETE(process.env.VUE_APP_DOMAIN_administration + "/ledgerKingde", { id })
            .then(() => {
              //单条数据删除
              this.$message({
                type: "success",
                message: "删除成功!"
              })
              this.JS_jindieSearch() //刷新表格，重新获取数据
            })
            .catch(error => {
              console.log(error)
            })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          })
        })
    },
    jindie_resetAndSearch(formName) {
      //清除表单且重新搜索
      this.$refs[formName].resetFields()
      this.jindieSearch() //刷新表格，重新获取数据
    },
    jindie_JS_add_save(formName) {
      //修改-新增保存功能
      let httpType = ""
      let success_msg = ""
      if (this.updatejdId != "") {
        httpType = PUT //修改功能
        success_msg = "修改数据成功!"
      } else {
        httpType = POST //新增功能
        success_msg = "新增数据成功!"
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          let saveObj = { ...this.jindie_addform, ...{ workAreaName: this.$refs.workAreaName.selectedLabel } } //新增对象
          console.log("新增-修改对象", saveObj)
          eval(httpType)(process.env.VUE_APP_DOMAIN_administration + "/ledgerKingde", saveObj)
            .then(() => {
              this.updatejdId = "" //重置修改id
              this.$message({
                type: "success",
                message: success_msg,
                showClose: true
              })
              this.jindie_addModal = false //关闭新增弹框
              this.jindie_resetAndSearch(formName) //重置表单重新获取数据
            })
            .catch(error => {
              console.log(error)
            })
        } else {
          this.$message({
            showClose: true,
            type: "warning",
            message: "提交失败，验证不通过"
          })
        }
      })
    },
    jindie_JS_cancel(formName) {
      //取消  重置表单
      this.updatejdId = "" //重置修改id
      this.jindie_addModal = false //隐藏弹框
      this.$refs[formName].resetFields()
    },
    jindie_close() {
      //点击关闭icon x
      console.log("x")
      this.jindie_JS_cancel("jindie_addform")
      this.updatejdId = "" //重置修改id
    },
    exportData() {
      //导出
      let exportDataQuery = {
        dateYearMonth: this.dateYearMonth || "", //所属年月
        workAreaId: this.workAreaId || "", //所属区域ID
        applyType: this.applyType || "", //申请类型id
        exportType: 1, //导出类型 1-直接下载 2-邮件
        token: localStorage.getItem("token") //token
      }
      window.location.href = process.env.VUE_APP_DOMAIN_administration + "/ledgerKingdeExportData?" + qs.stringify(exportDataQuery) //window.location.href方式打开二进制文件下载文件
    },
    //金蝶台账相关 end

    //金蝶台账类型管理相关 start
    handlecurrentChange_second(val) {
      //点击页码，当前页
      this.jindieManage_configPageObj.current = val //保存状态-当前页
      this.typeManageSearch()
    },
    handleSizeChange_second(val) {
      //每页显示多少条数据切换
      this.jindieManage_configPageObj.size = val //保存状态-每页显示多少条数据切换
      this.typeManageSearch()
    },
    JS_typeManageSearch() {
      this.jindieManage_configPageObj.current = 1 //点击搜索current=1搜索第一页
      this.typeManageSearch()
    },
    typeManageSearch() {
      //金蝶台账类型管理分页搜索
      let searchObj = {
        //查询对象,在这里初始化
        metaDefinefieldId: this.metaDefinefieldId || "", //对应字段(1申请类型2申请类别)
        current: this.jindieManage_configPageObj.current, //当前页码
        size: this.jindieManage_configPageObj.size //每页显示记录条数
      }
      this.loading = true //开启动画
      //金蝶台账类型分页查询
      POST(`${process.env.VUE_APP_DOMAIN_administration}/ledgerKingdeeTypes`, searchObj)
        .then(res => {
          console.log("金蝶台账类型分页查询", res)
          this.loading = false //关闭动画
          this.jindieManageTbData = res.data.records //set表格的值
          this.jindieManage_configPageObj.current = res.data.current //set当前页
          this.jindieManage_configPageObj.size = res.data.size //每页显示记录条数
          this.jindieManage_configPageObj.total = res.data.total //总记录条数
        })
        .catch(error => {
          console.log(error)
        })
    },
    jindieManage_js_add() {
      //台账类型管理新增
      this.jindieManage_addModal = true
    },
    jindieManage_updateThis(id) {
      //台账类型管理修改
      console.log("id多少", id)
      this.updateId = id //保存修改id
      this.jindieManage_addModal = true //弹出修改框
      GET(process.env.VUE_APP_DOMAIN_administration + "/ledgerKingdeeType", { id })
        .then(res => {
          this.jindieManage_addform = { ...res.data } //赋值给addConditionform对象
        })
        .catch(error => {
          console.log(error)
        })
    },
    jindieManage_deleteThis(id) {
      //单个删除
      this.$msgBox
        .confirm("你确定要删除该条数据吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          DELETE(process.env.VUE_APP_DOMAIN_administration + "/ledgerKingdeeType", { id })
            .then(() => {
              //单条数据删除
              this.$message({
                type: "success",
                message: "删除成功!"
              })
              this.JS_typeManageSearch() //刷新表格，重新获取数据
            })
            .catch(error => {
              console.log(error)
            })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          })
        })
    },
    jindieManage_resetAndSearch(formName) {
      //清除表单且重新搜索
      this.$refs[formName].resetFields()
      this.typeManageSearch() //刷新表格，重新获取数据
    },
    jindieManage_JS_add_save(formName) {
      //修改-新增保存功能
      let httpType = ""
      let success_msg = ""
      if (this.updateId != "") {
        httpType = PUT //修改功能
        success_msg = "修改数据成功!"
      } else {
        httpType = POST //新增功能
        success_msg = "新增数据成功!"
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          let saveObj = { ...this.jindieManage_addform, ...{ metaDefinefieldName: this.$refs.metaDefinefieldLabel.selectedLabel } } //新增对象
          console.log("新增-修改对象", saveObj)
          eval(httpType)(process.env.VUE_APP_DOMAIN_administration + "/ledgerKingdeeType", saveObj)
            .then(() => {
              this.updateId = "" //重置修改id
              this.$message({
                type: "success",
                message: success_msg,
                showClose: true
              })
              this.jindieManage_addModal = false //关闭新增弹框
              this.jindieManage_resetAndSearch(formName) //重置表单重新获取数据
            })
            .catch(error => {
              console.log(error)
            })
        } else {
          this.$message({
            showClose: true,
            type: "warning",
            message: "提交失败，验证不通过"
          })
        }
      })
    },
    jindieManage_JS_cancel(formName) {
      //取消  重置表单
      this.updateId = "" //重置修改id
      this.jindieManage_addModal = false //隐藏弹框
      this.$refs[formName].resetFields()
    },
    jindieManage_close() {
      //点击关闭icon x
      console.log("x")
      this.jindieManage_JS_cancel("jindieManage_addform")
      this.updateId = "" //重置修改id
    }
    //金蝶台账类型管理相关 end
  },
  computed: {
    userId() {
      //当前用户id
      if (this.$store.state.oaGetTokenInfo.id) {
        return this.$store.state.oaGetTokenInfo.id
      }
      return ""
    },
    userActionAll() {
      //权限数组
      return this.$store.state.userActionAll
    },
    permissions() {
      //通过老oa配置的id,判断当前 用户是否有对应的权限
      return powerid => {
        return Tools.includes(this.$store.state.userActionAll, powerid)
      }
    }
  },
  watch: {
    userId: {
      handler(newUserId) {
        if (!this.permissions("cf41a01cb4ce4ce4bb4dc8240eb4891c") && newUserId) {
          this.queryUserInfoToRegid(newUserId) //根据用户id获取个人信息，这样处理，因为userId是从vuex state获取的值，有时候初始化是undefined
        }
      },
      immediate: true //立即执行,还有一个deep属性是深度watch obj的属性
    },
    userActionAll: {
      //优雅处理vuex异步导致依赖于vuex state值得后续方法在页面初次加载如果vuex action请求慢导致的潜在bug
      handler(newActionAll) {
        if (newActionAll.length !== 0) {
          if (this.permissions("cf41a01cb4ce4ce4bb4dc8240eb4891c")) {
            //管理员或者谭曼可以查看全部区域的
            this.queryAreaList() //获取所属区域字典
            this.clearableFlag = true //可清空
            this.jindieSearch() //进入页面查询金蝶台账分页
          }
        }
      },
      immediate: true //立即执行,还有一个deep属性是深度watch obj的属性
    }
  },
  created() {
    this.headers["x-user-token"] = localStorage.getItem("token") //设置上传数据文件excel的token
    this.queryApplyTypeList() //获取申请类型下拉框
    this.queryTypeList() //获取申请类别下拉框
  }
}
</script>
<style scoped>
</style>
