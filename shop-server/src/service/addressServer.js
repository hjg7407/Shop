const db = require('../utils/db')

class AddressServer {
  // 获取所有地址
  async getAddress(key, value) {
    let sql = `select * from address where ${key} = ? order by address_default desc`
    return await db.query(sql, value)
  }
  // 获取地址数量
  async countAddress(user_id) {
    let sql = 'select count(*) from address where user_id = ?'
    return await db.query(sql, user_id)
  }
  // 添加地址
  async addAddress({
    user_id,
    address_name,
    address_phone,
    address_details,
    address_default
  }) {
    let sql = 'insert into address values (null ,?, ?, ?, ?, ?)'
    return await db.query(sql, [
      user_id,
      address_name,
      address_phone,
      address_details,
      address_default
    ])
  }
  // 删除地址
  async deleteAddress({ user_id, address_id }) {
    let sql = 'delete from address where user_id = ? and address_id = ?'
    return await db.query(sql, [user_id, address_id])
  }
  // 修改地址
  async updateAddress({
    address_name,
    address_phone,
    address_details,
    address_id,
    user_id
  }) {
    let sql = `update address set address_name = ? , address_phone = ? , address_details = ? 
    where address_id = ? and user_id = ?`
    return await db.query(sql, [
      address_name,
      address_phone,
      address_details,
      address_id,
      user_id
    ])
  }
  // 设置默认地址
  async setDefaultAddress({ address_id, user_id }) {
    let sqls = []
    let params = []
    // 取消原来的默认地址
    let cancelSQL =
      'update address set address_default = 0 where address_default = 1'
    // 设置默认地址
    let setSQL =
      'update address set address_default = 1 where address_id = ? and user_id = ?'
    sqls.push(cancelSQL, setSQL)
    params.push(null, [address_id, user_id])
    console.log(sqls, params, address_id, user_id)
    return await db.transaction(sqls, params)
  }
}
module.exports = new AddressServer()
