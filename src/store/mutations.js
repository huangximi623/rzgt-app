import {
  LOG_IN,
  LOG_OUT
} from './mutations-type.js'

import {
  setStorage,
  getStorage
} from '../config/util'

export default {
  [LOG_IN] (state) {
    let password = setStorage('password')
    if (password) {
      state.password = JSON.parse(password)
    }
  },
  [LOG_OUT] (state) {
    let initCart = getStorage('password')
    if (initCart) {
      state.cartList = JSON.parse(initCart)
    }
  }
}
