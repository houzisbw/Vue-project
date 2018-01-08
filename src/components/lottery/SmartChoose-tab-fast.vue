<!--快捷选号组件-->
<template>
    <div class="wrap-fast">
      <!--红球区-->
      <div class="redball-area">
        <div class="title">
          <span class="redball-title">红球区</span>
          <span class="ball-desc">至少选择6个红球</span>
        </div>
        <!--红球区域-->
        <div class="redball-choose-area">
          <ul>
            <!--禁止选择里面的文本,style用于兼容火狐-->
            <li onselectstart="return false"
                style="-moz-user-select:none;"
                v-for="i in 33"
                @click="chooseRed(i)"
                :class="{'redball_active':isRedActive(i)}">{{i}}
            </li>
          </ul>
        </div>
      </div>
      <!--蓝球区-->
      <div class="blueball-area">
        <div class="title">
          <span class="blueball-title">蓝球区</span>
          <span class="ball-desc">至少选择1个蓝球</span>
        </div>
        <!--蓝球区域-->
        <div class="blueball-choose-area">
          <ul>
            <li onselectstart="return false"
                style="-moz-user-select:none;"
                v-for="i in 16"
                @click="chooseBlue(i)"
                :class="{'blueball_active':isBlueActive(i)}">{{i}}
            </li>
          </ul>
        </div>
      </div>
    </div>
</template>

<script>
  import _ from 'lodash'
	export default {
		name: 'smart-choose-tab-fast',
    data(){
			return{
          redBallList:[],
          blueBallList:[]
      }
    },
    computed:{

    },
    methods:{
    	chooseBlue(ballNumber){
    		var isSelectedBallExist = _.indexOf(this.blueBallList,ballNumber);
    		if(isSelectedBallExist !== -1){
    			//存在了，则去除该蓝球
          this.blueBallList = _.remove(this.blueBallList, function(item){
            return item !== ballNumber;
          })
        }else{
          this.blueBallList.push(ballNumber)
        }
      },
      chooseRed(ballNumber){
        var isSelectedBallExist = _.indexOf(this.redBallList,ballNumber);
        if(isSelectedBallExist !== -1){
          //存在了，则去除该蓝球
          this.redBallList = _.remove(this.redBallList, function(item){
            return item !== ballNumber;
          })
        }else{
          this.redBallList.push(ballNumber)
        }
      },
      //注意这里的函数用于绑定class
      isRedActive(index){
        for(var i=0;i<this.redBallList.length;i++){
          if(this.redBallList[i] === index){
            return true;
          }
        }
        return false;
      },
      isBlueActive(index){
        for(var i=0;i<this.blueBallList.length;i++){
          if(this.blueBallList[i] === index){
            return true;
          }
        }
        return false;
      }
    }
	}
</script>

<style type="text/less" lang='less' scoped>
  .wrap-fast{
    margin: 30px 80px;
    .redball-choose-area,.blueball-choose-area{
      li{
        float:left;
        width:33px;
        height:33px;
        margin: 5px 3px;
        background: url('./../../assets/icon/lottery_union.png') 0 0 no-repeat ;
        line-height: 33px;
        text-align: center;
        font-weight: 500;
        cursor:pointer;
        &:hover{
          background: url('./../../assets/icon/lottery_union.png') -35px 0 no-repeat ;
        }
      }
    }
    .redball-area{
      float:left;
      width:460px;
      .title{
        margin: 0 auto 10px auto;
        text-align: center;
        .redball-title{
          color:#ba2636;
          font-weight: bold;
        }
        .ball-desc{
          font-size: 12px;
          color:#cbcbcb;
          margin-left: 5px;
        }
      }
    }
    .blueball-area{
      float:right;
      width:300px;
      .title{
        margin: 0 auto 10px auto;
        text-align: center;
        .blueball-title{
          color: #015eca;
          font-weight: bold;
        }
        .ball-desc{
          font-size: 12px;
          color:#cbcbcb;
          margin-left: 5px;
        }
      }
    }
    .redball_active{
      background: url('./../../assets/icon/lottery_union.png') -70px 0 no-repeat !important;
      color:#fff;
    }
    .blueball_active{
      background: url('./../../assets/icon/lottery_union.png') -140px 0 no-repeat !important;
      color:#fff;
    }

  }
</style>
