/**
 * Created by long on 17-2-13.
 */
import Vue from 'vue';
import axios from 'axios';

Vue.prototype.$http = axios;
import {Toast, Indicator, MessageBox} from 'mint-ui'

//判断是否是pc端访问
Vue.prototype.is_pc = function () {
  //平台、设备和操作系统
  let system = {
    win: false,
    mac: false,
    xll: false
  };
  //检测平台
  let p = navigator.platform;
  system.win = (p.indexOf("Win") === 0);
  system.mac = (p.indexOf("Mac") === 0);
  system.x11 = ((p === "X11") || (p.indexOf("Linux") === 0));
  //跳转语句
  if (system.win || system.mac || system.xll) {
    return true;
  }
  return false
};

//显示加载框
Vue.prototype.showIndicator = function (text) {
  document.getElementById("allModal").style.display = "block";//显示蒙层，禁止用户在加载时操作
  Indicator.open({
    text: text,
    spinnerType: 'fading-circle'
  });
};
//隐藏加载框
Vue.prototype.hideIndicator = function () {
  document.getElementById("allModal").style.display = "none";//隐藏蒙层，允许用户操作
  Indicator.close();
};

//弹框提示
Vue.prototype.showAlert = function (alert) {
  MessageBox({
    title: '提示',
    message: alert,
    showCancelButton: false,
    closeOnClickModal: false  //点击遮罩时不可关闭提示
  });
};

//弹框提示后跳转链接
Vue.prototype.showAlertAndUrl = function (alert, url) {
  MessageBox({
    title: '提示',
    message: alert,
    showCancelButton: false,
    closeOnClickModal: false  //点击遮罩时不可关闭提示
  }).then(action => {
    this.$router.push(url);
  });
};

//Toast提示
Vue.prototype.showToast = function (toast) {
  Toast({
    message: toast,
    position: 'bottom',
    duration: '2000'
  });
};
//附件打开
Vue.prototype.attachmentOpen = function (fileLocation) {
  let that = this;
  cordova.plugins.fileOpener2.open(
    fileLocation,
    'application/msword',
    {
      error : function(e) {
        console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
      },
      success : function () {
        console.log('file opened successfully');
      }
    }
  );
  // cordova.plugins.disusered.open(
  //   fileLocation,
  //   function () {
  //     console.log('open successfully');
  //   },
  //   function (e) {
  //     console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
  //     window.plugins.socialsharing.share(null, null, fileLocation);//打开失败，调用分享
  //   },
  //   true
  // );
};

//附件下载
Vue.prototype.InappDownload = function (fileurl, fileType, filename) {
  let that = this;
  that.showIndicator("下载中,请稍后...");
  let fileTransfer = new FileTransfer();
  let url = encodeURI(fileurl);
  let targetPath;

  targetPath = cordova.file.dataDirectory;//本地存储路径
  let fileURL = targetPath + filename;
  let trustHosts = true;
  let options = {};
  fileTransfer.download(
    url,
    fileURL,
    function (entry) {
      that.hideIndicator();
      console.log("文件下载完成: " + entry.toURL());
      let openLocation = entry.toURL();

      //下载完成，打开附件
      that.attachmentOpen(decodeURI(openLocation));//打开附件
    },
    function (error) {
      that.hideIndicator();
      console.log("文件下载失败！");
      console.log("download error source " + error.source);
      console.log("download error target " + error.target);
      console.log("download error code" + error.code);
    },
    trustHosts,
    options
  );
};

