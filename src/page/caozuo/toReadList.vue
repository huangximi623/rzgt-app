<template>
  <div class="toReadList">
    <header-simple class="list-header">
      <div class="left-button" @click="toParent()" slot="left"
           v-if="contactData&&contactData.length>1&&!searchShowOrHide">
        <i class="fa fa-chevron-left"></i></div>
      <div class="left-button" @click="goBack()" slot="left"
           v-if="contactData&&contactData.length==1&&!searchShowOrHide">
        <i class="fa fa-chevron-left"></i></div>
      <div class="list-title" slot="title">
        {{title[title.length-1]}}
      </div>
      <div class="right-button" slot="right" @click="toSearch()">
        <i class="fa fa-search" style="color: white" v-if="!searchShowOrHide"></i>
        <div v-if="searchShowOrHide">取消</div>
      </div>
    </header-simple>
    <!--搜索-->
    <div class="searchbar" v-if="searchShowOrHide">
      <div class="searchbar-inner">
        <i class="fa fa-search"></i>
        <form class="search-form" action="javascript:return true;">
          <input type="search" autofocus placeholder="姓名、工号、电话" class="searchbar-core" v-model="searchVal"
                 @keyup.enter="search(searchVal)">
        </form>
      </div>
      <div class="searchbar-button" @click="search(searchVal)">搜索</div>
    </div>
    <body-content class="body-content">
      <div class="person-list" v-if="contactData && !searchShowOrHide">
        <div v-for="(item,index) in contactData[contactData.length-1]" :key="index">
          <div v-if="item.isDept"
               @click="toChildren(item.detail.groupLabel,item.detail.groupName,item.detail.groupKind)">
            <mt-cell :title="item.label + ' - ' + item.name"
                     is-link>
              <!--<span>icon 是图片</span>-->
              <!--<img slot="icon" src="../../assets/logo.png" width="24" height="24">-->
              <i slot="icon" class="fa fa-sitemap fa-lg" style="color:#1e8fe1 "></i>
            </mt-cell>
          </div>
        </div>
        <check-list
          align="right"
          v-model="value"
          :options="option">
        </check-list>
      </div>
      <div class="person-list-search" v-if="searchShowOrHide">
        <check-list
          align="right"
          v-model="searchValue"
          :options="option">
        </check-list>
      </div>
    </body-content>

    <div class="footer-button">
      <div class="btn-active select-current" @click="selectCurrentAll()">选择当前节点全部</div>
      <div class="btn-active confirm" @click="confirmSelected()">确定</div>
      <div class="btn-active clear-all" @click="clearAll()">清除已选</div>
    </div>

  </div>
</template>

