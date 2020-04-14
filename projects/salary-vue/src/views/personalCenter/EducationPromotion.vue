<template>
  <div class="educationPromotion">
    <div class="guide">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home/personalCenter' }">个人中心</el-breadcrumb-item>
        <el-breadcrumb-item>我的</el-breadcrumb-item>
        <el-breadcrumb-item>学历提升</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/personalCenter' }">(返回上级)</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="bgWhite mgt15">
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="总览" name="first">
          <!-- <h3 class="first-h3">2019年学历提升意向调查基本情况</h3>
            <table border="1" cellspacing="0" cellpadding="0">
              <tr>
                <th>姓名：张三</th>
                <th>是否参加2019学历提升项目：是</th>
                <th>报读人数：2人</th>
                <th>是否包含本人：是</th>
              </tr>
              <tr>
                <th>是否包含本人：是</th>
                <th>报读层次：高升专1人，专升本1人</th>
                <th>填报日期：2019-05-22</th>
                <th>审核状态：审核通过</th>
              </tr>
            </table> -->
          <div class="content-title">
            <h3 class="first-h3" style="float:left">信息采集</h3>
            <el-button @click="addhsSubsidy=true" style="float:right;margin-top:6px" icon="el-icon-plus">新增学员信息</el-button>
          </div>
          <div class="content-box">
            <el-table :data="infoData" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
              <el-table-column prop="id" label="序号"></el-table-column>
              <el-table-column label="填报人姓名">
                <template slot-scope="scope">
                  <el-popover trigger="hover" placement="top" width="450">
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{name:scope.row.value2}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.value2}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="填报人工号">
                <template slot-scope="scope">
                  <span>{{scope.row.value1}}</span><i class="el-icon-phone tbIconPhone"></i>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="学员姓名"></el-table-column>
              <el-table-column prop="value4" label="学员身份证号"></el-table-column>
              <el-table-column prop="value3" label="学员电话"></el-table-column>
              <el-table-column prop="value5" label="报读层次"></el-table-column>
              <el-table-column prop="value6" label="协议状态"></el-table-column>
              <el-table-column prop="value7" label="报名费扣缴情况"></el-table-column>
              <el-table-column prop="value8" label="学员信息采集情况"></el-table-column>
              <el-table-column prop="value9" label="信息是否审核通过"></el-table-column>
              <el-table-column prop="operation" label="操作" fixed="right" width="160">
                <template>
                  <el-button type="text" size="small" @click="baseSalarySet=true">查看协议</el-button>
                  <el-button type="text" size="small" @click="infoCollertFlag=true">信息填报</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div style="margin-top:10px">
              <el-alert title="您本次报名4人,信息合格1人，请尽快完善资料！截至日期：2019-07-01" type="success" :closable="false"></el-alert>
            </div>
          </div>
        </el-tab-pane>
        <!-- <el-tab-pane label="意向调查" name="second">
            <h3 class="second-h3">1、您是否有意向参加公司2019级学历提升项目（包括本人和家人）？</h3>
            <el-radio v-model="joinFlag" label="1">是</el-radio>
            <el-radio v-model="joinFlag" label="2">否</el-radio>
            <h3 class="second-h3">2、报读人数？</h3>
            <el-input-number v-model="joinNum" controls-position="right" @change="handleChange" :min="1" :max="999"></el-input-number>
            <h3 class="second-h3">3、是否本人报读？</h3>
            <el-radio v-model="myselfFlag" label="1">是</el-radio>
            <el-radio v-model="myselfFlag" label="2">否</el-radio>
            <h3 class="second-h3">4、您将选择报名哪个层次？</h3>
            <el-radio v-model="levelFlag" label="1">高升专</el-radio>
            <el-radio v-model="levelFlag" label="2">专升本</el-radio>
            <div class="sub-box">
              <el-button type="primary">&nbsp;&nbsp;提&nbsp;&nbsp;交&nbsp;&nbsp;</el-button>
              <i class="el-icon-question" title="查看学历提升流程图" @click="helpDialog=true" style="color:#409EFF;font-size:18px;cursor:pointer"></i>
            </div>
          </el-tab-pane>
          <el-tab-pane label="调查结果" name="third">
            <div class="pull-left">
              <el-form :inline="true" :model="checkSearch" class="mar-no pull-left">
                <el-form-item label="是否有意向">
                  <el-select v-model="checkSearch.intention" placeholder="请选择"  class="width155">
                    <el-option label="是" value="1"></el-option>
                    <el-option label="否" value="2"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="组织架构">
                  <el-input v-model="checkSearch.name" placeholder="可按姓名查询" class="width155"></el-input>
                </el-form-item>

                <el-form-item label="报读类型">
                  <el-select v-model="checkSearch.type" placeholder="请选择"  class="width155">
                    <el-option label="类型1" value="1"></el-option>
                    <el-option label="类型2" value="2"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="是否包含本人">
                  <el-select v-model="checkSearch.includeSelf" placeholder="请选择"  class="width155">
                    <el-option label="是" value="1"></el-option>
                    <el-option label="否" value="2"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="el-icon-search">搜索</el-button>
                </el-form-item>
              </el-form>
            </div> 
            <div class="pull-right">
              <el-button size="small" slot="reference">导出调查结果</el-button>
              <el-button size="small" slot="reference">导出信息采集</el-button>
            </div>
            <div class="content-box">
              <el-table :data="checkData" border style="width:100%"  :header-cell-style="{backgroundColor:'#e5e9f3'}">
                <el-table-column prop="id" label="序号" ></el-table-column>
                <el-table-column prop="val" label="是否有意向参加" ></el-table-column>
                <el-table-column label="调研人" >
                  <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top" width="450">
                       
                        <PersonalInfoDetail :personalInfoObj="{name:scope.row.value1}"></PersonalInfoDetail>
                        
                        <div slot="reference" class="name-wrapper">
                        <el-button size="mini" >{{scope.row.value1}}</el-button>
                        </div>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column prop="value3" label="联系电话" ></el-table-column>
                <el-table-column prop="value4" label="是否包含本人" ></el-table-column>
                <el-table-column prop="value5" label="报读人数" ></el-table-column>
                <el-table-column prop="value6" label="专升本"></el-table-column>
                <el-table-column prop="value7" label="高升专"></el-table-column>
                <el-table-column prop="value8" label="提交时间" width="160"></el-table-column>
                <el-table-column prop="operation" label="操作" fixed="right" width="160">
                    <template>
                        <el-button type="text" size="small" @click="baseSalarySet=true">审核</el-button>
                        <el-button type="text" size="small" @click="infoCollertFlag=true">信息采集</el-button>
                    </template>
                </el-table-column>
              </el-table>
              <div style="margin-top:10px">
                <el-alert title="总计参与调查人数：1908人，1000人有意向，908人无意向；总计报读人数2980人，专升本2000人，高升专980人；本人报读801人" type="success" :closable="false"></el-alert>
              </div>
              <div id="pagination">
                  <el-pagination 
                  @size-change="handleSizeChange"
                  @current-change="handlecurrentChange"
                  :current-page="currentPage"
                  :page-sizes="[5,10,20]"
                  :page-size="5"
                  layout="total,sizes,prev,pager,next,jumper"
                  :total="100"
                  >
                  </el-pagination>
              </div>
            </div>
          </el-tab-pane> -->
        <el-tab-pane label="代扣报名费" name="four">
          <div class="pull-left">
            <el-form :inline="true" :model="helpPaySearch" class="mar-no pull-left">
              <!-- <el-form-item label="是否有意向">
                  <el-select v-model="helpPaySearch.intention" placeholder="请选择"  class="width155">
                    <el-option label="是" value="1"></el-option>
                    <el-option label="否" value="2"></el-option>
                  </el-select>
                </el-form-item> -->
              <el-form-item label="姓名">
                <el-input v-model="helpPaySearch.name" placeholder="" class="width155"></el-input>
              </el-form-item>
              <el-form-item label="是否在职">
                <el-select v-model="helpPaySearch.workFlag" placeholder="请选择" class="width155">
                  <el-option label="是" value="1"></el-option>
                  <el-option label="否" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="扣款状态">
                <el-select v-model="helpPaySearch.type" placeholder="请选择" class="width155">
                  <el-option label="未扣款" value="1"></el-option>
                  <el-option label="已扣款" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="pull-right">
            <el-dropdown @command="handleCommand" trigger="click">
              <el-button type="primary">
                更多操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">导入代扣报名费名单</el-dropdown-item>
                <el-dropdown-item command="b" divided>导入协议文件</el-dropdown-item>
                <el-dropdown-item command="c" divided>导出信息采集表格</el-dropdown-item>
                <el-dropdown-item command="d" divided>导出信息采集附件</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>&nbsp;
            <el-button size="small" type="danger" v-if="SubmitStu==false" @click="JS_submit">提交数据</el-button>
            <el-button size="small" v-else>撤回数据</el-button>
          </div>
          <div class="content-box">
            <el-table :data="helpPayData" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
              <el-table-column prop="id" label="序号"></el-table-column>
              <el-table-column label="学员姓名" prop="val2"></el-table-column>
              <el-table-column prop="value1" label="学员身份证号"></el-table-column>
              <el-table-column prop="value11" label="是否在职员工"></el-table-column>
              <el-table-column label="扣款人姓名">
                <template slot-scope="scope">
                  <el-popover trigger="hover" placement="top" width="450">
                    <!-- S -->
                    <PersonalInfoDetail :personalInfoObj="{name:scope.row.val}"></PersonalInfoDetail>
                    <!-- E -->
                    <div slot="reference" class="name-wrapper">
                      <el-button size="mini">{{scope.row.val}}</el-button>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="扣款人工号">
                <template slot-scope="scope">
                  <span>{{scope.row.value2}}</span><i class="el-icon-phone tbIconPhone"></i>
                </template>
              </el-table-column>
              <el-table-column prop="value3" label="是否签协议"></el-table-column>
              <el-table-column prop="value4" label="报名类型"></el-table-column>
              <el-table-column prop="value5" label="报名费用"></el-table-column>
              <el-table-column prop="value9" label="扣款年月"></el-table-column>
              <el-table-column prop="value10" label="扣款状态"></el-table-column>
              <el-table-column prop="value6" label="信息状态"></el-table-column>
              <el-table-column prop="value7" label="协议状态"></el-table-column>
              <el-table-column prop="value8" label="提交状态"></el-table-column>
              <el-table-column prop="operation" label="操作" fixed="right" width="160">
                <template>
                  <el-button type="text" size="small" @click="infoCollertDetail=true">详情</el-button>
                  <el-button type="text" size="small" @click="modifyPrice=true">修改</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div id="pagination">
              <el-pagination @size-change="handleSizeChange" @current-change="handlecurrentChange" :current-page="currentPage" :page-sizes="[5,10,20]" :page-size="5" layout="total,sizes,prev,pager,next,jumper" :total="100">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-dialog title="学历提升流程" :close-on-click-modal="false" :visible.sync="helpDialog" width="768px">
      <div>
        <img src="~libs/images/educationPromotion.png" style="width:700px">
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="helpDialog = false">确定</el-button>
      </span>
    </el-dialog>
    <!-- 新增学员信息 -->
    <el-dialog title="新增学员信息" :close-on-click-modal="false" :visible.sync="addhsSubsidy" width="768px">
      <el-row class="textLft">
        <el-form :model="addhsSubsidyform" :rules="addhsSubsidyformRule" ref="addhsSubsidyform" label-width="150px">

          <el-col :md="12">
            <el-form-item label="学员姓名：" prop="name">
              <el-input v-model="addhsSubsidyform.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="学员电话：" prop="phonenum">
              <el-input v-model="addhsSubsidyform.phonenum"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="学员身份证号：" prop="idCard">
              <el-input v-model="addhsSubsidyform.idCard"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="报读层次：" prop="type">
              <el-select v-model="addhsSubsidyform.type" placeholder="请选择" style="width:215px">
                <el-option label="高升专" value="1"></el-option>
                <el-option label="专升本" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="填报人姓名：" prop="tname">
              <el-input v-model="addhsSubsidyform.tname" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="填报人工号：" prop="id">
              <el-input v-model="addhsSubsidyform.id" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addhsSubsidy = false">取消</el-button>
        <el-button type="primary" @click="submitWorkForm('addhsSubsidyform')">确定</el-button>
      </span>
    </el-dialog>

    <!-- 修改报名费 -->
    <el-dialog title="修改报名费" :close-on-click-modal="false" :visible.sync="modifyPrice" width="768px">
      <el-row class="textLft">
        <el-form :model="modifyPriceform" ref="modifyPriceform" label-width="150px">
          <el-col :md="12">
            <el-form-item label="高升专费用：" prop="junior">
              <el-input v-model="modifyPriceform.junior"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="专升本费用：" prop="undergraduate">
              <el-input v-model="modifyPriceform.undergraduate"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="合计扣款：" prop="total">
              <el-input v-model="modifyPriceform.total"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="扣款月份：" prop="month">
              <el-date-picker v-model="modifyPriceform.month" type="month" placeholder="选择月份"> </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="扣款状态：" prop="type">
              <el-select v-model="modifyPriceform.type" placeholder="请选择" style="width:215px">
                <el-option label="未扣款" value="1"></el-option>
                <el-option label="已扣款" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyPrice = false">取消</el-button>
        <el-button type="primary" @click="modifyPrice = false">修改</el-button>
      </span>
    </el-dialog>

    <!-- 信息采集全屏框 -->
    <el-dialog title="信息采集" :visible.sync="infoCollertFlag" fullscreen>
      <div class="info-collect">
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
                    <i class="el-icon-question iconReset left180"></i>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="户籍地址" prop="jiguan">
                    <el-cascader :options="options" v-model="baseInfoForm.jiguan" @change="handleChange">
                    </el-cascader>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="户籍所在地是否长望浏宁" prop="sex" class="longTxt">
                    <el-select placeholder="是否" v-model="baseInfoForm.sex">
                      <el-option value="是">是</el-option>
                      <el-option value="否">否</el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :md="12">
                  <el-form-item label="居住地址（通讯地址）" prop="phonenum" class="longTxt">
                    <el-input v-model="baseInfoForm.phonenum" type="textarea"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :md="12">
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
                  <el-form-item label="毕业日期" prop="monthValue" class="width100">
                    <el-date-picker v-model="baseInfoForm.monthValue" type="month" placeholder="选择年月"></el-date-picker>
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
          <h3>工作信息<span style="color:red">（员工家属无需填写）</span></h3>
          <div class="info-item">
            <el-row class="textLft">
              <el-form :model="workInfoForm" ref="workInfoForm" label-width="150px">
                <el-col :md="6">
                  <el-form-item label="入职日期" prop="date">
                    <el-date-picker v-model="workInfoForm.date" type="date" placeholder="选择日期"></el-date-picker>
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
                    <i class="el-icon-question iconReset left180"></i>
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
                  <el-button @click="infoCollertFlag = false">取消</el-button>
                  <el-button type="primary" @click="infoCollertFlag = false">&nbsp;确 认&nbsp;</el-button>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </div>

      </div>
    </el-dialog>

    <!-- 信息采集全屏框 -->

    <!-- 信息采集详情 全屏框 -->
    <el-dialog title="信息采集" :visible.sync="infoCollertDetail" fullscreen>
      <div class="info-collect">
        <div class="info-box mar-top">
          <h3>个人基本信息</h3>
          <div class="info-item">
            <el-row class="textLft">
              <el-form :model="baseInfoForm" ref="baseInfoForm" label-width="150px">
                <el-col :md="6">
                  <el-form-item label="姓名：">
                    <span>张三</span>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="身份证号码：">
                    <span>430121199002021581</span>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="性别：">
                    <span>男</span>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="民族：">
                    <span>汉族</span>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="政治面貌：">
                    <span>团员</span>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="手机号码：">
                    <span>13566598898</span>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="紧急联系号码：">
                    <span>13566598898</span>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="微信号：">
                    <span>13566598898</span>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="QQ号：">
                    <span>317599899</span>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="上传电子照片：">
                    <span>查看&nbsp;<i class="el-icon-view upIcon"></i></span>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="户籍地址：">
                    <span>湖南长沙</span>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="户籍所在地是否长望浏宁：" class="longTxt">
                    <span>是</span>
                  </el-form-item>
                </el-col>
                <el-col :md="12">
                  <el-form-item label="居住地址（通讯地址：）" class="longTxt">
                    <span>长沙市岳麓区麓谷小镇3栋101室</span>
                  </el-form-item>
                </el-col>
                <el-col :md="12">
                  <el-form-item label="身份证地址：">
                    <span>湖南省长沙市岳麓区麓谷街道麓谷小镇3栋101室</span>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
          </div>
          <h3>学历信息</h3>
          <div class="info-item">
            <el-row class="textLft">
              <el-form label-width="150px">
                <el-col :md="6">
                  <el-form-item label="文化程度：">
                    <span>大专</span>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="毕业学校：">
                    <span>湖南涉外经济学院</span>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="毕业专业：">
                    <span>计算机科学技术</span>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="毕业日期：">
                    <span>2016-06-30</span>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="证书编号：">
                    <span>10210100124</span>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
          </div>
          <h3>工作信息</h3>
          <div class="info-item">
            <el-row class="textLft">
              <el-form label-width="150px">
                <el-col :md="6">
                  <el-form-item label="入职日期：">
                    <span>2010-06-30</span>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="工作区域：">
                    <span>长沙市</span>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="平台号码：">
                    <span>8100630001</span>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
          </div>
          <h3>父母信息</h3>
          <div class="info-item">
            <el-row class="textLft">
              <el-form label-width="150px">
                <el-col :md="6">
                  <el-form-item label="父亲姓名：">
                    <span>张三丰</span>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="父亲身份证号：">
                    <span>430121196802051541</span>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="母亲姓名：">
                    <span>刘思燕</span>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="母亲身份证号：">
                    <span>430121196805021549</span>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
          </div>
          <h3>报考信息</h3>
          <div class="info-item">
            <el-row class="textLft">
              <el-form label-width="150px">
                <el-col :md="6">
                  <el-form-item label="报考层次：">
                    <span>大专</span>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="毕业证复应件：">
                    <span>查看&nbsp;<i class="el-icon-view upIcon"></i></span>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="学信网信息截图：">
                    <span>查看&nbsp;<i class="el-icon-view upIcon"></i></span>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="身份证复应件：">
                    <span>查看&nbsp;<i class="el-icon-view upIcon"></i></span>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="报考类别：">
                    <span>成人高考</span>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="报考学校：">
                    <span>湘潭大学</span>
                  </el-form-item>
                </el-col>
                <el-col :md="6">
                  <el-form-item label="报考专业：">
                    <span>法学</span>
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
                  <el-button @click="infoCollertDetail = false">审核不通过</el-button>
                  <el-button type="primary" @click="infoCollertDetail = false">&nbsp;审核通过&nbsp;</el-button>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </div>

      </div>
    </el-dialog>

    <!-- 导入代扣报名费名单 弹框 -->
    <el-dialog title="代扣报名费名单导入" :close-on-click-modal="false" :visible.sync="uploadModal1" width="450px">
      <p>
        <el-button size="mediumn" class="cloud-uploadBtn"><i></i>&nbsp;导入数据</el-button>&nbsp;&nbsp;
        <el-button size="mediumn" icon="el-icon-download">下载模板</el-button>
      </p>
      <!-- 导入之后的状态提示框 -->
      <el-alert title="温馨提示" type="warning" description="导入的Excel模板和列表页表头必须完全一致。" show-icon>
      </el-alert>
    </el-dialog>

    <!-- 导入导入协议文件 弹框 -->
    <el-dialog title="协议文件导入" :close-on-click-modal="false" :visible.sync="uploadModal2" width="450px">
      <p>
        <el-button size="mediumn" class="cloud-uploadBtn"><i></i>&nbsp;导入数据</el-button>&nbsp;&nbsp;
        <el-button size="mediumn" icon="el-icon-download">下载模板</el-button>
      </p>
      <!-- 导入之后的状态提示框 -->
      <el-alert title="温馨提示" type="warning" description="导入的Excel模板和列表页表头必须完全一致。" show-icon>
      </el-alert>
    </el-dialog>

    <!-- 导出信息采集表格 弹框 -->
    <el-dialog title="信息采集表格导出" :close-on-click-modal="false" :visible.sync="downloaddModal1" width="450px">
      <p>
        <el-button size="mediumn" class="cloud-downloadBtn"><i></i>&nbsp;导出至邮箱</el-button>&nbsp;&nbsp;
        <el-button size="mediumn" class="cloud-downloadBtn"><i></i>&nbsp;导出至本地</el-button>
      </p>
      <!-- 导入之后的状态提示框 -->
      <el-alert title="温馨提示" type="warning" description="文件过大，可能要数秒到数分钟。" show-icon>
      </el-alert>
    </el-dialog>

    <!-- 导出信息采集附件 弹框 -->
    <el-dialog title="信息采集附件导出" :close-on-click-modal="false" :visible.sync="downloaddModal2" width="450px">
      <p>
        <el-button size="mediumn" class="cloud-downloadBtn"><i></i>&nbsp;导出至邮箱</el-button>&nbsp;&nbsp;
        <el-button size="mediumn" class="cloud-downloadBtn"><i></i>&nbsp;导出至本地</el-button>
      </p>
      <!-- 导入之后的状态提示框 -->
      <el-alert title="温馨提示" type="warning" description="文件过大，可能要数秒到数分钟。" show-icon>
      </el-alert>
    </el-dialog>

    <!-- 提交数据 -->
    <el-dialog title="正在提交数据" :close-on-click-modal="false" :visible.sync="makeSliverFlag" width="600px">
      <div class="pad-all mar-ver">
        <el-progress :text-inside="true" :stroke-width="20" :percentage="70"></el-progress>
        <p>正提交2019-05学历提升数据，总记录2828条数据，<span style="color:#66b1ff">当前第4111条</span>，成功1600条，失败11条..</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="makeSliverFlag = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { GET } from "http/custom.js"

