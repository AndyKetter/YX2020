<template>
   <div class="page-content container-fluid">
       <div class="mar-bom10">首页：综合评分><a class="text-line" @click="toFrontPage">总案件信息统计</a></div>
        <el-row :gutter="15">
            <el-col :span="12">
                <div class="grid-content alCase_box">
                    <h5 class="panel-title">
                        <b>总案件量统计</b>
                        <el-date-picker v-model="dateRange1" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" class="pull-right mar-top8"></el-date-picker>
                    </h5>
                    <div id="alCase_chart1"></div>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content alCase_box">
                    <h5 class="panel-title">
                        <b>抢案状态统计</b>
                        <el-date-picker v-model="dateRange2" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" class="pull-right mar-top8"></el-date-picker>
                    </h5>
                    <div id="alCase_chart2"></div>
                </div>
            </el-col>          
        </el-row>
        <el-row :gutter="15">
            <el-col :span="12">
                <div class="grid-content alCase_box">
                    <h5 class="panel-title">
                        <b>城市分布案件情况统计</b>
                        <el-date-picker v-model="dateRange3" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" class="pull-right mar-top8"></el-date-picker>
                    </h5>
                    <div class="table_wrap" style="padding:15px 20px">
                        <el-table :data="tableData" border :header-cell-style="{backgroundColor:'#e5e9f3'}" style="width:100%" max-height="328">
                            <el-table-column prop="changeCity" label="调整城市"></el-table-column>
                            <el-table-column prop="caseAmount" label="单量"></el-table-column>
                            <el-table-column prop="moneySum" label="委托金额合计"></el-table-column>                               
                            <el-table-column prop="payed" label="已还金额"></el-table-column>                        
                        </el-table>
                    </div>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content alCase_box">
                    <h5 class="panel-title">
                        <b>委托金额统计</b>
                        <el-date-picker v-model="dateRange4" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" class="pull-right mar-top8"></el-date-picker>
                    </h5>
                    <div class="table_wrap" style="padding:15px 20px">
                        <el-table :data="tableData2" border :header-cell-style="{backgroundColor:'#e5e9f3'}" style="width:100%" max-height="328" >
                            <el-table-column prop="changeCity" label="金额（万元）"></el-table-column>
                            <el-table-column prop="caseAmount2" label="单量"></el-table-column>
                            <el-table-column prop="moneySum2" label="委托金额合计"></el-table-column>                               
                            <el-table-column prop="payed2" label="已还金额"></el-table-column>                        
                        </el-table>
                    </div>
                </div>
            </el-col>        
        </el-row>
    </div>