//附件预览
Vue.prototype.InappPreview = function (url) {
  // window.screen.orientation.unlock();//解除竖屏限制

  cordova.ThemeableBrowser.open(encodeURI(url), '_blank', {
    statusbar: {
      color: '#1e8fe1'
    },
    toolbar: {
      height: 44,
      color: '#1e8fe1'
    },
    title: {
      color: '#ffffff',
      showPageTitle: false
    },
    closeButton: {
      image: 'close',
      imagePressed: 'close_pressed',
      align: 'left',
      event: 'closePressed'
    },
    backButtonCanClose: false,
    enableViewportScale: true,
    closebuttoncaption: true,
    clearcache: false,
    clearsessioncache: false,
    hardwareback: false,
  }).addEventListener('closePressed', function (e) {
  }).addEventListener('exit', function (e) {
    // alert(456);
    //在ios上如果再强制竖屏，会出错    // window.screen.orientation.lock('portrait-primary')//竖屏限制

    // if (this.isAndroidMachine()) {
    //   window.screen.orientation.lock('portrait-primary')//竖屏限制
    // }
  }).addEventListener(cordova.ThemeableBrowser.EVT_ERR, function (e) {
    console.error(e.message);
  }).addEventListener(cordova.ThemeableBrowser.EVT_WRN, function (e) {
    console.log(e.message);
  });
};

//判断ios系统版本号
Vue.prototype.iosVersion = function () {
  let ver = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
  let version = parseInt(ver[1], 10);
  if (version < 11) {
    return true;
  } else {
    return false;
  }
};

//判断是否是微信
Vue.prototype.is_weixin = function () {
  let ua = navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == "micromessenger") {
    return true;
  } else {
    return false;
  }
};

//判断是不是android设备
Vue.prototype.isAndroidMachine = function () {
  let u = navigator.userAgent;
  let Android = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
  return Android;
};

//判断是不是ios设备
Vue.prototype.isiOSMachine = function () {
  let u = navigator.userAgent;
  let ios = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  return ios;
};

//将时间戳转化为xxxx-xx-xx的时间格式
Vue.filter('getDate', function (time) {
  let date = new Date(time);
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  m = m < 10 ? '0' + m : m + '';
  let d = date.getDate();
  d = d < 10 ? '0' + d : d + '';
  return y + '-' + m + '-' + d;
})

Vue.prototype.formatDate = function (time, flag) {
  let date = new Date(time);
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  let d = date.getDate();
  let H = date.getHours()
  let f = date.getMinutes()
  m = m < 10 ? '0' + m : m + '';
  d = d < 10 ? '0' + d : d + '';
  f = f < 10 ? '0' + f : f + ''
  if (flag) {
    return y + '-' + m + '-' + d
  } else return y + '-' + m + '-' + d + ' ' + H + ':' + f;
}


function addSplit(str) {
  let tempArr = str.split('');
  if (tempArr.indexOf('e') != -1)
    return str;
  let hasMus = tempArr.indexOf('-') != -1 ? 2 : 1;
  let flag = 1;
  for (let i = tempArr.length - 1; i >= 0; i--) {
    if (flag % 3 == 0 && i > hasMus && flag != 3) {
      tempArr.splice(i, 0, ',');
    }
    flag++;
  }
  return tempArr.join('');
}

//简单金额过滤器 by 袁梦
Vue.filter('currency', (value, type) => (type ? type : 'CNY') + ' ' + addSplit((Number(value) > 100000000000 ? Number(value).toExponential(2) : Number(value).toFixed(2))));

Vue.filter('percent', (value) => !isNaN(value) ? (value * 100 + "%") : value);

Vue.prototype.currencyFilter = (value, type = '$') => type + ' ' + addSplit((Number(value) > 100000000000 ? Number(value).toExponential(2) : Number(value).toFixed(2)));

// yyyy-MM-dd hh:mm:ss.S
Date.prototype.Format = function (fmt) {
  let o = {
    'M+': this.getMonth() + 1, //月份
    'd+': this.getDate(), //日
    'h+': this.getHours(), //小时
    'm+': this.getMinutes(), //分
    's+': this.getSeconds(), //秒
    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds(), //毫秒
  };

  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));

  for (let k in o)
    if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
  return fmt;
};

