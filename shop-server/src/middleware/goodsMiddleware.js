const { fineCategoryId } = require('../service/goodsServer')
const { fineCategoryIdError } = require('../constant/errorType')

//根据商品分类名获取商品分类id
const getCategoryId = async (ctx, next) => {
  try {
    let { category_name } = ctx.request.body
    let categoryId = await fineCategoryId(category_name)
    // console.log(categoryId)
    ctx.request.body.categoryId = categoryId
  } catch (error) {
    console.error(error)
    ctx.app.emit('error', fineCategoryIdError, ctx)
    return
  }
  await next()
}
//获取排序方式
const getOrder = async (ctx, next) => {
  let { order } = ctx.request.body
  let [orderName, orderSort] = order
  switch (orderName) {
    case 1:
      orderName = 'goods_id'
      break
    case 2:
      orderName = 'goods_sales'
      break
    case 3:
      orderName = 'goods_selling_price'
      break
  }
  ctx.request.body.orderName = orderName
  ctx.request.body.orderSort = orderSort
  await next()
}
module.exports = { getCategoryId, getOrder }
