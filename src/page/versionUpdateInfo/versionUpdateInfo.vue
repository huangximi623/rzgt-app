<template>
  <div class="version-update-info">
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
      <div class="item-content">
        <span class="item-content-t">版本号：</span>
        <span class="item-content-c">{{'v'+ versionInfo.Version}}</span>
      </div>
      <div class="item-content">
        <span class="item-content-t">发布日期：</span>
        <span class="item-content-c">{{versionInfo.CreateTime}}</span>
      </div>
      <div class="update-comment">
        <div style="font-weight: bold">更新说明：</div>
        <div v-html="versionInfo.UpdateInfo"></div>
      </div>
    </body-content>
  </div>
</template>

<script>
  import HeaderSimple from '@/components/header/header-simple'
  import BodyContent from '@/components/bodyContent/body-content'

  export default {
    name: "versionUpdateInfo",
    components: {HeaderSimple, BodyContent},
    data() {
      return {
        title: '版本信息',
        versionInfo: {}
      }
    },
    methods: {
      //数据初始化
      init() {
        this.versionInfo = this.$route.query.versionInfo;
      },
      //返回个人信息页面
      goBack() {
        this.$router.push({path: '/tab/personal'});
      }
    },
    activated() {
      this.init();
    }
  }
</script>

<style lang="scss" scoped>
  .version-update-info {
    background: #fff;
    .body-content {
      height: calc(100% - 45px);
      display: block;
      overflow: auto;
      box-sizing: border-box;
      padding: 10px;
      .item-content {
        height: 20px;
        line-height: 20px;
        position: relative;
        .item-content-t {
          height: 30px;
          width: 35%;
          color: #333333;
          position: absolute;
          text-align: left;
          font-weight: bold;
        }
        .item-content-c {
          width: 50%;
          color: #999999;
          right: 10%;
          position: absolute;
          font-size: 16px;
        }
      }
      .update-comment {
        line-height: 1.5;
      }
    }
  }

</style>
