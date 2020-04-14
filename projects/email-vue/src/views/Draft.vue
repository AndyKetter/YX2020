<template>
  <div class="inbox">
        <div class="clearfix">
          <div class="pull-left inboxTitle">草稿箱</div>
          <el-input placeholder="搜索" v-model="search" class="searchInpt pull-right">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
        <div class="fuctAreas">
          <el-button-group class="mar6" style="position:relative">
            <el-button style="padding:7px 14px"><el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="checkAllChange"></el-checkbox></el-button>
            <el-button icon="el-icon-caret-bottom" @click="toggle"></el-button>
            <div class="togglePanel" v-show="play">
              <ul>
                <li @click="allCheckedClick">全选</li>
                <li @click="allUnCheckedClick">全不选</li>
                <li @click="reverseClick">反选</li>
              </ul>  
          </div>
          </el-button-group>
          <el-button icon="el-icon-refresh" @click="refreshClick"></el-button>        
          <el-button icon="el-icon-close" @click="deleteMailClick">删除邮件</el-button>
          <el-button icon="el-icon-search" style="margin-left:6px" @click="toggle3">条件查询</el-button>
          <div class="searchbox" v-show="play3">
             <div class="searchbox_part1">
                  <label>发件人：</label>
                  <el-select 
                    class="senderSelect"
                    v-model="sender" 
                    clearable
                    filterable
                    remote
                    placeholder="请输入发件人"
                    :remote-method="senderRemoteMethod"
                    :loading="senderLoading">
                    <el-option 
                    v-for="item in senderOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                  </el-select>
                  <label  class="mgl10">发件时间：</label>
                  <el-date-picker v-model="timeRange" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" style="width:240px"></el-date-picker>
              </div>
              <div class="searchbox_part2">
                  <label class="mgl10 controlLabel1">{{emailTxt}}&nbsp;</label>
                  <el-switch v-model="allMail" :width="32" @change="toggle4"></el-switch>
                  <label  class="mgl10">{{emplyStatelTxt}}&nbsp;</label>
                  <el-switch v-model="emplyState" :width="32" @change="toggle5"></el-switch>
                  <label  class="mgl10 controlLabel2">邮件内容：</label>
                  <el-input placeholder="输入关键字" style="width:120px" class="mgr10" v-model="emailContent" clearable></el-input>
                  <el-button type="primary">搜索</el-button>
              </div>
          </div>
        </div>
        <hr style="height:1px;background-color:#e5e5e5;border:0"/>
  
    <ul class="mailList mgt10" :style="{height:mailListHeight}">
      <li :class="{hadRead:item.isRead}" v-for="(item,index) in emailDataList" :key="item.id">
         <el-row :gutter="0">
          <el-col :span="8" class="flex">
            <el-checkbox v-model="item.checked" @change="checkedEmailChange"></el-checkbox>
            <img v-if="!item.isRead" src="../images/unread.png" class="unreadIcon">
            <span :class="{boldText:!item.isRead}" class="text-overflow widthlimit1 pointer" @click="searchAddress(item.emailAddresser,'draft')" v-html="item.emailAddresser"></span>
          </el-col>
          <el-col :span="10" class="flex pointer" @click.native="toDraftDts(index,'draft')">
            <span v-if="item.isHaveNotice" class="btn-mini">通知</span>&nbsp;
            <span :class="{boldText:!item.isRead}" class="text-overflow widthlimit">{{item.emailTitle}}</span>
          </el-col>
          <el-col :span="6" class="text-right">
            <i v-if="item.isHaveAttach" class="el-icon-paperclip"></i>
            <span :class="{boldText:!item.isRead}" class="mgl10">{{item.emailTime}}</span>
          </el-col>
         </el-row>
      </li>
    </ul>
   
    <!-- 分页 -->
    <div style="text-align:center;">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[100,200,300,400]" :page-size="100" layout="total,sizes,prev,pager,next,jumper" :total="400"></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "draft",
  data () {
    return {
      mailListHeight:'',
      emailTxt:'全部邮件',
      emplyStatelTxt:'在职员工',
      search:'',
      checkAll:false,
      currentPage:4,   
      play:false,
      play3:false,
      timeRange:"",
      allMail:false,
      emplyState:false,
      emailContent:'',
      sender:[],
      senderLoading:false,
      senderOptions:[],
      senderValue:[],
      senderList:[],
      senderStates:[
        "彭坤<智慧催技术研发部，****5356>",
        "凌心敏<智慧催技术研发部，****7879>",
        "钱俊<智慧催技术研发部，****7829>",
        "汤维<智慧催技术研发部，****7729>",
        "汤宽心<智慧催技术研发部，****7779>",
        "黄舟<智慧催技术研发部，****5559>"
      ],
      emailDataList:[
        {
          id:1,
          checked:false, //checkbox是否选中
          isRead:true, //是否已读
          isHaveNotice:false, //是否有通知
          isHaveAttach:false, //是否有附件
          emailAddresser:'彭坤[rsb@hnyongxiong.cn]', //发件人
          emailTitle:'关于五月试用期员工购买社保的通知', //邮件标题
          emailTime:'2019-05-10 10:17:02' //邮件时间
        },
        {
          id:2,
          checked:false, //checkbox是否选中
          isRead:true, //是否已读
          isHaveNotice:true, //是否有通知
          isHaveAttach:false, //是否有附件
          emailAddresser:'彭坤[rsb@hnyongxiong.cn]', //发件人
          emailTitle:'关于五月试用期员工购买社保的通知', //邮件标题
          emailTime:'2019-05-10 10:17:02' //邮件时间
        },
        {
          id:3,
          checked:false, //checkbox是否选中
          isRead:true, //是否已读
          isHaveNotice:false, //是否有通知
          isHaveAttach:true, //是否有附件
          emailAddresser:'彭坤[rsb@hnyongxiong.cn]', //发件人
          emailTitle:'关于五月试用期员工购买社保的通知', //邮件标题
          emailTime:'2019-05-10 10:17:02' //邮件时间
        },
        {
          id:4,
          checked:false, //checkbox是否选中
          isRead:true, //是否已读
          isHaveNotice:false, //是否有通知
          isHaveAttach:true, //是否有附件
          emailAddresser:'朱新桃[智慧催技术研发部，<i class="el-icon-mobile-phone"></i>****7965]', //发件人
          emailTitle:'关于五月试用期员工购买社保的通知', //邮件标题
          emailTime:'2019-05-10 10:17:02' //邮件时间
        },
        {
          id:5,
          checked:false, //checkbox是否选中
          isRead:true, //是否已读
          isHaveNotice:false, //是否有通知
          isHaveAttach:false, //是否有附件
          emailAddresser:'彭坤[rsb@hnyongxiong.cn]', //发件人
          emailTitle:'关于五月试用期员工购买社保的通知', //邮件标题
          emailTime:'2019-05-10 10:17:02' //邮件时间
        },
        {
          id:6,
          checked:false, //checkbox是否选中
          isRead:true, //是否已读
          isHaveNotice:true, //是否有通知
          isHaveAttach:false, //是否有附件
          emailAddresser:'彭坤[rsb@hnyongxiong.cn]', //发件人
          emailTitle:'关于五月试用期员工购买社保的通知', //邮件标题
          emailTime:'2019-05-10 10:17:02' //邮件时间
        },
        {
          id:7,
          checked:false, //checkbox是否选中
          isRead:true, //是否已读
          isHaveNotice:false, //是否有通知
          isHaveAttach:true, //是否有附件
          emailAddresser:'彭坤[rsb@hnyongxiong.cn]', //发件人
          emailTitle:'关于五月试用期员工购买社保的通知', //邮件标题
          emailTime:'2019-05-10 10:17:02' //邮件时间
        },
        {
          id:8,
          checked:false, //checkbox是否选中
          isRead:true, //是否已读
          isHaveNotice:false, //是否有通知
          isHaveAttach:true, //是否有附件
          emailAddresser:'朱新桃[智慧催技术研发部，<i class="el-icon-mobile-phone"></i>****7965]', //发件人
          emailTitle:'关于五月试用期员工购买社保的通知', //邮件标题
          emailTime:'2019-05-10 10:17:02' //邮件时间
        }
      ],
      isIndeterminate:false
    }
  }, 
  methods:{
    handleSizeChange(val){
      console.log(val) //打印当前一页显示多少条数据
    },
    handleCurrentChange(val){
      console.log(val) //打印当前是第几页
    },
    toggle(){
      this.play = !this.play;
    },   
    toggle3(){
      this.play3 = !this.play3;
    },
    toggle4(){
      if(this.allMail){
        this.emailTxt="未读邮件"
      }else{
        this.emailTxt="全部邮件"
      }
    },
    toggle5(){
      if(this.emplyState){
        this.emplyStatelTxt = "离职员工";
      }else{
        this.emplyStatelTxt = "在职员工";
      }
    },
    toDraftDts(index,type){//跳转到草稿箱详情页
      // let routerDetails = this.$router.resolve({
      //     path: `/home/inbox/${index+1}?type=${type}`
      // })
      // window.open(routerDetails.href,'_blank') //新开路由
      this.$router.push(`/home/draft/${index+1}?type=${type}`) //使用模板字符串
    },
    searchAddress(emailAddresser,type){//查询该邮件人下面所有的邮件
      this.$message({
        type:'success',
        message:`查看点击的邮件人的所有邮件`
      })
    },
    allCheckedClick(){//点击下拉框全选li
      this.isIndeterminate = false
      this.emailDataList.forEach((item)=>{
        item.checked = true
      })
      this.checkAll = true
    },
    allUnCheckedClick(){//点击下拉框全不选li
      this.isIndeterminate = false
      this.emailDataList.forEach((item)=>{
        item.checked = false
      })
      this.checkAll = false
    },
    reverseClick(){//反选
      let itemCheckedLength = 0 //选中多少邮箱列表数据
      this.emailDataList.forEach((item)=>{
        if(item.checked){
          itemCheckedLength++
        }
        item.checked = !item.checked
      })
      let allItemLength = this.emailDataList.length //总邮箱数据个数
      if(itemCheckedLength == 0){//判断选中的个数与总个数的关系
        this.checkAll = true
        this.isIndeterminate = false
      }else if(itemCheckedLength == allItemLength){
        this.isIndeterminate = false
        this.checkAll = false
      }else{//不全等
        this.checkAll = false
        this.isIndeterminate = true
      }
    },
    checkAllChange(val){//全选非全选
      if(val){//全选
        this.emailDataList.forEach((item)=>{
          item.checked = true
        })
      }else{//全不选
        this.emailDataList.forEach((item)=>{
          item.checked = false
        })
      }
      this.isIndeterminate = false
    },
    checkedEmailChange(val){//循环的邮箱是否被勾选
      let itemCheckedLength = 0 //选中多少邮箱列表数据
      this.emailDataList.forEach((item)=>{
        if(item.checked){
          itemCheckedLength++
        }
      })
      let allItemLength = this.emailDataList.length //总邮箱数据个数
      if(itemCheckedLength == allItemLength){//判断选中的个数与总个数的关系
        this.checkAll = true
        this.isIndeterminate = false
      }else if(itemCheckedLength == 0){
        this.checkAll = false
        this.isIndeterminate = false
      }else{
        this.checkAll = false
        this.isIndeterminate = true
      }
    },
    refreshClick(){//点击刷新按钮
      const loadingInstance = this.$loading({
          fullScreen: true,
          lock: true,
          background: 'rgba(255, 255, 255, .3)'
      })
      setTimeout(() => {
          loadingInstance.close()
      }, 500)
    },
    deleteMailClick(){//删除邮件
      let itemCheckedLength = 0 //选中多少邮箱列表数据
      let deleteIndexArr = [] //用于保存要删除的邮件数组的下标
      this.emailDataList.forEach((item,index)=>{
        if(item.checked){
          itemCheckedLength++
          deleteIndexArr.unshift(index) //储存选中下标
        }
      })
      if(itemCheckedLength == 0){ //没有勾选
        this.$msgBox.alert('请选择要删除的邮件！','温馨提示',{
          confirmButtonText:'确定',
          callback:()=>{
            
          }
        })
      }else{//有勾选
        this.$msgBox.confirm('确定要删除勾选邮件？','温馨提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).then(()=>{
          deleteIndexArr.forEach(v=>{
            this.emailDataList.splice(v,1) //遍历删除选中的
          })
          this.checkAll = false //去掉全选的勾选
          this.isIndeterminate = false
          this.$message({
            type:'success',
            message:'操作成功！'
          })
        }).catch(()=>{
          
        })
      }
      
    },
    //收件人
    senderRemoteMethod(query){
      if(query !== ''){
        this.senderLoading = true
        setTimeout(()=>{
          this.senderLoading = false
          this.senderOptions = this.senderList.filter(item=>{
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
          })
        },200)
      }else{
        this.senderOptions = []
      }
    }
  },
  mounted() {
    //收件人
    this.senderList = this.senderStates.map(item=>{
      //这里面可以对label，value做循环定制格式
      return {value:item,label:item}
    })
    this.mailListHeight = (window.innerHeight - 225)+'px' //动态计算mailList的高度
  }
}
</script>

<style scoped>
  .searchInpt{
    width: 240px;
  }
</style>
