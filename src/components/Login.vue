<template>
    <div>
      <!--遮罩,z-index:1000-->
      <!--注意：遮罩和对话框必须同级，才不会出现无动画问题,否则外层遮罩瞬间消失，内层动画播放了也看不到-->
      <transition name="overlay-fade">
        <div class="overlay" v-if="loginShow">
        </div>
      </transition>
      <!--对话框-->
      <transition name="myslide1">
        <div v-if="loginShow" class="dialog" >
          <!--关闭按钮-->
          <div class="close" @click="closeDialog">
          </div>
          <!--标题-->
          <div class="title">
            <!--利用before,after伪元素添加横线修饰-->
            <h1 class="title-word">登录</h1>
          </div>
          <!--内容-->
          <div class="content">
            <div class="login-wrap clearfix">
              <div class="username-wrap">
                <input type="text"
                       id="login-username"
                       placeholder="用户名"
                       v-model="username"
                       @keyup="cancelUsernameNotice"
                       spellcheck="false"
                >
                <div class="username-notice" v-show="usernameEmpty">
                  请填写用户名
                  <div class="username-outer-triangle">
                  </div>
                  <div class="username-inner-triangle">
                  </div>
                </div>
              </div>
              <div class="username-wrap">
                <input type="password"
                       id="login-password"
                       placeholder="密码"
                       v-model="password"
                       @keyup="cancelPasswordNotice"
                       @keyup.enter = "login"
                >
                <div class="username-notice" v-show="passwordEmpty">
                  {{passwordNotice}}
                  <div class="username-outer-triangle">
                  </div>
                  <div class="username-inner-triangle">
                  </div>
                </div>
              </div>
              <!--30天内自动登录-->
              <input type="checkbox" id="remember" v-model="isAutoLogin">
              <label class="remember-word" for="remember">30天内自动登录</label>
              <!--登录按钮-->
              <button class="login-btn" @click="login" :class="{'login-button-disable':buttonDisabled}">登&nbsp;&nbsp;录</button>
              <!--社交账号登录-->
              <div class="other-login">
                <h4>社交账号登录</h4>
                <ul class="other-login-icon">
                  <li class="weixin"><a href="#" ></a></li>
                  <li class="qq"><a href="#" ></a></li>
                  <li class="weibo"><a href="#" ></a></li>
                  <li class="other"><a href="#" >其他</a></li>
                </ul>
              </div>
            </div>
          </div>
          <!--确认取消还是确定-->
          <div class="confirm">
          </div>
        </div>
      </transition>
    </div>
</template>

<script>
  import axios from 'axios'
  import {eventBus} from './../eventBus'
	export default {
		name: 'myLogin',
    props:{
        loginShow:{
        	type:Boolean,
          default:false
        }
    },
    data(){
			return {
        //登录中按钮禁用
        buttonDisabled:false,
        usernameEmpty:false,
        passwordEmpty:false,
        //用户名和密码
        username:'',
        password:'',
        //密码提示信息
        passwordNotice:'',
        //是否自动登录
        isAutoLogin:true

      }
    },
    methods:{
			closeDialog(){
				//清空所有信息
        this.usernameEmpty = false;
        this.passwordEmpty = false;
        this.username = '';
        this.password = '';
				this.$emit('on-close');
      },
      //登录处理
      login(){

          if(this.buttonDisabled){
            return;
          }
          //检查用户名密码是否为空
          if(this.username === ''){
          	this.usernameEmpty = true;
          	return;
          }
          if(this.password === ''){
          	this.passwordNotice = '请填写密码';
            this.passwordEmpty = true;
            return;
          }
          this.buttonDisabled = true;
          //要发送的数据
          let param = {
          	username:this.username,
            password:this.password,
            isAutoLogin:this.isAutoLogin
          };
          axios.post('/user/login',param).then((resp)=>{
              let status = resp.data.status;
              this.buttonDisabled = false;
              //用户未注册,弹出对话框提示用户注册
              if(status === 0){
              	  //注意这里的顺序很重要，如果调换顺序，则弹不出对话框
                  this.$emit('on-close');
                  eventBus.$emit('userDoseNotRegister');
              //密码错误
              }else if(status === 2){
                  //如果密码错误,提示用户
                  this.passwordEmpty = true;
                  this.passwordNotice = '密码错误!';
              //登录成功
              }else if(status === 1){
                  //改变vuex的状态
                  this.$store.commit('updateUserName',resp.data.username);
                  this.$store.commit('updateUserProfile',resp.data.profileImgUrl);
                  this.$emit('on-close');
                  //页面刷新
                  this.$router.go({path:this.$route.path})
              }
          })
      },
      cancelUsernameNotice(){
      	this.usernameEmpty = false;
      },
      cancelPasswordNotice(){
        this.passwordEmpty = false;
      }
    }


	}
