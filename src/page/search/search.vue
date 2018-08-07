<template>
  <div class="search">
    <header-simple class="list-header">
      <div class="left-button" @click="goBack()" slot="left"><i class="fa fa-chevron-left"></i></div>
      <div class="list-title" slot="title">
        {{title}}
      </div>
      <div class="right-button" slot="right">
      </div>
    </header-simple>
    <div class="searchbar">
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
      <div class="person-list">
        <mt-cell v-for="(item,index) in personList"
                 :key="index"
                 :title="item.label + ' - ' + item.name + ' - ' + (!item.theTitle ? '职员' : item.theTitle)"
                 :label="item.deptName +' - '+item.deptCode"
                 @click.native="goPersonalInfo(item)" is-link>
          <img slot="icon" src="../../assets/main/personal_checked@1x.png" width="24" height="24">
        </mt-cell>
      </div>
    </body-content>
  </div>
</template>

<script>
  import HeaderSimple from '@/components/header/header-simple'
  import BodyContent from "@/components/bodyContent/body-content"
  import interfaceService from '../../service/interfaceService.js'

  export default {
    name: 'search',
    data() {
      return {
        title: '搜索',
        searchVal: '',
        personList: []
      }
    },
    components: {HeaderSimple, BodyContent},
    methods: {
      goBack() {
        this.$router.push('/tab/contact');
      },
      //查询指定人员
      search(searchVal) {
        let that = this;
        that.personList = [];
        if(!searchVal){
          that.showAlert("请输入要查询的人员信息！")
        }else{
          that.showIndicator("查询中...");
          interfaceService.queryPersonList({queryValue: searchVal})
            .then(function (response) {
              if(response.length === 0){
                // that.personList = [];
                that.searchVal = '';
                that.hideIndicator();
                that.showAlert("查无此人！")
              }else{
                that.hideIndicator();
                that.personList = response;
              }
            }, function (error) {
              that.hideIndicator();
              that.showAlert("数据查询失败！")
            });
        }
      },
      //跳转到详情页面
      goPersonalInfo(item) {
        this.$router.push({path: '/contactDetails', query: {item: item, page: 'search'}})
      },
    },
    activated(){
      if(this.$route.query.page !== 'contactDetails'){
        this.searchVal = '';
        this.personList = [];
      }
    }
  }
</script>
<style lang="scss" scoped>
.search{
  background: #fff;
  .body-content {
    height: calc(100% - 45px);
    display: block;
    overflow: auto;
    box-sizing: border-box;
    .person-list{
      padding-top: 45px;
    }
  }
  /*.search-fixed{*/
    /*position: fixed;*/
    /*width: 100%;*/
    /*z-index: 999;*/
  /*}*/

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

  .searchbar-button:active{
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
  .search-form{
    width: 100%;
    height: 100%;
  }

  /*  .searchbar-search {
      color: #26a2ff;
      padding-left: 10px;
      text-decoration: none;
      width: 25px;
      height: 33px;
      line-height: 33px;
    }*/
}

</style>
