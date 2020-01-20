<template>
  <div class="taskManagementDetails">
    <header-simple class="list-header">
      <div class="left-button" @click="goBack()" slot="left">
        <i class="fa fa-chevron-left"></i>
      </div>
      <div class="list-title" slot="title">
        {{title}}
      </div>
      <div class="right-button" slot="right">
      </div>
    </header-simple>
    <body-content class="body-content"
                  :class="$route.query.type === 'todo' ? 'haveFootButton-heigth' : 'noFootButton-heigth' ">
      <div v-if="taskInfo.details">
        <mt-cell v-for="(item,index) in taskInfo.details" :key="index" :title="item.key" :value="item.value"></mt-cell>
      </div>

      <div v-for="(item,index) in taskInfo.jobListInfo" class="task-list">
        <div class="reception-list">
          <a class="reception-list-item">
            <div class="reception-list-header">
              <div class="reception-list-department">{{item.doUsername}}</div>
              <div class="reception-list-name">{{item.doDeptname}}</div>
            </div>
            <div class="reception-list-content">
              <div>
                <div class="list-item">
                  <div class="item-content">
                    {{item.jobNum}}
                    <!-- <span class="item-content-c">{{customerType}}</span>-->
                  </div>
                </div>
                <div class="reception-list-select">
                  <i class=""></i>
                  <!--<img src="../../assets/tab/select.png"/>-->
                </div>
              </div>
            </div>
            <div class="reception-list-footer">
              <div class="reception-list-level">{{item.jobSource}}</div>
              <div class="reception-list-time">{{item.state}}</div>
            </div>
          </a>
        </div>
        <div class="taskDetailFa" v-if="index < taskInfo.jobListInfo.length-1">
          <i class="fa fa-angle-double-down"></i>
        </div>
      </div>

      <!--附件区-->
      <attachments-area :attachmentsInfo="taskInfo" :detailsPage="'任务管理'"></attachments-area>
    </body-content>

    <div v-if="$route.query.type === 'todo'">
      <ul class="footer-button">
        <li @click="toFeedback()" class="btn-active">
          <span>反馈</span>
        </li>
      </ul>
    </div>

    <mt-popup class="feedback-popup" v-model="popupVisible" position="top">
      <header-simple class="list-header">
        <div class="left-button" slot="left">
        </div>
        <div class="list-title" slot="title">
          反馈进度
        </div>
        <div class="right-button" slot="right">
        </div>
      </header-simple>
      <input placeholder="反馈进度" v-model="feedbackProgress"/>
      <input placeholder="当期达成率" v-model="currentProcessRate"/>
      <textarea rows="5" placeholder="反馈意见" v-model="feedbackMessage"></textarea>
      <mt-button class="submit-btn" type="primary" size="large" @click="btn_submit()">提交</mt-button>
    </mt-popup>


  </div>
</template>

