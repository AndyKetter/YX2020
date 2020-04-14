<template>
  <div class="data-summary">
    <div class="guide">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home/financialSystem' }">财务系统</el-breadcrumb-item>
        <el-breadcrumb-item>数据汇总台账</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/financialSystem' }">(返回上级)</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="bgWhite mgt15 pad-all">
      <div class="head-box">
        <el-row>
          <el-col :span="8">
            <el-form :inline="true" :model="detailSearch" class="mar-no pull-left">
              <el-form-item label="年月">
                <el-date-picker @change="JS_Search" v-model="detailSearch.batch" type="month" class="width155" value-format="yyyy-MM" placeholder="选择月份">
                </el-date-picker>
              </el-form-item>
              <!-- <el-form-item>
                <el-button type="primary" @click="JS_Search" icon="el-icon-search">搜索</el-button>
              </el-form-item> -->
            </el-form>
          </el-col>
          <el-col :span="8">
            <span class="title">{{year}}年{{month}}月份薪酬数据汇总一览表</span>
          </el-col>
          <el-col :span="8">
            <div class="pull-right">
              <el-dropdown @command="handleCommand" trigger="click" class="mar-rgt">
                <el-button type="primary">
                  更多操作<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="e" :disabled="isLockFlag===true">获取人事基础数据</el-dropdown-item>
                  <el-dropdown-item command="f" divided :disabled="isLockFlagGain===true">取消获取人事基础数据</el-dropdown-item>
                  <el-dropdown-item command="a" divided :disabled="isLockFlag2===true">生成工资条</el-dropdown-item>
                  <el-dropdown-item command="b" divided :disabled="isLockFlag2maked===true">取消生成工资条</el-dropdown-item>
                  <el-dropdown-item command="c" divided>查看明细</el-dropdown-item>
                  <el-dropdown-item command="d" divided>导出所有</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <!-- <el-button type="danger" v-if="isLockFlag3==false" @click="sendSalaryFlag = true">发放工资</el-button>
              <el-button v-if="isSubmitFlag==false" @click="JS_cancelSubmit">取消发放</el-button> -->
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="data-box mar-top" :style="styles">
        <el-row :gutter="10">
          <el-col :span="8">
            <!-- S -->
            <div class="grid-content bg-purple">
              <span class="grid-department"><i class="pot b"></i>人事部</span>
              <el-button type="text" class="grid-btn">
                <span v-if="commitStatusRsb[0]==1">已确认</span>
                <span v-else style="color:#EF3838;">未确认</span>
              </el-button>
              <div class="item-table">
                <table border="1" cellspacing="0" cellpadding="0" class="dTable">
                  <tr class="thead">
                    <th style="width:40%">数据源</th>
                    <th style="width:20%">是否提交</th>
                    <th style="width:40%">提交时间</th>
                  </tr>
                  <tr :key='index' v-for="(item,index) in rsb">
                    <td>{{item.dataSourceName}}</td>
                    <!-- <td>{{item.commitState?(item.commitState==1?'是':'否'):'否'}}</td> -->
                    <td>
                      <span v-if="item.commitState==1">是</span>
                      <span v-else style="color:#EF3838;">否</span>
                    </td>
                    <td><span v-if="item.commitState==1">{{item.updateTime?item.updateTime:(item.createTime?item.createTime:'- -')}}</span></td>
                  </tr>
                </table>
              </div>
            </div>
            <!-- E -->

          </el-col>
          <el-col :span="8">
            <!-- S -->
            <div class="grid-content bg-purple">
              <span class="grid-department"><i class="pot p"></i>行政部</span>
              <el-button type="text" class="grid-btn">
                <span v-if="commitStatusRsb[2]==1">已确认</span>
                <span v-else style="color:#EF3838;">未确认</span>
              </el-button>
              <div class="item-table">
                <table border="1" cellspacing="0" cellpadding="0" class="dTable">
                  <tr class="thead">
                    <th style="width:40%">数据源</th>
                    <th style="width:20%">是否提交</th>
                    <th style="width:40%">提交时间</th>
                  </tr>
                  <tr :key='index' v-for="(item,index) in xzb">
                    <td>{{item.dataSourceName}}</td>
                    <td>
                      <span v-if="item.commitState==1">是</span>
                      <span v-else style="color:#EF3838;">否</span>
                    </td>
                    <td><span v-if="item.commitState==1">{{item.updateTime?item.updateTime:(item.createTime?item.createTime:'- -')}}</span></td>
                  </tr>
                </table>
              </div>
            </div>
            <!-- E -->
            <!-- S -->
            <div class="grid-content bg-purple mar-top">
              <span class="grid-department"><i class="pot y"></i>培训部</span>
              <el-button type="text" class="grid-btn">
                <span v-if="commitStatusRsb[3]==1">已确认</span>
                <span v-else style="color:#EF3838;">未确认</span>
              </el-button>
              <div class="item-table">
                <table border="1" cellspacing="0" cellpadding="0" class="dTable">
                  <tr class="thead">
                    <th style="width:40%">数据源</th>
                    <th style="width:20%">是否提交</th>
                    <th style="width:40%">提交时间</th>
                  </tr>
                  <tr :key='index' v-for="(item,index) in pxb">
                    <td>{{item.dataSourceName}}</td>
                    <td>
                      <span v-if="item.commitState==1">是</span>
                      <span v-else style="color:#EF3838;">否</span>
                    </td>
                    <td><span v-if="item.commitState==1">{{item.updateTime?item.updateTime:(item.createTime?item.createTime:'- -')}}</span></td>
                  </tr>
                </table>
              </div>
            </div>
            <!-- E -->
            <!-- S -->
            <div class="grid-content bg-purple mar-top">
              <span class="grid-department"><i class="pot p"></i>宿管部</span>
              <el-button type="text" class="grid-btn">
                <span v-if="commitStatusRsb[4]==1">已确认</span>
                <span v-else style="color:#EF3838;">未确认</span>
              </el-button>
              <div class="item-table">
                <table border="1" cellspacing="0" cellpadding="0" class="dTable">
                  <tr class="thead">
                    <th style="width:40%">数据源</th>
                    <th style="width:20%">是否提交</th>
                    <th style="width:40%">提交时间</th>
                  </tr>
                  <tr :key='index' v-for="(item,index) in sgb">
                    <td>{{item.dataSourceName}}</td>
                    <td>
                      <span v-if="item.commitState==1">是</span>
                      <span v-else style="color:#EF3838;">否</span>
                    </td>
                    <td><span v-if="item.commitState==1">{{item.updateTime?item.updateTime:(item.createTime?item.createTime:'- -')}}</span></td>
                  </tr>
                </table>
              </div>
            </div>
            <!-- E -->
            <!-- S -->
            <div class="grid-content bg-purple mar-top">
              <span class="grid-department"><i class="pot b"></i>招聘部</span>
              <el-button type="text" class="grid-btn">
                <span v-if="commitStatusRsb[5]==1">已确认</span>
                <span v-else style="color:#EF3838;">未确认</span>
              </el-button>
              <div class="item-table">
                <table border="1" cellspacing="0" cellpadding="0" class="dTable">
                  <tr class="thead">
                    <th style="width:40%">数据源</th>
                    <th style="width:20%">是否提交</th>
                    <th style="width:40%">提交时间</th>
                  </tr>
                  <tr :key='index' v-for="(item,index) in zpb">
                    <td>{{item.dataSourceName}}</td>
                    <td>
                      <span v-if="item.commitState==1">是</span>
                      <span v-else style="color:#EF3838;">否</span>
                    </td>
                    <td><span v-if="item.commitState==1">{{item.updateTime?item.updateTime:(item.createTime?item.createTime:'- -')}}</span></td>
                  </tr>
                </table>
              </div>
            </div>
            <!-- E -->
            <!-- S -->
            <div class="grid-content bg-purple mar-top">
              <span class="grid-department"><i class="pot d"></i>餐饮部</span>
              <el-button type="text" class="grid-btn">
                <span v-if="commitStatusRsb[6]==1">已确认</span>
                <span v-else style="color:#EF3838;">未确认</span>
              </el-button>
              <div class="item-table">
                <table border="1" cellspacing="0" cellpadding="0" class="dTable">
                  <tr class="thead">
                    <th style="width:40%">数据源</th>
                    <th style="width:20%">是否提交</th>
                    <th style="width:40%">提交时间</th>
                  </tr>
                  <tr :key='index' v-for="(item,index) in cyb">
                    <td>{{item.dataSourceName}}</td>
                    <td>
                      <span v-if="item.commitState==1">是</span>
                      <span v-else style="color:#EF3838;">否</span>
                    </td>
                    <td><span v-if="item.commitState==1">{{item.updateTime?item.updateTime:(item.createTime?item.createTime:'- -')}}</span></td>
                  </tr>
                </table>
              </div>
            </div>
            <!-- E -->
            <!-- S -->
            <div class="grid-content bg-purple mar-top">
              <span class="grid-department"><i class="pot g"></i>重点工作管理部</span>
              <el-button type="text" class="grid-btn">
                <span v-if="commitStatusRsb[11]==1">已确认</span>
                <span v-else style="color:#EF3838;">未确认</span>
              </el-button>
              <div class="item-table">
                <table border="1" cellspacing="0" cellpadding="0" class="dTable">
                  <tr class="thead">
                    <th style="width:40%">数据源</th>
                    <th style="width:20%">是否提交</th>
                    <th style="width:40%">提交时间</th>
                  </tr>
                  <tr :key='index' v-for="(item,index) in zdgzglb">
                    <td>{{item.dataSourceName}}</td>
                    <td>
                      <span v-if="item.commitState==1">是</span>
                      <span v-else style="color:#EF3838;">否</span>
                    </td>
                    <td><span v-if="item.commitState==1">{{item.updateTime?item.updateTime:(item.createTime?item.createTime:'- -')}}</span></td>
                  </tr>
                </table>
              </div>
            </div>
            <!-- E -->
          </el-col>
          <el-col :span="8">
            <!-- S -->
            <div class="grid-content bg-purple">
              <span class="grid-department"><i class="pot y"></i>效果管理部</span>
              <el-button type="text" class="grid-btn">
                <span v-if="commitStatusRsb[7]==1">已确认</span>
                <span v-else style="color:#EF3838;">未确认</span>
              </el-button>
              <div class="item-table">
                <table border="1" cellspacing="0" cellpadding="0" class="dTable">
                  <tr class="thead">
                    <th style="width:40%">数据源</th>
                    <th style="width:20%">是否提交</th>
                    <th style="width:40%">提交时间</th>
                  </tr>
                  <tr :key='index' v-for="(item,index) in xgglb">
                    <td>{{item.dataSourceName}}</td>
                    <td>
                      <span v-if="item.commitState==1">是</span>
                      <span v-else style="color:#EF3838;">否</span>
                    </td>
                    <td><span v-if="item.commitState==1">{{item.updateTime?item.updateTime:(item.createTime?item.createTime:'- -')}}</span></td>
                  </tr>
                </table>
              </div>
            </div>
            <!-- E -->
            <!-- S -->
            <div class="grid-content bg-purple mar-top">
              <span class="grid-department"><i class="pot d"></i>监察部</span>
              <el-button type="text" class="grid-btn">
                <span v-if="commitStatusRsb[8]==1">已确认</span>
                <span v-else style="color:#EF3838;">未确认</span>
              </el-button>
              <div class="item-table">
                <table border="1" cellspacing="0" cellpadding="0" class="dTable">
                  <tr class="thead">
                    <th style="width:40%">数据源</th>
                    <th style="width:20%">是否提交</th>
                    <th style="width:40%">提交时间</th>
                  </tr>
                  <tr :key='index' v-for="(item,index) in jcb">
                    <td>{{item.dataSourceName}}</td>
                    <td>
                      <span v-if="item.commitState==1">是</span>
                      <span v-else style="color:#EF3838;">否</span>
                    </td>
                    <td><span v-if="item.commitState==1">{{item.updateTime?item.updateTime:(item.createTime?item.createTime:'- -')}}</span></td>
                  </tr>
                </table>
              </div>
            </div>
            <!-- E -->
            <!-- S -->
            <div class="grid-content bg-purple mar-top">
              <span class="grid-department"><i class="pot y"></i>五险一金部</span>
              <el-button type="text" class="grid-btn">
                <!-- {{commitStatusRsb[9]==1?"已确认":"未确认"}} -->
                <span v-if="commitStatusRsb[9]==1">已确认</span>
                <span v-else style="color:#EF3838;">未确认</span>
              </el-button>
              <div class="item-table">
                <table border="1" cellspacing="0" cellpadding="0" class="dTable">
                  <tr class="thead">
                    <th style="width:40%">数据源</th>
                    <th style="width:20%">是否提交</th>
                    <th style="width:40%">提交时间</th>
                  </tr>
                  <tr :key='index' v-for="(item,index) in wxyjb">
                    <td>{{item.dataSourceName}}</td>
                    <td>
                      <span v-if="item.commitState==1">是</span>
                      <span v-else style="color:#EF3838;">否</span>
                    </td>
                    <td><span v-if="item.commitState==1">{{item.updateTime?item.updateTime:(item.createTime?item.createTime:'- -')}}</span></td>
                  </tr>
                </table>
              </div>
            </div>
            <!-- E -->
            <!-- S -->
            <div class="grid-content bg-purple mar-top">
              <span class="grid-department"><i class="pot r"></i>财务部</span>
              <el-button type="text" class="grid-btn">
                <span v-if="commitStatusRsb[10]==1">已确认</span>
                <span v-else style="color:#EF3838;">未确认</span>
              </el-button>
              <div class="item-table">
                <table border="1" cellspacing="0" cellpadding="0" class="dTable">
                  <tr class="thead">
                    <th style="width:40%">数据源</th>
                    <th style="width:20%">是否提交</th>
                    <th style="width:40%">提交时间</th>
                  </tr>
                  <tr :key='index' v-for="(item,index) in cwb">
                    <td>{{item.dataSourceName}}</td>
                    <td>
                      <span v-if="item.commitState==1">是</span>
                      <span v-else style="color:#EF3838;">否</span>
                    </td>
                    <td><span v-if="item.commitState==1">{{item.updateTime?item.updateTime:(item.createTime?item.createTime:'- -')}}</span></td>
                  </tr>
                </table>
              </div>
            </div>
            <!-- E -->
            <!-- S -->
            <div class="grid-content bg-purple mar-top">
              <span class="grid-department"><i class="pot y"></i>其他部门</span>
              <el-button type="text" class="grid-btn">
                <span v-if="commitStatusRsb[1]==1">已确认</span>
                <span v-else style="color:#EF3838;">未确认</span>
              </el-button>
              <div class="item-table">
                <table border="1" cellspacing="0" cellpadding="0" class="dTable">
                  <tr class="thead">
                    <th style="width:40%">数据源</th>
                    <th style="width:20%">是否提交</th>
                    <th style="width:40%">提交时间</th>
                  </tr>
                  <tr :key='index' v-for="(item,index) in qtbm">
                    <td>{{item.dataSourceName}}</td>
                    <td>
                      <span v-if="item.commitState==1">是</span>
                      <span v-else style="color:#EF3838;">否</span>
                    </td>
                    <td><span v-if="item.commitState==1">{{item.updateTime?item.updateTime:(item.createTime?item.createTime:'- -')}}</span></td>
                  </tr>
                </table>
              </div>
            </div>
            <!-- E -->
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 工资导出弹框 -->
    <el-dialog title="工资导出" :close-on-click-modal="false" :visible.sync="downloadSalary" width="450px">
      <p>
        <el-button size="mediumn" @click="JS_download(1)">保存至本地</el-button>&nbsp;&nbsp;
        <el-button size="mediumn" @click="JS_download(2)">发送至本人内网邮箱</el-button>
      </p>
      <el-alert title="温馨提示" type="warning" :closable="false" description="保存至本地需要等待数秒至数分钟" show-icon>
      </el-alert>
    </el-dialog>
    <!-- 有异议弹窗 -->
    <el-dialog title="有异议" :close-on-click-modal="false" :visible.sync="dissentModal" width="450px">
      <el-row class="textLft mar-top">
        <el-col :span="6" class="height26">异议内容：</el-col>
        <el-col :span="18" class="height26">
          <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 3}" placeholder="请备注处理和申诉人沟通后的结果！" v-model="textarea" style="width:100%;"></el-input>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dissentModal = false">取消</el-button>
        <el-button type="primary" @click="dissentModal = false">确定</el-button>
      </span>
    </el-dialog>
    <!-- 生成工资条弹框-->
    <el-dialog title="工资发放" :close-on-click-modal="false" :visible.sync="sendSalaryFlag" width="500px" @close="cancelSendSalaryForm('sendSalaryForm')">
      <el-row>
        <el-col :xs="21" :offset="1"  class="warnIcoBg">
            <h2>您确定数据无误，发放本月工资？</h2>
            <span style="color:red">注：发放后，所有员工会收到工资条！</span>
        </el-col>
      </el-row>      
      <el-form :model="sendSalaryForm" ref="sendSalaryForm" label-width="160px">
        <el-form-item
          label="请选择发放版本"
          prop="type"
          :rules="{required:true,message:'请选择发放版本',trigger:'blur'}"
        >
          <el-select v-model="sendSalaryForm.type" placeholder="请选择">
            <el-option v-for="item in sendSalarySourceOptions"
              :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <p class="clearfix" style="text-align: right;">
        <span slot="footer" class="dialog-footer ">
          <el-button @click="sendSalaryFlag = false">取消</el-button>
          <el-button type="primary" @click="submitSendSalaryForm">确认生成</el-button>
        </span>
      </p>
    </el-dialog>
    <!-- 导入信息 -->
    <el-dialog title="正在生成工资条..." :close-on-click-modal="false" :show-close="false" :visible.sync="importProcessInfoDialog" width="600px">
      <div class="pad-all mar-ver">
        <el-progress :text-inside="true" :stroke-width="20" :percentage="progressPercentAge"></el-progress>
        <p>正生成{{year}}年{{month}}月份工资条,总记录{{uploadProcessInfo.total | repair}}条，<span style="color:#66b1ff">当前第{{uploadProcessInfo.successful | repair}}条</span>，总耗时{{uploadProcessInfo.dealAllTime}}</p>
        <p style="color:red">注：生成工资条会覆盖本月已生成的工资条数据，并且各个部门都不能再提交数据。</p>
      </div>
      <span slot="footer" class="dialog-footer" v-show="progressBackBtn">
        <el-button type="primary" @click="importProgress">返回</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { GET } from "http/custom.js"
