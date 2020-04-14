// edit by zc
// 公共表格组件
<template>
  <el-table :data="tableData" border style="width: 100%" :height="tabHeight" :header-cell-style="{backgroundColor:'#e5e9f3'}">
    <el-table-column type="index" label="序号" width="80" fixed="left"></el-table-column>
    <el-table-column v-for="(item,i) in tableHead" :key="i" :prop="item.prop" :label="item.label" :fixed="item.fixed" :header-align="item.align || 'left'" :min-width="item.prop === 'workAreaName' ? 180:120">
      <template v-if="!Array.isArray(item.children)" slot-scope="scope">
        <!--饮用水费台帐 独用 :chldrn :lbe -->

        <td-edit v-if="item.enableEdit" :row="scope.row" :prop="item.prop" :roots="t_operate.root" :chldrn="[]" :lbe="''" @edit="edit">
          {{scope.row[item.prop] | toThousands}}
        </td-edit>
        <span v-else>{{scope.row[item.prop]}}</span>
      </template>
      <el-table-column v-for="(obj,j) in item.children" :key="j" :prop="obj.prop" :label="obj.label" :min-width="item.prop === 'workAreaName' ? 180:120">
        <template slot-scope="scope">
          <!--饮用水费台帐 独用 :chldrn :lbe -->

          <td-edit v-if="item.enableEdit" :row="scope.row" :roots="t_operate.root" :prop="obj.prop" :lbe="obj?obj.label:''" :chldrn="item ? item.children:[]" @edit="edit">
            {{scope.row[obj.prop] | toThousands}}
          </td-edit>
          <span v-else>{{scope.row[obj.prop]}}</span>
        </template>
      </el-table-column>
    </el-table-column>
    <el-table-column fixed="right" label="操作" width="100" v-if="(t_operate.op !== '费用总台帐') && ( t_operate.root.payUpdate || t_operate.root.delete)">
      <template slot-scope="scope">
        <el-button type="text" size="small" @click="modify(scope.row)" v-if="t_operate.root.payUpdate">修改</el-button>
        <el-button type="text" size="small" @click="deleted(scope.row)" v-if="t_operate.root.delete">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import tbMixin from "libs/mixin/tbMixin.js" //动态计算表格高度mixin
import tdEdit from "./TableEdit" //自定义td编辑组件
export default {
  mixins: [tbMixin],
  props: {
    tableHead: { // 表头数据
      type: Array,
      required: true
    },
    t_height: {//表格减去的高度
      type: Number,
      default: 200
    },
    tableData: {// 表内容数据
      type: Array,
      default: () => []
    },
    t_operate: { //操作权限
      type: Object,
      default: () => []
    },
  },
  components: {
    tdEdit
  },
  methods: {
    // 单行数据编辑
    modify(row) {
      this.$emit("modify", row);
    },
    // 当行数据删除
    deleted(row) {
      this.$emit("deleted", row);
    },
    // 表格td编辑组件广发事件
    edit(obj) {
      this.$emit("edit", obj)
    }
  }
}
</script>