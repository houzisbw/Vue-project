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
                <!--:class="email === '' ? '' : (isEmailValid ? 'valid-input' : 'invalid-input')"-->
                <!--这里的2个class分别表示填写正确(绿色)，填写错误(红色)，因为初始化的时候(灰色)不能出现这2个class,有3种状态,用status 0,1,2表示-->
                <input  spellcheck="false"
                        type="text"
                        placeholder="请输入邮箱" id="email-input"
                        v-model="email"
                        @keyup="checkEmail"
                        :class="emailStatus === 0 ? '' : (emailStatus === 1 ? 'valid-input' : 'invalid-input')"
                >
                <!--提示文字-->
                <!--<p class=""></p>-->
              </div>
              <!--用户名-->
              <div class="line-wrap clearfix">
                <span class="word-wrap"><span class="required">*</span><span class="line-word">用户名</span></span>
                <!--这里当没有填写时不验证，提交的时候才验证,提交时全部验证一次-->
                <input spellcheck="false"
                       type="text"
                       :class="usernameStatus === 0 ? '' : (usernameStatus === 1 ? 'valid-input' : 'invalid-input')"
                       placeholder="6-16位英文大小写和数字"
                       id="username-input"
                       v-model="username"
                       @keyup="checkUsername"
                >
              </div>
              <!--密码-->
              <div class="line-wrap clearfix">
                <span class="word-wrap"><span class="required">*</span><span class="line-word">密码</span></span>
                <input type="password"
                       placeholder="至少6位，同时包含大小写字母和数字"
                       :class="passwordStatus === 0 ? '' : (passwordStatus === 1 ? 'valid-input' : 'invalid-input')"
                       id="pwd-input" v-model="password"
                       @keyup="checkPassword"
                >
              </div>
              <!--确认密码-->
              <div class="line-wrap clearfix">
                <span class="word-wrap"><span class="required">*</span><span class="line-word">确认密码</span></span>
                <input type="password"
                       placeholder="确认密码"
                       :class="pwdAgainStatus === 0 ? '' : (pwdAgainStatus === 1 ? 'valid-input' : 'invalid-input')"
                       id="pwd-confirm-input"
                       v-model="passwordAgain"
                       @keyup="checkPwdAgain"
                >
              </div>
              <!--验证码-->
              <div class="line-wrap clearfix">
                <span class="word-wrap"><span class="required">*</span><span class="line-word">验证码</span></span>
                <input type="text"
                       placeholder="请输入验证码"
                       class="verify-code"
                       v-model="verifyCode"
                       :class="verifyStatus === 0 ? '' : (verifyStatus === 1 ? 'valid-input' : 'invalid-input')"
                       @keyup="checkVerifyCode"
                >
                <div class="verify-code-box">
                  <!--验证码每位的颜色不同-->
                  <span  :style="{color:colorOne}" v-text="codeDigitOne"></span>
                  <span  :style="{color:colorTwo}" v-text="codeDigitTwo"></span>
                  <span  :style="{color:colorThree}" v-text="codeDigitThree"></span>
                  <span  :style="{color:colorFour}" v-text="codeDigitFour"></span>
                </div>
                <!--刷新按钮-->
                <div class="refresh-code" title="看不清?刷新验证码!" @click="initVerifyCode()">
                </div>
              </div>
            </div>
            <!--确认取消还是确定-->
            <div class="confirm">
              <!--确定取消-->
              <div class="yesno">
                <div class="yesno-yes" @click="checkInfoAndRegister" :class="{'reg-button-disable':buttonDisabled}">
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
    //引入通信中转站
    import {eventBus} from './../eventBus'
    //引入提示框，提示登录成功
    import ModalDialog from './ModalDialog'
    //引入axios
    import axios from 'axios'
    export default {
        name: 'register',
        props: {
          regShow: {
            type: Boolean,
            default:false
          }
        },
        mounted:function(){
            //初始化验证码,每一位随机0-9;
            this.initVerifyCode();
            //监听事件,其他地方触发这个事件
            eventBus.$on('initVerifyCode',()=>{
              this.initVerifyCode();
          })
        },

        data(){
            return {
            	  //提交注册信息后按钮禁用
            	  buttonDisabled:false,
                //3种input状态，对应3个class，0表示初始状态，1正确，2错误
                emailStatus:0,
                usernameStatus:0,
                passwordStatus:0,
                pwdAgainStatus:0,
                verifyStatus:0,

                //邮箱
                email:'',
                //用户名
                username:'',
                //密码
                password:'',
                //重复密码
                passwordAgain:'',
                //验证码
                verifyCode:'',
                //验证码4位
                codeDigitOne:1,
                codeDigitTwo:2,
                codeDigitThree:3,
                codeDigitFour:4,
                //验证码颜色
                colorOne:'#000',
                colorTwo:'#aff',
                colorThree:'#f32d26',
                colorFour:'#286187'
            }
        },
        computed:{

            //验证码是否正确
            isVerifyCodeValid:function(){
                var valideCode = this.codeDigitOne.toString() +
                                 this.codeDigitTwo.toString() +
                                 this.codeDigitThree.toString() +
                                 this.codeDigitFour.toString();
                if(valideCode === this.verifyCode){
                    return true;
                }
                return false;
            },
            //用户名合法
            isUsernameValid:function(){
                //正则表达式
                var usernameReg = /^[a-zA-Z0-9]{6,16}$/;
                if(usernameReg.exec(this.username)) {
                    return true;
                }
                return false;
            },
            //邮箱是否合法
            isEmailValid:function(){
                var emailReg = /^\w+[@]\w+[.][\w]+$/
                if(emailReg.exec(this.email)) {
                  return true;
                }
                return false;
            },
            //密码是否合法,至少6位，至少一个大写字母，小写字母，数字,不能有空格,\S匹配非空白字符
            isPasswordValid:function(){
                var pwdReg = /^\S*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])\S*$/
                if(pwdReg.exec(this.password)) {
                  return true;
                }
                return false;
            },
            //确认密码
            isPasswordAgainSame:function(){
                if(this.password === this.passwordAgain){
                    return true;
                }
                return false;
            }

        },
        methods:{
            //重置所有内容
            resetAllInfo(){
              this.emailStatus = 0;
              this.usernameStatus = 0;
              this.passwordStatus = 0;
              this.pwdAgainStatus = 0;
              this.verifyStatus = 0;

              this.email = '';
              this.username = '';
              this.password = '';
              this.passwordAgain = '';
              this.verifyCode = '';
            },
            closeDialog(){
            	  //所有填写的内容清空
                this.resetAllInfo();
                this.$emit('on-close');
            },
            //初始化验证码，4位数，每一位0-9
            initVerifyCode(){
              this.codeDigitOne = Math.floor(Math.random()*10);
              this.codeDigitTwo = Math.floor(Math.random()*10);
              this.codeDigitThree = Math.floor(Math.random()*10);
              this.codeDigitFour = Math.floor(Math.random()*10);
              //改变颜色
              this.colorOne = this.getRandomColor();
              this.colorTwo = this.getRandomColor();
              this.colorThree = this.getRandomColor();
              this.colorFour = this.getRandomColor();
              //这里也要验证验证码是否正确
              this.checkVerifyCode();
            },
            getRandomColor(){
              var colorArray = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
              return '#'+ colorArray[Math.floor(Math.random()*16)] +
                colorArray[Math.floor(Math.random()*16)]+
                colorArray[Math.floor(Math.random()*16)]+
                colorArray[Math.floor(Math.random()*16)]+
                colorArray[Math.floor(Math.random()*16)]+
                colorArray[Math.floor(Math.random()*16)];
            },
            //注册按钮事件
            checkInfoAndRegister(){
            	  if(this.buttonDisabled){
            	  	return;
                }
                //全部再检查一次,调用计算属性直接this.computedAttr即可
                this.checkEmail();
                //为空也非法
                if(this.email === ''){
                  this.emailStatus  = 2;
                }
                this.checkUsername();
                if(this.username === ''){
                  this.usernameStatus  = 2;
                }
                this.checkPassword();
                if(this.password === ''){
                	this.passwordStatus = 2;
                }
                this.checkPwdAgain();
                if(this.passwordAgain === ''){
                	this.pwdAgainStatus = 2;
                }
                this.checkVerifyCode();
                if(this.verifyCode === ''){
                  this.verifyStatus = 2;
                }

                //判断所有填写是否都正确
                if(this.isEmailValid && this.isUsernameValid &&
                   this.isPasswordValid && this.isPasswordAgainSame && this.isVerifyCodeValid){
                	 //发送给后台进行注册
                   var param = {
                   	  email:this.email,
                      password:this.password,
                      username:this.username
                   };
                   //禁用注册按钮，返回数据后恢复
                   this.buttonDisabled = true;
                   axios.post('/user/register',param).then((resp)=>{
                        this.buttonDisabled = false;
                        //获取后端传来的状态
                        //注意，后端返回的json在resp.data中，而不是resp
                        //所有填写的内容清空
                        this.resetAllInfo();
                        let status = resp.data.status;
                        if(status === -1){
                        	//保存出错
                          this.$emit('on-close');
                          eventBus.$emit('userSaveFailed-error');
                        }else if(status === 0 ){
                        	//用户已经存在
                          this.$emit('on-close');
                        	eventBus.$emit('userSaveFailed-alreadyExists');
                        }else {
                        	//注册成功
                          this.$emit('on-close');
                          eventBus.$emit('userSaveSuccessful');
                        }

                   })
                }

            },
            //keyup事件
            checkEmail(){
                if(this.email === ''){
                    this.emailStatus = 0;
                    return;
                }
                if(this.isEmailValid){
                  this.emailStatus = 1;
                }else{
                  this.emailStatus = 2;
                }
            },
            checkUsername(){
              if(this.username === ''){
                this.usernameStatus = 0;
                return;
              }
              if(this.isUsernameValid){
                this.usernameStatus = 1;
              }else{
                this.usernameStatus = 2;
              }
            },
            checkPassword(){
                if(this.password === ''){
                  this.passwordStatus = 0;
                  return;
                }
                if(this.isPasswordValid){
                  this.passwordStatus = 1;
                }else{
                  this.passwordStatus = 2;
                }
            },
            checkPwdAgain(){
                if(this.passwordAgain === ''){
                  this.pwdAgainStatus = 0;
                  return;
                }
                if(this.isPasswordAgainSame){
                  this.pwdAgainStatus = 1;
                }else{
                  this.pwdAgainStatus = 2;
                }
            },
            checkVerifyCode(){
                if(this.verifyCode === ''){
                  this.verifyStatus = 0;
                  return;
                }
                if(this.isVerifyCodeValid){
                  this.verifyStatus = 1;
                }else{
                  this.verifyStatus = 2;
                }
            }
        }
    }
