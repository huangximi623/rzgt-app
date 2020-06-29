<template>
  <div class="wkApproval">
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
        <mt-tab-item id="3">办结</mt-tab-item>
      </mt-navbar>
    </div>
    <body-content class="body-content">
      <div v-if="showFlag" class="imgHeight">
        <img src="../../assets/noData-white.png" style="width: 55%;"/>
      </div>
      <mt-loadmore v-else class="list-selector" :top-method="loadTop" :bottom-method="loadBottom"
                   :bottom-all-loaded="allLoaded"
                   :auto-fill="false" ref="loadmore_admin">
        <!-- tab-container -->
        <mt-tab-container v-model="selected">
          <mt-tab-container-item id="1">
            <div id="todo">
              <wkApproval-list v-for='(item,index) in dealtInfo'
                                   :key="index"
                                   :className='item.class'
                                   :endTime='item.endTime'
                                   :endTimeStr='item.endTimeStr'
                                   :extra='item.extra'
                                   :form='item.form'
                                   :formFlow='item.formFlow'
                                   :platCommonSchema='item.platCommonSchema'
                                   :platSchema='item.platSchema'
                                   :processCname='item.processCname'
                                   :processId='item.processId'
                                   :processName='item.processName'
                                   :processNum='item.processNum'
                                   :processState='item.processState'
                                   :projectCommonSchema='item.projectCommonSchema'
                                   :projectSchema='item.projectSchema'
                                   :pubState='item.pubState'
                                   :reciverTime='item.reciverTime'
                                   :startDept='item.startDept'
                                   :startTime='item.startTime'
                                   :stater='item.stater'
                                   :staterName='item.staterName'
                                   :taskId='item.taskId'
                                   :tenantId='item.tenantId'
                                   :title='item.title'
                                   :transitionTag='item.transitionTag'
                                   :eiMetadata='item.eiMetadata'
                                   :typeFlag="'todo'">
              </wkApproval-list>
            </div>
          </mt-tab-container-item>
          <mt-tab-container-item id="2">
            <div id="done">
              <wkApproval-list v-for='(item,index) in dealtInfo'
                                   :key="index"
                                   :className='item.class'
                                   :endTime='item.endTime'
                                   :endTimeStr='item.endTimeStr'
                                   :extra='item.extra'
                                   :form='item.form'
                                   :formFlow='item.formFlow'
                                   :platCommonSchema='item.platCommonSchema'
                                   :platSchema='item.platSchema'
                                   :processCname='item.processCname'
                                   :processId='item.processId'
                                   :processName='item.processName'
                                   :processNum='item.processNum'
                                   :processState='item.processState'
                                   :projectCommonSchema='item.projectCommonSchema'
                                   :projectSchema='item.projectSchema'
                                   :pubState='item.pubState'
                                   :reciverTime='item.reciverTime'
                                   :startDept='item.startDept'
                                   :startTime='item.startTime'
                                   :stater='item.stater'
                                   :staterName='item.staterName'
                                   :taskId='item.taskId'
                                   :tenantId='item.tenantId'
                                   :title='item.title'
                                   :transitionTag='item.transitionTag'
                                   :eiMetadata='item.eiMetadata'
                                   :typeFlag="'done'">
              </wkApproval-list>
            </div>
          </mt-tab-container-item>
          <mt-tab-container-item id="3">
            <div id="over">
              <wkApproval-list v-for='(item,index) in dealtInfo'
                                   :key="index"
                                   :className='item.class'
                                   :endTime='item.endTime'
                                   :endTimeStr='item.endTimeStr'
                                   :extra='item.extra'
                                   :form='item.form'
                                   :formFlow='item.formFlow'
                                   :platCommonSchema='item.platCommonSchema'
                                   :platSchema='item.platSchema'
                                   :processCname='item.processCname'
                                   :processId='item.processId'
                                   :processName='item.processName'
                                   :processNum='item.processNum'
                                   :processState='item.processState'
                                   :projectCommonSchema='item.projectCommonSchema'
                                   :projectSchema='item.projectSchema'
                                   :pubState='item.pubState'
                                   :reciverTime='item.reciverTime'
                                   :startDept='item.startDept'
                                   :startTime='item.startTime'
                                   :stater='item.stater'
                                   :staterName='item.staterName'
                                   :taskId='item.taskId'
                                   :tenantId='item.tenantId'
                                   :title='item.title'
                                   :transitionTag='item.transitionTag'
                                   :eiMetadata='item.eiMetadata'
                                   :typeFlag="'over'">
              </wkApproval-list>
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
  import WkApprovalList from '@/components/workFlow/wkApproval-list.vue'
  import interfaceService from '../../service/interfaceService.js'

  export default {
    name: 'wkApproval',
    data() {
      return {
        title: '营钢审批',
        selected: '1',
        showFlag: false,
        allLoaded: false,
        dealtInfo: [],
        params: {
          "from": "0",
          "limit": "10"
        }
      }
    },
      components: {HeaderSimple, BodyContent, WkApprovalList},
    methods: {
      goBack() {
        this.$router.push({path: '/group'})
      },
      //获取行政审批列表
      getWkApprovalList(type, params) {
        let that = this;
        that.dealtInfo = [];
//        that.showIndicator('加载中...');
        interfaceService.queryWkApprovalList(type, params).then(function (response) {
          that.hideIndicator();
          that.dealtInfo = response;
          if(response.length === 0){
            that.showFlag = true;
          }else{
            //如果请求返回数量小于limit，则默认加载全部，不允许再上拉加载
            if (response.length < that.params.limit) {
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
        interfaceService.queryWkApprovalList(type, params).then(function (response) {
          if (response) {
            that.hideIndicator();
            for (let i = 0; i < response.length; i++) {
              that.dealtInfo.push(response[i]);
            }
            //如果请求返回数量小于limit，则默认加载全部，不允许再上拉加载
            if (response.length < that.params.limit) {
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
        this.params = {
          "from": "0",
          "limit": "10"
        };
        setTimeout(() => {
          if (self.selected === '1') {
            self.getWkApprovalList('待办', self.params);
          } else if (self.selected === '2') {
            self.getWkApprovalList('已办', self.params);
          } else if (self.selected === '3') {
            self.getWkApprovalList('办结', self.params);
          }
          self.$refs.loadmore_admin.onTopLoaded();
        }, 1500)
      },
      // 上拉加载更多
      loadBottom() {
        let self = this;
        this.params.from = (Number(this.params.limit) + Number(this.params.from)).toString();
        setTimeout(() => {
          if (self.selected === '1') {
            self.loadmore('待办', self.params);
          } else if (self.selected === '2') {
            self.loadmore('已办', self.params);
          } else if (self.selected === '3') {
            self.loadmore('办结', self.params);
          }
          self.$refs.loadmore_admin.onBottomLoaded();
        }, 1500);
      }
    },
    watch: {
      selected(newval, oldval) {
        // this.dealtInfo = [];
        this.allLoaded = false;
        this.showFlag = false;
        this.params = {
          "from": "0",
          "limit": "10"
        };
        switch (newval) {
          case '1':
            this.showIndicator('加载中...');
            this.getWkApprovalList('待办', this.params);
            break;
          case '2':
            this.showIndicator('加载中...');
            this.getWkApprovalList('已办', this.params);
            break;
          case '3':
            this.showIndicator('加载中...');
            this.getWkApprovalList('办结', this.params);
            break;
          default:
            break;
        }
      }
    },
    activated() {
      if (this.$route.query.page !== 'wkApprovalDetail' || this.is_weixin()) {
        this.selected = '1';
        this.params = {
          "from": "0",
          "limit": "10"
        };
        this.allLoaded = false;
        this.showFlag = false;
        this.showIndicator('加载中...');
        this.getWkApprovalList('待办', this.params);
      }
    }
  }
</script>
<style lang="scss" scoped="">

  .wkApproval
  {
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
