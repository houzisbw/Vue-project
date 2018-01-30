var express = require('express');
var router = express.Router();
var bookMarkUtil = require('../utils/bookMarkUtil')
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
        password:password,
        //默认头像url
        profileImgUrl:'https://i.loli.net/2018/01/29/5a6eeb8eab2f5.jpg'
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
              res.cookie('profile', doc.profileImgUrl, {
                path: '/',
                //最大存活时间,单位:毫秒
                maxAge: config.cookieMaxAge
              });
            //一天免登录
            }else{
              res.cookie('username', username, {
                path: '/',
                //最大存活时间,单位:毫秒
                maxAge: config.cookieMaxAge / 30
              });
              res.cookie('profile', doc.profileImgUrl, {
                path: '/',
                //最大存活时间,单位:毫秒
                maxAge: config.cookieMaxAge / 30
              });
            }
            res.json({
              status:1,
              username:doc.username,
              profileImgUrl:doc.profileImgUrl
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
          //获取当前时间,毫秒数
          var date = new Date();
          var millsec = date.getTime().toString();
          //保存书签
          var bm = {
            url:url,
            title:title,
            isPublic:isPublic,
            screenShotName:screenShotName,
            type:markType,
            date:millsec
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
  //注意：通过req拿到的参数都是 字符串 ，如果是数字参数需要parseInt转化为数值
  //搜索关键字
  var keyword = req.param('keyword');
  //排序方向
  var sortDir = req.param('sort');
  //获取分页:page表示当前页数
  var page = parseInt(req.param('pageIndex'),10);
  //每一页多少条数据
  var pageSize = parseInt(req.param('pageSize'),10);
  //分页跳过多少条数据
  let skip = (page - 1)*pageSize;
  //console.log('page '+page)
  //console.log('pageSize '+pageSize)
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
      //找到用户
      if(doc){
        // 获取书签列表
        let bookMarkList = doc.bookMark;
        var retBookMarkList = [];
        var cnt = 0;
        //当前已经查询到的书签数量，必须小于等于pageSize
        var bookMarkNum = 0;
        //这里要排序
        if(sortDir === 'ascend'){
          //升序
          bookMarkList.sort(bookMarkUtil.sortUp);
        }else{
          //降序
          bookMarkList.sort(bookMarkUtil.sortDown);
        }

        bookMarkList.forEach(function(item){
          //如果是正常查询，非搜索的查询
          if(keyword === ''){
            cnt++;
          }else{
            //搜索状态下的查询，需要过滤:只有标题或链接包含关键字的才算
            if(item[0].url.indexOf(keyword) !== -1 || item[0].title.indexOf(keyword)!==-1){
              cnt++;
            }
          }
          //跳过指定量的数据
          if(cnt>skip) {
              //每次只能查询pageSize个书签
              if(bookMarkNum < pageSize) {
                //给每个对象添加字段：favicon字段,通过url获取网站根目录，加上/favicon.ico即可
                item[0].faviconUrl = bookMarkUtil.getFaviconUrl(item[0].url);
                if(keyword===undefined) {
                  retBookMarkList.push(item[0]);
                  bookMarkNum++;
                }else{
                  if(item[0].url.indexOf(keyword) !== -1 || item[0].title.indexOf(keyword)!==-1){
                    retBookMarkList.push(item[0]);
                    bookMarkNum++;
                  }
                }
              }
          }
        });
        //cnt是最终符合条件的书签总数
        res.json({
          status:1,
          bookMarkList:retBookMarkList,
          bookMarkTotalNum:cnt,
          keyword:keyword
        })
      //用户未找到
      }else{
        res.json({
          status:-1
        })
      }

    }
  })
})

//删除书签
router.post('/deleteBookMark',function(req,res,next){
  var url = req.body.url;
  var username = req.cookies.username;
  var query = User.where({username:username});
  query.findOne(function(err,doc){
    if(err){
      res.json({
        status:-1
      })
    }else{
      //找到用户
      if(doc){
        //搜寻与url相同的书签
        let bookMarkList = doc.bookMark;
        for(var i=0;i<bookMarkList.length;i++){
          if(bookMarkList[i][0].url === url){
            doc.bookMark.splice(i,1);
            break;
          }
        }
        doc.save(function(err,docSave){
          if(err){
            res.json({
              status:-1
            })
          }else{
            //删除成功
            res.json({
              status:1
            })
          }
        })
      }else{
        //用户未找到
        res.json({
          status:-1
        })
      }
    }
  })
})

