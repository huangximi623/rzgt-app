<template>
  <div class="toNextList">
    <header-simple class="list-header">
      <div class="left-button" @click="goBack()" slot="left" v-if="!searchShowOrHide">
        <i class="fa fa-chevron-left"></i>
      </div>
      <div class="list-title" slot="title">
        {{title}}
      </div>
      <div class="right-button" slot="right" @click="showSearch()">
        <i class="fa fa-search" style="color: white" v-if="!searchShowOrHide"></i>
        <div v-if="searchShowOrHide">取消</div>
      </div>
    </header-simple>

    <div class="searchbar" v-if="searchShowOrHide">
      <div class="searchbar-inner">
        <i class="fa fa-search"></i>
        <form class="search-form" action="javascript:return true;">
          <input type="search" autofocus placeholder="姓名、工号" class="searchbar-core" v-model="searchVal"
                 @keyup.enter="search(searchVal)">
        </form>
      </div>
      <div class="searchbar-button" @click="search(searchVal)">搜索</div>
    </div>

    <body-content class="body-content">
      <div class="person-list" v-if="!searchShowOrHide">
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
          :options="searchOption">
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
    name: 'toNextList',
    data() {
      return {
        title: '流转',
        searchShowOrHide: false,
        searchVal: '',//搜索值
        searchValue: [],
        searchOption: [],
        option: [],//用于存放当前节点的person
        value: [] //用于存放选中的person
      }
    },
    components: {HeaderSimple, BodyContent, CheckList},
    methods: {
      showSearch() {
        this.searchVal = '';
        if (!this.searchShowOrHide) {
          this.searchShowOrHide = true;
          this.title = '搜索';
          this.searchOption = [];
        } else {
          this.searchShowOrHide = false;
          this.title = '流转';
        }
      },
      search(searchVal) {
        this.searchOption = [];
        for (let i = 0; i < this.option.length; i++) {
          if (this.option[i].value.name.search(searchVal) !== -1 || this.option[i].value.userid.search(searchVal) !== -1) {
            if (!searchVal) {
              this.showAlert("查无此人！");
            } else {
              this.searchOption.push(this.option[i]);
            }
          }
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
        this.$router.push({
          path: '/doNext',
          query: {
            selectedPerson: this.value,
            page: 'toNextList',
            buttonTitle: this.$route.query.buttonTitle
          }
        })
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
          this.$router.push({path: '/salesApprovalDetail', query: {page: 'toReadList'}});
        }
      },
      //数据初始化
      init() {
        //清空
        this.option = [];
        this.value = this.$route.query.selectedPerson;//将原来选中的person传给value数组
        this.searchVal = '';//搜索值
        this.searchShowOrHide = false;
        this.searchOption = [];
        //赋值
        for (let i = 0; i < this.$route.query.listUser.length; i++) {
          if (this.$route.query.tKind === 'U') {
            this.option.push({
              tKind:'U',
              userId: this.$route.query.listUser[i].userId,//工号
              userName: this.$route.query.listUser[i].userName,//姓名
              deptCode: this.$route.query.listUser[i].deptCode,//部门编号
              deptName: this.$route.query.listUser[i].deptName,//部门名称
              deptTitle: !this.$route.query.listUser[i].deptTitle ? '职员' : this.$route.query.listUser[i].deptTitle,//职位
              value: {name: this.$route.query.listUser[i].userName, userid: this.$route.query.listUser[i].userId}
            });
          } else if (this.$route.query.tKind === 'O') {
            this.option.push({
              tKind:'O',
              label: this.$route.query.listUser[i].groupName,
              value: {name: this.$route.query.listUser[i].groupName, userid: this.$route.query.listUser[i].groupLabel}
            });
          }
        }
      }
    },
    watch: {},
    activated() {
      if (this.$route.query.page === 'toRead') {
        this.init();
        if (this.$route.query.deleteAll === 'deleteAll') {
          this.value = [];//清空value数组
          this.searchValue = [];//清空searchValue数组
        }
      }
    }
  }
</script>
<style lang="scss" scoped>

  .toNextList {
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
