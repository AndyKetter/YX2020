<template>
    <div class="page-content">
        <div class="indexWrap row">
            <div class="searchWrap clearfix" :class="openFlag == false?'open':'shrink'">
                <div class="s_types inpt_wrap pull-left">
                    <span class="pull-left">持卡人：</span>
                    <el-input class="pull-left" placeholder="请输入" v-model="cardHolder" clearable style="width:100px"></el-input>
                </div>
                <div class="s_types inpt_wrap pull-left">
                    <span class="pull-left">身份证号：</span>
                    <el-input class="pull-left" placeholder="请输入" v-model="idCard" clearable></el-input>
                </div>
                <div class="s_types inpt_wrap pull-left">
                    <span class="pull-left">委托日期：</span>
                    <el-date-picker v-model="entrustDate" type="date" placeholder="选择日期" style="width:130px"></el-date-picker>
                </div>
                <div class="s_types inpt_wrap pull-left hidediv">
                    <span class="pull-left">经办人备注：</span>
                    <el-input class="pull-left" placeholder="请输入" v-model="remark" clearable></el-input>
                </div>
                <div class="pull-right hidebtn">
                    <el-button class="moreSearch" @click="dialogOpen = true">更多查询</el-button>
                </div>
                    <el-button class="JS_search" type="primary" icon="el-icon-search">搜索</el-button>
            </div>
            <div class="tableWrap">
                <div class="filterWrap" :class="openFlag == false?'mgt10':'mgt1'">
                    <span @click="checkType('all')" :class="{caseTypeActive:isTypeActive=='all'}">全部</span>
                    <span @click="checkType('today')" :class="{caseTypeActive:isTypeActive=='today'}">今日回款</span>
                    <span @click="checkType('threeNo')" :class="{caseTypeActive:isTypeActive=='threeNo'}">3天未跟进</span>
                    <span @click="checkType('sevenNo')" :class="{caseTypeActive:isTypeActive=='sevenNo'}">7天未跟进</span>
                    <span @click="checkType('threeExpire')" :class="{caseTypeActive:isTypeActive=='threeExpire'}">3天内到期</span>
                    <span @click="checkType('complaint')" :class="{caseTypeActive:isTypeActive=='complaint'}">投诉预警</span>
                    <span @click="checkType('death')" :class="{caseTypeActive:isTypeActive=='death'}">死单类</span>
                    <el-tooltip class="patch" placement="bottom"><div slot="content"><i class="el-icon-question"></i>&nbsp;列表全屏显示</div><img v-if="openFlag == false" class="openBtn" @click="openOrshrink" src="../images/openIcon.png" alt="">
                    <img v-else class="openBtn" @click="openOrshrink" src="../images/shrinkage.png" alt=""></el-tooltip>
                </div>
                <div class="filterOther">
                   <el-tooltip class="patch" placement="bottom"><div slot="content"><i class="el-icon-question"></i>&nbsp;可根据自己的需求对案件进行标色分类（批量标色）</div> 
                        <el-button size="mini" type="danger" plain class="colorBtn" >案件标色
                            <el-color-picker class="allSetColors" @change="pickerAllChange" v-model="allSetColors" size="mini" :predefine="predefineColors"></el-color-picker>
                        </el-button>
                   </el-tooltip>            
                    <el-checkbox class="tCaseBox" v-model="checkCase" @change="tCaseChange"></el-checkbox>
                    <el-tooltip class="patch" placement="bottom"><div slot="content"><i class="el-icon-question"></i>&nbsp;共案筛选</div>
                        <span class="tCase">共案</span>
                    </el-tooltip> 
                    <el-popover class="patch" placement="bottom" trigger="hover">
                        <div><img src="../images/checkCase.gif" alt="操作演示"></div>
                        <el-button class="patch_operate" size="mini" slot="reference" type="primary" plain>操作演示</el-button>
                    </el-popover> 
                    <div  class="pull-right">
                        <el-button size="mini" @click="bankMessageVisible=true">到期还款提醒</el-button>
                        <el-button size="mini"  @click="mauredPayVisible=true" >银行讯息</el-button>
                        <el-popover class="patch" placement="bottom"  trigger="click" style="margin-left:10px">
                            <div><img src="../images/addlist_patch.gif" alt="操作演示"></div>
                            <el-button size="mini" slot="reference"><i class="el-icon-plus"></i>&nbsp;列表项</el-button>
                        <!-- <el-button size="mini" plain @click="dialogVisible=true"><i class="el-icon-plus"></i>&nbsp;列表项</el-button> -->
                        </el-popover>
                    </div>

                </div>
                <div class="table_wrap">
                    <!-- <el-table :data="tableData" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}" tooltip-effect="dark" @selection-change="handleSelectionChange" :max-height="maxHeightValue"> -->
                    <el-table :data="tableData" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}" tooltip-effect="dark" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column width="88">
                            <template slot="header">
                                <el-dropdown class="myDrop" @command="handleCommand">
                                    <span class="el-dropdown-link">
                                        标记<i class="el-icon-arrow-down el-icon--right"></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item command="all">显示全部</el-dropdown-item>
                                        <el-dropdown-item command="#A762FB"><span>仅显示</span><i class="dropI colorA"></i></el-dropdown-item>
                                        <el-dropdown-item command="#FF5454"><span>仅显示</span><i class="dropI colorB"></i></el-dropdown-item>
                                        <el-dropdown-item command="#FD9400"><span>仅显示</span><i class="dropI colorC"></i></el-dropdown-item>
                                        <el-dropdown-item command="#14C435"><span>仅显示</span><i class="dropI colorD"></i></el-dropdown-item>
                                        <el-dropdown-item command="#09B0EE"><span>仅显示</span><i class="dropI colorE"></i></el-dropdown-item>
                                        <el-dropdown-item command="#2F75EE"><span>仅显示</span><i class="dropI colorF"></i></el-dropdown-item>
                                        <el-dropdown-item command="null"><span>仅显示</span><i class="dropI colorG"></i></el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                            <template slot-scope="scope">
                                <el-tooltip class="patch" placement="bottom"><div slot="content"><i class="el-icon-question"></i>&nbsp;可根据自己的需求对案件进行标色分类（单个标色）</div>
                                <!-- <span :class="scope.row.tag" class="sign_common"></span> -->
                                <el-color-picker v-model="scope.row.tag" size="mini" :predefine="predefineColors"></el-color-picker>
                                </el-tooltip> 
                            </template>
                        </el-table-column>
                        <el-table-column prop="sign" label="标签" min-width="130" :show-overflow-tooltip="true">
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
                        <el-table-column prop="cardHolder" label="持卡人"  width="100"></el-table-column>
                        <el-table-column prop="statistics" label="相关统计" width="130">
                            <template slot-scope="scope">
                                 <span class="fontiocn cheng" v-if="scope.row.statistics.match('1')" title="案件有承诺还款">承</span>
                                 <span class="fontiocn bu" v-if="scope.row.statistics.match('2')" title="案件有部分还款">部</span>
                                 <span class="fontiocn lian" v-if="scope.row.statistics.match('3')" title="案件有有效可联系人">联</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="gender" width="100">
                            <template slot="header">
                                <select class="form-control" v-model="sexFlag">
                                    <option value disabled selected style="display:none">性别</option>
                                    <option value="all">全部</option>
                                    <option value="1">男</option>
                                    <option value="2">女</option>
                                </select>
                            </template>
                        </el-table-column>
                        <el-table-column label="身份证号" width="180">
                            <template slot-scope="scope">
                                <span>
                                    {{scope.row.idNumber}}
                                </span>
                                <span @click="checkCaseFlag = true" v-if="scope.row.gong">
                                    <el-badge class="gongbadge" :value="scope.row.gong"/>   
                                </span>                           
                            </template>
                        </el-table-column>
                        <el-table-column prop="bankSlip" label="银行卡号"></el-table-column>
                        <el-table-column prop="account" label="账号" width="130"></el-table-column>
                        <el-table-column prop="newBalance" label="最新余额" width="130"></el-table-column>
                        <el-table-column prop="entrustDate" label="委托日期" width="100"></el-table-column>
                        <el-table-column prop="backDate" label="退案日期" width="100"></el-table-column>
                        <el-table-column prop="currentBill" label="本期账单" width="130"></el-table-column>
                        <el-table-column label="操作" width="100" fixed="right">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click.native.prevent="viewDetail(scope.$index,scope.row.caseStatus)">
                                    查看
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div id="pagination">
                        <el-pagination 
                        @size-change="handleSizeChange"
                        @current-change="handlecurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[5,10,20]"
                        :page-size="5"
                        layout="total,sizes,prev,pager,next,jumper"
                        :total="100"
                        >
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
        <!-- 银行讯息弹框 -->
        <el-dialog title="银行讯息" :close-on-click-modal="false" :visible.sync="mauredPayVisible" width="750px">
            <p class="pReset1">基本情况</p>
            <el-table key="mauredPayData" :data="mauredPayData" border :header-cell-style="{backgroundColor:'#e5e9f3'}" style="width:100%">
              <el-table-column prop="content" header-align="center" label="讯息内容" min-width="250"></el-table-column>
              <el-table-column prop="inportTime" align="center" label="导入时间" min-width="90"></el-table-column>
              <el-table-column prop="times" align="center" label="提醒次数" min-width="50"></el-table-column>
              <el-table-column prop="operation" align="center" label="操作" min-width="30">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click.native.prevent="viewDetail(scope.$index,scope.row.caseStatus)">处理</el-button>
                </template>
              </el-table-column>
            </el-table>
        </el-dialog>

        <!-- 到期还款提醒弹框 -->
        <el-dialog title="到期还款提醒" :close-on-click-modal="false" :visible.sync="bankMessageVisible" width="750px">
            <p class="pReset2">承诺还款总金额：<span>3,600.00</span>  承诺还款数量：<span>4</span></p>
            <el-table key="bankMessageData" :data="bankMessageData" border :header-cell-style="{backgroundColor:'#e5e9f3'}" style="width:100%">
              <el-table-column prop="order" align="center" label="序号" min-width="50"></el-table-column>
              <el-table-column prop="cardHolder" align="center" label="持卡人" min-width="80"></el-table-column>
              <el-table-column prop="agreementNum" align="center" label="卡号/合同号" min-width="100"></el-table-column>
              <el-table-column prop="promiseMoney" align="center" label="承诺还款金额" min-width="90"></el-table-column>
              <el-table-column prop="promiseTime" align="center" label="承诺还款时间" min-width="90"></el-table-column>
              <el-table-column prop="agent" align="center" label="经办人" min-width="90"></el-table-column>
              <el-table-column prop="operation" align="center" label="操作" min-width="50">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click.native.prevent="viewDetail(scope.$index,scope.row.caseStatus)">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
        </el-dialog>
        <!-- 列表项配置弹框 -->
        <el-dialog title="列表项配置" :close-on-click-modal="false" :visible.sync="dialogVisible" width="750px">
            <el-row :gutter="10">
                <el-col :span="18">
                    <el-row :gutter="10">
                        <el-checkbox-group v-model="checkboxGroup">
                            <el-col :span="6">
                                <el-checkbox class="tbCheckBox" label="1" border>经办人</el-checkbox>
                            </el-col>
                            <el-col :span="6">
                                <el-checkbox class="tbCheckBox" label="2" border>持卡人</el-checkbox>
                            </el-col>
                            <el-col :span="6">
                                <el-checkbox class="tbCheckBox" label="3" border>相关统计</el-checkbox>
                            </el-col>
                            <el-col :span="6">
                                <el-checkbox class="tbCheckBox" label="4" border>性别</el-checkbox>
                            </el-col>
                            <el-col :span="6">
                                <el-checkbox class="tbCheckBox" label="5" border>身份证号</el-checkbox>
                            </el-col>
                            <el-col :span="6">
                                <el-checkbox class="tbCheckBox" label="6" border>委托日期</el-checkbox>
                            </el-col>
                            <el-col :span="6">
                                <el-checkbox class="tbCheckBox" label="7" border>退案日期</el-checkbox>
                            </el-col>
                            <el-col :span="6">
                                <el-checkbox class="tbCheckBox" label="8" border>案件状态</el-checkbox>
                            </el-col>
                            <el-col :span="6">
                                <el-checkbox class="tbCheckBox" label="9" border>最新余额</el-checkbox>
                            </el-col>
                            <el-col :span="6">
                                <el-checkbox class="tbCheckBox" label="10" border>本期账单全额</el-checkbox>
                            </el-col>
                            <el-col :span="6">
                                <el-checkbox class="tbCheckBox" label="11" border>还款日</el-checkbox>
                            </el-col>
                            <el-col :span="6">
                                <el-checkbox class="tbCheckBox" label="12" border>还款账号</el-checkbox>
                            </el-col>
                            <el-col :span="6">
                                <el-checkbox class="tbCheckBox" label="13" border>持卡人评分</el-checkbox>
                            </el-col>
                            <el-col :span="6">
                                <el-checkbox class="tbCheckBox" label="14" border>逾期阶段</el-checkbox>
                            </el-col>
                            <el-col :span="6">
                                <el-checkbox class="tbCheckBox" label="15" border>当前逾期天数</el-checkbox>
                            </el-col>
                            <el-col :span="6">
                                <el-checkbox class="tbCheckBox" label="16" border>授信额度</el-checkbox>
                            </el-col>
                            <el-col :span="6">
                                <el-checkbox class="tbCheckBox" label="17" border>放款模式</el-checkbox>
                            </el-col>
                            <el-col :span="6">
                                <el-checkbox class="tbCheckBox" label="18" border>风险等级</el-checkbox>
                            </el-col>
                            <el-col :span="6">
                                <el-checkbox class="tbCheckBox" label="19" border>账单日</el-checkbox>
                            </el-col>
                            <el-col :span="6">
                                <el-checkbox class="tbCheckBox" label="20" border>账户号</el-checkbox>
                            </el-col>
                            <el-col :span="6">
                                <el-checkbox class="tbCheckBox" label="21" border>经办人备注</el-checkbox>
                            </el-col>
                            <el-col :span="6">
                                <el-checkbox class="tbCheckBox" label="22" border>申请号</el-checkbox>
                            </el-col>
                            <el-col :span="6">
                                <el-checkbox class="tbCheckBox" label="23" border>贷款日期</el-checkbox>
                            </el-col>
                            <el-col :span="6">
                                <el-checkbox class="tbCheckBox" label="24" border>银行卡号</el-checkbox>
                            </el-col>
                            <el-col :span="6">
                                <el-checkbox class="tbCheckBox" label="25" border>跟进类型</el-checkbox>
                            </el-col>
                            <el-col :span="6">
                                <el-checkbox class="tbCheckBox" label="26" border>理赔日期</el-checkbox>
                            </el-col>
                        </el-checkbox-group>
                    </el-row>
                </el-col>
                <el-col :span="6">
                    <div class="dragWrap">
                        <div class="dragHeader">拖动排序</div>
                        <div class="dragList" >
                            <div class="drag-item" v-for="dragList in dragLists" v-dragging="{item:dragList,list:dragLists,group:'dragList'}" :key="dragList.text">
                                {{dragList.text}}
                            </div>
                        </div>
                        </div>
                        
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确定</el-button>
            </span>
        </el-dialog>
        <!-- 更多查询弹框 -->
        <el-dialog title="更多查询" :close-on-click-modal="false" :visible.sync="dialogOpen" width="500px">
                <span>经办人备注：</span>
                <el-input  placeholder="请输入" v-model="remark" clearable style="width:300px;display:inline-block"></el-input>
        
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogOpen = false">取消</el-button>
                <el-button type="primary" @click="dialogOpen = false">搜索</el-button>
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
    </div>
