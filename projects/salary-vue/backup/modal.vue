<template>
  <div>
    <p>基础薪资系统弹框</p>
    <el-button size="mini" type="primary" @click="baseSalarySet=true">基础薪资配置</el-button>
    <el-button size="mini" type="primary" @click="baseSalarySee=true">查看基础薪资</el-button>
    <el-button size="mini" type="primary" @click="addCondition=true">新增初始条件</el-button>
    <el-button size="mini" type="primary" @click="updateCondition=true">修改条件</el-button><br /><br />
    <p>绩效公式管理系统弹框</p>
    <el-button size="mini" type="primary" @click="exportEx=true">公式导入</el-button>
    <el-button size="mini" type="primary" @click="downloadEx=true">公式下载</el-button>
    <el-button size="mini" type="primary" @click="historyEdition=true">历史版本</el-button>
    <el-button size="mini" type="primary" @click="deleWarn=true">温馨提示</el-button>
    <el-button size="mini" type="primary" @click="importWarn=true">导入</el-button>
    <el-button size="mini" type="primary" @click="importWarn2=true">导入成功</el-button>
    <el-button size="mini" type="primary" @click="importWarn3=true">导入失败</el-button><br /><br />
    <p>个人业绩</p>
    <el-button size="mini" type="primary" @click="perfoDetail=true">个人业绩详情</el-button>
    <el-button size="mini" type="primary" @click="complainDialog=true">我要申诉</el-button>
    <el-button size="mini" type="primary" @click="complainDetail=true">申诉详情</el-button>
    <el-button size="mini" type="primary" @click="replayDialog=true">管理员回复</el-button>
    <el-button size="mini" type="primary" @click="addperfoDissent=true">新增业绩归属异议</el-button>
    <p>导入导出公用弹框--导入导出按钮的图标</p>
    <el-button size="small" @click="uploadModal=true" class="cloud-uploadBtn"><i></i>&nbsp;导入</el-button>
    <el-button size="small" @click="downloaddModal=true" class="cloud-downloadBtn"><i></i>&nbsp;导出</el-button>
    <el-button size="small" @click="downloaddModal2=true" class="cloud-downloadBtn"><i></i>&nbsp;导出</el-button>

    <!-- 基础薪资配置弹框 -->
    <el-dialog title="基础薪资配置" :close-on-click-modal="false" :visible.sync="baseSalarySet" width="768px" class="grayBg">
      <div class="whiteBox">
        <p class="pReset activeBgcolor">基本情况</p>
        <el-row class="textLft">
          <el-col :span="3" class="height26">姓&nbsp;&nbsp;&nbsp;&nbsp;名：</el-col>
          <el-col :span="5" class="height26">赵业</el-col>
          <el-col :span="3" class="height26">性&nbsp;&nbsp;&nbsp;&nbsp;别：</el-col>
          <el-col :span="5" class="height26">女</el-col>
          <el-col :span="3" class="height26">平台号：</el-col>
          <el-col :span="5" class="height26">8160413010</el-col>
          <el-col :span="3" class="height26">手机号码：</el-col>
          <el-col :span="5" class="height26">15202221222</el-col>
          <el-col :span="3" class="height26">级&nbsp;&nbsp;&nbsp;&nbsp;别：</el-col>
          <el-col :span="5" class="height26">副总</el-col>
          <el-col :span="3" class="height26">职&nbsp;&nbsp;&nbsp;&nbsp;务：</el-col>
          <el-col :span="5" class="height26">产品经理</el-col>
          <el-col :span="3" class="height26">所属地区：</el-col>
          <el-col :span="5" class="height26">高新区总部</el-col>
          <el-col :span="3" class="height26">员工类型：</el-col>
          <el-col :span="5" class="height26">正式员工</el-col>
          <el-col :span="3" class="height26">学&nbsp;&nbsp;&nbsp;&nbsp;历：</el-col>
          <el-col :span="5" class="height26">本科</el-col>
        </el-row>
      </div>
      <div class="whiteBox">
        <p class="pReset">配置</p>
        <el-form :model="sendLetterform" :rules="sendLetterformRule" ref="sendLetterform" label-width="150px">
          <el-row>
            <el-col :md="12">
              <el-form-item label="基础总额：" prop="Total">
                <el-input v-model="sendLetterform.Total" style="width:200px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="基本工资：" prop="BasePay">
                <el-input v-model="sendLetterform.BasePay" style="width:200px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="保密补助：" prop="subsibySecrecy">
                <el-input v-model="sendLetterform.subsibySecrecy" style="width:200px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="中餐补助：" prop="subsibyLunch">
                <el-input v-model="sendLetterform.subsibyLunch" style="width:200px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="交通补助：" prop="subsibyTraffic">
                <el-input v-model="sendLetterform.subsibyTraffic" style="width:200px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="电话补助：" prop="subsibyPhone">
                <el-input v-model="sendLetterform.subsibyPhone" style="width:200px"></el-input>
              </el-form-item>
            </el-col>
            <!-- <el-col :md="12">
            <el-form-item label="劳模补助：" prop="subsibyWorker">
                <el-input v-model="sendLetterform.subsibyWorker" style="width:200px"></el-input>
              </el-form-item>
            </el-col> -->
            <el-col :md="12">
              <el-form-item label="职务工资：" prop="subsibyPost">
                <el-input v-model="sendLetterform.subsibyPost" style="width:200px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="加班工资：" prop="subsibyOvertime">
                <el-input v-model="sendLetterform.subsibyOvertime" style="width:200px"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-alert title="注意：配置之后将直接进入薪资总表" type="warning" :closable="false"> </el-alert>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="baseSalarySet = false">取消</el-button>
        <el-button type="primary" @click="submitWorkForm('sendLetterform')">保存</el-button>
      </span>
    </el-dialog>

    <!-- 查看基础薪资弹框 -->
    <el-dialog title="查看基础薪资" :close-on-click-modal="false" :visible.sync="baseSalarySee" width="768px" class="grayBg">
      <div class="whiteBox">
        <p class="pReset">基本情况</p>
        <el-row class="textLft">
          <el-col :span="3" class="height26">姓&nbsp;&nbsp;&nbsp;&nbsp;名：</el-col>
          <el-col :span="5" class="height26">赵业</el-col>
          <el-col :span="3" class="height26">性&nbsp;&nbsp;&nbsp;&nbsp;别：</el-col>
          <el-col :span="5" class="height26">女</el-col>
          <el-col :span="3" class="height26">平台号：</el-col>
          <el-col :span="5" class="height26">8160413010</el-col>
          <el-col :span="3" class="height26">手机号码：</el-col>
          <el-col :span="5" class="height26">15202221222</el-col>
          <el-col :span="3" class="height26">级&nbsp;&nbsp;&nbsp;&nbsp;别：</el-col>
          <el-col :span="5" class="height26">副总</el-col>
          <el-col :span="3" class="height26">职&nbsp;&nbsp;&nbsp;&nbsp;务：</el-col>
          <el-col :span="5" class="height26">产品经理</el-col>
          <el-col :span="3" class="height26">所属地区：</el-col>
          <el-col :span="5" class="height26">高新区总部</el-col>
          <el-col :span="3" class="height26">员工类型：</el-col>
          <el-col :span="5" class="height26">正式员工</el-col>
          <el-col :span="3" class="height26">学&nbsp;&nbsp;&nbsp;&nbsp;历：</el-col>
          <el-col :span="5" class="height26">本科</el-col>
        </el-row>
      </div>
      <div class="whiteBox">
        <p class="pReset">配置</p>
        <el-row class="textLft">
          <el-col :span="3" class="height26">基础总额：</el-col>
          <el-col :span="9" class="height26">2300</el-col>
          <el-col :span="3" class="height26">基本工资：</el-col>
          <el-col :span="9" class="height26">2300</el-col>
          <el-col :span="3" class="height26">保密补助：</el-col>
          <el-col :span="9" class="height26">1100</el-col>
          <el-col :span="3" class="height26">中餐补助：</el-col>
          <el-col :span="9" class="height26">1000</el-col>
          <el-col :span="3" class="height26">交通补助：</el-col>
          <el-col :span="9" class="height26">300</el-col>
          <el-col :span="3" class="height26">电话补助：</el-col>
          <el-col :span="9" class="height26">300</el-col>
          <!-- <el-col :span="3" class="height26">劳模补助：</el-col>
           <el-col :span="9" class="height26">400</el-col> -->
          <el-col :span="3" class="height26">职务工资：</el-col>
          <el-col :span="9" class="height26">500</el-col>
          <el-col :span="3" class="height26">加班工资：</el-col>
          <el-col :span="9" class="height26">100</el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="baseSalarySee = false">确定</el-button>
      </span>
    </el-dialog>

    <!-- 新增初始条件弹框 -->
    <el-dialog title="新增初始条件" :close-on-click-modal="false" :visible.sync="addCondition" width="768px" class="grayBg">
      <el-form :model="addConditionform" :rules="addConditionformRule" ref="addConditionform" label-width="150px">
        <div class="whiteBox">
          <p class="pReset">基本情况</p>
          <el-row>
            <el-col :md="12">
              <el-form-item label="薪资类型：" prop="typeSelect">
                <el-select v-model="addConditionform.typeSelect" placeholder="业务类型" style="width:200px">
                  <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="职务：" prop="PostSelect">
                <el-select v-model="addConditionform.PostSelect" placeholder="业务类型" style="width:200px">
                  <el-option v-for="item in PostOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="所属区域：" prop="regionSelect">
                <el-select v-model="addConditionform.regionSelect" placeholder="业务类型" style="width:200px">
                  <el-option v-for="item in regionOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="学历：" prop="educationSelect">
                <el-select v-model="addConditionform.educationSelect" placeholder="业务类型" style="width:200px">
                  <el-option v-for="item in educationOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="级别：" prop="levelSelect">
                <el-select v-model="addConditionform.levelSelect" placeholder="业务类型" style="width:200px">
                  <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="是否试用：" prop="trial">
                <template>
                  <el-radio v-model="addConditionform.trial" label="1">是</el-radio>
                  <el-radio v-model="addConditionform.trial" label="2">否</el-radio>
                </template>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="whiteBox">
          <p class="pReset">配置</p>
          <el-row>
            <el-col :md="12">
              <el-form-item label="基础总额：" prop="Total">
                <el-input v-model="addConditionform.Total" style="width:200px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="基本工资：" prop="BasePay">
                <el-input v-model="addConditionform.BasePay" style="width:200px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="保密补助：" prop="subsibySecrecy">
                <el-input v-model="addConditionform.subsibySecrecy" style="width:200px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="中餐补助：" prop="subsibyLunch">
                <el-input v-model="addConditionform.subsibyLunch" style="width:200px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="交通补助：" prop="subsibyTraffic">
                <el-input v-model="addConditionform.subsibyTraffic" style="width:200px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="电话补助：" prop="subsibyPhone">
                <el-input v-model="addConditionform.subsibyPhone" style="width:200px"></el-input>
              </el-form-item>
            </el-col>
            <!-- <el-col :md="12">
            <el-form-item label="劳模补助：" prop="subsibyWorker">
                <el-input v-model="addConditionform.subsibyWorker" style="width:200px"></el-input>
              </el-form-item>
            </el-col> -->
            <el-col :md="12">
              <el-form-item label="职务工资：" prop="subsibyPost">
                <el-input v-model="addConditionform.subsibyPost" style="width:200px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="加班工资：" prop="subsibyOvertime">
                <el-input v-model="addConditionform.subsibyOvertime" style="width:200px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="24">
              <el-alert title="注意：当薪资类型选择职能时，基础总额将不可填写。" type="warning" :closable="false"> </el-alert>
            </el-col>
          </el-row>
        </div>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addCondition = false">取消</el-button>
        <el-button type="primary" @click="submitWorkForm('addConditionform')">保存</el-button>
      </span>
    </el-dialog>

    <!-- 修改条件弹框 -->
    <el-dialog title="修改条件" :close-on-click-modal="false" :visible.sync="updateCondition" width="768px" class="grayBg">
      <div class="whiteBox">
        <p class="pReset">基本情况</p>
        <el-row class="textLft">
          <el-col :span="3" class="height26">薪资类型：</el-col>
          <el-col :span="9" class="height26">1</el-col>
          <el-col :span="3" class="height26">职&nbsp;&nbsp;&nbsp;&nbsp;务：</el-col>
          <el-col :span="9" class="height26">产品经理</el-col>
          <el-col :span="3" class="height26">所属地区：</el-col>
          <el-col :span="9" class="height26">高新区总部</el-col>
          <el-col :span="3" class="height26">学&nbsp;&nbsp;&nbsp;&nbsp;历：</el-col>
          <el-col :span="9" class="height26">本科</el-col>
          <el-col :span="3" class="height26">级&nbsp;&nbsp;&nbsp;&nbsp;别：</el-col>
          <el-col :span="9" class="height26">副总</el-col>
          <el-col :span="3" class="height26">是否试用：</el-col>
          <el-col :span="9" class="height26">是</el-col>
        </el-row>
      </div>
      <div class="whiteBox">
        <p class="pReset">配置</p>
        <el-form :model="updateConditionform" :rules="updateConditionformRule" ref="updateConditionform" label-width="150px">
          <el-row>
            <el-col :md="12">
              <el-form-item label="基础总额：" prop="Total">
                <el-input v-model="updateConditionform.Total" :disabled="true" style="width:200px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="基本工资：" prop="BasePay">
                <el-input v-model="updateConditionform.BasePay" style="width:200px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="保密补助：" prop="subsibySecrecy">
                <el-input v-model="updateConditionform.subsibySecrecy" style="width:200px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="中餐补助：" prop="subsibyLunch">
                <el-input v-model="updateConditionform.subsibyLunch" style="width:200px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="交通补助：" prop="subsibyTraffic">
                <el-input v-model="updateConditionform.subsibyTraffic" style="width:200px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="电话补助：" prop="subsibyPhone">
                <el-input v-model="updateConditionform.subsibyPhone" style="width:200px"></el-input>
              </el-form-item>
            </el-col>
            <!-- <el-col :md="12">
            <el-form-item label="劳模补助：" prop="subsibyWorker">
                <el-input v-model="updateConditionform.subsibyWorker" style="width:200px"></el-input>
              </el-form-item>
            </el-col> -->
            <el-col :md="12">
              <el-form-item label="职务工资：" prop="subsibyPost">
                <el-input v-model="updateConditionform.subsibyPost" style="width:200px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="加班工资：" prop="subsibyOvertime">
                <el-input v-model="updateConditionform.subsibyOvertime" :disabled="true" style="width:200px"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateCondition = false">取消</el-button>
        <el-button type="primary" @click="updateCondition = false">保存</el-button>
      </span>
    </el-dialog>

    <!-- 公式导入弹框 -->
    <el-dialog title="公式导入" :close-on-click-modal="false" :visible.sync="exportEx" width="600px">
      <div>
        <el-form :model="exportExform" ref="exportExform" label-width="100px">
          <el-row>
            <el-col :md="24">
              <el-form-item label="导入月份" prop="month1">
                <el-date-picker type="month" placeholder="选择月" v-model="exportExform.month1" style="width:400px"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :md="24">
              <el-form-item label="公式导入" prop="BasePay">
                <el-input v-model="exportExform.BasePay" style="width:335px" placeholder="请选择您要导入的绩效公式Excel表"></el-input>&nbsp;&nbsp;
                <el-button size="small" type="primary">浏览</el-button>
              </el-form-item>
            </el-col>
            <el-col :md="16">
              <div style="padding-left:30px;line-height:30px;color:red">注：导入成功后，会立刻覆盖当前版本</div>
            </el-col>
            <el-col :md="8">
              <div class="fileBox"><span class="filename excel">
                  <el-button type="text" class="underlineTxt">公用模板下载</el-button>
                </span></div>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="exportEx = false">取消</el-button>
        <el-button type="primary" @click="exportEx = false">确定</el-button>
      </span>
    </el-dialog>

    <!-- 公式下载弹框 -->
    <el-dialog title="公式下载" :close-on-click-modal="false" :visible.sync="downloadEx" width="600px">
      <div>
        <el-form :model="downloadExform" ref="downloadExform" label-width="100px">
          <el-row>
            <el-col :md="24">
              <el-form-item label="下载月份" prop="month1">
                <el-date-picker type="month" placeholder="选择月" v-model="downloadExform.month1" style="width:400px"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :md="24">
              <el-form-item label="下载方式" prop="BasePay">
                <el-select v-model="downloadExform.typeSelect" placeholder="下载方式" style="width:400px">
                  <el-option v-for="item in downloadExOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <div style="padding-left:30px;line-height:30px;">版本号：20190528001<span style="color:red">(当前)</span></div>
            </el-col>
            <el-col :md="4">
              <el-button type="text" class="underlineTxt">历史版本</el-button>
            </el-col>
            <el-col :md="8">
              <div class="fileBox"><span class="filename excel">
                  <el-button type="text" class="underlineTxt">公用模板下载</el-button>
                </span></div>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="downloadEx = false">取消</el-button>
        <el-button type="primary" @click="downloadEx = false">确定</el-button>
      </span>
    </el-dialog>

    <!-- 历史版本弹框 -->
    <el-dialog title="历史版本" :close-on-click-modal="false" :visible.sync="historyEdition" width="600px">
      <div>
        <div class="mar-btm">请选择查看的月份：<el-date-picker type="month" placeholder="选择月" v-model="month2"></el-date-picker>
        </div>
        <el-table :data="historyData" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
          <el-table-column property="name" label="导入人" width="100"></el-table-column>
          <el-table-column property="hisdate" label="导入时间" width="150"></el-table-column>
          <el-table-column property="edition" label="版本号"></el-table-column>
          <el-table-column fixed="right" property="operation" label="操作">
            <template>
              <el-button type="text" size="small" @click="sendLetterVisible=true">下载</el-button>
              <el-button type="text" size="small" @click="sendLetterVisible=true">查看</el-button>
              <el-button type="text" size="small" @click="sendLetterVisible=true">执行</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <!-- 温馨提示弹框 -->
    <el-dialog title="温馨提示" :close-on-click-modal="false" :visible.sync="deleWarn" width="450px">
      <el-row>
        <el-col :md="21" :offset="3" class="warnIcoBg">
          <h2>您确定要删除本记录？</h2>
          <span style="color:red">注：删除后不可恢复！</span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleWarn = false">取消</el-button>
        <el-button type="primary" @click="deleWarn = false">确定</el-button>
      </span>
    </el-dialog>

    <!-- 导入弹框 -->
    <el-dialog title="导入中..." :close-on-click-modal="false" :visible.sync="importWarn" width="600px">
      <div class="pad-all mar-ver">
        <el-progress :text-inside="true" :stroke-width="20" :percentage="70"></el-progress>
        <p>正在导入，本次需导入总记录828条，<span style="color:#66b1ff">当前第411条</span></p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="importWarn = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 导入成功 -->
    <el-dialog title="导入成功" :close-on-click-modal="false" :visible.sync="importWarn2" width="600px">
      <div class="pad-all mar-ver">
        <el-progress :text-inside="true" :stroke-width="20" :percentage="100"></el-progress>
        <p>正在导入，本次需导入总记录828条，<span style="color:#66b1ff">成功800条</span>，<span style="color:red">失败0条</span>，总耗时15秒</p>
        <p>2019年5月绩效公式自动<span style="color:#67c23a">执行成功</span>，当前版本号：20190524003</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="importWarn2 = false">取消</el-button>
        <el-button type="primary" @click="importWarn2 = false">查看历史版本</el-button>
      </span>
    </el-dialog>
    <!-- 导入失败 -->
    <el-dialog title="导入失败" :close-on-click-modal="false" :visible.sync="importWarn3" width="600px">
      <div class="pad-all mar-ver">
        <el-progress :text-inside="true" :stroke-width="20" :percentage="100"></el-progress>
        <p>正在导入，本次需导入总记录828条，<span style="color:#66b1ff">成功800条</span>，<span style="color:red">失败20条</span>，总耗时15秒</p>
        <p>
          <el-button type="text" class="underlineTxt">点击下载导入失败明细20190524002.xsl</el-button><span style="color:#a1a1a1">（导入失败明细已发送到您内网邮箱）</span>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="importWarn3 = false">取消</el-button>
        <el-button type="primary" @click="importWarn3 = false">暂不覆盖，重新导入</el-button>
      </span>
    </el-dialog>

    <!-- 个人业绩详情 -->
    <el-dialog title="个人业绩详情" :close-on-click-modal="false" :visible.sync="perfoDetail" width="830px">
      <p class="pReset">案件基本情况</p>
      <el-row class="textLft">
        <el-col :span="3" class="height26">业务类型：</el-col>
        <el-col :span="5" class="height26">中信抢案</el-col>
        <el-col :span="3" class="height26">持卡人姓名：</el-col>
        <el-col :span="5" class="height26">张利</el-col>
        <el-col :span="3" class="height26">身份证号码：</el-col>
        <el-col :span="5" class="height26">43018763823333367</el-col>
        <el-col :span="3" class="height26">卡号：</el-col>
        <el-col :span="5" class="height26">7638928393839</el-col>
        <el-col :span="3" class="height26">还款金额：</el-col>
        <el-col :span="5" class="height26">10,000.00</el-col>
        <el-col :span="3" class="height26">还款日期：</el-col>
        <el-col :span="5" class="height26">2019-05-10</el-col>
        <el-col :span="3" class="height26">折算比例：</el-col>
        <el-col :span="5" class="height26"><span style="color:red">0.7</span></el-col>
        <el-col :span="3" class="height26">折算原因：</el-col>
        <el-col :span="5" class="height26">平安普惠业务风险低</el-col>
        <el-col :span="3" class="height26">搁置比例：</el-col>
        <el-col :span="5" class="height26">0.1</el-col>
        <el-col :span="3" class="height26">搁置原因：</el-col>
        <el-col :span="5" class="height26">违约</el-col>
        <el-col :span="3" class="height26">绩效：</el-col>
        <el-col :span="5" class="height26">70</el-col>
        <el-col :span="3" class="height26">不予核算原因：</el-col>
        <el-col :span="5" class="height26">无</el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="perfoDetail = false">我要申诉</el-button>
        <el-button type="primary" @click="perfoDetail = false">返回</el-button>
      </span>
    </el-dialog>

    <!-- 我要申诉 -->
    <el-dialog title="我要申诉" :close-on-click-modal="false" :visible.sync="complainDialog" width="860px" class="grayBg">
      <el-dialog width="30%" title="申诉成功" :visible.sync="innerVisible" append-to-body>
        <span>预计1~2个工作日内处理完成，请耐心等待!</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="complainDialog=false,innerVisible=false">确定</el-button>
        </span>
      </el-dialog>
      <div class="whiteBox">
        <p class="pReset">案件基本情况</p>
        <el-row class="textLft">
          <el-col :span="3" class="height26">业务类型：</el-col>
          <el-col :span="5" class="height26">中信抢案</el-col>
          <el-col :span="3" class="height26">持卡人姓名：</el-col>
          <el-col :span="5" class="height26">张利</el-col>
          <el-col :span="3" class="height26">身份证号码：</el-col>
          <el-col :span="5" class="height26">43018763823333367</el-col>
          <el-col :span="3" class="height26">卡号：</el-col>
          <el-col :span="5" class="height26">7638928393839</el-col>
          <el-col :span="3" class="height26">还款金额：</el-col>
          <el-col :span="5" class="height26">10,000.00</el-col>
          <el-col :span="3" class="height26">还款日期：</el-col>
          <el-col :span="5" class="height26">2019-05-10</el-col>
          <el-col :span="3" class="height26">折算比例：</el-col>
          <el-col :span="5" class="height26"><span style="color:red">0.7</span></el-col>
          <el-col :span="3" class="height26">折算原因：</el-col>
          <el-col :span="5" class="height26">平安普惠业务风险低</el-col>
          <el-col :span="3" class="height26">搁置比例：</el-col>
          <el-col :span="5" class="height26">0.1</el-col>
          <el-col :span="3" class="height26">搁置原因：</el-col>
          <el-col :span="5" class="height26">违约</el-col>
          <el-col :span="3" class="height26">绩效：</el-col>
          <el-col :span="5" class="height26">70</el-col>
          <el-col :span="3" class="height26">不予核算原因：</el-col>
          <el-col :span="5" class="height26">无</el-col>
          <el-col :span="3" class="height26">最终核款：</el-col>
          <el-col :span="5" class="height26">7000</el-col>
        </el-row>
      </div>
      <div class="whiteBox">
        <p class="pReset">申诉内容</p>
        <el-row class="textLft">
          <el-col :span="4" class="height26">请选择申诉原因：</el-col>
          <el-col :span="20" class="height26">
            <el-checkbox-group v-model="checkList">
              <el-checkbox label="还款金额有误"></el-checkbox>
              <el-checkbox label="折算比例有误"></el-checkbox>
              <el-checkbox label="搁置比例有误"></el-checkbox>
              <el-checkbox label="绩效有误"></el-checkbox>
            </el-checkbox-group>
          </el-col>
          <el-col :span="4" class="height26 mgt10">原因描述：</el-col>
          <el-col :span="20" class="mgt10">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 2}" placeholder="请输入内容" v-model="textarea" style="width:100%;"></el-input>
          </el-col>

          <el-col :span="23" :offset="1" class="mgt10">
            <el-upload class="uploadLine" action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :file-list="fileList">
              <el-button size="small" type="primary" plain>上传截图</el-button>
            </el-upload>
          </el-col>
          <el-col :span="23" :offset="1" class="mgt10">
            <el-upload class="uploadLine" action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :file-list="fileList">
              <el-button size="small" type="primary" plain>上传录音</el-button>
            </el-upload>
          </el-col>
          <el-col :span="23" :offset="1" class="mgt10">
            <el-upload class="uploadLine" action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :file-list="fileList">
              <el-button size="small" type="primary" plain>上传视频</el-button>
            </el-upload>
          </el-col>

        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="complainDialog = false">取消</el-button>
        <el-button type="primary" @click="innerVisible = true">确定</el-button>
      </span>
    </el-dialog>

    <!-- 申诉详情 -->
    <el-dialog title="申诉详情" :close-on-click-modal="false" :visible.sync="complainDetail" width="860px" class="grayBg">
      <div class="whiteBox">
        <p class="pReset">案件基本情况</p>
        <el-row class="textLft">
          <el-col :span="3" class="height26">业务类型：</el-col>
          <el-col :span="5" class="height26">中信抢案</el-col>
          <el-col :span="3" class="height26">持卡人姓名：</el-col>
          <el-col :span="5" class="height26">张利</el-col>
          <el-col :span="3" class="height26">身份证号码：</el-col>
          <el-col :span="5" class="height26">43018763823333367</el-col>
          <el-col :span="3" class="height26">卡号：</el-col>
          <el-col :span="5" class="height26">7638928393839</el-col>
          <el-col :span="3" class="height26">还款金额：</el-col>
          <el-col :span="5" class="height26">10,000.00</el-col>
          <el-col :span="3" class="height26">还款日期：</el-col>
          <el-col :span="5" class="height26">2019-05-10</el-col>
          <el-col :span="3" class="height26">折算比例：</el-col>
          <el-col :span="5" class="height26"><span style="color:red">0.7</span></el-col>
          <el-col :span="3" class="height26">折算原因：</el-col>
          <el-col :span="5" class="height26">平安普惠业务风险低</el-col>
          <el-col :span="3" class="height26">搁置比例：</el-col>
          <el-col :span="5" class="height26">0.1</el-col>
          <el-col :span="3" class="height26">搁置原因：</el-col>
          <el-col :span="5" class="height26">违约</el-col>
          <el-col :span="3" class="height26">绩效：</el-col>
          <el-col :span="5" class="height26">70</el-col>
          <el-col :span="3" class="height26">不予核算原因：</el-col>
          <el-col :span="5" class="height26">无</el-col>
          <el-col :span="3" class="height26">最终核款：</el-col>
          <el-col :span="5" class="height26">7000</el-col>
        </el-row>
      </div>
      <div class="whiteBox">
        <p class="pReset">申诉内容</p>
        <el-row class="textLft">
          <el-col :span="4" class="height26">请选择申诉原因：</el-col>
          <el-col :span="20" class="height26">还款金额有误 </el-col>
          <el-col :span="4" class="height26 mgt10">原因描述：</el-col>
          <el-col :span="20" class="height26 mgt10">我的本次还款金额应该有1100，为什么只有1000了？请帮忙检查下是否弄错了？我的本次还款金额应该有1100，为什么只有1000了？请帮忙检查下是否弄错了？我的本次还款金额应该有1100，为什么只有1000了？请帮忙检查下是否弄错了？ </el-col>
          <el-col :span="4" class="height26 mgt10">附件：</el-col>
          <el-col :span="20" class="height26 mgt10">
            <el-button>截图</el-button>
            <el-button>录音</el-button>
            <el-button>视频</el-button>
          </el-col>
          <el-col :span="4" class="height26 mgt10">申诉人：</el-col>
          <el-col :span="20" class="height26 mgt10">张三三</el-col>
          <el-col :span="4" class="height26 mgt10">申诉时间：</el-col>
          <el-col :span="20" class="height26 mgt10">2019-05-24 12:00:01</el-col>
        </el-row>
      </div>
      <div class="whiteBox">
        <p class="pReset">处理结果</p>
        <!-- 无处理结果为以下样式 -->
        <p style="color:red;text-align:center">暂未处理，预计1~2个工作日内处理完成，请耐心等待</p>

        <!-- 如有处理结果为以下样式 -->
        <!-- <p style="color:red">经核实，银行反馈您的总还款金额为1100元，但是出现了投诉，银行只以1000元核算业绩！</p>
        <span>绩效管理部：张三   2019-05-04 12:00:01</span> -->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="complainDetail = false">取消</el-button>
        <el-button type="primary" @click="complainDetail = false">确定</el-button>
      </span>
    </el-dialog>

    <!-- 管理员回复 -->
    <el-dialog title="管理员回复" :close-on-click-modal="false" :visible.sync="replayDialog" width="860px" class="grayBg">
      <el-dialog width="40%" title="修改信息" :visible.sync="modifyPerfo" append-to-body>
        <el-row class="textLft">
          <el-col :span="4" class="height26">搁置比例：</el-col>
          <el-col :span="20" class="height26">0.7</el-col>
          <el-col :span="4" class="height26 mgt10">修改为：</el-col>
          <el-col :span="20" class="height26 mgt10">
            <el-input type="text"></el-input>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="modifyPerfo=false">取消</el-button>
          <el-button type="primary" @click="modifyPerfo=false">确定</el-button>
        </span>
      </el-dialog>
      <div class="whiteBox">
        <p class="pReset">案件基本情况</p>
        <el-row class="textLft">
          <el-col :span="3" class="height26">业务类型：</el-col>
          <el-col :span="5" class="height26">中信抢案</el-col>
          <el-col :span="3" class="height26">持卡人姓名：</el-col>
          <el-col :span="5" class="height26">张利</el-col>
          <el-col :span="3" class="height26">身份证号码：</el-col>
          <el-col :span="5" class="height26">43018763823333367</el-col>
          <el-col :span="3" class="height26">卡号：</el-col>
          <el-col :span="5" class="height26">7638928393839</el-col>
          <el-col :span="3" class="height26">还款金额：</el-col>
          <el-col :span="5" class="height26">10,000.00</el-col>
          <el-col :span="3" class="height26">还款日期：</el-col>
          <el-col :span="5" class="height26">2019-05-10</el-col>
          <el-col :span="3" class="height26">折算比例：</el-col>
          <el-col :span="5" class="height26"><span style="color:red">0.7</span>
            <el-button size="mini" type="text" icon="el-icon-edit" class="modifyTBn" @click="modifyPerfo=true"></el-button>
          </el-col>
          <el-col :span="3" class="height26">折算原因：</el-col>
          <el-col :span="5" class="height26">平安普惠业务风险低</el-col>
          <el-col :span="3" class="height26">搁置比例：</el-col>
          <el-col :span="5" class="height26">0.1<el-button size="mini" type="text" icon="el-icon-edit" class="modifyTBn" @click="modifyPerfo=true"></el-button>
          </el-col>
          <el-col :span="3" class="height26">搁置原因：</el-col>
          <el-col :span="5" class="height26">违约</el-col>
          <el-col :span="3" class="height26">绩效：</el-col>
          <el-col :span="5" class="height26">70<el-button size="mini" type="text" icon="el-icon-edit" class="modifyTBn" @click="modifyPerfo=true"></el-button>
          </el-col>
          <el-col :span="3" class="height26">不予核算原因：</el-col>
          <el-col :span="5" class="height26">无</el-col>
          <el-col :span="3" class="height26">最终核款：</el-col>
          <el-col :span="5" class="height26">7000</el-col>
        </el-row>
      </div>
      <div class="whiteBox">
        <p class="pReset">申诉内容</p>
        <el-row class="textLft">
          <el-col :span="4" class="height26">请选择申诉原因：</el-col>
          <el-col :span="20" class="height26">还款金额有误 </el-col>
          <el-col :span="4" class="height26 mgt10">原因描述：</el-col>
          <el-col :span="20" class="height26 mgt10">我的本次还款金额应该有1100，为什么只有1000了？请帮忙检查下是否弄错了？我的本次还款金额应该有1100，为什么只有1000了？请帮忙检查下是否弄错了？我的本次还款金额应该有1100，为什么只有1000了？请帮忙检查下是否弄错了？ </el-col>
          <el-col :span="4" class="height26 mgt10">附件：</el-col>
          <el-col :span="20" class="height26 mgt10">
            <el-button>截图</el-button>
            <el-button>录音</el-button>
            <el-button>视频</el-button>
          </el-col>
          <el-col :span="4" class="height26 mgt10">申诉人：</el-col>
          <el-col :span="20" class="height26 mgt10">张三三</el-col>
          <el-col :span="4" class="height26 mgt10">申诉时间：</el-col>
          <el-col :span="20" class="height26 mgt10">2019-05-24 12:00:01</el-col>
        </el-row>
      </div>
      <div class="whiteBox">
        <p class="pReset">处理结果</p>
        <el-alert title="提交前请先和申诉人联系，确定无误后再完结此申诉！ 完结后不可更改!" type="warning" :closable="false"> </el-alert>
        <el-row class="textLft mar-top">
          <el-col :span="4" class="height26">原因描述：</el-col>
          <el-col :span="20" class="height26">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 2}" placeholder="请备注处理和申诉人沟通后的结果！" v-model="textarea" style="width:100%;"></el-input>
          </el-col>
        </el-row>

      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="replayDialog = false">取消</el-button>
        <el-button type="primary" @click="replayDialog = false">确定</el-button>
      </span>
    </el-dialog>

    <!-- 新增业绩归属异议弹框 -->
    <el-dialog title="新增业绩归属异议" :close-on-click-modal="false" :visible.sync="addperfoDissent" width="860px" class="grayBg">
      <el-dialog width="50%" title="搜索结果" :visible.sync="searchTab" append-to-body>
        <div>
          <el-table :data="searchTabData" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
            <el-table-column property="name" label="持卡人" width="100"></el-table-column>
            <el-table-column property="cardId" label="卡号" width="200"></el-table-column>
            <el-table-column property="payDate" label="还款时间"></el-table-column>
            <el-table-column property="payBalance" label="还款金额"></el-table-column>
            <el-table-column fixed="right" property="operation" label="操作">
              <template>
                <el-button type="text" size="small" @click="searchTab=false,searchFlag=1">选定</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>
      <div class="whiteBox">
        <p class="pReset">案件基本基本情况</p>
        <el-form :model="addperfoDissentform" ref="addperfoDissentform" label-width="140px">
          <el-row>
            <el-col :md="12">
              <el-form-item label="业务类型：" prop="Total">
                <el-select v-model="addperfoDissentform.typeSelect" placeholder="业务类型" style="width:230px">
                  <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="持卡人身份证号：" prop="idNumber">
                <el-input v-model="addperfoDissentform.idNumber" style="width:160px"></el-input>&nbsp;&nbsp;
                <el-button @click="searchTab = true">搜索</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="searchFlag==1">
            <el-col :md="12">
              <el-form-item label="持卡人：" prop="cardHolder">
                <el-input v-model="addperfoDissentform.cardHolder" style="width:230px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="持卡人银行卡号：" prop="bankSlip">
                <el-input v-model="addperfoDissentform.bankSlip" style="width:230px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="还款时间：" prop="payDate">
                <el-input v-model="addperfoDissentform.payDate" style="width:230px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="还款金额：" prop="payDatepayBalance">
                <el-input v-model="addperfoDissentform.payBalance" style="width:230px"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="whiteBox" v-if="searchFlag==1">
        <p class="pReset">原因描述</p>
        <el-row class="textLft mar-top">
          <el-col :span="4" class="height26">原因描述：</el-col>
          <el-col :span="20" class="height26">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 2}" placeholder="请填写描述" v-model="textarea" style="width:100%;"></el-input>
          </el-col>
          <el-col :span="23" :offset="1" class="mgt10">
            <el-upload class="uploadLine" action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :file-list="fileList">
              <el-button size="small" type="primary" plain>上传截图</el-button>
            </el-upload>
          </el-col>
          <el-col :span="23" :offset="1" class="mgt10">
            <el-upload class="uploadLine" action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :file-list="fileList">
              <el-button size="small" type="primary" plain>上传录音</el-button>
            </el-upload>
          </el-col>
          <el-col :span="23" :offset="1" class="mgt10">
            <el-upload class="uploadLine" action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :file-list="fileList">
              <el-button size="small" type="primary" plain>上传视频</el-button>
            </el-upload>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addperfoDissent = false">取消</el-button>
        <el-button type="primary" @click="addperfoDissent = false">提交</el-button>
      </span>
    </el-dialog>

    <!-- 扣款项导入弹框 -->
    <el-dialog title="扣款项导入" :close-on-click-modal="false" :visible.sync="uploadModal" width="450px">
      <p>
        <el-button size="mediumn" class="cloud-uploadBtn"><i></i>&nbsp;导入数据</el-button>&nbsp;&nbsp;
        <el-button size="mediumn" icon="el-icon-download">下载模板</el-button>
      </p>
      <!-- 导入之后的状态提示框
      <el-alert
        title="出错了！"
        type="error"
        description="系统无法识别excel中的空白，公式和非法字符。请先清理。"
        show-icon>
      </el-alert> -->

      <!-- <el-alert
        title="已成功"
        type="success"
        description="您已成功导入相关数据，请及时核对！"
        show-icon>
      </el-alert> -->
    </el-dialog>

    <!-- 导出弹框 -->
    <el-dialog title="导出提示" :close-on-click-modal="false" :visible.sync="downloaddModal" class="downloadModal" width="550px">
      <!-- 导入之后的状态提示框 -->
      <el-alert title="请注意！" type="warning" :closable="false" description="尊敬的管理员，感谢您使用后台数据导出系统，该功能用于导出调整款项数据，可根据查询条件进行导出，因您导出的文件属于公司保密信息，请务必妥善保管与使用以保证您导出文件信息安全，一旦私自外泄，将严格按照公司信息安全规章制度进行处理！" show-icon>
      </el-alert>
      <span slot="footer" class="dialog-footer">
        <el-button @click="downloaddModal = false">放弃导出</el-button>
        <el-button type="primary" @click="downloaddModal = false">确定导出</el-button>
      </span>
    </el-dialog>
    <!-- 导出弹框 -->
    <el-dialog title="借支导出" :close-on-click-modal="false" :visible.sync="downloaddModal2" width="450px">
      <p>
        <el-button size="mediumn">借支汇总一览表</el-button>&nbsp;&nbsp;
        <el-button size="mediumn">借支明细一览表</el-button>
      </p>
      <el-alert title="导出模板字段提示" type="warning" :closable="false" description="可根据查询条件进行导出，本系统提供2种导出方式，请选择您需要导出的模板" show-icon>
      </el-alert>
    </el-dialog>
  </div>
