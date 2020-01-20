<template>
  <div class="contact">
    <header-simple class="list-header">
      <div class="left-button" @click="toParent()" slot="left" v-if="this.g_contact&&this.g_contact.length>1"><i
        class="fa fa-chevron-left"></i></div>
      <div class="left-button" slot="left" v-if="this.g_contact&&this.g_contact.length==1"></div>
      <div class="list-title" slot="title">
        {{this.g_title[this.g_title.length-1]}}
      </div>
      <div class="right-button" slot="right" @click="toSearch()">
        <i class="fa fa-search" style="color: white"></i>
      </div>
    </header-simple>

    <body-content class="body-content">
      <div class="person-list" v-if="this.g_contact">
        <div v-for="(item,index) in this.g_contact[this.g_contact.length-1]" :key="index">
          <div v-if="item.isDept" @click="toChildren(item.detail.groupLabel,item.detail.groupName)">
            <mt-cell :title="item.label + ' - ' + item.name"
                     is-link>
              <!--<span>icon 是图片</span>-->
              <!--<img slot="icon" src="../../assets/logo.png" width="24" height="24">-->
              <i slot="icon" class="fa fa-sitemap fa-lg" style="color:#1e8fe1 "></i>
            </mt-cell>
          </div>
          <div v-if="!item.isDept" @click="goPersonalInfo(item)">
            <mt-cell :title="item.label + ' - ' + item.name + ' - ' + (!item.theTitle ? '职员' : item.theTitle)"
                     :label="item.deptCode +' - '+item.deptName" is-link>
              <!--<span>icon 是图片</span>-->
              <img slot="icon" src="../../assets/main/personal_checked@1x.png" width="24" height="24">
            </mt-cell>
          </div>
        </div>
      </div>
    </body-content>
  </div>
</template>

<script>
  import HeaderSimple from '@/components/header/header-simple'
  import BodyContent from "@/components/bodyContent/body-content"
  import interfaceService from '../../service/interfaceService.js'
  import {mapState} from 'vuex'

  export default {
    name: 'contact',
    data() {
      return {
        contactData: [],//存放当前节点与所有父亲节点的数据
        title: [],//存放当前节点所有父组织名称
        paramsContacts: {
          "groupLabel": ""
        },
        type: '行政审批'
      }
    },
    computed: mapState(['g_contact','g_title']),
    components: {HeaderSimple, BodyContent},
    methods: {
      //查询节点人员信息
      getContact(params, groupName) {
        let that = this;
        that.showIndicator("加载中...");
        interfaceService.queryContactList(this.type, params)
          .then(function (response) {
            that.hideIndicator();
            if (response.length === 0) {
              that.showToast("该组织下无子节点！");
            } else {
              // that.title.push(groupName);
              // that.contactData.push(response);
              that.g_title.push(groupName);
              that.g_contact.push(response);
            }
          }, function (error) {
            that.hideIndicator();
            that.showAlert("数据加载失败");
          });
      },
      //获取子节点信息
      toChildren(groupLabel, groupName) {
        this.paramsContacts.groupLabel = groupLabel;
        this.getContact(this.paramsContacts, groupName);
      },
      //获取父节点信息
      toParent() {
        // this.contactData.pop();//移除数组最后一项
        // this.title.pop();
        this.g_contact.pop();
        this.g_title.pop();
      },
      //页面初始化
      init() {
        if(this.g_contact.length == 0){
          this.paramsContacts.groupLabel = '';
          this.getContact(this.paramsContacts, "组织机构");
        }else{
          //
        }
      },
      //跳转到详情页面
      goPersonalInfo(item) {
        // this.$router.push({
        //   path: '/contactDetails',
        //   query: {contactData: this.contactData, title: this.title, item: item}
        // })
        this.$router.push({
          path: '/contactDetails',
          query: {item: item}
        })
      },
      //搜索
      toSearch() {
        this.$router.push({path: '/search'})
        // this.$router.push({
        //   path: '/search',
        //   query: {contactData: this.contactData, title: this.title}
        // })
      }
    },
    activated() {
      if (!this.$route.query.page) {
        this.init();
      } else {
        // if (this.$route.query.page === 'contactDetails') {
        // this.contactData = this.$route.query.contactData;
        // this.title = this.$route.query.title;
        // }
      }
    }
  }
</script>
<style lang="scss" scoped>

  .contact {
    background: #fff;
    .body-content {
      height: calc(100% - 45px);
      display: block;
      overflow: auto;
      box-sizing: border-box;
      .person-list {
        padding-bottom: 55px;
      }
    }
  }

</style>
