<template>
  <div class="talent-table">
    <div class="guide">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home/personnelSystem' }">人事系统</el-breadcrumb-item>
        <el-breadcrumb-item>其它</el-breadcrumb-item>
        <el-breadcrumb-item>人才引进</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/personnelSystem' }">(返回上级)</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="bgWhite mgt15">
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="人才引进报表" name="first">
          <div class="pull-left">
            <el-form :inline="true" :model="talentSearch" class="mar-no pull-left">
              <el-form-item label="内推人">
                <el-input v-model="talentSearch.name" placeholder="请输入名字" class="width155"></el-input>
              </el-form-item>
              <el-form-item label="员工编号">
                <el-input v-model="talentSearch.staffNum" placeholder="请输入编号" class="width155"></el-input>
              </el-form-item>
              <el-form-item label="身份证号">
                <el-input v-model="talentSearch.idCard" placeholder="请输入号码" class="width155"></el-input>
              </el-form-item>
              <el-form-item label="按时间段查询" class="hidden-1440">
                <el-date-picker style="width:273px" v-model="talentSearch.time" type="daterange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search">搜索</el-button>
                <!-- 此处要注意：在1440及以下分辨率需要显示   更多查询  。更多查询框也需要做查询 -->
                <el-button icon="el-icon-search" @click="search_more=true" class="visible-1440">更多查询</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="pull-right">
            <el-dropdown @command="handleCommand" trigger="click">
              <el-button type="primary">
                更多操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a" class="cloud-uploadBtn"><i></i>&nbsp;导入</el-dropdown-item>
                <el-dropdown-item command="b" divided class="cloud-downloadBtn"><i></i>&nbsp;导出</el-dropdown-item>
                <el-dropdown-item command="c" divided icon="el-icon-plus">新增</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>&nbsp;
            <el-button size="small" type="danger" v-if="SubmitStu==false" @click="JS_submit">提交数据</el-button>
            <el-button size="small" v-else @click="cancel_submit">撤回数据</el-button>
          </div>
          <div class="table_wrap">
            <el-table :data="talentData" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
              <el-table-column prop="index" label="序号"></el-table-column>
              <el-table-column label="内推人">
                <template slot-scope="scope">
                  <el-popover trigger="hover" placement="top" width="450">
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{name:scope.row.ntr}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.ntr}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="员工编号">
                <template slot-scope="scope">
                  <span>{{scope.row.workerNum}}</span><i class="el-icon-phone tbIconPhone"></i>
                </template>
              </el-table-column>
              <el-table-column prop="idCard" label="身份证号" width="160"></el-table-column>
              <el-table-column prop="area" label="所属区域"></el-table-column>
              <el-table-column prop="department" label="所属部门"></el-table-column>
              <el-table-column prop="workerStatus" label="员工状态"></el-table-column>
              <el-table-column prop="leaveDate" label="离职日期"></el-table-column>
              <el-table-column prop="ntNum" label="内推人数"></el-table-column>
              <el-table-column prop="award" label="人才引进奖"></el-table-column>
              <el-table-column prop="award" label="试用期人员内推奖励金" width="150"></el-table-column>
              <el-table-column prop="award" label="转正人员内推奖励金" width="150"></el-table-column>
              <el-table-column prop="award" label="餐补/房补"></el-table-column>
              <el-table-column prop="leaveDate" label="当前日期"></el-table-column>
              <el-table-column prop="operation" label="操作" fixed="right" width="80">
                <template>
                  <el-button type="text" size="small" @click="talents=true">修改</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div id="pagination">
              <el-pagination @size-change="handleSizeChange" @current-change="handlecurrentChange" :current-page="currentPage" :page-sizes="[5,10,20]" :page-size="5" layout="total,sizes,prev,pager,next,jumper" :total="100">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="基础配置" name="second">
          <div class="pull-left">
            <el-form :inline="true" :model="configSearch" class="mar-no pull-left">
              <el-form-item label="所在区域">
                <el-select v-model="configSearch.area" placeholder="请选择" class="width155">
                  <el-option label="区域1" value="1"></el-option>
                  <el-option label="区域2" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="pull-right">
            <el-form>
              <el-form-item class="pull-right">
                <el-button @click="baseSetting=true" icon="el-icon-plus">新增</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="table_wrap">
            <el-table :data="talentData" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
              <el-table-column prop="area" label="所属区域"></el-table-column>
              <el-table-column prop="award" label="第一次内推奖励（试用员工）/月"></el-table-column>
              <el-table-column prop="award" label="第一次内推奖励（正式员工）/月"></el-table-column>
              <el-table-column prop="award" label="第二次及后续内推奖励（试用员工）/月" width="240"></el-table-column>
              <el-table-column prop="award" label="第二次及后续内推奖励（正式员工）/月" width="240"></el-table-column>
              <el-table-column prop="award" label="第一次内推额外餐补"></el-table-column>
              <el-table-column prop="award" label="第二次内推额外房补"></el-table-column>
              <el-table-column prop="operation" label="操作" fixed="right" width="160">
                <template>
                  <el-button type="text" size="small" @click="baseSetting=true">修改</el-button>
                  <el-button type="text" size="small" @click="deleteThis" class="deleteTxt">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div id="pagination">
              <el-pagination @size-change="handleSizeChange" @current-change="handlecurrentChange" :current-page="currentPage" :page-sizes="[5,10,20]" :page-size="5" layout="total,sizes,prev,pager,next,jumper" :total="100">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 更多查询弹框 -->
    <el-dialog title="更多查询" :close-on-click-modal="false" :visible.sync="search_more" width="450px">
      <div>按时间段查询:
        <el-date-picker style="width:273px" v-model="talentSearch.time" type="daterange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="search_more = false">取消</el-button>
        <el-button type="primary" @click="search_more = false">立即搜索</el-button>
      </span>
    </el-dialog>

    <!-- 导入弹框 -->
    <el-dialog title="数据导入" :close-on-click-modal="false" :visible.sync="uploadModal" width="450px">
      <p class="clearfix">
        <el-button size="mediumn" class="cloud-uploadBtn"><i></i>&nbsp;导入数据</el-button>&nbsp;&nbsp;
        <el-button size="mediumn" icon="el-icon-download">下载模板</el-button>
      </p>
      <el-alert title="温馨提示！" type="warning" description="导入成功后，会立刻覆盖当前版本" show-icon>
      </el-alert>
    </el-dialog>

    <!-- 导入弹框 -->
    <el-dialog title="导入中..." :close-on-click-modal="false" :visible.sync="importWarn" width="600px">
      <div class="pad-all mar-ver">
        <el-progress :text-inside="true" :stroke-width="20" :percentage="70"></el-progress>
        <p>正在导入，本次需导入总记录828条，<span style="color:#66b1ff">当前第411条</span></p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="importWarn = false">取消</el-button>
      </span>
    </el-dialog>

    <!-- 导入成功 -->
    <el-dialog title="导入成功" :close-on-click-modal="false" :visible.sync="importWarn2" width="600px">
      <div class="pad-all mar-ver">
        <el-progress :text-inside="true" :stroke-width="20" :percentage="100"></el-progress>
        <p>正在导入，本次需导入总记录828条，<span style="color:#66b1ff">成功800条</span>，<span style="color:red">失败0条</span>，总耗时15秒</p>
        <p>2019年5月绩效公式自动<span style="color:#67c23a">执行成功</span>，当前版本号：20190524003</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="importWarn2 = false">关闭</el-button>
      </span>
    </el-dialog>

    <!-- 导入失败 -->
    <el-dialog title="导入失败" :close-on-click-modal="false" :visible.sync="importWarn3" width="600px">
      <div class="pad-all mar-ver">
        <el-progress :text-inside="true" :stroke-width="20" :percentage="100"></el-progress>
        <p>正在导入，本次需导入总记录828条，<span style="color:#66b1ff">成功800条</span>，<span style="color:red">失败20条</span>，总耗时15秒</p>
        <p>
          <el-button type="text" class="underlineTxt">点击下载导入失败明细20190524002.xsl</el-button><span style="color:#a1a1a1">（导入失败明细已发送到您内网邮箱）</span>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="importWarn3 = false">取消</el-button>
        <el-button type="primary" @click="importWarn3 = false">暂不覆盖，重新导入</el-button>
      </span>
    </el-dialog>

    <!-- 新增人才引进 -->
    <el-dialog title="新增人才引进" :close-on-click-modal="false" :visible.sync="talents" width="768px">
      <el-form :model="talentForm" :rules="talentFormRule" ref="talentForm" label-width="110px">
        <el-row>
          <el-col :md="12">
            <el-form-item label="内推人：" prop="name">
              <el-input v-model="talentForm.name" style="width:200px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="员工状态：" prop="status">
              <el-input v-model="talentForm.status" style="width:200px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="员工编号：" prop="id">
              <el-input v-model="talentForm.id" style="width:200px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="人才引进奖：" prop="talentprice">
              <el-input v-model="talentForm.talentprice" style="width:200px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="身份证号：" prop="idCard">
              <el-input v-model="talentForm.idCard" style="width:200px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="试用期人员内推奖励金：" prop="probationBounty" class="longTxt">
              <el-input v-model="talentForm.probationBounty" style="width:200px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="所属区域：" prop="regionSelect">
              <el-select v-model="talentForm.regionSelect" placeholder="业务类型" style="width:200px">
                <el-option v-for="item in regionOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="转正人员内推奖励金：" prop="regularBounty" class="longTxt">
              <el-input v-model="talentForm.regularBounty" style="width:200px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="所属部门：" prop="department">
              <el-input v-model="talentForm.department" style="width:200px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="餐补/房补：" prop="subsiby">
              <el-input v-model="talentForm.subsiby" style="width:200px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="talents = false">取消</el-button>
        <el-button type="primary" @click="submitWorkForm('talentForm')">确定</el-button>
      </span>
    </el-dialog>

    <!-- 新增基础配置项 -->
    <el-dialog title="新增基础配置项" :close-on-click-modal="false" :visible.sync="baseSetting" width="600px">
      <el-form :model="baseSettingForm" :rules="baseSettingFormRule" ref="baseSettingForm" label-width="200px">
        <el-row>
          <el-col :md="24">
            <el-form-item label="所属区域：" prop="regionSelect">
              <el-select v-model="baseSettingForm.regionSelect" placeholder="所属区域" style="width:360px">
                <el-option v-for="item in regionOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="24">
            <el-form-item label="第一次内推奖励(试用员工)：" prop="firProbationBounty">
              <el-input v-model="baseSettingForm.firProbationBounty"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24">
            <el-form-item label="第一次内推奖励(正式员工)：" prop="firRegularBounty">
              <el-input v-model="baseSettingForm.firRegularBounty"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24">
            <el-form-item label="第一次内推额外餐补：" prop="firstSubsiby">
              <el-input v-model="baseSettingForm.firstBounty"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24">
            <el-form-item label="第二次及后续(试用员工)：" prop="SecProbationBounty">
              <el-input v-model="baseSettingForm.SecProbationBounty"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24">
            <el-form-item label="第二次及后续(正式员工)：" prop="SecRegularBounty">
              <el-input v-model="baseSettingForm.SecRegularBounty"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24">
            <el-form-item label="第二次内推额外房补：" prop="secondSubsiby">
              <el-input v-model="baseSettingForm.secondBounty"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="baseSetting = false">取消</el-button>
        <el-button type="primary" @click="submitWorkForm('baseSettingForm')">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { GET } from "http/custom.js"