</template>

<script>
//导出Home组件
import Vue from 'vue'
import VueDND from 'awe-dnd'
Vue.use(VueDND)
import myMixin from '../libs/js/mixin.js' //导入mixin修复page-content全屏功能

export default {
    name:'Index',
    mixins:[myMixin],
    data () {
        return {
            dragLists:[
                {text:'经办人'},
                {text:'持卡人'},
                {text:'相关统计'},
                {text:'性别'},
                {text:'身份证号'},
                {text:'委托日期'},
                {text:'退案日期'},
                {text:'案件状态'},
                {text:'最新余额'},
                {text:'本期账单全额'},
                {text:'当前逾期天数'},
                {text:'授信额度'}
            ],
            checkboxGroup:[],
            // maxHeightValue:650,
            openFlag:false,
            allSetColors:null,
            predefineColors:[
                '#a762fb',
                '#ff5454',
                '#fd9400',
                '#14c435',
                '#09b0ee',
                '#2f75ee'
            ],
            cardHolder:'',
            idCard:'',
            entrustDate:'',
            remark:'',
            checkCase:'',
            currentPage:1,
            dialogVisible:false,  
            bankMessageVisible:false,
            mauredPayVisible:false,
            dialogOpen:false,
            checkCaseFlag:false,
            isTypeActive:'all',
            multipleSelection:[],
            tagFlag:'',
            sexFlag:'',
            mauredPayData: [
                {
                content: "未理赔客户，不能协商减免，不能还款对公，且不能承诺结清其名下所有I贷欠款，理赔后会更新其",
                inportTime: "2019-05-28 10:51:54",
                times: "6"
                },
                {
                content: "加急！客户来电称自己是联系人，4008催收电话打过来称贷款人欠钱了被告知自己是联系人，贷款人姓名：洪作标，客户称今天频繁拨打电话，被告知有自己身份证正单面复印件，客户非常不满，强烈要求反馈不要再接到催收电话，在线安抚客户不接受，烦请尽快核实处理，谢谢！回电号码：057765580456",
                inportTime: "2019-05-28 10:51:54",
                times: "6"
                },
                {
                content: "未理赔客户，不能协商减免，不能还款对公，且不能承诺结清其名下所有I贷欠款，理赔后会更新其",
                inportTime: "2019-05-28 10:51:54",
                times: "6"
                }],
                bankMessageData: [
                {
                    order:"1",
                    cardHolder:"权志龙",
                    agreementNum:"100198100112",
                    promiseMoney:"1,200.00",
                    promiseTime:"2019-05-01",
                    agent:"谭曼"
                },
                {
                    order:"2",
                    cardHolder:"权志龙",
                    agreementNum:"100198100112",
                    promiseMoney:"1,200.00",
                    promiseTime:"2019-05-01",
                    agent:"谭曼"
                },
                {
                    order:"3",
                    cardHolder:"权志龙",
                    agreementNum:"100198100112",
                    promiseMoney:"1,200.00",
                    promiseTime:"2019-05-01",
                    agent:"谭曼"
                }],
            totalCaseInfoTData:[
                {
                statistics:'123',
                entrustBank:'中信抢案',
                recentlyRb:'658,7',
                lastRb:'500,0',
                lastRbTime:'2019-03-05',
                entrustAmount:'452,45',
                nowStatus:'在案',
                caseStatus:null
                },
                {
                statistics:'13',
                entrustBank:'中信抢案',
                recentlyRb:'658,7',
                lastRb:'500,0',
                lastRbTime:'2019-03-05',
                entrustAmount:'452,45',
                nowStatus:'在案',
                caseStatus:'warning'
                },
                {
                statistics:'23',
                entrustBank:'中信抢案',
                recentlyRb:'658,7',
                lastRb:'500,0',
                lastRbTime:'2019-03-05',
                entrustAmount:'452,45',
                nowStatus:'在案',
                caseStatus:'warning'
                },
                {
                statistics:'',
                entrustBank:'中信抢案',
                recentlyRb:'658,7',
                lastRb:'500,0',
                lastRbTime:'2019-03-05',
                entrustAmount:'452,45',
                nowStatus:'在案',
                caseStatus:'warning'
                },
                {
                statistics:'12',
                entrustBank:'中信抢案',
                recentlyRb:'658,7',
                lastRb:'500,0',
                lastRbTime:'2019-03-05',
                entrustAmount:'452,45',
                nowStatus:'在案',
                caseStatus:'warning'
                },
                {
                statistics:'123',
                entrustBank:'中信抢案',
                recentlyRb:'658,7',
                lastRb:'500,0',
                lastRbTime:'2019-03-05',
                entrustAmount:'452,45',
                nowStatus:'在案',
                caseStatus:'warning'
                },
                {
                statistics:'13',
                entrustBank:'中信抢案',
                recentlyRb:'658,7',
                lastRb:'500,0',
                lastRbTime:'2019-03-05',
                entrustAmount:'452,45',
                nowStatus:'在案',
                caseStatus:'warning'
                },
                {
                statistics:'23',
                entrustBank:'中信抢案',
                recentlyRb:'658,7',
                lastRb:'500,0',
                lastRbTime:'2019-03-05',
                entrustAmount:'452,45',
                nowStatus:'在案',
                caseStatus:'warning'
                }
            ],
            tableData:[
                {
                    id:1,
                    // tag:'normal',
                    tag:null,
                    sign:'无钱/无诚意/找到持卡人',
                    cardHolder:'魏占',
                    statistics:'',
                    gender:'男',
                    idNumber:'325487199010155668',
                    bankSlip:'251265200251850',
                    account:'100000036658',
                    newBalance:'20,356.00',
                    entrustDate:'2019-03-01',
                    backDate:'2019-05-31',
                    currentBill:'20,356.00',
                    gong:"",
                    caseStatus:'death'
                },
                {
                    id:2,
                    // tag:'wain',
                    tag:null,
                    sign:'无钱/无诚意/找到持',
                    cardHolder:'魏占',
                    statistics:'2',
                    gender:'男',
                    idNumber:'325487199010155668',
                    bankSlip:'251265200251850',
                    account:'100000036658',
                    newBalance:'20,356.00',
                    entrustDate:'2019-03-01',
                    backDate:'2019-05-31',
                    currentBill:'20,356.00',
                    gong:"3",
                    caseStatus:'warning'
                },
                {
                    id:3,
                    // tag:'complain',
                    tag:null,
                    sign:'无钱/无诚意/找到持',
                    cardHolder:'魏占',
                    statistics:'3',
                    gender:'男',
                    idNumber:'325487199010155668',
                    bankSlip:'251265200251850',
                    account:'100000036658',
                    newBalance:'20,356.00',
                    entrustDate:'2019-03-01',
                    backDate:'2019-05-31',
                    currentBill:'20,356.00',
                    gong:"4",
                    caseStatus:'complaints'
                },
                {
                    id:4,
                    // tag:'death',
                    tag:null,
                    sign:'无钱/无诚意/找到持',
                    cardHolder:'魏占',
                    statistics:'',
                    gender:'男',
                    idNumber:'325487199010155668',
                    bankSlip:'251265200251850',
                    account:'100000036658',
                    newBalance:'20,356.00',
                    entrustDate:'2019-03-01',
                    backDate:'2019-05-31',
                    currentBill:'20,356.00',
                    gong:"7",
                    caseStatus:'death'

                },
                {
                    id:5,
                    // tag:'normal',
                    tag:null,
                    sign:'无钱/无诚意/找到持',
                    cardHolder:'魏占',
                    statistics:'',
                    gender:'男',
                    idNumber:'325487199010155668',
                    bankSlip:'251265200251850',
                    account:'100000036658',
                    newBalance:'20,356.00',
                    entrustDate:'2019-03-01',
                    backDate:'2019-05-31',
                    currentBill:'20,356.00',
                    gong:"",
                    caseStatus:'death'
                },
                {
                    id:6,
                    // tag:'wain',
                    tag:null,
                    sign:'无钱/无诚意/找到持',
                    cardHolder:'魏占',
                    statistics:'2',
                    gender:'男',
                    idNumber:'325487199010155668',
                    bankSlip:'251265200251850',
                    account:'100000036658',
                    newBalance:'20,356.00',
                    entrustDate:'2019-03-01',
                    backDate:'2019-05-31',
                    currentBill:'20,356.00',
                    gong:"4",
                    caseStatus:'death'
                },
                {
                    id:7,
                    // tag:'complain',
                    tag:null,
                    sign:'无钱/无诚意/找到持',
                    cardHolder:'魏占',
                    statistics:'123',
                    gender:'男',
                    idNumber:'325487199010155668',
                    bankSlip:'251265200251850',
                    account:'100000036658',
                    newBalance:'20,356.00',
                    entrustDate:'2019-03-01',
                    backDate:'2019-05-31',
                    currentBill:'20,356.00',
                    gong:"4",
                    caseStatus:'death'
                },
                {
                    id:8,
                    // tag:'death',
                    tag:null,
                    sign:'无钱/无诚意/找到持',
                    cardHolder:'魏占',
                    statistics:'12',
                    gender:'男',
                    idNumber:'325487199010155668',
                    bankSlip:'251265200251850',
                    account:'100000036658',
                    newBalance:'20,356.00',
                    entrustDate:'2019-03-01',
                    backDate:'2019-05-31',
                    currentBill:'20,356.00',
                    gong:"3",
                    caseStatus:'death'
                },
                {
                    id:9,
                    // tag:'normal',
                    tag:null,
                    sign:'无钱/无诚意/找到持',
                    cardHolder:'魏占',
                    statistics:'13',
                    gender:'男',
                    idNumber:'325487199010155668',
                    bankSlip:'251265200251850',
                    account:'100000036658',
                    newBalance:'20,356.00',
                    entrustDate:'2019-03-01',
                    backDate:'2019-05-31',
                    currentBill:'20,356.00',
                    gong:'',
                    caseStatus:'death'
                },
                {
                    id:10,
                    // tag:'wain',
                    tag:null,
                    sign:'无钱/无诚意/找到持',
                    cardHolder:'魏占',
                    statistics:'23',
                    gender:'男',
                    idNumber:'325487199010155668',
                    bankSlip:'251265200251850',
                    account:'100000036658',
                    newBalance:'20,356.00',
                    entrustDate:'2019-03-01',
                    backDate:'2019-05-31',
                    currentBill:'20,356.00',
                    gong:'',
                    caseStatus:'death'
                },
                {
                    id:11,
                    // tag:'complain',
                    tag:null,
                    sign:'无钱/无诚意/找到持',
                    cardHolder:'魏占',
                    statistics:'',
                    gender:'男',
                    idNumber:'325487199010155668',
                    bankSlip:'251265200251850',
                    account:'100000036658',
                    newBalance:'20,356.00',
                    entrustDate:'2019-03-01',
                    backDate:'2019-05-31',
                    currentBill:'20,356.00',
                    gong:'8',
                    caseStatus:null
                },
                {
                    id:12,
                    // tag:'normal',
                    tag:null,
                    sign:'无钱/无诚意/找到持',
                    cardHolder:'魏占',
                    statistics:'',
                    gender:'男',
                    idNumber:'325487199010155668',
                    bankSlip:'251265200251850',
                    account:'100000036658',
                    newBalance:'20,356.00',
                    entrustDate:'2019-03-01',
                    backDate:'2019-05-31',
                    currentBill:'20,356.00',
                    gong:'',
                    caseStatus:'death'
                }
            ],
            tableAddData:[
                {
                    id:13,
                    // tag:'normal',
                    tag:null,
                    sign:'无钱/无诚意/找到持',
                    cardHolder:'魏看',
                    statistics:'25061220',
                    gender:'男',
                    idNumber:'325487199010155668',
                    bankSlip:'251265200251850',
                    account:'100000036658',
                    newBalance:'20,356.00',
                    entrustDate:'2019-03-01',
                    backDate:'2019-05-31',
                    currentBill:'20,356.00',
                    gong:'',
                    caseStatus:'warning'
                },{
                    id:14,
                    // tag:'normal',
                    tag:null,
                    sign:'无钱/无诚意/找到持',
                    cardHolder:'魏看',
                    statistics:'25061220',
                    gender:'男',
                    idNumber:'325487199010155668',
                    bankSlip:'251265200251850',
                    account:'100000036658',
                    newBalance:'20,356.00',
                    entrustDate:'2019-03-01',
                    backDate:'2019-05-31',
                    currentBill:'20,356.00',
                    gong:'4',
                    caseStatus:'warning'
                },
                {
                    id:15,
                    // tag:'normal',
                    tag:null,
                    sign:'无钱/无诚意/找到持',
                    cardHolder:'魏看',
                    statistics:'25061220',
                    gender:'男',
                    idNumber:'325487199010155668',
                    bankSlip:'251265200251850',
                    account:'100000036658',
                    newBalance:'20,356.00',
                    entrustDate:'2019-03-01',
                    backDate:'2019-05-31',
                    currentBill:'20,356.00',
                    gong:'',
                    caseStatus:'warning'
                },{
                    id:16,
                    // tag:'normal',
                    tag:null,
                    sign:'无钱/无诚意/找到持',
                    cardHolder:'魏看',
                    statistics:'25061220',
                    gender:'男',
                    idNumber:'325487199010155668',
                    bankSlip:'251265200251850',
                    account:'100000036658',
                    newBalance:'20,356.00',
                    entrustDate:'2019-03-01',
                    backDate:'2019-05-31',
                    currentBill:'20,356.00',
                    gong:'9',
                    caseStatus:'warning'
                }
            ]
        } 
    },
    methods: {
        handleSizeChange(val){
            console.log(`每页：${val}`) 
        },
        handlecurrentChange(val){
            console.log(`当前页：${val}`)
        },
        handleSelectionChange(val){//val值为选中的对象组成的数组
            this.multipleSelection = val
        },
        handleCommand(command){//标记筛选颜色
            if(command == 'all'){
                this.$message({
                    showClose:true,
                    type:'success',
                    message:'筛选显示全部'
                })
            }else if(command == 'null'){ // 无颜色标记状态
                this.tableData = this.tableData.filter(function(list){
                    return list.tag == null
                })
                this.$message({
                    showClose:true,
                    type:'success',
                    message:'筛选无标记状态'
                })
            }else{
                this.tableData = this.tableData.filter(function(list){
                    return list.tag == command
                })
                this.$message({
                    showClose:true,
                    type:'success',
                    message:'筛选颜色' + command
                })
            }
        },
        openOrshrink(){
            //点击伸缩与张开图标头部显隐
            this.openFlag = !this.openFlag
            let header = document.getElementById('home-header').style.display
            document.getElementById('home-header').style.display = header=='none'?'block':'none'
            // this.maxHeightValue = this.maxHeightValue == 650?750:650
            if(!this.openFlag){ //隐藏头顶
                $('.page-content').height(window.innerHeight-80)
                this.tableData.splice(12,4)
            }else{ //显示头顶
                $('.page-content').height(window.innerHeight-30)
                this.tableData = [...this.tableData,...this.tableAddData]
            }
        },
        viewDetail(index,status){
            let routerDetails = this.$router.resolve({
                path: `/home/index/${index+1}?status=${status}`
            })
            window.open(routerDetails.href,'_blank') //新开路由
            // this.$router.push(`/home/index/${row.id}`) //使用模板字符串
        },
        pickerAllChange(val){//统一标色功能,改变选中的颜色值
            this.multipleSelection.forEach(function(current){ //foreach与map都可以这样改变原有的数组值，不同的是map会返回改变后的新数组，而forEach返回undefined
                current.tag = val
            })
        },
        checkType(type){//案件分类
            this.isTypeActive = type //控制选中样式
            if(type == 'all'){//全部
                this.tableData = [
                    {
                        id:1,
                        // tag:'normal',
                        tag:null,
                        sign:'无钱/无诚意/找到持',
                        cardHolder:'魏占',
                        statistics:'25061220',
                        gender:'男',
                        idNumber:'325487199010155668',
                        bankSlip:'251265200251850',
                        account:'100000036658',
                        newBalance:'20,356.00',
                        entrustDate:'2019-03-01',
                        backDate:'2019-05-31',
                        currentBill:'20,356.00',
                        gong:"",
                        caseStatus:'warning'
                    },
                    {
                        id:2,
                        // tag:'wain',
                        tag:null,
                        sign:'无钱/无诚意/找到持',
                        cardHolder:'魏占',
                        statistics:'25061220',
                        gender:'男',
                        idNumber:'325487199010155668',
                        bankSlip:'251265200251850',
                        account:'100000036658',
                        newBalance:'20,356.00',
                        entrustDate:'2019-03-01',
                        backDate:'2019-05-31',
                        currentBill:'20,356.00',
                        gong:"3",
                        caseStatus:'warning'
                    },
                    {
                        id:3,
                        // tag:'complain',
                        tag:null,
                        sign:'无钱/无诚意/找到持',
                        cardHolder:'魏占',
                        statistics:'25061220',
                        gender:'男',
                        idNumber:'325487199010155668',
                        bankSlip:'251265200251850',
                        account:'100000036658',
                        newBalance:'20,356.00',
                        entrustDate:'2019-03-01',
                        backDate:'2019-05-31',
                        currentBill:'20,356.00',
                        gong:"4",
                        caseStatus:'warning'
                    },
                    {
                        id:4,
                        // tag:'death',
                        tag:null,
                        sign:'无钱/无诚意/找到持',
                        cardHolder:'魏占',
                        statistics:'25061220',
                        gender:'男',
                        idNumber:'325487199010155668',
                        bankSlip:'251265200251850',
                        account:'100000036658',
                        newBalance:'20,356.00',
                        entrustDate:'2019-03-01',
                        backDate:'2019-05-31',
                        currentBill:'20,356.00',
                        gong:"7",
                        caseStatus:'warning'
                    },
                    {
                        id:5,
                        // tag:'normal',
                        tag:null,
                        sign:'无钱/无诚意/找到持',
                        cardHolder:'魏占',
                        statistics:'25061220',
                        gender:'男',
                        idNumber:'325487199010155668',
                        bankSlip:'251265200251850',
                        account:'100000036658',
                        newBalance:'20,356.00',
                        entrustDate:'2019-03-01',
                        backDate:'2019-05-31',
                        currentBill:'20,356.00',
                        gong:"",
                        caseStatus:'warning'
                    },
                    {
                        id:6,
                        // tag:'wain',
                        tag:null,
                        sign:'无钱/无诚意/找到持',
                        cardHolder:'魏占',
                        statistics:'25061220',
                        gender:'男',
                        idNumber:'325487199010155668',
                        bankSlip:'251265200251850',
                        account:'100000036658',
                        newBalance:'20,356.00',
                        entrustDate:'2019-03-01',
                        backDate:'2019-05-31',
                        currentBill:'20,356.00',
                        gong:"4",
                        caseStatus:'warning'
                    },
                    {
                        id:7,
                        // tag:'complain',
                        tag:null,
                        sign:'无钱/无诚意/找到持',
                        cardHolder:'魏占',
                        statistics:'25061220',
                        gender:'男',
                        idNumber:'325487199010155668',
                        bankSlip:'251265200251850',
                        account:'100000036658',
                        newBalance:'20,356.00',
                        entrustDate:'2019-03-01',
                        backDate:'2019-05-31',
                        currentBill:'20,356.00',
                        gong:"4",
                        caseStatus:'warning'
                    },
                    {
                        id:8,
                        // tag:'death',
                        tag:null,
                        sign:'无钱/无诚意/找到持',
                        cardHolder:'魏占',
                        statistics:'25061220',
                        gender:'男',
                        idNumber:'325487199010155668',
                        bankSlip:'251265200251850',
                        account:'100000036658',
                        newBalance:'20,356.00',
                        entrustDate:'2019-03-01',
                        backDate:'2019-05-31',
                        currentBill:'20,356.00',
                        gong:"3",
                        caseStatus:'warning'
                    },
                    {
                        id:9,
                        // tag:'normal',
                        tag:null,
                        sign:'无钱/无诚意/找到持',
                        cardHolder:'魏占',
                        statistics:'25061220',
                        gender:'男',
                        idNumber:'325487199010155668',
                        bankSlip:'251265200251850',
                        account:'100000036658',
                        newBalance:'20,356.00',
                        entrustDate:'2019-03-01',
                        backDate:'2019-05-31',
                        currentBill:'20,356.00',
                        gong:'',
                        caseStatus:'warning'
                    },
                    {
                        id:10,
                        // tag:'wain',
                        tag:null,
                        sign:'无钱/无诚意/找到持',
                        cardHolder:'魏占',
                        statistics:'25061220',
                        gender:'男',
                        idNumber:'325487199010155668',
                        bankSlip:'251265200251850',
                        account:'100000036658',
                        newBalance:'20,356.00',
                        entrustDate:'2019-03-01',
                        backDate:'2019-05-31',
                        currentBill:'20,356.00',
                        gong:'',
                        caseStatus:'warning'
                    },
                    {
                        id:11,
                        // tag:'complain',
                        tag:null,
                        sign:'无钱/无诚意/找到持',
                        cardHolder:'魏占',
                        statistics:'25061220',
                        gender:'男',
                        idNumber:'325487199010155668',
                        bankSlip:'251265200251850',
                        account:'100000036658',
                        newBalance:'20,356.00',
                        entrustDate:'2019-03-01',
                        backDate:'2019-05-31',
                        currentBill:'20,356.00',
                        gong:'8',
                        caseStatus:'warning'
                    },
                    {
                        id:12,
                        // tag:'normal',
                        tag:null,
                        sign:'无钱/无诚意/找到持',
                        cardHolder:'魏占',
                        statistics:'25061220',
                        gender:'男',
                        idNumber:'325487199010155668',
                        bankSlip:'251265200251850',
                        account:'100000036658',
                        newBalance:'20,356.00',
                        entrustDate:'2019-03-01',
                        backDate:'2019-05-31',
                        currentBill:'20,356.00',
                        gong:'',
                        caseStatus:'warning'
                    }
                ]
            }else if(type=='today'){//今日回款
                this.tableData = [
                    {
                        id:1,
                        // tag:'normal',
                        tag:null,
                        sign:'无钱/无诚意/找到持',
                        cardHolder:'魏占',
                        statistics:'25061220',
                        gender:'男',
                        idNumber:'325487199010155668',
                        bankSlip:'251265200251850',
                        account:'100000036658',
                        newBalance:'20,356.00',
                        entrustDate:'2019-03-01',
                        backDate:'2019-05-31',
                        currentBill:'20,356.00',
                        gong:"",
                        caseStatus:'death'
                    },
                    {
                        id:2,
                        // tag:'wain',
                        tag:null,
                        sign:'无钱/无诚意/找到持',
                        cardHolder:'魏占',
                        statistics:'25061220',
                        gender:'男',
                        idNumber:'325487199010155668',
                        bankSlip:'251265200251850',
                        account:'100000036658',
                        newBalance:'20,356.00',
                        entrustDate:'2019-03-01',
                        backDate:'2019-05-31',
                        currentBill:'20,356.00',
                        gong:"3",
                        caseStatus:'death'
                    },
                    {
                        id:3,
                        // tag:'complain',
                        tag:null,
                        sign:'无钱/无诚意/找到持',
                        cardHolder:'魏占',
                        statistics:'25061220',
                        gender:'男',
                        idNumber:'325487199010155668',
                        bankSlip:'251265200251850',
                        account:'100000036658',
                        newBalance:'20,356.00',
                        entrustDate:'2019-03-01',
                        backDate:'2019-05-31',
                        currentBill:'20,356.00',
                        gong:"4",
                        caseStatus:'death'
                    },
                    {
                        id:4,
                        // tag:'death',
                        tag:null,
                        sign:'无钱/无诚意/找到持',
                        cardHolder:'魏占',
                        statistics:'25061220',
                        gender:'男',
                        idNumber:'325487199010155668',
                        bankSlip:'251265200251850',
                        account:'100000036658',
                        newBalance:'20,356.00',
                        entrustDate:'2019-03-01',
                        backDate:'2019-05-31',
                        currentBill:'20,356.00',
                        gong:"7",
                        caseStatus:'death'
                    },
                    {
                        id:5,
                        // tag:'normal',
                        tag:null,
                        sign:'无钱/无诚意/找到持',
                        cardHolder:'魏占',
                        statistics:'25061220',
                        gender:'男',
                        idNumber:'325487199010155668',
                        bankSlip:'251265200251850',
                        account:'100000036658',
                        newBalance:'20,356.00',
                        entrustDate:'2019-03-01',
                        backDate:'2019-05-31',
                        currentBill:'20,356.00',
                        gong:"",
                        caseStatus:'death'
                    }
                ]
            }else if(type=='threeNo'){//3天未跟进
                this.tableData = [
                    {
                        id:1,
                        // tag:'normal',
                        tag:null,
                        sign:'无钱/无诚意/找到持',
                        cardHolder:'魏占',
                        statistics:'25061220',
                        gender:'男',
                        idNumber:'325487199010155668',
                        bankSlip:'251265200251850',
                        account:'100000036658',
                        newBalance:'20,356.00',
                        entrustDate:'2019-03-01',
                        backDate:'2019-05-31',
                        currentBill:'20,356.00',
                        gong:"",
                        caseStatus:'death'
                    },
                    {
                        id:2,
                        // tag:'wain',
                        tag:null,
                        sign:'无钱/无诚意/找到持',
                        cardHolder:'魏占',
                        statistics:'25061220',
                        gender:'男',
                        idNumber:'325487199010155668',
                        bankSlip:'251265200251850',
                        account:'100000036658',
                        newBalance:'20,356.00',
                        entrustDate:'2019-03-01',
                        backDate:'2019-05-31',
                        currentBill:'20,356.00',
                        gong:"3",
                        caseStatus:'death'
                    },
                    {
                        id:3,
                        // tag:'complain',
                        tag:null,
                        sign:'无钱/无诚意/找到持',
                        cardHolder:'魏占',
                        statistics:'25061220',
                        gender:'男',
                        idNumber:'325487199010155668',
                        bankSlip:'251265200251850',
                        account:'100000036658',
                        newBalance:'20,356.00',
                        entrustDate:'2019-03-01',
                        backDate:'2019-05-31',
                        currentBill:'20,356.00',
                        gong:"4",
                        caseStatus:'death'
                    }
                ]
            }else if(type=='sevenNo'){//7天未跟进
                this.tableData = [
                    {
                        id:1,
                        // tag:'normal',
                        tag:null,
                        sign:'无钱/无诚意/找到持',
                        cardHolder:'魏占',
                        statistics:'25061220',
                        gender:'男',
                        idNumber:'325487199010155668',
                        bankSlip:'251265200251850',
                        account:'100000036658',
                        newBalance:'20,356.00',
                        entrustDate:'2019-03-01',
                        backDate:'2019-05-31',
                        currentBill:'20,356.00',
                        gong:"",
                        caseStatus:null
                    },
                    {
                        id:2,
                        // tag:'wain',
                        tag:null,
                        sign:'无钱/无诚意/找到持',
                        cardHolder:'魏占',
                        statistics:'25061220',
                        gender:'男',
                        idNumber:'325487199010155668',
                        bankSlip:'251265200251850',
                        account:'100000036658',
                        newBalance:'20,356.00',
                        entrustDate:'2019-03-01',
                        backDate:'2019-05-31',
                        currentBill:'20,356.00',
                        gong:"3",
                        caseStatus:null
                    },
                    {
                        id:3,
                        // tag:'complain',
                        tag:null,
                        sign:'无钱/无诚意/找到持',
                        cardHolder:'魏占',
                        statistics:'25061220',
                        gender:'男',
                        idNumber:'325487199010155668',
                        bankSlip:'251265200251850',
                        account:'100000036658',
                        newBalance:'20,356.00',
                        entrustDate:'2019-03-01',
                        backDate:'2019-05-31',
                        currentBill:'20,356.00',
                        gong:"4",
                        caseStatus:null
                    },
                    {
                        id:4,
                        // tag:'death',
                        tag:null,
                        sign:'无钱/无诚意/找到持',
                        cardHolder:'魏占',
                        statistics:'25061220',
                        gender:'男',
                        idNumber:'325487199010155668',
                        bankSlip:'251265200251850',
                        account:'100000036658',
                        newBalance:'20,356.00',
                        entrustDate:'2019-03-01',
                        backDate:'2019-05-31',
                        currentBill:'20,356.00',
                        gong:"7",
                        caseStatus:null
                    },
                    {
                        id:5,
                        // tag:'normal',
                        tag:null,
                        sign:'无钱/无诚意/找到持',
                        cardHolder:'魏占',
                        statistics:'25061220',
                        gender:'男',
                        idNumber:'325487199010155668',
                        bankSlip:'251265200251850',
                        account:'100000036658',
                        newBalance:'20,356.00',
                        entrustDate:'2019-03-01',
                        backDate:'2019-05-31',
                        currentBill:'20,356.00',
                        gong:"",
                        caseStatus:null
                    }
                ]
            }else if(type=='threeExpire'){//3天内到期
                this.tableData = [
                    {
                        id:1,
                        // tag:'normal',
                        tag:null,
                        sign:'无钱/无诚意/找到持',
                        cardHolder:'魏占',
                        statistics:'25061220',
                        gender:'男',
                        idNumber:'325487199010155668',
                        bankSlip:'251265200251850',
                        account:'100000036658',
                        newBalance:'20,356.00',
                        entrustDate:'2019-03-01',
                        backDate:'2019-05-31',
                        currentBill:'20,356.00',
                        gong:"",
                        caseStatus:null
                    },
                    {
                        id:2,
                        // tag:'wain',
                        tag:null,
                        sign:'无钱/无诚意/找到持',
                        cardHolder:'魏占',
                        statistics:'25061220',
                        gender:'男',
                        idNumber:'325487199010155668',
                        bankSlip:'251265200251850',
                        account:'100000036658',
                        newBalance:'20,356.00',
                        entrustDate:'2019-03-01',
                        backDate:'2019-05-31',
                        currentBill:'20,356.00',
                        gong:"3",
                        caseStatus:null
                    }
                ]
            }else if(type=='complaint'){//投诉预警
                this.tableData = [
                    {
                        id:1,
                        // tag:'normal',
                        tag:null,
                        sign:'无钱/无诚意/找到持',
                        cardHolder:'魏占',
                        statistics:'25061220',
                        gender:'男',
                        idNumber:'325487199010155668',
                        bankSlip:'251265200251850',
                        account:'100000036658',
                        newBalance:'20,356.00',
                        entrustDate:'2019-03-01',
                        backDate:'2019-05-31',
                        currentBill:'20,356.00',
                        gong:"",
                        caseStatus:'warning'
                    },
                    {
                        id:2,
                        // tag:'wain',
                        tag:null,
                        sign:'无钱/无诚意/找到持',
                        cardHolder:'魏占',
                        statistics:'25061220',
                        gender:'男',
                        idNumber:'325487199010155668',
                        bankSlip:'251265200251850',
                        account:'100000036658',
                        newBalance:'20,356.00',
                        entrustDate:'2019-03-01',
                        backDate:'2019-05-31',
                        currentBill:'20,356.00',
                        gong:"3",
                        caseStatus:"warning"
                    },
                    {
                        id:3,
                        // tag:'complain',
                        tag:null,
                        sign:'无钱/无诚意/找到持',
                        cardHolder:'魏占',
                        statistics:'25061220',
                        gender:'男',
                        idNumber:'325487199010155668',
                        bankSlip:'251265200251850',
                        account:'100000036658',
                        newBalance:'20,356.00',
                        entrustDate:'2019-03-01',
                        backDate:'2019-05-31',
                        currentBill:'20,356.00',
                        gong:"4",
                        caseStatus:"warning"
                    }
                ]
            }else if(type=='death'){//死类单
                this.tableData = [
                    {
                        id:1,
                        // tag:'normal',
                        tag:null,
                        sign:'无钱/无诚意/找到持',
                        cardHolder:'魏占',
                        statistics:'25061220',
                        gender:'男',
                        idNumber:'325487199010155668',
                        bankSlip:'251265200251850',
                        account:'100000036658',
                        newBalance:'20,356.00',
                        entrustDate:'2019-03-01',
                        backDate:'2019-05-31',
                        currentBill:'20,356.00',
                        gong:"",
                        caseStatus:"death"
                    },
                    {
                        id:2,
                        // tag:'wain',
                        tag:null,
                        sign:'无钱/无诚意/找到持',
                        cardHolder:'魏占',
                        statistics:'25061220',
                        gender:'男',
                        idNumber:'325487199010155668',
                        bankSlip:'251265200251850',
                        account:'100000036658',
                        newBalance:'20,356.00',
                        entrustDate:'2019-03-01',
                        backDate:'2019-05-31',
                        currentBill:'20,356.00',
                        gong:"3",
                        caseStatus:"death"
                    },
                    {
                        id:3,
                        // tag:'complain',
                        tag:null,
                        sign:'无钱/无诚意/找到持',
                        cardHolder:'魏占',
                        statistics:'25061220',
                        gender:'男',
                        idNumber:'325487199010155668',
                        bankSlip:'251265200251850',
                        account:'100000036658',
                        newBalance:'20,356.00',
                        entrustDate:'2019-03-01',
                        backDate:'2019-05-31',
                        currentBill:'20,356.00',
                        gong:"4",
                        caseStatus:"death"
                    },
                    {
                        id:4,
                        // tag:'death',
                        tag:null,
                        sign:'无钱/无诚意/找到持',
                        cardHolder:'魏占',
                        statistics:'25061220',
                        gender:'男',
                        idNumber:'325487199010155668',
                        bankSlip:'251265200251850',
                        account:'100000036658',
                        newBalance:'20,356.00',
                        entrustDate:'2019-03-01',
                        backDate:'2019-05-31',
                        currentBill:'20,356.00',
                        gong:"7",
                        caseStatus:"death"
                    },
                    {
                        id:5,
                        // tag:'normal',
                        tag:null,
                        sign:'无钱/无诚意/找到持',
                        cardHolder:'魏占',
                        statistics:'25061220',
                        gender:'男',
                        idNumber:'325487199010155668',
                        bankSlip:'251265200251850',
                        account:'100000036658',
                        newBalance:'20,356.00',
                        entrustDate:'2019-03-01',
                        backDate:'2019-05-31',
                        currentBill:'20,356.00',
                        gong:"",
                        caseStatus:"death"
                    },
                    {
                        id:6,
                        // tag:'wain',
                        tag:null,
                        sign:'无钱/无诚意/找到持',
                        cardHolder:'魏占',
                        statistics:'25061220',
                        gender:'男',
                        idNumber:'325487199010155668',
                        bankSlip:'251265200251850',
                        account:'100000036658',
                        newBalance:'20,356.00',
                        entrustDate:'2019-03-01',
                        backDate:'2019-05-31',
                        currentBill:'20,356.00',
                        gong:"4",
                        caseStatus:"death"
                    },
                    {
                        id:7,
                        // tag:'complain',
                        tag:null,
                        sign:'无钱/无诚意/找到持',
                        cardHolder:'魏占',
                        statistics:'25061220',
                        gender:'男',
                        idNumber:'325487199010155668',
                        bankSlip:'251265200251850',
                        account:'100000036658',
                        newBalance:'20,356.00',
                        entrustDate:'2019-03-01',
                        backDate:'2019-05-31',
                        currentBill:'20,356.00',
                        gong:"4",
                        caseStatus:"death"
                    },
                    {
                        id:8,
                        // tag:'death',
                        tag:null,
                        sign:'无钱/无诚意/找到持',
                        cardHolder:'魏占',
                        statistics:'25061220',
                        gender:'男',
                        idNumber:'325487199010155668',
                        bankSlip:'251265200251850',
                        account:'100000036658',
                        newBalance:'20,356.00',
                        entrustDate:'2019-03-01',
                        backDate:'2019-05-31',
                        currentBill:'20,356.00',
                        gong:"3",
                        caseStatus:"death"
                    }
                ]
            }

        },
        tCaseChange(val){//共案筛选
            if(val){
                this.tableData = this.tableData.filter(function(list){
                    return list.gong!='' 
                })
            }
        }
    },
    mounted(){
        this.$dragging.$on('dragged',({value})=>{
            console.log('拖动排序后数组',value.list)
        })
    }
}
</script>

