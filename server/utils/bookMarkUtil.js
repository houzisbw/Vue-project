/**
 * Created by Administrator on 2018/1/4.
 */
function sortUp(a,b){
  return parseInt(a[0].date,10) - parseInt(b[0].date,10)
}
function sortDown(a,b) {
  return parseInt(b[0].date,10) - parseInt(a[0].date,10)
}
//按书签点击次数排序,降序
function sortBookMarkCount(a,b){
  return b.num - a.num
}

//根据url获取网站favicon的url
function getFaviconUrl(url){
  var faviconUrl = '';
  var slashCnt = 0;
  for (var i = 0; i < url.length; i++) {
    faviconUrl += url[i];
    if (url[i] === '/') {
      slashCnt++;
      //根目录截止
      if (slashCnt === 3) {
        break;
      }
    }
  }
  faviconUrl += 'favicon.ico';
  return faviconUrl;
}

module.exports.sortUp = sortUp;
module.exports.sortDown = sortDown;
module.exports.sortBookMarkCount = sortBookMarkCount;
module.exports.getFaviconUrl = getFaviconUrl;
