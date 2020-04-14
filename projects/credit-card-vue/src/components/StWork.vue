<template>
    <div class="page-content container-fluid">
        <div class="mar-bom10">首页：综合评分><a class="text-line" @click="toFrontPage">工作记录统计</a></div>
        <div class="indexWrap row">    
            <div class="mar-bom10 inputs">
                    <span style="margin-left:0">提交人/手机：</span>
                    <el-select placeholder="请输入姓名或手机号联想" v-model="nameOrPhone" filterable style="width:190px"></el-select>
                    <span>包含下级：</span>
                    <el-select v-model="contain" style="width:60px" placeholder="">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>                     
                    </el-select>
                    <span>添加时间：</span>
                    <el-date-picker v-model="dateRange" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" class="pickerWid"></el-date-picker>
                    <el-button type="primary" icon="el-icon-search" style="margin-left:10px">搜索</el-button> 
                    <div class="pull-right">
                        <el-button  plain class="btn" @click="dialog_expot=true">导出</el-button>
                        <el-button  plain class="btn" @click="todaysLog=true">今日记录</el-button>
                    </div> 
            </div>   
                                                    
        <div class="table_wrap">
            <el-table :data="tableData" border :header-cell-style="{backgroundColor:'#e5e9f3'}" style="width:100%">
                <el-table-column prop="listNum" label="序号"></el-table-column>
                <el-table-column prop="provider" label="提交人">
                    <template slot-scope="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>
                                <b>女/在职&nbsp;&nbsp;186****7688</b>&nbsp;
                                <img src="../images/call.png" @click="phoneStatusShow" alt>
                            </p>
                            <p>所属职位：资产管理员</p>
                            <p>隶属单位：长沙分公司-业务部</p>
                            <p>组织关系：谭曼-陈军-{{scope.row.provider}}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-button size="mini">{{scope.row.provider}}</el-button>
                            </div>
                        </el-popover>
                     </template>
                </el-table-column>
                <el-table-column prop="phoneNumber" label="平台账号"></el-table-column>                               
                <el-table-column prop="inTime" label="入职时间"></el-table-column>
                <el-table-column prop="position" label="所任职位"></el-table-column>
                <el-table-column prop="transferState" label="转正状态"></el-table-column>
                <el-table-column prop="addTime" label="添加时间"></el-table-column>
                <el-table-column prop="sum" label="数量"></el-table-column>   
                <el-table-column prop="finish">
                    <template slot="header">
                        <select class="form-control" v-model="finishflag">
                            <option value disabled selected style="display:none">完成进度</option>
                            <option value="all">完成进度</option>
                            <option value="1">已完成</option>
                            <option value="2">未完成</option>
                        </select>
                    </template>
                </el-table-column>                          
                <el-table-column label="查看记录" fixed="right" width="120" >
                    <template >
                        <el-button type="text" size="small" @click="checkFlag=true">
                            查看
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        </div>
        <!-- 导出弹框 -->
        <el-dialog title="信息" :visible.sync="dialog_expot"  width="500px">
            <span>尊敬的管理员，您确定要导出工作记录统计数据吗？（注意：导出数据中仅包括【组员级别】和排除【已离职】员工数据）</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary"  @click="dialog_expot=false">确定导出</el-button>
                <el-button  @click="dialog_expot=false">关闭窗口</el-button>
            </span>
        </el-dialog>

        <!-- 今日记录弹框 -->
        <el-dialog title="信息" :visible.sync="todaysLog"  width="500px">
            <span>尊敬的用户，您今日工作记录总条数为：1条！</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary"  @click="todaysLog=false">确定</el-button>
            </span>
        </el-dialog>

        <!-- 查看弹框 -->
        <el-dialog title="查看" :visible.sync="checkFlag" width="900px">
            <div class="mar-bom10 inputs">
                    <span style="margin-left:0">提交人：</span>
                    <el-input v-model="provider" :disabled="true" style="width:90px"></el-input>
                    <span>持卡人：</span>
                    <el-input v-model="holder3"  style="width:90px"></el-input>
                    <span>工作记录内容：</span>
                    <el-input v-model="holder2" clearable style="width:150px"></el-input>
                    <span>限制时间：</span>
                    <el-select v-model="limitTime" style="width:60px" placeholder="">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>                     
                    </el-select>
                  
                    <el-button type="primary" icon="el-icon-search" style="margin-left:10px">搜索</el-button> 
                    <div class="pull-right">
                        <el-button  plain class="btn" @click="dialog_expot=true">导出</el-button>                      
                    </div> 
            </div> 
            <div class="table_wrap">
                <el-table :data="totalRecordTData" :header-cell-style="{backgroundColor:'#e5e9f3'}" border style="width:100%" max-height="400">           
                    <el-table-column prop="rowNum" label="序号" min-width="80px"></el-table-column>
                    <el-table-column prop="type" label="催收类型" min-width="120px"></el-table-column>
                    <el-table-column prop="cont" label="工作记录内容" min-width="300px" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="subTime" label="提交时间" min-width="120px"></el-table-column>
                    <el-table-column prop="holder" label="持卡人" min-width="80px"></el-table-column> 
                </el-table>         
            </div>
        </el-dialog>
    </div>

    
