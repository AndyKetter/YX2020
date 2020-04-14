<template>
  <div class="summary-tables">
    <div class="guide">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home/personnelSystem' }">人事系统</el-breadcrumb-item>
        <el-breadcrumb-item>培训管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/personnelSystem' }">(返回上级)</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 111 -->
    <div class="bgWhite mgt15">
      <el-tabs v-model="activeName" type="border-card" :before-leave="tabsClick">
        <el-tab-pane label="培训人员管理" name="first">
          <div class="pull-left">
            <el-form :inline="true" :model="trainerSearch" class="mar-no pull-left">
              <el-form-item label="日期">
                <el-date-picker v-model="trainerSearch.batch" value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" style="width:270px">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="姓名">
                <el-input v-model.trim="trainerSearch.name" clearable placeholder="请输入名字" class="width155"></el-input>
              </el-form-item>
              <el-form-item label="是否通过">
                <el-select clearable v-model="trainerSearch.typeId" placeholder="请选择" class="width155">
                  <el-option v-for="item in dataOptions" :key="item.dataId" :label="item.dataName" :value="item.dataId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="trainerDataSearch('1')">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="pull-right">
            <el-button type="primary" @click="addPeopleModal=true" v-if="trainerAddLimit">新增</el-button>&nbsp;
            <el-dropdown @command="handleCommand" trigger="click" v-if="trainerImportLimit||trainerExportLimit||trainerDeleteLimit">
              <el-button>
                更多操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a" class="cloud-uploadBtn" v-if="trainerImportLimit"><i></i>&nbsp;导入</el-dropdown-item>
                <el-dropdown-item command="b" class="cloud-downloadBtn" :divided="trainerImportLimit" v-if="trainerExportLimit"><i></i>&nbsp;导出</el-dropdown-item>
                <el-dropdown-item command="c" :divided="trainerExportLimit||trainerImportLimit" v-if="trainerDeleteLimit">批量删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="table_wrap">
            <el-table :height="tabHeight" :data="trainerData" @selection-change="handleSelectionChange" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
              <el-table-column type="selection" width="50"></el-table-column>
              <el-table-column label="序号" type="index" min-width="50"></el-table-column>
              <el-table-column prop="userName" label="姓名" min-width="150"></el-table-column>
              <el-table-column prop="mobilePhone" label="手机号" min-width="120"></el-table-column>
              <el-table-column prop="idCard" label="身份证号" min-width="160"></el-table-column>
              <el-table-column label="得分" min-width="70">
                <template slot-scope="scope">
                  <span v-if="scope.row.isPass=='0'">--</span>
                  <span v-else>{{scope.row.score}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="passScore" label="及格分" min-width="70"></el-table-column>
              <el-table-column prop="rname" label="试卷规则" min-width="150"></el-table-column>
              <el-table-column label="是否通过" min-width="70">
                <template slot-scope="scope">
                  <span v-if="scope.row.isPass=='0'">待考试</span>
                  <span v-else-if="scope.row.isPass=='1'">通过</span>
                  <span v-else style="color:#EF3838">未通过</span>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="员工状态" min-width="70" show-overflow-tooltip></el-table-column>
              <el-table-column prop="createTime" label="添加时间" min-width="160"> </el-table-column>
              <el-table-column label="操作" fixed="right" min-width="100" v-if="trainerUpdateLimit||trainerDeleteLimit">
                <template slot-scope="scope">
                  <el-button type="text" size="small" :disabled="scope.row.isPass=='1'||scope.row.isPass=='2'" @click="updatePeopleModal(scope.row.id)" v-if="trainerUpdateLimit">修改</el-button>
                  <el-button type="text" size="small" class="deleteTxt" @click="deletePeople(scope.row.id)" v-if="trainerDeleteLimit">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div id="pagination">
              <el-pagination @size-change="trainerHandleSizeChange" @current-change="trainerHandlecurrentChange" background :current-page="trainerCurrent" :page-sizes="[10,15,20,30,40]" :page-size="trainerSize" layout="total,sizes,prev,pager,next,jumper" :total="trainerTotal">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <!-- 222 -->
        <el-tab-pane label="课程管理" name="second" v-if="courseLimit">
          <div class="pull-left">
            <el-form :inline="true" :model="courseSearch" class="mar-no pull-left">
              <el-form-item label="课程名称">
                <el-input v-model.trim="courseSearch.courseName" clearable placeholder="请输入" class="width155"></el-input>
              </el-form-item>
              <el-form-item label="讲师姓名">
                <el-select clearable v-model="courseSearch.teacherName" placeholder="请选择" class="width155" filterable>
                  <el-option v-for="item in teacherOptions" :key="item.id" :label="item.teachName" :value="item.teachName">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所属学院">
                <el-select clearable v-model="courseSearch.academy" placeholder="请选择" class="width155">
                  <el-option v-for="item in collegeOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="courseDataSearch('1')">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="pull-right">
            <el-button type="primary" @click="addCourse()">新增</el-button>&nbsp;
          </div>
          <div class="table_wrap">
            <el-table :height="tabHeight" :data="courseData" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
              <el-table-column label="序号" type="index" min-width="50"></el-table-column>
              <el-table-column label="缩略图" min-width="100">
                <template slot-scope="scope">
                  <img :src="scope.row.courseUrl" alt="" width="108" height="60" class="course_icon">
                </template>
              </el-table-column>
              <el-table-column label="课程ID" prop="id" width="80"></el-table-column>
              <el-table-column prop="className" label="课程名称" min-width="150"></el-table-column>
              <el-table-column prop="teachName" label="讲师" min-width="80"></el-table-column>
              <el-table-column prop="classTime" label="时长（min）" min-width="80"></el-table-column>
              <el-table-column prop="classType" label="学院" min-width="100">
                <template slot-scope="scope">
                  <span v-if="scope.row.classType=='1'">新员工入职培训</span>
                  <span v-else-if="scope.row.classType=='2'">通用课程学院</span>
                  <span v-else-if="scope.row.classType=='3'">业务管理学院</span>
                  <span v-else-if="scope.row.classType=='4'">职能管理学院</span>
                  <span v-else-if="scope.row.classType=='5'">专家管理学院</span>
                  <span v-else>--</span>
                </template>
              </el-table-column>
              <el-table-column prop="classIntroduction" label="简介" min-width="250" show-overflow-tooltip></el-table-column>
              <el-table-column label="操作" fixed="right" width="100">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="updateCourse(scope.row.id)">修改</el-button>
                  <el-button type="text" size="small" class="deleteTxt" @click="deleteCourse(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div id="pagination">
              <el-pagination @size-change="courseHandleSizeChange" @current-change="courseHandlecurrentChange" background :current-page="courseCurrent" :page-sizes="[10,15,20,30,40]" :page-size="courseSize" layout="total,sizes,prev,pager,next,jumper" :total="courseTotal">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <!-- 333 -->
        <el-tab-pane label="讲师管理" name="third" v-if="teacherLimit">
          <div class="pull-left">
            <el-form :inline="true" :model="teacherSearch" class="mar-no pull-left">
              <el-form-item label="讲师姓名">
                <el-input v-model.trim="teacherSearch.teacherName" placeholder="请输入" clearable class="width155"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="teacherDataSearch('1')">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="pull-right">
            <el-button type="primary" @click="teachUrl = '',addTeacherModal=true">新增</el-button>&nbsp;
          </div>
          <div class="table_wrap">
            <el-table :height="tabHeight" :data="teacherData" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
              <el-table-column label="序号" type="index" min-width="50"></el-table-column>
              <el-table-column label="缩略图" width="150">
                <template slot-scope="scope">
                  <img :src="scope.row.teachUrl" alt="" width="90" height="90" class="course_icon">
                </template>
              </el-table-column>
              <el-table-column prop="teachName" label="讲师" width="150"></el-table-column>
              <el-table-column prop="teachDesc" label="简介" min-width="140"></el-table-column>
              <el-table-column label="操作" fixed="right" width="100">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="updateTeacher(scope.row)">修改</el-button>
                  <el-button type="text" size="small" class="deleteTxt" @click="deleteTeacher(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div id="pagination">
              <el-pagination @size-change="teacherHandleSizeChange" @current-change="teacherHandlecurrentChange" background :current-page="teacherCurrent" :page-sizes="[10,15,20,30,40]" :page-size="teacherSize" layout="total,sizes,prev,pager,next,jumper" :total="teacherTotal">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="广告位管理" name="four" v-if="adsLimit">
          <!-- 444 -->
          <div class="pull-right mb18">
            <el-button type="primary" @click="adsUrl='',addAdsModal=true">新增</el-button>&nbsp;
          </div>
          <div class="table_wrap">
            <el-table :height="tabHeight" :data="adsData" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
              <el-table-column label="序号" type="index" min-width="50"></el-table-column>
              <el-table-column label="缩略图" width="150">
                <template slot-scope="scope">
                  <img :src="scope.row.adsPic" alt="" width="108" height="60" class="course_icon">
                </template>
              </el-table-column>
              <el-table-column prop="adName" label="广告名称" min-width="140"></el-table-column>
              <el-table-column label="操作" fixed="right" width="100">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="updateAds(scope.row.id)">修改</el-button>
                  <el-button type="text" size="small" class="deleteTxt" @click="deleteAds(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div id="pagination">
              <el-pagination @size-change="adsHandleSizeChange" @current-change="adsHandlecurrentChange" background :current-page="adsCurrent" :page-sizes="[10,15,20,30,40]" :page-size="adsSize" layout="total,sizes,prev,pager,next,jumper" :total="adsTotal">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="案例管理" name="five" v-if="caseLimit">
          <!-- 555 -->
          <div class="pull-right mb18">
            <el-button type="primary" @click="setEditorHandler(''),addCaseModal=true,casesUrl=''">新增</el-button>&nbsp;
          </div>
          <div class="table_wrap">
            <el-table :height="tabHeight" :data="caseData" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
              <el-table-column label="序号" type="index" min-width="50"></el-table-column>
              <el-table-column label="缩略图" width="130">
                <template slot-scope="scope">
                  <img :src="scope.row.casesPic" alt="" width="101" height="62" class="course_icon">
                </template>
              </el-table-column>
              <el-table-column prop="caseName" label="案例名称" min-width="140"></el-table-column>
              <el-table-column prop="caseAuthor" label="作者" width="140"></el-table-column>
              <el-table-column prop="caseSource" label="来源" width="140"></el-table-column>
              <el-table-column label="操作" fixed="right" width="100">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="updateCase(scope.row.id)">修改</el-button>
                  <el-button type="text" size="small" class="deleteTxt" @click="deleteCase(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div id="pagination">
              <el-pagination @size-change="caseHandleSizeChange" @current-change="caseHandlecurrentChange" background :current-page="caseCurrent" :page-sizes="[10,15,20,30,40]" :page-size="caseSize" layout="total,sizes,prev,pager,next,jumper" :total="caseTotal">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 新增人员弹框111 -->
    <el-dialog title="新增人员" :close-on-click-modal="false" :visible.sync="addPeopleModal" width="700px" :before-close="closeAddTrainer">
      <el-form :model="addPeople" :rules="addPeopleRule" ref="addPeople" label-width="100px">
        <el-row>
          <el-col :md="12">
            <el-form-item label="姓名：" prop="trainerId">
              <el-select v-model="addPeople.trainerId" clearable filterable remote reserve-keyword placeholder="请输入姓名或手机号" @change="setPhoneNum" :remote-method="remoteMethod_search" :loading="loading_search" style="width:215px">
                <el-option v-for="item in trainerOptions" :key="item.recruitGuid" :label="item.applicantName" :value="item.recruitGuid">
                  <span style="float: left">{{ item.applicantName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.mobile }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="手机号：" prop="phoneNum">
              <el-input v-model="phoneNum" disabled placeholder="请输入" style="width:215px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="身份证号：" prop="cardId">
              <el-input clearable v-model="addPeople.cardId" placeholder="请输入" style="width:215px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="是否学习：" prop="study">
              <el-select v-model="addPeople.study" filterable placeholder="请选择" clearable class="selectRepairIcon width200">
                <el-option v-for="item in studyOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="试卷规则：" prop="rule">
              <el-select v-model="addPeople.rule" filterable placeholder="请选择" clearable class="selectRepairIcon width200">
                <el-option v-for="item in ruleOptions" :key="item.rguid" :label="item.rname" :value="item.rguid">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddTrainer()">取消</el-button>
        <el-button @click="addPeopleSave()" type="primary">确定</el-button>
      </span>
    </el-dialog>
    <!-- 修改人员弹框 -->
    <el-dialog title="修改人员" :close-on-click-modal="false" :visible.sync="modifyPeopleModal" width="700px" :before-close="closeUpdateTrainer">
      <el-form :model="modifyPeople" :rules="modifyPeopleRule" ref="modifyPeople" label-width="100px">
        <el-row>
          <el-col :md="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="modifyPeople.name" disabled class="width215"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="手机号：" prop="phoneNum">
              <el-input v-model="modifyPeople.phoneNum" disabled style="width:215px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="身份证号" prop="cardId">
              <el-input clearable v-model="modifyPeople.cardId" placeholder="请输入" class="width215"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="是否学习" prop="study">
              <el-select v-model="modifyPeople.study" filterable placeholder="是否学习" clearable class="selectRepairIcon width200">
                <el-option v-for="item in studyOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="试卷规则" prop="rule">
              <el-select v-model="modifyPeople.rule" filterable placeholder="请选择" clearable class="selectRepairIcon width200">
                <el-option v-for="item in ruleOptions" :key="item.rguid" :label="item.rname" :value="item.rguid">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeUpdateTrainer()">取消</el-button>
        <el-button @click="updatePeopleSave()" type="primary">保存</el-button>
      </span>
    </el-dialog>
    <!-- 人员导入弹框111 -->
    <el-dialog title="培训人员导入" :close-on-click-modal="false" :show-close="false" :visible.sync="uploadModal" width="520px">
      <p class="clearfix">
        <el-upload class="pull-left" ref="upload" :action="uploadPeopleUrl" :headers="headers" :before-upload="beforeUploadPeople" :on-success="handleSuccessPeople" :file-list="fileList">
          <el-button size="mediumn" class="cloud-uploadBtn"><i></i>&nbsp;导入数据</el-button>
          <el-button size="mediumn" @click.stop="JS_download" style="margin-left:15px;" icon="el-icon-download">下载模板</el-button>
          <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
        </el-upload>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadModal = false">取消</el-button>
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
    <!-- 新增课程弹框222 -->

    <el-dialog title="新增课程" :close-on-click-modal="false" :visible.sync="addCourseModal" width="640px" :before-close="closeAddCourse">
      <el-form :model="addCourseForm" :rules="addCourseFormRule" ref="addCourseForm" label-width="100px">
        <el-row>
          <el-col :md="24">
            <el-form-item label="课程名称：" prop="className">
              <el-input clearable v-model="addCourseForm.className" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24">
            <el-form-item label="课程介绍：" prop="classIntroduction">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 2}" maxlength="500" resize="none" v-model="addCourseForm.classIntroduction" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :md="12">
            <el-form-item label="课程ID：" prop="cardId">
              <el-input clearable v-model="addCourseForm.name" placeholder="请输入耳机编码" class="width200"></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :md="12">
            <el-form-item label="所属学院：" prop="classType">
              <el-select v-model="addCourseForm.classType" filterable placeholder="请选择" @change="kk('addCourseForm')" clearable class="selectRepairIcon width200">
                <el-option v-for="item in collegeOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :md="12">
            <el-form-item label="授课老师：" prop="classTeach">
              <el-select v-model="addCourseForm.classTeach" filterable placeholder="请选择" clearable class="selectRepairIcon width200">
                <el-option v-for="item in teacherOptions" :key="item.id" :label="item.teachName" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="学习时长：" prop="classTime">
              <el-input clearable v-model="addCourseForm.classTime" placeholder="请输入" class="width200">
                <template slot="append">分钟</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" v-if="displayType=='null'">
            <div style="width:100%;height:52px"></div>
          </el-col>
          <el-col :md="12" v-if="displayType=='business'">
            <el-form-item label="职位课程：" style="height:34px">
              <el-select v-model="positionType" filterable placeholder="请选择" clearable class="selectRepairIcon width200">
                <el-option v-for="item in positionOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" v-if="displayType=='function'">
            <el-form-item label="所属部门：" style="height:34px">
              <el-select v-model="deptId" filterable placeholder="请选择" clearable class="selectRepairIcon width200">
                <el-option v-for="item in deptOptions" :key="item.dept_id" :label="item.dept_name" :value="item.dept_id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="4">
            <el-form-item label="封面图：">
            </el-form-item>
          </el-col>
          <el-col :md="20">
            <div class="course_img">
              <el-row>
                <el-col :md="8">
                  <div class="img_box" style="width: 144px;height: 80px">
                    <img v-if="courseUrl!=''" :src="courseUrl" class="adsPic">
                  </div>
                </el-col>
                <el-col :md="12">
                  <p>尺寸: 720*400px</p>
                  <p>大小：不大于100KB</p>
                  <el-upload class="uploadLine" :action="uploadActionUrl" :show-file-list=false :headers="headers" :on-success="handleSuccessAds" :before-upload="beforeUploadPicAds" :file-list="fileList">
                    <el-button>上传</el-button>
                  </el-upload>
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :md="4">
            <el-form-item label="培训视频：">
            </el-form-item>
          </el-col>
          <el-col :md="20">
            <div class="el-form-item el-form-item--small">
              <!-- <label class="el-form-item__label">{{courseVideoName}}</label> -->
              <!-- <el-upload class="uploadLine" :action="uploadVideoUrl" :show-file-list=false :headers="headers" :on-success="handleSuccessVideo" :before-upload="beforeUploadVideo" :file-list="fileList">
                <el-button>上传</el-button>
              </el-upload> -->
              <FileUploader ref="fileUploader1" width="400" />
            </div>
          </el-col>
          <el-col :md="4">
            <el-form-item label="上传课件：">
            </el-form-item>
          </el-col>
          <el-col :md="20">
            <div class="el-form-item el-form-item--small">
              <label class="el-form-item__label">{{courseFileName}}</label>
              <el-upload class="uploadLine" :action="uploadActionUrl" :on-error="handleError" :show-file-list=false :headers="headers" :on-success="handleSuccessFile" :before-upload="beforeUploadFile" :file-list="fileList">
                <el-button>上传</el-button>
              </el-upload>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddCourse()">取消</el-button>
        <el-button @click="addCourse_save()" type="primary">确定</el-button>
      </span>
    </el-dialog>
    <!-- 修改课程弹框222 -->

    <el-dialog title="修改课程" :close-on-click-modal="false" :visible.sync="updateCourseModal" width="640px" :before-close="closeUpdateCourse">
      <el-form :model="updateCourseForm" :rules="updateCourseFormRule" ref="updateCourseForm" label-width="100px">
        <el-row>
          <el-col :md="24">
            <el-form-item label="课程名称：" prop="className">
              <el-input clearable v-model="updateCourseForm.className" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24">
            <el-form-item label="课程介绍：" prop="classIntroduction">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 2}" maxlength="500" resize="none" v-model="updateCourseForm.classIntroduction" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :md="12">
            <el-form-item label="课程ID：" prop="cardId">
              <el-input clearable v-model="addCourseForm.name" placeholder="请输入耳机编码" class="width200"></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :md="12">
            <el-form-item label="所属学院：" prop="classType">
              <el-select v-model="updateCourseForm.classType" filterable placeholder="请选择" @change="kk('updateCourseForm')" clearable class="selectRepairIcon width200">
                <el-option v-for="item in collegeOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :md="12">
            <el-form-item label="授课老师：" prop="classTeach">
              <el-select v-model="updateCourseForm.classTeach" filterable placeholder="请选择" clearable class="selectRepairIcon width200">
                <el-option v-for="item in teacherOptions" :key="item.id" :label="item.teachName" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="学习时长：" prop="classTime">
              <el-input clearable v-model="updateCourseForm.classTime" placeholder="请输入" class="width200">
                <template slot="append">分钟</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" v-if="displayType=='null'">
            <div style="width:100%;height:52px"></div>
          </el-col>
          <el-col :md="12" v-if="displayType=='business'">
            <el-form-item label="职位课程：" style="height:34px">
              <el-select v-model="positionTypeU" filterable placeholder="请选择" clearable class="selectRepairIcon width200">
                <el-option v-for="item in positionOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" v-if="displayType=='function'">
            <el-form-item label="所属部门：" style="height:34px">
              <el-select v-model="deptIdU" filterable placeholder="请选择" clearable class="selectRepairIcon width200">
                <el-option v-for="item in deptOptions" :key="item.dept_id" :label="item.dept_name" :value="item.dept_id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="4">
            <el-form-item label="封面图：">
            </el-form-item>
          </el-col>
          <el-col :md="20">
            <div class="course_img">
              <el-row>
                <el-col :md="8">
                  <div class="img_box" style="width: 144px;height: 80px">
                    <img v-if="courseUrl!=''" :src="courseUrl" class="adsPic">
                  </div>
                </el-col>
                <el-col :md="12">
                  <p>尺寸: 720*400px</p>
                  <p>大小：不大于100KB</p>
                  <el-upload class="uploadLine" :action="uploadActionUrl" :show-file-list=false :headers="headers" :on-success="handleSuccessAds" :before-upload="beforeUploadPicAds" :file-list="fileList">
                    <el-button>重新上传</el-button>
                  </el-upload>
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :md="4">
            <el-form-item label="培训视频：">
            </el-form-item>
          </el-col>
          <el-col :md="20">
            <div class="el-form-item el-form-item--small">
              <label class="el-form-item__label">{{courseVideoName}}</label><br>
              <!-- <el-upload class="uploadLine" :action="uploadVideoUrl" :show-file-list=false :headers="headers" :on-success="handleSuccessVideo" :before-upload="beforeUploadVideo" :file-list="fileList">
                <el-button>重新上传</el-button>
              </el-upload> -->
              <div style="margin-top:15px">
                <FileUploader :changVName="changVName" ref="fileUploader" width="400" />
              </div>
            </div>
          </el-col>
          <el-col :md="4">
            <el-form-item label="上传课件：">
            </el-form-item>
          </el-col>
          <el-col :md="20">
            <div class="el-form-item el-form-item--small">
              <label class="el-form-item__label">{{courseFileName}}</label>
              <el-upload class="uploadLine" :on-error="handleError" :action="uploadActionUrl" :show-file-list=false :headers="headers" :on-success="handleSuccessFile" :before-upload="beforeUploadFile" :file-list="fileList">
                <el-button>重新上传</el-button>
              </el-upload>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeUpdateCourse()">取消</el-button>
        <el-button @click="updateCourse_save()" type="primary">确定</el-button>
      </span>
    </el-dialog>
    <!-- 新增讲师弹框333 -->
    <el-dialog title="新增讲师" :close-on-click-modal="false" :visible.sync="addTeacherModal" width="640px" :before-close="closeAddTeach">
      <el-form :model="addTeacherForm" :rules="addTeacherFormRule" ref="addTeacherForm" label-width="100px">
        <el-row>
          <el-col :md="12">
            <el-form-item label="授课老师：" prop="id">
              <el-select v-model="addTeacherForm.id" clearable filterable remote reserve-keyword placeholder="请输入姓名或手机号" :remote-method="remoteMethod_search2" :loading="loading_search" style="width:180px">
                <el-option v-for="item in employeeOptions" :key="item.regid" :label="item.user_name" :value="item.regid">
                  <span style="float: left">{{ item.user_name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.mobile_phone }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="精英讲师：" prop="checked">
              <el-checkbox v-model="addTeacherForm.checked" style="height:33px"></el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :md="4">
            <el-form-item label="讲师头像：">
            </el-form-item>
          </el-col>
          <el-col :md="20">
            <div class="course_img">
              <el-row>
                <el-col :md="6">
                  <div class="img_box" style="width: 90px;height: 90px">
                    <img v-if="teachUrl!=''" :src="teachUrl" class="adsPic">
                  </div>
                </el-col>
                <el-col :md="14">
                  <p>尺寸: 300*300px</p>
                  <p>大小：不大于100KB</p>
                  <el-upload class="uploadLine" :action="uploadActionUrl" :show-file-list=false :headers="headers" :on-success="handleSuccessAds" :before-upload="beforeUploadPicAds" :file-list="fileList">
                    <el-button>上传</el-button>
                  </el-upload>
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="24" class="mgt10">
            <el-form-item prop="teachDesc" label="讲师简介：">
              <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4}" maxlength="200" resize="none" placeholder="请填写课程简介（200字以内）" v-model="addTeacherForm.teachDesc" style="width:100%;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddTeach()">取消</el-button>
        <el-button @click="addTeacher_save()" type="primary">确定</el-button>
      </span>
    </el-dialog>
    <!-- 修改讲师弹框 -->
    <el-dialog title="修改讲师" :close-on-click-modal="false" :visible.sync="updateTeacherModal" width="640px" :before-close="closeUpdateTeach">
      <el-form :model="updateTeacherForm" :rules="updateTeacherFormRule" ref="updateTeacherForm" label-width="100px">
        <el-row>
          <!-- <el-col :md="12">
            <el-form-item label="授课老师：" prop="id">
              <el-select v-model="updateTeacherForm.id" clearable filterable remote reserve-keyword placeholder="请输入姓名或手机号" :remote-method="remoteMethod_search2" :loading="loading_search" style="width:180px">
                <el-option v-for="item in employeeOptions" :key="item.regid" :label="item.user_name" :value="item.regid">
                  <span style="float: left">{{ item.user_name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.mobile_phone }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :md="12">
            <el-form-item label="授课老师：" prop="teachName">
              <el-input disabled v-model="updateTeacherForm.teachName" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="精英讲师：" prop="checked">
              <el-checkbox v-model="updateTeacherForm.checked" style="height:33px"></el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :md="4">
            <el-form-item label="讲师头像：">
            </el-form-item>
          </el-col>
          <el-col :md="20">
            <div class="course_img">
              <el-row>
                <el-col :md="6">
                  <div class="img_box" style="width: 90px;height: 90px">
                    <img v-if="teachUrl!=''" :src="teachUrl" class="adsPic">
                  </div>
                </el-col>
                <el-col :md="14">
                  <p>尺寸: 300*300px</p>
                  <p>大小：不大于100KB</p>
                  <el-upload class="uploadLine" :action="uploadActionUrl" :show-file-list=false :headers="headers" :on-success="handleSuccessAds" :before-upload="beforeUploadPicAds" :file-list="fileList">
                    <el-button>重新上传</el-button>
                  </el-upload>
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="24" class="mgt10">
            <el-form-item prop="teachDesc" label="讲师简介：">
              <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4}" maxlength="200" resize="none" placeholder="请填写课程简介（200字以内）" v-model="updateTeacherForm.teachDesc" style="width:100%;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeUpdateTeach()">取消</el-button>
        <el-button @click="updateTeacher_save()" type="primary">确定</el-button>
      </span>
    </el-dialog>
    <!-- 新增广告位弹框444 -->
    <el-dialog title="新增广告位" :close-on-click-modal="false" :visible.sync="addAdsModal" width="640px" :before-close="closeAddAds">
      <el-form :model="addAdsForm" :rules="addAdsFormRule" ref="addAdsForm" label-width="100px">
        <el-row>
          <el-col :md="23">
            <el-form-item label="广告名称：" prop="adName">
              <el-input clearable v-model="addAdsForm.adName" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="23">
            <el-form-item label="跳转地址：" prop="adUrl">
              <el-input clearable v-model="addAdsForm.adUrl" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="4">
            <el-form-item label="广告图：">
            </el-form-item>
          </el-col>
          <el-col :md="20">
            <div class="course_img">
              <el-row>
                <el-col :md="8">
                  <div class="img_box" style="width: 158px;height: 72px">
                    <img v-if="adsUrl!=''" :src="adsUrl" class="adsPic">
                  </div>
                </el-col>
                <el-col :md="12">
                  <p>尺寸: 790*357px</p>
                  <p>大小：不大于1000KB</p>
                  <!-- <el-button type="primary" plain>上传</el-button> -->
                  <el-upload class="uploadLine" :action="uploadActionUrl" :show-file-list=false :headers="headers" :on-success="handleSuccessAds" :before-upload="beforeUploadPicAds" :file-list="fileList">
                    <el-button>上传</el-button>
                  </el-upload>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddAds()">取消</el-button>
        <el-button @click="addAds_save()" type="primary">确定</el-button>
      </span>
    </el-dialog>
    <!-- 修改广告位弹框444 -->
    <el-dialog title="修改广告位" :close-on-click-modal="false" :visible.sync="updateAdsModal" width="640px" :before-close="closeUpdateAds">
      <el-form :model="updateAdsForm" :rules="updateAdsFormRule" ref="updateAdsForm" label-width="100px">
        <el-row>
          <el-col :md="23">
            <el-form-item label="广告名称：" prop="adName">
              <el-input clearable v-model="updateAdsForm.adName" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="23">
            <el-form-item label="跳转地址：" prop="adUrl">
              <el-input clearable v-model="updateAdsForm.adUrl" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="4">
            <el-form-item label="广告图：">
            </el-form-item>
          </el-col>
          <el-col :md="20">
            <div class="course_img">
              <el-row>
                <el-col :md="8">
                  <div class="img_box" style="width: 158px;height: 72px">
                    <img v-if="adsUrl!=''" :src="adsUrl" class="adsPic">
                  </div>
                </el-col>
                <el-col :md="12">
                  <p>尺寸: 790*357px</p>
                  <p>大小：不大于1000KB</p>
                  <!-- <el-button type="primary" plain>上传</el-button> -->
                  <el-upload class="uploadLine" :action="uploadActionUrl" :show-file-list=false :headers="headers" :on-success="handleSuccessAds" :before-upload="beforeUploadPicAds" :file-list="fileList">
                    <el-button>重新上传</el-button>
                  </el-upload>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeUpdateAds()">取消</el-button>
        <el-button @click="updateAds_save()" type="primary">确定</el-button>
      </span>
    </el-dialog>
    <!-- 新增案例 555 -->
    <el-dialog title="新增案例" :close-on-click-modal="false" :visible.sync="addCaseModal" width="1040px" top="10vh" :before-close="closeAddCase">
      <el-form :model="addCaseForm" :rules="addCaseFormRule" ref="addCaseForm" label-width="100px">
        <el-row>
          <el-col :md="10">
            <el-form-item label="案例名称：" prop="caseName">
              <el-input clearable v-model="addCaseForm.caseName" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>

          <el-col :md="7">
            <el-form-item label="案例作者：" prop="caseAuthor">
              <el-input clearable v-model="addCaseForm.caseAuthor" placeholder="请输入" class="width200"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="7">
            <el-form-item label="案例来源：" prop="caseSource">
              <el-input clearable v-model="addCaseForm.caseSource" placeholder="请输入" class="width200"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="3">
            <el-form-item label="案例封面：">
            </el-form-item>
          </el-col>
          <el-col :md="21">
            <div class="course_img">
              <el-row>
                <el-col :md="5">
                  <div class="img_box" style="width: 150px;height: 93px">
                    <img v-if="casesUrl!=''" :src="casesUrl" class="adsPic">
                  </div>
                </el-col>
                <el-col :md="14">
                  <p>尺寸: 202*123px</p>
                  <p>大小：不大于50KB</p>
                  <el-upload class="uploadLine" :action="uploadActionUrl" :show-file-list=false :headers="headers" :on-success="handleSuccessAds" :before-upload="beforeUploadPicAds" :file-list="fileList">
                    <el-button>上传</el-button>
                  </el-upload>
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="24" class="mgt10">
            <el-form-item label="案例简介：" prop="caseDesc">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 2}" maxlength="150" resize="none" placeholder="请填写课程简介（150字以内）" v-model.trim="addCaseForm.caseDesc" style="width:100%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="mgt10">
            <el-form-item label="案例详情：">
              <!-- <el-input type="textarea" :autosize="{ minRows: 10, maxRows: 10}" maxlength="500" resize="none" placeholder="请填写课程简介" v-model="addCaseForm.caseContent" style="width:100%;"></el-input> -->
              <Editor ref="mdifyEditor" :catchData="catchData" :content="setEditorContent"></Editor>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddCase()">取消</el-button>
        <el-button @click="addCase_save()" type="primary">确定</el-button>
      </span>
    </el-dialog>
    <!-- 修改案例999 -->
    <el-dialog title="修改案例" :close-on-click-modal="false" :visible.sync="updateCaseModal" width="1040px" top="10vh" :before-close="closeUpdateCase">
      <el-form :model="updateCaseForm" :rules="updateCaseFormmRule" ref="updateCaseForm" label-width="100px">
        <el-row>
          <el-col :md="10">
            <el-form-item label="案例名称：" prop="caseName">
              <el-input clearable v-model="updateCaseForm.caseName" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>

          <el-col :md="7">
            <el-form-item label="案例作者：" prop="caseAuthor">
              <el-input clearable v-model="updateCaseForm.caseAuthor" placeholder="请输入" class="width200"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="7">
            <el-form-item label="案例来源：" prop="caseSource">
              <el-input clearable v-model="updateCaseForm.caseSource" placeholder="请输入" class="width200"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="3">
            <el-form-item label="案例封面：">
            </el-form-item>
          </el-col>
          <el-col :md="21">
            <div class="course_img">
              <el-row>
                <el-col :md="5">
                  <div class="img_box" style="width: 150px;height: 93px">
                    <img v-if="casesUrl!=''" :src="casesUrl" class="adsPic">
                  </div>
                </el-col>
                <el-col :md="14">
                  <p>尺寸: 202*123px</p>
                  <p>大小：不大于50KB</p>
                  <el-upload class="uploadLine" :action="uploadActionUrl" :show-file-list=false :headers="headers" :on-success="handleSuccessAds" :before-upload="beforeUploadPicAds" :file-list="fileList">
                    <el-button>重新上传</el-button>
                  </el-upload>
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="24" class="mgt10">
            <el-form-item label="案例简介：" prop="caseDesc">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 2}" maxlength="150" resize="none" placeholder="请填写课程简介（150字以内）" v-model.trim="updateCaseForm.caseDesc" style="width:100%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="mgt10">
            <el-form-item prop="caseContent" label="案例详情：">
              <!-- <el-input type="textarea" :autosize="{ minRows: 10, maxRows: 10}" maxlength="500" resize="none" placeholder="请填写课程简介" v-model="updateCaseForm.caseContent" style="width:100%;"></el-input> -->
              <Editor ref="mdifyEditor" :catchData="catchData" :content="setEditorContent"></Editor>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeUpdateCase()">取消</el-button>
        <el-button @click="updateCase_save()" type="primary">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Tools from 'untils/index.js'
