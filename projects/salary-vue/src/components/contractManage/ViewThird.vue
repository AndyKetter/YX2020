<template>
  <div>
    <div class="pull-left">
      <el-form :inline="true" class="mar-no" label-position="right">
        <el-form-item label="收付款日期">
          <el-date-picker
            v-model="detailSearch.batch"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width:217px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="收付类型">
          <el-select
            filterable
            clearable
            v-model="detailSearch.chargetype"
            placeholder="请选择"
            class="width155"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="JS_search" icon="el-icon-search">搜索</el-button>
          <el-button icon="el-icon-search" @click="search_more = true">更多查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="pull-right">
      <el-dropdown
        trigger="click"
        @command="handleCommand"
        v-if="permissions(permissionsMapObj['操作-新增'])||permissions(permissionsMapObj['操作-删除'])||permissions(permissionsMapObj['操作-导入'])||permissions(permissionsMapObj['操作-导出'])"
      >
        <el-button type="primary">
          更多操作
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            command="a"
            icon="el-icon-plus"
            v-if="permissions(permissionsMapObj['操作-新增'])"
          >
            <i></i>&nbsp;新增
          </el-dropdown-item>
          <el-dropdown-item
            command="b"
            icon="el-icon-delete"
            divided
            v-if="permissions(permissionsMapObj['操作-删除'])"
          >
            <i></i>&nbsp;删除
          </el-dropdown-item>
          <el-dropdown-item
            command="c"
            class="cloud-uploadBtn"
            divided
            v-if="permissions(permissionsMapObj['操作-导入'])"
          >
            <i></i>&nbsp;导入
          </el-dropdown-item>
          <el-dropdown-item
            command="d"
            class="cloud-downloadBtn"
            divided
            v-if="permissions(permissionsMapObj['操作-导出'])"
          >
            <i></i>&nbsp;导出
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class>
      <el-table
        v-loading="mainLoading"
        :data="viewData"
        :height="tabHeight"
        @selection-change="handleSelectionChange"
        border
        style="width:100%"
        :header-cell-style="{backgroundColor:'#e5e9f3',padding:'0'}"
        :header-row-style="{height:'20px'}"
        :cell-style="{padding:'0'}"
        :row-style="{height:'20px'}"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序号" fixed="left" min-width="50"></el-table-column>
        <el-table-column prop="contractCode" label="合同编号" min-width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="chargeCode" label="收付单号" min-width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="chargeChargeCode" label="收付类型" min-width="100"></el-table-column>
        <el-table-column
          prop="chargeInvoiceAmount"
          label="发票金额"
          min-width="120"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="chargeAmount" label="实收/付金额" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="chargeDate" label="实收/付日" min-width="100"></el-table-column>
        <el-table-column prop="chargeCurrencyCode" label="币种" min-width="100"></el-table-column>
        <el-table-column prop="chargeChannelCode" label="支付方式" min-width="100"></el-table-column>
        <el-table-column prop="chargeInvoiceDate" label="开票日期" min-width="120"></el-table-column>
        <el-table-column prop="chargeInvoiceNumber" label="发票号" min-width="160"></el-table-column>
        <el-table-column prop="chargeRemark" label="备注" min-width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="chargeCreateUserName" label="录入人" min-width="100"></el-table-column>
        <el-table-column prop="chargeCreateTime" label="录入时间" min-width="160"></el-table-column>
        <el-table-column prop="chargeUpdateUserName" label="修改人" min-width="100"></el-table-column>
        <el-table-column prop="chargeUpdateTime" label="修改时间" min-width="160"></el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          min-width="100"
          v-if="permissions(permissionsMapObj['操作-编辑'])"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="JS_searchView(scope.row.chargeId,scope.row.chargeChargeCode)"
              size="small"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 总计 -->
      <div style="margin-top:10px">
        <el-alert :title="mainTotal" type="success" :closable="false"></el-alert>
      </div>
      <!-- 分页 -->
      <div id="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handlecurrentChange"
          background
          :current-page="current"
          :page-sizes="[5,10,15,20,30,40]"
          :page-size="size"
          layout="total,sizes,prev,pager,next,jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>

    <!-- 更多查询弹框 -->
    <el-dialog
      title="更多查询"
      :before-close="handleModifyClose"
      :close-on-click-modal="false"
      :visible.sync="search_more"
      width="550px"
    >
      <el-form :inline="true" class="mar-no" :model="moreSearch" ref="moreSearch">
        <el-form-item label="合同编号" prop="contractId">
          <el-input v-model="moreSearch.contractId" style="width:180px"></el-input>
        </el-form-item>
        <el-form-item label="发票号" prop="billId" style="float:right;margin-right: 0 ;">
          <el-input v-model="moreSearch.billId" style="width:180px"></el-input>
        </el-form-item>
        <el-form-item label="收付单号" prop="paymentId">
          <el-input v-model="moreSearch.paymentId" style="width:180px"></el-input>
        </el-form-item>
        <el-form-item label="支付方式" prop="paymentWay" style="float:right;margin-right: 0 ;">
          <el-select
            v-model="moreSearch.paymentWay"
            placeholder="请选择"
            class="width155"
            filterable
            clearable
          >
            <el-option
              v-for="item in paymentOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleModifyClose">取消</el-button>
        <el-button @click="JS_more_Search" type="primary">立即搜索</el-button>
      </span>
    </el-dialog>

    <!-- 新增-合同收付款弹框 -->
    <el-dialog
      title="新增-合同收付款"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      :visible.sync="addViewModal"
      width="1000px"
    >
      <div>
        <el-alert :title="planTitle" type="warning" :closable="false" v-show="chooseplan"></el-alert>
        <el-form
          :model="addView"
          :rules="addViewRule"
          ref="addView"
          label-width="110px"
          class="mar-top"
        >
          <el-row>
            <el-col :md="9">
              <el-form-item label="合同编号：" prop="contractCode">
                <el-input v-model="addView.contractCode" :disabled="true" class="width170"></el-input>
                <el-button type="text" @click="chooseAgreement">选择</el-button>
              </el-form-item>
            </el-col>
            <el-col :md="8">
              <el-form-item label="收付类型：" prop="chargeChargeCode">
                <!-- <el-input v-model="addView.chargeChargeCode" :disabled="true" class="width155"></el-input> -->
                <el-select
                  v-model="addView.chargeChargeCode"
                  :disabled="chooseFlg"
                  placeholder="请选择收付类型"
                  class="width155"
                >
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="7">
              <el-form-item label="币种：" prop="chargeCurrencyCode">
                <!-- <el-input v-model="addView.chargeCurrencyCode" :disabled="true" class="width155"></el-input> -->
                <el-select
                  v-model="addView.chargeCurrencyCode"
                  :disabled="chooseFlg"
                  placeholder="请选择币种"
                  class="width155"
                >
                  <el-option
                    v-for="item in chargeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="9">
              <el-form-item label="关联计划：" prop="chargePlanCode">
                <el-input v-model="addView.chargePlanCode" class="width170"></el-input>
                <el-button type="text" @click="choosePlays" v-if="addView.contractCode !== ''">选择</el-button>
              </el-form-item>
            </el-col>
            <el-col :md="8">
              <el-form-item label="发票金额：" prop="chargeInvoiceAmount">
                <el-input-number
                  v-model.trim="addView.chargeInvoiceAmount"
                  class="width155"
                  controls-position="right"
                  :min="1"
                  :max="1000000000"
                ></el-input-number>

                <!-- <el-input v-model="addView.chargeInvoiceAmount" class="width155"></el-input> -->
              </el-form-item>
            </el-col>
            <el-col :md="7">
              <el-form-item label="实际金额：" prop="chargeAmount">
                <el-input-number
                  v-model.trim="addView.chargeAmount"
                  class="width155"
                  controls-position="right"
                  :min="1"
                  :max="1000000000"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :md="9">
              <el-form-item label="收付单号：" prop="chargeCode">
                <el-input v-model="addView.chargeCode" class="width170"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="8">
              <el-form-item label="开票日期：" prop="chargeInvoiceDate">
                <el-date-picker
                  v-model="addView.chargeInvoiceDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                  class="width155"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :md="7">
              <el-form-item label="收付日期：" prop="chargeDate">
                <el-date-picker
                  v-model="addView.chargeDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                  class="width155"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :md="9">
              <el-form-item label="发票号：" prop="chargeInvoiceNumber">
                <el-input v-model="addView.chargeInvoiceNumber" class="width170"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="15">
              <el-form-item label="收付方式：" prop="chargeChannelCode">
                <el-select v-model="addView.chargeChannelCode" placeholder="请选择方式" class="width155">
                  <el-option
                    v-for="item in paymentOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="24">
              <el-form-item label="备注：" prop="chargeRemark">
                <el-input v-model="addView.chargeRemark" maxlength="100"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button v-if="modifyFlag==0" type="primary" @click="JS_addView('addView')">提交</el-button>
        <el-button v-if="modifyFlag==1" type="primary" @click="JS_modifyView('addView')">修改</el-button>
      </span>
    </el-dialog>

    <!-- 合同选择弹框 -->
    <el-dialog
      title="合同选择"
      :close-on-click-modal="false"
      :visible.sync="agreementModal"
      width="900px"
    >
      <div>
        <el-form :model="chooseAg" :inline="true" ref="chooseAg" label-width="100px">
          <el-form-item label="合同编号：" prop="agreementId">
            <el-select v-model="chooseAg.agreementId" placeholder="业务类型" class="width155">
              <el-option
                v-for="item in agreementOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="关键字：" prop="keywords">
            <el-input v-model="chooseAg.keywords" class="width155" clearable></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="searchAgr">搜索</el-button>&nbsp;&nbsp;
            <el-checkbox v-model="chooseAg.autochecked">显示近一个月合同</el-checkbox>
          </el-form-item>
        </el-form>
        <div>
          <el-table
            :data="chooseAgData"
            :height="addtabHeight"
            border
            style="width:100%"
            :header-cell-style="{backgroundColor:'#e5e9f3'}"
          >
            <el-table-column type="index" fixed="left" label="序号" min-width="50"></el-table-column>
            <el-table-column prop="contractCode" label="合同编号" min-width="200" show-overflow-tooltip></el-table-column>
            <el-table-column prop="name" label="合同名称" min-width="160"></el-table-column>
            <el-table-column prop="chargeName" label="收付类型" min-width="160"></el-table-column>
            <el-table-column prop="channelName" label="收付方式" min-width="160"></el-table-column>
            <el-table-column prop="currencyName" label="币种" min-width="160"></el-table-column>
            <el-table-column prop="amount" label="总金额" min-width="160"></el-table-column>
            <el-table-column prop="amountCharged" label="已收/付金额" min-width="160"></el-table-column>
            <el-table-column label="操作" fixed="right" min-width="100">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="JS_chooseAg(scope.row)">选择</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="agreementModal = false">关闭</el-button>
      </span>
    </el-dialog>

    <!-- 收付款计划弹框 -->
    <el-dialog title="收付款计划" :close-on-click-modal="false" :visible.sync="playsModal" width="900px">
      <div>
        <el-form :model="playsSearch" :inline="true" ref="playsSearch" label-width="100px">
          <el-form-item label="计划日期：" prop="agreementId">
            <el-date-picker
              v-model="playsSearch.batch"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width:217px"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="备注：" prop="keywords">
            <el-input v-model="playsSearch.keywords" class="width155"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="searchPlays" icon="el-icon-search">搜索</el-button>
          </el-form-item>
        </el-form>
        <div>
          <el-table
            :data="playsData"
            :height="addtabHeight"
            border
            style="width:100%"
            :header-cell-style="{backgroundColor:'#e5e9f3'}"
          >
            <el-table-column type="index" fixed="left" label="序号" min-width="50"></el-table-column>
            <el-table-column prop="planCode" label="计划编号" min-width="200" show-overflow-tooltip></el-table-column>
            <el-table-column prop="planAmount" label="计划金额" min-width="160"></el-table-column>
            <el-table-column prop="planDate" label="计划日期" min-width="160"></el-table-column>
            <!-- <el-table-column prop="dicId" label="收付方式" min-width="160"></el-table-column> -->
            <el-table-column prop="planRemark" label="备注" min-width="160"></el-table-column>
            <el-table-column label="操作" fixed="right" min-width="100">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="JS_choosePlay(scope.row.planCode,scope.row.planAmount,scope.row.planChannelCode)"
                >选择</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="playsModal = false">关闭</el-button>
      </span>
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
        <el-button type="primary" @click="JS_DeleUnit">确定</el-button>
      </span>
    </el-dialog>
    <!-- 导出-->
    <el-dialog
      title="导出"
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="exportDialog"
      width="600px"
    >
      <div>
        <el-form label-width="150px">
          <el-row>
            <el-col :md="24">
              <el-form-item label="导出方式" label-width="85px">
                <el-select placeholder="请选择" v-model="exportVal" style="width:300px" filterable>
                  <el-option
                    v-for="item in exportType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
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
    <el-dialog
      title="来往单位导入"
      :before-close="fileClose"
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="uploadModal"
      width="520px"
    >
      <p class="clearfix">
        <el-upload
          ref="upload"
          class="pull-left"
          :action="uploadActionUrl"
          :headers="headers"
          :before-remove="beforeRemove"
          :before-upload="beforeUpload"
          :on-success="handleSuccess"
        >
          <el-button size="mediumn" icon="el-icon-upload">导入数据</el-button>
          <el-button
            size="mediumn"
            style="margin-left:15px;"
            icon="el-icon-download"
            @click.stop="uploadLink"
          >下载模板</el-button>
          <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
        </el-upload>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadModal = false">取消</el-button>
      </span>
    </el-dialog>

    <!-- 导入进度条 -->
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
import Tools from "untils/index.js"
import { GET, POST, PUT, DELETE } from "http/custom.js"
export default {
  name: "viewThird",
  props: {
    //传过来的数据
    dataListObj: {
      type: Object,
      required: true
    }
  },
  data() {
    const uploadActionUrl = process.env.VUE_APP_DOMAIN_financial + "/contractChargeImport" //导入action 线上，数据导入接口
    return {
      uploadActionUrl,
      tabHeight: Tools.getTbHeight(364),
      addtabHeight: "300",
      //分页查询
      mainLoading: false, //table加载动画开关
      multipleSelection: [], // 表格多选记录
      exportVal: 1, //导出方式
      current: 1, //当前页码
      size: 15, //每页显示记录条数
      total: 0, //总记录条数
      mainTotal: "",
      planTitle: "",
      viewData: [],
      addViewModal: false, //新增合同收付款弹框
      agreementModal: false, //合同选择弹框
      search_more: false, //更多查询弹框
      playsModal: false, //收付款计划弹框
      deleWarn: false, //删除弹框
      exportDialog: false, //导出弹框
      modifyFlag: 0, //默认新增弹框
      autoFlage: 0,
      searchObj: {},
      chooseFlg: false,
      chooseplan: false, //选择合同后出现合计
      uploadModal: false, //导入弹框
      importProcessInfoDialog: false, //导入进度条弹框
      downloadErrorKey: "", //导入错误下载excel key
      downloadErrorEveProcess: "", //进度事件句柄
      progressPercentAge: 0, //进度条如 80%就是 80
      loadErrorExcel: false, //呈现下载链接
      progressBackBtn: false, // 返回按钮
      uploadProcessInfo: {
        total: "", //总条数
        handler: "", //已处理条数
        successful: "", //处理成功条数
        failures: "", //处理失败条数
        finish: false, //是否处理完成
        dealAllTime: "" //总耗时
      },
      headers: {}, //上传图片请求头
      exportType: [
        //导出方式
        { value: 1, label: "保存至本地（需要等待数秒至数分钟）" },
        { value: 2, label: "发送至本人内网邮箱" }
      ],
      detailSearch: {
        batch: "",
        chargetype: ""
      },
      moreSearch: {
        contractId: "",
        billId: "",
        paymentId: "",
        paymentWay: ""
      },
      typeOptions: [{ value: "RECEIPT", label: "收款" }, { value: "PAYMENT", label: "付款" }, { value: "OTHER", label: "其他" }],
      paymentOptions: [], //收付方式
      chargeOptions: [], //币种
      agreementOptions: [{ value: "contractCode", label: "合同编号" }, { value: "name", label: "合同名称" }], //合同编号
      addView: {
        contractCode: "",
        chargeCode: "",
        chargeChargeCode: "",
        chargeInvoiceAmount: undefined,
        chargeChannelCode: "",
        chargeAmount: undefined,
        chargeDate: Tools.getYMd(),
        chargeCurrencyCode: "",
        chargeInvoiceDate: Tools.getYMd(),
        chargeInvoiceNumber: "",
        chargeRemark: "",
        chargePlanCode: ""
      },
      addViewRule: {
        contractCode: [{ required: true, message: "请选择合同编号", trigger: "blur" }],
        chargeCode: [{ required: true, message: "请填写收付单号", trigger: "blur" }],
        chargeChargeCode: [{ required: true, message: "请选择收付类型", trigger: "change" }],
        chargeInvoiceAmount: [{ required: true, message: "最大值可输入1000000000" }, { pattern: /\d+\.?\d{0,2}/, type: "number", message: "请输入数值", trigger: "blur" }],
        chargeAmount: [{ required: true, message: "最大值可输入1000000000" }, { pattern: /\d+\.?\d{0,2}/, type: "number", message: "请输入数值", trigger: "blur" }],
        chargeCurrencyCode: [{ required: true, message: "请选择币种", trigger: "blur" }]
      },
      chooseAg: {
        agreementId: "",
        keywords: "",
        autochecked: ""
      },
      chooseAgData: [],
      playsSearch: {
        batch: "",
        keywords: ""
      },
      playsData: [],

      permissionsMapObj: {
        //老系统action权限映射对象
        "操作-新增": "9936082628374447857750571be47703",
        "操作-删除": "563734e524064b938ec0dc6212ba73b8",
        "操作-导入": "2a7dbefa59824eee901592cfa15eba0b",
        "操作-导出": "10cb0c21c7e34e519f8347890c71bac3",
        "操作-编辑": "2c141f399d994ac7ac8e1e184fe55835"
      }
    }
  },
  created() {
    console.log(this.dataListObj.deptInfo)
    this.headers["x-user-token"] = localStorage.getItem("token") //设置上传数据文件excel的token
    this.mainSearch()
    this.queryPaymentList()
    this.querychargeList()
  },
  methods: {
    messagePopp(type, msg) {
      //提示框
      this.$message({
        showClose: true,
        type: type,
        message: msg
      })
    },
    JS_search() {
      this.current = 1
      this.mainSearch()
    },
    searchCommon() {
      //公用搜索条件
      let searchObj = {
        beginDate: this.detailSearch.batch ? this.detailSearch.batch[0] : undefined,
        endDate: this.detailSearch.batch ? this.detailSearch.batch[1] : undefined,
        chargeChargeCode: this.detailSearch.chargetype,
        contractCode: this.moreSearch.contractId,
        chargeInvoiceNumber: this.moreSearch.billId,
        chargeCode: this.moreSearch.paymentId,
        chargeChannelCode: this.moreSearch.paymentWay
      }
      return searchObj
    },
    mainSearch() {
      //查询表格
      let searchObj = this.searchCommon()
      let searchObj2 = Object.assign(searchObj, {
        current: this.current,
        size: this.size
      })
      this.mainLoading = true
      //调取数据
      POST(process.env.VUE_APP_DOMAIN_financial + "/contractCharges", searchObj2)
        .then(res => {
          this.mainLoading = false
          if (res.data) {
            this.viewData = res.data.records
            this.current = res.data.current //当前页
            this.size = res.data.size //每页显示记录条数先
            this.total = res.data.total //总记录数据
          }
        })
        .catch(error => {
          this.mainLoading = false
          console.log(error)
        })

      //总计
      POST(process.env.VUE_APP_DOMAIN_financial + "/sumContractCharge", searchObj)
        .then(res => {
          if (res.data) {
            this.mainTotal = "收款总金额:" + res.data.receiptAmount + "；付款总金额:" + res.data.paymentAmount
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    JS_addView(formName) {
      //新增收付款
      this.$refs[formName].validate(valid => {
        if (valid) {
          let saveObj = this.addView //保存对象
          console.log("保存对象", saveObj)
          POST(process.env.VUE_APP_DOMAIN_financial + "/contractCharge", saveObj)
            .then(res => {
              this.messagePopp("success", "新增数据成功")
              this.addViewModal = false //关闭修改弹框
              this.reset(formName) //清空表单
              this.chooseFlg = false //收付类型、币种不可选
              this.chooseplan = false //合计
              this.JS_search() //刷新表格，重新获取数据
            })
            .catch(error => {
              console.log(error)
            })
        } else {
          this.messagePopp("warning", "提交失败，验证不通过")
          return false
        }
      })
    },
    JS_searchView(id, type) {
      //查询收付款
      this.addViewModal = true
      this.chooseFlg = type == "OTHER" ? false : true
      this.modifyFlag = 1
      let queryObj = {
        chargeId: id
      } //查询象
      GET(process.env.VUE_APP_DOMAIN_financial + "/contractCharge", queryObj)
        .then(res => {
          //查询对象
          console.log(res.data)
          if (res.data) {
            this.addView = res.data
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    JS_modifyView(formName) {
      //修改收付款
      this.$refs[formName].validate(valid => {
        if (valid) {
          let saveObj = this.addView //保存对象
          console.log("保存对象", saveObj)
          PUT(process.env.VUE_APP_DOMAIN_financial + "/contractCharge", saveObj)
            .then(res => {
              this.messagePopp("success", "修改数据成功")
              this.modifyFlag = 0
              this.addViewModal = false //关闭修改弹框
              this.reset(formName) //清空表单
              this.JS_search() //刷新表格，重新获取数据
            })
            .catch(error => {
              console.log(error)
            })
        } else {
          this.messagePopp("warning", "提交失败，验证不通过")
          return false
        }
      })
    },
    JS_DeleUnit() {
      //删除
      let arr = []
      this.multipleSelection.forEach(e => {
        arr.push(e.chargeId)
      })
      arr = arr.join(",")
      let queryObj = {
        ids: arr
      } //查询象
      DELETE(process.env.VUE_APP_DOMAIN_financial + "/contractCharge", queryObj)
        .then(res => {
          //查询对象
          console.log(res.data)
          this.messagePopp("success", "删除成功")
          this.deleWarn = false
          this.JS_search() //刷新表格，重新获取数据
        })
        .catch(error => {
          console.log(error)
        })
    },
    chooseAgreement() {
      //选择合同
      this.agreementModal = true
      this.searchAgr()
    },
    searchAgr() {
      //查询合同
      if (this.chooseAg.autochecked) {
        this.autoFlage = 1
      }
      let queryObj = {
        showLastMonth: this.autoFlage //是否显示最近一个月合同信息
      }
      if (this.chooseAg.agreementId !== undefined && this.chooseAg.agreementId !== null) {
        queryObj = Object.assign(queryObj, { [this.chooseAg.agreementId]: this.chooseAg.keywords }) //合同编号or合同名称
      }
      //查询象
      POST(process.env.VUE_APP_DOMAIN_financial + "/contractWithoutPages", queryObj)
        .then(res => {
          //查询对象
          console.log(res.data)
          if (res.data) {
            this.chooseAgData = res.data
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    JS_chooseAg(data) {
      this.agreementModal = false
      this.addView.contractCode = data.contractCode
      this.addView.chargeChargeCode = data.chargeType
      this.addView.chargeCurrencyCode = data.currencyCode
      this.chooseplan = true //顶端的合计
      this.planTitle = "合同金额：" + data.amount + "；已收/付金额：" + data.amountCharged + " ；未收/付金额：" + data.amountRemain

      this.chooseFlg = data.chargeType == "OTHER" ? false : true //收付类型不可选
    },
    choosePlays() {
      //关联计划
      this.playsModal = true
      this.searchPlays()
    },
    searchPlays() {
      //查询合同
      let queryObj = {
        remark: this.playsSearch.keywords,
        beginPlanDate: this.playsSearch.batch ? this.playsSearch.batch[0] : "",
        endPlanDate: this.playsSearch.batch ? this.playsSearch.batch[1] : "",
        contractCode: this.addView.contractCode || ""
      }
      //查询象
      POST(process.env.VUE_APP_DOMAIN_financial + "/contractPlans", queryObj)
        .then(res => {
          //查询对象
          console.log(res.data)
          if (res.data) {
            this.playsData = res.data
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    JS_choosePlay(id, money, way) {
      this.playsModal = false
      this.addView.chargePlanCode = id
      this.addView.chargeInvoiceAmount = money
      this.addView.chargeAmount = money
      this.addView.chargeChannelCode = way
    },
    closeDialog() {
      //仅仅清除表单
      this.addViewModal = false
      this.reset("addView")
      this.chooseFlg = false //收付类型、币种不可选
      this.chooseplan = false //合计
    },
    queryPaymentList() {
      //获取支付方式
      let queryObj = {
        typeCode: "FINA_CONTR_PAYMENT"
      }
      POST(process.env.VUE_APP_DOMAIN_financial + "/contractDictDataList", queryObj)
        .then(res => {
          //查询对象
          if (res.data.length > 0) {
            //获取子节点
            this.paymentOptions = res.data.map(list => {
              return {
                value: list.dataCode,
                label: list.dataValue
              }
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    querychargeList() {
      //获取币种类型
      let queryObj = {
        typeCode: "FINA_CONTR_CURRENCY"
      }
      POST(process.env.VUE_APP_DOMAIN_financial + "/contractDictDataList", queryObj)
        .then(res => {
          //查询对象
          if (res.data.length > 0) {
            //获取子节点
            this.chargeOptions = res.data.map(list => {
              return {
                value: list.dataCode,
                label: list.dataValue
              }
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    search() {},
    reset(formName) {
      //清除表单
      this.$refs[formName].resetFields()
    },
    handleModifyClose() {
      ///多条件取消
      this.search_more = false
      this.reset("moreSearch")
    },
    JS_more_Search() {
      this.search_more = false
      this.JS_search()
    },
    handleCommand(command) {
      //更多操作下拉框
      if (command == "a") {
        this.addViewModal = true
      } else if (command == "b") {
        if (this.multipleSelection.length) {
          this.deleWarn = true
        } else {
          this.messagePopp("warning", "请勾选需要删除的选项！")
        }
      } else if (command == "c") {
        this.uploadModal = true //导入
      } else if (command == "d") {
        this.exportDialog = true //导出
      }
    },
    exportToWary() {
      //导出
      // 导出方式   1直接下载  2发到邮箱
      let ul = process.env.VUE_APP_DOMAIN_financial + "/contractChargeExport"
      let searchObj = this.searchCommon()

      let urlStr = "?token=" + localStorage.getItem("token") + "&beginDate=" + (this.detailSearch.batch ? this.detailSearch.batch[0] : undefined) + "&endDate=" + (this.detailSearch.batch ? this.detailSearch.batch[1] : undefined) + "&chargeChargeCode=" + this.detailSearch.chargetype + "&contractCode=" + this.moreSearch.contractId + "&chargeInvoiceNumber=" + this.moreSearch.billId + "&chargeCode=" + this.moreSearch.paymentId + "&chargeChannelCode=" + this.moreSearch.paymentWay + "&exportType=" // wary 导出方式   1直接下载  2 发到邮箱

      if (this.exportVal === 1) {
        //导出方式
        this.messagePopp("success", "已经导出至本地！")
        //下载拼接 已经导出至本地！
        let urls = ul + urlStr + this.exportVal
        debugger
        window.location.href = urls
      } else {
        let params = {
          source: searchObj,
          exportType: this.exportVal
        }
        //导出至邮箱   这个接口没有返回值，后台要求直接提示
        GET(ul, params)
          .then(() => {
            this.messagePopp("success", "已经导入至您的邮箱！")
          })
          .catch(error => {
            console.log(error)
          })
      }
      // 关闭导出弹窗
      this.exportDialog = false
    },
    unloadErrorLink() {
      //导入错误模板下载
      console.log("downloadErrorKey", this.downloadErrorKey)
      let url = process.env.VUE_APP_DOMAIN_download + "/oss/download?key=" + this.downloadErrorKey + "&token=" + localStorage.getItem("token") + "&name=" + encodeURI("收付款导入失败明细") + ".xlsx"
      window.location.href = url
    },
    // 导入中的下载模板
    uploadLink() {
      GET(
        process.env.VUE_APP_DOMAIN_download + "/template/baseFilesTemplateByFileCode", //公共接口
        {
          fileCode: "FINANCIAL_CONTRACT_CHARGE_IMPORT_EXCEL_TEMPLATE"
        }
      )
        .then(res => {
          //获取模板存储返回的ID
          window.location.href = `${process.env.VUE_APP_DOMAIN_download}/oss/download?key=${res.data.fileTemplateId}&name=${res.data.fileTemplateName}.${res.data.fileTemplateSuffix}`
        })
        .catch(error => {
          console.log(error)
        })
    },
    beforeUpload(file) {
      //上传文件之前的钩子
      console.log("上传文件之前的回调", file)
      let testFileType = file.name.substring(file.name.lastIndexOf(".") + 1) //截取文件后缀
      const extension1 = testFileType === "xls"
      const extension2 = testFileType === "xlsx"
      if (!extension1 && !extension2) {
        //不是excel文件格式
        this.$message.error("上传数据文件只能是 xlsx/xls 格式!")
      }
      return extension1 || extension2
    },
    beforeRemove(file) {
      //删除文件之前的钩子
      return this.$msgBox.confirm(`确定移除${file.name}？`)
    },
    //上传文件接口调取成功回调
    handleSuccess(res) {
      debugger
      this.uploadModal = false //关闭导入弹框
      if (res.code === 0) {
        //部分成功部分失败的情况  或者  直接失败

        //文件上传成功或者部分成功
        this.downloadErrorEveProcess = res.data //获取进度条事件句柄
        //错误导入进度条与下载模板
        this.importProcessInfoDialog = true
        this.queryProgress() //获取上传文件进度条信息
      } else {
        let msgError = res.msg || "【系统无法识别EXCLE中的空白、公式和非法字符。请先清理】。" //50*非0情况
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
              this.JS_search() //刷新页面

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
    importProgress() {
      //进度弹框关闭
      this.importProcessInfoDialog = false //关闭进度弹框
      this.progressPercentAge = 0 //进度条清空为0
      this.progressBackBtn = false //隐藏返回按钮
      this.loadErrorExcel = false // 隐藏下载失败链接
    },
    fileClose() {
      //关闭导入弹框
      //清除表单
      this.uploadModal = false
      this.$refs.upload.clearFiles() //清空已上传的文件列表（该方法不支持在 before-upload 中调用）
    },
    handleSelectionChange(val) {
      //当选择项发生变化时会触发该事件
      this.multipleSelection = val
      console.log("选中的行", val)
    },
    handlecurrentChange(val) {
      //点击页码，当前页
      this.current = val //保存状态-当前页
      this.mainSearch()
    },
    handleSizeChange(val) {
      //每页显示多少条数据切换
      this.size = val //保存状态-每页显示多少条数据切换
      this.mainSearch()
    }
  },
  filter: {},
  computed: {
    permissions() {
      //通过老oa配置的id,判断当前 用户是否有对应的权限
      return powerid => {
        return Tools.includes(this.$store.state.userActionAll, powerid)
      }
    }
  },
  watch: {}
}
</script>

<style lang="less" scoped>
.el-button--text {
  font-size: 14px;
  text-decoration: underline;
  padding: 8px 11px;
}
</style>

