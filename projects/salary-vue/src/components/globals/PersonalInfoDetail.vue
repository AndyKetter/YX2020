<template>
  <!-- 员工组织关系-个人信息组件 -->
  <div class="grid-content bg-purple">
    <span class="grid-department">个人信息</span>
    <div class="item-table">
      <table border="1" cellspacing="0" cellpadding="0" class="dTable">
        <tr>
          <td style="width:20%">姓名</td>
          <td style="width:30%">{{personalInfoObj.personalInfo.userName}}</td>
          <td style="width:20%">性别</td>
          <td style="width:30%">
            <span v-if="personalInfoObj.personalInfo.sex == 1">男</span>
            <span v-if="personalInfoObj.personalInfo.sex == 0">女</span>
          </td>
        </tr>
        <tr>
          <td>员工编号</td>
          <td>{{personalInfoObj.personalInfo.employedNo}}</td>
          <td>所属级别</td>
          <td>{{personalInfoObj.personalInfo.levelName}}</td>
        </tr>
        <tr>
          <td>隶属单位</td>
          <td colspan="3">{{personalInfoObj.personalInfo.areaName}}</td>
        </tr>
        <tr>
          <td>所属部门</td>
          <td>{{personalInfoObj.personalInfo.departmentName}}</td>
          <td>所属职务</td>
          <td>{{personalInfoObj.personalInfo.positionName}}</td>
        </tr>
        <tr>
          <td>组织关系</td>
          <td colspan="3">{{personalInfoObj.personalInfo.levelExpand}}</td>
        </tr>
        <tr>
          <td>直接上级</td>
          <td colspan="3">{{personalInfoObj.personalInfo.parentUserName}}</td>
        </tr>
        <tr>
          <td style="width:20%">在职状态</td>
          <td style="width:30%">
            <span v-if="personalInfoObj.personalInfo.status == 0">未入职</span>
            <span v-if="personalInfoObj.personalInfo.status == 1">在职</span>
            <span v-if="personalInfoObj.personalInfo.status == 2">离职</span>
            <span v-if="personalInfoObj.personalInfo.status == 3">在职(重)</span>
          </td>
          <td style="width:20%">入职日期</td>
          <td style="width:30%">{{personalInfoObj.personalInfo.employedDates}}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "personalInfoDetail",
  props: {
    personalInfoObj: {
      type: Object,
      required: true,
      default: () => {
        return {
          // name:'暂无姓名',
          personalInfo: {}
        };
      }
    }
  }
};
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

.pot {
  width: 12px;
  height: 12px;
  display: block;
  border-radius: 50%;
  position: absolute;
  left: 7px;
  top: 12px;
  z-index: 10;
}

.grid-department {
  font-size: 14px;
  color: #24282f;
  letter-spacing: 0.88px;
  line-height: 26px;
  margin-left: 17px;
}

.grid-btn {
  float: right;
  margin-right: 5px;
  cursor: default;
}

table.dTable {
  border-collapse: collapse;
  width: 100%;
  border: 1px solid #c6ccdd;
  background-color: #fff;
}

table.dTable tr th,
table.dTable tr td {
  border: 1px solid #c6ccdd;
  padding-left: 10px;
  height: 40px;
  color: #000;
  font-size: 13px;
  text-align: left;
  font-weight: 500;
}

table.dTable tr.thead {
  background-color: #e5e9f3;
}

table.dTable tr.thead th {
  color: #60646c;
}
</style>
