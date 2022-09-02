import Vue from 'vue'
import App from './App.vue'
//引入ElementUI组件库npm i element-ui -S
import ElementUI from 'element-ui'
//引入ElementUI全部样式
import 'element-ui/lib/theme-chalk/index.css'
//引入vue-router路由插件npm i vue-router@3
import VueRouter from 'vue-router'
//引入路由器
import router from './router'
//引入store仓库
import store from './store'
//引入自定义插件
import plugins from './plugins'

//关闭生产提示
Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(plugins)

new Vue({
  render: (h) => h(App),
  router,
  store,
  //安装全局事件总线
  beforeCreate() {
    Vue.prototype.$bus = this
  }
}).$mount('#app')