<script>
  import HeaderSimple from '@/components/header/header-simple'
  import BodyContent from "@/components/bodyContent/body-content"
  import AttachmentsArea from '@/components/attachmentsArea/attachments-area'
  import interfaceService from '../../service/interfaceService.js'

  export default {
    name: 'taskManagementDetails',
    data() {
      return {
        title: '详细信息',
        taskInfo: {},
        params: {
          "guid": ""
        },
        popupVisible: false,
        feedbackProgress: '',
        currentProcessRate: '',
        feedbackMessage: '',
        paramsFeedback: {
          "detail": "",
          "finishTime": "",
          "guid": "",
          "jobMainGuid": "",
          "jobdetailGuid": "",
          "process": "",
          "processRate": "",
          "userId": "",
          "userName": ""
        },
        personInfo: {}
      }
    },
    components: {HeaderSimple, BodyContent, AttachmentsArea},
    methods: {
      init() {
        this.params.guid = this.$route.query.guid ? this.$route.query.guid : '';
        this.personInfo = interfaceService.getPersonInfo();
      },
      goBack() {
        this.$router.push({path: '/taskManagement', query: {page: 'taskManagementDetail'}})
      },
      //获取任务管理详情
      getTaskManagementDetail(type, params) {
        let that = this;
        that.taskInfo = {};
        this.showIndicator('加载中...');
        interfaceService.queryTaskManagementDetail(type, params)
          .then(function (response) {
            that.hideIndicator();
            that.taskInfo = response;
          }, function (error) {
            that.hideIndicator();
            that.showAlert("数据加载失败");
          });
      },
      //任务反馈
      getTaskManagementFeedback(params) {
        let that = this;
        that.showIndicator('加载中...');
        interfaceService.queryJobManageConfirmJBApi(params)
          .then(function (response) {
            that.hideIndicator();
            that.popupVisible = false;
            that.showAlertAndUrl(response.msg, '/taskManagement');
          }, function (error) {
            that.hideIndicator();
            that.showAlert("数据加载失败");
          });
      },
      toFeedback() {
        this.feedbackMessage = '';
        this.feedbackProgress = '';
        this.currentProcessRate = '';
        this.popupVisible = true;
      },
      btn_submit() {
        if (this.feedbackMessage === '' || this.feedbackProgress === '') {
          this.showAlert("反馈进度和反馈意见必填！");
        } else {
          let reg = /^\d*$/;
          if( !reg.test(this.feedbackProgress)){
            this.feedbackProgress = '';
            this.showAlert('反馈进度只能输入数字！')
          }else{
            if (Number(this.feedbackProgress) > 100) {
              this.feedbackProgress = '';
              this.showAlert("反馈进度不可以大于100！");
            } else if (Number(this.feedbackProgress) <= Number(this.taskInfo.process)) {
              this.feedbackProgress = '';
              this.showAlert("反馈进度必须大于当前进度:" + this.taskInfo.process + "% ！");
            } else {
              this.paramsFeedback.detail = this.feedbackMessage;
              this.paramsFeedback.finishTime = this.taskInfo.finishTime;
              this.paramsFeedback.guid = this.$route.query.guid ? this.$route.query.guid : '';
              this.paramsFeedback.jobMainGuid = this.taskInfo.jobMainGuid;
              this.paramsFeedback.jobdetailGuid = this.taskInfo.jobdetailGuid;
              this.paramsFeedback.process = this.feedbackProgress;
              this.paramsFeedback.processRate = this.currentProcessRate;
              this.paramsFeedback.userId = interfaceService.getCookie("Token");
              this.paramsFeedback.userName = this.personInfo[0].name;
              this.getTaskManagementFeedback(this.paramsFeedback);
            }
          }
        }
      }
    },
    /*mounted() {
      this.init();
    },*/
    activated() {
      //微信登陆
      if (this.is_weixin()) {
        let that = this;
        that.showIndicator('加载中...');//显示加载提示;
        interfaceService.weChatLogin({"LgnType": "WeChat"})
          .then(function (response) {
            that.hideIndicator();
            //微信登陆，code为2时，更新UserId和Token;为1时,使用原有UserId和Token
            if (response.code === '2') {
              interfaceService.setCookie("UserId", response.result.UserId.value, (response.result.UserId.maxage) / (60 * 60 * 24));
              interfaceService.setCookie("Token", response.result.Token.value, (response.result.Token.maxage) / (60 * 60 * 24));
            }
            that.init();
            that.getTaskManagementDetail(that.$route.query.type, that.params);
          }, function (error) {
            that.hideIndicator();
            that.showAlert("数据加载失败");
          });
      } else {
        this.init();
        this.getTaskManagementDetail(this.$route.query.type, this.params);
      }
    }
  }
