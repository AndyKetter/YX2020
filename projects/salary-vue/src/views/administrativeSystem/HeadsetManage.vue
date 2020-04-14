<template>
  <div>
    <div class="guide">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home/administrativeSystem' }">行政系统</el-breadcrumb-item>
        <el-breadcrumb-item>耳机管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/administrativeSystem' }">(返回上级)</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="bgWhite mgt15">
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="耳机管理" name="first">
          <!-- 查询栏 start -->
          <div class="pull-left">
            <el-form :inline="true" class="mar-no" :model="monthFormSearch">
              <el-form-item label="姓名">
                <el-input
                  clearable
                  @keyup.enter.native="inputEnter"
                  v-model.trim="monthFormSearch.name"
                  placeholder="请输入名字"
                  class="width155"
                ></el-input>
              </el-form-item>
              <el-form-item label="员工编号">
                <el-input-number
                  @keyup.enter.native="inputEnter"
                  placeholder="请输入编号"
                  :controls="false"
                  v-model="monthFormSearch.employedNo"
                  class="width155"
                  :min="0"
                  :max="88888888888"
                ></el-input-number>
              </el-form-item>
              <!-- <el-form-item label="平台账号">
                <el-input-number
                  @keyup.enter.native="inputEnter"
                  placeholder="请输入编号"
                  :controls="false"
                  v-model="monthFormSearch.aid"
                  class="width155"
                  :min="0"
                  :max="88888888888"
                ></el-input-number>
              </el-form-item>-->
              <el-form-item label="耳机编码">
                <el-input
                  clearable
                  @keyup.enter.native="inputEnter"
                  v-model="monthFormSearch.headsetId"
                  placeholder="请输入编码"
                  class="width155"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="onSubmit">搜索</el-button>
                <el-button @click="search_more=true">更多查询</el-button>
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
                <el-dropdown-item command="a" icon="el-icon-plus">
                  <i></i>新增
                </el-dropdown-item>
                <el-dropdown-item command="b" divided>批量删除</el-dropdown-item>
                <el-dropdown-item command="c" divided class="cloud-uploadBtn">
                  <i></i>&nbsp;导入
                </el-dropdown-item>
                <el-dropdown-item command="d" divided class="cloud-downloadBtn">
                  <i></i>&nbsp;导出
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="table_wrap">
            <el-table
              v-loading="loading"
              :data="headsetData"
              :height="tabHeight"
              border
              ref="multipleTable"
              @selection-change="val => multipleSelection = val"
              style="width:100%"
              :header-cell-style="{backgroundColor:'#e5e9f3'}"
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column type="index" label="序号" min-width="50"></el-table-column>
              <el-table-column label="领用人" min-width="150">
                <template slot-scope="scope">
                  <!-- <span>{{scope.row.useName}}</span> -->
                  <el-popover
                    v-if="scope.row.employedNo"
                    trigger="click"
                    placement="top"
                    @show="getUserInfo(scope.row.employedNo,'aid')"
                    width="450"
                  >
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>

                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.useName}}</el-button>
                    </div>
                  </el-popover>
                  <span v-else>{{scope.row.useName}}</span>
                </template>
              </el-table-column>
              <!-- <el-table-column label="平台账号" min-width="120">
                <template slot-scope="scope">
                  
                  <span>{{fliterPhone(scope.row.mobilePhone,scope.row.showPhone)}}</span>
                  <i
                    class="el-icon-view tbIconPhone"
                    v-if="scope.row.mobilePhone && permissions(permissionsMapObj['操作-查看手机号'])"
                    @click="showPhoneNumber(scope.row)"
                  ></i>
                </template>
              </el-table-column>-->
              <el-table-column label="员工编号" min-width="120">
                <template slot-scope="scope">
                  <span>{{scope.row.employedNo}}</span>
                  <!-- <i v-if="scope.row.employedNo" class="el-icon-phone tbIconPhone"></i> -->
                </template>
              </el-table-column>
              <el-table-column prop="serialNumber" label="耳机编码" min-width="160"></el-table-column>
              <el-table-column min-width="170">
                <template slot="header">
                  <el-select
                    v-model="getstatus"
                    filterable
                    placeholder="领用情况"
                    clearable
                    style="width:150px;"
                    @change="onSubmit"
                    class="selectRepairIcon"
                  >
                    <el-option
                      v-for="item in getOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
                <template slot-scope="scope">
                  <span v-if="scope.row.useStatus==1">未领用</span>
                  <span v-else-if="scope.row.useStatus==2">已领用</span>
                  <span v-else-if="scope.row.useStatus==3">已归还</span>
                  <span v-else-if="scope.row.useStatus==4">未归还</span>
                </template>
              </el-table-column>
              <el-table-column min-width="170">
                <template slot="header">
                  <el-select
                    v-model="headsetStatus"
                    filterable
                    placeholder="耳机状态"
                    clearable
                    style="width:150px;"
                    @change="onSubmit"
                    class="selectRepairIcon"
                  >
                    <el-option
                      v-for="item in headsetOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
                <template slot-scope="scope">
                  <span v-if="scope.row.singleProductStatus==0">正常</span>
                  <span v-else-if="scope.row.singleProductStatus==1">维修中</span>
                  <span v-else-if="scope.row.singleProductStatus==3">已报废</span>
                </template>
              </el-table-column>

              <el-table-column min-width="170">
                <template slot="header">
                  <el-select
                    v-model="instayStatus"
                    filterable
                    placeholder="在职状态"
                    clearable
                    style="width:150px;"
                    @change="onSubmit"
                    class="selectRepairIcon"
                  >
                    <el-option
                      v-for="item in instayOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
                <template slot-scope="scope">
                  <span v-if="scope.row.userStatus==1">在职</span>
                  <span v-else-if="scope.row.userStatus==2">离职</span>
                </template>
              </el-table-column>
              <el-table-column label="领用时间" prop="useTime" min-width="150"></el-table-column>
              <el-table-column label="归还时间" prop="returnTime" min-width="150"></el-table-column>
              <el-table-column label="耳机扣款" prop="brokenMoney" min-width="80"></el-table-column>
              <el-table-column label="扣款时间" prop="brokenTime" min-width="150"></el-table-column>
              <el-table-column prop="remarks" label="备注" min-width="250" show-overflow-tooltip></el-table-column>
              <el-table-column prop="updateUserName" label="经办人" min-width="150">
                <template slot-scope="scope">
                  <el-popover
                    v-if="scope.row.updateUser"
                    trigger="click"
                    placement="top"
                    @show="getUserInfo(scope.row.updateUser,'regid')"
                    width="450"
                  >
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.updateUserName}}</el-button>
                    </div>
                  </el-popover>
                  <span v-else>{{scope.row.updateUserName}}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" min-width="220" fixed="right">
                <template slot-scope="scope">
                  <!-- getModal=true -->
                  <el-button
                    type="text"
                    :disabled="(scope.row.useStatus == 2 || scope.row.useStatus==4) ||
                    (scope.row.singleProductStatus != 0)"
                    size="small"
                    @click="getModalInfo(scope.row)"
                  >领用</el-button>
                  <el-button
                    type="text"
                    :disabled="scope.row.useStatus!=2 && scope.row.useStatus!=4 ||
                    (scope.row.singleProductStatus != 0)"
                    size="small"
                    @click="returnModalInfo(scope.row)"
                  >归还</el-button>
                  <el-button type="text" size="small" @click="getDetailModal(scope.row)">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div id="pagination">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handlecurrentChange"
                background
                :current-page="current"
                :page-sizes="[10,15,20,30,40]"
                :page-size="size"
                layout="total,sizes,prev,pager,next,jumper"
                :total="total"
              ></el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <!-- 222 -->
        <el-tab-pane label="领用历史查询" name="second" v-if="useHistoryTab">
          <!-- 查询栏 start -->
          <div class="pull-left">
            <el-form :inline="true" class="mar-no" :model="historyFormSearch">
              <el-form-item label="领用人姓名：" prop="regid">
                <el-select
                  v-model="historyFormSearch.regid"
                  clearable
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入姓名或员工编号"
                  :remote-method="remoteMethod_search"
                  :loading="loading_search"
                  style="width:180px"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.regid"
                    :label="item.user_name"
                    :value="item.regid"
                  >
                    <span style="float: left">{{ item.user_name }}</span>
                    <span
                      style="float: right; color: #8492a6; font-size: 13px"
                    >{{ item.employed_no }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="耳机编码">
                <el-input
                  clearable
                  @keyup.enter.native="inputEnter"
                  v-model="historyFormSearch.serialNumber"
                  placeholder="请输入编码"
                  class="width155"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="historySearch()">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="pull-right">
            <el-button type="primary" @click="exportModal =true" v-if="exportHistory">导出</el-button>
          </div>
          <div class="table_wrap">
            <el-table
              v-loading="Hloading"
              :data="historyData"
              :height="tabHeight"
              border
              ref="multipleTable"
              @selection-change="val => multipleSelection = val"
              style="width:100%"
              :header-cell-style="{backgroundColor:'#e5e9f3'}"
              @sort-change="historySortChange"
            >
              <el-table-column type="index" label="序号" min-width="50"></el-table-column>
              <el-table-column prop="serialNumber" label="耳机编码" min-width="160"></el-table-column>
              <el-table-column label="领用人" min-width="150">
                <template slot-scope="scope">
                  <el-popover
                    v-if="scope.row.employedNo"
                    trigger="click"
                    placement="top"
                    @show="getUserInfo(scope.row.employedNo,'aid')"
                    width="450"
                  >
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>

                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.useName}}</el-button>
                    </div>
                  </el-popover>
                  <span v-else>{{scope.row.useName}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="employedNo" label="员工编号" min-width="120"></el-table-column>
              <el-table-column
                prop="levelExpand"
                label="员工上下级"
                min-width="250"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column label="领用时间" prop="useTime" min-width="150" sortable="custom"></el-table-column>
              <el-table-column label="归还时间" prop="returnTime" min-width="150" sortable="custom"></el-table-column>
              <el-table-column prop="updateUserName" label="经办人" min-width="150">
                <template slot-scope="scope">
                  <el-popover
                    v-if="scope.row.updateUser"
                    trigger="click"
                    placement="top"
                    @show="getUserInfo(scope.row.updateUser,'regid')"
                    width="450"
                  >
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.updateUserName}}</el-button>
                    </div>
                  </el-popover>
                  <span v-else>{{scope.row.updateUserName}}</span>
                </template>
              </el-table-column>
              <el-table-column label="耳机扣款" min-width="80">
                <template slot-scope="scope">
                  <span v-if="scope.row.brokenMoney">{{scope.row.brokenMoney}}</span>
                  <span v-else>--</span>
                </template>
              </el-table-column>
              <el-table-column label="扣款年月" min-width="150">
                <template slot-scope="scope">
                  <span v-if="scope.row.brokenTime">{{scope.row.brokenTime}}</span>
                  <span v-else>--</span>
                </template>
              </el-table-column>
              <el-table-column prop="remarks" label="备注" min-width="250" show-overflow-tooltip></el-table-column>
            </el-table>
            <!-- 分页 -->
            <div id="pagination">
              <el-pagination
                @size-change="HhandleSizeChange"
                @current-change="HhandlecurrentChange"
                background
                :current-page="Hcurrent"
                :page-sizes="[10,15,20,30,40]"
                :page-size="Hsize"
                layout="total,sizes,prev,pager,next,jumper"
                :total="Htotal"
              ></el-pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 更多查询弹框 -->
    <el-dialog title="更多查询" :close-on-click-modal="false" :visible.sync="search_more" width="700px">
      <el-form :inline="true" :model="moreParam" ref="moreParam" class="mar-no" label-width="90px">
        <!-- <el-form-item label="员工编号">
          <el-input-number
            @keyup.enter.native="inputEnter"
            placeholder="请输入编号"
            :controls="false"
            v-model="moreParam.aid"
            class="width155"
            :min="0"
            :max="8888888888"
          ></el-input-number>
        </!-->
        <el-form-item label="领用时间">
          <el-date-picker
            v-model="moreParam.month"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width:240px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="经办人">
          <el-input
            clearable
            @keyup.enter.native="inputEnter"
            v-model.trim="moreParam.masterName"
            placeholder="请输入名字"
            class="width155"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="search_more=false">取消</el-button>
        <el-button type="primary" @click="JS_more_Search">立即搜索</el-button>
      </span>
    </el-dialog>

    <!-- 新增弹框 -->
    <el-dialog title="新增耳机" :close-on-click-modal="false" :visible.sync="addModal" width="768px">
      <el-form :model="addform" :rules="addformRule" ref="addform" label-width="100px">
        <el-row>
          <el-col :md="12">
            <el-form-item label="耳机编码：" prop="trafficAllowance">
              <el-input
                clearable
                v-model="addform.trafficAllowance"
                placeholder="请输入耳机编码"
                class="width155"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="耳机状态" prop="phoneAllowance">
              <el-select
                v-model="addform.phoneAllowance"
                filterable
                placeholder="耳机状态"
                clearable
                style="width:150px;"
                class="selectRepairIcon"
              >
                <el-option
                  v-for="item in headsetOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAddModal">取消</el-button>
        <el-button type="primary" @click="JS_add_save('addform')" v-no-more-click>保存</el-button>
      </span>
    </el-dialog>

    <!-- 删除温馨提示弹框 -->
    <el-dialog title="温馨提示" :close-on-click-modal="false" :visible.sync="deleWarn" width="520px">
      <el-row>
        <el-col :md="21" :offset="3" class="warnIcoBg">
          <h2>您确定要批量删除数据？</h2>
          <span style="color:red">注：删除后不可恢复！</span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleWarn = false">取消</el-button>
        <el-button type="primary" @click="deleteCheckedList">确定</el-button>
      </span>
    </el-dialog>

    <!-- 耳机领用弹框 -->
    <el-dialog title="耳机领用" :close-on-click-modal="false" :visible.sync="getModal" width="500px">
      <el-form :model="getform" :rules="getformRule" ref="getform" label-width="150px">
        <el-row>
          <el-col :md="24">
            <!-- <el-form-item label="领用人：" prop="useName">
              <el-input clearable v-model="getform.useName" placeholder="请输入名字" class="width155"></el-input>
            </el-form-item>-->
            <el-form-item label="领用人：" prop="regid">
              <el-select
                v-model="getform.regid"
                clearable
                filterable
                remote
                reserve-keyword
                placeholder="请输入姓名或员工编号"
                :remote-method="remoteMethod_search"
                :loading="loading_search"
                style="width:180px"
              >
                <el-option
                  v-for="item in options"
                  :key="item.regid"
                  :label="item.user_name"
                  :value="item.regid"
                >
                  <span style="float: left">{{ item.user_name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.employed_no }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="24">
            <el-form-item label="耳机编码：" prop="serialNumber">
              <el-input
                clearable
                v-model="getform.serialNumber"
                placeholder="请输入耳机编码"
                style="width:180px"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24">
            <el-form-item label="领用时间：" prop="useTime">
              <el-date-picker
                v-model="getform.useTime"
                type="date"
                placeholder="选择日期"
                style="width:180px"
                value-format="yyyy-MM-dd"
                :picker-options="disabledNowDateBefore"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer" style="text-align:right">
        <el-button @click="cancelModalHeads('getform')">取消</el-button>
        <el-button type="primary" @click="getModalHeads('getform')" v-no-more-click>保存</el-button>
      </span>
    </el-dialog>

    <!-- 耳机归还弹框 -->
    <el-dialog title="耳机归还" :close-on-click-modal="false" :visible.sync="returnModal" width="500px">
      <el-form :model="returnform" :rules="returnformRule" ref="returnform" label-width="130px">
        <el-row>
          <el-col :md="24">
            <el-form-item v-if="returnform.useName" label="领用人：" prop="name">
              <el-input
                clearable
                v-model="returnform.useName"
                placeholder="请输入名字"
                style="width:300px"
              ></el-input>
            </el-form-item>
            <el-form-item v-else label="领用人：" prop="regid">
              <el-select
                v-model="returnform.regid"
                clearable
                filterable
                remote
                reserve-keyword
                placeholder="请输入姓名或手机号"
                :remote-method="remoteMethod_search"
                :loading="loading_search"
                style="width:300px"
              >
                <el-option
                  v-for="item in options"
                  :key="item.regid"
                  :label="item.user_name"
                  :value="item.regid"
                >
                  <span style="float: left">{{ item.user_name }}</span>
                  <span
                    style="float: right; color: #8492a6; font-size: 13px"
                  >{{ item.mobile_phone }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="24">
            <el-form-item label="耳机编码：" prop="serialNumber">
              <el-input
                disabled
                v-model="returnform.serialNumber"
                placeholder="请输入耳机编码"
                style="width:300px"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24">
            <el-form-item label="归还状态：" prop="useStatus">
              <template>
                <el-radio v-model="returnform.useStatus" :label="3">已归还</el-radio>
                <el-radio v-model="returnform.useStatus" :label="4">未归还</el-radio>
              </template>
            </el-form-item>
          </el-col>
          <el-col :md="24">
            <el-form-item label="耳机状态：" prop="singleProductStatus">
              <template>
                <el-radio v-model="returnform.singleProductStatus" :label="0">正常</el-radio>
                <el-radio v-model="returnform.singleProductStatus" :label="1">维修中</el-radio>
                <el-radio v-model="returnform.singleProductStatus" :label="3">已报废</el-radio>
              </template>
            </el-form-item>
          </el-col>
          <el-col :md="24">
            <el-form-item label="耳机扣款：" prop="brokenMoney">
              <el-input-number
                clearable
                v-model="returnform.brokenMoney"
                placeholder="如需扣款，请输入扣款金额"
                style="width:300px"
                :disabled="returnform.useStatus==3&&(returnform.singleProductStatus==0||returnform.singleProductStatus==1)"
                :controls="false"
                :min="0"
                @input.native="handleChange"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :md="24">
            <el-form-item label="扣款年月：" prop="brokenTime">
              <el-date-picker
                v-model="returnform.brokenTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                style="width:300px"
                :disabled="returnform.useStatus==3&&(returnform.singleProductStatus==0||returnform.singleProductStatus==1)"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :md="24">
            <el-form-item label="备注：" prop="remarks">
              <el-input
                type="textarea"
                :autosize="{ minRows:3, maxRows: 4}"
                resize="none"
                placeholder="请备注耳机归还异常情况，扣款原因等"
                v-model.trim="returnform.remarks"
                style="width:300px"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelReturnModalHeads('returnform')">取消</el-button>
        <el-button type="primary" @click="returnModalHeads('returnform')" v-no-more-click>保存</el-button>
      </span>
    </el-dialog>

    <!-- 详情弹框 -->
    <el-dialog
      title="耳机详情"
      :close-on-click-modal="false"
      :visible.sync="detailModal"
      width="1200px"
      class="grayBg"
    >
      <div class="whiteBox">
        <p class="pReset">基本信息</p>
        <el-row class="textLft">
          <el-col :span="3" class="height26">耳机编码：</el-col>
          <el-col :span="3" class="height26">{{headsdetail.serialNumber}}</el-col>
          <el-col :span="2" class="height26">耳机状态：</el-col>
          <el-col :span="3" class="height26">
            {{headsdetail.singleProductStatus == 0 ? '正常' :
            headsdetail.singleProductStatus == 1 ? '维修中' : '已报废'
            }}
          </el-col>
          <el-col :span="2" class="height26">领用情况：</el-col>
          <el-col :span="4" class="height26">
            {{headsdetail.useStatus == 1 || headsdetail.useStatus == 3 ? '未领用' :
            headsdetail.useStatus == 2 ? '已领用' : '未归还'}}
          </el-col>
        </el-row>
      </div>
      <div class="whiteBox">
        <p class="pReset">耳机明细</p>
        <el-table
          :data="loanpayDetailData"
          border
          style="width:100%"
          height="350"
          :header-cell-style="{backgroundColor:'#e5e9f3'}"
        >
          <el-table-column type="index" label="序号" min-width="50"></el-table-column>
          <el-table-column prop="useName" label="领用人" min-width="80"></el-table-column>
          <el-table-column prop="mobilePhone" label="平台账号" min-width="120"></el-table-column>
          <el-table-column prop="useTime" label="领用时间" min-width="160"></el-table-column>
          <el-table-column prop="returnTime" label="归还时间" min-width="160"></el-table-column>
          <el-table-column prop="updateUserName" label="经办人" min-width="80"></el-table-column>
          <el-table-column prop="brokenMoney" label="耳机扣款" min-width="80"></el-table-column>
          <el-table-column prop="brokenTime" label="扣款年月" min-width="160"></el-table-column>
          <el-table-column prop="remarks" label="备注" min-width="200"></el-table-column>
        </el-table>
        <div class="detail-pagination">
          <el-pagination
            @size-change="handleDetailSizeChange"
            @current-change="handleDetailCurrentChange"
            background
            :current-page="detailPagination.current"
            :page-sizes="[10,15,20,30]"
            :page-size="detailPagination.size"
            layout="total,sizes,prev,pager,next,jumper"
            :total="detailPagination.total"
          ></el-pagination>
        </div>
      </div>
    </el-dialog>

    <!-- 导入弹框 -->
    <el-dialog
      title="导入"
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="uploadModal"
      width="520px"
    >
      <p class="clearfix">
        <el-upload
          class="pull-left"
          :action="uploadActionUrl"
          ref="upload"
          :headers="headers"
          :before-remove="beforeRemove"
          :before-upload="beforeUpload"
          :on-success="handleSuccess"
          :file-list="fileList"
        >
          <el-button size="mediumn" class="cloud-uploadBtn">
            <i></i>&nbsp;导入数据
          </el-button>
          <el-button
            @click.stop="JS_download"
            size="mediumn"
            style="margin-left:15px;"
            icon="el-icon-download"
          >下载模板</el-button>
          <div slot="tip" class="el-upload__tip heads-upload-tip">
            <p>只能上传xls/xlsx文件</p>
            <p>导入文件说明如下：</p>
            <p class="state">1.用户在职状态为：（在职，离职）</p>
            <p class="state">2.耳机状态为：（正常，维修，报废）</p>
            <p class="state">3.领用情况为：（未领用，已领用，未归还）</p>
            <p class="state">4.模板中必填字段已标红</p>
          </div>
        </el-upload>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadModal = false">取消</el-button>
      </span>
    </el-dialog>

    <!-- 领用历史弹导出框 222-->
    <el-dialog
      title="领用历史导出"
      :close-on-click-modal="false"
      :visible.sync="exportModal"
      width="400px"
    >
      <el-form
        :inline="true"
        :model="exportRecordsParam"
        ref="exportRecordsParam"
        class="mar-no"
        label-width="90px"
      >
        <el-form-item label="领用日期">
          <el-date-picker
            v-model="exportRecordsParam.getMonth"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width:240px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="归还日期">
          <el-date-picker
            v-model="exportRecordsParam.returnMonth"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width:240px"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="exportModal=false">取消</el-button>
        <el-button type="primary" @click="JS_exportHistory()">导出</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { GET, POST, PUT, DELETE } from "http/custom.js"
import qs from "qs"
import tbMixin from "libs/mixin/tbMixin.js" //动态计算表格高度mixin
import Tools from "untils/index"
export default {
  name: "HeadsetManage",
  mixins: [tbMixin],
  filters: {
    // 过滤手机号码
    // fliterPhone(str) {
    //   if (str) {
    //     return str.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2")
    //   }
    //   return str
    // }
  },
  computed: {
    // 是否过滤手机号码
    fliterPhone() {
      return (str, isShow) => {
        if (isShow) {
          return str
        } else {
          return (str && str.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2")) || str
        }
      }
    },
    permissions() {
      //通过老oa配置的id,判断当前 用户是否有对应的权限
      return powerid => {
        return Tools.includes(this.$store.state.userActionAll, powerid)
      }
    },
    useHistoryTab() {
      //领用历史查询tab权限
      return Tools.includes(this.$store.state.userActionAll, "50eea9eca62f46e987c28dc8c2e34ebf")
    },
    exportHistory() {
      //领用历史查询内导出权限
      return Tools.includes(this.$store.state.userActionAll, "fa8dd93f51c049f5b32aac44cd60b025")
    }
  },
  data() {
    const uploadActionUrl = process.env.VUE_APP_DOMAIN_administration + "/prductuser/importData" //导入action  线上
    return {
      t_height: 315, //减去的高度
      activeName: "first",
      permissionsMapObj: {
        //老系统action权限映射对象
        "操作-查看手机号": "5fbc6e241a9b4cc79a8e26fef188d45a"
      },
      search_more: false,
      addModal: false,
      deleWarn: false,
      getModal: false, //耳机领用弹框
      returnModal: false, //耳机归还弹框
      personalInfoData: {}, //领用人信息
      loading_search: false, //领用时，加载动画
      loading: false, //table加载动画开关
      current: 1, //当前页码
      size: 15, //每页显示记录条数
      total: 0, //总记录条数
      getstatus: "",
      headsetStatus: undefined,
      instayStatus: "",
      monthFormSearch: {
        name: "",
        employedNo: undefined,
        headsetId: ""
      },
      moreParam: {
        month: "",
        masterName: "",
        aid: undefined
      },
      addform: {
        trafficAllowance: "",
        phoneAllowance: ""
      },
      headsetOptions: [{ value: 0, label: "正常" }, { value: 1, label: "维修中" }, { value: 3, label: "已报废" }],
      getOptions: [{ value: 1, label: "未领用" }, { value: 2, label: "已领用" }, { value: 3, label: "已归还" }, { value: 4, label: "未归还" }],
      instayOptions: [{ value: 1, label: "在职" }, { value: 2, label: "离职" }],
      addformRule: {
        trafficAllowance: [{ required: true, message: "请填写耳机编码", trigger: "blur" }, { pattern: /^[0-9,a-z,A-Z,-,_]+$/, message: "必须是数字或字母", trigger: "blur" }],
        phoneAllowance: [{ required: true, message: "请选择耳机状态", trigger: "change" }]
      },
      // 领用
      getform: {
        id: "",
        serialNumber: "",
        regid: "",
        useTime: "",
        singleProductId: ""
      },
      // 领用对话框中通过人名或手机号获取数据
      options: [],
      getformRule: {
        regid: [{ required: true, message: "请填写领用人", trigger: "change" }],
        serialNumber: [{ required: true, message: "请填写话务耳机编码", trigger: "blur" }],
        useTime: [{ required: true, message: "请填写领用时间", trigger: "blur" }]
      },
      // 归还
      returnform: {
        id: "",
        regid: "",
        employedNo: "", //工号
        mobilePhone: "", //手机号
        useName: "", //领用人
        serialNumber: "", //耳机编号
        singleProductStatus: 0, //耳机状态
        useStatus: 3, //归还状态(是否归还/未归还)
        brokenMoney: "", //扣款金额
        brokenTime: "", //扣款年月
        remarks: "" //备注
      },
      returnformRule: {
        serialNumber: [{ required: true, message: "请填写话务耳机编码", trigger: "blur" }]
      },
      // 超出今天的日期无效(扣款日期,领用日期)
      disabledNowDateBefore: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6
        }
      },
      // 耳机管理界面数据列表
      headsetData: [],
      // 表格多选记录
      multipleSelection: [],
      // 耳机使用详情
      headsdetail: {},
      loanpayDetailData: [],
      detailModal: false, //详情弹框
      detailPagination: {
        //详情页翻页
        size: 10,
        current: 1,
        total: 0
      },
      // 导入
      uploadModal: false,
      fileList: [], //上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
      headers: {}, //上传图片请求头
      uploadActionUrl,
      importLoading: null,
      // 导出
      // exportDialog: false, //导出弹窗
      exportExform: {
        exportType: "" //导出方式
      },
      exportExformRule: {
        exportType: [{ required: true, message: "请选择导出方式", trigger: "change" }]
      },
      exportTypeOption: [
        //导出方式
        { value: 1, label: "保存至本地（需要等待数秒至数分钟）" },
        { value: 2, label: "发送至本人内网邮箱" }
      ],

      //领用历史查询 222
      Hloading: false, //table加载动画开关
      exportModal: false,
      Hcurrent: 1, //当前页码
      Hsize: 15, //每页显示记录条数
      Htotal: 0, //总记录条数
      historyData: [],
      historyFormSearch: {
        regid: "",
        serialNumber: ""
      },
      exportRecordsParam: {
        getMonth: "",
        returnMonth: ""
      },
      sortFlag: "returnTimeDown"
    }
  },

  methods: {
    handleChange(e) {
      console.log(e.target.value)
      var re = /^\d+\.?\d*$/
      // console.log(e.target.value!='')
      // console.log(!re.test(e.target.value))
      if (e.target.value != "" && !re.test(e.target.value)) {
        // console.log('pppp')
        this.returnform.brokenMoney = "0"
        return
      }
      var num = e.target.value
      if (num.indexOf(".") != -1) {
        var arr = num.split(".")
        // console.log(arr)
        // console.log(arr[1].length)
        if (arr[1].length > 2) {
          var str = arr[0] + "." + arr[1].substr(0, 2)
          // console.log(str)
          this.returnform.brokenMoney = str
        }
      }
    },
    //根据员工编号获取个人信息
    getUserInfo(num, flag) {
      let url, query
      if (flag === "regid") {
        url = "/queryUserInfoToRegid"
        query = { regid: num }
      } else if (flag === "aid") {
        url = "/userInfo"
        query = { aid: num }
      }
      GET(process.env.VUE_APP_DOMAIN_personnel + url, query)
        .then(res => {
          this.personalInfoData = res.data
          this.personalInfoData.employedDates = this.personalInfoData.employedDates.split(" ")[0]
        })
        .catch(error => {
          console.log(error)
        })
    },
    handleClick(tab, event) {
      //业绩排名tabs切换获取数据222
      console.log(this.activeName)
      if (this.activeName == "first") {
        this.tabSearch()
      } else {
        this.historyTabSearch()
      }
    },
    ////////
    handleCommand(command) {
      //更多操作下拉框
      if (command == "a") {
        this.addModal = true
      } else if (command == "b") {
        if (this.multipleSelection.length) {
          this.deleWarn = true
        } else {
          this.$message({ type: "warning", message: "请勾选需要删除的选项！", showClose: true })
        }
      } else if (command == "c") {
        this.uploadModal = true
      } else if (command == "d") {
        // this.reset_submit()//全部删除
        // this.exportDialog = true
        this.JS_exportSave()
      }
    },
    // 新增耳机取消
    cancelAddModal(formName) {
      this.addModal = false
      this.$refs[formName].resetFields()
    },
    JS_add_save(formName) {
      //新增耳机保存
      this.$refs[formName].validate(valid => {
        if (valid) {
          let saveObj = {
            serialNumber: this.addform.trafficAllowance,
            singleProductStatus: this.addform.phoneAllowance,
            singleProductId: "10001"
          }
          console.log("保存对象", saveObj)
          POST(process.env.VUE_APP_DOMAIN_administration + "/prductuser/save", saveObj)
            .then(res => {
              console.log(res)
              this.$message({
                type: "success",
                message: "保存成功!",
                showClose: true
              })
              this.addModal = false
              this.$refs[formName].resetFields()
              this.tabSearch()
            })
            .catch(error => {
              console.log(error)
            })
        } else {
          this.$message({
            showClose: true,
            type: "warning",
            message: "提交失败，验证不通过"
          })
          return false
        }
      })
    },
    deleteCheckedList() {
      // 批量删除
      const ids = this.multipleSelection.map(item => item.id).join(",")
      DELETE(process.env.VUE_APP_DOMAIN_administration + "/prductuser/delete", { ids })
        .then(() => {
          this.$message({ type: "success", message: "删除成功！", showClose: true })
          this.deleWarn = false
          this.onSubmit()
        })
        .catch(() => {
          this.$message({ type: "warning", message: "删除失败！", showClose: true })
        })
    },
    getModalInfo(info) {
      //点击领用时，获取列表单行数据
      this.getModal = true
      this.getform.id = info.id
      this.getform.serialNumber = info.serialNumber
      this.getform.singleProductId = info.singleProductId
    },
    remoteMethod_search(query) {
      //通过输入人名或手机号获取regid
      if (query !== "") {
        this.loading_search = true
        GET(process.env.VUE_APP_DOMAIN_personnel + "/queryEmployeesByNameOrEmployeeNo", { searchWord: query }).then(res => {
          this.loading_search = false
          this.options = res.data
          // console.log(this.options)
        })
      } else {
        this.options = []
      }
    },
    getModalHeads(formName) {
      //领用保存
      this.$refs[formName].validate(valid => {
        if (valid) {
          // regid
          console.log("保存对象", this.getform)
          PUT(process.env.VUE_APP_DOMAIN_administration + "/prductuser/updateUse", this.getform)
            .then(() => {
              this.$message({
                type: "success",
                message: "领用成功!",
                showClose: true
              })
              this.getModal = false
              this.tabSearch()
              this.$refs[formName].resetFields()
            })
            .catch(err => {
              console.log(err)
              this.$message({
                type: "warning",
                message: "领用失败!",
                showClose: true
              })
            })
        } else {
          this.$message({
            showClose: true,
            type: "warning",
            message: "提交失败，验证不通过"
          })
          return false
        }
      })
    },
    // 取消领用
    cancelModalHeads(formName) {
      this.$refs[formName].resetFields()
      this.getModal = false
    },
    returnModalInfo(info) {
      // 点击归还时，获取列表单行数据
      this.returnModal = true
      this.returnform.id = info.id
      this.returnform.employedNo = info.employedNo
      this.returnform.mobilePhone = info.mobilePhone
      this.returnform.regid = info.regid
      this.returnform.useName = info.useName
      this.returnform.singleProductId = info.singleProductId
      this.returnform.singleProductStatus = info.singleProductStatus
      this.returnform.serialNumber = info.serialNumber
      console.log(this.returnform)
    },
    // 取消归还耳机
    cancelReturnModalHeads(formName) {
      this.returnModal = false
      this.$refs[formName].resetFields()
    },
    returnModalHeads(formName) {
      // 归还耳机
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.returnform.brokenMoney = this.returnform.brokenMoney == 0 ? "" : this.returnform.brokenMoney
          let obj = {}
          Object.assign(obj, this.returnform, { returnTime: Tools.getYMd() })
          console.log(obj)
          PUT(process.env.VUE_APP_DOMAIN_administration + "/prductuser/updateReturn", obj)
            .then(() => {
              this.$message({
                type: "success",
                message: "归还成功!",
                showClose: true
              })
              this.returnModal = false
              this.$refs[formName].resetFields()
              this.tabSearch()
            })
            .catch(err => {
              console.log(err)
              this.$message({
                type: "warning",
                message: "归还失败!",
                showClose: true
              })
            })
        } else {
          this.$message({
            showClose: true,
            type: "warning",
            message: "提交失败，验证不通过"
          })
          return false
        }
      })
    },

    // 详情页面数据
    getDetailModal(info) {
      // 获取详情获取列表单行数据
      this.detailModal = true
      this.headsdetail.singleProductId = info.singleProductId
      this.headsdetail.singleProductStatus = info.singleProductStatus
      this.headsdetail.useStatus = info.useStatus
      this.headsdetail.serialNumber = info.serialNumber
      this.loadDetailData()
    },
    // 获取单个耳机使用历史详情
    loadDetailData() {
      POST(process.env.VUE_APP_DOMAIN_administration + "/productuserhistory/list", {
        current: this.detailPagination.current,
        serialNumber: this.headsdetail.serialNumber,
        size: this.detailPagination.size,
        descs: ["return_time"]
      }).then(res => {
        // console.log("耳机使用详情", res)
        this.loanpayDetailData = res.data.records
        this.detailPagination.total = res.data.total
      })
    },
    // 详情页翻页
    handleDetailCurrentChange(val) {
      this.detailPagination.current = val
      this.loadDetailData()
    },
    // 详情页每页显示条数
    handleDetailSizeChange(val) {
      this.detailPagination.size = val
      this.loadDetailData()
    },

    handleSizeChange(val) {
      //每页显示多少条数据切换
      this.size = val //保存状态-每页显示多少条数据切换
      this.tabSearch()
    },
    handlecurrentChange(val) {
      //点击页码，当前页
      this.current = val //保存状态-当前页
      this.tabSearch()
    },
    onSubmit() {
      this.current = 1 //点击搜索current=1搜索第一页
      this.tabSearch()
    },
    JS_more_Search() {
      this.search_more = false
      this.onSubmit()
    },
    inputEnter() {
      this.onSubmit()
    },
    //显示手机号码
    showPhoneNumber(row) {
      if (row.showPhone == false) {
        row.showPhone = true
      } else {
        row.showPhone = false
      }
    },

    tabSearch() {
      // 列表数据查询
      let queryObj = {
        current: this.current,
        size: this.size,
        //搜索条件
        useName: this.monthFormSearch.name,
        employedNo: this.monthFormSearch.employedNo,
        serialNumber: this.monthFormSearch.headsetId,
        //更多查询条件

        // employedNo: this.moreParam.aid,
        updateUserName: this.moreParam.masterName,
        startDate: this.moreParam.month ? this.moreParam.month[0] : undefined,
        endDate: this.moreParam.month ? this.moreParam.month[1] : undefined,
        //表头查询条件
        useStatus: this.getstatus,
        singleProductStatus: this.headsetStatus,
        userStatus: this.instayStatus
      } //查询象
      this.loading = true //开启动画
      POST(process.env.VUE_APP_DOMAIN_administration + "/prductuser/pUserlist", queryObj)
        .then(res => {
          //查询对象
          this.loading = false //关闭动画
          this.headsetData = res.data.records.map(obj => Object.assign(obj, { showPhone: false }))
          console.log(res.data)
          this.current = res.data.current //set当前页
          this.size = res.data.size //每页显示记录条数
          this.total = res.data.total //总记录条数
        })
        .catch(error => {
          console.log(error)
        })
    },
    JS_download() {
      //下载模板
      GET(process.env.VUE_APP_DOMAIN_personnel + "/queryBizFilesTemplate", { fileCode: "ADMIN_PRODUCT_IMPORT_TEMPLATE" })
        .then(res => {
          //获取模板存储返回的ID
          let url = `${process.env.VUE_APP_DOMAIN_download}/oss/download?key=${res.data.fileTemplateId}&name=${res.data.fileTemplateName}.${res.data.fileTemplateSuffix}`
          window.location.href = url
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 导入相关
    beforeRemove(file) {
      //删除文件之前的钩子
      return this.$msgBox.confirm(`确定移除 ${file.name}？`)
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
      } else {
        this.importLoading = this.$loading({
          //上报数据，锁定页面loading
          lock: true,
          text: "正在上报数据，请稍等片刻",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        })
      }
      return extension1 || extension2
    },
    handleSuccess(res) {
      //上传文件接口调取成功回调
      if (res.code == 0) {
        //文件上传成功
        console.log("文件上传成功", res)
        // console.log("文件上传成功", res.data)
        this.uploadModal = false
        this.tabSearch()
        // this.$message({
        //   type: "success",
        //   message: "导入成功"
        // })
        if (res.data != "") {
          // this.$alert(res.data, '标题名称', {
          //   confirmButtonText: '确定',
          //   callback: action => {
          //     this.$message({
          //       type: 'info',
          //       message: `action: ${ action }`
          //     });
          //   }
          // });
          this.$msgBox.confirm("<span>" + res.data + "</span>", "提示", {
            dangerouslyUseHTMLString: true,
            confirmButtonText: "确定",
            // cancelButtonText: "取消",
            showCancelButton: false,
            showClose: false,
            type: "warning"
          })
        }
      } else {
        //失败
        let msgError = res.msg || "【系统无法识别EXCLE中的空白，公式和非法字符。请先清理】。" //50*非0情况
        this.$msgBox.alert(`<span style="color:red;">${msgError} </span>`, "温馨提示", {
          dangerouslyUseHTMLString: true
        })
      }
      this.importLoading.close()
      this.$refs.upload.clearFiles() //清空已上传的文件列表（该方法不支持在 before-upload 中调用）
    },
    //导出相关
    JS_exportCancel(formName) {
      //清除表单
      // this.exportDialog = false
      this.$refs[formName].resetFields()
    },
    JS_exportSave() {
      // 导出
      let exportObj = {
        //搜索条件
        useName: this.monthFormSearch.name,
        mobilePhone: this.monthFormSearch.aid,
        serialNumber: this.monthFormSearch.headsetId,
        //更多查询条件
        employedNo: this.moreParam.aid,
        updateUserName: this.moreParam.masterName,
        startDate: this.moreParam.month ? this.moreParam.month[0] : "",
        endDate: this.moreParam.month ? this.moreParam.month[1] : "",
        //表头查询条件
        useStatus: this.getstatus,
        singleProductStatus: this.headsetStatus,
        userStatus: this.instayStatus
      }
      let exportStr = qs.stringify(exportObj)
      window.location.href = `${process.env.VUE_APP_DOMAIN_administration}/prductuser/exportData?${exportStr}&token=${localStorage.getItem("token")}`
    },
    //耳机领用历史查询222
    historyTabSearch() {
      // 列表数据查询
      let queryObj = {
        current: this.Hcurrent,
        size: this.Hsize,
        regid: this.historyFormSearch.regid,
        serialNumber: this.historyFormSearch.serialNumber
      }
      if (this.sortFlag == "useTimeUp") {
        queryObj.ascs = ["use_time"]
      } else if (this.sortFlag == "useTimeDown") {
        queryObj.descs = ["use_time"]
      } else if (this.sortFlag == "returnTimeUp") {
        queryObj.ascs = ["return_time"]
      } else if (this.sortFlag == "returnTimeDown") {
        queryObj.descs = ["return_time"]
      }
      console.log(this.sortFlag)
      this.Hloading = true //开启动画
      POST(process.env.VUE_APP_DOMAIN_administration + "/productuserhistory/list", queryObj)
        .then(res => {
          //查询对象
          this.Hloading = false //关闭动画
          // this.historyData = res.data.records.map(obj => Object.assign(obj, { showPhone: false }))
          this.historyData = res.data.records
          // console.log(res.data)
          this.Hcurrent = res.data.current //set当前页
          this.Hsize = res.data.size //每页显示记录条数
          this.Htotal = res.data.total //总记录条数
        })
        .catch(error => {
          console.log(error)
        })
    },
    historySortChange(column) {
      //列表排序
      if (column.prop == "useTime") {
        if (column.order == "ascending") {
          //升
          this.sortFlag = "useTimeUp"
          this.Hcurrent = 1
          this.historyTabSearch()
        } else {
          //降
          this.sortFlag = "useTimeDown"
          this.Hcurrent = 1
          this.historyTabSearch()
        }
      } else if (column.prop == "returnTime") {
        if (column.order == "ascending") {
          //升
          this.sortFlag = "returnTimeUp"
          this.Hcurrent = 1
          this.historyTabSearch()
        } else {
          //降
          this.sortFlag = "returnTimeDown"
          this.Hcurrent = 1
          this.historyTabSearch()
        }
      }
    },
    historySearch() {
      this.Hcurrent = 1
      this.historyTabSearch()
    },
    HhandleSizeChange(val) {
      //每页显示多少条数据切换
      this.Hsize = val //保存状态-每页显示多少条数据切换
      this.historyTabSearch()
    },
    HhandlecurrentChange(val) {
      //点击页码，当前页
      this.Hcurrent = val //保存状态-当前页
      this.historyTabSearch()
    },
    JS_exportHistory() {
      // 导出
      console.log(this.exportRecordsParam)
      let exportObj = {
        startDate: this.exportRecordsParam.getMonth == null ? "" : this.exportRecordsParam.getMonth[0] || "",
        endDate: this.exportRecordsParam.getMonth == null ? "" : this.exportRecordsParam.getMonth[1] || "",
        returnStartDate: this.exportRecordsParam.returnMonth == null ? "" : this.exportRecordsParam.returnMonth[0] || "",
        returnEndDate: this.exportRecordsParam.returnMonth == null ? "" : this.exportRecordsParam.returnMonth[1] || ""
      }
      let exportStr = qs.stringify(exportObj)
      console.log(exportStr)
      window.location.href = `${process.env.VUE_APP_DOMAIN_administration}/productuserhistory/exportData?${exportStr}&token=${localStorage.getItem("token")}`
      this.exportModal = false
    }
  },
  created() {
    this.headers["x-user-token"] = localStorage.getItem("token") //设置上传数据文件excel的token
    this.tabSearch()
  }
}
</script>


<style lang="less" scoped>
.detail-pagination {
  display: flex;
  flex-direction: row-reverse;
}
.heads-popover {
  padding: 0;
}
.heads-upload-tip {
  & > p {
    margin: 0;
    padding: 3px 0;
    &.state {
      text-indent: 2em;
      color: #f00;
      font-weight: bold;
    }
  }
}
</style>