Vue.prototype.setTitle = function (title) {
  let body = document.getElementsByTagName('body')[0];
  document.title = title;
  let iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.setAttribute('src', 'https://img6.bdstatic.com/img/image/smallpic/b.jpg');
  let d = function () {
    setTimeout(function () {
      iframe.removeEventListener('load', d);
      body.removeChild(iframe);
    }, 0);
  };

  iframe.onload = d;
  body.appendChild(iframe);
};


Vue.prototype.formatMoney = function (amount, places, symbol, thousand, decimal) {

  let baseCurrencycode = store.getters.getCompanyConfigurations.currencyCode

  places = !isNaN(places = Math.abs(places)) ? places : 2;
  symbol = symbol !== undefined ? symbol : baseCurrencycode;
  thousand = thousand || ",";
  decimal = decimal || ".";

  try {
    var amountInt = parseInt(amount)
  } catch (e) {
    return symbol + '0.01'
  }

  var number = amount,
    negative = number < 0 ? "-" : "",
    i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
    j = (j = i.length) > 3 ? j % 3 : 0;


  return symbol + " " + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
};


//获取格式化的本地日期对象字符串
Vue.prototype.formatLocalData = function (utc, format) {
  let formatDesc = 'yyyy-MM-dd'
  if (format) {
    formatDesc = format;
  }
  try {
    let data = new Date(utc);
    return data.Format(formatDesc);
  } catch (e) {
    return utc;
  }
};

//获取格式化的本地星期描述
Date.prototype.formatWeekDesc = function (utc) {
  let flag = '';
  switch (new Date(utc).getDay()) {
    case 0:
      flag = '日';
      break;
    case 1:
      flag = '一';
      break;
    case 2:
      flag = '二';
      break;
    case 3:
      flag = '三';
      break;
    case 4:
      flag = '四';
      break;
    case 5:
      flag = '五';
      break;
    case 6:
      flag = '六';
      break;
  }
  return '周' + flag;
};

//yyyy-MM-dd hh:mm:ss|yyyy-MM-dd hh:mm字符串形式转换为utc格式 yyyy-MM-ddThh:mm:ssZ
Vue.prototype.getUTCByTimeStr = function (dateStr) {
  let timeArr = dateStr.split(" ");
  let d = timeArr[0].split("-");
  let t = timeArr[1].split(":");
  let dateObj = new Date();
  dateObj.setFullYear(d[0]);
  dateObj.setMonth(d[1] - 1);
  dateObj.setDate(d[2]);
  dateObj.setHours(t[0]);
  dateObj.setMinutes(t[1]);
  //即yyyy-MM-dd hh:mm:ss格式
  if (t.length > 2) {
    dateObj.setSeconds(t[2]);
  }
  return dateObj.getUTCFullYear() + '-' + addZero(dateObj.getUTCMonth() + 1) + '-' + addZero(dateObj.getUTCDate()) + 'T'
    + addZero(dateObj.getUTCHours()) + ':' + addZero(dateObj.getUTCMinutes()) + ':' + addZero(dateObj.getUTCSeconds()) + 'Z';
};

//为月份、分钟等添加0
function addZero(param) {
  return param < 10 ? '0' + param : param;
}

//计算某个日期(yyyy-MM-dd)X天后日期
Vue.prototype.getDateAfterDays = function (dateStr, days = 0) {
  let dateArray = dateStr.split('-');
  let date = new Date(dateArray[0], parseInt(dateArray[1]) - 1, dateArray[2]);
  let time = date.getTime() + days * 24 * 3600 * 1000;
  date.setTime(time);
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
};

//获取两个日期之间间隔的天数(yyyy-MM-dd格式)
Vue.prototype.getDaysDiff = function (startDateStr, endDateStr) {
  let startDates = startDateStr.split('-');
  let startDateObj = new Date(startDates[0], startDates[1] - 1, startDates[2]);
  let endDates = endDateStr.split('-');
  let endDateObj = new Date(endDates[0], endDates[1] - 1, endDates[2]);
  return parseInt(Math.abs(startDateObj - endDateObj) / 1000 / 60 / 60 / 24);
};

