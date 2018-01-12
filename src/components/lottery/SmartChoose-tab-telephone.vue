<!--手机号投注-->
<template>
    <div class="wrap-fast">
      <!--输入框-->
      <div class="input-wrap">
        <div class="phone-number">
          手机号
        </div>
        <input type="text" v-model.trim="phoneNumber">
        <button class="get-lottery" @click="getNumber">获取号码</button>
        <!--号码显示区域-->
        <div class="lottery-show-area">
          <div v-for="(item,index) in lotteryDataList" class="lottery-each-wrap">
            <ul>
              <li v-for="(num,index2) in item" :class="index2===6?'ball-color-blue':'ball-color-red'">{{num}}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import {eventBus} from './../../eventBus'
  import _ from 'lodash'
	export default {
		name: 'telephoneLottery',
    data(){
			return {
        phoneNumber:'',
        //显示5注双色球
        lotteryNum:5,
        lotteryDataList:[]
      }
    },
    computed:{

    },
    methods:{
      getNumber(){
        this.lotteryDataList = [];
        //检查手机号是否合法,11位
        var regExp = /^1[3|4|5|7|8]\d{9}$/;
        if(regExp.test(this.phoneNumber)){
        	//根据手机号计算幸运号码
          var phoneNumberList = [];
          for(var i=0;i<this.phoneNumber.length;i++){
            phoneNumberList.push(parseInt(this.phoneNumber[i],10));
          }
          for(var i=0;i<this.lotteryNum;i++) {
            //生成号码的规则：低(1-11)中(12-22)高(23-33)区各选2个号
            //低区的号由手机的个位数随机选2个，不能重复，不能有0,10和11的选取有特殊规则
            var lowAreaList = this.getLowAreaList(phoneNumberList);
            var midAreaList = this.getMidAreaList(phoneNumberList);
            var highAreaList = this.getHighAreaList(phoneNumberList);
            var blue = Math.floor(Math.random() * 16 + 1);
            //最终双色球
            var finalList = [];
            for (var j = 0; j< 2; j++) {
              finalList.push(lowAreaList[j]);
              finalList.push(midAreaList[j]);
              finalList.push(highAreaList[j]);
            }
            finalList.sort(function (a,b) {
              return a-b;
            })
            finalList.push(blue)
            this.lotteryDataList.push(finalList);
          }
        }else{
          eventBus.$emit('PHONE_NUMBER_INVALID');
        }
      },
      //获取高区的号(23-33)
      getHighAreaList(phoneNumberList){
      	//随机啦
        var first = Math.floor(Math.random()*11 + 23);
        var second = Math.floor(Math.random()*11 + 23);
        while(second === first){
          second = Math.floor(Math.random()*11 + 23);
        }
        return [first,second];
      },
      //获取中区的号(12-22)
      getMidAreaList(phoneNumberList){
      	//相邻各个号码相加以及相乘，最终结果取在12-22之间去重的2个，如果没有2个符合要求，则机选2个
        var numList = [];
        for(var i=0;i<phoneNumberList.length-1;i++){
        	var multiply = phoneNumberList[i] * phoneNumberList[i+1];
        	var add = phoneNumberList[i] + phoneNumberList[i+1];
        	if(numList.indexOf(multiply)===-1 && multiply >= 12 && multiply <=22){
            numList.push(multiply)
          }
          if(numList.indexOf(add)===-1 && add >= 12 && add <=22){
            numList.push(add)
          }
        }
        //如果有2个以上的符合要求
        numList = _.shuffle(numList);
        if(numList.length >=2){
          return [numList[0],numList[1]];
        }else{
        	var first = Math.floor(Math.random()*11+12);
        	var second = Math.floor(Math.random()*11+12);
          while(first === second){
          	second = Math.floor(Math.random()*11+12);
          }
          return [first,second];
        }
      },
      //获取低区的号
      getLowAreaList(phoneNumberList){
      	//随机打乱数组
        phoneNumberList = _.shuffle(phoneNumberList);
        //取前2位,如果有0则随机1-11中的一个数字，并且不能和之前的相同
        var lowFirst = phoneNumberList[0];
        if(lowFirst === 0){
          lowFirst = Math.floor((Math.random()*11))+1;
        }
        var lowSecond = phoneNumberList[1];
        if(lowSecond === 0){
          lowSecond = Math.floor((Math.random()*11))+1;
        }
        //防止2个数相同
        while(lowSecond === lowFirst){
          lowSecond =  Math.floor((Math.random()*11))+1;
        }
        return [lowFirst,lowSecond]

      }
    }
	}
</script>

<style lang="less" type="text/less" scoped>
  .wrap-fast {
    margin: 30px 80px;
    .input-wrap{
      margin: 80px auto;
      width:400px;
      .phone-number{
        float:left;
        padding:0 10px;
        line-height: 40px;
        color:#909399;
        font-size: 12px;
        height:40px;
        background-color: #f5f7fa;
        border-top: 1px solid #dcdfe6;
        border-left: 1px solid #dcdfe6;
        border-bottom: 1px solid #dcdfe6;
        border-radius: 5px 0 0 5px;
      }
      input{
        border:1px solid #dcdfe6;
        height:40px;
        width:300px;
        border-radius: 0 5px 5px 0;
        padding:0 20px;
      }
      .get-lottery{
        width:160px;
        height:40px;
        border-radius: 20px;
        background-color: #f56c6c;
        margin: 50px auto;
        line-height: 40px;
        text-align: center;
        color:#fff;
        font-size: 16px;
        cursor: pointer;
        outline: none;
        border: none;
        //设置为block才能居中，原来是inline-block
        display: block;
        transition: all .5s;
        position: relative;
        &:hover{
          opacity: 0.8;
        }
      }
      .lottery-show-area{
          margin-top: 50px;
          .lottery-each-wrap{
            text-align: center;
            margin-bottom: 10px;
            height:40px;
            li{
              display: inline-block;
              width:33px;
              height:33px;
              margin: 5px 3px;
              line-height: 33px;
              text-align: center;
              font-weight: 500;
              cursor:pointer;
              color:#fff;
            }
            .ball-color-blue{
              background: url('./../../assets/icon/lottery_union.png') -140px 0 no-repeat ;
            }
            .ball-color-red{
              background: url('./../../assets/icon/lottery_union.png') -70px 0 no-repeat ;
            }
          }
      }
    }
  }
</style>
