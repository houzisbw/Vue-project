<!--快捷选号组件-->
<template>
    <div class="wrap-fast clearfix">
      <div class="clearfix">
        <!--红球区-->
        <div class="redball-area clearfix">
          <div class="title">
            <span class="redball-title">红球区</span>
            <span class="ball-desc">至少选择6个红球</span>
          </div>
          <!--红球区域-->
          <div class="redball-choose-area clearfix">
            <ul>
              <!--禁止选择里面的文本,style用于兼容火狐-->
              <li onselectstart="return false"
                  style="-moz-user-select:none;"
                  v-for="i in 33"
                  @click="chooseRed(i)"
                  :class="{'redball_active':isRedActive(i)}">{{i}}
                <!--遗漏期数-->
                <span class="missed-phase">{{redballLostTime[i]}}</span>
              </li>
            </ul>
            <!--遗漏提示-->
            <div class="lost-tip">
              遗漏
              <div class="lost-tip-arrow">
              </div>
              <div class="lost-tip-word">
                遗漏是指该号码自上次开出以来至本次未出现的期数
              </div>
            </div>
          </div>
          <!--红球机选区域-->
          <div class="random-choose">
            <select v-model="redballSelected" @change="randomChooseRedball()">
              <option v-for="i in 11">{{i+5}}</option>
            </select>
            <button class="red-button" @click="randomChooseRedball">机选红球</button>
            <a href="javascript:;" @click="clearRedBall">清空</a>
          </div>
        </div>
        <!--蓝球区-->
        <div class="blueball-area clearfix">
          <div class="title">
            <span class="blueball-title">蓝球区</span>
            <span class="ball-desc">至少选择1个蓝球</span>
          </div>
          <!--蓝球区域-->
          <div class="blueball-choose-area clearfix">
            <ul>
              <li onselectstart="return false"
                  style="-moz-user-select:none;"
                  v-for="i in 16"
                  @click="chooseBlue(i)"
                  :class="{'blueball_active':isBlueActive(i)}">{{i}}
                <!--遗漏期数-->
                <span class="missed-phase">{{blueballLostTime[i]}}</span>
              </li>
            </ul>
          </div>
          <!--蓝球机选区域-->
          <div class="random-choose">
            <select v-model="blueballSelected" @change="randomChooseBlueball()">
              <option v-for="i in 16">{{i}}</option>
            </select>
            <button class="blue-button" @click="randomChooseBlueball">机选蓝球</button>
            <a href="javascript:;" @click="clearBlueBall">清空</a>
          </div>
        </div>
      </div>
      <!--选中的信息-->
      <div class="choosen-info">
        <span class="info-wrap">
          您当前选中了<span class="red">{{redballNum}}</span>个红球,
          <span class="blue">{{blueballNum}}</span>个蓝球,
          共<span class="red">{{totalLotteryCount}}</span>注,
          共<span class="red">{{totalMoney}}</span>元
        </span>
        <!--文字中间的横线，z-index小于文字，被文字覆盖-->
        <i></i>
      </div>
      <!--选中的号码-->
      <div class="choosen-balls">
        <ul>
          <li v-for="(item,index) in redBallList" class="redball">{{item}}</li>
          <li v-for="(item,index) in blueBallList" class="blueball">{{item}}</li>
          <li class="delete-ball" v-if="isDeleteShow" @click="deleteAllBalls">删除</li>
        </ul>
      </div>
      <!--智能分析按钮-->
      <div class="analysis-wrap" v-if="isButtonShow">
        <button class="smart-analysis-button"
                :disabled="disableButton"
                :class="{'button-disable':disableButton}"
                @click="smartAnalysis">
          智能分析
        </button>
        <div class="why">
          <!--提示文字-->
          <div class="why-desc">
            智能分析将会从双色球各项历史数据统计类别分别进行分析评判，最终统计出该注综合评分!
            结果仅供参考
            <!--三角形-->
            <div class="triangle-outer">
            </div>
            <div class="triangle-inner">
            </div>
          </div>
        </div>
      </div>

      <!--未选择时的提示文字-->
      <div class="tips" v-if="!isDeleteShow">
        <img src="./../../assets/icon/dialog-lottery.png">
        <span>温馨提示：请选择号码(智能分析只能分析单注6+1)</span>
      </div>

      <!--分析后的各种文字数据-->
      <div class="lottery-analysis-wrap" v-if="!isButtonShowData">
        <!--总得分情况-->
        <div class="total-score" :class="currentLotteryTotalScore>60 ? 'total-score-high':(currentLotteryTotalScore>30 ? 'total-score-mid' : 'total-score-low' )">
          该注双色球总体得分为<span class="score" :class="currentLotteryTotalScore>60 ? 'total-score-high-color':(currentLotteryTotalScore>30 ? 'total-score-mid-color' : 'total-score-low-color' )">{{currentLotteryTotalScore}}</span>
        </div>
        <!--表格，各项分析统计的数据-->
        <table class="lottery-analysis-data">
          <tr>
            <th>分析类别</th>
            <th>该项得分</th>
            <th>详情图表</th>
          </tr>
          <tr  v-for="(item,index) in tableDataList">
            <!--如果不是图表-->
            <td class="item-td" v-if="!item.isGraph">{{item.name}}</td>
            <td class="item-td" v-if="!item.isGraph">{{scoreObj[item.type]}}</td>
            <td class="item-td" v-if="!item.isGraph" @click="toggleNext(index)" >{{item.isOpen?'点击收起':'点击展开'}}</td>
            <!--图表td,默认隐藏,占满3列-->
            <td class="graph-td" colspan="3" v-show="item.isShow" v-else >
              <!--<transition name="slow-slide" >-->
                <div class="graph-wrap" v-show="item.isShow">
                  <!--动态组件,传递图表参数-->
                  <component :is="item.component" :graph-data="item.graphData" :selectedBall="selectedBallList"></component>
                </div>
              <!--</transition>-->
            </td>
          </tr>
        </table>
      </div>
    </div>
