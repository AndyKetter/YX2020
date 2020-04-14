<template>
  <div class="remind-fourth">
    <div>
      <el-row>
        <el-col :md="8">
          <el-form :inline="true" class="mar-no" label-position="right">
            <el-form-item label="计划日期">
              <el-date-picker
                v-model="gatheringBatch"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width:217px"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="changeStateup" icon="el-icon-search">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :md="8">
          <label class="tabTitle">应收款提醒表</label>
        </el-col>
      </el-row>
      <div class>
        <el-table
          v-loading="uploading"
          :data="gatheringData"
          :height="tabHeight"
          border
          style="width:100%"
          :header-cell-style="{backgroundColor:'#e5e9f3',padding:'0'}"
          :header-row-style="{height:'20px'}"
          :cell-style="{padding:'0'}"
          :row-style="{height:'20px'}"
        >
          <el-table-column type="index" label="序号" fixed="left" min-width="50"></el-table-column>
          <el-table-column prop="contractCode" label="合同编号" min-width="200" show-overflow-tooltip></el-table-column>
          <el-table-column prop="planCode" label="计划编号" min-width="200" show-overflow-tooltip></el-table-column>
          <el-table-column prop="planChargeName" label="收付类型" min-width="100"></el-table-column>
          <el-table-column prop="planDate" label="计划日期" min-width="100"></el-table-column>
          <el-table-column prop="currencyName" label="币种" min-width="100"></el-table-column>
          <el-table-column prop="planAmount" label="计划金额" min-width="100"></el-table-column>
          <el-table-column prop="planAmountReal" label="实收金额" min-width="100"></el-table-column>
          <el-table-column prop="endTime" label="合同截止日期" min-width="160"></el-table-column>
          <el-table-column prop="name" label="合同名称" min-width="150"></el-table-column>
          <el-table-column prop="planRemark" label="备注" min-width="160" show-overflow-tooltip></el-table-column>
          <el-table-column prop="planStatus" min-width="140">
            <template slot="header">
              <el-select
                v-model="gatheringStateValue"
                filterable
                placeholder="状态"
                clearable
                style="width:120px;"
                @change="changeStateup"
                class="selectRepairIcon"
              >
                <el-option
                  v-for="item in gatheringStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
            <template slot-scope="scope">
              <span style="color:red;" v-if="scope.row.planStatus==4">已逾期</span>
              <span style="color:blue;" v-if="scope.row.planStatus==3">今日收款</span>
              <span v-if="scope.row.planStatus==2">待收款</span>
              <span style="color:gray;" v-if="scope.row.planStatus==1">已完成</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            width="160"
            v-if="permissions(permissionsMapObj['操作-收款']) || permissions(permissionsMapObj['操作-收款合同明细'])"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                v-if="permissions(permissionsMapObj['操作-收款'])"
                @click="JS_collect(scope.row)"
                v-show="finishedup(scope.row.planStatus)"
              >收款</el-button>
              <el-button
                type="text"
                size="small"
                v-if="permissions(permissionsMapObj['操作-收款合同明细'])"
                @click="checkedRow(scope.row.contractCode)"
              >合同明细</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 总计 -->
        <!-- 分页 -->
        <div id="pagination">
          <el-alert :title="gatheringTotal" type="success" :closable="false" class></el-alert>
          <el-pagination
            @size-change="handleSizeChangeup"
            @current-change="handlecurrentChangeup"
            background
            :current-page="upcurrent"
            :page-sizes="[5,10,15,20,30,40]"
            :page-size="upsize"
            layout="total,sizes,prev,pager,next,jumper"
            :total="uptotal"
          ></el-pagination>
          <div style="clear:both"></div>
        </div>
      </div>
    </div>
    <div class="mar-top">
      <el-row>
        <el-col :md="8">
          <el-form :inline="true" class="mar-no" label-position="right">
            <el-form-item label="计划日期">
              <el-date-picker
                v-model="paymentBatch"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width:217px"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="changeStatedown" icon="el-icon-search">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :md="8">
          <label class="tabTitle">应付款提醒表</label>
        </el-col>
      </el-row>
      <div class>
        <el-table
          v-loading="downloading"
          :data="paymentData"
          :height="tabHeight"
          border
          style="width:110%"
          :header-cell-style="{backgroundColor:'#e5e9f3',padding:'0'}"
          :header-row-style="{height:'20px'}"
          :cell-style="{padding:'0'}"
          :row-style="{height:'20px'}"
        >
          <el-table-column type="index" label="序号" fixed="left" min-width="50"></el-table-column>
          <el-table-column prop="contractCode" label="合同编号" min-width="200" show-overflow-tooltip></el-table-column>
          <el-table-column prop="planCode" label="计划编号" min-width="200" show-overflow-tooltip></el-table-column>
          <el-table-column prop="planChargeName" label="收付类型" min-width="100"></el-table-column>
          <el-table-column prop="planDate" label="计划日期" min-width="100"></el-table-column>
          <el-table-column prop="currencyName" label="币种" min-width="100"></el-table-column>
          <el-table-column prop="planAmount" label="计划金额" min-width="100"></el-table-column>
          <el-table-column prop="planAmountReal" label="实付金额" min-width="100"></el-table-column>
          <el-table-column prop="endTime" label="合同截止日期" min-width="160"></el-table-column>
          <el-table-column prop="name" label="合同名称" min-width="200" show-overflow-tooltip></el-table-column>
          <el-table-column prop="planRemark" label="备注" min-width="160" show-overflow-tooltip></el-table-column>
          <el-table-column min-width="145">
            <template slot="header">
              <el-select
                v-model="paymentStateValue"
                filterable
                placeholder="状态"
                clearable
                style="width:130px;"
                @change="changeStatedown"
                class="selectRepairIcon"
              >
                <el-option
                  v-for="item in paymentStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
            <template slot-scope="scope">
              <span style="color:red;" v-if="scope.row.planStatus===4">已逾期</span>
              <span style="color:blue;" v-if="scope.row.planStatus===3">今日付款</span>
              <span v-if="scope.row.planStatus===2">待付款</span>
              <span style="color:gray;" v-if="scope.row.planStatus===1">已完成</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            width="160"
            v-if="permissions(permissionsMapObj['操作-付款']) || permissions(permissionsMapObj['操作-付款合同明细'])"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="JS_collect(scope.row)"
                v-show="finishedup(scope.row.planStatus)"
                v-if="permissions(permissionsMapObj['操作-付款'])"
              >付款</el-button>
              <el-button
                type="text"
                @click="checkedRow(scope.row.contractCode)"
                size="small"
                v-if="permissions(permissionsMapObj['操作-付款合同明细'])"
              >合同明细</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div id="pagination">
          <el-alert :title="paymentTotal" type="success" :closable="false"></el-alert>
          <el-pagination
            @size-change="handleSizeChangedown"
            @current-change="handlecurrentChangedowon"
            background
            :current-page="downcurrent"
            :page-sizes="[5,10,15,20,30,40]"
            :page-size="downsize"
            layout="total,sizes,prev,pager,next,jumper"
            :total="downtotal"
          ></el-pagination>
          <div style="clear:both"></div>
        </div>
      </div>
    </div>

    <!-- 合同收付款弹框 -->
    <el-dialog
      title="合同收付款"
      :close-on-click-modal="false"
      :before-close="closeDialog"
      :visible.sync="addViewModal"
      width="1000px"
    >
      <div>
        <el-alert :title="planTitle" type="warning" :closable="false"></el-alert>
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
                <el-input v-model="addView.contractCode" class="width170" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="8">
              <el-form-item label="收付类型：" prop="planChargeName">
                <el-input v-model="addView.planChargeName" :disabled="true" class="width155"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="7">
              <el-form-item label="币种：" prop="currencyName">
                <el-input v-model="addView.currencyName" :disabled="true" class="width155"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="9">
              <el-form-item label="关联计划：" prop="planCode">
                <el-input v-model="addView.planCode" class="width170" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="8">
              <el-form-item label="发票金额：" prop="planAmount">
                <el-input-number
                  v-model.trim="addView.planAmount"
                  class="width155"
                  controls-position="right"
                  :min="1"
                  :max="1000000000"
                ></el-input-number>
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
              <el-form-item label="收付方式：" prop="planChannelCode">
                <el-select v-model="addView.planChannelCode" placeholder="业务类型" class="width155">
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
              <el-form-item label="备注：" prop="planRemark">
                <el-input v-model="addView.planRemark"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="JS_addView('addView')">提交</el-button>
      </span>
    </el-dialog>

    <!-- 合同明细弹框 -->
    <checked-contract-form :constractFormObj="constractFormChecked" ref="mychildChecked"></checked-contract-form>
  </div>