</script>

<style lang="less" type="text/less" scoped>
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
    //按钮禁用，通过透明度来
    .reg-button-disable{
      opacity: 0.5;
      cursor:not-allowed;
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
      width:67%;
      padding-right:8%;
      float:right;
      transition: border .5s;
      &:focus{
        border:1px solid #409eff;
      }
    }
    .verify-code{
      border-radius: 5px;
      border: 1px solid #cbcbcb;
      height:30px;
      text-indent: 10px;
      margin-left: 4.5%;
      width:30%;
      padding-right:8%;
      float:left;
      transition: border .5s;
      &:focus{
        border:1px solid #409eff;
      }
    }
    .verify-code-box{
      margin-left: 5%;
      width:20%;
      height:33px;
      background-color: #a6a6a6;
      float:left;
      border-radius: 5px;
      text-align: center;
    }
    .refresh-code{
      @codeSize:30px;
      width:@codeSize;
      height:30px;
      //border: 1px solid #cbcbcb;
      float:right;
      border-radius: 5px;
      background: url('./../assets/icon/refresh.png') center center no-repeat;
      background-size:@codeSize @codeSize ;
      cursor: pointer;
    }
    //表单填写正确错误的图片
    .valid-input{
      background: url('./../assets/icon/right.png') 98% center no-repeat;
      background-size:20px 20px;
      //不加important则优先级不够高，不会起作用
      border:1px solid #12c212 !important;
    }
    .invalid-input{
      background: url('./../assets/icon/wrong.png') 98% center no-repeat;
      background-size:20px 20px;
      border:1px solid #e21b10 !important;
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
