<template>
  <div class="group">
    <header-simple class="list-header">
      <!--      <div class="left-button" slot="left"></div>-->
      <div class="left-button" @click="goBack()" slot="left"><i class="fa fa-chevron-left"></i></div>
      <div class="list-title" slot="title">
        {{title}}
      </div>
      <div class="right-button" slot="right"></div>
    </header-simple>
    <body-content class="body-content">
      <div class="index-info-list clearfix content-guide">
        <groupContent ref="contentGuide"></groupContent>
      </div>
    </body-content>
  </div>

</template>
<script>
  import HeaderSimple from '@/components/header/header-simple'
  import BodyContent from '@/components/bodyContent/body-content'
  import GroupContent from '@/components/contentGuide/groupContent'
  import interfaceService from '../../service/interfaceService.js'
  import axios from 'axios'

  export default {
    name: 'group',
    data() {
      return {
        title: '集团审批',
        paramsGroupDaiban:{}
      }
    },
    components: {HeaderSimple, BodyContent, GroupContent},
    methods: {
      goBack() {
        this.$router.push({path: '/tab/home'})
      },
      //获取ERP页面数据
/*      getErpData() {
        let that = this;
        //获取ERP待办数量
        that.paramsErpDaiban = {
          "fromId":"JKA01",
          "test":"Y",
          // "userId":"R002019",
          "userId":interfaceService.getCookie("UserId")
        };
        var obj = JSON.stringify(that.paramsErpDaiban);
        interfaceService.queryErpData('ERP',obj)
          .then(function (saleResp) {
            that.hideIndicator();
            //销售待办数量
            // for (let i = 0; i < saleResp.length; i++) {
            // let wfindex = that.getIndex(that.$refs.contentGuide.contentList, wfResp[i].label);
            that.$refs.contentGuide.contentList[0].newMessages = saleResp.data.value;
            // }
          }, function (error) {
            that.hideIndicator();
            that.showAlert("数据加载失败");
          });
      },*/
      getJTWFData() {
        let that = this;
        //同时执行多个请求
        axios.all([
          interfaceService.queryHomeData('JHJT'),//获取京华集团行政审批
          interfaceService.queryHomeData('WKYG'),//获取五矿营钢行政审批

        ])
          .then(axios.spread(function (jhResp, wkResp) {
            that.hideIndicator();
            //后增集团待办审批数量
            let jhwfindex = that.getIndex(that.$refs.contentGuide.contentList, "JHSP");
            that.$refs.contentGuide.contentList[jhwfindex].newMessages = jhResp[0].count;

            let wkwfindex = that.getIndex(that.$refs.contentGuide.contentList, "YGSP");
            that.$refs.contentGuide.contentList[wkwfindex].newMessages = wkResp[0].count;

          }), function (error) {
            that.hideIndicator();
            that.showAlert("数据加载失败");
          });
      },
      //获取下标
      getIndex(arr, value) {
        let index;
        for (let i = 0; i < arr.length; i++) {
          if (value === arr[i].label) {
            index = i;
            return index;
          }
        }
        return -1;
      },
      //页面初始化
      init() {
        //获取集团审批待办
        this.getJTWFData();
      }
    },
    activated() {
      this.init();
    }
  }
</script>
<style lang="scss" scoped>
  .group {
    width: 100%;
    height: 100%;
    background: #fff;
    .body-content {
      margin-bottom: 55px;
      height: calc(100% - 100px);
      display: block;
      overflow: auto;
      box-sizing: border-box;
      .content-guide {
        margin-top: 0px;
      }
    }
    .version-pop {
      width: 80%;
      height: auto;
      min-height: 100px;
      border-radius: 10px;
      text-align: center;
      line-height: 2;
      .update-title {
        font-weight: bold;
        margin: 10px;
        font-size: 16px;
      }
      .update-content {
        color: #888888;
        margin: 10px;
      }
      .update-force {
        border-top: 1px solid #ccc;
        padding: 10px;
        height: 45px;
        a {
          text-decoration: none;
          color: #1e8fe1;
        }
      }
      .update-cancel {
        border-top: 1px solid #ccc;
        padding: 10px;
        height: 45px;
        .update-button {
          float: left;
          width: calc(50% - 10px);
          a {
            text-decoration: none;
            color: #1e8fe1;
          }
        }
        .update-button:active {
          background: #E6E6E6;
        }
        .cancel-button {
          float: right;
          width: calc(50% - 10px);
        }
        .cancel-button:active {
          background: #E6E6E6;
        }
      }
    }
  }

</style>
