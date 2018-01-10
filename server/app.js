var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var schedule = require('node-schedule');

var index = require('./routes/index');
var users = require('./routes/users');
var phantom = require('./routes/phantom');
var lottery = require('./routes/lottery');
//双色球爬虫接口,定时执行
var getLotteryData = require('./crawler/lotteryCrawler');
schedule.scheduleJob('50 23 * * 2,4,7',getLotteryData.getLotteryDataWeekly)

var app = express();



//在app.js中链接数据库,没有密码的形式,最后的参数是数据库名称,注意有用户名和密码的话必须加?authSource=admin,否则连接失败(生产环境下)
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


// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.engine('.html',ejs.__express);
//app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/user', users);
//网页截图和解析html结构
app.use('/phantom',phantom);
//彩票部分
app.use('/lottery',lottery)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
