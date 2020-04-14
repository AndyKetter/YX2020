<template>
  <div id="caseDetails" class="page-content container-fluid">
    <div class="row selectRow" :class="toTopFlag==false?'show':'hidden'">
      <div class="col-md-12 clearfix">
        <div class="pull-left selectCon">
          <!-- <el-badge :value="8" class="cd_badge">
            <el-button size="small">有钱</el-button>
          </el-badge> el-icon-question-->
          <el-tooltip class="patch-tooltilp" placement="bottom-start">
            <!-- <el-button type="danger" size="mini" class="el-icon-question" circle round></el-button> -->
            <div slot="content" class="patch-div">
              <i class="el-icon-question patch-icon"></i>&nbsp;给案件打标签，数字小标识代表有8人表示该持卡人有钱。
            </div>
            <el-button-group>
              <el-button size="small" @click.once="haveMoney">
                有钱
                <span class="cd_badge">{{haveMoneyNum}}</span>
              </el-button>
              <el-button size="small" class="btn2" @click.once="haveNoMoney">
                无钱
                <span class="cd_badge">{{haveNoNum}}</span>
              </el-button>
            </el-button-group>
          </el-tooltip>
          <el-button-group>
            <el-button size="small" class="btnl">有诚意</el-button>
            <el-button size="small">无诚意</el-button>
          </el-button-group>

          <el-button-group>
            <el-button size="small" class="btnl">找到家人</el-button>
            <el-button size="small">找到持卡人</el-button>
            <el-button size="small">暂时失联</el-button>
            <el-button size="small">完全失联</el-button>
            <el-button size="small">死亡</el-button>
          </el-button-group>
        </div>

        <el-tooltip class="patch_tooltilp" placement="bottom-end">
          <div slot="content" class="patch-div">
            <i class="el-icon-question patch-icon"></i>&nbsp;案件标签分类
          </div>
          <div class="pull-right selectCon">
            <img class="iconImg" src="../images/acceptor.png" alt style="margin-left:0">
            <span class="iconMsg">承诺还款</span>
            <img class="iconImg" src="../images/refund.png" alt>
            <span class="iconMsg">有部分还款</span>
            <img class="iconImg" src="../images/valid.png" alt>
            <span class="iconMsg">有效联系人</span>
          </div>
        </el-tooltip>
      </div>
    </div>
    <!-- 案件信息 -->
    <div class="caseInfo clearfix row" :class="toTopFlag==false?'show':'hidden'">
      <div class="caseInfo1">
        <span style="display:inline-block;vertical-align:middle;line-height:28px">
          <i class="cui_icons2 manIcon"></i>&nbsp;
          <span class="keyInfo">曾伟健</span>
          <span style="color:#222;margin-left:32px">男</span>
          <span style="color:#222">29岁</span>
          <br>
          <i class="cui_icons2 IDIcon"></i>&nbsp;&nbsp;
          <span>430105199008120136</span>
          <br>
          <i class="cui_icons2 homeIcon"></i>&nbsp;&nbsp;
          <span>湖南省 郴州市 桂阳县（0735）</span>
        </span>
      </div>

      <div class="caseInfo2">
        <span style="display:inline-block;vertical-align:middle;line-height:28px">
          <span class="keyInfo">平安普惠</span>
          <br>
          <span>委托日期：</span>
          <span>2019-03-01</span>
          <span class="marspace">共案信息：</span>
          <span>0</span>
          <span style="margin-left: 35px;">逾期阶段：</span>
          <span>逾期361-720天</span>
          <br>
          <span>退案日期：</span>
          <span>2019-06-01</span>
          <span class="marspace">客户手次：</span>
          <span>2手</span>
          <span class="marspace">委托批次：</span>
          <span>20190301-02</span>
        </span>
      </div>

      <div class="caseInfo3">
        <span style="display:inline-block;vertical-align:middle;line-height:28px">
          <span class="keyInfo">金额信息</span>
          <br>
          <span>委托金额：</span>
          <span class="valspace">52,610.55</span>
          <span>尚欠本金：</span>
          <span class="valspace">45,260.00</span>
          <span>尚欠担保费：</span>
          <span style="width:55px;display:inline-block">315.00</span>
          <span>尚欠滞纳金：</span>
          <span class="valspace">125.00</span>
          <br>
          <span>已还金额：</span>
          <span class="valspace">0</span>
          <span>尚欠利息：</span>
          <span class="valspace">9,520.00</span>
          <span>尚欠罚息：</span>
          <span class="valspace">30.00</span>
          <span>授信额度：</span>
          <span class="valspace">30,000.00</span>
        </span>
      </div>
      <el-tooltip class="patch_tooltilp" placement="bottom-end">
        <div slot="content" class="patch-div">
          <i class="el-icon-question patch-icon"></i>&nbsp;案件分类印章，包括“死单类”、“已投诉”和“投诉预警”
        </div>
        <img v-if="caseTypeStatus == 'death'" class="statusImg" src="../images/die.png" alt>
        <img v-if="caseTypeStatus == 'complaints'" class="statusImg" src="../images/complaints.png" alt>
        <img v-if="caseTypeStatus == 'warning'" class="statusImg" src="../images/warning.png" alt>
      </el-tooltip>
    </div>
    <!-- 联系资料tabs切换 -->
    <div class="tabsWrap row" :class="toTopFlag == false?'mgt15':'mgt0'">
      <el-tooltip class="patch_tooltilp" placement="bottom-start">
        <div slot="content" class="patch-div">
          <i class="el-icon-question patch-icon"></i>&nbsp;点击滑至顶部，扩大内容显示区域
        </div>
        <img class="toTop" @click="toTop" src="../images/tTop.png" alt>
      </el-tooltip>
      <el-tabs class="iWrap" v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="工作记录" name="first">
          <div class="clearfix">
            <el-button-group class="pull-left">
              <el-button
                size="mini"
                :type="workFlag==1?'primary':'default'"
                @click="workFlag=1"
              >本案资料</el-button>
              <el-tooltip class="patch_tooltilp" placement="bottom-start">
                <div slot="content" class="patch-div">
                  <i class="el-icon-question patch-icon"></i>&nbsp;查看共案资料
                </div>
                <el-button
                  size="mini"
                  :type="workFlag==1?'default':'primary'"
                  style="margin-left:0"
                  @click="workFlag=2"
                >共案资料</el-button>
              </el-tooltip>
            </el-button-group>
            <el-popover class="patch" placement="right" trigger="click">
                  <div><img src="../images/record.gif" alt="操作演示"></div>
                  <el-button class="patch_operate" size="mini" slot="reference" type="primary" plain>操作演示</el-button>
              </el-popover> 
            <div class="pull-right">
              <el-button  @click="todayRecordFlag = true" class="todayRecord"  :class="workFlag==1?'':'hidden'">今日工作记录条数</el-button>
              <el-autocomplete
                :class="workFlag==1?'':'hidden'"
                style="width:180px"
                size="small"
                class="inline-input"
                v-model="agentPersonValue"
                :fetch-suggestions="queryAgentSearch"
                placeholder="请输入经办人"
                @select="handleAgentSelect"
              ></el-autocomplete>&nbsp;&nbsp;&nbsp;&nbsp;
              <el-button :class="workFlag==1?'':'hidden'" size="small" type="primary"  icon="el-icon-search">搜索</el-button>
              <span v-if="workFlag==2">
                共有
                <b style="color:#2e76ee">6</b>起共案
              </span>&nbsp;
              <el-button
                size="mini"
                v-if="workFlag==2"
                @click="checkCaseFlag = true"
              >查看共案</el-button>
            </div>
          </div>
          <div v-if="workFlag == 1" class="recordTable table_wrap">
            <el-checkbox-group v-model="recordCallSigns" class="pull-left">
              <el-checkbox label="全部还款类"></el-checkbox>
              <el-checkbox label="承诺还款类"></el-checkbox>
              <el-checkbox label="部分还款类"></el-checkbox>
              <el-checkbox label="有效联系人"></el-checkbox>
            </el-checkbox-group>
            <el-table
              ref="recordBCase"
              key="recordBCase"
              :data="recordTableData"
              :header-cell-style="{backgroundColor:'#e5e9f3'}"
              border
              style="width:100%"
              max-height="300"
            >
              <el-table-column width="150" prop="collectionType">
                <template slot="header">
                  <select class="form-control" v-model="recordCollectType">
                    <option value disabled selected style="display:none">催收类型</option>
                    <option value="all">全部类型</option>
                    <option value="1">电话催收</option>
                    <option value="2">网络催收</option>
                    <option value="3">资源催收</option>
                  </select>
                </template>
              </el-table-column>
              <el-table-column prop="label" label="标签" style="width:160px">
                <template slot="header">
                  <select class="form-control" v-model="tagFlag">
                    <option value disabled selected style="display:none">标签</option>
                    <option value="all">全部</option>
                    <option value="1">有钱</option>
                    <option value="2">无钱</option>
                    <option value="3">有诚意</option>
                    <option value="4">无诚意</option>
                    <option value="5">找到家人</option>
                    <option value="6">找到持卡人</option>
                    <option value="7">暂时失联</option>
                    <option value="8">完全失联</option>
                    <option value="9">死亡</option>
                  </select>
                </template>
              </el-table-column>
              <!-- <el-table-column :render-header="renderHeader" prop="progress"></el-table-column> -->
              <el-table-column
                :show-overflow-tooltip="true"
                prop="recordContents"
                label="工作记录"
                min-width="180"
              ></el-table-column>
              <el-table-column prop="recordTime" label="记录时间" min-width="120"></el-table-column>
              <el-table-column label="经办人" min-width="80">
                <template slot-scope="scope">
                  <el-popover trigger="hover" placement="top">
                    <p>
                      <b>男/在职&nbsp;&nbsp;186****4488</b>&nbsp;
                      <img src="../images/call.png" @click="phoneStatusShow" alt>
                    </p>
                    <p>所属职位：资产管理员-部长</p>
                    <p>隶属单位：长沙分公司-业务部</p>
                    <p>组织关系：谭曼-陈军-李永杰-{{scope.row.submitPerson}}</p>
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.submitPerson}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="录音" fixed="right" min-width="80">
                <template slot-scope="scope">
                  <el-popover trigger="hover" placement="top">
                    <p>案件录音</p>
                    <div>
                      <audio controls>
                        <source src="../libs/audio/song.ogg" :data-src="scope.row.audioSrc" type="audio/ogg">
                        你的浏览器不支持音乐播放器
                      </audio>
                    </div>
                    <img slot="reference" class="wth16" src="../images/voice.png" alt>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="员工表态" fixed="right" min-width="120">
                <template>
                  <img class="wth16" src="../images/zan.png" alt>
                  <span class="mgl10 colorTheme">2</span>
                  <img class="mgl10 wth16" src="../images/cai.png" alt>
                  <span class="mgl10 color99a0b1">0</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="workRtCase table_wrap" v-else>
            <el-checkbox-group v-model="callSigns" class="pull-left">
              <el-checkbox label="全部还款类"></el-checkbox>
              <el-checkbox label="承诺还款类"></el-checkbox>
              <el-checkbox label="部分还款类"></el-checkbox>
              <el-checkbox label="有效联系人"></el-checkbox>
            </el-checkbox-group>
            <el-table
              key="workRtCase"
              ref="workRtCase"
              :data="workRtCaseData"
              border
              :header-cell-style="{backgroundColor:'#e5e9f3'}"
              style="width:100%"
              max-height="300"
            >
              <el-table-column prop="entrustedBatch" width="120" label="委托批次"></el-table-column>
              <el-table-column prop="collectionType" width="150">
                <template slot="header">
                  <select class="form-control" v-model="auditStatus">
                    <option value disabled selected style="display:none">催收类型</option>
                    <option value="all">全部类型</option>
                    <option value="1">电话催收</option>
                    <option value="2">网络催收</option>
                    <option value="3">资源催收</option>
                  </select>
                </template>
              </el-table-column>
              <el-table-column prop="label" width="160">
                <template slot="header">
                  <select class="form-control" v-model="tagFlag2">
                    <option value disabled selected style="display:none">标签</option>
                    <option value="all">全部</option>
                    <option value="1">有钱</option>
                    <option value="2">无钱</option>
                    <option value="3">有诚意</option>
                    <option value="4">无诚意</option>
                    <option value="5">找到家人</option>
                    <option value="6">找到持卡人</option>
                    <option value="7">暂时失联</option>
                    <option value="8">完全失联</option>
                    <option value="9">死亡</option>
                  </select>
                </template>
              </el-table-column>
              <el-table-column
                prop="recordContent"
                label="记录内容"
                :show-overflow-tooltip="true"
                min-width="180"
              ></el-table-column>
              <el-table-column prop="recordTime" label="记录时间" min-width="120"></el-table-column>
              <el-table-column label="提交人" min-width="80">
                <template slot-scope="scope">
                  <el-popover trigger="hover" placement="top">
                    <p>
                      <b>男/在职&nbsp;&nbsp;186****4488</b>&nbsp;
                      <img src="../images/call.png" @click="phoneStatusShow" alt>
                    </p>
                    <p>所属职位：资产管理员-部长</p>
                    <p>隶属单位：长沙分公司-业务部</p>
                    <p>组织关系：谭曼-陈军-李永杰-{{scope.row.submitPerson}}</p>
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.submitPerson}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="录音" fixed="right" min-width="80">
                <template slot-scope="scope">
                  <el-popover trigger="hover" placement="top">
                    <p>案件录音</p>
                    <div>
                      <audio controls>
                        <source src="../libs/audio/song.ogg" :data-src="scope.row.audioSrc" type="audio/ogg">
                        你的浏览器不支持音乐播放器
                      </audio>
                    </div>
                    <img slot="reference" class="wth16" src="../images/voice.png" alt>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="员工表态" fixed="right" min-width="120">
                <template>
                  <img class="wth16" src="../images/zan.png" alt>
                  <span class="mgl10 colorTheme">2</span>
                  <img class="mgl10 wth16" src="../images/cai.png" alt>
                  <span class="mgl10 color99a0b1">0</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="基本案情" name="second">
            <div class="clearfix">
              <el-button-group class="pull-left">
                <el-button size="mini" :type="baseFlag==1?'primary':''" @click="baseFlag=1">本案资料</el-button>
                <el-tooltip class="patch_tooltilp" placement="bottom-start">
                  <div slot="content" class="patch-div">
                    <i class="el-icon-question patch-icon"></i>&nbsp;查看共案资料
                  </div>
                  <el-button
                    size="mini"
                    :type="baseFlag==2?'primary':''"
                    @click="baseFlag=2"
                    style="margin-left:0"
                  >共案资料</el-button>
                </el-tooltip>
              </el-button-group>
              <!-- <div class="pull-right">
                <span v-if="baseFlag==2">
                  共有
                  <b style="color:#2e76ee">6</b>起共案
                </span>&nbsp;
                <el-button size="mini" v-if="baseFlag==2" @click="checkCaseFlag = true">查看共案</el-button>
              </div> -->
            </div>
            <div class="caseDetail table_wrap" v-if="baseFlag==1">
              <table width=100%>
                <tr>
                  <td style="width:20%">最新余额：<span>6614.58</span></td>
                  <td style="width:20%">委托日期：<span>2019-03-01</span></td>
                  <td style="width:30%">账户号：<span>10013253801</span></td>
                  <td style="width:30%">案件状态：<span>在案</span></td>
                </tr>
                <tr>
                  <td>委托金额：<span>6614.58</span></td>
                  <td>委托还款日期：<span>2019-05-31</span></td>
                  <td>还款账号：<span>6212262604001565735</span></td>
                  <td>业务类型：<span>NBT</span></td>
                </tr>
                <tr>
                  <td>尚欠本金：<span>4590</span></td>
                  <td>还款日：<span>2019-08-08</span></td>
                  <td>银行卡号：<span>251660211258450112</span></td>
                  <td>放款模式：<span>担保+普惠小贷</span></td>
                </tr>
                <tr>
                  <td>尚欠利息：<span>140.56</span></td>
                  <td>授信日期：<span>2017-10-31</span></td>
                  <td>申请号：<span>0201009010806</span></td>
                  <td>空单兼带：<span></span></td>
                </tr>
                <tr>
                  <td>尚欠担保费：<span>318.63</span></td>
                  <td>账单日：<span>7</span></td>
                  <td>受托公司：<span>湖南卫成</span></td>
                  <td>案件备注：<span></span></td>
                </tr>
                <tr>
                  <td>尚欠罚息：<span>24.48</span></td>
                  <td>理赔日期：<span>2018-05-02</span></td>
                  <td>银行：<span></span></td>
                  <td>新增地址：<span></span></td>
                </tr>
                <tr>
                  <td>尚欠总额：<span>0</span></td>
                  <td>贷款日期：<span>2017-10-12</span></td>
                  <td>还款账户名称：<span></span></td>
                  <td>经办人：<span>谭曼-甘献-汤维-汤宽心</span></td>
                </tr>
                <tr>
                  <td>尚欠滞纳金：<span>1541.28</span></td>
                  <td></td>
                  <td>证件类型：<span>身份证</span></td>
                  <td>经办人备注：<span>普惠6</span></td>
                </tr>
                <tr>
                  <td>当前逾期金额：<span>0</span></td>
                  <td></td>
                  <td></td>
                  <td>持卡人评分：<span>0.8</span></td>
                </tr>
                <tr>
                  <td>逾期手续费：<span>0</span></td>
                  <td></td>
                  <td></td>
                  <td>风险等级：<span>一级</span></td>
                </tr>
                <tr>
                  <td>逾期服务费：<span>0</span></td>
                  <td></td>
                  <td></td>
                  <td>案件唯一标识：<span>5246620D7-SD04-405D-7811</span></td>
                </tr>
                <tr>
                  <td>授信额度：<span>5400</span></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>人民币额度固定额度：<span>40000</span></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>本期账单金额：<span>0</span></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>理赔金额：<span>4757.94</span></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </table>
            </div>
            <div class="baseTable table_wrap" v-if="baseFlag==2">
              <el-table
                :data="baseTableData"
                :header-cell-style="{backgroundColor:'#e5e9f3'}"
                border
                style="width:100%"
                max-height="300"
              >
                <el-table-column prop="entrustedBank" label="委托银行"></el-table-column>
                <el-table-column prop="entrustedBatch" label="委托批次"></el-table-column>
                <el-table-column prop="lastYearPayBackNum" label="近一年累计还款"></el-table-column>
                <el-table-column prop="lastPayBackNum" label="最后一次还款金额"></el-table-column>
                <el-table-column prop="lastPayBackTime" label="最后一次还款时间"></el-table-column>
                <el-table-column prop="entrustedNum" label="委托金额"></el-table-column>
                <el-table-column prop="caseStatus" label="在案状态"></el-table-column>
                <el-table-column label="查看">
                  <template slot-scope="scope">
                    <el-button type="text" size="small"  @click.native.prevent="viewDetail(scope.$index,scope.row.caseStatus)">详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
        </el-tab-pane>
        <el-tab-pane label="联系资料" name="third">
          <div class="clearfix">
            <el-button-group class="pull-left">
              <el-button
                size="mini"
                :type="contractFlag==1?'primary':''"
                @click="contractFlag=1"
              >本案资料</el-button>
              <el-tooltip class="patch_tooltilp" placement="bottom-start">
                <div slot="content" class="patch-div">
                  <i class="el-icon-question patch-icon"></i>&nbsp;查看共案资料
                </div>
                <el-button
                  size="mini"
                  :type="contractFlag==2?'primary':''"
                  @click="contractFlag=2"
                  style="margin-left:0"
                >共案资料</el-button>
              </el-tooltip>
            </el-button-group>
            <div class="pull-right">
              <el-tooltip class="patch_tooltilp" placement="bottom-start">
                <div slot="content" class="patch-div">
                  <i class="el-icon-question patch-icon"></i>&nbsp;新增联系方式
                </div>
                <el-button
                  size="mini"
                  @click="dialogVisible=true"
                  v-show="contractFlag==1"
                >
                  <i class="el-icon-plus"></i>&nbsp;联系方式
                </el-button>
              </el-tooltip>
              <span v-show="contractFlag==2">
                共有
                <b style="color:#2e76ee">6</b>起共案
              </span>&nbsp;
              <el-button size="mini"  v-show="contractFlag==2" @click="checkCaseFlag = true">查看共案</el-button>
            </div>
          </div>
          <div class="caseTable table_wrap" v-show="contractFlag==1">
            <el-table
              :data="tableData"
              border
              :header-cell-style="{backgroundColor:'#e5e9f3'}"
              style="width:100%"
            >
              <el-table-column fixed prop="cType">
                <template slot="header">
                  <select class="form-control" v-model="typeFlag">
                    <option value disabled selected style="display:none">类型</option>
                    <option value="all">全部</option>
                    <option value="1">联系方式</option>
                    <option value="2">地址信息</option>
                  </select>
                </template>
              </el-table-column>
              <el-table-column fixed  prop="relationShip" label="关系/地址类"></el-table-column>
              <el-table-column prop="name" label="名称/邮编"></el-table-column>
              <el-table-column label="号码/地址信息">
                <template slot-scope="scope">
                  <span>{{scope.row.librarian}}</span>
                  <el-tooltip class="patch_tooltilp" placement="right"  v-if="scope.row.cType == '联系方式'">
                    <div slot="content" class="patch-div">
                      <i class="el-icon-question patch-icon"></i>&nbsp;可直接在线拨打
                    </div>
                    <img class="mgl10" src="../images/call.png" @click="phoneStatusShow" alt>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column prop="source">
                <template slot="header">
                  <select class="form-control" v-model="canalFlag">
                    <option value disabled selected style="display:none">来源</option>
                    <option value="all">全部</option>
                    <option value="1">委案</option>
                    <option value="2">手动新增</option>
                    <option value="3">工作记录</option>
                  </select>
                </template>
              </el-table-column>
              <el-table-column prop="lastTime" label="上次联系时间"></el-table-column>
              <el-table-column prop="belong" label="归属地" width="120"></el-table-column>
              <el-table-column width="130">
                <template slot="header">
                  <select class="form-control" v-model="validityFlag">
                    <option value disabled selected style="display:none">有效性</option>
                    <option value="all">全部</option>
                    <option value="1">有效</option>
                    <option value="2">无效</option>
                    <option value="2">不确定</option>
                  </select>
                </template>
                <template slot-scope="scope">
                  <el-tooltip class="patch_tooltilp" placement="left">
                    <div slot="content" class="patch-div">
                      <i class="el-icon-question patch-icon"></i>&nbsp;号码的有效性
                    </div>
                    <img
                      v-if="scope.row.effective == 1"
                      class="mgl10"
                      src="../images/notSure.png"
                      alt
                    >
                    <img
                      v-if="scope.row.effective == 2"
                      class="mgl10"
                      src="../images/invalid.png"
                      alt
                    >
                    <img
                      v-if="scope.row.effective == 3"
                      class="mgl10"
                      src="../images/correct.png"
                      alt
                    >
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template>
                  <el-button type="text" @click="opendelMessage=true">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 联系资料共案信息 -->
          <div style="display:flex;margin-top:20px" v-show="contractFlag==2">
            <div style="width:60%">
              <label style="color:#ff5353;font-size:16px;font-weight:bold;margin-bottom:10px">不同信息</label>
              <div
                style="border-bottom:6px solid #ffdddd;border-top:1px solid #ff5353;padding-top:2px;margin-bottom:20px"
              ></div>
              <div class="wallfall">
                <el-card class="box-card1">
                  <div slot="header" class="clearfix card_header">
                    <b style="float:left">共案1</b>
                    <el-button style="float:right;padding:3px 0;" type="text">详情</el-button>
                  </div>
                  <div style="line-height:25px">
                    <label class="card_label">朋友</label>
                    <span>张小花</span>
                    <span style="margin-left:13px">156****7896</span>&nbsp;
                    <i class="callicon"></i>
                    <br>
                    <label class="card_label">单位名称</label>
                    <span class="cd_text_overflow">中国石油大连石化公司</span>
                    <br>
                    <label class="card_label">单位地址</label>
                    <span class="cd_text_overflow">大连市甘井子区山中路１号</span>&nbsp;
                    <i class="addressicon"></i>
                    <br>
                  </div>
                </el-card>

                <el-card class="box-card1">
                  <div slot="header" class="clearfix card_header">
                    <b style="float:left">共案2</b>
                    <el-button style="float:right;padding:3px 0;" type="text">详情</el-button>
                  </div>
                  <div style="line-height:25px">
                    <label class="card_label">家庭地址</label>
                    <span class="cd_text_overflow">浙江省余姚市江南城东区１５－３幢103</span>&nbsp;
                    <i class="addressicon"></i>
                    <br>
                  </div>
                </el-card>

                <el-card class="box-card1">
                  <div slot="header" class="clearfix card_header">
                    <b style="float:left">共案3</b>
                    <el-button style="float:right;padding:3px 0;" type="text">详情</el-button>
                  </div>
                  <div style="line-height:25px">
                    <label class="card_label">单位名称</label>
                    <span class="cd_text_overflow">余姚市世纪绿化有限公司</span>
                    <br>
                    <label class="card_label">单位地址</label>
                    <span class="cd_text_overflow">余姚市兰江街道兰墅桥村</span>&nbsp;
                    <i class="addressicon"></i>
                    <br>
                  </div>
                </el-card>

                <el-card class="box-card1">
                  <div slot="header" class="clearfix card_header">
                    <b style="float:left">共案4</b>
                    <el-button style="float:right;padding:3px 0;" type="text">详情</el-button>
                  </div>
                  <div style="line-height:25px">
                    <label class="card_label">朋友</label>
                    <span>张小咪</span>
                    <span style="margin-left:13px">156****7896</span>&nbsp;
                    <i class="callicon"></i>
                    <br>
                    <label class="card_label">单位名称</label>
                    <span class="cd_text_overflow">余姚市世纪绿化有限公司</span>
                    <br>
                    <label class="card_label">单位地址</label>
                    <span class="cd_text_overflow">余姚市兰江街道兰墅桥村</span>&nbsp;
                    <i class="addressicon"></i>
                    <br>
                  </div>
                </el-card>
              </div>
            </div>

            <div style="width:39%;margin-left:20px">
              <label style="color:#2e76ee;font-size:16px;font-weight:bold;margin-bottom:10px">相同信息</label>
              <div
                style="border-bottom:6px solid #d5e4fc;border-top:1px solid #2e76ee;padding-top:2px;margin-bottom:20px"
              ></div>
              <el-card class="box-card2">
                <div slot="header" class="clearfix card_header">
                  <b style="float:left">联系方式</b>
                </div>
                <div style="line-height:25px">
                  <label class="card_label">朋友</label>
                  <span>张小咪</span>
                  <span style="margin-left:13px">156****7896</span>&nbsp;
                  <i class="callicon"></i>
                  <br>
                  <label class="card_label">本人</label>
                  <span>张小美</span>
                  <span style="margin-left:20px">482342960@qq.com</span>
                </div>
              </el-card>

              <el-card class="box-card2">
                <div slot="header" class="clearfix card_header">
                  <b style="float:left">地址信息</b>
                </div>
                <div style="line-height:25px">
                  <label class="card_label">单位名称</label>
                  <el-tooltip content="余姚市世纪绿化有限公司" placement="top">
                    <span class="cd_text_overflow">余姚市世纪绿化有限公司</span>
                  </el-tooltip>
                  <br>
                  <label class="card_label">户籍地址</label>
                  <el-tooltip content="佛山市南海区狮山松岗汇益广场三姐猪肚552800" placement="bottom-end">
                    <span class="cd_text_overflow">佛山市南海区狮山松岗汇益广场三姐猪肚&nbsp;528000</span>
                  </el-tooltip>&nbsp;
                  <i class="addressicon"></i>
                </div>
              </el-card>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="经办人情况" name="four">
          <div class="clearfix">
            <el-button-group class="pull-left">
              <el-button
                size="mini"
                :type="agentFlag==1?'primary':'default'"
                @click="agentFlag=1"
              >本案资料</el-button>
              <el-tooltip class="patch_tooltilp" placement="bottom-start">
                <div slot="content" class="patch-div">
                  <i class="el-icon-question patch-icon"></i>&nbsp;查看共案资料
                </div>
                <el-button
                  size="mini"
                  :type="agentFlag==1?'default':'primary'"
                  @click="agentFlag=2"
                  style="margin-left:0"
                >共案资料</el-button>
              </el-tooltip>
            </el-button-group>
          </div>
          <div class="agentTable table_wrap" v-if="agentFlag==1">
            <el-table
              key="agentTableData"
              :data="agentTableData"
              border
              :header-cell-style="{backgroundColor:'#e5e9f3'}"
              style="width:100%"
            >
              <el-table-column fixed label="姓名">
                <template slot-scope="scope">
                  <el-popover trigger="hover" placement="top">
                    <p>
                      <b>男/在职&nbsp;&nbsp;186****4488</b>&nbsp;
                      <img src="../images/call.png" @click="phoneStatusShow" alt>
                    </p>
                    <p>所属职位：资产管理员-部长</p>
                    <p>隶属单位：长沙分公司-业务部</p>
                    <p>组织关系：谭曼-陈军-李永杰-{{scope.row.name}}</p>
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.name}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="timeLimit" label="承办期限" min-width="160"></el-table-column>
              <el-table-column prop="entrust" label="委托金额"></el-table-column>
              <el-table-column prop="caseState" width="160">
                <template slot="header">
                  <select class="form-control" v-model="caseFlag">
                    <option value disabled selected style="display:none">案件状态</option>
                    <option value="all">全部</option>
                    <option value="1">在案</option>
                    <option value="2">退案</option>
                    <option value="3">结案</option>
                    <option value="4">暂停催收</option>
                    <option value="5">减免结案</option>
                  </select>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="agentTable table_wrap" v-else>
            <el-table
              key="agentTableDataOther"
              :data="agentTableDataOther"
              border
              :header-cell-style="{backgroundColor:'#e5e9f3'}"
              style="width:100%"
            >
              <el-table-column prop="entrustedBatch" label="委托批次" width="120"></el-table-column>
              <el-table-column label="姓名">
                <template slot-scope="scope">
                  <el-popover trigger="hover" placement="top">
                    <p>
                      <b>男/在职&nbsp;&nbsp;186****4488</b>&nbsp;
                      <img src="../images/call.png" @click="phoneStatusShow" alt>
                    </p>
                    <p>所属职位：资产管理员-部长</p>
                    <p>隶属单位：长沙分公司-业务部</p>
                    <p>组织关系：谭曼-陈军-李永杰-{{scope.row.name}}</p>
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.name}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>

              <el-table-column prop="timeLimit" label="承办期限" min-width="160"></el-table-column>
              <el-table-column prop="entrust" label="委托金额"></el-table-column>
              <el-table-column prop="caseState" width="160">
                <template slot="header">
                  <select class="form-control" v-model="caseFlag2">
                    <option value disabled selected style="display:none">案件状态</option>
                    <option value="all">全部</option>
                    <option value="1">在案</option>
                    <option value="2">退案</option>
                    <option value="3">结案</option>
                    <option value="4">暂停催收</option>
                    <option value="5">减免结案</option>
                  </select>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="还款记录" name="five">
          <div class="clearfix">
            <el-button-group class="pull-left">
              <el-button
                size="mini"
                :type="replayFlag==1?'primary':'default'"
                @click="replayFlag=1"
              >本案资料</el-button>
              <el-tooltip class="patch_tooltilp" placement="bottom-start">
                <div slot="content" class="patch-div">
                  <i class="el-icon-question patch-icon"></i>&nbsp;查看共案资料
                </div>
                <el-button
                  size="mini"
                  :type="replayFlag==1?'default':'primary'"
                  @click="replayFlag=2"
                  style="margin-left:0"
                >共案资料</el-button>
              </el-tooltip>
            </el-button-group>
            <div class="pull-right">
                <el-button size="mini"  v-show="replayFlag==1" @click="exportDataFlag = true">数据导出</el-button>
            </div>
          </div>
          <div class="replayTable table_wrap" v-if="replayFlag==1">
            <el-table
              key="replayTableData"
              :data="replayTableData"
              border
              :header-cell-style="{backgroundColor:'#e5e9f3'}"
              style="width:100%"
            >
              <el-table-column fixed prop="cardholder" label="持卡人"></el-table-column>
              <el-table-column prop="bankCard" label="卡号/合同号" min-width="120"></el-table-column>
              <el-table-column prop="replayTime" label="承诺还款日期"></el-table-column>
              <el-table-column prop="replayMoney" label="承诺还款金额"></el-table-column>
              <el-table-column prop="actualTime" label="还款日期"></el-table-column>
              <el-table-column prop="actualMoney" label="还款金额"></el-table-column>
              <el-table-column label="经办人">
                <template slot-scope="scope">
                  <el-popover trigger="hover" placement="top">
                    <p>
                      <b>男/在职&nbsp;&nbsp;186****4488</b>&nbsp;
                      <img src="../images/call.png" @click="phoneStatusShow" alt>
                    </p>
                    <p>所属职位：资产管理员-部长</p>
                    <p>隶属单位：长沙分公司-业务部</p>
                    <p>组织关系：谭曼-陈军-李永杰-{{scope.row.agent}}</p>
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.agent}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="replayTable table_wrap" v-else>
            <el-table
              key="replayTableDataOther"
              :data="replayTableDataOther"
              border
              :header-cell-style="{backgroundColor:'#e5e9f3'}"
              style="width:100%"
            >
              <el-table-column prop="entrustedBatch" label="委托批次" width="120"></el-table-column>
              <el-table-column prop="cardholder" label="持卡人"></el-table-column>
              <el-table-column prop="bankCard" label="卡号/合同号" min-width="120"></el-table-column>
              <el-table-column prop="replayTime" label="承诺还款日期"></el-table-column>
              <el-table-column prop="replayMoney" label="承诺还款金额"></el-table-column>
              <el-table-column prop="actualTime" label="还款日期"></el-table-column>
              <el-table-column prop="actualMoney" label="还款金额"></el-table-column>
              <el-table-column prop="agent" label="经办人">
                <template slot-scope="scope">
                  <el-popover trigger="hover" placement="top">
                    <p>
                      <b>男/在职&nbsp;&nbsp;186****4488</b>&nbsp;
                      <img src="../images/call.png" @click="phoneStatusShow" alt>
                    </p>
                    <p>所属职位：资产管理员-部长</p>
                    <p>隶属单位：长沙分公司-业务部</p>
                    <p>组织关系：谭曼-陈军-李永杰-{{scope.row.agent}}</p>
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.agent}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="录音记录" name="six">
          <div class="clearfix">
            <el-button-group class="pull-left">
              <el-button
                size="mini"
                :type="soundFlag==1?'primary':'default'"
                @click="soundFlag=1"
              >本案资料</el-button>
              <el-tooltip class="patch_tooltilp" placement="bottom-start">
                <div slot="content" class="patch-div">
                  <i class="el-icon-question patch-icon"></i>&nbsp;查看共案资料
                </div>
                <el-button
                  size="mini"
                  :type="soundFlag==1?'default':'primary'"
                  @click="soundFlag=2"
                  style="margin-left:0"
                >共案资料</el-button>
              </el-tooltip>
            </el-button-group>
          </div>
          <div class="soundTable table_wrap mar-top" v-if="soundFlag==1">
            <el-table
              key="soundTableDate"
              :data="soundTableDate"
              border
              :header-cell-style="{backgroundColor:'#e5e9f3'}"
              style="width:100%"
              max-height="300"
            >
              <el-table-column prop="callType" width="130">
                <template slot="header">
                  <select class="form-control" v-model="callFlag">
                    <option value disabled selected style="display:none">通话类型</option>
                    <option value="all">全部</option>
                    <option value="1">呼入</option>
                    <option value="2">呼出</option>
                  </select>
                </template>
              </el-table-column>
              <el-table-column prop="ringup" label="主叫号码"></el-table-column>
              <el-table-column prop="pickup" label="被叫号码"></el-table-column>
              <el-table-column prop="duration" label="通话时长"></el-table-column>
              <el-table-column prop="callTime" label="通话时间"></el-table-column>
              <el-table-column label="操作人">
                <template slot-scope="scope">
                  <el-popover trigger="hover" placement="top">
                    <p>
                      <b>男/在职&nbsp;&nbsp;186****4488</b>&nbsp;
                      <img src="../images/call.png" @click="phoneStatusShow" alt>
                    </p>
                    <p>
                      <span class="workNum">工</span>号：8170823003
                    </p>
                    <p>所属职位：资产管理员-部长</p>
                    <p>隶属单位：长沙分公司-业务部</p>
                    <p>组织关系：谭曼-陈军-李永杰-{{scope.row.handleP}}</p>
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.handleP}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="通话录音">
                <template slot-scope="scope">
                  <el-popover trigger="hover" placement="top">
                    <p>案件录音</p>
                    <div>
                      <audio controls>
                        <source src="../libs/audio/song.ogg" :data-src="scope.row.audioSrc" type="audio/ogg">
                        你的浏览器不支持音乐播放器
                      </audio>
                    </div>
                    <img slot="reference" class="wth16" src="../images/voice.png" alt>
                  </el-popover>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="soundTable table_wrap mar-top" v-else>
            <el-table
              key="soundTableDateOther"
              :data="soundTableDateOther"
              border
              :header-cell-style="{backgroundColor:'#e5e9f3'}"
              style="width:100%"
              max-height="300"
            >
              <el-table-column prop="entrustedBatch" label="委托批次" width="120"></el-table-column>
              <el-table-column prop="callType" width="130">
                <template slot="header">
                  <select class="form-control" v-model="callFlag2">
                    <option value disabled selected style="display:none">通话类型</option>
                    <option value="all">全部</option>
                    <option value="1">呼入</option>
                    <option value="2">呼出</option>
                  </select>
                </template>
              </el-table-column>
              <el-table-column prop="ringup" label="主叫号码"></el-table-column>
              <el-table-column prop="pickup" label="被叫号码"></el-table-column>
              <el-table-column prop="duration" label="通话时长"></el-table-column>
              <el-table-column prop="callTime" label="通话时间"></el-table-column>
              <el-table-column label="操作人">
                <template slot-scope="scope">
                  <el-popover trigger="hover" placement="top">
                    <p>
                      <b>男/在职&nbsp;&nbsp;186****4488</b>&nbsp;
                      <img src="../images/call.png" @click="phoneStatusShow" alt>
                    </p>
                    <p>
                      <span class="workNum">工</span>号：8170823003
                    </p>
                    <p>所属职位：资产管理员-部长</p>
                    <p>隶属单位：长沙分公司-业务部</p>
                    <p>组织关系：谭曼-陈军-李永杰-{{scope.row.handleP}}</p>
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.handleP}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="通话录音">
                <template slot-scope="scope">
                  <el-popover trigger="hover" placement="top">
                    <p>案件录音</p>
                    <div>
                      <audio controls>
                        <source src="../libs/audio/song.ogg" :data-src="scope.row.audioSrc" type="audio/ogg">
                        你的浏览器不支持音乐播放器
                      </audio>
                    </div>
                    <img slot="reference" class="wth16" src="../images/voice.png" alt>
                  </el-popover>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="短信记录" name="seven">
          <div class="clearfix">
            <el-button-group class="pull-left">
              <el-button size="mini" :type="smsFlag==1?'primary':'default'" @click="smsFlag=1">本案资料</el-button>
              <el-tooltip class="patch_tooltilp" placement="bottom-start">
                <div slot="content" class="patch-div">
                  <i class="el-icon-question patch-icon"></i>&nbsp;查看共案资料
                </div>
                <el-button
                  size="mini"
                  :type="smsFlag==1?'default':'primary'"
                  @click="smsFlag=2"
                  style="margin-left:0"
                >共案资料</el-button>
              </el-tooltip>
            </el-button-group>
          </div>
          <div class="smsTable table_wrap mar-top" v-if="smsFlag==1">
            <el-table
              key="smsTableDate"
              :data="smsTableDate"
              border
              :header-cell-style="{backgroundColor:'#e5e9f3'}"
              style="width:100%"
            >
              <el-table-column prop="receiveNumber" label="接收号码" min-width="110"></el-table-column>
              <el-table-column
                prop="msmContent"
                label="短信内容"
                :show-overflow-tooltip="true"
                min-width="180"
              ></el-table-column>
              <el-table-column label="提交人" min-width="100">
                <template slot-scope="scope">
                  <el-popover trigger="hover" placement="top">
                    <p>
                      <b>男/在职&nbsp;&nbsp;186****4488</b>&nbsp;
                      <img src="../images/call.png" @click="phoneStatusShow" alt>
                    </p>
                    <p>
                      <span class="workNum">工</span>号：8170823003
                    </p>
                    <p>所属职位：资产管理员-部长</p>
                    <p>隶属单位：长沙分公司-业务部</p>
                    <p>组织关系：谭曼-陈军-李永杰-{{scope.row.submitter}}</p>
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.submitter}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="submitTime" label="提交时间" min-width="150"></el-table-column>
              <el-table-column prop="auditState" min-width="150">
                <template slot="header">
                  <select class="form-control" v-model="auditStatus">
                    <option value disabled selected style="display:none">审核状态</option>
                    <option value="all">全部</option>
                    <option value="1">审核通过</option>
                    <option value="2">审核不通过</option>
                    <option value="3">待审核</option>
                  </select>
                </template>
              </el-table-column>
              <el-table-column prop="auditor" label="审核人" min-width="100">
                <template slot-scope="scope">
                  <el-popover trigger="hover" placement="top">
                    <p>
                      <b>男/在职&nbsp;&nbsp;186****4488</b>&nbsp;
                      <img src="../images/call.png" @click="phoneStatusShow" alt>
                    </p>
                    <p>
                      <span class="workNum">工</span>号：8170823003
                    </p>
                    <p>所属职位：资产管理员-部长</p>
                    <p>隶属单位：长沙分公司-业务部</p>
                    <p>组织关系：谭曼-陈军-李永杰-{{scope.row.auditor}}</p>
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.auditor}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="operation" label="操作" min-width="180">
                <template>
                  <el-button size="mini" type="text" @click="openBackMessage=true">回执</el-button>
                  <el-button size="mini" type="text" @click="setComplaintShow=true">设置投诉</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="smsTable table_wrap mar-top" v-else>
            <el-table
              key="smsTableDateOther"
              :data="smsTableDateOther"
              border
              :header-cell-style="{backgroundColor:'#e5e9f3'}"
              style="width:100%"
            >
              <el-table-column prop="entrustedBatch" label="委托批次" min-width="120"></el-table-column>
              <el-table-column prop="receiveNumber" label="接收号码" min-width="110"></el-table-column>
              <el-table-column
                prop="msmContent"
                label="短信内容"
                :show-overflow-tooltip="true"
                min-width="180"
              ></el-table-column>
              <el-table-column label="提交人" width="100">
                <template slot-scope="scope">
                  <el-popover trigger="hover" placement="top">
                    <p>
                      <b>男/在职&nbsp;&nbsp;186****4488</b>&nbsp;
                      <img src="../images/call.png" @click="phoneStatusShow" alt>
                    </p>
                    <p>
                      <span class="workNum">工</span>号：8170823003
                    </p>
                    <p>所属职位：资产管理员-部长</p>
                    <p>隶属单位：长沙分公司-业务部</p>
                    <p>组织关系：谭曼-陈军-李永杰-{{scope.row.submitter}}</p>
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.submitter}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="submitTime" label="提交时间" min-width="150"></el-table-column>
              <el-table-column prop="auditState" min-width="150">
                <template slot="header">
                  <select class="form-control" v-model="auditStatus">
                    <option value disabled selected style="display:none">审核状态</option>
                    <option value="all">全部</option>
                    <option value="1">审核通过</option>
                    <option value="2">审核不通过</option>
                    <option value="3">待审核</option>
                  </select>
                </template>
              </el-table-column>
              <el-table-column label="审核人" min-width="100">
                <template slot-scope="scope">
                  <el-popover trigger="hover" placement="top">
                    <p>
                      <b>男/在职&nbsp;&nbsp;186****4488</b>&nbsp;
                      <img src="../images/call.png" @click="phoneStatusShow" alt>
                    </p>
                    <p>
                      <span class="workNum">工</span>号：8170823003
                    </p>
                    <p>所属职位：资产管理员-部长</p>
                    <p>隶属单位：长沙分公司-业务部</p>
                    <p>组织关系：谭曼-陈军-李永杰-{{scope.row.auditor}}</p>
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.auditor}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="operation" label="操作" min-width="180">
                <template>
                  <el-button size="mini" type="text" @click="setComplaintShow=true">设置投诉</el-button>
                  <el-button size="mini" type="text">回执</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="减免记录" name="eight">
          <div class="clearfix">
            <el-button-group class="pull-left">
              <el-button
                size="mini"
                :type="reductFlag==1?'primary':'default'"
                @click="reductFlag=1"
              >本案资料</el-button>
              <el-tooltip class="patch_tooltilp" placement="bottom-start">
                <div slot="content" class="patch-div">
                  <i class="el-icon-question patch-icon"></i>&nbsp;查看共案资料
                </div>
                <el-button
                  size="mini"
                  :type="reductFlag==1?'default':'primary'"
                  @click="reductFlag=2"
                  style="margin-left:0"
                >共案资料</el-button>
              </el-tooltip>
            </el-button-group>
          </div>
          <div class="reductTable table_wrap mar-top" v-if="reductFlag==1">
            <el-table
              key="reductTableDate"
              :data="reductTableDate"
              border
              :header-cell-style="{backgroundColor:'#e5e9f3'}"
              style="width:100%"
              max-height="300"
            >
              <el-table-column prop="applyTime" label="申请时间" width="100"></el-table-column>
              <el-table-column prop="reduceNum" label="减免金额" width="100"></el-table-column>
              <el-table-column prop="repayTime" label="承诺还款日期" width="100"></el-table-column>
              <el-table-column prop="repayNum" label="承诺还款金额" width="100"></el-table-column>
              <el-table-column prop="reduceReason" label="减免原因" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="auditState" width="150">
                <template slot="header">
                  <select class="form-control" v-model="auditStatus">
                    <option value disabled selected style="display:none">审核状态</option>
                    <option value="all">全部</option>
                    <option value="1">审核通过</option>
                    <option value="2">审核不通过</option>
                    <option value="3">待审核</option>
                  </select>
                </template>
              </el-table-column>
              <el-table-column label="申请人" width="80">
                <template slot-scope="scope">
                  <el-popover trigger="hover" placement="top">
                    <p>
                      <b>男/在职&nbsp;&nbsp;186****4488</b>&nbsp;
                      <img src="../images/call.png" @click="phoneStatusShow" alt>
                    </p>
                    <p>
                      <span class="workNum">工</span>号：8170823003
                    </p>
                    <p>所属职位：资产管理员-部长</p>
                    <p>隶属单位：长沙分公司-业务部</p>
                    <p>组织关系：谭曼-陈军-李永杰-罗涛</p>
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.applyer}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="经办人" width="80">
                <template slot-scope="scope">
                  <el-popover trigger="hover" placement="top">
                    <p>
                      <b>男/在职&nbsp;&nbsp;186****4488</b>&nbsp;
                      <img src="../images/call.png" @click="phoneStatusShow" alt>
                    </p>
                    <p>所属职位：资产管理员-部长</p>
                    <p>隶属单位：长沙分公司-业务部</p>
                    <p>组织关系：谭曼-陈军-李永杰-罗涛</p>
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.agent}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="operation" label="操作" width="240">
                <template>
                  <el-button size="mini" type="text" @click="checkReduceVisible=true">查看</el-button>
                  <el-button size="mini" type="text" @click="dialogReduceVisible=true">退回</el-button>
                  <el-button size="mini" type="text">审批详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="reductTable table_wrap mar-top" v-else>
            <el-table
              key="reductTableDateOther"
              :data="reductTableDateOther"
              border
              :header-cell-style="{backgroundColor:'#e5e9f3'}"
              style="width:100%"
              max-height="300"
            >
              <el-table-column prop="entrustedBatch" label="委托批次" width="120"></el-table-column>
              <el-table-column prop="applyTime" label="申请时间" width="100"></el-table-column>
              <el-table-column prop="reduceNum" label="减免金额" width="100"></el-table-column>
              <el-table-column prop="repayTime" label="承诺还款日期" width="100"></el-table-column>
              <el-table-column prop="repayNum" label="承诺还款金额" width="100"></el-table-column>
              <el-table-column prop="reduceReason" label="减免原因" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="auditState" width="150">
                <template slot="header">
                  <select class="form-control" v-model="auditStatus">
                    <option value disabled selected style="display:none">审核状态</option>
                    <option value="all">全部</option>
                    <option value="1">审核通过</option>
                    <option value="2">审核不通过</option>
                    <option value="3">待审核</option>
                  </select>
                </template>
              </el-table-column>
              <el-table-column label="申请人" width="80">
                <template slot-scope="scope">
                  <el-popover trigger="hover" placement="top">
                    <p>男&nbsp;18684774488</p>
                    <p>所属职位：资产管理员-部长</p>
                    <p>隶属单位：长沙分公司-业务部</p>
                    <p>组织关系：谭曼-陈军-李永杰-罗涛</p>
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.applyer}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="经办人" width="80">
                <template slot-scope="scope">
                  <el-popover trigger="hover" placement="top">
                    <p>男&nbsp;18684774488</p>
                    <p>所属职位：资产管理员-部长</p>
                    <p>隶属单位：长沙分公司-业务部</p>
                    <p>组织关系：谭曼-陈军-李永杰-罗涛</p>
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.agent}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="operation" label="操作" width="240">
                <template>
                  <el-button size="mini" type="text" @click="checkReduceVisible=true">查看</el-button>
                  <el-button size="mini" type="text" @click="dialogReduceVisible=true">退回</el-button>
                  <el-button size="mini" type="text">审批详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="减免材料" name="nine">
          <div class="clearfix">
            <el-button-group class="pull-left">
              <el-button size="mini" :type="imgFlag==1?'primary':''" @click="imgFlag=1">本案资料</el-button>
              <el-tooltip class="patch_tooltilp" placement="bottom-start">
                <div slot="content" class="patch-div">
                  <i class="el-icon-question patch-icon"></i>&nbsp;查看共案资料
                </div>
                <el-button
                  size="mini"
                  :type="imgFlag==2?'primary':''"
                  @click="imgFlag=2"
                  style="margin-left:0"
                >共案资料</el-button>
              </el-tooltip>
            </el-button-group>
            <div class="pull-right">
              <el-button size="mini" v-show="imgFlag==1">发起审批</el-button>
              <el-button size="mini" v-show="imgFlag==1">审核材料</el-button>
              <span v-show="imgFlag==2">
                共有
                <b style="color:#2e76ee">6</b>起共案
              </span>&nbsp;
              <el-button size="mini" v-show="imgFlag==2" @click="checkCaseFlag = true">查看共案</el-button>
            </div>
          </div>

          <div class="attachTable table_wrap" v-show="imgFlag==1">
            <el-table
              :data="attachTableData"
              border
              style="width:100%"
              :header-cell-style="{backgroundColor:'#e5e9f3'}"
              max-height="300"
            >
              <el-table-column fixed label="提供者">
                <template slot-scope="scope">
                  <el-popover trigger="hover" placement="top">
                    <p>
                      <b>男/在职&nbsp;&nbsp;186****4488</b>&nbsp;
                      <img src="../images/call.png" @click="phoneStatusShow" alt>
                    </p>
                    <p>所属职位：资产管理员-部长</p>
                    <p>隶属单位：长沙分公司-业务部</p>
                    <p>组织关系：谭曼-陈军-李永杰-{{scope.row.provider}}</p>
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.provider}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column fixed prop="uploadTime" label="上传时间"></el-table-column>
              <el-table-column prop="uploadFile" label="上传文件"></el-table-column>
              <el-table-column prop="instructions" label="说明"></el-table-column>
            </el-table>
          </div>

          <!-- 图片/附件共案信息 -->
          <div style="display:flex;margin-top:20px" v-show="imgFlag==2">
            <div style="width:60%">
              <label style="color:#ff5353;font-size:16px;font-weight:bold;margin-bottom:10px">不同信息</label>
              <div
                style="border-bottom:6px solid #ffdddd;border-top:1px solid #ff5353;padding-top:2px;margin-bottom:20px"
              ></div>
              <div class="wallfall">
                <el-card class="box-card1">
                  <div slot="header" class="clearfix card_header">
                    <b style="float:left">共案1</b>
                    <el-button style="float:right;padding:3px 0;" type="text">详情</el-button>
                  </div>
                  <div style="line-height:25px">
                    <label class="card_label">短信截图</label>
                    <a>20190315聊天记录jpg</a>
                    <br>
                    <label class="card_label">短信截图</label>
                    <a>20190315聊天记录jpg</a>
                  </div>
                </el-card>
                <el-card class="box-card1">
                  <div slot="header" class="clearfix card_header">
                    <b style="float:left">共案2</b>
                    <el-button style="float:right;padding:3px 0;" type="text">详情</el-button>
                  </div>
                  <div style="line-height:25px">
                    <label class="card_label">短信截图</label>
                    <a>20190315聊天记录jpg</a>
                  </div>
                </el-card>
              </div>
            </div>
            <div style="width:39%;margin-left:20px">
              <label style="color:#2e76ee;font-size:16px;font-weight:bold;margin-bottom:10px">相同信息</label>
              <div
                style="border-bottom:6px solid #d5e4fc;border-top:1px solid #2e76ee;padding-top:2px;margin-bottom:20px"
              ></div>
              <el-card class="box-card2">
                <div slot="header" class="clearfix card_header">
                  <b style="float:left">图片/附件</b>
                </div>
                <div style="line-height:25px">
                  <label class="card_label">身份证明</label>
                  <a>户口信息jpg</a>
                  <br>
                  <label class="card_label">身份证明</label>
                  <a>户口信息jpg</a>
                </div>
              </el-card>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="投诉" name="ten">
          <div class="clearfix">
            <el-button-group class="pull-left">
              <el-button
                size="mini"
                :type="complaintFlag==1?'primary':'default'"
                @click="complaintFlag=1"
              >本案资料</el-button>
              <el-tooltip class="patch_tooltilp" placement="bottom-start">
                <div slot="content" class="patch-div">
                  <i class="el-icon-question patch-icon"></i>&nbsp;查看共案资料
                </div>
                <el-button
                  size="mini"
                  :type="complaintFlag==1?'default':'primary'"
                  @click="complaintFlag=2"
                  style="margin-left:0"
                >共案资料</el-button>
              </el-tooltip>
            </el-button-group>
          </div>
          <div v-if="complaintFlag==1" class="table_wrap mar-top">
            <el-table
              key="complainTableData"
              :data="complainTableData"
              :header-cell-style="{backgroundColor:'#e5e9f3'}"
              border
              style="width:100%"
              max-height="300"
            >
              <el-table-column prop="cptp" label="投诉人"></el-table-column>
              <el-table-column prop="cptTime" label="投诉时间"></el-table-column>
              <el-table-column prop="cptContent" label="投诉内容"></el-table-column>
              <el-table-column prop="cptDecide" width="160">
                <template slot="header">
                  <select class="form-control" v-model="complaintVal">
                    <option value disabled selected style="display:none">投诉判定</option>
                    <option value="all">全部</option>
                    <option value="1">判定成立</option>
                    <option value="2">待判定</option>
                    <option value="3">不成立</option>
                  </select>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div v-else class="table_wrap mar-top">
            <el-table
              key="complainTableDataOther"
              :data="complainTableDataOther"
              :header-cell-style="{backgroundColor:'#e5e9f3'}"
              border
              style="width:100%"
              max-height="300"
            >
              <el-table-column prop="entrustedBatch" label="委托批次" width="120"></el-table-column>
              <el-table-column prop="cptp" label="投诉人"></el-table-column>
              <el-table-column prop="cptTime" label="投诉时间"></el-table-column>
              <el-table-column prop="cptContent" label="投诉内容"></el-table-column>
              <el-table-column prop="cptDecide" width="160">
                <template slot="header">
                  <select class="form-control" v-model="complaintVal">
                    <option value disabled selected style="display:none">投诉判定</option>
                    <option value="all">全部</option>
                    <option value="1">判定成立</option>
                    <option value="2">待判定</option>
                    <option value="3">不成立</option>
                  </select>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 工作记录 -->
    <div class="workRecord row">
      <el-row :gutter="15">
        <el-col :lg="20" :md="18" style="border-right:1px solid #ddd;padding-right: 20px;">
          <h5>工作记录</h5>
          <el-tooltip class="patch_tooltilp" placement="top-start">
            <div slot="content" class="patch-div">
              <i class="el-icon-question patch-icon"></i>&nbsp;拨打电话过程中，对如下内容进行操作后，可自动生成工作记录，生成后可进行修改
            </div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
              <div class="clearfix formItemInline">
                <el-form-item class="pull-left" label="催收类型" prop="collectionValue">
                  <el-select v-model="ruleForm.collectionValue" placeholder="请选择">
                    <el-option
                      v-for="item in rFcollection"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item class="pull-left" label="电话号码" prop="phoneNumber">
                  <el-input style="width:217px" v-model.number="ruleForm.phoneNumber" clearable></el-input>
                </el-form-item>
                <el-form-item class="pull-left" label="催收结果" prop="cresultsValue">
                  <el-select
                    @change="cresultChange"
                    v-model="ruleForm.cresultsValue"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in rFcresults"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item class="pull-left" label="案件标记" prop="caseMarkers">
                  <el-select
                    v-model="ruleForm.caseMarkers"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in rcaseMarkers"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="clearfix" v-if="ruleForm.cresultsValue == 'actual'">
                <el-form-item class="pull-left" label="申报业绩" prop="declare">
                  <el-input style="width:217px" v-model.number="ruleForm.declare" clearable></el-input>
                </el-form-item>
                <el-form-item class="pull-left" label="有无凭证" prop="credentials">
                  <el-radio-group v-model="ruleForm.credentials">
                    <el-radio :label="1">有</el-radio>
                    <el-radio :label="2">无</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
              <div class="clearfix" v-if="ruleForm.cresultsValue == 'commitment'">
                <el-form-item class="pull-left" label="承诺金额" prop="cmMoney">
                  <el-input-number style="width:217px" v-model="ruleForm.cmMoney" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item class="pull-left" label="承诺日期" prop="rmTime">
                  <el-date-picker
                    v-model="ruleForm.rmTime"
                    type="date"
                    placeholder="选择日期"
                    style="width:217px"
                  ></el-date-picker>
                </el-form-item>
              </div>
              <!-- <el-form-item label="关系" prop="ships">
                <el-radio-group v-model="ruleForm.ships">
                  <el-radio :label="1">本人</el-radio>
                  <el-radio :label="2">配偶</el-radio>
                  <el-radio :label="3">父母</el-radio>
                  <el-radio :label="4">兄弟姐妹</el-radio>
                  <el-radio :label="5">子女</el-radio>
                  <el-radio :label="6">朋友</el-radio>
                  <el-radio :label="7">同事</el-radio>
                  <el-radio :label="8">其他</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="接听状态" prop="answering">
                <el-radio-group v-model="ruleForm.answering">
                  <el-radio :label="1">停机</el-radio>
                  <el-radio :label="2">关机</el-radio>
                  <el-radio :label="3">占线</el-radio>
                  <el-radio :label="4">呼叫限制</el-radio>
                  <el-radio :label="5">拒接</el-radio>
                  <el-radio :label="6">无人接听</el-radio>
                  <el-radio :label="7">正常接听</el-radio>
                  <el-radio :label="8">空号</el-radio>
                  <el-radio :label="9">易主</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="接听反馈" prop="answeringFeedBack">
                <el-radio-group v-model="ruleForm.answeringFeedBack">
                  <el-radio :label="1">不认识持</el-radio>
                  <el-radio :label="2">争议</el-radio>
                  <el-radio :label="3">其他</el-radio>
                  <el-radio :label="4">已核资</el-radio>
                  <el-radio :label="5">愿意代还</el-radio>
                  <el-radio :label="6">承诺还款</el-radio>
                  <el-radio :label="7">拒绝沟通</el-radio>
                  <el-radio :label="8">无结果</el-radio>
                  <el-radio :label="9">无还款意愿</el-radio>
                  <el-radio :label="10">无还款能力</el-radio>
                </el-radio-group>
              </el-form-item> -->
              
              <el-form-item label="综合描述" prop="desc">
                <el-input type="textarea" v-model="ruleForm.desc"></el-input>
              </el-form-item>
              <el-form-item class="pull-right">
                <el-button size="small" @click="resetForm('ruleForm')">重置</el-button>
                <el-button size="small" type="primary" @click="submitWorkForm('ruleForm')">提交记录</el-button>
              </el-form-item>
            </el-form>
          </el-tooltip>
        </el-col>
        <el-col :lg="4" :md="6" style="padding-left: 20px;">
          <h5>案件操作</h5>
          <!-- <div>
            <el-button size="mini" type="primary" plain>函件登记</el-button>
            <el-button size="mini" type="primary" plain>扣款申请</el-button>
          </div> -->
          <div class="mgt10">
            <el-button size="mini" type="primary" plain @click="sendLetterVisible=true">发函审批</el-button>
            <el-button size="mini" type="primary" plain @click="sendMessageVisible=true">发送短息</el-button>
          </div>
          <div class="mgt10">
            <el-button size="mini" type="primary" plain @click="reductionVisible=true">减免审批</el-button>
            <el-button size="mini" type="primary" plain @click="reductionRegisteVisible=true">减免登记</el-button>
          </div>
          <div class="mgt10">
            <el-button size="mini" type="primary" plain @click="returnCaseVisible=true">申请退案</el-button>
          </div>
          <div class="mgt10">
            <el-button size="mini" type="primary" plain @click="unDayMoneyVisible=true">每日未到账业绩</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 查看减免记录 -->
    <el-dialog title="减免审批" :close-on-click-modal="false" :visible.sync="checkReduceVisible" width="768px">
      <div>
        <p class="pReset activeBgcolor">基本情况</p>
        <el-row>
          <el-col :span="4" class="height26" style="text-align:right;">持卡人姓名：</el-col>
          <el-col :span="8" class="height26">赵业</el-col>
          <el-col :span="4" class="height26" style="text-align:right;">身份证号：</el-col>
          <el-col :span="8" class="height26">33333333333333333</el-col>
          <el-col :span="4" class="height26" style="text-align:right;">银行卡号：</el-col>
          <el-col :span="8" class="height26">6229180011075332</el-col>
          <el-col :span="4" class="height26" style="text-align:right;">银行账号：</el-col>
          <el-col :span="8" class="height26">6229180011075332912</el-col>
          <el-col :span="4" class="height26" style="text-align:right;">开卡日期：</el-col>
          <el-col :span="8" class="height26">2015-09-20</el-col>
          <el-col :span="4" class="height26" style="text-align:right;">截止日期：</el-col>
          <el-col :span="8" class="height26">2019-05-03</el-col>
          <el-col :span="4" class="height26" style="text-align:right;">逾期天数：</el-col>
          <el-col :span="8" class="height26">逾期301-330天</el-col>
          <el-col :span="4" class="height26" style="text-align:right;">最新余额：</el-col>
          <el-col :span="8" class="height26">19419.75</el-col>
          <el-col :span="4" class="height26" style="text-align:right;">经办人姓名：</el-col>
          <el-col :span="8" class="height26">肖子梁(18229584448)</el-col>
          <el-col :span="4" class="height26" style="text-align:right;">经办人上下级：</el-col>
          <el-col :span="8" class="height26">谭曼-刘永兵-王思琴-肖子梁</el-col>
          <el-col :span="4" class="height26" style="text-align:right;">案件类型：</el-col>
          <el-col :span="8" class="height26">中信抢案</el-col>
          <el-col :span="4" class="height26" style="text-align:right;">减免金额：</el-col>
          <el-col :span="8" class="height26">2524.94</el-col>
          <el-col :span="4" class="height26" style="text-align:right;">减免类型：</el-col>
          <el-col :span="8" class="height26">小额</el-col>
          <el-col :span="4" class="height26" style="text-align:right;">审批类型：</el-col>
          <el-col :span="8" class="height26">银行已批复</el-col>
          <el-col :span="4" class="height26" style="text-align:right;">是否附材料：</el-col>
          <el-col :span="8" class="height26">附材料，当日还款</el-col>
          <el-col :span="4" class="height26" style="text-align:right;">证明材料：</el-col>
          <el-col :span="8" class="height26"></el-col>
          <el-col :span="4" class="height26" style="text-align:right;">承诺还款金额：</el-col>
          <el-col :span="8" class="height26">8100</el-col>
          <el-col :span="4" class="height26" style="text-align:right;">减免金额类型 ：</el-col>
          <el-col :span="8" class="height26">三万以下</el-col>
          </el-row>
          <el-row>
            <el-col :span="4" class="height26" style="text-align:right;">减免原因：</el-col>
          <el-col :span="20" class="">持生意失败欠下多家银行债务和高利贷，身体不好，无经济来源，生活需要朋友接济，经常有高利贷上门要债为不拖累家人持卡人本人失踪，家人为能早日一家圆聚愿意优先代偿银行债务，但经济能力有限，恳请银行给予最大幅度的减免，感谢。</el-col>
        </el-row>
        <p class="pReset marginT10" style="border-bottom:1px dashed #c1c7d0;">银行批复</p>
        <el-row>
          <el-col :span="5" class="height26" style="text-align:right;">银行批复还款金额：</el-col>
          <el-col :span="7" class="height26">8100</el-col>
          <el-col :span="4" class="height26" style="text-align:right;">批复减免有效期：</el-col>
          <el-col :span="8" class="height26">2019-05-31 00:00:00</el-col>
          <el-col :span="4" class="height26" style="text-align:right;">银行反馈意见：</el-col>
          <el-col :span="20" class="height26">仅限2019年5月减免，需当月还清减免全部金额，逾期作废</el-col>
          <el-col :span="4" class="height26" style="text-align:right;">申请减免证明：</el-col>
          <el-col :span="20" class="height26">不申请</el-col>
          <el-col :span="4" class="height26" style="text-align:right;">减免材料：</el-col>
          <el-col :span="20" class="height26"></el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="checkReduceVisible = false">确定</el-button>
      </span>
    </el-dialog>
    <!-- 撤回减免操作弹框 -->
    <el-dialog
      title="退回减免审批"
      :close-on-click-modal="false"
      :visible.sync="dialogReduceVisible"
      width="768px"
    >
      <el-form :model="reduceform" ref="reduceform" label-width="120px">
        <el-form-item label="退回原因：" prop="info">
          <el-input v-model="reduceform.info" style="width: 580px;" placeholder="退回原因"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogReduceVisible = false">关闭</el-button>
        <el-button type="primary" @click="submitReduceForm('reduceform')">退回审批</el-button>
      </span>
    </el-dialog>
    <!-- 新增联系方式弹框 -->
    <el-dialog
      title="新增联系方式"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="768px"
    >
      <el-form
        :model="addPhoneform"
        :rules="addPhoneformRule"
        ref="addPhoneform"
        label-width="120px"
      >
        <el-row>
          <el-col :md="12">
            <el-form-item label="类型：" prop="type" >
              <el-select  v-model="addPhoneform.type" placeholder="请选择">
                    <el-option  v-for="item in raddphoneType"  :key="item.value" :label="item.label"  :value="item.value" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <div  v-if="addPhoneform.type == 'addphone'">
          <el-col :md="12">
            <el-form-item label="关系：" prop="rel">
              <el-select v-model="addPhoneform.rel" style="width:217px">
                <el-option label="本人" value="rel1"></el-option>
                <el-option label="配偶" value="rel2"></el-option>
                <el-option label="父母" value="rel3"></el-option>
                <el-option label="兄弟姐妹" value="rel4"></el-option>
                <el-option label="子女" value="rel5"></el-option>
                <el-option label="朋友" value="rel6"></el-option>
                <el-option label="同事" value="rel7"></el-option>
                <el-option label="其他" value="rel8"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="名称：" prop="name">
              <el-input v-model="addPhoneform.name" style="width:217px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="有效性：" prop="effective">
              <el-select v-model="addPhoneform.effective">
                <el-option label="有效" value="effective1"></el-option>
                <el-option label="无效" value="effective2"></el-option>
                <el-option label="存疑" value="effective3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="24">
            <el-form-item label="号码：" prop="info">
              <el-input v-model="addPhoneform.info" style="width: 580px;"></el-input>
            </el-form-item>
          </el-col>
          </div>
          <div  v-if="addPhoneform.type == 'addaddress'">
            <el-col :md="12">
            <el-form-item label="地址类：" prop="addressType">
              <el-select v-model="addPhoneform.addressType" style="width:217px">
                <el-option label="公司地址" value="addressType1"></el-option>
                <el-option label="学校地址" value="addressType2"></el-option>
                <el-option label="家庭地址" value="addressType3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="邮编：" prop="zipCode">
              <el-input v-model="addPhoneform.zipCode" style="width:217px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="有效性：" prop="effective">
              <el-select v-model="addPhoneform.effective">
                <el-option label="有效" value="effective1"></el-option>
                <el-option label="无效" value="effective2"></el-option>
                <el-option label="存疑" value="effective3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="24">
            <el-form-item label="地址：" prop="zipaddress">
              <el-input v-model="addPhoneform.zipaddress" style="width: 580px;"></el-input>
            </el-form-item>
          </el-col>
          </div>
        </el-row>
      </el-form>
        

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm('addPhoneform')">保存</el-button>
      </span>
    </el-dialog>
    <!-- 设置投诉弹框 重复-->
    <!-- <el-dialog title="设置投诉" :close-on-click-modal="false" :visible.sync="setComplaintShow" width="768px">
      <div>亲爱的管理员，将案件设置为投诉状态，该案件将无法再发送短信，请再次确认！</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setComplaintShow = false">取消</el-button>
        <el-button type="primary">保存</el-button>
      </span>
    </el-dialog> -->
    <!-- 查看共案弹框 -->
    <el-dialog title="查看共案" :close-on-click-modal="false" :visible.sync="checkCaseFlag" width="768px">
      <div>查看共案！</div>
    </el-dialog>
    <!-- 发函审批弹框 -->
    <el-dialog title="发函审批" :close-on-click-modal="false" :visible.sync="sendLetterVisible" width="768px">
      <div>
        <p class="pReset activeBgcolor">基本情况</p>
        <el-row>
          <el-col :span="4" class="height26" style="text-align:right;">持卡人姓名：</el-col>
          <el-col :span="8" class="height26">赵业</el-col>
          <el-col :span="4" class="height26" style="text-align:right;">身份证号：</el-col>
          <el-col :span="8" class="height26">33333333333333333</el-col>
          <el-col :span="4" class="height26" style="text-align:right;">银行卡号：</el-col>
          <el-col :span="8" class="height26">6229180011075332</el-col>
          <el-col :span="4" class="height26" style="text-align:right;">银行账号：</el-col>
          <el-col :span="8" class="height26">6229180011075332912</el-col>
          <el-col :span="4" class="height26" style="text-align:right;">开卡日期：</el-col>
          <el-col :span="8" class="height26">2015-09-20</el-col>
          <el-col :span="4" class="height26" style="text-align:right;">截止日期：</el-col>
          <el-col :span="8" class="height26">2019-05-03</el-col>
          <el-col :span="4" class="height26" style="text-align:right;">逾期天数：</el-col>
          <el-col :span="8" class="height26">逾期301-330天</el-col>
          <el-col :span="4" class="height26" style="text-align:right;">最新余额：</el-col>
          <el-col :span="8" class="height26">19419.75</el-col>
          <el-col :span="4" class="height26" style="text-align:right;">经办人姓名：</el-col>
          <el-col :span="8" class="height26">肖子梁(18229584448)</el-col>
          <el-col :span="4" class="height26" style="text-align:right;">经办人上下级：</el-col>
          <el-col :span="8" class="height26">谭曼-刘永兵-王思琴-肖子梁</el-col>
          <el-col :span="4" class="height26" style="text-align:right;">案件类型：</el-col>
          <el-col :span="8" class="height26">中信抢案</el-col>
        </el-row>
        <p class="pReset marginT10" style="border-bottom:1px dashed #c1c7d0;">发函内容</p>
        <el-form :model="sendLetterform" :rules="sendLetterformRule" ref="sendLetterform" label-width="150px">
          <el-row>
            <el-col :md="12">
              <el-form-item label="接函传真/邮箱号：" prop="email">
                <el-input v-model="sendLetterform.email" style="width:200px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="函件类型：" prop="type">
                <el-input v-model="sendLetterform.type" style="width:200px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="接函单位/个人：" prop="receiver">
                <el-input v-model="sendLetterform.receiver" style="width:200px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
            <el-form-item label="双方是否已沟通：" prop="communicate">
                <el-input v-model="sendLetterform.communicate" style="width:200px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
            <el-form-item label="备注信息：" prop="marks">
                <el-input v-model="sendLetterform.marks" style="width:200px"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sendLetterVisible = false">取消</el-button>
        <el-button type="primary" @click="sendLetterVisible = false">保存</el-button>
      </span>
    </el-dialog>
    <!-- 减免审批弹框 -->
    <el-dialog title="减免审批" :close-on-click-modal="false" :visible.sync="reductionVisible" width="768px">
      <p class="pReset activeBgcolor">基本情况</p>
      <el-row>
        <el-col :span="4" class="height26" style="text-align:right;">持卡人姓名：</el-col>
        <el-col :span="8" class="height26">赵业</el-col>
        <el-col :span="4" class="height26" style="text-align:right;">身份证号：</el-col>
        <el-col :span="8" class="height26">33333333333333333</el-col>
        <el-col :span="4" class="height26" style="text-align:right;">银行卡号：</el-col>
        <el-col :span="8" class="height26">6229180011075332</el-col>
        <el-col :span="4" class="height26" style="text-align:right;">银行账号：</el-col>
        <el-col :span="8" class="height26">6229180011075332912</el-col>
        <el-col :span="4" class="height26" style="text-align:right;">开卡日期：</el-col>
        <el-col :span="8" class="height26">2015-09-20</el-col>
        <el-col :span="4" class="height26" style="text-align:right;">截止日期：</el-col>
        <el-col :span="8" class="height26">2019-05-03</el-col>
        <el-col :span="4" class="height26" style="text-align:right;">逾期天数：</el-col>
        <el-col :span="8" class="height26">逾期301-330天</el-col>
        <el-col :span="4" class="height26" style="text-align:right;">最新余额：</el-col>
        <el-col :span="8" class="height26">19419.75</el-col>
        <el-col :span="4" class="height26" style="text-align:right;">经办人姓名：</el-col>
        <el-col :span="8" class="height26">肖子梁(18229584448)</el-col>
        <el-col :span="4" class="height26" style="text-align:right;">经办人上下级：</el-col>
        <el-col :span="8" class="height26">谭曼-刘永兵-王思琴-肖子梁</el-col>
        <el-col :span="4" class="height26" style="text-align:right;">案件类型：</el-col>
        <el-col :span="8" class="height26">中信抢案</el-col>
      </el-row>
      <p class="pReset marginT10" style="border-bottom:1px dashed #c1c7d0;">审批内容</p>
      <el-form :model="reductionform" :rules="reductionformRule" ref="reductionform" label-width="150px">
        <el-row>
          <el-col :md="12">
            <el-form-item label="代偿人：" prop="replacePerson">
              <el-input v-model="reductionform.replacePerson" style="width:217px" placeholder="非代偿类此处留空"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="承诺还款金额：" prop="promiseNum">
              <el-input v-model="reductionform.promiseNum" style="width:217px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="是否附带材料：" prop="extraFile">
              <el-select v-model="addPhoneform.extraFile" style="width:217px">
                <el-option label="附材料，当日还款" value="rel1"></el-option>
                <el-option label="附材料，当日不还款" value="rel2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
           <el-form-item label="证明材料：" prop="proveFile">
              <el-input v-model="reductionform.proveFile" style="width:217px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
           <el-form-item label="减免金额类型：" prop="reductNumType">
              <el-select v-model="addPhoneform.reductNumType" style="width:217px">
                <el-option label="三万以上" value="rel1"></el-option>
                <el-option label="五万以上" value="rel2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
           <el-form-item label="减免金额：" prop="reductNum">
              <el-input v-model="reductionform.reductNum" style="width:217px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24">
           <el-form-item label="减免类型：" prop="reductType">
              <el-select v-model="addPhoneform.reductType" style="width:580px">
                <el-option label="共债情况严重，远远超出欠款人偿还能力" value="rel1"></el-option>
                <el-option label="共债情况严重，未超出欠款人偿还能力" value="rel2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="24">
           <el-form-item label="减免原因：" prop="reductReason">
              <el-input v-model="reductionform.reductReason" style="width:580px" placeholder="减免原因，不得少于35个字"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24">
           <el-form-item label="减免材料：" prop="reductFile">
              <el-input v-model="reductionform.reductFile" style="width:580px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="reductionVisible = false">取消</el-button>
        <el-button type="primary" @click="reductionVisible = false">保存</el-button>
      </span>
    </el-dialog>
    <!-- 减免登记弹框 -->
    <el-dialog title="减免登记" :close-on-click-modal="false" :visible.sync="reductionRegisteVisible" width="768px">
      <p class="pReset activeBgcolor">基本情况</p>
      <el-row>
        <el-col :span="4" class="height26" style="text-align:right;">持卡人姓名：</el-col>
        <el-col :span="8" class="height26">赵业</el-col>
        <el-col :span="4" class="height26" style="text-align:right;">身份证号：</el-col>
        <el-col :span="8" class="height26">33333333333333333</el-col>
        <el-col :span="4" class="height26" style="text-align:right;">银行卡号：</el-col>
        <el-col :span="8" class="height26">6229180011075332</el-col>
        <el-col :span="4" class="height26" style="text-align:right;">银行账号：</el-col>
        <el-col :span="8" class="height26">6229180011075332912</el-col>
        <el-col :span="4" class="height26" style="text-align:right;">开卡日期：</el-col>
        <el-col :span="8" class="height26">2015-09-20</el-col>
        <el-col :span="4" class="height26" style="text-align:right;">截止日期：</el-col>
        <el-col :span="8" class="height26">2019-05-03</el-col>
        <el-col :span="4" class="height26" style="text-align:right;">逾期天数：</el-col>
        <el-col :span="8" class="height26">逾期301-330天</el-col>
        <el-col :span="4" class="height26" style="text-align:right;">最新余额：</el-col>
        <el-col :span="8" class="height26">19419.75</el-col>
        <el-col :span="4" class="height26" style="text-align:right;">经办人姓名：</el-col>
        <el-col :span="8" class="height26">肖子梁(18229584448)</el-col>
        <el-col :span="4" class="height26" style="text-align:right;">经办人上下级：</el-col>
        <el-col :span="8" class="height26">谭曼-刘永兵-王思琴-肖子梁</el-col>
        <el-col :span="4" class="height26" style="text-align:right;">案件类型：</el-col>
        <el-col :span="8" class="height26">中信抢案</el-col>
      </el-row>
      <p class="pReset marginT10" style="border-bottom:1px dashed #c1c7d0;">登记内容</p>
      <el-form :model="reductionRegisteform" :rules="reductionRegisteformRule" ref="reductionRegisteform" label-width="150px">
        <el-row>
       
          <el-col :md="12">
            <el-form-item label="减免预批复金额：" prop="preReductNum">
              <el-input v-model="reductionRegisteform.preReductNum" style="width:217px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="还款人联系方式：" prop="phone">
              <el-input v-model="reductionRegisteform.phone" style="width:217px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="还款人地址：" prop="address">
              <el-input v-model="reductionRegisteform.address" style="width:217px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="代偿人联系方式：" prop="replacePersonPhone">
              <el-input v-model="reductionRegisteform.replacePersonPhone" style="width:217px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="代偿人地址：" prop="replacePersonAddress">
              <el-input v-model="reductionRegisteform.replacePersonAddress" style="width:217px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="还款金额：" prop="repayNum">
              <el-input v-model="reductionRegisteform.repayNum" style="width:217px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="还款日期：" prop="repayTime">
              <el-input v-model="reductionRegisteform.repayTime" style="width:217px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="拟减免金额：" prop="planReductNum">
              <el-input v-model="reductionRegisteform.planReductNum" style="width:217px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="减免类型：" prop="reductType">
              <el-select v-model="addPhoneform.reductType" style="width:217px">
                <el-option label="小额" value="rel1"></el-option>
                <el-option label="大额" value="rel2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="24">
            <el-form-item label="减免材料：" prop="reductFile">
              <el-input v-model="reductionRegisteform.reductFile" style="width:580px" placeholder="请输入减免材料"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24">
            <el-form-item label="减免原因：" prop="reductReason">
              <el-input v-model="reductionRegisteform.reductReason" style="width:580px" placeholder="请输入减免原因"></el-input>
            </el-form-item>
          </el-col>
          
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="reductionRegisteVisible = false">取消</el-button>
        <el-button type="primary" @click="reductionRegisteVisible = false">保存</el-button>
      </span>
    </el-dialog>

