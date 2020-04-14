<template>
    <div class="page-content container-fluid">
        <div class="main">
            <div class="row">
                <div class="col-md-5">
                    <div class="modules">
                        <h4>总案件信息统计
                            <el-date-picker class="pull-right" style="width:225px" v-model="allCaseTime" type="monthrange" range-separator="-" start-placeholder="开始月份" end-placeholder="结束月份"></el-date-picker>
                        </h4>
                        <!-- <div class="search_time clearfix">
                            <div class="pull-right clearfix">                               
                                 <el-button type="primary" icon="el-icon-search">搜索</el-button> 
                            </div>
                        </div> -->
                        <div id="echars1"></div>
                        <el-button plain class="btn" style="width:40%;margin-top:10px" @click="toAlCase">查看详情</el-button>
                    </div>
                </div>
                <div class="col-md-7">
                    <div class="modules">
                        <h4>工作统计记录
                            <el-date-picker class="pull-right" style="width:273px" v-model="recordTime" type="daterange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
                        </h4>
                        
                        <div id="echars2"></div>
                        <el-button plain class="btn" style="width:30%;margin-top:10px" @click="toStWork">查看详情</el-button>
                    </div>
                </div>
            </div>
            <div class="row mar-top">
                <div class="col-md-5">
                    <div class="modules">
                        <div class="clearfix">
                            <h4 class="pull-left">每日未到账业绩</h4>
                            <div class="pull-right allAmount">
                                <span>总金额：</span>
                                <span class="sunYColor">56,200.00</span>
                            </div>
                        </div>
                        <div class="data_table">
                            <el-table :data="tableData" border :header-cell-style="{backgroundColor:'#e5e9f3'}" style="width:100%" max-height="328">
                                <el-table-column prop="businessType" label="业务类型"></el-table-column>
                                <el-table-column prop="cardHolder" label="持卡人"></el-table-column>
                                <el-table-column prop="idCard" label="身份证" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column label="经办人">
                                     <template slot-scope="scope">
                                        <el-popover trigger="hover" placement="top">
                                            <p><b>女/在职&nbsp;&nbsp;186****9988</b>&nbsp;<img src="../images/call.png" alt=""></p>
                                            <p><span  class="workNum">工</span>号：8170823003</p>
                                            <p>所属职位：资产管理员-部长</p>
                                            <p>隶属单位：长沙分公司-业务部</p>
                                            <p>组织关系：谭曼-陈军-{{scope.row.agent}}</p>
                                            <div slot="reference" class="name-wrapper">
                                            <el-button size="mini">{{scope.row.agent}}</el-button>
                                            </div>
                                        </el-popover>                           
                            </template>
                                </el-table-column>
                                <el-table-column prop="notAmount" label="未到账金额"></el-table-column>
                                <el-table-column prop="repayDate" label="还款日期"></el-table-column>
                            </el-table>
                        </div>
                            <el-button plain class="btn" @click="toDailyBill" style="width:40%;margin-top:16px">查看详情</el-button>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="modules">
                        <h4 style="margin-bottom:40px">在案案件数量金额统计</h4>
                        <!-- <div class="search_time clearfix">
                            <div class="pull-right clearfix">
                                <el-date-picker style="margin-right:15px;width:140px" v-model="caseTimeSearch" type="date" placeholder="选择日期"></el-date-picker>
                                <el-button type="primary" icon="el-icon-search">搜索</el-button>
                            </div>
                        </div> -->

                        <!-- <div id="echars3"></div> -->
                        <div id="echars3" >
                            <el-row style="height:316px">
                                <el-col :lg="24" :xl="12" class="padt20 padb20">
                                    <el-row >
                                        <el-col :span="6">
                                            <div><img src="../images/icon1.png" alt=""></div>
                                        </el-col>
                                        <el-col :span="18">
                                            <p class="num">12,614</p>
                                            <p class="txt">在职人数</p>
                                        </el-col>
                                    </el-row>
                                </el-col>
                                <el-col :lg="24" :xl="12" class="padt20 padb20">
                                    <el-row >
                                        <el-col :span="6">
                                            <div><img src="../images/icon2.png" alt=""></div>
                                        </el-col>
                                        <el-col :span="18">
                                            <p class="num">52,614</p>
                                            <p>在案案件数量</p>
                                        </el-col>
                                    </el-row>
                                </el-col>
                                <el-col :lg="24" :xl="12" class="padt20 padb20">
                                    <el-row >
                                        <el-col :span="6">
                                            <div><img src="../images/icon3.png" alt=""></div>
                                        </el-col>
                                        <el-col :span="18">
                                            <p class="num">126.00k</p>
                                            <p>在案委托金额</p>
                                        </el-col>
                                    </el-row>
                                </el-col>
                                
                            </el-row>
                            <el-button plain class="btn" @click="toAmountCount" style="width:40%;margin-top:10px">查看详情</el-button>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="modules">
                        <h4>案件跟进进度情况
                            <el-date-picker class="pull-right" style="width:120px" v-model="followTimeSearch" type="date" placeholder="选择日期"></el-date-picker>
                        </h4>                     
                        <div id="echars4"></div>
                        <el-button plain class="btn" @click="toCaseProgress" style="width:40%;margin-top:5px">查看详情</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import myMixin from '../libs/js/mixin.js' //导入mixin修复page-content全屏功能
