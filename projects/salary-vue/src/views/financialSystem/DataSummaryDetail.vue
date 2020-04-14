<template>
  <div class="data-summary">
    <div class="guide">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home/financialSystem' }">财务系统</el-breadcrumb-item>
        <el-breadcrumb-item>数据汇总台账</el-breadcrumb-item>
        <el-breadcrumb-item>工资条明细</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/financialSystem/dataSummary' }">(返回上级)</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="bgWhite mgt15 pad-all">
      <div class="head-box">
        <div class="mar-btm" style="text-align:center"> <span class="title">{{year}}年{{month}}月薪酬数据汇总一览表({{systemTypeTxt}})</span></div>
        <el-row>
          <el-col :span="19">
            <el-form :inline="true" :model="detailSearch" class="mar-no pull-left">
              <el-form-item label="年月">
                <el-date-picker v-model="detailSearch.batch" @change="JS_Search" :editable="false" :clearable="false" type="month" class="width155" value-format="yyyy-MM" placeholder="选择月份">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="员工编号">
                <el-input-number @keyup.enter.native="JS_Search" placeholder="请输入员工编号" :controls="false" v-model="detailSearch.employeeNo" class="width155" :min="0" :max="8888888888"></el-input-number>
              </el-form-item>
              <el-form-item label="所属单位">
                <el-input v-model.trim="detailSearch.subordinateUnits" @keyup.enter.native="JS_Search" placeholder="请输入所属区域" class="width155"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="JS_Search" icon="el-icon-search">搜索</el-button>
                <el-button @click="searchMoreClick">更多查询</el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="5">
            <div class="pull-right">
              <el-dropdown @command="handleCommand" trigger="click" class="mar-rgt">
                <el-button type="primary">
                  更多操作<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="a" divided v-if="systemType === '1'" :disabled="isLockFlag2===true">生成工资条</el-dropdown-item>
                  <el-dropdown-item command="b" divided v-if="systemType === '1'" :disabled="isLockFlag2maked===true">取消生成工资条</el-dropdown-item>
                  <el-dropdown-item command="c" divided>导入版</el-dropdown-item>
                  <el-dropdown-item command="d" divided>系统生成版</el-dropdown-item>
                  <el-dropdown-item command="e" divided :disabled="systemType === '1'">导入</el-dropdown-item>
                  <el-dropdown-item command="f" divided>导出所有</el-dropdown-item>
                  <el-dropdown-item command="g" divided>返回总台帐</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-button type="danger" v-if="isLockFlag3==false || systemType === '2'" @click="sendSalaryFlag = true">发放工资</el-button>
              <el-button v-if="isSubmitFlag==false" @click="JS_cancelSubmit">取消发放</el-button>
            </div>
          </el-col>

        </el-row>
      </div>
      <div class="">
        <el-table :data="dataSummaryDetail" :height="tabHeight" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
          <el-table-column type="index" label="序号" fixed="left" min-width="50"></el-table-column>
          <el-table-column prop="idNumber" label="身份证号" min-width="160"></el-table-column>
          <el-table-column prop="employeeNo" label="员工编号" min-width="120"></el-table-column>
          <el-table-column prop="subordinateUnits" label="所属单位" min-width="130" show-overflow-tooltip></el-table-column>
          <el-table-column label="在职状态" min-width="70">
            <template slot-scope="scope">
              <span v-if="scope.row.jobState ==0">未入职</span>
              <span v-else-if="scope.row.jobState ==1">在职</span>
              <span v-else-if="scope.row.jobState ==2">离职</span>
              <span v-else-if="scope.row.jobState ==3">重聘</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column prop="bizTypeName" label="业务类型" min-width="100"></el-table-column>
          <el-table-column prop="workingHours" label="全月应出勤小时" min-width="120"></el-table-column>
          <el-table-column prop="actualWorkingHours" label="全月实出勤小时" min-width="120"></el-table-column>
          <el-table-column prop="employeeName" label="姓名" min-width="150"></el-table-column>
          <el-table-column label="性别" min-width="50">
            <template slot-scope="scope">
              <span v-if="scope.row.gender==='1'">男</span>
              <span v-else-if="scope.row.gender==='0'">女</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column prop="generalManager" label="总经理" min-width="150"></el-table-column>
          <el-table-column prop="bloc" label="集团" min-width="150"></el-table-column>
          <el-table-column prop="minister" label="部长" min-width="150"></el-table-column>
          <el-table-column prop="groupLeader" label="组长" min-width="150"></el-table-column>
          <el-table-column prop="postName" label="职务" min-width="140"></el-table-column>
          <el-table-column prop="levelName" label="职位" min-width="140"></el-table-column>
          <el-table-column label="入职日期" min-width="100">
            <template slot-scope="scope">
              <span>{{scope.row.entryDate?scope.row.entryDate.split(' ')[0]:'--'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="转正日期" min-width="100">
            <template slot-scope="scope">
              <span>{{scope.row.becomeWorkerDate?scope.row.becomeWorkerDate.split(' ')[0]:'--'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="employeeType" label="员工类型" min-width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="basicSalary" label="基本工资" min-width="80"></el-table-column>
          <el-table-column prop="secretAllowance" label="保密补助" min-width="80"></el-table-column>
          <el-table-column prop="lunchAllowance" label="中餐补助" min-width="80"></el-table-column>
          <el-table-column prop="trafficAllowance" label="交通补助" min-width="80"></el-table-column>
          <el-table-column prop="phoneAllowance" label="电话补助" min-width="80"></el-table-column>
          <el-table-column prop="modelworkerAllowance" label="劳模补助" min-width="80"></el-table-column>
          <el-table-column prop="dutySalary" label="职务工资" min-width="80"></el-table-column>
          <el-table-column prop="extraworkSalary" label="加班工资" min-width="80"></el-table-column>
          <el-table-column prop="socialSecurityAllowance" label="社保补助" min-width="80"></el-table-column>
          <el-table-column prop="internshipAllowance" label="实习补贴" min-width="80"></el-table-column>
          <el-table-column prop="mealAllowance" label="餐补" min-width="80"></el-table-column>
          <el-table-column prop="houseRentingAllowance" label="租房补贴" min-width="80"></el-table-column>
          <el-table-column prop="workingYearsSalary" label="工龄工资" min-width="80"></el-table-column>
          <el-table-column prop="educationAllowance" label="学历补助" min-width="80"></el-table-column>
          <el-table-column prop="fullAttendanceBonus" label="全勤奖" min-width="80"></el-table-column>
          <el-table-column prop="talentIntroductionAward" label="人才引进奖" min-width="100"></el-table-column>
          <el-table-column prop="performanceAccrue" label="绩效计提" min-width="80"></el-table-column>
          <el-table-column prop="performanceSalary" label="绩效考核" min-width="80"></el-table-column>
          <el-table-column prop="specialPerformance" label="特殊绩效" min-width="80"></el-table-column>
          <el-table-column prop="annualAwards" label="年度奖励" min-width="80"></el-table-column>
          <el-table-column prop="trainingAllowance" label="培训补助" min-width="80"></el-table-column>
          <el-table-column prop="travelExpensesAllowance" label="差旅补助" min-width="80"></el-table-column>
          <el-table-column prop="otherAllowance" label="其他补助" min-width="80"></el-table-column>
          <el-table-column prop="festivalBenefits" label="节日福利" min-width="80"></el-table-column>
          <el-table-column prop="allowanceRebate" label="补助补贴扣回" min-width="100"></el-table-column>
          <el-table-column prop="changesAdjust" label="中途异动差异额调整" min-width="150"></el-table-column>
          <el-table-column prop="totalPayableSalary" label="综合应发薪酬" min-width="100"></el-table-column>
          <el-table-column prop="unfullAttendanceDeduct" label="非全勤扣款" min-width="100"></el-table-column>
          <el-table-column prop="attendanceAbnormalAmount" label="考勤异常扣款" min-width="100"></el-table-column>
          <el-table-column prop="dormDeductAmount" label="宿舍费扣款" min-width="100"></el-table-column>
          <el-table-column prop="workClothesAmount" label="工装扣款" min-width="80"></el-table-column>
          <el-table-column prop="monitorDeduct" label="监察扣款" min-width="80"></el-table-column>
          <el-table-column prop="otherDeductAmount" label="其他应扣款" min-width="100"></el-table-column>
          <el-table-column prop="socialPersonalBear" label="社保个人承担部分" min-width="140"></el-table-column>
          <el-table-column prop="fundPersonalBear" label="公积金个人承担" min-width="130"></el-table-column>
          <el-table-column prop="borrowAmount" label="借支" min-width="80"></el-table-column>
          <el-table-column prop="filialMoney" label="代扣孝敬费" min-width="100"></el-table-column>
          <el-table-column prop="mealWithholdDeduct" label="代扣餐费" min-width="100"></el-table-column>
          <el-table-column prop="educationDeduct" label="代扣学历提升扣款" min-width="120"></el-table-column>
          <el-table-column prop="administrativeWithholdDeduct" label="行政代扣款项" min-width="100"></el-table-column>
          <el-table-column prop="otherWithholdAmount" label="其他代扣款" min-width="100"></el-table-column>
          <el-table-column prop="withholdChangesAmount" label="代扣调整项" min-width="100"></el-table-column>
          <el-table-column prop="deductTaxes" label="代扣税金" min-width="80"></el-table-column>
          <el-table-column prop="totalDeductions" label="扣款合计" min-width="80"></el-table-column>
          <el-table-column prop="payableSalary" label="应发薪酬" min-width="80"></el-table-column>
          <el-table-column prop="advanceSalary" label="预发薪酬" min-width="80"></el-table-column>
          <el-table-column prop="actuaSalary" label="实发薪酬" min-width="80"></el-table-column>
          <el-table-column prop="socialCompanyBear" label="社保单位承担部分" min-width="140"></el-table-column>
          <el-table-column prop="fundCompanyBear" label="公积金单位承担部分" min-width="140"></el-table-column>
          <el-table-column prop="leaveDate" label="离职日期" min-width="100"></el-table-column>
          <el-table-column prop="phoneNum" label="联系电话" min-width="110"></el-table-column>
          <el-table-column prop="wageCardBank" label="工资卡开户行" min-width="160" show-overflow-tooltip></el-table-column>
          <el-table-column prop="wageCardNum" label="工资卡号" min-width="180"></el-table-column>
          <el-table-column prop="unusualActionDate" label="异动日期" min-width="100"></el-table-column>
          <el-table-column prop="unusualActionReason" label="异动原因" min-width="240" show-overflow-tooltip></el-table-column>
          <el-table-column prop="unusualActionWorkhoursBefore" label="异动前工作小时" min-width="130"></el-table-column>
          <el-table-column prop="unusualActionWorkhoursAfter" label="异动后工作小时" min-width="130"></el-table-column>
          <el-table-column prop="unusualActionSalaryBefore" label="异动前工资" min-width="130"></el-table-column>
          <el-table-column prop="unusualActionSalaryAfter" label="异动后工资" min-width="110"></el-table-column>
          <el-table-column prop="unusualActionSalaryCount" label="异动前后加权计算综合工资" min-width="170"></el-table-column>
          <el-table-column prop="totalSpecialDeductions" label="累计专项扣除合计" min-width="140"></el-table-column>
          <el-table-column prop="childrensEducationExpend" label="累计子女教育" min-width="130"></el-table-column>
          <el-table-column prop="supportParentExpend" label="累计赡养老人" min-width="110"></el-table-column>
          <el-table-column prop="continuingEducationExpend" label="累计继续教育" min-width="110"></el-table-column>
          <el-table-column prop="housingLoanExpend" label="累计住房贷款利息" min-width="130"></el-table-column>
          <el-table-column prop="housingRentExpend" label="累计住房租金" min-width="130"></el-table-column>
          <el-table-column prop="employConfirm" label="异议" min-width="130" show-overflow-tooltip></el-table-column>
          <el-table-column label="备注" min-width="200" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-if="scope.row.remark!=''">{{scope.row.remark}}</div>
              <div v-else>
                <el-button type="text" size="small" @click="openRemark(scope.row.id)">填写</el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" fixed="right">
            <!-- employConfirm -->
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="getSalaryDetail(scope.row.employeeNo)">详情</el-button>
              <el-button type="text" size="small" v-if="scope.row.employConfirm==0" class="deleteTxt">未确认</el-button>
              <el-button type="text" size="small" v-else-if="scope.row.employConfirm==1">已确认</el-button>
              <el-button type="text" size="small" v-else @click="openReplayModal(scope.row.id)" class="deleteTxt">有异议</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div id="pagination">
          <el-pagination @size-change="handleSizeChange" @current-change="handlecurrentChange" background :current-page="current" :page-sizes="[5,10,15,20,30,40]" :page-size="size" layout="total,sizes,prev,pager,next,jumper" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>

    <!-- 更多查询弹框 -->
    <el-dialog title="更多查询" :close-on-click-modal="false" :before-close="immediatelyCancel" v-if="search_more" :visible.sync="search_more" width="850px">
      <el-form :inline="true" :model="moreParam" ref="moreParam" class="mar-no" label-width="90px">

        <el-form-item label="姓名">
          <el-input v-model.trim="moreParam.employeeName" @keyup.enter.native="JS_more_Search" placeholder="请输入名字" class="width155"></el-input>
        </el-form-item>
        <el-form-item label="业务类型">
          <el-input v-model.trim="moreParam.bizType" @keyup.enter.native="JS_more_Search" placeholder="请输入关键字" class="width155"></el-input>
        </el-form-item>
        <el-form-item label="在职状态">
          <el-select clearable placeholder="在职状态" class="width155" v-model="moreParam.jobState">
            <el-option v-for="item in dataOptions2" :key="item.dataId" :label="item.dataName" :value="item.dataId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性别">
          <el-select clearable placeholder="性别" class="width155" v-model="moreParam.gender">
            <el-option v-for="item in dataOptions" :key="item.dataId" :label="item.dataName" :value="item.dataId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="总经理">
          <el-input v-model.trim="moreParam.generalManager" @keyup.enter.native="JS_more_Search" placeholder="请输入名字" class="width155"></el-input>
        </el-form-item>
        <el-form-item label="集团">
          <el-input v-model.trim="moreParam.bloc" @keyup.enter.native="JS_more_Search" placeholder="请输入名字" class="width155"></el-input>
        </el-form-item>
        <el-form-item label="部长">
          <el-input v-model.trim="moreParam.minister" @keyup.enter.native="JS_more_Search" placeholder="请输入名字" class="width155"></el-input>
        </el-form-item>
        <!-- <el-form-item label="组长">
          <el-input v-model="moreParam.search10" placeholder="请输入名字" class="width155"></el-input>
        </el-form-item> -->
        <el-form-item label="职务">
          <el-input v-model.trim="moreParam.postName" @keyup.enter.native="JS_more_Search" placeholder="请输入名字" class="width155"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="JS_immediately_cancel('moreParam')">取消</el-button>
        <el-button type="primary" @click="JS_more_Search">立即搜索</el-button>
      </span>
    </el-dialog>

    <!-- 工资异议回复弹框 -->
    <el-dialog title="工资异议回复" :close-on-click-modal="false" :visible.sync="resplayModal" width="500px">
      <el-table :data="dissentData" border style="width:100%;margin-bottom:10px" :header-cell-style="{backgroundColor:'#e5e9f3'}">
        <el-table-column property="name" label="姓名" width="100"></el-table-column>
        <el-table-column property="content" label="异议详情"></el-table-column>
        <el-table-column property="time" label="时间" width="150"></el-table-column>
      </el-table>
      <el-form :model="replayForm" :rules="replayFormRule" ref="replayForm">
        <el-form-item prop="replyContent">
          <el-input type="textarea" v-model="replayForm.replyContent" placeholder="请填写工资异议回复" rows="4"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resplayModal = false">取消</el-button>
        <el-button type="primary" @click="replay('replayForm')">保存</el-button>
      </span>
    </el-dialog>
    <!-- 备注弹窗 -->
    <el-dialog title="备注" :close-on-click-modal="false" :visible.sync="remarkModal" width="500px" class="grayBg">
      <el-form :model="remarkForm" :rules="remarkFormRule" ref="remarkForm">
        <el-form-item prop="remark">
          <el-input type="textarea" v-model="remarkForm.remark" rows="4"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="remarkModal = false">取消</el-button>
        <el-button type="primary" @click="remarkSave('remarkForm')">保存</el-button>
      </span>
    </el-dialog>    
    <!-- 生成工资条弹窗-->
    <el-dialog title="工资发放" :close-on-click-modal="false" :visible.sync="sendSalaryFlag" width="500px" @close="cancelSendSalaryForm('sendSalaryForm')">
      <el-row>
        <el-col :xs="21" :offset="1"  class="warnIcoBg">
            <h2>您确定数据无误，发放本月工资？</h2>
            <span style="color:red">注：发放后，所有员工会收到工资条！</span>
        </el-col>
      </el-row>      
      <el-form :model="sendSalaryForm" ref="sendSalaryForm" label-width="160px">
        <el-form-item
          label="请确认发放版本"
          prop="type"
          :rules="{required:true,message:'请确认发放版本',trigger:'blur'}"
        >
          <el-select v-model="sendSalaryForm.type" placeholder="请选择" disabled>
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
    <!-- 正在生成工资条 -->
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
    <!-- 工资导出弹框 -->
    <el-dialog title="工资导出" :close-on-click-modal="false" :visible.sync="downloadSalary" width="450px">
      <p>
        <el-button size="mediumn" @click="JS_download(1)">保存至本地</el-button>&nbsp;&nbsp;
        <el-button size="mediumn" @click="JS_download(2)">发送至本人内网邮箱</el-button>
      </p>
      <el-alert title="温馨提示" type="warning" :closable="false" description="保存至本地需要等待数秒至数分钟" show-icon>
      </el-alert>
    </el-dialog>
    <!-- 工资详情 -->
    <el-dialog title="工资条详情" :close-on-click-modal="false" :visible.sync="salaryDetail" width="1300px" class="grayBg">
      <div class="whiteBox mgt15 pad-10">
        <el-row>
          <el-col :span="4">
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
          <el-col :span="7">
            <div class="up-content">
              <p>入职日期：<span>{{userDetailInfo.entryDate?userDetailInfo.entryDate.split(' ')[0]:'--'}}</span></p>
              <p>转正日期：<span>{{userDetailInfo.turnformalDate?userDetailInfo.turnformalDate.split(' ')[0]:'--'}}</span></p>
              <p>{{month}}月应出勤：<span>{{userDetailInfo.workingHours?userDetailInfo.workingHours+'小时':'--'}}</span></p>
              <p>{{month}}月实际出勤：<span>{{userDetailInfo.actualWorkingHours?userDetailInfo.actualWorkingHours+'小时':'--'}}</span></p>
              <p>是否全勤：<span>{{userDetailInfo.isFull==0?'否':'是'}}</span></p>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="up-content">
              <!-- <p>银行账号：<span>{{mySalaryDetail.wageCardNum?mySalaryDetail.wageCardNum:'--'}}</span></p>
              <p>开户行：<span>{{mySalaryDetail.wageCardBank?mySalaryDetail.wageCardBank:'--'}}</span></p> -->
              <p>孝敬费累计：<span>{{userDetailInfo.filial?userDetailInfo.filial:'--'}}元</span></p>
              <p>当前工龄：<span>{{userDetailInfo.servicelen==0?'&lt;1':userDetailInfo.servicelen}}年</span></p>
              <p>内推人数：<span>{{userDetailInfo.recommendCount}}人</span></p>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="detail-box whiteBox">
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
              <span v-else @click="fetchDetail('1','其他补助')" style="color:#2e76ee;text-decoration:underline">{{item.amount}}</span>
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
              <span v-if="item.dataSourceName!='其他应扣款'">{{item.amount}}</span>
              <span v-else @click="fetchDetail('2','其他应扣款')" style="color:#2e76ee;text-decoration:underline">{{item.amount}}</span>
            </p>
          </el-col>
          <el-col :span="4" class="item">
            <i class="rIcon"><img src="~libs/images/deng.png" alt=""></i>
            <p class="detail-title">{{replayDeductionItem.name}}</p>
            <p class="detail-num">小计：<span>{{replayDeductionItem.total}}</span></p>
            <p :key="index" v-for="(item,index) in replayDeductionItem.data">
              {{item.dataSourceName}}：
              <span v-if="item.dataSourceName!='其他代扣款'&&item.dataSourceName!='代扣调整款项'">{{item.amount}}</span>
              <span v-else-if="item.dataSourceName=='其他代扣款'" @click="fetchDetail('3','其他代扣款')" style="color:#2e76ee;text-decoration:underline">{{item.amount}}</span>
              <span v-else @click="fetchDetail('4','代扣调整款项')" style="color:#2e76ee;text-decoration:underline">{{item.amount}}</span>
            </p>
          </el-col>
          <el-col :span="4" class="item all">
            <p class="detail-title colorB">{{actualSalary.name}}</p>
            <p class="detail-num">总计：<span>{{actualSalary.total}}</span></p>
            <p :key="index" v-for="(item,index) in actualSalary.data">
              {{item.dataSourceName}}：<span>{{item.amount}}</span>
            </p>
            <!-- <p style="margin-top:20px">提交人：<span>{{mySalaryDetail.employeeName}}</span></p> -->
            <p>提交时间：<span>2019-05-24</span></p>
            <p>工资确认：</p>
            <!-- 未确认 -->
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <!-- 扣款明细弹窗111 -->
    <el-dialog :title="detailTitle" :close-on-click-modal="false" :visible.sync="detailFlag" width="768px" class="grayBg">
      <el-table :data="detailData" border style="width:100%" height="500px" :header-cell-style="{backgroundColor:'#e5e9f3'}" :summary-method="getDetailSummaries" show-summary>
        <el-table-column prop="deptName" label="所属部门"></el-table-column>
        <el-table-column prop="adjustType" label="调整类型"></el-table-column>
        <el-table-column prop="adjustContent" label="调整内容"></el-table-column>
        <el-table-column prop="adjustMoney" label="金额"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detailFlag = false">关闭</el-button>
      </span>
    </el-dialog>
    <!-- 导入 -->
    <el-dialog title="导入" :visible.sync="importModalVisible" width="580px" @close="cancelImportExcel('importData')">
      <el-form :inline="true" :model="importData" ref="importData" class="mar-no" label-width="90px">
        <el-form-item label="导入批次" prop="batch" :rules="{required:true,message:'请选择年月',trigger:'blur'}">
            <el-date-picker v-model="importData.batch" :editable="false" :clearable="false" type="month" class="width155" value-format="yyyy-MM" placeholder="选择月份">
            </el-date-picker>
        </el-form-item>
      </el-form>
      <!-- importModalVisible -->
      <div class="clearfix">
        <el-upload class="pull-left" :multiple="false" :action="uploadActionUrl" ref="upload" :limit="1" :data={batch:importData.batch} :headers="headers" :auto-upload="false" :before-remove="beforeRemove" :before-upload="beforeUpload" :on-success="handleSuccess" :file-list="fileList">
          <el-button slot="trigger" size="small" icon="el-icon-upload">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="importDataExcel('importData')">上传文件</el-button>
          <el-button @click.stop="downloadTemplate" size="small" style="margin-left:15px;" icon="el-icon-download">下载模板</el-button>
          <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
        </el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="importModalVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 导入信息 -->
    <el-dialog title="导入信息" :close-on-click-modal="false" :show-close="false" :visible.sync="importProcessInfoDialogFlag" width="600px">
      <div class="pad-all mar-ver">
        <el-progress :text-inside="true" :stroke-width="20" :percentage="progressPercentAge"></el-progress>
        <p>正在导入，本次需导入总记录{{uploadProcessInfo.total | repair}}条，<span style="color:#66b1ff">成功{{uploadProcessInfo.successful | repair}}条</span>，<span style="color:red">失败{{uploadProcessInfo.failures | repair}}条</span>，总耗时{{uploadProcessInfo.dealAllTime}}</p>
        <p v-show="loadErrorExcel">
          <el-button type="text" @click="unloadErrorLink" class="underlineTxt">点击下载导入失败明细</el-button><span style="color:#a1a1a1">(导入失败明细已发送到您内网邮箱)</span>
        </p>
      </div>
      <span slot="footer" class="dialog-footer" v-show="progressBackBtn">
        <el-button type="primary" @click="importProgressFlag">返回</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { GET, POST, PUT } from "http/custom.js"
import Tools from 'untils/index.js';
import tbMixin from "libs/mixin/tbMixin.js" //动态计算表格高度mixin

export default {
  name: 'dataSummaryDetail',
  mixins: [tbMixin],
  data() {
    let PYd = Tools.getPYd() //获取年月 上月 格式如 2019-06
    const uploadActionUrl = process.env.VUE_APP_DOMAIN_financial + '/financial/payroll/import' //导入action  线上
    return {
      t_height: 315, //减去的高度
      loading: false,
      current: 1,//当前页码
      pages: 0,//总页数
      size: 15,//每页显示记录条数
      total: 0,//总记录条数
      year: '--',
      month: '--',
      detailSearch: {
        batch: PYd,
        employeeName: '',
        subordinateUnits: '',
        employeeNo: undefined
      },
      dataSummaryDetail: [],
      currentPage: 1,
      resplayModal: false,//工资异议回复弹框
      remarkModal: false,
      textarea: '',
      remarkId: '',
      remarkForm: {
        remark: ''
      },
      remarkFormRule: {
        remark: [{ required: true, message: "请填写备注信息", trigger: "blur" }]
      },
      dissentData: [],
      replayForm: {
        replyContent: ''
      },
      replayFormRule: {
        replyContent: [{ required: true, message: "请填写备注信息", trigger: "blur" }]
      },
      downloadSalary: false,//工资导出弹框
      importProcessInfoDialog: false,
      importProcessInfoDialogFlag:false,
      isLockFlag3: false, // 发放工资锁状态
      isSubmitFlag: false,
      isLockFlag2: false,//工资条是否已生成
      isLockFlag2maked: false,
      salaryDetail: false,//工资条详情
      userDetailInfo: {},//用户的基本信息
      baseSalary: {},//基础工资
      baseSubsidy: {},//基本补助
      noSubsidy: {},//不参与考勤补助
      performanceSalary: {},//绩效工资
      deductionItem: {},//应扣款项
      replayDeductionItem: {},//代扣款项
      actualSalary: {},//实发薪酬
      search_more: false,//更多查询弹框
      //更多条件
      moreParam: {
        gender: "",
        jobState: "",
        postName: "",
        generalManager: "",
        minister: "",
        bizType: "",
        bloc: ""
      },
      dataOptions: [
        { dataId: 0, dataName: '女' },
        { dataId: 1, dataName: '男' },
      ],
      dataOptions2: [
        { dataId: 0, dataName: '未入职' },
        { dataId: 1, dataName: '在职' },
        { dataId: 2, dataName: '离职' },
        { dataId: 3, dataName: '在职(重)' }
      ],
      ismaked: false,//工资条是否已生成
      //进度条相关参数
      loadErrorExcel: false,
      downloadErrorKey: '',
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
      //扣款详情
      detailFlag: false,
      detailData: [],
      detailTitle: '',
      employeNum: '',
      // 发放工资
      sendSalaryFlag:false,
      // 发放工资form表单
      sendSalaryForm:{
        type:"1"
      },
      sendSalarySourceOptions:[
        { value:'1',label:'系统生成版'},
        { value:'2',label:'导入版'}
      ],
      // 导入
      importData:{//导入需要的额外的参数
        batch:PYd
      },
      uploadActionUrl,//文件导入地址
      headers: {}, //上传图片请求头
      fileList: [],//上传的文件列表
      systemType:'1',//系统版本 (2，导入版，1，系统生成版)
      systemTypeTxt:'系统生成版',//系统版本中文
      importModalVisible:false,//导入弹层
    }
  },
  created() {
    this.search();
    this.headers['x-user-token'] = localStorage.getItem('token') //设置上传数据文件excel的token
  },
  methods: {
    fetchDetail(num, title) {
      this.detailTitle = title
      let obj = {
        "employeeNo": this.employeNum,
        "batch": this.detailSearch.batch,
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
    getSalaryDetail(employeeNo) {
      this.employeNum = employeeNo
      let batch = this.detailSearch.batch
      GET(process.env.VUE_APP_DOMAIN_financial + '/financial/queryBasicEmployInfo', { "employeeNo": employeeNo, "batch": batch }).then(res => {
        this.userDetailInfo = res.data
      }).catch(error => {
        console.log(error)
      })
      GET(process.env.VUE_APP_DOMAIN_financial + '/financial/employPayrollLedgers', { "employeeNo": employeeNo, "batch": batch,type:this.systemType }).then(res => {
        if (res.code == 3) {//工资条没有发放，不能查看工资台账
          // this.$message({
          //   type: 'fail',
          //   message: '工资条没有发放，不能查看工资台账！'
          // });
        } else if (res.code == 0) {//工资条已经发放
          this.baseSalary = res.data[5]
          this.baseSubsidy = res.data[6]
          this.noSubsidy = res.data[0]
          this.performanceSalary = res.data[1]
          this.deductionItem = res.data[2]
          this.replayDeductionItem = res.data[3]
          this.actualSalary = res.data[4]
          this.salaryDetail = true
        }
      }).catch(error => {
        console.log(error)
      })
    },
    handleCommand(command) {
      if (command == 'a') {
        this.JS_makeSliver()
      } else if (command == 'b') {
        this.JS_cancelSubmit()
      }else if(command == 'c') {
        // （1：计算数据；2：导入数据）
        this.systemType = '2'
        this.systemTypeTxt = '导入版'
        this.sendSalaryForm.type = '2'
      }else if(command == 'd') {
        // （1：计算数据；2：导入数据）
        this.systemType = '1'
        this.systemTypeTxt = '系统生成版'
        this.sendSalaryForm.type = '1'
      }else if(command == 'e') {
        this.importModalVisible = true
      } else if (command == 'f') {
        // this.downloadSalary = true;
        this.JS_download(1)
      } else if (command == 'g') {
        this.$router.push({
          path: `/home/financialSystem/dataSummary/dataSummaryInfo`
        })
      }
    },
    handleSizeChange(val) {//每页显示多少条数据切换
      this.size = val //保存状态-每页显示多少条数据切换
      this.search()
    },
    handlecurrentChange(val) {//点击页码，当前页
      this.current = val //保存状态-当前页
      this.search()
    },
    searchMoreClick() {
      //点击更多查询清空条件
      this.search_more = true; // 显示条件框
    },
    JS_immediately_cancel(formName) { //取消
      this.search_more = false;
    },
    immediatelyCancel() {
      this.search_more = false;
    },
    JS_more_Search() {// 关闭更多条件窗口
      this.search_more = false;
      this.JS_Search();
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
    importProgress() {//生成工资进度弹框关闭
      this.importProcessInfoDialog = false; //关闭进度弹框
      this.progressPercentAge = 0 //进度条清空为0
      this.progressBackBtn = false; //隐藏返回按钮
      // this.loadErrorExcel = false; // 隐藏下载失败链接
    },
    importProgressFlag(){//导入版进度条弹框关闭
      this.importProcessInfoDialogFlag = false; //关闭进度弹框
      this.progressPercentAge = 0 //进度条清空为0
      this.progressBackBtn = false; //隐藏返回按钮
      this.loadErrorExcel = false; // 隐藏下载失败链接
    },
    JS_download(id) {
      let searchObj = {//查询对象
        "batchId": this.detailSearch.batch || this.dateDefault,
        "type":this.systemType
      }
      GET(process.env.VUE_APP_DOMAIN_financial + '/financial/queryExportCount', searchObj).then(res => {//查询
        // console.log(res)
        if (res.data) {
          window.location.href =
            process.env.VUE_APP_DOMAIN_financial +
            "/financial/export?token=" +
            localStorage.getItem("token") +
            '&batchId=' + this.detailSearch.batch +
            '&exprotType=' + id + '&type=' + this.systemType

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
      this.current = 1 //点击搜索current=1搜索第一页
      this.search();
    },
    search() {
      //qj 列表查询
      let searchObj = {//查询对象,在这里初始化,初始化值都是取this下面的
        "current": this.current, //当前页码
        "size": this.size, //每页显示记录条数
        "batch": this.detailSearch.batch,
        "employeeNo": this.detailSearch.employeeNo,
        "subordinateUnits": this.detailSearch.subordinateUnits,
        "type":this.systemType,
        "employeeName": this.moreParam.employeeName,
        "gender": this.moreParam.gender,
        "jobState": this.moreParam.jobState,
        "postName": this.moreParam.postName,
        "generalManager": this.moreParam.generalManager,
        "minister": this.moreParam.minister,
        "bizTypeName": this.moreParam.bizType,
        "bloc": this.moreParam.bloc,
      }
      console.log('搜索对象', searchObj)
      this.loading = true //开启动画
      POST(process.env.VUE_APP_DOMAIN_financial + '/financial/employpayrolls', searchObj).then(res => {
        this.loading = false //关闭动画
        console.log(res.data.records);
        this.dataSummaryDetail = res.data.records //set表格的值
        this.current = res.data.current //set当前页
        this.pages = res.data.pages //总记录条数
        this.size = res.data.size //每页显示记录条数
        this.total = res.data.total //总记录条数
        let arrDate = searchObj.batch.split('-');
        this.year = arrDate[0]
        this.month = parseInt(arrDate[1]);

        this.isLock2() //生成工资条锁状态是否上锁
        this.isLock2Make()
        this.isLock3() //发放工资锁状态是否上锁
        this.isLock3Submit()
      }).catch(error => {
        console.log(error)
      })
    },
    goMySalary() {
      //this.$router.push('/home/personalCenter/mySalary');//在history有记录
      let newUrl = this.$router.resolve({ path: '/home/personalCenter/mySalary' });
      window.open(newUrl.href, '_blank');
    },
    openRemark(id) {
      this.remarkModal = true
      this.remarkId = id
    },
    remarkSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let obj = this.remarkForm
          obj.id = this.remarkId
          PUT(process.env.VUE_APP_DOMAIN_financial + '/financial/employpayroll', obj).then(res => {
            this.$message({
              type: 'success',
              message: '保存备注数据成功!',
              showClose: true
            })
            this.remarkModal = false
            this.search()
          }).catch(error => {
            console.log(error)
          })
        }
      })
    },
    openReplayModal(id) {//获取员工异议内容信息
      this.remarkId = id
      GET(process.env.VUE_APP_DOMAIN_financial + '/financial/employpayrolldissent/employpayrolldissentInfo', { "employPayrollId": id }).then(res => {//查询薪资类型模板
        this.resplayModal = true
        console.log('查询薪资类型模板', res)
        let obj = {};
        obj.name = "张三"
        obj.content = res.data.dissentContent
        obj.time = res.data.createTime
        this.dissentData[0] = obj
      }).catch(error => {
        console.log(error)
      })
    },
    replay(formName) {//保存员工异议
      var that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let obj = this[formName]
          obj.employPayrollId = that.remarkId
          console.log(obj);
          POST(process.env.VUE_APP_DOMAIN_financial + '/financial/employpayrolldissent/updateDissentReply', obj).then(res => {
            this.$message({
              type: 'success',
              message: '异议回复成功!',
              showClose: true
            })
            this.search()
            this.resplayModal = false
          }).catch(error => {
            console.log(error)
          })
        }
      })
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
    // 导入excel数据
    importDataExcel (formName) {
      if (this.$refs.upload.uploadFiles.length == 0) {
        this.$message({
          showClose: true,
          type: "warning",
          message: "请选取文件！"
        })
        return
      }
      this.$refs[formName].validate(v => {
        if(v) {
          this.$refs.upload.submit();
        } else {
          this.$message({
            showClose: true,
            type: "warning",
            message: "文件或月份不能为空，验证不通过！"
          });
        }
      })
    },
    cancelImportExcel(formName) {//关闭公式导入弹框
      //清除表单
      this.importModalVisible = false
      this.$refs[formName].resetFields()
      this.$refs.upload.clearFiles() //清空已上传的文件列表（该方法不支持在 before-upload 中调用）
    },
    // 下载导入模板
    downloadTemplate () {
      GET(process.env.VUE_APP_DOMAIN_personnel + "/queryBizFilesTemplate", { fileCode: 'FINANCE_PAYROLL_EXPORT_TEMPLATE' })
        .then(res => {
          //获取模板存储返回的ID
          let url = `${process.env.VUE_APP_DOMAIN_download}/oss/download?key=${res.data.fileTemplateId}&name=${res.data.fileTemplateName}.${res.data.fileTemplateSuffix}`;
          window.location.href = url;
          // window.location.href = process.env.VUE_APP_DOMAIN_download + '/oss/download?key=' + res.data.fileTemplateId
        })
        .catch(error => {
          console.log(error);
        });
    },
///////上传文件
    beforeRemove(file) { //删除文件之前的钩子
      return this.$msgBox.confirm(`确定移除 ${file.name}？`);
    },
    beforeUpload(file) {
      //上传文件之前的钩子
      console.log("上传文件之前的回调", file);
      let testFileType = file.name.substring(file.name.lastIndexOf('.') + 1) //截取文件后缀
      const extension = testFileType === 'xls' || testFileType === 'xlsx'
      if (!extension) {//不是excel文件格式
        this.$message.error("上传数据文件只能是 xlsx/xls 格式!")
      }
      return extension
    },
    handleSuccess(res) { //上传文件接口调取成功回调
      this.importModalVisible = false;
      if (res.code == 0) {
        // 文件上传成功
        this.downloadErrorEveProcess = res.data //获取进度条事件句柄
        // 错误导入进度条与下载模板
        this.importProcessInfoDialogFlag = true
        this.queryProgress() //获取上传文件进度条信息
      } else {//文件上传失败失败
        //失败
        this.$msgBox.alert('<span style="color:red;">【系统无法识别EXCLE中的空白，公式和非法字符。请先清理】。</span>', '温馨提示', {
          dangerouslyUseHTMLString: true
        })
      }
      this.$refs.upload.clearFiles() //清空已上传的文件列表（该方法不支持在 before-upload 中调用）
    },
    //点击下载导入失败明细
    unloadErrorLink() {
      console.log('downloadErrorKey', this.downloadErrorKey)
      let url = process.env.VUE_APP_DOMAIN_download + '/oss/download?key=' + this.downloadErrorKey + '&token=' + localStorage.getItem("token") + "&name=" + encodeURI("工资表") + ".xlsx";
      window.location.href = url;
    },
  }
}
</script>
<style scoped>
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
.item {
  position: relative;
  padding-left: 20px;
  border-right: 1px solid #e1e5ef;
  height: 430px;
}
.item:last-child {
  border-right: none;
}
.item .detail-title {
  font-size: 16px;
  font-weight: 900;
  color: #222222;
  letter-spacing: 1.11px;
  line-height: 40px;
  margin-top: 20px !important;
}
.item p {
  margin: 0;
  font-size: 13px;
  color: #444;
  letter-spacing: 0.93px;
  line-height: 25px;
}
.item .detail-num {
  font-size: 14px;
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
.warnIcoBg{
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
