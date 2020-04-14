<template>
    <div class="page-content container-fluid">     
            <el-tooltip class="patch-tooltilp" placement="bottom" >
                <div slot="content" class="patch-div">
                    <i class="el-icon-question patch-icon"></i>&nbsp;员工当月综合评分及排名
                </div> 
            <div class="evaluationInfos">
               <div id="echarts_rate" style="width:110px;height:110px;margin-right:25px">
                   <el-progress type="circle" :percentage="90" :stroke-width="10" color="#498dff" :width="100" status="text"><b class="myRate">90</b><br/><span style="color:#2e76ee">综合评分</span></el-progress>
               </div>
               <div style="margin-left:15px;width:calc(100% - 125px)">
                <div class="row" style="color:#2e76ee;">
                    <div class="col-md-2">
                        <b>集团排名：</b>
                        <b>124</b>
                    </div>
                    <div class="col-md-2 clearfix">
                        <b>业务内排名：</b>
                        <b>56</b>
                    </div>
                    <div class="col-md-2 clearfix">
                        <b>小组排名：</b>
                        <b>03</b>
                    </div>
                    <div class="pull-right" style="margin-right: 10px;">
                         <el-date-picker type="month" placeholder="选择月" v-model="month1" style="width:140px"></el-date-picker>
                    </div>
                </div>
                
                <div class="row amountWrap">
                    <div class="col-md-2 clearfix">
                        <div class="pull-left rMoney rBorder">
                            <div class="ev-title">回款金额（30%）:</div>
                            <div class="sum">80分</div>
                        </div>
                    </div>
                    <div class="col-md-2 clearfix">
                        <div class="pull-left rBorder attendance">
                            <div class="ev-title">考勤（25%）:</div>
                            <div class="sum">100分</div>
                        </div>
                    </div>
                    <div class="col-md-2 clearfix">
                        <div class="pull-left rBorder deduction">
                            <div class="ev-title">行为扣款（15%）:</div>
                            <div class="sum">100分</div>
                        </div>
                    </div>
                    <div class="col-md-2 clearfix">
                        <div class="pull-left rBorder quality">
                            <div class="ev-title">品质扣分（15%）:</div>
                            <div class="sum">100分</div>
                        </div>
                    </div>
                    <div class="col-md-2 clearfix">
                        <div class="pull-left rBorder workRecord">
                            <div class="ev-title">工作记录（10%）:</div>
                            <div class="sum">100分</div>
                        </div>
                    </div>
                    <div class="col-md-2 clearfix">
                        <div class="pull-left rBorder callTime">
                            <div class="ev-title">通话时长（5%）:</div>
                            <div class="sum">80分</div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
             </el-tooltip>
        
        <div class="row">
            <div class="col-md-12 evaluationTable">
                <div class="searchs clearfix">
                    <div class="name_wrap">
                        <el-input class="nameInpt" placeholder="请输入姓名" v-model="nameInpt" v-if="leaderflag==false" clearable></el-input>
                        <el-button type="primary" icon="el-icon-search" v-if="leaderflag==false" style="margin-left:10px">搜索</el-button>       
                        <span v-if="leaderflag==true" style="color:#99a0b1;font-size:14px;margin-left:20px"><i class="el-icon-question" style="color:#99a0b1;"></i>综合评分=回款评分×30%+考勤评分×25%+行为评分×15%+品质评分×15%+记录评分×10%+通话评分×5%</span>                  
                        <el-date-picker type="month" placeholder="选择月" v-model="timeSearch" class="pull-right" style="width:140px"></el-date-picker>
                    </div>                                                            
                </div>
                <el-tooltip class="patch-tooltilp" placement="top" >
                <div slot="content" class="patch-div">
                    <i class="el-icon-question patch-icon"></i>&nbsp;综合评分计算公式
                </div>
                <div class="table_wrap">
                    <el-table :data="tableData" border class="tabHeight" :header-cell-style="{backgroundColor:'#e5e9f3'}" :row-class-name="currentAgentName" style="width:100%;">
                        <el-table-column fixed prop="name" label="姓名"></el-table-column>
                        <el-table-column prop="date" label="时间" width="100"></el-table-column>
                        <el-table-column prop="returnMoney" label="回款金额（30%）" ></el-table-column>
                        <el-table-column label="考勤（25%）">
                            <el-table-column prop="actual_attendance" label="实出勤"></el-table-column>
                            <el-table-column prop="should_attendance" label="应出勤"></el-table-column>
                        </el-table-column>
                        <el-table-column label="行为扣款（15%）">
                            <el-table-column prop="attendance" label="考勤"></el-table-column>
                            <el-table-column prop="daily" label="日常"></el-table-column>
                        </el-table-column>
                        <el-table-column prop="quality_points" label="品质扣分"></el-table-column>
                        <el-table-column prop="word_record" label="工作记录"></el-table-column>
                        <el-table-column prop="duration" label="通话时长"></el-table-column>
                        <el-table-column prop="com_score" label="综合评分"></el-table-column>
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
                </el-tooltip>
            </div>
        </div>
    </div>
