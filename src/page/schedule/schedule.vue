<template>
  <div class="schedule">
    <header-simple class="list-header">
      <div class="left-button" @click="goBack()" slot="left"><i class="fa fa-chevron-left"></i></div>
      <div class="list-title" slot="title">
        {{title}}
      </div>
      <div class="right-button" slot="right">
      </div>
    </header-simple>
    <sub-header>
      <div class="left-content" slot="left">
        <input class="date-selected" type="text" @click="openPicker()" readonly unselectable="on"
               v-model="baseDate"/>
      </div>
      <div class="right-content right-content-size" slot="right">
        <i class="fa fa-chevron-circle-left pre-month" style="color: white;" @click="preMonth()"></i>
        <i class="fa fa-chevron-circle-right" style="color: white" @click="nextMonth()"></i>
      </div>
    </sub-header>
    <body-content class="body-content">
      <div class="calendar-title">
        <div class="title-item" v-for="title in weekTitleList">
          {{title}}
        </div>
      </div>
      <div id="timesheetCalandar">
        <div class="calendar-week" v-for="(week,weekIndex) in calendar">
          <a class="day-item" v-for="(day,dayIndex) in week.list" @click="getSelectedDate(weekIndex,dayIndex)">
            <div class="each-day"
                 :class="{'have-schedule':isInArray(monthValue,day),'selected':(day==currentSelected)&&(!currentSelected!=true)}">
              {{day}}
            </div>
          </a>
        </div>
      </div>
      <div class="line-between"></div>

      <div class="todayDate">当前时间：{{todayDate}}</div>

      <div>
        <div class="schedule-counts" v-if="dayValue.length>0" @click="goDetails()">
          今日有{{dayValue.length}}项事件
        </div>
      </div>

    </body-content>
    <mt-datetime-picker
      ref="picker"
      v-model="pickerVisible"
      type="date"
      @confirm="selectDate"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日">
    </mt-datetime-picker>
  </div>
