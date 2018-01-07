/**
 * Created by Administrator on 2018/1/7.
 */
var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var lotterySchema = new Schema({
  'time':String,
  'red1':Number,
  'red2':Number,
  'red3':Number,
  'red4':Number,
  'red5':Number,
  'red6':Number,
  'blue':Number
})
//输出模型,第一个参数是名字，第二个是模型内容
//注意在数据库定义的时候一定要加s，在名字后面，这里的good会自动去+s然后匹配数据库中的集合,后面第三个参数(字符串)可以设置和哪个集合关联
module.exports = mongoose.model('lottery_double_ball',lotterySchema)
