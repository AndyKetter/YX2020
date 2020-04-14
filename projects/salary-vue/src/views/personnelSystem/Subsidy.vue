<template>
  <div class="summary-tables">
    <div class="guide">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home/personnelSystem' }">人事系统</el-breadcrumb-item>
        <el-breadcrumb-item>人事收入</el-breadcrumb-item>
        <el-breadcrumb-item>人事收入项</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/personnelSystem' }">(返回上级)</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="bgWhite mgt15">
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="餐补" name="first">
          <div class="pull-left">
            <el-form :inline="true" :model="mealSearch" class="mar-no pull-left">
              <el-form-item label="所属区域">
                <el-select
                  clearable
                  v-model="mealSearch.placeSelect"
                  placeholder="所属区域"
                  class="adapteWidth"
                >
                  <el-option
                    v-for="item in areaOptions"
                    :key="item.areaId"
                    :label="item.areaName"
                    :value="item.areaId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="年月">
                <el-date-picker
                  v-model="mealSearch.batch"
                  type="month"
                  class="width130"
                  value-format="yyyy-MM"
                  :editable="false"
                  :clearable="false"
                  placeholder="选择月份"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="姓名">
                <el-input
                  v-model="mealSearch.name"
                  placeholder="请输入名字"
                  @keyup.enter.native="JS_mealSearch"
                  clearable
                  class="width130"
                ></el-input>
              </el-form-item>
              <el-form-item label="员工编号">
                <el-input
                  v-model="mealSearch.staffNum"
                  @keyup.enter.native="JS_mealSearch"
                  placeholder="请输入编号"
                  clearable
                  class="width130"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="JS_mealSearch" icon="el-icon-search">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="pull-right">
            <el-dropdown @command="handleCommandMeal" trigger="click">
              <el-button type="primary">
                更多操作
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a" :disabled="mealDisabled">初始化数据</el-dropdown-item>
                <el-dropdown-item command="b" divided>
                  <i class="el-icon-refresh"></i>重置提交
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>&nbsp;
            <!-- <el-button size="small" @click="init_mealSubsidy()" :disabled="mealDisabled">初始化数据</el-button> -->
            <!-- <el-button size="small" slot="reference" @click="addMealSubsidy=true" icon="el-icon-plus" :disabled="mealDisabled">新增</el-button> -->
            <el-button
              size="small"
              type="danger"
              @click="update_mealSubsidy()"
              v-if="!mealDisabled"
            >上报数据</el-button>
            <el-button size="small" v-else @click="cancel_mealSubsidy()">取消上报</el-button>
          </div>
          <div class="table_wrap">
            <el-table
              :data="mealSubsidyData"
              :height="tabHeight"
              v-loading="loading"
              border
              style="width:100%"
              :header-cell-style="{backgroundColor:'#e5e9f3'}"
            >
              <el-table-column type="index" label="序号" min-width="50"></el-table-column>
              <el-table-column label="姓名" min-width="150">
                <template slot-scope="scope">
                  <el-popover
                    trigger="click"
                    placement="top"
                    width="450"
                    @show="getUserInfo(scope.row.aid)"
                  >
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.name}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="性别" min-width="50">
                <template slot-scope="scope">
                  <span v-if="scope.row.gender === '0'">女</span>
                  <span v-else-if="scope.row.gender === '1'">男</span>
                  <span v-else></span>
                </template>
              </el-table-column>
              <el-table-column label="员工编号" min-width="120">
                <template slot-scope="scope">
                  <span>{{scope.row.aid}}</span>
                  <i class="el-icon-phone tbIconPhone"></i>
                </template>
              </el-table-column>
              <el-table-column
                prop="employeeType"
                label="员工类型"
                min-width="120"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="workAreaName"
                label="所属区域"
                min-width="160"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column prop="boardAllowance" label="餐补" min-width="80">
                <template slot-scope="scope">{{scope.row.boardAllowance|toThousands}}</template>
              </el-table-column>
              <el-table-column prop="batch" label="年月" min-width="80"></el-table-column>
              <el-table-column label="最后操作人" min-width="150">
                <template slot-scope="scope">
                  <el-popover
                    trigger="click"
                    placement="top"
                    width="450"
                    @show="getInfoForId(scope.row.updateUser)"
                    v-if="scope.row.updateUser"
                  >
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.updateUserName}}</el-button>
                    </div>
                  </el-popover>
                  <el-popover
                    trigger="click"
                    placement="top"
                    width="450"
                    @show="getInfoForId(scope.row.createUser)"
                    v-else
                  >
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.createUserName}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="updateTime" label="最后操作时间" min-width="160">
                <template slot-scope="scope">
                  <span v-if="scope.row.updateTime">{{scope.row.updateTime}}</span>
                  <span v-else>{{scope.row.createTime}}</span>
                </template>
              </el-table-column>
              <el-table-column label="提交状态" min-width="170">
                <template slot="header">
                  <el-select
                    v-model="mealSubmitValue"
                    filterable
                    placeholder="提交状态"
                    clearable
                    style="width:150px;"
                    @change="mealSubmitChange"
                    class="selectRepairIcon"
                  >
                    <el-option
                      v-for="item in bsubmitOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
                <template slot-scope="scope">
                  <span style="color:#EF3838;" v-if="scope.row.isConfirm=='0'">未提交</span>
                  <span v-if="scope.row.isConfirm=='1'">已提交</span>
                  <span style="color:#EF3838;" v-if="scope.row.isConfirm=='2'">
                    <el-tooltip
                      v-if="scope.row.reportMsg"
                      class="item"
                      effect="dark"
                      :content="scope.row.reportMsg"
                      placement="top"
                    >
                      <span>提交失败</span>
                    </el-tooltip>
                    <span v-else>提交失败</span>
                  </span>
                  <span v-if="scope.row.isConfirm=='3'">忽略提交</span>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="operation" label="操作" fixed="right" width="60" v-if="mealDisabled">
                <template>
                  <el-button type="text" disabled size="small">修改</el-button>
                </template>
              </el-table-column>-->
              <el-table-column prop="operation" label="操作" fixed="right" min-width="170">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    :disabled="mealDisabled"
                    size="small"
                    @click="updateLm('/incomeBoardAllowance',scope.row.id,'updateMealSubsidyform','updateMealSubsidy')"
                  >修改</el-button>
                  <el-button
                    v-if="scope.row.isConfirm=='2'"
                    type="text"
                    size="small"
                    :disabled="mealDisabled"
                    @click="mealIgnoreSubmit(scope.row.id)"
                  >忽略提交</el-button>
                  <el-button
                    v-if="scope.row.isConfirm=='3'"
                    type="text"
                    size="small"
                    :disabled="mealDisabled"
                    @click="mealCancelIgnore(scope.row.id)"
                  >取消忽略</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div id="pagination">
              <el-pagination
                @size-change="mealHandleSizeChange"
                @current-change="mealHandlecurrentChange"
                background
                :current-page="mealCurrent"
                :page-sizes="[10,15,20,30,40]"
                :page-size="mealSize"
                layout="total,sizes,prev,pager,next,jumper"
                :total="mealTotal"
              ></el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <!-- ***************分割线***************** -->
        <el-tab-pane label="租房补贴" name="second">
          <div class="pull-left">
            <el-form :inline="true" :model="hsSearch" class="mar-no pull-left">
              <el-form-item label="所属区域">
                <el-select
                  clearable
                  v-model="hsSearch.placeSelect"
                  placeholder="所属区域"
                  class="adapteWidth"
                >
                  <el-option
                    v-for="item in areaOptions"
                    :key="item.areaId"
                    :label="item.areaName"
                    :value="item.areaId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="年月">
                <el-date-picker
                  v-model="hsSearch.batch"
                  type="month"
                  class="width130"
                  value-format="yyyy-MM"
                  :editable="false"
                  :clearable="false"
                  placeholder="选择月份"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="姓名">
                <el-input
                  v-model="hsSearch.name"
                  @keyup.enter.native="JS_hsSearch"
                  clearable
                  placeholder="请输入名字"
                  class="width130"
                ></el-input>
              </el-form-item>
              <el-form-item label="员工编号">
                <el-input
                  v-model="hsSearch.staffNum"
                  @keyup.enter.native="JS_hsSearch"
                  clearable
                  placeholder="请输入编号"
                  class="width130"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="JS_hsSearch" icon="el-icon-search">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="pull-right">
            <el-dropdown @command="handleCommandHs" trigger="click">
              <el-button type="primary">
                更多操作
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a" :disabled="hsDisabled">初始化数据</el-dropdown-item>
                <el-dropdown-item command="b" divided>
                  <i class="el-icon-refresh"></i>重置提交
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>&nbsp;
            <!-- <el-button size="small" @click="init_hsSubsidy()" :disabled="hsDisabled">初始化数据</el-button> -->
            <!-- <el-button size="small" slot="reference" @click="addhsSubsidy=true" icon="el-icon-plus" :disabled="hsDisabled">新增</el-button> -->
            <el-button
              size="small"
              type="danger"
              @click="update_hsSubsidy()"
              v-if="!hsDisabled"
            >上报数据</el-button>
            <el-button size="small" v-else @click="cancel_hsSubsidy()">取消上报</el-button>
          </div>
          <div class="table_wrap">
            <el-table
              :data="hsSubsidyData"
              :height="tabHeight"
              v-loading="loading"
              border
              style="width:100%"
              :header-cell-style="{backgroundColor:'#e5e9f3'}"
            >
              <el-table-column type="index" label="序号" min-width="50"></el-table-column>
              <el-table-column label="姓名" min-width="150">
                <template slot-scope="scope">
                  <el-popover
                    trigger="click"
                    placement="top"
                    width="450"
                    @show="getUserInfo(scope.row.aid)"
                  >
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.name}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="性别" min-width="50">
                <template slot-scope="scope">
                  <span v-if="scope.row.gender === '0'">女</span>
                  <span v-else-if="scope.row.gender === '1'">男</span>
                  <span v-else></span>
                </template>
              </el-table-column>
              <el-table-column label="员工编号" min-width="120">
                <template slot-scope="scope">
                  <span>{{scope.row.aid}}</span>
                  <i class="el-icon-phone tbIconPhone"></i>
                </template>
              </el-table-column>
              <el-table-column
                prop="employeeType"
                label="员工类型"
                min-width="120"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="workAreaName"
                label="所属区域"
                min-width="160"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column prop="rentAllowance" label="租房补贴" min-width="80">
                <template slot-scope="scope">{{scope.row.rentAllowance|toThousands}}</template>
              </el-table-column>
              <el-table-column prop="batch" label="年月" min-width="70"></el-table-column>
              <el-table-column label="最后操作人" min-width="150">
                <template slot-scope="scope">
                  <el-popover
                    trigger="click"
                    placement="top"
                    width="450"
                    @show="getInfoForId(scope.row.updateUser)"
                    v-if="scope.row.updateUser"
                  >
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.updateUserName}}</el-button>
                    </div>
                  </el-popover>
                  <el-popover
                    trigger="click"
                    placement="top"
                    width="450"
                    @show="getInfoForId(scope.row.createUser)"
                    v-else
                  >
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.createUserName}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="updateTime" label="最后操作时间" min-width="160">
                <template slot-scope="scope">
                  <span v-if="scope.row.updateTime">{{scope.row.updateTime}}</span>
                  <span v-else>{{scope.row.createTime}}</span>
                </template>
              </el-table-column>
              <el-table-column label="提交状态" min-width="170">
                <template slot="header">
                  <el-select
                    v-model="hsSubmitValue"
                    filterable
                    placeholder="提交状态"
                    clearable
                    style="width:150px;"
                    @change="hsSubmitChange"
                    class="selectRepairIcon"
                  >
                    <el-option
                      v-for="item in bsubmitOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
                <template slot-scope="scope">
                  <span style="color:#EF3838;" v-if="scope.row.isConfirm=='0'">未提交</span>
                  <span v-if="scope.row.isConfirm=='1'">已提交</span>
                  <span style="color:#EF3838;" v-if="scope.row.isConfirm=='2'">
                    <el-tooltip
                      v-if="scope.row.reportMsg"
                      class="item"
                      effect="dark"
                      :content="scope.row.reportMsg"
                      placement="top"
                    >
                      <span>提交失败</span>
                    </el-tooltip>
                    <span v-else>提交失败</span>
                  </span>
                  <span v-if="scope.row.isConfirm=='3'">忽略提交</span>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="operation" label="操作" fixed="right" width="60" v-if="hsDisabled">
                <template>
                  <el-button type="text" disabled size="small">修改</el-button>
                </template>
              </el-table-column>-->
              <el-table-column prop="operation" label="操作" fixed="right" min-width="170">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    :disabled="hsDisabled"
                    size="small"
                    @click="updateLm('/incomeRentAllowance',scope.row.id,'updatehsSubsidyform','updatehsSubsidy')"
                  >修改</el-button>
                  <el-button
                    v-if="scope.row.isConfirm=='2'"
                    type="text"
                    size="small"
                    :disabled="hsDisabled"
                    @click="hsIgnoreSubmit(scope.row.id)"
                  >忽略提交</el-button>
                  <el-button
                    v-if="scope.row.isConfirm=='3'"
                    type="text"
                    size="small"
                    :disabled="hsDisabled"
                    @click="hsCancelIgnore(scope.row.id)"
                  >取消忽略</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div id="pagination">
              <el-pagination
                @size-change="hsHandleSizeChange"
                @current-change="hsHandlecurrentChange"
                background
                :current-page="hsCurrent"
                :page-sizes="[10,15,20,30,40]"
                :page-size="hsSize"
                layout="total,sizes,prev,pager,next,jumper"
                :total="hsTotal"
              ></el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <!-- ****************分割线**************** -->
        <el-tab-pane label="社保补贴" name="third">
          <div class="pull-left">
            <el-form :inline="true" :model="socialSearch" class="mar-no pull-left">
              <el-form-item label="所属区域">
                <el-select
                  clearable
                  v-model="socialSearch.placeSelect"
                  placeholder="所属区域"
                  class="adapteWidth"
                >
                  <el-option
                    v-for="item in areaOptions"
                    :key="item.areaId"
                    :label="item.areaName"
                    :value="item.areaId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="年月">
                <el-date-picker
                  v-model="socialSearch.batch"
                  type="month"
                  class="width130"
                  value-format="yyyy-MM"
                  :editable="false"
                  :clearable="false"
                  placeholder="选择月份"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="姓名">
                <el-input
                  v-model="socialSearch.name"
                  @keyup.enter.native="JS_socialSearch"
                  clearable
                  placeholder="请输入名字"
                  class="width130"
                ></el-input>
              </el-form-item>
              <el-form-item label="员工编号">
                <el-input
                  v-model="socialSearch.staffNum"
                  @keyup.enter.native="JS_socialSearch"
                  clearable
                  placeholder="请输入编号"
                  class="width130"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="JS_socialSearch" icon="el-icon-search">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="pull-right">
            <el-dropdown @command="handleCommandSocial" trigger="click">
              <el-button type="primary">
                更多操作
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a" :disabled="socialDisabled">初始化数据</el-dropdown-item>
                <el-dropdown-item command="b" divided>
                  <i class="el-icon-refresh"></i>重置提交
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>&nbsp;
            <!-- <el-button size="small" @click="init_socialSubsidy()" :disabled="socialDisabled">初始化数据</el-button> -->
            <!-- <el-button size="small" slot="reference" @click="addsocialSubsidy=true" icon="el-icon-plus" :disabled="socialDisabled">新增</el-button> -->
            <el-button
              size="small"
              type="danger"
              @click="update_socialSubsidy()"
              v-if="!socialDisabled"
            >上报数据</el-button>
            <el-button size="small" v-else @click="cancel_socialSubsidy()">取消上报</el-button>
          </div>
          <div class="table_wrap">
            <el-table
              :data="socialSubsidyData"
              :height="tabHeight"
              v-loading="loading"
              border
              style="width:100%"
              :header-cell-style="{backgroundColor:'#e5e9f3'}"
            >
              <el-table-column type="index" label="序号" min-width="50"></el-table-column>
              <el-table-column label="姓名" min-width="150">
                <template slot-scope="scope">
                  <el-popover
                    trigger="click"
                    placement="top"
                    width="450"
                    @show="getUserInfo(scope.row.aid)"
                  >
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.name}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="性别" min-width="50">
                <template slot-scope="scope">
                  <span v-if="scope.row.gender === '0'">女</span>
                  <span v-else-if="scope.row.gender === '1'">男</span>
                  <span v-else></span>
                </template>
              </el-table-column>
              <el-table-column label="员工编号" min-width="120">
                <template slot-scope="scope">
                  <span>{{scope.row.aid}}</span>
                  <i class="el-icon-phone tbIconPhone"></i>
                </template>
              </el-table-column>
              <el-table-column
                prop="employeeType"
                label="员工类型"
                min-width="120"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="workAreaName"
                label="所属区域"
                min-width="160"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column prop="socialAllowance" label="社保补贴" min-width="80">
                <template slot-scope="scope">{{scope.row.socialAllowance|toThousands}}</template>
              </el-table-column>
              <el-table-column prop="batch" label="年月" min-width="70"></el-table-column>
              <el-table-column label="最后操作人" min-width="150">
                <template slot-scope="scope">
                  <el-popover
                    trigger="click"
                    placement="top"
                    width="450"
                    @show="getInfoForId(scope.row.updateUser)"
                    v-if="scope.row.updateUser"
                  >
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.updateUserName}}</el-button>
                    </div>
                  </el-popover>
                  <el-popover
                    trigger="click"
                    placement="top"
                    width="450"
                    @show="getInfoForId(scope.row.createUser)"
                    v-else
                  >
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.createUserName}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="updateTime" label="最后操作时间" min-width="160">
                <template slot-scope="scope">
                  <span v-if="scope.row.updateTime">{{scope.row.updateTime}}</span>
                  <span v-else>{{scope.row.createTime}}</span>
                </template>
              </el-table-column>
              <el-table-column label="提交状态" min-width="170">
                <template slot="header">
                  <el-select
                    v-model="socialSubmitValue"
                    filterable
                    placeholder="提交状态"
                    clearable
                    style="width:150px;"
                    @change="socialSubmitChange"
                    class="selectRepairIcon"
                  >
                    <el-option
                      v-for="item in bsubmitOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
                <template slot-scope="scope">
                  <span style="color:#EF3838;" v-if="scope.row.isConfirm=='0'">未提交</span>
                  <span v-if="scope.row.isConfirm=='1'">已提交</span>
                  <span style="color:#EF3838;" v-if="scope.row.isConfirm=='2'">
                    <el-tooltip
                      v-if="scope.row.reportMsg"
                      class="item"
                      effect="dark"
                      :content="scope.row.reportMsg"
                      placement="top"
                    >
                      <span>提交失败</span>
                    </el-tooltip>
                    <span v-else>提交失败</span>
                  </span>
                  <span v-if="scope.row.isConfirm=='3'">忽略提交</span>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="operation" label="操作" fixed="right" width="60" v-if="socialDisabled">
                <template>
                  <el-button type="text" disabled size="small">修改</el-button>
                </template>
              </el-table-column>-->
              <el-table-column prop="operation" label="操作" fixed="right" min-width="170">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    :disabled="socialDisabled"
                    size="small"
                    @click="updateLm('/incomeSocialAllowance',scope.row.id,'updatesocialSubsidyform','updatesocialSubsidy')"
                  >修改</el-button>
                  <el-button
                    v-if="scope.row.isConfirm=='2'"
                    type="text"
                    size="small"
                    :disabled="socialDisabled"
                    @click="socialIgnoreSubmit(scope.row.id)"
                  >忽略提交</el-button>
                  <el-button
                    v-if="scope.row.isConfirm=='3'"
                    type="text"
                    size="small"
                    :disabled="socialDisabled"
                    @click="socialCancelIgnore(scope.row.id)"
                  >取消忽略</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div id="pagination">
              <el-pagination
                @size-change="socialHandleSizeChange"
                @current-change="socialHandlecurrentChange"
                background
                :current-page="socialCurrent"
                :page-sizes="[10,15,20,30,40]"
                :page-size="socialSize"
                layout="total,sizes,prev,pager,next,jumper"
                :total="socialTotal"
              ></el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <!-- ****************分割线**************** -->
        <el-tab-pane label="实习补贴" name="four">
          <div class="pull-left">
            <el-form :inline="true" :model="interSearch" class="mar-no pull-left">
              <el-form-item label="所属区域">
                <el-select
                  clearable
                  v-model="interSearch.placeSelect"
                  placeholder="所属区域"
                  class="adapteWidth"
                >
                  <el-option
                    v-for="item in areaOptions"
                    :key="item.areaId"
                    :label="item.areaName"
                    :value="item.areaId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="年月">
                <el-date-picker
                  v-model="interSearch.batch"
                  type="month"
                  class="width130"
                  value-format="yyyy-MM"
                  :editable="false"
                  :clearable="false"
                  placeholder="选择月份"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="姓名">
                <el-input
                  v-model="interSearch.name"
                  @keyup.enter.native="JS_interSearch"
                  clearable
                  placeholder="请输入名字"
                  class="width130"
                ></el-input>
              </el-form-item>
              <el-form-item label="员工编号">
                <el-input
                  v-model="interSearch.staffNum"
                  @keyup.enter.native="JS_interSearch"
                  clearable
                  placeholder="请输入编号"
                  class="width130"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="JS_interSearch" icon="el-icon-search">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="pull-right">
            <el-dropdown @command="handleCommandInter" trigger="click">
              <el-button type="primary">
                更多操作
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a" :disabled="interDisabled">初始化数据</el-dropdown-item>
                <el-dropdown-item command="b" divided>
                  <i class="el-icon-refresh"></i>重置提交
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>&nbsp;
            <!-- <el-button size="small" @click="init_interSubsidy()" :disabled="interDisabled">初始化数据</el-button> -->
            <el-button
              size="small"
              type="danger"
              @click="update_interSubsidy()"
              v-if="!interDisabled"
            >上报数据</el-button>
            <el-button size="small" v-else @click="cancel_interSubsidy">取消上报</el-button>
          </div>
          <div class="table_wrap">
            <el-table
              :data="interSubsidyData"
              :height="tabHeight"
              v-loading="loading"
              border
              style="width:100%"
              :header-cell-style="{backgroundColor:'#e5e9f3'}"
            >
              <el-table-column type="index" label="序号" min-width="50"></el-table-column>
              <el-table-column label="姓名" min-width="150">
                <template slot-scope="scope">
                  <el-popover
                    trigger="click"
                    placement="top"
                    width="450"
                    @show="getUserInfo(scope.row.aid)"
                  >
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.name}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="性别" min-width="50">
                <template slot-scope="scope">
                  <span v-if="scope.row.gender === '0'">女</span>
                  <span v-else-if="scope.row.gender === '1'">男</span>
                  <span v-else></span>
                </template>
              </el-table-column>
              <el-table-column label="员工编号" min-width="120">
                <template slot-scope="scope">
                  <span>{{scope.row.aid}}</span>
                  <i class="el-icon-phone tbIconPhone"></i>
                </template>
              </el-table-column>
              <el-table-column
                prop="employeeType"
                label="员工类型"
                min-width="120"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="workAreaName"
                label="所属区域"
                min-width="160"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column prop="probationAllowance" label="实习补贴" min-width="80">
                <template slot-scope="scope">{{scope.row.probationAllowance|toThousands}}</template>
              </el-table-column>
              <el-table-column prop="batch" label="年月" min-width="70"></el-table-column>
              <el-table-column label="最后操作人" min-width="150">
                <template slot-scope="scope">
                  <el-popover
                    trigger="click"
                    placement="top"
                    width="450"
                    @show="getInfoForId(scope.row.updateUser)"
                    v-if="scope.row.updateUser"
                  >
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.updateUserName}}</el-button>
                    </div>
                  </el-popover>
                  <el-popover
                    trigger="click"
                    placement="top"
                    width="450"
                    @show="getInfoForId(scope.row.createUser)"
                    v-else
                  >
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.createUserName}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="updateTime" label="最后操作时间" min-width="160">
                <template slot-scope="scope">
                  <span v-if="scope.row.updateTime">{{scope.row.updateTime}}</span>
                  <span v-else>{{scope.row.createTime}}</span>
                </template>
              </el-table-column>
              <el-table-column label="提交状态" min-width="170">
                <template slot="header">
                  <el-select
                    v-model="interSubmitValue"
                    filterable
                    placeholder="提交状态"
                    clearable
                    style="width:150px;"
                    @change="interSubmitChange"
                    class="selectRepairIcon"
                  >
                    <el-option
                      v-for="item in bsubmitOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
                <template slot-scope="scope">
                  <span style="color:#EF3838;" v-if="scope.row.isConfirm=='0'">未提交</span>
                  <span v-if="scope.row.isConfirm=='1'">已提交</span>
                  <span style="color:#EF3838;" v-if="scope.row.isConfirm=='2'">
                    <el-tooltip
                      v-if="scope.row.reportMsg"
                      class="item"
                      effect="dark"
                      :content="scope.row.reportMsg"
                      placement="top"
                    >
                      <span>提交失败</span>
                    </el-tooltip>
                    <span v-else>提交失败</span>
                  </span>
                  <span v-if="scope.row.isConfirm=='3'">忽略提交</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" fixed="right" min-width="120">
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.row.isConfirm=='2'"
                    type="text"
                    size="small"
                    :disabled="interDisabled"
                    @click="interIgnoreSubmit(scope.row.id)"
                  >忽略提交</el-button>
                  <el-button
                    v-if="scope.row.isConfirm=='3'"
                    type="text"
                    size="small"
                    :disabled="interDisabled"
                    @click="interCancelIgnore(scope.row.id)"
                  >取消忽略</el-button>
                  <el-button v-if="scope.row.isConfirm=='1'" type="text" size="small" disabled>暂无操作</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div id="pagination">
              <el-pagination
                @size-change="interHandleSizeChange"
                @current-change="interHandlecurrentChange"
                background
                :current-page="interCurrent"
                :page-sizes="[10,15,20,30,40]"
                :page-size="interSize"
                layout="total,sizes,prev,pager,next,jumper"
                :total="interTotal"
              ></el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <!-- ****************分割线****************111 -->
        <el-tab-pane label="学历补贴" name="five">
          <div class="pull-left">
            <el-form :inline="true" :model="eduSearch" class="mar-no pull-left">
              <el-form-item label="所属区域">
                <el-select
                  clearable
                  v-model="eduSearch.placeSelect"
                  placeholder="所属区域"
                  class="adapteWidth"
                >
                  <el-option
                    v-for="item in areaOptions"
                    :key="item.areaId"
                    :label="item.areaName"
                    :value="item.areaId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="年月">
                <el-date-picker
                  v-model="eduSearch.month"
                  type="month"
                  class="width130"
                  value-format="yyyy-MM"
                  :editable="false"
                  :clearable="false"
                  placeholder="选择月份"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="姓名">
                <el-input
                  v-model="eduSearch.name"
                  @keyup.enter.native="JS_eduSearch"
                  clearable
                  placeholder="请输入名字"
                  class="width130"
                ></el-input>
              </el-form-item>
              <el-form-item label="员工编号">
                <el-input
                  v-model="eduSearch.staffNum"
                  @keyup.enter.native="JS_eduSearch"
                  clearable
                  placeholder="请输入编号"
                  class="width130"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="JS_eduSearch" icon="el-icon-search">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="pull-right">
            <el-dropdown @command="handleCommand" trigger="click">
              <el-button type="primary">
                更多操作
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a" class="cloud-uploadBtn" :disabled="eduDisabled">
                  <i></i>&nbsp;导入
                </el-dropdown-item>
                <el-dropdown-item command="b" divided icon="el-icon-plus" :disabled="eduDisabled">
                  <i></i>新增
                </el-dropdown-item>
                <el-dropdown-item command="c" divided>
                  <i class="el-icon-refresh"></i>重置提交
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>&nbsp;
            <el-button
              size="small"
              type="danger"
              @click="update_eduSubsidy()"
              v-if="!eduDisabled"
            >上报数据</el-button>
            <el-button size="small" v-else @click="cancel_eduSubsidy">取消上报</el-button>
            <!-- <el-button size="small" type="danger" v-if="SubmitStu==false" @click="JS_submit">上报数据</el-button> -->
            <!-- <el-button size="small" v-else @click="cancel_submit">取消上报</el-button> -->
          </div>
          <div class="table_wrap">
            <el-table
              :data="eduSubsidyData"
              :height="tabHeight"
              v-loading="loading"
              border
              style="width:100%"
              :header-cell-style="{backgroundColor:'#e5e9f3'}"
            >
              <el-table-column type="index" label="序号" min-width="50"></el-table-column>
              <el-table-column label="姓名" min-width="150">
                <template slot-scope="scope">
                  <el-popover
                    trigger="click"
                    placement="top"
                    width="450"
                    @show="getUserInfo(scope.row.aid)"
                  >
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.name}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="性别" min-width="50">
                <template slot-scope="scope">
                  <span v-if="scope.row.gender === '0'">女</span>
                  <span v-else-if="scope.row.gender === '1'">男</span>
                  <span v-else></span>
                </template>
              </el-table-column>
              <el-table-column label="员工编号" min-width="120">
                <template slot-scope="scope">
                  <span>{{scope.row.aid}}</span>
                  <i class="el-icon-phone tbIconPhone"></i>
                </template>
              </el-table-column>
              <el-table-column prop="educationName" label="学历" min-width="100"></el-table-column>
              <el-table-column
                prop="workAreaName"
                label="所属区域"
                min-width="160"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column prop="educationAllowance" label="学历补贴" min-width="80">
                <template slot-scope="scope">{{scope.row.educationAllowance|toThousands}}</template>
              </el-table-column>
              <el-table-column prop="batch" label="年月" min-width="70"></el-table-column>
              <el-table-column label="最后操作人" min-width="150">
                <template slot-scope="scope">
                  <el-popover
                    trigger="click"
                    placement="top"
                    width="450"
                    @show="getInfoForId(scope.row.updateUser)"
                    v-if="scope.row.updateUser"
                  >
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.updateUserName}}</el-button>
                    </div>
                  </el-popover>
                  <el-popover
                    trigger="click"
                    placement="top"
                    width="450"
                    @show="getInfoForId(scope.row.createUser)"
                    v-else
                  >
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.createUserName}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="updateTime" label="最后操作时间" min-width="160">
                <template slot-scope="scope">
                  <span v-if="scope.row.updateTime">{{scope.row.updateTime}}</span>
                  <span v-else>{{scope.row.createTime}}</span>
                </template>
              </el-table-column>
              <el-table-column label="提交状态" min-width="170">
                <template slot="header">
                  <el-select
                    v-model="eduSubmitValue"
                    filterable
                    placeholder="提交状态"
                    clearable
                    style="width:150px;"
                    @change="eduSubmitChange"
                    class="selectRepairIcon"
                  >
                    <el-option
                      v-for="item in bsubmitOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
                <template slot-scope="scope">
                  <span style="color:#EF3838;" v-if="scope.row.isConfirm=='0'">未提交</span>
                  <span v-if="scope.row.isConfirm=='1'">已提交</span>
                  <span style="color:#EF3838;" v-if="scope.row.isConfirm=='2'">
                    <el-tooltip
                      v-if="scope.row.reportMsg"
                      class="item"
                      effect="dark"
                      :content="scope.row.reportMsg"
                      placement="top"
                    >
                      <span>提交失败</span>
                    </el-tooltip>
                    <span v-else>提交失败</span>
                  </span>
                  <span v-if="scope.row.isConfirm=='3'">忽略提交</span>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="operation" label="操作" fixed="right" width="60" v-if="eduDisabled">
                <template>
                  <el-button type="text" disabled size="small">修改</el-button>
                </template>
              </el-table-column>-->
              <el-table-column prop="operation" label="操作" fixed="right" min-width="170">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    :disabled="eduDisabled"
                    size="small"
                    @click="updateLm('/incomeEducationAllowance',scope.row.id,'updateeduSubsidyform','updateeduSubsidy')"
                  >修改</el-button>
                  <el-button
                    v-if="scope.row.isConfirm=='2'"
                    type="text"
                    size="small"
                    :disabled="eduDisabled"
                    @click="eduIgnoreSubmit(scope.row.id)"
                  >忽略提交</el-button>
                  <el-button
                    v-if="scope.row.isConfirm=='3'"
                    type="text"
                    size="small"
                    :disabled="eduDisabled"
                    @click="eduCancelIgnore(scope.row.id)"
                  >取消忽略</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div id="pagination">
              <el-pagination
                @size-change="eduHandleSizeChange"
                @current-change="eduHandlecurrentChange"
                background
                :current-page="eduCurrent"
                :page-sizes="[10,15,20,30,40]"
                :page-size="eduSize"
                layout="total,sizes,prev,pager,next,jumper"
                :total="eduTotal"
              ></el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <!-- ****************分割线**************** -->
        <el-tab-pane label="工龄补贴" name="six">
          <div class="pull-left">
            <el-form :inline="true" :model="yearSearch" class="mar-no pull-left">
              <el-form-item label="所属区域">
                <el-select
                  v-model="yearSearch.placeSelect"
                  clearable
                  placeholder="所属区域"
                  class="adapteWidth"
                >
                  <el-option
                    v-for="item in areaOptions"
                    :key="item.areaId"
                    :label="item.areaName"
                    :value="item.areaId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="年月">
                <el-date-picker
                  v-model="yearSearch.batch"
                  type="month"
                  class="width130"
                  value-format="yyyy-MM"
                  :editable="false"
                  :clearable="false"
                  placeholder="选择月份"
                ></el-date-picker>
              </el-form-item>
              <!-- <el-form-item label="姓名">
                <el-input v-model="yearSearch.name" @keyup.enter.native="JS_yearSearch" clearable placeholder="请输入名字" class="width130"></el-input>
              </el-form-item>
              <el-form-item label="员工编号">
                <el-input-number v-model="yearSearch.staffNum" :controls="false" @keyup.enter.native="JS_yearSearch" clearable placeholder="请输入编号" class="width130"></el-input-number>
              </el-form-item>-->
              <el-form-item label="工龄">
                <el-input-number
                  v-model="yearSearch.years"
                  :controls="false"
                  @keyup.enter.native="JS_yearSearch"
                  clearable
                  placeholder="请输入年限"
                  class="width130"
                ></el-input-number>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="JS_yearSearch" icon="el-icon-search">搜索</el-button>
                <el-button icon="el-icon-search" @click="search_more_year=true">更多查询</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="pull-right">
            <el-dropdown @command="handleCommandYear" trigger="click">
              <el-button type="primary">
                更多操作
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a" :disabled="yearDisabled">初始化数据</el-dropdown-item>
                <el-dropdown-item command="b" divided>
                  <i class="el-icon-refresh"></i>重置提交
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>&nbsp;
            <!-- <el-button size="small" @click="init_yearSubsidy()" :disabled="yearDisabled">初始化数据</el-button> -->
            <el-button
              size="small"
              type="danger"
              @click="update_yearSubsidy"
              v-if="!yearDisabled"
            >上报数据</el-button>
            <el-button size="small" v-else @click="cancel_yearSubsidy()">取消上报</el-button>
          </div>
          <div class="table_wrap">
            <el-table
              :data="yearSubsidyData"
              :height="tabHeight"
              v-loading="loading"
              border
              style="width:100%"
              :header-cell-style="{backgroundColor:'#e5e9f3'}"
            >
              <el-table-column type="index" label="序号" min-width="50"></el-table-column>
              <el-table-column label="姓名" min-width="150">
                <template slot-scope="scope">
                  <el-popover
                    trigger="click"
                    placement="top"
                    width="450"
                    @show="getUserInfo(scope.row.aid)"
                  >
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.name}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="性别" min-width="50">
                <template slot-scope="scope">
                  <span v-if="scope.row.gender === '0'">女</span>
                  <span v-else-if="scope.row.gender === '1'">男</span>
                  <span v-else></span>
                </template>
              </el-table-column>
              <el-table-column label="员工编号" min-width="120">
                <template slot-scope="scope">
                  <span>{{scope.row.aid}}</span>
                  <i class="el-icon-phone tbIconPhone"></i>
                </template>
              </el-table-column>
              <el-table-column
                prop="workAreaName"
                label="所属区域"
                min-width="160"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column prop="entryDate" label="入职日期" min-width="100">
                <template
                  slot-scope="scope"
                >{{scope.row.entryDate?scope.row.entryDate.split(' ')[0]:'--'}}</template>
              </el-table-column>
              <el-table-column prop="servicelen" label="工龄" min-width="80"></el-table-column>
              <el-table-column prop="servicelenAllowance" label="工龄补贴" min-width="80">
                <template slot-scope="scope">{{scope.row.servicelenAllowance|toThousands}}</template>
              </el-table-column>
              <el-table-column prop="batch" label="年月"></el-table-column>
              <el-table-column label="最后操作人" min-width="150">
                <template slot-scope="scope">
                  <el-popover
                    trigger="click"
                    placement="top"
                    width="450"
                    @show="getInfoForId(scope.row.updateUser)"
                    v-if="scope.row.updateUser"
                  >
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.updateUserName}}</el-button>
                    </div>
                  </el-popover>
                  <el-popover
                    trigger="click"
                    placement="top"
                    width="450"
                    @show="getInfoForId(scope.row.createUser)"
                    v-else
                  >
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.createUserName}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="updateTime" label="最后操作时间" min-width="160">
                <template slot-scope="scope">
                  <span v-if="scope.row.updateTime">{{scope.row.updateTime}}</span>
                  <span v-else>{{scope.row.createTime}}</span>
                </template>
              </el-table-column>
              <el-table-column label="提交状态" min-width="170">
                <template slot="header">
                  <el-select
                    v-model="yearSubmitValue"
                    filterable
                    placeholder="提交状态"
                    clearable
                    style="width:150px;"
                    @change="yearSubmitChange"
                    class="selectRepairIcon"
                  >
                    <el-option
                      v-for="item in bsubmitOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
                <template slot-scope="scope">
                  <span style="color:#EF3838;" v-if="scope.row.isConfirm=='0'">未提交</span>
                  <span v-if="scope.row.isConfirm=='1'">已提交</span>
                  <span style="color:#EF3838;" v-if="scope.row.isConfirm=='2'">
                    <el-tooltip
                      v-if="scope.row.reportMsg"
                      class="item"
                      effect="dark"
                      :content="scope.row.reportMsg"
                      placement="top"
                    >
                      <span>提交失败</span>
                    </el-tooltip>
                    <span v-else>提交失败</span>
                  </span>
                  <span v-if="scope.row.isConfirm=='3'">忽略提交</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" fixed="right" min-width="120">
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.row.isConfirm=='2'"
                    type="text"
                    size="small"
                    :disabled="yearDisabled"
                    @click="yearIgnoreSubmit(scope.row.id)"
                  >忽略提交</el-button>
                  <el-button
                    v-if="scope.row.isConfirm=='3'"
                    type="text"
                    size="small"
                    :disabled="yearDisabled"
                    @click="yearCancelIgnore(scope.row.id)"
                  >取消忽略</el-button>
                  <el-button v-if="scope.row.isConfirm=='1'" type="text" size="small" disabled>暂无操作</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div id="pagination">
              <el-pagination
                @size-change="yearHandleSizeChange"
                @current-change="yearHandlecurrentChange"
                background
                :current-page="yearCurrent"
                :page-sizes="[10,15,20,30,40]"
                :page-size="yearSize"
                layout="total,sizes,prev,pager,next,jumper"
                :total="yearTotal"
              ></el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <!-- ****************分割线**************** -->
        <el-tab-pane label="劳模补贴" name="seven">
          <div class="pull-left">
            <el-form :inline="true" :model="lmSearch" class="mar-no pull-left">
              <el-form-item label="所属区域">
                <el-select
                  clearable
                  v-model="lmSearch.placeSelect"
                  placeholder="所属区域"
                  class="adapteWidth"
                >
                  <el-option
                    v-for="item in areaOptions"
                    :key="item.areaId"
                    :label="item.areaName"
                    :value="item.areaId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="年月">
                <el-date-picker
                  v-model="lmSearch.month"
                  type="month"
                  class="width130"
                  value-format="yyyy-MM"
                  :editable="false"
                  :clearable="false"
                  placeholder="选择月份"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="姓名">
                <el-input
                  v-model="lmSearch.name"
                  @keyup.enter.native="JS_lmSearch"
                  clearable
                  placeholder="请输入名字"
                  class="width130"
                ></el-input>
              </el-form-item>
              <el-form-item label="员工编号">
                <el-input
                  v-model="lmSearch.staffNum"
                  @keyup.enter.native="JS_lmSearch"
                  clearable
                  placeholder="请输入编号"
                  class="width130"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="JS_lmSearch" icon="el-icon-search">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="pull-right">
            <el-dropdown @command="handleCommandLm" trigger="click">
              <el-button type="primary">
                更多操作
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="c" class="cloud-uploadBtn" :disabled="lmDisabled">
                  <i></i>&nbsp;导入
                </el-dropdown-item>
                <el-dropdown-item command="a" :disabled="lmDisabled" icon="el-icon-plus">新增</el-dropdown-item>
                <el-dropdown-item command="b" divided>
                  <i class="el-icon-refresh"></i>重置提交
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>&nbsp;
            <!-- <el-button size="small" slot="reference" @click="addlmSubsidy=true" icon="el-icon-plus" :disabled="lmDisabled">新增</el-button> -->
            <el-button
              size="small"
              type="danger"
              @click="update_lmSubsidy()"
              v-if="!lmDisabled"
            >上报数据</el-button>
            <el-button size="small" v-else @click="cancel_lmSubsidy()">取消上报</el-button>
          </div>
          <div class="table_wrap">
            <el-table
              :data="lmSubsidyData"
              :height="tabHeight"
              v-loading="loading"
              border
              style="width:100%"
              :header-cell-style="{backgroundColor:'#e5e9f3'}"
            >
              <el-table-column type="index" label="序号" min-width="50"></el-table-column>
              <el-table-column label="姓名" min-width="150">
                <template slot-scope="scope">
                  <el-popover
                    trigger="click"
                    placement="top"
                    width="450"
                    @show="getUserInfo(scope.row.aid)"
                  >
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.name}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="性别" min-width="50">
                <template slot-scope="scope">
                  <span v-if="scope.row.gender === '0'">女</span>
                  <span v-else-if="scope.row.gender === '1'">男</span>
                  <span v-else></span>
                </template>
              </el-table-column>
              <el-table-column label="员工编号" min-width="120">
                <template slot-scope="scope">
                  <span>{{scope.row.aid}}</span>
                  <i class="el-icon-phone tbIconPhone"></i>
                </template>
              </el-table-column>
              <el-table-column
                prop="employeeType"
                label="员工类型"
                min-width="120"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="workAreaName"
                label="所属区域"
                min-width="160"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column prop="modelworkerAllowance" label="劳模补贴" min-width="80">
                <template slot-scope="scope">{{scope.row.modelworkerAllowance|toThousands}}</template>
              </el-table-column>
              <el-table-column prop="batch" label="年月" min-width="70"></el-table-column>
              <el-table-column label="最后操作人" min-width="150">
                <template slot-scope="scope">
                  <el-popover
                    trigger="click"
                    placement="top"
                    width="450"
                    @show="getInfoForId(scope.row.updateUser)"
                    v-if="scope.row.updateUser"
                  >
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.updateUserName}}</el-button>
                    </div>
                  </el-popover>
                  <el-popover
                    trigger="click"
                    placement="top"
                    width="450"
                    @show="getInfoForId(scope.row.createUser)"
                    v-else
                  >
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.createUserName}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="updateTime" label="最后操作时间" min-width="160">
                <template slot-scope="scope">
                  <span v-if="scope.row.updateTime">{{scope.row.updateTime}}</span>
                  <span v-else>{{scope.row.createTime}}</span>
                </template>
              </el-table-column>
              <el-table-column label="提交状态" min-width="170">
                <template slot="header">
                  <el-select
                    v-model="lmSubmitValue"
                    filterable
                    placeholder="提交状态"
                    clearable
                    style="width:150px;"
                    @change="lmSubmitChange"
                    class="selectRepairIcon"
                  >
                    <el-option
                      v-for="item in bsubmitOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
                <template slot-scope="scope">
                  <span style="color:#EF3838;" v-if="scope.row.isConfirm=='0'">未提交</span>
                  <span v-if="scope.row.isConfirm=='1'">已提交</span>
                  <span style="color:#EF3838;" v-if="scope.row.isConfirm=='2'">
                    <el-tooltip
                      v-if="scope.row.reportMsg"
                      class="item"
                      effect="dark"
                      :content="scope.row.reportMsg"
                      placement="top"
                    >
                      <span>提交失败</span>
                    </el-tooltip>
                    <span v-else>提交失败</span>
                  </span>
                  <span v-if="scope.row.isConfirm=='3'">忽略提交</span>
                </template>
              </el-table-column>
              <el-table-column prop="operation" label="操作" fixed="right" min-width="220">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    :disabled="lmDisabled"
                    size="small"
                    @click="updateLm('/incomeModelWorkerAllowance',scope.row.id,'updatelmSubsidyform','updatelmSubsidy')"
                  >修改</el-button>
                  <el-button
                    class="deleteTxt"
                    type="text"
                    :disabled="lmDisabled"
                    size="small"
                    @click="deleteLm(scope.row.id)"
                  >删除</el-button>
                  <el-button
                    v-if="scope.row.isConfirm=='2'"
                    type="text"
                    size="small"
                    :disabled="lmDisabled"
                    @click="lmIgnoreSubmit(scope.row.id)"
                  >忽略提交</el-button>
                  <el-button
                    v-if="scope.row.isConfirm=='3'"
                    type="text"
                    size="small"
                    :disabled="lmDisabled"
                    @click="lmCancelIgnore(scope.row.id)"
                  >取消忽略</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div id="pagination">
              <el-pagination
                @size-change="lmHandleSizeChange"
                @current-change="lmHandlecurrentChange"
                background
                :current-page="lmCurrent"
                :page-sizes="[10,15,20,30,40]"
                :page-size="lmSize"
                layout="total,sizes,prev,pager,next,jumper"
                :total="lmTotal"
              ></el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <!-- ****************分割线**************111 -->
        <el-tab-pane label="中途岗位异动" name="eight">
          <div class="pull-left">
            <el-form :inline="true" :model="mvSearch" class="mar-no pull-left">
              <el-form-item label="姓名">
                <el-input
                  v-model="mvSearch.name"
                  @keyup.enter.native="JS_mvSearch"
                  clearable
                  placeholder="请输入名字"
                  class="width155"
                ></el-input>
              </el-form-item>
              <el-form-item label="年月">
                <el-date-picker
                  v-model="mvSearch.batch"
                  type="month"
                  class="width155"
                  value-format="yyyy-MM"
                  :editable="false"
                  :clearable="false"
                  placeholder="年月"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="员工编号">
                <el-input
                  v-model="mvSearch.staffNum"
                  @keyup.enter.native="JS_mvSearch"
                  clearable
                  placeholder="请输入编号"
                  class="width155"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="JS_mvSearch" icon="el-icon-search">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="pull-right">
            <el-dropdown @command="handleCommandMv" trigger="click">
              <el-button type="primary">
                更多操作
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="c" class="cloud-uploadBtn" :disabled="mvDisabled">
                  <i></i>&nbsp;导入
                </el-dropdown-item>
                <el-dropdown-item command="a" :disabled="mvDisabled" icon="el-icon-plus" divided>新增</el-dropdown-item>
                <el-dropdown-item command="b" divided>
                  <i class="el-icon-refresh"></i>重置提交
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>&nbsp;
            <!-- <el-button size="small" slot="reference" icon="el-icon-plus" @click="addmvSubsidy=true" :disabled="mvDisabled">新增</el-button> -->
            <el-button
              size="small"
              type="danger"
              @click="update_mvSubsidy()"
              v-if="!mvDisabled"
            >上报数据</el-button>
            <el-button size="small" v-else @click="cancel_mvSubsidy()">取消上报</el-button>
          </div>
          <div class="table_wrap">
            <el-table
              :data="mvSubsidyData"
              :height="tabHeight"
              v-loading="loading"
              border
              style="width:100%"
              :header-cell-style="{backgroundColor:'#e5e9f3'}"
            >
              <el-table-column label="姓名" min-width="150">
                <template slot-scope="scope">
                  <el-popover
                    trigger="click"
                    placement="top"
                    width="450"
                    @show="getUserInfo(scope.row.aid)"
                  >
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
                  <span>{{scope.row.aid}}</span>
                  <i class="el-icon-phone tbIconPhone"></i>
                </template>
              </el-table-column>
              <el-table-column prop="prePost" label="异动前岗位" min-width="120" show-overflow-tooltip></el-table-column>
              <el-table-column prop="afterPost" label="异动后岗位" min-width="120" show-overflow-tooltip></el-table-column>
              <el-table-column prop="preSalary" label="异动前工资" min-width="100">
                <template slot-scope="scope">{{scope.row.preSalary|toThousands}}</template>
              </el-table-column>
              <el-table-column prop="afterSalary" label="异动后工资" min-width="100">
                <template slot-scope="scope">{{scope.row.afterSalary|toThousands}}</template>
              </el-table-column>
              <el-table-column prop="preAttendance" label="异动前工作小时" min-width="120"></el-table-column>
              <el-table-column prop="afterAttendance" label="异动后工作小时" min-width="120"></el-table-column>
              <el-table-column prop="comprehensivSalary" label="异动前后加权计算综合工资" min-width="100">
                <template slot-scope="scope">{{scope.row.comprehensivSalary|toThousands}}</template>
              </el-table-column>
              <el-table-column prop="adjustmentTime" label="异动时间" min-width="100"></el-table-column>
              <el-table-column label="最后操作人" min-width="150">
                <template slot-scope="scope">
                  <el-popover
                    trigger="click"
                    placement="top"
                    width="450"
                    @show="getInfoForId(scope.row.updateUser)"
                    v-if="scope.row.updateUser"
                  >
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.updateUserName}}</el-button>
                    </div>
                  </el-popover>
                  <el-popover
                    trigger="click"
                    placement="top"
                    width="450"
                    @show="getInfoForId(scope.row.createUser)"
                    v-else
                  >
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.createUserName}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="updateTime" label="最后操作时间" min-width="160"></el-table-column>
              <el-table-column label="提交状态" min-width="170">
                <template slot="header">
                  <el-select
                    v-model="mvSubmitValue"
                    filterable
                    placeholder="提交状态"
                    clearable
                    style="width:150px;"
                    @change="mvSubmitChange"
                    class="selectRepairIcon"
                  >
                    <el-option
                      v-for="item in bsubmitOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
                <template slot-scope="scope">
                  <span style="color:#EF3838;" v-if="scope.row.isConfirm=='0'">未提交</span>
                  <span v-if="scope.row.isConfirm=='1'">已提交</span>
                  <span style="color:#EF3838;" v-if="scope.row.isConfirm=='2'">
                    <el-tooltip
                      v-if="scope.row.reportMsg"
                      class="item"
                      effect="dark"
                      :content="scope.row.reportMsg"
                      placement="top"
                    >
                      <span>提交失败</span>
                    </el-tooltip>
                    <span v-else>提交失败</span>
                  </span>
                  <span v-if="scope.row.isConfirm=='3'">忽略提交</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" fixed="right" min-width="220">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    :disabled="mvDisabled"
                    @click="updateMv(scope.row.id)"
                  >修改</el-button>
                  <el-button
                    class="deleteTxt"
                    type="text"
                    :disabled="mvDisabled"
                    size="small"
                    @click="deleteMv(scope.row.id)"
                  >删除</el-button>
                  <el-button
                    v-if="scope.row.isConfirm=='2'"
                    type="text"
                    size="small"
                    :disabled="mvDisabled"
                    @click="mvIgnoreSubmit(scope.row.id)"
                  >忽略提交</el-button>
                  <el-button
                    v-if="scope.row.isConfirm=='3'"
                    type="text"
                    size="small"
                    :disabled="mvDisabled"
                    @click="mvCancelIgnore(scope.row.id)"
                  >取消忽略</el-button>
                </template>
              </el-table-column>

              <!-- <el-button size="small" @click="initMealSubsidy()" :disabled="mealDisabled">初始化数据</el-button>
              <el-button size="small" slot="reference" @click="addMealSubsidy=true" icon="el-icon-plus" :disabled="mealDisabled">新增</el-button>
              <el-button size="small" type="danger" @click="JS_submit" v-if="!mealDisabled">上报数据</el-button>
              <el-button size="small" v-else>取消上报</el-button>
              <el-table-column prop="operation" label="操作" fixed="right" width="60" v-if="mealDisabled">
                <template>
                  <el-button type="text" disabled size="small">修改</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="operation" label="操作" fixed="right" width="60" v-else>
                <template slot-scope="scope">
                  <el-button type="text" :disabled="scope.row.isConfirm==1?true:false" size="small" @click="updateLm('/incomeBoardAllowance',scope.row.id,'updateMealSubsidyform','updateMealSubsidy')">修改</el-button>
                </template>
              </el-table-column>-->
            </el-table>
            <!-- 分页 -->
            <div id="pagination">
              <el-pagination
                @size-change="mvHandleSizeChange"
                @current-change="mvHandlecurrentChange"
                background
                :current-page="mvCurrent"
                :page-sizes="[10,15,20,30,40]"
                :page-size="mvSize"
                layout="total,sizes,prev,pager,next,jumper"
                :total="mvTotal"
              ></el-pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 新增餐补弹框 -->
    <el-dialog
      title="新增餐补人员"
      :close-on-click-modal="false"
      :visible.sync="addMealSubsidy"
      :before-close="mealDialogClose"
      width="768px"
    >
      <el-row class="textLft">
        <el-form
          :model="addMealSubsidyform"
          :rules="addMealSubsidyformRule"
          ref="addMealSubsidyform"
          label-width="150px"
        >
          <el-col :md="18">
            <el-form-item label="员工编号：" prop="aid">
              <el-input-number
                :controls="false"
                :disabled="aidChangeFlag"
                v-model="addMealSubsidyform.aid"
                style="width:380px"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :md="6">
            <el-button
              type="primary"
              style="margin-left:10px"
              icon="el-icon-search"
              @click="aidSearch('addMealSubsidyform')"
            >搜索</el-button>
            <el-button
              type="primary"
              style="margin-left:10px"
              @click="reset('addMealSubsidyform')"
            >重置</el-button>
          </el-col>
          <el-col :md="12">
            <el-form-item label="性别：" prop="gender">
              <el-select :disabled="true" placeholder="性别" v-model="addMealSubsidyform.gender">
                <el-option label="女" key="0" value="0"></el-option>
                <el-option label="男" key="1" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- &&&&&&& -->
          <el-col :md="12">
            <el-form-item label="姓名：" prop="name">
              <el-input :disabled="true" v-model="addMealSubsidyform.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="所属区域：" prop="workAreaName">
              <el-select
                :disabled="true"
                v-model="addMealSubsidyform.workAreaName"
                placeholder="所属区域"
              >
                <el-option
                  v-for="item in areaOptions"
                  :key="item.areaId"
                  :label="item.areaName"
                  :value="item.areaId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="员工类型：" prop="hrType">
              <el-select
                :disabled="true"
                v-model="addMealSubsidyform.employeeTypeId"
                placeholder="员工类型"
              >
                <el-option
                  v-for="item in hrTypeOptions"
                  :key="item.employeeTypeId"
                  :label="item.hrTypeName"
                  :value="item.hrTypeKey"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="餐补：" prop="boardAllowance">
              <el-input-number
                v-model="addMealSubsidyform.boardAllowance"
                style="width:214px"
                :controls="false"
                :min="0"
                :max="100000"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="年月：" prop="batch">
              <el-date-picker
                v-model="addMealSubsidyform.batch"
                type="month"
                style="width:214px"
                value-format="yyyy-MM"
                placeholder="选择年月"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="mealDialogClose()">取消</el-button>
        <el-button type="primary" @click="lm_add_save('addMealSubsidyform')">保存</el-button>
      </span>
    </el-dialog>
    <!-- 修改餐补人员 -->
    <el-dialog
      title="修改餐补人员"
      :close-on-click-modal="false"
      :visible.sync="updateMealSubsidy"
      width="768px"
    >
      <el-row class="textLft">
        <el-form
          :model="updateMealSubsidyform"
          :rules="updateMealSubsidyformRule"
          ref="updateMealSubsidyform"
          label-width="150px"
        >
          <el-col :md="12">
            <el-form-item label="员工编号：" prop="aid">
              <el-input :disabled="true" v-model="updateMealSubsidyform.aid"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="性别：" prop="gender">
              <el-select :disabled="true" placeholder="性别" v-model="updateMealSubsidyform.gender">
                <el-option label="女" key="0" value="0"></el-option>
                <el-option label="男" key="1" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="姓名：" prop="name">
              <el-input :disabled="true" v-model="updateMealSubsidyform.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="所属区域：" prop="workAreaName">
              <el-select
                :disabled="true"
                ref="areaRef"
                v-model="updateMealSubsidyform.workAreaName"
                placeholder="所属区域"
              >
                <el-option
                  v-for="item in areaOptions"
                  :key="item.areaId"
                  :label="item.areaName"
                  :value="item.areaId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="员工类型：" prop="employeeType">
              <el-select
                :disabled="true"
                ref="employeeTypeRef"
                v-model="updateMealSubsidyform.employeeType"
                placeholder="员工类型"
              >
                <el-option
                  v-for="item in hrTypeOptions"
                  :key="item.hrTypeKey"
                  :label="item.hrTypeName"
                  :value="item.hrTypeKey"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="年月：" prop="batch">
              <el-date-picker
                disabled
                v-model="updateMealSubsidyform.batch"
                type="month"
                style="width:214px"
                value-format="yyyy-MM"
                placeholder="选择年月"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="餐补：" prop="boardAllowance">
              <el-input-number
                v-model="updateMealSubsidyform.boardAllowance"
                :controls="false"
                :min="0"
                :max="100000"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateMealSubsidy = false">取消</el-button>
        <el-button
          type="primary"
          @click="update_save('/incomeBoardAllowance','updateMealSubsidyform','updateMealSubsidy','mealSubsidySearch')"
        >保存</el-button>
      </span>
    </el-dialog>

    <!-- 新增租房弹框 -->
    <el-dialog
      title="新增租房补贴"
      :close-on-click-modal="false"
      :visible.sync="addhsSubsidy"
      width="768px"
      :before-close="hsDialogClose"
    >
      <el-row class="textLft">
        <el-form
          :model="addhsSubsidyform"
          :rules="addhsSubsidyformRule"
          ref="addhsSubsidyform"
          label-width="150px"
        >
          <el-col :md="18">
            <el-form-item label="员工编号：" prop="aid">
              <el-input-number
                :controls="false"
                :disabled="aidChangeFlag"
                v-model="addhsSubsidyform.aid"
                style="width:380px"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :md="6">
            <el-button
              type="primary"
              style="margin-left:10px"
              icon="el-icon-search"
              @click="aidSearch('addhsSubsidyform')"
            >搜索</el-button>
            <el-button type="primary" style="margin-left:10px" @click="reset('addhsSubsidyform')">重置</el-button>
          </el-col>
          <el-col :md="12">
            <el-form-item label="性别：" prop="gender">
              <el-select :disabled="true" placeholder="性别" v-model="addhsSubsidyform.gender">
                <el-option label="女" key="0" value="0"></el-option>
                <el-option label="男" key="1" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- &&&&&&& -->
          <el-col :md="12">
            <el-form-item label="姓名：" prop="name">
              <el-input :disabled="true" v-model="addhsSubsidyform.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="所属区域：" prop="workAreaName">
              <el-select
                :disabled="true"
                v-model="addhsSubsidyform.workAreaName"
                placeholder="所属区域"
              >
                <el-option
                  v-for="item in areaOptions"
                  :key="item.areaId"
                  :label="item.areaName"
                  :value="item.areaId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="员工类型：" prop="employeeType">
              <el-select
                :disabled="true"
                v-model="addhsSubsidyform.employeeType"
                placeholder="员工类型"
              >
                <el-option
                  v-for="item in hrTypeOptions"
                  :key="item.hrTypeKey"
                  :label="item.hrTypeName"
                  :value="item.hrTypeKey"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="租房补贴：" prop="rentAllowance">
              <el-input-number
                :controls="false"
                v-model="addhsSubsidyform.rentAllowance"
                style="width:214px"
                :min="0"
                :max="100000"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="年月：" prop="batch">
              <el-date-picker
                v-model="addhsSubsidyform.batch"
                type="month"
                style="width:214px"
                value-format="yyyy-MM"
                placeholder="选择年月"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addhsSubsidy = false">取消</el-button>
        <el-button type="primary" @click="lm_add_save('addhsSubsidyform')">保存</el-button>
      </span>
    </el-dialog>
    <!-- 修改租房补贴 -->
    <el-dialog
      title="修改租房补贴"
      :close-on-click-modal="false"
      :visible.sync="updatehsSubsidy"
      width="768px"
    >
      <el-row class="textLft">
        <el-form
          :model="updatehsSubsidyform"
          :rules="updatehsSubsidyformRule"
          ref="updatehsSubsidyform"
          label-width="150px"
        >
          <el-col :md="12">
            <el-form-item label="员工编号：" prop="aid">
              <el-input :disabled="true" v-model="updatehsSubsidyform.aid"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="性别：" prop="gender">
              <el-select :disabled="true" placeholder="性别" v-model="updatehsSubsidyform.gender">
                <el-option label="女" key="0" value="0"></el-option>
                <el-option label="男" key="1" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="姓名：" prop="name">
              <el-input :disabled="true" v-model="updatehsSubsidyform.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="所属区域：" prop="workAreaName">
              <el-select
                :disabled="true"
                ref="areaRef"
                v-model="updatehsSubsidyform.workAreaName"
                placeholder="所属区域"
              >
                <el-option
                  v-for="item in areaOptions"
                  :key="item.areaId"
                  :label="item.areaName"
                  :value="item.areaId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="员工类型：" prop="employeeType">
              <el-select
                :disabled="true"
                ref="employeeTypeRef"
                v-model="updatehsSubsidyform.employeeType"
                placeholder="员工类型"
              >
                <el-option
                  v-for="item in hrTypeOptions"
                  :key="item.hrTypeKey"
                  :label="item.hrTypeName"
                  :value="item.hrTypeKey"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="年月：" prop="batch">
              <el-date-picker
                disabled
                v-model="updatehsSubsidyform.batch"
                type="month"
                style="width:214px"
                value-format="yyyy-MM"
                placeholder="选择年月"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="租房补贴：" prop="rentAllowance">
              <el-input-number
                v-model="updatehsSubsidyform.rentAllowance"
                :controls="false"
                :min="0"
                :max="100000"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updatehsSubsidy = false">取消</el-button>
        <el-button
          type="primary"
          @click="update_save('/incomeRentAllowance','updatehsSubsidyform','updatehsSubsidy','hsSubsidySearch')"
        >保存</el-button>
      </span>
    </el-dialog>

    <!-- 新增社保补贴 -->
    <el-dialog
      title="新增社保补贴"
      :close-on-click-modal="false"
      :visible.sync="addsocialSubsidy"
      width="768px"
      :before-close="socialDialogClose"
    >
      <el-row class="textLft">
        <el-form
          :model="addsocialSubsidyform"
          :rules="addsocialSubsidyformRule"
          ref="addsocialSubsidyform"
          label-width="150px"
        >
          <el-col :md="18">
            <el-form-item label="员工编号：" prop="aid">
              <el-input-number
                :controls="false"
                :disabled="aidChangeFlag"
                v-model="addsocialSubsidyform.aid"
                style="width:380px"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :md="6">
            <el-button
              type="primary"
              style="margin-left:10px"
              icon="el-icon-search"
              @click="aidSearch('addsocialSubsidyform')"
            >搜索</el-button>
            <el-button
              type="primary"
              style="margin-left:10px"
              @click="reset('addsocialSubsidyform')"
            >重置</el-button>
          </el-col>
          <el-col :md="12">
            <el-form-item label="性别：" prop="gender">
              <el-select :disabled="true" placeholder="性别" v-model="addsocialSubsidyform.gender">
                <el-option label="女" key="0" value="0"></el-option>
                <el-option label="男" key="1" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- &&&&&&& -->
          <el-col :md="12">
            <el-form-item label="姓名：" prop="name">
              <el-input :disabled="true" v-model="addsocialSubsidyform.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="所属区域：" prop="workAreaName">
              <el-select
                :disabled="true"
                v-model="addsocialSubsidyform.workAreaName"
                placeholder="所属区域"
              >
                <el-option
                  v-for="item in areaOptions"
                  :key="item.areaId"
                  :label="item.areaName"
                  :value="item.areaId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="员工类型：" prop="employeeType">
              <el-select
                :disabled="true"
                v-model="addsocialSubsidyform.employeeType"
                placeholder="员工类型"
              >
                <el-option
                  v-for="item in hrTypeOptions"
                  :key="item.hrTypeKey"
                  :label="item.hrTypeName"
                  :value="item.hrTypeKey"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="社保补贴：" prop="socialAllowance">
              <el-input-number
                :controls="false"
                v-model="addsocialSubsidyform.socialAllowance"
                style="width:214px"
                :min="0"
                :max="100000"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="年月：" prop="batch">
              <el-date-picker
                v-model="addsocialSubsidyform.batch"
                type="month"
                style="width:214px"
                value-format="yyyy-MM"
                placeholder="选择年月"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addsocialSubsidy = false">取消</el-button>
        <el-button type="primary" @click="lm_add_save('addsocialSubsidyform')">保存</el-button>
      </span>
    </el-dialog>
    <!-- 修改社保补贴 -->
    <el-dialog
      title="修改社保补贴"
      :close-on-click-modal="false"
      :visible.sync="updatesocialSubsidy"
      width="768px"
    >
      <el-row class="textLft">
        <el-form
          :model="updatesocialSubsidyform"
          :rules="updatesocialSubsidyformRule"
          ref="updatesocialSubsidyform"
          label-width="150px"
        >
          <el-col :md="12">
            <el-form-item label="员工编号：" prop="aid">
              <el-input :disabled="true" v-model="updatesocialSubsidyform.aid"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="性别：" prop="gender">
              <el-select :disabled="true" placeholder="性别" v-model="updatesocialSubsidyform.gender">
                <el-option label="女" key="0" value="0"></el-option>
                <el-option label="男" key="1" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="姓名：" prop="name">
              <el-input :disabled="true" v-model="updatesocialSubsidyform.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="所属区域：" prop="workAreaName">
              <el-select
                :disabled="true"
                ref="areaRef"
                v-model="updatesocialSubsidyform.workAreaName"
                placeholder="所属区域"
              >
                <el-option
                  v-for="item in areaOptions"
                  :key="item.areaId"
                  :label="item.areaName"
                  :value="item.areaId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="员工类型：" prop="employeeType">
              <el-select
                :disabled="true"
                ref="employeeTypeRef"
                v-model="updatesocialSubsidyform.employeeType"
                placeholder="员工类型"
              >
                <el-option
                  v-for="item in hrTypeOptions"
                  :key="item.hrTypeKey"
                  :label="item.hrTypeName"
                  :value="item.hrTypeKey"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="年月：" prop="batch">
              <el-date-picker
                disabled
                v-model="updatesocialSubsidyform.batch"
                type="month"
                style="width:214px"
                value-format="yyyy-MM"
                placeholder="选择年月"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="社保补贴：" prop="socialAllowance">
              <el-input-number
                v-model="updatesocialSubsidyform.socialAllowance"
                :controls="false"
                :min="0"
                :max="100000"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updatesocialSubsidy = false">取消</el-button>
        <el-button
          type="primary"
          @click="update_save('/incomeSocialAllowance','updatesocialSubsidyform','updatesocialSubsidy','socialSubsidySearch')"
        >保存</el-button>
      </span>
    </el-dialog>

    <!-- 新增学历补贴-->
    <el-dialog
      title="新增学历补贴"
      :close-on-click-modal="false"
      :before-close="eduDialogClose"
      :visible.sync="addeduSubsidy"
      width="768px"
    >
      <el-row class="textLft">
        <el-form
          :model="addeduSubsidyform"
          :rules="addeduSubsidyformRule"
          ref="addeduSubsidyform"
          label-width="150px"
        >
          <el-col :md="18">
            <el-form-item label="员工编号：" prop="aid">
              <el-input-number
                :controls="false"
                :disabled="aidChangeFlag"
                v-model="addeduSubsidyform.aid"
                style="width:380px"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :md="6">
            <el-button
              type="primary"
              style="margin-left:10px"
              icon="el-icon-search"
              @click="aidSearch('addeduSubsidyform')"
            >搜索</el-button>
            <el-button
              type="primary"
              style="margin-left:10px"
              @click="reset('addeduSubsidyform')"
            >重置</el-button>
          </el-col>
          <el-col :md="12">
            <el-form-item label="性别：" prop="gender">
              <el-select :disabled="true" placeholder="性别" v-model="addeduSubsidyform.gender">
                <el-option label="女" key="0" value="0"></el-option>
                <el-option label="男" key="1" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- &&&&&&& -->
          <el-col :md="12">
            <el-form-item label="姓名：" prop="name">
              <el-input :disabled="true" v-model="addeduSubsidyform.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="所属区域：" prop="workAreaName">
              <el-select
                :disabled="true"
                v-model="addeduSubsidyform.workAreaName"
                placeholder="所属区域"
              >
                <el-option
                  v-for="item in areaOptions"
                  :key="item.areaId"
                  :label="item.areaName"
                  :value="item.areaId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="员工类型：" prop="employeeType">
              <el-select
                :disabled="true"
                v-model="addeduSubsidyform.employeeType"
                placeholder="员工类型"
              >
                <el-option
                  v-for="item in hrTypeOptions"
                  :key="item.hrTypeKey"
                  :label="item.hrTypeName"
                  :value="item.hrTypeKey"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="学历补贴：" prop="educationAllowance">
              <el-input-number
                :controls="false"
                v-model="addeduSubsidyform.educationAllowance"
                style="width:214px"
                :min="0"
                :max="100000"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="年月：" prop="batch">
              <el-date-picker
                v-model="addeduSubsidyform.batch"
                type="month"
                style="width:214px"
                value-format="yyyy-MM"
                placeholder="选择年月"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addeduSubsidy = false">取消</el-button>
        <el-button type="primary" @click="lm_add_save('addeduSubsidyform')">保存</el-button>
      </span>
    </el-dialog>
    <!-- 修改学历补贴 -->
    <el-dialog
      title="修改学历补贴"
      :close-on-click-modal="false"
      :visible.sync="updateeduSubsidy"
      width="768px"
    >
      <el-row class="textLft">
        <el-form
          :model="updateeduSubsidyform"
          :rules="updateeduSubsidyformRule"
          ref="updateeduSubsidyform"
          label-width="150px"
        >
          <el-col :md="12">
            <el-form-item label="员工编号：" prop="aid">
              <el-input :disabled="true" v-model="updateeduSubsidyform.aid"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="性别：" prop="gender">
              <el-select :disabled="true" placeholder="性别" v-model="updateeduSubsidyform.gender">
                <el-option label="女" key="0" value="0"></el-option>
                <el-option label="男" key="1" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="姓名：" prop="name">
              <el-input :disabled="true" v-model="updateeduSubsidyform.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="所属区域：" prop="workAreaName">
              <el-select
                :disabled="true"
                ref="areaRef"
                v-model="updateeduSubsidyform.workAreaName"
                placeholder="所属区域"
              >
                <el-option
                  v-for="item in areaOptions"
                  :key="item.areaId"
                  :label="item.areaName"
                  :value="item.areaId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="员工类型：" prop="employeeType">
              <el-select
                :disabled="true"
                ref="employeeTypeRef"
                v-model="updateeduSubsidyform.employeeType"
                placeholder="员工类型"
              >
                <el-option
                  v-for="item in hrTypeOptions"
                  :key="item.hrTypeKey"
                  :label="item.hrTypeName"
                  :value="item.hrTypeKey"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="年月：" prop="batch">
              <el-date-picker
                disabled
                v-model="updateeduSubsidyform.batch"
                type="month"
                style="width:214px"
                value-format="yyyy-MM"
                placeholder="选择年月"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="学历补贴：" prop="educationAllowance">
              <el-input-number
                v-model="updateeduSubsidyform.educationAllowance"
                :controls="false"
                :min="0"
                :max="100000"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateeduSubsidy = false">取消</el-button>
        <el-button
          type="primary"
          @click="update_save('/incomeEducationAllowance','updateeduSubsidyform','updateeduSubsidy','eduSubsidySearch')"
        >保存</el-button>
      </span>
    </el-dialog>
    <!-- 工龄 更多查询  -->
    <el-dialog
      title="更多查询"
      :close-on-click-modal="false"
      :visible.sync="search_more_year"
      width="650px"
    >
      <el-form :inline="true" :model="yearMoreSearch" class="mar-no" label-width="120px">
        <el-form-item label="姓名">
          <el-input
            v-model.trim="yearMoreSearch.name"
            placeholder="请输入名字"
            class="width155"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="员工编号">
          <el-input-number
            v-model="yearMoreSearch.staffNum"
            placeholder="请输入编号"
            class="width155"
            :controls="false"
            :min="0"
            :max="10000000000"
            clearable
          ></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="search_more_year = false">取消</el-button>
        <el-button type="primary" @click="JS_yearSearch(),search_more_year = false">立即搜索</el-button>
      </span>
    </el-dialog>
    <!-- 新增劳模补贴 -->
    <el-dialog
      title="新增劳模补贴"
      :close-on-click-modal="false"
      :visible.sync="addlmSubsidy"
      width="768px"
      :before-close="lmDialogClose"
    >
      <el-row class="textLft">
        <el-form
          :model="addlmSubsidyform"
          :rules="addlmSubsidyformRule"
          ref="addlmSubsidyform"
          label-width="150px"
        >
          <el-col :md="18">
            <el-form-item label="员工编号：" prop="aid">
              <el-input-number
                :controls="false"
                :disabled="aidChangeFlag"
                v-model="addlmSubsidyform.aid"
                style="width:380px"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :md="6">
            <el-button
              type="primary"
              style="margin-left:10px"
              icon="el-icon-search"
              @click="aidSearch('addlmSubsidyform')"
            >搜索</el-button>
            <el-button type="primary" style="margin-left:10px" @click="reset('addlmSubsidyform')">重置</el-button>
          </el-col>
          <el-col :md="12">
            <el-form-item label="性别：" prop="gender">
              <el-select :disabled="true" placeholder="性别" v-model="addlmSubsidyform.gender">
                <el-option label="女" key="0" value="0"></el-option>
                <el-option label="男" key="1" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- &&&&&&& -->
          <el-col :md="12">
            <el-form-item label="姓名：" prop="name">
              <el-input :disabled="true" v-model="addlmSubsidyform.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="所属区域：" prop="workAreaName">
              <el-select
                :disabled="true"
                v-model="addlmSubsidyform.workAreaName"
                placeholder="所属区域"
              >
                <el-option
                  v-for="item in areaOptions"
                  :key="item.areaId"
                  :label="item.areaName"
                  :value="item.areaId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="员工类型：" prop="employeeType">
              <el-select
                :disabled="true"
                v-model="addlmSubsidyform.employeeType"
                placeholder="员工类型"
              >
                <el-option
                  v-for="item in hrTypeOptions"
                  :key="item.hrTypeKey"
                  :label="item.hrTypeName"
                  :value="item.hrTypeKey"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="劳模补贴：" prop="modelworkerAllowance">
              <el-input-number
                :controls="false"
                v-model="addlmSubsidyform.modelworkerAllowance"
                style="width:214px"
                :min="0"
                :max="100000"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="年月：" prop="batch">
              <!-- <el-date-picker v-model="addlmSubsidyform.batch" type="month" style="width:214px" value-format="yyyy-MM" placeholder="选择年月" :picker-options="pickerOptions1"> -->
              <el-date-picker
                v-model="addlmSubsidyform.batch"
                type="month"
                style="width:214px"
                value-format="yyyy-MM"
                placeholder="选择年月"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addlmSubsidy = false">取消</el-button>
        <el-button type="primary" @click="lm_add_save('addlmSubsidyform')">保存</el-button>
      </span>
    </el-dialog>
    <!-- 修改劳模补贴 -->
    <el-dialog
      title="修改劳模补贴"
      :close-on-click-modal="false"
      :visible.sync="updatelmSubsidy"
      width="768px"
    >
      <el-row class="textLft">
        <el-form
          :model="updatelmSubsidyform"
          :rules="updatelmSubsidyformRule"
          ref="updatelmSubsidyform"
          label-width="150px"
        >
          <el-col :md="12">
            <el-form-item label="员工编号：" prop="aid">
              <el-input :disabled="true" v-model="updatelmSubsidyform.aid"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="性别：" prop="gender">
              <el-select :disabled="true" placeholder="性别" v-model="updatelmSubsidyform.gender">
                <el-option label="女" key="0" value="0"></el-option>
                <el-option label="男" key="1" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="姓名：" prop="name">
              <el-input :disabled="true" v-model="updatelmSubsidyform.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="所属区域：" prop="workAreaName">
              <el-select
                :disabled="true"
                ref="areaRef"
                v-model="updatelmSubsidyform.workAreaName"
                placeholder="所属区域"
              >
                <el-option
                  v-for="item in areaOptions"
                  :key="item.areaId"
                  :label="item.areaName"
                  :value="item.areaId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="员工类型：" prop="employeeType">
              <el-select
                :disabled="true"
                ref="employeeTypeRef"
                v-model="updatelmSubsidyform.employeeType"
                placeholder="员工类型"
              >
                <el-option
                  v-for="item in hrTypeOptions"
                  :key="item.hrTypeKey"
                  :label="item.hrTypeName"
                  :value="item.hrTypeKey"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="年月：" prop="batch">
              <el-date-picker
                disabled
                v-model="updatelmSubsidyform.batch"
                type="month"
                style="width:214px"
                value-format="yyyy-MM"
                placeholder="选择年月"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="劳模补贴：" prop="modelworkerAllowance">
              <el-input-number
                v-model="updatelmSubsidyform.modelworkerAllowance"
                :controls="false"
                :min="0"
                :max="100000"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updatelmSubsidy = false">取消</el-button>
        <el-button
          type="primary"
          @click="update_save('/incomeModelWorkerAllowance','updatelmSubsidyform','updatelmSubsidy','lmSubsidySearch')"
        >保存</el-button>
      </span>
    </el-dialog>

    <!-- 新增中途岗位异动数据 -->
    <el-dialog
      title="新增中途岗位异动数据"
      :close-on-click-modal="false"
      :visible.sync="addmvSubsidy"
      width="768px"
      :before-close="mvDialogClose"
    >
      <el-row class="textLft">
        <el-form
          :model="mvSubsidyform"
          :rules="mvSubsidyformRule"
          ref="mvSubsidyform"
          label-width="150px"
        >
          <el-col :md="18">
            <el-form-item label="员工编号：" prop="aid">
              <el-input-number
                :controls="false"
                :disabled="aidChangeFlag"
                v-model="mvSubsidyform.aid"
                style="width:380px"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :md="6">
            <el-button
              type="primary"
              style="margin-left:10px"
              icon="el-icon-search"
              @click="mvAidSearch()"
            >搜索</el-button>
            <el-button type="primary" style="margin-left:10px" @click="reset('mvSubsidyform')">重置</el-button>
          </el-col>
          <el-col :md="12">
            <el-form-item label="性别：" prop="gender">
              <el-select :disabled="true" placeholder="性别" v-model="mvSubsidyform.gender">
                <el-option label="女" key="0" value="0"></el-option>
                <el-option label="男" key="1" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="姓名：" prop="name">
              <el-input :disabled="true" v-model="mvSubsidyform.name" style="width:215px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="异动时间：" prop="adjustmentTime">
              <el-date-picker
                type="date"
                placeholder="选择时间"
                v-model="mvSubsidyform.adjustmentTime"
                value-format="yyyy-MM-dd"
                style="width:215px"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="异动前区域：" prop="preWorkAreaId">
              <el-select
                ref="areaPre"
                v-model="mvSubsidyform.preWorkAreaId"
                placeholder="选择区域"
                filterable
              >
                <el-option
                  v-for="item in areaOptions"
                  :key="item.areaId"
                  :label="item.areaName"
                  :value="item.areaId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="异动后区域：" prop="afterWorkAreaId">
              <el-select
                ref="areaAfter"
                v-model="mvSubsidyform.afterWorkAreaId"
                placeholder="选择区域"
                filterable
              >
                <el-option
                  v-for="item in areaOptions"
                  :key="item.areaId"
                  :label="item.areaName"
                  :value="item.areaId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="异动前岗位：" prop="prePost">
              <el-input v-model="mvSubsidyform.prePost" style="width:215px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="异动后岗位：" prop="afterPost">
              <el-input v-model="mvSubsidyform.afterPost" style="width:215px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="异动前工资：" prop="preSalary">
              <el-input-number
                :controls="false"
                v-model="mvSubsidyform.preSalary"
                style="width:215px"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="异动后工资：" prop="afterSalary">
              <el-input-number
                :controls="false"
                v-model="mvSubsidyform.afterSalary"
                style="width:215px"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="异动前工作小时：" prop="preAttendance">
              <el-input-number
                :controls="false"
                v-model="mvSubsidyform.preAttendance"
                style="width:215px"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="异动后工作小时：" prop="afterAttendance">
              <el-input-number
                :controls="false"
                v-model="mvSubsidyform.afterAttendance"
                style="width:215px"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :md="10">
            <el-form-item label="异动前后加权计算综合工资：" prop="comprehensivSalary" class="longTxt">
              <el-input-number
                :controls="false"
                v-model="mvSubsidyform.comprehensivSalary"
                style="width:150px"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :md="2">
            <el-button type="primary" style="margin-left:10px" @click="count()">计算</el-button>
          </el-col>
          <el-col :md="12">
            <el-form-item label="年月：" prop="batch">
              <el-date-picker
                v-model="mvSubsidyform.batch"
                type="month"
                style="width:214px"
                value-format="yyyy-MM"
                placeholder="选择年月"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="mvDialogClose()">取消</el-button>
        <el-button type="primary" @click="mv_add_save('mvSubsidyform')" :disabled="mvAddSaveFlag">保存</el-button>
      </span>
    </el-dialog>
    <!-- 修改中途岗位异动数据 -->
    <el-dialog
      title="修改中途岗位异动数据"
      :close-on-click-modal="false"
      :visible.sync="updateMvSubsidy"
      width="768px"
    >
      <el-row class="textLft">
        <el-form
          :model="updateMvSubsidyform"
          :rules="updateMvSubsidyformRule"
          ref="updateMvSubsidyform"
          label-width="150px"
        >
          <el-col :md="18">
            <el-form-item label="员工编号：" prop="aid">
              <el-input-number
                :controls="false"
                :disabled="true"
                v-model="updateMvSubsidyform.aid"
                style="width:380px"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="性别：" prop="gender">
              <el-select :disabled="true" placeholder="性别" v-model="updateMvSubsidyform.gender">
                <el-option label="女" key="0" value="0"></el-option>
                <el-option label="男" key="1" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="姓名：" prop="name">
              <el-input :disabled="true" v-model="updateMvSubsidyform.name" style="width:215px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="异动时间：" prop="adjustmentTime">
              <el-date-picker
                type="date"
                placeholder="选择时间"
                v-model="updateMvSubsidyform.adjustmentTime"
                value-format="yyyy-MM-dd"
                style="width:215px"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="异动前区域：" prop="preWorkAreaId">
              <el-select
                ref="areaPre"
                v-model="updateMvSubsidyform.preWorkAreaId"
                placeholder="选择区域"
                clearable
                filterable
              >
                <el-option
                  v-for="item in areaOptions"
                  :key="item.areaId"
                  :label="item.areaName"
                  :value="item.areaId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="异动后区域：" prop="afterWorkAreaId">
              <el-select
                ref="areaAfter"
                v-model="updateMvSubsidyform.afterWorkAreaId"
                placeholder="选择区域"
                clearable
                filterable
              >
                <el-option
                  v-for="item in areaOptions"
                  :key="item.areaId"
                  :label="item.areaName"
                  :value="item.areaId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="异动前岗位：" prop="prePost">
              <el-input v-model="updateMvSubsidyform.prePost" style="width:215px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="异动后岗位：" prop="afterPost">
              <el-input v-model="updateMvSubsidyform.afterPost" style="width:215px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="异动前工资：" prop="preSalary">
              <el-input-number
                :controls="false"
                v-model="updateMvSubsidyform.preSalary"
                style="width:215px"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="异动后工资：" prop="afterSalary">
              <el-input-number
                :controls="false"
                v-model="updateMvSubsidyform.afterSalary"
                style="width:215px"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="异动前工作小时：" prop="preAttendance">
              <el-input-number
                :controls="false"
                v-model="updateMvSubsidyform.preAttendance"
                style="width:215px"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="异动后工作小时：" prop="afterAttendance">
              <el-input-number
                :controls="false"
                v-model="updateMvSubsidyform.afterAttendance"
                style="width:215px"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :md="10">
            <el-form-item label="异动前后加权计算综合工资：" prop="comprehensivSalary" class="longTxt">
              <el-input-number
                :controls="false"
                v-model="updateMvSubsidyform.comprehensivSalary"
                style="width:150px"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :md="2">
            <el-button type="primary" style="margin-left:10px" @click="count2()">计算</el-button>
          </el-col>
          <el-col :md="12">
            <el-form-item label="年月：" prop="batch">
              <el-date-picker
                v-model="updateMvSubsidyform.batch"
                type="month"
                style="width:214px"
                value-format="yyyy-MM"
                placeholder="选择年月"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateMvSubsidy = false">取消</el-button>
        <el-button
          type="primary"
          @click="update_save('/incomePositionAdjustment','updateMvSubsidyform','updateMvSubsidy','mvSubsidySearch')"
        >保存</el-button>
      </span>
    </el-dialog>

    <!-- 学历补贴数据导入 -->
    <el-dialog
      title="学历补贴数据导入"
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="uploadModal"
      width="520px"
    >
      <p class="clearfix">
        <!-- <el-button size="mediumn" class="cloud-uploadBtn" @click="import_eduSubsidy()"><i></i>&nbsp;导入数据</el-button>&nbsp;&nbsp;
        <el-button size="mediumn" icon="el-icon-download">下载模板</el-button>-->
        <el-upload
          class="pull-left"
          ref="upload"
          :action="uploadActionUrl"
          :headers="headers"
          :before-upload="beforeUpload"
          :on-success="handleSuccess"
          :file-list="fileList"
        >
          <el-button size="mediumn" icon="el-icon-upload">导入数据</el-button>
          <el-button
            size="mediumn"
            @click.stop="JS_download"
            style="margin-left:15px;"
            icon="el-icon-download"
          >下载模板</el-button>
          <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
        </el-upload>
      </p>
      <!-- 导入之后的状态提示框 -->
      <!-- <el-alert v-if="uploadError" title="出错了！" type="error" description="系统无法识别excel中的空白，公式和非法字符。请先清理。" show-icon></el-alert>
      <el-alert v-if="uploadSuccess" title="已成功" type="success" description="您已成功导入相关数据，请及时核对！" show-icon></el-alert>-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadModal = false">取消</el-button>
      </span>
    </el-dialog>

    <!-- 导入信息 -->
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

    <!-- 劳模补贴数据导入 -->
    <el-dialog
      title="劳模补贴数据导入"
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="uploadLmModal"
      width="520px"
    >
      <p class="clearfix">
        <el-upload
          class="pull-left"
          ref="upload"
          :data="{batch:lmSearch.month}"
          :action="uploadActionUrlLm"
          :headers="headers"
          :before-upload="beforeUpload"
          :on-success="handleSuccessLm"
          :file-list="fileList"
        >
          <el-button size="mediumn" icon="el-icon-upload">导入数据</el-button>
          <el-button size="mediumn" style="margin-left:15px;" icon="el-icon-download" @click.stop="JS_lm_download">下载模板</el-button>
          <div slot="tip" class="el-upload__tip" style="color:red;">只能上传xls/xlsx文件/导入数据的年月批次是搜索条件的年月</div>
        </el-upload>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadLmModal= false">取消</el-button>
      </span>
    </el-dialog>

    <!-- 中途岗位异动数据导入222111 -->
    <el-dialog
      title="中途岗位异动数据导入"
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="uploadMvModal"
      width="520px"
    >
      <p class="clearfix">
        <el-upload
          class="pull-left"
          ref="upload"
          :action="uploadActionUrl2"
          :headers="headers"
          :before-upload="beforeUpload"
          :on-success="handleSuccessMv"
          :file-list="fileList"
        >
          <el-button size="mediumn" icon="el-icon-upload">导入数据</el-button>
          <el-button
            size="mediumn"
            @click.stop="JS_mv_download"
            style="margin-left:15px;"
            icon="el-icon-download"
          >下载模板</el-button>
          <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
        </el-upload>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadMvModal= false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { GET, POST, PUT, DELETE } from "http/custom.js"
