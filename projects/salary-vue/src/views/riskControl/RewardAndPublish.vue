<template>
  <!-- 特殊绩效 -->
  <div class="RPManage">
    <!-- 导航 -->
    <div class="guide">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home/riskControl' }">风险控制</el-breadcrumb-item>
        <el-breadcrumb-item>奖惩系统</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/riskControl' }">(返回上级)</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 内容 -->
    <div class="bgWhite mgt15 content clearfix">
      <!-- 左边条件栏 -->
      <div class="pull-left">
        <el-form :inline="true" class="mar-no">
          <!-- <el-form-item label="案件责任人">
            <el-autocomplete style="width:200px" class="inline-input" @blur="JS_select()" v-model.trim="state" :fetch-suggestions="querySearch" placeholder="请输入姓名或手机号" :trigger-on-focus="false" @select="handleSelect"></el-autocomplete>
          </el-form-item> -->
          <el-form-item label="案件责任人" prop="respUserid">
            <el-select v-model="respUserid" clearable filterable remote reserve-keyword placeholder="请输入姓名或手机号" :remote-method="remoteMethod_search" :loading="loading_search" style="width:180px">
              <el-option v-for="item in options" :key="item.regid" :label="item.user_name" :value="item.regid">
                <span style="float: left">{{ item.user_name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.mobile_phone }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="违规类型">
            <el-select clearable="" v-model="RPSearch.violationTypeId" placeholder="请选择" class="width130">
              <el-option v-for="item in violateOptions" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="案件类型">
            <el-select clearable="" v-model="RPSearch.caseTypeId" placeholder="请选择" class="width130">
              <el-option v-for="item in caseOptions" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <!-- 789 -->
          <el-form-item label="所属区域" v-if="checkQ">
            <el-select clearable="" v-model="RPSearch.placeSelect" placeholder="请选择" class="width155">
              <el-option v-for="item in areaOptions" :key="item.areaId" :label="item.areaName" :value="item.areaName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="JS_search_RP" icon="el-icon-search">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 右边操作按钮 -->
      <div class="pull-right">
        <el-button type="primary" @click="addRPCase()" v-if="addQ">新增</el-button>
      </div>
      <!-- 表格 -->
      <div class="table-wrap">
        <el-table v-loading="loading" :data="RPTableData" :height="height" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
          <el-table-column type="index" label="序号" min-width="50"></el-table-column>
          <el-table-column prop="caseTypeName" label="案件类型" min-width="150"></el-table-column>
          <el-table-column prop="caseName" label="案件名称" min-width="150"></el-table-column>
          <el-table-column prop="registerDate" label="立案日期" min-width="150"></el-table-column>
          <el-table-column prop="initDeptname" label="提起部门" min-width="150"></el-table-column>
          <el-table-column prop="caseSource" label="案件来源" min-width="150"></el-table-column>
          <el-table-column prop="initUsername" label="案件提起人" min-width="150">
            <template slot-scope="scope">
              <el-popover trigger="click" placement="top" width="450" @show="getInfoForId(scope.row.initUserid)">
                <!-- S -->
                <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                <!-- E -->
                <div slot="reference" class="name-wrapper">
                  <el-button size="mini">{{scope.row.initUsername}}</el-button>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="violationTypeName" label="违规类型" min-width="150"></el-table-column>
          <el-table-column prop="violationDate" label="违规日期" min-width="150"></el-table-column>
          <el-table-column prop="fileNumber" label="红头文件" min-width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.fileNumber">{{scope.row.fileNumber}}</span>
              <span v-else>- -</span>
            </template>
          </el-table-column>
          <el-table-column prop="handleUsername" label="督办人" min-width="150">
            <template slot-scope="scope">
              <el-popover trigger="click" placement="top" width="450" @show="getInfoForId(scope.row.handleUserid)" v-if="scope.row.handleUserid">
                <!-- S -->
                <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                <!-- E -->
                <div slot="reference" class="name-wrapper">
                  <el-button size="mini">{{scope.row.handleUsername}}</el-button>
                </div>
              </el-popover>
              <span v-else>- -</span>
            </template>
          </el-table-column>
          <el-table-column prop="createUserName" label="最后操作人" min-width="150">
            <template slot-scope="scope">
              <el-popover trigger="click" placement="top" width="450" @show="getInfoForId(scope.row.updateUser)" v-if="scope.row.updateUser">
                <!-- S -->
                <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                <!-- E -->
                <div slot="reference" class="name-wrapper">
                  <el-button size="mini">{{scope.row.updateUserName}}</el-button>
                </div>
              </el-popover>
              <el-popover trigger="click" placement="top" width="450" @show="getInfoForId(scope.row.createUser)" v-else-if="scope.row.createUser">
                <!-- S -->
                <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                <!-- E -->
                <div slot="reference" class="name-wrapper">
                  <el-button size="mini">{{scope.row.createUserName}}</el-button>
                </div>
              </el-popover>
              <span v-else>- -</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="最后操作时间" min-width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.updateTime">{{scope.row.updateTime}}</span>
              <span v-else>{{scope.row.createTime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="150" fixed="right" v-if="sendNoticeQ||updateQ||deleteQ">
            <template slot-scope="scope">
              <!-- 789 -->
              <el-button type="text" size="small" @click="sendNotice(scope.row.id)" v-if="scope.row.bsendMessage=='0'&&sendNoticeQ">发送</el-button>
              <el-button type="text" size="small" v-if="scope.row.bsendMessage=='1'&&sendNoticeQ" disabled>已发送</el-button>
              <el-button type="text" size="small" @click="updateCase(scope.row.id)" v-if="updateQ">修改</el-button>
              <el-button type="text" size="small" @click="deleteCase(scope.row.id)" class="deleteTxt" v-if="deleteQ">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div id="pagination">
          <el-pagination @size-change="handleSizeChange" @current-change="handlecurrentChange" background :current-page="current" :page-sizes="[10,15,20,30,40]" :page-size="size" layout="total,sizes,prev,pager,next,jumper" :total="total"></el-pagination>
        </div>
      </div>
      <!-- 新增 弹框 -->
      <el-dialog title="新增奖惩" :before-close="addRPDialogClose" :visible.sync="addRPModal" :show-close="true" :close-on-click-modal="false" top="10vh" width="1250px" class="grayBg">
        <div>
          <div v-if="addStatus =='1'" class="whiteBox">
            <p class="pReset">案件信息</p>
            <el-form :model="addRPform" :rules="addRPformRule" ref="addRPform" label-width="120px">
              <el-row>
                <el-col :md="6">
                  <el-form-item label="案件名称：" prop="caseName">
                    <el-input v-model.trim="addRPform.caseName" style="width:180px"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="案件类型：" prop="caseTypeId">
                    <el-select clearable ref="caseTypeRef" v-model="addRPform.caseTypeId" placeholder="请选择" style="width:180px">
                      <el-option v-for="item in caseOptions" :key="item.value" :label="item.name" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="奖惩类型：" prop="supTypeId">
                    <el-select clearable="" ref="supTypeRef" v-model="addRPform.supTypeId" placeholder="请选择" style="width:180px">
                      <el-option v-for="item in typeOptions" :key="item.value" :label="item.name" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="案件来源：" prop="caseSource">
                    <el-input v-model.trim="addRPform.caseSource" style="width:180px"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="立案日期：" prop="registerDate">
                    <el-date-picker v-model="addRPform.registerDate" type="date" value-format="yyyy-MM-dd" style="width:180px" placeholder="选择日期">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="违规类型：" prop="violationTypeId">
                    <el-select clearable="" ref="violationTypeRef" v-model="addRPform.violationTypeId" placeholder="请选择" style="width:180px">
                      <el-option v-for="item in violateOptions" :key="item.value" :label="item.name" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="违规日期：" prop="violationDate">
                    <el-date-picker v-model="addRPform.violationDate" type="date" value-format="yyyy-MM-dd" style="width:180px" placeholder="选择日期">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="提起人：" prop="initUserid">
                    <el-select v-model="addRPform.initUserid" ref="initUserRef" clearable filterable remote reserve-keyword placeholder="请输入姓名或手机号" :remote-method="remoteMethod" :loading="loading" style="width:180px">
                      <el-option v-for="item in options" :key="item.regid" :label="item.user_name" :value="item.regid">
                        <span style="float: left">{{ item.user_name }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.mobile_phone }}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="提起部门：" prop="initDeptid">
                    <el-select clearable="" ref="initDeptRef" filterable v-model="addRPform.initDeptid" placeholder="请选择" style="width:180px">
                      <el-option v-for="item in deptsOptions" :key="item.dept_id" :label="item.dept_name" :value="item.dept_id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="初核情况：" prop="auditDetails">
                    <el-input v-model.trim="addRPform.auditDetails" style="width:180px"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="红头编号：" prop="fileNumber">
                    <el-input v-model.trim="addRPform.fileNumber" style="width:180px"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="督办人：" prop="handleUserid">
                    <el-select v-model="addRPform.handleUserid" ref="handleUserRef" filterable remote reserve-keyword placeholder="请输入姓名或手机号" :remote-method="remoteMethod1" :loading="loading" style="width:180px">
                      <el-option v-for="item in options1" :key="item.regid" :label="item.user_name" :value="item.regid">
                        <span style="float: left">{{ item.user_name }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.mobile_phone }}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="24" class="mgt10">
                  <el-form-item prop="violationTruth" label="调查事实：">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 2}" maxlength="250" resize="none" placeholder="请输入" v-model="addRPform.violationTruth" style="width:100%;"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24" class="mgt10">
                  <el-form-item prop="violationInstitution" label="涉及制度：">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 2}" maxlength="250" resize="none" placeholder="请输入" v-model="addRPform.violationInstitution" style="width:100%;"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div v-if="addStatus =='1'" class="whiteBox">
            <p class="pReset" style="margin-top:20px">电子凭证</p>
            <el-row class="textLft mar-top" style="height:200px;overflow-y:scroll;margin-bottom:10px">
              <el-col :span="3" v-for="(o, index) in fileArr" :key="index" :offset="1">
                <el-card :body-style="{ padding: '0px' }" v-if="o.type=='jpeg'||o.type=='png'">
                  <img :src="o.url" class="image">
                  <div style="padding: 0 14px 14px 0;">
                    <div class="bottom clearfix">
                      <el-button type="text" class="button" @click="deleteEfile1(index)">删除</el-button>
                      <el-button type="text" class="button" @click="checkEFile1(index)" style="margin-right:20px">查看</el-button>
                    </div>
                  </div>
                </el-card>
                <el-card :body-style="{ padding: '0px' }" v-else>
                  <img src="../../libs/images/laba.png" class="image_laba">
                  <div style="padding: 0 14px 14px 0;">
                    <div class="bottom clearfix">
                      <el-button type="text" class="button" @click="deleteEfile1(index)">删除</el-button>
                      <el-button type="text" class="button" @click="checkEFile1(index)" style="margin-right:20px">播放</el-button>
                    </div>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="1" :offset="1" class="mgt10">
                <el-upload class="uploadLine" :action="uploadActionUrl" :show-file-list=false :headers="headers" :on-success="handleSuccess1" :before-upload="beforeUploadPic1" :file-list="fileList">
                  <el-button size="small">上传</el-button>
                </el-upload>
              </el-col>
            </el-row>

          </div>
          <span slot="footer" class="dialog-footer" style="float:right;padding-top:10px" v-if="addStatus =='1'">
            <el-button @click="addRPModal=false,reset('addRPform')">取消</el-button>
            <el-button type="primary" @click="addRPCaseSave('addRPform')">下一步</el-button>
          </span>
          <!-- 占位div -->
          <!-- <div style="height:40px"></div> -->

          <div v-if="addStatus =='2'" class="whiteBox">
            <p class="pReset">案件责任人</p>
            <div class="pull-right" style="margin-bottom:10px">
              <!-- <el-button size="small" class="cloud-uploadBtn" @click="addPeopleFlag=true"><i></i>&nbsp;导入</el-button> -->
              <el-button size="small" icon="el-icon-plus" @click="addPersonFlag=true">添加</el-button>
            </div>
            <el-table :data="responsiblePersonData" border :height="height1" style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}" stripe>
              <el-table-column type="index" label="序号" min-width="50"></el-table-column>
              <el-table-column prop="respTypeName" label="责任人类型" min-width="150"></el-table-column>
              <el-table-column prop="respUsername" label="姓名" min-width="150">
                <template slot-scope="scope">
                  <el-popover trigger="click" placement="top" width="450" @show="getInfoForId(scope.row.respUserid)">
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.respUsername}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="respNumber" label="手机号码" min-width="120"></el-table-column>
              <el-table-column prop="identityNumber" label="身份证号" min-width="160"></el-table-column>
              <el-table-column prop="workAreaName" label="所属区域" min-width="150"></el-table-column>
              <el-table-column prop="postName" label="职务" min-width="150"></el-table-column>
              <el-table-column prop="punishResult" label="惩罚结果" min-width="350"></el-table-column>
              <el-table-column prop="groupUsername" label="集团副总" min-width="150">
                <template slot-scope="scope">
                  <el-popover trigger="click" placement="top" width="450" @show="getInfoForId(scope.row.groupUserid)">
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.groupUsername}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="bizUsername" label="业务总经理" min-width="150">
                <template slot-scope="scope">
                  <el-popover trigger="click" placement="top" width="450" @show="getInfoForId(scope.row.bizUserid)">
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.bizUsername}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="polityUsername" label="政治总经理" min-width="150">
                <template slot-scope="scope">
                  <el-popover trigger="click" placement="top" width="450" @show="getInfoForId(scope.row.polityUserid)">
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.polityUsername}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="操作" min-width="120" fixed="right">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="updateEmployee(scope.row)">修改</el-button>
                  <el-button type="text" size="small" @click="deleteEmployeeA()" class="deleteTxt">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div id="pagination">
              <el-pagination @size-change="handleSizeChange1" @current-change="handlecurrentChange1" background :current-page="current1" :page-sizes="[10,15,20,30,40]" :page-size="size1" layout="total,sizes,prev,pager,next,jumper" :total="total1"></el-pagination>
            </div>

          </div>
          <div class="pull-right" style="margin-bottom:10px;padding-top:10px" v-if="addStatus =='2'">
            <el-button type="primary" @click="finishAddCase()">完成</el-button>
          </div>
          <div style="height:40px"></div>
        </div>
      </el-dialog>
      <!-- 修改奖惩 -->
      <el-dialog title="修改奖惩" :visible.sync="updateRPModal" :show-close="true" :close-on-click-modal="false" fullscreen class="grayBg">
        <div class="whiteBox">
          <p class="pReset">案件信息</p>
          <el-form :model="addRPformU" :rules="addRPformURule" ref="addRPformU" label-width="140px">
            <el-row>
              <el-col :md="6">
                <el-form-item label="案件名称：" prop="caseName">
                  <el-input v-model.trim="addRPformU.caseName" style="width:180px"></el-input>
                </el-form-item>
              </el-col>
              <el-col :md="6">
                <el-form-item label="案件类型：" prop="caseTypeId">
                  <el-select clearable="" ref="caseTypeRef" v-model="addRPformU.caseTypeId" placeholder="请选择" style="width:180px">
                    <el-option v-for="item in caseOptions" :key="item.value" :label="item.name" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="6">
                <el-form-item label="奖惩类型：" prop="supTypeId">
                  <el-select clearable="" ref="supTypeRef" v-model="addRPformU.supTypeId" placeholder="请选择" style="width:180px">
                    <el-option v-for="item in typeOptions" :key="item.value" :label="item.name" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="6">
                <el-form-item label="案件来源：" prop="caseSource">
                  <el-input v-model.trim="addRPformU.caseSource" style="width:180px"></el-input>
                </el-form-item>
              </el-col>
              <el-col :md="6">
                <el-form-item label="立案日期：" prop="registerDate">
                  <el-date-picker v-model="addRPformU.registerDate" type="date" value-format="yyyy-MM-dd" style="width:180px" placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :md="6">
                <el-form-item label="违规类型：" prop="violationTypeId">
                  <el-select clearable="" ref="violationTypeRef" v-model="addRPformU.violationTypeId" placeholder="请选择" style="width:180px">
                    <el-option v-for="item in violateOptions" :key="item.value" :label="item.name" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="6">
                <el-form-item label="违规日期：" prop="violationDate">
                  <el-date-picker v-model="addRPformU.violationDate" type="date" value-format="yyyy-MM-dd" style="width:180px" placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :md="6">
                <el-form-item label="提起人：" prop="initUserid">
                  <el-select v-model="addRPformU.initUserid" ref="initUserRef" filterable remote reserve-keyword placeholder="请输入姓名或手机号" :remote-method="remoteMethod2" :loading="loading" style="width:180px">
                    <el-option v-for="item in options2" :key="item.regid" :label="item.user_name" :value="item.regid">
                      <span style="float: left">{{ item.user_name }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.mobile_phone }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="6">
                <el-form-item label="提起部门：" prop="initDeptid">
                  <el-select clearable="" ref="initDeptRef" filterable v-model="addRPformU.initDeptid" placeholder="请选择" style="width:180px">
                    <el-option v-for="item in deptsOptions" :key="item.dept_id" :label="item.dept_name" :value="item.dept_id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="6">
                <el-form-item label="初核情况：" prop="auditDetails">
                  <el-input v-model.trim="addRPformU.auditDetails" style="width:180px"></el-input>
                </el-form-item>
              </el-col>
              <el-col :md="6">
                <el-form-item label="红头编号：" prop="fileNumber">
                  <el-input v-model.trim="addRPformU.fileNumber" style="width:180px"></el-input>
                </el-form-item>
              </el-col>
              <el-col :md="6">
                <el-form-item label="督办人：" prop="handleUserid">
                  <el-select v-model="addRPformU.handleUserid" ref="handleUserRef" filterable remote reserve-keyword placeholder="请输入姓名或手机号" :remote-method="remoteMethod3" :loading="loading" style="width:180px">
                    <el-option v-for="item in options3" :key="item.regid" :label="item.user_name" :value="item.regid">
                      <span style="float: left">{{ item.user_name }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.mobile_phone }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24" class="mgt10">
                <el-form-item prop="violationTruth" label="调查事实：">
                  <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 2}" maxlength="250" resize="none" placeholder="请输入" v-model="addRPformU.violationTruth" style="width:100%;"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24" class="mgt10">
                <el-form-item prop="violationInstitution" label="涉及制度：">
                  <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 2}" maxlength="250" resize="none" placeholder="请输入" v-model="addRPformU.violationInstitution" style="width:100%;"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <p class="pReset">案件责任人</p>
          <div class="pull-right" style="margin-bottom:10px">
            <!-- <el-button size="small" class="cloud-uploadBtn" @click="addPeopleFlag=true"><i></i>&nbsp;导入</el-button> -->
            <el-button size="small" icon="el-icon-plus" @click="addPersonFlag=true">添加</el-button>
          </div>
          <el-table :data="responsiblePersonDataU" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}" stripe>
            <el-table-column type="index" label="序号" min-width="50"></el-table-column>
            <el-table-column prop="respTypeName" label="责任人类型" min-width="150"></el-table-column>
            <el-table-column prop="respUsername" label="姓名" min-width="150">
              <template slot-scope="scope">
                <el-popover trigger="click" placement="top" width="450" @show="getInfoForId(scope.row.respUserid)">
                  <!-- S -->
                  <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                  <!-- E -->
                  <div slot="reference" class="name-wrapper">
                    <el-button size="mini">{{scope.row.respUsername}}</el-button>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="respNumber" label="手机号码" min-width="120"></el-table-column>
            <el-table-column prop="identityNumber" label="身份证号" min-width="160"></el-table-column>
            <el-table-column prop="workAreaName" label="所属区域" min-width="160" show-overflow-tooltip></el-table-column>
            <el-table-column prop="postName" label="职务" min-width="100"></el-table-column>
            <el-table-column prop="punishResult" label="惩罚结果" min-width="350"></el-table-column>
            <el-table-column prop="groupUsername" label="集团副总" min-width="150">
              <template slot-scope="scope">
                <el-popover trigger="click" placement="top" width="450" @show="getInfoForId(scope.row.groupUserid)">
                  <!-- S -->
                  <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                  <!-- E -->
                  <div slot="reference" class="name-wrapper">
                    <el-button size="mini">{{scope.row.groupUsername}}</el-button>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="bizUsername" label="业务总经理" min-width="150">
              <template slot-scope="scope">
                <el-popover trigger="click" placement="top" width="450" @show="getInfoForId(scope.row.bizUserid)">
                  <!-- S -->
                  <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                  <!-- E -->
                  <div slot="reference" class="name-wrapper">
                    <el-button size="mini">{{scope.row.bizUsername}}</el-button>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="polityUsername" label="政治总经理" min-width="150">
              <template slot-scope="scope">
                <el-popover trigger="click" placement="top" width="450" @show="getInfoForId(scope.row.polityUserid)">
                  <!-- S -->
                  <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
                  <!-- E -->
                  <div slot="reference" class="name-wrapper">
                    <el-button size="mini">{{scope.row.polityUsername}}</el-button>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="120" fixed="right">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="updateEmployee(scope.row)">修改</el-button>
                <el-button type="text" size="small" @click="deleteEmployeeU(scope.row.respId)" class="deleteTxt">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <div id="pagination">
            <el-pagination @size-change="handleSizeChange2" @current-change="handlecurrentChange2" background :current-page="current2" :page-sizes="[10,15,20,30,40]" :page-size="size2" layout="total,sizes,prev,pager,next" :total="total2"></el-pagination>
          </div>
          <p class="pReset" style="margin-top:20px">电子凭证</p>
          <el-row class="textLft mar-top">
            <!-- <el-col :span="1" :offset="1" class="mgt10">
              <el-upload class="uploadLine" :action="uploadActionUrl" :show-file-list=false :headers="headers" :on-success="handleSuccess2" :before-upload="beforeUploadPic1" :file-list="fileList">
                <el-button size="small">上传</el-button>
              </el-upload>
            </el-col> -->
            <el-col :span="3" v-for="(o, index) in fileArr2" :key="index" :offset="1">
              <el-card :body-style="{ padding: '0px' }" v-if="o.type=='jpeg'||o.type=='png'">
                <img :src="o.url" class="image">
                <div style="padding: 0 14px 14px 0;">
                  <div class="bottom clearfix">
                    <el-button type="text" class="button" @click="deleteEfile2(index)">删除</el-button>
                    <el-button type="text" class="button" @click="checkEFile2(index)" style="margin-right:20px">查看</el-button>
                  </div>
                </div>
              </el-card>
              <el-card :body-style="{ padding: '0px' }" v-else>
                <img src="../../libs/images/laba.png" class="image_laba">
                <div style="padding: 0 14px 14px 0;">
                  <div class="bottom clearfix">
                    <el-button type="text" class="button" @click="deleteEfile2(index)">删除</el-button>
                    <el-button type="text" class="button" @click="checkEFile2(index)" style="margin-right:20px">播放</el-button>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="1" :offset="1" class="mgt10">
              <el-upload class="uploadLine" :action="uploadActionUrl" :show-file-list=false :headers="headers" :on-success="handleSuccess2" :before-upload="beforeUploadPic1" :file-list="fileList">
                <el-button size="small">上传</el-button>
              </el-upload>
            </el-col>
          </el-row>
          <span slot="footer" class="dialog-footer" style="float:right">
            <el-button @click="updateRPModal=false,reset('addRPformU')">取消</el-button>
            <el-button type="primary" @click="updateRPCaseSave('addRPformU')">确认</el-button>
          </span>
          <!-- 占位div -->
          <div style="height:40px"></div>
        </div>
      </el-dialog>
      <!-- 新增责任人 -->
      <el-dialog title="新增责任人" :before-close="addPersonDialogClose" :close-on-click-modal="false" :visible.sync="addPersonFlag" width="1250px" class="grayBg martopDialog">
        <div class="whiteBox">
          <p class="pReset">责任人信息</p>
          <el-row class="textLft">
            <el-form :model="personalInfoForm" :rules="personalInfoFormRule" ref="personalInfoForm" label-width="120px">
              <el-row>
                <el-col :md="6">
                  <el-form-item label="责任类型：" prop="respTypeId">
                    <el-select clearable="" ref="respTypeRef" v-model="personalInfoForm.respTypeId" placeholder="请选择" style="width:160px">
                      <el-option v-for="item in responsibilityOptions" :key="item.value" :label="item.name" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="姓名：" prop="respUserid">
                    <el-select v-model="personalInfoForm.respUserid" ref="respUserRef" @change="getUserDetail('personalInfoForm')" filterable remote reserve-keyword placeholder="请输入姓名或手机号" :remote-method="remoteMethod4" :loading="loading" style="width:160px">
                      <el-option v-for="item in options4" :key="item.regid" :label="item.user_name" :value="item.regid">
                        <span style="float: left">{{ item.user_name }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.mobile_phone }}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="联系电话：" prop="respNumber">
                    <el-input v-model.trim="personalInfoForm.respNumber" disabled style="width:160px"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="身份证号：" prop="identityNumber">
                    <el-input v-model.trim="personalInfoForm.identityNumber" disabled style="width:160px"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="所属区域：" prop="workAreaId">
                    <el-select clearable="" ref="aeraRef" v-model="personalInfoForm.workAreaId" placeholder="请选择" style="width:160px">
                      <el-option v-for="item in areaOptions" :key="item.areaId" :label="item.areaName" :value="item.areaId"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="所任职务：" prop="postName">
                    <el-input v-model.trim="personalInfoForm.postName" style="width:160px"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="集团副总：" prop="groupUserid">
                    <el-select v-model="personalInfoForm.groupUserid" ref="groupUserRef" filterable remote reserve-keyword placeholder="请输入姓名或手机号" :remote-method="remoteMethod6" :loading="loading" style="width:160px">
                      <el-option v-for="item in options6" :key="item.regid" :label="item.user_name" :value="item.regid">
                        <span style="float: left">{{ item.user_name }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.mobile_phone }}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="业务总经理：" prop="bizUserid">
                    <el-select v-model="personalInfoForm.bizUserid" ref="bizUserRef" filterable remote reserve-keyword placeholder="请输入姓名或手机号" :remote-method="remoteMethod7" :loading="loading" style="width:160px">
                      <el-option v-for="item in options7" :key="item.regid" :label="item.user_name" :value="item.regid">
                        <span style="float: left">{{ item.user_name }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.mobile_phone }}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="政治总经理：" prop="polityUserid">
                    <el-select v-model="personalInfoForm.polityUserid" ref="polityUserRef" filterable remote reserve-keyword placeholder="请输入姓名或手机号" :remote-method="remoteMethod8" :loading="loading" style="width:160px">
                      <el-option v-for="item in options8" :key="item.regid" :label="item.user_name" :value="item.regid">
                        <span style="float: left">{{ item.user_name }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.mobile_phone }}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-row>
        </div>
        <div class="whiteBox">
          <p class="pReset">惩罚决定</p>
          <el-row class="textLft">
            <el-form :model="publishForm" :rules="publishFormRule" ref="publishForm">
              <el-row>
                <el-col :md="3">
                  <el-form-item label="限制晋升" prop="promoteLimit">
                    <el-input-number v-model.trim="publishForm.promoteLimit" :precision="0" :controls="false" :min="0" :max="48" style="width:50px"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :md="5">
                  <el-form-item label="个月，经济处罚" prop="punishAmount">
                    <el-input-number v-model.trim="publishForm.punishAmount" :precision="1" @change="getRealAmount('publishForm')" :controls="false" :min="0" :max="1000000" style="width:90px"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :md="3">
                  <el-form-item label="元，扣" prop="punishRecord">
                    <el-input-number v-model.trim="publishForm.punishRecord" :precision="1" @change="getRealAmount('publishForm')" :controls="false" :min="0" :max="1000" style="width:60px"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :md="5">
                  <el-form-item label="分，实际金额：" prop="punishRealAmount">
                    <el-input-number v-model.trim="publishForm.punishRealAmount" style="width:100px" :controls="false" disabled></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :md="7">
                  <el-form-item label="元； 惩罚类型" prop="punishTypeId">
                    <el-select clearable="" ref="supTypeRef" v-model="publishForm.punishTypeId" placeholder="请选择" style="width:160px">
                      <el-option v-for="item in publishOptions" :key="item.value" :label="item.name" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="不予核算业绩：" prop="baccount">
                    <el-radio-group v-model="publishForm.baccount">
                      <el-radio :label="0">是</el-radio>
                      <el-radio :label="1">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="加入黑名单：" prop="bblackList">
                    <el-radio-group v-model="publishForm.bblackList">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="是否复议：" prop="breconsider">
                    <el-radio-group v-model="publishForm.breconsider">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="24" class="mgt10">
                  <el-form-item prop="reconsiderContent" label="异议信息：" label-width="100px">
                    <el-input type="textarea" disabled :autosize="{ minRows: 2, maxRows: 2}" maxlength="200" resize="none" placeholder="案件责任人异议信息" v-model="publishForm.reconsiderContent"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24" class="mgt10">
                  <el-form-item prop="reconsiderResult" label="复议结果：" label-width="100px">
                    <el-input type="textarea" disabled :autosize="{ minRows: 2, maxRows: 2}" maxlength="200" resize="none" placeholder="请输入" v-model="publishForm.reconsiderResult"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addPersonFlag=false,reset('personalInfoForm'),reset('publishForm')">取消</el-button>
          <el-button type="primary" @click="addPerson('personalInfoForm')">确定</el-button>
        </span>
      </el-dialog>
      <!-- 修改责任人 -->
      <el-dialog title="修改责任人" :close-on-click-modal="false" :visible.sync="updatePersonFlag" :before-close="handleCloseDialog" width="1250px" class="grayBg martopDialog">
        <div class="whiteBox">
          <p class="pReset">责任人信息</p>
          <el-row class="textLft">
            <el-form :model="personalInfoFormU" :rules="personalInfoFormURule" ref="personalInfoFormU" label-width="120px">
              <el-row>
                <el-col :md="6">
                  <el-form-item label="责任类型：" prop="respTypeId">
                    <el-select clearable="" ref="respTypeRef" v-model="personalInfoFormU.respTypeId" placeholder="请选择" style="width:160px">
                      <el-option v-for="item in responsibilityOptions" :key="item.value" :label="item.name" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="姓名：" prop="respUserid">
                    <el-select v-model="personalInfoFormU.respUserid" disabled ref="respUserRef" @change="getUserDetail('personalInfoFormU')" filterable remote reserve-keyword placeholder="请输入姓名或手机号" :remote-method="remoteMethod9" :loading="loading" style="width:160px">
                      <el-option v-for="item in options9" :key="item.regid" :label="item.user_name" :value="item.regid">
                        <span style="float: left">{{ item.user_name }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.mobile_phone }}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="联系电话：" prop="respNumber">
                    <el-input v-model.trim="personalInfoFormU.respNumber" disabled style="width:160px"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="身份证号：" prop="identityNumber">
                    <el-input v-model.trim="personalInfoFormU.identityNumber" disabled style="width:160px"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="所属区域：" prop="workAreaId">
                    <el-select clearable="" ref="aeraRef" v-model="personalInfoFormU.workAreaId" placeholder="请选择" style="width:160px">
                      <el-option v-for="item in areaOptions" :key="item.areaId" :label="item.areaName" :value="item.areaId"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="所任职务：" prop="postName">
                    <el-input v-model.trim="personalInfoFormU.postName" style="width:160px"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="集团副总：" prop="groupUserid">
                    <el-select v-model="personalInfoFormU.groupUserid" ref="groupUserRef" filterable remote reserve-keyword placeholder="请输入姓名或手机号" :remote-method="remoteMethod10" :loading="loading" style="width:160px">
                      <el-option v-for="item in options10" :key="item.regid" :label="item.user_name" :value="item.regid">
                        <span style="float: left">{{ item.user_name }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.mobile_phone }}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="业务总经理：" prop="bizUserid">
                    <el-select v-model="personalInfoFormU.bizUserid" ref="bizUserRef" filterable remote reserve-keyword placeholder="请输入姓名或手机号" :remote-method="remoteMethod11" :loading="loading" style="width:160px">
                      <el-option v-for="item in options11" :key="item.regid" :label="item.user_name" :value="item.regid">
                        <span style="float: left">{{ item.user_name }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.mobile_phone }}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="政治总经理：" prop="polityUserid">
                    <el-select v-model="personalInfoFormU.polityUserid" ref="polityUserRef" filterable remote reserve-keyword placeholder="请输入姓名或手机号" :remote-method="remoteMethod12" :loading="loading" style="width:160px">
                      <el-option v-for="item in options12" :key="item.regid" :label="item.user_name" :value="item.regid">
                        <span style="float: left">{{ item.user_name }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.mobile_phone }}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-row>
        </div>
        <div class="whiteBox">
          <p class="pReset">惩罚决定</p>
          <el-row class="textLft">
            <el-form :model="publishFormU" ref="publishFormU">
              <el-row>
                <el-col :md="3">
                  <el-form-item label="限制晋升">
                    <el-input-number v-model.trim="publishFormU.promoteLimit" :precision="0" :controls="false" :min="0" :max="48" style="width:50px"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :md="5">
                  <el-form-item label="个月，经济处罚">
                    <el-input-number v-model.trim="publishFormU.punishAmount" :precision="1" @change="getRealAmount('publishFormU')" :controls="false" :min="0" :max="1000000" style="width:90px"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :md="3">
                  <el-form-item label="元，扣">
                    <el-input-number v-model.trim="publishFormU.punishRecord" :precision="1" @change="getRealAmount('publishFormU')" :controls="false" :min="0" :max="1000" style="width:60px"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :md="5">
                  <el-form-item label="分，实际金额：">
                    <el-input-number v-model.trim="publishFormU.punishRealAmount" style="width:100px" :controls="false" disabled></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :md="7">
                  <el-form-item label="元； 惩罚类型" prop="punishTypeId">
                    <el-select clearable="" ref="supTypeRef" v-model="publishFormU.punishTypeId" placeholder="请选择" style="width:160px">
                      <el-option v-for="item in publishOptions" :key="item.value" :label="item.name" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="不予核算业绩：" prop="baccount">
                    <el-radio-group v-model="publishFormU.baccount">
                      <el-radio :label="0">是</el-radio>
                      <el-radio :label="1">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="加入黑名单：" prop="bblackList">
                    <el-radio-group v-model="publishFormU.bblackList">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="是否复议：" prop="breconsider">
                    <el-radio-group v-model="publishFormU.breconsider">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="24" class="mgt10">
                  <el-form-item prop="reconsiderContent" label="异议信息：" label-width="100px">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 2}" maxlength="200" resize="none" placeholder="案件责任人异议信息" v-model="publishFormU.reconsiderContent"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24" class="mgt10">
                  <el-form-item prop="reconsiderResult" label="复议结果：" label-width="100px">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 2}" maxlength="200" resize="none" placeholder="请输入" v-model="publishFormU.reconsiderResult"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="updatePersonFlag=false,responsiblePersonSearch()">取消</el-button>
          <el-button type="primary" @click="updatePerson('personalInfoFormU')">确定</el-button>
        </span>
      </el-dialog>
      <!-- 查看图片 -->
      <el-dialog title="查看图片凭证" :close-on-click-modal="false" :show-close="false" :visible.sync="picModalFlag" width="760px">
        <div style="height:500px">
          <img :src="picUrl" alt="" style="width:100%;height:100%">
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button @click="picModalFlag = false">关闭</el-button>
        </span>
      </el-dialog>
      <!-- 查看音频-->
      <el-dialog title="查看音频凭证" :close-on-click-modal="false" :show-close="false" :visible.sync="audioModalFlag" width="400px">
        <audio :src="audioUrl" controls='controls' style="display:block;margin:0 auto"></audio>
        <span slot="footer" class="dialog-footer">
          <el-button @click="audioModalFlag = false">关闭</el-button>
        </span>
      </el-dialog>
      <!-- 导入责任人 -->
      <el-dialog title="批量导入责任人" :close-on-click-modal="false" :show-close="false" :visible.sync="addPeopleFlag" width="520px">
        <p class="clearfix">
          <el-upload class="pull-left" ref="upload" :action="uploadActionUrl" :headers="headers" :before-upload="beforeUpload" :on-success="handleSuccess" :file-list="fileList">
            <el-button size="mediumn" icon="el-icon-upload">导入数据</el-button>
            <el-button size="mediumn" @click.stop="JS_download" style="margin-left:15px;" icon="el-icon-download">下载模板</el-button>
            <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
          </el-upload>
        </p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addPeopleFlag = false">取消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Tools from 'untils/index.js'
