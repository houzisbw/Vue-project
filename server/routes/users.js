var express = require('express');
var router = express.Router();
//引入用户数据模型
var User = require('./../models/user');
//引入配置信息
var config = require('./../config/config');


//前端发送来的注册请求,req是请求，res是回应
router.post('/register',function(req,res,next){
    //获取用户信息
    let username = req.body.username,
        email = req.body.email,
        password = req.body.password;
    //存入数据库,不写的字段则是空
    var userInfo = new User({
        username:username,
        email:email,
        password:password
    });
    //判断用户名是否存在
    var query = User.where({username:username});
    query.findOne(function(err,doc){
        //返回前端状态码:-1出错，0找到相同用户，1未找到相同用户
        if(err){
          res.json({
            status:-1
          })
        }
        //找到相同名字的注册用户,找不到为null
        if(doc){
          res.json({
            status:0
          })
        //新用户保存并返回前端
        }else{
          //保存新用户
          userInfo.save(function(err){
            //出错返回-1
            if(err){
              res.json({
                status:-1
              })
            }
            //返回前端新用户已注册
            res.json({
              status:1
            })
          })

        }
    });
});

//检查是否登录
router.get('/checkLogin',function(req,res,next){
    //获取浏览器发给服务端的cookie,req是浏览器的请求
    let cookie = req.cookies.username;
    //状态码: 0:不存在cookie, 1:存在cookie
    //已经登录了
    if(cookie){
       res.json({
         status:1,
         username:cookie
       })
    }else{
      res.json({
        status:0
      })
    }
});

//登出请求
router.post('/logout',function(req,res,next){
    //清除cookie
    res.clearCookie('username');
    //返回前端时cookie就被清掉了
    res.json({
      status:1
    })
});
//登录请求
router.post('/login',function(req,res,next){
    //获取用户信息
    var username = req.body.username,
        password = req.body.password,
        isAutoLogin = req.body.isAutoLogin;
    //查询用户是否存在
    var query = User.where({username:username});
    query.findOne(function(err,doc){
      //返回前端状态码:-1出错，0未找到用户，1密码用户名都正确，2名字正确，密码错误
      if(err){
        res.json({
          status:-1
        })
      }else{
        //找到用户了
        if(doc){
          //密码不正确
          if(doc.password !== password){
            res.json({
              status:2
            })
          //登录成功,返回用户名
          }else{
            //设置cookie,这里服务端会set the HTTP Set-Cookie header
            //第一个参数是cookie的name,第二个是value,第三个是选项
            //如果是30天免登录
            if(isAutoLogin) {
              res.cookie('username', username, {
                path: '/',
                //最大存活时间,单位:毫秒
                maxAge: config.cookieMaxAge
              });
            }
            res.json({
              status:1,
              username:doc.username
            })
          }
        //未找到用户
        }else{
          res.json({
            status:0
          })
        }
      }
    })
})

//保存书签请求
router.post('/saveBookMark',function(req,res,next){
    let username = req.cookies.username;
    let url = req.body.pageUrl,
        title = req.body.pageTitle,
        isPublic = req.body.isPublic,
        markType = req.body.markType,
        screenShotName = req.body.pageScreenName;
    //查询用户，根据name
    var query = User.where({username:username});
    query.findOne(function(err,doc){
      //返回前端状态码:-1出错，1书签已存在，2保存成功
      if(err) {
        res.json({
          status: -1
        })
      }else{
        //判断书签是否存在，若存在则不保存
        var isExist = false;
        doc.bookMark.forEach(function (item) {
            //很奇怪，里面嵌套了一层数组，目前不知道为啥
            if(item[0].url === url){
              isExist = true;
            }
        })
        //如果已经存在同名书签
        if(isExist){
          res.json({
            status: 1
          })
        }else{
          //保存书签
          var bm = {
            url:url,
            title:title,
            isPublic:isPublic,
            screenShotName:screenShotName,
            type:markType
          }
          doc.bookMark.push(bm);
          doc.save(function(err1,doc1){
              if(err1){
                res.json({
                  status: -1
                })
              //保存成功
              }else{
                res.json({
                  status: 2
                })
              }
          })
        }
      }
    })
});

//获取书签列表
router.get('/getBookMarkList',function(req,res,next){
  //获取用户名
  let username = req.cookies.username;
  var query = User.where({username:username});
  query.findOne(function(err,doc){
    //前端状态码:1成功获取列表，-1失败
    if(err){
      res.json({
        status:-1
      })
    }else{
      if(doc){
        // 获取书签列表
        let bookMarkList = doc.bookMark;
        var retBookMarkList = [];
        bookMarkList.forEach(function(item){
          //给每个对象添加字段：favicon字段,通过url获取网站根目录，加上/favicon.ico即可
          var faviconUrl = '';
          var slashCnt = 0;
          for(var i=0;i<item[0].url.length;i++){
            faviconUrl += item[0].url[i];
            if(item[0].url[i] === '/'){
              slashCnt++;
              //根目录截止
              if(slashCnt === 3){
                break;
              }
            }
          }
          faviconUrl += 'favicon.ico';
          item[0].faviconUrl = faviconUrl;
          retBookMarkList.push(item[0]);
        });
        res.json({
          status:1,
          bookMarkList:retBookMarkList
        })
      }else{
        res.json({
          status:-1
        })
      }

    }
  })
})



/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });



module.exports = router;
