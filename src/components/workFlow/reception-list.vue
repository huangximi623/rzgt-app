<template>
  <div class="reception-list" @click="goDetails()">
    <a class="reception-list-item">
      <div class="reception-list-logo">
        <!--<img :src="icon"/>-->
        <i class="fa fa-handshake-o fa-2x reception-icon"></i>
      </div>
      <div class="reception-list-header">
        <div class="reception-list-department">{{applyDeptname}}</div>
        <div class="reception-list-name">{{applyName}}</div>
      </div>
      <div class="reception-list-content">
        <div>
          <div class="list-item">
            <div class="item-content">
              <span class="item-content-t">{{comeDept}}</span>
              <span class="item-content-c">{{receiveTypename}}</span>
            </div>
          </div>
          <div class="reception-list-select">
            <!--<img src="../../assets/tab/select.png"/>-->
          </div>
        </div>
      </div>
      <div class="reception-list-footer">
        <div class="reception-list-level">{{reveiveLevelname}}</div>
        <div class="reception-list-time">{{createDate}}</div>
      </div>
    </a>
  </div>
</template>

<script>
  export default {
    props: {
      comeDept: {type: String},
      comeLiaisons: {type: String},
      receiveTypename: {type: String},
      comeEndtime: {type: String},
      state: {type: String},
      comeMainleaderName: {type: String},
      comeMainleaderLevel: {type: String},
      riderPlatenumber: {type: String},
      startTime: {type: String},
      comeStarttime: {type: String},
      isDeputyapproval: {type: String},
      comeNumber: {type: String},
      createDate: {type: String},
      aliveFlag: {type: String},
      taskId: {type: String},
      togetherPeople: {type: String},
      comeLiaisonsTelephone: {type: String},
      receiveType: {type: String},
      instanceId: {type: String},
      applyDeptname: {type: String},
      riderNubmer: {type: String},
      updateDate: {type: String},
      createDeptcode: {type: String},
      applyContactway: {type: String},
      updateDeptcode: {type: String},
      createUser: {type: String},
      applyName: {type: String},
      receiveGuid: {type: String},
      applyDeptcode: {type: String},
      ROWNUM_: {type: Number},
      companyAccompanied: {type: String},
      reveiveLevel: {type: String},
      reveiveLevelname: {type: String},
      applyCode: {type: String},
      riderModel: {type: String},
      updateUser: {type: String},

      typeFlag: {type: String}
    },
    methods: {
      goDetails() {
        this.$router.push({
          path: '/receptionManagerDetails',
          query: {
            typeFlag: this.typeFlag,
            processId: this.instanceId,
            guid: this.receiveGuid,
            taskId: this.taskId
          }
        });
      }
    }
  }
</script>

<style lang="scss" scoped="">
  .reception-list {
    position: relative;
    background: white;
    /*    margin-top: 10px;
        margin-left: 18px;
        margin-right: 5px;*/
    margin: 10px 5px 10px 18px;
    border-bottom-right-radius: 25px;
    box-shadow: 0px 0px 4px #D2D2D2;

    .reception-list-header {
      margin-left: 45px;
      height: 40px;
      line-height: 40px;
      border-bottom: 2px dotted #D2D2D2;
      color: #1e8fe1;
      .reception-list-department {
        float: left;
      }
      .reception-list-name {
        float: right;
        margin-right: 25px;
      }
    }
    .reception-list-content {
      padding: 12px;
      .item-content {
        margin: 5px 20px;
        height: 35px;
        /*line-height: 30px;*/
        position: relative;
        /*width: 90%;*/
        .item-content-t {
          /*display: inline-block;*/
          height: 30px;
          /*width: 60%;*/
          width: 70%;
          color: #333333;
          position: absolute;
          left: 5%;
          text-align: left;
          word-break:break-all;
        }
        .item-content-c {
          /*display: inline-block;*/
          /*width: 35%;*/
          width: 30%;
          color: #999999;
          position: absolute;
          text-align: right;
          right: 0;
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
      .reception-list-select {
        img {
          float: right;
          width: 28px;
          height: 28px;
        }
      }
    }
    .reception-list-footer {
      margin-left: 45px;
      height: 40px;
      line-height: 40px;
      border-top: 2px dotted #D2D2D2;
      color: #1e8fe1;
      .reception-list-level {
        float: left;
      }
      .reception-list-time {
        float: right;
        margin-right: 25px;
      }
    }

    .reception-list-item {
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
      font-size: 12px;
      color: #4A4A4A;
      overflow: hidden;
      white-space: nowrap;
      white-space: pre-wrap;
    }

    .no-padding {
      padding: 0;
      margin: 0;
    }

    .reception-list-logo {
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

  .reception-list:active {
    background: #E6E6E6;
  }
</style>
