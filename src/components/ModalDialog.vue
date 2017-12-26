<template>
    <div>
      <!--遮罩,z-index:1000-->
      <div class="overlay">
        <!--对话框-->
        <div class="dialog">
          <!--关闭按钮-->
          <div class="close" @click="closeDialog">
          </div>
          <!--标题-->
          <div class="title">
            {{title}}
          </div>
          <!--内容-->
          <div class="content">
            {{content}}
          </div>
          <!--确认取消还是确定-->
          <div class="confirm">
            <!--确定-->
            <div class="yes" v-if="confirmType === 1">
              确定
            </div>
            <!--确定取消-->
            <div class="yesno" v-else="confirmType === 2">
              <div class="yesno-yes">
                确定
              </div>
              <div class="yesno-no" @click="closeDialog">
                取消
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
        name: 'modal-dialog',
        props:{
            //标题
            title:{
                type:String,
                default:'标题'
            },
            //内容
            content:{
                type:String,
                default:'内容'
            },
            //类型,1是确定，2是确认取消,后续扩展
            confirmType:{
                type:Number,
                validator:function(value){
                    return Math.floor(value) === value;
                },
                default:2
            }
        },
        methods:{
            //关闭对话框
            closeDialog:function () {
                this.$emit('on-close');
            }
        }
    }
</script>

<style scoped lang="less" type="text/less">
  //遮罩
  @overlayIndex:1000;
  .overlay{
    position: fixed;
    left:0;
    top:0;
    right:0;
    bottom:0;
    //注意，opacity的话子元素会继承父元素的透明度，坑
    background-color: rgba(0,0,0,0.3);
    z-index:@overlayIndex;
    @closeSize:30px;
    @closePosOffset:10px;
    .close{
      position: absolute;
      right:@closePosOffset;
      top:@closePosOffset;
      width:@closeSize;
      height:@closeSize;
      background: url('./../assets/icon/close.png');
      background-size: @closeSize @closeSize;
      transition:transform .5s ease;
      cursor:pointer;
      &:hover{
        transform: rotate(90deg);
      }
    }
    @titleHeight:60px;
    .title{
      height:@titleHeight;
      border-bottom: 1px solid #cbcbcb;
      line-height: @titleHeight;
      color:#898989;
      font-family: "Microsoft YaHei";
      padding-left: 20px;
      font-size: 18px;
      font-weight: bold;
    }
    .content{
      min-height:120px;
      padding:20px;
      font-family: "Microsoft YaHei";
    }
    .confirm{
      height:@titleHeight;
      border-top:1px solid #cbcbcb;
    }
    .yes,.yesno-yes{
      font-family: "Microsoft YaHei";
      width:80px;
      height:40px;
      background-color: #409eff;
      border-radius: 5px;
      float:right;
      margin-right: 15px;
      cursor: pointer;
      margin-top: 10px;
      color:#fff;
      line-height: 40px;
      text-align: center;
    }
    .yesno-no{
      font-family: "Microsoft YaHei";
      box-sizing: border-box;
      width:80px;
      height:40px;
      border-radius: 5px;
      background-color: #fff;
      float:right;
      margin-right: 15px;
      cursor: pointer;
      margin-top: 10px;
      line-height: 40px;
      text-align: center;
      color: #878787;
      border:1px solid #bebebe;
    }


  }
  .dialog{
    width:30%;
    min-width: 400px;
    background-color: #fff;
    border-radius: 10px;
    z-index: @overlayIndex + 1;
    position: absolute;
    left:50%;
    top:50%;
    transform: translate(-50%,-50%);
    box-shadow: 0 0 8px 2px #8b8b8b;
  }
</style>
