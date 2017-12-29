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
                   placeholder="如果网页地址正确，网站会自动解析书签标题"
                   spellcheck="false"
                   v-model="pageTitle"
                   :disabled="isTitleInputDisable"
                   :class="{'is-loading':isLoading}"
            >
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import {eventBus} from './../eventBus'
  import axios from 'axios'
	export default {
		name: 'addBookMark',
    data(){
			return {
          pageUrl:'',
          pageTitle:'',
          //标题输入框是否禁用
          isTitleInputDisable:false,
          //加载时的input类
          isLoading:false
      }
    },
    computed:{
    	isLogin(){
    		return this.$store.getters.getUserName;
      }
    },
    methods:{
    	//弹出登录对话框
    	login(){
    		eventBus.$emit('pop-login-dialog');
      },
      //keyup时检测网页url
      checkPageUrl(){
    		//正则检验如果符合 http://xxxx.a 这种形式才会触发标题检测
        //注意是以这个形式开头，结尾任意
        var regExp = /^https?:\/\/\w+\.\w+/;
        if(regExp.exec(this.pageUrl)){
        	  //禁用网页标题输入框
            this.isTitleInputDisable = true;
            this.isLoading = true;
            //发送请求
            axios.post('/phantom/getTitle',{url:this.pageUrl}).then((resp)=>{
              //启用网页标题输入框
              this.isLoading = false;
              this.isTitleInputDisable = false;
            	let title = resp.data.pageTitle;
            	//如果标题存在
              if(title){
                  this.pageTitle = title;
              }else{

              }
            })
        }else{
            console.log('invalid')
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
      height:400px;
      border-radius: 5px;
      background-color: #fff;
      box-shadow: 0 0 5px 2px #d3d3d3;
      padding:30px;
      .line-wrap{
        width:100%;
        height:40px;
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
