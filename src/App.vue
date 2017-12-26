<template>
  <div>
    <!--头部组件-->
    <my-header-comp></my-header-comp>
    <!--侧栏组件-->
    <div>
      <div class="left-content">
        <side-bar></side-bar>
      </div>
      <div class="right-content">
        <router-view ></router-view>
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
export default {
  name: 'app',
  components:{
    MyHeaderComp,
    SideBar,
    BookMark
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
    width:calc(100% - 340px);
    background: url('./assets/bg/bodyBg.png');
    /*auto只在需要的时候出现滚动轴，scroll则是一直有滚动轴*/
    overflow-y: auto;
    padding:20px;
  }
  .left-content{
    float:left;
  }

</style>
