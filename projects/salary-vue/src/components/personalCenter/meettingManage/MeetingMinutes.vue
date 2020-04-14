<template>
  <div class="meetingMinutes">
    <!-- 会议纪要查询条件 -->
    <div class="pull-left">
      <el-form :inline="true" class="mar-no" label-position="right">
        <el-form-item label="会议主题:">
          <el-input v-model="condition.meetingTheme" placeholder="请输入内容" clearable></el-input>
        </el-form-item>
        <el-form-item label="会议时间:">
          <el-date-picker
            v-model="batch"
            :editable="false"
            clearable
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" icon="el-icon-search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="pull-right">
      <el-button size="small" slot="reference" @click="meetingAdd">新增</el-button>
    </div>
    <!-- 会议纪要列表 -->
    <div class="table_wrap">
      <el-table
        :data="comopeMeetingTbData"
        v-loading="loading"
        :height="dataInfo.t_height"
        border
        style="width:100%"
        :header-cell-style="{backgroundColor:'#e5e9f3'}"
      >
        <el-table-column type="index" label="序号" min-width="50"></el-table-column>
        <el-table-column prop="meetingTheme" label="会议主题" min-width="160" show-overflow-tooltip></el-table-column>
        <el-table-column prop="meetingTime" label="会议时间" min-width="150">
          <template slot-scope="scope">
            <span>{{scope.row.meetingTime | filterDateTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="meetingAddr" label="会议地点" min-width="120"></el-table-column>
        <el-table-column prop="meetingHost" label="会议主持人" min-width="80"></el-table-column>
        <el-table-column prop="deptName" label="所属部门" min-width="120"></el-table-column>
        <el-table-column prop="recorderName" label="记录人" min-width="100">
          <template slot-scope="scope">
            <el-popover
              trigger="click"
              placement="top"
              @show="getUserInfo(scope.row.recorderId)"
              width="450"
              v-if="scope.row.recorderName"
            >
              <!-- S -->
              <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
              <!-- E -->
              <div slot="reference" class="name-wrapper">
                <el-button size="mini">{{scope.row.recorderName}}</el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="记录时间" min-width="120"></el-table-column>
        <el-table-column label="操作" min-width="120" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="meetingCheck(scope.row)">查看</el-button>
            <el-button
              v-if="scope.row.operationAuthority == 1"
              type="text"
              @click="meetingEdit(scope.row)"
            >修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div id="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="condition.current"
          :page-size="condition.size"
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 15, 20, 30, 40]"
          :total="currentTotal"
        ></el-pagination>
      </div>
      <!-- 新增-->
      <el-dialog
        :title="dialogTitle"
        :close-on-click-modal="false"
        :show-close="!uploadLoading"
        :visible.sync="meetingDialog"
        :top="dialogFlag === 'add' ? '15vh' : '8vh'"
        width="850px"
        @close="meetingCancel('meetingMinute')"
      >
        <div
          class="meeting-dialog-container"
          element-loading-text="正在上传中，请稍后..."
          element-loading-spinner="el-icon-loading"
          v-loading="uploadLoading"
        >
          <div>
            <el-form
              label-width="100px"
              :model="meetingMinute"
              :rules="meetingMinuteRule"
              ref="meetingMinute"
              :disabled="dialogFlag === 'check'"
            >
              <el-row>
                <el-col>
                  <el-form-item label="会议主题" prop="meetingTheme">
                    <el-input v-model.trim="meetingMinute.meetingTheme" placeholder="请输入会议主题"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :md="12" style="margin-top:7px;">
                  <el-form-item label="会议时间" prop="meetingTime">
                    <el-date-picker
                      v-model="meetingMinute.meetingTime"
                      :clearable="false"
                      :editable="false"
                      :picker-options="{disabledDate:time => time.getTime() > Date.now() }"
                      type="datetime"
                      style="width:100%;"
                      value-format="yyyy-MM-dd HH:mm:00"
                      placeholder="选择日期"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :md="12" style="margin-top:7px;">
                  <el-form-item label="会议地点" prop="meetingAddr">
                    <el-input v-model.trim="meetingMinute.meetingAddr" placeholder="请输入会议地点"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :md="12" style="margin-top:7px;">
                  <el-form-item label="会议主持人" prop="meetingHost">
                    <el-input v-model.trim="meetingMinute.meetingHost" placeholder="请输入会议主持人"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :md="24" style="margin-top:7px;">
                  <el-form-item label="会议参与人" prop="meetingJoiner">
                    <el-input v-model.trim="meetingMinute.meetingJoiner" placeholder="请输入会议参与人"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :md="24" style="margin-top:7px;">
                  <el-form-item label="会议内容" prop="meetingContent">
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 4}"
                      v-model="meetingMinute.meetingContent"
                      placeholder="请输入会议内容,字数不能超过500字"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :md="22" style="margin-top:7px;">
                  <el-form-item label="附件" prop="meetingFile">
                    <el-upload
                      class="upload-demo"
                      ref="meetingUpload"
                      :headers="headers"
                      :action="uploadUrl"
                      :file-list="uploadFileList"
                      :on-preview="handlePreviewFile"
                      :on-success="handleSuccessFile"
                      :on-error="handleErrorFile"
                      :before-upload="beforeUploadFile"
                      :on-remove="handleRemoveFile"
                      multiple
                    >
                      <el-button size="small" type="primary">上传</el-button>
                      <div
                        slot="tip"
                        class="el-upload__tip"
                        style="color:red"
                      >只能上传pdf、xls、xlsx、doc、docx文件及WAV、MP3、MP4、WMA音频文件，且单个文件不超过100Mb</div>
                      <!-- <div slot="trigger"></div> -->
                    </el-upload>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div class="meeting-dialog-btn">
              <el-button
                v-if="dialogFlag === 'add'"
                type="primary"
                @click="meetingSave('meetingMinute')"
                class="margin-left-10"
              >确定</el-button>
              <el-button
                v-else-if="dialogFlag === 'edit'"
                type="primary"
                @click="meetingUpdate('meetingMinute')"
                class="margin-left-10"
              >确认修改</el-button>
              <el-button v-if="dialogFlag === 'add'" @click="meetingDialog = false">取消</el-button>
            </div>
          </div>
          <div
            class="meeting-dialog-update-outer"
            v-if="dialogFlag === 'edit' || dialogFlag === 'check'"
          >
            <hr />
            <article>修改记录</article>
            <div class="meeting-dialog-update-context">
              <el-form
                :model="item"
                v-for="(item,i) in updateData"
                :key="i"
                label-width="100px"
                class="meeting-dialog-update"
              >
                <el-row>
                  <el-col :md="24">
                    <el-form-item prop="updateContext" label="更新内容:">
                      <span>{{item.modifyTxt}}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :md="6">
                    <el-form-item prop="updatePerson" label="更新人:">
                      <span>{{item.createUserName}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :md="10">
                    <el-form-item prop="refer" label="上下级关系:">
                      <span>{{item.levelExpand | filterLevelExpand}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :md="8">
                    <el-form-item prop="updateDate" label="更新时间:">
                      <span>{{item.createTime}}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <p v-if="!updateData.length" style="text-align:center;">无数据</p>
            </div>
            <div class="meeting-dialog-btn">
              <el-button @click="meetingDialog = false">关闭</el-button>
            </div>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { POST, GET, PUT } from "http/custom.js"
import Tools from "untils/index.js"
export default {
  name: "meetingMinutes",
  filters: {
    // 将上下级关系 格式为：.谭曼_16803050_10000.陈军_17434485_4. 转换成 谭曼-陈军
    filterLevelExpand(str) {
      if (str) {
        const reg = /[\u4e00-\u9fa5]+/g,
          arr = []
        let r
        while ((r = reg.exec(str))) {
          arr.push(r[0])
        }
        return arr.join("-")
      }
      return str
    },
    // 过滤出 日期+时分 如："2019-10-26 10:39"
    filterDateTime(str) {
      if (str) {
        return str.slice(0, 16)
      }
      return str
    }
  },
  props: {
    dataInfo: {
      type: Object,
      required: true,
      default: () => {
        return {
          t_height: null
        }
      }
    }
  },
  data() {
    return {
      // 设置请求头
      headers: {},
      // 查询条件
      condition: {
        // 当前页
        current: 1,
        // 当前记录条数
        size: 15,
        meetingTheme: "", //会议主题
        meetingTimeBegin: "", //会议开始时间
        meetingTimeEnd: "" //会议结束时间
      },
      batch: null, //会议时间
      // 会议纪要列表
      comopeMeetingTbData: [],
      // 会议纪要列表加载状态
      loading: false,
      //当前总条数
      currentTotal: 0,
      // 弹出层
      meetingDialog: false,
      // 弹出层标题
      dialogTitle: "新增会议纪要",
      // 弹出层标记(add:新增,check:查看,edit:修改)
      dialogFlag: "add",
      // 新增、修改、查看会议纪要
      meetingMinute: {
        meetingTheme: "", //会议主题
        meetingTime: "", //会议时间
        meetingAddr: "", //会议地点
        meetingHost: "", //会议主持人
        meetingJoiner: "", //会议参与人
        meetingContent: "" //会议内容
      },
      // 记录修改会议纪要记录
      meetingMinuteRecord: {
        meetingTheme: "", //会议主题
        meetingTime: "", //会议时间
        meetingAddr: "", //会议地点
        meetingHost: "", //会议主持人
        meetingJoiner: "", //会议参与人
        meetingContent: "" //会议内容
      },
      // 会议纪要字段对应的中文
      meetingMinuteEntries: [{ key: "meetingTheme", text: "会议主题" }, { key: "meetingTime", text: "会议时间" }, { key: "meetingAddr", text: "会议地点" }, { key: "meetingHost", text: "会议主持人" }, { key: "meetingJoiner", text: "会议参与人" }, { key: "meetingContent", text: "会议内容" }],
      // 会议纪要规则
      meetingMinuteRule: {
        meetingTheme: [{ required: true, message: "请输入会议主题", trigger: "blur" }, { min: 1, max: 50, message: "文字控制在50字内", trigger: "blur" }],
        meetingTime: [{ required: true, message: "请选择会议时间", trigger: "blur" }],
        meetingAddr: [{ required: true, message: "请输入会议地点", trigger: "blur" }, { min: 1, max: 50, message: "文字控制在50字内", trigger: "blur" }],
        meetingHost: [{ required: true, message: "请输入会议主持人", trigger: "blur" }, { min: 1, max: 10, message: "文字控制在10字内", trigger: "blur" }],
        meetingJoiner: [{ min: 1, max: 50, message: "文字控制在50字内", trigger: "blur" }],
        meetingContent: [{ min: 1, max: 500, message: "文字控制在500字内", trigger: "blur" }]
      },
      // 上传
      // 上传时加载状态
      uploadLoading: false,
      // 上传文件列表
      // pdf、xls、xlsx、doc、docx文件及WAV、MP3、MP4、WMA音频文件
      uploadFileList: [],
      // 记录上传附件信息
      uploadFileListRecord: [],
      // 上传地址
      uploadUrl: process.env.VUE_APP_DOMAIN_download + "/oss/upload", //导入文件,
      //修改记录
      updateData: [],
      personalInfoData: {} //操作人popover弹窗数据
    }
  },
  methods: {
    // 查询
    search() {
      if (Array.isArray(this.batch)) {
        this.condition.meetingTimeBegin = this.batch[0]
        this.condition.meetingTimeEnd = this.batch[1]
      } else {
        this.condition.meetingTimeBegin = ""
        this.condition.meetingTimeEnd = ""
      }
      this.meetingList()
    },
    // 获取会议纪要列表数据
    meetingList() {
      this.loading = true
      POST(process.env.VUE_APP_DOMAIN_administration + "/meeting/record/list", this.condition)
        .then(res => {
          this.loading = false
          this.comopeMeetingTbData = res.data.records
          this.currentTotal = res.data.total //总记录数据
          this.condition.current = res.data.current // set当前页
          this.condition.size = res.data.size //每页显示记录条数
          console.log(res.data)
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 改变每页显示记录条数
    handleSizeChange(size) {
      this.condition.size = size
      this.meetingList()
    },
    // 改变当前页
    handleCurrentChange(current) {
      this.condition.current = current
      this.meetingList()
    },
    // 获取单个记录信息
    getRowInfo(id) {
      return new Promise(resolve => {
        GET(process.env.VUE_APP_DOMAIN_administration + "/meeting/record/info", { id }).then(res => {
          if (res.code === 0) {
            const fileList = res.data.fileList
            if (Array.isArray(fileList)) {
              if (fileList.length) {
                // 记录附件信息
                this.uploadFileListRecord = JSON.parse(JSON.stringify(fileList))
                // 附件信息统一转换到上传列表中
                fileList.forEach(file => {
                  this.uploadFileList.push({ id: file.fileId, name: file.fileName, url: this.uploadUrl, size: file.fileSize })
                })
              }
            }
            resolve(res.data)
          }
        })
      })
    },
    // 新增
    meetingAdd() {
      this.meetingDialog = true
      this.dialogTitle = "新增会议纪要"
      this.dialogFlag = "add"
      this.meetingMinute = {
        //重置是为了不能清空编辑/查看时记录id的问题，导致新增时，id重复而不能录入
        meetingTheme: "", //会议主题
        meetingTime: Tools.getYtd_Hms(), //会议时间
        meetingAddr: "", //会议地点
        meetingHost: "", //会议主持人
        meetingJoiner: "", //会议参与人
        meetingContent: "" //会议内容
      }
    },
    // 查看
    meetingCheck(row) {
      this.meetingDialog = true
      this.dialogTitle = "查看会议纪要"
      this.dialogFlag = "check"
      // 回填单挑记录相关信息
      this.getRowInfo(row.id).then(data => Object.assign(this.meetingMinute, data))
      // 查询会议纪要修改记录
      this.getMeetingRecord(row.id)
    },
    // 修改
    meetingEdit(row) {
      this.meetingDialog = true
      this.dialogTitle = "修改会议纪要"
      this.dialogFlag = "edit"
      // 回填单挑记录相关信息
      this.getRowInfo(row.id).then(data => {
        Object.assign(this.meetingMinute, data)
        this.meetingMinuteRecord = JSON.parse(JSON.stringify(this.meetingMinute))
      })
      // 查询会议纪要修改记录
      this.getMeetingRecord(row.id)
    },
    // 修改并保存会议纪要(更新会议纪要)
    meetingUpdate(refs) {
      this.$refs[refs].validate(valid => {
        if (valid) {
          // 获取格式化字段后的附件信息
          const fileList = this.getUploadFileInfo()
          // 会议纪要修改记录
          const entries = this.meetingMinuteEntries
          let modifyTxt = entries.reduce((str, v) => {
            const pre = this.meetingMinuteRecord[v.key]
            const current = this.meetingMinute[v.key]
            if (pre !== current) {
              str += `${v.text}由${pre || "空"}修改为${current || "空"},`
            }
            return str
          }, ``)
          // 附件修改记录
          modifyTxt += this.handleUploadChange(fileList)
          modifyTxt = modifyTxt.replace(/,$/, "。")
          if (modifyTxt.length) {
            PUT(process.env.VUE_APP_DOMAIN_administration + "/meeting/record/update", Object.assign(this.meetingMinute, { modifyTxt, fileList }))
              .then(res => {
                this.$message({
                  message: res.msg || "保存成功",
                  type: "success"
                })
                // 刷新列表
                this.meetingList()
                // 清空弹出层数据
                this.$refs[refs].resetFields()
                // 隐藏弹出层
                this.meetingDialog = false
                // 清除附件
                if (this.uploadFileList.length) {
                  this.$refs["meetingUpload"].clearFiles()
                  this.uploadFileList = []
                  this.uploadFileListRecord = []
                }
              })
              .catch(err => {
                console.log(err)
              })
          }
        } else {
          return false
        }
      })
    },
    // 查询会议纪要修改记录
    getMeetingRecord(recordId) {
      POST(process.env.VUE_APP_DOMAIN_administration + "/meeting/recordModifyLog/list", { recordId, size: 20, current: 1 }).then(res => {
        this.updateData = res.data.records
      })
    },
    // 取消会议保存会议纪要
    meetingCancel(refs) {
      this.meetingDialog = false
      // 清除附件
      if (this.uploadFileList.length) {
        this.$refs["meetingUpload"].clearFiles()
        this.uploadFileList = []
        this.uploadFileListRecord = []
      }
      this.$refs[refs].resetFields()
    },
    // 保存会议纪要
    meetingSave(refs) {
      this.$refs[refs].validate(valid => {
        if (valid) {
          // 获取附件信息
          const fileList = this.getUploadFileInfo()
          POST(process.env.VUE_APP_DOMAIN_administration + "/meeting/record/save", Object.assign(this.meetingMinute, { fileList }))
            .then(res => {
              this.$message({
                message: res.msg || "保存成功",
                type: "success"
              })
              // 刷新列表
              this.meetingList()
              // 清空弹出层数据
              this.$refs[refs].resetFields()
              // 隐藏弹出层
              this.meetingDialog = false
              // 清除附件
              if (this.uploadFileList.length) {
                this.$refs["meetingUpload"].clearFiles()
                this.uploadFileList = []
                this.uploadFileListRecord = []
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          return false
        }
      })
    },
    // 获取需要保存到后端的附件信息(即需要改变附件对应字段)
    getUploadFileInfo() {
      const arr = []
      this.uploadFileList.forEach(file => {
        arr.push({ fileId: file.id || file.response.data, fileName: file.name, fileSize: file.size, fileAddr: this.uploadUrl })
      })
      return arr
    },
    // 上传 文件格式pdf、xls、xlsx、doc、docx WAV、MP3、MP4、WMA
    // 修改附件信息记录
    handleUploadChange(fileList) {
      // console.log("上传附件变化时", file, fileList, this.uploadFileList)
      let modify = ``,
        maxFiles = fileList,
        minFiles = this.uploadFileListRecord,
        modifyStr = "上传了附件"
      if (maxFiles.length < minFiles.length) {
        maxFiles = this.uploadFileListRecord
        minFiles = fileList
        modifyStr = "删除了附件"
      }
      modify = maxFiles.reduce((str, file) => {
        const preFile = minFiles.find(f => f.fileId === file.fileId)
        if (preFile) {
          if (file.fileSize !== preFile.fileSize) {
            str += `修改了附件${file.fileName},`
          }
        } else {
          str += `${modifyStr}${file.fileName},`
        }
        return str
      }, modify)
      return modify
    },
    // 上传之前的操作
    beforeUploadFile(file) {
      //上传文件之前的钩子
      let fileType = file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase() //截取文件后缀
      const extension = fileType === "pdf" || fileType === "xls" || fileType === "xlsx" || fileType === "doc" || fileType === "docx" || fileType === "wav" || fileType === "mp3" || fileType === "mp4" || fileType === "wma"
      const verifyFileSize = file.size <= 100 * 1024 * 1024 //100Mb
      if (!extension) {
        this.$message.error("上传数据文件只能是 pdf、xls、xlsx、doc、docx、WAV、MP3、MP4、WMA 格式!")
        return false
      } else if (!verifyFileSize) {
        this.$message.error("上传数据文件大小不能超过100Mb!")
        return false
      }
      this.uploadLoading = true
      return true
    },
    // 文件列表移除文件时的钩子
    handleRemoveFile(file, fileList) {
      this.uploadFileList = fileList
    },
    // 上传成功之后的操作
    handleSuccessFile(response, file, fileList) {
      this.uploadLoading = false
      if (response.code === 0) {
        this.uploadFileList = fileList
      } else {
        //失败
        this.$msgBox.alert('<span style="color:red;">【文件' + file.name + "上传失败，请稍后重试】。</span>", "温馨提示", {
          dangerouslyUseHTMLString: true
        })
      }
      // console.log("上传成功之后", response, file, fileList, this.uploadFileList)
    },
    // 上传失败
    handleErrorFile(err, file) {
      this.uploadLoading = false
      // console.log("上传失败之后", err, file, fileList)
      // if (typeof err.message === "string") {
      //   err.message = JSON.parse(err.message)
      // }
      //失败
      this.$msgBox.alert('<span style="color:red;">【文件' + file.name + "上传失败，" + ((err.message && err.message.message) || "") + "】。</span>", "温馨提示", {
        dangerouslyUseHTMLString: true
      })
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePreviewFile(file) {
      const key = file.id || file.response.data
      // 下载查看附件
      let url = `${process.env.VUE_APP_DOMAIN_download}/oss/download?key=${key}&name=${file.name}`
      window.location.href = url
    },
    //根据员工编号获取操作人个人信息
    getUserInfo(num) {
      GET(process.env.VUE_APP_DOMAIN_personnel + "/queryUserInfoToRegid", { regid: num })
        .then(res => {
          this.personalInfoData = res.data
          this.personalInfoData.employedDates = this.personalInfoData.employedDates.split(" ")[0]
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  created() {
    this.headers["x-user-token"] = localStorage.getItem("oldToken") //设置上传数据文件的token
  },
  mounted() {
    // 加载会议纪要数据
    this.meetingList()
  }
}
</script>
<style lang="less" scoped>
.margin-left-10 {
  margin-left: 10px;
}
.table_wrap {
  clear: both;
}
.overflow-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.meeting-dialog-btn {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  padding: 5px 0;
}
// 修改记录样式
.meeting-dialog-container {
  position: relative;
  // overflow-x: hidden;
  // overflow-y: auto;
  width: 100%;
  // max-height: 700px;
  .meeting-dialog-update-outer {
    & > article {
      font-size: 16px;
      color: #000;
    }
    & > hr {
      margin: 10px 0;
    }
    .meeting-dialog-update-context {
      overflow-x: hidden;
      overflow-y: auto;
      max-height: 160px;
      margin-top: 10px;
      border: 1px solid #ccc;
      .meeting-dialog-update {
        border-top: 1px solid #ccc;
        &:first-child {
          border-top: none;
        }
      }
    }
  }
}
.meeting-pagination {
  display: flex;
  flex-direction: row-reverse;
}
// 调整上传文件列表样式
// .el-form-item--small.el-form-item {
//   margin-bottom: 10px;
// }
.el-upload-list__item:first-child {
  margin-top: 5px;
}
.el-upload-list {
  display: flex;
  flex-wrap: wrap;
}
.el-upload-list__item {
  width: 50%;
}
</style>