export default {
  name: 'educationPromotion',
  data() {
    return {
      uploadModal1: false,
      uploadModal2: false,
      downloaddModal1: false,
      downloaddModal2: false,
      makeSliverFlag: false,
      SubmitStu: false,//提交数据状态
      infoCollertDetail: false,//信息采集详情框
      currentPage: 1,
      activeName: 'first',
      infoData: [],
      joinFlag: '1',
      myselfFlag: '1',
      levelFlag: '1',
      joinNum: '1',
      infoCollertFlag: false,//信息采集弹框
      checkSearch: {
        intention: '',
        name: '',
        type: '',
        includeSelf: ''
      },
      checkData: [],
      helpPaySearch: {
        name: '',
        workFlag: '',
        type: ''
      },
      helpPayData: [],
      helpDialog: false,//意向调查流程图弹框
      addhsSubsidy: false,//新增学员信息
      addhsSubsidyform: {
        idCard: '',
        phonenum: '',
        name: '',
        type: '',
        tname: '',
        id: ''
      },
      addhsSubsidyformRule: {
        idCard: [{ required: true, message: "请填写学员身份证号", trigger: "change" }],
        phonenum: [{ required: true, message: "请填写学员号码", trigger: "change" }],
        name: [{ required: true, message: "请填写学员姓名", trigger: "change" }],
        type: [{ required: true, message: "请选择报读层次", trigger: "change" }]
      },
      modifyPrice: false,//修改报名费弹框
      modifyPriceform: {
        junior: '',
        undergraduate: '',
        total: '',
        month: '',
        type: ''
      },
      //信息采集全屏弹框数据
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
  created() {
    GET('/api/getInfoData').then(res => {
      this.infoData = res.dataTable
    }).catch(error => {
      console.log(error)
    });
    GET('/api/getCheckData').then(res => {
      this.checkData = res.dataTable
    }).catch(error => {
      console.log(error)
    });
    GET('/api/getHelpPayData').then(res => {
      this.helpPayData = res.dataTable
    }).catch(error => {
      console.log(error)
    });
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    handleChange(value) {
      console.log(value);
    },
    handleSizeChange(val) {
      console.log(`每页：${val}`)
    },
    handlecurrentChange(val) {
      console.log(`当前页：${val}`)
    },
    submitWorkForm(formName) { //验证表单
      let _this = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(_this.ruleForm);
        } else {
          this.$message({
            showClose: true,
            type: 'warning',
            message: '提交失败，验证不通过'
          })
          return false
        }
      })
    },
    handleCommand(command) {//更多操作
      if (command == 'a') {
        this.uploadModal1 = true
      }
      if (command == 'b') {
        this.uploadModal2 = true
      }
      if (command == 'c') {
        this.downloaddModal1 = true
      }
      if (command == 'd') {
        this.downloaddModal2 = true
      }
    },
    JS_submit() {//确认提交
      const that = this;
      this.$msgBox.confirm('<span>请确认你上传</span><span style="color:red;">【代扣报名费】</span><span>无误。</span>', '温馨提示', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        callback: (action, instance) => {
          that.makeSliverFlag = true
          if (action === 'confirm') {
            that.SubmitStu = true
          }
        }
      }).then(() => {
        this.$message({
          type: 'success',
          message: '提交成功！'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消提交！'
        });
      });
    }
  }
}
</script>
<style scoped>
/* mohan */
.searchWrap {
  margin-top: 15px;
  display: inline-block;
}
/* qianjun */
.first-h3 {
  font-size: 14px;
  color: #444;
  margin: 8px 0 8px;
}
.second-h3 {
  font-size: 14px;
  color: #444;
  margin: 8px 0 8px;
  line-height: 40px;
}
table {
  border-collapse: collapse;
  width: 100%;
  border: 1px solid #c6ccdd;
}
table tr th {
  border: 1px solid #c6ccdd;
  width: 25%;
  padding-left: 10px;
  height: 49px;
  color: #444;
  font-size: 14px;
  text-align: left;
  font-weight: 500;
}
.content-title {
  height: 48px;
  margin-top: 10px;
}
.sub-box {
  margin-top: 25px;
}
.sub-box > button {
  margin-left: 40px;
  margin-right: 15px;
}
/* 信息采集弹框 */
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
}
.left180 {
  left: 180px;
}
.iconReset > span {
  font-size: 14px;
  color: #2e76ee;
}
.iSpan {
  right: -124px;
}
/* lxm */
.upIcon {
  color: #2e76ee;
  font-size: 18px;
}
.info-item .el-select,
.el-cascader,
.info-item .el-date-editor {
  width: 100%;
}
</style>

<style>
/* mohan */

/* qianjun */

/* lxm */
</style>

