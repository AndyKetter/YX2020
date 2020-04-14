<template>
  <div class="checked-contract-form">
    <!-- 审核合同 -->
    <el-dialog
      class="grayBg"
      title="审核合同"
      :close-on-click-modal="false"
      :show-close="true"
      :visible.sync="constractFormObj.caseModal"
      width="1040px"
      top="5vh"
    >
      <el-form
        :model="addBcontract.baseInfo"
        :rules="addBcontract.addCaseFormRule"
        ref="addBcontract"
        label-width="100px"
      >
        <!-- 合同基本信息 -->
        <div class="whiteBox train-dialog">
          <p style="font-weight:bold">合同基本信息</p>
          <el-row :gutter="10">
            <el-col :md="8">
              <el-form-item label="合同编号：">
                <el-input disabled v-model.trim="addBcontract.baseInfo.number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="8">
              <el-form-item label="合同类型：">
                <el-input disabled v-model.trim="addBcontract.baseInfo.constractType"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="8">
              <el-form-item label="收付类型：">
                <el-input disabled v-model.trim="addBcontract.baseInfo.payType"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="24">
              <el-form-item label="合同名称：" prop="payType">
                <el-input disabled v-model.trim="addBcontract.baseInfo.name"></el-input>
              </el-form-item>
            </el-col>

            <el-col :md="8" v-if="addBcontract.payTypeChk">
              <el-form-item label="币种：">
                <el-input disabled v-model.trim="addBcontract.baseInfo.currency"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="8" v-if="addBcontract.payTypeChk">
              <el-form-item label="支付方式：" prop="payWay">
                <el-input disabled v-model.trim="addBcontract.baseInfo.payWay"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="8" v-if="addBcontract.payTypeChk">
              <el-form-item label="合同金额：">
                <el-input disabled v-model.trim="addBcontract.baseInfo.money"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="8">
              <el-form-item label="签订人：">
                <el-input disabled v-model.trim="addBcontract.baseInfo.signPeo"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="8">
              <el-form-item label="签订日期：">
                <el-input disabled v-model.trim="addBcontract.baseInfo.signDate"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="8">
              <el-form-item label="执行情况：">
                <el-input disabled v-model.trim="addBcontract.baseInfo.situation"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="8">
              <el-form-item label="区域：">
                <el-input disabled v-model.trim="addBcontract.baseInfo.area"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="8">
              <el-form-item label="开始日期：" prop="respPart">
                <el-input disabled v-model.trim="addBcontract.baseInfo.startDate"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="8">
              <el-form-item label="截止日期：" prop="endDate">
                <el-input disabled v-model.trim="addBcontract.baseInfo.endDate"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="24">
              <el-form-item label="责任部门：" prop="respPart">
                <el-input
                  disabled
                  v-model.trim="addBcontract.baseInfo.respPart"
                  style="width:215px"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <!-- 合同详情 -->
        <div class="whiteBox train-dialog" style="margin:20px 0">
          <p style="font-weight:bold">合同详情</p>
          <el-row style="margin-left: 30px;">
            <el-col :md="12">
              <el-form-item label="合同甲方：">
                <el-input disabled v-model.trim="addBcontract.dtailsInfo.partyA" class="width300"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="合同乙方：" label-width="130px">
                <el-input disabled v-model.trim="addBcontract.dtailsInfo.partyB" class="width300"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="甲方负责人：">
                <el-input
                  disabled
                  v-model.trim="addBcontract.dtailsInfo.partyAname"
                  class="width300"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="已方负责人：" label-width="130px">
                <el-input
                  disabled
                  v-model.trim="addBcontract.dtailsInfo.partyBname"
                  class="width300"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-left: 30px;" v-if="addBcontract.payTypeChk">
            <el-col :md="12">
              <el-form-item label="发票类型：">
                <el-input disabled v-model.trim="addBcontract.dtailsInfo.billType" class="width300"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="税率：" label-width="130px">
                <el-input disabled v-model.trim="addBcontract.dtailsInfo.taxRate" class="width300"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="税金：">
                <el-input disabled v-model.trim="addBcontract.dtailsInfo.taxation" class="width300"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="质保金比例：" label-width="130px">
                <el-input
                  disabled
                  v-model.trim="addBcontract.dtailsInfo.retentionRate"
                  class="width300"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="质保金：">
                <el-input
                  disabled
                  v-model.trim="addBcontract.dtailsInfo.retention"
                  class="width300"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="质保金到期提醒：" label-width="130px">
                <el-input
                  disabled
                  v-model.trim="addBcontract.dtailsInfo.deadLine"
                  style="width:200px"
                ></el-input>&nbsp;&nbsp;
                <el-checkbox disabled v-model.trim="addBcontract.dtailsInfo.call">开启提醒</el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <!-- 子合同 -->
      <div class="whiteBox train-dialog">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <!--  <el-tab-pane label="收付款计划" name="first">
            <div class="table_wrap">
              <el-table v-loading="planeLoading" :height="t_plane" :data="dataTablePlane" border :header-cell-style="{backgroundColor:'#e5e9f3'}">
                <el-table-column type="index" label="序号" fixed="left" min-width="50"></el-table-column>
                <el-table-column prop="caseName" label="合同编号" fixed="left" min-width="150"></el-table-column>
                <el-table-column prop="caseName" label="计划编号" fixed="left" min-width="150"></el-table-column>
                <el-table-column prop="clientBank" label="状态" fixed="left" min-width="120">
                  <template slot-scope="scope">
                    <span style="color:red;" v-if="scope.row.commitState === '0'">待处理</span>
                    <span v-else-if="scope.row.commitState === '1'">已处理</span>
                    <span v-else></span>
                  </template>
                </el-table-column>
                <el-table-column prop="trusteeSupplier" label="收付类型" min-width="120"></el-table-column>
                <el-table-column prop="businessModel" label="币种" min-width="100"></el-table-column>
                <el-table-column prop="averageExceedTime" label="收付方式" min-width="100"></el-table-column>
                <el-table-column prop="invoiceStatus" label="是否分期" min-width="100"></el-table-column>
                <el-table-column prop="averageCommissionRate" label="分期方式" min-width="100"></el-table-column>
                <el-table-column prop="returnedMoneyRate" label="计划金额" min-width="100"></el-table-column>
                <el-table-column prop="entrustMoney" label="提醒时间" min-width="100"></el-table-column>
                <el-table-column prop="householdNumber" label="收/付款日期" min-width="130"></el-table-column>
                <el-table-column prop="returnedMoney" label="收/付款次数" min-width="100"></el-table-column>
                <el-table-column prop="balanceCommission" label="备注" show-overflow-tooltip min-width="200"></el-table-column>
                <el-table-column prop="commissionWithholdMoney" label="录入人" min-width="100"></el-table-column>
                <el-table-column prop="encourageCommission" label="录入时间" min-width="150"></el-table-column>
                <el-table-column prop="remark" label="修改人" min-width="150"></el-table-column>
                <el-table-column prop="leadingCadre" label="修改时间" min-width="150"></el-table-column>
              </el-table>
           
              <el-alert :title="planeTotal" style="margin-top:10px;border:1px solid" type="success" :closable="false"> </el-alert>
            </div>
          </el-tab-pane>-->
          <el-tab-pane label="子合同管理" name="second">
            <div class="table_wrap" v-if="loadMap.has('second')">
              <el-table
                v-loading="planeLoading"
                :height="t_plane"
                :data="dataTableSub"
                border
                :header-cell-style="{backgroundColor:'#e5e9f3'}"
              >
                <el-table-column type="index" label="序号" fixed="left" min-width="50"></el-table-column>
                <el-table-column prop="subName" label="子合同名称" min-width="200" show-overflow-tooltip></el-table-column>
                <el-table-column prop="subCode" label="子合同编码" min-width="200" show-overflow-tooltip></el-table-column>
                <el-table-column
                  prop="subUnitName"
                  label="单位名称"
                  min-width="120"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column prop="subAmount" label="金额" min-width="120">
                  <template slot-scope="scope">{{scope.row.subAmount | toThousands}}</template>
                </el-table-column>
                <el-table-column prop="subRemark" label="备注" show-overflow-tooltip min-width="200"></el-table-column>
                <el-table-column prop="subUpdateUserName" label="操作人" min-width="100"></el-table-column>
                <el-table-column prop="subCreateTime" label="操作时间" min-width="150"></el-table-column>
              </el-table>
              <!-- 总计 -->
              <el-alert
                :title="planeTotal"
                style="margin-top:10px;"
                type="success"
                :closable="false"
              ></el-alert>
            </div>
          </el-tab-pane>
          <el-tab-pane label="合同内容" name="third">
            <div
              class="table_wrap content-edit"
              v-if="loadMap.has('third')"
              id="remarkContent"
              :style="{height:(t_plane+47) + 'px'}"
            >
              <!-- {{addBcontract.remarkContent}}  这里不能直接加上，html会没有转义-->
              <span v-html="addBcontract.remarkContent"></span>
            </div>
          </el-tab-pane>
          <el-tab-pane label="合同附件" name="fourth">
            <div class="table_wrap" v-if="loadMap.has('fourth')">
              <el-table
                v-loading="planeLoading"
                :height="t_plane+47"
                :data="dataTableAttench"
                border
                :header-cell-style="{backgroundColor:'#e5e9f3'}"
              >
                <el-table-column type="index" label="序号" fixed="left" min-width="50"></el-table-column>
                <!-- <el-table-column prop="contractCode" label="合同编码" min-width="150"></el-table-column> -->
                <el-table-column prop="attachName" label="附件名称" min-width="120"></el-table-column>
                <el-table-column prop="attachFormat" label="格式" min-width="120"></el-table-column>
                <el-table-column prop="attachSize" label="大小" show-overflow-tooltip min-width="200"></el-table-column>
                <el-table-column prop="attachCreateUserName" label="录入人" min-width="100"></el-table-column>
                <el-table-column prop="attachCreateTime" label="录入时间" min-width="150"></el-table-column>
                <el-table-column label="操作" fixed="right" min-width="80">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="downLoad(scope.row.attachData)">下载</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="异常备注" name="fifth">
            <div
              class="table_wrap content-edit"
              id="errContent"
              v-if="loadMap.has('fifth')"
              :style="{height:(t_plane+47) + 'px'}"
            >
              <span v-html="addBcontract.errContent"></span>
              <!-- {{addBcontract.errContent}} 这里不能直接加上，html会没有转义-->
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="checkIn('y')" type="primary" v-show="checkedFlag">审核通过</el-button>
        <el-button @click="checkIn('n')" type="danger" v-show="checkedFlag">审核不通过</el-button>
        <el-button @click="constractFormObj.caseModal = false">取消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="合同审核"
      :close-on-click-modal="false"
      :show-close="true"
      :visible.sync="addBcontract.checkcaseModal"
      width="600px"
    >
      <el-form
        :model="addBcontract.baseInfo"
        :rules="addBcontract.addCaseFormmRule"
        ref="addBcontractCheck"
        label-width="115px"
      >
        <p style="color:red">您是否确认本合同审核不通过？</p>
        <el-row :gutter="20">
          <el-col :md="24">
            <el-form-item label=" " label-width="16px" prop="checkRemark">
              <el-input
                type="textarea"
                :rows="5"
                placeholder="请填写不通过原因，充许输入100个字符"
                resize="none"
                maxlength="100"
                v-model.trim="addBcontract.baseInfo.checkRemark"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirm('y')" type="primary">确定</el-button>
        <el-button @click="confirm('c')">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { GET, PUT } from "http/custom.js"
