<template>
  <div class="comope_subsidiary">
    <div class="pull-left">
      <el-form :inline="true" class="mar-no" label-position="right">
        <el-form-item label="名称" v-if="isRoot(rootCode['查询-名称'])">
          <el-input clearable @keyup.enter.native="JS_search" v-model.trim="companyName" placeholder="请输入" class="width155"></el-input>
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
          <el-dropdown-item command="a" class="cloud-uploadBtn" v-if="isRoot(rootCode['操作-导出'])">
            <i></i>&nbsp;导出
          </el-dropdown-item>
          <el-dropdown-item command="b" class="cloud-downloadBtn" v-if="isRoot(rootCode['操作-导入'])" divided>
            <i></i>&nbsp;导入
          </el-dropdown-item>
          <el-dropdown-item command="c" v-if="isRoot(rootCode['操作-批量删除'])" divided><i class="el-icon-delete"></i>批量删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="table_wrap">
      <el-table v-loading="loading" :data="tableData" :height="dataListObj.dataInfo.t_height" @selection-change="handleSelectionChange" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序号" width="55"></el-table-column>
        <el-table-column prop="city" label="城市" min-width="80"></el-table-column>
        <el-table-column prop="corpName" label="名称" min-width="200"></el-table-column>
        <el-table-column prop="corpType" label="公司类型" min-width="150"></el-table-column>
        <el-table-column prop="leadingCadre" label="负责人" min-width="150"></el-table-column>
        <el-table-column prop="manageRange" label="经营范围" show-overflow-tooltip min-width="200"></el-table-column>
        <el-table-column prop="isFitBusiness" label="是否符合工商要求" min-width="150"></el-table-column>
        <el-table-column prop="registerAddress" label="注册地址" show-overflow-tooltip min-width="200"></el-table-column>
        <el-table-column prop="realityManageAddress" label="分公司实际经营地址" show-overflow-tooltip min-width="200"></el-table-column>
        <el-table-column prop="isRegisterFitReality" label="注册地址与实际地址是否相符" min-width="150"></el-table-column>
        <el-table-column prop="foundTime" label="成立时间" min-width="150"></el-table-column>
        <el-table-column prop="registerCapital" label="注册资本" min-width="150"></el-table-column>
        <el-table-column prop="bankAccount" label="账号" min-width="200"></el-table-column>
        <el-table-column prop="bankName" label="开户行" show-overflow-tooltip min-width="200"></el-table-column>
        <el-table-column prop="hireArea" label="租赁面积" min-width="150"></el-table-column>
        <el-table-column prop="broker" label="综合对接人" min-width="150"></el-table-column>
        <el-table-column prop="brokerPhone" label="综合对接人电话号码" min-width="150"></el-table-column>
        <el-table-column prop="businessManager" label="业务总经理" min-width="150"></el-table-column>
        <el-table-column prop="businessManagerPhone" label="业务总经理电话号码" min-width="150"></el-table-column>
        <el-table-column prop="historicalChange" label="历史变更" min-width="150"></el-table-column>
        <el-table-column prop="staffNumber" label="目前在职人数" min-width="150"></el-table-column>
        <el-table-column prop="operator" label="经办人" min-width="150"></el-table-column>
        <el-table-column prop="remark" label="备注" min-width="150"></el-table-column>
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
      <!-- 分页 -->
      <div id="pagination">
        <el-pagination background :current-page="subsidiaryPageObj.current" @size-change="handleSizeChange" @current-change="handlecurrentChange" :page-sizes="[10,15,20,30,40]" :page-size="subsidiaryPageObj.size" layout="total,sizes,prev,pager,next,jumper" :total="subsidiaryPageObj.total"></el-pagination>
      </div>

      <!-- 导入弹框 -->
      <el-dialog title="导入" :visible.sync="importModal" :show-close="false" :close-on-click-modal="false" width="520px">
        <p class="clearfix">
          <el-upload class="pull-left" ref="importRef" :action="adjustUploadActionUrl" :on-success="handleSuccess" :headers="headers" :before-remove="beforeRemove" :before-upload="beforeUpload">
            <el-button size="mediumn" icon="el-icon-upload">导入数据</el-button>
            <el-button size="mediumn" @click.stop="JS_download" style="margin-left:15px;" icon="el-icon-download">下载模板</el-button>
            <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
          </el-upload>
        </p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="importModal = false">取消</el-button>
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
          <el-button type="primary" @click="importProcessInfoDialog = false">返回</el-button>
        </span>
      </el-dialog>

      <!-- 导出-->
      <el-dialog title="导出" :close-on-click-modal="false" :show-close="false" :visible.sync="exportDialog" width="600px">
        <div>
          <el-form label-width="150px">
            <el-row>
              <!-- <el-col :md="9">
                <el-form-item label="导出年月" label-width="85px">
                  <el-date-picker v-model="exportBatch" :clearable="false" class="width110" type="month" value-format="yyyy-MM" placeholder="选择年月">
                  </el-date-picker>
                </el-form-item>
              </el-col> -->
              <el-col :md="24">
                <el-form-item label="导出方式" label-width="85px">
                  <el-select placeholder="请选择" v-model="exportVal" style="width:265px" filterable>
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

      <!-- 批量删除温馨提示弹框 -->
      <el-dialog title="温馨提示" :close-on-click-modal="false" :visible.sync="deleAllWarn" width="450px">
        <el-row>
          <el-col :md="21" :offset="3" class="warnIcoBg">
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
  name: "comope_subsidiary",
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
    const adjustUploadActionUrl = process.env.VUE_APP_DOMAIN_quote + '/corp/import'; //导入action  线上
    let yd = Tools.getPYd(); //获取当前年月 格式为 2019-07
    return {
      companyName: '', // 子公司名称
      exportBatch: yd, //年月
      importModal: false,//导入窗
      exportDialog: false,//导出窗
      exportVal: 1,//导出方式
      adjustUploadActionUrl, // 导入url
      headers: { //上传请求头
        "x-user-token": localStorage.getItem("token") //设置上传数据文件excel的token
      },
      multipleSelection: [],//已选择行 数组
      deleAllWarn: false, //批量删除
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
        '查询-名称': '018d5a805ff44332bb16e1dac2978fa6',
        '操作-导入': '255125f5869d4f88b048d26744ed97a7',
        '操作-导出': '113f5460a2734917b472e958a64a7c5e',
        '操作-删除': '1dfe1bab8d6441ab9c0108198eb988de',
        '操作-批量删除': '3c56ddddab4b4f6d8e0fa1d8e44954b4'
      },
      subsidiaryPageObj: {
        size: 15, //每页显示记录条数
        current: 1, //当前页码
        total: 0, //总记录数据
      },
      tableData: [],//表格数据
      exportType: [ //导出方式
        { value: 1, label: "保存至本地（需要等待数秒至数分钟）" },
        { value: 2, label: "发送至本人内网邮箱" }
      ],
    };
  },
  created() {
    this.JS_search();
  },
  computed: {
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
      GET(process.env.VUE_APP_DOMAIN_personnel + "/userInfo", { aid: num }).then(res => {
        this.personalInfoData = res.data;
        this.personalInfoData.employedDates = this.personalInfoData.employedDates.split(" ")[0];
        console.log(this.personalInfoData);
      }).catch(error => {
        this.personalInfoData = {};
        console.log(error);
      });
    },
    //根据createUser获取个人信息
    getUserInfoByUser(num) {
      GET(process.env.VUE_APP_DOMAIN_personnel + "/queryUserInfoToRegid", { regid: num }).then(res => {
        this.personalInfoData = res.data;
        this.personalInfoData.employedDates = this.personalInfoData.employedDates.split(" ")[0];
        console.log(this.personalInfoData);
      }).catch(error => {
        this.personalInfoData = {};
        console.log(error);
      });
    },
    handleCommand(command) { //更多操作下拉框     
      switch (command) {
        case "a":
          this.exportDialog = true;//导出
          break;
        case "b":
          this.importModal = true; //导入
          break;
        case "c":
          this.deleAllWarn = true; //批量删除
          break;
        default:
          console.log("default");
          return;
      }
    },
    JS_search() { //搜索
      this.subsidiaryPageObj.current = 1;
      this.search();
    },
    handlecurrentChange(val) { //当前页
      this.subsidiaryPageObj.current = val;
      this.search();
    },
    handleSizeChange(val) {//下拉设置页数
      this.subsidiaryPageObj.size = val;
      this.search();
    },
    search() {
      let searchObj = {
        corpName: this.companyName,
        current: this.subsidiaryPageObj.current || "",
        size: this.subsidiaryPageObj.size || "",
      };
      this.loading = true;
      POST(process.env.VUE_APP_DOMAIN_quote + "/corp/list", searchObj).then(res => {
        this.loading = false;
        //应扣调整款项
        this.tableData = res.data.records; //set表格的值
        this.subsidiaryPageObj.size = res.data.size; //每页显示记录条数
        this.subsidiaryPageObj.current = res.data.current; // set当前页
        this.subsidiaryPageObj.total = res.data.total; //总记录数据
      }).catch(error => {
        this.loading = false;
        console.log(error);
      });
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
    handleSuccess(res) { //上传文件接口成功回调
      this.importModal = false;  //关闭导入弹框
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
          debugger
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
    JS_download() { // 导入 下载模板
      GET(process.env.VUE_APP_DOMAIN_personnel + "/queryBizFilesTemplate", //公共接口
        {
          fileCode: 'QUOTE_BRANCH_CORP_TEMPLATE',
          name: "分子公司系统"
        }).then(res => {
          //获取模板存储返回的ID
          window.location.href = `${process.env.VUE_APP_DOMAIN_download}/oss/download?key=${res.data.fileTemplateId}&name=${res.data.fileTemplateName}.${res.data.fileTemplateSuffix}`;
        }).catch(error => {
          console.log(error);
        });
    },
    submitUpload() {//导入 确认导入
      if (this.$refs.importRef.uploadFiles.length === 0) {
        return this.messagePopp("warning", "请选取文件！");
      } else {
        this.$refs.importRef.submit() //手动上传
      }
    },
    exportToWary() { //导出
      let ul = process.env.VUE_APP_DOMAIN_quote + '/corp/export';

      // 导出方式   1直接下载  2发到邮箱
      if (this.exportVal === 1) {
        this.messagePopp("success", "已经导出至本地！");

        //下载拼接 已经导出至本地！
        let urls = `${ul}?token=${localStorage.getItem("token")}&exportType=${this.exportVal}`;
        window.location.href = urls;
      } else {

        //导出至邮箱   这个接口没有返回值，后台要求直接提示
        GET(ul, { exportType: this.exportVal }).then(() => {
          this.messagePopp("success", "已经导入至您的邮箱！");
        }).catch(error => {
          console.log(error);
        });
      }

      // 关闭导入弹窗
      this.exportDialog = false;
    },
    handleSelectionChange(val) {//当表格选择项发生变化时会触发该事件
      this.multipleSelection = val;
      console.log('选中的行', val);
    },
    deleteThis(id) { //行内删除     
      this.$msgBox.confirm("你确定要删除该条数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        DELETE(process.env.VUE_APP_DOMAIN_quote + "/corp/delete", {
          ids: id
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
        DELETE(process.env.VUE_APP_DOMAIN_quote + '/corp/delete', {
          ids: ids
        }).then(() => {
          this.messagePopp("success", "批量删除成功!");
          this.deleAllWarn = false //关闭弹框
          this.JS_search() //刷新表格，重新获取数据
        }).catch(error => {
          console.log(error)
        })
      }
    }

  }
};
</script>

