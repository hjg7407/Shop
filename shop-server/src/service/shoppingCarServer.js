const db = require('../utils/db')

class ShoppingCarServer {
  //查找购物车数据
  async fineShoppingCar(user_id, goods_id) {
    let sql = 'select * from shoppingCar where user_id = ? and goods_id = ?'
    return await db.query(sql, [user_id, goods_id])
  }
  //添加购物车
  async addShoppingCar(user_id, goods_id) {
    let sql = 'insert into shoppingCar values(null,?,?,1)'
    return await db.query(sql, [user_id, goods_id])
  }
  //更新购物车数量
  async updateShoppingCar({ number, user_id, goods_id }) {
    let sql =
      'update shoppingCar set number = ? where user_id = ? and goods_id = ?'
    return await db.query(sql, [number, user_id, goods_id])
  }
  //查找所有购物车数据
  async fineAllList(user_id) {
    let sql = 'select * from shoppingCar where user_id = ?'
    return await db.query(sql, [user_id])
  }
  //删除购物车
  async deleteShoppingCar({ user_id, goods_id }) {
    let sql = 'delete from shoppingCar where user_id =? and goods_id =?'
    return await db.query(sql, [user_id, goods_id])
  }
}

module.exports = new ShoppingCarServer()
