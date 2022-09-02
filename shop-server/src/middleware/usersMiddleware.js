const bcrypt = require('bcryptjs')

const {
  userNameIsNullError,
  userNameLengthError,
  userNameError,
  phoneError,
  passwordIsNullError,
  passwordLengthError,
  userExistedError,
  registerError,
  userInfoError,
  loginInfoError,
  loginError
} = require('../constant/errorType')

const {
  queryUser,
  findUserInfo,
  getUserItem
} = require('../service/usersService')

// 注册信息检查
const registerValidator = async (ctx, next) => {
  let { username, password, phone } = ctx.request.body
  //检查用户名信息
  username = username.trim()
  let usernameReg = /([^\w\u4e00-\u9fa5])+/
  if (!username) {
    ctx.app.emit('error', userNameIsNullError, ctx)
    return
  } else if (username.length > 10) {
    ctx.app.emit('error', userNameLengthError, ctx)
    return
  } else if (usernameReg.test(username)) {
    ctx.app.emit('error', userNameError, ctx)
    return
  }

  //检查手机号信息
  let phoneReg = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/
  if (!phoneReg.test(phone)) {
    ctx.app.emit('error', phoneError, ctx)
    return
  }
  //检查密码信息
  if (!password) {
    ctx.app.emit('error', passwordIsNullError, ctx)
    return
  } else if (password.length < 6 || password.length > 20) {
    ctx.app.emit('error', passwordLengthError, ctx)
    return
  }
  await next()
}

// 验证用户是否存在
const verifyUser = async (ctx, next) => {
  let { username, phone } = ctx.request.body
  try {
    let result = await queryUser({ username, phone })
    if (result.length > 0) {
      ctx.app.emit('error', userExistedError, ctx)
      return
    }
  } catch (error) {
    ctx.app.emit('error', registerError, ctx)
    console.error(error)
    return
  }
  await next()
}

// 密码加密
const passwordCrpyt = async (ctx, next) => {
  let { password } = ctx.request.body
  let salt = bcrypt.genSaltSync(10)
  //用随机盐加密密码
  let hash = bcrypt.hashSync(password, salt)
  ctx.request.body.password = hash

  await next()
}

// 登录信息检查
const loginValidator = async (ctx, next) => {
  let { username, password } = ctx.request.body
  if (!username || !password) {
    ctx.app.emit('error', userInfoError, ctx)
    return
  }
  await next()
}

// 验证用户信息是否正确
const verifyLogin = async (ctx, next) => {
  let { username, password } = ctx.request.body
  try {
    //查询用户是否存在
    let result = await findUserInfo(username)
    if (result.length === 0) {
      ctx.app.emit('error', loginInfoError, ctx)
      return
    } else {
      //验证用户密码是否正确
      if (!bcrypt.compareSync(password, result[0].password)) {
        ctx.app.emit('error', loginInfoError, ctx)
        return
      }
    }
  } catch (error) {
    console.error(error)
    ctx.app.emit('error', loginError, ctx)
  }
  await next()
}
// 修改密码信息检查
const passwordValidator = async (ctx, next) => {
  let { oldPassword, newPassword } = ctx.request.body
  //检查密码信息
  if (!oldPassword || !newPassword) {
    ctx.app.emit('error', passwordIsNullError, ctx)
    return
  } else if (
    oldPassword.length < 6 ||
    oldPassword.length > 20 ||
    newPassword.length < 6 ||
    newPassword.length > 20
  ) {
    ctx.app.emit('error', passwordLengthError, ctx)
    return
  }
  await next()
}
// 验证旧密码并加密新密码
const verifyPassword = async (ctx, next) => {
  let { user_id } = ctx.state.user
  let { oldPassword, newPassword } = ctx.request.body
  try {
    let result = await getUserItem('password', 'user_id', user_id)
    // console.log(result[0].password)
    //验证用户密码是否正确
    if (!bcrypt.compareSync(oldPassword, result[0].password)) {
      ctx.body = {
        code: '10012',
        message: '原密码错误，请重新输入！'
      }
      return
    }
  } catch (error) {
    console.error(error)
    return
  }
  let salt = bcrypt.genSaltSync(10)
  //用随机盐加密密码
  let hash = bcrypt.hashSync(newPassword, salt)
  ctx.request.body.newPassword = hash

  await next()
}

module.exports = {
  registerValidator,
  verifyUser,
  passwordCrpyt,
  loginValidator,
  verifyLogin,
  passwordValidator,
  verifyPassword
}
