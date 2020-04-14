<template>
  <div class="comope_personnel">
    <div class="pull-left">
      <el-form :inline="true" class="mar-no" label-position="right">
        <el-form-item label="统计年月">
          <el-date-picker
            v-model="batch"
            :editable="false"
            :clearable="false"
            type="month"
            value-format="yyyy-MM"
            class="width110"
            placeholder="选择年月"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="数据源" v-if="permissions(permissionsMapObj['查询-数据源'])">
          <el-select
            placeholder="请选择数据源"
            v-model="source"
            style="width:350px"
            filterable
            @change="changeTable"
          >
            <el-option
              v-for="item in sourceDataOption"
              :key="item.id"
              :label="item.categoryTypeName+'：'+item.categoryAlias"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="JS_search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="pull-right">
      <el-dropdown trigger="click" @command="handleCommand">
        <el-button type="primary">
          更多操作
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            command="a"
            class="cloud-uploadBtn"
            v-if="permissions(permissionsMapObj['操作-导入'])"
          >
            <i></i>&nbsp;导入
          </el-dropdown-item>
          <el-dropdown-item
            command="b"
            class="cloud-uploadBtn"
            divided
            v-if="permissions(permissionsMapObj['操作-导出'])"
          >
            <i></i>&nbsp;导出
          </el-dropdown-item>
          <el-dropdown-item command="c" divided v-if="permissions(permissionsMapObj['操作-批量删除'])">
            <i class="el-icon-delete"></i>批量删除
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="table_wrap">
      <!-- 第一类 -->
      <el-table
        v-if="source === 14"
        key="tb_1"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        :height="dataListObj.dataInfo.t_height"
        :data="comopePersonnelTbData"
        border
        style="width:100%"
        :header-cell-style="{backgroundColor:'#e5e9f3'}"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序号" width="55"></el-table-column>
        <el-table-column prop="batch" label="统计年月" min-width="80"></el-table-column>
        <el-table-column label="全月在职" header-align="center">
          <el-table-column prop="monthFunctionalPeriod" label="职能（试用期）" min-width="150"></el-table-column>
          <el-table-column prop="monthFunctionalRegular" label="职能（正式员工）" min-width="150"></el-table-column>
          <el-table-column prop="monthBusinessPeriod" label="业务（试用期）" min-width="150"></el-table-column>
          <el-table-column prop="monthBusinessRegular" label="业务（正式员工）" min-width="150"></el-table-column>
        </el-table-column>
        <el-table-column label="期末在职" header-align="center">
          <el-table-column prop="yearFunctionalPeriod" label="职能（试用期）" min-width="150"></el-table-column>
          <el-table-column prop="yearFunctionalRegular" label="职能（正式员工）" min-width="150"></el-table-column>
          <el-table-column prop="yearBusinessPeriod" label="业务（试用期）" min-width="150"></el-table-column>
          <el-table-column prop="yearBusinessRegular" label="业务（正式员工）" min-width="150"></el-table-column>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="150"></el-table-column>
        <el-table-column label="操作人" min-width="150">
          <template slot-scope="scope">
            <el-popover
              v-if="scope.row.updateUserName||scope.row.createUserName"
              trigger="click"
              placement="top"
              @show="getUserInfo(scope.row.updateUserId||scope.row.createUserId)"
              width="450"
            >
              <!-- S -->
              <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
              <!-- E -->
              <div slot="reference" class="name-wrapper">
                <el-button size="mini">{{scope.row.updateUserName||scope.row.createUserName}}</el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作时间" show-overflow-tooltip min-width="160">
          <template slot-scope="scope">{{scope.row.updateTime||scope.row.createTime}}</template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" min-width="100" v-if="permissions(permissionsMapObj['操作-删除'])">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.id"
              type="text"
              size="small"
              @click="deleteThis(scope.row.id)"
              class="deleteTxt"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 第二类 -->
      <el-table
        v-if="source === 15"
        key="tb_2"
        :height="dataListObj.dataInfo.t_height"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        :data="comopePersonnelTbData"
        border
        style="width:100%"
        :header-cell-style="{backgroundColor:'#e5e9f3'}"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序号" width="55"></el-table-column>
        <el-table-column prop="batch" label="统计年月" min-width="80"></el-table-column>
        <el-table-column label="全月在职" header-align="center">
          <el-table-column label="职能" header-align="center">
            <el-table-column prop="monthItStaff" label="信息技术人员" min-width="150"></el-table-column>
            <el-table-column prop="monthInternalStaff" label="内部事务人员" min-width="150"></el-table-column>
            <el-table-column prop="monthForensicStaff" label="法律和合规人员" min-width="150"></el-table-column>
            <el-table-column prop="monthAdminStaff" label="管理和行政人员" min-width="150"></el-table-column>
          </el-table-column>
          <el-table-column prop="monthAdminSummary" label="职能合计" min-width="150"></el-table-column>
          <el-table-column label="业务" header-align="center">
            <el-table-column prop="monthBusinessManager" label="总经理" min-width="150"></el-table-column>
            <el-table-column prop="monthBusinessAssistManager" label="副总经理" min-width="150"></el-table-column>
            <el-table-column prop="monthBusinessMinister" label="部长" min-width="150"></el-table-column>
            <el-table-column prop="monthBusinessChargeman" label="组长" min-width="150"></el-table-column>
            <el-table-column prop="monthBusinessEmployee" label="组员" min-width="150"></el-table-column>
          </el-table-column>
          <el-table-column prop="monthBusinessSummary" label="业务合计" min-width="150"></el-table-column>
          <el-table-column prop="monthBusinessChangshaSummary" label="长沙地区" min-width="150"></el-table-column>
          <el-table-column prop="monthBusinessOtherAreaSummary" label="非长沙地区" min-width="150"></el-table-column>
        </el-table-column>
        <el-table-column label="期末在职" header-align="center">
          <el-table-column label="职能" header-align="center">
            <el-table-column prop="yearItStaff" label="信息技术人员" min-width="150"></el-table-column>
            <el-table-column prop="yearInternalStaff" label="内部事务人员" min-width="150"></el-table-column>
            <el-table-column prop="yearForensicStaff" label="法律和合规人员" min-width="150"></el-table-column>
            <el-table-column prop="yearAdminStaff" label="管理和行政人员" min-width="150"></el-table-column>
          </el-table-column>
          <el-table-column prop="yearAdminSummary" label="职能合计" min-width="150"></el-table-column>
          <el-table-column label="业务" header-align="center">
            <el-table-column prop="yearBusinessManager" label="总经理" min-width="150"></el-table-column>
            <el-table-column prop="yearBusinessAssistManager" label="副总经理" min-width="150"></el-table-column>
            <el-table-column prop="yearBusinessMinister" label="部长" min-width="150"></el-table-column>
            <el-table-column prop="yearBusinessChargeman" label="组长" min-width="150"></el-table-column>
            <el-table-column prop="yearBusinessEmployee" label="组员" min-width="150"></el-table-column>
          </el-table-column>
          <el-table-column prop="yearBusinessSummary" label="业务合计" min-width="150"></el-table-column>
          <el-table-column prop="yearBusinessChangshaSummary" label="长沙地区" min-width="150"></el-table-column>
          <el-table-column prop="yearBusinessOtherAreaSummary" label="非长沙地区" min-width="150"></el-table-column>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="150"></el-table-column>
        <el-table-column label="操作人" min-width="150">
          <template slot-scope="scope">
            <el-popover
              v-if="scope.row.updateUserName||scope.row.createUserName"
              trigger="click"
              placement="top"
              @show="getUserInfo(scope.row.updateUserId||scope.row.createUserId)"
              width="450"
            >
              <!-- S -->
              <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
              <!-- E -->
              <div slot="reference" class="name-wrapper">
                <el-button size="mini">{{scope.row.updateUserName||scope.row.createUserName}}</el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作时间" show-overflow-tooltip min-width="160">
          <template slot-scope="scope">{{scope.row.updateTime||scope.row.createTime}}</template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" min-width="100" v-if="permissions(permissionsMapObj['操作-删除'])">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.id"
              type="text"
              size="small"
              @click="deleteThis(scope.row.id)"
              class="deleteTxt"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 第三类 -->
      <el-table
        v-if="source === 16"
        key="tb_3"
        :height="dataListObj.dataInfo.t_height"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        :data="comopePersonnelTbData"
        border
        style="width:100%"
        :header-cell-style="{backgroundColor:'#e5e9f3'}"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序号" width="55"></el-table-column>
        <el-table-column prop="batch" label="统计年月" min-width="80"></el-table-column>
        <el-table-column prop="workArea" label="工作区域" min-width="80"></el-table-column>
        <el-table-column label="全月在职" header-align="center">
          <el-table-column label="业务" header-align="center">
            <el-table-column prop="monthManager" label="总经理" min-width="150"></el-table-column>
            <el-table-column prop="monthAssistManager" label="副总经理" min-width="150"></el-table-column>
            <el-table-column prop="monthMinister" label="部长" min-width="150"></el-table-column>
            <el-table-column prop="monthChargeman" label="组长" min-width="150"></el-table-column>
            <el-table-column prop="monthEmployee" label="组员" min-width="150"></el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column label="期末在职" header-align="center">
          <el-table-column label="业务" header-align="center">
            <el-table-column prop="yearManager" label="总经理" min-width="150"></el-table-column>
            <el-table-column prop="yearAssistManager" label="副总经理" min-width="150"></el-table-column>
            <el-table-column prop="yearMinister" label="部长" min-width="150"></el-table-column>
            <el-table-column prop="yearChargeman" label="组长" min-width="150"></el-table-column>
            <el-table-column prop="yearEmployee" label="组员" min-width="150"></el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="150"></el-table-column>
        <el-table-column label="操作人" min-width="150">
          <template slot-scope="scope">
            <el-popover
              v-if="scope.row.updateUserName||scope.row.createUserName"
              trigger="click"
              placement="top"
              @show="getUserInfo(scope.row.updateUserId||scope.row.createUserId)"
              width="450"
            >
              <!-- S -->
              <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
              <!-- E -->
              <div slot="reference" class="name-wrapper">
                <el-button size="mini">{{scope.row.updateUserName||scope.row.createUserName}}</el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作时间" show-overflow-tooltip min-width="160">
          <template slot-scope="scope">{{scope.row.updateTime||scope.row.createTime}}</template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" min-width="100" v-if="permissions(permissionsMapObj['操作-删除'])">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.id"
              type="text"
              size="small"
              @click="deleteThis(scope.row.id)"
              class="deleteTxt"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 第四类 -->
      <el-table
        v-if="source === 17"
        key="tb_4"
        :height="dataListObj.dataInfo.t_height"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        :data="comopePersonnelTbData"
        border
        style="width:100%"
        :header-cell-style="{backgroundColor:'#e5e9f3'}"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序号" width="55"></el-table-column>
        <el-table-column prop="batch" label="统计年月" min-width="80"></el-table-column>
        <el-table-column prop="employeeUnits" label="发放单位" min-width="80"></el-table-column>
        <el-table-column label="全月在职" header-align="center">
          <el-table-column prop="monthFunctional" label="职能" min-width="150"></el-table-column>
          <el-table-column label="业务" header-align="center">
            <el-table-column prop="monthManager" label="总经理" min-width="150"></el-table-column>
            <el-table-column prop="monthAssistManager" label="副总经理" min-width="150"></el-table-column>
            <el-table-column prop="monthMinister" label="部长" min-width="150"></el-table-column>
            <el-table-column prop="monthChargeman" label="组长" min-width="150"></el-table-column>
            <el-table-column prop="monthEmployee" label="组员" min-width="150"></el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column label="期末在职" header-align="center">
          <el-table-column prop="yearFunctional" label="职能" min-width="150"></el-table-column>
          <el-table-column label="业务" header-align="center">
            <el-table-column prop="yearManager" label="总经理" min-width="150"></el-table-column>
            <el-table-column prop="yearAssistManager" label="副总经理" min-width="150"></el-table-column>
            <el-table-column prop="yearMinister" label="部长" min-width="150"></el-table-column>
            <el-table-column prop="yearChargeman" label="组长" min-width="150"></el-table-column>
            <el-table-column prop="yearEmployee" label="组员" min-width="150"></el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="150"></el-table-column>
        <el-table-column label="操作人" min-width="150">
          <template slot-scope="scope">
            <el-popover
              v-if="scope.row.updateUserName||scope.row.createUserName"
              trigger="click"
              placement="top"
              @show="getUserInfo(scope.row.updateUserId||scope.row.createUserId)"
              width="450"
            >
              <!-- S -->
              <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
              <!-- E -->
              <div slot="reference" class="name-wrapper">
                <el-button size="mini">{{scope.row.updateUserName||scope.row.createUserName}}</el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作时间" show-overflow-tooltip min-width="160">
          <template slot-scope="scope">{{scope.row.updateTime||scope.row.createTime}}</template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" min-width="100" v-if="permissions(permissionsMapObj['操作-删除'])">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.id"
              type="text"
              size="small"
              @click="deleteThis(scope.row.id)"
              class="deleteTxt"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 第五类 -->
      <el-table
        v-if="source === 18"
        key="tb_5"
        :height="dataListObj.dataInfo.t_height"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        :data="comopePersonnelTbData"
        border
        style="width:100%"
        :header-cell-style="{backgroundColor:'#e5e9f3'}"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序号" width="55"></el-table-column>
        <el-table-column prop="batch" label="统计年月" min-width="80"></el-table-column>
        <el-table-column label="全月在职" header-align="center">
          <el-table-column prop="monthManager" label="总经理" min-width="150"></el-table-column>
          <el-table-column label="副总经理" header-align="center">
            <el-table-column prop="monthAssistManager" label="正式员工" min-width="150"></el-table-column>
            <el-table-column prop="monthRegionAssistManager" label="试用期员工" min-width="150"></el-table-column>
          </el-table-column>
          <el-table-column label="部长" header-align="center">
            <el-table-column prop="monthMinister" label="正式员工" min-width="150"></el-table-column>
            <el-table-column prop="monthRegionMinister" label="试用期员工" min-width="150"></el-table-column>
          </el-table-column>
          <el-table-column label="组长" header-align="center">
            <el-table-column prop="monthChargeman" label="正式员工" min-width="150"></el-table-column>
            <el-table-column prop="monthRegionChargeman" label="试用期员工" min-width="150"></el-table-column>
          </el-table-column>
          <el-table-column label="组员" header-align="center">
            <el-table-column prop="monthEmployee" label="正式员工" min-width="150"></el-table-column>
            <el-table-column prop="monthRegionEmployee" label="试用期员工" min-width="150"></el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column label="期末在职" header-align="center">
          <el-table-column prop="yearManager" label="总经理" min-width="150"></el-table-column>
          <el-table-column label="副总经理" header-align="center">
            <el-table-column prop="yearAssistManager" label="正式员工" min-width="150"></el-table-column>
            <el-table-column prop="yearRegionAssistManager" label="试用期员工" min-width="150"></el-table-column>
          </el-table-column>
          <el-table-column label="部长" header-align="center">
            <el-table-column prop="yearMinister" label="正式员工" min-width="150"></el-table-column>
            <el-table-column prop="yearRegionMinister" label="试用期员工" min-width="150"></el-table-column>
          </el-table-column>
          <el-table-column label="组长" header-align="center">
            <el-table-column prop="yearChargeman" label="正式员工" min-width="150"></el-table-column>
            <el-table-column prop="yearRegionChargeman" label="试用期员工" min-width="150"></el-table-column>
          </el-table-column>
          <el-table-column label="组员" header-align="center">
            <el-table-column prop="yearEmployee" label="正式员工" min-width="150"></el-table-column>
            <el-table-column prop="yearRegionEmployee" label="试用期员工" min-width="150"></el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="150"></el-table-column>
        <el-table-column label="操作人" min-width="150">
          <template slot-scope="scope">
            <el-popover
              v-if="scope.row.updateUserName||scope.row.createUserName"
              trigger="click"
              placement="top"
              @show="getUserInfo(scope.row.updateUserId||scope.row.createUserId)"
              width="450"
            >
              <!-- S -->
              <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
              <!-- E -->
              <div slot="reference" class="name-wrapper">
                <el-button size="mini">{{scope.row.updateUserName||scope.row.createUserName}}</el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作时间" show-overflow-tooltip min-width="160">
          <template slot-scope="scope">{{scope.row.updateTime||scope.row.createTime}}</template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" min-width="100" v-if="permissions(permissionsMapObj['操作-删除'])">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.id"
              type="text"
              size="small"
              @click="deleteThis(scope.row.id)"
              class="deleteTxt"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 第六类 -->
      <el-table
        v-if="source === 19"
        key="tb_6"
        :height="dataListObj.dataInfo.t_height"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        :data="comopePersonnelTbData"
        border
        style="width:100%"
        :header-cell-style="{backgroundColor:'#e5e9f3'}"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序号" min-width="50"></el-table-column>
        <el-table-column prop="batch" label="统计年月" min-width="80"></el-table-column>
        <el-table-column prop="businessName" label="业务类型" min-width="150"></el-table-column>
        <el-table-column prop="monthSummary" label="全月在职人数" min-width="150"></el-table-column>
        <el-table-column prop="yearSummary" label="期末人数" min-width="150"></el-table-column>
        <el-table-column prop="remark" label="备注" min-width="150"></el-table-column>
        <el-table-column label="操作人" min-width="150">
          <template slot-scope="scope">
            <el-popover
              v-if="scope.row.updateUserName||scope.row.createUserName"
              trigger="click"
              placement="top"
              @show="getUserInfo(scope.row.updateUserId||scope.row.createUserId)"
              width="450"
            >
              <!-- S -->
              <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
              <!-- E -->
              <div slot="reference" class="name-wrapper">
                <el-button size="mini">{{scope.row.updateUserName||scope.row.createUserName}}</el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作时间" show-overflow-tooltip min-width="160">
          <template slot-scope="scope">{{scope.row.updateTime||scope.row.createTime}}</template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" min-width="100" v-if="permissions(permissionsMapObj['操作-删除'])">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.id"
              type="text"
              size="small"
              @click="deleteThis(scope.row.id)"
              class="deleteTxt"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div id="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handlecurrentChange"
          background
          :current-page="configPageObj.current"
          :page-sizes="[10,15,20,30,40]"
          :page-size="configPageObj.size"
          layout="total,sizes,prev,pager,next,jumper"
          :total="configPageObj.total"
        ></el-pagination>
      </div>

      <!-- 导入业务类型弹框 -->
      <el-dialog
        title="导入业务类型"
        :close-on-click-modal="false"
        :show-close="false"
        :visible.sync="exportEx"
        width="580px"
      >
        <div>
          <el-form
            :model="exportExform"
            :rules="exportExformRule"
            ref="exportExform"
            label-width="100px"
          >
            <el-row>
              <el-col :md="24">
                <el-form-item label="统计月份" prop="month">
                  <el-date-picker
                    style="width:420px"
                    v-model="exportExform.month"
                    type="month"
                    :editable="false"
                    :clearable="false"
                    value-format="yyyy-MM"
                    placeholder="选择月"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :md="24">
                <el-form-item label="数据源">
                  <el-select
                    placeholder="请选择数据源"
                    v-model="exportExform.source"
                    style="width:420px"
                    filterable
                  >
                    <el-option
                      v-for="item in sourceDataOption"
                      :key="item.id"
                      :label="item.categoryTypeName+'：'+item.categoryAlias"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="24">
                <el-form-item label="选择文件">
                  <p class="clearfix" style="margin-top:6px;">
                    <el-upload
                      :multiple="false"
                      :limit="1"
                      class="pull-left"
                      ref="upload"
                      :data="{batch:exportExform.month,source:exportExform.source}"
                      :auto-upload="false"
                      :action="uploadActionUrl"
                      :headers="headers"
                      :before-remove="beforeRemove"
                      :before-upload="beforeUpload"
                      :on-change="changeUpload"
                      :on-success="handleSuccess"
                      :file-list="fileList"
                    >
                      <el-button slot="trigger" size="small" icon="el-icon-upload">选取文件</el-button>
                      <el-button
                        style="margin-left: 10px;"
                        size="small"
                        type="success"
                        @click="submitUpload('exportExform')"
                      >上传文件</el-button>
                      <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
                    </el-upload>
                  </p>
                </el-form-item>
              </el-col>
              <el-col :md="16">
                <div
                  style="padding-left:30px;line-height:30px;color:red;margin-top:10px;"
                >注：导入成功后，会立刻覆盖当前版本</div>
              </el-col>
              <el-col :md="8">
                <div class="fileBox" style="margin-top:10px;text-align:right;padding-right:10px">
                  <span class="filename excel">
                    <el-button type="text" class="underlineTxt" @click.stop="JS_download_model">下载模板</el-button>
                  </span>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer" style="padding-right: 18px;">
          <el-button type="primary" @click="fileClose('exportExform')">关闭</el-button>
        </span>
      </el-dialog>

      <!-- 导入进度条信息 -->
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

      <!-- 导出-->
      <el-dialog
        title="导出"
        :close-on-click-modal="false"
        :show-close="false"
        :visible.sync="deriveDialog"
        width="600px"
      >
        <div>
          <el-form
            label-width="85px"
            :model="deriveExform"
            :rules="deriveExformRule"
            ref="deriveExform"
          >
            <el-row>
              <el-col :md="10">
                <el-form-item label="统计年月" prop="batch">
                  <el-date-picker
                    v-model="deriveExform.batch"
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
                <el-form-item label="导出方式" prop="exportType">
                  <el-select
                    placeholder="请选择"
                    v-model="deriveExform.exportType"
                    style="width:240px"
                    filterable
                  >
                    <el-option
                      v-for="item in deriveTypeOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="24">
                <el-form-item label="数据源" prop="source">
                  <el-select
                    placeholder="请选择数据源"
                    style="width:473px"
                    v-model="deriveExform.source"
                    filterable
                  >
                    <el-option
                      v-for="item in sourceDataOption"
                      :key="item.id"
                      :label="item.categoryTypeName+'：'+item.categoryAlias"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="JS_exportCancel('deriveExform')">取消</el-button>
          <el-button type="primary" @click="JS_exportSave('deriveExform')">确定</el-button>
        </span>
      </el-dialog>

      <!-- 批量删除温馨提示弹框 -->
      <el-dialog
        title="温馨提示"
        :close-on-click-modal="false"
        :visible.sync="deleAllWarn"
        width="450px"
      >
        <el-row>
          <el-col :md="21" :offset="3" class="warnIcoBg">
            <h3>您正在进行删除操作，为了确定您的操作无误，请再次确定是否继续？</h3>
            <span style="color:red">注：删除后不可恢复！</span>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleAllWarn = false">取消</el-button>
          <el-button type="primary" @click="doAllDeleteSave">确定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Tools from "../../untils/index.js"
