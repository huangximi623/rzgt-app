<template>
  <div class="levelStandardDetail">
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
      <mt-cell v-for="(item,index) in levelStandardInfo" :key="index" :title="item.key" :value="item.value"></mt-cell>
    </body-content>

  </div>
</template>

<script>
  import HeaderSimple from '@/components/header/header-simple'
  import BodyContent from "@/components/bodyContent/body-content"
  import interfaceService from '../../service/interfaceService.js'
  import axios from 'axios'

  export default {
    name: 'levelStandardDetail',
    data() {
      return {
        title: '详细信息',
        buttonTitle: '废钢验收',
        levelStandardInfo: [],
        paramsDetail: {
          "InstanceId": "",
          "MethodId": "1",
          "UserId": ""
        }
      }
    },
    components: {HeaderSimple, BodyContent},
    methods: {
      init() {
        this.paramsDetail.InstanceId = this.$route.query.InstanceId ? this.$route.query.InstanceId : '';
        this.paramsDetail.UserId = interfaceService.getCookie("UserId");
      },
      goBack() {
        this.$router.push({path: '/levelStandard', query: {page: 'levelStandardDetail'}})
      },

      //获取判级详情
      getLevelStandardDetails(params) {
        let that = this;
        that.levelStandardInfo = [];
        // that.showIndicator('加载中...');//显示加载提示;
        //请求
        interfaceService.queryLevelStandardDetail(params)
          .then(function (detailsResp) {
            that.hideIndicator();
            that.levelStandardInfo = detailsResp;
          }, function (error) {
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
          this.init();
          this.getLevelStandardDetails(this.paramsDetail);
      }
    }
  }
</script>
<style lang="scss" scoped="">

  .levelStandardDetail {
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