</script>
<style lang="scss">

  .taskManagementDetails {
    background: #fff;
    .body-content {
      display: block;
      overflow: auto;
      box-sizing: border-box;
    }

    .haveFootButton-heigth {
      height: calc(100% - 90px);
    }

    .noFootButton-heigth {
      height: calc(100% - 45px);
    }

    .task-list {
      position: relative;
    }
    .reception-list {
      font-size: 10px;
      position: relative;
      background: white;
      /*      margin-top: 10px;
            margin-left: 18px;
            margin-right: 5px;*/
      margin: 10px 5px 10px 5px;
      border-bottom-right-radius: 25px;
      box-shadow: 0px 0px 4px #D2D2D2;

      .reception-list-header {
        /*margin-left: 45px;*/
        height: 40px;
        line-height: 40px;
        border-bottom: 2px dotted #D2D2D2;
        color: #1e8fe1;

        .reception-list-department {
          float: left;
          margin-left: 10px;
        }

        .reception-list-name {
          float: right;
          margin-right: 25px;
        }

      }
      .reception-list-content {
        padding: 12px;

        .item-content {
          /*margin: 5px 20px;
          height: 30px;
          line-height: 30px;*/
          position: relative;
          width: 90%;

          .item-content-t {
            /*display: inline-block;*/
            height: 30px;
            width: 100px;
            color: #333333;
            position: absolute;
            left: 5%;
            text-align: left;
          }

          .item-content-c {
            /*display: inline-block;*/
            width: 150px;
            color: #999999;
            right: 10%;
            position: absolute;
            text-align: right;
            right: 0;
          }

        }
        .right-arrow {
          position: absolute;
          display: block;
          font-size: 20px;
          text-align: center;
          color: #ffc900;
          width: 20px;
          height: 20px;
          line-height: 20px;
          border-radius: 50%;
          top: calc(50% - 10px);
          right: 15px;
          -moz-box-shadow: -1px 1px 1px #888888; /* 老的 Firefox */
          box-shadow: -1px 1px 1px #888888;
        }

        .reception-list-select {

          img {
            float: right;
            width: 28px;
            height: 28px;
          }

        }
      }
      .reception-list-footer {
        /*margin-left: 45px;*/
        height: 40px;
        line-height: 40px;
        border-top: 2px dotted #D2D2D2;
        color: #1e8fe1;

        .reception-list-level {
          float: left;
          margin-left: 10px;
        }

        .reception-list-time {
          float: right;
          margin-right: 25px;
        }

      }

      .reception-list-item {
        display: block;
        margin-bottom: 30px;

        &
        .activated {
          background: #f8f8f8;
        }

      }

      &
      .item {
        overflow: visible;
      }

      .item-content {
        overflow: visible;
        border-bottom-right-radius: 25px;
        padding: 0px;
        border: none;
      }

      .item-options .button {
        border-bottom-right-radius: 25px;
      }

      .color-title {
        color: #1e8fe1;
      }

      .color-type {
        font-weight: bold;
        font-size: 14px;
        color: #4A4A4A;
      }

      .color-content {
        font-size: 12px;
        color: #4A4A4A;
        overflow: hidden;
        white-space: nowrap;
        white-space: pre-wrap;
      }

      .no-padding {
        padding: 0;
        margin: 0;
      }

      .reception-list-logo {
        height: 50px;
        width: 50px;
        border-radius: 25px;
        padding: 4px;
        background: white;
        position: absolute;
        top: -5px;
        left: -12px;

        img {
          height: 42px;
          width: 42px;
          border-radius: 21px;
        }

        .reception-icon {
          color: #1e8fe1;
          line-height: 40px;
        }

      }
    }
    .taskDetailFa {
      position: absolute;
      left: 47%;
      bottom: -14px;
      height: 20px;
      font-size: 30px;
      z-index: 2;
    }

    .footer-button {
      height: 45px;
      position: fixed;
      bottom: 0;
      width: 100%;
      background-color: white;
      z-index: 999;
      text-align: center;
      line-height: 45px;
      border-top: 1px solid #eeeeee;
    }

    .feedback-popup {
      width: 100%;
      z-index: 999;
      /*padding: 10px 5px;*/
      /*top: 45px !important;*/
      .mint-popup {
        top: auto !important;
        width: 100%;
      }
      input, textarea {
        border-radius: 4px;
        box-sizing: border-box;
        display: block;
        font-size: 12px;
        padding: 10px;
        overflow: hidden;
        position: relative;
        width: 95%;
        margin: 10px auto 10px auto;
        outline: none;
        border-color: #1e8fe1;
      }
      .submit-btn {
        margin: 10px 10px !important;
        width: calc(100% - 20px) !important;
      }
    }

  }

</style>
