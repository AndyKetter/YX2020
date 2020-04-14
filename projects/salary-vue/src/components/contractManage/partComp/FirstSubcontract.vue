<template>
  <div class="first-subcontract">
    <el-form
      :inline="true"
      class="mar-no"
      label-position="right"
      style="position: absolute;right: 0;top: 2px;right: -10px;z-index: 10;"
    >
      <el-form-item v-if="activeName !== 'fourth'">
        <el-button
          type="primary"
          @click="addFormBtn('新增','')"
          icon="el-icon-plus"
          v-if="isShow()"
        >{{(activeName === 'third' || activeName === 'fifth') ? '编辑' :'新增'}}</el-button>
      </el-form-item>
      <el-form-item v-if="activeName === 'fourth'">
        <el-button
          type="primary"
          @click="addFormAnnex('上传附件')"
          icon="el-icon-upload"
          v-if="isRootUserActionAll(subObj.rootCode['合同附件_上传附件'])"
        >上传附件</el-button>
      </el-form-item>
      <el-form-item v-if="activeName === 'fourth'">
        <el-button
          type="primary"
          @click="addFormAnnex('打包下载')"
          icon="el-icon-download"
          v-if="isRootUserActionAll(subObj.rootCode['合同附件_打包下载'])"
        >打包下载</el-button>
      </el-form-item>
    </el-form>
    <div class="bgWhite">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="收付款计划" name="first">
          <div class="table_wrap">
            <el-table
              v-loading="planeLoading"
              :height="subObj.mainTb - 35"
              :data="dataTablePlane"
              border
              :header-cell-style="{backgroundColor:'#e5e9f3',padding:'0'}"
              :header-row-style="{height:'20px'}"
              :cell-style="{padding:'0'}"
              :row-style="{height:'20px'}"
            >
              <el-table-column type="index" label="序号" fixed="left" min-width="50"></el-table-column>
              <el-table-column
                prop="contractCode"
                label="合同编号"
                fixed="left"
                min-width="200"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="planCode"
                label="计划编号"
                fixed="left"
                min-width="200"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column label="状态" min-width="100">
                <template slot-scope="scope">
                  <span v-if="scope.row.planStatus === 1">已处理</span>
                  <span
                    style="color:red;"
                    v-else-if="[2,3,4].indexOf(scope.row.planStatus) >= 0"
                  >待处理</span>
                  <span v-else></span>
                </template>
              </el-table-column>
              <el-table-column prop="planChargeCode" label="收付类型" min-width="120"></el-table-column>
              <el-table-column prop="planAmount" label="计划金额" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">{{scope.row.planAmount | toThousands}}</template>
              </el-table-column>
              <el-table-column
                prop="planAmountReal"
                label="实际金额"
                min-width="120"
                show-overflow-tooltip
              >
                <template slot-scope="scope">{{scope.row.planAmountReal | toThousands}}</template>
              </el-table-column>
              <el-table-column prop="planDate" label="计划日期" min-width="130"></el-table-column>
              <el-table-column prop="planChannelCode" label="收付方式" min-width="100"></el-table-column>
              <el-table-column prop="planRemark" label="备注" min-width="200"></el-table-column>
              <el-table-column prop="planCreateUserName" label="录入人" min-width="100"></el-table-column>
              <el-table-column prop="planCreateTime" label="录入时间" min-width="150"></el-table-column>
              <el-table-column prop="planUpdateUserName" label="修改人" min-width="100"></el-table-column>
              <el-table-column prop="planUpdateTime" label="修改时间" min-width="150"></el-table-column>
              <el-table-column
                label="操作"
                fixed="right"
                min-width="120"
                v-if="isRootUserActionAll(subObj.rootCode['收付款计划_编辑']) || isRootUserActionAll(subObj.rootCode['收付款计划_删除'])"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    @click="addFormBtn('编辑',scope.row.planId)"
                    v-if="isRootUserActionAll(subObj.rootCode['收付款计划_编辑'])"
                  >编辑</el-button>
                  <el-button
                    type="text"
                    size="small"
                    @click="deletePlane(scope.row.planId)"
                    v-if="isRootUserActionAll(subObj.rootCode['收付款计划_删除'])"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 总计 -->
            <el-alert :title="planeTotal" style="margin-top:5px;" type="success" :closable="false"></el-alert>
          </div>
        </el-tab-pane>
        <el-tab-pane label="子合同管理" name="second">
          <div class="table_wrap">
            <el-table
              v-loading="subLoading"
              :height="subObj.mainTb - 35"
              :data="dataTableSub"
              border
              :header-cell-style="{backgroundColor:'#e5e9f3',padding:'0'}"
              :header-row-style="{height:'20px'}"
              :cell-style="{padding:'0'}"
              :row-style="{height:'20px'}"
            >
              <el-table-column type="index" label="序号" fixed="left" min-width="50"></el-table-column>
              <el-table-column
                prop="subName"
                label="子合同名称"
                fixed="left"
                min-width="200"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="subCode"
                label="子合同编号"
                fixed="left"
                min-width="200"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="subUnitName"
                label="单位名称"
                min-width="150"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column prop="subAmount" label="金额" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">{{scope.row.subAmount | toThousands}}</template>
              </el-table-column>
              <el-table-column prop="subRemark" show-overflow-tooltip label="备注" min-width="200"></el-table-column>
              <el-table-column prop="subCreateUserName" label="操作人" min-width="100"></el-table-column>
              <el-table-column prop="subCreateTime" label="操作时间" min-width="150"></el-table-column>
              <el-table-column
                label="操作"
                fixed="right"
                min-width="120"
                v-if="isRootUserActionAll(subObj.rootCode['子合同管理_编辑']) || isRootUserActionAll(subObj.rootCode['子合同管理_删除'])"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    @click="addFormBtn('编辑',scope.row.subId)"
                    v-if="isRootUserActionAll(subObj.rootCode['子合同管理_编辑']) "
                  >编辑</el-button>
                  <el-button
                    type="text"
                    size="small"
                    @click="deleteSub(scope.row.subId)"
                    v-if="isRootUserActionAll(subObj.rootCode['子合同管理_删除']) "
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 总计 -->
            <el-alert :title="subTotal" style="margin-top:5px;" type="success" :closable="false"></el-alert>
          </div>
        </el-tab-pane>
        <el-tab-pane label="合同内容" name="third">
          <div class="table_wrap" :style="{'z-index':'10',position:'relative'}">
            <Editor
              :catchData="catchContent"
              :style="{height:subObj.mainTb + 'px'}"
              :content="content"
            ></Editor>
          </div>
        </el-tab-pane>
        <el-tab-pane label="合同附件" name="fourth">
          <div class="table_wrap">
            <el-table
              v-loading="attachLoading"
              :height="subObj.mainTb"
              :data="dataTableAttach"
              border
              :header-cell-style="{backgroundColor:'#e5e9f3',padding:'0'}"
              :header-row-style="{height:'20px'}"
              :cell-style="{padding:'0'}"
              :row-style="{height:'20px'}"
            >
              <el-table-column type="index" label="序号" min-width="50"></el-table-column>
              <el-table-column
                prop="contractCode"
                label="合同编码"
                min-width="200"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column prop="attachName" label="附件名称" show-overflow-tooltip min-width="200"></el-table-column>
              <el-table-column prop="attachFormat" label="格式" min-width="100"></el-table-column>
              <el-table-column prop="attachSize" label="大小" show-overflow-tooltip min-width="100"></el-table-column>
              <el-table-column prop="attachCreateUserName" label="录入人" min-width="100"></el-table-column>
              <el-table-column prop="attachCreateTime" label="录入时间" min-width="150"></el-table-column>
              <el-table-column
                label="操作"
                fixed="right"
                min-width="100"
                v-if="isRootUserActionAll(subObj.rootCode['合同附件_删除']) || isRootUserActionAll(subObj.rootCode['合同附件_下载'])"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    @click="downLoad(scope.row.attachData)"
                    v-if="isRootUserActionAll(subObj.rootCode['合同附件_下载'])"
                  >下载</el-button>
                  <el-button
                    type="text"
                    size="small"
                    @click="deleteAttach(scope.row.attachId)"
                    v-if="isRootUserActionAll(subObj.rootCode['合同附件_删除'])"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="异常备注" name="fifth">
          <div class="table_wrap" :style="{'z-index':'10',position:'relative'}">
            <Editor
              :catchData="catchErrMark"
              :style="{height:subObj.mainTb + 'px'}"
              :content="errMark"
            ></Editor>
          </div>
        </el-tab-pane>
      </el-tabs>
      <!-- 新增-收付款计划 -->
      <el-dialog
        :title="planeAdd.planeTitle+'收付款计划'"
        :before-close="concelPlane"
        :close-on-click-modal="false"
        :show-close="true"
        :visible.sync="planeAdd.caseModal"
        width="1040px"
        class="plane-btn"
      >
        <el-form
          :model="planeAdd.addCaseForm"
          :rules="planeAdd.addCaseFormmRule"
          ref="planeAdd"
          label-width="100px"
        >
          <el-row>
            <el-col :md="8">
              <el-form-item label="合同编号：" prop="constractNum">
                <el-input disabled v-model.trim="planeAdd.addCaseForm.constractNum"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="8">
              <el-form-item label="计划编号：" prop="planeNum">
                <el-input disabled v-model.trim="planeAdd.addCaseForm.planeNum"></el-input>
                <!-- <el-checkbox v-model.trim="planeAdd.checked">自动</el-checkbox> -->
              </el-form-item>
            </el-col>
            <el-col :md="8">
              <el-form-item label="收付类型：" prop="payState">
                <el-select
                  filterable
                  style="width:233px"
                  :disabled="disabled"
                  v-model="planeAdd.addCaseForm.payState"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in planChargeArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="8">
              <el-form-item label="计划金额：" prop="planeMoney">
                <el-input-number
                  v-model.trim="planeAdd.addCaseForm.planeMoney"
                  style="width:233px"
                  controls-position="right"
                  :min="1"
                  :max="1000000000"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :md="8">
              <el-form-item label="计划日期：" prop="planDate">
                <el-date-picker
                  v-model.trim="planeAdd.addCaseForm.planDate"
                  style="width:233px"
                  :editable="false"
                  :clearable="false"
                  value-format="yyyy-MM-dd"
                  placeholder="选择年月"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :md="8">
              <el-form-item label="收付方式：" prop="payType">
                <el-select
                  filterable
                  clearable
                  v-model.trim="planeAdd.addCaseForm.payType"
                  style="width:233px"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in planeAdd.addCaseForm.payTypeArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="24">
              <el-form-item label="备注：" prop="mark">
                <el-input
                  type="textarea"
                  :rows="5"
                  placeholder="可输入1000个字符"
                  resize="none"
                  maxlength="1000"
                  style="width: 900px;"
                  v-model.trim="planeAdd.addCaseForm.mark"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-checkbox v-model="planeAdd.continueChked" v-if="planeAdd.planeTitle === '新增'">连续新增</el-checkbox>
          <el-button @click="addPlane" type="primary">确定</el-button>
          <el-button @click="concelPlane">取消</el-button>
        </span>
      </el-dialog>

      <!-- 新增-子合同管理-添加子合同 -->
      <el-dialog
        :title="subcontract.subTitle+'子合同'"
        :close-on-click-modal="false"
        :before-close="concelSub"
        :show-close="true"
        :visible.sync="subcontract.caseModal"
        width="800px"
      >
        <el-form
          :model="subcontract.addCaseForm"
          :rules="subcontract.addCaseFormmRule"
          ref="subcontract"
          label-width="115px"
        >
          <el-row :gutter="20">
            <el-col :md="12">
              <el-form-item label="子合同编号：" prop="number" label-width="110px">
                <el-input disabled v-model.trim="subcontract.addCaseForm.number"></el-input>
                <!-- <el-checkbox v-model.trim="subcontract.addCaseForm.checked" style="margin:0 !important;">自动</el-checkbox> -->
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="单位名称：" prop="unitName">
                <el-select
                  filterable
                  clearable
                  v-model.trim="subcontract.addCaseForm.unitName"
                  placeholder="请选择"
                  style="width:255px;"
                >
                  <el-option
                    v-for="item in planeAdd.addCaseForm.unitNameArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="子合同金额：" prop="money" label-width="110px">
                <el-input-number
                  controls-position="right"
                  v-model.trim="subcontract.addCaseForm.money"
                  :min="1"
                  :max="1000000000"
                  style=" width: 260px;"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="子合同名称：" prop="subName">
                <el-input
                  clearable
                  placeholder="请输入"
                  v-model.trim="subcontract.addCaseForm.subName"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="24">
              <el-form-item label="备注：" label-width="100px" prop="mark">
                <el-input
                  type="textarea"
                  :rows="5"
                  placeholder="可输入1000个字符"
                  resize="none"
                  maxlength="1000"
                  v-model.trim="subcontract.addCaseForm.mark"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addSub" type="primary">确定</el-button>
          <el-button @click="concelSub">取消</el-button>
        </span>
      </el-dialog>

      <!-- 新增-合同附件-上传附件 -->
      <el-dialog
        :title="annex.title"
        :close-on-click-modal="false"
        :show-close="false"
        :visible.sync="annex.caseModal"
        width="600px"
      >
        <el-form :model="subcontract.addCaseForm" ref="subcontractAttench" label-width="60px">
          <el-row v-if="annex.switch === 1">
            <el-col :md="24">
              <el-form-item label="附件：">
                <el-upload
                  class="upload-demo"
                  :multiple="false"
                  ref="importRef"
                  :data="{}"
                  :auto-upload="false"
                  :file-list="fileList"
                  :on-change="changeUpload"
                  :action="annex.uploadActionUrl"
                  :on-success="handleSuccess"
                  :headers="annex.headers"
                  :before-remove="beforeRemove"
                >
                  <el-button slot="trigger" size="mediumn" class="cloud-uploadBtn">
                    <i></i>&nbsp;请选择
                  </el-button>&nbsp;&nbsp;
                  <el-button
                    style="margin-left: 10px;padding: 13px 15px;"
                    size="small"
                    type="success"
                    @click="submitUpload"
                  >确认上传</el-button>
                  <div slot="tip" class="el-upload__tip">
                    选择文件前请删除当前文件，且只能上传一个文件。请选择以下文件类型：
                    <p
                      style="margin:0"
                    >{{annex.fileType.length > 0 ? annex.fileType.join('/') :'未配置文件类型，请先配置！' }}</p>
                  </div>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :md="24">
              <el-form-item label="名称：">
                <el-input clearable disabled v-model="annex.addCaseForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="24">
              <el-form-item label="格式：">
                <el-input clearable disabled v-model="annex.addCaseForm.fileType"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="24">
              <el-form-item label="大小：">
                <el-input clearable disabled v-model="annex.addCaseForm.length"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="annex.switch === 2">
            <el-col :md="24">
              <el-form-item label="下载本合同所有附件：" label-width="160px">
                <el-select filterable v-model.trim="annex.downWay" style="width:400px">
                  <el-option
                    v-for="item in annex.downWayArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="packetDown" type="primary" v-if="annex.switch === 2">确定</el-button>
          <el-button @click="concel(annex.switch)" :type="annex.switch === 2 ? '':'primary'">取消</el-button>
        </span>
      </el-dialog>

      <!-- 字典表单 -->
      <add-dic-form :dicFormObj="dicForm" v-if="dicForm.caseModal"></add-dic-form>
    </div>
  </div>
