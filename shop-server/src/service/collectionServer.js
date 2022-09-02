const db = require('../utils/db')
class CollectionServer {
  //查找收藏表数据
  async findCollection(user_id, goods_id) {
    let sql = 'select * from collection where user_id = ? and goods_id = ?'
    return await db.query(sql, [user_id, goods_id])
  }
  //添加收藏
  async addCollection(obj) {
    let { user_id, goods_id, timeTemp } = obj
    let sql = 'insert into collection values(null,?,?,?)'
    return await db.query(sql, [user_id, goods_id, timeTemp])
  }
  //查找所有收藏列表
  async fineAllCollection(user_id) {
    let sql = 'select * from collection where user_id = ?'
    return await db.query(sql, [user_id])
  }
  //删除收藏
  async deleteCollection(user_id, goods_id) {
    let sql = 'delete from collection where user_id= ? and goods_id= ?'
    return await db.query(sql, [user_id, goods_id])
  }
}
module.exports = new CollectionServer()
