<template>
    <div class="side-bar">
      <div class="hello">
        <div class="hello-img" :style="{background:'url('+greetingBg + ') center center no-repeat'}">
        </div>
        <div class="hello-word" v-if="!isNicknameExist" >
          <!--路由传递参数,目标组件接受参数，在mounted阶段,name是路由名字，在index里命名-->
          {{greetingWord}}(❁´◡`❁)，<router-link :to="{name:'myPage',params:{tabName:'MyPageInfo',tabIndex:1}}" class="link-to">{{userNickname}}</router-link>
        </div>
        <div class="hello-word" :title="userNickname" v-else>
          {{greetingWord}}(❁´◡`❁)，{{userNickname}}
        </div>
      </div>
      <ul class="first-level-ul">
        <li v-for="(item,index) in menuData" :class="['first-level',{'first-level-start':index===0}]">
          <a :class="['first-a',item.isActive ? item.menuOpenIcon : item.menuIcon]" @click="showSubMenu(index)">{{item.menuName}}</a>
          <transition name="slide" >
            <ul class="second-level" v-show="item.isActive">
              <li v-for="(subitem,subindex) in item.subMenu"  :key="subitem.menuName" >
                <router-link :to="subitem.menuLink"
                             class="second-a"
                             :style="{background: 'url(' + subitem.menuIcon + ') 23% center no-repeat',backgroundSize: '25px 25px'}"
                             active-class="subMenuActive">
                  {{subitem.menuName}}
                </router-link>
              </li>
            </ul>
          </transition>
        </li>
      </ul>
    </div>
</template>

<script>
    import axios from 'axios'
    import {eventBus} from './../eventBus'
    export default {
        name: 'app',
        methods:{
            showSubMenu:function(index){
              this.currentFirstLevelIndex = index;
              this.menuData[index].isActive = !this.menuData[index].isActive;
            },
            getUserInfo(){
              //获取用户昵称
              axios.get('/user/getUserInfo').then((resp)=>{
                if(resp.data.status === 1){
                	//注意这里必须是非，不能是===''，因为初始为undefined
                  if(!resp.data.nickname){
                    this.userNickname = '请填写昵称';
                    this.isNicknameExist = false;
                  }else{
                    this.userNickname = resp.data.nickname;
                  }

                }else if(resp.data.status === 2){
                  //未登录
                  this.userNickname = '游客'
                }
              })
            }
        },
        mounted(){
            this.getUserInfo();
            eventBus.$on('MODIFY_GREETING_WORD',()=>{
            	this.isNicknameExist = true;
              this.getUserInfo();
            })
        },
        computed:{

        	  //问候语,根据时间来区分
            greetingWord(){
            	var date = new Date();
            	var hours = date.getHours();
            	if(hours>=18 || hours<=6){
            		return '晚上好'
              }else if(hours >=12 && hours <18){
            		return '下午好'
              }else{
              	return '早上好'
              }
            },
            //问候的背景图片
            greetingBg(){
              var date = new Date();
              var hours = date.getHours();
              if(hours >= 18 || hours<=6){
              	return require('./../assets/icon/night.png')
              }else{
                return require('./../assets/icon/morning.png')
              }
            }
            //用户昵称


        },
        data(){
            return{
            	  //是否填写了昵称
                isNicknameExist:true,
            	  //用户昵称
                userNickname:'',
                //当前一级菜单index
                currentFirstLevelIndex:0,
                //菜单栏数据，每一个对象是一级菜单
                menuData:[
                  {
                    menuName:'网络书签，收藏精彩',
                    //类名
                    menuIcon:'sidebar-book',
                    menuOpenIcon:'sidebar-book-open',
                    isActive:false,
                    subMenu:[
                      {
                        menuName:'热门书签',
                        menuLink:'/user/hotbookmark',
                        menuIcon:require('./../assets/icon/hot-bookmark.png')

                      },
                      {
                          menuName:'我的书签',
                          menuLink:'/user/showbookmark',
                          menuIcon:require('./../assets/icon/mine-bookmark.png')

                      },
                      {
                          menuName:'添加书签',
                          menuLink:'/user/addbookmark',
                          menuIcon:require('./../assets/icon/add-bookmark.png')
                      },
                      {
                          menuName:'导入书签',
                          menuLink:'/user/importbookmark',
                          menuIcon:require('./../assets/icon/import-bookmark.png')
                      }
                    ]
                  },
                  {
                    menuName:'双色球 , 大不同',
                    menuIcon:'sidebar-double-color',
                    menuOpenIcon:'sidebar-double-color-open',
                    isActive:false,
                    subMenu:[
                      {
                        menuName:'选号分析',
                        menuLink:'/lottery/smartChooseLottery',
                        menuIcon:require('./../assets/icon/lotterysmart.png')
                      },
                      {
                        menuName:'历史查询',
                        menuLink:'/lottery/lotteryHistorySearch',
                        menuIcon:require('./../assets/icon/lotteryhistory.png')
                      },
                      {
                        menuName:'中奖细则',
                        menuLink:'/lottery/lotteryPrizeRule',
                        menuIcon:require('./../assets/icon/lotterymoney.png')
                      }
                    ]
                  },
                  {
                    menuName:'城市地图 , 热点分析',
                    menuIcon:'sidebar-baidu-map',
                    menuOpenIcon:'sidebar-baidu-map-open',
                    isActive:false,
                    subMenu:[
                      {
                        menuName:'租房助手',
                        menuLink:'/baidumap/houseRenting',
                        menuIcon:require('./../assets/icon/baidu-map-house-rent.png')
                      },
                      {
                        menuName:'构思中.',
                        menuLink:'/y',
                        menuIcon:require('./../assets/icon/hot-bookmark.png')
                      },
                      {
                        menuName:'构思中..',
                        menuLink:'/u',
                        menuIcon:require('./../assets/icon/hot-bookmark.png')
                      }
                    ]
                  },
                  {
                    menuName:'网易云音乐',
                    menuIcon:'sidebar-music',
                    menuOpenIcon:'sidebar-music-open',
                    isActive:false,
                    subMenu:[
                      {
                        menuName:'网易云热歌分析',
                        menuLink:'/music/hotMusicAnalysis',
                        menuIcon:require('./../assets/icon/music-hot.png')
                      },
                      {
                        menuName:'构思中..',
                        menuLink:'/y',
                        menuIcon:require('./../assets/icon/music-singer.png')
                      },
                      {
                        menuName:'构思中...',
                        menuLink:'/u',
                        menuIcon:require('./../assets/icon/hot-bookmark.png')
                      }
                    ]
                  }
                ]
            }
        }
    }
