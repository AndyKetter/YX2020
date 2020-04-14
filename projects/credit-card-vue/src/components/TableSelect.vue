<template>
    <div>
        <el-select size="small" v-model="progressSelect" placeholder="跟踪进度">
            <el-option v-for="item in progressOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
    </div>
</template>
<script>
export default {
    name:'TableSelect',
    data () {
        return {
            progressSelect:"",
            progressOptions:[
                {
                    value:1,
                    label:'有部分还款'
                },
                {
                    value:2,
                    label:'有承诺还款'
                },
                {
                    value:3,
                    label:'死单类'
                },
                {
                    value:4,
                    label:'投诉预警'
                },
                {
                    value:5,
                    label:'可继续跟进'
                }
            ]
        }
    }
}
</script>
<style scoped>

</style>

