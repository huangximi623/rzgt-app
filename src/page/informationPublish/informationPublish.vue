<template>
  <div class="informationPublish">
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
        <div v-for="(item,index) in informationList">
          <mt-cell :title="item.channeltitle" is-link
                   :to="{path: '/informationPublishDetailList', query:{infoListId: item.channelid}}">
            <i slot="icon" class="fa fa-commenting reception-icon"></i>
            <span style="color: red" v-if="item.isnew == '1'">有新的文章</span>
          </mt-cell>
        </div>
      </mt-loadmore>
    </body-content>
    <div class="caozuo">
      <mt-button type="primary" size="large" class="caozuo-btn" plain @click.native="toSiteInfo()">其他站点
      </mt-button>
    </div>
  </div>
</template>

<script>
  import HeaderSimple from '@/components/header/header-simple'
  import BodyContent from '@/components/bodyContent/body-content'
  import interfaceService from '../../service/interfaceService.js'

  export default {
    name: 'informationPublish',
    data() {
      return {
        title: '信息发布中心',
        allLoaded: false,
        informationList: [],
        params:{
          "from": "0",
          "limit": "10"
        },
        showFlag: false
      }
    },
    components: {HeaderSimple, BodyContent},
    methods: {
      toSiteInfo(){
        this.$router.push({path: '/siteInfo'});
      },
      goBack() {
        this.$router.push({path: '/tab/home'});
      },
      //获取信息类型列表
      getInformationList(params){
        let that = this;
        that.informationList = [];
        that.showIndicator('加载中...');//显示加载提示;
        interfaceService.queryNewsChanelList(params).then(function(response){
          that.hideIndicator();
          that.informationList = response;
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
        interfaceService.queryNewsChanelList(params).then(function (response) {
          if (response) {
            for (let i = 0; i < response.length; i++) {
              that.informationList.push(response[i]);
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
        this.params = {
          "from": "0",
          "limit": "10"
        };
        setTimeout(() => {
          self.getInformationList(this.params);
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
    activated(){
      if (this.$route.query.page !== 'informationPublishDetailList') {
        this.params = {
          "from": "0",
          "limit": "10"
        };
        this.allLoaded = false;
        this.showFlag = false;
        this.getInformationList(this.params);
      }

    }
  }
</script>
<style lang="scss" scoped>
  .informationPublish {
    width: 100%;
    height: 100%;
    background: #fff;
    .body-content {
      height: calc(100% - 90px);
      display: block;
      overflow: auto;
      box-sizing: border-box;
      /*margin-bottom: 50px;*/
      padding-bottom: 10px;
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
