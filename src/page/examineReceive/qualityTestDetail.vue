<template>
  <div class="qualityTestDetail">
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
                  :class="qualityTestInfo.caozuo && qualityTestInfo.caozuo.length>0  ? 'haveFootButton-heigth' : 'noFootButton-heigth' ">
      <mt-cell v-for="(item,index) in qualityTestInfo" :key="index" :title="item.key" :value="item.value"></mt-cell>
    </body-content>

  </div>
</template>

<script>
  import HeaderSimple from '@/components/header/header-simple'
  import BodyContent from "@/components/bodyContent/body-content"
  import interfaceService from '../../service/interfaceService.js'
  import axios from 'axios'

  export default {
    name: 'qualityTestDetail',
    data() {
      return {
        title: '详细信息',
        buttonTitle: '废钢验收',
        qualityTestInfo: [],
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
        this.$router.push({path: '/qualityTest', query: {page: 'qualityTestDetail'}})
      },

      //获取质检点详情
      getQualityTestDetails(params) {
        let that = this;
        that.qualityTestInfo = {};
        // that.showIndicator('加载中...');//显示加载提示;
        //请求
        interfaceService.queryQualityTestDetail(params)
          .then(function (detailsResp) {
            that.hideIndicator();
            that.qualityTestInfo = detailsResp;
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
        this.getQualityTestDetails(this.paramsDetail);
      }
    }
  }
</script>
<style lang="scss" scoped="">

  .qualityTestDetail {
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
