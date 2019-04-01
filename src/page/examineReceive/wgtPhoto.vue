<template>
  <div>

    <div class="imgLazyLoadList">
      <mt-cell>
        <div>
          <mt-button  type="default" @click.native="goBack()">返回</mt-button>
        </div>
      </mt-cell>
      <mt-cell :title="'磅单号'">
        <div >
          <input type="text" v-model="wgtlistno" >
        </div>
      </mt-cell>
      <ul>
        <li  v-for="img of picList">
          <img style="width:100%; height: 100%;" :src="img.picUrl" >
        </li>
      </ul>
    </div>

  </div>
</template>
<script>


  import HeaderSimple from '@/components/header/header-simple'
  import BodyContent from "@/components/bodyContent/body-content"
  import AttachmentsArea from '@/components/attachmentsArea/attachments-area'
  import interfaceService from '../../service/interfaceService.js'
  import axios from 'axios'

  export default {
    name: 'wgtPhoto',
    data () {
      return {
        examplename: 'wgtPhoto',
        picList: [],//保存图片
        wgtlistno:"",
        class:"",
        paramsPic: {
          "Wgtliston": "R028316",
          "UserId": "R028316"
        }
      }
    },
    mounted () {

    },
    methods: {
      init() {
        this.wgtlistno=this.$route.query.InstanceId ? this.$route.query.InstanceId : '';
        this.class=this.$route.query.class ? this.$route.query.class : '';
        this.paramsPic.Wgtliston = this.$route.query.InstanceId ? this.$route.query.InstanceId : '';
        this.paramsPic.UserId = interfaceService.getCookie("UserId");
      },
      goBack() {
        if(this.class =="Z"){
        this.$router.push({path: '/zjQuality', query: {page: 'wgtPhoto'}})
        }else{
          this.$router.push({path: '/jhQuality', query: {page: 'wgtPhoto'}})
        }
      },
      //获取判级详情
      getAcceptHistoryDetails() {
        let that = this;
        that.picList = [];
        that.showIndicator('加载中...');//显示加载提示;
        //同时执行多个请求
        axios.all([
          interfaceService.queryAcceptPicture(that.paramsPic)//依据磅单号查询图片
        ])
          .then(axios.spread(function (PictureResp) {
            that.hideIndicator();
            //图片
            that.picList = PictureResp;
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
