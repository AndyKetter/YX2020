// 部门内部架构管理
<template>
  <div class="deptChange">
    <div class="tbSearch clearfix">
      <div class="pull-right">
        <el-button
          @click="addMemberOperater"
          :disabled="submitStatus || !nextGroups.length"
        >&nbsp;添加下级</el-button>
        <el-button
          @click="addVirtualFlag = true"
          :disabled="submitStatus || !nextGroups.length"
        >&nbsp;添加虚拟成员</el-button>
        <el-button
          type="primary"
          @click="submitGroups"
          :disabled="(submitLoading || submitStatus) || !nextGroups.length"
        >&nbsp;提交</el-button>
      </div>
    </div>
    <!-- tree -->
    <div
      class="table_wrap"
      v-loading="submitLoading"
      element-loading-text="正在提交,请稍等..."
      element-loading-spinner="el-icon-loading"
    >
      <el-row>
        <el-col :span="12">
          <div class="tree-box" :style="{height:dataListObj.dataInfo.t_height2+'px'}">
            <div class="tree-title">
              <span>当月组织结构</span>
            </div>
            <div class="custom-tree-container" v-loading="currentLoading">
              <div class="block">
                <!-- default-expand-all -->
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
        <el-col :span="12">
          <div class="tree-box" :style="{height:dataListObj.dataInfo.t_height2+'px'}">
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
                    <span v-if="!data.cgurchildren && node.level !==1">
                      <el-button
                        type="danger"
                        size="mini"
                        :disabled="submitStatus"
                        @click="removeNextGroupMember(node, data)"
                      >删除</el-button>
                    </span>
                  </span>
                </el-tree>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 添加下级弹窗 -->
    <el-dialog
      title="添加下级"
      :close-on-click-modal="false"
      :visible.sync="addMemberFlag"
      width="310px"
      @closed="cancelAddMember"
    >
      <el-form
        :inline="true"
        :model="addMember"
        ref="addMember"
        style="text-align:left;margin-top:10px"
      >
        <el-form-item
          label="选择下级"
          prop="member"
          :rules="{ required: true, message: '请选择下级', trigger: 'change' }"
        >
          <el-select
            v-model="addMember.member"
            placeholder="- 请选择 -"
            class="width170"
            filterable
            clearable
          >
            <el-option
              v-for="item in memberOptions"
              :key="item.userId"
              :label="getConfigLabel(item)"
              :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addMemberFlag = false">取消</el-button>
        <el-button type="primary" @click="comfireAddMember">确定</el-button>
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
  </div>
</template>

<script>
import { GET, POST } from "http/custom.js"
import mixin from "libs/mixin/StructionChange.js"
export default {
  name: "deptChange",
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

      // addReal: true,
      addRealFlag: false, //添加下级弹窗
      //当前选择的节点成员
      selectNode: null,
      // 添加下级form表单
      addMember: {
        member: ""
      },
      // 未选择上级的所有成员
      memberOptions: [],
      addMemberFlag: false, //添加下级弹窗
      // 添加虚拟成员
      addVirtual: {
        member: ""
      },
      addVirtualFlag: false, //添加虚拟成员弹窗
      // 用户级别：1-虚拟组长，2-虚拟部长，3-虚拟副总（就是集团）
      virtualMemberOptions: [{ value: "1", name: "虚拟组长" }]
    }
  },
  created() {
    this.renderCurrentGroup()
    this.renderNextGroup()
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
    // 渲染当月组织架构
    renderCurrentGroup() {
      this.currentLoading = true
      // 获取当月组织架构list
      this.common_getCurrentGroupData({ userType: 1 }).then(res => {
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
      this.common_getNextGroupData({ userType: 1 }).then(res => {
        if (res.data) {
          this.nextGroups = [res.data]
        }
        // 加载下月的loading
        this.nextLoading = false
      })
    },
    // 下月组织结构调整操作 cgurGuid:用户的注册id,field_7:父节点id,pcd:成员职务code
    handleDrop(draggingNode, dropNode, dropType) {
      //dropType:before、after、inner
      // console.log("tree drop: ", draggingNode, dropNode, dropType)
      const obj = { cgurGuid: draggingNode.key, parentId: dropNode.key, pcd: draggingNode.data.pcd }
      if (dropType === "before" || dropType === "after") {
        //同级成员需要找父级成员的用户id
        obj.parentId = dropNode.parent.key
      }
      // 需要提交的组织架构变动的数据
      this.submitCollection.set(draggingNode.key, obj)
      // console.log("下月组织结构调整操作", this.submitCollection)
    },
    // 下月组织结构 是否允许当前节点插入
    allowDrop(draggingNode, dropNode, type) {
      // console.log("是否允许当前节点插入: ", draggingNode, dropNode, type)
      const c_level = draggingNode.data.pcd //当前节点级别
      if (type === "inner") {
        //成员员级别大的不能插入成员级别小的节点
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
      // console.log("是否允许当前节点拖动: ", draggingNode)
      if (draggingNode.level === 1) {
        return false
      }
      return true
    },
    // 添加成员操作
    addMemberOperater() {
      this.addMemberFlag = true
      // 部门选择下级-获得下级中的成员
      GET(process.env.VUE_APP_DOMAIN_personnel + "/uplevel/getLowLevelList").then(res => {
        if (!res) return
        this.memberOptions = res.data
      })
    },
    // 取消添加下级
    cancelAddMember() {
      this.$refs.addMember.resetFields()
    },
    // 保存添加下级
    comfireAddMember() {
      this.$refs.addMember.validate(v => {
        if (v) {
          this.addMemberFlag = false
          const regId = this.addMember.member
          GET(process.env.VUE_APP_DOMAIN_personnel + "/uplevel/addLowLevelOfDept", { regId }).then(res => {
            console.log(res)
            if (res.code === 0) {
              this.$message({
                type: "success",
                message: "保存成功！"
              })
              this.addMemberFlag = false
              this.renderNextGroup()
            }
          })
        }
      })
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
                this.submitLoading = false
              }
            })
            .catch(err => console.log(err))
        })
        .catch(() => {})
    },
    // 删除下月组织加构成员
    removeNextGroupMember(node, data) {
      let msg = "成员"
      if (data.isVirtual) {
        msg = "虚拟职位"
      }
      this.$msgBox
        .confirm("<span>确认在下月组织架构中删除该" + msg + "吗？</span>", "温馨提示", {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          const regId = node.key
          GET(process.env.VUE_APP_DOMAIN_personnel + "/uplevel/removeMember", { regId })
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
