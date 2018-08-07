<template>
  <div id="processRecord" v-if="history != ''">
    <div class="procedureRecord">
      <span><label class="margin-left-5">流程记录区</label></span>
      <span class="absolute-right-10" @click="showAllRecord=!showAllRecord" v-if="!showAllRecord">显示全部</span>
      <span class="absolute-right-10" @click="showAllRecord=!showAllRecord" v-if="showAllRecord">收起</span>
    </div>
    <div class="profit-trend">
      <div class="profit-trend-datas">
        <div class="profit-trend-datas-b timeline">
          <div class="profit-trend-datas-c timeline" v-for="(item,index) in history" v-if="showAllRecord">
            <!--<div class="dot"></div>-->
            <div :class="{'dot':index!==(history.length-1)}">
              <i class="fa fa-check fa-lg check-fa" v-if="index==(history.length-1)"></i>
            </div>
            <div class="profit-trend-datas-l">
              <div>{{item.activityName.value}}</div>
              <div><i class="fa fa-user-o"></i>{{item.assigneeName.value}}</div>
              <div style="color: #000;">{{item.comment.value}}</div>
            </div>
            <div class="profit-trend-datas-r">
              {{item.endTime.value}}
            </div>
          </div>
          <div class="profit-trend-datas-c timeline" v-for="(item,index) in history"
               v-if="!showAllRecord && index==(history.length-1)">
            <div>
              <i class="fa fa-check fa-lg check-fa"></i>
            </div>
            <div class="profit-trend-datas-l">
              <div>{{item.activityName.value}}</div>
              <div><i class="fa fa-user-o"></i>{{item.assigneeName.value}}</div>
              <div style="color: #000;">{{item.comment.value}}</div>
            </div>
            <div class="profit-trend-datas-r">
              {{item.endTime.value}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'processRecord',
    props: {
      history: {type: Array}
    },
    data() {
      return {
        showAllRecord: true,
      }
    },
    created() {
      this.showAllRecord = true;
    },
    activated() {
      this.showAllRecord = true;
    }
  }
</script>

<style lang="scss" scoped>
  #processRecord {
    .check-fa {
      background-color: #4caf50 !important;
      width: 16px !important;
      height: 16px !important;
      left: 7px !important;
      border-radius: 50% !important;
      position: absolute !important;
      text-align: center !important;
      color: white !important;
      line-height: 16px !important;
    }
  }
</style>
