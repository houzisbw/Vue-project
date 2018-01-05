<template>
    <div class="book-mark">
      <div class="title">
        敬请期待
      </div>
    </div>
</template>

<script>
	export default {
		name: 'importBookMark'
	}
</script>

<style scoped type="text/less" lang="less">
  .book-mark {
    width: 80%;
    margin: 10px auto 80px auto;
    @minWidth: 400px;
    .title {
      width: 100%;
      //防止过度压缩
      min-width: @minWidth;
      height: 40px;
      border-radius: 5px;
      background-color: #fff;
      box-shadow: 0 0 5px 2px #d3d3d3;
      text-align: center;
      line-height: 40px;
      color: #898989;
      .login-word {
        color: #409eff;
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
</style>
