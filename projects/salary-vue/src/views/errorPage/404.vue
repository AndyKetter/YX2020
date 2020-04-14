<template>
  <div class="error-404 tc">
    <div class="e-msg animated fadeInDown">哎呀，出错了！</div>
    <img class="mg40 animated infinite flip slow" src="~libs/images/404.png" alt="404错误图片">
    <div class="e-msg-t mg40 animated fadeInUp">您还可以通过以下方式继续访问：</div>
    <el-button class="goBackHome animated fadeInUp" type="primary" @click="goBackHome">访问首页</el-button>
  </div>
</template>

<script>
export default {
  name: 'error404',
  methods: {
    goBackHome() {
      this.$router.push({ name: 'personalEmpty' })
    }
  }
}
</script>

<style scoped>
.error-404 {
  display: inline-block;
  width: 600px;
  height: 325px;
  padding: 15px;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}
.tc {
  text-align: center;
}
.e-msg {
  font-size: 20px;
  color: #2e76ee;
}
.e-msg-t {
  font-size: 14px;
  color: #2e76ee;
}
.mg40 {
  margin-top: 40px;
}
.goBackHome {
  margin-top: 25px;
}
/*动画效果*/
.animated {
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

.animated.infinite {
  -webkit-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
}

.animated.slow {
  -webkit-animation-duration: 2s;
  animation-duration: 2s;
}

@keyframes flip {
  from {
    -webkit-transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0)
      rotate3d(0, 1, 0, -360deg);
    transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0)
      rotate3d(0, 1, 0, -360deg);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }

  40% {
    -webkit-transform: perspective(400px) scale3d(1, 1, 1)
      translate3d(0, 0, 150px) rotate3d(0, 1, 0, -190deg);
    transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 150px)
      rotate3d(0, 1, 0, -190deg);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }

  50% {
    -webkit-transform: perspective(400px) scale3d(1, 1, 1)
      translate3d(0, 0, 150px) rotate3d(0, 1, 0, -170deg);
    transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 150px)
      rotate3d(0, 1, 0, -170deg);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }

  80% {
    -webkit-transform: perspective(400px) scale3d(0.95, 0.95, 0.95)
      translate3d(0, 0, 0) rotate3d(0, 1, 0, 0deg);
    transform: perspective(400px) scale3d(0.95, 0.95, 0.95) translate3d(0, 0, 0)
      rotate3d(0, 1, 0, 0deg);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }

  to {
    -webkit-transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0)
      rotate3d(0, 1, 0, 0deg);
    transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0)
      rotate3d(0, 1, 0, 0deg);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
}

.animated.flip {
  -webkit-backface-visibility: visible;
  backface-visibility: visible;
  -webkit-animation-name: flip;
  animation-name: flip;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}

.fadeInDown {
  -webkit-animation-name: fadeInDown;
  animation-name: fadeInDown;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    -webkit-transform: translate3d(0, 100%, 0);
    transform: translate3d(0, 100%, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}

.fadeInUp {
  -webkit-animation-name: fadeInUp;
  animation-name: fadeInUp;
}
</style>
