<template>
    <div class="home">
        <header class="clearfix" id="home-header">
            <div class="sysTitle" @click="toHome">信用卡</div>
            <div class="sysNav">
                <ul class="nav">
                    <li><router-link to="/home/index">我的案件</router-link></li>
                    <li><el-tooltip class="patch" placement="bottom"><div slot="content"><i class="el-icon-question"></i>&nbsp;历史业绩总表</div><router-link to="/home/myPerformance">我的业绩</router-link></el-tooltip></li>
                    <li><el-tooltip class="patch" placement="bottom"><div slot="content"><i class="el-icon-question"></i>&nbsp;业务技巧、法律法规、经典案例等</div><router-link to="/home/businessPrimerHome">业务入门</router-link></el-tooltip></li>
                    <li><el-tooltip class="patch" placement="bottom"><div slot="content"><i class="el-icon-question"></i>&nbsp;业绩排行榜</div><router-link to="/home/kingList">王者榜</router-link></el-tooltip></li>
                    <li><el-tooltip class="patch" placement="bottom"><div slot="content"><i class="el-icon-question"></i>&nbsp;月评分及排名</div><router-link to="/home/evaluation">综合评分</router-link></el-tooltip></li>
                    <li><el-tooltip class="patch" placement="bottom"><div slot="content"><i class="el-icon-question"></i>&nbsp;重要数据图表概况</div><router-link to="/home/reports">统计报表</router-link></el-tooltip></li>
                </ul>
            </div>

            <ul class="pull-right nav navbar-top-links">
                <li class="pNumberLi dtlsLi dtls-tools"><el-tooltip class="patch" placement="bottom"><div slot="content"><i class="el-icon-question"></i>&nbsp;常用办公辅助小工具箱，可自定义新增</div><img @click="toolsShow" class="dtls" src="../images/tools.png" alt=""></el-tooltip></li>
                <li class="pNumberLi dtlsLi"><el-tooltip class="patch" placement="bottom"><div slot="content"><i class="el-icon-question"></i>&nbsp;放大镜</div><img class="dtls" src="../images/searchDetails.png" alt=""></el-tooltip></li>
                <li class="pNumberLi"><el-tooltip class="patch" placement="bottom"><div slot="content"><i class="el-icon-question"></i>&nbsp;未接来电</div><span class="phoneSpan" @click="notPhoneShow"><i class="phoneNo"></i><span class="Pnumber">20</span></span></el-tooltip></li>
                <div class="notPhoneModal" :class="iphoneVisible == true?'show':'hidden'">
                    <div class="notPhoneHeader clearfix">
                        <div class="pull-left">
                            <img class="missPhoneIcon" src="../images/phoneIcon.png" alt="">
                            <span class="missPhoneTxt">未接电话</span>
                        </div>
                        <div class="pull-right">
                            <img class="closeIcon" @click="iphoneVisible = false" src="../images/x.png" alt="">
                        </div>
                    </div>
                    <div class="notPhoneContent">
                        <div class="notPhoneItem">
                            <el-row type="flex" justify="center">
                                <el-col :span="18">
                                    <el-row type="flex" :gutter="1" justify="center" style="line-height:24px;">
                                        <el-col :span="2">
                                            <div class="notPhoneIcon"><img src="../images/wphone.png" alt=""></div>
                                        </el-col>
                                        <el-col :span="6">
                                            <div class="notPhoneTxt numTxt">186****5506</div>
                                        </el-col>
                                        <el-col :span="12">
                                            <div class="notPhoneTxt huiTxt">2019-08-08 12:12:12</div>
                                        </el-col>
                                        <el-col :span="2">
                                            <div class="notPhoneIcon" style="cursor: pointer;" @click="openPhoneRecord($event)"><img src="../images/txt.png" alt=""></div>
                                        </el-col>
                                    </el-row>
                                    <el-row type="flex" :gutter="1" justify="center" style="line-height:24px;">
                                        <el-col :span="9">
                                            <div class="notPhoneTxt smallTxt">呼入：3次 | 呼出：2次</div>
                                        </el-col>
                                        <el-col :span="7">
                                            <div class="notPhoneTxt smallTxt">持卡人：刘溜溜</div>
                                        </el-col>
                                        <el-col :span="8">
                                            <div class="notPhoneTxt smallTxt">湖南长沙</div>
                                        </el-col>
                                    </el-row>
                                </el-col>
                                <el-col :span="4">
                                    <div class="pull-right">
                                        <button class="callBackBtn" @click="callBackVisible=true">
                                            <i><img src="../images/huiphone.png"></i>
                                            <span> 回拨</span>
                                        </button>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="notPhoneItem">
                            <el-row type="flex" justify="center">
                                <el-col :span="18">
                                    <el-row type="flex" :gutter="1" justify="center" style="line-height:24px;">
                                        <el-col :span="2">
                                            <div class="notPhoneIcon"><img src="../images/wphone.png" alt=""></div>
                                        </el-col>
                                        <el-col :span="6">
                                            <div class="notPhoneTxt numTxt">186****5506</div>
                                        </el-col>
                                        <el-col :span="12">
                                            <div class="notPhoneTxt huiTxt">2019-08-08 12:12:12</div>
                                        </el-col>
                                        <el-col :span="2">
                                            <div class="notPhoneIcon" style="cursor: pointer;" @click="openPhoneRecord($event)"><img src="../images/txt.png" alt=""></div>
                                        </el-col>
                                    </el-row>
                                    <el-row type="flex" :gutter="1" justify="center" style="line-height:24px;">
                                        <el-col :span="9">
                                            <div class="notPhoneTxt smallTxt">呼入：3次 | 呼出：2次</div>
                                        </el-col>
                                        <el-col :span="7">
                                            <div class="notPhoneTxt smallTxt">持卡人：刘溜溜</div>
                                        </el-col>
                                        <el-col :span="8">
                                            <div class="notPhoneTxt smallTxt">湖南长沙</div>
                                        </el-col>
                                    </el-row>
                                </el-col>
                                <el-col :span="4">
                                    <div class="pull-right">
                                        <button class="callBackBtn" @click="callBackVisible=true">
                                            <i><img src="../images/huiphone.png"></i>
                                            <span> 回拨</span>
                                        </button>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="notPhoneItem">
                            <el-row type="flex" justify="center">
                                <el-col :span="18">
                                    <el-row type="flex" :gutter="1" justify="center" style="line-height:24px;">
                                        <el-col :span="2">
                                            <div class="notPhoneIcon"><img src="../images/wphone.png" alt=""></div>
                                        </el-col>
                                        <el-col :span="6">
                                            <div class="notPhoneTxt numTxt">186****5506</div>
                                        </el-col>
                                        <el-col :span="12">
                                            <div class="notPhoneTxt huiTxt">2019-08-08 12:12:12</div>
                                        </el-col>
                                        <el-col :span="2">
                                            <div class="notPhoneIcon" style="cursor: pointer;" @click="openPhoneRecord($event)"><img src="../images/txt.png" alt=""></div>
                                        </el-col>
                                    </el-row>
                                    <el-row type="flex" :gutter="1" justify="center" style="line-height:24px;">
                                        <el-col :span="9">
                                            <div class="notPhoneTxt smallTxt">呼入：3次 | 呼出：2次</div>
                                        </el-col>
                                        <el-col :span="7">
                                            <div class="notPhoneTxt smallTxt">持卡人：刘溜溜</div>
                                        </el-col>
                                        <el-col :span="8">
                                            <div class="notPhoneTxt smallTxt">湖南长沙</div>
                                        </el-col>
                                    </el-row>
                                </el-col>
                                <el-col :span="4">
                                    <div class="pull-right">
                                        <button class="callBackBtn" @click="callBackVisible=true">
                                            <i><img src="../images/huiphone.png"></i>
                                            <span> 回拨</span>
                                        </button>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </div>
                <div class="toolsModal" :class="toolsVisible == true?'show':'hidden'">
                    <div class="notPhoneHeader clearfix">
                        <div class="pull-left">
                            <img class="missPhoneIcon" src="../images/toolsIcon.png" alt=""> 
                            <span class="missPhoneTxt">工具箱</span>
                        </div>
                        <div class="pull-right">
                            <img style="mgr10" class="closeIconAdd" @click="toolsAddVisible=true,toolsVisible = false" src="../images/addTools.png" alt="">
                            <img class="closeIcon" @click="toolsVisible = false" src="../images/x.png" alt="">
                        </div>
                    </div>
                    <div class="toolsContent">
                        <el-row type="flex" :gutter="10" justify="center" style="margin-top:10px;">
                            <el-col :span="6">
                                <div class="toolsList"><img src="../images/calculatorTls.png" alt=""></div>
                                <div class="toolsText">计算器</div>
                            </el-col>
                            <el-col :span="6">
                                <div class="toolsList"><img src="../images/phoneTls.png" alt=""></div>
                                <div class="toolsText">手机归属地</div>
                            </el-col>
                            <el-col :span="6">
                                <div class="toolsList"><img src="../images/idCardTls.png" alt=""></div>
                                <div class="toolsText">身份证查询</div>
                            </el-col>
                            <el-col :span="6">
                                <div class="toolsList"><img src="../images/mapTls.png" alt=""></div>
                                <div class="toolsText">电子地图</div>
                            </el-col>
                        </el-row>
                        <el-row type="flex" :gutter="10" justify="center" style="margin-top:20px;">
                            <el-col :span="6">
                                <div class="toolsList"><img src="../images/cityTls.png" alt=""></div>
                                <div class="toolsText">城市查询</div>
                            </el-col>
                            <el-col :span="6">
                                <div class="toolsList"><img src="../images/areaTls.png" alt=""></div>
                                <div class="toolsText">区号查询</div>
                            </el-col>
                            <el-col :span="6">
                                <div class="toolsList"><img src="../images/assemblyTls.png" alt=""></div>
                                <div class="toolsText">集号吧</div>
                            </el-col>
                            <el-col :span="6">
                                <div class="toolsList"><img src="../images/ipTls.png" alt=""></div>
                                <div class="toolsText">IP地址</div>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </ul>
        </header>
        <!-- <transition name="slide-fade"> -->
            <router-view></router-view>
        <!-- </transition> -->
    
        <!-- 每日未到账业绩弹框 -->
        <el-dialog title="新增实用工具" :close-on-click-modal="false" :visible.sync="toolsAddVisible" width="450px">
        <el-form :model="toolsAddform" :rules="toolsAddformRule" ref="toolsAddform" label-width="120px">
            <el-row>
            <el-col :md="24">
                <el-form-item label="工具名称：" prop="name">
                <el-input v-model="toolsAddform.name" style="width:270px"></el-input>
                </el-form-item>
            </el-col>
            <el-col :md="24">
                <el-form-item label="链接地址：" prop="url">
                <el-input v-model="toolsAddform.url" style="width:270px" placeholder=""></el-input>
                </el-form-item>
            </el-col>
            </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="toolsAddVisible = false">取消</el-button>
            <el-button type="primary" @click="toolsAddVisible = false">保存</el-button>
        </span>
        </el-dialog>

        <!-- 通话记录弹框 -->
        <div class="phone-modal sound-modal" :style="phoneLocation" v-if="phoneRecord">
            <h3 style="margin-top:10px;font-size: 20px;">通话记录</h3>
            <button class="closeBtn" @click="phoneRecord = false">
                <i></i>
            </button>
            <ul class="recordNav clearfix">
                <li :class="callRecord ==true?'active':''" @click="callRecord = true">
                <a href="###">去电记录</a>
                </li>
                <li :class="callRecord ==false?'active':''" @click="callRecord = false">
                <a href="###">来电记录</a>
                </li>
            </ul>
            <div class="soundWrap">
                <table width="100%" cellspacing="0" cellpadding="0" class="soundTab" style="display: table;" v-if="callRecord ==true">
                <tbody>
                    <tr>
                        <td>2019-04-14 17:01:49</td>
                        <td>去电(05min06s)</td>
                        <td>
                            <div class="playVoice">播放录音</div>
                        </td>
                    </tr>
                    <tr>
                        <td>2019-04-14 16:57:32</td>
                        <td>去电(05min06s)</td>
                        <td>
                            <div class="playVoice">播放录音</div>
                        </td>
                    </tr>
                </tbody>
                </table>
                <table width="100%" cellspacing="0" cellpadding="0" class="soundTab none" style="display: table;" v-if="callRecord ==false">
                <tbody>
                    <tr>
                        <td>2019-04-08 10:07:55</td>
                        <td>来电(05min06s)</td>
                        <td>
                            <div class="playVoice">播放录音</div>
                        </td>
                    </tr>
                    <tr>
                        <td>2019-04-08 10:07:55</td>
                        <td>来电(05min06s)</td>
                        <td>
                            <div class="playVoice">播放录音</div>
                        </td>
                    </tr>
                </tbody>
                </table>
            </div>
        </div>

        <!-- 回拨弹框 -->
        <div class="phone-modal callBackBox" style="bottom: 10%; right: 10%;" v-if="callBackVisible==true">
            <div class="cHeader">
                已被拨打<span style="color:#d53a1b;font-size:36px;">3</span>次
                <span style="border-bottom:1px solid white;float:right;margin-top:20px;font-size:16px;cursor:pointer;">通话记录>></span>
            </div>
            <div class="cBody">
                <div class="phoneNum">186***8888</div>
                <div class="hangUp" @click="callBackVisible=false"><i></i>挂断</div>
                <div class="tishi"><i></i><span style="font-size:14px;">请前往相关案件详情做工作记录！</span></div>
            </div>
        </div>
    </div>
