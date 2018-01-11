<!--跨度走势-->
<template>
    <div class="graph-wrap" id="lottery-expand">
    </div>
</template>

<script>
  //引入echarts图表库
  import echarts from 'echarts'
	export default {
		name: 'lotteryExpand',
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
    methods:{
			sortBy(a,b){
				return a-b
      },
      sortData(a,b){
				return a[0] - b[0]
      }
    },
    mounted(){
      //初始化图表div
      var myChart = echarts.init(document.getElementById('lottery-expand'));
      //双色球跨度
      this.selectedBall.sort(this.sortBy);
      var expand = this.selectedBall[this.selectedBall.length-1] - this.selectedBall[0];
      //横坐标list,和值从小到大
      var dataList =  [];
      for(var key in this.graphData){
      	if(this.graphData.hasOwnProperty(key)){
          dataList.push([parseInt(key,10),this.graphData[key]]);
        }
      }
      dataList.sort(this.sortData);
      var xAxisDataList = [],yAxisDataList = [],totalNum = 0,caseNum = 0;
      dataList.forEach(function(item){
        xAxisDataList.push(item[0]);
        yAxisDataList.push(item[1]);
        totalNum += item[0];
        if(item[0] === expand){
          caseNum = item[1];
        }
      })

      //历史占比
      var caseRatio = (caseNum / totalNum * 100).toFixed(2);


      var options = {
        title : {
          text: '双色球历史跨度走势(红球最大-红球最小)',
          subtext: '该注双色球跨度为'+expand+',历史占比'+caseRatio+'%'
        },
        tooltip : {
          trigger: 'axis',
          formatter:'跨度值: {b0}<br />注数: {c0}'
        },
        legend: {
          data:['双色球注数'],
          left:'60%'
        },
        toolbox: {
          show : true,
          feature : {
            dataView : {show: true, readOnly: false},
            magicType : {show: true, type: ['line', 'bar']},
            restore : {show: true}
          }
        },
        calculable : true,
        xAxis : [
          {
            type : 'category',
            data : xAxisDataList,
            nameLocation:'middle',
            name : '跨度值',
            nameGap:40
          }
        ],
        yAxis : [
          {
            type : 'value',
            name : '双色球注数',
            nameLocation:'middle',
            nameGap:40
          }
        ],
        series : [
          {
            name:'双色球注数',
            type:'bar',
            data:yAxisDataList,
            markPoint : {
              data : [
                {type : 'max', name: '最大值'},
                {type : 'min', name: '最小值'}
              ]
            },
            markLine : {

            }
          }

        ]
      }
      myChart.setOption(options)
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
