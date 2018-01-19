<!--网易云热歌分析-->
<template>
    <div>
      <div class="wrap">
        <!--内容区域标题-->
        <div class="title">
          <div class="title-word">网易云热门歌曲分析</div>
        </div>
      </div>
      <!--底部间隔-->
      <div class="bottom-padding">
      </div>
    </div>
</template>

<script>
	export default {
		name: 'hotMusicAnalysis'
	}
</script>

<style lang="less" type="text/less" scoped>
  .bottom-padding{
    height:200px;
    width:100%;
  }
  .wrap {
    margin: 20px auto;
    width: 1200px;
    height:500px;
    background-color: #fff;
    border: 1px solid #d3d3d3;
    border-radius: 10px;
    box-shadow: 0 0 3px 3px #d3d3d3;
    position: relative;
    .title {
      height: 50px;
      border-bottom: 1px solid #cbcbcb;
      border-radius: 10px 10px 0 0;
      line-height: 50px;
      padding-left: 50px;
      background: url('./../../assets/icon/music-hot-color.png') 15px center no-repeat #f1f1f1;
      background-size: 40px 40px;
      .title-word {
        font-size: 17px;
        padding-left: 20px;
        padding-right: 50px;
        color: #afafaf;
        font-family: SansSerif;
      }
    }
  }
</style>