<!-- 发送短信弹框 -->
    <el-dialog title="发送短信" :close-on-click-modal="false" :visible.sync="sendMessageVisible" width="900px">
      
      <el-form :model="sendMessageform" :rules="sendMessageformRule" ref="sendMessageform" label-width="120px">
        
        <el-row>
          <!-- 左 -->
          <el-col :md="12">
            <p class="pReset">短信模板</p>
            <div class="template-box">
              <div class="template-item activeBgcolor">
                <p>1、针对公司新抢账户，首次联系客户本人时可以使用，发送频率一次</p>
                <div>
                  尊敬的中信银行信用卡用户：XXX先生/女士，身份证：******，卡号：******，欠款金额：******元。具体事宜详询中信银行信用卡中心委托机构湖南永雄资产管理集团有限公司，电话：0731-8187**** ，如非本人或已偿还，请忽略此短信。
                </div>
              </div>
              <div class="template-item">
                <p>2、针对公司在案账户，已经与客户取得联系在确定对方身份的情况下使用，是为提升催收效率和客户电话接听率</p>
                <div>
                  尊敬的中信银行信用卡用户：XXX先生/女士，身份证：******，卡号：******，欠款金额：******元，现可联系我司协商还款事宜，具体事宜详询中信银行信用卡中心委托机构湖南永雄资产管理集团有限公司，电话：0731-8187****，如非本人或已偿还，请忽略此短信。</div>
              </div>
              <div class="template-item">
                <p>3、针对公司新抢账户，首次联系客户本人时可以使用，发送频率一次</p>
                <div>
                  尊敬的中信银行信用卡用户：XXX先生/女士，身份证：******，卡号：******，欠款金额：******元。具体事宜详询中信银行信用卡中心委托机构湖南永雄资产管理集团有限公司，电话：0731-8187**** ，如非本人或已偿还，请忽略此短信。
                </div>
              </div>
              <div class="template-item">
                <p>4、针对公司新抢账户，首次联系客户本人时可以使用，发送频率一次</p>
                <div>
                  尊敬的中信银行信用卡用户：XXX先生/女士，身份证：******，卡号：******，欠款金额：******元。具体事宜详询中信银行信用卡中心委托机构湖南永雄资产管理集团有限公司，电话：0731-8187**** ，如非本人或已偿还，请忽略此短信。
                </div>
              </div>
            </div>
           
          </el-col>
          <!-- 右 -->
          <el-col :md="12" style="padding-left: 10px;">
            <p style="color:#fe545a;">温馨提示：发送短信的内容根据模板自动生成，不允许修改</p>
            <p style="color:#2e76ee;font-size:12px;">发送人手机号：系统自动获取当前用户已配置且有发送短信权限的联通手机号</p>
            <el-form-item label="发送人手机号：" prop="sendPhone" style="margin-bottom:0px;">
              <el-input v-model="sendMessageform.sendPhone" style="width:280px"></el-input>
            </el-form-item>
            <el-form-item label="接收人手机号：" prop="receivePhone" style="margin-bottom:0px;">
              <el-input v-model="sendMessageform.receivePhone" style="width:280px"></el-input>
            </el-form-item>
            <el-form-item label="发送短信内容：" prop="message" >
              <el-input v-model="sendMessageform.message" style="width:280px;" :rows="20" resize="false" type="textarea" placeholder="请选择短信内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sendMessageVisible = false">取消</el-button>
        <el-button type="primary" @click="sendMessageVisible = false">保存</el-button>
      </span>
    </el-dialog>

    <!-- 每日未到账业绩弹框 -->
    <el-dialog title="每日未到账业绩" :close-on-click-modal="false" :visible.sync="unDayMoneyVisible" width="768px">
      <p style="margin:0 0 20px 38px;color:#fe545a;">该功能用于持卡人已还款,有凭证,但每日业绩中无记录,需要跟银行沟通查对。最新余额：19419.75</p>
      <el-form :model="unDayMoneyform" :rules="unDayMoneyformRule" ref="unDayMoneyform" label-width="120px">
        <el-row>
          <el-col :md="12">
            <el-form-item label="还款金额：" prop="num">
              <el-input v-model="unDayMoneyform.num" style="width:217px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="还款方式：" prop="type">
              <el-input v-model="unDayMoneyform.type" style="width:217px" placeholder="仅限20字以内"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="还款时间：" prop="time">
              <el-input v-model="unDayMoneyform.time" style="width:217px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
           <el-form-item label="还款备注：" prop="marks">
              <el-input v-model="unDayMoneyform.marks" style="width:217px" placeholder="仅限20字以内"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="unDayMoneyVisible = false">取消</el-button>
        <el-button type="primary" @click="unDayMoneyVisible = false">保存</el-button>
      </span>
    </el-dialog>

    <!-- 申请退案弹框 -->
    <el-dialog title="信息" :close-on-click-modal="false" :visible.sync="returnCaseVisible" width="250px">
      <div>您确定申请退案吗？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="returnCaseVisible = false">取消</el-button>
        <el-button type="primary" @click="returnCaseVisible = false">确定</el-button>
      </span>
    </el-dialog>

    <!-- 电话号码状态弹框 -->
    <div id="phone" class="phone-modal normalPhone" v-if="phoneStatusVisible">
      <h3 style="margin-top:10px;font-size: 20px;">号码信息(156***9240)</h3>
      <button class="closeBtn" @click="phoneStatusHide()">
        <i></i>
      </button>
      <div class="phone-status"></div>
      <table width="100%" cellspacing="0" cellpadding="0">
        <tbody>
          <tr>
            <td>
              归属地：
              <span>湖南 株洲</span>
            </td>
          </tr>
          <tr>
            <td>
              号码状态：
              <select id="phoneStatus" class="readOnlyShow">
                <option class="readOnlyShow" value="0">--请选择--</option>
                <option class="readOnlyShow" value="1">实号</option>
                <option class="readOnlyShow" value="2">空号</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>
              更新时间：
              <span>2019-04-12</span>
            </td>
          </tr>
          <tr>
            <td>
              被拨打（次）：
              <b class="tellTimes">0</b>
              <button
                @click="phoneRecord = true"
                class="btn btn-primary recordBtn readOnlyShow"
              >通话记录</button>
            </td>
          </tr>
          <tr>
            <td>
              <button
                onclick="phoneCommon.callSearch(outData.phoneNumber)"
                class="btn btn-success readOnlyShow"
              >内部搜</button>
            </td>
          </tr>
          <tr>
            <td>
              联通号码：15675148845
              <button class="btn phoneIco">
                <i></i>
              </button>
              <button class="btn messageIco">
                <i></i>
              </button>
            </td>
          </tr>
          <tr>
            <td>
              联通号码：13511111115
              <button class="btn phoneIco">
                <i></i>
              </button>
              <button class="btn messageIco">
                <i></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- 设置投诉弹框 -->
    <el-dialog title="设置投诉" :close-on-click-modal="false" :visible.sync="setComplaintShow" width="400px">
      <div>亲爱的管理员，将案件设置为投诉状态，该案件将无法再发送短信，请再次确认！</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setComplaintShow = false">取消</el-button>
        <el-button type="primary" @click="setComplaintShow = false">保存</el-button>
      </span>
    </el-dialog>
    <!-- 还款记录数据导出 -->
    <el-dialog title="提示" :close-on-click-modal="false" :visible.sync="exportDataFlag" width="400px">
      <div class="expDcontent">尊敬的管理员，感谢您使用数据导出系统，本系统将自动保存您的操作记录，因您导出的文件属于公司保密信息，请务必妥善保管与使用以保证您导出文件信息安全，一旦私自外泄，将严格按照公司信息安全规章制度进行处理！</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="exportDataFlag = false">取消</el-button>
        <el-button type="primary">导出</el-button>
      </span>
    </el-dialog>
    <!-- 今日工作记录数 -->
    <el-dialog title="今日工作记录数" :close-on-click-modal="false" :visible.sync="todayRecordFlag" width="400px">
      <div>尊敬的用户，您今日工作记录总条数为：10条！如需查看具体记录详 情，可去【统计报表>工作记录统计】中查看。</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="todayRecordFlag = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 查看共案弹框 -->
    <el-dialog
      title="查看共案"
      :close-on-click-modal="false"
      :visible.sync="checkCaseFlag"
      width="900px"
    >
      <div class="table_wrap">
        <el-table
          key="totalCaseInfo"
          :data="totalCaseInfoTData"
          :header-cell-style="{backgroundColor:'#e5e9f3'}"
          border
          style="width:100%"
          max-height="500"
        >
          <el-table-column prop="statistics" label="相关统计" width="120px">
              <template slot-scope="scope">
                    <span class="fontiocn cheng" v-if="scope.row.statistics.match('1')" title="案件有承诺还款">承</span>
                    <span class="fontiocn bu" v-if="scope.row.statistics.match('2')" title="案件有部分还款">部</span>
                    <span class="fontiocn lian" v-if="scope.row.statistics.match('3')" title="案件有有效可联系人">联</span>
              </template>
          </el-table-column>
          <el-table-column prop="entrustBank" label="委托银行" min-width="80px"></el-table-column>
          <el-table-column prop="recentlyRb" label="近一年累计还款" min-width="120px"></el-table-column>
          <el-table-column prop="lastRb" label="最后一次还款金额" min-width="120px"></el-table-column>
          <el-table-column prop="lastRbTime" label="最后一次还款时间" min-width="120px"></el-table-column>
          <el-table-column prop="entrustAmount" label="委托金额" min-width="80px"></el-table-column>
          <el-table-column prop="nowStatus" width="80" label="在案状态"></el-table-column>
          <el-table-column label="查看" width="80" fixed="right">
              <template slot-scope="scope">
                  <el-button type="text" size="small" @click.native.prevent="viewDetail(scope.$index,scope.row.caseStatus)">
                      详情
                  </el-button>
              </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!-- 通话记录弹框 -->
    <div
      class="phone-modal sound-modal"
      style="top: 100px; left: 50%; display: block;"
      v-if="phoneRecord"
    >
      <h3 style="margin-top:10px;font-size: 20px;">通话记录</h3>
      <button class="closeBtn" @click="phoneRecord = false">
        <i></i>
      </button>
      <ul class="recordNav clearfix">
        <li :class="callRecord ==true?'active':''" @click="callRecord = true">
          <a href="###">去电记录</a>
        </li>
        <li :class="callRecord ==false?'active':''" @click="callRecord = false">
          <a href="###">来电记录</a>
        </li>
      </ul>
      <div class="soundWrap">
        <table
          width="100%"
          cellspacing="0"
          cellpadding="0"
          class="soundTab"
          style="display: table;"
          v-if="callRecord ==true"
        >
          <tbody>
            <tr>
              <td>2019-04-14 17:01:49</td>
              <td>去电(---)</td>
            </tr>
            <tr>
              <td>2019-04-14 16:57:32</td>
              <td>去电(---)</td>
            </tr>
          </tbody>
        </table>
        <table
          width="100%"
          cellspacing="0"
          cellpadding="0"
          class="soundTab none"
          style="display: table;"
          v-if="callRecord ==false"
        >
          <tbody>
            <tr>
              <td>2019-04-08 10:07:55</td>
              <td>来电(---)</td>
            </tr>
            <tr>
              <td>2019-04-08 10:07:55</td>
              <td>来电(---)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- 删除此行联系方式 -->
 <el-dialog
      title="温馨提示"
      :close-on-click-modal="false"
      :visible.sync="opendelMessage"
      width="450px"
    >
    <div style="text-align:center;padding:20px 0px;">删除后不能恢复， 您确定删除吗?</div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="opendelMessage = false">关闭</el-button>
        <el-button type="primary" @click="opendelMessage = false">确认删除</el-button>
      </span>
    </el-dialog>
    <!-- 回执弹框 -->
    <el-dialog
      title="回执记录"
      :close-on-click-modal="false"
      :visible.sync="openBackMessage"
      width="800px"
    >
    <div style="max-height:600px;overflow-y:auto">
      <p class="back_Info_right pull-right">
        <b>185****6589</b>
        <b style="margin-left:15px">2019-03-20 13:14:20</b>
      </p>
      <p
        class="selfCont pull-right"
      >陈先生，您好！关于您上海浦东发展银行信用卡（卡号为62200125465552001）的还款可以通过以下几种方式。发展银行信用卡（卡号为62200125465552001）的还款可以通过以下几种方式。</p>
      <p class="back_Info_left pull-left">
        <b>189****0877</b>
        <b style="margin-left:15px">2019-03-20 13:15:40</b>
      </p>
      <p class="oppCont pull-left">好的，我知道了！</p>

      <p class="back_Info_right pull-right">
        <b>185****6589</b>
        <b style="margin-left:15px">2019-03-20 13:14:20</b>
      </p>
      <p
        class="currentCont pull-right"
      >陈先生，您好！关于您上海浦东发展银行信用卡（卡号为62200125465552001）的还款可以通过以下几种方式。发展银行信用卡（卡号为62200125465552001）的还款可以通过以下几种方式。</p>
      <p class="back_Info_left pull-left">
        <b>189****0877</b>
        <b style="margin-left:15px">2019-03-20 13:15:40</b>
      </p>
      <p class="oppCont pull-left">好的，我知道了！</p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import "../libs/css/mh_common.css";
