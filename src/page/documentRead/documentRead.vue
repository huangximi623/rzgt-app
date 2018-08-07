<template>
  <div class="documentRead">
    <header-simple class="list-header">
      <div class="left-button" @click="goBack()" slot="left">
        <i class="fa fa-chevron-left"></i>
      </div>
      <div class="list-title" slot="title">
        {{title}}
      </div>
      <div class="right-button" slot="right"></div>
    </header-simple>
    <div class="admin-nav">
      <mt-navbar v-model="selected">
        <mt-tab-item id="1">未阅</mt-tab-item>
        <mt-tab-item id="2">已阅</mt-tab-item>
        <mt-tab-item id="3">全部</mt-tab-item>
      </mt-navbar>
    </div>
    <body-content class="body-content">
      <div v-if="showFlag" class="imgHeight">
        <img src="../../assets/noData-white.png" style="width: 55%;"/>
      </div>
      <mt-loadmore v-else class="list-selector" :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded"
                   :auto-fill="false" ref="loadmore_doc">
        <!-- tab-container -->
        <mt-tab-container v-model="selected">
          <mt-tab-container-item id="1">

            <document-read-list v-for='(item,index) in dealtInfo'
                           :key="index"
                           :ngUser='item.ngUser'
                           :fileDate='item.fileDate'
                           :title='item.title'
                           :status='item.status'
                           :fileGuid='item.fileGuid'
                           :createDate='item.createDate'
                           :type='item.type'
                           :ngDept='item.ngDept'
                           :typeFlag="'todo'">
            </document-read-list>

          </mt-tab-container-item>
          <mt-tab-container-item id="2">
            <document-read-list v-for='(item,index) in dealtInfo'
                           :key="index"
                           :ngUser='item.ngUser'
                           :fileDate='item.fileDate'
                           :title='item.title'
                           :status='item.status'
                           :fileGuid='item.fileGuid'
                           :createDate='item.createDate'
                           :type='item.type'
                           :ngDept='item.ngDept'
                           :typeFlag="'done'">
            </document-read-list>
          </mt-tab-container-item>
          <mt-tab-container-item id="3">
            <document-read-list v-for='(item,index) in dealtInfo'
                           :key="index"
                           :ngUser='item.ngUser'
                           :fileDate='item.fileDate'
                           :title='item.title'
                           :status='item.status'
                           :fileGuid='item.fileGuid'
                           :createDate='item.createDate'
                           :type='item.type'
                           :ngDept='item.ngDept'
                           :typeFlag="'over'">
            </document-read-list>
          </mt-tab-container-item>
        </mt-tab-container>
      </mt-loadmore>
    </body-content>
  </div>
</template>

<script>
  import HeaderSimple from '@/components/header/header-simple'
  import BodyContent from "@/components/bodyContent/body-content"
  import DocumentReadList from '../../components/workFlow/documentRead-list.vue'
  import interfaceService from '../../service/interfaceService.js'


  export default {
    name: 'documentRead',
    data() {
      return {
        title: '公文阅知',
        selected: '1',
        showFlag: false,
        allLoaded: false,
        dealtInfo: [],
        params: {
          "from": "0",
          "limit": "10",
          "type": "0"
        }
      }
    },
    components: {HeaderSimple, BodyContent, DocumentReadList},
    methods: {
      goBack() {
        this.$router.push({path: '/tab/home'})
      },
      //获取公文列表
      getDocumentList(params) {
        let that = this;
        that.dealtInfo = [];
//        this.showIndicator('加载中...');
        interfaceService.queryDocumentReadList(params)
          .then(function (response) {
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
          });
      },
      //加载更多
      loadmore(params) {
        let that = this;
//        this.showIndicator('加载中...');//显示加载提示
        interfaceService.queryDocumentReadList(params)
          .then(function (response) {
            if (response) {
              that.hideIndicator();//隐藏加载提示
              for (let i = 0; i < response.length; i++) {
                that.dealtInfo.push(response[i])
              }
              if (response.length < that.params.limit) {
                that.allLoaded = true;
                that.showToast("已加载全部！")
              }
            }
          }, function (error) {
            that.hideIndicator();//隐藏加载提示
            that.showAlert("数据加载失败");
          });
      },
      //下拉刷新
      loadTop() {
        let self = this;
        this.allLoaded = false;
        this.showFlag = false;
        this.params = {
          "from": "0",
          "limit": "10",
          "type": "0"
        };
        setTimeout(() => {
          if (self.selected === '1') {
            self.params.type = '0';
            self.getDocumentList(self.params);
          } else if (self.selected === '2') {
            self.params.type = '1';
            self.getDocumentList(self.params);
          } else if (self.selected === '3') {
            self.params.type = '';
            self.getDocumentList(self.params);
          }
          self.$refs.loadmore_doc.onTopLoaded();
        }, 1500)
      },
      //上拉加载更多
      loadBottom() {
        let self = this;
        this.params.from = (Number(this.params.limit) + Number(this.params.from)).toString();
        setTimeout(() => {
          if (self.selected === '1') {
            self.params.type = '0';
            self.loadmore(self.params);
          } else if (self.selected === '2') {
            self.params.type = '1';
            self.loadmore(self.params);
          } else if (self.selected === '3') {
            self.params.type = '';
            self.loadmore(self.params);
          }
          self.$refs.loadmore_doc.onBottomLoaded();
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
          "limit": "10",
          "type": "0"
        };
        switch (newval) {
          case '1':
            this.showIndicator('加载中...')
            this.params.type = '0';
            this.getDocumentList(this.params);
            break;
          case '2':
            this.showIndicator('加载中...')
            this.params.type = '1';
            this.getDocumentList(this.params);
            break;
          case '3':
            this.showIndicator('加载中...')
            this.params.type = '';
            this.getDocumentList(this.params);
            break;
          default:
            break;
        }
      },
    },
    activated() {
      if (this.$route.query.page !== 'documentReadDetail' || this.is_weixin()) {
        this.selected = '1';
        this.params = {
          "from": "0",
          "limit": "10",
          "type": "0"
        };
        this.allLoaded = false;
        this.showFlag = false;
        this.showIndicator('加载中...')
        this.getDocumentList(this.params);
      }
    }
  }
</script>
<style lang="scss" scoped="">

  .documentRead {
    background: #fff;
    .admin-nav {
      position: fixed;
      z-index: 999;
      top: 45px;
      height: 45px;
      box-sizing: border-box;
      width:100%;
      border-top: 1px solid #e3e3e3;
    }
    .body-content {
      height: calc(100% - 90px);
      display: block;
      overflow: auto;
      box-sizing: border-box;
      margin-top: 45px;
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
