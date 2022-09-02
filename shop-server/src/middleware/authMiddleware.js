const jwt = require('jsonwebtoken')

const { JWT_SECRET } = require('../config/default')
const {
  tokenExpiredError,
  invalidTokenError,
  tokenError,
  isNotAdminError
} = require('../constant/errorType')

const auth = async (ctx, next) => {
  // 从请求头获取token
  let { authorization } = ctx.request.header
  const token = authorization.replace('Bearer ', '')
  try {
    //解析token获取用户信息
    let user = jwt.verify(token, JWT_SECRET)
    ctx.state.user = user
  } catch (error) {
    switch (error.name) {
      case 'TokenExpiredError':
        console.error('token已过期', error)
        ctx.app.emit('error', tokenExpiredError, ctx)
        return
      case 'JsonWebTokenError':
        console.error('无效的token', error)
        ctx.app.emit('error', invalidTokenError, ctx)
        return
      default:
        console.error('token出错', error)
        ctx.app.emit('error', tokenError, ctx)
        return
    }
  }
  await next()
}
const isAdmin = async (ctx, next) => {
  const { isAdmin } = ctx.state.user

  if (!isAdmin) {
    console.error('该用户没有管理员的权限', ctx.state.user)
    return ctx.app.emit('error', isNotAdminError, ctx)
  }

  await next()
}
module.exports = { auth, isAdmin }
