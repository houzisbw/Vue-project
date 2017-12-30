<!--添加书签组件-->
<template>
    <div class="book-mark">
      <div class="title" v-if="!isLogin">
        您还未登录，请<span class="login-word" @click="login">登录</span>后添加书签
      </div>
      <div class="title" v-else>
        添加书签
      </div>
      <!--添加书签具体内容部分-->
      <div class="content" v-if="isLogin">
        <div class="line-wrap clearfix">
          <div class="line-wrap-left">
            <span>*&nbsp;&nbsp;</span>书签链接
          </div>
          <div class="line-wrap-right">
            <input type="text"
                   id="mark-link"
                   placeholder="输入粘贴网页地址,如http://www.baidu.com"
                   @keyup="checkPageUrl"
                   v-model="pageUrl"
                   spellcheck="false"
            >
          </div>
        </div>
        <div class="line-wrap clearfix">
          <div class="line-wrap-left">
            <span>*&nbsp;&nbsp;</span>书签标题
          </div>
          <div class="line-wrap-right">
            <input type="text"
                   id="mark-title"
                   :placeholder="titlePlaceholder"
                   spellcheck="false"
                   v-model="pageTitle"
                   @keyup="titleKeyup"
                   :disabled="isTitleInputDisable"
                   :class="{'is-loading':isLoading,'fetch-title-failed':isFail}"
            >
          </div>
        </div>
        <!--图片-->
        <div class="line-wrap clearfix">
          <div class="line-wrap-left">
            <span>*&nbsp;&nbsp;</span>网站截屏
          </div>
          <div class="line-wrap-right">
            <div class="title-screen-shot-wrap" :class="{'title-screen-shot-isloading':isTitleScreenShotLoading}">
              <span :class="{'title-screen-shot-word':isTitleScreenShotLoading}" >网站会自动截屏并显示</span>
              <img :src="'static/bookMarkImages/'+titleScreenShotName" >
            </div>
          </div>
        </div>
        <!--分类-->
        <div class="line-wrap clearfix">
          <div class="line-wrap-left">
            <span>*&nbsp;&nbsp;</span>书签分类(多选)
          </div>
          <div class="line-wrap-right">
            <multi-chooser :selections="multiChooserData"></multi-chooser>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import {eventBus} from './../eventBus'
  import axios from 'axios'
  import MultiChooser from './MultiChooser'
	export default {
		name: 'addBookMark',
    components:{
      MultiChooser
    },
    data(){
			return {
          pageUrl:'',
          pageTitle:'',
          //标题输入框是否禁用
          isTitleInputDisable:false,
          //加载时的input类
          isLoading:false,
          //获取标签失败
          isFail:false,
          //placeholder
          titlePlaceholder:'如果输入网页地址正确，网站会自动解析标题',
          //名称
          titleScreenShotName:'',
          //控制网页图片加载时样式显示与否
          isTitleScreenShotLoading:false,
          //settimeout的id
          timerId:null,
          //多选按钮的数据
          multiChooserData:[
            {
            	label:'常用',
              value:0
            },
            {
              label:'收藏',
              value:1
            },
            {
              label:'妹妹的',
              value:2
            },
            {
              label:'NBA篮球世界',
              value:3
            }
          ]
      }
    },
    computed:{
    	isLogin(){
    		return this.$store.getters.getUserName;
      }
    },
    watch:{

    },
    methods:{
    	//弹出登录对话框
    	login(){
    		eventBus.$emit('pop-login-dialog');
      },
      //检测标题input
      titleKeyup(){
    		if(this.pageTitle === ''){
    			this.isFail = true;
        }else{
          this.isFail = false;
        }
      },
      //keyup时检测网页url,注意这里要延时执行，最多一秒一次，防止频繁发送服务端请求
      checkPageUrl(){
      	//频繁输入直接取消执行
      	if(this.timerId){
      		clearTimeout(this.timerId);
        }
    		//正则检验如果符合 http://xxxx.a 这种形式才会触发标题检测
        //注意是以这个形式开头，结尾任意
        var regExp = /^https?:\/\/\w+\.\w+/;
        if(regExp.exec(this.pageUrl)){
            //发送请求
            this.timerId = setTimeout(()=>{
            	//console.log('send req');
              //禁用网页标题输入框
              this.isTitleInputDisable = true;
              this.isLoading = true;
              this.isTitleScreenShotLoading = true;
              this.titleScreenShotName = '';
              axios.post('/phantom/getTitle',{url:this.pageUrl}).then((resp)=>{
                //启用网页标题输入框
                this.isLoading = false;
                this.isTitleInputDisable = false;
                this.isTitleScreenShotLoading = false;
                let title = resp.data.pageTitle;
                //如果标题存在
                if(title){
                  this.isFail = false;
                  this.pageTitle = title;
                  this.titlePlaceholder = '如果输入网页地址正确，网站会自动解析标题'
                  //展示网页截图
                  //console.log('网页截图名:'+resp.data.pageScreenShotName)
                  this.titleScreenShotName = resp.data.pageScreenShotName;
                  //标题不存在或者获取错误
                }else{
                  this.isFail = true;
                  this.pageTitle = '';
                  this.titlePlaceholder = '获取标题失败，请手动输入'
                  this.titleScreenShotName = ''
                }
              })
            },1000);

        }else{
            //console.log('invalid')
        }
      },
      //检测网页标题
      getPageTitle(){

      }
    }
	}
