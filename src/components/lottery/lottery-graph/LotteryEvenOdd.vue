<!--图表组件：双色球奇偶情况-->
<template>
    <div class="graph-wrap" id="lottery-even-odd">
    </div>
</template>

<script>
  //引入echarts图表库
  import echarts from 'echarts'
	export default {
		name: 'lotteryEvenOdd',
    props:{
			//注意这里的驼峰命名在html里面要转变为横线命名
			graphData:{
				type:Object,
        default:{}
      },
      selectedBall:{
				type:Array,
        default:[]
      }
    },
    mounted(){
			//初始化图表div
			var myChart = echarts.init(document.getElementById('lottery-even-odd'));
			//本注双色球奇偶情况
      var evenNum = 0,oddNum = 0;
      for(var i=0;i<this.selectedBall.length;i++){
      	if(this.selectedBall[i] %2 === 0){
          evenNum++;
        }else{
      		oddNum++;
        }
      }
      var evenOdd = oddNum+'奇'+evenNum+'偶';
      //双色球总注数
      var totalLotteryCnt = 0;
      var caseNum = 0;
      for(var key in this.graphData){
      	if(this.graphData.hasOwnProperty(key)) {
          totalLotteryCnt += this.graphData[key];
          if(key.indexOf(oddNum)!==-1){
            caseNum = this.graphData[key]
          }
        }
      }
      //本注双色球占比,保留2位小数
      var caseRatio = (caseNum / totalLotteryCnt * 100).toFixed(2);
			//饼图
      var options = {
          title: {
            text: '双色球历史奇偶分布统计(共'+totalLotteryCnt+'期)',
            subtext: '本注双色球'+evenOdd+',占比'+caseRatio+'%',
            left: 'center',
            //主副标题的间距
            itemGap:20
          },
          tooltip : {
            trigger: 'item',
            formatter: "{b} : {c}注 ({d}%)"
          },
          legend: {
            // orient: 'vertical',
            // top: 'middle',
            bottom: 10,
            left: 'center',
            data: ['西凉', '益州','兖州','荆州','幽州']
          },
          series : [
            {
              type: 'pie',
              radius : '65%',
              center: ['50%', '60%'],
              selectedMode: 'single',
              animationType:'expansion',
              data:[

                {value:this.graphData.Odd0, name: '0奇6偶'},
                {value:this.graphData.Odd1, name: '1奇5偶'},
                {value:this.graphData.Odd2, name: '2奇4偶'},
                {value:this.graphData.Odd3, name: '3奇3偶'},
                {value:this.graphData.Odd4, name: '4奇2偶'},
                {value:this.graphData.Odd5, name: '5奇1偶'},
                {value:this.graphData.Odd6, name: '6奇0偶'}
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
      }
      myChart.setOption(options);
    }
	}
</script>

<style lang="less" type="text/less" scoped>
  .graph-wrap{
    height:400px;
    width:700px;
    margin: 0 auto;
  }
</style>
