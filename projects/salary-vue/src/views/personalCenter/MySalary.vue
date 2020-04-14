<template>
  <div class="my-salary">
    <div style="height:18px;">
      <div class="guide">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home/personalCenter' }">个人中心</el-breadcrumb-item>
          <el-breadcrumb-item>我的</el-breadcrumb-item>
          <el-breadcrumb-item>我的工资条</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/home/personalCenter' }">(返回上级)</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="notification">
        <i class="red-pot" v-if="redPotFlag ==true"></i>
        <i class="el-icon-bell upIcon"></i>
        <span class="msgStr">{{msgString}}</span>
        <span class="more" @click="getMoreMag()">更多&gt;</span>
      </div>
    </div>
    <div class="bgWhite mgt15 pad-10">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="headPic">
            <img src="~libs/images/logo.png" alt="">
          </div>
          <div style="text-align:center">
            <p>员工编号：<span>{{userDetailInfo.employeeNo}}</span></p>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="up-content">
            <p class="name">姓名：<span>{{userDetailInfo.employeeName}}</span></p>
            <p>身份证号：<span>{{userDetailInfo.idNumber}}</span></p>
            <p>所属单位：<span>{{userDetailInfo.subordinateUnits | repair}}</span></p>
            <p>担任职务：<span>{{userDetailInfo.postName | repair}}</span></p>
            <p>组织架构：<span>{{userDetailInfo.levelExpand | repair}}</span></p>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="up-content">
            <p>入职日期：<span>{{userDetailInfo.entryDate?userDetailInfo.entryDate.split(' ')[0]:'--'}}</span></p>
            <p>转正日期：<span>{{userDetailInfo.turnformalDate?userDetailInfo.turnformalDate.split(' ')[0]:'--'}}</span></p>
            <p>{{month+1}}月应出勤：<span>{{userDetailInfo.workingHours?userDetailInfo.workingHours+'小时':'--'}}</span></p>
            <p>{{month+1}}月实际出勤：<span>{{userDetailInfo.actualWorkingHours?userDetailInfo.actualWorkingHours+'小时':'--'}}</span></p>
            <p>是否全勤：<span>{{userDetailInfo.isFull==0?'否':'是'}}</span><i class="el-icon-view upIcon cursorFlag" @click="goFattendMonthReport()"></i></p>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="up-content">
            <p>银行账号：<span>{{userDetailInfo.wageCardNum?userDetailInfo.wageCardNum:'--'}}</span></p>
            <p>开户行：<span>{{userDetailInfo.wageCardBank?userDetailInfo.wageCardBank:'--'}}</span></p>
            <!-- <p>银行账号：<span>{{mySalaryDetail.wageCardNum?mySalaryDetail.wageCardNum:'--'}}</span></p>
            <p>开户行：<span>{{mySalaryDetail.wageCardBank?mySalaryDetail.wageCardBank:'--'}}</span></p> -->
            <p>孝敬费累计：<span>{{userDetailInfo.filial?userDetailInfo.filial:'--'}}元</span><i class="el-icon-view upIcon cursorFlag" @click="parentMoneyCheck()"></i></p>
            <p>当前工龄：<span>{{userDetailInfo.servicelen==0?'&lt;1':userDetailInfo.servicelen}}年</span></p>
            <p>内推人数：<span>{{userDetailInfo.recommendCount}}人</span><i class="el-icon-view upIcon cursorFlag" @click="goAddperson()"></i></p>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="bgWhite mgt15">
      <div class="month-box">
        <div class="year-box">
          <i class="el-icon-d-arrow-left" @click="preYear"></i>
          {{year}}年
          <i class="el-icon-d-arrow-right" @click="afterYear"></i>
        </div>
        <div style="margin-top:20px;">
          <el-steps :active="month" align-center>
            <el-step title="1月" icon="el-icon-date" @click.native="monthSelect(1)" style="cursor: pointer"></el-step>
            <el-step title="2月" icon="el-icon-date" @click.native="monthSelect(2)" style="cursor: pointer"></el-step>
            <el-step title="3月" icon="el-icon-date" @click.native="monthSelect(3)" style="cursor: pointer"></el-step>
            <el-step title="4月" icon="el-icon-date" @click.native="monthSelect(4)" style="cursor: pointer"></el-step>
            <el-step title="5月" icon="el-icon-date" @click.native="monthSelect(5)" style="cursor: pointer"></el-step>
            <el-step title="6月" icon="el-icon-date" @click.native="monthSelect(6)" style="cursor: pointer"></el-step>
            <el-step title="7月" icon="el-icon-date" @click.native="monthSelect(7)" style="cursor: pointer"></el-step>
            <el-step title="8月" icon="el-icon-date" @click.native="monthSelect(8)" style="cursor: pointer"></el-step>
            <el-step title="9月" icon="el-icon-date" @click.native="monthSelect(9)" style="cursor: pointer"></el-step>
            <el-step title="10月" icon="el-icon-date" @click.native="monthSelect(10)" style="cursor: pointer"></el-step>
            <el-step title="11月" icon="el-icon-date" @click.native="monthSelect(11)" style="cursor: pointer"></el-step>
            <el-step title="12月" icon="el-icon-date" @click.native="monthSelect(12)" style="cursor: pointer"></el-step>
          </el-steps>
        </div>
      </div>
      <div class="detail-box no-data" v-if="!dataFlag" v-loading.lock="fullscreenLoading">
        <div class="icon-text">
          <div>
            <img src="~libs/images/noData.png" alt="">
          </div>
          <div class="tishi">
            <p>您{{month+1}}月份的工资条还未生成！</p>
            <p>请耐心等候…</p>
          </div>
        </div>
      </div>
      <div class="detail-box" v-else v-loading.lock="fullscreenLoading">
        <el-row>
          <el-col :span="3" class="item">
            <i class="rIcon"><img src="~libs/images/plus.png" alt=""></i>
            <p class="detail-title">{{baseSalary.name}}</p>
            <p class="detail-num">小计：<span>{{baseSalary.total}}</span></p>
            <p :key="index" v-for="(item,index) in baseSalary.data">
              {{item.dataSourceName}}：<span>{{item.amount}}</span>
            </p>
          </el-col>
          <el-col :span="3" class="item">
            <i class="rIcon"><img src="~libs/images/plus.png" alt=""></i>
            <p class="detail-title">{{baseSubsidy.name}}</p>
            <p class="detail-num">小计：<span>{{baseSubsidy.total}}</span></p>
            <p :key="index" v-for="(item,index) in baseSubsidy.data">
              {{item.dataSourceName}}：<span>{{item.amount}}</span>
            </p>
          </el-col>
          <el-col :span="3" class="item">
            <i class="rIcon"><img src="~libs/images/plus.png" alt=""></i>
            <p class="detail-title">{{noSubsidy.name}}</p>
            <p class="detail-num">小计：<span>{{noSubsidy.total}}</span></p>
            <p :key="index" v-for="(item,index) in noSubsidy.data">
              {{item.dataSourceName}}：
              <span v-if="item.dataSourceName!='其他补助'">{{item.amount}}</span>
              <span v-else @click="fetchDetail('1','其他补助')" style="color:#2e76ee;text-decoration:underline;cursor: pointer">{{item.amount}}</span>
            </p>
          </el-col>
          <el-col :span="3" class="item">
            <i class="rIcon"><img src="~libs/images/reduce.png" alt=""></i>
            <p class="detail-title">{{performanceSalary.name}}</p>
            <p class="detail-num">小计：<span>{{performanceSalary.total}}</span></p>
            <p :key="index" v-for="(item,index) in performanceSalary.data">
              {{item.dataSourceName}}：<span>{{item.amount}}</span>
            </p>
          </el-col>
          <el-col :span="4" class="item">
            <i class="rIcon"><img src="~libs/images/reduce.png" alt=""></i>
            <p class="detail-title">{{deductionItem.name}}</p>
            <p class="detail-num">小计：<span>{{deductionItem.total}}</span></p>
            <p :key="index" v-for="(item,index) in deductionItem.data">
              {{item.dataSourceName}}：
              <!-- <span>{{item.amount}}</span> -->
              <span v-if="item.dataSourceName!='其他应扣款'">{{item.amount}}</span>
              <span v-else @click="fetchDetail('2','其他应扣款')" style="color:#2e76ee;text-decoration:underline;cursor: pointer">{{item.amount}}</span>
            </p>
          </el-col>
          <el-col :span="4" class="item">
            <i class="rIcon"><img src="~libs/images/deng.png" alt=""></i>
            <p class="detail-title">{{replayDeductionItem.name}}</p>
            <p class="detail-num">小计：<span>{{replayDeductionItem.total}}</span></p>
            <p :key="index" v-for="(item,index) in replayDeductionItem.data">
              {{item.dataSourceName}}：
              <!-- <span>{{item.amount}}</span> -->
              <span v-if="item.dataSourceName!='其他代扣款'&&item.dataSourceName!='代扣调整款项'">{{item.amount}}</span>
              <span v-else-if="item.dataSourceName=='其他代扣款'" @click="fetchDetail('3','其他代扣款')" style="color:#2e76ee;text-decoration:underline;cursor: pointer">{{item.amount}}</span>
              <span v-else @click="fetchDetail('4','代扣调整款项')" style="color:#2e76ee;text-decoration:underline;cursor: pointer">{{item.amount}}</span>
            </p>
          </el-col>
          <el-col :span="4" class="item all">
            <p class="detail-title colorB">{{actualSalary.name}}</p>
            <p class="detail-num">总计：<span>{{actualSalary.total}}</span></p>
            <p :key="index" v-for="(item,index) in actualSalary.data">
              {{item.dataSourceName}}：<span>{{item.amount}}</span>
            </p>
            <p style="margin-top:20px">工资发放人：<span>{{mySalaryDetail.paymentUserName?mySalaryDetail.paymentUserName:'--'}}</span></p>
            <p>提交时间：<span>{{mySalaryDetail.paymentTime?mySalaryDetail.paymentTime:'--'}}</span></p>
            <p>工资确认：</p>
            <!-- 未确认 -->
            <el-row style="margin-top:20px" v-if="mySalaryDetail.employConfirm==0">
              <el-button @click="dissentModal()">有异议</el-button>
              <!-- <el-button type="primary" @click="">&nbsp;确 认&nbsp;</el-button> ???-->
              <el-button type="primary" @click="verify()">&nbsp;确 认&nbsp;</el-button>
            </el-row>
            <!-- 已确认无异议 -->
            <el-row style="margin-top:20px" v-if="mySalaryDetail.employConfirm==1">
              <el-button type="text">已确认</el-button>
              <el-button type="primary" @click="dissentDetailModal()">&nbsp;详 情&nbsp;</el-button>
            </el-row>
            <!-- 已确认有异议已经回复 -->
            <el-row style="margin-top:20px" v-if="mySalaryDetail.employConfirm==2">
              <el-button type="text" class="deleteTxt" style="cursor: default">有异议</el-button>
              <el-button type="primary" @click="dissentDetailModal()"><i class="red-pot3"></i>&nbsp;详 情&nbsp;</el-button>
            </el-row>
            <!-- 已确认有异议 -->
            <el-row style="margin-top:20px" v-if="mySalaryDetail.employConfirm==3">
              <el-button type="text" class="deleteTxt" style="cursor: default">有异议</el-button>
              <el-button type="primary" @click="dissentDetailModal()">&nbsp;详 情&nbsp;</el-button>
            </el-row>
          </el-col>
        </el-row>
      </div>

    </div>
    <!-- 实发薪酬弹窗 -->
    <el-dialog title="实发薪酬" :close-on-click-modal="false" :visible.sync="salaryDetailFlag" width="888px" class="grayBg">
      <div class="whiteBox">
        <p class="pReset">总计：<span>{{actualSalary.total}}</span></p>
        <el-row class="textLft">
          <el-col :span="4" class="height26">应发薪酬：</el-col>
          <el-col :span="4" class="height26">{{payableSalary}}</el-col>
          <el-col :span="4" class="height26">社保单位承担：</el-col>
          <el-col :span="4" class="height26">{{socialCompanyBear}}</el-col>
          <el-col :span="4" class="height26">提交时间：</el-col>
          <el-col :span="4" class="height26">2019-05-24</el-col>
          <el-col :span="4" class="height26">预发薪酬：</el-col>
          <el-col :span="4" class="height26">{{advanceSalary}}</el-col>
          <el-col :span="4" class="height26">公积金单位承担：</el-col>
          <el-col :span="4" class="height26">{{fundCompanyBear}}</el-col>
          <el-col :span="4" class="height26">提交人：</el-col>
          <el-col :span="4" class="height26">{{mySalaryDetail.employeeName}}</el-col>
          <el-col :span="4" class="height26">扣款合计：</el-col>
          <el-col :span="4" class="height26">{{totalDeductions}}</el-col>
        </el-row>
      </div>
      <div class="whiteBox">
        <p class="pReset colorD">是否有异议</p>
        <p class="pReset colorRed">{{mySalaryDetail.employConfirm==1?'无异议':'有异议'}}</p>
        <p>{{dissentDetailData.dissentContent}}</p>
        <el-row class="textLft">
          <el-col :span="12" class="height26">提交人：</el-col>
          <el-col :span="4" class="height26">{{mySalaryDetail.employeeName}}</el-col>
          <el-col :span="4" class="height26">提交时间：</el-col>
          <el-col :span="4" class="height26">{{mySalaryDetail.employConfirm==1?mySalaryDetail.confirmTime:dissentDetailData.createTime}}</el-col>
        </el-row>
      </div>
      <div class="whiteBox" v-if="dissentDetailData.replyContent">
        <p class="pReset colorD">最终结果</p>
        <p class="pReset">回复</p>
        <p>{{dissentDetailData.replyContent}}</p>
        <el-row class="textLft">
          <el-col :span="12" class="height26">提交人：</el-col>
          <el-col :span="4" class="height26">{{dissentDetailData.updateUserName}}</el-col>
          <el-col :span="4" class="height26">提交时间：</el-col>
          <el-col :span="4" class="height26">{{dissentDetailData.updateTime}}</el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="salaryDetailFlag = false">返 回</el-button>
      </span>
    </el-dialog>
    <!-- END -->
    <!-- 消息详情 -->
    <!-- <el-dialog title="消息详情" :close-on-click-modal="false" :visible.sync="infoDetailFlag" width="452px" class="grayBg">
      <p>您本月工资账单已生成。</p>
      <p class="pSub">财务部-章三</p>
      <p class="pSub">2019-05-24 12:00:01</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="infoDetailFlag = false">返回</el-button>
      </span>
    </el-dialog> -->
    <!-- 更多消息通知 -->
    <el-dialog title="消息通知" :close-on-click-modal="false" :visible.sync="moreMsgFlag" width="568px" class="grayBg">
      <el-table :data="moreMsgData" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}" @row-click="seeDetail" stripe>
        <el-table-column label="详情">
          <template slot-scope="scope">
            <div style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis">
              <i class="red-pot2" v-if="scope.row.isRead==0"></i>
              {{scope.row.msgContent}}
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="source" label="来源"></el-table-column>
        <el-table-column prop="date" label="日期"></el-table-column> -->
      </el-table>
      <!-- 分页 -->
      <div id="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handlecurrentChange" :current-page="current" :page-sizes="[5,10,20]" :page-size="size" layout="total,sizes,prev,pager,next,jumper" :total="total">
        </el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="moreMsgFlag = false">返回</el-button>
      </span>
    </el-dialog>
    <!-- 消息详情 -->
    <el-dialog title="消息详情" :close-on-click-modal="false" :visible.sync="MsgDetailFlag" width="500px" class="grayBg">
      <span>{{magDetailData.msgContent}}</span>
      <!-- <div style="text-align:right;margin-top:10px">
        <span>财务部-李四</span>
      </div>
      <div style="text-align:right;margin-top:10px">
        <span>2019-05-24 12:00:01</span>
      </div> -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="MsgDetailFlag = false">关闭</el-button>
      </span>
    </el-dialog>
    <!-- 孝敬费明细 -->
    <el-dialog title="孝敬费明细" :close-on-click-modal="false" :visible.sync="messageFlag" width="768px" class="grayBg">
      <el-table :data="parentMoneyData" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}" :summary-method="getSummaries" show-summary>
        <el-table-column prop="storeDate" label="所属月份"></el-table-column>
        <el-table-column prop="prePersonMoney" label="个人部分"></el-table-column>
        <el-table-column prop="preCompanyMoney" label="公司部分"></el-table-column>
        <el-table-column prop="sumMoney" label="总计"></el-table-column>
      </el-table>
      <!-- 分页 -->
      <!-- <div id="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handlecurrentChange" :current-page="current" :page-sizes="[5,10,20]" :page-size="size" layout="total,sizes,prev,pager,next,jumper" :total="total">
        </el-pagination>
      </div> -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="messageFlag = false">返回</el-button>
      </span>
    </el-dialog>
    <!-- 修改银行卡号 -->
    <!-- <el-dialog title="修改银行卡号" :close-on-click-modal="false" :visible.sync="resetBankCard" width="768px">
      <el-row class="textLft">
        <el-form :model="resetBankCardform" ref="resetBankCardform" label-width="150px">
          <el-col :md="12">
            <el-form-item label="开户行：" prop="deposit">
              <el-select placeholder="银行名称" v-model="resetBankCardform.deposit">
                <el-option value="建设银行">建设银行</el-option>
                <el-option value="中国银行">中国银行</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="支行名称：" prop="bankName">
              <el-input v-model="resetBankCardform.bankName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="姓名：" prop="name">
              <el-input v-model="resetBankCardform.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="银行卡号：" prop="cardNum">
              <el-input v-model="resetBankCardform.cardNum"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="开卡类型：" prop="type">
              <el-select v-model="resetBankCardform.type">
                <el-option value="代办">代办</el-option>
                <el-option value="自办">自办</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="等级卡：" prop="level">
              <el-select placeholder="一类卡不限额，二类卡限额1万" v-model="resetBankCardform.level">
                <el-option value="一类卡">一类卡</el-option>
                <el-option value="一类卡">二类卡</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetBankCard = false">取消</el-button>
        <el-button type="primary" @click="resetBankCard = false">确定</el-button>
      </span>
    </el-dialog> -->
    <!-- 提交异议 -->
    <el-dialog title="请填写异议详情" :close-on-click-modal="false" :visible.sync="dissentFlag" width="500px" class="grayBg">
      <el-form :model="dissentForm" :rules="dissentFormRule" ref="dissentForm">
        <el-form-item prop="dissentContent">
          <el-input type="textarea" v-model="dissentForm.dissentContent" maxlength=200 rows="4" resize="none"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dissentFlag = false">取消</el-button>
        <el-button type="primary" @click="dissentSave('dissentForm')">保存</el-button>
      </span>
    </el-dialog>
    <!-- 提交异议 -->
    <el-dialog fullscreen :visible.sync="pswFlag" :show-close="false" class="grayBg">

    </el-dialog>
    <el-dialog title=密码验证 :close-on-click-modal="false" :visible.sync="pswFlag" :before-close="goBack" width="500px" class="grayBg">
      <el-form :model="pswForm" label-width="150px" @submit.native.prevent>
        <el-form-item label="登录密码：">
          <el-input v-model.trim="pswForm.pwd" type="password" placeholder="请输入登录密码" style="width:250px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="checkPsw()">确认</el-button>
      </span>
    </el-dialog>

    <!-- 明细弹窗111 -->
    <el-dialog :title="detailTitle" :close-on-click-modal="false" :visible.sync="detailFlag" width="768px" class="grayBg">
      <el-table :data="detailData" border style="width:100%" height="500px" :header-cell-style="{backgroundColor:'#e5e9f3'}" :summary-method="getDetailSummaries" show-summary>
        <el-table-column prop="deptName" label="所属部门"></el-table-column>
        <el-table-column label="调整类型">
          <template slot-scope="scope">
            <span v-if="scope.row.adjustType==1">其他补助</span>
            <span v-else-if="scope.row.adjustType==2">其他应扣款项</span>
            <span v-else-if="scope.row.adjustType==3">其他代扣款项</span>
            <span v-else-if="scope.row.adjustType==4">代扣调整款项</span>
          </template>
        </el-table-column>
        <el-table-column prop="adjustContent" label="调整内容"></el-table-column>
        <el-table-column prop="adjustMoney" label="金额"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detailFlag = false">关闭</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import { GET, POST, PUT } from "http/custom.js"

