export default {
    methods: {
        // 文本框的enter事件
        inputEnter() {
            this.JS_search()
        },
        reset(formName) {
            //仅仅清除表单
            this.$refs[formName].resetFields()
        },
        resetAndSearch(formName) {
            //清除表单且重新搜索
            this.$refs[formName].resetFields()
            this.search() //刷新表格，重新获取数据
        },
        JS_add_cancel(formName) {
            //新增取消
            this.addCondition = false //隐藏弹框
            this.reset(formName)
        },
        JS_modify_cancel(formName) {
            //修改取消
            this.updateCondition = false //隐藏弹框
            this.reset(formName)
        },
        handleAddClose() {
            //新增关闭icon
            this.addCondition = false //隐藏弹框
            this.reset("addConditionform")
        },
        handleModifyClose() {
            //修改关闭icon
            this.updateCondition = false //隐藏弹框
            this.reset("updateConditionform")
        }
    }
}