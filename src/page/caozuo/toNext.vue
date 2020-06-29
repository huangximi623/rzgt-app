<template>
  <div class="toNext">
    <header-simple class="list-header">
      <div class="left-button" @click="goBack()" slot="left"><i class="fa fa-chevron-left"></i></div>
      <div class="list-title" slot="title">
        {{buttonTitle}}
      </div>
      <div class="right-button" slot="right"></div>
    </header-simple>
    <body-content class="body-content">

      <div id="showOrHide">
        <div @click="openPopNext()">
          <mt-cell title="下一环节" :value="selectNext" is-link></mt-cell>
        </div>

        <div v-if="showTransfer">
          <mt-cell title="下一审批人" is-link v-if="toTransferListUser && toTransferListUser.length!=0"
                   @click.native="selectNextPerson()"></mt-cell>

          <mt-cell title="下一审批人" is-link v-if="toTransferListUser && toTransferListUser.length==0"
                   @click.native="selectNextPerson()"></mt-cell>

          <div :class="{'ckeck-list':selectedPerson.length>0}">
            <mt-cell-swipe v-for="(item,index) in selectedPerson"
                           :right="[
                         {
                           content: '删除',
                           style: {background: 'red', color: '#fff'},
                           handler: () => deleteSelected(index)
                         }]"
                           :key="index" :title="item.name"
                           :value="item.userid"></mt-cell-swipe>
          </div>
        </div>

      </div>
      <div id="showModel" class="my-modal" style="z-index: 2004;"></div>

      <div>
        <mt-cell title="审批意见"></mt-cell>
        <div v-if="buttonTitle == '销售审批'">
          <mt-radio class="approvalComments"
            v-model="comments"
            :options="['同意']">
          </mt-radio>
        </div>
        <div v-else>
          <mt-radio class="approvalComments"
                    v-model="comments"
                    :options="['同意', '不同意', '已阅']">
          </mt-radio>
        </div>
        <div>
          <textarea rows="5" placeholder="请输入审批意见" id="approvalOpinion" v-model="comments"></textarea>
        </div>
      </div>
    </body-content>
    <mt-popup class="data-popup" v-model="popupVisible" position="bottom">
      <div class="data-btns">
        <span class="data-btn data-btns-l" @click="btn_cancel()">取消</span>
        <span class="data-btn data-btns-r" @click="btn_confirm_next()">确定</span>
      </div>
      <my-picker ref="myPickerNext" :selectData="doNext"></my-picker>
    </mt-popup>

    <div v-if="buttonTitle == '销售审批'" class="caozuo">
      <mt-button type="primary" size="large" class="caozuo-btn" plain @click.native="toNext(buttonTitle,params)">核准
      </mt-button>
    </div>
    <div v-else class="caozuo">
      <mt-button type="primary" size="large" class="caozuo-btn" plain @click.native="toNext(buttonTitle,params)">流转
      </mt-button>
    </div>

  </div>
</template>

