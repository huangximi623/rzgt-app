<template>
  <div class="meetingManagerDetails">
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
                  :class="(this.$route.query.id=='4' || (meetingInfo.caozuo && meetingInfo.caozuo.length>0)) ? 'haveFootButton-heigth' : 'noFootButton-heigth' ">
      <!--表单区-->
      <div class="procedureRecord" v-if="meetingInfo.detail">
        <span><label class="margin-left-5">表单详情区</label></span>
      </div>
      <mt-cell v-for="(item,index) in meetingInfo.detail" :key="index" :title="item.label" :value="item.vale"></mt-cell>
      <!--审批记录-->
      <process-record :history="history"></process-record>
      <!--附件区-->
      <attachments-area :attachmentsInfo="meetingInfo" :detailsPage="'会议管理'"></attachments-area>
    </body-content>
    <div class="foot-button" v-if="this.$route.query.id=='4'">
      <div class="btn-active join-in" @click="joinIn()">参加</div>
      <div class="btn-active no-join" @click="noJoin()">不参加</div>
    </div>
    <!--审批待办显示底部流转和回退按钮-->
    <foot-button v-if="this.$route.query.id!=='4'" :footButton="meetingInfo.caozuo" :buttonTitle="buttonTitle"
                 :taskId="paramsDetail.taskId" :fileGuid="paramsDetail.rowguid"></foot-button>
  </div>
</template>

<script>
  import HeaderSimple from '@/components/header/header-simple'
  import BodyContent from "@/components/bodyContent/body-content"
  import ProcessRecord from '@/components/processRecord/processRecord'
  import AttachmentsArea from '@/components/attachmentsArea/attachments-area'
  import FootButton from '@/components/footer/footButton'
  import interfaceService from '../../service/interfaceService.js'
  import axios from 'axios'
  import {MessageBox} from 'mint-ui';

  export default {
    name: 'meetingManagerDetails',
    components: {HeaderSimple, BodyContent, ProcessRecord, AttachmentsArea, FootButton},
    data() {
      return {
        title: '详细信息',
        buttonTitle: '会议管理',
        showAllRecord: false,
        meetingInfo: {},
        history: [],
        paramsDetail: {
          "rowguid": "",
          "taskId": "",
          "processId": ""
        },
        paramsJoinIn: {
          "exp1": "",
          "exp3": "",
          "exp6": "",
          "meetingID": "",
          "userId": ""
        }
      }
    },
    methods: {
      joinIn() {
        let that = this;
        delete that.paramsJoinIn.exp6;
        that.paramsJoinIn.exp1 = '1';
        that.showIndicator('加载中...');
        interfaceService.queryConfirmMeeting(that.paramsJoinIn).then(function (response) {
          that.hideIndicator();
          that.$router.push({path: '/meetingManager'});
        }, function (error) {
          that.hideIndicator();
          that.showAlert("数据加载失败");
        })
      },
      noJoin() {
        let that = this;
        MessageBox.prompt("请输入对议会的意见信息").then(({value, action}) => {
          if (action === 'confirm') {
            if (!value) {
              that.showAlert("意见信息不能为空！");
            } else {
              that.paramsJoinIn.exp1 = '2';
              that.paramsJoinIn.exp6 = value;
              that.showIndicator('加载中...');
              interfaceService.queryConfirmMeeting(that.paramsJoinIn).then(function (response) {
                that.hideIndicator();
                that.$router.push({path: '/meetingManager'});
              }, function (error) {
                that.hideIndicator();
                that.showAlert("数据加载失败");
              })
            }
          }
        })
      },
      init() {
        this.paramsDetail.processId = this.$route.query.processId ? this.$route.query.processId : '';
        this.paramsDetail.rowguid = this.$route.query.guid ? this.$route.query.guid : '';
        this.paramsDetail.taskId = this.$route.query.taskId ? this.$route.query.taskId : '';

        this.paramsJoinIn.exp3 = this.$route.query.exp3 ? this.$route.query.exp3 : '';
        this.paramsJoinIn.meetingID = this.$route.query.guid ? this.$route.query.guid : '';
        this.paramsJoinIn.userId = interfaceService.getCookie("Token");
      },
      goBack() {
        this.$router.push({path: '/meetingManager', query: {page: 'meetingManagerDetails'}})
      },
      //获取审批流程和表单详情
      getProcessAndDetails(id, params) {
        let that = this;
        that.history = [];
        that.meetingInfo = {};
        that.showIndicator('加载中...');//显示加载提示;
        if (id === '4' || id === '5') {
          that.history = [];
          interfaceService.queryMeetingManagerDetail(id, params).then(function (response) {
            that.hideIndicator();
            that.meetingInfo = response;
          }, function (error) {
            that.hideIndicator();
            that.showAlert("数据加载失败");
          })
        } else {
          //同时执行多个请求
          axios.all([
            interfaceService.queryMeetingManagerProcess(params),
            interfaceService.queryMeetingManagerDetail(id, params)
          ])
            .then(axios.spread(function (processResp, detailsResp) {
              that.hideIndicator();
              that.history = processResp;
              that.meetingInfo = detailsResp;
            }), function (error) {
              that.hideIndicator();
              that.showAlert("数据加载失败");
            });
        }
      }
    },
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
            if (that.$route.query.page !== 'toReadList') {
              that.init();
              that.getProcessAndDetails(that.$route.query.id, that.paramsDetail);
            }
          }, function (error) {
            that.hideIndicator();
            that.showAlert("数据加载失败");
          });
      } else {
        if (this.$route.query.page !== 'toReadList') {
          this.init();
          this.getProcessAndDetails(this.$route.query.id, this.paramsDetail);
        }
      }
    },
    /*mounted() {
      this.init();
    }*/
  }
</script>
<style lang="scss">

  .meetingManagerDetails {
    background: #fff;
    .body-content {
      display: block;
      overflow: auto;
      box-sizing: border-box;
      /*margin-bottom: 45px;*/
    }

    .haveFootButton-heigth {
      height: calc(100% - 90px);
    }

    .noFootButton-heigth {
      height: calc(100% - 45px);
    }

    .foot-button {
      height: 45px;
      position: fixed;
      bottom: 0;
      width: 100%;
      line-height: 45px;
      border-top: 1px solid #ccc;
      z-index: 999;
      background: white;
      .join-in {
        float: left;
        text-align: center;
        width: 50%;
      }
      .no-join {
        float: right;
        text-align: center;
        width: 50%;
      }
    }
  }

</style>
