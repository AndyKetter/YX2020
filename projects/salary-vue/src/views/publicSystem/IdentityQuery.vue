<template>
  <!-- 身份查询 -->
  <div class="identity">
    <!-- 导航 -->
    <div class="guide">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home/publicSystem' }">公共系统</el-breadcrumb-item>
        <el-breadcrumb-item>信息查询</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/publicSystem' }">(返回上级)</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 内容 -->
    <div class="bgWhite mgt15">
      <div :style="{width:'580px',height:t_height + 'px',padding:'20px'}">
        <el-form label-width="100px" :rules="rules" ref="inputContent" :model="inputContent">
          <el-row>
            <el-col :md="24">
              <el-form-item label="员工编号" label-width="80px" prop="employeeNo">
                <el-input clearable @keyup.enter.native="JS_search" :disabled="inputDisabled['员工编号']" @focus="JS_focus" v-model.trim="inputContent.employeeNo" placeholder="请输入员工编号" style="width:237px"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="24">
              <el-form-item label="平台号码" label-width="80px" prop="mobilePhone">
                <el-input clearable @keyup.enter.native="JS_search" :disabled="inputDisabled['平台号码']" @focus="JS_focus" v-model.trim="inputContent.mobilePhone" placeholder="请输入平台号码" style="width:237px"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="24">
              <el-form-item label="身份证号" label-width="80px" prop="idCard">
                <el-input clearable @keyup.enter.native="JS_search" :disabled="inputDisabled['身份证号']" @focus="JS_focus" v-model.trim="inputContent.idCard" placeholder="请输入身份证号" style="width:237px"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="24">
              <el-form-item label="系统ID号" label-width="80px" prop="regId">
                <el-input clearable @keyup.enter.native="JS_search" :disabled="inputDisabled['系统ID号']" @focus="JS_focus" v-model.trim="inputContent.regId" placeholder="请输入系统ID号" style="width:237px"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="24">
              <el-form-item label="员工姓名" label-width="80px" prop="userName">
                <el-input :disabled="true" v-model.trim="inputContent.userName" style="width:237px"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer" style="margin-left: 80px;">
          <el-button type="primary" @click="JS_search">立即查询</el-button>
          <el-button type="primary" @click="JS_reset('inputContent')">重置</el-button>
          <el-button type="primary" @click="importModal = true">批量查询</el-button>
        </span>
      </div>
    </div>
    <!-- 导入与下载弹框 -->
    <el-dialog title="批量查询" :visible.sync="importModal" :show-close="false" :close-on-click-modal="false" width="520px">
      <el-form label-width="100px" ref="exportExform">
        <el-row>
          <el-col :md="17" class="clearfix mar-ver">
            <el-form-item label="选择文件" label-width="80px">
              <el-upload class="pull-left" ref="upload" :action="uploadActionUrl" :data="{exportType:this.exportVal}" :multiple="false" :limit="1" :auto-upload="false" :on-success="handleSuccess" :headers="headers" :before-remove="beforeRemove" :before-upload="beforeUpload">
                <el-button size="mediumn" icon="el-icon-upload">导入数据</el-button>
                <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :md="7" class="clearfix mar-ver">
            <div class="fileBox" style="margin-top:10px;text-align:right;">
              <span class="filename excel">
                <el-button type="text" class="underlineTxt" @click.stop="JS_download">下载模板</el-button>
              </span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="24">
            <el-form-item label="导出方式" label-width="85px">
              <el-select placeholder="请选择" v-model="exportVal" style="width:395px" filterable>
                <el-option v-for="item in exportType" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitUpload">确定查询</el-button>
        <el-button @click="importModal = false">关闭窗口</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Tools from "untils/index.js"
import { GET } from "http/custom.js"; //数据调用方法

