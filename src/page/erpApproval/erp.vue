<template>
  <div class="erp">
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
        <erpContent ref="contentGuide"></erpContent>
      </div>
    </body-content>
  </div>

</template>
<script>
  import HeaderSimple from '@/components/header/header-simple'
  import BodyContent from '@/components/bodyContent/body-content'
  import ErpContent from '@/components/contentGuide/erpContent'
  import interfaceService from '../../service/interfaceService.js'
  import axios from 'axios'

  export default {
    name: 'erp',
    data() {
      return {
        title: 'ERP审批',
        paramsErpDaiban:{}
      }
    },
    components: {HeaderSimple, BodyContent, ErpContent},
    methods: {
      goBack() {
        this.$router.push({path: '/tab/home'})
      },
      //获取ERP页面数据
      getERPData() {
        let that = this;
        //一次性获取ERP待办总数、招采待办、客户退款、需求提报待办数量
        interfaceService.queryErpData('ERP').then(function (resp) {
          that.hideIndicator();
          let mqeindex = that.getIndex(that.$refs.contentGuide.contentList, "MQE");
          that.$refs.contentGuide.contentList[mqeindex].newMessages = resp[1].count;

          let saindex = that.getIndex(that.$refs.contentGuide.contentList, "SA");
          that.$refs.contentGuide.contentList[saindex].newMessages = resp[2].count;

          let urindex = that.getIndex(that.$refs.contentGuide.contentList, "UR");
          that.$refs.contentGuide.contentList[urindex].newMessages = resp[3].count;

        }, function (error) {
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
        //获取ERP首页数据
        this.getERPData();
      }
    },
    activated() {
      this.init();
    }
  }
</script>
<style lang="scss" scoped>
  .erp {
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
