import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'

Vue.use(Vuex)

const state = {
  login: true, // 是否登录
  viewDirection: '', // 视图方向
  g_contact: [],//存放当前节点与所有父亲节点的数据
  g_title: [],//存放当前节点所有父组织名称
}

export default new Vuex.Store({
  state,
  mutations
})
