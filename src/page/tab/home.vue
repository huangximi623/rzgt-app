<template>
  <div class="home">
    <header-simple class="list-header">
      <div class="left-button" slot="left"></div>
      <div class="list-title" slot="title">
        {{title}}
      </div>
      <div class="right-button" slot="right"></div>
    </header-simple>
    <body-content class="body-content">
      <my-swiper ref="swipeRef"></my-swiper>
      <div class="index-info-list clearfix content-guide">
        <content-Guide ref="contentGuide"></content-Guide>
      </div>
    </body-content>
    <!--版本更新弹窗显示-->
    <mt-popup
      class="version-pop"
      v-model="popupVisible"
      popup-transition="popup-fade"
      :closeOnClickModal="false">
      <div class="update-title">提示</div>
      <div class="update-content">有新版本更新--v{{versionInfo.Version}}</div>
      <!--强制更新-->
      <div class="update-force" v-if="versionInfo.ForceUpdate == 'Y'">
        <a :href="versionInfo.AndroidDownUrl" v-if="this.isAndroidMachine()">
          <div>更新</div>
        </a>
        <a :href="versionInfo.IOSDownUrl" v-if="this.isiOSMachine()">
          <div>更新</div>
        </a>
      </div>
      <!--非强制更新-->
      <div class="update-cancel" v-else>
        <div class="update-button">
          <a :href="versionInfo.AndroidDownUrl" v-if="this.isAndroidMachine()">
            <div>更新</div>
          </a>
          <a :href="versionInfo.IOSDownUrl" v-if="this.isiOSMachine()">
            <div>更新</div>
          </a>
        </div>
        <div class="cancel-button" @click="cancelUpdate()">
          取消
        </div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
  import HeaderSimple from '@/components/header/header-simple'
  import MySwiper from '@/components/mySwiper/my-swiper'
  import BodyContent from '@/components/bodyContent/body-content'
  import ContentGuide from '@/components/contentGuide/content-Guide'
  import interfaceService from '../../service/interfaceService.js'
  import config from '../../config/config.json'
  import axios from 'axios'

  export default {
    name: 'home',
    data() {
      return {
        title: '首页',
        popupVisible: false,
        versionInfo: {},
        pictureList: [],//保存图片
        swipePicture: []//接口返回的图片信息
      }
    },
    components: {HeaderSimple, MySwiper, BodyContent, ContentGuide},
    methods: {
      //比对图片，查看是否需要更新
      comparePicture(local, resp) {
        let tempEqual = [];//存放相同元素
        for (let i = 0; i < resp.length; i++) {
          for (let j = 0; j < local.length; j++) {
            if (local[j].docId === resp[i].docId) {
              tempEqual.push(local[j]);//插入相同id图片
              this.$refs.swipeRef.swipeList = tempEqual;//赋值
              break;
            } else {
              if (j === local.length - 1) {
                this.getSwipePicture(resp[i], tempEqual);//下载图片
              }
            }
          }
        }
      },
      //下载图片
      getSwipePicture(picture, arr) {
        let that = this;
        let fileTransfer = new FileTransfer();
        let url = encodeURI(picture.picUrl);
        let targetPath;
        targetPath = cordova.file.dataDirectory;
        let fileURL = encodeURI(targetPath + picture.docId + '.jpg');
        let trustHosts = true;
        let options = {};
        fileTransfer.download(
          url,
          fileURL,
          function (entry) {
            console.log("文件下载完成: " + entry.toURL());
            arr.push({docId: picture.docId, picUrl: entry.toURL(), title: picture.title});//将下载后的图片ID及地址存储起来
            interfaceService.setCookie("downloadPictureUrl", JSON.stringify(arr), 365);
            that.$refs.swipeRef.swipeList = arr;
          },
          function (error) {
            console.log("文件下载失败！");
            console.log("download error source " + error.source);
            console.log("download error target " + error.target);
            console.log("download error code" + error.code);
          },
          trustHosts,
          options
        );
      },
      //获取版本，并调用其他接口
      getLatestVersion() {
        let that = this;
        // that.showIndicator("加载中...");
        interfaceService.getLatestVersion()
          .then(function (response) {
            that.versionInfo = response;
            interfaceService.setVersion(response);//保存版本信息
            //如果有更新，提示用户更新
            if ((response.Version > config.currentVersion) && !interfaceService.cancelUpdateFlag && !that.is_weixin() && !that.is_pc()) {
              that.hideIndicator();
              that.popupVisible = true;
              // that.updateAlert(response.UpdateInfo, response.AndroidDownUrl, response.IOSDownUrl);
            } else {
              //获取首页数据
              that.getAllData();
            }
          }, function (error) {
            that.hideIndicator();
            // that.showToast("获取最新版本号失败！");
          });
      },

      //获取首页数据
      getAllData() {
        let that = this;
        //同时执行多个请求
        axios.all([
          interfaceService.queryHomeData('WFandCWCR'),//获取行政审批、公文审批、公文阅知待办数量
          interfaceService.queryHomeData('JD'),//获取接待管理待办数量
          interfaceService.queryHomeData('Meeting'),//获取会议管理待办数量
          interfaceService.queryHomeData('JB'),//获取任务管理待办数量
          interfaceService.queryNewsChanelList('IW'),//获取信息发布中心是否有新信息的标志
          interfaceService.queryFirstPageNewRemark(),//获取文档中心是否有新信息的标志
          interfaceService.queryPictureNews(),//获取轮播图
          interfaceService.queryPersonList({queryValue: interfaceService.getCookie("UserId")})//查询登陆人信息并保存
        ])
          .then(axios.spread(function (wfResp, jdResp, meetResp, jbResp, IWResp, DOCResp, PictureResp, personResp) {
            that.hideIndicator();
            //行政审批、公文管理、公文阅知
            for (let i = 0; i < wfResp.length; i++) {
              let wfindex = that.getIndex(that.$refs.contentGuide.contentList, wfResp[i].label);
              that.$refs.contentGuide.contentList[wfindex].newMessages = wfResp[i].count;
            }
            //接待管理
            let jdindex = that.getIndex(that.$refs.contentGuide.contentList, 'JD');
            that.$refs.contentGuide.contentList[jdindex].newMessages = jdResp.taskCount;
            //会议管理
            let Mindex = that.getIndex(that.$refs.contentGuide.contentList, 'Meeting');
            that.$refs.contentGuide.contentList[Mindex].newMessages = meetResp.taskCount;
            //任务管理
            let JBindex = that.getIndex(that.$refs.contentGuide.contentList, 'JB');
            that.$refs.contentGuide.contentList[JBindex].newMessages = jbResp.taskCount;
            //信息发布中心
            let IWindex = that.getIndex(that.$refs.contentGuide.contentList, 'IW');
            that.$refs.contentGuide.contentList[IWindex].newMessages = '';
            for (let i = 0; i < IWResp.length; i++) {
              if (IWResp[i].isnew === '1') {
                that.$refs.contentGuide.contentList[IWindex].newMessages = 'new';
              }
            }
            //文档中心
            let DOCindex = that.getIndex(that.$refs.contentGuide.contentList, 'DOC');
            that.$refs.contentGuide.contentList[DOCindex].newMessages = '';
            if (DOCResp[0].isnew === '1') {
              that.$refs.contentGuide.contentList[DOCindex].newMessages = 'new';
            }
            //轮播图
            that.swipePicture = PictureResp;
            //判断是客户端访问还是pc端或微信访问
            if (!that.is_pc() && !that.is_weixin()) { //客户端访问
              that.pictureList = [];//清空pictureList
              if (interfaceService.getCookie("downloadPictureUrl") && interfaceService.getCookie("downloadPictureUrl").length !== 0) {
                let localStorage = JSON.parse(interfaceService.getCookie("downloadPictureUrl"));
                that.comparePicture(localStorage, that.swipePicture);//比对图片，查看是否需要更新
              } else {
                for (let i = 0; i < that.swipePicture.length; i++) {
                  that.getSwipePicture(that.swipePicture[i], that.pictureList);
                }
              }
            } else { //微信或pc端访问
              that.$refs.swipeRef.swipeList = that.swipePicture;
            }

            //保存用户信息
            interfaceService.setPersonInfo(personResp);
          }), function (error) {
            that.hideIndicator();
            that.showAlert("数据加载失败");
          });
      },
      //获取下标
      getIndex(arr, value) {
        let index;
        for (let i = 0; i < arr.length; i++) {
          if (value === arr[i].label) {
            index = i;
            return index;
          }
        }
        return -1;
      },
      //获取行政审批、公文管理、公文阅知的待办数量
      getOADaiban(type) {
        let that = this;
        that.showIndicator("加载中...");
        interfaceService.queryHomeData(type)
          .then(function (response) {
              that.hideIndicator();
              for (let i = 0; i < response.length; i++) {
                let index = that.getIndex(that.$refs.contentGuide.contentList, response[i].label);
                that.$refs.contentGuide.contentList[index].newMessages = response[i].count;
              }
            }, function (error) {
              that.hideIndicator();
            }
          );
      },
      //获取接待管理的待办数量
      getJDTaskCount(type) {
        let that = this;
        that.showIndicator("加载中...");
        interfaceService.queryHomeData(type)
          .then(function (response) {
            that.hideIndicator();
            let index = that.getIndex(that.$refs.contentGuide.contentList, 'JD');
            that.$refs.contentGuide.contentList[index].newMessages = response.taskCount;
          }, function (error) {
            that.hideIndicator();
          });
      },
      //获取会议管理的待办数量
      getMeetingTaskCount(type) {
        let that = this;
        that.showIndicator("加载中...");
        interfaceService.queryHomeData(type)
          .then(function (response) {
            that.hideIndicator();
            let index = that.getIndex(that.$refs.contentGuide.contentList, 'Meeting');
            that.$refs.contentGuide.contentList[index].newMessages = response.taskCount;
          }, function (error) {
            that.hideIndicator();
          });
      },

      //获取废钢验收模块权限
      getSteelRecAuthority(){
        let that = this;
        let userId = interfaceService.getCookie("UserId");
        interfaceService.getAuthorityFlagApi(userId)
          .then(function (response) {
            let res = response.flag;
            return res;
          }, function (error) {
            resturn -1;
          });
      },

      //取消更新
      cancelUpdate() {
        interfaceService.cancelUpdateFlag = true;
        this.popupVisible = false;
        //获取首页数据
        this.getAllData();
      }
    },
    activated() {
      // this.$refs.contentGuide.contentList.pop();
/*      let resAuth = this.getSteelRecAuthority();
      if( resAuth === '0'){
        this.$refs.contentGuide.contentList.pop();
      }*/
      this.popupVisible = false;
      this.hideIndicator();//隐藏前一个页面的加载提示
      if (this.is_weixin()) {
        let that = this;
        that.showIndicator('加载中...');//显示加载提示;
        interfaceService.weChatLogin({"LgnType": "WeChat"})
          .then(function (response) {
            that.hideIndicator();
            //微信登陆，code为2时，更新UserId和Token;为1时,使用原有UserId和Token
            if (response.code === '2') {
              interfaceService.setCookie("UserId", response.result.UserId.value, (response.result.UserId.maxage) / (60 * 60 * 24));
              interfaceService.setCookie("Token", response.result.Token.value, (response.result.Token.maxage) / (60 * 60 * 24));
            }
            that.getLatestVersion();
          }, function (error) {
            that.hideIndicator();
            that.showAlert("数据加载失败");
          });
      } else {
        this.getLatestVersion();
      }
    }
  }
