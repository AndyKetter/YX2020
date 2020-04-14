<template>
    <el-row :gutter="10">
        <el-col class="demoPart" :span="12">
            <h3>不使用map函数简写</h3>
            <div>获取根state的值:{{rootState}}或者直接页面取{{this.$store.state.test1}}</div>
            <div>获取根getters的值:{{this.$store.getters.doubleRootState}}或者这样获取{{doubleRootState}}</div>
            <div>发根action <el-button @click="addActionClick" type="primary">发action让rootState增加数值</el-button></div>
            <div>获demo state的值:{{demoState}}或者直接页面取{{this.$store.state.demo.count}}</div>
            <div>获取demo getters的值:{{doubleDemoGetter}}或者直接页面取{{this.$store.getters['demo/doubleCount']}}</div>
            <div>发demo action <el-button @click="addDemoActionClick" type="primary">发demo action让rootState增加数值</el-button></div>
            <div>myPage有命名空间getters {{this.$store.getters['demo/myPage/profile']}}</div>
            <div>myPost无命名空间getters {{this.$store.getters['demo/profile']}}</div>
        </el-col> 
    </el-row>
</template>
<script>
export default {
    name:'Demo',
    data () {
        return {
            
        }
    },
    computed: {
        rootState(){
            return this.$store.state.rootState
        },
        doubleRootState(){
            return this.$store.getters.doubleRootState
        },
        demoState(){
            //取demo modules的state的数据
            return this.$store.state.demo.count
        },
        doubleDemoGetter(){
            return this.$store.getters['demo/doubleCount']
        }
    },
    methods: {
        addActionClick(){
            //dispatch一个actions,带了一个payload对象过去
            this.$store.dispatch('increment',{
                n:10
            })
        },
        addDemoActionClick(){
            this.$store.dispatch('demo/incrementIfOdd',{
                n:10
            })
        }
    },
    created () {
        //webpack-devServer代理测试成功
        // this.$http.post('/oa-manage/pcIndex/getIndexStats',{
            
        // }).then(function(response){ 
        //     console.log('axios测试成功5',response)
        // })
    }
}
</script>
<style scoped>
    .demoPart{
        border: 1px solid royalblue;
    }
</style>

