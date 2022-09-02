//引入axios
import axios from 'axios' // npm i axios
//引入dayjs
import dayjs from 'dayjs' //npm i dayjs
// 引入路由
import router from './router'

export default {
  install(Vue) {
    // 封装成功的提示框
    // 不能用箭头函数，否则this指向Vue
    Vue.prototype.$successedMessage = function (message) {
      this.$message({
        showClose: true,
        message: message,
        type: 'success',
        center: true
      })
    }
    // 封装失败的提示框
    Vue.prototype.$errorMessage = function (message) {
      this.$message({
        showClose: true,
        message: message,
        type: 'error',
        center: true
      })
    }
    //向Vue的原型对象上添加axios
    Vue.prototype.$axios = axios.create({
      //请求不能超过10S
      timeout: 10000
    })
    //允许跨域携带cookie
    Vue.prototype.$axios.withDirectives = true

    //全局请求拦截器
    Vue.prototype.$axios.interceptors.request.use(
      (config) => {
        let token = localStorage.getItem('Token')
        if (token) {
          //将token放到请求头发送给服务器,将tokenkey放在请求头中
          config.headers.Authorization = token
        }
        return config
      },
      (error) => {
        // 跳转error页面
        return Promise.reject(error)
      }
    )
    //全局响应拦截器
    Vue.prototype.$axios.interceptors.response.use(
      (resolve) => {
        return resolve
      },
      (error) => {
        if (error.response.status === 401) {
          // 401表示没有登录，清除token
          localStorage.removeItem('Token')
          //跳转到登录界面
          router.push({
            path: '/login',
            query: {
              redirect: router.currentRoute.fullPath
            }
          })
        }
        // 跳转error页面
        console.error(error)
        return Promise.reject(error)
      }
    )

    //向Vue的原型对象上添加baseURL，用于拼接链接(值为后台服务器链接)
    Vue.prototype.$baseURL = 'http://localhost:3000'

    // 全局过滤器
    Vue.filter('numFilter', function (value) {
      return value.toFixed(2)
    })
    Vue.filter('dateFilter', function (value) {
      return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
    })
  }
}
