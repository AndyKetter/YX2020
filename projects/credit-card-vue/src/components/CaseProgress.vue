<template>
<!-- 案件跟进进度情况详情 -->
    <div class="page-content">
        <div class="mar-bom10">首页：<router-link :to="{name:'ReportsIndex'}" class="text-line">统计报表</router-link>&nbsp;>&nbsp;案件跟进进度情况</div>
        <div class="indexWrap row">
            <div class="searchWrap clearfix" >
               <div class="s_types inpt_wrap pull-left">
                    <span class="pull-left">经办人：</span>
                    <el-input class="pull-left" placeholder="请输入"  clearable style="width:100px"></el-input>
                </div>
                <div class="s_types inpt_wrap pull-left">
                    <span class="pull-left">查询类型：</span>
                    <template>
                    <el-select v-model="typeSelect" placeholder=""  style="width:100px">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    </template>
                </div>
                <div class="s_types inpt_wrap pull-left">
                    <span class="pull-left">申请日期：</span>
                    <el-date-picker v-model="dateRange" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" class="pickerWid"></el-date-picker>
                </div>
                <el-button type="primary" icon="el-icon-search">搜索</el-button>
            
                <div class="pull-right">
                    <el-button  @click="dialog_expot=true">导出</el-button>
                </div>

            </div>
            <div class="tableWrap">
                <!-- <div class="el-table-warnning"><b></div> -->
                <template><el-alert  title="温馨提示：系统默认查询到目前为止7天没有跟进的在案案件情况，如需查询其他时间段的，请筛选“开始时间”进行查询。"  type="warning" center :closable="false"></el-alert></template>
                <div class="table_wrap">
                    <el-table :data="tableData" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
                        
                        <el-table-column prop="id" label="序号" ></el-table-column>
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
                        <el-table-column prop="cardHolder" label="持卡人" ></el-table-column>
                        <el-table-column prop="cardid" label="持卡人身份证号" ></el-table-column>
                        <el-table-column prop="creditCard" label="卡号" ></el-table-column>
                        <el-table-column prop="amount" label="委托金额" ></el-table-column>
                        <el-table-column prop="newAmount" label="最新金额" ></el-table-column>
                        <el-table-column prop="bailDate" label="委托日期" ></el-table-column>
                        <el-table-column prop="returnDate" label="退案日期" ></el-table-column>
                        <el-table-column prop="operation" label="查看工作记录" >
                            <template>
                                <el-button type="text" size="small" @click="sendLetterVisible=true">
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
         <!-- 导出弹框 -->
        <el-dialog title="温馨提示" :visible.sync="dialog_expot"  width="500px">
            <div class="mar-bom10">尊敬的管理员，请选择需要导出模板：</div>
            <div>
                <el-radio-group v-model="ships">
                  <el-radio :label="1">在案案件未跟进进度月度统计(可根据按月统计筛选导出)</el-radio>
                  <el-radio :label="2">在案案件未跟进进度情况统计(可根据查询条件筛选导出)</el-radio>
                  <el-radio :label="3">在案案件未跟进进度汇总统计(仅可根据开始时间条件筛选导出)</el-radio> 
                  </el-radio-group>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button  @click="dialog_expot=false">关闭窗口</el-button>
                <el-button type="primary"  @click="dialog_expot=false">确定导出</el-button>
            </span>
        </el-dialog>
        <!-- 查看弹框 -->
        <el-dialog title="查看" :visible.sync="sendLetterVisible" width="900px">
            <div class="searchWrap clearfix">
                <div class="s_types  pull-left">
                    <span style="margin-left:0">持卡人：</span>
                    <el-input v-model="holdername" :disabled="true" style="width:100px"></el-input>
                </div>
                <div class="s_types  pull-left">
                    <span>当前经办人：</span>
                    <el-input v-model="agentname" :disabled="true" style="width:100px"></el-input>
                </div>
            </div> 
            <div class="table_wrap">
                <el-table :data="totalRecordTData" :header-cell-style="{backgroundColor:'#e5e9f3'}" border style="width:100%" max-height="400">           
                    <el-table-column prop="rowNum" label="序号" min-width="80px"></el-table-column>
                    <el-table-column prop="type" label="催收类型" min-width="120px"></el-table-column>
                    <el-table-column prop="cont" label="工作记录内容" min-width="300px" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="subTime" label="提交时间" min-width="120px"></el-table-column>
                    <el-table-column label="提交人" min-width="80px">
                        <template slot-scope="scope">
                            <el-popover trigger="hover" placement="top">
                                <p><b>男/在职&nbsp;&nbsp;186****4488</b>&nbsp;<img src="../images/call.png"  alt=""></p>
                                    <p>所属职位：资产管理员-部长</p>
                                    <p>隶属单位：长沙分公司-业务部</p>
                                    <p>组织关系：谭曼-陈军-李永杰-{{scope.row.agentname2}}</p>
                                    <div slot="reference" class="name-wrapper">
                                    <el-button size="mini">{{scope.row.agentname2}}</el-button>
                                    </div>
                            </el-popover>
                        </template>
                    </el-table-column> 
                </el-table>         
            </div>
        </el-dialog>
    </div>