<script>
  import HeaderSimple from '@/components/header/header-simple'
  import MyPicker from "@/components/myPicker/my-picker.vue"
  import BodyContent from "@/components/bodyContent/body-content"
  import interfaceService from "../../service/interfaceService"

  export default {
    name: 'toNext',
    data() {
      return {
        buttonTitle: '',
        popupVisible: false,
        showTransfer: false,
        selectNext: '',
        nextTran: [],
        doNext: [],
        comments: '', //审批意见
        toTransferListUser: [],//下一步审批人
        selectedPerson: [],
        params: {
          caozuo: '',
          userId: '',
          taskId: "",
          comment: "",
          nextUser: [],
          nextOrg: [],
          nextTran: '',
          instanceId: '',//销售审批
          fromId: ''//销售审批
        },
        tKind: ''
      }
    },
    components: {HeaderSimple, MyPicker, BodyContent},
    methods: {
      //删除已选中的person
      deleteSelected(index) {
        this.selectedPerson.splice(index, 1)
      },
      //流转
      toNext(type, params) {
        let that = this;
        that.params.nextUser = [];
        that.params.nextOrg = [];
        if (!this.comments) {
          this.showAlert("审批意见不能为空！")
        } else {
          if (!that.tKind === false && this.selectedPerson.length === 0) {
            this.showAlert("请先选择下一步审批人！")
          } else {
            //将选中person赋值给nextUser或nextOrg参数
            for (let i = 0; i < that.selectedPerson.length; i++) {
              if (that.tKind === 'U') {
                that.params.nextUser.push(that.selectedPerson[i].userid);
              } else if (that.tKind === 'O') {//会签
                that.params.nextOrg.push(that.selectedPerson[i].userid);
              }
            }
            that.params.comment = this.comments;
            that.params.fromId = 'JKA05';
            that.showIndicator("加载中...");
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
            },function (error) {
              that.hideIndicator();
              that.showAlert("数据加载失败");
            });
          }
        }
      },
      //选择下一步的人
      selectNextPerson() {
        if (this.toTransferListUser.length !== 0) {
          this.$router.push({
            path: '/toNextList',
            query: {
              selectedPerson: this.selectedPerson,
              page: 'toRead',
              deleteAll: this.$route.query.deleteAll,
              buttonTitle: this.buttonTitle,
              from: 'fromToNext',
              listUser: this.toTransferListUser,
              tKind: this.tKind,
              buttonInfo: this.nextTran,
              caozuo: this.params.caozuo
            }
          })
        } else {
          this.$router.push({
            path: '/toReadList',
            query: {
              selectedPerson: this.selectedPerson,
              page: 'toRead',
              deleteAll: this.$route.query.deleteAll,
              buttonTitle: this.buttonTitle,
              caozuo: this.params.caozuo,
              taskId: this.params.taskId,
              from: 'fromToNext'
            }
          });
        }
      },
      init() {
        if (this.$route.query.deleteAll === 'deleteAll') {//从详情页面跳入
          // this.$refs.myPickerNext.slots[0].values = [];//清空picker选项列表
          //清空页面数据
          this.selectedPerson = [];
          this.showTransfer = false;
          this.comments = '同意';

          this.buttonTitle = this.$route.query.buttonTitle ? this.$route.query.buttonTitle : '流转';
          this.nextTran = this.$route.query.buttonInfo ? this.$route.query.buttonInfo : '';
          this.selectNext = this.nextTran[0].transitionName;
          this.getShowTransfer();

          this.params.caozuo = this.$route.query.caozuo ? this.$route.query.caozuo : '';
          this.params.taskId = this.$route.query.taskId ? this.$route.query.taskId : '';
          this.params.instanceId = this.$route.query.taskId ? this.$route.query.taskId : '';//销售审批用合同单号
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
          if(this.buttonTitle === '销售审批'){
            this.params.userId = interfaceService.getCookie("UserId");
          }else{
            this.params.userId = interfaceService.getCookie("Token");
          }
        } else {//从流转列表页面跳入
          //清空
          // this.params.nextUser = [];
          // this.params.nextOrg = [];
          this.selectedPerson = this.$route.query.selectedPerson;
        }
      },
      goBack() {
        this.popupVisible = false;
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
          this.$router.push({path: '/wkApprovalDetail', query: {page: 'toReadList'}})
        }
      },
      btn_cancel() {
        this.popupVisible = false;
      },
      btn_confirm_next() {
        this.selectNext = this.$refs.myPickerNext.selected;
        this.popupVisible = false;
      },
      openPopNext() {
        this.popupVisible = true;
        this.$refs.myPickerNext.slots[0].values = [];//清空picker选项列表
        //赋值picker选项列表
        for (let i = 0; i < this.nextTran.length; i++) {
          this.$refs.myPickerNext.slots[0].values.push(this.nextTran[i].transitionName);
        }
      },
      getShowTransfer() {
        this.tKind = '';
        for (let i = 0; i < this.nextTran.length; i++) {
          if (this.selectNext === this.nextTran[i].transitionName) {
            this.params.nextTran = this.nextTran[i].transitionLabel;
            console.log(this.nextTran[i].tKind)
            if (this.nextTran[i].tKind) {
              this.showTransfer = true;
              if (this.nextTran[i].tKind === 'U') {
                this.tKind = this.nextTran[i].tKind;
                if (this.nextTran[i].listUser) {
                  this.toTransferListUser = this.nextTran[i].listUser
                } else {
                  this.toTransferListUser = []
                }
              } else if (this.nextTran[i].tKind === 'O') {
                if (this.nextTran[i].listGroup) {
                  this.toTransferListUser = this.nextTran[i].listGroup;
                  this.tKind = this.nextTran[i].tKind;
                } else {
                  this.toTransferListUser = []
                }
              }
            } else {
              this.showTransfer = false;
            }
            break;
          }
        }
      }
    },
    watch: {
      selectNext(newVal, oldVal) {
        this.selectedPerson = [];
        this.params.nextUser = [];
        this.params.nextOrg = [];
        this.tKind = '';
        this.getShowTransfer();
      }
    },
    activated() {
      document.getElementById("showModel").style.display = "none";
      this.init();
    },
    created() {
      document.getElementById("showModel").style.display = "none";
      this.init();
    },
  }
</script>
<style lang="scss" scoped="">

  .toNext {
    background: #fff;
    .body-content {
      height: calc(100% - 100px);
      display: block;
      overflow: auto;
      box-sizing: border-box;
      margin-bottom: 55px;
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
      .ckeck-list {
        border-top: 2px solid #1e8fe1;
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
