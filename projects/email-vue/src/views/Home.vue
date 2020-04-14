<template>
  <div class="home">
    <el-container>
      <el-aside width="230px">
        <el-card shadow="hover" class="leftContent">
          <div class="userWrap clearfix pointer">
            <div class="pull-left">
              <img class="userImg" src="../images/user.png" alt="用户头像">
            </div>
            <div class="pull-left userInfo">
              <div class="userName">彭坤</div>
              <div class="platformNum">15386015356</div>
            </div>
            <div class="pull-right caretWrap">
              <i class="el-icon-caret-left leftIcon"></i>
              <i class="el-icon-caret-bottom bottomIcon"></i>
            </div>
            <div class="toggleLogin">
              <ul>
                <li><i class="dot"></i>我的邮箱</li>
                <li><i class="dot"></i>科技部</li>
                <li><i class="dot"></i>智慧催技术研发部</li>
              </ul>
              <div class="reLogin" @click="toLogin">重新登录</div>            
          </div>
          </div>
          
          <div class="writeEmail padding15">
            <el-button type="success" class="wrlBtn" @click="toWrite">写邮件</el-button>
          </div>
          <div class="folder">
            文件夹
          </div>
          <ul class="nav">
            <li><router-link class="f_list" to="/home/inbox"><i class="el-icon-folder-opened"></i>&nbsp;收件箱</router-link></li>
            <li><router-link class="f_list" to="/home/draft"><i class="el-icon-document"></i>&nbsp;草稿箱</router-link></li>
            <li><router-link class="f_list" to="/home/sent"><i class="el-icon-document-checked"></i>&nbsp;已发送</router-link></li>
            <li><router-link class="f_list" to="/home/recycle"><i class="el-icon-delete"></i>&nbsp;回收站</router-link></li>
          </ul>
          <div class="folder tags">标签
            <i class="el-icon-caret-bottom botIcon" style="cursor:pointer" @click="toggleTags"></i>
            <i class="el-icon-caret-left lftIcon" style="cursor:pointer"></i>
            <span class="btn-mini pull-right" @click="manageTags=true">管理</span>
          </div>
          <el-row :gutter="5" class="padding15" id="tagGroup" v-show="tagsFlag">
            <el-col :span="12">
                <el-button  icon="el-icon-collection-tag" class="text-overflow width90" title="重要邮件1">重要邮件1</el-button>
            </el-col>
            <el-col :span="12">
                <el-button icon="el-icon-collection-tag" class="text-overflow width90" title="重要邮件2">重要邮件2</el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-aside>
      <el-main>
        <el-card shadow="hover" class="mainContent">
          <router-view></router-view>
        </el-card>
      </el-main>
    </el-container>

    <!-- 管理标签弹框 -->
    <el-dialog title="标签管理" :visible.sync="manageTags" width="600px">
        <div style="text-align:center;">
           <label>添加标签：</label>
           <el-input style="width:200px"></el-input>
        </div>
        <div class="tagList">
          <el-tag closable size="medium">重要邮件1</el-tag>
          <el-tag closable size="medium" class="mgl10">重要邮件2</el-tag>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="manageTags=false">立即添加</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
        manageTags:false,
        tagsFlag:true,
    }
  },
  methods:{
    toWrite(){
      this.$router.push({name:'write'})
    },
    toLogin(){
      this.$router.push({name:'login'})
    },
    toggleTags(){
      this.tagsFlag = !this.tagsFlag;
    }
  }
}
</script>

<style>
  .leftContent>.el-card__body{
    padding: 0;
  }
</style>

<style scoped>
  /* 路由激活样式 */
   .router-link-active{
      color:#fff!important;
      background-color:#42a5f5;
      border-color:#42a5f5;
  } 
  .home{
    height: 100%;
    background-color: rgb(236, 240, 245);
  }
  .el-container{
    height: 100%;
  }
  .el-aside{
    height: 100%;
    padding: 15px 0 15px 15px;
  }
  .el-main{
    height: 100%;
    padding: 15px;
  }
  .leftContent,
  .mainContent{
    height: 99.5%;
  }
  .mainContent{
    overflow-y: auto
  }
  .userWrap{
    position: relative;
    padding: 30px 15px 12px;
    border-bottom:1px solid #e5e5e5;
  }
  .platformNum{
    font-size:13px;
    padding-top:2px;
  }
  .userInfo{
    padding-top:4px;
    padding-left:5px;
  }
  .caretWrap{
    padding-top:10px;
  }
  .wrlBtn{
    width: 100%;
  }
  .folder{
    padding: 0 15px;
    font-weight: 700;
  }
  .nav{
     margin:10px 0;
  }
  .nav li{
    height: 40px;
    cursor: pointer;
    font-size:14px;
  }
  .nav li>a{
    text-decoration:none;
    display: inline-block;
    height: 40px;
    line-height: 40px;
    width: 100%;
    color:#000;
  }
  .nav li>a:active{
    color:#333;
  }
  .nav li:hover{
    background-color:#e9e9e9;
  }
  .nav i{
    margin:0 0px 0 15px;
  }
  .tags{
    height:40px;
    line-height:40px;
    border-top:1px solid #e5e5e5;
  }
  .width90{
    width:90px;
  }
  .toggleLogin{
    position: absolute;
    top:80px;
    left: 15px;
    width:185px; 
    background-color:#fff;
    box-shadow:0 5px 12px 2px rgba(0,0,0,0.25);
    font-size:13px;
    display: none;
  }
  .reLogin{
    background-color:#e9e9e9;
    height:35px;
    line-height:35px;
    text-align:center;
    color:#000;
  }
  .reLogin:hover{
    background-color: #409EFF;
    color:#fff;
  }
  .bottomIcon,.lftIcon{
    display:none;
  }
  .userWrap:hover .toggleLogin{
    display:block;
  }
  .userWrap:hover .bottomIcon{
    display:block;
  }
  .userWrap:hover .leftIcon{
    display:none;
  }
  .toggleLogin ul li{
     height: 30px;
     line-height:30px;
  }
  .toggleLogin ul{
     padding-left:0;
     list-style-type:none;
  }
  .toggleLogin ul li:hover{
     background-color:#e9e9e9;
  }
  .dot{
    width:10px;
    height: 10px;
    border-radius:5px;
    background-color:#67C23A;
    display: inline-block;
    margin:0 10px 0 15px;
  }

  
</style>