//获取热门书签
router.get('/hotbookmark',function(req,res,next){
    var bookMarkSet = {};
    //要返回的数组
    var retBookMarkList = []
    //获取收藏数前10的书签,搜索所有用户
    //docs是查询的结果数组
    User.find({},function(err,docs){
        if(err){
          res.json({
            status:-1
          })
        }else{
          //找到用户
          if(docs){
            //遍历每个用户的每个书签列表，计算书签被收藏次数
            docs.forEach(function(item,index){
                var bookMarkList = item.bookMark;
                bookMarkList.forEach(function(itemMark,indexMark){
                  var bookUrl = itemMark[0].url;
                  if(!bookMarkSet.hasOwnProperty(bookUrl)){
                    bookMarkSet[bookUrl]={
                      title:itemMark[0].title,
                      url:itemMark[0].url,
                      screenShotName:itemMark[0].screenShotName,
                      num:1
                    };
                  }else{
                    bookMarkSet[bookUrl].num++;
                  }
                })
            })
            //排序,构建对象数组,对象不能直接按value排序
            var objArray = [];
            for(var key in bookMarkSet){
              objArray.push({
                url:key,
                num:bookMarkSet[key].num,
                title:bookMarkSet[key].title,
                screenShotName:bookMarkSet[key].screenShotName,
                faviconUrl:bookMarkUtil.getFaviconUrl(key)
              })
            }
            objArray.sort(bookMarkUtil.sortBookMarkCount);
            var cnt = 0;
            var MAX_NUM = 10;
            for(var i=0;i<objArray.length;i++){
              if(cnt<MAX_NUM){
                retBookMarkList.push(objArray[i]);
              }
              cnt++;
            }
            res.json({
              bookMarkList:retBookMarkList,
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

//保存用户头像
router.post('/saveProfile',function(req,res,next){
  //获取用户名字
  var username = req.cookies.username;
  //用户头像url
  var url = req.body.url;
  //保存数据库
  var query = User.where({username:username});
  query.findOne(function(err,doc){
    if(err){
      res.json({
        status:-1
      })
    }else{
      doc.profileImgUrl = url;
      doc.save(function(err,docSave){
        if(err){
          res.json({
            status:-1
          })
        }else{
          res.json({
            status:1
          })
        }
      });
    }
  })
})

//获取用户头像
router.get('/getprofile',function(req,res,next){
  //获取用户名字
  var username = req.cookies.username;
  //保存数据库
  var query = User.where({username:username});
  query.findOne(function(err,doc){
    if(err){
      res.json({
        status:-1
      })
    }else{
      res.json({
        status:1,
        imgUrl:doc.profileImgUrl
      })
    }
  })
});

//保存用户昵称和签名
router.post('/saveUserInfo',function(req,res,next){
  //用户昵称和签名
  var nickname = req.body.nickname,
      signature = req.body.signature;
  //获取用户名字
  var username = req.cookies.username;
  //保存数据库
  var query = User.where({username:username});
  query.findOne(function(err,doc){
    if(err){
      res.json({
        status:-1
      })
    }else{
     doc.nickname = nickname;
     doc.signature = signature;
     doc.save(function(err,saveDoc){
       res.json({
         status:1
       })
     })
    }
  })
})

//获取用户昵称和签名
router.get('/getUserInfo',function(req,res,next){
  //获取用户名字
  var username = req.cookies.username;
  //保存数据库
  var query = User.where({username:username});
  query.findOne(function(err,doc){
    if(err){
      res.json({
        status:-1
      })
    }else{
      if(doc){
        res.json({
          nickname:doc.nickname,
          signature:doc.signature,
          status:1
        })
      //未登录
      }else{
        res.json({
          status:2
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
