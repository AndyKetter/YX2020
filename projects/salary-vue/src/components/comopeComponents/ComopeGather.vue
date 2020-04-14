<template>
  <div class="comope_gather">
    <div class="pull-left">
      <el-form :inline="true" class="mar-no" label-position="right">
        <el-form-item label="统计年月">
          <el-date-picker
            v-model="batch"
            :editable="false"
            :clearable="false"
            type="month"
            value-format="yyyy-MM"
            class="width155"
            placeholder="选择年月"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="系统名称" v-if="permissions(permissionsMapObj['系统名称'])">
          <el-select filterable clearable v-model="catrgoryId" placeholder="请选择" class="width155">
            <el-option
              v-for="item in systemNameOptions"
              :key="item.id"
              :label="item.categoryTypeName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" icon="el-icon-search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="pull-right">
      <el-button
        size="small"
        slot="reference"
        class="cloud-downloadBtn"
        @click="exportDialog = true"
        v-if="permissions(permissionsMapObj['导出'])"
      >
        <i></i>&nbsp;导出
      </el-button>
    </div>
    <div class="table_wrap">
      <el-table
        :data="comopeGatherTbData"
        v-loading="loading"
        :height="dataListObj.dataInfo.t_gather_height"
        border
        style="width:100%"
        :header-cell-style="{backgroundColor:'#e5e9f3'}"
      >
        <el-table-column type="index" label="序号" min-width="50"></el-table-column>
        <el-table-column prop="systemName" label="系统名称" min-width="80"></el-table-column>
        <el-table-column prop="source" label="数据源" min-width="150"></el-table-column>
        <el-table-column label="提交状态" min-width="100">
          <template slot-scope="scope">
            <span style="color:red;" v-if="scope.row.commitState === 0">未提交</span>
            <span v-else-if="scope.row.commitState === 1">已提交</span>
          </template>
        </el-table-column>
        <el-table-column label="提交时间" min-width="150">
          <template slot-scope="scope">{{scope.row.createTime | repair}}</template>
        </el-table-column>
        <el-table-column label="提交人" min-width="120">
          <template slot-scope="scope">
            <el-popover
              v-if="scope.row.createUserName"
              trigger="click"
              placement="top"
              @show="getUserInfo(scope.row.createUserId)"
              width="450"
            >
              <!-- S -->
              <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
              <!-- E -->
              <div slot="reference" class="name-wrapper">
                <el-button size="mini">{{scope.row.createUserName}}</el-button>
              </div>
            </el-popover>
            <span v-else style="padding-left:15px;">{{scope.row.createUserName | repair}}</span>
          </template>
        </el-table-column>
        <el-table-column label="最后更新时间" min-width="150">
          <template slot-scope="scope">{{scope.row.updateTime | repair}}</template>
        </el-table-column>
        <el-table-column prop="updateUserName" label="更新人" min-width="120">
          <template slot-scope="scope">
            <el-popover
              v-if="scope.row.updateUserName"
              trigger="click"
              placement="top"
              @show="getUserInfo(scope.row.updateUserId)"
              width="450"
            >
              <!-- S -->
              <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
              <!-- E -->
              <div slot="reference" class="name-wrapper">
                <el-button size="mini">{{scope.row.updateUserName}}</el-button>
              </div>
            </el-popover>
            <span v-else style="padding-left:15px;">{{scope.row.updateUserName | repair}}</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 导出-->
      <el-dialog
        title="导出"
        :close-on-click-modal="false"
        :show-close="false"
        :visible.sync="exportDialog"
        width="600px"
      >
        <div>
          <el-form
            label-width="150px"
            :model="exportExform"
            :rules="exportExformRule"
            ref="exportExform"
          >
            <el-row>
              <el-col :md="10">
                <el-form-item label="统计年月" label-width="85px" prop="batch">
                  <el-date-picker
                    v-model="exportExform.batch"
                    :clearable="false"
                    :editable="false"
                    style="width:120px"
                    type="month"
                    value-format="yyyy-MM"
                    placeholder="选择年月"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item label="导出方式" label-width="85px" prop="exportType">
                  <el-select
                    placeholder="请选择"
                    v-model="exportExform.exportType"
                    style="width:240px"
                    filterable
                  >
                    <el-option
                      v-for="item in exportTypeOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="JS_exportCancel('exportExform')">取消</el-button>
          <el-button type="primary" @click="JS_exportSave('exportExform')">确定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Tools from "../../untils/index.js"
