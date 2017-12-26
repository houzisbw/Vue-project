<!--注册组件-->
<template>
    <div>
      <!--遮罩,z-index:1000-->
      <div class="overlay" v-show="regShow" >
        <!--对话框-->
        <transition name="myslide">
          <div class="dialog" v-if="regShow" >
            <!--关闭按钮-->
            <div class="close" @click="closeDialog">
            </div>
            <!--标题-->
            <div class="title">
              注册用户
            </div>
            <!--内容-->
            <div class="content">
              <!--邮箱-->
              <div class="line-wrap clearfix">
                <span class="word-wrap"><span class="required">*</span><span class="line-word">邮箱</span></span>
                <input type="text" placeholder="请输入邮箱" id="email-input">
              </div>
              <!--用户名-->
              <div class="line-wrap clearfix">
                <span class="word-wrap"><span class="required">*</span><span class="line-word">用户名</span></span>
                <input type="text" placeholder="请输入用户名" id="username-input">
              </div>
              <!--密码-->
              <div class="line-wrap clearfix">
                <span class="word-wrap"><span class="required">*</span><span class="line-word">密码</span></span>
                <input type="password" placeholder="请输入密码" id="pwd-input">
              </div>
              <!--确认密码-->
              <div class="line-wrap clearfix">
                <span class="word-wrap"><span class="required">*</span><span class="line-word">确认密码</span></span>
                <input type="password" placeholder="确认密码" id="pwd-confirm-input">
              </div>
            </div>
            <!--确认取消还是确定-->
            <div class="confirm">
              <!--确定取消-->
              <div class="yesno">
                <div class="yesno-yes">
                  注册
                </div>
                <div class="yesno-no" @click="closeDialog">
                  取消
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
</template>

<script>
    export default {
        name: 'register',
        props: {
          regShow: {
            type: Boolean,
            default:false
          }
        },

        methods:{
            closeDialog(){
                this.$emit('on-close');
            }
        }
    }
</script>

<style lang="less" type="text/less">
  //遮罩
  @overlayIndex:1000;
  .overlay{
    position: fixed;
    left:0;
    top:0;
    right:0;
    bottom:0;
    //注意，opacity的话子元素会继承父元素的透明度，坑
    background-color: rgba(0,0,0,0.6);
    z-index:@overlayIndex;
    @closeSize:30px;
    @closePosOffset:10px;
    .close{
      position: absolute;
      right:@closePosOffset;
      top:@closePosOffset;
      width:@closeSize;
      height:@closeSize;
      background: url('./../assets/icon/close.png');
      background-size: @closeSize @closeSize;
      transition:transform .5s ease;
      cursor:pointer;
      &:hover{
        transform: rotate(90deg);
      }
    }
    @titleHeight:60px;
    .title{
      height:@titleHeight;
      border-bottom: 1px solid #cbcbcb;
      line-height: @titleHeight;
      color:#898989;
      font-family: "Microsoft YaHei";
      padding-left: 20px;
      font-size: 18px;
      font-weight: bold;
    }
    .content{
      min-height:120px;
      padding:40px 20px;
      font-family: "Microsoft YaHei";
    }
    .confirm{
      height:@titleHeight;
      border-top:1px solid #cbcbcb;
    }
    .yes,.yesno-yes{
      font-family: "Microsoft YaHei";
      width:80px;
      height:40px;
      background-color: #409eff;
      border-radius: 5px;
      float:right;
      margin-right: 15px;
      cursor: pointer;
      margin-top: 10px;
      color:#fff;
      line-height: 40px;
      text-align: center;
    }
    .yesno-no{
      font-family: "Microsoft YaHei";
      box-sizing: border-box;
      width:80px;
      height:40px;
      border-radius: 5px;
      background-color: #fff;
      float:right;
      margin-right: 15px;
      cursor: pointer;
      margin-top: 10px;
      line-height: 40px;
      text-align: center;
      color: #878787;
      border:1px solid #bebebe;
    }
    .required{
      color: #f32d26;
      position: relative;
      top:2px;
      margin-right: 10px;
    }
    .word-wrap{
      width:20%;
      float:left
    }
    .line-wrap{
      margin-bottom: 20px;
      height:30px;
      line-height: 30px;
    }
    #email-input,#username-input,#pwd-input,#pwd-confirm-input{
      border-radius: 5px;
      border: 1px solid #cbcbcb;
      height:30px;
      text-indent: 10px;
      margin-left: 4%;
      width:75%;
      float:right;
      transition: all .5s;
      &:focus{
        border:1px solid #409eff;
      }
    }
  }
  .dialog{
    width:30%;
    min-width: 500px;
    background-color: #fff;
    border-radius: 10px;
    z-index: @overlayIndex + 1;
    position: fixed;
    left:50%;
    top:50%;
    //初始位置
    transform: translate(-50%,-50%);
    opacity: 1;
    box-shadow: 0 0 8px 2px #474747;
  }
  //动画过渡,为啥关闭对话框无动画，真的醉了
  .myslide-enter{
    //注意这里不能写成-100px，因为这是绝对值，不是相对于原来运动,所以要在原来的基础上加
    transform: translate(-50%,-60%);
    opacity: 0;
  }
  .myslide-leave-to{
    //注意这里不能写成-100px，因为这是绝对值，不是相对于原来运动,所以要在原来的基础上加
    transform: translate(-50%,-60%);
    opacity: 0;
  }
  .myslide-leave,.myslide-enter-to{
    transform: translate(-50%,-50%);
    opacity: 1;
  }
  .myslide-enter-active{
    transition: all .5s ease;
  }
  .myslide-leave-active{
    transition: all .5s ease;
  }



</style>
