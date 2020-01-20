<template>
  <div id="contentGuide">
    <ul>
      <li v-for="(item,index) in contentList">
        <mt-badge class="message-counts" size="small" color="red" v-if="item.newMessages > 0">{{item.newMessages}}</mt-badge>

        <div class="newMessageState" v-if="item.newMessages == 'new'">
          <!--<img src="../../data/img/new.gif">-->
        </div>

        <router-link :to="item.href">
          <!--<span :class="item.class" :style="item.style"></span>{{item.content}}-->
          <img :src="item.imgPath" class="contentImg"/>
          <span>{{item.content}}</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'contentGuide',
    data() {
      return {
        contentList: [
          {
            href: '/administrativeExamination',
            imgPath: require('../../assets/moduleImg/1.png'),
            content: '行政审批',
            label: 'WF',
            newMessages: '0',
          }, {
            href: '/documents',
            imgPath: require('../../assets/moduleImg/2.png'),
            content: '公文审批',
            label: 'CWCR',
            newMessages: '0',
          }, {
            href: '/documentRead',
            imgPath: require('../../assets/moduleImg/3.png'),
            content: '公文阅知',
            label: 'GWYZ',
            newMessages: '0',
          }, {
            href: '/meetingManager',
            imgPath: require('../../assets/moduleImg/4.png'),
            content: '会议管理',
            label: 'Meeting',
            newMessages: '0',
          }, {
            href: '/taskManagement',
            imgPath: require('../../assets/moduleImg/5.png'),
            content: '任务管理',
            label: 'JB',
            newMessages: '0',
          }, {
            href: '/receptionManager',
            imgPath: require('../../assets/moduleImg/6.png'),
            content: '接待管理',
            label: 'JD',
            newMessages: '0',
          }, /*{
            href: '/erp',
            imgPath: require('../../assets/moduleImg/13.png'),
            content: 'ERP审批',
            label: 'ERP',
            newMessages: '',
          },*/ {
            href: '/informationPublish',
            imgPath: require('../../assets/moduleImg/7.png'),
            content: '信息发布',
            label: 'IW',
            newMessages: '',
          }, {
            href: '/schedule',
            imgPath: require('../../assets/moduleImg/8.png'),
            content: '日程管理',
            label: '',
            newMessages: '0',
          }, {
            href: '/documentCenter',
            imgPath: require('../../assets/moduleImg/9.png'),
            content: '文档中心',
            label: 'DOC',
            newMessages: '',
          }, {
            href: '/group',
            imgPath: require('../../assets/moduleImg/28.png'),
            content: '集团审批',
            label: 'JTWF',
            newMessages: '',
          }
        ]
      }
    }
  }
</script>

<style lang="scss" scoped>

  .message-counts {
    position: absolute;
    top: 5px;
    right: 12px;
    animation: mymove 0.5s;
    -webkit-animation: mymove 0.5s; /*Safari and Chrome*/
  }

  @keyframes mymove {
    0% {
      top: -5px;
    }
    20% {
      top: 5px;
    }
    50% {
      top: 0;
    }
    100% {
      top: 5px;
    }
  }

  @-webkit-keyframes mymove { /*Safari and Chrome*/
    0% {
      top: -5px;
    }
    20% {
      top: 5px;
    }
    50% {
      top: 0;
    }
    100% {
      top: 5px;
    }
  }

  .newMessageState {
    position: absolute;
    border: 1px solid red;
    background: red;
    border-radius: 50%;
    height: 10px;
    width: 10px;
    top: 5px;
    right: 16px;
    animation: mymove 0.5s;
    -webkit-animation: mymove 0.5s; /*Safari and Chrome*/
  }

  ul li {
    list-style-type: none;
    position: relative;
    height: 90px;
    text-align: center;
  }

  ul li:active {
    background: #E6E6E6;
  }

  .index-info-list {
    background: #f8f8f8;
  }

  .index-info-list ul li {
    float: left;
    width: 33.33333333%;
    text-align: center;
    padding: 15px 10px;
    border: 1px solid #eeeeee;
    border-left: none;
    border-top: none;
  }

  .index-info-list ul li:nth-child(3n) {
    border-right: none;
  }

  .index-info-list ul li a {
    color: #666;
    text-decoration: none;
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
    /*    -webkit-user-select: none;
        -moz-user-focus: none;
        -moz-user-select: none;*/
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    padding-top: 15px;
  }

  .index-info-list ul li a span {
    display: block;
    /* padding-top: 10px;*/
  }

  .clearfix:after {
    content: "";
    display: block;
    overflow: hidden;
    height: 0;
    clear: both;
    visibility: hidden;
  }

  .contentImg {
    height: 35px;
    /*    width: 25px;*/
  }
</style>
