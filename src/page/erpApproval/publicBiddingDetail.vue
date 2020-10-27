<template>
  <div class="publicBiddingDetail">
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
                  :class="administrativeInfo.caozuo && administrativeInfo.caozuo.length>0 ? 'haveFootButton-heigth' : 'noFootButton-heigth' ">
      <!--表单区-->
      <div class="procedureRecord" v-if="administrativeInfo.detail">
        <span><label class="margin-left-5">表单详情区</label></span>
      </div>
      <mt-cell v-for="(item,index) in administrativeInfo.detail" :key="index" :title="item.key"
                :value="item.value.replace(/<br>/g,'')"></mt-cell>

      <div v-if="administrativeInfo.detailZB" :class="administrativeInfo.detailZB.length>0?'detailZB':''">
        <mt-cell v-for="(item,index) in administrativeInfo.detailZB" :key="index"
                 :title="item.key"
                 :value="item.value"></mt-cell>
      </div>

      <process-record :history="history"></process-record>
      <!--附件区-->
      <attachments-area :attachmentsInfo="administrativeInfo" :detailsPage="'行政审批'"></attachments-area>
    </body-content>

    <foot-button :footButton="administrativeInfo.caozuo" :buttonTitle="buttonTitle"
                 :taskId="paramsDetail.taskId"></foot-button>

  </div>
</template>

<script>
  import HeaderSimple from '@/components/header/header-simple'
  import BodyContent from "@/components/bodyContent/body-content"
  import AttachmentsArea from '@/components/attachmentsArea/attachments-area'
  import FootButton from '@/components/footer/footButton'
  import ProcessRecord from '@/components/processRecord/processRecord'
  import interfaceService from '../../service/interfaceService.js'
  import axios from 'axios'

  export default {
    name: 'publicBiddingDetail',
    data() {
      return {
        title: '详细信息',
        buttonTitle: '招采签核',
        showAllRecord: false,
        administrativeInfo: {
          caozuo: []
        },
        history: [],
        paramsDetail: {
          "processId": "",
          "taskId": ""
        }
      }
    },
    components: {HeaderSimple, BodyContent, ProcessRecord, AttachmentsArea, FootButton},
    methods: {
      goBack() {
        this.$router.push({path: '/publicBidding', query: {page: 'publicBiddingDetail'}})
      },
      init() {
        this.paramsDetail.processId = this.$route.query.processId ? this.$route.query.processId : '';
        this.paramsDetail.taskId = this.$route.query.taskId ? this.$route.query.taskId : '';
      },

      //获取审批流程和表单详情
      getProcessAndDetails(type, params) {
        let that = this;
        that.history = [];
        that.administrativeInfo = {
          caozuo: []
        };
        that.showIndicator('加载中...');//显示加载提示;
        //同时执行多个请求
        axios.all([
          interfaceService.queryAdminProcess(params),
          interfaceService.queryAdminDetails(type, params)
        ])
          .then(axios.spread(function (processResp, detailsResp) {
            that.hideIndicator();
            that.history = processResp;
            that.administrativeInfo = detailsResp;
          }), function (error) {
            that.hideIndicator();
            that.showAlert("数据加载失败");
          });
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
    }

  }
</script>
<style lang="scss">

  .publicBiddingDetail {
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
  }

</style>