</template>
<script>
  import HeaderSimple from '@/components/header/header-simple'
  import SubHeader from '@/components/subHeader/sub-header'
  import BodyContent from "@/components/bodyContent/body-content"
  import interfaceService from '../../service/interfaceService.js'

  export default {
    name: 'schedule',
    components: {HeaderSimple, SubHeader, BodyContent},
    data() {
      return {
        title: '日程管理',
        todayDate: '',
        selectedDate: '',
        currentSelected: '',
        weekTitleList: ['一', '二', '三', '四', '五', '六', '日'],
        calendar: [],
        week: {
          list: []
        },
        pickerVisible: new Date(),
        baseDate: new Date().Format('yyyy-MM'),
        paramsMonth: {
          month: ''
        },
        paramsDay: {
          day: ''
        },
        monthValue: [],
        dayValue: []
      }
    },
    //监听baseDate、selectedDate变化，给pickerVisible重新赋值
    watch: {
      baseDate(newVal, oldVal) {
        this.pickerVisible = new Date(newVal.split('-')[0], Number(newVal.split('-')[1]) - 1, this.pickerVisible.getDate());
      },
      selectedDate(newVal, oldVal) {
        this.pickerVisible = new Date(newVal.split('-')[0], Number(newVal.split('-')[1]) - 1, Number(newVal.split('-')[2]));
      }
    },
    methods: {
      //查询月日程
      getMonthSchedule(day, params) {
        let that = this;
        that.monthValue = [];
        that.showIndicator('加载中...');
        interfaceService.queryMonthSchedule(params)
          .then(function (response) {
            that.monthValue = response;
            if (!day) {
              that.paramsDay.day = new Date().getFullYear().toString() + (((new Date().getMonth() + 1) < 10) ? ('0' + (new Date().getMonth() + 1)) : (new Date().getMonth() + 1)).toString() + ((new Date().getDate() < 10) ? ('0' + new Date().getDate()) : new Date().getDate()).toString();
            } else {
              that.paramsDay.day = day;
            }
            that.getDaySchedule('month', that.paramsDay);
          }, function (error) {
            that.hideIndicator();
            that.showAlert("数据加载失败")
          });
      },
      //查询日日程
      getDaySchedule(type, params) {
        let that = this;
        that.dayValue = [];
        if (type === 'day') {
          that.showIndicator('加载中...');
        }
        interfaceService.queryDaySchedule(params)
          .then(function (response) {
            that.hideIndicator();
            that.dayValue = response;
          }, function (error) {
            that.hideIndicator();
            that.showAlert("数据加载失败")
          });
      },
      //判断日期是否在接口返回的数组中
      isInArray(arr, value) {
        for (let i = 0; i < arr.length; i++) {
          if (Number(value) === Number(arr[i].date.substr(-2))) {
            return true;
          }
        }
        return false;
      },
      //跳转至详情页面
      goDetails() {
        this.$router.push({path: '/scheduleDetails', query: {list: this.dayValue}});
      },
      //获取选中的日期
      getSelectedDate(index1, index2) {
        let clickDate = this.calendar[index1].list[index2];
        this.currentSelected = clickDate;
        if (!clickDate) {
          console.log('本月没有这一天！')
        } else {
          this.selectedDate = this.baseDate + '-' + ((clickDate < 10) ? ('0' + clickDate) : clickDate);
          this.todayDate = (new Date(this.selectedDate).getFullYear()) + "年" +
            (((new Date(this.selectedDate).getMonth() + 1) < 10) ? ('0' + (new Date(this.selectedDate).getMonth() + 1)) : (new Date(this.selectedDate).getMonth() + 1)) + "月" +
            (((new Date(this.selectedDate).getDate()) < 10) ? ('0' + (new Date(this.selectedDate).getDate())) : (new Date(this.selectedDate).getDate())) + "日" + " " +
            new Date().formatWeekDesc(this.selectedDate);

          this.paramsDay.day = this.selectedDate.replace(/-/g, '');
          this.getDaySchedule('day', this.paramsDay);
        }
      },
      goBack() {
        this.$router.push({path: '/tab/home'});
      },
      //打开日期选择器
      openPicker() {
        this.$refs.picker.open();
      },
      //前一月
      preMonth() {
        this.dayValue = [];
        if (new Date(this.baseDate).getMonth() === 0) {
          this.baseDate = (Number(this.baseDate.split('-')[0]) - 1) + '-12';
        } else {
          this.baseDate = this.baseDate.split('-')[0] + '-' + (((Number(this.baseDate.split('-')[1]) - 1) < 10) ? ('0' + (Number(this.baseDate.split('-')[1]) - 1)) : (Number(this.baseDate.split('-')[1]) - 1));
        }
        // this.pickerVisible = new Date(this.baseDate.split('-')[0], Number(this.baseDate.split('-')[1]) - 1, new Date().getDate());
        //清空
        this.calendar = [];
        this.week = {
          list: []
        };
        this.init(this.baseDate);

        //判断选择月份是不是当前月份
        if (new Date(this.baseDate).Format('yyyy-MM') !== new Date().Format('yyyy-MM')) {
          this.currentSelected = '';
        } else {
          this.currentSelected = new Date().getDate();
        }

        //切换回当前天
        this.selectedDate = new Date().getFullYear() + '-' + (((new Date().getMonth() + 1) < 10) ? ('0' + (new Date().getMonth() + 1)) : (new Date().getMonth() + 1)) + '-' + ((new Date().getDate() < 10) ? ('0' + new Date().getDate()) : new Date().getDate());
        this.todayDate = (new Date(this.selectedDate).getFullYear()) + "年" +
          (((new Date(this.selectedDate).getMonth() + 1) < 10) ? ('0' + (new Date(this.selectedDate).getMonth() + 1)) : (new Date(this.selectedDate).getMonth() + 1)) + "月" +
          (((new Date(this.selectedDate).getDate()) < 10) ? ('0' + (new Date(this.selectedDate).getDate())) : (new Date(this.selectedDate).getDate())) + "日" + " " +
          new Date().formatWeekDesc(this.selectedDate);

        this.paramsMonth.month = this.baseDate.replace(/-/g, '');
        this.getMonthSchedule('', this.paramsMonth);
      },
      //后一月
      nextMonth() {
        this.dayValue = [];
        this.currentSelected = '';
        if (new Date(this.baseDate).getMonth() === 11) {
          this.baseDate = (Number(this.baseDate.split('-')[0]) + 1) + '-01';
        } else {
          this.baseDate = this.baseDate.split('-')[0] + '-' + (((Number(this.baseDate.split('-')[1]) + 1) < 10) ? ('0' + (Number(this.baseDate.split('-')[1]) + 1)) : (Number(this.baseDate.split('-')[1]) + 1));
        }
        // this.pickerVisible = new Date(this.baseDate.split('-')[0], Number(this.baseDate.split('-')[1]) - 1, new Date().getDate());
        //清空
        this.calendar = [];
        this.week = {
          list: []
        };
        this.init(this.baseDate);

        //判断选择月份是不是当前月份
        if (new Date(this.baseDate).Format('yyyy-MM') !== new Date().Format('yyyy-MM')) {
          this.currentSelected = '';
        } else {
          this.currentSelected = new Date().getDate();
        }
        //切换回当前天
        this.selectedDate = new Date().getFullYear() + '-' + (((new Date().getMonth() + 1) < 10) ? ('0' + (new Date().getMonth() + 1)) : (new Date().getMonth() + 1)) + '-' + ((new Date().getDate() < 10) ? ('0' + new Date().getDate()) : new Date().getDate());
        this.todayDate = (new Date(this.selectedDate).getFullYear()) + "年" +
          (((new Date(this.selectedDate).getMonth() + 1) < 10) ? ('0' + (new Date(this.selectedDate).getMonth() + 1)) : (new Date(this.selectedDate).getMonth() + 1)) + "月" +
          (((new Date(this.selectedDate).getDate()) < 10) ? ('0' + (new Date(this.selectedDate).getDate())) : (new Date(this.selectedDate).getDate())) + "日" + " " +
          new Date().formatWeekDesc(this.selectedDate);

        this.paramsMonth.month = this.baseDate.replace(/-/g, '');
        this.getMonthSchedule('', this.paramsMonth);
      },
      //确定选择的时间
      selectDate(confirm) {
        this.dayValue = [];//清空
        //切换到选中天
        this.selectedDate = confirm.getFullYear() + '-' + (((confirm.getMonth() + 1) < 10) ? ('0' + (confirm.getMonth() + 1)) : (confirm.getMonth() + 1)) + '-' + ((confirm.getDate() < 10) ? ('0' + confirm.getDate()) : confirm.getDate());
        this.todayDate = (new Date(this.selectedDate).getFullYear()) + "年" +
          (((new Date(this.selectedDate).getMonth() + 1) < 10) ? ('0' + (new Date(this.selectedDate).getMonth() + 1)) : (new Date(this.selectedDate).getMonth() + 1)) + "月" +
          (((new Date(this.selectedDate).getDate()) < 10) ? ('0' + (new Date(this.selectedDate).getDate())) : (new Date(this.selectedDate).getDate())) + "日" + " " +
          new Date().formatWeekDesc(this.selectedDate);

        this.baseDate = confirm.getFullYear() + '-' + (((confirm.getMonth() + 1) < 10) ? ('0' + (confirm.getMonth() + 1)) : (confirm.getMonth() + 1)) /*+ '-' + confirm.getDate()*/;
        //清空
        this.calendar = [];
        this.week = {
          list: []
        };
        this.init(this.baseDate);
        //当前选择时间
        let confirmDate = this.baseDate.replace(/-/g, '') + ((confirm.getDate() < 10) ? ('0' + confirm.getDate()) : confirm.getDate());
        this.currentSelected = confirm.getDate();
        this.paramsMonth.month = this.baseDate.replace(/-/g, '');
        this.getMonthSchedule(confirmDate, this.paramsMonth);
      },
      //初始化当前月
      init(selectDate) {
        let firstDay = this.getCurrentMonthFirst(selectDate);
        let lastDay = this.getCurrentMonthLast(selectDate);

        //如果选中月的第一天刚好是周日，则值变为7
        let firstWeekDay = (firstDay.getDay()) === 0 ? 7 : (firstDay.getDay());
        let day = firstDay.getDate();
        for (let i = firstWeekDay; i <= 7; i++) {
          this.week.list[i - 1] = day;
          day++;
        }
        this.calendar.push(this.week);//初始化前一周的数据

        let leftDays = lastDay.getDate() - (8 - firstWeekDay);
        //初始化剩余周的数据
        for (let k = 1; k <= Math.ceil(leftDays / 7); k++) {
          //清空
          this.week = {
            list: []
          };
          let day1 = (8 - firstWeekDay) + 1 + 7 * (k - 1);
          for (let j = 0; j < 7; j++) {
            if (day1 + j <= lastDay.getDate()) {
              this.week.list[j] = day1 + j;
            }
          }
          this.calendar.push(this.week);
        }
      },

      //获取当前月的第一天
      getCurrentMonthFirst(selectDate) {
        let date = new Date(selectDate);
        date.setDate(1);
        return date;
      },
      //获取当前月的最后一天
      getCurrentMonthLast(selectDate) {
        let date = new Date(selectDate);
        let currentMonth = date.getMonth();
        let nextMonth = ++currentMonth;
        let nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
        let oneDay = 1000 * 60 * 60 * 24;
        return new Date(nextMonthFirstDay - oneDay);
      }
    },
    created() {
      //清空
      this.calendar = [];
      this.week = {
        list: []
      };
      this.dayValue = [];
      this.baseDate = new Date().Format('yyyy-MM');
      this.currentSelected = new Date().getDate();
      this.pickerVisible = new Date();

      this.init(this.baseDate);

      let a = (((new Date().getDate() + 1) < 10) ? ('0' + (new Date().getDate())) : (new Date().getDate()));
      let today = new Date().formatWeekDesc(this.baseDate + '-' + a);
      this.todayDate = (new Date().getFullYear()) + "年" +
        (((new Date().getMonth() + 1) < 10) ? ('0' + (new Date().getMonth() + 1)) : (new Date().getMonth() + 1)) + "月" +
        (((new Date().getDate()) < 10) ? ('0' + (new Date().getDate())) : (new Date().getDate())) + "日" + " " + today;

      this.paramsMonth.month = this.baseDate.replace(/-/g, '');
      this.getMonthSchedule('', this.paramsMonth);
    },
    activated() {
      if (this.$route.query.page !== 'scheduleDetails') {
        //清空
        this.calendar = [];
        this.week = {
          list: []
        };
        this.dayValue = [];
        this.baseDate = new Date().Format('yyyy-MM');
        this.currentSelected = new Date().getDate();
        this.pickerVisible = new Date();

        this.init(this.baseDate);

        let a = (((new Date().getDate() + 1) < 10) ? ('0' + (new Date().getDate())) : (new Date().getDate()));
        let today = new Date().formatWeekDesc(this.baseDate + '-' + a);
        this.todayDate = (new Date().getFullYear()) + "年" +
          (((new Date().getMonth() + 1) < 10) ? ('0' + (new Date().getMonth() + 1)) : (new Date().getMonth() + 1)) + "月" +
          (((new Date().getDate()) < 10) ? ('0' + (new Date().getDate())) : (new Date().getDate())) + "日" + " " + today;

        this.paramsMonth.month = this.baseDate.replace(/-/g, '');
        this.getMonthSchedule('', this.paramsMonth);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .schedule {
    background: #fff;
    .body-content {
      margin-top: 45px;
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
      border-radius: 10px;
      height: 25px;
      font-size: 14px;
      width: 80%;
      border-style: hidden!important;
    }
    .line-between {
      height: 15px;
      width: 100%;
      background: #E6E6E6;
      /*margin-bottom: 10px;*/
      margin-top: 10px;
    }

    .todayDate {
      height: 45px;
      line-height: 45px;
      width: 100%;
      background: #1e8fe1;
      margin-bottom: 10px;
      color: white;
      padding-left: 10px;

    }
    .schedule-counts {
      height: 45px;
      margin-left: 10%;
      margin-right: 10%;
      margin-bottom: 10%;
      background: #1e8fe1;
      text-align: center;
      line-height: 50px;
      color: white;
      border-radius: 10px;
    }
    .right-content-size {
      font-size: 20px;
    }
  }
</style>
