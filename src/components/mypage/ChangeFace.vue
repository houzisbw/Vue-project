<!--改变头像-->
<template>
    <div class="wrap-inner">
      <custom-cropper></custom-cropper>
    </div>
</template>

<script>
  import CustomCropper from './CustomCropper'
	export default {
		name: 'changeFace',
    components: {
      CustomCropper
    },
    data(){
			return{

      }
    },
    methods:{
    }
	}
</script>

<style  type="text/css" scoped>
  .wrap-inner{
    margin: 30px auto;
  }
</style>
