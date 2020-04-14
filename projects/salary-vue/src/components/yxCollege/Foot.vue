<template>
  <div>
    <section class="foot">
      <div class="info-panel">
        <div>
          <div class="info-bg"></div>
          <div class="info-text">
            <p>集团地址：</p>
            <p>湖南省长沙市高新区岳麓大道588号芯城科技园7号楼</p>
          </div>
        </div>
        <div>
          <div class="info-bg phone"></div>
          <div class="info-text">
            <p>24小时维权投诉热线：0731-81821888</p>
            <p>24小时维权投诉热线：0731-81829999</p>
          </div>
        </div>
        <div class="foot-code"></div>
      </div>
      <p class="copy">Copyright&copy;2015&nbsp;湖南永雄资产管理集团版权所有&nbsp;.All&nbsp;Rights&nbsp;Reserved&nbsp;湘ICP备&nbsp;15012179号-1</p>
    </section>
  </div>
</template>

<script>
export default {
  name: "foot",
  data() {
    return {

    };
  },
  created() { },
  methods: {},
};
</script>

<style lang="less" scoped>
@import "~libs/css/yxCollege/lcb.less";

/*公用样式*/
.display {
  display: inline-block;
}
.ver-align {
  vertical-align: middle;
}
.bg-bd {
  background: transparent;
  border: 0;
  padding: 0;
  color: #c0c0c0;
}
/*公用样式*/
.foot {
  position: absolute;
  width: 100%;
  bottom: 0;
  text-align: center;

  .info-panel {
    background-color: white;
    padding: 10px 0;
    .ver-align;
    overflow: hidden;
    min-width: 1200px;

    & > div {
      .display;
    }

    & > div + div {
      margin-left: 80px;
    }

    .info-bg {
      width: 50px;
      height: 50px;
      .display;
      .ver-align;
      margin-right: 15px;
      background: url("../../libs/images/yxCollege/location.png") no-repeat 100%;
    }

    .phone {
      background: url("../../libs/images/yxCollege/phone.png") no-repeat 100%;
    }

    .info-text {
      text-align: left;
      .display;
      .ver-align;
    }

    .foot-code {
      width: 80px;
      height: 80px;
      background-image: url("../../libs/images/yxCollege/code.png");
      background-repeat: no-repeat;
      background-size: contain;
      vertical-align: middle;
    }
  }
  .copy {
    color: #999;
    line-height: 34px;
    height: 34px;
  }

  p {
    margin: 0;
    padding: 3px 0;
  }
}
</style>
