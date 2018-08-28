import Vue from 'vue'
import Router from 'vue-router'
import $ from 'jquery'
import config from '../config/config.json'
import interfaceData from '../service/interfaceData.js'
import interfaceService from '../service/interfaceService.js'

/* 登陆 */
const login = r => require.ensure([], () => r(require('../page/login/login')), 'login');
/* 主页面 START */
const tab = r => require.ensure([], () => r(require('../page/tab/tab')), 'tab');
const home = r => require.ensure([], () => r(require('../page/tab/home')), 'home');
const erp = r => require.ensure([], () => r(require('../page/tab/erp')), 'erp');
const contact = r => require.ensure([], () => r(require('../page/tab/contact')), 'contact');
const personal = r => require.ensure([], () => r(require('../page/tab/personal')), 'personal');
/* 主页面 END */

/* 行政审批 */
const administrativeExamination = r => require.ensure([], () => r(require('../page/administrativeExamination/administrativeExamination')), 'administrativeExamination');
const administrativeExaminationDetail = r => require.ensure([], () => r(require('../page/administrativeExamination/administrativeExaminationDetail')), 'administrativeExaminationDetail');
/* 公文管理 */
const documents = r => require.ensure([], () => r(require('../page/document/documents')), 'documents');
const documentDetail = r => require.ensure([], () => r(require('../page/document/documentDetail')), 'documentDetail');
/* 公文阅知 */
const documentRead = r => require.ensure([], () => r(require('../page/documentRead/documentRead')), 'documentRead');
const documentReadDetail = r => require.ensure([], () => r(require('../page/documentRead/documentReadDetail')), 'documentReadDetail');
/* 会议管理 */
const meetingManager = r => require.ensure([], () => r(require('../page/meetingManager/meetingManager')), 'meetingManager');
const meetingManagerDetails = r => require.ensure([], () => r(require('../page/meetingManager/meetingManagerDetails')), 'meetingManagerDetails');
/* 任务管理 */
const taskManagement = r => require.ensure([], () => r(require('../page/taskManagement/taskManagement')), 'taskManagement');
const taskManagementDetails = r => require.ensure([], () => r(require('../page/taskManagement/taskManagementDetails')), 'taskManagementDetails');
/* 接待管理 */
const receptionManager = r => require.ensure([], () => r(require('../page/receptionManager/receptionManager')), 'receptionManager');
const receptionManagerDetails = r => require.ensure([], () => r(require('../page/receptionManager/receptionManagerDetails')), 'receptionManagerDetails');
/* 信息发布中心 */
const informationPublish = r => require.ensure([], () => r(require('../page/informationPublish/informationPublish')), 'informationPublish');
const informationPublishDetailList = r => require.ensure([], () => r(require('../page/informationPublish/informationPublishDetailList')), 'informationPublishDetailList');
const informationPublishDetails = r => require.ensure([], () => r(require('../page/informationPublish/informationPublishDetails')), 'informationPublishDetails');
const siteInfo = r => require.ensure([], () => r(require('../page/informationPublish/siteInfo')), 'siteInfo');
const siteInfoDetailList = r => require.ensure([], () => r(require('../page/informationPublish/siteInfoDetailList')), 'siteInfoDetailList');
/* 文档中心 */
const documentCenter = r => require.ensure([], () => r(require('../page/documentCenter/documentCenter')), 'documentCenter');
const documentCenterDetailList = r => require.ensure([], () => r(require('../page/documentCenter/documentCenterDetailList')), 'documentCenterDetailList');
const documentCenterDetails = r => require.ensure([], () => r(require('../page/documentCenter/documentCenterDetails')), 'documentCenterDetails');
/*日程管理*/
const schedule = r => require.ensure([], () => r(require('../page/schedule/schedule')), 'schedule');
const scheduleDetails = r => require.ensure([], () => r(require('../page/schedule/scheduleDetails')), 'scheduleDetails');
/* 通讯录详情 */
const contactDetails = r => require.ensure([], () => r(require('../page/contactDetails/contactDetails')), 'contactDetails');
/* 通讯录搜索 */
const search = r => require.ensure([], () => r(require('../page/search/search')), 'search');
/* 流转 */
const toNext = r => require.ensure([], () => r(require('../page/caozuo/toNext')), 'toNext');
/* 退回 */
const toReturn = r => require.ensure([], () => r(require('../page/caozuo/toReturn')), 'toReturn');
/* 传阅 */
const toRead = r => require.ensure([], () => r(require('../page/caozuo/toRead')), 'toRead');
/* 组织树列表 */
const toReadList = r => require.ensure([], () => r(require('../page/caozuo/toReadList')), 'toReadList');
/* listUser列表 */
const toNextList = r => require.ensure([], () => r(require('../page/caozuo/toNextList')), 'toNextList');
/*版本更新信息*/
const versionUpdateInfo = r => require.ensure([], () => r(require('../page/versionUpdateInfo/versionUpdateInfo')), 'versionUpdateInfo');
/* ERP审批 - 销售审批*/
const salesApproval = r => require.ensure([], () => r(require('../page/erpApproval/salesApproval')), 'salesApproval');
const salesApprovalDetail = r => require.ensure([], () => r(require('../page/erpApproval/salesApprovalDetail')), 'salesApprovalDetail');

