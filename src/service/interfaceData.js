let interfaceData = {
  loginApi: '/SignIn',//登陆
  loginOutApi: '/SignOut',//登出
  versionApi: '/GetVersion',//版本
  currentVersionApi: '/GetCurrentVersion', //当前版本

  //销售审批模块
  getERPDaibanApi: '/service/user/getERPDaiban/',//销售审批待办数量
  getERPDbListApi: '/service/WF/getERPDbList/',//销售审批待办列表
  getERPYbListApi: '/service/WF/getERPYbList/',//销售审批已办列表
  getERPBjListApi: '/service/WF/getERPBjList/',//销售审批已办列表
  getERPDetailApi: '/service/WF/getERPTaskDetail/',//销售审批详情
  getERPCommentDetailApi: '/service/WF/getERPCommentDetail/',//销售审批流程记录

/*  废钢验收模块
  getAuthorityFlagApi: '/LogCheck.aspx',//获取权限标识
  getLevelStandardListApi: '/QueryStander.aspx',//获取判级标准列表
  getLevelStandardDetailApi: '/QueryStander.aspx',//获取判级标准明细
  getQualityTestListApi: '/QueryQuSite.aspx',//获取质检点列表
  getQualityTestDetailApi: '/QueryQuSite.aspx',//获取质检点明细
  getWeightNoteInfoApi: '/QueryWgt.aspx',//根据磅单号查询信息
  getCarMsgByWgtApi: '/QueryWgt.aspx',//获取车次信息 QueryWgt.aspx
  getAcceptHistoryListApi: '/QueryInfo.aspx',//获取验收历史数据列表
  getAcceptHistoryDetailApi: '/QueryInfo.aspx',//获取验收历史数据详情
  getAcceptPictureApi: '/DownLoadPicture.aspx',//获取验收照片
  getAcceptPictureApi: '/service/IW/getPictureNews/',
    'QueryPicture.aspx',//获取验收照片*/

  //主页数据显示
  getOADaibanApi: '/service/user/getOADaiban/',//行政审批待办数量
  getCMTaskCountApi: '/service/CM/getCMTaskCount/',//日程管理待办数量
  getJDTaskCountApi: '/service/JDManage/getJDTaskCount/',//接待管理待办数量
  getMeetingTaskCountApi: '/service/Meeting/getMeetingTaskCount/',//会议管理待办数量
  getJBTaskCountApi: '/service/JobManage/getJBTaskCount/',//任务管理待办数量
  getFirstPageNewRemarkApi: '/service/DOC/getFirstPageNewRemark/',//文档中心待办

  getJhjtOADaibanApi: '/JHJT/service/user/getOADaiban/',//京华集团行政审批待办数量
  getWkygOADaibanApi: '/WKYG/service/user/getOADaiban/',//五矿营钢行政审批待办数量


  getPictureNewsApi:'/service/IW/getPictureNews/',//轮播图获取

  //通讯录
  queryABUserApi: '/service/user/queryABUser/',//查询员工
  getABGroupUserApi: '/service/user/getABGroupUser/',//通讯录

  //京华集团通讯录
  queryJhjtABUserApi: '/JHJT/service/user/queryABUser/',//查询员工
  getJhjtABGroupUserApi: '/JHJT/service/user/getABGroupUser/',//通讯录

  //五矿营钢通讯录
  queryWkygABUserApi: '/WKYG/service/user/queryABUser/',//查询员工
  getWkygABGroupUserApi: '/WKYG/service/user/getABGroupUser/',//通讯录

  //组织结构
  getTopGroupApi: '/service/user/getTopGroup/',//顶层组织
  getGroupAndUserApi: '/service/user/getGroupAndUser/',//子组织

  //京华集团组织结构
  getJhjtTopGroupApi: '/JHJT/service/user/getTopGroup/',//顶层组织
  getJhjtGroupAndUserApi: '/JHJT/service/user/getGroupAndUser/',//子组织

  //五矿营钢组织结构
  getWkygTopGroupApi: '/WKYG/service/user/getTopGroup/',//顶层组织
  getWkygGroupAndUserApi: '/WKYG/service/user/getGroupAndUser',//子组织

  //行政审批列表
  getWFTasksDBApi: '/service/WF/getWFTasksDB/',//待办
  getWFTasksYBApi: '/service/WF/getWFTasksYB/',//已办
  getWFTasksBJApi: '/service/WF/getWFTasksBJ/',//办结

  //京华集团行政审批列表
  getJhjtWFTasksDBApi: '/JHJT/service/WF/getWFTasksDB/',//待办
  getJhjtWFTasksYBApi: '/JHJT/service/WF/getWFTasksYB/',//已办
  getJhjtWFTasksBJApi: '/JHJT/service/WF/getWFTasksBJ/',//办结

  //五矿营钢行政审批列表
  getWkygWFTasksDBApi: '/WKYG/service/WF/getWFTasksDB/',//待办
  getWkygWFTasksYBApi: '/WKYG/service/WF/getWFTasksYB/',//已办
  getWkygWFTasksBJApi: '/WKYG/service/WF/getWFTasksBJ/',//办结

  //行政审批详情
  getWFBJTaskDetailApi: '/service/WF/getBJTaskDetail/',//办结表单详情
  getWFTaskDetailApi: '/service/WF/getTaskDetail/',//表单详情
  getWFDataGJTaskListApi: '/service/WF/getDataGJTaskList/',//审批流程

  //京华集团行政审批详情
  getJhjtWFBJTaskDetailApi: '/JHJT/service/WF/getBJTaskDetail/',//办结表单详情
  getJhjtWFTaskDetailApi: '/JHJT/service/WF/getTaskDetail/',//表单详情
  getJhjtWFDataGJTaskListApi: '/JHJT/service/WF/getDataGJTaskList/',//审批流程

  //五矿营钢行政审批详情
  getWkygWFBJTaskDetailApi: '/WKYG/service/WF/getBJTaskDetail/',//办结表单详情
  getWkygWFTaskDetailApi: '/WKYG/service/WF/getTaskDetail/',//表单详情
  getWkygWFDataGJTaskListApi: '/WKYG/service/WF/getDataGJTaskList/',//审批流程

  //公文审批
  getCWCRTasksDBApi: '/service/CWCR/getWFTasksDB/',//待办
  getCWCRTasksYBApi: '/service/CWCR/getWFTasksYB/',//已办
  getCWCRTasksBJApi: '/service/CWCR/getWFTasksBJ/',//办结
  //公文审批详情、公文阅知详情
  getCWCRDataGJTaskListApi: '/service/CWCR/getDataGJTaskList/',//审批流程
  getCWCRTaskDetailApi: '/service/CWCR/getTaskDetail/',//表单详情

  //公文阅知、公文阅知详情
  getCWCRYuezhiApi: '/service/CWCR/getYuezhi/',
  getCWCRYuezhiDetailApi: '/service/CWCR/getYuezhiDetail/',//阅知表单详情
  //会议管理列表
  loadToBeConfirmedMeetingListApi: '/service/Meeting/loadToBeConfirmedMeetingList/',//会议待确认
  loadAlreadyConfirmedMeetingListApi: '/service/Meeting/loadAlreadyConfirmedMeetingList/',//会议已确认
  loadMyMeetingTaskListApi: '/service/Meeting/loadMyMeetingTaskList/',//会议审批待办
  loadMyMeetingYBListApi: '/service/Meeting/loadMyMeetingYBList/',//会议已审批
  //会议审批详情
  getCommentInfoApi: '/service/Meeting/getCommentInfo/',//审批流程
  getMeetingInfoApi: '/service/Meeting/getMeetingInfo/',//表单详情
  getMeetingTaskInfoApi: '/service/Meeting/getMeetingTaskInfo/',//审批待办表单详情
  //确定参会
  confirmMeetingApi: '/service/Meeting/confirmMeeting',
  //扫码签到
  ScanMeetingApi: '/service/Meeting/ScanMeeting',



  //接待管理列表
  loadMyJDTaskListApi: '/service/JDManage/loadMyJDTaskList/',//待办
  loadMyJDYBListApi: '/service/JDManage/loadMyJDYBList/',//已办
  loadToBeConfirmedJDListApi: '/service/JDManage/loadToBeConfirmedJDList/',//未阅
  loadAlreadyConfirmedJDListApi: '/service/JDManage/loadAlreadyConfirmedJDList/',//已阅
  //接待管理详情
  getJDCommentInfoApi: '/service/JDManage/getCommentInfo/',//审批流程
  getJDTaskInfoApi: '/service/JDManage/getJDTaskInfo/',//待办表单详情
  getJDFormInfoApi: '/service/JDManage/getJDFormInfo/',//表单详情
  //确定已阅
  confirmJDApi: '/service/JDManage/confirmJD',//点击确定未阅变已阅


  //任务管理列表
  loadMyJobInfoApi: '/service/JobManage/loadMyJobInfo/',//我的任务
  loadPubJobInfoApi: '/service/JobManage/loadPubJobInfo/',//我发起的
  loadFollowJobInfoApi: '/service/JobManage/loadFollowJobInfo/',//关注的
  // 任务管理详情
  getJobDetailInfoApi: '/service/JobManage/getJobDetailInfo/',//我的任务
  getJobMainlInfoApi: '/service/JobManage/getJobMainlInfo/',//我发起的，关注的
  //任务管理反馈
  getJobManageConfirmJBApi: '/service/JobManage/confirmJB',


  //日程管理
  todoMonthListApi: '/service/CM/todoMonthList/',//月日程
  todoDayListApi: '/service/CM/todoDayList/',//日日程

  //文档管理
  getDirectoryListInfoApi: '/service/DOC/getDirectoryListInfo/',//文档分类列表
  getContentListInfoApi: '/service/DOC/getContentListInfo/',//各类型文档列表
  getContentDetailInfoApi: '/service/DOC/getContentDetailInfo/',//文档详细内容

  //信息发布中心
  getNewsChanelListApi: '/service/IW/getNewsChanelList/',//信息分类列表
  getNewsTitleInfoNewApi: '/service/IW/getNewsTitleInfoNew/',//各类型信息列表
  getNewsContentInfoApi:'/service/IW/getContentInfo/',//信息详情
  getSiteIdInfoApi: '/service/IW/getSiteIdInfo/',//其他站点列表获取
  getOtherSiteChanelListApi: '/service/IW/getOtherSiteChanelList/',//其他站点获取栏目列表


  //操作：流转/传阅/撤回/退回
  getWFCaoZuoApi: '/service/WF/caozuo', //行政审批
  getCWCRCaoZuoApi: '/service/CWCR/caozuo', //公文审批
  getMeetingCaoZuoApi: '/service/Meeting/caozuo', //会议管理
  getJDMangeCaoZuoApi: '/service/JDManage/caozuo', //接待管理
  getERPCaoZuoApi: '/service/WF/caozuo', //ERP审批
  getJhjtCaoZuoApi: '/JHJT/service/WF/caozuo', //京华审批
  getWkygCaoZuoApi: '/WKYG/service/WF/caozuo', //营钢审批

  //附件获取
  getAttachmentAllUrlsApi: '/service/CWCR/getAttachmentAllUrls',
  getJhjtAttachmentAllUrlsApi: '/JHJT/service/CWCR/getAttachmentAllUrls',
  getWkygAttachmentAllUrlsApi: '/WKYG/service/CWCR/getAttachmentAllUrls'
};

export default interfaceData;