</template>
<script>
import myMixin from '../libs/js/mixin.js' //导入mixin修复page-content全屏功能
export default {
    name:'AlCase',
    mixins:[myMixin],
    data(){
        return{
            dateRange1:"",
            dateRange2:"",
            dateRange3:"",
            dateRange4:"",
             tableData:[{
                 "changeCity":"长沙",
                 "caseAmount":"10589",
                 "moneySum":"456,235.23",
                 "payed":"125,878.56"
             },
             {
                 "changeCity":"武汉",
                 "caseAmount":"10589",
                 "moneySum":"456,235.23",
                 "payed":"125,878.56"
             },
             {
                 "changeCity":"南昌",
                 "caseAmount":"10589",
                 "moneySum":"456,235.23",
                 "payed":"125,878.56"
             },
             {
                 "changeCity":"南京",
                 "caseAmount":"10589",
                 "moneySum":"456,235.23",
                 "payed":"125,878.56"
             },
             {
                 "changeCity":"福州",
                 "caseAmount":"10589",
                 "moneySum":"456,235.23",
                 "payed":"125,878.56"
             },
             {
                 "changeCity":"娄底",
                 "caseAmount":"10589",
                 "moneySum":"456,235.23",
                 "payed":"125,878.56"
             },
             {
                 "changeCity":"岳阳",
                 "caseAmount":"10589",
                 "moneySum":"456,235.23",
                 "payed":"125,878.56"
             },
             {
                 "changeCity":"长沙",
                 "caseAmount":"10589",
                 "moneySum":"456,235.23",
                 "payed":"125,878.56"
             }
             ],
              tableData2:[{
                 "changeCity":"892,233.56",
                 "caseAmount2":"10589",
                 "moneySum2":"456,235.23",
                 "payed2":"125,878.56"
              },
              {
                 "changeCity":"892,233.56",
                 "caseAmount2":"10589",
                 "moneySum2":"456,235.23",
                 "payed2":"125,878.56"
              },
              {
                 "changeCity":"892,233.56",
                 "caseAmount2":"10589",
                 "moneySum2":"456,235.23",
                 "payed2":"125,878.56"
              },
              {
                 "changeCity":"892,233.56",
                 "caseAmount2":"10589",
                 "moneySum2":"456,235.23",
                 "payed2":"125,878.56"
              },
              {
                 "changeCity":"892,233.56",
                 "caseAmount2":"10589",
                 "moneySum2":"456,235.23",
                 "payed2":"125,878.56"
              },
              {
                 "changeCity":"892,233.56",
                 "caseAmount2":"10589",
                 "moneySum2":"456,235.23",
                 "payed2":"125,878.56"
              },
              {
                 "changeCity":"892,233.56",
                 "caseAmount2":"10589",
                 "moneySum2":"456,235.23",
                 "payed2":"125,878.56"
              },
              {
                 "changeCity":"892,233.56",
                 "caseAmount2":"10589",
                 "moneySum2":"456,235.23",
                 "payed2":"125,878.56"
              }
              ]
        }
    },
    methods:{
        drawEchars(){
            let alCase_chart1 = this.$echarts.init(document.getElementById('alCase_chart1'));
            let option1 = {
            tooltip:{
                trigger:'item',
                formatter:"{a}</br>{b}:{c}({d}%)"
            },
            legend:{
                orient:'vertical',
                left:'left',
                data:['回款金额','委托金额']
            },
            series:[
                {
                    name:'总案件量统计',
                    type:'pie',
                    radius:'50%',
                    center:['50%','60%'],
                    data:[
                        {value:2008976.23,name:'回款金额'},
                        {value:4567145.56,name:'委托金额'}
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
        alCase_chart1.setOption(option1);

        let alCase_chart2 = this.$echarts.init(document.getElementById('alCase_chart2'));
            let option2 = {
            tooltip:{
                trigger:'item',
                formatter:"{a}</br>{b}:{c}({d}%)"
            },
            legend:{
                orient:'vertical',
                left:'left',
                data:['已抢已批','已抢待批','未抢案件']
            },
            series:[
                {
                    name:'总案件量统计',
                    type:'pie',
                    radius:'50%',
                    center:['50%','60%'],
                    data:[
                        {value:0,name:'已抢已批'},
                        {value:0,name:'已抢待批'},
                        {value:0,name:'未抢案件'}
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
            color:['#1fcf87','#2e76ee','#e6a23c']
        }
        alCase_chart2.setOption(option2);
        },
        toFrontPage(){
         let routerDetails = this.$router.resolve({
                path:`/home/reports/ReportsIndex`
            })
            window.open(routerDetails.href,'_self')
    }
    },
    mounted() {
        this.drawEchars()
    }
}
</script>
<style scoped>
    .alCase_box{
        height: 432px;
        background-color:#fff;
    }

    .el-row{
        margin-bottom:15px;     
    }

    .panel-title{
        border-bottom:1px solid #e7e7e7;
        padding: 0 20px;
        height: 50px;
        line-height: 50px;
    }

    .mar-top8{
        margin-top:8px;
        width: 240px !important;
    }

    #alCase_chart1,#alCase_chart2 {
    height: 350px;
    color:#24282f;
    padding: 20px;
    }

    .mar-bom10{
        margin-bottom:10px;
    }

    .text-line{
        text-decoration: underline;
        cursor: pointer;
}

</style>

