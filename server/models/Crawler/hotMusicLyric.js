/**
 * Created by Administrator on 2018/1/20.
 */
//网易云热门歌曲歌词
var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var hotMusicLyricSchema = new Schema({
  word:String,
  num:Number
})
//输出模型,第一个参数是名字，第二个是模型内容
//注意在数据库定义的时候一定要加s，在名字后面，这里自动去+s然后匹配数据库中的集合,后面第三个参数(字符串)可以设置和哪个集合关联
module.exports = mongoose.model('hot_music_lyric',hotMusicLyricSchema);
