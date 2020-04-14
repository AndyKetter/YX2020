<template>
    <div style="font-size:13px">
        <div class="mailTitle text-overflow">关于五月试用期员工购买社保的通知</div>
        <div class="mart30">
            <el-button size="mini" icon="el-icon-back">返回</el-button>
            <el-button size="mini" icon="el-icon-edit">回复</el-button>
            <el-button size="mini" icon="el-icon-position">转发</el-button>
            <el-button size="mini" icon="el-icon-close">删除</el-button>
            <el-button size="mini" icon="el-icon-house">首页</el-button> 
            <el-button-group class="pull-right">
                <el-button size="mini" icon="el-icon-arrow-up">上一封</el-button>
                <el-button size="mini" icon="el-icon-arrow-down">下一封</el-button>                      
            </el-button-group>      
        </div>
        <hr style="height:1px;background-color:#e5e5e5;border:0"/>

        <div class="mgt15">
           <img src="../images/user.png" alt="" class="userImg pull-left">
           <div style="display:inline-block;height:46px" class="mgl10 mgr10">
               <b class="mgr10" style="font-size:14px">朱新桃</b>
               <el-button icon="el-icon-plus" size="mini" @click="addFriendDialog = true">加为好友</el-button>
               <br/>
               <span style="font-size:12px;display:inline-block;margin-top:5px">智慧催技术研发部，<i class="el-icon-mobile-phone"></i>****7965</span></div>
        </div>
        
        <div class="flex mgt15">
            <label style="min-width:60px;color:#999">收件人：</label>
            <ul style="margin-top:0">
                <li class="receiver">周雄<span>[总裁办公会，<i class="el-icon-mobile-phone"></i>****6688]及所有下属</span></li>
                <li class="receiver">李磊<span>[总裁办公会，<i class="el-icon-mobile-phone"></i>****6668]及所有下属</span></li>
                <li class="receiver">程志远<span>[总裁办公会，<i class="el-icon-mobile-phone"></i>****6668]及所有下属</span></li>
                <li class="receiver">吴忠文<span>[总裁办公会，<i class="el-icon-mobile-phone"></i>****6668]及所有下属</span></li>
            </ul>
        </div>

        <label style="width:55px;color:#999;display:inline-block">时&nbsp;&nbsp;&nbsp;&nbsp;间：</label>
        <span style="color:#999">2019-05-15 15:11:56</span>
        <hr style="height:1px;background-color:#e5e5e5;border:0"/>
        
        <p>
            <i class="el-icon-paperclip"></i>&nbsp;
            <b>附件（2）</b>
            <b style="color:#42a5f5;cursor:pointer">全部下载</b> 
        </p>
        <ul class="mail-attach-list clearfix">
            <li class="att_li">
                <div class="imgWrap">
                   <img src="../images/fileType.png">
                </div>              
                <span class="text-overflow attach_title" title="社保缴纳须知社保缴纳须知.doc">社保缴纳须知社保缴纳须知.doc</span><br/>
                <span class="fileSize">38.2k</span>          
            </li>
            <li class="att_li">
                <div class="view">
                    <a><i class="el-icon-download"></i><br/>下载</a>
                    <a @click="viewDialog=true"><i class="el-icon-view"></i><br/>预览</a>
                </div>
                <div class="triangle"></div>
                <div class="imgWrap">
                   <img src="../images/fileType2.png">
                </div>              
                <span class="text-overflow attach_title" title="社保卡照片.jpg">社保卡照片.jpg</span><br/>
                <span class="fileSize">10.2k</span>          
            </li>
        </ul>
        <p>邮件内容邮件内容邮件内容邮件内容邮件内容</p>
        <div class="quickReply" v-if="quickFlag">
            <div>
                <strong @click="quickReplyClick">快捷回复此邮件...</strong>
            </div>
        </div>
        <div class="editorWrap" v-if="editorFlag">
            <Editor :catchData="catchData" :content="setEditorContent"></Editor>
            <div><el-button class="sendEmail" type="primary" icon="el-icon-s-promotion" @click="sendClick">发邮件(Ctrl+Enter)</el-button></div>
        </div>
        <!-- 添加好友弹框 -->
    <el-dialog title="添加好友" :visible.sync="addFriendDialog" width="400px">
      <div style="text-align:center;">
         <label>选择分组：</label>
         <el-select v-model="friendGroup" placeholder="请选择">
            <!-- <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option> -->
            <el-option>分组1</el-option>
            <el-option>分组2</el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addFriendDialog=false">确定</el-button>
      </span>
    </el-dialog>

    <!-- 附件图片预览 -->
    <el-dialog title="" :visible.sync="viewDialog" width="60%">
      <div style="text-align:center;">
        <img src="../images/loginBg.jpg" style="width:80%;">        
      </div>     
    </el-dialog>

    </div>
