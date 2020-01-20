<template>
  <div class="auditAccept">
    <header-simple class="list-header">
      <div class="left-button" @click="goBack()" slot="left"><i class="fa fa-chevron-left"></i></div>
      <div class="list-title" slot="title">
        {{title}}
      </div>
      <div class="right-button scanner-button" slot="right" @click="sign()" v-if="!this.is_weixin()">
        <div>扫码识别</div>
      </div>
    </header-simple>

    <body-content class="body-content">

      <mt-cell title="磅单号">
        <input v-model="weightnote" type="text" maxlength="10" size="15" class="mint-field-core" style="border: 1px solid gray;">
      </mt-cell>

      <mt-cell title="厂商">
        <input v-model="manufacturer" type="text" maxlength="10" size="15" class="mint-field-core" style="border: 1px solid gray;">
      </mt-cell>

      <mt-cell title="品名">
        <input v-model="goodsname" type="text" maxlength="10" size="15" class="mint-field-core" style="border: 1px solid gray;">
      </mt-cell>

      <mt-cell title="等级">
        <input v-model="grade" type="text" size="15" class="mint-field-core" style="border: 1px solid gray;">
      </mt-cell>

      <mt-cell title="等级比例">
        <input v-model="gradeproportion" type="text" size="15" class="mint-field-core" style="border: 1px solid gray;">
      </mt-cell>

      <mt-cell title="等级比例">
        <input v-model="gradeproportion" type="text" size="15" class="mint-field-core" style="border: 1px solid gray;">
      </mt-cell>
      <mt-cell title="等级比例">
        <input v-model="gradeproportion" type="text" size="15" class="mint-field-core" style="border: 1px solid gray;">
      </mt-cell>
      <mt-cell title="等级比例">
        <input v-model="gradeproportion" type="text" size="15" class="mint-field-core" style="border: 1px solid gray;">
      </mt-cell>      <mt-cell title="等级比例">
      <input v-model="gradeproportion" type="text" size="15" class="mint-field-core" style="border: 1px solid gray;">
    </mt-cell>
      <mt-cell title="等级比例">
        <input v-model="gradeproportion" type="text" size="15" class="mint-field-core" style="border: 1px solid gray;">
      </mt-cell>
      <mt-cell title="等级比例">
        <input v-model="gradeproportion" type="text" size="15" class="mint-field-core" style="border: 1px solid gray;">
      </mt-cell>
      <mt-cell title="等级比例">
      <input v-model="gradeproportion" type="text" size="15" class="mint-field-core" style="border: 1px solid gray;">
      </mt-cell>

      <mt-cell title="拆解标记">
          <label class="mint-switch">
            <input v-model="remark1" type="checkbox" class="mint-switch-input">
            <span class="mint-switch-core"></span>
            <div class="mint-switch-label"></div>
          </label>
      </mt-cell>

      <mt-cell title="是否密封件">
        <label class="mint-switch">
          <input v-model="remark2" type="checkbox" class="mint-switch-input">
          <span class="mint-switch-core"></span>
          <div class="mint-switch-label"></div>
        </label>
      </mt-cell>

<!--      <mt-cell title="文件">
        <input type="file" class="mint-field-core" maxlength="10" size="15" style="border: 1px solid gray;">
      </mt-cell>-->

      <mt-cell title="日期">
        <input type="date" class="mint-field-core" maxlength="10" size="15" style="border: 1px solid gray;background: white;">
      </mt-cell>

      <mt-cell title="选择">
        <select v-model="selected" style="height:40px; width:180px; background: white;font-size: 18px;">
          <option v-for="item in optList">{{ item }}</option>
        </select>
      </mt-cell>
<!--      <mt-cell>
        <button class="mint-button mint-button&#45;&#45;primary mint-button&#45;&#45;small" @click="determine">
          <label class="mint-button-text">判级</label>
        </button>
      </mt-cell>-->
    </body-content>