import TableSelect from "./TableSelect";
import { clearTimeout, setTimeout } from "timers";
import myMixin from "../libs/js/mixin.js"; //导入mixin修复page-content全屏功能

export default {
  name: "CaseDatails",
  mixins: [myMixin],
  components: { TableSelect },
  data() {
    return {
      caseTypeStatus:'death',
      haveMoneyNum:8,
      clickHaveMoney:false,
      haveNoNum:3,
      clickHaveNoNum:false,
      openBackMessage: false,
      opendelMessage: false,
      workFlag:1,
      contractFlag:1,
      imgFlag:1,
      baseFlag:1,
      complaintFlag:1,
      smsFlag:1,
      reductFlag:1,
      soundFlag:1,
      replayFlag:1,
      agentFlag:1,
      setComplaintShow:false,
      checkCaseFlag:false,
      exportDataFlag:false,
      todayRecordFlag:false,
      baseTableData:[
          {
              entrustedBank:'平安普惠',
              entrustedBatch:'20180403_01',
              lastYearPayBackNum:'5,000.00',
              lastPayBackNum:'5,000.00',
              lastPayBackTime:'2019/4/2',
              entrustedNum:'5,800.00',
              caseStatus:'在案'
          },
          {
              entrustedBank:'平安普惠',
              entrustedBatch:'20180403_01',
              lastYearPayBackNum:'5,000.00',
              lastPayBackNum:'5,000.00',
              lastPayBackTime:'2019/4/2',
              entrustedNum:'5,800.00',
              caseStatus:'在案'
          },
          {
              entrustedBank:'平安普惠',
              entrustedBatch:'20180403_01',
              lastYearPayBackNum:'5,000.00',
              lastPayBackNum:'5,000.00',
              lastPayBackTime:'2019/4/2',
              entrustedNum:'5,800.00',
              caseStatus:'在案'
          },
          {
              entrustedBank:'平安普惠',
              entrustedBatch:'20180403_01',
              lastYearPayBackNum:'5,000.00',
              lastPayBackNum:'5,000.00',
              lastPayBackTime:'2019/4/2',
              entrustedNum:'5,800.00',
              caseStatus:'在案'
          },
          {
              entrustedBank:'平安普惠',
              entrustedBatch:'20180403_01',
              lastYearPayBackNum:'5,000.00',
              lastPayBackNum:'5,000.00',
              lastPayBackTime:'2019/4/2',
              entrustedNum:'5,800.00',
              caseStatus:'在案'
          },
          {
              entrustedBank:'平安普惠',
              entrustedBatch:'20180403_01',
              lastYearPayBackNum:'5,000.00',
              lastPayBackNum:'5,000.00',
              lastPayBackTime:'2019/4/2',
              entrustedNum:'5,800.00',
              caseStatus:'在案'
          }
      ],
      callSigns: ["有效联系人"], 
      recordCallSigns: ["承诺还款类"],
      toTopFlag: false,
      timeout: null,
      auditStatus: "",
      recordCollectType: "",
      complaintVal: "",
      agentRestaurants: [],
      agentPersonValue: "",
      addPhoneform: {
        type: "addphone",
        info: "",
        name: "",
        rel: "",
        effective: "",
        addressType:"",
        zipCode:"",
        zipaddress:""
      },
      unDayMoneyform:{
        num:"",
        type:"",
        time:"",
        marks:""
      },
      unDayMoneyformRule: {
        num: [{ required: false, message: "请选择类型", trigger: "change" }],
        type: [{ required: false, message: "仅限20字以内", trigger: "blur" }],
        time: [{ required: false, message: "请填写名字", trigger: "change" }],
        marks: [{ required: false, message: "仅限20字以内", trigger: "blur" }]
      },
      sendMessageform:{
        sendPhone:"",
        receivePhone:"",
        message:""
      },
      sendMessageformRule: {
        sendPhone:[{ required: false, message: "请选择类型", trigger: "change" }],
        receivePhone:[{ required: false, message: "请选择类型", trigger: "change" }],
        message:[{ required: false, message: "请选择类型", trigger: "change" }]
      },
      sendLetterform:{
        email:"",
        type:"",
        receiver:"",
        communicate:"",
        marks:""
      },
      sendLetterformRule:{
        email:[{ required: true, message: "请填写邮箱号", trigger: "blur" }],
        type:[{ required: false, message: "请选择类型", trigger: "change" }],
        receiver:[{ required: false, message: "请选择类型", trigger: "change" }],
        communicate:[{ required: false, message: "请选择类型", trigger: "change" }],
        marks:[{ required: false, message: "请选择类型", trigger: "change" }]
      },
      reductionform:{
        replacePerson:"",
        promiseNum:"",
        extraFile:"",
        proveFile:"",
        reductNumType:"",
        reductNum:"",
        reductType:"",
        reductReason:"",
        reductFile:""
      },
      reductionformRule:{
        replacePerson:[{ required: false, message: "请选择类型", trigger: "change" }],
        promiseNum:[{ required: false, message: "请选择类型", trigger: "change" }],
        extraFile:[{ required: false, message: "请选择类型", trigger: "change" }],
        proveFile:[{ required: false, message: "请选择类型", trigger: "change" }],
        reductNumType:[{ required: false, message: "请选择类型", trigger: "change" }],
        reductNum:[{ required: false, message: "请选择类型", trigger: "change" }],
        reductType:[{ required: false, message: "请选择类型", trigger: "change" }],
        reductReason:[{ required: false, message: "请选择类型", trigger: "change" }],
        reductFile:[{ required: false, message: "请选择类型", trigger: "change" }]
      },
      reductionRegisteform:{
        preReductNum:"",
        phone:"",
        address:"",
        replacePersonPhone:"",
        replacePersonAddress:"",
        repayNum:"",
        repayTime:"",
        planReductNum:"",
        reductType:"",
        reductFile:"",
        reductReason:""
      },
      reductionRegisteformRule:{
        preReductNum:[{ required: false, message: "请选择类型", trigger: "change" }],
        phone:[{ required: false, message: "请选择类型", trigger: "change" }],
        address:[{ required: false, message: "请选择类型", trigger: "change" }],
        replacePersonPhone:[{ required: false, message: "请选择类型", trigger: "change" }],
        replacePersonAddress:[{ required: false, message: "请选择类型", trigger: "change" }],
        repayNum:[{ required: false, message: "请选择类型", trigger: "change" }],
        repayTime:[{ required: false, message: "请选择类型", trigger: "change" }],
        planReductNum:[{ required: false, message: "请选择类型", trigger: "change" }],
        reductType:[{ required: false, message: "请选择类型", trigger: "change" }],
        reductFile:[{ required: false, message: "请选择类型", trigger: "change" }],
        reductReason:[{ required: false, message: "请选择类型", trigger: "change" }]
      },
      reduceform: {
        info: ""
      },
      typeFlag: "",
      canalFlag: "",
      validityFlag: "",
      tagFlag: "",
      tagFlag2: "",
      caseFlag: "",
      caseFlag2: "",
      callFlag: "",
      callFlag2: "",
      dialogVisible: false,
      unDayMoneyVisible:false,
      sendLetterVisible:false,
      reductionVisible:false,
      reductionRegisteVisible:false,
      activeName: "first",
      phoneStatusVisible: false,
      dialogReduceVisible:false,
      checkReduceVisible:false,
      returnCaseVisible:false,
      sendMessageVisible:false,
      phoneRecord: false,
      callRecord: true,
      predefineColors: [
        "#a762fb",
        "#ff5454",
        "#fd9400",
        "#14c435",
        "#09b0ee",
        "#2f75ee"
      ],
      totalCaseInfoTData:[
        {
          statistics:'123',
          entrustBank:'中信抢案',
          recentlyRb:'658,7',
          lastRb:'500,0',
          lastRbTime:'2019-03-05',
          entrustAmount:'452,45',
          caseStatus:null,
          nowStatus:'在案'
        },
        {
          statistics:'13',
          entrustBank:'中信抢案',
          recentlyRb:'658,7',
          lastRb:'500,0',
          lastRbTime:'2019-03-05',
          entrustAmount:'452,45',
          caseStatus:'warning',
          nowStatus:'在案'
        },
        {
          statistics:'23',
          entrustBank:'中信抢案',
          recentlyRb:'658,7',
          lastRb:'500,0',
          lastRbTime:'2019-03-05',
          entrustAmount:'452,45',
          caseStatus:'death',
          nowStatus:'在案'
        },
        {
          statistics:'',
          entrustBank:'中信抢案',
          recentlyRb:'658,7',
          lastRb:'500,0',
          lastRbTime:'2019-03-05',
          entrustAmount:'452,45',
          caseStatus:'death',
          nowStatus:'在案'
        },
        {
          statistics:'12',
          entrustBank:'中信抢案',
          recentlyRb:'658,7',
          lastRb:'500,0',
          lastRbTime:'2019-03-05',
          entrustAmount:'452,45',
          caseStatus:'death',
          nowStatus:'在案'
        },
        {
          statistics:'123',
          entrustBank:'中信抢案',
          recentlyRb:'658,7',
          lastRb:'500,0',
          lastRbTime:'2019-03-05',
          entrustAmount:'452,45',
          caseStatus:'death',
          nowStatus:'在案'
        },
        {
          statistics:'13',
          entrustBank:'中信抢案',
          recentlyRb:'658,7',
          lastRb:'500,0',
          lastRbTime:'2019-03-05',
          entrustAmount:'452,45',
          caseStatus:'death',
          nowStatus:'在案'
        },
        {
          statistics:'23',
          entrustBank:'中信抢案',
          recentlyRb:'658,7',
          lastRb:'500,0',
          lastRbTime:'2019-03-05',
          entrustAmount:'452,45',
          caseStatus:'death',
          nowStatus:'在案'
        }
      ],
      workRtCaseData: [
        {
          entrustedBatch: "20190403_01",
          collectionType: "电话催收",
          label: "有钱|有诚",
          recordContent:
            "给持本人185****0025,给持本人185****0025,给持本人185****0025",
          recordTime: "2019-01-25  15:30",
          submitPerson: "李秋平",
          groupLeader: "李秋平",
          minister: "吴君伟",
          deputy: "张奇胜",
          audioSrc:"../libs/audio/song.ogg"
        }
      ],
      recordTableData: [
        {
          collectionType: "电话催收",
          label: "有钱|有诚",
          recordContents:
            "给持本人185****0025,给持本人185****0025,给持本人185****0025",
          recordTime: "2019-01-25  15:30",
          staffSaid: "员工表态",
          submitPerson: "曹操",
          audioSrc:"../libs/audio/song.ogg"
        },
        {
          collectionType: "电话催收",
          label: "有钱|有诚",
          recordContents:
            "给持本人185****025,给持本人185****0025,给持本人185****0025",
          recordTime: "2019-01-25  15:30",
          staffSaid: "员工表态",
          submitPerson: "孙权",
          audioSrc:"../libs/audio/song.ogg"
        },
        {
          collectionType: "电话催收",
          label: "有钱|有诚",
          recordContents:
            "给持本人185****0025,给持本人185****0025,给持本人185****0025",
          recordTime: "2019-01-25  15:30",
          staffSaid: "员工表态",
          submitPerson: "刘备",
          audioSrc:"../libs/audio/song.ogg"
        }
      ],
      attachTableData: [
        {
          provider: "黄舟",
          uploadTime: "2018/12/12 12:00",
          uploadFile: "20190315聊天记录jpg",
          instructions: "短信截图"
        },
        {
          provider: "黄舟",
          uploadTime: "2018/12/12 12:00",
          uploadFile: "20190315聊天记录jpg",
          instructions: "身份证明"
        },
        {
          provider: "黄舟",
          uploadTime: "2018/12/12 12:00",
          uploadFile: "20190315jpg",
          instructions: "身份证明"
        }
      ],
      agentTableData: [
        {
          name: "关羽",
          timeLimit: "2019/03/01-2019/05/30",
          entrust: "6,589.60",
          caseState: "在案"
        },
        {
          name: "张飞",
          timeLimit: "2019/03/01-2019/05/30",
          entrust: "6,589.60",
          caseState: "在案"
        },
        {
          name: "鲁肃",
          timeLimit: "2019/03/01-2019/05/30",
          entrust: "6,589.60",
          caseState: "在案"
        },
        {
          name: "周瑜",
          timeLimit: "2019/03/01-2019/05/30",
          entrust: "6,589.60",
          caseState: "在案"
        }
      ],
      agentTableDataOther: [
        {
          entrustedBatch: "20190403_01",
          name: "大乔",
          timeLimit: "2019/03/01-2019/05/30",
          entrust: "6,589.60",
          caseState: "在案"
        },
        {
          entrustedBatch: "20190403_01",
          name: "张苞",
          timeLimit: "2019/03/01-2019/05/30",
          entrust: "6,589.60",
          caseState: "在案"
        },
        {
          entrustedBatch: "20190403_01",
          name: "关兴",
          timeLimit: "2019/03/01-2019/05/30",
          entrust: "6,589.60",
          caseState: "在案"
        },
        {
          entrustedBatch: "20190403_01",
          name: "黄盖",
          timeLimit: "2019/03/01-2019/05/30",
          entrust: "6,589.60",
          caseState: "在案"
        }
      ],
      tableData: [
        {
          cType: "联系方式",
          name: "曾伟健",
          relationShip: "本人",
          informationNote: "态度恶劣",
          librarian: "185****0025",
          source: "委案",
          lastTime: "2019-01-25  15:30",
          belong: "湖南长沙",
          effective: 1
        },
        {
          cType: "联系方式",
          name: "曾伟健",
          relationShip: "本人",
          informationNote: "态度恶劣",
          librarian: "185****0025",
          source: "委案",
          lastTime: "2019-01-25  15:30",
          belong: "湖南长沙",
          effective: 2
        },
        {
          cType: "联系方式",
          name: "曾伟健",
          relationShip: "本人",
          informationNote: "态度恶劣",
          librarian: "185****0025",
          source: "委案",
          lastTime: "2019-01-25  15:30",
          belong: "湖南长沙",
          effective: 2
        },
        {
          cType: "地址信息",
          name: "410000",
          relationShip: "公司地址",
          informationNote: "",
          librarian: "湖南省长沙市岳麓区湖南永雄资产管理集团",
          source: "委案",
          lastTime: "2019-01-25  15:30",
          belong: "湖南长沙",
          effective: 3
        },
        {
          cType: "地址信息",
          name: "410000",
          relationShip: "公司地址",
          informationNote: "",
          librarian: "湖南省长沙市岳麓区湖南永雄资产管理集团",
          source: "",
          lastTime: "",
          belong: "",
          effective: 3
        }
      ],
      tableDataAdd: [
        {
          cType: "手机号码",
          name: "彭坤",
          relationShip: "本人",
          informationNote: "态度好",
          librarian: "185****0025",
          source: "委案",
          lastTime: "2019-01-25  15:30",
          belong: "湖南长沙",
          effective: 1
        },
        {
          cType: "手机号码",
          name: "彭坤",
          relationShip: "本人",
          informationNote: "态度好",
          librarian: "185****0025",
          source: "委案",
          lastTime: "2019-01-25  15:30",
          belong: "湖南长沙",
          effective: 1
        },
        {
          cType: "手机号码",
          name: "彭坤",
          relationShip: "本人",
          informationNote: "态度好",
          librarian: "185****0025",
          source: "委案",
          lastTime: "2019-01-25  15:30",
          belong: "湖南长沙",
          effective: 1
        }
      ],
      replayTableData: [
        {
          cardholder: "汤宽心",
          bankCard: "84532154656546464",
          replayTime: "2019/03/01",
          replayMoney: "6,521.01",
          actualTime: "2019-03-09",
          actualMoney: "6,521.01",
          agent: "小乔"
        },
        {
          cardholder: "汤宽心",
          bankCard: "84532154656546464",
          replayTime: "2019/03/01",
          replayMoney: "6,521.01",
          actualTime: "2019-03-09",
          actualMoney: "6,521.01",
          agent: "小乔"
        },
        {
          cardholder: "汤宽心",
          bankCard: "84532154656546464",
          replayTime: "2019/03/01",
          replayMoney: "6,521.01",
          actualTime: "2019-03-09",
          actualMoney: "6,521.01",
          agent: "小乔"
        },
        {
          cardholder: "汤宽心",
          bankCard: "84532154656546464",
          replayTime: "2019/03/01",
          replayMoney: "6,521.01",
          actualTime: "2019-03-09",
          actualMoney: "6,521.01",
          agent: "小乔"
        },
        {
          cardholder: "汤宽心",
          bankCard: "84532154656546464",
          replayTime: "2019/03/01",
          replayMoney: "6,521.01",
          actualTime: "2019-03-09",
          actualMoney: "6,521.01",
          agent: "小乔"
        },
        {
          cardholder: "汤宽心",
          bankCard: "84532154656546464",
          replayTime: "2019/03/01",
          replayMoney: "6,521.01",
          actualTime: "2019-03-09",
          actualMoney: "6,521.01",
          agent: "小乔"
        },
        {
          cardholder: "汤宽心",
          bankCard: "84532154656546464",
          replayTime: "2019/03/01",
          replayMoney: "6,521.01",
          actualTime: "2019-03-09",
          actualMoney: "6,521.01",
          agent: "小乔"
        }
      ],
      replayTableDataOther: [
        {
          entrustedBatch: "20190403_01",
          cardholder: "汤宽心",
          bankCard: "84532154656546464",
          replayTime: "2019/03/01",
          replayMoney: "6,521.01",
          actualTime: "2019-03-09",
          actualMoney: "6,521.01",
          agent: "小乔"
        },
        {
          entrustedBatch: "20190403_01",
          cardholder: "汤宽心",
          bankCard: "84532154656546464",
          replayTime: "2019/03/01",
          replayMoney: "6,521.01",
          actualTime: "2019-03-09",
          actualMoney: "6,521.01",
          agent: "小乔"
        },
        {
          entrustedBatch: "20190403_01",
          cardholder: "汤宽心",
          bankCard: "84532154656546464",
          replayTime: "2019/03/01",
          replayMoney: "6,521.01",
          actualTime: "2019-03-09",
          actualMoney: "6,521.01",
          agent: "小乔"
        },
        {
          entrustedBatch: "20190403_01",
          cardholder: "汤宽心",
          bankCard: "84532154656546464",
          replayTime: "2019/03/01",
          replayMoney: "6,521.01",
          actualTime: "2019-03-09",
          actualMoney: "6,521.01",
          agent: "小乔"
        },
        {
          entrustedBatch: "20190403_01",
          cardholder: "汤宽心",
          bankCard: "84532154656546464",
          replayTime: "2019/03/01",
          replayMoney: "6,521.01",
          actualTime: "2019-03-09",
          actualMoney: "6,521.01",
          agent: "小乔"
        },
        {
          entrustedBatch: "20190403_01",
          cardholder: "汤宽心",
          bankCard: "84532154656546464",
          replayTime: "2019/03/01",
          replayMoney: "6,521.01",
          actualTime: "2019-03-09",
          actualMoney: "6,521.01",
          agent: "小乔"
        },
        {
          entrustedBatch: "20190403_01",
          cardholder: "汤宽心",
          bankCard: "84532154656546464",
          replayTime: "2019/03/01",
          replayMoney: "6,521.01",
          actualTime: "2019-03-09",
          actualMoney: "6,521.01",
          agent: "小乔"
        }
      ],
      soundTableDate: [
        {
          callType: "呼入",
          ringup: "156****2020",
          pickup: "173****8852",
          duration: "00:00:45",
          callTime: "2019-03-09 12:00:05",
          handleP: "小乔",
          audioSrc:"../libs/audio/song.ogg"
        },
        {
          callType: "呼出",
          ringup: "173****8852",
          pickup: "156****2020",
          duration: "00:01:20",
          callTime: "2019-03-09 10:22:18",
          handleP: "小乔",
          audioSrc:"../libs/audio/song.ogg"
        },
        {
          callType: "呼出",
          ringup: "173****8852",
          pickup: "156****2020",
          duration: "00:01:20",
          callTime: "2019-03-09 10:22:18",
          handleP: "小乔",
          audioSrc:"../libs/audio/song.ogg"
        }
      ],
      soundTableDateOther: [
        {
          entrustedBatch: "20190403_01",
          ringup: "156****2020",
          pickup: "173****8852",
          duration: "00:00:45",
          callTime: "2019-03-09 12:00:05",
          handleP: "小乔",
          audioSrc:"../libs/audio/song.ogg"
        },
        {
          entrustedBatch: "20190403_01",
          ringup: "173****8852",
          pickup: "156****2020",
          duration: "00:01:20",
          callTime: "2019-03-09 10:22:18",
          handleP: "小乔",
          audioSrc:"../libs/audio/song.ogg"
        },
        {
          entrustedBatch: "20190403_01",
          ringup: "173****8852",
          pickup: "156****2020",
          duration: "00:01:20",
          callTime: "2019-03-09 10:22:18",
          handleP: "小乔",
          audioSrc:"../libs/audio/song.ogg"
        }
      ],
      smsTableDate: [
        {
          receiveNumber: "156****2020",
          msmContent:
            "陈先生，您承诺清偿平安银行信用卡欠款仍未处理，已涉嫌恶意拖欠，我行将于近期向公安机关报案，详询...",
          submitter: "康新伟",
          submitTime: "2019-03-09 11:15:00",
          auditState: "审核通过",
          auditor: "余详"
        },
        {
          receiveNumber: "156****2020",
          msmContent:
            "陈先生，您承诺清偿平安银行信用卡欠款仍未处理，已涉嫌恶意拖欠，我行将于近期向公安机关报案，详询...",
          submitter: "康新伟",
          submitTime: "2019-03-09 11:15:00",
          auditState: "审核通过",
          auditor: "余详"
        }
      ],
      smsTableDateOther: [
        {
          entrustedBatch: "20190403_01",
          receiveNumber: "156****2020",
          msmContent:
            "陈先生，您承诺清偿平安银行信用卡欠款仍未处理，已涉嫌恶意拖欠，我行将于近期向公安机关报案，详询...",
          submitter: "康新伟",
          submitTime: "2019-03-09 11:15:00",
          auditState: "审核通过",
          auditor: "余详"
        },
        {
          entrustedBatch: "20190403_01",
          receiveNumber: "156****2020",
          msmContent:
            "陈先生，您承诺清偿平安银行信用卡欠款仍未处理，已涉嫌恶意拖欠，我行将于近期向公安机关报案，详询...",
          submitter: "康新伟",
          submitTime: "2019-03-09 11:15:00",
          auditState: "审核通过",
          auditor: "余详"
        }
      ],
      reductTableDate: [
        {
          applyTime: "2019-03-09",
          reduceNum: "1,000.00",
          repayTime: "2019-03-09",
          repayNum: "999.08",
          reduceReason:
            "陈先生，您承诺清偿平安银行信用卡欠款仍未处理，已涉嫌恶意拖欠，我行将于近期向公安机关报案，详询...",
          auditState: "审核通过",
          applyer: "八戒",
          agent: "沙森"
        },
        {
          applyTime: "2019-03-09",
          reduceNum: "1,000.00",
          repayTime: "2019-03-09",
          repayNum: "999.08",
          reduceReason:
            "陈先生，您承诺清偿平安银行信用卡欠款仍未处理，已涉嫌恶意拖欠，我行将于近期向公安机关报案，详询...",
          auditState: "审核通过",
          applyer: "泰森",
          agent: "阿玛尼"
        }
      ],
      reductTableDateOther: [
        {
          entrustedBatch: "20190403_01",
          applyTime: "2019-03-09",
          reduceNum: "1,000.00",
          repayTime: "2019-03-09",
          repayNum: "999.08",
          reduceReason:
            "陈先生，您承诺清偿平安银行信用卡欠款仍未处理，已涉嫌恶意拖欠，我行将于近期向公安机关报案，详询...",
          auditState: "审核通过",
          applyer: "上帝",
          agent: "巫婆"
        },
        {
          entrustedBatch: "20190403_01",
          applyTime: "2019-03-09",
          reduceNum: "1,000.00",
          repayTime: "2019-03-09",
          repayNum: "999.08",
          reduceReason:
            "陈先生，您承诺清偿平安银行信用卡欠款仍未处理，已涉嫌恶意拖欠，我行将于近期向公安机关报案，详询...",
          auditState: "审核通过",
          applyer: "李逵",
          agent: "厉鬼"
        }
      ],
      complainTableData: [
        {
          cptp: "康新伟",
          cptTime: "2019-03-09 11:15:00",
          cptContent: "言语暴力，说不还款就死全家",
          cptDecide: "判定成立"
        },
        {
          cptp: "康新伟",
          cptTime: "2019-03-09 11:15:00",
          cptContent: "冒充警务人员，恐吓持卡人及家属",
          cptDecide: "待判定"
        }
      ],
      complainTableDataOther: [
        {
          entrustedBatch: "20190403_01",
          cptp: "康新伟",
          cptTime: "2019-03-09 11:15:00",
          cptContent: "言语暴力，说不还款就死全家",
          cptDecide: "判定成立"
        },
        {
          entrustedBatch: "20190403_01",
          cptp: "康新伟",
          cptTime: "2019-03-09 11:15:00",
          cptContent: "冒充警务人员，恐吓持卡人及家属",
          cptDecide: "待判定"
        }
      ],
      rFcollection:[
        {
          value: "phone",
          label: "电话催收"
        },
        {
          value: "person",
          label: "人工催收"
        }
      ],
      rFcresults:[
        {
            value: "effective",
            label: "有效调查类"
          },
          {
            value: "commitment",
            label: "承诺还款类"
          },
          {
            value: "actual",
            label: "实际还款类"
          }
      ],
      rcaseMarkers:[
        {
          value:1,
          label: "投诉预警"
        },
        {
          value:2,
          label: "死单"
        }
      ],
      raddphoneType:[
        {
            value: "addphone",
            label: "联系方式"
          },
          {
            value: "addaddress",
            label: "地址信息"
          },
      ],
      ruleForm: {
        declare: "",
        phoneNumber: "",
        cmMoney: null,
        rmTime: "",
        collectionValue: "",
        cresultsValue: "",
        ships: "",
        answering: "",
        answeringFeedBack: "",
        caseMarkers: "",
        desc: "",
        credentials: ""
      },
      addPhoneformRule: {
        type: [{ required: true, message: "请选择类型", trigger: "change" }],
        info: [{ required: true, message: "请填写号码", trigger: "blur" }],
        name: [{ required: true, message: "请填写名称", trigger: "blur" }],
        rel: [{ required: true, message: "请选择关系", trigger: "change" }],
        effective: [{ required: true, message: "请选择有效性", trigger: "change" }],
        addressType:[{ required: true, message: "请选择地址类", trigger: "change" }],
        zipaddress:[{ required: true, message: "请填写地址", trigger: "blur" }]
      },
      rules: {
        collectionValue: [
          { required: true, message: "请选择催收类型", trigger: "change" }
        ],
        cresultsValue: [
          { required: true, message: "请选择催收结果", trigger: "change" }
        ],
        cmMoney: [
          {
            required: true,
            type: "number",
            message: "请输入承诺还款金额",
            trigger: "blur"
          }
        ],
        rmTime: [
          { required: true, message: "请输入还款日期", trigger: "blur" }
        ],
        phoneNumber: [
          {
            type: "number",
            required: true,
            message: "请输入电话号码",
            trigger: "blur"
          }
        ],
        ships: [{ required: true, message: "请选择关系", trigger: "change" }],
        answering: [
          { required: true, message: "请选择接听状态", trigger: "change" }
        ],
        answeringFeedBack: [
          { required: true, message: "请选择接听反馈", trigger: "change" }
        ],
        credentials: [
          { required: true, message: "请选择接听反馈", trigger: "change" }
        ],
        desc: [{ required: true, message: "请填写综合描述", trigger: "blur" }],
        declare: [
          { required: true, message: "请填写申报业绩", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    haveMoney(){
      this.haveMoneyNum++
      this.clickHaveMoney = true
      if(this.clickHaveNoNum){
        this.haveNoNum--
      }
    },
    haveNoMoney(){
      this.haveNoNum++
      this.clickHaveNoNum = true
      if(this.clickHaveMoney){
        this.haveMoneyNum--
      }
    },
    getId() {
      console.log(this.$route.params.id); //获取一级页面的id以用于后面的请求参数
    },
    handleClick(tab, event) {
      // console.log(tab);
    },
    phoneStatusShow() {
      this.phoneStatusVisible = true;
      console.log("执行弹窗");
    },
    phoneStatusHide() {
      this.phoneStatusVisible = false;
    },
    // callRecord(e){
    //     console.log(e);
    // },
    submitForm(formName) { //新增联系方式 保存按钮
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    submitWorkForm(formName){ //提交工作记录 提交记录按钮
      let _this = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(_this.ruleForm);
        } else {
          this.$message({
            showClose:true,
            type:'success',
            message:'提交失败，验证不通过'
          })
          return false
        }
      })
    },
    submitReduceForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    renderHeader(h, { column }) {
      return h(TableSelect);
    },
    viewDetail(index,status){ //页面跳转逻辑得整理下
        let routerDetails = this.$router.resolve({
          path: `/home/index/${index+1}?status=${status}`
        })
        window.open(routerDetails.href,'_blank') //新开路由
        // this.$router.push(`/home/index/${row.id}`) //使用模板字符串
    },
    loadAll() {
      return [
        { value: "桃子", position: "组长" },
        { value: "小李子", position: "部长" },
        { value: "林心", position: "职员" }
      ];
    },
    queryAgentSearch(queryString, cb) {
      let agentRestaurants = this.agentRestaurants;
      let results = queryString
        ? agentRestaurants.filter(this.createFilter(queryString))
        : agentRestaurants;
      //调用callback返回建议列表的数据
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 1000 * Math.random());
    },
    createFilter(queryString) {
      return agentRestaurants => {
        console.log("agentRestaurants", agentRestaurants);
        return (
          agentRestaurants.value
            .toLowerCase()
            .indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    handleAgentSelect(item) {
      console.log(item);
    },
    cresultChange(val) {},
    toTop() {
      this.toTopFlag = !this.toTopFlag;
      let header = document.getElementById("home-header").style.display;
      document.getElementById("home-header").style.display =
        header == "none" ? "block" : "none";
      if (!this.toTopFlag) {
        //显示头顶
        $(".page-content").height(window.innerHeight - 80);
        this.tableData.splice(5, 3);
      } else {
        //隐藏头顶
        $(".page-content").height(window.innerHeight - 30);
        this.tableData = [...this.tableData, ...this.tableDataAdd];
      }
    }
  },
  mounted() {
    this.getId();
    this.agentRestaurants = this.loadAll(); //经办人列表
  },
  created(){
    this.caseTypeStatus = this.$route.query.status //设置案件状态
  }
};
</script>
<style>
.wallfall .el-card__header,
.box-card2 .el-card__header {
  background: #e7e7e7;
}
</style>

<style scoped>
.mar-top{margin-top:15px}
.marginT10{
  margin-top:10px;
}
/* 筛选头部 */
.selectRow {
  background-color: #fff;
}
.selectCon {
  padding: 10px 0;
}
.todayRecord {
  margin-right: 20px;
}
.btnl {
  margin-left: 20px !important;
}
.iconMsg {
  margin-left: 5px;
  cursor: pointer;
}
.iconImg {
  margin-left: 20px;
  cursor: pointer;
}
/* 案件信息 */
.caseInfo {
  position: relative;
  background-color: #fff;
  margin-top: 15px;
  padding: 10px 20px;
}
.statusImg {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 100px;
  height: 100px;
  opacity: 0.5;
}
.caseInfo1 {
  width: 230px;
  height: 100px;
  line-height: 100px;
  float: left;
  border-right: 1px solid #ddd;
}

.caseInfo2 {
  width: 456px;
  height: 100px;
  line-height: 100px;
  float: left;
  margin-left: 20px;
  border-right: 1px solid #ddd;
}

.caseInfo3 {
  height: 100px;
  line-height: 100px;
  float: left;
  margin-left: 20px;
}

.cui_icons2 {
  background: url("../images/cui_icons2.png");
  vertical-align: text-bottom;
  display: inline-block;
  cursor: pointer;
}
.manIcon {
  width: 24px;
  height: 24px;
  background-position: -4px -3px;
}
.keyInfo {
  color: #222;
  font-size: 18px;
}
.IDIcon {
  width: 20px;
  height: 15px;
  background-position: -36px -3px;
}
.homeIcon {
  width: 18px;
  height: 18px;
  background-position: -65px -2px;
}
.marspace {
  margin-left: 20px;
}
.valspace {
  display: inline-block;
  width: 70px;
}
/* 联系资料tabs切换 */
.tabsWrap {
  position: relative;
  background-color: #fff;
  margin-top: 15px;
}
.caseTable,
.replayTable,
.agentTable,
.attachTable,
.recordTable,
.baseTable,
.caseDetail,
.workRtCase {
  margin-top: 15px;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.wallfall {
  column-count: 2;
  column-gap: 15px;
}

.box-card1 {
  margin-bottom: 18px;
  break-inside: avoid;
}

.box-card2 {
  width: 100%;
  margin-bottom: 18px;
}

.card_label {
  width: 75px;
  color: #666;
}

.callicon {
  display: inline-block;
  width: 15px;
  height: 15px;
  background: url(../images/call.png);
  background-size: cover;
  transform: scale(0.9);
}

.addressicon {
  display: inline-block;
  width: 12px;
  height: 16px;
  background: url(../images/ding.png);
}
/* 工作记录 */
.workRecord {
  background-color: #fff;
  margin-top: 15px;
  padding: 5px 15px;
}
.workRecord h5 {
  font-weight: bolder;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  margin-bottom: 16px;
}
.formItemInline {
  margin-top: 6px;
}
.mgl10 {
  margin-left: 10px;
}
.colorTheme {
  color: #2e76ee;
}
.color99a0b1 {
  color: #99a0b1;
}
.wth16 {
  width: 16px;
  height: 16px;
}
/* 案件操作 */
.pReset{
  padding-left:10px;
  height: 30px;
  line-height: 30px;
  font-weight:bold;
}
.height26{
  height: 26px;
  line-height: 26px;
}
.template-box{
  height: 480px;
  overflow-y: scroll;
  border-left:1px solid #c1c7d0;
  border-top:1px solid #c1c7d0;
}
.template-item{
  padding:0 10px 20px;
  border-bottom:1px solid #c1c7d0;
  border-right:1px solid #c1c7d0;
  cursor:pointer;
}
.template-item p{
  font-weight:bold;
  color:#111;
  padding:10px 0;
  margin:0;
}
.template-item >div{
  color:#666;
}
.activeBgcolor{/*专门用来定义背景颜色*/
  background-color:#e5e9f3;
}
.expDcontent{
  background:url(../images/wIcon.png) center 0 no-repeat;
}
/* 拨号弹框 */
.phone-modal {
  background: rgba(0, 0, 0, 0.8);
  border-radius: 5px;
  position: fixed;
  top: 100px;
  left: 30%;
  padding: 20px;
  color: #fff;
  z-index: 10;
}
.closeBtn {
  position: absolute;
  top: -13px;
  right: -12px;
  width: 30px;
  height: 30px;
  background: #ddd;
  border-radius: 50%;
  border: none;
  outline: none;
  cursor: pointer;
  border: 1px solid #333;
}
.closeBtn:hover {
  border-color: #38a0f4;
}
.closeBtn:hover i {
  color: #38a0f4;
}
.closeBtn i {
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
  color: #333;
  position: relative;
  display: block;
}
.closeBtn i:after {
  height: 1.3em;
  width: 2px;
}
.closeBtn i:before {
  width: 1.3em;
  height: 2px;
}
.closeBtn i:after,
.closeBtn i:before {
  content: "";
  box-shadow: inset 0 0 0 1px;
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
.phone-modal table td {
  padding: 4px 0;
}
.phone-modal select {
  color: #333;
}
.tellTimes {
  font-weight: bold;
  font-size: 20px;
  line-height: 25px;
  vertical-align: top;
}
.recordBtn {
  padding: 1px 4px;
  border-radius: 2px;
  margin-left: 25px;
  vertical-align: top;
}
.phone-modal .btn-success {
  background: #23b606;
  border-radius: 2px;
  border-color: #23b606;
  width: 115px;
}
.phoneIco,
.messageIco {
  background: #38a0f4;
  width: 30px;
  height: 28px;
  padding: 0px 1px;
  margin-left: 5px;
}
.phoneIco i,
.messageIco i {
  background: url(../images/phoneStatus.png) no-repeat;
  width: 30px;
  height: 28px;
  display: block;
}
.phoneIco i {
  background-position: 3px 4px;
}
.messageIco i {
  background-position: 3px -24px;
}
/* 拨号弹框的通话记录 */
.recordNav {
  padding-left: 0;
}
ol,
ul,
li {
  list-style: none;
}
.recordNav li {
  float: left;
}
.recordNav li {
  margin-right: 50px;
}
.recordNav li a {
  display: block;
  font-size: 16px;
  color: #fff;
  border-bottom: 2px solid transparent;
  line-height: 26px;
}
.recordNav li.active a {
  color: #40ca16;
  border-bottom-color: #40ca16;
}
a:hover,
a:focus {
  text-decoration: none;
  outline: 0 !important;
}
.sound-modal .soundTab td {
  padding: 4px 8px;
  color: #0099f7;
}
.toTop {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  z-index: 99;
}
.mgt15 {
  margin-top: 15px;
}
.mgt0 {
  margin-top: 0;
}

.selectCon .el-button {
  position: relative;
  padding: 9px 12px;
}

.cd_badge {
  border-radius: 50%;
  background-color: red;
  color: #fff;
  padding: 0 4px;
  position: absolute;
  line-height: 18px;
  top: -3px;
  right: 0;
}

.cd_text_overflow {
  max-width: calc(100% - 103px);
  overflow: hidden;
  display: inline-block;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: middle;
  cursor: pointer;
}

.item {
  margin: 4px;
}

.bottom {
  clear: both;
  text-align: center;
}

.workRecord .el-radio {
  line-height: 24px;
}

.selfCont {
  background-color: #ffe8c7;
  max-width: 100%;
  padding: 10px 15px;
  border-radius: 10px;
  color: #181818;
  margin-bottom: 25px;
}
.currentCont {
  background-color: #ffe8c7;
  max-width: 100%;
  padding: 10px 15px;
  border-radius: 10px;
  color: #ed5502;
  margin-bottom: 25px;
  border: 1px solid #ff4a26;
}
.back_Info_right {
  font-size: 16px;
  width: 100%;
  text-align: right;
}
.back_Info_left {
  font-size: 16px;
  width: 100%;
  text-align: left;
}
.oppCont {
  background-color: #b6d1ff;
  max-width: 100%;
  padding: 10px 15px;
  border-radius: 10px;
  color: #181818;
}
/*基本案情--本案资料*/
.caseDetail{background:#ecf5ff;padding:15px 15px 15px 30px}
.caseDetail table td{padding: 4px 0px;}
</style>


