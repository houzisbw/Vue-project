<template>
  <div class='fixed-layout'>
    <div class="book-mark" id="title-top">
      <div class="title" v-if="!isLogin" :class="{'title-unlogin':!isLogin}">
        您还未登录，请<span class="login-word" @click="login">登录</span>后查看书签
      </div>
      <div class="title" :class="defaultBookMarkShowType?'title-list-width':'title-grid-width'" v-else>
        <div class="title-num" v-if="!bookmarkSearchKeyword">所有书签,一共{{bookMarkCount}}个</div>
        <div class="title-num" v-else>已为您搜索到符合条件的书签{{bookMarkCount}}个</div>
        <div class="grid-show"
             :class="{'bookmark-type-button-active':!defaultBookMarkShowType}"
             @click="toggleShowType(false)"
             title="卡片显示">
        </div>
        <div class="line-show"
             :class="{'bookmark-type-button-active':defaultBookMarkShowType}"
             @click="toggleShowType(true)"
             title="列表显示">
        </div>
      </div>
      <!--书签内容区域-->
      <div v-if="isLogin">
          <!--加载中gif-->
          <div class="is-loading" v-if="isBookMarkLoading">
            <img src="./../assets/svg/loading-spinning-bubbles.svg">
          </div>
          <!--卡片展示-->
          <div v-if="!defaultBookMarkShowType">
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
          <!--列表展示-->
          </div>
          <div v-else>
            <div class="book-mark-content-line clearfix">
              <table>
                <tr v-if="!isBookMarkLoading">
                  <th>标题</th>
                  <th>链接</th>
                  <th>分类</th>
                  <th style="width:100px;position: relative;cursor:pointer"
                      title="点击可进行日期排序"
                      @click="sortByDate"
                  >添加于
                    <img  class="th-sort" src="./../assets/icon/sort.png">
                  </th>
                  <!--最后一栏固定宽度-->
                  <th style="width:50px">操作</th>
                </tr>
                <tr class='tr-data' v-for="(item,index) in bookMarkList">
                  <td :title="item.title" @click="jumpToNewPage(item.url)">
                      <span class="favicon-span"
                            :style="{background:'url('+item.faviconUrl + ')' + ' center center no-repeat',
                                    backgroundSize:'80% 80%'}">
                      </span>
                      <span class="title-line">{{item.title}}</span>
                  </td>
                  <td>{{item.url}}</td>
                  <td>
                    <ul class="mark-type-ul">
                      <li v-for="(itemType,index) in item.type">{{itemType.label}}</li>
                    </ul>
                  </td>
                  <!--添加时间-->
                  <td>
                    <!--过滤器格式化时间-->
                    {{item.date | dateFormatFromMillsec}}
                  </td>
                  <td>
                    <div class="delete-bookmark" title="删除该书签" @click="deleteBookMark(item.url,item.title)">
                    </div>
                    <!--data-clipboard-text是插件的属性-->
                    <button class="copy-bookmark" title="复制书签链接"  :data-clipboard-text="item.url">
                    </button>
                  </td>
                </tr>
              </table>
              <!--翻页按钮-->
              <div class="pagination" v-if="!isBookMarkLoading">
                <div class="pagination-wrap">
                  <!--当前页/总页数-->
                  <div class="page-num">
                    {{pageIndex}}/{{pageTotalNum}}
                  </div>
                  <!--上一页-->
                  <div class="prev-page" @click="nextOrPrevPage(true)" title="上一页">
                  </div>
                  <!--下一页-->
                  <div class="next-page" @click="nextOrPrevPage(false)" title="下一页">
                  </div>
                  <!--输入框-->
                  <input class="page-input" type="text" placeholder="输入页数" v-model.trim="pageNumInput">
                  <!--跳转-->
                  <div class="page_jump" @click="jumpToPage">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!--滚动加载多页，当该div距离视口底部距离小于0时触发加载事件-->
          <!--<div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">-->
          <!--</div>-->
          <!--用于让底部和内容隔开一定距离-->
          <div class="bottom-padding">
          </div>
          <!--返回顶部-->
          <a class="to-top" @click="goTop()" v-if="!defaultBookMarkShowType">
          </a>
      </div>

    </div>
    <!--剪切成功的提示面板-->
    <transition name="fade">
      <div class="clip-success" v-if="clipSuccessShow">
        <p class="clip-success-notice-title">提示&nbsp;:</p>
        <p>{{clipSuccessUrl}}</p>
        <p>已复制到您的剪切板</p>
      </div>
    </transition>
  </div>
