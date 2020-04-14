<template>
  <div class="comope_config">
    <div class="pull-left">
      <el-form :inline="true" class="mar-no" label-position="right">
        <el-form-item label="统计年月">
          <el-date-picker
            v-model="batch"
            :editable="false"
            :clearable="false"
            type="month"
            value-format="yyyy-MM"
            class="width110"
            placeholder="选择月"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="JS_search" icon="el-icon-search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="pull-right">
      <el-dropdown trigger="click" @command="handleCommand">
        <el-button type="primary">
          更多操作
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            command="a"
            class="cloud-uploadBtn"
            v-if="permissions(permissionsMapObj['操作-导入'])"
          >
            <i></i>&nbsp;导入
          </el-dropdown-item>
          <el-dropdown-item
            command="b"
            divided
            icon="el-icon-plus"
            v-if="permissions(permissionsMapObj['操作-添加'])"
          >新增</el-dropdown-item>
          <el-dropdown-item command="c" divided v-if="permissions(permissionsMapObj['操作-复制'])">
            <i class="el-icon-circle-plus-outline"></i>复制
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="table_wrap">
      <el-table
        :data="comopeConfigTbData"
        v-loading="loading"
        :height="dataListObj.dataInfo.t_height"
        border
        style="width:100%"
        :header-cell-style="{backgroundColor:'#e5e9f3'}"
      >
        <el-table-column type="index" label="序号" min-width="50"></el-table-column>
        <el-table-column prop="batch" label="统计年月" min-width="80"></el-table-column>
        <el-table-column prop="businessName" label="业务名称" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="orderNo" label="排序号" min-width="60" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="提交时间" min-width="150"></el-table-column>
        <el-table-column label="提交人" min-width="120">
          <template slot-scope="scope">
            <el-popover
              v-if="scope.row.createUserName||scope.row.updateUserName"
              trigger="click"
              placement="top"
              @show="getUserInfo(scope.row.createUserId||scope.row.updateUserId)"
              width="450"
            >
              <!-- S -->
              <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
              <!-- E -->
              <div slot="reference" class="name-wrapper">
                <el-button size="mini">{{scope.row.createUserName||scope.row.updateUserName}}</el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="最后更新时间" min-width="150"></el-table-column>
        <el-table-column prop="updateUserName" label="更新人" min-width="120">
          <template slot-scope="scope">
            <el-popover
              v-if="scope.row.updateUserName||scope.row.createUserName"
              trigger="click"
              placement="top"
              @show="getUserInfo(scope.row.updateUserId||scope.row.createUserId)"
              width="450"
            >
              <!-- S -->
              <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
              <!-- E -->
              <div slot="reference" class="name-wrapper">
                <el-button size="mini">{{scope.row.updateUserName||scope.row.createUserName}}</el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          min-width="100"
          v-if="permissions(permissionsMapObj['操作-修改']) || permissions(permissionsMapObj['操作-修改'])"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="updateThis(scope.row.id)"
              v-if="permissions(permissionsMapObj['操作-修改'])"
            >修改</el-button>
            <el-button
              type="text"
              size="small"
              class="deleteTxt"
              @click="deleteThis(scope.row.id)"
              v-if="permissions(permissionsMapObj['操作-删除'])"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div id="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handlecurrentChange"
          background
          :current-page="configPageObj.current"
          :page-sizes="[10,15,20,30,40]"
          :page-size="configPageObj.size"
          layout="total,sizes,prev,pager,next,jumper"
          :total="configPageObj.total"
        ></el-pagination>
      </div>

      <!-- 导入业务类型弹框 -->
      <el-dialog
        title="导入业务类型"
        :close-on-click-modal="false"
        :show-close="false"
        :visible.sync="exportEx"
        width="580px"
      >
        <div>
          <el-form
            :model="exportExform"
            :rules="exportExformRule"
            ref="exportExform"
            label-width="100px"
          >
            <el-row>
              <el-col :md="24">
                <el-form-item label="统计月份" prop="month">
                  <el-date-picker
                    style="width:420px"
                    v-model="exportExform.month"
                    type="month"
                    :editable="false"
                    :clearable="false"
                    value-format="yyyy-MM"
                    placeholder="选择月"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :md="24">
                <el-form-item label="选择文件">
                  <p class="clearfix" style="margin-top:6px;">
                    <el-upload
                      :multiple="false"
                      :limit="1"
                      class="pull-left"
                      ref="upload"
                      :data="{batch:exportExform.month}"
                      :auto-upload="false"
                      :action="uploadActionUrl"
                      :headers="headers"
                      :before-remove="beforeRemove"
                      :before-upload="beforeUpload"
                      :on-change="changeUpload"
                      :on-success="handleSuccess"
                      :file-list="fileList"
                    >
                      <el-button slot="trigger" size="small" icon="el-icon-upload">选取文件</el-button>
                      <el-button
                        style="margin-left: 10px;"
                        size="small"
                        type="success"
                        @click="submitUpload('exportExform')"
                      >上传文件</el-button>
                      <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
                    </el-upload>
                  </p>
                </el-form-item>
              </el-col>
              <el-col :md="16">
                <div
                  style="padding-left:30px;line-height:30px;color:red;margin-top:10px;"
                >注：导入成功后，会立刻覆盖当前版本</div>
              </el-col>
              <el-col :md="8">
                <div class="fileBox" style="margin-top:10px;text-align:right;padding-right:10px">
                  <span class="filename excel">
                    <el-button type="text" class="underlineTxt" @click.stop="JS_download_model">下载模板</el-button>
                  </span>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer" style="padding-right: 18px;">
          <el-button type="primary" @click="fileClose('exportExform')">关闭</el-button>
        </span>
      </el-dialog>

      <!-- 导入进度条信息 -->
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

      <!-- 新增/修改 弹框 -->
      <el-dialog
        title="新增/修改业务类型"
        :before-close="handleDialogBeforeClose"
        :close-on-click-modal="false"
        :visible.sync="updateDialog"
        width="768px"
      >
        <div class="whiteBox">
          <p class="pReset">编辑信息</p>
          <el-form
            ref="updateConditionform"
            label-width="150px"
            :model="updateConditionform"
            :rules="updateConditionformRule"
          >
            <el-row>
              <el-col :md="12">
                <el-form-item label="统计年月:" label-width="85px" prop="batch">
                  <el-date-picker
                    v-model="updateConditionform.batch"
                    :editable="false"
                    :clearable="false"
                    type="month"
                    value-format="yyyy-MM"
                    class="width150"
                    placeholder="选择年月"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item label="业务名称:" prop="businessName" label-width="120px">
                  <el-input
                    type="text"
                    v-model="updateConditionform.businessName"
                    placeholder="请输入业务名称"
                    clearable
                    class="width150"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :md="11">
                <el-form-item label="排序号:" prop="orderNo" label-width="85px">
                  <el-input-number
                    :controls="false"
                    type="text"
                    v-model="updateConditionform.orderNo"
                    :min="0"
                    :max="1000000000"
                    placeholder="请输入排序号"
                    style="width:220px "
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :md="13">
                <el-form-item label-width="0">数字越大越靠前</el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="JS_cancel('updateConditionform')">取消</el-button>
          <el-button type="primary" @click="JS_update('updateConditionform')" v-no-more-click>确定</el-button>
        </span>
      </el-dialog>

      <!-- 复制 弹框 -->
      <el-dialog
        title="复制业务类型"
        :before-close="handleCopyDialogBeforeClose"
        :close-on-click-modal="false"
        :visible.sync="copyDialog"
        width="600px"
      >
        <div class="whiteBox">
          <el-form
            ref="copyConditionform"
            :model="copyConditionform"
            :rules="copyConditionformRule"
          >
            <el-row>
              <el-col :md="12">
                <el-form-item label="统计年月" prop="source" label-width="85px">
                  <el-date-picker
                    v-model="copyConditionform.source"
                    @change="sourceDateChange"
                    :editable="false"
                    :clearable="false"
                    type="month"
                    value-format="yyyy-MM"
                    class="width150"
                    placeholder="选择年月"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item label-width="85px">
                  <span>该月份已存在业务{{countObj.source}}条</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :md="12">
                <el-form-item label="复制到" prop="target" label-width="85px">
                  <el-date-picker
                    v-model="copyConditionform.target"
                    @change="targetDateChange"
                    :editable="false"
                    :clearable="false"
                    type="month"
                    value-format="yyyy-MM"
                    class="width150"
                    placeholder="选择年月"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item label-width="85px">
                  <span>该月份已存在业务{{countObj.target}}条</span>
                </el-form-item>
              </el-col>
            </el-row>
            <p class="pReset" style="color:red;margin-left:20px">注：复制成功，会覆盖复制月份的业务名称！</p>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="JS_CopyDialogCancel('copyConditionform')">取消</el-button>
          <el-button type="primary" @click="JS_confirmCopy('copyConditionform')">确定复制</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { GET, POST, DELETE } from "http/custom.js"