import { parse } from 'querystring';
import { dirname } from 'path';
import Tools from 'untils/index.js';
import { setTimeout } from 'timers';
import tbMixin from "libs/mixin/tbMixin.js" //动态计算表格高度mixin
export default {
  name: 'subsidy',
  mixins: [tbMixin],
  data() {
    const uploadActionUrl = process.env.VUE_APP_DOMAIN_personnel + "/incomeEducationAllowanceImportData" //导入action  线上
    const uploadActionUrl2 = process.env.VUE_APP_DOMAIN_personnel + "/incomePositionAdjustmentsImportData" //导入action  线上
    const uploadActionUrlLm = process.env.VUE_APP_DOMAIN_personnel + "/importIncomeModelworkerAllowance" //导入@劳模补贴action  需要后端提供修改
    //const uploadActionUrl = "/incomeEducationAllowanceImportData" //导入action  线上
    let PYd = Tools.getPYd() //获取年月 上月 格式如 2019-06
    return {
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
      },
      t_height: 315, //减去的高度
      uploadSuccess: false, //上传文件成功标识符
      uploadError: false, //上传文件失败标识符
      headers: {}, //上传图片请求头
      uploadActionUrl,
      uploadActionUrl2,
      uploadActionUrlLm,//劳模补贴action
      fileList: [], //上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
      SubmitStu: false,//上报数据状态
      loading: false,
      activeName: 'first',
      value: '',
      number: '',
      aidChangeFlag: false,//false表示可以填写,点击搜索锁定aid
      uploadModal: false,//学历数据导入弹框
      uploadModalform: {
        BasePay: '',
      },
      areaOptions: [],//所属区域字典option
      hrTypeOptions: [],//员工类型option
      bsubmitOptions: [//提交状态
        {
          value: '0',
          label: '未提交'
        }, {
          value: '1',
          label: '已提交'
        }
        , {
          value: '2',
          label: '提交失败'
        },
        {
          value: '3',
          label: '忽略提交'
        }
      ],
      //餐补
      mealSubmitValue: '',
      mealDisabled: false,//false表示未锁定
      mealCurrent: 1,//当前页码
      mealPages: 0,//总页数
      mealSize: 15,//每页显示记录条数
      mealTotal: 0,//总记录条数
      mealSearch: {
        placeSelect: '',
        name: '',
        staffNum: '',
        batch: PYd
      },
      mealSubsidyData: [],
      addMealSubsidy: false,//餐补弹框
      updateMealSubsidy: false,//餐补弹框
      addMealSubsidyform: {
        aid: undefined,
        gender: '',
        name: '',
        workAreaName: '',
        employeeType: '',
        boardAllowance: undefined,
        batch: undefined
      },
      addMealSubsidyformRule: {
        aid: [{ required: true, message: "请填写员工编号", trigger: "blur" }],
        batch: [{ required: true, message: "请选择", trigger: "blur" }],
        boardAllowance: [{ required: true, message: "请填写", trigger: "blur" }],
      },
      updateMealSubsidyform: {
        aid: '',
        gender: '',
        name: '',
        place: '',
        workerType: '',
        boardAllowance: undefined,
        batch: undefined
      },
      updateMealSubsidyformRule: {
        // batch: [{ required: true, message: "请选择", trigger: "blur" }],
        boardAllowance: [{ required: true, message: "请填写", trigger: "blur" }],
      },
      //租房补贴
      hsSubmitValue: '',
      hsDisabled: false,
      hsCurrent: 1,//当前页码
      hsPages: 0,//总页数
      hsSize: 15,//每页显示记录条数
      hsTotal: 0,//总记录条数
      hsSearch: {
        placeSelect: '',
        batch: PYd,
        name: '',
        staffNum: ''
      },
      hsSubsidyData: [],
      addhsSubsidy: false,//租房补贴弹框
      updatehsSubsidy: false,//租房补贴弹框
      addhsSubsidyform: {
        aid: undefined,
        gender: '',
        name: '',
        workAreaName: '',
        employeeType: '',
        rentAllowance: undefined,
        batch: undefined
      },
      addhsSubsidyformRule: {
        aid: [{ required: true, message: "请填写员工编号", trigger: "blur" }],
        batch: [{ required: true, message: "请选择", trigger: "blur" }],
        rentAllowance: [{ required: true, message: "请填写", trigger: "blur" }],
      },
      updatehsSubsidyform: {
        aid: '',
        gender: '',
        name: '',
        place: '',
        workerType: '',
        rentAllowance: undefined,
        batch: undefined
      },
      updatehsSubsidyformRule: {
        rentAllowance: [{ required: true, message: "请填写", trigger: "blur" }],
      },
      //社保补贴
      socialSubmitValue: '',
      socialDisabled: false,
      socialCurrent: 1,//当前页码
      socialPages: 0,//总页数
      socialSize: 15,//每页显示记录条数
      socialTotal: 0,//总记录条数
      socialSearch: {
        placeSelect: '',
        batch: PYd,
        name: '',
        staffNum: ''
      },
      socialSubsidyData: [],
      addsocialSubsidy: false,//社保补贴弹框
      updatesocialSubsidy: false,//社保补贴弹框
      addsocialSubsidyform: {
        aid: undefined,
        gender: '',
        name: '',
        workAreaName: '',
        employeeType: '',
        socialAllowance: undefined,
        batch: undefined
      },
      addsocialSubsidyformRule: {
        aid: [{ required: true, message: "请填写员工编号", trigger: "blur" }],
        batch: [{ required: true, message: "请选择", trigger: "blur" }],
        socialAllowance: [{ required: true, message: "请填写", trigger: "blur" }],
      },
      updatesocialSubsidyform: {
        aid: '',
        gender: '',
        name: '',
        place: '',
        workerType: '',
        socialAllowance: undefined,
        batch: undefined
      },
      updatesocialSubsidyformRule: {
        socialAllowance: [{ required: true, message: "请填写", trigger: "blur" }],
      },
      //实习补贴
      interSubmitValue: '',
      interDisabled: false,
      interCurrent: 1,//当前页码
      interPages: 0,//总页数
      interSize: 15,//每页显示记录条数
      interTotal: 0,//总记录条数
      interSearch: {
        placeSelect: '',
        batch: PYd,
        name: '',
        staffNum: ''
      },
      interSubsidyData: [],
      //学历补贴
      eduSubmitValue: '',
      eduDisabled: false,
      eduCurrent: 1,//当前页码
      eduPages: 0,//总页数
      eduSize: 15,//每页显示记录条数
      eduTotal: 0,//总记录条数
      eduSearch: {
        placeSelect: '',
        month: PYd,
        name: '',
        staffNum: ''
      },
      eduSubsidyData: [],
      addeduSubsidy: false,//学历补贴弹框
      updateeduSubsidy: false,//学历补贴弹框
      addeduSubsidyform: {
        aid: undefined,
        gender: '',
        name: '',
        workAreaName: '',
        employeeType: '',
        educationAllowance: undefined,
        batch: undefined
      },
      addeduSubsidyformRule: {
        aid: [{ required: true, message: "请填写员工编号", trigger: "blur" }],
        batch: [{ required: true, message: "请选择", trigger: "blur" }],
        educationAllowance: [{ required: true, message: "请填写", trigger: "blur" }],
      },
      updateeduSubsidyform: {
        aid: '',
        gender: '',
        name: '',
        place: '',
        workerType: '',
        educationAllowance: undefined,
        batch: undefined
      },
      updateeduSubsidyformRule: {
        educationAllowance: [{ required: true, message: "请填写", trigger: "blur" }],
      },
      //工龄补贴
      search_more_year: false,
      yearMoreSearch: {
        name: '',
        employedNo: undefined
      },
      yearSubmitValue: '',
      yearDisabled: false,
      yearCurrent: 1,//当前页码
      yearPages: 0,//总页数
      yearSize: 15,//每页显示记录条数
      yearTotal: 0,//总记录
      yearSearch: {
        placeSelect: '',
        batch: PYd,
        // name: '',
        // staffNum: undefined,
        years: undefined
      },
      yearSubsidyData: [],
      //劳模补贴
      lmSubmitValue: '',
      lmDisabled: false,
      lmCurrent: 1,//当前页码
      lmPages: 0,//总页数
      lmSize: 15,//每页显示记录条数
      lmTotal: 0,//总记录
      lmSearch: {
        placeSelect: '',
        month: PYd,
        name: '',
        staffNum: ''
      },
      lmSubsidyData: [],
      addlmSubsidy: false,//新增劳模补贴弹框
      updatelmSubsidy: false,//修改劳模补贴弹框
      addlmSubsidyform: {
        aid: undefined,
        gender: '',
        name: '',
        workAreaName: '',
        employeeType: '',
        modelworkerAllowance: undefined,
        batch: undefined
      },
      addlmSubsidyformRule: {
        aid: [{ required: true, message: "请填写员工编号", trigger: "blur" }],
        batch: [{ required: true, message: "请选择", trigger: "blur" }],
        modelworkerAllowance: [{ required: true, message: "请填写", trigger: "blur" }],
      },
      updatelmSubsidyform: {
        aid: '',
        gender: '',
        name: '',
        place: '',
        workerType: '',
        modelworkerAllowance: undefined,
        batch: undefined
      },
      updatelmSubsidyformRule: {
        modelworkerAllowance: [{ required: true, message: "请填写", trigger: "blur" }],
      },
      //中途岗位异动
      mvAddSaveFlag: false,
      mvSubmitValue: '',
      mvDisabled: false,
      mvCurrent: 1,//当前页码
      mvPages: 0,//总页数
      mvSize: 15,//每页显示记录条数
      mvTotal: 0,//总记录
      mvSearch: {
        batch: PYd,
        name: '',
        staffNum: ''
      },
      mvSubsidyData: [],
      addmvSubsidy: false,
      updateMvSubsidy: false,
      mvSubsidyform: {
        aid: undefined,
        gender: '',
        name: '',
        adjustmentTime: '',
        preWorkAreaId: '',
        afterWorkAreaId: '',
        prePost: '',
        afterPost: '',
        preSalary: undefined,
        afterSalary: undefined,
        preAttendance: undefined,
        afterAttendance: undefined,
        comprehensivSalary: undefined,
        batch: ''
      },
      mvSubsidyformRule: {
        adjustmentTime: [{ required: true, message: "请选择", trigger: "blur" }],
        preWorkAreaId: [{ required: true, message: "请选择", trigger: "blur" }],
        afterWorkAreaId: [{ required: true, message: "请选择", trigger: "blur" }],
        prePost: [{ required: true, message: "请填写", trigger: "blur" }],
        afterPost: [{ required: true, message: "请填写", trigger: "blur" }],
        batch: [{ required: true, message: "请选择", trigger: "blur" }],
        aid: [{ required: true, message: "请填写员工编号", trigger: "blur" }],
        preSalary: [{ required: true, message: "请填写", trigger: "blur" }],
        afterSalary: [{ required: true, message: "请填写", trigger: "blur" }],
        preAttendance: [{ required: true, message: "请填写", trigger: "blur" }],
        afterAttendance: [{ required: true, message: "请填写", trigger: "blur" }],
        comprehensivSalary: [{ required: true, message: "请填写", trigger: "change" }]
      },
      updateMvSubsidyform: {
        aid: '',
        gender: '',
        name: '',
        adjustmentTime: '',
        preWorkAreaName: '',
        afterWorkAreaName: '',
        prePost: '',
        afterPost: '',
        preSalary: undefined,
        afterSalary: undefined,
        preAttendance: undefined,
        afterAttendance: undefined,
        comprehensivSalary: undefined,
        batch: ''
      },
      updateMvSubsidyformRule: {
        adjustmentTime: [{ required: true, message: "请选择", trigger: "blur" }],
        // preWorkAreaName: [{ required: true, message: "请选择", trigger: "blur" }],
        // afterWorkAreaName: [{ required: true, message: "请选择", trigger: "blur" }],
        preWorkAreaId: [{ required: true, message: "请选择", trigger: "blur" }],
        afterWorkAreaId: [{ required: true, message: "请选择", trigger: "blur" }],
        prePost: [{ required: true, message: "请填写", trigger: "blur" }],
        afterPost: [{ required: true, message: "请填写", trigger: "blur" }],
        batch: [{ required: true, message: "请选择", trigger: "blur" }],
        preSalary: [{ required: true, message: "请填写", trigger: "blur" }],
        afterSalary: [{ required: true, message: "请填写", trigger: "blur" }],
        preAttendance: [{ required: true, message: "请填写", trigger: "blur" }],
        afterAttendance: [{ required: true, message: "请填写", trigger: "blur" }],
        comprehensivSalary: [{ required: true, message: "请填写", trigger: "blur" }]
      },
      uploadMvModal: false,
      //劳模补助
      uploadLmModal:false,
      // ---end----111
      personalInfoData: {},//姓名popover弹窗数据
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
      }
    }

  },
  created() {
    //初始查询
    // this.mealSubsidyCheck()
    this.headers["x-user-token"] = localStorage.getItem("token");//设置上传数据文件excel的token
    this.queryAreaList()//获取所属区域字典
    this.queryHrTypeList()//获取员工类型
    this.mealSubsidySearch()
  },
  methods: {
    messagePopp(type, msg) {//提示框
      this.$message({
        showClose: true,
        type: type,
        message: msg
      });
    },
    handleCommandMeal(command) {
      if (command == 'a') {
        this.init_mealSubsidy()
      } else if (command == 'b') {
        this.$msgBox.confirm(
          '<span>确定重置数据？</span>',
          "温馨提示",
          {
            dangerouslyUseHTMLString: true,
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        ).then(() => {
          PUT(process.env.VUE_APP_DOMAIN_personnel + "/resetIncomeBoardAllowanceReoprtData",
            {
              batch: this.mealSearch.batch
            }).then(res => {
              if (res.code === 0) {
                this.messagePopp("success", "重置成功！")
                this.JS_mealSearch()
              }
            }).catch(error => { })
        }).catch(() => {
          console.log("失败");
        })
      }
    },
    handleCommandHs(command) {
      if (command == 'a') {
        this.init_hsSubsidy()
      } else if (command == 'b') {
        this.$msgBox.confirm(
          '<span>确定重置数据？</span>',
          "温馨提示",
          {
            dangerouslyUseHTMLString: true,
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        ).then(() => {
          PUT(process.env.VUE_APP_DOMAIN_personnel + "/resetIncomeRentAllowanceReoprtData",
            {
              batch: this.hsSearch.batch
            }).then(res => {
              if (res.code === 0) {
                this.messagePopp("success", "重置成功！")
                this.JS_hsSearch()
              }
            }).catch(error => { })
        }).catch(() => {
          console.log("失败");
        })
      }
    },
    handleCommandSocial(command) {
      if (command == 'a') {
        this.init_socialSubsidy()
      } else if (command == 'b') {
        this.$msgBox.confirm(
          '<span>确定重置数据？</span>',
          "温馨提示",
          {
            dangerouslyUseHTMLString: true,
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        ).then(() => {
          PUT(process.env.VUE_APP_DOMAIN_personnel + "/resetIncomeSocialAllowanceReoprtData",
            {
              batch: this.socialSearch.batch
            }).then(res => {
              if (res.code === 0) {
                this.messagePopp("success", "重置成功！")
                this.JS_socialSearch()
              }
            }).catch(error => { })
        }).catch(() => {
          console.log("失败");
        })
      }
    },
    handleCommandInter(command) {
      if (command == 'a') {
        this.init_interSubsidy()
      } else if (command == 'b') {
        this.$msgBox.confirm(
          '<span>确定重置数据？</span>',
          "温馨提示",
          {
            dangerouslyUseHTMLString: true,
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        ).then(() => {
          PUT(process.env.VUE_APP_DOMAIN_personnel + "/resetIncomeProbationAllowanceReoprtData",
            {
              batch: this.interSearch.batch
            }).then(res => {
              if (res.code === 0) {
                this.messagePopp("success", "重置成功！")
                this.JS_interSearch()
              }
            }).catch(error => { })
        }).catch(() => {
          console.log("失败");
        })
      }
    },
    handleCommand(command) {//更多操作下拉框
      if (command == 'a') {
        this.uploadModal = true
      } else if (command == 'b') {
        this.addeduSubsidy = true //新增弹框
      } else if (command == 'c') {
        this.$msgBox.confirm(
          '<span>确定重置数据？</span>',
          "温馨提示",
          {
            dangerouslyUseHTMLString: true,
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        ).then(() => {
          PUT(process.env.VUE_APP_DOMAIN_personnel + "/resetIncomeEducationAllowanceReoprtData",
            {
              batch: this.eduSearch.month
            }).then(res => {
              if (res.code === 0) {
                this.messagePopp("success", "重置成功！")
                this.JS_eduSearch()
              }
            }).catch(error => { })
        }).catch(() => {
          console.log("失败");
        })
      }
    },
    handleCommandYear(command) {
      if (command == 'a') {
        this.init_yearSubsidy()
      } else if (command == 'b') {
        this.$msgBox.confirm(
          '<span>确定重置数据？</span>',
          "温馨提示",
          {
            dangerouslyUseHTMLString: true,
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        ).then(() => {
          PUT(process.env.VUE_APP_DOMAIN_personnel + "/resetIncomeServicelenAllowanceReoprtData",
            {
              batch: this.yearSearch.batch
            }).then(res => {
              if (res.code === 0) {
                this.messagePopp("success", "重置成功！")
                this.JS_yearSearch()
              }
            }).catch(error => { })
        }).catch(() => {
          console.log("失败");
        })
      }
    },
    handleCommandLm(command) {
      if (command == 'c') {
        this.uploadLmModal = true //劳模补助导入功能
      } else if (command == 'a') {
        this.addlmSubsidy = true
      } else if (command == 'b') {
        this.$msgBox.confirm(
          '<span>确定重置数据？</span>',
          "温馨提示",
          {
            dangerouslyUseHTMLString: true,
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        ).then(() => {
          PUT(process.env.VUE_APP_DOMAIN_personnel + "/resetIncomeModelworkerAllowanceReoprtData",
            {
              batch: this.lmSearch.month
            }).then(res => {
              if (res.code === 0) {
                this.messagePopp("success", "重置成功！")
                this.JS_lmSearch()
              }
            }).catch(() => { })
        }).catch(() => {
          console.log("失败");
        })
      }
    },
    handleCommandMv(command) {
      if (command == 'c') {
        this.uploadMvModal = true
      } else if (command == 'a') {
        this.addmvSubsidy = true
      } else if (command == 'b') {
        this.$msgBox.confirm(
          '<span>确定重置数据？</span>',
          "温馨提示",
          {
            dangerouslyUseHTMLString: true,
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        ).then(() => {
          PUT(process.env.VUE_APP_DOMAIN_personnel + "/resetIncomePositionAdjustmentReoprtData",
            {
              batch: this.mvSearch.batch
            }).then(res => {
              if (res.code === 0) {
                this.messagePopp("success", "重置成功！")
                this.JS_mvSearch()
              }
            }).catch(() => { })
        }).catch(() => {
          console.log("失败");
        })
      }
    },

    // qianjun 根据员工编号获取个人信息
    getUserInfo(num) {
      GET(process.env.VUE_APP_DOMAIN_personnel + '/userInfo', { aid: num }).then(res => {//查询薪资类型模板
        console.log(res.data);
        this.personalInfoData = res.data
        this.personalInfoData.employedDates = this.personalInfoData.employedDates.split(" ")[0];
      }).catch(error => {
        console.log(error)
      })
    },
    //根据员工编号获取个人信息
    getInfoForId(num) {
      GET(process.env.VUE_APP_DOMAIN_personnel + "/queryUserInfoToRegid", { regid: num })
        .then(res => {
          this.personalInfoData = res.data;
          this.personalInfoData.employedDates = this.personalInfoData.employedDates.split(
            " "
          )[0];
          console.log(this.personalInfoData)
        })
        .catch(error => {
          console.log(error);
        });
    },
    // fTable({columnIndex}){
    //   if(columnIndex == 9 ||columnIndex == 10){
    //     return 'color:#34C534'
    //   }
    //   if(columnIndex == 11){
    //     return 'color:#47A1FD'
    //   }
    // },
    handleClick(tab, event) {//tabs切换获取数据
      console.log(this.activeName);
      if (this.activeName == "first") {
        this.mealSubsidySearch()
        // this.mealSubsidyCheck()
      } else if (this.activeName == "second") {
        this.hsSubsidySearch()
        // this.hsSubsidyCheck()
      } else if (this.activeName == "third") {
        this.socialSubsidySearch()
        // this.socialSubsidyCheck()
      } else if (this.activeName == "four") {
        this.interSubsidySearch()
        // this.interSubsidyCheck()
      } else if (this.activeName == "five") {
        this.eduSubsidySearch()
        // this.eduSubsidyCheck()
      } else if (this.activeName == "six") {
        this.yearSubsidySearch()
        // this.yearSubsidyCheck()
      } else if (this.activeName == "seven") {
        this.lmSubsidySearch()
        // this.lmSubsidyCheck()
      } else {
        this.mvSubsidySearch()
        // this.mvSubsidyCheck()
      }
    },
    // JS_submit() {//上报数据
    //   const that = this;
    //   this.$msgBox.confirm('<span>请确认</span><span style="color:red;">【租房补贴】</span><span>无误。</span>', '温馨提示', {
    //     dangerouslyUseHTMLString: true,
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning',
    //     callback: (action, instance) => {
    //       if (action === 'confirm') {
    //         that.SubmitStu = true
    //       }
    //     }
    //   }).then(() => {
    //     this.$message({
    //       type: 'success',
    //       message: '提交成功！'
    //     });
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '取消提交！'
    //     });
    //   });
    // },
    // cancel_submit() {//撤回数据
    //   this.$message({
    //     type: 'info',
    //     message: '撤回数据！'
    //   });
    //   this.SubmitStu = false
    // },
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
    //新增补贴弹窗内搜索员工信息
    aidSearch(formName) {
      let reg = /^8[0-1][0-9]{8}$/;
      let num = this[formName].aid;
      if (num && reg.test(num)) {//验证员工编号
        GET(process.env.VUE_APP_DOMAIN_personnel + '/userInfo', { aid: num }).then(res => {
          if (res.code == 0) {
            this.aidChangeFlag = true;
            this[formName].gender = String(res.data.sex);
            this[formName].name = res.data.userName;
            this[formName].workAreaName = res.data.areaName;
            this[formName].workAreaId = res.data.areaId;
            this[formName].employeeTypeId = String(res.data.hrType);
            this[formName].employeeType = res.data.hrTypeName;
            if (this.activeName == 'five') {
              this[formName].educationId = res.data.education;
              this[formName].educationName = res.data.educationNam;
            }
          }

        }).catch(error => {
          console.log(error)
        })
      } else {
        this.$message({
          type: 'fail',
          message: '员工编号数据有误!',
          showClose: true
        })
      }
    },
    reset(formName) {//新增重置按钮
      if (formName == 'mvSubsidyform') {
        this.mvAddSaveFlag = false
      }
      this.aidChangeFlag = false;
      this.$refs[formName].resetFields();
    },
    updateLm(url, id, formName, dialogName) {//修改补贴前获取用户信息 '/incomeModelWorkerAllowance',id,updatelmSubsidyform,updatelmSubsidy
      GET(process.env.VUE_APP_DOMAIN_personnel + url, { "id": id }).then(res => {//查询薪资类型模板
        this[formName] = res.data
        this[formName].employeeTypeId = Number(this[formName].employeeTypeId);
        this[formName].workAreaId = Number(this[formName].workAreaId);
        this[dialogName] = true //弹出修改框
      }).catch(error => {
        console.log(error)
      })
    },
    update_save(url, formName, dialogName, saveFun) {//补贴修改保存，公用
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.activeName == 'eight') {
            this[formName].preWorkAreaName = this.$refs.areaPre.selectedLabel
            this[formName].afterWorkAreaName = this.$refs.areaAfter.selectedLabel
          }
          console.log(this[formName]);
          PUT(process.env.VUE_APP_DOMAIN_personnel + url, this[formName]).then(res => {
            if (res.code == 0) {
              this.$message({
                type: 'success',
                message: '修改数据成功!',
                showClose: true
              })
              this[dialogName] = false //关闭修改弹框
              this[saveFun]() //刷新表格，重新获取数据
            }

          }).catch(error => {
            console.log(error)
          })
        }
      })
    },
    //餐补
    mealSubmitChange() {
      this.mealSubsidySearch()
    },
    mealIgnoreSubmit(id) {
      let ignoreObj = {
        "batch": this.mealSearch.batch || "",
        "confirmStatus": 2,
        "ids": [id]
      }
      // console.log(ignoreObj)
      PUT(process.env.VUE_APP_DOMAIN_personnel + "/incomeBoardAllowanceConfirmStatus", ignoreObj).then(res => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: '忽略提交成功!',
            showClose: true
          })
          this.mealSubsidySearch()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    mealCancelIgnore(id) {
      let ignoreObj = {
        "batch": this.mealSearch.batch || "",
        "confirmStatus": 3,
        "ids": [id]
      }
      PUT(process.env.VUE_APP_DOMAIN_personnel + "/incomeBoardAllowanceConfirmStatus", ignoreObj).then(res => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: '取消忽略成功!',
            showClose: true
          })
          this.mealSubsidySearch()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    mealSubsidySearch() {
      let searchObj = {
        "current": this.mealCurrent, //当前页码
        "size": this.mealSize, //每页显示记录条数
        "aid": this.mealSearch.staffNum || "",
        "name": this.mealSearch.name || "",
        "workAreaId": this.mealSearch.placeSelect || "",
        "batch": this.mealSearch.batch || "",
        "isConfirm": this.mealSubmitValue || '' //表头提交状态
      }
      console.log('搜索对象', searchObj)
      this.loading = true //开启动画
      POST(process.env.VUE_APP_DOMAIN_personnel + '/incomeBoardAllowances', searchObj).then(res => {
        this.loading = false //关闭动画
        this.mealSubsidyData = res.data.records //set表格的值
        this.mealCurrent = res.data.current //set当前页
        this.mealPages = res.data.pages
        this.mealSize = res.data.size //每页显示记inter
        this.mealTotal = res.data.total //总记录条数
        this.mealSubsidyCheck()
      }).catch(error => {
        this.loading = false //关闭动画
        console.log(error)
      })
    },
    mealSubsidyCheck() {//查询餐补收入项锁定状态
      let searchObj = {
        "batch": this.mealSearch.batch || ""
      }
      console.log('搜索对象', searchObj)
      GET(process.env.VUE_APP_DOMAIN_personnel + '/boardAllowanceFinancialDataLockStatus', searchObj).then(res => {
        console.log(res)
        if (res.code == 3) {//锁定
          this.mealDisabled = true
        } else if (res.code == 0) {
          this.mealDisabled = false
        }
      }).catch(error => {
        console.log(error)
      })
    },
    update_mealSubsidy() {//上报
      const that = this;
      this.$msgBox.confirm('<span>请确认你上传的' + this.mealSearch.batch + '月份</span><span style="color:red;">【餐补】</span><span>无误，确认提交后，将直接影响工资准确发放。</span>', '温馨提示', {
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
            let searchObj = {
              "batch": this.mealSearch.batch || ""
            }
            console.log(searchObj);
            POST(process.env.VUE_APP_DOMAIN_personnel + '/reportBoardAllowance', searchObj).then(res => {
              loading.close() //关闭loading
              if (res.code == 0) {//锁定
                this.$message({
                  type: 'success',
                  message: '上报数据成功!',
                  showClose: true
                })
              }
              this.mealSubsidySearch()
            }).catch(error => {
              this.mealSubsidySearch()
              loading.close() //关闭loading
              console.log(error)
            })
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
    cancel_mealSubsidy() {//解锁餐补
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
        let searchObj = {
          "batch": this.mealSearch.batch || ""
        }
        POST(process.env.VUE_APP_DOMAIN_personnel + '/unlockBoardAllowance', searchObj).then(res => {
          if (res.code == 0) {//锁定
            this.$message({
              type: 'success',
              message: '取消上报成功!',
              showClose: true
            })
            this.mealSubsidySearch()
          }
        }).catch(error => {
          console.log(error)
        })
      }).catch(() => {

      })
    },
    init_mealSubsidy() {//初始化
      let searchObj = {
        "batch": this.mealSearch.batch || ""
      }
      POST(process.env.VUE_APP_DOMAIN_personnel + '/initBoardAllowance', searchObj).then(res => {
        if (res.code == 0) {//锁定
          this.$message({
            type: 'success',
            message: '初始化成功!',
            showClose: true
          })
          this.mealSubsidySearch()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    mealHandleSizeChange(val) {
      this.mealSize = val
      this.mealSubsidySearch()
    },
    mealHandlecurrentChange(val) {
      this.mealCurrent = val
      this.mealSubsidySearch()
    },
    JS_mealSearch() {
      this.mealCurrent = 1 //点击搜索current=1搜索第一页
      this.mealSubsidySearch()
    },
    mealDialogClose() {
      this.addMealSubsidy = false
      this.reset('addMealSubsidyform')
    },
    // 租房补贴
    hsSubmitChange() {
      this.hsSubsidySearch()
    },
    hsIgnoreSubmit(id) {
      let ignoreObj = {
        "batch": this.hsSearch.batch || "",
        "confirmStatus": 2,
        "ids": [id]
      }
      // console.log(ignoreObj)
      PUT(process.env.VUE_APP_DOMAIN_personnel + "/incomeRentAllowanceConfirmStatus", ignoreObj).then(res => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: '忽略提交成功!',
            showClose: true
          })
          this.hsSubsidySearch()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    hsCancelIgnore(id) {
      let ignoreObj = {
        "batch": this.hsSearch.batch || "",
        "confirmStatus": 3,
        "ids": [id]
      }
      PUT(process.env.VUE_APP_DOMAIN_personnel + "/incomeRentAllowanceConfirmStatus", ignoreObj).then(res => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: '取消忽略成功!',
            showClose: true
          })
          this.hsSubsidySearch()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    hsSubsidySearch() {
      let searchObj = {
        "current": this.hsCurrent, //当前页码
        "size": this.hsSize, //每页显示记录条数
        "aid": this.hsSearch.staffNum || "",
        "name": this.hsSearch.name || "",
        "workAreaId": this.hsSearch.placeSelect || "",
        "batch": this.hsSearch.batch || "",
        "isConfirm": this.hsSubmitValue || '' //表头提交状态
      }
      this.loading = true //开启动画
      POST(process.env.VUE_APP_DOMAIN_personnel + '/incomeRentAllowances', searchObj).then(res => {
        this.loading = false //关闭动画
        this.hsSubsidyData = res.data.records //set表格的值
        this.hsCurrent = res.data.current //set当前页
        this.hsPages = res.data.pages //总记录条数
        this.hsSize = res.data.size //每页显示记inter
        this.hsTotal = res.data.total //总记录条数
        this.hsSubsidyCheck()
      }).catch(error => {
        this.loading = false //关闭动画
        console.log(error)
      })
    },
    hsSubsidyCheck() {//锁定状态
      let searchObj = {
        "batch": this.hsSearch.batch || ""
      }
      console.log('搜索对象', searchObj)
      GET(process.env.VUE_APP_DOMAIN_personnel + '/rentAllowanceFinancialDataLockStatus', searchObj).then(res => {
        console.log(res)
        if (res.code == 3) {//锁定
          this.hsDisabled = true
        } else if (res.code == 0) {
          this.hsDisabled = false
        }
      }).catch(error => {
        console.log(error)
      })
    },
    update_hsSubsidy() {//上报
      const that = this;
      this.$msgBox.confirm('<span>请确认你上传的' + this.hsSearch.batch + '月份</span><span style="color:red;">【租房补贴】</span><span>无误，确认提交后，将直接影响工资准确发放。</span>', '温馨提示', {
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
            let searchObj = {
              "batch": this.hsSearch.batch || ""
            }
            console.log(searchObj);
            POST(process.env.VUE_APP_DOMAIN_personnel + '/reportRentAllowance', searchObj).then(res => {
              loading.close() //关闭loading
              if (res.code == 0) {//锁定
                this.$message({
                  type: 'success',
                  message: '上报数据成功!',
                  showClose: true
                })
              }
              this.hsSubsidySearch()
            }).catch(error => {
              this.hsSubsidySearch()
              loading.close() //关闭loading
              console.log(error)
            })
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
    cancel_hsSubsidy() {//解锁
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
        let searchObj = {
          "batch": this.hsSearch.batch || ""
        }
        POST(process.env.VUE_APP_DOMAIN_personnel + '/unlockRentAllowance', searchObj).then(res => {
          if (res.code == 0) {//锁定
            this.$message({
              type: 'success',
              message: '取消提交成功!',
              showClose: true
            })
            this.hsSubsidySearch()
          }
        }).catch(error => {
          console.log(error)
        })
      }).catch(() => {

      })

    },
    init_hsSubsidy() {//初始化
      let searchObj = {
        "batch": this.mealSearch.batch || ""
      }
      POST(process.env.VUE_APP_DOMAIN_personnel + '/initRentAllowance', searchObj).then(res => {
        if (res.code == 0) {//锁定
          this.$message({
            type: 'success',
            message: '初始化成功!',
            showClose: true
          })
          this.hsSubsidySearch()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    hsHandleSizeChange(val) {
      this.hsSize = val
      this.hsSubsidySearch()
    },
    hsHandlecurrentChange(val) {
      this.hsCurrent = val
      this.hsSubsidySearch()
    },
    JS_hsSearch() {
      this.hsCurrent = 1 //点击搜索current=1搜索第一页
      this.hsSubsidySearch()
    },
    hsDialogClose() {
      this.addhsSubsidy = false
      this.reset('addhsSubsidyform')
    },
    // 社保补贴
    socialSubmitChange() {
      this.socialSubsidySearch()
    },
    socialIgnoreSubmit(id) {
      let ignoreObj = {
        "batch": this.socialSearch.batch || "",
        "confirmStatus": 2,
        "ids": [id]
      }
      // console.log(ignoreObj)
      PUT(process.env.VUE_APP_DOMAIN_personnel + "/incomeSocialAllowanceConfirmStatus", ignoreObj).then(res => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: '忽略提交成功!',
            showClose: true
          })
          this.socialSubsidySearch()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    socialCancelIgnore(id) {
      let ignoreObj = {
        "batch": this.socialSearch.batch || "",
        "confirmStatus": 3,
        "ids": [id]
      }
      PUT(process.env.VUE_APP_DOMAIN_personnel + "/incomeSocialAllowanceConfirmStatus", ignoreObj).then(res => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: '取消忽略成功!',
            showClose: true
          })
          this.socialSubsidySearch()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    socialSubsidySearch() {
      let searchObj = {
        "current": this.socialCurrent, //当前页码
        "size": this.socialSize, //每页显示记录条数
        "aid": this.socialSearch.staffNum || "",
        "name": this.socialSearch.name || "",
        "workAreaId": this.socialSearch.placeSelect || "",
        "batch": this.socialSearch.batch || "",
        "isConfirm": this.socialSubmitValue || '' //表头提交状态
      }
      console.log('搜索对象', searchObj)
      this.loading = true //开启动画
      POST(process.env.VUE_APP_DOMAIN_personnel + '/incomeSocialAllowances', searchObj).then(res => {
        this.loading = false //关闭动画
        this.socialSubsidyData = res.data.records //set表格的值
        this.socialCurrent = res.data.current //set当前页
        this.socialPages = res.data.pages //总记录条数
        this.socialSize = res.data.size //每页显示记inter
        this.socialTotal = res.data.total //总记录条数
        this.socialSubsidyCheck()
      }).catch(error => {
        this.loading = false //关闭动画
        console.log(error)
      })
    },
    socialSubsidyCheck() {//锁定状态????????????????????????????????????????
      let searchObj = {
        "batch": this.socialSearch.batch || ""
      }
      console.log('搜索对象', searchObj)
      GET(process.env.VUE_APP_DOMAIN_personnel + '/socialAllowanceFinancialDataLockStatus', searchObj).then(res => {
        console.log(res)
        if (res.code == 3) {//锁定
          this.socialDisabled = true
        } else if (res.code == 0) {
          this.socialDisabled = false
        }
      }).catch(error => {
        console.log(error)
      })
      console.log(this.socialDisabled);
    },
    update_socialSubsidy() {//上报
      const that = this;
      this.$msgBox.confirm('<span>请确认你上传的' + this.socialSearch.batch + '月份</span><span style="color:red;">【社保补贴】</span><span>无误，确认提交后，将直接影响工资准确发放。</span>', '温馨提示', {
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
            let searchObj = {
              "batch": this.socialSearch.batch || ""
            }
            console.log(searchObj);
            POST(process.env.VUE_APP_DOMAIN_personnel + '/reportSocialAllowance', searchObj).then(res => {
              loading.close() //关闭loading
              if (res.code == 0) {//锁定
                this.$message({
                  type: 'success',
                  message: '上报数据成功!',
                  showClose: true
                })
              }
              this.socialSubsidySearch()
            }).catch(error => {
              this.socialSubsidySearch()
              loading.close() //关闭loading
              console.log(error)
            })
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
    cancel_socialSubsidy() {//解锁
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
        let searchObj = {
          "batch": this.mealSearch.batch || ""
        }
        POST(process.env.VUE_APP_DOMAIN_personnel + '/unlockSocialAllowance', searchObj).then(res => {
          if (res.code == 0) {//锁定
            this.$message({
              type: 'success',
              message: '取消提交成功!',
              showClose: true
            })
            this.socialSubsidySearch()
          }
        }).catch(error => {
          console.log(error)
        })
      }).catch(() => {

      })

    },
    init_socialSubsidy() {//初始化
      let searchObj = {
        "batch": this.mealSearch.batch || ""
      }
      POST(process.env.VUE_APP_DOMAIN_personnel + '/initSocialAllowance', searchObj).then(res => {
        if (res.code == 0) {//锁定
          this.$message({
            type: 'success',
            message: '初始化成功!',
            showClose: true
          })
          this.socialSubsidySearch()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    socialHandleSizeChange(val) {
      this.socialSize = val
      this.socialSubsidySearch()
    },
    socialHandlecurrentChange(val) {
      this.socialCurrent = val
      this.socialSubsidySearch()
    },
    JS_socialSearch() {
      this.socialCurrent = 1 //点击搜索current=1搜索第一页
      this.socialSubsidySearch()
    },
    socialDialogClose() {
      this.addsocialSubsidy = false
      this.reset('addsocialSubsidyform')
    },
    // 实习补贴
    interSubmitChange() {
      this.interSubsidySearch()
    },
    interIgnoreSubmit(id) {
      let ignoreObj = {
        "batch": this.interSearch.batch || "",
        "confirmStatus": 2,
        "ids": [id]
      }
      // console.log(ignoreObj)
      PUT(process.env.VUE_APP_DOMAIN_personnel + "/incomeProbationAllowanceConfirmStatus", ignoreObj).then(res => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: '忽略提交成功!',
            showClose: true
          })
          this.interSubsidySearch()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    interCancelIgnore(id) {
      let ignoreObj = {
        "batch": this.interSearch.batch || "",
        "confirmStatus": 3,
        "ids": [id]
      }
      PUT(process.env.VUE_APP_DOMAIN_personnel + "/incomeProbationAllowanceConfirmStatus", ignoreObj).then(res => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: '取消忽略成功!',
            showClose: true
          })
          this.interSubsidySearch()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    interSubsidySearch() {
      let searchObj = {
        "current": this.interCurrent, //当前页码
        "size": this.interSize, //每页显示记录条数
        "aid": this.interSearch.staffNum || "",
        "name": this.interSearch.name || "",
        "workAreaId": this.interSearch.placeSelect || "",
        "batch": this.interSearch.batch || "",
        "isConfirm": this.interSubmitValue || '' //表头提交状态
      }
      console.log('搜索对象', searchObj)
      this.loading = true //开启动画
      POST(process.env.VUE_APP_DOMAIN_personnel + '/incomeProbationAllowances', searchObj).then(res => {
        this.loading = false //关闭动画
        this.interSubsidyData = res.data.records //set表格的值
        this.interCurrent = res.data.current //set当前页
        this.interPages = res.data.pages //总记录条数
        this.interSize = res.data.size //每页显示记inter
        this.interTotal = res.data.total //总记录条数
        this.interSubsidyCheck()
      }).catch(error => {
        this.loading = false //关闭动画
        console.log(error)
      })
    },
    interSubsidyCheck() {//锁定状态
      let searchObj = {
        "batch": this.interSearch.batch || ""
      }
      console.log('搜索对象', searchObj)
      GET(process.env.VUE_APP_DOMAIN_personnel + '/probationAllowanceFinancialDataLockStatus', searchObj).then(res => {
        console.log(res)
        if (res.code == 3) {//锁定
          this.interDisabled = true
        } else if (res.code == 0) {
          this.interDisabled = false
        }
      }).catch(error => {
        console.log(error)
      })
    },
    update_interSubsidy() {//上报
      const that = this;
      this.$msgBox.confirm('<span>请确认你上传的' + this.interSearch.batch + '月份</span><span style="color:red;">【实习补贴】</span><span>无误，确认提交后，将直接影响工资准确发放。</span>', '温馨提示', {
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
            let searchObj = {
              "batch": this.interSearch.batch || ""
            }
            console.log(searchObj);
            POST(process.env.VUE_APP_DOMAIN_personnel + '/reportProbationAllowance', searchObj).then(res => {
              loading.close() //关闭loading
              if (res.code == 0) {//锁定
                this.$message({
                  type: 'success',
                  message: '上报数据成功!',
                  showClose: true
                })
              }
              this.interSubsidySearch()
            }).catch(error => {
              this.interSubsidySearch()
              loading.close() //关闭loading
              console.log(error)
            })
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
    init_interSubsidy() {//初始化
      let searchObj = {
        "batch": this.interSearch.batch || ""
      }
      POST(process.env.VUE_APP_DOMAIN_personnel + '/initProbationAllowance', searchObj).then(res => {
        if (res.code == 0) {//锁定
          this.$message({
            type: 'success',
            message: '初始化成功!',
            showClose: true
          })
          this.interSubsidySearch()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    cancel_interSubsidy() {//解锁
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
        let searchObj = {
          "batch": this.mealSearch.batch || ""
        }
        POST(process.env.VUE_APP_DOMAIN_personnel + '/unlockProbationAllowance', searchObj).then(res => {
          if (res.code == 0) {//锁定
            this.$message({
              type: 'success',
              message: '取消提交成功!',
              showClose: true
            })
            this.interDisabled = false
          }
        }).catch(error => {
          console.log(error)
        })
      }).catch(() => {

      })

    },

    interHandleSizeChange(val) {
      this.interSize = val
      this.interSubsidySearch()
    },
    interHandlecurrentChange(val) {
      this.interCurrent = val
      this.interSubsidySearch()
    },
    JS_interSearch() {
      this.interCurrent = 1 //点击搜索current=1搜索第一页
      this.interSubsidySearch()
    },

    //学历补贴
    eduSubmitChange() {
      this.eduSubsidySearch()
    },
    eduIgnoreSubmit(id) {
      let ignoreObj = {
        "batch": this.eduSearch.month || "",
        "confirmStatus": 2,
        "ids": [id]
      }
      // console.log(ignoreObj)
      PUT(process.env.VUE_APP_DOMAIN_personnel + "/incomeEducationAllowanceConfirmStatus", ignoreObj).then(res => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: '忽略提交成功!',
            showClose: true
          })
          this.eduSubsidySearch()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    eduCancelIgnore(id) {
      let ignoreObj = {
        "batch": this.eduSearch.month || "",
        "confirmStatus": 3,
        "ids": [id]
      }
      PUT(process.env.VUE_APP_DOMAIN_personnel + "/incomeEducationAllowanceConfirmStatus", ignoreObj).then(res => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: '取消忽略成功!',
            showClose: true
          })
          this.eduSubsidySearch()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    eduSubsidySearch() {
      let searchObj = {
        "current": this.eduCurrent, //当前页码
        "size": this.eduSize, //每页显示记录条数
        "aid": this.eduSearch.staffNum || "",
        "name": this.eduSearch.name || "",
        "workAreaId": this.eduSearch.placeSelect || "",
        "batch": this.eduSearch.month || "",
        "isConfirm": this.eduSubmitValue || '' //表头提交状态
      }
      console.log('搜索对象', searchObj)
      this.loading = true //开启动画
      POST(process.env.VUE_APP_DOMAIN_personnel + '/incomeEducationAllowances', searchObj).then(res => {
        this.loading = false //关闭动画
        this.eduSubsidyData = res.data.records //set表格的值
        this.eduCurrent = res.data.current //set当前页
        this.eduPages = res.data.pages //总记录条数
        this.eduSize = res.data.size //每页显示记录条数
        this.eduTotal = res.data.total //总记录条数
        this.eduSubsidyCheck()
      }).catch(error => {
        this.loading = false //关闭动画
        console.log(error)
      })
    },
    eduSubsidyCheck() {//锁定状态
      let searchObj = {
        "batch": this.eduSearch.month || ""
      }
      console.log('搜索对象', searchObj)
      GET(process.env.VUE_APP_DOMAIN_personnel + '/educationAllowanceFinancialDataLockStatus', searchObj).then(res => {
        console.log(res)
        if (res.code == 3) {//锁定
          this.eduDisabled = true
        } else if (res.code == 0) {
          this.eduDisabled = false
        }
      }).catch(error => {
        console.log(error)
      })
    },
    update_eduSubsidy() {//上报
      const that = this;
      this.$msgBox.confirm('<span>请确认你上传的' + this.eduSearch.month + '月份</span><span style="color:red;">【学历补贴】</span><span>无误，确认提交后，将直接影响工资准确发放。</span>', '温馨提示', {
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
            let searchObj = {
              "batch": this.eduSearch.month || ""
            }
            console.log(searchObj);
            POST(process.env.VUE_APP_DOMAIN_personnel + '/reportEducationAllowance', searchObj).then(res => {
              loading.close() //关闭loading
              if (res.code == 0) {//锁定
                this.$message({
                  type: 'success',
                  message: '上报数据成功!',
                  showClose: true
                })
              }
              this.eduSubsidySearch()
            }).catch(error => {
              this.eduSubsidySearch()
              loading.close() //关闭loading
              console.log(error)
            })
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
    cancel_eduSubsidy() {//解锁
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
        let searchObj = {
          "batch": this.eduSearch.month || ""
        }
        POST(process.env.VUE_APP_DOMAIN_personnel + '/unlockEducationAllowance', searchObj).then(res => {
          if (res.code == 0) {//锁定
            this.$message({
              type: 'success',
              message: '取消提交成功!',
              showClose: true
            })
            this.eduSubsidySearch()
          }
        }).catch(error => {
          console.log(error)
        })
      }).catch(() => {

      })

    },
    // import_eduSubsidy() {//导入

    // },
    eduHandleSizeChange(val) {
      this.eduSize = val
      this.eduSubsidySearch()
    },
    eduHandlecurrentChange(val) {
      this.eduCurrent = val
      this.eduSubsidySearch()
    },
    JS_eduSearch() {
      this.eduCurrent = 1 //点击搜索current=1搜索第一页
      this.eduSubsidySearch()
    },
    eduDialogClose() {
      this.addeduSubsidy = false
      this.reset('addeduSubsidyform')
    },
    // beforeRemove(file) {
    //   //删除文件之前的钩子
    //   // debugger
    //   return this.$msgBox.confirm(`确定移除 ${file.name}？`);
    // },
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
    fileClose() {//关闭公式导入弹框
      //清除表单
      this.uploadModal = false
      this.$refs.upload.clearFiles() //清空已上传的文件列表（该方法不支持在 before-upload 中调用）
    },
    handleSuccess(res) {//上传文件接口调取成功回调
      this.uploadModal = false; //关闭导入框
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
            if (this.activeName == "five") {//刷新页面111
              this.JS_eduSearch();
            } else if (this.activeName == "eight") {
              this.mvSubsidySearch()
            } else if(this.activeName == "seven"){//劳模补贴
              this.lmSubsidySearch() //刷新劳模补贴table
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
    },
    unloadErrorLink() {//导入错误模板下载
      console.log('downloadErrorKey', this.downloadErrorKey)
      if (this.activeName == "five") {
        let url = process.env.VUE_APP_DOMAIN_download + '/oss/download?key=' + this.downloadErrorKey + '&token=' + localStorage.getItem("token") + "&name=" + encodeURI("学历补贴失败明细") + ".xlsx";
        window.location.href = url;
      } else if (this.activeName == "eight") {
        let url = process.env.VUE_APP_DOMAIN_download + '/oss/download?key=' + this.downloadErrorKey + '&token=' + localStorage.getItem("token") + "&name=" + encodeURI("中途岗位异动失败明细") + ".xlsx";
        window.location.href = url;
      }else if(this.activeName == "seven"){//劳模补贴
        let url = process.env.VUE_APP_DOMAIN_download + '/oss/download?key=' + this.downloadErrorKey + '&token=' + localStorage.getItem("token") + "&name=" + encodeURI("劳模补贴失败明细") + ".xlsx";
        window.location.href = url;
      }
    },
    JS_download() {//下载模板
      GET(process.env.VUE_APP_DOMAIN_personnel + "/queryBizFilesTemplate", { fileCode: 'PERSONNEL_INCOMEEDUCATIONALLOWANCE_IMPORT_TEMPLATE' })
        .then(res => {
          //获取模板存储返回的ID
          let url = `${process.env.VUE_APP_DOMAIN_download}/oss/download?key=${res.data.fileTemplateId}&name=${res.data.fileTemplateName}.${res.data.fileTemplateSuffix}`;
          window.location.href = url;
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 工龄补贴
    yearSubmitChange() {
      this.yearSubsidySearch()
    },
    yearIgnoreSubmit(id) {
      let ignoreObj = {
        "batch": this.yearSearch.batch || "",
        "confirmStatus": 2,
        "ids": [id]
      }
      // console.log(ignoreObj)
      PUT(process.env.VUE_APP_DOMAIN_personnel + "/incomeServicelenAllowanceConfirmStatus", ignoreObj).then(res => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: '忽略提交成功!',
            showClose: true
          })
          this.yearSubsidySearch()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    yearCancelIgnore(id) {
      let ignoreObj = {
        "batch": this.yearSearch.batch || "",
        "confirmStatus": 3,
        "ids": [id]
      }
      PUT(process.env.VUE_APP_DOMAIN_personnel + "/incomeServicelenAllowanceConfirmStatus", ignoreObj).then(res => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: '取消忽略成功!',
            showClose: true
          })
          this.yearSubsidySearch()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    yearSubsidySearch() {//数据列表
      let searchObj = {
        "current": this.yearCurrent, //当前页码
        "size": this.yearSize, //每页显示记录条数
        "aid": this.yearMoreSearch.staffNum || "",
        "name": this.yearMoreSearch.name || "",
        "workAreaId": this.yearSearch.placeSelect || "",
        "servicelen": this.yearSearch.years || "",
        "batch": this.yearSearch.batch || "",
        "isConfirm": this.yearSubmitValue || '' //表头提交状态
      }
      console.log('搜索对象', searchObj)
      this.loading = true //开启动画
      POST(process.env.VUE_APP_DOMAIN_personnel + '/incomeServicelenAllowances', searchObj).then(res => {
        this.loading = false //关闭动画
        this.yearSubsidyData = res.data.records //set表格的值
        this.yearCurrent = res.data.current //set当前页
        this.yearPages = res.data.pages //总记录条数
        this.yearSize = res.data.size //每页显示记录条数
        this.yearTotal = res.data.total //总记录条数
        this.yearSubsidyCheck()
      }).catch(error => {
        this.loading = false
        console.log(error)
      })
    },
    yearSubsidyCheck() {//锁定状态
      let searchObj = {
        "batch": this.yearSearch.batch || ""
      }
      console.log('搜索对象', searchObj)
      GET(process.env.VUE_APP_DOMAIN_personnel + '/servicelenAllowanceFinancialDataLockStatus', searchObj).then(res => {
        console.log(res)
        if (res.code == 3) {//锁定
          this.yearDisabled = true
        } else if (res.code == 0) {
          this.yearDisabled = false
        }
      }).catch(error => {
        console.log(error)
      })
    },
    update_yearSubsidy() {//上报
      const that = this;
      this.$msgBox.confirm('<span>请确认你上传的' + this.yearSearch.batch + '月份</span><span style="color:red;">【工龄补贴】</span><span>无误，确认提交后，将直接影响工资准确发放。</span>', '温馨提示', {
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
            let searchObj = {
              "batch": this.yearSearch.batch || ""
            }
            console.log(searchObj);
            POST(process.env.VUE_APP_DOMAIN_personnel + '/reportServicelenAllowance', searchObj).then(res => {
              loading.close() //关闭loading
              if (res.code == 0) {//锁定
                this.$message({
                  type: 'success',
                  message: '上报数据成功!',
                  showClose: true
                })
              }
              this.yearSubsidySearch()
            }).catch(error => {
              this.yearSubsidySearch()
              loading.close() //关闭loading
              console.log(error)
            })
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
    cancel_yearSubsidy() {//解锁
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
        let searchObj = {
          "batch": this.yearSearch.batch || ""
        }
        POST(process.env.VUE_APP_DOMAIN_personnel + '/unlockServicelenAllowance', searchObj).then(res => {
          if (res.code == 0) {//锁定
            this.$message({
              type: 'success',
              message: '取消提交成功!',
              showClose: true
            })
            this.yearSubsidySearch()
          }
        }).catch(error => {
          console.log(error)
        })
      }).catch(() => {

      })

    },
    init_yearSubsidy() {//初始化
      let searchObj = {
        "wageBatch": this.mealSearch.batch || ""
      }
      POST(process.env.VUE_APP_DOMAIN_personnel + '/initServicelenAllowance', searchObj).then(res => {
        if (res.code == 0) {//锁定
          this.$message({
            type: 'success',
            message: '初始化成功!',
            showClose: true
          })
          this.yearSubsidySearch()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    yearHandleSizeChange(val) {
      this.yearSize = val
      this.yearSubsidySearch()
    },
    yearHandlecurrentChange(val) {
      this.yearCurrent = val
      this.yearSubsidySearch()
    },
    JS_yearSearch() {
      this.yearCurrent = 1 //点击搜索current=1搜索第一页
      this.yearSubsidySearch()
    },
    // 劳模补贴
    lmSubmitChange() {
      this.lmSubsidySearch()
    },
    lmIgnoreSubmit(id) {
      let ignoreObj = {
        "batch": this.lmSearch.month || "",
        "confirmStatus": 2,
        "ids": [id]
      }
      // console.log(ignoreObj)
      PUT(process.env.VUE_APP_DOMAIN_personnel + "/incomeModelworkerAllowanceConfirmStatus", ignoreObj).then(res => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: '忽略提交成功!',
            showClose: true
          })
          this.lmSubsidySearch()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    lmCancelIgnore(id) {
      let ignoreObj = {
        "batch": this.lmSearch.month || "",
        "confirmStatus": 3,
        "ids": [id]
      }
      PUT(process.env.VUE_APP_DOMAIN_personnel + "/incomeModelworkerAllowanceConfirmStatus", ignoreObj).then(res => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: '取消忽略成功!',
            showClose: true
          })
          this.lmSubsidySearch()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    lmSubsidySearch() {//数据列表
      let searchObj = {
        "current": this.lmCurrent, //当前页码
        "size": this.lmSize, //每页显示记录条数
        "aid": this.lmSearch.staffNum || "",
        "name": this.lmSearch.name || "",
        "workAreaId": this.lmSearch.placeSelect || "",
        "batch": this.lmSearch.month || "",
        "isConfirm": this.lmSubmitValue || '' //表头提交状态        
      }
      console.log('搜索对象', searchObj)
      this.loading = true //开启动画
      POST(process.env.VUE_APP_DOMAIN_personnel + '/incomeModelWorkerAllowances', searchObj).then(res => {
        this.loading = false //关闭动画
        this.lmSubsidyData = res.data.records //set表格的值
        this.lmCurrent = res.data.current //set当前页
        this.lmPages = res.data.pages //总记录条数
        this.lmSize = res.data.size //每页显示记录条数
        this.lmTotal = res.data.total //总记录条数
        this.lmSubsidyCheck()
      }).catch(error => {
        this.loading = false
        console.log(error)
      })
    },
    lmSubsidyCheck() {//锁定状态
      let searchObj = {
        "batch": this.lmSearch.month || ""
      }
      console.log('搜索对象', searchObj)
      GET(process.env.VUE_APP_DOMAIN_personnel + '/modelworkerAllowanceFinancialDataLockStatus', searchObj).then(res => {
        console.log(res)
        if (res.code == 3) {//锁定
          this.lmDisabled = true
        } else if (res.code == 0) {
          this.lmDisabled = false
        }
      }).catch(error => {
        console.log(error)
      })
    },
    update_lmSubsidy() {//上报
      const that = this;
      this.$msgBox.confirm('<span>请确认你上传的' + this.lmSearch.month + '月份</span><span style="color:red;">【劳模补贴】</span><span>无误，确认提交后，将直接影响工资准确发放。</span>', '温馨提示', {
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
            let searchObj = {
              "batch": this.lmSearch.month || ""
            }
            console.log(searchObj);
            POST(process.env.VUE_APP_DOMAIN_personnel + '/reportModelworkerAllowance', searchObj).then(res => {
              loading.close() //关闭loading
              if (res.code == 0) {//锁定
                this.$message({
                  type: 'success',
                  message: '上报数据成功!',
                  showClose: true
                })
              }
              that.lmSubsidySearch()
            }).catch(error => {
              that.lmSubsidySearch()
              loading.close() //关闭loading
              console.log(error)
            })
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
    cancel_lmSubsidy() {//解锁
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
        let searchObj = {
          "batch": this.lmSearch.month || ""
        }
        POST(process.env.VUE_APP_DOMAIN_personnel + '/unlockModelworkerAllowance', searchObj).then(res => {
          if (res.code == 0) {//锁定
            this.$message({
              type: 'success',
              message: '取消提交成功!',
              showClose: true
            })
            this.lmSubsidyCheck()
          }
        }).catch(error => {
          console.log(error)
        })
      }).catch(() => {

      })

    },
    lmHandleSizeChange(val) {
      this.lmSize = val
      this.lmSubsidySearch()
    },
    lmHandlecurrentChange(val) {
      this.lmCurrent = val
      this.lmSubsidySearch()
    },
    JS_lmSearch() {
      this.lmCurrent = 1 //点击搜索current=1搜索第一页
      this.lmSubsidySearch()
    },
    lm_add_save(formName) {//新增补贴公用
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.aidChangeFlag) {//判断是否锁定员工
            let apiMark = '';
            if (this.activeName == 'first') {
              apiMark = '/incomeBoardAllowance'
            } else if (this.activeName == 'second') {
              apiMark = '/incomeRentAllowance'
            } else if (this.activeName == 'third') {
              apiMark = '/incomeSocialAllowance'
            } else if (this.activeName == 'five') {
              apiMark = '/incomeEducationAllowance'
            } else if (this.activeName == 'seven') {
              apiMark = '/incomeModelWorkerAllowance'
            }
            POST(process.env.VUE_APP_DOMAIN_personnel + apiMark, this[formName]).then(res => {
              this.$message({
                type: 'success',
                message: '新增数据成功!',
                showClose: true
              })
              if (this.activeName == 'first') {
                this.mealSubsidySearch()
                this.reset('addMealSubsidyform')
                this.addMealSubsidy = false
              } else if (this.activeName == 'second') {
                this.hsSubsidySearch()
                this.reset('addhsSubsidyform')
                this.addhsSubsidy = false
              } else if (this.activeName == 'third') {
                this.socialSubsidySearch()
                this.reset('addsocialSubsidyform')
                this.addsocialSubsidy = false
              } else if (this.activeName == 'five') {
                this.eduSubsidySearch()
                this.reset('addeduSubsidyform')
                this.addeduSubsidy = false
              } else if (this.activeName == 'seven') {
                this.lmSubsidySearch()
                this.reset('addlmSubsidyform')
                this.addlmSubsidy = false
              }
            }).catch(error => {
              console.log(error)
            })
          } else {
            this.$message({
              type: 'fail',
              message: '请获取员工信息!',
              showClose: true
            })
          }
        }
      });
    },
    deleteLm(id) {
      let batch = this.lmSearch.month
      this.$msgBox.confirm('你确定要删除该条数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DELETE(process.env.VUE_APP_DOMAIN_personnel + '/incomeModelWorkerAllowances', { "ids": id, "batch": batch }).then(res => { //单条数据删除
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.lmSubsidySearch() //刷新表格，重新获取数据
        }).catch(error => {
          console.log(error)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    lmDialogClose() {
      this.addlmSubsidy = false
      this.reset('addlmSubsidyform')
    },
    // 劳模补贴导入相关
    handleSuccessLm(res) {//上传文件接口调取成功回调
      this.uploadLmModal = false; //关闭导入框
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
    JS_lm_download() {//劳模补贴导入下载模板@劳模补贴  fileCode需要后端提供
      GET(process.env.VUE_APP_DOMAIN_personnel + "/queryBizFilesTemplate", { fileCode: 'PERSONNEL_MODELWORKERALLOWANCE_IMPORT_TEMPLATE' })
        .then(res => {
          //获取模板存储返回的ID
          let url = `${process.env.VUE_APP_DOMAIN_download}/oss/download?key=${res.data.fileTemplateId}&name=${res.data.fileTemplateName}.${res.data.fileTemplateSuffix}`;
          window.location.href = url;
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 中途异动
    handleSuccessMv(res) {//上传文件接口调取成功回调
      this.uploadMvModal = false; //关闭导入框
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

    JS_mv_download() {
      GET(process.env.VUE_APP_DOMAIN_personnel + "/queryBizFilesTemplate", { fileCode: 'PERSONNEL_INCOMEPOSITIONADJUSTMENT_IMPORT_TEMPLATE' })
        .then(res => {
          //获取模板存储返回的ID
          let url = `${process.env.VUE_APP_DOMAIN_download}/oss/download?key=${res.data.fileTemplateId}&name=${res.data.fileTemplateName}.${res.data.fileTemplateSuffix}`;
          window.location.href = url;
        })
        .catch(error => {
          console.log(error);
        });
    },
    mvSubmitChange() {
      this.mvSubsidySearch()
    },
    mvIgnoreSubmit(id) {
      let ignoreObj = {
        "batch": this.mvSearch.batch || "",
        "confirmStatus": 2,
        "ids": [id]
      }
      // console.log(ignoreObj)
      PUT(process.env.VUE_APP_DOMAIN_personnel + "/positionAdjustmentConfirmStatus", ignoreObj).then(res => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: '忽略提交成功!',
            showClose: true
          })
          this.mvSubsidySearch()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    mvCancelIgnore(id) {
      let ignoreObj = {
        "batch": this.mvSearch.batch || "",
        "confirmStatus": 3,
        "ids": [id]
      }
      PUT(process.env.VUE_APP_DOMAIN_personnel + "/positionAdjustmentConfirmStatus", ignoreObj).then(res => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: '取消忽略成功!',
            showClose: true
          })
          this.mvSubsidySearch()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    mvSubsidySearch() {//数据列表
      let searchObj = {
        "current": this.mvCurrent, //当前页码
        "size": this.mvSize, //每页显示记录条数
        "aid": this.mvSearch.staffNum || "",
        "name": this.mvSearch.name || "",
        "batch": this.mvSearch.batch || "",
        "isConfirm": this.mvSubmitValue || '' //表头提交状态        
      }
      console.log('搜索对象', searchObj)
      this.loading = true //开启动画
      POST(process.env.VUE_APP_DOMAIN_personnel + '/incomePositionAdjustments', searchObj).then(res => {
        this.loading = false //关闭动画
        this.mvSubsidyData = res.data.records //set表格的值
        this.mvCurrent = res.data.current //set当前页
        this.mvPages = res.data.pages //总记录条数
        this.mvSize = res.data.size //每页显示记录条数
        this.mvTotal = res.data.total //总记录条数
        this.mvSubsidyCheck()
      }).catch(error => {
        this.loading = false
        console.log(error)
      })
    },
    mvSubsidyCheck() {//锁定状态
      let searchObj = {
        "batch": this.mvSearch.batch || ""
      }
      console.log('搜索对象', searchObj)
      GET(process.env.VUE_APP_DOMAIN_personnel + '/positionAdjustmentFinancialDataLockStatus', searchObj).then(res => {
        console.log(res)
        if (res.code == 3) {//锁定
          this.mvDisabled = true
        } else if (res.code == 0) {
          this.mvDisabled = false
        }
      }).catch(error => {
        console.log(error)
      })
    },
    update_mvSubsidy() {//上报
      const that = this;
      this.$msgBox.confirm('<span>请确认你上传的' + this.mvSearch.batch + '月份</span><span style="color:red;">【中途岗位异动】</span><span>无误，确认提交后，将直接影响工资准确发放。</span>', '温馨提示', {
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
            let searchObj = {
              "batch": this.mvSearch.batch || ""
            }
            console.log(searchObj);
            POST(process.env.VUE_APP_DOMAIN_personnel + '/reportPositionAdjustment', searchObj).then(res => {
              loading.close() //关闭loading
              if (res.code == 0) {//锁定
                this.$message({
                  type: 'success',
                  message: '上报数据成功!',
                  showClose: true
                })
              }
              this.mvSubsidySearch()
            }).catch(error => {
              this.mvSubsidySearch()
              loading.close() //关闭loading
              console.log(error)
            })
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
    cancel_mvSubsidy() {//解锁
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
        let searchObj = {
          "batch": this.mvSearch.batch || ""
        }
        POST(process.env.VUE_APP_DOMAIN_personnel + '/unlockPositionAdjustment', searchObj).then(res => {
          if (res.code == 0) {//锁定
            this.$message({
              type: 'success',
              message: '取消提交成功!',
              showClose: true
            })
            this.mvSubsidySearch()
          }
        }).catch(error => {
          console.log(error)
        })
      }).catch(() => {
      })
    },
    count() {//计算异动前后加权计算综合工资
      let num = (this.mvSubsidyform.preSalary * this.mvSubsidyform.preAttendance + this.mvSubsidyform.afterSalary * this.mvSubsidyform.afterAttendance)
      let searchObj = {
        "batch": this.mvSearch.batch,
        "aid": this.mvSubsidyform.aid
      }
      GET(process.env.VUE_APP_DOMAIN_personnel + '/positionAdjustmentgetWorkingHours', searchObj).then(res => {
        console.log(res)
        if (res.code == 0) {
          if (res.data) {
            let num2 = num / res.data
            this.mvSubsidyform.comprehensivSalary = num2.toFixed(2)
          } else {
            this.$message({
              type: 'fail',
              message: '未查询到当前员工的应出勤工时，计算失败！',
              showClose: true
            })
            this.mvSubsidyform.comprehensivSalary = 0
            this.mvAddSaveFlag = true
          }
        }
      }).catch(error => {
        console.log(error)
      })
    },
    count2() {//计算异动前后加权计算综合工资
      let num = (this.updateMvSubsidyform.preSalary * this.updateMvSubsidyform.preAttendance + this.updateMvSubsidyform.afterSalary * this.updateMvSubsidyform.afterAttendance)
      let searchObj = {
        "batch": this.mvSearch.batch,
        "aid": this.updateMvSubsidyform.aid
      }
      GET(process.env.VUE_APP_DOMAIN_personnel + '/positionAdjustmentgetWorkingHours', searchObj).then(res => {
        console.log(res)
        if (res.code == 0) {
          let num2 = num / res.data
          this.updateMvSubsidyform.comprehensivSalary = num2.toFixed(2)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    mvHandleSizeChange(val) {
      this.mvSize = val
      this.mvSubsidySearch()
    },
    mvHandlecurrentChange(val) {
      this.mvCurrent = val
      this.mvSubsidySearch()
    },
    JS_mvSearch() {
      this.mvCurrent = 1 //点击搜索current=1搜索第一页
      this.mvSubsidySearch()
    },
    mvAidSearch() {
      let reg = /^8[0-1][0-9]{8}$/;
      let num = this.mvSubsidyform.aid;
      if (num && reg.test(num)) {//验证员工编号
        GET(process.env.VUE_APP_DOMAIN_personnel + '/userInfo', { aid: num }).then(res => {
          if (res.code == 0) {
            if (res.data) {
              this.aidChangeFlag = true;
              //this.mvSubsidyform = {...res.date}
              this.mvSubsidyform.gender = String(res.data.sex);
              this.mvSubsidyform.name = res.data.userName;
            } else {
              this.$message({
                type: 'fail',
                message: '员工不存在，请重新输入!',
                showClose: true
              })
            }

          }
        }).catch(error => {
          console.log(error)
        })
      } else {
        this.$message({
          type: 'fail',
          message: '员工编号数据有误!',
          showClose: true
        })
      }
    },
    mv_add_save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let selectLabelObj = { //通过$refs获取select Label值
            "preWorkAreaName": this.$refs.areaPre.selectedLabel,
            "afterWorkAreaName": this.$refs.areaAfter.selectedLabel
          }
          let saveObj = { ...this[formName], ...selectLabelObj } //保存对象
          console.log(saveObj);
          if (this.aidChangeFlag) {//判断是否锁定员工
            POST(process.env.VUE_APP_DOMAIN_personnel + '/incomePositionAdjustment', saveObj).then(res => {
              if (res.code == 0) {
                this.$message({
                  type: 'success',
                  message: '新增数据成功!',
                  showClose: true
                })
                this.mvSubsidySearch()
                this.addmvSubsidy = false
                this.reset('mvSubsidyform')
              }
            }).catch(error => {
              console.log(error)
            })
          } else {
            this.$message({
              type: 'fail',
              message: '请获取员工信息!',
              showClose: true
            })
          }
        }
      });
    },
    updateMv(id) {//修改补贴前获取用户信息 '/incomeModelWorkerAllowance',id,updatelmSubsidyform,updatelmSubsidy
      GET(process.env.VUE_APP_DOMAIN_personnel + '/incomePositionAdjustment', { "id": id }).then(res => {//查询薪资类型模板
        this.updateMvSubsidyform = res.data
        this.updateMvSubsidyform.afterWorkAreaId = parseInt(this.updateMvSubsidyform.afterWorkAreaId);
        this.updateMvSubsidyform.preWorkAreaId = parseInt(this.updateMvSubsidyform.preWorkAreaId);
        this.updateMvSubsidy = true
        console.log('查询薪资类型模板', res.data)
      }).catch(error => {
        console.log(error)
      })
    },
    deleteMv(id) {
      let batch = this.mvSearch.batch
      this.$msgBox.confirm('你确定要删除该条数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(id);
        console.log(batch);
        DELETE(process.env.VUE_APP_DOMAIN_personnel + '/incomePositionAdjustments', { "ids": id, "batch": batch }).then(res => { //单条数据删除
          // this.initSalaryData.splice(index,1) //前端删除当前行
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.mvSubsidySearch() //刷新表格，重新获取数据
        }).catch(error => {
          console.log(error)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    mvDialogClose() {
      this.mvAddSaveFlag = false
      this.addmvSubsidy = false
      this.reset('mvSubsidyform')
    },
    //根据员工编号获取个人信息
    getUserInfo(num) {
      GET(process.env.VUE_APP_DOMAIN_personnel + "/userInfo", { aid: num })
        .then(res => {
          //查询薪资类型模板
          console.log(res.data);
          this.personalInfoData = res.data;
          this.personalInfoData.employedDates = this.personalInfoData.employedDates.split(
            " "
          )[0];
        })
        .catch(error => {
          console.log(error);
        });
    },
    queryAreaList() {//获取所属区域
      POST(process.env.VUE_APP_DOMAIN_personnel + '/queryAreaList').then(res => {
        this.areaOptions = res.data
      }).catch(error => {
        console.log(error)
      })
    },
    queryHrTypeList() {//获取员工类型
      POST(process.env.VUE_APP_DOMAIN_personnel + '/queryHrTypeList').then(res => {
        this.hrTypeOptions = res.data
        console.log(this.hrTypeOptions);
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>
<style scoped>
.adapteWidth {
  width: 155px;
}
@media screen and (max-width: 1400px) {
  .adapteWidth {
    width: 130px;
  }
}
</style>
