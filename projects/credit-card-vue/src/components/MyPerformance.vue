<template>
    <div class="page-content container-fluid">
        <div class="row echarsRow">
            <div class="clearfix echarsInfo">
                <el-tooltip class="patch-tooltilp" placement="right" >
                     <div slot="content" class="patch-div">
                        <i class="el-icon-question patch-icon"></i>&nbsp;每月业绩走势图：员工显示本人业绩；组长显示本组业绩；部长显示本部业绩；副总显示本集团业绩
                    </div>
                    <h3 class="pull-left">我的业绩(月)&nbsp;<i class="el-icon-question patch-icon"></i></h3>
                </el-tooltip>
                <h3 class="pull-right">
                    <el-select v-model="yearSelect" placeholder="请选择年份">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </h3>
            </div>
            <div class="col-md-12 results-echars" id="echarsMain"></div>
        </div>
        <div class="row">
            <div class="col-md-12 results-tables">
                <div class="searchs clearfix">
                    <div class="s_types inpt_wrap pull-left">
                        <span class="pull-left">业务类型：</span>
                        <el-input class="nameInpt pull-left" placeholder="请输入" v-model="businessTypes" clearable></el-input>
                    </div>
                    <div class="s_types inpt_wrap pull-left">
                        <span class="pull-left">持卡人：</span>
                        <el-input class="nameInpt pull-left" placeholder="请输入" v-model="cardHolder" clearable></el-input>
                    </div>
                    <div class="s_types inpt_wrap pull-left">
                        <span class="pull-left">日期：</span>
                        <el-date-picker v-model="timeSearch" type="date" placeholder="选择日期"></el-date-picker>
                    </div>
                    <el-button type="primary" icon="el-icon-search">搜索</el-button>
                </div>
                 <el-tooltip class="patch-tooltilp" placement="top" >
                     <div slot="content" class="patch-div">
                        <i class="el-icon-question patch-icon"></i>&nbsp;历史回款业绩提成详情
                    </div>
                <div class="table_wrap">
                    <el-table :data="tableData" border :header-cell-style="{backgroundColor:'#e5e9f3'}" style="width:100%" max-height="600">
                        <el-table-column fixed prop="bTypes" >
                            <template slot="header">
                                <select class="form-control" v-model="caseFlag">
                                    <option value disabled selected style="display:none">业务类型</option>
                                    <option value="all">全部</option>
                                    <option value="1">中信抢案</option>
                                    <option value="2">平安资产包</option>
                                    <option value="3">平安正常</option>
                                    <option value="4">招商银行</option>
                                    <option value="5">新浦发银行</option>
                                </select>
                            </template>
                        </el-table-column>
                        <el-table-column prop="cardHolderName" label="持卡人"></el-table-column>
                        <el-table-column prop="idCard" label="身份证号" width="160"></el-table-column>
                        <el-table-column prop="repayAccount" label="还款账号" ></el-table-column>
                        <el-table-column prop="repayTime" label="还款日期"></el-table-column>
                        <el-table-column prop="entrust" label="委托余额"></el-table-column>
                        <el-table-column prop="perforFee" label="业绩提成"></el-table-column>
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
    name:'MyPerformance',
    mixins:[myMixin],
    data () {
        return {
            yearSelect:'',
            businessTypes:'',
            cardHolder:'',
            timeSearch:'',
            caseFlag:'',
            options:[
                {
                    value:'2019年',
                    label:'2019'
                },
                {
                    value:'2018年',
                    label:'2018'
                },
                {
                    value:'2017年',
                    label:'2017'
                }
            ],
            currentPage:1,
            tableData:[
            {
                bTypes:'平安网贷',
                cardHolderName:'魏占',
                idCard:'325487199010155668',
                repayAccount:'251265200251850',
                repayTime:'2019-03-01',
                entrust:'15,321.10',
                perforFee:'1,500.00'
            },
            {
                bTypes:'平安网贷',
                cardHolderName:'魏占',
                idCard:'325487199010155668',
                repayAccount:'251265200251850',
                repayTime:'2019-03-01',
                entrust:'15,321.10',
                perforFee:'1,500.00'
            },
            {
                bTypes:'平安网贷',
                cardHolderName:'魏占',
                idCard:'325487199010155668',
                repayAccount:'251265200251850',
                repayTime:'2019-03-01',
                entrust:'15,321.10',
                perforFee:'1,500.00'
            },
            {
                bTypes:'平安网贷',
                cardHolderName:'魏占',
                idCard:'325487199010155668',
                repayAccount:'251265200251850',
                repayTime:'2019-03-01',
                entrust:'15,321.10',
                perforFee:'1,500.00'
            },
            {
                bTypes:'平安网贷',
                cardHolderName:'魏占',
                idCard:'325487199010155668',
                repayAccount:'251265200251850',
                repayTime:'2019-03-01',
                entrust:'15,321.10',
                perforFee:'1,500.00'
            },
            {
                bTypes:'平安网贷',
                cardHolderName:'魏占',
                idCard:'325487199010155668',
                repayAccount:'251265200251850',
                repayTime:'2019-03-01',
                entrust:'15,321.10',
                perforFee:'1,500.00'
            },
            {
                bTypes:'平安网贷',
                cardHolderName:'魏占',
                idCard:'325487199010155668',
                repayAccount:'251265200251850',
                repayTime:'2019-03-01',
                entrust:'15,321.10',
                perforFee:'1,500.00'
            },
            {
                bTypes:'平安网贷',
                cardHolderName:'魏占',
                idCard:'325487199010155668',
                repayAccount:'251265200251850',
                repayTime:'2019-03-01',
                entrust:'15,321.10',
                perforFee:'1,500.00'
            },
            {
                bTypes:'平安网贷',
                cardHolderName:'魏占',
                idCard:'325487199010155668',
                repayAccount:'251265200251850',
                repayTime:'2019-03-01',
                entrust:'15,321.10',
                perforFee:'1,500.00'
            }
            ]
        }
    },
    methods:{
        handleSizeChange(val){
            console.log(`每页：${val}`) 
        },
        handlecurrentChange(val){
            console.log(`当前页：${val}`)
        },
        drawEchars(){
            //echars图表
            let myChart = this.$echarts.init(document.getElementById('echarsMain'));
            let option = {
                xAxis:{
                    type:'category',
                    data:['2018/4','2018/5','2018/6','2018/7','2018/8','2018/9','2018/10','2018/11','2018/12','2019/1','2019/2','2019/3']
                },
                yAxis:{
                    type:'value'
                },
                series:[{
                    data:[120,200,150,80,70,110,130,150,160,170,144,126],
                    type:'bar',
                    itemStyle:{
                        normal:{
                            color:'#2e76ee'
                        }
                    }
                }]
            }
            myChart.setOption(option);
        }
    },
    mounted() {
        this.drawEchars()
    }
}
</script>

<style scoped>
/* scoped是表明未局部css样式，没写scoped就是全局css样式 */
.results-tables{
    background-color: #fff;
    margin-top: 15px;
    padding-top: 20px;
    padding-bottom: 20px;
}
.inpt_wrap span{
    font-size: 16px;
    position: relative;
    top: 5px;
}
.inpt_wrap .el-input{
    width: 180px;
    margin-left: 10px;
}
.searchs{
    padding-bottom: 15px;
}
.s_types{
    float: left;
    padding-right: 40px;

}
#echarsMain {
    width: 100%;
    height: 300px;
    position: relative;
    top: -30px;
}
.echarsRow{
    background-color: #fff;
}
.echarsInfo{
    padding: 0 20px;
}
.echarsForm{
    margin-top: 20px;
}
#pagination{
    margin-top:20px;
}
</style>
