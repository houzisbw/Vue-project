/**
 * Created by Administrator on 2018/1/9.
 */
var express = require('express');
var router = express.Router();
//彩票数据模型
var Lottery = require('./../models/Crawler/lottery');
router.post('/analysis',function(req,res,next){
    var lotteryRed1 = req.body.red1,
        lotteryRed2 = req.body.red2,
        lotteryRed3 = req.body.red3,
        lotteryRed4 = req.body.red4,
        lotteryRed5 = req.body.red5,
        lotteryRed6 = req.body.red6,
        lotteryBlue = req.body.blue;
    //标志变量：是否开出过同号
    var isSame = false;
    //奇数偶数分布,0个奇数到6个奇数
    var evenOddObj = {
      Odd0:0,
      Odd1:0,
      Odd2:0,
      Odd3:0,
      Odd4:0,
      Odd5:0,
      Odd6:0
    }
    //跨度对象
    var lotteryNumberExpand = {};
    //和值对象
    var lotterySumObj = {};
    Lottery.find({},function(err,doc){
        if(err){
          res.json({
            status:-1
          })
        }else {
          //doc是数组
          doc.forEach(function (item) {
            //检查历史上是否有开出相同的号码(一二等奖都要计算,所以只算红球)
            if (item.red1 === lotteryRed1 && item.red2 === lotteryRed2 &&
              item.red3 === lotteryRed3 && item.red4 === lotteryRed4 &&
              item.red5 === lotteryRed5 && item.red6 === lotteryRed6) {
              isSame = true;
            }
            //检查奇数偶数分布，获取历史分布情况
            var oddNum = 0;
            for (let i = 1; i <= 6; i++) {
              if (parseInt(item['red' + i], 10) % 2 !== 0) {
                oddNum++;
              }
            }
            evenOddObj['Odd' + oddNum]++;

            //检查跨度走势:最大-最小的差值,最大32，最小5
            //首先找最大最小
            var min = 100, max = 0;
            for (let i = 1; i <= 6; i++) {
              var t = parseInt(item['red' + i], 10)
              if (t >= max) {
                max = t;
              }
              if (t <= min) {
                min = t;
              }
            }
            let expand = max - min;
            //统计次数,注意转化为字符串,数字也可以作为key
            if (lotteryNumberExpand.hasOwnProperty(expand.toString())) {
              lotteryNumberExpand[expand.toString()]++;
            } else {
              lotteryNumberExpand[expand.toString()] = 1;
            }


            //和值走势
            let sum = 0;
            for (let i = 1; i <= 6; i++) {
              sum += parseInt(item['red' + i], 10);
            }
            //统计次数,注意转化为字符串,数字也可以作为key
            if (lotterySumObj.hasOwnProperty(sum.toString())) {
              lotterySumObj[sum.toString()]++;
            } else {
              lotterySumObj[sum.toString()] = 1;
            }

          });

          //返回
          res.json({
            status: 1,
            isSame: isSame,
            evenOdd: evenOddObj,
            expand: lotteryNumberExpand,
            sum: lotterySumObj
          })
        }

    })

})

//获取遗漏情况
router.get('/getlosttime',function(req,res,next){
  var retRedObj = {},
      retBlueObj = {};
  var redCnt=0,blueCnt=0;
  //对数据库排序,按期数降序排序
  Lottery.find({}).sort({time:-1}).exec(function(err,docs){
    if(err){
      //返回
      res.json({
        status:-1
      })
    }else {
      //从开头开始查找(红球1-33)(蓝球1-16)
      //每次循环就是一期双色球
      var cnt = 0;
      for (var i = 0; i < docs.length; i++) {
        var balls = docs[i];
        //红球
        for (var j = 1; j <= 6; j++) {
          var t = 'red' + j;
          //如果没有该记录则记录下该红球的遗漏值
          if (!retRedObj.hasOwnProperty(balls[t].toString())) {
            retRedObj[balls[t].toString()] = cnt;
            redCnt++;
          }
        }
        //蓝球
        if (!retBlueObj.hasOwnProperty((balls.blue).toString())) {
          retBlueObj[(balls.blue).toString()] = cnt;
          blueCnt++;
        }
        //退出循环
        if (redCnt === 33 && blueCnt === 16) {
          break;
        }
        cnt++;
      }

      //返回
      res.json({
        status: 1,
        red: retRedObj,
        blue: retBlueObj
      })
    }


  });
})






module.exports = router;
