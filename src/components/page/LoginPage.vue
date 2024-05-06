<template>
  <div class="main">
    <a-row class="aRow" :gutter="24">
      <a-col :span="8" :offset="8">
        <div class="loginPac">
        <div class="title">高校心理咨询平台</div>
        <div class="label">登录</div>
        <a-form id="formLogin" class="user-layout-login" ref="formLogin">
          <a-alert
            v-if="isLoginError"
            type="error"
            showIcon
            style="margin-bottom: 24px;"
            message="用户名或密码错误"
          />
          <a-form-item>
            <a-input
              size="large"
              type="text"
              placeholder="用户名"
              v-model="inputUsername"
              v-decorator="[
                'username',
                {
                  rules: [
                    { required: true, message: '请输入帐户名' },
                    { validator: handleUsernameOrEmail }
                  ],
                  validateTrigger: 'change'
                }
              ]"
            >
              <a-icon
                slot="prefix"
                type="user"
                :style="{ color: 'rgba(0,0,0,.25)' }"
              />
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-input
              size="large"
              type="password"
              autocomplete="false"
              placeholder="密码"
              v-model="inputPassword"
              v-decorator="[
                'password',
                {
                  rules: [{ required: true, message: '请输入密码' }],
                  validateTrigger: 'blur'
                }
              ]"
            >
              <a-icon
                slot="prefix"
                type="lock"
                :style="{ color: 'rgba(0,0,0,.25)' }"
              />
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-checkbox v-decorator="['rememberMe']">自动登录</a-checkbox>
            <router-link
              class="register"
              :to="{ name: 'register'}"
              style="float: right;"
              >注册账户</router-link
            >
          </a-form-item>

          <a-form-item style="margin-top:24px">
            <a-button
              size="large"
              type="primary"
              class="login-button"
              :loading="state.loginBtn"
              :disabled="state.loginBtn"
              @click="doLogin"
              >登录</a-button
            >
          </a-form-item>
        </a-form>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import api from '@/api/index'
import axios from "axios";
export default {
  data() {
    return {
      inputUsername: "",
      inputPassword: "",
      customActiveKey: "tab1",
      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 0,
      isLoginError: false,
      state: {
        time: 60,
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        smsSendBtn: false
      }
    };
  },
  created() {},
  methods: {
    // handler
    handleUsernameOrEmail(rule, value, callback) {
      const { state } = this;
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
      if (regex.test(value)) {
        state.loginType = 0;
      } else {
        state.loginType = 1;
      }
      callback();
    },
    handleTabClick(key) {
      this.customActiveKey = key;
    },
    doLogin() {
      axios
        .post(api.Login, {
          username: this.inputUsername,
          password: this.inputPassword
        })
        .then(response => {
          var code = response.data.code;
          if (code == 1) {
            localStorage.token = response.data.data.jws
            localStorage.userId = response.data.data.userId
            localStorage.username = response.data.data.username
            localStorage.userStatus = response.data.data.status 
            localStorage.isConsultant = response.data.data.isConsultant;
            this.$router.push({ path: "/" });
            // 延迟 1 秒显示欢迎信息
            setTimeout(() => {
              this.$notification.success({
                message: "欢迎",
                description: `欢迎回来`
              });
            }, 1000);
            this.isLoginError = false;
          } else if (code == 0) {
            this.isLoginError = true;
            // do something
          }
        })
        .catch(error => {
          this.isLoginError = true;
          this.$notification["error"]({
            message: "错误",
            description:
              ((error.response || {}).data || {}).message ||
              "请求出现错误，请稍后再试",
            duration: 4
          });
        });
    }
  }
};
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
    color: rgba(63, 90, 199, 0.66);
    font-weight: 700;
    text-align: center;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
.main {
  height: 95vh;
  justify-content: center;
  align-items: center;
  background-image: url("../../assets/login.png");
  background-size: cover; /* 背景图片铺满整个容器 */
  background-position: center; /* 将背景图片居中 */
}
.aRow{
      top: 200px;
}
.loginPac{
  border: 1px solid #d9d9d9;
  background-color: #0093e9;
  background-image: linear-gradient(
      200deg,
      #d7e4ec 0%,
      #e4ece2 50%,
      #ffffff 100%
  );
  border-radius: 1px;

  height: 100%;
}
.title {
  font-size: 28px;
  color: rgba(63, 90, 199, 0.66);
  font-weight: 700;
  text-align: center;
}

.label {
  font-size: 24px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  margin-bottom: 16px;
}
</style>
