const db = require('../utils/db')
const {
  getOrderByTerm,
  getOrderDetails,
  deleteOrder,
  payOrder,
  fineSearchOrder,
  updateOrder,
  updateOrderExpress,
  countAwaitedOrder
} = require('../service/orderServer')
const { getAddress } = require('../service/addressServer')
const { getUserItem } = require('../service/usersService')
const {
  getOrderError,
  getOrderDetailsError,
  orderStatusError,
  deleteOrderError,
  payOrderError,
  getAddressError
} = require('../constant/errorType')

class OrderController {
  // 添加订单
  async addOrder(ctx, next) {
    let { user_id } = ctx.state.user
    let { address_id, goodsList, order_status, order_price } = ctx.request.body
    // console.log(goodsList)
    // 获取当前时间戳
    let timeTemp = new Date().getTime()
    // 获取地址详情
    let address = null
    try {
      let result = await getAddress('address_id', address_id)
      address = result[0]
    } catch (error) {
      console.error(error)
      ctx.app.emit('error', getAddressError, ctx)
    }
    // console.log(address)
    // 生成订单id：用户id+时间戳
    let order_id = '' + user_id + timeTemp
    // 初始化SQL语句
    // console.log(user_id, address_id, goodsList, timeTemp, order_id)
    let sqls = []
    // 初始化参数
    let params = []
    for (let value of goodsList) {
      // 修改库存
      let goodsSQL =
        'update goods set goods_number = (goods_number - ?) where goods_id = ?'
      sqls.push(goodsSQL)
      params.push([value.number, value.goods_id])
      //删除购物车
      let carSQL = 'delete from shoppingCar where user_id =? and goods_id =?'
      sqls.push(carSQL)
      params.push([user_id, value.goods_id])
    }
    // console.log(sqls, params)
    //添加订单
    // order必须加反引号，否则与系统关键字冲突报错
    let orderSQL =
      // 'insert into `order` values(null, ?, ?, ?, ?, ?, ?, null, null)'
      'insert into orders values(null, ?, ?, ?, ?, ?)'
    sqls.push(orderSQL)
    params.push([order_id, user_id, timeTemp, order_status, order_price])
    //添加收货人信息
    let { address_name, address_phone, address_details } = address
    let addressSQL = `insert into order_express(order_id, address_name, address_phone, address_details) values(?, ?, ?, ?)`
    sqls.push(addressSQL)
    params.push([order_id, address_name, address_phone, address_details])
    //添加订单详情
    for (let value of goodsList) {
      // console.log(
      //   order_id,
      //   value.goods_id,
      //   value.goods_picture,
      //   value.goods_name,
      //   value.goods_price,
      //   value.number
      // )
      let orderDetailsSQL =
        'insert into order_details values(null, ?, ?, ?, ?, ?, ?)'
      sqls.push(orderDetailsSQL)
      params.push([
        order_id,
        value.goods_id,
        value.goods_picture,
        value.goods_name,
        value.goods_price,
        value.number
      ])
    }
    // console.log(sqls, params)
    //执行事务
    try {
      let result = await db.transaction(sqls, params)
      // console.log(result)
      if ((result.length = sqls.length)) {
        ctx.body = {
          code: '0',
          message: '订单添加成功'
        }
      }
    } catch (error) {
      console.error(error)
      ctx.body = {
        code: '10701',
        message: '订单添加失败'
      }
    }
  }
  // 删除订单
  async deleteOrder(ctx, next) {
    let { user_id } = ctx.state.user
    let { order_id } = ctx.request.body
    // console.log(order_id)
    try {
      let order = await getOrderByTerm('order_id', order_id)
      // console.log(order)
      // 订单未完成
      if (order[0].order_status !== 4 && order[0].order_status !== 5) {
        ctx.app.emit('error', orderStatusError, ctx)
      } else {
        try {
          let result = await deleteOrder(user_id, order_id)
          if (result.affectedRows === 1) {
            ctx.body = {
              code: '0',
              message: '删除订单成功'
            }
          }
        } catch (error) {
          console.error(error)
          ctx.app.emit('error', deleteOrderError, ctx)
        }
      }
    } catch (error) {
      console.error(error)
      ctx.app.emit('error', getOrderError, ctx)
    }
  }
  // 订单付款
  async payOrder(ctx, next) {
    let { user_id } = ctx.state.user
    let { order_id } = ctx.request.body
    try {
      let result = await payOrder(user_id, order_id)
      if (result.affectedRows === 1) {
        ctx.body = {
          code: '0',
          message: '订单付款成功'
        }
      }
    } catch (error) {
      console.error(error)
      ctx.app.emit('error', payOrderError, ctx)
    }
  }
  // 取消订单
  async cancelOrder(ctx, next) {
    let { user_id } = ctx.state.user
    let { order_id } = ctx.request.body
    let orderDetails = null
    try {
      orderDetails = await getOrderDetails(order_id)
    } catch (error) {
      console.error(error)
      ctx.app.emit('error', getOrderDetailsError, ctx)
    }
    // console.log(orderDetails)
    let sqls = []
    let params = []
    // 返还库存
    for (let value of orderDetails) {
      let sql =
        'update goods set goods_number = (goods_number + ?) where goods_id = ?'
      sqls.push(sql)
      params.push([value.goods_number, value.goods_id])
    }
    // 修改订单状态
    let sql =
      'update orders set order_status = 5 where user_id = ? and order_id = ?'
    sqls.push(sql)
    params.push([user_id, order_id])
    //执行事务
    try {
      let result = await db.transaction(sqls, params)
      // console.log(result)
      if ((result.length = sqls.length)) {
        ctx.body = {
          code: '0',
          message: '订单取消成功'
        }
      }
    } catch (error) {
      console.error(error)
      ctx.body = {
        code: '10706',
        message: '订单取消出错'
      }
    }
  }
  // 确认收货
  async confirmOrder(ctx, next) {
    let { user_id } = ctx.state.user
    let { order_id } = ctx.request.body
    let orderDetails = null
    try {
      orderDetails = await getOrderDetails(order_id)
    } catch (error) {
      console.error(error)
      ctx.app.emit('error', getOrderDetailsError, ctx)
    }
    // console.log(orderDetails)
    let sqls = []
    let params = []
    // 增加销量
    for (let value of orderDetails) {
      let sql =
        'update goods set goods_sales = (goods_sales + ?) where goods_id = ?'
      sqls.push(sql)
      params.push([value.goods_number, value.goods_id])
    }
    // 修改订单状态
    let sql =
      'update orders set order_status = 4 where user_id = ? and order_id = ?'
    sqls.push(sql)
    params.push([user_id, order_id])
    //执行事务
    try {
      let result = await db.transaction(sqls, params)
      // console.log(result)
      if ((result.length = sqls.length)) {
        ctx.body = {
          code: '0',
          message: '确认收货成功'
        }
      }
    } catch (error) {
      console.error(error)
      ctx.body = {
        code: '10707',
        message: '确认收货出错'
      }
    }
  }
  // 查找订单
  async getOrder(ctx, next) {
    let { user_id } = ctx.state.user
    try {
      let orderList = await getOrderByTerm('user_id', user_id)
      // console.log(user_id, orderList)
      for (let value of orderList) {
        try {
          // console.log(value)
          let goodsList = await getOrderDetails(value.order_id)
          value.goodsList = goodsList
          // console.log(value)
        } catch (error) {
          console.error(error)
          ctx.app.emit('error', getOrderDetailsError, ctx)
        }
      }
      ctx.body = {
        code: 0,
        message: '订单获取成功',
        orderList
      }
    } catch (error) {
      console.error(error)
      ctx.app.emit('error', getOrderError, ctx)
    }
  }
  // 未发货订单数
  async awaitedOrder(ctx, next) {
    let result = await countAwaitedOrder()
    ctx.body = {
      code: '0',
      message: '获取未发货订单数量成功',
      number: result[0]['count(*)']
    }
  }
  // 根据条件获取订单
  async searchOrder(ctx, next) {
    let { search, currentPage, pageSize } = ctx.request.body
    // console.log(search, currentPage, pageSize)
    // 计算开始索引
    const start = (currentPage - 1) * pageSize
    if (!search.username) {
      search.user_id = ''
    } else {
      try {
        let result = await getUserItem('user_id', 'username', search.username)
        // console.log(result)
        if (result.length > 0) {
          search.user_id = result[0].user_id
        } else {
          search.user_id = ''
        }
        // console.log(search.user_id)
      } catch (error) {
        console.error(error)
        return
      }
    }
    try {
      let orderList = await fineSearchOrder(search, start, pageSize)
      let total = (await fineSearchOrder(search)).length
      for (let item of orderList) {
        // console.log(item)
        try {
          let result = await getUserItem('username', 'user_id', item.user_id)
          item.username = result[0].username
        } catch (error) {
          console.error(error)
          return
        }
      }
      ctx.body = {
        code: '0',
        message: '获取订单信息成功',
        orderList,
        total
      }
    } catch (error) {
      console.error(error)
      return
    }
  }
  // 修改金额
  async modifyOrder(ctx, next) {
    let { order_id, order_price } = ctx.request.body
    // console.log(order_id, typeof order_price)
    try {
      let result = await updateOrder(order_id, Number(order_price))
      if (result.affectedRows === 1) {
        ctx.body = {
          code: '0',
          message: '修改金额成功'
        }
      }
    } catch (error) {
      console.error(error)
      return
    }
  }
  // 订单发货
  async shippingOrder(ctx, next) {
    let { order_id, express } = ctx.request.body
    console.log(order_id, express)
    try {
      let result = await updateOrderExpress(order_id, express)
      // console.log(result)
      if (result.length === 2) {
        ctx.body = {
          code: '0',
          message: '订单发货成功'
        }
      }
    } catch (error) {
      console.error(error)
      return
    }
  }
}
module.exports = new OrderController()
