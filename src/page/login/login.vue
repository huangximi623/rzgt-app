<template>
  <div class="login">
    <div class="login-logo">
      <img src="../../assets/logo/RgLogo200.png"/>
    </div>
    <div id="login_form" class="loginForm" @keyup.enter="Login()">
      <div class="login-username">
        <img class="input-item" src="../../assets/account.png" alt=""/>
        <input type="text" class="logintxt" placeholder="用户名" v-model="UserId" @focus="focusInput('UserId')">
        <div class="delete" v-if="accountDelete" @click="deleteInput('UserId')">
          <!--<i class="fa fa-close"></i>-->
        </div>
      </div>
      <div class="login-pwd">
        <img class="input-item" src="../../assets/password.png" alt=""/>
        <input type="password" class="logintxt" placeholder="密码" v-model="password" @focus="focusInput('password')"
               onpaste="return false">
        <div class="delete" v-if="passwordDelete" @click="deleteInput('password')">
          <!--<i class="fa fa-close"></i>-->
        </div>
      </div>
      <div class="remember">
        <div class="rememberPwd">
          <mt-switch v-model="remember">记住用户</mt-switch>
        </div>
        <div class="autoLogin" v-if="!this.is_weixin()">
          <mt-switch v-model="autoLogin">自动登录</mt-switch>
        </div>
      </div>
      <div>
        <button class="loginbut able-login"
                @click="Login()" v-if="isValid()">登录
        </button>
        <button class="loginbut disable-login"
                v-if="!isValid()" disabled="">登录
        </button>
      </div>
    </div>

    <!--登陆错误提示-->
    <div class="error-alert" v-if="errorAlertShow">
      {{errorAlertContent}}
    </div>

    <!--版本更新弹窗显示-->
    <mt-popup
      class="version-pop"
      v-model="popupVisible"
      popup-transition="popup-fade"
      :closeOnClickModal="false">
      <div class="update-title">提示</div>
      <div class="update-content">有新版本更新--v{{versionInfo.Version}}</div>
      <!--强制更新-->
      <div class="update-force" v-if="versionInfo.ForceUpdate == 'Y'">
        <a :href="versionInfo.AndroidDownUrl" v-if="this.isAndroidMachine()">
          <div>更新</div>
        </a>
        <a :href="versionInfo.IOSDownUrl" v-if="this.isiOSMachine()">
          <div>更新</div>
        </a>
      </div>
      <!--非强制更新-->
      <div class="update-cancel" v-else>
        <div class="update-button">
          <a :href="versionInfo.AndroidDownUrl" v-if="this.isAndroidMachine()">
            <div>更新</div>
          </a>
          <a :href="versionInfo.IOSDownUrl" v-if="this.isiOSMachine()">
            <div>更新</div>
          </a>
        </div>
        <div class="cancel-button" @click="cancelUpdate()">
          取消
        </div>
      </div>
    </mt-popup>
  </div>