import { POST, GET, DELETE } from "http/custom.js"

export default {
  name: "comope_personnel",
  components: {},
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
    const uploadActionUrl = process.env.VUE_APP_DOMAIN_quote + "/importExcel" //导入action
    let yd = Tools.getPYd() //获取上个月 格式为 yyyy-MM
    return {
      personalInfoData: {}, //姓名popover弹窗数据
      //搜索条件相关
      batch: yd, //年月
      source: null, //选中的数据源id
      sourceDataOption: [], //数据源下拉option
      //table相关
      comopePersonnelTbData: [], //表格数据源数组
      loading: false, //table加载动画开关
      configPageObj: {
        size: 15, //每页显示记录条数
        current: 1, //当前页码
        total: 0 //总记录数据
      },
      //导入相关
      uploadActionUrl, // 导入url
      headers: {},
      exportEx: false,
      fileList: [], //上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
      exportExform: {
        month: "", //月份
        source: "" //数据源id
      },
      exportExformRule: {
        month: [{ required: true, message: "请选择月份", trigger: "change" }]
      },
      downLoadfileCodeArr: {
        //下载模板映射数组
        14: "QUOTE_PERSONAL_EMPTYPE_TEMPLATE",
        15: "QUOTE_PERSONAL_OPERATION_TEMPLATE",
        16: "QUOTE_PERSONAL_EMPAREA_TEMPLATE",
        17: "QUOTE_PERSONAL_EMPUNITS_TEMPLATE",
        18: "QUOTE_PERSONAL_EMPTYPEANDLEVEL_TEMPLATE",
        19: "QUOTE_PERSONAL_EMPTYPE_SUMMARY_TEMPLATE"
      },
      unloadErrorLinkNameArr: {
        14: "第一类：职能业务按正式与试用分类",
        15: "第二类：运营数据人数统计",
        16: "第三类：催收人员按工作区域分类",
        17: "第四类：按发放单位分类",
        18: "第五类：催收人员各级别区分试用与正式员工分类",
        19: "第六类：按业务类型分类统计人数"
      },
      //进度条相关参数
      importProcessInfoDialog: false, //取消进度条框
      importError: false, // 导入错误时呈现的进度
      downloadErrorEveProcess: false, //获取错误下载key
      loadErrorExcel: false, //呈现失败下载明细
      downloadErrorKey: "", //导入错误下载excel key
      progressPercentAge: 0,
      progressBackBtn: false, //返回按钮
      uploadProcessInfo: {
        total: "", //总条数
        handler: "", //已处理条数
        successful: "", //处理成功条数
        failures: "", //处理失败条数
        finish: false, //是否处理完成
        dealAllTime: "" //总耗时
      },
      //导出相关
      deriveDialog: false, //导出弹窗
      deriveExform: {
        batch: yd, //月份
        exportType: 1, //导出方式
        source: "" //数据源id
      },
      deriveExformRule: {
        batch: [{ required: true, message: "请选择月份", trigger: "change" }],
        exportType: [{ required: true, message: "请选择导出方式", trigger: "change" }],
        source: [{ required: true, message: "请选择数据源", trigger: "change" }]
      },
      deriveTypeOption: [
        //导出方式
        { value: 1, label: "保存至本地（需要等待数秒至数分钟）" },
        { value: 2, label: "发送至本人内网邮箱" }
      ],
      //批量删除
      deleAllWarn: false, //批量删除
      multipleSelection: [], //已选择行数组
      exportType: [
        //导出方式
        { value: 0, label: "保存至本地（需要等待数秒至数分钟）" },
        { value: 1, label: "发送至本人内网邮箱" }
      ],
      dataList: [
        {
          //数据源
          value: "选项1",
          label: "第一类（职能业务按正式与试用分类）",
          checked: true
        },
        {
          value: "选项2",
          label: "第二类（运营数据人数统计）",
          checked: false
        },
        {
          value: "选项3",
          label: "第三类（催收人员按工作区域分类）",
          checked: false
        },
        {
          value: "选项4",
          label: "第四类（按发放单位分类）",
          checked: false
        },
        {
          value: "选项5",
          label: "第五类（催收人员各级别区分试用与正式员工分类）",
          checked: false
        },
        {
          value: "选项6",
          label: "第六类（按业务类型分类统计人数）",
          checked: false
        }
      ],
      businessList: [
        {
          //业务类型
          value: "选项1",
          label: "平安普惠"
        },
        {
          value: "选项2",
          label: "平安正常"
        },
        {
          value: "选项3",
          label: "中信抢案"
        }
      ],
      permissionsMapObj: {
        //老系统action权限映射对象
        "操作-批量删除": "602f595d421745babfe6910b816725c8",
        "查询-数据源": "683b04530f8a4994986e4a01882d6762",
        "操作-删除": "7a833e8ae7fb4d979d1edcfd809c4ea8",
        "操作-导出": "a306bd9380c74a1fa36d1b5c50f9879f",
        "操作-导入": "d709238ff336450189bc9310f4bd7805"
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
    handleCommand(command) {
      //更多操作下拉框
      switch (command) {
        case "a":
          this.exportEx = true //导入
          break
        case "b":
          this.deriveDialog = true //导出
          this.deriveExform.source = this.source //默认导出数据源是搜索条件的数据源
          break
        case "c":
          this.deleteAll() //全部删除
          break
        default:
          console.log("default")
          return
      }
    },
    //导入相关
    beforeRemove(file) {
      //删除文件之前的钩子
      return this.$msgBox.confirm(`确定移除 ${file.name}?`)
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
      }
      return extension1 || extension2
    },
    changeUpload(file, fileList) {
      //文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
      console.log("change", file)
      console.log("fileList", fileList)
    },
    handleSuccess(res) {
      //上传文件接口调取成功回调
      this.exportEx = false
      if (res.code === 0) {
        //文件上传成功或者部分成功
        this.downloadErrorEveProcess = res.data //获取进度条事件句柄
        //错误导入进度条与下载模板
        this.importProcessInfoDialog = true
        this.queryProgress() //获取上传文件进度条信息
      } else {
        let msgError = res.msg || "【系统无法识别EXCLE中的空白，公式和非法字符。请先清理】。" //500非0情况
        this.$msgBox.alert(`<span style="color:red;">${msgError} </span>`, "温馨提示", {
          dangerouslyUseHTMLString: true
        })
      }
      this.$refs.upload.clearFiles() //清空已上传的文件列表（该方法不支持在 before-upload 中调用）
    },
    submitUpload(formName) {
      //上传文件
      console.log("上传文件", this.$refs.upload.uploadFiles.length)
      if (this.$refs.upload.uploadFiles.length == 0) {
        this.$message({
          showClose: true,
          type: "warning",
          message: "请选取文件！"
        })
        return
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$refs.upload.submit() //手动上传
        } else {
          this.$message({
            showClose: true,
            type: "warning",
            message: "文件或月份不能为空，验证不通过！"
          })
        }
      })
    },
    JS_download_model() {
      let sourceId = this.exportExform.source //导入数据源id
      let batch = this.exportExform.month //批次
      if (sourceId === 19 && batch === "") {
        this.$message({
          showClose: true,
          type: "warning",
          message: "请选择月份！"
        })
        return
      }
      if (sourceId === 19 && batch) {
        //第六类特殊处理
        window.location.href = `${process.env.VUE_APP_DOMAIN_quote}/exportExcel?batch=${batch}&exportModel=2&exportType=1&source=19&token=${localStorage.getItem("token")}`
        return
      }
      let fileCode = this.downLoadfileCodeArr[sourceId] //查找对应数据源下载模板fileCode
      //下载模板
      GET(process.env.VUE_APP_DOMAIN_personnel + "/queryBizFilesTemplate", {
        fileCode
      })
        .then(res => {
          //获取模板存储返回的ID
          window.location.href = process.env.VUE_APP_DOMAIN_download + "/oss/download?key=" + res.data.fileTemplateId + "&name=" + res.data.fileTemplateName + "." + res.data.fileTemplateSuffix
        })
        .catch(error => {
          console.log(error)
        })
    },
    fileClose(formName) {
      //清除表单
      this.exportEx = false
      this.$refs[formName].resetFields()
      this.$refs.upload.clearFiles() //清空已上传的文件列表（该方法不支持在 before-upload 中调用）
    },
    unloadErrorLink() {
      //导入错误模板下载
      console.log("downloadErrorKey", this.downloadErrorKey)
      let errorId = this.exportExform.source //获取导入下拉框选中的是哪一类数据源id
      let errorName = this.unloadErrorLinkNameArr[errorId] //根据id获取导入下拉框选中的是哪一类数据源name
      let url = process.env.VUE_APP_DOMAIN_download + "/oss/download?key=" + this.downloadErrorKey + "&token=" + localStorage.getItem("token") + "&name=" + encodeURI(errorName) + ".xlsx"
      window.location.href = url
    },
    queryProgress() {
      //上传进度条
      this.loadErrorExcel = false // 隐藏下载链接
      let progressAjax = window.setInterval(() => {
        GET(process.env.VUE_APP_DOMAIN_personnel + "/queryProgress", { progressKey: this.downloadErrorEveProcess })
          .then(res => {
            this.uploadProcessInfo = res.data //进度信息对象
            if (res.data.total) {
              this.progressPercentAge = parseInt((res.data.handler / res.data.total) * 100)
            }
            if (res.data.finish) {
              //已完成
              this.progressPercentAge = 100 //进度完成度
              let calc = res.data.endTime - res.data.beginTime
              let time = parseInt(calc / 1000) //计算完成时间
              this.uploadProcessInfo.dealAllTime = time >= 1 ? time + "秒" : calc + "毫秒"
              this.JS_search() //刷新页面

              setTimeout(() => {
                if (res.data.failures > 0) {
                  //表示有导入失败的，呈现可下载模板
                  this.downloadErrorKey = res.data.failFile //获取错误模板下载key
                  this.loadErrorExcel = true // 呈现下载链接
                }
                this.progressBackBtn = true //进度条完成后，呈现返回按钮
              }, progressAjax + 1000)
              window.clearInterval(progressAjax) //清除轮询
            }
          })
          .catch(error => {
            window.clearInterval(progressAjax) //清除轮询
            console.log(error)
          })
      }, 1000)
    },
    importProgress() {
      //进度弹框关闭
      this.importProcessInfoDialog = false //关闭进度弹框
      this.progressPercentAge = 0 //进度条清空为0
      this.progressBackBtn = false //隐藏返回按钮
      this.loadErrorExcel = false // 隐藏下载失败链接
    },
    //根据员工编号获取个人信息
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
    getSourceSelect() {
      //数据源select字典查询
      POST(process.env.VUE_APP_DOMAIN_quote + "/quotecategory/list", {
        categoryType: 2,
        parentId: 3
      })
        .then(res => {
          console.log("数据源下拉", res)
          this.sourceDataOption = res.data
          this.source = 14 //默认进入tab显示第一类的table
          this.exportExform.source = 14 //默认导入数据源显示第一类的
        })
        .catch(error => {
          console.log(error)
        })
    },
    //table分页相关
    search() {
      let searchObj = {
        //查询对象,在这里初始化,初始化值都是取this下面的
        batch: this.batch, //年月（批次号）
        source: this.source || 14, //数据源id
        current: this.configPageObj.current, //当前页码
        size: this.configPageObj.size //每页显示记录条数
      }
      console.log("搜索对象", searchObj)
      this.loading = true //开启动画
      POST(`${process.env.VUE_APP_DOMAIN_quote}/list`, searchObj)
        .then(res => {
          console.log("数据源dataTable", res)
          this.loading = false //关闭动画
          this.comopePersonnelTbData = res.data.records //set表格的值
          this.configPageObj.current = res.data.current //set当前页
          this.configPageObj.size = res.data.size //每页显示记录条数
          this.configPageObj.total = res.data.total //总记录条数
        })
        .catch(error => {
          console.log(error)
        })
    },
    changeTable() {
      //数据源下拉框改变切换table
      this.JS_search()
    },
    handlecurrentChange(val) {
      //点击页码，当前页
      this.configPageObj.current = val //保存状态-当前页
      this.search()
    },
    handleSizeChange(val) {
      //每页显示多少条数据切换
      this.configPageObj.size = val //保存状态-每页显示多少条数据切换
      this.search()
    },
    JS_search() {
      this.configPageObj.current = 1 //点击搜索current=1搜索第一页
      this.search()
    },
    //导出相关
    JS_exportCancel(formName) {
      //清除表单
      this.deriveDialog = false
      this.$refs[formName].resetFields()
    },
    JS_exportSave(formName) {
      //确认保存
      this.$refs[formName].validate(valid => {
        if (valid) {
          let saveObj = {
            batch: this.deriveExform.batch, //月份
            exportType: this.deriveExform.exportType, //导出方式
            source: this.deriveExform.source //数据源id
          }
          if (saveObj.exportType === 2) {
            //发送邮件
            this.$message({
              type: "success",
              message: "发送邮件成功!",
              showClose: true
            })
            GET(process.env.VUE_APP_DOMAIN_quote + "/exportExcel", {
              batch: saveObj.batch,
              exportType: saveObj.exportType,
              source: saveObj.source
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
            window.location.href = `${process.env.VUE_APP_DOMAIN_quote}/exportExcel?batch=${saveObj.batch}&exportType=${saveObj.exportType}&source=${saveObj.source}&token=${localStorage.getItem("token")}`
          }
          this.deriveDialog = false //关闭弹框
        } else {
          this.$message({
            showClose: true,
            type: "warning",
            message: "下载失败，验证不通过"
          })
        }
      })
    },
    //删除相关
    deleteThis(id) {
      //单个删除
      this.$msgBox
        .confirm("你确定要删除该条数据吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          DELETE(process.env.VUE_APP_DOMAIN_quote + "/delete", { ids: id, source: this.source })
            .then(() => {
              //单条数据删除
              this.$message({
                type: "success",
                message: "删除成功!"
              })
              this.JS_search() //刷新表格，重新获取数据
            })
            .catch(error => {
              console.log(error)
            })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          })
        })
    },
    //批量删除
    deleteAll() {
      //批量删除
      this.deleAllWarn = true
    },
    handleSelectionChange(val) {
      //当选择项发生变化时会触发该事件
      this.multipleSelection = val
      console.log("选中的行", val)
    },
    doAllDeleteSave() {
      //批量删除-保存
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: "warning",
          message: "请勾选要批量删除的数据!"
        })
        this.deleAllWarn = false //关闭弹框
      } else {
        let ids = []
        this.multipleSelection.forEach(element => {
          ids.push(element.id)
        })
        ids = ids.join(",") //转换成以逗号隔开的字符串
        DELETE(process.env.VUE_APP_DOMAIN_quote + "/delete", { ids: ids, source: this.source })
          .then(() => {
            //批量数据删除
            this.$message({
              type: "success",
              message: "批量删除成功!"
            })
            this.deleAllWarn = false //关闭弹框
            this.JS_search() //刷新表格，重新获取数据
          })
          .catch(error => {
            console.log(error)
          })
      }
    }
  },
  created() {
    this.headers["x-user-token"] = localStorage.getItem("token") //设置上传数据文件excel的token
    this.getSourceSelect() //数据源select字典查询
    this.search()
  }
}
</script>

