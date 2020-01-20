<template>
  <div id="receiveContent">
    <ul>
      <li v-for="(item,index) in contentList">
        <mt-badge class="message-counts" size="small" color="red" v-if="item.newMessages > 0">{{item.newMessages}}</mt-badge>

        <div class="newMessageState" v-if="item.newMessages == 'new'">
          <!--<img src="../../data/img/new.gif">-->
        </div>

        <router-link :to="{path:item.href, query:{title:item.content}}">
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
    name: 'groupContent',
    data() {
      return {
        contentList: [
          {
            href: '/jhApproval',
            imgPath: require('../../assets/moduleImg/29.png'),
            content: '京华审批',
            label: 'JHSP',
            newMessages: '0',
          },
          {
            href: '/wkApproval',
            imgPath: require('../../assets/moduleImg/30.png'),
            content: '营钢审批',
            label: 'YGSP',
            newMessages: '0',
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
    /*    border: 1px solid #eeeeee;*/
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