export default {
  name: "CheckedContractForm",
  props: {
    constractFormObj: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      checkedFlag: true, //默认此按钮显示，从合同提醒页面查看合同明细时隐藏
      activeName: "second",
      t_plane: 200,
      loadMap: new Map(), //记录tab页是否打开过了
      planeTotal: "总计：",
      planeLoading: false,
      dataTableSub: [],
      dataTableAttench: [],
      addBcontract: {
        // 新增-添加子合同
        checkcaseModal: false,
        checked: false, // 自动
        payTypeChk: true, //收付类型 所对应的表单
        addCaseFormmRule: {
          // 验证
          checkRemark: [{ required: true, message: "请输入", trigger: "blur" }, { min: 1, max: 100, message: "充许输入100个字符", trigger: "blur" }]
        },
        baseInfo: {
          // 合同基本信息
          number: "", //合同编号
          errContent: "",
          remarkContent: "",
          constractType: "", //合同分类
          payType: "", //收付类型 下拉
          name: "", //合同名称
          money: "", //合同金额
          situation: "", //执行情况
          situationArr: [], //执行情况 下拉
          signDate: "", //签订日期
          currency: undefined, //币种
          signPeo: undefined, //签订人
          respPart: undefined, //责任部门
          payWay: undefined, //支付方式
          area: undefined, //区域
          startDate: "", //签订日期
          checkRemark: ""
        },
        dtailsInfo: {
          // 合同详情
          partyA: "", //合同甲方
          partyB: "", //合同乙方
          partyBArr: "", //合同乙方 下拉
          partyAname: "", //甲方负责人
          partyBname: "", //已方负责人
          billType: "", //发票类型
          taxRate: undefined, //税率
          taxation: undefined, //税金
          retention: undefined, //质保金
          retentionRate: undefined,
          call: false //开启提醒
        }
      }
    }
  },
  methods: {
    changePayType(val) {
      //合同分类
      if (val === 2) {
        this.addBcontract.payTypeChk = false
      } else {
        this.addBcontract.payTypeChk = true
      }
      console.log(val)
    },
    handleClick(tab) {
      //tab页切换 只有第一次页面切换时初始化数据
      //判断页面是否打开过
      if (!this.loadMap.has(tab.name)) {
        this.loadMap.set(tab.name, true)
        this.tabShow(tab.name)
      }
    },
    tabShow(tab) {
      switch (tab) {
        case "third":
          //document.querySelectorAll('#remarkContent')[0].innerHTML = this.addBcontract.remarkContent;
          break
        case "fifth":
          //document.querySelectorAll('#errContent')[0].innerHTML = this.addBcontract.errContent;
          break
        default:
          console.log("无匹配页！")
          return
      }
    },
    getDetails() {
      //获取合同详情
      //debugger
      GET(process.env.VUE_APP_DOMAIN_financial + "/contract", {
        contractCode: this.constractFormObj.num
      })
        .then(res => {
          this.addBcontract.baseInfo.number = res.data.contractCode //合同编号
          this.addBcontract.baseInfo.constractType = res.data.typeName //合同分类
          this.addBcontract.baseInfo.payType = res.data.chargeName //收付类型
          this.addBcontract.baseInfo.name = res.data.name //合同名称
          this.addBcontract.baseInfo.currency = res.data.currencyName //币种
          this.addBcontract.baseInfo.payWay = res.data.channelName //支付方式
          this.addBcontract.baseInfo.money = res.data.amount //合同金额
          this.addBcontract.baseInfo.signPeo = res.data.signerName //签订人
          this.addBcontract.baseInfo.signDate = res.data.signDate //签订日期
          this.addBcontract.baseInfo.situation = res.data.executionName //执行情况
          this.addBcontract.baseInfo.area = res.data.areaName //区域
          this.addBcontract.baseInfo.startDate = res.data.startTime //开始日期
          this.addBcontract.baseInfo.endDate = res.data.endTime //截止日期
          this.addBcontract.baseInfo.respPart = res.data.responsibilityDeptName //责任部门
          this.addBcontract.dtailsInfo.partyA = res.data.partyAUnitName //合同甲方
          this.addBcontract.dtailsInfo.partyB = res.data.partyBUnitName //合同乙方
          this.addBcontract.dtailsInfo.partyAname = res.data.partyAResponsibility //甲方负责人
          this.addBcontract.dtailsInfo.partyBname = res.data.partyBResponsibility //已方负责人
          this.addBcontract.dtailsInfo.taxRate = res.data.rateName //税率
          this.addBcontract.dtailsInfo.billType = res.data.invoiceTypeName //发票类型
          this.addBcontract.dtailsInfo.taxation = res.data.taxAmount //税金
          this.addBcontract.dtailsInfo.retentionRate = res.data.warrantyRateName //质保金比例
          this.addBcontract.dtailsInfo.deadLine = res.data.warrantyRemindDate //质保金到期提醒
          this.addBcontract.dtailsInfo.call = res.data.warrantyRemind === 0 ? false : true //质保金是否开启提醒：0不开启
          this.addBcontract.dtailsInfo.retention = res.data.warrantyAmount //质保金

          this.addBcontract.remarkContent = res.data.content
          this.addBcontract.errContent = res.data.unusualNotes

          //收付类型为其它时  隐藏不用的表单
          if (res.data.chargeType === "OTHER") {
            //其它
            this.addBcontract.payTypeChk = false
          } else {
            this.addBcontract.payTypeChk = true
          }

          //打开子合同 页签
          this.activeName = "second"
          this.loadMap.set(this.activeName, true)

          this.dataTableSub = res.data.contractSubs //子合同
          if (res.data.contractSubs.length > 0) {
            let count = 0
            if (res.data.contractSubs.length > 0) {
              res.data.contractSubs.forEach(item => {
                count += item.subAmount || 0
              })
            }
            this.planeTotal = "金额：" + (count <= 0 ? "--" : count.toFixed(2))
          }
          this.dataTableAttench = res.data.contractAttachments //附件
        })
        .catch(error => {
          console.log(error)
        })
    },
    downLoad(id) {
      window.location.href = process.env.VUE_APP_DOMAIN_download + "/oss/download?key=" + id + "&view=false"
    },
    checkIn(val) {
      //审核通过
      if (val === "y") {
        this.$msgBox
          .confirm("您是否确认本合同审核通过？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            PUT(process.env.VUE_APP_DOMAIN_financial + "/contractApproval", {
              contractCode: this.constractFormObj.num,
              approvalResult: "通过",
              approvalStatus: 2 //0待审批，1审批不通过，2审批通过
            })
              .then(res => {
                console.log(res, "通过")
                this.constractFormObj.caseModal = false
                this.$parent.searchForMain() //调用父组件方法
              })
              .catch(error => {
                console.error(error)
              })
          })
          .catch(() => {
            this.messagePopp("info", "已取消!")
          })
      } else {
        this.addBcontract.checkcaseModal = true
      }
    },
    confirm(val) {
      //不通过
      if (val === "y") {
        console.log("审批不通过字符数:", this.addBcontract.baseInfo.checkRemark.length)
        //确定时
        this.$refs.addBcontractCheck.validate(valid => {
          if (valid) {
            PUT(process.env.VUE_APP_DOMAIN_financial + "/contractApproval", {
              contractCode: this.constractFormObj.num,
              approvalResult: `不通过（${this.addBcontract.baseInfo.checkRemark}）`,
              approvalStatus: 1 //0待审批，1审批不通过，2审批通过
            })
              .then(res => {
                console.log(res, "不通过")
                this.constractFormObj.caseModal = false
                this.$parent.searchForMain() //调用父组件方法
                this.addBcontract.checkcaseModal = false
                this.$refs.addBcontractCheck.resetFields()
              })
              .catch(error => {
                console.error(error)
              })
          } else {
            this.messagePopp("warning", "提交失败，验证不通过")
          }
        })
      } else {
        //取消 时
        this.addBcontract.checkcaseModal = false
        this.$refs.addBcontractCheck.resetFields()
      }
    },
    messagePopp(type, msg) {
      //提示框
      this.$message({
        showClose: true,
        type: type,
        message: msg
      })
    },
    JScheckedFlag() {
      //隐藏审核按钮
      this.checkedFlag = false
    }
  }
}
</script>

<style lang="less">
.checked-contract-form {
  .width300 {
    width: 300px;
  }
  .el-tabs__header {
    margin-bottom: 0.3px !important;
  }
  #wangeditor .w-e-text-container {
    height: calc(100% - 31px) !important;
  }
  .content-edit {
    overflow-y: auto;
    border: 1px solid #e6e5e5;
    border-top: 0;
    padding: 5px;
  }
}
</style>
