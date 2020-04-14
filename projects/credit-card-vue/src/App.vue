<template>
  <div id="app" v-cloak>
    <img v-if="robotFlag" @mouseenter="enter" @mouseleave="leave" class="robot" src="./images/robot.png" alt="机器人">
    <img v-else @mouseenter="enter" @mouseleave="leave" class="robot" src="./images/robot.gif" alt="机器人">
    <div class="rbtMsg" v-if="rbtMsgFlag">
      HI  我是智能小催，开发哥哥正在 研发中，以后有问题随时找我哦~
    </div>
    <div class="feedback" @click="suggestVisible=true">
      <div class="fD suggest">建议</div>
      <div class="fD fdb">反馈</div>
    </div>
    <!-- 建议反馈弹框 -->
    <el-dialog title="建议反馈" :close-on-click-modal="false" :visible.sync="suggestVisible" width="768px">
      <el-tabs v-model="activeName" @tab-click="handleClick" class="tabsTitle">

        <el-tab-pane label="提交反馈" name="first">
          <el-input v-model.trim="context" type="textarea" :rows="8" placeholder="请输入建议反馈"></el-input>
          <div class="sg-error" v-if="context.length == 0 || context.length>200">温馨提示：输入的字数范围需在0-200字</div>
        </el-tab-pane>

        <el-tab-pane label="查看反馈" name="second" class="table_wrap">
          <el-table :data="feedBackData" border style="width:100%">
            <el-table-column prop="name" width="80" label="姓名"></el-table-column>
            <el-table-column prop="date" width="150" label="时间"></el-table-column>
            <el-table-column prop="department" width="120" :show-overflow-tooltip="true" label="部门"></el-table-column>
            <el-table-column prop="context" label="反馈内容" :show-overflow-tooltip="true"></el-table-column>
          </el-table>
          <div id="sg_pagination">
              <el-pagination 
              @size-change="handleSizeChange"
              @current-change="handlecurrentChange"
              :current-page="currentPage"
              :page-sizes="[10,20]"
              :page-size="pageSize"
              layout="total,sizes,prev,pager,next,jumper"
              :total="total"
              >
              </el-pagination>
          </div>
        </el-tab-pane>

      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="suggestVisible = false">取消</el-button>
        <el-button type="primary" @click="JS_submit">确定</el-button>
      </span>
    </el-dialog>

    <router-view></router-view>
  </div>
</template>

<script>
import Ut from './untils/index.js'
import {createNamespacedHelpers} from 'vuex' //导入map函数与命名空间辅助函数
const {mapActions} = createNamespacedHelpers('app') //命名空间辅助函数

export default {
  name: 'app',
  data () {
    return {
      robotFlag:true,
      suggestVisible:false,
      activeName:'first',
      rbtMsgFlag:false,
      currentPage:1,
      pageSize:10,
      total:1,
      feedBackData:[
        {
          
        }
      ]
    }
  },
  computed: {
    context:{ //vuex双向绑定context特殊处理
      get(){
        return this.$store.state.app.context
      },
      set(value){
        this.$store.commit('app/updateContext',value)
      }
    }
  },
  methods: {
    ...mapActions([
      'saveAdvice' //将this.saveAdvice映射成this.$store.dispatch('app/saveAdvice)
    ]),
    listAjax(current=1,page=10){
      let that = this
      this.axios({
          method:'post',
          url:"/oa-card/newCardSuggest/pageList",
          params:{
            currentPage:current,
            pageSize:page
          }
        }).then(function(response){
          that.currentPage = response.data.Data.data.currentPage
          that.pageSize = response.data.Data.data.pageSize
          that.total = response.data.Data.data.total
          that.feedBackData = response.data.Data.data.data
        })
    },
    enter(){
      this.robotFlag = false
      this.rbtMsgFlag = true
    },
    leave(){
      this.robotFlag = true
      this.rbtMsgFlag = false
    },
    handleClick(tab,event){
      if(this.activeName == 'second'){//查看反馈
        this.listAjax()
      }
    },
    handleSizeChange(val){
        this.pageSize = parseInt(`${val}`) //一定要是int类型
        this.handlecurrentChange(1)
    },
    handlecurrentChange(val){
        this.currentPage = parseInt(`${val}`) //一定要是int类型
        this.listAjax(this.currentPage,this.pageSize)
    },
    JS_submit(){
      if(this.activeName == 'first'){
        if(0<this.context.length && this.context.length<=200){//提交反馈
        this.saveAdvice({ //发建议反馈保存actions传递payload
          context:this.context,
          department:localStorage.getItem('department')
        })
        // this.axios({
        //   method:'post',
        //   url:"/oa-card/newCardSuggest/save",
        //   params:{
        //     context:this.context,
        //     department:that.$route.query.department 
        //   }
        // }
        // ).then(function(response){
        //     if(response.data.Code == 0){ //新增成功
        //       that.$message({
        //         type:'success',
        //         message:'温馨提示：添加意见反馈成功！'
        //       })
        //       that.context = ''
        //     }else{//新增失败
        //       that.$message({
        //         type:'warning',
        //         message:'温馨提示：添加意见反馈失败！'
        //       })
        //     }
        // }) 
      }
      }else{
        this.suggestVisible = false
      }
      
    }
  },
  created () {
    localStorage.setItem('department',this.$route.query.department) //储存部门信息到本地储存
    Ut.setCookie('SESSION',this.$route.query.session) //设置cookie中session
  }
}
</script>

<style>
/* v-clock是修复vue绑定数据双花括号闪烁问题 */
[v-cloak]{
  display: none;
}
</style>
<style scoped>
.robot{
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 999;
  cursor: pointer;
}
.feedback{
  width:50px;
  height:50px;
  position: absolute;
  right: 55px;  
  bottom: 235px;
  z-index: 999;
  cursor: pointer;
  color:#fff;
  background-color: #ff5454;
  text-align:center;
  border-radius:6px;
  box-shadow:0 0 20px rgba(255, 84, 84,0.5);
}
.rbtMsg{
  position: absolute;
  right: 55px;  
  bottom: 135px;
  width:210px;
  height: 45px;
  background-color: #fff;
  cursor: pointer;
  border:1px solid #2e76ee;
  z-index: 999;
  border-radius:4px;
  box-shadow:0 0 20px rgba(46, 118, 238,0.45);
  font-size:12px;
  /* text-align:center; */
  padding:5px;
  color:#2e76ee;
}
.fD{
  height: 25px;
  line-height: 25px;
  font-size:14px;
}
.suggest{
  position: relative;
  top:3px;
}
.fdb{
  position: relative;
  top:-2px;
}
.sg-error{
  margin-top:10px;
  color:#999;
}
.tabsTitle{
  position: relative;
  top:-20px;
}
#sg_pagination{
  margin-top:20px;
}
</style>

