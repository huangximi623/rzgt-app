<template>
  <div id="foot-guide">
    <ul>
      <li v-for="(button,index) in navButtons" @click="clickListener(index)">
        <div class="newMessageState" v-if="button.newMessages == 'new'">
        </div>
        <router-link :to="button.toPath">
          <img class="foot-img" :src="button.imgPath"/>
          <span :style="{color:button.color}">{{ button.name }}</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
  import interfaceService from '../../service/interfaceService.js'

  export default {
    name: 'footGuide',
    data() {
      return {
        activeIndex: 0,
        paramsErpDaiban:{},
        navButtons: [
          {
            name: '工作台',
            color: '#929292',
            toPath: '/tab/home',
            imgPath: require('../../assets/main/home_unchecked@1x.png'),
            newMessages: ''
          },
/*          {
            name: 'ERP',
            toPath: '/tab/erp',
            color: '#929292',
            imgPath: require('../../assets/main/erp_unchecked@1x.png'),
            newMessages: ''
          },*/
          {
            name: '通讯录',
            toPath: '/tab/contact',
            color: '#929292',
            imgPath: require('../../assets/main/application_unchecked@1x.png'),
            newMessages: ''
          },
          {
            name: '我的',
            toPath: '/tab/personal',
            color: '#929292',
            imgPath: require('../../assets/main/personal_unchecked@1x.png'),
            newMessages: ''
          }
        ]
      }
    },
    methods: {
      clickListener: function (index) {
        let imgPath = ''
        switch (index) {
          case 0:
            imgPath = require('../../assets/main/home_checked@1x.png')
            break
          /*case 1:
            imgPath = require('../../assets/tab/message_checked@1x.png')
            break*/
/*          case 1:
            imgPath = require('../../assets/main/erp_checked@1x.png')
            break*/
          case 1:
            imgPath = require('../../assets/main/application_checked@1x.png')
            break
          case 2:
            imgPath = require('../../assets/main/personal_checked@1x.png')
            break
        }
        this.navButtons[index].imgPath = imgPath
        this.navButtons[index].color = '#1e8fe1'
        this.activeIndex = index
      },
      //获取销售待办数量
      getErpDaiban() {
        let that = this;
        //获取ERP待办数量
        // alert(interfaceService.getCookie("UserId"));
        that.paramsErpDaiban = {
          "fromId":"JKA01",
          "test":"Y",
          // "userId":"R002019"
          "userId":interfaceService.getCookie("UserId")
        };
        var obj = JSON.stringify(that.paramsErpDaiban);
        that.showIndicator("加载中...");
        interfaceService.queryErpData('ERP',obj)
          .then(function (response) {
            that.hideIndicator();
            let index = response.data.value;
              if(index > 0){
                that.navButtons[1].newMessages = 'new';
              }
            }, function (error) {
              that.hideIndicator();
            }
          );
      }
    },
    watch: {
      activeIndex: function (newValue, oldValue) {
        if (oldValue !== undefined) {
          let imgPath = ''
          switch (oldValue) {
            case 0:
              imgPath = require('../../assets/main/home_unchecked@1x.png')
              break
            /*case 1:
              imgPath = require('../../assets/tab/message_unchecked@1x.png')
              break*/
/*            case 1:
              imgPath = require('../../assets/main/erp_unchecked@1x.png')
              break*/
            case 1:
              imgPath = require('../../assets/main/application_unchecked@1x.png')
              break
            case 2:
              imgPath = require('../../assets/main/personal_unchecked@1x.png')
              break
          }
          this.navButtons[oldValue].imgPath = imgPath
          this.navButtons[oldValue].color = '#929292'
        }
      }
    },
    created: function () {
/*      if (this.$route.path === '/tab/erp') {
        this.navButtons[1].imgPath = require('../../assets/main/erp_checked@1x.png')
        this.navButtons[1].color = '#1e8fe1'
        this.activeIndex = 1
      } else */if (this.$route.path === '/tab/contact') {
        this.navButtons[1].imgPath = require('../../assets/main/application_checked@1x.png')
        this.navButtons[1].color = '#1e8fe1'
        this.activeIndex = 1
      } else if (this.$route.path === '/tab/personal') {
        this.navButtons[2].imgPath = require('../../assets/main/personal_checked@1x.png')
        this.navButtons[2].color = '#1e8fe1'
        this.activeIndex = 2
      } else {
        this.navButtons[0].imgPath = require('../../assets/main/home_checked@1x.png')
        this.navButtons[0].color = '#1e8fe1'
        this.activeIndex = 0
      }
      this.getErpDaiban();
    },
    beforeUpdate(){
/*      if (this.$route.path === '/tab/erp') {
        this.navButtons[1].imgPath = require('../../assets/main/erp_checked@1x.png')
        this.navButtons[1].color = '#1e8fe1'
        this.activeIndex = 1
      } else */if (this.$route.path === '/tab/contact') {
        this.navButtons[1].imgPath = require('../../assets/main/application_checked@1x.png')
        this.navButtons[1].color = '#1e8fe1'
        this.activeIndex = 1
      } else if (this.$route.path === '/tab/personal') {
        this.navButtons[2].imgPath = require('../../assets/main/personal_checked@1x.png')
        this.navButtons[2].color = '#1e8fe1'
        this.activeIndex = 2
      } else {
        this.navButtons[0].imgPath = require('../../assets/main/home_checked@1x.png')
        this.navButtons[0].color = '#1e8fe1'
        this.activeIndex = 0
      }
    }

  }
</script>

<style scoped>
  #foot-guide {
    border-top: 1px solid #eeeeee;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    z-index: 999;
  }

  #foot-guide ul {
    width: 100%;
    list-style: none;
  }

  #foot-guide ul li a {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    padding-top: 6px;
  }

  #foot-guide ul li {
    width: 33.33333333%;
/*    width: 25%;*/
    float: left;
    height: 55px;
    text-align: center;
    position: relative;
  }

  #foot-guide ul li:active {
    background: #E6E6E6;
  }

  #foot-guide img {
    vertical-align: middle;
  }

  #foot-guide span {
    width: 100%;
    color: #929292;
    position: absolute;
    left: 0;
    bottom: 8px;
  }

  #foot-guide .foot-img {
    width: 20px;
    height: 20px;
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

</style>
