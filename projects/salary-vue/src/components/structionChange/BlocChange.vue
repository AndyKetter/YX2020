//集团内部架构管理
<template>
  <div class="blocChange">
    <div class="tbSearch clearfix">
      <div class="pull-right">
        <!-- <el-button
          @click="nextGroupReset"
          :disabled="(resetDisable || submitStatus) && !nextGroups.length"
        >&nbsp;全部重置</el-button>-->
        <el-button
          @click="addVirtualFlag = true"
          :disabled="submitStatus || !nextGroups.length"
        >&nbsp;添加虚拟成员</el-button>
        <el-button
          type="primary"
          v-if="!submitStatus"
          @click="submitGroups"
          :disabled="submitLoading || !nextGroups.length"
        >&nbsp;提交</el-button>
        <el-button
          type="primary"
          v-if="submitStatus"
          @click="operateUnLockStatus"
          :disabled="!nextGroups.length"
        >&nbsp;取消提交</el-button>
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
                  default-expand-all
                  :expand-on-click-node="false"
                >
                  <span class="custom-tree-node" slot-scope="{ node,data }">
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
                  default-expand-all
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
                        v-if="!data.cgurchildren && data.isVirtual"
                        type="danger"
                        style="margin-right:5px"
                        size="mini"
                        :disabled="submitStatus"
                        @click="removeNextGroupMember(node,data)"
                      >删除</el-button>
                      <el-select
                        class="width110"
                        v-model="data.workStatus"
                        placeholder="- 请选择"
                        size="mini"
                        v-if="!data.isVirtual"
                        :disabled="submitStatus"
                        @change="changeEntryStatus(data)"
                      >
                        <el-option
                          v-for="item in entryStatusOptions"
                          :key="item.value"
                          :label="item.name"
                          :value="item.value"
                        ></el-option>
                      </el-select>
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
                        :disabled="data.configStatus == 1 || submitStatus"
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
        <!-- [{ required: true, message: "请选择下级", trigger: "blur" }] -->
        <el-form-item
          label="虚拟职位等级"
          prop="member"
          :rules="{required:true,message:'请选择虚拟成员',trigger:'change'}"
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
    <!-- 待配置弹窗 -->
    <el-dialog
      title="配置"
      :close-on-click-modal="false"
      :visible.sync="configFlag"
      width="350px"
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
        <el-form-item label="选择上级" prop="superior">
          <el-select
            v-model="configForm.superior"
            placeholder="- 请选择 -"
            class="width170"
            filterable
            clearable
          >
            <el-option
              v-for="item in superiorOptions"
              :key="item.cgurGuid"
              :label="getConfigLabelModal(item)"
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
  </div>
</template>

