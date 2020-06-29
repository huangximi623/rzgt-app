<template>
  <div class="task-list-all">
    <div class="task-list" @click="goLand()">
      <a class="task-list-item">
        <div class="task-list-header overflow-hidden">{{jobNum}}</div>
        <div class="task-list-content">
          <div>
            <div class="item-content">
              {{jobName}}
            </div>
            <div class="task-list-select">
              <!--<i class="fa fa-chevron-right"></i>-->
              <!--<img src="../../assets/tab/select.png"/>-->
            </div>
          </div>
        </div>
        <div class="task-list-footer">
          <div class="item-footer">
            <div class="item-footer-t" v-if="createDate">{{createDate}}</div>
<!--            <div class="item-footer-t" v-if="pubDate">{{pubDate}}</div>-->
            <div class="item-footer-t" v-if="completeDate">{{completeDate}}</div>
            <div class="item-footer-c">{{process}}</div>
          </div>
        </div>
      </a>
    </div>

    <div class="Progress">
      <mt-progress :value="Number(process.slice(0,-1))">
      </mt-progress>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      process: {type: String},
      guid: {type: String},
      finishTime: {type: String},
      createDate: {type: String},
      pubDate: {type: String},
      completeDate: {type: String},
      jobName: {type: String},
      jobNum: {type: String},
      typeFlag: {type: String}
    },
    methods: {
      goLand() {
        this.$router.push({
          path: '/taskManagementDetails',
          query: {type: this.typeFlag, guid: this.guid}
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .Progress {
    position: relative;
    margin-left: 18px;
    margin-right: 5px;
    top: -4px;

    .mt-progress {
      height: 10px !important;
      line-height: 10px !important;
    }
  }

  .task-list {
    position: relative;
    background: white;
    margin-top: 10px;
    margin-left: 18px;
    margin-right: 5px;
    box-shadow: 0px 0px 4px #D2D2D2;

    .task-list-item {
      display: block;

      &
      .activated {
        background: #f8f8f8;
      }

    }

    .task-list-header {
      /*margin-left: 55px;*/
      padding: 12px;
      /*    height: 40px;
          line-height: 40px;*/
      border-bottom: 2px dotted #D2D2D2;
      color: #1e8fe1;
    }

    .task-list-content {
      padding: 12px;
      border-bottom: 2px dotted #D2D2D2;

      .item-content {
        /*    margin: 5px 15px;*/
        line-height: 20px;
        position: relative;

      }

      .task-list-select {

        img {
          float: right;
          width: 28px;
          height: 28px;
        }

        i {
          float: right;
          margin-top: -50px;
          color: #C8C8CD;
        }

      }
    }

    .task-list-footer {
      padding: 12px;

      .item-footer {
        overflow: visible;
        /*border-bottom-right-radius: 25px;*/
        padding: 0;
        border: none;
        position: relative;
        top: -7px;

        .item-footer-t {
          width: 50%;
          position: absolute;

        }

        .item-footer-c {
          width: 20%;
          position: absolute;
          right: 0;
          text-align: right;
        }

      }

    }

    &
    .item {
      overflow: visible;
    }

  }

  .task-list:active {
    background: #E6E6E6;
  }
</style>
