<template>
  <div class="PerformanceQuery">
    <div class="guide">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home/personalCenter' }">个人中心</el-breadcrumb-item>
        <el-breadcrumb-item>我的</el-breadcrumb-item>
        <el-breadcrumb-item>业绩查询</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/personalCenter' }">(返回上级)</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="bgWhite mgt15">
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <!-- <el-tab-pane label="个人业绩" name="first" :model="personSearch" v-if="personal_performance_flag"> -->
        <el-tab-pane label="个人业绩" name="first" :model="personSearch">
          <div class="tbSearch clearfix">
            <el-form class="pull-left" :inline="true">
              <el-form-item label="年月">
                <el-date-picker
                  class="width110"
                  v-model="personSearch.batch"
                  type="month"
                  :editable="false"
                  :clearable="false"
                  value-format="yyyy-MM"
                  placeholder="年月"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="业务类型">
                <el-select
                  class="width155"
                  ref="areaAfter"
                  v-model="personSearch.payCasetypeChi"
                  placeholder="选择类型"
                  clearable
                >
                  <el-option
                    v-for="item in caseTypeOptions"
                    :key="item.typeId"
                    :label="item.typeName"
                    :value="item.typeId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="姓名/编号" v-if="personal_performance_search"> -->
              <el-form-item label="姓名/编号" v-if="personPerformanceOpe">
                <el-autocomplete
                  style="width:250px"
                  class="inline-input"
                  @blur="JS_select()"
                  v-model.trim="state"
                  :fetch-suggestions="querySearch"
                  placeholder="请输入姓名或员工编号"
                  :trigger-on-focus="false"
                  @select="handleSelect"
                ></el-autocomplete>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="performanceSearch()">搜索</el-button>
              </el-form-item>
            </el-form>
            <div class="pull-right">
              <el-button @click="addperfoDissentPre()">业绩归属异议</el-button>
              <!-- <el-button @click="getPersonalPerformance()" v-if="personal_performance_search">获取个人业绩</el-button> -->
              <el-button @click="getPersonalPerformance()" v-if="personPerformanceOpe">获取个人业绩</el-button>
            </div>
          </div>
          <div class="rbDetails">
            <el-row>
              <el-col :span="8">
                <div class="flexBox rbText">
                  <div class="rbName">还款总额：</div>
                  <div class="rbNum">
                    <span>{{performanceTotalData.repaymentMoneyTotal | toThousands}}</span>
                  </div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="flexBox rbText">
                  <div class="rbName">折算总额：</div>
                  <div class="rbNum">
                    <span>{{performanceTotalData.convertTotal | toThousands}}</span>
                  </div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="flexBox rbText">
                  <div class="rbName">搁置总额：</div>
                  <div class="rbNum">
                    <span>{{performanceTotalData.shelveperTotal | toThousands}}</span>
                  </div>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <div class="flexBox rbText">
                  <div class="rbName">核款总额：</div>
                  <div class="rbNum">
                    <span>{{performanceTotalData.returnMoneyTotal | toThousands}}</span>
                  </div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="flexBox rbText">
                  <div class="rbName">团队业绩：</div>
                  <div class="rbNum">
                    <span>{{performanceTotalData.teamPerformanceTotal | toThousands}}</span>
                  </div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="flexBox rbText">
                  <div class="rbName">预计个人业绩提成：</div>
                  <div class="rbNum">
                    <span>{{performanceTotalData.expectedPerformanceCommission | toThousands}}</span>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="table_wrap">
            <el-table
              :data="performanceTableData"
              :height="height_1"
              border
              style="width:100%"
              :header-cell-style="{backgroundColor:'#e5e9f3'}"
              @sort-change="personalSortChange"
            >
              <el-table-column type="index" label="序号" min-width="50"></el-table-column>
              <el-table-column label="经办人" min-width="150">
                <template slot-scope="scope">
                  <el-popover
                    trigger="click"
                    placement="top"
                    width="450"
                    @show="getInfoForAccount(scope.row.payOpernumber)"
                  >
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoDataAll}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.payOpername}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="payCasetypeChiName" label="业务类型" min-width="120"></el-table-column>
              <el-table-column prop="cardName" label="持卡人" min-width="120"></el-table-column>
              <el-table-column prop="cardIdnumber" label="身份证号" min-width="160"></el-table-column>
              <el-table-column prop="cardBackcard" label="银行卡号" min-width="180"></el-table-column>
              <el-table-column prop="payAmount" label="还款金额" min-width="120" sortable="custom">
                <template slot-scope="scope">{{scope.row.payAmount | toThousands}}</template>
              </el-table-column>
              <el-table-column prop="payupIshave" label="是否主单回款" min-width="100"></el-table-column>
              <el-table-column prop="payTime" label="还款日期" min-width="120" sortable="custom">
                <template slot-scope="scope">
                  <!-- {{scope.row.payTime.split(' ')[0]}} -->
                  {{scope.row.payTime?scope.row.payTime.split(' ')[0]:'--'}}
                </template>
              </el-table-column>
              <el-table-column
                prop="finalAccountingRepayment"
                label="最终核款"
                min-width="120"
                sortable="custom"
              >
                <template slot-scope="scope">{{scope.row.finalAccountingRepayment | toThousands}}</template>
              </el-table-column>
              <el-table-column label="操作" min-width="100" fixed="right">
                <template slot-scope="scope">
                  <span
                    @click="getDissentDetail(scope.row.payId)"
                    v-if="scope.row.appealBoolean==1"
                  >
                    <el-button type="text" size="small">详情</el-button>
                    <span style="color:#999;font-size:12px;">(已申诉)</span>
                  </span>
                  <span @click="getPersonDetail(scope.row.id)" v-else>
                    <el-button type="text" size="small">详情</el-button>
                  </span>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div id="pagination">
              <el-pagination
                @size-change="personHandleSizeChange"
                @current-change="personHandlecurrentChange"
                background
                :current-page="personCurrent"
                :page-sizes="[10,15,20,30,40]"
                :page-size="personSize"
                layout="total,sizes,prev,pager,next,jumper"
                :total="personTotal"
              ></el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <!-- 业绩排名 -->
        <el-tab-pane label="业绩排名" name="second" v-if="performanceRankTab">
          <!-- <el-tab-pane label="业绩排名" name="second" v-if="performance_rank_flag"> -->
          <div class="clearfix">
            <el-form :inline="true" class="pull-left">
              <el-form-item label="所属年月">
                <el-date-picker
                  class="width110"
                  v-model="rankBatch"
                  type="month"
                  :editable="false"
                  :clearable="false"
                  value-format="yyyy-MM"
                  placeholder="选择年月"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="排名分段">
                <el-select class="width155" v-model="GRankValue" clearable placeholder="请选择">
                  <el-option
                    v-for="item in rankOptions"
                    :key="item.dic_type_values"
                    :label="item.dic_type_name"
                    :value="item.dic_type_values"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="rankSearch()">搜索</el-button>
              </el-form-item>
            </el-form>
            <div class="pull-right">
              <el-button class="cloud-downloadBtn" @click="exportRank()">
                <i></i>&nbsp;导出
              </el-button>
            </div>
          </div>
          <div class="roleSelect mar-btm">
            <el-radio-group v-model="roleSelect" @change="roleChange">
              <el-radio-button label="总经理业绩" v-if="performance_rank_manage"></el-radio-button>
              <el-radio-button label="副总经理业绩" v-if="performance_rank_vice"></el-radio-button>
              <el-radio-button label="部长业绩" v-if="performance_rank_minister"></el-radio-button>
              <!-- <el-radio-button label="组长业绩"></el-radio-button> -->
              <el-radio-button label="个人业绩" v-if="performance_rank_personal"></el-radio-button>
            </el-radio-group>
          </div>
          <div class="roleTableWrap">
            <!-- 总经理 -->
            <div v-if="roleSelect=='总经理业绩'" class="generalManager" key="generalManager">
              <div class="rtTable">
                <el-table
                  :data="manageData"
                  :height="height_2"
                  border
                  style="width:100%"
                  :header-cell-style="{backgroundColor:'#e5e9f3'}"
                >
                  <el-table-column type="index" label="序号" min-width="50"></el-table-column>
                  <el-table-column label="总经理" min-width="150">
                    <template slot-scope="scope">
                      <el-popover
                        trigger="click"
                        placement="top"
                        width="450"
                        @show="getInfoForAccount(scope.row.payOpernumber)"
                      >
                        <!-- S -->
                        <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoDataAll}"></PersonalInfoDetail>
                        <!-- E -->
                        <div slot="reference" class="name-wrapper">
                          <el-button size="mini">{{scope.row.payOpername}}</el-button>
                        </div>
                      </el-popover>
                    </template>
                  </el-table-column>
                  <el-table-column prop="groupSize" label="今日人数" min-width="60"></el-table-column>
                  <el-table-column
                    prop="companyArea"
                    label="所属区域"
                    min-width="150"
                    show-overflow-tooltip
                  ></el-table-column>
                  <el-table-column
                    prop="repaymentMoneyTotal"
                    label="团队还款总额"
                    sortable
                    min-width="100"
                  >
                    <template slot-scope="scope">{{scope.row.repaymentMoneyTotal | toThousands}}</template>
                  </el-table-column>
                  <el-table-column prop="returnMoneyTotal" label="团队核款总额" sortable min-width="100">
                    <template slot-scope="scope">{{scope.row.returnMoneyTotal | toThousands}}</template>
                  </el-table-column>
                  <el-table-column
                    prop="expectedPerformanceCommission"
                    label="预计团队绩效"
                    min-width="100"
                  >
                    <template
                      slot-scope="scope"
                    >{{scope.row.expectedPerformanceCommission | toThousands}}</template>
                  </el-table-column>
                  <el-table-column prop="assessmentStandardValue" label="考核达标值" min-width="100"></el-table-column>
                  <el-table-column
                    prop="rateReachingTheStandard"
                    label="达标率"
                    sortable
                    min-width="80"
                  ></el-table-column>
                  <el-table-column prop="performanceRanking" label="业绩排名" sortable min-width="80"></el-table-column>
                </el-table>
                <!-- 分页 -->
                <div id="pagination">
                  <el-pagination
                    @size-change="manageHandleSizeChange"
                    @current-change="manageHandlecurrentChange"
                    background
                    :current-page="manageCurrent"
                    :page-sizes="[10,15,20,30,40]"
                    :page-size="manageSize"
                    layout="total,sizes,prev,pager,next,jumper"
                    :total="manageTotal"
                  ></el-pagination>
                </div>
              </div>
            </div>
            <!-- -----end------ -->
            <!-- 副总经理 -->
            <div v-if="roleSelect=='副总经理业绩'" class="deputyGeneral" key="deputyGeneral">
              <div class="rtTable">
                <el-table
                  :data="viceData"
                  :height="height_2"
                  border
                  style="width:100%"
                  :header-cell-style="{backgroundColor:'#e5e9f3'}"
                >
                  <el-table-column type="index" label="序号" min-width="50"></el-table-column>
                  <el-table-column label="副总经理" min-width="150">
                    <template slot-scope="scope">
                      <el-popover
                        trigger="click"
                        placement="top"
                        width="450"
                        @show="getInfoForAccount(scope.row.payOpernumber)"
                      >
                        <!-- S -->
                        <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoDataAll}"></PersonalInfoDetail>
                        <!-- E -->
                        <div slot="reference" class="name-wrapper">
                          <el-button size="mini">{{scope.row.payOpername}}</el-button>
                        </div>
                      </el-popover>
                    </template>
                  </el-table-column>
                  <el-table-column label="总经理" min-width="150">
                    <template slot-scope="scope">
                      <el-popover
                        trigger="click"
                        placement="top"
                        width="450"
                        @show="getInfoForId(scope.row.managerId)"
                      >
                        <!-- S -->
                        <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoDataAll}"></PersonalInfoDetail>
                        <!-- E -->
                        <div slot="reference" class="name-wrapper">
                          <el-button size="mini">{{scope.row.managerName}}</el-button>
                        </div>
                      </el-popover>
                    </template>
                  </el-table-column>
                  <el-table-column prop="groupSize" label="今日人数" min-width="100"></el-table-column>
                  <el-table-column
                    prop="companyArea"
                    label="所属区域"
                    min-width="150"
                    show-overflow-tooltip
                  ></el-table-column>
                  <el-table-column prop="payupMoney" label="主单回款" min-width="100">
                    <template slot-scope="scope">{{scope.row.payupMoney | toThousands}}</template>
                  </el-table-column>
                  <el-table-column
                    prop="repaymentMoneyTotal"
                    label="团队还款总额"
                    sortable
                    min-width="100"
                  >
                    <template slot-scope="scope">{{scope.row.repaymentMoneyTotal | toThousands}}</template>
                  </el-table-column>
                  <el-table-column prop="returnMoneyTotal" label="团队核款总额" sortable min-width="100">
                    <template slot-scope="scope">{{scope.row.returnMoneyTotal | toThousands}}</template>
                  </el-table-column>
                  <el-table-column
                    prop="expectedPerformanceCommission"
                    label="预计团队绩效"
                    min-width="100"
                  >
                    <template
                      slot-scope="scope"
                    >{{scope.row.expectedPerformanceCommission | toThousands}}</template>
                  </el-table-column>
                  <el-table-column prop="assessmentStandardValue" label="考核达标值" min-width="100"></el-table-column>
                  <el-table-column
                    prop="rateReachingTheStandard"
                    label="达标率"
                    sortable
                    min-width="80"
                  ></el-table-column>
                  <el-table-column prop="performanceRanking" label="业绩排名" sortable min-width="80"></el-table-column>
                </el-table>
                <!-- 分页 -->
                <div id="pagination">
                  <el-pagination
                    @size-change="viceHandleSizeChange"
                    @current-change="viceHandlecurrentChange"
                    background
                    :current-page="viceCurrent"
                    :page-sizes="[10,15,20,30,40]"
                    :page-size="viceSize"
                    layout="total,sizes,prev,pager,next,jumper"
                    :total="viceTotal"
                  ></el-pagination>
                </div>
              </div>
            </div>
            <!-- -----end------ -->
            <!-- 部长业绩 -->
            <div v-if="roleSelect=='部长业绩'" class="minister" key="minister">
              <div class="rtTable">
                <el-table
                  :data="ministerData"
                  :height="height_2"
                  border
                  style="width:100%"
                  :header-cell-style="{backgroundColor:'#e5e9f3'}"
                >
                  <el-table-column type="index" label="序号" min-width="50"></el-table-column>
                  <el-table-column label="部长" min-width="150">
                    <template slot-scope="scope">
                      <el-popover
                        trigger="click"
                        placement="top"
                        width="450"
                        @show="getInfoForId(scope.row.payOperid)"
                      >
                        <!-- S -->
                        <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoDataAll}"></PersonalInfoDetail>
                        <!-- E -->
                        <div slot="reference" class="name-wrapper">
                          <el-button size="mini">{{scope.row.payOpername}}</el-button>
                        </div>
                      </el-popover>
                    </template>
                  </el-table-column>
                  <el-table-column label="副总经理" min-width="150">
                    <template slot-scope="scope">
                      <el-popover
                        trigger="click"
                        placement="top"
                        width="450"
                        @show="getInfoForId(scope.row.viceId)"
                      >
                        <!-- S -->
                        <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoDataAll}"></PersonalInfoDetail>
                        <!-- E -->
                        <div slot="reference" class="name-wrapper">
                          <el-button size="mini">{{scope.row.viceName}}</el-button>
                        </div>
                      </el-popover>
                    </template>
                  </el-table-column>
                  <el-table-column prop="groupSize" label="今日人数" min-width="80"></el-table-column>
                  <el-table-column
                    prop="companyArea"
                    label="所属区域"
                    min-width="150"
                    show-overflow-tooltip
                  ></el-table-column>
                  <el-table-column prop="payupMoney" label="主单回款" min-width="100">
                    <template slot-scope="scope">{{scope.row.payupMoney | toThousands}}</template>
                  </el-table-column>
                  <el-table-column
                    prop="repaymentMoneyTotal"
                    label="团队还款总额"
                    sortable
                    min-width="100"
                  >
                    <template slot-scope="scope">{{scope.row.repaymentMoneyTotal | toThousands}}</template>
                  </el-table-column>
                  <el-table-column prop="returnMoneyTotal" label="团队核款总额" sortable min-width="100">
                    <template slot-scope="scope">{{scope.row.returnMoneyTotal | toThousands}}</template>
                  </el-table-column>
                  <el-table-column
                    prop="expectedPerformanceCommission"
                    label="预计团队绩效"
                    min-width="100"
                  >
                    <template
                      slot-scope="scope"
                    >{{scope.row.expectedPerformanceCommission | toThousands}}</template>
                  </el-table-column>
                  <el-table-column prop="assessmentStandardValue" label="考核达标值" min-width="100"></el-table-column>
                  <el-table-column
                    prop="rateReachingTheStandard"
                    label="达标率"
                    sortable
                    min-width="80"
                  ></el-table-column>
                  <el-table-column prop="performanceRanking" label="业绩排名" sortable min-width="80"></el-table-column>
                </el-table>
                <!-- 分页 -->
                <div id="pagination">
                  <el-pagination
                    @size-change="ministerHandleSizeChange"
                    @current-change="ministerHandlecurrentChange"
                    background
                    :current-page="ministerCurrent"
                    :page-sizes="[10,15,20,30,40]"
                    :page-size="ministerSize"
                    layout="total,sizes,prev,pager,next,jumper"
                    :total="ministerTotal"
                  ></el-pagination>
                </div>
              </div>
            </div>
            <!-- -----end------ -->
            <!-- 个人业绩 -->
            <div v-if="roleSelect=='个人业绩'" class="personal">
              <div class="rtTable">
                <el-table
                  :data="headmanData"
                  :height="height_2"
                  border
                  style="width:100%"
                  :header-cell-style="{backgroundColor:'#e5e9f3'}"
                >
                  <el-table-column type="index" label="序号" min-width="50"></el-table-column>
                  <el-table-column label="组员" min-width="150">
                    <template slot-scope="scope">
                      <el-popover
                        trigger="click"
                        placement="top"
                        width="450"
                        @show="getInfoForId(scope.row.payOperid)"
                      >
                        <!-- S -->
                        <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoDataAll}"></PersonalInfoDetail>
                        <!-- E -->
                        <div slot="reference" class="name-wrapper">
                          <el-button size="mini">{{scope.row.payOpername}}</el-button>
                        </div>
                      </el-popover>
                    </template>
                  </el-table-column>
                  <!-- <el-table-column label="组长" min-width="150">
                    <template slot-scope="scope">
                      <el-popover trigger="click" placement="top" @show="getInfoForId(scope.row.headmanId)">
                        
                        <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoDataAll}"></PersonalInfoDetail>
                        
                        <div slot="reference" class="name-wrapper">
                          <el-button size="mini">{{scope.row.headmanName}}</el-button>
                        </div>
                      </el-popover>
                    </template>
                  </el-table-column>-->
                  <el-table-column label="部长" min-width="150">
                    <template slot-scope="scope">
                      <el-popover
                        trigger="click"
                        placement="top"
                        width="450"
                        @show="getInfoForId(scope.row.ministerId)"
                      >
                        <!-- S -->
                        <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoDataAll}"></PersonalInfoDetail>
                        <!-- E -->
                        <div slot="reference" class="name-wrapper">
                          <el-button size="mini">{{scope.row.ministerName}}</el-button>
                        </div>
                      </el-popover>
                    </template>
                  </el-table-column>
                  <el-table-column label="副总经理" min-width="150">
                    <template slot-scope="scope">
                      <el-popover
                        trigger="click"
                        placement="top"
                        width="450"
                        @show="getInfoForId(scope.row.viceId)"
                      >
                        <!-- S -->
                        <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoDataAll}"></PersonalInfoDetail>
                        <!-- E -->
                        <div slot="reference" class="name-wrapper">
                          <el-button size="mini">{{scope.row.viceName}}</el-button>
                        </div>
                      </el-popover>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="companyArea"
                    label="所属区域"
                    min-width="150"
                    show-overflow-tooltip
                  ></el-table-column>
                  <el-table-column prop="repaymentMoneyTotal" label="还款总额" sortable min-width="100">
                    <template slot-scope="scope">{{scope.row.repaymentMoneyTotal | toThousands}}</template>
                  </el-table-column>
                  <el-table-column prop="returnMoneyTotal" label="核款总额" sortable min-width="100">
                    <template slot-scope="scope">{{scope.row.returnMoneyTotal | toThousands}}</template>
                  </el-table-column>
                  <el-table-column prop="assessmentStandardValue" label="考核达标值" min-width="100"></el-table-column>
                  <el-table-column
                    prop="rateReachingTheStandard"
                    label="达标率"
                    sortable
                    min-width="80"
                  ></el-table-column>
                  <el-table-column prop="performanceRanking" label="业绩排名" sortable min-width="80"></el-table-column>
                </el-table>
                <!-- 分页 -->
                <div id="pagination">
                  <el-pagination
                    @size-change="headmanHandleSizeChange"
                    @current-change="headmanHandlecurrentChange"
                    background
                    :current-page="headmanCurrent"
                    :page-sizes="[10,15,20,30,40]"
                    :page-size="headmanSize"
                    layout="total,sizes,prev,pager,next,jumper"
                    :total="headmanTotal"
                  ></el-pagination>
                </div>
              </div>
            </div>
            <!-- -----end------ -->
          </div>
        </el-tab-pane>
        <!-- 申诉记录 -->
        <el-tab-pane label="申诉记录" name="third">
          <div class="pull-left">
            <el-form :inline="true" :model="appealFormSearch">
              <el-form-item label="业务类型">
                <el-select
                  v-model="appealFormSearch.type"
                  placeholder="选择类型"
                  class="width155"
                  clearable
                >
                  <el-option
                    v-for="item in caseTypeOptions"
                    :key="item.typeId"
                    :label="item.typeName"
                    :value="item.typeId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="申诉日期">
                <el-date-picker
                  class="pull-right"
                  style="width:225px"
                  v-model="appealFormSearch.time"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="起始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="申诉原因">
                <el-select
                  v-model="appealFormSearch.reason"
                  placeholder="请选择"
                  class="width155"
                  clearable
                >
                  <el-option
                    v-for="item in reasonOptions"
                    :key="item.dic_type_values"
                    :label="item.dic_type_name"
                    :value="item.dic_type_values"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="appealSearch()">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="pull-right">
            <el-form>
              <el-form-item class="pull-right">
                <el-button @click="addperfoDissentPre()">业绩归属异议</el-button>
                <el-button
                  class="cloud-downloadBtn"
                  v-if="appealRecordExp"
                  @click="exportAppealData()"
                >
                  <i></i>&nbsp;导出
                </el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="tabWrap">
            <el-table
              :data="appealData"
              :height="height_3"
              border
              style="width:100%"
              :header-cell-style="{backgroundColor:'#e5e9f3'}"
              @sort-change="appealSortChange"
            >
              <el-table-column type="index" label="序号" min-width="50"></el-table-column>
              <el-table-column prop="payCasetypeChiName" label="业务类型" min-width="80"></el-table-column>
              <el-table-column prop="cardName" label="持卡人" min-width="80"></el-table-column>
              <el-table-column prop="cardIdnumber" label="身份证号" min-width="150"></el-table-column>
              <el-table-column prop="cardBackcard" label="银行卡号" min-width="150"></el-table-column>
              <el-table-column prop="payAmount" label="还款金额" min-width="100">
                <template slot-scope="scope">{{scope.row.payAmount | toThousands}}</template>
              </el-table-column>
              <el-table-column label="还款日期" min-width="100">
                <template
                  slot-scope="scope"
                >{{scope.row.payTime?scope.row.payTime.split(' ')[0]:'--'}}</template>
              </el-table-column>
              <el-table-column prop="finalAccountingRepayment" label="最终核款" min-width="100">
                <template slot-scope="scope">{{scope.row.finalAccountingRepayment | toThousands}}</template>
              </el-table-column>
              <el-table-column prop="createTime" label="申诉日期" sortable="custom" min-width="100">
                <template
                  slot-scope="scope"
                >{{scope.row.createTime?scope.row.createTime.split(' ')[0]:'--'}}</template>
              </el-table-column>
              <el-table-column prop="appealReasonName" label="申诉原因" min-width="170"></el-table-column>
              <el-table-column prop="amount" label="附件" width="100" fixed="right">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    @click="getPic(scope.row.imgId)"
                    v-if="scope.row.imgId"
                  >截图</el-button>
                  <el-button
                    type="text"
                    size="small"
                    @click="getVoice(scope.row.audioId)"
                    v-if="scope.row.audioId"
                  >录音</el-button>
                </template>
              </el-table-column>

              <!-- <el-table-column prop="amount" label="操作" width="100" fixed="right" v-if="userDep.deptName =='效果管理部'||userDep.deptName =='品质管理部'||userDep.deptName =='监察部'||userDep.deptName =='董事会'||userDep.deptName =='总裁办公会'"> -->
              <el-table-column
                prop="amount"
                label="操作"
                width="100"
                fixed="right"
                v-if="appealRecordOpe"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    v-if="scope.row.appealTatus==0"
                    @click="replyAppeal(scope.row.payId)"
                  >回复</el-button>
                  <el-button type="text" size="small" v-else disabled>结束</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="amount" label="操作" width="100" fixed="right" v-else>
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="getDissentDetail(scope.row.payId)">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div id="pagination">
              <el-pagination
                @size-change="appealHandleSizeChange"
                @current-change="appealHandlecurrentChange"
                background
                :current-page="appealCurrent"
                :page-sizes="[10,15,20,30,40]"
                :page-size="appealSize"
                layout="total,sizes,prev,pager,next,jumper"
                :total="appealTotal"
              ></el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <!-- <el-tab-pane label="团队业绩" name="four" :disabled="teamFlag"></el-tab-pane> -->
        <!-- <el-tab-pane label="团队业绩" name="four" v-if="team_performance_flag"> -->
        <el-tab-pane label="团队业绩" name="four" v-if="teamPerformanceTab">
          <!-- <div>团队业绩</div> -->
          <div class="clearfix">
            <el-form :inline="true" :model="teamFormSearch" class="pull-left">
              <el-form-item label="年月">
                <el-date-picker
                  class="width110"
                  v-model="teamFormSearch.batch"
                  type="month"
                  value-format="yyyy-MM"
                  :editable="false"
                  :clearable="false"
                  placeholder="选择月份"
                  @change="batchChange()"
                ></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-select
                  v-model="teamFormSearch.manager"
                  :disabled="manageDisable"
                  @change="getVice"
                  placeholder="总经理"
                  class="width130"
                  clearable
                >
                  <el-option
                    v-for="item in manageOptions"
                    :key="item.regid"
                    :label="item.userName"
                    :value="item.regid"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select
                  v-model="teamFormSearch.aManager"
                  :disabled="viceDisable"
                  @change="getMinister"
                  placeholder="副总经理"
                  class="width130"
                  clearable
                >
                  <el-option
                    v-for="item in viceOptions"
                    :key="item.regid"
                    :label="item.userName"
                    :value="item.regid"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select
                  v-model="teamFormSearch.minister"
                  :disabled="ministerDisable"
                  placeholder="部长"
                  class="width130"
                  clearable
                >
                  <el-option
                    v-for="item in ministerOptions"
                    :key="item.regid"
                    :label="item.userName"
                    :value="item.regid"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item class style="margin-right:0;">
                <el-button type="primary" @click="teamSearch()" icon="el-icon-search">搜索</el-button>
                <el-button icon="el-icon-search" @click="search_more=true">更多查询</el-button>
              </el-form-item>
            </el-form>
            <div class="pull-right">
              <el-button @click="createTeamRank()" v-if="teamPerformanceOpe">生成绩效排名</el-button>
              <!-- <el-button @click="createTeamRank()" v-if="team_performance_rank">生成绩效排名</el-button> -->
              <el-button class="cloud-downloadBtn" @click="teamExport()">
                <i></i>&nbsp;导出
              </el-button>
            </div>
          </div>
          <div class="tabWrap">
            <el-table
              :data="teamData"
              :height="height_3"
              show-summary
              :summary-method="getSummaries"
              border
              style="width:100%"
              :header-cell-style="{backgroundColor:'#e5e9f3'}"
            >
              <el-table-column type="index" label="序号" min-width="50"></el-table-column>
              <el-table-column prop="payCasetypeName" label="业务类型" min-width="100"></el-table-column>
              <el-table-column prop="companyArea" label="所属区域" min-width="170"></el-table-column>
              <el-table-column prop="positionCodeName" label="岗位" min-width="80"></el-table-column>
              <el-table-column label="姓名" min-width="150">
                <template slot-scope="scope">
                  <el-popover
                    trigger="click"
                    placement="top"
                    width="450"
                    @show="getInfoForAccount(scope.row.payOpernumber)"
                  >
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoDataAll}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.payOpername}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="员工编号" min-width="120">
                <template slot-scope="scope">
                  <span>{{scope.row.payOpernumber}}</span>
                  <i class="el-icon-phone tbIconPhone"></i>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="workerType" label="员工类型" ></el-table-column> -->
              <el-table-column prop="repaymentMoneyTotal" label="还款金额" sortable min-width="100">
                <template slot-scope="scope">{{scope.row.repaymentMoneyTotal | toThousands}}</template>
              </el-table-column>
              <el-table-column prop="convertTotal" label="业绩折算金额" sortable min-width="100">
                <template slot-scope="scope">{{scope.row.convertTotal | toThousands}}</template>
              </el-table-column>
              <el-table-column prop="shelveperTotal" label="业绩搁置金额" sortable min-width="100">
                <template slot-scope="scope">{{scope.row.shelveperTotal | toThousands}}</template>
              </el-table-column>
              <el-table-column prop="returnMoneyTotal" label="核款总额" sortable min-width="100">
                <template slot-scope="scope">{{scope.row.returnMoneyTotal | toThousands}}</template>
              </el-table-column>
              <el-table-column prop="expectedPerformanceCommission" label="预计团队总绩效" min-width="130">
                <template
                  slot-scope="scope"
                >{{scope.row.expectedPerformanceCommission | toThousands}}</template>
              </el-table-column>
              <el-table-column prop="performanceRanking" label="排名" sortable min-width="80"></el-table-column>
              <el-table-column prop="amount" label="操作" width="100" fixed="right">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="getTeamerData(scope.row)">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div id="pagination">
              <el-pagination
                @size-change="teamHandleSizeChange"
                @current-change="teamHandlecurrentChange"
                background
                :current-page="teamCurrent"
                :page-sizes="[10,15,20,30,40]"
                :page-size="teamSize"
                layout="total,sizes,prev,pager,next,jumper"
                :total="teamTotal"
              ></el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <!-- 个人业绩总台账 -->
        <!-- <el-tab-pane label="个人业绩总台账" name="five" :model="accountSearch" v-if="personalAccountTab">
          <div class="tbSearch clearfix">
            <el-form class="pull-left" :inline="true">
              <el-form-item label="年月">
                <el-date-picker class="width110" v-model="accountSearch.batch" type="month" :editable="false" :clearable="false" value-format="yyyy-MM" placeholder="年月">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="业务类型">
                <el-select v-model="accountSearch.payCasetype" placeholder="请选择" class="width155" clearable filterable>
                  <el-option v-for="item in caseTypeOptions" :key="item.typeId" :label="item.typeName" :value="item.typeId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="级别">
                <el-select v-model="accountSearch.userLevel" placeholder="请选择" class="width155" clearable filterable>
                  <el-option v-for="item in userLevelOptions" :key="item.typeId" :label="item.typeName" :value="item.typeId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="JS_accountSearch">搜索</el-button>
                <el-button icon="el-icon-search" @click="search_more_account=true">更多查询</el-button>
              </el-form-item>
            </el-form>
            <div class="pull-right">
              <el-dropdown @command="handleCommandPersonal" trigger="click">
                <el-button type="primary">
                  更多操作
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="a" class="cloud-downloadBtn">
                    <i></i>&nbsp;导出数据
                  </el-dropdown-item>
                  <el-dropdown-item command="b" divided :disabled="isLockFlag">生成业绩总台账</el-dropdown-item>
                  <el-dropdown-item command="c" divided><i class="el-icon-refresh"></i>重置提交</el-dropdown-item>
                  <el-dropdown-item command="d" divided>批量忽略</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>&nbsp;
              <el-button size="small" v-if="isLockFlag" @click="JS_cancel_submit">取消上报</el-button>
              <el-button size="small" v-else @click="JS_report_data" type="danger">上报数据</el-button>
            </div>
          </div>

          <div class="table_wrap">
            <el-table :data="accountData" :height="height_4" v-loading="accountLoading" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
              <el-table-column type="index" label="序号" min-width="50"></el-table-column>
              <el-table-column label="姓名" min-width="150">
                <template slot-scope="scope">
                  <el-popover trigger="click" placement="top" width="450" @show="getInfoForAccount(scope.row.employedNo)">
                   
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoDataAll}"></PersonalInfoDetail>
                   
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.userName}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="级别" min-width="100">
                <template slot-scope="scope">
                  <span v-if="scope.row.userLevel == '0'">组员</span>
                  <span v-else-if="scope.row.userLevel == '1'">组长</span>
                  <span v-else-if="scope.row.userLevel =='2'">部长</span>
                  <span v-else-if="scope.row.userLevel == '3'">副总</span>
                  <span v-else-if="scope.row.userLevel == '4'">总经理</span>
                  <span v-else>总裁办公会</span>
                </template>
              </el-table-column>
              <el-table-column prop="caseTypeName" label="业务类型" min-width="100"></el-table-column>
              <el-table-column label="员工编号" min-width="150">
                <template slot-scope="scope">
                  <span>{{scope.row.employedNo}}</span>
                  <i class="el-icon-phone tbIconPhone"></i>
                </template>
              </el-table-column>
              <el-table-column prop="idcard" label="身份证号" min-width="160"></el-table-column>
              <el-table-column label="还款金额" min-width="100">
                <template slot-scope="scope">{{scope.row.repaymentPersonTotal | toThousands}}</template>
              </el-table-column>
              <el-table-column label="差异额" min-width="100">
                <template slot-scope="scope">{{scope.row.repaymentDiffPersonTotal | toThousands}}</template>
              </el-table-column>
              <el-table-column label="折算总额" min-width="100">
                <template slot-scope="scope">{{scope.row.convertPersonTotal | toThousands}}</template>
              </el-table-column>
              <el-table-column label="搁置总额" min-width="100">
                <template slot-scope="scope">{{scope.row.shelveperPersonTotal | toThousands}}</template>
              </el-table-column>
              <el-table-column label="核款总额" min-width="100">
                <template slot-scope="scope">{{scope.row.returnMoneyPersonTotal | toThousands}}</template>
              </el-table-column>
              <el-table-column label="个人总绩效" min-width="90">
                <template slot-scope="scope">{{scope.row.personalExtract | toThousands}}</template>
              </el-table-column>
              <el-table-column label="团队业绩" min-width="90">
                <template slot-scope="scope">{{scope.row.returnMoneyTeamTotal | toThousands}}</template>
              </el-table-column>
              <el-table-column label="团队绩效提成" min-width="100">
                <template slot-scope="scope">{{scope.row.teamExtract | toThousands}}</template>
              </el-table-column>
              <el-table-column prop="finalAccountingRepayment" label="绩效计提" min-width="90">
                <template slot-scope="scope">{{scope.row.achieveMoney | toThousands}}</template>
              </el-table-column>
              <el-table-column prop="finalAccountingRepayment" label="提交状态" min-width="170">
                <template slot="header">
                  <el-select v-model="bsubmitValue" filterable placeholder="提交状态" clearable style="width:150px;" @change="bsubmitChange" class="selectRepairIcon">
                    <el-option v-for="item in bsubmitOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </template>
                <template slot-scope="scope">
                  <span style="color:red" v-if="scope.row.boolCommit === '0'">未提交</span>
                  <span v-if="scope.row.boolCommit === '1'">已提交</span>
                  <span style="color:#EF3838;" v-if="scope.row.boolCommit==='2'">
                    <el-tooltip v-if="scope.row.errorMsg" class="item" effect="dark" :content="scope.row.errorMsg" placement="top">
                      <span>提交失败</span>
                    </el-tooltip>
                    <span v-else>
                      提交失败
                    </span>
                  </span>
                  <span v-if="scope.row.boolCommit==='3'">忽略提交</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" min-width="220" fixed="right">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.boolCommit==='2'" type="text" size="small" :disabled="isLockFlag" @click="ignoreSubmit(scope.row.id)">忽略提交</el-button>
                  <el-button v-if="scope.row.boolCommit==='3'" type="text" size="small" :disabled="isLockFlag" @click="cancelIgnore(scope.row.id)">取消忽略</el-button>
                  <el-button v-if="scope.row.boolCommit=='1'" type="text" size="small" disabled>暂无操作</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div style="margin-top:10px">
              <el-alert :title="accountAmt" type="success" :closable="false"></el-alert>
            </div>
           
            <div id="pagination">
              <el-pagination @size-change="accountSizeChange" @current-change="accountCurrentChange" background :current-page="accountCurrent" :page-sizes="[10,15,20,30,40]" :page-size="accountSize" layout="total,sizes,prev,pager,next,jumper" :total="accountTotal">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>-->
        <!-- 生成业绩总台帐 666-->
        <el-tab-pane label="生成业绩总台帐" name="six" v-if="buildAccountTab">
          <div class="tbSearch clearfix">
            <el-form class="pull-left" :inline="true">
              <el-form-item label="所属年月">
                <el-date-picker
                  class="width110"
                  @change="yoho()"
                  v-model="BAbatch"
                  type="month"
                  :editable="false"
                  :clearable="false"
                  value-format="yyyy-MM"
                  placeholder="年月"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="版本状态">
                <el-select
                  v-model="buildAccountSearch.afterBranch"
                  placeholder="- 所有 -"
                  class="width180"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="item in buildDifOptions2"
                    :key="item.key"
                    :label="item.value"
                    :value="item.key"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="JS_BA_search('1')">搜索</el-button>
                <el-button icon="el-icon-search" @click="search_more_BA=true">更多查询</el-button>
                <!-- 111 -->
              </el-form-item>
            </el-form>
            <div class="pull-right">
              <el-button
                type="primary"
                style="margin-right: 10px;"
                @click="buildAccountFlag=true"
              >生成业绩总台账</el-button>
              <el-dropdown @command="handleCommandBA" trigger="click">
                <el-button type="primary">
                  <!-- 生成业绩总台账 -->
                  更多操作
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="a" :disabled="BADisabled">批量忽略</el-dropdown-item>
                  <el-dropdown-item command="b" :disabled="BADisabled" divided>重置提交</el-dropdown-item>
                  <el-dropdown-item command="c" divided>导出</el-dropdown-item>
                  <!-- <el-dropdown-item command="d" divided>查看绩效公式</el-dropdown-item> -->
                </el-dropdown-menu>
              </el-dropdown>
              <el-button
                size="small"
                type="danger"
                style="margin-left: 10px;"
                @click="update_BA()"
                v-if="!BADisabled"
              >上报数据</el-button>
              <el-button
                size="small"
                v-else
                style="margin-left: 10px;"
                @click="cancel_updateBA()"
              >取消上报</el-button>
            </div>
          </div>
          <div class="table_wrap">
            <el-table
              :data="BAData"
              :height="height_3"
              show-summary
              :summary-method="getSummariesBA"
              v-loading="BALoading"
              border
              style="width:100%"
              :header-cell-style="{backgroundColor:'#e5e9f3'}"
            >
              <el-table-column type="index" label="序号" min-width="50"></el-table-column>
              <el-table-column prop="calcDate" label="所属年月" width="100"></el-table-column>
              <el-table-column prop="branchInfo" label="版本状态" width="180"></el-table-column>
              <el-table-column label="姓名" min-width="150">
                <template slot-scope="scope">
                  <el-popover
                    trigger="click"
                    placement="top"
                    width="450"
                    @show="getInfoForAccount(scope.row.employedNo)"
                  >
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoDataAll}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.userName}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="级别" min-width="100">
                <template slot-scope="scope">
                  <span v-if="scope.row.userLevel == '0'">组员</span>
                  <span v-else-if="scope.row.userLevel == '1'">组长</span>
                  <span v-else-if="scope.row.userLevel =='2'">部长</span>
                  <span v-else-if="scope.row.userLevel == '3'">副总</span>
                  <span v-else-if="scope.row.userLevel == '4'">总经理</span>
                  <span v-else>总裁办公会</span>
                </template>
              </el-table-column>
              <el-table-column prop="caseTypeName" label="业务类型" min-width="100"></el-table-column>
              <el-table-column prop="employedNo" label="员工编号" min-width="150"></el-table-column>
              <el-table-column prop="mobilePhone" label="手机号码" min-width="160"></el-table-column>
              <el-table-column label="还款总额" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">{{scope.row.repaymentPersonTotal | toThousands}}</template>
              </el-table-column>
              <el-table-column label="结佣总额" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">{{scope.row.commissionPersonTotal | toThousands}}</template>
              </el-table-column>
              <el-table-column label="差异额" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">{{scope.row.repaymentDiffPersonTotal | toThousands}}</template>
              </el-table-column>
              <el-table-column label="折算后总额" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">{{scope.row.convertPersonTotal | toThousands}}</template>
              </el-table-column>
              <el-table-column label="搁置总额" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">{{scope.row.shelveperPersonTotal | toThousands}}</template>
              </el-table-column>
              <el-table-column label="个人核款总额" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">{{scope.row.returnMoneyPersonTotal | toThousands}}</template>
              </el-table-column>
              <el-table-column label="个人提成" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">{{scope.row.personalExtract | toThousands}}</template>
              </el-table-column>
              <el-table-column label="团队回款" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">{{scope.row.repaymentTeamTotal | toThousands}}</template>
              </el-table-column>
              <el-table-column label="团队提成" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">{{scope.row.teamExtract | toThousands}}</template>
              </el-table-column>
              <el-table-column label="绩效计提" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">{{scope.row.achieveMoney | toThousands}}</template>
              </el-table-column>
              <el-table-column label="提交状态" min-width="100">
                <template slot-scope="scope">
                  <span style="color:red" v-if="scope.row.boolCommit === '0'">未提交</span>
                  <span v-if="scope.row.boolCommit === '1'">已提交</span>
                  <span style="color:#EF3838;" v-if="scope.row.boolCommit==='2'">
                    <el-tooltip
                      v-if="scope.row.errorMsg"
                      class="item"
                      effect="dark"
                      :content="scope.row.errorMsg"
                      placement="top"
                    >
                      <span>提交失败</span>
                    </el-tooltip>
                    <span v-else>提交失败</span>
                  </span>
                  <span v-if="scope.row.boolCommit==='3'">忽略提交</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" min-width="150" fixed="right">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="setItem(scope.row)">明细</el-button>
                  <el-button type="text" size="small" @click="seeGongshi(scope.row)">公式</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div id="pagination">
              <el-pagination
                @size-change="BASizeChange"
                @current-change="BACurrentChange"
                background
                :current-page="BACurrent"
                :page-sizes="[10,15,20,30,40]"
                :page-size="BASize"
                layout="total,sizes,prev,pager,next,jumper"
                :total="BATotal"
              ></el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <!-- 777 -->
        <el-tab-pane label="导入业绩总台帐" name="seven" v-if="importAccountTab">
          <div class="tbSearch clearfix">
            <el-form class="pull-left" :inline="true">
              <el-form-item label="所属年月">
                <el-date-picker
                  class="width110"
                  v-model="importAccountSearch.batch"
                  type="month"
                  :editable="false"
                  :clearable="false"
                  value-format="yyyy-MM"
                  placeholder="年月"
                ></el-date-picker>
              </el-form-item>
              <!-- <el-form-item label="版本">
                <el-input v-model="IARelease" placeholder="暂无版本" disabled class="width170"></el-input>
              </el-form-item>-->
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="JS_IASearch()">搜索</el-button>
                <el-button icon="el-icon-search" @click="search_more_IA=true">更多查询</el-button>
              </el-form-item>
            </el-form>
            <div class="pull-right">
              <el-button
                type="primary"
                style="margin-right: 10px;"
                @click="importAccountModal=true"
                :disabled="IADisabled"
              >导入业绩总台账</el-button>
              <el-dropdown trigger="click" @command="handleCommandIA">
                <el-button type="primary">
                  更多操作
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="a" :disabled="IADisabled">批量忽略</el-dropdown-item>
                  <el-dropdown-item command="b" divided :disabled="IADisabled">重置提交</el-dropdown-item>
                  <el-dropdown-item command="c" divided>导出</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-button
                size="small"
                type="danger"
                style="margin-left: 10px;"
                @click="update_IA()"
                v-if="!IADisabled"
              >上报数据</el-button>
              <el-button
                size="small"
                style="margin-left: 10px;"
                v-else
                @click="cancel_updateIA()"
              >取消上报</el-button>
            </div>
          </div>
          <div class="table_wrap">
            <el-table
              :data="IAData"
              :height="height_3"
              show-summary
              :summary-method="getSummariesIA"
              v-loading="IALoading"
              border
              style="width:100%"
              :header-cell-style="{backgroundColor:'#e5e9f3'}"
            >
              <el-table-column type="index" label="序号" min-width="50"></el-table-column>
              <el-table-column prop="calcDate" label="所属年月" width="100"></el-table-column>
              <el-table-column prop="branchInfo" label="版本状态" width="180"></el-table-column>
              <el-table-column label="姓名" min-width="150">
                <template slot-scope="scope">
                  <el-popover
                    trigger="click"
                    placement="top"
                    width="450"
                    @show="getInfoForAccount(scope.row.employedNo)"
                  >
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoDataAll}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.userName}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="级别" min-width="100">
                <template slot-scope="scope">
                  <span v-if="scope.row.userLevel == '0'">组员</span>
                  <span v-else-if="scope.row.userLevel == '1'">组长</span>
                  <span v-else-if="scope.row.userLevel =='2'">部长</span>
                  <span v-else-if="scope.row.userLevel == '3'">副总</span>
                  <span v-else-if="scope.row.userLevel == '4'">总经理</span>
                  <span v-else-if="scope.row.userLevel == '5'">总裁办公会</span>
                  <span v-else>--</span>
                </template>
              </el-table-column>
              <el-table-column prop="caseTypeName" label="业务类型" min-width="100"></el-table-column>
              <el-table-column prop="employedNo" label="员工编号" min-width="150"></el-table-column>
              <el-table-column prop="mobilePhone" label="平台号码" min-width="160"></el-table-column>
              <el-table-column prop="idNumber" label="身份证号" min-width="160"></el-table-column>
              <el-table-column label="还款总额" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">{{scope.row.repaymentPersonTotal | toThousands}}</template>
              </el-table-column>
              <el-table-column label="结佣总额" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">{{scope.row.commissionPersonTotal | toThousands}}</template>
              </el-table-column>
              <el-table-column label="差异额" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">{{scope.row.repaymentDiffPersonTotal | toThousands}}</template>
              </el-table-column>
              <el-table-column label="折算后总额" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">{{scope.row.convertPersonTotal | toThousands}}</template>
              </el-table-column>
              <el-table-column label="搁置总额" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">{{scope.row.shelveperPersonTotal | toThousands}}</template>
              </el-table-column>
              <el-table-column label="个人核款总额" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">{{scope.row.returnMoneyPersonTotal | toThousands}}</template>
              </el-table-column>
              <el-table-column label="个人提成" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">{{scope.row.personalExtract | toThousands}}</template>
              </el-table-column>
              <el-table-column label="团队回款" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">{{scope.row.repaymentTeamTotal | toThousands}}</template>
              </el-table-column>
              <el-table-column label="团队提成" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">{{scope.row.teamExtract | toThousands}}</template>
              </el-table-column>
              <el-table-column label="绩效计提" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">{{scope.row.achieveMoney | toThousands}}</template>
              </el-table-column>
              <el-table-column label="提交状态" min-width="100">
                <template slot-scope="scope">
                  <span style="color:red" v-if="scope.row.boolCommit === '0'">未提交</span>
                  <span v-if="scope.row.boolCommit === '1'">已提交</span>
                  <span style="color:#EF3838;" v-if="scope.row.boolCommit==='2'">
                    <el-tooltip
                      v-if="scope.row.errorMsg"
                      class="item"
                      effect="dark"
                      :content="scope.row.errorMsg"
                      placement="top"
                    >
                      <span>提交失败</span>
                    </el-tooltip>
                    <span v-else>提交失败</span>
                  </span>
                  <span v-if="scope.row.boolCommit==='3'">忽略提交</span>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div id="pagination">
              <el-pagination
                @size-change="IASizeChange"
                @current-change="IACurrentChange"
                background
                :current-page="IACurrent"
                :page-sizes="[10,15,20,30,40]"
                :page-size="IASize"
                layout="total,sizes,prev,pager,next,jumper"
                :total="IATotal"
              ></el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <!-- 888 -->
        <el-tab-pane label="差异额对比" name="eight" v-if="diffsTab">
          <div class="tbSearch clearfix">
            <el-form class="pull-left" :inline="true">
              <el-form-item label="年月">
                <el-date-picker
                  class="width110"
                  v-model="yearMonth"
                  type="month"
                  @change="yoka()"
                  :editable="false"
                  :clearable="false"
                  value-format="yyyy-MM"
                  placeholder="年月"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="上报版">
                <el-select
                  v-model="diffsSearch.beforeBranch"
                  placeholder="- 所有 -"
                  class="width180"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="item in updateDifOptions"
                    :key="item.key"
                    :label="item.value"
                    :value="item.key"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="副本">
                <el-select
                  v-model="diffsSearch.afterBranch"
                  placeholder="- 所有 -"
                  class="width180"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="item in buildDifOptions"
                    :key="item.key"
                    :label="item.value"
                    :value="item.key"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="js_dif_search">搜索</el-button>
              </el-form-item>
            </el-form>
            <div class="pull-right">
              <el-button type="primary" @click="doCalculate()">计算差异额</el-button>
              <el-button @click="exportDifData()">导出</el-button>
            </div>
          </div>
          <div class="table_wrap">
            <el-table
              :data="diffsData"
              :height="height_3"
              v-loading="diffsLoading"
              border
              style="width:100%"
              :header-cell-style="{backgroundColor:'#e5e9f3'}"
            >
              <el-table-column type="index" label="序号" min-width="50"></el-table-column>
              <el-table-column prop="calcDate" label="所属年月" width="100"></el-table-column>
              <!-- <el-table-column type="index" label="版本状态?" width="100"></el-table-column> -->
              <el-table-column label="姓名" min-width="150">
                <template slot-scope="scope">
                  <el-popover
                    trigger="click"
                    placement="top"
                    width="450"
                    @show="getInfoForAccount(scope.row.employedNo)"
                  >
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoDataAll}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.userName}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="级别" min-width="100">
                <template slot-scope="scope">
                  <span v-if="scope.row.userLevel == '0'">组员</span>
                  <span v-else-if="scope.row.userLevel == '1'">组长</span>
                  <span v-else-if="scope.row.userLevel =='2'">部长</span>
                  <span v-else-if="scope.row.userLevel == '3'">副总</span>
                  <span v-else-if="scope.row.userLevel == '4'">总经理</span>
                  <span v-else-if="scope.row.userLevel == '5'">总裁办公会</span>
                  <span v-else>--</span>
                </template>
              </el-table-column>
              <el-table-column prop="caseTypeName" label="业务类型" min-width="100"></el-table-column>
              <el-table-column prop="employedNo" label="员工编号" min-width="150"></el-table-column>
              <el-table-column prop="mobilePhone" label="手机号码" min-width="160"></el-table-column>
              <el-table-column prop="beforeAchieveMoney" label="上报版绩效计提" min-width="160"></el-table-column>
              <el-table-column prop="afterAchieveMoney" label="副本绩效计提" min-width="160"></el-table-column>
              <el-table-column prop="diffMoney" label="差异额" min-width="160"></el-table-column>
            </el-table>
            <!-- 分页 -->
            <div id="pagination">
              <el-pagination
                @size-change="diffsSizeChange"
                @current-change="diffsCurrentChange"
                background
                :current-page="diffsCurrent"
                :page-sizes="[10,15,20,30,40]"
                :page-size="diffsSize"
                layout="total,sizes,prev,pager,next,jumper"
                :total="diffsTotal"
              ></el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <!-- 餐房补名单管理 999 -->
        <el-tab-pane label="餐房补名单管理" name="nine" v-if="mealHouseTab">
          <div class="tbSearch clearfix">
            <el-form class="pull-left" :inline="true">
              <el-form-item label="所属年月">
                <el-date-picker
                  class="width110"
                  v-model="MHListSearch.batch"
                  type="month"
                  :editable="false"
                  :clearable="false"
                  value-format="yyyy-MM"
                  placeholder="年月"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="姓名">
                <el-input
                  v-model="MHListSearch.userName"
                  placeholder="请输入名字"
                  @keyup.enter.native="JS_mealSearch"
                  clearable
                  class="width130"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="js_MH_search">搜索</el-button>
              </el-form-item>
            </el-form>
            <div class="pull-right">
              <el-button @click="mealHouseModal=true">导入</el-button>
            </div>
          </div>
          <div class="table_wrap">
            <el-table
              :data="MHData"
              :height="height_3"
              v-loading="MHloading"
              border
              style="width:100%"
              :header-cell-style="{backgroundColor:'#e5e9f3'}"
            >
              <el-table-column type="index" label="序号" min-width="50"></el-table-column>
              <el-table-column prop="batch" label="所属年月" width="100"></el-table-column>
              <el-table-column label="姓名" min-width="150">
                <template slot-scope="scope">
                  <el-popover
                    trigger="click"
                    placement="top"
                    width="450"
                    @show="getInfoForAccount(scope.row.employeeNo)"
                  >
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoDataAll}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.userName}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>

              <el-table-column prop="employeeNo" label="员工编号" min-width="150"></el-table-column>
              <el-table-column prop="mobilePhone" label="手机号码" min-width="160"></el-table-column>
              <el-table-column label="操作人" min-width="160">
                <template slot-scope="scope">
                  <el-popover
                    trigger="click"
                    placement="top"
                    width="450"
                    @show="getInfoForId(scope.row.updateUser)"
                    v-if="scope.row.updateUser"
                  >
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoDataAll}"></PersonalInfoDetail>
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
                    <PersonalInfoDetail :personalInfoObj="{personalInfo:personalInfoDataAll}"></PersonalInfoDetail>
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.createUserName}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="操作时间" min-width="160">
                <template slot-scope="scope">
                  <span v-if="scope.row.updateTime">{{scope.row.updateTime}}</span>
                  <span v-else>{{scope.row.createTime}}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" min-width="80" fixed="right">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    class="deleteTxt"
                    @click="deleteMH(scope.row.id)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div id="pagination">
              <el-pagination
                @size-change="MHSizeChange"
                @current-change="MHCurrentChange"
                background
                :current-page="MHCurrent"
                :page-sizes="[10,15,20,30,40]"
                :page-size="MHSize"
                layout="total,sizes,prev,pager,next,jumper"
                :total="MHTotal"
              ></el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="还款导入" name="ten" v-if="reimbImport">
          <ReimbImport v-if="activeName==='ten'" :dataInfo="dataInfo" />
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 团队业绩更多查询弹框 -->
    <el-dialog title="更多查询" :close-on-click-modal="false" :visible.sync="search_more" width="650px">
      <el-form :inline="true" :model="formSearch" class="mar-no" label-width="120px">
        <el-form-item label="业务类型">
          <el-select v-model="formSearch.payCasetype" placeholder="请选择" class="width155" clearable>
            <el-option
              v-for="item in caseTypeOptions"
              :key="item.typeId"
              :label="item.typeName"
              :value="item.typeId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属区域">
          <el-select v-model="formSearch.companyArea" placeholder="请选择" class="width155" clearable>
            <el-option
              v-for="item in areaOptions"
              :key="item.areaId"
              :label="item.areaName"
              :value="item.areaName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="员工编号">
          <el-input v-model="formSearch.payOpernumber" placeholder="请输入" class="width155" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="search_more = false">取消</el-button>
        <el-button type="primary" @click="teamSearch(),search_more = false">立即搜索</el-button>
      </span>
    </el-dialog>
    <!-- 台账 更多查询  ***删除-->
    <!-- <el-dialog title="更多查询" :close-on-click-modal="false" :visible.sync="search_more_account" width="650px">
      <el-form :inline="true" :model="accountMoreSearch" class="mar-no" label-width="120px">
        <el-form-item label="姓名">
          <el-input v-model.trim="accountMoreSearch.name" placeholder="请输入名字" class="width155" clearable></el-input>
        </el-form-item>
        <el-form-item label="员工编号">
          <el-input-number v-model="accountMoreSearch.employedNo" placeholder="请输入编号" class="width155" :controls="false" :min="0" :max="10000000000" clearable></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="search_more_account = false">取消</el-button>
        <el-button type="primary" @click="search_more_account = false">立即搜索</el-button>
      </span>
    </el-dialog>-->

    <!-- 个人业绩详情 -->
    <el-dialog
      title="个人业绩详情"
      :close-on-click-modal="false"
      :visible.sync="perfoDetail"
      width="830px"
    >
      <p class="pReset">案件基本情况</p>
      <el-row class="textLft">
        <el-col :span="3" class="height26">业务类型：</el-col>
        <el-col :span="5" class="height26">{{perfoBaseDetail.payCasetypeName}}</el-col>
        <el-col :span="3" class="height26">持卡人：</el-col>
        <el-col :span="5" class="height26">{{perfoBaseDetail.cardName}}</el-col>
        <el-col :span="3" class="height26">身份证号：</el-col>
        <el-col :span="5" class="height26">{{perfoBaseDetail.cardIdnumber}}</el-col>
        <el-col :span="3" class="height26">银行卡号：</el-col>
        <el-col :span="5" class="height26">{{perfoBaseDetail.cardBackcard}}</el-col>
        <el-col :span="3" class="height26">还款金额：</el-col>
        <el-col :span="5" class="height26">{{perfoBaseDetail.payAmount| toThousands}}</el-col>
        <el-col :span="3" class="height26">还款日期：</el-col>
        <el-col
          :span="5"
          class="height26"
        >{{perfoBaseDetail.payTime?perfoBaseDetail.payTime.split(' ')[0]:'--'}}</el-col>
        <!-- <el-col :span="5" class="height26">{{perfoBaseDetail.payTime.split(' ')[0]}}</el-col> -->
        <el-col :span="3" class="height26">折算比例：</el-col>
        <el-col :span="5" class="height26">
          <span style="color:red">{{perfoBaseDetail.rebateRatio}}</span>
        </el-col>
        <el-col :span="3" class="height26">搁置比例：</el-col>
        <el-col :span="5" class="height26">{{perfoBaseDetail.shelveRatio}}</el-col>
        <el-col :span="3" class="height26">折算原因：</el-col>
        <el-col :span="5" class="height26">{{perfoBaseDetail.rebateReason}}</el-col>
        <el-col :span="3" class="height26">结佣金额：</el-col>
        <el-col :span="5" class="height26">{{perfoBaseDetail.commisionMoney| toThousands}}</el-col>
        <el-col :span="3" class="height26">最终核款：</el-col>
        <el-col :span="5" class="height26">{{perfoBaseDetail.finalAccountingRepayment| toThousands}}</el-col>
        <el-col :span="3" class="height26">搁置原因：</el-col>
        <el-col :span="5" class="height26">{{perfoBaseDetail.shelveReason}}</el-col>
        <el-col :span="3" class="height26">不予核算原因：</el-col>
        <el-col :span="5" class="height26">无</el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="perfoDetail = false,complainDialog=true">我要申诉</el-button>
        <el-button type="primary" @click="perfoDetail = false">返回</el-button>
      </span>
    </el-dialog>

    <!-- 我要申诉 -->
    <el-dialog
      title="我要申诉"
      :close-on-click-modal="false"
      :visible.sync="complainDialog"
      width="860px"
      class="grayBg"
      :before-close="complainDialogClose"
    >
      <el-dialog width="30%" title="申诉成功" :visible.sync="innerVisible" append-to-body>
        <span>预计1~2个工作日内处理完成，请耐心等待!</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="appeal_save('appealForm')">确定</el-button>
        </span>
      </el-dialog>
      <div class="whiteBox">
        <p class="pReset">案件基本情况</p>
        <el-row class="textLft">
          <el-col :span="3" class="height26">业务类型：</el-col>
          <el-col :span="5" class="height26">{{perfoBaseDetail.payCasetypeName}}</el-col>
          <el-col :span="3" class="height26">持卡人：</el-col>
          <el-col :span="5" class="height26">{{perfoBaseDetail.cardName}}</el-col>
          <el-col :span="3" class="height26">身份证号：</el-col>
          <el-col :span="5" class="height26">{{perfoBaseDetail.cardIdnumber}}</el-col>
          <el-col :span="3" class="height26">银行卡号：</el-col>
          <el-col :span="5" class="height26">{{perfoBaseDetail.cardBackcard}}</el-col>
          <el-col :span="3" class="height26">还款金额：</el-col>
          <el-col :span="5" class="height26">{{perfoBaseDetail.payAmount| toThousands}}</el-col>
          <el-col :span="3" class="height26">还款日期：</el-col>
          <el-col
            :span="5"
            class="height26"
          >{{perfoBaseDetail.payTime?perfoBaseDetail.payTime.split(' ')[0]:'--'}}</el-col>
          <el-col :span="3" class="height26">折算比例：</el-col>
          <el-col :span="5" class="height26">
            <span style="color:red">{{perfoBaseDetail.rebateRatio}}</span>
          </el-col>
          <el-col :span="3" class="height26">搁置比例：</el-col>
          <el-col :span="5" class="height26">{{perfoBaseDetail.shelveRatio}}</el-col>
          <el-col :span="3" class="height26">折算原因：</el-col>
          <el-col :span="5" class="height26">{{perfoBaseDetail.rebateReason}}</el-col>
          <el-col :span="3" class="height26">结佣金额：</el-col>
          <el-col :span="5" class="height26">{{perfoBaseDetail.commisionMoney| toThousands}}</el-col>
          <el-col :span="3" class="height26">最终核款：</el-col>
          <el-col
            :span="5"
            class="height26"
          >{{perfoBaseDetail.finalAccountingRepayment| toThousands}}</el-col>
          <el-col :span="3" class="height26">搁置原因：</el-col>
          <el-col :span="5" class="height26">{{perfoBaseDetail.shelveReason}}</el-col>
          <el-col :span="3" class="height26">不予核算原因：</el-col>
          <el-col :span="5" class="height26">无</el-col>
        </el-row>
      </div>
      <div class="whiteBox">
        <p class="pReset">申诉内容</p>
        <el-row class="textLft">
          <el-form :model="appealForm" :rules="appealFormRule" ref="appealForm">
            <el-col :span="4" class="height26">请选择申诉原因：</el-col>
            <el-col :span="20" class="height26">
              <el-form-item prop="checkList">
                <el-checkbox-group v-model="appealForm.checkList">
                  <el-checkbox label="还款金额有误"></el-checkbox>
                  <el-checkbox label="折算比例有误"></el-checkbox>
                  <el-checkbox label="搁置比例有误"></el-checkbox>
                  <el-checkbox label="绩效有误"></el-checkbox>
                  <el-checkbox label="业绩归属有误"></el-checkbox>
                  <el-checkbox label="其它"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :span="4" class="height26 mgt10">原因描述：</el-col>
            <el-col :span="20" class="mgt10">
              <el-form-item prop="content">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 2}"
                  placeholder="请输入内容"
                  resize="none"
                  v-model="appealForm.content"
                  style="width:100%;"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-form>
          <el-col :span="23" :offset="1" class="mgt10">
            <el-upload
              class="uploadLine"
              :action="uploadActionUrl"
              :headers="headers"
              :on-success="handleSuccess3"
              :before-remove="beforeRemove3"
              :before-upload="beforeUploadPic"
              :limit="1"
              :file-list="fileList"
            >
              <el-button size="small">上传截图</el-button>
            </el-upload>
          </el-col>
          <el-col :span="23" :offset="1" class="mgt10">
            <el-upload
              class="uploadLine"
              :action="uploadActionUrl"
              :headers="headers"
              :on-success="handleSuccess4"
              :before-remove="beforeRemove4"
              :before-upload="beforeUploadVoice"
              :limit="1"
              :file-list="fileList"
            >
              <el-button size="small">上传录音</el-button>
            </el-upload>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="reset('appealForm')">取消</el-button>
        <el-button type="primary" @click="appeal_sure('appealForm')">确定</el-button>
      </span>
    </el-dialog>

    <!-- 申诉详情 -->
    <el-dialog
      title="申诉详情"
      :close-on-click-modal="false"
      :visible.sync="complainDetail"
      width="860px"
      class="grayBg"
    >
      <div class="whiteBox">
        <p class="pReset">案件基本情况</p>
        <el-row class="textLft">
          <el-col :span="3" class="height26">业务类型：</el-col>
          <el-col :span="5" class="height26">{{complainDetailData.payCasetypeName}}</el-col>
          <el-col :span="3" class="height26">持卡人姓名：</el-col>
          <el-col :span="5" class="height26">{{complainDetailData.cardName}}</el-col>
          <el-col :span="3" class="height26">身份证号：</el-col>
          <el-col :span="5" class="height26">{{complainDetailData.cardIdnumber}}</el-col>
          <el-col :span="3" class="height26">银行卡号：</el-col>
          <el-col :span="5" class="height26">{{complainDetailData.cardBackcard}}</el-col>
          <el-col :span="3" class="height26">还款金额：</el-col>
          <el-col :span="5" class="height26">{{complainDetailData.payAmount| toThousands}}</el-col>
          <el-col :span="3" class="height26">还款日期：</el-col>
          <el-col
            :span="5"
            class="height26"
          >{{complainDetailData.payTime?complainDetailData.payTime.split(' ')[0]:'--'}}</el-col>
          <el-col :span="3" class="height26">折算比例：</el-col>
          <el-col :span="5" class="height26">
            <span style="color:red">{{complainDetailData.rebateRatio}}</span>
          </el-col>
          <el-col :span="3" class="height26">折算原因：</el-col>
          <el-col :span="5" class="height26">{{complainDetailData.rebateReason}}</el-col>
          <el-col :span="3" class="height26">搁置比例：</el-col>
          <el-col :span="5" class="height26">{{complainDetailData.shelveRatio}}</el-col>
          <el-col :span="3" class="height26">搁置原因：</el-col>
          <el-col :span="5" class="height26">{{complainDetailData.shelveReason}}</el-col>
          <el-col :span="3" class="height26">绩效：</el-col>
          <el-col :span="5" class="height26">{{complainDetailData.payAmount| toThousands}}</el-col>
          <el-col :span="3" class="height26">不予核算原因：</el-col>
          <el-col :span="5" class="height26">无</el-col>
          <el-col :span="3" class="height26">最终核款：</el-col>
          <el-col
            :span="5"
            class="height26"
          >{{complainDetailData.finalAccountingRepayment| toThousands}}</el-col>
        </el-row>
      </div>
      <div class="whiteBox">
        <p class="pReset">申诉内容</p>
        <el-row class="textLft">
          <el-col :span="4" class="height26">申诉原因：</el-col>
          <el-col :span="20" class="height26">{{complainDetailData.appealReasonName}}</el-col>
          <el-col :span="4" class="height26 mgt10">原因描述：</el-col>
          <el-col :span="20" class="height26 mgt10">{{complainDetailData.appealContent}}</el-col>
          <el-col :span="4" class="height26 mgt10">附件：</el-col>
          <el-col :span="20" class="height26 mgt10">
            <el-button @click="getPic(complainDetailData.imgId)" v-if="complainDetailData.imgId">截图</el-button>
            <el-button
              @click="getVoice(complainDetailData.audioId)"
              v-if="complainDetailData.audioId"
            >录音</el-button>
          </el-col>
          <el-col :span="4" class="height26 mgt10">申诉人：</el-col>
          <el-col :span="20" class="height26 mgt10">{{complainDetailData.createUserName}}</el-col>
          <el-col :span="4" class="height26 mgt10">申诉时间：</el-col>
          <el-col :span="20" class="height26 mgt10">{{complainDetailData.createTime}}</el-col>
        </el-row>
      </div>
      <div class="whiteBox">
        <p class="pReset">处理结果</p>
        <!-- 无处理结果为以下样式 -->
        <p
          v-if="complainDetailData.appealTatus==0"
          style="color:red;text-align:center"
        >暂未处理，预计1~2个工作日内处理完成，请耐心等待</p>

        <!-- 如有处理结果为以下样式 -->
        <div v-else>
          <p style="color:red">{{complainDetailData.handleResult}}</p>
          <span>{{complainDetailData.deptName}}：{{complainDetailData.updateUserName}} {{complainDetailData.updateTime}}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="complainDetail = false">取消</el-button>
        <el-button type="primary" @click="complainDetail = false">确定</el-button>
      </span>
    </el-dialog>
    <!-- 音频播放-->
    <el-dialog width="30%" title="录音播放" :visible.sync="voiceVisible" append-to-body>
      <div style="text-align:center">
        <audio controls>
          <source src="~libs/voice/song.ogg" type="audio/ogg" />你的浏览器不支持音乐播放器
        </audio>
      </div>
    </el-dialog>
    <!--截图展示 -->
    <el-dialog width="80%" title="录音播放" :visible.sync="picVisible" append-to-body>
      <div style="text-align:center">
        <img src="~libs/images/educationPromotion.png" alt />
      </div>
    </el-dialog>
    <!-- 管理员回复 -->
    <el-dialog
      title="管理员回复"
      :close-on-click-modal="false"
      :visible.sync="replayDialog"
      width="860px"
      class="grayBg martopDialog"
    >
      <div class="whiteBox">
        <p class="pReset">案件基本情况</p>
        <el-row class="textLft">
          <el-col :span="3" class="height26">业务类型：</el-col>
          <el-col :span="5" class="height26">{{replyAppealData.payCasetypeName}}</el-col>
          <el-col :span="3" class="height26">持卡人姓名：</el-col>
          <el-col :span="5" class="height26">{{replyAppealData.cardName}}</el-col>
          <el-col :span="3" class="height26">身份证号：</el-col>
          <el-col :span="5" class="height26">{{replyAppealData.cardIdnumber}}</el-col>
          <el-col :span="3" class="height26">银行卡号：</el-col>
          <el-col :span="5" class="height26">{{replyAppealData.cardBackcard}}</el-col>
          <el-col :span="3" class="height26">还款金额：</el-col>
          <el-col :span="5" class="height26">{{replyAppealData.payAmount| toThousands}}</el-col>
          <el-col :span="3" class="height26">还款日期：</el-col>
          <el-col
            :span="5"
            class="height26"
          >{{replyAppealData.payTime?replyAppealData.payTime.split(' ')[0]:'--'}}</el-col>
          <el-col :span="3" class="height26">折算比例：</el-col>
          <el-col :span="5" class="height26">
            <span style="color:red">{{replyAppealData.discountRange}}</span>
          </el-col>
          <el-col :span="3" class="height26">折算原因：</el-col>
          <el-col :span="5" class="height26">{{replyAppealData.discountReason}}</el-col>
          <el-col :span="3" class="height26">搁置比例：</el-col>
          <el-col :span="5" class="height26">{{replyAppealData.shelveRatio}}</el-col>
          <el-col :span="3" class="height26">搁置原因：</el-col>
          <el-col :span="5" class="height26">{{replyAppealData.shelveReason}}</el-col>
          <el-col :span="3" class="height26">绩效：</el-col>
          <el-col :span="5" class="height26">{{replyAppealData.payAmount| toThousands}}</el-col>
          <el-col :span="3" class="height26">不予核算原因：</el-col>
          <el-col :span="5" class="height26">无</el-col>
          <el-col :span="3" class="height26">最终核款：</el-col>
          <el-col
            :span="5"
            class="height26"
          >{{replyAppealData.finalAccountingRepayment| toThousands}}</el-col>
        </el-row>
      </div>
      <div class="whiteBox">
        <p class="pReset">申诉内容</p>
        <el-row class="textLft">
          <el-col :span="4" class="height26">申诉原因：</el-col>
          <el-col :span="20" class="height26">{{replyAppealData.appealReasonName}}</el-col>
          <el-col :span="4" class="height26 mgt10">原因描述：</el-col>
          <el-col :span="20" class="height26 mgt10">{{replyAppealData.appealContent}}</el-col>
          <el-col :span="4" class="height26 mgt10">附件：</el-col>
          <el-col :span="20" class="height26 mgt10">
            <el-button @click="getPic(replyAppealData.imgId)" v-if="replyAppealData.imgId">截图</el-button>
            <el-button @click="getVoice(replyAppealData.audioId)" v-if="replyAppealData.audioId">录音</el-button>
          </el-col>
          <el-col :span="4" class="height26 mgt10">申诉人：</el-col>
          <el-col :span="20" class="height26 mgt10">{{replyAppealData.createUserName}}</el-col>
          <el-col :span="4" class="height26 mgt10">申诉时间：</el-col>
          <el-col :span="20" class="height26 mgt10">{{replyAppealData.createTime}}</el-col>
        </el-row>
      </div>
      <div class="whiteBox">
        <p class="pReset">处理结果</p>
        <el-alert title="提交前请先和申诉人联系，确定无误后再完结此申诉！ 完结后不可更改!" type="warning" :closable="false"></el-alert>
        <el-row class="textLft mar-top">
          <el-form :model="replyAppealForm" :rules="replyAppealFormRule" ref="replyAppealForm">
            <el-col :span="4" class="height26 mgt10">原因描述：</el-col>
            <el-col :span="20" class="mgt10">
              <el-form-item prop="content">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 2}"
                  placeholder="请备注处理和申诉人沟通后的结果！"
                  v-model="replyAppealForm.content"
                  style="width:100%;"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="replayDialog = false,resetOnly('replyAppealForm')">取消</el-button>
        <el-button type="primary" @click="replyAppeal_save('replyAppealForm')">确定</el-button>
      </span>
    </el-dialog>

    <!-- 新增业绩归属异议弹框 -->
    <el-dialog
      title="新增业绩归属异议"
      :close-on-click-modal="false"
      :before-close="setSearchFlag"
      :visible.sync="addperfoDissent"
      width="860px"
      class="grayBg"
    >
      <el-dialog width="50%" title="搜索结果" :visible.sync="searchTab" append-to-body>
        <div>
          <el-table
            :data="searchTabData"
            border
            style="width:100%"
            :header-cell-style="{backgroundColor:'#e5e9f3'}"
          >
            <el-table-column property="cardName" label="持卡人" width="100"></el-table-column>
            <el-table-column property="cardBackcard" label="银行卡号" width="200"></el-table-column>
            <el-table-column label="还款时间">
              <template slot-scope="scope">
                <span>{{scope.row.payTime.split(' ')[0]}}</span>
              </template>
            </el-table-column>
            <el-table-column property="payAmount" label="还款金额"></el-table-column>
            <el-table-column fixed="right" property="operation" label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="selectItem(scope.row)">选定</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>
      <div class="whiteBox" v-if="searchFlag==0">
        <p class="pReset">案件基本基本情况</p>
        <el-form
          :model="addperfoDissentSearchform"
          :rules="addperfoDissentSearchformRule"
          ref="addperfoDissentSearchform"
          label-width="140px"
        >
          <el-row>
            <el-col :md="12">
              <el-form-item label="业务类型：" prop="typeSelect">
                <el-select
                  v-model="addperfoDissentSearchform.typeSelect"
                  placeholder="业务类型"
                  style="width:230px"
                >
                  <el-option
                    v-for="item in caseTypeOptions"
                    :key="item.typeId"
                    :label="item.typeName"
                    :value="item.typeId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="持卡人身份证号：" prop="idNumber">
                <el-input v-model="addperfoDissentSearchform.idNumber" style="width:160px"></el-input>&nbsp;&nbsp;
                <el-button @click="baseInfoSearch('addperfoDissentSearchform')">搜索</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="whiteBox" v-if="searchFlag==1">
        <p class="pReset">案件基本基本情况</p>
        <el-form :model="addperfoDissentform" ref="addperfoDissentform" label-width="140px">
          <el-row>
            <el-col :md="12">
              <el-form-item label="业务类型：" prop="payCasetypeChi">
                <el-select
                  disabled
                  v-model="addperfoDissentform.payCasetypeChi"
                  placeholder="业务类型"
                  style="width:230px"
                >
                  <el-option
                    v-for="item in caseTypeOptions"
                    :key="item.typeId"
                    :label="item.typeName"
                    :value="item.typeId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="持卡人身份证号：" prop="cardIdnumber">
                <el-input disabled v-model="addperfoDissentform.cardIdnumber" style="width:160px"></el-input>&nbsp;&nbsp;
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12">
              <el-form-item label="持卡人：" prop="cardName">
                <el-input disabled v-model="addperfoDissentform.cardName" style="width:230px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="持卡人银行卡号：" prop="cardBackcard">
                <el-input disabled v-model="addperfoDissentform.cardBackcard" style="width:230px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="还款时间：" prop="payTime">
                <el-input disabled v-model="addperfoDissentform.payTime" style="width:230px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="还款金额：" prop="payAmount">
                <el-input disabled v-model="addperfoDissentform.payAmount" style="width:230px"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="whiteBox" v-if="searchFlag==1">
        <p class="pReset">原因描述</p>
        <el-row class="textLft mar-top">
          <el-form :model="dissentForm" :rules="dissentFormRule" ref="dissentForm">
            <el-col :span="4" class="height26 mgt10">原因描述：</el-col>
            <el-col :span="20" class="mgt10">
              <el-form-item prop="content">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 2}"
                  placeholder="请填写描述"
                  v-model="dissentForm.content"
                  style="width:100%;"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-form>
          <el-col :span="23" :offset="1" class="mgt10">
            <el-upload
              class="uploadLine"
              :action="uploadActionUrl"
              :headers="headers"
              :on-success="handleSuccess1"
              :before-remove="beforeRemove1"
              :before-upload="beforeUploadPic"
              :limit="1"
              :file-list="fileList"
            >
              <el-button size="small">上传截图</el-button>
            </el-upload>
          </el-col>
          <el-col :span="23" :offset="1" class="mgt10">
            <el-upload
              class="uploadLine"
              :action="uploadActionUrl"
              :headers="headers"
              :on-success="handleSuccess2"
              :before-remove="beforeRemove2"
              :before-upload="beforeUploadVoice"
              :limit="1"
              :file-list="fileList"
            >
              <el-button size="small">上传录音</el-button>
            </el-upload>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer" v-if="searchFlag==1">
        <el-button @click="setSearchFlag()">取消</el-button>
        <el-button type="primary" @click="dissent_save('dissentForm')">提交</el-button>
      </span>
    </el-dialog>
    <!-- 团队成员业绩详情 -->
    <el-dialog
      title="团队成员业绩详情"
      :close-on-click-modal="false"
      :visible.sync="teamerFlag"
      width="1200px"
      class="grayBg"
      :before-close="teamerDialogClose"
    >
      <div class="tbSearch clearfix">
        <el-form class="pull-left" :inline="true" :model="teamerSearchForm" ref="teamerSearchForm">
          <el-form-item label="业务类型">
            <el-select
              ref="areaAfter"
              v-model="teamerSearchForm.payCasetypeChi"
              placeholder="选择类型"
              clearable
              class="width155"
            >
              <el-option
                v-for="item in caseTypeOptions"
                :key="item.typeId"
                :label="item.typeName"
                :value="item.typeId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="teamerSearchForm.name" placeholder="请输入名字" class="width155"></el-input>
          </el-form-item>
          <el-form-item label="员工编号">
            <el-input v-model="teamerSearchForm.employedNo" placeholder="请输入编号" class="width155"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="teamerSearch()">搜索</el-button>
          </el-form-item>
        </el-form>
        <div class="pull-right">
          <el-button @click="teamerExport(teamerItem)">导出</el-button>
        </div>
      </div>
      <div class="table_wrap">
        <el-table
          :data="teamerData"
          border
          style="width:100%"
          :header-cell-style="{backgroundColor:'#e5e9f3'}"
        >
          <el-table-column type="index" label="序号" min-width="50"></el-table-column>
          <el-table-column prop="level" label="组织架构" min-width="180"></el-table-column>
          <el-table-column prop="payOpername" label="姓名" min-width="120"></el-table-column>
          <el-table-column prop="payOpernumber" label="员工编号" min-width="120"></el-table-column>
          <el-table-column prop="payCasetypeChiName" label="业务类型" min-width="120"></el-table-column>
          <el-table-column prop="returnMoneyTotal" label="还款金额" min-width="90">
            <template slot-scope="scope">{{scope.row.returnMoneyTotal | toThousands}}</template>
          </el-table-column>
          <el-table-column prop="statisticsDate" label="业绩月份" min-width="100"></el-table-column>
          <el-table-column prop="repaymentMoneyTotal" label="最终核款" min-width="120">
            <template slot-scope="scope">{{scope.row.repaymentMoneyTotal | toThousands}}</template>
          </el-table-column>
          <el-table-column prop="performanceRanking" label="排名" min-width="90"></el-table-column>
        </el-table>
        <!-- 分页 -->
        <div id="pagination">
          <el-pagination
            @size-change="teamerHandleSizeChange"
            @current-change="teamerHandlecurrentChange"
            background
            :current-page="teamerCurrent"
            :page-sizes="[10,15,20,30,40]"
            :page-size="teamerSize"
            layout="total,sizes,prev,pager,next,jumper"
            :total="teamerTotal"
          ></el-pagination>
        </div>
      </div>
    </el-dialog>

    <!-- 个人业绩总台账888 -->
    <!-- <el-dialog title="生成业绩总台账" :close-on-click-modal="false" :visible.sync="createAccountForm" width="450px">
      <el-row>
        <el-col>
          <p>完成进度</p>
          <el-progress :text-inside="false" color="#67c23a" :stroke-width="16" :percentage="progress" :show-text="true"></el-progress>
          <p v-if="statusText!=''"><span style="color:red">{{statusText}}</span></p>
        </el-col>
      </el-row>
      <p class="clearfix" style=" text-align: right; margin-top: 30px;">
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelAccount()">取消</el-button>
          <el-button type="primary" @click="createProgress()">确认生成</el-button>
        </span>
      </p>
    </el-dialog>-->
    <!-- 生成业绩总台帐666 更多查询  -->
    <el-dialog
      title="更多查询"
      :close-on-click-modal="false"
      :visible.sync="search_more_BA"
      width="650px"
    >
      <el-form :inline="true" :model="BAMoreSearch" class="mar-no" label-width="100px">
        <el-form-item label="业务类型">
          <el-select
            v-model="BAMoreSearch.caseType"
            placeholder="- 所有 -"
            class="width170"
            clearable
            filterable
          >
            <el-option
              v-for="item in caseTypeOptions"
              :key="item.typeId"
              :label="item.typeName"
              :value="item.typeId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="级别">
          <el-select
            v-model="BAMoreSearch.userLevel"
            placeholder="- 所有 -"
            class="width170"
            clearable
            filterable
          >
            <el-option
              v-for="item in levelOptions"
              :key="item.typeId"
              :label="item.typeName"
              :value="item.typeId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input
            v-model.trim="BAMoreSearch.userName"
            placeholder="请输入"
            class="width170"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="员工编号">
          <el-input
            v-model.trim="BAMoreSearch.employedNo"
            placeholder="请输入"
            class="width170"
            clearable
          ></el-input>

          <!-- <el-input-number v-model="IAMoreSearch.employedNo" placeholder="请输入" class="width170" :controls="false" :min="0" :max="10000000000" clearable></el-input-number> -->
        </el-form-item>
        <!-- <el-form-item label="身份证号">
          <el-input clearable v-model="BAMoreSearch.idcard" placeholder="请输入" class="width170"></el-input>
        </el-form-item>-->
        <el-form-item label="提交状态">
          <el-select
            v-model="BAMoreSearch.boolCommit"
            placeholder="- 所有 -"
            class="width170"
            clearable
            filterable
          >
            <el-option
              v-for="item in commitTypeOptions"
              :key="item.typeId"
              :label="item.typeName"
              :value="item.typeId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="search_more_BA=false">取消</el-button>
        <el-button type="primary" @click="search_more_BA=false,JS_BA_search('1')">立即搜索</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="生成业绩总台帐"
      :close-on-click-modal="false"
      :visible.sync="buildAccountFlag"
      width="300px"
    >
      <el-form :inline="true" :model="buildAccount" class="mar-no" label-width="100px">
        <el-form-item label="所属年月">
          <el-date-picker
            class="width130"
            v-model="BAbatch"
            type="month"
            :editable="false"
            disabled
            :clearable="false"
            value-format="yyyy-MM"
            placeholder="年月"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="核算月份">
          <el-date-picker
            class="width130"
            v-model="buildAccount.batch"
            type="month"
            :editable="false"
            :clearable="false"
            value-format="yyyy-MM"
            placeholder="年月"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="buildAccountFlag=false">取消</el-button>
        <el-button type="primary" @click="doBuildAccount()">生成</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="生成业绩总台帐"
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="createAccountForm"
      width="450px"
    >
      <el-row>
        <el-col>
          <p>完成进度</p>
          <el-progress
            :text-inside="true"
            color="#67c23a"
            :stroke-width="16"
            :percentage="progress"
            :show-text="true"
          ></el-progress>
          <p v-if="statusText!=''">
            <span style="color:red">{{statusText}}</span>
          </p>
        </el-col>
      </el-row>
      <p class="clearfix" style=" text-align: right; margin-top: 30px;">
        <span slot="footer" class="dialog-footer">
          <!-- <el-button @click="cancelCalc()">取消</el-button>
          <el-button type="primary" @click="createAccountForm=false">确认</el-button>-->
          <el-button type="primary" v-if="BAbackFlag" @click="cancelCalc()">返回</el-button>
        </span>
      </p>
    </el-dialog>

    <!-- <el-dialog title="绩效公式查看" :close-on-click-modal="false" :visible.sync="performanceFormulaFlag" width="300px">
      <el-form :inline="true" :model="buildAccount" class="mar-no" label-width="100px">
        <el-form-item label="版本状态">
          <el-select v-model="BAMoreSearch.name" placeholder="- 所有 -" class="width130" clearable filterable>
            <el-option v-for="item in caseTypeOptions" :key="item.typeId" :label="item.typeName" :value="item.typeId"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button>取消</el-button>
        <el-button type="primary">确定</el-button>
      </span>
    </el-dialog>-->

    <el-dialog
      title="个人还款明细"
      :close-on-click-modal="false"
      :visible.sync="personalDetailFlag"
      width="1100px"
      class="martopDialog grayBg"
    >
      <div class="whiteBox">
        <el-table
          :data="personalDetailData"
          show-summary
          :summary-method="getSummariesPD"
          border
          style="width:100%"
          height="600px"
          :header-cell-style="{backgroundColor:'#e5e9f3'}"
        >
          <el-table-column type="index" label="序号" min-width="50"></el-table-column>
          <el-table-column label="姓名" prop="userName" width="150"></el-table-column>
          <el-table-column label="还款金额" prop="payAmount" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column label="结佣金额" prop="checkCommission" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column label="差异额" prop="diffAmount" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column label="折算比例" prop="discountRatio" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column
            label="折算后金额"
            prop="afterDiscountAmount"
            width="120"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="搁置比例" prop="shelveRatio" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column label="搁置金额" prop="shelveAmount" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column label="核款金额" prop="accountingAmount" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column label="级别" width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.positionCode == '0'">组员</span>
              <span v-else-if="scope.row.positionCode == '1'">组长</span>
              <span v-else-if="scope.row.positionCode =='2'">部长</span>
              <span v-else-if="scope.row.positionCode == '3'">副总</span>
              <span v-else-if="scope.row.positionCode == '4'">总经理</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column label="副总" prop="viceName" width="150"></el-table-column>
          <el-table-column label="部长" prop="ministerName" width="150"></el-table-column>
          <el-table-column label="组长" prop="headmanName" width="150"></el-table-column>
          <el-table-column label="员工" prop="userName" width="150"></el-table-column>
          <el-table-column label="业务类型" prop="payCasetypeName" width="150"></el-table-column>
          <el-table-column label="员工编号" prop="payOperid" width="150"></el-table-column>
          <el-table-column label="手机号码" prop="mobilePhone" width="150"></el-table-column>
          <el-table-column label="案件ID" prop="payCaseid" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column label="还款ID" prop="payId" width="150" show-overflow-tooltip></el-table-column>
        </el-table>
        <!-- 分页 -->
        <div id="pagination">
          <el-pagination
            @size-change="personalDetailHandleSizeChange"
            @current-change="personalDetailHandlecurrentChange"
            background
            :current-page="personalDetailCurrent"
            :page-sizes="[10,15,20,30,40]"
            :page-size="personalDetailSize"
            layout="total,sizes,prev,pager,next,jumper"
            :total="personalDetailTotal"
          ></el-pagination>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="personalDetailFlag = false">关闭</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="绩效公式明细"
      :close-on-click-modal="false"
      :visible.sync="PFDetailFlag"
      width="568px"
      class="formulaDetailModal grayBg"
    >
      <div class="whiteBox">{{GStype}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="PFDetailFlag = false">确定</el-button>
      </span>
    </el-dialog>

    <!-- 导入业绩总台帐777 更多查询  -->
    <el-dialog
      title="更多查询"
      :close-on-click-modal="false"
      :visible.sync="search_more_IA"
      width="650px"
    >
      <el-form :inline="true" :model="IAMoreSearch" class="mar-no" label-width="100px">
        <el-form-item label="业务类型">
          <el-select
            v-model="IAMoreSearch.caseType"
            placeholder="- 所有 -"
            class="width170"
            clearable
            filterable
          >
            <el-option
              v-for="item in caseTypeOptions"
              :key="item.typeId"
              :label="item.typeName"
              :value="item.typeId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="级别">
          <el-select
            v-model="IAMoreSearch.userLevel"
            placeholder="- 所有 -"
            class="width170"
            clearable
            filterable
          >
            <el-option
              v-for="item in levelOptions"
              :key="item.typeId"
              :label="item.typeName"
              :value="item.typeId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input
            v-model.trim="IAMoreSearch.userName"
            placeholder="请输入"
            class="width170"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="员工编号">
          <el-input
            v-model.trim="IAMoreSearch.employedNo"
            placeholder="请输入"
            class="width170"
            clearable
          ></el-input>

          <!-- <el-input-number v-model="IAMoreSearch.employedNo" placeholder="请输入" class="width170" :controls="false" :min="0" :max="10000000000" clearable></el-input-number> -->
        </el-form-item>
        <!-- <el-form-item label="身份证号">
          <el-input clearable v-model="IAMoreSearch.idcard" placeholder="请输入" class="width170"></el-input>
        </el-form-item>-->
        <el-form-item label="提交状态">
          <el-select
            v-model="IAMoreSearch.boolCommit"
            placeholder="- 所有 -"
            class="width170"
            clearable
            filterable
          >
            <el-option
              v-for="item in commitTypeOptions"
              :key="item.typeId"
              :label="item.typeName"
              :value="item.typeId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="search_more_IA=false">取消</el-button>
        <el-button type="primary" @click="JS_IASearch">立即搜索</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="业绩总台帐导入"
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="importAccountModal"
      width="580px"
    >
      <div>
        <el-form
          :model="importAccountform"
          :rules="importAccountformRule"
          ref="importAccountform"
          label-width="100px"
        >
          <el-row>
            <el-col :md="24">
              <el-form-item label="导入月份" prop="month">
                <el-date-picker
                  style="width:420px"
                  v-model="importAccountform.month"
                  type="month"
                  :editable="false"
                  :clearable="false"
                  value-format="yyyy-MM"
                  placeholder="选择月"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :md="24">
              <el-form-item label="公式导入" prop="BasePay">
                <p class="clearfix" style="margin-top:6px;">
                  <el-upload
                    :multiple="false"
                    :limit="1"
                    :on-exceed="IAonExceed"
                    class="pull-left"
                    ref="upload"
                    :data="{batch:importAccountform.month}"
                    :auto-upload="false"
                    :action="uploadIAActionUrl"
                    :headers="headers"
                    :before-upload="beforeUploadAccount"
                    :on-success="handleSuccessAccount"
                    :file-list="fileList"
                  >
                    <el-button slot="trigger" size="small" icon="el-icon-upload">选取文件</el-button>
                    <el-button
                      style="margin-left: 10px;"
                      size="small"
                      type="success"
                      @click="submitUpload('importAccountform')"
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
                  <el-button type="text" class="underlineTxt" @click.stop="JS_IA_download">公用模板下载</el-button>
                </span>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer" style="padding-right: 18px;">
        <el-button
          type="primary"
          @click="importAccountModal = false,fileClose('importAccountform')"
        >关闭</el-button>
      </span>
    </el-dialog>
    <!-- 888 -->
    <el-dialog
      title="计算差异额"
      :show-close="false"
      :close-on-click-modal="false"
      :visible.sync="createDiffsFlag"
      width="450px"
    >
      <el-row>
        <el-col>
          <p>完成进度</p>
          <el-progress
            :text-inside="true"
            color="#67c23a"
            :stroke-width="16"
            :percentage="progress"
            :show-text="true"
          ></el-progress>
          <p v-if="statusText!=''">
            <span style="color:red">{{statusText}}</span>
          </p>
        </el-col>
      </el-row>
      <p class="clearfix" style=" text-align: right; margin-top: 30px;">
        <span slot="footer" class="dialog-footer">
          <!-- <el-button @click="cancelCalc()">取消</el-button>
          <el-button type="primary" @click="createDiffsFlag=false">确认</el-button>-->
          <el-button type="primary" v-if="DifbackFlag" @click="cancelCalc()">返回</el-button>
        </span>
      </p>
    </el-dialog>
    <!-- 餐房补名单管理 999-->
    <el-dialog
      title="餐房补名单导入"
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="mealHouseModal"
      width="580px"
    >
      <div>
        <el-form
          :model="mealHouseModalform"
          :rules="mealHouseModalformRule"
          ref="mealHouseModalform"
          label-width="100px"
        >
          <el-row>
            <el-col :md="24">
              <el-form-item label="导入月份" prop="month">
                <el-date-picker
                  style="width:420px"
                  v-model="mealHouseModalform.month"
                  type="month"
                  :editable="false"
                  :clearable="false"
                  value-format="yyyy-MM"
                  placeholder="选择月"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :md="24">
              <el-form-item label="公式导入" prop="BasePay">
                <p class="clearfix" style="margin-top:6px;">
                  <el-upload
                    :multiple="false"
                    :limit="1"
                    :on-exceed="MHonExceed"
                    class="pull-left"
                    ref="upload"
                    :data="{batch:mealHouseModalform.month}"
                    :auto-upload="false"
                    :action="uploadMHActionUrl"
                    :headers="headers"
                    :before-upload="beforeUploadMH"
                    :on-success="handleSuccessMH"
                    :file-list="fileList"
                  >
                    <el-button slot="trigger" size="small" icon="el-icon-upload">选取文件</el-button>
                    <el-button
                      style="margin-left: 10px;"
                      size="small"
                      type="success"
                      @click="submitUpload('mealHouseModalform')"
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
                  <el-button type="text" class="underlineTxt" @click.stop="JS_MH_download">公用模板下载</el-button>
                </span>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer" style="padding-right: 18px;">
        <el-button type="primary" @click="mealHouseModal=false,fileClose('mealHouseModalform')">关闭</el-button>
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
          <span style="color:#66b1ff">成功{{uploadProcessInfo.successful | repair}}条</span>，
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
  </div>
</template>

<script>
import Tools from "untils/index.js"
import { GET, POST, PUT, DELETE } from "http/custom.js"
import ReimbImport from "components/personalCenter/performance/ReimbImport.vue" //还款导入

export default {
  name: "performanceQuery",
  components: { ReimbImport },
  data() {
    let Ytd = Tools.getYd() //获取当前年月 格式如 201906
    let height_1 = Tools.getTbHeight(415)
    let height_2 = Tools.getTbHeight(362)
    let height_3 = Tools.getTbHeight(315)
    let height_4 = Tools.getTbHeight(360)
    const uploadActionUrl = process.env.VUE_APP_DOMAIN_download + "/oss/upload" //导入文件
    const uploadIAActionUrl = process.env.VUE_APP_DOMAIN_performance + "/manual/achievementImportData"
    const uploadMHActionUrl = process.env.VUE_APP_DOMAIN_performance + "/subsidy/importData"
    return {
      dataInfo: {
        //给子组件的数据集合
        t_height: Tools.getTbHeight(360) //设置表格的高
      },
      height_1: height_1,
      height_2: height_2,
      height_3: height_3,
      height_4: height_4,
      personalInfoData: {}, //姓名popover弹窗数据
      currentPage: 1,
      caseTypeOptions: [], //业务类型字典
      rankOptions: [], //排名分段字典
      reasonOptions: [], //原因分段字典
      areaOptions: [], //区域字典
      levelOptions: [
        {
          typeId: "0",
          typeName: "组员"
        },
        {
          typeId: "1",
          typeName: "组长"
        },
        {
          typeId: "2",
          typeName: "部长"
        },
        {
          typeId: "3",
          typeName: "副总"
        },
        {
          typeId: "4",
          typeName: "总经理"
        },
        {
          typeId: "5",
          typeName: "总裁办公会"
        }
      ],
      commitTypeOptions: [
        {
          typeId: "0",
          typeName: "未提交"
        },
        {
          typeId: "1",
          typeName: "已提交"
        },
        {
          typeId: "2",
          typeName: "提交失败"
        },
        {
          typeId: "3",
          typeName: "忽略提交"
        }
      ],
      id: this.$store.state.id, //用户id
      searchId: "",
      userDep: {}, //用户信息详情
      activeName: "first",
      // 权限控制

      performance_rank_manage: false,
      performance_rank_vice: false,
      performance_rank_minister: false,
      performance_rank_personal: false,

      //个人业绩
      state: "",
      restaurants: [],
      personSortFlag: "",
      personCurrent: 1, //当前页码
      personPages: 0, //总页数
      personSize: 15, //每页显示记录条数
      personTotal: 0, //总记录
      personSearch: {
        batch: Ytd,
        payCasetypeChi: ""
      },
      performanceTableData: [],
      performanceTotalData: {},
      perfoBaseDetail: {},
      appealPayId: "",
      uploadActionUrl,
      perfoDetail: false, //个人业绩详情弹框
      complainDialog: false, //我要申诉弹框
      innerVisible: false, //嵌套框--申诉成功弹框
      addperfoDissentSearchform: {
        typeSelect: "",
        idNumber: ""
      },
      addperfoDissentSearchformRule: {
        typeSelect: [{ required: true, message: "请选择", trigger: "blur" }],
        idNumber: [{ required: true, message: "请填写", trigger: "blur" }]
      },
      appealFormPic: null,
      appealFormVoice: null,
      appealForm: {
        checkList: [],
        content: ""
      },
      appealFormRule: {
        checkList: [{ type: "array", required: true, message: "请至少选择一个", trigger: "change" }],
        content: [{ required: true, message: "请填写申诉原因", trigger: "blur" }]
      },

      dissentFormPic: null,
      dissentFormVoice: null,
      dissentForm: { content: "" },
      dissentFormRule: { content: [{ required: true, message: "请填写申诉原因", trigger: "blur" }] },
      headers: {}, //上传图片请求头
      fileList: [
        //  {name: 'food.jpeg', url: ''}
      ],
      complainDetail: false, //申诉详情弹框
      complainDetailData: {},
      replayDialog: false, //管理员回复弹框
      voiceVisible: false,
      picVisible: false,
      // 申诉记录
      appealSortFlag: "",
      appealCurrent: 1, //当前页码
      appealPages: 0, //总页数
      appealSize: 15, //每页显示记录条数
      appealTotal: 0, //总记录
      appealFormSearch: {
        //查询栏初始数据
        type: "",
        time: "",
        reason: ""
      },
      appealData: [],
      replyAppealData: {},
      replyAppealForm: {
        content: ""
      },
      replyAppealFormRule: {
        content: [{ required: true, message: "请填写申诉原因", trigger: "blur" }]
      },
      replyAppealId: "",

      // 团队业绩
      teamTotalData: {
        //总计内数据
        repaymentMoneyTotalCount: 0,
        convertTotalCount: 0,
        shelveperTotalCount: 0,
        returnMoneyTotalCount: 0,
        expectedPerformanceCommissionlCount: 0
      },
      teamFlag: false,
      manageOptions: [], //总经理选项
      manageDisable: false,
      viceOptions: [], //副总经理选项
      viceDisable: false,
      ministerOptions: [], //部长选项
      ministerDisable: false,
      positionCode: "",
      userNum: "",
      search_more: false, //更多查询弹框
      formSearch: {
        payCasetype: "",
        companyArea: "",
        payOpernumber: ""
      },
      teamCurrent: 1, //当前页码
      teamPages: 0, //总页数
      teamSize: 15, //每页显示记录条数
      teamTotal: 0, //总记录
      teamFormSearch: {
        //查询栏初始数据
        manager: "",
        aManager: "",
        minister: "",
        batch: Ytd
      },
      teamData: [],
      teamerFlag: false, //团队业绩内详情弹窗
      teamerCurrent: 1,
      teamerPages: 0,
      teamerSize: 15,
      teamerTotal: 0,
      teamerSearchForm: {
        name: "",
        employedNo: "",
        payCasetypeChi: ""
      },
      teamerData: [],
      teamerItem: {},

      //业绩排名
      manageSortFalg: "",
      manageCurrent: 1,
      managePages: 0,
      manageSize: 15,
      manageTotal: 0,
      manageData: [], //总经理团队业绩
      viceSortFlag: "",
      viceCurrent: 1,
      vicePages: 0,
      viceSize: 15,
      viceTotal: 0,
      viceData: [], // 副总团队业绩
      ministerSortFlag: "",
      ministerCurrent: 1,
      ministerPages: 0,
      ministerSize: 15,
      ministerTotal: 0,
      ministerData: [], //部长团队业绩
      headmanSortFlag: "",
      headmanCurrent: 1,
      headmanPages: 0,
      headmanSize: 15,
      headmanTotal: 0,
      headmanData: [], //组长团队业绩
      rankBatch: Ytd,
      roleSelect: "总经理业绩",
      GRankValue: "",
      generalTableData: [],
      deputyGeneralTableData: [],
      ministerTableData: [],
      personalTableData: [],
      textarea: "",
      addperfoDissent: false, //新增业绩归属异议弹框
      addperfoDissentform: {},
      searchTab: false, //搜索结果弹框
      searchFlag: 0,
      searchTabData: [],
      personalInfoDataAll: {},

      // 个人业绩总台账
      // search_more_account: false,
      // accountMoreSearch: {
      //   name: '',
      //   employedNo: undefined
      // },
      // bsubmitOptions: [//提交状态
      //   {
      //     value: '0',
      //     label: '未提交'
      //   }, {
      //     value: '1',
      //     label: '已提交'
      //   }
      //   , {
      //     value: '2',
      //     label: '提交失败'
      //   },
      //   {
      //     value: '3',
      //     label: '忽略提交'
      //   }
      // ],
      // bsubmitValue: '',
      statusText: "",
      // isLockFlag: false, //总台账判断数据是否上锁
      // SubmitStu: false, //提交与撤销
      // createAccountForm: false, // 显示进度窗
      progress: 0, //生成进度
      // accountLoading: false, //表格加载
      // accountData: [],
      // accountCurrent: 1,//当前页码
      // accountPages: 0,//总页数
      // accountSize: 15,//每页显示记录条数
      // accountTotal: 0,//总记录
      // accountSearch: {//查询栏初始数据
      //   batch: Tools.getPYd(),
      //   payCasetype: '',
      //   userLevel: ''
      // },
      // accountAmt: "总计：个人总绩效：    团队绩效提成：     绩效计提：",

      // userLevelOptions: [
      //   {
      //     typeId: 0,
      //     typeName: '组员'
      //   },
      //   {
      //     typeId: 1,
      //     typeName: '组长'
      //   },
      //   {
      //     typeId: 2,
      //     typeName: '部长'
      //   },
      //   {
      //     typeId: 3,
      //     typeName: '副总'
      //   },
      //   {
      //     typeId: 4,
      //     typeName: '总经理'
      //   },
      //   {
      //     typeId: 5,
      //     typeName: '总裁办公会'
      //   },
      // ],
      // 生成业绩总台帐666
      BAbackFlag: false,
      PayRecordSum: {},
      item: {},
      BADisabled: false,
      createAccountForm: false, // 显示进度窗
      BACurrent: 1, //当前页码
      BAPages: 0, //总页数
      BASize: 15, //每页显示记录条数
      BATotal: 0, //总记录条数
      BALoading: false,
      BAData: [],
      BATotalData: {
        achieveMoney: "",
        convertPersonTotal: "",
        convertTeamTotal: "",
        personalExtract: "",
        repaymentPersonTotal: "",
        repaymentTeamTotal: "",
        returnMoneyPersonTotal: "",
        returnMoneyTeamTotal: "",
        shelveperPersonTotal: "",
        shelveperTeamTotal: "",
        teamExtract: ""
      },
      buildDifOptions2: "",
      BAbatch: Tools.getPYd(),
      buildAccountSearch: {
        afterBranch: ""
      },
      search_more_BA: false,
      BAMoreSearch: {
        caseType: "",
        userLevel: "",
        userName: "",
        // idcard: '',
        boolCommit: "",
        employedNo: ""
      },
      buildAccountFlag: false,
      buildAccount: {
        batch: Tools.getYd()
      },
      personalDetailFlag: false, //个人还款明细
      personalDetailData: [],
      personalDetailCurrent: 1,
      personalDetailSize: 15, //每页显示记录条数
      personalDetailTotal: 0, //总记录条数
      PFDetailFlag: false, //绩效公式明细弹窗
      GStype: "",

      // 导入业绩总台帐777
      // IARelease: '',
      IADisabled: false,
      uploadIAActionUrl,
      IACurrent: 1, //当前页码
      IAPages: 0, //总页数
      IASize: 15, //每页显示记录条数
      IATotal: 0, //总记录条数
      IALoading: false,
      IAData: [],
      IATotalData: {
        achieveMoney: "",
        convertPersonTotal: "",
        convertTeamTotal: "",
        personalExtract: "",
        repaymentPersonTotal: "",
        repaymentTeamTotal: "",
        returnMoneyPersonTotal: "",
        returnMoneyTeamTotal: "",
        shelveperPersonTotal: "",
        shelveperTeamTotal: "",
        teamExtract: ""
      },
      importAccountSearch: {
        //查询栏初始数据
        batch: Tools.getPYd(),
        payCasetype: "",
        userLevel: ""
      },
      search_more_IA: false,
      IAMoreSearch: {
        caseType: "",
        userLevel: "",
        userName: "",
        // idcard: '',
        boolCommit: "",
        employedNo: ""
      },
      importAccountModal: false,
      importAccountform: {
        month: "" //月份
      },
      importAccountformRule: {
        month: [{ required: true, message: "请选择月份", trigger: "change" }]
      },
      //差异额对比888
      DifbackFlag: false,
      createDiffsFlag: false, // 显示进度窗
      // title1: '绩效计提（无）',
      // title2: '绩效计提（无）',
      yearMonth: Tools.getPYd(),
      updateDifOptions: "",
      buildDifOptions: "",
      diffsSearch: {
        beforeBranch: "",
        afterBranch: ""
      },
      diffsCurrent: 1, //当前页码
      diffsPages: 0, //总页数
      diffsSize: 15, //每页显示记录条数
      diffsTotal: 0, //总记录条数
      diffsLoading: false,
      diffsData: [],
      //餐房补名单管理 999
      uploadMHActionUrl,
      MHCurrent: 1, //当前页码
      MHPages: 0, //总页数
      MHSize: 15, //每页显示记录条数
      MHTotal: 0, //总记录条数
      MHloading: false,
      MHData: [],
      MHListSearch: {
        //查询栏初始数据
        batch: Tools.getPYd(),
        userName: ""
      },
      mealHouseModal: false,
      mealHouseModalform: {
        month: "" //月份
      },
      mealHouseModalformRule: {
        month: [{ required: true, message: "请选择月份", trigger: "change" }]
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
      }
    }
  },
  created() {
    this.headers["x-user-token"] = localStorage.getItem("token") //设置上传数据文件excel的token
    this.queryCaseType()
    this.queryAreaList()
    this.getUserRight()
  },
  computed: {
    personPerformanceOpe() {
      //个人业绩内管理员权限
      return Tools.includes(this.$store.state.userActionAll, "b88c89c15d2c4bfa8688b5dbba794d7c")
    },
    performanceRankTab() {
      //业绩排名tab是否显示
      return Tools.includes(this.$store.state.userActionAll, "92d2a95f5fcf48c79eb04d5dd95e6acd")
    },
    performanceRankOpe() {
      //业绩排名内管理员权限
      return Tools.includes(this.$store.state.userActionAll, "f2a852d5fa6c473bb0a7dee6335195dc")
    },
    appealRecordOpe() {
      //申诉记录内回复权限
      return Tools.includes(this.$store.state.userActionAll, "734c2320edf7476dbecbd5d1acbfbaa1")
    },
    appealRecordExp() {
      //申诉记录内导出权限
      return Tools.includes(this.$store.state.userActionAll, "55c6924fb08042bdb754c52f30702900")
    },
    teamPerformanceTab() {
      //团队业绩tab是否显示
      return Tools.includes(this.$store.state.userActionAll, "92d30a5e65ad4549b18c1f5639086ac1")
    },
    teamPerformanceOpe() {
      //团队业绩内管理员权限
      return Tools.includes(this.$store.state.userActionAll, "20b70aa86e2c4690a6813273d6411985")
    },
    // personalAccountTab() {//个人业绩总台账tab是否显示
    //   return Tools.includes(this.$store.state.userActionAll, 'ae2eadd0d35c4c87b390d9bc61965729')
    // }
    buildAccountTab() {
      //生成业绩总台账tab是否显示
      return Tools.includes(this.$store.state.userActionAll, "728ff13f08124ce8975b40422034b947")
    },
    importAccountTab() {
      //导入业绩总台账tab是否显示
      return Tools.includes(this.$store.state.userActionAll, "b55d32bf77ce4913a205c74ed38cbd86")
    },
    diffsTab() {
      //差异额对比tab是否显示
      return Tools.includes(this.$store.state.userActionAll, "6138c944fddd49cf89ee27e5dc774b91")
    },
    mealHouseTab() {
      //房餐补名单管理tab是否显示
      return Tools.includes(this.$store.state.userActionAll, "1651d1548bc747a3846b8e9157b8925b")
    },
    reimbImport() {
      //还款导入tab是否显示
      return Tools.includes(this.$store.state.userActionAll, "fc30ee4ba2df45acb65126517d005280")
    }
  },
  methods: {
    // 获取用户权限列表
    getUserRight() {
      this.$store.dispatch("oaGetTokenInfo").then(res => {
        this.id = res.id
        this.getUserDep()
        this.performanceSearch()
      })
    },
    //获取用户部门级别信息
    getUserDep() {
      GET(process.env.VUE_APP_DOMAIN_performance + "/hrUserInfoByRegId", { regid: this.id })
        .then(res => {
          this.userDep = res.data
          // console.log(this.userDep)
          // console.log(this.userDep.deptName)
          // this.userDep.deptName = '效果管理部'
          // this.userDep.deptName = '品质管理部'
          // this.userDep.deptName = '监察部'
          // this.userDep.deptName = '总裁办公会'
          // this.userDep.deptName = '董事会'
          // this.userDep.positionCode = 4
          // this.userDep.regid = 17434585//刘连
          // this.userDep.positionCode = 3
          // this.userDep.regid = 17434102//李克臣
          // this.userDep.positionCode = 2
          // this.userDep.regid = 17447906//谢宇

          if (this.performanceRankOpe == true) {
            //业绩排名内管理员权限

            this.performance_rank_manage = true
            this.performance_rank_vice = true
            this.performance_rank_minister = true
            this.performance_rank_personal = true
          } else if (this.userDep.deptName == "业务部") {
            if (this.userDep.positionCode == 4) {
              //根据级别显示业绩排名的tabs
              this.performance_rank_manage = true
              this.performance_rank_vice = true
              this.performance_rank_minister = true
              this.performance_rank_personal = true
            } else if (this.userDep.positionCode == 3) {
              this.performance_rank_vice = true
              this.performance_rank_minister = true
              this.performance_rank_personal = true
              this.roleSelect = "副总经理业绩"
            } else if (this.userDep.positionCode == 2) {
              this.performance_rank_minister = true
              this.performance_rank_personal = true
              this.roleSelect = "部长业绩"
            } else {
              this.performance_rank_personal = true
              this.roleSelect = "个人业绩"
            }
          } else {
            //品质管理部,监察部
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // dissentForm中上传文件
    beforeRemove1(file) {
      //删除文件之前的钩子
      this.dissentFormPic = null
    },
    beforeUploadPic(file) {
      //上传文件之前的钩子
      console.log("上传文件之前的回调", file)
      let testFileType = file.name.substring(file.name.lastIndexOf(".") + 1) //截取文件后缀
      const extension1 = testFileType === "png"
      const extension2 = testFileType === "jpeg"
      if (!extension1 && !extension2) {
        this.$message.error("上传数据文件只能是 jepg/png 格式!")
      }
      return extension1 || extension2
    },
    handleSuccess1(res, file, fileList) {
      //上传文件接口调取成功回调
      if (res.status == 200) {
        //文件上传成功
        console.log("上传数据成功", res)
        this.dissentFormPic = res.data
      } else {
        //文件上传失败失败
        console.log("上传数据失败", res)
      }
    },
    beforeRemove2(file) {
      this.dissentFormVoice = null
    },
    beforeUploadVoice(file) {
      //上传文件之前的钩子
      console.log("上传文件之前的回调", file)
      let testFileType = file.name.substring(file.name.lastIndexOf(".") + 1) //截取文件后缀
      const extension1 = testFileType === "mp3"
      const extension2 = testFileType === "wav"
      if (!extension1 && !extension2) {
        //
        this.$message.error("上传数据文件只能是 mp3 格式!")
      }
      return extension1 || extension2
    },
    handleSuccess2(res, file, fileList) {
      if (res.status == 200) {
        console.log("上传数据成功", res)
        this.dissentFormVoice = res.data
      } else {
        console.log("上传数据失败", res)
      }
    },
    // 个人业绩-详情上传文件
    beforeRemove3(file) {
      //删除文件之前的钩子
      this.appealFormPic = null
    },
    handleSuccess3(res, file, fileList) {
      //上传文件接口调取成功回调
      if (res.status == 200) {
        //文件上传成功
        console.log("上传数据成功", res)
        this.appealFormPic = res.data
      } else {
        //文件上传失败失败
        console.log("上传数据失败", res)
      }
    },
    beforeRemove4(file) {
      this.appealFormVoice = null
    },
    handleSuccess4(res, file, fileList) {
      if (res.status == 200) {
        console.log("上传数据成功", res)
        this.appealFormVoice = res.data
      } else {
        console.log("上传数据失败", res)
      }
    },
    handleClick(tab, event) {
      //业绩排名tabs切换获取数据
      console.log(this.activeName)
      if (this.activeName == "first") {
        this.performanceSearch()
      } else if (this.activeName == "second") {
        console.log(this.roleSelect)

        if (this.roleSelect == "总经理业绩") {
          //判断数据不存在的话去请求
          if (this.manageData.length == 0) {
            this.getRankData(4, "manageData")
          }
        } else if (this.roleSelect == "副总经理业绩") {
          if (this.viceData.length == 0) {
            this.getRankData(3, "viceData")
          }
        } else if (this.roleSelect == "部长业绩") {
          if (this.ministerData.length == 0) {
            this.getRankData(2, "ministerData")
          }
        } else {
          if (this.headmanData.length == 0) {
            this.getRankData(0, "headmanData")
          }
        }
      } else if (this.activeName == "third") {
        //申诉记录
        this.appealSearch()
      } else if (this.activeName == "four") {
        //团队业绩
        this.teamClassify()
      } else if (this.activeName === "six") {
        this.JS_BA()
      } else if (this.activeName === "seven") {
        this.JS_IA_search()
      } else if (this.activeName === "eight") {
        // 888
        this.difDiseaseSearch()
      } else if (this.activeName === "nine") {
        this.js_MH_search()
      }
    },
    // 个人业绩
    querySearch(queryString, cb) {
      // console.log(queryString);
      POST(process.env.VUE_APP_DOMAIN_personnel + "/hrUserInfos", { nameOrNumber: queryString })
        .then(res => {
          // console.log(res);
          let arr = res.data
          let result = []
          for (var i in arr) {
            let obj = {}
            obj.value = arr[i].nameNumberDept
            obj.payOperid = arr[i].regid
            result.push(obj)
          }
          cb(result)
        })
        .catch(error => {
          console.log(error)
        })
    },
    handleSelect(item) {
      // console.log(item);
      this.searchId = item.payOperid
      // this.id = item.payOperid
    },
    JS_select() {
      if (this.state.indexOf(")") == -1) {
        this.state = ""
      }
    },
    personalSortChange(column) {
      //排序
      if (column.prop == "payAmount") {
        if (column.order == "ascending") {
          //升
          this.personSortFlag = "payAmountUp"
          this.performanceSearch()
        } else {
          //降
          this.personSortFlag = "payAmountDown"
          this.performanceSearch()
        }
      } else if (column.prop == "payTime") {
        if (column.order == "ascending") {
          //升
          this.personSortFlag = "payTimeUp"
          this.performanceSearch()
        } else {
          //降
          this.personSortFlag = "payTimeDown"
          this.performanceSearch()
        }
      } else if (column.prop == "finalAccountingRepayment") {
        if (column.order == "ascending") {
          //升
          this.personSortFlag = "finalAccountingRepaymentUp"
          this.performanceSearch()
        } else {
          //降
          this.personSortFlag = "finalAccountingRepaymentDown"
          this.performanceSearch()
        }
      } else {
        this.personSortFlag = ""
        this.performanceSearch()
      }
    },
    personHandleSizeChange(val) {
      this.personSize = val
      this.performanceSearch()
    },
    personHandlecurrentChange(val) {
      this.personCurrent = val
      this.performanceSearch()
    },
    performanceSearch() {
      console.log(this.state)

      let searchObj = {
        current: this.personCurrent,
        size: this.personSize,
        statisticsDate: this.personSearch.batch || "", //年月
        payCasetypeChi: this.personSearch.payCasetypeChi //业务类型
      }
      if (this.state == "") {
        searchObj.payOperid = this.id //经办人员工id
      } else {
        searchObj.payOperid = this.searchId //经办人员工id
      }
      if (this.personSortFlag == "payAmountUp") {
        searchObj.ascs = ["pay_amount"]
      } else if (this.personSortFlag == "payAmountDown") {
        searchObj.descs = ["pay_amount"]
      } else if (this.personSortFlag == "payTimeUp") {
        searchObj.ascs = ["pay_time"]
      } else if (this.personSortFlag == "payTimeDown") {
        searchObj.descs = ["pay_time"]
      } else if (this.personSortFlag == "finalAccountingRepaymentUp") {
        searchObj.ascs = ["final_accounting_repayment"]
      } else if (this.personSortFlag == "finalAccountingRepaymentDown") {
        searchObj.descs = ["final_accounting_repayment"]
      }
      // console.log('搜索对象', searchObj)
      //this.loading = true //开启动画
      POST(process.env.VUE_APP_DOMAIN_performance + "/individualPerformanceDetails", searchObj)
        .then(res => {
          // this.loading = false //关闭动画
          if (res.data.page) {
            this.performanceTableData = res.data.page.records //set表格的值
            this.performanceTotalData = res.data.individualPerformanceTotal
            this.personCurrent = res.data.page.current //set当前页
            this.personPages = res.data.page.pages //总记录条数
            this.personSize = res.data.page.size //每页显示记inter
            this.personTotal = res.data.page.total //总记录条数
          } else {
            this.performanceTableData = []
            this.performanceTotalData = []
            this.personCurrent = 1 //set当前页
            this.personTotal = 0
          }
        })
        .catch(error => {
          this.loading = false //关闭动画
          console.log(error)
        })
    },
    getPersonDetail(id) {
      //获取个人业绩详情
      GET(process.env.VUE_APP_DOMAIN_performance + "/individualPerformance", { id: id })
        .then(res => {
          //查询薪资类型模板
          // console.log(res.data);
          this.appealPayId = res.data.payId
          this.perfoBaseDetail = res.data
          this.perfoDetail = true
        })
        .catch(error => {
          console.log(error)
        })
    },
    appeal_sure(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.innerVisible = true
        }
      })
    },
    complainDialogClose() {
      this.reset("appealForm")
    },
    reset(formName) {
      //新增重置按钮
      this.complainDialog = false
      this.$refs[formName].resetFields()
    },
    resetOnly(formName) {
      //新增重置按钮
      this.$refs[formName].resetFields()
    },
    appeal_save(formName) {
      //提交申诉详情
      let searchObj = { appealTatus: "0", createUser: this.id }
      searchObj.appealContent = this[formName].content
      searchObj.payId = this.appealPayId
      let arr = this[formName].checkList
      let arrString = ""
      let arrFlag = false
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] == "还款金额有误") {
          arrString += (arrFlag == true ? "," : "") + "1"
          arrFlag = true
        } else if (arr[i] == "折算比例有误") {
          arrString += (arrFlag == true ? "," : "") + "2"
          arrFlag = true
        } else if (arr[i] == "搁置比例有误") {
          arrString += (arrFlag == true ? "," : "") + "3"
          arrFlag = true
        } else if (arr[i] == "绩效有误") {
          arrString += (arrFlag == true ? "," : "") + "4"
          arrFlag = true
        } else if (arr[i] == "业绩归属有误") {
          arrString += (arrFlag == true ? "," : "") + "5"
          arrFlag = true
        } else {
          arrString += (arrFlag == true ? "," : "") + "6"
          arrFlag = true
        }
      }
      searchObj.appealReason = arrString
      if (this.appealFormPic != null) {
        searchObj.imgId = this.appealFormPic
      }
      if (this.appealFormVoice != null) {
        searchObj.audioId = this.appealFormVoice
      }
      // console.log(searchObj);
      this.complainDialog = false
      this.innerVisible = false
      POST(process.env.VUE_APP_DOMAIN_performance + "/appealPerformance", searchObj)
        .then(res => {
          this.$message({
            type: "success",
            message: "提交申诉成功!",
            showClose: true
          })
          this.performanceSearch()
        })
        .catch(error => {
          console.log(error)
        })
    },
    getDissentDetail(payId) {
      //个人业绩查看已申诉详情
      GET(process.env.VUE_APP_DOMAIN_performance + "/appealPerformance", { payId: payId })
        .then(res => {
          //查询薪资类型模板
          // console.log(res.data);
          this.complainDetailData = res.data
          this.complainDetail = true
        })
        .catch(error => {
          console.log(error)
        })
    },
    getPic(imgId) {
      // this.picVisible = true
      // console.log(imgId);
      let url = process.env.VUE_APP_DOMAIN_download + "/oss/download?view=true&key=" + imgId
      window.open(url)
    },
    getVoice(audioId) {
      // this.voiceVisible = true
      let url = process.env.VUE_APP_DOMAIN_download + "/oss/download?view=true&key=" + audioId
      window.open(url)
    },
    baseInfoSearch(formName) {
      //业绩归属异议搜索
      this.$refs[formName].validate(valid => {
        if (valid) {
          let searchObj = {
            payCasetypeChi: this[formName].typeSelect,
            cardIdnumber: this[formName].idNumber
          }
          POST(process.env.VUE_APP_DOMAIN_performance + "/individualPerformanceList", searchObj)
            .then(res => {
              //console.log(searchObj);
              this.searchTabData = res.data
              this.searchTab = true
            })
            .catch(error => {
              console.log(error)
            })
        }
      })
    },
    setSearchFlag() {
      //点击X关闭重置数据
      this.searchFlag = 0
      this.addperfoDissent = false
    },
    addperfoDissentPre() {
      this.addperfoDissent = true
      this.addperfoDissentSearchform = {
        typeSelect: "",
        idNumber: ""
      }
      this.dissentForm = {
        content: ""
      }
    },
    selectItem(item) {
      // console.log(item);
      this.addperfoDissentform = item
      this.addperfoDissentform.payCasetypeChi = parseInt(item.payCasetypeChi)
      this.addperfoDissentform.payTime = item.payTime.split(" ")[0]
      this.appealPayId = item.payId
      this.searchTab = false
      this.searchFlag = 1
    },
    dissent_save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let searchObj = { appealTatus: "0" }
          searchObj.appealContent = this[formName].content
          searchObj.payId = this.appealPayId
          searchObj.appealReason = "5"
          searchObj.createUser = this.id
          // console.log(searchObj);
          if (this.dissentFormPic != null) {
            searchObj.imgId = this.dissentFormPic
          }
          if (this.dissentFormVoice != null) {
            searchObj.audioId = this.dissentFormVoice
          }
          // console.log(searchObj);
          POST(process.env.VUE_APP_DOMAIN_performance + "/appealPerformance", searchObj)
            .then(res => {
              this.$message({
                type: "success",
                message: "提交业绩归属异议成功!",
                showClose: true
              })
              if (this.activeName == "first") {
                this.performanceSearch()
              } else if (this.activeName == "third") {
                this.appealSearch()
              }
              this.searchFlag = 0
              this.addperfoDissent = false
            })
            .catch(error => {
              console.log(error)
            })
        }
      })
    },
    getPersonalPerformance() {
      const loading = this.$loading({
        //
        lock: true,
        text: "正在获取个人业绩，请稍等片刻",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      })
      GET(process.env.VUE_APP_DOMAIN_performance + "/individualPerformanceInfo", { statisticsDate: this.personSearch.batch })
        .then(res => {
          loading.close() //关闭loading
          if (res.code == 0) {
            this.$message({
              type: "success",
              message: "获取个人业绩成功!",
              showClose: true
            })
            this.performanceSearch()
          }
        })
        .catch(error => {
          loading.close() //关闭loading
          console.log(error)
        })
    },
    //申诉记录
    appealSortChange(column) {
      if (column.prop == "createTime") {
        if (column.order == "ascending") {
          //升
          this.appealSortFlag = "createTimeUp"
          this.appealSearch()
        } else {
          //降
          this.appealSortFlag = "createTimeDown"
          this.appealSearch()
        }
      } else {
        this.appealSortFlag = ""
        this.appealSearch()
      }
    },
    appealHandleSizeChange(val) {
      this.appealSize = val
      this.appealSearch()
    },
    appealHandlecurrentChange(val) {
      this.appealCurrent = val
      this.appealSearch()
    },
    appealSearch() {
      let searchObj = {
        current: this.appealCurrent,
        size: this.appealSize,
        payCasetypeChi: this.appealFormSearch.type,
        createTimeStart: this.appealFormSearch.time ? this.appealFormSearch.time[0] : "",
        createTimeEnd: this.appealFormSearch.time ? this.appealFormSearch.time[1] : "",
        appealReason: this.appealFormSearch.reason,
        createUser: this.id
      }
      if (this.appealSortFlag == "createTimeUp") {
        searchObj.ascs = ["create_time"]
      } else if (this.appealSortFlag == "createTimeDown") {
        searchObj.descs = ["create_time"]
      }
      this.loading = true //开启动画
      POST(process.env.VUE_APP_DOMAIN_performance + "/appealPerformances", searchObj)
        .then(res => {
          // this.loading = false //关闭动画
          this.appealData = res.data.records //set表格的值
          this.appealCurrent = res.data.current //set当前页
          this.appealPages = res.data.pages //总记录条数
          this.appealSize = res.data.size //每页显示记inter
          this.appealTotal = res.data.total //总记录条数
        })
        .catch(error => {
          this.loading = false //关闭动画
          console.log(error)
        })
    },
    replyAppeal(payId) {
      //回复申诉
      GET(process.env.VUE_APP_DOMAIN_performance + "/appealPerformance", { payId: payId })
        .then(res => {
          //查询薪资类型模板
          // console.log(res.data);
          this.replyAppealData = res.data
          this.replayDialog = true
          this.replyAppealId = res.data.id
        })
        .catch(error => {
          console.log(error)
        })
    },
    replyAppeal_save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // this.replayDialog = false
          let saveObj = {}
          saveObj.handleResult = this[formName].content
          saveObj.id = this.replyAppealId
          saveObj.updateUser = this.id
          this[formName]
          PUT(process.env.VUE_APP_DOMAIN_performance + "/appealPerformance", saveObj)
            .then(res => {
              this.$message({
                type: "success",
                message: "回复申诉成功!",
                showClose: true
              })
              this.appealSearch() //刷新表格，重新获取数据
              this.replayDialog = false //关闭修改弹框
              this.resetOnly("replyAppealForm")
            })
            .catch(error => {
              console.log(error)
            })
        }
      })
    },
    exportAppealData() {
      //申诉导出
      let searchObj = {
        payCasetypeChi: this.appealFormSearch.type,
        createTimeStart: this.appealFormSearch.time[0] || "",
        createTimeEnd: this.appealFormSearch.time[1] || "",
        appealReason: this.appealFormSearch.reason,
        createUser: this.id
      }
      // console.log(searchObj);

      let url = process.env.VUE_APP_DOMAIN_performance + "/appealExportExcel?token=" + localStorage.getItem("token")
      for (let i in searchObj) {
        url += "&" + i + "=" + searchObj[i]
      }
      window.location.href = url
    },
    // 团队业绩
    teamHandleSizeChange(val) {
      this.personSize = val
      this.teamSearch()
    },
    teamHandlecurrentChange(val) {
      this.personCurrent = val
      this.teamSearch()
    },
    batchChange() {
      this.teamClassify()
      this.teamFormSearch.manager = "" //重新选定日期清空select
      this.teamFormSearch.aManager = ""
      this.teamFormSearch.minister = ""
    },
    teamClassify() {
      //团队业绩分类查询
      console.log("个人信息", this.userDep)
      if (this.teamPerformanceOpe == true) {
        //权限处理
        this.getLevelMember("manageOptions", 4, "")
        this.positionCode = 4
        this.teamSearch()
      } else if (this.userDep.positionCode == 4) {
        //角色总经理，以下为业务部权限处理
        console.log("总经理来了")
        this.getLevelMember("viceOptions", 3, this.userDep.regid) //刘连
        this.manageDisable = true
        this.positionCode = 3
        this.userNum = this.userDep.regid
        this.teamSearch()
      } else if (this.userDep.positionCode == 3) {
        //角色副总
        this.getLevelMember("ministerOptions", 2, this.userDep.regid) //彭凤贵
        this.manageDisable = true
        this.viceDisable = true
        this.positionCode = 2
        this.userNum = this.userDep.regid
        this.teamSearch()
      } else if (this.userDep.positionCode == 2) {
        //角色部长查看组员信息，无组长
        this.manageDisable = true
        this.viceDisable = true
        this.ministerDisable = true
        this.positionCode = 0
        this.userNum = this.userDep.regid
        this.teamSearch()
      } else {
        this.manageDisable = true
        this.viceDisable = true
        this.ministerDisable = true
      }
    },
    getLevelMember(optionName, code, parentId) {
      //获取某级别下人员列表及赋值
      POST(process.env.VUE_APP_DOMAIN_performance + "/uerPositions", { positionCode: code, parentId: parentId, statisticsDate: this.teamFormSearch.batch })
        .then(res => {
          console.log(res)
          this[optionName] = res.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    getVice(val) {
      //select选择总经理后自动获取其下的副总
      this.getLevelMember("viceOptions", 3, val)
      console.log(this.teamFormSearch)
      this.teamFormSearch.aManager = "" //重新选定上级清空已选择下级select
      this.teamFormSearch.minister = ""
      this.ministerOptions = [] //重新选定上级清空已选择下级options
    },
    getMinister(val) {
      //select选择副总经理后自动获取其下的副总
      this.getLevelMember("ministerOptions", 2, val)
      this.teamFormSearch.minister = "" //重新选定上级清空已选择下级select
    },
    teamSearch() {
      let searchObj = {
        current: this.personCurrent,
        size: this.personSize,
        positionCode: this.positionCode,
        statisticsDate: this.teamFormSearch.batch
      }
      searchObj = { ...searchObj, ...this.formSearch }
      if (this.positionCode == 3) {
        //根据positionCode判断传递的参数key
        searchObj.managerId = this.userNum
      } else if (this.positionCode == 2) {
        searchObj.viceId = this.userNum
        // } else if (this.positionCode == 1) {
      } else if (this.positionCode == 0) {
        searchObj.ministerId = this.userNum
      }
      if (this.teamFormSearch.minister) {
        //select选择后对请求参数进行格式化
        delete searchObj.managerId
        delete searchObj.viceId
        searchObj.ministerId = this.teamFormSearch.minister
        searchObj.positionCode = 0
      } else if (this.teamFormSearch.aManager) {
        delete searchObj.managerId
        delete searchObj.ministerId
        searchObj.viceId = this.teamFormSearch.aManager
        searchObj.positionCode = 2
      } else if (this.teamFormSearch.manager) {
        delete searchObj.viceId
        delete searchObj.ministerId
        searchObj.managerId = this.teamFormSearch.manager
        searchObj.positionCode = 3
      }
      this.loading = true //开启动画
      POST(process.env.VUE_APP_DOMAIN_performance + "/teamPerformanceTotals", searchObj)
        .then(res => {
          this.loading = false //关闭动画
          this.teamData = res.data.records //set表格的值
          this.teamCurrent = res.data.current //set当前页
          this.teamPages = res.data.pages //总记录条数
          this.teamSize = res.data.size //每页显示记inter
          this.teamTotal = res.data.total //总记录条数
        })
        .catch(error => {
          this.loading = false //关闭动画
          console.log(error)
        })
      let searchObj2 = Object.assign({}, searchObj)
      delete searchObj2.current
      delete searchObj2.size
      POST(process.env.VUE_APP_DOMAIN_performance + "/teamPerformanceTotalCount", searchObj2)
        .then(res => {
          //列表总计内的参数
          if (res.data) {
            this.teamTotalData = res.data
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    getSummaries(param) {
      //总计
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总计"
          return
        }
        if (index === 6) {
          sums[index] = this.teamTotalData.repaymentMoneyTotalCount
        } else if (index === 7) {
          sums[index] = this.teamTotalData.convertTotalCount
        } else if (index === 8) {
          sums[index] = this.teamTotalData.shelveperTotalCount
        } else if (index === 9) {
          sums[index] = this.teamTotalData.returnMoneyTotalCount
        } else if (index === 10) {
          sums[index] = this.teamTotalData.expectedPerformanceCommissionlCount
        } else {
          sums[index] = "--"
        }
      })
      // console.log(sums);
      return sums
    },

    createTeamRank() {
      //生成绩效排名
      const loading = this.$loading({
        lock: true,
        text: "正在生成绩效排名，请稍等片刻",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      })
      GET(process.env.VUE_APP_DOMAIN_performance + "/teamPerformanceTotalInfo", { statisticsDate: this.teamFormSearch.batch })
        .then(res => {
          //查询薪资类型模板
          loading.close() //关闭loading
          if (res.code == 0) {
            this.$message({
              type: "success",
              message: "生成绩效排名成功!",
              showClose: true
            })
          }
        })
        .catch(error => {
          loading.close() //关闭loading
          console.log(error)
        })
    },
    teamExport() {
      //团队业绩导出
      let searchObj = {
        statisticsDate: this.teamFormSearch.batch,
        positionCode: this.positionCode
      }
      if (this.positionCode == 3) {
        //根据positionCode判断传递的参数key
        searchObj.managerId = this.userNum
      } else if (this.positionCode == 2) {
        searchObj.viceId = this.userNum
      } else if (this.positionCode == 0) {
        searchObj.ministerId = this.userNum
      }
      if (this.teamFormSearch.minister) {
        //select选择后对请求参数进行格式化
        delete searchObj.managerId
        delete searchObj.viceId
        searchObj.ministerId = this.teamFormSearch.minister
        searchObj.positionCode = 0
      } else if (this.teamFormSearch.aManager) {
        delete searchObj.managerId
        delete searchObj.ministerId
        searchObj.viceId = this.teamFormSearch.aManager
        searchObj.positionCode = 2
      } else if (this.teamFormSearch.manager) {
        delete searchObj.viceId
        delete searchObj.ministerId
        searchObj.managerId = this.teamFormSearch.manager
        searchObj.positionCode = 3
      }
      let url = process.env.VUE_APP_DOMAIN_performance + "/teamPerformanceTotalExcel?token=" + localStorage.getItem("token") + "&statisticsDate=" + searchObj.statisticsDate + "&positionCode=" + searchObj.positionCode
      if (searchObj.viceId) {
        url += "&viceId=" + searchObj.viceId
      } else if (searchObj.ministerId) {
        url += "&ministerId=" + searchObj.ministerId
      } else if (searchObj.managerId) {
        url += "&managerId=" + searchObj.managerId
      }
      window.location.href = url
    },
    teamerHandleSizeChange(val) {
      // 团队成员业绩详情
      this.teamerSize = val
      this.getTeamerData(this.teamerItem)
    },
    teamerHandlecurrentChange(val) {
      this.teamerCurrent = val
      this.getTeamerData(this.teamerItem)
    },
    teamerSearch() {
      this.getTeamerData(this.teamerItem)
    },
    getTeamerData(item) {
      this.teamerItem = item
      this.teamerFlag = true
      let searchObj = {
        current: this.teamerCurrent,
        size: this.teamerSize,
        statisticsDate: this.teamFormSearch.batch || "",
        payCasetypeChi: this.teamerSearchForm.payCasetypeChi,
        payOpername: this.teamerSearchForm.name,
        payOpernumber: this.teamerSearchForm.employedNo,
        ascs: ["performance_ranking"]
      }
      if (item.positionCode == "4") {
        searchObj.managerId = item.managerId
      } else if (item.positionCode == "3") {
        searchObj.viceId = item.viceId
      } else if (item.positionCode == "2") {
        searchObj.ministerId = item.ministerId
      } else {
        searchObj.headmanId = item.headmanId
      }
      // console.log(searchObj);
      POST(process.env.VUE_APP_DOMAIN_performance + "/individualPerformanceTotalList", searchObj)
        .then(res => {
          let arr = res.data.records //set表格的值
          for (var i in arr) {
            let levelArr = arr[i].levelexpand.split(".")
            levelArr.splice(0, 2)
            levelArr.pop()
            if (levelArr[0].split("_")[0] == "周雄") {
              levelArr.shift()
            }
            let levelStr = ""
            for (var j in levelArr) {
              if (j != 0) {
                levelStr += "_"
              }
              levelStr += levelArr[j].split("_")[0]
            }
            arr[i].level = levelStr
          }

          this.teamerData = arr
          this.teamerCurrent = res.data.current //set当前页
          this.teamerPages = res.data.pages //总记录条数
          this.teamerSize = res.data.size //每页显示记inter
          this.teamerTotal = res.data.total
        })
        .catch(error => {
          this.loading = false //关闭动画
          console.log(error)
        })
    },
    teamerDialogClose() {
      this.teamerSearchForm = {
        name: "",
        employedNo: "",
        payCasetypeChi: ""
      }
      this.teamerFlag = false
    },
    teamerExport(item) {
      //团队业绩导出
      let searchObj = {
        statisticsDate: this.teamFormSearch.batch || "",
        payCasetypeChi: this.teamerSearchForm.payCasetypeChi,
        payOpername: this.teamerSearchForm.name,
        payOpernumber: this.teamerSearchForm.employedNo
      }
      if (item.positionCode == "4") {
        searchObj.managerId = item.managerId
      } else if (item.positionCode == "3") {
        searchObj.viceId = item.viceId
      } else if (item.positionCode == "2") {
        searchObj.ministerId = item.ministerId
      } else {
        searchObj.headmanId = item.headmanId
      }
      let url = process.env.VUE_APP_DOMAIN_performance + "/individualPerformanceTotalExcel?token=" + localStorage.getItem("token")
      for (let i in searchObj) {
        url += "&" + i + "=" + searchObj[i]
      }
      console.log(url)
      // window.open(url);
      window.location.href = url
    },
    //业绩排名
    manageHandleSizeChange(val) {
      this.manageSize = val //保存状态-每页显示多少条数据切换
      this.getRankData(4, "manageData")
    },
    manageHandlecurrentChange(val) {
      this.manageCurrent = val //保存状态-当前页
      this.getRankData(4, "manageData")
    },
    viceHandleSizeChange(val) {
      this.viceSize = val
      this.getRankData(3, "viceData")
    },
    viceHandlecurrentChange(val) {
      this.viceCurrent = val
      this.getRankData(3, "viceData")
    },
    ministerHandleSizeChange(val) {
      this.ministerSize = val
      this.getRankData(2, "ministerData")
    },
    ministerHandlecurrentChange(val) {
      this.ministerCurrent = val
      this.getRankData(2, "ministerData")
    },
    headmanHandleSizeChange(val) {
      this.headmanSize = val
      console.log(this.headmanSize)
      this.getRankData(0, "headmanData")
    },
    headmanHandlecurrentChange(val) {
      this.headmanCurrent = val
      this.getRankData(0, "headmanData")
    },
    roleChange(val) {
      this.roleSelect = val
      console.log(this.roleSelect)
      if (this.roleSelect == "总经理业绩") {
        this.getRankData(4, "manageData")
      } else if (this.roleSelect == "副总经理业绩") {
        this.getRankData(3, "viceData")
      } else if (this.roleSelect == "部长业绩") {
        this.getRankData(2, "ministerData")
      } else {
        this.getRankData(0, "headmanData")
      }
    },
    getRankData(positionCode, formName) {
      let searchObj = {
        current: this.personCurrent,
        size: this.personSize,
        positionCode: positionCode,
        statisticsDate: this.rankBatch,
        rankingSection: this.GRankValue || "",
        descs: ["return_money_total"]
      }
      if (formName == "manageData") {
        searchObj.current = this.manageCurrent
        searchObj.size = this.manageSize
      } else if (formName == "viceData") {
        searchObj.current = this.viceCurrent
        searchObj.size = this.viceSize
      } else if (formName == "ministerData") {
        searchObj.current = this.ministerCurrent
        searchObj.size = this.ministerSize
      } else {
        searchObj.current = this.headmanCurrent
        searchObj.size = this.headmanSize
      }

      POST(process.env.VUE_APP_DOMAIN_performance + "/teamPerformanceTotals", searchObj)
        .then(res => {
          // this.loading = false //关闭动画
          this[formName] = res.data.records //set表格的值
          console.log(this[formName])
          if (formName == "manageData") {
            this.manageCurrent = res.data.current //set当前页
            this.managePages = res.data.pages //总记录条数
            this.manageSize = res.data.size //每页显示记inter
            this.manageTotal = res.data.total //总记录条数
          } else if (formName == "viceData") {
            this.viceCurrent = res.data.current //set当前页
            this.vicePages = res.data.pages //总记录条数
            this.viceSize = res.data.size //每页显示记inter
            this.viceTotal = res.data.total //总记录条数
          } else if (formName == "ministerData") {
            this.ministerCurrent = res.data.current //set当前页
            this.ministerPages = res.data.pages //总记录条数
            this.ministerSize = res.data.size //每页显示记inter
            this.ministerTotal = res.data.total //总记录条数
          } else {
            this.headmanCurrent = res.data.current //set当前页
            this.headmanPages = res.data.pages //总记录条数
            this.headmanSize = res.data.size //每页显示记inter
            this.headmanTotal = res.data.total //总记录条数
          }
        })
        .catch(error => {
          this.loading = false //关闭动画
          console.log(error)
        })
    },
    rankSearch() {
      //业绩排名搜索
      if (this.roleSelect == "总经理业绩") {
        this.getRankData(4, "manageData")
      } else if (this.roleSelect == "副总经理业绩") {
        this.getRankData(3, "viceData")
      } else if (this.roleSelect == "部长业绩") {
        this.getRankData(2, "ministerData")
      } else {
        this.getRankData(0, "headmanData")
      }
    },
    exportRank() {
      //业绩排名导出
      let positionCode = ""
      if (this.roleSelect == "总经理业绩") {
        positionCode = 4
      } else if (this.roleSelect == "副总经理业绩") {
        positionCode = 3
      } else if (this.roleSelect == "部长业绩") {
        positionCode = 2
      } else {
        positionCode = 0
      }
      let searchObj = {
        positionCode: positionCode,
        statisticsDate: this.rankBatch,
        rankingSection: this.GRankValue || ""
      }
      console.log(searchObj)
      let url = process.env.VUE_APP_DOMAIN_performance + "/rankingPerformanceExcel?token=" + localStorage.getItem("token")
      for (let i in searchObj) {
        url += "&" + i + "=" + searchObj[i]
      }
      window.location.href = url
    },
    //*****************************个人业绩总台账*************
    // JS_accountSearch() {
    //   this.accountCurrent = 1;
    //   this.accountSc();
    // },
    // bsubmitChange() {
    //   this.accountSc()
    // },
    // ignoreSubmit(id) {
    //   let ignoreObj = {
    //     "id": id
    //   }
    //   // console.log(ignoreObj)
    //   GET(process.env.VUE_APP_DOMAIN_performance + "/ignoreCommitState", ignoreObj).then(res => {
    //     if (res.code == 0) {
    //       this.$message({
    //         type: 'success',
    //         message: '忽略提交成功!',
    //         showClose: true
    //       })
    //       this.accountSc()
    //     }
    //   }).catch(error => {
    //     console.log(error)
    //   })
    // },
    // cancelIgnore(id) {
    //   let ignoreObj = {
    //     "id": id
    //   }
    //   GET(process.env.VUE_APP_DOMAIN_performance + "/unIgnoreCommitState", ignoreObj).then(res => {
    //     if (res.code == 0) {
    //       this.$message({
    //         type: 'success',
    //         message: '取消忽略成功!',
    //         showClose: true
    //       })
    //       this.accountSc()
    //     }
    //   }).catch(error => {
    //     console.log(error)
    //   })
    // },
    // accountSc() {
    //   //查询对象,初始化值
    //   let searchObj = {
    //     calcDate: this.accountSearch.batch, //年月（批次号）
    //     userName: this.accountMoreSearch.name, // 员工姓名
    //     employedNo: this.accountMoreSearch.employedNo, //员工编号
    //     caseType: this.accountSearch.payCasetype,
    //     userLevel: this.accountSearch.userLevel,
    //     current: this.accountCurrent, //当前页码
    //     size: this.accountSize, //每页显示记录条数
    //     boolCommit: this.bsubmitValue || '' //表头提交状态
    //   };
    //   this.accountLoading = true; //开启动画
    //   //调取数据
    //   console.log(searchObj)
    //   POST(process.env.VUE_APP_DOMAIN_performance + "/achievements", searchObj).then(res => {
    //     this.accountLoading = false;
    //     this.accountData = res.data.records; //set表格的值
    //     this.accountCurrent = res.data.current; // set当前页
    //     this.accountSize = res.data.size; //每页显示记录条数
    //     this.accountTotal = res.data.total; //总记录数据
    //   }).catch(error => {
    //     console.log(error);
    //   });
    //   //总计
    //   POST(process.env.VUE_APP_DOMAIN_performance + "/getAchievementSum", searchObj).then(resd => {
    //     this.accountAmt = "总计：个人总绩效：" + (resd.data.personalExtract || "--")
    //       + " 团队绩效提成：" + (resd.data.teamExtract || "--")
    //       + " 绩效计提：" + (resd.data.achieveMoney || "--");
    //   }).catch(error => {
    //     this.accountAmt = "总计：个人总绩效：--    团队绩效提成：--    绩效计提：--";
    //     console.log(error);
    //   });
    //   //总台账判断数据是否上锁
    //   this.isLock();
    // },
    // isLock() {//总台账是否上锁
    //   GET(process.env.VUE_APP_DOMAIN_performance + "/checkAchievementDataLock", { batch: this.accountSearch.batch }).then(res => {
    //     if (res.data == true) {//已锁定
    //       this.isLockFlag = true
    //     } else {
    //       this.isLockFlag = false
    //     }
    //   }).catch(error => {
    //     console.log(error)
    //   })
    // },
    accountCurrentChange(val) {
      //当前页，点击页码
      this.accountCurrent = val
      this.accountSc()
    },
    accountSizeChange(val) {
      //分页,下拉
      this.accountSize = val
      this.accountSc()
    },
    // // 生成生成总台账弹窗按钮
    // JS_create() {
    //   this.progress = 0; //进度清空
    //   this.createAccountForm = true; //显示进度窗
    // },
    // JS_reset() {//重置提交

    // },
    // createProgress() {//生成总台账
    //   var that = this
    //   GET(process.env.VUE_APP_DOMAIN_performance + "/calcAchievement", { yearMonth: this.accountSearch.batch }).then(res => {
    //     //获取生成的进度
    //     window.timer = setInterval(function () {
    //       GET(process.env.VUE_APP_DOMAIN_performance + "/getCalcStatus").then(resd => {
    //         if (resd.data) {
    //           that.progress = resd.data.progress; //进度条占比
    //           if (that.progress == 100) {
    //             window.clearInterval(timer)
    //             that.messagePopp('success', '生成业绩总台账成功！')
    //             that.createAccountForm = false
    //           } else if (that.progress == -1) {
    //             window.clearInterval(timer)
    //             that.statusText = resd.data.statusText
    //           }
    //         } else {//当后台返回只有code时，判定出错
    //           window.clearInterval(timer)
    //           that.statusText = "生成业绩总台账出错！"
    //         }
    //       }).catch(error => {
    //         console.log(error);
    //       });
    //     }, 1000)
    //   }).catch(error => {
    //     console.log(error);
    //   });
    // },
    // cancelAccount() {
    //   this.createAccountForm = false
    //   window.clearInterval(timer)
    // },
    // JS_exportAll() { //导出所有
    //   //下载文件
    //   window.location.href = process.env.VUE_APP_DOMAIN_performance + "/exportData?token=" + localStorage.getItem("token")
    //     + "&batch=" + this.accountSearch.batch
    //     + "&userName=" + this.accountMoreSearch.name
    //     + "&employeeNo=" + this.accountMoreSearch.employedNo
    //     + "&userLevel=" + this.accountSearch.userLevel
    //     + "&boolCommit=" + this.bsubmitValue
    //     + "&caseType=" + this.accountSearch.payCasetype;
    // },
    // JS_report_data() { // 上报数据
    //   this.$msgBox.confirm(
    //     `<span>请确认你所上报的${this.accountSearch.batch}月份</span><span style="color:red;">【个人业绩总台账】</span><span>无误，确认提交后，将直接影响工资准确发放。</span>`,
    //     "温馨提示",
    //     {
    //       dangerouslyUseHTMLString: true,
    //       confirmButtonText: "确定",
    //       cancelButtonText: "取消",
    //       type: "warning"
    //     }
    //   ).then(() => {
    //     const loading = this.$loading({//上报数据，锁定页面loading
    //       lock: true,
    //       text: '正在上报数据，请稍等片刻',
    //       spinner: 'el-icon-loading',
    //       background: 'rgba(0, 0, 0, 0.7)'
    //     })
    //     POST(process.env.VUE_APP_DOMAIN_performance + "/reportAchievementData", { batch: this.accountSearch.batch }).then(res => {
    //       // console.log("个人业绩总台账上报数据", res)
    //       loading.close() //关闭loading
    //       this.messagePopp("success", "上报数据成功！");
    //       this.accountSc() //搜索并且判断数据是否上锁
    //     }).catch(error => {
    //       loading.close() //关闭loading
    //       console.log(error)
    //     })
    //   }).catch(() => {
    //     console.log("");
    //   })
    // },
    // //提示框
    // messagePopp(type, msg) {
    //   this.$message({
    //     showClose: true,
    //     type: type,
    //     message: msg
    //   });
    // },
    // JS_cancel_submit() { //解锁
    //   this.$msgBox.confirm(
    //     '<span>确定取消上报数据？</span>',
    //     "温馨提示",
    //     {
    //       dangerouslyUseHTMLString: true,
    //       confirmButtonText: "确定",
    //       cancelButtonText: "取消",
    //       type: "warning"
    //     }
    //   ).then(() => {
    //     let searchObj = {
    //       batch: this.accountSearch.batch, //年月（批次号）
    //     }
    //     GET(process.env.VUE_APP_DOMAIN_performance + "/unlockAchievementData", searchObj).then(res => {
    //       console.log(res);
    //       if (res.code == 0) {
    //         this.JS_accountSearch()
    //       }
    //     }).catch(error => {
    //       console.log(error);
    //     });
    //     // this.SubmitStu = true;
    //   }).catch(() => {

    //   })
    // },
    // //更多操作下拉框
    // handleCommandPersonal(command) {
    //   if (command === "a") { //导出所有
    //     this.JS_exportAll();
    //   } else if (command === "b") { //生成业绩总台账
    //     this.JS_create();
    //     this.statusText = ''
    //   } else if (command === "c") {
    //     this.$msgBox.confirm(
    //       '<span>确定重置数据？</span>',
    //       "温馨提示",
    //       {
    //         dangerouslyUseHTMLString: true,
    //         confirmButtonText: "确定",
    //         cancelButtonText: "取消",
    //         type: "warning"
    //       }
    //     ).then(() => {
    //       GET(process.env.VUE_APP_DOMAIN_performance + "/resetSubmit",
    //         {
    //           batch: this.accountSearch.batch
    //         }).then(res => {
    //           if (res.code === 0) {
    //             this.messagePopp("success", "重置成功！")
    //             this.JS_accountSearch()
    //           }
    //         }).catch(error => { })
    //     }).catch(() => {
    //       console.log("失败");
    //     })
    //   } else if (command === "d") { //批量忽略
    //     this.ignoreAll();
    //   }
    // },
    // ignoreAll() {//批量忽略
    //   let searchObj = {
    //     calcDate: this.accountSearch.batch, //年月（批次号）
    //     userName: this.accountMoreSearch.name, // 员工姓名
    //     employedNo: this.accountMoreSearch.employedNo, //员工编号
    //     caseType: this.accountSearch.payCasetype, //业务类型
    //     userLevel: this.accountSearch.userLevel, //级别
    //     boolCommit: this.bsubmitValue || '' //表头提交状态
    //   };
    //   POST(process.env.VUE_APP_DOMAIN_performance + "/ignoreCommitStateBatch", searchObj).then(() => {
    //     this.JS_accountSearch();
    //     this.messagePopp("success", "批量忽略操作成功！")
    //   }).catch(error => {
    //     console.log(error);
    //   });
    // },
    // 生成业绩总台帐666
    yoho() {
      this.JS_BA()
    },
    JS_BA() {
      console.log(this.BAbatch)
      GET(process.env.VUE_APP_DOMAIN_performance + "/achievementdiff/fetchBranchInfo", { calcDate: this.BAbatch, calcType: 0 })
        .then(res => {
          this.buildDifOptions2 = res.data
          if (this.buildDifOptions2.length != 0) {
            this.buildAccountSearch.afterBranch = this.buildDifOptions2[0].key
            this.JS_BA_search("1")
          } else {
            this.buildAccountSearch.afterBranch = ""
            this.BAData = []
            this.BADisabled = false
            this.BACurrent = 1
            this.BASize = 15
            this.BATotal = 0
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    JS_BA_search(flag) {
      let searchObj = {
        calcDate: this.BAbatch,
        branchDate: this.buildAccountSearch.afterBranch,
        current: this.BACurrent,
        size: this.BASize
      }
      if (flag == "1") {
        searchObj.current = 1
      }
      searchObj = { ...searchObj, ...this.BAMoreSearch }
      this.BALoading = true //开启动画
      POST(process.env.VUE_APP_DOMAIN_performance + "/achievements", searchObj)
        .then(res => {
          this.BAData = res.data.records
          this.BALoading = false
          this.BACurrent = res.data.current // set当前页
          this.BASize = res.data.size //每页显示记录条数
          this.BATotal = res.data.total //总记录数据
          this.BACheck()
        })
        .catch(error => {
          console.log(error)
        })

      let searchObj2 = Object.assign({}, searchObj)
      delete searchObj2.current
      delete searchObj2.size
      POST(process.env.VUE_APP_DOMAIN_performance + "/getAchievementSum", searchObj2)
        .then(res => {
          //列表总计内的参数
          console.log(res.data)
          if (res.data) {
            this.BATotalData = res.data
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    BACheck() {
      //检查锁定状态
      let searchObj = {
        batch: this.BAbatch
      }
      console.log("搜索对象", searchObj)
      GET(process.env.VUE_APP_DOMAIN_performance + "/checkAchievementDataLock", searchObj)
        .then(res => {
          console.log(res)
          if (res.code == 0) {
            //锁定
            this.BADisabled = res.data
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    BACurrentChange(val) {
      this.BACurrent = val
      this.JS_BA_search("x")
    },
    BASizeChange(val) {
      this.BASize = val
      this.JS_BA_search("x")
    },
    doBuildAccount() {
      //生成业绩总台帐按钮
      let batch1 = this.BAbatch
      console.log(batch1)
      let batch2 = this.buildAccount.batch
      let batch1Y = batch1.split("-")[0]
      let batch1M = parseInt(batch1.split("-")[1])
      let batch2Y = batch2.split("-")[0]
      let batch2M = parseInt(batch2.split("-")[1])
      if (batch1Y > batch2Y) {
        this.$message.error("时间选择错误！")
        return
      }
      if (batch1Y == batch2Y) {
        if (batch1M > batch2M) {
          this.$message.error("时间选择错误！")
          return
        }
      }
      console.log(this.buildAccount)
      var that = this
      GET(process.env.VUE_APP_DOMAIN_performance + "/calcAchievement", { yearMonth: this.BAbatch, branchDate: this.buildAccount.batch })
        .then(res => {
          this.progress = 0 //进度清空
          this.BAbackFlag = false
          this.createAccountForm = true //显示进度窗
          this.buildAccountFlag = false
          //获取生成的进度
          window.timer = setInterval(function() {
            GET(process.env.VUE_APP_DOMAIN_performance + "/getCalcStatus")
              .then(resd => {
                if (resd.data) {
                  that.progress = resd.data.progress //进度条占比
                  that.statusText = resd.data.statusText
                  console.log(that.progress)
                  if (that.progress == 100) {
                    window.clearInterval(timer)
                    // that.messagePopp('success', '生成业绩总台账成功！')666
                    that.$message.success("生成业绩总台账成功！")
                    that.BAbackFlag = true
                  } else if (that.progress == -1) {
                    window.clearInterval(timer)
                    that.statusText = resd.data.statusText
                    that.BAbackFlag = true
                  }
                } else {
                  //当后台返回只有code时，判定出错
                  window.clearInterval(timer)
                  that.statusText = "生成业绩总台账出错！"
                  that.BAbackFlag = true
                }
              })
              .catch(error => {
                console.log(error)
              })
          }, 1000)
        })
        .catch(error => {
          console.log(error)
        })
    },
    handleCommandBA(command) {
      if (command === "a") {
        this.multiIgnore2()
      } else if (command === "b") {
        //重置提交
        this.$msgBox
          .confirm("<span>确定重置提交？</span>", "温馨提示", {
            dangerouslyUseHTMLString: true,
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            GET(process.env.VUE_APP_DOMAIN_performance + "/resetSubmit", {
              batch: this.BAbatch,
              branch: this.buildAccountSearch.afterBranch
            })
              .then(res => {
                if (res.code === 0) {
                  this.$message.success("重置提交成功！")
                  this.JS_BA_search("1")
                }
              })
              .catch(() => {
                //统一失败提示
              })
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消重置提交！"
            })
          })
      } else if (command === "c") {
        //导出
        window.location.href = process.env.VUE_APP_DOMAIN_performance + "/exportData?token=" + localStorage.getItem("token") + "&batch=" + this.BAbatch + "&branch=" + this.buildAccountSearch.afterBranch
      }
      // else {
      //   // this.performanceFormulaFlag = true
      //   this.seeGongShi()
      // }
    },
    getSummariesBA(param) {
      //总计
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总计"
          return
        }
        if (index === 8) {
          sums[index] = this.BATotalData.repaymentPersonTotal
        } else if (index === 9) {
          sums[index] = this.BATotalData.commissionPersonTotal
        } else if (index === 10) {
          sums[index] = this.BATotalData.repaymentDiffPersonTotal
        } else if (index === 11) {
          sums[index] = this.BATotalData.convertPersonTotal
        } else if (index === 12) {
          sums[index] = this.BATotalData.shelveperPersonTotal
        } else if (index === 13) {
          sums[index] = this.BATotalData.returnMoneyPersonTotal
        } else if (index === 14) {
          sums[index] = this.BATotalData.personalExtract
        } else if (index === 15) {
          sums[index] = this.BATotalData.repaymentTeamTotal
        } else if (index === 16) {
          sums[index] = this.BATotalData.teamExtract
        } else if (index === 17) {
          sums[index] = this.BATotalData.achieveMoney
        } else {
          sums[index] = "--"
        }
      })
      // console.log(sums);
      return sums
    },
    multiIgnore2() {
      //批量忽略
      this.$msgBox
        .confirm("<span>确定批量忽略提交失败数据？</span>", "温馨提示", {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          let obj = {
            calcDate: this.BAbatch, //年月（批次号）
            branchDate: this.buildAccountSearch.afterBranch
          }
          POST(process.env.VUE_APP_DOMAIN_performance + "/ignoreCommitStateBatch", obj)
            .then(res => {
              console.log(res)
              if (res.code == 0) {
                this.JS_BA_search("1")
                this.$message.success("批量忽略成功！")
              }
            })
            .catch(error => {
              console.log(error)
            })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消批量忽略！"
          })
        })
    },
    // seeGongShi() {//查看绩效公式666
    //   let ym = this.BAbatch
    //   ym = ym.replace('-', '')
    //   let obj = {
    //     formulaMonth: ym,
    //     current: 1,
    //     size: 15
    //   }
    //   POST(process.env.VUE_APP_DOMAIN_performance + '/performanceFormulas', obj).then(res => {
    //     // loading.close() //关闭loading
    //     if (res.code == 0) {//锁定

    //     }
    //   }).catch(error => {
    //     // loading.close() //关闭loading
    //     console.log(error)
    //   })
    // },
    update_BA() {
      //上报
      console.log(this.buildAccountSearch.afterBranch)
      if (this.buildAccountSearch.afterBranch == "" || this.buildAccountSearch.afterBranch == null) {
        this.$message.error("上报数据失败！请选择版本")
        return
      }
      this.$msgBox
        .confirm("<span>请确认你要上报" + this.BAbatch + '月份</span><span style="color:red;">【生成版业绩总台账】</span><span>？</span>', "温馨提示", {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          callback: (action, instance) => {
            if (action === "confirm") {
              const loading = this.$loading({
                //上报数据，锁定页面loading
                lock: true,
                text: "正在上报数据，请稍等片刻",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
              })
              let obj = {
                batch: this.BAbatch,
                branch: this.buildAccountSearch.afterBranch
              }
              console.log(obj)
              GET(process.env.VUE_APP_DOMAIN_performance + "/reportAchievementData", obj)
                .then(res => {
                  loading.close() //关闭loading
                  if (res.code == 0) {
                    //锁定
                    this.$message({
                      type: "success",
                      message: "上报数据成功!",
                      showClose: true
                    })
                  }
                  // this.JS_BA_search('1')
                  this.JS_BA()
                })
                .catch(error => {
                  this.JS_BA()
                  loading.close() //关闭loading
                  console.log(error)
                })
            }
          }
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "上报成功！"
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消上报！"
          })
        })
    },
    cancel_updateBA() {
      //取消上报
      this.$msgBox
        .confirm("<span>确定取消上报数据？</span>", "温馨提示", {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          let obj = {
            batch: this.BAbatch
          }
          GET(process.env.VUE_APP_DOMAIN_performance + "/unlockAchievementData", obj)
            .then(res => {
              if (res.code == 0) {
                //锁定
                this.$message({
                  type: "success",
                  message: "取消上报成功!",
                  showClose: true
                })
                // this.JS_BA_search('1')
                this.JS_BA()
              }
            })
            .catch(error => {
              console.log(error)
            })
        })
        .catch(() => {})
    },
    setItem(item) {
      this.item = item
      this.seeDetail()
    },
    seeDetail() {
      //明细666
      let obj = {
        batch: this.item.calcDate,
        branchDate: this.item.branchDate,
        current: this.personalDetailCurrent,
        size: this.personalDetailSize,
        payOperid: this.item.userId
      }
      POST(process.env.VUE_APP_DOMAIN_performance + "/payrecords", obj)
        .then(res => {
          // loading.close() //关闭loading
          if (res.code == 0) {
            this.personalDetailData = res.data.records
            for (var i = 0; i < this.personalDetailData.length; i++) {
              this.personalDetailData[i].userName = this.item.userName
              this.personalDetailData[i].mobilePhone = this.item.mobilePhone
            }
            this.personalDetailCurrent = res.data.current
            this.personalDetailSize = res.data.size
            this.personalDetailTotal = res.data.total
            this.personalDetailFlag = true
          }
          let searchObj2 = Object.assign({}, obj)
          delete searchObj2.current
          delete searchObj2.size
          POST(process.env.VUE_APP_DOMAIN_performance + "/queryPayRecordSum", searchObj2)
            .then(res => {
              //列表总计内的参数
              console.log(res.data)
              if (res.data) {
                this.PayRecordSum = res.data
              }
            })
            .catch(error => {
              console.log(error)
            })
        })
        .catch(error => {
          // loading.close() //关闭loading
          console.log(error)
        })
    },
    personalDetailHandleSizeChange(val) {
      this.personalDetailSize = val
      this.seeDetail()
    },
    personalDetailHandlecurrentChange(val) {
      this.personalDetailCurrent = val
      this.seeDetail()
    },
    getSummariesPD(param) {
      //总计
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总计"
          return
        }
        if (index === 2) {
          sums[index] = this.PayRecordSum.payAmount
        } else if (index === 3) {
          sums[index] = this.PayRecordSum.checkCommission
        } else if (index === 4) {
          sums[index] = this.PayRecordSum.diffAmount
        } else if (index === 6) {
          sums[index] = this.PayRecordSum.afterDiscountAmount
        } else if (index === 8) {
          sums[index] = this.PayRecordSum.shelveAmount
        } else if (index === 9) {
          sums[index] = this.PayRecordSum.accountingAmount
        } else {
          sums[index] = "--"
        }
      })
      // console.log(sums);
      return sums
    },
    seeGongshi(item) {
      if (item.formulaPersonal) {
        this.GStype = item.formulaPersonal
      } else {
        this.GStype = item.gearType
      }
      this.PFDetailFlag = true
    },
    // 导入业绩总台帐777

    JS_IA_search() {
      let searchObj = {
        current: this.IACurrent, //当前页码
        size: this.IASize, //每页显示记录条数
        calcDate: this.importAccountSearch.batch //年月（批次号）
      }
      searchObj = { ...searchObj, ...this.IAMoreSearch }
      console.log(searchObj)
      this.IALoading = true //开启动画
      POST(process.env.VUE_APP_DOMAIN_performance + "/manual/achievements", searchObj)
        .then(res => {
          this.IALoading = false
          this.IAData = res.data.records //set表格的值
          this.IACurrent = res.data.current // set当前页
          this.IASize = res.data.size //每页显示记录条数
          this.IATotal = res.data.total //总记录数据
          this.IACheck()
        })
        .catch(error => {
          this.IALoading = false
          console.log(error)
        })

      let searchObj2 = Object.assign({}, searchObj)
      delete searchObj2.current
      delete searchObj2.size
      POST(process.env.VUE_APP_DOMAIN_performance + "/manual/getAchievementSum", searchObj2)
        .then(res => {
          //列表总计内的参数
          console.log(res.data)
          if (res.data) {
            this.IATotalData = res.data
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    IACheck() {
      //锁定状态
      let searchObj = {
        batch: this.importAccountSearch.batch
      }
      console.log("搜索对象", searchObj)
      GET(process.env.VUE_APP_DOMAIN_performance + "/manual/checkAchievementDataLock", searchObj)
        .then(res => {
          console.log(res)
          if (res.code == 0) {
            //锁定
            this.IADisabled = res.data
          }
          console.log(this.IADisabled)
        })
        .catch(error => {
          console.log(error)
        })
    },
    getSummariesIA(param) {
      //总计
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总计"
          return
        }
        if (index === 9) {
          sums[index] = this.IATotalData.repaymentPersonTotal
        } else if (index === 10) {
          sums[index] = this.IATotalData.commissionPersonTotal
        } else if (index === 11) {
          sums[index] = this.IATotalData.repaymentDiffPersonTotal
        } else if (index === 12) {
          sums[index] = this.IATotalData.convertPersonTotal
        } else if (index === 13) {
          sums[index] = this.IATotalData.shelveperPersonTotal
        } else if (index === 14) {
          sums[index] = this.IATotalData.returnMoneyPersonTotal
        } else if (index === 15) {
          sums[index] = this.IATotalData.personalExtract
        } else if (index === 16) {
          sums[index] = this.IATotalData.repaymentTeamTotal
        } else if (index === 17) {
          sums[index] = this.IATotalData.teamExtract
        } else if (index === 18) {
          sums[index] = this.IATotalData.achieveMoney
        } else {
          sums[index] = "--"
        }
      })
      // console.log(sums);
      return sums
    },
    JS_IASearch() {
      this.IACurrent = 1
      this.JS_IA_search()
      this.search_more_IA = false
    },
    IACurrentChange(val) {
      this.IACurrent = val
      this.JS_IA_search()
    },
    IASizeChange(val) {
      this.IASize = val
      this.JS_IA_search()
    },
    handleCommandIA(command) {
      if (command == "a") {
        console.log(command)
        this.multiIgnore()
      } else if (command == "b") {
        //重置提交
        this.$msgBox
          .confirm("<span>确定重置提交？</span>", "温馨提示", {
            dangerouslyUseHTMLString: true,
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            GET(process.env.VUE_APP_DOMAIN_performance + "/manual/resetSubmit", {
              batch: this.importAccountSearch.batch
            })
              .then(res => {
                if (res.code === 0) {
                  this.$message.success("重置提交成功！")
                  this.JS_IA_search()
                }
              })
              .catch(() => {
                //统一失败提示
              })
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消重置提交！"
            })
          })
      } else {
        this.exportIA()
      }
    },
    multiIgnore() {
      //批量忽略
      this.$msgBox
        .confirm("<span>确定批量忽略提交失败数据？</span>", "温馨提示", {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          let obj = {
            calcDate: this.importAccountSearch.batch //年月（批次号）
          }
          POST(process.env.VUE_APP_DOMAIN_performance + "/manual/ignoreCommitStateBatch", obj)
            .then(res => {
              console.log(res)
              if (res.code == 0) {
                this.JS_IA_search()
                this.$message.success("批量忽略成功！")
              }
            })
            .catch(error => {
              console.log(error)
            })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消批量忽略！"
          })
        })
    },
    exportIA() {
      //导出
      window.location.href = process.env.VUE_APP_DOMAIN_performance + "/manual/exportData?token=" + localStorage.getItem("token") + "&calcDate=" + this.importAccountSearch.batch + "&boolCommit=" + this.IAMoreSearch.boolCommit + "&caseType=" + this.IAMoreSearch.caseType + "&idcard=" + this.IAMoreSearch.idcard + "&userLevel=" + this.IAMoreSearch.userLevel + "&userName=" + this.IAMoreSearch.userName
    },
    update_IA() {
      //上报
      this.$msgBox
        .confirm("<span>请确认你要上报" + this.importAccountSearch.batch + '月份</span><span style="color:red;">【导入版业绩总台账】</span><span>？</span>', "温馨提示", {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          callback: (action, instance) => {
            if (action === "confirm") {
              const loading = this.$loading({
                //上报数据，锁定页面loading
                lock: true,
                text: "正在上报数据，请稍等片刻",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
              })
              let obj = {
                batch: this.importAccountSearch.batch
              }
              console.log(obj)
              GET(process.env.VUE_APP_DOMAIN_performance + "/manual/reportAchievementData", obj)
                .then(res => {
                  loading.close() //关闭loading
                  if (res.code == 0) {
                    //锁定
                    this.$message({
                      type: "success",
                      message: "上报数据成功!",
                      showClose: true
                    })
                  }
                  this.JS_IA_search()
                })
                .catch(error => {
                  this.JS_IA_search()
                  loading.close() //关闭loading
                  console.log(error)
                })
            }
          }
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "上报成功！"
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消上报！"
          })
        })
    },
    cancel_updateIA() {
      //取消上报
      this.$msgBox
        .confirm("<span>确定取消上报数据？</span>", "温馨提示", {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          let obj = {
            batch: this.importAccountSearch.batch
          }
          GET(process.env.VUE_APP_DOMAIN_performance + "/manual/unlockAchievementData", obj)
            .then(res => {
              if (res.code == 0) {
                //锁定
                this.$message({
                  type: "success",
                  message: "取消上报成功!",
                  showClose: true
                })
                this.JS_IA_search()
              }
            })
            .catch(error => {
              console.log(error)
            })
        })
        .catch(() => {})
    },
    // beforeRemoveAccount(file) {
    //   //删除文件之前的钩子
    //   return this.$msgBox.confirm(`确定移除 ${file.name}？`);
    // },
    beforeUploadAccount(file) {
      //上传文件之前的钩子
      console.log("上传文件之前的回调", file)
      let testFileType = file.name.substring(file.name.lastIndexOf(".") + 1) //截取文件后缀
      const extension1 = testFileType === "xls"
      const extension2 = testFileType === "xlsx"
      if (!extension1 && !extension2) {
        this.$message.error("上传数据文件只能是 xls/xlsx 格式!")
      }
      return extension1 || extension2
    },
    handleSuccessAccount(res, file, fileList) {
      //上传文件接口调取成功回调
      this.importAccountModal = false
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
    IAonExceed() {
      this.$message.error("选取文件错误！只能上传一个文件！")
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
              if (this.activeName == "seven") {
                this.JS_IA_search() //刷新页面
              } else if (this.activeName == "nine") {
                this.js_MH_search()
              }

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
    unloadErrorLink() {
      //导入错误模板下载
      console.log("downloadErrorKey", this.downloadErrorKey)
      let url = process.env.VUE_APP_DOMAIN_download + "/oss/download?key=" + this.downloadErrorKey + "&token=" + localStorage.getItem("token") + "&name=" + encodeURI("绩效公式失败明细") + ".xlsx"
      window.location.href = url
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
    fileClose(formName) {
      //关闭公式导入弹框
      //清除表单
      this.$refs[formName].resetFields()
      this.$refs.upload.clearFiles() //清空已上传的文件列表（该方法不支持在 before-upload 中调用）
    },
    JS_IA_download() {
      GET(process.env.VUE_APP_DOMAIN_personnel + "/queryBizFilesTemplate", { fileCode: "PERFORMANCE_ACHIEVEMENT_SALARY_IMPORT_TEMPLATE" })
        .then(res => {
          //获取模板存储返回的ID
          let url = `${process.env.VUE_APP_DOMAIN_download}/oss/download?key=${res.data.fileTemplateId}&name=${res.data.fileTemplateName}.${res.data.fileTemplateSuffix}`
          window.location.href = url
        })
        .catch(error => {
          console.log(error)
        })
    },
    //888
    difDiseaseSearch() {
      GET(process.env.VUE_APP_DOMAIN_performance + "/achievementdiff/fetchBranchInfo", { calcDate: this.yearMonth, branchType: 1 })
        .then(res => {
          this.updateDifOptions = res.data
          if (this.updateDifOptions.length != 0) {
            this.diffsSearch.beforeBranch = this.updateDifOptions[0].key
          } else {
            this.diffsSearch.beforeBranch = ""
          }
        })
        .catch(error => {
          console.log(error)
        })
      GET(process.env.VUE_APP_DOMAIN_performance + "/achievementdiff/fetchBranchInfo", { calcDate: this.yearMonth, branchType: 0 })
        .then(res => {
          this.buildDifOptions = res.data
          if (this.buildDifOptions.length != 0) {
            this.diffsSearch.afterBranch = this.buildDifOptions[0].key
          } else {
            this.diffsSearch.afterBranch = ""
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    yoka() {
      this.difDiseaseSearch()
    },
    js_dif_search() {
      if (this.diffsSearch.beforeBranch == "" || this.diffsSearch.beforeBranch == null || this.diffsSearch.afterBranch == "" || this.diffsSearch.afterBranch == null) {
        this.$message.error("搜索失败！请先选择上报版和副本")
      } else {
        this.doSearch()
      }
    },
    doSearch() {
      let searchObj = {
        calcDate: this.yearMonth,
        current: this.diffsCurrent,
        size: this.diffsSize
      }
      console.log(searchObj)
      searchObj = { ...searchObj, ...this.diffsSearch }
      POST(process.env.VUE_APP_DOMAIN_performance + "/achievementdiff/diffs", searchObj)
        .then(res => {
          // this.MHLoading = false;
          this.diffsData = res.data.records //set表格的值
          this.diffsCurrent = res.data.current // set当前页
          this.diffsSize = res.data.size //每页显示记录条数
          this.diffsTotal = res.data.total //总记录数据
        })
        .catch(error => {
          console.log(error)
        })
    },
    diffsSizeChange(val) {
      this.diffsSize = val
      this.js_dif_search()
    },
    diffsCurrentChange(val) {
      this.diffsCurrent = val
      this.js_dif_search()
    },
    doCalculate() {
      //计算差异额
      var that = this
      console.log(this.diffsSearch)
      if (this.diffsSearch.afterBranch == "" || this.diffsSearch.afterBranch == null || this.diffsSearch.beforeBranch == "" || this.diffsSearch.beforeBranch == null) {
        this.$message.error("计算失败！上报版、副本数据不全！")
      } else {
        let calcObj = this.diffsSearch
        calcObj.calcDate = this.yearMonth
        GET(process.env.VUE_APP_DOMAIN_performance + "/achievementdiff/compareBranch", calcObj)
          .then(res => {
            this.progress = 0 //进度清空
            this.DifbackFlag = false
            this.createDiffsFlag = true //显示进度窗
            //获取生成的进度
            window.timer = setInterval(function() {
              GET(process.env.VUE_APP_DOMAIN_performance + "/achievementdiff/getCalcStatus")
                .then(resd => {
                  if (resd.data) {
                    that.progress = resd.data.progress //进度条占比888
                    that.statusText = resd.data.statusText
                    if (that.progress == 100) {
                      window.clearInterval(timer)
                      that.$message.success("计算差异额成功！")

                      that.DifbackFlag = true
                    } else if (that.progress == -1) {
                      window.clearInterval(timer)
                      that.statusText = resd.data.statusText
                      that.DifbackFlag = true
                    }
                  } else {
                    //当后台返回只有code时，判定出错
                    window.clearInterval(timer)
                    that.statusText = "计算差异额出错！"
                    that.DifbackFlag = true
                  }
                })
                .catch(error => {
                  console.log(error)
                })
            }, 1000)
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
    cancelCalc() {
      //取消计算
      this.createAccountForm = false
      this.createDiffsFlag = false
      window.clearInterval(timer)
    },
    exportDifData() {
      //导出差异额
      if (this.diffsSearch.afterBranch == "" || this.diffsSearch.afterBranch == null || this.diffsSearch.beforeBranch == "" || this.diffsSearch.beforeBranch == null) {
        this.$message.error("导出失败！上报版、副本数据不全！")
      } else {
        window.location.href = process.env.VUE_APP_DOMAIN_performance + "/achievementdiff/exportData?token=" + localStorage.getItem("token") + "&calcDate=" + this.yearMonth + "&beforeBranch=" + this.diffsSearch.beforeBranch + "&afterBranch=" + this.diffsSearch.afterBranch
      }
    },
    //餐房补名单管理 999
    JS_MH_download() {
      GET(process.env.VUE_APP_DOMAIN_personnel + "/queryBizFilesTemplate", { fileCode: "PERFORMANCE_ACHIEVEMENT_ALLOWANCE_IMPORT_TEMPLATE" })
        .then(res => {
          //获取模板存储返回的ID
          let url = `${process.env.VUE_APP_DOMAIN_download}/oss/download?key=${res.data.fileTemplateId}&name=${res.data.fileTemplateName}.${res.data.fileTemplateSuffix}`
          window.location.href = url
        })
        .catch(error => {
          console.log(error)
        })
    },
    js_MH_search() {
      let searchObj = {
        current: this.MHCurrent, //当前页码
        size: this.MHSize, //每页显示记录条数
        batch: this.MHListSearch.batch, //年月（批次号）
        userName: this.MHListSearch.userName // 员工姓名
      }
      this.MHLoading = true //开启动画
      console.log(searchObj)
      POST(process.env.VUE_APP_DOMAIN_performance + "/subsidy/subsidyuserlists", searchObj)
        .then(res => {
          this.MHLoading = false
          this.MHData = res.data.records //set表格的值
          this.MHCurrent = res.data.current // set当前页
          this.MHSize = res.data.size //每页显示记录条数
          this.MHTotal = res.data.total //总记录数据
        })
        .catch(error => {
          console.log(error)
        })
    },
    MHCurrentChange(val) {
      this.MHCurrent = val
      this.js_MH_search()
    },
    MHSizeChange(val) {
      this.MHSize = val
      this.js_MH_search()
    },
    beforeUploadMH(file) {
      //上传文件之前的钩子
      console.log("上传文件之前的回调", file)
      let testFileType = file.name.substring(file.name.lastIndexOf(".") + 1) //截取文件后缀
      const extension1 = testFileType === "xls"
      const extension2 = testFileType === "xlsx"
      if (!extension1 && !extension2) {
        this.$message.error("上传数据文件只能是 xls/xlsx 格式!")
      }
      return extension1 || extension2
    },
    handleSuccessMH(res, file, fileList) {
      //上传文件接口调取成功回调
      this.mealHouseModal = false
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
    MHonExceed() {
      this.$message.error("选取文件错误！只能上传一个文件！")
    },
    deleteMH(id) {
      this.$msgBox
        .confirm("你确定要删除该条数据吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          console.log(id)
          DELETE(process.env.VUE_APP_DOMAIN_performance + "/subsidy/subsidyuserlists", { ids: id })
            .then(res => {
              //单条数据删除
              // this.initSalaryData.splice(index,1) //前端删除当前行
              this.$message({
                type: "success",
                message: "删除成功!"
              })
              this.js_MH_search() //刷新表格，重新获取数据
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

    //根据员工编号获取个人信息
    getInfoForAccount(num) {
      GET(process.env.VUE_APP_DOMAIN_personnel + "/userInfo", { aid: num })
        .then(res => {
          this.personalInfoDataAll = res.data
          this.personalInfoDataAll.employedDates = this.personalInfoDataAll.employedDates.split(" ")[0]
          console.log(this.personalInfoDataAll)
        })
        .catch(error => {
          console.log(error)
        })
    },
    //根据员工编号获取个人信息
    getInfoForId(num) {
      GET(process.env.VUE_APP_DOMAIN_personnel + "/queryUserInfoToRegid", { regid: num })
        .then(res => {
          this.personalInfoDataAll = res.data
          this.personalInfoDataAll.employedDates = this.personalInfoDataAll.employedDates.split(" ")[0]
          console.log(this.personalInfoDataAll)
        })
        .catch(error => {
          console.log(error)
        })
    },
    queryCaseType() {
      //业务类型字典
      GET(process.env.VUE_APP_DOMAIN_performance + "/caseTypeDiceList", {})
        .then(res => {
          //查询薪资类型模板
          this.caseTypeOptions = res.data
          //console.log(this.caseTypeOptions);
        })
        .catch(error => {
          console.log(error)
        })

      POST(process.env.VUE_APP_DOMAIN_performance + "/performancedicMaps", { dicType: "2" })
        .then(res => {
          this.rankOptions = res.data
        })
        .catch(error => {
          console.log(error)
        })
      POST(process.env.VUE_APP_DOMAIN_performance + "/performancedicMaps", { dicType: "1" })
        .then(res => {
          this.reasonOptions = res.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    queryAreaList() {
      //获取所属区域
      POST(process.env.VUE_APP_DOMAIN_personnel + "/queryAreaList")
        .then(res => {
          this.areaOptions = res.data
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>
<style scoped>
/* mohan */
.searchWrap {
  margin-top: 15px;
  display: inline-block;
}
.rbName {
  width: 150px;
  text-align: right;
}
.rbNum {
  flex: 1;
}
.rbDetails {
  background-color: #e7e7e7 !important;
  padding: 15px;
  margin-bottom: 20px;
}
.rbText {
  height: 25px;
  line-height: 25px;
}
/* qianjun */

/* lxm */
.el-radio-group {
  width: 100%;
}
.el-radio-button {
  width: 25%;
}
</style>

<style>
/* mohan */

/* qianjun */

/* lxm */
/*修复业绩排名二级导航的宽度*/
.roleSelect .el-radio-button--small .el-radio-button__inner {
  display: block;
}
</style>

