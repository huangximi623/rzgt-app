<template>
  <div class="salesApprovalDetail">
    <header-simple class="list-header">
      <div class="left-button" @click="goBack()" slot="left">
        <i class="fa fa-chevron-left"></i>
      </div>
      <div class="list-title" slot="title">
        {{title}}
      </div>
      <div class="right-button" slot="right"></div>
    </header-simple>
    <body-content class="body-content"
                  :class="salesApprovalInfo.caozuo && salesApprovalInfo.caozuo.length>0 ? 'haveFootButton-heigth' : 'noFootButton-heigth' ">
      <!--表单区-->
      <div class="procedureRecord" v-if="salesApprovalInfo.detail">
        <span><label class="margin-left-5">表单详情区</label></span>
      </div>
      <mt-cell v-for="(item,index) in salesApprovalInfo.detail" :key="index" :title="item.label"
               :value="item.value.replace(/<br>/g,'')"></mt-cell>
      <div v-if="salesApprovalInfo.detailZB" :class="salesApprovalInfo.detailZB.length>0?'detailZB':''">
        <mt-cell v-for="(item,index) in salesApprovalInfo.detailZB" :key="index"
                 :title="item.key"
                 :value="item.value"></mt-cell>
      </div>
      <process-record :history="history"></process-record>
    </body-content>
    <div v-if="typeFlag == 'todo'">
      <foot-button :footButton="salesApprovalInfo.caozuo" :buttonTitle="buttonTitle"
                   :taskId="paramsDetail.instanceId"></foot-button>
    </div>
  </div>
</template>

<script>
  import HeaderSimple from '@/components/header/header-simple'
  import BodyContent from "@/components/bodyContent/body-content"
  import AttachmentsArea from '@/components/attachmentsArea/attachments-area'
  import FootButton from '@/components/footer/footButton'
  import ProcessRecord from '@/components/processRecord/processRecord'
  import interfaceService from '../../service/interfaceService.js'
  import axios from 'axios'

  export default {
    name: 'salesApprovalDetail',
    data() {
      return {
        title: '详细信息',
        buttonTitle: '销售审批',
        showAllRecord: false,
        salesApprovalInfo: {
          caozuo: []
        },
        typeFlag: '',
        history: [],
        paramsDetail: {
          fromId: "",
          test: "Y",
          userId:"",
          instanceId: "",
          from: '0',
          limit: '10'
        },
        paramsProcess: {
          fromId: "JKA04",
          test: "Y",
          userId: "",
          instanceId: "",
          from: '0',
          limit: '10'
        },
      }
    },
    components: {HeaderSimple, BodyContent, ProcessRecord, AttachmentsArea, FootButton},
    methods: {
      goBack() {
        this.$router.push({path: '/salesApproval', query: {page: 'salesApprovalDetail',listflag:this.xqflag}})
      },
      init() {
        this.paramsDetail.instanceId = this.$route.query.instanceId ? this.$route.query.instanceId : '';//R180418002
        this.paramsProcess.instanceId = this.$route.query.instanceId ? this.$route.query.instanceId : '';//"R180516001"
        this.typeFlag = this.$route.query.type ? this.$route.query.type : '';
        this.paramsDetail.userId=interfaceService.getCookie("UserId");
        if(this.$route.query.listflag=='YB'){
          this.paramsDetail.fromId='JKA08'
        }else{
          this.paramsDetail.fromId='JKA03'
        }

        //console.log("本次请求的fromid"+this.paramsDetail.fromId);
      },

      //获取审批流程和表单详情
      getProcessAndDetails(type) {
        let that = this;
        that.history = [];
        that.salesApprovalInfo = {
          caozuo: []
        };
        that.showIndicator('加载中...');//显示加载提示;
        //同时执行多个请求
        axios.all([
          interfaceService.querySalesProcess(that.paramsProcess),
          interfaceService.querySalesDetails(that.paramsDetail),
        ])
          .then(axios.spread(function (processResp, detailsResp) {
            that.hideIndicator();
            that.history = processResp.data;
            that.salesApprovalInfo = detailsResp.data;
          }), function (error) {
            that.hideIndicator();
            that.showAlert("数据加载失败");
          });
      }
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
              that.getProcessAndDetails(that.$route.query.type);
            }
          }, function (error) {
            that.hideIndicator();
            that.showAlert("数据加载失败");
          });
      } else {
        if (this.$route.query.page !== 'toReadList') {
          this.init();
          this.getProcessAndDetails(this.$route.query.type);
          this.paramsDetail.userId=interfaceService.getCookie("UserId");
          this.paramsProcess.userId=interfaceService.getCookie("UserId");

        }
      }
    }

  }
</script>
<style lang="scss">

  .salesApprovalDetail {
    background: #fff;
    .body-content {
      display: block;
      overflow: auto;
      box-sizing: border-box;
      /*margin-bottom: 45px;*/
    }

    .haveFootButton-heigth {
      height: calc(100% - 90px);
    }

    .noFootButton-heigth {
      height: calc(100% - 45px);
    }
  }

</style>
