<template>
  <div class="documentRead-list" @click="goLand()">
    <a class="documentRead-list-item">
      <div class="documentRead-list-logo">
        <i class="fa fa-book fa-2x reception-icon"></i>
      </div>
      <div class="documentRead-list-header overflow-hidden">{{title}}</div>
      <div class="documentRead-list-content">
        <div>
          <div class="list-item">
            <div class="item-content">
              <!--<span class="item-content-t">文种</span>-->
              <span class="item-content-c">{{type}}</span>
            </div>
            <div class="item-content">
              <!--<span class="item-content-t">拟稿日期</span>-->
              <span class="item-content-c">{{fileDate}}</span>
            </div>
          </div>
          <div class="documentRead-list-select">
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
      ngUser: {type: String},
      fileDate: {type: String},
      title: {type: String},
      status: {type: String},
      fileGuid: {type: String},
      createDate: {type: String},
      type: {type: String},
      ngDept: {type: String},
      typeFlag: {type: String, default: ''}
    },
    methods: {
      goLand() {
        this.$router.push({
          path: '/documentReadDetail',
          query: {type: this.typeFlag, fileGuid: this.fileGuid}
        })
      }
    }
  }
</script>

<style lang="scss" scoped="">
  .documentRead-list {
    position: relative;
    background: white;
    /*    margin-top: 10px;
        margin-left: 18px;
        margin-right: 5px;
        margin-bottom: 5px;*/
    margin: 10px 5px 10px 18px;
    border-bottom-right-radius: 25px;
    box-shadow: 0px 0px 4px #D2D2D2;

    .documentRead-list-header {
      margin-left: 38px;
      height: 40px;
      line-height: 40px;
      border-bottom: 2px dotted #D2D2D2;
      color: #1e8fe1;
    }

    .documentRead-list-content {
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

      .documentRead-list-select {

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

    .documentRead-list-item {
      display: block;

      &
      .activated {
        background: #f8f8f8;
      }

    }

    &
    .item {
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

    .documentRead-list-logo {
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

  .documentRead-list:active {
    background: #E6E6E6;
  }
</style>