</template>
<script>
  import interfaceData from '../../service/interfaceData.js'
  import interfaceService from '../../service/interfaceService.js'
  import config from '../../config/config.json'
  import axios from 'axios'

  export default {
    name: 'login',
    data() {
      return {
        UserId: '',
        password: '',
        remember: true,
        disabled: false,
        autoLogin: false,
        paramsLogin: {},
        accountDelete: false,
        passwordDelete: false,
        errorAlertShow: false,
        errorAlertContent: '',
        popupVisible: false,
        versionInfo: {}
      }
    },
    methods: {
      //聚焦设置一键删除是否显示
      focusInput(item) {
        if (item === 'UserId') {
          this.accountDelete = (this.UserId === "") ? false : true;
        } else if (item === 'password') {
          this.passwordDelete = (this.password === "") ? false : true;
        }
      },
      //删除设置用户名或密码为空
      deleteInput(item) {
        if (item === 'UserId') {
          this.UserId = '';
        } else if (item === 'password') {
          this.password = '';
        }
      },
      //检查账号密码是否为空
      checks(item) {
        if (item === 'UserId') {
          this.accountDelete = (this.UserId === "") ? false : true;
        } else if (item === 'password') {
          this.passwordDelete = (this.password === "") ? false : true;
        }
      },
      //保存用户名和密码
      saveLoginInfo(loginInfo) {
        interfaceService.setCookie("UserId", loginInfo.UserId.value, (loginInfo.UserId.maxage) / (60 * 60 * 24));
        interfaceService.setCookie("RememberMe", loginInfo.rememberme, 14);
        interfaceService.setCookie("SeriesId", loginInfo.SeriesId.value, (loginInfo.SeriesId.maxage) / (60 * 60 * 24));
        interfaceService.setCookie("Token", loginInfo.Token.value, (loginInfo.Token.maxage) / (60 * 60 * 24));

        window.localStorage.setItem("UserId", loginInfo.UserId.value);
        window.localStorage.setItem("RememberMe", loginInfo.rememberme);
        window.localStorage.setItem("SeriesId", loginInfo.SeriesId.value);
        window.localStorage.setItem("Token", loginInfo.Token.value);
      },
      //登陆
      Login() {
        if (this.isValid()) {
          this.paramsLogin = {
            "UserId": this.UserId,
            "UserPwd": this.password,
            "RememberMe": this.autoLogin ? 'Y' : 'N',
            "LgnType": "Password",
            "DeviceId": interfaceService.getCookie("uuid") ? interfaceService.getCookie("uuid") : "123321",
            "Version": config.currentVersion
          };
          this.getLoginInfo(this.paramsLogin);
        }
      },
      //获取最新版本信息
      getLatestVersion() {
        let that = this;
        interfaceService.getLatestVersion()
          .then(function (response) {
            that.hideIndicator();
            interfaceService.setVersion(response);//保存版本信息
            that.versionInfo = response;
            //如果有更新，提示用户更新，不允许登陆
            if ((response.Version > config.currentVersion) && !interfaceService.cancelUpdateFlag && !that.is_weixin() && !that.is_pc()) {
              that.popupVisible = true;
            }
          }, function (error) {
            that.hideIndicator();
            // that.showAlert("获取最新版本号失败！");
          });
      },
      //获取登陆信息
      getLoginInfo(loginParams) {
        let that = this;
        that.showIndicator("请稍等...");
        axios({
          method: 'post',
          withCredentials: true,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          url: config.baseURL + interfaceData.loginApi,
          //发送请求前，将request payload转换成form data
          transformRequest: [function (obj) {
            let str = [];
            for (let p in obj)
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
          }],
          data: loginParams
        }).then(function (response) {
          that.hideIndicator();
          if (response.data.code === '0' || response.data.code === '1') {
            if (response.data.code === '0') {
              //保存用户信息
              that.saveLoginInfo(response.data.result);
            }
            //是否记住用户
            if (that.remember) {
              interfaceService.setCookie("rememberUser", "true", 14);
              window.localStorage.setItem("rememberUser", "true");
            } else {
              interfaceService.setCookie("rememberUser", "false", 14);
              window.localStorage.setItem("rememberUser", "false");
            }
            that.$router.push({path: '/tab/home'});
            // that.getPersonInfo(response.data.result.UserId.value);//查询登陆人信息并保存
          } else {
            that.hideIndicator();
            that.errorAlertShow = true;
            that.errorAlertContent = response.data.desc;
          }
        })
          .catch(function (error) {
            that.hideIndicator();
            that.showAlert("登陆失败！请检查用户名和密码！");
            that.UserId = '';
            that.password = '';
          });
      },
      //验证用户名和密码是否为空
      isValid() {
        if (this.UserId && this.password) return true;
        else return false
      },

      //取消更新
      cancelUpdate() {
        interfaceService.cancelUpdateFlag = true;
        this.popupVisible = false;
      }
    },
    watch: {
      //监听自动登陆，如果为true，则记住用户名
      autoLogin(newVal, oldVal) {
        if (newVal) {
          this.remember = true;
        }
      },
      //监听记住用户，如果为false，则取消自动登陆
      remember(newVal, oldVal) {
        if (!newVal) {
          this.autoLogin = false;
        }
      },
      //监听用户名变化
      UserId(newVal, oldVal) {
        // if(newVal !== interfaceService.getCookie("UserId")){
        this.accountDelete = (newVal === "") ? false : true;
        // }
      },
      //监听密码变化
      password(newVal, oldVal) {
        this.passwordDelete = (newVal === "") ? false : true;
      },
    },
    activated() {
      this.popupVisible = false;
      this.getLatestVersion();//获取版本信息
      if (!this.$route.query.loginDesc) {
        //登陆错误提示重置
        this.errorAlertShow = false;
        this.errorAlertContent = '';
      } else {
        //自动登陆失败后的提醒固定显示
        this.errorAlertShow = true;
        this.errorAlertContent = this.$route.query.loginDesc;
      }

      if (interfaceService.getCookie("UserId")) {
        if (interfaceService.getCookie("rememberUser") === 'true') {
          this.UserId = interfaceService.getCookie("UserId");
        } else {
          this.UserId = '';
        }
        this.password = '';
        this.remember = true;
        this.autoLogin = false;
      }
    }
  }

