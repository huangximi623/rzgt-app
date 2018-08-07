<template>
  <div class="documentCenter">
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
        <div v-else v-for="(item,index) in documentList">
          <mt-cell :title="item.directoryname" is-link
                   :to="{path: '/documentCenterDetailList', query:{infoListId: item.directoryguid}}">
            <i  slot="icon" class="fa fa-file reception-icon"></i>
            <span style="color: red" v-if="item.isnew == '1'">有新的文章</span>
          </mt-cell>
        </div>
    </body-content>
  </div>
</template>

<script>
  import HeaderSimple from '@/components/header/header-simple'
  import BodyContent from '@/components/bodyContent/body-content'
  import interfaceService from '../../service/interfaceService.js'

  export default {
    name: 'documentCenter',
    data() {
      return {
        title: '文档中心',
        documentList: [],
        showFlag: false
      }
    },
    components: {HeaderSimple, BodyContent},
    methods:{
      goBack() {
        this.$router.push({path: '/tab/home'});
      },
      //获取文档类型列表
      getListInfo(){
        let that = this;
        that.documentList = [];
        that.showIndicator('加载中...');//显示加载提示;
        interfaceService.queryDirectoryListInfo().then(function(response){
          that.hideIndicator();
          that.documentList = response;
          if(response.length === 0){
            that.showFlag = true;
          }
          that.showToast("已加载全部！");
        },function(error){
          that.showFlag = true;
          that.hideIndicator();
          that.showAlert("数据加载失败");
        })
      }
    },
    activated(){
      if (this.$route.query.page !== 'documentCenterDetailList') {
        this.showFlag = false;
        this.getListInfo();
      }
    }
  }
</script>
<style lang="scss" scoped>
  .documentCenter {
    width: 100%;
    height: 100%;
    background: #fff;
    .body-content {
      height: calc(100% - 45px);
      display: block;
      overflow: auto;
      box-sizing: border-box;
      .reception-icon {
        color: #1e8fe1;
        line-height: 40px;
      }
    }
  }

</style>
