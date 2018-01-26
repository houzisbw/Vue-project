/**
 * Created by Administrator on 2018/1/18.
 */
//爬虫所需要的插件,superagent用于获取网页,cheerio用于使用css选择器读取网页数据,eventproxy用于同步请求,类似于promise.all
var http = require("http"),
  superagent = require("superagent"),
  cheerio = require("cheerio"),
  eventproxy = require('eventproxy'),
  axios  = require('axios'),
  nodejieba = require('nodejieba');

//引入数据库
var HotMusicList = require('./../models/Crawler/hotMusicList');
var HotMusicLyric = require('./../models/Crawler/hotMusicLyric');
//链接数据库
var mongoose = require('mongoose')
//这个用户是在admin数据库下创建的，可以对所有数据库读写，而其他数据库只能读写自己的
mongoose.connect('mongodb://127.0.0.1:27017/flash')
//监听:成功
mongoose.connection.on("connected",function(){
  console.log('数据库链接成功');
})
//监听:失败
mongoose.connection.on("error",function(){
  console.log('数据库链接失败');
})

const {Builder, By, Key, until} = require('selenium-webdriver');

//重要
require('chromedriver'); //导入chrome浏览器 driver

//分词处理
function splitWordByJieba(wordsStr){
  //为啥stopWord不起作用
  nodejieba.load({
    stopWordDict: nodejieba.DEFAULT_STOP_WORD_DICT
  });
  //分词处理
  var wordsList = nodejieba.cut(wordsStr);
  //需要去掉的词语列表
  var deleteWordsList = ['编曲','混音','制作','作词'];
  //去掉单字
  var finalWordsObj = {};
  for(var i=0;i<wordsList.length;i++){
    if(wordsList[i].length>1 && deleteWordsList.indexOf(wordsList[i]) === -1){
      if(finalWordsObj.hasOwnProperty(wordsList[i])){
        finalWordsObj[wordsList[i]]++;
      }else{
        finalWordsObj[wordsList[i]] = 1;
      }
    }
  }
  //进行数量排序降序排列
  var sortList = [];
  for(var key in finalWordsObj){
    if(finalWordsObj.hasOwnProperty(key)){
      sortList.push({
        word:key,
        cnt:finalWordsObj[key]
      })
    }
  }
  //降序排列
  sortList.sort(function(a,b){
    return b.cnt - a.cnt;
  });
  //取前100个展示，但是要保存500个
  var topN = sortList.length<500 ? sortList.length : 500;
  //先删除所有的歌词
  HotMusicLyric.remove({},function(err,docs){
    for(var i=0;i<topN;i++){
      //console.log(sortList[i].word+' '+sortList[i].cnt)
      var hotMusicLyric = new HotMusicLyric({
        word:sortList[i].word,
        num:sortList[i].cnt
      })
      hotMusicLyric.save();
    }
  })
}


//格式化歌词
function formatSongData(lyric){
  //正则处理歌词，去掉时间部分,注意加g全局处理，而不是只匹配一个
  var regExp = /\[.*\]/g;
  var songData = lyric.replace(regExp,'');
  var cnt=0;
  var lyricWriter = '',themeWriter = '';
  for(var i=0;i<songData.length;i++){
    if(songData[i] === '\n'){
      cnt++;
    }
    if(cnt<1){
      themeWriter+=songData[i];
    }else if(cnt<2){
      lyricWriter+=songData[i];
    }
    if(cnt===2) break;
  }
  //去掉作词作曲和空白和换行,最终结果是纯歌词，无任何其他符号
  songData = songData.replace(themeWriter,'');
  songData = songData.replace(lyricWriter,'');
  songData = songData.replace(/\n|\s/g,'');
  //只匹配中文
  songData = songData.replace(/[^\u4e00-\u9fa5]/g,'');
  return songData;
}


//首先从网易云音乐热歌界面获取所有热门歌曲的id，歌名，作者
//网易云音乐内容在iframe里面，无法爬取
//貌似一定时间内api做了访问限制，访问数有限,貌似10分钟的限制,否则会出现503错误
function getSongData(){
  //所有热门歌曲的总歌词
  var totalLyric = '';
  //网易云音乐歌词api,中间加上歌曲id即可
  var apiUrlStart = 'http://music.163.com/api/song/lyric?os=pc&id=',
      apiUrlEnd = '&lv=-1&kv=-1&tv=-1';
  //热门歌曲链接，注意这里没有#,而浏览器里面有#
  var hotMusicUrl = 'http://music.163.com/discover/toplist?id=3778678';
  //selenium测试
  var webdriver = require('selenium-webdriver'); //导入selenium 库
  var driver = new webdriver.Builder().forBrowser('chrome').build(); //创建一个chrome 浏览器实例
  //里面的所有方法都是返回promise，尤其注意这一点
  driver.get(hotMusicUrl).then(()=>{
    //进入iframe中,参数是iframe的id
    driver.switchTo().frame('g_iframe').then(()=>{
      //获取歌曲链接
      var txt = driver.findElements(By.css('.txt a'));
      var songLinkArray = [];
      txt.then((array)=>{
        var songNum = array.length;
        var cnt = 0;
        for(let i=0;i<array.length;i++){
          //不加延时会导致部分promise无法正确执行
          setTimeout(()=>{
            //每个方法都返回promise
            array[i].getAttribute('href').then((r)=>{
              cnt++;
              var songId = r.split('=')[1];
              songLinkArray.push(songId);
              //全部歌曲id爬取完成
              if(cnt === songNum){
                //开始进行歌词爬取
                var lyricNum = songLinkArray.length;
                var lyricCnt = 0;
                songLinkArray.forEach((item,index)=>{
                  var songUrl = apiUrlStart + item + apiUrlEnd;
                  setTimeout(()=>{
                    //请求歌词,结果发现还是有promise被reject，还有些歌是纯音乐,无歌词
                    //无法判断何时结束,有时候所有请求都会被拒绝，奇了怪,得多重复几次，周四的时候
                    //then的第二个参数是拒绝函数，第一个是决议函数
                    axios.get(songUrl).then(
                    //被resolve
                      (result)=>{
                      var rawData = result.data.lrc.lyric;
                      //获取格式化后的歌词
                      var formattedSongData = formatSongData(rawData);
                      //保存歌词
                      totalLyric += formattedSongData;
                      lyricCnt++;
                      //全部歌词爬取完成
                      if(lyricCnt === lyricNum){
                          splitWordByJieba(totalLyric)
                          //退出浏览器
                          driver.quit();
                      }
                    //发生错误时:注意这里不是被reject，而是错误
                    //在then的第二个参数函数里面死活找不到原因...
                    }).catch((error)=>{
                      lyricCnt++;
                      //全部歌词爬取完成
                      if(lyricCnt === lyricNum){
                        splitWordByJieba(totalLyric)
                        driver.quit();
                      }
                    })
                  },10*index)
                })
              }
            });
          },5*i)
        }
      })
    })
  });
}

