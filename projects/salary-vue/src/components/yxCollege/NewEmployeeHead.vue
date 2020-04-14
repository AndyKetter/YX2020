<template>
  <div class="course-top">
    <el-col>
      <el-col :span="12" class="top-nav">
        <slot name="back"></slot>
      </el-col>
      <el-col :span="12" class="top-nav txt-align">
        <slot name="btn"></slot>
      </el-col>
    </el-col>
  </div>
</template>

<script>
export default {
  name: "newEmployeeHead",
  //props: ['back', 'btn'],
  data() {
    return {}
  }
}
</script>

<style lang="less" scoped>
@import "~libs/css/yxCollege/lcb.less";

.font-size {
  font-size: 20px !important;
}

.course-top {
  top: 0;
  position: fixed;
  z-index: 1;
  width: 100%;
  margin: 0 -20px;
  padding: 0 20px;
  overflow: hidden;
  .font-size;
  font-weight: bold;
  .bg(#fff);
  .box-shadow;

  .top-nav {
    padding: 20px;

    &:first-child {
      margin-top: 10px;
    }

    img {
      width: 13px;
      height: 17px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
    }
  }

  .txt-align {
    text-align: right;
  }
}
</style>