</template>

<script>
  import _ from 'lodash'
  import axios from 'axios'
  //引入4个图表组件
  import LotteryEvenOdd from './../lottery/lottery-graph/LotteryEvenOdd'
  import LotteryExpand from './../lottery/lottery-graph/LotteryExpand'
  import LotteryGraphHistory from './../lottery/lottery-graph/LotteryGraphHistory'
  import LotterySum from './../lottery/lottery-graph/LotterySum'
	export default {
		name: 'smart-choose-tab-fast',
    components:{
      LotteryEvenOdd,
      LotteryExpand,
      LotteryGraphHistory,
      LotterySum
    },
    data(){
			return{
				  //各项得分
          evenOddScore:0,
          expandScore:0,
          //红球蓝球列表
          redBallList:[],
          blueBallList:[],
          //默认选中第一项
          redballSelected:6,
          blueballSelected:1,
          //红球蓝球遗漏情况
          redballLostTime:{},
          blueballLostTime:{},
          //智能分析按钮是否禁用,true为禁用
          isButtonDisable:false,
          //智能分析按钮是否显示
          isButtonShowData:true,
          //本注双色球
          selectedBallList:[],
          //双色球数据分数对象
          scoreObj:{
          	history:0,
            evenodd:0,
            expand:0,
            sum:0
          },
          //智能分析结果table的数据
          tableDataList:[
            {
            	type:'history',
            	name:'历史开奖',
              //是否是图表td
              isGraph:false,
              //是否展开
              isOpen:false
            },
            //图表数据项
            {
              isGraph:true,
              isShow:false,
              //每个图表的组件
              component:'LotteryGraphHistory',
              //图表数据
              graphData:'history'
            },
            {
              type:'evenodd',
              name:'奇偶分布',
              isGraph:false,
              isOpen:false
            },
            //图表数据项
            {
              isGraph:true,
              isShow:false,
              //每个图表的组件
              component:'LotteryEvenOdd',
              //图表数据,默认空对象
              graphData:{}
            },
            {
              type:'expand',
              name:'跨度走势',
              isGraph:false,
              isOpen:false
            },
            //图表数据项
            {
              isGraph:true,
              isShow:false,
              //每个图表的组件
              component:'LotteryExpand',
              //图表数据
              graphData:'expand'
            },
            {
              type:'sum',
              name:'和值走势',
              isGraph:false,
              isOpen:false
            },
            //图表数据项
            {
              isGraph:true,
              isShow:false,
              //每个图表的组件
              component:'LotterySum',
              //图表数据
              graphData:'sum'
            }
          ]

      }
    },
    computed:{
      //双色球总体得分
      currentLotteryTotalScore(){
      	var sum = 1,addSum=0,cnt=0;
      	for(var key in this.scoreObj){
          sum *= this.scoreObj[key];
          addSum += this.scoreObj[key];
          cnt++;
        }
        //最终分数是相乘和相加之间的平均数
      	return Math.floor((parseInt(sum / 100000000 * 100,10) + parseInt(addSum / cnt,10))/2);
      },
      //禁用或者启用按钮，false时启用按钮
      disableButton(){
      	//如果是处于响应期间，禁用按钮
      	if(this.isButtonDisable){
      		return true;
        }
      	//6+1时按钮才可用
        return !(this.redBallList.length === 6 && this.blueBallList.length === 1);
      },
      //智能分析按钮是否显示
      isButtonShow(){
        if(this.isButtonShowData){
          return this.redBallList.length + this.blueBallList.length;
        }else{
        	return false;
        }
      },
    	//是否显示删除按钮
      isDeleteShow(){
      	return this.redBallList.length + this.blueBallList.length;
      },
      redballNum(){
      	return this.redBallList.length;
      },
      blueballNum(){
        return this.blueBallList.length;
      },
      //总注数
      totalLotteryCount(){
      	//选择不合法
      	if(this.redBallList.length<6 || this.blueBallList.length<1){
      		return 0;
        }
      	var count = 1;
      	var redballNum = this.redBallList.length;
      	while(redballNum>6){
      		count *= redballNum--;
        }
        var t = this.redBallList.length - 6;
        while(t>1){
          count /= t--;
        }
        //精度问题，所以要变成整数
        return parseInt(count*this.blueBallList.length,10)
      },
      //总金额
      totalMoney(){
        if(this.totalLotteryCount === 0){
        	return 0;
        }else{
        	return this.totalLotteryCount * 2;
        }
      }
    },
    mounted:function(){
      this.getBallLostTime();
    },
    methods:{
    	//计算每一项得分
      caculateEachPartScore(partName,partData){
      	//奇偶部分分数
      	if(partName === 'EVEN_ODD'){
      		 //对应0奇数 - 6奇数
           var scoreList = [1,60,90,100,90,60,1];
           //获取奇偶情况
           var oddNum = 0;
           this.selectedBallList.forEach((item)=>{
           	  if(item%2 !== 0){
                oddNum++;
              }
           })
           return scoreList[oddNum];
        //跨度分布
        }else if(partName === 'EXPAND'){
          var dataList =  [];
          for(var key in partData){
            if(partData.hasOwnProperty(key)){
              dataList.push([parseInt(key,10),partData[key]]);
            }
          }
          //按注数升序排序
          dataList.sort(function(a,b){
          	return a[1]-b[1]
          })
          //该注双色球跨度
          this.selectedBallList.sort(function(a,b){
          	return a-b
          })
          var expand = this.selectedBallList[this.selectedBallList.length-1] - this.selectedBallList[0];
          //获取该注双色球的位置
          var pos = 0;
          dataList.forEach(function(item,index){
          	if(item[0] === expand){
          		pos = index
            }
          })
          //计算分数,排序后从小到大分数一次递增最大100分
          var score = parseInt((pos+1) / dataList.length * 100,10);
          return score
        //如果是和值分布
        }else if(partName === 'SUM'){
        	//获取和值
          var sum = 0;
          this.selectedBallList.forEach(function(item){
          	sum+=item;
          });
          console.log(sum)
          var dataList =  [];
          for(var key in partData){
            if(partData.hasOwnProperty(key)){
              dataList.push([parseInt(key,10),partData[key]]);
            }
          }
          //按注数进行升序排序
          dataList.sort(function(a,b){
          	return a[1]-b[1]
          })
          //该注双色球所处位置
          var pos = 0;
          dataList.forEach(function(item,index){
          	if(parseInt(item[0],10) === sum){
          		pos = index;
            }
          });
          //得分情况
          return parseInt((pos+1) / dataList.length * 100,10);

        }else if(partName === 'HISTORY'){
        	return partData ? 0:100
        }

      },
    	//展开关闭下一项(相邻的)
      toggleNext(index){
      	this.tableDataList[index].isOpen = !this.tableDataList[index].isOpen;
      	//图表toggle
        this.tableDataList[index+1].isShow = !this.tableDataList[index+1].isShow;
      },
    	//获取红球蓝球遗漏值
      getBallLostTime(){
      	axios.get('/lottery/getlosttime').then((resp)=>{
            var status = resp.data.status;
            if(status !== -1){
              this.redballLostTime = resp.data.red;
              this.blueballLostTime = resp.data.blue;
            }else{
              //查询出错
            }
        })
      },
    	//智能分析
      smartAnalysis(){
      	var param ={};
      	for(var i=0;i<this.redBallList.length;i++){
          param['red'+(i+1)] = this.redBallList[i]
        }
        param.blue = this.blueBallList[0];
        //禁用按钮
        this.isButtonDisable = true;
        this.selectedBallList = [];
      	axios.post('/lottery/analysis',param).then((response)=>{
      		  //本注双色球
            this.redBallList.forEach((item)=>{
            	this.selectedBallList.push(item);
            });
      		  //取消按钮禁用
            this.isButtonDisable = false;
            //显示图表
            this.isButtonShowData = false;
            var status = response.data.status;
            if(status === 1){
              //查询成功,将数据赋值给对应td
              for(var i=0;i<this.tableDataList.length;i++){
              	var item = this.tableDataList[i];
              	if(item.isGraph){
              		//如果是奇偶分布
              		if(item.component === 'LotteryEvenOdd'){
                    item.graphData = response.data.evenOdd;
                    //计算奇偶部分的分数
                    this.scoreObj['evenodd'] = this.caculateEachPartScore('EVEN_ODD')
                  //如果是跨度分布
                  }else if(item.component === 'LotteryExpand'){
                    item.graphData = response.data.expand;
                    this.scoreObj['expand'] = this.caculateEachPartScore('EXPAND',item.graphData);
                  //如果是和值分布
                  }else if(item.component === 'LotterySum'){
                    item.graphData = response.data.sum;
                    this.scoreObj['sum'] = this.caculateEachPartScore('SUM',item.graphData);
                  }else if(item.component === 'LotteryGraphHistory'){
                    item.graphData = response.data.isSame;
                    this.scoreObj['history'] = this.caculateEachPartScore('HISTORY',item.graphData);
                  }

                }
              }
            }else{
            	//查询出错
            }

        })
      },
      deleteAllBalls(){
        this.isButtonShowData = true;
      	this.redBallList = [];
      	this.blueBallList = [];
      },
    	//必须指定排序方法，否则按字符排序
    	sortFunc(a,b){
    		return a-b
      },
    	chooseBlue(ballNumber){
        this.isButtonShowData = true;
    		ballNumber = parseInt(ballNumber,10);
    		var isSelectedBallExist = _.indexOf(this.blueBallList,ballNumber);
    		if(isSelectedBallExist !== -1){
    			//存在了，则去除该蓝球
          this.blueBallList = _.remove(this.blueBallList, function(item){
            return item !== ballNumber;
          })
        }else{
          this.blueBallList.push(parseInt(ballNumber,10))
        }
        this.blueBallList.sort(this.sortFunc);

      },
      chooseRed(ballNumber){
        this.isButtonShowData = true;
        ballNumber = parseInt(ballNumber,10);
        var isSelectedBallExist = _.indexOf(this.redBallList,ballNumber);
        if(isSelectedBallExist !== -1){
          //存在了，则去除该蓝球
          this.redBallList = _.remove(this.redBallList, function(item){
            return item !== ballNumber;
          })
        }else{
          this.redBallList.push(parseInt(ballNumber,10))
        }
        this.redBallList.sort(this.sortFunc);
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
      },
      //机选红球
      randomChooseRedball(){
          this.isButtonShowData = true;
      	  //清空
          this.redBallList = [];
      	  //需要机选出的红球的个数
          var redballNum = parseInt(this.redballSelected,10);
          //已经选择的红球的个数
          var choosenBallNum = 0;
          while(choosenBallNum < redballNum){
          	  //随机一个红球
              var randomRedBall = Math.floor(Math.random()*33)+1;
              var isExist = false;
              for(var i=0;i<this.redBallList.length;i++){
              	if(this.redBallList[i] === randomRedBall){
                  isExist = true;
                  break;
                }
              }
              if(isExist) continue;
              else this.redBallList.push(parseInt(randomRedBall,10));
              choosenBallNum++;
          }
          this.redBallList.sort(this.sortFunc);
      },
      clearRedBall(){
        this.isButtonShowData = true;
      	this.redBallList = [];
      },
      //机选蓝球
      randomChooseBlueball(){
        this.isButtonShowData = true;
        //清空
        this.blueBallList = [];
        //需要机选出的红球的个数
        var blueballNum = parseInt(this.blueballSelected,10);
        //已经选择的红球的个数
        var choosenBallNum = 0;
        while(choosenBallNum < blueballNum){
          //随机一个红球
          var randomRedBall = Math.floor(Math.random()*16)+1;
          var isExist = false;
          for(var i=0;i<this.blueBallList.length;i++){
            if(this.blueBallList[i] === randomRedBall){
              isExist = true;
              break;
            }
          }
          if(isExist) continue;
          else this.blueBallList.push(parseInt(randomRedBall,10));
          choosenBallNum++;
        }
        this.blueBallList.sort(this.sortFunc);
      },
      clearBlueBall(){
          this.isButtonShowData = true;
          this.blueBallList = [];
      }
    }
	}
