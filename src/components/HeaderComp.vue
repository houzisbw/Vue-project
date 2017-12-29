<!--Header组件-->
<template>
  <div>
      <div class="banner">
        <a href="#"><img src="./../assets/icon/banner-logo.png"></a>
        <span class="banner-word"><img src="./../assets/icon/banner-word.png"></span>
        <ul class="banner-ul">
          <li v-if="!userNickName" class="li-hover"><a href="#" @click="showLogin">登录</a></li>
          <li v-if="userNickName" class="user-graph-li">
            <a class="user-graph">
              <span class="user-profile"><img src="./../assets/icon/info-warning.png"></span>
              <!--登录成功后的用户选项(个人信息，退出等)-->
              <div class="user-options">
                <ul>
                  <li v-for="(item,index) in userProfile"
                      class="user-profile-wrap"
                      :style="{backgroundImage:'url(' +item.iconPath + ')'}"
                      @click="eventHandler(item.eventName)">
                    {{item.name}}
                  </li>
                </ul>
              </div>
            </a>
          </li>
          <!--这里点击注册要弹出框，并初始化验证码，得调用注册组件的方法-->
          <li v-if="!userNickName" class="li-hover"><a href="#" @click="showRegister">注册</a></li>
        </ul>
        <input type="text" class="banner-input" placeholder="组件名字">
      </div>
      <!--对话框模态框,遮罩也在里面-->
      <!--注意，不同的点击事件是在组件外部进行确定，内部只需触发一个点击方法即可-->
      <modal-dialog v-on:on-close="closeDialog"
                    v-on:on-confirm="modalOnConfirm"
                    :modalShow="isDialogClose"
                    :title="modalDialogTitle"
                    :content="modalDialogContent">
      </modal-dialog>
      <!--注册模态框-->
      <register-dialog :regShow="isRegisterClose"
                       v-on:on-close="closeDialog">
      </register-dialog>
      <!--登录模态框-->
      <login-dialog :loginShow="isLoginClose"
                    v-on:on-close="closeDialog">
      </login-dialog>

  </div>
</template>

