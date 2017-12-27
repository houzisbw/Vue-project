<template>
    <div>
      <!--遮罩,z-index:1000-->
      <div class="overlay">
        <!--对话框-->
        <div class="dialog">
          <!--关闭按钮-->
          <div class="close">
          </div>
          <!--标题-->
          <div class="title">
            <!--利用before,after伪元素添加横线修饰-->
            <h1 class="title-word">登录</h1>
          </div>
          <!--内容-->
          <div class="content">
          </div>
          <!--确认取消还是确定-->
          <div class="confirm">
          </div>
        </div>
      </div>
    </div>
</template>

<script>
	export default {
		name: 'login'
	}
</script>

<style type="text/less" lang="less" scoped>
  //遮罩
  @overlayIndex:1000;
  .overlay {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    //注意，opacity的话子元素会继承父元素的透明度，坑
    background-color: rgba(0, 0, 0, 0.6);
    z-index: @overlayIndex;
    @closeSize: 30px;
    @closePosOffset: 10px;
    .close {
      position: absolute;
      right: @closePosOffset;
      top: @closePosOffset;
      width: @closeSize;
      height: @closeSize;
      background: url('./../assets/icon/close.png');
      background-size: @closeSize @closeSize;
      transition: transform .5s ease;
      cursor: pointer;
      &:hover {
        transform: rotate(90deg);
      }
    }
    @titleHeight: 60px;
    .title {
      height: @titleHeight;
      line-height: @titleHeight;
      color: #898989;
      font-family: "Microsoft YaHei";
      padding-left: 20px;
      font-size: 20px;
      font-weight: bold;
      text-align: center;
      //高级用法:文字中间的线
      .title-word:before,.title-word:after{
        content:'';
        display: block;
        border-top:1px solid #cbcbcb;
        position:absolute;
        top:30px;
        width:20%;
      }
      .title-word:before{
        left:25%;
      }
      .title-word:after{
        right:22%;
      }
    }
    .content {
      min-height: 120px;
      padding: 40px 20px;
      font-family: "Microsoft YaHei";
    }

    .dialog {
      width: 30%;
      min-width: 500px;
      background-color: #fff;
      border-radius: 10px;
      z-index: @overlayIndex + 1;
      position: fixed;
      left: 50%;
      top: 50%;
      //初始位置
      transform: translate(-50%, -50%);
      opacity: 1;
      box-shadow: 0 0 8px 2px #474747;
    }
    .title-word{

    }

  }


</style>
