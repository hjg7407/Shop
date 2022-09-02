const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const { registerError, loginError } = require('../constant/errorType')
const {
  createUser,
  updatePassword,
  findUserInfo,
  fineSearchUser,
  resetPassword,
  deleteUser
} = require('../service/usersService')
const { JWT_SECRET } = require('../config/default')

class UsersController {
  // 注册
  async register(ctx, next) {
    const { username, phone, password } = ctx.request.body

    try {
      let result = await createUser({ username, phone, password })
      if (result.affectedRows === 1) {
        ctx.body = {
          code: '0',
          message: '注册成功,请登录',
          result: ''
        }
        // console.log(ctx.body)
      }
    } catch (error) {
      console.error(error)
      ctx.app.emit('error', registerError, ctx)
    }
  }
  // 登录
  async login(ctx, next) {
    let { username } = ctx.request.body
    try {
      let result = await findUserInfo(username.trim())
      let { password, ...payload } = result[0]
      ctx.body = {
        code: '0',
        message: '登录成功,欢迎回来',
        //生成令牌并返回,token 2h过期
        token: jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' }),
        username
      }
    } catch (error) {
      console.error(error)
      ctx.app.emit('error', loginError, ctx)
    }
  }
  // 修改密码
  async updatePassword(ctx, next) {
    let { user_id } = ctx.state.user
    let { newPassword } = ctx.request.body
    try {
      let result = await updatePassword(user_id, newPassword)
      if (result.affectedRows === 1) {
        ctx.body = {
          code: '0',
          message: '修改密码成功,请重新登录！'
        }
      }
    } catch (error) {
      console.error(error)
      return
    }
  }
  // 管理员登录
  async adminLogin(ctx, next) {
    let { username } = ctx.request.body
    try {
      let result = await findUserInfo(username.trim())
      if (result[0].isAdmin === 0) {
        ctx.body = {
          code: '10012',
          message: '您不是管理员，不能登录！'
        }
        return
      }
      let { password, ...payload } = result[0]
      ctx.body = {
        code: '0',
        message: '登录成功,欢迎回来',
        //生成令牌并返回,token 2h过期
        token: jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' }),
        username
      }
    } catch (error) {
      console.error(error)
      ctx.app.emit('error', loginError, ctx)
    }
  }
  // 根据条件获取用户信息
  async searchUser(ctx, next) {
    let { search, currentPage, pageSize } = ctx.request.body
    // console.log(search, currentPage, pageSize)
    // 计算开始索引
    const start = (currentPage - 1) * pageSize
    try {
      let userList = await fineSearchUser(search, start, pageSize)
      let total = (await fineSearchUser(search)).length
      ctx.body = {
        code: '0',
        message: '获取用户信息成功',
        userList,
        total
      }
    } catch (error) {
      console.error(error)
      return
    }
  }
  // 重置密码
  async resetPassword(ctx, next) {
    let { user_id } = ctx.request.body
    // console.log(user_id)
    let salt = bcrypt.genSaltSync(10)
    //用随机盐加密默认密码
    let password = bcrypt.hashSync('123456', salt)
    // console.log(password)
    try {
      let result = await resetPassword(user_id, password)
      // console.log(result)
      if (result.affectedRows === 1) {
        ctx.body = {
          code: '0',
          message: '重置密码成功'
        }
      }
    } catch (error) {
      console.error(error)
      return
    }
  }
  // 注销用户
  async deleteUser(ctx, next) {
    let { user_id } = ctx.request.body
    // console.log(user_id)
    try {
      let result = await deleteUser(user_id)
      console.log(result)
      if (result.affectedRows === 1) {
        ctx.body = {
          code: '0',
          message: '注销用户成功'
        }
      }
    } catch (error) {
      console.error(error)
      return
    }
  }
}

module.exports = new UsersController()
