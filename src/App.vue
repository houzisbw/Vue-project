<template>
  <div>
    <!--头部组件-->
    <my-header-comp></my-header-comp>
    <!--侧栏组件-->
    <div>
      <div class="left-content">
        <side-bar></side-bar>
      </div>
      <div class="right-content" >
        <router-view ></router-view>
        <!--滚动加载多页，当该div距离视口底部距离小于0时触发加载事件-->
        <div v-infinite-scroll="loadMore"  infinite-scroll-disabled="busy" infinite-scroll-distance="10" class="loading-div">
          <img src="./assets/svg/loading-spinning-bubbles-small.svg" v-show="loading" class="loading-img">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//引入头部组件
import MyHeaderComp from './components/HeaderComp'
//引入侧栏组件
import SideBar from './components/SideBar'
//书签组件
import BookMark from './components/BookMark'
import {eventBus} from './eventBus'
export default {
  name: 'app',
  components:{
    MyHeaderComp,
    SideBar,
    BookMark
  },
  data(){
  	return {
  		busy:false,
      loading:false
    }
  },
  mounted:function(){
    eventBus.$on('BOOKMARK_SCROLL_STATE',(state,isLoadingShow)=>{
    	console.log(state);
    	this.busy = state;
    	this.loading = isLoadingShow;
    });
  },
  methods:{
    loadMore(){
    	//路由位于书签页面 且 登录状态
      if(this.$route.path === '/user/showbookmark' && this.$store.getters.getUserName){
        eventBus.$emit('BOOKMARK_LOAD_MORE');
      }
    }
  }
}
</script>

<style type="text/css">
  body{
    min-width:800px;
    background-color: #f4f4f4;
  }
  html,body{
  }
  /*让右侧背景不变，里面内容滚动的做法，fixed定位，height高度100%,子div设置overflow-y:auto*/
  .right-content{
    margin-left: 300px;
    margin-top:60px;
    position: fixed;
    height:calc(100% - 20px);
    width:calc(100% - 320px);
    background: url('./assets/bg/bodyBg.png');
    /*auto只在需要的时候出现滚动轴，scroll则是一直有滚动轴*/
    overflow-y: auto;
    padding:20px 0 20px 20px;
  }
  .left-content{
    float:left;
  }
  .loading-div{
    text-align: center;
    position: relative;
  }
  .loading-img{
    position: absolute;
    left:50%;
    top:-120px;
    transform:translateX(-50%);
  }

</style>
