<template>
  <div class="documentCenterDetails">
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
      <mt-cell title="文档标题" :value="informationPublishDetails.title"></mt-cell>
      <mt-cell title="发布人" :value="informationPublishDetails.publishername"></mt-cell>
      <mt-cell title="发布时间" :value="informationPublishDetails.publishdate"></mt-cell>
      <mt-cell title="发布部门" :value="informationPublishDetails.publishorgname"></mt-cell>
      <mt-cell title="所在目录" :value="informationPublishDetails.directoryname"></mt-cell>

      <!--附件区-->
      <attachments-area :attachmentsInfo="informationPublishDetails" :detailsPage="'文档中心'"></attachments-area>
    </body-content>

  </div>
</template>

<script>
  import HeaderSimple from '@/components/header/header-simple'
  import BodyContent from "@/components/bodyContent/body-content"
  import AttachmentsArea from '@/components/attachmentsArea/attachments-area'
  import interfaceService from '../../service/interfaceService.js'

  export default {
    name: 'documentCenterDetails',
    data() {
      return {
        title: '详细信息',
        params: {
          "documentguid": ""
        },
        informationPublishDetails: {}
      }
    },
    components: {HeaderSimple, BodyContent, AttachmentsArea},
    methods: {
      init() {
        this.params.documentguid = this.$route.query.documentguid ? this.$route.query.documentguid : '';
      },
      goBack() {
        this.$router.push({path: '/documentCenterDetailList', query: {page: 'documentCenterDetails'}})
      },
      //获取文档详细内容
      getContentDetailInfo(params) {
        let that = this;
        that.informationPublishDetails = {};
        that.showIndicator('加载中...');//显示加载提示;
        interfaceService.queryContentDetailInfo(params).then(function (response) {
          that.hideIndicator();
          that.informationPublishDetails = response;
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
            that.getContentDetailInfo(that.params);
          }, function (error) {
            that.hideIndicator();
            that.showAlert("数据加载失败");
          });
      } else {
        this.init();
        this.getContentDetailInfo(this.params);
      }
    }

  }
</script>
<style lang="scss">

  .documentCenterDetails {
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
