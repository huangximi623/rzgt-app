import {loginApi, loginOutApi, postApiData, postErpApiData, postSteelApiData, weChatloginApi} from "./getData";
import interfaceData from '../service/interfaceData.js'

let interfaceService = {
  //是否取消更新提醒的标识(用户点击取消更新后，后面不再提醒)
  cancelUpdateFlag: false,

  //设置cookie
  setCookie: function (c_name, value, expiredays) {
    let exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + escape(value) +
      ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
  },
//获取cookie

  getCookie: function (c_name) {
    let c_start;
    if (document.cookie.length > 0) {
      let c_start = document.cookie.indexOf(c_name + "=");
      if (c_start != -1) {
        c_start = c_start + c_name.length + 1;
        let c_end = document.cookie.indexOf(";", c_start);
        if (c_end == -1) c_end = document.cookie.length;
        return unescape(document.cookie.substring(c_start, c_end))
      }
    }
    return ""
  },
  //清除cookie
  clearCookie: function (name) {
    this.setCookie(name, "", -1);
  },
  /*
  ==========================================
      登陆、退出、版本获取、主页面待办数据获取
  ==========================================
   */
  //微信登陆
  weChatLogin: function (params) {
    return weChatloginApi(interfaceData.loginApi, params);
  },
  //客户端登陆
  queryLogin: function (params) {
    return loginApi(interfaceData.loginApi, params);
  },
  //登出
  LoginOut: function () {
    return loginOutApi(interfaceData.loginOutApi);
  },
  versionInfo: '',
  //获取最新版本
  getLatestVersion: function () {
    return loginOutApi(interfaceData.versionApi);
  },
  setVersion: function (val) {
    interfaceService.versionInfo = val;
  },
  getVersion: function () {
    return interfaceService.versionInfo
  },
  //获取各个模块待办数量
  queryHomeData: function (type) {
    let apiName = '';
    switch (type) {
      case 'WFandCWCR':
        apiName = interfaceData.getOADaibanApi;
        break;
      case 'JD':
        apiName = interfaceData.getJDTaskCountApi;
        break;
      case 'Meeting':
        apiName = interfaceData.getMeetingTaskCountApi;
        break;
      case 'JB':
        apiName = interfaceData.getJBTaskCountApi;
        break;
      default:
        break;
    }
    let url = apiName + this.getCookie("Token");
    let paramsPost = {
      url: url,
      method: 'get',
      param: ''
    };
    return postApiData(paramsPost);
  },
  //获取文档中心待办
  queryFirstPageNewRemark: function () {
    let url = interfaceData.getFirstPageNewRemarkApi + this.getCookie("Token") + '/OOOOOOOO';
    let paramsPost = {
      url: url,
      method: 'get',
      param: ''
    };
    return postApiData(paramsPost);
  },
  //获取轮播图
  queryPictureNews: function () {
    let url = interfaceData.getPictureNewsApi + this.getCookie("Token");
    let paramsPost = {
      url: url,
      method: 'get',
      param: ''
    };
    return postApiData(paramsPost);
  },

  /*
==========================================
              废钢验收模块
==========================================
*/

  //获取权限标识
  queryAuthorityFlag: function (params) {
    // let url = apiName + this.getCookie("Token") + '?from=' + params.from + '&' + 'limit=' + params.limit;
    let url = interfaceData.getAuthorityFlagApi;
    let paramsPost = {
      url: url,
      method: 'post',
      param: JSON.stringify(params)
    };
    return postSteelApiData(paramsPost);
  },

  //判级列表
  queryLevelStandardList: function (params) {
    // let url = apiName + this.getCookie("Token") + '?from=' + params.from + '&' + 'limit=' + params.limit;
    let url = interfaceData.getLevelStandardListApi;
    let paramsPost = {
      url: url,
      method: 'post',
      param: JSON.stringify(params)
    };
    return postSteelApiData(paramsPost);
  },

  //判级详情
  queryLevelStandardDetail: function (params) {
    // let url = apiName + this.getCookie("Token") + '?from=' + params.from + '&' + 'limit=' + params.limit;
    let url = interfaceData.getLevelStandardDetailApi;
    let paramsPost = {
      url: url,
      method: 'post',
      param: JSON.stringify(params)
    };
    return postSteelApiData(paramsPost);
  },

  //质检列表
  queryQualityTestList: function (params) {
    // let url = apiName + this.getCookie("Token") + '?from=' + params.from + '&' + 'limit=' + params.limit;
    let url = interfaceData.getQualityTestListApi;
    let paramsPost = {
      url: url,
      method: 'post',
      param: JSON.stringify(params)
    };
    return postSteelApiData(paramsPost);
  },

  //质检详情
  queryQualityTestDetail: function (params) {
    // let url = apiName + this.getCookie("Token") + '?from=' + params.from + '&' + 'limit=' + params.limit;
    let url = interfaceData.getQualityTestDetailApi;
    let paramsPost = {
      url: url,
      method: 'post',
      param: JSON.stringify(params)
    };
    return postSteelApiData(paramsPost);
  },

  //扫描磅单查询信息
  queryScanWeightNote: function (params) {
  // let url = apiName + this.getCookie("Token") + '?from=' + params.from + '&' + 'limit=' + params.limit;
  let url = interfaceData.getWeightNoteInfoApi;
  let paramsPost = {
    url: url,
    method: 'post',
    param: JSON.stringify(params)
  };
  return postSteelApiData(paramsPost);
},

  //车辆信息详情
  queryWgtDetail: function (params) {
    // let url = apiName + this.getCookie("Token") + '?from=' + params.from + '&' + 'limit=' + params.limit;
    let url = interfaceData.getCarMsgByWgtApi;
    let paramsPost = {
      url: url,
      method: 'post',
      param: JSON.stringify(params)
    };
    return postSteelApiData(paramsPost);
  },

  //获取验收历史数据列表
  queryAcceptHistoryList: function (params) {
    // let url = apiName + this.getCookie("Token") + '?from=' + params.from + '&' + 'limit=' + params.limit;
    let url = interfaceData.getAcceptHistoryListApi;
    let paramsPost = {
      url: url,
      method: 'post',
      param: JSON.stringify(params)
    };
    return postSteelApiData(paramsPost);
  },
  //获取验收历史数据详情
  queryAcceptHistoryDetail: function (params) {
    // let url = apiName + this.getCookie("Token") + '?from=' + params.from + '&' + 'limit=' + params.limit;
    let url = interfaceData.getAcceptHistoryDetailApi;
    let paramsPost = {
      url: url,
      method: 'post',
      param: JSON.stringify(params)
    };
    return postSteelApiData(paramsPost);
  },

  //依据磅单号查询图片
  queryAcceptPicture: function (params) {
    let url = interfaceData.getAcceptPictureApi;
    let paramsPost = {
      url: url,
      method: 'post',
      param: JSON.stringify(params)
    };
    // return postApiData(paramsPost);
    return postSteelApiData(paramsPost);
  },

  /*
 ==========================================
                ERP审批模块
 ==========================================
 */
  //销售审批待办数量
  queryErpData: function (type,params) {
    let apiName = '';
    switch (type) {
      case 'ERP':
        apiName = interfaceData.getERPDaibanApi;
        break;
      default:
        break;
    }
    let url = apiName;
    let paramsPost = {
      url: url,
      method: 'post',
      param: params
    };
    return postErpApiData(paramsPost);
  },

  querySalesList: function (type, params) {
    let apiName = '';
    switch (type) {
      case '待办':
        apiName = interfaceData.getSaleDbListApi;
        break;
      case '已办':
        apiName = interfaceData.getSaleYbListApi;
        break;
      default:
        break;
    }
    // let url = apiName + this.getCookie("Token") + '?from=' + params.from + '&' + 'limit=' + params.limit;
    let url = apiName;
    let paramsPost = {
      url: url,
      method: 'post',
      param: JSON.stringify(params)
    };
    return postErpApiData(paramsPost);
  },

  //销售审批流程
  querySalesProcess: function (params) {
    console.log("请求意见参数"+params)
    let url = interfaceData.getSaleCommentDetailApi;
    let paramsPost = {
      url: url,
      method: 'post',
      param: JSON.stringify(params)
    };
    return postErpApiData(paramsPost);
  },
  //销售审批详情
  querySalesDetails: function (params) {
    let url = '';
    url = interfaceData.getSaleTaskDetailApi;
    let paramsPost = {
      url: url,
      method: 'post',
      param: JSON.stringify(params)
    };
    return postErpApiData(paramsPost);
  },

  /*
  ==========================================
                 行政审批模块
  ==========================================
  */
  //行政审批列表
  queryAdminList: function (type, params) {
    let apiName = '';
    switch (type) {
      case '待办':
        apiName = interfaceData.getWFTasksDBApi;
        break;
      case '已办':
        apiName = interfaceData.getWFTasksYBApi;
        break;
      case '办结':
        apiName = interfaceData.getWFTasksBJApi;
        break;
      default:
        break;
    }
    let url = apiName + this.getCookie("Token") + '?from=' + params.from + '&' + 'limit=' + params.limit;
    let paramsPost = {
      url: url,
      method: 'get',
      param: ''
    };
    return postApiData(paramsPost);
  },
  //行政审批流程
  queryAdminProcess: function (params) {
    // let url = interfaceData.getWFDataGJTaskListApi + window.localStorage.getItem("Token")?window.localStorage.getItem("Token"):this.getCookie("Token") + '?processId=' + params.processId + '&' + 'limit=NaN';
    let url = interfaceData.getWFDataGJTaskListApi + this.getCookie("Token") + '/' + params.processId;
    let paramsPost = {
      url: url,
      method: 'get',
      param: ''
    };
    return postApiData(paramsPost);
  },
  //行政审批详情
  queryAdminDetails: function (type, params) {
    let url = '';
    if (type === 'over') {
      // url = interfaceData.getWFBJTaskDetailApi + window.localStorage.getItem("Token")?window.localStorage.getItem("Token"):this.getCookie("Token") + '?processId=' + params.processId + '&' + 'limit=NaN';
      url = interfaceData.getWFBJTaskDetailApi + this.getCookie("Token") + '/' + params.processId;
    } else {
      // url = interfaceData.getWFTaskDetailApi + window.localStorage.getItem("Token")?window.localStorage.getItem("Token"):this.getCookie("Token") + '?taskId=' + params.taskId + '&' + 'limit=NaN';
      url = interfaceData.getWFTaskDetailApi + this.getCookie("Token") + '/' + params.taskId;
    }
    let paramsPost = {
      url: url,
      method: 'get',
      param: ''
    };
    return postApiData(paramsPost);
  },

  /*
  ==========================================
                 公文审批
  ==========================================
  */
  //公文审批
  queryDocumentList: function (type, params) {
    let apiName = '';
    switch (type) {
      case '待办':
        apiName = interfaceData.getCWCRTasksDBApi;
        break;
      case '已办':
        apiName = interfaceData.getCWCRTasksYBApi;
        break;
      case '办结':
        apiName = interfaceData.getCWCRTasksBJApi;
        break;
      default:
        break;
    }
    let url = apiName + this.getCookie("Token") + '?from=' + params.from + '&' + 'limit=' + params.limit;
    let paramsPost = {
      url: url,
      method: 'get',
      param: ''
    };
    return postApiData(paramsPost);
  },
  //公文审批流程
  queryDocumentProcess: function (params) {
    // let url = interfaceData.getCWCRDataGJTaskListApi + window.localStorage.getItem("Token")?window.localStorage.getItem("Token"):this.getCookie("Token") + '?processId=' + params.processId + '&' + 'limit=NaN';
    let url = interfaceData.getCWCRDataGJTaskListApi + this.getCookie("Token") + '/' + params.processId;
    let paramsPost = {
      url: url,
      method: 'get',
      param: ''
    };
    return postApiData(paramsPost);
  },
  //公文表单详情
  queryDocumentDetails: function (params) {
    // let url = interfaceData.getCWCRTaskDetailApi + window.localStorage.getItem("Token")?window.localStorage.getItem("Token"):this.getCookie("Token") + '?taskId=' + params.taskId + '&fileGuid=' + params.fileGuid + '&' + 'limit=NaN';
    let url = interfaceData.getCWCRTaskDetailApi + this.getCookie("Token") + '/' + params.fileGuid + '/' + (!params.taskId ? 'undefined' : params.taskId) + '/1';
    let paramsPost = {
      url: url,
      method: 'get',
      param: ''
    };
    return postApiData(paramsPost);
  },

  /*
  ==========================================
                 公文阅知模块
  ==========================================
  */
  //公文阅知列表
  queryDocumentReadList: function (params) {
    let apiName = interfaceData.getCWCRYuezhiApi;
    let url = apiName + this.getCookie("Token") + '?from=' + params.from + '&' + 'limit=' + params.limit + '&' + 'type=' + params.type;
    let paramsPost = {
      url: url,
      method: 'get',
      param: ''
    };
    return postApiData(paramsPost);
  },

  //公文阅知详情
  queryDocumentReadDetails: function (params) {
    // let url = interfaceData.getCWCRTaskDetailApi + window.localStorage.getItem("Token")?window.localStorage.getItem("Token"):this.getCookie("Token") + '?fileGuid=' + params.fileGuid + '&yueZhi=' + params.yueZhi + '&limit=NaN';
    let url = interfaceData.getCWCRYuezhiDetailApi + this.getCookie("Token") + '/' + params.fileGuid;
    let paramsPost = {
      url: url,
      method: 'get',
      param: ''
    };
    return postApiData(paramsPost);
  },


  /*
  ==========================================
                 会议管理模块
  ==========================================
  */
  //会议管理列表
  queryMeetingManagerList: function (type, params) {
    let apiName = '';
    switch (type) {
      case '待确认':
        apiName = interfaceData.loadToBeConfirmedMeetingListApi;
        break;
      case '已确认':
        apiName = interfaceData.loadAlreadyConfirmedMeetingListApi;
        break;
      case '审批待办':
        apiName = interfaceData.loadMyMeetingTaskListApi;
        break;
      case '已审批':
        apiName = interfaceData.loadMyMeetingYBListApi;
        break;
      default:
        break;
    }
    let url = apiName + this.getCookie("Token") + '?from=' + params.from + '&limit=' + params.limit;
    let paramsPost = {
      url: url,
      method: 'get',
      param: ''
    };
    return postApiData(paramsPost);
  },
  //会议管理审批流程
  queryMeetingManagerProcess: function (params) {
    // let url = interfaceData.getCommentInfoApi + window.localStorage.getItem("Token")?window.localStorage.getItem("Token"):this.getCookie("Token") + '?processId=' + params.processId;
    let url = interfaceData.getCommentInfoApi + this.getCookie("Token") + '/' + params.processId;
    let paramsPost = {
      url: url,
      method: 'get',
      param: ''
    };
    return postApiData(paramsPost);
  },
  //会议管理表单详情
  queryMeetingManagerDetail: function (id, params) {
    let url = '';
    if (id === '2') {
      url = interfaceData.getMeetingTaskInfoApi + this.getCookie("Token") + '/' + params.rowguid + '/' + params.taskId;
    } else {
      url = interfaceData.getMeetingInfoApi + this.getCookie("Token") + '/' + params.rowguid;
    }
    let paramsPost = {
      url: url,
      method: 'get',
      param: ''
    };
    return postApiData(paramsPost);
  },

  //确定参会
  queryConfirmMeeting: function (params) {
    let url = interfaceData.confirmMeetingApi;
    let paramsPost = {
      url: url,
      method: 'post',
      param: JSON.stringify(params)
    };
    return postApiData(paramsPost);
  },
  //扫码签到
  queryScanMeeting: function (params) {
    let url = interfaceData.ScanMeetingApi;
    let paramsPost = {
      url: url,
      method: 'post',
      param: JSON.stringify(params)
    };
    return postApiData(paramsPost);
  },

  /*
  ==========================================
                 接待管理模块
  ==========================================
  */
  //接待管理列表
  queryReceptionManagerList: function (type, params) {
    let apiName = '';
    switch (type) {
      case '待办':
        apiName = interfaceData.loadMyJDTaskListApi;
        break;
      case '已办':
        apiName = interfaceData.loadMyJDYBListApi;
        break;
      case '未阅':
        apiName = interfaceData.loadToBeConfirmedJDListApi;
        break;
      case '已阅':
        apiName = interfaceData.loadAlreadyConfirmedJDListApi;
        break;
      default:
        break;
    }
    let url = apiName + this.getCookie("Token") + '?from=' + params.from + '&limit=' + params.limit;
    let paramsPost = {
      url: url,
      method: 'get',
      param: ''
    };
    return postApiData(paramsPost);
  },
  //接待管理审批流程
  queryReceptionManagerProcess: function (params) {
    // let url = interfaceData.getJDCommentInfoApi + window.localStorage.getItem("Token")?window.localStorage.getItem("Token"):this.getCookie("Token") + '?instanceId=' + params.instanceId;
    let url = interfaceData.getJDCommentInfoApi + this.getCookie("Token") + '/' + params.instanceId;
    let paramsPost = {
      url: url,
      method: 'get',
      param: ''
    };
    return postApiData(paramsPost);
  },
  //接待管理表单详情
  queryReceptionManagerDetail: function (type, params) {
    let url = '';
    if (type === 'todo') {
      url = interfaceData.getJDTaskInfoApi + this.getCookie("Token") + '/' + params.receiveGuid + '/' + params.instanceId + '/' + params.taskId + '?limit=NaN';
    } else {
      url = interfaceData.getJDFormInfoApi + this.getCookie("Token") + '/' + params.receiveGuid + '?limit=NaN';
    }
    let paramsPost = {
      url: url,
      method: 'get',
      param: ''
    };
    return postApiData(paramsPost);
  },

  //确定已阅
  confirmJD: function (params) {
    let url = interfaceData.confirmJDApi;
    let paramsPost = {
      url: url,
      method: 'post',
      param: JSON.stringify(params)
    };
    return postApiData(paramsPost);
  },

  /*
  ==========================================
                 任务管理模块
  ==========================================
  */
  //获取任务管理列表
  queryTaskManagementList: function (type, params) {
    let apiName = '';
    switch (type) {
      case '我的任务':
        apiName = interfaceData.loadMyJobInfoApi;
        break;
      case '我发起的':
        apiName = interfaceData.loadPubJobInfoApi;
        break;
      case '关注的':
        apiName = interfaceData.loadFollowJobInfoApi;
        break;
      default:
        break;
    }
    let url = apiName + this.getCookie("Token") + '?from=' + params.from + '&limit=' + params.limit;
    let paramsPost = {
      url: url,
      method: 'get',
      param: ''
    };
    return postApiData(paramsPost);
  },
  //获取任务管理表单详情
  queryTaskManagementDetail: function (type, params) {
    let url = '';
    if (type === 'todo') {
      url = interfaceData.getJobDetailInfoApi + this.getCookie("Token") + '/' + params.guid + '?limit=NaN';
    } else {
      url = interfaceData.getJobMainlInfoApi + this.getCookie("Token") + '/' + params.guid + '?limit=NaN';
    }
    let paramsPost = {
      url: url,
      method: 'get',
      param: ''
    };
    return postApiData(paramsPost);
  },
  //任务管理反馈
  queryJobManageConfirmJBApi: function (params) {
    let url = interfaceData.getJobManageConfirmJBApi;
    let paramsPost = {
      url: url,
      method: 'post',
      param: JSON.stringify(params)
    };
    return postApiData(paramsPost);
  },

  /*
  ==========================================
                日程管理模块
  ==========================================
  */
  //查询月日程
  queryMonthSchedule: function (params) {
    let url = interfaceData.todoMonthListApi + this.getCookie("Token") + '?month=' + params.month;
    let paramsPost = {
      url: url,
      method: 'get',
      param: ''
    };
    return postApiData(paramsPost);
  },
  //查询日日程
  queryDaySchedule: function (params) {
    let url = interfaceData.todoDayListApi + this.getCookie("Token") + '?day=' + params.day;
    let paramsPost = {
      url: url,
      method: 'get',
      param: ''
    };
    return postApiData(paramsPost);
  },

  /*
  ==========================================
                 通讯录模块
  ==========================================
  */
  personInfo: '',
  //获取通讯录列表
  queryContactList: function (params) {
    // let url = interfaceData.getABGroupUserApi + window.localStorage.getItem("Token")?window.localStorage.getItem("Token"):this.getCookie("Token") + '?groupLabel=' + params.groupLabel;
    let url = interfaceData.getABGroupUserApi + this.getCookie("Token") + '/' + params.groupLabel;
    let paramsPost = {
      url: url,
      method: 'get',
      param: ''
    };
    return postApiData(paramsPost);
  },
  //查询员工
  queryPersonList: function (params) {
    let url = interfaceData.queryABUserApi + this.getCookie("Token") + '/' + encodeURIComponent(params.queryValue);
    let paramsPost = {
      url: url,
      method: 'get',
      param: ''
    };
    return postApiData(paramsPost);
  },
  setPersonInfo: function (val) {
    interfaceService.personInfo = val;
  },
  getPersonInfo: function () {
    return interfaceService.personInfo;
  },

  /*
  ==========================================
                 组织结构
  ==========================================
  */
  //获取顶层组织
  queryTopOrganization: function (params) {
    let url = interfaceData.getTopGroupApi + this.getCookie("Token") + '?limit=NaN';
    let paramsPost = {
      url: url,
      method: 'get',
      param: ''
    };
    return postApiData(paramsPost);
  },
  //获取子组织列列表
  queryOrganizationList: function (params) {
    let url = interfaceData.getGroupAndUserApi + 'groupLabel=' + params.groupLabel + '&groupKind=' + params.groupKind;
    let paramsPost = {
      url: url,
      method: 'get',
      param: ''
    };
    return postApiData(paramsPost);
  },

  /*
  ==========================================
                 文档中心
  ==========================================
  */
  //获取文档分类列表
  queryDirectoryListInfo: function () {
    let url = interfaceData.getDirectoryListInfoApi + this.getCookie("Token");
    let paramsPost = {
      url: url,
      method: 'get',
      param: ''
    };
    return postApiData(paramsPost);
  },
  //获取各类型文档列表
  queryContentListInfo: function (params) {
    let url = interfaceData.getContentListInfoApi + this.getCookie("Token") + '/' + params.informationListId + '?from=' + params.from + '&limit=' + params.limit;
    let paramsPost = {
      url: url,
      method: 'get',
      param: ''
    };
    return postApiData(paramsPost);
  },
  //获取文档详细内容
  queryContentDetailInfo: function (params) {
    let url = interfaceData.getContentDetailInfoApi + this.getCookie("Token") + '/' + params.documentguid;
    let paramsPost = {
      url: url,
      method: 'get',
      param: ''
    };
    return postApiData(paramsPost);
  },

  /*
  ==========================================
                信息发布中心
  ==========================================
  */
  //获取信息分类列表
  queryNewsChanelList: function (params) {
    let url = '';
    if (params === 'IW') {
      url = interfaceData.getNewsChanelListApi + this.getCookie("Token");
    } else {
      url = interfaceData.getNewsChanelListApi + this.getCookie("Token") + '?from=' + params.from + '&limit=' + params.limit;
    }
    let paramsPost = {
      url: url,
      method: 'get',
      param: ''
    };
    return postApiData(paramsPost);
  },
  //获取各类型文档列表
  queryNewsChanelListInfo: function (params) {
    let url = interfaceData.getNewsTitleInfoNewApi + this.getCookie("Token") + '/' + params.channelid + '?from=' + params.from + '&limit=' + params.limit;
    let paramsPost = {
      url: url,
      method: 'get',
      param: ''
    };
    return postApiData(paramsPost);
  },
  //信息详情
  queryNewsContentInfo: function (params) {
    let url = interfaceData.getNewsContentInfoApi + this.getCookie("Token") + '/' + params.docid;
    let paramsPost = {
      url: url,
      method: 'get',
      param: ''
    };
    return postApiData(paramsPost);
  },
  //获取其他站点列表
  querySiteIdInfo: function (params) {
    let url = interfaceData.getSiteIdInfoApi + this.getCookie("Token") + '?from=' + params.from + '&limit=' + params.limit;
    let paramsPost = {
      url: url,
      method: 'get',
      param: ''
    };
    return postApiData(paramsPost);
  },
  //获取各类型文档列表
  queryOtherSiteChanelList: function (params) {
    let url = interfaceData.getOtherSiteChanelListApi + this.getCookie("Token") + '/' + params.siteListId + '?from=' + params.from + '&limit=' + params.limit;
    let paramsPost = {
      url: url,
      method: 'get',
      param: ''
    };
    return postApiData(paramsPost);
  },

  /*
  ==========================================
                 传阅
  ==========================================
  */
  //传阅
  queryAdminRead: function (type, params) {
    let url;
    switch (type) {
      case '行政审批':
        url = interfaceData.getWFCaoZuoApi;
        break;
      case '公文审批':
        url = interfaceData.getCWCRCaoZuoApi;
        break;
      case '会议管理':
        url = interfaceData.getMeetingCaoZuoApi;
        break;
      case '接待管理':
        url = interfaceData.getJDMangeCaoZuoApi;
        break;
      case '销售审批':
        url = interfaceData.getERPCaoZuoApi;
        break;
      default:
        break;
    }
    let paramsPost = {
      url: url,
      method: 'post',
      param: JSON.stringify(params)
    };
    if(type == '销售审批'){
      return postErpApiData(paramsPost);
    }else{
      return postApiData(paramsPost);
    }

  },

  /*
  ==========================================
                 附件预览和下载
  ==========================================
  */
  queryAttachments: function (params) {
    let url = interfaceData.getAttachmentAllUrlsApi;
    let paramsPost = {
      url: url,
      method: 'post',
      param: JSON.stringify(params)
    };
    return postApiData(paramsPost);
  }
};

export default interfaceService;
