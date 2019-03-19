import {fetch, fetchLogin, weChatFetchLogin} from '../share/fetch'
import config from '../config/config.json'
//获取数据
export const postApiData = (params) => {
  return fetch({
    url: config.apiURL,
    method: 'POST',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
      // 'crossDomain': true,
      // 'X-Requested-With': 'XMLHttpRequest'
    },
    //发送请求前，将request payload转换成form data
    transformRequest: [function (obj) {
      let str = [];
      for (let p in obj)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      return str.join("&");
    }],
    data: params
  })
};

//获取废钢验收数据
export const postSteelApiData = (params) => {
  return fetch({
    url: config.steelApiURL,
    method: 'POST',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
      // 'crossDomain': true,
      // 'X-Requested-With': 'XMLHttpRequest'
    },
    //发送请求前，将request payload转换成form data
    transformRequest: [function (obj) {
      let str = [];
      for (let p in obj)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      return str.join("&");
    }],
    data: params
  })
};

//获取ERP数据
export const postErpApiData = (params) => {
  return fetch({
    url: config.erpApiURL,
    method: 'POST',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
      // 'crossDomain': true,
      // 'X-Requested-With': 'XMLHttpRequest'
    },
    //发送请求前，将request payload转换成form data
    transformRequest: [function (obj) {
      let str = [];
      for (let p in obj)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      return str.join("&");
    }],
    data: params
  })
};

//登陆与获取版本
export const loginApi = (apiName, params) => {
  return fetchLogin({
    url: apiName,
    method: 'POST',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
      // 'crossDomain': true,
      // 'X-Requested-With': 'XMLHttpRequest'
    },
    //发送请求前，将request payload转换成form data
    transformRequest: [function (obj) {
      let str = [];
      for (let p in obj)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      return str.join("&");
    }],
    data: params
  })
};
//退出登陆
export const loginOutApi = (apiName) => {
  return fetchLogin({
    url: apiName,
    method: 'get',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
      // 'crossDomain': true,
      // 'X-Requested-With': 'XMLHttpRequest'
    }
  })
};


//微信登陆
export const weChatloginApi = (apiName, params) => {
  return weChatFetchLogin({
    url: apiName,
    method: 'POST',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
      // 'crossDomain': true,
      // 'X-Requested-With': 'XMLHttpRequest'
    },
    //发送请求前，将request payload转换成form data
    transformRequest: [function (obj) {
      let str = [];
      for (let p in obj)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      return str.join("&");
    }],
    data: params
  })
};
