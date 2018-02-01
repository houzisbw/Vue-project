/**
 * Created by Administrator on 2017/12/29.
 */
//cookie存活时间,单位毫秒
let cookieMaxAge = 1000 * 60 * 60 * 24 * 30;
//书签页面截图所存放的路径(本地调试路径)
//let bookMarkSaveUrl = './../../static/bookmarkImages/';
//服务器上的地址
let bookMarkSaveUrl = './../views/static/bookmarkImages/';
//书签页面返回数据延迟时间(ms)，保证截图已经完成
let bookMarkResponserDelay = 1000;



//输出
module.exports = {
  cookieMaxAge,
  bookMarkSaveUrl,
  bookMarkResponserDelay
}
