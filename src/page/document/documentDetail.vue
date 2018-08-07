<template>
  <div class="documentDetail">
    <header-simple class="list-header">
      <div class="left-button" @click="goBack()" slot="left">
        <i class="fa fa-chevron-left"></i>
      </div>
      <div class="list-title" slot="title">
        {{title}}
      </div>
      <div class="right-button" slot="right"></div>
    </header-simple>
    <body-content class="body-content"
                  :class="documentInfo.caozuo && documentInfo.caozuo.length>0  ? 'haveFootButton-heigth' : 'noFootButton-heigth' ">
      <!--表单区-->
      <div class="procedureRecord" v-if="documentInfo.detail">
        <span><label class="margin-left-5">表单详情区</label></span>
      </div>
      <mt-cell v-for="(item,index) in documentInfo.detail" :key="index" :title="item.key" :value="item.value"></mt-cell>
      <!--审批流程-->
      <process-record :history="history"></process-record>
      <!--附件区-->
      <attachments-area :attachmentsInfo="documentInfo" :detailsPage="'公文审批'"></attachments-area>
    </body-content>

    <foot-button :footButton="documentInfo.caozuo" :buttonTitle="buttonTitle" :taskId="paramsDetail.taskId"
                 :fileGuid="paramsDetail.fileGuid"></foot-button>

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
    name: 'documentDetail',
    data() {
      return {
        title: '详细信息',
        buttonTitle: '公文审批',
        documentInfo: {},
        history: [],
        paramsDetail: {
          "taskId": "",
          "fileGuid": "",
          "processId": ""
        }
      }
    },
    components: {HeaderSimple, BodyContent, ProcessRecord, AttachmentsArea, FootButton},
    methods: {
      init() {
        /*  this.documentInfo = this.$route.query.documentInfo;*/
        this.paramsDetail.processId = this.$route.query.processId ? this.$route.query.processId : '';
        this.paramsDetail.taskId = this.$route.query.taskId ? this.$route.query.taskId : '';
        this.paramsDetail.fileGuid = this.$route.query.fileGuid ? this.$route.query.fileGuid : '';
      },
      goBack() {
        this.$router.push({path: '/documents', query: {page: 'documentDetail'}})
      },

      //获取审批流程和表单详情
      getProcessAndDetails(type, params) {
        let that = this;
        that.history = [];
        that.documentInfo = {};
        that.showIndicator('加载中...');//显示加载提示;
        //办结只有表单没有审批流程
        if (type === 'over') {
          interfaceService.queryDocumentDetails(params).then(function (response) {
            that.hideIndicator();
            that.documentInfo = response;
          }, function (error) {
            that.hideIndicator();
            that.showAlert("数据加载失败");
          })
        } else {
          //同时执行多个请求
          axios.all([
            interfaceService.queryDocumentProcess(params),
            interfaceService.queryDocumentDetails(params)
          ])
            .then(axios.spread(function (processResp, detailsResp) {
              that.hideIndicator();
              that.history = processResp;
              that.documentInfo = detailsResp;
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
              that.getProcessAndDetails(that.$route.query.type, that.paramsDetail);
            }
          }, function (error) {
            that.hideIndicator();
            that.showAlert("数据加载失败");
          });
      } else {
        if (this.$route.query.page !== 'toReadList') {
          this.init();
          this.getProcessAndDetails(this.$route.query.type, this.paramsDetail);
        }
      }
    },
    /*mounted() {
      this.init();
    }*/
  }
</script>
<style lang="scss" scoped="">

  .documentDetail {
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
  }

</style>