</template>

<script>
import myMixin from '../libs/js/mixin.js' //导入mixin修复page-content全屏功能
export default {
    name:'Evaluation',
    mixins:[myMixin],
    methods:{
        handleSizeChange(val){
            console.log(`每页：${val}`)
        },
        handlecurrentChange(val){
            console.log(`当前页：${val}`)
        },
        //当前经办人 一行高亮
        currentAgentName({row, rowIndex}) {
        if (row.name=== "凌心敏") {
          return 'warning-row';
        }
        return '';
      }
    },
    data () {
        return {
            leaderflag:true,
            month1:"",
            nameInpt:'',
            timeSearch:'',
            currentPage:1,
            tableData:[
            {
                name:'朱新桃',
                date:'2016-05-03',
                returnMoney:'20,356.00',
                actual_attendance:176,
                should_attendance:176,
                attendance:0,
                daily:0,
                quality_points:0,
                word_record:'100%',
                duration:'200min',
                com_score:'90'
            },
            {
                name:'张三丰',
                date:'2016-05-03',
                returnMoney:'20,356.00',
                actual_attendance:176,
                should_attendance:176,
                attendance:0,
                daily:0,
                quality_points:0,
                word_record:'100%',
                duration:'200min',
                com_score:'90'
            },
            {
                name:'王小虎',
                date:'2016-05-03',
                returnMoney:'20,356.00',
                actual_attendance:176,
                should_attendance:176,
                attendance:0,
                daily:0,
                quality_points:0,
                word_record:'100%',
                duration:'200min',
                com_score:'90'
            },
            {
                name:'凌心敏',
                date:'2016-05-03',
                returnMoney:'20,356.00',
                actual_attendance:176,
                should_attendance:176,
                attendance:0,
                daily:0,
                quality_points:0,
                word_record:'100%',
                duration:'200min',
                com_score:'90'
            },
            {
                name:'风清扬',
                date:'2016-05-03',
                returnMoney:'20,356.00',
                actual_attendance:176,
                should_attendance:176,
                attendance:0,
                daily:0,
                quality_points:0,
                word_record:'100%',
                duration:'200min',
                com_score:'90'
            },
            {
                name:'张无忌',
                date:'2016-05-03',
                returnMoney:'20,356.00',
                actual_attendance:176,
                should_attendance:176,
                attendance:0,
                daily:0,
                quality_points:0,
                word_record:'100%',
                duration:'200min',
                com_score:'90'
            },
            {
                name:'赵敏',
                date:'2016-05-03',
                returnMoney:'20,356.00',
                actual_attendance:176,
                should_attendance:176,
                attendance:0,
                daily:0,
                quality_points:0,
                word_record:'100%',
                duration:'200min',
                com_score:'90'
            },
            {
                name:'周芷若',
                date:'2016-05-03',
                returnMoney:'20,356.00',
                actual_attendance:176,
                should_attendance:176,
                attendance:0,
                daily:0,
                quality_points:0,
                word_record:'100%',
                duration:'200min',
                com_score:'90'
            },
            {
                name:'小昭',
                date:'2016-05-03',
                returnMoney:'20,356.00',
                actual_attendance:176,
                should_attendance:176,
                attendance:0,
                daily:0,
                quality_points:0,
                word_record:'100%',
                duration:'200min',
                com_score:'90'
            },
            {
                name:'灭绝师太',
                date:'2016-05-03',
                returnMoney:'20,356.00',
                actual_attendance:176,
                should_attendance:176,
                attendance:0,
                daily:0,
                quality_points:0,
                word_record:'100%',
                duration:'200min',
                com_score:'90'
            },
            {
                name:'金毛狮王',
                date:'2016-05-03',
                returnMoney:'20,356.00',
                actual_attendance:176,
                should_attendance:176,
                attendance:0,
                daily:0,
                quality_points:0,
                word_record:'100%',
                duration:'200min',
                com_score:'90'
            },
            {
                name:'白眉鹰王',
                date:'2016-05-03',
                returnMoney:'20,356.00',
                actual_attendance:176,
                should_attendance:176,
                attendance:0,
                daily:0,
                quality_points:0,
                word_record:'100%',
                duration:'200min',
                com_score:'90'
            },
            {
                name:'金花婆婆',
                date:'2016-05-03',
                returnMoney:'20,356.00',
                actual_attendance:176,
                should_attendance:176,
                attendance:0,
                daily:0,
                quality_points:0,
                word_record:'100%',
                duration:'200min',
                com_score:'90'
            },
            {
                name:'郭靖',
                date:'2016-05-03',
                returnMoney:'20,356.00',
                actual_attendance:176,
                should_attendance:176,
                attendance:0,
                daily:0,
                quality_points:0,
                word_record:'100%',
                duration:'200min',
                com_score:'90'
            },
            {
                name:'黄蓉',
                date:'2016-05-03',
                returnMoney:'20,356.00',
                actual_attendance:176,
                should_attendance:176,
                attendance:0,
                daily:0,
                quality_points:0,
                word_record:'100%',
                duration:'200min',
                com_score:'90'
            }
            ]
        }
    }
}
</script>
<style scoped>
/* scoped是表明未局部css样式，没写scoped就是全局css样式 */
#pagination{
    margin-top:20px;
}
.name_wrap span,
.time_wrap span{
    font-size: 16px;
    position: relative;
    
}
.name_wrap .el-input,
.time_wrap .el-input{
    width: 180px;
    margin-left: 10px;
}
.evaluationInfos{
    background-color: #fff;
    height: 150px;
    padding: 20px;
    display:flex;
}
.evaluationTable{
    background-color: #fff;
    margin-top: 15px;
    padding: 20px 20px;
}
.searchs{
    padding-bottom: 15px;
}
.s_types{
    float: left;
}
.s_types{
    padding-right: 40px;
}
.rBorder{
    padding-left: 10px;
  
    font-size: 14px;
}
.rMoney{
    border-left: 2px solid rgb(46, 138, 228);
}
.attendance{
    border-left: 2px solid rgb(31, 207, 315);
}
.deduction{
    border-left: 2px solid rgb(255, 84, 84);
}
.quality{
    border-left: 2px solid rgb(255, 188, 45);
}
.workRecord{
    border-left: 2px solid rgb(251, 134, 247);
}
.callTime{
    border-left: 2px solid rgb(72, 205, 255);
}
.sum{
    margin-top: 5px;
    color: rgb(46, 138, 228);
    font-weight: bolder;
}
.amountWrap{
    margin-top: 15px;
}
.nameInpt{
    display: inline-block;
}
.myRate{
    color:#2e76ee;
    font-size:30px;
}
</style>
