export default { //通用table高度mixin
    data() {
        return {
            tabHeight: null //表格高度计算
        }
    },
    mounted() {
        this.tabHeight = window.innerHeight - this.t_height //动态计算表格高度
    }
}