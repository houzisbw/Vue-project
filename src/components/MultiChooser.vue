<template>
    <div>
      <ul class="multi-choose">
        <li v-for="(item,index) in selections">
          {{item.label}}
        </li>
        <li class="add">添加</li>
      </ul>
    </div>
</template>

<script>
	export default {
		name: 'multi-chooser',
    props: {
			//每个选项的数据，名称和值
      selections:{
      	type:Array,
        default:[{
            label:'按钮',
            value:0
        }]
      }
    }

	}
</script>

<style lang="less" type="text/less" scoped>
  @liHeight:30px;
  .multi-choose {
    margin-top: 8px;
    li{
      display: inline-block;
      padding:0 15px;
      background-color: #57a6e0;
      border-radius: 5px;
      color:#fff;
      line-height: @liHeight;
      height:@liHeight;
      text-align: center;
      margin-right: 15px;
      font-size: 14px;
      opacity: 1;
      transition: opacity .5s ease;
      &:hover{
        opacity: 0.7;
      }
    }
    .add{
      border:1px solid #6b9aff;
      box-sizing: border-box;
      background:url('./../assets/icon/multi-chooser-add.png') center center no-repeat;
      background-color: #fff;
      background-size: 20px 20px;
      color:transparent;
    }
  }
</style>
