<template>
    <div class="page-content flexwrap">
        <div class="listLft mar-rgt">
            <div class="mainHelp pad-all">
                <div class="clearfix">
                    <span class="pathnav">业务入门&nbsp;>&nbsp;法律法规&nbsp;>&nbsp;《最高人民法院关于审理涉及夫妻债务纠纷案件适用法律有关问题的解释》</span>
                    <router-link :to="{name:'businessPrimer'}" class="returnList">返回上一级</router-link>
                </div>
                <div class="helpwrap pad-all">
                    <h2>《最高人民法院关于审理涉及夫妻债务纠纷案件适用法律有关问题的解释》</h2>
                   <div class="helpTxt">
                     <p>第一条:  夫妻双方共同签字或者夫妻一方事后追认等共同意思表示所负的债务，应当认定为夫妻共同债务。</p>
                     <p>第二条： 夫妻一方在婚姻关系存续期间以个人名义为家庭日常生活需要所负的债务，债权人以属于夫妻共同债务为由主张权利的，人民法院应予支持。</p>
                    <p>第三条：  夫妻一方在婚姻关系存续期间以个人名义超出家庭日常生活需要所负的债务，债权人以属于夫妻共同债务为由主张权利的，人民法院不予支持，但债权人能够证明该债务用于夫妻共同生活、共同生产经营或者基于夫妻双方共同意思表示的除外。</p>
                    </div>
                </div>
            </div>

        </div>
        <div class="listRgt">
             <div class="pad-all listWrap mar-btm">
                    <h3 class="moreList clearfix"><i></i><span>法律法规</span>
                     <router-link :to="{name:'cardRole'}">MORE>></router-link>
                     </h3>
                     <ul class="roleList mar-top">
                        <li v-for="item in roleList" :key="item.id">  
                            <router-link :to="{name:'cardRoleDetail',params:{id: item.id}}">{{item.role}}</router-link>
                        </li>
                    </ul>
                </div>
        </div>
    </div>
</template>
<script>
import '../libs/css/BusinessPrimer.css'
import myMixin from '../libs/js/mixin.js' //导入mixin修复page-content全屏功能
export default {
    name:'cardRoleDetail',
    mixins:[myMixin],
    data(){
        return{
             roleList:[
                {
                    "id":1,
                    "role":"《最高人民法院关于审理涉及夫妻债务纠纷案件适用法律有关问题的解释》",
                }, 
                {
                    "id":2,
                    "role":"《中国银监会关于地方资产管理公司开展金融企业不良资产批量收...",
                }, 
                {
                    "id":3,
                    "role":"《金融资产管理公司开展非金融机构不良资产业务管理办法》",
                }, 
                {
                    "id":4,
                    "role":"《金融资产管理公司条例》",
                }, 
                {
                    "id":5,
                    "role":"《关于适当调整地方资产管理公司有关政策的函》",
                }, 
                {
                    "id":6,
                    "role":"《中华人民共和国拍卖法》",
                }, 
                {
                    "id":7,
                    "role":"《金融资产管理公司开展非金融机构不良资产业务管理办法》",
                }, 
                {
                    "id":8,
                    "role":"《关于充分发挥检察职能为打好“三大攻坚战”提供司法保障的意见》",
                }, 
                {
                    "id":9,
                    "role":"《关于充分发挥检察职能为打好“三大攻坚战”提供司法保障的意见》",
                }, 
            ]
            
        }
    },
    created(){
        this.$route.params
    }
}
</script>
<style scoped>
.helpTxt{border-bottom: none}
</style>
