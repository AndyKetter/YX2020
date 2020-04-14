<template>
  <div class="summary-tables">
    <div class="guide">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home/personnelSystem' }">人事系统</el-breadcrumb-item>
        <el-breadcrumb-item>人事基础薪资</el-breadcrumb-item>
        <el-breadcrumb-item>基础薪资总表</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/personnelSystem' }">(返回上级)</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="bgWhite mgt15">
      <el-tabs v-model="activeName" type="border-card" :before-leave="tabsClick">
        <el-tab-pane label="业务基础薪资表" name="first">
          <div class="pull-left">
            <el-form :inline="true" :model="businessFormSearch" class="mar-no pull-left">
              <el-form-item label="姓名">
                <el-input @keyup.enter.native="inputEnterBusiness" v-model.trim="businessFormSearch.name" placeholder="请输入名字" class="width155"></el-input>
              </el-form-item>
              <el-form-item label="员工编号">
                <el-input-number @keyup.enter.native="inputEnterBusiness" placeholder="请输入员工编号" :controls="false" v-model="businessFormSearch.staffNum" class="width155" :min="0" :max="8888888888"></el-input-number>
              </el-form-item>
              <el-form-item label="年月">
                <el-date-picker @change="inputEnterBusiness" v-model="businessFormSearch.batch" type="month" value-format="yyyy-MM" placeholder="选择日期" class="width155">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="数据状态">
                <el-select clearable @change="inputEnterBusiness" v-model="businessFormSearch.dataValue" placeholder="请选择数据状态" class="width155">
                  <el-option v-for="item in dataOptions" :key="item.dataId" :label="item.dataName" :value="item.dataId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmitBusiness" icon="el-icon-search">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="pull-right">
            <el-button class="cloud-uploadBtn" @click="uploadBaseModal = true"><i></i>&nbsp;导入</el-button>
            <el-button @click="updateBase=true">更新业务薪资</el-button>
          </div>
          <div class="table_wrap">
            <el-table v-loading="loading" :height="tabHeight" :data="businessData" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
              <el-table-column label="序号" type="index" min-width="50"></el-table-column>
              <el-table-column label="姓名" min-width="150">
                <template slot-scope="scope">
                  <el-popover trigger="click" placement="top" @show="getUserInfo(scope.row.aid)" width="450">
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.name}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="员工编号" min-width="120">
                <template slot-scope="scope">
                  <span>{{scope.row.aid}}</span><i class="el-icon-phone tbIconPhone"></i>
                </template>
              </el-table-column>
              <el-table-column prop="idNum" label="身份证号" min-width="160"></el-table-column>
              <el-table-column prop="levelName" label="级别" min-width="70"></el-table-column>
              <el-table-column prop="postName" label="职务" min-width="140"></el-table-column>
              <el-table-column prop="educationName" label="学历" min-width="100"></el-table-column>
              <el-table-column prop="workAreaName" label="所属区域" min-width="160" show-overflow-tooltip></el-table-column>
              <el-table-column prop="employeeType" label="员工类型" min-width="120" show-overflow-tooltip></el-table-column>
              <el-table-column prop="isAbnormal" label="数据状态" min-width="80">
                <template slot-scope="scope">
                  <span style="color:#EF3838;" v-if="scope.row.isAbnormal==0">异常数据</span>
                  <span v-if="scope.row.isAbnormal==1">正常数据</span>
                  <!-- {{scope.row.isAbnormal==1?"正常数据":"异常数据"}} -->
                </template>
              </el-table-column>
              <el-table-column label="基础薪资总额" min-width="120">
                <template slot-scope="scope">
                  {{scope.row.totalAmount | toThousands}}
                </template>
              </el-table-column>
              <el-table-column prop="batch" label="年月" min-width="70"></el-table-column>
              <el-table-column prop="operation" label="操作" fixed="right" min-width="100">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="checkBusiness(scope.row.id,'baseSalarySee')">详情</el-button>
                  <el-button type="text" size="small" @click="checkBusiness(scope.row.id,'baseSalarySet',scope.row.idNum)">修改</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div id="pagination">
              <el-pagination @size-change="handleSizeChange" @current-change="handlecurrentChange" background :current-page="businessCurrent" :page-sizes="[10,15,20,30,40]" :page-size="businessSize" layout="total,sizes,prev,pager,next,jumper" :total="businessTotal">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <!-- ***************分割线*****************111 -->
        <el-tab-pane label="职能基础薪资表" name="second">
          <div class="pull-left">
            <el-form :inline="true" :model="functionFormSearch" class="mar-no pull-left">
              <el-form-item label="姓名">
                <el-input @keyup.enter.native="inputEnterFunction" v-model.trim="functionFormSearch.name" placeholder="请输入名字" class="width155"></el-input>
              </el-form-item>
              <el-form-item label="员工编号">
                <el-input-number @keyup.enter.native="inputEnterFunction" placeholder="请输入员工编号" :controls="false" v-model="functionFormSearch.staffNum" class="width155" :min="0" :max="8888888888"></el-input-number>
              </el-form-item>
              <!-- <el-form-item  label="年月">
              <el-date-picker
                v-model="functionFormSearch.batch"
                type="month"
                value-format="yyyy-MM"
                placeholder="选择日期" class="width155">
              </el-date-picker>
            </el-form-item>  -->
              <el-form-item>
                <el-button type="primary" @click="onSubmitFunction" icon="el-icon-search">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div>
            <el-form :inline="true" :model="functionFormSearch" class="mar-no pull-right">
              <el-form-item>
                <el-button class="cloud-uploadBtn" @click="uploadFunModal = true"><i></i>&nbsp;导入</el-button>
                <el-button @click="updateFuncion">职能调薪</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="table_wrap">
            <el-table v-loading="loading" :height="tabHeight" :data="functionData" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
              <el-table-column label="序号" type="index" min-width="50"></el-table-column>
              <el-table-column label="姓名" min-width="150">
                <template slot-scope="scope">
                  <el-popover trigger="click" placement="top" @show="getUserInfo(scope.row.aid)" width="450">
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.name}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="gender" label="性别" >
               <template slot-scope="scope">
                {{scope.row.gender?"男":"女"}}
              </template>
            </el-table-column> -->
              <el-table-column label="员工编号" min-width="120">
                <template slot-scope="scope">
                  <span>{{scope.row.aid}}</span><i class="el-icon-phone tbIconPhone"></i>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="phoneNum" label="联系号码" ></el-table-column> -->
              <el-table-column prop="idNum" label="身份证号" min-width="160"></el-table-column>
              <el-table-column prop="levelName" label="级别" min-width="70"></el-table-column>
              <el-table-column prop="postName" label="职务" min-width="140"></el-table-column>
              <el-table-column prop="educationName" label="学历" min-width="100"></el-table-column>
              <el-table-column prop="workAreaName" label="所属区域" min-width="160" show-overflow-tooltip></el-table-column>
              <el-table-column prop="employeeType" label="员工类型" min-width="120" show-overflow-tooltip></el-table-column>
              <el-table-column label="基础薪资总额" min-width="120">
                <template slot-scope="scope">
                  {{scope.row.totalAmount | toThousands}}
                </template>
              </el-table-column>
              <!-- <el-table-column prop="batch" label="年月" ></el-table-column> -->
              <el-table-column prop="operation" label="操作" min-width="100" fixed="right">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="checkFunction(scope.row.id,'baseSalarySee')">详情</el-button>
                  <el-button type="text" size="small" @click="checkFunction(scope.row.id,'functionSalarySet')">修改</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div id="pagination">
              <el-pagination @size-change="handleSizeChangeFunction" @current-change="handlecurrentChangeFunction" background :current-page="functionCurrent" :page-sizes="[10,15,20,30,40]" :page-size="functionSize" layout="total,sizes,prev,pager,next,jumper" :total="functionTotal">
              </el-pagination>

            </div>
          </div>
        </el-tab-pane>
        <!-- ****************分割线**************** -->
        <el-tab-pane label="综合薪资总表" name="third">
          <div class="pull-left">
            <el-form :inline="true" :model="allFormSearch" class="mar-no pull-left">
              <el-form-item label="姓名">
                <el-input @keyup.enter.native="inputEnterAll" v-model.trim="allFormSearch.name" placeholder="请输入名字" class="width155"></el-input>
              </el-form-item>
              <el-form-item label="员工编号">
                <el-input-number @keyup.enter.native="inputEnterAll" placeholder="请输入员工编号" :controls="false" v-model="allFormSearch.staffNum" class="width155" :min="0" :max="8888888888"></el-input-number>
              </el-form-item>
              <el-form-item label="年月">
                <el-date-picker @change="inputEnterAll" v-model="allFormSearch.batch" :editable="false" :clearable="false" type="month" value-format="yyyy-MM" placeholder="选择日期" class="width155">
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmitAll" icon="el-icon-search">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div>
            <el-form :inline="true" :model="allFormSearch" class="mar-no pull-right">
              <el-form-item>
                <el-button class="cloud-downloadBtn" @click="downloadAll"><i></i>&nbsp;导出</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="table_wrap">
            <el-table v-loading="loading" :height="tabHeight" :data="allData" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
              <el-table-column label="序号" type="index" min-width="50"></el-table-column>
              <el-table-column label="姓名" min-width="150">
                <template slot-scope="scope">
                  <el-popover trigger="click" placement="top" @show="getUserInfo(scope.row.aid)" width="450">
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.name}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="sex" label="性别" ></el-table-column> -->
              <el-table-column label="员工编号" min-width="120">
                <template slot-scope="scope">
                  <span>{{scope.row.aid}}</span><i class="el-icon-phone tbIconPhone"></i>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="phone" label="联系号码" ></el-table-column> -->
              <el-table-column prop="idNum" label="身份证号" min-width="160"></el-table-column>
              <el-table-column prop="levelName" label="级别" min-width="70"></el-table-column>
              <el-table-column prop="postName" label="职务" min-width="140"></el-table-column>
              <el-table-column prop="educationName" label="学历" min-width="100"></el-table-column>
              <el-table-column prop="workAreaName" label="所属区域" min-width="160" show-overflow-tooltip></el-table-column>
              <el-table-column prop="employeeType" label="员工类型" min-width="120" show-overflow-tooltip></el-table-column>
              <el-table-column label="基础薪资总额" min-width="120">
                <template slot-scope="scope">
                  {{scope.row.totalAmount | toThousands}}
                </template>
              </el-table-column>
              <!-- <el-table-column prop="internSalary" label="试用（实习）工资"  min-width="120"></el-table-column> -->
              <el-table-column prop="batch" label="年月" min-width="70"></el-table-column>
              <el-table-column prop="operation" label="操作" min-width="100" fixed="right">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="checkAll(scope.row.salaryType,scope.row.bisId) ">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div id="pagination">
              <el-pagination @size-change="handleSizeChangeALL" @current-change="handlecurrentChangeALL" background :current-page="allCurrent" :page-sizes="[10,15,20,30,40]" :page-size="allSize" layout="total,sizes,prev,pager,next,jumper" :total="allTotal">
              </el-pagination>

            </div>
          </div>
        </el-tab-pane>
        <!-- ****************分割线**************** -->
        <el-tab-pane label="基础薪资报表" name="four">
          <div class="pull-left">
            <el-form :inline="true" :model="reportFormSearch" class="mar-no pull-left">
              <el-form-item label="姓名">
                <el-input @keyup.enter.native="inputEnterReport" v-model.trim="reportFormSearch.name" placeholder="请输入名字" class="width155"></el-input>
              </el-form-item>
              <el-form-item label="员工编号">
                <el-input-number @keyup.enter.native="inputEnterReport" :controls="false" placeholder="请输入编号" v-model="reportFormSearch.staffNum" class="width155" :min="0" :max="8888888888"></el-input-number>
              </el-form-item>
              <el-form-item label="年月">
                <el-date-picker @change="inputEnterReport" v-model="reportFormSearch.batch" :editable="false" :clearable="false" type="month" value-format="yyyy-MM" placeholder="选择日期" class="width155">
                </el-date-picker>
              </el-form-item>
              <!-- <el-form-item label="数据状态">
                <el-select @change="inputEnterReport" clearable v-model="reportFormSearch.dataValue" placeholder="请选择数据状态" class="width130">
                  <el-option v-for="item in dataOptions2" :key="item.dataId" :label="item.dataName" :value="item.dataId">
                  </el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item>
                <el-button type="primary" @click="onSubmitReport" icon="el-icon-search">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>

          <div class="pull-right">
            <el-dropdown @command="handleCommand" trigger="click">
              <el-button type="primary">
                更多操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a" class="cloud-downloadBtn"><i></i>&nbsp;导出</el-dropdown-item>
                <el-dropdown-item command="b" :disabled="isLockFlag===true" divided>数据初始化</el-dropdown-item>
                <el-dropdown-item command="c" divided>重置上报</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>&nbsp;
            <el-button size="small" type="danger" v-if="isLockFlag==false" @click="JS_submit">上报数据</el-button>
            <el-button size="small" v-if="isLockFlag===true" @click="cancel_submit">取消上报</el-button>
          </div>

          <div class="table_wrap">
            <el-table v-loading="loading" :height="tabHeight" :data="reportData" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
              <el-table-column label="序号" type="index" min-width="50"></el-table-column>
              <el-table-column label="姓名" min-width="150">
                <template slot-scope="scope">
                  <el-popover trigger="click" placement="top" @show="getUserInfo(scope.row.employeeNo)" width="450">
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.employeeName}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="sex" label="性别" ></el-table-column> -->
              <el-table-column label="员工编号" min-width="120">
                <template slot-scope="scope">
                  <span>{{scope.row.employeeNo}}</span><i class="el-icon-phone tbIconPhone"></i>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="phone" label="联系号码" ></el-table-column> -->
              <el-table-column label="基本工资" min-width="100">
                <template slot-scope="scope">
                  {{scope.row.basicSalary | toThousands}}
                </template>
              </el-table-column>
              <el-table-column label="保密补助" min-width="100">
                <template slot-scope="scope">
                  {{scope.row.secretAllowance | toThousands}}
                </template>
              </el-table-column>
              <el-table-column label="中餐补助" min-width="100">
                <template slot-scope="scope">
                  {{scope.row.lunchAllowance | toThousands}}
                </template>
              </el-table-column>
              <el-table-column label="交通补助">
                <template slot-scope="scope">
                  {{scope.row.trafficAllowance | toThousands}}
                </template>
              </el-table-column>
              <el-table-column label="电话补助" min-width="100">
                <template slot-scope="scope">
                  {{scope.row.phoneAllowance | toThousands}}
                </template>
              </el-table-column>
              <el-table-column label="加班工资" min-width="100">
                <template slot-scope="scope">
                  {{scope.row.extraworkSalary | toThousands}}
                </template>
              </el-table-column>
              <el-table-column label="职务工资" min-width="100">
                <template slot-scope="scope">
                  {{scope.row.dutySalary | toThousands}}
                </template>
              </el-table-column>
              <el-table-column prop="batch" label="年月" min-width="70"></el-table-column>
              <el-table-column prop="bvalid" label="数据状态" min-width="80">
                <template slot-scope="scope">
                  {{scope.row.bvalid==1?"有效数据":"无效数据"}}
                </template>
              </el-table-column>
              <el-table-column width="150">
                <template slot="header">
                  <el-select v-model="StateValue" filterable placeholder="提交状态" clearable style="width:130px;" @change="onSubmitReport" class="selectRepairIcon">
                    <el-option v-for="item in handleStatusOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </template>
                <template slot-scope="scope">
                  <span style="color:#EF3838;" v-if="scope.row.bsubmit===0">未提交</span>
                  <span v-if="scope.row.bsubmit===1">已提交</span>
                  <span style="color:#EF3838;" v-if="scope.row.bsubmit===2">
                    <el-tooltip v-if="scope.row.errorMsg" class="item" effect="dark" content="scope.row.errorMsg" placement="top">
                      <span>提交失败</span>
                    </el-tooltip>
                    <span v-else>
                      提交失败
                    </span>
                  </span>
                  <span v-if="scope.row.bsubmit===3">忽略提交</span>
                </template>
              </el-table-column>
              <!-- <el-table-column label="操作" min-width="80">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.bsubmit===2" type="text" size="small" :disabled="isLockFlag" @click="ignoreSubmit(scope.row.id,'忽略',2)">忽略提交</el-button>
                  <el-button v-if="scope.row.bsubmit===3" type="text" size="small" :disabled="isLockFlag" @click="ignoreSubmit(scope.row.id,'取消忽略',3)">取消忽略</el-button>
                </template>
              </el-table-column> -->
            </el-table>
            <!-- 分页 -->
            <div id="pagination">
              <el-pagination @size-change="handleSizeChangeReport" @current-change="handlecurrentChangeReport" background :current-page="reportCurrent" :page-sizes="[10,15,20,30,40]" :page-size="reportSize" layout="total,sizes,prev,pager,next,jumper" :total="reportTotal">
              </el-pagination>

            </div>
          </div>
        </el-tab-pane>
        <!-- ****************分割线**************** -->
        <el-tab-pane label="每月应发工资名单" name="five">
          <div class="pull-left">
            <el-form :inline="true" :model="loanpayFormSearch" class="mar-no pull-left">
              <el-form-item label="姓名">
                <el-input @keyup.enter.native="inputEnterLoanpay" v-model.trim="loanpayFormSearch.name" placeholder="请输入名字" class="width155"></el-input>
              </el-form-item>
              <el-form-item label="员工编号">
                <el-input-number @keyup.enter.native="inputEnterLoanpay" :controls="false" placeholder="请输入编号" v-model="loanpayFormSearch.staffNum" class="width155" :min="0" :max="8888888888"></el-input-number>
              </el-form-item>
              <el-form-item label="年月">
                <el-date-picker @change="inputEnterLoanpay" v-model="loanpayFormSearch.batch" :editable="false" :clearable="false" type="month" value-format="yyyy-MM" placeholder="选择日期" class="width155">
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmitLoanpay" icon="el-icon-search">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="pull-right">
            <el-button size="small" @click="initWage">同步数据</el-button>
          </div>

          <div class="table_wrap">
            <el-table v-loading="loading" :height="tabHeight" :data="loanpayData" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
              <el-table-column label="序号" type="index" min-width="50"></el-table-column>
              <el-table-column label="姓名" min-width="150">
                <template slot-scope="scope">
                  <el-popover trigger="click" placement="top" @show="getUserInfo(scope.row.employeeNo)" width="450">
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.employeeName}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="batch" label="年月" min-width="70"></el-table-column>
              <el-table-column label="员工编号" min-width="120">
                <template slot-scope="scope">
                  <span>{{scope.row.employeeNo}}</span><i class="el-icon-phone tbIconPhone"></i>
                </template>
              </el-table-column>
              <el-table-column prop="gender" label="性别" min-width="70">
                <template slot-scope="scope">
                  <span v-if="scope.row.gender==1">男</span>
                  <span v-if="scope.row.gender==0">女</span>
                </template>
              </el-table-column>
              <el-table-column prop="phoneNum" label="联系电话" min-width="110"></el-table-column>
              <el-table-column prop="idNumber" label="身份证号" min-width="160"></el-table-column>
              <el-table-column prop="wageCardBank" label="工资卡开户行" min-width="160" show-overflow-tooltip></el-table-column>
              <el-table-column prop="wageCardNum" label="工资卡号" min-width="180"></el-table-column>
              <el-table-column prop="bizTypeName" label="业务类型" min-width="100"></el-table-column>
              <el-table-column label="在职状态" min-width="80">
                <template slot-scope="scope">
                  <span v-if="scope.row.jobState==0">未入职</span>
                  <span v-if="scope.row.jobState==1">在职</span>
                  <span v-if="scope.row.jobState==2">离职</span>
                  <span v-if="scope.row.jobState==3">重聘</span>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="batch" label="所属单位" min-width="120"></el-table-column> -->
              <el-table-column prop="workAreaName" label="所属区域" min-width="160" show-overflow-tooltip></el-table-column>
              <el-table-column prop="generalManager" label="总经理" min-width="150"></el-table-column>
              <el-table-column prop="bloc" label="集团" min-width="150"></el-table-column>
              <el-table-column prop="minister" label="部长" min-width="150"></el-table-column>
              <el-table-column prop="groupLeader" label="组长" min-width="150"></el-table-column>
              <el-table-column prop="postName" label="职务名称" min-width="140"></el-table-column>
              <el-table-column prop="levelName" label="职位名称" min-width="140"></el-table-column>
              <!-- <el-table-column prop="batch" label="职位" min-width="140"></el-table-column> -->
              <el-table-column prop="entryDate" label="入职日期" min-width="160"></el-table-column>
              <el-table-column prop="turnformalDate" label="转正日期" min-width="160"></el-table-column>
              <el-table-column prop="leaveDate" label="离职日期" min-width="160"></el-table-column>
              <el-table-column prop="employeeType" label="员工类型" min-width="120" show-overflow-tooltip></el-table-column>
              <el-table-column prop="createUserName" label="创建人" min-width="150"></el-table-column>
              <el-table-column prop="createTime" label="创建时间" min-width="160"></el-table-column>
              <!-- <el-table-column prop="updateUserName" label="更新人" min-width="150"></el-table-column>
              <el-table-column prop="updateTime" label="更新时间" min-width="160"></el-table-column> -->
              <el-table-column prop="remark" label="备注" min-width="200" show-overflow-tooltip></el-table-column>
            </el-table>
            <!-- 分页 -->
            <div id="pagination">
              <el-pagination @size-change="handleSizeChangeLoanpay" @current-change="handlecurrentChangeLoanpay" background :current-page="loanpayCurrent" :page-sizes="[10,15,20,30,40]" :page-size="loanpaySize" layout="total,sizes,prev,pager,next,jumper" :total="loanpayTotal">
              </el-pagination>

            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 查看基础薪资弹框 -->
    <el-dialog title="查看基础薪资" :close-on-click-modal="false" :visible.sync="baseSalarySee" width="768px" class="grayBg">
      <div class="whiteBox">
        <p class="pReset">基本情况</p>
        <el-row class="textLft">
          <el-col :span="3" class="height26">姓&nbsp;&nbsp;&nbsp;&nbsp;名：</el-col>
          <el-col :span="5" class="height26">{{businessShowForm.name}}</el-col>
          <el-col :span="3" class="height26">性&nbsp;&nbsp;&nbsp;&nbsp;别：</el-col>
          <el-col :span="5" class="height26">
            <span v-if="businessShowForm.gender==1">男</span>
            <span v-if="businessShowForm.gender==0">女</span>
          </el-col>
          <el-col :span="3" class="height26">员工编号：</el-col>
          <el-col :span="5" class="height26">{{businessShowForm.aid}}</el-col>
          <el-col :span="3" class="height26">手机号码：</el-col>
          <el-col :span="5" class="height26">{{businessShowForm.phoneNum}}</el-col>
          <el-col :span="3" class="height26">级&nbsp;&nbsp;&nbsp;&nbsp;别：</el-col>
          <el-col :span="5" class="height26">{{businessShowForm.levelName}}</el-col>
          <el-col :span="3" class="height26">职&nbsp;&nbsp;&nbsp;&nbsp;务：</el-col>
          <el-col :span="5" class="height26">{{businessShowForm.postName}}</el-col>
          <el-col :span="3" class="height26">所属区域：</el-col>
          <el-col :span="5" class="height26">{{businessShowForm.workAreaName}}</el-col>
          <el-col :span="3" class="height26">员工类型：</el-col>
          <el-col :span="5" class="height26">{{businessShowForm.employeeType}}</el-col>
          <el-col :span="3" class="height26">学&nbsp;&nbsp;&nbsp;&nbsp;历：</el-col>
          <el-col :span="5" class="height26">{{businessShowForm.educationName}}</el-col>
        </el-row>
      </div>
      <div class="whiteBox">
        <p class="pReset">配置</p>
        <el-row class="textLft">
          <el-col :span="3" class="height26">基础总额：</el-col>
          <el-col :span="9" class="height26">{{businessShowForm.totalAmount | toThousands}}&nbsp;&nbsp;&nbsp;<span style="color:red">{{businessShowForm.isAfterTax==1?'税后工资':''}}</span></el-col>
          <el-col :span="3" class="height26">基本工资：</el-col>
          <el-col :span="9" class="height26">{{businessShowForm.basicSalary | toThousands}}</el-col>
          <el-col :span="3" class="height26">保密补助：</el-col>
          <el-col :span="9" class="height26">{{businessShowForm.secretAllowance | toThousands}}</el-col>
          <el-col :span="3" class="height26">中餐补助：</el-col>
          <el-col :span="9" class="height26">{{businessShowForm.lunchAllowance | toThousands}}</el-col>
          <el-col :span="3" class="height26">交通补助：</el-col>
          <el-col :span="9" class="height26">{{businessShowForm.trafficAllowance | toThousands}}</el-col>
          <el-col :span="3" class="height26">电话补助：</el-col>
          <el-col :span="9" class="height26">{{businessShowForm.phoneAllowance | toThousands}}</el-col>
          <!-- <el-col :span="3" class="height26">劳模补助：</el-col>
           <el-col :span="9" class="height26">{{businessShowForm.modelworkerAllowance}}</el-col> -->
          <el-col :span="3" class="height26">职务工资：</el-col>
          <el-col :span="9" class="height26">{{businessShowForm.dutySalary | toThousands}}</el-col>
          <el-col :span="3" class="height26">加班工资：</el-col>
          <el-col :span="9" class="height26">{{businessShowForm.extraworkSalary | toThousands}}</el-col>
        </el-row>
      </div>
      <div class="whiteBox" v-if="updateStatus=true">
        <p class="pReset">修改记录</p>
        <div>
          <p v-if="businessShowForm.takeNotes">
            {{businessShowForm.takeNotes[0]}}
          </p>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="baseSalarySee = false">确定</el-button>
      </span>
    </el-dialog>

    <!-- 业务基础薪资修改弹框 -->
    <el-dialog title="修改基础薪资" :close-on-click-modal="false" :visible.sync="baseSalarySet" width="768px" class="grayBg">
      <div class="whiteBox">
        <p class="pReset">基本情况</p>
        <el-row class="textLft">
          <el-col :span="3" class="height26">姓&nbsp;&nbsp;&nbsp;&nbsp;名：</el-col>
          <el-col :span="5" class="height26">{{businessShowForm.name}}</el-col>
          <el-col :span="3" class="height26">性&nbsp;&nbsp;&nbsp;&nbsp;别：</el-col>
          <el-col :span="5" class="height26">
            <span v-if="businessShowForm.gender==1">男</span>
            <span v-if="businessShowForm.gender==0">女</span>
          </el-col>
          <el-col :span="3" class="height26">员工编号：</el-col>
          <el-col :span="5" class="height26">{{businessShowForm.aid}}</el-col>
          <el-col :span="3" class="height26">手机号码：</el-col>
          <el-col :span="5" class="height26">{{businessShowForm.phoneNum}}</el-col>
          <el-col :span="3" class="height26">级&nbsp;&nbsp;&nbsp;&nbsp;别：</el-col>
          <el-col :span="5" class="height26">{{businessShowForm.levelName}}</el-col>
          <el-col :span="3" class="height26">职&nbsp;&nbsp;&nbsp;&nbsp;务：</el-col>
          <el-col :span="5" class="height26">{{businessShowForm.postName}}</el-col>
          <el-col :span="3" class="height26">所属区域：</el-col>
          <el-col :span="5" class="height26">{{businessShowForm.workAreaName}}</el-col>
          <el-col :span="3" class="height26">员工类型：</el-col>
          <el-col :span="5" class="height26">{{businessShowForm.employeeType}}</el-col>
          <el-col :span="3" class="height26">学&nbsp;&nbsp;&nbsp;&nbsp;历：</el-col>
          <el-col :span="5" class="height26">{{businessShowForm.educationName}}</el-col>
        </el-row>
      </div>
      <div class="whiteBox">
        <p class="pReset">配置</p>
        <el-form :model="sendLetterform" :rules="sendLetterformRule" ref="sendLetterform" label-width="150px">
          <el-row>
            <el-col :md="12">
              <el-form-item label="基础总额：" prop="totalAmount">
                <el-input disabled v-model="sendLetterform.totalAmount" style="width:200px" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="基本工资：" prop="basicSalary">
                <el-input-number @input.native="basicSalaryChange" :controls="false" v-model="sendLetterform.basicSalary" style="width:200px" :min="0" :max="10000000"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="保密补助：" prop="secretAllowance">
                <el-input-number @input.native="secretAllowanceChange" :controls="false" v-model="sendLetterform.secretAllowance" style="width:200px" :min="0" :max="10000000"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="中餐补助：" prop="lunchAllowance">
                <el-input-number @input.native="lunchAllowanceChange" :controls="false" v-model="sendLetterform.lunchAllowance" style="width:200px" :min="0" :max="10000000"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="交通补助：" prop="trafficAllowance">
                <el-input-number @input.native="trafficAllowanceChange" :controls="false" v-model="sendLetterform.trafficAllowance" style="width:200px" :min="0" :max="10000000"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="电话补助：" prop="phoneAllowance">
                <el-input-number @input.native="phoneAllowanceChange" :controls="false" v-model="sendLetterform.phoneAllowance" style="width:200px" :min="0" :max="10000000"></el-input-number>
              </el-form-item>
            </el-col>
            <!-- <el-col :md="12">
            <el-form-item label="劳模补助：" prop="subsibyWorker">
                <el-input v-model="sendLetterform.subsibyWorker" style="width:200px"></el-input>
              </el-form-item>
            </el-col> -->
            <el-col :md="12">
              <el-form-item label="职务工资：" prop="dutySalary">
                <el-input-number @input.native="dutySalaryChange" :controls="false" v-model="sendLetterform.dutySalary" style="width:200px" :min="0" :max="10000000"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="加班工资：" prop="extraworkSalary">
                <el-input-number @input.native="extraworkSalaryChange" :controls="false" v-model="sendLetterform.extraworkSalary" style="width:200px" :min="0" :max="10000000"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="baseSalarySet = false">取消</el-button>
        <el-button type="primary" @click="JS_update_save('sendLetterform')" v-no-more-click>保存</el-button>
      </span>
    </el-dialog>

    <!-- 职能基础薪资修改弹框 -->
    <el-dialog title="修改基础薪资" :close-on-click-modal="false" :visible.sync="functionSalarySet" width="768px" class="grayBg">
      <div class="whiteBox">
        <p class="pReset">基本情况</p>
        <el-row class="textLft">
          <el-col :span="3" class="height26">姓&nbsp;&nbsp;&nbsp;&nbsp;名：</el-col>
          <el-col :span="5" class="height26">{{businessShowForm.name}}</el-col>
          <el-col :span="3" class="height26">性&nbsp;&nbsp;&nbsp;&nbsp;别：</el-col>
          <el-col :span="5" class="height26">
            <span v-if="businessShowForm.gender==1">男</span>
            <span v-if="businessShowForm.gender==0">女</span>
          </el-col>
          <el-col :span="3" class="height26">员工编号：</el-col>
          <el-col :span="5" class="height26">{{businessShowForm.aid}}</el-col>
          <el-col :span="3" class="height26">手机号码：</el-col>
          <el-col :span="5" class="height26">{{businessShowForm.phoneNum}}</el-col>
          <el-col :span="3" class="height26">级&nbsp;&nbsp;&nbsp;&nbsp;别：</el-col>
          <el-col :span="5" class="height26">{{businessShowForm.levelName}}</el-col>
          <el-col :span="3" class="height26">职&nbsp;&nbsp;&nbsp;&nbsp;务：</el-col>
          <el-col :span="5" class="height26">{{businessShowForm.postName}}</el-col>
          <el-col :span="3" class="height26">所属区域：</el-col>
          <el-col :span="5" class="height26">{{businessShowForm.workAreaName}}</el-col>
          <el-col :span="3" class="height26">员工类型：</el-col>
          <el-col :span="5" class="height26">{{businessShowForm.employeeType}}</el-col>
          <el-col :span="3" class="height26">学&nbsp;&nbsp;&nbsp;&nbsp;历：</el-col>
          <el-col :span="5" class="height26">{{businessShowForm.educationName}}</el-col>
        </el-row>
      </div>
      <div class="whiteBox">
        <p class="pReset">配置</p>
        <el-form :model="sendLetterform" :rules="sendLetterformRule" ref="sendLetterform" label-width="150px">
          <el-row>
            <el-col :md="12">
              <el-form-item label="基础总额：" prop="totalAmount">
                <el-input disabled v-model="sendLetterform.totalAmount" style="width:200px" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="基本工资：" prop="basicSalary">
                <el-input-number @input.native="basicSalaryModifyChange2" :controls="false" v-model="sendLetterform.basicSalary" style="width:200px" :min="0" :max="10000000"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="保密补助：" prop="secretAllowance">
                <el-input-number @input.native="secretAllowanceModifyChange2" :controls="false" v-model="sendLetterform.secretAllowance" style="width:200px" :min="0" :max="10000000"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="中餐补助：" prop="lunchAllowance">
                <el-input-number @input.native="lunchAllowanceModifyChange2" :controls="false" v-model="sendLetterform.lunchAllowance" style="width:200px" :min="0" :max="10000000"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="交通补助：" prop="trafficAllowance">
                <el-input-number @input.native="trafficAllowanceModifyChange2" :controls="false" v-model="sendLetterform.trafficAllowance" style="width:200px" :min="0" :max="10000000"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="电话补助：" prop="phoneAllowance">
                <el-input-number @input.native="phoneAllowanceModifyChange2" :controls="false" v-model="sendLetterform.phoneAllowance" style="width:200px" :min="0" :max="10000000"></el-input-number>
              </el-form-item>
            </el-col>
            <!-- <el-col :md="12">
            <el-form-item label="劳模补助：" prop="subsibyWorker">
                <el-input v-model="sendLetterform.subsibyWorker" style="width:200px"></el-input>
              </el-form-item>
            </el-col> -->
            <el-col :md="12">
              <el-form-item label="职务工资：" prop="dutySalary">
                <el-input-number @input.native="dutySalaryModifyChange2" :controls="false" v-model="sendLetterform.dutySalary" style="width:200px" :min="0" :max="10000000"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="加班工资：" prop="extraworkSalary">
                <el-input-number @input.native="extraworkSalaryModifyChange2" :controls="false" v-model="sendLetterform.extraworkSalary" style="width:200px" :min="0" :max="10000000"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="functionSalarySet = false">取消</el-button>
        <el-button type="primary" @click="JS_update_function('sendLetterform')" v-no-more-click>保存</el-button>
      </span>
    </el-dialog>
    <!-- 业务基础薪资表导入 -->
    <el-dialog title="业务基础薪资表导入" :close-on-click-modal="false" :show-close="false" :visible.sync="uploadBaseModal" width="520px">
      <p class="clearfix">
        <el-date-picker style="width:249px;margin-bottom:10px;" v-model="base_batch" type="month" :editable="false" :clearable="false" value-format="yyyy-MM" placeholder="选择月"></el-date-picker>
        <el-upload class="pull-left" ref="upload" :action="uploadActionBaseUrl" :headers="headers" :before-upload="beforeUpload" :on-success="handleSuccessBase" :file-list="fileList">
          <el-button size="mediumn" icon="el-icon-upload">导入数据</el-button>
          <el-button size="mediumn" @click.stop="JS_Base_download" style="margin-left:15px;" icon="el-icon-download">下载模板</el-button>
          <div slot="tip" class="el-upload__tip" style="color:red;">只能上传xls/xlsx文件/年月选择为下载模板批次</div>
        </el-upload>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadBaseModal= false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 职能基础薪资导入111 -->
    <el-dialog title="职能基础薪资导入" :close-on-click-modal="false" :show-close="false" :visible.sync="uploadFunModal" width="520px">
      <p class="clearfix">
        <el-upload class="pull-left" ref="upload" :action="uploadActionUrl" :headers="headers" :before-upload="beforeUpload" :on-success="handleSuccess" :file-list="fileList">
          <el-button size="mediumn" icon="el-icon-upload">导入数据</el-button>
          <el-button size="mediumn" @click.stop="JS_fun_download" style="margin-left:15px;" icon="el-icon-download">下载模板</el-button>
          <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
        </el-upload>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadFunModal= false">取消</el-button>
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
    <!-- 职能调薪弹框 -->
    <el-dialog title="职能调薪" :close-on-click-modal="false" :visible.sync="updateCondition" :before-close="fileClose" width="768px" class="grayBg">
      <div>
        <el-form :inline="true">
          <el-form-item label="员工编号" prop="Total">
            <el-input-number @keyup.enter.native="inputEnterBusiness" :controls="false" v-model.trim="updateConditionform.staffNum" style="width:500px" :min="0" :max="8888888888"></el-input-number>

          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="functionAidSearch">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-show="showFlag==1">
        <div class="whiteBox">
          <p class="pReset">基本情况</p>

          <el-row class="textLft">
            <el-col :span="3" class="height26">姓&nbsp;&nbsp;&nbsp;&nbsp;名：</el-col>
            <el-col :span="5" class="height26">{{functionShowForm.name}}</el-col>
            <el-col :span="3" class="height26">性&nbsp;&nbsp;&nbsp;&nbsp;别：</el-col>
            <el-col :span="5" class="height26">
              <span v-if="functionShowForm.gender==1">男</span>
              <span v-if="functionShowForm.gender==0">女</span>
            </el-col>
            <el-col :span="3" class="height26">员工编号：</el-col>
            <el-col :span="5" class="height26">{{functionShowForm.aid}}</el-col>
            <el-col :span="3" class="height26">手机号码：</el-col>
            <el-col :span="5" class="height26">{{functionShowForm.phoneNum}}</el-col>
            <el-col :span="3" class="height26">级&nbsp;&nbsp;&nbsp;&nbsp;别：</el-col>
            <el-col :span="5" class="height26">{{functionShowForm.levelName}}</el-col>
            <el-col :span="3" class="height26">职&nbsp;&nbsp;&nbsp;&nbsp;务：</el-col>
            <el-col :span="5" class="height26">{{functionShowForm.postName}}</el-col>
            <el-col :span="3" class="height26">所属区域：</el-col>
            <el-col :span="5" class="height26">{{functionShowForm.workAreaName}}</el-col>
            <el-col :span="3" class="height26">员工类型：</el-col>
            <el-col :span="5" class="height26">{{functionShowForm.employeeType}}</el-col>
            <el-col :span="3" class="height26">学&nbsp;&nbsp;&nbsp;&nbsp;历：</el-col>
            <el-col :span="5" class="height26">{{functionShowForm.educationName}}</el-col>
          </el-row>
        </div>
        <div class="whiteBox">
          <p class="pReset">配置</p>
          <el-form :model="updateConditionform" :rules="updateConditionformRule" ref="updateConditionform" label-width="150px">
            <el-row>
              <el-col :md="12">
                <el-form-item label="基础总额：" prop="totalAmount">
                  <el-input disabled v-model="updateConditionform.totalAmount" style="width:200px" placeholder=""></el-input>
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item label="基本工资：" prop="basicSalary">
                  <el-input-number @input.native="basicSalaryModifyChange" :controls="false" v-model="updateConditionform.basicSalary" style="width:200px" :min="0" :max="10000000"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item label="保密补助：" prop="secretAllowance">
                  <el-input-number @input.native="secretAllowanceModifyChange" :controls="false" v-model="updateConditionform.secretAllowance" style="width:200px" :min="0" :max="10000000"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item label="中餐补助：" prop="lunchAllowance">
                  <el-input-number @input.native="lunchAllowanceModifyChange" :controls="false" v-model="updateConditionform.lunchAllowance" style="width:200px" :min="0" :max="10000000"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item label="交通补助：" prop="trafficAllowance">
                  <el-input-number @input.native="trafficAllowanceModifyChange" :controls="false" v-model="updateConditionform.trafficAllowance" style="width:200px" :min="0" :max="10000000"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item label="电话补助：" prop="phoneAllowance">
                  <el-input-number @input.native="phoneAllowanceModifyChange" :controls="false" v-model="updateConditionform.phoneAllowance" style="width:200px" :min="0" :max="10000000"></el-input-number>
                </el-form-item>
              </el-col>
              <!-- <el-col :md="12">
            <el-form-item label="劳模补助：" prop="subsibyWorker">
                <el-input v-model="updateConditionform.subsibyWorker" style="width:200px"></el-input>
              </el-form-item>
            </el-col> -->
              <el-col :md="12">
                <el-form-item label="职务工资：" prop="dutySalary">
                  <el-input-number @input.native="dutySalaryModifyChange" :controls="false" v-model="updateConditionform.dutySalary" style="width:200px" :min="0" :max="10000000"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item label="加班工资：" prop="extraworkSalary">
                  <el-input-number @input.native="extraworkSalaryModifyChange" :controls="false" v-model="updateConditionform.extraworkSalary" style="width:200px" :min="0" :max="10000000"></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="fileClose">取消</el-button>
        <el-button type="primary" @click="JS_update_saveFunction('updateConditionform')" v-no-more-click>保存</el-button>
      </span>
    </el-dialog>

    <!-- 业务薪资更新 弹框 -->
    <el-dialog title="业务薪资更新" :close-on-click-modal="false" :visible.sync="updateBase" width="600px">
      <div>
        <el-form :model="exportExform" ref="exportExform" label-width="150px">
          <el-row>
            <el-col :md="24">
              <el-form-item label="选择月份" prop="month1">
                <el-date-picker v-model="exportExform.month1" type="month" value-format="yyyy-MM" placeholder="选择月份">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateBase = false">取消</el-button>
        <el-button type="primary" @click="updateBaseSearch('exportExform')">更新</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import Tools from 'untils/index.js'
