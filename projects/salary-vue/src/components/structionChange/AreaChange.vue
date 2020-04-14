//区域内部架构管理
<template>
  <div class="areaChange">
    <div class="tbSearch clearfix">
      <el-form class="pull-left" ref="operationForm" :inline="true" :model="operationForm">
        <el-form-item label="集团" prop="viceId">
          <el-select
            class="width155"
            v-model="operationForm.viceId"
            placeholder="- 请选择"
            @change="searchGroupMember"
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
        <el-form-item
          label="员工编号"
          prop="employedNo"
          :rules="{ validator:employValidator,trigger:'change'}"
        >
          <el-input
            placeholder="请输入员工编号"
            :controls="false"
            v-model.trim="operationForm.employedNo"
            class="width155"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="被替换员工编号"
          prop="replaceEmployNo"
          :rules="{ validator:employValidator,trigger:'change'}"
        >
          <el-input
            placeholder="请输入员工编号"
            :controls="false"
            v-model.trim="operationForm.replaceEmployNo"
            class="width155"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="employNoReplace('operationForm')"
            :disabled="!nextGroups.length"
          >替换</el-button>
        </el-form-item>
      </el-form>
      <div class="pull-right">
        <!-- <el-button @click="resetNextGroup" :disabled="resetDisable && !nextGroups.length">&nbsp;全部重置</el-button> -->
        <el-button @click="addVirtualFlag = true" :disabled="!nextGroups.length">&nbsp;添加虚拟成员</el-button>
        <el-button
          type="primary"
          @click="submitGroups"
          :disabled="submitLoading || !nextGroups.length"
        >&nbsp;提交</el-button>
      </div>
    </div>
    <div
      class="table_wrap"
      v-loading="submitLoading"
      element-loading-text="正在提交,请稍等..."
      element-loading-spinner="el-icon-loading"
    >
      <el-row>
        <el-col :span="7">
          <div class="tree-box mt-0" :style="{height:dataListObj.dataInfo.t_height2+'px'}">
            <div class="tree-title">
              <span>当月组织结构</span>
            </div>
            <div class="custom-tree-container" v-loading="currentLoading">
              <div class="block">
                <el-tree
                  :data="currentGroups"
                  node-key="cgurguid"
                  ref="treeCurrent"
                  :expand-on-click-node="false"
                >
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{getLabel(data)}}</span>
                  </span>
                </el-tree>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="tree-box mt-0" :style="{height:dataListObj.dataInfo.t_height2+'px'}">
            <div class="tree-title">
              <span>下月组织架构</span>
            </div>
            <div class="custom-tree-container" v-loading="nextLoading">
              <div class="block">
                <el-tree
                  :data="nextGroups"
                  draggable
                  highlight-current
                  node-key="cgurguid"
                  :expand-on-click-node="false"
                  ref="treeNext"
                  @node-drop="handleDrop"
                  :allow-drop="allowDrop"
                  :allow-drag="allowDrag"
                >
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{getLabel(data)}}</span>
                    <span>
                      <el-button
                        type="danger"
                        size="mini"
                        v-if="!data.cgurchildren && data.isVirtual"
                        @click="removeNextGroupMember(node,data)"
                      >删除</el-button>
                      <el-button
                        type="default"
                        size="mini"
                        v-if="data.pcd === 3"
                        @click="modalSampleConfig(data)"
                      >配置</el-button>
                    </span>
                  </span>
                </el-tree>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="tree-box mt-0" :style="{height:dataListObj.dataInfo.t_height2+'px'}">
            <div class="tree-title">
              <span>待配置</span>
            </div>
            <div class="custom-tree-container">
              <div class="block">
                <el-tree
                  :data="configList"
                  node-key="userId"
                  default-expand-all
                  :expand-on-click-node="false"
                >
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{getConfigLabel(data)}}</span>
                    <span>
                      <el-button
                        type="primary"
                        size="mini"
                        @click="modalConfig(data)"
                        :disabled="data.configStatus == 1"
                      >{{data.configStatus == 1 ? '已配置' : '配置'}}</el-button>
                    </span>
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
        <el-form-item label="业务类型" prop="businessType">
          <!-- collapse-tags -->
          <el-select
            v-model="sampleConfigForm.businessType"
            placeholder="- 请选择 -"
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
    <!-- 待配置弹窗 -->
    <el-dialog
      title="配置"
      :close-on-click-modal="false"
      :visible.sync="configFlag"
      width="450px"
      @closed="cancelModalConfig('configForm')"
    >
      <span
        class="name-title"
      >{{`${configData.userFactName} ${configData.employedNo || ''} (${getLevelLabel(Number(configData.userLevel))})`}}</span>
      <el-form
        :inline="true"
        :model="configForm"
        :rules="configFormRules"
        ref="configForm"
        style="text-align:left;margin-top:10px"
      >
        <el-form-item label="调整级别" prop="userLevel">
          <el-select
            v-model="configForm.userLevel"
            placeholder="- 请选择 -"
            class="width170"
            filterable
          >
            <el-option
              v-for="item in userLevelOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择集团" prop="userGroupId">
          <el-select
            v-model="configForm.userGroupId"
            placeholder="- 请选择 -"
            class="width170"
            filterable
          >
            <el-option
              v-for="item in userGroupOptions"
              :key="item.cgurGuid"
              :label="`${item.cgurFactname} ${item.employedNo || ''}`"
              :value="item.cgurGuid"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="configFlag = false">取消</el-button>
        <el-button type="primary" @click="saveModalConfig('configForm')">确定</el-button>
      </span>
    </el-dialog>
    <!-- 添加虚拟成员弹层 -->
    <el-dialog
      title="添加虚拟成员"
      :close-on-click-modal="false"
      :visible.sync="addVirtualFlag"
      @closed="cancelAddVirtualMember('addVirtual')"
      width="334px"
    >
      <el-form
        :inline="true"
        :model="addVirtual"
        ref="addVirtual"
        style="text-align:left;margin-top:10px"
      >
        <el-form-item
          label="虚拟职位等级"
          prop="member"
          :rules="{required:true,message:'请选择虚拟成员',trigger:'blur'}"
        >
          <el-select
            v-model="addVirtual.member"
            placeholder="- 请选择 -"
            class="width170"
            filterable
            clearable
          >
            <el-option
              v-for="item in virtualMemberOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVirtualFlag = false">取消</el-button>
        <el-button type="primary" @click="comfireAddVirtual('addVirtual')">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { GET, POST } from "http/custom.js"
