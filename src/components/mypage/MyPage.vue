<!--个人主页-->
<template>
    <div>
      <div class="wrap">
        <!--内容区域标题-->
        <div class="title">
          <div class="title-word">个人主页</div>
        </div>
        <!--内容区域-->
        <div class="content">
          <!--侧栏-->
          <div class="side-bar">
            <ul>
              <li v-for="(item,index) in sideBarData"
                  @click="toggleTab(index,item.component)"
                  :class="{'active':checkActive(index)}">
                <i class="side-bar-icon"
                   :style="{background:checkActive(index)?'url('+item.iconPathWhite+') center center / 25px 25px no-repeat':'url('+item.iconPath+') center center / 25px 25px no-repeat'}">
                </i>
                <span class="side-bar-title">{{item.name}}</span>
              </li>
            </ul>
          </div>
          <!--右侧主内容区-->
          <div class="right-side-content">
            <component :is="currentTabComponent"></component>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import ChangeFace from './../../components/mypage/ChangeFace'
  import MyPageInfo from './../../components/mypage/MyPageInfo'
	export default {
		name: 'myPage',
    components:{
      ChangeFace,
      MyPageInfo
    },
    mounted(){
			//如果该参数存在才导航到该tab
			if(this.$route.params.tabName){
        this.currentTabComponent = this.$route.params.tabName;
        this.currentIndex = parseInt(this.$route.params.tabIndex,10);
      }
    },
    methods:{
			//是否激活当前项
      checkActive(index){
      	return index === this.currentIndex
      },
      //切换tab
      toggleTab(index,tabComponent){
      	this.currentIndex = index;
      	this.currentTabComponent = tabComponent;
      }
    },
    data(){
			return{
				currentIndex:0,
        //初始化tab
        currentTabComponent:'ChangeFace',
				sideBarData:[
          {
          	path:'/',
            component:'ChangeFace',
            name:'个人头像',
            iconPath:require('./../../assets/icon/mypage-profile.png'),
            iconPathWhite:require('./../../assets/icon/mypage-profile-white.png')
          },
          {
            path:'/',
            component:'MyPageInfo',
            name:'我的信息',
            iconPath:require('./../../assets/icon/mypage-info.png'),
            iconPathWhite:require('./../../assets/icon/mypage-info-white.png')
          },
          {
            path:'/',
            component:'',
            name:'我的记录',
            iconPath:require('./../../assets/icon/mypage-record.png'),
            iconPathWhite:require('./../../assets/icon/mypage-record-white.png')
          }
        ]
      }
    }
	}
</script>

<style lang="less" type="text/less" scoped>
  .wrap {
    margin: 20px auto;
    width: 1200px;
    background-color: #fff;
    border: 1px solid #d3d3d3;
    border-radius: 10px;
    box-shadow: 0 0 3px 3px #d3d3d3;
    position: relative;
    .content{
      min-height:600px;
      .right-side-content{
        float:left;
        min-height:600px;
        width:~'calc(100% - 152px)';
      }
      .side-bar{
        float:left;
        min-height:600px;
        width:150px;
        background-color: #f9f9f9;
        border-radius: 0 0 0 10px;
        border-right:1px solid #cbcbcb;
        .active{
          //为了使得hover时不变色
          background-color: #409eff !important;
          span{
            color:#fff !important;
          }
        }
        li{
          cursor: pointer;
          height:50px;
          line-height: 50px;
          transition:  all .5s;
          &:hover{
            background-color: #e3e3e3;
          }
          i{
            margin-left:30px;
            display: inline-block;
            //行内元素可以这样居中
            vertical-align: middle;
            width:25px;
            height:25px;
          }
          span{
            font-size: 14px;
            color: #464646;
            margin-left: 5px;
          }
        }
      }
    }
    .title {
      height: 50px;
      border-bottom: 1px solid #cbcbcb;
      border-radius: 10px 10px 0 0;
      line-height: 50px;
      padding-left: 50px;
      background: url('./../../assets/icon/myPage.png') 15px center no-repeat #f1f1f1;
      background-size: 40px 40px;
      .title-word {
        font-size: 17px;
        padding-left: 20px;
        padding-right: 50px;
        color: #afafaf;
        font-family: SansSerif;
      }
    }
  }
</style>
