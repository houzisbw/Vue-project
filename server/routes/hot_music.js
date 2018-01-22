/**
 * Created by Administrator on 2018/1/20.
 */
var express = require('express');
var router = express.Router();
//热门歌曲列表数据模型
var HotMusicList = require('./../models/Crawler/hotMusicList');
//热门歌曲歌词
var HotMusicLyric = require('./../models/Crawler/hotMusicLyric');

//获取最热歌手前十，依据歌曲数目来判定
router.get('/hotestSinger',function(req,res,next){
  HotMusicList.find({}).sort({songNum:-1}).limit(10).exec(function(err,docs){
    if(err){
      res.json({
        status:-1
      })
    }else{
      //查询成功
      if(docs){
        res.json({
          singerInfoList:docs,
          status:1
        })
      }else{
        res.json({
          status:-1
        })
      }
    }
  })
});

//获取热门歌曲歌词
router.post('/hotMusicLyric',function(req,res,next){
  var num = parseInt(req.body.num,10);
  HotMusicLyric.find({}).sort({num:-1}).limit(num).exec(function(err,docs){
    if(err){
      res.json({
        status:-1
      })
    }else{
      res.json({
        status:1,
        lyrics:docs
      })
    }
  })
})



module.exports = router;
