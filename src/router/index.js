import Vue from 'vue'
import Router from 'vue-router'
import BookMark from '@/components/BookMark'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/book',
      component:BookMark
    }
  ]
})
