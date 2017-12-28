/**
 * Created by Administrator on 2017/12/28.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
//用户模块
import user from './modules/user'

Vue.use(Vuex)

export default  new Vuex.Store({
  actions,
  getters,
  modules:{
    user
  }
})
