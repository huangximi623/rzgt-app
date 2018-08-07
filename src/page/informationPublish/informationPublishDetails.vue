<template>
  <div class="informationPublishDetails">
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
      <div v-if="showFlag" class="imgHeight">
        <img src="../../assets/noData-white.png" style="width: 55%;"/>
      </div>
      <div v-else>
        <div class="information">
          <h3 class="information-title" v-if="informationPublishDetails.detail"
              v-html="informationPublishDetails.detail.title"></h3>
          <div class="information-content" v-if="informationPublishDetails.detail"
               v-html="informationPublishDetails.detail.content"></div>
          <div class="information-source">
            <div class="information-author" v-if="informationPublishDetails.detail"
                 v-html="informationPublishDetails.detail.author"></div>
            <div class="information-pubDate" v-if="informationPublishDetails.detail"
                 v-html="informationPublishDetails.detail.pubDate"></div>
          </div>
        </div>
        <!--附件区-->
        <attachments-area :attachmentsInfo="informationPublishDetails" :detailsPage="'信息发布中心'"
                          :siteListId="siteListId"></attachments-area>
      </div>
    </body-content>

  </div>
</template>

<script>
  import HeaderSimple from '@/components/header/header-simple'
  import BodyContent from "@/components/bodyContent/body-content"
  import AttachmentsArea from '@/components/attachmentsArea/attachments-area'
  import interfaceService from '../../service/interfaceService.js'
  import $ from 'jquery'

  export default {
    name: 'informationPublishDetails',
    data() {
      return {
        title: '详细信息',
        showAllRecord: true,
        informationPublishDetails: {},
        params: {
          "docid": ""
        },
        showFlag: false,
        siteListId: ''
      }
    },
    components: {HeaderSimple, BodyContent, AttachmentsArea},
    methods: {
      init() {
        this.params.docid = this.$route.query.docid;
        this.siteListId = this.$route.query.siteListId;
      },
      goBack() {
        if (this.$route.query.page === 'home') {
          this.$router.push({path: '/tab/home'})
        } else {
          this.$router.push({
            path: '/informationPublishDetailList',
            query: {page: this.$route.query.page, page1: 'informationPublishDetails'}
          })
        }
      },
      getNewsContentInfo(params) {
        let that = this;
        that.informationPublishDetails = {};
        that.showIndicator("加载中...");
        interfaceService.queryNewsContentInfo(params)
          .then(function (response) {
            that.hideIndicator();
            that.informationPublishDetails = response;
            if (response.length === 0) {
              that.showFlag = true;
            }
          }, function (error) {
            that.showFlag = true;
            that.hideIndicator();
            that.showAlert("数据加载失败");
          })
      }
    },
    beforeUpdate() {
      $(function () {
        $("img").css({"width": "100%", "height": "auto"});
        $("p").css({"width": "100%", "white-space": "pre-wrap", "word-wrap": "break-word"});
      });
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
            that.showFlag = false;
            that.getNewsContentInfo(that.params);
          }, function (error) {
            that.hideIndicator();
            that.showAlert("数据加载失败");
          });
      } else {
        this.init();
        this.showFlag = false;
        this.getNewsContentInfo(this.params);
      }
    }
  }
</script>
<style lang="scss" scoped="">

  .informationPublishDetails {
    background: #fff;
    .body-content {
      height: calc(100% - 45px);
      display: block;
      overflow: auto;
      box-sizing: border-box;
      /*margin-bottom: 45px;*/
      .information {
        margin: 5px 0;
        padding: 5px;
      }
      .information-title {
        text-align: center;
        margin-bottom: 10px;
      }
      .information-content {
        padding: 0 5px;
        img {
          width: 100% !important;
          height: 300px;
        }
      }
      .information-source {
        padding: 10px 5px;
        margin-bottom: 10px;
      }
      .information-pubDate {
        float: right;
      }
    }
  }

</style>
