const static = require('koa-static')
const path = require('path')
const { STATIC_PATH, APP_PORT } = require('./config/default')

//路径写成./app时，文件夹app与app.js重名会把app当作app.js导入导致出错
const app = require('./app/index')
//获取静态资源文件夹
app.use(static(path.join(__dirname, STATIC_PATH)))
// 监听端口，当有请求时交给app处理
app.listen(APP_PORT, () => {
  console.log(`Server is running in http://localhost:${APP_PORT}`)
})
