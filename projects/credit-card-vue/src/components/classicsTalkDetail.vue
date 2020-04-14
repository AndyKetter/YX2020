<template>
    <div class="page-content flexwrap">
        <div class="listLft mar-rgt">
            <div class="mainHelp pad-all">
                <div class="clearfix">
                    <span class="pathnav">业务入门&nbsp;>&nbsp;经典话术&nbsp;>&nbsp;联系本人</span>
                    <router-link :to="{name:'businessPrimer'}" class="returnList">返回上一级</router-link>
                </div>
                <div class="helpwrap pad-all">
                    <div class="talkWrap" >
                        <ul class="talkItem pad-no">
                            <li>
                                <div class="talk-body pad-hor">
                                    <div class="speech">
                                        <p>你好，请问是王贺先生吗？</p>
                                    </div>
                                </div>
                                <div class="userHead mar-lft">经办人</div>
                            </li>
                            <li>
                                <div class="userHead mar-rgt">持卡人 </div>
                                <div class="talk-body pad-hor speech-lft">
                                    <div class="speech">
                                        <p>是的，有什么事？</p>
                                    </div>
                                </div>
                            </li>
                             <li>
                                <div class="talk-body pad-hor">
                                    <div class="speech">
                                        <p>噢，刘女士，是这样的，我们是中信银行委托的信用卡应收账款提醒通知及催缴服务的第三方湖南永雄资产管理集团有限公司。关于您在中信银行办了一张信用卡的事，卡号为43252419456523，根据银行提供的资料显示，该卡欠款本金在10000元以上，经银行多次催收超过3个月仍未归还.<br/>

我们经过认真的分析研究此案件后，认为他的上述行为可能涉嫌信用卡诈骗罪，如果我们向银行反映此案情，银行委托我司向公安报案的话，一经启动刑事公诉程序，您将受到刑事处罚，不排除被判处拘役、罚金、有期徒刑。我们湖南永雄资产管理集团资产管理有限公司为了避免您受到上述的处罚，在银行可能报案前，提前跟您打个电话，提醒您尽快把银行的钱还上。<br/>

如果银行将您的行为向公安机关报案，一经启动刑事程序，我们湖南永雄资产管理集团有限公司和银行都是控制不了的，到时，您不但要还清全部透支本息，还要可能被判处拘役、罚金、有期徒刑等刑事处罚,我们湖南永雄资产管理集团资产管理有限公司认为完全没有必要走到这一步，我们知道，您可能是一时经济困难，或者别的客观原因。

现在事情既然已经发生了，不管什么原因，什么困难，您赶快想办法把钱还了，刑事责任不是开玩笑的，有些事情一旦发生了，就后悔晚了，刘女士，您看怎样？</p>
                                    </div>
                                </div>
                                <div class="userHead mar-lft">经办人</div>
                            </li>
                        </ul>

                    </div>
                </div>
            </div>

        </div>
        <div class="listRgt">
             <div class="pad-all listWrap mar-btm">
                    <h3 class="moreList clearfix"><i></i><span>经典话术</span>
                     <router-link :to="{name:'classicsTalk'}">MORE>></router-link>
                     </h3>
                    <!-- <div class="talkList">
                        <a v-for="item in talks" :key="item.id" :href="item.href">{{item.message}}</a>
                    </div> -->
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
</template>
<script>
import '../libs/css/BusinessPrimer.css'
import myMixin from '../libs/js/mixin.js' //导入mixin修复page-content全屏功能
export default {
    name:'classicsTalkDetail',
    mixins:[myMixin],
    data(){
        return{
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
                {
                    "id":12,
                    "talkID":"第十二编",
                    "talk":"劝说有效还款人还款电话催收用语——违法型（继承人）",
                    "pulltime":"2019/04/05"
                }, 
                {
                    "id":13,
                    "talkID":"第十三编",
                    "talk":"劝说有效还款人还款电话催收用语——违法型（继承人）",
                    "pulltime":"2019/04/05"
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
.talkItem li{position: relative; display: -webkit-box;display: -ms-flexbox;display: flex;margin-bottom: 15px}
.talk-body{-webkit-box-flex: 1;-ms-flex: 1;flex: 1;}
.marB-btm { margin-bottom: 10px; }
.userHead { width: 45px; position: relative;line-height:20px;max-height:40px;overflow:hidden }
.talkWrap .pad-hor { padding-left: 10px; padding-right: 10px; }
.talkWrap  .speech {  float:right;margin-right: 0px; margin-left: 85px;background: #e5e9f3;border-color: #e5e9f3;position: relative;  display: inline-block; padding: 10px 12px; border-radius: 5px; }
.talkWrap  .speech:before { content: ""; display: block; position: absolute; width: 0; height: 0;right: 0;    border-top: 7px solid transparent; border-bottom: 12px solid transparent; margin: -3px -11px 0 0;border-left: 16px solid #e5e9f3;}
.talkWrap .speech p { line-height:24px;margin-bottom:0px;}

.talkWrap  .speech-lft .speech { margin-right: 85px;margin-left:0px;border:1px solid #c6ccdd ;background: #fff; float: initial}
.talkWrap  .speech-lft .speech:before {  left: -6px; top: 0;right: auto; border-top: 4px solid transparent; border-bottom: 11px solid transparent; border-left: 0;border-right: 14px solid #c6ccdd; margin: 7px 0 0 -8px; }
.talkWrap  .speech-lft .speech:after{content: ""; display: block; position: absolute; width: 0; height: 0; left: -6px; top: 0; border-top: 4px solid transparent; border-bottom: 11px solid transparent; border-right: 14px solid #fff; margin: 7px 2px 4px -6px;}
</style>
