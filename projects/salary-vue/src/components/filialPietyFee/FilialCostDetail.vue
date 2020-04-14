<template>
  <!-- 获取预缴详情 -->
  <div class="grid-content bg-purple">
    <span class="grid-department">{{year}}年已预交月份详情</span>
    <el-table :data="filialCostInfo" style="width: 100%">
      <el-table-column prop="serialNumber" label="序号"></el-table-column>
      <el-table-column prop="payMonth" label="已预交月份"></el-table-column>
      <el-table-column label="已预交金额">
        <template slot-scope="scope">{{scope.row.payMoney | toThousands}}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "filialCostDetail",
  props: {
    filialCostInfo: {
      type: Array,
      required: true,
      default: () => {
        return []
      }
    },
    year: {
      type: String,
      required: true,
      default: () => {
        return ""
      }
    }
  }
}
</script>

<style scoped>
/* 数据表 */
.bg-purple {
  background: #f5f7fa;
}

.grid-content {
  min-height: 36px;
  border: 1px solid #e2e5ef;
  position: relative;
  padding: 5px;
}

.grid-department {
  font-size: 14px;
  color: #24282f;
  letter-spacing: 0.88px;
  line-height: 26px;
  margin-left: 17px;
}
</style>