</template>

<script>
import CheckedContractForm from "./partComp/CheckedContractForm"
import { POST } from "http/custom.js"
import Tools from "untils/index.js"
export default {
  name: "remindFourth",
  components: {
    CheckedContractForm
  },
  props: {
    //传过来的数据
    dataListObj: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      addViewModal: false, //新增合同收付款弹框
      uploading: false, //table加载动画开关
      downloading: false, //table加载动画开关
      gatheringBatch: "",
      upcurrent: 1, //当前页码
      upsize: 15, //每页显示记录条数
      uptotal: 0, //总记录条数
      downcurrent: 1, //当前页码
      downsize: 15, //每页显示记录条数
      downtotal: 0, //总记录条数
      paymentOptions: [],
      planTitle: "",
      constractFormChecked: {
        // 合同管理 审核表单
        caseModal: false, //弹窗
        num: {} // 行数据
      },
      gatheringData: [],
      tabHeight: (window.innerHeight - 460) / 2,
      gatheringTotal: "",
      gatheringStateValue: "",
      gatheringStatus: [{ value: 4, label: "已逾期" }, { value: 3, label: "今日收款" }, { value: 2, label: "待收款" }, { value: 1, label: "已完成" }],
      paymentStateValue: "",
      paymentStatus: [{ value: 4, label: "已逾期" }, { value: 3, label: "今日付款" }, { value: 2, label: "待付款" }, { value: 1, label: "已完成" }],
      paymentBatch: "",
      paymentData: [],
      paymentTotal: "",
      typeOptions: [{ value: 0, label: "正常" }, { value: 1, label: "维修中" }, { value: 3, label: "已报废" }],
      addView: {
        contractCode: "",
        chargeCode: "",
        planChargeCode: "",
        planAmount: undefined,
        planCode: "",
        chargeAmount: undefined,
        chargeInvoiceDate: "",
        currencyName: "",
        chargeInvoiceNumber: "",
        chargeDate: "",
        planChannelCode: "",
        planRemark: ""
      },
      addViewRule: {
        contractCode: [{ required: true, message: "请选择合同编号", trigger: "blur" }],
        chargeCode: [{ required: true, message: "请填写收付单号", trigger: "blur" }, { pattern: /^[0-9,a-z,A-Z,-,_]+$/, message: "必须是数字或字母", trigger: "blur" }],
        planChargeCode: [{ required: true, message: "请选择收付类型", trigger: "change" }],
        planAmount: [{ required: true, message: "请输入数值" }, { pattern: /\d+\.?\d{0,2}/, type: "number", message: "请输入数值", trigger: "blur" }],
        chargeAmount: [{ required: true, message: "请输入数值" }, { pattern: /\d+\.?\d{0,2}/, type: "number", message: "请输入数值", trigger: "blur" }],
        currencyName: [{ required: true, message: "请选择币种", trigger: "blur" }]
      },
      permissionsMapObj: {
        //老系统action权限映射对象
        "操作-收款": "274dce9d21244b88a2369ccc9672ec1c",
        "操作-收款合同明细": "c95331b9538b4138aa87a4348a377e8d",
        "操作-付款": "4fd9bb0f8a7049b9aceb19e9e4e666d9",
        "操作-付款合同明细": "74d02c14d44c4def97de0ae8d2b741a8"
      }
    }
  },
  created() {
    console.log(this.dataListObj.deptInfo)
    this.upsearch()
    this.downsearch()
    this.queryPaymentList()
    console.log("permissionsMapObj:", this.permissionsMapObj)
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
    reset(formName) {
      //清除表单
      this.$refs[formName].resetFields()
    },
    changeStateup() {
      this.upcurrent = 1 //保存状态-每页显示多少条数据切换
      this.upsearch()
    },
    changeStatedown() {
      this.upcurrent = 1 //保存状态-每页显示多少条数据切换
      this.downsearch()
    },
    upsearch() {
      let queryObj = {
        planBeginDate: this.gatheringBatch ? this.gatheringBatch[0] : "",
        planEndDate: this.gatheringBatch ? this.gatheringBatch[1] : "",
        planStatus: this.gatheringStateValue,
        type: "RECEIPT"
      } //查询象

      let searchObj2 = Object.assign(queryObj, {
        current: this.upcurrent,
        size: this.upsize
      })
      this.uploading = true //开启动画
      POST(process.env.VUE_APP_DOMAIN_financial + "/contractNotices", searchObj2)
        .then(res => {
          //查询对象
          this.uploading = false //关闭动画
          this.gatheringData = res.data.records
          this.upcurrent = res.data.current //当前页
          this.upsize = res.data.size //每页显示记录条数先
          this.uptotal = res.data.total //总记录数据
          console.log(res.data)
        })
        .catch(error => {
          console.log(error)
        })
      ///总计
      POST(process.env.VUE_APP_DOMAIN_financial + "/sumContractNotice", queryObj)
        .then(res => {
          //查询对象
          this.gatheringTotal = "计划金额总计：" + (res.data.planAmount || "0") + "；实收金额：" + (res.data.planAmountReal || "0")
          console.log(res.data)
        })
        .catch(error => {
          console.log(error)
        })
    },
    finishedup(planStatus) {
      let flag = planStatus === 1 ? false : true
      return flag
    },
    downsearch() {
      let queryObj = {
        planBeginDate: this.paymentBatch ? this.paymentBatch[0] : "",
        planEndDate: this.paymentBatch ? this.paymentBatch[1] : "",
        planStatus: this.paymentStateValue,
        type: "PAYMENT"
      } //查询象

      let searchObj2 = Object.assign(queryObj, {
        current: this.downcurrent,
        size: this.downsize
      })
      this.downloading = true //开启动画
      POST(process.env.VUE_APP_DOMAIN_financial + "/contractNotices", searchObj2)
        .then(res => {
          //查询对象
          this.downloading = false //关闭动画
          this.paymentData = res.data.records
          this.downcurrent = res.data.current //当前页
          this.downsize = res.data.size //每页显示记录条数先
          this.downtotal = res.data.total //总记录数据
          console.log(res.data)
        })
        .catch(error => {
          console.log(error)
        })
      ///总计
      POST(process.env.VUE_APP_DOMAIN_financial + "/sumContractNotice", queryObj)
        .then(res => {
          //查询对象
          this.paymentTotal = "计划金额总计：" + (res.data.planAmount || "0") + "；实付金额：" + (res.data.planAmountReal || "0")
          console.log(res.data)
        })
        .catch(error => {
          console.log(error)
        })
    },
    JS_collect(data) {
      this.addViewModal = true
      this.addView = data
      this.addView.chargeAmount = data.planAmount
      this.addView.chargeInvoiceDate = Tools.getYMd()
      this.addView.chargeDate = Tools.getYMd()
      this.planTitle = "合同金额：" + data.amount + "；已收/付金额：" + data.amountCharged + " ；未收/付金额：" + data.amountRemain
    },
    JS_addView(formName) {
      //新增收付款
      this.$refs[formName].validate(valid => {
        if (valid) {
          let saveObj = this.addView //保存对象
          let searchObj2 = Object.assign(saveObj, {
            chargeChargeCode: this.addView.planChargeCode, //收付类型
            chargeCurrencyCode: this.addView.currencyCode, //币种
            chargePlanCode: this.addView.planCode, //关联计划
            chargeInvoiceAmount: this.addView.planAmount, //发票金额
            // "chargeAmount": this.addView.chargeAmount,//实际金额
            chargeRemark: this.addView.planRemark, //备注
            chargeChannelCode: this.addView.planChannelCode
          })
          console.log("保存对象", saveObj)
          POST(process.env.VUE_APP_DOMAIN_financial + "/contractCharge", searchObj2)
            .then(res => {
              this.messagePopp("success", "新增数据成功")
              this.addViewModal = false //关闭修改弹框
              this.reset(formName) //清空表单
              this.upsearch()
              this.downsearch()
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
    closeDialog() {
      //仅仅清除表单
      this.addViewModal = false
      this.reset("addView")
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
    checkedRow(num) {
      //审核
      this.constractFormChecked.num = num
      this.constractFormChecked.caseModal = true
      this.$refs.mychildChecked.getDetails()
      this.$refs.mychildChecked.JScheckedFlag()
    },
    handlecurrentChangeup(val) {
      //点击页码，当前页
      this.upcurrent = val //保存状态-当前页
      this.upsearch()
    },
    handleSizeChangeup(val) {
      //每页显示多少条数据切换
      this.upsize = val //保存状态-每页显示多少条数据切换
      this.upsearch()
    },
    handlecurrentChangedowon(val) {
      //点击页码，当前页
      this.downcurrent = val //保存状态-当前页
      this.downsearch()
    },
    handleSizeChangedown(val) {
      //每页显示多少条数据切换
      this.downsize = val //保存状态-每页显示多少条数据切换
      this.downsearch()
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

<style lang="less" >
.remind-fourth {
  //   .el-form-item--small.el-form-item {
  //     margin-bottom: 15px;
  //   }
  .tabTitle {
    display: block;
    line-height: 35px;
    font-weight: bold;
    text-align: center;
    font-size: 18px;
  }
  #pagination .el-alert {
    float: left;
    width: 30%;
  }
  #pagination .el-pagination {
    float: right;
  }

  //表头状态下拉
  .el-table__header-wrapper .el-input--small .el-input__inner {
    height: 25px !important;
    line-height: 25px !important;
  }
}
</style>

