<template>
  <div class="toReturn">
    <header-simple class="list-header">
      <div class="left-button" @click="goBack()" slot="left"><i class="fa fa-chevron-left"></i></div>
      <div class="list-title" slot="title">
        {{buttonTitle}}
      </div>
      <div class="right-button" slot="right"></div>
    </header-simple>
    <body-content class="body-content">
      <div id="showOrHide">
        <div @click="openPopNext()" v-if="nextTran && nextTran.length>0">
          <mt-cell title="下一环节" :value="selectNext" is-link></mt-cell>
        </div>
      </div>
      <div>
        <mt-cell title="审批意见"></mt-cell>
        <div>
          <mt-radio class="approvalComments"
            v-model="comments"
            :options="['不同意']">
          </mt-radio>
        </div>
        <div>
          <textarea rows="5" placeholder="请输入审批意见" id="approvalOpinion" v-model="comments"></textarea>
        </div>
      </div>
      <div id="showModel" class="my-modal" style="z-index: 2004;"></div>
    </body-content>
    <mt-popup class="data-popup" v-model="popupVisible" position="bottom">
      <div class="data-btns">
        <span class="data-btn data-btns-l" @click="btn_cancel()">取消</span>
        <span class="data-btn data-btns-r" @click="btn_confirm_next()">确定</span>
      </div>
      <my-picker ref="myPickerNext" :selectData="doNext"></my-picker>
    </mt-popup>
    <div class="caozuo">
      <mt-button type="primary" size="large" plain class="caozuo-btn" @click.native="toReturn(buttonTitle,params)">退回
      </mt-button>
    </div>
  </div>
</template>

<script>
  import HeaderSimple from '@/components/header/header-simple'
  import BodyContent from "@/components/bodyContent/body-content"
  import MyPicker from "@/components/myPicker/my-picker.vue"
  import interfaceService from "../../service/interfaceService"

  export default {
    name: 'toReturn',
    data() {
      return {
        buttonTitle: '',
        popupVisible: false,
        selectNext: '',
        comments: '', //审批意见
        doNext: [],
        nextTran: [],
        params: {
          caozuo: '',
          userId: '',
          taskId: "",
          comment: "",
          nextUser: [],
          nextOrg: [],
          nextTran: ''
        }
      }
    },
    components: {HeaderSimple, BodyContent, MyPicker},
    methods: {
      init() {
        //清空页面数据
        this.selectNext = '';
        this.comments = '不同意';

        this.buttonTitle = this.$route.query.buttonTitle ? this.$route.query.buttonTitle : '退回';
        this.nextTran = this.$route.query.buttonInfo ? this.$route.query.buttonInfo : '';
        this.params.caozuo = this.$route.query.caozuo ? this.$route.query.caozuo : '';
        this.params.taskId = this.$route.query.taskId ? this.$route.query.taskId : '';
        this.params.userId = interfaceService.getCookie("Token");

        if (this.buttonTitle === '公文审批') {
          delete this.params.receiveGuid;//删除receiveGuid参数
          this.params.fileGuid = this.$route.query.fileGuid ? this.$route.query.fileGuid : '';//增加fileGuid参数
        } else if (this.buttonTitle === '接待管理') {
          delete this.params.fileGuid;//删除fileGuid参数
          this.params.receiveGuid = this.$route.query.receiveGuid ? this.$route.query.receiveGuid : '';//增加receiveGuid参数
        } else {
          delete this.params.fileGuid;//删除fileGuid参数
          delete this.params.receiveGuid;//删除receiveGuid参数
        }
      },
      //回退
      toReturn(type, params) {
        let that = this;
        if (!this.comments) {
          this.showAlert("审批意见不能为空！")
        } else {
          this.params.comment = this.comments;
          if (this.nextTran.length > 0) {
            //遍历nextTran，将选中值对应的transitionName赋值给nextTran参数
            for (let i = 0; i < this.nextTran.length; i++) {
              if(this.nextTran[i].transName === this.selectNext){
                this.params.nextTran = this.nextTran[i].transitionName
              }
            }
          } else {
            delete this.params.nextTran;
          }
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
              default:
                break;
            }
          },function (error) {
            that.hideIndicator();
            that.showAlert("数据加载失败");
          });
        }
      },
      btn_cancel() {
        this.popupVisible = false;
      },
      btn_confirm_next() {
        this.selectNext = this.$refs.myPickerNext.selected;
        this.popupVisible = false;
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
        }
      },
      openPopNext() {
        console.log('this.nextTran:');
        console.log(this.nextTran);
        this.popupVisible = true;
        this.$refs.myPickerNext.slots[0].values = [];//清空picker选项列表
        //赋值picker选项列表
        for (let i = 0; i < this.nextTran.length; i++) {
          this.$refs.myPickerNext.slots[0].values.push(this.nextTran[i].transName);
        }
      }
    },
    activated() {
      document.getElementById("showModel").style.display = "none";
      this.init();
    }
  }
</script>
<style lang="scss" scoped="">

  .toReturn {
    background: #fff;
    .body-content {
      height: calc(100% - 45px);
      display: block;
      overflow: auto;
      box-sizing: border-box;
      #approvalOpinion {
        border-radius: 4px;
        box-sizing: border-box;
        display: block;
        padding: 5px;
        overflow: hidden;
        position: relative;
        width: 95%;
        margin: auto;
        outline: none;
        border-color: #1e8fe1;
      }
    }
    .data-popup {
      width: 100%;
      z-index: 999;
      .mint-popup {
        top: auto !important;
        width: 100%;
      }
    }
    .data-btns {
      width: 100%;
      height: 40px;
      border-bottom: 1px solid #c3c3c3;
      .data-btn {
        display: inline-block;
        float: left;
        text-align: center;
        height: 40px;
        line-height: 40px;
        width: 50%;
        color: #1e8fe1;
      }
    }
  }
</style>
