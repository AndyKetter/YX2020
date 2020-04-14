<template>
    <div class="page-content">
        <div class="headerKing clearfix">
            <div class="clearfix pull-left">
                <el-tooltip class="patch-tooltilp" placement="bottom-start">
                     <div slot="content" class="patch-div">
                        <i class="el-icon-question patch-icon"></i>&nbsp;回款金额全国榜单
                    </div>
                    <div class="pull-left kingType active">全国榜</div>
                </el-tooltip>
                <el-tooltip class="patch-tooltilp" placement="bottom-start">
                     <div slot="content" class="patch-div">
                        <i class="el-icon-question patch-icon"></i>&nbsp;回款金额分公司榜单
                    </div>
                    <div class="pull-left kingType">分公司榜</div>
                </el-tooltip>
                <el-tooltip class="patch-tooltilp" placement="bottom-start">
                     <div slot="content" class="patch-div">
                        <i class="el-icon-question patch-icon"></i>&nbsp;回款金额集团榜单
                    </div>
                    <div class="pull-left kingType">集团榜</div>
                </el-tooltip>
            </div>
            <div class="clearfix pull-right">
                <div class="pull-right typeSelect">
                    <el-select v-model="typeSelect" placeholder="业务类型">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </div>
                <el-tooltip class="patch-tooltilp" placement="bottom-start">
                     <div slot="content" class="patch-div">
                        <i class="el-icon-question patch-icon"></i>&nbsp;同业务类型年回款金额前三强
                    </div>
                    <div class="pull-right kingType">年榜</div>
                </el-tooltip>
                <el-tooltip class="patch-tooltilp" placement="bottom-start">
                     <div slot="content" class="patch-div">
                        <i class="el-icon-question patch-icon"></i>&nbsp;同业务类型季度回款金额前三强
                    </div>
                    <div class="pull-right kingType">季度榜</div>
                </el-tooltip>
                <el-tooltip class="patch-tooltilp" placement="bottom-start">
                     <div slot="content" class="patch-div">
                        <i class="el-icon-question patch-icon"></i>&nbsp;同业务类型月回款金额前三强
                    </div>
                    <div class="pull-right kingType">月榜</div>
                </el-tooltip>
                <el-tooltip class="patch-tooltilp" placement="bottom-start">
                     <div slot="content" class="patch-div">
                        <i class="el-icon-question patch-icon"></i>&nbsp;同业务类型日回款金额前三强
                    </div>
                    <div class="pull-right kingType active">日榜</div>
                </el-tooltip>
            </div>
        </div>

        <div class="kingRange">
            <div class="col-md-4 pad-rgt" style="padding-left: 0">
                <div class="winnerBoard data_table">
                    <el-table :data="tableData" border :header-cell-style="{backgroundColor:'#e5e9f3'}" style="width:100%">
                        <el-table-column prop="ranking" label="排名">
                            <template slot-scope="scope">
                                <span v-if="scope.$index + 1 == 1" class="rank rank1">{{scope.row.ranking}}</span>
                                <span v-if="scope.$index + 1 == 2" class="rank rank2">{{scope.row.ranking}}</span>
                                <span v-if="scope.$index + 1 == 3" class="rank rank3">{{scope.row.ranking}}</span>
                                <span v-if="scope.row.ranking > 3" class="rankOther">{{scope.row.ranking}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="姓名">
                             <template slot-scope="scope">
                                <el-popover trigger="hover" placement="top">
                                    <p><b>男/在职&nbsp;&nbsp;186****4488</b>&nbsp;<img src="../images/call.png" alt=""></p>
                                    <p><span  class="workNum">工</span>号：8170823003</p>
                                    <p>所属职位：资产管理员-部长</p>
                                    <p>隶属单位：长沙分公司-业务部</p>
                                    <p>组织关系：谭曼-陈军-李永杰-{{scope.row.name}}</p>
                                    <div slot="reference" class="name-wrapper">
                                    <el-button size="mini" >{{scope.row.name}}</el-button>
                                    </div>
                                </el-popover>
                            
                            </template> 
                        </el-table-column>
                        <el-table-column prop="group">
                            <template slot="header">
                                <select class="form-control" v-model="departmentFlag">
                                    <option value disabled selected style="display:none">集团</option>
                                    <option value="all">全部</option>
                                    <option value="1">陈军</option>
                                    <option value="2">李克臣</option>
                                    <option value="3">谢宇</option>
                                    <option value="4">程祖芬</option>
                                    <option value="5">赵业</option>
                                </select>
                            </template>
                        </el-table-column>
                        <el-table-column prop="business" label="业务">
                        </el-table-column>
                        <el-table-column prop="repayAmount" label="回款金额"></el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="col-md-8 winnerThree mar-btm">
                <div class="threeList">
                    <div class="winnerList">
                        <span class="firstName mar-rgt">凌</span>
                        <div class="winnerDetail">
                            <h2>亚军</h2>
                            <p class="winnerName">凌心敏</p>
                            <p title="工号8190308009">8190308009</p>
                            <label>37,500.00</label>
                        </div>
                    </div>
                    <div class="winnerList">
                        <span class="firstName mar-rgt">汤</span>
                        <div class="winnerDetail">
                            <h2>冠军</h2>
                            <p class="winnerName">汤宽心</p>
                            <p title="工号8190308009">8190308009</p>
                            <label>38,000.00</label>
                        </div>
                    </div>
                    <div class="winnerList">
                        <span class="firstName mar-rgt">张</span>
                        <div class="winnerDetail">
                            <h2>季军</h2>
                            <p class="winnerName">张文娟</p>
                            <p title="工号8190308009">8190308009</p>
                            <label>37,000.00</label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-8" style="background:#fff">
                <el-tooltip class="patch-tooltilp" placement="right" style="display:inline;margin-left:15px">
                     <div slot="content" class="patch-div">
                        <i class="el-icon-question patch-icon"></i>&nbsp;以下趋势图：员工显示本组成员回款趋势图；组长显示本部门组长回款趋势图；部长显示本集团部长回款趋势图；依此类推
                    </div>
                    <div><i class="el-icon-question patch-icon"></i></div>
                </el-tooltip>
                <div class="echartsBoard" id="echarsMain"></div>
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
            departmentFlag:'',
            tableData:[
                {
                    "ranking":1,
                    "name":"彭坤",
                    "group":"开发部",
                    "business":"平安网贷",
                    "repayAmount":"38,000.00"
                },
                {
                    "ranking":2,
                    "name":"朱新桃",
                    "group":"开发部",
                    "business":"平安网贷",
                    "repayAmount":"38,000.00"
                },
                {
                    "ranking":3,
                    "name":"朱新桃",
                    "group":"开发部",
                    "business":"平安网贷",
                    "repayAmount":"38,000.00"
                },
                {
                    "ranking":4,
                    "name":"朱新桃",
                    "group":"开发部",
                    "business":"平安网贷",
                    "repayAmount":"38,000.00"
                },
                {
                    "ranking":5,
                    "name":"彭坤",
                    "group":"开发部",
                    "business":"平安网贷",
                    "repayAmount":"38,000.00"
                },
                {
                    "ranking":6,
                    "name":"彭坤",
                    "group":"开发部",
                    "business":"平安网贷",
                    "repayAmount":"38,000.00"
                },
                {
                    "ranking":7,
                    "name":"彭坤",
                    "group":"开发部",
                    "business":"平安网贷",
                    "repayAmount":"38,000.00"
                },
                {
                    "ranking":8,
                    "name":"彭坤",
                    "group":"开发部",
                    "business":"平安网贷",
                    "repayAmount":"38,000.00"
                },
                {
                    "ranking":9,
                    "name":"彭坤",
                    "group":"开发部",
                    "business":"平安网贷",
                    "repayAmount":"38,000.00"
                },
                {
                    "ranking":10,
                    "name":"朱新桃",
                    "group":"开发部",
                    "business":"平安网贷",
                    "repayAmount":"38,000.00"
                },
                {
                    "ranking":11,
                    "name":"彭坤",
                    "group":"开发部",
                    "business":"平安网贷",
                    "repayAmount":"38,000.00"
                },
                {
                    "ranking":12,
                    "name":"彭坤",
                    "group":"开发部",
                    "business":"平安网贷",
                    "repayAmount":"38,000.00"
                },
                {
                    "ranking":13,
                    "name":"彭坤",
                    "group":"开发部",
                    "business":"平安网贷",
                    "repayAmount":"38,000.00"
                },
                {
                    "ranking":14,
                    "name":"彭坤",
                    "group":"开发部",
                    "business":"平安网贷",
                    "repayAmount":"38,000.00"
                },
                {
                    "ranking":15,
                    "name":"彭坤",
                    "group":"开发部",
                    "business":"平安网贷",
                    "repayAmount":"38,000.00"
                },
                {
                    "ranking":16,
                    "name":"彭坤",
                    "group":"开发部",
                    "business":"平安网贷",
                    "repayAmount":"38,000.00"
                }
            ],
            typeSelect:'',
            options:[
                {
                    value:1,
                    label:'业务类型'
                },
                {
                    value:2,
                    label:'平安网贷'
                },
                {
                    value:3,
                    label:'新美团'
                },
                {
                    value:4,
                    label:'京东'
                },
                {
                    value:5,
                    label:'微众银行'
                }
            ]
        }
    },
    methods:{
        drawEchars(){
            //echars图表
            let myChart = this.$echarts.init(document.getElementById('echarsMain'));
            let option = {
                xAxis:{
                    type:'category',
                    data:['汤宽心','彭坤','黄舟','汤维','心敏','汤宽心','彭坤','黄舟','汤维','心敏','汤维','心敏']
                },
                yAxis:{
                    name:'回款金额/rmb',
                    type:'value'
                },
                series:[{
                    data:[38000,32000,22000,20000,18000,19000,27000,24000,21000,27000,25000,23000],
                    type:'bar',
                    itemStyle:{
                        normal:{
                            color:'#2e76ee'
                        }
                    }
                }]
            }
            myChart.setOption(option)
        },
    },
    mounted () {
        this.drawEchars()
    }
}
</script>

