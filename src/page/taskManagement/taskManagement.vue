<template>
  <div class="taskManagement">
    <header-simple class="list-header">
      <div class="left-button" @click="goBack()" slot="left"><i class="fa fa-chevron-left"></i></div>
      <div class="list-title" slot="title">
        {{title}}
      </div>
      <div class="right-button" slot="right">
      </div>
    </header-simple>

    <div class="admin-nav-main">
      <mt-navbar v-model="selected">
        <mt-tab-item id="1">我的任务</mt-tab-item>
        <mt-tab-item id="2">我发起的</mt-tab-item>
        <mt-tab-item id="3">关注的</mt-tab-item>
      </mt-navbar>
    </div>
    <div class="admin-nav">
      <mt-navbar v-model="state">
        <mt-tab-item id="4">进行中</mt-tab-item>
        <mt-tab-item id="5">已完成</mt-tab-item>
      </mt-navbar>
    </div>

    <body-content class="body-content">
      <div v-if="showFlag" class="imgHeight">
        <img src="../../assets/noData-white.png" style="width: 55%;"/>
      </div>
      <mt-loadmore v-else class="list-selector" :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded"
                   :auto-fill="false" ref="loadmore_task">
        <!-- tab-container -->
        <mt-tab-container v-model="selected">
          <mt-tab-container-item id="1">
            <div id="myTask">
              <task-list v-for='(item,index) in personInfo'
                         :key="index"
                         :process='item.process'
                         :guid='item.guid'
                         :finishTime='item.finishTime'
                         :createDate='item.createDate'
                         :pubDate='item.pubDate'
                         :completeDate='item.completeDate'
                         :jobName='item.jobName'
                         :jobNum='item.jobNum'
                         :typeFlag="'todo'">
              </task-list>
            </div>
          </mt-tab-container-item>

          <mt-tab-container-item id="2">

            <div id="myStart">
              <task-list v-for='(item,index) in personInfo'
                         :key="index"
                         :process='item.process'
                         :guid='item.guid'
                         :finishTime='item.finishTime'
                         :createDate='item.createDate'
                         :pubDate='item.pubDate'
                         :completeDate='item.completeDate'
                         :jobName='item.jobName'
                         :jobNum='item.jobNum'
                         :typeFlag="'done'">
              </task-list>
            </div>
          </mt-tab-container-item>

          <mt-tab-container-item id="3">
            <div id="myfocus">
              <task-list v-for='(item,index) in personInfo'
                         :key="index"
                         :process='item.process'
                         :guid='item.guid'
                         :finishTime='item.finishTime'
                         :createDate='item.createDate'
                         :pubDate='item.pubDate'
                         :completeDate='item.completeDate'
                         :jobName='item.jobName'
                         :jobNum='item.jobNum'
                         :typeFlag="'done'">
              </task-list>
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
  import TaskList from '../../components/workFlow/task-list.vue'
  import interfaceService from '../../service/interfaceService.js'

  export default {
    name: 'taskManagement',
    data() {
      return {
        title: '任务管理',
        selected: '1',
        state: '4',
        selected_is: false,
        state_is: false,
        showFlag: false,
        allLoaded: false,
        personInfo: [],
        params: {
          "from": "0",
          "limit": "10",
        }
      }
    },
    components: {HeaderSimple, BodyContent, TaskList},
    methods: {
      goBack() {
        this.$router.push({path: '/tab/home'})
      },
      //获取任务管理列表
      getTaskManagementList(type, params) {
        let that = this;
        that.personInfo = [];
//        this.showIndicator('加载中...');
        interfaceService.queryTaskManagementList(type, params)
          .then(function (response) {
            that.hideIndicator();
            that.personInfo = response;
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
      loadmore(type, params) {
        let that = this;
//        that.showIndicator('加载中...');
        interfaceService.queryTaskManagementList(type, params).then(function (response) {
          if (response) {
            that.hideIndicator();
            for (let i = 0; i < response.length; i++) {
              that.personInfo.push(response[i]);
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
          "limit": "10",
          "state": this.state
        };
        setTimeout(() => {
          if (self.selected === '1') {
            self.getTaskManagementList('我的任务', self.params);
          } else if (self.selected === '2') {
            self.getTaskManagementList('我发起的', self.params);
          } else if (self.selected === '3') {
            self.getTaskManagementList('关注的', self.params);
          }
          self.$refs.loadmore_task.onTopLoaded();
        }, 1500)
      },
      // 上拉加载更多
      loadBottom() {
        let self = this;
        this.params.from = (Number(this.params.limit) + Number(this.params.from)).toString();
        setTimeout(() => {
          if (self.selected === '1') {
            self.loadmore('我的任务', self.params);
          } else if (self.selected === '2') {
            self.loadmore('我发起的', self.params);
          } else if (self.selected === '3') {
            self.loadmore('关注的', self.params);
          }
          self.$refs.loadmore_task.onBottomLoaded();
        }, 1500);
      }
    },
    watch: {
      selected(newval, oldval) {
        // this.personInfo = [];
        this.allLoaded = false;
        this.showFlag = false;
        this.state = '4';
        this.params = {
          "from": "0",
          "limit": "10",
          "state": this.state
        };
        if(!this.state_is){
          switch (newval) {
            case '1':
              this.showIndicator('加载中...');
              this.getTaskManagementList('我的任务', this.params);
              break;
            case '2':
              this.showIndicator('加载中...');
              this.getTaskManagementList('我发起的', this.params);
              break;
            case '3':
              this.showIndicator('加载中...');
              this.getTaskManagementList('关注的', this.params);
              break;
            default:
              break;
          }
        }
      },
      state(newval, oldval) {
        this.meetingInfo = [];
        this.allLoaded = false;
        this.showFlag = false;
        if(newval === '5'){
          this.state_is = true;
        }else{
          this.state_is = false;
        }
        this.params = {
          "from": "0",
          "limit": "10",
          "state": this.state
        };

        switch (this.selected) {
          case '1':
            this.showIndicator('加载中...');
            this.getTaskManagementList('我的任务', this.params);
            break;
          case '2':
            this.showIndicator('加载中...');
            this.getTaskManagementList('我发起的', this.params);
            break;
          case '3':
            this.showIndicator('加载中...');
            this.getTaskManagementList('关注的', this.params);
            break;
          default:
            break;
        }
      }
    },
    activated() {
      if (this.$route.query.page !== 'taskManagementDetail' || this.is_weixin()) {
        this.selected = '1';
        this.state = '4';
        this.params = {
          "from": "0",
          "limit": "10",
          "state": this.state
        };
        this.allLoaded = false;
        this.showFlag = false;
        this.showIndicator('加载中...');
        this.getTaskManagementList('我的任务', this.params);
      }
    }
  }
</script>
<style lang="scss" scoped="">

  .taskManagement {
    background: #fff;
    .body-content {
      height: calc(100% - 135px);
      display: block;
      overflow: auto;
      box-sizing: border-box;
      margin-top: 45px;
      margin-bottom: 45px;
      padding-bottom: 5px;
      .list-selector {
        width: 100%;
        /*min-height: calc(100% - 45px);*/
        background: #fff;
        box-sizing: border-box;
      }
    }

    .admin-nav-main {
      position: fixed;
      z-index: 999;
      bottom: 0;
      height: 45px;
      box-sizing: border-box;
      width:100%;

      .mint-navbar .mint-tab-item.is-selected {
        border-bottom: 0 !important;
        border-top: 3px solid #26a2ff !important;
      }
    }

    .admin-nav {
      position: fixed;
      width: 100%;
      top: 45px;
      z-index: 999;
      height: 45px;
      box-sizing: border-box;
      border-top: 1px solid #e3e3e3;
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
