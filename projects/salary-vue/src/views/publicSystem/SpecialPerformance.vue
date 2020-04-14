<template>
  <!-- 特殊绩效 -->
  <div class="specialPerformanceManage">
    <!-- 导航 -->
    <div class="guide">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home/publicSystem' }">公共系统</el-breadcrumb-item>
        <el-breadcrumb-item>特殊绩效</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/publicSystem' }">(返回上级)</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 内容 -->
    <div class="bgWhite mgt15 content clearfix">
      <!-- 左边条件栏 -->
      <div class="pull-left">
        <el-form :inline="true" class="mar-no">
          <el-form-item label="员工姓名">
            <el-input clearable v-model.trim="name" @keyup.enter.native="inputEnter" placeholder="请输入名字" class="width155"></el-input>
          </el-form-item>
          <el-form-item label="员工编号">
            <el-input-number placeholder="请输入编号" @keyup.enter.native="inputEnter" :controls="false" v-model="aid" class="width155" :min="0" :max="10000000000" clearable></el-input-number>
          </el-form-item>
          <el-form-item label="查询年月">
            <el-date-picker v-model="batch" type="month" value-format="yyyy-MM" :editable="false" :clearable="false" class="width155" placeholder="选择年月"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="JS_search_condition" icon="el-icon-search">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 右边操作按钮 -->
      <div class="pull-right">
        <el-dropdown @command="handleCommand" trigger="click">
          <el-button type="primary">
            更多操作
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="a" :disabled="isLockFlag" class="cloud-uploadBtn">
              <i></i>&nbsp;导入
            </el-dropdown-item>
            <el-dropdown-item command="b" divided class="cloud-downloadBtn">
              <i></i>&nbsp;导出
            </el-dropdown-item>
            <el-dropdown-item command="d" divided><i class="el-icon-refresh"></i>重置提交</el-dropdown-item>
            <el-dropdown-item command="c" divided>全部删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>&nbsp;
        <el-button size="small" v-if="isLockFlag===false" @click="JS_report_data" type="danger">上报数据</el-button>
        <el-button size="small" v-if="isLockFlag===true" @click="JS_cancel_report">取消上报</el-button>
      </div>
      <!-- 表格 -->
      <div class="table-wrap">
        <el-table v-loading="loading" :height="t_height" :data="dormitoryDedData" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
          <el-table-column type="index" label="序号" min-width="50"></el-table-column>
          <el-table-column prop="batch" label="时间" min-width="150"></el-table-column>
          <el-table-column label="员工姓名" min-width="150">
            <template slot-scope="scope">
              <el-popover v-show="scope.row.employeeName" trigger="click" placement="top" width="450" @show="getUserInfo(scope.row.employeeNo)">
                <!--S-->
                <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                <!--E -->
                <div slot="reference" class="name-wrapper">
                  <el-button size="mini">{{scope.row.employeeName}}</el-button>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="员工编号" min-width="150">
            <template slot-scope="scope">
              <span>{{scope.row.employeeNo}}</span>
              <i class="el-icon-phone tbIconPhone"></i>
            </template>
          </el-table-column>
          <el-table-column prop="idNumber" label="身份证号" min-width="150"></el-table-column>
          <el-table-column label="特殊绩效" min-width="150">
            <!-- toThousands 全局过滤器 -->
            <template slot-scope="scope">{{scope.row.specialPerformance | toThousands}}</template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" min-width="150" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column min-width="130" label="提交状态">
            <template slot="header">
              <el-select v-model="commitState" filterable placeholder="提交状态" clearable style="width:150px;" @change="JS_search" class="selectRepairIcon">
                <el-option v-for="item in submitStates" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </template>
            <template slot-scope="scope">
              <span style="color:red;" v-if="scope.row.bsubmit === 0">未提交</span>
              <span v-else-if="scope.row.bsubmit === 1">已提交</span>
              <span style="color:red;" v-else-if="scope.row.bsubmit === 2">
                <el-tooltip v-if="scope.row.errorMsg" class="item" effect="dark" :content="scope.row.errorMsg" placement="top">
                  <span>提交失败</span>
                </el-tooltip>
                <span v-else>
                  提交失败
                </span>
              </span>
              <span style="color:blue;" v-else-if="scope.row.bsubmit === 3">忽略提交</span>
              <span v-else></span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="120" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="small" :disabled="isLockFlag" @click="updateThis(scope.row.id)">修改</el-button>
              <el-button type="text" size="small" :disabled="isLockFlag" @click="deleteThis(scope.row.id)" class="deleteTxt">删除</el-button>
              <el-button v-if="scope.row.bsubmit===2" type="text" size="small" :disabled="isLockFlag" @click="ignoreSubmit(scope.row.id,3,'忽略')">忽略提交</el-button>
              <el-button v-if="scope.row.bsubmit===3" type="text" size="small" :disabled="isLockFlag" @click="ignoreSubmit(scope.row.id,0,'取消忽略')">取消忽略</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div id="pagination">
          <el-pagination @size-change="handleSizeChange" @current-change="handlecurrentChange" background :current-page="current" :page-sizes="[10,15,20,30,40]" :page-size="size" layout="total,sizes,prev,pager,next,jumper" :total="total"></el-pagination>
        </div>
      </div>
      <!-- 修改 弹框 -->
      <el-dialog title="特殊绩效修改" :close-on-click-modal="false" :visible.sync="deductionDialog" width="768px" class="grayBg">
        <div class="whiteBox">
          <p class="pReset">基本信息</p>
          <el-row class="textLft">
            <el-col :span="3" class="height26">年月：</el-col>
            <el-col :span="9" class="height26">{{modifyForm.batch}}</el-col>
            <el-col :span="3" class="height26">员工姓名：</el-col>
            <el-col :span="9" class="height26">{{modifyForm.employeeName}}</el-col>
            <el-col :span="3" class="height26">员工编号：</el-col>
            <el-col :span="9" class="height26">{{modifyForm.employeeNo}}</el-col>
            <el-col :span="3" class="height26">身份证号：</el-col>
            <el-col :span="9" class="height26">{{modifyForm.idNumber}}</el-col>
          </el-row>
        </div>
        <div class="whiteBox">
          <p class="pReset">编辑信息</p>
          <el-form :model="updateConditionform" :rules="updateConditionformRule" ref="updateConditionform" label-width="150px">
            <el-row>
              <el-col :md="24">
                <el-form-item label="绩效考核：" prop="check">
                  <el-input-number :controls="false" v-model="updateConditionform.specialPerformance" :min="0" :max="10000000"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :md="24">
                <el-form-item label="备注：" prop="remark">
                  <el-input type="textarea" placeholder="最多可输入200个字符" :rows="5" v-model.trim="updateConditionform.remark"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="JS_cancel('updateConditionform')">取消</el-button>
          <el-button type="primary" @click="JS_update_save('updateConditionform')">确定</el-button>
        </span>
      </el-dialog>
      <!-- 导入 -->
      <el-dialog title="绩效工资导入" :visible.sync="uploadModal" :show-close="false" :close-on-click-modal="false" width="520px">
        <p class="clearfix">
          <el-upload class="pull-left" ref="upload" :action="uploadActionUrl" :headers="headers" :before-remove="beforeRemove" :before-upload="beforeUpload" :on-success="handleSuccess" :file-list="fileList">
            <el-button size="mediumn" icon="el-icon-upload">导入数据</el-button>
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
  </div>
