<template>
  <div class="siteInfo">
    <header-simple class="list-header">
      <div class="left-button" @click="goBack()" slot="left">
        <i class="fa fa-chevron-left"></i>
      </div>
      <div class="list-title" slot="title">
        {{title}}
      </div>
      <div class="right-button" slot="right"></div>
    </header-simple>

    <body-content class="body-content" :class="{'noData-background':showFlag}">
      <mt-loadmore class="list-selector" :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded"
                   :auto-fill="false" ref="loadmore_siteInfo">
        <div v-for="(item,index) in siteInfoList">
          <mt-cell :title="item.sitename" is-link
                   :to="{path: '/siteInfoDetailList', query:{siteListId: item.siteid}}">
            <i slot="icon" class="fa fa-list-alt reception-icon"></i>
          </mt-cell>
        </div>
      </mt-loadmore>
    </body-content>
  </div>
</template>

<script>
  import HeaderSimple from '@/components/header/header-simple'
  import BodyContent from '@/components/bodyContent/body-content'
  import interfaceService from '../../service/interfaceService.js'

  export default {
    name: 'siteInfo',
    data() {
      return {
        title: '其他站点',
        allLoaded: false,
        siteInfoList: [],
        params:{
          "from": "0",
          "limit": "10"
        },
        showFlag: false
      }
    },
    components: {HeaderSimple, BodyContent},
    methods: {
      goBack() {
        this.$router.push({path: '/informationPublish'});
      },
      //获取其他站点列表
      getSiteIdInfoList(params){
        let that = this;
        that.siteInfoList = [];
        that.showIndicator('加载中...');//显示加载提示;
        interfaceService.querySiteIdInfo(params).then(function(response){
          that.hideIndicator();
          that.siteInfoList = response;

          if(response.length === 0){
            that.showFlag = true;
          }else{
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
        interfaceService.querySiteIdInfo(params).then(function (response) {
          if (response) {
            for (let i = 0; i < response.length; i++) {
              that.siteInfoList.push(response[i]);
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
        self.allLoaded = false;
        self.params = {
          "from": "0",
          "limit": "10"
        };
        setTimeout(() => {
          self.getSiteIdInfoList(this.params);
          self.$refs.loadmore_siteInfo.onTopLoaded();
        }, 1500)
      },

      // 上拉加载更多
      loadBottom() {
        let self = this;
        self.params.from = (Number(self.params.limit) + Number(self.params.from)).toString();
        setTimeout(() => {
          self.loadmore(this.params);
          self.$refs.loadmore_siteInfo.onBottomLoaded();
        }, 1500);
      }
    },
    activated(){
      if (this.$route.query.page !== 'siteInfoDetailList') {
        this.params = {
          "from": "0",
          "limit": "10"
        };
        this.allLoaded = false;
        this.showFlag = false;
        this.getSiteIdInfoList(this.params);
      }
    }
  }
</script>
<style lang="scss" scoped>
  .siteInfo {
    width: 100%;
    height: 100%;
    background: #fff;
    .body-content {
      height: calc(100% - 45px);
      display: block;
      overflow: auto;
      box-sizing: border-box;
      .list-selector {
        width: 100%;
        /*min-height: calc(100% - 45px);*/
        background: #fff;
        box-sizing: border-box;
      }
      .reception-icon {
        color: #1e8fe1;
        line-height: 40px;
      }
    }
  }
</style>
