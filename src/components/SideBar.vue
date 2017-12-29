<template>
    <div class="side-bar">
      <ul class="first-level-ul">
        <li v-for="(item,index) in menuData" :class="['first-level',{'first-level-start':index===0}]">
          <a :class="['first-a',item.isActive ? item.menuOpenIcon : item.menuIcon]" @click="showSubMenu(index)">{{item.menuName}}</a>
          <transition name="slide" >
            <ul class="second-level" v-show="item.isActive">
              <li v-for="(subitem,subindex) in item.subMenu"  :key="subitem.menuName" >
                <router-link :to="subitem.menuLink"
                             class="second-a"
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
    export default {
        name: 'app',
        methods:{
            showSubMenu:function(index){
              this.currentFirstLevelIndex = index;
              this.menuData[index].isActive = !this.menuData[index].isActive;
            }
        },
        data(){
            return{
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
                        menuLink:'/user/hotbookmark'

                      },
                      {
                          menuName:'我的书签',
                          menuLink:'/user/showbookmark'

                      },
                      {
                          menuName:'添加书签',
                          menuLink:'/user/addbookmark'
                      },
                      {
                          menuName:'修改书签',
                          menuLink:'/user/modfifybookmark'
                      }
                    ]
                  },
                  {
                    menuName:'百度地图',
                    menuIcon:'sidebar-book',
                    menuOpenIcon:'sidebar-book-open',
                    isActive:false,
                    subMenu:[
                      {
                        menuName:'添加地图',
                        menuLink:'/d'
                      },
                      {
                        menuName:'查看地图',
                        menuLink:'/e'
                      },
                      {
                        menuName:'修改地图',
                        menuLink:'/f'
                      }
                    ]
                  },
                  {
                    menuName:'百度地图2',
                    menuIcon:'sidebar-book',
                    menuOpenIcon:'sidebar-book-open',
                    isActive:false,
                    subMenu:[
                      {
                        menuName:'添加地图',
                        menuLink:'/t'
                      },
                      {
                        menuName:'查看地图',
                        menuLink:'/y'
                      },
                      {
                        menuName:'修改地图',
                        menuLink:'/u'
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
    .first-level-ul{
      margin-top: 100px;
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
        font-size: 18px;
        color:@firstLevelColor;
        font-weight: 600;
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
      .second-level{
        //给ul加padding会导致动画跳跃，因为height不包含padding
        //padding-top: 20px;
        //padding-bottom: 20px;
        text-align: center;
        background-color: #6b9aff;
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
          -moz-box-sizing: border-box;
          -webkit-box-sizing: border-box;
          width:100%;
          font-size: 16px;
          padding:20px 30px 20px 20px;
          border-left:@borderWidth solid transparent;
          transition: border-left 0.5s;
          color:#fff;
          &:hover{
            border-left:@borderWidth solid #fff;
          }
          background: url('./../assets/icon/star.png') 27% center no-repeat;
          background-size: 20px 20px;
        }

        li{
          width:100%;
        }
        .subMenuActive{
          border-left:@borderWidth solid #fff;
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
