<template>
  <div class="salesApproval">
    <!--<div class="top-space"></div>-->
    <header-simple class="list-header">
      <div class="left-button" @click="goBack()" slot="left"><i class="fa fa-chevron-left"></i></div>
      <div class="list-title" slot="title">
        {{title}}
      </div>
      <div class="right-button" slot="right"></div>
    </header-simple>
    <div class="admin-nav">
      <mt-navbar v-model="selected">
        <mt-tab-item id="1">待办</mt-tab-item>
        <mt-tab-item id="2">已办</mt-tab-item>
<!--        <mt-tab-item id="3">办结</mt-tab-item>-->
      </mt-navbar>
    </div>
    <body-content class="body-content">
      <div v-if="showFlag" class="imgHeight">
        <img src="../../assets/noData-white.png" style="width: 55%;"/>
      </div>
      <mt-loadmore v-else class="list-selector" :top-method="loadTop" :bottom-method="loadBottom"
                   :bottom-all-loaded="allLoaded"
                   :auto-fill="false" ref="loadmore_sale">
        <!-- tab-container -->
        <mt-tab-container v-model="selected">
          <mt-tab-container-item id="1">
            <div id="todo">
              <salesApprove-list v-for='(item,index) in dealtInfo'
                                  :key="index"
                                  :instanceId='item.INSTANCEID'
                                  :title='item.TITLE'
                                  :sender='item.SENDER'
                                  :createDate='item.CREATEDATE'
                                  :typeFlag="'todo'">
              </salesApprove-list>
            </div>
          </mt-tab-container-item>
          <mt-tab-container-item id="2">
            <div id="done">
              <salesApprove-list v-for='(item,index) in dealtInfo'
                                   :key="index"
                                   :instanceId='item.INSTANCEID'
                                   :sender='item.SENDER'
                                   :title='item.TITLE'
                                   :createDate='item.FINISHDATE'
                                   :typeFlag="'done'">
              </salesApprove-list>
            </div>
          </mt-tab-container-item>
        </mt-tab-container>
      </mt-loadmore>
    </body-content>
  </div>
</template>

<script>
  import HeaderSimple from '@/components/header/header-simple'
  import BodyContent from "@/components/bodyContent/body-content"
  import SalesApproveList from '@/components/workFlow/salesApprove-list.vue'
  import interfaceService from '../../service/interfaceService.js'

  export default {
    name: 'salesApproval',
    data() {
      return {
        title: '销售审批',
        selected: '1',
        showFlag: false,
        allLoaded: false,
        dealtInfo: [],
        params: {
          "fromId":"JKA02",
          "test":"Y",
          "userId":"",
          "from": "0",
          "limit": "10"
        }
      }
    },
    components: {HeaderSimple, BodyContent, SalesApproveList},
    methods: {
      goBack() {
        this.$router.push({path: '/erp'})
      },
      //获取销售审批列表
      getSalesApprovalList(type, params) {
        let that = this;
        that.dealtInfo = [];
//        that.showIndicator('加载中...');
//         alert(params.from);
        interfaceService.querySalesList(type, params).then(function (response) {
          that.hideIndicator();
          that.dealtInfo = response.data;
          if(response.data.length === 0){
            that.showFlag = true;
          }else{
            //如果请求返回数量小于limit，则默认加载全部，不允许再上拉加载
            if (response.data.length < that.params.limit) {
              that.allLoaded = true;
              that.showToast("已加载全部！")
            }
          }

        }, function (error) {
          that.showFlag = true;
          that.hideIndicator();
          that.showAlert("数据加载失败");
        })
      },
      //加载更多
      loadmore(type, params) {
        let that = this;
//        that.showIndicator('加载中...');
        interfaceService.querySalesList(type, params).then(function (response) {
          if (response.data) {
            that.hideIndicator();
            for (let i = 0; i < response.data.length; i++) {
              that.dealtInfo.push(response.data[i]);
            }
            //如果请求返回数量小于limit，则默认加载全部，不允许再上拉加载
            if (response.data.length < that.params.limit) {
              that.allLoaded = true;
              that.showToast("已加载全部！")
            }
          }
        }, function (error) {
          that.hideIndicator();
          that.showAlert("数据加载失败");
        })
      },
      //下拉刷新
      loadTop() {
        let self = this;
        this.allLoaded = false;
        this.showFlag = false;
        setTimeout(() => {
          if (self.selected === '1') {
            self.getSalesApprovalList('待办', self.params);
          } else if (self.selected === '2') {
            self.getSalesApprovalList('已办', self.params);
          }
          self.$refs.loadmore_sale.onTopLoaded();
        }, 1500)
      },
      // 上拉加载更多
      loadBottom() {
        let self = this;
        // alert(111111111111);
        this.params.from = (Number(this.params.limit) + Number(this.params.from)).toString();
        setTimeout(() => {
          if (self.selected === '1') {
            self.loadmore('待办', self.params);
          } else if (self.selected === '2') {
            self.loadmore('已办', self.params);
          }
          self.$refs.loadmore_sale.onBottomLoaded();
        }, 1500);
      }
    },
    watch: {
      selected(newval, oldval) {
        // this.dealtInfo = [];
        this.allLoaded = false;
        this.showFlag = true;
        this.params.from = '0';
        this.params.limit = '10';
        switch (newval) {
          case '1':
            // this.showIndicator('加载中...');
            this.params.fromId = 'JKA02';
            // this.getSalesApprovalList('待办', this.params);
            break;
          case '2':
            // this.showIndicator('加载中...');
            this.params.fromId = 'JKA07';
            // this.getSalesApprovalList('已办', this.params);
            break;
          default:
            break;
        }
      }
    },
    activated() {
      if (this.$route.query.page !== 'salesApprovalDetail' || this.is_weixin()) {
        this.selected = '1';
        this.params.from = '0';
        this.params.limit = '10';
        this.allLoaded = false;
        this.showFlag = true;
        this.params.userId = interfaceService.getCookie("UserId");
        // this.showIndicator('加载中...');
        // this.getSalesApprovalList('待办', this.params);
      }
    }
  }
</script>
<style lang="scss" scoped="">

  .administrativeExamination {
    background: #fff;
    .admin-nav {
      position: fixed;
      z-index: 999;
      top: 45px;
      height: 45px;
      box-sizing: border-box;
      width: 100%;
      border-top: 1px solid #e3e3e3;
    }
    .body-content {
      overflow: auto;
      box-sizing: border-box;
      margin-top: 45px;
      height: calc(100% - 90px);
      display: block;
      padding-bottom: 5px;
      .list-selector {
        width: 100%;
        /*min-height: calc(100% - 45px);*/
        background: #fff;
        box-sizing: border-box;
      }
    }

    .person-info {

      .mint-cell-title {

        .mint-cell-text {
          margin-left: 20px;
        }

      }
    }
  }

</style>
