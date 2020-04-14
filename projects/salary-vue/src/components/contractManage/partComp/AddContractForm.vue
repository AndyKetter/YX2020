<template>
  <div class="add-contract-form">
    <!-- 新增-添加合同 -->
    <el-dialog
      class="grayBg"
      :before-close="concel"
      :title="constractFormObj.title"
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
            <el-col :md="9">
              <el-form-item label="合同编号：" prop="number" class="number">
                <el-input
                  clearable
                  placeholder="请输入"
                  :disabled="constractFormObj.title === '编辑合同'"
                  v-model.trim="addBcontract.baseInfo.number"
                  :style="{width:constractFormObj.title === '编辑合同' ? '235px': '190px'}"
                ></el-input>&nbsp;
                <el-checkbox
                  v-model="addBcontract.checked"
                  v-if="constractFormObj.title !== '编辑合同'"
                  @change="checkBoxCk"
                >自动</el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :md="8">
              <el-form-item label="合同类型：" prop="constractType">
                <el-select
                  filterable
                  clearable
                  v-model.trim="addBcontract.baseInfo.constractType"
                  placeholder="请选择"
                  class="width155"
                  ref="constractType"
                >
                  <el-option
                    v-for="item in addBcontract.baseInfo.constractTypeArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>&nbsp;&nbsp;
                <el-button type="text" size="small" title="新增单位名称" @click="addDic('合同类型')">添加</el-button>
              </el-form-item>
            </el-col>
            <el-col :md="7">
              <el-form-item label="收付类型：" prop="payType">
                <el-select
                  filterable
                  clearable
                  v-model.trim="addBcontract.baseInfo.payType"
                  placeholder="请选择"
                  @change="changePayType"
                  ref="payType"
                >
                  <el-option
                    v-for="item in addBcontract.baseInfo.payTypeArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="24">
              <el-form-item label="合同名称：" prop="name">
                <el-input
                  clearable
                  placeholder="可输入100个字符"
                  v-model.trim="addBcontract.baseInfo.name"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :md="9" v-if="addBcontract.payTypeChk">
              <el-form-item label="币种：" prop="currency">
                <el-select
                  filterable
                  clearable
                  v-model.trim="addBcontract.baseInfo.currency"
                  placeholder="请选择"
                  style="width:190px"
                >
                  <el-option
                    v-for="item in addBcontract.baseInfo.currencyArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>&nbsp;&nbsp;&nbsp;&nbsp;
                <el-button type="text" size="small" title="新增币种" @click="addDic('币种')">添加</el-button>
              </el-form-item>
            </el-col>
            <el-col :md="8" v-if="addBcontract.payTypeChk">
              <el-form-item label="支付方式：" prop="payWay">
                <el-select
                  filterable
                  clearable
                  v-model.trim="addBcontract.baseInfo.payWay"
                  placeholder="请选择"
                  class="width155"
                >
                  <el-option
                    v-for="item in addBcontract.baseInfo.payWayArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>&nbsp;&nbsp;
                <el-button type="text" size="small" title="新增支付方式" @click="addDic('支付方式')">添加</el-button>
              </el-form-item>
            </el-col>
            <el-col :md="7" v-if="addBcontract.payTypeChk">
              <el-form-item label="合同金额：" prop="money">
                <el-input-number
                  v-model.trim="addBcontract.baseInfo.money"
                  controls-position="right"
                  :min="1"
                  :max="1000000000"
                  style="width: 175px;"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :md="9">
              <el-form-item label="签订人：" prop="signPeo">
                <el-select
                  filterable
                  clearable
                  v-model.trim="addBcontract.baseInfo.signPeo"
                  placeholder="请选择"
                  style="width: 190px;"
                >
                  <el-option
                    v-for="item in addBcontract.baseInfo.signPeoArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>&nbsp;&nbsp;&nbsp;&nbsp;
                <el-button type="text" size="small" title="新增签订人" @click="addDic('签订人')">添加</el-button>
              </el-form-item>
            </el-col>
            <el-col :md="8">
              <el-form-item label="签订日期：" prop="signDate">
                <el-date-picker
                  v-model.trim="addBcontract.baseInfo.signDate"
                  :editable="false"
                  :clearable="false"
                  style="width:210px"
                  value-format="yyyy-MM-dd"
                  placeholder="选择年月"
                  class="width230"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :md="7">
              <el-form-item label="执行情况：" prop="situation">
                <el-select
                  filterable
                  clearable
                  v-model.trim="addBcontract.baseInfo.situation"
                  placeholder="请选择"
                  class="width130"
                >
                  <el-option
                    v-for="item in addBcontract.baseInfo.situationArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>&nbsp;&nbsp;
                <el-button type="text" size="small" title="新增执行情况" @click="addDic('执行情况')">添加</el-button>
              </el-form-item>
            </el-col>

            <el-col :md="9">
              <el-form-item label="合同区域：" prop="area">
                <el-select
                  filterable
                  clearable
                  v-model.trim="addBcontract.baseInfo.area"
                  placeholder="请选择"
                  style="width: 190px;"
                >
                  <el-option
                    v-for="item in addBcontract.baseInfo.areaArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="8">
              <el-form-item label="开始日期：" prop="startDate">
                <el-date-picker
                  clearable
                  v-model.trim="addBcontract.baseInfo.startDate"
                  :picker-options="pickerOptionsStart"
                  :editable="false"
                  style="width: 210px;"
                  value-format="yyyy-MM-dd"
                  placeholder="选择年月"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :md="7">
              <el-form-item label="截止日期：" prop="endDate">
                <el-date-picker
                  clearable
                  v-model.trim="addBcontract.baseInfo.endDate"
                  :editable="false"
                  style=" width:175px"
                  value-format="yyyy-MM-dd"
                  placeholder="选择年月"
                  :picker-options="pickerOptionsEnd"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :md="24">
              <el-form-item label="责任部门：" prop="respPart">
                <el-select
                  filterable
                  clearable
                  v-model.trim="addBcontract.baseInfo.respPart"
                  placeholder="请选择"
                  style="width: 190px;"
                >
                  <el-option
                    v-for="item in addBcontract.baseInfo.respPartArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>&nbsp;&nbsp;&nbsp;&nbsp;
                <el-button type="text" size="small" title="新增责任部门" @click="addDic('责任部门')">添加</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <!-- 合同详情 -->
        <div class="whiteBox train-dialog" style="margin-top:20px">
          <p style="font-weight:bold">合同详情</p>
          <el-row style="margin-left: 30px;">
            <el-col :md="12">
              <el-form-item label="合同甲方：" prop="partyA">
                <el-select
                  filterable
                  clearable
                  v-model.trim="addBcontract.baseInfo.partyA"
                  placeholder="请选择"
                  @change="switchParty('合同甲方')"
                >
                  <el-option
                    v-for="item in addBcontract.baseInfo.partyAArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="合同乙方：" prop="partyB" label-width="140px">
                <el-select
                  filterable
                  clearable
                  v-model.trim="addBcontract.baseInfo.partyB"
                  placeholder="请选择"
                  @change="switchParty('合同乙方')"
                >
                  <el-option
                    v-for="item in addBcontract.baseInfo.partyBArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="甲方负责人：" prop="partyAname">
                <el-input
                  clearable
                  placeholder="请输入"
                  v-model.trim="addBcontract.baseInfo.partyAname"
                  style="width:215px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="已方负责人：" prop="partyBname" label-width="140px">
                <el-input
                  clearable
                  placeholder="请输入"
                  v-model.trim="addBcontract.baseInfo.partyBname"
                  style="width:215px"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-left: 30px;" v-if="addBcontract.payTypeChk">
            <el-col :md="12">
              <el-form-item label="发票类型：" prop="billType">
                <el-select
                  filterable
                  clearable
                  v-model.trim="addBcontract.baseInfo.billType"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in addBcontract.baseInfo.billTypeArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>&nbsp;&nbsp;
                <el-button type="text" size="small" title="新增发票类型" @click="addDic('发票类型')">添加</el-button>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="税率：" label-width="140px" prop="taxRate">
                <el-select
                  filterable
                  clearable
                  v-model.trim="addBcontract.baseInfo.taxRate"
                  ref="taxRateRef"
                  @change="calcTaxation"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in addBcontract.baseInfo.taxRateArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>&nbsp;&nbsp;
                <el-button type="text" size="small" title="新增税率" @click="addDic('税率')">添加</el-button>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="税金：" prop="taxation">
                <el-input-number
                  v-model.trim="addBcontract.baseInfo.taxation"
                  controls-position="right"
                  :min="1"
                  :max="1000000000"
                  style="width:215px"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="质保金比例：" label-width="140px" prop="retentionRate">
                <el-select
                  filterable
                  clearable
                  v-model.trim="addBcontract.baseInfo.retentionRate"
                  @change="calcRetentionRate"
                  placeholder="请选择"
                  style="width:215px"
                >
                  <el-option
                    v-for="item in addBcontract.baseInfo.retentionRateArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>&nbsp;&nbsp;
                <el-button type="text" size="small" title="新增质保金比例" @click="addDic('质保金比例')">添加</el-button>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="质保金：" prop="retention">
                <el-input-number
                  v-model.trim="addBcontract.baseInfo.retention"
                  controls-position="right"
                  :min="1"
                  :max="1000000000"
                  style="width:215px"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="质保金到期提醒：" label-width="140px" prop="deadLine">
                <el-date-picker
                  clearable
                  v-model.trim="addBcontract.baseInfo.deadLine"
                  style="width:215px"
                  :editable="false"
                  value-format="yyyy-MM-dd"
                  placeholder="选择年月"
                ></el-date-picker>&nbsp;&nbsp;
                <!-- v-if="constractFormObj.title === '增加合同'" -->
                <el-checkbox
                  v-model="addBcontract.baseInfo.call"
                  @change="open"
                  style="margin:0"
                >开启提醒</el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="submit" type="primary">确定保存</el-button>
        <el-button @click="concel">取消</el-button>
      </span>
    </el-dialog>

    <!-- 字典表单  updateForm:刷新父表格 -->
    <add-dic-form :dicFormObj="dicForm" ref="dicChild" @updateForm="updateForm"></add-dic-form>
  </div>
