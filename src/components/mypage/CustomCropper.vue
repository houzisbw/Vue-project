<template>
  <div class="cropper-modal">
    <transition name="myFade">
      <div class="overlay" v-show="isToastShow">更新头像成功</div>
    </transition>
    <div class="modal">
      <div class="modal-content clearfix">
        <div class="img-clip-wrap">
          <div class="container-bg">
            <div class="img-container">
              <img id="clip_src_img" @load="srcImgLoaded" :src="img">
              <div class="shadow-box"></div>
              <Select-Box ref="box" :srcSize="imgSize" :ratio="ratio" :img="img" @selectEnd="selectEnd"
                          @selectChange="selectChange"></Select-Box>
            </div>
          </div>
          <!--label，用于选择图片,此处input被隐藏，点击label相当于点击input-->
          <label class="label-select" for="file_input" v-if="!isResetButtonShow">
          </label>
          <div class="reset-img">
            <span class="icon-reset" v-if="isResetButtonShow">重新选择</span>
            <!--accept属性规定了上传图片的类型-->
            <input type="file" id="file_input" accept="image/png,image/jpg,image/gif" @change="fileChange">
          </div>
        </div>
        <!--图片预览-->
        <div class="img-preview-wrap">
          <div class="pre-container">
            <img id="clip_res_img" :src="imgPreview">
          </div>
          <div class="pre-info">当前头像</div>
        </div>
      </div>
      <div class="modal-head">
        <div class="head-wrap">请选择图片上传：支持JPG、PNG、GIF等格式，图片需小于2M</div>
      </div>
      <div class="modal-footer">
        <!--download属性可以点击下载，规定图片名称 :href="clipData"-->
        <a class="modal-btn btn-confirm"  @click="saveProfileAndShow" :class="{'disabled':!isResetButtonShow}">更新</a>
      </div>
    </div>
  </div>
</template>

