/**
 * Created by Administrator on 2017/12/29.
 */
var express = require('express');
var phantom = require('phantom');
var router = express.Router();

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
      sitepage = page
      return page.open(url)
    })
    .then(status => {
      //获取网页标题
      return sitepage.property('title')
    })
    .then(content => {
      console.log(content)
      res.json({
        pageTitle:content
      });
      sitepage.close()
      phInstance.exit()
    })
    .catch(error => {
      console.log(error)
      phInstance.exit()
    })


});

module.exports = router;

