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
            <input type="text" class="search-input" placeholder="输入小区或地区名字" v-model.trim="keyword" @keyup.enter="searchEstate">
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
            <!--小区设施选项-->
            <div class="option-wrap ">
              <span class="option-title">设施:</span>
              <ul class="option-city">
                <li v-for="(facility,index) in facilityList"
                    @click="changeFacility(index)"
                    :class="{'item-active':checkActive(index)}">
                  {{facility}}
                </li>
              </ul>
              <span class="search-range search-range-offset">点击选项展示/隐藏对应地图标注</span>
            </div>
          </div>
        </div>
        <!--地图容器-->
        <div class="map-container" id="map-container">
        </div>
        <!--数据统计-->
        <div class="facility-graph-wrap" v-if="isFacilityGraphShow">
          <div class="facility-graph" id="facility-graph">
          </div>
        </div>
        <!--遮罩层-->
        <transition name="myFade">
          <div class="city-wrap" v-show="isOverlayShow">
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
  //引入echarts
  import echarts from 'echarts'
  //lodash
  import _ from 'lodash'
  //事件总线
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
			//初始化marker容器,设施个数容器
      for(var i=0;i<this.facilityList.length;i++){
      	this.markerArray.push([]);
      	this.facilityNumObj[this.facilityList[i]] = 0;
      }

			//初始化地图,参数是ak密钥
      this.$nextTick(()=>{
        MP('oiu5kqXt7U3ljISAeX8UZZXlgOHIaZac').then(BMap=>{
            this.map = new BMap.Map('map-container');
            // 创建地图实例
            var point = new BMap.Point(104.072, 30.661);
            // 创建点坐标
            this.map.centerAndZoom(point, 12);
              //开启鼠标缩放
            //this.map.enableScrollWheelZoom(true);
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
            //添加自定义控件
            this.myControls();

          });
      });

    },
    data(){
			return{
				//是否展示数据图表
        isFacilityGraphShow:false,
				//搜索
        local:null,
				//搜索关键字
        keyword:'',
				//地图实例
        map:null,
        //输入地点坐标:经度，纬度
        estatePoint:null,
				isOverlayShow:true,
        //城市
        cityList:['北京', '上海','深圳','成都','广州','杭州','武汉','重庆'],
        cityActiveIndex:3,
        //设施
        facilityList:['医院', '超市', '公园', '地铁', '电影院', '学校'],
        //设施个数
        facilityNumObj:{},
        //设施图标,一一对应上面
        facilityIconList:[
        	require('./../../assets/icon/map-hospital.png'),
          require('./../../assets/icon/map-supermarket.png'),
          require('./../../assets/icon/map-park.png'),
          require('./../../assets/icon/map-metro.png'),
          require('./../../assets/icon/map-cinema.png'),
          require('./../../assets/icon/map-school.png')
        ],
        //marker容器，存放上述设施的marker标注
        markerArray:[],
        //选中的设施列表:里面存放index
        selectedFacilityList:[1,4],
        totalFacilityList:[0,1,2,3,4,5],
        //搜索半径
        rangeValue:1000,
        //搜索结果的对象,key是设施名字
        searchResultArray:{},
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
    	//自定义控件
      myControls(){
      	//点击回到小区中心
        function positionResetControl(){
          // 设置默认停靠位置和偏移量
          this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
          this.defaultOffset = new BMap.Size(21, 230);
        }
        positionResetControl.prototype = new BMap.Control();
        //初始化方法，当调用map.addControl()方法添加自定义控件时，API会调用该对象的initialize()方法用来初始化控件
        var self = this;
        positionResetControl.prototype.initialize = function(map){
          // 创建一个DOM元素
          var div = document.createElement("div");
          // 设置样式
          div.setAttribute('title','回到中心');
          div.style.cursor = "pointer";
          div.style.width = "20px";
          div.style.height = "20px";
          div.style.borderRadius = "5px";
          div.style.border = "1px solid grey";
          //注意必须require才行
          div.style.background = "url(" + require('./../../assets/icon/resetPosition.png') + ') center center no-repeat white';
          div.style.backgroundSize = "18px 18px";
          // 绑定事件:回到搜索位置中心
          div.onclick = function(e){
            map.panTo(self.estatePoint);
          }
          // 添加DOM元素到地图中
          map.getContainer().appendChild(div);
          // 将DOM元素返回
          return div;
        }
        // 创建控件实例
        var myPositionResetControl = new positionResetControl();
        // 添加到地图当中
        this.map.addControl(myPositionResetControl);

      },
    	//添加地图标注
      addMapOverlays(centerPoint,radius){
        //添加地图标注：圆心
        var circle = new BMap.Circle(centerPoint,radius,{
        	strokeColor:"blue",
          strokeWeight:2,
          strokeOpacity:0.4,
          fillOpacity:0.1,
          fillColor:'#ffbc76'
        });
        this.map.addOverlay(circle);
      },
      //添加标注，icon自定义
      addMarker(point,iconPath,title,url,facilityIndex,isSelected){
        var myIcon = new BMap.Icon(iconPath, new BMap.Size(32, 32), {
          // 指定定位位置。
          // 当标注显示在地图上时，其所指向的地理位置距离图标左上
          // 角各偏移10像素和25像素。您可以看到在本例中该位置即是
          // 图标中央下端的尖角位置。
          anchor: new BMap.Size(0, 0)
        });
        // 创建标注对象并添加到地图
        var marker = new BMap.Marker(point, {icon: myIcon});
        marker.onclick = ()=>{
        	//显示信息窗口
          var opts = {
          	width:0,
            height:0
          };
          var infoWindow = new BMap.InfoWindow(title, opts);
          marker.openInfoWindow(infoWindow)
        };
        if(isSelected) this.map.addOverlay(marker);
        //将marker添加进容器
        this.markerArray[facilityIndex].push(marker);
      },
    	//搜索坐标点附近
      searchPointNearby(point){
        this.local = new BMap.LocalSearch(this.map,
          {
          	//每页容量,在地图上一次展示的数量
            pageCapacity:20,
            //搜索结束，展示结果(多关键字检索:results是数组,每个元素是LocalResult)
            onSearchComplete:(results)=>{
              if (this.local.getStatus() === BMAP_STATUS_SUCCESS){
              	//展示图表
                this.isFacilityGraphShow = true;
                for(var j=0;j<results.length;j++){
                	var keyword = this.facilityList[j];
                  this.searchResultArray[keyword] = [];
                  //保存搜索总数量
                  this.facilityNumObj[keyword] = results[j].getNumPois();
                  //当前页结果数
                  for (var i = 0; i < results[j].getCurrentNumPois(); i++){
                  	//保存名字和位置,标题信息
                  	this.searchResultArray[keyword].push({
                  		name:results[j].getPoi(i).title,
                      position:results[j].getPoi(i).point,
                      url:results[j].getPoi(i).url
                  	});
                  }
                  //画图表
                  //初始化图表div,注意必须nexttick才行，否则dom没有更新，无法获取到div
                  //因为v-if控制了dom的显示
                  this.$nextTick(()=>{
                    var myChart = echarts.init(document.getElementById('facility-graph'));
                    var facilityDataList = [];
                    //获取设施个数数组
                    for(var i=0;i<this.facilityList.length;i++){
                      facilityDataList.push(this.facilityNumObj[this.facilityList[i]]);
                    }
                    var options = {
                      title: {
                        text: this.keyword+'附近各类设施数量',
                        subtext: '该区域内总数(地图上最多显示20个)'
                      },
                      tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                          type: 'shadow'
                        }
                      },
                      legend: {
                        data: ['设施个数']
                      },
                      grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                      },
                      xAxis: {
                        type: 'value',
                        boundaryGap: [0, 0.01]
                      },
                      yAxis: {
                        type: 'category',
                        data: this.facilityList
                      },
                      series: [
                        {
                          name: '2012年',
                          type: 'bar',
                          data: facilityDataList
                        }
                      ]
                    }
                    myChart.setOption(options)
                  })
                }
                //添加地图标注:圆形区域
                this.addMapOverlays(point,this.rangeValue);
                //添加地图标注：各种设施
                for(let j=0;j<this.facilityList.length;j++){
                	//设施名字
                	var facilityShow = this.facilityList[j];
                	//如果该设施是已经选择了的
                  var isSelected = false;
                  if(this.selectedFacilityList.indexOf(j) !== -1){
                    isSelected = true;
                  }
                  for(var i=0;i<this.searchResultArray[facilityShow].length;i++){
                    let point = this.searchResultArray[facilityShow][i].position,
                        name = this.searchResultArray[facilityShow][i].name,
                        url = this.searchResultArray[facilityShow][i].url;
                    this.addMarker(point,this.facilityIconList[j],name,url,j,isSelected);
                  }
                }

              }
            }
          });

        //第一个参数是关键字(此处为数组，多关键字搜索)，第二个是搜索中心，第三个是半径
        this.local.searchNearby(this.facilityList,point,this.rangeValue)
      },
    	//搜索小区
      searchEstate(){
        //初始化marker容器
        for(var i=0;i<this.facilityList.length;i++){
          this.markerArray[i] = [];
        }
      	//清除覆盖物和结果数组
        this.map.clearOverlays();
        this.searchResultArray = [];
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
            	this.estatePoint = point;
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
              this.map.addOverlay(marker);
              //跳动动画,必须在addOverlay后设置
              marker.setAnimation(BMAP_ANIMATION_BOUNCE);
              //根据坐标点搜索附近的设施(不能直接使用searchNearby,因为center是字符串的话半径被忽略)
              this.searchPointNearby(point);
            }else{
            	//未搜索到结果
              eventBus.$emit('CONFIRM_DIALOG','在 '+this.cityList[this.cityActiveIndex]+' 市没有找到 '+this.keyword+' 的相关信息哦!');
            }
          },
          this.cityList[this.cityActiveIndex]);
      },
			useTool(){
				this.isOverlayShow = false;
      },
      changeCity(index){
				this.cityActiveIndex = index;
      },
      //检查是否active选中
      checkActive(index){
      	return this.selectedFacilityList.indexOf(index) !== -1;
      },
      //多选toggle
      changeFacility(index){
        //如果已经存在于选中列表则去除
        if(this.selectedFacilityList.indexOf(index) !== -1){
          //这里必须赋值给原数组，否则不会触发视图更新
          this.selectedFacilityList = _.remove(this.selectedFacilityList, function(item){
            return item !== index;
          })
          //删除marker
          for(var k=0;k<this.markerArray[index].length;k++){
          	let marker = this.markerArray[index][k];
          	this.map.removeOverlay(marker);
          }

        }else{
        	//加入列表
          this.selectedFacilityList.push(index);
          //添加marker
          //删除marker
          for(var k=0;k<this.markerArray[index].length;k++){
            let marker = this.markerArray[index][k];
            this.map.addOverlay(marker);
          }
        }

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
    .facility-graph-wrap{
      height:400px;
      .facility-graph{
        width:70%;
        height:300px;
        margin: 40px auto;
      }
    }
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
      margin-top: 50px;
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
        .option-wrap:last-child{
          border: none;
          padding-top:10px;
        }
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
          .search-range-offset{
            margin-top: 5px;
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