<script>
  import SelectBox from './SelectBox.vue'
  import axios from 'axios'
  export default {
    components: {
      SelectBox
    },
    data () {
      return {
      	//禁用按钮
        disableButton:false,
      	//是否显示toast
        isToastShow:false,
      	//上传的文件,用于发送给图床网站
        imgUploaded:null,
      	//重新选择按钮和label的显示与否flag
        isResetButtonShow:false,
        img: null,
        imgPreview:null,
        $srcImg: null,
        $resImg: null,
        $input: null,
        $imgContainer: null,
        $preContainer: null,
        nw: 0,
        nh: 0,
        clipData: null,
        ratio: 1, // equal to SelectBox's width / height
        imgSize: {w: 0, h: 0},
        containerTop: 0
      }
    },
    mounted () {
      this.$input = this.$el.querySelectorAll('#file_input')[0]
      this.$srcImg = this.$el.querySelectorAll('#clip_src_img')[0]
      this.$resImg = this.$el.querySelectorAll('#clip_res_img')[0]
      this.$imgContainer = this.$el.querySelectorAll('.img-container')[0]
      this.$preContainer = this.$el.querySelectorAll('.pre-container')[0]
      this.$containerBox = this.$el.querySelectorAll('.container-bg')[0]
      //当前头像
      var currentProfile = this.$store.getters.getUserProfileImg;
      this.imgPreview = currentProfile;
    },
    methods: {
    	//保存用户选定的头像
      saveProfileAndShow(){
      	if(!this.isResetButtonShow || this.disableButton){
      		return;
        }
      	//如果存在头像图片
      	if(this.imgUploaded){
          let rec = this.$refs.box.rec
          if (!rec.w || !rec.h) {
            return
          }
          //禁用按钮
          this.disableButton = true;
          //利用canvas裁剪图片
          const bufferCanvas = document.createElement('canvas')
          const bfx = bufferCanvas.getContext('2d')
          const computedRec = this.getComputedRec(rec)
          bufferCanvas.width = computedRec.w
          bufferCanvas.height = computedRec.h
          //将图片绘制到canvas里面
          bfx.drawImage(this.$srcImg, -computedRec.l, -computedRec.t, this.nw, this.nh)
          //获取base64编码的图片,第二个参数是图片质量(0-1)
          this.clipData = bufferCanvas.toDataURL('image/jpeg', 1)
          //将base64的图片转为file类型，用于发送至图床网站
          function convertBase64UrlToBlob(urlData,type){
            var bytes=window.atob(urlData.split(',')[1]);//去掉url的头，并转换为byte
            //处理异常,将ascii码小于0的转换为大于0
            var ab = new ArrayBuffer(bytes.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < bytes.length; i++) {
              ia[i] = bytes.charCodeAt(i);
            }
            return new Blob( [ab] , {type : 'image/'+type});
          }
          //获取裁剪后的图片
          var fileClipped = convertBase64UrlToBlob(this.clipData,"png");
          //发送至图床网站的data
          var data = new FormData();
          data.append('smfile', fileClipped);
          //这里的data没有大括号,api是在config/index里面设置的代理，跨域访问
          axios.post('/api',data).then((resp)=>{
          	  //注意这里有2个data，第一个是axios的data，第二个是图床网站的data属性
              //获取图片的url,存入数据库
              var imgUrl = resp.data.data.url;
              axios.post('/user/saveProfile',{url:imgUrl}).then((resp)=>{
                  this.isToastShow = true;
                  setTimeout(()=>{
                  	//关闭toast显示
                    this.isToastShow = false;
                    //解除按钮禁用
                    this.disableButton = false;
                    //刷新页面
                    window.location.reload();
                  },1000)
              })

          })
        }
      },
      selectChange () {
        const rec = this.$refs.box.rec
        if (rec.w > 0 && rec.h > 0) {
          this.updatePreview()
        }
      },
      selectEnd () {
        const rec = this.$refs.box.rec
        if (rec.w > 0 && rec.h > 0) {
          this.clip()
        }
      },
      //文件上传的回调函数，作用是将图片文件转为base64格式输出给img的src并显示
      fileChange () {
        const me = this
        const fd = new FileReader();
        this.isResetButtonShow = true;
        //读取完成，异步操作,直接将dataUrl作为img标签的src
        fd.onloadend = function () {
        	//result是读取完成的结果
          me.img = fd.result
          me.imgPreview = fd.result
        };
        //如果input有文件的话则进行读取，转化为dataUrl
        if (this.$input.files && this.$input.files[0]) {
        	this.imgUploaded = this.$input.files[0];
        	//readAsDataURL方法会使用base-64进行编码
          fd.readAsDataURL(this.$input.files[0])
        }
      },
      srcImgLoaded () {
        this.nw = this.$srcImg.naturalWidth
        this.nh = this.$srcImg.naturalHeight
        this.clearSelect()
        this.setImgSize()
        this.updatePreview()
        this.clip()
      },
      clearSelect () {
        const box = this.$refs.box
        box.clearRec()
        this.clipData = null
      },
      setImgSize () {
        // image's naturalWidth naturalHeight ratio
        const nr = this.nw / this.nh
        const scw = this.$containerBox.offsetWidth
        const sch = this.$containerBox.offsetHeight
        let rw = 0  // select box width
        let rh = 0  // select box height
        if (nr >= this.ratio) {
          this.imgSize.w = scw
          this.imgSize.h = scw / nr
          this.containerTop = (sch - this.imgSize.h) / 2
          rh = this.imgSize.h
          rw = rh * this.ratio
        } else {
          this.imgSize.h = sch
          this.imgSize.w = sch * nr
          this.containerTop = 0
          rw = this.imgSize.w
          rh = rw / this.ratio
        }
        this.$srcImg.setAttribute('style', `width:${this.imgSize.w}px;height:${this.imgSize.h}px;`)
        this.$imgContainer.setAttribute('style',
          `width:${this.imgSize.w}px;height:${this.imgSize.h}px;top:${this.containerTop}px;`)
        this.$refs.box.rec = {w: rw, h: rh, l: 0, t: 0}
      },
      getComputedRec (r) {
        const cw = this.$imgContainer.offsetWidth
        const ch = this.$imgContainer.offsetHeight
        const wr = cw / this.nw
        const hr = ch / this.nh
        return {
          l: r.l / wr, t: r.t / hr,
          w: r.w / wr, h: r.h / hr
        }
      },
      updatePreview () {
        const rec = this.$refs.box.rec
        const pcw = this.$preContainer.offsetWidth
        const pch = this.$preContainer.offsetHeight
        const wr = pcw / rec.w
        const hr = pch / rec.h
        const w = wr * this.$imgContainer.offsetWidth
        const h = hr * this.$imgContainer.offsetHeight
        const l = -rec.l * wr
        const t = -rec.t * hr
        this.$resImg.setAttribute('style',
          `width:${w}px;height:${h}px;top:${t}px;left:${l}px;`)
      },
      clip () {
        let rec = this.$refs.box.rec
        if (!rec.w || !rec.h) {
          return
        }
        //利用canvas裁剪图片
        const bufferCanvas = document.createElement('canvas')
        const bfx = bufferCanvas.getContext('2d')
        const computedRec = this.getComputedRec(rec)
        bufferCanvas.width = computedRec.w
        bufferCanvas.height = computedRec.h
        //将图片绘制到canvas里面
        bfx.drawImage(this.$srcImg, -computedRec.l, -computedRec.t, this.nw, this.nh)
        this.clipData = bufferCanvas.toDataURL('image/jpeg', 1)
      }
    }
  }