<script>
import { GET, POST } from "http/custom.js"
import mixin from "libs/mixin/StructionChange.js"
export default {
  name: "blocChange",
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
      // 是否可提交下月组织架构及组织架构操纵功能
      submitStatus: false,
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
      // 入职状态
      // entryStatus: "",
      // 入职状态option
      entryStatusOptions: [{ value: "0", name: "在职" }, { value: "1", name: "离职" }, { value: "2", name: "自离" }],
      // resetDisable: false, //是否重置下月组织结构
      configFlag: false, //添加配置弹窗
      configData: {}, //待配置数据
      configList: [], //待配置列表树
      configForm: {
        // 待配置表单
        superior: ""
      },
      configFormRules: {
        // 待配置表单规则
        superior: [{ required: true, message: "请选择", trigger: "change" }]
      },
      superiorOptions: [], //上级选项 option
      // 添加虚拟成员
      addVirtual: {
        member: ""
      },
      addVirtualFlag: false, //添加虚拟成员弹窗
      // 用户级别：1-虚拟组长，2-虚拟部长，3-虚拟副总（就是集团）
      virtualMemberOptions: [{ value: "1", name: "虚拟组长" }, { value: "2", name: "虚拟部长" }]
    }
  },
  created() {
    this.renderCurrentGroup()
    this.renderNextGroup()
    this.renderConfigList()
    // 查询用户(副总级别)的提交锁定状态
    this.getLockStatus()
  },
  methods: {
    // 查询用户(副总级别)的提交锁定状态
    getLockStatus() {
      GET(process.env.VUE_APP_DOMAIN_personnel + "/uplevel/queryLockStatus").then(res => {
        if (res.code === 0) {
          this.submitStatus = res.data
        }
      })
    },
    // 用户(副总级别)解锁提交状态
    operateUnLockStatus() {
      GET(process.env.VUE_APP_DOMAIN_personnel + "/uplevel/unLockStatus").then(res => {
        if (res.code === 0) {
          this.getLockStatus()
        }
      })
    },
    // 渲染当月组织架构
    renderCurrentGroup() {
      this.currentLoading = true
      // 获取当月组织架构list
      this.common_getCurrentGroupData({ userType: 2 }).then(res => {
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
      this.common_getNextGroupData({ userType: 2 }).then(res => {
        if (res.data) {
          this.nextGroups = [res.data]
          console.log("下月组织架构", res.data)
        }
        // 加载下月的loading
        this.nextLoading = false
      })
    },
    // 渲染待配置列表
    renderConfigList() {
      GET(process.env.VUE_APP_DOMAIN_personnel + "/uplevel/queryListOfGroup").then(res => {
        this.configList = res.data
      })
    },
    // 全部重置
    // nextGroupReset() {
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
    //       GET(process.env.VUE_APP_DOMAIN_personnel + "/uplevel/synUserUpLevel", { userType: 2 })
    //         .then(res => {
    //           if (res.code === 0) {
    //             this.$message({
    //               type: "success",
    //               message: "重置成功!"
    //             })
    //             // 刷新下月组织架构树
    //             this.renderNextGroup()
    //             // 刷新待配置树结构
    //             this.renderConfigList()
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
              this.renderNextGroup()
            }
          })
        }
      })
    },
    // 取消添加虚拟成员
    cancelAddVirtualMember(formName) {
      this.$refs[formName].resetFields()
    },
    // 下月组织结构调整操作
    handleDrop(draggingNode, dropNode, dropType) {
      // console.log("tree drop: ", dropNode.label, dropType)
      const obj = { cgurGuid: draggingNode.key, parentId: dropNode.key, pcd: draggingNode.data.pcd }
      if (dropType === "before" || dropType === "after") {
        //同级成员需要找父级成员的用户id
        obj.parentId = dropNode.parent.key
      }
      // 需要提交的组织架构变动的数据
      this.submitCollection.set(draggingNode.key, obj)
    },
    // 下月组织结构 是否允许当前节点插入
    allowDrop(draggingNode, dropNode, type) {
      // console.log("tree allow drop: ", draggingNode, dropNode, type)
      const c_level = draggingNode.data.pcd //当前节点级别
      if (type === "inner") {
        //成员级别大的不能插入成员级别小的节点
        const t_level = dropNode.data.pcd //目标节点级别
        if (c_level >= t_level) {
          return false
        }
      } else {
        //type为 prev next
        //成员级别大的不能插入成员级别小的节点
        const t_level = dropNode.parent.data.pcd //目标父节点级别
        if (dropNode.level === 1 || c_level >= t_level) {
          //拖动成员不能与最高级别目标成员同级
          return false
        }
      }
      return true
    },
    // 下月组织结构 是否允许当前节点拖动
    allowDrag(draggingNode) {
      // console.log("tree allow drag: ", draggingNode)
      if (draggingNode.level === 1) {
        return false
      }
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
                // 刷新下月组织结构
                this.renderNextGroup()
                // 查询用户(副总级别)的提交锁定状态
                this.getLockStatus()
                this.submitLoading = false
              }
            })
            .catch(err => console.log(err))
        })
        .catch(() => {})
    },
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
                this.renderNextGroup()
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
    // 改变入职状态
    changeEntryStatus(data) {
      GET(process.env.VUE_APP_DOMAIN_personnel + "/uplevel/updateWorkStatus", { regId: data.cgurguid, workStatus: data.workStatus })
        .then(() => {
          this.$message({
            type: "success",
            message: "修改成功！"
          })
        })
        .catch(console.warn)
    },
    // 弹层待配置页面
    modalConfig(data) {
      this.configFlag = true
      this.configData = data
      // 集团-待配置-选择上级下拉框
      GET(process.env.VUE_APP_DOMAIN_personnel + "/uplevel/queryUpLevelList", { regId: data.userId }).then(res => {
        this.superiorOptions = res.data
      })
    },
    // 保存待配置
    saveModalConfig(formName) {
      this.$refs[formName].validate(v => {
        if (v) {
          const childRegId = this.configData.userId,
            parentRegId = this.configForm.superior
          GET(process.env.VUE_APP_DOMAIN_personnel + "/uplevel/allocationSave", { childRegId, parentRegId }).then(res => {
            if (res.data) {
              this.$message({
                type: "success",
                message: "配置成功！"
              })
              this.configFlag = false
              // 刷新待配置树结构
              this.renderConfigList()
              // 刷新下月组织架构
              this.renderNextGroup()
            } else {
              this.$message({
                type: "warning",
                message: "配置失败！"
              })
            }
          })
        }
      })
    },
    // 隐藏待配置页面
    cancelModalConfig(formName) {
      this.$refs[formName].resetFields()
      this.configData = {}
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
  margin-top: 18px;
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