</template>

<script>
import Editor from '../components/Editor'

export default {
    name:'inboxDatails',
    components:{
        Editor
    },
    data(){
        return{
            getEditorContent:'',
            setEditorContent:'', //初始化富文本的显示的值，或者可以通过这个值来赋值
            addFriendDialog:false,
            viewDialog:false,
            editorFlag:false,
            quickFlag:true,
            friendGroup:''
        }
    },
    methods: {
        //获取富文本editor中的内容
        catchData(content){
            this.getEditorContent = content
        },
        //模拟给富文本赋初始值，一般是后端请求赋值，所以有延迟，故Editor.vue用的是watch去监听而不是computed
        setEditorHandler(){
            setTimeout(()=>{
                this.$nextTick(function(){
                    this.setEditorContent = "<p>模拟后端拿到的初始化值</p>"
                })
            },2000)
        },
        quickReplyClick(){ //快速回复
            this.editorFlag = true
            this.quickFlag = false
        },
        //发送邮箱
        sendClick(){
            this.$msgBox.alert('确定发送邮件？','温馨提示',{
                confirmButtonText:'确定',
                    callback:()=>{
                    this.$message({
                        type:'success',
                        message:'操作成功！'
                    })
                }
            })
        }
    },
    created(){
        //模拟请求后端初始化富文本的值
        this.setEditorHandler()
    }
}
</script>

<style scoped>
.sendEmail{
    margin-top: 20px;
}
.mart30{
    margin-top:30px;
}
.receiver{
    border:1px solid #c2d4e3;
    border-radius:10px;
    background-color: #eaf4fc;
    padding: 2px 10px;
    margin-bottom: 5px;
    font-size: 13px;
    display: inline-block;
    margin-right: 10px;
}
.receiver:hover{
    border-color:#98b1c6;
    background-color: #d5e5f2;
}
.receiver span{
    color:#bbb;
}
.quickReply{
    padding: 10px;
    border: 1px solid #c5ccd7;
    background-color: #f5f7fa;
}
.quickReply div{
    border: 1px solid #d0d0d0;
    background-color: #fff;
    box-shadow: 0 0 8px lightgray inset;
    min-height: 150px;
    cursor: pointer;
    padding: 10px 15px;
    color:#758697;

}
.quickReply div:hover{
    color:#3b3bf5;
}
.att_li{
    width: 100px;
    border: 1px solid #e9e9e9;
    padding: 5px;
    text-align: center;
    cursor: pointer;
    position: relative;
}
.att_li span{
    display: inline-block;
    margin-bottom: 5px;
    width: 100%;
}
.attach_title{
    color:#000;
}
.att_li:hover{
   border-color:#0b76c0;
}
.att_li:hover .attach_title{
   color:#0b76c0;
}
.mail-attach-list .att_li{
    float: left;
    margin-right: 20px;
}
.att_li:hover .view{
    display: block;
}
.att_li:hover .triangle{
    display: block;
}
.view{
    display: none;
    width: 92px;
    height: 45px;
    background-color: #404040;
    position: absolute;
    top:-90px;
    left: 0;
    padding: 15px 10px;
    opacity: 0.9;
    box-shadow: 0 0 10px #555;
}
.view a{
    color: #fff;
    width: 50%;
    float: left;
}
.view a i{
  font-size: 25px;
}
.triangle{
   width: 0;
   height: 0;
   border: 15px solid;
   border-color:#404040 transparent transparent transparent;
   margin-left:20px;  
   position: absolute;
   top:-15px;
   left: 20px;
   opacity: 0.9;
   display: none;
}
.att_li .imgWrap{
    height:32px;
    padding:10px;
    text-align:center;
    background-color:#f5f6f8;
    margin-bottom:10px;
}
.fileSize{
   color:#758697;
   font-size:12px;
}

</style>