</template>
<script>
import 'libs/css/lxm.css' //引入永雄定制css
export default {
  name: 'modal',
  data() {
    return {
      perfoDetail: false,//个人业绩详情
      complainDialog: false,//我要申诉
      innerVisible: false,
      checkList: [""],
      textarea: '',
      fileList: [
        { name: 'food.jpeg', url: '' },
        { name: 'food2.jpeg', url: '0' }
      ],
      complainDetail: false,//申诉详情
      replayDialog: false,//管理员回复
      modifyPerfo: false,
      addperfoDissent: false,
      addperfoDissentform: {//新增业绩归属异议
        typeSelect: '',
        idNumber: '',
        cardHolder: '',
        bankSlip: '',
        payDate: '',
        payBalance: ''
      },
      searchTab: false,//搜索结果
      searchFlag: 0,
      searchTabData: [
        {
          name: '凌心敏',
          cardId: '6217 9829 2024 0009 101',
          payDate: '2019-05-28',
          payBalance: '2000'
        },
        {
          name: '凌心敏',
          cardId: '6217 9829 2024 0009 101',
          payDate: '2019-05-28',
          payBalance: '2000'
        },
      ],


      exportEx: false,//公式导入
      exportExform: {
        month1: '',
        BasePay: '',
      },
      downloadEx: false,//公式下载
      downloadExform: {
        month1: '',
        typeSelect: ''
      },
      downloadExOptions: [
        {
          value: 1,
          label: '发送至本人内网邮箱'
        },
        {
          value: 2,
          label: '发送至本人外网聊天'
        }
      ],
      month2: '',
      historyData: [
        {
          name: '凌心敏',
          hisdate: '2019-05-28 09:10:00',
          edition: '20190528002(当前)'
        },
        {
          name: '凌心敏',
          hisdate: '2019-05-28 09:10:00',
          edition: '20190528002'
        },
        {
          name: '凌心敏',
          hisdate: '2019-05-28 09:10:00',
          edition: '20190528002'
        },
      ],
      historyEdition: false,//历史版本

      deleWarn: false,//温馨提示
      importWarn: false,//导入
      importWarn2: false,
      importWarn3: false,


      //基础薪资设置 弹框内的数据
      baseSalarySet: false,
      sendLetterform: {//基础薪资设置
        Total: "",
        BasePay: "",
        subsibySecrecy: "",
        subsibyLunch: "",
        subsibyTraffic: "",
        subsibyPhone: "",
        subsibyWorker: "",
        subsibyPost: "",
        subsibyOvertime: ""
      },
      sendLetterformRule: {
        Total: [{ required: true, message: "请填写基础总额", trigger: "blur" }],
        BasePay: [{ required: true, message: "请填写基本工资", trigger: "blur" }],
        subsibySecrecy: [{ required: true, message: "请填写保密补助", trigger: "blur" }],
        subsibyLunch: [{ required: true, message: "请填写中餐补助", trigger: "blur" }],
        subsibyTraffic: [{ required: true, message: "请填写交通补助", trigger: "blur" }],
        subsibyPhone: [{ required: true, message: "请填写电话补助", trigger: "blur" }],
        subsibyPost: [{ required: true, message: "请填写职务工资", trigger: "blur" }],
        subsibyOvertime: [{ required: true, message: "请填写加班工资", trigger: "blur" }]
      },


      //查看基础薪资 弹框内的数据
      baseSalarySee: false,






      //新增初始条件 弹框内的数据
      addCondition: false,
      addBaseform: {//新增初始条件基本信息
        typeSelect: '',
        PostSelect: '',
        regionSelect: '',
        educationSelect: '',
        levelSelect: '',
        trial: '',
      },
      typeOptions: [
        {
          value: 1,
          label: '业务类型'
        },
        {
          value: 2,
          label: '平安网贷'
        },
        {
          value: 3,
          label: '新美团'
        }
      ],
      PostOptions: [
        {
          value: 1,
          label: '组长'
        },
        {
          value: 2,
          label: '部长'
        },
        {
          value: 3,
          label: '副总'
        }
      ],
      regionOptions: [
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
      educationOptions: [
        {
          value: 1,
          label: '大专'
        },
        {
          value: 2,
          label: '本科'
        }
      ],
      levelOptions: [
        {
          value: 1,
          label: '组长'
        },
        {
          value: 2,
          label: '部长'
        },
        {
          value: 3,
          label: '副总'
        }
      ],
      addConditionform: {//新增初始条件设置
        Total: "",
        BasePay: "",
        subsibySecrecy: "",
        subsibyLunch: "",
        subsibyTraffic: "",
        subsibyPhone: "",
        subsibyWorker: "",
        subsibyPost: "",
        subsibyOvertime: ""
      },
      addConditionformRule: {
        typeSelect: [{ required: true, message: "请选择类型", trigger: "change" }],
        PostSelect: [{ required: true, message: "请选择职务", trigger: "change" }],
        regionSelect: [{ required: true, message: "请选择区域", trigger: "change" }],
        educationSelect: [{ required: true, message: "请选择学历", trigger: "change" }],
        levelSelect: [{ required: true, message: "请选择级别", trigger: "change" }],
        trial: [{ required: true, message: "请选择是否试用", trigger: "change" }],
        Total: [{ required: true, message: "请填写基础总额", trigger: "blur" }],
        BasePay: [{ required: true, message: "请填写基本工资", trigger: "blur" }],
        subsibySecrecy: [{ required: true, message: "请填写保密补助", trigger: "blur" }],
        subsibyLunch: [{ required: true, message: "请填写中餐补助", trigger: "blur" }],
        subsibyTraffic: [{ required: true, message: "请填写交通补助", trigger: "blur" }],
        subsibyPhone: [{ required: true, message: "请填写电话补助", trigger: "blur" }],
        subsibyWorker: [{ required: true, message: "请填写劳模补助", trigger: "blur" }],
        subsibyPost: [{ required: true, message: "请填写职务工资", trigger: "blur" }],
        subsibyOvertime: [{ required: true, message: "请填写加班工资", trigger: "blur" }]
      },




      //修改条件 弹框内的数据
      updateCondition: false,
      updateConditionform: {//修改条件
        Total: "2000",
        BasePay: "",
        subsibySecrecy: "",
        subsibyLunch: "",
        subsibyTraffic: "",
        subsibyPhone: "",
        subsibyWorker: "",
        subsibyPost: "",
        subsibyOvertime: "400"
      },
      updateConditionformRule: {
        BasePay: [{ required: true, message: "请填写基本工资", trigger: "blur" }],
        subsibySecrecy: [{ required: true, message: "请填写保密补助", trigger: "blur" }],
        subsibyLunch: [{ required: true, message: "请填写中餐补助", trigger: "blur" }],
        subsibyTraffic: [{ required: true, message: "请填写交通补助", trigger: "blur" }],
        subsibyPhone: [{ required: true, message: "请填写电话补助", trigger: "blur" }],
        subsibyPost: [{ required: true, message: "请填写职务工资", trigger: "blur" }]
      },
      downloaddModal: false,//导出公用框
      downloaddModal2: false,
      uploadModal: false//导入公用框




    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    }
  }
}
</script>
<style scoped>
</style>