</template>

<script>
//导出Home组件
export default {
    name:'Home',
    data () {
        return {
            iphoneVisible:false,
            toolsVisible:false,
            toolsAddVisible:false,
            phoneRecord:false,
            callRecord: true,
            callBackVisible:false,
            phoneLocation:"top:100px;right:100px;",
            toolsAddform:{
            name:"",
            url:""
            },
            toolsAddformRule: {
                name: [{ required: false, message: "未设置提示", trigger: "blur" }],
                url: [{ required: false, message: "未设置提示", trigger: "blur" }]
            },
        }
    },
    methods: {
        toHome(){
            this.$router.push({name:'index'})
        },
        notPhoneShow(){
            this.iphoneVisible = true
            this.toolsVisible = false
        },
        toolsShow(){
            this.toolsVisible = true
            this.iphoneVisible = false
        },
        openPhoneRecord(e){
            var newTop=e.clientY+40;
            this.phoneLocation = "top:"+newTop+"px;right:180px";
            this.phoneRecord=true;
        }
        // toolsAdd(){
        //     this.toolsVisible = true
        //     this.iphoneVisible = false
        // }
    }
}
</script>

<style scoped>
/* scoped是表明未局部css样式，没写scoped就是全局css样式 */
/* 路由激活样式 */
.router-link-active{
    border-bottom-color: #fff !important;
    opacity: 1 !important;
    background-color: transparent !important;
}
.sysTitle{
    cursor: pointer;
}
/*header start */
header {
    height: 48px;
    background: #2e76ee;
    padding: 0px 20px
}
.sysTitle {
    background: url("../images/idnex.png") no-repeat;
    padding-left: 35px;
    color: #fff;
    font-size: 20px;
    font-weight: bold;
    display: inline-block;
    vertical-align: middle;
    margin-right: 20px
}

