<template>
    <!--点击外层label，内层checkbox会发生改变-->
    <label class="switch">
      <input type="checkbox" v-model="value" />
      <!--内层滑动条，圆形按钮是after元素-->
      <div class="switch-checkbox"></div>
    </label>
</template>

<script>
	export default {
		name: 'SwitchSlide',
    data(){
			return {
				//默认是true，即公开链接
				value:true
      }
    },
    watch: {
      value () {
      	//将input的value传出去
        this.$emit('input-change', this.value);
      }
    }
	}
</script>

<style type="text/less" lang="less" scoped>
  @bodyColor:#000;
  .switch {
    position: relative;
    display: inline-block;
    height: 36px;
    line-height: 36px;
    padding-right: 32px;
    color: @bodyColor;
    input[type="checkbox"] {
      @activeBgColor: #b3e0ff;
      @activeButtonColor: #5798ff;
      //隐藏input
      display: none;
      //利用input的checked触发滑动动画
      &:checked {
        //这里的+(相邻兄弟选择器)很重要，否则无法选择到,因为不加+就变成子元素
       +.switch-checkbox {
          background-color:@activeBgColor;
          &:after {
            transform: translateX(26px);
            background: @activeButtonColor;
            opacity: 1!important;
          }
        }
      }
    }
    .switch-checkbox{
      width: 46px;
      border-radius: 36px;
      height: 14px;
      background: #b0afaf;
      z-index: 0;
      margin: 0;
      padding: 0;
      border: none;
      cursor: pointer;
      position: relative;
      transform: translateX(0);
      //滑动时间
      transition: all .5s;
      //after伪元素作为滑动开关的圆形按钮
      &:after{
        transition: all .5s;
        content: ' ';
        height: 20px;
        width: 20px;
        border-radius: 20px;
        background: #fff;
        position: absolute;
        z-index: 2;
        top: -3px;
        left: 0;
        box-shadow: 0 2px 5px rgba(0,0,0,0.4);
        transform: translateX(0);
        backface-visibility: hidden;
      }
    }
  }
</style>
