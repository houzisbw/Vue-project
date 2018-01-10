<!--双色球智能选号-->
<template>
  <!--最外层的div是为了后面的底部padding-->
  <div>
    <div class="wrap">
      <!--标题区域-->
      <div class="title">
        <div class="upper">
          <span class="union-lotto">双色球</span>
          <span class="union-lotto-desc">每注2元，最高获奖1000万</span>
          <span class="buy-deadline">本期投注截止时间:&nbsp;{{lotteryPurchaseDeadline}}</span>
          <span class="lottery-phase">第{{lotteryPhase}}期</span>
        </div>
        <div class="lower">
          <ul>
            <li v-for="(item,index) in tabData" :class="{'active':index === tabIndex}" @click="switchTab(index)">{{item.name}}</li>
          </ul>
        </div>
      </div>
      <!--内容区域-->
      <div class="content">
        <!--利用动态组件实现tab选项卡切换-->
        <keep-alive>
          <component :is="currentTab"></component>
        </keep-alive>
      </div>
    </div>
    <!--底部padding-->
    <!--用于让底部和内容隔开一定距离-->
    <div class="bottom-padding">
    </div>
  </div>
</template>

<script>
  import NameChoose from './SmartChoose-tab-lucky'
  import FastChoose from './SmartChoose-tab-fast'
	export default {
		name: 'smartChoose',
    components:{
      NameChoose,
      FastChoose
    },
    data(){
			return {
				lotteryPurchaseDeadline:'2018-01-09 19:40',
        lotteryPhase:2018004,
        //tab面板默认显示的面板索引
        tabIndex:0,
        //双色球tab数据,tabComponent指的是组件名称,用于赋值给动态组件的is属性
        tabData:[
          {
          	name:'快捷投注',
            isActive:false,
            tabComponent:'FastChoose'
          },
          {
            name:'姓名投注',
            isActive:false,
            tabComponent:'NameChoose'
          },
          {
            name:'生日投注',
            isActive:false,
            tabComponent:'BirthdayChoose'
          },
          {
            name:'手机号投注',
            isActive:false,
            tabComponent:'TelephoneChoose'
          }
        ],
        currentTab:'FastChoose'
      }
    },
    methods:{
    	//切换tab
    	switchTab(index){
        this.tabIndex = index;
        this.currentTab = this.tabData[index].tabComponent;
      }
    }

	}
</script>

<style type="text/less" lang="less" scoped>
  .bottom-padding{
    height:100px;
    width:100%;
  }
  .wrap{
    margin: 20px auto;
    width:1000px;
    min-height:600px;
    background-color: #fff;
    border:1px solid #d3d3d3;
    border-radius: 5px;
    box-shadow: 0 0 3px 3px #d3d3d3;
    .title{
      height:85px;
      border-bottom: 3px solid #ba2636;
      padding-left:80px;
      background: url('./../../assets/icon/union_lotto.png') 10px 5px no-repeat;
      background-size: 70px 70px;
      @upperHeight:60px;
      .upper{
        height:@upperHeight;
        line-height: @upperHeight;
        .union-lotto{
          font-size: 22px;
          font-family: "Microsoft YaHei";
          font-weight: bold;
          color: #656565;
          margin-left: 15px;
        }
        .union-lotto-desc{
          font-size: 14px;
          color: #bdbdbd;
          margin-left: 5px;
        }
        .buy-deadline{
          font-size: 14px;
          color: #636363;
          margin-left: 5px;
        }
        .lottery-phase{
          font-size: 14px;
          color: #565656;
          margin-right: 15px;
          position: relative;
          top:4px;
          float:right;
        }
      }
      .lower{
        ul{
          margin-left: 15px;
          .active{
            background-color: #ba2636;
            color:#fff;
            border-color:#ba2636;
          }
          li{
            cursor: pointer;
            position: relative;
            top:-1px;
            float:left;
            padding: 0 10px;
            height:25px;
            line-height: 25px;
            color: #3e3e3e;
            font-size: 14px;
            border-top:1px solid #cbcbcb;
            border-left:1px solid #cbcbcb;
          }
          li:last-child{
            border-right:1px solid #cbcbcb;
          }
        }
      }
    }
  }
</style>
