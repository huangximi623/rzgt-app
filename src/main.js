import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import './share/common'
import 'lib-flexible/flexible.js'
import 'mint-ui/lib/style.css'
import $ from 'jquery'
import './style/common.css'
import interfaceService from './service/interfaceService.js'

//按需引入mint-ui组件
import {
  Button,
  Cell,
  Loadmore,
  Swipe,
  SwipeItem,
  Header,
  Switch,
  Spinner,
  Navbar,
  TabItem,
  TabContainer,
  TabContainerItem,
  DatetimePicker,
  Picker,
  Popup,
  Progress,
  Search,
  Checklist,
  MessageBox,
  Tabbar,
  CellSwipe,
  Radio,
  Actionsheet,
  Badge,
  Field
} from 'mint-ui'

Vue.component(Button.name, Button);
Vue.component(Cell.name, Cell);
Vue.component(Loadmore.name, Loadmore);
Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);
Vue.component(Header.name, Header);
Vue.component(Switch.name, Switch);
Vue.component(Spinner.name, Spinner);
Vue.component(Navbar.name, Navbar);
Vue.component(TabItem.name, TabItem);
Vue.component(TabContainer.name, TabContainer);
Vue.component(TabContainerItem.name, TabContainerItem);
Vue.component(DatetimePicker.name, DatetimePicker);
Vue.component(Picker.name, Picker);
Vue.component(Popup.name, Popup);
Vue.component(Progress.name, Progress);
Vue.component(Search.name, Search);
Vue.component(Checklist.name, Checklist);
Vue.component(Tabbar.name, Tabbar);
Vue.component(CellSwipe.name, CellSwipe);
Vue.component(Radio.name, Radio);
Vue.component(Actionsheet.name, Actionsheet);
Vue.component(Badge.name, Badge);
Vue.component(Field.name, Field);
Vue.config.productionTip = false;

/* router全局守卫 */
router.beforeEach((to, from, next) => {
  const list = [
    'login', 'home', 'erp', 'contact', 'personal', 'search', 'contactDetails','examineReceive', 'group',
    'jhApproval','jhApprovalDetail',
    'wkApproval','wkApprovalDetail',
    'administrativeExamination', 'administrativeExaminationDetail',
    'salesApproval','salesApprovalDetail',
    'levelStandard','levelStandardDetail',
    'qualityTest','qualityTestDetail',
    'zjQuality','jhQuality',
    'acceptHistoryQuery','acceptHistory','acceptHistoryDetail',
    'diverseInfo','diverseInfoDetail',
    'documents', 'documentDetail',
    'documentRead', 'documentReadDetail',
    'meetingManager', 'meetingManagerDetails',
    'receptionManager', 'receptionManagerDetails',
    'taskManagement', 'taskManagementDetail',
    'informationPublish', 'informationPublishDetailList', 'informationPublishDetails',
    'documentCenter', 'documentCenterDetailList', 'documentCenterDetails',
    'schedule', 'scheduleDetails',
    'toNext', 'toReturn', 'toRead',
    'toReadList'
  ];    // 将需要切换效果的路由名称组成一个数组
  const toName = to.name;    // 即将进入的路由名字
  const fromName = from.name;   // 即将离开的路由名字
  const toIndex = list.indexOf(toName);    // 进入下标
  const fromIndex = list.indexOf(fromName);   // 离开下标
  let direction = '';

  if (toIndex > -1 && fromIndex > -1) {   // 如果下标都存在
    if (toIndex < fromIndex) {          // 如果进入的下标小于离开的下标，那么是左滑
      direction = 'left'
    } else {
      direction = 'right'         // 如果进入的下标大于离开的下标，那么是右滑
    }
  }
  store.state.viewDirection = direction;  // 这里使用vuex进行赋值
  return next()
});

/* eslint-disable no-new */
let vm = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
});

