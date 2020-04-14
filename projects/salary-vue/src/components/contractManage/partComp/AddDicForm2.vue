<template>
  <div class="add-dic-form">
    <!-- 添加字典表单 -->
    <el-dialog :title="'添加'+dicFormObj.title" :close-on-click-modal="false" :before-close="closeDialog" :show-close="true" :visible.sync="dicFormObj.caseModal" width="800px" top="10vh">
      <el-form :model="addDic.baseInfo" :rules="addDic.addCaseFormRule" ref="addDic" label-width="120px">
        <el-row>
          <el-col :md="12">
            <el-form-item :label="dicFormObj.title+'：'" prop="dataValue">
              <el-input clearable placeholder="请输入" v-model.trim="addDic.baseInfo.dataValue" style="width:185px"></el-input>&nbsp;
              <el-checkbox v-model.trim="addDic.baseInfo.dataDefault">默认</el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :md="9">
            <el-form-item label="编号：" prop="dataCode">
              <el-input clearable placeholder="请输入" v-model.trim="addDic.baseInfo.dataCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="3">
            &nbsp;&nbsp;&nbsp;&nbsp;
            <el-button type="primary" @click="JS_operate('addDic',addDicbtn)">{{addDicbtn}}</el-button>
          </el-col>
        </el-row>
      </el-form>
      <div class="table_wrap">
        <el-table v-loading="loading" height="250px" :data="dataTablePlane" border :header-cell-style="{backgroundColor:'#e5e9f3'}">
          <el-table-column v-for="(item,index) in tableHead" :key="index" :prop="item.prop" :label="item.label" min-width="100">
            <template slot-scope="scope">
              <span v-if="item.prop === 'dataDefault'">
                <span v-if="scope.row.dataDefault == '1'">是</span>
                <span v-else-if="scope.row.dataDefault == '0'">否</span>
                <span v-else></span>
              </span>
              <span v-else-if="item.prop === 'dataValue'">{{scope.row.dataValue}}</span>
              <span v-else>{{scope.row.dataCode}}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" fixed="right" min-width="100">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="modifyDic(scope.row.dataId)">编辑</el-button>
              <el-button type="text" size="small" @click="deleDic(scope.row.dataId)" class="deleteTxt">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { PUT, GET, POST, DELETE } from "http/custom.js"
export default {
  name: "AddDicForm",
  components: {},
  props: {
    dicFormObj: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      tableHead: [ //表头
        { prop: "dataValue", label: this.dicFormObj.title },
        { prop: "dataDefault", label: "默认" },
        { prop: "dataCode", label: "编号" }
      ],
      dataTablePlane: [],
      loading: false,
      addDic: {
        addCaseFormRule: { // 验证
          dataValue: [{ required: true, message: "请输入", trigger: "bur" }],
          dataCode: [{ required: true, message: "请输入", trigger: "bur" }]
        },
        baseInfo: {
          dataValue: '',
          dataCode: '',
          dataDefault: false,
          typeCode: '',
        }
      },
      addDicbtn: '添加',
      checkboxChange: 0
    };
  },
  methods: {
    //查看字典数据详情
    modifyDic(id) {
      let queryObj = {
        "dataId": id,
      } //查询象 
      GET(process.env.VUE_APP_DOMAIN_financial + '/contractDictData', queryObj).then(res => {
        this.addDic.baseInfo = res.data
        if (res.data.dataDefault) {
          this.addDic.baseInfo.dataDefault = true
        } else {
          this.addDic.baseInfo.dataDefault = false
        }
        this.addDicbtn = '保存'

      }).catch(error => {
        console.log(error)
      })
    },
    //关闭弹框
    closeDialog() {
      this.dicFormObj.caseModal = false;
      this.$refs.addDic.resetFields();
    },
    deleDic(deleId) {
      this.$msgBox.confirm("你确定要删除该条数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        DELETE(process.env.VUE_APP_DOMAIN_financial + "/contractDictData", { dataId: deleId }).then(() => {
          this.getDicGrid(this.dicFormObj.typeCode);
          this.$emit('updateForm');//调用父组件方法
          this.messagePopp("success", "删除成功!");
        }).catch(error => {
          console.log(error);
        });
      }).catch(() => {
        this.messagePopp("info", "已取消删除!");
      });
    },
    //提示框
    messagePopp(type, msg) {
      this.$message({
        showClose: true,
        type: type,
        message: msg
      });
    },
    JS_operate(formName, Btn) {//编辑字典
      if (this.addDic.baseInfo.dataDefault) {
        this.addDic.baseInfo.dataDefault = 1
      } else {
        this.addDic.baseInfo.dataDefault = 0
      }
      this.addDic.baseInfo.typeCode = this.dicFormObj.typeCode;

      this.$refs[formName].validate(valid => {
        if (valid) {
          let saveObj = this.addDic.baseInfo //保存对象
          if (Btn == "保存") {
            /////修改字典
            PUT(process.env.VUE_APP_DOMAIN_financial + '/contractDictData', saveObj).then(() => {
              this.messagePopp("success", "保存数据成功！");
              this.addDicbtn = '添加'
              this.getDicGrid(this.dicFormObj.typeCode); this.$emit('updateForm');//调用父组件方法
              this.$refs[formName].resetFields()//清空表单
            }).catch(error => {
              console.log(error)
            })
          } else {
            ////新增字典
            POST(process.env.VUE_APP_DOMAIN_financial + '/contractDictData', saveObj).then(() => {
              this.messagePopp("success", "新增数据成功！");
              this.getDicGrid(this.dicFormObj.typeCode);
              this.$emit('updateForm');//调用父组件方法
              this.$refs[formName].resetFields()//清空表单
            }).catch(error => {
              console.log(error)
            })
          }
        } else {
          this.messagePopp("warning", "提交失败，验证不通过！");
        }
      })

    },
    getDicGrid(typeCode) {
      this.loading = true;
      POST(process.env.VUE_APP_DOMAIN_financial + '/contractDictDataList', {
        "typeCode": typeCode,
      }).then(res => {//查询对象
        this.loading = false;
        this.dataTablePlane = res.data;
      }).catch(error => {
        console.log(error)
      })
    },
  }
};
</script>
<style lang="less" scoped>
.el-checkbox {
  margin-right: 0px;
}
</style>


