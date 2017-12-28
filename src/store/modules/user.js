/**
 * Created by Administrator on 2017/12/28.
 */
//用户相关的状态,未登录时为空
//初始状态
const state = {
  username:''
}

//getter,用户获取state
const getters = {
    //获取用户登录的名称
    getUserName: state => state.username
}

//mutations,用于改变state
const mutations = {
    //改变用户名称
    updateUserName:function(state,newName){
        state.username = newName;
    }
};

//actions，异步方法
const actions = {

}

//导出
export default {
  //命名空间模块，不添加是全局的，其他模块也可以用,true时store无法commit本模块的mutation
  //namespaced:true,
  state,
  getters,
  actions,
  mutations
}


