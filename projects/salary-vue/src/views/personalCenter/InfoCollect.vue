<template>
  <div class="info-collect">
    <div class="guide">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home/personalCenter' }">个人中心</el-breadcrumb-item>
        <el-breadcrumb-item>我的</el-breadcrumb-item>
        <el-breadcrumb-item>学历提升</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="info-box mar-top">
      <h3>个人基本信息</h3>
      <div class="info-item">
        <el-row class="textLft">
          <el-form :model="baseInfoForm" ref="baseInfoForm" label-width="150px">
            <el-col :md="6">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="baseInfoForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="6">
              <el-form-item label="身份证号码" prop="id">
                <el-input v-model="baseInfoForm.id"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="6">
              <el-form-item label="性别" prop="sex">
                <el-select placeholder="性别" v-model="baseInfoForm.sex">
                  <el-option value="男">男</el-option>
                  <el-option value="女">女</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="6">
              <el-form-item label="民族" prop="id">
                <el-input v-model="baseInfoForm.id"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="6">
              <el-form-item label="政治面貌" prop="place">
                <el-select v-model="baseInfoForm.place" placeholder="政治面貌">
                  <el-option v-for="item in politicsOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="6">
              <el-form-item label="手机号码" prop="phonenum">
                <el-input v-model="baseInfoForm.phonenum"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="6">
              <el-form-item label="紧急联系号码" prop="phonenum">
                <el-input v-model="baseInfoForm.phonenum"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="6">
              <el-form-item label="微信号" prop="phonenum">
                <el-input v-model="baseInfoForm.phonenum"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="6">
              <el-form-item label="QQ号" prop="phonenum">
                <el-input v-model="baseInfoForm.phonenum"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="6">
              <el-form-item label="上传电子照片" prop="phonenum">
                <el-input v-model="baseInfoForm.phonenum" style="width:100px"></el-input>&nbsp;&nbsp;
                <el-button size="small" type="primary">浏览</el-button>
                <i class="el-icon-question iconReset"></i>
              </el-form-item>
            </el-col>
            <el-col :md="6">
              <el-form-item label="户籍地址" prop="jiguan">
                <el-cascader :options="options" v-model="baseInfoForm.jiguan" @change="handleChange">
                </el-cascader>
              </el-form-item>
            </el-col>
            <el-col :md="6">
              <el-form-item label="户籍所在地是否长望浏宁" prop="sex" label-width="200px">
                <el-select placeholder="是否" v-model="baseInfoForm.sex">
                  <el-option value="是">是</el-option>
                  <el-option value="否">否</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="6">
              <el-form-item label="居住地址（通讯地址）" prop="phonenum">
                <el-input v-model="baseInfoForm.phonenum" type="textarea"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="6">
              <el-form-item label="身份证地址" prop="phonenum">
                <el-input v-model="baseInfoForm.phonenum" type="textarea"></el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </div>
      <h3>学历信息</h3>
      <div class="info-item">
        <el-row class="textLft">
          <el-form :model="degreeInfoForm" ref="baseInfoForm" label-width="150px">
            <el-col :md="6">
              <el-form-item label="文化程度" prop="sex">
                <el-select v-model="baseInfoForm.degree">
                  <el-option value="高中">高中</el-option>
                  <el-option value="中专">中专</el-option>
                  <el-option value="大专">大专</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="6">
              <el-form-item label="毕业学校" prop="school">
                <el-input v-model="baseInfoForm.school"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="6">
              <el-form-item label="毕业专业" prop="school">
                <el-input v-model="baseInfoForm.school"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="6">
              <el-form-item label="毕业日期" prop="monthValue">
                <el-date-picker class="width155" v-model="baseInfoForm.monthValue" type="month" placeholder="选择年月"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :md="6">
              <el-form-item label="证书编号" prop="school">
                <el-input v-model="baseInfoForm.school"></el-input>
                <i class="el-icon-question iconReset iSpan"><span>如何查询证书？</span></i>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </div>
      <h3>工作信息</h3>
      <div class="info-item">
        <el-row class="textLft">
          <el-form :model="workInfoForm" ref="workInfoForm" label-width="150px">
            <el-col :md="6">
              <el-form-item label="入职日期" prop="date">
                <el-date-picker class="width155" v-model="workInfoForm.date" type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :md="6">
              <el-form-item label="工作区域" prop="area">
                <el-select v-model="baseInfoForm.area">
                  <el-option value="日业">日业</el-option>
                  <el-option value="总部">总部</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="6">
              <el-form-item label="平台号码" prop="staffNum">
                <el-input v-model="baseInfoForm.staffNum"></el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </div>
      <h3>父母信息</h3>
      <div class="info-item">
        <el-row class="textLft">
          <el-form :model="parentsInfoForm" ref="baseInfoForm" label-width="150px">
            <el-col :md="6">
              <el-form-item label="父亲姓名" prop="school">
                <el-input v-model="parentsInfoForm.id"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="6">
              <el-form-item label="父亲身份证号" prop="school">
                <el-input v-model="parentsInfoForm.id"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="6">
              <el-form-item label="母亲姓名" prop="school">
                <el-input v-model="parentsInfoForm.id"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="6">
              <el-form-item label="母亲身份证号" prop="school">
                <el-input v-model="parentsInfoForm.id"></el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </div>
      <h3>报考信息</h3>
      <div class="info-item">
        <el-row class="textLft">
          <el-form :model="examinationForm" ref="examinationForm" label-width="150px">
            <el-col :md="6">
              <el-form-item label="报考层次" prop="level">
                <el-select v-model="examinationForm.level">
                  <el-option value="高中">高升专</el-option>
                  <el-option value="中专">专升本</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="6">
              <el-form-item label="毕业证复应件" prop="level">
                <el-input v-model="examinationForm.level"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="6">
              <el-form-item label="学信网信息截图" prop="pic">
                <el-input v-model="examinationForm.pic" style="width:100px"></el-input>&nbsp;&nbsp;
                <el-button size="small" type="primary">浏览</el-button>
                <i class="el-icon-question iconReset"></i>
              </el-form-item>
            </el-col>
            <el-col :md="6">
              <el-form-item label="身份证复应件" prop="pic">
                <el-input v-model="examinationForm.pic" style="width:100px"></el-input>&nbsp;&nbsp;
                <el-button size="small" type="primary">浏览</el-button>
              </el-form-item>
            </el-col>
            <el-col :md="6">
              <el-form-item label="报考类别" prop="level">
                <el-select v-model="examinationForm.level">
                  <el-option value="高中">高升专</el-option>
                  <el-option value="中专">专升本</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="6">
              <el-form-item label="报考学校" prop="level">
                <el-select v-model="examinationForm.level">
                  <el-option value="湘潭大学">湘潭大学</el-option>
                  <el-option value="湖南大学">湖南大学</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="6">
              <el-form-item label="报考专业" prop="level">
                <el-select v-model="examinationForm.level">
                  <el-option value="高中">高升专</el-option>
                  <el-option value="中专">专升本</el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <el-row>
          <el-col :md="18">
            <div style="color:#fff">.</div>
          </el-col>
          <el-col :md="6">
            <el-row style="margin-bottom:20px;float:right">
              <el-button>取消</el-button>
              <el-button type="primary">&nbsp;确 认&nbsp;</el-button>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </div>

  </div>
