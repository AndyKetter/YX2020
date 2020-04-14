<template>
  <div class="formula-manage">
    <div class="guide">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home/financialSystem' }">财务系统</el-breadcrumb-item>
        <el-breadcrumb-item>绩效公式管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/financialSystem' }">(返回上级)</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="bgWhite mgt15">
      <!-- 查询栏 start -->
      <div class="pad-top pull-left">
        <el-form :inline="true">
          <el-form-item label="查询年月">
            <el-date-picker class="width110" v-model="formulaMonth" type="month" @change="monthChange" :editable="false" :clearable="false" value-format="yyyyMM" placeholder="年月">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="业务类型">
            <el-select filterable ref="caseTypeLabel" @change="caseTypeChange" clearable v-model="caseType" placeholder="请选择" class="width110">
              <el-option v-for="item in caseTypeOptions" :key="item.typeId" :label="item.typeName" :value="item.typeId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="档位类型">
            <el-select filterable clearable v-model="gearType" placeholder="请选择" class="width110">
              <el-option v-for="item in gearTypeOptions" :key="item.gearType" :label="item.gearName" :value="item.gearType">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="specialPolicyCb" label="特殊政策" @change="specialPolicyChange"></el-checkbox>
            <el-input v-if="specialPolicyCb" clearable v-model="specialPolicy" placeholder="政策人id" class="width110"></el-input>
            <el-checkbox v-model="workAreaId" label="指定区域" style="margin-left:15px;"></el-checkbox>
            <el-checkbox v-model="remark" label="含备注项"></el-checkbox>
          </el-form-item>
          <el-form-item>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="JS_search" icon="el-icon-search">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="pad-top pull-right">
        <el-form>
          <el-form-item class="pull-right">
            <el-dropdown @command="handleCommand" trigger="click">
              <el-button type="primary">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">新增公式</el-dropdown-item>
                <el-dropdown-item command="b" divided>下载公式</el-dropdown-item>
                <el-dropdown-item command="c" divided :disabled="isLockFlag">批量删除</el-dropdown-item>
                <el-dropdown-item command="d" divided>导入公式</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
        </el-form>
      </div>
      <!-- 表格 -->
      <div class="table_wrap">
        <el-table v-loading="loading" :height="tabHeight" :data="formulaData" @selection-change="handleSelectionChange" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
          <el-table-column type="selection" min-width="50"></el-table-column>
          <el-table-column type="index" label="序号" min-width="50"></el-table-column>
          <el-table-column prop="postName" min-width="100" label="职务"></el-table-column>
          <el-table-column prop="caseName" min-width="120" label="业务类型" show-overflow-tooltip></el-table-column>
          <el-table-column prop="gearName" min-width="120" label="档位类型" show-overflow-tooltip></el-table-column>
          <el-table-column label="达标值" min-width="100">
            <template slot-scope="scope">
              <span>{{scope.row.normalValue}}</span>
              <span v-if="scope.row.normalValue">万</span>
            </template>
          </el-table-column>
          <el-table-column label="转正值" min-width="100">
            <template slot-scope="scope">
              <span>{{scope.row.conversationValue}}</span>
              <span v-if="scope.row.conversationValue">万</span>
            </template>
          </el-table-column>
          <el-table-column prop="formula" label="公式" min-width="250" show-overflow-tooltip></el-table-column>
          <el-table-column prop="specialPolicy" label="特殊政策" min-width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="isTeam" min-width="100" label="是否全团队">
            <template slot-scope="scope">
              <span v-if="scope.row.isTeam === '1'">是</span>
              <span v-if="scope.row.isTeam === '0'">否</span>
            </template>
          </el-table-column>
          <el-table-column prop="workAreaName" min-width="100" label="指定区域" show-overflow-tooltip></el-table-column>
          <el-table-column label="修改人" min-width="150" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.updateUserName || scope.row.createUserName}}
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="修改时间" min-width="150">
            <template slot-scope="scope">
              {{scope.row.updateTime || scope.row.createTime}}
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" min-width="250" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" min-width="130" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="updateThis(scope.row.id)" :disabled="isLockFlag">修改</el-button>
              <el-button type="text" size="small" @click="deleteThis(scope.row.id)" :disabled="isLockFlag">删除</el-button>
              <el-button type="text" size="small" @click="viewDetails(scope.row.id)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div id="pagination">
          <el-pagination @size-change="handleSizeChange" @current-change="handlecurrentChange" background :current-page="current" :page-sizes="[10,15,20,30,40]" :page-size="size" layout="total,sizes,prev,pager,next,jumper" :total="total"></el-pagination>
        </div>
      </div>
    </div>
    <!-- 计算公式编辑器-新增 -->
    <el-dialog :title="dialogTitle" @open="dialogOpen" :before-close="handleAddClose" :close-on-click-modal="false" :visible.sync="addCondition" width="868px" class="formulaEditModal grayBg" top="6vh">
      <el-form :model="addConditionform" :rules="addConditionformRule" ref="addConditionform" label-width="100px">
        <div class="whiteBox">
          <p class="pReset">基本情况</p>
          <el-row>
            <el-col :md="8">
              <el-form-item label="年 / 月：" prop="formulaMonth">
                <el-date-picker style="width:150px" v-model="addConditionform.formulaMonth" type="month" @change="monthChangeAddModify" :editable="false" :clearable="false" value-format="yyyyMM" placeholder="年月">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :md="8">
              <el-form-item label="职 务：" prop="postId">
                <el-select ref="postName" filterable v-model="addConditionform.postId" placeholder="请选择" style="width:150px">
                  <el-option v-for="item in levelOptions" :key="item.levelKey" :label="item.levelName" :value="item.levelKey">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="8">
              <el-form-item label="档位类型：" prop="gearType">
                <el-select ref="gearName" filterable allow-create clearable v-model.trim="addConditionform.gearType" placeholder="请选择/新增" style="width:150px">
                  <el-option v-for="item in gearTypeOptionsAddModify" :key="item.gearType" :label="item.gearName" :value="item.gearType">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="8">
              <el-form-item id="caseName" label="业务类型：" prop="caseType">
                <el-select ref="caseName" filterable clearable v-model="addConditionform.caseType" multiple placeholder="请选择" style="width:150px">
                  <el-option v-for="item in caseTypeOptions" :key="item.typeId" :label="item.typeName" :value="item.typeId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="8">
              <el-form-item label="达标值：" prop="normalValue">
                <el-input-number :controls="false" v-model="addConditionform.normalValue" placeholder="单位/万" style="width:150px" :min="0" :max="10000000"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :md="8">
              <el-form-item label="转正值：" prop="conversationValue">
                <el-input-number :controls="false" v-model="addConditionform.conversationValue" placeholder="单位/万" style="width:150px" :min="0" :max="10000000"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="whiteBox">
          <p class="pReset">标签区</p>
          <el-row>
            <el-col :md="24">
              <el-form-item label="参 数：">
                <el-button style="width:150px;margin-left:10px" @click="labelParamClick('a')">个人主单累计回款（a）</el-button>
                <el-button style="width:150px;margin-top:5px" @click="labelParamClick('b')">个人绩效工资（b）</el-button>
                <el-button style="width:150px;" @click="labelParamClick('c')">业务整体业绩（c）</el-button>
                <el-button style="width:150px;" @click="labelParamClick('d')">集团业绩（d）</el-button>
                <el-button style="width:150px;" @click="labelParamClick('e')">区域（e）</el-button>
                <el-button style="width:150px;" @click="labelParamClick('f')">区域总业绩（f）</el-button>
                <el-button style="width:150px;" @click="labelParamClick('h')">职级（h）</el-button>
                <el-button style="width:150px;" @click="labelParamClick('g')">人员ID（g）</el-button>
              </el-form-item>
            </el-col>
            <el-col :md="18">
              <el-form-item id="workAreaName" label="区 域：" prop="workAreaId">
                <el-select ref="workAreaName" filterable clearable v-model="addConditionform.workAreaId" multiple placeholder="请选择区域（可多选）" style="width:500px">
                  <el-option v-for="item in areaOptions" :key="item.areaId" :label="item.areaName" :value="item.areaId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="24">
              <el-form-item label="符 号：">
                <el-button @click="labelSymbolClick('+')" style="width:40px;margin-left:10px">+</el-button>
                <el-button @click="labelSymbolClick('-')" style="width:40px;">-</el-button>
                <el-button @click="labelSymbolClick('*')" style="width:40px;">*</el-button>
                <el-button @click="labelSymbolClick('/')" style="width:40px;">/</el-button>
                <el-button @click="labelSymbolClick('=')" style="width:40px;">=</el-button>
                <el-button @click="labelSymbolClick('<')" style="width:40px;">&lt;</el-button>
                <el-button @click="labelSymbolClick('>')" style="width:40px;">&gt;</el-button>
                <el-button @click="labelSymbolClick('<=')" style="width:40px;">&lt;=</el-button>
                <el-button @click="labelSymbolClick('>=')" style="width:40px;">&gt;=</el-button>
                <el-button @click="labelSymbolClick('%')" style="width:40px;">%</el-button><br />
                <el-button @click="labelSymbolClick('(')" class="btn">(</el-button>
                <el-button @click="labelSymbolClick(')')" class="btn">)</el-button>
                <el-button @click="labelSymbolClick('[')" class="btn">[</el-button>
                <el-button @click="labelSymbolClick(']')" class="btn">]</el-button>
                <el-button @click="labelSymbolClick('|')" class="btn">|</el-button>
                <el-button @click="labelSymbolClick('||')" class="btn">||</el-button>
                <el-button @click="labelSymbolClick('&&')" class="btn">&&</el-button>
                <el-button @click="labelSymbolClick('.')" class="btn">.</el-button>
                <el-button @click="labelSymbolClick(',')" class="btn">,</el-button>
                <el-button @click="labelSymbolClick(';')" class="btn">;</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="whiteBox">
          <el-row>
            <el-col :md="12">
              <p class="pReset">公式区</p>
            </el-col>
            <el-col :md="12">
              <el-tooltip class="item" effect="dark" placement="top-end">
                <div slot="content">
                  <div>公式符号说明：</div>
                  <div>1、“逗号，”之前是条件，之后是算法；</div>
                  <div>2、多种条件和算法，可配置在同一个公式内，用分号隔开；</div>
                  <div>3、若指定了提成比例，则公式内无需配置绩效工资算法；</div>
                  <div>4、若公式内配置了多种条件和算法，提成比例项自动失效；</div>
                  <div>5、参数不区分字母大小写，建议统一用小写；</div>
                  <div>6、符号不区分中英文，建议统一用英文符号；</div>
                  <div v-html="fmsg"></div>
                </div>
                <p class="pReset pull-right" style="text-align:right;display:inline-block;width:100px;cursor:pointer;padding-right:10px;color:#1871f8;text-decoration:underline">公式符号说明</p>
              </el-tooltip>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="24">
              <el-form-item label-width="80" prop="formula" label="计算公式">
                <el-input ref="formula" type="textarea" id="calcTextarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入计算公式" v-model="addConditionform.formula" style="width:800px;">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="whiteBox">
          <p class="pReset">其他信息</p>
          <el-row>
            <el-col :md="11">
              <el-form-item label="特殊政策：" prop="specialPolicy">
                <el-input v-model.trim="addConditionform.specialPolicy" style="width:250px;" placeholder="多个以英文逗号隔开"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="6">
              <el-form-item label="是否全团队：" prop="isTeam">
                <el-select filterable v-model="addConditionform.isTeam" placeholder="请选择">
                  <el-option v-for="item in teamFlagOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="6">
              <el-form-item label="备 注：" prop="remark">
                <el-select filterable v-model="addConditionform.remark" placeholder="请选择">
                  <el-option v-for="item in remarkOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="JS_cancel('addConditionform')">取消</el-button>
        <el-button type="primary" @click="JS_add_save('addConditionform')" v-no-more-click>保存</el-button>
      </span>
    </el-dialog>
    <!-- 公式详情 -->
    <el-dialog title="公式详情" :close-on-click-modal="false" :visible.sync="formulaDetailFlag" width="868px" class="formulaDetailModal grayBg">
      <div class="whiteBox">
        <p class="pReset">基本信息</p>
        <el-row class="textLft">
          <el-col :span="3" class="height26">年 / 月：</el-col>
          <el-col :span="3" class="height26">
            <span v-if="detailsInfo.formulaMonth">{{detailsInfo.formulaMonth | subDateYear}}年{{detailsInfo.formulaMonth | subDateMonth}}月</span>
            <span v-else></span>
          </el-col>
          <el-col :span="3" class="height26">职&nbsp;&nbsp;&nbsp;&nbsp;务：</el-col>
          <el-col :span="3" class="height26">{{detailsInfo.postName}}</el-col>
          <el-col :span="3" class="height26">档位类型：</el-col>
          <el-col :span="9" class="height26">{{detailsInfo.gearName}}</el-col>
          <el-col :span="3" class="height26">业务类型：</el-col>
          <el-col :span="3" class="height26 text-overflow" :title="detailsInfo.caseName">{{detailsInfo.caseName}}</el-col>
          <el-col :span="3" class="height26">达标值：</el-col>
          <el-col :span="3" class="height26">
            <span>{{detailsInfo.normalValue}}</span>
            <span v-if="detailsInfo.normalValue">万</span>
          </el-col>
          <el-col :span="3" class="height26">转正值：</el-col>
          <el-col :span="3" class="height26">
            <span>{{detailsInfo.conversationValue}}</span>
            <span v-if="detailsInfo.conversationValue">万</span>
          </el-col>
          <el-col :span="3" class="height26">区&nbsp;&nbsp;&nbsp;&nbsp;域：</el-col>
          <el-col :span="3" class="height26 text-overflow" :title="detailsInfo.workAreaName">{{detailsInfo.workAreaName}}</el-col>
          <el-col :span="3" class="height26">是否备注项：</el-col>
          <el-col :span="3" class="height26 text-overflow" :title="detailsInfo.remark">{{detailsInfo.remark}}</el-col>
          <el-col :span="3" class="height26">特殊政策：</el-col>
          <el-col :span="3" class="height26">{{detailsInfo.specialPolicy}}</el-col>
          <el-col :span="3" class="height26">是否全团队：</el-col>
          <el-col :span="3" class="height26">
            <span v-if="detailsInfo.isTeam == 1">是</span>
            <span v-if="detailsInfo.isTeam == 0">否</span>
          </el-col>
          <el-col :span="3" class="height26"></el-col>
          <el-col :span="21" class="height26">
            <el-tooltip class="item" effect="dark" placement="top-end">
              <div slot="content">
                <div>公式符号说明：</div>
                <div>1、“逗号，”之前是条件，之后是算法；</div>
                <div>2、多种条件和算法，可配置在同一个公式内，用分号隔开；</div>
                <div>3、若指定了提成比例，则公式内无需配置绩效工资算法；</div>
                <div>4、若公式内配置了多种条件和算法，提成比例项自动失效；</div>
                <div>5、参数不区分字母大小写，建议统一用小写；</div>
                <div>6、符号不区分中英文，建议统一用英文符号；</div>
                <div v-html="fmsg"></div>
              </div>
              <p class="pReset" style="display:inline-block;width:100px;cursor:pointer;margin:0;padding:0;color:#1871f8;text-decoration:underline">公式符号说明</p>
            </el-tooltip>
          </el-col>
          <el-col :span="3" class="height26"></el-col>
          <el-col :span="21" class="height26">公式：{{detailsInfo.formula}}</el-col>
        </el-row>
      </div>
      <div class="whiteBox">
        <p class="pReset" style="padding-left:0">操作记录</p>
        <el-table :data="recordList" border style="width:100%" :header-cell-style="{backgroundColor:'#e5e9f3'}">
          <el-table-column label="日期" width="150">
            <template slot-scope="scope">
              {{scope.row.updateTime || scope.row.createTime}}
            </template>
          </el-table-column>
          <el-table-column label="修改人" width="150">
            <template slot-scope="scope">
              {{scope.row.updateUserName || scope.row.createUserName}}
            </template>
          </el-table-column>
          <el-table-column property="content" label="修改记录" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="formulaDetailFlag = false">确定</el-button>
      </span>
    </el-dialog>

    <!-- 公式下载弹框 -->
    <el-dialog title="公式下载" :close-on-click-modal="false" :visible.sync="downloadEx" width="600px">
      <div>
        <el-form :model="downloadExform" :rules="downloadExformRule" ref="downloadExform" label-width="100px">
          <el-row>
            <el-col :md="24">
              <el-form-item label="下载月份" prop="month">
                <el-date-picker style="width:400px" v-model="downloadExform.month" type="month" :editable="false" :clearable="false" value-format="yyyyMM" placeholder="选择月">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :md="24">
              <el-form-item label="下载方式" prop="typeSelect">
                <el-select v-model="downloadExform.typeSelect" placeholder="下载方式" style="width:400px">
                  <el-option v-for="item in downloadExOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="JS_dw_cancel('downloadExform')">取消</el-button>
        <el-button type="primary" @click="JS_download('downloadExform')">确定</el-button>
      </span>
    </el-dialog>
    <!-- 删除温馨提示弹框 -->
    <el-dialog title="温馨提示" :close-on-click-modal="false" :visible.sync="deleWarn" width="450px">
      <el-row>
        <el-col :md="21" :offset="3" class="warnIcoBg">
          <h2>您确定要批量删除数据？</h2>
          <span style="color:red">注：删除后不可恢复！</span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleWarn = false">取消</el-button>
        <el-button type="primary" @click="doAllDeleteSave">确定</el-button>
      </span>
    </el-dialog>

    <!-- 公式导入弹框 -->
    <el-dialog title="公式导入" :close-on-click-modal="false" :show-close="false" :visible.sync="exportEx" width="580px">
      <div>
        <el-form :model="exportExform" :rules="exportExformRule" ref="exportExform" label-width="100px">
          <el-row>
            <el-col :md="24">
              <el-form-item label="导入月份" prop="month">
                <el-date-picker style="width:420px" v-model="exportExform.month" type="month" :editable="false" :clearable="false" value-format="yyyyMM" placeholder="选择月">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :md="24">
              <el-form-item label="公式导入" prop="BasePay">
                <p class="clearfix" style="margin-top:6px;">
                  <el-upload :multiple="false" :limit="1" class="pull-left" ref="upload" :data="{formulaMonth:exportExform.month}" :auto-upload="false" :action="uploadActionUrl" :headers="headers" :before-remove="beforeRemove" :before-upload="beforeUpload" :on-change="changeUpload" :on-success="handleSuccess" :file-list="fileList">
                    <el-button slot="trigger" size="small" icon="el-icon-upload">选取文件</el-button>
                    <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload('exportExform')">上传文件</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
                  </el-upload>
                </p>
              </el-form-item>
            </el-col>
            <el-col :md="16">
              <div style="padding-left:30px;line-height:30px;color:red;margin-top:10px;">注：导入成功后，会立刻覆盖当前版本</div>
            </el-col>
            <el-col :md="8">
              <div class="fileBox" style="margin-top:10px;text-align:right;padding-right:10px"><span class="filename excel">
                  <el-button type="text" class="underlineTxt" @click.stop="JS_download_model">公用模板下载</el-button>
                </span></div>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer" style="padding-right: 18px;">
        <el-button type="primary" @click="fileClose('exportExform')">关闭</el-button>
      </span>
    </el-dialog>

    <!-- 导入信息 -->
    <el-dialog title="导入信息" :close-on-click-modal="false" :show-close="false" :visible.sync="importProcessInfoDialog" width="600px">
      <div class="pad-all mar-ver">
        <el-progress :text-inside="true" :stroke-width="20" :percentage="progressPercentAge"></el-progress>
        <p>正在导入，本次需导入总记录{{uploadProcessInfo.total | repair}}条，<span style="color:#66b1ff">成功{{uploadProcessInfo.successful | repair}}条</span>，<span style="color:red">失败{{uploadProcessInfo.failures | repair}}条</span>，总耗时{{uploadProcessInfo.dealAllTime}}</p>
        <p v-show="loadErrorExcel">
          <el-button type="text" @click="unloadErrorLink" class="underlineTxt">点击下载导入失败明细</el-button><span style="color:#a1a1a1">(导入失败明细已发送到您内网邮箱)</span>
        </p>
      </div>
      <span slot="footer" class="dialog-footer" v-show="progressBackBtn">
        <el-button type="primary" @click="importProgress">返回</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Tools from 'untils/index.js'
