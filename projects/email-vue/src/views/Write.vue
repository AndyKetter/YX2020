<template>
  <div class="write">
    <div class="clearfix">
      <div class="pull-left writeTitle">写件箱</div>
      <div class="pull-right">
        <el-checkbox-group v-model="checkboxGroup">
          <el-checkbox-button v-for="f in fnList" :label="f" :key="f" @change="cBoxHandle(f)">{{f}}</el-checkbox-button>
        </el-checkbox-group>
      </div>
    </div>
    <div class="fuctAreas">
      <div class="flexBox">
        <div class="labelWidth">收件人</div>
        <div class="recipientInpt">
          <el-select 
          class="recipientSelect"
          v-model="recipient" 
          multiple 
          filterable
          remote
          placeholder="请输入收件人"
          :remote-method="recipientRemoteMethod"
          :loading="recipientLoading">
            <el-option 
            v-for="item in recipientOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="recipientBtn tr">
          <el-button type="primary" icon="el-icon-s-custom" @click="addressBookClick">通讯录</el-button>
        </div>
      </div>
      <div class="flexBox mgt20">
        <div class="labelWidth">主题</div>
        <div class="themeInpt">
          <el-input v-model="theme" />
        </div>
      </div>
      <div class="flexBox mgt20" v-if="copyShow">
        <div class="labelWidth">抄送</div>
        <div class="copyInpt">
          <el-select 
          class="copySelect"
          v-model="copy" 
          multiple 
          filterable
          remote
          placeholder="请输入抄送人"
          :remote-method="copyRemoteMethod"
          :loading="copyLoading">
            <el-option 
            v-for="item in copyOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="flexBox mgt20" v-if="secretShow">
        <div class="labelWidth">密送</div>
        <div class="secretInpt">
          <el-select 
          class="secretSelect"
          v-model="secret" 
          multiple 
          filterable
          remote
          placeholder="请输入密送人"
          :remote-method="secretRemoteMethod"
          :loading="secretLoading">
            <el-option 
            v-for="item in secretOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="flexBox mgt20">
        <div class="labelWidth">标记类别</div>
        <div class="signTypeInpt">
          <el-select v-model="signType" filterable placeholder="请选择">
            <el-option 
            v-for="item in signOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="flexBox mgt20">
        <div class="labelWidth"></div>
        <div class="signTypeInpt">
          <el-upload 
            action="https://jsonplaceholder.typicode.com/posts/"
            multiple
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :file-list="fileList">
            <el-button type="primary">上传附件</el-button>
            <div slot="tip" class="el-upload__tip">上传文件大小不超过500kb</div>
          </el-upload>
        </div>
      </div>
      <div class="flexBox mgt20">
        <div class="labelWidth"></div>
        <Editor :catchData="catchData" :content="setEditorContent"></Editor>
      </div>
      <div class="flexBox mgt20">
        <div class="labelWidth"></div>
        <div class="operateWrap">
          <el-button type="primary" icon="el-icon-s-promotion" @click="sendClick">发邮件(Ctrl+Enter)</el-button>
          <el-button icon="el-icon-folder-checked" @click="saveClick">保存草稿</el-button>
          <el-button icon="el-icon-folder-delete" @click="cancelClick">取消</el-button>
        </div>
      </div>
    </div>

    <!-- 通讯录弹框 -->
    <el-dialog
      title="通讯录"
      :visible.sync="addressBookFlag"
      width="500px">
      <div class="addressBookTree">
        <el-tree
          :data="addressBookData"
          :props="defaultProps"
          show-checkbox
          node-key="id">
        </el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sendLowerEmail">发送下级邮件</el-button>
        <el-button type="primary" @click="sendPersonalEmail">发送个人邮件</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Editor from '../components/Editor'
