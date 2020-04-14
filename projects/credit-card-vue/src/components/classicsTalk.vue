<template>
    <div class="page-content flexwrap">
        <div class="listLft mar-rgt">
            <div class="mainHelp pad-all">
                <div class="clearfix">
                    <span class="pathnav">业务入门&nbsp;>&nbsp;经典话术</span>
                    <router-link :to="{name:'businessPrimer'}" class="returnList">返回上一级</router-link>
                </div>
                <div class="helpwrap pad-all">
                    <h3 class="moreList clearfix">
                        <i></i>
                        <span>经典话术全编</span>
                    </h3>
                    <ul class="talkBox mar-top">
                        <li v-for="item in talkList" :key="item.id">
                            <div class="talkItem">
                                <span>{{item.talkID}}</span>&nbsp;&nbsp;
                                <router-link :to="{name:'classicsTalkDetail',params:{id: item.id}}">{{item.talk}}</router-link>
                            </div>
                            <span class="talkTime">{{item.pulltime}}</span>
                        </li>
                    </ul>
                </div>
            </div>

        </div>
        <div class="listRgt">
            <div class="pad-all listWrap mar-btm">
                <h3 class="moreList clearfix"><i></i><span>经典案例</span></h3>
                <div class="examRgt"><a href="###"><img src="../images/test2.jpg"/></a></div>
                
                <ul class="examList">

                    <li v-for="item in examList" :key="item.id">
                        <span>{{item.id}}</span>
                        <router-link :to="{name:'businessPrimerDetail',params:{id: item.id}}">{{item.examTxt}}</router-link>
                    </li>
                </ul>
            </div>

            <div class="pad-all listWrap mar-btm">
                <h3 class="moreList clearfix"><i></i><span>法律法规</span>
                <router-link :to="{name:'cardRole'}">MORE>></router-link>
                </h3>
                <ul class="roleList">
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
    name:'classicsTalk',
    mixins:[myMixin],
    data(){
        return{
            zanstatus:false,
            count:98,
            examList:[
                {
                    "id":1,
                    "href":"###",
                    "examTxt":"“老赖”逾期十年终还款，经办人坚持不懈得锦旗"
                },
                {
                    "id":2,
                    "href":"###",
                    "examTxt":"公司高管创业失败四处举债，催收小伙爱岗敬业赢得..."
                },
                {
                    "id":3,
                    "href":"###",
                    "examTxt":"经办人坚持不懈得锦旗"
                },
                {
                    "id":4,
                    "href":"###",
                    "examTxt":"催收小伙爱岗敬业赢得锦旗"
                },
                {
                    "id":5,
                    "href":"###",
                    "examTxt":"“老赖”逾期十年终还款，经办人坚持不懈得锦旗"
                },
                {
                    "id":6,
                    "href":"###",
                    "examTxt":"“老赖”逾期十年终还款，经办人坚持不懈得锦旗"
                },
                {
                    "id":7,
                    "href":"###",
                    "examTxt":"“老赖”逾期十年终还款，经办人坚持不懈得锦旗"
                },
                {
                    "id":8,
                    "href":"###",
                    "examTxt":"“老赖”逾期十年终还款，经办人坚持不懈得锦旗"
                },
                {
                    "id":9,
                    "href":"###",
                    "examTxt":"“老赖”逾期十年终还款，经办人坚持不懈得锦旗"
                },
                {
                    "id":10,
                    "href":"###",
                    "examTxt":"“老赖”逾期十年终还款，经办人坚持不懈得锦旗"
                },

            ],
            talkList:[
               {
                    "id":1,
                    "talkID":"第一编",
                    "talk":"联系本人",
                    "pulltime":"2019/04/05"
                }, 
                {
                    "id":2,
                    "talkID":"第二编",
                    "talk":"联系持卡人家人",
                    "pulltime":"2019/04/05"
                },  
                {
                    "id":3,
                    "talkID":"第三编",
                    "talk":"联系村委会、居委会",
                    "pulltime":"2019/04/05"
                }, 
                {
                    "id":4,
                    "talkID":"第四编",
                    "talk":"联系乡政府、镇政府",
                    "pulltime":"2019/04/05"
                }, 
                {
                    "id":5,
                    "talkID":"第五编",
                    "talk":"冒用违法型5000元以下",
                    "pulltime":"2019/04/05"
                }, 
                {
                    "id":6,
                    "talkID":"第六编",
                    "talk":"冒用违法型5000元以上",
                    "pulltime":"2019/04/05"
                }, 
                {
                    "id":7,
                    "talkID":"第七编",
                    "talk":"恶意透支违法型10000元以下",
                    "pulltime":"2019/04/05"
                }, 
                {
                    "id":8,
                    "talkID":"第八编",
                    "talk":"恶意透支违法型10000元以上",
                    "pulltime":"2019/04/05"
                }, 
                {
                    "id":9,
                    "talkID":"第九编",
                    "talk":"劝说有效还款人还款电话催收用语——违法型（配偶）",
                    "pulltime":"2019/04/05"
                }, 
                {
                    "id":10,
                    "talkID":"第十编",
                    "talk":"劝说有效还款人还款电话催收用语——犯罪型（配偶）",
                    "pulltime":"2019/04/05"
                }, 
                {
                    "id":11,
                    "talkID":"第十一编",
                    "talk":"劝说有效还款人还款电话催收用语——违法型（继承人）",
                    "pulltime":"2019/04/05"
                }, 
            ],
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
</style>