</script>

<style scoped lang="less" type="text/less">
  @sideBarWidth:300px;
  @sideBarBg: #fff;
  @bannerHeight:60px;

  .side-bar {
    width:@sideBarWidth;
    position: fixed;
    left:0;
    top:@bannerHeight;
    z-index:90;
    //技巧:同时设置top和bottom会让div充满整个浏览器高度
    bottom:0;
    overflow-y: auto;
    overflow-x: hidden;
    border-right:1px solid #e3e3e3;
    background-color: @sideBarBg;
    .hello{
      height:100px;
      color: #666666;
      font-size: 19px;
      font-family: "Microsoft YaHei";
      line-height: 100px;
      .hello-img{
        float:left;
        height:100%;
        width:90px;
        //background: url('./../assets/icon/night.png') center center no-repeat;
      }
      .hello-word{
        float:left;
        height:100%;
        width:180px;
        font-size: 14px;
        text-align: left;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        //background: url('./../assets/icon/rabbit.png') center center no-repeat;
        background-size: 180px 100px;
        .link-to{
          color:#409eff;
        }
      }
    }
    .first-level-ul{
      @firstLevelColor:#7f8c8d;
      @firstLevelHoverBgColor: #eeeeee;
      @firstLevelHoverWordColor: #fff;
      @firstLevelPaddingLeft:80px;
      .sep{
        height:1px;
        background-color: #E3E3E3;
      }

      /*每个li里面的a标签*/
      .first-a{
        box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        width:100%;
        display: inline-block;
        padding:20px 30px 20px @firstLevelPaddingLeft;
        font-size: 16px;
        font-weight: 500;
        color:@firstLevelColor;
        font-family: "Microsoft YaHei";
        cursor: pointer;
        //重要，是a标签的hover状态，不是li，一定注意
        transition: background-color .5s ease;
        &:hover{
          background-color:@firstLevelHoverBgColor;
          //color:@firstLevelHoverWordColor;
        }
      }
      .first-level{
        width:100%;
        border-bottom: 1px solid #E3E3E3;
      }
      .first-level-start{
        border-top: 1px solid #E3E3E3;
      }
      .sidebar-book{
        background: url('./../assets/icon/sidebar-book.png') 8% center no-repeat,
                    url('./../assets/icon/arrow-right.png') 95% center no-repeat ;
        //对应多个图片下的每个图片的尺寸,逗号隔开, 20px 20px
        background-size:30px 30px,20px 20px;
      }
      .sidebar-book-open{
        background: url('./../assets/icon/sidebar-book.png') 8% center no-repeat,
                    url('./../assets/icon/arrow-down.png') 95% center no-repeat ;
        //对应多个图片下的每个图片的尺寸,逗号隔开, 20px 20px
        background-size:30px 30px,20px 20px;
      }

      //双色球
      .sidebar-double-color{
        background: url('./../assets/icon/double-color.png') 8% center no-repeat,
        url('./../assets/icon/arrow-right.png') 95% center no-repeat ;
        //对应多个图片下的每个图片的尺寸,逗号隔开, 20px 20px
        background-size:30px 30px,20px 20px;
      }
      .sidebar-double-color-open{
        background: url('./../assets/icon/double-color.png') 8% center no-repeat,
        url('./../assets/icon/arrow-down.png') 95% center no-repeat ;
        //对应多个图片下的每个图片的尺寸,逗号隔开, 20px 20px
        background-size:30px 30px,20px 20px;
      }

      //百度地图
      .sidebar-baidu-map{
        background: url('./../assets/icon/baidu-map.png') 8% center no-repeat,
        url('./../assets/icon/arrow-right.png') 95% center no-repeat ;
        //对应多个图片下的每个图片的尺寸,逗号隔开, 20px 20px
        background-size:30px 30px,20px 20px;
      }
      .sidebar-baidu-map-open{
        background: url('./../assets/icon/baidu-map.png') 8% center no-repeat,
        url('./../assets/icon/arrow-down.png') 95% center no-repeat ;
        //对应多个图片下的每个图片的尺寸,逗号隔开, 20px 20px
        background-size:30px 30px,20px 20px;
      }
      //网易云音乐
      .sidebar-music{
        background: url('./../assets/icon/netease-music.png') 8% center no-repeat,
        url('./../assets/icon/arrow-right.png') 95% center no-repeat ;
        //对应多个图片下的每个图片的尺寸,逗号隔开, 20px 20px
        background-size:30px 30px,20px 20px;
      }
      .sidebar-music-open{
        background: url('./../assets/icon/netease-music.png') 8% center no-repeat,
        url('./../assets/icon/arrow-down.png') 95% center no-repeat ;
        //对应多个图片下的每个图片的尺寸,逗号隔开, 20px 20px
        background-size:30px 30px,20px 20px;
      }
      .second-level{
        //给ul加padding会导致动画跳跃，因为height不包含padding

        background-color: #5fb0ff;
        //这个很关键，不隐藏掉溢出的内容的话菜单会显示重叠
        overflow: hidden;
        //内阴影
        box-shadow: 0 0 6px #898989 inset;
        @borderWidth:10px;
        //二级菜单每个a标签
        .second-a{
          /*必须要这一句，才有高度*/
          display: inline-block;
          box-sizing: border-box;
          //文字左对齐
          text-indent: 90px;
          -moz-box-sizing: border-box;
          -webkit-box-sizing: border-box;
          font-family: "Microsoft YaHei";
          width:100%;
          font-size: 16px;
          padding:20px 30px 20px 20px;
          border-left:@borderWidth solid transparent;
          transition: border-left 0.5s;
          color: #ffffff;
          &:hover{
            border-left:@borderWidth solid #fff;
          }
          //background: url('./../assets/icon/star.png') 27% center no-repeat;
          //background-size: 20px 20px;
        }

        li{
          width:100%;
        }
        .subMenuActive{
          border-left:@borderWidth solid #f6f6f6;
        }
      }
    }
  }

  //动画过渡效果
  //4个一级菜单
  @menuNum:4;
  @maxHeight:56px * @menuNum;
  .slide-enter,.slide-leave-to{
    max-height: 0;
  }
  .slide-enter-to{
    max-height:@maxHeight;
  }
  .slide-leave{
    max-height:@maxHeight;
  }
  /*注意二级菜单高度不确定，用max-height代替auto，auto不会让transition 生效*/
  .slide-enter-active,.slide-leave-active{
    transition: max-height 0.5s ease;
  }
</style>
