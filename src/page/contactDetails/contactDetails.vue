<template>
  <div class="contactDetails">
    <header-simple class="list-header">
      <div class="left-button" @click="goBack()" slot="left"><i class="fa fa-chevron-left"></i></div>
      <div class="list-title" slot="title">
        {{title}}
      </div>
      <div class="right-button" slot="right"></div>
    </header-simple>

<!--    <body-content class="body-content">
      <div class="person-info" v-if="personInfo&&personInfo.detail">
        <mt-cell :title="personInfo.name" class="person-name">
          &lt;!&ndash;<span>icon 是图片</span>&ndash;&gt;
          <img v-if="personInfo.picture" slot="icon" :src="personInfo.picture" :onerror="personImg" width="60" height="auto">
          <img v-else slot="icon" src="../../assets/main/personal_checked@2x.png" width="60" height="60">
          <a class="call-number" @click="showActionSheet()"
             v-if="personInfo.DirectTelIsshow=='0'|| personInfo.ShortTelIsshow=='0'">
            <i class="fa fa-phone fa-2x call-up"></i>
          </a>
          &lt;!&ndash;长号，和小号的屏蔽flag都是1,的情况下 v-if判断的值是两个假相与，就没有必要显示拨号的图标了&ndash;&gt;
        </mt-cell>
      </div>
      <mt-cell v-for="(item,index) in personInfo.detail" :key="index" :title="item.key" :value="item.value"></mt-cell>
    </body-content>-->

    <body-content class="body-content">
      <div class="person-info" v-if="personInfo&&personInfo.detail">
        <mt-cell class="person-name">
          <!--<span>icon 是图片</span>-->
          <img v-if="personInfo.picture" slot="icon" :src="personInfo.picture" :onerror="personImg" width="60%" height="auto">
          <img v-else slot="icon" src="../../assets/main/personal_checked@2x.png" width="60%" height="auto">
          <!--          <img v-if="personInfo.picture" slot="icon" :src="personInfo.picture" :onerror="personImg" width="60" height="60">-->
          <!--长号，和小号的屏蔽flag都是1,的情况下 v-if判断的值是两个假相与，就没有必要显示拨号的图标了-->
        </mt-cell>
      </div>
      <mt-cell title="拨号">
        <!--长号，和小号的屏蔽flag都是1,的情况下 v-if判断的值是两个假相与，就没有必要显示拨号的图标了-->
        <a class="call-number" @click="showActionSheet()"
           v-if="(personInfo.DirectTelIsshow==0 || personInfo.ShortTelIsshow==0) && personInfo.label != UserId">
          <i class="fa fa-phone fa-2x call-up"></i>
        </a>
      </mt-cell>
      <mt-cell v-for="(item,index) in personInfo.detail" :key="index" :title="item.key" :value="item.value"></mt-cell>
    </body-content>

    <mt-actionsheet
      :actions="actions"
      v-model="sheetVisible">
    </mt-actionsheet>
  </div>
</template>

<script>
  import HeaderSimple from '@/components/header/header-simple'
  import BodyContent from "@/components/bodyContent/body-content"
  import interfaceService from '../../service/interfaceService.js'

  export default {
    name: 'contactDetails',
    data() {
      return {
        title: '详细信息',
        personInfo: {},
        sheetVisible: false, //上拉显示电话
        actions: [], //电话数组
        UserId: '',
        personImg: 'this.src="' + require('../../assets/main/personal_checked@2x.png') + '"'
      }
    },
    components: {HeaderSimple, BodyContent},
    methods: {
      showActionSheet() {
        this.sheetVisible = true;
      },
      //拨打短号
      callShortTel() {
        window.location.href = 'tel:' + this.personInfo.shorttel;
      },
      //拨打长号
      callDirectTel() {
        window.location.href = 'tel:' + this.personInfo.directtel;
      },
      callNoqx(){
        alert("您无此用户联络权限");
      },
      init() {
        this.personInfo = this.$route.query.item;
        this.UserId = interfaceService.getCookie('UserId');
        //初始化电话数组
        if (!this.personInfo.shorttel&&this.personInfo.DirectTelIsshow==0) {//没有短号存储，再判断是否屏蔽长号flag,0为没有屏蔽
          this.actions = [{
            name: this.personInfo.directtel,
            method: this.callDirectTel
          }];
        } else if (!this.personInfo.directtel) {
          this.actions = [{
            name: this.personInfo.shorttel,
            method: this.callShortTel
          }];
        }else if(this.personInfo.DirectTelIsshow==0&&this.personInfo.ShortTelIsshow==0 ){//，长号和短号都存储，只有屏蔽flag都为0是展示全号和小号
          this.actions = [{
            name: this.personInfo.shorttel,
            method: this.callShortTel
          }, {
            name: this.personInfo.directtel,
            method: this.callDirectTel
          }];
        }
        else {
         /* console.log("长号的屏蔽值"+this.personInfo.DirectTelIsshow)
          console.log("短号的屏蔽之"+this.personInfo.ShortTelIsshow)*/
          this.actions = [{
            name: "不公开号码",
            method: this.callNoqx
          }];
        }
        this.sheetVisible = false;
      },
      goBack() {
        if (this.$route.query.page === 'search') {
          this.$router.push({path: '/search', query: {page: 'contactDetails'}});
        } else if (this.$route.query.page === 'personal') {
          this.$router.push({path: '/tab/personal'});
        } else {
          this.$router.push({
            path: '/tab/contact',
            query: {contactData: this.$route.query.contactData, title: this.$route.query.title, page: 'contactDetails'}
          });
        }
      }
    },
    created() {
      this.init();
    }
  }
</script>
<style lang="scss">

  .contactDetails {
    background: #fff;
    .body-content {
      height: calc(100% - 45px);
      display: block;
      overflow: auto;
      box-sizing: border-box;
    }
    .person-info {
      .person-name {
        min-height: 100px;
        text-align: center;
        .call-up {
          margin-right: 20px;
          margin-left: 20px;
          color: #1e8fe1;
        }
      }
      .mint-cell-title {
        .mint-cell-text {
          margin-left: 20px;
        }
      }
    }
    .call-number:active {
      background: #E6E6E6;
    }
  }

</style>