<script>
    import ModalDialog from '@/components/ModalDialog'
    import RegisterDialog from '@/components/Register'
    import LoginDialog from '@/components/Login'
    //引入通信中转站
    import {eventBus} from './../eventBus'
    import axios from 'axios'
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
                modalDialogType:0,
                //对话框事件名
                eventName:'',
                //用户个人信息
                userProfile:[
                  {
                  	eventName:'myInfoPage',
                  	url:'/',
                    name:'我的主页',
                    //注意必须require才行
                    iconPath:require('./../assets/icon/user-profile-graph.png')
                  },
                  {
                    eventName:'myInfoPage',
                    url:'/',
                    name:'我的主页',
                    iconPath:require('./../assets/icon/user-profile-graph.png')
                  },
                  {
                    eventName:'myInfoPage',
                    url:'/',
                    name:'我的主页',
                    iconPath:require('./../assets/icon/user-profile-graph.png')
                  },
                  {
                    eventName:'logout',
                    url:'/',
                    name:'退出',
                    iconPath:require('./../assets/icon/user-profile-exit.png')
                  }
                ]
            }
        },
        //计算属性
        computed:{
          userNickName:function(){
            //这里模块里getters的方法会被注册为全局，不用加模块名字了
            return this.$store.getters.getUserName;
          }
        },
        methods:{
        	  //用户下拉列表的点击事件处理函数
            eventHandler:function(eventName){
            	  switch(eventName){
            	  	//退出登录
                  case 'logout':
                  {
                  	this.logout();
                  	break;
                  }
                  case 'myInfoPage':{
                  	break;
                  }
                  default:
                  	break;
                }
            },
            getCookie(name) {
              var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
              if (arr = document.cookie.match(reg))
                return (arr[2]);
              else
                return null;
            },
            //退出登录
            logout(){
            	axios.post('user/logout').then((resp)=>{
                let res = resp.data;
                //清除成功
                if(res.status === 1){
                  this.$store.commit('updateUserName','');
                }
              })
            },
        	  //检查是否登录，该方法在mounted阶段调用，也就是刷新页面时
            //后台查看是否存在cookie，若存在返回已经登录状态码
            checkLogin(){
            	  //首先直接检查浏览器cookie是否存在，如果发送后台验证则会有短暂的闪烁
                var username = this.getCookie('username');
            	  if(username){
                  this.$store.commit('updateUserName',username);
                }
                axios.get('user/checkLogin').then((resp)=>{
                    let status = resp.data.status,
                        username = resp.data.username;
                    //如果没有登录
                    if(status !== 1){
                        //设置vuex中用户名为空，达到退出登录的目的
                        this.$store.commit('updateUserName','');
                    }
                })
            },
        	  //对话框点击确定后触发该事件，根据事件类型来触发不同事件
            modalOnConfirm(){
            	switch(this.eventName){
            		//跳转到登录界面
                case 'JUMP_TO_LOGIN_DIALOG':
                {
                	//隐藏对话框
                  this.isDialogClose = false;
                  //打开登录框
                  this.isLoginClose = true;
                  break;
                }
                case 'HIDE_SELF_DIALOG':
                {
                  //隐藏对话框
                  this.isDialogClose = false;
                  break;
                }
                case 'JUMP_TO_REG_DIALOG':
                {
                  //隐藏对话框
                  this.isDialogClose = false;
                  this.isRegisterClose = true;
                  break;
                }
                default:
                	break;
              }
            },
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
            //弹出登录对话框
            showLogin(){
               this.isLoginClose = true;
            },
            //弹出对话框方法，内容方法自定义,eventName是事件方法名
            //type:1是确定，2是确认取消,后续扩展
            popDialog(title,content,type,eventName){
              //用户保存成功，弹出提示框
              this.isDialogClose = true;
              //提示框信息
              this.modalDialogTitle = title;
              this.modalDialogContent = content;
              this.modalDialogType = type;
              this.eventName = eventName;
            }

        },
        mounted:function(){
        	//检查是否登录
          this.checkLogin();
        	//用户注册成功,非父子组件的通信,可以使用一个空的 Vue 实例作为事件总线,写在eventBus.js里面
          //注意这里的this必须用箭头函数才能成功，否则作用域不是VUE实例
        	eventBus.$on('userSaveSuccessful',()=>{
        		this.popDialog('注册成功','恭喜~您已经注册成功，点击确定进入登录页面!',1,'JUMP_TO_LOGIN_DIALOG');
          });
        	//用户注册失败：名字已经被注册
          eventBus.$on('userSaveFailed-alreadyExists',()=>{
            this.popDialog('注册失败','很不巧~您的用户名已经被注册了，请换一个重新注册吧!',1,'HIDE_SELF_DIALOG');
          })
          //用户登录时未注册,点击确定前往注册对话框
          eventBus.$on('userDoseNotRegister',()=>{
            this.popDialog('登录失败','用户名不存在，点击确定前往注册!',1,'JUMP_TO_REG_DIALOG');
          })
          //弹出登录框
          eventBus.$on('pop-login-dialog',()=>{
          	this.showLogin();
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
      .user-graph-li{
        padding-bottom: 10px;
        margin-left: 20px;
      }
      .li-hover:hover{
        border-bottom: 4px solid #65bcf7 !important;
      }
      li{
        float:right;
        //最好不要设置li的宽度，只设置padding，这样自适应
        padding:0 10px;
        height:@bannerHeight;
        transition: all .5s;
        cursor: pointer;
        border-bottom: 4px solid transparent;
        a{
          color:#34495e;
        }
        //用户选项
        .user-graph{
          display: block;
          position: relative;
          //下拉菜单
          @optionWidth:150px;
          .user-options{
            transition: all .5s;
            display: none;
            position: absolute;
            width:@optionWidth;
            //height:300px;
            background-color: #fff;
            box-shadow: 0 2px 10px #b9b9b9;
            left:-50px;
            top:@bannerHeight + 10px;
            //用户信息每一行样式
            .user-profile-wrap{
              //前面float影响了这里的li
              background-repeat: no-repeat;
              background-position: 10% center;
              float:none;
              height:40px;
              padding:10px 0 10px 60px;
              &:hover{
                background-color: #dcdcdc;
              }
            }
          }
          //用户头像,圆形
          .user-profile{
            @profileSize:40px;
            display: inline-block;
            margin: 0 auto;
            width:@profileSize;
            height:@profileSize;
            border-radius: @profileSize / 2;
            background-color: #cdcdcd;
            //隐藏圆圈外的头像
            overflow: hidden;
            img{
              width:100%;
              height:100%;
              top:0;
            }
          }
        }
      }
      //li的hover，注意banner有padding，这样鼠标移到padding上下拉菜单就消失
      //必须将li的padding增加到覆盖banner的padding
      .user-graph-li:hover .user-options{
        display: block;
      }
      .user-graph-li{
        width:100px;
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