export default {
  name: "identity",
  data() {
    const uploadActionUrl = process.env.VUE_APP_DOMAIN_personnel + "/personnel/common/importBatchQuery"; //导入action 线上，数据导入接口
    return {
      t_height: Tools.getTbHeight(170), //设置表格的高
      uploadActionUrl,
      importModal: false, //导入与下载弹框
      exportVal: 1,// 导出方式
      headers: { //上传请求头
        "x-user-token": localStorage.getItem("token") //设置上传数据文件excel的token
      },
      inputContent: {
        employeeNo: '', //员工编号
        mobilePhone: '', //平台号码
        idCard: '', //身份证号
        regId: '', //系统ID号
        userName: '', //员工姓名
      },
      inputDisabled: { //锁定文本框
        '员工编号': false,
        '平台号码': false,
        '身份证号': false,
        '系统ID号': false
      },
      rules: { //表单格式化必须
        employeeNo: [],
        mobilePhone: [],
        idCard: [],
        regId: [],
        userName: []
      },
      exportType: [ //导出方式
        { value: 1, label: "保存至本地（需要等待数秒至数分钟）" },
        { value: 2, label: "发送至本人内网邮箱" }
      ],
    }
  },
  methods: {
    JS_focus(event) { //文本框的焦点事件回调
      const obj = this.inputDisabled;
      const plhl = event.target.placeholder;

      // 当前输入框获取焦点时锁定其它文本框
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          this.inputDisabled[key] = plhl.includes(key.toString()) ? false : true;
        }
      }
    },
    JS_reset(formName) {
      this.$nextTick(() => {
        this.$refs[formName].resetFields(); //清除表单
        this.inputDisabled = { //解锁文本框
          '员工编号': false,
          '平台号码': false,
          '身份证号': false,
          '系统ID号': false
        }
      }, 0);
    },
    messagePopp(type, msg) {//提示框
      this.$message({
        showClose: true,
        type: type,
        message: msg
      });
    },
    submitUpload() {//导入 确认导入
      if (this.$refs.upload.uploadFiles.length === 0) {
        return this.messagePopp("warning", "请选取文件！");
      } else {
        this.$refs.upload.submit() //手动上传
      }
    },
    exportData(res) {//导出 
      // 1直接下载  2 发到邮箱
      if (this.exportVal === 1) { //导出至本地
        if (res.data) {
          this.messagePopp("success", "已经导出至本地！");
          window.location.href = res.data;
        }
      } else if (this.exportVal === 2) { // 导入至您的邮箱
        this.messagePopp("success", "已经导入至您的邮箱！");
      }
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
    handleSuccess(res) { //上传文件接口调取成功回调
      if (res.code === 0) {
        this.exportData(res);
        //清除选择的文件
        this.importModal = false; // 关闭弹窗
      } else {
        this.messagePopp("error", "上传文件失败！");
      }
      this.$refs.upload.clearFiles(); //清除上传
    },
    JS_download() { //下载模板
      GET(process.env.VUE_APP_DOMAIN_personnel + "/queryBizFilesTemplate",
        {
          fileCode: 'PERSONNEL_COMMON_PERSONINFO_TEMPLATE',
          name: "身份查询模板"
        }).then(res => {
          //获取模板存储返回的ID
          let url = `${process.env.VUE_APP_DOMAIN_download}/oss/download?key=${res.data.fileTemplateId}&name=${res.data.fileTemplateName}.${res.data.fileTemplateSuffix}`;
          window.location.href = url;
        }).catch(error => {
          console.log(error);
        });
    },
    JS_search() {
      // 输入框全锁定时不查询 
      const obj = this.inputContent;
      let count = 0;
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (obj[key]) {
            count++;
          }
        }
      }
      if (count >= 4) {
        return this.messagePopp('warning', '请重置后再查询!');
      }

      //调取数据
      GET(process.env.VUE_APP_DOMAIN_personnel + "/personnel/common/queryPersonInfo", this.inputContent).then(res => {
        if (res.code === 0) {
          if (!res.data) {
            return this.messagePopp('warning', '没有查询到对应的信息!');
          }
          //表格回填数据 
          this.inputContent.employeeNo = res.data.employeeNo || " ";
          this.inputContent.mobilePhone = res.data.mobilePhone || " ";
          this.inputContent.idCard = res.data.idCard || " ";
          this.inputContent.regId = res.data.regId || " ";
          this.inputContent.userName = res.data.userName || " ";

          //锁定文本框
          this.inputDisabled = {
            '员工编号': true,
            '平台号码': true,
            '身份证号': true,
            '系统ID号': true
          }
        }
      }).catch(error => {
        console.log(error);
      });
    }
  },
  created() { }
};
</script>