</template>

<script>
import Tools from "untils/index.js"
import AddDicForm from "./AddDicForm2"
import { GET, POST, PUT } from "http/custom.js"
export default {
  name: "AddContractForm",
  components: { AddDicForm },
  props: {
    constractFormObj: {
      type: Object,
      required: true
    },
    countFunc: {
      //更新提醒
      type: Function
    }
  },
  computed: {
    //禁用开始后的时间
    pickerOptionsEnd() {
      const pickerOptionsEnd = {
        disabledDate: time => {
          if (this.addBcontract.baseInfo.startDate) {
            return time.getTime() < new Date(this.addBcontract.baseInfo.startDate).getTime()
          }
        }
      }
      return pickerOptionsEnd
    },
    //禁用结束前的时间
    pickerOptionsStart() {
      const pickerOptionsStart = {
        disabledDate: time => {
          if (this.addBcontract.baseInfo.endDate) {
            return time.getTime() > new Date(this.addBcontract.baseInfo.endDate).getTime()
          }
        }
      }
      return pickerOptionsStart
    }
  },
  data() {
    return {
      dicForm: {
        //字典表单
        title: "",
        caseModal: false,
        typeCode: "",
        dataTablePlane: []
      },
      addBcontract: {
        // 新增-添加子合同
        //caseModal: false, //是否显示弹窗
        checked: false, // 自动
        payTypeChk: true, //收付类型 所对应的表单
        addCaseFormRule: {
          // 验证
          number: [{ required: true, message: "请输入", trigger: "blur" }],
          constractType: [{ required: true, message: "请选择", trigger: "change" }],
          payType: [{ required: true, message: "请选择", trigger: "change" }],
          name: [{ required: true, message: "请输入", trigger: "blur" }, { min: 0, max: 100, message: "长度应为100个字符", trigger: "blur" }],
          planeMoney: [{ required: true, message: "最大值可输入1000000000" }, { pattern: /\d+\.?\d{0,2}/, type: "number", message: "请输入数值", trigger: "blur" }],
          money: [{ required: true, message: "最大值可输入1000000000" }, { pattern: /\d+\.?\d{0,2}/, type: "number", message: "请输入数值", trigger: "blur" }],
          situation: [{ required: true, message: "请选择", trigger: "change" }],
          signDate: [{ required: true, message: "请选择", trigger: "change" }],
          currency: [{ required: true, message: "请选择", trigger: "change" }],
          partyA: [{ required: true, message: "请选择", trigger: "blur" }],
          partyB: [{ required: true, message: "请选择", trigger: "blur" }],
          signPeo: "",
          respPart: [{ required: true, message: "请输入", trigger: "blur" }],
          payWay: "",
          area: "",
          startDate: "",
          endDate: "",
          partyAname: "",
          partyBname: "",
          billType: "",
          taxRate: "",
          taxation: "",
          retention: "",
          retentionRate: "",
          deadLine: "",
          planDate: ""
        },
        baseInfo: {
          // 合同基本信息
          number: "", //合同编号
          constractType: undefined, //合同分类
          constractTypeArr: [], //合同分类 下拉
          payType: undefined, //收付类型 下拉
          payTypeArr: [], //收付类型 下拉
          name: "", //合同名称
          money: undefined, //合同金额
          situation: undefined, //执行情况
          situationArr: [], //执行情况 下拉
          signDate: Tools.getYMd(), //签订日期
          currency: undefined, //币种
          currencyArr: [], //币种 下拉
          signPeo: undefined, //签订人
          signPeoArr: [], //签订人 下拉
          respPart: undefined, //责任部门
          respPartArr: [], //责任部门 下拉
          payWay: undefined, //支付方式
          payWayArr: [], //支付方式 下拉
          area: undefined, //区域
          areaArr: [], //区域 下拉
          startDate: "", //开始日期
          endDate: "", //日期
          partyA: undefined, //合同甲方
          partyAArr: [], //合同甲方 下拉
          partyB: undefined, //合同乙方
          partyBArr: [], //合同乙方 下拉
          partyAname: "", //甲方负责人
          partyBname: "", //已方负责人
          billType: undefined, //发票类型
          billTypeArr: [], //发票类型   下拉
          taxRate: undefined, //税率
          taxRateArr: [], //税率 下拉
          taxation: undefined, //税金
          retention: undefined, //质保金
          retentionRate: undefined,
          retentionRateArr: [], //
          deadLine: "", //
          call: false, //开启提醒
          planDate: Tools.getYMd(),
          planeMoney: undefined
        }
      },
      dicObj: {
        合同类型: "FINA_CONTR_TYPE",
        币种: "FINA_CONTR_CURRENCY",
        签订人: "FINA_CONTR_SIGNER",
        责任部门: "FINA_CONTR_DEPARTMENT",
        支付方式: "FINA_CONTR_PAYMENT",
        发票类型: "FINA_CONTR_INVOICE",
        年度: "FINA_CONTR_YEAR",
        税率: "FINA_CONTR_RATE",
        质保金比例: "FINA_CONTR_WARRANTYRATE",
        单位分类: "FINA_CONTR_UNIT",
        执行情况: "FINA_CONTR_EXECUTION",
        合同区域: "FINA_CONTR_AREA",
        附件格式: "FINA_CONTR_ATTACHMENT",
        收付类型: "FINA_CONTR_RECEIPTANDPAYMENT",
        提醒天数: "FINA_CONTR_REMIND_DAYS"
      }
    }
  },
  methods: {
    changePayType(val) {
      //合同分类
      if (val === "OTHER") {
        //其它
        this.addBcontract.payTypeChk = false
      } else {
        this.addBcontract.payTypeChk = true
      }
      console.log(val, "合同分类")
    },
    reset(formName) {
      //清除表单
      this.$refs[formName].resetFields()
    },
    awaitWrap(promise) {
      return promise.then(data => [null, data]).catch(err => [err, null])
    },
    async queryForm() {
      //获取 表单下拉数据
      const url = process.env.VUE_APP_DOMAIN_financial + "/contractDictTypeList"
      const [dicErr, dicDt] = await this.awaitWrap(
        POST(url, {
          queryFlag: "ALL"
        })
      )
      //获取 合同甲方\合同乙方
      const [subErr, subDt] = await this.awaitWrap(GET(process.env.VUE_APP_DOMAIN_financial + "/contractUnits", {}))

      //公共生成下拉数据
      const getDic = (type, dt) => {
        let arr = []
        arr = dt.data.map(v => {
          arr = []
          if (v.typeValue === type && v.contractDictDataEntityList.length > 0) {
            //获取子节点
            arr = v.contractDictDataEntityList.map(list => {
              return {
                value: list.dataCode + "",
                label: list.dataValue,
                default: list.dataDefault || -1 //-1时没有这个字段
              }
            })
            this.getSelected({ name: type, arr: arr })
          }
        })
      }
      //获取 合同甲方\合同乙方
      if (subErr === null) {
        let unitArr = subDt.data.map(v => {
          return {
            value: v.unitCode,
            label: v.unitName,
            unitContact: v.unitContact
          }
        })
        this.getSelected({ name: "合同甲方", arr: unitArr })
        this.getSelected({ name: "合同乙方", arr: unitArr })
      }
      //获取 表单下拉数据
      if (dicErr === null && dicDt.data && dicDt.data[0].contractDictDataEntityList.length > 0) {
        const sltArr = ["合同类型", "收付类型", "币种", "支付方式", "签订人", "发票类型", "执行情况", "合同区域", "责任部门", "税率", "质保金比例"]
        sltArr.forEach(value => {
          getDic(value, dicDt)
        })
      }
      //详情
      if (this.constractFormObj.title === "编辑合同") {
        this.getDetails(this.constractFormObj.contractCode)
      } else {
        // 新增时的表单
        this.checkedForCode("AA-BBB-CCC")
        this.addBcontract.checked = false //自动
        this.addBcontract.baseInfo.call = false //开启提醒
        this.open()
      }
    },
    getSelected(obj) {
      //下拉框
      //设置默认值
      const setDefault = key => {
        obj.arr.forEach(item => {
          if (item.default === 1) {
            this.addBcontract.baseInfo[key] = item.value
          }
        })
      }
      switch (obj.name) {
        case "收付类型":
          this.addBcontract.baseInfo.payTypeArr = obj.arr
          setDefault("payType")
          break
        case "执行情况":
          this.addBcontract.baseInfo.situationArr = obj.arr
          setDefault("situation")
          break
        case "合同类型":
          this.addBcontract.baseInfo.constractTypeArr = obj.arr
          setDefault("constractType")
          break
        case "币种":
          this.addBcontract.baseInfo.currencyArr = obj.arr
          setDefault("currency")
          break
        case "签订人":
          this.addBcontract.baseInfo.signPeoArr = obj.arr
          setDefault("signPeo")
          break
        case "责任部门":
          this.addBcontract.baseInfo.respPartArr = obj.arr
          setDefault("respPart")
          break
        case "支付方式":
          this.addBcontract.baseInfo.payWayArr = obj.arr
          setDefault("payWay")
          break
        case "合同区域":
          this.addBcontract.baseInfo.areaArr = obj.arr
          break
        case "合同甲方":
          this.addBcontract.baseInfo.partyAArr = obj.arr
          break
        case "合同乙方":
          this.addBcontract.baseInfo.partyBArr = obj.arr
          break
        case "税率":
          this.addBcontract.baseInfo.taxRateArr = obj.arr
          setDefault("taxRate")
          break
        case "质保金比例":
          this.addBcontract.baseInfo.retentionRateArr = obj.arr
          setDefault("retentionRate")
          break
        case "发票类型":
          this.addBcontract.baseInfo.billTypeArr = obj.arr
          setDefault("billType")
          break
        default:
          console.log("无默认值")
          break
      }
    },
    addDic(val) {
      //字典
      const object = this.dicObj
      let typeCode = ""
      for (const key in object) {
        if (object.hasOwnProperty(key)) {
          if (val === key.toString()) {
            typeCode = object[key]
          }
        }
      }
      //数据字典详情
      this.dicForm.title = val
      this.dicForm.caseModal = true
      this.dicForm.typeCode = typeCode
      this.$refs.dicChild.getDicGrid(typeCode)
    },
    switchParty(val) {
      let obj = {}
      if (val === "合同甲方") {
        obj = this.addBcontract.baseInfo.partyAArr.find(v => {
          return this.addBcontract.baseInfo.partyA === v.value
        })
        this.addBcontract.baseInfo.partyAname = obj.unitContact
      } else {
        obj = this.addBcontract.baseInfo.partyBArr.find(v => {
          return this.addBcontract.baseInfo.partyB === v.value
        })
        this.addBcontract.baseInfo.partyBname = obj.unitContact
      }
    },
    getDetails(num) {
      //获取合同详情
      GET(process.env.VUE_APP_DOMAIN_financial + "/contract", {
        contractCode: num
      })
        .then(res => {
          if (!res.data) {
            return
          }
          this.addBcontract.baseInfo.number = res.data.contractCode //合同编号
          this.addBcontract.baseInfo.constractType = res.data.typeCode //合同分类
          this.addBcontract.baseInfo.payType = res.data.chargeType //收付类型
          this.addBcontract.baseInfo.name = res.data.name //合同名称
          this.addBcontract.baseInfo.currency = res.data.currencyCode //币种
          this.addBcontract.baseInfo.payWay = res.data.channelCode //支付方式
          this.addBcontract.baseInfo.money = res.data.amount || undefined //合同金额
          this.addBcontract.baseInfo.signPeo = res.data.signerCode //签订人
          this.addBcontract.baseInfo.signDate = res.data.signDate //签订日期
          this.addBcontract.baseInfo.situation = res.data.executionCode //执行情况
          this.addBcontract.baseInfo.area = res.data.areaCode //区域
          this.addBcontract.baseInfo.startDate = res.data.startTime //开始日期
          this.addBcontract.baseInfo.endDate = res.data.endTime //截止日期
          this.addBcontract.baseInfo.respPart = res.data.responsibilityDeptCode //责任部门
          this.addBcontract.baseInfo.partyA = res.data.partyAUnitCode //合同甲方
          this.addBcontract.baseInfo.partyB = res.data.partyBUnitCode //合同乙方
          this.addBcontract.baseInfo.partyAname = res.data.partyAResponsibility //甲方负责人
          this.addBcontract.baseInfo.partyBname = res.data.partyBResponsibility //已方负责人
          this.addBcontract.baseInfo.taxRate = res.data.rateCode //税率
          this.addBcontract.baseInfo.billType = res.data.invoiceTypeCode //发票类型
          this.addBcontract.baseInfo.taxation = res.data.taxAmount || undefined //税金
          this.addBcontract.baseInfo.retentionRate = res.data.warrantyRateCode //质保金比例
          this.addBcontract.baseInfo.deadLine = res.data.warrantyRemindDate //质保金到期提醒
          this.addBcontract.baseInfo.call = res.data.warrantyRemind === 0 ? false : true //质保金是否开启提醒：0不开启
          this.addBcontract.baseInfo.retention = res.data.warrantyAmount || undefined //质保金
          this.open()
          this.changePayType(res.data.chargeType)
        })
        .catch(error => {
          console.log(error)
        })
    },
    open() {
      //开启提醒
      if (this.addBcontract.baseInfo.call) {
        this.addBcontract.addCaseFormRule.retention = [{ required: true, message: "请输入数值" }, { pattern: /\d+\.?\d{0,2}/, type: "number", message: "请输入数值", trigger: "blur" }]
        this.addBcontract.addCaseFormRule.deadLine = [{ required: true, message: "请选择", trigger: "change" }]
      } else {
        this.addBcontract.addCaseFormRule.retention = ""
        this.addBcontract.addCaseFormRule.deadLine = ""
      }
    },
    submit() {
      //新增/修改验证表单
      let param = {
        contractId: this.constractFormObj.contractId,
        contractCode: this.addBcontract.baseInfo.number, //合同编号
        typeCode: this.addBcontract.baseInfo.constractType || "", //合同分类
        chargeType: this.addBcontract.baseInfo.payType || "", //收付类型
        name: this.addBcontract.baseInfo.name, //合同名称
        currencyCode: this.addBcontract.baseInfo.currency || "", //币种
        channelCode: this.addBcontract.baseInfo.payWay || "", //支付方式
        amount: this.addBcontract.baseInfo.money || "", //合同金额
        signerCode: this.addBcontract.baseInfo.signPeo || "", //签订人
        signDate: this.addBcontract.baseInfo.signDate, //签订日期
        executionCode: this.addBcontract.baseInfo.situation || "", //执行情况
        areaCode: this.addBcontract.baseInfo.area || "", //区域
        startTime: this.addBcontract.baseInfo.startDate || "", //开始日期
        endTime: this.addBcontract.baseInfo.endDate || "", //截止日期
        responsibilityDeptCode: this.addBcontract.baseInfo.respPart || "", //责任部门
        partyAUnitCode: this.addBcontract.baseInfo.partyA || "", //合同甲方
        partyBUnitCode: this.addBcontract.baseInfo.partyB || "", //合同乙方
        partyAResponsibility: this.addBcontract.baseInfo.partyAname, //甲方负责人
        partyBResponsibility: this.addBcontract.baseInfo.partyBname, //已方负责人
        rateCode: this.addBcontract.baseInfo.taxRate || "", //税率
        invoiceTypeCode: this.addBcontract.baseInfo.billType || "", //发票类型
        taxAmount: this.addBcontract.baseInfo.taxation, //税金
        warrantyRateCode: this.addBcontract.baseInfo.retentionRate || "", //质保金比例
        warrantyRemindDate: this.addBcontract.baseInfo.deadLine || "", //质保金到期提醒
        warrantyRemind: !this.addBcontract.baseInfo.call ? 0 : 1, //质保金是否开启提醒：0不开启
        warrantyAmount: this.addBcontract.baseInfo.retention //质保金
      }

      //是否满足收付款计划条件
      const retention = this.addBcontract.baseInfo.retention
      const money = this.addBcontract.baseInfo.money
      if (this.addBcontract.baseInfo.call || /\d+\.?\d{0,2}/.test(retention)) {
        if (Number.parseFloat(retention) > Number.parseFloat(money)) {
          this.messagePopp("warning", "质保金必须小于合同金额！")
          return
        }
      }

      this.$refs.addBcontract.validate(valid => {
        if (valid) {
          const url = process.env.VUE_APP_DOMAIN_financial + "/contract"
          if (this.constractFormObj.title === "增加合同") {
            //新增
            //增加合同
            param.approvalResult = "待审批"
            POST(url, param)
              .then(res => {
                this.messagePopp("success", "新增成功！")
                if (res.code === 0) {
                  this.countFunc() //更新提醒
                  this.$parent.searchForMain() //调用父组件方法
                  this.concel() //关闭弹窗

                  // if (this.addBcontract.baseInfo.call) {
                  //   this.addPlane(this.addBcontract.baseInfo.number); //后台程序里已经做过新增收付款计划
                  // } else {
                  //   this.$parent.searchForMain(); //调用父组件方法
                  //   this.concel() //关闭弹窗
                  // }
                }
              })
              .catch(error => {
                console.log(error)
              })
          } else {
            //修改
            PUT(url, param)
              .then(() => {
                this.$parent.searchForMain()
                this.messagePopp("success", "编辑成功！")
                this.concel() //关闭弹窗
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
    async addPlane(contractCode) {
      //新增收付款计划
      //收付款计划编号
      const [numErr, numDt] = await this.awaitWrap(
        POST(process.env.VUE_APP_DOMAIN_financial + "/idContract", {
          type: 3,
          contractCode: contractCode
        })
      )
      if (numErr !== null) {
        return
      }
      let param = {
        contractCode: contractCode, //主合同编号
        planAmount: this.addBcontract.baseInfo.retention, //计划金额
        planChannelCode: this.addBcontract.baseInfo.payWay || "", //支付方式
        planChargeCode: this.addBcontract.baseInfo.payType || "", //收付类型编号
        planCode: numDt.data || "", //收付款计划编号
        planDate: this.addBcontract.baseInfo.deadLine, //计划日期
        planRemark: "" //还款备注
      }
      const [planeErr, planeDt] = await this.awaitWrap(POST(process.env.VUE_APP_DOMAIN_financial + "/contractPlan", param))
      if (planeErr === null) {
        this.$parent.searchForMain() //调用父组件方法
        this.countFunc() //更新提醒
        this.concel() //关闭弹窗
        console.log(planeDt)
      }
    },
    async checkedForCode(code) {
      //自动生成 编号
      const [codeErr, codeDt] = await this.awaitWrap(GET(process.env.VUE_APP_DOMAIN_financial + "/generateNextIndex", {}))
      if (codeErr !== null) {
        this.messagePopp("warning", "获取合同编号失败！")
        return
      }
      const date = new Date()
      this.addBcontract.baseInfo.number = code + "-" + date.getFullYear() + "-" + codeDt.data
    },
    checkBoxCk() {
      // 自动生成编号勾选
      if (this.addBcontract.checked) {
        if (!this.addBcontract.baseInfo.constractType || this.addBcontract.baseInfo.constractType === "" || !this.addBcontract.baseInfo.partyA || this.addBcontract.baseInfo.partyA === "" || !this.addBcontract.baseInfo.respPart || this.addBcontract.baseInfo.respPart === "") {
          this.messagePopp("warning", "自动生成需先选择：合同分类、责任部门、合同甲方")
          this.addBcontract.checked = false
          return
        }
        const strCode = this.addBcontract.baseInfo.constractType + "-" + this.addBcontract.baseInfo.partyA + "-" + this.addBcontract.baseInfo.respPart
        this.checkedForCode(strCode)
      }
    },
    calcMoney(obj, money) {
      let calcmoney = undefined
      if (!obj || !obj.label.includes("%") || !money || !/\d+\.?\d{0,2}/.test(money)) {
        return calcmoney
      }
      let rate = Number.parseFloat(obj.label.replace("%", "")) / 100
      calcmoney = (rate * Number.parseFloat(money)).toFixed(2)
      return calcmoney
    },
    calcTaxation() {
      //计算税金
      let taxRate = this.addBcontract.baseInfo.taxRate
      const obj = this.addBcontract.baseInfo.taxRateArr.find(v => {
        return v.value === taxRate
      })
      const money = this.addBcontract.baseInfo.money
      this.addBcontract.baseInfo.taxation = this.calcMoney(obj, money)
    },
    calcRetentionRate() {
      //质保金
      let retentionRate = this.addBcontract.baseInfo.retentionRate
      const obj = this.addBcontract.baseInfo.retentionRateArr.find(v => {
        return v.value === retentionRate
      })
      const money = this.addBcontract.baseInfo.money
      this.addBcontract.baseInfo.retention = this.calcMoney(obj, money)
    },
    concel() {
      this.constractFormObj.caseModal = false //关闭弹窗
      this.reset("addBcontract") //清空表单
      this.changePayType("") //隐藏的表单还原
    },
    updateForm() {
      this.queryForm()
      this.tabSearch()
    },
    tabSearch() {
      //调用父组件方法 刷新 树形
      this.$parent.queryTree()
    },
    editDictionary() {},
    //提示框
    messagePopp(type, msg) {
      this.$message({
        showClose: true,
        type: type,
        message: msg
      })
    }
  }
}
</script>

<style lang="less" >
.add-contract-form {
  .number label {
    margin: 0;
  }
}

// .add-contract-form .el-dialog__wrapper {
//   overflow: hidden !important;
// }
</style>