export default {
  name: 'my-salary',
  data() {
    return {
      pswFlag: true,
      pswForm: {
        pwd: ''
      },
      fullscreenLoading: true,
      employeNum: '',//用户的员工编号
      userDetailInfo: {},//用户的基本信息
      redPotFlag: false,
      year: 2019,
      month: 1,
      yearFlag: 2019,
      monthFlag: 1,
      batch: '',
      dataFlag: false,
      mySalaryDetail: {},
      baseSalary: {},//基础工资
      baseSubsidy: {},//基本补助
      noSubsidy: {},//不参与考勤补助
      performanceSalary: {},//绩效工资
      deductionItem: {},//应扣款项
      replayDeductionItem: {},//代扣款项
      actualSalary: {},//实发薪酬
      payableSalary: '--',
      socialCompanyBear: '--',
      fundCompanyBear: '--',
      advanceSalary: '--',
      totalDeductions: '--',
      //异议弹窗
      dissentForm: {
        dissentContent: ''
      },
      dissentFormRule: {
        dissentContent: [{ required: true, message: "请填写异议详情", trigger: "blur" }]
      },
      dissentFlag: false,
      // 异议详情弹窗
      salaryDetailFlag: false,
      dissentDetailData: {},
      // 消息详情
      // infoDetailFlag: false,
      MsgDetailFlag: false,
      magDetailData: {},
      // 消息通知
      current: 1,
      size: 10,
      total: 0,
      pages: 0,
      moreMsgFlag: false,
      moreMsgData: [],
      msgString: '',
      // 孝敬费
      messageFlag: false,
      parentMoneyData: [],
      // 
      resetBankCard: false,
      resetBankCardform: {
        deposit: '',
        bankName: '',
        name: '',
        cardNum: '',
        type: '',
        level: ''
      },
      //111
      detailFlag: false,
      detailData: [],
      detailTitle: ''

    }
  },
  created() {
    this.getPYd()
    // this.getUserInfo()
  },
  methods: {
    fetchDetail(num, title) {
      this.detailTitle = title
      let batch = ''
      if (this.month < 9) {
        batch = this.year + '-0' + (this.month + 1)
      } else {
        batch = this.year + '-' + (this.month + 1)
      }
      let obj = {
        "employeeNo": this.employeNum,
        "batch": batch,
        "adjustType": num
      }
      console.log(obj)
      GET(process.env.VUE_APP_DOMAIN_personnel + '/personnel/adjustmentitem/fetchAdjustmentitemInfo', obj).then(res => {
        if (res.code == 0) {
          if (res.data.length == 0) {
            this.$message.error("暂无数据！")
          } else {
            this.detailData = res.data
            this.detailFlag = true
          }
        }
      }).catch(error => {
        console.log(error)
      })
    },
    getDetailSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0 || index === 1 || index === 4) {
          sums[index] = '';
          return;
        }
        if (index === 2) {
          sums[index] = '总计：';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += ' 元';
        }
      });
      return sums;
    },
    goBack() {
      this.$router.push({
        path: `/home/personalCenter`
      })
    },
    checkPsw() {
      if (this.pswForm.pwd == '') {
        this.$message.error("请输入密码！")
        return
      }
      GET(process.env.VUE_APP_DOMAIN_oa_manage + '/salary/validatePassWord', this.pswForm).then(res => {
        console.log(res.IsSuccess)
        if (res.IsSuccess == true) {
          this.getUserInfo()
          this.$message({
            type: 'success',
            message: '密码验证通过！',
            showClose: true
          })
          this.pswFlag = false
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 获取用户权限列表
    getUserInfo() {
      this.$store.dispatch('oaGetTokenInfo').then((res) => {
        this.getUserDep(res.id)
      })
    },
    //获取用户部门级别信息
    getUserDep(id) {
      GET(process.env.VUE_APP_DOMAIN_performance + '/hrUserInfoByRegId', { regid: id }).then(res => {
        console.log(res.data);
        this.employeNum = res.data.userNumber
        this.getUserDetailInfo()
        this.readFlag()
        this.search()
      }).catch(error => {
        console.log(error)
      })
    },
    readFlag() {
      let searchObj = {
        "current": this.current,
        "size": this.size,
        "employeeNo": this.employeNum,
        "isRead": "0"
      }
      POST(process.env.VUE_APP_DOMAIN_financial + '/financial/msgNotice/msgNotices', searchObj).then(res => {//判断是否显示未读
        if (res.data.records.length != 0) {
          this.redPotFlag = true
        }
      }).catch(error => {
        console.log(error)
      })
      let searchObj2 = {
        "current": this.current,
        "size": this.size,
        "employeeNo": this.employeNum
      }
      POST(process.env.VUE_APP_DOMAIN_financial + '/financial/msgNotice/msgNotices', searchObj2).then(res => {//取第一条放到右上角
        if (res.data.records.length != 0) {
          let msgArr = res.data.records
          this.msgString = msgArr[0].msgContent
        } else {
          this.msgString = '暂时没有信息'
        }
      }).catch(error => {
        console.log(error)
      })
    },
    //获取更多信息
    getMoreMag() {
      let searchObj = {
        "current": this.current,
        "size": this.size,
        "employeeNo": this.employeNum
      }
      POST(process.env.VUE_APP_DOMAIN_financial + '/financial/msgNotice/msgNotices', searchObj).then(res => {
        this.moreMsgData = res.data.records
        this.moreMsgFlag = true
        this.current = res.data.current //set当前页
        this.pages = res.data.pages //总记录条数
        this.size = res.data.size //每页显示记录条数
        this.total = res.data.total //总记录条数
        console.log(this.total);
      }).catch(error => {
        console.log(error)
      })
    },
    //查看消息
    seeDetail(row, event, index) {
      console.log(row, event, index);
      GET(process.env.VUE_APP_DOMAIN_financial + '/financial/msgNotice/msgNoticesInfo', { id: row.id }).then(res => {//查询薪资类型模板
        this.magDetailData = res.data
        this.MsgDetailFlag = true
        this.msgUpdateStatus(row.id)
      }).catch(error => {
        console.log(error)
      })
    },
    // 更新消息状态，置为已读
    msgUpdateStatus(id) {
      console.log(id)
      PUT(process.env.VUE_APP_DOMAIN_financial + '/financial/msgNotice/updateMsgNotice', { id: id, isRead: '1' }).then(res => {//查询薪资类型模板
        if (res.code == '0') {
          this.getMoreMag()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    getUserDetailInfo() {//获取员工基本信息
      let batch = ''
      if (this.month < 9) {
        batch = this.year + '-0' + (this.month + 1)
      } else {
        batch = this.year + '-' + (this.month + 1)
      }
      this.batch = batch
      GET(process.env.VUE_APP_DOMAIN_financial + '/financial/queryBasicEmployInfo', { employeeNo: this.employeNum, batch: batch }).then(res => {
        this.userDetailInfo = res.data
      }).catch(error => {
        console.log(error)
      })
    },
    search() {
      this.fullscreenLoading = true
      let batch = ''
      if (this.month < 9) {
        batch = this.year + '-0' + (this.month + 1)
      } else {
        batch = this.year + '-' + (this.month + 1)
      }
      console.log(batch)
      GET(process.env.VUE_APP_DOMAIN_financial + '/financial/employPayrollLedgers', { "employeeNo": this.employeNum, "batch": batch }).then(res => {//查询薪资类型模板
        // GET(process.env.VUE_APP_DOMAIN_financial + '/financial/employPayrollLedgers', { "employeeNo": 8181006055, "batch": batch }).then(res => {//查询薪资类型模板
        // ******************无数据后台要传基本数据过来
        if (res.code == 3) {//工资条没有发放，不能查看工资台账
          this.dataFlag = false
        } else if (res.code == 0) {//工资条已经发放
          this.baseSalary = res.data[5]
          this.baseSubsidy = res.data[6]
          this.noSubsidy = res.data[0]
          this.performanceSalary = res.data[1]
          this.deductionItem = res.data[2]
          this.replayDeductionItem = res.data[3]
          this.actualSalary = res.data[4]
          this.payableSalary = this.actualSalary.data[2].amount
          this.socialCompanyBear = this.actualSalary.data[4].amount
          this.fundCompanyBear = this.actualSalary.data[5].amount
          this.advanceSalary = this.actualSalary.data[3].amount
          this.totalDeductions = this.actualSalary.data[1].amount
          this.dataFlag = true
        }
      }).catch(error => {
        console.log(error)
      })
      GET(process.env.VUE_APP_DOMAIN_financial + '/financial/queryEmployInfo', { "employeeNo": this.employeNum, "batch": batch }).then(res => {
        if (res.data) {
          this.mySalaryDetail = res.data
          this.fullscreenLoading = false

        } else {
          this.mySalaryDetail = {}
          this.fullscreenLoading = false
        }
      }).catch(error => {
        console.log(error)
      })
    },

    goFattendMonthReport() {
      window.open(`${process.env.VUE_APP_DOMAIN}/html/index.html?tmp=attendance%2Fuser%2FattendMonthReport.html&yString=${this.year}&mString=${this.month + 1}`)
    },
    goAddperson() {
      window.open(`${process.env.VUE_APP_DOMAIN}/html/index.html?tmp=%2Fhtml%2Fhrsystem%2Fnt_addperson.html`)
    },
    handleSizeChange(val) {
      console.log(`每页：${val}`)
    },
    handlecurrentChange(val) {
      console.log(`当前页：${val}`)
    },
    // 点击月份
    preYear() {
      this.year--;
      this.month = 11
      this.search()
      this.getUserDetailInfo()
    },
    afterYear() {
      if (this.year <= this.yearFlag - 1) {
        this.year++;
        this.month = 0
        this.search()
        this.getUserDetailInfo()
      } else {
        this.$message({
          type: 'fail',
          message: '年份选择超限,工资条未生成!',
          showClose: true
        })
      }

    },
    monthSelect(num) {
      if (num <= this.monthFlag) {
        this.month = num - 1
        this.search()
        this.getUserDetailInfo()
      } else {
        this.$message({
          type: 'fail',
          message: '月份选择超限,工资条未生成!',
          showClose: true
        })
      }
    },
    verify() {
      this.$msgBox.confirm(
        '<span>您是否确认无异议？？</span>',
        "温馨提示",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        GET(process.env.VUE_APP_DOMAIN_financial + '/financial/employPayrollConfirm',
          {
            employPayrollId: this.mySalaryDetail.id
          }).then(res => {
            this.$message({
              type: 'success',
              message: '工资条确认成功!',
              showClose: true
            })
            this.search()
          }).catch(error => { })
      }).catch(() => {
        console.log("失败");
      })
    },
    //提交异议
    dissentModal() {
      this.dissentFlag = true
    },
    dissentSave(formName) {
      //console.log(this[formName]);
      this.$refs[formName].validate(valid => {
        if (valid) {
          let obj = this[formName]
          obj.employPayrollId = this.mySalaryDetail.id
          //console.log(obj);
          POST(process.env.VUE_APP_DOMAIN_financial + '/financial/employpayrolldissent/saveDissentContent', obj).then(res => {
            this.$message({
              type: 'success',
              message: '提交异议成功!',
              showClose: true
            })
            this.dissentFlag = false
            this.search()
          }).catch(error => {
            console.log(error)
          })
        }
      })
    },
    //异议详情
    dissentDetailModal() {
      GET(process.env.VUE_APP_DOMAIN_financial + '/financial/employpayrolldissent/employpayrolldissentInfo', { "employPayrollId": this.mySalaryDetail.id }).then(res => {//查询薪资类型模板
        if (res.data) {
          this.dissentDetailData = res.data
          this.dissentDetailData.createTime = this.dissentDetailData.createTime.split(' ')[0]
          this.dissentDetailData.updateTime = this.dissentDetailData.updateTime.split(' ')[0]
        } else {
          this.dissentDetailData = {}
        }
      }).catch(error => {
        console.log(error)
      })
      this.salaryDetailFlag = true
    },
    parentMoneyCheck() {
      this.messageFlag = true
      GET(process.env.VUE_APP_DOMAIN_financial + '/finance/financialGeneralLedger/queryFilialDetails', { "employeeNo": this.employeNum, yearMonth: this.batch }).then(res => {//查询薪资类型模板
        console.log(res);
        this.parentMoneyData = res.data
      }).catch(error => {
        console.log(error)
      })
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0 || index === 1) {
          sums[index] = '--';
          return;
        }
        if (index === 2) {
          sums[index] = '总计：';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += ' 元';
        }
      });
      return sums;
    },
    getPYd() { //获取当前年上月并赋值 格式为 2019-07
      let date = new Date()
      let year = date.getFullYear()
      this.year = year
      this.yearFlag = year
      let month = date.getMonth() - 1
      this.month = month
      this.monthFlag = month + 2
    }
  }
}
</script>
<style>
/* 月份切换 */
.el-step__head.is-process {
  color: #ff5e5e;
  border-color: #ff5e5e;
}
.el-step__description.is-process {
  color: #ff5e5e;
}
.el-step__title.is-process {
  color: #ff5e5e;
}
</style>
<style scoped>
.pad-10 {
  padding: 10px;
}
.guide {
  float: left;
}
.notification {
  letter-spacing: 0.86px;
  font-size: 12px;
  float: right;
  position: relative;
}
.msgStr {
  display: inline-block;
  width: 240px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 12px;
}
.red-pot {
  width: 6px;
  height: 6px;
  background-color: red;
  display: block;
  border-radius: 50%;
  position: absolute;
  right: 40px;
  z-index: 10;
}
.red-pot2 {
  width: 6px;
  height: 6px;
  background-color: red;
  display: block;
  border-radius: 50%;
  position: absolute;
  left: 5px;
  z-index: 10;
}
.red-pot3 {
  width: 10px;
  height: 10px;
  background-color: red;
  display: block;
  border-radius: 50%;
  position: absolute;
  left: 107px;
  top: -4px;
  z-index: 10;
}
.item {
  color: #444444;
}
.more {
  color: #979797;
  cursor: pointer;
  margin-left: 10px;
}
.headPic {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
}
.headPic img {
  height: 90px;
  width: 90px;
  border-radius: 50%;
  border: 2px solid #c6ccdd;
}
.up-content {
  font-family: PingFangSC-Regular;
  font-size: 13px;
  color: #444;
  letter-spacing: 0.93px;
  line-height: 18px;
}
.up-content .name {
  font-weight: 900;
}
.upIcon {
  color: #2e76ee;
  font-size: 18px;
  vertical-align: bottom;
}
.cursorFlag {
  cursor: pointer;
}
/* 详细数据 */
.year-box {
  text-align: center;
  font-size: 24px;
  color: #2e76ee;
  letter-spacing: 1.49px;
  padding-top: 20px;
}
.detail-box {
  border-top: 1px solid #e1e5ef;
  margin-top: 30px;
}
.item .detail-title {
  font-size: 16px;
  font-weight: 900;
  color: #222222;
  letter-spacing: 1.11px;
  line-height: 40px;
  margin-top: 20px !important;
}
.colorB {
  color: #2e76ee;
}
.item {
  position: relative;
  padding-left: 20px;
  border-right: 1px solid #e1e5ef;
  height: 430px;
}
.item p {
  margin: 0;
  font-size: 13px;
  color: #444;
  letter-spacing: 0.93px;
  line-height: 25px;
}
.item .detail-num {
  font-size: 16px;
  color: #2e76ee;
  letter-spacing: 1.11px;
  padding-bottom: 10px;
  /* line-height: 50px; */
}
.rIcon {
  position: absolute;
  top: 62px;
  right: -14px;
  font-size: 20px;
  color: #0075f6;
}
.all p {
  color: #2e76ee !important;
}
.all .detail-num {
  font-weight: bold;
}
/* 实发薪酬弹窗 */
.colorRed {
  color: #ff5454;
}
.colorD {
  color: #303133;
}
/* 消息详情 */
.pSub {
  text-align: right;
  color: #000;
  margin: 5px 0;
}
/* 无数据 */
.no-data {
  position: relative;
  height: 400px;
}
.icon-text {
  position: absolute;
  left: 50%;
  margin-left: -190px;
  top: 100px;
}
.icon-text > div {
  float: left;
}
.icon-text .tishi {
  padding-top: 20px;
}
.tishi p {
  font-size: 22px;
  margin: 11px 0;
  color: #444;
  letter-spacing: 1.57px;
}
</style>