import tbMixin from "libs/mixin/tbMixin.js" //动态计算表格高度mixin
import { GET, POST, DELETE, PUT, GETBlob } from "http/custom.js"
import { constants } from 'fs';
export default {
  name: 'formulaManage',
  mixins: [tbMixin],
  data() {
    let Ytd = Tools.getYtd() //获取当前年月 格式如 201906
    const uploadActionUrl = process.env.VUE_APP_DOMAIN_performance + "/performanceFormulaUpload" //导入action  线上
    return {
      t_height: 285, //减去的高度
      fmsg: '7、<、>、≥、≤、%、*等符号，点击符号区自动生成即可；',
      isLockFlag: false, //是否锁定
      caseTypeOptions: [],//业务类型数组
      caseType: '',//业务类型
      caseTypeLabel: '',//业务类型name
      formulaMonth: Ytd,//查询年月
      gearType: '',//挡位类型
      uploadActionUrl,
      fileList: [], //上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
      headers: {}, //上传图片请求头
      gearTypeOptions: [],//挡位类型数组
      gearTypeOptionsAddModify: [],//新增修改挡位类型数组
      specialPolicyCb: false, //特殊政策checkbox 
      workAreaId: false, //指定区域checkbox
      remark: false, //含备注项checkbox
      specialPolicy: '', //政策人id
      multipleSelection: [],//已选择行数组
      //分页查询
      loading: false, //table加载动画开关
      current: 1, //当前页码
      size: 15, //每页显示记录条数
      total: 0, //总记录条数
      formulaData: [], //绩效公式管理
      // 公式详情
      formulaDetailFlag: false,
      detailsInfo: {},//详情
      recordList: [],//操作记录列表
      // --end---
      // 计算公式编辑器-新增
      dialogTitle: '',
      levelOptions: [
        { levelKey: '0', levelName: '员工' },
        { levelKey: '1', levelName: '组长' },
        { levelKey: '2', levelName: '部长' },
        { levelKey: '3', levelName: '副总' }
      ],//级别职务字典options
      areaOptions: [],//所属区域字典options
      addCondition: false,
      addConditionformRule: {
        formulaMonth: [{ required: true, message: "请选择年月", trigger: "change" }],//年月
        formula: [
          { required: true, message: "请输入计算公式", trigger: "blur" },
          { min: 0, max: 5000, message: '不能超过5000字', trigger: 'blur' }
        ],//计算公式
        postId: [{ required: true, message: "请选择职务", trigger: "change" }],//职务
        // gearType:[{ required: true, message: "请选择档位", trigger: "change" }],//挡位类型
        // caseType:[{ required: true, message: "请选择业务类型", trigger: "blur" }],//业务类型
        // conversationValue:[{ required: true, message: "请输入转正值", trigger: "blur" }],//转正值
        // normalValue:[{ required: true, message: "请输入达标值", trigger: "blur" }],//达标值
        specialPolicy: [
          { min: 0, max: 800, message: '不能超过800字', trigger: 'blur' }
        ]
      },
      addConditionform: {//新增初始条件设置
        formulaMonth: Ytd,//年月
        postId: '',//职务级别
        gearType: '',//挡位类型
        caseType: '',//业务类型
        conversationValue: undefined,//转正值
        normalValue: undefined,//达标值
        workAreaId: '',//所在区域id(多个以英文逗号分隔)
        formula: '',//计算公式
        specialPolicy: '',//特殊政策
        isTeam: '',//是否全团队
        remark: '' //备注项
      },
      teamFlagOptions: [
        {
          value: 1,
          label: '是'
        },
        {
          value: 0,
          label: '否'
        }
      ],
      remarkOptions: [
        {
          value: "备注项",
          label: '备注项'
        },
        {
          value: "业绩合并",
          label: '业绩合并'
        }
      ],
      exportEx: false,//公式导入
      exportExform: {
        month: '' //月份
      },
      exportExformRule: {
        month: [{ required: true, message: "请选择月份", trigger: "change" }],
      },
      downloadEx: false,//公式下载
      downloadExform: {
        month: '',
        typeSelect: ''
      },
      downloadExformRule: {
        month: [{ required: true, message: "请选择月份", trigger: "change" }],
        typeSelect: [{ required: true, message: "请选择下载方式", trigger: "change" }]
      },
      downloadExOptions: [
        {
          value: 2,
          label: '发送至本人内网邮箱'
        },
        {
          value: 1,
          label: '保存至本地（需要等待数秒至数分钟）'
        }
      ],
      updateId: '',//修改id
      deleWarn: false,//批量删除
      //进度条相关参数
      importProcessInfoDialog: false, //取消进度条框
      importError: false,// 导入错误时呈现的进度 
      downloadErrorEveProcess: false, //获取错误下载key
      loadErrorExcel: false, //呈现失败下载明细
      downloadErrorKey: '', //导入错误下载excel key
      progressPercentAge: 0,
      progressBackBtn: false, //返回按钮
      uploadProcessInfo: {
        total: '',//总条数
        handler: '',//已处理条数
        successful: '',//处理成功条数
        failures: '', //处理失败条数
        finish: false,//是否处理完成
        dealAllTime: '',//总耗时
      },
    }
  },
  computed: {//计算属性
    specialPolicyCbComputed() {//特殊政策计算属性
      if (this.specialPolicyCb == false) {
        return 0 //否
      } else {
        return 1 //是
      }
    },
    workAreaIdComputed() {//指定区域计算属性
      if (this.workAreaId == false) {
        return 0 //否
      } else {
        return 1 //是
      }
    },
    remarkComputed() {//含备注项计算属性
      if (this.remark == false) {
        return 0 //否
      } else {
        return 1 //是
      }
    }
  },
  created() {
    this.headers["x-user-token"] = localStorage.getItem("token"); //设置上传数据文件excel的token
    this.queryCaseTypeDiceList()//获取业务类型
    this.queryGearTypeList()//获取挡位类型
    this.queryGearTypeListAddModify()//获取挡位类型
    this.queryAreaList()//获取所属区域字典
    this.search(); //获取表格列表分页初始化数据
  },
  methods: {
    isLock() {//判断绩效工资是否上锁,如果已经上锁,本页面所有操作disabled,否则正常显示
      let batch = this.formulaMonth.substr(0, 4) + '-' + this.formulaMonth.substr(4, 6) //帮后端补坑
      GET(process.env.VUE_APP_DOMAIN_performance + "/checkAchievementDataLock", { batch }).then(res => {
        if (res.data == true) {//已锁定
          this.isLockFlag = true
        } else {
          this.isLockFlag = false
        }
      }).catch(error => {
        console.log(error)
      })
    },
    caseTypeChange() {//获取业务类型name
      this.$nextTick(() => { //this.$nextTick处理
        this.caseTypeLabel = this.$refs.caseTypeLabel.selectedLabel
      })
    },
    queryAreaList() {//获取所属区域
      POST(process.env.VUE_APP_DOMAIN_personnel + '/queryAreaList').then(res => {
        this.areaOptions = res.data
      }).catch(error => {
        console.log(error)
      })
    },
    queryCaseTypeDiceList() {//获取业务类型
      GET(process.env.VUE_APP_DOMAIN_performance + '/caseTypeDiceList').then(res => {
        this.caseTypeOptions = res.data
      }).catch(error => {
        console.log(error)
      })
    },
    queryGearTypeList() {//获取挡位类型
      let queryObj = { "formulaMonth": this.formulaMonth } //查询对象 
      GET(process.env.VUE_APP_DOMAIN_performance + '/performanceFormulas', queryObj).then(res => {
        this.gearTypeOptions = res.data
      }).catch(error => {
        console.log(error)
      })
    },
    queryGearTypeListAddModify() {//新增修改获取挡位类型
      let queryObj = { "formulaMonth": this.addConditionform.formulaMonth } //查询对象 
      GET(process.env.VUE_APP_DOMAIN_performance + '/performanceFormulas', queryObj).then(res => {
        this.gearTypeOptionsAddModify = res.data
      }).catch(error => {
        console.log(error)
      })
    },
    specialPolicyChange(val) {//特殊政策勾选框
      if (val == false) {
        this.specialPolicy = ''
      }
    },
    monthChange() {//选择月份change事件
      this.queryGearTypeList() //与获取挡位类型联动
    },
    monthChangeAddModify() {//新增修改选择月份change事件
      this.queryGearTypeListAddModify() //与获取挡位类型联动
    },
    handleSelectionChange(val) {//当选择项发生变化时会触发该事件
      this.multipleSelection = val;
      console.log('选中的行', val);
    },
    viewDetails(id) {//查看详情，操作记录列表
      this.formulaDetailFlag = true
      GET(process.env.VUE_APP_DOMAIN_performance + '/performanceFormula', { "id": id }).then(res => {//详情
        this.detailsInfo = res.data
        console.log('获取详情', res)
      }).catch(error => {
        console.log(error)
      })
      //操作记录列表
      GET(process.env.VUE_APP_DOMAIN_performance + '/performanceFormulaRecords', { "formulaId": id }).then(res => {//操作记录列表
        this.recordList = res.data
        console.log('操作记录列表', res)
      }).catch(error => {
        console.log(error)
      })
    },
    deleteThis(id) {//单个删除
      this.$msgBox.confirm('你确定要删除该条数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DELETE(process.env.VUE_APP_DOMAIN_performance + '/performanceFormula', { "ids": id }).then(res => { //单条数据删除
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.JS_search() //刷新表格，重新获取数据
        }).catch(error => {
          console.log(error)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteAll() {//批量删除
      this.deleWarn = true
    },
    doAllDeleteSave() {//批量删除-保存
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: '请勾选要批量删除的数据!'
        })
        this.deleWarn = false //关闭弹框
      } else {
        let ids = []
        this.multipleSelection.forEach(element => {
          ids.push(element.id)
        })
        ids = ids.join(',') //转换成以逗号隔开的字符串
        DELETE(process.env.VUE_APP_DOMAIN_performance + '/performanceFormula', { "ids": ids }).then(res => { //批量数据删除
          this.$message({
            type: 'success',
            message: '批量删除成功!'
          })
          this.deleWarn = false //关闭弹框
          this.JS_search() //刷新表格，重新获取数据
        }).catch(error => {
          console.log(error)
        })
      }
    },
    handleSizeChange(val) {
      //每页显示多少条数据切换
      this.size = val; //保存状态-每页显示多少条数据切换
      this.search();
    },
    handlecurrentChange(val) {
      //点击页码，当前页
      this.current = val; //保存状态-当前页
      this.search();
    },
    JS_search() {//搜索
      this.current = 1; //点击搜索current=1搜索第一页
      this.search();
    },
    search() {
      //mohan 列表查询
      let searchObj = {
        //查询对象,在这里初始化,初始化值都是取this下面的
        current: this.current, //当前页码
        size: this.size, //每页显示记录条数
        caseType: this.caseTypeLabel || '', //业务类型name
        // caseType: this.caseType || '', //业务类id
        formulaMonth: this.formulaMonth, //绩效公式所属年月(yyyyMM)
        gearType: this.gearType || '', //档位类型
        remark: this.remarkComputed, //是否备注项(1：是，0：否)
        isSpecialPolicy: this.specialPolicyCbComputed, //特殊政策是否勾选
        specialPolicy: this.specialPolicy, //特殊政策(多个以逗号隔开)
        workAreaId: this.workAreaIdComputed //是否指定区域(1：是，0：否)
      };
      console.log("搜索对象", searchObj);
      this.loading = true; //开启动画
      POST(process.env.VUE_APP_DOMAIN_performance + "/performanceFormulas", searchObj)
        .then(res => {
          this.loading = false; //关闭动画
          this.formulaData = res.data.records; //set表格的值
          this.current = res.data.current; //set当前页
          this.size = res.data.size; //每页显示记录条数
          this.total = res.data.total; //总记录条数
        })
        .catch(error => {
          console.log(error);
        })
      this.isLock();//总台账是否上锁
    },
    handleCommand(command) {
      if (command == 'a') {
        this.dialogTitle = '计算公式编辑器-新增'
        this.addCondition = true;
      }
      if (command == 'b') {
        this.downloadEx = true;
      }
      if (command == 'c') {
        this.deleteAll()//全部删除
      }
      if (command == 'd') {
        this.exportEx = true;
      }
    },
    JS_dw_cancel(formName) {//公式下载取消
      this.$refs[formName].resetFields() //重置
      this.downloadEx = false //关闭弹框
    },
    JS_download(formName) {//公式下载
      this.$refs[formName].validate(valid => {
        if (valid) {
          let saveObj = { //公式下载保存对象
            "formulaMonth": this.downloadExform.month,//月份
            "exportType": this.downloadExform.typeSelect //下载方式
          }
          console.log('公式下载保存对象', saveObj)
          if (saveObj.exportType === 2) {//发送邮件
            this.$message({
              type: 'success',
              message: '发送邮件成功!',
              showClose: true
            })
            GET(process.env.VUE_APP_DOMAIN_performance + "/performanceFormulaDownload", {
              formulaMonth: this.downloadExform.month,
              exportType: this.downloadExform.typeSelect
            }).then(res => {
              console.log(res)
            }).catch(error => {
              console.log(error)
            })
          }
          if (saveObj.exportType === 1) {//下载到本地
            window.location.href = `${process.env.VUE_APP_DOMAIN_performance}/performanceFormulaDownload?formulaMonth=${this.downloadExform.month}&exportType=${this.downloadExform.typeSelect}&token=${localStorage.getItem('token')}`
            this.$message({
              type: 'success',
              message: '下载公式成功!',
              showClose: true
            })
          }
          this.downloadEx = false //关闭弹框
          // GETBlob(process.env.VUE_APP_DOMAIN_performance+'/performanceFormulaDownload',saveObj).then(res=>{
          //     this.$message({
          //       type: 'success',
          //       message: '下载公式成功!',
          //       showClose:true
          //     })
          //     this.downloadEx = false //关闭弹框
          //     //这里res是返回的blob对象 
          //     let blob = new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}); //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
          //     // let blob = new Blob([res.data]) //application/octet-stream; charset=utf-8
          //     let downloadElement = document.createElement('a')
          //     // let href = window.URL.createObjectURL(blob) //创建下载的链接
          //     let href = window.URL.createObjectURL(new Blob([res.data])) //创建下载的链接
          // 　　downloadElement.href = href
          //     console.log(downloadElement.href)
          //     downloadElement.download = this.downloadExform.month + '公式.xlsx'; //下载后文件名
          // 　　document.body.appendChild(downloadElement)
          // 　　downloadElement.click() //点击下载
          // 　　document.body.removeChild(downloadElement) //下载完成移除元素
          // 　　window.URL.revokeObjectURL(href) //释放掉blob对象 
          // }).catch(error=>{
          //     console.log(error)
          // })
        } else {
          this.$message({
            showClose: true,
            type: 'warning',
            message: '下载失败，验证不通过'
          })
        }
      })
    },
    beforeRemove(file) {
      //删除文件之前的钩子
      return this.$msgBox.confirm(`确定移除 ${file.name}？`);
    },
    beforeUpload(file) {
      //上传文件之前的钩子
      console.log("上传文件之前的回调", file);
      let testFileType = file.name.substring(file.name.lastIndexOf('.') + 1) //截取文件后缀
      const extension1 = testFileType === 'xls'
      const extension2 = testFileType === 'xlsx'
      if (!extension1 && !extension2) {//不是excel文件格式
        this.$message.error("上传数据文件只能是 xlsx/xls 格式!")
      }
      return extension1 || extension2
    },
    changeUpload(file, fileList) {//文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
      console.log('change', file)
      console.log('fileList', fileList)
    },
    handleSuccess(res) {//上传文件接口调取成功回调
      this.exportEx = false;
      if (res.code === 0) {
        //文件上传成功或者部分成功
        this.downloadErrorEveProcess = res.data //获取进度条事件句柄
        //错误导入进度条与下载模板
        this.importProcessInfoDialog = true;
        this.queryProgress() //获取上传文件进度条信息
      } else {
        let msgError = res.msg || '【系统无法识别EXCLE中的空白，公式和非法字符。请先清理】。' //500非0情况
        this.$msgBox.alert(`<span style="color:red;">${msgError} </span>`, '温馨提示', {
          dangerouslyUseHTMLString: true
        })
      }
      this.$refs.upload.clearFiles(); //清空已上传的文件列表（该方法不支持在 before-upload 中调用）
    },
    queryProgress() { //上传进度条
      this.loadErrorExcel = false; // 隐藏下载链接
      let progressAjax = window.setInterval(() => {
        GET(process.env.VUE_APP_DOMAIN_personnel + "/queryProgress", { progressKey: this.downloadErrorEveProcess }).then(res => {
          this.uploadProcessInfo = res.data;//进度信息对象
          if (res.data.total) {
            this.progressPercentAge = parseInt((res.data.handler / res.data.total) * 100);
          }
          if (res.data.finish) {//已完成
            this.progressPercentAge = 100; //进度完成度
            let calc = res.data.endTime - res.data.beginTime;
            let time = parseInt(calc / 1000);  //计算完成时间
            this.uploadProcessInfo.dealAllTime = time >= 1 ? time + "秒" : calc + "毫秒";
            this.JS_search();//刷新页面

            setTimeout(() => {
              if (res.data.failures > 0) { //表示有导入失败的，呈现可下载模板
                this.downloadErrorKey = res.data.failFile; //获取错误模板下载key
                this.loadErrorExcel = true; // 呈现下载链接
              }
              this.progressBackBtn = true; //进度条完成后，呈现返回按钮
            }, progressAjax + 1000);
            window.clearInterval(progressAjax);  //清除轮询 
          }
        }).catch(error => {
          window.clearInterval(progressAjax);  //清除轮询
          console.log(error);
        })
      }, 1000);
    },
    importProgress() {//进度弹框关闭
      this.importProcessInfoDialog = false; //关闭进度弹框
      this.progressPercentAge = 0 //进度条清空为0
      this.progressBackBtn = false; //隐藏返回按钮
      this.loadErrorExcel = false; // 隐藏下载失败链接
    },
    unloadErrorLink() {//导入错误模板下载
      console.log('downloadErrorKey', this.downloadErrorKey);
      let url = process.env.VUE_APP_DOMAIN_download + '/oss/download?key=' + this.downloadErrorKey + '&token=' + localStorage.getItem("token") + "&name=" + encodeURI("绩效公式失败明细") + ".xlsx";
      window.location.href = url;
    },
    JS_download_model() {//公式模板下载
      GET(process.env.VUE_APP_DOMAIN_personnel + "/queryBizFilesTemplate", { fileCode: 'PERFORMANCE_FORMULA_IMPORT_TEMPLATE' })
        .then(res => {
          //获取模板存储返回的ID
          window.location.href = process.env.VUE_APP_DOMAIN_download + '/oss/download?key=' + res.data.fileTemplateId + "&name=" + res.data.fileTemplateName + "." + res.data.fileTemplateSuffix;

        })
        .catch(error => {
          console.log(error);
        });
    },
    submitUpload(formName) {//上传文件
      console.log('上传文件', this.$refs.upload.uploadFiles.length)
      if (this.$refs.upload.uploadFiles.length == 0) {
        this.$message({
          showClose: true,
          type: "warning",
          message: "请选取文件！"
        })
        return
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$refs.upload.submit() //手动上传
        } else {
          this.$message({
            showClose: true,
            type: "warning",
            message: "文件或月份不能为空，验证不通过！"
          });
        }
      })
    },
    fileClose(formName) {//关闭公式导入弹框
      //清除表单
      this.exportEx = false
      this.$refs[formName].resetFields()
      this.$refs.upload.clearFiles() //清空已上传的文件列表（该方法不支持在 before-upload 中调用）
    },
    formulaFocusBlur() {//获取失去焦点,模拟验证
      this.$refs.formula.focus()
      this.$refs.formula.blur()
    },
    insertInputTxt(id, insertTxt) {//在指定的焦点上加符号
      let result = this.addConditionform.formula;
      let elInput = document.querySelector("#" + id)
      let startPos = elInput.selectionStart; // 获取光标所字符的位置
      let endPos = elInput.selectionEnd;
      elInput.focus();
      if (startPos === undefined || endPos === undefined) {
        return result.trim();
      }
      let txt = elInput.value;
      result = txt.substring(0, startPos) + insertTxt + txt.substring(endPos, txt.length); // 截取
      return result.trim();
    },
    labelParamClick(val) {//标签区参数
      this.addConditionform.formula = this.insertInputTxt('calcTextarea', val)
      this.formulaFocusBlur() //放赋值后面
    },
    labelSymbolClick(val) {//标签区符号
      this.addConditionform.formula = this.insertInputTxt('calcTextarea', val);
      this.formulaFocusBlur() //放赋值后面
    },
    reset(formName) {//清除表单
      this.$refs[formName].resetFields()
    },
    resetAndSearch(formName) { //清除表单且重新搜索
      this.$refs[formName].resetFields()
      this.search() //刷新表格，重新获取数据
    },
    JS_cancel(formName) {//新增计算公式取消
      this.updateId = "" //重置修改id
      this.addCondition = false //隐藏弹框
      this.$refs[formName].resetFields()
    },
    handleAddClose(formName) { //新增公式弹框关闭回调函数
      this.addCondition = false //隐藏弹框
      this.reset('addConditionform')
    },
    updateThis(id) {//修改
      this.updateId = id //保持修改id
      this.dialogTitle = '计算公式编辑器-修改'
      this.addCondition = true //弹出修改框
      GET(process.env.VUE_APP_DOMAIN_performance + '/performanceFormula', { "id": id }).then(res => {//查询绩效公式--详情
        console.log('修改对象', res)
        let isTeam
        if (res.data.isTeam === "" || res.data.isTeam === undefined) {//是否全团队
          isTeam = ""
        } else {
          isTeam = parseInt(res.data.isTeam)
        }
        let workAreaId //区域多选
        if (res.data.workAreaId) { //存在区域选择
          workAreaId = res.data.workAreaId.split(',') //逗号隔开的字符串转化成数组
        } else {
          workAreaId = [] //无选择
        }
        let workAreaIdNum = [] //转数里面字符串为num类型
        workAreaId.forEach(ele => {
          workAreaIdNum.push(parseInt(ele))
        })
        let caseType //业务类型 多选
        if (res.data.caseType) { //业务类型
          caseType = res.data.caseType.split(',') //逗号隔开的字符串转化成数组
        } else {
          caseType = [] //无选择
        }
        let caseTypeNum = [] //转数里面字符串为num类型
        caseType.forEach(ele => {
          caseTypeNum.push(parseInt(ele))
        })
        //处理挡位类型为空的情况
        let gearName = res.data.gearName || ''
        let gearType = res.data.gearType || ''
        this.addConditionform = { ...res.data, ...{ caseType, isTeam, workAreaId: workAreaIdNum, caseType: caseTypeNum, gearName, gearType } } //赋值给addConditionform对象
        console.log('修改详情对象', this.addConditionform)
      }).catch(error => {
        console.log(error)
      })
    },
    dialogOpen() {
      this.queryGearTypeListAddModify() //打开新增修改弹框，刷新挡位类型
    },
    JS_add_save(formName) {//新增-修改计算公式
      let httpType = ''
      console.log('updateId', this.updateId)
      if (this.updateId != '') {
        httpType = 'PUT' //修改功能
      } else {
        httpType = 'POST' //新增功能
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //区域多选
          let workAreaNameDomEle = Array.from(document.querySelectorAll('#workAreaName .el-select__tags-text'))  //document.getElementsByClassName获取的是个集合，并不是数组，所以要先转成数组
          let workAreaName = [] //保存所在区域名称
          workAreaNameDomEle.forEach(ele => {
            workAreaName.push(ele.innerText)
          })
          //业务类型多选
          let caseNameDomEle = Array.from(document.querySelectorAll('#caseName .el-select__tags-text'))
          let caseName = [] //保存业务类型
          caseNameDomEle.forEach(ele => {
            caseName.push(ele.innerText)
          })
          let selectLabelObj = { //通过$refs获取select Label值
            "postName": this.$refs.postName.selectedLabel,//职务名称
            "gearName": this.$refs.gearName.selectedLabel,//档位类型名称	
            "caseName": caseName.join(','),//业务类型名称
            "caseType": this.addConditionform.caseType.join(','),//业务类型(多个以英文逗号分隔)
            "workAreaName": workAreaName.join(','),//所在区域名称(要与"所在区域id"的顺序保持一致)
            "workAreaId": this.addConditionform.workAreaId.join(',') //所在区域id(多个以英文逗号分隔)
          }
          let saveObj = { ...this.addConditionform, ...selectLabelObj } //保存对象
          console.log('保存对象', saveObj)
          if (httpType === 'POST') { //新增
            POST(process.env.VUE_APP_DOMAIN_performance + '/performanceFormula', saveObj).then(res => {
              this.updateId = '' //重置修改id
              this.$message({
                type: 'success',
                message: '新增计算公式成功!',
                showClose: true
              })
              this.queryGearTypeList() //重新获取查询栏的挡位类型
              this.addCondition = false //关闭新增弹框
              this.resetAndSearch(formName) //重置表单重新获取数据
            }).catch(error => {
              console.log(error)
            })
          } else { //修改
            PUT(process.env.VUE_APP_DOMAIN_performance + '/performanceFormula', saveObj).then(res => {
              this.updateId = '' //重置修改id
              this.$message({
                type: 'success',
                message: '修改计算公式成功!',
                showClose: true
              })
              this.queryGearTypeList() //重新获取查询栏的挡位类型
              this.addCondition = false //关闭新增弹框
              this.resetAndSearch(formName) //重置表单重新获取数据
            }).catch(error => {
              console.log(error)
            })
          }
        } else {
          this.$message({
            showClose: true,
            type: 'warning',
            message: '提交失败，验证不通过'
          })
        }
      })
    }
  }
}
</script>
<style>
</style>
<style scoped>
.bgWhite {
  padding: 15px;
}
.btn {
  width: 40px;
  margin-left: 10px;
  margin-top: 5px;
}
.el-checkbox {
  margin-right: 10px !important;
}
</style>
