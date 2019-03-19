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
      <!--表单区-->
      <!--      <div class="procedureRecord" v-if="levelStandardInfo.detail">
              <span><label class="margin-left-5">表单详情区</label></span>
            </div>-->
      <mt-cell v-for="(item,index) in qualityTestInfo.detail" :key="index" :title="item.key" :value="item.value"></mt-cell>
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
        qualityTestInfo: {
          "detail": [
            {
              "value": "厚度≥8",
              "key": "厚度"
            },
            {
              "value": "1",
              "key": "密度"
            },
            {
              "value": "长：≤600宽：≤400高：≤400",
              "key": "产品尺寸"
            },
            {
              "value": "加工余料，无锈、无杂。为从坯料、原材加工后的余料。如报废的钢锭、钢坯、初轧坯、切头、切尾、铸造冲压料、边丝、钢筋头、钢绞线等。",
              "key": "描述"
            }]
        },
        history: [],
        paramsDetail: {
          "code": ""
        }
      }
    },
    components: {HeaderSimple, BodyContent},
    methods: {
      init() {
        /*  this.documentInfo = this.$route.query.documentInfo;*/
        this.paramsDetail.code = this.$route.query.code ? this.$route.query.code : '';
      },
      goBack() {
        this.$router.push({path: '/qualityTest', query: {page: 'qualityTestDetail'}})
      },

      //获取判级详情
      getQualityTestDetails(params) {
        let that = this;
        that.history = [];
        that.qualityTestInfo = {};
        // that.showIndicator('加载中...');//显示加载提示;
        //同时执行多个请求
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
        /*        if (this.$route.query.page !== 'toReadList') {
                  this.init();
                  this.getProcessAndDetails(this.$route.query.type, this.paramsDetail);
                }*/
      }
    },
    /*mounted() {
      this.init();
    }*/
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