<style scoped>
/* scoped是表明未局部css样式，没写scoped就是全局css样式 */
    .headerKing{
        height: 48px;
        background-color: #fff;
    }
    .kingType{
        height: 48px;
        width: 100px;
        line-height: 48px;
        text-align: center;
        cursor: pointer;
        border-right: 1px solid #ddd;
    }
    .kingType:hover{
        background-color: #ddd;
    }
    .active{
        background-color: #2e76ee;
        color: #fff;
    }
    .active:hover{
        background-color: #2e76ee;
        color: #fff;
    }
    .typeSelect{
        padding: 9px 15px;
    }
    /*冠亚季军*/
    .kingRange{
        margin-top: 15px;
    }
    .winnerBoard{
        background-color: #fff;
        padding: 15px;
    }
    .mar-rgt{
        margin-right: 15px;
    }
    .winnerThree{background: #fff;}
    .winnerList{float: left;width: 33.3%;text-align: center;padding: 30px 0px}
    .winnerDetail{display: inline-block;vertical-align: middle}
    .firstName{display: inline-block;width: 100px;height: 100px;background: #2e76ee;border-radius: 50%;color: #fff;font-size: 38px;text-align: center;line-height: 100px;vertical-align: middle;position: relative}
    .firstName:after{position: absolute;width: 32px;height: 20px;display: block;top: -20px;left: 50%;margin-left: -16px;content: ''}
    .winnerDetail{text-align: left}
    .winnerDetail h2{margin: 0px;font-size: 20px;color: #fa3c3c;font-weight: bold;margin-bottom: 15px}
    .winnerDetail p{font-size: 12px;color: #999;margin-bottom: 0px;}
    @media only screen and (width:1024px){
         .winnerDetail p{width: 80px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;cursor:pointer;}       
     }

     @media only screen and (width:1152px){
         .winnerDetail p{width: 80px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;cursor:pointer;}
     }

     @media only screen and (width:1280px){
         .winnerDetail p{width: 80px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;cursor:pointer;}
     }
    .winnerDetail .winnerName{font-size: 18px;color: #222}
    .winnerDetail label{font-size: 16px;color: #fa3c3c;font-weight: bold}
    .firstName:after{background:url("../images/winnerIco.png") no-repeat;width: 30px;height: 34px;}
    .winnerThree .winnerList:first-child .firstName:after{background-position: -2px -190px}
    .winnerThree .winnerList:nth-child(2) .firstName:after{background-position: -2px -150px}
    .winnerThree .winnerList:nth-child(3) .firstName:after{background-position: -2px -230px}
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
    /*图表*/
    .echartsBoard{background: #fff;}
    #echarsMain{
        height: 650px;
        background-color: #fff !important;
    }
</style>
