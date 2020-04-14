<template>
<!-- 每日未到账业绩统计 -->
    <div class="page-content">
        <div class="mar-bom10">首页：<router-link :to="{name:'ReportsIndex'}" class="text-line">统计报表</router-link>&nbsp;>&nbsp;每日未到账业绩</div>
        <div class="indexWrap row">
            <div class="searchWrap clearfix" >
                <div class="s_types inpt_wrap pull-left">
                    <span class="pull-left">经办人：</span>
                    <el-select placeholder="请输入姓名或手机号联想" v-model="nameOrPhone" filterable style="width:190px"></el-select>
                </div>
                <div class="s_types inpt_wrap pull-left">
                    <span class="pull-left">包含下级：</span>
                    <template>
                    <el-select v-model="typeSelect" placeholder=""  style="width:60px">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    </template>
                </div>
                <div class="s_types inpt_wrap pull-left">
                    <span class="pull-left">申请日期：</span>
                    <el-date-picker v-model="dateRange" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" class="pickerWid"></el-date-picker>
                </div>
                <el-button type="primary" icon="el-icon-search">搜索</el-button>
                <span class="mar-lft">总金额：<b style="color:red">4,445.00</b></span>
                <div class="pull-right">
                    <el-button >导入</el-button>
                    <el-button  @click="dialog_expot=true">导出</el-button>
                </div>

            </div>
            <div class="tableWrap">
                <div class="table_wrap">
                    <el-table :data="tableData" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
                        
                        <el-table-column prop="id" label="序号" ></el-table-column>
                        <el-table-column prop="caseFlag">
                            <template slot="header">
                                <select class="form-control" v-model="caseFlag">
                                    <option value disabled selected style="display:none">案件类型</option>
                                    <option value="all">中信抢案</option>
                                    <option value="1">招商</option>
                                    <option value="2">京东</option>
                                </select>
                            </template>
                        </el-table-column>
                        <el-table-column prop="cardHolder" label="持卡人" ></el-table-column>
                        <el-table-column prop="idNumber" label="身份证" width="160"></el-table-column>
                        <el-table-column prop="replyDate" label="申请日期" ></el-table-column>
                        <el-table-column prop="repayDate" label="还款日期" ></el-table-column>
                        <el-table-column prop="repayNum" label="还款金额" ></el-table-column>
                        <el-table-column prop="repayType" label="还款方式" ></el-table-column>
                        <el-table-column prop="repayNote" label="还款备注"  min-width="180"></el-table-column>
                        <el-table-column label="经办人">
                        <template slot-scope="scope">
                            <el-popover trigger="hover" placement="top">
                                <p><b>男/在职&nbsp;&nbsp;186****4488</b>&nbsp;<img src="../images/call.png"  alt=""></p>
                                    <p>所属职位：资产管理员-部长</p>
                                    <p>隶属单位：长沙分公司-业务部</p>
                                    <p>组织关系：谭曼-陈军-李永杰-{{scope.row.agent}}</p>
                                    <div slot="reference" class="name-wrapper">
                                    <el-button size="mini">{{scope.row.agent}}</el-button>
                                    </div>
                            </el-popover>
                        </template>
                        </el-table-column>
                        <el-table-column prop="replayFlag" >
                            <template slot="header">
                                <select class="form-control" v-model="replayFlag">
                                    <option value disabled selected style="display:none">回复状态</option>
                                    <option value="all">中信抢案</option>
                                    <option value="1">招商</option>
                                    <option value="2">京东</option>
                                </select>
                            </template>
                        </el-table-column>
                        <el-table-column prop="amount" label="操作" width="100" fixed="right">
                            <template>
                                <el-button type="text" size="small" @click="sendLetterVisible=true">
                                    回复
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
        <!-- 回复弹框 -->
        <el-dialog  title="管理员回复"  :visible.sync="sendLetterVisible" width="640px">
            <el-row class="dialogStyle">
                <el-col :md="12">
                    <span>持卡人：</span>
                    <el-input v-model="managecardHolder" :disabled="true" style="width:220px"></el-input>
                </el-col>
                <el-col :md="12">
                    <span>身份证：</span>
                    <el-input v-model="manageidNumber" :disabled="true"  style="width:220px" ></el-input>
                </el-col>
                <el-col :md="24">
                    <span >回复：</span>
                    <el-input v-model="managenote" type="textarea" style="width:520px"></el-input>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="sendLetterVisible = false">取消</el-button>
                <el-button type="primary" @click="sendLetterVisible = false">确定</el-button>
            </span>
        </el-dialog>

         <!-- 导出弹框 -->
        <el-dialog title="温馨提示" :visible.sync="dialog_expot"  width="500px">
            <span>尊敬的管理员，感谢您使用数据导出系统，本系统将自动保存您的操作记录，因您导出的文件属于公司保密信息，请务必妥善保管与使用以保证您导出文件信息安全，一旦私自外泄，将严格按照公司信息安全规章制度进行处理！</span>
            <span slot="footer" class="dialog-footer">
                <el-button  @click="dialog_expot=false">关闭窗口</el-button>
                <el-button type="primary"  @click="dialog_expot=false">确定导出</el-button>
            </span>
        </el-dialog>
    </div>
  

