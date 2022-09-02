const Router = require('koa-router')
const {
  registerValidator,
  verifyUser,
  passwordCrpyt,
  loginValidator,
  verifyLogin,
  passwordValidator,
  verifyPassword
} = require('../../middleware/usersMiddleware')

const { auth } = require('../../middleware/authMiddleware')

const {
  register,
  login,
  updatePassword
} = require('../../controller/usersController')

const users = new Router({ prefix: '/users' })

// 注册接口
users.post('/register', registerValidator, verifyUser, passwordCrpyt, register)
// 登录接口
users.post('/login', loginValidator, verifyLogin, login)
// 修改密码接口
users.post(
  '/changePassword',
  auth,
  passwordValidator,
  verifyPassword,
  updatePassword
)

module.exports = users