<style>
.colorBtn .el-color-picker__trigger{
    width: 80px!important;
    height: 32px!important;
    border:0; 
}

.colorBtn .el-color-picker__color{
    visibility: hidden;
}

.gongbadge .el-badge__content{
    top:0;
    background-color: #ffab2e;
}
</style>


<style scoped>
/* scoped是表明未局部css样式，没写scoped就是全局css样式 */
.myDrop{
    height: 26px;
    position: relative;
    top:-3px;
}
.dropI{
    width: 20px;
    height: 20px;
    border-radius: 4px;
    cursor: pointer;
    display: inline-block;
    margin-left:5px;
    position: relative;
    top:4px;
}
.colorA{
    background-color: #a762fb;
}
.colorB{
    background-color: #ff5454;
}
.colorC{
    background-color: #fd9400;
}
.colorD{
    background-color: #14c435;
}
.colorE{
    background-color: #09b0ee;
}
.colorF{
    background-color: #2f75ee;
}
.colorG{
    background-color: #fff;
    border:1px solid #999;
}
.caseTypeActive{
    border-bottom: 2px solid #fff;
    padding-bottom: 5px;
}
.indexWrap{
    background-color: #fff;
    padding: 15px;
}
.inpt_wrap .el-input{
    width: 180px;
    margin-left: 10px;
}
.inpt_wrap span{
    font-size: 16px;
    position: relative;
    top: 5px;
}
.s_types{
    float: left;
    padding-right: 20px;
    padding-bottom:10px;

}
.JS_search {
    background-color: #2e76ee !important;
    border-color: #2e76ee !important;
}
.moreSearch{
    margin-left: 10px;
    width: 90px;
}
.filterWrap{
    height: 40px;
    line-height: 40px;
    background-color: #2e76ee;
    margin-top: 20px;
    color: #fff;
    position: relative;
}
.filterWrap span{
    margin-left: 40px;
    cursor: pointer;
}
.openBtn{
    position: absolute;
    right: 15px;
    top: 11px;
    cursor: pointer;
}
.colorTool {
    width: 76px;
    height: 26px;
    display: inline-block;
    text-align: center;
    line-height: 26px;
    /* border: 1px solid #ff5353; */
    background-color: #fff;
    color: #ff5353;
    cursor: pointer;
}
.allSetColors{
    position: absolute;    
    left: 0;
    top:0;
}

