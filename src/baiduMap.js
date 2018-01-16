/**
 * Created by Administrator on 2018/1/16.
 */
//异步加载百度地图
export function MP(ak) {
  return new Promise(function (resolve, reject) {
    window.init = function () {
      //此时加载完成，可以初始化地图了
      resolve(BMap)
    }
    var script = document.createElement("script");
    script.type = "text/javascript";
    //加载完成时执行init回调函数，注意init必须是全局window下的方法
    script.src = "http://api.map.baidu.com/api?v=2.0&ak="+ak+"&callback=init";
    script.onerror = reject;
    document.head.appendChild(script);
  })
}
