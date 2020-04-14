<template>
  <div>
    <el-table
      v-loading="loading"
      :data="dictionaryData"
      :height="tabHeight"
      border
      style="width:100%"
      :header-cell-style="{backgroundColor:'#e5e9f3',padding:'0'}"
      :header-row-style="{height:'40px'}"
      :cell-style="{padding:'0'}"
      :row-style="{height:'40px'}"
    >
      <el-table-column type="index" label="序号" min-width="50"></el-table-column>
      <el-table-column prop="typeValue" label="数据字典名称" min-width="160"></el-table-column>
      <el-table-column prop="dictDataStr" label="字段值（编号/备注）" min-width="160"></el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        min-width="100"
        v-if="permissions(permissionsMapObj['操作-编辑'])"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="addDic(scope.row.typeCode,scope.row.typeValue)"
            size="small"
          >编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->

    <!-- 删除温馨提示弹框 -->
    <el-dialog title="温馨提示" :close-on-click-modal="false" :visible.sync="deleWarn" width="520px">
      <el-row>
        <el-col :md="21" :offset="3" class="warnIcoBg">
          <h2>您确定要删除此字段？</h2>
          <span style="color:red">注：删除后不可恢复！</span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleWarn = false">取消</el-button>
        <el-button @click="sureDele" type="primary">确定</el-button>
      </span>
    </el-dialog>

    <!-- 字典表单 -->
    <add-dic-form :dicFormObj="dicForm" ref="dicChild" @updateForm="updateForm"></add-dic-form>
  </div>
</template>

<script>
import Tools from "untils/index.js"
import AddDicForm from "./partComp/AddDicForm"
import { POST } from "http/custom.js"
export default {
  name: "dictionaryFifth",
  components: {
    AddDicForm
  },
  props: {
    //传过来的数据
    dataListObj: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      tabHeight: Tools.getTbHeight(200),
      addtabHeight: "300",
      //分页查询
      loading: false, //table加载动画开关

      deleWarn: false, //删除字段弹框
      addFlag: 1,
      dicForm: {
        //字典表单
        title: "",
        caseModal: false,
        dataTablePlane: []
      },
      dictionaryData: [],
      permissionsMapObj: {
        //老系统action权限映射对象
        "操作-编辑": "55ddebaee75f429aadc0def3e608d1c4"
      }
    }
  },
  created() {
    console.log(this.dataListObj.deptInfo)
    this.tabSearch()
  },
  methods: {
    sureDele() {
      this.$message({ type: "error", message: "此字段正在使用，无法删除，请先解除绑定！", showClose: true })
    },
    addDic(typeCode, val) {
      //字典
      this.dicForm.caseModal = true
      this.dicForm.title = val
      this.dicForm.typeCode = typeCode
      this.$refs.dicChild.editDictionary()
    },
    tabSearch() {
      //数据字典表格
      let queryObj = {
        queryFlag: "NORMAL"
      } //查询象
      this.loading = true //开启动画
      POST(process.env.VUE_APP_DOMAIN_financial + "/contractDictTypeList", queryObj)
        .then(res => {
          //查询对象
          this.loading = false //关闭动画
          this.dictionaryData = res.data
          console.log(res.data)
        })
        .catch(error => {
          console.log(error)
        })
    },
    updateForm() {
      this.tabSearch()
    }
  },
  filter: {},
  computed: {
    permissions() {
      //通过老oa配置的id,判断当前 用户是否有对应的权限
      return powerid => {
        return Tools.includes(this.$store.state.userActionAll, powerid)
      }
    }
  },
  watch: {}
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin-right: 0px;
}
</style>

