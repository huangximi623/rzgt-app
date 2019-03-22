<template>
  <div class="zjQuality">
    <header-simple class="list-header">
      <div class="left-button" @click="goBack()" slot="left">
        <i class="fa fa-chevron-left"></i>
      </div>
      <div class="list-title" slot="title">
        {{title}}
      </div>
    <!--  <div class="right-button" slot="right"></div>-->

      <div class="right-button" @click="query()"  slot="right" >查询

      </div>

    </header-simple>
    <body-content class="body-content">
    <mt-cell :title="'磅单号'">

      <div >
        <input type="text" class="wgttxt"  v-model="wgtlistno" >
      </div>
    </mt-cell>

    <mt-cell :title="'车号'">
      <div >
        <input type="text" class="wgttxtredonly" v-model="carrierno" readonly="true">
      </div>
    </mt-cell>

    <mt-cell :title="'厂商'">
      <div >
        <input type="text" class="wgttxtredonly" v-model="fromdesc" readonly="true">
      </div>
    </mt-cell>

    <mt-cell :title="'品名'">
      <div >
        <input type="text" class="wgttxtredonly"  v-model="mtrlname" readonly="true">
      </div>
    </mt-cell>

    <mt-cell :title="'等级'">
      <div >
        <input type="text" class="wgttxt" v-model="judge" >
      </div>
    </mt-cell>

    <mt-cell :title="'等级比例'">
      <div >
        <input type="text" class="wgttxt"  v-model="judgebl" >
      </div>
    </mt-cell>

    <mt-cell :title="'扣水'">
      <div >
        <input type="text" class="wgttxt"  v-model="deductionwater" >
      </div>
    </mt-cell>

    <mt-cell :title="'扣杂'">
      <div >
        <input type="text" class="wgttxt"  v-model="deductionimpurity" >
      </div>
    </mt-cell>

    <mt-cell :title="'扣块'">
      <div >
        <input type="text" class="wgttxt"  v-model="deductionpiece" >
      </div>
    </mt-cell>

    <mt-cell :title="'退货选择'">
      <div >
        <select  v-model="rejGoods" style="height:40px; width:180px;" >
          <option value ="0" >0-正常收货</option>
          <option value ="1">1-部分退货</option>
          <option value="2" >2-全部退货</option>
        </select>
      </div>
    </mt-cell>

      <mt-cell title="质检点">
        <select v-model="selected" style="height:40px; width:180px;">
          <option v-for="item in options" v-bind:value="item.value">
            {{ item.text }}
          </option>
        </select>
      </mt-cell>

  <mt-cell :title="'拆解标记 '">
      <mt-switch  v-model="isCj" ></mt-switch>
    </mt-cell>
    <mt-cell :title="'是否密封件 '">
      <mt-switch  v-model="isMfj" ></mt-switch>
    </mt-cell>
    <mt-cell :title="'是否作弊 '">
      <mt-switch  v-model="isCheat" ></mt-switch>
    </mt-cell>
    <mt-cell    :title="'备注 '">
      <input type="text" class="wgttxt"  v-model="remark" >
    </mt-cell>
    <mt-cell>
      <div> <mt-button   type="primary" @click.native="handleClick">判级</mt-button></div>
    </mt-cell>
    </body-content>
  </div>
</template>

<script>
  import HeaderSimple from '@/components/header/header-simple'
  import BodyContent from "@/components/bodyContent/body-content"
  import interfaceService from '../../service/interfaceService.js'
  import LevelStandardList from '../../components/workFlow/levelStandard-list.vue'

  import axios from 'axios'

  export default {
    name: 'zjQuality',
    data() {
      return {
        title: '质检验收',
        wgtlistno:'',
        carrierno:'',
        fromdesc:'',
        mtrlname:'',
        judge:'',
        judgebl:'',
        deductionwater:'0',
        deductionimpurity:'0',
        deductionpiece:'0',
        rejGoods:'0',
        isCj:false,
        isMfj:false,
        isCheat:false,
        remark:'',
        state:'',
        balanceFlag:'',
        //请求参数
        paramsDetail: {
          "MethodId": "Q",//方法类型，Q查询，U判级
          "UserId": "",
          "Class":"",//类别，Z质检，J稽核
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
          "WgtlistNo": ""//磅单号
        },
        params: {
          "MethodId": "0",
          "UserId": "R028316",
          "From": "0",
          "Limit": "10"
        },
        selected: 'A',
        options: [
          { text: 'One', value: 'A',eee:"d" },
          { text: 'Two', value: 'B',eee:"d" },
          { text: 'Three', value: 'C',eee:"d" }
          ]

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
        this.$router.push({path: '/examineReceive', query: {page: 'zjQuality'}})
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
        this.judge=detailsResp.ZJJUDGE;
        this.judgebl=detailsResp.ZJJUDGEBL;
        this.deductionwater=detailsResp.ZJDEDUCTIONWATER;
        this.deductionimpurity=detailsResp.ZJDEDUCTIONIMPURITY;
        this.deductionpiece=detailsResp.ZJDEDUCTIONPIECE;
        this.rejGoods=detailsResp.REJECTGOODS=="0"||detailsResp.REJECTGOODS=="1"||detailsResp.REJECTGOODS=="2"?detailsResp.REJECTGOODS:'';
        this.isCj=detailsResp.ISSPLIT=="1"?true:false;
        this.isMfj=detailsResp.ZJISMFJ=="Y"?true:false;
        this.isCheat=detailsResp.ZJISCHEAT=="Y"?true:false;
        this.remark=detailsResp.REMARK;
        this.state=detailsResp.ZJSTATE;//质检状态
        this.balanceFlag=detailsResp.BALANCEFLAG;//结算状态

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
        this.isCheat=false;
        this.isCj=false;
        this.rejGoods="0";
        this.remark="";
      },

      handleClick: function () {
        if(this.pjValid()){
          this.paramsDetail.WgtlistNo = this.wgtlistno;
          this.paramsDetail.UserId = interfaceService.getCookie("UserId");
          this.paramsDetail.MethodId = "U";
          this.paramsDetail.Class = "Z";
          this.paramsDetail.Judge = this.judge;
          this.paramsDetail.Judgebl = this.judgebl;
          this.paramsDetail.KS = this.deductionwater;
          this.paramsDetail.KZ = this.deductionimpurity;
          this.paramsDetail.KK = this.deductionpiece;
          this.paramsDetail.RJG = this.rejGoods;
          this.paramsDetail.CJ = this.isCj==true?"1":"0";
          this.paramsDetail.MFJ = this.isMfj==true?"Y":"N";
          this.paramsDetail.MfjMoney = "";
          this.paramsDetail.Cheat = this.isCheat==true?"Y":"N";
          this.paramsDetail.CheatMoney = "";
          this.paramsDetail.Remark = this.remark;
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
        if(!(this.rejGoods=="0"||this.rejGoods=="1"||this.rejGoods=="2")){
          this.showAlert("退货状态不得为空！");
          return false;
        }
         return true;
      },
    },
    activated() {
      //微信登陆
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
            if (that.$route.query.page !== 'toReadList') {
              that.init();
              that.getProcessAndDetails(that.$route.query.type, that.paramsDetail);
            }
          }, function (error) {
            that.hideIndicator();
            that.showAlert("数据加载失败");
          });
      } else {
            this.init();
           // this.getProcessAndDetails(this.$route.query.type, this.paramsDetail);
      }
    },
    /*mounted() {
      this.init();
    }*/
  }
</script>


<style lang="scss" scoped="">

  .zjQuality {
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

    .wgttxt {
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
    .wgttxtredonly {
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
