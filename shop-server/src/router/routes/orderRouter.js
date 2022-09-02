const Router = require('koa-router')

const { auth } = require('../../middleware/authMiddleware')
const {
  addOrder,
  deleteOrder,
  payOrder,
  cancelOrder,
  confirmOrder,
  getOrder
} = require('../../controller/orderController')

const order = new Router({ prefix: '/order' })

// 添加订单
order.post('/addOrder', auth, addOrder)
// 删除订单
order.post('/deleteOrder', auth, deleteOrder)
// 订单付款
order.post('/payOrder', auth, payOrder)
// 取消订单
order.post('/cancelOrder', auth, cancelOrder)
// 确认订单
order.post('/confirmOrder', auth, confirmOrder)
// 获取订单
order.get('/getOrderList', auth, getOrder)

module.exports = order
