<!--双色球历史数据图表-->
<template>
  <div>
    <div class="wrap">
      <!--title区域-->
      <div class="title">
        <span class="title-word">双色球历史走势</span>
        <a class="latest"
           v-for="(item,index) in latestPhaseArray"
           :class="{'phase-active':phaseActiveIndex === index}"
           @click="showLatest(item,index)">
          最近{{item}}期
        </a>
        <div class="search">
          <input type="text" id="lottery-start-phase" v-model="phaseStart">
          <span>&nbsp;期至&nbsp;</span>
          <input type="text" id="lottery-end-phase" v-model="phaseEnd">
          <span>&nbsp;期(最多显示100期)</span>
          <div class="search-button" @click="searchPhase">查询</div>
        </div>
      </div>
      <!--标注形式-->
      <div class="options">
        <span>标注形式选择:</span>
        <input type="checkbox" id="lottery-graph-lost" v-model="lostHighLightChecked"><label for="lottery-graph-lost">遗漏高亮</label>
        <input type="checkbox" id="lottery-graph-line" v-model="blueBallLineChecked"><label for="lottery-graph-line" >折线</label>
        <input type="checkbox" id="lottery-graph-repeat" v-model="ballRepeatedChecked"><label for="lottery-graph-repeat">重号</label>
        <input type="checkbox" id="lottery-graph-successive" v-model="ballConsecutiveChecked"><label for="lottery-graph-successive">连号</label>
      </div>
      <!--双色球表格-->
      <table class="lottery-data-table">
        <!--表头-->
        <tr>
          <th class="phase-number" title="点击进行排序" @click="sortLotteryList">
            <span>期号</span>
          </th>
          <!--红球-->
          <th v-for="i in 33" >{{i}}</th>
          <!--蓝球-->
          <th v-for="j in 16" >{{j}}</th>
        </tr>
        <!--内容-->
        <tr v-for="(item,index) in lotteryDataList">
          <!--期数-->
          <td :class="{'sep-line':(index+1)%5===0 && index !== lotteryDataList.length-1}">
            {{item.time}}

          </td>
          <!--红球-->
          <td v-for="j in 33" :class="{'sep-line':(index+1)%5===0 && index !== lotteryDataList.length-1,'lottery-ball-highlight':isBallHighLight(index,j-1)}">
            <!--是否是当期的红球,v-if可以用函数判断-->
            <div v-if="isRedBall(item,j)"
                 class="red-ball"
                 :class="{'repeated-ball':isRepeatedBall(index,j-1),
                          'consecutive-ball':isConsecutiveBall(index,j-1)
                 }">
              {{j}}
            </div>
          </td>
          <!--蓝球-->
          <td v-for="k in 16" :class="{'sep-line':(index+1)%5===0 && index !== lotteryDataList.length-1,'lottery-ball-highlight':isBallHighLight(index,k+32)}">
            <!--是否是当期的红球,v-if可以用函数判断-->
            <div v-if="isBlueBall(item,k)"
                 class="blue-ball"
                 :class="{'repeated-ball':isRepeatedBall(index,k+32)}">
              {{k}}
            </div>
          </td>
        </tr>
        <!--折线图,不能在css里面指定宽高-->
        <canvas class="lottery-foldline-canvas"
                width="368"
                :height="canvasHeight"
                v-show="blueBallLineChecked"
                id="lottery-foldline-canvas">
        </canvas>
      </table>
      <div class="lottery-data-desc">
        <!--参数说明标题-->
        <div class="lottery-data-desc-title">
          参数说明
        </div>
        <div class="lottery-param">
          <span>遗漏高亮:</span>&nbsp;高亮显示每个球自上期开出到本期间隔的期数
        </div>
        <div class="lottery-param">
          <span>重号:</span>&nbsp;以橙色标注出与上期开奖号相同的号
        </div>
        <div class="lottery-param">
          <span>连号:</span>&nbsp;以蓝色标注出每期相邻的号码
        </div>
        <div class="lottery-param">
          <span>折线:</span>&nbsp;用折线连接蓝球显示蓝球走势
        </div>
      </div>
    </div>
    <!--底部padding-->
    <!--用于让底部和内容隔开一定距离-->
    <div class="bottom-padding">
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import {eventBus} from './../../eventBus'
	export default {
		name: 'lotteryHistory',
    data(){
			return{
				checkBoxArray:[],
        //最近期数
        latestPhaseNum:30,
        //双色球数据数组
        lotteryDataList:[],
        //最近期数数组
        latestPhaseArray : [30,50,100],
        phaseActiveIndex:0,
        //起止期数
        phaseStart:'',
        phaseEnd:'',
        //排序flag:默认降序排列
        isSortDown:true,
        //画布高度，随着蓝球个数动态变化
        canvasHeight:2400,
        //蓝球折线显示与否
        blueBallLineChecked:true,
        //遗漏高亮显示与否
        lostHighLightChecked:false,
        //重号显示与否
        ballRepeatedChecked:false,
        //连号
        ballConsecutiveChecked:false,
        //显示遗漏高亮的二维数组,数组元素是对象,里面2个key，分别是原始数据和是否显示遗漏高亮(由原始数据计算出)
        //红蓝球一起,前33个红，后16个蓝
        lotteryLostHighLightMatrix:[]
      }
    },
    mounted(){
      this.getLotteryData(this.latestPhaseNum);
    },
    methods:{
    	//是否高亮
      isBallHighLight(row,col){
      	return this.lostHighLightChecked && this.lotteryLostHighLightMatrix[row][col].isHighLight;
      },
      //是否重号
      isRepeatedBall(row,col){
      	return this.ballRepeatedChecked && this.lotteryLostHighLightMatrix[row][col].isRepeated;
      },
      //是否连号
      isConsecutiveBall(row,col){
      	return this.ballConsecutiveChecked && this.lotteryLostHighLightMatrix[row][col].isConsecutive;
      },
    	//排序
      sortLotteryList(){
        if(this.isSortDown){
        	this.lotteryDataList.sort(function(a,b){
        		return a.time - b.time
          })
        }else{
          this.lotteryDataList.sort(function(a,b){
            return b.time - a.time
          })
        }
        this.isSortDown = !this.isSortDown;
        //画图
        this.drawBlueBallLineGraph();
        //遗漏值高亮
        this.initLotteryLostHighLightMatrix(this.lotteryDataList)
      },
    	//查询
      searchPhase(){
      	var start = this.phaseStart,
            end = this.phaseEnd;
      	//判断是否合法
        var regExp = /^\d{5}$/;
        //如果不合法
        if(!(regExp.test(start) && regExp.test(end) && start<=end)){
          eventBus.$emit('LOTTERY_SEARCH_PARAM_INVALID');
          return;
        }
      	axios.post('/lottery/searchPhase',{
      		start:start,
          end:end
        }).then((resp)=>{
            var status = resp.data.status;
            //查询成功
            if(status === 1){
            	if(resp.data.lotteryData.length === 0){
                eventBus.$emit('LOTTERY_SEARCH_EMPTY');
                return;
              }
              this.lotteryDataList = resp.data.lotteryData;
            	this.drawBlueBallLineGraph();
            	this.initLotteryLostHighLightMatrix(this.lotteryDataList)
            }else{
              //查询出错

            }

        })
      },
    	//最近期数
      showLatest(num,index){
        this.getLotteryData(num);
        this.phaseActiveIndex = index;
      },
    	//index位置是否是蓝球
      isBlueBall(ballObj,index){
      	return parseInt(ballObj.blue,10) === index;
      },
    	//index位置是否是红球
    	isRedBall(ballObj,index){
    		var is = false;
    		for(var key in ballObj){
    			if(ballObj.hasOwnProperty(key)){
            if(key.indexOf('red') !== -1){
              if(ballObj[key] === index){
              	is = true;
              }
            }
          }
        }
        return is;
      },
      //画折线图
      drawBlueBallLineGraph(){
        var cnt = 1,ballHeight = 24,ballWidth = 23;
        //获取画图canvas
        var canvas = document.getElementById('lottery-foldline-canvas');
        //改变画布大小(宽高被设置时，画布会被清空,但是我这里是在清空后再画的图，为啥也画不出来)
        //折中办法：将canvas高度设置为一个大数，同时在父容器设置overflow:hidden隐藏掉多余的canvas
        //this.canvasHeight = ballHeight * this.lotteryDataList.length;
        var ctx = canvas.getContext('2d');
        //清空画布(clearRect方法无效？？？)
        canvas.height=canvas.height;
        ctx.strokeStyle = "#2c71e0";
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        //获取蓝球坐标
        var lineList = [];
        for(var i=0;i<this.lotteryDataList.length -1 ;i++){
          var blueBall = this.lotteryDataList[i].blue;
          //需要查看下一个蓝球在自己的左还是右还是正下方来确定画线起始的位置时在左还是右
          var nextBall = this.lotteryDataList[i+1].blue;
          //每个球的线段是2组在坐标值
          var xDistanceStart,yDistanceStart,xDistanceEnd,yDistanceEnd;
          //修正值：让画线始终点在球体内部
          var offset  = 3;
          //下一个球在自己右侧
          if(nextBall > blueBall){
            //起始坐标
            xDistanceStart = blueBall*ballWidth - offset;
            yDistanceStart = (cnt-1) * ballHeight + ballHeight/2;
            //终止坐标
            xDistanceEnd = (nextBall - 1)*ballWidth + offset;
            yDistanceEnd = cnt*ballHeight + ballHeight/2;
            //下一个球在自己正下方
          }else if(nextBall === blueBall){
            xDistanceStart = (blueBall-1)*ballWidth + ballWidth/2;
            yDistanceStart = cnt*ballHeight;

            xDistanceEnd = (blueBall-1)*ballWidth + ballWidth/2;
            yDistanceEnd = cnt*ballHeight;
            //下一个球在自己的左侧
          }else{
            xDistanceStart = (blueBall - 1)*ballWidth + offset;
            yDistanceStart = (cnt-1) * ballHeight + ballHeight/2;

            xDistanceEnd = nextBall * ballWidth - offset;
            yDistanceEnd = cnt*ballHeight + ballHeight/2;
          }
          lineList.push({
            xStart:xDistanceStart,
            yStart:yDistanceStart,
            xEnd:xDistanceEnd,
            yEnd:yDistanceEnd
          });
          cnt++;
        }
        //只有一个球则不画线
        if(lineList.length <1) return;
        //画图
        lineList.forEach(function(item){
          ctx.moveTo(item.xStart,item.yStart)
          ctx.lineTo(item.xEnd,item.yEnd)
        });
        ctx.stroke();
      },
      //初始化遗漏高亮数组
      initLotteryLostHighLightMatrix(lotteryDataList){
      	//清空数组
        this.lotteryLostHighLightMatrix = [];
      	lotteryDataList.forEach((item,index)=>{
      		  var ballList = [];
      		  //33红，16蓝
            for(var i=0;i<49;i++){
            	//isEmpty:0表示空,1表示有值
              //isHighLight:true为高亮
              ballList.push({
                isEmpty:0,
                //遗漏高亮
                isHighLight:false,
                //重号
                isRepeated:false,
                //连号
                isConsecutive:false
              })
            }
            //红球填充
            for(var i=1;i<=6;i++){
              ballList[item['red'+i]-1].isEmpty = 1;
            }
            //蓝球填充
            ballList[item.blue+32].isEmpty = 1;
            this.lotteryLostHighLightMatrix.push(ballList);
        });
        //计算需要高亮的区域
        for(var i=0;i<=48;i++){
        	  var j=0;
        	  //防止越界很重要
            while(j<this.lotteryLostHighLightMatrix.length && this.lotteryLostHighLightMatrix[j][i].isEmpty === 0){
              this.lotteryLostHighLightMatrix[j][i].isHighLight = true;
              j++;
            }
        }
        //计算重号
        for(var i=0;i<=48;i++){
        	for(var j=0;j<this.lotteryLostHighLightMatrix.length;j++){
        		if(this.lotteryLostHighLightMatrix[j][i].isEmpty === 1){
        			//下一个球
        			var t = j+1;
        			while(t<this.lotteryLostHighLightMatrix.length && this.lotteryLostHighLightMatrix[t][i].isEmpty===1 && !this.lotteryLostHighLightMatrix[t][i].isRepeated){
                this.lotteryLostHighLightMatrix[t][i].isRepeated = true;
        				t++;
              }
            }
          }
        }
        //计算连号
        for(var i=0;i<this.lotteryLostHighLightMatrix.length;i++){
        	for(var j=0;j<=48;j++){
        		if(this.lotteryLostHighLightMatrix[i][j].isEmpty===1){
        			var t = j+1;
        			while(t<=48 && this.lotteryLostHighLightMatrix[i][t].isEmpty===1){
                this.lotteryLostHighLightMatrix[i][t].isConsecutive = true;
                t++;
              }
            }
          }
        }

      },
    	getLotteryData(phaseNum){
    		axios.post('/lottery/getHistoryData',{phaseNum:phaseNum}).then((resp)=>{
            let status = resp.data.status;
            if(status === 1){
            	this.lotteryDataList = resp.data.lotteryData;
            	this.phaseStart = this.lotteryDataList[this.lotteryDataList.length-1].time;
              this.phaseEnd = this.lotteryDataList[0].time;
              //初始化遗漏高亮数组
              this.initLotteryLostHighLightMatrix(this.lotteryDataList);
              //画图
              this.drawBlueBallLineGraph();
            }else{
            	//查询出错
            }
        })
      }
    }

	}
