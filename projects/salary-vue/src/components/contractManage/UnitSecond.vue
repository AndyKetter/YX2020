<template>
  <div class="contract-first">
    <el-row :style="{height:t_height+'px'}">
      <el-col style="width: 200px;height: 100%; border:1px solid #c0c0c0;overflow-y: auto;">
        <el-tree
          v-loading="treeLoading"
          :highlight-current="true"
          :data="treeData"
          :props="defaultProps"
          :check-on-click-node="true"
          @node-click="handleNodeClick"
        ></el-tree>
      </el-col>
      <el-col style="padding-left: 10px;width: calc(100% - 200px);height: 100%;">
        <div class="pull-left">
          <el-form :inline="true" class="mar-no" label-position="right">
            <el-form-item label="搜索字段">
              <el-select
                filterable
                clearable
                v-model="searchWord"
                ref="searchWord"
                placeholder="请选择"
                class="width155"
                @change="switchCondition"
              >
                <el-option
                  v-for="item in searchArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关键字" v-if="switchON === 1">
              <el-input
                clearable
                @keyup.enter.native="JS_search"
                v-model.trim="keyWords"
                placeholder="请输入"
                style="width:200px"
              ></el-input>
            </el-form-item>
            <el-form-item label="日期" v-if="switchON === 2">
              <el-date-picker
                v-model.trim="batch"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width:270px"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="JS_search" icon="el-icon-search">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="pull-right">
          <el-dropdown
            trigger="click"
            @command="handleCommand"
            v-if="permissions(permissionsMapObj['操作-新增'])||permissions(permissionsMapObj['操作-删除'])||permissions(permissionsMapObj['操作-导入'])||permissions(permissionsMapObj['操作-导出'])"
          >
            <el-button type="primary">
              更多操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                command="a"
                icon="el-icon-plus"
                v-if="permissions(permissionsMapObj['操作-新增'])"
              >
                <i></i>&nbsp;新增
              </el-dropdown-item>
              <el-dropdown-item
                command="b"
                icon="el-icon-delete"
                divided
                v-if="permissions(permissionsMapObj['操作-删除'])"
              >
                <i></i>&nbsp;删除
              </el-dropdown-item>
              <el-dropdown-item
                command="c"
                class="cloud-uploadBtn"
                divided
                v-if="permissions(permissionsMapObj['操作-导入'])"
              >
                <i></i>&nbsp;导入
              </el-dropdown-item>
              <el-dropdown-item
                command="d"
                class="cloud-downloadBtn"
                divided
                v-if="permissions(permissionsMapObj['操作-导出'])"
              >
                <i></i>&nbsp;导出
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class>
          <el-table
            v-loading="mainLoading"
            :data="unitData"
            :height="tabHeight"
            @selection-change="handleSelectionChange"
            border
            style="width:100%"
            :header-cell-style="{backgroundColor:'#e5e9f3',padding:'0'}"
            :header-row-style="{height:'20px'}"
            :cell-style="{padding:'0'}"
            :row-style="{height:'20px'}"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column type="index" label="序号" fixed="left" min-width="50"></el-table-column>
            <el-table-column prop="unitCode" label="单位编号" min-width="100"></el-table-column>
            <el-table-column prop="unitTypeCode" label="单位分类" min-width="100"></el-table-column>
            <el-table-column prop="unitName" label="单位名称" min-width="130"></el-table-column>
            <el-table-column prop="unitContact" label="联系人" min-width="100"></el-table-column>
            <el-table-column prop="unitPhone" label="电话" min-width="120"></el-table-column>
            <el-table-column prop="unitFax" label="传真" min-width="120"></el-table-column>
            <el-table-column prop="unitCellPhone" label="手机" min-width="120"></el-table-column>
            <el-table-column prop="unitMail" label="电子邮箱" min-width="150" show-overflow-tooltip></el-table-column>
            <el-table-column prop="unitSite" label="网站" min-width="150" show-overflow-tooltip></el-table-column>
            <el-table-column prop="unitPostCode" label="邮政编码" min-width="100"></el-table-column>
            <el-table-column prop="unitProvince" label="省份" min-width="100"></el-table-column>
            <el-table-column prop="unitCity" label="城市" min-width="100"></el-table-column>
            <el-table-column prop="unitArea" label="区/县" min-width="100"></el-table-column>
            <el-table-column prop="unitAddress" label="联系地址" min-width="130" show-overflow-tooltip></el-table-column>
            <el-table-column prop="unitBank" label="开户行" min-width="150"></el-table-column>
            <el-table-column prop="unitAccount" label="账号" min-width="150"></el-table-column>
            <el-table-column prop="unitTaxNumber" label="税号" min-width="160"></el-table-column>
            <el-table-column prop="unitRemark" label="备注" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="unitCreateUserName" label="录入人" min-width="100"></el-table-column>
            <el-table-column prop="unitCreateTime" label="录入时间" min-width="150"></el-table-column>
            <el-table-column prop="unitUpdateUserName" label="修改人" min-width="100"></el-table-column>
            <el-table-column prop="unitUpdateTime" label="修改时间" min-width="150"></el-table-column>
            <el-table-column
              label="操作"
              fixed="right"
              min-width="100"
              v-if="permissions(permissionsMapObj['操作-编辑'])"
            >
              <template slot-scope="scope">
                <el-button type="text" @click="modifyUnit(scope.row.unitId)" size="small">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <div id="pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handlecurrentChange"
              background
              :current-page="current"
              :page-sizes="[5,10,15,20,30,40]"
              :page-size="size"
              layout="total,sizes,prev,pager,next,jumper"
              :total="total"
            ></el-pagination>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 新增往来单位弹框 -->
    <el-dialog
      title="新增往来单位"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      :lose-on-press-escape="false"
      :visible.sync="addUnitModal"
      width="700px"
    >
      <div>
        <el-form :model="addUnit" :rules="addUnitRule" ref="addUnit" label-width="110px">
          <el-row>
            <el-col :md="12">
              <el-form-item label="单位编号：" prop="unitCode">
                <el-input v-model="addUnit.unitCode" :disabled="addUnitDate"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="单位分类：" prop="unitTypeCode">
                <el-select
                  filterable
                  clearable
                  v-model.trim="addUnit.unitTypeCode"
                  placeholder="请选择"
                  style="width:130px"
                >
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>&nbsp;&nbsp;
                <el-button type="text" @click="addDic('FINA_CONTR_UNIT','单位分类')">添加</el-button>
              </el-form-item>
            </el-col>
            <el-col :md="24">
              <el-form-item label="单位名称：" prop="unitName">
                <el-input v-model="addUnit.unitName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="联系人：" prop="unitContact">
                <el-input v-model="addUnit.unitContact" maxlength="10"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="手机号：" prop="unitCellPhone">
                <el-input v-model="addUnit.unitCellPhone" maxlength="11"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="电子邮箱：" prop="unitMail">
                <el-input v-model="addUnit.unitMail" maxlength="20"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="单位电话：" prop="unitPhone">
                <el-input v-model="addUnit.unitPhone" maxlength="20"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="传真：" prop="unitFax">
                <el-input v-model="addUnit.unitFax" maxlength="20"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="单位网站：" prop="unitSite">
                <el-input v-model="addUnit.unitSite" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="邮政编码：" prop="unitPostCode">
                <el-input v-model="addUnit.unitPostCode" maxlength="6"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="区域：" prop="selectedOptions">
                <!-- <el-input v-model="addUnit.unitArea"></el-input> -->
                <el-cascader
                  v-if="addUnitDate==false||modiFlag==0"
                  size="small"
                  ref="chinaChange"
                  :options="chinaOptions"
                  v-model="addUnit.selectedOptions"
                  clearable
                ></el-cascader>
                <el-input
                  v-if="addUnitDate==true&&modiFlag"
                  v-model="disabledUnitArea"
                  :disabled="true"
                  style="width:180px"
                ></el-input>&nbsp;
                <el-button type="text" v-if="addUnitDate==true&&modiFlag" @click="modifyChina">修改</el-button>
              </el-form-item>
            </el-col>
            <el-col :md="24">
              <el-form-item label="联系地址：" prop="unitAddress">
                <el-input v-model="addUnit.unitAddress" maxlength="100"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="开户银行：" prop="unitBank">
                <el-input v-model="addUnit.unitBank" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="账号：" prop="unitAccount">
                <el-input v-model="addUnit.unitAccount" maxlength="20"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="24">
              <el-form-item label="税号：" prop="unitTaxNumber">
                <el-input v-model="addUnit.unitTaxNumber" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="24">
              <el-form-item label="备注：" prop="unitRemark">
                <el-input v-model="addUnit.unitRemark" maxlength="100"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button v-if="addUnitDate==false" type="primary" @click="JSaddUnitModal('addUnit')">提交</el-button>
        <el-button v-if="addUnitDate==true" type="primary" @click="JS_modifyUnit('addUnit')">修改</el-button>
      </span>
    </el-dialog>

    <!-- 删除温馨提示弹框 -->
    <el-dialog title="温馨提示" :close-on-click-modal="false" :visible.sync="deleWarn" width="520px">
      <el-row>
        <el-col :md="21" :offset="3" class="warnIcoBg">
          <h2>您确定要批量删除数据？</h2>
          <span style="color:red">注：删除后不可恢复！</span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleWarn = false">取消</el-button>
        <el-button type="primary" @click="JS_DeleUnit">确定</el-button>
      </span>
    </el-dialog>
    <!-- 导出-->
    <el-dialog
      title="导出"
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="exportDialog"
      width="600px"
    >
      <div>
        <el-form label-width="150px">
          <el-row>
            <el-col :md="24">
              <el-form-item label="导出方式" label-width="85px">
                <el-select placeholder="请选择" v-model="exportVal" style="width:300px" filterable>
                  <el-option
                    v-for="item in exportType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="exportDialog = false">取消</el-button>
        <el-button type="primary" @click="exportToWary">确定</el-button>
      </span>
    </el-dialog>

    <!-- 导入弹框 -->
    <el-dialog
      title="来往单位导入"
      :before-close="fileClose"
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="uploadModal"
      width="520px"
    >
      <p class="clearfix">
        <el-upload
          ref="upload"
          class="pull-left"
          :action="uploadActionUrl"
          :headers="headers"
          :before-remove="beforeRemove"
          :before-upload="beforeUpload"
          :on-success="handleSuccess"
        >
          <el-button size="mediumn" icon="el-icon-upload">导入数据</el-button>
          <el-button
            size="mediumn"
            style="margin-left:15px;"
            icon="el-icon-download"
            @click.stop="uploadLink"
          >下载模板</el-button>
          <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
        </el-upload>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadModal = false">取消</el-button>
      </span>
    </el-dialog>

    <!-- 导入进度条 -->
    <el-dialog
      title="导入信息"
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="importProcessInfoDialog"
      width="600px"
    >
      <div class="pad-all mar-ver">
        <el-progress :text-inside="true" :stroke-width="20" :percentage="progressPercentAge"></el-progress>
        <p>
          正在导入，本次需导入总记录{{uploadProcessInfo.total | repair}}条，
          <span
            style="color:#66b1ff"
          >成功{{uploadProcessInfo.successful | repair}}条</span>，
          <span style="color:red">失败{{uploadProcessInfo.failures | repair}}条</span>
          ，总耗时{{uploadProcessInfo.dealAllTime}}
        </p>
        <p v-show="loadErrorExcel">
          <el-button type="text" @click="unloadErrorLink" class="underlineTxt">点击下载导入失败明细</el-button>
          <span style="color:#a1a1a1">(导入失败明细已发送到您内网邮箱)</span>
        </p>
      </div>
      <span slot="footer" class="dialog-footer" v-show="progressBackBtn">
        <el-button type="primary" @click="importProgress">返回</el-button>
      </span>
    </el-dialog>

    <!-- 字典表单 -->
    <add-dic-form :dicFormObj="dicForm" ref="dicChild" @updateForm="updateForm"></add-dic-form>
  </div>