<script>
  import HeaderSimple from '@/components/header/header-simple'
  import BodyContent from "@/components/bodyContent/body-content"
  import CheckList from "@/components/checklist/checklist"
  import interfaceService from '../../service/interfaceService.js'

  export default {
    name: 'toReadList',
    data() {
      return {
        contactData: [],//存放当前节点与所有父亲节点的数据
        title: ["组织机构"],//存放当前节点所有父组织名称
        paramsContacts: {
          "groupLabel": "",
          "groupKind": ""
        },
        searchVal: '',//搜索值
        searchShowOrHide: false,
        searchPerson: [],//搜索返回的人员列表
        searchValue: [],//搜索页面选中的值
        option: [],//用于存放当前节点的person
        options: [],//用于存放所有节点的person(二维数组)
        value: [],//用于存放选中的person
        approvalType: '' //审批类型
      }
    },
    components: {HeaderSimple, BodyContent, CheckList},
    methods: {
      //显示搜索框
      toSearch() {
        this.searchVal = '';
        if (!this.searchShowOrHide) {
          this.searchShowOrHide = true;
          this.title.push("搜索");
          this.option = [];
        } else {
          this.searchShowOrHide = false;
          if (this.searchPerson.length !== 0) {
            this.contactData.pop();//移除数组最后一项
            this.title.pop();
            this.options.pop();
            this.option = this.options[this.options.length - 1];
            this.searchValue = [];
            this.searchPerson = [];
          } else {
            this.title.pop();
            this.option = this.options[this.options.length - 1];
          }
        }
      },
      //搜索员工
      search(searchVal) {
        let that = this;
        //如果搜索数组不为空，先移除contactData和options最后一项
        if (that.searchPerson.length !== 0) {
          that.contactData.pop();
          that.options.pop();
        }
        that.option = [];
        that.searchPerson = [];
        if (!searchVal) {
          that.showAlert("请输入要查询的人员信息！")
        } else {
          that.showIndicator("查询中...");
          interfaceService.queryPersonList({type: this.approvalType,queryValue: searchVal})
            .then(function (response) {
              if (response.length === 0) {
                that.searchVal = '';
                that.hideIndicator();
                that.showAlert("查无此人！")
              } else {
                that.hideIndicator();
                that.searchPerson = response;
                that.contactData.push(that.searchPerson);
                for (let i = 0; i < that.searchPerson.length; i++) {
                  if (!that.searchPerson[i].isDept) {
                    that.option.push({
                      userId: that.searchPerson[i].label,//工号
                      userName: that.searchPerson[i].name,//姓名
                      deptCode: that.searchPerson[i].deptCode,//部门编号
                      deptName: that.searchPerson[i].deptName,//部门名称
                      deptTitle: !that.searchPerson[i].theTitle ? '职员' : that.searchPerson[i].theTitle,//职位
                      value: {name: that.searchPerson[i].name, userid: that.searchPerson[i].label}
                    });
                  }
                }
                that.options.push(that.option);
              }
            }, function (error) {
              that.hideIndicator();
              that.showAlert("数据查询失败！")
            });
        }
      },
      //判断
      isInArray(arr, value) {
        for (let i = 0; i < arr.length; i++) {
          if (value === arr[i].userid) {
            return true;
          }
        }
        return false;
      },
      //选择当前节点全部
      selectCurrentAll() {
        //判断是否是搜索列表
        if (this.searchShowOrHide) {
          //全选搜索列表的人员
          for (let i = 0; i < this.option.length; i++) {
            if (!this.isInArray(this.searchValue, this.option[i].value.userid)) {
              this.searchValue.push(this.option[i].value);
            }
          }
        } else {
          //全选当前页面的全部人员
          for (let i = 0; i < this.option.length; i++) {
            if (!this.isInArray(this.value, this.option[i].value.userid)) {
              this.value.push(this.option[i].value);
            }
          }
        }
      },
      //确定已选
      confirmSelected() {
        //将搜索列表中选中的且不在value数组中的值添加进value数组
        for (let i = 0; i < this.searchValue.length; i++) {
          if (!this.isInArray(this.value, this.searchValue[i].userid)) {
            this.value.push(this.searchValue[i]);
          }
        }
        this.searchValue = [];//清空searchValue数组
        if (this.$route.query.from === 'fromToNext') {
          this.$router.push({
            path: '/doNext',
            query: {
              selectedPerson: this.value,
              buttonTitle: this.$route.query.buttonTitle,
              caozuo: this.$route.query.caozuo,
              taskId: this.$route.query.taskId,
              page: 'toReadList'
            }
          })
        } else {
          this.$router.push({
            path: '/doCirculation',
            query: {
              selectedPerson: this.value,
              buttonTitle: this.$route.query.buttonTitle,
              caozuo: this.$route.query.caozuo,
              taskId: this.$route.query.taskId,
              page: 'toReadList'
            }
          })
        }
      },
      //清除已选
      clearAll() {
        this.value = [];
        this.searchValue = [];
      },
      goBack() {
        if (this.$route.query.buttonTitle === '行政审批') {
          this.$router.push({path: '/administrativeExaminationDetail', query: {page: 'toReadList'}})
        } else if (this.$route.query.buttonTitle === '公文审批') {
          this.$router.push({path: '/documentDetail', query: {page: 'toReadList'}})
        } else if (this.$route.query.buttonTitle === '会议管理') {
          this.$router.push({path: '/meetingManagerDetails', query: {page: 'toReadList'}})
        } else if (this.$route.query.buttonTitle === '接待管理') {
          this.$router.push({path: '/receptionManagerDetails', query: {page: 'toReadList'}})
        } else if (this.$route.query.buttonTitle === '销售审批') {
          this.$router.push({path: '/salesApprovalDetail', query: {page: 'toReadList'}})
        } else if (this.$route.query.buttonTitle === '京华审批') {
          this.$router.push({path: '/jhApprovalDetail', query: {page: 'toReadList'}})
        } else if (this.$route.query.buttonTitle === '营钢审批') {
          this.$router.push({path: '/wkApprovalDetail', query: {page: 'toReadList'}})
        } else if (this.$route.query.buttonTitle === '招采签核') {
          this.$router.push({path: '/publicBiddingDetail', query: {page: 'toReadList'}})
        }
      },
      //获取顶层组织
      getTopGroup(type) {
        let that = this;
        that.showIndicator("加载中...");
        interfaceService.queryTopOrganization(type)
          .then(function (response) {
            that.hideIndicator();
            that.contactData.push(response);
            for (let i = 0; i < response.length; i++) {
              if (!response[i].isDept) {
                that.option.push({
                  userId: response[i].label,//工号
                  userName: response[i].name,//姓名
                  deptCode: response[i].deptCode,//部门编号
                  deptName: response[i].deptName,//部门名称
                  deptTitle: !response[i].theTitle ? '职员' : response[i].theTitle,//职位
                  value: {name: response[i].name, userid: response[i].label}
                });
              }
            }
            that.options.push(that.option);
          }, function (error) {
            that.hideIndicator();
            that.showAlert("数据加载失败")
          });
      },
      //获取子目录
      getContact(params, groupName) {
        let that = this;
        that.showIndicator("加载中...");
        that.option = [];
        interfaceService.queryContactList(this.approvalType, params)
          .then(function (response) {
            that.hideIndicator();
            if (response.length === 0) {
              that.showToast("该组织下无子节点！")
            } else {
              that.title.push(groupName);
              that.contactData.push(response);
              //将当前节点的所有person存入option数组，以供选择
              for (let i = 0; i < response.length; i++) {
                if (!response[i].isDept) {
                  that.option.push({
                    userId: response[i].label,//工号
                    userName: response[i].name,//姓名
                    deptCode: response[i].deptCode,//部门编号
                    deptName: response[i].deptName,//部门名称
                    deptTitle: !response[i].theTitle ? '职员' : response[i].theTitle,//职位
                    value: {name: response[i].name, userid: response[i].label}
                  });
                }
              }
              that.options.push(that.option);//将当前节点的option数组存入options数组，用于数据的暂存
            }
          }, function (error) {
            that.hideIndicator();
            that.showAlert("数据加载失败")
          });
      },
      toChildren(groupLabel, groupName, groupKind) {
        this.paramsContacts.groupLabel = groupLabel;
        this.paramsContacts.groupKind = groupKind;
        // this.title.push(groupName);
        this.getContact(this.paramsContacts, groupName);
      },
      toParent() {
        this.contactData.pop();//移除数组最后一项
        this.title.pop();
        this.options.pop();
        this.option = this.options[this.options.length - 1];
      },
      //数据初始化
      init() {
        //清空
        // alert(this.$route.query.buttonTitle);
        this.approvalType = this.$route.query.buttonTitle;
        this.contactData = [];
        this.option = [];
        this.options = [];
        this.value = this.$route.query.selectedPerson;
        this.searchVal = '';//搜索值
        this.searchShowOrHide = false;
        this.searchPerson = [];
        this.getTopGroup(this.approvalType);
      }
    },
    activated() {
      if (this.$route.query.page === 'toRead') {
        this.init();
        if (this.$route.query.deleteAll === 'deleteAll') {
          this.value = [];//清空value数组
          this.searchValue = [];//清空searchValue数组
          this.title = ["组织机构"];
        }
      }
    }
  }
