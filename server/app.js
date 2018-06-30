var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var schedule = require('node-schedule');
var favicon = require('serve-favicon');
var compression = require('compression')
var ejs = require('ejs')
var index = require('./routes/index');
var users = require('./routes/users');
var phantom = require('./routes/phantom');
var lottery = require('./routes/lottery');
var music = require('./routes/hot_music');
//获取服务器用户名和密码
var credentials = require('./config/config_credential');
//双色球爬虫接口,定时执行
var getLotteryData = require('./crawler/lotteryCrawler');
schedule.scheduleJob('50 12 * * 3,5,1',getLotteryData.getLotteryDataWeekly)
//网易云音乐爬虫接口
var neteaseCrawler = require('./crawler/musicCrawler');
schedule.scheduleJob('10 12 * * 4',neteaseCrawler.getHotListSingerName)
schedule.scheduleJob('20 12 * * 4',neteaseCrawler.getSongData)

//express实例
var app = express();

//跨域设置
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  //和客户端对应，必须设置以后，才能接收cookie
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',ejs.__express);
app.set('view engine', 'html');

//在app.js中链接数据库,没有密码的形式,最后的参数是数据库名称,注意有用户名和密码的话必须加?authSource=admin,否则连接失败(生产环境下)
//这个用户是在admin数据库下创建的，可以对所有数据库读写，而其他数据库只能读写自己的
//注意数据库需要权限访问，所以得加上密码账号
mongoose.connect('mongodb://'+credentials.serverUsername+':'+credentials.serverPassword+'@127.0.0.1:27017/flash?authSource=admin')
//mongoose.connect('mongodb://127.0.0.1:27017/flash');
//监听:成功
mongoose.connection.on("connected",function(){
  console.log('mongodb connection success');
})
//监听:失败
mongoose.connection.on("error",function(){
  console.log('mongodb connection fail');
})

//开启gzip压缩
app.use(compression());
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//这里views里面就存放前端的文件，很重要,express通过访问views里面的index.html来访问页面
app.use(express.static(path.join(__dirname, 'views')));

app.use('/', index);
app.use('/user', users);
//网页截图和解析html结构
app.use('/phantom',phantom);
//彩票部分
app.use('/lottery',lottery);
//网易云音乐部分
app.use('/music',music);

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