</template>

<script>
    import {eventBus} from './../eventBus'
    import axios from 'axios'
    //引入Clipboard.js实现鼠标点击复制粘贴
    import Clipboard from 'clipboard'
    //引入日期格式化js
    import {formatDateFromMillsec} from './../utils/dateFormat'
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
                bookMarkTotalNum:0,
                //默认书签显示类型,false为卡片，true为列表
                defaultBookMarkShowType:false,
                //书签页数
                pageNumInput:'',
                //要删除的书签url
                bookMarkUrlToDelete:'',
                //提示书签复制成功的信息
                clipSuccessUrl:'',
                clipSuccessShow:false,
                clipSuccessShowTimerId:null,
                //书签关键字，用于搜索,默认为空，
                bookmarkSearchKeyword:'',
                //是否处于删除状态,用于区分是删除还是搜索状态
                isInDeleteState:false,
                //按日期排序的flag,true为升序，false为降序
                sortFlag:true
            }
        },
        //过滤器
        filters:{
            dateFormatFromMillsec:formatDateFromMillsec
        },
        mounted(){
        	//书签搜索为空以及重新加载数据
          eventBus.$on('bookmarkEmptyAndRefreshData',()=>{
              this.bookmarkSearchKeyword = '';
              //重新加载数据,注意各种数据初始化,列表每页也只有18条数据
              this.pageIndex = 1;
              this.bookMarkList = [];
              this.getBookMarkList();
          });
        	//获取搜索框传来的书签搜索输入数据
          eventBus.$on('search-content-bookmark',(data)=>{
              //进行搜索
              this.bookmarkSearchKeyword = data;
              //更新数据
              this.pageIndex = 1;
              this.bookMarkList = [];
              this.getBookMarkList();
          });
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
          //确认删除书签
          eventBus.$on('deleteBookMarkConfirm',()=>{
          	  axios.post('/user/deleteBookMark',{url:this.bookMarkUrlToDelete}).then((response)=>{
          	  	  let status = response.data.status;
                  if(status === 1){
                      //刷新数据,判断第几页,边界情况，当页只有1个书签，删除了得返回上一页
                      var updatedPageIndex = Math.ceil((this.bookMarkTotalNum - 1) / this.pageSize);
                      //删除了当页唯一一个书签
                      if(updatedPageIndex < this.pageIndex){
                        this.pageIndex = updatedPageIndex;
                      }
                      //进入删除状态
                      this.isInDeleteState = true;
                      //更新数据
                      this.bookMarkList = [];
                      this.getBookMarkList();
                  }else{
                      eventBus.$emit('unknown-error');
                  }
              });
          });
        	//如果登录就从后台拿到书签信息
          if(this.isLogin){
          	this.getBookMarkList();
          }
        },
        computed:{
        	//总页数
          pageTotalNum(){
          	return Math.ceil(this.bookMarkTotalNum / this.pageSize);
          },
        	//用户是否登录
        	isLogin(){
            return this.$store.getters.getUserName;
          },
          //书签数
          bookMarkCount(){
        		return this.bookMarkTotalNum;
          }
          //书签添加时间

        },
        watch: {
          // 如果路由有变化，会再次执行该方法
          '$route': 'fetchData'
        },
        methods:{
        	  //书签按日期排序
            sortByDate(){
            	this.pageIndex = 1;
              this.bookMarkList = [];
              this.sortFlag = !this.sortFlag;
              this.getBookMarkList();
            },
        	  //删除书签
            deleteBookMark(url,title){
            	//弹出对话框
              eventBus.$emit('delete-bookmark',url,title);
              this.bookMarkUrlToDelete = url;
            },
        	  //跳页
            jumpToPage(){
              //检查书签页数输入是否合法:数字且>=1 且 <=最大页数
              var regExp = /^[1-9]+$/;
              var isValid = true;
              var pageInt = parseInt(this.pageNumInput)
              if(regExp.test(this.pageNumInput)){
              	if(!(pageInt >= 1 && pageInt <= this.pageTotalNum)){
                  isValid = false;
                }
              }else{
                isValid = false;
              }
              //如果合法
              if(isValid){
                this.pageIndex = pageInt;
                this.bookMarkList = [];
                this.getBookMarkList();
              }else{
              	//页码输入非法
              	eventBus.$emit('page-num-state',3);
              }
            },
        	  //上一页下一页,1为上一页，2为下一页
            nextOrPrevPage(dir){
            	if(dir){
                if(this.pageIndex === 1){
                	eventBus.$emit('page-num-state',1)
                }else{
                	this.pageIndex--;
                  this.bookMarkList = [];
                  this.getBookMarkList();
                }
              }else{
                if(this.pageIndex === this.pageTotalNum){
                  eventBus.$emit('page-num-state',2)
                }else{
                  this.pageIndex++;
                  this.bookMarkList = [];
                  this.getBookMarkList();
                }
              }
            },
        	  //切换书签展示类型
            toggleShowType(type){
            	this.defaultBookMarkShowType = !this.defaultBookMarkShowType;
            	//列表
            	if(type){
                //不再启用滚动加载插件
                eventBus.$emit('BOOKMARK_SCROLL_STATE',true,false);
                //重新加载数据,注意各种数据初始化,列表每页也只有18条数据
                this.pageIndex = 1;
                this.bookMarkList = [];
                this.getBookMarkList();

            	//卡片
              }else{
                //启用滚动加载插件
                eventBus.$emit('BOOKMARK_SCROLL_STATE',false,false);
                //重新加载数据,注意各种数据初始化
                this.pageIndex = 1;
                this.bookMarkList = [];
                this.getBookMarkList();
              }
            },
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
                pageIndex:this.pageIndex,
                keyword:this.bookmarkSearchKeyword,
                //注意不能直接传bool值，否则后台解析为字符串
                sort:this.sortFlag?'ascend':'descend'
              }
              //get发送参数要有key：params
              axios.get('/user/getBookMarkList',{params:param}).then((response)=>{
                  this.isBookMarkLoading = false;
                  //如果是列表
                  if(!this.defaultBookMarkShowType) {
                    eventBus.$emit('BOOKMARK_SCROLL_STATE', false, true);
                  }
                  let status = response.data.status;
                  //请求成功
                  if(status === 1){
                    this.bookMarkList = this.bookMarkList.concat(response.data.bookMarkList);
                    this.bookMarkTotalNum = response.data.bookMarkTotalNum;
                    //获取当前毫秒数
                    var date = new Date();
                    //注意这里返回的是数值，不是字符串
                    var millsec = date.getTime();
                    for(var i=0;i<this.bookMarkList.length;i++){
                      this.bookMarkList[i].date = millsec - parseInt(this.bookMarkList[i].date);
                    }


                    //如果是最后一页了额，禁用滚动插件，很重要
                    if(response.data.bookMarkList.length < this.pageSize){
                      //如果是列表
                      if(!this.defaultBookMarkShowType) {
                        eventBus.$emit('BOOKMARK_SCROLL_STATE', true, false);
                      }
                    }
                  	var listLength = this.bookMarkList.length;
                    if(listLength > 0){
                      //this.bookMarkList = response.data.bookMarkList;
                    }else{
                    	//如果是在搜索状态下删除了完了，不触发书签为空的提示
                    	if(this.bookmarkSearchKeyword){
                    		//如果是删除状态,这里区分是为了要使得搜索结果为空时弹出对话框提示
                    		if(this.isInDeleteState){
                          this.bookmarkSearchKeyword = '';
                          //重新加载数据,注意各种数据初始化,列表每页也只有18条数据
                          this.pageIndex = 1;
                          this.bookMarkList = [];
                          this.getBookMarkList();
                          this.isInDeleteState = false;
                        }else{
                          //搜索状态
                          eventBus.$emit('search-result-empty');
                        }
                      }else{
                        //提示书签为空
                        eventBus.$emit('empty-bookmarklist');
                      }
                    }
                    //进行剪贴板操作
                    //注意这里需要延时一定时间，否则无法获取到全部节点，因为还未渲染成功
                    var self = this;
                    setTimeout(function(){
                      //初始化剪贴板,获取所有剪切板按钮
                      var btns = document.querySelectorAll('.copy-bookmark');
                      var clipboard = new Clipboard(btns);
                      //剪切成功
                      clipboard.on('success',function(e){
                      	  clearTimeout(self.clipSuccessShowTimerId);
                          self.clipSuccessUrl = e.text;
                          self.clipSuccessShow = true;
                          //2秒后消失面板
                          self.clipSuccessShowTimerId = setTimeout(()=>{
                            self.clipSuccessShow = false;
                          },2000)
                      })
                    },300)

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
  .th-sort{
    position: absolute;
    right:20%;
    width:20px;
    height:20px;
    top:20px;
  }
  .fixed-layout{
    //position: fixed;
    height:100%;
    // fixed状态下：100% - 320px
    width:~'calc(100%)';
    overflow-y: auto;
    overflow-x: hidden;
    .clip-success{
      position: fixed;
      right:30px;
      //70px
      top:70px;
      //允许用户点击该div下面的元素
      pointer-events:none;
      width:220px;
      min-height:100px;
      word-break: break-all;
      background: url('./../assets/icon/clip-success.png') 5% center no-repeat rgba(44, 164, 65, 0.8);
      background-size: 15% 30%;
      border-radius: 5px;
      padding:10px 10px 10px 90px;
      color:#fff;
      font-size: 14px;

      p{
        margin-bottom: 10px;
      }
      .clip-success-notice-title{
        margin-top: 10px;
        font-size: 18px;
      }
    }
  }

  .book-mark{
    width:80%;
    margin: 10px auto;
    @titleHeight:40px;
    //未登录时标题居中
    .title-unlogin{
      text-align: center!important;
    }
    .title-list-width{
      min-width: 600px;
    }
    .title-grid-width{
      min-width: 340px;
    }
    .title{
      box-sizing: border-box;
      -moz-box-sizing: border-box;
      -webkit-box-sizing: border-box;
      width:100%;
      height:@titleHeight;
      border-radius: 5px;
      background-color: #fff;
      padding: 0 0 0 20px;
      box-shadow: 0 0 5px 2px #d3d3d3;
      text-align: left;
      line-height: 40px;
      color:#898989;
      .title-num{
        float:left;
        height:@titleHeight;
      }
      .grid-show,.line-show{
        height:@titleHeight;
        float:right;
        width:@titleHeight;
        border-left:1px solid #cbcbcb;
        cursor: pointer;
      }
      .grid-show{
        background: url('./../assets/icon/bookmark-show-type-grid.png') center center no-repeat;
        background-size: 25px 25px;
        border-radius: 0 5px 5px 0;
      }
      .line-show{
        background: url('./../assets/icon/bookmark-show-type-line.png') center center no-repeat;
        background-size: 25px 25px;
      }
      //按钮激活样式
      .bookmark-type-button-active{
        //box-shadow: 0 0 3px  #bdbdbd inset;
        background-color: #eaeaea;
      }

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
    .book-mark-content-line{
      margin-top: 20px;
      min-width: 200px;
      table{
        //很关键，否则不显示省略号
        table-layout: fixed;
        @borderRadius:7px;
        width:100%;
        min-width: 600px;
        //注意这里不能写collapse,否则没圆角效果
        border-collapse: separate;
        border-radius: @borderRadius;
        border: 1px solid rgba(34,36,38,.15);
        border-bottom: none;
        background-color: #F9FAFB;
        th{
          height:40px;
          padding:10px 20px;
          border-right: 1px solid rgba(34,36,38,.15);
          border-bottom: 1px solid rgba(34,36,38,.15);
          vertical-align: middle;
          font-weight: bold;
          color: #565656;
        }
        //最后一列无右边框
        th:last-child{
          border-right: none;
        }
        td{
          border-right: 1px solid rgba(34,36,38,.15);
          border-bottom: 1px solid rgba(34,36,38,.15);
          height:30px;
          background-color: #fff;
          vertical-align: middle;
          padding:4px 20px;
          font-size: 14px;
          color: #717171;
          //省略号
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .tr-data{
          .favicon-span{
            display: inline-block;
            width:30px;
            height:30px;
            margin-top: 2px;
          }
          .title-line{
            position: relative;
            top:-8px;
            font-family: "Microsoft YaHei";
            font-size: 14px;
            color: #717171;
            padding-left:10px;
          }
          transition: all .5s ease;
          &:hover{
            background-color: #f6f6f6;
          }
        }

        //tr悬浮的话，td会覆盖tr的背景色，所以得强制让td背景色为空
        .tr-data:hover td{
          background:none;
        }
        td:last-child{
          border-right: none;
        }

        //第一列显示手的鼠标
        tr td:first-child{
          cursor: pointer;
        }
        //最后一列固定宽度，其余自适应宽度
        & tr td:last-child{
          //width: 100px !important;
        }
        //table左下和右下圆角
        & tr:last-child td:first-child{
          //border-radius: 0 0 0 @borderRadius;
        }
        & tr:last-child td:last-child{
          //border-radius: 0 0 @borderRadius 0;
        }

        //书签删除
        .delete-bookmark{
          width:30px;
          height:30px;
          background: url('./../assets/icon/delete-bookmark.png') center center no-repeat;
          background-size: 80% 80%;
          margin-left: -10px;
          cursor: pointer;
          float:left;
        }
        .copy-bookmark{
          width:30px;
          height:30px;
          background: url('./../assets/icon/copy-booktitle.png') center center no-repeat;
          background-size: 80% 80%;
          cursor: pointer;
          float:left;
          position: relative;
          top:-1px;
          border: none;
          outline: none;
        }
      }
      //翻页
      .pagination{
        width:~'calc(100% - 1px)';
        min-width: 600px;
        margin: 0 auto;
        height:80px;
        padding:10px 20px;
        background-color: #ffffff;
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        border-radius: 0 0 5px 5px;
        .pagination-wrap{
          margin-top: 10px;
          float:right;
          height:40px;
          border:1px solid rgba(34,36,38,.15);
          border-radius: 5px;
          box-shadow:0 1px 2px 0 rgba(34,36,38,.15);
          .prev-page,.next-page,.page_jump{
            width:40px;
            height:100%;
            float:left;
            cursor: pointer;
            transition: all .5s;
            &:hover{
              background-color: rgba(0,0,0,.1);
            }
          }
          .page-num{
            min-width:40px;
            padding: 0 5px;
            height:40px;
            float:left;
            background-color: rgba(0,0,0,.05);
            border-right:1px solid #cbcbcb;
            line-height: 40px;
            color:#8b8b8b;
            text-align: center;
          }
          .page_jump{
            background: url('./../assets/icon/page-search.png') center center no-repeat rgba(0,0,0,.05);
            background-size: 60% 60%;
          }
          .prev-page{
            background: url('./../assets/icon/prev.png') center center no-repeat rgba(0,0,0,.05);
            background-size: 40% 40%;
            border-right:1px solid #cbcbcb;
          }
          .next-page{
            background: url('./../assets/icon/next.png') center center no-repeat rgba(0,0,0,.05);
            background-size: 40% 40%;
          }
          .page-input{
            height:38px;
            border:none;
            width:60px;
            padding:0 15px;
            float:left;
          }
        }
      }
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

  //动画效果
  .fade-enter,.fade-leave-to{
    opacity: 0;
  }
  .fade-enter-to,.fade-leave{
    opacity: 1;
  }
  .fade-enter-active,.fade-leave-active{
    transition: opacity .5s linear;
  }

</style>