</script>

<style lang="scss" scope>
  .login {
    width: 100%;
    height: 100%;
    background: #fff;
    /*background: url(../../assets/backgroundImg.png) fixed center center no-repeat;*/
    /*background-size: 100% 100%;*/
    .login-logo {
      width: 100%;
      padding-top: 50px;
      text-align: center;
    }
    .loginForm {
      margin-top: 40px;
      .login-username {
        height: 42px;
        width: 68%;
        margin-left: 16%;
        border: #DBE0E4 1px solid;
        border-radius: 5px;
        background: #F6F6F5;
      }
      .login-pwd {
        height: 42px;
        border: #DBE0E4 1px solid;
        width: 68%;
        margin-left: 16%;
        margin-top: 10px;
        border-radius: 5px;
        background: #F6F6F5;
      }
      .input-item {
        margin-left: 5px;
        margin-top: 7px;
        width: 28px;
        height: 28px;
        float: left;
      }
      .logintxt {
        margin-top: 6px;
        height: 30px;
        line-height: 30px;
        width: calc(96% - 60px);
        font-size: 14px;
        background-color: transparent;
        margin-left: 4%;
        float: left;
      }
      .delete {
        /*float: right;
        width: 18px;
        height: 18px;
        margin-top: 10px;
        margin-right: 5px;
        text-align: right;
        font-size: 23px;
        color: #cccccc;*/
        margin-right: 7px;
        margin-top: 10px;
        width: 20px;
        height: 20px;
        float: right;
        background: url(../../assets/delete@2x.png);
        background-size: 100%;
        background-color: #ccc;
        border-radius: 50%;
      }
      input {
        border: none !important;
        outline: none; //去除选中时的外边框
      }
      .remember {
        height: 42px;
        width: 68%;
        margin-left: 16%;
        margin-top: 25px;
        .rememberPwd {
          float: left;
          /*width: ;*/
        }
        .autoLogin {
          float: right;
        }
        .mint-switch-input:checked + .mint-switch-core {
          border-color: #1e8fe1 !important;
          background-color: #1e8fe1 !important;
        }
      }
      .loginbut {
        color: white;
        border: 0;
        border-radius: 10px;
        width: 68%;
        height: 41px;
        margin-left: 16%;
        margin-top: 40px;
        margin-bottom: 30px;
        outline: none;
        font-size: 14px;
      }
      .loginbut:active {
        background: red;
      }
      .able-login {
        background: #1e8fe1;
      }
      .disable-login {
        background-color: #DFE8F4;
      }
      .register {
        height: 44px;
        line-height: 30px;
        color: #8d8d8d;
        width: 100%;
        text-align: center;
        padding-top: 10px;
      }

      .mint-switch-core {
        width: 40px;
        height: 21px;
      }
      .mint-switch-core::before {
        width: 38px;
        height: 19px;
      }
      .mint-switch-core::after {
        width: 19px;
        height: 19px;
      }
    }
    .error-alert {
      height: auto;
      min-height: 30px;
      padding: 10px;
      width: 68%;
      margin-left: 16%;
      background-color: #fff6f6;
      color: #9f3a38;
      box-shadow: 0px 0px 0px 1px #e0b4b4 inset, 0px 0px 0px 0px rgba(0, 0, 0, 0);
    }

    .version-pop {
      width: 80%;
      height: auto;
      min-height: 100px;
      border-radius: 10px;
      text-align: center;
      line-height: 2;
      .update-title {
        font-weight: bold;
        margin: 10px;
        font-size: 16px;
      }
      .update-content {
        color: #888888;
        margin: 10px;
      }
      .update-force {
        border-top: 1px solid #ccc;
        padding: 10px;
        height: 45px;
        a {
          text-decoration: none;
          color: #1e8fe1;
        }
      }
      .update-cancel {
        border-top: 1px solid #ccc;
        padding: 10px;
        height: 45px;
        .update-button {
          float: left;
          width: calc(50% - 10px);
          a {
            text-decoration: none;
            color: #1e8fe1;
          }
        }
        .update-button:active {
          background: #E6E6E6;
        }
        .cancel-button {
          float: right;
          width: calc(50% - 10px);
        }

        .cancel-button:active {
          background: #E6E6E6;
        }
      }
    }
  }


</style>