</script>

<style type="text/less" lang="less" scoped>
  //遮罩
  @overlayIndex:1000;
  .overlay {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    //注意，opacity的话子元素会继承父元素的透明度，坑
    background-color: rgba(0, 0, 0, 0.6);
    z-index: @overlayIndex;

  }
  @closeSize: 30px;
  @closePosOffset: 10px;
  .close {
    position: absolute;
    right: @closePosOffset;
    top: @closePosOffset;
    width: @closeSize;
    height: @closeSize;
    background: url('./../assets/icon/close.png');
    background-size: @closeSize @closeSize;
    transition: transform .5s ease;
    cursor: pointer;
    &:hover {
      transform: rotate(90deg);
    }
  }
  @titleHeight: 60px;
  //禁用登录按钮
  .login-button-disable{
    opacity: 0.5;
    cursor:not-allowed !important;
  }
  .title {
    height: @titleHeight;
    line-height: @titleHeight;
    color: #898989;
    font-family: "Microsoft YaHei";
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    .title-word{
      color: #ea6f5a;
    }
    //高级用法:文字中间的线
    .title-word:before,.title-word:after{
      content:'';
      display: block;
      border-top:1px solid #ea6f5a;
      position:absolute;
      top:30px;
      width:20%;
    }
    .title-word:before{
      left:23%;
    }
    .title-word:after{
      right:23%;
    }
  }
  .content {
    min-height: 120px;
    padding: 20px 20px;
    font-family: "Microsoft YaHei";
    .login-wrap{
      width:70%;
      margin: 0 auto;
      #login-username,#login-password{
        width:100%;
        box-sizing:border-box;
        -webkit-box-sizing: border-box;
        height:50px;
        padding:5px 10px 5px 40px;
      }
      #login-username{
        border:1px solid #c8c8c8;
        border-radius: 4px 4px 0 0 ;
        background: url('./../assets/icon/login-name.png') 3% center no-repeat;
        background-size: 25px 25px;
        background-color: rgba(236, 236, 236, 0.6);
      }
      #login-password{
        border:1px solid #c8c8c8;
        border-top:none;
        border-radius: 0 0 4px 4px ;
        background: url('./../assets/icon/login-password.png') 3% center no-repeat;
        background-size: 25px 25px;
        background-color: rgba(236, 236, 236, 0.6);
        margin-bottom: 10px;
      }
      #remember{
        margin: 15px 3px 0 0;
        width:15px;
        height:15px;

      }
      .username-wrap{
        position: relative;
        @noticeHeight:35px;
        .username-notice{
          transition: all .5s;
          position: absolute;
          height: @noticeHeight;
          line-height: @noticeHeight;
          color:#333;
          font-size: 12px;
          padding-left:40px;
          width:100px;
          background: url('./../assets/icon/info-warning.png') 8% center no-repeat;
          background-color: #fff;
          background-size: 20px 20px;
          right:-50%;
          top:5px;
          border:1px solid #ea6f5a;
          border-radius: 4px;
          @outerBorderWidth:7px;
          .username-outer-triangle{
            position: absolute;
            width:0;
            height:0;
            left:-15px;
            top:11px;
            border-right:@outerBorderWidth solid #ea6f5a;
            border-left:@outerBorderWidth solid transparent;
            border-top:@outerBorderWidth solid transparent;
            border-bottom:@outerBorderWidth solid transparent;
          }
          .username-inner-triangle{
            position: absolute;
            width:0;
            height:0;
            left:-13px;
            top:11px;
            border-right:@outerBorderWidth solid #ffffff;
            border-left:@outerBorderWidth solid transparent;
            border-top:@outerBorderWidth solid transparent;
            border-bottom:@outerBorderWidth solid transparent;
          }
        }
      }
      .remember-word{
        font-size: 14px;
        color: #949494;
        position: relative;
        top:-2px;
        cursor: pointer;

      }
      .login-btn{
        display:block;
        margin-top: 20px;
        width:100%;
        outline: none;
        border:none;
        height:40px;
        border-radius: 20px;
        color:#fff;
        font-size: 20px;
        background-color: #ea6f5a;
        cursor: pointer;
        &:hover{
          background-color: #ff6f5a;
        }
      }
      .other-login{
        height:100px;
        text-align: center;
        width:80%;
        margin: 20px auto 0 auto;
        h4{
          color:#cbcbcb;
          font-size: 12px;
          font-family: "Microsoft YaHei";
        }
        //使用flex实现均匀分布
        .other-login-icon{
          display: flex;
          display: -webkit-flex;
          flex-direction: row;
          justify-content: space-between;
          margin-top: 20px;
          @iconSize:50px;
          li{
            width:@iconSize;
            height:@iconSize;
            border-radius: @iconSize / 2;
            a{
              display: inline-block;
              width:100%;
              height:100%;
              cursor: pointer;
            }
          }
          .weixin{
            background: url('./../assets/icon/weixin.png') center center no-repeat #00bb29;
            background-size: 30px 30px;
          }
          .weibo{
            background: url('./../assets/icon/weibo.png') center center no-repeat #e05244;
            background-size: 30px 30px;
          }
          .qq{
            background: url('./../assets/icon/qq.png') center center no-repeat #498ad5;
            background-size: 27px 27px;
          }
          .other{
            background-color: #dbdbdb;
            line-height: @iconSize;
            font-size: 12px;
            a{
              color:#8b8b8b;
            }
          }

        }

      }
    }
  }

  .dialog {
    width: 30%;
    min-width: 500px;
    background-color: #fff;
    border-radius: 10px;
    z-index: @overlayIndex + 1;
    position: absolute;
    left: 50%;
    top: 50%;
    opacity: 1;
    //初始位置
    transform: translate(-50%, -50%);
    box-shadow: 0 0 8px 2px #474747;
  }
  //动画过渡,为啥关闭对话框无动画，真的醉了
  .myslide1-enter{
    //注意这里不能写成-100px，因为这是绝对值，不是相对于原来运动,所以要在原来的基础上加
    transform: translate(-50%,-60%);
    opacity: 0;
  }
  .myslide1-leave-to{
    //注意这里不能写成-100px，因为这是绝对值，不是相对于原来运动,所以要在原来的基础上加
    transform: translate(-50%,-60%);
    opacity: 0;
  }
  .myslide1-leave,.myslide1-enter-to{
    transform: translate(-50%,-50%);
    opacity: 1;
  }
  .myslide1-enter-active{
    transition: all .5s ease;
  }
  .myslide1-leave-active{
    transition: all .5s ease;
  }

  //遮罩动画
  .overlay-fade-enter,.overlay-fade-leave-to{
    opacity: 0;
  }
  .overlay-fade-enter-active,.overlay-fade-leave-active{
    transition: all .5s ease;
  }


</style>