import { GET, POST, DELETE, PUT } from "http/custom.js"; //数据调用方法
import { async } from 'q';

export default {
  data() {
    const uploadActionUrl = process.env.VUE_APP_DOMAIN_download + '/oss/upload' //导入文件
    let height = Tools.getTbHeight(285)
    let height1 = Tools.getTbHeight(495)
    return {
      // 电子凭证
      uploadActionUrl,
      headers: {},
      fileList: [],
      picModalFlag: false,
      picUrl: '',
      audioModalFlag: false,
      audioUrl: '',
      fileArr: [],//新增案件电子凭证
      fileArr2: [],//修改案件电子凭证

      // 批量添加责任人
      operateStatus: '',
      addSuccessId: '',//新增成功后案件id
      addStatus: '1',//当前新增流程1案件2责任人
      updateId: '',//当前修改案件id
      respUserid: '',
      height: height,
      height1: height1,
      areaOptions: [],//所属区域字典option
      caseOptions: [],//案件类型
      violateOptions: [],//违规类型
      responsibilityOptions: [],//责任类型
      publishOptions: [],//惩罚类型
      deptsOptions: [],//部门字典
      typeOptions: [
        {
          "name": "惩罚类型",
          "value": 2
        }
      ],
      // 搜索
      searchWord: '',
      state: '',
      RPSearch: {
        placeSelect: '',
        caseTypeId: '',
        violationTypeId: ''
      },
      // 表格
      loading_search: false,
      loading: false, //table加载动画开关
      RPTableData: [],
      size: 15, //每页显示记录条数
      current: 1, //当前页码
      total: 0, //总记录数据
      // 新增奖惩
      size1: 15, //每页显示记录条数
      current1: 1, //当前页码
      total1: 0, //总记录数据
      addRPModal: false,
      addRPform: {
        caseName: '',
        caseTypeId: '',
        supTypeId: '',
        caseSource: '',
        registerDate: '',
        violationTypeId: '',
        violationDate: '',
        initUserid: '',
        initDeptid: '',
        auditDetails: '',
        fileNumber: '',
        handleUserid: '',
        violationTruth: '',
        violationInstitution: ''
      },
      addRPformRule: {
        caseName: [{ required: true, message: "请填写", trigger: "blur" }],
        caseTypeId: [{ required: true, message: "请选择", trigger: "change" }],
        supTypeId: [{ required: true, message: "请选择", trigger: "change" }],
        caseSource: [{ required: true, message: "请填写", trigger: "blur" }],
        registerDate: [{ required: true, message: "请选择日期", trigger: "change" }],
        violationTypeId: [{ required: true, message: "请选择", trigger: "change" }],
        violationDate: [{ required: true, message: "请选择日期", trigger: "change" }],
        initUserid: [{ required: true, message: "请填写", trigger: "blur" }],
        initDeptid: [{ required: true, message: "请选择", trigger: "change" }],
        auditDetails: [{ required: true, message: "请填写", trigger: "blur" }],
        // fileNumber: [{ required: true, message: "请填写", trigger: "blur" }],
        // handleUsername: [{ required: true, message: "请填写", trigger: "blur" }],
        violationTruth: [{ required: true, message: "请填写（250字以内）", trigger: "blur" }],
        violationInstitution: [{ required: true, message: "请填写（250字以内）", trigger: "blur" }]
      },
      options: [],//提起人
      options1: [],//督办人
      responsiblePersonData: [],//案件责任人表格
      // dialogImageUrl: '',//图片凭证
      // dialogVisible: false,
      // 修改奖惩
      size2: 15, //每页显示记录条数
      current2: 1, //当前页码
      total2: 0, //总记录数据
      updateRPModal: false,
      addRPformU: {
        caseName: '',
        caseTypeId: '',
        supTypeId: '',
        caseSource: '',
        registerDate: '',
        violationTypeId: '',
        violationDate: '',
        initUserid: '',
        initDeptid: '',
        auditDetails: '',
        fileNumber: '',
        handleUserid: '',
        violationTruth: '',
        violationInstitution: ''
      },
      addRPformURule: {
        caseName: [{ required: true, message: "请填写", trigger: "blur" }],
        caseTypeId: [{ required: true, message: "请选择", trigger: "change" }],
        supTypeId: [{ required: true, message: "请选择", trigger: "change" }],
        caseSource: [{ required: true, message: "请填写", trigger: "blur" }],
        registerDate: [{ required: true, message: "请选择日期", trigger: "change" }],
        violationTypeId: [{ required: true, message: "请选择", trigger: "change" }],
        violationDate: [{ required: true, message: "请选择日期", trigger: "change" }],
        initUserid: [{ required: true, message: "请填写", trigger: "blur" }],
        initDeptid: [{ required: true, message: "请选择", trigger: "change" }],
        auditDetails: [{ required: true, message: "请填写", trigger: "blur" }],
        // fileNumber: [{ required: true, message: "请填写", trigger: "blur" }],
        // handleUsername: [{ required: true, message: "请填写", trigger: "blur" }],
        violationTruth: [{ required: true, message: "请填写（250字以内）", trigger: "blur" }],
        violationInstitution: [{ required: true, message: "请填写（250字以内）", trigger: "blur" }]
      },
      options2: [],//提起人
      options3: [],//督办人
      responsiblePersonDataU: [],//案件责任人表格
      // 新增责任人
      options4: [],//姓名
      options6: [],//集团副总
      options7: [],//业务总经理
      options8: [],//政治总经理
      addPersonFlag: false,
      personalInfoForm: {
        respTypeId: '',
        respUserid: '',
        respNumber: '',
        identityNumber: '',
        workAreaId: '',
        postName: '',
        groupUserid: '',
        bizUserid: '',
        polityUserid: ''
      },
      personalInfoFormRule: {
        respTypeId: [{ required: true, message: "请选择", trigger: "change" }],
        respUserid: [{ required: true, message: "请选择", trigger: "change" }],
        // respNumber: [{ required: true, message: "请填写", trigger: "blur" }],
        // identityNumber: [{ required: true, message: "请填写", trigger: "blur" }],
        workAreaId: [{ required: true, message: "请选择", trigger: "change" }],
        postName: [{ required: true, message: "请填写", trigger: "change" }],
        groupUserid: [{ required: true, message: "请选择", trigger: "change" }],
        bizUserid: [{ required: true, message: "请选择", trigger: "change" }],
        polityUserid: [{ required: true, message: "请选择", trigger: "change" }]
      },
      publishForm: {
        promoteLimit: '',
        punishAmount: '',
        punishRecord: '',
        punishRealAmount: '',
        punishTypeId: '',
        baccount: 1,
        bblackList: 1,
        breconsider: 1,
        reconsiderContent: '',
        reconsiderResult: '',
      },
      publishFormRule: {
        // supTypeId: [{ required: true, message: "请选择", trigger: "change" }]
      },
      radio2: '',
      // 修改责任人
      updatePersonFlag: false,
      options9: [],//姓名
      options10: [],//集团副总
      options11: [],//业务总经理
      options12: [],//政治总经理
      personalInfoFormU: {
        respTypeId: '',
        respUserid: '',
        respNumber: '',
        identityNumber: '',
        workAreaId: '',
        postName: '',
        groupUserid: '',
        bizUserid: '',
        polityUserid: ''
      },
      personalInfoFormURule: {
        respTypeId: [{ required: true, message: "请选择", trigger: "change" }],
        respUserid: [{ required: true, message: "请选择", trigger: "change" }],
        // respNumber: [{ required: true, message: "请填写", trigger: "blur" }],
        // identityNumber: [{ required: true, message: "请填写", trigger: "blur" }],
        workAreaId: [{ required: true, message: "请选择", trigger: "change" }],
        postName: [{ required: true, message: "请填写", trigger: "change" }],
        groupUserid: [{ required: true, message: "请选择", trigger: "change" }],
        bizUserid: [{ required: true, message: "请选择", trigger: "change" }],
        polityUserid: [{ required: true, message: "请选择", trigger: "change" }]
      },
      publishFormU: {
      },
      // 批量增加责任人
      addPeopleFlag: false,

      personalInfoData: {},//姓名popover弹窗数据
      areaCode: ''
    }
  },
  created() {
    this.headers['x-user-token'] = localStorage.getItem('token') //设置上传数据文件excel的token
    this.queryAreaList()//获取所属区域字典
    this.queryAllDepts()
    this.RPDictionaries()//奖惩系统内字典合集

    let checkQ = Tools.includes(this.$store.state.userActionAll, '6e08c264ceb04c28a4831ab83ae32e4e')
    if (checkQ == false) {
      let code = this.$store.state.oaGetTokenInfo.otherInfo.cgurCompanyCode
      POST(process.env.VUE_APP_DOMAIN_personnel + '/queryAreaList').then(res => {
        let areaOptions = res.data
        for (var i = 0; i < areaOptions.length; i++) {
          if (areaOptions[i].areaId == code) {
            this.areaCode = areaOptions[i].areaName
          }
        }
        this.JS_search_RP()
      }).catch(error => {
        console.log(error)
      })
    } else {
      this.JS_search_RP()
    }

  },
  computed: {
    sendNoticeQ() {//发送消息权限789
      return Tools.includes(this.$store.state.userActionAll, '0ad4a03466e04b609096f3002c8f1eb6')
    },
    addQ() {//新增权限
      return Tools.includes(this.$store.state.userActionAll, '4a0f58e58cdc461c8444f341b07c6f77')
    },
    deleteQ() {//删除权限
      return Tools.includes(this.$store.state.userActionAll, '503e4c829b05409d88ae023e2f699bb2')
    },
    updateQ() {//修改权限
      return Tools.includes(this.$store.state.userActionAll, 'bae5ecce75444dd18b34507c98911594')
    },
    checkQ() {//奖惩管理员权限（查看所有数据）
      return Tools.includes(this.$store.state.userActionAll, '6e08c264ceb04c28a4831ab83ae32e4e')
    },

  },
  methods: {
    // 批量上传责任人
    beforeUpload(file) {//上传文件之前的钩子
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
      this.addRPModal = false; //关闭导入框
      if (res.code == 0) {//文件上传成功

      } else {
        //失败
        this.$msgBox.alert('<span style="color:red;">【系统无法识别EXCLE中的空白，公式和非法字符。请先清理】。</span>', '温馨提示', {
          dangerouslyUseHTMLString: true
        })
      }
      this.$refs.upload.clearFiles() //清空已上传的文件列表（该方法不支持在 before-upload 中调用）
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
    // 新增电子凭证
    handleSuccess1(res, file, fileList) { //上传文件接口调取成功回调
      if (res.status == 200) {//文件上传成功
        // console.log('上传数据成功', res)
        console.log('上传数据成功', file)
        // console.log('上传数据成功', fileList)
        this.fileArr.push({ "name": file.name, "address": file.response.data, 'type': file.raw.type.split('/')[1], 'url': process.env.VUE_APP_DOMAIN_download + '/oss/download?view=true&key=' + file.response.data })
        console.log(this.fileArr)
      } else {//文件上传失败失败
        console.log('上传数据失败', res)
      }
    },
    beforeUploadPic1(file) {
      //上传文件之前的钩子
      console.log("上传文件之前的回调", file);
      let testFileType = (file.name.substring(file.name.lastIndexOf('.') + 1)).toLowerCase() //截取文件后缀
      console.log(testFileType)
      const extension1 = testFileType === 'png'
      const extension2 = testFileType === 'jpeg'
      const extension3 = testFileType === 'mp3'
      const extension4 = testFileType === 'wav'
      const extension5 = testFileType === 'jpg'
      if (!extension1 && !extension2 && !extension3 && !extension4 && !extension5) {
        this.$message.error("上传数据文件只能是 jpeg/jpg/png/mp3/wav 格式!");
      }
      return extension1 || extension2 || extension3 || extension4 || extension5
    },
    deleteEfile1(index) {
      console.log(index)
      this.fileArr.splice(index, 1)
    },
    checkEFile1(index) {
      console.log(this.fileArr[index].type)
      if (this.fileArr[index].type == 'jpeg' || this.fileArr[index].type == 'png' || this.fileArr[index].type == 'jpg') {
        this.picUrl = this.fileArr[index].url
        this.picModalFlag = true
      } else {
        this.audioUrl = this.fileArr[index].url
        this.audioModalFlag = true
      }
    },
    // 修改电子凭证
    handleSuccess2(res, file, fileList) { //上传文件接口调取成功回调
      if (res.status == 200) {//文件上传成功
        // console.log('上传数据成功', res)
        console.log('上传数据成功', file)
        // console.log('上传数据成功', fileList)
        this.fileArr2.push({ "name": file.name, "address": file.response.data, 'type': file.raw.type.split('/')[1], 'url': process.env.VUE_APP_DOMAIN_download + '/oss/download?view=true&key=' + file.response.data })
        console.log(this.fileArr2)
      } else {//文件上传失败失败
        console.log('上传数据失败', res)
      }
    },
    deleteEfile2(index) {
      console.log(index)
      this.fileArr2.splice(index, 1)
    },
    checkEFile2(index) {
      console.log(this.fileArr2[index].type)
      if (this.fileArr2[index].type == 'jpeg' || this.fileArr2[index].type == 'png' || this.fileArr2[index].type == 'jpg') {
        this.picUrl = this.fileArr2[index].url
        this.picModalFlag = true
      } else {
        this.audioUrl = this.fileArr2[index].url
        this.audioModalFlag = true
      }
    },


    queryAreaList() {//获取所属区域
      POST(process.env.VUE_APP_DOMAIN_personnel + '/queryAreaList').then(res => {
        this.areaOptions = res.data
      }).catch(error => {
        console.log(error)
      })
    },
    queryAllDepts() {
      GET(process.env.VUE_APP_DOMAIN_personnel + '/queryAllDepts').then(res => {
        this.deptsOptions = res.data
      }).catch(error => {
        console.log(error)
      })
    },
    RPDictionaries() {
      //案件类型
      GET(process.env.VUE_APP_DOMAIN_supervision + '/getCommonDictionaryInfoByGroup', { group: "invest_type" }).then(res => {
        if (res.code == 0) {
          this.caseOptions = res.data
        }
      }).catch(error => {
        console.log(error)
      })
      //违规类型
      GET(process.env.VUE_APP_DOMAIN_supervision + '/getCommonDictionaryInfoByGroup', { group: "violate_type" }).then(res => {
        if (res.code == 0) {
          this.violateOptions = res.data
        }
      }).catch(error => {
        console.log(error)
      })
      //惩罚类型
      GET(process.env.VUE_APP_DOMAIN_supervision + '/getCommonDictionaryInfoByGroup', { group: "punish_type" }).then(res => {
        if (res.code == 0) {
          this.publishOptions = res.data
        }
      }).catch(error => {
        console.log(error)
      })
      // 责任人类型
      GET(process.env.VUE_APP_DOMAIN_supervision + '/getCommonDictionaryInfoByGroup', { group: "responsibility_type" }).then(res => {
        if (res.code == 0) {
          this.responsibilityOptions = res.data
        }
      }).catch(error => {
        console.log(error)
      })
    },
    reset(formName) {//新增重置按钮
      this.$refs[formName].resetFields();
    },
    // 搜索
    // JS_select() {//案件责任人输入后不进行选择自动清除输入
    //   if (this.state.indexOf(')') == -1) {
    //     this.state = ''
    //   }
    // },
    // querySearch(queryString, cb) {
    //   console.log(queryString);
    //   GET(process.env.VUE_APP_DOMAIN_personnel + '/queryEmployeesByNameOrPhoneNuber', { "searchWord": queryString }).then(res => {
    //     // console.log(res);
    //     let arr = res.data
    //     let result = []
    //     for (var i in arr) {
    //       let obj = {}
    //       obj.value = `${arr[i].user_name}（${arr[i].mobile_phone}）`//显示的数据
    //       obj.payOperid = arr[i].regid
    //       result.push(obj)
    //     }
    //     console.log(result);
    //     cb(result);
    //   }).catch(error => {
    //     console.log(error)
    //   })
    // },
    // handleSelect(item) {
    //   this.respUserid = item.payOperid
    // },

    JS_search_RP() {//查询案件列表
      this.loading = true
      var searchObj = {
        "respUserid": this.respUserid,
        "caseTypeId": this.RPSearch.caseTypeId,
        "violationTypeId": this.RPSearch.violationTypeId,
        "workAreaName": this.RPSearch.placeSelect,
        "current": this.current,
        "size": this.size
      }
      let checkQ = Tools.includes(this.$store.state.userActionAll, '6e08c264ceb04c28a4831ab83ae32e4e')
      if (checkQ == false) {
        searchObj.workAreaName = this.areaCode
      }
      POST(process.env.VUE_APP_DOMAIN_supervision + "/supervisions", searchObj).then(res => {
        this.loading = false
        if (res.code == 0) {
          this.RPTableData = res.data.records
          this.total = res.data.total
          this.current = res.data.current
          this.size = res.data.size
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 表格
    addRPCase() {
      this.fileArr = []
      // this.$refs['addRPform'].resetFields();
      this.operateStatus = 'add'
      this.addStatus = '1'
      this.addRPModal = true
    },
    handlecurrentChange(val) {//当前页，点击页码
      this.current = val;
      this.JS_search_RP();
    },
    handleSizeChange(val) {//分页,下拉
      this.size = val;
      this.JS_search_RP();
    },
    // handleRemove(file, fileList) {//图片凭证
    //   console.log(file, fileList);
    // },
    sendNotice(id) {
      this.$msgBox.confirm('你确定要发送消息吗?该操作只能使用一次！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        POST(process.env.VUE_APP_DOMAIN_supervision + '/sendMessageToResponsibilities', { "id": id }).then(res => {
          if (res.code == '0') {
            this.$message({
              type: 'success',
              message: '发送成功!',
              showClose: true
            })
            this.JS_search_RP()
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消发送'
        })
      })
    },
    updateCase(id) {//列表修改
      this.operateStatus = 'update'
      this.updateId = id
      console.log('当前修改案件id：' + this.updateId)
      // 根据提起人、督办人动态获取字典
      GET(process.env.VUE_APP_DOMAIN_supervision + '/supervision', { "id": id }).then(res => {
        this.addRPformU = res.data
        GET(process.env.VUE_APP_DOMAIN_personnel + '/queryEmployeesByNameOrPhoneNuber', { "searchWord": res.data.initUsername }).then(res => {
          this.options2 = res.data
        });
        if (res.data.handleUsername) {
          GET(process.env.VUE_APP_DOMAIN_personnel + '/queryEmployeesByNameOrPhoneNuber', { "searchWord": res.data.handleUsername }).then(res => {
            this.options3 = res.data
          });
        }
        this.fileArr2 = res.data.supFiles.map(function (item) { return { "address": item.fileData, "type": item.fileType, "name": item.fileName, "url": process.env.VUE_APP_DOMAIN_download + '/oss/download?view=true&key=' + item.fileData } })
        console.log(this.fileArr2)
        console.log(res.data.supFiles)
        this.responsiblePersonSearch();
        this.updateRPModal = true
      });
    },
    // 新增奖惩案件
    addRPCaseSave(formName) {
      const awaitWrap = (promise) => {
        return promise
          .then(data => [null, data])
          .catch(err => [err, null])
      }
      this.$refs[formName].validate(async valid => {
        if (valid) {

          let updateForm = {}
          updateForm.caseTypeName = this.getOPtionsvalue(this.caseOptions, this[formName].caseTypeId)//案件类型
          updateForm.supTypeName = this.getOPtionsvalue(this.typeOptions, this[formName].supTypeId)//奖惩类型
          updateForm.violationTypeName = this.getOPtionsvalue(this.violateOptions, this[formName].violationTypeId)//违规类型
          updateForm.initDeptname = this.getOPtionsvalue1(this.deptsOptions, this[formName].initDeptid)//提起部门类型

          const [err, resDtType] = await awaitWrap(GET(process.env.VUE_APP_DOMAIN_personnel + '/queryUserInfoToRegid', { "regid": this[formName].initUserid }))
          //数据源接口成功时
          if (err === null) {
            updateForm.initUsername = resDtType.data.userName
            // console.log(resDtType.data.userName)
          }

          if (this[formName].handleUserid != '') {
            // updateForm.handleUsername = this.$refs.handleUserRef.selectedLabel
            const [err1, resDtType1] = await awaitWrap(GET(process.env.VUE_APP_DOMAIN_personnel + '/queryUserInfoToRegid', { "regid": this[formName].handleUserid }))
            //数据源接口成功时
            if (err1 === null) {
              updateForm.handleUsername = resDtType1.data.userName
              // console.log(resDtType1.data.userName)
            }
          }
          let saveObj = { ...this.addRPform, ...updateForm } //保存对象
          saveObj.supFiles = this.fileArr.map(function (item) { return { "fileData": item.address, "fileType": item.type, "fileName": item.name } })
          saveObj.supResponsibilities = []
          console.log(saveObj)
          POST(process.env.VUE_APP_DOMAIN_supervision + '/supervision', saveObj).then(res => {
            this.addSuccessId = res.data
            this.$message({
              type: 'success',
              message: '新增案件成功!',
              showClose: true
            })
            this.addStatus = '2'
            this.reset('addRPform')
          }).catch(error => {
            console.log(error)
          })
        } else {
          this.$message({
            showClose: true,
            type: 'warning',
            message: '提交失败，验证不通过'
          })
        }
      })
    },
    addRPDialogClose() {
      this.addRPModal = false
      this.reset('addRPform')
    },
    handlecurrentChange1(val) {//当前页，点击页码
      this.current1 = val;
      this.responsiblePersonSearch();
    },
    handleSizeChange1(val) {//分页,下拉
      this.size1 = val;
      this.responsiblePersonSearch();
    },
    remoteMethod_search(query) { //提起人
      if (query !== '') {
        this.loading_search = true
        GET(process.env.VUE_APP_DOMAIN_personnel + '/queryEmployeesByNameOrPhoneNuber', { "searchWord": query }).then(res => {
          this.loading_search = false
          this.options = res.data
          // console.log(this.options)
        });
      } else {
        this.options = [];
      }
    },
    remoteMethod(query) { //提起人
      if (query !== '') {
        this.loading = true
        GET(process.env.VUE_APP_DOMAIN_personnel + '/queryEmployeesByNameOrPhoneNuber', { "searchWord": query }).then(res => {
          this.loading = false
          this.options = res.data
          // console.log(this.options)
        });
      } else {
        this.options = [];
      }
    },
    remoteMethod1(query) { //督办人
      if (query !== '') {
        this.loading = true
        GET(process.env.VUE_APP_DOMAIN_personnel + '/queryEmployeesByNameOrPhoneNuber', { "searchWord": query }).then(res => {
          this.loading = false
          this.options1 = res.data
          // console.log(this.options1)
        });
      } else {
        this.options1 = [];
      }
    },
    // handlePictureCardPreview(file) {
    //   this.dialogImageUrl = file.url;
    //   this.dialogVisible = true;
    // },

    deleteEmployeeA() {

    },
    finishAddCase() {
      this.JS_search_RP()
      this.addRPModal = false
    },
    //删除奖惩案件
    deleteCase(id) {
      console.log(id)
      this.$msgBox.confirm('你确定要删除该案件吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DELETE(process.env.VUE_APP_DOMAIN_supervision + '/supervisions', { "ids": id }).then(() => { //单条数据删除
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.JS_search_RP()
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
    getOPtionsvalue(options, id) {//固定options根据id获取text
      for (var j = 0; j < options.length; j++) {
        if (options[j].value == id) {
          // console.log(options[j].name)
          return options[j].name
        }
      }
    },
    getOPtionsvalue1(options, id) {//固定options根据id获取text,所属部门
      for (var j = 0; j < options.length; j++) {
        if (options[j].dept_id == id) {
          // console.log(options[j].dept_name)
          return options[j].dept_name
        }
      }
    },
    getOPtionsvalue2(options, id) {//固定options根据id获取text,所属区域
      for (var j = 0; j < options.length; j++) {
        if (options[j].areaId == id) {
          // console.log(options[j].dept_name)
          return options[j].areaName
        }
      }
    },

    // 修改奖惩案件
    handlecurrentChange2(val) {//当前页，点击页码
      this.current2 = val;
      this.responsiblePersonSearch();
    },
    handleSizeChange2(val) {//分页,下拉
      this.size2 = val;
      this.responsiblePersonSearch();
    },
    updateRPCaseSave(formName) {
      // 抽离成公共方法 方便捕获异常
      const awaitWrap = (promise) => {
        return promise
          .then(data => [null, data])
          .catch(err => [err, null])
      }
      this.$refs[formName].validate(async valid => {
        // var that = this
        let updateId = this.updateId
        if (valid) {
          let updateForm = {}
          updateForm.caseTypeName = this.getOPtionsvalue(this.caseOptions, this[formName].caseTypeId)//案件类型
          updateForm.supTypeName = this.getOPtionsvalue(this.typeOptions, this[formName].supTypeId)//奖惩类型
          updateForm.violationTypeName = this.getOPtionsvalue(this.violateOptions, this[formName].violationTypeId)//违规类型
          updateForm.initDeptname = this.getOPtionsvalue1(this.deptsOptions, this[formName].initDeptid)//提起部门类型

          const [err, resDtType] = await awaitWrap(GET(process.env.VUE_APP_DOMAIN_personnel + '/queryUserInfoToRegid', { "regid": this[formName].initUserid }))
          //数据源接口成功时
          if (err === null) {
            updateForm.initUsername = resDtType.data.userName
            console.log(resDtType.data.userName)
          }

          if (this[formName].handleUserid && this[formName].handleUserid != '') {
            const [err1, resDtType1] = await awaitWrap(GET(process.env.VUE_APP_DOMAIN_personnel + '/queryUserInfoToRegid', { "regid": this[formName].handleUserid }))
            //数据源接口成功时
            if (err1 === null) {
              updateForm.handleUsername = resDtType1.data.userName
              console.log(resDtType1.data.userName)
            }
          }
          let saveObj = { ...this[formName], ...updateForm }

          saveObj.supFiles = this.fileArr2.map(function (item) { return { "fileData": item.address, "fileType": item.type, "fileName": item.name, "fileSupId": updateId } })

          delete saveObj.supResponsibilities
          console.log(saveObj);
          PUT(process.env.VUE_APP_DOMAIN_supervision + '/supervision', saveObj).then(() => {
            this.JS_search_RP()
            this.updateRPModal = false
            this.$message({
              type: 'success',
              message: '修改数据成功!',
              showClose: true
            })
          }).catch(error => {
            console.log(error)
          })
        } else {
          this.$message({
            showClose: true,
            type: 'warning',
            message: '提交失败，验证不通过'
          })
        }
      })
    },
    remoteMethod2(query) { //责任人
      if (query !== '') {
        this.loading = true
        GET(process.env.VUE_APP_DOMAIN_personnel + '/queryEmployeesByNameOrPhoneNuber', { "searchWord": query }).then(res => {
          this.loading = false
          this.options2 = res.data
          console.log(this.options2)
        });
      } else {
        this.options2 = [];
      }
    },
    remoteMethod3(query) { //责任人
      if (query !== '') {
        this.loading = true
        GET(process.env.VUE_APP_DOMAIN_personnel + '/queryEmployeesByNameOrPhoneNuber', { "searchWord": query }).then(res => {
          this.loading = false
          this.options3 = res.data
          console.log(this.options3)
        });
      } else {
        this.options3 = [];
      }
    },
    updateEmployee(data) {
      GET(process.env.VUE_APP_DOMAIN_personnel + '/queryEmployeesByNameOrPhoneNuber', { "searchWord": data.respUsername }).then(res => {
        this.options9 = res.data
      });
      GET(process.env.VUE_APP_DOMAIN_personnel + '/queryEmployeesByNameOrPhoneNuber', { "searchWord": data.groupUsername }).then(res => {
        this.options10 = res.data
      });
      GET(process.env.VUE_APP_DOMAIN_personnel + '/queryEmployeesByNameOrPhoneNuber', { "searchWord": data.bizUsername }).then(res => {
        this.options11 = res.data
      });
      GET(process.env.VUE_APP_DOMAIN_personnel + '/queryEmployeesByNameOrPhoneNuber', { "searchWord": data.polityUsername }).then(res => {
        this.options12 = res.data
      });
      console.log(data)
      this.personalInfoFormU = data
      this.personalInfoFormU.workAreaId = Number(this.personalInfoFormU.workAreaId);
      this.publishFormU = data
      this.updatePersonFlag = true
    },
    deleteEmployeeU(id) {
      console.log(id)
      this.$msgBox.confirm('你确定要删除该责任人吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DELETE(process.env.VUE_APP_DOMAIN_supervision + '/supResponsibilities', { "respIds": id }).then(() => { //单条数据删除
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // this.lmSubsidySearch() //刷新表格，重新获取数据
          this.responsiblePersonSearch()
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
    // 新增责任人
    getUserDetail(formName) {
      GET(process.env.VUE_APP_DOMAIN_personnel + '/queryUserInfoToRegid', { "regid": this[formName].respUserid }).then(res => {
        if (res.code == '0') {
          this[formName].identityNumber = res.data.idNum
          this[formName].respNumber = res.data.mobilePhone
          this[formName].postName = res.data.positionName
          // this[formName].postId = res.data.positionId
        }
      });
    },
    getRealAmount(formName) {
      if (this[formName].punishAmount == undefined || this[formName].punishRecord == undefined) {
        this[formName].punishRealAmount = 0
      } else {
        this[formName].punishRealAmount = this[formName].punishAmount + this[formName].punishRecord * 100
      }
    },
    addPerson(formName) {// 新增责任人
      console.log(this.operateStatus)
      const awaitWrap = (promise) => {
        return promise
          .then(data => [null, data])
          .catch(err => [err, null])
      }
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let updateForm = {}
          updateForm.respTypeName = this.getOPtionsvalue(this.responsibilityOptions, this[formName].respTypeId)//责任类型
          updateForm.workAreaName = this.getOPtionsvalue2(this.areaOptions, this[formName].workAreaId)//所属区域
          const [err, resDtType] = await awaitWrap(GET(process.env.VUE_APP_DOMAIN_personnel + '/queryUserInfoToRegid', { "regid": this[formName].respUserid }))
          //数据源接口成功时
          if (err === null) {
            updateForm.respUsername = resDtType.data.userName
            // console.log(resDtType.data.userName)
          }
          const [err1, resDtType1] = await awaitWrap(GET(process.env.VUE_APP_DOMAIN_personnel + '/queryUserInfoToRegid', { "regid": this[formName].groupUserid }))
          //数据源接口成功时
          if (err1 === null) {
            updateForm.groupUsername = resDtType1.data.userName
            // console.log(resDtType.data.userName)
          }
          const [err2, resDtType2] = await awaitWrap(GET(process.env.VUE_APP_DOMAIN_personnel + '/queryUserInfoToRegid', { "regid": this[formName].bizUserid }))
          //数据源接口成功时
          if (err2 === null) {
            updateForm.bizUsername = resDtType2.data.userName
            // console.log(resDtType.data.userName)
          }
          const [err3, resDtType3] = await awaitWrap(GET(process.env.VUE_APP_DOMAIN_personnel + '/queryUserInfoToRegid', { "regid": this[formName].polityUserid }))
          //数据源接口成功时
          if (err3 === null) {
            updateForm.polityUsername = resDtType3.data.userName
            // console.log(resDtType.data.userName)
          }
          this.publishForm.punishTypeName = this.getOPtionsvalue(this.publishOptions, this.publishForm.punishTypeId)
          if (this.publishForm.promoteLimit == undefined || this.publishForm.punishAmount == undefined || this.publishForm.punishRecord == undefined || this.publishForm.punishTypeId == '' || this.publishForm.punishTypeId == null || this.publishForm.punishTypeName == undefined) {
            this.$message({
              showClose: true,
              type: 'warning',
              message: '请填写惩罚决定！'
            })
            return
          }
          // console.log(this.publishForm);
          let saveObj = { ...this.publishForm, ...this[formName], ...updateForm } //保存对象
          console.log(saveObj);
          if (this.operateStatus == 'add') {
            saveObj.respSupId = this.addSuccessId
          } else {
            saveObj.respSupId = this.updateId
          }
          saveObj.punishResult = this.getPublishResult(saveObj)
          POST(process.env.VUE_APP_DOMAIN_supervision + '/supResponsibility', saveObj).then(res => {
            if (res.code == 0) {
              this.$message({
                showClose: true,
                type: 'success',
                message: '添加案件责任人成功！'
              })
              this.responsiblePersonSearch()
              this.addPersonFlag = false
              this.reset('personalInfoForm')
              this.reset('publishForm')
            }
          });
        }
      })
    },
    responsiblePersonSearch() {//刷新责任人列表
      console.log(this.operateStatus)
      if (this.operateStatus == 'add') {
        let searchObj = {
          "current": this.current1,
          "size": this.size1,
          "respSupId": this.addSuccessId
        }
        POST(process.env.VUE_APP_DOMAIN_supervision + '/supResponsibilities', searchObj).then(res => {
          this.responsiblePersonData = res.data.records
          this.total1 = res.data.total
          this.current1 = res.data.current
          this.size1 = res.data.size
        });
      } else {
        let searchObj = {
          "current": this.current2,
          "size": this.size2,
          "respSupId": this.updateId
        }
        POST(process.env.VUE_APP_DOMAIN_supervision + '/supResponsibilities', searchObj).then(res => {
          this.responsiblePersonDataU = res.data.records
          this.total2 = res.data.total
          this.current2 = res.data.current
          this.size2 = res.data.size
        });
      }
    },
    addPersonDialogClose() {
      this.addPersonFlag = false
      this.reset('personalInfoForm')
      this.reset('publishForm')
    },
    remoteMethod4(query) { //姓名
      if (query !== '') {
        this.loading = true
        GET(process.env.VUE_APP_DOMAIN_personnel + '/queryEmployeesByNameOrPhoneNuber', { "searchWord": query }).then(res => {
          this.loading = false
          this.options4 = res.data
          // console.log(this.options4)
        });
      } else {
        this.options4 = [];
      }
    },
    remoteMethod6(query) {
      if (query !== '') {
        this.loading = true
        GET(process.env.VUE_APP_DOMAIN_personnel + '/queryEmployeesByNameOrPhoneNuber', { "searchWord": query }).then(res => {
          this.loading = false
          this.options6 = res.data
        });
      } else {
        this.options6 = [];
      }
    },
    remoteMethod7(query) {
      if (query !== '') {
        this.loading = true
        GET(process.env.VUE_APP_DOMAIN_personnel + '/queryEmployeesByNameOrPhoneNuber', { "searchWord": query }).then(res => {
          this.loading = false
          this.options7 = res.data
        });
      } else {
        this.options7 = [];
      }
    },
    remoteMethod8(query) {
      if (query !== '') {
        this.loading = true
        GET(process.env.VUE_APP_DOMAIN_personnel + '/queryEmployeesByNameOrPhoneNuber', { "searchWord": query }).then(res => {
          this.loading = false
          this.options8 = res.data
        });
      } else {
        this.options8 = [];
      }
    },
    // 修改责任人
    handleCloseDialog() {
      this.updatePersonFlag = false
      this.responsiblePersonSearch()
    },
    updatePerson(formName) {
      console.log(this.operateStatus)
      const awaitWrap = (promise) => {
        return promise
          .then(data => [null, data])
          .catch(err => [err, null])
      }
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let updateForm = {}
          updateForm.respTypeName = this.getOPtionsvalue(this.responsibilityOptions, this[formName].respTypeId)//责任类型
          updateForm.workAreaName = this.getOPtionsvalue2(this.areaOptions, this[formName].workAreaId)//所属区域
          const [err, resDtType] = await awaitWrap(GET(process.env.VUE_APP_DOMAIN_personnel + '/queryUserInfoToRegid', { "regid": this[formName].respUserid }))
          //数据源接口成功时
          if (err === null) {
            updateForm.respUsername = resDtType.data.userName
            // console.log(resDtType.data.userName)
          }
          const [err1, resDtType1] = await awaitWrap(GET(process.env.VUE_APP_DOMAIN_personnel + '/queryUserInfoToRegid', { "regid": this[formName].groupUserid }))
          //数据源接口成功时
          if (err1 === null) {
            updateForm.groupUsername = resDtType1.data.userName
            // console.log(resDtType.data.userName)
          }
          const [err2, resDtType2] = await awaitWrap(GET(process.env.VUE_APP_DOMAIN_personnel + '/queryUserInfoToRegid', { "regid": this[formName].bizUserid }))
          //数据源接口成功时
          if (err2 === null) {
            updateForm.bizUsername = resDtType2.data.userName
            // console.log(resDtType.data.userName)
          }
          const [err3, resDtType3] = await awaitWrap(GET(process.env.VUE_APP_DOMAIN_personnel + '/queryUserInfoToRegid', { "regid": this[formName].polityUserid }))
          //数据源接口成功时
          if (err3 === null) {
            updateForm.polityUsername = resDtType3.data.userName
            // console.log(resDtType.data.userName)
          }
          // console.log(this.publishForm.punishTypeId)
          this.publishFormU.punishTypeName = this.getOPtionsvalue(this.publishOptions, this.publishFormU.punishTypeId)

          if (this.publishFormU.promoteLimit == undefined || this.publishFormU.punishAmount == undefined || this.publishFormU.punishRecord == undefined || this.publishFormU.punishTypeId == '' || this.publishForm.punishTypeId == null || this.publishFormU.punishTypeName == undefined) {
            this.$message({
              showClose: true,
              type: 'warning',
              message: '请填写惩罚决定！'
            })
            return
          }
          let updateObj = { ...this.publishFormU, ...this[formName], ...updateForm } //保存对象

          if (this.operateStatus == 'add') {
            updateObj.respSupId = this.addSuccessId
          } else {
            updateObj.respSupId = this.updateId
          }
          updateObj.punishResult = this.getPublishResult(updateObj)
          console.log(updateObj);
          PUT(process.env.VUE_APP_DOMAIN_supervision + '/supResponsibility', updateObj).then(res => {
            if (res.code == '0') {
              this.$message({
                showClose: true,
                type: 'success',
                message: '修改案件责任人成功！'
              })
              this.responsiblePersonSearch()
              this.updatePersonFlag = false
            }
          });
        }
      })
    },
    getPublishResult(dataReset) {//生成惩罚结果字段
      // for (let i in dataReset) {
      let resultStr = ''
      if (dataReset.promoteLimit) {
        resultStr += `限制晋升${dataReset.promoteLimit}个月，`
      }
      if (dataReset.punishAmount) {
        resultStr += `经济处罚${dataReset.punishAmount}元，`
      }
      if (dataReset.punishRecord) {
        resultStr += `扣${dataReset.punishRecord}分，`
      }
      if (dataReset.punishRealAmount) {
        resultStr += `实际金额：${dataReset.punishRealAmount}元，`
      }
      if (dataReset.baccount == "0") {
        resultStr += `不予核算业绩，`
      }
      if (dataReset.bblackList == "0") {
        resultStr += `加入黑名单，`
      }
      if (dataReset.breconsider == "0") {
        resultStr += `不予复议，`
      }
      // dataReset[i].resultStr = resultStr.substring(0, resultStr.length - 1)
      // }
      return resultStr.substring(0, resultStr.length - 1)
    },

    remoteMethod9(query) {//责任人
      if (query !== '') {
        this.loading = true
        GET(process.env.VUE_APP_DOMAIN_personnel + '/queryEmployeesByNameOrPhoneNuber', { "searchWord": query }).then(res => {
          this.loading = false
          this.options9 = res.data
        });
      } else {
        this.options9 = [];
      }
    },
    remoteMethod10(query) {//集团副总
      if (query !== '') {
        this.loading = true
        GET(process.env.VUE_APP_DOMAIN_personnel + '/queryEmployeesByNameOrPhoneNuber', { "searchWord": query }).then(res => {
          this.loading = false
          this.options10 = res.data
        });
      } else {
        this.options10 = [];
      }
    },
    remoteMethod11(query) {//业务总经理
      if (query !== '') {
        this.loading = true
        GET(process.env.VUE_APP_DOMAIN_personnel + '/queryEmployeesByNameOrPhoneNuber', { "searchWord": query }).then(res => {
          this.loading = false
          this.options11 = res.data
        });
      } else {
        this.options11 = [];
      }
    },
    remoteMethod12(query) {//政治总经理
      if (query !== '') {
        this.loading = true
        GET(process.env.VUE_APP_DOMAIN_personnel + '/queryEmployeesByNameOrPhoneNuber', { "searchWord": query }).then(res => {
          this.loading = false
          this.options12 = res.data
        });
      } else {
        this.options12 = [];
      }
    },
    // 批量新增责任人

    //根据员工编号获取个人信息
    getInfoForId(num) {
      GET(process.env.VUE_APP_DOMAIN_personnel + "/queryUserInfoToRegid", { regid: num })
        .then(res => {
          this.personalInfoData = res.data;
          this.personalInfoData.employedDates = this.personalInfoData.employedDates.split(
            " "
          )[0];
          // console.log(this.personalInfoData)
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

}
</script>

<style scoped>
.bottom {
  padding-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  height: 150px;
  display: block;
}
.image_laba {
  width: 100px;
  height: 100px;
  margin: 25px auto;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
</style>
