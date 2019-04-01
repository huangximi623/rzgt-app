<template>
  <div class="acceptHistoryDetail">
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
      <!--图片区-->
      <div class="procedureRecord">
        <span><label class="margin-left-5">图片区</label></span>
      </div>
      <photo-swiper ref="photoRef"></photo-swiper>
      <div class="detailRecord">
        <span><label class="margin-left-5">详情区</label></span>
      </div>
      <mt-cell v-for="(item,index) in acceptHistoryInfo" :key="index" :title="item.key" :value="item.value"></mt-cell>
    </body-content>

  </div>
</template>

<script>
  import HeaderSimple from '@/components/header/header-simple'
  import PhotoSwiper from '@/components/mySwiper/photo-swiper'
  import BodyContent from "@/components/bodyContent/body-content"
  import interfaceService from '../../service/interfaceService.js'
  import axios from 'axios'

  export default {
    name: 'acceptHistoryDetail',
    data() {
      return {
        title: '详细信息',
        buttonTitle: '废钢验收',
        acceptHistoryInfo: [],
        picList: [],//保存图片
        swipePic: [],//接口返回的图片信息
        paramsDetail: {
          "MethodId": "1",
          "action": "0",
          "UserId": "",
          "InstanceId": ""
        },
        paramsPic: {
          "Wgtliston": "",
          "UserId": ""
        }
      }
    },
    components: {HeaderSimple, PhotoSwiper, BodyContent},
    methods: {
      init() {
        this.paramsDetail.InstanceId = this.$route.query.InstanceId ? this.$route.query.InstanceId : '';
        this.paramsDetail.UserId = interfaceService.getCookie("UserId");
        this.paramsPic.Wgtliston = this.paramsDetail.InstanceId;
        this.paramsPic.UserId = interfaceService.getCookie("UserId");
        // this.paramsPic.Wgtliston = this.paramsDetail.InstanceId;
      },
      goBack() {
        this.$router.push({path: '/acceptHistory', query: {page: 'acceptHistoryDetail'}})
      },
      //下载图片
      getPhotoSwipePicture(picture, arr) {
        let that = this;
        let fileTransfer = new FileTransfer();
        let url = encodeURI(picture.picUrl);
        let targetPath;
        targetPath = cordova.file.dataDirectory;
        alert(targetPath);
        let fileURL = encodeURI(targetPath + picture.docId + '.jpg');
        let trustHosts = true;
        let options = {};
        fileTransfer.download(
          url,
          fileURL,
          function (entry) {
            console.log("文件下载完成: " + entry.toURL());
            arr.push({docId: picture.docId, picUrl: entry.toURL()});//将下载后的图片ID及地址存储起来
            interfaceService.setCookie("downloadPictureUrl", JSON.stringify(arr), 365);
            that.$refs.photoRef.photoList = arr;
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
      //获取验证历史数据详情
      getAcceptHistoryDetails() {
        let that = this;
        that.acceptHistoryInfo = [];
        that.swipePic = [];
        that.showIndicator('加载中...');//显示加载提示;
        //同时执行多个请求
        axios.all([
          interfaceService.queryAcceptHistoryDetail(that.paramsDetail),////获取判级详情
          interfaceService.queryAcceptPicture(that.paramsPic)//依据磅单号查询图片
        ])
          .then(axios.spread(function (detailsResp, PictureResp) {
            that.hideIndicator();
            //详情
            that.acceptHistoryInfo = detailsResp;
            //图片
            that.swipePic = PictureResp;
            //判断是客户端访问还是pc端或微信访问
            if (!that.is_pc() && !that.is_weixin()) { //客户端访问
              that.picList = [];//清空picList
              for (let i = 0; i < that.swipePic.length; i++) {
                that.getPhotoSwipePicture(that.swipePic[i], that.picList);
              }
            } else { //微信或pc端访问
              that.$refs.photoRef.photoList = that.swipePic;
            }
          }), function (error) {
            that.hideIndicator();
            that.showAlert("数据加载失败");
          });
      }
    },
    activated() {
      this.init();
      this.getAcceptHistoryDetails();
    }
  }
</script>
<style lang="scss" scoped="">
  .acceptHistoryDetail {
    background: #fff;
    .body-content {
      height: calc(100% - 45px);
      display: block;
      overflow: auto;
      box-sizing: border-box;
      margin-top: 0px;
    }

    .haveFootButton-heigth {
      height: calc(100% - 90px);
    }

    .noFootButton-heigth {
      height: calc(100% - 45px);
    }
  }

</style>
