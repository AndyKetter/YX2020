// edit by zc
<template>
  <!-- <div>行政台账</div> -->
  <div class="standing-container">
    <div class="guide">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home/administrativeSystem' }">行政系统</el-breadcrumb-item>
        <el-breadcrumb-item>行政台账</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/administrativeSystem' }">(返回上级)</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="standing-tabs">
      <el-tabs v-loading="loading" v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="月度空调费台账" name="first">
          <art-conditioner :condition="dataObj" v-if="loadMap.has('first')"></art-conditioner>
        </el-tab-pane>
        <el-tab-pane label="月度电费台账" name="second">
          <electric-expense :condition="dataObj" v-if="loadMap.has('second')"></electric-expense>
        </el-tab-pane>
        <el-tab-pane label="月度水费台账" name="third">
          <water-expense :condition="dataObj" v-if="loadMap.has('third')"></water-expense>
        </el-tab-pane>
        <el-tab-pane label="快递费台账" name="four">
          <express-expense :condition="dataObj" v-if="loadMap.has('four')"></express-expense>
        </el-tab-pane>
        <el-tab-pane label="办公用品费台账" name="five">
          <office-expense :condition="dataObj" v-if="loadMap.has('five')"></office-expense>
        </el-tab-pane>
        <el-tab-pane label="广告制作费台账" name="six">
          <advertising-expense :condition="dataObj" v-if="loadMap.has('six')"></advertising-expense>
        </el-tab-pane>
        <el-tab-pane label="饮用水费台账" name="seven">
          <drinking-water-expense :condition="dataObj" v-if="loadMap.has('seven')"></drinking-water-expense>
        </el-tab-pane>
        <el-tab-pane label="维修费台账" name="eight">
          <maintenance-expense :condition="dataObj" v-if="loadMap.has('eight')"></maintenance-expense>
        </el-tab-pane>
        <el-tab-pane label="费用总台账" name="nine">
          <total-expense :condition="dataObj" v-if="loadMap.has('nine')"></total-expense>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import ArtConditioner from "components/administrativeSystem/standingComponents/ArtConditioner" // 月度空调费台账