.sysNav {
    display: inline-block;
    vertical-align: middle;
    width: 680px
}

.sysNav .nav {
    display: flex;
    vertical-align: middle;
    justify-content: space-between
}

.sysNav li a {
    color: #fff;
    font-size: 16px;
    padding: 0;
    height: 47px;
    line-height: 47px;
    display: block;
    text-align: center;
    padding: 0px 5px;
    border-bottom: 3px solid transparent;
    opacity: 0.6
}

.sysNav li a:hover,
.sysNav li.active a,
.sysNav li a:focus {
    border-bottom-color: #fff;
    opacity: 1;
    background-color: transparent
}


.navbar-top-links li {
    float: left
}

.navbar-top-links li:hover a {
    background-color: #2f65bf
}

.navbar-top-links li a {
    display: table-cell;
    padding: 0 12px;
    vertical-align: middle;
    height: 48px;
    color: #758697;
    transition: all .4s;
}

.phoneNo {
    display: block;
    width: 22px;
    height: 22px;
    background: url("../images/idnex.png") no-repeat;
    background-position: 0px -50px
}

.Pnumber {
    position: absolute;
    font-size: 12px;
    color: #fff;
    top: 8px;
    right: -2px;
    background-color: #ff5353;
    width: 18px;
    height: 18px;
    display: block;
    border-radius: 50%;
    text-align: center;
    line-height: 18px
}
.dtls{
    margin-top: 10.5px;
    cursor: pointer;
}
.notPhoneModal{
    position:absolute;
    width: 500px;
    height: 253px;
    top: 55px;
    right: 40px;
    background-color: #fff;
    border:1px solid #ddd;
    z-index: 9999;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
}
.toolsModal{
    position:absolute;
    width: 400px;
    height: 270px;
    top: 55px;
    right: 115px;
    background-color: #fff;
    border:1px solid #ddd;
    z-index: 9999;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
}
.notPhoneHeader{
    height: 45px;
    border-bottom: 1px solid #ddd;
    font-size: 16px;
    color: #303133;
    line-height: 45px;
    padding: 0 15px;
}
.dtls-tools{
    width: 40px;
}
.missPhoneIcon,.closeIcon{
    position: relative;
    top: -2px;
    cursor: pointer;
}
.closeIconAdd{
    position: relative;
    top: -2px;
    right: 10px;
    cursor: pointer;
}
.missPhoneTxt{
    margin-left: 5px;
}
.phoneSpan{
    position: relative;
    display: table-cell;
    padding: 0 12px;
    vertical-align: middle;
    height: 48px;
    cursor: pointer;
}
.toolsContent{
    padding: 15px;
}
.toolsList{
    text-align: center;
    cursor: pointer;
}
.toolsText{
    text-align: center;
    margin-top: 5px;
    cursor: pointer;
}
/* 未接来电 */

