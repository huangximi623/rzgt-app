<template>
  <div class="documentCenterDetailList">
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
      <mt-loadmore v-else class="list-selector" :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded"
                   :auto-fill="false" ref="loadmore_dom">
          <informationPublish-list v-for='(item,index) in ContentList'
                                   :key="index"
                                   :timeinterval='item.timeinterval'
                                   :documentguid='item.documentguid'
                                   :publishername='item.publishername'
                                   :documenttitle='item.documenttitle'
                                   :publishdate='item.publishdate'
                                   :statuscode='item.statuscode'
                                   :publisher='item.publisher'>
          </informationPublish-list>
      </mt-loadmore>
    </body-content>

  </div>
</template>

<script>
  import HeaderSimple from '@/components/header/header-simple'
  import BodyContent from "@/components/bodyContent/body-content"
  import InformationPublishList from '../../components/workFlow/documentCenter-list.vue'
  import interfaceService from '../../service/interfaceService.js'

  export default {
    name: 'documentCenterDetailList',
    data() {
      return {
        title: '文档列表',
        allLoaded: false,
        ContentList: [],
        params:{
          "informationListId": '',
          "from": "0",
          "limit": "10"
        },
        showFlag: false
      }
    },
    components: {HeaderSimple, BodyContent, InformationPublishList},
    methods: {
      init() {
        this.params.informationListId = this.$route.query.infoListId ? this.$route.query.infoListId:'';
      },

      goBack() {
        this.$router.push({path: '/documentCenter', query: {page: 'documentCenterDetailList'}})
      },

      //获取各类型文档列表
      getContentListInfo(params){
        let that = this;
        that.ContentList = [];
        that.showIndicator('加载中...');//显示加载提示;
        interfaceService.queryContentListInfo(params).then(function(response){
          that.hideIndicator();
          that.ContentList = response;
          if(response.length === 0){
            that.showFlag = true;
          }else {
            //如果请求返回数量小于limit，则默认加载全部，不允许再上拉加载
            if (response.length < that.params.limit) {
              that.allLoaded = true;
              that.showToast("已加载全部！")
            }
          }
        },function(error){
          that.showFlag = true;
          that.hideIndicator();
          that.showAlert("数据加载失败");
        })
      },

      //加载更多
      loadmore(params) {
        let that = this;
        interfaceService.queryContentListInfo(params).then(function (response) {
          if (response) {
            for (let i = 0; i < response.length; i++) {
              that.ContentList.push(response[i]);
            }
            //如果请求返回数量小于limit，则默认加载全部，不允许再上拉加载
            if (response.length < that.params.limit) {
              that.allLoaded = true;
              that.showToast("已加载全部！")
            }
          }
        }, function (error) {
          that.showAlert("数据加载失败");
        })
      },

      //下拉刷新
      loadTop() {
        let self = this;
        this.allLoaded = false;
        this.params.from = '0';
        this.params.limit = '10';
        setTimeout(() => {
          self.getContentListInfo(this.params);
          self.$refs.loadmore_dom.onTopLoaded();
        }, 1500)
      },
      // 上拉加载更多
      loadBottom() {
        let self = this;
        this.params.from = (Number(this.params.limit) + Number(this.params.from)).toString();
        setTimeout(() => {
          self.loadmore(this.params);
          self.$refs.loadmore_dom.onBottomLoaded();
        }, 1500);
      }
    },
    activated() {
      if (this.$route.query.page !== 'documentCenterDetails') {
        this.params = {
          "informationListId": '',
          "from": "0",
          "limit": "10"
        };
        this.showFlag = false;
        this.allLoaded = false;
        this.init();
        this.getContentListInfo(this.params);
      }
    }
  }
</script>
<style lang="scss" scoped>
  .documentCenterDetailList {
    background: #fff;
    .body-content {
      height: calc(100% - 45px);
      display: block;
      overflow: auto;
      box-sizing: border-box;
    }

  }

</style>