.filterOther{
    padding-top: 10px;
    position: relative;
}
.filterOther .el-checkbox{
    margin-right:0;
}
.tCaseBox{
    margin-left: 10px;
    position: relative;
    top:1px;
}
.tCase{
    margin-left: 6px;
}
.table_wrap{
    margin-top: 10px;
}
#pagination{
    margin-top:20px;
}

.hidebtn{
    display:none
}

@media only screen and (width:1024px){
    .hidediv{display:none}
    .hidebtn{display:block}
}

/* 标记样式 */
.sign_common{
    width: 18px;
    height: 18px;
    border-radius: 5px;
    display: inline-block;
    cursor: pointer;
}
/* 正常单 */
.normal{
    background-color: #1fcf87;
}
/* 警告 */
.wain{
    background-color: #ffa756;
}
/* 投诉 */
.complain{
    background-color: #eb1a21;
}
/* 死单 */
.death{
    background-color: gray; 
}
.open{
    display: block;
}
.shrink{
    display: none;
}
.mgt10{
    margin-top:10px;
}
.mgt1{
    margin-top:1px;
}
/* 列表项配置弹框 */
.tbCheckBox{
    width:100%;
    margin-bottom:15px;
}
.dragWrap{
    background-color: #ebeef5;
    border:1px solid #ddd;border-radius:4px;
}
.dragHeader{
    padding: 10px;
    font-size:16px;border-bottom:1px solid #ddd;
}
.dragList{
    height: 273px;
    overflow: auto;padding:10px;
}
.drag-item{
    padding: 5px 0 5px 20px;
    cursor: pointer;border:1px solid #409eff;border-radius:5px;background:#fff;margin-bottom:10px;
}
/* 到期还款提醒弹框 */
.pReset1{
    background-color:#ffdec1;
    border:1px solid #ffcaa3;
    color:#fe7837;
    text-indent:10px;
}
.pReset2{
    color:#60646c;
}
.pReset2 span{
    color:#ff5353;
}
/* 银行讯息弹框 */

</style>
