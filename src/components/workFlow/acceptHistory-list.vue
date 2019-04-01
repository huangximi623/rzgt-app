<template>
  <div class="acceptHistory-list" @click="goDetails()">
    <a class="acceptHistory-list-item">
      <div class="acceptHistory-list-logo">
        <i class="fa fa-history fa-2x reception-icon"></i>
      </div>
      <div class="acceptHistory-list-header overflow-hidden">{{wgtlistno}}</div>
      <div class="acceptHistory-list-content">
        <div>
          <div class="list-item">
            <div class="item-content">
              <!--<span class="item-content-t">{{submit}}</span>-->
              <span class="item-content-c">{{carrierno}}</span>
            </div>
            <div class="item-content">
              <span class="item-content-c">{{inputtime}}</span>
            </div>
            <div class="item-content">
              <span class="item-content-c">{{fromdesc}}</span>
            </div>
          </div>
          <div class="acceptHistory-list-select">
            <i class="fa fa-chevron-right"></i>
            <!--<img src="../../assets/tab/select.png"/>-->
          </div>
        </div>
      </div>
    </a>
  </div>
</template>

<script>
  export default {
    props: {
      wgtlistno: {type: String},
      carrierno: {type: String},
      inputtime: {type: String},
      fromdesc: {type: String}
    },
    data(){
      return{
        /* listflag:'',*/
        flag: false
      }
    },
    methods: {
      goDetails() {
        if (this.$route.path === '/acceptHistory') {
          this.$router.push({path: '/acceptHistoryDetail', query: {InstanceId: this.wgtlistno}});
        } else if (this.$route.path === '/diverseInfo') {
          this.$router.push({path: '/diverseInfoDetail', query: {InstanceId: this.wgtlistno}});
        }
      }
    }
  }
</script>

<style lang="scss" scoped="">
  .acceptHistory-list {
    position: relative;
    background: white;
    /*    margin-top: 10px;
        margin-left: 18px;
        margin-right: 5px;*/
    margin: 10px 5px 10px 18px;
    border-bottom-right-radius: 25px;
    box-shadow: 0px 0px 4px #D2D2D2;

    .acceptHistory-list-header {
      margin-left: 38px;
      height: 40px;
      line-height: 40px;
      border-bottom: 2px dotted #D2D2D2;
      color: #1e8fe1;
    }
    .acceptHistory-list-content {
      padding: 8px;
      .item-content {
        margin: 5px 15px;
        height: 20px;
        line-height: 20px;
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
          width: 90%;
          color: #999999;
          /*right: 10%;*/
          left: 5%;
          position: absolute;
        }
      }
      .right-arrow {
        position: absolute;
        display: block;
        font-size: 20px;
        text-align: center;
        color: #ffc900;
        width: 20px;
        height: 20px;
        line-height: 20px;
        border-radius: 50%;
        top: calc(50% - 10px);
        right: 15px;
        -moz-box-shadow: -1px 1px 1px #888888; /* 老的 Firefox */
        box-shadow: -1px 1px 1px #888888;
      }
      .acceptHistory-list-select {
        img {
          float: right;
          width: 28px;
          height: 28px;
        }
        i {
          float: right;
          margin-top: -35px;
          color: #C8C8CD;
        }
      }
    }

    .acceptHistory-list-item {
      display: block;
      &.activated {
        background: #f8f8f8;
      }
    }

    &.item {
      overflow: visible;
    }
    .item-content {
      overflow: visible;
      border-bottom-right-radius: 25px;
      padding: 0px;
      border: none;
    }

    .item-options .button {
      border-bottom-right-radius: 25px;
    }

    .color-title {
      color: #1e8fe1;
    }
    .color-type {
      font-weight: bold;
      font-size: 14px;
      color: #4A4A4A;
    }
    .color-content {
      font-size: 14px;
      color: #4A4A4A;
      overflow: hidden;
      white-space: nowrap;
      white-space: pre-wrap;
    }

    .no-padding {
      padding: 0;
      margin: 0;
    }

    .acceptHistory-list-logo {
      height: 50px;
      width: 50px;
      border-radius: 25px;
      padding: 4px;
      background: white;
      position: absolute;
      top: -5px;
      left: -12px;
      img {
        height: 42px;
        width: 42px;
        border-radius: 21px;
      }
      .reception-icon {
        color: #1e8fe1;
        line-height: 40px;
      }
    }
  }

  .acceptHistory-list:active {
    background: #E6E6E6;
  }
</style>
