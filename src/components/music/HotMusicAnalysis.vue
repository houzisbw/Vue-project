<!--网易云热歌分析-->
<template>
    <div>
      <div class="wrap">
        <!--内容区域标题-->
        <div class="title">
          <div class="title-word">网易云热门歌曲榜单分析</div>
        </div>
        <!--内容区域-->
        <div class="section">
          <!--标题-->
          <div class="section-title-wrap">
            <div class="section-title">
              <span>热门歌手Top10</span>
            </div>
            <div class="update-time">
              排名依据歌手上榜歌曲数量, 每周四更新
            </div>
          </div>
          <!--内容-->
          <div class="section-content clearfix">
            <ul>
              <li v-for="(item,index) in hotSingerList">
                <!--歌手肖像-->
                <div class="singer-pic">
                  <img :src="item.avatarUrl">
                  <span class="singer-mask"></span>
                </div>
                <!--歌手描述-->
                <div class="singer-desc">
                  <div class="singer-name" :title="item.singerName">
                    {{item.singerName}}
                  </div>
                  <div class="singer-song-num" :title="showSongs(item.songList)">
                    {{item.songNum}}
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <!--歌词词云展示-->
        <div class="section">
          <!--标题-->
          <div class="section-title-wrap">
            <div class="section-title">
              <span>热歌榜歌词词云</span>
            </div>
            <div class="update-time">
              展示出现频率前100的歌词
            </div>
          </div>
          <!--内容-->
          <div class="section-content clearfix">
            <div class="canvas-div">
            </div>
          </div>
        </div>
        <!--歌词词语次数图表-->
        <div class="section">
          <!--标题-->
          <div class="section-title-wrap">
            <div class="section-title">
              <span>热歌榜歌词统计</span>
            </div>
            <div class="update-time">
              展示出现频率前100的歌词及次数
            </div>
          </div>
          <!--内容-->
          <div class="section-content clearfix">
            <div id="lyrics-top-100">
            </div>
          </div>
        </div>
      </div>
      <!--底部间隔-->
      <div class="bottom-padding">
      </div>
    </div>
</template>

<script>
  import {eventBus} from './../../eventBus'
  //echarts通过cdn引入
  import echarts from 'echarts'
  import axios from 'axios'
  import d3Cloud from 'd3-cloud'
  //不能直接使用import d3 from 'd3'，否则引入不全
  import * as d3 from 'd3'
	export default {
		name: 'hotMusicAnalysis',
    data(){
			return {
        hotSingerList:[],
        lyricArray:[]
      }
    },
    methods:{
    	//获取热门歌手top10
      getHotestSinger(){
        axios.get('/music/hotestSinger').then((resp)=>{
        	  this.hotSingerList = resp.data.singerInfoList;
        })
      },
      showLyricsTop100(){
          var myEchart = echarts.init(document.getElementById('lyrics-top-100'));
          var options = {
            title: {
              text: '歌词出现次数(拖动右侧滑块放大/缩小显示区域)',
              subtext: '',
              subtextStyle:{
                color:'#706d6d',
                fontSize:14
              }
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            legend: {
              data: ['歌词'],
              height:'1000'
            },
            grid: {
              left: '5%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'value',
              boundaryGap: [0, 0.01],
              name:'歌词次数',
              nameLocation:'center',
              nameGap:20
            },
            yAxis: {
              type: 'category',
              data: this.lyricArray.map((item)=>{
              	return item.word
              }),
              name:'歌词',
              nameLocation:'center',
              nameGap:100
            },
            series: [
              {
                name: '次数',
                type: 'bar',
                data: this.lyricArray.map((item)=>{
                  return item.num
                }),
                stack: 'chart',
                label: {
                  normal: {
                    position: 'right',
                    show: true,
                    formatter:function(obj){
                      var c = obj['value'];
                      return c+'次';
                    },
                    fontSize:13,
                    fontWeight:'bold',
                    color:"#c46f6f"

                  }
                }

              }

            ],
            dataZoom: [
              {
                type: 'slider',
                show: true,
                yAxisIndex: [0],
                left: '93%',
                start: 0,
                end: 30
              }
            ]
          };

          myEchart.setOption(options);
      },
      //获取前100的歌词,并画出词云
      getLyricTop100(){
        axios.post('/music/hotMusicLyric',{num:100}).then((resp)=>{
        	if(resp.data.status !== -1){
            this.lyricArray = resp.data.lyrics;
            this.lyricArray.sort((a,b)=>{
            	return b.num-a.num
            })
            //画词云
            this.drawLyricCloud();
            //展示歌词
            this.showLyricsTop100();
          }else{
        		//查询失败
            eventBus.$emit('CONFIRM_DIALOG','歌词查询失败~');
          }

        })
      },
      showSongs(songList){
      	var str = '';
      	songList.forEach(function(item){
      		str+='- '+item+' -\n';
        })
        return str
      },
      drawLyricCloud(){
        //文字颜色
        var textColor = ['#595b5a','#855452','#e17c78'];
        var layout = d3Cloud()
          .size([1000, 600])
          .words(this.lyricArray.map(function(d) {
            return {text: d.word, size: d.num, test: "haha"};
          }))
          .padding(5)
          //.rotate(function() { return ~~(Math.random() * 2) * 90; })
          .font("Impact")
          .fontSize(function(d) { return d.size; })
          .on("end", draw);

        layout.start();

        function draw(words) {
          d3.select(".canvas-div").append("svg")
            .attr("width", layout.size()[0])
            .attr("height", layout.size()[1])
            .append("g")
            .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function(d) { return d.size + "px"; })
            .style("font-family", "Impact")
            //颜色不是color，而是fill选项
            .style("fill",function(d){
            	return textColor[Math.floor(Math.random()*3)]
            })
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
              return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; });
        }


      }
    },
    mounted(){
      this.getHotestSinger();
      this.getLyricTop100();
    }
	}
