<template>
  <div class="acceptHistoryQuery">
    <header-simple class="list-header">
      <div class="left-button" @click="goBack()" slot="left"><i class="fa fa-chevron-left"></i></div>
      <div class="list-title" slot="title">
        {{title}}
      </div>
      <div class="right-button" slot="right">
      </div>
    </header-simple>

    <body-content class="body-content">
      <mt-cell title="起始日期">
        <input class="date-selected" type="text" @click="openPicker1()" readonly unselectable="on"
               v-model="startTime"/>
      </mt-cell>
      <mt-cell title="截止日期">
        <input class="date-selected" type="text" @click="openPicker2()" readonly unselectable="on"
               v-model="endTime"/>
      </mt-cell>

      <button class="mint-button mint-button--primary mint-button--large" @click="queryData()">
        <label >查询</label>
      </button>

    </body-content>
    <mt-datetime-picker
      ref="picker1"
      v-model="pickerVisible1"
      type="date"
      @confirm="selectDate1"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日">
    </mt-datetime-picker>
    <mt-datetime-picker
      ref="picker2"
      v-model="pickerVisible2"
      type="date"
      @confirm="selectDate2"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日">
    </mt-datetime-picker>
  </div>
</template>
<script>
  import HeaderSimple from '@/components/header/header-simple'
  import BodyContent from "@/components/bodyContent/body-content"
  import interfaceService from '../../service/interfaceService.js'

  export default {
    name: 'acceptHistoryQuery',
    components: {HeaderSimple, BodyContent},
    data() {
      return {
        title: '',
        nextPath: '',
        selectedDate: '',
        currentSelected: '',
        pickerVisible1: new Date(),
        pickerVisible2: new Date(),
        startTime: new Date().Format('yyyy-MM-dd'),
        endTime: new Date().Format('yyyy-MM-dd')
      }
    },
    //监听startTime、endTime、selectedDate变化，给pickerVisible重新赋值
    watch: {
      startTime(newVal, oldVal) {
        this.pickerVisible1 = new Date(newVal.split('-')[0], Number(newVal.split('-')[1]) - 1, this.pickerVisible1.getDate());
      },
      endTime(newVal, oldVal) {
        this.pickerVisible2 = new Date(newVal.split('-')[0], Number(newVal.split('-')[1]) - 1, this.pickerVisible2.getDate());
      },
      selectedDate1(newVal, oldVal) {
        this.pickerVisible1 = new Date(newVal.split('-')[0], Number(newVal.split('-')[1]) - 1, Number(newVal.split('-')[2]));
      },
      selectedDate2(newVal, oldVal) {
        this.pickerVisible2 = new Date(newVal.split('-')[0], Number(newVal.split('-')[1]) - 1, Number(newVal.split('-')[2]));
      }
    },
    methods: {
      queryData(){
        let difDays = this.getDaysDiff(this.startTime, this.endTime);
        if(difDays > 3) {
          this.showAlert("时间间隔不得大于三天！");
          return;
        }
        this.$router.push({
          path: this.nextPath,
          query: {sTime:this.startTime, eTime:this.endTime}
        })
      },
      goBack() {
        this.$router.push({path: '/examineReceive'});
      },
      //打开日期选择器
      openPicker1() {
        this.$refs.picker1.open();
      },
      //打开日期选择器
      openPicker2() {
        this.$refs.picker2.open();
      },
      //确定选择的时间
      selectDate1(confirm) {
        //切换到选中天
        // this.selectedDate = confirm.getFullYear() + '-' + (((confirm.getMonth() + 1) < 10) ? ('0' + (confirm.getMonth() + 1)) : (confirm.getMonth() + 1)) + '-' + ((confirm.getDate() < 10) ? ('0' + confirm.getDate()) : confirm.getDate());
        this.startTime = confirm.getFullYear() + '-' + (((confirm.getMonth() + 1) < 10) ? ('0' + (confirm.getMonth() + 1)) : (confirm.getMonth() + 1)) + '-' + ((confirm.getDate() < 10) ? ('0' + confirm.getDate()) : confirm.getDate());
      },
      //确定选择的时间
      selectDate2(confirm) {
        //切换到选中天
        // this.selectedDate = confirm.getFullYear() + '-' + (((confirm.getMonth() + 1) < 10) ? ('0' + (confirm.getMonth() + 1)) : (confirm.getMonth() + 1)) + '-' + ((confirm.getDate() < 10) ? ('0' + confirm.getDate()) : confirm.getDate());
        this.endTime = confirm.getFullYear() + '-' + (((confirm.getMonth() + 1) < 10) ? ('0' + (confirm.getMonth() + 1)) : (confirm.getMonth() + 1)) + '-' + ((confirm.getDate() < 10) ? ('0' + confirm.getDate()) : confirm.getDate());
      }
    },
    activated() {
      //
      this.title = this.$route.query.title;
      if(this.title === '验收历史数据') {
        this.nextPath = '/acceptHistory';
      } else if (this.title === '差异信息查询') {
        this.nextPath = '/diverseInfo'
      } else {
        this.nextPath = '/acceptHistoryQuery';
      }

      if(this.$route.query.page !== 'acceptHistory' && this.$route.query.page !== 'diverseInfo'){
        this.startTime = new Date().Format('yyyy-MM-dd');
        this.endTime = new Date().Format('yyyy-MM-dd');
      }
      this.currentSelected = new Date().getDate();
      this.pickerVisible1 = new Date();
      this.pickerVisible2 = new Date();
    }
  }
</script>

<style lang="scss" scoped>
  .acceptHistoryQuery {
    background: #fff;
    .body-content {
      /*margin-top: 45px;*/
      height: calc(100% - 90px);
      display: block;
      overflow: auto;
      box-sizing: border-box;
    }
    .pre-month {
      margin-right: 30px
    }
    .calendar-title {
      height: 35px;
      margin-bottom: 5px;
      .title-item {
        float: left;
        width: 14%;
        height: 35px;
        line-height: 35px;
        text-align: center;
        color: #B8BFC6;
      }
    }
    .calendar-week {
      height: 40px;
      .day-item {
        float: left;
        width: 14%;
        height: 40px;
        position: relative;
      }
      .each-day {
        width: 30px;
        height: 30px;
        line-height: 30px;
        margin-left: auto;
        margin-right: auto;
        border-radius: 14px;
        text-align: center;
        color: #4A4A4A;
      }
      .have-schedule {
        border-radius: 50%;
        border: 1px solid #1e8fe1;
      }
      .selected {
        border-radius: 50% !important;
        border: 1px solid #1e8fe1 !important;
        background: #1e8fe1;
        color: white;
      }
    }
    .date-selected {
      text-align: center;
      float: right;
      border-radius: 3px;
      height: 30px;
      font-size: 14px;
      width: 90%;
      /*border-style: hidden!important;*/
      border: 1px solid black;
      /*background: white;*/
    }

  }
</style>