Vue.use(Router);

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '',
      redirect: to => {
        //判断是否自动登陆
        // if (interfaceService.getCookie("UserId") && interfaceService.getCookie("SeriesId") && interfaceService.getCookie("Token") && (interfaceService.getCookie("RememberMe") === 'Y')) {
        if (window.localStorage.getItem("UserId") && window.localStorage.getItem("SeriesId") && window.localStorage.getItem("Token") && (window.localStorage.getItem("RememberMe") === 'Y')) {
          let redirectPath = '';//重定向路径
          let loginDesc = '';//登陆提醒
          $.ajax({
            async: false,//同步请求
            type: "post",
            url: config.baseURL + interfaceData.loginApi,
            dataType: 'json',
            data: {
              /*UserId: interfaceService.getCookie("UserId"),
              RememberMe: interfaceService.getCookie("RememberMe"),
              LgnType: "RememberMe",
              DeviceId: interfaceService.getCookie("uuid") ? interfaceService.getCookie("uuid") : "123321",
              SeriesId: interfaceService.getCookie("SeriesId"),
              Token: interfaceService.getCookie("Token"),
              Version: config.currentVersion*/
              UserId: window.localStorage.getItem("UserId"),
              RememberMe: window.localStorage.getItem("RememberMe"),
              LgnType: "RememberMe",
              DeviceId: interfaceService.getCookie("uuid") ? interfaceService.getCookie("uuid") : "123321",
              SeriesId: window.localStorage.getItem("SeriesId"),
              Token: window.localStorage.getItem("Token"),
              Version: config.currentVersion
            },
            xhrFields: {
              withCredentials: true
            },
            crossDomain: true,
            success: function (data, status) {
              if (data.code === '0') {
                interfaceService.setCookie("UserId", data.result.UserId.value, (data.result.UserId.maxage) / (60 * 60 * 24));
                interfaceService.setCookie("RememberMe", data.result.rememberme, 14);
                interfaceService.setCookie("SeriesId", data.result.SeriesId.value, (data.result.SeriesId.maxage) / (60 * 60 * 24));
                interfaceService.setCookie("Token", data.result.Token.value, (data.result.Token.maxage) / (60 * 60 * 24));

                window.localStorage.setItem("UserId", data.result.UserId.value);
                window.localStorage.setItem("RememberMe", data.result.rememberme);
                window.localStorage.setItem("SeriesId", data.result.SeriesId.value);
                window.localStorage.setItem("Token", data.result.Token.value);
                new Vue().showToast(data.desc);
                interfaceService.queryPersonList({queryValue: interfaceService.getCookie("UserId")})
                  .then(function (response) {
                    new Vue().hideIndicator();
                    interfaceService.setPersonInfo(response);//保存用户信息
                  }, function (error) {
                    new Vue().hideIndicator();
                    new Vue().showAlert("获取用户信息失败！")
                  });
                redirectPath = '/tab/home';
              } else if (data.code === '1') {
                // new Vue().showToast(data.desc);
                interfaceService.queryPersonList({queryValue: interfaceService.getCookie("UserId")})
                  .then(function (response) {
                    new Vue().hideIndicator();
                    interfaceService.setPersonInfo(response);//保存用户信息
                  }, function (error) {
                    new Vue().hideIndicator();
                    new Vue().showAlert("获取用户信息失败！")
                  });
                redirectPath = '/tab/home';
              } else {
                // new Vue().showToast(data.desc);
                loginDesc = data.desc;
                redirectPath = '/login';
                interfaceService.clearCookie('RememberMe');//清空RememberMe
                interfaceService.clearCookie('SeriesId');//清空SeriesId
                interfaceService.clearCookie('Token');//清空Token

                window.localStorage.removeItem("RememberMe");
                window.localStorage.removeItem("SeriesId");
                window.localStorage.removeItem("Token");
              }
            },
            error: function (request, status, errorThrown) {
              redirectPath = '/login';
              interfaceService.clearCookie('RememberMe');//清空RememberMe
              interfaceService.clearCookie('SeriesId');//清空SeriesId
              interfaceService.clearCookie('Token');//清空Token

              window.localStorage.removeItem("RememberMe");
              window.localStorage.removeItem("SeriesId");
              window.localStorage.removeItem("Token");
            }
          });
          return {path: redirectPath, query: {loginDesc: loginDesc}}
        } else {
          return {path: '/login'}
        }
      }
    },
    {
      path: '/login',
      name: 'login',
      component: login,
      meta: {keepAlive: true}
    },
    {
      path: '/contactDetails',
      name: 'contactDetails',
      component: contactDetails/*,
      meta: {keepAlive: true}*/
    },
    {
      path: '/schedule',
      name: 'schedule',
      component: schedule,
      meta: {keepAlive: true}
    },
    {
      path: '/scheduleDetails',
      name: 'scheduleDetails',
      component: scheduleDetails,
      meta: {keepAlive: true}
    },
    {
      path: '/administrativeExamination',
      name: 'administrativeExamination',
      component: administrativeExamination,
      meta: {keepAlive: true}
    },
    {
      path: '/administrativeExaminationDetail',
      name: 'administrativeExaminationDetail',
      component: administrativeExaminationDetail,
      meta: {keepAlive: true}
    },
    {
      path: '/salesApproval',
      name: 'salesApproval',
      component: salesApproval,
      meta: {keepAlive: true}
    },
    {
      path: '/salesApprovalDetail',
      name: 'salesApprovalDetail',
      component: salesApprovalDetail,
      meta: {keepAlive: true}
    },
    {
      path: '/doNext',
      name: 'toNext',
      component: toNext,
      meta: {keepAlive: true}
    },
    {
      path: '/doReject',
      name: 'toReturn',
      component: toReturn,
      meta: {keepAlive: true}
    },
    {
      path: '/doCirculation',
      name: 'toRead',
      component: toRead,
      meta: {keepAlive: true}
    },
    {
      path: '/meetingManager',
      name: 'meetingManager',
      component: meetingManager,
      meta: {keepAlive: true}
    },
    {
      path: '/meetingManagerDetails',
      name: 'meetingManagerDetails',
      component: meetingManagerDetails,
      meta: {keepAlive: true}
    },
    {
      path: '/receptionManager',
      name: 'receptionManager',
      component: receptionManager,
      meta: {keepAlive: true}
    },
    {
      path: '/receptionManagerDetails',
      name: 'receptionManagerDetails',
      component: receptionManagerDetails,
      meta: {keepAlive: true}
    },

    {
      path: '/documents',
      name: 'documents',
      component: documents,
      meta: {keepAlive: true}
    },
    {
      path: '/documentDetail',
      name: 'documentDetail',
      component: documentDetail,
      meta: {keepAlive: true}
    },
    {
      path: '/taskManagement',
      name: 'taskManagement',
      component: taskManagement,
      meta: {keepAlive: true}
    },
    {
      path: '/taskManagementDetails',
      name: 'taskManagementDetails',
      component: taskManagementDetails,
      meta: {keepAlive: true}
    },
    {
      path: '/informationPublish',
      name: 'informationPublish',
      component: informationPublish,
      meta: {keepAlive: true}
    },
    {
      path: '/informationPublishDetailList',
      name: 'informationPublishDetailList',
      component: informationPublishDetailList,
      meta: {keepAlive: true}
    },
    {
      path: '/informationPublishDetails',
      name: 'informationPublishDetails',
      component: informationPublishDetails,
      meta: {keepAlive: true}
    },
    {
      path: '/siteInfo',
      name: 'siteInfo',
      component: siteInfo,
      meta: {keepAlive: true}
    },
    {
      path: '/siteInfoDetailList',
      name: 'siteInfoDetailList',
      component: siteInfoDetailList,
      meta: {keepAlive: true}
    },
    {
      path: '/documentCenter',
      name: 'documentCenter',
      component: documentCenter,
      meta: {keepAlive: true}
    },
    {
      path: '/documentCenterDetailList',
      name: 'documentCenterDetailList',
      component: documentCenterDetailList,
      meta: {keepAlive: true}
    },
    {
      path: '/documentCenterDetails',
      name: 'documentCenterDetails',
      component: documentCenterDetails,
      meta: {keepAlive: true}
    },
    {
      path: '/documentRead',
      name: 'documentRead',
      component: documentRead,
      meta: {keepAlive: true}
    },
    {
      path: '/documentReadDetail',
      name: 'documentReadDetail',
      component: documentReadDetail,
      meta: {keepAlive: true}
    },
    {
      path: '/search',
      name: 'search',
      component: search,
      meta: {keepAlive: true}
    },
    {
      path: '/toReadList',
      name: 'toReadList',
      component: toReadList,
      meta: {keepAlive: true}
    },
    {
      path: '/toNextList',
      name: 'toNextList',
      component: toNextList,
      meta: {keepAlive: true}
    },
    {
      path: '/versionUpdateInfo',
      name: 'versionUpdateInfo',
      component: versionUpdateInfo,
      meta: {keepAlive: true}
    },
    {
      path: '/tab',
      redirect: 'tab/home',
      name: 'tab',
      component: tab,
      children: [
        {
          path: 'home',
          name: 'home',
          component: home/*,
          meta: {keepAlive: true}*/
        },
        {
          path: 'erp',
          name: 'erp',
          component: erp/*,
          meta: {keepAlive: true}*/
        },
        {
          path: 'contact',
          name: 'contact',
          component: contact/*,
          meta: {keepAlive: true}*/
        },
        {
          path: 'personal',
          name: 'personal',
          component: personal/*,
          meta: {keepAlive: true}*/
        }
      ]
    }
  ]
})
