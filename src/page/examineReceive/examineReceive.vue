<template>
  <div class="examineReceive">
    <header-simple class="list-header">
      <div class="left-button" @click="goBack()" slot="left"><i class="fa fa-chevron-left"></i></div>
      <div class="list-title" slot="title">
        {{title}}
      </div>
      <div class="right-button" slot="right"></div>
    </header-simple>
    <body-content class="body-content">
      <div class="index-info-list clearfix content-guide">
<!--        <erpContent ref="contentGuide"></erpContent>-->
        <receiveContent ref="contentGuide"></receiveContent>
      </div>
    </body-content>
  </div>

</template>
<script>
  import HeaderSimple from '@/components/header/header-simple'
  import BodyContent from '@/components/bodyContent/body-content'
  import ErpContent from '@/components/contentGuide/erpContent'
  import ReceiveContent from '@/components/contentGuide/receiveContent'
  import interfaceService from '../../service/interfaceService.js'

  export default {
    name: 'examineReceive',
    data() {
      return {
        title: '废钢验收',
        paramsErpDaiban:{}
      }
    },
    components: {HeaderSimple, BodyContent, ErpContent, ReceiveContent},
    methods: {
      goBack() {
        this.$router.push({path: '/tab/home'})
      },
      //页面初始化
      init() {
      //
      }
    },
    activated() {
      this.init();
    }
  }
</script>
<style lang="scss" scoped>
  .examineReceive {
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