//平台部署好后隐藏启动画面
document.addEventListener("deviceready", function () {
  //保存设备uuid
  interfaceService.setCookie("uuid", device.uuid, 14);
  //点击物理返回键退出app
  let clickCounts = 0;
  document.addEventListener('backbutton', function () {
    let location = router.currentRoute.path;

    if (location === '/tab/home' || location === '/login') {
      clickCounts += 1;
      if (clickCounts === 1) {
        vm.showToast("再按一次退出程序");
      } else {
/*        interfaceService.LoginOut()
          .then(function (response) {
            navigator.app.exitApp();
          }, function (error) {
            vm.showAlert("退出登陆失败！");
          });*/
        navigator.app.exitApp();
      }
      setTimeout(function () {
        clickCounts = 0;
      }, 2000);
    } else {
      routerLocation(location);//客户端物理返回键返回定位
    }
  }, false);
  //隐藏启动页画面
  navigator.splashscreen.hide();

  //显示键盘的bar
  if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
  }
}, false);

//键盘显示时不允许滚动
window.addEventListener('native.keyboardshow', keyboardShowHandler);

function keyboardShowHandler(e) {
  if (vm.isiOSMachine() && router.currentRoute.path !== '/login') {
    cordova.plugins.Keyboard.disableScroll(true);//键盘弹起不允许滚动
  }
  window.scrollTo(0, e.keyboardHeight * (-1) + $(document).scrollTop());
  document.getElementById("showOrHide").style.display = "none";
  document.getElementById("showModel").style.display = "block";
}

//键盘隐藏式允许滚动
window.addEventListener('native.keyboardhide', keyboardHideHandler);

function keyboardHideHandler(e) {
  if (vm.isiOSMachine() && router.currentRoute.path !== '/login') {
    cordova.plugins.Keyboard.disableScroll(false);//键盘隐藏允许滚动
  }
  window.scrollTo(0, 0);
  document.getElementById("showOrHide").style.display = "block";
  setTimeout(function () {
    document.getElementById("showModel").style.display = "none";
  }, 500);
}

//右滑后退功能
let startX = '';//手指接触x坐标
let startY = '';//手指接触y坐标
let endX = '';//手指离开x坐标
let endY = '';//手指离开y坐标
//手指接触屏幕
document.addEventListener("touchstart", function (e) {
  startX = e.touches[0].pageX;
  startY = e.touches[0].pageY;
}, false);

//手指离开事件
window.addEventListener("touchend", function (e) {
  endX = e.changedTouches[0].pageX;
  endY = e.changedTouches[0].pageY;
  let location = router.currentRoute.path;
  if ((startX < 50) && (endX - startX) > 50 && Math.abs(endY - startY) < 50 && vm.isiOSMachine()) {
    routerLocation(location);//客户端右滑返回定位
  }
  if (cordova.plugins.Keyboard.isVisible) {
    cordova.plugins.Keyboard.close();
  }
});

//微信物理返回键监听
function pushHistory() {
  let state = {
    title: "title",
    url: "#"
  };
  window.history.pushState(state, "title", "#");
}

$(function () {
  pushHistory();
  let bool = false;
  setTimeout(function () {
    bool = true;
  }, 1500);
  window.addEventListener("popstate", function (e) {
    if (bool) {
      let location = router.currentRoute.path;
      if (location === '/tab/home' || location === '/login') {
        WeixinJSBridge.call('closeWindow');
      } else {
        routerLocation(location);//微信物理返回键返回定位
      }
    }
    pushHistory();
  }, false);
});


