<template>
    <div class="page-content">
        <div class="kingRange">
            <div class="col-md-8 echartsBoard pad-rgt" style="padding-left: 0">
                <h4 class="allScore">综合评分</h4>
                <div id="echarsMain"></div>
                <h3 class="myScore">我的排名：第24587名</h3>
            </div>
            <div class="col-md-4" style="padding-right:0">
                <div class="winnerBoard data_table">
                    <h4 class="rangGroup">集团王者榜</h4>
                    <el-table :data="tableData" border style="width:100%" max-height="826">
                        <el-table-column prop="ranking" label="排名">
                            <template slot-scope="scope">
                                <span v-if="scope.$index + 1 == 1" class="rank rank1">{{scope.row.ranking}}</span>
                                <span v-if="scope.$index + 1 == 2" class="rank rank2">{{scope.row.ranking}}</span>
                                <span v-if="scope.$index + 1 == 3" class="rank rank3">{{scope.row.ranking}}</span>
                                <span v-if="scope.row.ranking > 3" class="rankOther">{{scope.row.ranking}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="姓名"></el-table-column>
                        <el-table-column prop="group" label="集团"></el-table-column>
                        <el-table-column prop="business" label="业务"></el-table-column>
                        <el-table-column prop="repayAmount" label="回款金额"></el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import myMixin from '../libs/js/mixin.js' //导入mixin修复page-content全屏功能
export default {
    name:'KingList',
    mixins:[myMixin],
    data () {
        return {
            tableData:[
                {
                    "ranking":1,
                    "name":"彭坤",
                    "group":"开发部",
                    "business":"平安网贷",
                    "repayAmount":"38000"
                },
                {
                    "ranking":2,
                    "name":"彭坤",
                    "group":"开发部",
                    "business":"平安网贷",
                    "repayAmount":"38000"
                },
                {
                    "ranking":3,
                    "name":"彭坤",
                    "group":"开发部",
                    "business":"平安网贷",
                    "repayAmount":"38000"
                },
                {
                    "ranking":4,
                    "name":"彭坤",
                    "group":"开发部",
                    "business":"平安网贷",
                    "repayAmount":"38000"
                },
                {
                    "ranking":5,
                    "name":"彭坤",
                    "group":"开发部",
                    "business":"平安网贷",
                    "repayAmount":"38000"
                },
                {
                    "ranking":6,
                    "name":"彭坤",
                    "group":"开发部",
                    "business":"平安网贷",
                    "repayAmount":"38000"
                },
                {
                    "ranking":7,
                    "name":"彭坤",
                    "group":"开发部",
                    "business":"平安网贷",
                    "repayAmount":"38000"
                },
                {
                    "ranking":8,
                    "name":"彭坤",
                    "group":"开发部",
                    "business":"平安网贷",
                    "repayAmount":"38000"
                },
                {
                    "ranking":9,
                    "name":"彭坤",
                    "group":"开发部",
                    "business":"平安网贷",
                    "repayAmount":"38000"
                },
                {
                    "ranking":10,
                    "name":"彭坤",
                    "group":"开发部",
                    "business":"平安网贷",
                    "repayAmount":"38000"
                },
                {
                    "ranking":11,
                    "name":"彭坤",
                    "group":"开发部",
                    "business":"平安网贷",
                    "repayAmount":"38000"
                },
                {
                    "ranking":12,
                    "name":"彭坤",
                    "group":"开发部",
                    "business":"平安网贷",
                    "repayAmount":"38000"
                },
                {
                    "ranking":13,
                    "name":"彭坤",
                    "group":"开发部",
                    "business":"平安网贷",
                    "repayAmount":"38000"
                },
                {
                    "ranking":14,
                    "name":"彭坤",
                    "group":"开发部",
                    "business":"平安网贷",
                    "repayAmount":"38000"
                },
                {
                    "ranking":15,
                    "name":"彭坤",
                    "group":"开发部",
                    "business":"平安网贷",
                    "repayAmount":"38000"
                },
                {
                    "ranking":16,
                    "name":"彭坤",
                    "group":"开发部",
                    "business":"平安网贷",
                    "repayAmount":"38000"
                }
            ]
        }
    },
    methods:{
        drawEchars(){
            //echars图表
            let myChart = this.$echarts.init(document.getElementById('echarsMain'));
            let option = {
                title:{
                    text:'三月份我的综合评分：90分',
                    x:'center'
                },
                tooltip:{
                    trigger:'item',
                    formatter:"{a}<br/>{b}:{c}({d}%)"
                },
                legend:{
                    orient:'vertical',
                    left:'right',
                    data:['汇款金额(30%)','考勤(25%)','行为扣款(15%)','品质扣分(15%)','工作记录(10%)','通话时长(5%)']
                },
                series:[
                    {
                        name:'访问来源',
                        type:'pie',
                        radius:['50%','70%'],
                        avoidLabelOverlap:false,
                        label:{
                            normal:{
                                show:false,
                                position:'center'
                            },
                            emphasis:{
                                show:true,
                                textStyle:{
                                    fontSize:'30',
                                    fontWeight:'bold'
                                }
                            }
                        },
                        labelLine:{
                            normal:{
                                show:false
                            }
                        },
                        data:[
                            {value:335,name:'汇款金额(30%)'},
                            {value:234,name:'考勤(25%)'},
                            {value:135,name:'行为扣款(15%)'},
                            {value:335,name:'品质扣分(15%)'},
                            {value:335,name:'工作记录(10%)'},
                            {value:1335,name:'通话时长(5%)'}
                        ]
                    }
                ]
            }
            myChart.setOption(option)
        }
    },
    mounted () {
        this.drawEchars()
    }
}
</script>

<style scoped>
    /* scoped是表明未局部css样式，没写scoped就是全局css样式 */
    .winnerBoard{
        background-color: #fff;
        padding: 15px;
    }
    .rank{cursor: pointer;background:url("../images/winnerIco.png") no-repeat;width: 30px;height: 34px;display: inline-block;color: #fff;text-align: center;line-height: 30px;}
    .rank1{background-position: 0px 0px}
    .rank2{background-position: 0px -50px}
    .rank3{background-position: 0px -100px}
    .rankOther{
        display: inline-block;
        width: 30px;
        height: 30px;
        background: #999999;
        border-radius: 50%;
        text-align: center;
        line-height: 30px;
        color: #fff;
        cursor: pointer;
    }
    .allScore{
        border-left: 2px solid rgb(46, 138, 228);
        padding-left: 5px;
    }
    /* 集团王者榜 */
    .rangGroup{
        border-left: 2px solid rgb(46, 138, 228);
        padding-left: 5px;
    }
    /*图表*/
    .echartsBoard{background: #fff;padding: 15px !important;}
    #echarsMain{
        background-color: #fff !important;
        width: 90%;
        height: 750px;
        margin-top: 30px;
    }
    .myScore{
        text-align: center;
        position: relative;
        top: -50px;
    }
</style>
