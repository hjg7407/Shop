//引入Vue核心库
import Vue from 'vue'
//引入Vuex
import Vuex from 'vuex' //npm i vuex@3
import persistedState from 'vuex-persistedstate' //npm i vuex-persistedstate

//引入模块
import user from './modules/user'
import shoppingCar from './modules/shoppingCar'

//应用Vuex插件
Vue.use(Vuex)

//创建并暴露store
export default new Vuex.Store({
  modules: {
    user,
    shoppingCar
  },
  plugins: [persistedState()] //添加插件，页面刷新时不重置vuex仓库数据
})
