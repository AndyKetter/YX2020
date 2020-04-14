<template>
  <div class="comope_business">
    <div class="pull-left">
      <el-form :inline="true" class="mar-no" label-position="right">
        <el-form-item label="统计年月">
          <el-date-picker v-model="batch" :editable="false" :clearable="false" type="month" @change="changeBatch" value-format="yyyy-MM" class="width110" placeholder="选择年月"></el-date-picker>
        </el-form-item>
        <el-form-item label="数据源" v-if="isRoot(rootCode['查询-数据源'])">
          <el-select placeholder="请选择数据源" v-model="dataOrigin" class="width155" filterable @change="JS_search">
            <el-option v-for="item in dataList" :key="item.id" :label="item.categoryTypeName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务类型" v-if="isRoot(rootCode['查询-业务类型'])">
          <el-select placeholder="请选择业务类型" v-model="businessType" class="width155" filterable clearable>
            <el-option v-for="item in businessList" :key="item.id" :label="item.bizType" :value="item.id"></el-option>
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
          更多操作<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="a" class="cloud-downloadBtn">
            <i></i>&nbsp;导出
          </el-dropdown-item>
          <!-- 各部门查看、操作本部门的数据；市场客户服务部查看所有数据，只有导出操作权限； -->
          <el-dropdown-item command="b" class="cloud-uploadBtn" divided v-if="isRoot(rootCode['操作-导入']) && !isShowTable('数据汇总')">
            <i></i>&nbsp;导入
          </el-dropdown-item>
          <el-dropdown-item command="c" divided v-if="isRoot(rootCode['操作-批量删除']) && !isShowTable('数据汇总')"><i class="el-icon-delete"></i>批量删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button size="small" @click="sysCalcShow" type="danger" v-if="(isShowTable('数据汇总') && isRoot(rootCode['系统计算']))" style="margin-left:10px">系统计算</el-button>
    </div>
    <div class="table_wrap">
      <!-- 市场部 -->
      <el-table v-loading="loading" v-if="(isShowTable('市场') && isRoot(rootCode['查询-数据源-市场部']))" :key="1" @selection-change="handleSelectionChange" :height="dataListObj.dataInfo.t_height" :data="tableData" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序号" min-width="50"></el-table-column>
        <el-table-column prop="batch" label="统计年月" min-width="80"></el-table-column>
        <el-table-column prop="caseName" label="业务类型" min-width="150"></el-table-column>
        <el-table-column prop="clientBank" label="委托方（银行）" min-width="120"></el-table-column>
        <el-table-column prop="trusteeSupplier" label="受托方（供应商）" min-width="120"></el-table-column>
        <el-table-column prop="businessModel" label="业务模式" min-width="100"></el-table-column>
        <el-table-column prop="averageExceedTime" label="平均逾期时间" min-width="100"></el-table-column>
        <el-table-column prop="invoiceStatus" label="开票状态" min-width="100"></el-table-column>
        <el-table-column prop="averageCommissionRate" label="平均佣金率" min-width="100"></el-table-column>
        <el-table-column prop="returnedMoneyRate" label="回款率" min-width="100"></el-table-column>
        <el-table-column prop="entrustMoney" label="委托金额" min-width="100"></el-table-column>
        <el-table-column prop="householdNumber" label="新案口径对应户数" min-width="130"></el-table-column>
        <el-table-column prop="returnedMoney" label="回款金额" min-width="100"></el-table-column>
        <el-table-column prop="balanceCommission" label="结算佣金" min-width="100"></el-table-column>
        <el-table-column prop="commissionWithholdMoney" label="佣金扣款金额" min-width="100"></el-table-column>
        <el-table-column prop="encourageCommission" label="期满补足的激励佣金" min-width="150"></el-table-column>
        <el-table-column prop="remark" label="备注" min-width="150"></el-table-column>
        <el-table-column prop="leadingCadre" label="市场部负责人" min-width="150"></el-table-column>
        <el-table-column prop="createUserName" label="操作人" min-width="150">
          <template slot-scope="scope">
            <el-popover v-show="scope.row.createUserName" trigger="click" placement="top" width="450" @show="getUserInfoByUser(scope.row.createUser)">
              <!-- S -->
              <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
              <!-- E -->
              <div slot="reference" class="name-wrapper">
                <el-button size="mini">{{scope.row.createUserName}}</el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="操作时间" min-width="150"></el-table-column>
        <el-table-column label="操作" fixed="right" min-width="100" v-if="isRoot(rootCode['操作-删除'])">
          <template slot-scope="scope">
            <el-button type="text" @click="deleteThis(scope.row.id)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 效果管理部 -->
      <el-table v-loading="loading" v-else-if="(isShowTable('效果管理部') && isRoot(rootCode['查询-数据源-效果管理部']))" :key="2" @selection-change="handleSelectionChange" :height="dataListObj.dataInfo.t_height" :data="tableData" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序号" min-width="50"></el-table-column>
        <el-table-column prop="batch" label="统计年月" min-width="80"></el-table-column>
        <el-table-column prop="caseName" label="业务类型" min-width="150"></el-table-column>
        <el-table-column prop="entrustMoney" label="委托金额（月末在案口径）" min-width="180"></el-table-column>
        <el-table-column prop="householdNumber" label="月末在案口径对应户数" min-width="150"></el-table-column>
        <el-table-column prop="invoiceStatus" label="开票状态" min-width="100"></el-table-column>
        <el-table-column prop="returnedMoney" label="回款金额" min-width="100"></el-table-column>
        <el-table-column prop="balanceCommission" label="结算佣金" min-width="100"></el-table-column>
        <el-table-column prop="encourageCommission" label="期满补足的激励佣金" min-width="130"></el-table-column>
        <el-table-column prop="predictReturnedMoney" label="核对/预估回款" min-width="130"></el-table-column>
        <el-table-column prop="predictCommission" label="核对/预估佣金" min-width="130"></el-table-column>
        <el-table-column prop="reportPerformanceNext" label="申报业绩（次月）" min-width="130"></el-table-column>
        <el-table-column prop="groupPerformance" label="集团业绩" min-width="100"></el-table-column>
        <el-table-column prop="corpPerformance" label="公司业绩" min-width="100"></el-table-column>
        <el-table-column prop="annualAbversion" label="减免折算" min-width="100"></el-table-column>
        <el-table-column prop="reportPerformancePre" label="申报业绩（上月）" min-width="150"></el-table-column>
        <el-table-column prop="remark" label="备注" show-overflow-tooltip min-width="150"></el-table-column>
        <el-table-column prop="leadingCadre" label="效果管理部责任人" min-width="150"></el-table-column>
        <el-table-column label="操作人" min-width="150">
          <template slot-scope="scope">
            <el-popover v-show="scope.row.createUserName" trigger="click" placement="top" width="450" @show="getUserInfoByUser(scope.row.createUser)">
              <!-- S -->
              <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
              <!-- E -->
              <div slot="reference" class="name-wrapper">
                <el-button size="mini">{{scope.row.createUserName}}</el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="操作时间" min-width="150"></el-table-column>
        <el-table-column label="操作" fixed="right" min-width="100" v-if="isRoot(rootCode['操作-删除'])">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="deleteThis(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 财务部 -->
      <el-table v-loading="loading" v-else-if="(isShowTable('财务部') && isRoot(rootCode['查询-数据源-财务部']))" :key="3" @selection-change="handleSelectionChange" :height="dataListObj.dataInfo.t_height" :data="tableData" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序号" min-width="50"></el-table-column>
        <el-table-column prop="batch" label="统计年月" min-width="80"></el-table-column>
        <el-table-column prop="caseName" label="业务类型" min-width="100"></el-table-column>
        <el-table-column prop="invoiceStatus" label="开票状态" min-width="100"></el-table-column>
        <el-table-column prop="invoiceYear" label="开票年份" min-width="100"></el-table-column>
        <el-table-column prop="invoiceMonth" label="开票月份" min-width="100"></el-table-column>
        <el-table-column prop="invoiceDay" label="开票日期" min-width="100"></el-table-column>
        <el-table-column prop="returnedMoney" label="回款金额" min-width="100"></el-table-column>
        <el-table-column prop="balanceCommission" label="结算佣金" min-width="100"></el-table-column>
        <el-table-column prop="encourageCommission" label="期满补足的激励佣金" min-width="150"></el-table-column>
        <el-table-column prop="invoiceMoney" label="开票金额" min-width="100"></el-table-column>
        <el-table-column prop="commissionWithholdMoney" label="佣金扣减金额" min-width="100"></el-table-column>
        <el-table-column prop="commissionWithholdReason" show-overflow-tooltip label="佣金扣减明细及原因" min-width="200"></el-table-column>
        <el-table-column prop="promiseMoney" label="抵扣保证金金额" min-width="130"></el-table-column>
        <el-table-column prop="promiseBalance" label="保证金余额" min-width="100"></el-table-column>
        <el-table-column prop="approveDate" label="钉钉流程审批时间" min-width="150"></el-table-column>
        <el-table-column prop="expressNo" label="快递单号" min-width="150"></el-table-column>
        <el-table-column prop="accountDate" label="到账日期" min-width="130"></el-table-column>
        <el-table-column prop="accountMoney" label="到账金额" min-width="100"></el-table-column>
        <el-table-column prop="remark" label="备注" show-overflow-tooltip min-width="200"></el-table-column>
        <el-table-column prop="leadingCadre" label="财务部责任人" min-width="150"></el-table-column>
        <el-table-column label="操作人" min-width="150">
          <template slot-scope="scope">
            <el-popover v-show="scope.row.createUserName" trigger="click" placement="top" width="450" @show="getUserInfoByUser(scope.row.createUser)">
              <!-- S -->
              <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
              <!-- E -->
              <div slot="reference" class="name-wrapper">
                <el-button size="mini">{{scope.row.createUserName}}</el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="操作时间" min-width="150"></el-table-column>
        <el-table-column label="操作" fixed="right" min-width="100" v-if="isRoot(rootCode['操作-删除'])">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="deleteThis(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 人事部 -->
      <el-table v-loading="loading" v-else-if="(isShowTable('人事部') && isRoot(rootCode['查询-数据源-人事部']))" :key="4" @selection-change="handleSelectionChange" :height="dataListObj.dataInfo.t_height" :data="tableData" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序号" min-width="50"></el-table-column>
        <el-table-column prop="batch" label="统计年月" min-width="80"></el-table-column>
        <el-table-column prop="caseName" label="业务类型" min-width="100"></el-table-column>
        <el-table-column prop="collectionNum" label="催收人数" min-width="100"></el-table-column>
        <el-table-column prop="collectionGroups" label="催收集团数" min-width="100"></el-table-column>
        <el-table-column prop="remark" label="备注" show-overflow-tooltip min-width="150"></el-table-column>
        <el-table-column prop="leadingCadre" label="人事部负责人" min-width="150"></el-table-column>
        <el-table-column label="操作人" min-width="150">
          <template slot-scope="scope">
            <el-popover v-show="scope.row.createUserName" trigger="click" placement="top" width="450" @show="getUserInfoByUser(scope.row.createUser)">
              <!-- S -->
              <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
              <!-- E -->
              <div slot="reference" class="name-wrapper">
                <el-button size="mini">{{scope.row.createUserName}}</el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="操作时间" min-width="150"></el-table-column>
        <el-table-column label="操作" fixed="right" min-width="100" v-if="isRoot(rootCode['操作-删除'])">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="deleteThis(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 投诉安抚部 -->
      <el-table v-loading="loading" v-else-if="(isShowTable('投诉安抚部') && isRoot(rootCode['查询-数据源-投诉安抚部']))" @selection-change="handleSelectionChange" :key="5" :height="dataListObj.dataInfo.t_height" :data="tableData" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序号" min-width="50"></el-table-column>
        <el-table-column prop="batch" label="统计年月" min-width="80"></el-table-column>
        <el-table-column prop="caseName" label="业务类型" min-width="100"></el-table-column>
        <el-table-column prop="externalComplainNum" label="外部投诉户数" min-width="100"></el-table-column>
        <el-table-column prop="innerComplainNum" label="内部投诉户数" min-width="100"></el-table-column>
        <el-table-column prop="advancedWithholdMoney" label="垫付扣款金额" min-width="100"></el-table-column>
        <el-table-column prop="remark" show-overflow-tooltip label="备注" min-width="200"></el-table-column>
        <el-table-column prop="leadingCadre" label="投诉安抚部负责人" min-width="150"></el-table-column>
        <el-table-column label="操作人" min-width="150">
          <template slot-scope="scope">
            <el-popover v-show="scope.row.createUserName" trigger="click" placement="top" width="450" @show="getUserInfoByUser(scope.row.createUser)">
              <!-- S -->
              <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
              <!-- E -->
              <div slot="reference" class="name-wrapper">
                <el-button size="mini">{{scope.row.createUserName}}</el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="操作时间" min-width="150"></el-table-column>
        <el-table-column label="操作" fixed="right" min-width="100" v-if="isRoot(rootCode['操作-删除'])">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="deleteThis(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 数据汇总 -->
      <el-table v-loading="loading" v-else-if="(isShowTable('数据汇总') && isRoot(rootCode['查询-数据源-数据汇总']))" :key="6" :height="dataListObj.dataInfo.t_height" :data="tableData" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
        <el-table-column type="index" label="序号" min-width="50"></el-table-column>
        <el-table-column prop="batch" label="统计年月" min-width="80"></el-table-column>
        <el-table-column prop="caseName" label="业务类型" min-width="100"></el-table-column>
        <el-table-column prop="percapitaCommittedCaseMoney" label="人均委案金额（月末在案口径）" min-width="150"></el-table-column>
        <el-table-column prop="percapitaRepayMoney" label="人均还款" min-width="100"></el-table-column>
        <el-table-column prop="percapitaCommissionMoney" label="人均佣金" min-width="100"></el-table-column>
        <el-table-column prop="averageGroupRepayMoney" label="平均集团还款金额" min-width="100"></el-table-column>
        <el-table-column prop="averageGroupCommissionMoney" label="平均集团佣金金额" min-width="100"></el-table-column>
        <el-table-column prop="remark" show-overflow-tooltip label="备注" min-width="200"></el-table-column>
        <el-table-column label="操作人" min-width="150">
          <template slot-scope="scope">
            <el-popover v-show="scope.row.createUserName" trigger="click" placement="top" width="450" @show="getUserInfoByUser(scope.row.createUser)">
              <!-- S -->
              <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoData}"></PersonalInfoDetail>
              <!-- E -->
              <div slot="reference" class="name-wrapper">
                <el-button size="mini">{{scope.row.createUserName}}</el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="操作时间" min-width="150"></el-table-column>
      </el-table>

      <!-- 分页 有数据源时显示分页-->
      <div id="pagination" v-if="dataList.length >= 1">
        <el-pagination background :current-page="configPageObj.current" @size-change="handleSizeChange" @current-change="handlecurrentChange" :page-sizes="[10,15,20,30,40]" :page-size="configPageObj.size" layout="total,sizes,prev,pager,next,jumper" :total="configPageObj.total"></el-pagination>
      </div>

      <!-- 系统计算-->
      <el-dialog title="系统计算" :close-on-click-modal="false" :visible.sync="sysCalc" width="500px">
        <div>
          <el-form label-width="150px">
            <el-row>
              <el-col :md="15">
                <el-form-item label="统计年月" label-width="85px">
                  <el-date-picker v-model="sysCalcBatch" :clearable="false" class="width155" type="month" value-format="yyyy-MM" placeholder="选择年月">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :md="9">
                <el-form-item label="" label-width="0">
                  <el-button type="primary" @click="JS_sysCalc" style="display: inline-block; margin-right:10px">立即计算</el-button>
                  <el-button @click="sysCalc = false" style="display:inline-block;">取消</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <!-- <span slot="footer" class="dialog-footer">
        </span> -->
      </el-dialog>

      <!-- 批量删除温馨提示弹框 -->
      <el-dialog title="温馨提示" :close-on-click-modal="false" :visible.sync="deleAllWarn" width="450px">
        <el-row>
          <el-col :md="20" :offset="3" class="warnIcoBg">
            <h3>您正在进行删除操作，为了确定您的操作无误，请再次确定是否继续？</h3>
            <span style="color:red">注：删除后不可恢复！</span>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleAllWarn = false">取消</el-button>
          <el-button type="primary" @click="doAllDeleteSave">确定</el-button>
        </span>
      </el-dialog>

      <!-- 导入弹框 -->
      <el-dialog title="导入" :close-on-click-modal="false" :show-close="false" :visible.sync="exportModal" width="580px">
        <el-form label-width="100px" ref="exportExform">
          <el-row>
            <el-col :md="24">
              <el-form-item label="导入年月" label-width="80px">
                <el-date-picker v-model="importBatch" style="width:460px" :editable="false" :clearable="false" type="month" value-format="yyyy-MM" placeholder="选择年月">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :md="24">
              <el-form-item label="数据源" label-width="80px">
                <el-select placeholder="请选择" v-model="exportData" style="width:460px" filterable>
                  <el-option v-for="item in dataListForImport" :key="item.id" :label="item.categoryTypeName" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="24" class="clearfix mar-ver">
              <el-form-item label="数据导入" label-width="80px">
                <el-upload class="upload-demo" :multiple="false" :limit="1" ref="importRef" :data="{batch:importBatch,source:exportData}" :auto-upload="false" :action="uploadActionUrl" :on-success="busHandleSuccess" :headers="headers" :before-remove="beforeRemove" :before-upload="beforeUpload" :file-list="busFileList">
                  <el-button slot="trigger" size="mediumn" class="cloud-uploadBtn">
                    <i></i>&nbsp;导入数据
                  </el-button>&nbsp;&nbsp;
                  <el-button style="margin-left: 10px;" size="mediumn" type="success" @click="submitUpload">确认导入</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :md="16">
              <div style="padding-left:10px;line-height:30px;color:red;margin-top:10px;">注：导入成功后，会立刻覆盖当前版本</div>
            </el-col>
            <el-col :md="8" class="clearfix mar-ver">
              <div class="fileBox" style="margin-top:-10px;margin-right:-10px;text-align:right;">
                <span class="filename excel">
                  <el-button type="text" class="underlineTxt" @click.stop="JS_download">公用模板下载</el-button>
                </span>
              </div>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="exportModal = false">取消</el-button>
        </span>
      </el-dialog>

      <!-- 导入进度条信息 -->
      <el-dialog title="导入信息" :show-close="false" :close-on-click-modal="false" :visible.sync="importProcessInfoDialog" width="600px">
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

      <!-- 导出-->
      <el-dialog title="导出" :close-on-click-modal="false" :show-close="false" :visible.sync="exportDialog" width="600px">
        <div>
          <el-form label-width="150px">
            <el-row>
              <el-col :md="12">
                <el-form-item label="导出年月" label-width="85px">
                  <el-date-picker v-model="exportBatch" :clearable="false" class="width155" type="month" value-format="yyyy-MM" placeholder="选择年月">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item label="数据源" label-width="125px">
                  <el-select placeholder="请选择" v-model="exportData" class="width155" filterable>
                    <el-option v-for="item in dataList" :key="item.id" :label="item.categoryTypeName" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :md="24">
                <el-form-item label="导出方式" label-width="85px">
                  <el-select placeholder="请选择" v-model="exportVal" style="width:300px" filterable>
                    <el-option v-for="item in exportType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="exportDialog = false">取消</el-button>
          <el-button type="primary" @click="exportToWary">确定</el-button>
        </span>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import Tools from "../../untils/index.js"
