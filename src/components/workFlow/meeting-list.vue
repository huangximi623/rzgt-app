<template>
  <div class="meeting-list" @click="goDetails()">
    <a class="meeting-list-item">
      <div class="meeting-list-logo">
        <i class="fa fa-users fa-2x reception-icon"></i>
      </div>
      <div class="meeting-list-header overflow-hidden">{{meetmotif}}</div>
      <div class="meeting-list-content">
        <div>
          <div class="list-item">
            <div class="item-content">
              <span class="item-content-t">开始时间</span>
              <span class="item-content-c">{{starttime}}</span>
            </div>
            <div class="item-content">
              <span class="item-content-t">结束时间</span>
              <span class="item-content-c">{{endtime}}</span>
            </div>
          </div>
          <div class="meeting-list-select">
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
      taskId: {type: String},
      endtime: {type: String},
      starttime: {type: String},
      meetingStatues: {type: String},
      rowguid: {type: String},
      processId: {type: String},
      meetingroomname: {type: String},
      meetmotif: {type: String},
      exp3: {type: String},
      type: {type: String}
    },
    methods: {
      goDetails() {
        this.$router.push({
          path: '/meetingManagerDetails',
          query: {id: this.type, processId: this.processId, guid: this.rowguid, taskId: this.taskId, exp3: this.exp3}
        });
      }
    }
  }
</script>
<style lang="scss" scoped="">
  .meeting-list {
    position: relative;
    background: white;
    /*    margin-top: 10px;
        margin-left: 18px;
        margin-right: 5px;*/
    margin: 10px 5px 10px 18px;
    border-bottom-right-radius: 25px;
    box-shadow: 0px 0px 4px #D2D2D2;

    .meeting-list-header {
      margin-left: 38px;
      height: 40px;
      line-height: 40px;
      border-bottom: 2px dotted #D2D2D2;
      color: #1e8fe1;
    }
    .meeting-list-content {
      padding: 8px;
      .item-content {
        margin: 5px 15px;
        height: 20px;
        line-height: 20px;
        position: relative;
        .item-content-t {
          /*display: inline-block;*/
          height: 30px;
          width: 35%;
          color: #333333;
          position: absolute;
          left: 5%;
          text-align: left;
        }
        .item-content-c {
          /*display: inline-block;*/
          width: 50%;
          color: #999999;
          right: 10%;
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
      .meeting-list-select {
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

    .meeting-list-item {
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

    .meeting-list-logo {
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

  .meeting-list:active {
    background: #E6E6E6;
  }
</style>
