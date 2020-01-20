<template>
  <div class="jhQuality">
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
      <mt-cell >
        <div >
          <mt-button   type="primary" @click.native="goTakePhoto()">拍照</mt-button>
        </div>
        <div>
          <mt-button  type="default" @click.native="getPhoto()">照片</mt-button>
        </div>
        <div>
          <mt-button  type="default" @click.native="query()">查询</mt-button>
        </div>
        <div >
          <mt-button   type="danger" @click.native="sign()">扫码</mt-button>
        </div>
      </mt-cell >
      <mt-cell :title="'磅单号'">
        <div >
          <input type="text" class="wgttxtjh"  v-model="wgtlistno" >
        </div>
      </mt-cell>

      <mt-cell :title="'车号'">
        <div >
          <input type="text" class="wgttxtjhredonly" v-model="carrierno" readonly="true">
        </div>
      </mt-cell>

      <mt-cell :title="'厂商'">
        <div >
          <input type="text" class="wgttxtjhredonly" v-model="fromdesc" readonly="true">
        </div>
      </mt-cell>

      <mt-cell :title="'品名'">
        <div >
          <input type="text" class="wgttxtjhredonly"  v-model="mtrlname" readonly="true">
        </div>
      </mt-cell>

      <mt-cell :title="'等级'">
        <div >
          <input type="text" class="wgttxtjh" v-model="judge" >
        </div>
      </mt-cell>

      <mt-cell :title="'等级比例'">
        <div >
          <input type="text" class="wgttxtjh"  v-model="judgebl" >
        </div>
      </mt-cell>

      <mt-cell :title="'扣水'">
        <div >
          <input type="text" class="wgttxtjh"  v-model="deductionwater" >
        </div>
      </mt-cell>

      <mt-cell :title="'扣杂'">
        <div >
          <input type="text" class="wgttxtjh"  v-model="deductionimpurity" >
        </div>
      </mt-cell>

      <mt-cell :title="'扣块'">
        <div >
          <input type="text" class="wgttxtjh"  v-model="deductionpiece" >
        </div>
      </mt-cell>

      <mt-cell :title="'是否密封件 '">
        <mt-switch  v-model="isMfj" ></mt-switch>
      </mt-cell>
      <mt-cell :title="'密封件个数'">
        <div >
          <input type="text" class="wgttxtjh"  v-model="jhMfjNum" >
        </div>
      </mt-cell>
      <mt-cell :title="'密封件罚款额'">
        <div >
          <input type="text" class="wgttxtjh"  v-model="mfj" >
        </div>
      </mt-cell>
      <mt-cell :title="'作弊 '">
        <mt-switch  v-model="isCheat" ></mt-switch>
      </mt-cell>
      <mt-cell :title="'作弊罚款额'">
        <div >
          <input type="text" class="wgttxtjh"  v-model="cheat" >
        </div>
      </mt-cell>
      <mt-cell    :title="'备注 '">
        <input type="text" class="wgttxtjh"  v-model="remark" >
      </mt-cell>
      <mt-cell >
        <div> <mt-button   type="primary" @click.native="handleClick">判级</mt-button></div>
      </mt-cell>
    </body-content>
  </div>
</template>

