<!--Header组件-->
<template>
  <div>
      <div class="banner">
        <a href="#"><img src="./../assets/icon/banner-logo.png"></a>
        <span class="banner-word"><img src="./../assets/icon/banner-word.png"></span>
        <ul class="banner-ul">
          <li><a href="#" @click="showLogin">登录</a></li>
          <!--这里点击注册要弹出框，并初始化验证码，得调用注册组件的方法-->
          <li><a href="#" @click="showRegister">注册</a></li>
        </ul>
        <input type="text" class="banner-input" placeholder="组件名字">
      </div>
      <!--对话框模态框,遮罩也在里面-->
      <modal-dialog v-on:on-close="closeDialog"
                    v-show="isDialogClose"
                    :title="modalDialogTitle"
                    :content="modalDialogContent">
      </modal-dialog>
      <!--注册模态框-->
      <register-dialog :regShow="isRegisterClose"
                       v-on:on-close="closeDialog">
      </register-dialog>
      <!--登录模态框-->
      <login-dialog></login-dialog>




  </div>
</template>

<script>
    import ModalDialog from '@/components/ModalDialog'
    import RegisterDialog from '@/components/Register'
    import LoginDialog from '@/components/Login'
    //引入通信中转站
    import {eventBus} from './../eventBus'
    export default {
        //这里命名不要和built-in的tag名相同
        name: 'headerComp',
        components:{
          ModalDialog,
          RegisterDialog,
          LoginDialog
        },
        data(){
            return {
                //对话框关闭与否
                isDialogClose:false,
                isRegisterClose:false,
                isLoginClose:false,
                //对话框标题,根据需要动态改变
                modalDialogTitle:'',
                modalDialogContent:'',
                modalDialogType:0
            }
        },
        methods:{
            //关闭所有对话框
            closeDialog(){
                this.isDialogClose = false;
                this.isRegisterClose = false;
                this.isLoginClose = false;
            },
            //弹出注册对话框
            showRegister(){
                this.isRegisterClose = true;
                //触发注册组件的方法,参数不是组件的方法名，而是和接收方法名相同即可
                eventBus.$emit('initVerifyCode');
            },
            //弹出注册对话框
            showLogin(){
               this.isLoginClose = true;
            }

        },
        mounted:function(){
        	//用户注册成功,非父子组件的通信,可以使用一个空的 Vue 实例作为事件总线,写在eventBus.js里面
          //注意这里的this必须用箭头函数才能成功，否则作用域不是VUE实例
        	eventBus.$on('userSaveSuccessful',()=>{
            //用户保存成功，弹出提示框
        		this.isDialogClose = true;
        		//提示框信息
            this.modalDialogTitle = '注册成功';
            this.modalDialogContent = '恭喜~您已经注册成功，点击确定进入登录页面!';
            this.modalDialogType = 1;

          })
        }
    }
</script>

<style scoped lang="less" type="text/less">
  @bannerHeight:40px;
  @bannerBgColor:#fff;
  @bannerMinWidth:800px;
  //banner样式
  .banner{
    z-index:100;
    min-width: @bannerMinWidth;
    height:@bannerHeight;
    padding:10px 40px;
    box-shadow: 0 0 4px rgba(0,0,0,0.25);
    width:100%;
    background-color: @bannerBgColor;
    position: fixed;
    left:0;
    top:0;
    @logoSize:@bannerHeight+15;
    a{
      float:left;
      img{
        width:@logoSize + 15;
        height:@logoSize;
        position: relative;
        top:-6px;
      }
    }
    .banner-word{
      img{
         width:100px;
         height:@bannerHeight;
      }
    }
    .banner-ul{
      float:right;
      margin-right: 100px;
      line-height: @bannerHeight;
      li{
        float:right;
        //最好不要设置li的宽度，只设置padding，这样自适应
        padding:0 10px;
        height:@bannerHeight;
        &:hover{
          border-bottom: 4px solid #65bcf7;
        }
        a{
          color:#34495e;
        }
      }
    }
    .banner-input{
      float:right;
      margin-right: 20px;
      margin-top: 4px;
      width:150px;
      border:1px solid #e3e3e3;
      height:30px;
      line-height: 30px;
      border-radius: 15px;
      //设置input的padding来限制内容输入区域
      padding:0 20px 0 40px;
      background: url('./../assets/icon/banner-search.png') 5% center no-repeat;
      background-size:20px 20px;
      transition: all 0.5s;
      &:focus{
        border-color: #98c2f3;
        width:200px;
      }
    }

  }

  //动画过渡
  .slide-enter,.slide-leave-to{
    //注意这里不能写成-100px，因为这是绝对值，不是相对于原来运动,所以要在原来的基础上加
    transform: translate(-50%,-60%);
    opacity: 0;
  }
  .slide-enter-active,.slide-leave-active{
    transition: all .5s ease;
  }
  .slide-enter-to,.slide-leave{
    opacity: 1;
    transform: translate(-50%,-50%);
  }

</style>
