<template>
  <div id="app" v-cloak>
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'app',
  created() {

  }
}
</script>
<style>
/* v-clock是修复vue绑定数据双花括号闪烁问题 */
[v-cloak] {
  display: none;
}
</style>
<style scoped>
</style>