</script>

<style type="text/less" lang="less" scoped>
  .book-mark{
    width:80%;
    margin: 10px  auto 0 auto;
    @minWidth:400px;
    .title{
      width:100%;
      //防止过度压缩
      min-width: @minWidth;
      height:40px;
      border-radius: 5px;
      background-color: #fff;
      box-shadow: 0 0 5px 2px #d3d3d3;
      text-align: center;
      line-height: 40px;
      color:#898989;
      .login-word{
        color:#409eff;
        &:hover{
          cursor:pointer;
        }
      }
    }
    .content{
      box-sizing: border-box;
      -webkit-box-sizing: border-box;
      -moz-box-sizing:border-box;
      width:100%;
      min-width: @minWidth;
      margin-top: 30px;
      border-radius: 5px;
      background-color: #fff;
      box-shadow: 0 0 5px 2px #d3d3d3;
      padding:30px;
      .line-wrap{
        width:100%;
        min-height:40px;
        margin-bottom: 20px;
        .line-wrap-left{
          width:15%;
          min-width: 100px;
          height:40px;
          float:left;
          line-height: 40px;
          font-size: 15px;
          font-family: "Microsoft YaHei";
          span{
            font-size: 20px;
            color:#ff1810;
            position: relative;
            top:5px;
          }
        }
        .line-wrap-right{
          width:84%;
          height:100%;
          float:left;
          .is-loading{
            background: url('./../assets/icon/loading-title.gif') 95% center no-repeat;
            background-color: #eeeeee;
          }
          .fetch-title-failed{
            //这里加important是为了让focus的状态不生效
            border:1px solid #e05244!important;
             background-color: #ffd2ca;
            ::-webkit-input-placeholder { /* WebKit browsers */
              color: #ff807b!important;
            }
            :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
              color: #ff807b!important;
            }
            ::-moz-placeholder { /* Mozilla Firefox 19+ */
              color: #ff807b!important;
            }
            :-ms-input-placeholder { /* Internet Explorer 10+ */
              color: #ff807b!important;
            }
          }
          input{
            box-sizing: border-box;
            -webkit-box-sizing: border-box;
            -moz-box-sizing:border-box;
            float:left;
            height:40px;
            margin-top: 4px;
            padding:5px 20px;
            border-radius: 5px;
            border:1px solid  rgba(34,36,38,.15);
            width:100%;
            transition: all .5s;
            &:focus{
              border-color: #66aeff;
            }
          }
          .title-screen-shot-isloading{
            background: url('./../assets/icon/pic-loading.gif') center center no-repeat;
          }
          .title-screen-shot-wrap{
            position: relative;
            width:300px;
            height:400px;
            border: 1px dashed #CDCDCD;
            margin-top: 15px;
            text-align: center;
            line-height: 400px;
            color: #aaaaaa;
            font-size: 15px;
            font-family: "Microsoft YaHei";
            //图片出来后会覆盖文字
            img{
              position: absolute;
              left:0;
              top:0;
            }
            .title-screen-shot-word{
              display: none;
            }
          }
        }

      }
    }

    ::-webkit-input-placeholder { /* WebKit browsers */
      color:    #999;
    }
    :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
      color:    #999;
    }
    ::-moz-placeholder { /* Mozilla Firefox 19+ */
      color:    #999;
    }
    :-ms-input-placeholder { /* Internet Explorer 10+ */
      color:    #999;
    }

    //媒体查询
    @media all and (max-width:1200px){
      .line-wrap-right{
        width:100% !important;
      }
    }
  }
</style>
