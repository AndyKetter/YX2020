// edit by zc
// 公共表格单元格编辑组件
<template>
  <div class="edit">
    <!-- 有数据时显示修改图标，没有数据时显示添加图标 -->
    <span v-if="row[prop] || row[prop] == 0">
      <slot></slot>
      <!-- row.isEdited 此表格行内是否有修改操作-->
      <!-- roots.maintence 是否有权限 -->
      <!--(lbe ? (lbe.includes('费用(元)')?false:true):true) 饮用水费中每月的 费用(元) 不作修改,后面不显示修改icon-->
      <!-- 普通用户只可修改为0的数据，不为0时有权限的用户可修改 -->
      <!--饮用水费台帐 独用 :chldrn 中包含每列每月中的 单价(元/桶)、 数量(桶)、费用（元）-->
      <!--饮用水费台帐 独用 :lbe 用来判断修改的是 单价(元/桶) 还是 数量(桶) -->
      <i v-if="(row.isEdited && (row[prop] == 0 || roots.maintence)) &&  (lbe ? (lbe.includes('费用(元)')?false:true):true)" class="el-icon-edit" @click="edit('修改',lbe)"></i>
    </span>
    <!-- 不呈现添加图标 -->
    <!-- <span v-else>
      <i class="el-icon-plus" @click="edit('添加')"></i>
    </span> -->
  </div>
</template>
<script>
export default {
  props: {
    row: {
      type: Object,
      required: true
    },
    roots: {
      type: Object,
      required: true
    },
    prop: {
      type: String,
      required: true
    },
    chldrn: {
      type: Array,
      required: true
    },
    lbe: {
      type: String,
      required: true
    },
  },
  data() {
    return {}
  },
  methods: {
    // 编辑/修改
    edit(name, lbe) {
      this.$emit("edit", { row: this.row, prop: this.prop, name, prop2: this.chldrn || '', lable: lbe })
    }
  }
}
</script>
<style lang="less" scoped>
.edit {
  i {
    padding: 0 5px;
    &:hover {
      color: #409eff;
    }
  }
}
</style>