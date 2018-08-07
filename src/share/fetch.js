import axios from 'axios'
import config from '../config/config.json'
import Vue from 'vue';
import router from '../router'
import interfaceData from '../service/interfaceData.js'

export function fetch(options) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      timeout: config.requestTimeOut, // 超时
      baseURL: config.baseURL
    })
    instance(options)
      .then(response => {
        const res = response.data;
        if (res.code === '0') {
          resolve(res.result)
        } else if (res.code === '-2') {//登陆超时，自动跳转至登陆页
          new Vue().hideIndicator();
          new Vue().showToast(res.desc);
          router.push({path: '/login'});
        } else {
          new Vue().hideIndicator();
          new Vue().showToast(res.desc);
        }
      })
      .catch(error => {
        //请求超时，隐藏加载提示，并弹出提示框
        new Vue().hideIndicator();
        new Vue().showAlert("数据加载失败！请检查网络是否异常！");
        reject(error)
      })
  })
}

//客户端登陆
export function fetchLogin(options) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      timeout: config.requestTimeOut, // 超时
      baseURL: config.baseURL
    })
    instance(options)
      .then(response => {
        const res = response.data;
        if (res.code === '0' || res.code === '1') {
          resolve(res.result);
          if (options.url !== interfaceData.versionApi) {//不显示获取版本的提示
            new Vue().showToast(res.desc);
          }
        } else {
          new Vue().hideIndicator();
          new Vue().showToast(res.desc);
        }
      })
      .catch(error => {
        //请求超时，隐藏加载提示，并弹出提示框
        new Vue().hideIndicator();
        new Vue().showAlert("数据加载失败！请检查网络是否异常！");
        reject(error)
      })
  })
}
//微信登陆，将code传过去用于判断
export function weChatFetchLogin(options) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      timeout: config.requestTimeOut, // 超时
      baseURL: config.baseURL
    })
    instance(options)
      .then(response => {
        const res = response.data;
        if (res.code === '1' || res.code === '2') {
          resolve(res);
        } else {
          new Vue().hideIndicator();
          new Vue().showToast(res.desc);
        }
      })
      .catch(error => {
        //请求超时，隐藏加载提示，并弹出提示框
        new Vue().hideIndicator();
        new Vue().showAlert("数据加载失败！请检查网络是否异常！");
        reject(error)
      })
  })
}
