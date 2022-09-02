export default {
  namespaced: true,
  //准备actions对象——响应组件中用户的动作
  actions: {},
  //准备mutations对象——修改state中的数据
  mutations: {
    SetUsername(state, data) {
      state.username = data
    }
  },
  //准备state对象——保存具体的数据
  state: {
    //用户名
    username: ''
  }
}
