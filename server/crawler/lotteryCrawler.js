/**
 * Created by Administrator on 2018/1/7.
 */
//双色球爬虫:1,爬去历史数据 2,爬取每次开奖的号码
var mongoose = require('mongoose')
var schedule = require('node-schedule')
//这个用户是在admin数据库下创建的，可以对所有数据库读写，而其他数据库只能读写自己的
// mongoose.connect('mongodb://127.0.0.1:27017/flash')
// //监听:成功
// mongoose.connection.on("connected",function(){
//   console.log('数据库链接成功');
// })
// //监听:失败
// mongoose.connection.on("error",function(){
//   console.log('数据库链接失败');
// })

//双色球数据模型
var Lottery = require('./../models/Crawler/lottery')
//爬虫所需要的插件,superagent用于获取网页,cheerio用于使用css选择器读取网页数据,eventproxy用于同步请求,类似于promise.all
var http = require("http"),
    superagent = require("superagent"),
    cheerio = require("cheerio"),
    eventproxy = require('eventproxy');

//每周定时执行爬取3次双色球数据(周2,4,日晚上11点50分爬取,开奖时间是9点半左右)
function getLotteryDataEachWeekThreeTimes(){
  var pageUrl = 'http://zx.500.com/ssq/';
  superagent.get(pageUrl).end(function(err,pres){
    //如果存在html页面，否则会报错
    if(pres){
      var $ = cheerio.load(pres.text);
      //双色球数据对象
      var obj = {};
      //期数
      obj.lotteryTime = $('#kj_expect option:selected').text();
      //红球
      var ballsList = $('#kj_opencode li');
      for(var i=0;i<ballsList.length;i++){
        //红色球
        if(i <= 5){
          obj['red'+(i+1)] = parseInt(ballsList.eq(i).text(),10);
        //篮球
        }else{
          obj['blue'] = parseInt(ballsList.eq(i).text(),10);
        }
      }
      //存入数据库
      var lottery = new Lottery({
        time:obj.lotteryTime,
        red1:obj.red1,
        red2:obj.red2,
        red3:obj.red3,
        red4:obj.red4,
        red5:obj.red5,
        red6:obj.red6,
        blue:obj.blue
      })
      lottery.save();
      //console.log('executed !')
    }
  })
}


//此函数一次性爬取所有双色球历史数据，只执行一次
function getHistroyData(){
  //问题所在：每次同时爬取的页面最好低于2000个，否则一直卡住无结果
  var ep = new eventproxy(),
    pageUrls = [],  //存放收集文章页面网站
    pageNum = 2000,  //要爬取的页数
    startIndex = 17008;  //开始期数

  for(var i=startIndex ; i<= pageNum + startIndex; i++){
    if(i<=9999){
      pageUrls.push('http://kaijiang.500.com/shtml/ssq/0'+i+'.shtml');
    }else{
      pageUrls.push('http://kaijiang.500.com/shtml/ssq/'+i+'.shtml');
    }
  }
  // 轮询 所有文章列表页
  pageUrls.forEach(function(pageUrl){
    superagent.get(pageUrl)
      .end(function(err,pres){
        // pres.text 里面存储着请求返回的 html 内容，将它传给 cheerio.load 之后
        // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
        // 剩下就都是利用$ 使用 jquery 的语法了
        var obj = {};
        if(pres) {
          var $ = cheerio.load(pres.text);
          //双色球数据对象
          //当前期数
          var ballTime = $('.td_title01 .cfont2 strong').text();
          obj.time = ballTime;
          //获取红球和蓝球
          var ballLis = $('.ball_box01 li');
          for (var i = 0; i < ballLis.length; i++) {
            var ballNumber = ballLis.eq(i).text();
            if (i <= 5) {
              obj['red' + (i + 1)] = parseInt(ballNumber, 10);
            } else {
              obj.blue = parseInt(ballNumber, 10);
            }
          }
        }
        // 相当于一个计数器
        ep.emit('ball', obj);

      });
  });
  //当所有爬虫都执行完毕时，写入数据到数据库
  ep.after('ball', pageNum ,function(ballObjs){
    // 当所有 'ball' 事件完成后的回调触发下面事件
    var cnt=0;
    for(var i=0;i<ballObjs.length;i++){
      //如果存在该期双色球(中间某些期数不存在)
      if(ballObjs[i].blue) {
        cnt++;
        var lottery = new Lottery({
          time:ballObjs[i].time,
          red1:ballObjs[i].red1,
          red2:ballObjs[i].red2,
          red3:ballObjs[i].red3,
          red4:ballObjs[i].red4,
          red5:ballObjs[i].red5,
          red6:ballObjs[i].red6,
          blue:ballObjs[i].blue
        })
        lottery.save();
      }
    }
    console.log('总期数'+cnt);
  });
}

//导出双色球爬虫接口供app.js使用,所有爬虫接口都放在server入口文件内开启
module.exports.getLotteryDataWeekly = getLotteryDataEachWeekThreeTimes;