</template>
<script>
import { GET } from "http/custom.js"

export default {
  name: 'info-collect',
  data() {
    return {
      baseInfoForm: {
        id: '',
        sex: '',
        name: '',
        phonenum: '',
        jiguan: []
      },
      politicsOptions: [
        {
          value: 1,
          label: '群众'
        },
        {
          value: 2,
          label: '团员'
        },
        {
          value: 3,
          label: '党员'
        },
        {
          value: 4,
          label: '预备党员'
        }
      ],
      placeOptions: [
        {
          value: 1,
          label: '日业'
        },
        {
          value: 2,
          label: '鑫远'
        },
        {
          value: 3,
          label: '公园道'
        }
      ],
      options: [{
        value: 'hunan',
        label: '湖南省',
        children: [{
          value: 'changsha',
          label: '长沙市'
        }, {
          value: 'loudishi',
          label: '娄底市'
        }]
      }],
      degreeInfoForm: {
        degree: '',
        school: '',
        monthValue: ''
      },
      workInfoForm: {
        date: '',
        area: '',
        staffnum: ''
      },
      parentsInfoForm: {
        id: ''
      },
      examinationForm: {
        level: '',
        pic: ''
      }
    }
  },
  methods: {
    handleChange(value) {
      console.log(value);
    }

  },
  created() {

  }
}
</script>
<style scoped>
.info-box {
  border: 1px solid #e1e5ef;
  background: #f4f7fa;
}
.info-box h3 {
  font-size: 14px;
  color: #666;
  letter-spacing: 0.88px;
  margin-left: 10px;
}
.info-item {
  background-color: #fff;
  padding: 20px 20px 0 0;
}
.iconReset {
  font-size: 18px;
  color: #2e76ee;
  position: absolute;
  top: 8px;
  right: -24px;
}
.iconReset > span {
  font-size: 14px;
  color: #2e76ee;
}
.iSpan {
  right: -124px;
}
</style>
