import Vue from 'vue'
import Router from 'vue-router'
//书签
import BookMark from '@/components/BookMark'
import AddBookMark from '@/components/AddBookMark'
import User from  '@/components/User'
import HotBookMark from '@/components/HotBookMark'
import ImportBookMark from '@/components/ImportBookMark'
import Default from '@/components/Default'
//双色球
import Lottery from '@/components/lottery/Lottery'
import SmartChoose from '@/components/lottery/SmartChoose'
import LotteryHistory from '@/components/lottery/LotteryHistory'
import LotteryPrizeRule from '@/components/lottery/LotteryPrizeRule'
//百度地图
import BaiduMap from '@/components/map/BaiduMap'
import BaiduMapHouseRenting from '@/components/map/BaiduMapHouseRenting'
//网易云音乐
import Music from '@/components/music/Music'
import HotMusicAnalysis from '@/components/music/HotMusicAnalysis'
//个人主页
import MyPage from '@/components/mypage/MyPage'

Vue.use(Router)

const router =  new Router({
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
    //百度地图路由，负责地图业务
    {
      path:'/baidumap',
      component:BaiduMap,
      children:[
        {
          path:'houseRenting',
          component:BaiduMapHouseRenting
        }
      ]
    },
    //网易云音乐路由,负责音乐歌词分析
    {
      path:'/music',
      component:Music,
      children:[
        {
          path:'hotMusicAnalysis',
          component:HotMusicAnalysis
        }
      ]

    },
    //个人主页
    {
      path:'/myPage',
      component:MyPage,
      //需要登录
      meta:{
        requireAuth:true
      }
    },
    //根路径
    {
      path:'/',
      component:Default
    }
  ]
})

router.beforeEach((to,from,next)=>{
  //如果需要登录
  if(to.meta.requireAuth){
    //验证是否登录,直接从router里获得vuex状态
    if(router.app.$options.store.getters.getUserName){
      next();
    }else{
      //next带参数表示跳转到另外的地址，进行新的导航
      //返回首页
      next({
        path: '/',
        query: {redirect: to.fullPath}
      })
    }
  }else{
    next();
  }
});

export default router
