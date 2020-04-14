// create by zc 2019-11-02
<template>
  <!-- 弹窗 -->
  <el-dialog
    title="人员异动申请发起"
    :close-on-click-modal="false"
    :close="close"
    :visible.sync="visible"
    width="880px"
    class="grayBg"
  >
    <div class="whiteBox">
      <p class="pReset">异动前信息</p>
      <el-form
        :model="beforeChangeForm"
        :rules="beforeChangeFormRule"
        ref="beforeChangeForm"
        label-width="140px"
      >
        <el-row>
          <el-col :md="12">
            <el-form-item label="异动员工：" prop="typeSelect">
              <el-select
                v-model="beforeChangeForm.typeSelect"
                placeholder="请选择"
                style="width:230px"
              >
                <el-option
                  v-for="item in options"
                  :key="item.typeId"
                  :label="item.typeName"
                  :value="item.typeId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="组织架构：" prop="idNumber">
              <el-input v-model="beforeChangeForm.idNumber" disabled style="width:230px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="区域：" prop="idNumber">
              <el-input v-model="beforeChangeForm.idNumber" disabled style="width:230px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="集团：" prop="idNumber">
              <el-input v-model="beforeChangeForm.idNumber" disabled style="width:230px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="级别：" prop="idNumber">
              <el-input v-model="beforeChangeForm.idNumber" disabled style="width:230px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="异动类型：" prop="typeSelect">
              <el-select
                v-model="beforeChangeForm.typeSelect"
                placeholder="请选择"
                style="width:230px"
              >
                <el-option
                  v-for="item in options"
                  :key="item.typeId"
                  :label="item.typeName"
                  :value="item.typeId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="whiteBox">
      <p class="pReset">异动前信息</p>
      <el-form
        :model="beforeChangeForm"
        :rules="beforeChangeFormRule"
        ref="beforeChangeForm"
        label-width="140px"
      >
        <el-row>
          <el-col :md="12">
            <el-form-item label="异动员工：" prop="idNumber">
              <el-input v-model="beforeChangeForm.idNumber" disabled style="width:230px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="区域：" prop="typeSelect">
              <el-select
                v-model="beforeChangeForm.typeSelect"
                placeholder="请选择"
                style="width:230px"
              >
                <el-option
                  v-for="item in options"
                  :key="item.typeId"
                  :label="item.typeName"
                  :value="item.typeId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="总经理：" prop="typeSelect">
              <el-select
                v-model="beforeChangeForm.typeSelect"
                placeholder="请选择"
                style="width:230px"
              >
                <el-option
                  v-for="item in options"
                  :key="item.typeId"
                  :label="item.typeName"
                  :value="item.typeId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="集团：" prop="typeSelect">
              <el-select
                v-model="beforeChangeForm.typeSelect"
                placeholder="请选择"
                style="width:230px"
              >
                <el-option
                  v-for="item in options"
                  :key="item.typeId"
                  :label="item.typeName"
                  :value="item.typeId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="级别：" prop="typeSelect">
              <el-select
                v-model="beforeChangeForm.typeSelect"
                placeholder="请选择"
                style="width:230px"
              >
                <el-option
                  v-for="item in options"
                  :key="item.typeId"
                  :label="item.typeName"
                  :value="item.typeId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="24">
            <el-form-item label="备注：" prop="idNumber">
              <el-input
                type="textarea"
                :autosize="{ minRows:3, maxRows: 4}"
                resize="none"
                placeholder="备注信息"
                v-model.trim="beforeChangeForm.idNumber"
                style="width:630px"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" v-no-more-click>发起</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {},
  data() {
    return {
      visible: false,
      beforeChangeForm: {
        typeSelect: "",
        idNumber: ""
      },
      beforeChangeFormRule: {
        typeSelect: [{ required: true, message: "请选择", trigger: "blur" }],
        idNumber: [{ required: true, message: "请填写", trigger: "blur" }]
      },
      options: []
    }
  },
  methods: {
    //   打开弹层
    show() {
      this.visible = true
    },
    //   关闭弹层
    close() {}
  }
}
</script>