import Editor from 'components/common/Editor'
import { GET, POST, PUT, DELETE } from "http/custom.js"
import tbMixin from "libs/mixin/tbMixin.js" //动态计算表格高度mixin
import FileUploader from "components/common/FileUploader"
export default {
  name: 'trainManager',
  mixins: [tbMixin],
  components: {
    Editor,
    FileUploader
  },
  data() {
    const uploadActionUrl = process.env.VUE_APP_DOMAIN_download + '/oss/upload' //导入文件
    const uploadVideoUrl = process.env.VUE_APP_DOMAIN_personnel + '/commonTrainUploadFile' //导入文件
    const uploadPeopleUrl = process.env.VUE_APP_DOMAIN_personnel + '/personImportData' //导入文件
    // const uploadActionUrl = process.env.VUE_APP_DOMAIN_financial + '/debtListImport' //导入action  线上

    return {
      getEditorContent: '',
      setEditorContent: '', //初始化富文本的显示的值，或者可以通过这个值来赋值999
      video_loading: "",
      uploadActionUrl,
      uploadVideoUrl,
      uploadPeopleUrl,
      headers: {},
      fileList: [],

      t_height: 315, //减去的高度

      secondHasClicked: false,//切换标记tab是否第一次点击
      thirdHasClicked: false,
      fourHasClicked: false,
      activeName: 'first',
      fiveHasClicked: false,

      ruleOptions: [],//试卷规则字典
      deptOptions: [],
      studyOptions: [//是否学习字典
        { value: '1', label: '是' },
        { value: '2', label: '否' },
      ],
      teacherOptions: [],//是否学习字典
      collegeOptions: [//学院字典
        { value: '1', label: '新员工入职培训' },
        { value: '2', label: '通用课程学院' },
        { value: '3', label: '业务管理学院' },
        { value: '4', label: '职能管理学院' },
        { value: '5', label: '专家管理学院' }
      ],
      positionOptions: [//职位课程字典
        // { value: '-1', label: '通用课程' },
        { value: '0', label: '组员课程' },
        { value: '1', label: '组长课程' },
        { value: '2', label: '部长课程' },
        { value: '3', label: '副总课程' }
      ],
      dataOptions: [
        { dataId: '0', dataName: '待考试' },
        { dataId: '1', dataName: '通过' },
        { dataId: '2', dataName: '未通过' }
      ],

      //培训人员管理111
      phoneNum: '',
      addPeopleModal: false,//增加人员弹框
      modifyPeopleModal: false,//修改人员弹框
      uploadModal: false,//导入人员弹框
      downloadModal: false,//导出人员弹框
      trainerSearch: {
        batch: '',
        name: '',
        typeId: ''
      },
      trainerData: [],
      trainerCurrent: 1,
      trainerSize: 15, //每页显示记录条数
      trainerTotal: 0, //总记录条数
      // 新增培训人员
      addPeople: {
        trainerId: '',
        cardId: '',
        rule: '',
        study: ''
      },
      addPeopleRule: {
        trainerId: [{ required: true, message: "请填写", trigger: "blur" }],
        cardId: [{ required: true, message: "请填写", trigger: "blur" },
        { pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9xX]$/, message: '号码格式有误', trigger: "blur" }],
        rule: [{ required: true, message: "请选择", trigger: "change" }],
        study: [{ required: true, message: "请选择", trigger: "change" }]
      },
      // 修改培训人员
      modifyPeople: {
        name: '',
        cardId: '',
        rule: '',
        study: '',
        phoneNum: ''
      },
      modifyPeopleRule: {
        cardId: [{ required: true, message: "请填写", trigger: "blur" },
        { pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9xX]$/, message: '号码格式有误', trigger: "blur" }],
        rule: [{ required: true, message: "请选择", trigger: "change" }],
        study: [{ required: true, message: "请选择", trigger: "change" }]
      },
      trainerOptions: [],



      loading_search: false,
      multipleSelection: [],
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
      //课程管理 222
      courseSearch: {
        courseName: '',
        teacherName: '',
        academy: ''
      },
      courseData: [],
      courseCurrent: 1,
      courseSize: 15, //每页显示记录条数
      courseTotal: 0, //总记录条数
      // 新增课程
      addCourseModal: false,
      addCourseForm: {
        className: '',
        classIntroduction: '',
        classType: '',
        classTeach: '',
        classTime: ''
      },
      positionType: '',
      deptId: '',
      courseVideoName: '',
      courseFileName: '',
      addCourseFormRule: {
        className: [{ required: true, message: "请填写", trigger: "blur" }],
        classIntroduction: [{ required: true, message: "请填写", trigger: "blur" }],
        classType: [{ required: true, message: "请选择", trigger: "change" }],
        classTeach: [{ required: true, message: "请选择", trigger: "change" }],
        classTime: [{ required: true, message: "请填写", trigger: "blur" },
        { pattern: /^\d{1,4}$/, message: '输入有误', trigger: "blur" }]
      },
      courseUrl: '',
      videoCode: '',
      fileCode: '',
      displayType: 'null',
      // 修改课程
      positionTypeU: '',
      deptIdU: '',
      updateCourseModal: false,
      updateCourseForm: {
        className: '',
        classIntroduction: '',
        classType: '',
        classTeach: '',
        classTime: ''
      },
      updateCourseFormRule: {
        className: [{ required: true, message: "请填写", trigger: "blur" }],
        classIntroduction: [{ required: true, message: "请填写", trigger: "blur" }],
        classType: [{ required: true, message: "请选择", trigger: "change" }],
        classTeach: [{ required: true, message: "请选择", trigger: "change" }],
        classTime: [{ required: true, message: "请填写", trigger: "blur" },
        { pattern: /^\d{1,4}$/, message: '输入有误', trigger: "blur" }]
      },
      // 讲师管理333
      teacherSearch: {
        teacherName: ''
      },
      teacherData: [],
      teacherCurrent: 1,
      teacherSize: 15, //每页显示记录条数
      teacherTotal: 0, //总记录条数
      addTeacherModal: false,
      employeeOptions: [],
      addTeacherForm: {
        id: '',
        checked: false,
        isElite: 0,
        teachDesc: ''
      },
      addTeacherFormRule: {
        id: [{ required: true, message: "请选择", trigger: "change" }],
        teachDesc: [{ required: true, message: "请填写", trigger: "blur" }]
      },
      teachUrl: '',
      updateTeacherModal: false,
      updateTeacherForm: {
        id: '',
        checked: false,
        isElite: 0,
        teachDesc: ''
      },
      updateTeacherFormRule: {
        id: [{ required: true, message: "请选择", trigger: "change" }],
        teachDesc: [{ required: true, message: "请填写", trigger: "blur" }]
      },

      // 广告位管理444
      adsData: [],
      adsCurrent: 1,
      adsSize: 15, //每页显示记录条数
      adsTotal: 0, //总记录条数
      addAdsModal: false,

      addAdsForm: {
        adName: '',
        adUrl: ''
      },
      addAdsFormRule: {
        adName: [{ required: true, message: "请填写", trigger: "blur" }],
        adUrl: [{ required: true, message: "请填写", trigger: "blur" }]
      },
      adsUrl: '',
      updateAdsModal: false,
      updateAdsForm: {
        adName: '',
        adUrl: ''
      },
      updateAdsFormRule: {
        adName: [{ required: true, message: "请填写", trigger: "blur" }],
        adUrl: [{ required: true, message: "请填写", trigger: "blur" }]
      },
      // 案例管理555
      caseData: [],
      caseCurrent: 1,
      caseSize: 15, //每页显示记录条数
      caseTotal: 0, //总记录条数
      addCaseModal: false,
      addCaseForm: {
        caseName: '',
        caseAuthor: '',
        caseSource: '',
        caseDesc: ''
      },
      addCaseFormRule: {
        caseName: [{ required: true, message: "请填写", trigger: "blur" }],
        caseAuthor: [{ required: true, message: "请填写", trigger: "blur" }],
        caseSource: [{ required: true, message: "请填写", trigger: "blur" }],
        caseDesc: [{ required: true, message: "请填写", trigger: "blur" }]
      },
      casesUrl: '',
      updateCaseModal: false,
      updateCaseForm: {
        caseName: '',
        caseAuthor: '',
        caseSource: '',
        caseDesc: ''
      },
      updateCaseFormmRule: {
        caseName: [{ required: true, message: "请填写", trigger: "blur" }],
        caseAuthor: [{ required: true, message: "请填写", trigger: "blur" }],
        caseSource: [{ required: true, message: "请填写", trigger: "blur" }],
        caseDesc: [{ required: true, message: "请填写", trigger: "blur" }]
      },

    }

  },
  created() {
    this.trainerDataSearch('1')
    this.optionsSearch()
    this.headers['x-user-token'] = localStorage.getItem('token') //设置上传数据文件excel的token

  },
  computed: {
    courseLimit() {//课程管理789
      return Tools.includes(this.$store.state.userActionAll, '9a87f7ab71014d3d81336fe3d97a41b1')
    },
    teacherLimit() {//讲师管理
      return Tools.includes(this.$store.state.userActionAll, '2d240dc3f1a04d9399783ed1f44d24ae')
    },
    adsLimit() {//广告位管理
      return Tools.includes(this.$store.state.userActionAll, 'e1c603ec54cc492db6473c9dd97a8856')
    },
    caseLimit() {//案例管理
      return Tools.includes(this.$store.state.userActionAll, '9e4eabbeaf9641e68f88ef49ec65dbd1')
    },
    trainerAddLimit() {//培训人员管理新增
      return Tools.includes(this.$store.state.userActionAll, '86e47754dab64d69a49705db119a4901')
    },
    trainerImportLimit() {//培训人员管理导入
      return Tools.includes(this.$store.state.userActionAll, '8608544cdb2a43d3966fa521c8e5179e')
    },
    trainerExportLimit() {//培训人员管理导出
      return Tools.includes(this.$store.state.userActionAll, 'd60fe061d7084c369e4dfa54bba4948f')
    },
    trainerUpdateLimit() {//培训人员管理修改
      return Tools.includes(this.$store.state.userActionAll, '4b760f8a4e2d4c579f03e5f0b3b6c39c')
    },
    trainerDeleteLimit() {//培训人员管理删除批量删除
      return Tools.includes(this.$store.state.userActionAll, '236c4e9e7c174496bb3e20499e2be605')
    }
  },
  methods: {
    //获取富文本editor中的内容999
    catchData(content) {
      this.getEditorContent = content
    },
    //模拟给富文本赋初始值，一般是后端请求赋值，所以有延迟，故Editor.vue用的是watch去监听而不是computed
    setEditorHandler(content) {
      this.$nextTick(function () {
        this.setEditorContent = content
      })
    },

    optionsSearch() {
      // 试卷规则options
      GET(process.env.VUE_APP_DOMAIN_personnel + '/paperRuleInfos').then(res => {
        this.ruleOptions = res.data
      }).catch(error => {
        console.log(error)
      })
      // 部门options
      POST(process.env.VUE_APP_DOMAIN_personnel + '/queryPositionInfos').then(res => {
        this.deptOptions = res.data
        let obj = {
          dept_id: "1",
          dept_name: "所有部门"
        }
        this.deptOptions.unshift(obj)
      }).catch(error => {
        console.log(error)
      })
      this.teacherOption()
    },
    teacherOption() {
      // 讲师options
      POST(process.env.VUE_APP_DOMAIN_personnel + '/trainClassGetTeachers').then(res => {
        this.teacherOptions = res.data
        console.log(this.teacherOptions)
      }).catch(error => {
        console.log(error)
      })
    },
    handleSizeChange() { },
    handlecurrentChange() { },
    tabsClick(activeName) {//切换标签之前的钩子，若返回 false 或者返回 Promise 且被 reject，则阻止切换。
      if (activeName == 'second' && this.secondHasClicked === false) {
        this.secondHasClicked = true //标记已点击过，不能二次点击触发请求
        this.courseDataSearch('1')
      }
      else if (activeName == 'third' && this.thirdHasClicked === false) {
        this.thirdHasClicked = true
        this.teacherDataSearch('1')
      }
      else if (activeName == 'four' && this.fourHasClicked === false) {
        this.fourHasClicked = true
        this.adsDataSearch()
      }
      else if (activeName == 'five' && this.fiveHasClicked === false) {
        this.fiveHasClicked = true
        this.caseDataSearch()
      }
    },
    // 培训人员管理111
    closeAddTrainer() {
      this.addPeopleModal = false
      this.reset('addPeople')
      this.phoneNum = ''
    },
    closeUpdateTrainer() {
      this.modifyPeopleModal = false
      this.reset('modifyPeople')
    },
    trainerDataSearch(flag) {
      let searchObj = {
        "current": this.trainerCurrent, //当前页码
        "size": this.trainerSize, //每页显示记录条数
        "userName": this.trainerSearch.name,
        "isPass": this.trainerSearch.typeId || ""
      }
      if (flag == '1') {
        searchObj.current = 1
      }
      if (this.trainerSearch.batch && this.trainerSearch.batch != '') {
        searchObj.createTimeStart = this.trainerSearch.batch[0] + ' 00:00:00'
        searchObj.createTimeEnd = this.trainerSearch.batch[1] + ' 23:59:59'
      }
      console.log('搜索对象', searchObj)
      this.loading = true //开启动画
      POST(process.env.VUE_APP_DOMAIN_personnel + '/trainPersonInfos', searchObj).then(res => {
        this.loading = false //关闭动画
        this.trainerData = res.data.records
        console.log(this.trainerData)
        this.trainerCurrent = res.data.current
        this.trainerSize = res.data.size
        this.trainerTotal = res.data.total
      }).catch(error => {
        this.loading = false //关闭动画
        console.log(error)
      })
    },
    trainerHandleSizeChange(val) {
      this.trainerSize = val;
      this.trainerDataSearch('x')
    },
    trainerHandlecurrentChange(val) {
      this.trainerCurrent = val;
      this.trainerDataSearch('x')
    },
    handleCommand(command) {//更多操作下拉框
      if (command == 'a') {
        this.uploadModal = true
      }
      else if (command == 'b') {
        // this.downloadModal = true
        this.exportPeopleData()
      }
      else if (command == 'c') {
        this.deleteAll()//全部删除
      }
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    // 新增培训人员弹窗
    remoteMethod_search(query) {
      if (query !== '') {
        this.loading_search = true
        GET(process.env.VUE_APP_DOMAIN_personnel + '/recruitInfoNews', { rname: query }).then(res => {
          this.loading_search = false
          this.trainerOptions = res.data
          console.log(res.data)
        });
      } else {
        this.options = [];
      }
    },
    setPhoneNum(item) {
      console.log(item)
      if (item == null) {
        this.phoneNum = ''
        return
      }
      for (var i = 0; i < this.trainerOptions.length; i++) {
        if (this.trainerOptions[i].recruitGuid == item) {
          this.phoneNum = this.trainerOptions[i].mobile
          return
        }
      }
    },
    addPeopleSave() {//新增培训人员确定按钮
      this.$refs['addPeople'].validate(async valid => {
        if (valid) {
          console.log(this.addPeople)

          let saveObj = {
            hrGuid: this.addPeople.trainerId,
            idCard: this.addPeople.cardId,
            isLearn: this.addPeople.study,
            rguid: this.addPeople.rule
          }
          console.log(saveObj)
          POST(process.env.VUE_APP_DOMAIN_personnel + '/trainPersonInfo', saveObj).then(res => {
            console.log(res.data)
            this.$message.success("新增成功！");
            this.trainerDataSearch('1')
            this.closeAddTrainer()

          }).catch(error => {
            // this.loading = false //关闭动画
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
    // 修改培训人员弹窗
    updatePeopleModal(id) {

      GET(process.env.VUE_APP_DOMAIN_personnel + '/trainPersonInfo', { id: id }).then(res => {
        console.log(res.data)
        this.modifyPeople.name = res.data.userName
        this.modifyPeople.cardId = res.data.idCard
        this.modifyPeople.rule = res.data.rguid
        this.modifyPeople.study = res.data.isLearn + ''
        this.modifyPeople.phoneNum = res.data.mobilePhone
        this.modifyPeople.id = res.data.id
        this.modifyPeopleModal = true
      }).catch(error => {
        console.log(error)
      })
    },
    updatePeopleSave() {
      this.$refs['modifyPeople'].validate(valid => {
        if (valid) {
          let updateObj = {
            "idCard": this.modifyPeople.cardId,
            "isLearn": this.modifyPeople.study,
            "rguid": this.modifyPeople.rule,
            "id": this.modifyPeople.id
          }
          console.log(updateObj)
          PUT(process.env.VUE_APP_DOMAIN_personnel + '/trainPersonInfo', updateObj).then(() => {
            this.trainerDataSearch('x')
            this.closeUpdateTrainer()
          });
        } else {
          this.$message({
            showClose: true,
            type: 'warning',
            message: '提交失败，验证不通过'
          })
        }
      })
    },

    beforeUploadPeople(file) {
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
    handleSuccessPeople(res) {//上传文件接口调取成功回调
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
            this.trainerDataSearch('1');

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
      let url = process.env.VUE_APP_DOMAIN_download + '/oss/download?key=' + this.downloadErrorKey + '&token=' + localStorage.getItem("token") + "&name=" + encodeURI("培训人员导入失败明细") + ".xlsx";
      window.location.href = url;
    },
    JS_download() {//下载模板
      GET(process.env.VUE_APP_DOMAIN_download + "/template/baseFilesTemplateByFileCode", { fileCode: 'TRAIN_TEST_IMPORT_TEMPLATE' })
        .then(res => {
          console.log(res)
          //获取模板存储返回的ID
          let url = `${process.env.VUE_APP_DOMAIN_download}/oss/download?key=${res.data.fileTemplateId}&name=${res.data.fileTemplateName}.${res.data.fileTemplateSuffix}`;
          window.location.href = url;
        })
        .catch(error => {
          console.log(error);
        });
    },
    exportPeopleData() {//导出
      let Obj = {
        "userName": this.trainerSearch.name,
        "isPass": this.trainerSearch.typeId || ""
      }
      if (this.trainerSearch.batch && this.trainerSearch.batch != '') {
        Obj.createTimeStart = this.trainerSearch.batch[0] + ' 00:00:00'
        Obj.createTimeEnd = this.trainerSearch.batch[1] + ' 23:59:59'
      }

      let url = process.env.VUE_APP_DOMAIN_personnel + "/personExportData?token="
        + localStorage.getItem("token") + "&exportType=1"
      for (let i in Obj) {
        url += '&' + i + '=' + Obj[i]
      }
      window.location.href = url
    },
    handleSelectionChange(val) {//当选择项发生变化时会触发该事件
      this.multipleSelection = val;
      console.log('选中的行', val);
    },
    deleteAll() {
      let arrString = ''
      for (var i = 0; i < this.multipleSelection.length; i++) {
        arrString += this.multipleSelection[i].id + ','
      }
      arrString = arrString.substring(0, arrString.length - 1)
      console.log(arrString)
      if (arrString != '') {
        this.deletePeople(arrString)
      } else {
        this.$message.error("请先选择需要删除的对象!");
      }

    },
    deletePeople(id) {
      this.$msgBox.confirm('你确定要删除培训人员吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DELETE(process.env.VUE_APP_DOMAIN_personnel + '/trainPersonInfos', { ids: id }).then(() => { //单条数据删除
          this.$message.success("删除成功!");
          this.trainerDataSearch('1')
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

    // 课程管理222
    closeAddCourse() {
      // console.log(this.$refs.fileUploader1)
      this.$refs.fileUploader1.uploader.cancel()
      this.$refs.fileUploader1.location = ''
      // console.log(this.$refs.fileUploader1)
      this.addCourseModal = false
      this.reset('addCourseForm')
      this.courseUrl = ''
      this.courseVideoName = ''
      this.courseFileName = ''
      this.videoCode = ''
      this.fileCode = ''
    },
    closeUpdateCourse() {
      this.$refs.fileUploader.uploader.cancel()
      this.updateCourseModal = false
      this.courseUrl = ''
      this.courseVideoName = ''
      this.courseFileName = ''
      this.videoCode = ''
      this.fileCode = ''
    },
    courseDataSearch(flag) {
      let searchObj = {
        "current": this.courseCurrent, //当前页码
        "size": this.courseSize, //每页显示记录条数
        "className": this.courseSearch.courseName,
        "classTeach": this.courseSearch.teacherName || '',
        "classType": this.courseSearch.academy || ''
      }
      if (flag == '1') {
        searchObj.current = 1
      }
      console.log('搜索对象', searchObj)
      this.loading = true //开启动画
      POST(process.env.VUE_APP_DOMAIN_personnel + '/trainClasses', searchObj).then(res => {
        this.loading = false //关闭动画
        let arrData = res.data.records
        for (var i = 0; i < arrData.length; i++) {
          arrData[i].courseUrl = process.env.VUE_APP_DOMAIN_download + '/oss/download?view=true&key=' + arrData[i].classPic
        }
        this.courseData = arrData
        console.log(this.courseData)
        this.courseCurrent = res.data.current
        this.courseSize = res.data.size
        this.courseTotal = res.data.total
      }).catch(error => {
        this.loading = false //关闭动画
        console.log(error)
      })
    },
    // 新增课程
    courseHandleSizeChange(val) {
      this.courseSize = val;
      this.courseDataSearch('x')
    },
    courseHandlecurrentChange(val) {
      this.courseCurrent = val;
      this.courseDataSearch('x')
    },
    reset(formName) {//新增重置按钮
      this.$refs[formName].resetFields();
    },
    addCourse() {
      this.displayType = 'null'
      this.addCourseModal = true
    },
    addCourse_save() {
      console.log(this.$refs.fileUploader1)
      this.$refs['addCourseForm'].validate(async valid => {
        if (valid) {
          if (this.addCourseForm.classType == '3') {//业务序列
            this.deptId = ''
            if (this.positionType == '') {
              this.$message.error("请选择职位课程！");
              return
            }
          } else if (this.addCourseForm.classType == '4') {//职能序列
            this.positionType = '-1'
            if (this.deptId == '') {
              this.$message.error("请选择所属部门！");
              return
            }
          } else {
            this.deptId = ''
            this.positionType = '-1'
          }
          if (this.courseUrl == '') {
            this.$message.error("请上传封面图！");
            return
          }
          this.videoCode = this.$refs.fileUploader1.location
          console.log(this.videoCode)
          if (!this.videoCode) {
            this.$message.error("请上传视频！");
            return
          }
          if (this.fileCode != '') {
            this.addCourseForm.courseWare = this.fileCode
            this.addCourseForm.courseWareInitName = this.courseFileName
          } else {
            this.addCourseForm.courseWare = ''
            this.addCourseForm.courseWareInitName = ''
          }
          // if (this.videoCode == '' || this.fileCode == '') {
          //   this.$message.error("请上传视频和课件!");
          //   return
          // }
          this.addCourseForm.classPic = this.courseUrl.split('=')[2]
          this.addCourseForm.classVedio = this.videoCode
          // this.addCourseForm.courseWare = this.fileCode
          this.addCourseForm.positionType = this.positionType
          this.addCourseForm.deptId = this.deptId
          this.addCourseForm.classVideoInitName = this.$refs.fileUploader1.videoName
          // this.addCourseForm.courseWareInitName = this.courseFileName
          console.log(this.addCourseForm)
          // this.reset('addCourseForm')
          POST(process.env.VUE_APP_DOMAIN_personnel + '/trainClassAdd', this.addCourseForm).then(res => {
            this.courseDataSearch('1')
            this.$message.success("新增课程成功!");
            this.closeAddCourse()
          }).catch(error => {
            console.log(error)
          })
        }
      })

      // this.addCourseModal = false
    },
    kk(formName) {
      console.log(this[formName].classType)
      if (formName == 'addCourseForm') {
        if (this[formName].classType == '3') {
          this.displayType = 'business'
          if (this.positionType == '-1') {
            this.positionType = ''
          }
        } else if (this[formName].classType == '4') {
          this.displayType = 'function'
        } else {
          this.displayType = 'null'
        }
      } else {
        if (this[formName].classType == '3') {
          this.displayType = 'business'
          if (this.positionTypeU == '-1') {
            this.positionTypeU = ''
          }
        } else if (this[formName].classType == '4') {
          this.displayType = 'function'
        } else {
          this.displayType = 'null'
        }
      }

    },
    handleSuccessVideo(res, file, fileList) { //上传文件接口调取成功回调
      if (res.code == 0) {//文件上传成功
        this.video_loading.close()
        console.log('上传数据成功', res)
        console.log('上传数据成功', file)
        this.courseVideoName = file.name
        console.log('上传数据成功', fileList)
        this.$message.success("上传数据文件成功!");
        this.videoCode = res.data
      } else {//文件上传失败失败
        console.log('上传数据失败', res)
      }
    },
    beforeUploadVideo(file) {
      //上传文件之前的钩子
      console.log("上传文件之前的回调", file);
      let testFileType = (file.name.substring(file.name.lastIndexOf('.') + 1)).toLowerCase() //截取文件后缀
      console.log(testFileType)
      const extension1 = testFileType === 'mp4'
      const extension2 = testFileType === 'rmvb'
      const extension3 = testFileType === 'avi'
      if (!extension1 && !extension2 && !extension3) {
        this.$message.error("上传数据文件只能是 mp4/rmvb/avi 格式!");
      } else {
        this.video_loading = this.$loading({//上报数据，锁定页面loading
          lock: true,
          text: '正在上传数据，请稍等片刻',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
      }
      return extension1 || extension2 || extension3
    },
    handleSuccessFile(res, file, fileList) { //上传文件接口调取成功回调
      if (res.status == 200) {//文件上传成功
        console.log('上传数据成功', res)
        this.courseFileName = file.name

        this.$message.success("上传数据文件成功!");
        this.fileCode = res.data
      } else {//文件上传失败失败
        console.log('上传数据失败', res)
      }
    },
    beforeUploadFile(file) {
      //上传文件之前的钩子
      console.log("上传文件之前的回调", file);
      let testFileType = (file.name.substring(file.name.lastIndexOf('.') + 1)).toLowerCase() //截取文件后缀
      console.log(testFileType)
      const extension1 = testFileType === 'docx'
      const extension2 = testFileType === 'pptx'
      const extension3 = testFileType === 'txt'
      const extension4 = testFileType === 'zip'
      const extension5 = testFileType === '7z'
      const extension6 = testFileType === 'pdf'
      if (!extension1 && !extension2 && !extension3 && !extension4 && !extension5 && !extension6) {
        this.$message.error("上传数据文件只能是 docx/pptx/txt/pdf/zip/7z 格式!");
      }
      return extension1 || extension2 || extension3 || extension4 || extension5 || extension6
    },
    handleError(err, file, fileList) {
      this.$notify.error({
        title: "温馨提示",
        message: err
      })
    },
    // 修改课程222
    changVName(v, l) {
      this.courseVideoName = v
      this.videoCode = l
    },
    updateCourse(id) {
      console.log(id)
      GET(process.env.VUE_APP_DOMAIN_personnel + '/commonTrainCourseDetails', { id: id }).then(res => {
        // res.data.trainClass
        this.updateCourseForm.className = res.data.trainClass.className
        this.updateCourseForm.classIntroduction = res.data.trainClass.classIntroduction
        this.updateCourseForm.classType = res.data.trainClass.classType + ''
        this.updateCourseForm.classTeach = res.data.trainClass.classTeach
        this.updateCourseForm.classTime = res.data.trainClass.classTime
        this.updateCourseForm.id = res.data.trainClass.id
        this.positionTypeU = res.data.trainClass.positionType + ''
        this.deptIdU = res.data.trainClass.deptId
        if (this.deptIdU == '' && this.positionTypeU == '-1') {
          this.displayType = 'null'
        } else if (this.deptIdU != '') {
          this.displayType = 'function'
        } else {
          this.displayType = 'business'
        }
        this.courseUrl = process.env.VUE_APP_DOMAIN_download + '/oss/download?view=true&key=' + res.data.trainClass.classPic
        this.courseVideoName = res.data.trainClass.classVideoInitName
        this.courseFileName = res.data.trainClass.courseWareInitName
        this.videoCode = res.data.trainClass.classVedio
        this.fileCode = res.data.trainClass.courseWare
        this.updateCourseModal = true
      }).catch(error => {
        console.log(error)
      })
    },
    updateCourse_save() {
      this.$refs['updateCourseForm'].validate(async valid => {
        if (valid) {
          if (this.updateCourseForm.classType == '3') {//业务序列
            this.deptIdU = ''
            if (this.positionTypeU == '' || this.positionTypeU == null) {
              this.$message.error("请选择职位课程！");
              return
            }
          } else if (this.updateCourseForm.classType == '4') {//职能序列
            this.positionTypeU = '-1'
            if (this.deptIdU == '' || this.deptIdU == null) {
              this.$message.error("请选择所属部门！");
              return
            }
          } else {
            this.deptIdU = ''
            this.positionTypeU = '-1'
          }
          if (this.courseUrl == '') {
            this.$message.error("请上传封面图！");
            return
          }
          console.log(this.fileCode)
          console.log(this.courseFileName)
          if (this.fileCode != '') {
            this.updateCourseForm.courseWare = this.fileCode
            this.updateCourseForm.courseWareInitName = this.courseFileName
          } else {
            this.updateCourseForm.courseWare = ''
            this.updateCourseForm.courseWareInitName = ''
          }
          this.updateCourseForm.classPic = this.courseUrl.split('=')[2]
          this.updateCourseForm.classVedio = this.videoCode
          // this.updateCourseForm.courseWare = this.fileCode
          this.updateCourseForm.positionType = this.positionTypeU
          this.updateCourseForm.deptId = this.deptIdU
          this.updateCourseForm.classVideoInitName = this.courseVideoName
          // this.updateCourseForm.courseWareInitName = this.courseFileName
          console.log(this.updateCourseForm)
          POST(process.env.VUE_APP_DOMAIN_personnel + '/trainClassUpdate', this.updateCourseForm).then(() => {
            this.courseDataSearch('x')
            this.$message.success("修改成功!");
            this.closeUpdateCourse()
          }).catch(error => {
            console.log(error)
          })
        }
      })

    },
    deleteCourse(id) {
      this.$msgBox.confirm('你确定要删除该课程吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DELETE(process.env.VUE_APP_DOMAIN_personnel + '/trainClassDeletes', { ids: id }).then(() => { //单条数据删除
          this.$message.success("删除成功!");
          this.courseDataSearch('1')
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
    // 讲师管理333
    teacherHandleSizeChange(val) {
      this.teacherSize = val;
      this.teacherDataSearch('x')
    },
    teacherHandlecurrentChange(val) {
      this.teacherCurrent = val;
      this.teacherDataSearch('x')
    },
    closeAddTeach() {
      this.addTeacherModal = false
      this.reset('addTeacherForm')
      this.teachUrl = ''
    },
    closeUpdateTeach() {
      this.updateTeacherModal = false
      this.reset('updateTeacherForm')
      this.teachUrl = ''
    },
    remoteMethod_search2(query) {
      if (query !== '') {
        this.loading_search = true
        GET(process.env.VUE_APP_DOMAIN_personnel + '/queryEmployeesByNameOrPhoneNuber', { "searchWord": query }).then(res => {
          this.loading_search = false
          this.employeeOptions = res.data
          // console.log(this.options)
        });
      } else {
        this.teacherOptions = [];
      }
    },
    teacherDataSearch(flag) {
      let searchObj = {
        "current": this.teacherCurrent, //当前页码
        "size": this.teacherSize, //每页显示记录条数
        "teachName": this.teacherSearch.teacherName
      }
      if (flag == '1') {
        searchObj.current = 1
      }
      console.log('搜索对象', searchObj)
      this.loading = true //开启动画
      POST(process.env.VUE_APP_DOMAIN_personnel + '/trainTeachers', searchObj).then(res => {
        this.loading = false //关闭动画
        let arrData = res.data.records
        for (var i = 0; i < arrData.length; i++) {
          arrData[i].teachUrl = process.env.VUE_APP_DOMAIN_download + '/oss/download?view=true&key=' + arrData[i].teachPic
        }
        this.teacherData = arrData
        console.log(this.teacherData)
        this.teacherCurrent = res.data.current
        this.teacherSize = res.data.size
        this.teacherTotal = res.data.total
      }).catch(error => {
        this.loading = false //关闭动画
        console.log(error)
      })
    },
    addTeacher_save() {
      this.$refs['addTeacherForm'].validate(async valid => {
        if (valid) {
          console.log(this.addTeacherForm.checked)

          if (this.addTeacherForm.checked === false) {
            this.addTeacherForm.isElite = 0
          } else {
            this.addTeacherForm.isElite = 1
          }
          if (this.teachUrl == '') {
            this.$message.error("请上传讲师头像!");
            return
          }
          this.addTeacherForm.teachPic = this.teachUrl.split('=')[2]
          console.log(this.addTeacherForm)
          POST(process.env.VUE_APP_DOMAIN_personnel + '/trainTeacherAdd', this.addTeacherForm).then(() => {
            this.$message.success("新增成功！");
            this.teacherDataSearch('1')
            this.closeAddTeach()
            this.teacherOption()
          }).catch(error => {
            console.log(error)
          })
        }
      })
    },
    updateTeacher(data) {
      console.log(data)
      // GET(process.env.VUE_APP_DOMAIN_personnel + '/queryEmployeesByNameOrPhoneNuber', { "searchWord": data.teachName }).then(res => {
      //   this.employeeOptions = res.data
      // });
      this.updateTeacherForm.id = data.id
      this.updateTeacherForm.isElite = data.isElite
      this.updateTeacherForm.teachDesc = data.teachDesc
      this.updateTeacherForm.teachName = data.teachName
      this.teachUrl = data.teachUrl
      if (data.isElite === 0) {
        this.updateTeacherForm.checked = false
      } else {
        this.updateTeacherForm.checked = true
      }
      this.updateTeacherModal = true
    },
    updateTeacher_save() {
      this.$refs['updateTeacherForm'].validate(async valid => {
        if (valid) {
          if (this.updateTeacherForm.checked === false) {
            this.updateTeacherForm.isElite = 0
          } else {
            this.updateTeacherForm.isElite = 1
          }
          this.updateTeacherForm.teachPic = this.teachUrl.split('=')[2]
          console.log(this.updateTeacherForm)
          delete this.updateTeacherForm.teachName
          PUT(process.env.VUE_APP_DOMAIN_personnel + '/trainTeacherUpdate', this.updateTeacherForm).then(res => {
            this.$message.success("修改成功！");
            this.teacherDataSearch('x')
            this.closeUpdateTeach()
          }).catch(error => {
            console.log(error)
          })
        }
      })
    },
    deleteTeacher(id) {
      this.$msgBox.confirm('你确定要删除该讲师吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DELETE(process.env.VUE_APP_DOMAIN_personnel + '/trainTeacherDeletes', { ids: id }).then(() => { //单条数据删除
          this.$message.success("删除成功！");
          this.teacherDataSearch('1')
          this.teacherOption()
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
    // 广告位管理444
    adsHandleSizeChange(val) {
      this.adsSize = val;
      this.adsDataSearch()
    },
    adsHandlecurrentChange(val) {
      this.adsCurrent = val;
      this.adsDataSearch()
    },
    closeAddAds() {
      this.addAdsModal = false
      this.reset('addAdsForm')
      this.adsUrl = ''
    },
    closeUpdateAds() {
      this.updateAdsModal = false
      this.reset('updateAdsForm')
      this.adsUrl = ''
    },
    adsDataSearch() {
      let searchObj = {
        "current": this.adsCurrent, //当前页码
        "size": this.adsSize //每页显示记录条数
      }
      console.log('搜索对象', searchObj)
      this.loading = true //开启动画
      POST(process.env.VUE_APP_DOMAIN_personnel + '/adventManageInfos', searchObj).then(res => {
        this.loading = false //关闭动画
        let arrData = res.data.records
        for (var i = 0; i < arrData.length; i++) {
          arrData[i].adsPic = process.env.VUE_APP_DOMAIN_download + '/oss/download?view=true&key=' + arrData[i].adPic
        }
        this.adsData = arrData
        console.log(this.adsData)
        this.adsCurrent = res.data.current
        this.adsSize = res.data.size
        this.adsTotal = res.data.total
      }).catch(error => {
        this.loading = false //关闭动画
        console.log(error)
      })
    },
    addAds_save() {
      this.$refs['addAdsForm'].validate(async valid => {
        if (valid) {
          if (this.adsUrl == '') {
            this.$message.error("请上传广告图！");
            return
          }
          this.addAdsForm.adPic = this.adsUrl.split('=')[2]
          console.log(this.addAdsForm)
          POST(process.env.VUE_APP_DOMAIN_personnel + '/adventManageInfo', this.addAdsForm).then(res => {
            this.$message.success("新增成功！");
            this.adsDataSearch()
            this.closeAddAds()
          }).catch(error => {
            console.log(error)
          })
          this.addAdsModal = false
        }
      })
    },
    updateAds(id) {
      GET(process.env.VUE_APP_DOMAIN_personnel + '/adventManageInfo', { id: id }).then(res => {
        this.updateAdsModal = true
        this.updateAdsForm = res.data
        this.adsUrl = process.env.VUE_APP_DOMAIN_download + '/oss/download?view=true&key=' + res.data.adPic

      }).catch(error => {
        console.log(error)
      })
    },
    updateAds_save() {
      this.$refs['updateAdsForm'].validate(async valid => {
        if (valid) {
          let updateObj = {
            "adName": this.updateAdsForm.adName,
            "adUrl": this.updateAdsForm.adUrl,
            "id": this.updateAdsForm.id
          }
          updateObj.adPic = this.adsUrl.split('=')[2]
          console.log(updateObj)
          PUT(process.env.VUE_APP_DOMAIN_personnel + '/adventManageInfo', updateObj).then(res => {
            this.$message.success("修改成功！");
            this.adsDataSearch()
            this.closeUpdateAds()
          }).catch(error => {
            console.log(error)
          })
        }
      })
    },
    deleteAds(id) {
      this.$msgBox.confirm('你确定要删除该广告位吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DELETE(process.env.VUE_APP_DOMAIN_personnel + '/adventManageInfos', { ids: id }).then(() => { //单条数据删除
          this.$message.success("删除成功!");
          this.adsDataSearch()
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
    handleSuccessAds(res, file, fileList) { //上传文件接口调取成功回调
      if (res.status == 200) {//文件上传成功
        console.log('上传数据成功', res)
        this.$message.success("上传数据文件成功!");
        if (this.activeName == 'second') {
          this.courseUrl = process.env.VUE_APP_DOMAIN_download + '/oss/download?view=true&key=' + res.data
        } else if (this.activeName == 'third') {
          this.teachUrl = process.env.VUE_APP_DOMAIN_download + '/oss/download?view=true&key=' + res.data
        } else if (this.activeName == 'four') {
          this.adsUrl = process.env.VUE_APP_DOMAIN_download + '/oss/download?view=true&key=' + res.data
        } else if (this.activeName == 'five') {
          this.casesUrl = process.env.VUE_APP_DOMAIN_download + '/oss/download?view=true&key=' + res.data
        }
      } else {//文件上传失败失败
        console.log('上传数据失败', res)
      }
    },
    beforeUploadPicAds(file) {
      //上传文件之前的钩子
      console.log("上传文件之前的回调", file);
      let testFileType = (file.name.substring(file.name.lastIndexOf('.') + 1)).toLowerCase() //截取文件后缀
      console.log(testFileType)
      const extension1 = testFileType === 'png'
      const extension2 = testFileType === 'jpeg'
      const extension3 = testFileType === 'jpg'
      var isLt
      if (this.activeName == 'third' || this.activeName == 'second') {
        isLt = file.size / 1024 < 101;
        if (!isLt) {
          this.$message.error("上传数据文件大小不大于100KB!");
        }
      } else if (this.activeName == 'four') {
        isLt = file.size / 1024 < 1001;
        if (!isLt) {
          this.$message.error("上传数据文件大小不大于1000KB!");
        }
      } else if (this.activeName == 'five') {
        isLt = file.size / 1024 < 51;
        if (!isLt) {
          this.$message.error("上传数据文件大小不大于50KB!");
        }
      }
      if (!extension1 && !extension2 && !extension3) {
        this.$message.error("上传数据文件只能是 jpeg/jpg/png 格式!");
      }
      return (extension1 || extension2 || extension3) && isLt
    },
    // 案例管理555
    closeAddCase() {
      this.addCaseModal = false
      this.reset('addCaseForm')
      this.casesUrl = ''
      this.$refs.mdifyEditor.editor.txt.html('')

      // this.getEditorContent = ''
    },
    closeUpdateCase() {
      this.updateCaseModal = false
      this.reset('updateCaseForm')
      this.casesUrl = ''
      this.getEditorContent = ''
    },
    caseDataSearch() {
      let searchObj = {
        "current": this.caseCurrent, //当前页码
        "size": this.caseSize //每页显示记录条数
      }
      console.log('搜索对象', searchObj)
      this.loading = true //开启动画
      POST(process.env.VUE_APP_DOMAIN_personnel + '/trainCases', searchObj).then(res => {
        this.loading = false //关闭动画
        let arrData = res.data.records
        for (var i = 0; i < arrData.length; i++) {
          arrData[i].casesPic = process.env.VUE_APP_DOMAIN_download + '/oss/download?view=true&key=' + arrData[i].casePic
        }
        this.caseData = arrData
        console.log(this.caseData)
        this.caseCurrent = res.data.current
        this.caseSize = res.data.size
        this.caseTotal = res.data.total
      }).catch(error => {
        this.loading = false //关闭动画
        console.log(error)
      })
    },
    caseHandleSizeChange(val) {
      this.caseSize = val;
      this.caseDataSearch()
    },
    caseHandlecurrentChange(val) {
      this.caseCurrent = val;
      this.caseDataSearch()
    },
    addCase_save() {
      this.$refs['addCaseForm'].validate(async valid => {
        if (valid) {
          if (this.casesUrl == '') {
            this.$message.error("请上传案例封面！");
            return
          }
          if (this.getEditorContent == '' || this.getEditorContent == '<p><br></p>') {
            this.$message.error("请编辑案例详情！");
            return
          }
          this.addCaseForm.casePic = this.casesUrl.split('=')[2]
          this.addCaseForm.caseContent = this.getEditorContent
          POST(process.env.VUE_APP_DOMAIN_personnel + '/trainCaseAdd', this.addCaseForm).then(() => {
            this.$message.success("新增案例成功!");
            this.caseDataSearch()
            this.closeAddCase()
          }).catch(error => {
            console.log(error)
          })
          this.addCaseModal = false
        }
      })
    },
    updateCase(id) {
      GET(process.env.VUE_APP_DOMAIN_personnel + '/trainCaseInfo', { id: id }).then(res => {
        this.updateCaseModal = true
        this.updateCaseForm = res.data
        //模拟请求后端初始化富文本的值999
        // this.$refs.mdifyEditor.editor.txt.html(res.data.caseContent)
        this.$nextTick(function () {
          this.$refs.mdifyEditor.editor.txt.html(res.data.caseContent)
          // this.setEditorHandler(res.data.caseContent)
        })
        this.casesUrl = process.env.VUE_APP_DOMAIN_download + '/oss/download?view=true&key=' + res.data.casePic
      }).catch(error => {
        console.log(error)
      })
    },
    updateCase_save() {
      this.$refs['updateCaseForm'].validate(async valid => {
        if (valid) {
          let updateObj = {
            "caseAuthor": this.updateCaseForm.caseAuthor,
            "caseName": this.updateCaseForm.caseName,
            "caseSource": this.updateCaseForm.caseSource,
            "caseDesc": this.updateCaseForm.caseDesc,
            "id": this.updateCaseForm.id
          }
          // if (this.getEditorContent == '<p><br></p>') {
          //   this.$message.error("请编辑案例详情！");
          //   return
          // }
          if (this.getEditorContent == '<p><br></p>') {
            this.$message.error("请编辑案例详情！");
            return
          }
          if (this.getEditorContent == '') {
            this.getEditorContent = this.setEditorContent
          }
          console.log(this.getEditorContent)

          updateObj.casePic = this.casesUrl.split('=')[2]
          updateObj.caseContent = this.getEditorContent
          console.log(updateObj)
          PUT(process.env.VUE_APP_DOMAIN_personnel + '/trainCaseUpdate', updateObj).then(res => {
            this.$message.success("修改成功！");
            this.caseDataSearch()
            this.closeUpdateCase()
          }).catch(error => {
            console.log(error)
          })
        }
      })
    },
    deleteCase(id) {
      this.$msgBox.confirm('你确定要删除该案例吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DELETE(process.env.VUE_APP_DOMAIN_personnel + '/trainCaseDeletes', { ids: id }).then(() => { //单条数据删除
          this.$message.success("删除成功！");
          this.caseDataSearch()
        }).catch(error => {
          console.log(error)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除！'
        })
      })
    },
  }
}
</script>
<style lang="less" scoped>
.mb18 {
  margin-bottom: 19px;
}
// 课程管理
.course_img {
  height: 32px;
  margin-bottom: 18px;
}
.course_img p {
  font-size: 10px;
  color: #99a0b1;
  margin: 4px 0;
}
.img_box {
  background-color: #e2e5ef;
  margin-bottom: 18px;
}
.adsPic {
  width: 100%;
  height: 100%;
}
</style>