</template>
<script>
import myMixin from '../libs/js/mixin.js' //导入mixin修复page-content全屏功能
export default {
    name:'DailyBill',
    mixins:[myMixin],
    data() {
        return {
            tableData:[
                {
                    "id":1,
                    "caseFlag":"招商",
                    "cardHolder":"魏占",
                    "idNumber":"210423198012170819",
                    "replyDate":"2019-05-08",
                    "repayDate":"2019-05-08",
                    "repayNum":"4445",
                    "repayType":"电话催收",
                    "repayNote":"还款无压力，无敌是多么寂寞",
                    "agent":'凌心敏',
                    "replayFlag":"未回复"
                },
                {
                    "id":2,
                    "caseFlag":"招商",
                    "cardHolder":"魏占",
                    "idNumber":"210423198012170819",
                    "replyDate":"2019-05-08",
                    "repayDate":"2019-05-08",
                    "repayNum":"4445",
                    "repayType":"电话催收",
                    "repayNote":"还款无压力，无敌是多么寂寞",
                    "agent":'凌心敏',
                    "replayFlag":"未回复"
                },
                {
                    "id":3,
                    "caseFlag":"招商",
                    "cardHolder":"魏占",
                    "idNumber":"210423198012170819",
                    "replyDate":"2019-05-08",
                    "repayDate":"2019-05-08",
                    "repayNum":"4445",
                    "repayType":"电话催收",
                    "repayNote":"还款无压力，无敌是多么寂寞",
                    "agent":'凌心敏',
                    "replayFlag":"未回复"
                },
                {
                    "id":4,
                    "caseFlag":"招商",
                    "cardHolder":"魏占",
                    "idNumber":"210423198012170819",
                    "replyDate":"2019-05-08",
                    "repayDate":"2019-05-08",
                    "repayNum":"4445",
                    "repayType":"电话催收",
                    "repayNote":"还款无压力，无敌是多么寂寞",
                    "agent":'凌心敏',
                    "replayFlag":"未回复"
                },
                {
                    "id":5,
                    "caseFlag":"招商",
                    "cardHolder":"魏占",
                    "idNumber":"210423198012170819",
                    "replyDate":"2019-05-08",
                    "repayDate":"2019-05-08",
                    "repayNum":"4445",
                    "repayType":"电话催收",
                    "repayNote":"还款无压力，无敌是多么寂寞",
                    "agent":'凌心敏',
                    "replayFlag":"未回复"
                },
                {
                    "id":6,
                    "caseFlag":"招商",
                    "cardHolder":"魏占",
                    "idNumber":"210423198012170819",
                    "replyDate":"2019-05-08",
                    "repayDate":"2019-05-08",
                    "repayNum":"4445",
                    "repayType":"电话催收",
                    "repayNote":"还款无压力，无敌是多么寂寞",
                    "agent":'凌心敏',
                    "replayFlag":"未回复"
                },
                {
                    "id":7,
                    "caseFlag":"招商",
                    "cardHolder":"魏占",
                    "idNumber":"210423198012170819",
                    "replyDate":"2019-05-08",
                    "repayDate":"2019-05-08",
                    "repayNum":"4445",
                    "repayType":"电话催收",
                    "repayNote":"还款无压力，无敌是多么寂寞",
                    "agent":'凌心敏',
                    "replayFlag":"未回复"
                },
                {
                    "id":8,
                    "caseFlag":"招商",
                    "cardHolder":"魏占",
                    "idNumber":"210423198012170819",
                    "replyDate":"2019-05-08",
                    "repayDate":"2019-05-08",
                    "repayNum":"4445",
                    "repayType":"电话催收",
                    "repayNote":"还款无压力，无敌是多么寂寞",
                    "agent":'凌心敏',
                    "replayFlag":"未回复"
                },
                {
                    "id":9,
                    "caseFlag":"招商",
                    "cardHolder":"魏占",
                    "idNumber":"210423198012170819",
                    "replyDate":"2019-05-08",
                    "repayDate":"2019-05-08",
                    "repayNum":"4445",
                    "repayType":"电话催收",
                    "repayNote":"还款无压力，无敌是多么寂寞",
                    "agent":'凌心敏',
                    "replayFlag":"未回复"
                },
                {
                    "id":10,
                    "caseFlag":"招商",
                    "cardHolder":"魏占",
                    "idNumber":"210423198012170819",
                    "replyDate":"2019-05-08",
                    "repayDate":"2019-05-08",
                    "repayNum":"4445",
                    "repayType":"电话催收",
                    "repayNote":"还款无压力，无敌是多么寂寞",
                    "agent":'凌心敏',
                    "replayFlag":"未回复"
                }
            ],
            managecardHolder:"魏占",
            manageidNumber:"210423198012170819",
            managenote:"",
            dateRange:"",
            nameOrPhone:"",
            caseFlag:"",
            replayFlag:"",
            typeSelect:'是',
            currentPage:1,
            sendLetterVisible:false,
            dialog_expot:false,
            options:[
                {
                    value:1,
                    label:'是'
                },
                {
                    value:2,
                    label:'否'
                }
            ],
        };
    },
    methods:{
         handleSizeChange(val){
            console.log(`每页：${val}`) 
        },
        handlecurrentChange(val){
            console.log(`当前页：${val}`)
        },
    }
}
</script>
<style scoped>
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
    padding-right: 15px;
    padding-bottom:10px;

}
#pagination{
    margin-top:20px;
}  
.text-line{
    text-decoration: underline;
    cursor: pointer;
}
.mar-bom10{
    margin-bottom: 10px;
}
.pickerWid{
    width:220px!important;
}
.mar-lft{margin-left:15px }
.dialogStyle{margin-top: 20px}
.dialogStyle span{display: inline-block;width: 70px;text-align: right;vertical-align: top}
.dialogStyle .el-col{margin-bottom: 15px;}
</style>