</script>
<style lang="scss" scoped>

  .toReadList {
    background: #fff;
    .searchbar {
      width: 100%;
      position: fixed;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      background-color: #d9d9d9;
      box-sizing: border-box;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      padding: 8px 10px;
      z-index: 1;
    }

    .searchbar-inner {
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      background-color: #fff;
      border-radius: 2px;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      height: 28px;
      padding: 4px 6px;
    }

    .searchbar-button {
      width: 40px;
      height: 30px;
      line-height: 30px;
      margin: auto 0 auto 5px;
      text-align: center;
      border-radius: 4px;
      color: black;
      font-weight: bold;
      border: 1px solid black;
      background-color: transparent;
    }

    .searchbar-button:active {
      background-color: #888;
    }

    .searchbar-inner search {
      color: #d9d9d9;
    }

    .searchbar-core {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      border: 0;
      box-sizing: border-box;
      width: 90%;
      height: 100%;
      outline: 0;
      margin-left: 5px;
    }
    .search-form {
      width: 100%;
      height: 100%;
    }
    .body-content {
      height: calc(100% - 45px);
      display: block;
      overflow: auto;
      box-sizing: border-box;
      .person-list {
        padding-bottom: 45px;
      }
      .person-list-search {
        padding-bottom: 45px;
        padding-top: 45px;
      }
    }
    .footer-button {
      height: 45px;
      position: fixed;
      bottom: 0;
      width: 100%;
      background-color: white;
      z-index: 999;
      text-align: center;
      line-height: 45px;
      border-top: 1px solid #eeeeee;
      .select-current {
        float: left;
        width: 40%;
        /*background-color: #f6f8fa;*/
        color: #000;
        /*box-shadow: 0 0 0.028571rem #b8bbbf;*/
      }
      .confirm {
        float: left;
        width: 30%;
        color: #1e8fe1;
        /*background-color: #26a2ff;*/
      }
      .clear-all {
        float: right;
        width: 30%;
        color: #ef4f4f;
        /*background-color: #ef4f4f;*/
      }
    }
  }

</style>
