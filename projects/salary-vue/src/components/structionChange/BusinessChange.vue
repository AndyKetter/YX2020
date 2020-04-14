<template>
  <div
    class="businessChange"
    v-loading="synchronouLoading || resetDisable"
    :element-loading-text="elementLoadingText"
    element-loading-spinner="el-icon-loading"
  >
    <div class="tbSearch clearfix">
      <el-form class="pull-left" :inline="true">
        <el-form-item label="总经理">
          <el-select
            class="width155"
            @change="getViceListInfo"
            v-model="condition.managerId"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option
              v-for="item in managerOptions"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="副总">
          <el-select
            class="width155"
            v-model="condition.viceId"
            placeholder="请选择"
            @change="getMinisterListInfo"
            clearable
            filterable
          >
            <el-option
              v-for="item in viceOptions"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部长">
          <el-select
            class="width155"
            v-model="condition.ministerId"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option
              v-for="item in ministerOptions"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            :disabled="nextLoading || currentLoading"
            @click="searchGroupMember"
          >搜索</el-button>
        </el-form-item>
      </el-form>
      <div class="pull-right">
        <el-button @click="resetNextGroup">&nbsp;全部重置</el-button>
        <el-button @click="synchronouGroup">&nbsp;同步组织结构</el-button>
      </div>
    </div>
    <div class="table_wrap">
      <el-row>
        <el-col :span="8">
          <div class="tree-box mt-0" :style="{height:dataListObj.dataInfo.t_height2+'px'}">
            <div class="tree-title">
              <span>当月组织结构</span>
            </div>
            <div class="custom-tree-container" v-loading="currentLoading">
              <div class="block">
                <!-- :default-expanded-keys="currentExpandedKey" -->
                <el-tree
                  node-key="cgurguid"
                  highlight-current
                  lazy
                  :data="currentGroups"
                  :load="loadCurrentGroupsNode"
                  :expand-on-click-node="false"
                  :props="{isLeaf:data => (!data.pcd || !data.cgurchildren)}"
                  ref="treeCurrent"
                >
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{getLabel(data)}}</span>
                    <!-- <div
                      v-if="getCompanyLabel(data.ccd) && data.pcd !== 10000"
                      class="icon-box"
                    >{{getCompanyLabel(data.ccd)}}</div>-->
                    <el-tooltip
                      v-if="getCompanyLabel(data.ccd)"
                      :content="getCompanyLabel(data.ccd)"
                      placement="top"
                      effect="light"
                    >
                      <el-button class="icon-box">{{getCompanyLabel(data.ccd)}}</el-button>
                    </el-tooltip>
                  </span>
                </el-tree>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="11">
          <div class="tree-box mt-0" :style="{height:dataListObj.dataInfo.t_height2+'px'}">
            <div class="tree-title">
              <span>下月组织架构</span>
            </div>
            <div class="custom-tree-container" v-loading="nextLoading">
              <div class="block">
                <!-- :default-expanded-keys="nextExpandedKey" -->
                <el-tree
                  node-key="cgurguid"
                  highlight-current
                  lazy
                  :data="nextGroups"
                  :load="loadNextGroupsNode"
                  :expand-on-click-node="false"
                  :props="{isLeaf:data => (!data.cgurchildren)}"
                  ref="treeNext"
                >
                  <div class="custom-tree-node" slot-scope="{ node, data }">
                    <div>{{getLabel(data)}}</div>
                    <div v-if="data.pcd !== 10000">
                      <el-tooltip
                        v-if="getCompanyLabel(data.ccd)"
                        :content="getCompanyLabel(data.ccd)"
                        placement="top"
                        effect="light"
                      >
                        <el-button class="icon-box">{{getCompanyLabel(data.ccd)}}</el-button>
                      </el-tooltip>
                      <!-- <div
                        class="icon-box"
                        v-if="getCompanyLabel(data.ccd)"
                      >{{getCompanyLabel(data.ccd)}}</div>-->
                      <el-button type="default" size="mini" @click="modalSampleConfig(data)">配置</el-button>
                      <el-button
                        type="primary"
                        size="mini"
                        v-if="data.isVirtual"
                        @click="modalSmapleSetting(data)"
                      >设置</el-button>
                      <!-- cgurchildren -->
                      <el-button
                        type="danger"
                        size="mini"
                        v-if="!data.isVirtual"
                        @click="removeNextGroupMember(node,data)"
                      >移出</el-button>
                    </div>
                  </div>
                </el-tree>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="tree-box mt-0" :style="{height:dataListObj.dataInfo.t_height2+'px'}">
            <div class="tree-title">
              <span>待配置</span>
            </div>
            <div class="custom-tree-container">
              <div class="block">
                <el-tree
                  :data="configList"
                  node-key="cgurguid"
                  default-expand-all
                  :expand-on-click-node="false"
                >
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{getConfigLabel(data)}}</span>
                  </span>
                </el-tree>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!--下月组织架构 各成员配置弹窗  -->
    <el-dialog
      title="配置"
      :close-on-click-modal="false"
      :visible.sync="sampleConfigFlag"
      width="450px"
      @closed="cancelSampleConfig('sampleConfig')"
    >
      <span
        class="name-title"
      >{{`${sampleConfigData.cgurfactname} ${sampleConfigData.employedNo || ''} (${getLevelLabel(Number(sampleConfigData.pcd))})`}}</span>
      <el-form
        :inline="true"
        :model="sampleConfigForm"
        :rules="sampleConfigFormRules"
        ref="sampleConfig"
        style="text-align:left;margin-top:10px"
      >
        <el-form-item label="调整级别" prop="level">
          <el-select
            v-model="sampleConfigForm.level"
            placeholder="- 请选择 -"
            class="width180"
            filterable
          >
            <el-option
              v-for="item in levelOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工作区域" prop="workArea">
          <el-select
            v-model="sampleConfigForm.workArea"
            placeholder="- 请选择 -"
            class="width180"
            filterable
          >
            <el-option
              v-for="item in companyCollection.values()"
              :key="item.cid"
              :label="item.cname"
              :value="item.cid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务类型" prop="businessType">
          <!-- collapse-tags -->
          <el-select
            v-model="sampleConfigForm.businessType"
            placeholder="- 请选择 -"
            class="width180"
            filterable
            multiple
          >
            <el-option
              v-for="item in caseTypeCollection.values()"
              :key="item.typeId"
              :label="item.typeName"
              :value="item.typeId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sampleConfigFlag = false">取消</el-button>
        <el-button type="primary" @click="saveSampleConfig('sampleConfig')">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="设置"
      :close-on-click-modal="false"
      :visible.sync="settingFlag"
      width="310px"
      @closed="cancelSampleSetting('settingForm')"
    >
      <!-- <span class="name-title">钢蛋186****4486 (组员)</span> -->
      <el-form
        :inline="true"
        :model="settingForm"
        :rules="settingFormRules"
        ref="settingForm"
        style="text-align:left;margin-top:10px"
        v-if="configList.length"
      >
        <el-form-item>
          <el-radio-group v-model="settingForm.fromRegId">
            <el-radio
              class="padding-5"
              v-for="item in configList"
              :key="item.cgurguid"
              :label="item.userId"
            >{{`${item.userFactName} ${item.employedNo || ''} (${getLevelLabel(Number(item.userLevel))})`}}</el-radio>
            <!-- <el-radio class="padding-5" label="2">张三150****4975 (副总)</el-radio> -->
          </el-radio-group>
        </el-form-item>
      </el-form>
      <p v-else style="text-align:center">暂无数据</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="settingFlag = false">取消</el-button>
        <el-button type="primary" @click="saveSampleSetting('settingForm')">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { GET } from "http/custom.js"
