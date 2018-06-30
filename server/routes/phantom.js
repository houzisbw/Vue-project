/**
 * Created by Administrator on 2017/12/29.
 */
var express = require('express');
var phantom = require('phantom');
var path = require('path');
var fs = require('fs');
var router = express.Router();
//引入配置信息
var config = require('./../config/config');

function base64_encode(file) {
  // read binary data
  var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return new Buffer(bitmap).toString('base64');
}
//从url获取图片名字，截取其中的数字和字母，目的是为了只生成一张图片
function getPictureNameFromUrl(url){
  var picName = '';
  for(var i=0;i<url.length;i++){
    var regExp = /^\w$/;
    if(regExp.exec(url[i])){
      picName += url[i];
    }
  }
  return picName;
}
//var page = require('webpage').create();
//收到来自前端的网页解析请求
router.post('/getTitle',function(req,res,next){
  //获取前端传来的网页url
  let url = req.body.url;
  //phantom进行标题提取分析
  let sitepage = null;
  let phInstance = null;
  phantom.create()
    .then(instance => {
      phInstance = instance
      return instance.createPage()
    })
    .then(page => {
      sitepage = page;
      return page.open(url)
    })
    .then(status => {
      //获取网页标题
      return sitepage.property('title')
    })
    .then(content => {
      var pageScreenShotName = '';
      //如果标题存在才截图
      if(content) {
        //截图操作,设置视口大小
        sitepage.property('viewportSize', {
          width: 300,
          height: 400
        });
        //设置剪切的图片大小，生成固定大小的图片
        sitepage.property('clipRect', {
          top: 0,
          left: 0,
          width: 300,
          height: 350
        });
        //图片缩放
        sitepage.property('zoomFactor', 0.25);
        //生成图片名字
        var imgName = getPictureNameFromUrl(url) + '.png';
        var output = config.bookMarkSaveUrl + imgName;
        //截图要延迟，因为立即打开网页截图内容会加载不全
        setTimeout(function(){
          //图片截取函数
          console.log('render start!!');
          sitepage.render(output, {format: 'png', quality: '0'});
          pageScreenShotName = imgName;
          //延迟响应前端，因为立即返回的话截图还不存在，前端无法显示图片
          setTimeout(function(){
            console.log('res json')
            res.json({
              pageScreenShotName:pageScreenShotName,
              pageTitle:content
            });
            sitepage.close();
            phInstance.exit()
          },config.bookMarkResponserDelay)
        },1000)
      //如果标题不存在
      }else{
        res.json({
          pageScreenShotName:'none',
          pageTitle:''
        });
        sitepage.close();
        phInstance.exit()
      }

    })
    .catch(error => {
      console.log(error)
      phInstance.exit()
    })


});

module.exports = router;

