const db = require('../utils/db')

class OrderServer {
  // 查找所有订单
  async getAllOrder() {
    let sql = 'select * from order order by order_time desc'
    return await db.query(sql, null)
  }
  // 按条件查找订单
  async getOrderByTerm(key, value) {
    let sql = `select * from orders where ${key} = ? order by order_time desc`
    // let sql = 'select * from orders where ' + key + '= ?'
    return await db.query(sql, [value])
  }
  // 删除订单
  async deleteOrder(user_id, order_id) {
    let sql = `delete from orders where user_id = ? and order_id = ?`
    // let sql = 'select * from orders where ' + key + '= ?'
    return await db.query(sql, [user_id, order_id])
  }
  // 订单付款
  async payOrder(user_id, order_id) {
    let sql =
      'update orders set order_status = 2 where user_id = ? and order_id = ?'
    return await db.query(sql, [user_id, order_id])
  }
  // 查找订单详情
  async getOrderDetails(order_id) {
    let sql = 'select * from order_details where order_id = ?'
    return await db.query(sql, order_id)
  }
  // 未发货订单数
  async countAwaitedOrder() {
    let sql = 'select count(*) from orders where order_status = 2'
    return await db.query(sql, null)
  }
  // 后台查找订单
  async fineSearchOrder(search, start = 0, end = 0) {
    let sql = 'select * from orders where 1 = 1'
    // console.log(start, typeof end)
    if (search.user_id) {
      sql += ` and user_id = ${search.user_id}`
    }
    if (search.order_id) {
      sql += ` and order_id = '${search.order_id}'`
    }
    if (end !== 0) {
      sql += ' order by order_time desc limit ?, ?'
    }
    // console.log(sql)
    return await db.query(sql, [start, end])
  }
  // 修改金额
  async updateOrder(order_id, order_price) {
    let sql = 'update orders set order_price = ? where order_id = ?'
    return await db.query(sql, [order_price, order_id])
  }
  // 订单发货
  async updateOrderExpress(order_id, express) {
    let sqls = []
    let params = []
    let orderSql = 'update orders set order_status = 3 where order_id = ?'
    let expressSql =
      'update order_express set express_id = ? , express_name = ? where order_id = ?'
    sqls.push(orderSql, expressSql)
    params.push(
      [order_id],
      [express.express_id, express.express_name, order_id]
    )
    return await db.transaction(sqls, params)
  }
}

module.exports = new OrderServer()
