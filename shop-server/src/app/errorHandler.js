module.exports = (error, ctx) => {
  let status = 200
  switch (error.code) {
    case '10101':
      status = 401
      break
    case '10102':
      status = 401
      break
    case '10103':
      status = 401
      break
    default:
      status = 200
      break
  }
  ctx.status = status
  ctx.body = error
}