</template>

<script>
import myMixin from "libs/mixin/index.js"
import Tools from "untils/index.js"
import { GET, POST, DELETE, PUT } from "http/custom.js"; //数据调用方法
import { setTimeout } from "timers";
import { Progress } from "element-ui";
export default {
  name: "specialPerformance",
  mixins: [myMixin],
  data() {
    const uploadActionUrl = process.env.VUE_APP_DOMAIN_personnel + "/specialPerformanceImportData"; //导入action 线上，数据导入接口
    return {
      t_height: Tools.getTbHeight(285), //设置表格的高
      isLockFlag: false, //是否上锁
      SubmitStu: false, //提交数据状态
      uploadActionUrl,
      fileList: [],
      headers: {}, //上传图片请求头
      uploadModal: false, //导入
      size: 15, //每页显示记录条数
      current: 1, //当前页码
      aid: undefined, //员工编号
      name: "", //员工姓名
      batch: Tools.getPYd(), //获取当前年月 格式为 2019-07
      personalInfoData: {}, //姓名popover弹窗数据
      loading: false, //table加载动画开关
      dormitoryDedData: [], ////宿舍扣款
      deductionDialog: false, //修改弹框
      total: 0, //总记录数据
      modifyForm: {}, //修改基本信息对象内容

      updateConditionform: {//修改条件
        specialPerformance: "", //特殊绩效
        remark: "" //备注
      },
      updateConditionformRule: {
        remark: [
          { min: 0, max: 200, message: '输入的内容不可超过200个字符', trigger: 'blur' }
        ]
      },
      commitState: "",// 提交状态值
      submitStates: [ //提交状态
        { value: "0", label: "未提交" },
        { value: "1", label: "已提交" },
        { value: "2", label: "提交失败" },
        { value: "3", label: "忽略提交" }
      ],
      //进度条相关参数
      importProcessInfoDialog: false, //取消进度条框
      importError: false,// 导入错误时呈现的进度 
      downloadErrorEveProcess: false, //获取错误下载key
      loadErrorExcel: false, //呈现失败下载明细
      downloadErrorKey: false,
      progressPercentAge: 0,
      progressBackBtn: false, //返回按钮
      uploadProcessInfo: {
        total: '',//总条数
        handler: '',//已处理条数
        successful: '',//处理成功条数
        failures: '', //处理失败条数
        finish: false,//是否处理完成
        dealAllTime: '',//总耗时
      }
    };
  },
  methods: {
    JS_search_condition() { //搜索按钮
      this.commitState = "";
      this.search();//搜索处理状态
    },
    ignoreSubmit(id, confirmStatus, msg) {//忽略,取消忽略上报
      //单个忽略,取消忽略上报
      this.$msgBox.confirm(`你确定要${msg}上报该条数据吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let obj = {
          batch: this.batch,
          confirmStatus: confirmStatus,
          ids: [id]
        };
        PUT(process.env.VUE_APP_DOMAIN_personnel + "/specialPerformanceIgnore", obj).then(res => {
          //单条忽略,取消忽略上报
          this.messagePopp("success", `${msg}上报成功!`);
          this.search(); //刷新表格，重新获取数据
        }).catch(error => {
          console.log(error)
        })
      }).catch(() => {
        console.log("取消");
      })
    },
    messagePopp(type, msg) {//提示框
      this.$message({
        showClose: true,
        type: type,
        message: msg
      });
    },
    //更多操作下拉框
    handleCommand(command) {
      //更多操作下拉框
      switch (command) {
        case "a":
          //导入
          this.uploadModal = true; break;
        case "b":
          //导出
          this.exportData();
          break;
        case "c":
          this.deleteAll();
          break;
        case "d":
          this.resetSubmit();
          break;
        default:
          console.log("default");
          return;
      }
    },
    resetSubmit() { //重置数据 
      this.$msgBox.confirm(`<span>确定重置${this.batch}数据？</span>`, "温馨提示",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        PUT(process.env.VUE_APP_DOMAIN_personnel + "/specialPerformanceReset",
          {
            batch: this.batch,
            confirmStatus: 0
          }).then(res => {
            debugger
            if (res.code === 0) { //0 时成功
              if (res.data) {
                this.messagePopp("success", "重置数据成功！");
                this.JS_search(); //搜索并且判断数据是否上锁
              } else {
                this.messagePopp("error", "重置数据失败！");
              }
            }
          }).catch(error => {
            console.log(error);
          })
      }).catch(() => {
        console.log("失败");
      })
    },
    exportData() {//导出
      let url = process.env.VUE_APP_DOMAIN_personnel + "/specialPerformanceExportData?token="
        + localStorage.getItem("token")
        + "&batch=" + this.batch
        + "&employeeName=" + this.name
        + "&employeeNo=" + (this.aid || "");
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
    handleSuccess(res) { //上传文件接口调取成功回调;
      this.uploadModal = false;
      if (res.code === 0) { // 文件上传成功
        this.downloadErrorEveProcess = res.data //获取进度条事件句柄
        //错误导入进度条与下载模板
        this.importProcessInfoDialog = true
        this.queryProgress() //获取上传文件进度条信息
      } else {//失败
        let msgError = res.msg || '【系统无法识别EXCLE中的空白、公式和非法字符。请先清理】。' //50*非0情况
        this.$msgBox.alert(`<span style="color:red;">${msgError} </span>`, '温馨提示', {
          dangerouslyUseHTMLString: true
        })
      }
      //清除选择的文件
      this.$refs.upload.clearFiles();
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
      console.log('downloadErrorKey', this.downloadErrorKey)
      let url = process.env.VUE_APP_DOMAIN_download + '/oss/download?key=' + this.downloadErrorKey + '&token=' + localStorage.getItem("token") + "&name=" + encodeURI("特殊绩效失败明细") + ".xlsx";
      window.location.href = url;
    },
    importProgress() {//进度弹框关闭
      this.importProcessInfoDialog = false; //关闭进度弹框
      this.progressPercentAge = 0 //进度条清空为0
      this.progressBackBtn = false; //隐藏返回按钮
      this.loadErrorExcel = false; // 隐藏下载失败链接
    },
    //下载模板
    JS_download() {
      GET(process.env.VUE_APP_DOMAIN_personnel + "/queryBizFilesTemplate",
        {
          fileCode: 'PERSONNEL_SPECIALPERFORMANCE_IMPORT_TEMPLATE',
          name: "特殊绩效"
        }).then(res => {
          //获取模板存储返回的ID
          let url = `${process.env.VUE_APP_DOMAIN_download}/oss/download?key=${res.data.fileTemplateId}&name=${res.data.fileTemplateName}.${res.data.fileTemplateSuffix}`;
          window.location.href = url;
        }).catch(error => {
          console.log(error);
        });
    },
    JS_cancel_report() {//取消上报
      this.$msgBox.confirm(
        '<span>确定取消上报数据？</span>',
        "温馨提示",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        GET(process.env.VUE_APP_DOMAIN_personnel + "/specialPerformanceCancelSubmit", { batch: this.batch }).then(res => {
          console.log("取消上报", res)
          this.messagePopp("success", "取消上报数据成功！");
          this.search() //搜索并且判断数据是否上锁
        }).catch(error => {
          console.log(error)
        })
      }).catch(() => {

      })
    },

    JS_report_data() { //上报数据
      this.$msgBox.confirm(`<span>请确认所选择的${this.batch}</span><span style="color:red;">【特殊绩效】</span><span>无误。</span>`,
        "温馨提示",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        const allLoading = this.$loading({//上报数据，锁定页面loading
          lock: true,
          text: '正在上报数据，请稍等片刻',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        GET(process.env.VUE_APP_DOMAIN_personnel + "/specialPerformanceCollectEmployPayroll", { batch: this.batch }).then(res => {
          allLoading.close(); //关闭loading
          this.messagePopp("success", "上报数据成功！");
          this.search(); //搜索并且判断数据是否上锁
        }).catch(error => {
          allLoading.close(); //关闭loading
          console.log(error)
        })
      }).catch(() => {

      })
    },
    deleteAll() {
      //按批次删除
      this.$msgBox.confirm(`你确定要删除${this.batch}所有数据吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        DELETE(process.env.VUE_APP_DOMAIN_personnel + "/specialPerformanceToBatch", {
          batch: this.batch
        }).then(res => {
          //按批次删除
          this.messagePopp("success", "删除成功!");
          this.search(); //刷新表格，重新获取数据
        }).catch(error => {
          console.log(error);
        });
      }).catch(() => {
        this.messagePopp("success", "已取消删除!");
      });

    },
    //点击修改获取详情
    updateThis(id) {
      this.deductionDialog = true; //显示弹窗
      GET(process.env.VUE_APP_DOMAIN_personnel + "/specialPerformance", { id: id }).then(res => {
        this.modifyForm = res.data;
        this.updateConditionform = res.data;
      }).catch(error => {
        console.log(error);
      });
    },
    //保存修改
    JS_update_save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let saveObj = {
            employeeName: this.updateConditionform.employeeName,
            id: this.updateConditionform.id,
            remark: this.updateConditionform.remark,
            specialPerformance: this.updateConditionform.specialPerformance
          }; //保存对象
          PUT(process.env.VUE_APP_DOMAIN_personnel + "/specialPerformance", saveObj).then(res => {
            //ele - ui 消息框
            this.messagePopp("success", "修改数据成功!");
            this.deductionDialog = false; //关闭弹窗
            this.search(); //重刷数据
          }).catch(error => {
            console.log(error);
          });
        } else {
          this.messagePopp("warning", "提交失败，验证不通过!");
        }
      });
    },
    //取消
    JS_cancel(formName) {
      this.deductionDialog = false; //关掉弹框
      this.reset(formName);
    },
    //清除表单
    reset(formName) {
      console.log(this.$refs[formName].resetFields());
      this.$refs[formName].resetFields();
    },
    //删除
    deleteThis(id) {
      //单个删除
      this.$msgBox.confirm("你确定要删除该条数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        DELETE(process.env.VUE_APP_DOMAIN_personnel + "/specialPerformance", {
          ids: id
        }).then(res => {
          //单条数据删除
          this.messagePopp("success", "删除成功!");
          this.search(); //刷新表格，重新获取数据
        }).catch(error => {
          console.log(error);
        });
      }).catch(() => {
        this.messagePopp("info", "取消删除!");
      });
    },
    //根据员工编号获取个人信息
    getUserInfo(num) {
      GET(process.env.VUE_APP_DOMAIN_personnel + "/userInfo", { aid: num }).then(res => {
        this.personalInfoData = res.data;
        this.personalInfoData.employedDates = this.personalInfoData.employedDates.split(
          " "
        )[0];
        console.log(this.personalInfoData);
      }).catch(error => {
        this.personalInfoData = {};
        console.log(error);
      });
    },
    JS_search() {
      this.current = 1; //current=1搜索第一页
      this.search();
    },
    search() {
      //查询对象,初始化值
      let searchObj = {
        ascs: [],
        descs: [],
        batch: this.batch, //年月（批次号）
        current: this.current, //当前页码
        size: this.size, //每页显示记录条数
        bsubmit: this.commitState || "", //提交状态
        employeeName: this.name, //员工姓名
        employeeNo: this.aid || ""//员工编号
      };
      this.loading = true; //开启动画
      //调取数据
      POST(process.env.VUE_APP_DOMAIN_personnel + "/specialPerformances", searchObj).then(res => {
        this.loading = false;
        this.dormitoryDedData = res.data.records; //set表格的值
        this.current = res.data.current; // set当前页
        this.size = res.data.size; //每页显示记录条数
        this.total = res.data.total; //总记录数据
      }).catch(error => {
        console.log(error);
      });
      this.isLock() //特殊判断数据是否上锁
    },
    isLock() {//判断数据是否上锁 
      GET(process.env.VUE_APP_DOMAIN_personnel + "/specialPerformanceCheckFinancialDataLock", { batch: this.batch }).then(res => {
        console.log("判断数据是否上锁", res)
        this.isLockFlag = res.data;
      }).catch(error => {
        console.log(error)
      })
    },
    handlecurrentChange(val) {
      //当前页，点击页码
      this.current = val;
      this.search();
    },
    handleSizeChange(val) {
      //分页,下拉
      this.size = val;
      this.search();
    },
  },
  created() {
    this.headers["x-user-token"] = localStorage.getItem("token"); //设置上传数据文件excel的token
    //页面数据初始化
    this.search();
  }
};
</script>

<style scoped>
.red {
  color: #ff0e2a; /*#006eff; */
}
</style>