import Tools from "untils/index.js"

export default {
  name: "comope_config",
  components: {},
  props: {
    dataListObj: {
      type: Object,
      required: true,
      default: () => {
        return {
          dataInfo: {} //接收到父组件中的 dataObj ，里面会有多个数组
        }
      }
    }
  },
  data() {
    const uploadActionUrl = process.env.VUE_APP_DOMAIN_quote + "/biztype/importExcel" //导入action
    let yd = Tools.getPYd() //获取上个月 格式为 yyyy-MM
    let ydb = Tools.getYd() //获取本月 格式为 yyyy-MM
    return {
      //搜索条件相关
      batch: yd, //年月
      //table相关
      comopeConfigTbData: [], //表格数据源数组
      loading: false, //table加载动画开关
      configPageObj: {
        size: 15, //每页显示记录条数
        current: 1, //当前页码
        total: 0 //总记录数据
      },
      // 新增-修改
      updateDialog: false, //新增-修改窗
      updateConditionform: {
        id: "", //默认id为空
        batch: "", //年月
        businessName: "", //业务类型名称
        orderNo: undefined //排序
      },
      updateConditionformRule: {
        batch: [{ required: true, message: "请选择年月", trigger: "change" }], //年月
        businessName: [{ required: true, message: "请填写业务名称", trigger: "blur" }], //业务名称
        orderNo: [{ required: true, message: "请填写排序", trigger: "blur" }] //排序
      },
      // 复制业务类型
      copyDialog: false, //复制弹窗
      copyConditionform: {
        source: yd,
        target: ydb
      },
      copyConditionformRule: {
        source: [{ required: true, message: "请选择统计年月", trigger: "change" }],
        target: [{ required: true, message: "请选择复制月份", trigger: "change" }]
      },
      countObj: {
        source: "--",
        target: "--"
      },
      //导入相关
      uploadActionUrl, // 导入url
      headers: {},
      exportEx: false,
      fileList: [], //上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
      exportExform: {
        month: "" //月份
      },
      exportExformRule: {
        month: [{ required: true, message: "请选择月份", trigger: "change" }]
      },
      //进度条相关参数
      importProcessInfoDialog: false, //取消进度条框
      importError: false, // 导入错误时呈现的进度
      downloadErrorEveProcess: false, //获取错误下载key
      loadErrorExcel: false, //呈现失败下载明细
      downloadErrorKey: "", //导入错误下载excel key
      progressPercentAge: 0,
      progressBackBtn: false, //返回按钮
      uploadProcessInfo: {
        total: "", //总条数
        handler: "", //已处理条数
        successful: "", //处理成功条数
        failures: "", //处理失败条数
        finish: false, //是否处理完成
        dealAllTime: "" //总耗时
      },
      personalInfoData: {}, //姓名popover弹窗数据
      permissionsMapObj: {
        //老系统action权限映射对象
        "操作-复制": "bec0baadebf64992a590d523dbbe1c83",
        "操作-修改": "d0a513c881ad4bcab2028554db035874",
        "操作-导入": "d1049648a0ae430498e8433f2ae8fc79",
        "操作-删除": "e6cf9e0c51e04f14be758276881e0c3a",
        "操作-添加": "e999a0c130654c71a51730b8816d17f2"
      }
    }
  },
  computed: {
    permissions() {
      //通过老oa配置的id,判断当前 用户是否有对应的权限
      return powerid => {
        return Tools.includes(this.$store.state.userActionAll, powerid)
      }
    }
  },
  methods: {
    handleCommand(command) {
      //更多操作下拉框
      switch (command) {
        case "a":
          this.exportEx = true //导入
          break
        case "b":
          this.updateDialog = true //新增-修改
          break
        case "c":
          this.openCopyDialog() //复制
          break
        default:
          console.log("switch default")
          break
      }
    },
    handlecurrentChange(val) {
      //点击页码，当前页
      this.configPageObj.current = val //保存状态-当前页
      this.search()
    },
    handleSizeChange(val) {
      //每页显示多少条数据切换
      this.configPageObj.size = val //保存状态-每页显示多少条数据切换
      this.search()
    },
    JS_search() {
      this.configPageObj.current = 1 //点击搜索current=1搜索第一页
      this.search()
    },
    search() {
      //mohan 列表查询
      let searchObj = {
        //查询对象,在这里初始化,初始化值都是取this下面的
        current: this.configPageObj.current, //当前页码
        size: this.configPageObj.size, //每页显示记录条数
        batch: this.batch //年月（批次号）
      }
      console.log("搜索对象", searchObj)
      this.loading = true //开启动画
      POST(process.env.VUE_APP_DOMAIN_quote + "/biztype/pageList", searchObj)
        .then(res => {
          this.loading = false //关闭动画
          this.comopeConfigTbData = res.data.records //set表格的值
          this.configPageObj.current = res.data.current //set当前页
          this.configPageObj.size = res.data.size //每页显示记录条数
          this.configPageObj.total = res.data.total //总记录条数
        })
        .catch(error => {
          console.log(error)
        })
    },
    handleDialogBeforeClose() {
      this.updateDialog = false //隐藏弹框
      this.$refs.updateConditionform.resetFields() //重置表单
      this.updateConditionform.id = "" //重置修改id
    },
    updateThis(id) {
      //修改查看详情
      this.updateDialog = true //弹出新增修改框
      //下面是填充表单数据
      GET(`${process.env.VUE_APP_DOMAIN_quote}/biztype/info/${id}`)
        .then(res => {
          this.updateConditionform = { ...res.data, ...{ id } }
        })
        .catch(error => {
          console.log(error)
        })
    },
    JS_update(formName) {
      //新增保存-修改
      this.$refs[formName].validate(valid => {
        if (valid) {
          let saveObj = this.updateConditionform //保存对象
          let successMsg
          if (saveObj.id === "") {
            //新增
            successMsg = "新增数据成功"
          } else {
            successMsg = "修改数据成功"
          }
          POST(process.env.VUE_APP_DOMAIN_quote + "/biztype/edit", saveObj)
            .then(res => {
              console.log(res)
              this.updateConditionform.id = "" //重置修改id
              this.$message({
                type: "success",
                message: successMsg,
                showClose: true
              })
              this.updateDialog = false //关闭新增修改弹框
              this.resetAndSearch(formName) //重置表单重新获取数据
            })
            .catch(error => {
              console.log(error)
            })
        }
      })
    },
    deleteThis(id) {
      //单个删除
      this.$msgBox
        .confirm("你确定要删除该条数据吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          DELETE(process.env.VUE_APP_DOMAIN_quote + "/biztype/delete", {
            ids: id
          })
            .then(() => {
              //单条数据删除
              this.$message({
                type: "success",
                message: "删除成功!"
              })
              this.JS_search() //刷新表格，重新获取数据
            })
            .catch(error => {
              console.log(error)
            })
        })
        .catch(() => {
          console.log("已取消删除")
        })
    },
    JS_cancel(formName) {
      //取消  重置表单
      this.updateDialog = false //隐藏弹框
      this.$refs[formName].resetFields()
      this.updateConditionform.id = "" //重置修改id
    },
    resetAndSearch(formName) {
      //清除表单且重新搜索
      this.$refs[formName].resetFields()
      this.search() //刷新表格，重新获取数据
    },
    JS_CopyDialogCancel(formName) {
      //取消复制弹框
      this.copyDialog = false
      this.$refs[formName].resetFields()
    },
    handleCopyDialogBeforeClose() {
      //点击弹框右上角X图标
      const { JS_CopyDialogCancel } = this
      JS_CopyDialogCancel("copyConditionform")
    },
    JS_confirmCopy(formName) {
      //确定复制
      this.$refs[formName].validate(valid => {
        if (valid) {
          let saveObj = this.copyConditionform //保存对象
          GET(process.env.VUE_APP_DOMAIN_quote + "/biztype/copy", saveObj)
            .then(() => {
              this.$message({
                type: "success",
                message: "复制成功!",
                showClose: true
              })
              this.copyDialog = false //关闭弹框
              this.$refs[formName].resetFields()
              this.JS_search() //刷新表格，重新获取数据
            })
            .catch(error => {
              console.log(error)
            })
        }
      })
    },
    openCopyDialog() {
      //打开复制弹框
      this.copyDialog = true
      this.sourceDateChange(this.copyConditionform.source) //统计年月
      this.targetDateChange(this.copyConditionform.target) //复制到年月
    },
    async getCountByMonth(batch) {
      //根据月份查询业务条数
      const count = await GET(process.env.VUE_APP_DOMAIN_quote + "/biztype/count", { batch })
        .then(res => {
          return res.data
        })
        .catch(error => {
          console.log(error)
          return "--"
        })
      return count
    },
    sourceDateChange(val) {
      this.getCountByMonth(val).then(count => {
        //统计年月
        this.countObj.source = count
      })
    },
    targetDateChange(val) {
      this.getCountByMonth(val).then(count => {
        //复制到年月
        this.countObj.target = count
      })
    },

    //导入相关
    beforeRemove(file) {
      //删除文件之前的钩子
      return this.$msgBox.confirm(`确定移除 ${file.name}?`)
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
    changeUpload(file, fileList) {
      //文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
      console.log("change", file)
      console.log("fileList", fileList)
    },
    handleSuccess(res) {
      //上传文件接口调取成功回调
      this.exportEx = false
      if (res.code === 0) {
        //文件上传成功或者部分成功
        this.downloadErrorEveProcess = res.data //获取进度条事件句柄
        //错误导入进度条与下载模板
        this.importProcessInfoDialog = true
        this.queryProgress() //获取上传文件进度条信息
      } else {
        let msgError = res.msg || "【系统无法识别EXCLE中的空白，公式和非法字符。请先清理】。" //500非0情况
        this.$msgBox.alert(`<span style="color:red;">${msgError} </span>`, "温馨提示", {
          dangerouslyUseHTMLString: true
        })
      }
      this.$refs.upload.clearFiles() //清空已上传的文件列表（该方法不支持在 before-upload 中调用）
    },
    submitUpload(formName) {
      //上传文件
      console.log("上传文件", this.$refs.upload.uploadFiles.length)
      if (this.$refs.upload.uploadFiles.length == 0) {
        this.$message({
          showClose: true,
          type: "warning",
          message: "请选取文件！"
        })
        return
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$refs.upload.submit() //手动上传
        } else {
          this.$message({
            showClose: true,
            type: "warning",
            message: "文件或月份不能为空，验证不通过！"
          })
        }
      })
    },
    JS_download_model() {
      //下载模板
      GET(process.env.VUE_APP_DOMAIN_personnel + "/queryBizFilesTemplate", {
        fileCode: "QUOTE_BIZTYPE_IMPORT_TEMPLATE"
      })
        .then(res => {
          //获取模板存储返回的ID
          window.location.href = process.env.VUE_APP_DOMAIN_download + "/oss/download?key=" + res.data.fileTemplateId + "&name=" + res.data.fileTemplateName + "." + res.data.fileTemplateSuffix
        })
        .catch(error => {
          console.log(error)
        })
    },
    fileClose(formName) {
      //清除表单
      this.exportEx = false
      this.$refs[formName].resetFields()
      this.$refs.upload.clearFiles() //清空已上传的文件列表（该方法不支持在 before-upload 中调用）
    },
    unloadErrorLink() {
      //导入错误模板下载
      console.log("downloadErrorKey", this.downloadErrorKey)
      let url = process.env.VUE_APP_DOMAIN_download + "/oss/download?key=" + this.downloadErrorKey + "&token=" + localStorage.getItem("token") + "&name=" + encodeURI("配置业务类型失败明细") + ".xlsx"
      window.location.href = url
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
    //根据员工Regid获取个人信息
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
    this.headers["x-user-token"] = localStorage.getItem("token") //设置上传数据文件excel的token
    this.search() //获取表格列表分页初始化数据
  }
}
</script>