import mixin from "libs/mixin/StructionChange.js"
export default {
  name: "businessChange",
  mixins: [mixin],
  props: {
    dataListObj: {
      type: Object,
      required: true,
      default: () => {
        return {
          dataInfo: {} //接收到父组件中的 dataObj ，里面会有多个数组
        }
      }
    }
  },
  watch: {
    // 总经理option
    managerOptions: {
      //解决搜索到的总经理组织架构中将下月组织架构中该成员变成虚拟成员时，刷新managerOptions中不存在已选managerId问题
      handler(val) {
        const i = val.findIndex(obj => obj.key === this.condition.managerId)
        if (i === -1) {
          //刷新managerOptions中不存在已选managerId时，将其置空
          this.condition.managerId = ""
        }
      },
      deep: true
    },
    // 副总option
    viceOptions: {
      //解决搜索到的副总组织架构中将下月组织架构中该成员变成虚拟成员时，刷新viceOptions中不存在已选viceId问题
      handler(val) {
        const i = val.findIndex(obj => obj.key === this.condition.viceId)
        if (i === -1) {
          //刷新viceOptions中不存在已选viceId时，将其置空
          this.condition.viceId = ""
        }
      },
      deep: true
    },
    // 部长option
    ministerOptions: {
      //解决搜索到的部长组织架构中将下月组织架构中该成员变成虚拟成员时，刷新ministerOptions中不存在已选ministerId问题
      handler(val) {
        const i = val.findIndex(obj => obj.key === this.condition.ministerId)
        if (i === -1) {
          //刷新ministerOptions中不存在已选ministerId时，将其置空
          this.condition.ministerId = ""
        }
      },
      deep: true
    }
  },
  data() {
    return {
      // 全局loading层提示文本
      elementLoadingText: "",
      // 同步组织架构loading层
      synchronouLoading: false,
      resetDisable: false, //是否重置下月组织结构
      // 下拉查询loading层
      selectLoading: false,
      // 加载当月的loading
      currentLoading: true,
      // 加载下月的loading
      nextLoading: true,
      // 当月组织架构是否懒加载
      // islazyCurrentLoad: true,
      // 下月组织架构是否懒加载
      // islazyNextLoad: true,
      isCurrentFirst: true, //是否第一次进  (当月组织架构)
      currentGroupsResolve: null, //节点解析方法(记录渲染节点解析方法)，用于懒加载刷新节点 (当月组织架构)
      currentGroupsNode: null, //节点(节点对象)，用懒加载刷新节点  (当月组织架构)
      isNextFirst: true, //是否第一次进 (下月组织架构)
      nextGroupsResolve: null, //节点解析方法(记录渲染节点解析方法)，用于懒加载刷新节点 (下月组织架构)
      nextGroupsNode: null, //节点(节点对象)，用懒加载刷新节点 (下月组织架构)
      // 下月组织结构
      nextGroups: [],
      // 当月组织结构
      currentGroups: [],
      // 查询条件
      condition: {
        managerId: "", //总经理id
        ministerId: "", //部长id
        viceId: "" //副总id
      },
      // 总经理option
      managerOptions: [],
      // 副总option
      viceOptions: [],
      // 部长option
      ministerOptions: [],
      // 当月组织结构默认展开的节点
      currentExpandedKey: [],
      // 下月组织结构默认展开的节点
      nextExpandedKey: [],
      configList: [], //待配置成员list
      // 弹窗
      sampleConfigFlag: false, //下月组织架构 各成员配置弹窗
      sampleConfigData: {}, //下月组织架构 各成员信息
      sampleConfigForm: {
        //下月组织架构 各成员配置表单
        level: "", //下属
        workArea: "", //工作区域
        businessType: [] //业务类型
      },
      sampleConfigFormRules: {
        //下月组织架构 各成员配置表单规则
        level: { required: true, message: "请选择下属", trigger: "change" },
        workArea: { required: true, message: "请选择工作区域", trigger: "change" },
        businessType: { required: true, message: "请选择业务类型", trigger: "change" }
      },
      levelOptions: [{ value: 0, name: "组员" }, { value: 1, name: "组长" }, { value: 2, name: "部长" }, { value: 3, name: "副总" }, { value: 4, name: "总经理" }], //调整级别 option, //无上级的成员
      // workAreaOptions: [], //所有作业中心
      // businessTypeOptions: [], //业务类型option
      settingFlag: false, //下月组织架构 各成员设置弹窗
      settingForm: {
        //下月组织架构 各成员设置 form表单
        fromRegId: "", //当前成员regid
        toRegId: "" //被替换的虚拟用户的id
      },
      settingFormRules: {
        //下月组织架构 各成员设置 form表单规则
        fromRegId: [{ required: true, message: "请选择", trigger: "change" }]
      }
    }
  },
  created() {
    // 获取总经理list信息
    this.getManagerListInfo()
    // 获取待配置列表数据
    this.getQueryListOfRegion()
  },
  methods: {
    // 刷新查询条件options
    refreshLevelOptions() {
      // 刷新总经理list信息
      this.getManagerListInfo()
      // 刷新副总list信息
      this.getViceListInfo()
      // 刷新部长list信息
      this.getMinisterListInfo()
    },
    // 搜索组织结构人员
    searchGroupMember() {
      const managerId = this.condition.managerId,
        viceId = this.condition.viceId,
        ministerId = this.condition.ministerId,
        regId = ministerId || viceId || managerId
      this.currentLoading = true
      this.nextLoading = true
      if (regId) {
        // 通过regid获取当前成员的所有下级成员的当月组织结构
        this.common_getCurrentGroupsDataById({ regId, lazyLoad: 1 }).then(res => {
          this.currentGroups = []
          res.data && this.currentGroups.push(res.data)
          this.currentLoading = false
        })
        // 通过regid获取当前成员的所有下级成员的下月组织结构
        this.common_getNextGroupDataById({ regId, lazyLoad: 1 }).then(res => {
          this.nextGroups = []
          res.data && this.nextGroups.push(res.data)
          this.nextLoading = false
        })
      } else {
        // 重置当月,下月组织架构节点数据
        this.currentGroups = []
        this.nextGroups = []
        // 懒加载当月组织结构节点
        this.refreshCurrentGroupNode()
        // 懒加载下月组织结构节点
        this.refreshNextGroupNode()
      }
    },
    // 同步组织架构
    synchronouGroup() {
      // console.log("同步组织架构")
      this.$msgBox
        .confirm("<span>该操作会执行业务部门更改的最新组织架构信息，同步后无法撤销更改，确定执行操作吗？</span>", "温馨提示", {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          this.synchronouLoading = true
          this.elementLoadingText = "正在同步组织架构,请稍等..."
          GET(process.env.VUE_APP_DOMAIN_personnel + "/uplevel/reverseSynUserUpLevel")
            .then(res => {
              this.synchronouLoading = false
              if (res.data) {
                this.$message({
                  type: "success",
                  message: "成功同步组织架构!"
                })
              }
            })
            .catch(err => {
              console.log(err)
              this.synchronouLoading = false
            })
        })
        .catch(console.log)
    },
    // 获取待配置列表
    getQueryListOfRegion() {
      GET(process.env.VUE_APP_DOMAIN_personnel + "/uplevel/queryListOfAll").then(res => {
        this.configList = res.data
      })
    },
    // 刷新当月组织架构
    refreshCurrentGroupNode() {
      // 刷新时，遮罩层
      this.currentLoading = true
      // 清空已加载的子节点
      this.currentGroupsNode.childNodes = []
      // 初始化下月组织结构节点
      this.loadCurrentGroupsNode(this.currentGroupsNode, this.currentGroupsResolve)
    },
    // 懒加载当月组织结构节点
    loadCurrentGroupsNode(node, resolve) {
      if (this.isCurrentFirst) {
        this.currentGroupsNode = node
        this.currentGroupsResolve = resolve
        this.isCurrentFirst = false
      }
      if (node.level) {
        //level大于1,通过regid获取下属
        this.common_getCurrentGroupsNode({ regId: node.key }).then(res => {
          if (node.data.pcd === 1) {
            //若为组长，最后的组织结构就是员工
            res.data.map(obj => Object.assign(obj, { isLeaf: !obj.pcd }))
          }
          resolve(res.data)
        })
      } else {
        //level为0，初始化组织结构
        this.common_getCurrentGroupData({ userType: 4, lazyLoad: 1 }).then(res => {
          this.currentLoading = false
          if (res.data) {
            resolve([res.data])
          }
        })
      }
    },
    // 刷新下月组织架构
    refreshNextGroupNode() {
      // 刷新时，遮罩层
      this.nextLoading = true
      // 清空已加载的子节点
      this.nextGroupsNode.childNodes = []
      // 初始化下月组织结构节点
      this.loadNextGroupsNode(this.nextGroupsNode, this.nextGroupsResolve)
    },
    // 懒加载下月组织结构节点
    loadNextGroupsNode(node, resolve) {
      if (this.isNextFirst) {
        //记录懒加载的节点对象及加载节点方法
        this.nextGroupsResolve = resolve
        this.nextGroupsNode = node
        this.isNextFirst = false
      }
      if (node.level) {
        //level大于1,通过regid获取下属节点
        this.common_getNextGroupsNode({ regId: node.key }).then(res => {
          // console.log(res)
          if (node.data.pcd === 1) {
            //若为组长，最后的组织结构就是员工
            res.data.map(obj => Object.assign(obj, { isLeaf: !obj.pcd }))
          }
          if (res.data) {
            resolve(res.data)
          }
        })
      } else {
        //level为0，初始化组织结构
        this.common_getNextGroupData({ userType: 4, lazyLoad: 1 }).then(res => {
          this.nextLoading = false
          if (res.data) {
            resolve([res.data])
          }
        })
      }
    },
    // 总经理/副总/部长/组长/员工人员信息查询  levelCode:0普通员工 1组长 2部长 3副总 4总经理 5总裁
    getUpLevelInfo(obj = {}) {
      obj = Object.assign(obj, { batch: this.condition.batch })
      return GET(process.env.VUE_APP_DOMAIN_personnel + "/uplevel/getUpLevelInfo", obj)
    },
    // 获取总经理list信息
    getManagerListInfo() {
      this.selectLoading = true
      this.getUpLevelInfo({ levelCode: 4 }).then(res => {
        this.selectLoading = false
        if (Array.isArray(res.data)) {
          const arr = []
          res.data.forEach(obj => {
            arr.push({ key: obj.cgurGuid, name: `${obj.cgurFactname}(${obj.employedNo || ""})` })
          })
          this.managerOptions = arr
        }
      })
    },
    // 获取副总list信息
    getViceListInfo() {
      const parentRegId = this.condition.managerId
      if (parentRegId) {
        this.selectLoading = true
        this.getUpLevelInfo({ levelCode: 3, parentRegId }).then(res => {
          this.selectLoading = false
          if (Array.isArray(res.data)) {
            const arr = []
            res.data.forEach(obj => {
              arr.push({ key: obj.cgurGuid, name: `${obj.cgurFactname}(${obj.employedNo || ""})` })
            })
            this.viceOptions = arr
          }
        })
      } else {
        this.viceOptions = []
        this.condition.viceId = null
        // 获取部长list信息
        this.getMinisterListInfo()
      }
    },
    // 获取部长list信息
    getMinisterListInfo() {
      const parentRegId = this.condition.viceId
      if (parentRegId) {
        this.selectLoading = true
        this.getUpLevelInfo({ levelCode: 2, parentRegId }).then(res => {
          this.selectLoading = false
          if (Array.isArray(res.data)) {
            const arr = []
            res.data.forEach(obj => {
              arr.push({ key: obj.cgurGuid, name: `${obj.cgurFactname}(${obj.employedNo || ""})` })
            })
            this.ministerOptions = arr
          }
        })
      } else {
        this.ministerOptions = []
        this.condition.ministerId = null
      }
    },
    // 全部重置
    resetNextGroup() {
      this.$msgBox
        .confirm("该操作会同步最新当月组织架构数据，还原之前的操作数据，确定执行该操作吗？", "温馨提示", {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          this.resetDisable = true
          this.elementLoadingText = "正在重置,请稍等..."
          // userType 使用的用户：1，部门内部架构管理；2，集团内部架构管理；3，区域内部架构管理；4，业务部组织架构管理（管理所有）
          GET(process.env.VUE_APP_DOMAIN_personnel + "/uplevel/synUserUpLevel", { userType: 4 })
            .then(res => {
              if (res.code === 0) {
                this.$message({
                  type: "success",
                  message: "重置成功!"
                })
                // 刷新组织架构
                this.searchGroupMember()
                // 刷新带配置列表
                this.getQueryListOfRegion()
                // 刷新查询条件options
                this.refreshLevelOptions()
                this.resetDisable = false
              }
            })
            .catch(err => {
              if (err) {
                console.log(err)
              }
              this.resetDisable = false
            })
        })
        .catch(err => {
          if (err) {
            console.log(err)
          }
        })
    },
    //下月组织架构 各成员配置 弹出
    modalSampleConfig(data) {
      this.sampleConfigFlag = true
      this.sampleConfigData = data
      // 初始化默认值
      this.sampleConfigForm.level = data.pcd
      this.sampleConfigForm.workArea = data.ccd
      this.sampleConfigForm.businessType = []
      data.bcd.split(",").forEach(id => {
        if (id) {
          this.sampleConfigForm.businessType.push(id)
        }
      })
    },
    //保存下月组织架构 各成员配置
    saveSampleConfig(formName) {
      this.$refs[formName].validate(v => {
        if (v) {
          const regId = this.sampleConfigData.cgurguid,
            caseTypeCodes = this.sampleConfigForm.businessType.join(","),
            positionCode = this.sampleConfigForm.level,
            companyCode = this.sampleConfigForm.workArea
          // sampleConfigForm
          GET(process.env.VUE_APP_DOMAIN_personnel + "/uplevel/modifyUpLevelConfig", { regId, positionCode, companyCode, caseTypeCodes }).then(res => {
            if (res.code === 0) {
              this.$message({
                type: "success",
                message: "配置成功！"
              })
              this.sampleConfigFlag = false
              // 刷新组织架构
              this.searchGroupMember()
              // 刷新查询条件options
              this.refreshLevelOptions()
            }
          })
        }
      })
    },
    // 取消下月组织架构 各成员配置
    cancelSampleConfig(formName) {
      this.$refs[formName].resetFields()
      this.sampleConfigData = {}
    },
    // 下月组织架构 各成员设置 弹出
    modalSmapleSetting(data) {
      this.settingForm.toRegId = data.cgurguid
      this.settingFlag = true
    },
    // 保存下月组织架构 各成员设置
    saveSampleSetting(formName) {
      const form = this.$refs[formName]
      form &&
        form.validate(v => {
          if (v) {
            GET(process.env.VUE_APP_DOMAIN_personnel + "/uplevel/setUserUpLevel", this.settingForm)
              .then(res => {
                if (res.code === 0) {
                  this.$message({
                    type: "success",
                    message: "设置成功！"
                  })
                  this.settingFlag = false
                  // 刷新组织架构
                  this.searchGroupMember()
                  // 刷新待配置树结构
                  this.getQueryListOfRegion()
                  // 刷新查询条件options
                  this.refreshLevelOptions()
                }
              })
              .catch(err => {
                console.log(err)
                this.$message({
                  type: "warning",
                  message: "设置失败！"
                })
              })
          }
        })
    },
    // 取消下月组织架构 各成员设置
    cancelSampleSetting(formName) {
      const form = this.$refs[formName]
      form && form.resetFields()
      this.settingForm.toRegId = ""
    },
    // 删除下月组织加构虚拟成员
    removeNextGroupMember(node) {
      this.$msgBox
        .confirm("<span>确定移出该成员吗？</span>", "温馨提示", {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          const regId = node.key
          GET(process.env.VUE_APP_DOMAIN_personnel + "/uplevel/moveOutData", { regId })
            .then(res => {
              if (!res) return
              if (res.data) {
                this.$message({
                  type: "success",
                  message: "移出成功！"
                })
                // 刷新组织架构
                this.searchGroupMember()
                // 刷新待配置列表
                this.getQueryListOfRegion()
                // 刷新查询条件options
                this.refreshLevelOptions()
              } else {
                this.$message({
                  type: "warning",
                  message: "移出失败！"
                })
              }
            })
            .catch(err => {
              console.warn(err)
            })
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped lang="less">
.padding-5 {
  padding: 5px;
}
.tree-box {
  border: 1px solid #dfe3ec;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  .tree-title {
    border-bottom: 1px solid #dfe3ec;
    background-color: #e4e9f3;
    height: 49px;
    vertical-align: middle;
    flex: 0 0 50px;
    span {
      line-height: 49px;
      margin-left: 20px;
    }
  }
  .custom-tree-container {
    margin-left: 20px;
    flex: 1;
    overflow: auto;
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
    }
    .icon-box {
      display: inline-block;
      background-color: #e6e9f3;
      color: #606266;
      font-size: 12px;
      padding: 4px 6px;
      max-width: 90px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin-right: 5px;
    }
    .el-radio {
      height: 30px;
    }
  }
}
</style>