//获取热门歌曲歌手名字,以后要写在前端，防止服务器ip被封
function getHotListSingerName(){
  //热门歌曲链接，注意这里没有#,而浏览器里面有#
  var hotMusicUrl = 'http://music.163.com/discover/toplist?id=3778678';
  //selenium测试
  var webdriver = require('selenium-webdriver'); //导入selenium 库
  var driver = new webdriver.Builder().forBrowser('chrome').build(); //创建一个chrome 浏览器实例
  //里面的所有方法都是返回promise，尤其注意这一点
  driver.get(hotMusicUrl).then(()=>{
    //进入iframe中,参数是iframe的id
    driver.switchTo().frame('g_iframe').then(()=>{
      //获取歌曲链接
      var txt = driver.findElements(By.css('.text'));
      var singerNameObj = {};
      txt.then((array)=>{
        var singerNum = array.length;
        var cnt = 0;
        var singerArray = [];
        for(let i=0;i<array.length;i++) {
          //不加延时会导致部分promise无法正确执行
          setTimeout(()=>{
            array[i].getAttribute('title').then((r)=>{
              singerArray.push(r);
              cnt++;
              if(singerNameObj.hasOwnProperty(r)){
                singerNameObj[r]++;
              }else{
                singerNameObj[r] = 1;
              }
              //全部获取完成
              if(cnt === singerNum){
                //获取歌手歌曲名字
                driver.findElements(By.css('.txt b')).then((songArray)=>{
                  var songNum = songArray.length;
                  var cnt_song = 0;
                  var songNameArray = [];
                  for(let i=0;i<songArray.length;i++){
                    //不加延时会导致部分promise无法正确执行
                    setTimeout(()=>{
                      songArray[i].getAttribute('title').then((re)=>{
                        cnt_song++;
                        songNameArray.push(re);
                        //全部歌曲爬取完成,保存数据库
                        if(cnt_song === songNum) {
                            //最终要保存到数据库的是对象数组
                            var finalSingerObj = {};
                            for(var j=0;j<songNameArray.length;j++){
                              //先统计出singer对象,key为name，value为对象(songList:[],songNum:int)
                              if(finalSingerObj.hasOwnProperty(singerArray[j])){
                                finalSingerObj[singerArray[j]].songList.push(songNameArray[j]);
                                finalSingerObj[singerArray[j]].songNum++;
                              }else{
                                //这里必须先初始化为空对象才行
                                finalSingerObj[singerArray[j]] = {};
                                finalSingerObj[singerArray[j]].songList = [];
                                finalSingerObj[singerArray[j]].songList.push(songNameArray[j]);
                                finalSingerObj[singerArray[j]].songNum = 1;
                              }
                            }
                            //获取歌手的图片url
                            var url = 'http://music.163.com/api/playlist/detail?id=3778678';
                            axios.get(url).then((results)=>{
                              var tracks = results.data.result.tracks;
                              //保存歌手对应的图片url
                              var singerPicObj={};
                              for(var i=0;i<tracks.length;i++){
                                  var picUrl = tracks[i].album.picUrl;
                                  var nameList = [];
                                  //合唱的话名字是由多个人拼接而成,用/隔开,而爬虫爬取的名字则是拼接后的名字，这里要注意
                                  for(var j=0;j<tracks[i].artists.length;j++){
                                    nameList.push(tracks[i].artists[j].name);
                                  }
                                  let name = nameList.join('/');
                                  singerPicObj[name] = picUrl;
                              }
                              //存入数据库,先遍历对象得到对象数组{singerName:string,songList:[],songNum:int}
                              //首先得清空所有数据,防止重复的数据被保存
                              HotMusicList.remove({},(err,docs)=>{
                                for(let key in finalSingerObj){
                                  if(finalSingerObj.hasOwnProperty(key)){
                                    var hotMusicList = new HotMusicList({
                                      singerName:key,
                                      songNum:finalSingerObj[key].songNum,
                                      songList:finalSingerObj[key].songList,
                                      avatarUrl:singerPicObj[key]
                                    });
                                    //保存最新的数据
                                    hotMusicList.save();
                                  }
                                }
                                //退出浏览器
                                driver.quit();
                              })
                            })
                        }
                      })
                    },5*i);
                  }
                });
              }
            })
          },i*5)
        }
      })
    })
  })
}





//getHotListSingerName()
getSongData();

