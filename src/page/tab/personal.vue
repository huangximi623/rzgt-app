<template>
  <div class="personal">
    <header-simple class="list-header">
      <div class="left-button" slot="left"></div>
      <div class="list-title" slot="title">
        {{title}}
      </div>
      <div class="right-button" slot="right"></div>
    </header-simple>
    <body-content class="body-content">
      <div class="person-info" @click="goContactDetails()" v-if="personInfo[0]">
        <mt-cell :title="personInfo[0].name + ' - ' + personInfo[0].label" class="person-name"
                 :label="personInfo[0].theTitle" :value="personInfo[0].deptName">
          <img slot="icon" :src="personInfo[0].picture" :onerror="personImg" width="60" height="auto">
        </mt-cell>
      </div>
<!--      <div v-if="versionInfo" @click="showPopUp()">
        <mt-cell title="当前版本" :value="'v'+versionInfo.Version" is-link></mt-cell>
      </div>-->
      <div v-if="currentVersion" @click="showPopUp()">
        <mt-cell title="当前版本" :value="'v'+currentVersion" is-link></mt-cell>
      </div>
      <mt-cell title="在线升级" is-link @click.native="updateToLatest()" v-if="!this.is_weixin()"></mt-cell>

      <mt-button type="danger" size="large" @click="loginOut()">退出登录</mt-button>
    </body-content>
    <!--版本更新弹窗显示-->
    <mt-popup
      class="version-pop"
      v-model="popupVisible"
      popup-transition="popup-fade"
      :closeOnClickModal="false">
      <div class="update-title">提示</div>
      <div class="update-content">有新版本更新--v{{versionUpdateInfo.Version}}</div>
      <div class="update-cancel">
        <div class="update-button">
          <a :href="versionUpdateInfo.AndroidDownUrl" v-if="this.isAndroidMachine()">
            <div>更新</div>
          </a>
          <a :href="versionUpdateInfo.IOSDownUrl" v-if="this.isiOSMachine()">
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
  import HeaderSimple from '@/components/header/header-simple'
  import BodyContent from '@/components/bodyContent/body-content'
  import interfaceService from '../../service/interfaceService.js'
  import config from '../../config/config.json'

  export default {
    name: 'personal',
    data() {
      return {
        title: '我的',
        popupVisible: false,
        personInfo: {},
        versionInfo: {},
        currentVersion: '',
        versionUpdateInfo: {},
        personImg: 'this.src="' + require('../../assets/main/personal_checked@2x.png') + '"'
      }
    },
    components: {HeaderSimple, BodyContent},
    methods: {
      //显示版本更新信息
      showPopUp() {
        // this.popupVisible = true;//显示版本弹窗
        //跳转至版本更新详情页面
        this.$router.push({path: '/versionUpdateInfo', query: {versionInfo: this.versionInfo}});
      },
      //初始化
      init() {
        this.popupVisible = false;
        this.personInfo = interfaceService.getPersonInfo();
        // this.versionInfo = interfaceService.getVersion();
        this.versionInfo = this.getCurrentVersion();
        this.currentVersion = config.currentVersion;
      },
      //退出登陆
      loginOut() {
        let that = this;
        // that.showIndicator("正在退出...");
/*        interfaceService.LoginOut()
          .then(function (response) {
            that.hideIndicator();
            interfaceService.clearCookie('RememberMe');//清空RememberMe
            interfaceService.clearCookie('SeriesId');//清空SeriesId
            interfaceService.clearCookie('Token');//清空Token

            window.localStorage.removeItem("RememberMe");//清空RememberMe
            window.localStorage.removeItem("SeriesId");//清空SeriesId
            window.localStorage.removeItem("Token");//清空Token

            that.$router.push({path: '/login'});
          }, function (error) {
            that.hideIndicator();
            that.showAlert("退出登陆失败！");
          });*/
        that.hideIndicator();
        interfaceService.clearCookie('RememberMe');//清空RememberMe
        interfaceService.clearCookie('SeriesId');//清空SeriesId
        interfaceService.clearCookie('Token');//清空Token

        window.localStorage.removeItem("RememberMe");//清空RememberMe
        window.localStorage.removeItem("SeriesId");//清空SeriesId
        window.localStorage.removeItem("Token");//清空Token

        that.$router.push({path: '/login'});
      },
      //获取详情
      goContactDetails() {
        this.$router.push({path: '/contactDetails', query: {page: 'personal', item: this.personInfo[0]}})
      },
      updateToLatest() {
        //在线升级
        let that = this;
        that.showIndicator("更新中...");
        interfaceService.getLatestVersion()
          .then(function (response) {
            that.versionUpdateInfo = response;
            //如果有更新，提示用户更新，不允许登陆
            if (response.Version > config.currentVersion && !that.is_pc()) {
              that.hideIndicator();
              that.popupVisible = true;
            } else {
              that.hideIndicator();
              that.showToast("当前为最新版本!");
            }
          }, function (error) {
            that.hideIndicator();
            that.showToast("获取最新版本号失败！");
          });
      },

      //取消更新
      cancelUpdate() {
        interfaceService.cancelUpdateFlag = true;
        this.popupVisible = false;
        this.getCurrentVersion();
      },
      //获取当前版本
      getCurrentVersion() {
        let that = this;
        // that.showIndicator("加载中...");
        interfaceService.getCurrentVersion(config.currentVersion)
          .then(function (response) {
            that.versionInfo = response;
            interfaceService.setVersion(response);//保存版本信息
          }, function (error) {
            that.hideIndicator();
            // that.showToast("获取最新版本号失败！");
            that.versionInfo = interfaceService.getVersion();
          });
      },
    },
    activated() {
      this.init();
    }
  }
</script>
<style lang="scss" scope>
  .personal {
    background: #fff;
    .body-content {
      height: calc(100% - 45px);
      display: block;
      overflow: auto;
      box-sizing: border-box;
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
    .person-info {
      .person-name {
        min-height: 100px;
      }
      .mint-cell-title {
        .mint-cell-text {
          margin-left: 20px;
        }
        .mint-cell-label {
          margin-top: 10px;
        }
      }
      .mint-cell-value {
        position: absolute;
        bottom: 0;
        right: 10px;
      }
    }
  }

  .mint-button {
    width: 95%;
    margin: 20px auto;

    /*    .mint-button-text {
          color: white;
        }*/

  }

</style>