</script>

<style type="text/less" lang='less' scoped>
  .wrap-fast{
    margin: 30px 80px;
    .choosen-info{
      text-align: center;
      margin-top: 30px;
      font-size: 13px;
      color: #9f9f9f;
      .red{
        color:#ba2636;
      }
      .blue{
        color:#015eca;
      }
      .info-wrap{
        z-index:10;
        background-color: #fff;
        display: inline-block;
        //只有设置了position不是static,index才会起作用
        position: relative;
        padding:0 10px;
      }
      i{
        display: block;
        margin: -7px 0 0 0;
        height: 1px;
        border-top: 1px dotted #aeaeae;
        position: relative;
        z-index: 9;
      }
    }
    .redball-choose-area,.blueball-choose-area{
      position: relative;
      li{
        float:left;
        width:33px;
        height:33px;
        margin: 5px 3px 15px 3px;
        background: url('./../../assets/icon/lottery_union.png') 0 0 no-repeat ;
        line-height: 33px;
        font-weight: 500;
        cursor:pointer;
        position: relative;
        text-align: center;
        &:hover{
          background: url('./../../assets/icon/lottery_union.png') -35px 0 no-repeat ;
        }
        .missed-phase{
          //让里面的文字居中
          display: inline-block;
          text-align: center;
          width:33px;
          height:10px;
          position: absolute;
          left:0;
          top:25px;
          color:#cbcbcb;
          font-size: 10px;
        }
      }
      .lost-tip{
        position: absolute;
        left:-35px;
        top:39px;
        color:#cbcbcb;
        font-size: 13px;
        &:hover .lost-tip-word{
          display: block;
        }
        .lost-tip-arrow{
          position: absolute;
          width:0;
          height:0;
          right:-15px;
          top:2px;
          border-left:5px solid #b0b0b0;
          border-top:5px solid transparent;
          border-bottom:5px solid transparent;
          border-right:5px solid transparent;
        }
        .lost-tip-word{
          border:1px solid #d7b179;
          background-color: #fffee4;
          width:150px;
          padding: 5px;
          position: absolute;
          top:20px;
          color: #797979;
          font-size: 12px;
          display: none;
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
    .random-choose{
      margin:30px auto 5px auto;
      text-align: center;
      select{
        border-radius: 4px;
        border-color:#cbcbcb;
        padding:4px 5px 4px 5px;
        option{
          text-align: center;
        }
      }
      a{
        color: #aaaaaa;
        font-size: 14px;
        position: relative;
        top:-1px;
        margin-left: 3px;
      }
      .red-button{
        outline:none;
        border:1px solid #cbcbcb;
        border-radius: 4px;
        padding:4px 4px;
        color:#ba2636;
        position: relative;
        top:1px;
        background-color: #fff;
        margin-left: 5px;
        cursor:pointer;
        transition: all .5s;
        &:hover{
          color:#fff;
          background-color: #ba2636;
          border-color:#ba2636;
        }
      }
      .blue-button{
        outline:none;
        border:1px solid #cbcbcb;
        border-radius: 4px;
        padding:4px 4px;
        color:#015eca;
        position: relative;
        top:1px;
        background-color: #fff;
        margin-left: 5px;
        cursor:pointer;
        transition: all .5s;
        &:hover{
          color:#fff;
          background-color: #015eca;
          border-color:#015eca;
        }
      }
    }
    .choosen-balls{
      margin: 40px auto;
      text-align: center;
      .redball{
        background: url('./../../assets/icon/lottery_union.png') -70px 0 no-repeat !important;
      }
      .blueball{
        background: url('./../../assets/icon/lottery_union.png') -140px 0 no-repeat !important;
      }
      li{
        //居中的关键,不能用float
        display: inline-block;
        width:33px;
        height:33px;
        margin: 5px 3px;
        //background: url('./../../assets/icon/lottery_union.png') -70px 0 no-repeat ;
        line-height: 33px;
        text-align: center;
        font-weight: 500;
        cursor:pointer;
        color:#fff;
      }
      .delete-ball{
        color: #b6b6b6;
        font-size: 13px;
      }
    }
    .tips{
      height:60px;
      text-align: center;
      margin-top: 60px;
      line-height: 60px;
      img{
        width:60px;
        height:60px;
        margin-right: 30px;
        display: inline-block;
        //实现div内图片文字同一行
        vertical-align: middle;
      }
      span{
        color:#8b8b8b;
        font-size: 15px;
        line-height: 60px;
        height:60px;
        display: inline-block;
      }
    }
    .smart-analysis-button{
      width:160px;
      height:40px;
      border-radius: 20px;
      background-color: #f56c6c;
      margin: 0 auto;
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
    .button-disable{
      opacity: 0.6;
      cursor: not-allowed;
    }
    .analysis-wrap{
      position: relative;
      width:180px;
      margin: 0 auto;
      .why{
        position: absolute;
        right:-30px;
        top:11px;
        width:20px;
        height:20px;
        background:url('./../../assets/icon/why-analysis.png') center center no-repeat;
        background-size: 20px 20px;
        &:hover .why-desc{
          display: block;
        }
        .why-desc{
          display: none;
          position: absolute;
          left:20px;
          top:-40px;
          width:80px;
          margin-left: 20px;
          padding:10px;
          border:1px solid #d7b179;
          background-color: #fffee4;
          z-index:100;
          font-size: 12px;
          color: #656565;
          text-align: justify;
          border-radius: 6px;
          .triangle-inner{
            @borderInnerWidth:10px;
            position: absolute;
            left:-18px;
            top:40px;
            width:0;
            height:0;
            border-top:@borderInnerWidth solid transparent;
            border-left:@borderInnerWidth solid transparent;
            border-bottom:@borderInnerWidth solid transparent;
            border-right:@borderInnerWidth solid #fffee4;
          }
          .triangle-outer{
            @borderInnerWidth:10px;
            position: absolute;
            left:-20px;
            top:40px;
            width:0;
            height:0;
            border-top:@borderInnerWidth solid transparent;
            border-left:@borderInnerWidth solid transparent;
            border-bottom:@borderInnerWidth solid transparent;
            border-right:@borderInnerWidth solid #d7b179;
          }

        }

      }
    }
    .lottery-analysis-wrap{
      margin-top: 30px;
      margin-bottom: 80px;
      .total-score{
        padding-left: 60px;
        height:40px;
        margin: 0 auto;
        width:250px;
        font-size: 20px;
        color: #4c4c4c;
        font-weight: bold;
        line-height: 40px;
        font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
        .score{
          color:#00bb29;
          font-size: 22px;
        }
      }
      .total-score-high{
        background: url('./../../assets/icon/lottery-rate-high.png') left top no-repeat;
        background-size: 40px 40px;
      }
      .total-score-mid{
        background: url('./../../assets/icon/lottery-rate-mid.png') left top no-repeat;
        background-size: 40px 40px;
      }
      .total-score-low{
        background: url('./../../assets/icon/lottery-rate-low.png') left top no-repeat;
        background-size: 40px 40px;
      }
      .total-score-high-color{
        color: #00bb29!important;
      }
      .total-score-mid-color{
        color: #faef42 !important;
      }
      .total-score-low-color{
        color:#CF3A2F!important;
      }
      .lottery-analysis-data{
        width:100%;
        margin-top: 50px;
        border-collapse: collapse;
        vertical-align: middle;
        .graph-wrap{
          min-height:100px;
        }
        th{
          color:#909399;
          font-weight: bold;
          text-align: center;
          padding:0 0 15px 0;
        }
        td{
          text-align: center;
          padding: 20px 0;
          color:#606266;
          vertical-align: middle;
          font-size: 14px;
          overflow: hidden;
          box-sizing: border-box;
        }
        .item-td:last-child{
          color:#65bcf7;
          cursor: pointer;
        }
        tr{
          border-bottom: 1px solid #f0f0f0;
          transition: all .5s;
        }
        tr:not(:first-child){
          &:hover{
            background-color: #f2f7f3;
          }
        }
      }
    }

    //动画
    .slow-slide-enter,.slow-slide-leave-to{
      height:0;
    }
    .slow-slide-enter-to,.slow-slide-leave{
      height:400px;
    }
    .slow-slide-enter-active,.slow-slide-leave-active{
      transition: all .5s ease;
    }


  }
</style>