import mixin from "libs/mixin/StructionChange.js"
export default {
  name: "areaChange",
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
  data() {
    return {
      // 提交下月组织架构遮罩层
      submitLoading: false,
      // 下月组织架构成员变动集合
      submitCollection: new Map(),
      // 加载当月的loading
      currentLoading: true,
      // 加载下月的loading
      nextLoading: true,
      // 下月组织结构
      nextGroups: [],
      // 当月组织结构
      currentGroups: [],
      operationForm: {
        viceId: "", //集团id(副总)
        employedNo: "", // 成员编号
        replaceEmployNo: "" //被替换的成员编号
      },
      viceOptions: [], // 集团option(副总)
      // resetDisable: false, //是否重置下月组织结构
      sampleConfigFlag: false, //下月组织架构 各成员配置弹窗
      sampleConfigData: {}, //下月组织架构 各成员信息
      sampleConfigForm: {
        //下月组织架构 各成员配置表单
        businessType: [] //业务类型
      },
      sampleConfigFormRules: {
        //下月组织架构 各成员配置表单规则
        businessType: { required: true, message: "请选择业务类型", trigger: "change" }
      },

      configFlag: false, //添加配置弹窗
      configData: {}, //待配置数据
      configList: [], //待配置列表树
      configForm: {
        // 待配置表单
        userLevel: "", //级别
        userGroupId: "" //集团
      },
      configFormRules: {
        // 待配置表单规则
        userLevel: [{ required: true, message: "请选择调整级别", trigger: "change" }],
        userGroupId: [{ required: true, message: "请选择集团", trigger: "change" }]
      },
      // 用户级别：0-组员，1-组长，2-部长，3-副总，4-总经理
      userLevelOptions: [{ value: "0", name: "组员" }, { value: "1", name: "组长" }, { value: "2", name: "部长" }], //调整级别 option
      userGroupOptions: [], //集团 option
      // 添加虚拟成员
      addVirtual: {
        member: ""
      },
      addVirtualFlag: false, //添加虚拟成员弹窗
      // 用户级别：1-虚拟组长，2-虚拟部长，3-虚拟副总（就是集团）
      virtualMemberOptions: [{ value: "1", name: "虚拟组长" }, { value: "2", name: "虚拟部长" }, { value: "3", name: "虚拟副总" }]
    }
  },
  created() {
    this.renderCurrentGroup()
    this.renderNextGroup()
    // 集团（副总）字典
    this.queryVice()
    // 获取待配置列表树
    this.getQueryListOfRegion()
  },
  methods: {
    // 员工编号验证
    employValidator(rule, v, cb) {
      if (v) {
        if (!/^\d*$/.test(v.toString())) {
          cb("只能为数字")
          return
        }
      } else {
        cb("请输入员工编号")
      }
      cb()
    },
    // levelCode 职务级别。0普通员工 1组长 2部长 3副总 4总经理 5总裁
    // parentRegId 上一级的regId：如查询所有副总时，parentRegId就是总经理的regId（代表查询该总经理下的所有副总）
    queryVice() {
      //集团（副总）字典
      GET(process.env.VUE_APP_DOMAIN_personnel + "/uplevel/getUpLevelInfo", {
        levelCode: 3
      })
        .then(res => {
          //查询薪资类型模板
          if (Array.isArray(res.data)) {
            const arr = []
            res.data.forEach(obj => {
              arr.push({ key: obj.cgurGuid, name: `${obj.cgurFactname}(${obj.employedNo || ""})` })
            })
            this.viceOptions = arr
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 通过集团（副总）regid查询组织架构
    searchGroupMember(regId) {
      if (regId) {
        // 通过regid获取当前成员的所有下级成员的当月组织结构
        this.common_getCurrentGroupsDataById({ regId }).then(res => {
          this.currentGroups = [res.data]
          this.currentLoading = false
        })
        // 通过regid获取当前成员的所有下级成员的下月组织结构
        this.common_getNextGroupDataById({ regId }).then(res => {
          this.nextGroups = [res.data]
          this.nextLoading = false
        })
      } else {
        // 刷新当月组织架构
        this.renderCurrentGroup()
        //  刷新下月组织架构
        this.renderNextGroup()
      }
    },
    // 渲染当月组织架构
    renderCurrentGroup() {
      this.currentLoading = true
      // 获取当月组织架构list
      this.common_getCurrentGroupData({ userType: 3 }).then(res => {
        if (res.data) {
          this.currentGroups = [res.data]
        }
        // 加载当月的loading
        this.currentLoading = false
      })
    },
    // 渲染下月组织结构
    renderNextGroup() {
      this.nextLoading = true
      // 获取下月组织架构list
      this.common_getNextGroupData({ userType: 3 }).then(res => {
        if (res.data) {
          this.nextGroups = [res.data]
        }
        // 加载下月的loading
        this.nextLoading = false
      })
    },
    // 成员编号替换
    employNoReplace(formName) {
      this.$refs[formName].validate(v => {
        if (v) {
          const fromEmployeeNo = this.operationForm.employedNo,
            toEmployeeNo = this.operationForm.replaceEmployNo
          if (fromEmployeeNo && toEmployeeNo) {
            // 点击替换查询用户的信息
            GET(process.env.VUE_APP_DOMAIN_personnel + "/uplevel/queryUserInfo", { fromEmployeeNo, toEmployeeNo }).then(res => {
              if (res.code === 0) {
                let arr = res.data
                if (arr.length !== 2) {
                  this.$message({
                    type: "warning",
                    message: "请输入正确的员工编号！"
                  })
                  return
                }
                if (arr[0].employedNo === toEmployeeNo) {
                  arr = arr.reverse()
                }
                const level1 = this.levelCollection.get(arr[0].positionCode),
                  level2 = this.levelCollection.get(arr[1].positionCode)
                const str = `<span>确认将${(level1 && level1.pname) || ""} ${arr[0].cgurFactname} ${arr[0].employedNo}替换${(level2 && level2.pname) || ""} ${arr[1].cgurFactname} ${arr[1].employedNo}当前的组织架构吗？</span>`
                this.$msgBox
                  .confirm(str, "温馨提示", {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                  })
                  .then(() => {
                    // 替换操作
                    GET(process.env.VUE_APP_DOMAIN_personnel + "/uplevel/replaceUserUpLevel", {
                      fromEmployeeNo,
                      toEmployeeNo
                    })
                      .then(res => {
                        if (res.data) {
                          this.$message({
                            type: "success",
                            message: "替换成功!"
                          })
                          // 刷新组织架构
                          this.searchGroupMember(this.operationForm.viceId)
                          // 刷新待配置列表
                          this.getQueryListOfRegion()
                          // 刷新条件查询集团字段
                          this.queryVice()
                        }
                      })
                      .catch(err => console.log(err))
                  })
                  .catch(() => {})
              }
            })
          }
        }
      })
    },
    // 全部重置
    // resetNextGroup() {
    //   this.$msgBox
    //     .confirm("该操作会同步最新当月组织架构数据，还原之前的操作数据，确定执行该操作吗？", "温馨提示", {
    //       dangerouslyUseHTMLString: true,
    //       confirmButtonText: "确定",
    //       cancelButtonText: "取消",
    //       type: "warning"
    //     })
    //     .then(() => {
    //       this.resetDisable = true
    //       // userType 使用的用户：1，部门内部架构管理；2，集团内部架构管理；3，区域内部架构管理；4，业务部组织架构管理（管理所有）
    //       GET(process.env.VUE_APP_DOMAIN_personnel + "/uplevel/synUserUpLevel", { userType: 3 })
    //         .then(res => {
    //           if (res.code === 0) {
    //             this.$message({
    //               type: "success",
    //               message: "重置成功!"
    //             })
    //             // 刷新组织架构
    //             this.searchGroupMember(this.operationForm.viceId)
    //             // 刷新带配置列表
    //             this.getQueryListOfRegion()
    //             this.resetDisable = false
    //           }
    //         })
    //         .catch(err => {
    //           if (err) {
    //             console.log(err)
    //           }
    //           this.resetDisable = false
    //         })
    //     })
    //     .catch(err => {
    //       if (err) {
    //         console.log(err)
    //       }
    //     })
    // },
    // 删除下月组织加构虚拟成员
    removeNextGroupMember(node) {
      this.$msgBox
        .confirm("<span>确定删除该虚拟职位吗？</span>", "温馨提示", {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          const regId = node.key
          GET(process.env.VUE_APP_DOMAIN_personnel + "/uplevel/deleteVirtualMember", { regId })
            .then(res => {
              if (!res) return
              if (res.data) {
                this.$message({
                  type: "success",
                  message: "删除成功！"
                })
                // 刷新组织架构
                this.searchGroupMember(this.operationForm.viceId)
              } else {
                this.$message({
                  type: "warning",
                  message: "删除失败！"
                })
              }
            })
            .catch(err => {
              console.warn(err)
            })
        })
        .catch(() => {})
    },
    //下月组织架构 各成员配置 弹出
    modalSampleConfig(data) {
      this.sampleConfigFlag = true
      this.sampleConfigData = data
      const arr = []
      data.bcd.split(",").forEach(v => {
        if (v) {
          arr.push(v)
        }
      })
      this.sampleConfigForm.businessType = arr
    },
    //保存下月组织架构 各成员配置
    saveSampleConfig(formName) {
      this.$refs[formName].validate(v => {
        if (v) {
          const regId = this.sampleConfigData.cgurguid,
            caseTypeCodes = this.sampleConfigForm.businessType.join(",")
          GET(process.env.VUE_APP_DOMAIN_personnel + "/uplevel/modifyUpLevelConfig", {
            regId,
            caseTypeCodes
          }).then(res => {
            if (res.code === 0) {
              this.$message({
                type: "success",
                message: "配置成功！"
              })
              this.sampleConfigFlag = false
              // 刷新组织架构
              this.searchGroupMember(this.operationForm.viceId)
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

    // 获取待配置列表
    getQueryListOfRegion() {
      GET(process.env.VUE_APP_DOMAIN_personnel + "/uplevel/queryListOfRegion").then(res => {
        this.configList = res.data
      })
    },
    // 待配置表单字段 选择集团option
    getConfigGroupList() {
      GET(process.env.VUE_APP_DOMAIN_personnel + "/uplevel/getGroupList").then(res => {
        // console.log(res)
        this.userGroupOptions = res.data
      })
    },
    // 弹层待配置页面
    modalConfig(data) {
      this.configFlag = true
      this.configData = data
      // 获取待配置表单字段 选择集团option
      this.getConfigGroupList()
    },
    // 保存待配置
    saveModalConfig(formName) {
      this.$refs[formName].validate(v => {
        if (v) {
          // console.log("配置 验证成功")
          const userId = this.configData.userId
          GET(process.env.VUE_APP_DOMAIN_personnel + "/uplevel/updateAllocated", { userId, ...this.configForm }).then(res => {
            if (res.code === 0) {
              this.$message({
                type: "success",
                message: "配置成功！"
              })
              this.configFlag = false
              // 刷新带配置列表
              this.getQueryListOfRegion()
              // 刷新组织架构
              this.searchGroupMember(this.operationForm.viceId)
            }
          })
        }
      })
    },
    // 隐藏待配置页面
    cancelModalConfig(formName) {
      this.$refs[formName].resetFields()
      this.configData = {}
    },
    //添加虚拟人员
    comfireAddVirtual(formName) {
      this.addVirtualFlag = true
      this.$refs[formName].validate(v => {
        if (v) {
          const userLevel = this.addVirtual.member
          GET(process.env.VUE_APP_DOMAIN_personnel + "/uplevel/addVirtualMember", { userLevel }).then(res => {
            if (res.code === 0) {
              this.$message({
                type: "success",
                message: "添加虚拟成员成功！"
              })
              this.addVirtualFlag = false
              // 刷新组织架构
              this.searchGroupMember(this.operationForm.viceId)
            }
          })
        }
      })
    },
    // 取消添加虚拟成员
    cancelAddVirtualMember(formName) {
      this.$refs[formName].resetFields()
    },
    // 下月组织架构调整操作后，相应改变其成员的职位级别
    // handleChangeGroupLevel(draggingNode, dropNode, dropType) {},
    // 下月组织结构调整操作
    handleDrop(draggingNode, dropNode, dropType) {
      // console.log("tree drop: ", draggingNode, dropNode, dropType)
      // 记录成员变动位置
      const obj = { cgurGuid: draggingNode.key, parentId: dropNode.key, pcd: draggingNode.data.pcd }
      // 需要提交的组织架构变动的数据
      this.submitCollection.set(draggingNode.key, obj)
      // 下月组织架构调整操作后，相应改变其成员的职位级别 dropType:before inner after
      if (dropType === "inner") {
        //若当前拖动的成员在目标成员下，其职位级别在目标成员下降一级
        draggingNode.data.pcd = dropNode.data.pcd - 1
      } else {
        if (dropNode.parent.parent) {
          //若当前拖动的成员与目标成员同级，其职位级别在目标成员的上级中下降一级
          draggingNode.data.pcd = dropNode.parent.data.pcd - 1
        } else {
          //若当前拖动的成员与目标成员同级且无上级，其职位级别在目标成员与目标成员同级
          draggingNode.data.pcd = dropNode.data.pcd
        }
        //同级成员需要找父级成员的用户id
        obj.parentId = dropNode.parent.key
      }
      obj.pcd = draggingNode.data.pcd
      // 需要提交的组织架构变动的数据
      this.submitCollection.set(draggingNode.key, obj)
    },
    // 下月组织结构 是否允许当前节点插入
    allowDrop(draggingNode, dropNode, type) {
      // console.log("tree allow drop: ", draggingNode, dropNode, type)
      if (type === "inner") {
        if (dropNode.data.pcd === 0) {
          return false
        }
      } else if (dropNode.level === 1) {
        //拖动成员不能与最高级别目标成员同级
        return false
      }
      return true
    },
    // 下月组织结构 是否允许当前节点拖动
    allowDrag(draggingNode) {
      // 职务级别 0 组员，1 组长，2 部长，3 副总，4 总经理，5 总裁，10000 董事长
      if (draggingNode.level === 1 || draggingNode.data.pcd === 3) return false
      return true
    },
    // 提交
    submitGroups() {
      this.$msgBox
        .confirm("<span>确认提交本次调整的架构信息吗？</span>", "温馨提示", {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          this.submitLoading = true
          const dataList = [...this.submitCollection.values()]
          POST(process.env.VUE_APP_DOMAIN_personnel + "/uplevel/commitSave", { dataList })
            .then(res => {
              if (res.code === 0) {
                this.$message({
                  type: "success",
                  message: "提交成功！"
                })
                this.submitCollection = new Map()
                // 刷新组织架构
                this.searchGroupMember(this.operationForm.viceId)
                this.submitLoading = false
              }
            })
            .catch(err => console.log(err))
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped lang="less">
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
  }
}
</style>