</template>

<script>
import Tools from "untils/index.js"
import Editor from "components/common/Editor"
import AddDicForm from "./AddDicForm"
import { GET, POST, DELETE, PUT } from "http/custom.js"
export default {
  name: "FirstSubcontract",
  components: {
    Editor,
    AddDicForm
  },
  props: {
    //传过来的数据
    subObj: {
      type: Object,
      required: true
    },
    funcSeach: {
      type: Function
    },
    isRootUserActionAll: {
      //用户是否有对应的权限
      type: Function
    },
    configPageObj: {
      //分页
      type: Object,
      required: true
    },
    countFunc: {
      //更新提醒
      type: Function
    }
  },
  data() {
    return {
      disabled: false,
      planChargeArr: [], //
      fileList: [],
      activeName: "first",
      loadMap: new Map(), //记录tab页是否打开过了
      planeTotal: "总计：",
      subTotal: "总计：",
      errMark: "", //异常备注
      content: "", //合同内容
      dataTablePlane: [], // 收付款计划  tb
      planeLoading: false, // 收付款计划 加载
      dataTableSub: [], // 子合同管理  tb
      subLoading: false, //// 子合同管理 加载
      attachLoading: false, //附件  tb
      dataTableAttach: [], //// 附件 加载
      subAnnex: false, // 上传附件/打包下载 按钮
      subAdd: true, // 新增 按钮
      dicForm: {
        //字典表单
        title: "",
        caseModal: false
      },
      planeAdd: {
        //新增/修改-收付款计划
        planeTitle: "新增", //
        planeId: "",
        continueChked: false,
        checked: false,
        caseModal: false, //是否显示弹窗
        stageShow: false, // 是否分期表单
        addCaseFormmRule: {
          // 验证
          planeNum: "",
          planeMoney: [
            { required: true, message: "最大值可输入1000000000" },
            {
              pattern: /\d+\.?\d{0,2}/,
              type: "number",
              message: "请输入数值",
              trigger: "blur"
            }
          ],
          payState: [{ required: true, trigger: "change", message: "请选择" }],
          planDate: "",
          payType: "",
          mark: "",
          constractNum: ""
        },
        addCaseForm: {
          // 表单字段
          constractNum: this.subObj.num, //合同编号
          planeNum: "", // 计划编号
          payState: undefined, // 收付类型
          planeMoney: undefined, //
          planDate: Tools.getYMd(), // 计划日期
          payType: undefined, // 付款方式
          payTypeArr: [], // 收付方式 下拉
          mark: "" //备注
        }
      },
      subcontract: {
        // 新增-合同管理-添加子合同
        caseModal: false, //是否显示弹窗
        checked: false, // 自动
        subId: "",
        subTitle: "新增",
        addCaseFormmRule: {
          // 验证
          number: "",
          unitName: [{ required: true, message: "请选择", trigger: "change" }],
          money: [
            { required: true, message: "最大值可输入1000000000" },
            {
              pattern: /\d+\.?\d{0,2}/,
              type: "number",
              message: "请输入数值",
              trigger: "blur"
            }
          ],
          subName: [{ required: true, message: "请输入", trigger: "bur" }],
          mark: ""
        },
        addCaseForm: {
          // 表单字段
          number: "", //合同编号
          unitName: undefined, //单位名称
          unitNameArr: [], //单位名称 下拉
          money: undefined, //合同金额
          subName: "", //子合同名称
          mark: "" //备注
        }
      },
      annex: {
        // 新增-合同附件-上传附件
        fileType: [], // 文件类型
        caseModal: false, //是否显示弹窗
        title: "", //弹窗标题
        switch: 1, //切换 上传与下载
        downWay: 1, // 下载方式
        downWayArr: [
          {
            //下载方式 下拉
            value: 1,
            label: "保存至本地（需要等待数秒至数分钟）"
          },
          {
            value: 2,
            label: "发送至本人内网邮箱"
          }
        ],
        uploadActionUrl: process.env.VUE_APP_DOMAIN_download + "/oss/upload",
        headers: {
          //上传请求头
          "x-user-token": localStorage.getItem("token") //设置上传数据文件excel的token
        },
        addCaseForm: {
          // 表单字段
          name: "", //附件名称
          fileType: "", //格式
          length: "" //大小
        }
      }
    }
  },
  computed: {
    //当前登录人 id
    userId() {
      return this.$store.state.oaGetTokenInfo.id
    }
  },
  methods: {
    tabShow(tab) {
      switch (tab) {
        case "first":
          this.searchForPlane(this.subObj.num)
          break
        case "second":
          this.searchForSub() //子合同
          break
        case "third":
          this.content = this.subObj.num === "" ? "" : this.subObj.content
          break
        case "fourth":
          this.searchForAttach() //附件
          break
        case "fifth":
          this.errMark = this.subObj.num === "" ? "" : this.subObj.errMark
          break
        default:
          console.log("无匹配页！")
          return
      }
    },
    isShow() {
      switch (this.activeName) {
        case "first":
          //console.log(false);
          return this.isRootUserActionAll(this.subObj.rootCode["收付款计划_新增"])
        case "second":
          return this.isRootUserActionAll(this.subObj.rootCode["子合同管理_新增"])
        case "third":
          return this.isRootUserActionAll(this.subObj.rootCode["合同内容_编辑"])
        case "fifth":
          return this.isRootUserActionAll(this.subObj.rootCode["异常备注_编辑"])
        default:
          return false
      }
    },
    handleClick(tab) {
      this.subObj.tab = tab.name
      this.tabShow(tab.name)
    },
    searchForPlane(id) {
      //查询收付款计划
      this.planeLoading = true
      //调取数据
      GET(process.env.VUE_APP_DOMAIN_financial + "/contractPlans", {
        contractCode: id
      })
        .then(res => {
          this.planeLoading = false
          if (res.data && res.data.length > 0) {
            this.dataTablePlane = res.data
            let planeM = 0,
              realM = 0
            res.data.forEach(item => {
              planeM += item.planAmount
              realM += item.planAmountReal
            })
            this.planeTotal = "总计：计划金额：" + (planeM === 0 ? "--" : planeM.toFixed(2)) + "；实际金额：" + (realM === 0 ? "--" : realM.toFixed(2))
            //console.log(this.dataTablePlane, '付款计划');
          } else {
            this.planeTotal = "总计："
            this.dataTablePlane = []
          }
        })
        .catch(error => {
          this.planeLoading = false
          console.log(error)
        })
    },
    searchForSub() {
      //查询子合同
      const subInfo = () => {
        this.dataTableSub = []
        this.subTotal = "总计："
      }
      if (this.subObj.num === "") {
        subInfo()
        return
      }
      this.subLoading = true
      //调取数据
      POST(process.env.VUE_APP_DOMAIN_financial + "/contractSubList", {
        contractCode: this.subObj.num
      })
        .then(res => {
          this.subLoading = false
          if (res.data && res.data.length > 0) {
            this.dataTableSub = res.data
            let planeM = 0
            res.data.forEach(item => {
              planeM += item.subAmount
            })
            this.subTotal = "总计：金额：" + (planeM === 0 ? "--" : planeM.toFixed(2))
          } else {
            subInfo()
          }
        })
        .catch(error => {
          this.planeLoading = false
          console.log(error)
        })
    },
    reset(formName) {
      //清除表单
      this.$refs[formName].resetFields()
    },
    searchForAttach() {
      //查询附件
      if (this.subObj.num === "") {
        this.dataTableAttach = []
        return
      }
      this.attachLoading = true
      //调取数据
      POST(process.env.VUE_APP_DOMAIN_financial + "/attachmentList", {
        contractCode: this.subObj.num
      })
        .then(res => {
          this.attachLoading = false
          if (res.data) {
            this.dataTableAttach = res.data
            console.log(this.dataTableAttach, "附件")
          }
        })
        .catch(error => {
          this.planeLoading = false
          console.log(error)
        })
    },
    awaitWrap(promise) {
      return promise.then(data => [null, data]).catch(err => [err, null])
    },
    async addFormBtn(val, id) {
      //收付款计划 /合同管理-添加子合同
      const juge = ([err, res]) => {
        let arr = []
        if (err === null && res.data && res.data[0].contractDictDataEntityList.length > 0) {
          arr = res.data[0].contractDictDataEntityList.map(v => {
            return {
              value: v.dataCode + "",
              label: v.dataValue
            }
          })
        }
        return arr
      }
      const url = process.env.VUE_APP_DOMAIN_financial + "/contractDictTypeList"

      //收付款计划
      if (this.activeName === "first") {
        const param = {
          typeCode: "FINA_CONTR_PAYMENT",
          queryFlag: "ALL"
        }
        //获取 收付方式
        const [payErr, payDt] = await this.awaitWrap(POST(url, param))
        this.planeAdd.addCaseForm.payTypeArr = juge([payErr, payDt])
        this.planeAdd.caseModal = true
        this.planeAdd.planeTitle = val
        if (val === "编辑") {
          this.planeAdd.planeId = id
          this.getPlaneDetail(id)
        } else {
          //新增
          this.planeAdd.continueChked = false //连续新增
          this.getPlaneNum(3, "plane") //收付款计划 编号
          this.planeAdd.addCaseForm.payState = this.subObj.planCharge === "OTHER" ? undefined : this.subObj.planCharge //收付类型 编号
          this.disabled = this.subObj.planCharge === "OTHER" ? false : true //主合同为其它时，收付类型可选
        }
        this.planeAdd.addCaseForm.constractNum = this.subObj.num //合同编号
        // 这是后面需求加的，所以又重调接口了一下 获取 收付类型
        param.typeCode = "FINA_CONTR_RECEIPTANDPAYMENT"
        const [dicErr, dicDt] = await this.awaitWrap(POST(url, param))
        this.planChargeArr = juge([dicErr, dicDt])
        this.planChargeArr.splice(this.planChargeArr.findIndex(item => item.label === "其它"), 1) //收付类型 数组 去除 其它
      } else if (this.activeName === "second") {
        //新增-合同管理-添加子合同
        const [subErr, subDt] = await this.awaitWrap(
          //获取 单位名称
          GET(process.env.VUE_APP_DOMAIN_financial + "/contractUnits", {})
        )
        if (subErr === null) {
          this.planeAdd.addCaseForm.unitNameArr = subDt.data.map(v => {
            return {
              value: v.unitCode,
              label: v.unitName
            }
          })
        }
        this.subcontract.caseModal = true
        this.subcontract.subTitle = val
        if (val === "编辑") {
          this.subcontract.subId = id
          this.getSubDetail(id)
        } else {
          this.planeAdd.continueChked = false
          this.getPlaneNum(2, "sub") //子合同 编号
        }
      } else if (this.activeName === "third") {
        //修改 合同内容
        console.log("合同内容字符数:", this.content.length)
        if (this.content.length > 30000) {
          this.messagePopp("warning", "只可输入30000个字符！")
          return
        }
        this.upContent({ content: this.content })
      } else if (this.activeName === "fifth") {
        //修改合同异常备注
        console.log("合同异常备注字符数:", this.errMark.length)
        if (this.errMark.length > 30000) {
          this.messagePopp("warning", "只可输入30000个字符！")
          return
        }
        this.upContent({ unusualNotes: this.errMark })
      }
    },
    async getPlaneNum(count, type) {
      // 获取 收付款计划 编号
      const [numErr, numDt] = await this.awaitWrap(
        POST(process.env.VUE_APP_DOMAIN_financial + "/idContract", {
          type: count,
          contractCode: this.subObj.num
        })
      )
      if (numErr === null) {
        if (type === "plane") {
          this.planeAdd.addCaseForm.planeNum = numDt.data || ""
        } else {
          this.subcontract.addCaseForm.number = numDt.data || ""
        }
      }
    },
    upContent(obj) {
      //编辑子合同内容与异常备注
      GET(process.env.VUE_APP_DOMAIN_financial + "/contract", {
        contractCode: this.subObj.num
      })
        .then(res => {
          if (!res.data) {
            return
          }
          //后端必须要传原来的数据为了记录修改日志
          let param = Object.assign(
            {},
            {
              contractId: res.data.contractId,
              contractCode: res.data.contractCode, //合同编号
              typeCode: res.data.typeCode, //合同分类
              chargeType: res.data.chargeType, //收付类型
              name: res.data.name, //合同名称
              currencyCode: res.data.currencyCode, //币种
              channelCode: res.data.channelCode, //支付方式
              amount: res.data.amount, //合同金额
              signerCode: res.data.signerCode, //签订人
              signDate: res.data.signDate, //签订日期
              executionCode: res.data.executionCode, //执行情况
              areaCode: res.data.areaCode, //区域
              startTime: res.data.startTime, //开始日期
              endTime: res.data.endTime, //截止日期
              responsibilityDeptCode: res.data.responsibilityDeptCode, //责任部门
              partyAUnitCode: res.data.partyAUnitCode, //合同甲方
              partyBUnitCode: res.data.partyBUnitCode, //合同乙方
              partyAResponsibility: res.data.partyAResponsibility, //甲方负责人
              partyBResponsibility: res.data.partyBResponsibility, //已方负责人
              rateCode: res.data.rateCode, //税率
              invoiceTypeCode: res.data.invoiceTypeCode, //发票类型
              taxAmount: res.data.taxAmount, //税金
              warrantyRateCode: res.data.warrantyRateCode, //质保金比例
              warrantyRemindDate: res.data.warrantyRemindDate, //质保金到期提醒
              warrantyRemind: res.data.warrantyRemind, //质保金是否开启提醒：0不开启
              warrantyAmount: res.data.warrantyAmount, //质保金
              [obj.content ? "unusualNotes" : "content"]: obj.content ? res.data.unusualNotes : res.data.content
            },
            obj
          )
          //修改
          PUT(process.env.VUE_APP_DOMAIN_financial + "/contract", param)
            .then(() => {
              this.configPageObj.current = 1 //主合同回到第一页
              this.funcSeach()
              this.messagePopp("success", "编辑成功！")
            })
            .catch(error => {
              console.log(error)
            })
        })
        .catch(error => {
          console.log(error)
        })
    },
    getPlaneDetail(id) {
      //收付款计划 详情
      GET(process.env.VUE_APP_DOMAIN_financial + "/contractPlan", {
        planId: id
      })
        .then(res => {
          if (res.data) {
            this.disabled = true //收付类型 不可选择
            this.planeAdd.addCaseForm.payState = res.data.planChargeCode //收付类型 编号
            this.subObj.planChargeName = res.data.planChargeCode
            this.planeAdd.addCaseForm.planeNum = res.data.planCode
            this.planeAdd.addCaseForm.planeMoney = res.data.planAmount
            this.planeAdd.addCaseForm.planDate = res.data.planDate
            this.planeAdd.addCaseForm.mark = res.data.planRemark
            this.planeAdd.addCaseForm.payType = res.data.planChannelCode //收付方式编号
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    getSubDetail(id) {
      //子合同 详情
      GET(process.env.VUE_APP_DOMAIN_financial + "/contractSub", {
        subId: id
      })
        .then(res => {
          if (res.data) {
            this.subcontract.addCaseForm.number = res.data.subCode //合同编号
            this.subcontract.addCaseForm.unitName = res.data.subUnitCode //单位名称
            this.subcontract.addCaseForm.money = res.data.subAmount //合同金额
            this.subcontract.addCaseForm.subName = res.data.subName //子合同名称
            this.subcontract.addCaseForm.mark = res.data.subRemark //备注
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    changeStage(val) {
      //是否分期
      this.planeAdd.stageShow = val === "0" ? true : false
    },
    queryFileType() {
      // 文件类型
      this.treeLoading = true
      POST(process.env.VUE_APP_DOMAIN_financial + "/contractDictTypeList", {
        typeCode: "FINA_CONTR_ATTACHMENT",
        queryFlag: "ALL"
      })
        .then(res => {
          if (res.data && res.data[0].contractDictDataEntityList.length > 0) {
            this.annex.fileType = res.data[0].contractDictDataEntityList.map(v => v.dataValue)
            this.annex.title = "上传附件"
            this.annex.switch = 1
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    downLoad(attachData) {
      //下载
      window.location.href = process.env.VUE_APP_DOMAIN_download + "/oss/download?key=" + attachData + "&view=false"
    },
    addFormAnnex(val) {
      //上传附件
      this.annex.caseModal = true
      this.beforeRemove()
      if (val === "上传附件") {
        this.queryFileType()
      } else {
        this.annex.title = val
        this.annex.switch = 2
      }
    },
    //打包下载
    packetDown() {
      // 'http://10.20.80.124:8091/oss/downloadForZip?keys=1184076164251226114,1184085830062530561&
      //name=YX-19-10-11-0001&type=2&emailTitle="合同YX-19-10-11-0001"'

      if (this.dataTableAttach.length <= 0) {
        this.messagePopp("warning", "没有可下载的附件！")
        return
      }
      let codeArr = this.dataTableAttach.map(v => v.attachData)

      if (this.annex.downWay === 1) {
        this.messagePopp("success", "已经下载至本地！")
        let url = process.env.VUE_APP_DOMAIN_download + "/oss/downloadForZip?keys=" + codeArr.join(",") + "&type=" + this.annex.downWay + "&name=" + this.subObj.num + "&userId=" + this.userId //+'&emailTitle=合同YX-19-10-11-0001'
        window.location.href = url
      } else {
        // console.log(this.userId,'userId')
        this.messagePopp("success", "已经发送至您的邮箱！")
        GET(process.env.VUE_APP_DOMAIN_download + "/oss/downloadForZip", {
          keys: codeArr.join(","),
          type: this.annex.downWay,
          name: this.subObj.num,
          userId: this.userId //当前登录人 id
        })
          .then(() => {
            console.log("已经发送至您的邮箱！") //后台没有返回值
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
    addDic(val) {
      //字典
      this.dicForm.caseModal = true
      this.dicForm.title = val
    },
    //提示框
    messagePopp(type, msg) {
      this.$message({
        showClose: true,
        type: type,
        message: msg
      })
    },
    addSub() {
      //子合同  新增/修改验证表单
      let param = {
        contractCode: this.subObj.num, //主合同编号
        subCode: this.subcontract.addCaseForm.number, //子合同编号
        subUnitCode: this.subcontract.addCaseForm.unitName, //子合同单位编号
        subAmount: this.subcontract.addCaseForm.money, //子合同金额
        subName: this.subcontract.addCaseForm.subName, //子合同名称
        subRemark: this.subcontract.addCaseForm.mark //备注说明
      }
      this.$refs.subcontract.validate(valid => {
        if (valid) {
          const url = process.env.VUE_APP_DOMAIN_financial + "/contractSub"
          if (this.subcontract.subTitle === "新增") {
            //新增
            POST(url, param)
              .then(() => {
                this.searchForSub()
                this.messagePopp("success", "新增成功！")
                this.concelSub() //关闭弹窗
              })
              .catch(error => {
                console.log(error)
              })
          } else {
            //修改
            param = Object.assign({}, param, {
              subId: this.subcontract.subId
            })
            PUT(url, param)
              .then(() => {
                this.searchForSub()
                this.messagePopp("success", "编辑成功！")
                this.subcontract.caseModal = false //关闭弹窗
                this.reset("subcontract") //清空表单
              })
              .catch(error => {
                console.log(error)
              })
          }
        } else {
          this.messagePopp("warning", "提交失败，验证不通过")
        }
      })
    },
    changeUpload(file, fileList) {
      //文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
      console.log("change", file)
      console.log("fileList", fileList)
      const idx = file.name.lastIndexOf(".")
      const fileContent = file.name.substring(idx + 1) //截取文件后缀
      const bl = this.annex.fileType.join(",").includes(fileContent.toLowerCase())
      if (!bl) {
        this.$msgBox.confirm(`请选择对应的文件类型：${this.annex.fileType.join("/")} `, "提示", {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定",
          showCancelButton: false,
          showClose: false,
          type: "warning"
        })
        this.beforeRemove()
        this.$refs.importRef.clearFiles()
        return
      }
      this.fileList = [file] //替换掉之前的文件
      this.$nextTick(() => {
        //（dialog是懒加载）修改和新增用的同一个表单时，修改回填数据时要用这个方法防止再点击新增时数据会回填
        this.annex.addCaseForm.name = file.name.substring(0, idx) //文件名
        this.annex.addCaseForm.fileType = fileContent
        this.annex.addCaseForm.length = parseFloat(file.size / 1024 / 1024).toFixed(2) + "M"
      })
    },
    handleSuccess(res) {
      //上传成功
      if (!res.data) {
        console.log("res.data不存在")
        this.messagePopp("warning", "上传失败！")
        return
      }
      var myDate = new Date() //实例一个时间对象；
      const param = {
        contractCode: this.subObj.num,
        attachName: this.annex.addCaseForm.name,
        attachFormat: "." + this.annex.addCaseForm.fileType,
        attachSize: this.annex.addCaseForm.length,
        attachData: res.data,
        // attachCreateUser:'',
        // attachCreateUserName:'',
        attachCreateTime: Tools.getYMd() + " " + myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds()
      }
      POST(process.env.VUE_APP_DOMAIN_financial + "/attachment", param)
        .then(() => {
          this.searchForAttach()
          this.annex.caseModal = false
          this.messagePopp("success", "上传成功！")
          this.$refs.importRef.clearFiles()
        })
        .catch(error => {
          this.messagePopp("warning", "上传失败！")
          console.log(error)
        })
    },
    beforeRemove() {
      //删除文件之前的钩子 清空文本框
      this.annex.addCaseForm.name = ""
      this.annex.addCaseForm.fileType = ""
      this.annex.addCaseForm.length = ""
    },
    submitUpload() {
      //上传文件
      let upFile = this.$refs.importRef.uploadFiles //submit();
      if (upFile.length > 0) {
        this.$refs.importRef.submit() //手动上传
      } else {
        this.messagePopp("warning", "上传失败！")
      }
    },
    addPlane() {
      //收付计划  新增/修改验证表单
      let param = {
        contractCode: this.subObj.num, //主合同编号
        planAmount: this.planeAdd.addCaseForm.planeMoney, //计划金额
        planChannelCode: this.planeAdd.addCaseForm.payType, //收付方式编号--枚举值表
        planChargeCode: this.planeAdd.addCaseForm.payState, //收付类型编号--枚举值表         这里文本值，稍后加一个 id 值
        planCode: this.planeAdd.addCaseForm.planeNum, //收付款计划编号
        planDate: this.planeAdd.addCaseForm.planDate, //计划日期
        planRemark: this.planeAdd.addCaseForm.mark //还款备注
      }
      this.$refs.planeAdd.validate(valid => {
        if (valid) {
          const url = process.env.VUE_APP_DOMAIN_financial + "/contractPlan"
          if (this.planeAdd.planeTitle === "新增") {
            //新增
            POST(url, param)
              .then(() => {
                this.searchForPlane(this.subObj.num)
                this.countFunc() //更新提醒
                this.messagePopp("success", "新增成功！")
                if (this.planeAdd.continueChked) {
                  //是否连续新增
                  this.planeAdd.addCaseForm.planeMoney = undefined
                  this.getPlaneNum(3, "plane") // 再次生成 计划编号
                } else {
                  this.concelPlane() //关闭弹窗
                }
              })
              .catch(error => {
                console.log(error)
              })
          } else {
            //修改
            param = Object.assign(param, {
              planId: this.planeAdd.planeId
            })
            PUT(url, param)
              .then(() => {
                this.searchForPlane(this.subObj.num)
                this.messagePopp("success", "编辑成功！")
                this.concelPlane() //关闭弹窗
              })
              .catch(error => {
                console.log(error)
              })
          }
        } else {
          this.messagePopp("warning", "提交失败，验证不通过")
        }
      })
    },
    //**********************所有 取消操作
    concelSub() {
      this.subcontract.caseModal = false //关闭弹窗
      this.reset("subcontract") //清空表单
    },
    concelPlane() {
      this.planeAdd.caseModal = false //关闭弹窗
      this.reset("planeAdd") //清空表单
    },
    concel() {
      this.annex.caseModal = false
      if (this.annex.switch !== 2) {
        this.$refs.importRef.clearFiles()
      }
      this.beforeRemove()
    },
    //**********************所有 删除操作
    deleteAttach(id) {
      const para = {
        url: "/attachment",
        obj: {
          attachId: id
        },
        func: res => {
          console.log("删除成功!" + res)
          this.messagePopp("success", "删除成功!")
          this.searchForAttach()
        }
      }
      this.deleteParam(para)
    },
    deletePlane(id) {
      const para = {
        url: "/contractPlan",
        obj: {
          id: id
        },
        func: res => {
          console.log("删除成功!" + res)
          this.messagePopp("success", "删除成功!")
          this.searchForPlane(this.subObj.num)
          this.countFunc() //更新提醒
        }
      }
      this.deleteParam(para)
    },
    deleteSub(id) {
      const para = {
        url: "/contractSub",
        obj: {
          subId: id
        },
        func: res => {
          console.log("删除成功!" + res)
          this.messagePopp("success", "删除成功!")
          this.searchForSub()
        }
      }
      this.deleteParam(para)
    },
    deleteParam(param) {
      this.$msgBox
        .confirm("你确定要删除该条数据吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          DELETE(process.env.VUE_APP_DOMAIN_financial + param.url, param.obj)
            .then(res => {
              param.func(res)
            })
            .catch(error => {
              console.error(error)
            })
        })
        .catch(() => {
          this.messagePopp("info", "已取消删除!")
        })
    },
    catchContent(content) {
      this.content = content
    },
    catchErrMark(content) {
      this.errMark = content
    }
  }
}
</script>

<style lang="less" >
.first-subcontract {
  width: 100%;
  position: relative;
  overflow: hidden;

  .w-e-toolbar > div:nth-child(14) {
    //隐藏富文本中的图片上传
    display: none !important;
  }

  .el-tabs__header {
    margin-bottom: 0.3px !important;
  }

  //设置富文本
  #wangeditor .w-e-text-container {
    height: calc(100% - 32px) !important;
  }

  .width230 {
    width: 230px !important;
  }
  .width220 {
    width: 220px !important;
  }
  .plane-btn .el-dialog__footer {
    padding: 0 40px 20px !important;
  }
}
</style>