</template>
<script>
import myMixin from '../libs/js/mixin.js' //导入mixin修复page-content全屏功能
export default {
    name:'CaseProgress',
    mixins:[myMixin],
    data() {
        return {
            tableData:[
                {
                    "id":1,
                    "agent":"凌心敏",
                    "cardHolder":'魏占',
                    "cardid":"330328199110063417",
                    "creditCard":'6226800034059038',
                    "amount":'15,621',
                    "newAmount":'6859.92',
                    "bailDate":'2019-04-11 00:00:00',
                    "returnDate":'2019-04-11 00:00:00'
                },
                {
                    "id":2,
                    "agent":"凌心敏",
                    "cardHolder":'魏占',
                    "cardid":"330328199110063417",
                    "creditCard":'6226800034059038',
                    "amount":'15,621',
                    "newAmount":'6859.92',
                    "bailDate":'2019-04-11 00:00:00',
                    "returnDate":'2019-04-11 00:00:00'
                },
                {
                    "id":3,
                    "agent":"凌心敏",
                    "cardHolder":'魏占',
                    "cardid":"330328199110063417",
                    "creditCard":'6226800034059038',
                    "amount":'15,621',
                    "newAmount":'6859.92',
                    "bailDate":'2019-04-11 00:00:00',
                    "returnDate":'2019-04-11 00:00:00'
                },
                {
                    "id":4,
                    "agent":"凌心敏",
                    "cardHolder":'魏占',
                    "cardid":"330328199110063417",
                    "creditCard":'6226800034059038',
                    "amount":'15,621',
                    "newAmount":'6859.92',
                    "bailDate":'2019-04-11 00:00:00',
                    "returnDate":'2019-04-11 00:00:00'
                },
                {
                    "id":5,
                    "agent":"凌心敏",
                    "cardHolder":'魏占',
                    "cardid":"330328199110063417",
                    "creditCard":'6226800034059038',
                    "amount":'15,621',
                    "newAmount":'6859.92',
                    "bailDate":'2019-04-11 00:00:00',
                    "returnDate":'2019-04-11 00:00:00'
                },
                {
                    "id":6,
                    "agent":"凌心敏",
                    "cardHolder":'魏占',
                    "cardid":"330328199110063417",
                    "creditCard":'6226800034059038',
                    "amount":'15,621',
                    "newAmount":'6859.92',
                    "bailDate":'2019-04-11 00:00:00',
                    "returnDate":'2019-04-11 00:00:00'
                },
                {
                    "id":7,
                    "agent":"凌心敏",
                    "cardHolder":'魏占',
                    "cardid":"330328199110063417",
                    "creditCard":'6226800034059038',
                    "amount":'15,621',
                    "newAmount":'6859.92',
                    "bailDate":'2019-04-11 00:00:00',
                    "returnDate":'2019-04-11 00:00:00'
                },
                {
                    "id":8,
                    "agent":"凌心敏",
                    "cardHolder":'魏占',
                    "cardid":"330328199110063417",
                    "creditCard":'6226800034059038',
                    "amount":'15,621',
                    "newAmount":'6859.92',
                    "bailDate":'2019-04-11 00:00:00',
                    "returnDate":'2019-04-11 00:00:00'
                },
                {
                    "id":9,
                    "agent":"凌心敏",
                    "cardHolder":'魏占',
                    "cardid":"330328199110063417",
                    "creditCard":'6226800034059038',
                    "amount":'15,621',
                    "newAmount":'6859.92',
                    "bailDate":'2019-04-11 00:00:00',
                    "returnDate":'2019-04-11 00:00:00'
                },
                {
                    "id":10,
                    "agent":"凌心敏",
                    "cardHolder":'魏占',
                    "cardid":"330328199110063417",
                    "creditCard":'6226800034059038',
                    "amount":'15,621',
                    "newAmount":'6859.92',
                    "bailDate":'2019-04-11 00:00:00',
                    "returnDate":'2019-04-11 00:00:00'
                },
            ],
            totalRecordTData:[
                {
                    "rowNum":"1",
                    "type":"平安8手",
                    "cont":"工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录",
                    "subTime":"2019-05-11",
                    "agentname2":"凌心敏",
                },{
                    "rowNum":"2",
                    "type":"平安8手",
                    "cont":"工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录",
                    "subTime":"2019-05-11",
                    "agentname2":"凌心敏",
                },{
                    "rowNum":"3",
                    "type":"平安8手",
                    "cont":"工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录",
                    "subTime":"2019-05-11",
                    "agentname2":"凌心敏",
                },{
                    "rowNum":"4",
                    "type":"平安8手",
                    "cont":"工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录",
                    "subTime":"2019-05-11",
                    "agentname2":"凌心敏",
                },{
                    "rowNum":"5",
                    "type":"平安8手",
                    "cont":"工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录",
                    "subTime":"2019-05-11",
                    "agentname2":"凌心敏",
                },{
                    "rowNum":"6",
                    "type":"平安8手",
                    "cont":"工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录",
                    "subTime":"2019-05-11",
                    "agentname2":"凌心敏",
                },{
                    "rowNum":"7",
                    "type":"平安8手",
                    "cont":"工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录",
                    "subTime":"2019-05-11",
                    "agentname2":"凌心敏",
                },{
                    "rowNum":"8",
                    "type":"平安8手",
                    "cont":"工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录",
                    "subTime":"2019-05-11",
                    "agentname2":"凌心敏",
                },{
                    "rowNum":"9",
                    "type":"平安8手",
                    "cont":"工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录",
                    "subTime":"2019-05-11",
                    "agentname2":"凌心敏",
                },{
                    "rowNum":"10",
                    "type":"平安8手",
                    "cont":"工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录",
                    "subTime":"2019-05-11",
                    "agentname2":"凌心敏",
                },{
                    "rowNum":"11",
                    "type":"平安8手",
                    "cont":"工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录",
                    "subTime":"2019-05-11",
                    "agentname2":"凌心敏",
                }
            ],
            typeSelect:'按天统计',
            currentPage:1,
            ships:"",
            dialog_expot:false,
            sendLetterVisible:false,
            holdername:"刘晓彬",
            agentname:"凌心敏",
            dateRange:"",
            options:[
                {
                    value:1,
                    label:'按天统计'
                },
                {
                    value:2,
                    label:'按月统计'
                }
            ]
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
    padding-right: 20px;
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
.el-radio{margin-bottom: 10px}
</style>

