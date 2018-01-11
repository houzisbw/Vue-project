<!--历史开奖图表组件-->
<template>
    <div class="graph-wrap">
      <span :class="graphData ? 'colorRed':'colorGreen'">{{isSame}}</span>
    </div>
</template>

<script>
	export default {
		name: 'lotteryGraphHistory',
    //注意这里的驼峰命名在html里面要转变为横线命名
    props:{
      //注意这里的驼峰命名在html里面要转变为横线命名
      graphData:{
        type:Boolean,
        default:''
      }
    },
    computed:{
			isSame(){
				return !this.graphData ? '恭喜！该双色球历史上从未开出~' : '糟糕！该双色球历史上已经开出!'
			}
    }
	}
</script>

<style type="text/less" lang="less" scoped>
  .graph-wrap{
    height:400px;
    width:700px;
    margin: 0 auto;
    text-align: center;
    line-height: 400px;
    span{
      font-size: 20px;
      font-weight: bold;
    }
    .colorRed{
      color:#e05244;
    }
    .colorGreen{
      color:#00bb29;
    }
  }
</style>
