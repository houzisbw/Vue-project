/**
 * Created by Administrator on 2017/12/27.
 */
//用户数据模型
var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    username:String,
    password:String,
    email:String,
    //书签数组,元素是对象
    bookMark:[{
      url:String,
      title:String,
      isPublic:String,
      screenShotName:String,
      type:Array
    }]
});
//这里第一个参数是数据库collection的名字(users)，User=>users，会自动映射
module.exports = mongoose.model('User',userSchema)