export default {
    name:'ReportsIndex',
    mixins:[myMixin],
    data() {
        return {
            allCaseTime:"",
            timeSearch:"",
            followTimeSearch:"",
            caseTimeSearch:"",
            recordTime:"",
            tableData:[
                {
                    "businessType":"业务类型",
                    "cardHolder":"彭坤",
                    "idCard":"342000000000000000",
                    "agent":"朱新桃",
                    "notAmount":"123,30.00",
                    "repayDate":"2019-3-25"
                },
                {
                    "businessType":"业务类型",
                    "cardHolder":"彭坤",
                    "idCard":"342000000000000000",
                    "agent":"朱新桃",
                    "notAmount":"123,30.00",
                    "repayDate":"2019-3-25"
                },
                {
                    "businessType":"业务类型",
                    "cardHolder":"彭坤",
                    "idCard":"342000000000000000",
                    "agent":"朱新桃",
                    "notAmount":"123,30.00",
                    "repayDate":"2019-3-25"
                },
                {
                    "businessType":"业务类型",
                    "cardHolder":"彭坤",
                    "idCard":"342000000000000000",
                    "agent":"朱新桃",
                    "notAmount":"123,30.00",
                    "repayDate":"2019-3-25"
                },
                {
                    "businessType":"业务类型",
                    "cardHolder":"彭坤",
                    "idCard":"342000000000000000",
                    "agent":"朱新桃",
                    "notAmount":"123,30.00",
                    "repayDate":"2019-3-25"
                },
                {
                    "businessType":"业务类型",
                    "cardHolder":"彭坤",
                    "idCard":"342000000000000000",
                    "agent":"朱新桃",
                    "notAmount":"123,30.00",
                    "repayDate":"2019-3-25"
                },
                {
                    "businessType":"业务类型",
                    "cardHolder":"彭坤",
                    "idCard":"342000000000000000",
                    "agent":"朱新桃",
                    "notAmount":"123,30.00",
                    "repayDate":"2019-3-25"
                },
                {
                    "businessType":"业务类型",
                    "cardHolder":"彭坤",
                    "idCard":"342000000000000000",
                    "agent":"朱新桃",
                    "notAmount":"123,30.00",
                    "repayDate":"2019-3-25"
                },
                {
                    "businessType":"业务类型",
                    "cardHolder":"彭坤",
                    "idCard":"342000000000000000",
                    "agent":"朱新桃",
                    "notAmount":"123,30.00",
                    "repayDate":"2019-3-25"
                },
                {
                    "businessType":"业务类型",
                    "cardHolder":"彭坤",
                    "idCard":"342000000000000000",
                    "agent":"朱新桃",
                    "notAmount":"123,30.00",
                    "repayDate":"2019-3-25"
                },
                {
                    "businessType":"业务类型",
                    "cardHolder":"彭坤",
                    "idCard":"342000000000000000",
                    "agent":"朱新桃",
                    "notAmount":"123,30.00",
                    "repayDate":"2019-3-25"
                }
            ]
        }
    },
    methods:{      
        drawEchars(){
            //echars图表
        let myChart1 = this.$echarts.init(document.getElementById('echars1'));//总案件信息统计
        let option1 = {
            tooltip:{
                trigger:'item',
                formatter:"{a}</br>{b}:{c}({d}%)"
            },
            legend:{
                orient:'vertical',
                left:'left',
                data:['回款','委托金额']
            },
            series:[
                {
                    name:'访问来源',
                    type:'pie',
                    radius:'55%',
                    center:['50%','60%'],
                    data:[
                        {value:20,name:'回款'},
                        {value:80,name:'委托金额'}
                    ],
                    itemStyle:{
                        emphasis:{
                            shadowBlur:10,
                            shadowOffsetX:0,
                            shadowColor:'rgba(0,0,0,0.5)'
                        }
                    }
                }
            ],
            color:['#1fcf87','#2e76ee']
        }
        myChart1.setOption(option1);

        let myChart2 = this.$echarts.init(document.getElementById('echars2'));//工作统计记录
        let option2 = {
            tooltip:{
                trigger:'axis'
            },
            legend:{
                x:'50px',
                data:['电话通数','有效通话时长（单位/时）','工作记录条数']
            },
            grid:{
                left:'3%',
                right:'4%',
                bottom:'3%',
                containLabel:true
            },
            xAxis:{
                type:'category',
                boundaryGap:false,
                data:['0401','0402','0403','0404','0405','0406','0407','0408','0409','0410','0411','0412','0413','0414','0415','0416','0417','0418','0419','0420','0421','0422','0423','0424','0425','0426','0427','0428','0429']
            },
            yAxis:{
                name:'',
                type:'value'
            },
            series:[
                {
                    name:'电话通数',
                    type:'line',
                    strack:'工作记录',
                    data:[15,18,20,15,19,17,18,22,25,22,26,28,18,22,25,22,26,28,15,18,20,15,19,17,18,22,25,22]
                },
                {
                    name:'有效通话时长（单位/时）',
                    type:'line',
                    strack:'工作记录',
                    data:[11,12,11,14,16,19,11,18,19,20,19,22,11,18,19,20,19,22,12,11,14,16,19,11,18,19,20,19]
                },
                {
                    name:'工作记录条数',
                    type:'line',
                    strack:'工作记录',
                    data:[11,19,20,19,22,12,11,14,16,19,11,18,11,14,16,19,11,18,19,20,19,22,12,11,14,16,19,11]
                }
            ],
            color:['#1fcf87','#2e76ee','#ff5353']
        }
        myChart2.setOption(option2);


        let myChart4 = this.$echarts.init(document.getElementById('echars4'));//案件跟进进度情况
        let option4 = {
            tooltip:{
                trigger:'axis',
                axisPointer:{
                    type:'line'
                }
            },
            xAxis:{
                type:'category',
                data:['三天未跟进','七天未跟进','三十天未跟进']
            },
            yAxis:{
                type:'value'
            },
            series:[{
                name:'案件件数',
                data:[40,50,60],
                type:'bar',
                    itemStyle:{
                        normal:{
                            color:function(params){
                                var colorList = [
                                    '#2e76ee','#e6a23c','#ff5353'
                                ];
                                return colorList[params.dataIndex];
                            },
                            label:{
                                show:true,
                                position:'top'
                            }
                        }
                    }
            }]
        }
        // let option4 = {
        //     xAxis:{
        //         type:'category',
        //         data:['三天未跟进','七天未跟进','三十天未跟进']
        //     },
        //     yAxis:{
        //         type:'value'
        //     },
        //     series:[{
        //         data:[40,50,60],
        //         type:'bar',
        //             itemStyle:{
        //                 normal:{
        //                     color:function(params){
        //                         var colorList = [
        //                             '#2e76ee','#e6a23c','#ff5353'
        //                         ];
        //                         return colorList[params.dataIndex];
        //                     }
        //                 }
        //             }
        //     }]
        // }
        myChart4.setOption(option4);

        // let myChart3 = this.$echarts.init(document.getElementById('echars3'));
        // let option3 = {
        //     xAxis:{
        //         type:'category',
        //         data:['案件数','委托金额','回款金额']
        //     },
        //     yAxis:{
        //         type:'value'
        //     },
        //     series:[{
        //         data:[2000,15000,16000],
        //         type:'bar',
        //             itemStyle:{
        //                 normal:{
        //                     color:function(params){
        //                         var colorList = [
        //                             '#2e76ee','#e6a23c','#1fcf87'
        //                         ];
        //                         return colorList[params.dataIndex];
        //                     }
        //                 }
        //             }
        //     }]
        // }
        // myChart3.setOption(option3);
        },
        toAmountCount(){
            let routerDetails = this.$router.resolve({
                path: `/home/reports/amountCount`
            })
            window.open(routerDetails.href,'_blank') //新开路由在案案件数量金额统计详情页面 
        },
        toAlCase(){
            let routerDetails = this.$router.resolve({
                path: `/home/reports/AlCase`
            })
            window.open(routerDetails.href,'_blank') //总案件信息统计详情页面
        },
        toDailyBill(){
            let routerDetails = this.$router.resolve({
                path:`/home/reports/DailyBill`
            })
            window.open(routerDetails.href,'_blank') //每日未到账业绩
        },
        toStWork(){
            let routerDetails = this.$router.resolve({
                path:`/home/reports/StWork`
            })
            window.open(routerDetails.href,'_blank') //工作记录统计
        },
        toCaseProgress(){
            let routerDetails = this.$router.resolve({
                path:`/home/reports/CaseProgress`
            })
            window.open(routerDetails.href,'_blank') //案件跟进进度情况
        }

    },
    mounted() {
        this.drawEchars()
    }
}
</script>

