<!--百度地图租房助手-->
<template>
    <div>
      <div class="wrap">
        <!--内容区域标题-->
        <div class="title">
          <div class="title-word">租房小助手</div>
        </div>
        <!--内容区域选项-->
        <div class="content">
          <div class="input-wrap">
            <input type="text" class="search-input" placeholder="输入小区名字" v-model.trim="keyword">
            <button class="search-button" @click="searchEstate">搜索</button>
          </div>
          <!--搜索选项-->
          <div class="options">
            <!--城市选择-->
            <div class="option-wrap">
              <span class="option-title">城市:</span>
              <ul class="option-city">
                <li v-for="(city,index) in cityList"
                    @click="changeCity(index)"
                    :class="{'item-active':index === cityActiveIndex}">
                  {{city}}
                </li>
              </ul>
            </div>
            <!--搜索半径选择-->
            <div class="option-wrap">
              <span class="option-title">半径:</span>
              <vue-slider v-model="rangeValue"
                          v-bind="sliderOptions"
                          class="slider">
              </vue-slider>
              <span class="search-range">{{rangeValue | meter}}</span>
            </div>
          </div>
        </div>
        <!--地图容器-->
        <div class="map-container" id="map-container">
        </div>
        <!--遮罩层-->
        <transition name="myFade">
          <div class="city-wrap" v-if="isOverlayShow">
            <div class="overlay">
            </div>
            <!--租房助手简介-->
            <div class="abbreviation">
              <!--横线-->
              <div class="line">
              </div>
              <div class="abbreviation-title">
                租房助手 · Renting Assistant
              </div>
              <div class="abbreviation-content">
                一款方便快捷的租房小工具，能够为您展示出房源周边的商场，医院，地铁站，超市，公园等各种配套设施,并对您的小区进行评分及提出建议!
              </div>
              <div class="use-now" @click="useTool">
                立即使用
              </div>
            </div>
          </div>
        </transition>
      </div>
      <!--底部padding-->
      <!--用于让底部和内容隔开一定距离-->
      <div class="bottom-padding">
      </div>
    </div>
</template>

