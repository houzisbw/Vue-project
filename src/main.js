// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
//导入vuex状态管理器
import store from './store'
//无限滚动差价你
import infiniteScroll from  'vue-infinite-scroll'

Vue.config.productionTip = false
Vue.use(infiniteScroll)

//引入css
import './assets/css/reset.css'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
