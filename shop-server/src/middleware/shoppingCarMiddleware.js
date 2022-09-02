const { shoppingCarFormatError } = require('../constant/errorType')

const validator = (rules) => {
  return async (ctx, next) => {
    try {
      ctx.verifyParams(rules)
    } catch (error) {
      console.error(error)
      cartFormatError.result = error
      return ctx.app.emit('error', shoppingCarFormatError, ctx)
    }

    await next()
  }
}
module.exports = {
  validator
}
