<template>
  <div class="informationPublishDetailList">
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
                   :auto-fill="false" ref="loadmore_information">
        <informationPublish-list v-for='(item,index) in informationDetails'
                                 :key="index"
                                 :channelid="item.channelid"
                                 :channeltitle='item.channeltitle'
                                 :docid='item.docid'
                                 :pubdate='item.pubdate'
                                 :subtitle='item.subtitle'
                                 :timeinterval="item.timeinterval"
                                 :title="item.title"
                                 :siteListId="siteListId"
        :page="page">
        </informationPublish-list>
      </mt-loadmore>
    </body-content>

  </div>
</template>

<script>
  import HeaderSimple from '@/components/header/header-simple'
  import BodyContent from "@/components/bodyContent/body-content"
  import InformationPublishList from '../../components/workFlow/information-list.vue'
  import interfaceService from '../../service/interfaceService.js'


  export default {
    name: 'informationPublishDetailList',
    data() {
      return {
        title: '信息列表',
        informationDetails: [],
        params:{
          "channelid": '',
          "from": "0",
          "limit": "10"
        },
        showFlag: false,
        siteListId:'',
        allLoaded: false,
        page:''
      }
    },
    components: {HeaderSimple, BodyContent, InformationPublishList},
    methods: {
      init() {
        this.params.channelid = this.$route.query.infoListId;
        this.siteListId = this.$route.query.siteListId;
        this.page=this.$route.query.page;
      },
      goBack() {
        if(this.page === "siteInfoDetailList"){
          this.$router.push({path: '/siteInfoDetailList',query: {page: 'informationPublishDetailList'}})
        }else{
          this.$router.push({path: '/informationPublish',query: {page: 'informationPublishDetailList'}})
        }

      },
      //获取各类型列表
      getContentListInfo(params){
        let that = this;
        that.informationDetails = [];
        that.showIndicator('加载中...');//显示加载提示;
        interfaceService.queryNewsChanelListInfo(params).then(function(response){
          that.hideIndicator();
          that.informationDetails = response;
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
        interfaceService.queryNewsChanelListInfo(params).then(function (response) {
          if (response) {
            for (let i = 0; i < response.length; i++) {
              that.informationDetails.push(response[i]);
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
          self.$refs.loadmore_information.onTopLoaded();
        }, 1500)
      },
      // 上拉加载更多
      loadBottom() {
        let self = this;
        this.params.from = (Number(this.params.limit) + Number(this.params.from)).toString();
        setTimeout(() => {
          self.loadmore(this.params);
          self.$refs.loadmore_information.onBottomLoaded();
        }, 1500);
      }

    },
    activated() {
      if (this.$route.query.page1 !== 'informationPublishDetails') {
        this.params = {
          "channelid": '',
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
  .informationPublishDetailList {
    background: #fff;
    .body-content {
      height: calc(100% - 45px);
      display: block;
      overflow: auto;
      box-sizing: border-box;
    }

  }

</style>
