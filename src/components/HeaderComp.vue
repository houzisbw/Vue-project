<!--Header组件-->
<template>
      <div class="banner">
        <a href="#"><img src="./../assets/icon/banner-logo.png"></a>
        <span class="banner-word"><img src="./../assets/icon/banner-word.png"></span>
        <ul class="banner-ul">
          <li><a href="#">登录</a></li>
          <li><a href="#">注册</a></li>
        </ul>
        <input type="text" class="banner-input" placeholder="组件名字">
      </div>
</template>

<script>
    export default {
        //这里命名不要和built-in的tag名相同
        name: 'headerComp'
    }
</script>

<style scoped lang="less" type="text/less">
  @bannerHeight:40px;
  @bannerBgColor:#fff;
  @bannerMinWidth:800px;
  //banner样式
  .banner{
    z-index:100;
    min-width: @bannerMinWidth;
    height:@bannerHeight;
    padding:10px 40px;
    box-shadow: 0 0 4px rgba(0,0,0,0.25);
    width:100%;
    background-color: @bannerBgColor;
    position: fixed;
    left:0;
    top:0;
    @logoSize:@bannerHeight+15;
    a{
      float:left;
      img{
        width:@logoSize + 15;
        height:@logoSize;
        position: relative;
        top:-6px;
      }
    }
    .banner-word{
      img{
         width:100px;
         height:@bannerHeight;
      }
    }
    .banner-ul{
      float:right;
      margin-right: 100px;
      line-height: @bannerHeight;
      li{
        float:right;
        //最好不要设置li的宽度，只设置padding，这样自适应
        padding:0 10px;
        height:@bannerHeight;
        &:hover{
          border-bottom: 4px solid #65bcf7;
        }
        a{
          color:#34495e;
        }
      }
    }
    .banner-input{
      float:right;
      margin-right: 20px;
      margin-top: 4px;
      width:150px;
      border:1px solid #e3e3e3;
      height:30px;
      line-height: 30px;
      border-radius: 15px;
      //设置input的padding来限制内容输入区域
      padding:0 20px 0 40px;
      background: url('./../assets/icon/banner-search.png') 5% center no-repeat;
      background-size:20px 20px;
      transition: all 0.5s;
      &:focus{
        border-color: #98c2f3;
        width:200px;
      }
    }

  }
</style>