<style>
    .data_table div{
        text-align: center !important;
    }
</style>

<style scoped>
.el-input{
    width:180px;
}
/* scoped是表明未局部css样式，没写scoped就是全局css样式 */
.table tr{
    cursor: pointer;
}
.modules{
    background-color: #fff;
    height: 450px;
    padding: 5px 20px;
}
.main>.row>div{
    padding-right: 0px !important;
}
.container-fluid{
    padding-left: 0px;
}
.search_case{
    display: inline-block;
}
.w200{
    width: 160px;
}
.toSize{
    position: relative;
    top: 6px;
}
.allAmount{
    font-size: 16px;
    margin-top: 10px;
}
.sunYColor{
    color: #fe2f2f;
}
.data_table{
    margin-top: 10px;
}
.data_table th,
.data_table td{
    text-align: center;
}

#echars1,
#echars2,
#echars4,
#echars3 {
    height: 350px;
    color:#24282f;
}
#echars3 .num{
    font-size: 25px;
    font-weight:bold;
    margin:0;
}
#echars3 img{
    width:40px;
    margin-top:8px;
}
.padt20{
    padding-top:20px;
}
.padb20{
    padding-bottom:20px;
}

.btn{
    display: block;
    margin: 0 auto;
}
.main > .row{margin-left: 0px;margin-right:0px}
</style>
