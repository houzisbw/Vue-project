<template>
    <div class="graph-wrap" id="lottery-sum">
    </div>
</template>

<script>
  import echarts from 'echarts'
	export default {
		name: 'lotterySum',
    props:{
      //注意这里的驼峰命名在html里面要转变为横线命名
      graphData:{
        type:Object,
        default:''
      },
      selectedBall:{
        type:Array,
        default:[]
      }
    },
    mounted(){
			var myCharts = echarts.init(document.getElementById('lottery-sum'));
			//获取本期和值
      var sum = 0;
      this.selectedBall.forEach(function(item){
      	sum+=item
      });
      //横坐标数据:和值，纵坐标数据:注数
      var xAxisDataList = [],yAxisDataList = [];
      for(var key in this.graphData){
        if(this.graphData.hasOwnProperty(key)) {
          xAxisDataList.push(key);
          yAxisDataList.push(this.graphData[key]);
        }
      }
      var options = {
        title: {
          text: '双色球历史和值分布(所有红球之和)',
          subtext: '本注双色球和值为'+sum,
          //主副标题的间距
          itemGap:10
        },
        tooltip : {
          trigger: 'axis',
          formatter:'和值: {b0}<br />注数: {c0}'

        },
        legend: {
          data:['双色球注数'],
          left:'60%'
        },
        toolbox: {

        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis : [
          {
            type : 'category',
            nameLocation:'middle',
            name : '双色球和值',
            nameGap:20,
            data : xAxisDataList
          }
        ],
        yAxis : [
          {
            type : 'value',
            name : '双色球注数',
            nameLocation:'middle',
            nameGap:30
          }
        ],
        series : [
          {
            name:'双色球注数',
            type:'line',
            areaStyle: {normal: {}},
            data:yAxisDataList
          }
        ]
      }
      myCharts.setOption(options);
    }
	}
</script>

<style type="text/less" lang="less" scoped>
  .graph-wrap{
    height:400px;
    width:700px;
    margin: 0 auto;
  }
</style>
