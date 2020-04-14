<template>
    <div class="page-content">
        <div class="mar-bom10">首页：<router-link :to="{name:'ReportsIndex'}" class="text-line">统计报表</router-link>&nbsp;>&nbsp;在案案件数量金额统计</div> 
                    
        <div class="indexWrap row">
            <div class="searchWrap clearfix" >
                <div class="s_types inpt_wrap pull-left">
                    <span class="pull-left">持卡人：</span>
                    <el-input class="pull-left" placeholder="请输入"  clearable style="width:100px"></el-input>
                </div>
                <div class="s_types inpt_wrap pull-left">
                    <span class="pull-left">在职状态：</span>
                    <template>
                    <el-select v-model="typeSelect" placeholder="在职状态"  style="width:100px">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    </template>
                </div>
                <div class="s_types inpt_wrap pull-left">
                    <span class="pull-left">员工职务：</span>
                    <el-select v-model="typeSelect2" placeholder="员工职务："   style="width:100px">
                         <el-option v-for="item2 in options2" :key="item2.value" :label="item2.label" :value="item2.value"></el-option>
                    </el-select>
                </div>
                    <el-button type="primary" icon="el-icon-search">搜索</el-button>
            
                <div class="pull-right">
                    <el-button  @click="dialog_expot=true">导出</el-button>
                </div>

            </div>
            <div class="tableWrap">
                <div class="table_wrap">
                    <el-table :data="tableData" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
                        
                        <el-table-column prop="id" label="序号" width="80"></el-table-column>
                        <!-- <el-table-column prop="cardHolder" label="经办人" ></el-table-column> -->
                        <el-table-column label="经办人">
                        <template slot-scope="scope">
                            <el-popover trigger="hover" placement="top">
                                <p><b>男/在职&nbsp;&nbsp;186****4488</b>&nbsp;<img src="../images/call.png"  alt=""></p>
                                    <p>所属职位：资产管理员-部长</p>
                                    <p>隶属单位：长沙分公司-业务部</p>
                                    <p>组织关系：谭曼-陈军-李永杰-{{scope.row.cardHolder}}</p>
                                    <div slot="reference" class="name-wrapper">
                                    <el-button size="mini">{{scope.row.cardHolder}}</el-button>
                                    </div>
                            </el-popover>
                        </template>
                        </el-table-column>
                        <el-table-column prop="workphone" label="工作手机" ></el-table-column>
                        <el-table-column prop="caseCount" label="案件数量"></el-table-column>
                        <el-table-column prop="amount" label="委案金额"></el-table-column>
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
    name:'AmountCount',
    mixins:[myMixin],
    data() {
        return {
            tableData:[
                {
                    "id":1,
                    "cardHolder":'魏占',
                    "workphone":'13207319451',
                    "caseCount":'120',
                    "amount":'15,621'
                },
                {
                    "id":2,
                    "cardHolder":'魏占',
                    "workphone":'15616665002',
                    "caseCount":'122',
                    "amount":'15,621'
                },
                {
                    "id":3,
                    "cardHolder":'魏占',
                    "workphone":'15616665002',
                    "caseCount":'122',
                    "amount":'15,621'
                },
                {
                    "id":4,
                    "cardHolder":'凌心敏',
                    "workphone":'13207319451',
                    "caseCount":'324',
                    "amount":'515,600'
                },
                {
                    "id":5,
                    "cardHolder":'凌心敏',
                    "workphone":'13207319451',
                    "caseCount":'324',
                    "amount":'515,600'
                },
                {
                    "id":6,
                    "cardHolder":'凌心敏',
                    "workphone":'13207319451',
                    "caseCount":'324',
                    "amount":'515,600'
                },
                {
                    "id":7,
                    "cardHolder":'凌心敏',
                    "workphone":'13207319451',
                    "caseCount":'324',
                    "amount":'515,600'
                },
                {
                    "id":8,
                    "cardHolder":'凌心敏',
                    "workphone":'13207319451',
                    "caseCount":'324',
                    "amount":'515,600'
                },
                {
                    "id":9,
                    "cardHolder":'凌心敏',
                    "workphone":'13207319451',
                    "caseCount":'324',
                    "amount":'515,600'
                },
                {
                    "id":10,
                    "cardHolder":'凌心敏',
                    "workphone":'13207319451',
                    "caseCount":'324',
                    "amount":'515,600'
                },
            ],
            typeSelect:'',
            typeSelect2:'',
            currentPage:1,
            dialog_expot:false,
            options:[
                {
                    value:1,
                    label:'全部'
                },
                {
                    value:2,
                    label:'在职'
                },
                {
                    value:3,
                    label:'离职'
                }
            ],
            options2:[
                {
                    value:1,
                    label:'全部'
                },
                {
                    value:2,
                    label:'组员'
                },
                {
                    value:3,
                    label:'组长'
                },
                {
                    value:4,
                    label:'部长'
                },
                {
                    value:5,
                    label:'副总经理'
                },
                {
                    value:6,
                    label:'总经理'
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
        }
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

</style>