.notPhoneItem{
    padding: 10px 0;
    border-bottom: 1px solid #ddd;
}
.notPhoneTxt{
    text-align: center;
}

.numTxt{
    color:red;
    font-weight:bold;
    font-size:16px;
}
.huiTxt{
    color: #909399;
}
.smallTxt{
    font-size: 12px;
    font-weight: bold;
}
.callBackBtn{
    margin-top: 10px;
    color: #FFF;
    background-color: #409EFF;
    border-color: #409EFF;
    padding: 3px 10px;
    outline: none;
    border: 0;
    border-radius:4px;
}

.notPhoneContent{
    height: 207px;
    overflow-y: auto;
}
/*header end*/
/* 通话记录弹窗 */
.phone-modal {
  background: rgba(0, 0, 0, 0.8);
  border-radius: 5px;
  position: fixed;
  padding: 20px;
  color: #fff;
  z-index: 10000;
}
.phone-modal table td {
  padding: 4px 0;
}
.sound-modal .soundTab td {
  padding: 4px 8px;
  color: #0099f7;
}
.closeBtn {
  position: absolute;
  top: 1px;
  right: 1px;
  width: 30px;
  height: 30px;
  background: rgba(0, 0, 0, 0);
  border: none;
  outline: none;
  cursor: pointer;
}
.closeBtn:hover {
  border-color: #38a0f4;
}
.closeBtn:hover i {
  color: #38a0f4;
}
.closeBtn i {
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
  position: relative;
  display: block;
}
.closeBtn i:after {
  height: 1.3em;
  width: 2px;
}
.closeBtn i:before {
  width: 1.3em;
  height: 2px;
}
.closeBtn i:after,
.closeBtn i:before {
  content: "";
  box-shadow: inset 0 0 0 1px;
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
.recordNav {
  padding-left: 0;
}
ol,
ul,
li {
  list-style: none;
}
.recordNav li {
  float: left;
}
.recordNav li {
  margin-right: 50px;
}
.recordNav li a {
  display: block;
  font-size: 16px;
  color: #fff;
  border-bottom: 2px solid transparent;
  line-height: 26px;
}
.recordNav li.active a {
  color: #40ca16;
  border-bottom-color: #40ca16;
}
a:hover,
a:focus {
  text-decoration: none;
  outline: 0 !important;
}
.sound-modal .soundTab td {
  padding: 4px 8px;
  color: #0099f7;
}
.playVoice{
    padding: 2px 8px;
    cursor: pointer;
    color: #cecece;
    border: 1px solid #666;
    border-radius: 2px;
}
.playVoice:hover{
    background-color: #484848;
}
/* 回拨弹窗 */
.callBackBox{
    width: 400px;
}
.cHeader{
    font-size: 20px;
}
.phoneNum{
    font-size: 38px;
    background-color: #e2e2e2;
    color: black;
    background-color: white;
    text-align: center;
    letter-spacing: 10px;
    border-radius: 3px;
    margin-top: 10px;
}
.hangUp{
    background-color: #d53a1b;
    text-align: center;
    font-size: 20px;
    height: 38px;
    line-height: 38px;
    cursor: pointer;
    border-radius: 3px;
    margin-top: 10px;
}
.hangUp i{
    background: url('../images/phoneStatus.png') no-repeat;
    padding-left: 30px;
    background-position: 0px -52px;
}
.tishi{
    margin-top: 10px;
    font-size: 18px;
}
.tishi i{
    background: url('../images/tishi.png') no-repeat;
    padding-left: 30px;
    background-position: 0px 0px;
}
/* 路由切换动画 */
/* .slide-fade{
    position: absolute;
    left: 0;
    right: 0;
}
.slide-fade-enter-active{
    transition:all 1.2s ease;
}
.slide-fade-leave-active{
    transition: all .1s cubic-bezier(2.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter,.slide-fade-leave-to{
    left: 0;
    right: 0;
    transform: translate(50px);
    opacity: 0;
} */
</style>
