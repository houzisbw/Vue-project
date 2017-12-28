var express = require('express');
var router = express.Router();
//引入用户数据模型
var User = require('./../models/user');


//前端发送来的注册请求,req是请求，res是回应
router.post('/register',function(req,res,next){
    //获取用户信息
    let username = req.body.username,
        email = req.body.email,
        password = req.body.password;
    //存入数据库
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

//登录请求
router.post('/login',function(req,res,next){
    //获取用户信息
    var username = req.body.username,
        password = req.body.password;
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





/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });



module.exports = router;