import ElectricExpense from "components/administrativeSystem/standingComponents/ElectricExpense" // 月度电费台账
import WaterExpense from "components/administrativeSystem/standingComponents/WaterExpense"
import ExpressExpense from "components/administrativeSystem/standingComponents/ExpressExpense"
import OfficeExpense from "components/administrativeSystem/standingComponents/OfficeExpense" // 办公用品费台账
import AdvertisingExpense from "components/administrativeSystem/standingComponents/AdvertisingExpense" // 广告制作费台账
import DrinkingWaterExpense from "components/administrativeSystem/standingComponents/DrinkingWaterExpense" // 饮用水费台账
import MaintenanceExpense from "components/administrativeSystem/standingComponents/MaintenanceExpense" // 维修费台账
import TotalExpense from "components/administrativeSystem/standingComponents/TotalExpense" // 费用总台账
import { GET } from "http/custom.js"
import { mapState } from 'vuex'
import Tools from "../../untils/index.js"
export default {
  components: {
    ArtConditioner,
    ElectricExpense,
    WaterExpense,
    ExpressExpense,
    OfficeExpense,
    AdvertisingExpense,
    DrinkingWaterExpense,
    MaintenanceExpense,
    TotalExpense
  },
  computed: {
    ...mapState(["oaGetTokenInfo"]),
    getUserId() {
      console.log(this.$store.state.oaGetTokenInfo.id, '666');
      if (this.$store.state.oaGetTokenInfo.otherInfo) {
        return this.$store.state.oaGetTokenInfo.id;
      }
      return '';
    },
    getRoot() {
      return name => {
        return Tools.includes(this.$store.state.userActionAll, this.rootCode[name]);
      }
    },
  },
  watch: {// oa中直接跳转到这个页面时，需要 state 里的数据加载完，这里是监听 state 值的变化
    getUserId: {
      handler(newVal, oldVal) { // handler是一个函数，只能叫这个名字，表示对象中属性变化时的处理函数
        console.log('userId:' + newVal, oldVal);
        this.getErea();
      },
      immediate: true //初始值并没有发生改变我们却想在初始的时候就触发watch 就需要这个属性了 immediate （立即执行）
    }
  },
  data() {
    return {
      loading: false,
      loadMap: new Map(), //记录tab页是否打开过了
      activeName: "",// 子组件名称
      //查询条件
      dataObj: {
        //给子组件的数据集合
        t_height: 320, //设置表格的高
        arid: 0, // 登录人所在所属区域id 
        root: {
          areaIsture: false,// '区域名称' 权限
          addWork: false,// '添加所属区域' 权限
          export: false,// '导出' 权限
          payUpdate: false,// '付款类型修改' 权限
          delete: false,// '删除' 权限
          maintence: false,// '数据维护' 权限
        },
        workEreaArr: [], //所属区域
        payArr: [], //付款方式
        year: (new Date()).getFullYear().toString()  //年份
      },
      //oa系统中配置的权限 id
      rootCode: {
        '区域名称': 'f6ae4267f10f4bc4adfda9c22180363b',
        '添加所属区域': 'eb622558ea084156a765c651c3f36367',
        '导出': '3562420bf2cd430aac662558363cafde',
        '付款类型修改': '35515dbbddd94764a5f5b277ee215b71',
        '删除': '99ba72af912840eca2dcb2c3136ebfad',
        '数据维护': 'e82b8661fe084bd1a77c65ebe6e332be'
      },
    }
  },
  created() {
    this.loading = true; //页面数据 加载有点儿慢，加个loading 
    this.getErea();
    //console.log("先");
  },
  methods: {
    handleClick(tab) {
      //tab页切换 只有第一次页面切换时初始化数据
      //判断页面是否打开过
      if (!this.loadMap.has(tab.name)) {
        this.loadMap.set(tab.name, true);
      }
    },
    async getErea() { //获取区域   
      const awaitWrap = (promise) => {
        return promise
          .then(data => [null, data])
          .catch(err => [err, null])
      }

      if (this.getUserId === '') {
        return;
      }

      //获取是否有权限 和 个人所在区域 
      this.dataObj.root = {
        areaIsture: false,
        addWork: this.getRoot('添加所属区域'),
        export: this.getRoot('导出'),
        payUpdate: this.getRoot('付款类型修改'),
        delete: this.getRoot('删除'),
        maintence: this.getRoot('数据维护'),
      };
      const [err2, person] = await awaitWrap(GET(process.env.VUE_APP_DOMAIN_personnel + "/queryUserInfoToRegid", {
        regid: this.getUserId //this.oaGetTokenInfo.otherInfo.roles[0].userId // 获取登录人 userId
      }));

      if (this.getRoot('区域名称')) { //有全区域权限 
        const [err1, all] = await awaitWrap(GET(process.env.VUE_APP_DOMAIN_personnel + "/queryAllAreas")); //全区域
        if (err1 === null) {
          this.dataObj.workEreaArr = all.data;
          this.dataObj.root.areaIsture = true; //所属区域下拉中 呈现清除
        }
      } else { //反之
        this.dataObj.workEreaArr = [{
          workAreaId: parseInt(person.data.areaId) || '',
          workAreaName: person.data.areaName || ''
        }];
        this.dataObj.root.areaIsture = false; //所属区域下拉中 不呈现清除
      }
      // 个人所在区域 id
      this.dataObj.arid = (err2 === null ? (parseInt(person.data.areaId) || '') : '');// 数值转成字符

      //付款方式
      const [errPay, payType] = await awaitWrap(GET(process.env.VUE_APP_DOMAIN_administration + "/queryLedgerPaymentType"));
      if (errPay === null) {
        this.dataObj.payArr = payType.data;
      }

      //数据加载完后再呈现子组件页面
      this.loading = false;
      this.activeName = 'first';
      this.loadMap.set(this.activeName, true) //记录第一个tab页已经加载
    }
  }
}
</script>
<style lang="less" scoped>
.guide {
  margin-bottom: 20px;
}
</style>