//返回定位
let routerLocation = function (location) {
  if (location === '/tab/contact' || location === '/tab/personal') {
    router.push({path: '/tab/home'})
  } else if (location === '/administrativeExamination' || location === '/documents' || location === '/documentRead' ||
    location === '/meetingManager' || location === '/taskManagement' || location === '/receptionManager' ||
    location === '/informationPublish' || location === '/schedule' || location === '/documentCenter'  ||
    location === '/erp' || location === '/examineReceive' || location === '/group') {
    router.push({path: '/tab/home'})
  } else if (location === '/administrativeExaminationDetail') {
    router.push({path: '/administrativeExamination', query: {page: 'administrativeExaminationDetail'}});
  } else if (location === '/jhApprovalDetail') {
    router.push({path: '/jhApproval', query: {page: 'jhApprovalDetail'}});
  } else if (location === '/wkApprovalDetail') {
    router.push({path: '/wkApproval', query: {page: 'wkApprovalDetail'}});
  } else if (location === '/jhApproval') {
    router.push({path: '/group', query: {page: 'jhApproval'}});
  } else if (location === '/wkApproval') {
    router.push({path: '/group', query: {page: 'wkApproval'}});
  } else if (location === '/salesApproval') {
    router.push({path: '/erp', query: {page: 'salesApproval'}});
  } else if (location === '/salesApprovalDetail') {
    router.push({path: '/salesApproval', query: {page: 'salesApprovalDetail'}});
  } else if (location === '/levelStandard'){
    router.push({path: '/examineReceive', query: {page: 'levelStandard'}});
  } else if (location === '/levelStandardDetail') {
    router.push({path: '/levelStandard', query: {page: 'levelStandardDetail'}});
  } else if (location === '/qualityTest') {
    router.push({path: '/examineReceive', query: {page: 'qualityTest'}});
  } else if (location === '/qualityTestDetail') {
    router.push({path: '/qualityTest', query: {page: 'qualityTestDetail'}});
  } else if (location === '/zjQuality') {
    router.push({path: '/examineReceive', query: {page: 'zjQuality'}});
  } else if (location === '/jhQuality') {
    router.push({path: '/examineReceive', query: {page: 'jhQuality'}});
  } else if (location === '/acceptHistoryQuery') {
    router.push({path: '/examineReceive', query: {page: 'acceptHistoryQuery'}});
  } else if (location === '/acceptHistory') {
    router.push({path: '/acceptHistoryQuery', query: {page: 'acceptHistory'}});
  } else if (location === '/acceptHistoryDetail') {
    router.push({path: '/acceptHistory', query: {page: 'acceptHistoryDetail'}});
  } else if (location === '/diverseInfo') {
    router.push({path: '/acceptHistoryQuery', query: {page: 'diverseInfo'}});
  } else if (location === '/diverseInfoDetail') {
    router.push({path: '/diverseInfo', query: {page: 'diverseInfoDetail'}});
  } else if (location === '/documentDetail') {
    router.push({path: '/documents', query: {page: 'documentDetail'}});
  } else if (location === '/documentReadDetail') {
    router.push({path: '/documentRead', query: {page: 'documentReadDetail'}});
  } else if (location === '/meetingManagerDetails') {
    router.push({path: '/meetingManager', query: {page: 'meetingManagerDetails'}});
  } else if (location === '/taskManagementDetails') {
    router.push({path: '/taskManagement', query: {page: 'taskManagementDetail'}});
  } else if (location === '/receptionManagerDetails') {
    router.push({path: '/receptionManager', query: {page: 'receptionManagerDetails'}});
  } else if (location === '/informationPublishDetailList') {
    if (router.currentRoute.query.page === "siteInfoDetailList") {
      router.push({path: '/siteInfoDetailList', query: {page: 'informationPublishDetailList'}})
    } else {
      router.push({path: '/informationPublish', query: {page: 'informationPublishDetailList'}})
    }
  } else if (location === '/scheduleDetails') {
    router.push({path: '/schedule', query: {page: 'scheduleDetails'}});
  } else if (location === '/documentCenterDetailList') {
    router.push({path: '/documentCenter', query: {page: 'documentCenterDetailList'}})
  } else if (location === '/contactDetails') {
    if (router.currentRoute.query.page === 'search') {
      router.push({path: '/search'});
    } else if (router.currentRoute.query.page === 'personal') {
      router.push({path: '/tab/personal'});
    } else {
      router.push({
        path: '/tab/contact',
        query: {
          contactData: router.currentRoute.query.contactData,
          title: router.currentRoute.query.title,
          page: 'contactDetails'
        }
      })
    }
  } else if (location === '/doNext' || location === '/doReject' || location === '/doCirculation') {
    if (router.currentRoute.query.buttonTitle === '行政审批') {
      router.push({path: '/administrativeExaminationDetail', query: {page: 'toReadList'}})
    } else if (router.currentRoute.query.buttonTitle === '公文审批') {
      router.push({path: '/documentDetail', query: {page: 'toReadList'}})
    } else if (router.currentRoute.query.buttonTitle === '会议管理') {
      router.push({path: '/meetingManagerDetails', query: {page: 'toReadList'}})
    } else if (router.currentRoute.query.buttonTitle === '接待管理') {
      router.push({path: '/receptionManagerDetails', query: {page: 'toReadList'}})
    } else if (router.currentRoute.query.buttonTitle === '销售审批') {
      router.push({path: '/salesApprovalDetail', query: {page: 'toReadList'}})
    } else if (router.currentRoute.query.buttonTitle === '京华审批') {
      router.push({path: '/jhApprovalDetail', query: {page: 'toReadList'}})
    } else if (router.currentRoute.query.buttonTitle === '营钢审批') {
      router.push({path: '/wkApprovalDetail', query: {page: 'toReadList'}})
    } else if (router.currentRoute.query.buttonTitle === '招采签核') {
      router.push({path: '/publicBiddingDetail', query: {page: 'toReadList'}})
    }
  } else if (location === '/toNextList' || location === '/toReadList') {
    if (router.currentRoute.query.buttonTitle === '行政审批') {
      router.push({path: '/administrativeExaminationDetail', query: {page: 'toReadList'}})
    } else if (router.currentRoute.query.buttonTitle === '公文审批') {
      router.push({path: '/documentDetail', query: {page: 'toReadList'}})
    } else if (router.currentRoute.query.buttonTitle === '会议管理') {
      router.push({path: '/meetingManagerDetails', query: {page: 'toReadList'}})
    } else if (router.currentRoute.query.buttonTitle === '接待管理') {
      router.push({path: '/receptionManagerDetails', query: {page: 'toReadList'}})
    } else if (router.currentRoute.query.buttonTitle === '销售审批') {
      router.push({path: '/salesApprovalDetail', query: {page: 'toReadList'}})
    } else if (router.currentRoute.query.buttonTitle === '京华审批') {
      router.push({path: '/jhApprovalDetail', query: {page: 'toReadList'}})
    } else if (router.currentRoute.query.buttonTitle === '营钢审批') {
      router.push({path: '/wkApprovalDetail', query: {page: 'toReadList'}})
    } else if (router.currentRoute.query.buttonTitle === '招采签核') {
      router.push({path: '/publicBiddingDetail', query: {page: 'toReadList'}})
    }
  } else if (location === '/informationPublishDetails') {
    if (router.currentRoute.query.page === 'home') {
      router.push({path: '/tab/home'})
    } else {
      router.push({
        path: '/informationPublishDetailList',
        query: {page: router.currentRoute.query.page, page1: 'informationPublishDetails'}
      })
      // router.push({path: '/informationPublishDetailList', query: {page: 'informationPublishDetails'}})
    }
  } else if (location === '/documentCenterDetails') {
    router.push({path: '/documentCenterDetailList', query: {page: 'documentCenterDetails'}})
  } else if (location === '/search') {
    router.push({path: '/tab/contact'});
  } else if (location === '/siteInfo') {
    router.push({path: '/informationPublish'});
  } else if (location === '/siteInfoDetailList') {
    router.push({path: '/siteInfo', query: {page: 'siteInfoDetailList'}});
  } else if (location === '/versionUpdateInfo') {
    router.push({path: '/tab/personal'});
  }
}
