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
              <img :src="'static/bookMarkImages/'+titleScreenShotName" v-if="titleScreenShotName !== ''">
            </div>
          </div>
        </div>
        <!--分类-->
        <div class="line-wrap clearfix">
          <div class="line-wrap-left">
            <span>*&nbsp;&nbsp;</span>书签分类
          </div>
          <div class="line-wrap-right">
            <multi-chooser :selections="multiChooserData" v-on:on-change="paramChange('typeChosenData',$event)"></multi-chooser>
          </div>
        </div>
        <!--是否公开书签连接-->
        <div class="line-wrap clearfix margin-top-fix padding-bottom-fix">
          <div class="line-wrap-left">
            <span>*&nbsp;&nbsp;</span>公开书签
          </div>
          <switch-slide  v-on:input-change="isBookMarkOpen" class="switch-slide-margin-top-fix"></switch-slide>
        </div>
        <!--添加按钮-->
        <div class="line-wrap clearfix margin-top-fix  margin-bottom-fix">
         <div class="add-bookmark-button" :class="{'add-bookmark-button-disable':isAddButtonDisabled}" @click="addBookMark">
           添加
         </div>
        </div>
      </div>
    </div>
</template>

<script>
  import {eventBus} from './../eventBus'
  import axios from 'axios'
  //多选按钮
  import MultiChooser from './MultiChooser'
  //滑动开关，switch是内建名，不能使用
  import SwitchSlide from './basic/Switch'
	export default {
		name: 'addBookMark',
    components:{
      MultiChooser,
      SwitchSlide
    },
    data(){
			return {
				  //提交按钮是否禁用
          isAddButtonDisabled:false,
				  //是否公开连接
          isBookMarkPublic:true,
          //网页相关
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
          //网页截图名称
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
            }
          ],
          //多选按钮选中的数据
          typeChosenData:[]
      }
    },
    computed:{
    	isLogin(){
    		return this.$store.getters.getUserName;
      }
    },
    watch:{

    },
    mounted:function(){
    	eventBus.$on('checkNewTypeExist',(type)=>{
    		  var isExist = false;
    		  for(var i=0;i<this.multiChooserData.length;i++){
    		  	if(this.multiChooserData[i].label === type){
    		  		isExist = true;
    		  		break;
            }
          }
          if(type === '' || type.length >=10){
    		  	isExist = true;
          }

          //如果不合法
          if(isExist){
            eventBus.$emit('bookMarkNewTypeInvalid');
          //如果合法
          }else{
            //eventBus.$emit('bookMarkNewTypeValid');
            var value = this.multiChooserData.length;
            this.multiChooserData.push({
              label:type,
              value:value+1
            })
            //关闭对话框
            eventBus.$emit('closeBookMarkAddDialog');
          }
      })
    },
    methods:{
    	paramChange(attr,val){
    		this[attr] = val;
      },
    	//添加书签
      addBookMark(){
    		//首先判断用户登录状态,如果登录过期直接退出

      	//如果网页书签标题加载完成
      	if(!this.isAddButtonDisabled){
          //检查必填项是否填写完成,url必须符合正则校验，标题必须不为空，书签分类必须选择
          var regExp = /^https?:\/\/\w+\.\w+/;
          if(!regExp.exec(this.pageUrl)){
              //弹框提示
              eventBus.$emit('bookMarkInfoInvalid','书签链接填写非法，请重新填写!');
              return;
          }
          if(!this.pageTitle){
              //弹框提示
              eventBus.$emit('bookMarkInfoInvalid','标题不能为空，请重新填写!');
              return;
          }
          if(this.typeChosenData.length === 0){
              //弹框提示
              eventBus.$emit('bookMarkInfoInvalid','请选择至少一项书签分类!');
              return;
          }
          //禁用提交按钮
          this.isAddButtonDisabled = true;
          //传给后端的参数
          var param = {
          	pageUrl:this.pageUrl,
            pageTitle:this.pageTitle,
            markType:this.typeChosenData,
            isPublic:this.isBookMarkPublic,
            //截图名字
            pageScreenName:this.titleScreenShotName
          }
          //发送请求保存书签
          axios.post('/user/saveBookMark',param).then((response)=>{
              //恢复提交按钮
              this.isAddButtonDisabled = false;
              let status = response.data.status;
              if(status === 2){
              	  //保存成功
                  eventBus.$emit('bookMarkSaveState',2)
              }else if(status === 1){
              	  //书签重复
                  eventBus.$emit('bookMarkSaveState',1)
              }else if(status === -1){
              	  //保存失败
                  eventBus.$emit('bookMarkSaveState',-1)
              }
          })

        }
      },
    	//是否公开链接
      isBookMarkOpen(isOpen){
        this.isBookMarkPublic = isOpen;
      },
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
            //keyup时就要禁用提交按钮
            this.isAddButtonDisabled = true;
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
                this.isAddButtonDisabled = false;
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
  .padding-bottom-fix{
    padding-bottom: 20px;
  }
  .margin-top-fix{
    margin-top: -20px;
  }
  .margin-bottom-fix{
    margin-bottom: 0!important;
    border-top:1px solid #b5b5b5;
  }
  .switch-slide-margin-top-fix{
    margin-top: 15px;
  }

  .book-mark{
    width:80%;
    margin: 10px  auto 80px auto;
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
        .add-bookmark-button{
          height:40px;
          background-color: #21BA45;
          cursor: pointer;
          border-radius: 5px;
          width:80px;
          float:right;
          margin-top: 30px;
          margin-bottom: 0;
          line-height: 40px;
          text-align: center;
          color:#fff;
          font-size: 18px;
          transition: all .5s;
          &:hover{
            background-color: #06ba3d;
          }
        }
        .add-bookmark-button-disable{
          opacity: 0.7;
          cursor: not-allowed;
        }
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
            height:350px;
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
