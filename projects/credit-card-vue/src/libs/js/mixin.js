/* eslint-disable no-undef */
//window.innerHeight
// window.screen.height
// document.documentElement.clientHeight
//导出mixin修复page-content全屏功能与所有页面加载动画
export default {
    mounted() {
        $('.page-content').height(window.innerHeight - 80)
        // const loadingInstance = this.$loading({
        //     fullScreen: true,
        //     lock: true,
        //     background: 'rgba(255, 255, 255, .3)'
        // })
        // setTimeout(() => {
        //     loadingInstance.close()
        // }, 500)
    }
}