<!--    <div id="determine-button">
      <ul class="oneButtonUl">
        <li @click="toRead({'receiveGuid':receiveGuid,'userId':UserId})" class="btn-active">
          <span class="sclass">判级</span>
        </li>
      </ul>
    </div>-->

    <determine-button :footButton="auditAcceptInfo.caozuo" :buttonTitle="buttonTitle"
                 :taskId="paramsSign.weightId"></determine-button>

  </div>
</template>

<script>
  import HeaderSimple from '@/components/header/header-simple'
  import BodyContent from "@/components/bodyContent/body-content"
  import DetermineButton from '@/components/footer/determineButton'
  import FootButton from '@/components/footer/footButton'
  import interfaceService from '../../service/interfaceService.js'

  export default {
    name: 'auditAccept',
    components: {HeaderSimple, BodyContent, DetermineButton, FootButton},
    data() {
      return {
        title: 'T4验收',
        buttonTitle: '质检',
        allLoaded: false,
        showFlag: false,
        examineInfo: [],
        weightnote: '123456',
        manufacturer: '日照钢铁集团',
        goodsname: '型材',
        carnumber: '',
        grade: '3',
        gradeproportion: '50',
        deductwater: '',
        deductmix: '',
        deductchunk: '',
        remark1: false,
        remark2: false,
        paramsSign: {
          "userId": "",
          "weightId": "",
        },
        auditAcceptInfo: {
          "caozuo": [
            {
            "name": "判级",
              }
              ]
        },
        selected: '--请选择--',
        optList: ['--请选择--','青龙', '白虎', '朱雀', '玄武']
      }
    },
    methods: {
      goBack() {
        this.$router.push({path: '/examineReceive'})
      },
      //获取磅单信息
      getWeightNoteInfo(params) {
        let that = this;
        that.examineInfo = [];
//        this.showIndicator('加载中...');
        interfaceService.queryWeightNoteInfo(params)
          .then(function (response) {
            that.hideIndicator();
            that.examineInfo = response;
          }, function (error) {
            that.showFlag = true;
            that.hideIndicator();
            that.showAlert("数据加载失败");
          });
      },
      //二维码扫描签到
      sign() {
        let that = this;
        cordova.plugins.barcodeScanner.scan(
          function (result) {
            console.log(result);
            let weightId = JSON.parse(result.text).weightnote;
            if (!weightId) {
              that.showAlert("未识别出磅单号！");
            } else {
              that.paramsSign.userId = interfaceService.getCookie("UserId");
              that.paramsSign.weightId = weightId;
              // that.showIndicator("签到中...");
              interfaceService.queryScanWeightNote(that.paramsSign).then(function (response) {
                that.hideIndicator();
                if (response.msg === 'success') {
                  that.showAlert("识别磅单成功！");
                } else {
                  that.showAlert("识别磅单失败！");
                }
              }, function (error) {
                that.hideIndicator();
                that.showAlert("识别磅单失败！");
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
      //监听拆解标识变化
      remark1(newVal, oldVal) {
        // if(newVal !== interfaceService.getCookie("UserId")){
        //alert(this.remark1);
        // }
      },
      remark2(newVal, oldVal) {
        // if(newVal !== interfaceService.getCookie("UserId")){
        //alert(this.remark2);
        // }
      },
      selected(newVal, oldVal) {
        // alert(newVal);
      }
    },
    activated() {
  //    this.scan();
    }
  }
</script>
<style lang="scss" scoped="">
  .auditAccept {
    background: #fff;

    .body-content {
      margin-bottom: 55px;
      height: calc(100% - 100px);
      display: block;
      overflow: auto;
      box-sizing: border-box;
    }
    /*
        #determine-button {
          border-top: 1px solid #eeeeee;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: dodgerblue;
        }

        #determine-button ul {
          width: 100%;
          list-style: none;
        }

        #determine-button ul li {
          float: left;
          height: 45px;
          text-align: center;
          position: relative;
          color: white;
        }

        .sclass {
          width: 100%;
          color: white;
          position: absolute;
          left: 0;
          bottom: 15px;
          text-align: center;
        }*/

/*    .oneButtonUl{
      width: 100%;
    }*/

    .scanner-button{
      width: 60px!important;
    }

  }

</style>