</script>
<style lang="scss" scoped>
  .home {
    width: 100%;
    height: 100%;
    background: #fff;
    .body-content {
      margin-bottom: 55px;
      height: calc(100% - 100px);
      display: block;
      overflow: auto;
      box-sizing: border-box;
      .content-guide {
        margin-top: 200px;
      }
    }
    .version-pop {
      width: 80%;
      height: auto;
      min-height: 100px;
      border-radius: 10px;
      text-align: center;
      line-height: 2;
      .update-title {
        font-weight: bold;
        margin: 10px;
        font-size: 16px;
      }
      .update-content {
        color: #888888;
        margin: 10px;
      }
      .update-force {
        border-top: 1px solid #ccc;
        padding: 10px;
        height: 45px;
        a {
          text-decoration: none;
          color: #1e8fe1;
        }
      }
      .update-cancel {
        border-top: 1px solid #ccc;
        padding: 10px;
        height: 45px;
        .update-button {
          float: left;
          width: calc(50% - 10px);
          a {
            text-decoration: none;
            color: #1e8fe1;
          }
        }
        .update-button:active {
          background: #E6E6E6;
        }
        .cancel-button {
          float: right;
          width: calc(50% - 10px);
        }
        .cancel-button:active {
          background: #E6E6E6;
        }
      }
    }
  }

</style>
