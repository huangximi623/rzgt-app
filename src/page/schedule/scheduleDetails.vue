<template>
  <div class="scheduleDetails">
    <header-simple class="list-header">
      <div class="left-button" @click="goBack()" slot="left"><i class="fa fa-chevron-left"></i></div>
      <div class="list-title" slot="title">
        {{title}}
      </div>
      <div class="right-button" slot="right">
      </div>
    </header-simple>
    <body-content class="body-content">
      <div class="workflow-list-item" v-for="item in detailsList">
        <div class="workflow-list-header">主题：{{item.title}}</div>
        <div class="workflow-list-content">
          <div>
            <div class="list-item">
              <div class="item-content">
                <span class="item-content-t">开始时间</span>
                <span class="item-content-c">{{item.beginTime}}</span>
              </div>
              <div class="item-content">
                <span class="item-content-t">结束时间</span>
                <span class="item-content-c">{{item.endTime}}</span>
              </div>
              <div class="item-content">
                <span class="item-content-t">地点</span>
                <span class="item-content-c">{{item.place}}</span>
              </div>
            </div>
            <div class="workflow-list-select">
            </div>
          </div>
        </div>
      </div>
    </body-content>
  </div>
</template>
<script>
  import HeaderSimple from '@/components/header/header-simple'
  import SubHeader from '@/components/subHeader/sub-header'
  import BodyContent from "@/components/bodyContent/body-content"

  export default {
    name: 'scheduleDetails',
    components: {HeaderSimple, SubHeader, BodyContent},
    data() {
      return {
        title: '日程详情',
        detailsList: []
      }
    },
    methods: {
      //返回日历页面
      goBack() {
        this.$router.push({path: '/schedule', query: {page: 'scheduleDetails'}});
      }
    },
    activated() {
      this.detailsList = this.$route.query.list;
    }
  }
</script>

<style lang="scss" scoped>
  .scheduleDetails {
    background: #fff;
    .body-content {
      height: calc(100% - 45px);
      display: block;
      overflow: auto;
      box-sizing: border-box;
    }
    .workflow-list-item {
      border: 1px solid #ccc;
      border-radius: 10%;
      margin: 10px;
      .workflow-list-header {
        margin-left: 15px;
        margin-right: 15px;
/*        height: 40px;*/
        height: 100%;
        line-height: 40px;
        border-bottom: 2px dotted #D2D2D2;
        color: #1e8fe1;
      }
      .workflow-list-content {
        padding: 12px;
        .item-content {
          margin: 5px 15px;
          height: 30px;
          line-height: 30px;
          position: relative;
          .item-content-t {
            /*display: inline-block;*/
            height: 30px;
            width: 100px;
            color: #333333;
            position: absolute;
            left: 5%;
            text-align: left;
          }
          .item-content-c {
            /*display: inline-block;*/
            width: 150px;
            color: #999999;
            right: 10%;
            position: absolute;
          }
        }
      }
    }
  }


</style>
