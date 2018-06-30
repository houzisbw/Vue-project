//已通过cdn引入，现在去掉import
//import Vue from 'vue'
//import Router from 'vue-router'
//书签
import AddBookMark from '@/components/AddBookMark'
import User from  '@/components/User'
//异步组件，路由懒加载
const BookMark = resolve => require(['@/components/BookMark'],resolve);
const HotBookMark = resolve => require(['@/components/HotBookMark'],resolve);
const ImportBookMark = resolve => require(['@/components/ImportBookMark'],resolve);
const Default = resolve => require(['@/components/Default'],resolve);
//双色球
const Lottery = resolve => require(['@/components/lottery/Lottery'],resolve);
const SmartChoose = resolve => require(['@/components/lottery/SmartChoose'],resolve);
const LotteryHistory = resolve => require(['@/components/lottery/LotteryHistory'],resolve);
const LotteryPrizeRule = resolve => require(['@/components/lottery/LotteryPrizeRule'],resolve);
//百度地图
const BaiduMap = resolve => require(['@/components/map/BaiduMap'],resolve);
const BaiduMapHouseRenting = resolve => require(['@/components/map/BaiduMapHouseRenting'],resolve);
//网易云音乐
const Music = resolve => require(['@/components/music/Music'],resolve);
const HotMusicAnalysis = resolve => require(['@/components/music/HotMusicAnalysis'],resolve);
//个人主页
const MyPage = resolve => require(['@/components/mypage/MyPage'],resolve);


Vue.use(VueRouter)
const router =  new VueRouter({
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
      //命名路由
      name:'myPage',
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
