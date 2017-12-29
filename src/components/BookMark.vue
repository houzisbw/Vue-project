<template>
    <div class="book-mark" id="title-top">
      <div class="title" v-if="!isLogin">
        您还未登录，请<span class="login-word" @click="login">登录</span>后查看书签
      </div>
      <div class="title" v-else>
        所有书签,一共110个
      </div>
      <!--书签内容区域-->
      <div v-if="isLogin">
          <div class="book-mark-content clearfix">
            <!--每一行标签数是响应式变化的-->
            <!--如果登录了才显示-->
              <div class="mark-wrap" v-for="i in markNum">
                <!--书签标题-->
                <div class="mark-title">
                </div>
              </div>
              <!--空div，用于让flex最后一行左对齐，原理就是占位置,宽度和mark-wrap一样,个数要为每行最多数-1-->
              <div class="flex-padding">
              </div>
              <div class="flex-padding">
              </div>
              <div class="flex-padding">
              </div>
              <div class="flex-padding">
              </div>
              <div class="flex-padding">
              </div>
              <div class="flex-padding">
              </div>
          </div>
          <!--用于让底部和内容隔开一定距离-->
          <div class="bottom-padding">
          </div>
          <!--返回顶部-->
          <a class="to-top" @click="goTop()">
          </a>
      </div>
    </div>
</template>

<script>
    import {eventBus} from './../eventBus'
    export default {
        name: 'book-mark',
        data(){
            return{
                markNum:39,

            }
        },
        mounted(){
        	//如果登录就从后台拿到书签信息
          if(this.isLogin){
          	console.log('login')
          }
        },
        computed:{
        	//用户是否登录
        	isLogin(){
            return this.$store.getters.getUserName;
          }
        },
        methods:{
            //回到页面顶端
            goTop:function(){
                //是right-content外层的scrollTop,如果用锚点的话会对路由有影响，不能用
                document.querySelector('.right-content').scrollTop = 0;
            },
            //登录
            login(){
            	//弹出登录框,在header组件里接收该事件，然后弹出登录框
              eventBus.$emit('pop-login-dialog');
            }

        }
    }
</script>

<style scoped lang="less" type="text/less">
  .book-mark{
    width:80%;
    margin: 0 auto;
    .title{
      width:100%;
      height:40px;
      border-radius: 5px;
      background-color: #fff;
      box-shadow: 0 0 5px 2px #d3d3d3;
      text-align: center;
      line-height: 40px;
      color:#898989;
      //防止过度压缩
      min-width: 200px;
    }
    .book-mark-content{
      margin-top: 20px;
      min-width: 200px;
      //使用flex布局，很方便自适应,目的是让最后一个书签没有右侧margin，而且可以自适应
      //方法:给div后面添加一些空div，宽度要和前面的一样，
      display: flex;
      display: -webkit-flex;
      justify-content: space-between;
      flex-direction: row;
      //换行
      flex-wrap:wrap;
    }
  }
  //占位布局,让书签最后一行左对齐
  .flex-padding{
    height:0;
    float:left;
    width:@markWidth;
  }
  @markWidth:15%;
  @markHeight:250px;
  @markNumEachLine:6;
  .mark-wrap{
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    width:@markWidth;
    height:@markHeight;
    background-color: #fff;
    float:left;
    margin-bottom: 20px;
    border-radius: 8px;
    box-shadow: 0 0 5px 2px #d3d3d3;
    position: relative;
    //这里也要写top才有用
    top:0;
    transition: all .5s ease;
    &:hover{
      top:-10px;
      box-shadow: 0 0 10px 5px #b5b5b5;
    }
  }
  .bottom-padding{
    height:100px;
    width:100%;
  }
  .to-top{
    cursor: pointer;
    display: inline-block;
    width:50px;
    height:50px;
    border-radius: 5px;
    box-shadow: 0 0 5px 2px #d3d3d3;
    position: fixed;
    right:50px;
    bottom:40px;
    background: url('./../assets/icon/toTop.png') center center #fff no-repeat;
    background-size: 40px 40px;
  }
  .mark-title{
    height:40px;
    border-bottom: 1px solid #cbcbcb;
  }
  //登录字体样式
  .login-word{
    color:#409eff;
    &:hover{
      cursor:pointer;
    }
  }

  //响应式，媒体查询
  @media  (max-width:1400px){
    .mark-wrap,.flex-padding{
      width:22% ;
    }
  }
  @media  (max-width:1100px){
    .mark-wrap,.flex-padding{
      width:30% ;
    }
  }
  @media  (max-width:800px){
    .mark-wrap,.flex-padding{
      width:100% ;
    }
  }

</style>