<script>
  import {eventBus} from './../../eventBus'
  //地图
  import {MP} from './../../baiduMap'
  //滑块插件
  import vueSlider from 'vue-slider-component';
  export default {
		name: 'BaiduMapHouseRenting',
    components:{
			vueSlider
    },
    filters:{
			meter(v){
				return v+'米'
      }
    },
    mounted(){
			//初始化地图,参数是ak密钥
      this.$nextTick(()=>{
        MP('oiu5kqXt7U3ljISAeX8UZZXlgOHIaZac').then(BMap=>{
            this.map = new BMap.Map('map-container');
            // 创建地图实例
            var point = new BMap.Point(104.072, 30.661);
            // 创建点坐标
            this.map.centerAndZoom(point, 12);
              //开启鼠标缩放
            this.map.enableScrollWheelZoom(true);
              //添加控件
            this.map.addControl(new BMap.NavigationControl({
                // 靠左上角位置
                anchor: BMAP_ANCHOR_TOP_LEFT,
                // LARGE类型
                type: BMAP_NAVIGATION_CONTROL_LARGE

              }
            ));
            this.map.addControl(new BMap.ScaleControl());
            this.map.addControl(new BMap.OverviewMapControl());
            this.map.addControl(new BMap.MapTypeControl());

          });
      });

    },
    data(){
			return{
				//local
        local:null,
				//搜索关键字
        keyword:'',
				//地图实例
        map:null,
        //输入地点坐标:经度，纬度
        estatePoint:{
        	lng:'',
          lat:''
        },
				isOverlayShow:true,
        //城市
        cityList:['北京', '上海','深圳','成都','广州','杭州','武汉','重庆'],
        cityActiveIndex:3,
        //搜索半径
        rangeValue:1000,
        //滑块配置
        sliderOptions:{
					min:500,
          max:3000,
          width:450,
          height:8,
          formatter: "{value}米",
          processStyle:{
            "backgroundColor": "#ffa000"
          },
          tooltipDir:'bottom',
          tooltip:'hover',
          tooltipStyle:{
            "backgroundColor": "#ffa000",
            "borderColor": "#ffa000"
          },
          bgStyle: {
            "backgroundColor": "#fff",
            "boxShadow": "inset 0.5px 0.5px 3px 1px rgba(0,0,0,.36)"
          }
        }
      }
    },
    methods:{
    	//添加地图标注
      addMapOverlays(centerPoint,radius){
        //添加地图标注：圆心
        var circle = new BMap.Circle(centerPoint,radius,{
        	strokeColor:"blue",
          strokeWeight:2,
          strokeOpacity:0.4,
          fillOpacity:0.3,
          fillColor:'#ffbc76'
        });
        this.map.addOverlay(circle);
      },
    	//搜索坐标点附近
      searchPointNearby(point){
        this.local = new BMap.LocalSearch(this.map,
          {
            //搜索结束，展示结果
            onSearchComplete:(results)=>{
              if (this.local.getStatus() === BMAP_STATUS_SUCCESS){
                // 判断状态是否正确
                var s = [];
                for (var i = 0; i < results.getCurrentNumPois(); i ++){
                  s.push(results.getPoi(i));
                }
                //添加地图标注
                this.addMapOverlays(point,this.rangeValue);

              }
            }
          });

        //第一个参数是关键字，第二个是搜索中心，第三个是半径
        this.local.searchNearby('网吧',point,this.rangeValue)
      },
    	//搜索小区
      searchEstate(){
      	//清除覆盖物
        this.map.clearOverlays();
      	//搜索结果不能为空
      	if(this.keyword === ''){
          eventBus.$emit('CONFIRM_DIALOG','关键字不能为空哦!');
          return;
        }
      	//首先获取输入地址的位置信息
        // 创建地址解析器实例
        var myGeo = new BMap.Geocoder();
        // 将地址解析结果显示在地图上，并调整地图视野
        myGeo.getPoint(this.keyword, (point)=>{
            if (point) {
            	//保存坐标点
            	this.estatePoint.lng = point.lng;
              this.estatePoint.lat = point.lat;
              this.map.centerAndZoom(point, 16);
              //添加文字说明
              var label = new BMap.Label(this.keyword);
              label.setStyle({
                transform:'translate(-35%,80%)',
                padding:'3px 6px',
                backgroundColor:'#ffa000',
                color:'#fff',
                border:'none',
                borderRadius:'4px'
              })
              var marker  = new BMap.Marker(point);
              marker.setLabel(label);
              //跳动动画
              marker.setAnimation(BMAP_ANIMATION_BOUNCE)
              this.map.addOverlay(marker);
              //根据坐标点搜索附近的设施(不能直接使用searchNearby,因为center是字符串的话半径被忽略)
              this.searchPointNearby(point);
            }else{
            	//未搜索到结果
              eventBus.$emit('CONFIRM_DIALOG','在'+this.cityList[this.cityActiveIndex]+'市没有找到'+this.keyword+'的相关信息哦!');
            }
          },
          this.cityList[this.cityActiveIndex]);
      },
			useTool(){
				this.isOverlayShow = false;
      },
      changeCity(index){
				this.cityActiveIndex = index;
      }
    }
	}
</script>

