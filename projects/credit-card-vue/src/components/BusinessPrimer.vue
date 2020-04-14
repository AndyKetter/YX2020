<template>
    <div>
        <div class="page-content flexwrap">
            <div class="listLft mar-rgt">
                <div class="mainHelp pad-all" :class="sortFlag == 1?'imgA_list':'txtA_list'">
                    <div class="helpNav clearfix">
                        <ul class="nav pull-left">
                            <li @click="articleFlag=1" :class="articleFlag == 1?'active':''"><a href="javascript:void(0)">全部文章</a></li>
                            <li @click="articleFlag=2" :class="articleFlag == 2?'active':''"><a href="javascript:void(0)">催收技巧</a></li>
                            <li @click="articleFlag=3" :class="articleFlag == 3?'active':''"><a href="javascript:void(0)">经典案例</a></li>
                            <li @click="articleFlag=4" :class="articleFlag == 4?'active':''"><a href="javascript:void(0)">品质制度</a></li>
                        </ul>
                        <div class="pull-right orderList">
                            <a href="###" title="图文排列"  @click="sortFlag=1" :class="sortFlag == 1?'active':''"></a>|
                            <a href="###" title="列表排列"  @click="sortFlag=2" :class="sortFlag == 2?'active':''"></a>
                        </div>
                        <el-tooltip class="patch-tooltilp" placement="bottom" >
                        <div slot="content" class="patch-div">
                            <i class="el-icon-question patch-icon"></i>&nbsp;部长以上管理层可看到经典文章可推送至下级进行学习，可查看推送历史记录
                        </div>
                        <router-link :to="{name:'myPush'}" class="putBtn pull-right">我的推送</router-link>
                        </el-tooltip>
                    </div>
                    <ul class="helpArticle" v-show="articleFlag==1">
                        <li v-for="item in ulData" :key="item.id">
                            <div class="item_list clearfix">
                                <router-link :to="{name:'businessPrimerDetail',params:{id: item.id}}" class="articleImg">
                                    <img  src="../images/test1.jpg" />
                                    </router-link>
                                <div class="txt_wrap">
                                    <router-link :to="{name:'businessPrimerDetail',params:{id: item.id}}">{{item.itemTitle}}</router-link>
                                    <div class="articleTxt">{{item.itemTxt}}</div>
                                    <div class="clearfix txt_foot">
                                        <span>{{item.itemType}}</span>
                                        <div class="Txtstatus pull-right"><i class="seeI">{{item.seeI}}</i><i class="niceI">{{item.niceI}}</i></div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <ul class="helpArticle"  v-show="articleFlag==2">
                        <li v-for="item in ulData2" :key="item.id">
                            <div class="item_list clearfix">
                                <router-link :to="{name:'businessPrimerDetail',params:{id: item.id}}" class="articleImg">
                                    <img  src="../images/test1.jpg" />
                                    </router-link>
                                <div class="txt_wrap">
                                    <router-link :to="{name:'businessPrimerDetail',params:{id: item.id}}">{{item.itemTitle}}</router-link>
                                    <div class="articleTxt">{{item.itemTxt}}</div>
                                    <div class="clearfix txt_foot">
                                        <span>{{item.itemType}}</span>
                                        <div class="Txtstatus pull-right"><i class="seeI">{{item.seeI}}</i><i class="niceI">{{item.niceI}}</i></div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <ul class="helpArticle"  v-show="articleFlag==3">
                        <li v-for="item in ulData3" :key="item.id">
                            <div class="item_list clearfix">
                                <router-link :to="{name:'businessPrimerDetail',params:{id: item.id}}" class="articleImg">
                                    <img  src="../images/test1.jpg" />
                                    </router-link>
                                <div class="txt_wrap">
                                    <router-link :to="{name:'businessPrimerDetail',params:{id: item.id}}">{{item.itemTitle}}</router-link>
                                    <div class="articleTxt">{{item.itemTxt}}</div>
                                    <div class="clearfix txt_foot">
                                        <span>{{item.itemType}}</span>
                                        <div class="Txtstatus pull-right"><i class="seeI">{{item.seeI}}</i><i class="niceI">{{item.niceI}}</i></div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <ul class="helpArticle"  v-show="articleFlag==4">
                        <li v-for="item in ulData4" :key="item.id">
                            <div class="item_list clearfix">
                                <router-link :to="{name:'businessPrimerDetail',params:{id: item.id}}" class="articleImg">
                                    <img  src="../images/test1.jpg" />
                                    </router-link>
                                <div class="txt_wrap">
                                    <router-link :to="{name:'businessPrimerDetail',params:{id: item.id}}">{{item.itemTitle}}</router-link>
                                    <div class="articleTxt">{{item.itemTxt}}</div>
                                    <div class="clearfix txt_foot">
                                        <span>{{item.itemType}}</span>
                                        <div class="Txtstatus pull-right"><i class="seeI">{{item.seeI}}</i><i class="niceI">{{item.niceI}}</i></div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
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
    </div>
