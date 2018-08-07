<template>
  <div class="receptionManagerDetails">
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
                  :class="(receptionInfo.caozuo && receptionInfo.caozuo.length>0 || typeFlag=='NotRead')  ? 'haveFootButton-heigth' : 'noFootButton-heigth' ">
      <!--表单区-->
      <div class="procedureRecord" v-if="receptionInfo.details">
        <span><label class="margin-left-5">表单详情区</label></span>
      </div>
      <mt-cell v-for="(item,index) in receptionInfo.details" :key="index" :title="item.label"
               :value="item.vale"></mt-cell>
      <!--审批记录-->
      <process-record :history="history"></process-record>
      <!--附件区-->
      <attachments-area :attachmentsInfo="receptionInfo" :detailsPage="'接待管理'"></attachments-area>
    </body-content>
    <!--审批待办显示底部流转和回退按钮-->
    <foot-button :footButton="receptionInfo.caozuo"
                 :buttonTitle="buttonTitle"
                 :typeFlag="typeFlag"
                 :receiveGuid="params.receiveGuid"
                 :taskId="params.taskId">
    </foot-button>
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

  export default {
    name: 'receptionManagerDetails',
    components: {HeaderSimple, BodyContent, ProcessRecord, AttachmentsArea, FootButton},
    data() {
      return {
        title: '详细信息',
        buttonTitle: '接待管理',
        showAllRecord: false,
        history: [],
        typeFlag: '',
        receptionInfo: {},
        params: {
          'instanceId': '',
          'receiveGuid': '',
          'taskId': ''
        }
      }
    },
    methods: {
      init() {
        this.typeFlag = this.$route.query.typeFlag ? this.$route.query.typeFlag : '';
        this.params.instanceId = this.$route.query.processId ? this.$route.query.processId : '';
        this.params.receiveGuid = this.$route.query.guid ? this.$route.query.guid : '';
        this.params.taskId = this.$route.query.taskId ? this.$route.query.taskId : '';
      },
      goBack() {
        /*this.$router.go(-1);*/
        this.$router.push({path: '/receptionManager', query: {page: 'receptionManagerDetails'}})
      },

      //获取审批流程和表单详情
      getProcessAndDetails(type, params) {
        let that = this;
        that.history = [];
        that.receptionInfo = {};
        that.showIndicator('加载中...');//显示加载提示;
        //同时执行多个请求
        axios.all([
          interfaceService.queryReceptionManagerProcess(params),
          interfaceService.queryReceptionManagerDetail(type, params)
        ])
          .then(axios.spread(function (processResp, detailsResp) {
            that.hideIndicator();
            that.history = processResp;
            that.receptionInfo = detailsResp;
          }), function (error) {
            that.hideIndicator();
            that.showAlert("数据加载失败");
          });
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
            if (that.$route.query.page !== 'toReadList') {
              that.init();
              that.getProcessAndDetails(that.typeFlag, that.params);
            }
          }, function (error) {
            that.hideIndicator();
            that.showAlert("数据加载失败");
          });
      } else {
        if (this.$route.query.page !== 'toReadList') {
          this.init();
          this.getProcessAndDetails(this.typeFlag, this.params);
        }
      }
    }

  }
</script>
<style lang="scss">

  .receptionManagerDetails {
    background: #fff;
    .body-content {
      /* height: calc(100% - 90px);*/
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
/*    .foot-button1 {
      height: 45px;
      position: fixed;
      bottom: 0;
      width: 100%;
      line-height: 45px;
      border-top: 1px solid #ccc;
      background: white;
      .to-next {
        float: left;
        text-align: center;
        width: 50%;
      }
      .back {
        float: right;
        text-align: center;
        width: 50%;
      }
    }
    .foot-button2 {
      height: 45px;
      position: fixed;
      bottom: 0;
      width: 100%;
      line-height: 45px;
      border-top: 1px solid #ccc;
      background: white;
      .confirm {
        text-align: center;
      }
    }*/
  }

</style>
