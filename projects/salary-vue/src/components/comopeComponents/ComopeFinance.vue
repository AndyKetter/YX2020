<template>
  <div class="comope_finance">
    <div class="pull-left">
      <el-form :inline="true" class="mar-no" label-position="right">
        <el-form-item label="统计年月">
          <el-date-picker v-model="batch" :editable="false" :clearable="false" type="month" @change="changeBatch" value-format="yyyy-MM" class="width110" placeholder="选择年月"></el-date-picker>
        </el-form-item>
        <el-form-item label="数据源" v-if="isRoot(rootCode['查询-数据源'])">
          <el-select placeholder="请选择数据源" v-model="dataOrigin" class="width155" filterable @change="JS_search">
            <el-option v-for="item in dataList" :key="item.id" :label="item.categoryTypeName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务类型" v-if="isRoot(rootCode['查询-业务类型'])">
          <el-select placeholder="请选择业务类型" v-model="businessType" class="width155" filterable clearable>
            <el-option v-for="item in businessList" :key="item.id" :label="item.bizType" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="JS_search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="pull-right">
      <el-dropdown trigger="click" @command="handleCommand">
        <el-button type="primary">
          更多操作<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="a" class="cloud-downloadBtn" v-if="isRoot(rootCode['操作-导出'])">
            <i></i>&nbsp;导出
          </el-dropdown-item>
          <el-dropdown-item command="b" v-if="isRoot(rootCode['操作-导入']) && !isShowTable('数据汇总')" class="cloud-uploadBtn" divided>
            <i></i>&nbsp;导入
          </el-dropdown-item>
          <el-dropdown-item command="c" v-if="isRoot(rootCode['操作-批量删除']) && !isShowTable('数据汇总')" divided><i class="el-icon-delete"></i>批量删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button size="small" v-if="(isShowTable('数据汇总') && isRoot(rootCode['系统计算']))" @click="sysCalcShow" type="danger" style="margin-left:10px">系统计算</el-button>
    </div>
    <div class="table_wrap">
      <!-- 财务部 -->
      <el-table v-loading="loading" v-if="(isShowTable('财务部') && isRoot(rootCode['查询-数据源-财务部']))" :key="1" :height="dataListObj.dataInfo.t_height" @selection-change="handleSelectionChange" :data="tableData" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序号" min-width="50"></el-table-column>
        <el-table-column prop="batch" label="统计年月" min-width="80"></el-table-column>
        <el-table-column prop="caseName" label="业务类型" min-width="100"></el-table-column>
        <el-table-column prop="clientBank" label="委托方（银行）" min-width="150"></el-table-column>
        <el-table-column prop="trusteeSupplier" label="受托方（供应商）" min-width="150"></el-table-column>
        <el-table-column prop="returnedMoney" label="回款" min-width="100"></el-table-column>
        <el-table-column prop="income" label="收入" min-width="100"></el-table-column>
        <el-table-column prop="laborCost" label="人工成本" min-width="100"></el-table-column>
        <el-table-column prop="otherCost" label="其他成本" min-width="100"></el-table-column>
        <el-table-column prop="profit" label="利润" min-width="100"></el-table-column>
        <el-table-column prop="profitRate" label="利润率" min-width="100"></el-table-column>
        <el-table-column prop="remark" label="备注" show-overflow-tooltip="" min-width="200"></el-table-column>
        <el-table-column prop="leadingCadre" label="财务部负责人" min-width="150"></el-table-column>
        <el-table-column label="操作人" min-width="150">
          <template slot-scope="scope">
            <el-popover v-show="scope.row.createUserName" trigger="click" placement="top" width="450" @show="getUserInfoByUser(scope.row.createUserId)">
              <!-- S -->
              <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
              <!-- E -->
              <div slot="reference" class="name-wrapper">
                <el-button size="mini">{{scope.row.createUserName}}</el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="操作时间" min-width="150"></el-table-column>
        <el-table-column label="操作" fixed="right" min-width="100" v-if="isRoot(rootCode['操作-删除'])">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="deleteThis(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 人事部数据 -->
      <el-table v-loading="loading" v-else-if="(isShowTable('人事部数据') && isRoot(rootCode['查询-数据源-人事部']))" :key="2" @selection-change="handleSelectionChange" :height="dataListObj.dataInfo.t_height" :data="tableData" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序号" min-width="50"></el-table-column>
        <el-table-column prop="batch" label="统计年月" min-width="80"></el-table-column>
        <el-table-column prop="caseName" label="业务类型" min-width="100"></el-table-column>
        <el-table-column prop="monthFunctionStaffs" label="全月在职职能人数" min-width="150"></el-table-column>
        <el-table-column prop="monthBusinessStaffs" label="全月在职业务正式员工人数" min-width="150"></el-table-column>
        <el-table-column prop="monthProbationStaffs" label="全月在职业务试用员工人数" min-width="150"></el-table-column>
        <el-table-column prop="terminalFunctionStaffs" label="期末职能人数" min-width="150"></el-table-column>
        <el-table-column prop="terminalBusinessStaffs" label="期末业务正式员工人数" min-width="150"></el-table-column>
        <el-table-column prop="terminalProbationStaffs" label="期末业务试用员工人数" min-width="150"></el-table-column>
        <el-table-column prop="functionTurnoverRate" label="职能员工离职率" min-width="150"></el-table-column>
        <el-table-column prop="businessTurnoverRate" label="业务员工离职率" min-width="150"></el-table-column>
        <el-table-column prop="remark" label="备注" show-overflow-tooltip min-width="200"></el-table-column>
        <el-table-column prop="leadingCadre" label="人事部负责人" min-width="150"></el-table-column>
        <el-table-column label="操作人" min-width="150">
          <template slot-scope="scope">
            <el-popover v-show="scope.row.createUserName" trigger="click" placement="top" width="450" @show="getUserInfoByUser(scope.row.createUser)">
              <!-- S -->
              <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
              <!-- E -->
              <div slot="reference" class="name-wrapper">
                <el-button size="mini">{{scope.row.createUserName}}</el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="操作时间" min-width="150"></el-table-column>
        <el-table-column label="操作" fixed="right" min-width="100" v-if="isRoot(rootCode['操作-删除'])">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="deleteThis(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 数据汇总 -->
      <el-table v-loading="loading" v-else-if="(isShowTable('数据汇总') && isRoot(rootCode['查询-数据源-数据汇总']))" :key="3" :height="dataListObj.dataInfo.t_height" :data="tableData" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
        <el-table-column type="index" label="序号" min-width="50"></el-table-column>
        <el-table-column prop="batch" label="统计年月" min-width="80"></el-table-column>
        <el-table-column prop="caseName" label="业务类型" min-width="100"></el-table-column>
        <el-table-column prop="percapitaReturnedMoney" label="人均回款" min-width="100"></el-table-column>
        <el-table-column prop="percapitaIncome" label="人均收入" min-width="100"></el-table-column>
        <el-table-column prop="percapitaCost" label="人均成本" min-width="100"></el-table-column>
        <el-table-column prop="percapitaProfit" label="人均利润" min-width="100"></el-table-column>
        <el-table-column prop="percapitaProfitRate" label="人均利润率" min-width="100"></el-table-column>
        <el-table-column prop="remark" label="备注" show-overflow-tooltip="" min-width="150"></el-table-column>
        <el-table-column label="操作人" min-width="150">
          <template slot-scope="scope">
            <el-popover v-show="scope.row.createUserName" trigger="click" placement="top" width="450" @show="getUserInfoByUser(scope.row.createUser)">
              <!-- S -->
              <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
              <!-- E -->
              <div slot="reference" class="name-wrapper">
                <el-button size="mini">{{scope.row.createUserName}}</el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="操作时间" min-width="150"></el-table-column>
      </el-table>

      <!-- 分页 有数据源时显示分页-->
      <div id="pagination" v-if="dataList.length >= 1">
        <el-pagination background :current-page="configPageObj.current" @size-change="handleSizeChange" @current-change="handlecurrentChange" :page-sizes="[10,15,20,30,40]" :page-size="configPageObj.size" layout="total,sizes,prev,pager,next,jumper" :total="configPageObj.total"></el-pagination>
      </div>

      <!-- 导入弹框 -->
      <el-dialog title="导入" :close-on-click-modal="false" :show-close="false" :visible.sync="exportModal" width="580px">
        <el-form label-width="100px" ref="exportExform">
          <el-row>
            <el-col :md="24">
              <el-form-item label="导入年月" label-width="80px">
                <el-date-picker v-model="importBatch" style="width:460px" :editable="false" :clearable="false" type="month" value-format="yyyy-MM" placeholder="选择年月">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :md="24">
              <el-form-item label="数据源" label-width="80px">
                <el-select placeholder="请选择" v-model="exportData" style="width:460px" filterable>
                  <el-option v-for="item in dataListForImport" :key="item.id" :label="item.categoryTypeName" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="24" class="clearfix mar-ver">
              <el-form-item label="数据导入" label-width="80px">
                <el-upload class="upload-demo" :multiple="false" :limit="1" ref="importRef" :data="{batch:importBatch,source:exportData}" :auto-upload="false" :action="uploadActionUrl" :on-success="handleSuccess" :headers="headers" :before-remove="beforeRemove" :before-upload="beforeUpload">
                  <el-button slot="trigger" size="mediumn" class="cloud-uploadBtn">
                    <i></i>&nbsp;导入数据
                  </el-button>&nbsp;&nbsp;
                  <el-button style="margin-left: 10px;" size="mediumn" type="success" @click="submitUpload">确认导入</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :md="16">
              <div style="padding-left:10px;line-height:30px;color:red;margin-top:10px;">注：导入成功后，会立刻覆盖当前版本</div>
            </el-col>
            <el-col :md="8" class="clearfix mar-ver">
              <div class="fileBox" style="margin-top:-10px;margin-right:-10px;text-align:right;">
                <span class="filename excel">
                  <el-button type="text" class="underlineTxt" @click.stop="JS_download">公用模板下载</el-button>
                </span>
              </div>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="exportModal = false">取消</el-button>
        </span>
      </el-dialog>

      <!-- 导入进度条信息 -->
      <el-dialog title="导入信息" :show-close="false" :close-on-click-modal="false" :visible.sync="importProcessInfoDialog" width="600px">
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

      <!-- 导出-->
      <el-dialog title="导出" :close-on-click-modal="false" :show-close="false" :visible.sync="exportDialog" width="600px">
        <div>
          <el-form label-width="150px">
            <el-row>
              <el-col :md="12">
                <el-form-item label="导出年月" label-width="85px">
                  <el-date-picker v-model="exportBatch" :clearable="false" class="width155" type="month" value-format="yyyy-MM" placeholder="选择年月">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item label="数据源" label-width="125px">
                  <el-select placeholder="请选择" v-model="exportData" class="width155" filterable>
                    <el-option v-for="item in dataList" :key="item.id" :label="item.categoryTypeName" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
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

      <!-- 系统计算-->
      <el-dialog title="系统计算" :close-on-click-modal="false" :visible.sync="sysCalc" width="500px">
        <div>
          <el-form label-width="150px">
            <el-row>
              <el-col :md="15">
                <el-form-item label="统计年月" label-width="85px">
                  <el-date-picker v-model="sysCalcBatch" :clearable="false" class="width155" type="month" value-format="yyyy-MM" placeholder="选择年月">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :md="9">
                <el-form-item label="" label-width="0">
                  <el-button type="primary" @click="JS_sysCalc" style="display: inline-block; margin-right:10px">立即计算</el-button>
                  <el-button @click="sysCalc = false" style="display:inline-block;">取消</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>

      </el-dialog>

      <!-- 批量删除温馨提示弹框 -->
      <el-dialog title="温馨提示" :close-on-click-modal="false" :visible.sync="deleAllWarn" width="450px">
        <el-row>
          <el-col :md="20" :offset="3" class="warnIcoBg">
            <h3>您正在进行删除操作，为了确定您的操作无误，请再次确定是否继续？</h3>
            <span style="color:red">注：删除后不可恢复！</span>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleAllWarn = false">取消</el-button>
          <el-button type="primary" @click="doAllDeleteSave">确定</el-button>
        </span>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import Tools from "../../untils/index.js"
