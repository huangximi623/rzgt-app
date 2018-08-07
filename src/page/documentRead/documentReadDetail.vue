<template>
  <div class="documentReadDetail">
    <header-simple class="list-header">
      <div class="left-button" @click="goBack()" slot="left">
        <i class="fa fa-chevron-left"></i>
      </div>
      <div class="list-title" slot="title">
        {{title}}
      </div>
      <div class="right-button" slot="right"></div>
    </header-simple>
    <body-content class="body-content">
      <!--表单区-->
      <div class="procedureRecord" v-if="documentInfo.detail">
        <span><label class="margin-left-5">表单详情区</label></span>
      </div>
      <mt-cell v-for="(item,index) in documentInfo.detail" :key="index" :title="item.key" :value="item.value"></mt-cell>
      <!--审批流程-->
      <process-record :history="history"></process-record>
      <!--附件区-->
      <attachments-area :attachmentsInfo="documentInfo" :detailsPage="'公文阅知'"></attachments-area>
    </body-content>

  </div>
</template>

<script>
  import HeaderSimple from '@/components/header/header-simple'
  import BodyContent from "@/components/bodyContent/body-content"
  import ProcessRecord from '@/components/processRecord/processRecord'
  import AttachmentsArea from '@/components/attachmentsArea/attachments-area'
  import interfaceService from '../../service/interfaceService.js'
  import axios from 'axios'

  export default {
    name: 'documentReadDetail',
    data() {
      return {
        title: '详细信息',
        documentInfo: {},
        showAllRecord: false,
        history: [],
        paramsDetail: {
          "fileGuid": "",
          "yueZhi": "1",
          "taskId": ""
        }
      }
    },
    components: {HeaderSimple, BodyContent, ProcessRecord, AttachmentsArea},
    methods: {
      init() {
        this.paramsDetail.fileGuid = this.$route.query.fileGuid ? this.$route.query.fileGuid : '';
      },
      goBack() {
        this.$router.push({path: '/documentRead', query: {page: 'documentReadDetail'}})
      },

      //获取审批流程和表单详情
      getDocumentReadDetails(params) {
        let that = this;
        that.documentInfo = {};
        that.showIndicator('加载中...');//显示加载提示;

        interfaceService.queryDocumentReadDetails(params).then(function (response) {
          that.hideIndicator();
          that.documentInfo = response;
        }, function (error) {
          that.hideIndicator();
          that.showAlert("数据加载失败");
        })

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
            that.init();
            that.getDocumentReadDetails(that.paramsDetail);
          }, function (error) {
            that.hideIndicator();
            that.showAlert("数据加载失败");
          });
      } else {
        this.init();
        this.getDocumentReadDetails(this.paramsDetail);
      }
    },
    /*mounted() {
      this.init();
    }*/

  }
</script>
<style lang="scss" scoped="">

  .documentReadDetail {
    background: #fff;
    .body-content {
      height: calc(100% - 45px);
      display: block;
      overflow: auto;
      box-sizing: border-box;
      /*margin-bottom: 45px;*/
    }

  }

</style>
