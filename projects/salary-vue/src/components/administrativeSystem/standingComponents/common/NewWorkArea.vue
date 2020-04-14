// edit by zc
// 新建工作区域/导出时工作区域选项
<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" width="30%">
    <el-form
      ref="form"
      :model="condition"
      :rules="rules"
      class="condition-content"
      label-width="80px"
      size="mini"
    >
      <el-form-item style="width:50%" v-if="itemSeting.showArea" label="工作区域" prop="work_area">
        <el-select v-model="condition.work_area" placeholder="请选择">
          <el-option
            v-for="item in locations"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="width:50%" v-if="itemSeting.showPay" label="付款类型" prop="pay">
        <el-select v-model="condition.pay" placeholder="请选择">
          <el-option
            v-for="item in payType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="width:50%" v-if="itemSeting.showPrice" label="单价" prop="pay">
        <el-input-number v-model="condition.price" :min="0" :controls="false" label="元/桶"></el-input-number>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="save">确 认</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    // 弹出层标题
    title: {
      type: String,
      required: true
    },
    // 条件类型
    itemSeting: {
      type: Object,
      default: () => {
        return {
          showArea: true,
          showPay: false,
          showPrice: false,
          isAreaRule: true, //工作区域是否必须
          isPayRule: false, //支付类型是否必须
          isPriceRule: false //金额是否必须
        }
      }
    },
    // 条件状态
    itemStatus: {
      type: Object,
      default: () => {
        return {
          work_area: "",
          pay: "",
          price: ""
        }
      }
    }
  },
  computed: {
    // 表单提交规则
    rules() {
      let obj = {}
      if (this.itemSeting.showArea && this.itemSeting.isAreaRule) {
        obj.work_area = [{ required: true, trigger: "change", message: "请选择工作区域" }]
      }
      if (this.itemSeting.showPay && this.itemSeting.isPayRule) {
        obj.pay = [{ required: true, trigger: "change", message: "请选择工作区域" }]
      }
      if (this.itemSeting.showPrice && this.itemSeting.isPriceRule) {
        obj.price = [{ required: true, trigger: "change", message: "请输入单价" }]
      }
      return obj
    }
  },
  data() {
    return {
      dialogVisible: false,
      // 保存确认后的值
      condition: {
        work_area: "",
        pay: "",
        price: ""
      },
      //工作区域集合
      locations: [{ value: 1, label: "总部" }, { value: 2, label: "鑫远" }, { value: 3, label: "公园道" }, { value: 4, label: "日业" }],
      // 付款类型
      payType: [{ value: 1, label: "月结" }, { value: 2, label: "预存" }, { value: 3, label: "季付" }, { value: 4, label: "半年付" }, { value: 5, label: "年付" }]
    }
  },
  methods: {
    // 弹出新建工作区域
    open() {
      this.dialogVisible = true
    },
    // 关闭新建工作区域
    close() {
      this.dialogVisible = false
    },
    // 取消
    cancel() {
      this.reset()
      this.close()
    },
    // 保存
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit("commit", this.condition)
          this.close()
        } else {
          this.$message({
            type: "warning",
            message: "提交失败，验证不通过",
            showClose: true
          })
          return false
        }
      })
    },
    // 重置
    reset() {
      this.$refs.form.resetFields()
    }
  },
  watch: {
    itemStatus(val) {
      this.condition = val
    }
  }
}
</script>
<style lang="less" scoped>
.condition-content {
  display: flex;
  flex-wrap: wrap;
}
</style>