<template>
  <div class="receptionManager">
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
        <mt-tab-item id="1">待办</mt-tab-item>
        <mt-tab-item id="2">已办</mt-tab-item>
        <mt-tab-item id="3">告知</mt-tab-item>
      </mt-navbar>
    </div>
    <div class="admin-nav">
      <mt-navbar v-model="inform" v-if="selected==3">
        <mt-tab-item id="4">未阅</mt-tab-item>
        <mt-tab-item id="5">已阅</mt-tab-item>
      </mt-navbar>
    </div>
    <body-content :class="{'body-content1':(selected==3),'body-content2':(selected!=3)}">
      <div v-if="showFlag" class="imgHeight">
        <img src="../../assets/noData-white.png" style="width: 55%;"/>
      </div>
      <mt-loadmore v-else class="list-selector" :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded"
                   :auto-fill="false" ref="loadmore_reception">
        <!-- tab-container -->
        <mt-tab-container v-model="selected">
          <!--待办-->
          <mt-tab-container-item id="1">
            <div id="todo">
              <reception-list v-for='(item,index) in receptionInfo'
                              :key="index"
                              :comeDept='item.comeDept'
                              :comeLiaisons='item.comeLiaisons'
                              :receiveTypename='item.receiveTypename'
                              :comeEndtime='item.comeEndtime'
                              :state='item.state'
                              :comeMainleaderName='item.comeMainleaderName'
                              :comeMainleaderLevel='item.comeMainleaderLevel'
                              :riderPlatenumber='item.riderPlatenumber'
                              :startTime='item.startTime'
                              :comeStarttime='item.comeStarttime'
                              :isDeputyapproval='item.isDeputyapproval'
                              :comeNumber='item.comeNumber'
                              :createDate='item.createDate'
                              :aliveFlag='item.aliveFlag'
                              :taskId='item.taskId'
                              :togetherPeople='item.togetherPeople'
                              :comeLiaisonsTelephone='item.comeLiaisonsTelephone'
                              :receiveType='item.receiveType'
                              :instanceId='item.instanceId'
                              :applyDeptname='item.applyDeptname'
                              :riderNubmer='item.riderNubmer'
                              :updateDate='item.updateDate'
                              :createDeptcode='item.createDeptcode'
                              :applyContactway='item.applyContactway'
                              :updateDeptcode='item.updateDeptcode'
                              :createUser='item.createUser'
                              :applyName='item.applyName'
                              :receiveGuid='item.receiveGuid'
                              :applyDeptcode='item.applyDeptcode'
                              :ROWNUM_='item.ROWNUM_'
                              :companyAccompanied='item.companyAccompanied'
                              :reveiveLevel='item.reveiveLevel'
                              :reveiveLevelname='item.reveiveLevelname'
                              :applyCode='item.applyCode'
                              :riderModel='item.riderModel'
                              :updateUser='item.updateUser'
                              :typeFlag="'todo'">
              </reception-list>
            </div>
          </mt-tab-container-item>
          <!--已办-->
          <mt-tab-container-item id="2">
            <div id="done">
              <reception-list v-for='(item,index) in receptionInfo'
                              :key="index"
                              :comeDept='item.comeDept'
                              :comeLiaisons='item.comeLiaisons'
                              :receiveTypename='item.receiveTypename'
                              :comeEndtime='item.comeEndtime'
                              :state='item.state'
                              :comeMainleaderName='item.comeMainleaderName'
                              :comeMainleaderLevel='item.comeMainleaderLevel'
                              :riderPlatenumber='item.riderPlatenumber'
                              :startTime='item.startTime'
                              :comeStarttime='item.comeStarttime'
                              :isDeputyapproval='item.isDeputyapproval'
                              :comeNumber='item.comeNumber'
                              :createDate='item.createDate'
                              :aliveFlag='item.aliveFlag'
                              :taskId='item.taskId'
                              :togetherPeople='item.togetherPeople'
                              :comeLiaisonsTelephone='item.comeLiaisonsTelephone'
                              :receiveType='item.receiveType'
                              :instanceId='item.instanceId'
                              :applyDeptname='item.applyDeptname'
                              :riderNubmer='item.riderNubmer'
                              :updateDate='item.updateDate'
                              :createDeptcode='item.createDeptcode'
                              :applyContactway='item.applyContactway'
                              :updateDeptcode='item.updateDeptcode'
                              :createUser='item.createUser'
                              :applyName='item.applyName'
                              :receiveGuid='item.receiveGuid'
                              :applyDeptcode='item.applyDeptcode'
                              :ROWNUM_='item.ROWNUM_'
                              :companyAccompanied='item.companyAccompanied'
                              :reveiveLevel='item.reveiveLevel'
                              :reveiveLevelname='item.reveiveLevelname'
                              :applyCode='item.applyCode'
                              :riderModel='item.riderModel'
                              :updateUser='item.updateUser'
                              :typeFlag="'done'">
              </reception-list>
            </div>
          </mt-tab-container-item>
          <!--告知-->
          <mt-tab-container-item id="3">
            <mt-tab-container v-model="inform">
              <!--未阅-->
              <mt-tab-container-item id="4">
                <div id="NotRead">
                  <reception-list v-for='(item,index) in receptionInfo'
                                  :key="index"
                                  :comeDept='item.comeDept'
                                  :comeLiaisons='item.comeLiaisons'
                                  :receiveTypename='item.receiveTypename'
                                  :comeEndtime='item.comeEndtime'
                                  :state='item.state'
                                  :comeMainleaderName='item.comeMainleaderName'
                                  :comeMainleaderLevel='item.comeMainleaderLevel'
                                  :riderPlatenumber='item.riderPlatenumber'
                                  :startTime='item.startTime'
                                  :comeStarttime='item.comeStarttime'
                                  :isDeputyapproval='item.isDeputyapproval'
                                  :comeNumber='item.comeNumber'
                                  :createDate='item.createDate'
                                  :aliveFlag='item.aliveFlag'
                                  :taskId='item.taskId'
                                  :togetherPeople='item.togetherPeople'
                                  :comeLiaisonsTelephone='item.comeLiaisonsTelephone'
                                  :receiveType='item.receiveType'
                                  :instanceId='item.instanceId'
                                  :applyDeptname='item.applyDeptname'
                                  :riderNubmer='item.riderNubmer'
                                  :updateDate='item.updateDate'
                                  :createDeptcode='item.createDeptcode'
                                  :applyContactway='item.applyContactway'
                                  :updateDeptcode='item.updateDeptcode'
                                  :createUser='item.createUser'
                                  :applyName='item.applyName'
                                  :receiveGuid='item.receiveGuid'
                                  :applyDeptcode='item.applyDeptcode'
                                  :ROWNUM_='item.ROWNUM_'
                                  :companyAccompanied='item.companyAccompanied'
                                  :reveiveLevel='item.reveiveLevel'
                                  :reveiveLevelname='item.reveiveLevelname'
                                  :applyCode='item.applyCode'
                                  :riderModel='item.riderModel'
                                  :updateUser='item.updateUser'
                                  :typeFlag="'NotRead'">
                  </reception-list>
                </div>
              </mt-tab-container-item>
              <!--已阅-->
              <mt-tab-container-item id="5">
                <div id="Read">
                  <reception-list v-for='(item,index) in receptionInfo'
                                  :key="index"
                                  :comeDept='item.comeDept'
                                  :comeLiaisons='item.comeLiaisons'
                                  :receiveTypename='item.receiveTypename'
                                  :comeEndtime='item.comeEndtime'
                                  :state='item.state'
                                  :comeMainleaderName='item.comeMainleaderName'
                                  :comeMainleaderLevel='item.comeMainleaderLevel'
                                  :riderPlatenumber='item.riderPlatenumber'
                                  :startTime='item.startTime'
                                  :comeStarttime='item.comeStarttime'
                                  :isDeputyapproval='item.isDeputyapproval'
                                  :comeNumber='item.comeNumber'
                                  :createDate='item.createDate'
                                  :aliveFlag='item.aliveFlag'
                                  :taskId='item.taskId'
                                  :togetherPeople='item.togetherPeople'
                                  :comeLiaisonsTelephone='item.comeLiaisonsTelephone'
                                  :receiveType='item.receiveType'
                                  :instanceId='item.instanceId'
                                  :applyDeptname='item.applyDeptname'
                                  :riderNubmer='item.riderNubmer'
                                  :updateDate='item.updateDate'
                                  :createDeptcode='item.createDeptcode'
                                  :applyContactway='item.applyContactway'
                                  :updateDeptcode='item.updateDeptcode'
                                  :createUser='item.createUser'
                                  :applyName='item.applyName'
                                  :receiveGuid='item.receiveGuid'
                                  :applyDeptcode='item.applyDeptcode'
                                  :ROWNUM_='item.ROWNUM_'
                                  :companyAccompanied='item.companyAccompanied'
                                  :reveiveLevel='item.reveiveLevel'
                                  :reveiveLevelname='item.reveiveLevelname'
                                  :applyCode='item.applyCode'
                                  :riderModel='item.riderModel'
                                  :updateUser='item.updateUser'
                                  :typeFlag="'Read'">
                  </reception-list>
                </div>
              </mt-tab-container-item>
            </mt-tab-container>
          </mt-tab-container-item>
        </mt-tab-container>
      </mt-loadmore>
    </body-content>
  </div>