</template>
<script>
import myMixin from '../libs/js/mixin.js' //导入mixin修复page-content全屏功能
export default {
    name:'StWork',
    mixins:[myMixin],
    data(){
        return{
            finishflag:"",
            nameOrPhone:"",
            dateRange:"",
            contain:"是",
            holder2:"",
            holder3:"",
            provider:"朱新桃",
            dialog_expot:false,
            todaysLog:false,
            checkFlag:false,
            limitTime:"是",
            options:[{
               value:"选项1",
               label:"是"
            },{
                value:"选项2",
               label:"否"
            }],
            totalRecordTData:[{
                "rowNum":"1",
                "type":"中信抢案",
                "cont":"工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录",
                "subTime":"2019-05-08",
                "holder":"张小花",
            },{
                "rowNum":"2",
                "type":"中信抢案",
                "cont":"工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录",
                "subTime":"2019-05-08",
                "holder":"张小花",
            },{
                "rowNum":"3",
                "type":"中信抢案",
                "cont":"工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录",
                "subTime":"2019-05-08",
                "holder":"张小花",
            },{
                "rowNum":"4",
                "type":"中信抢案",
                "cont":"工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录",
                "subTime":"2019-05-08",
                "holder":"张小花",
            },{
                "rowNum":"5",
                "type":"中信抢案",
                "cont":"工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录",
                "subTime":"2019-05-08",
                "holder":"张小花",
            },{
                "rowNum":"6",
                "type":"中信抢案",
                "cont":"工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录",
                "subTime":"2019-05-08",
                "holder":"张小花",
            },{
                "rowNum":"7",
                "type":"中信抢案",
                "cont":"工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录",
                "subTime":"2019-05-08",
                "holder":"张小花",
            },{
                "rowNum":"8",
                "type":"中信抢案",
                "cont":"工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录",
                "subTime":"2019-05-08",
                "holder":"张小花",
            },{
                "rowNum":"9",
                "type":"中信抢案",
                "cont":"工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录",
                "subTime":"2019-05-08",
                "holder":"张小花",
            },{
                "rowNum":"10",
                "type":"中信抢案",
                "cont":"工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录",
                "subTime":"2019-05-08",
                "holder":"张小花",
            },{
                "rowNum":"10",
                "type":"中信抢案",
                "cont":"工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录",
                "subTime":"2019-05-08",
                "holder":"张小花",
            },{
                "rowNum":"10",
                "type":"中信抢案",
                "cont":"工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录",
                "subTime":"2019-05-08",
                "holder":"张小花",
            },{
                "rowNum":"10",
                "type":"中信抢案",
                "cont":"工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录工作记录",
                "subTime":"2019-05-08",
                "holder":"张小花",
            }],
            tableData:[{
                "listNum":"1",
                "provider":"朱新桃",
                "phoneNumber":"18807386688",
                "inTime":"2014-08-06",
                "position":"部长",
                "transferState":"已转正",
                "addTime":"2019-05-08",
                "sum":"1",
                "finish":"已完成"
                },
                {
                "listNum":"2",
                "provider":"朱新桃",
                "phoneNumber":"18807386688",
                "inTime":"2014-08-06",
                "position":"部长",
                "transferState":"已转正",
                "addTime":"2019-05-08",
                "sum":"1",
                "finish":"已完成"
                },
                {
                "listNum":"3",
                "provider":"朱新桃",
                "phoneNumber":"18807386688",
                "inTime":"2014-08-06",
                "position":"部长",
                "transferState":"已转正",
                "addTime":"2019-05-08",
                "sum":"1",
                "finish":"已完成"
                },
                {
                "listNum":"4",
                "provider":"朱新桃",
                "phoneNumber":"18807386688",
                "inTime":"2014-08-06",
                "position":"部长",
                "transferState":"已转正",
                "addTime":"2019-05-08",
                "sum":"1",
                "finish":"已完成"
                },
                {
                "listNum":"5",
                "provider":"朱新桃",
                "phoneNumber":"18807386688",
                "inTime":"2014-08-06",
                "position":"部长",
                "transferState":"已转正",
                "addTime":"2019-05-08",
                "sum":"1",
                "finish":"已完成"
                },
                {
                "listNum":"6",
                "provider":"朱新桃",
                "phoneNumber":"18807386688",
                "inTime":"2014-08-06",
                "position":"部长",
                "transferState":"已转正",
                "addTime":"2019-05-08",
                "sum":"1",
                "finish":"已完成"
                },
                {
                "listNum":"7",
                "provider":"朱新桃",
                "phoneNumber":"18807386688",
                "inTime":"2014-08-06",
                "position":"部长",
                "transferState":"已转正",
                "addTime":"2019-05-08",
                "sum":"1",
                "finish":"已完成"
                },
                {
                "listNum":"8",
                "provider":"朱新桃",
                "phoneNumber":"18807386688",
                "inTime":"2014-08-06",
                "position":"部长",
                "transferState":"已转正",
                "addTime":"2019-05-08",
                "sum":"1",
                "finish":"已完成"
                },
                {
                "listNum":"9",
                "provider":"朱新桃",
                "phoneNumber":"18807386688",
                "inTime":"2014-08-06",
                "position":"部长",
                "transferState":"已转正",
                "addTime":"2019-05-08",
                "sum":"1",
                "finish":"已完成"
                },
                {
                "listNum":"10",
                "provider":"朱新桃",
                "phoneNumber":"18807386688",
                "inTime":"2014-08-06",
                "position":"部长",
                "transferState":"已转正",
                "addTime":"2019-05-08",
                "sum":"1",
                "finish":"已完成"
                },
                
                
                
                ]
        }
    },
    methods:{
        phoneStatusShow() {
            this.phoneStatusVisible = true;
    },
    toFrontPage(){
         let routerDetails = this.$router.resolve({
                path:`/home/reports/ReportsIndex`
            })
            window.open(routerDetails.href,'_self')
    }
    }
    
}
</script>
<style scoped>
.indexWrap{
    background-color: #fff;
    padding: 15px;
}

.mar-bom10{
    margin-bottom: 10px;
}

.pickerWid{
    width:220px!important;
}

.inputs span{
    margin-left:10px;
}

.text-line{
    text-decoration: underline;
    cursor: pointer;
}
</style>

