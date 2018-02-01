<!--热门书签-->
<template>
    <div class="fixed-layout">
      <div class="book-mark" id="title-top">
        <div class="title" >
          <img src="./../assets/icon/cup.png">收藏数前10的书签~
        </div>
        <!--加载中gif-->
        <div class="is-loading" v-if="isBookMarkLoading">
          <img src="./../assets/svg/loading-spinning-bubbles.svg">
        </div>
        <!--卡片展示-->
        <div class="book-mark-content clearfix">
            <!--每一行标签数是响应式变化的-->
            <!--如果登录了才显示-->
            <div class="mark-wrap" v-for="(item,index) in bookMarkList" :class="index === 0 ? 'first-border':(index === 1?'second-border':(index===2?'third-border':''))">
              <!--书签标题-->
              <div class="mark-title" :title="item.title" >
                  <span class="title-favicon"
                        :style="{background:'url('+item.faviconUrl + ') center center no-repeat',
                                  backgroundSize:'24px 24px'}"
                  >
                  </span>
                <span :class="index === 0?'first-color':(index===1?'second-color':(index===2?'third-color':''))">{{item.title}}</span>
              </div>
              <!--书签截图-->
              <div class="mark-screen-shot"
                   :style="{background:'url(static/bookmarkImages/'+item.screenShotName + ') center center no-repeat',
                            backgroundSize:'cover'}"
                   @click="jumpToNewPage(item.url)"
              >
              </div>
              <!--收藏次数-->
              <div class="keepped-times">
                收藏数:&nbsp;&nbsp;<span :class="index === 0 ? 'first-keepped':(index === 1 ? 'second-keepped':(index === 2?'third-keepped':'')) ">{{item.num}}</span>
              </div>
              <!--第一二三名的奖章icon-->
              <div class="medal" :class="index === 0 ? 'medal-first':(index === 1?'medal-second':(index===2?'medal-third':''))">
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
        <!--用于让底部和内容隔开一定距离-->
        <div class="bottom-padding">
        </div>
        <!--返回顶部-->
        <a class="to-top" @click="goTop()" >
        </a>
      </div>
    </div>
</template>

<script>
  import {eventBus} from './../eventBus'
  import axios from 'axios'
	export default {
		name: 'hotBookMark',
    data(){
			return {
        isBookMarkLoading:false,
        bookMarkList:[]
      }
    },
    methods:{
      jumpToNewPage(url){
      	window.open(url);
      },
      goTop(){
        //如果用锚点的话会对路由有影响，不能用
        document.querySelector('.right-content').scrollTop = 0;
      },
      //获取热门书签
      getHotBookMarkList(){
        this.isBookMarkLoading = true;
        axios.get('/user/hotbookmark').then((response)=>{
        	  let status = response.data.status;
            this.isBookMarkLoading = false;
            //请求成功
            if(status === 1){
              this.bookMarkList = response.data.bookMarkList;
            }else{

            }
        })
      }
    },
    mounted:function(){
    	//禁用无限滚动插件
      eventBus.$emit('BOOKMARK_SCROLL_STATE',true,false)
      //获取书签
      this.getHotBookMarkList();
    }

	}
</script>

<style scoped lang="less" type="text/less">
  .fixed-layout{
    height:100%;
    // fixed状态下：100% - 320px
    width:~'calc(100%)';
    overflow-y: auto;
    overflow-x: hidden;
  }
  .book-mark{
    width:80%;
    margin: 10px auto;
    @titleHeight:40px;
    .title{
      position: relative;
      box-sizing: border-box;
      -moz-box-sizing: border-box;
      -webkit-box-sizing: border-box;
      width:100%;
      min-width: 340px;
      height:@titleHeight;
      border-radius: 5px;
      padding: 0 0 0 20px;
      box-shadow: 0 0 5px 2px #d3d3d3;
      text-align: center;
      line-height: 40px;
      color:#898989;
      background-color: #fff;
      img{
        position: absolute;
        left:-5px;
        top:0;
        width:37px;
        height:37px;
        transform: rotate(-30deg);
      }
      //background: url('./../assets/icon/cup.png') 10px center no-repeat #fff;
    }
    .book-mark-content{
      margin-top: 30px;
      min-width: 200px;
      //使用flex布局，很方便自适应,目的是让最后一个书签没有右侧margin，而且可以自适应
      //方法:给div后面添加一些空div，宽度要和前面的一样，
      display: flex;
      display: -webkit-flex;
      justify-content: space-between;
      flex-direction: row;
      //换行
      flex-wrap:wrap;
      .medal{
        position: absolute;
        left:-20px;
        top:-20px;
        width:50px;
        height:50px;
      }
      .medal-first{
        background: url('./../assets/icon/keepped-first.png') center center no-repeat;
        background-size: 50px 50px;
      }
      .medal-second{
        background: url('./../assets/icon/keepped-second.png') center center no-repeat;
        background-size: 50px 50px;
      }
      .medal-third{
        background: url('./../assets/icon/keepped-third.png') center center no-repeat;
        background-size: 50px 50px;
      }
    }
    .book-mark-content-line{
      margin-top: 20px;
      min-width: 200px;
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
  .first-border{
    border: 5px solid #ffd621 !important;
  }
  .second-border{
    border: 5px solid #b4b4b4!important;
  }
  .third-border{
    border: 5px solid #ff9757!important;
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
  .keepped-times{
    height:40px;
    background-color: #fff;
    border-radius: 0 0 5px 5px;
    padding-left: 10px;
    line-height: 40px;
    color:#8b8b8b;
    font-size: 14px;
    .first-keepped{
      font-size: 20px;
      color: #ffdc1c;
      font-weight: bold;
    }
    .second-keepped{
      font-size: 20px;
      color: #b4b4b4;
      font-weight: bold;
    }
    .third-keepped{
      font-size: 20px;
      color: #ff9757;
      font-weight: bold;
    }
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
    .first-color{
      color: #ffdc1c;
      font-weight: bold;
    }
    .second-color{
      color: #b4b4b4;
      font-weight: bold;
    }
    .third-color{
      color: #ff9757;
      font-weight: bold;
    }
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
  .mark-type-ul{
    li{
      float:left;
      margin-right: 10px;
      height:20px;
      padding: 4px 8px;
      border-radius: 5px;
      color:#fff;
      background-color: #75a5bd;
      line-height: 20px;
      margin-bottom: 5px;
      position: relative;
      top:3px;
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
    .book-mark-content{
      min-width: 340px!important;
    }

  }
</style>
