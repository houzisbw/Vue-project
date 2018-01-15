import Vue from 'vue'
import Router from 'vue-router'
import BookMark from '@/components/BookMark'
import AddBookMark from '@/components/AddBookMark'
import User from  '@/components/User'
import HotBookMark from '@/components/HotBookMark'
import ImportBookMark from '@/components/ImportBookMark'
import Default from '@/components/Default'
import Lottery from '@/components/lottery/Lottery'
import SmartChoose from '@/components/lottery/SmartChoose'
import LotteryHistory from '@/components/lottery/LotteryHistory'
import LotteryPrizeRule from '@/components/lottery/LotteryPrizeRule'

Vue.use(Router)

export default new Router({
  routes: [
    //user路由，里面子路由,这里User单独是一个组件，里面放置<router-view>，用于存放子组件
    {
      path:'/user',
      component:User,
      children:[
        {
          path:'showbookmark',
          component:BookMark
        },
        {
          path:'addbookmark',
          component:AddBookMark
        },
        {
          path:'hotbookmark',
          component:HotBookMark
        },
        {
          path:'importbookmark',
          component:ImportBookMark
        }
      ]
    },
    //lottery路由，负责双色球
    {
      path:'/lottery',
      component:Lottery,
      children:[
        {
          path:'smartChooseLottery',
          component:SmartChoose
        },
        {
          path:'lotteryHistorySearch',
          component:LotteryHistory
        },
        {
          path:'lotteryPrizeRule',
          component:LotteryPrizeRule
        }
      ]
    },
    //根路径
    {
      path:'/',
      component:Default
    }
  ]
})
