<template>
  <div>
    <router-view v-if="isRouterActive"></router-view>
  </div>
</template>

<script>
export default {
  name: "cphOprionSystem",
  provide() {
    //传给子孙组件的provide,类似vuex具有穿透效果
    return {
      reload: this.reload,
      count: this.getCount
    }
  },
  data() {
    return {
      isRouterActive: true,
      count: 0
    }
  },
  methods: {
    reload() {
      //通过v-if重新刷新组件
      this.isRouterActive = false
      this.$nextTick(function () {
        this.isRouterActive = true
      })
    },
    getCount() {
      return this.count++;
    }
  }
}
</script>

<style scoped>
</style>