import { GET, POST, DELETE } from "http/custom.js"

export default {
  name: "comope_finance",
  components: {},
  props: {
    dataListObj: {
      type: Object,
      required: true,
      default: () => {
        return {
          dataInfo: {} //接收到父组件中的 dataObj ，里面会有多个数组
        };
      }
    }
  },
  data() {
    const uploadActionUrl = process.env.VUE_APP_DOMAIN_quote + "/importExcel"; //导入action  线上
    let yd = Tools.getPYd() //获取当前年月 格式为 2019-07
    return {
      batch: yd, //年月
      importBatch: yd, //导入年月
      exportBatch: yd, //导出年月
      sysCalcBatch: yd, //系统计算年月
      loading: false, //表格加载
      updateDialog: false, //修改窗
      dataOrigin: undefined, //数据源
      businessType: undefined, //业务类型
      exportModal: false,//导入窗
      exportDialog: false,//导出窗
      exportData: undefined,//导入数据源
      exportVal: 1,//导出方式
      sysCalc: false, //系统计算弹窗
      uploadActionUrl, // 导入url
      headers: { //上传请求头
        "x-user-token": localStorage.getItem("token") //设置上传数据文件excel的token
      },
      deleAllWarn: false, // 批量删除弹窗
      multipleSelection: [],//已选择行数组
      personalInfoData: {}, //姓名popover弹窗数据
      //进度条相关参数
      importProcessInfoDialog: false,//导入进度弹框
      importError: false,// 导入错误时呈现的进度 
      downloadErrorEveProcess: false, //获取错误下载key
      loadErrorExcel: false,
      downloadErrorKey: false,
      progressBackBtn: false, //返回按钮
      progressPercentAge: 0, //进度百分比
      uploadProcessInfo: {
        total: '',//总条数
        handler: '',//已处理条数
        successful: '',//处理成功条数
        failures: '', //处理失败条数
        finish: false,//是否处理完成
        dealAllTime: '',//总耗时
      },
      //oa系统中配置的权限 id
      rootCode: {
        '查询-数据源': '8806970645cd4aa4818beb076d549ec6',
        '查询-数据源-财务部': '9f82492b9cd341a5bdd051c8dc222e98',
        '查询-数据源-数据汇总': '342e3f315d624cb884d16080c232e36d',
        '查询-数据源-人事部': '859fdb9eb66a4cbc8a4b12ca2b79547a',
        '查询-业务类型': '6d196cb4216a4ca0bbea77e25c2dc07b',
        '操作-导入': '2a607b2935a44bebb23a86805de345c6',
        '操作-导出': 'e894eb4f498d4ffbbf4241378f634fff',
        '操作-删除': 'f493e7fa2fa94348b6fa6233dce781e3',
        '操作-批量删除': '0f537ad88ce34f77b1b45d69fc91ff81',
        '系统计算': '0e86bb04f25b4291b034ff3838633bec'
      },
      configPageObj: {
        size: 15, //每页显示记录条数
        current: 1, //当前页码
        total: 0, //总记录数据
      },
      exportType: [ //导出方式
        { value: 1, label: "保存至本地（需要等待数秒至数分钟）" },
        { value: 2, label: "发送至本人内网邮箱" }
      ],
      tableData: [], //表格数据
      dataList: [],//数据源
      dataListForImport: [],//导入的数据源
      businessList: [],//业务类型
    };
  },
  created() {
    this.getDataAndBus();
  },
  computed: {
    isShowTable() { //呈现数据源对应的表格
      return (name) => {
        let list = this.dataList;
        if (list.length <= 0) { //数据源不存在时默认显示  财务部表格
          return name === '财务部' ? true : false;
        }

        const item = list.find(v => { //找到数据源id对应的 obj
          return v.id === this.dataOrigin;
        });

        if (item) { //id对应的数据源选中后返回  
          return item.categoryTypeName.includes(name) ? true : false;
        } else {
          return false;
        }
      }
    },
    isRoot() { //通过老oa配置的id,判断当前 用户是否有对应的权限 
      return (idCode) => {
        return Tools.includes(this.$store.state.userActionAll, idCode);
      }
    }
  },
  methods: {
    messagePopp(type, msg) {    //提示框
      this.$message({
        showClose: true,
        type: type,
        message: msg
      });
    },
    //根据员工编号获取个人信息
    getUserInfoAdjust(num) {
      GET(process.env.VUE_APP_DOMAIN_personnel + "/userInfo", { aid: num })
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
    handleCommand(command) { //更多操作下拉框     
      switch (command) {
        case "a":
          this.exportDialog = true;//导出
          this.exportData = this.dataOrigin; //导出时与查询数据源同步           
          break;
        case "b":
          this.exportModal = true; //导入
          this.exportData = this.dataOrigin; //导入时与查询数据源同步         
          break;
        case "c":
          this.deleAllWarn = true; //批量删除
          break;
        default:
          console.log("default");
          return;
      }
    },
    getBusinessType() { //查询业务类型
      let searchObj = {
        categoryType: 1,
        dataOrigin: 2,
      };
      POST(process.env.VUE_APP_DOMAIN_personnel + "/auth/quote/biztype/list", searchObj).then(res => {
        this.businessList = res.data;

      }).catch(error => {
        console.log(error);
      });
    },
    async getDataAndBus() {
      // 抽离成公共方法 方便捕获异常
      const awaitWrap = (promise) => {
        return promise
          .then(data => [null, data])
          .catch(err => [err, null])
      }

      //查询数据源
      let searchObj = {
        categoryType: 2,
        parentId: 2,
      };
      const [err, resDtType] = await awaitWrap(POST(process.env.VUE_APP_DOMAIN_quote + '/quotecategory/list', searchObj))

      //数据源接口成功时
      if (err === null) {
        this.dataList = resDtType.data;
        let lng = this.dataList.length, item = 0;
        //是否有数据源
        if (lng >= 1) {
          item = this.dataList[0];//默认显示第一个 
          this.dataOrigin = item.id // 搜索下拉中当前用户对应的 id
          this.exportData = item.id //导入/导出           

          //导入的弹窗中的数据源不呈现  数据汇总
          this.dataListForImport = [];
          resDtType.data.forEach(v => {
            if (v.categoryTypeName !== '数据汇总') {
              this.dataListForImport.push(v);
            }
          });
        }
      }
      console.log('数据源', this.dataList);

      //查询业务类型
      this.getCaseTypeList();

      //搜索
      this.JS_search();
    },
    getCaseTypeList() {//查询业务类型
      GET(process.env.VUE_APP_DOMAIN_quote + '/market/caseTypeList', { batch: this.batch }).then((res) => {
        this.businessList = [];
        let object = res.data;
        if (object) {
          for (const key in object) {
            if (object.hasOwnProperty(key)) {
              this.businessList.push({
                id: key,
                bizType: object[key]
              });
            }
          }
        }
      }).catch((err) => {
        console.log(err);
      });
    },
    JS_search() { //搜索
      this.configPageObj.current = 1;
      this.search();
    },
    search() {
      let searchObj = {
        batch: this.batch,
        bizType: this.businessType || "", //业务类型
        source: this.dataOrigin || "", //数据源
        current: this.configPageObj.current || "",
        size: this.configPageObj.size || "",
      };
      this.loading = true;
      POST(`${process.env.VUE_APP_DOMAIN_quote}/list`, searchObj).then(res => {
        this.loading = false;
        this.tableData = res.data.records; //set表格的值
        this.configPageObj.size = res.data.size; //每页显示记录条数
        this.configPageObj.current = res.data.current; // set当前页
        this.configPageObj.total = res.data.total; //总记录数据
      }).catch(error => {
        console.log(error);
      });
    },
    deleteThis(id) { //行内删除     
      this.$msgBox.confirm("你确定要删除该条数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        DELETE(process.env.VUE_APP_DOMAIN_quote + "/delete", {
          ids: id,
          source: this.dataOrigin, //数据源
        }).then(() => {
          this.JS_search();
        }).catch(error => {
          console.log(error);
        });
      }).catch(() => {
        this.messagePopp("info", "已取消删除!");
      });
    },
    doAllDeleteSave() {//批量删除
      let selectItem = this.multipleSelection;
      if (selectItem.length <= 0) {
        this.messagePopp("warning", "请勾选要批量删除的数据!");
        this.deleAllWarn = false; //关闭弹框
      } else {
        let ids = [];
        selectItem.forEach(element => {
          ids.push(element.id)
        })
        ids = ids.join(',') //转换成以逗号隔开的字符串
        DELETE(process.env.VUE_APP_DOMAIN_quote + '/delete', {
          ids: ids,
          source: this.dataOrigin, //业务类型
        }).then(res => {
          this.messagePopp("success", "批量删除成功!");
          this.deleAllWarn = false //关闭弹框
          this.JS_search() //刷新表格，重新获取数据
        }).catch(error => {
          console.log(error)
        })
      }
    },
    handleSelectionChange(val) {//当表格选择项发生变化时会触发该事件
      this.multipleSelection = val;
      console.log('选中的行', val);
    },
    handlecurrentChange(val) { //当前页
      this.configPageObj.current = val;
      this.search();
    },
    handleSizeChange(val) {//下拉设置页数
      this.configPageObj.size = val;
      this.search();
    },
    exportToWary() { //导出      
      // 导出方式   1直接下载  2发到邮箱
      let ul = process.env.VUE_APP_DOMAIN_quote + '/exportExcel';
      console.log('111', this.exportData);
      if (this.exportVal === 1) {//导出方式
        this.messagePopp("success", "已经导出至本地！");
        //下载拼接 已经导出至本地！
        let urls = `${ul}?token=${localStorage.getItem("token")}&exportType=${this.exportVal}&source=${this.exportData}&batch=${this.exportBatch}`;
        window.location.href = urls;
      } else {
        let params = {
          batch: this.exportBatch,
          source: this.exportData,
          exportType: this.exportVal,
        };
        //导出至邮箱   这个接口没有返回值，后台要求直接提示
        GET(ul, params).then(() => {
          this.messagePopp("success", "已经导入至您的邮箱！");
        }).catch(error => {
          console.log(error);
        });
      }

      // 关闭导出弹窗
      this.exportDialog = false;
    },
    beforeRemove(file) {//导入 删除文件之前的钩子      
      return this.$msgBox.confirm(`确定移除 ${file.name}？`);
    },
    beforeUpload(file) { //导入 上传文件之前的钩子     
      //截取文件后缀
      let testFileType = file.name.substring(file.name.lastIndexOf('.') + 1);
      if (testFileType === 'xls' || testFileType === 'xlsx') {
        return true;
      }

      //不是excel文件格式   为 false 时自动触发 beforeRemove
      this.$message.error("上传数据文件只能是 xlsx/xls 格式!")
      return false;
    },
    submitUpload() {//导入 确认导入
      if (this.$refs.importRef.uploadFiles.length === 0) {
        return this.messagePopp("warning", "请选取文件！");
      } else {
        this.$refs.importRef.submit() //手动上传
      }
    },
    JS_download() { // 导入 下载模板
      console.log(this.exportData, this.dataList);
      let ul = process.env.VUE_APP_DOMAIN_quote + '/exportExcel';
      let urls = `${ul}?token=${localStorage.getItem("token")}&source=${this.exportData}&exportType=1&batch=${this.importBatch}&exportModel=2`;
      window.location.href = urls;
    },
    handleSuccess(res) { //上传文件接口成功回调
      this.exportModal = false;  //关闭导入弹框

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
      this.$refs.importRef.clearFiles(); //清除上传的文件
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
    unloadErrorLink() {//导入错误模板下载
      console.log('downloadErrorKey', this.downloadErrorKey);
      let url = process.env.VUE_APP_DOMAIN_download + '/oss/download?key=' + this.downloadErrorKey + '&token=' + localStorage.getItem("token") + "&name=" + encodeURI("导入失败明细") + ".xlsx";
      window.location.href = url;
    },
    importProgress() {//进度弹框关闭
      this.importProcessInfoDialog = false; //关闭进度弹框
      this.progressPercentAge = 0; //进度条清空为0
      this.progressBackBtn = false; //隐藏返回按钮
      this.loadErrorExcel = false; // 隐藏下载失败链接
    },
    changeBatch() { //通过年月改变业务类型
      this.businessType = '';
      this.getCaseTypeList();
    },
    sysCalcShow() { //呈现系统计算弹窗
      this.sysCalcBatch = Tools.getPYd();
      this.sysCalc = true
    },
    JS_sysCalc() { //系统计算
      const allLoading = this.$loading({//锁定页面loading
        lock: true,
        text: '正在计算数据，请稍等片刻...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.sysCalc = false
      GET(process.env.VUE_APP_DOMAIN_quote + "/finance/calculate", {
        batch: this.sysCalcBatch
      }).then(() => {
        allLoading.close(); //关闭loading
        this.JS_search();
      }).catch(error => {
        allLoading.close(); //关闭loading
        this.JS_search();
        console.log(error);
      });


    }
  },
};
</script>

