<!--个人信息-->
<template>
    <div class="info-wrap">
      <div class="info-line-wrap">
        <label class="info-label">昵称:</label>
        <input type="text" class="nickname" placeholder="你的昵称" spellcheck="false" v-model.trim="nickname">
      </div>
      <div class="info-line-wrap">
        <label class="info-label">用户名:</label>
        <span>{{username}}</span>
      </div>
      <div class="info-line-wrap">
        <label class="info-label signature">我的签名:</label>
        <textarea cols="60" rows="8" placeholder="请输入签名~" spellcheck="false" v-model.trim="signature"></textarea>
      </div>
      <!--保存按钮-->
      <div class="save">
        <button class="save-button" @click="saveInfo">保存</button>
      </div>
    </div>
</template>

<script>
  import {eventBus} from './../../eventBus'
  import axios from 'axios'
	export default {
		name: 'myPageInfo',
    data(){
			return{
        nickname:'',
        signature:''
      }
    },
    mounted(){
    	//获取用户昵称和签名
      axios.get('/user/getUserInfo').then((resp)=>{
      	if(resp.data.status === 1){
      		this.nickname = resp.data.nickname;
      		this.signature = resp.data.signature;
        }
      })
    },
    computed:{
    	username(){
    		return this.$store.getters.getUserName;
      }
    },
    methods:{
    	saveInfo(){
    		//检查昵称和签名是否合法,注意这里不能用this.nickname === '',因为有可能是undefined，
        if(!this.nickname || this.nickname.length>10){
          eventBus.$emit('CONFIRM_DIALOG','昵称长度不合法~请重新输入');
          return;
        }
        if(!this.signature || this.signature.length>20){
          eventBus.$emit('CONFIRM_DIALOG','签名长度不合法~请重新输入');
          return;
        }
        axios.post('/user/saveUserInfo',{nickname:this.nickname,signature:this.signature}).then((resp)=>{
        	if(resp.data.status === 1){
            eventBus.$emit('CONFIRM_DIALOG','个人信息修改成功！');
            eventBus.$emit('MODIFY_GREETING_WORD');
          }
        })
      }
    }
	}
</script>

<style lang="less" type="text/less" scoped>
  .info-wrap{
    width:80%;
    margin: 40px auto;
    height:200px;
    .info-line-wrap{
      min-height:30px;
      line-height: 30px;
      margin-bottom: 22px;
      span{
        color:#898989;
        font-size: 14px;
      }
      .nickname{
        height:26px;
        padding:0 10px;
        border:1px solid #cbcbcb;
        border-radius: 5px;
        transition: all .5s;
        &:focus{
          border-color:#409eff;
        }
      }
      .info-label{
        width:100px;
        display: inline-block;
        text-align: right;
        font-size: 14px;
        color:#48576a;
        margin-right: 20px;
      }
      textarea{
        border:1px solid #cbcbcb;
        border-radius: 5px;
        padding: 10px;
        //禁止缩放
        resize: none;
        transition: all .5s;
        &:focus{
          border-color:#409eff;
        }
      }
      .signature{
        /*顶部对齐*/
        vertical-align: top;
      }

    }
    .save{
      margin-top: 100px;
      .save-button{
        display: block;
        margin: 0 auto;
        width:100px;
        height:40px;
        border-radius: 5px;
        color:#fff;
        font-size: 15px;
        outline: none;
        border: none;
        cursor: pointer;
        background-color: #20a0ff;
      }
    }
  }

  :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: #bbbbbb; opacity:1;
  }

  ::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: #bbbbbb;opacity:1;
  }

  input:-ms-input-placeholder,textarea:-ms-input-placeholder{
    color: #bbbbbb;opacity:1;
  }

  input::-webkit-input-placeholder,textarea::-webkit-input-placeholder{
    color: #bbbbbb;opacity:1;
  }
</style>