import { GET, POST, DELETE } from "http/custom.js"

export default {
  name: "comope_business",
  components: {},
  props: {
    dataListObj: {
      type: Object,
      required: true,
      default: () => {
        return {
          dataInfo: {} //接收到父组件中的 dataObj ，里面会有多个数组
        };
      }
    }
  },
  data() {
    const uploadActionUrl = process.env.VUE_APP_DOMAIN_quote + "/importExcel"; //导入action  线上
    let yd = Tools.getPYd() //获取当前年月 格式为 2019-07
    return {
      batch: yd, //年月
      importBatch: yd, //导入年月
      exportBatch: yd, //导出年月
      sysCalcBatch: yd, //系统计算年月
      updateDialog: false, //修改窗
      dataOrigin: undefined, //数据源
      businessType: undefined, //业务类型
      exportModal: false,//导入窗
      exportDialog: false,//导出窗
      exportData: '0',//导入/导出 数据源
      exportVal: 1,//导出方式
      uploadActionUrl, // 导入url
      headers: { //上传请求头
        "x-user-token": localStorage.getItem("token") //设置上传数据文件excel的token
      },
      busFileList: [], //上传的文件列表,
      loading: false, //加载
      deleAllWarn: false, //批量删除弹窗
      multipleSelection: [],//已选择行数组
      sysCalc: false, //系统计算弹窗
      personalInfoData: {}, //姓名popover弹窗数据
      //进度条相关参数
      importProcessInfoDialog: false,//导入进度弹框
      importError: false,// 导入错误时呈现的进度 
      downloadErrorEveProcess: false, //获取错误下载key
      loadErrorExcel: false,
      downloadErrorKey: false,
      progressBackBtn: false, //返回按钮
      progressPercentAge: 0, //进度百分比
      uploadProcessInfo: {
        total: '',//总条数
        handler: '',//已处理条数
        successful: '',//处理成功条数
        failures: '', //处理失败条数
        finish: false,//是否处理完成
        dealAllTime: '',//总耗时
      },
      //oa系统中配置的权限 id
      rootCode: {
        '查询-数据源': '0d0412db0daa40c8be805cc6ed423a27',
        '查询-数据源-市场部': '0f61ef0defc4407d9ab2f9b2d966c513',
        '查询-数据源-效果管理部': '5411b04202a04e98a1d05c776c1084e9',
        '查询-数据源-财务部': '5af1a9193bd94e1db88df72a22bb61cb',
        '查询-数据源-投诉安抚部': '6ea08832ef4d4a9ab6e07a05580b97c4',
        '查询-数据源-数据汇总': '31d6571e1a114ffa9ed9f2b147e30b21',
        '查询-数据源-人事部': 'd68d0580851248719015fd8de864eb27',
        '查询-业务类型': '8d1611da434d4d4fb56e4b2afdf9fd14',
        '操作-导入': '962e1eebe2194270ab07c95f1d4e6485',
        '操作-导出': 'e8b8897ddaa34300abea0b8d5ebdbc27',
        '操作-删除': 'c3a29efb1aed4d969d2d4b39ace31612',
        '操作-批量删除': 'afe855173d0f44a2b538c94685de4562',
        '系统计算': 'eda246446c37474fa14e8ff9b69b8349'
      },
      //对象与数组 
      configPageObj: {
        size: 15, //每页显示记录条数
        current: 1, //当前页码
        total: 0, //总记录数据
      },
      exportType: [ //导出方式
        { value: 1, label: "保存至本地（需要等待数秒至数分钟）" },
        { value: 2, label: "发送至本人内网邮箱" }
      ],
      tableData: [],//表格数据
      dataList: [],//数据源
      dataListForImport: [],//导入的数据源
      businessList: [],//业务类型
    };
  },
  computed: {
    isRoot() { //通过老oa配置的id,判断当前 用户是否有对应的权限 
      return (idCode) => {
        return Tools.includes(this.$store.state.userActionAll, idCode);
      }
    },
    isShowTable() { //呈现数据源对应的表格
      return (name) => {
        let list = this.dataList;
        if (list.length <= 0) { //数据源不存在时默认显示  市场部表格
          return name === '市场' ? true : false;
        }

        const item = list.find(v => { //找到数据源id对应的 obj
          return v.id === this.dataOrigin;
        });

        if (item) { //id对应的数据源选中后返回  checked
          return item.categoryTypeName.includes(name) ? true : false;
        } else {
          return false;
        }
      }
    }
  },
  created() {
    this.getDataAndBus();
  },
  methods: {
    messagePopp(type, msg) {    //提示框
      this.$message({
        showClose: true,
        type: type,
        message: msg
      });
    },
    //根据员工编号获取个人信息
    getUserInfoAdjust(num) {
      GET(process.env.VUE_APP_DOMAIN_personnel + "/userInfo", { aid: num })
        .then(res => {
          this.personalInfoData = res.data;
          this.personalInfoData.employedDates = this.personalInfoData.employedDates.split(" ")[0];
          console.log(this.personalInfoData);
        })
        .catch(error => {
          this.personalInfoData = {};
          console.log(error);
        });
    },
    //根据createUser获取个人信息
    getUserInfoByUser(num) {
      GET(process.env.VUE_APP_DOMAIN_personnel + "/queryUserInfoToRegid", { regid: num })
        .then(res => {
          this.personalInfoData = res.data;
          this.personalInfoData.employedDates = this.personalInfoData.employedDates.split(" ")[0];
          console.log(this.personalInfoData);
        })
        .catch(error => {
          this.personalInfoData = {};
          console.log(error);
        });
    },
    handleCommand(command) { //更多操作下拉框     
      switch (command) {
        case "a":
          this.exportDialog = true;//导出         
          this.exportBatch = Tools.getPYd(); //导出年月   
          this.exportData = this.dataOrigin; //导出时与查询数据源同步           
          break;
        case "b":
          this.exportModal = true; //导入
          this.importBatch = Tools.getPYd(); //导入年月
          this.exportData = this.dataOrigin; //导入时与查询数据源同步          
          break;
        case "c":
          this.deleAllWarn = true; // 批量删除
          break;
        default:
          console.log("default");
          return;
      }
    },
    async getDataAndBus() {
      // 抽离成公共方法 方便捕获异常
      const awaitWrap = (promise) => {
        return promise
          .then(data => [null, data])
          .catch(err => [err, null])
      }

      //查询数据源
      let searchObj = {
        categoryType: 2,
        parentId: 1,
      };
      const [err, resDtType] = await awaitWrap(POST(process.env.VUE_APP_DOMAIN_quote + '/quotecategory/list', searchObj))

      //数据源接口成功时
      if (err === null) {
        this.dataList = resDtType.data;
        let lng = this.dataList.length, item = 0;
        //是否有数据源
        if (lng >= 1) {
          item = this.dataList[0];//默认显示第一个 
          this.dataOrigin = item.id // 搜索下拉中当前用户对应的 id
          this.exportData = item.id //导入/导出 

          //导入的弹窗中的数据源不呈现  数据汇总
          this.dataListForImport = [];
          resDtType.data.forEach(v => {
            if (v.categoryTypeName !== '数据汇总') {
              this.dataListForImport.push(v);
            }
          });
        }
      }

      //查询业务类型
      this.getCaseTypeList();

      //搜索
      this.JS_search();
    },
    getCaseTypeList() {//查询业务类型
      GET(process.env.VUE_APP_DOMAIN_quote + '/market/caseTypeList', { batch: this.batch }).then((res) => {
        this.businessList = [];
        let object = res.data;
        if (object) {
          for (const key in object) {
            if (object.hasOwnProperty(key)) {
              this.businessList.push({
                id: key,
                bizType: object[key]
              });
            }
          }
        }
      }).catch((err) => {
        console.log(err);
      });
    },
    JS_search() { //搜索
      this.configPageObj.current = 1;
      this.search();
    },
    search() {
      let searchObj = {
        batch: this.batch,
        bizType: this.businessType || "", //业务类型
        source: this.dataOrigin || "", //数据源
        current: this.configPageObj.current || "",
        size: this.configPageObj.size || "",
      };
      this.loading = true;
      POST(`${process.env.VUE_APP_DOMAIN_quote}/list`, searchObj).then(res => {
        this.loading = false;
        this.tableData = res.data.records; //set表格的值
        this.configPageObj.size = res.data.size; //每页显示记录条数
        this.configPageObj.current = res.data.current; // set当前页
        this.configPageObj.total = res.data.total; //总记录数据
      }).catch(error => {
        this.loading = false;
        console.log(error);
      });
    },
    handlecurrentChange(val) { //当前页
      this.configPageObj.current = val;
      this.search();
    },
    handleSizeChange(val) {//下拉设置页数
      this.configPageObj.size = val;
      this.search();
    },
    handleSelectionChange(val) {//当选择项发生变化时会触发该事件
      this.multipleSelection = val;
      console.log('选中的行', val);
    },
    changeBatch() { //通过年月改变业务类型
      this.businessType = '';
      this.getCaseTypeList();
    },
    deleteThis(id) { //行内删除     
      this.$msgBox.confirm("你确定要删除该条数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        DELETE(process.env.VUE_APP_DOMAIN_quote + "/delete", {
          ids: id,
          source: this.dataOrigin, //业务类型
        }).then(() => {
          this.JS_search();
        }).catch(error => {
          console.log(error);
        });
      }).catch(() => {
        this.messagePopp("info", "已取消删除!");
      });
    },
    doAllDeleteSave() {//批量删除
      let selectItem = this.multipleSelection;
      if (selectItem.length <= 0) {
        this.messagePopp("warning", "请勾选要批量删除的数据!");
        this.deleAllWarn = false; //关闭弹框
      } else {
        let ids = [];
        selectItem.forEach(element => {
          ids.push(element.id)
        })
        ids = ids.join(',') //转换成以逗号隔开的字符串
        DELETE(process.env.VUE_APP_DOMAIN_quote + '/delete', {
          ids: ids,
          source: this.dataOrigin, //业务类型
        }).then(() => {
          this.messagePopp("success", "批量删除成功!");
          this.deleAllWarn = false //关闭弹框
          this.JS_search() //刷新表格，重新获取数据
        }).catch(error => {
          console.log(error)
        })
      }
    },
    exportToWary() { //导出      
      // 导出方式   1直接下载  2发到邮箱
      let ul = process.env.VUE_APP_DOMAIN_quote + '/exportExcel';

      if (this.exportVal === 1) {//导出方式
        this.messagePopp("success", "已经导出至本地！");
        //下载拼接 已经导出至本地！
        let urls = `${ul}?token=${localStorage.getItem("token")}&exportType=${this.exportVal}&source=${this.exportData}&batch=${this.exportBatch}`;
        window.location.href = urls;
      } else {
        let params = {
          batch: this.exportBatch,
          source: this.exportData,
          exportType: this.exportVal,
        };
        //导出至邮箱   这个接口没有返回值，后台要求直接提示
        GET(ul, params).then(() => {
          this.messagePopp("success", "已经导入至您的邮箱！");
        }).catch(error => {
          console.log(error);
        });
      }

      // 关闭导出弹窗
      this.exportDialog = false;
    },
    beforeRemove(file) {//导入 删除文件之前的钩子      
      return this.$msgBox.confirm(`确定移除 ${file.name}？`);
    },
    beforeUpload(file) { //导入 上传文件之前的钩子     
      //截取文件后缀
      let testFileType = file.name.substring(file.name.lastIndexOf('.') + 1);
      if (testFileType === 'xls' || testFileType === 'xlsx') {
        return true;
      }

      //不是excel文件格式   为 false 时自动触发 beforeRemove
      this.$message.error("上传数据文件只能是 xlsx/xls 格式!")
      return false;
    },
    submitUpload() {//导入 确认导入
      if (this.$refs.importRef.uploadFiles.length === 0) {
        return this.messagePopp("warning", "请选取文件！");
      } else {
        this.$refs.importRef.submit() //手动上传
      }
    },
    JS_download() { // 导入 下载模板
      console.log(this.exportData, this.dataList);
      let ul = process.env.VUE_APP_DOMAIN_quote + '/exportExcel';
      let href = `${ul}?token=${localStorage.getItem("token")}&source=${this.exportData}&exportType=1&batch=${this.importBatch}&exportModel=2`;
      window.location.href = href;
    },
    busHandleSuccess(res) { //上传文件接口成功回调
      this.exportModal = false;  //关闭导入弹框
      if (res.code === 0) { // 文件上传成功      
        this.importError = true;  //导入进度条
        this.downloadErrorEveProcess = res.data; //获取进度条事件句柄

        //错误导入进度条与下载模板
        this.importProcessInfoDialog = true
        this.queryProgress() //获取上传文件进度条信息
        console.log("上传数据成功", res);
      } else {
        let msgError = res.msg || '【系统无法识别EXCLE中的空白、公式和非法字符。请先清理】。' //50*非0情况
        this.$msgBox.alert(`<span style="color:red;">${msgError} </span>`, '温馨提示', {
          dangerouslyUseHTMLString: true
        })
      }
      this.$refs.importRef.clearFiles(); //清除上传的文件
    },
    queryProgress() { //上传进度条
      this.dataOrigin = this.exportData; //导入数据后可立即看表格数据 
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
            this.JS_search();//刷新页面

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
    unloadErrorLink() {//导入错误模板下载
      //console.log('downloadErrorKey', this.downloadErrorKey);
      // let obj = this.dataList.find(v => {
      //   return this.exportData === v.id
      // });
      let url = process.env.VUE_APP_DOMAIN_download + '/oss/download?key=' + this.downloadErrorKey
        + '&token=' + localStorage.getItem("token")
        + "&name=" + encodeURI("导入失败明细") + ".xlsx";
      window.location.href = url;
    },
    importProgress() {//进度弹框关闭
      this.importProcessInfoDialog = false; //关闭进度弹框
      this.progressPercentAge = 0; //进度条清空为0
      this.progressBackBtn = false; //隐藏返回按钮
      this.loadErrorExcel = false; // 隐藏下载失败链接
    },
    sysCalcShow() { //呈现系统计算弹窗
      this.sysCalcBatch = Tools.getPYd();
      this.sysCalc = true
    },
    JS_sysCalc() { //系统计算
      const allLoading = this.$loading({//锁定页面loading
        lock: true,
        text: '正在计算数据，请稍等片刻...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.sysCalc = false
      GET(process.env.VUE_APP_DOMAIN_quote + "/business/calculate", {
        batch: this.sysCalcBatch
      }).then(() => {
        allLoading.close(); //关闭loading
        this.JS_search();
      }).catch(error => {
        allLoading.close(); //关闭loading
        this.JS_search();
        console.log(error);
      });
    }
  },
};
</script>