<script>
  import HeaderSimple from '@/components/header/header-simple'
  import BodyContent from "@/components/bodyContent/body-content"
  import interfaceService from '../../service/interfaceService.js'

  import axios from 'axios'

  export default {
    name: 'jhQuality',
    data() {
      return {
        title: '稽核验收',
        wgtlistno:'',
        carrierno:'',
        fromdesc:'',
        mtrlname:'',
        judge:'',
        judgebl:'',
        deductionwater:'0',
        deductionimpurity:'0',
        deductionpiece:'0',
        isMfj:false,
        mfj:"",
        isCheat:false,
        cheat:"",
        remark:'',
        state:'',
        balanceFlag:'',
        jhMfjNum:'',
        //请求参数
        paramsDetail: {
          "MethodId": "Q",//方法类型，Q查询，U判级
          "UserId": "",
          "Class":"J",//类别，Z质检，J稽核
          "Judge": "",//等级
          "Judgebl": "",//等级比例
          "KS": "",//扣水
          "KZ": "",//扣杂
          "KK": "",//扣块
          "RJG": "",//退货
          "CJ": "",//拆解
          "MFJ": "",//密封件
          "MfjMoney": "",//密封件处罚金额
          "Cheat": "",//作弊
          "CheatMoney": "",//作弊处罚金额
          "Remark": "",//备注
          "WgtlistNo": "",//磅单号
          "JhMfjNum":"" //密封件个数
        }
      }
    },

    components: {HeaderSimple, BodyContent},
    methods: {
      init() {
        /*  this.documentInfo = this.$route.query.documentInfo;*/
        this.paramsDetail.WgtlistNo = this.wgtlistno;
        this.paramsDetail.UserId = interfaceService.getCookie("UserId");
      },
      goBack() {
        this.clearMsg();
        this.$router.push({path: '/examineReceive', query: {page: 'jhQuality'}})
      },
      query(){
        if(this.isValid()){
          this.paramsDetail.WgtlistNo = this.wgtlistno;
          this.paramsDetail.UserId = interfaceService.getCookie("UserId");
          this.paramsDetail.MethodId = "Q";
          this.getWgtDetails(this.paramsDetail);
          //this.showAlert(this.wgtlistno+"成功");
        }
        else this.showAlert("磅单号不得为空");
      },
      //验证磅单号是否为空
      isValid() {
        if (this.wgtlistno) return true;
        else return false;
      },
      //获取车辆信息
      getWgtDetails(params) {
        let that = this;
        // that.showIndicator('加载中...');//显示加载提示;
        //同时执行多个请求
        interfaceService.queryWgtDetail(params)
          .then(function (detailsResp) {
            that.hideIndicator();
            if(detailsResp.returnState=="N"){
              that.showAlert("查询失败！"+detailsResp.result);
            }else{
              that.saveInInfo(detailsResp);
            }
          }, function (error) {
            that.hideIndicator();
            that.showAlert("数据加载失败");
          });

      },
      //判级
      getPjDetails(params) {
        let that = this;
        // that.showIndicator('加载中...');//显示加载提示;
        //同时执行多个请求
        interfaceService.queryWgtDetail(params)
          .then(function (detailsResp) {
            that.hideIndicator();
            if(detailsResp.returnState=="0"){
              that.showAlert("判级成功！");
              //that.saveInInfo(detailsResp);
            }else{
              that.showAlert("判级失败！"+detailsResp.desc);
            }

          });

      },
      //车辆信息显示到页面
      saveInInfo(detailsResp) {

        this.fromdesc=detailsResp.FROMDESC;
        this.carrierno=detailsResp.CARRIERNO;
        this.mtrlname=detailsResp.MTRLNAME;
        this.judge=detailsResp.JHJUDGE;
        this.judgebl=detailsResp.JHJUDGEBL;
        this.deductionwater=detailsResp.JHDEDUCTIONWATER;
        this.deductionimpurity=detailsResp.JHDEDUCTIONIMPURITY;
        this.deductionpiece=detailsResp.JHDEDUCTIONPIECE;
        this.isMfj=detailsResp.JHISMFJ=="Y"?true:false;
        this.mfj=detailsResp.JHMFJ;
        this.cheat=detailsResp.JHHANDLECHEAT;
        this.isCheat=detailsResp.JHISCHEAT=="Y"?true:false;
        this.remark=detailsResp.JHREMARK;
        this.state=detailsResp.JHSTATE;//质检状态
        this.balanceFlag=detailsResp.BALANCEFLAG;//结算状态
        this.jhMfjNum=detailsResp.JHMFJNUM;//

      },
//扫码识别榜单号
      sign() {
        let that = this;
        cordova.plugins.barcodeScanner.scan(
          function (result) {
            console.log(result);
            let weightId= result.text;
            if (!weightId) {
              that.showAlert("未识别出磅单号！");
            } else {
              that.wgtlistno = weightId;
              that.query();
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
            prompt: "请将条码放在扫描框中", // Android 提示信息
            resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500 多久开始识别
            formats: "QR_CODE,PDF_417,DATA_MATRIX,UPC_E,UPC_A,EAN_8,EAN_13,CODE_128,CODE_39,CODE_93,CODABAR,ITF,RSS14,RSS_EXPANDED,AZTEC,MSI", // default: all but PDF_417 and RSS_EXPANDED
            orientation: "portrait", // Android only (portrait|landscape), default unset so it rotates with the device 垂直还是水平
            disableAnimations: false, // iOS
            disableSuccessBeep: true // iOS
          }
        );
      },
      goTakePhoto() {
        // console.log(this.listflag);
        if(this.wgtlistno){
          this.$router.push({
            path: '/takephotos',
            /*          query: {type: this.typeFlag, instanceId: this.instanceId}*/
            query: {baodancode: this.wgtlistno,class:"J"}
          })
        }else{
          this.showAlert("磅单号不得为空!");
        }
      },
      getPhoto() {
        // console.log(this.listflag);
        if(this.wgtlistno){
          this.$router.push({
            path: '/wgtPhoto',
            /*          query: {type: this.typeFlag, instanceId: this.instanceId}*/
            query: {InstanceId: this.wgtlistno,class:"J"}
          })
        }else{
          this.showAlert("磅单号不得为空!");
        }
      },
      //清空
      clearMsg() {
        this.wgtlistno="";
        this.fromdesc="";
        this.carrierno="";
        this.mtrlname="";
        this.judge="";
        this.judgebl="";
        this.deductionwater="0";
        this.deductionimpurity="0";
        this.deductionpiece="0";
        this.isMfj=false;
        this.mfj="";
        this.jhMfjNum="";
        this.cheat="";
        this.isCheat=false;
        this.remark="";
      },

      handleClick: function () {
        if(this.pjValid()){
          this.paramsDetail.WgtlistNo = this.wgtlistno;
          this.paramsDetail.UserId = interfaceService.getCookie("UserId");
          this.paramsDetail.MethodId = "U";
          this.paramsDetail.Class = "J";
          this.paramsDetail.Judge = this.judge;
          this.paramsDetail.Judgebl = this.judgebl;
          this.paramsDetail.KS = this.deductionwater;
          this.paramsDetail.KZ = this.deductionimpurity;
          this.paramsDetail.KK = this.deductionpiece;
          this.paramsDetail.RJG = "";
          this.paramsDetail.CJ = "";
          this.paramsDetail.MFJ = this.isMfj==true?"Y":"N";
          this.paramsDetail.MfjMoney = this.mfj;
          this.paramsDetail.Cheat = this.isCheat==true?"Y":"N";
          this.paramsDetail.CheatMoney = this.cheat;
          this.paramsDetail.Remark = this.remark;
          this.paramsDetail.JhMfjNum = this.jhMfjNum;
          this.getPjDetails(this.paramsDetail);
          //this.showAlert(this.wgtlistno+"成功");
        }
      },

      //判级验证
      pjValid() {
        if(this.balanceFlag=="0"){
          this.showAlert("该车信息已结算！");
          return false;
        }
        if(this.state=="5"){
          this.showAlert("该车信息已发布");
          return false;
        }
        if (!(this.wgtlistno&&this.judge&&this.judgebl)){
          this.showAlert("磅单号、等级及比例不得为空！");
          return false;
        }
        return true;
      },
    },
    activated() {
      let auth = interfaceService.getCookie("examineAuth");
      if( auth === '2' || auth === '3'){
        this.init();
      } else {
        this.showAlert("无操作权限！");
        this.goBack();
      }
    }
  }
</script>


<style lang="scss" scoped="">

  .jhQuality {
    background: #fff;
    .body-content {
      display: block;
      overflow: auto;
      box-sizing: border-box;
    }
    .page-part {
      margin-bottom: 15px;
    }
    .haveFootButton-heigth {
      height: calc(100% - 90px);
    }

    .noFootButton-heigth {
      height: calc(100% - 45px);
    }

    .wgttxtjh {
      margin-top: 6px;
      height: 30px;
      line-height: 30px;
      width: calc(96% - 6px);
      font-size: 14px;
      background-color: transparent;
      margin-left: 4%;
      float: left;
    }
    .wgtcell {
      margin-top: 6px;
      height: 30px;
      line-height: 30px;
      width: calc(96% - 6px);
      font-size: 14px;
      background-color: transparent;
      margin-left: 4%;
      float: left;
    }
    .wgttxtjhredonly {
      margin-top: 6px;
      height: 30px;
      line-height: 30px;
      width: calc(96% - 6px);
      font-size: 14px;
      background-color: LightGrey;
      margin-left: 4%;
      float: left;
    }

    .rejSec {
      margin-top: 6px;
      height: 30px;
      line-height: 30px;
      width: 100%;
      font-size: 12px;
      background-color: transparent;
      margin-left: 4%;
      float: left;
    }

  }

</style>
