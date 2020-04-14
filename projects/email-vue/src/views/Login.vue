<template>
  <div class="loginContent">
    <el-card shawow="hover" class="loginCard">
      <h4 class="yxMail">永雄邮箱</h4>
      <el-form :model="loginForm" :rules="loginRules" ref="loginForm">
        <el-form-item prop="platformNum">
          <el-input
            class="platformNumInpt"
            size="medium"
            v-model="loginForm.platformNum"
            placeholder="平台号码"
            clearable
            autocomplete
            autofocus
            @keyup.enter.native="submitForm('loginForm')"
          ></el-input>
        </el-form-item>
        <el-form-item prop="passWord">
          <el-input
            class="passWordInpt"
            size="medium"
            v-model="loginForm.passWord"
            placeholder="输入密码"
            show-password
            clearable
            @keyup.enter.native="submitForm('loginForm')"
          ></el-input>
        </el-form-item>
        <div>
          <el-button type="primary" size="medium" class="loginBtn" @click="submitForm('loginForm')">立即登录</el-button>
        </div>
        <div>
          <el-button type="info" size="medium" class="fastLogin" @click="faseLogin">快捷登录到上个帐号</el-button>
        </div>
        <div class="faseLogin_error" v-if="faseLogin_error_show">自动登录到上个帐号失败！请手动登录！</div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      loginForm: {
        platformNum: "",
        passWord: ""
      },
      loginRules: {
        platformNum: [
          { required: true, message: "请输入平台号码", trigger: "blur" }
        ],
        passWord: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      faseLogin_error_show: false
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (
          valid &&
          this.loginForm.platformNum == "yubang168" &&
          this.loginForm.passWord == "yb123456"
        ) {
          this.$router.push({
            name: "inbox",
            query: {
              platformNum: this.loginForm.platformNum,
              passWord: this.loginForm.passWord
            }
          })
        } else {
          this.$message({
            message: "账号或密码错误，登录失败！",
            type: "error",
            showClose: true
          })
          return false
        }
      });
    },
    keyUpEnter() {
      document.onkeydown = e => {
        let body = document.getElementsByTagName("body")[0];
        if (e.keyCode === 13 && e.target === body) {
          this.submitForm("loginForm")
        }
      }
    },
    faseLogin() {
      this.faseLogin_error_show = true
    }
  },
  created() {
    this.keyUpEnter()
  }
}
</script>

<style scoped>
.loginContent {
  height: 100%;
  background: #e5e5e5 url("../images/loginBg.jpg") center 0 no-repeat;
  position: relative;
}
.loginCard {
  width: 350px;
  height: 360px;
  position: absolute;
  left: 0;
  right: 0;
  top: -200px;
  bottom: 0;
  margin: auto;
  text-align: center;
}
.yxMail {
  margin-top: 30px;
}
.loginBtn {
  width: 100%;
}
.fastLogin {
  width: 100%;
  margin-top: 10px;
}
.faseLogin_error {
  color: #f56c6c;
  font-size: 14px;
  padding-top: 20px;
}
</style>