import { GET, POST, PUT } from "http/custom.js"
import tbMixin from "libs/mixin/tbMixin.js" //动态计算表格高度mixin
export default {
  name: 'summary-tables',
  mixins: [tbMixin],
  data() {
    let Ytd = Tools.getPYd() //获取当前年，上月 格式为 2019-05
    const uploadActionUrl = process.env.VUE_APP_DOMAIN_personnel + "/import" //导入
    const uploadActionBaseUrl = process.env.VUE_APP_DOMAIN_personnel + "/importBiztemplate" //@业务基础薪资表 导入
    let Ptd = Tools.getPYd() //获取当前年上月
    return {
      t_height: 315, //减去的高度
      isLockFlag: false,//提交数据状态
      loading: false,//table加载动画开关
      activeName: 'first',
      records: '',
      takeNotes: '',
      updateStatus: false,//修改记录
      personalInfoData: {},//姓名popover弹窗数据
      secondHasClicked: false,//切换标记tab是否第一次点击
      thirdHasClicked: false,
      fourHasClicked: false,
      fiveHasClicked: false,

      ///////////业务
      businessCurrent: 1,//当前页码
      businesspages: 0,//总页数
      businessSize: 15,//每页显示记录条数
      businessTotal: 0,//总记录条数
      businessAscs: [],
      businessDescs: [],
      businessShowForm: {},//查看基础薪资对象
      uploadBaseModal:false,//业务基础薪资表导入
      businessData: [],
      updateBase: false,//业务薪资更新弹框
      exportExform: {
        month1: ''
      },
      dataName: "",//数据名字
      //所属字典options
      dataOptions: [
        {
          dataId: 0,
          dataName: '异常数据'
        }, {
          dataId: 1,
          dataName: '正常数据'
        }
      ],
      dataOptions2: [
        {
          dataId: 0,
          dataName: '无效数据'
        }, {
          dataId: 1,
          dataName: '有效数据'
        }
      ],
      businessFormSearch: {
        name: '',
        staffNum: undefined,
        batch: '',
        dataValue: ''
      },

      ///////////////职能
      functionCurrent: 1,//当前页码
      functionpages: 0,//总页数
      functionSize: 15,//每页显示记录条数
      functionTotal: 0,//总记录条数
      functionAscs: [],
      functionDescs: [],
      functionData: [],
      functionFormSearch: {
        name: '',
        staffNum: undefined,
        batch: ''
      },
      functionShowForm: {},
      uploadFunModal: false,//111
      fileList: [],
      headers: {}, //上传图片请求头
      uploadActionUrl,
      uploadActionBaseUrl,
      base_batch:Ytd,//业务基础薪资表导入-下载模板批次
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
        dealAllTime: ''//总耗时
      },

      ///////////////////总表
      allCurrent: 1,//当前页码
      allpages: 0,//总页数
      allSize: 15,//每页显示记录条数
      allTotal: 0,//总记录条数
      allData: [],
      allFormSearch: {
        name: '',
        staffNum: undefined,
        batch: Ptd,
      },

      ///////////////////基础薪资报表
      reportCurrent: 1,//当前页码
      reportpages: 0,//总页数
      reportSize: 15,//每页显示记录条数
      reportTotal: 0,//总记录条数
      reportData: [],
      reportFormSearch: {
        name: '',
        staffNum: undefined,
        batch: Ptd,
        dataValue: ''
      },

      ///////////////////应发工资
      loanpayCurrent: 1,//当前页码
      loanpaypages: 0,//总页数
      loanpaySize: 15,//每页显示记录条数
      loanpayTotal: 0,//总记录条数
      loanpayData: [],
      loanpayFormSearch: {
        name: '',
        staffNum: undefined,
        batch: Ptd,
      },


      ptdFlag: Ptd,
      StateValue: '',
      handleStatusOptions: [
        { value: '0', label: '未提交' },
        { value: '1', label: '已提交' },
        { value: '2', label: '提交失败' },
        { value: '3', label: '忽略提交' }
      ],
      baseSalarySee: false,//查看基础薪资 弹框内的数据
      baseSalarySet: false,//修改基础薪资 弹框内的数据
      sendLetterform: {//修改基础薪资
        totalAmount: undefined,//基础总额
        basicSalary: undefined,//基础工资
        secretAllowance: undefined,//保密补助
        lunchAllowance: undefined, //中餐补助
        trafficAllowance: undefined, //交通补助
        phoneAllowance: undefined, //电话补助
        dutySalary: undefined, //职务补助
        extraworkSalary: undefined //加班补助
      },
      sendLetterform2: {},
      sendLetterformRule: {
        totalAmount: [{ required: true, message: "请填写基础总额", trigger: "blur" }],
        basicSalary: [{ required: true, message: "请填写基本工资", trigger: "blur" }],
        secretAllowance: [{ required: true, message: "请填写保密补助", trigger: "blur" }],
        lunchAllowance: [{ required: true, message: "请填写中餐补助", trigger: "blur" }],
        trafficAllowance: [{ required: true, message: "请填写交通补助", trigger: "blur" }],
        trafficAllowance: [{ required: true, message: "请填写电话补助", trigger: "blur" }],
        dutySalary: [{ required: true, message: "请填写职务工资", trigger: "blur" }],
        extraworkSalary: [{ required: true, message: "请填写加班工资", trigger: "blur" }]
      },


      //职能调薪 弹框内的数据
      showFlag: 0,
      updateCondition: false,
      functionSalarySet: false,//修改职能基础薪资 弹框内的数据
      updateConditionform: {
        staffNum: undefined,
        totalAmount: undefined,//基础总额
        basicSalary: undefined,//基础工资
        secretAllowance: undefined,//保密补助
        lunchAllowance: undefined, //中餐补助
        trafficAllowance: undefined, //交通补助
        phoneAllowance: undefined, //电话补助
        dutySalary: undefined, //职务补助
        extraworkSalary: undefined //加班补助
      },
      updateConditionformRule: {
        basicSalary: [{ required: true, message: "请填写基本工资", trigger: "blur" }],
        secretAllowance: [{ required: true, message: "请填写保密补助", trigger: "blur" }],
        lunchAllowance: [{ required: true, message: "请填写中餐补助", trigger: "blur" }],
        trafficAllowance: [{ required: true, message: "请填写交通补助", trigger: "blur" }],
        phoneAllowance: [{ required: true, message: "请填写电话补助", trigger: "blur" }],
        // subsibyWorker:[{ required: true, message: "请填写劳模补助", trigger: "blur" }],
        dutySalary: [{ required: true, message: "请填写职务补助", trigger: "blur" }],
        extraworkSalary: [{ required: true, message: "请填写加班补助", trigger: "blur" }]
      },

    }
  },
  created() {
    this.headers["x-user-token"] = localStorage.getItem("token");//设置上传数据文件excel的token
    this.businessSearch();
  },
  watch: {
    sendLetterform: {//计算基础总额 职能修改\业务修改
      deep: true,
      handler() {
        console.log('正在计算')
        this.sendLetterform.totalAmount = (parseInt(this.sendLetterform.basicSalary) || 0)
          + (parseInt(this.sendLetterform.secretAllowance) || 0)
          + (parseInt(this.sendLetterform.lunchAllowance) || 0)
          + (parseInt(this.sendLetterform.trafficAllowance) || 0)
          + (parseInt(this.sendLetterform.phoneAllowance) || 0)
          + (parseInt(this.sendLetterform.dutySalary) || 0)
          + (parseInt(this.sendLetterform.extraworkSalary) || 0)
      }
    },
    updateConditionform: {//计算基础总额 业务调薪
      deep: true,
      handler() {
        console.log('正在计算')
        this.updateConditionform.totalAmount = (parseInt(this.updateConditionform.basicSalary) || 0)
          + (parseInt(this.updateConditionform.secretAllowance) || 0)
          + (parseInt(this.updateConditionform.lunchAllowance) || 0)
          + (parseInt(this.updateConditionform.trafficAllowance) || 0)
          + (parseInt(this.updateConditionform.phoneAllowance) || 0)
          + (parseInt(this.updateConditionform.dutySalary) || 0)
          + (parseInt(this.updateConditionform.extraworkSalary) || 0)
      }
    },

  },
  methods: {
    ///////////////////lxm 薪资本页面公用方法
    tabsClick(activeName, oldActiveName) {//切换标签之前的钩子，若返回 false 或者返回 Promise 且被 reject，则阻止切换。
      if (activeName == 'second' && this.secondHasClicked === false) {
        this.secondHasClicked = true //标记已点击过，不能二次点击触发请求
        this.functionSearch() //职能薪资列表查询初始化
      }
      else if (activeName == 'third' && this.thirdHasClicked === false) {
        this.thirdHasClicked = true
        this.allSearch() //综合薪资列表查询初始化
      }
      else if (activeName == 'four' && this.fourHasClicked === false) {
        this.fourHasClicked = true
        this.reportSearch() //基础薪资报表列表查询初始化
      }
      else if (activeName == 'five' && this.fiveHasClicked === false) {
        this.fiveHasClicked = true
        this.loanpaySearch() //基础薪资报表列表查询初始化
      }
    },
    // 根据员工编号获取个人信息
    getUserInfo(num) {
      GET(process.env.VUE_APP_DOMAIN_personnel + '/userInfo', { aid: num }).then(res => {//查询薪资类型模板
        console.log(res.data);
        this.personalInfoData = res.data
        this.personalInfoData.employedDates = this.personalInfoData.employedDates.split(" ")[0];
      }).catch(error => {
        console.log(error)
      })
    },
    // changeStatus(event,item){
    //   this.businessFormSearch.dataValue=item
    //   console.log(item)
    //   this.businessSearch();
    // },


    ///////////////////lxm 业务基础薪资表
    onSubmitBusiness() {
      this.businessCurrent = 1 //点击搜索current=1搜索第一页
      // console.log(this.businessFormSearch);
      this.businessSearch();
    },
    inputEnterBusiness() {// 文本框的enter事件触发搜索按钮
      this.onSubmitBusiness();
    },
    handleSizeChange(val) {//切换页面数据的条数
      this.businessSize = val;
      this.businessSearch();
    },
    handlecurrentChange(val) {//当前页数
      this.businessCurrent = val;
      this.businessSearch();
    },
    businessSearch() {
      //lxm 列表查询 业务基础薪资表
      let searchObjInit = {//查询对象
        "current": this.businessCurrent,
        "size": this.businessSize,
        "ascs": this.businessAscs,
        "descs": this.businessDescs,
        "aid": this.businessFormSearch.staffNum,
        "name": this.businessFormSearch.name,
        "batch": this.businessFormSearch.batch,
        "isAbnormal": this.businessFormSearch.dataValue, //数据状态
      }
      this.loading = true //开启动画
      POST(process.env.VUE_APP_DOMAIN_personnel + '/bizSalarys', searchObjInit).then(res => {
        // console.log('列表查询',res)
        this.loading = false //关闭动画
        this.businessData = res.data.records
        this.businessCurrent = res.data.current //set当前页
        this.businesspages = res.data.pages //总记录条数
        this.businessSize = res.data.size //每页显示记录条数
        this.businessTotal = res.data.total //总记录条数
      }).catch(error => {
        console.log(error)
      })
    },
    checkBusiness(id, modal, idNum) {//查看、修改业务基础薪资对象、
      // this.baseSalarySee=true //弹出修改框
      GET(process.env.VUE_APP_DOMAIN_personnel + '/bizSalary', { "id": id }).then(res => {//查询基础薪资对象
        this.businessShowForm = res.data
        if (modal == "baseSalarySee") {
          this.baseSalarySee = true
        } else {
          this.baseSalarySet = true
        }
        // console.log('查询业务基础薪资对象',res)
        this.sendLetterform = { ...res.data } //赋值给sendLetterform对象
        this.sendLetterform.idNum = idNum
      }).catch(error => {
        console.log(error)
      })
    },
    JS_update_save(formName) {//修改保存
      this.$refs[formName].validate(valid => {
        if (valid) {
          let saveObj = this.sendLetterform //保存对象
          console.log('保存对象', saveObj)
          PUT(process.env.VUE_APP_DOMAIN_personnel + '/bizSalary', saveObj).then(res => {
            this.$message({
              type: 'success',
              message: '修改数据成功!',
              showClose: true
            })
            this.baseSalarySet = false //关闭修改弹框
            this.businessSearch() //刷新表格，重新获取数据
          }).catch(error => {
            console.log(error)
          })
        } else {
          this.$message({
            showClose: true,
            type: 'warning',
            message: '提交失败，验证不通过'
          })
          return false
        }
      })
    },
    //下面的Change方法都是属于input的实时input方法
    ////业务基础薪资修改弹框内计算属性
    basicSalaryChange(e) { //基本工资
      this.sendLetterform.basicSalary = e.target.value
    },
    secretAllowanceChange(e) { //保密补助
      this.sendLetterform.secretAllowance = e.target.value
    },
    lunchAllowanceChange(e) { //中餐补助
      this.sendLetterform.lunchAllowance = e.target.value
    },
    trafficAllowanceChange(e) { //交通补助
      this.sendLetterform.trafficAllowance = e.target.value
    },
    phoneAllowanceChange(e) { //电话补助
      this.sendLetterform.phoneAllowance = e.target.value
    },
    dutySalaryChange(e) { //职务补助
      this.sendLetterform.dutySalary = e.target.value
    },
    extraworkSalaryChange(e) { //加班补助
      this.sendLetterform.extraworkSalary = e.target.value
    },

    //更新业务薪资
    updateBaseSearch(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let searchObjInit = {//保存对象
            "batch": this.exportExform.month1,
          }
          //console.log('保存对象', searchObjInit)
          const loading = this.$loading({//更新数据，锁定页面loading
            lock: true,
            text: '正在更新数据，请稍等片刻',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          GET(process.env.VUE_APP_DOMAIN_personnel + '/countBizSalary', searchObjInit).then(res => {
            loading.close() //关闭loading
            this.$message({
              type: 'success',
              message: '更新成功!',
              showClose: true
            })
            this.updateBase = false //关闭弹框
            this.businessSearch()
          }).catch(error => {
            loading.close() //关闭loading
            console.log(error)
          })
        } else {
          this.$message({
            showClose: true,
            type: 'warning',
            message: '提交失败，验证不通过'
          })
          return false
        }
      })

    },

    ///////////////////lxm  职能基础薪资表
    onSubmitFunction() {
      this.functionCurrent = 1 //点击搜索current=1搜索第一页
      //console.log(this.businessFormSearch);
      this.functionSearch();
    },
    inputEnterFunction() {// 文本框的enter事件触发搜索按钮
      this.onSubmitFunction();
    },
    handleSizeChangeFunction(val) {//切换页面数据的条数
      this.functionSize = val;
      this.functionSearch();
    },
    handlecurrentChangeFunction(val) {//当前页数
      this.functionCurrent = val;
      this.functionSearch();
    },
    functionSearch() {
      //lxm 列表查询 职能基础薪资表
      let searchObjInit = {//查询对象
        "current": this.functionCurrent,
        "size": this.functionSize,
        "ascs": this.functionAscs,
        "descs": this.functionDescs,
        "aid": this.functionFormSearch.staffNum,
        "name": this.functionFormSearch.name,
      }
      this.loading = true //开启动画
      POST(process.env.VUE_APP_DOMAIN_personnel + '/functionSalarys', searchObjInit).then(res => {
        // console.log('列表查询',res)
        this.loading = false //关闭动画
        this.functionData = res.data.records
        this.functionCurrent = res.data.current //set当前页
        this.functionpages = res.data.pages //总记录条数
        this.functionSize = res.data.size //每页显示记录条数
        this.functionTotal = res.data.total //总记录条数

      }).catch(error => {
        console.log(error)
      })
    },
    checkFunction(id, modal) {//查看职能基础薪资对象
      // this.baseSalarySee=true //弹出修改框
      GET(process.env.VUE_APP_DOMAIN_personnel + '/queryInfo', { "id": id }).then(res => {//查询基础薪资对象
        this.businessShowForm = res.data
        // this.takeNotes=res.data.takeNotes[0]
        if (modal == "baseSalarySee") {
          this.baseSalarySee = true
        } else {
          this.functionSalarySet = true
        }
        console.log('查询职能基础薪资对象', res)
        this.sendLetterform = { ...res.data } //赋值给sendLetterform对象
        this.sendLetterform2 = { ...res.data }
      }).catch(error => {
        console.log(error)
      })
    },
    JS_update_function(formName) {//修改保存
      this.$refs[formName].validate(valid => {
        if (valid) {
          let saveObj = this.sendLetterform //保存对象
          console.log('保存对象', saveObj)
          PUT(process.env.VUE_APP_DOMAIN_personnel + '/functionSalary', saveObj).then(res => {
            this.$message({
              type: 'success',
              message: '修改数据成功!',
              showClose: true
            })
            this.functionSalarySet = false //关闭修改弹框
            this.functionSearch() //刷新表格，重新获取数据
          }).catch(error => {
            console.log(error)
          })
        } else {
          this.$message({
            showClose: true,
            type: 'warning',
            message: '提交失败，验证不通过'
          })
          return false
        }
      })
    },
    updateFuncion() {
      this.showFlag = 0;
      this.updateCondition = true;

    },
    functionAidSearch() {
      if (this.updateConditionform.staffNum == '' || this.updateConditionform.staffNum == undefined) {
        return
      }
      //lxm 员工编号查询 职能调薪 职能基础薪资
      let searchObjInit = {//查询对象
        "aid": this.updateConditionform.staffNum,
      }
      GET(process.env.VUE_APP_DOMAIN_personnel + '/findAidQueryInfo', searchObjInit).then(res => {
        console.log('职能调薪对象', res)
        if (res.data.length == 0) {
          console.log('请输入正确的员工编号')
        } else {
          console.log(res.data)
          this.showFlag = 1;
          this.functionShowForm = res.data
          this.updateConditionform = { ...res.data } //赋值给sendLetterform对象
        }
      }).catch(error => {
        console.log(error)
        this.showFlag = 0;
      })
    },
    fileClose() {//关闭公式导入弹框
      //清除表单
      this.updateCondition = false
      this.updateConditionform.staffNum = undefined
    },
    JS_update_saveFunction(formName) {//修改保存
      let _this = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          let saveObj = this.updateConditionform //保存对象
          console.log('保存对象', saveObj)
          PUT(process.env.VUE_APP_DOMAIN_personnel + '/functionSalary', saveObj).then(res => {
            this.$message({
              type: 'success',
              message: '修改数据成功!',
              showClose: true
            })
            this.updateCondition = false //关闭修改弹框
            this.functionSearch() //刷新表格，重新获取数据
          }).catch(error => {
            console.log(error)
          })
        } else {
          this.$message({
            showClose: true,
            type: 'warning',
            message: '提交失败，验证不通过'
          })
          return false
        }
      })
    },
    //////职能调薪弹框内计算属性
    basicSalaryModifyChange(e) { //基本工资
      this.updateConditionform.basicSalary = e.target.value
    },
    secretAllowanceModifyChange(e) { //保密补助
      this.updateConditionform.secretAllowance = e.target.value
    },
    lunchAllowanceModifyChange(e) { //中餐补助
      this.updateConditionform.lunchAllowance = e.target.value
    },
    trafficAllowanceModifyChange(e) { //交通补助
      this.updateConditionform.trafficAllowance = e.target.value
    },
    phoneAllowanceModifyChange(e) { //电话补助
      this.updateConditionform.phoneAllowance = e.target.value
    },
    dutySalaryModifyChange(e) { //职务补助
      this.updateConditionform.dutySalary = e.target.value
    },
    extraworkSalaryModifyChange(e) { //加班补助
      this.updateConditionform.extraworkSalary = e.target.value
    },
    //////职能修改弹框内计算属性
    basicSalaryModifyChange2(e) { //基本工资
      this.sendLetterform.basicSalary = e.target.value
    },
    secretAllowanceModifyChange2(e) { //保密补助
      this.sendLetterform.secretAllowance = e.target.value
    },
    lunchAllowanceModifyChange2(e) { //中餐补助
      this.sendLetterform.lunchAllowance = e.target.value
    },
    trafficAllowanceModifyChange(e) { //交通补助
      this.sendLetterform.trafficAllowance = e.target.value
    },
    phoneAllowanceModifyChange2(e) { //电话补助
      this.sendLetterform.phoneAllowance = e.target.value
    },
    dutySalaryModifyChange2(e) { //职务补助
      this.sendLetterform.dutySalary = e.target.value
    },
    extraworkSalaryModifyChange2(e) { //加班补助
      this.sendLetterform.extraworkSalary = e.target.value
    },
    beforeUpload(file) {//111
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
    handleSuccess(res) {//上传文件接口调取成功回调
      this.uploadfunModal = false; //关闭导入框
      if (res.code == 0) {//文件上传成功
        // 文件上传成功
        this.downloadErrorEveProcess = res.data //获取进度条事件句柄
        console.log(this.downloadErrorEveProcess);
        //错误导入进度条与下载模板
        this.importProcessInfoDialog = true
        this.queryProgress() //获取上传文件进度条信息
      } else {
        //失败
        this.$msgBox.alert('<span style="color:red;">【系统无法识别EXCLE中的空白，公式和非法字符。请先清理】。</span>', '温馨提示', {
          dangerouslyUseHTMLString: true
        })
      }
      this.$refs.upload.clearFiles() //清空已上传的文件列表（该方法不支持在 before-upload 中调用）
    },
    handleSuccessBase(res){//业务基础薪资表
      this.uploadBaseModal = false; //关闭导入框
      if (res.code == 0) {//文件上传成功
        // 文件上传成功
        this.downloadErrorEveProcess = res.data //获取进度条事件句柄
        console.log(this.downloadErrorEveProcess);
        //错误导入进度条与下载模板
        this.importProcessInfoDialog = true
        this.queryProgress() //获取上传文件进度条信息
      } else {
        //失败
        this.$msgBox.alert('<span style="color:red;">【系统无法识别EXCLE中的空白，公式和非法字符。请先清理】。</span>', '温馨提示', {
          dangerouslyUseHTMLString: true
        })
      }
      this.$refs.upload.clearFiles() //清空已上传的文件列表（该方法不支持在 before-upload 中调用）
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
            if (this.activeName == "first") {
              this.onSubmitBusiness();//刷新业务基础薪资表
            } else if (this.activeName == "second") {
              this.onSubmitFunction()//刷新职能基础薪资表
            } 
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
    importProgress() {//进度弹框关闭
      this.importProcessInfoDialog = false; //关闭进度弹框
      this.progressPercentAge = 0 //进度条清空为0
      this.progressBackBtn = false; //隐藏返回按钮
      this.loadErrorExcel = false; // 隐藏下载失败链接
      this.uploadFunModal = false
    },
    unloadErrorLink() {//导入错误模板下载
      if (this.activeName == "first") {//业务基础薪资表
        let url = process.env.VUE_APP_DOMAIN_download + '/oss/download?key=' + this.downloadErrorKey + '&token=' + localStorage.getItem("token") + "&name=" + encodeURI("业务基础薪资表失败明细") + ".xlsx";
        window.location.href = url;
      } else if (this.activeName == "second") {//职能基础薪资表
        let url = process.env.VUE_APP_DOMAIN_download + '/oss/download?key=' + this.downloadErrorKey + '&token=' + localStorage.getItem("token") + "&name=" + encodeURI("职能基础薪资表失败明细") + ".xlsx";
        window.location.href = url;
      }
    },

    JS_fun_download() {
      // GET(process.env.VUE_APP_DOMAIN_personnel + "/downloadTemplet")
      //   .then(res => {
      //获取模板存储返回的ID
      let url = `${process.env.VUE_APP_DOMAIN_personnel}/downloadTemplet?token=${localStorage.getItem("token")}`;
      window.location.href = url;
      // })
      // .catch(error => {
      //   console.log(error);
      // });
    },
    JS_Base_download(){//@业务基础薪资表
      let url = `${process.env.VUE_APP_DOMAIN_personnel}/exportBizTemplet?batch=${this.base_batch}&token=${localStorage.getItem("token")}`;
      window.location.href = url;
    },
    ///////////////////lxm 综合薪资总表
    onSubmitAll() {
      this.allCurrent = 1 //点击搜索current=1搜索第一页
      console.log(this.allFormSearch);
      this.allSearch();
    },
    inputEnterAll() {// 文本框的enter事件触发搜索按钮
      this.onSubmitAll();
    },
    handleSizeChangeALL(val) {//切换页面数据的条数
      this.allSize = val;
      this.allSearch();
    },
    handlecurrentChangeALL(val) {//当前页数
      this.allCurrent = val;
      this.allSearch();
    },
    allSearch() {
      let searchObjInit = {//查询对象
        "current": this.allCurrent,
        "size": this.allSize,
        "aid": this.allFormSearch.staffNum,
        "name": this.allFormSearch.name,
        "batch": this.allFormSearch.batch
      }
      this.loading = true //开启动画
      POST(process.env.VUE_APP_DOMAIN_personnel + '/basicSalarySummarys', searchObjInit).then(res => {
        console.log('列表查询', res)
        this.loading = false //关闭动画
        this.allData = res.data.records
        this.allCurrent = res.data.current //set当前页
        this.allpages = res.data.pages //总记录条数
        this.allSize = res.data.size //每页显示记录条数
        this.allTotal = res.data.total //总记录条数
      }).catch(error => {
        console.log(error)
      })
    },
    checkAll(salaryType, bisId) {//查看综合薪资总表对象
      if (salaryType == 1) {//业务序列
        GET(process.env.VUE_APP_DOMAIN_personnel + '/bizSalary', { "id": bisId }).then(res => {//查询基础薪资对象
          this.businessShowForm = res.data
          this.baseSalarySee = true
          console.log('salaryType:', salaryType, 'id:', bisId, '业务序列:', res)
        }).catch(error => {
          console.log(error)
        })

      } else {//职能序列
        GET(process.env.VUE_APP_DOMAIN_personnel + '/queryInfo', { "id": bisId }).then(res => {//查询基础薪资对象
          this.businessShowForm = res.data
          this.baseSalarySee = true
          console.log('salaryType:', salaryType, 'id:', bisId, '职能序列:', res)
        }).catch(error => {
          console.log(error)
        })
      }
    },
    downloadAll() {
      window.location.href =
        process.env.VUE_APP_DOMAIN_personnel +
        "/basicSalarySummarysExportData?token=" +
        localStorage.getItem("token") +
        '&aid=' + (this.allFormSearch.staffNum || '') +
        '&batch=' + this.allFormSearch.batch +
        '&name=' + this.allFormSearch.name
      this.$message({
        type: 'success',
        message: '导出数据成功!',
        showClose: true
      })
    },

    ///////////////////lxm 基础薪资报表
    handleCommand(command) {//更多操作下拉框
      if (command == 'a') {
        //this.uploadModal = true
        this.downloadReport()
      }
      else if (command == 'b') {
        this.initialize() //初始化数据弹框
      }
      else if (command == 'c') {
        this.reset_submit() //重置上报
      }
    },
    initialize() {
      // if (this.ptdFlag === this.reportFormSearch.batch) {
      const loading = this.$loading({//上报数据，锁定页面loading
        lock: true,
        text: '正在初始化数据，请稍等片刻',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      POST(process.env.VUE_APP_DOMAIN_personnel + '/initSummarySalaryData', { 'batch': this.reportFormSearch.batch }).then(res => {
        console.log('列表查询', res)
        loading.close() //关闭loading
        this.$message({
          type: 'success',
          message: '数据初始化已成功!'
        })
        this.reportSearch()//刷新表格，重新获取数据
      }).catch(error => {
        loading.close() //关闭loading
        console.log(error)
      })
      // } else {
      //   this.$message({
      //     type: 'error',
      //     message: '请选择正确年月!'
      //   })
      // }

    },

    reset_submit() {
      this.$msgBox.confirm('你确定要重置上报数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        const loading = this.$loading({//上报数据，锁定页面loading
          lock: true,
          text: '正在重置上报数据，请稍等片刻',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        PUT(process.env.VUE_APP_DOMAIN_personnel + '/resetHrSummarySalaryReoprtData', { 'batch': this.reportFormSearch.batch }).then(res => {
          console.log('列表查询', res)
          loading.close() //关闭loading
          this.$message({
            type: 'success',
            message: '已成功重置上报数据!'
          })
          this.reportSearch()//刷新表格，重新获取数据
        }).catch(error => {
          loading.close() //关闭loading
          console.log(error)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消重置上报数据'
        })
      })
    },









    downloadReport() {
      window.location.href =
        process.env.VUE_APP_DOMAIN_personnel +
        "/hrSummarySalaryExportData?token=" +
        localStorage.getItem("token") +
        "&batch=" + this.reportFormSearch.batch +
        '&employeeName=' + this.reportFormSearch.name +
        '&employeeNo=' + (this.reportFormSearch.staffNum || '');
      this.$message({
        type: 'success',
        message: '导出数据成功!',
        showClose: true
      })
    },
    JS_submit() {//提交数据
      this.$msgBox.confirm('<span>请确认你上传的' + this.reportFormSearch.batch + '月份</span><span style="color:red;">【基础薪资报表】</span><span>无误，确认提交后，将直接影响工资准确发放。</span>', '温馨提示', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        callback: (action, instance) => {
          if (action === 'confirm') {
            const loading = this.$loading({//上报数据，锁定页面loading
              lock: true,
              text: '正在上报数据，请稍等片刻',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            })
            POST(process.env.VUE_APP_DOMAIN_personnel + "/reportSummarySalary", { batch: this.reportFormSearch.batch }).then(res => {
              console.log("基础薪资报表上报数据", res)
              loading.close() //关闭loading
              if (res.code == 0) {
                this.$message({
                  type: "success",
                  message: "上报数据成功！"
                })
              }
              this.reportSearch() //搜索并且判断数据是否上锁

            }).catch(error => {
              loading.close() //关闭loading
              console.log(error)
            })
          }
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消提交！'
        });
      });
    },
    cancel_submit() {
      //取消上报
      this.$msgBox.confirm(
        '<span>确定取消上报数据？</span>',
        "温馨提示",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          callback: (action, instance) => {
            if (action === 'confirm') {
              POST(process.env.VUE_APP_DOMAIN_personnel + "/unlockHrSummarySalary", { batch: this.reportFormSearch.batch }).then(res => {
                console.log("基础薪资报表取消上报", res)
                if (res.code == 0) {
                  this.isLockFlag = false
                }
                console.log(this.isLockFlag)
                this.$message({
                  type: "success",
                  message: "取消上报数据成功！"
                })
                this.reportSearch() //搜索并且判断数据是否上锁
              }).catch(error => {
                console.log(error)
              })
            }
          }
        }
      ).catch(() => {

      })
    },
    onSubmitReport() {
      this.reportCurrent = 1 //点击搜索current=1搜索第一页
      //console.log(this.reportSearch);
      this.reportSearch();
    },
    inputEnterReport() {// 文本框的enter事件触发搜索按钮
      this.onSubmitReport();
    },
    handleSizeChangeReport(val) {//切换页面数据的条数
      this.reportSize = val;
      this.reportSearch();
    },
    handlecurrentChangeReport(val) {//当前页数
      this.reportCurrent = val;
      this.reportSearch();
    },

    reportSearch() {
      let searchObjInit = {//查询对象
        "current": this.reportCurrent,
        "size": this.reportSize,
        "employeeNo": this.reportFormSearch.staffNum,
        "employeeName": this.reportFormSearch.name,
        "batch": this.reportFormSearch.batch,
        "bvalid": this.reportFormSearch.dataValue, //
        "bsubmit": this.StateValue || '', //表头处理状态
      }
      this.loading = true //开启动画
      POST(process.env.VUE_APP_DOMAIN_personnel + '/hrSummarySalarys', searchObjInit).then(res => {
        console.log('列表查询', res)
        this.loading = false //关闭动画
        this.reportData = res.data.records
        this.reportCurrent = res.data.current //set当前页
        this.reportpages = res.data.pages //总记录条数
        this.reportSize = res.data.size //每页显示记录条数
        this.reportTotal = res.data.total //总记录条数
        this.isLock() //基础薪资报表判断数据是否上锁

      }).catch(error => {
        console.log(error)
      })
    },
    isLock() {//基础薪资报表判断数据是否上锁
      GET(process.env.VUE_APP_DOMAIN_personnel + "/hrSummarySalaryFinancialDataLockStatus", { batch: this.reportFormSearch.batch }).then(res => {
        console.log("基础薪资报表判断数据是否上锁", res)
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
    // ignoreSubmit(id, msg, confirmStatus) {//忽略上报
    //   //单个忽略上报
    //   this.$msgBox
    //     .confirm(`你确定要${msg}上报该条数据吗?`, "提示", {
    //       confirmButtonText: "确定",
    //       cancelButtonText: "取消",
    //       type: "warning"
    //     })
    //     .then(() => {
    //       let searchObjInit = {//查询对象
    //         "batch": this.reportFormSearch.batch,
    //         "ids": id, //表头处理状态
    //         "confirmStatus": confirmStatus
    //       }
    //       POST(process.env.VUE_APP_DOMAIN_personnel + "/hrSummarySalaryConfirmStatus", searchObjInit)
    //         .then(res => {
    //           //单条忽略上报
    //           // this.$message({
    //           //   type: "success",
    //           //   message: "忽略上报成功!"
    //           // })
    //           this.onSubmit() //刷新表格，重新获取数据
    //         })
    //         .catch(error => {
    //           console.log(error)
    //         })
    //     })
    //     .catch(() => {

    //     })
    // },

    //////////////////////应发工资 lxm
    onSubmitLoanpay() {
      this.loanpayCurrent = 1 //点击搜索current=1搜索第一页
      this.loanpaySearch();
    },
    inputEnterLoanpay() {// 文本框的enter事件触发搜索按钮
      this.onSubmitLoanpay();
    },
    handleSizeChangeLoanpay(val) {//切换页面数据的条数
      this.loanpaySize = val;
      this.loanpaySearch();
    },
    handlecurrentChangeLoanpay(val) {//当前页数
      this.loanpayCurrent = val;
      this.loanpaySearch();
    },

    loanpaySearch() {
      let searchObjInit = {//查询对象
        "current": this.loanpayCurrent,
        "size": this.loanpaySize,
        "employeeNo": this.loanpayFormSearch.staffNum,
        "employeeName": this.loanpayFormSearch.name,
        "batch": this.loanpayFormSearch.batch,
      }
      this.loading = true //开启动画
      POST(process.env.VUE_APP_DOMAIN_personnel + '/wageEmployInfoInter', searchObjInit).then(res => {
        console.log('应发工资列表查询', res)
        this.loading = false //关闭动画
        this.loanpayData = res.data.records
        this.loanpayCurrent = res.data.current //set当前页
        this.loanpaypages = res.data.pages //总记录条数
        this.loanpaySize = res.data.size //每页显示记录条数
        this.loanpayTotal = res.data.total //总记录条数
      }).catch(error => {
        console.log(error)
      })
    },
    initWage() {//同步数据
      let searchObjInit = {//查询对象
        "batch": this.loanpayFormSearch.batch,
      }
      this.loading = true //开启动画
      POST(process.env.VUE_APP_DOMAIN_personnel + '/initWageData', searchObjInit).then(res => {
        console.log('列表查询', res)
        this.loading = false //关闭动画
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: "同步数据成功!"
          })
        }
        this.onSubmitLoanpay() //刷新表格，重新获取数据
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>
<style scoped>
</style>