export default {
  name: 'Talent',
  data() {
    return {
      search_more: false,//更多查询弹框
      SubmitStu: false,//提交数据状态
      uploadModal: false, //导入弹框
      importWarn: false,//导入中
      importWarn2: false,//导入成功
      importWarn3: false,//导入失败
      currentPage: 1,
      activeName: 'first',
      talentSearch: {
        name: '',
        idCard: '',
        staffNum: '',
        time: ''
      },
      talentData: [],
      configSearch: {
        area: ''
      },
      talents: false,//新增人才引进弹框
      regionOptions: [
        {
          value: 1,
          label: '日业'
        },
        {
          value: 2,
          label: '鑫远'
        },
        {
          value: 3,
          label: '公园道'
        }
      ],
      talentForm: {
        name: '',
        status: '',
        id: '',
        talentprice: '',
        idCard: '',
        probationBounty: '',
        regionSelect: '',
        regularBounty: '',
        department: '',
        subsiby: ''
      },
      talentFormRule: {
        name: [{ required: true, message: "请填写名字", trigger: "change" }],
        status: [{ required: true, message: "请填写员工状态", trigger: "change" }],
        id: [{ required: true, message: "请填写员工编号", trigger: "change" }],
        talentprice: [{ required: true, message: "请填写人才引进奖", trigger: "change" }],
        idCard: [{ required: true, message: "请填写身份证号", trigger: "change" }],
        probationBounty: [{ required: true, message: "请填写试用期人员内推奖励金", trigger: "change" }],
        regionSelect: [{ required: true, message: "请选择所属区域", trigger: "change" }],
        regularBounty: [{ required: true, message: "请填写转正人员内推奖励金", trigger: "change" }],
        department: [{ required: true, message: "请选择所属部门", trigger: "change" }],
        subsiby: [{ required: true, message: "请填写餐补/房补", trigger: "change" }]
      },
      baseSetting: false,//新增基础配置项
      baseSettingForm: {
        regionSelect: '',
        firProbationBounty: '',
        firRegularBounty: '',
        firstSubsiby: '',
        SecProbationBounty: '',
        SecRegularBounty: '',
        secondSubsiby: ''
      },
      baseSettingFormRule: {
        regionSelect: [{ required: true, message: "请选择所属区域", trigger: "change" }],
        firProbationBounty: [{ required: true, message: "第一次内推奖励(试用员工)", trigger: "change" }],
        firRegularBounty: [{ required: true, message: "第一次内推奖励(正式员工)", trigger: "change" }],
        firstSubsiby: [{ required: true, message: "第一次内推额外餐补", trigger: "change" }],
        SecProbationBounty: [{ required: true, message: "第二次及后续(试用员工)", trigger: "change" }],
        SecRegularBounty: [{ required: true, message: "第二次及后续(正式员工)", trigger: "change" }],
        secondSubsiby: [{ required: true, message: "第二次内推额外餐补", trigger: "change" }]
      },
    }
  },
  created() {
    GET('/api/getTalentData').then(res => {
      this.talentData = res.dataTable
    }).catch(error => {
      console.log(error)
    });
  },
  methods: {
    handleCommand(command) {//更多操作下拉框
      if (command == 'a') {
        this.uploadModal = true
      }
      if (command == 'b') {
      }
      if (command == 'c') {
        this.talents = true
      }
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    onSubmit() {

    },
    submitWorkForm(formName) { //验证表单
      let _this = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(_this.ruleForm);
        } else {
          this.$message({
            showClose: true,
            type: 'success',
            message: '提交失败，验证不通过'
          })
          return false
        }
      })
    },
    handleSizeChange(val) {
      console.log(`每页：${val}`)
    },
    handlecurrentChange(val) {
      console.log(`当前页：${val}`)
    },
    submitWorkForm(formName) { //验证表单
      let _this = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(_this.ruleForm);
        } else {
          this.$message({
            showClose: true,
            type: 'success',
            message: '提交失败，验证不通过'
          })
          return false
        }
      })
    },
    JS_submit() {//确认提交
      const that = this;
      this.$msgBox.confirm('<span>请确认</span><span style="color:red;">【人才引进报表】</span><span>无误。</span>', '温馨提示', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        callback: (action, instance) => {
          if (action === 'confirm') {
            that.SubmitStu = true
          }
        }
      }).then(() => {
        this.$message({
          type: 'success',
          message: '提交成功！'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消提交！'
        });
      });
    },
    cancel_submit() {//撤回数据
      this.$message({
        type: 'info',
        message: '撤回数据！'
      });
      this.SubmitStu = false
    },
    deleteThis() {
      this.$msgBox.confirm('你确定要删除该条数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
  }
}
</script>

<style scoped>
</style>
