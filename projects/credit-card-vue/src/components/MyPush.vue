<template>
  <div class="page-content">
    <div class="pushWrap">
      <div class="searchWrap clearfix">
        <span class="demostration">推送时间：</span>
        <el-date-picker v-model="pushDate" type="date" placeholder="选择日期" style="width:180px"></el-date-picker>

        <span style="margin-left:10px">推送内容：</span>
        <el-input placeholder="请输入" v-model="pushContent" style="width:200px"></el-input>

        <div class="pull-right">
          <el-button type="primary" icon="el-icon-search" class="pad-rigt">搜索</el-button>
          <el-button class="moreSearch">自定义推送</el-button>
        </div>
      </div>
      <el-table :data="tableData" border :header-cell-style="{backgroundColor:'#e5e9f3'}" style="width:100%;margin-top:10px" class="data_table">
        <el-table-column fixed prop="pushContent" label="推送内容"></el-table-column>
        <el-table-column prop="pushTime" label="推送时间"></el-table-column>
        <el-table-column prop="studyNum" label="学习人数"></el-table-column>
        <el-table-column prop="unstudyNum" label="未学习人数"></el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <router-link :to="{name:'MyPushDetail',params:{id:scope.$index+1}}">查看</router-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import myMixin from '../libs/js/mixin.js' //导入mixin修复page-content全屏功能
export default {
  name: "MyPush",
  mixins:[myMixin],
  methods: {},
  data() {
    return {
      pushDate: "",
      pushContent: "",
      tableData: [
        {
          pushContent: "你真的懂催收吗？",
          pushTime: "2019-03-14 09:14:00",
          studyNum: "20",
          unstudyNum: "12"
        },
        {
          pushContent: "你真的懂催收吗？",
          pushTime: "2019-03-14 09:14:00",
          studyNum: "20",
          unstudyNum: "12"
        },
        {
          pushContent: "你真的懂催收吗？",
          pushTime: "2019-03-14 09:14:00",
          studyNum: "20",
          unstudyNum: "12"
        }
      ]
    };
  }
};
</script>

<style scoped>
.pushWrap{
  padding: 15px;
  background-color: #fff;
}
.pad-rigt {
  padding-right: 20px;
}
</style>
