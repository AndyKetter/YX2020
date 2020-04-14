<template>
    <el-row :gutter="10">
        <el-col class="demoPart" :span="12">
            <h3>使用map函数简写</h3>
            <div>
                根state:{{rootState}}/{{rootStateOther}}
            </div>
            <div>
                demo count{{demoState}}
            </div>
            <div>
                {{rootStateC}}
            </div>
            <div>
                111{{rootStateP}}
            </div>
            <div>doubleRootState:{{doubleRootState}}</div>
            <div>demo getters:{{demoGetters}}</div>
            <div>doneCount:{{doneCount}}</div>
            <div><el-button @click="addCommit({n:6})" type="primary">提交add commit</el-button></div>
            <div><el-button @click="addT({n:11})">提交commit</el-button></div>
            <div><el-button @click="increment({n:77})" type="primary">提交action</el-button></div>
            <div><el-button @click="addAction({n:55})" type="primary">提交action</el-button></div>
            <div><el-button @click="demoAction" type="primary">提交demo action</el-button></div>
        </el-col>
    </el-row>
</template>
<script>
import {mapGetters,mapActions,mapState,mapMutations,createNamespacedHelpers} from 'vuex' //导入map函数与命名空间辅助函数
export default {
    name:'Demo',
    data () {
        return {
            localCount:19
        }
    },
    computed:{
        rootStateC(){
            return this.localCount+6
        },
        ...mapState({
            rootState:state=>state.rootState,
            rootStateOther:'rootState', //传字符串参数'rootState'等同于`state=>state.count`
            demoState(state){
                //取demo modules的state的数据
                return state.demo.count + this.localCount
            }
        }),
        ...mapState([
            //映射this.rootStateP为store.state.rootStateP
            'rootStateP'
        ]),
        ...mapGetters([
            'doubleRootState'
        ]),
        ...mapGetters({
            doneCount:'doubleRootState'
        }),
        demoGetters(){
            return this.$store.getters['demo/doubleCount']
        }
    },
    methods: {
        ...mapMutations([
            'add' //页支持负载
        ]),
        addCommit(payload){
            this.add(payload)
        },
        ...mapMutations({
            addT:'add'
        }),
        ...mapActions(['increment']),
        ...mapActions({
            addAction:'increment'
        }),
        ...mapActions('demo',[
            'incrementIfOdd'
        ]),
        demoAction(){
            this.incrementIfOdd({n:7})
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

