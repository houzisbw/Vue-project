/**
 * Created by Administrator on 2018/1/4.
 */
//日期从毫秒数转化为中文显示
/*规则: (1)1小时内显示 刚刚
        (2)1小时-24小时内显示 多少小时前
        (3)一天内到7天内显示 多少天前
        (4)一周内到一个月内显示  多少周前
        (5)一个月内到一年内显示 多少月前
        (6)一年以上显示多少年前
*/
//一小时的毫秒数
const HOUR_MILLSEC = 1000 * 60 * 60;
//一天的毫秒数
const DAY_MILLSEC = HOUR_MILLSEC * 24;
//一周的毫秒数
const WEEK_MILLSEC = DAY_MILLSEC * 7;
//一个月的毫秒数
const MONTH_MILLSEC = WEEK_MILLSEC * 4;
//一年的毫秒数
const YEAR_MILLSEC = MONTH_MILLSEC * 12;
export function formatDateFromMillsec(millsecs){
    if(Math.floor(millsecs / YEAR_MILLSEC) >= 1){
      return Math.floor(millsecs / YEAR_MILLSEC)+'年前'
    }else if(Math.floor(millsecs / MONTH_MILLSEC) >= 1){
      return Math.floor(millsecs / MONTH_MILLSEC)+'个月前'
    }else if(Math.floor(millsecs / WEEK_MILLSEC) >= 1){
      return Math.floor(millsecs / WEEK_MILLSEC)+'周前'
    }else if(Math.floor(millsecs / DAY_MILLSEC) >= 1){
      return Math.floor(millsecs / DAY_MILLSEC)+'天前'
    }else if(Math.floor(millsecs / HOUR_MILLSEC) >= 1){
      return Math.floor(millsecs / HOUR_MILLSEC)+'小时前'
    }else{
      return '刚刚'
    }
}
