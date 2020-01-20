<template>
  <div id="foot-button">
    <div v-if="footButton">
      <ul
        :class="{threeButtonUl:footButton.length == 3,twoButtonUl:footButton.length == 2,oneButtonUl:footButton.length == 1}">
        <li v-for="(button,index) in footButton" class="btn-active">
          <div v-if="button.label == 'doUndo' && buttonTitle !='公文审批'"
               @click="toWithdraw(buttonTitle,{'caozuo':button.label,'nextOrg':[],'nextUser':[],'taskId':taskId,'userId':UserId})">
            <span>{{ button.name }}</span>
          </div>

          <div v-else-if="button.label == 'doUndo' && buttonTitle =='公文审批'"
               @click="toWithdraw(buttonTitle,{'caozuo':button.label,'nextOrg':[],'nextUser':[],'taskId':taskId,'userId':UserId,'fileGuid':fileGuid})">
            <span>{{ button.name }}</span>
          </div>

          <router-link v-else
                       :to="{path: '/'+button.label, query:{buttonTitle: buttonTitle,deleteAll:'deleteAll',buttonInfo:button.nextTran,caozuo:button.label,taskId:taskId,fileGuid:fileGuid,receiveGuid:receiveGuid}}">
            <span>{{ button.name }}</span>
          </router-link>
        </li>
      </ul>

    </div>
    <div v-if="typeFlag==='NotRead'">
      <ul class="oneButtonUl">
        <li @click="toRead({'receiveGuid':receiveGuid,'userId':UserId})" class="btn-active">
          <span>确定</span>
        </li>
      </ul>
    </div>

  </div>

</template>

<script>
  import interfaceService from '../../service/interfaceService.js'

  export default {
    name: 'footButton',
    props: {
      footButton: {type: Array},
      buttonTitle: {type: String},
      typeFlag: {type: String},
      receiveGuid: {type: String},
      taskId: {type: String},
      fileGuid: {type: String}
    },
    data() {
      return {
        UserId: '',
      }
    },
    methods: {
      //确定已阅
      toRead(params) {
        let that = this;
        that.showIndicator('加载中...');
        interfaceService.confirmJD(params).then(function (response) {
          that.hideIndicator();
          that.$router.push({path: '/receptionManager', query: {page: 'receptionToNotRead'}})
        }, function (error) {
          that.hideIndicator();
          that.showAlert("数据加载失败");
        })
      },

      //撤回按钮
      toWithdraw(type, params) {
        let that = this;
        that.showIndicator('加载中...');
        interfaceService.queryAdminRead(type, params).then(function (response) {
          that.hideIndicator();
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
        }, function (error) {
          that.hideIndicator();
          that.showAlert("数据加载失败");
        })
      }

    },
    activated(){
      this.UserId = interfaceService.getCookie("Token");
    },
    created(){
      this.UserId = interfaceService.getCookie("Token");
    }
  }
</script>

<style scoped>
  #foot-button {
    border-top: 1px solid #eeeeee;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
  }

  #foot-button ul {
    width: 100%;
    list-style: none;
  }

  #foot-button ul li a {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    padding-top: 8px;
  }

  #foot-button ul li {
    float: left;
    height: 45px;
    text-align: center;
    position: relative;
  }

  .threeButtonUl li {
    width: 33.33333333%;
  }

  .twoButtonUl li {
    width: 50%;
  }

  .oneButtonUl li {
    width: 100%;
  }

  #foot-button span {
    width: 100%;
    color: rgb(0, 0, 0);
    position: absolute;
    left: 0;
    bottom: 15px;
  }
</style>