</script>

<style scoped>
  .cropper-modal .modal {
    width: 600px;
    height: 524px;
    margin: 0 auto;
    background-color: #fff;
  }
  .cropper-modal{
    margin-top: 60px;
    position: relative;
  }

  .modal-head {
    margin-top: 20px;
    position: relative;
    text-align: center;
    padding: 0 16px 0 40px;
  }

  .head-wrap {
    position: relative;
    font-size: 12px;
    color: #99a2aa;
    height: 50px;
    line-height: 50px;
  }

  .modal-content {
    padding: 30px 40px 40px;
  }

  .img-clip-wrap {
    width: 50%;
    height: 202px;
    border-right: 1px solid #e5e9ef;
    float: left;
    position:relative;
  }

  .container-bg {
    width: 200px;
    height: 200px;
    background-color: #0b0b0b;
    border-radius: 4px;
    border: 1px solid #cbcbcb;
    overflow: hidden;
  }

  .img-container {
    position: relative;
    height: 0;
    margin: auto;
  }

  .img-container img {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .img-container .shadow-box {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    z-index: 1;
  }

  .reset-img {
    position: relative;
    display: inline-block;
    color: #6d757a;
    font-size: 12px;
    cursor: pointer;
    overflow: hidden;
    width:200px;
    text-align: center;
    margin: 16px auto;
  }

  .reset-img input {
    position: absolute;
    font-size: 100px;
    right: 0;
    top: 0;
    opacity: 0;
    cursor: pointer
  }

  .reset-img:hover {
    color: #00b5e5;
  }

  .img-preview-wrap {
    width: 200px;
    float: right;
    margin-right: 10px;
    margin-top: 30px;
  }

  .pre-container {
    width: 130px;
    height: 130px;
    border-radius: 50%;
    background-color: #e0e0e0;
    overflow: hidden;
    border: 1px solid #cbcbcb;
  }

  .pre-container img {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .pre-info {
    text-align: center;
    width:130px;
    margin-top: 20px;
    font-size: 12px;
    color: #99a2aa;
  }

  .clearfix:before, .clearfix:after {
    content: ' ';
    display: table;
  }

  .clearfix:after {
    clear: both;
  }

  .modal-footer {
    text-align: center;
  }

  .modal-btn {
    display: inline-block;
    width: 150px;
    height: 42px;
    font-size: 14px;
    line-height: 42px;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 20px;
    text-decoration: none;
  }

  .btn-confirm {
    color: #fff;
    background-color: #00a1d6;
  }

  .btn-confirm:hover {
    background-color: #00b5e5;
  }
  /*选择图片的label*/
  .label-select{
    cursor: pointer;
    position: absolute;
    left:0;
    top:0;
    width:202px;
    height:202px;
    border-radius: 4px;
    background: url('./../../assets/icon/add-image.png') center center / 60px 60px no-repeat #e7e7e7;
  }
  /*按钮禁止*/
  .disabled{
    background-color: #f4f5f7 !important;
    color:#ccd0d7!important;
    cursor:auto!important;
  }
  .icon-reset{
    color: #1f9cff;
  }
  .overlay{
    position: absolute;
    left:50%;
    top:50%;
    width:200px;
    height:80px;
    transform: translate(-50%,-50%);
    background-color:rgba(0,0,0,0.8);
    line-height: 80px;
    color:#fff;
    font-size: 18px;
    z-index:100;
    border-radius: 10px;
    text-align: center;
  }
  /*动画*/
  .myFade-enter,.myFade-leave-to{
    opacity: 0;
  }
  .myFade-leave-active,.myFade-enter-active{
    transition: all .5s;
  }
  .myFade-enter-to,.myFade-leave{
    opacity: 1;
  }
</style>
