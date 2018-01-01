<template>
    <div>
      <ul class="multi-choose">
        <li v-for="(item,index) in selections" @click="toggleSelect(index)" :class="{active:checkActive(index)}">
          {{item.label}}
        </li>
        <li class="add" title="添加新分类" @click="showAddDialog" v-if="canAddNewType">&nbsp;&nbsp;</li>
      </ul>
    </div>
</template>

<script>
  import _ from 'lodash'
  import {eventBus} from './../eventBus'
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
    },
    computed:{
			canAddNewType(){
				return this.selections.length <= 4
      }
    },
    data(){
			return {
				//已经选择了的按钮的index数组
				selectedIndexArray:[]
      }
    },
    methods:{
    	//如果按钮已选中，取消选中，未选中则选中
			toggleSelect(index){
          //如果该项已经被选中,则从数组中除去他自己
          var isSelected = _.indexOf(this.selectedIndexArray,index);
          if(isSelected !== -1){
          	//这里必须赋值给原数组，否则不会触发视图更新
            this.selectedIndexArray = _.remove(this.selectedIndexArray, function(item){
          		  return item !== index;
            })
          }else{
          	//如果未选中则加入数组
            //最多选取3项
            if(this.selectedIndexArray.length>=3){
              eventBus.$emit('bookmark-maxnum-exceeded');
              return;
            }
            this.selectedIndexArray.push(index);
          }
          //返回的是数组对象，不是index数组
          let nowObjArray = _.map(this.selectedIndexArray, (idx) => {
            return this.selections[idx]
          })
          //把选中的那一项传递出去
          this.$emit('on-change', nowObjArray)
      },
      //检查是否激活,绑定的class判断也可以用函数
      checkActive(index){
				return this.selectedIndexArray.indexOf(index) !== -1;
      },
      //显示添加对话框
      showAddDialog(){
      	eventBus.$emit('show-add-new-type-dialog');
      }
    }

	}
</script>

<style lang="less" type="text/less" scoped>
  @liHeight:30px;
  .multi-choose {
    @buttonColor: #45a0ff;
    margin-top: 8px;
    li{
      display: inline-block;
      padding:0 15px;
      background-color: #fff;
      border-radius: 5px;
      color:@buttonColor;
      cursor: pointer;
      line-height: @liHeight;
      height:@liHeight;
      text-align: center;
      margin-right: 15px;
      font-size: 14px;
      border:1px solid @buttonColor;
      margin-bottom: 20px;
      opacity: 1;
      transition: all .5s ease;
      &:hover{
        //background-color: @buttonColor;
        //color:#fff;
      }
    }
    li.active{
      background-color: @buttonColor;
      color:#fff;
    }
    .add{
      border:1px solid @buttonColor;
      background:url('./../assets/icon/multi-chooser-add.png') center center no-repeat;
      background-color: #fff;
      background-size: 20px 20px;
      color:transparent;
      margin-left: -3px;
    }
  }
  .overlay{


  }
</style>
