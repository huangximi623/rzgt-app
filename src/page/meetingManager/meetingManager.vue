<template>
  <div class="meetingManager">
    <header-simple class="list-header">
      <div class="left-button" @click="goBack()" slot="left"><i class="fa fa-chevron-left"></i></div>
      <div class="list-title" slot="title">
        {{title}}
      </div>
      <div class="right-button scanner-button" slot="right" @click="sign()" v-if="!this.is_weixin()">
        <div>扫码签到</div>
      </div>
    </header-simple>
    <div class="admin-nav-main">
      <mt-navbar v-model="selected">
        <mt-tab-item id="1">会议待确认</mt-tab-item>
        <mt-tab-item id="2">审批待办</mt-tab-item>
        <mt-tab-item id="3">已审批</mt-tab-item>
      </mt-navbar>
    </div>
    <div class="admin-nav">
      <mt-navbar v-model="confirm" v-if="selected==1">
        <mt-tab-item id="4">待确认</mt-tab-item>
        <mt-tab-item id="5">已确认</mt-tab-item>
      </mt-navbar>
    </div>
    <body-content :class="{'body-content1':(selected==1),'body-content2':(selected!=1)}">
      <div v-if="showFlag" class="imgHeight">
        <img src="../../assets/noData-white.png" style="width: 55%;"/>
      </div>

      <mt-loadmore v-else class="list-selector" :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded"
                   :auto-fill="false" ref="loadmore_meeting">
        <mt-tab-container v-model="selected">
          <!--会议待确认-->
          <mt-tab-container-item id="1">
            <mt-tab-container v-model="confirm">
              <!--待确认-->
              <mt-tab-container-item id="4">
                <div id="toConfirm">
                  <meeting-list v-for='(item,index) in meetingInfo'
                                :key="index"
                                :taskId='item.taskId'
                                :endtime='item.endtime'
                                :starttime='item.starttime'
                                :meetingStatues='item.meetingStatues'
                                :rowguid='item.rowguid'
                                :processId='item.processId'
                                :meetingroomname='item.meetingroomname'
                                :meetmotif='item.meetmotif'
                                :exp3='item.exp3'
                                :type="'4'">
                  </meeting-list>
                </div>
              </mt-tab-container-item>
              <!--已确认-->
              <mt-tab-container-item id="5">
                <div id="alreadyConfirm">
                  <meeting-list v-for='(item,index) in meetingInfo'
                                :key="index"
                                :taskId='item.taskId'
                                :endtime='item.endtime'
                                :starttime='item.starttime'
                                :meetingStatues='item.meetingStatues'
                                :rowguid='item.rowguid'
                                :processId='item.processId'
                                :meetingroomname='item.meetingroomname'
                                :meetmotif='item.meetmotif'
                                :exp3='item.exp3'
                                :type="'5'">
                  </meeting-list>
                </div>
              </mt-tab-container-item>
            </mt-tab-container>
          </mt-tab-container-item>
          <!--审批待办-->
          <mt-tab-container-item id="2">
            <div id="toApprove">
              <meeting-list v-for='(item,index) in meetingInfo'
                            :key="index"
                            :taskId='item.taskId'
                            :endtime='item.endtime'
                            :starttime='item.starttime'
                            :meetingStatues='item.meetingStatues'
                            :rowguid='item.rowguid'
                            :processId='item.processId'
                            :meetingroomname='item.meetingroomname'
                            :meetmotif='item.meetmotif'
                            :exp3='item.exp3'
                            :type="'2'">
              </meeting-list>
            </div>
          </mt-tab-container-item>
          <!--已审批-->
          <mt-tab-container-item id="3">
            <div id="alreadyApprove">
              <meeting-list v-for='(item,index) in meetingInfo'
                            :key="index"
                            :taskId='item.taskId'
                            :endtime='item.endtime'
                            :starttime='item.starttime'
                            :meetingStatues='item.meetingStatues'
                            :rowguid='item.rowguid'
                            :processId='item.processId'
                            :meetingroomname='item.meetingroomname'
                            :meetmotif='item.meetmotif'
                            :exp3='item.exp3'
                            :type="'3'">
              </meeting-list>
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
  import MeetingList from '@/components/workFlow/meeting-list.vue'
  import interfaceService from '../../service/interfaceService.js'


  export default {
    name: 'meetingManager',
    components: {HeaderSimple, BodyContent, MeetingList},
    data() {
      return {
        title: '会议管理',
        selected: '1',
        confirm: '4',
        allLoaded: false,
        showFlag: false,
        meetingInfo: [],
        params: {
          "from": "0",
          "limit": "10"
        },
        paramsSign: {
          "userId": "",
          "meetingID": "",
          "exp5": ""
        }
      }
    },
    methods: {
      goBack() {
        this.$router.push({path: '/tab/home'})
      },
      //获取会议列表
      getMeetingList(type, params) {
        let that = this;
        that.meetingInfo = [];
//        this.showIndicator('加载中...');
        interfaceService.queryMeetingManagerList(type, params)
          .then(function (response) {
            that.hideIndicator();
            that.meetingInfo = response;
            if(response.length === 0){
              that.showFlag = true;
            }else {
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
        interfaceService.queryMeetingManagerList(type, params)
          .then(function (response) {
            if (response) {
              that.hideIndicator();//隐藏加载提示
              for (let i = 0; i < response.length; i++) {
                that.meetingInfo.push(response[i])
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
            if (self.confirm === '4') {
              self.getMeetingList('待确认', self.params);
            } else if (self.confirm === '5') {
              self.getMeetingList('已确认', self.params);
            }
          } else if (self.selected === '2') {
            self.getMeetingList('审批待办', self.params);
          } else if (self.selected === '3') {
            self.getMeetingList('已审批', self.params);
          }
          self.$refs.loadmore_meeting.onTopLoaded();
        }, 1500)
      },
      //上拉加载更多
      loadBottom() {
        let self = this;
        this.params.from = (Number(this.params.limit) + Number(this.params.from)).toString();
        setTimeout(() => {
          if (self.selected === '1') {
            if (self.confirm === '4') {
              self.loadmore('待确认', self.params);
            } else if (self.confirm === '5') {
              self.loadmore('已确认', self.params);
            }
          } else if (self.selected === '2') {
            self.loadmore('审批待办', self.params);
          } else if (self.selected === '3') {
            self.loadmore('已审批', self.params);
          }
          self.$refs.loadmore_meeting.onBottomLoaded();
        }, 1500);
      },
      //二维码扫描签到
      sign() {
        let that = this;
        cordova.plugins.barcodeScanner.scan(
          function (result) {
            console.log(result);
            let meetingId = JSON.parse(result.text).meetingId;
            if (!meetingId) {
              that.showAlert("未识别出会议ID！");
            } else {
              that.paramsSign.userId = interfaceService.getCookie("Token");
              that.paramsSign.meetingID = meetingId;
              that.paramsSign.exp5 = "1";
              that.showIndicator("签到中...");
              interfaceService.queryScanMeeting(that.paramsSign).then(function (response) {
                that.hideIndicator();
                if (response.msg === 'success') {
                  that.showAlert("签到成功！请入场参会！");
                } else {
                  that.showAlert("签到失败！请重新签到！");
                }
              }, function (error) {
                that.hideIndicator();
                that.showAlert("签到失败");
              })
            }
          },
          function (error) {
            that.showAlert("扫码失败: " + error);
          },
          {
            preferFrontCamera: false, // iOS and Android,优先前置摄像头
            showFlipCameraButton: false, // iOS and Android 前后摄像头转换按钮
            showTorchButton: true, // iOS and Android 显示开启手电筒的按钮
            torchOn: false, // Android, launch with the torch switched on (if available) 默认开启手电筒
            saveHistory: true,// Android, save scan history (default false)
            prompt: "请将二维码放在扫描框中", // Android 提示信息
            resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500 多久开始识别
            formats: "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
            orientation: "portrait", // Android only (portrait|landscape), default unset so it rotates with the device 垂直还是水平
            disableAnimations: false, // iOS
            disableSuccessBeep: true // iOS
          }
        );
      }
    },
    watch: {
      //监听选项卡的切换
      selected(newval, oldval) {
        console.log(newval);
        // this.meetingInfo = [];
        this.allLoaded = false;
        this.showFlag = false;
        this.params = {
          "from": "0",
          "limit": "10"
        };

        if (newval === '1') {
          if (this.confirm === '4') {
            this.showIndicator('加载中...');
            this.getMeetingList('待确认', this.params);
          } else if (this.confirm === '5') {
            this.showIndicator('加载中...');
            this.getMeetingList('已确认', this.params);
          }
        } else if (newval === '2') {
          this.showIndicator('加载中...');
          this.getMeetingList('审批待办', this.params);
        } else if (newval === '3') {
          this.showIndicator('加载中...');
          this.getMeetingList('已审批', this.params);
        }
      },
      confirm(newval, oldval) {
        this.meetingInfo = [];
        this.allLoaded = false;
        this.showFlag = false;
        this.params = {
          "from": "0",
          "limit": "10"
        };
        switch (newval) {
          case '4':
            this.showIndicator('加载中...');
            this.getMeetingList('待确认', this.params);
            break;
          case '5':
            this.showIndicator('加载中...');
            this.getMeetingList('已确认', this.params);
            break;
          default:
            break;
        }
      }
    },
    activated() {
      if (this.$route.query.page !== 'meetingManagerDetails' || this.is_weixin()) {
        this.selected = '1';
        this.confirm = '4';
        this.params = {
          "from": "0",
          "limit": "10"
        };
        this.allLoaded = false;
        this.showFlag = false;
        this.showIndicator('加载中...');
        this.getMeetingList('待确认', this.params);
      }
    }
  }
</script>
<style lang="scss" scoped="">
  .meetingManager {
    background: #fff;
    .scanner-button{
      width: 60px!important;
    }
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
      z-index: 999;
      top: 45px;
      height: 45px;
      box-sizing: border-box;
      width:100%;
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