</template>

<script>
import { GET, POST, PUT, DELETE } from "http/custom.js"
import AddDicForm from "./partComp/AddDicForm"
import Tools from "untils/index.js"
import regionData from "json/regionData.json"
export default {
  name: "unitSecond",
  props: {
    //传过来的数据
    dataListObj: {
      type: Object,
      required: true
    }
  },
  components: {
    AddDicForm
  },
  data() {
    const uploadActionUrl = process.env.VUE_APP_DOMAIN_financial + "/import" //导入action 线上，数据导入接口
    return {
      chinaOptions: regionData, //省份下拉框
      disabledUnitArea: "",
      modiFlag: 1,
      uploadActionUrl,
      searchWord: undefined, //搜索字段
      keyTree: "", // 所选的树形参数
      keyWords: "", //关键字
      batch: [
        //日期
        Tools.getYMd(),
        Tools.getYMd()
      ], //时间
      switchON: 0, //关键字/ 时间 开关
      addUnitDate: false, //默认为新增弹框
      exportData: "",
      t_height: Tools.getTbHeight(200), //设置高
      tabHeight: Tools.getTbHeight(310),
      addUnitModal: false, //新增单位弹框
      deleWarn: false, //删除弹框
      uploadModal: false, //导入弹框
      exportDialog: false, //导出弹框
      importProcessInfoDialog: false, //导入进度条弹框
      downloadErrorKey: "", //导入错误下载excel key
      downloadErrorEveProcess: "", //进度事件句柄
      progressPercentAge: 0, //进度条如 80%就是 80
      loadErrorExcel: false, //呈现下载链接
      progressBackBtn: false, // 返回按钮
      uploadProcessInfo: {
        total: "", //总条数
        handler: "", //已处理条数
        successful: "", //处理成功条数
        failures: "", //处理失败条数
        finish: false, //是否处理完成
        dealAllTime: "" //总耗时
      },
      headers: {}, //上传图片请求头
      //分页查询
      treeLoading: false,
      mainLoading: false, //table加载动画开关
      multipleSelection: [], // 表格多选记录
      exportVal: 1, //导出方式
      current: 1, //当前页码
      size: 15, //每页显示记录条数
      total: 0, //总记录条数
      searchArr: [
        {
          //下拉
          value: "unitCode",
          label: "单位编号"
        },
        {
          value: "unitName",
          label: "单位名称"
        },
        {
          value: "unitContact",
          label: "联系人"
        },
        {
          value: "unitPhone",
          label: "电话"
        },
        {
          value: "unitFax",
          label: "传真"
        },
        {
          value: "unitCellPhone",
          label: "手机号码"
        },
        {
          value: "unitMail",
          label: "邮箱"
        },
        {
          value: "unitSite",
          label: "网站"
        },
        {
          value: "unitPostCode",
          label: "邮政编码"
        },
        {
          value: "unitAddress",
          label: "联系地址"
        },
        {
          value: "unitBank",
          label: "开户行"
        },
        {
          value: "unitAccount",
          label: "账号"
        },
        {
          value: "unitTaxNumber",
          label: "税号"
        },
        {
          value: "unitRemark",
          label: "备注"
        },
        {
          value: "unitCreateUserName",
          label: "录入人"
        },
        {
          value: "unitCreateTimeStart_unitCreateTimeEnd",
          label: "录入时间"
        },
        {
          value: "unitUpdateUserName",
          label: "修改人"
        },
        {
          value: "unitUpdateTimeStart_unitUpdateTimeEnd",
          label: "修改时间"
        }
      ],
      treeData: [],
      unitData: [],
      exportType: [
        //导出方式
        { value: 1, label: "保存至本地（需要等待数秒至数分钟）" },
        { value: 2, label: "发送至本人内网邮箱" }
      ],
      addUnit: {
        unitCode: "",
        autochecked: false,
        unitTypeCode: undefined,
        unitName: "",
        unitContact: "",
        unitFax: "",
        unitPhone: "",
        unitCellPhone: "",
        unitMail: "",
        unitSite: "",
        unitPostCode: "",
        unitAddress: "",
        unitBank: "",
        unitAccount: "",
        unitTaxNumber: "",
        unitRemark: "",
        selectedOptions: []
      },
      typeOptions: [],
      addUnitRule: {
        unitCode: [
          { required: true, message: "请填写单位编号", trigger: "blur" },
          {
            pattern: /^[0-9,a-z,A-Z,-,_]+$/,
            message: "必须是数字或字母",
            trigger: "blur"
          },
          { min: 0, max: 20, message: "长度应为20个字符内", trigger: "blur" }
        ],
        unitTypeCode: [{ required: true, message: "请选择单位分类", trigger: "change" }],
        unitName: [{ required: true, message: "请填写单位名称", trigger: "blur" }, { min: 0, max: 100, message: "长度应为100个字符内", trigger: "blur" }],
        unitCellPhone: [{ required: false, trigger: "blur" }, { pattern: /^1[3|4|5|7|8][0-9]\d{8}$/, message: "请输入正确的手机号！", trigger: "blur" }]
      },
      defaultProps: {
        children: "children",
        label: "label"
      },
      dicForm: {
        //字典表单
        title: "",
        caseModal: false,
        dataTablePlane: []
      },
      permissionsMapObj: {
        //老系统action权限映射对象
        "操作-新增": "73f6fae0b16a4263aaeb760d4d2e4a79",
        "操作-删除": "fd6d845584834486b70041a6b78e133f",
        "操作-导入": "04a5fe9e566c48b1be970abef2ca2e79",
        "操作-导出": "2a1994c7b9914e3f8b596d84c7d01dc4",
        "操作-编辑": "e59a4a305d204b63a9918301624fb3ec"
      }
    }
  },
  created() {
    console.log(this.dataListObj.deptInfo)
    this.queryTree()
    this.searchMaintab()
    this.queryAreaList()
    this.headers["x-user-token"] = localStorage.getItem("token") //设置上传数据文件excel的token
  },
  methods: {
    // handleChange12(value) {
    //   console.log("111:", value)
    //   console.log(this.$refs.chinaChange.currentLabels)
    // },
    messagePopp(type, msg) {
      //提示框
      this.$message({
        showClose: true,
        type: type,
        message: msg
      })
    },
    handleNodeClick(data) {
      //树形子节点点击事件
      console.log(data)
      if (data.children) {
        this.keyTree = "" //取消选中
        return false
      }
      //父节点参数字段名+父节点id+子节点名称+子节节点id
      this.keyTree = data.nodefiled + "_" + data.nodeId + "_" + data.label + "_" + data.id
      this.JS_search()
    },
    queryTree() {
      //查询树形
      this.treeLoading = true
      GET(process.env.VUE_APP_DOMAIN_financial + "/contractUnitsProvince")
        .then(res => {
          console.log(res.data, "树形")
          this.treeLoading = false
          if (res.data && res.data.length > 0) {
            //生成树形数据
            this.treeData = res.data.map(v => {
              let arr = []
              if (v.child.length > 0) {
                //获取子节点
                arr = v.child.map(list => {
                  if (list) {
                    return {
                      nodeId: v.typeId, //父节点id
                      nodefiled: v.field, //父节点参数字段名
                      nodeName: v.menu, //父节点名称
                      id: list.dataCode, //子节点id
                      label: list.dataValue //子节点名称
                    }
                  }
                })
              }
              //生成父节点
              return {
                label: v.menu,
                children: arr
              }
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    async queryAreaList() {
      //获取所属区域
      let queryObj = {
        typeCode: "FINA_CONTR_UNIT"
      } //查询象
      POST(process.env.VUE_APP_DOMAIN_financial + "/contractDictDataList", queryObj)
        .then(res => {
          //查询对象
          if (res.data.length > 0) {
            //获取子节点
            this.typeOptions = res.data.map(list => {
              return {
                value: list.dataCode,
                label: list.dataValue
              }
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    addDic(typeCode, val) {
      //字典
      this.dicForm.caseModal = true
      this.dicForm.title = val
      this.dicForm.typeCode = typeCode
      this.$refs.dicChild.editDictionary()
    },
    getParam() {
      // 汇聚参数
      let searchObj = {
        current: this.current, //当前页码
        size: this.size //每页显示记录条数
      }
      //设置点击树形时的参数
      if (this.keyTree !== "") {
        searchObj = Object.assign(searchObj, {
          [this.keyTree.split("_")[0]]: this.keyTree.split("_")[3]
        })
      }
      //设置下拉所选时的参数
      if (this.searchWord !== undefined && this.searchWord !== null) {
        if (this.searchWord.includes("_")) {
          // 当为日期相关的参数
          searchObj = Object.assign(searchObj, {
            [this.searchWord.split("_")[0]]: this.batch ? this.batch[0] : "",
            [this.searchWord.split("_")[1]]: this.batch ? this.batch[1] : ""
          })
        } else {
          // 当为文本框
          searchObj = Object.assign(searchObj, { [this.searchWord]: this.keyWords })
        }
      }
      console.log(searchObj, "11")
      return searchObj
    },
    switchCondition(val) {
      //搜索字段
      console.log(val, "00")
      if (val === null || val === "") {
        this.switchON = 0
        return
      }
      //查找 对应的值
      const obj = this.searchArr.find(v => {
        return val === v.value
      })
      //文本框和时间框切换
      if (obj.label.includes("时间") || obj.label.includes("日期")) {
        this.switchON = 2
      } else {
        this.switchON = 1
      }
      console.log(this.switchON, "11")
    },
    JS_search() {
      this.current = 1
      this.searchMaintab()
    },
    searchMaintab() {
      let searchObj = this.getParam()
      this.mainLoading = true
      //调取数据
      POST(process.env.VUE_APP_DOMAIN_financial + "/contractUnits", searchObj)
        .then(res => {
          this.mainLoading = false
          if (res.data) {
            this.unitData = res.data.records
            this.current = res.data.current //当前页
            this.size = res.data.size //每页显示记录条数先
            this.total = res.data.total //总记录数据
          }
        })
        .catch(error => {
          this.mainLoading = false
          console.log(error)
        })
    },
    updateForm() {
      this.queryAreaList()
      this.JS_search()
      this.queryTree()
    },
    closeDialog() {
      //仅仅清除表单
      this.modiFlag = 1
      this.addUnitDate == true
      this.addUnitModal = false

      this.$refs["addUnit"].resetFields() //清空表单
    },
    JSaddUnitModal(formName) {
      //新增来往单位
      this.$refs[formName].validate(valid => {
        if (valid) {
          let saveObj = this.addUnit //保存对象
          console.log("保存对象", saveObj)
          let searchObj2 = Object.assign(saveObj, {
            unitProvince: this.$refs.chinaChange.currentLabels[0],
            unitCity: this.$refs.chinaChange.currentLabels[1],
            unitArea: this.$refs.chinaChange.currentLabels[2]
          })
          POST(process.env.VUE_APP_DOMAIN_financial + "/contractUnit", searchObj2)
            .then(() => {
              this.$message({
                type: "success",
                message: "新增数据成功!",
                showClose: true
              })
              this.addUnitModal = false //关闭修改弹框
              this.$refs[formName].resetFields() //清空表单
              this.JS_search() //刷新表格，重新获取数据
              this.queryTree()
            })
            .catch(error => {
              console.log(error)
            })
        } else {
          this.$message({
            showClose: true,
            type: "warning",
            message: "提交失败，验证不通过"
          })
          return false
        }
      })
    },
    modifyUnit(id) {
      //
      this.addUnitDate = true
      this.addUnitModal = true

      let queryObj = {
        unitId: id
      } //查询象
      GET(process.env.VUE_APP_DOMAIN_financial + "/contractUnit", queryObj)
        .then(res => {
          //查询对象
          console.log(res.data)
          if (res.data) {
            this.addUnit = res.data
            this.disabledUnitArea = (res.data.unitProvince || "") + " / " + (res.data.unitCity || "") + " / " + (res.data.unitArea || "")
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    modifyChina() {
      this.modiFlag = 0
      this.addUnit.selectedOptions = []
    },
    JS_modifyUnit(formName) {
      //修改来往单位
      this.modiFlag = 1
      this.addUnitDate == true
      this.$refs[formName].validate(valid => {
        if (valid) {
          let saveObj = this.addUnit //保存对象
          let searchObj2 = ""
          if (this.$refs.chinaChange) {
            searchObj2 = Object.assign(saveObj, {
              unitProvince: this.$refs.chinaChange.currentLabels[0],
              unitCity: this.$refs.chinaChange.currentLabels[1],
              unitArea: this.$refs.chinaChange.currentLabels[2]
            })
          } else {
            searchObj2 = Object.assign(saveObj, {
              unitProvince: this.disabledUnitArea.split(" / ")[0],
              unitCity: this.disabledUnitArea.split(" / ")[1],
              unitArea: this.disabledUnitArea.split(" / ")[2]
            })
          }
          PUT(process.env.VUE_APP_DOMAIN_financial + "/contractUnit", searchObj2)
            .then(() => {
              this.$message({
                type: "success",
                message: "修改数据成功!",
                showClose: true
              })
              this.addUnitModal = false //关闭修改弹框
              this.$refs[formName].resetFields() //清空表单
              this.JS_search() //刷新表格，重新获取数据
              this.queryTree()
            })
            .catch(error => {
              console.log(error)
            })
        } else {
          this.$message({
            showClose: true,
            type: "warning",
            message: "提交失败，验证不通过"
          })
          return false
        }
      })
    },
    JS_DeleUnit() {
      let arr = []
      this.multipleSelection.forEach(e => {
        arr.push(e.unitId)
      })
      arr = arr.join(",")
      let queryObj = {
        unitIds: arr
      } //查询象
      DELETE(process.env.VUE_APP_DOMAIN_financial + "/contractUnits", queryObj)
        .then(res => {
          //查询对象
          console.log(res.data)
          this.$message({
            type: "success",
            message: "删除成功!"
          })
          this.deleWarn = false
          this.JS_search() //刷新表格，重新获取数据
          this.queryTree()
        })
        .catch(error => {
          console.log(error)
        })
    },
    handleCommand(command) {
      //更多操作下拉框
      if (command == "a") {
        this.addUnitDate = false
        this.addUnitModal = true
      } else if (command == "b") {
        if (this.multipleSelection.length) {
          this.deleWarn = true
          // this.JS_DeleUnit()
        } else {
          this.messagePopp("warning", "请勾选需要删除的选项！")
        }
      } else if (command == "c") {
        this.uploadModal = true //导入
      } else if (command == "d") {
        this.exportDialog = true //导出
        this.exportData = this.getParam
      }
    },
    exportToWary() {
      //导出
      // 导出方式   1直接下载  2发到邮箱
      let ul = process.env.VUE_APP_DOMAIN_financial + "/export"
      let ab = ""
      if (this.searchWord !== undefined && this.searchWord !== null) {
        if (this.searchWord.includes("_")) {
          // 当为日期相关的参数
          ab = "&" + [this.searchWord.split("_")[0]] + "=" + (this.batch ? this.batch[0] : "") + "&" + [this.searchWord.split("_")[1]] + "=" + (this.batch ? this.batch[1] : "")
        } else {
          // 当为文本框
          ab = "&" + [this.searchWord] + "=" + this.keyWords
        }
      }
      let urlStr = "?token=" + localStorage.getItem("token") + "&" + [this.keyTree.split("_")[0]] + "=" + this.keyTree.split("_")[3] + ab + "&exportType=" // wary 导出方式   1直接下载  2 发到邮箱

      //设置点击树形时的参数
      let searchObj = {
        [this.keyTree.split("_")[0]]: this.keyTree.split("_")[3]
      }
      if (this.searchWord !== undefined && this.searchWord !== null) {
        if (this.searchWord.includes("_")) {
          // 当为日期相关的参数
          searchObj = Object.assign(searchObj, {
            [this.searchWord.split("_")[0]]: this.batch ? this.batch[0] : "",
            [this.searchWord.split("_")[1]]: this.batch ? this.batch[1] : ""
          })
        } else {
          // 当为文本框
          searchObj = Object.assign(searchObj, { [this.searchWord]: this.keyWords })
        }
      }

      if (this.exportVal === 1) {
        //导出方式
        this.messagePopp("success", "已经导出至本地！")
        //下载拼接 已经导出至本地！
        // let urls = `${ul}?token=${localStorage.getItem("token")}&exportType=${this.exportVal}&source=${this.exportData}`;
        let urls = ul + urlStr + this.exportVal
        window.location.href = urls
      } else {
        let params = {
          source: searchObj,
          exportType: this.exportVal
        }
        //导出至邮箱   这个接口没有返回值，后台要求直接提示
        GET(ul, params)
          .then(() => {
            this.messagePopp("success", "已经导入至您的邮箱！")
          })
          .catch(error => {
            console.log(error)
          })
      }

      // 关闭导出弹窗
      this.exportDialog = false
    },
    unloadErrorLink() {
      //导入错误模板下载
      console.log("downloadErrorKey", this.downloadErrorKey)
      let url = process.env.VUE_APP_DOMAIN_download + "/oss/download?key=" + this.downloadErrorKey + "&token=" + localStorage.getItem("token") + "&name=" + encodeURI("来往单位导入失败明细") + ".xlsx"
      window.location.href = url
    },
    // 导入中的下载模板
    uploadLink() {
      GET(
        process.env.VUE_APP_DOMAIN_download + "/template/baseFilesTemplateByFileCode", //公共接口
        {
          fileCode: "FINANCIAL_CONTRACT_UNIT_IMPORT_EXCEL_TEMPLATE"
        }
      )
        .then(res => {
          //获取模板存储返回的ID
          window.location.href = `${process.env.VUE_APP_DOMAIN_download}/oss/download?key=${res.data.fileTemplateId}&name=${res.data.fileTemplateName}.${res.data.fileTemplateSuffix}`
        })
        .catch(error => {
          console.log(error)
        })
    },
    beforeUpload(file) {
      //上传文件之前的钩子
      console.log("上传文件之前的回调", file)
      let testFileType = file.name.substring(file.name.lastIndexOf(".") + 1) //截取文件后缀
      const extension1 = testFileType === "xls"
      const extension2 = testFileType === "xlsx"
      if (!extension1 && !extension2) {
        //不是excel文件格式
        this.$message.error("上传数据文件只能是 xlsx/xls 格式!")
      }
      return extension1 || extension2
    },
    beforeRemove(file) {
      //删除文件之前的钩子
      return this.$msgBox.confirm(`确定移除${file.name}？`)
    },
    //上传文件接口调取成功回调
    handleSuccess(res) {
      debugger
      this.uploadModal = false //关闭导入弹框
      if (res.code === 0) {
        //部分成功部分失败的情况  或者  直接失败

        //文件上传成功或者部分成功
        this.downloadErrorEveProcess = res.data //获取进度条事件句柄
        //错误导入进度条与下载模板
        this.importProcessInfoDialog = true
        this.queryProgress() //获取上传文件进度条信息
      } else {
        let msgError = res.msg || "【系统无法识别EXCLE中的空白、公式和非法字符。请先清理】。" //50*非0情况
        this.$msgBox.alert(`<span style="color:red;">${msgError} </span>`, "温馨提示", {
          dangerouslyUseHTMLString: true
        })
      }
      this.$refs.upload.clearFiles() //清空已上传的文件列表（该方法不支持在 before-upload 中调用）
    },
    queryProgress() {
      //上传进度条
      this.loadErrorExcel = false // 隐藏下载链接
      let progressAjax = window.setInterval(() => {
        GET(process.env.VUE_APP_DOMAIN_personnel + "/queryProgress", { progressKey: this.downloadErrorEveProcess })
          .then(res => {
            this.uploadProcessInfo = res.data //进度信息对象
            if (res.data.total) {
              this.progressPercentAge = parseInt((res.data.handler / res.data.total) * 100)
            }
            if (res.data.finish) {
              //已完成
              this.progressPercentAge = 100 //进度完成度
              let calc = res.data.endTime - res.data.beginTime
              let time = parseInt(calc / 1000) //计算完成时间
              this.uploadProcessInfo.dealAllTime = time >= 1 ? time + "秒" : calc + "毫秒"
              this.JS_search() //刷新页面

              setTimeout(() => {
                if (res.data.failures > 0) {
                  //表示有导入失败的，呈现可下载模板
                  this.downloadErrorKey = res.data.failFile //获取错误模板下载key
                  this.loadErrorExcel = true // 呈现下载链接
                }
                this.progressBackBtn = true //进度条完成后，呈现返回按钮
              }, progressAjax + 1000)
              window.clearInterval(progressAjax) //清除轮询
            }
          })
          .catch(error => {
            window.clearInterval(progressAjax) //清除轮询
            console.log(error)
          })
      }, 1000)
    },
    importProgress() {
      //进度弹框关闭
      this.importProcessInfoDialog = false //关闭进度弹框
      this.progressPercentAge = 0 //进度条清空为0
      this.progressBackBtn = false //隐藏返回按钮
      this.loadErrorExcel = false // 隐藏下载失败链接
    },
    fileClose() {
      //关闭导入弹框
      //清除表单
      this.uploadModal = false
      this.$refs.upload.clearFiles() //清空已上传的文件列表（该方法不支持在 before-upload 中调用）
    },
    handleSelectionChange(val) {
      //当选择项发生变化时会触发该事件
      this.multipleSelection = val
    },
    handlecurrentChange(val) {
      //点击页码，当前页
      this.current = val //保存状态-当前页
      this.searchMaintab()
    },
    handleSizeChange(val) {
      //每页显示多少条数据切换
      this.size = val //保存状态-每页显示多少条数据切换
      this.searchMaintab()
    }
  },
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