</template>

<script>
  import HeaderSimple from '@/components/header/header-simple'
  import BodyContent from "@/components/bodyContent/body-content"
  import receptionList from '@/components/workFlow/reception-list.vue'
  import interfaceService from '../../service/interfaceService.js'


  export default {
    name: 'receptionManager',
    components: {HeaderSimple, BodyContent, receptionList},
    data() {
      return {
        title: '接待信息',
        selected: '1',
        inform: '4',
        allLoaded: false,
        showFlag: false,
        receptionInfo: [],
        params: {
          "from": "0",
          "limit": "10"
        }
      }
    },
    methods: {
      goBack() {
        this.$router.push({path: '/tab/home'})
      },
      //获取接待列表
      getReceptionList(type, params) {
        let that = this;
        that.receptionInfo = [];
//        this.showIndicator('加载中...');
        interfaceService.queryReceptionManagerList(type, params)
          .then(function (response) {
            that.hideIndicator();
            that.receptionInfo = response;
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
//        this.showIndicator('加载中...');//显示加载提示
        interfaceService.queryReceptionManagerList(type, params)
          .then(function (response) {
            if (response) {
              that.hideIndicator();//隐藏加载提示
              for (let i = 0; i < response.length; i++) {
                that.receptionInfo.push(response[i])
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
          "limit": "10"
        };
        setTimeout(() => {
          if (self.selected === '1') {
            self.getReceptionList('待办', self.params);
          } else if (self.selected === '2') {
            self.getReceptionList('已办', self.params);
          } else if (self.selected === '3') {
            if (self.inform === '4') {
              self.getReceptionList('未阅', self.params);
            } else if (self.inform === '5') {
              self.getReceptionList('已阅', self.params);
            }
          }
          self.$refs.loadmore_reception.onTopLoaded();
        }, 1500)
      },

      //上拉加载更多
      loadBottom() {
        let self = this;
        this.params.from = (Number(this.params.limit) + Number(this.params.from)).toString();
        setTimeout(() => {
          if (self.selected === '1') {
            self.loadmore('待办', self.params);
          } else if (self.selected === '2') {
            self.loadmore('已办', self.params);
          } else if (self.selected === '3') {
            if (self.inform === '4') {
              self.loadmore('未阅', self.params);
            } else if (self.inform === '5') {
              self.loadmore('已阅', self.params);
            }
          }
          self.$refs.loadmore_reception.onBottomLoaded();
        }, 1500);
      }
    },
    watch: {
      //监听选项卡的切换
      selected(newval, oldval) {
        this.allLoaded = false;
        this.showFlag = false;
        this.params = {
          "from": "0",
          "limit": "10"
        };

        if (newval === '1') {
          this.showIndicator('加载中...');
          this.getReceptionList('待办', this.params);
        } else if (newval === '2') {
          this.showIndicator('加载中...');
          this.getReceptionList('已办', this.params);
        } else if (newval === '3') {
          if (this.inform === '4') {
            this.showIndicator('加载中...');
            this.getReceptionList('未阅', this.params);
          } else if (this.inform === '5') {
            this.showIndicator('加载中...');
            this.getReceptionList('已阅', this.params);
          }
        }
      },
      inform(newval, oldval) {
        this.receptionInfo = [];
        this.allLoaded = false;
        this.showFlag = false;
        this.params = {
          "from": "0",
          "limit": "10"
        };
        switch (newval) {
          case '4':
            this.showIndicator('加载中...');
            this.getReceptionList('未阅', this.params);
            break;
          case '5':
            this.showIndicator('加载中...');
            this.getReceptionList('已阅', this.params);
            break;
          default:
            break;
        }
      },
    },
    activated() {
      if (this.$route.query.page !== 'receptionManagerDetails' || this.is_weixin()) {
        if (this.$route.query.page === 'receptionToNotRead') {
          this.selected = '3';
          this.inform = '4';
          this.params = {
            "from": "0",
            "limit": "10"
          };
          this.allLoaded = false;
          this.showFlag = false;
          this.showIndicator('加载中...');
          this.getReceptionList('未阅', this.params);
        } else {
          this.selected = '1';
          this.inform = '4';
          this.params = {
            "from": "0",
            "limit": "10"
          };
          this.allLoaded = false;
          this.showFlag = false;
          this.showIndicator('加载中...');
          this.getReceptionList('待办', this.params);
        }

      }
    }
  }
</script>
<style lang="scss" scoped="">

  .receptionManager {
    background: #fff;
    .body-content1 {
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
    .body-content2 {
      height: calc(100% - 90px);
      display: block;
      overflow: auto;
      box-sizing: border-box;
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
      width: 100%;
      bottom: 0;
      z-index: 999;

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
