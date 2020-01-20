<template>
  <div class="toRead">
    <header-simple class="list-header">
      <div class="left-button" @click="goBack()" slot="left"><i class="fa fa-chevron-left"></i></div>
      <div class="list-title" slot="title">
        {{buttonTitle}}
      </div>
      <div class="right-button" slot="right"></div>
    </header-simple>
    <body-content class="body-content">

      <mt-cell title="传阅给" :value="selectNext"
               :to="{path:'/toReadList',query:{selectedPerson:selectedPerson,page:'toRead',deleteAll:this.$route.query.deleteAll?this.$route.query.deleteAll:deleteAll,buttonTitle:buttonTitle,caozuo:this.params.caozuo,taskId:this.params.taskId,fileGuild:fileGuid}}"
               is-link></mt-cell>

      <div :class="{'ckeck-list':selectedPerson.length>0}">
        <mt-cell-swipe v-for="(item,index) in selectedPerson"
                       :right="[
                         {
                           content: '删除',
                           style: {background: 'red', color: '#fff'},
                           handler: () => deleteSelected(index)
                         }]"
                       :key="index" :title="item.name" :value="item.userid"></mt-cell-swipe>
      </div>
    </body-content>
    <div class="caozuo">
      <mt-button type="primary" size="large" plain class="caozuo-btn" @click.native="getCaoZuo(buttonTitle,params)">传阅
      </mt-button>
    </div>
  </div>
</template>

<script>
  import HeaderSimple from '@/components/header/header-simple'
  import BodyContent from "@/components/bodyContent/body-content"
  import interfaceService from '../../service/interfaceService.js'

  export default {
    name: 'toRead',
    data() {
      return {
        buttonTitle: '',
        popupVisible: false,
        selectNext: '',
        selectedPerson: [],
        deleteAll: '',
        fileGuid: '',
        params: {
          "caozuo": '',
          "comment": '',
          "nextOrg": [],
          "nextUser": [],
          "taskId": '',
          "userId": ''
        }
      }
    },
    components: {HeaderSimple, BodyContent},
    methods: {
      deleteSelected(index) {
        this.selectedPerson.splice(index, 1)
      },
      init() {
        //如果不是公文审批，删除fileGuid参数
        if(this.buttonTitle !== '公文审批'){
          delete this.params.fileGuid;
        }
        this.buttonTitle = this.$route.query.buttonTitle ? this.$route.query.buttonTitle : '传阅';
        if (this.$route.query.deleteAll === 'deleteAll') {
          this.selectedPerson = [];
          // this.params.nextUser = [];
        } else {
          this.selectedPerson = this.$route.query.selectedPerson;
        }

        this.params.caozuo = this.$route.query.caozuo ? this.$route.query.caozuo : '';
        this.params.taskId = this.$route.query.taskId ? this.$route.query.taskId : '';
        this.params.userId = interfaceService.getCookie("Token");
        this.fileGuid = this.$route.query.fileGuid;
        if (this.buttonTitle === '公文审批' && this.$route.query.page !== 'toReadList') {
          this.params.fileGuid = this.fileGuid;
        }
      },
      goBack() {
        if (this.buttonTitle === '行政审批') {
          this.$router.push({path: '/administrativeExaminationDetail', query: {page: 'toReadList'}})
        } else if (this.buttonTitle === '公文审批') {
          this.$router.push({path: '/documentDetail', query: {page: 'toReadList'}})
        } else if (this.buttonTitle === '会议管理') {
          this.$router.push({path: '/meetingManagerDetails', query: {page: 'toReadList'}})
        } else if (this.buttonTitle === '接待管理') {
          this.$router.push({path: '/receptionManagerDetails', query: {page: 'toReadList'}})
        } else if (this.buttonTitle === '销售审批') {
          this.$router.push({path: '/salesApprovalDetail', query: {page: 'toReadList'}})
        } else if (this.buttonTitle === '京华审批') {
          this.$router.push({path: '/jhApprovalDetail', query: {page: 'toReadList'}})
        } else if (this.buttonTitle === '营钢审批') {
          this.$router.push({path: '/wkygApprovalDetail', query: {page: 'toReadList'}})
        }
      },
      getCaoZuo(type, params) {
        let that = this;
        that.params.nextUser = [];
        if (that.selectedPerson.length === 0) {
          that.showAlert("请先选择传阅人员！");
        } else {
          //将选择的传阅人员赋值给nextUser参数
          for (let i = 0; i < that.selectedPerson.length; i++) {
            that.params.nextUser.push(that.selectedPerson[i].userid);
          }
          that.showIndicator('加载中...');//显示加载提示;
          interfaceService.queryAdminRead(type, params).then(function (response) {
            that.hideIndicator();
            if (response.type === 'success') {
              switch (type) {
                case '行政审批':
                  that.showAlertAndUrl(response.message, '/administrativeExamination');
                  break;
                case '公文审批':
                  that.showAlertAndUrl(response.message, '/documents');
                  break;
                case '会议管理':
                  that.showAlertAndUrl(response.message, '/meetingManager');
                  break;
                case '接待管理':
                  that.showAlertAndUrl(response.message, '/receptionManager');
                  break;
                case '销售审批':
                  that.showAlertAndUrl(response.message, '/salesApproval');
                  break;
                case '京华审批':
                  that.showAlertAndUrl(response.message, '/jhApproval');
                  break;
                case '营钢审批':
                  that.showAlertAndUrl(response.message, '/wkApproval');
                  break;
                default:
                  break;
              }
            } else {
              that.showAlert(response.message);
              that.selectedPerson = [];
              that.deleteAll = 'deleteAll';//删除已选中
            }
          }, function (error) {
            that.hideIndicator();
            that.showAlert("数据加载失败");
          })
        }
      }

    },
    activated() {
      this.init();
    }
  }
</script>
<style lang="scss" scoped="">
  .toRead {
    background: #fff;
    .body-content {
      height: calc(100% - 100px);
      display: block;
      overflow: auto;
      box-sizing: border-box;
      margin-bottom: 55px;
      .ckeck-list {
        border-top: 2px solid #1e8fe1;
      }
    }
  }
</style>