<style type="text/less" lang="less" scoped>

  .bottom-padding{
    height:200px;
    width:100%;
  }
  .wrap{
    margin: 20px auto;
    width:1200px;
    background-color: #fff;
    border:1px solid #d3d3d3;
    border-radius: 10px;
    box-shadow: 0 0 3px 3px #d3d3d3;
    position: relative;
    .title {
      height: 50px;
      border-bottom: 1px solid #cbcbcb;
      border-radius: 10px 10px 0 0;
      line-height: 50px;
      padding-left: 50px;
      background: url('./../../assets/icon/house-rent.png') 15px center no-repeat #f1f1f1;
      background-size: 40px 40px;
      .title-word {
        font-size: 17px;
        padding-left: 20px;
        padding-right: 50px;
        font-weight: bold;
        color: #afafaf;
        font-family: SansSerif;
      }
    }
    //地图
    .map-container{
      height:600px;
      border-top:1px solid #cbcbcb;
      border-bottom:1px solid #cbcbcb;
      box-shadow: 0 0 5px 3px #cbcbcb inset !important;
      border-radius: 0 0 10px 10px;
    }
    .content{
      width:80%;
      margin: 30px auto;
      position: relative;
      //注意：如果input和button放在一个div内会对不齐，采用绝对定位或者float解决
      .input-wrap{
        @wrapHeight:40px;
        height:@wrapHeight;
        position: relative;
        width:600px;
        margin: 40px auto 0 auto;
        .search-input{
          height:@wrapHeight - 2 ;
          width:80%;
          margin: 0 auto;
          border:1px solid #ffa000;
          border-radius: 5px 0 0 5px;
          position: absolute;
          top:0;
          right:600px * 0.2;
          text-indent: 20px;
        }
        .search-button{
          display: inline-block;
          height:@wrapHeight + 2;
          width:20%;
          outline: none;
          border:none;
          position: absolute;
          border-radius: 0 5px 5px 0;
          right:0;
          top:0;
          background: url('./../../assets/icon/house-search.png') 18% center no-repeat #ffa000;
          background-size: 25px 25px;
          color:#fff;
          font-size: 15px;
          line-height:@wrapHeight + 2;
          cursor: pointer;
          //在text-align的基础上继续缩进
          text-indent: 25px;
        }
      }

      //搜索选项
      .options{
        margin: 10px auto 0 auto;
        width:600px;
        height:100px;
        .option-wrap{
          padding: 5px 0;
          border-bottom:1px dashed #cbcbcb;
          height:30px;
          line-height: 30px;
          position: relative;
          .search-range{
            position: absolute;
            right:0;
            top:5px;
            font-size: 13px;
            color:#ffa000;
          }
          .slider{
            position: relative;
            top:3px;
            margin-left: 42px;
          }

          .option-title{
            display: inline;
            width:40px;
            height:30px;
            font-size: 14px;
            font-weight: bold;
            float:left;
          }
          ul{
            margin-right: 10px;
            float:left;
            .item-active{
              background-color:#ffa000;
              color:#fff;
            }
            li{
              cursor: pointer;
              margin-left: 10px;
              text-align: center;
              float:left;
              height:20px;
              padding:5px 10px;
              line-height: 20px;
              border-radius: 5px;
              color:#000;
              font-size:14px;
              background-color: #fff;
            }
          }
        }

      }

    }
    .city-wrap{
      position: absolute;
      border-radius: 10px;
      left:0;
      top:0;
      width:100%;
      height:100%;
      background: url('./../../assets/bg/chicago.jpg');
      background-size: cover;
      z-index:101;
      .overlay{
        position: absolute;
        left:0;
        top:0;
        width:100%;
        height:100%;
        background-color: rgba(0,0,0,0.5);
        border-radius: 10px;
        z-index:99;
      }
      .abbreviation{
        width:60%;
        margin:200px auto 0 auto;
        height:100px;
        z-index:100;
        position: relative;
        .line{
          height:5px;
          width:60px;
          background-color: #e05244;
        }
        .abbreviation-title{
          margin-top: 20px;
          font-size: 35px;
          color:#fff;

        }
        .abbreviation-content{
          margin-top: 20px;
          font-size: 15px;
          color:#fff;
          width:500px;
          word-break: break-all;
          line-height: 20px;
        }
        .use-now{
          @color:#fff;
          width:200px;
          height:50px;
          margin: 200px auto 0 auto;
          border:1px solid @color;
          border-radius: 50px;
          color:@color;
          text-align: center;
          line-height: 50px;
          font-size: 25px;
          @hoverColor:#e05244;
          transition: all .5s;
          cursor: pointer;
          &:hover{
            border:1px solid @hoverColor;
            background-color: @hoverColor;
          }
        }
      }
    }
    //动画效果
    .myFade-leave-active{
      transition: all 1s;
    }
    .myFade-leave-to{
      opacity: 0;
    }
  }
</style>
