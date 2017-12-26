<template>
    <div class="book-mark">
      <div class="title">
        所有书签
      </div>
      <!--书签内容区域-->
      <div class="book-mark-content clearfix">
        <!--每一行标签数是响应式变化的-->
        <div class="mark-wrap" v-for="i in markNum">
        </div>
        <!--空div，用于让flex最后一行左对齐，原理就是占位置,宽度和mark-wrap一样-->
        <div class="flex-padding">
        </div>
        <div class="flex-padding">
        </div>
        <div class="flex-padding">
        </div>
        <div class="flex-padding">
        </div>
        <div class="flex-padding">
        </div>
        <div class="flex-padding">
        </div>
      </div>
    </div>
</template>

<script>
    export default {
        name: 'book-mark',
        data(){
            return{
                markNum:22
            }
        }
    }
</script>

<style scoped lang="less" type="text/less">
  .book-mark{
    width:80%;
    margin: 0 auto;
    .title{
      width:100%;
      height:40px;
      border-radius: 5px;
      background-color: #fff;
      box-shadow: 0 0 5px 2px #d3d3d3;
      text-align: center;
      line-height: 40px;
      color:#898989;
      //防止过度压缩
      min-width: 200px;
    }
    .book-mark-content{
      margin-top: 20px;
      min-width: 200px;
      //使用flex布局，很方便自适应,目的是让最后一个书签没有右侧margin，而且可以自适应
      //方法:给div后面添加一些空div，宽度要和前面的一样，
      display: flex;
      display: -webkit-flex;
      justify-content: space-between;
      flex-direction: row;
      //换行
      flex-wrap:wrap;
    }
  }
  .flex-padding{
    height:0;
    float:left;
    width:15%;
  }
  @markWidth:15%;
  @markHeight:250px;
  @markNumEachLine:6;
  .mark-wrap{
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    width:@markWidth;
    height:@markHeight;
    background-color: #898989;
    float:left;
    margin-bottom: 20px;
  }

  //响应式，媒体查询
  @media  (max-width:1400px){
    .mark-wrap,.flex-padding{
      width:22% ;
    }
  }
  @media  (max-width:1100px){
    .mark-wrap,.flex-padding{
      width:30% ;
    }
  }
  @media  (max-width:800px){
    .mark-wrap,.flex-padding{
      width:100% ;
    }
  }

</style>
