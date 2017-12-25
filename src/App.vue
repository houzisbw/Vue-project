<template>
  <div>
    <!--头部组件-->
    <my-header-comp></my-header-comp>
  </div>
</template>

<script>
//引入头部组件和footer组件
import MyHeaderComp from './components/HeaderComp'
export default {
  name: 'app',
  components:{
    MyHeaderComp
  }
}
</script>

<style scoped>

</style>