</script>

<style lang="less" type="text/less" scoped>
  .bottom-padding{
    height:200px;
    width:100%;
  }
  .wrap{
    margin: 20px auto;
    width:1200px;
    background-color: #fff;
    border:1px solid #d3d3d3;
    border-radius: 10px;
    box-shadow: 0 0 3px 3px #d3d3d3;
    .title{
      height:50px;
      border-bottom: 1px solid #cbcbcb;
      border-radius: 10px 10px 0 0;
      line-height: 50px;
      padding-left: 50px;
      background: url('./../../assets/icon/lottery-icon.png') 15px center no-repeat #f1f1f1;
      background-size: 40px 40px;
      .title-word{
        font-size: 17px;
        padding-left:20px;
        padding-right: 50px;
        font-weight: bold;
        color: #afafaf;
        font-family: SansSerif;
      }
      .latest{
        color: #9c9c9c;
        font-size: 14px;
        cursor:pointer;
        padding-right:10px;
        transition: all .5s;
        &:hover{
          color:#409eff;
        }
      }
      .phase-active{
        color:#409eff;
      }
      .search{
        float:right;
        margin-right: 20px;
        height:100%;
        input{
          width:60px;
          border-radius: 5px;
          outline: none;
          border: 1px solid #cbcbcb;
          height:25px;
          padding:0 10px;
        }
        span{
          color:#9c9c9c;
          font-size: 14px;
        }
        .search-button{
          @height:26px;
          margin-left: 10px;
          height:@height;
          padding:0 20px;
          line-height: @height;
          float:right;
          border-radius: @height;
          background-color: #e05244;
          margin-top: 13px;
          color:#fff;
          font-size: 14px;
          text-align: center;
          cursor: pointer;
          transition: all .5s;
          &:hover{
            background-color: #e0786f;
          }
        }

      }
    }
    .options{
      height:30px;
      text-align: center;
      line-height: 30px;
      font-size: 13px;
      color: #9f9f9f;
      span{
        margin-right: 5px;
      }
      input{
        position: relative;
        top:2px;
      }
      label{
        margin-right: 10px;
      }
    }
    .lottery-data-table{
      border-collapse: collapse;
      position: relative;
      overflow: hidden;
      th{
        height:25px;
        font-size: 13px;
        vertical-align: middle;
        background-color: #f0e5c6;
        color: #535353;
        border:1px solid #fff;
        border-top:none;
        text-align: center;
      }
      //折线图
      .lottery-foldline-canvas{
        position: absolute;
        right:0;
        top:25px;
      }
      .phase-number{
        span{
          position: relative;
          left:-8px;
        }
        background: url('./../../assets/icon/lottery-sort.png') 90% center no-repeat #f0e5c6;
        background-size: 20px 20px;
        cursor:pointer;
      }

      tr:hover {
        background-color: #f3ad8a;
      }
      tr:hover td{
        background: none!important;
      }
      tr:hover td:first-child{
        color:#fff;
      }
      th:not(:first-child){
        width:22px;
      }
      th:first-child{
        width:70px;
      }
      td{
        border:1px solid #fff;
        border-top:none;
        text-align: center;
        height:23px;
        background-color: #ededed;
        vertical-align: middle;
        font-size: 12px;
        color:#535353;
      }
      //遗漏高亮区域
      .lottery-ball-highlight{
        background-color: #71bded!important;
      }

      //红球蓝球分割线
      td:nth-child(34),th:nth-child(34),td:nth-child(1),th:nth-child(1){
        border-right:1px solid #d6d6d6;
      }
      //蓝球区域背景色,大于等于35序号
      td:nth-child(n+35){
        background-color: #d9dfed;
      }

      .red-ball,.blue-ball{
        @ballWidth:22px;
        width:@ballWidth;
        height:@ballWidth;
        border-radius: @ballWidth;
        color:#fff;
        line-height: @ballWidth;
      }
      .red-ball{
        background-color: #e05244;
      }

      .blue-ball{
        background-color: #2c71e0;
      }
      //重号样式
      .repeated-ball{
        background-color: #e08921!important;
      }
      //连号样式
      .consecutive-ball{
        background-color: #5fb7e0 !important;
      }
      //分隔线
      .sep-line{
        border-bottom: 1px solid #bfbfbf !important;
      }
    }
    .lottery-data-desc{
      padding: 15px;
      .lottery-data-desc-title{
        padding-left: 50px;
        height:35px;
        font-weight: bold;
        color:#898989;
        background: url('./../../assets/icon/lottery-param-desc.png') left center no-repeat;
        background-size: 35px 35px;
        line-height: 35px;
      }
      .lottery-param{
        span{
          color: #575757;
          font-weight: bold;
        }
        color: #6a6a6a;
        font-size: 13px;
        margin-top: 10px;
      }
    }
  }
</style>