import Tools from 'untils/index.js';

export default {
  name: 'data-summary',
  data() {
    let PYd = Tools.getPYd() //获取年月 上月 格式如 2019-06
    let infoHeight = Tools.getTbHeight(222)
    return {
      styles: {
        overflow: 'auto',
        height: `${infoHeight}px`
      },
      year: '--',
      month: '--',
      dateDefault: PYd,
      monthValue: '',
      GeneralLedgerTableData: {},
      rsb: [],//人事部
      qtbm: [],//其他部门
      xzb: [],//行政部
      pxb: [],//培训部
      sgb: [],//宿管部
      zpb: [],//招聘部
      cyb: [],//餐饮部
      xgglb: [],//效果管理部
      jcb: [],//监察部
      wxyjb: [],//五险一金部
      cwb: [],//财务部
      commitStatusRsb: [],//是否提交数组

      detailSearch: {
        batch: PYd
      },
      zdgzglb: [],//重点工作管理部
      // 生成工资条
      importProcessInfoDialog: false,
      // 工资导出弹框 
      downloadSalary: false,
      // downloadSalaryform: {
      //   month1: '',
      //   typeSelect: ''
      // },
      // downloadSalaryOptions: [
      //   {
      //     value: 1,
      //     label: '保存至本地(需要等待数秒至数分钟)'
      //   },
      //   {
      //     value: 2,
      //     label: '发送至本人内网邮箱'
      //   }
      // ],
      // 有异议
      dissentModal: false,
      textarea: '',

      isLockFlag3: false, // 发放工资锁状态
      isSubmitFlag: false,
      isLockFlag: false,//获取人事基础锁状态
      isLockFlagGain: false,
      isLockFlag2: false,//工资条是否已生成
      isLockFlag2maked: false,//
      // payWages:false
      category: '',
      //进度条相关参数
      // importError: false,// 导入错误时呈现的进度 
      // downloadErrorEveProcess: false, //获取错误下载key
      loadErrorExcel: false,
      downloadErrorKey: false,
      progressBackBtn: false, //返回按钮
      progressPercentAge: 0,
      uploadProcessInfo: {
        total: '',//总条数
        handler: '',//已处理条数
        successful: '',//处理成功条数
        failures: '', //处理失败条数
        finish: false,//是否处理完成
        dealAllTime: '',//总耗时
      },
      // 发放工资
      sendSalaryFlag:false,
      // 发放工资form表单
      sendSalaryForm:{
        type:"1"
      },
      sendSalarySourceOptions:[
        { value:'1',label:'系统计算版'},
        { value:'2',label:'导入版'}
      ],
    }
  },
  methods: {
    handleCommand(command) {
      if (command == 'a') {
        //this.makeSliverFlag = true;
        this.JS_makeSliver()
      } else if (command == 'b') {
        this.JS_cancelMake()
      } else if (command == 'c') {
        this.$router.push({
          path: `/home/financialSystem/dataSummary/dataSummaryDetail`
        })
      } else if (command == 'd') {
        this.JS_download(1)
      } else if (command == 'e') {
        // 获取人事基础数据
        this.JS_gain()
      } else if (command == 'f') {
        // 取消获取人事基础数据
        this.JS_cancelGain()
      }
    },
    JS_gain() {//获取人事基础数据成功！
      this.$msgBox.confirm('<p style="font-weight:bold;font-size:18px;text-align:center;margin-bottom:15px">您确定要获取人事基础数据？</p><p style="color:red;text-align:center">注：获取人事基础数据后，会立刻覆盖当前数据！</p>', '温馨提示', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {

        const loading = this.$loading({//上报数据，锁定页面loading
          lock: true,
          text: '正在获取人事基础数据，请稍等片刻',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        let searchObj = {
          "batch": this.detailSearch.batch || this.dateDefault
        }
        GET(process.env.VUE_APP_DOMAIN_financial + '/finance/financialGeneralLedger/fetchPersonnelBasicData', searchObj).then(res => {
          loading.close() //关闭loading
          this.$message({
            type: 'success',
            message: '获取人事基础数据成功！'
          });
          // this.isgeted = true
          this.search()
        }).catch(error => {
          loading.close() //关闭loading
          console.log(error)
        })
      }).catch(() => {
      });
    },
    JS_cancelGain() {
      this.$msgBox.confirm('<p style="font-weight:bold;font-size:18px;text-align:center;margin-bottom:15px">您是否确定取消获取人事基础数据？</p><p style="color:red;text-align:center">注：取消后，人事部才可以更新基础数据</p>', '温馨提示', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        const loading = this.$loading({//上报数据，锁定页面loading
          lock: true,
          text: '正在取消获取人事基础数据，请稍等片刻',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        let searchObj = {
          "batch": this.detailSearch.batch || this.dateDefault
        }
        GET(process.env.VUE_APP_DOMAIN_financial + '/finance/financialGeneralLedger/cancelFetchPersonnelBasicData', searchObj).then(res => {
          loading.close() //关闭loading
          // if (res.code == 0) {
          //   this.isLockFlag = false
          // }
          this.$message({
            type: 'success',
            message: '已取消获取人事基础数据！'
          });
          // this.isgeted = false
          this.search()
        }).catch(error => {
          loading.close() //关闭loading
          console.log(error)
        })
      }).catch(() => {
      });
    },
    //生成工资条
    JS_makeSliver() {
      let searchObj = {//查询对象
        "batch": this.detailSearch.batch || this.dateDefault
      }
      GET(process.env.VUE_APP_DOMAIN_financial + '/financial/generateSalaryPayroll', searchObj).then(res => {
        if (res.code == 0) {
          this.downloadErrorEveProcess = res.data //获取进度条事件句柄
          //错误导入进度条与下载模板
          this.importProcessInfoDialog = true
          this.queryProgress() //获取上传文件进度条信息

          // this.ismaked = true
          this.search()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    JS_cancelMake() {//取消生成工资条
      this.$msgBox.confirm('<p style="font-weight:bold;font-size:18px;text-align:center;margin-bottom:15px">您是否确定取消生成工资条？</p><p style="color:red;text-align:center">注：取消生成后，各部门可以重新提交数据。</p>', '温馨提示', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        //type: 'warning'
      }).then(() => {
        let searchObj = {//查询对象
          "batch": this.detailSearch.batch || this.dateDefault
        }
        GET(process.env.VUE_APP_DOMAIN_financial + '/financial/cancelGenerateSalaryPayroll', searchObj).then(res => {
          // console.log("借支管理取消上报", res)
          // if (res.code == 0) {
          //   this.ismaked = false
          // }
          this.$message({
            type: "success",
            message: "取消成功！"
          })
          // this.ismaked = false
          this.search() //搜索并且判断数据是否上锁
        }).catch(error => {
          console.log(error)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消提交！'
        });
      });
    },
    queryProgress() { //上传进度条
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
            this.search();//刷新页面

            setTimeout(() => {
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
    importProgress() {//进度弹框关闭
      this.importProcessInfoDialog = false; //关闭进度弹框
      this.progressPercentAge = 0 //进度条清空为0
      this.progressBackBtn = false; //隐藏返回按钮
      // this.loadErrorExcel = false; // 隐藏下载失败链接
    },
    // 生成工资
    submitSendSalaryForm () {        
      const loading = this.$loading({//上报数据，锁定页面loading
        lock: true,
        text: '正在发放工资，请稍等片刻',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      let searchObj = {//查询对象
        "batch": this.detailSearch.batch || this.dateDefault,
        "type":this.sendSalaryForm.type
      }
      GET(process.env.VUE_APP_DOMAIN_financial + '/financial/grantSalaryPayroll', searchObj).then(res => {
        if (res.code == 0) {
          loading.close() //关闭loading
          this.$message({
            type: "success",
            message: "发放成功！"
          })
          this.search()
          this.sendSalaryFlag = false    
        }
      }).catch(error => {
        loading.close() //关闭loading
        console.log(error)
      })
    },
    // 取消生成工资
    cancelSendSalaryForm (formName) {
      this.$refs[formName].resetFields()
    },
    // JS_submit() {//发放工资
    //   this.$msgBox.confirm('<p style="font-weight:bold;font-size:18px;text-align:center;margin-bottom:15px">您确定数据无误，发放本月工资？</p><p style="color:red;text-align:center">注：发放后，所有员工会收到工资条！</p>', '温馨提示', {
    //     dangerouslyUseHTMLString: true,
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     //type: 'warning'
    //   }).then(() => {
    //     const loading = this.$loading({//上报数据，锁定页面loading
    //       lock: true,
    //       text: '正在发放工资，请稍等片刻',
    //       spinner: 'el-icon-loading',
    //       background: 'rgba(0, 0, 0, 0.7)'
    //     })
    //     let searchObj = {//查询对象
    //       "batch": this.detailSearch.batch || this.dateDefault
    //     }
    //     GET(process.env.VUE_APP_DOMAIN_financial + '/financial/grantSalaryPayroll', searchObj).then(res => {
    //       if (res.code == 0) {
    //         loading.close() //关闭loading
    //         this.$message({
    //           type: "success",
    //           message: "发放成功！"
    //         })
    //         this.search()
    //         // this.isSubmitFlag = true
    //       }
    //     }).catch(error => {
    //       loading.close() //关闭loading
    //       console.log(error)
    //     })
    //   }).catch(() => {
    //     // this.$message({
    //     //   type: 'info',
    //     //   message: '取消发放！'
    //     // });
    //   });
    // },
    JS_cancelSubmit() {
      this.$msgBox.confirm(
        '<span>确定取消发放工资？</span>', "温馨提示",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        let searchObj = {//查询对象
          "batch": this.detailSearch.batch || this.dateDefault
        }
        GET(process.env.VUE_APP_DOMAIN_financial + '/financial/cancelGrantSalaryPayroll', searchObj).then(res => {
          console.log("取消上报", res)
          if (res.code == 0) {
            //this.isSubmitFlag = false//发放工资锁
            // this.isLockFlag = false//获取人事基础数据锁
            // this.ismaked = false//生成工资条锁
          }
          this.$message({
            type: "success",
            message: "取消发放成功！"
          })
          this.search()
          //this.isSubmitFlag = false
        }).catch(error => {
          console.log(error)
        })
      }).catch(() => {

      })
    },
    JS_download(id) {
      let searchObj = {//查询对象
        "batchId": this.detailSearch.batch || this.dateDefault
      }
      GET(process.env.VUE_APP_DOMAIN_financial + '/financial/queryExportCount', searchObj).then(res => {//查询
        if (res.data) {
          window.location.href =
            process.env.VUE_APP_DOMAIN_financial +
            "/financial/export?token=" +
            localStorage.getItem("token") +
            '&batchId=' + this.detailSearch.batch +
            '&exprotType=' + id
          this.$message({
            type: 'success',
            message: '导出数据成功!',
            showClose: true
          })
          this.downloadSalary = false
        } else {
          this.$message({
            type: 'warning',
            message: '没有可导出的数据!',
            showClose: true
          })
        }
      }).catch(error => {
        console.log(error)
      })

    },
    search() {
      //qianjun 列表查询
      console.log(this.detailSearch.batch);
      let searchObj = {//查询对象
        "batch": this.detailSearch.batch || this.dateDefault
      }
      //this.loading = true //开启动画
      GET(process.env.VUE_APP_DOMAIN_financial + '/finance/financialGeneralLedger/financialGeneralLedgers', searchObj).then(res => {//查询薪资类型模板
        //this.loading = false //关闭动画
        this.GeneralLedgerTableData = res.data//set表格的值
        this.rsb = this.GeneralLedgerTableData[1]
        this.qtbm = this.GeneralLedgerTableData[2]
        this.xzb = this.GeneralLedgerTableData[3]
        this.pxb = this.GeneralLedgerTableData[4]
        this.sgb = this.GeneralLedgerTableData[5]
        this.zpb = this.GeneralLedgerTableData[6]
        this.cyb = this.GeneralLedgerTableData[7]
        this.xgglb = this.GeneralLedgerTableData[8]
        this.jcb = this.GeneralLedgerTableData[9]
        this.wxyjb = this.GeneralLedgerTableData[10]

        this.cwb = this.GeneralLedgerTableData[11]
        this.zdgzglb = this.GeneralLedgerTableData[12]
        let arrDate = searchObj.batch.split('-');
        this.year = arrDate[0]
        this.month = parseInt(arrDate[1]);

        this.isLock() //获取人事基础锁状态是否上锁
        this.isLockgain()
        this.isLock2() //生成工资条锁状态是否上锁
        this.isLock2Make()
        this.isLock3() //发放工资锁状态是否上锁
        this.isLock3Submit()

      }).catch(error => {
        console.log(error)
      })

      //查询模板大类别
      this.commitStatusRsb = []
      GET(process.env.VUE_APP_DOMAIN_financial + '/finance/financialGeneralLedger/financialGeneralLedgersCategory', searchObj).then(res => {
        console.log(res);
        this.category = res.data;
        this.category.forEach(element => {
          this.commitStatusRsb.push(element.ackStatus)
        })
        //console.log("招聘部", this.commitStatusRsb)

      }).catch(error => {
        console.log(error)
      })

    },
    isLock() {//获取人事基础锁状态判断是否上锁
      let searchObj = {//查询对象
        "batch": this.detailSearch.batch || this.dateDefault
      }
      GET(process.env.VUE_APP_DOMAIN_financial + "/finance/financialGeneralLedger/fetchPersonnelBasicDataLockStatus", searchObj).then(res => {
        console.log("获取人事基础是否上锁", res)
        if (res.code == 0) {//未上锁
          this.isLockFlag = false
        } else if (res.code == 3) {//已上锁
          this.isLockFlag = true
        }
        console.log(this.isLockFlag)
      }).catch(error => {
        console.log(error)
      })
    },
    isLockgain() {
      let searchObj = {//查询对象
        "batch": this.detailSearch.batch || this.dateDefault
      }
      GET(process.env.VUE_APP_DOMAIN_financial + "/finance/financialGeneralLedger/cancelPersonnelBasicDataLockStatus", searchObj).then(res => {
        console.log("取消获取人事基础是否上锁", res)
        if (res.code == 0) {//未上锁
          this.isLockFlagGain = false
        } else if (res.code == 3) {//已上锁
          this.isLockFlagGain = true
        }
        console.log(this.isLockFlagGain)
      }).catch(error => {
        console.log(error)
      })
    },
    isLock2() {//生成工资条锁状态判断是否上锁
      let searchObj = {//查询对象
        "batch": this.detailSearch.batch || this.dateDefault
      }
      GET(process.env.VUE_APP_DOMAIN_financial + "/financial/checkGenerateSalaryPayrollLockStatus", searchObj).then(res => {
        console.log("生成工资条是否上锁", res)
        if (res.code == 0) {//未上锁
          this.isLockFlag2 = false
        } else if (res.code == 3) {//已上锁
          this.isLockFlag2 = true
        }
        console.log(this.isLockFlag2)
      }).catch(error => {
        console.log(error)
      })
    },

    isLock2Make() {//取消生成工资条锁是否上锁
      let searchObj = {//查询对象
        "batch": this.detailSearch.batch || this.dateDefault
      }
      GET(process.env.VUE_APP_DOMAIN_financial + "/financial/checkCancelGenerateSalaryPayrollLockStatus", searchObj).then(res => {
        console.log("取消生成工资条是否上锁", res)
        if (res.code == 0) {//未上锁
          this.isLockFlag2maked = false
        } else if (res.code == 3) {//已上锁
          this.isLockFlag2maked = true
        }
        console.log(this.isLockFlag2maked)
      }).catch(error => {
        console.log(error)
      })
    },
    isLock3() {//发放工资锁状态判断是否上锁
      let searchObj = {//查询对象
        "batch": this.detailSearch.batch || this.dateDefault
      }
      GET(process.env.VUE_APP_DOMAIN_financial + "/financial/checkPaymentSalaryLockStatus", searchObj).then(res => {
        console.log("发放工资是否上锁", res)
        if (res.code == 0) {//未上锁
          this.isLockFlag3 = false
        } else if (res.code == 3) {//已上锁
          this.isLockFlag3 = true
        }
        console.log(this.isLockFlag3)
      }).catch(error => {
        console.log(error)
      })
    },
    isLock3Submit() {//取消发放工资锁状态是否上锁
      let searchObj = {//查询对象
        "batch": this.detailSearch.batch || this.dateDefault
      }
      GET(process.env.VUE_APP_DOMAIN_financial + "/financial/checkCancelPaymentSalaryLockStatus", searchObj).then(res => {
        console.log("取消发放工资是否上锁", res)
        if (res.code == 0) {//未上锁
          this.isSubmitFlag = false
        } else if (res.code == 3) {//已上锁
          this.isSubmitFlag = true
        }
        console.log(this.isSubmitFlag)
      }).catch(error => {
        console.log(error)
      })
    },

    JS_Search() {
      this.search();
    },

  },
  created() {
    // GET('/api/getNoConfigTableData').then(res=>{
    //   this.noConfigTableData = res.dataTable
    // }).catch(error=>{
    //     console.log(error)
    // })
    // let searchObj = {//查询对象
    //   "batch": this.detailSearch.batch || this.dateDefault
    // }

    this.search();
  }
}
</script>
<style scoped>
.p {
  background-color: #b620e0;
}
.y {
  background-color: #f7b500;
}
.b {
  background-color: #0091ff;
}
.d {
  background-color: #6d7278;
}
.g {
  background-color: #6dd400;
}
.r {
  background-color: #e02020;
}
/* 头部 */
.head-box .title {
  font-size: 18px;
  color: #606266;
  letter-spacing: 1.12px;
}
.month-select {
  font-size: 14px;
  color: #000000;
}

/* .check-btn{
  color: #1871F8;
  float: right;
  margin-right: 5px;
} */
/* 数据表 */
.bg-purple {
  background: #f5f7fa;
}

.grid-content {
  min-height: 36px;
  border: 1px solid #e2e5ef;
  position: relative;
  padding: 5px;
}

.pot {
  width: 12px;
  height: 12px;
  display: block;
  border-radius: 50%;
  position: absolute;
  left: 7px;
  top: 12px;
  z-index: 10;
}

.grid-department {
  font-size: 14px;
  color: #24282f;
  letter-spacing: 0.88px;
  line-height: 26px;
  margin-left: 17px;
}

.grid-btn {
  float: right;
  margin-right: 5px;
  cursor: default;
}

table.dTable {
  border-collapse: collapse;
  width: 100%;
  border: 1px solid #c6ccdd;
  background-color: #fff;
}

table.dTable tr th,
table.dTable tr td {
  border: 1px solid #c6ccdd;
  padding-left: 10px;
  height: 40px;
  color: #000;
  font-size: 13px;
  text-align: left;
  font-weight: 500;
}

table.dTable tr.thead {
  background-color: #e5e9f3;
}

table.dTable tr.thead th {
  color: #60646c;
}

.warnIcoBg{
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