Vue.prototype.getToken = function (vm, value) {
  function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    // var r = window.location.search.substr(1).match(reg);  //这里返回找到正则的匹配
    // console.log(r,reg)
    var href = window.location.href
    // console.log(href.toString().indexOf("?"))
    var r = href.substr(href.toString().indexOf("?") + 1).match(reg);
    if (r != null) {
      return unescape(r[2]);    //这里返回对应的值
    }

    return 'null';
  }

  console.log(window.location)
  let code = getQueryString('code');
  let loginName = getQueryString('loginName');
  let pwd = getQueryString('pwd');
  let companyOID = getQueryString('companyOID');
  if (companyOID) {
    window.localStorage.companyOID = companyOID
  }


  //alert('code ' + code + ' loginName ' + loginName + ' pwd ' + pwd + ' companyOID ' + companyOID);

  let url = vm.baseUrl + '/oauth/token', params, header;
  let authorization = 'Basic QXJ0ZW1pc0FwcDpuTENud2RJaGl6V2J5a0h5dVpNNlRwUURkN0t3SzlJWERLOExHc2E3U09X'

  if (loginName && loginName != 'null') {
    params = 'username=' + encodeURIComponent(loginName) +
      '&password=' + encodeURIComponent(pwd) +
      '&grant_type=' + encodeURIComponent('password') +
      '&scope=' + encodeURIComponent('write') +
      '&companyOID' + encodeURIComponent(companyOID) + '&wxLogin=Y';
    header = {
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    };
  } else if (code && code != 'null') {
    params = 'scope=write&grant_type=password&username=' + code +
      '&password=' + encodeURIComponent(companyOID) + '&wxLogin=Y';
    header = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache',
        Authorization: authorization,
      }
    };

  } else {
    params = 'scope=write&grant_type=password&username=' + '13323454321' +
      '&password=' + encodeURIComponent('hly123') + '&wxLogin=Y';
    header = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache',
        Authorization: authorization,
      }
    };
  }

  function updateToken(index, vm) {
    vm.$http.defaults.headers.common['Authorization'] = 'Bearer' + vm.$store.state.token;
    vm.$http.get(vm.baseUrl + '/api/function/profiles').then(res => {
      if (res.status == 200) {
        window.localStorage.profile = res.data
        vm.$store.commit('setProfile', res.data)
      }
    }).catch(error => {
    })
  }

  function fetchAccount(vm) {
    let url = vm.baseUrl + '/api/account';
    vm.$http.get(url).then(response => {
      if (response.status == 200) {
//          console.log(response);
        let currentDepartmenId = response.data.departmentOID;
        window.localStorage.currentDepartmenId = currentDepartmenId;
        window.localStorage.login = response.data.login;
        window.localStorage.myInfo = JSON.stringify(response.data)
        vm.$store.commit('setMyInfo', response.data);

//          console.log('vm.$store.state.myInfo ' + JSON.stringify(vm.$store.state.myInfo))
        window.localStorage.companyOID = response.data.companyOID;
        Vue.prototype.companyOID = response.data.companyOID;
        // fetchCarousels(vm, response.data.companyOID);
        if (value == 'scan') {
          vm.configWx()
          vm.setAuthority()
        }

      }
    })
      .catch(error => {
        console.log(error);
      })
  }

  vm.$http.post(url, params, header).then((response) => {
    console.log(response);
    vm.$store.commit('storeToken', response.data.access_token);
    window.localStorage.token = response.data.access_token;
    window.localStorage.wxToken = response.data.access_token;
    updateToken(vm.$store.state.token, vm);
    fetchAccount(vm, value);

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
      cordova.plugins.Keyboard.disableScroll(true);
    }

  });
}

Vue.prototype.httpToHttps = function (str) {
  return (str.indexOf('http') != -1 && str.indexOf('https') == -1) ? str.replace('http', 'https') : str;
}