</template>

<script>
import '../libs/css/BusinessPrimer.css'
import myMixin from '../libs/js/mixin.js' //导入mixin修复page-content全屏功能
export default {
    name:'BusinessPrimer',
    mixins:[myMixin],
    data(){
        return{
            articleFlag:1,
            sortFlag:1,
            ulData:[
                {
                    "id":1,
                    //"src":"/img/test1.jpg",
                    "itemTitle":"交通银行太平洋信用卡中心催收与反欺诈部来集团参观交流",
                    "itemTxt":"一位曾在人人催工作的人员称，很多媒体报道的暴力催收是存在的，但因人而异，因地而异。他称，在自己催收生涯里面，基本上债务人连他的面都没见过就还款了。",
                    "itemType":"催收技巧",
                    "seeI":2000,
                    "niceI":2000
                },
                {
                    "id":2,
                   // "src":"/img/test2.jpg",
                    "itemTitle":"你真的了解商帐催收吗？",
                    "itemTxt":"一位曾在人人催工作的人员称，很多媒体报道的暴力催收是存在的，但因人而异，因地而异。他称，在自己催收生涯里面，基本上债务人连他的面都没见过就还款了。",
                    "itemType":"品质制度",
                    "seeI":100,
                    "niceI":20
                },
                {
                    "id":3,
                   // "src":"/img/test3.jpg",
                    "itemTitle":"催收难，难于上青天！7种债务人你了解多少？",
                    "itemTxt":"催收从来不是一件容易的事情，态度差了告你人生攻击，态度好了他当耳边风，做催收就是左右都不是为难了自己。为了催收业绩更上一层楼，催收老江湖都把债务人分为七型：挑衅型、推托型、受害者型、自信型、顽固型、老练型、保证还款型，再对症下药逐个...。。",
                    "itemType":"经典案例",
                    "seeI":166,
                    "niceI":120
                },
                {
                    "id":4,
                    //"src":"/img/test4.jpg",
                    "itemTitle":"催收有没有同情心？催收都是些什么人？带你了解催收",
                    "itemTxt":"假如你见过那些真的老赖，明明有钱却不还，日子还过得逍遥自在，那种人不值得同情，你会明白催收这个行业会永远存在，存在即合理。",
                    "itemType":"品质制度",
                    "seeI":2000,
                    "niceI":164
                }
            ],
             ulData2:[
                {
                    "id":1,
                    "itemTitle":"催收难，难于上青天！7种债务人你了解多少？",
                    "itemTxt":"催收从来不是一件容易的事情，态度差了告你人生攻击，态度好了他当耳边风，做催收就是左右都不是为难了自己。为了催收业绩更上一层楼，催收老江湖都把债务人分为七型：挑衅型、推托型、受害者型、自信型、顽固型、老练型、保证还款型，再对症下药逐个...。。",
                    "itemType":"催收技巧",
                    "seeI":166,
                    "niceI":120
                },
                {
                    "id":2,
                    "itemTitle":"催收有没有同情心？催收都是些什么人？带你了解催收",
                    "itemTxt":"假如你见过那些真的老赖，明明有钱却不还，日子还过得逍遥自在，那种人不值得同情，你会明白催收这个行业会永远存在，存在即合理。",
                    "itemType":"催收技巧",
                    "seeI":2000,
                    "niceI":164
                },
                {
                    "id":3,
                    "itemTitle":"交通银行太平洋信用卡中心催收与反欺诈部来集团参观交流",
                    "itemTxt":"一位曾在人人催工作的人员称，很多媒体报道的暴力催收是存在的，但因人而异，因地而异。他称，在自己催收生涯里面，基本上债务人连他的面都没见过就还款了。",
                    "itemType":"催收技巧",
                    "seeI":240,
                    "niceI":100
                },
            ],
             ulData3:[
                {
                    "id":1,
                    "itemTitle":"交通银行太平洋信用卡中心催收与反欺诈部来集团参观交流",
                    "itemTxt":"一位曾在人人催工作的人员称，很多媒体报道的暴力催收是存在的，但因人而异，因地而异。他称，在自己催收生涯里面，基本上债务人连他的面都没见过就还款了。",
                    "itemType":"经典案例",
                    "seeI":2000,
                    "niceI":2000
                },
                {
                    "id":2,
                    "itemTitle":"催收有没有同情心？催收都是些什么人？带你了解催收",
                    "itemTxt":"假如你见过那些真的老赖，明明有钱却不还，日子还过得逍遥自在，那种人不值得同情，你会明白催收这个行业会永远存在，存在即合理。",
                    "itemType":"经典案例",
                    "seeI":2000,
                    "niceI":164
                },
                {
                    "id":3,
                    "itemTitle":"你真的了解商帐催收吗？",
                    "itemTxt":"一位曾在人人催工作的人员称，很多媒体报道的暴力催收是存在的，但因人而异，因地而异。他称，在自己催收生涯里面，基本上债务人连他的面都没见过就还款了。",
                    "itemType":"经典案例",
                    "seeI":100,
                    "niceI":20
                },
                {
                    "id":4,
                    "itemTitle":"催收难，难于上青天！7种债务人你了解多少？",
                    "itemTxt":"催收从来不是一件容易的事情，态度差了告你人生攻击，态度好了他当耳边风，做催收就是左右都不是为难了自己。为了催收业绩更上一层楼，催收老江湖都把债务人分为七型：挑衅型、推托型、受害者型、自信型、顽固型、老练型、保证还款型，再对症下药逐个...。。",
                    "itemType":"经典案例",
                    "seeI":166,
                    "niceI":120
                },
            ],
             ulData4:[
                {
                    "id":1,
                   // "src":"/img/test2.jpg",
                    "itemTitle":"你真的了解商帐催收吗？",
                    "itemTxt":"一位曾在人人催工作的人员称，很多媒体报道的暴力催收是存在的，但因人而异，因地而异。他称，在自己催收生涯里面，基本上债务人连他的面都没见过就还款了。",
                    "itemType":"品质制度",
                    "seeI":100,
                    "niceI":20
                },
                {
                    "id":2,
                    //"src":"/img/test1.jpg",
                    "itemTitle":"交通银行太平洋信用卡中心催收与反欺诈部来集团参观交流",
                    "itemTxt":"一位曾在人人催工作的人员称，很多媒体报道的暴力催收是存在的，但因人而异，因地而异。他称，在自己催收生涯里面，基本上债务人连他的面都没见过就还款了。",
                    "itemType":"品质制度",
                    "seeI":2000,
                    "niceI":2000
                },
                {
                    "id":3,
                    //"src":"/img/test4.jpg",
                    "itemTitle":"催收有没有同情心？催收都是些什么人？带你了解催收",
                    "itemTxt":"假如你见过那些真的老赖，明明有钱却不还，日子还过得逍遥自在，那种人不值得同情，你会明白催收这个行业会永远存在，存在即合理。",
                    "itemType":"品质制度",
                    "seeI":2000,
                    "niceI":164
                }
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
                }
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
    mounted () {
         
    }
}

</script>

<style scoped>
/* scoped是表明未局部css样式，没写scoped就是全局css样式 */
.helpNav{margin-bottom: 20px}
.helpNav .nav li{float:left;height: 40px;}
.helpNav a{color: #6d798d;}
.helpNav  li.active{background-color:#eee}
.helpNav li.active a{color: #337ab7}
.orderList{border: 1px solid #cccccc;border-radius: 5px;padding:5px 10px}
.orderList a{display: inline-block;vertical-align:middle;width: 20px;height: 17px;background: url("../images/creditHelp.png") no-repeat;margin: 0px 8px;-webkit-filter: grayscale(88%);filter: grayscale(88%)}
.orderList a:first-child{background-position: 0px 0px;}
.orderList a:nth-child(2){background-position: 0px -23px;}
.orderList a:hover,.orderList a.active{-webkit-filter: grayscale(0);filter: grayscale(0)}

.helpArticle{padding-left: 0px;}
.imgA_list .helpArticle li{list-style: none;padding-bottom: 30px;margin-bottom: 30px;border-bottom: 1px solid #ccc}
.imgA_list .helpArticle li:last-child{border-bottom: none}
.imgA_list .helpArticle .articleImg{margin-right: 20px;display: inline-block;width: 240px;height: 140px;overflow: hidden}
.imgA_list .helpArticle .articleImg img{width: 240px;}
.imgA_list .helpArticle .txt_foot{margin-top: 40px;font-size: 14px;color: #6d798d}
.txtA_list .helpArticle li{list-style: none;margin-bottom: 30px;}
.txtA_list .helpArticle .articleImg{display: none;}
.txtA_list .helpArticle .txt_foot{margin-top:5px;font-size: 14px;color: #6d798d}

.txt_wrap{display: inline-block}
.txt_wrap a{font-size: 18px;color: #333;font-weight: bold;margin-bottom: 10px;display: block;width: 100%;height: 24px;line-height: 24px;overflow: hidden}
.articleTxt{font-size: 14px;line-height: 24px;height: 45px;line-height: 22px;overflow: hidden}
.helpNav .putBtn{height: 30px; line-height: 30px;width: 95px;margin-right: 10px;font-weight: normal;display: inline-block;text-align: center;color: #fff}
</style>
