const { addressFormatError } = require('../constant/errorType')

const validator = async (ctx, next) => {
  try {
    ctx.verifyParams({
      address_name: { type: 'string', required: true },
      address_phone: { type: 'string', required: true },
      address_details: { type: 'string', required: true }
    })
  } catch (err) {
    console.error(err)
    addressFormatError.result = err
    return ctx.app.emit('error', addressFormatError, ctx)
  }

  await next()
}
module.exports = {
  validator
}