import { setTimeout } from 'timers'
const fnListOptions = ['抄送','密送']
export default {
  name: "write",
  data () {
    return {
      getEditorContent:'',
      setEditorContent:'', //初始化富文本的显示的值，或者可以通过这个值来赋值

      copyShow:false,
      secretShow:false,

      recipient:[],
      recipientLoading:false,
      recipientOptions:[],
      recipientValue:[],
      recipientList:[],
      recipientStates:[
        "彭坤<智慧催技术研发部，****5356>",
        "凌心敏<智慧催技术研发部，****7879>",
        "钱俊<智慧催技术研发部，****7829>",
        "汤维<智慧催技术研发部，****7729>",
        "汤宽心<智慧催技术研发部，****7779>",
        "黄舟<智慧催技术研发部，****5559>"
      ],

      copy:[],
      copyLoading:false,
      copyOptions:[],
      copyValue:[],
      copyList:[],
      copyStates:[
        "彭坤<智慧催技术研发部，****5356>",
        "凌心敏<智慧催技术研发部，****7879>",
        "钱俊<智慧催技术研发部，****7829>",
        "汤维<智慧催技术研发部，****7729>",
        "汤宽心<智慧催技术研发部，****7779>",
        "黄舟<智慧催技术研发部，****5559>"
      ],

      secret:[],
      secretLoading:false,
      secretOptions:[],
      secretValue:[],
      secretList:[],
      secretStates:[
        "彭坤<智慧催技术研发部，****5356>",
        "凌心敏<智慧催技术研发部，****7879>",
        "钱俊<智慧催技术研发部，****7829>",
        "汤维<智慧催技术研发部，****7729>",
        "汤宽心<智慧催技术研发部，****7779>",
        "黄舟<智慧催技术研发部，****5559>"
      ],

      signType:'none',
      signOptions:[{
        value:'none',
        label:'无'
      },{
        value:'notice',
        label:'通知'
      }],

      checkboxGroup:[],
      fnList:fnListOptions,
      theme:'',
      fileList:[],
      addressBookFlag:false,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      addressBookData: [
        {
          id: 1,
          label: '按部门分类',
          children: [
            {
              id: 3,
              label: '安全保卫部'
            },
            {
              id: 4,
              label: '业务部'
            },
            {
              id: 5,
              label: '信息安全部'
            },
            {
              id: 6,
              label: '人才引进部'
            }
          ]
        }, 
        {
          id: 2,
          label: '按区域发送',
          children: [{
            id: 7,
            label: '高新区总部',
            children: [{
              id: 8,
              label: '王自力',
              children: [{
                id: 10,
                label: '刘丹'
              }, {
                id: 11,
                label: '晓月',
                children: [{
                  id: 12,
                  label: '小何'
                }, {
                  id: 13,
                  label: '刘凯'
                }]
              }]
            }, {
              id: 9,
              label: '黄干'
            }]
          }]
        }
      ]
    }
  },
  mounted(){
    //收件人
    this.recipientList = this.recipientStates.map(item=>{
      //这里面可以对label，value做循环定制格式
      return {value:item,label:item}
    })
    //抄送人
    this.copyList = this.copyStates.map(item=>{
      //这里面可以对label，value做循环定制格式
      return {value:item,label:item}
    })
    //密送人
    this.secretList = this.secretStates.map(item=>{
      //这里面可以对label，value做循环定制格式
      return {value:item,label:item}
    })
  },
  created(){
    //模拟请求后端初始化富文本的值
    this.setEditorHandler()
  },
  methods:{
    //收件人
    recipientRemoteMethod(query){
      if(query !== ''){
        this.recipientLoading = true
        setTimeout(()=>{
          this.recipientLoading = false
          this.recipientOptions = this.recipientList.filter(item=>{
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
          })
        },200)
      }else{
        this.recipientOptions = []
      }
    },
    //抄送人
    copyRemoteMethod(query){
      if(query !== ''){
        this.copyLoading = true
        setTimeout(()=>{
          this.copyLoading = false
          this.copyOptions = this.copyList.filter(item=>{
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
          })
        },200)
      }else{
        this.copyOptions = []
      }
    },
    //密送人
    secretRemoteMethod(query){
      if(query !== ''){
        this.secretLoading = true
        setTimeout(()=>{
          this.secretLoading = false
          this.secretOptions = this.secretList.filter(item=>{
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
          })
        },200)
      }else{
        this.secretOptions = []
      }
    },
    //抄送 密送点击切换
    cBoxHandle(name){
      if(name == '抄送'){
        this.copyShow = !this.copyShow
      }
      if(name == '密送'){
        this.secretShow = !this.secretShow
      }
    },
    //点击取消
    cancelClick(){
      this.$msgBox.confirm('当前编辑的写信内容即将丢失，您确认要取消吗？','温馨提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(()=>{
        this.$message({
          type:'success',
          message:'取消成功！'
        })
      }).catch(()=>{
        this.$message({
          type:'error',
          message:'取消失败！'
        })
      })
    },
    //保存草稿
    saveClick(){
      this.$msgBox.alert('没有进行任何修改！保存草稿箱失败！','温馨提示',{
        confirmButtonText:'确定',
        callback:()=>{
          this.$message({
            type:'warning',
            message:'操作失败！'
          })
        }
      })
    },
    //发送邮箱
    sendClick(){
      this.$msgBox.alert('请输入有效收件人地址！','温馨提示',{
        confirmButtonText:'确定',
        callback:()=>{
          this.$message({
            type:'success',
            message:'操作成功！'
          })
        }
      })
    },
    //上传附件方法
    handleRemove(file,fileList){
      console.log(file,fileList)
    },
    handlePreview(file){
      console.log(file)
    },
    //移除附件
    beforeRemove(file,fileList){
      console.log(file,fileList)
      return this.$msgBox.confirm(`确定移除${file.name}?`)
    },
    //通讯录
    addressBookClick(){
      this.addressBookFlag = true
    },
    //发送下级邮件
    sendLowerEmail(){
      this.recipient.push('高新区总部 所有员工及所有下级')
      this.addressBookFlag = false
    },
    //发送个人邮件
    sendPersonalEmail(){
      this.recipient.push('邓东灵【业务部，****1533】')
      this.addressBookFlag = false
    },
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
    }
  },
  components:{
    Editor
  }
}
</script>

<style scoped>
  .writeTitle{
    font-weight: 700;
    font-size: 18px;
  }
  .labelWidth{
    width: 80px;
    line-height: 32px;
  }
  .recipientInpt,
  .themeInpt,
  .copyInpt,
  .secretInpt,
  .operateWrap{
    flex: 1;
  }
  .recipientBtn{
    width: 100px;
  }
  .recipientSelect,
  .copySelect,
  .secretSelect{
    width: 100%;
  }
  .fuctAreas{
    margin-top: 30px;
  }
</style>