import { GET, POST } from "http/custom.js"

export default {
  name: "comope_gather",
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
    let yd = Tools.getPYd() //获取上个月 格式为 yyyy-MM
    return {
      personalInfoData: {}, //姓名popover弹窗数据
      //查询条件相关
      batch: yd, //年月
      catrgoryId: "", //系统名称id
      systemNameOptions: [],
      //table相关
      comopeGatherTbData: [], //表格数据源数组
      loading: false, //table加载动画开关
      //导出相关
      exportDialog: false, //导出弹窗
      exportExform: {
        batch: yd, //月份
        exportType: "" //导出方式
      },
      exportExformRule: {
        batch: [{ required: true, message: "请选择月份", trigger: "change" }],
        exportType: [{ required: true, message: "请选择导出方式", trigger: "change" }]
      },
      exportTypeOption: [
        //导出方式
        { value: 1, label: "保存至本地（需要等待数秒至数分钟）" },
        { value: 2, label: "发送至本人内网邮箱" }
      ],
      permissionsMapObj: {
        //老系统action权限映射对象
        导出: "78c69559ee1743d3b8c731c4e4beb5de",
        系统名称: "bf773068aad04b75a6f42fdab6bc68b7"
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
    },
    //table分页相关
    search() {
      //mohan 列表查询
      let searchObj = {
        //查询对象,在这里初始化,初始化值都是取this下面的
        batch: this.batch, //年月（批次号）
        catrgoryId: this.catrgoryId //系统名称id
      }
      console.log("搜索对象", searchObj)
      this.loading = true //开启动画
      POST(`${process.env.VUE_APP_DOMAIN_quote}/quotesubmission/list?batch=${searchObj.batch}&catrgoryId=${searchObj.catrgoryId || ""}`)
        .then(res => {
          this.loading = false //关闭动画
          this.comopeGatherTbData = res.data //set表格的值
        })
        .catch(error => {
          console.log(error)
        })
    },
    getSystemName() {
      //获取系统名称字典
      POST(process.env.VUE_APP_DOMAIN_quote + "/quotecategory/list", { categoryType: 1 })
        .then(res => {
          this.systemNameOptions = res.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    //导出相关
    JS_exportCancel(formName) {
      //清除表单
      this.exportDialog = false
      this.$refs[formName].resetFields()
    },
    JS_exportSave(formName) {
      //确认保存
      this.$refs[formName].validate(valid => {
        if (valid) {
          let saveObj = {
            batch: this.exportExform.batch, //月份
            exportType: this.exportExform.exportType //导出方式
          }
          if (saveObj.exportType === 2) {
            //发送邮件
            this.$message({
              type: "success",
              message: "发送邮件成功!",
              showClose: true
            })
            GET(process.env.VUE_APP_DOMAIN_quote + "/exportData", {
              batch: saveObj.batch,
              exportType: saveObj.exportType
            })
              .then(res => {
                console.log(res)
              })
              .catch(error => {
                console.log(error)
              })
          }
          if (saveObj.exportType === 1) {
            //下载到本地
            window.location.href = `${process.env.VUE_APP_DOMAIN_quote}/exportData?batch=${saveObj.batch}&exportType=${saveObj.exportType}&token=${localStorage.getItem("token")}`
          }
          this.exportDialog = false //关闭弹框
        } else {
          this.$message({
            showClose: true,
            type: "warning",
            message: "下载失败，验证不通过"
          })
        }
      })
    }
  },
  created() {
    this.getSystemName() //获取系统名称字典
    this.search() //获取表格列表分页初始化数据
  }
}
</script>
