<template>
  <div>
    <!--头部组件-->
    <my-header-comp></my-header-comp>
    <!--侧栏组件-->
    <side-bar></side-bar>
  </div>
</template>

<script>
//引入头部组件
import MyHeaderComp from './components/HeaderComp'
//引入侧栏组件
import SideBar from './components/SideBar'
export default {
  name: 'app',
  components:{
    MyHeaderComp,
    SideBar
  }
}
</script>

<style type="text/css">
  body{
    min-width:800px;
    background-color: #f4f4f4;
  }

</style>
