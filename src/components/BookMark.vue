<template>
  <div class='fixed-layout' >
    <div class="book-mark" id="title-top">
      <div class="title" v-if="!isLogin">
        您还未登录，请<span class="login-word" @click="login">登录</span>后查看书签
      </div>
      <div class="title" v-else>
        所有书签,一共{{bookMarkCount}}个
      </div>
      <!--书签内容区域-->
      <div v-if="isLogin">
          <!--加载中gif-->
          <div class="is-loading" v-if="isBookMarkLoading">
            <img src="./../assets/svg/loading-spinning-bubbles.svg">
          </div>
          <div class="book-mark-content clearfix">
            <!--每一行标签数是响应式变化的-->
            <!--如果登录了才显示-->
              <div class="mark-wrap" v-for="(item,index) in bookMarkList">
                <!--书签标题-->
                <div class="mark-title" :title="item.title">
                  <span class="title-favicon"
                        :style="{background:'url('+item.faviconUrl + ') center center no-repeat',
                                  backgroundSize:'24px 24px'}"
                  >
                  </span>
                  {{item.title}}
                </div>
                <!--书签截图-->
                <div class="mark-screen-shot"
                     :style="{background:'url(static/bookMarkImages/'+item.screenShotName + ') center center no-repeat',
                            backgroundSize:'cover'}"
                     @click="jumpToNewPage(item.url)"
                >
                </div>
                <!--书签分类-->
                <div class="mark-type clearfix">
                    <ul>
                      <li v-for="(itemType,index) in item.type" >{{itemType.label}}</li>
                    </ul>
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
          <!--滚动加载多页，当该div距离视口底部距离小于0时触发加载事件-->
          <!--<div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">-->
          <!--</div>-->
          <!--用于让底部和内容隔开一定距离-->
          <div class="bottom-padding">
          </div>
          <!--返回顶部-->
          <a class="to-top" @click="goTop()">
          </a>
      </div>

    </div>
  </div>
</template>

<script>
    import {eventBus} from './../eventBus'
    import axios from 'axios'
    export default {
        name: 'book-mark',
        data(){
            return{
                bookMarkList:[],
                //书签页是否正在加载
                isBookMarkLoading:false,
                //滚动加载是否禁用
                busy:false,
                //当前页数,默认第一页
                pageIndex:1,
                //每一页书签容量
                pageSize:18,
                //书签总数
                bookMarkTotalNum:0

            }
        },
        mounted(){
        	//书签需要加载更多
          eventBus.$on('BOOKMARK_LOAD_MORE',()=>{
            //禁止再去滚动加载,true为禁止，false为恢复,第二个参数是是否显示loading图案
            //emit可以传递参数列表，依次写在后面即可
            eventBus.$emit('BOOKMARK_SCROLL_STATE',true,true);
            setTimeout(() => {
              this.pageIndex++;
              this.getBookMarkList();
            }, 1000);
          });
        	//如果登录就从后台拿到书签信息
          if(this.isLogin){
          	this.getBookMarkList();
          }
        },
        computed:{
        	//用户是否登录
        	isLogin(){
            return this.$store.getters.getUserName;
          },
          //书签数
          bookMarkCount(){
        		return this.bookMarkTotalNum;
          }
        },
        watch: {
          // 如果路由有变化，会再次执行该方法
          '$route': 'fetchData'
        },
        methods:{
        	  fetchData(){
        	  	console.log('fetch data')
            },
        	  //页面跳转
            jumpToNewPage(url){
            	window.open(url)
            },
            //回到页面顶端
            goTop:function(){
                //如果用锚点的话会对路由有影响，不能用
                document.querySelector('.right-content').scrollTop = 0;
            },
            //登录
            login(){
            	//弹出登录框,在header组件里接收该事件，然后弹出登录框
              eventBus.$emit('pop-login-dialog');
            },
            //获取书签列表
            getBookMarkList(){
            	//这里要添加加载中动画
              this.isBookMarkLoading = true;
              var param ={
              	pageSize:this.pageSize,
                pageIndex:this.pageIndex
              }
              //get发送参数要有key：params
              axios.get('/user/getBookMarkList',{params:param}).then((response)=>{
                  this.isBookMarkLoading = false;
                  eventBus.$emit('BOOKMARK_SCROLL_STATE',false,true);
                  let status = response.data.status;
                  if(status === 1){
                    this.bookMarkList = this.bookMarkList.concat(response.data.bookMarkList);
                    this.bookMarkTotalNum = response.data.bookMarkTotalNum;
                    //如果是最后一页了额，禁用滚动插件，很重要
                    if(response.data.bookMarkList.length < this.pageSize){
                      eventBus.$emit('BOOKMARK_SCROLL_STATE',true,false);
                    }
                  	var listLength = this.bookMarkList.length;
                    if(listLength > 0){
                      //this.bookMarkList = response.data.bookMarkList;
                    }else{
                    	//书签为空
                      eventBus.$emit('empty-bookmarklist');
                    }
                  //请求失败
                  }else{
                    eventBus.$emit('bookmarklist-request-failed');
                  }
              })
            }


        }
    }
</script>

<style scoped lang="less" type="text/less">
  .fixed-layout{
    //position: fixed;
    height:100%;
    // fixed状态下：100% - 320px
    width:~'calc(100%)';
    overflow-y: auto;
  }

  .book-mark{
    width:80%;
    margin: 10px auto;
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
    .is-loading{
      height:400px;
      width:400px;
      margin: 200px auto;
      text-align: center;
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
    height:auto;
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
    .title-favicon{
      display: inline-block;
      height:24px;
      width:24px;
      float:left;
      margin-right: 5px;
      background-size: 24px 24px;
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
    font-size: 14px;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    padding:8px;
    line-height: 24px;
    color: #7c7c7c;
    cursor: pointer;
    //单行文本溢出省略号
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .mark-screen-shot{
    height:175px;
    border-bottom: 1px solid #cbcbcb;
    cursor: pointer;
  }
  .mark-type{
    height:auto;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    padding: 0 10px 5px 10px;
    li{
      float:left;
      margin-right: 10px;
      margin-top: 6px;
      height:20px;
      background-color: #e3e3e3;
      color: #888888;
      font-size: 11px;
      padding:1px 6px;
      line-height: 20px;
      border-radius: 5px;
      overflow: hidden;
    }
  }
  //登录字体样式
  .login-word{
    color:#409eff;
    &:hover{
      cursor:pointer;
    }
  }
  .anchor{
    @anchorHeight:30px;
    height:@anchorHeight;
    line-height: @anchorHeight;
    background-color: #ffffff;
    border-radius: 5px;
    text-align: center;
    color:#8b8b8b;
    width:30%;
    margin: 0 auto;
  }
  .anchor-show{
    display: none;
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