</script>

<style lang="less" type="text/less" scoped>
  .bottom-padding{
    height:200px;
    width:100%;
  }
  .wrap {
    margin: 20px auto;
    padding-bottom:20px;
    width: 1200px;
    background-color: #fff;
    border: 1px solid #d3d3d3;
    border-radius: 10px;
    box-shadow: 0 0 3px 3px #d3d3d3;
    position: relative;
    .section{
      //每部分标题区域
      .section-title-wrap{
        position: relative;
        height:50px;
        margin-top: 20px;
        .section-title{
          position: absolute;
          left:-35px;
          top:0;
          width:200px;
          height:50px;
          background: url('./../../assets/icon/wrapped-title.png') left top no-repeat ;
          background-size: 220px 210px;
          line-height: 50px;
          span{
            margin-left:40px;
            margin-top: -10px;
            position: relative;
            top:-5px;
            color:#fff;
            font-size: 18px;
          }
        }
        .update-time{
          float:right;
          height:100%;
          line-height: 30px;
          margin-right:20px;
          color:#cbcbcb;
          font-size: 14px;
        }
      }

      //内容区域
      .section-content{
        margin-top: 20px;
        #lyrics-top-100{
          width:80%;
          height:600px;
          margin: 0 auto;
        }
        .canvas-div{
          margin: 0 auto;
          width:1000px;
          height:600px;
        }
        li{
          float:left;
          width:240px;
          height:240px;
          margin-bottom:20px;
          .singer-pic{
            margin: 0 auto;
            width:70%;
            height:70%;
            position: relative;
            //防止外边距超出div
            overflow: hidden;
            img{
              display: block;
              margin: 30px auto;
              width:110px;
              height:110px;
            }
            .singer-mask{
              display: inline-block;
              width:100%;
              height:100%;
              background: url('./../../assets/icon/singlecover.png') center center no-repeat;
              position: absolute;
              left:0;
              top:0;
              background-size: 240px * 0.7,240px * 0.7;
            }
          }
          .singer-desc{
            margin-top: 10px;
            @iconSize:26px;

            .singer-name{
              height:@iconSize;
              width:90px;
              margin: 0 0 5px 70px;
              padding-left: 35px;
              background: url('./../../assets/icon/singer-name.png') left center no-repeat;
              background-size: @iconSize @iconSize;
              color: #bababa;
              font-size: 14px;
              line-height: @iconSize;
              //多余的名字要隐藏
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            }
            .singer-song-num{
              cursor: pointer;
              height:@iconSize;
              width:90px;
              margin: 0 0 5px 70px;
              padding-left: 35px;
              color: #bababa;
              font-size: 14px;
              line-height: @iconSize;
              background: url('./../../assets/icon/singer-song-num.png') left center no-repeat;
              background-size: @iconSize @iconSize;
            }
          }
        }
      }
    }
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
